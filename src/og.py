"""Render the 1200x630 Open Graph image (Noite) from the real lockup (the identity board's vertical version: crest,
letters, BOUTIQUE HOTEL) and the photograph of the entrance.

Not part of the build: the shipped image is src/assets/img/og.jpg (build.py copies it). Run this only to redraw
it, after `python3 src/build.py` (it reads the built tokens.css, site.css and photo layers):

    python3 src/og.py            # writes og-preview.jpg to a temporary folder, for review
    python3 src/og.py --replace  # overwrites src/assets/img/og.jpg

Needs Node with Playwright (`require('playwright')` must resolve from the current directory or NODE_PATH).
A photograph is shipped as JPEG (about 10x smaller than the PNG of the same frame); the crawlers that read
og:image all take it. build.py publishes it as og.<content hash>.jpg (link previews cache by URL).

The card is taken only once every picture is decoded (the scene's layers are lazy and decode asynchronously on the
site; here they load eagerly and each one's decode() is awaited), and it is checked before it is written: the photo
area's detail (mean luminance step between neighbouring pixels, 640..1160 x 40..600) must be at least 2.4. A full
render scores 3.4; the card shipped in the identity round, taken before the facade had decoded (the blurred
placeholder wall with the door leaves pasted on it), scored 1.2. A failed check writes nothing and exits 3.
"""
import os, subprocess, sys, tempfile

sys.dont_write_bytecode = True
SRC = os.path.dirname(os.path.abspath(__file__))
DOCS = os.path.join(os.path.dirname(SRC), "docs")
sys.path.insert(0, SRC)
import build  # noqa: E402

scene_html, style = build.scene_markup("file://" + DOCS + "/", motion=False)
css = "".join(f'<link rel="stylesheet" href="file://{os.path.join(DOCS, "assets/css", f)}">' for f in ("tokens.css", "site.css"))
html = f"""<!doctype html>
<html lang="pt-PT" data-theme="noite">
<head><meta charset="utf-8">{css}
<style>
html, body {{ width: 1200px; height: 630px; overflow: hidden; }}
body {{ display: block; position: relative; min-height: 0; }}
.og-text {{ position: absolute; z-index: 2; inset: 0 auto 0 0; width: 600px; display: flex; align-items: center; justify-content: center; padding-block-end: 8px; }}
.og-text .lockup {{ font-size: 80px; }}   /* W 432px: the crest 227px wide, the board's vertical lockup at its largest */
/* the line a little larger than the board's ratio (its tracking gives way, so it is still 0.745 W wide): link previews
   show the card about 500px wide, where the ratio's 19px would be 8px; at 24px it reads at about 10px */
.og-text .lockup__label {{ font-size: 5.6cqi; }}
.og-art {{ position: absolute; inset: 14px 40px -8px 560px; }}   /* the photo's faded foot may leave the frame */
.og-art .entrance {{ position: absolute; inset: 0; min-block-size: 0; max-block-size: none; margin: 0; --scene-reach: 1; --scene-lift: 0; --scene-clear: 0px; }}
.og-art .scene {{ inset-inline-start: 0; }}
</style></head>
<body>
<div class="og-text">{build.lockup_html('p')}</div>
<div class="og-art"><div class="entrance" style="{style}">{scene_html}</div></div>
</body></html>"""
# every layer at once: nothing lazy, nothing decoded after the frame (the scene ships loading=lazy decoding=async)
html = html.replace('loading="lazy"', 'loading="eager"').replace('decoding="async"', 'decoding="sync"')

work = tempfile.mkdtemp(prefix="ab-og-")
page = os.path.join(work, "og.html")
open(page, "w", encoding="utf-8").write(html)
dst = os.path.join(SRC, "assets/img/og.jpg") if "--replace" in sys.argv else os.path.join(work, "og-preview.jpg")
js = f"""
const {{ chromium }} = require('playwright'); const fs = require('fs');
(async () => {{ const b = await chromium.launch(); const ctx = await b.newContext({{ viewport: {{ width: 1200, height: 630 }}, reducedMotion: 'reduce', colorScheme: 'dark' }});
const pg = await ctx.newPage(); await pg.goto('file://{page}', {{ waitUntil: 'load' }}); await pg.evaluate(() => document.fonts.ready);
await pg.evaluate(() => Promise.all([...document.images].map((i) => {{ i.loading = 'eager'; return i.decode().catch(() => {{}}); }})));
await pg.waitForFunction(() => [...document.images].every((i) => i.complete && (i.naturalWidth || !i.getClientRects().length)));
await pg.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
await pg.waitForTimeout(400);
const buf = await pg.screenshot({{ type: 'jpeg', quality: 88 }});
const detail = await pg.evaluate(async (b64) => {{
  const im = new Image(); im.src = 'data:image/jpeg;base64,' + b64; await im.decode();
  const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d'); x.drawImage(im, 0, 0);
  const W = 520, H = 560, a = x.getImageData(640, 40, W, H).data; let s = 0, n = 0;
  for (let y = 0; y < H; y++) for (let X = 1; X < W; X++) {{ const i = (y * W + X) * 4, j = i - 4; s += Math.abs(a[i] + a[i + 1] + a[i + 2] - a[j] - a[j + 1] - a[j + 2]) / 3; n++; }}
  return s / n; }}, buf.toString('base64'));
await b.close();
console.log('og photo detail', detail.toFixed(2), '(at least 2.4)');
if (!(detail >= 2.4)) {{ console.error('og: the photograph is not all there (detail ' + detail.toFixed(2) + '); nothing written'); process.exit(3); }}
fs.writeFileSync({dst!r}, buf); }})();
"""
jp = os.path.join(work, "og-render.js")
open(jp, "w").write(js)
subprocess.run(["node", jp], check=True, cwd=os.environ.get("OG_NODE_CWD", os.getcwd()))
print("og rendered:", dst)
