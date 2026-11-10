// The deploy step after the build: tools/stamp_assets.py (repository root) fingerprints the CSS/JS that the pages
// reference. Once, a root-absolute stylesheet in 404.html's <noscript> made it stop («missing asset ...»), so the
// documented pipeline could not deploy the build. This runs the build output through the tool, on a copy, and checks
// that it exits cleanly and that every local CSS/JS reference of every page, in either quote style, names a file that
// exists (page-relative from the page; 404.html and root-absolute ones from the site root), and that every photo
// reference points into the one versioned photo set (assets/photo/v<hash>/) the tool made.
// usage: node src/tests/stamp.test.js docs [path/to/stamp_assets.py]   (default: $STAMP_TOOL, else ../../tools/stamp_assets.py,
// the repository's own when src/ sits at its root). A missing tool is a failure (it once printed SKIP and exited 0,
// so a «tests green» run outside the repository never checked the deploy step); STAMP_SKIP=1 skips on purpose. Outside
// the repository pass the tool: node src/tests/stamp.test.js docs /path/to/repo/tools/stamp_assets.py
const fs = require("fs"), path = require("path"), os = require("os"), { execFileSync } = require("child_process");
const DOCS = path.resolve(process.argv[2] || "docs");
const TOOL = path.resolve(process.argv[3] || process.env.STAMP_TOOL || path.join(__dirname, "../../tools/stamp_assets.py"));
if (!fs.existsSync(TOOL)) {
  if (process.env.STAMP_SKIP === "1") { console.log("SKIP stamp (STAMP_SKIP=1): no tools/stamp_assets.py at", TOOL); process.exit(0); }
  console.log("FAIL stamp: no tools/stamp_assets.py at", TOOL, "- pass its path (node src/tests/stamp.test.js docs <repo>/tools/stamp_assets.py), set STAMP_TOOL, or STAMP_SKIP=1 to skip");
  process.exit(1);
}
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
// The photographs (Safari could pair a new page with the previous deploy's facade): the tool versions the set
// under assets/photo/v<hash>/ and points every page there. Every photo reference of every page (attributes, inline
// styles, the scene's JSON, where the scripts get a stem and add «.avif» / «.webp») names that one version, and the
// file exists in it; no unversioned reference is left.
const PREF = /assets\/photo\/((?:v[0-9a-f]{10}\/)?)(dia|noite)\/([A-Za-z0-9_.-]+)/g, vers = new Set();
let photos = 0;
for (const p of pages) {
  const html = fs.readFileSync(p, "utf8"), rel = path.relative(site, p);
  for (const m of html.matchAll(PREF)) {
    photos++;
    if (!m[1]) { fail(`${rel}: unversioned photo reference assets/photo/${m[2]}/${m[3]}`); continue; }
    vers.add(m[1]);
    const f = path.join(site, "assets/photo", m[1], m[2], m[3]);
    const there = /\.(avif|webp)$/.test(m[3]) ? fs.existsSync(f) : fs.existsSync(f + ".avif") && fs.existsSync(f + ".webp");
    if (!there) fail(`${rel}: assets/photo/${m[1]}${m[2]}/${m[3]} does not exist`);
  }
}
console.log(`${photos} photo references, version(s): ${[...vers].join(" ") || "none"}`);
if (!photos) fail("no photo reference found (the home page draws the entrance from assets/photo)");
// The stylesheets (since the door finish): the street's paving strips are CSS backgrounds (tokens.css, url("../photo/...")).
// Every photo reference of every stylesheet, the fingerprinted copies the pages load included, names the pages' version,
// relative to the sheet, and the file exists; an unversioned one (a facade of this deploy inside a street Safari kept from
// an earlier one) fails.
const sheets = [];
(function walk(d) { for (const f of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, f.name); if (f.isDirectory()) walk(p); else if (f.name.endsWith(".css")) sheets.push(p); } })(site);
const CREF = /url\(\s*["']?([^"')]*?)photo\/((?:v[0-9a-f]{10}\/)?)(dia|noite)\/([A-Za-z0-9_.-]+)["']?\s*\)/g;
let cphotos = 0, loaded = 0;
const used = new Set();
for (const p of pages) for (const m of fs.readFileSync(p, "utf8").matchAll(REF)) if (/\.css$/.test(m[2])) used.add(path.resolve(m[2].startsWith("/") || path.relative(site, p) === "404.html" ? site : path.dirname(p), m[2].replace(/^\//, "")));
for (const s of sheets) {
  const css = fs.readFileSync(s, "utf8"), rel = path.relative(site, s);
  if (used.has(path.resolve(s))) loaded++;
  for (const m of css.matchAll(CREF)) {
    cphotos++;
    if (!m[2]) { fail(`${rel}: unversioned photo reference ${m[1]}photo/${m[3]}/${m[4]}`); continue; }
    vers.add(m[2]);
    const f = path.resolve(path.dirname(s), m[1] + "photo/" + m[2] + m[3] + "/" + m[4]);
    if (!fs.existsSync(f)) fail(`${rel}: ${m[1]}photo/${m[2]}${m[3]}/${m[4]} does not exist`);
  }
}
console.log(`${sheets.length} stylesheets (${loaded} loaded by the pages), ${cphotos} photo references in them, version(s) in all: ${[...vers].join(" ") || "none"}`);
if (!cphotos) fail("no photo reference in any stylesheet (the street's paving strips are CSS backgrounds)");
if (vers.size > 1) fail("the pages and stylesheets point at more than one photo version");
fs.rmSync(tmp, { recursive: true, force: true });
console.log(fails ? `stamp: ${fails} failure(s)` : "stamp: ok");
process.exit(fails ? 1 : 0);
