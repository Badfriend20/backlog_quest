import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("src");
const extensions = new Set([".ts", ".tsx", ".json"]);
const corruptedText = /Ã|Â|â€|â€”|â€¦/u;
const failures = [];

async function scan(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await scan(target);
      continue;
    }
    if (!extensions.has(path.extname(entry.name))) continue;
    const lines = (await readFile(target, "utf8")).split(/\r?\n/u);
    lines.forEach((line, index) => {
      if (corruptedText.test(line)) failures.push(`${target}:${index + 1}: ${line.trim()}`);
    });
  }
}

await scan(root);
if (failures.length) {
  console.error("Se detectó texto posiblemente mal codificado:");
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Codificación de textos válida.");
}
