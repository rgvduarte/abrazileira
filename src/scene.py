"""A Brazileira · "A Porta" entrance illustration generator.

A generic Portuguese stone doorway drawn in true one-point perspective:
geometry is modelled in metres (X right, Y up, Z into the picture) and
projected onto the picture plane (front face of the lower step).
Outputs inline SVG markup that only uses CSS classes (colours live in tokens.css).

Light logic (Dia): sun from the upper left. Faces pointing up or left are lit
(areia), faces toward the viewer are mid (pedra), faces pointing down or right
are in shade. Noite: the only light comes from the door gap, the fanlight and
the lantern.
"""
import math, random

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


def r1(v):
    s = f"{v:.1f}"
    return "0" if s in ("-0.0", "0.0") else s.rstrip("0").rstrip(".") if "." in s else s


EXT = []


def P(X, Y, Z):
    s = D / (D + Z * U)
    p = (X * U * s, G - (EYE + (Y * U - EYE) * s))
    EXT.append(p)
    return p


def sc(Z):
    return D / (D + Z * U)


def pt(p):
    return f"{r1(p[0])} {r1(p[1])}"


def poly(pts, close=True):
    d = "M" + pt(pts[0]) + "".join("L" + pt(p) for p in pts[1:])
    return d + ("Z" if close else "")


def line(a, b):
    return "M" + pt(a) + "L" + pt(b)


def rect3(x0, y0, x1, y1, Z):
    return poly([P(x0, y0, Z), P(x1, y0, Z), P(x1, y1, Z), P(x0, y1, Z)])


def arc_pts(cx, cy, r, a0, a1, Z, n=None):
    """points along a circle arc in a plane of constant Z (angles in degrees, world, CCW)."""
    if n is None:
        n = max(2, int(abs(a1 - a0) / 4))
    return [P(cx + r * math.cos(math.radians(a0 + (a1 - a0) * i / n)),
              cy + r * math.sin(math.radians(a0 + (a1 - a0) * i / n)), Z) for i in range(n + 1)]


def arc_cmd(cx, cy, r, a0, a1, Z, start=True):
    """SVG arc (circles parallel to the picture plane stay circles). World CCW = screen CW."""
    p0 = P(cx + r * math.cos(math.radians(a0)), cy + r * math.sin(math.radians(a0)), Z)
    p1 = P(cx + r * math.cos(math.radians(a1)), cy + r * math.sin(math.radians(a1)), Z)
    R = r * U * sc(Z)
    large = 1 if abs(a1 - a0) > 180 else 0
    # world counter-clockwise (a1 > a0) is counter-clockwise on screen too once y flips: sweep 0
    sweep = 0 if a1 > a0 else 1
    head = ("M" + pt(p0)) if start else ("L" + pt(p0))
    return head + f"A{r1(R)} {r1(R)} 0 {large} {sweep} {pt(p1)}"


# =========================================================================
def build():
    out = {}
    L = []   # front svg layers (strings): everything in front of the hall
    B = []   # back svg layers: the hall behind the door plane (room, floor, night glow)
    add = L.append
    back = B.append

    # ---------------- steps ----------------
    # two limestone steps of equal width projecting from the wall
    BW = STEP_W
    lower_riser = rect3(-BW, 0, BW, 0.16, 0)
    lower_tread = poly([P(-BW, .16, 0), P(BW, .16, 0), P(BW, .16, .32), P(-BW, .16, .32)])
    upper_riser = rect3(-BW, .16, BW, SILL, .32)
    upper_tread = poly([P(-BW, SILL, .32), P(BW, SILL, .32), P(BW, SILL, WALL), P(-BW, SILL, WALL)])
    threshold = poly([P(-A, SILL, WALL), P(A, SILL, WALL), P(A, SILL, BACK), P(-A, SILL, BACK)])
    add(f'<path class="i-tread" d="{lower_tread}{upper_tread}{threshold}"/>')
    add(f'<path class="i-riser" d="{lower_riser}{upper_riser}"/>')
    steps_clip = lower_riser + lower_tread + upper_riser + upper_tread + threshold

    # ---------------- interior (behind the leaves) ----------------
    HALL = BACK + 4.0
    door_open = rect3(-LEAF_W, SILL, LEAF_W, SILL + LEAF_H, BACK)
    back(f'<path class="i-room" d="{door_open}"/>')
    # floor of the hall (lit wedge by day is too small to read: flat)
    # hall floor = band between the far wall base and the threshold (only a sliver shows)
    yb = P(0, SILL, HALL)[1]
    fx0, fy0 = P(-LEAF_W, SILL, BACK)
    fx1, fy1 = P(LEAF_W, SILL, BACK)
    floor = poly([(fx0, fy0), (fx1, fy1), (fx1, yb), (fx0, yb)])
    back(f'<path class="i-room-floor" d="{floor}"/>')
    # night: the hall glows (radial light) — content, not decoration
    gx, gy = P(0, SILL + 1.1, BACK)
    back(f'<path class="i-glow i-night i-door-light" fill="url(#ab-hall)" d="{door_open}"/>')
    back(f'<path class="i-fine" d="M{r1(fx0)} {r1(yb)}H{r1(fx1)}"/>')
    out["hall_floor"] = (fy0 - yb)   # floor band height (svg units), from the sill up to the far wall base
    # pendant lamp in the hall (z = 2.6 m)
    ZL = BACK + 1.6
    lx, ly = P(0, SILL + 2.12, ZL)
    lw = 0.17 * U * sc(ZL)
    lh = 0.12 * U * sc(ZL)
    top_y = P(0, SILL + LEAF_H, BACK)[1]
    # the pendant lamp is drawn in the front layer so the hall light (an HTML layer between the two svgs) never hides it
    add(f'<path class="i-fine i-cord" d="M0 {r1(top_y)}V{r1(ly - lh)}"/>')
    shade = (f"M{r1(-lw)} {r1(ly)}C{r1(-lw)} {r1(ly - lh * 0.9)} {r1(-lw * 0.45)} {r1(ly - lh)} 0 {r1(ly - lh)}"
             f"C{r1(lw * 0.45)} {r1(ly - lh)} {r1(lw)} {r1(ly - lh * 0.9)} {r1(lw)} {r1(ly)}Z")
    add(f'<path class="i-lamp" d="{shade}"/>')
    add(f'<ellipse class="i-bulb i-night" cx="0" cy="{r1(ly + 1.2)}" rx="{r1(lw * 0.55)}" ry="{r1(lh * 0.32)}"/>')

    # ---------------- reveal (wall thickness) ----------------
    lrev = poly([P(-A, SILL, WALL), P(-A, IMP, WALL), P(-A, IMP, BACK), P(-A, SILL, BACK)])
    rrev = poly([P(A, SILL, WALL), P(A, IMP, WALL), P(A, IMP, BACK), P(A, SILL, BACK)])
    # soffit: front arc left->right over the top, then the door-plane arc back
    fr = arc_cmd(0, IMP, A, 180, 0, WALL)
    bk = arc_cmd(0, IMP, A, 0, 180, BACK, start=False)
    soffit = fr + bk + "Z"
    add(f'<path class="i-shade" d="{lrev}{soffit}"/>')
    add(f'<path class="i-lit" d="{rrev}"/>')
    add(f'<path class="i-reveal-glow i-night i-door-light" d="{lrev}{rrev}{soffit}"/>')

    # ---------------- door frame, transom, fanlight (door plane) ----------------
    frame = (rect3(-A, SILL, -LEAF_W, IMP, BACK) + rect3(LEAF_W, SILL, A, IMP, BACK)
             + rect3(-LEAF_W, SILL + LEAF_H, LEAF_W, IMP, BACK))
    add(f'<path class="i-wood" d="{frame}"/>')
    FR = A          # fanlight outer radius (meets the arch)
    FRI = A - 0.05  # glass outer radius
    HUB = 0.095
    glass = arc_cmd(0, IMP, FRI, 180, 0, BACK) + "Z"
    ring = arc_cmd(0, IMP, FR, 180, 0, BACK) + arc_cmd(0, IMP, FRI, 0, 180, BACK, start=False) + "Z"
    add(f'<path class="i-glass" d="{glass}"/>')
    add(f'<path class="i-glow i-night" fill="url(#ab-fan)" d="{glass}"/>')
    add(f'<path class="i-wood" d="{ring}"/>')
    hub = arc_cmd(0, IMP, HUB, 180, 0, BACK) + "Z"
    add(f'<path class="i-wood-lit" d="{hub}"/>')
    bars = []
    for k in range(1, 8):
        a = math.radians(22.5 * k)
        bars.append(line(P(HUB * math.cos(a), IMP + HUB * math.sin(a), BACK),
                         P(FRI * math.cos(a), IMP + FRI * math.sin(a), BACK)))
    mid = arc_cmd(0, IMP, 0.44, 180, 0, BACK)
    add(f'<path class="i-bar" d="{"".join(bars)}{mid}"/>')
    # door-plane line work
    dl = [ring, hub, rect3(-A, SILL, A, IMP, BACK).replace("Z", ""),
          line(P(-LEAF_W, SILL, BACK), P(-LEAF_W, SILL + LEAF_H, BACK)),
          line(P(LEAF_W, SILL, BACK), P(LEAF_W, SILL + LEAF_H, BACK)),
          line(P(-LEAF_W, SILL + LEAF_H, BACK), P(LEAF_W, SILL + LEAF_H, BACK)),
          line(P(-A, IMP, BACK), P(A, IMP, BACK))]
    add(f'<path class="i-line" d="{"".join(dl)}"/>')
    # transom moulding (fine)
    add(f'<path class="i-fine" d="{line(P(-A, IMP - 0.025, BACK), P(A, IMP - 0.025, BACK))}"/>')

    # ---------------- stone surround (wall face) ----------------
    RO = A + J          # extrados radius 1.00
    PL = 0.30           # plinth height
    PLX = 0.02          # plinth projection
    IH = 0.12           # impost height
    IX = 0.035          # impost projection
    KS = 8.18           # keystone half angle
    KT = RO + 0.11      # keystone top radius
    # outline of the whole surround, as one stone face
    left_out = [P(-RO - PLX, SILL, WALL), P(-RO - PLX, SILL + PL, WALL), P(-RO, SILL + PL, WALL),
                P(-RO, IMP - IH, WALL), P(-RO - IX, IMP - IH, WALL), P(-RO - IX, IMP, WALL), P(-RO, IMP, WALL)]
    right_out = [P(RO, IMP, WALL), P(RO + IX, IMP, WALL), P(RO + IX, IMP - IH, WALL), P(RO, IMP - IH, WALL),
                 P(RO, SILL + PL, WALL), P(RO + PLX, SILL + PL, WALL), P(RO + PLX, SILL, WALL)]
    # keystone corners
    k_l_in = math.radians(90 + KS)
    k_r_in = math.radians(90 - KS)
    kt_l = P(-0.13, IMP + KT, WALL)
    kt_r = P(0.13, IMP + KT, WALL)
    kb_l = P(RO * math.cos(k_l_in), IMP + RO * math.sin(k_l_in), WALL)
    kb_r = P(RO * math.cos(k_r_in), IMP + RO * math.sin(k_r_in), WALL)
    extr_l = arc_cmd(0, IMP, RO, 180, 90 + KS, WALL, start=False)
    extr_r = arc_cmd(0, IMP, RO, 90 - KS, 0, WALL, start=False)
    outer = ("M" + "L".join(pt(p) for p in left_out) + extr_l + "L" + pt(kt_l) + "L" + pt(kt_r) + "L" + pt(kb_r)
             + extr_r + "L" + "L".join(pt(p) for p in right_out))
    inner = ("L" + pt(P(A, SILL, WALL)) + "L" + pt(P(A, IMP, WALL))
             + arc_cmd(0, IMP, A, 0, 180, WALL, start=False) + "L" + pt(P(-A, SILL, WALL)) + "Z")
    surround = outer + inner
    cs = 0.03 * U * sc(WALL)
    add(f'<path class="i-cast" transform="translate({r1(cs)} {r1(cs)})" d="{surround}"/>')
    add(f'<path class="i-stone" d="{surround}"/>')
    # joints: plinth tops, jamb courses, impost, voussoirs
    joints = []
    for sgn in (-1, 1):
        joints.append(line(P(sgn * A, SILL + PL, WALL), P(sgn * RO, SILL + PL, WALL)))
        for yy in (SILL + PL + 0.72, SILL + PL + 1.42):
            joints.append(line(P(sgn * A, yy, WALL), P(sgn * RO, yy, WALL)))
        joints.append(line(P(sgn * A, IMP - IH, WALL), P(sgn * RO, IMP - IH, WALL)))
        joints.append(line(P(sgn * (RO + IX), IMP - IH * 0.45, WALL), P(sgn * A, IMP - IH * 0.45, WALL)))
    n_v = 11
    step = 180.0 / n_v
    for k in range(1, n_v):
        a = k * step
        if abs(a - 90) < step / 2 + 0.01:
            continue
        ar = math.radians(a)
        if abs(a - (90 - KS)) < 0.5 or abs(a - (90 + KS)) < 0.5:
            continue
        joints.append(line(P(A * math.cos(ar), IMP + A * math.sin(ar), WALL),
                           P(RO * math.cos(ar), IMP + RO * math.sin(ar), WALL)))
    # keystone sides (main line, stone edge)
    ks = [line(P(A * math.cos(k_l_in), IMP + A * math.sin(k_l_in), WALL), kb_l),
          line(P(A * math.cos(k_r_in), IMP + A * math.sin(k_r_in), WALL), kb_r)]
    add(f'<path class="i-fine" d="{"".join(joints)}"/>')
    # moulded inner edge (a fillet 3.5 cm in from the opening)
    F = 0.035
    fil = ("M" + pt(P(-A - F, SILL + PL, WALL)) + "L" + pt(P(-A - F, IMP, WALL))
           + arc_cmd(0, IMP, A + F, 180, 0, WALL, start=False) + "L" + pt(P(A + F, SILL + PL, WALL)))
    add(f'<path class="i-fine" d="{fil}"/>')
    add(f'<path class="i-line" d="{surround}{"".join(ks)}"/>')

    # step line work (bottom edge = page floor line, not drawn)
    sl = [poly([P(-BW, 0, 0), P(-BW, .16, 0), P(BW, .16, 0), P(BW, 0, 0)], close=False),
          poly([P(-BW, .16, 0), P(-BW, .16, .32), P(-BW, SILL, .32), P(-BW, SILL, WALL), P(-RO - PLX, SILL, WALL)], close=False),
          poly([P(BW, .16, 0), P(BW, .16, .32), P(BW, SILL, .32), P(BW, SILL, WALL), P(RO + PLX, SILL, WALL)], close=False),
          line(P(-BW, .16, .32), P(BW, .16, .32)), line(P(-BW, SILL, .32), P(BW, SILL, .32)),
          line(P(-A, SILL, BACK), P(A, SILL, BACK))]
    add(f'<path class="i-line" d="{"".join(sl)}"/>')
    # nosing shadow just under each tread edge
    nos = [line(P(-BW + 0.015, .145, 0), P(BW - 0.015, .145, 0)), line(P(-BW + 0.015, SILL - .015, .32), P(BW - 0.015, SILL - .015, .32))]
    add(f'<path class="i-fine" d="{"".join(nos)}"/>')

    # night light pool on the steps, clipped to the stone
    px, py = P(-0.03, SILL, BACK - 0.05)
    out["pool"] = (px, py)
    add(f'<g class="i-night i-door-light"><path class="i-pool" clip-path="url(#ab-steps)" fill="url(#ab-pool)" d="{steps_clip}"/></g>')

    # ---------------- lantern (left, on the wall) ----------------
    add(lantern())

    # ---------------- olive tree in a pot (right, on the street) ----------------
    add(olive())

    # defs
    glass_c = P(0, IMP, BACK)
    fanR = FRI * U * sc(BACK)
    hall_c = P(0, SILL + 0.9, HALL)
    back_defs = f"""<defs>
<radialGradient id="ab-hall" gradientUnits="userSpaceOnUse" cx="{r1(gx)}" cy="{r1(P(0, SILL + 1.5, BACK)[1])}" r="{r1(1.9 * U * sc(BACK))}"><stop offset="0" class="s-core"/><stop offset=".45" class="s-mid"/><stop offset="1" class="s-edge"/></radialGradient>
</defs>"""
    defs = f"""<defs>
<radialGradient id="ab-fan" gradientUnits="userSpaceOnUse" cx="{r1(glass_c[0])}" cy="{r1(glass_c[1])}" r="{r1(fanR)}"><stop offset="0" class="s-core"/><stop offset=".55" class="s-mid"/><stop offset="1" class="s-edge"/></radialGradient>
<radialGradient id="ab-pool" gradientUnits="userSpaceOnUse" cx="{r1(px)}" cy="{r1(py)}" r="{r1(1.35 * U)}" gradientTransform="translate({r1(px)} {r1(py)}) scale(1 .36) translate({r1(-px)} {r1(-py)})"><stop offset="0" class="s-core"/><stop offset=".3" class="s-mid s-o6"/><stop offset="1" class="s-edge s-o0"/></radialGradient>
<radialGradient id="ab-lamp" gradientUnits="userSpaceOnUse" cx="{r1(LANT['c'][0])}" cy="{r1(LANT['c'][1])}" r="{r1(LANT['r'])}"><stop offset="0" class="s-core"/><stop offset=".6" class="s-mid"/><stop offset="1" class="s-edge"/></radialGradient>
<radialGradient id="ab-halo" gradientUnits="userSpaceOnUse" cx="{r1(LANT['c'][0])}" cy="{r1(LANT['c'][1])}" r="{r1(0.85 * U)}"><stop offset="0" class="s-mid s-o4"/><stop offset=".4" class="s-mid s-o1"/><stop offset="1" class="s-mid s-o0"/></radialGradient>
<clipPath id="ab-steps"><path d="{steps_clip}"/></clipPath>
</defs>"""
    body = "\n".join(L)
    # insert halo right after the surround (so it lights stone and wall), before the lantern
    halo = f'<circle class="i-night i-halo" cx="{r1(LANT["c"][0])}" cy="{r1(LANT["c"][1])}" r="{r1(0.85 * U)}" fill="url(#ab-halo)"/>'
    body = body.replace("<!--halo-->", halo)

    # leaves (door plane rectangles) and viewbox
    lt = P(-LEAF_W, SILL + LEAF_H, BACK)
    rb = P(LEAF_W, SILL, BACK)
    out["leaf"] = dict(x0=lt[0], y0=lt[1], x1=rb[0], y1=rb[1])
    out["vp"] = (0, G - EYE)
    out["defs"] = defs
    out["body"] = body
    out["back_defs"] = back_defs
    out["back"] = "\n".join(B)
    # the light that spills onto the threshold and the steps once the doors open (an HTML layer,
    # clipped to the silhouette of the steps so it lights stone only, never the wall)
    sil = [P(-BW, 0, 0), P(BW, 0, 0), P(BW, .16, 0), P(BW, .16, .32), P(BW, SILL, .32), P(BW, SILL, WALL),
           P(A, SILL, WALL), P(A, SILL, BACK), P(-A, SILL, BACK), P(-A, SILL, WALL), P(-BW, SILL, WALL),
           P(-BW, SILL, .32), P(-BW, .16, .32), P(-BW, .16, 0)]
    out["spill"] = dict(pts=sil, pool=(px, py))
    return out


LANT = {}


def lantern():
    """Wall lantern: a square iron lantern seen on its corner, hung from a scrolled arm."""
    Z = WALL
    s = sc(Z)
    X0, Yh = -1.31, 3.04          # hang point on the arm

    def p(x, y):
        return P(X0 + x, Yh + y, Z)

    def ball(x, y, r):
        c = p(x, y)
        R = r * U * s
        return (f"M{r1(c[0] - R)} {r1(c[1])}a{r1(R)} {r1(R)} 0 1 0 {r1(2 * R)} 0"
                f"a{r1(R)} {r1(R)} 0 1 0 {r1(-2 * R)} 0Z")

    def cub(a, c1, c2, b, start=False):
        return (("M" + pt(p(*a))) if start else "") + "C" + pt(p(*c1)) + " " + pt(p(*c2)) + " " + pt(p(*b))

    iron, lines, fine = [], [], []
    # wall plate (slim, rounded ends) and the arm
    px_ = 0.235
    iron.append(poly([p(px_ - .012, .05), p(px_ + .012, .05), p(px_ + .012, -.23), p(px_ - .012, -.23)]))
    iron.append(poly([p(px_ - .012, .014), p(-.025, .014), p(-.025, 0), p(px_ - .012, 0)]))
    iron.append(ball(-.04, .007, .014))
    # C-scroll under the arm, from the plate up into the arm, ending in a curl
    lines.append(cub((px_ - .016, -.19), (.10, -.19), (.04, -.12), (.055, -.04), start=True)
                 + cub((.055, -.04), (.06, -.005), (.11, -.02), (.10, -.055))
                 + cub((.10, -.055), (.09, -.08), (.065, -.06), (.08, -.045)))
    # hanger ring
    lines.append(line(p(0, -.002), p(0, -.026)))
    fine.append(ball(0, -.033, .008).replace("Z", ""))
    # roof: an ogee bell with a finial
    iron.append(ball(0, -.05, .012))
    iron.append(poly([p(-.022, -.06), p(.022, -.06), p(.026, -.082), p(-.026, -.082)]))
    roof = (cub((-.026, -.082), (-.03, -.125), (-.15, -.11), (-.165, -.158), start=True)
            + "L" + pt(p(.165, -.158))
            + cub((.165, -.158), (.15, -.11), (.03, -.125), (.026, -.082)) + "Z")
    iron.append(roof)
    iron.append(poly([p(-.172, -.158), p(.172, -.158), p(.172, -.176), p(-.172, -.176)]))
    # body: tapered, seen on its corner (two panes and the corner post)
    bt, bb, wt, wb = -.176, -.565, .138, .104
    gl = poly([p(-wt, bt), p(0, bt), p(0, bb), p(-wb, bb)])
    gr = poly([p(0, bt), p(wt, bt), p(wb, bb), p(0, bb)])
    frame_lines = [gl, gr]

    def xw(y):
        return wt + (wb - wt) * (y - bt) / (bb - bt)
    gy = bt + (bb - bt) * .22
    fine.append(line(p(-xw(gy), gy), p(xw(gy), gy)))
    # bottom band, cone and drop finial
    iron.append(poly([p(-wb - .012, bb), p(wb + .012, bb), p(wb + .012, bb - .02), p(-wb - .012, bb - .02)]))
    iron.append(poly([p(-wb + .008, bb - .02), p(wb - .008, bb - .02), p(.018, bb - .085), p(-.018, bb - .085)]))
    iron.append(ball(0, bb - .1, .015))
    LANT["c"] = p(0, (bt + bb) / 2)
    LANT["r"] = (bb - bt) * -0.62 * U * s
    return ("<!--halo-->\n" +
            f'<g class="i-lantern"><path class="i-lglass" d="{gl}"/><path class="i-lglass i-lglass--r" d="{gr}"/>'
            f'<path class="i-glow i-night" fill="url(#ab-lamp)" d="{gl}{gr}"/>'
            f'<path class="i-iron" d="{"".join(iron)}"/>'
            f'<path class="i-line" d="{"".join(frame_lines)}{"".join(lines)}"/>'
            f'<path class="i-fine" d="{"".join(fine)}"/></g>')


def olive():
    """Young olive tree in a stone pot on the street (z = 0), right of the steps.
    Botanical rules: opposite, lanceolate leaves, silvery underside, sprays that droop at the tip."""
    rnd = random.Random(23)
    Z = 0.0
    PX = 1.40

    def q(x, y):
        return P(PX + x, y, Z)

    # ---- pot: rolled rim, full belly, narrow foot; no band
    H = 0.6
    prof = [(.158, H), (.18, H - .028), (.176, H - .055), (.156, H - .078), (.196, H - .2), (.205, H - .285),
            (.186, H - .405), (.143, H - .495), (.11, .042), (.12, .02), (.12, 0)]

    def smooth(points):
        d = "M" + pt(points[0])
        for i in range(1, len(points) - 1):
            mx = (points[i][0] + points[i + 1][0]) / 2
            my = (points[i][1] + points[i + 1][1]) / 2
            d += f"Q{pt(points[i])} {r1(mx)} {r1(my)}"
        return d + "L" + pt(points[-1])
    right = [q(x, y) for x, y in prof]
    left = [q(-x, y) for x, y in prof][::-1]
    pot = smooth(right) + "L" + smooth(left)[1:] + "Z"
    rim_line = line(q(-.176, H - .055), q(.176, H - .055))
    shade = (f"M{pt(q(.07, H - .078))}Q{pt(q(.2, H - .24))} {pt(q(.135, H - .495))}"
             f"L{pt(q(.143, H - .495))}Q{pt(q(.235, H - .285))} {pt(q(.156, H - .078))}Z")
    soil = poly([q(-.152, H - .01), q(.152, H - .01), q(.152, H - .028), q(-.152, H - .028)])

    # ---- tree
    bodies, twigs, leaves_a, leaves_b, leaves_c = [], [], [], [], []

    def bez(a, c, b, t):
        return ((1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t ** 2 * b[0],
                (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t ** 2 * b[1])

    def tapered(a, c, b, w0, w1, n=8):
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
        return poly(L_ + R_[::-1])

    def leaf(x, y, ang, L, W, curv):
        ca, sa = math.cos(math.radians(ang)), math.sin(math.radians(ang))

        def w2s(u, v):
            return q(x + u * sa + v * ca, y + u * ca - v * sa)
        tip = w2s(L, curv * W)
        c1 = w2s(L * .42, W * (1.05 + curv * .3))
        c2 = w2s(L * .58, -W * (0.95 - curv * .3))
        b = w2s(0, 0)
        # relative commands keep the many small leaves light
        bx_, by_ = float(r1(b[0])), float(r1(b[1]))
        tx_, ty_ = float(r1(tip[0])), float(r1(tip[1]))
        rel = lambda p_, o_: f"{r1(p_[0] - o_[0])} {r1(p_[1] - o_[1])}"
        return (f"M{r1(bx_)} {r1(by_)}q{rel(c1, (bx_, by_))} {r1(tx_ - bx_)} {r1(ty_ - by_)}"
                f"q{rel(c2, (tx_, ty_))} {r1(bx_ - tx_)} {r1(by_ - ty_)}z")

    def clump(cx, cy, r, n, lean):
        """a natural cluster: leaves grow from twigs around a branch end, pointing outward and drooping."""
        for k in range(rnd.randint(3, 5)):
            a = rnd.uniform(0, 2 * math.pi)
            tx, ty = cx + r * .8 * math.cos(a), cy + r * .55 * math.sin(a)
            mx_, my_ = (cx + tx) / 2 + rnd.uniform(-.02, .02), (cy + ty) / 2 + rnd.uniform(-.02, .02)
            twigs.append(f"M{pt(q(cx, cy))}Q{pt(q(mx_, my_))} {pt(q(tx, ty))}")
        for i in range(n):
            a = rnd.uniform(0, 2 * math.pi)
            d = r * math.sqrt(rnd.random())
            bx, by = cx + d * math.cos(a), cy + d * math.sin(a) * .62
            out = math.degrees(math.atan2(bx - cx, by - cy)) if d > 1e-6 else rnd.uniform(-180, 180)
            la = out + rnd.uniform(-38, 38) + lean
            # gravity: leaves on the lower half hang a little more
            if by < cy:
                la = la + (180 - la if la > 0 else -180 - la) * .18
            L_ = rnd.uniform(.072, .108)
            W_ = L_ * rnd.uniform(.15, .2)
            lf = leaf(bx, by, la, L_, W_, rnd.uniform(-.45, .45))
            r_ = rnd.random()
            if by < cy - r * .15 and r_ < .5:
                leaves_c.append(lf)
            elif r_ < .3:
                leaves_b.append(lf)
            else:
                leaves_a.append(lf)

    def spray(sx, sy, ang, length, droop):
        ex = sx + length * .6 * math.sin(math.radians(ang))
        ey = sy + length * .6 * math.cos(math.radians(ang)) - droop * length * .3
        twigs.append(f"M{pt(q(sx, sy))}L{pt(q(ex, ey))}")
        clump(ex, ey, length * .62, int(11 + length * 48), (ang * .15))

    # trunk: short, leaning, slightly twisted
    base, fork = (0.0, H - .02), (-.04, H + .5)
    bodies.append(tapered(base, (.05, H + .24), fork, .036, .026, 12))
    twist = (f"M{pt(q(.014, H + .02))}Q{pt(q(.045, H + .22))} {pt(q(-.022, H + .44))}")
    limbs = [(-44, .62, .02), (-14, .74, .021), (14, .66, .02), (40, .52, .017)]
    for ang, ln, wd in limbs:
        ang += rnd.uniform(-4, 4)
        ex = fork[0] + ln * math.sin(math.radians(ang))
        ey = fork[1] + ln * math.cos(math.radians(ang))
        c = ((fork[0] + ex) / 2 + rnd.uniform(-.05, .05), (fork[1] + ey) / 2)
        bodies.append(tapered(fork, c, (ex, ey), wd, .006))
        for k in range(rnd.randint(3, 4)):
            t = rnd.uniform(.32, .86)
            bx, by = bez(fork, c, (ex, ey), t)
            a2 = ang + rnd.choice([-1, 1]) * rnd.uniform(28, 55)
            l2 = rnd.uniform(.18, .3)
            e2 = (bx + l2 * math.sin(math.radians(a2)), by + l2 * math.cos(math.radians(a2)))
            c2 = ((bx + e2[0]) / 2, (by + e2[1]) / 2 + .02)
            bodies.append(tapered((bx, by), c2, e2, wd * .45, .004, 5))
            spray(e2[0], e2[1], a2 + rnd.uniform(-12, 12), rnd.uniform(.2, .28), rnd.uniform(.05, .35))
            spray(bx, by, a2 + rnd.choice([-1, 1]) * rnd.uniform(20, 40), rnd.uniform(.13, .19), rnd.uniform(.1, .45))
        spray(ex, ey, ang + rnd.uniform(-10, 10), rnd.uniform(.22, .3), rnd.uniform(.0, .2))
        for tt in (.42, .62, .82):
            mx, my = bez(fork, c, (ex, ey), tt)
            spray(mx, my, ang + rnd.choice([-1, 1]) * rnd.uniform(40, 75), rnd.uniform(.13, .2), rnd.uniform(.2, .55))

    return (f'<g class="i-olive"><path class="i-trunk" d="{"".join(bodies)}"/>'

            f'<path class="i-twig" d="{"".join(twigs)}"/>'
            f'<path class="i-leaf-c" d="{"".join(leaves_c)}"/><path class="i-leaf-a" d="{"".join(leaves_a)}"/>'
            f'<path class="i-leaf-b" d="{"".join(leaves_b)}"/>'
            f'<path class="i-fine i-bark" d="{twist}"/></g>'
            f'<g class="i-pot-g"><path class="i-pot" d="{pot}"/><path class="i-pot-shade" d="{shade}"/>'
            f'<path class="i-soil" d="{soil}"/>'
            f'<path class="i-line" d="{pot}{rim_line}"/></g>')


def leaf_svg(side):
    """One door leaf, drawn flat in its own plane (units = U per metre)."""
    W = LEAF_W * U   # 99
    H = LEAF_H * U   # 360
    st = 15.0
    top_r = 15.0
    lock_c = 150.0   # lock rail centre, from the bottom
    lock_h = 28.0
    bot = 33.0
    y_lock0 = H - lock_c - lock_h / 2
    y_lock1 = H - lock_c + lock_h / 2
    panels = [(st, top_r, W - st, y_lock0), (st, y_lock1, W - st, H - bot)]
    bev = 9.0
    lit, shade, fine, line_ = [], [], [], []
    def R(x0, y0, x1, y1):
        return f"M{r1(x0)} {r1(y0)}H{r1(x1)}V{r1(y1)}H{r1(x0)}Z"
    for (x0, y0, x1, y1) in panels:
        fx0, fy0, fx1, fy1 = x0 + bev, y0 + bev, x1 - bev, y1 - bev
        lit.append(f"M{r1(x0)} {r1(y0)}H{r1(x1)}L{r1(fx1)} {r1(fy0)}H{r1(fx0)}V{r1(fy1)}L{r1(x0)} {r1(y1)}Z")
        shade.append(f"M{r1(x1)} {r1(y0)}V{r1(y1)}H{r1(x0)}L{r1(fx0)} {r1(fy1)}H{r1(fx1)}V{r1(fy0)}Z")
        line_.append(R(x0, y0, x1, y1))
        fine.append(R(fx0, fy0, fx1, fy1))
        fine.append(f"M{r1(x0)} {r1(y0)}L{r1(fx0)} {r1(fy0)}M{r1(x1)} {r1(y0)}L{r1(fx1)} {r1(fy0)}"
                    f"M{r1(x0)} {r1(y1)}L{r1(fx0)} {r1(fy1)}M{r1(x1)} {r1(y1)}L{r1(fx1)} {r1(fy1)}")
        fine.append(R(x0 - 3, y0 - 3, x1 + 3, y1 + 3))
    hinge_x = 0 if side == "l" else W - 2.5
    free_x = W if side == "l" else 0
    hinges = "".join(f"M{r1(hinge_x)} {r1(y)}h2.5v13h-2.5Z" for y in (26, 172, 322))
    knob_x = W - 11 if side == "l" else 11
    ky = H - lock_c - 2
    knob = (f"M{r1(knob_x - 3.4)} {r1(ky)}a3.4 3.4 0 1 0 6.8 0a3.4 3.4 0 1 0 -6.8 0Z")
    rose = f"M{r1(knob_x - 5.6)} {r1(ky)}a5.6 5.6 0 1 0 11.2 0a5.6 5.6 0 1 0 -11.2 0Z"
    esc = ""
    if side == "r":
        esc = f"M{r1(knob_x - 2.4)} {r1(ky + 13)}h4.8v10h-4.8Z"
    astragal = ""
    edge_x = W - 3 if side == "l" else 0
    out = (f'<svg viewBox="0 0 {r1(W)} {r1(H)}" focusable="false">'
           f'<path class="i-wood" d="M0 0H{r1(W)}V{r1(H)}H0Z"/>'
           f'<path class="i-wood-lit" d="{"".join(lit)}"/><path class="i-wood-shade" d="{"".join(shade)}"/>'
           f'{astragal}'
           f'<path class="i-fine i-fine--wood" d="{"".join(fine)}"/>'
           f'<path class="i-line" d="M0 0H{r1(W)}V{r1(H)}H0Z{"".join(line_)}"/>'
           f'<path class="i-brass" d="{hinges}{knob}{esc}"/><path class="i-brass-line" d="{rose}"/>'
           f'<path class="i-leaf-turn" d="M0 0H{r1(W)}V{r1(H)}H0Z"/>'
           f'<path class="i-leaf-edge" d="M{r1(edge_x)} 0h3V{r1(H)}h-3Z"/>'
           f'</svg>')
    return out


if __name__ == "__main__":
    o = build()
    print(len(o["body"]), o["leaf"], o["vp"])
