import { join, normalize } from "path";

const PORT = 5502;

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    let pathname = new URL(req.url).pathname;

    if (!pathname || pathname === "/") {
      pathname = "/Index.html";
    }

    if (pathname.endsWith("/")) {
      pathname += "index.html";
    }

    const decodedPath = decodeURIComponent(pathname);
    const safePath = normalize(decodedPath).replace(/^([\\/])+/, "").replace(/^(\.\.[\\/])+/, "");
    const filePath = safePath ? join(".", safePath) : "./Index.html";

    const file = Bun.file(filePath);
    if (await file.exists()) {
      const contentType = getContentType(filePath);
      return new Response(file, {
        headers: { "Content-Type": contentType }
      });
    }

    return new Response("404 Not Found", { status: 404 });
  }
});

function getContentType(pathname) {
  if (pathname.endsWith(".html")) return "text/html";
  if (pathname.endsWith(".css")) return "text/css";
  if (pathname.endsWith(".js")) return "text/javascript";
  if (pathname.endsWith(".json")) return "application/json";
  if (pathname.endsWith(".svg")) return "image/svg+xml";
  if (pathname.endsWith(".png")) return "image/png";
  if (pathname.endsWith(".jpg") || pathname.endsWith(".jpeg")) return "image/jpeg";
  if (pathname.endsWith(".webp")) return "image/webp";
  if (pathname.endsWith(".ico")) return "image/x-icon";
  if (pathname.endsWith(".mp4")) return "video/mp4";
  if (pathname.endsWith(".webm")) return "video/webm";
  if (pathname.endsWith(".woff2")) return "font/woff2";
  if (pathname.endsWith(".woff")) return "font/woff";
  return "application/octet-stream";
}

console.log(`✓ Server running at http://localhost:${PORT}`);
