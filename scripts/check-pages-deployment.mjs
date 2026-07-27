import { readFile } from "node:fs/promises";

const workflow = await readFile(".github/workflows/deploy.yml", "utf8");
const builtIndex = await readFile("dist/index.html", "utf8");

const checks = [
  {
    valid: workflow.includes("actions/checkout@v6"),
    message: "El workflow debe usar actions/checkout@v6.",
  },
  {
    valid: workflow.includes("actions/setup-node@v6"),
    message: "El workflow debe usar actions/setup-node@v6.",
  },
  {
    valid: workflow.includes("actions/upload-pages-artifact@v4"),
    message: "El workflow debe usar actions/upload-pages-artifact@v4.",
  },
  {
    valid: /path:\s*dist/.test(workflow),
    message: "GitHub Pages debe publicar exclusivamente el directorio dist.",
  },
  {
    valid: !builtIndex.includes("main.tsx"),
    message: "dist/index.html no debe referenciar el punto de entrada TypeScript.",
  },
  {
    valid: /(?:src|href)="\.\/assets\//.test(builtIndex),
    message: "dist/index.html debe referenciar los assets compilados por Vite.",
  },
];

const failures = checks.filter(check => !check.valid);
if (failures.length > 0) {
  throw new Error(failures.map(check => check.message).join("\n"));
}

console.log("Despliegue válido: GitHub Pages publicará el build compilado desde dist.");
