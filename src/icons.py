"""Render the app icons from the identity's own vectors (assets/img/*.svg). Not part of the build: the shipped files
are src/assets/img/apple-touch-icon.png and icon-512.png (build.py copies them). Run this only to redraw them:

    python3 src/icons.py            # writes the PNGs to a temporary folder, for review
    python3 src/icons.py --replace  # overwrites src/assets/img/apple-touch-icon.png and icon-512.png

apple-touch-icon.png (180 x 180): the crest in gold on ivory, full bleed (iOS rounds the corners itself).
icon-512.png (512 x 512): the board's circle application, gold on ivory, on a transparent square.
Needs Node with Playwright (`require('playwright')` must resolve from the current directory or NODE_PATH).
"""
import os, subprocess, sys, tempfile

SRC = os.path.dirname(os.path.abspath(__file__))
IMG = os.path.join(SRC, "assets/img")


def page(svg_file, size, bg, inset):
    svg = open(os.path.join(IMG, svg_file), encoding="utf-8").read()
    return (f'<!doctype html><html><head><meta charset="utf-8"><style>html,body{{margin:0;width:{size}px;height:{size}px;'
            f'background:{bg};overflow:hidden}}div{{position:absolute;inset:{inset}px;display:grid;place-items:center}}'
            f'svg{{width:100%;height:100%;display:block}}</style></head><body><div>{svg}</div></body></html>')


work = tempfile.mkdtemp(prefix="ab-icons-")
out = IMG if "--replace" in sys.argv else work
jobs = [
    # the ivory is the board's «dourado sobre marfim» ground (tokens.css --marfim)
    ("apple-touch-icon.png", page("crest-gold.svg", 180, "#FBF7EC", 22), 180, False),
    ("icon-512.png", page("crest-circle.svg", 512, "transparent", 8), 512, True),
]
js = ["const { chromium } = require('playwright');", "(async () => { const b = await chromium.launch();"]
for name, html, size, transparent in jobs:
    hp = os.path.join(work, name + ".html")
    open(hp, "w", encoding="utf-8").write(html)
    js.append(f"{{ const ctx = await b.newContext({{ viewport: {{ width: {size}, height: {size} }}, deviceScaleFactor: 1 }});"
              f" const pg = await ctx.newPage(); await pg.goto('file://{hp}'); await pg.waitForTimeout(200);"
              f" await pg.screenshot({{ path: {os.path.join(out, name)!r}, omitBackground: {str(transparent).lower()} }}); await ctx.close(); }}")
js.append("await b.close(); })();")
jp = os.path.join(work, "icons.js")
open(jp, "w").write("\n".join(js))
subprocess.run(["node", jp], check=True, cwd=os.environ.get("OG_NODE_CWD", os.getcwd()))
# icon-512 (the circle: a flat gold gradient on flat ivory): 256 colours with alpha and no dither (about 5x smaller;
# Floyd-Steinberg sprinkled speckle over the gold, review of the identity round). The apple-touch icon is the gold crest
# in relief, whose tones a palette bands: it stays 24-bit (opaque, about 17 KB). Needs Pillow; without it the PNGs are
# kept as rendered.
try:
    from PIL import Image
    f = os.path.join(out, "icon-512.png")
    Image.open(f).convert("RGBA").quantize(colors=256, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE).save(f, optimize=True)
    f = os.path.join(out, "apple-touch-icon.png")
    Image.open(f).convert("RGB").save(f, optimize=True)
except ImportError:
    pass
print("icons rendered to", out)
