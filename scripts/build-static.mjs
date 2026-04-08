import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = resolve(dirname(fileURLToPath(import.meta.url)));
const repoRoot = resolve(scriptDir, "..");
const distDir = resolve(repoRoot, "dist");
const cnDir = resolve(distDir, "cn");

rmSync(distDir, { force: true, recursive: true });
mkdirSync(distDir, { recursive: true });
mkdirSync(cnDir, { recursive: true });

cpSync(resolve(repoRoot, "index.html"), resolve(distDir, "index.html"));
cpSync(resolve(repoRoot, "assets"), resolve(distDir, "assets"), {
  recursive: true,
});

const cnHtml = readFileSync(resolve(repoRoot, "index-cn.html"), "utf8").replaceAll(
  "assets/",
  "../assets/",
);
writeFileSync(resolve(cnDir, "index.html"), cnHtml);

console.log(`Built static site into ${distDir}`);
