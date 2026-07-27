import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const sourceRoot = path.resolve("src");
const violations = [];

for (const file of walk(sourceRoot).filter(candidate => candidate.endsWith(".css"))) {
  violations.push(
    `${relative(file)} usa una hoja CSS; los estilos de src deben implementarse con styled-components.`
  );
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

function walkDirectories(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    if (!entry.isDirectory()) return [];
    const target = path.join(directory, entry.name);
    return [target, ...walkDirectories(target)];
  });
}

function relative(file) {
  return path.relative(process.cwd(), file).replaceAll("\\", "/");
}

function featureOf(file) {
  const match = relative(file).match(/^src\/features\/([^/]+)\//);
  return match?.[1] ?? null;
}

function containsJsx(node) {
  let found = false;
  function visit(current) {
    if (
      ts.isJsxElement(current) ||
      ts.isJsxSelfClosingElement(current) ||
      ts.isJsxFragment(current)
    ) {
      found = true;
      return;
    }
    ts.forEachChild(current, visit);
  }
  visit(node);
  return found;
}

for (const file of walk(sourceRoot).filter(candidate => /\.(ts|tsx)$/.test(candidate))) {
  const text = fs.readFileSync(file, "utf8");
  if (path.basename(file) === "index.ts" && !text.trim()) {
    violations.push(
      `${relative(file)} es un barrel vacío; elimínalo hasta que exista una interfaz.`
    );
  }
  const ast = ts.createSourceFile(
    file,
    text,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  );
  const implementedComponents = ast.statements.filter(statement => {
    if (
      ts.isFunctionDeclaration(statement) &&
      statement.name &&
      /^[A-Z]/.test(statement.name.text)
    ) {
      return containsJsx(statement);
    }
    if (ts.isVariableStatement(statement)) {
      return statement.declarationList.declarations.some(
        declaration =>
          ts.isIdentifier(declaration.name) &&
          /^[A-Z]/.test(declaration.name.text) &&
          containsJsx(declaration)
      );
    }
    return false;
  });
  if (implementedComponents.length > 1) {
    violations.push(
      `${relative(file)} implementa ${implementedComponents.length} componentes; el máximo es uno.`
    );
  }
  if (implementedComponents.length === 1 && text.split(/\r?\n/).length > 350) {
    violations.push(`${relative(file)} supera 350 líneas; extrae comportamiento o composición.`);
  }

  const sourceFeature = featureOf(file);
  const isTestFile = /\.test\.[jt]sx?$/.test(file);
  let importedOrganisms = 0;
  for (const statement of ast.statements.filter(ts.isImportDeclaration)) {
    const specifier = statement.moduleSpecifier.text;
    if (typeof specifier !== "string" || !specifier.startsWith(".")) continue;
    const resolved = path.resolve(path.dirname(file), specifier);
    const targetFeature = featureOf(resolved);
    if (
      sourceFeature &&
      targetFeature &&
      sourceFeature !== targetFeature &&
      /\/(ui|domain|application|infrastructure)(\/|$)/.test(resolved.replaceAll("\\", "/"))
    ) {
      violations.push(
        `${relative(file)} importa internals de ${targetFeature}; usa su index.ts público.`
      );
    }
    const normalizedFile = relative(file);
    const normalizedTarget = resolved.replaceAll("\\", "/");
    if (normalizedTarget.includes("/shared/ui/organisms/")) importedOrganisms += 1;
    if (normalizedFile.startsWith("src/shared/") && normalizedTarget.includes("/src/features/")) {
      violations.push(`${relative(file)} hace que shared dependa de una feature.`);
    }
    const domainUsesFramework = specifier === "react" || specifier.startsWith("react/");
    const domainUsesOuterLayer = ["/ui/", "/platform/", "/infrastructure/"].some(segment =>
      normalizedTarget.includes(segment)
    );
    if (
      !isTestFile &&
      normalizedFile.includes("/domain/") &&
      (domainUsesFramework || domainUsesOuterLayer)
    ) {
      violations.push(`${relative(file)} rompe la independencia de Domain.`);
    }
    if (normalizedFile.includes("/infrastructure/") && normalizedTarget.includes("/ui/")) {
      violations.push(`${relative(file)} hace que Infrastructure dependa de UI.`);
    }
    if (normalizedFile.includes("/ui/") && normalizedTarget.includes("/platform/")) {
      violations.push(`${relative(file)} hace I/O mediante Platform desde UI.`);
    }
  }
  if (relative(file).includes("/shared/ui/organisms/") && importedOrganisms > 1) {
    violations.push(`${relative(file)} compone más de un organismo compartido.`);
  }
}

for (const directory of walkDirectories(sourceRoot)) {
  if (fs.readdirSync(directory).length === 0) {
    violations.push(`${relative(directory)} es un directorio vacío.`);
  }
}

if (violations.length) {
  console.error(violations.map(item => `- ${item}`).join("\n"));
  process.exit(1);
}
console.log("Arquitectura válida: componentes, capas e imports cumplen las restricciones.");
