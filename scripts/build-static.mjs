import { cpSync, mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = resolve(dirname(fileURLToPath(import.meta.url)));
const repoRoot = resolve(scriptDir, "..");
const distDir = resolve(repoRoot, "dist");

const entries = [
  ["index.html", "index.html"],
  ["index-cn.html", "index-cn.html"],
  ["assets", "assets"],
];

rmSync(distDir, { force: true, recursive: true });
mkdirSync(distDir, { recursive: true });

for (const [source, target] of entries) {
  cpSync(resolve(repoRoot, source), resolve(distDir, target), {
    recursive: true,
  });
}

console.log(`Built static site into ${distDir}`);
