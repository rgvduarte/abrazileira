"""Render the 1200x630 Open Graph image (Noite) from the real lockup and drawing.

Not part of the build: the shipped image is src/assets/img/og.png (build.py copies it). Run this only to
redraw it, after `python3 src/build.py` (it reads the built tokens.css and site.css):

    python3 src/og.py            # writes og-preview.png to a temporary folder, for review
    python3 src/og.py --replace  # overwrites src/assets/img/og.png

Needs Node with Playwright (`require('playwright')` must resolve from the current directory or NODE_PATH).
"""
import os, subprocess, sys, tempfile

sys.dont_write_bytecode = True
SRC = os.path.dirname(os.path.abspath(__file__))
DOCS = os.path.join(os.path.dirname(SRC), "docs")
sys.path.insert(0, SRC)
import build  # noqa: E402

scene_html, info = build.scene_markup("og")
css = "".join(f'<link rel="stylesheet" href="file://{os.path.join(DOCS, "assets/css", f)}">' for f in ("tokens.css", "site.css"))
html = f"""<!doctype html>
<html lang="pt-PT" data-theme="noite">
<head><meta charset="utf-8">{css}
<style>
html, body {{ width: 1200px; height: 630px; overflow: hidden; }}
body {{ display: block; position: relative; min-height: 0; }}
.og-text {{ position: absolute; inset: 0 auto 44px 0; width: 600px; display: flex; align-items: center; justify-content: center; padding-block-end: 16px; }}
.og-text .lockup {{ font-size: 50px; }}
.og-art {{ position: absolute; inset: 36px 56px 44px 600px; }}   /* the floor line (part of the drawing) runs the full width */
.og-art .entrance {{ position: absolute; inset: 0; min-block-size: 0; max-block-size: none; margin: 0; --scene-reach: 1; }}
.og-art .scene {{ inset-inline-start: 0; }}
.leaf--l, .leaf--r {{ transform: none !important; }}                 /* the rest state: doors ajar */
.hall__light, .hall__flat, .spill {{ opacity: 0 !important; }}
</style></head>
<body>
<div class="og-text">{build.lockup_html('p')}</div>
<div class="og-art"><div class="entrance" style="{info['style']}">{scene_html}</div></div>
</body></html>"""

work = tempfile.mkdtemp(prefix="ab-og-")
page = os.path.join(work, "og.html")
open(page, "w", encoding="utf-8").write(html)
dst = os.path.join(SRC, "assets/img/og.png") if "--replace" in sys.argv else os.path.join(work, "og-preview.png")
js = f"""
const {{ chromium }} = require('playwright');
(async () => {{ const b = await chromium.launch(); const ctx = await b.newContext({{ viewport: {{ width: 1200, height: 630 }}, reducedMotion: 'reduce', colorScheme: 'dark' }});
const pg = await ctx.newPage(); await pg.goto('file://{page}'); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(400);
await pg.screenshot({{ path: {dst!r} }}); await b.close(); }})();
"""
jp = os.path.join(work, "og-render.js")
open(jp, "w").write(js)
subprocess.run(["node", jp], check=True, cwd=os.environ.get("OG_NODE_CWD", os.getcwd()))
print("og rendered:", dst)
