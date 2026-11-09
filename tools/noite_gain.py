"""Brighten the Noite photograph by a gain K (sRGB values x K, clipped), consistently across every layer that the
street composite has to meet: the facade, the leaves, the street strips, the street's wall stops and the colour below
the strip (the night lights are colour-dodge gains: K x base / (1 - light) = K x composite, so they stay), the LQIP and
the page's wall token. The hall, the plate, the doorway's shade and the lamplight on the steps are the interior's own
light and stay as they are (the hall colour hand-off stays exact).
usage: python3 -I noite_gain.py <src_dir> <K>"""
import base64, io, json, pathlib, re, sys
import numpy as np
from PIL import Image

SRC = pathlib.Path(sys.argv[1]); K = float(sys.argv[2])
N = SRC / "assets/photo/noite"
P = json.loads((SRC / "assets/photo/photo.json").read_text(encoding="utf-8"))
if "noiteGain" in P:
    raise SystemExit(f"already brightened x {P['noiteGain']['k']}: run it on the ungained assets only")

def gain(im):
    a = np.asarray(im).astype(np.float32)
    a[..., :3] = np.clip(np.round(a[..., :3] * K), 0, 255)
    return Image.fromarray(a.astype(np.uint8), im.mode)

def match_q(im, fmt, target, lo, hi, **kw):
    """the quality whose output is closest to the original's byte size (binary search, monotone enough)"""
    best = None
    for _ in range(7):
        q = (lo + hi) // 2
        b = io.BytesIO(); im.save(b, fmt, quality=q, **kw); n = b.tell()
        if best is None or abs(n - target) < abs(best[1] - target): best = (q, n, b.getvalue())
        if n > target: hi = q - 1
        else: lo = q + 1
        if lo > hi: break
    return best

names = re.compile(r"^(facade|leaf-l|leaf-r|street|street3)-\d+\.(avif|webp)$")
done = 0
for f in sorted(N.iterdir()):
    if not names.match(f.name): continue
    im = Image.open(f); im.load()
    im = im.convert("RGBA" if im.mode in ("RGBA", "LA", "P") else "RGB")
    g = gain(im); size = f.stat().st_size
    if f.suffix == ".avif":
        q, n, data = match_q(g, "AVIF", size, 30, 95, speed=4)
    else:
        q, n, data = match_q(g, "WEBP", size, 40, 98, method=6)
    f.write_bytes(data); done += 1
    print(f"{f.name}: q{q} {size} -> {n}")

def scale(c): return [int(min(255, round(v * K))) for v in c]
st = P["street"]["noite"]
st["wall"] = [[y, scale(c)] for y, c in st["wall"]]
st["below"] = scale(st["below"])
old = P["wall"]["noite"]; rgb = [int(old[i:i + 2], 16) for i in (1, 3, 5)]
new = "#" + "".join(f"{v:02X}" for v in scale(rgb)); P["wall"]["noite"] = new
uri = P["lqip"]["noite"]; raw = base64.b64decode(uri.split(",", 1)[1]); li = Image.open(io.BytesIO(raw)); li.load()
b = io.BytesIO(); gain(li.convert("RGBA" if "A" in li.mode else "RGB")).save(b, "WEBP", lossless=True)
P["lqip"]["noite"] = "data:image/webp;base64," + base64.b64encode(b.getvalue()).decode()
for name, rows in P["layers"]["noite"].items():
    for r in rows:
        for fmt in ("avif", "webp"):
            p = N / f"{name}-{r['w']}.{fmt}"
            if fmt in r and p.exists(): r[fmt] = p.stat().st_size
for key in ("strip", "strip3"):
    for r in st.get(key, []):
        for fmt in ("avif", "webp"):
            p = N / f"{'street' if key == 'strip' else 'street3'}-{r['w']}.{fmt}"
            if p.exists(): r[fmt] = p.stat().st_size
P.setdefault("noiteGain", {})["k"] = K
P["noiteGain"]["note"] = "Noite brightened x K in sRGB (client, 9 Nov: «à noite está demasiado escura»); hotfix tools/noite_gain.py"
(SRC / "assets/photo/photo.json").write_text(json.dumps(P, ensure_ascii=False, indent=1), encoding="utf-8")
print(f"{done} files; wall {old} -> {new}; below {st['below']}")
