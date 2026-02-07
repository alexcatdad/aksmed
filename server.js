const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT || 8080);
const ROOT = __dirname;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8"
};

function send(res, status, body, contentType = "text/plain; charset=utf-8") {
  res.writeHead(status, {
    "Content-Type": contentType,
    "Cache-Control": "no-store"
  });
  res.end(body);
}

const server = http.createServer((req, res) => {
  try {
    const urlPath = decodeURIComponent(req.url.split("?")[0]);
    let requestPath = urlPath === "/" ? "/index.html" : urlPath;
    const filePath = path.resolve(ROOT, `.${requestPath}`);

    if (!filePath.startsWith(ROOT)) {
      return send(res, 403, "Forbidden");
    }

    fs.stat(filePath, (statErr, stat) => {
      if (statErr || !stat.isFile()) {
        return send(res, 404, "Not found");
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME[ext] || "application/octet-stream";

      res.writeHead(200, {
        "Content-Type": contentType,
        "Cache-Control": "no-store"
      });

      const stream = fs.createReadStream(filePath);
      stream.on("error", () => send(res, 500, "Internal server error"));
      stream.pipe(res);
    });
  } catch {
    send(res, 500, "Internal server error");
  }
});

server.listen(PORT, () => {
  console.log(`AKSMED preview server running at http://localhost:${PORT}`);
});
