"""A Brazileira · the entrance, drawn as a page of an architect's travel sketchbook ("caderno").

The construction is the same true one-point perspective as before (metres, X right, Y up, Z into the
picture, projected onto the front face of the lower step). What changed is the hand: every edge goes
through hand.py, which bakes the habits of a pen drawn quickly and surely into the coordinates
(lines that bow a little, cross at the corners or stop short, restart after a pen lift, a second pass
on the main silhouettes), economical hatching for shade, and loose washes with wet irregular edges
that do not quite keep inside the lines. No filters, no rasters: crisp at any camera scale.

Colours and opacities live in tokens.css (classes only here), so Dia and Noite are the same drawing:
dark sepia ink and earth washes on paper by day; light ink on the walnut night paper, with glazes of
lamplight, by night.

Layers (the choreography needs them separate):
  back svg     the hall in shadow (seen through the gap while the doors are ajar)
  .hall__light the lit hall (HTML colour = the waiting-list surface) with the hall drawing inside it
  front svg    wall, stone arch, reveal, frame, fanlight, steps, lantern, olive tree, pendant
  .spill       lamplight on the steps (night)
  .leaf x2     the two door leaves, each its own svg, hinged in 3D by CSS
"""
import math, random
from hand import Pen, polyd, f1, absf, rp, resample, ellipse_pts, lerp, dist

U = 150.0          # svg units per metre
D = 6.0 * U        # eye distance to picture plane
EYE = 1.55 * U     # eye height above the street
G = 800.0          # screen y of the street at the picture plane

# --- model ---------------------------------------------------------------
A = 0.72           # half clear opening of the stone arch
J = 0.28           # face width of the jamb stones
WALL = 0.64        # z of the wall face (two treads of 0.32)
BACK = 1.04        # z of the door plane (0.40 wall thickness)
SILL = 0.32        # threshold height (two risers of 0.16)
LEAF_H = 2.40
TRANSOM = 0.10
IMP = SILL + LEAF_H + TRANSOM      # springing line of the arch = 2.82
FRAME = 0.06       # door frame (aduela) width in the door plane
LEAF_W = A - FRAME # 0.66
STEP_W = 1.14      # half width of the steps
HALL = BACK + 4.0  # far wall of the hall

RO = A + J          # extrados radius 1.00
PL = 0.30           # plinth height
PLX = 0.02          # plinth projection
IH = 0.12           # impost height
IX = 0.035          # impost projection
KS = 8.18           # keystone half angle
KT = RO + 0.11      # keystone top radius


def r1(v):
    s = f"{v:.1f}"
    return "0" if s in ("-0.0", "0.0") else s.rstrip("0").rstrip(".") if "." in s else s


EXT = []


def P(X, Y, Z, ext=True):
    s = D / (D + Z * U)
    p = (X * U * s, G - (EYE + (Y * U - EYE) * s))
    if ext:
        EXT.append(p)
    return p


def Q(X, Y, Z):
    """projection that does not count towards the drawing's extents (overspill, shadows, light)."""
    return P(X, Y, Z, ext=False)


def sc(Z):
    return D / (D + Z * U)


def arc(cx, cy, r, a0, a1, Z, n=None, ext=True):
    if n is None:
        n = max(3, int(abs(a1 - a0) / 3))
    return [P(cx + r * math.cos(math.radians(a0 + (a1 - a0) * i / n)),
              cy + r * math.sin(math.radians(a0 + (a1 - a0) * i / n)), Z, ext) for i in range(n + 1)]


def rect(x0, y0, x1, y1, Z, ext=True):
    return [P(x0, y0, Z, ext), P(x1, y0, Z, ext), P(x1, y1, Z, ext), P(x0, y1, Z, ext)]


GRAD = []


def glow(pen, layer, gid, cx, cy, rx, ry, stops=((0, "core", 0.75), (0.4, "mid", 0.32), (1, "mid", 0.04)), extra="", cls="lg i-night", rough=None, lumpy=1.2, gc=None):
    """lamplight laid wet-in-wet: an irregular patch whose colour fades from the source outward.
    The patch keeps a faint pooled edge, like a glaze that dried at its border."""
    gx, gy = gc if gc else (cx, cy)
    R = max(rx, ry)
    st = "".join(f'<stop offset="{o}" class="s-{c}" stop-opacity="{a}"/>' for o, c, a in stops)
    tr = ""
    if abs(rx - ry) > 0.5:
        k = ry / rx if rx > ry else rx / ry
        tr = (f' gradientTransform="translate({r1(gx)} {r1(gy)}) scale({1 if rx >= ry else round(k, 3)} {round(k, 3) if rx > ry else 1}) translate({r1(-gx)} {r1(-gy)})"')
    GRAD.append(f'<radialGradient id="{gid}" gradientUnits="userSpaceOnUse" cx="{r1(gx)}" cy="{r1(gy)}" r="{r1(R)}"{tr}>{st}</radialGradient>')
    layer.add(cls, pen.blob(cx, cy, rx, ry, rough=rough if rough is not None else 0.06 * min(rx, ry) + 0.8, step=10, lumpy=lumpy), f' fill="url(#{gid})"' + extra)


class Layer:
    """collects path data per class, keeps paint order."""
    def __init__(self):
        self.items = []

    def add(self, cls, d, extra=""):
        if d:
            self.items.append((cls, d, extra))

    def svg(self):
        return "\n".join(f'<path class="{c}"{e} d="{d}"/>' for c, d, e in self.items)


# =========================================================================
def build():
    out = {}
    pen = Pen(7)
    LANT.clear()
    GRAD.clear()
    lant_items = lantern(Pen(13))   # first: its silhouette casts a shadow on the wall
    F = Layer()     # front svg
    B = Layer()     # back svg (the hall in shadow)
    add = F.add

    # ---------------- key outlines (screen space) ----------------
    surround_out = ([P(-RO - PLX, SILL, WALL), P(-RO - PLX, SILL + PL, WALL), P(-RO, SILL + PL, WALL),
                     P(-RO, IMP - IH, WALL), P(-RO - IX, IMP - IH, WALL), P(-RO - IX, IMP, WALL), P(-RO, IMP, WALL)]
                    + arc(0, IMP, RO, 180, 90 + KS, WALL)[1:]
                    + [P(-0.13, IMP + KT, WALL), P(0.13, IMP + KT, WALL)]
                    + arc(0, IMP, RO, 90 - KS, 0, WALL)
                    + [P(RO + IX, IMP, WALL), P(RO + IX, IMP - IH, WALL), P(RO, IMP - IH, WALL),
                       P(RO, SILL + PL, WALL), P(RO + PLX, SILL + PL, WALL), P(RO + PLX, SILL, WALL)])
    opening = [P(A, SILL, WALL), P(A, IMP, WALL)] + arc(0, IMP, A, 0, 180, WALL)[1:] + [P(-A, SILL, WALL)]
    surround = surround_out + opening   # outer clockwise then the hole

    # ---------------- 1. the wall: a loose plaster wash that fades out (vignette of the sketch) ----------
    wall = [Q(-1.72, SILL - 0.02, WALL), Q(-1.8, 1.5, WALL), Q(-1.62, 2.75, WALL), Q(-1.25, 3.25, WALL), Q(-0.95, 2.6, WALL), Q(-0.98, 1.0, WALL), Q(-1.0, SILL - 0.02, WALL)]
    add("w w-wall i-day", pen.wash(wall, rough=4.5, step=15, lumpy=1.5))
    wall = [Q(-0.55, 3.9, WALL), Q(-0.9, 4.15, WALL), Q(-0.2, 4.32, WALL), Q(0.7, 4.12, WALL), Q(1.2, 3.55, WALL), Q(1.3, 2.6, WALL), Q(0.98, 2.9, WALL), Q(0.5, 3.75, WALL)]
    add("w w-wall i-day", pen.wash(wall, rough=4.0, step=15, lumpy=1.4))
    wall = [Q(1.0, SILL - 0.02, WALL), Q(1.06, 1.6, WALL), Q(1.32, 2.2, WALL), Q(1.45, 1.2, WALL), Q(1.55, SILL - 0.02, WALL)]
    add("w w-wall i-day", pen.wash(wall, rough=3.5, step=15, lumpy=1.4))

    # ---------------- night: lamplight on the wall around the lantern (glazes, stepped like watercolour) -----
    lc = lantern_centre()
    s0 = sc(WALL) * U
    glow(pen, F, "ab-halo", lc[0] + 2, lc[1] + 5, 0.6 * s0, 0.56 * s0, stops=((0, "core", 0.6), (0.25, "mid", 0.34), (0.65, "mid", 0.1), (1, "mid", 0.015)), gc=lc)

    # ---------------- 2. sun shadows on the wall (Dia): the surround's thickness, the lantern ----------------
    cs = (0.075 * U * sc(WALL), 0.06 * U * sc(WALL))
    right_edge = ([P(0.13, IMP + KT, WALL, False)] + arc(0, IMP, RO, 90 - KS, 0, WALL, ext=False)
                  + [P(RO + IX, IMP, WALL, False), P(RO + IX, IMP - IH, WALL, False), P(RO, IMP - IH, WALL, False),
                     P(RO, SILL + PL, WALL, False), P(RO + PLX, SILL + PL, WALL, False), P(RO + PLX, SILL, WALL, False)])
    band = right_edge + [(x + cs[0], y + cs[1]) for x, y in right_edge[::-1]]
    add("k k-h i-day", pen.hatch(band, ang=58, sp=2.9, loose=0.6, skip=0.06))
    add("w w-shade i-day", pen.wash(band, rough=0.8, step=11))
    # lantern shadow, cast down and to the right on the plaster
    lsh = [(x + 0.2 * s0, y + 0.3 * s0) for x, y in LANT["sil"]]
    add("k k-h i-day", pen.hatch(lsh, ang=58, sp=1.9, loose=0.3, skip=0.06, tone=lambda x, y: 1.1 - (x - lsh[0][0]) / 120))

    # ---------------- 3. the stone surround ----------------
    add("w w-stone", pen.wash(surround, rough=1.5, step=12, grow=0.6))
    # a second, uneven glaze: limestone is never one colour
    pat = [P(-RO, SILL + PL, WALL, False), P(-RO, IMP - 0.4, WALL, False), P(-A, IMP - 0.2, WALL, False), P(-A, SILL + PL + 0.1, WALL, False)]
    add("w w-stone2", pen.wash(pat, rough=2.2, step=9))
    pat = arc(0, IMP, RO, 50, 8, WALL, ext=False) + arc(0, IMP, A, 8, 50, WALL, ext=False)
    add("w w-stone2", pen.wash(pat, rough=2.0, step=9))
    pat = [P(A, SILL, WALL, False), P(RO + PLX, SILL, WALL, False), P(RO, SILL + 1.1, WALL, False), P(A, SILL + 0.9, WALL, False)]
    add("w w-stone2", pen.wash(pat, rough=2.0, step=9))

    # ---------------- 4. reveal (wall thickness) and soffit ----------------
    lrev = [P(-A, SILL, WALL), P(-A, IMP, WALL), P(-A, IMP, BACK), P(-A, SILL, BACK)]
    rrev = [P(A, SILL, WALL), P(A, IMP, WALL), P(A, IMP, BACK), P(A, SILL, BACK)]
    fr = arc(0, IMP, A, 180, 0, WALL)
    bk = arc(0, IMP, A, 0, 180, BACK)
    soffit = fr + bk
    add("w w-stone", pen.wash(rrev, rough=1.0, step=10, grow=0.3))
    add("w w-stone", pen.wash(lrev, rough=1.0, step=10, grow=0.3))
    add("w w-stone", pen.wash(soffit, rough=1.0, step=10, grow=0.3))
    add("w w-shade", pen.wash(lrev, rough=1.2, step=10, grow=-0.2))
    add("w w-shade", pen.wash(soffit, rough=1.2, step=10, grow=-0.2))
    # shade: hatch on the left reveal and the soffit; a cross-hatch where the soffit is deepest
    add("k k-h", pen.hatch(lrev, ang=58, sp=2.7, loose=0.5, skip=0.05))
    ytop = P(0, IMP + A, WALL)[1]
    add("k k-h", pen.hatch(soffit, ang=58, sp=2.7, loose=0.5, skip=0.06))
    add("k k-x", pen.hatch(soffit, ang=-28, sp=3.1, loose=0.5, skip=0.12, tone=lambda x, y: 1.25 - abs(x) / 70 - (y - ytop) / 60))
    add("k k-x", pen.hatch(lrev, ang=-28, sp=3.4, loose=0.5, skip=0.2, tone=lambda x, y: (y - P(0, IMP, WALL)[1]) / -40 + 0.2))
    # lamplight on the reveal (night)
    add("w w-l1 i-night i-door-light", pen.wash(lrev, rough=1.0, step=10, grow=-0.5))
    add("w w-l1 i-night i-door-light", pen.wash(rrev, rough=1.0, step=10, grow=-0.5))
    add("w w-l0 i-night i-door-light", pen.wash(soffit, rough=1.0, step=10, grow=-0.5))

    # ---------------- 5. door frame, transom, fanlight (door plane) ----------------
    frame = [rect(-A, SILL, -LEAF_W, IMP, BACK), rect(LEAF_W, SILL, A, IMP, BACK), rect(-LEAF_W, SILL + LEAF_H, LEAF_W, IMP, BACK)]
    for fpoly in frame:
        add("w w-wood", pen.wash(fpoly, rough=0.6, step=12, grow=0.4))
    FRI = A - 0.05
    HUB = 0.095
    glass = arc(0, IMP, FRI, 180, 0, BACK)
    add("w w-glass", pen.wash(glass, rough=0.8, step=8, grow=-0.3))
    # a few reflections on the glass by day: quick diagonal strokes
    refl = []
    for (x0_, y0_, ln) in ((-0.42, IMP + 0.42, 0.13), (-0.37, IMP + 0.4, 0.09), (0.18, IMP + 0.22, 0.07)):
        a_ = Q(x0_, y0_, BACK)
        b_ = Q(x0_ + ln * 0.55, y0_ - ln, BACK)
        refl.append(pen.tick(a_, b_, 0.3))
    add("k k-f i-day", "".join(refl))
    gc = P(0, IMP, BACK)
    fanR = FRI * U * sc(BACK)
    out["fan_clip"] = polyd(glass)
    glow(pen, F, "ab-fan-g", gc[0], gc[1] - 2, fanR * 1.15, fanR * 1.05, stops=((0, "core", 1), (0.35, "core", 0.85), (0.75, "mid", 0.75), (1, "edge", 0.6)),
         extra=' clip-path="url(#ab-fan)"', cls="lg i-night i-door-light", gc=(gc[0], gc[1] + 4))
    ring = arc(0, IMP, A, 180, 0, BACK) + arc(0, IMP, FRI, 0, 180, BACK)
    add("w w-wood", pen.wash(ring, rough=0.5, step=6, grow=0.2))
    hub = arc(0, IMP, HUB, 180, 0, BACK)
    add("w w-wood", pen.wash(hub, rough=0.3, step=2))
    ink2 = []
    for kk in range(1, 8):
        a = math.radians(22.5 * kk)
        ink2.append(pen.line(P(HUB * math.cos(a), IMP + HUB * math.sin(a), BACK),
                             P(FRI * math.cos(a), IMP + FRI * math.sin(a), BACK), wob=0.6, over=(0.0, 0.8), short=0.3, lift=0))
    ink2.append(pen.curve(arc(0, IMP, 0.44, 180, 0, BACK, ext=False), wob=0.7, step=8, lift=0))
    ink2.append(pen.curve(arc(0, IMP, FRI, 180, 0, BACK, ext=False), wob=0.6, step=8, lift=0))
    ink2.append(pen.curve(arc(0, IMP, HUB, 180, 0, BACK, ext=False), wob=0.4, step=4, lift=0))
    add("k k-2 k-bar", "".join(ink2))
    # frame line work
    ink = []
    ink.append(pen.curve(arc(0, IMP, A, 180, 0, BACK, ext=False), wob=0.7, step=9, double=0.6))
    ink.append(pen.line(P(-A, IMP, BACK), P(A, IMP, BACK), double=0.5))
    ink.append(pen.line(P(-LEAF_W, SILL + LEAF_H, BACK), P(LEAF_W, SILL + LEAF_H, BACK), double=0.4))
    for x in (-A, A):
        ink.append(pen.line(P(x, SILL, BACK), P(x, IMP, BACK), over=(0.2, 1.4)))
    for x in (-LEAF_W, LEAF_W):
        ink.append(pen.line(P(x, SILL, BACK), P(x, SILL + LEAF_H, BACK), over=(0.2, 1.4)))
    add("k", "".join(ink))
    add("k k-f", pen.line(P(-A, IMP - 0.025, BACK), P(A, IMP - 0.025, BACK), wob=0.6)
        + pen.line(P(-LEAF_W, SILL + LEAF_H + 0.02, BACK), P(LEAF_W, SILL + LEAF_H + 0.02, BACK), wob=0.6, short=0.4))
    # frame in shade under the transom: a few short strokes
    tr = rect(-LEAF_W, SILL + LEAF_H, LEAF_W, SILL + LEAF_H + 0.035, BACK, ext=False)
    add("k k-h", pen.hatch(tr, ang=58, sp=2.6, loose=0.4))

    # ---------------- 6. the surround line work ----------------
    ink = []
    # outer contour, in a few confident runs
    L0 = [P(-RO - PLX, SILL, WALL), P(-RO - PLX, SILL + PL, WALL), P(-RO, SILL + PL, WALL)]
    ink.append(pen.poly(L0, closed=False))
    ink.append(pen.line(P(-RO, SILL + PL, WALL), P(-RO, IMP - IH, WALL), double=0.7))
    imp_l = [P(-RO, IMP - IH, WALL), P(-RO - IX, IMP - IH, WALL), P(-RO - IX, IMP, WALL), P(-RO, IMP, WALL)]
    ink.append(pen.poly(imp_l, closed=False, wob=0.5))
    ink.append(pen.curve(arc(0, IMP, RO, 180, 90 + KS, WALL), double=0.8, split_at=[0.55]))
    ink.append(pen.curve(arc(0, IMP, RO, 90 - KS, 0, WALL), double=0.8, split_at=[0.45]))
    key = [P(RO * math.cos(math.radians(90 + KS)), IMP + RO * math.sin(math.radians(90 + KS)), WALL),
           P(-0.13, IMP + KT, WALL), P(0.13, IMP + KT, WALL),
           P(RO * math.cos(math.radians(90 - KS)), IMP + RO * math.sin(math.radians(90 - KS)), WALL)]
    ink.append(pen.poly(key, closed=False, double=0.4))
    ink.append(pen.line(P(A * math.cos(math.radians(90 + KS)), IMP + A * math.sin(math.radians(90 + KS)), WALL), key[0]))
    ink.append(pen.line(P(A * math.cos(math.radians(90 - KS)), IMP + A * math.sin(math.radians(90 - KS)), WALL), key[3]))
    imp_r = [P(RO, IMP, WALL), P(RO + IX, IMP, WALL), P(RO + IX, IMP - IH, WALL), P(RO, IMP - IH, WALL)]
    ink.append(pen.poly(imp_r, closed=False, wob=0.5))
    ink.append(pen.line(P(RO, IMP - IH, WALL), P(RO, SILL + PL, WALL), double=0.7))
    ink.append(pen.poly([P(RO, SILL + PL, WALL), P(RO + PLX, SILL + PL, WALL), P(RO + PLX, SILL, WALL)], closed=False))
    # the opening (intrados and jambs) - the edge that matters most: drawn twice in places
    ink.append(pen.curve(arc(0, IMP, A, 180, 0, WALL), double=0.9, split_at=[0.5]))
    ink.append(pen.line(P(-A, SILL, WALL), P(-A, IMP, WALL), double=0.6))
    ink.append(pen.line(P(A, SILL, WALL), P(A, IMP, WALL), double=0.3, gap=0.5))
    # reveal back edges (meet the frame) and the soffit's back arc
    ink.append(pen.line(P(-A, SILL, BACK), P(-A, SILL, WALL), over=(0.2, 1.2)))
    ink.append(pen.line(P(A, SILL, BACK), P(A, SILL, WALL), over=(0.2, 1.2)))
    add("k", "".join(ink))
    # joints and mouldings (secondary)
    j2 = []
    for sgn in (-1, 1):
        j2.append(pen.line(P(sgn * A, SILL + PL, WALL), P(sgn * RO, SILL + PL, WALL), over=(0.0, 1.0), short=0.3))
        for yy in (SILL + PL + 0.72, SILL + PL + 1.42):
            j2.append(pen.line(P(sgn * A, yy + 0.004 * sgn, WALL), P(sgn * RO, yy - 0.006 * sgn, WALL), over=(0.0, 1.2), short=0.35))
        j2.append(pen.line(P(sgn * A, IMP - IH, WALL), P(sgn * RO, IMP - IH, WALL), over=(0.0, 1.0), short=0.3))
        j2.append(pen.line(P(sgn * (RO + IX), IMP - IH * 0.45, WALL), P(sgn * A, IMP - IH * 0.45, WALL), wob=0.6, short=0.4))
    n_v = 11
    step = 180.0 / n_v
    for k in range(1, n_v):
        a = k * step
        if abs(a - 90) < step / 2 + 0.01:
            continue
        ar = math.radians(a + random.Random(k).uniform(-1.2, 1.2))
        j2.append(pen.line(P(A * math.cos(ar), IMP + A * math.sin(ar), WALL),
                           P(RO * math.cos(ar), IMP + RO * math.sin(ar), WALL), over=(0.0, 1.4), short=0.35))
    add("k k-2", "".join(j2))
    # under the impost: a thin shadow line and a few strokes
    for sgn in (-1, 1):
        b_ = [P(sgn * RO, IMP - IH, WALL, False), P(sgn * (RO + IX), IMP - IH, WALL, False),
              P(sgn * (RO + IX), IMP - IH - 0.03, WALL, False), P(sgn * RO, IMP - IH - 0.03, WALL, False)]
        if sgn > 0:
            add("k k-h i-day", pen.hatch(b_, ang=58, sp=1.9, loose=0.3))
    # the moulded inner edge (fillet) and a few limestone marks
    Fl = 0.035
    fil = [P(-A - Fl, SILL + PL, WALL, False), P(-A - Fl, IMP, WALL, False)] + arc(0, IMP, A + Fl, 180, 0, WALL, ext=False) + [P(A + Fl, IMP, WALL, False), P(A + Fl, SILL + PL, WALL, False)]
    add("k k-f", pen.curve(fil, wob=0.6, step=10, split_at=[0.3, 0.52, 0.76]))
    marks = []
    rr = random.Random(11)
    for i in range(46):
        # pits and small chips in the limestone, mostly on the lower stones and the voussoirs
        if rr.random() < 0.5:
            ang = rr.uniform(10, 170)
            rad = rr.uniform(A + 0.04, RO - 0.03)
            x, y = rad * math.cos(math.radians(ang)), IMP + rad * math.sin(math.radians(ang))
        else:
            x = rr.choice((-1, 1)) * rr.uniform(A + 0.05, RO - 0.04)
            y = rr.uniform(SILL + 0.05, IMP - IH - 0.05)
        p = Q(x, y, WALL)
        L_ = rr.uniform(0.6, 2.6)
        a = rr.uniform(0, math.pi)
        marks.append(pen.tick(p, (p[0] + L_ * math.cos(a), p[1] + L_ * math.sin(a)), 0.4))
    add("k k-f", "".join(marks))

    # ---------------- 7. steps ----------------
    BW = STEP_W
    lower_riser = rect(-BW, 0, BW, 0.16, 0)
    lower_tread = [P(-BW, .16, 0), P(BW, .16, 0), P(BW, .16, .32), P(-BW, .16, .32)]
    upper_riser = rect(-BW, .16, BW, SILL, .32)
    upper_tread = [P(-BW, SILL, .32), P(BW, SILL, .32), P(BW, SILL, WALL), P(-BW, SILL, WALL)]
    threshold = [P(-A, SILL, WALL), P(A, SILL, WALL), P(A, SILL, BACK), P(-A, SILL, BACK)]
    for t_ in (lower_tread, upper_tread, threshold):
        add("w w-step", pen.wash(t_, rough=0.9, step=7, grow=0.4))
    for r_ in (lower_riser, upper_riser):
        add("w w-riser", pen.wash(r_, rough=0.9, step=7, grow=0.3))
    # risers face the street: horizontal strokes that thicken towards the right (sun from the upper left)
    for r_ in (lower_riser, upper_riser):
        x0, x1 = r_[0][0], r_[1][0]
        add("k k-h", pen.hatch(r_, ang=3, sp=3.3, loose=2.5, skip=0.3, drift=1.5, dash=24, tone=lambda x, y, x0=x0, x1=x1: 0.05 + 0.95 * max(0.0, min(1.0, (x - x0) / (x1 - x0))) ** 1.2))
    # shadow of the threshold step on the far side of the reveal
    sh = [P(-A, SILL, BACK, False), P(A, SILL, BACK, False), P(A, SILL, BACK - 0.06, False), P(-A, SILL, BACK - 0.06, False)]
    add("k k-h", pen.hatch(sh, ang=58, sp=1.8, loose=0.4))
    ink = []
    ink.append(pen.line(P(-BW, .16, 0), P(BW, .16, 0), double=0.7))
    ink.append(pen.line(P(-BW, SILL, .32), P(BW, SILL, .32), double=0.6))
    ink.append(pen.line(P(-BW, .16, .32), P(BW, .16, .32), short=0.3))
    ink.append(pen.line(P(-BW, SILL, WALL), P(-RO - PLX, SILL, WALL)))
    ink.append(pen.line(P(RO + PLX, SILL, WALL), P(BW, SILL, WALL)))
    for sgn in (-1, 1):
        ink.append(pen.line(P(sgn * BW, 0, 0), P(sgn * BW, .16, 0)))
        ink.append(pen.line(P(sgn * BW, .16, 0), P(sgn * BW, .16, .32), wob=0.4))
        ink.append(pen.line(P(sgn * BW, .16, .32), P(sgn * BW, SILL, .32)))
        ink.append(pen.line(P(sgn * BW, SILL, .32), P(sgn * BW, SILL, WALL), wob=0.4))
    ink.append(pen.line(P(-A, SILL, BACK), P(A, SILL, BACK)))
    add("k", "".join(ink))
    nos = [pen.line(P(-BW + 0.03, .145, 0), P(BW - 0.03, .145, 0), short=0.4, gap=0.6),
           pen.line(P(-BW + 0.03, SILL - .015, .32), P(BW - 0.03, SILL - .015, .32), short=0.4, gap=0.6)]
    # wear: a chipped nosing, a hairline crack
    c0 = P(0.62, .16, 0)
    nos.append(pen.tick(c0, (c0[0] + 3.5, c0[1] + 1.6), 0.3) + pen.tick((c0[0] + 3.5, c0[1] + 1.6), (c0[0] + 6.5, c0[1] + 0.2), 0.3))
    c1 = P(-0.42, SILL, .40)
    nos.append(pen.curve([c1, (c1[0] + 4, c1[1] + 1.5), (c1[0] + 7, c1[1] + 0.8), (c1[0] + 11, c1[1] + 2.4)], wob=0.4, step=3, lift=0))
    add("k k-f", "".join(nos))
    # the street in front of the wall, either side of the steps: a few ground strokes that trail off
    gr = []
    rg = random.Random(5)
    for sgn in (-1, 1):
        xb = P(sgn * BW, 0, 0)[0]
        yw = P(0, 0, WALL)[1]
        for i in range(5):
            y = yw + (G - yw) * (i + rg.uniform(0.2, 0.8)) / 5
            xa = xb + sgn * rg.uniform(2, 6)
            L_ = rg.uniform(14, 40) * (1 - i * 0.12) if sgn < 0 else rg.uniform(3, 7)   # the pot stands on the right
            gr.append(pen.line((xa, y), (xa + sgn * L_, y + rg.uniform(-0.4, 0.4)), wob=0.5, over=(0, 0.5)))
        gr.append(pen.line((xb + sgn * 1, yw), (xb + sgn * (rg.uniform(45, 60) if sgn < 0 else 7), yw), wob=0.6))
    add("k k-f i-day", "".join(gr))
    add("k k-f", "".join(gr[-1:]))

    # ---------------- 8. lantern ----------------
    F.items.extend(lant_items)

    # ---------------- 9. pendant in the hall (front svg so the hall light never hides it) --------
    ZL = BACK + 1.6
    lx, ly = P(0, SILL + 2.12, ZL)
    lw = 0.17 * U * sc(ZL)
    lh = 0.12 * U * sc(ZL)
    top_y = P(0, SILL + LEAF_H, BACK)[1]
    shade = ([(-lw + k * 0.05, ly) for k in range(1)]
             + [(-lw * math.cos(math.radians(t)), ly - lh * math.sin(math.radians(t)) * (0.9 + 0.1 * math.sin(math.radians(t)))) for t in range(10, 171, 16)]
             + [(lw, ly)])
    add("w w-lamp", pen.wash(shade, rough=0.25, step=2))
    add("w w-l3 i-night", pen.blob(0, ly + 1.4, lw * 0.6, lh * 0.35, rough=0.3, step=2))
    add("k k-hall", pen.line((0, top_y), (0.4, ly - lh), wob=0.3, over=(0, 0.3), lift=0)
        + pen.curve(shade, wob=0.3, step=4, lift=0)
        + pen.line((-lw - 0.6, ly + 0.2), (lw + 0.5, ly - 0.2), wob=0.2, lift=0))

    # ---------------- 10. olive tree in a terracotta pot ----------------
    F.items.extend(olive(pen))

    # ---------------- the hall in shadow (back svg) ----------------
    door_open = rect(-LEAF_W, SILL, LEAF_W, SILL + LEAF_H, BACK)
    B.add("w-room-base", polyd(door_open))
    B.add("w w-room i-day", pen.wash(door_open, rough=0.8, step=12, grow=-0.4))
    bp = Pen(31)
    B.add("k k-h i-day", bp.hatch(door_open, ang=58, sp=2.2, loose=0.5, skip=0.03))
    B.add("k k-x i-day", bp.hatch(door_open, ang=-30, sp=2.6, loose=0.5, skip=0.05))
    B.add("k k-x i-day", bp.hatch(door_open, ang=88, sp=3.4, loose=0.8, skip=0.25, tone=lambda x, y: (y - P(0, SILL + 1.2, BACK)[1]) / 60))
    # night: the hall glows behind the ajar doors (stepped glazes rising from the floor)
    gx, gy = P(0, SILL + 1.0, BACK)
    dw = LEAF_W * U * sc(BACK)
    dh = LEAF_H * U * sc(BACK)
    # the opening itself carries the glow (exact edges: nothing may leak behind the semi-transparent washes)
    GRAD.append(f'<radialGradient id="ab-hall" gradientUnits="userSpaceOnUse" cx="0" cy="{r1(gy - 10)}" r="{r1(dh * 0.62)}" '
                f'gradientTransform="translate(0 {r1(gy - 10)}) scale(.62 1) translate(0 {r1(-(gy - 10))})">'
                '<stop offset="0" class="s-core"/><stop offset=".5" class="s-mid"/><stop offset="1" class="s-edge"/></radialGradient>')
    B.add("lg-flat i-night i-door-light", polyd(door_open), ' fill="url(#ab-hall)"')

    # ---------------- defs, extents ----------------
    lt = P(-LEAF_W, SILL + LEAF_H, BACK)
    rb = P(LEAF_W, SILL, BACK)
    out["leaf"] = dict(x0=lt[0], y0=lt[1], x1=rb[0], y1=rb[1])
    out["vp"] = (0, G - EYE)
    out["back_defs"] = "<defs>" + "".join(g for g in GRAD if 'id="ab-hall"' in g) + "</defs>"
    out["defs"] = ("<defs>" + "".join(g for g in GRAD if 'id="ab-hall"' not in g)
                   + f'<clipPath id="ab-fan"><path d="{out["fan_clip"]}"/></clipPath></defs>')
    out["body"] = F.svg()
    out["back"] = B.svg()
    out["hall"] = hall(lt, rb)
    yb = P(0, SILL, HALL)[1]
    out["hall_floor"] = (rb[1] - yb)
    sil = [P(-BW, 0, 0), P(BW, 0, 0), P(BW, .16, 0), P(BW, .16, .32), P(BW, SILL, .32), P(BW, SILL, WALL),
           P(A, SILL, WALL), P(A, SILL, BACK), P(-A, SILL, BACK), P(-A, SILL, WALL), P(-BW, SILL, WALL),
           P(-BW, SILL, .32), P(-BW, .16, .32), P(-BW, .16, 0)]
    px, py = P(-0.03, SILL, BACK - 0.05)
    out["spill"] = dict(pts=sil, pool=(px, py), svg=spill_svg(sil, (px, py)))
    out["pool"] = (px, py)
    return out


# =========================================================================
LANT = {}


def lantern_centre():
    if "c" not in LANT:
        X0, Yh = -1.31, 3.04
        LANT["c"] = P(X0, Yh - (0.176 + 0.565) / 2, WALL, False)
    return LANT["c"]


def lantern(pen):
    """Wall lantern: a square iron lantern seen on its corner, hung from a scrolled arm.
    Iron in solid ink, glass in a pale wash (lit at night), the scroll in one sure stroke."""
    Z = WALL
    s = sc(Z)
    X0, Yh = -1.31, 3.04
    items = []

    def p(x, y, ext=True):
        return P(X0 + x, Yh + y, Z, ext)

    bt, bb, wt, wb = -.176, -.565, .138, .104
    LANT["sil"] = [p(-.165, -.158, False), p(.165, -.158, False), p(wt, bt, False), p(wb, bb, False),
                   p(.018, bb - .085, False), p(-.018, bb - .085, False), p(-wb, bb, False), p(-wt, bt, False)]
    gl = [p(-wt, bt), p(0, bt), p(0, bb), p(-wb, bb)]
    gr = [p(0, bt), p(wt, bt), p(wb, bb), p(0, bb)]
    items.append(("w w-lglass", pen.wash(gl, rough=0.3, step=2, grow=0.2), ""))
    items.append(("w w-lglass2", pen.wash(gr, rough=0.3, step=2, grow=0.2), ""))
    lc = p(0, (bt + bb) / 2, False)
    R = (bb - bt) * -0.5 * U * s
    GRAD.append(f'<radialGradient id="ab-lamp" gradientUnits="userSpaceOnUse" cx="{r1(lc[0] - 2)}" cy="{r1(lc[1])}" r="{r1(R * 0.9)}">'
                '<stop offset="0" class="s-core"/><stop offset=".55" class="s-core" stop-opacity=".7"/><stop offset="1" class="s-mid" stop-opacity="0"/></radialGradient>')
    items.append(("lg-flat i-night", polyd(gl) + polyd(gr), ' fill="url(#ab-lamp)"'))
    # glass: a few reflections (day)
    items.append(("k k-f i-day", pen.tick(p(-.1, -.24), p(-.07, -.33), 0.3) + pen.tick(p(-.085, -.22), p(-.05, -.31), 0.3)
                  + pen.tick(p(.06, -.4), p(.075, -.47), 0.3), ""))

    # iron: solid ink shapes with a hand-cut edge
    iron = []
    px_ = 0.235
    iron.append(pen.wash([p(px_ - .013, .055), p(px_ + .013, .055), p(px_ + .013, -.235), p(px_ - .013, -.235)], rough=0.15, step=1.5))
    iron.append(pen.wash([p(px_ - .012, .015), p(-.03, .015), p(-.03, -.001), p(px_ - .012, -.001)], rough=0.12, step=1.5))
    cx, cy = p(-.042, .007)
    iron.append(pen.blob(cx, cy, .014 * U * s, .014 * U * s, rough=0.1, step=1))
    cx, cy = p(0, -.05)
    iron.append(pen.blob(cx, cy, .013 * U * s, .012 * U * s, rough=0.1, step=1))
    iron.append(pen.wash([p(-.022, -.06), p(.022, -.06), p(.027, -.083), p(-.027, -.083)], rough=0.1, step=1.5))

    def bez(a, c1, c2, b, n=10):
        pts = []
        for i in range(n + 1):
            t = i / n
            mt = 1 - t
            pts.append(tuple(mt ** 3 * a[k] + 3 * mt * mt * t * c1[k] + 3 * mt * t * t * c2[k] + t ** 3 * b[k] for k in range(2)))
        return pts
    roof_l = bez((-.027, -.083), (-.03, -.125), (-.15, -.11), (-.168, -.158))
    roof_r = bez((.168, -.158), (.15, -.11), (.03, -.125), (.027, -.083))
    roof = [p(*q) for q in roof_l + roof_r]
    iron.append(pen.wash(roof, rough=0.15, step=1.5))
    iron.append(pen.wash([p(-.176, -.156), p(.176, -.156), p(.172, -.178), p(-.172, -.178)], rough=0.12, step=1.5))
    iron.append(pen.wash([p(-wb - .013, bb + .002), p(wb + .013, bb + .002), p(wb + .012, bb - .02), p(-wb - .012, bb - .02)], rough=0.12, step=1.5))
    iron.append(pen.wash([p(-wb + .008, bb - .02), p(wb - .008, bb - .02), p(.018, bb - .085), p(-.018, bb - .085)], rough=0.12, step=1.5))
    cx, cy = p(0, bb - .1)
    iron.append(pen.blob(cx, cy, .016 * U * s, .017 * U * s, rough=0.1, step=1))
    items.append(("k-fill", "".join(iron), ""))
    # light catching the iron (night): the underside of the roof
    items.append(("w w-l2 i-night", pen.wash([p(-.15, -.158, False), p(.15, -.158, False), p(.12, -.17, False), p(-.12, -.17, False)], rough=0.1, step=1.5), ""))

    ink = []
    # panes and the corner post
    ink.append(pen.poly([p(-wt, bt), p(-wb, bb)], closed=False, wob=0.3, over=(0, 0.6)))
    ink.append(pen.line(p(wt, bt), p(wb, bb), wob=0.3, over=(0, 0.6)))
    ink.append(pen.line(p(0, bt), p(0, bb), wob=0.3, over=(0, 0.5), double=0.8))

    def xw(y):
        return wt + (wb - wt) * (y - bt) / (bb - bt)
    gy = bt + (bb - bt) * .22
    ink.append(pen.line(p(-xw(gy), gy), p(xw(gy), gy), wob=0.3, over=(0, 0.4)))
    # the scroll under the arm: one stroke from the plate up into a curl
    sc_ = (bez((px_ - .016, -.19), (.10, -.19), (.04, -.12), (.055, -.04), 10)
           + bez((.055, -.04), (.06, -.005), (.11, -.02), (.10, -.055), 8)[1:]
           + bez((.10, -.055), (.09, -.08), (.065, -.06), (.08, -.045), 6)[1:])
    ink.append(pen.curve([p(*q) for q in sc_], wob=0.25, step=2.5, lift=0, over=(0, 0.4)))
    ink.append(pen.line(p(0, -.002), p(0, -.03), wob=0.2, lift=0))
    cx, cy = p(0, -.036)
    ink.append(pen.curve(ellipse_pts(cx, cy, .008 * U * s, .008 * U * s, 0, 340, 10), wob=0.1, step=1.5, lift=0))
    items.append(("k k-iron", "".join(ink), ""))
    return items


# =========================================================================
def olive(pen):
    """Young olive tree in a terracotta pot on the street (z = 0), right of the steps."""
    rnd = random.Random(23)
    Z = 0.0
    PX = 1.40
    items = []

    def q(x, y, ext=True):
        return P(PX + x, y, Z, ext)

    H = 0.6
    prof = [(.158, H), (.18, H - .028), (.176, H - .055), (.156, H - .078), (.196, H - .2), (.205, H - .285),
            (.186, H - .405), (.143, H - .495), (.11, .042), (.12, .02), (.12, 0)]

    def smooth_pts(pp, n=5):
        """quadratic midpoint smoothing of a polyline into a dense polyline."""
        out = [pp[0]]
        for i in range(1, len(pp) - 1):
            a = out[-1]
            c = pp[i]
            b = ((pp[i][0] + pp[i + 1][0]) / 2, (pp[i][1] + pp[i + 1][1]) / 2) if i < len(pp) - 2 else pp[i + 1]
            for k in range(1, n + 1):
                t = k / n
                out.append(((1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0],
                            (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]))
        if out[-1] != pp[-1]:
            out.append(pp[-1])
        return out
    right = smooth_pts([q(x, y) for x, y in prof])
    left = smooth_pts([q(-x, y) for x, y in prof])
    pot = right + left[::-1]
    # rim seen from above: an ellipse
    rc = q(0, H - 0.004)
    rx = .172 * U
    ry = rx * (EYE - H * U) / D * 0.95
    # washes: terracotta, a lighter left flank left almost bare, the shade on the right
    items.append(("w w-pot", pen.wash(pot, rough=1.2, step=4, grow=0.5), ""))
    hl = [q(-.135, H - .1, False), q(-.105, H - .11, False), q(-.1, H - .3, False), q(-.115, H - .42, False), q(-.145, H - .3, False)]
    items.append(("w w-paper i-day", pen.wash(hl, rough=0.8, step=4), ' style="--wo:.5"'))
    shd = [q(.06, H - .08, False), q(.2, H - .2, False), q(.21, H - .3, False), q(.15, H - .5, False), q(.11, .04, False), q(.06, .04, False), q(.11, H - .3, False)]
    items.append(("w w-potdk", pen.wash(shd, rough=1.4, step=5), ""))
    soil = ellipse_pts(rc[0], rc[1] + 0.6, rx * 0.86, ry * 0.75, 0, 360, 24)
    items.append(("w w-soil", pen.wash(soil, rough=0.4, step=3), ""))
    # contour hatching on the shaded flank: strokes that follow the belly, shorter as they move into the light
    seg = [p_ for p_ in right if q(0, H - .085)[1] <= p_[1] <= q(0, H - .5)[1]]
    ch = []
    for k in range(1, 8):
        off = k * 2.1
        keep = 1.0 - k * 0.1
        pts = [(x - off * (1 + 0.15 * math.sin(i * 0.4)), y) for i, (x, y) in enumerate(seg)]
        n_ = len(pts)
        a_ = int(n_ * (1 - keep) * pen.r.uniform(0.3, 0.7))
        b_ = n_ - int(n_ * (1 - keep) * pen.r.uniform(0.3, 0.7))
        if b_ - a_ > 3:
            ch.append(pen.curve(pts[a_:b_], wob=0.5, step=6, lift=0, over=(0, 0.6)))
    items.append(("k k-h", "".join(ch), ""))
    ink = []
    ink.append(pen.curve(left, wob=0.7, step=8, lift=0, double=0.3))
    ink.append(pen.curve(right, wob=0.7, step=8, lift=0, double=0.7))
    ink.append(pen.curve(ellipse_pts(rc[0], rc[1], rx, ry, 0, 180, 18), wob=0.4, step=5, lift=0))
    ink.append(pen.curve(ellipse_pts(rc[0], rc[1], rx, ry, 180, 360, 18), wob=0.4, step=5, lift=0, over=(0, 0.5)))
    # rolled rim and the foot ring
    ink.append(pen.curve(smooth_pts([q(-.176, H - .055), q(0, H - .062), q(.176, H - .055)], 6), wob=0.4, step=6, lift=0))
    ink.append(pen.line(q(-.11, .042), q(.11, .042), wob=0.5, short=0.4))
    items.append(("k", "".join(ink), ""))

    # ---- tree topology (as before: trunk, four limbs, sprays of leaves)
    def bez(a, c, b, t):
        return ((1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t ** 2 * b[0],
                (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t ** 2 * b[1])

    trunk_edges, limbs_ink, twigs, sprays = [], [], [], []
    leaves_wash = {"w w-leaf1": [], "w w-leaf2": [], "w w-leaf3": []}
    leaf_ink = []
    masses = []

    def edges(a, c, b, w0, w1, n=10):
        L_, R_ = [], []
        for i in range(n + 1):
            t = i / n
            m = bez(a, c, b, t)
            m0 = bez(a, c, b, max(0, t - .02))
            m1 = bez(a, c, b, min(1, t + .02))
            nx, ny = -(m1[1] - m0[1]), m1[0] - m0[0]
            nl = math.hypot(nx, ny) or 1
            w = w0 + (w1 - w0) * t
            L_.append(q(m[0] + nx / nl * w, m[1] + ny / nl * w))
            R_.append(q(m[0] - nx / nl * w, m[1] - ny / nl * w))
        return L_, R_

    def leaf_pts(x, y, ang, L, W, curv):
        ca, sa = math.cos(math.radians(ang)), math.sin(math.radians(ang))

        def w2s(u, v):
            return q(x + u * sa + v * ca, y + u * ca - v * sa)
        return w2s(0, 0), w2s(L * .45, W * (1 + curv * .3)), w2s(L, curv * W), w2s(L * .55, -W * (1 - curv * .3))

    def clump(cx, cy, r, n, lean):
        masses.append((cx, cy, r))
        for k in range(rnd.randint(2, 4)):
            a = rnd.uniform(0, 2 * math.pi)
            tx, ty = cx + r * .8 * math.cos(a), cy + r * .55 * math.sin(a)
            twigs.append([q(cx, cy), q((cx + tx) / 2 + rnd.uniform(-.02, .02), (cy + ty) / 2 + rnd.uniform(-.02, .02)), q(tx, ty)])
        for i in range(n):
            a = rnd.uniform(0, 2 * math.pi)
            d = r * math.sqrt(rnd.random())
            bx, by = cx + d * math.cos(a), cy + d * math.sin(a) * .62
            outa = math.degrees(math.atan2(bx - cx, by - cy)) if d > 1e-6 else rnd.uniform(-180, 180)
            la = outa + rnd.uniform(-38, 38) + lean
            if by < cy:
                la = la + (180 - la if la > 0 else -180 - la) * .18
            L_ = rnd.uniform(.075, .11)
            W_ = L_ * rnd.uniform(.14, .19)
            b0, c1, tip, c2 = leaf_pts(bx, by, la, L_, W_, rnd.uniform(-.45, .45))
            r_ = rnd.random()
            # colour: shade leaves underneath, silver undersides here and there
            key = "w w-leaf3" if (by < cy - r * .1 and r_ < .55) else ("w w-leaf2" if r_ < .32 else "w w-leaf1")
            # wash leaf (slightly offset from the ink: the brush never lands exactly on the line)
            off = (rnd.gauss(0.4, 0.5), rnd.gauss(0.3, 0.5))
            leaves_wash[key].append((b0, c1, tip, c2, off))
            if rnd.random() < 0.42:
                leaf_ink.append((b0, c1, tip, c2, rnd.random() < 0.4))

    def spray(sx, sy, ang, length, droop):
        ex = sx + length * .6 * math.sin(math.radians(ang))
        ey = sy + length * .6 * math.cos(math.radians(ang)) - droop * length * .3
        sprays.append([q(sx, sy), q((sx + ex) / 2, (sy + ey) / 2 + 0.01), q(ex, ey)])
        clump(ex, ey, length * .62, int(4 + length * 21), (ang * .15))

    base, tc, fork = (0.0, H - .02), (.07, H + .22), (-.035, H + .5)
    trunk_edges.append(edges(base, tc, fork, .048, .03, 14))
    # limbs leave the trunk at different heights, each with its own bend (never a bundle of sticks)
    limbs = [(-46, .6, .021, .8, .07), (-12, .72, .022, .97, -.05), (16, .64, .02, 1.0, .06), (44, .5, .018, .9, -.04)]
    for ang, ln, wd, t0, bend in limbs:
        ang += rnd.uniform(-4, 4)
        o_ = bez(base, tc, fork, t0)
        ex = o_[0] + ln * math.sin(math.radians(ang))
        ey = o_[1] + ln * math.cos(math.radians(ang))
        c = ((o_[0] + ex) / 2 + bend + rnd.uniform(-.02, .02), (o_[1] + ey) / 2 - abs(bend) * 0.5)
        limbs_ink.append(edges(o_, c, (ex, ey), wd, .004, 10))
        fork_ = o_
        for k in range(rnd.randint(3, 4)):
            t = rnd.uniform(.32, .86)
            bx, by = bez(fork_, c, (ex, ey), t)
            a2 = ang + rnd.choice([-1, 1]) * rnd.uniform(28, 55)
            l2 = rnd.uniform(.18, .3)
            e2 = (bx + l2 * math.sin(math.radians(a2)), by + l2 * math.cos(math.radians(a2)))
            c2 = ((bx + e2[0]) / 2, (by + e2[1]) / 2 + .02)
            sprays.append([q(bx, by), q(*c2), q(*e2)])
            spray(e2[0], e2[1], a2 + rnd.uniform(-12, 12), rnd.uniform(.2, .28), rnd.uniform(.05, .35))
            spray(bx, by, a2 + rnd.choice([-1, 1]) * rnd.uniform(20, 40), rnd.uniform(.13, .19), rnd.uniform(.1, .45))
        spray(ex, ey, ang + rnd.uniform(-10, 10), rnd.uniform(.22, .3), rnd.uniform(.0, .2))
        for tt in (.42, .62, .82):
            mx, my = bez(fork_, c, (ex, ey), tt)
            spray(mx, my, ang + rnd.choice([-1, 1]) * rnd.uniform(40, 75), rnd.uniform(.13, .2), rnd.uniform(.2, .55))

    # foliage masses: loose glazes under the leaves (silver-green, then olive, then the shade)
    mp = Pen(91)
    for cls, scale, dy, keep in (("w w-mass2", 1.45, 0.02, 0.45), ("w w-mass1", 1.1, -0.01, 0.5), ("w w-mass3", 0.6, -0.07, 0.5)):
        dd = []
        for (cx, cy, r) in masses:
            if mp.r.random() > keep:
                continue
            c_ = q(cx + mp.r.uniform(-.02, .02), cy + dy + mp.r.uniform(-.02, .02), False)
            R_ = r * U * scale
            dd.append(mp.blob(c_[0], c_[1], R_ * mp.r.uniform(0.75, 1.0), R_ * mp.r.uniform(0.45, 0.62), rough=R_ * 0.18, step=11,
                              rot=mp.r.uniform(-0.5, 0.5), lumpy=1.6))
        items.append((cls, "".join(dd), ""))
    # trunk wash and ink
    for Lw, Rw in trunk_edges:
        items.append(("w w-trunk", pen.wash(Lw + Rw[::-1], rough=0.6, step=5), ""))
    for Lw, Rw in limbs_ink:
        items.append(("w w-trunk", pen.wash(Lw + Rw[::-1], rough=0.3, step=6), ""))
    # leaves (wash), each a little off its ink
    for key, lst in leaves_wash.items():
        d_ = []
        for b0, c1, tip, c2, off in lst:
            o = lambda pnt: rp((pnt[0] + off[0], pnt[1] + off[1]))
            B0, C1, T_, C2 = o(b0), o(c1), o(tip), o(c2)
            B0 = (round(B0[0]), round(B0[1]))
            d_.append("M" + absf(B0) + "q" + _rel(B0, C1) + " " + _rel(B0, T_) + "q" + _rel(T_, C2) + " " + _rel(T_, B0) + "z")
        items.append((key + " w-leaf", "".join(d_), ""))
    # ink: trunk with a second pass and bark, limbs as double lines, twigs single
    ink, fine = [], []
    for Lw, Rw in trunk_edges:
        ink.append(pen.curve(Lw, wob=0.5, step=6, lift=0, double=0.5))
        ink.append(pen.curve(Rw, wob=0.5, step=6, lift=0, double=0.9))
        # bark: short strokes along the right side (shade)
        for i in range(2, len(Rw) - 1):
            if pen.r.random() < 0.8:
                a_, b_ = Rw[i], Lw[i]
                m = lerp(a_, b_, pen.r.uniform(0.08, 0.4))
                fine.append(pen.tick(m, (m[0] + pen.r.uniform(-1, 1), m[1] - pen.r.uniform(2, 5)), 0.5))
        tw = [lerp(Lw[i], Rw[i], 0.35 + 0.25 * math.sin(i * 0.6)) for i in range(len(Lw))]
        fine.append(pen.curve(tw, wob=0.4, step=6, lift=0))
    for Lw, Rw in limbs_ink:
        ink.append(pen.curve(Lw, wob=0.4, step=6, lift=0))
        if pen.r.random() < 0.9:
            ink.append(pen.curve(Rw[:int(len(Rw) * pen.r.uniform(0.55, 0.9))], wob=0.4, step=6, lift=0))
    for tw in sprays:
        fine.append(pen.qc(*tw))
    for tw in twigs:
        if pen.r.random() < 0.4:
            fine.append(pen.qc(*tw))
    items.append(("k k-2", "".join(ink), ""))
    items.append(("k k-f", "".join(fine), ""))
    # leaf marks: outlines for some, a single flick for others
    li = []
    for b0, c1, tip, c2, full in leaf_ink:
        B0, C1, T_, C2 = rp(b0), rp(c1), rp(tip), rp(c2)
        B0 = (round(B0[0]), round(B0[1]))
        if full:
            li.append("M" + absf(B0) + "q" + _rel(B0, C1) + " " + _rel(B0, T_) + "q" + _rel(T_, C2) + " " + _rel(T_, B0))
        else:
            li.append("M" + absf(B0) + "q" + _rel(B0, C1) + " " + _rel(B0, T_))
    items.append(("k k-leaf", "".join(li), ""))
    return items


def _rel(a, b):
    from hand import rel
    return rel(a, b)


def smooth3(p3, n=6):
    a, c, b = p3
    return [((1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1])
            for t in (k / n for k in range(n + 1))]


# =========================================================================
def hall(lt, rb):
    """The hall seen through the doorway, drawn inside the lit-hall layer (.hall__light).
    viewBox = the door opening in scene units, so the line weights match the rest of the drawing.
    Restrained: the floor in perspective, a tiled dado on the far wall, an arch further in."""
    pen = Pen(57)
    x0, y0, x1, y1 = lt[0], lt[1], rb[0], rb[1]
    L = Layer()
    fy = P(0, SILL, HALL, False)[1]
    # floor: lioz and dark stone in a chequer, in perspective
    xs = [i * 0.4 for i in range(-6, 7)]
    zs = [BACK + 0.0 + k * 0.5 for k in range(0, 9)]
    tiles_dark = []
    for i in range(len(xs) - 1):
        for k in range(len(zs) - 1):
            if (i + k) % 2:
                tiles_dark.append([P(xs[i], SILL, zs[k], False), P(xs[i + 1], SILL, zs[k], False),
                                   P(xs[i + 1], SILL, zs[k + 1], False), P(xs[i], SILL, zs[k + 1], False)])
    L.add("w w-hfloor", pen.wash([(x0 - 4, y1 + 2), (x1 + 4, y1 + 2), (x1 + 4, fy), (x0 - 4, fy)], rough=0.6, step=4))
    L.add("w w-htile", "".join(polyd([rp(p) for p in t]) for t in tiles_dark))
    fl = []
    for x in xs:
        fl.append(pen.line(P(x, SILL, BACK, False), P(x, SILL, HALL, False), wob=0.4, over=(0, 0.6), short=0.3, lift=0))
    for z in zs[1:]:
        fl.append(pen.line(P(-2.6, SILL, z, False), P(2.6, SILL, z, False), wob=0.4, over=(0, 0.6), short=0.3, lift=0))
    L.add("k k-hall k-hf", "".join(fl))
    # far wall: skirting, a tiled dado (azulejos) up to 1.1 m, an arched doorway further in
    Zf = HALL
    L.add("k k-hall", pen.line(P(-2.6, SILL, Zf, False), P(2.6, SILL, Zf, False), wob=0.4, lift=0)
          + pen.line(P(-2.6, SILL + 0.12, Zf, False), P(2.6, SILL + 0.12, Zf, False), wob=0.4, lift=0, short=0.4))
    dado = SILL + 1.1
    aw, ah = 0.42, SILL + 1.9
    tile = []
    for side in (-1, 1):
        xa, xb = (-2.6, -aw - 0.08) if side < 0 else (aw + 0.08, 2.6)
        poly = [P(xa, SILL + 0.12, Zf, False), P(xb, SILL + 0.12, Zf, False), P(xb, dado, Zf, False), P(xa, dado, Zf, False)]
        L.add("w w-hdado", pen.wash(poly, rough=0.7, step=9))
        t = 0.14
        n = int((dado - SILL - 0.12) / t)
        for k in range(1, n + 1):
            y = SILL + 0.12 + k * t
            tile.append(pen.line(P(xa, y, Zf, False), P(xb, y, Zf, False), wob=0.3, over=(0, 0.3), short=0.2, lift=0))
        x = xa
        while x < xb - 0.01:
            x += t
            tile.append(pen.line(P(x, SILL + 0.12, Zf, False), P(x, dado, Zf, False), wob=0.3, over=(0, 0.3), short=0.2, lift=0))
        tile.append(pen.line(P(xa, dado + 0.03, Zf, False), P(xb, dado + 0.03, Zf, False), wob=0.4, lift=0))
    L.add("k k-hall k-hf", "".join(tile))
    # tile motifs: a small cross in each tile (pen dots and dashes)
    mot = []
    rr = random.Random(3)
    for side in (-1, 1):
        xa = -2.6 if side < 0 else aw + 0.08
        xb = -aw - 0.08 if side < 0 else 2.6
        y = SILL + 0.12 + 0.07
        while y < dado - 0.03:
            x = xa + 0.07
            while x < xb - 0.03:
                c = P(x, y, Zf, False)
                d = 0.022 * U * sc(Zf)
                sg = 1 if int((x - xa) / 0.14 + (y - SILL) / 0.14) % 2 else -1
                if sg < 0:
                    x += 0.14
                    continue
                mot.append(pen.tick((c[0] - d, c[1] - d * sg), (c[0] + d, c[1] + d * sg), 0.2))
                x += 0.14
            y += 0.14
    L.add("k k-hall k-hm", "".join(mot))
    # an arched passage further in, and beyond it a room lit by a tall window: the light at the end
    arch = [P(-aw, SILL, Zf, False), P(-aw, ah, Zf, False)] + arc(0, ah, aw, 180, 0, Zf, ext=False) + [P(aw, ah, Zf, False), P(aw, SILL, Zf, False)]
    yh = P(0, ah + aw, Zf)[1]
    ys = P(0, SILL + 0.4, Zf)[1]
    Zb = Zf + 2.2
    win = [P(-0.26, SILL + 0.75, Zb, False), P(0.26, SILL + 0.75, Zb, False), P(0.26, SILL + 2.15, Zb, False), P(-0.26, SILL + 2.15, Zb, False)]
    wx0, wx1 = win[0][0], win[1][0]
    wy0, wy1 = win[2][1], win[0][1]
    L.add("w w-hdeep", pen.wash(arch, rough=0.6, step=7, grow=-0.3))
    L.add("w w-hwin", pen.wash(win, rough=0.4, step=6, grow=0.6))
    # shadow in the passage: dense near its sides and head, none on the window
    def ton(x, y):
        if wx0 - 3 < x < wx1 + 3 and wy0 - 3 < y < wy1 + 3:
            return 0
        return 0.25 + min(1.0, abs(x) / (aw * U * sc(Zf))) * 0.6 + max(0.0, (ys - y) / (ys - yh)) * 0.35
    L.add("k k-hall k-hh", pen.hatch(arch, ang=58, sp=2.2, loose=0.3, skip=0.06, tone=ton, dash=18))
    L.add("k k-hall k-hh", pen.hatch(arch, ang=-32, sp=2.6, loose=0.3, skip=0.2, tone=lambda x, y: ton(x, y) - 0.45, dash=12))
    wl = [pen.poly(win, wob=0.3, over=(0.1, 0.8)),
          pen.line(P(0, SILL + 0.75, Zb, False), P(0, SILL + 2.15, Zb, False), wob=0.2, lift=0),
          pen.line(P(-0.26, SILL + 1.65, Zb, False), P(0.26, SILL + 1.65, Zb, False), wob=0.2, lift=0),
          pen.line(P(-0.3, SILL + 0.72, Zb, False), P(0.3, SILL + 0.72, Zb, False), wob=0.2, lift=0),
          pen.line(P(-aw, SILL, Zb, False), P(aw, SILL, Zb, False), wob=0.3, lift=0)]
    L.add("k k-hall k-hf", "".join(wl))
    L.add("k k-hall", pen.curve(arch, wob=0.5, step=6, lift=0, double=0.6))
    arch2 = [P(-aw - 0.1, SILL + 0.12, Zf, False), P(-aw - 0.1, ah, Zf, False)] + arc(0, ah, aw + 0.1, 180, 0, Zf, ext=False) + [P(aw + 0.1, ah, Zf, False), P(aw + 0.1, SILL + 0.12, Zf, False)]
    L.add("k k-hall k-hf", pen.curve(arch2, wob=0.5, step=6, lift=0))
    vb = f"{r1(x0)} {r1(y0)} {r1(x1 - x0)} {r1(y1 - y0)}"
    return (f'<svg class="hall__art" viewBox="{vb}" preserveAspectRatio="none" focusable="false" aria-hidden="true">'
            f'{L.svg()}</svg>')


def spill_svg(sil, pool):
    """lamplight on the threshold and steps: stepped glazes, inside the .spill box (clip-path polygon in HTML)."""
    pen = Pen(77)
    xs = [p[0] for p in sil]
    ys = [p[1] for p in sil]
    x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    L = Layer()
    px, py = pool
    GRAD.clear()
    glow(pen, L, "ab-pool", px, py + (y1 - y0) * 0.18, (x1 - x0) * 0.46, (y1 - y0) * 0.62,
         stops=((0, "core", 0.85), (0.3, "mid", 0.55), (0.7, "mid", 0.2), (1, "mid", 0.04)), cls="lg i-night", gc=(px, py))
    defs = "<defs>" + "".join(GRAD) + "</defs>"
    vb = f"{r1(x0)} {r1(y0)} {r1(x1 - x0)} {r1(y1 - y0)}"
    return (f'<svg class="spill__art" viewBox="{vb}" preserveAspectRatio="none" focusable="false" aria-hidden="true">'
            f'{defs}{L.svg()}</svg>')


# =========================================================================
def leaf_svg(side):
    """One door leaf, drawn flat in its own plane (99 x 360 units; 1 unit = 0.852 scene units)."""
    pen = Pen(101 if side == "l" else 202)
    W = LEAF_W * U   # 99
    H = LEAF_H * U   # 360
    st = 15.0
    top_r = 15.0
    lock_c = 150.0
    lock_h = 28.0
    bot = 33.0
    y_lock0 = H - lock_c - lock_h / 2
    y_lock1 = H - lock_c + lock_h / 2
    panels = [(st, top_r, W - st, y_lock0), (st, y_lock1, W - st, H - bot)]
    bev = 9.0
    L = Layer()
    whole = [(0, 0), (W, 0), (W, H), (0, H)]
    L.add("lf-base", f"M0 0H{r1(W)}V{r1(H)}H0Z")
    L.add("w w-wood", pen.wash(whole, rough=0.9, step=14, grow=-0.6))
    # the walnut is darker low down and on the hinge side: a second glaze
    g2 = [(0, H * 0.45), (W * 0.55, H * 0.5), (W * 0.7, H), (0, H)] if side == "l" else [(W * 0.45, H * 0.5), (W, H * 0.45), (W, H), (W * 0.3, H)]
    L.add("w w-wood2", pen.wash(g2, rough=2.5, step=14, lumpy=1.5))
    grain, hatch_, sh_w = [], [], []
    for (x0, y0, x1, y1) in panels:
        fx0, fy0, fx1, fy1 = x0 + bev, y0 + bev, x1 - bev, y1 - bev
        # shaded bevels (right and bottom: sun from the upper left)
        rb_ = [(x1, y0), (x1, y1), (fx1, fy1), (fx1, fy0)]
        bb_ = [(x0, y1), (x1, y1), (fx1, fy1), (fx0, fy1)]
        sh_w.append(pen.wash(rb_, rough=0.4, step=7))
        sh_w.append(pen.wash(bb_, rough=0.4, step=7))
        hatch_.append(pen.hatch(rb_, ang=58, sp=3.0, loose=0.4, skip=0.08))
        hatch_.append(pen.hatch(bb_, ang=58, sp=3.0, loose=0.4, skip=0.08))
        # grain on the fielded panel: long wavering strokes
        for k in range(3):
            gx = fx0 + (fx1 - fx0) * (0.2 + 0.3 * k + pen.r.uniform(-0.08, 0.08))
            pts = [(gx + 1.2 * math.sin(t * 0.045 + k) + pen.r.uniform(-0.3, 0.3), t) for t in range(int(fy0 + 6), int(fy1 - 6), 6)]
            if len(pts) > 3:
                a_ = pen.r.randint(0, len(pts) // 3)
                b_ = len(pts) - pen.r.randint(0, len(pts) // 3)
                grain.append(pen.curve(pts[a_:b_], wob=0.4, step=22, lift=0))
    # grain on the stiles
    for gx in (st * 0.35, st * 0.7, W - st * 0.4, W - st * 0.75):
        pts = [(gx + 0.8 * math.sin(t * 0.03 + gx), t) for t in range(4, int(H - 4), 8)]
        a_ = pen.r.randint(0, 12)
        b_ = len(pts) - pen.r.randint(0, 12)
        grain.append(pen.curve(pts[a_:b_], wob=0.4, step=26, lift=180))
    L.add("w w-wood-dk", "".join(sh_w))
    L.add("k k-h k-wood", "".join(hatch_))
    L.add("k k-f k-wood k-grain", "".join(grain))
    ink, ink2 = [], []
    ink.append(pen.poly(whole, closed=True, wob=0.6, double=0.35))
    for (x0, y0, x1, y1) in panels:
        fx0, fy0, fx1, fy1 = x0 + bev, y0 + bev, x1 - bev, y1 - bev
        ink.append(pen.poly([(x0, y0), (x1, y0), (x1, y1), (x0, y1)], wob=0.6, over=(0.2, 1.6)))
        ink2.append(pen.poly([(fx0, fy0), (fx1, fy0), (fx1, fy1), (fx0, fy1)], wob=0.5, over=(0.1, 1.2)))
        for a_, b_ in (((x0, y0), (fx0, fy0)), ((x1, y0), (fx1, fy0)), ((x0, y1), (fx0, fy1)), ((x1, y1), (fx1, fy1))):
            ink2.append(pen.line(a_, b_, wob=0.3, over=(0, 0.6), short=0.3, lift=0))
        # the moulding round the panel: a second line just outside
        ink2.append(pen.poly([(x0 - 3, y0 - 3), (x1 + 3, y0 - 3), (x1 + 3, y1 + 3), (x0 - 3, y1 + 3)], wob=0.6, over=(0, 1.0), short=0.35))
    L.add("k k-wood", "".join(ink))
    L.add("k k-2 k-wood", "".join(ink2))
    # brass: hinges, knob and rose, escutcheon (wash, then a quick ink ring)
    hinge_x = 1.2 if side == "l" else W - 1.2
    br, bl = [], []
    for y in (26, 172, 322):
        hp = [(hinge_x - 1.6, y), (hinge_x + 1.6, y), (hinge_x + 1.6, y + 13), (hinge_x - 1.6, y + 13)]
        br.append(pen.wash(hp, rough=0.2, step=2))
        bl.append(pen.poly(hp, wob=0.2, over=(0, 0.5)))
    knob_x = W - 11 if side == "l" else 11
    ky = H - lock_c - 2
    br.append(pen.blob(knob_x, ky, 5.6, 5.6, rough=0.3, step=1.5))
    bl.append(pen.curve(ellipse_pts(knob_x, ky, 5.6, 5.6, 20, 370, 16), wob=0.2, step=2.5, lift=0))
    bl.append(pen.curve(ellipse_pts(knob_x + 0.5, ky - 0.3, 3.0, 3.0, 200, 520, 12), wob=0.2, step=2, lift=0))
    if side == "r":
        ep = [(knob_x - 2.4, ky + 13), (knob_x + 2.4, ky + 13), (knob_x + 2.4, ky + 23), (knob_x - 2.4, ky + 23)]
        br.append(pen.wash(ep, rough=0.2, step=1.5))
        bl.append(pen.poly(ep, wob=0.2, over=(0, 0.4)))
        bl.append(pen.line((knob_x, ky + 16), (knob_x, ky + 20.5), wob=0, over=(0, 0)))
    L.add("w w-brass", "".join(br))
    L.add("k k-f k-wood", "".join(bl))
    L.add("i-leaf-turn", f"M0 0H{r1(W)}V{r1(H)}H0Z")
    edge_x = W - 3 if side == "l" else 0
    L.add("i-leaf-edge", f"M{r1(edge_x)} 0h3V{r1(H)}h-3Z")
    return (f'<svg viewBox="0 0 {r1(W)} {r1(H)}" focusable="false">' + L.svg().replace("\n", "") + "</svg>")


if __name__ == "__main__":
    o = build()
    print(len(o["body"]), len(o["back"]), len(o["hall"]), len(leaf_svg("l")), o["leaf"], o["vp"])
