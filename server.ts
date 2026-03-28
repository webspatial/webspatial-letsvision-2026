import { stat } from "node:fs/promises";
import { join, resolve, sep } from "node:path";

const rootDir = process.cwd();
const rootPrefix = rootDir.endsWith(sep) ? rootDir : `${rootDir}${sep}`;
const port = Number(process.env.PORT ?? 4173);

function resolvePath(pathname: string) {
  try {
    const decoded = decodeURIComponent(pathname);
    const absolutePath = resolve(rootDir, `.${decoded}`);

    if (absolutePath !== rootDir && !absolutePath.startsWith(rootPrefix)) {
      return null;
    }

    return absolutePath;
  } catch {
    return null;
  }
}

async function resolveFile(pathname: string) {
  const absolutePath = resolvePath(pathname);
  if (!absolutePath) {
    return null;
  }

  try {
    let filePath = absolutePath;
    let fileStat = await stat(filePath);

    if (fileStat.isDirectory()) {
      filePath = join(filePath, "index.html");
      fileStat = await stat(filePath);
    }

    if (!fileStat.isFile()) {
      return null;
    }

    return { filePath, fileStat };
  } catch {
    return null;
  }
}

const server = Bun.serve({
  port,
  async fetch(request) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { Allow: "GET, HEAD" },
      });
    }

    const url = new URL(request.url);
    const resolved = await resolveFile(url.pathname);

    if (!resolved) {
      return new Response("Not Found", { status: 404 });
    }

    const file = Bun.file(resolved.filePath);
    const headers = new Headers({
      "Cache-Control": "no-cache",
      "Content-Length": String(resolved.fileStat.size),
    });

    if (file.type) {
      headers.set("Content-Type", file.type);
    }

    if (request.method === "HEAD") {
      return new Response(null, { status: 200, headers });
    }

    return new Response(file, { status: 200, headers });
  },
});

console.log(`b6plus slide server running at http://localhost:${server.port}`);
