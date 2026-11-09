// The deploy step after the build: tools/stamp_assets.py (repository root) fingerprints the CSS/JS that the pages
// reference. Review r1: a root-absolute stylesheet in 404.html's <noscript> made it stop («missing asset ...»), so the
// documented pipeline could not deploy the build. This runs the build output through the tool, on a copy, and checks
// that it exits cleanly and that every local CSS/JS reference of every page, in either quote style, names a file that
// exists (page-relative from the page; 404.html and root-absolute ones from the site root).
// usage: node src/tests/stamp.test.js docs [path/to/stamp_assets.py]   (default: ../../tools/stamp_assets.py)
const fs = require("fs"), path = require("path"), os = require("os"), { execFileSync } = require("child_process");
const DOCS = path.resolve(process.argv[2] || "docs");
const TOOL = path.resolve(process.argv[3] || process.env.STAMP_TOOL || path.join(__dirname, "../../tools/stamp_assets.py"));
if (!fs.existsSync(TOOL)) { console.log("SKIP stamp: no tools/stamp_assets.py at", TOOL); process.exit(0); }
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "stamp-"));
const site = path.join(tmp, "docs");
fs.cpSync(DOCS, site, { recursive: true });
let fails = 0;
const fail = (m) => { fails++; console.log("FAIL", m); };
try {
  const out = execFileSync("python3", ["-I", TOOL, site], { encoding: "utf8" });
  console.log(out.trim().split("\n").slice(-1)[0]);
} catch (e) { fail("stamp_assets.py exited " + e.status + ": " + String(e.stdout || "") + String(e.stderr || "")); }
const pages = [];
(function walk(d) { for (const f of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, f.name); if (f.isDirectory()) walk(p); else if (f.name.endsWith(".html")) pages.push(p); } })(site);
const REF = /(?:href|src)=(["'])((?!https?:|\/\/|data:|#|mailto:)[^"'?#]+\.(?:css|js))(?:\?v=[0-9a-f]+)?\1/g;
let refs = 0, stamped = 0;
for (const p of pages) {
  const html = fs.readFileSync(p, "utf8"), rel = path.relative(site, p);
  for (const m of html.matchAll(REF)) {
    const u = m[2], base = u.startsWith("/") || rel === "404.html" ? site : path.dirname(p);
    const f = path.join(base, u.replace(/^\//, ""));
    refs++;
    if (!fs.existsSync(f)) fail(`${rel}: ${u} does not exist`);
    if (/\.[0-9a-f]{10}\.(css|js)$/.test(u)) stamped++;
  }
}
console.log(`${pages.length} pages, ${refs} CSS/JS references (${stamped} fingerprinted), all present: ${fails ? "no" : "yes"}`);
if (!stamped) fail("nothing was fingerprinted");
fs.rmSync(tmp, { recursive: true, force: true });
console.log(fails ? `stamp: ${fails} failure(s)` : "stamp: ok");
process.exit(fails ? 1 : 0);
