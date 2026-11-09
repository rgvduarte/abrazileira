"""The entrance: a photograph of the doorway in layers (A Porta).

assets/photo/photo.json (written by the asset pipeline) holds the geometry, the pixel size of every file and the
LQIPs; this module only turns it into markup. Every layer is placed by its rect, as a fraction of the facade
image, inside one box (.scene) with the facade's aspect ratio, so the layers line up at any size.

  z-order   street (the wall and the paving the page draws round the photograph, edge to edge) < plate (the hall
            beyond) < reveal (the doorway's shade) < leaf-l, leaf-r < facade (doorway transparent)
            < spill (Noite: lamplight on the steps, an RGBA overlay; after the page has loaded). The plate and the reveal sit in a box the size of
            the doorway that clips them: the plate is larger than the doorway (it must cover it while it zooms
            slower than the facade), and nothing of it may show past the facade's own edge.

Each layer carries both themes (a <picture> per theme, class t-dia / t-noite); CSS shows the one the page's theme
asks for and hides the other with display: none. Every image is loading="lazy": a hidden picture is never
fetched (it has no box), the shown one is fetched at the first layout, and the head script preloads the four
first-paint files of the theme it chose (head_preload()). The srcset widths are given in facade pixels (the file's
width divided by the share of the facade it spans), so every layer shares one `sizes`: the width of the scene.
"""
import json, os
from urllib.parse import quote

HERE = os.path.dirname(os.path.abspath(__file__))
P = json.load(open(os.path.join(HERE, "assets/photo/photo.json"), encoding="utf-8"))
G = P["geometry"]
RATIO = P["aspect"]
ORDER = ["plate", "reveal", "leaf-l", "leaf-r", "facade", "spill"]
RECT = {"plate": G["interiorPlate"], "reveal": G["reveal"], "leaf-l": G["leafL"], "leaf-r": G["leafR"],
        "facade": dict(x0=0, y0=0, x1=1, y1=1), "spill": G["spillNoite"]}
FIRST = ["facade", "leaf-l", "leaf-r", "plate"]          # what the first paint needs (preloaded)

# The street (POLISH_BRIEF §1): the wall and the paving run on past the photograph to the screen's edges. One box
# inside the scene (.ph--street) reaches STREET_KL scene widths to the left, STREET_KR to the right and from
# STREET_TOP to STREET_BOT scene heights; it moves with the camera like every layer. Those are what the screens need
# over the whole visible walk-in, measured from 320 x 568 to 5120 x 1440 (final2/work/polish/tools/extent.js: at most
# 2.69 widths to the left, the text column's side, 1.84 to the right, 0.47 heights below the photograph; above it the
# page's own colour is the wall's), with a margin: the smaller the box, the less the compositor has to hold when the
# camera layer is made or redrawn at a deep zoom (it was 11 x 3.3 scene sizes; it is 6 x 2.1). Its backgrounds, top to bottom: by night the lantern's and the
# doorway's light (radial gains, color-dodge: B / (1 - S), so the cobbles keep their contrast), the paving strip
# (periodic at exactly one scene width; its middle copy starts at the facade's left edge, so it IS the photograph's
# paving there; where a screen shows more than one scene width, a strip three widths wide, [A | B | C], A that same
# strip and B, C quilted from it with no verbatim run, so no stone repeats on screen: fix r1), and the wall: a
# vertical gradient, the page colour up top, a touch deeper by the paving (by day).
# The facade's own margins were graded into this same composite (final2/work/polish/pipe), so nothing marks where the
# photograph ends. All geometry is static percentages of the box (no var() in the theme tokens).
ST = P.get("street")
STREET_KL, STREET_KR, STREET_TOP, STREET_BOT = 3, 2, -0.3, 1.8
STREET_WS = [f["w"] for f in ST["dia"]["strip"]] if ST else []
STREET3_WS = [f["w"] for f in ST["dia"].get("strip3", [])] if ST else []
FADE = P.get("fade")              # the facade's outer fade (shares of its width / height): the LQIP is inset by it


def _sf(y):
    """a scene-height share as a percentage of the street box's height"""
    return (y - STREET_TOP) / (STREET_BOT - STREET_TOP) * 100


def _hex(c):
    return "#%02X%02X%02X" % tuple(int(round(v)) for v in c)


def street_wall(theme):
    """the wall gradient: the theme's stops, then (just above the strip's end, which covers the step) the colour the
    paving blurs into, on down the box"""
    t = ST[theme]
    st = [f"{_hex(c)} {_sf(y):.3f}%" for y, c in t["wall"]]
    end = _sf(ST["yout"] - 0.004)
    last = _hex(t["wall"][-1][1])
    st += [f"{last} {end:.3f}%", f"{_hex(t['below'])} {end:.3f}%"]
    return "linear-gradient(" + ", ".join(st) + ")"


def street_glow(theme, i):
    t = ST[theme]
    if i >= len(t["lights"]):
        return "none"
    g = t["lights"][i]
    bw, bh = STREET_KL + 1 + STREET_KR, STREET_BOT - STREET_TOP
    rx, ry = g["rx"] / bw * 100, g["ry"] / bh * 100
    cx, cy = (g["cx"] + STREET_KL) / bw * 100, (g["cy"] - STREET_TOP) / bh * 100
    stops = ", ".join(f"rgb({c[0]} {c[1]} {c[2]}) {pos:.2f}%" for pos, c in g["stops"])
    return f"radial-gradient({rx:.4f}% {ry:.4f}% at {cx:.4f}% {cy:.4f}%, {stops})"


def street_tokens(theme, base="../photo/"):
    """theme tokens for tokens.css (relative to assets/css/): the wall, two lights (none by day), the strip per width
    as WebP and as an AVIF image-set"""
    v = {"--street-wall": street_wall(theme), "--street-glow-a": street_glow(theme, 0), "--street-glow-b": street_glow(theme, 1),
         "--street-below": _hex(ST[theme]["below"])}
    for k, ws in (("street", STREET_WS), ("street3", STREET3_WS)):
        for w in ws:
            a, b = f'{base}{theme}/{k}-{w}.avif', f'{base}{theme}/{k}-{w}.webp'
            v[f"--{k}-{w}"] = f'url("{b}")'
            v[f"--{k}-{w}-avif"] = f'image-set(url("{a}") type("image/avif"), url("{b}") type("image/webp"))'
    return v


def street_vars():
    """static geometry of the street box and its strip (inline on .scene, like the layer rects). The box starts a whole
    number of scene widths left of the photograph, so a strip tile starts at its left edge (x 0) and one at the
    facade's"""
    bw, bh = STREET_KL + 1 + STREET_KR, STREET_BOT - STREET_TOP
    img_h = ST["yout"] - ST["yg0"]
    pos_y = (ST["yg0"] - STREET_TOP) / (bh - img_h) * 100
    v = [f"--street-x:{-STREET_KL * 100}%", f"--street-y:{STREET_TOP * 100:.1f}%", f"--street-w:{bw * 100}%", f"--street-h:{bh * 100:.1f}%",
         f"--street-size:{100 / bw:.5f}% {img_h / bh * 100:.5f}%", f"--street-pos:0% {pos_y:.5f}%"]
    if STREET3_WS:            # the 3-width strip: one tile three scene widths wide (the box is 6 wide: two tiles, from x 0)
        v.append(f"--street-size3:{300 / bw:.5f}% {img_h / bh * 100:.5f}%")
    return v


def lqip_vars():
    """the placeholder's box: inset by the facade's outer fade (top and sides its widest, the bottom its own), with the
    24 px image sized and placed so it still lines up with the scene"""
    fx, fy, fb = (FADE["max"], FADE["maxH"], FADE["bottom"]) if FADE else (0.03, 0.027, 0.027)
    w, h = 1 - 2 * fx, 1 - fy - fb
    return [f"--lqip-x:{fx * 100:.3f}%", f"--lqip-y:{fy * 100:.3f}%", f"--lqip-w:{w * 100:.3f}%", f"--lqip-h:{h * 100:.3f}%",
            f"--lqip-size:{100 / w:.3f}% {100 / h:.3f}%", f"--lqip-pos:50% {fy / (fy + fb) * 100:.3f}%"]


# The scene's rendered width, in CSS terms, for `sizes` (site.css › The entrance), modelled on the layout and checked
# against the rendered width at 145 viewports from 320 x 560 to 3840 x 2160 (shots/photoint-fix-r1/js/sizes.js:
# slot / scene within 0.95-1.10). The facade is 0.9066 as wide as it is tall; stacked, it may rise 5% above its box
# (so its width is 0.954 x the box's height less the clear space). Side by side from 900px: the right column
# (6/11 of the width less the gutters and the 4rem gap), or the height under the top bar, at most 939px. Landscape
# phones (first: a wide one is also 900px wide): as tall as the text column beside it. Portrait tablets: the room under the text, which grows with the
# width. Phones: the room under the text, never less than the entrance's own minimum height (40svh; 38svh and 28svh
# on short screens, whose text is set tighter), never wider than the screen.
SIZES = ("(orientation: landscape) and (max-height: 31.25em) min(44vw, 75vh, 19rem), "
         "(min-width: 56.25em) min(calc(51vw - 3rem), calc((100vh - 9.3rem) * 0.9066), 939px), "
         "(orientation: landscape) min(44vw, 75vh), "
         "(min-width: 37.5em) calc((100vh - 31.9rem - (100vw - 26.875rem) * 0.19) * 0.954), "
         "(max-width: 22.49em) and (max-height: 37.5em) min(100vw, calc((100vh - 25.8rem) * 0.954)), "
         "(max-height: 37.5em) min(100vw, max(calc((clamp(9rem, 28vh, 18rem) - 1rem) * 0.954), calc((100vh - 24.2rem) * 0.954))), "
         "(max-height: 42.5em) min(100vw, max(calc((clamp(13rem, 38vh, 18rem) - 1rem) * 0.954), calc((100vh - 27rem) * 0.954))), "
         "min(100vw, max(calc((clamp(15rem, 40vh, 34rem) - 0.5rem) * 0.954), calc((100vh - 31.7rem) * 0.954)))")


def pct(v):
    return f"{v * 100:.4f}%"


def srcset(theme, name, fmt, p):
    r = RECT[name]
    share = r["x1"] - r["x0"]
    return ", ".join(f"{p}assets/photo/{theme}/{name}-{f['w']}.{fmt} {round(f['px'][0] / share)}w" for f in P["layers"][theme][name])


def picture(theme, name, p, alt=""):
    files = P["layers"][theme][name]
    mid = files[min(1, len(files) - 1)]
    w, h = mid["px"]
    return (f'<picture class="t-{theme}"><source type="image/avif" srcset="{srcset(theme, name, "avif", p)}" sizes="{SIZES}">'
            f'<img src="{p}assets/photo/{theme}/{name}-{mid["w"]}.webp" srcset="{srcset(theme, name, "webp", p)}" sizes="{SIZES}" '
            f'width="{w}" height="{h}" alt="{alt}" loading="lazy" decoding="async"></picture>')


def layer(name, p):
    themes = ["noite"] if name == "spill" else ["dia", "noite"]
    return "".join(picture(t, name, p) for t in themes)


def lqip_svg(uri):
    """the 24 px placeholder, drawn blurred (an SVG filter, once, at first paint): no blocky upscale"""
    svg = ("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 26' preserveAspectRatio='none'>"
           "<filter id='b' x='0' y='0' width='1' height='1' color-interpolation-filters='sRGB'>"
           "<feGaussianBlur stdDeviation='.7' edgeMode='duplicate'/></filter>"
           f"<image width='24' height='26' preserveAspectRatio='none' filter='url(%23b)' href='{uri}'/></svg>")
    return 'url("data:image/svg+xml,' + quote(svg, safe="/:;,=' ()%") + '")'


def street_geo(p=""):
    """the street for the 3D entrance (door3d.js draws it on its facade plane exactly as the page does): the strip's
    rows, and per theme the wall's stops, the colour below the strip, the lights (the fitted model: cx, cy, rx,
    ry/rx, core, gain - 1 per channel, power) and the strip's files (without extension: .avif, else .webp), one and
    three scene widths wide (src, src3)"""
    if not ST:
        return None
    o = {"y": [round(ST["yg0"], 5), round(ST["yout"], 5)]}
    for t in ("dia", "noite"):
        o[t] = {"wall": [[round(y, 4)] + [round(v / 255, 4) for v in c] for y, c in ST[t]["wall"]],
                "below": [round(v / 255, 4) for v in ST[t]["below"]],
                "lights": [[round(v, 4) for v in ST[t]["fit"][k]] for k in ST[t]["fit"]],
                "src": {str(f["w"]): f"{p}assets/photo/{t}/street-{f['w']}" for f in ST[t]["strip"]},
                "src3": {str(f["w"]): f"{p}assets/photo/{t}/street3-{f['w']}" for f in ST[t].get("strip3", [])}}
    return o


def geo(p=""):
    """what site.js reads once (data-geo): hall point, doorway, leaves, plate rect, perspective, parallax, swing"""
    d = G["doorway"]; pl = G["interiorPlate"]
    c = P["camera"]
    return json.dumps({"st": street_geo(p), "hp": [G["hallPoint"]["x"], G["hallPoint"]["y"]], "door": [d["x0"], d["y0"], d["x1"], d["y1"]],
                       "gap": [G["gapAtRest"]["x0"], G["gapAtRest"]["x1"]], "plate": [pl["x0"], pl["y0"], pl["x1"], pl["y1"]],
                       "ratio": RATIO, "persp": c["perspective"], "k": c["plateParallax"], "open": c["openDeg"],
                       "grow": c["plateGrow"], "cover": c["plateCover"], "light": c["light"],
                       "spill": [G["spillNoite"]["x0"], G["spillNoite"]["y0"], G["spillNoite"]["x1"], G["spillNoite"]["y1"]]},
                      separators=(",", ":"))


def style_vars():
    """custom properties for site.css: the box, the hall point (zoom origin), the layer rects, the LQIPs"""
    hp = G["hallPoint"]
    v = [f"--scene-ratio:{RATIO}", f"--scene-axis:{G['doorAxisX']}", f"--hp-x:{pct(hp['x'])}", f"--hp-y:{pct(hp['y'])}",
         f"--persp:{P['camera']['perspective']}"]
    d = G["doorway"]
    for name in ORDER:
        r = RECT[name]
        if name in ("facade", "reveal"):
            continue
        if name == "plate":           # inside the doorway's box (which clips it): its rect relative to the doorway
            dw, dh = d["x1"] - d["x0"], d["y1"] - d["y0"]
            r = dict(x0=(r["x0"] - d["x0"]) / dw, y0=(r["y0"] - d["y0"]) / dh, x1=(r["x1"] - d["x0"]) / dw, y1=(r["y1"] - d["y0"]) / dh)
        v += [f"--{name}-x:{pct(r['x0'])}", f"--{name}-y:{pct(r['y0'])}", f"--{name}-w:{pct(r['x1'] - r['x0'])}", f"--{name}-h:{pct(r['y1'] - r['y0'])}"]
    v += [f"--door-x:{pct(d['x0'])}", f"--door-y:{pct(d['y0'])}", f"--door-w:{pct(d['x1'] - d['x0'])}", f"--door-h:{pct(d['y1'] - d['y0'])}"]
    pl = RECT["plate"]
    # the plate's own zoom origin is the hall point, in the plate's box
    v += [f"--plate-ox:{pct((hp['x'] - pl['x0']) / (pl['x1'] - pl['x0']))}", f"--plate-oy:{pct((hp['y'] - pl['y0']) / (pl['y1'] - pl['y0']))}"]
    if ST:                        # (before the LQIPs: their url("...") ends a double-quoted style attribute)
        v += street_vars()
    v += lqip_vars()
    v += [f"--lqip-dia:{lqip_svg(P['lqip']['dia'])}", f"--lqip-noite:{lqip_svg(P['lqip']['noite'])}"]
    return ";".join(v)


def scene_markup(p="", lang="pt", motion=True):
    """the scene (inside .entrance). data-motion: hooks for the moving layers (attributes only, never styled)"""
    m = (lambda s: f' data-motion="{s}"') if motion else (lambda s: "")
    return (f'<div class="scene"{m("camera")} data-geo=\'{geo(p)}\' style="{style_vars()}">'
            + ('<div class="ph ph--street"></div>' if ST else '') + '<div class="ph ph--lqip"></div>' +
            f'<div class="ph ph--hall"><div class="ph ph--plate"{m("plate")}>{layer("plate", p)}</div>'
            f'<div class="ph ph--reveal">{layer("reveal", p)}</div></div>'
            f'<div class="door">'
            f'<div class="leaf leaf--l"{m("leaf-l")}>{layer("leaf-l", p)}<i class="leaf__shade"{m("shade-l")}></i></div>'
            f'<div class="leaf leaf--r"{m("leaf-r")}>{layer("leaf-r", p)}<i class="leaf__shade"{m("shade-r")}></i></div>'
            f'</div>'
            f'<div class="ph ph--facade">{layer("facade", p)}</div>'
            f'<div class="ph ph--spill t-noite"{m("spill")}>{layer("spill", p)}</div>'
            f'</div>')


def alt(lang):
    return P["alt"]["pt" if lang == "pt" else "en"]


def head_preload(p):
    """Head script fragment: preload the first-paint files of the theme the head script chose (t), AVIF where the
    browser takes it (a preload with type="image/avif" is skipped by a browser that cannot decode it, and the
    picture then falls back to WebP on its own). The srcset and sizes are the img's own, so the preload is the
    file the img picks."""
    sets = {}
    for t in ("dia", "noite"):
        sets[t] = [srcset(t, n, "avif", p) for n in FIRST]
    return ('var P=' + json.dumps(sets, separators=(",", ":")) + ',S=' + json.dumps(SIZES) + ';'
            'P[t].forEach(function(s,i){var l=document.createElement("link");l.rel="preload";l.as="image";l.type="image/avif";'
            'l.setAttribute("imagesrcset",s);l.setAttribute("imagesizes",S);l.setAttribute("fetchpriority",i?"low":"high");document.head.appendChild(l)});')


def bytes_first_paint(theme, device_px):
    """bytes the first paint fetches (AVIF) when the scene is device_px wide (for the budget table)"""
    tot = 0
    for n in FIRST:
        r = RECT[n]; share = r["x1"] - r["x0"]
        need = device_px * share
        files = P["layers"][theme][n]
        pick = next((f for f in files if f["px"][0] >= need), files[-1])
        tot += pick["avif"]
    return tot
