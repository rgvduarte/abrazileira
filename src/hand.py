"""hand.py · an architect's pen and brush, baked into SVG geometry.

Everything here works in screen units (the scene's SVG user space) and returns plain path data.
Nothing is random at run time: every stroke is seeded, so the drawing is identical on every build
and every device. No filters: the irregularity lives in the coordinates.

Pen (ink, stroked paths, round caps):
  line()   a ruled-by-eye straight line: slight bow or S, endpoints that cross at corners (overshoot)
           or stop short, a pen lift on long runs, an optional second pass
  curve()  a freehand curve through a dense polyline (arcs, profiles), with the same habits
  hatch()  parallel strokes clipped (loosely) to a polygon, uneven spacing, drifting angle,
           optional tone function that lets strokes die out towards the light
Brush (washes, filled paths):
  wash()   a polygon with a wet, irregular edge (fractal displacement along the normal)
  blob()   an organic patch (foliage masses, glazes of lamplight)
"""
import math, random


def f1(v):
    s = f"{v:.1f}"
    if s in ("-0.0", "0.0"):
        return "0"
    if s.endswith(".0"):
        s = s[:-2]
    if s.startswith("0."):
        s = s[1:]
    elif s.startswith("-0."):
        s = "-" + s[2:]
    return s


def rp(p):
    return (round(p[0], 1), round(p[1], 1))


def rel(a, b):
    """relative move from rounded a to rounded b, compact."""
    dx, dy = b[0] - a[0], b[1] - a[1]
    sy = f1(dy)
    return f1(dx) + ("" if sy.startswith("-") else " ") + sy


def absf(p):
    sy = f1(p[1])
    return f1(p[0]) + ("" if sy.startswith("-") else " ") + sy


def lerp(a, b, t):
    return (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)


def dist(a, b):
    return math.hypot(b[0] - a[0], b[1] - a[1])


class Pen:
    def __init__(self, seed=1):
        self.r = random.Random(seed)

    # ------------------------------------------------------------------ primitives
    def _cubic(self, a, b, wob):
        """one stroke a->b as a relative cubic with perpendicular control offsets."""
        r = self.r
        L = dist(a, b) or 1e-6
        ux, uy = (b[0] - a[0]) / L, (b[1] - a[1]) / L
        nx, ny = -uy, ux
        s = wob * min(2.4, 0.18 + 0.011 * L)
        bow = r.gauss(0, s * 0.8)
        c1 = r.gauss(bow, s * 0.55)
        c2 = r.gauss(bow, s * 0.55)
        t1 = r.uniform(0.26, 0.4)
        t2 = r.uniform(0.6, 0.74)
        p1 = (a[0] + ux * L * t1 + nx * c1, a[1] + uy * L * t1 + ny * c1)
        p2 = (a[0] + ux * L * t2 + nx * c2, a[1] + uy * L * t2 + ny * c2)
        A, P1, P2, B = rp(a), rp(p1), rp(p2), rp(b)
        if L < 7 or wob == 0:
            return "M" + absf(A) + "l" + rel(A, B)
        return "M" + absf(A) + "c" + rel(A, P1) + " " + rel(A, P2) + " " + rel(A, B)

    def line(self, a, b, wob=1.0, over=(0.4, 2.8), short=0.18, lift=150, double=0.0, gap=0.0, jit=0.35):
        """a straight line drawn by hand. Returns path data (one or more subpaths)."""
        r = self.r
        L = dist(a, b)
        if L < 0.5:
            return ""
        ux, uy = (b[0] - a[0]) / L, (b[1] - a[1]) / L
        nx, ny = -uy, ux

        def end(sign):
            if r.random() < short:
                return -r.uniform(0.2, min(2.2, L * 0.08))
            return r.uniform(*over) * min(1.0, 0.35 + L / 60)
        e0, e1 = end(-1), end(1)
        j0, j1 = r.gauss(0, jit), r.gauss(0, jit)
        A = (a[0] - ux * e0 + nx * j0, a[1] - uy * e0 + ny * j0)
        B = (b[0] + ux * e1 + nx * j1, b[1] + uy * e1 + ny * j1)
        out = []
        # pen lifts on long runs: the hand restarts with a small overlap or gap
        n = 1 + int(L / lift) if lift else 1
        cuts = sorted(r.uniform(0.32, 0.68) if n == 2 else (k + r.uniform(-0.18, 0.18)) / n for k in range(1, n)) if n > 1 else []
        ts = [0.0] + cuts + [1.0]
        prev_off = 0.0
        for i in range(len(ts) - 1):
            ta, tb = ts[i], ts[i + 1]
            pa = lerp(A, B, ta)
            pb = lerp(A, B, tb)
            if i > 0:   # restart: overlap a little (or leave a hair gap), a touch off the old line
                g = r.uniform(-2.6, 1.2)
                off = prev_off + r.gauss(0, 0.45)
                pa = (pa[0] + ux * g + nx * off, pa[1] + uy * g + ny * off)
                prev_off = off
            if i < len(ts) - 2:
                pb = (pb[0] + nx * prev_off, pb[1] + ny * prev_off)
            else:
                pb = (pb[0] + nx * prev_off * 0.3, pb[1] + ny * prev_off * 0.3)
            if gap and r.random() < gap and dist(pa, pb) > 24:   # a lost edge: the line breaks where light hits
                tm = r.uniform(0.3, 0.7)
                gl = r.uniform(3, 9) / dist(pa, pb)
                out.append(self._cubic(pa, lerp(pa, pb, tm - gl / 2), wob))
                out.append(self._cubic(lerp(pa, pb, tm + gl / 2), pb, wob))
            else:
                out.append(self._cubic(pa, pb, wob))
        if double and r.random() < double:
            k = r.uniform(0.15, 0.85)
            sh = r.choice((-1, 1)) * r.uniform(0.55, 1.2)
            t0 = r.uniform(0.0, 0.35) * (1 if L > 30 else 0)
            t1 = r.uniform(0.6, 1.0) if L > 30 else 1.0
            pa, pb = lerp(A, B, t0), lerp(A, B, t1)
            pa = (pa[0] + nx * sh, pa[1] + ny * sh)
            pb = (pb[0] + nx * sh * k, pb[1] + ny * sh * k)
            out.append(self._cubic(pa, pb, wob * 1.2))
        return "".join(out)

    def poly(self, pts, closed=True, **kw):
        segs = list(zip(pts, pts[1:] + (pts[:1] if closed else [])))
        return "".join(self.line(a, b, **kw) for a, b in segs)

    def curve(self, pts, wob=1.0, step=13.0, lift=240, double=0.0, over=(0.3, 2.2), noise=1.0, split_at=None):
        """freehand stroke through a dense polyline (screen space)."""
        r = self.r
        if len(pts) < 2:
            return ""
        # arc length
        cum = [0.0]
        for i in range(1, len(pts)):
            cum.append(cum[-1] + dist(pts[i - 1], pts[i]))
        L = cum[-1]
        if L < 1:
            return ""

        def at(s):
            s = max(0.0, min(L, s))
            lo, hi = 0, len(cum) - 1
            while hi - lo > 1:
                m = (lo + hi) // 2
                if cum[m] <= s:
                    lo = m
                else:
                    hi = m
            seg = cum[hi] - cum[lo] or 1e-9
            t = (s - cum[lo]) / seg
            p = lerp(pts[lo], pts[hi], t)
            d = (pts[hi][0] - pts[lo][0], pts[hi][1] - pts[lo][1])
            dl = math.hypot(*d) or 1
            return p, (d[0] / dl, d[1] / dl)
        # perpendicular noise: one long wave, two shorter ones
        waves = [(L * r.uniform(0.8, 1.4), r.uniform(0.5, 1.0)), (r.uniform(45, 80), r.uniform(0.25, 0.5)), (r.uniform(16, 26), r.uniform(0.08, 0.18))]
        ph = [r.uniform(0, 6.283) for _ in waves]
        amp = wob * noise * min(1.8, 0.35 + L / 260)

        def n_(s):
            return amp * sum(a * math.sin(6.283 * s / lam + p) for (lam, a), p in zip(waves, ph))
        # strokes (pen lifts)
        n = 1 + int(L / lift) if lift else 1
        bounds = [0.0]
        if split_at:
            bounds += [L * f for f in split_at]
        else:
            for k in range(1, n):
                bounds.append(L * (k + r.uniform(-0.2, 0.2)) / n)
        bounds.append(L)
        out = []
        for i in range(len(bounds) - 1):
            s0, s1 = bounds[i], bounds[i + 1]
            if i == 0:
                s0 -= r.uniform(*over) if r.random() > 0.2 else -r.uniform(0, 1.5)
            else:
                s0 -= r.uniform(-1.0, 3.0)
            if i == len(bounds) - 2:
                s1 += r.uniform(*over) if r.random() > 0.2 else -r.uniform(0, 1.5)
            m = max(2, int((s1 - s0) / step) + 1)
            P = []
            dj = r.gauss(0, 0.3) if i else 0
            for k in range(m + 1):
                s = s0 + (s1 - s0) * k / m
                p, (tx, ty) = at(s)
                if s < 0:
                    p = (p[0] + tx * s, p[1] + ty * s)
                elif s > L:
                    p = (p[0] + tx * (s - L), p[1] + ty * (s - L))
                o = n_(s) + dj
                P.append((p[0] - ty * o, p[1] + tx * o))
            out.append(catmull(P))
        if double and r.random() < double:
            sh = r.choice((-1, 1)) * r.uniform(0.5, 1.1)
            a0, a1 = r.uniform(0, 0.3) * L, r.uniform(0.65, 1.0) * L
            m = max(2, int((a1 - a0) / step) + 1)
            P = []
            for k in range(m + 1):
                s = a0 + (a1 - a0) * k / m
                p, (tx, ty) = at(s)
                o = n_(s) * 1.3 + sh * (0.6 + 0.4 * math.sin(3.14 * k / m))
                P.append((p[0] - ty * o, p[1] + tx * o))
            out.append(catmull(P))
        return "".join(out)

    # ------------------------------------------------------------------ hatching
    def hatch(self, poly, ang=58, sp=4.2, wob=0.6, loose=1.2, skip=0.07, drift=4.0, tone=None, minlen=2.5,
              spread=0.22, curl=0.0, dash=0):
        """parallel strokes over a polygon (screen space). ang in degrees from +x, counter-clockwise on screen
        (58 = '/' rising to the right). tone(x, y) -> 0..1 darkness; strokes are trimmed where it fades."""
        r = self.r
        a = math.radians(-ang)          # screen y points down
        ux, uy = math.cos(a), math.sin(a)
        nx, ny = -uy, ux
        ds = [p[0] * nx + p[1] * ny for p in poly]
        d0, d1 = min(ds), max(ds)
        out = []
        d = d0 + r.uniform(0.2, 0.8) * sp
        k = 0
        while d < d1:
            k += 1
            dd = math.radians(r.gauss(0, drift * 0.25) + drift * math.sin(k * 0.21))
            cu, su = math.cos(a + dd), math.sin(a + dd)
            for (s0, s1) in clip_line(poly, (nx * d, ny * d), (cu, su)):
                if r.random() < skip:
                    continue
                s0 += r.gauss(0, loose) - loose * 0.2
                s1 += r.gauss(0, loose) + loose * 0.2
                p0 = (nx * d + cu * s0, ny * d + su * s0)
                p1 = (nx * d + cu * s1, ny * d + su * s1)
                if tone:
                    # walk from the dark end; stop where the tone falls below this stroke's threshold
                    th = r.uniform(0.0, 1.0)
                    pts = [lerp(p0, p1, i / 8) for i in range(9)]
                    on = [tone(*q) > th for q in pts]
                    runs, cur = [], None
                    for i, o in enumerate(on):
                        if o and cur is None:
                            cur = i
                        if (not o or i == 8) and cur is not None:
                            runs.append((cur, i if o else i - 1))
                            cur = None
                    segs = [(pts[i0], pts[i1]) for i0, i1 in runs if i1 > i0]
                else:
                    segs = [(p0, p1)]
                for q0, q1 in segs:
                    if dist(q0, q1) < minlen:
                        continue
                    if dash and dist(q0, q1) > dash:
                        Lq = dist(q0, q1)
                        t = 0.0
                        while t < Lq:
                            l_ = r.uniform(0.4, 1.0) * dash
                            a_, b_ = lerp(q0, q1, t / Lq), lerp(q0, q1, min(Lq, t + l_) / Lq)
                            if dist(a_, b_) >= minlen:
                                out.append(self.tick(a_, b_, wob, curl))
                            t += l_ + r.uniform(0.15, 0.6) * dash
                        continue
                    out.append(self.tick(q0, q1, wob, curl))
            d += sp * r.uniform(1 - spread, 1 + spread)
        return "".join(out)

    def qc(self, a, c, b):
        """a quick curved stroke a -> b bending towards c (one quadratic)."""
        A, C, B = (round(a[0]), round(a[1])), rp(c), rp(b)
        return "M" + absf(A) + "q" + rel(A, C) + " " + rel(A, B)

    def tick(self, a, b, wob=0.6, curl=0.0):
        """a short fast stroke (hatch line, mark): relative quadratic, maybe a hooked tail."""
        r = self.r
        L = dist(a, b)
        nx, ny = -(b[1] - a[1]) / (L or 1), (b[0] - a[0]) / (L or 1)
        bw = r.gauss(0, wob * (0.15 + L * 0.02))
        c = ((a[0] + b[0]) / 2 + nx * bw, (a[1] + b[1]) / 2 + ny * bw)
        # a hatch stroke's start may land anywhere within half a unit: whole numbers, fewer bytes
        A, C, B = (round(a[0]), round(a[1])), rp(c), rp(b)
        s = "M" + absf(A) + "q" + rel(A, C) + " " + rel(A, B)
        if curl and r.random() < curl:
            h = r.uniform(0.8, 1.8)
            sgn = r.choice((-1, 1))
            H = rp((b[0] + nx * h * sgn - (b[0] - a[0]) / (L or 1) * h * 0.6, b[1] + ny * h * sgn - (b[1] - a[1]) / (L or 1) * h * 0.6))
            s += "l" + rel(B, H)
        return s

    # ------------------------------------------------------------------ brush
    def wash(self, poly, rough=2.0, step=6.0, grow=0.0, closed=True, lumpy=1.0, fine=1.0):
        """a closed polygon with a wet irregular edge; grow > 0 pushes the edge outward (overspill).
        The edge is a smooth spline: watercolour edges wander, they are not torn."""
        r = self.r
        pts = resample(poly + poly[:1], step)
        if len(pts) > 1 and dist(pts[0], pts[-1]) < 0.01:
            pts = pts[:-1]
        n = len(pts)
        if n < 3:
            return ""
        area = sum(pts[i][0] * pts[(i + 1) % n][1] - pts[(i + 1) % n][0] * pts[i][1] for i in range(n))
        sgn = 1 if area > 0 else -1
        per = sum(dist(pts[i], pts[(i + 1) % n]) for i in range(n))
        if step >= 9:
            fine = 0.0       # a coarse spline cannot carry the short ripple: leave it out rather than alias it
        waves = [(per / r.randint(2, 4), 1.0 * lumpy), (r.uniform(30, 50), 0.5), (r.uniform(12, 18), 0.22 * fine)]
        ph = [r.uniform(0, 6.283) for _ in waves]
        out = []
        s = 0.0
        for i in range(n):
            a, b, c = pts[i - 1], pts[i], pts[(i + 1) % n]
            tx, ty = c[0] - a[0], c[1] - a[1]
            tl = math.hypot(tx, ty) or 1
            nx, ny = ty / tl * sgn, -tx / tl * sgn
            if i:
                s += dist(a, b)
            o = grow + rough * sum(w * math.sin(6.283 * s / lam + p) for (lam, w), p in zip(waves, ph))
            out.append((b[0] + nx * o, b[1] + ny * o))
        if n <= 4 or step <= 2.5:
            return polyd(out, closed=True)
        return catmull(out, closed=True)

    def blob(self, cx, cy, rx, ry, rough=None, step=6.0, rot=0.0, lumpy=1.0):
        n = max(10, int(2 * math.pi * max(rx, ry) / step))
        cr, sr = math.cos(rot), math.sin(rot)
        pts = []
        for i in range(n):
            t = 2 * math.pi * i / n
            x, y = rx * math.cos(t), ry * math.sin(t)
            pts.append((cx + x * cr - y * sr, cy + x * sr + y * cr))
        return self.wash(pts, rough if rough is not None else 0.14 * min(rx, ry) + 0.6, step, lumpy=lumpy)


# ---------------------------------------------------------------------- helpers
def polyd(pts, closed=True):
    P = [rp(p) for p in pts]
    s = "M" + absf(P[0])
    prev = P[0]
    for p in P[1:]:
        if p == prev:
            continue
        s += "l" + rel(prev, p)
        prev = p
    return s + ("z" if closed else "")


def resample(pts, step):
    """points every `step` along the polyline (true arc length: dense input is thinned, sparse input filled)."""
    cum = [0.0]
    for a, b in zip(pts, pts[1:]):
        cum.append(cum[-1] + dist(a, b))
    L = cum[-1]
    if L == 0:
        return [pts[0]]
    n = max(3, int(round(L / step)))
    out, j = [], 0
    for k in range(n + 1):
        sd = L * k / n
        while j < len(cum) - 2 and cum[j + 1] < sd:
            j += 1
        seg = cum[j + 1] - cum[j] or 1e-9
        out.append(lerp(pts[j], pts[j + 1], (sd - cum[j]) / seg))
    return out


def catmull(P, closed=False):
    """Catmull-Rom through P as relative cubic Beziers (1 decimal). The spline's handles are mirror images
    at every knot, so after the first segment each one is written as a short 's' command."""
    n = len(P)
    if n == 2 and not closed:
        A, B = rp(P[0]), rp(P[1])
        return "M" + absf(A) + "l" + rel(A, B)
    s = "M" + absf(rp(P[0]))
    cur = rp(P[0])
    segs = n if closed else n - 1
    for i in range(segs):
        if closed:
            p0, p1, p2, p3 = P[i - 1], P[i], P[(i + 1) % n], P[(i + 2) % n]
        else:
            p0 = P[i - 1] if i else P[0]
            p1, p2 = P[i], P[i + 1]
            p3 = P[i + 2] if i + 2 < n else P[-1]
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        C2, E = rp(c2), rp(p2)
        if i == 0:
            c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
            s += "c" + rel(cur, rp(c1)) + " " + rel(cur, C2) + " " + rel(cur, E)
        else:
            s += "s" + rel(cur, C2) + " " + rel(cur, E)
        cur = E
    return s + ("z" if closed else "")


def clip_line(poly, o, u):
    """intervals (s0, s1) of the line o + s*u inside the polygon (even-odd)."""
    xs = []
    n = len(poly)
    for i in range(n):
        a, b = poly[i], poly[(i + 1) % n]
        ex, ey = b[0] - a[0], b[1] - a[1]
        den = u[0] * ey - u[1] * ex
        if abs(den) < 1e-12:
            continue
        wx, wy = a[0] - o[0], a[1] - o[1]
        s = (wx * ey - wy * ex) / den
        t = (wx * u[1] - wy * u[0]) / den
        if 0 <= t < 1:
            xs.append(s)
    xs.sort()
    return [(xs[i], xs[i + 1]) for i in range(0, len(xs) - 1, 2)]


def ellipse_pts(cx, cy, rx, ry, a0=0, a1=360, n=40):
    return [(cx + rx * math.cos(math.radians(a0 + (a1 - a0) * i / n)), cy + ry * math.sin(math.radians(a0 + (a1 - a0) * i / n))) for i in range(n + 1)]
