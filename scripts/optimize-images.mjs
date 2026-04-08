import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { basename, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = resolve(fileURLToPath(new URL(".", import.meta.url)));
const repoRoot = resolve(scriptDir, "..");
const sourceDir = join(repoRoot, "images");
const outputDir = join(repoRoot, "assets", "images");
const manifestPath = join(outputDir, "manifest.json");
const htmlFiles = [
  join(repoRoot, "index.html"),
  join(repoRoot, "index-cn.html"),
];

const qrLikeImages = new Set([
  "wechat-group.png",
  "wechat-news.jpeg",
  "website.jpg",
]);

const sourceExtensions = new Set([".png", ".jpg", ".jpeg"]);

function run(command, args) {
  execFileSync(command, args, { stdio: "inherit" });
}

function capture(command, args) {
  return execFileSync(command, args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function formatBytes(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function resizeDimensions(width, height, maxLongEdge) {
  const longEdge = Math.max(width, height);
  if (longEdge <= maxLongEdge) {
    return { width, height };
  }

  const scale = maxLongEdge / longEdge;
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
}

function getImageMetadata(filePath) {
  const output = capture("magick", [
    "identify",
    "-format",
    "%w|%h|%[opaque]",
    filePath,
  ]);
  const [width, height, opaque] = output.split("|");
  return {
    width: Number(width),
    height: Number(height),
    hasAlpha: opaque !== "True",
  };
}

function optimizeImage(fileName) {
  const sourcePath = join(sourceDir, fileName);
  const { width, height, hasAlpha } = getImageMetadata(sourcePath);
  const stem = basename(fileName, extname(fileName));
  const isQrLike = qrLikeImages.has(fileName);
  const maxLongEdge = isQrLike ? 720 : 1920;
  const resized = resizeDimensions(width, height, maxLongEdge);

  const fallbackExt = hasAlpha || isQrLike ? ".png" : ".jpg";
  const fallbackPath = join(outputDir, `${stem}${fallbackExt}`);
  const webpPath = join(outputDir, `${stem}.webp`);
  const avifPath = join(outputDir, `${stem}.avif`);

  const resizeArg = `${maxLongEdge}x${maxLongEdge}>`;

  if (isQrLike) {
    run("cwebp", [
      "-quiet",
      "-mt",
      "-lossless",
      "-z",
      "9",
      sourcePath,
      "-resize",
      String(resized.width),
      String(resized.height),
      "-o",
      webpPath,
    ]);
  } else {
    run("magick", [
      sourcePath,
      "-resize",
      resizeArg,
      "-strip",
      "-define",
      "heic:speed=6",
      "-quality",
      "62",
      avifPath,
    ]);

    run("cwebp", [
      "-quiet",
      "-mt",
      "-q",
      "82",
      sourcePath,
      "-resize",
      String(resized.width),
      String(resized.height),
      "-o",
      webpPath,
    ]);
  }

  if (fallbackExt === ".png") {
    run("magick", [
      sourcePath,
      "-resize",
      resizeArg,
      "-strip",
      "-colors",
      "256",
      "-define",
      "png:compression-level=9",
      "-define",
      "png:compression-filter=5",
      fallbackPath,
    ]);
  } else {
    run("magick", [
      sourcePath,
      "-resize",
      resizeArg,
      "-strip",
      "-sampling-factor",
      "4:4:4",
      "-interlace",
      "Plane",
      "-quality",
      "86",
      fallbackPath,
    ]);
  }

  const sources = [];
  if (!isQrLike) {
    sources.push({
      type: "image/avif",
      path: relative(repoRoot, avifPath).replaceAll("\\", "/"),
    });
  }
  sources.push({
    type: "image/webp",
    path: relative(repoRoot, webpPath).replaceAll("\\", "/"),
  });

  return {
    fileName,
    width: resized.width,
    height: resized.height,
    fallback: {
      type: fallbackExt === ".png" ? "image/png" : "image/jpeg",
      path: relative(repoRoot, fallbackPath).replaceAll("\\", "/"),
    },
    sources,
    inputBytes: statSync(sourcePath).size,
    outputBytes:
      statSync(fallbackPath).size +
      sources.reduce(
        (total, source) => total + statSync(join(repoRoot, source.path)).size,
        0,
      ),
  };
}

function rewriteHtml(manifest) {
  const entries = new Map(Object.entries(manifest));
  const entriesByStem = new Map(
    Object.entries(manifest).map(([fileName, entry]) => [
      basename(fileName, extname(fileName)),
      entry,
    ]),
  );

  for (const htmlFile of htmlFiles) {
    const original = readFileSync(htmlFile, "utf8");
    const withUpdatedPictures = original.replace(
      /^(\s*)<picture>\n(?:\1  <source srcset="assets\/images\/[^"]+" type="[^"]+">\n)+\1  <img src="assets\/images\/([^".]+)\.[^"]+" alt="([^"]+)" width="\d+" height="\d+" loading="lazy" decoding="async">\n\1<\/picture>\s*$/gm,
      (match, indent, stem, alt) => {
        const image = entriesByStem.get(stem);
        if (!image) {
          return match;
        }

        const lines = [`${indent}<picture>`];
        for (const source of image.sources) {
          lines.push(
            `${indent}  <source srcset="${source.path}" type="${source.type}">`,
          );
        }
        lines.push(
          `${indent}  <img src="${image.fallback.path}" alt="${alt}" width="${image.width}" height="${image.height}" loading="lazy" decoding="async">`,
        );
        lines.push(`${indent}</picture>`);
        return lines.join("\n");
      },
    );
    const updated = withUpdatedPictures.replace(
      /^(\s*)<img src="images\/([^"]+)" alt="([^"]+)">\s*$/gm,
      (match, indent, fileName, alt) => {
        const image = entries.get(fileName);
        if (!image) {
          return match;
        }

        const lines = [`${indent}<picture>`];
        for (const source of image.sources) {
          lines.push(
            `${indent}  <source srcset="${source.path}" type="${source.type}">`,
          );
        }
        lines.push(
          `${indent}  <img src="${image.fallback.path}" alt="${alt}" width="${image.width}" height="${image.height}" loading="lazy" decoding="async">`,
        );
        lines.push(`${indent}</picture>`);
        return lines.join("\n");
      },
    );

    writeFileSync(htmlFile, updated);
  }
}

function main() {
  mkdirSync(outputDir, { recursive: true });

  for (const entry of readdirSync(outputDir)) {
    if (entry === ".gitkeep") {
      continue;
    }
    rmSync(join(outputDir, entry), { force: true, recursive: true });
  }

  const manifest = {};
  const sourceFiles = readdirSync(sourceDir)
    .filter((fileName) => sourceExtensions.has(extname(fileName).toLowerCase()))
    .sort((left, right) => left.localeCompare(right, "en"));

  for (const fileName of sourceFiles) {
    manifest[fileName] = optimizeImage(fileName);
  }

  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  rewriteHtml(manifest);

  const inputBytes = Object.values(manifest).reduce(
    (total, entry) => total + entry.inputBytes,
    0,
  );
  const outputBytes = Object.values(manifest).reduce(
    (total, entry) => total + entry.outputBytes,
    0,
  );

  console.log("");
  console.log(`Source images: ${formatBytes(inputBytes)}`);
  console.log(`Optimized output: ${formatBytes(outputBytes)}`);
  console.log(
    `Reduction: ${(((inputBytes - outputBytes) / inputBytes) * 100).toFixed(1)}%`,
  );
}

main();
