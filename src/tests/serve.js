// Test helper: serves the built site (docs/) under /abrazileira/ like GitHub Pages, and keeps every test page
// off the network: the waiting-list endpoint is answered locally (204), anything else external is aborted.
const http = require("http"), fs = require("fs"), path = require("path");
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml",
  ".woff2": "font/woff2", ".png": "image/png", ".json": "application/json", ".webmanifest": "application/manifest+json",
  ".txt": "text/plain", ".xml": "application/xml", ".avif": "image/avif", ".webp": "image/webp", ".jpg": "image/jpeg" };
module.exports = function serve(dir) {
  return new Promise((resolve) => {
    const srv = http.createServer((q, r) => {
      let p = decodeURIComponent(q.url.split("?")[0]);
      if (!p.startsWith("/abrazileira/")) { r.writeHead(404); return r.end(); }
      p = p.slice("/abrazileira".length);
      if (p.endsWith("/")) p += "index.html";
      fs.readFile(path.join(dir, p), (e, d) => {
        if (e) { r.writeHead(404); return r.end("404"); }
        r.writeHead(200, { "content-type": TYPES[path.extname(p)] || "application/octet-stream" });
        r.end(d);
      });
    });
    srv.listen(0, () => resolve({ srv, base: `http://127.0.0.1:${srv.address().port}/abrazileira/` }));
  });
};
module.exports.offline = (page) => page.route("**/*", (rt) => {
  const u = rt.request().url();
  if (u.startsWith("http://127.0.0.1")) return rt.continue();
  if (u.includes("/rest/v1/rpc/join_waitlist")) return rt.fulfill({ status: 204, body: "" });
  return rt.abort();
});
