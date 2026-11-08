/* A Brazileira · site.js
   Progressive enhancement only: without it the page is complete (the theme follows the system,
   no pinned sequence, the waiting list explains how to sign up).
   1. Dia / Noite   2. The door sequence (scroll-linked)   3. The waiting list   4. The list rises in once */
(function () {
  "use strict";
  /* errors are collected for the ?diag panel (and so a failing sequence can step aside, see bail()) */
  var ERR = (window.__abErr = window.__abErr || []);
  window.addEventListener("error", function (e) { ERR.push(String(e.message || e.error || e)); });
  window.addEventListener("unhandledrejection", function (e) { ERR.push("promise: " + String(e.reason)); });
  var root = document.documentElement,
    still = window.matchMedia("(prefers-reduced-motion: reduce)"),
    keyed = false, PRESS = ["pointerdown", "mousedown", "touchstart"], ki;
  /* Input modality: did the visitor last press a key, or touch / click? Only a keyboard arrival may move the page
     to show what took the focus; a tap or a click never does (a page that jumps under the finger moves the
     button away from the press, and the press is lost). Recorded in the capture phase, before any focus moves. */
  window.addEventListener("keydown", function () { keyed = true; }, true);
  for (ki = 0; ki < PRESS.length; ki++) window.addEventListener(PRESS[ki], function () { keyed = false; }, { capture: true, passive: true });

  /* ---------------------------------------------------------------- 1. Dia / Noite
     The head script has already set data-theme: the visitor's stored choice; otherwise the sky over Torres
     Vedras (then data-sol is set, and a short line under the control says so: «É noite em Torres Vedras.»).
     The system's dark mode only decides without JavaScript (CSS). */
  (function () {
    var group = document.querySelector("[data-theme-switch]"),
      dark = window.matchMedia("(prefers-color-scheme: dark)"),
      KEY = "ab-tema",
      sol = root.__sol,
      picked = false,
      timer, solT;
    if (!group) return;
    var buttons = group.querySelectorAll("[data-theme-set]"),
      note = document.getElementById("sol-note");
    try { var s0 = localStorage.getItem(KEY); picked = s0 === "dia" || s0 === "noite"; } catch (e) {}

    function current() {
      var t = root.getAttribute("data-theme");
      return t === "dia" || t === "noite" ? t : dark.matches ? "noite" : "dia";
    }
    /* the theme of a visitor who has not chosen: the sky over the house */
    function free(now) { return sol(now) ? "dia" : "noite"; }
    function sync() {
      var t = current(), i, metas = document.querySelectorAll('meta[name="theme-color"]'), told = root.hasAttribute("data-sol") && note;
      for (i = 0; i < buttons.length; i++) {
        buttons[i].setAttribute("aria-pressed", String(buttons[i].getAttribute("data-theme-set") === t));
        if (told) buttons[i].setAttribute("aria-describedby", note.id); else buttons[i].removeAttribute("aria-describedby");
      }
      if (root.hasAttribute("data-theme")) {
        var bg = getComputedStyle(root).getPropertyValue("--color-bg").trim() || getComputedStyle(document.body).backgroundColor;
        for (i = 0; i < metas.length; i++) metas[i].setAttribute("content", bg);
      }
    }
    /* colour transitions on controls and links are held for this one change, so nothing catches up after it
       (under reduced motion the change is instant; inside a view transition the new snapshot is clean) */
    function apply(t, keep, sky) {
      root.classList.add("is-instant");
      root.setAttribute("data-theme", t);
      if (keep) {                         /* a choice: it wins over the sky from now on, and is remembered */
        picked = true;
        root.removeAttribute("data-sol");
        try { localStorage.setItem(KEY, t); } catch (e) {}
      } else if (sky !== undefined) {
        if (sky) root.setAttribute("data-sol", ""); else root.removeAttribute("data-sol");
      }
      sync();                             /* reads the computed style: the change lands with transitions held */
      window.requestAnimationFrame(function () { root.classList.remove("is-instant"); });
    }
    /* the cross-fade: 400ms for a choice; slower and gentler (--dur-sky) when the sky changes it on its own.
       No snapshot while the sequence is moving, and none with reduced motion. */
    function swap(t, keep, sky) {
      var slow = !keep && sky !== undefined;
      if (still.matches || (root.__portaBusy && root.__portaBusy())) return apply(t, keep, sky);
      if (slow) root.classList.add("is-sky");
      if (document.startViewTransition) {
        var vt = document.startViewTransition(function () { apply(t, keep, sky); }),
          end = function () { root.classList.remove("is-sky"); };
        if (vt && vt.finished) vt.finished.then(end, end); else end();
        return;
      }
      root.classList.add("is-theming");
      apply(t, keep, sky);
      clearTimeout(timer);
      timer = setTimeout(function () { root.classList.remove("is-theming", "is-sky"); }, slow ? 1650 : 450);
    }
    group.addEventListener("click", function (e) {
      var b = e.target.closest("[data-theme-set]");
      if (!b) return;
      var t = b.getAttribute("data-theme-set");
      if (t === current()) return;        /* the theme already shown: nothing to choose, nothing is stored */
      swap(t, true);
    });
    /* Torres Vedras time: until the visitor chooses, the page keeps the sky over the house (head script). If
       the sun rises or sets while the page is open, the lamps come on (or go out) with a slow cross-fade, once,
       at that minute; while the sequence is moving it waits until the page rests. A tab coming back from the
       background catches up at once. */
    function sky() {
      clearTimeout(solT);
      if (picked || !sol) return;
      var now = Date.now(), t = free(now), up, m;
      if (t !== current() || !root.hasAttribute("data-sol")) {
        if (root.__portaBusy && root.__portaBusy()) { solT = setTimeout(sky, 700); return; }
        if (t !== current()) swap(t, false, true); else apply(t, false, true);
      }
      up = sol(now);
      for (m = 1; m <= 1440 && sol(now + m * 60000) === up; m++);   /* the next sunrise or sunset, to the minute */
      if (m <= 1440) solT = setTimeout(sky, m * 60000 - (now % 60000) + 500);
    }
    document.addEventListener("visibilitychange", function () { if (!document.hidden) sky(); });
    group.hidden = false;
    sync();
    sky();
  })();

  /* ---------------------------------------------------------------- 2. The door sequence
     ONE driver for every browser. A passive scroll listener (and the resize, visualViewport and
     orientation listeners) wakes one requestAnimationFrame loop. Each frame reads pageYOffset and
     nothing else, turns it into the scroll progress p, clamped to [0, 1] (rubber-band overscroll above
     the top or past the end never pushes a layer beyond its rest or end state), and moves the RENDERED
     progress towards it with an exponential follow that does not depend on the frame rate:
       r += (p - r) * (1 - exp(-dt / tau)),  tau = --scroll-tau (90ms)
     It snaps when the gap is under 0.0005, and at once on jumps (a link, a focus move, a restored
     position), writes transform / opacity on the moving layers only, and stops when it has settled.
     Native scrolling is never touched: the stage pins with position: sticky; the smoothing only shapes
     what is drawn inside it. Geometry is cached and measured again on resize, visualViewport resize,
     orientation change, font load and page load, never inside the loop. At p = 0 every inline style is
     removed, so the hero is exactly its CSS rest state (opacity 1, no transform).
     (The former ViewTimeline / WAAPI path is gone: in iOS Safari it could leave the title hidden after
     scrolling back up, and mobile toolbars made it drift.) */
  (function () {
    var wrap = document.querySelector("[data-porta]");
    if (!wrap) return;
    var $ = function (s) { return wrap.querySelector(s); },
      stage = $(".porta__stage"), frame = $(".porta__frame"), intro = $(".intro"), scene = $(".scene"),
      back = $(".scene__art--back"), backHidden = false,
      door = (scene.getAttribute("data-door") || "0.5 0.5 0.3 0.5").split(" ").map(Number),
      css = getComputedStyle(root),
      num = function (n, d) { var v = parseFloat(css.getPropertyValue(n)); return isNaN(v) ? d : v; },
      openL = num("--open-l", 47), openR = num("--open-r", 61),
      TAU = num("--scroll-tau", 90), EPS = 0.0005, JUMP = 0.35,
      cam = { dx: 0, dy: 0, s: 4, k: 0 }, pin = 0, run = 1,
      probe = document.createElement("div"),
      cue = $(".porta__cue"),
      list = document.getElementById("lista"), reveal = list && list.querySelector("[data-reveal]"),
      rv = function (s) { return (reveal && reveal.querySelector(s)) || document.createElement("i"); },
      shown = -1, seen = -1, lit = false, raf = 0, last = 0, lastY = NaN, calm = 0, promoted = false, idle, rq = 0, on = false;
    probe.className = "porta__probe";
    probe.setAttribute("aria-hidden", "true");
    stage.appendChild(probe);

    /* the curves are tokens (tokens.css --curve-*): read once, evaluated per frame */
    function bezier(c) {
      var x1 = c[0], y1 = c[1], x2 = c[2], y2 = c[3];
      function f(t, a, b) { return ((1 - 3 * b + 3 * a) * t + (3 * b - 6 * a)) * t * t + 3 * a * t; }
      return function (x) {
        if (x <= 0) return 0;
        if (x >= 1) return 1;
        var lo = 0, hi = 1, t = x;
        for (var i = 0; i < 24; i++) { var v = f(t, x1, x2); if (Math.abs(v - x) < 1e-5) break; if (v < x) lo = t; else hi = t; t = (lo + hi) / 2; }
        return f(t, y1, y2);
      };
    }
    function curve(name, d) {
      var m = css.getPropertyValue(name).match(/-?\d*\.?\d+/g);
      return bezier(m && m.length === 4 ? m.map(Number) : d);
    }
    var E = {
      copy: curve("--curve-copy", [0.33, 1, 0.68, 1]),
      door: curve("--curve-door", [0.3, 0.55, 0.35, 1]),
      pan: curve("--curve-pan", [0.35, 0.4, 0.3, 1]),
      fade: curve("--curve-fade", [0.45, 0, 0.55, 1]),
      rise: curve("--ease-out", [0.23, 1, 0.32, 1]),
      flight: curve("--curve-flight", [0.45, 0, 0.3, 1])
    };
    var FLIGHT = num("--dur-flight", 1200), WEIGHT = num("--flight-weight", 2), RISE = num("--rise-list", 16);
    function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

    /* The timeline: [element, from p, to p, curve, value(u) -> [opacity, transform], progress].
       One short run (--porta-run, about one screen of scroll) in three overlapping beats:
         the doors swing from the first pixel and the camera starts with them (0 -> 0.36);
         the camera walks in through the doorway and keeps going until the opening covers the screen (to 0.76):
           on the way, from 0.5 to 0.66, the hall dissolves into its light while the room still reads as a room
           (the camera's keyframes, see measure()), so the last drawn things on screen are the stone jambs and
           the open leaves passing out of the frame;
         at 0.76 the screen is one flat colour, --color-hall, and the list (title + sentence, then the form)
           rises in on that light at once, over the last quarter of the run, and is at rest when the run ends.
       Progress: the rendered (smoothed) r, except
         TEXT  the crest and the cue take min(r, p): they leave with the doors, but come back with the scroll
               itself, so after a fast flick to the top the title is there as the page arrives, not 500ms later;
         COVER the hand-off layers take max(r, p - LAG): at hand speed (lag under 0.1) exactly r; after a fast
               flick the stage is flat hall colour before the list panel arrives (p = 1), never a hard edge
               rising over a drawing the smoothing has not caught up with.
       The list (LIST) reads r, so it never shows before the flood (which reads max(r, p - LAG)): its words
       only ever rise over the flat colour. The flood is a step at COVER_AT: hall colour over hall colour (the
       camera has covered the screen there), so no frame is ever a fractional blend one level off the token. */
    var DOOR = [0, 0.36], PAN = [0, 0.3], ZOOM = [0.01, 0.76], LIGHT = [0.5, 0.66], COVER_AT = 0.76, COVERED = COVER_AT, LAG = 0.1,
      TEXT = 1, COVER = 2, LIST = 3, step = function (x) { return x > 0 ? 1 : 0; },
      lift = function (k) { return function (u) { return [u, "translate(0," + ((1 - u) * RISE * k).toFixed(2) + "px)"]; }; };
    var DISSOLVE = [$(".hall__flat"), LIGHT[0], LIGHT[1], E.fade, function (u) { return [u, null]; }, COVER];
    var T = [
      [intro, 0, 0.14, E.copy, function (u) { return [1 - u, "translate(0," + (-16 * u).toFixed(2) + "px)"]; }, TEXT],
      [cue, 0, 0.05, E.copy, function (u) { return [1 - u, null]; }, TEXT],
      [$(".leaf--l"), DOOR[0], DOOR[1], E.door, function (u) { return [null, "rotateY(" + (openL * u).toFixed(3) + "deg)"]; }],
      [$(".leaf--r"), DOOR[0], DOOR[1], E.door, function (u) { return [null, "rotateY(" + (-openR * u).toFixed(3) + "deg)"]; }],
      [$(".hall__light"), DOOR[0], DOOR[1], E.door, function (u) { return [u, null]; }],     /* carried by the doors */
      [$(".spill"), DOOR[0], DOOR[1], E.door, function (u) { return [u, null]; }],
      DISSOLVE,                                                                               /* the hall becomes light */
      [$(".porta__flood"), COVER_AT, COVER_AT + 0.01, step, function (u) { return [u, null]; }, COVER],   /* one colour */
      /* the list: title, sentence and form all begin as the screen turns one colour (so none of them is ever an
         empty field on it) and settle one after the other: the stagger is in how long each takes */
      [rv(".lista__title"), 0.745, 0.88, E.rise, lift(1), LIST],
      [rv(".lista__lede"), 0.75, 0.9, E.rise, lift(1), LIST],
      [rv(".form"), 0.755, 0.94, E.rise, lift(0.6), LIST]
    ];
    /* the camera: the doorway travels to the centre of the screen while the text leaves, then the walk-in
       scales the scene around it until the opening covers the screen. Scale is geometric (constant
       perceived speed); the doorway centre moves on a straight line. */
    /* On portrait screens the doorway starts low (the drawing stands at the foot of the screen): if it rose to
       the centre before growing, the floor line would ride up and leave an empty band under it, a page scrolling
       rather than a camera approaching. There the rise is tied to the walk-in: the doorway rises only as much as
       it grows, so the floor line holds at the visitor's feet and then leaves through the bottom edge (as when
       walking towards a door). It is centred by s = 1 + |dy| / floor distance (about 2.7 at 390 x 844), and in
       any case by p = 0.66, before the opening covers the screen. */
    function camAt(p) {
      var m = E.pan(clamp((p - PAN[0]) / (PAN[1] - PAN[0]))), s = scaleAt(p),
        my = cam.k ? Math.max(clamp((s - 1) * cam.k), clamp((p - 0.4) / 0.26)) : m;
      return "translate(" + (cam.dx * m).toFixed(2) + "px," + (cam.dy * my).toFixed(2) + "px) scale(" + s.toFixed(4) + ")";
    }
    /* The walk-in: log(scale) through four keyframes, made per screen in measure(): 1 at ZOOM[0]; the scale at
       which the hall starts to dissolve at LIGHT[0] and the one at which it is all light at LIGHT[1]; S (the
       opening covers the screen) at ZOOM[1]. Between them a monotone cubic (Fritsch-Carlson): it never goes
       back, never overshoots, starts softly (zero slope) and keeps going into the light (no landing: the screen
       is one colour by then). Scale is geometric, so equal steps of log(scale) read as equal steps forward. */
    var KX = [ZOOM[0], LIGHT[0], LIGHT[1], ZOOM[1]], KY = [0, 1, 1.5, 2], KM = [0, 0, 0, 0];
    function keys(sA, sB, S) {
      var i, d = [], a, b, h;
      KY = [0, Math.log(sA), Math.log(sB), Math.log(S)];
      for (i = 0; i < 3; i++) d.push((KY[i + 1] - KY[i]) / (KX[i + 1] - KX[i]));
      KM = [0, (d[0] + d[1]) / 2, (d[1] + d[2]) / 2, d[2]];
      for (i = 0; i < 3; i++) {
        if (d[i] <= 0) { KM[i] = KM[i + 1] = 0; continue; }
        a = KM[i] / d[i]; b = KM[i + 1] / d[i]; h = a * a + b * b;
        if (h > 9) { h = 3 / Math.sqrt(h); KM[i] = h * a * d[i]; KM[i + 1] = h * b * d[i]; }
      }
    }
    function scaleAt(p) {
      if (p <= KX[0]) return 1;
      if (p >= KX[3]) return Math.exp(KY[3]);
      var i = p < KX[1] ? 0 : p < KX[2] ? 1 : 2, h = KX[i + 1] - KX[i], t = (p - KX[i]) / h, t2 = t * t, t3 = t2 * t;
      return Math.exp((2 * t3 - 3 * t2 + 1) * KY[i] + (t3 - 2 * t2 + t) * h * KM[i] + (-2 * t3 + 3 * t2) * KY[i + 1] + (t3 - t2) * h * KM[i + 1]);
    }

    /* geometry: untransformed layout (offset*), read on resize only */
    function measure() {
      var W = scene.offsetWidth, H = scene.offsetHeight;
      var cx = scene.offsetLeft + door[0] * W, cy = scene.offsetTop + door[1] * H;
      for (var el = scene.offsetParent; el && el !== stage; el = el.offsetParent) { cx += el.offsetLeft; cy += el.offsetTop; }
      /* the small viewport (stable while mobile toolbars come and go) and the pin offset for short screens */
      var vw = stage.clientWidth, vh = probe.offsetHeight || window.innerHeight,
        stick = Math.min(0, vh - frame.offsetHeight);
      stage.style.setProperty("--stick", stick + "px");
      /* the scroll cue is decoration: if the bottom of the small viewport slices through it, it is not drawn */
      var icon = cue && cue.firstElementChild;
      if (icon) {
        cue.style.visibility = "";
        var st = stage.getBoundingClientRect().top, ir = icon.getBoundingClientRect();
        if (ir.top - st < vh && ir.bottom - st > vh + 0.5) cue.style.visibility = "hidden";
      }
      var sh = Math.max(vh, stage.clientHeight + stick);      /* bottom of the large viewport */
      cam.dx = vw / 2 - cx;
      cam.dy = vh / 2 - stick - cy;
      /* portrait, doorway below the centre: the rise follows the growth (see camAt) */
      cam.k = vh > vw * 1.1 && cam.dy < -1 ? (1 - door[1]) * H / -cam.dy : 0;
      /* the walk-in ends with the opening covering the whole (large) viewport in every orientation and
         aspect ratio, so the hand-off is hall colour over hall colour, never a fade over the stone */
      /* across, the open leaves stand edge-on inside the opening: in the drawing's perspective each one
         still covers about 7% of its width, so the camera passes them too (LEAVES = the clear share) */
      var ow = door[2] * W, oh = door[3] * H, LEAVES = 0.86;
      var tall = 2 * Math.max(vh / 2, sh - vh / 2) / oh;          /* scale at which the opening fills the height */
      cam.s = Math.max(vw / (ow * LEAVES), tall) * 1.04;
      /* The hall dissolves into its light while the room still reads as a room: from the scale at which the
         opening is 0.8 of the screen's height to 1.35 of it (and in any case 12% before the opening covers the
         screen). On a landscape screen the camera must then still grow 2-3x before the opening also covers the
         width: that stretch is the doorway passing out of frame around a light that is already one colour,
         never an abstract close-up of the hall's drawing (the inner door's window, oversized hatching). */
      var sB = Math.min(1.35 * tall, cam.s / 1.12), sA = Math.min(0.8 * tall, sB / 1.25);
      keys(Math.max(1.05, sA), Math.max(1.1, sB), cam.s);
      var r = wrap.getBoundingClientRect();
      pin = r.top + window.pageYOffset - stick;
      run = Math.max(1, wrap.offsetHeight - stage.offsetHeight);
    }
    function target() {
      var y = window.pageYOffset;
      return { y: y, p: clamp((y - pin) / run) };
    }

    /* r: the rendered progress; p: the scroll progress (see TEXT and COVER above) */
    function render(r, p) {
      if (p === undefined) p = r;
      var i, t, s, v, q;
      /* once the lit hall is opaque, the hall in shadow behind it is never seen: stop drawing it (at full
         zoom its hatching was the most expensive thing to raster) */
      if ((r >= DOOR[1]) !== backHidden) { backHidden = !backHidden; back.style.visibility = backHidden ? "hidden" : ""; }
      /* once the screen is one colour, the page behind the stage takes that colour too: if a frame ever draws the
         pinned stage a step behind a fast scroll, the strip it uncovers is the same light, never the hero's paper.
         An inline style on body, not a class on html: a class there restyles the whole document (35ms of style
         recalculation at the hand-off under 4x CPU throttle; this costs nothing measurable). */
      if ((Math.max(r, p - LAG) >= COVER_AT) !== lit) { lit = !lit; document.body.style.backgroundColor = lit ? "var(--color-hall)" : ""; }
      if (r <= 0 && p <= 0) {           /* exact rest: the CSS state, nothing inline */
        for (i = 0; i < T.length; i++) { s = T[i][0].style; s.opacity = ""; s.transform = ""; s.pointerEvents = ""; }
        scene.style.transform = "";
        return;
      }
      for (i = 0; i < T.length; i++) {
        t = T[i];
        q = t[5] === TEXT ? Math.min(r, p) : t[5] === COVER ? Math.max(r, p - LAG) : r;
        s = t[0].style;
        if (t[5] === TEXT && q <= 0) { s.opacity = ""; s.transform = ""; s.pointerEvents = ""; continue; }   /* back at rest */
        v = t[4](t[3](clamp((q - t[1]) / (t[2] - t[1]))));
        if (v[0] !== null) s.opacity = v[0] <= 0 ? "0" : v[0] >= 1 ? "1" : v[0].toFixed(4);
        if (v[1] !== null) s.transform = v[1];
        /* a faded action or cue is not a live target over the drawing, and the list is not one before it shows
           (focus still reaches both: see the focusin handlers) */
        if (t[5] === TEXT) s.pointerEvents = v[0] < 0.5 ? "none" : "";
        else if (t[5] === LIST) s.pointerEvents = v[0] < 0.5 ? "none" : "auto";
      }
      scene.style.transform = camAt(r);
    }

    /* Promote the moving layers only while they move; at rest the drawing re-rasters crisp at its size.
       Every layer whose opacity changes per frame gets its own compositor layer too: otherwise each change
       repaints the doorway inside the zooming camera layer and the browser re-rasters it at the new
       scale every frame (measured: 2.7s of raster per pass at 1440 x 900, frames up to 200ms).
       The transform hint also freezes their raster scale while the camera zooms. */
    var LAYERS = [[scene, "transform"], [$(".hall__light"), "transform, opacity"], [intro, "transform, opacity"],
      [$(".porta__cue"), "opacity"], [$(".spill"), "transform, opacity"], [$(".hall__flat"), "opacity"], [$(".porta__flood"), "opacity"]],
      DRAWN = 2,           /* the first two carry line work: they are re-rastered when the scroll rests */
      sharp = 0, sharpT, rasterS = 1, lift = 0, STEP = 2.2, ready = false;
    function promote(yes) {
      clearTimeout(sharpT);
      sharp = 0;
      if (!yes && ready && !promoted) { ready = false; for (var j = 0; j < DRAWN; j++) LAYERS[j][0].style.willChange = ""; }
      if (yes === promoted) return;
      promoted = yes;
      ready = false;
      lift = 0;
      rasterS = scaleAt(Math.max(0, shown));
      for (var i = 0; i < LAYERS.length; i++) LAYERS[i][0].style.willChange = yes ? LAYERS[i][1] : "";
    }
    /* The walk-in on request would show the promoted drawing from the raster made when it was promoted, soft at
       3-8x. So during a flight, while the zoom grows past 2.2x the scale of the last raster (and the hall has not
       yet turned to light, r < LIGHT[1]), the two drawn layers are handed back for one frame each (one after the
       other) and promoted again: a fresh raster at the current zoom, about twice per walk-in. Not after: by then
       only the jambs are left, passing out of the frame fast, and a raster at 4-8x of their stone and the
       lamplight cost frames of 50-67ms at 1440 x 900 under 4x CPU throttle. Under 4x CPU throttle the flight stays
       inside its frame budget (DESIGN.md › Measured). A hand scroll keeps the raster it has while it moves (it
       may be faster than any raster) and is made crisp when it rests (rest()). */
    function crisp(r) {
      if (!promoted || sharp) return;
      if (lift) {                       /* one drawn layer per frame: the raster work is spread over two frames */
        LAYERS[lift - 1][0].style.willChange = LAYERS[lift - 1][1];
        if (lift < DRAWN) { LAYERS[lift][0].style.willChange = ""; lift++; } else lift = 0;
        return;
      }
      var sNow = scaleAt(r);
      if (fl && r < LIGHT[1] && sNow > rasterS * STEP) {
        LAYERS[0][0].style.willChange = "";
        rasterS = sNow;
        lift = 1;
      }
    }
    /* At rest mid-sequence: hand the drawn layers back for one frame (they re-raster crisp at the current
       zoom), then promote them again at that scale, so the next scroll starts without any raster work. */
    function rest() {
      if (!promoted || sharp) return;
      sharp = 1;
      lift = 0;
      rasterS = scaleAt(Math.max(0, shown));
      for (var i = 0; i < DRAWN; i++) LAYERS[i][0].style.willChange = "";
      sharpT = setTimeout(function () {
        sharp = 2;
        for (var i = 0; i < DRAWN; i++) LAYERS[i][0].style.willChange = LAYERS[i][1];
      }, 120);
    }
    /* Safety net: if anything in the sequence throws (an engine quirk we could not test), the page
       steps back to its static, natively scrolling form instead of leaving a pinned, frozen stage. */
    function bail(where, err) {
      ERR.push(where + ": " + (err && err.message ? err.message : String(err)));
      try { off(); } catch (e) {}
      root.classList.remove("porta-on");
      root.setAttribute("data-sequence", "static");
      root.__porta = null;
    }
    function tick(now) { try { tickInner(now); } catch (err) { bail("tick", err); } }
    function tickInner(now) {
      raf = 0;
      if (!on) return;
      var g = fl ? flightStep(now) : target(), dt = last ? Math.min(64, now - last) : 16.7, r;
      last = now;
      if (shown < 0 || Math.abs(g.p - shown) > JUMP) r = g.p;           /* first frame, or a jump: no replay */
      else r = shown + (g.p - shown) * (1 - Math.exp(-dt / TAU));
      if (Math.abs(g.p - r) < EPS) r = g.p;
      if (r !== shown || g.p !== seen) {
        if (r > 0) {
          if (sharp === 1) promote(false);        /* moved again before the re-raster finished */
          promote(true);
          clearTimeout(idle);
        }
        render(r, g.p);
        shown = r;
        seen = g.p;
        crisp(r);
      } else if (lift) crisp(r);
      if (g.y !== lastY) { lastY = g.y; calm = 0; } else calm++;
      /* keep reading scrollY for a few frames after it stops: a late momentum frame is never missed */
      if (r !== g.p || calm < 8) raf = window.requestAnimationFrame(tick);
      else {
        last = 0;
        clearTimeout(idle);
        /* at the top: no hints at all (the exact rest state). Mid-sequence: crisp re-raster (see rest()).
           Once the flood covers the drawing there is nothing to re-raster. */
        if (shown <= 0) idle = setTimeout(function () { promote(false); }, 400);
        else if (shown < COVERED) idle = setTimeout(rest, 250);
      }
    }
    function kick() { if (on && !raf) raf = window.requestAnimationFrame(tick); }

    /* The walk-in on request (the hero action and the scroll cue). Still ONE driver: this loop writes the
       scroll position itself, eased over time, and the scene follows it through the same smoothing as a
       hand scroll, so the doors swing and the camera walks in exactly as they do under the finger.
       The flight eases the visual journey, not the scroll distance: each pixel of the way weighs
       1 + --flight-weight x the walk-in's change of (log) scale over it, so the camera passes through the
       doorway at a readable pace and the plain rise of the list goes quicker. (Easing the distance put the
       peak speed in the doorway: the walk-in took 250ms and the list half the flight.) Time curve
       --curve-flight: soft start, long gentle settle. Duration --dur-flight for the whole way from the rest
       state, shorter for a shorter way (sqrt of the share of the journey, never under 35%). The first frame
       moves nothing: the layers are promoted in it, so no frame of the travel pays for creating them. Any
       wheel, touch, key or pointer input, or a scroll that is not ours, ends the flight at once and leaves
       the page where it is, in the visitor's hands. */
    var fl = null, STOP = ["wheel", "touchstart", "pointerdown", "keydown"], ACTION = 'a[href="#lista"]';
    function listen(yes) {
      for (var i = 0; i < STOP.length; i++) window[yes ? "addEventListener" : "removeEventListener"](STOP[i], land, { passive: true, capture: true });
    }
    /* Not an interruption: a held key repeating (the press that started the flight), or a second press on the
       action or the cue itself, within 450ms of the start (a double click or tap: the flight to the same place simply
       carries on; the faded action no longer takes the pointer, so the place it occupied counts). */
    function again(e) {
      var t = e.touches && e.touches[0] ? e.touches[0] : e, x = t.clientX, y = t.clientY, els = wrap.querySelectorAll(ACTION), r, i;
      if (x === undefined || performance.now() - fl.t > 450) return false;   /* a double click is within 450ms */
      for (i = 0; i < els.length; i++) {
        r = els[i].getBoundingClientRect();
        if (r.width && x >= r.left - 6 && x <= r.right + 6 && y >= r.top - 6 && y <= r.bottom + 6) return true;
      }
      return false;
    }
    function land(e) {
      if (!fl) return;
      if (e && e.type === "keydown" && e.repeat) return;
      if (e && (e.type === "pointerdown" || e.type === "touchstart") && again(e)) return;
      fl = null;
      listen(false);
    }
    function zoomAt(y) { return Math.log(scaleAt(clamp((y - pin) / run))) / KY[3]; }
    /* journey share (0..1) -> scroll position, from a table of the weighted way (96 steps, built once) */
    function journey(y0, y1) {
      var N = 96, ys = [y0], J = [0], i, y, z, pz = zoomAt(y0);
      for (i = 1; i <= N; i++) {
        y = y0 + (y1 - y0) * i / N;
        z = zoomAt(y);
        ys.push(y);
        J.push(J[i - 1] + Math.abs(y - ys[i - 1]) / run + WEIGHT * Math.abs(z - pz));
        pz = z;
      }
      return function (j) {
        j *= J[N];
        for (i = 1; i < N && J[i] < j; i++);
        var a = J[i - 1], b = J[i];
        return ys[i - 1] + (b > a ? Math.min(1, (j - a) / (b - a)) : 1) * (ys[i] - ys[i - 1]);
      };
    }
    function flightStep(now) {
      var f = fl, y0 = window.pageYOffset;
      if (f.y >= 0 && Math.abs(y0 - f.y) > 4) { land(); return target(); }   /* someone else scrolled */
      if (f.t0 < 0) f.t0 = now;
      var u = Math.min(1, (now - f.t0) / f.d), y = f.at(E.flight(u));
      if (u >= 1) y = f.y1;
      f.y = y;
      window.scrollTo(0, y);
      if (u >= 1) { land(); f.done(); }
      return { y: y, p: clamp((y - pin) / run) };
    }
    function fly(to, done) { try { return flyInner(to, done); } catch (err) { bail("fly", err); return false; } }
    function flyInner(to, done) {
      if (!on) return false;
      if (fl && fl.to === to) return true;      /* already on its way there: keep the speed it has */
      land();
      var y0 = window.pageYOffset, y1 = to(), full = Math.max(1, y1 - pin), dist = Math.abs(y1 - y0);
      if (dist < 2) { done(); return true; }
      fl = { to: to, y0: y0, y1: y1, y: -1, t0: -1, t: performance.now(), done: done, at: journey(y0, y1),
        d: FLIGHT * Math.min(1, Math.max(0.35, Math.sqrt(dist / full))) };
      promote(true);
      clearTimeout(idle);
      listen(true);
      calm = 0;
      kick();
      return true;
    }
    /* a wheel turn or a touch at the top is about to scroll: promote now, so the first frame of the
       sequence does not also pay for creating its layers (dropped again if nothing moves) */
    function prime() {
      if (!on || promoted || shown > 0) return;
      promote(true);
      clearTimeout(idle);
      idle = setTimeout(function () { if (shown <= 0) promote(false); }, 400);
    }
    /* A mouse arriving over the first screen readies the two drawn layers (the camera and the lit hall: the costly
       raster) at rest, at their rest scale, so the first frame of a wheel scroll only creates the light, cheap
       ones. Drawing only, never the text (a promoted text layer can lose subpixel antialiasing). It measured
       67-83ms for that first frame at 1440 x 900 under 4x CPU throttle in half the runs; kept until the sequence
       takes over, dropped with the other hints back at the top. */
    function warm(e) {
      if (!on || promoted || ready || shown > 0 || (e && e.pointerType && e.pointerType !== "mouse")) return;
      ready = true;
      for (var i = 0; i < DRAWN; i++) LAYERS[i][0].style.willChange = LAYERS[i][1];
    }
    function refresh() { try { refreshInner(); } catch (err) { bail("refresh", err); } }
    function refreshInner() {            /* new geometry, same progress */
      rq = 0;
      if (!on) return;
      measure();
      if (fl) { fl.y1 = fl.to(); fl.at = journey(fl.y0, fl.y1); }
      if (shown >= 0) render(shown, seen < 0 ? shown : seen);
      calm = 0;
      kick();
    }
    function queue() { if (on && !rq) rq = window.requestAnimationFrame(refresh); }

    function off() {
      land();
      on = false;
      if (raf) window.cancelAnimationFrame(raf);
      raf = 0;
      clearTimeout(idle);
      window.removeEventListener("scroll", kick);
      render(0);
      promote(false);
      stage.style.removeProperty("--stick");
      if (cue) cue.style.visibility = "";
      shown = -1;
      seen = -1;
    }
    function set() {
      off();
      if (still.matches || /[?&]semporta\b/.test(location.search)) {
        root.classList.remove("porta-on");
        root.setAttribute("data-sequence", "static");
        return;
      }
      root.classList.add("porta-on");
      root.setAttribute("data-sequence", "scroll");
      on = true;
      measure();
      window.addEventListener("scroll", kick, { passive: true });
      kick();
    }
    window.addEventListener("wheel", prime, { passive: true });
    window.addEventListener("pointermove", warm, { passive: true });
    window.addEventListener("touchstart", prime, { passive: true });
    window.addEventListener("resize", queue);
    window.addEventListener("orientationchange", queue);
    if (window.visualViewport) window.visualViewport.addEventListener("resize", queue);
    window.addEventListener("load", queue);
    window.addEventListener("pageshow", function () { shown = -1; seen = -1; queue(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(queue);
    if (still.addEventListener) still.addEventListener("change", set);
    else if (still.addListener) still.addListener(set);
    /* keyboard: a focused control in the stage must be visible, so rewind to the rest state (a jump: no replay).
       A pointer focus never moves the page (see keyed). */
    intro.addEventListener("focusin", function () {
      if (keyed && on && target().p > 0.01) window.scrollTo(0, pin);
    });
    try { set(); } catch (err) { bail("set", err); }
    /* while the sequence is moving (a flight, or the loop still following the scroll), the theme changes
       without a cross-fade (no snapshot mid-shot); parked anywhere, even in the list, it cross-fades */
    root.__portaBusy = function () { return on && (!!fl || !!raf); };
    /* geometry for the tests and the ?diag panel (read-only) */
    root.__porta = { fly: fly, land: land, geo: function () {
      return { pin: pin, run: run, S: cam.s, light: LIGHT, sLight: [Math.exp(KY[1]), Math.exp(KY[2])], flat: COVER_AT, list: [T[8][1], T[10][2]], r: shown, p: seen };
    } };
  })();

  /* ---------------------------------------------------------------- 3. The waiting list
     POST to the join_waitlist() function (Supabase, EU). The publishable key is public by design:
     the table is not readable, only this function is callable. Nothing is sent before submit. */
  (function () {
    var form = document.querySelector("[data-waitlist]");
    if (!form || !window.fetch) return;
    var URL = "https://hxwdnhprhjlqehgvmvct.supabase.co/rest/v1/rpc/join_waitlist",
      KEY = "sb_publishable_F5PYhXiBkc_2nprJj_OLJA_DWDR1-QV",
      RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
      d = form.dataset,
      q = function (s) { return form.querySelector(s); },
      set = q(".form__set"), email = q("#email"), consent = q("#consent"), hp = q("#website"),
      button = q(".button"), msg = q(".form__msg"), emailMsg = q("#email-msg"), consentMsg = q("#consent-msg"),
      ctx = email.getAttribute("aria-describedby"),   /* the list sentence: what the field is for, read on focus */
      busy = false, said;

    function state(s) { form.setAttribute("data-state", s); }
    function mark(input, box, text) {
      var base = input === email ? ctx : null;
      box.textContent = text || "";
      box.hidden = !text;
      if (text) { input.setAttribute("aria-invalid", "true"); input.setAttribute("aria-describedby", box.id); }
      else {
        input.removeAttribute("aria-invalid");
        if (base) input.setAttribute("aria-describedby", base); else input.removeAttribute("aria-describedby");
      }
    }
    function okEmail(v) { return v.length >= 6 && v.length <= 254 && RE.test(v); }
    function validate() {
      var bad = [], v = email.value.trim();
      mark(email, emailMsg, okEmail(v) ? "" : d.msgEmail);
      if (!okEmail(v)) bad.push(email);
      mark(consent, consentMsg, consent.checked ? "" : d.msgConsent);
      if (!consent.checked) bad.push(consent);
      return bad;
    }
    function done() {
      form.style.minBlockSize = form.offsetHeight + "px";   /* the message takes the form's place: nothing around it moves */
      state("done");
      email.value = "";
      msg.textContent = d.msgOk;
      msg.focus();
    }
    /* The status region is always rendered (empty, it takes no space), so a polite screen reader hears the
       error when it is written. It is written a beat after the region was cleared, so the same message twice
       still counts as a change. It offers a way that does not depend on the failing service: the house's address,
       as a real link ({mail} in the copy). */
    function fail() {
      state("error");
      clearTimeout(said);
      said = setTimeout(function () {
        var parts = String(d.msgError).split("{mail}"), a;
        msg.textContent = parts[0];
        if (parts.length > 1 && d.mail) {
          a = document.createElement("a");
          a.className = "link-inline";
          a.href = "mailto:" + d.mail;
          a.textContent = d.mail;
          msg.appendChild(a);
          msg.appendChild(document.createTextNode(parts.slice(1).join("")));
        }
      }, 60);
    }
    function idle() {
      busy = false;
      form.removeAttribute("aria-busy");
      button.removeAttribute("aria-disabled");
    }

    email.addEventListener("input", function () {
      if (email.hasAttribute("aria-invalid") && okEmail(email.value.trim())) mark(email, emailMsg, "");
    });
    consent.addEventListener("change", function () {
      if (consent.checked) mark(consent, consentMsg, "");
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (busy) return;
      clearTimeout(said);
      msg.textContent = "";
      state("idle");
      var bad = validate();
      if (bad.length) { bad[0].focus(); return; }
      if (hp.value) { done(); return; }          /* a bot filled the hidden field: pretend, send nothing */
      busy = true;
      state("sending");
      form.setAttribute("aria-busy", "true");
      button.setAttribute("aria-disabled", "true");
      var ctl = window.AbortController ? new AbortController() : null,
        timer = setTimeout(function () { if (ctl) ctl.abort(); }, 10000);
      fetch(URL, {
        method: "POST",
        headers: { apikey: KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ p_email: email.value.trim(), p_lang: d.lang === "en" ? "en" : "pt-PT", p_consent: true }),
        signal: ctl ? ctl.signal : undefined,
        credentials: "omit",
        cache: "no-store",
        referrerPolicy: "no-referrer"
      }).then(function (r) {
        if (r.ok) return done();
        if (r.status !== 400) return fail();
        return r.json().then(function (j) {
          var m = j && j.message;
          if (m === "invalid_email") { state("idle"); mark(email, emailMsg, d.msgEmail); email.focus(); }
          else if (m === "consent_required") { state("idle"); mark(consent, consentMsg, d.msgConsent); consent.focus(); }
          else fail();
        }, fail);
      }, fail).then(function () { clearTimeout(timer); idle(); }, function () { clearTimeout(timer); idle(); fail(); });
    });
    set.disabled = false;
    state("idle");
  })();

  /* ---------------------------------------------------------------- 4. The list: arrival
     The hero action and the scroll cue walk the visitor in through the door: the driver (section 2) flies
     the scroll to the list, the doors open and the camera enters on the way, and the focus lands in the
     email field at the end (preventScroll). The field is described by the list sentence («Deixe-nos o seu
     email e avisamos quando abrirmos.»), so a screen reader says where it arrived as the focus lands. Reduced
     motion or no sequence: the same landing at once. Arriving with #lista: a jump, never a replay. The list
     content rises in with the scroll itself (section 2: the end of the run), so it is there, at rest, wherever
     the page is when the run is over: a reload or a restored position at the bottom, a jump, a short screen. */
  (function () {
    var list = document.getElementById("lista"), email = document.getElementById("email");
    if (!list) return;
    function listY() { return list.getBoundingClientRect().top + window.pageYOffset; }
    function arrive() {
      if (email && !email.closest("fieldset:disabled")) email.focus({ preventScroll: true });
    }
    function toList(e) {
      e.preventDefault();
      if (!still.matches && root.__porta && root.__porta.fly(listY, arrive)) return;
      window.scrollTo(0, listY());
      arrive();
    }
    var links = document.querySelectorAll('.porta a[href="#lista"]');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener("click", toList);
      /* a link answers Enter; the action is drawn as a button, so it answers Space too. A held key does not
         repeat the press (nor scroll the page under the flight). */
      links[i].addEventListener("keydown", function (e) {
        if ((e.key === " " || e.key === "Enter") && e.repeat) { e.preventDefault(); return; }
        if (e.key === " ") toList(e);
      });
    }
    /* keyboard only: Tab arriving in the form from outside brings the whole list into view (the end of the run,
       where it is at rest). A tap or a click into the form never moves the page (see keyed), wherever it rests. */
    list.addEventListener("focusin", function (e) {
      if (!keyed || (e.relatedTarget && list.contains(e.relatedTarget))) return;
      var y = listY(), d = y - window.pageYOffset;
      if (list.offsetHeight <= window.innerHeight + 2) { if (Math.abs(d) > 2) window.scrollTo(0, y); }
      else if (d > 2) {                   /* a list taller than the screen: its start, then whatever took the focus */
        window.scrollTo(0, y);
        if (e.target.scrollIntoView) e.target.scrollIntoView({ block: "nearest" });
      }
    });
    /* arriving with #lista: the wrapper grew after the browser's first jump, so land on the list again */
    if (location.hash === "#lista") window.scrollTo(0, listY());
  })();

  /* ?diag: a read-only overlay for testing on real phones (scroll, viewport, sequence state, errors) */
  if (/[?&]diag\b/.test(location.search)) {
    var box = document.createElement("pre"), frames = 0;
    box.setAttribute("aria-hidden", "true");
    box.style.cssText = "position:fixed;left:8px;right:8px;bottom:8px;z-index:9999;margin:0;padding:8px;font:11px/1.35 ui-monospace,Menlo,monospace;background:rgba(0,0,0,.8);color:#fff;border-radius:6px;pointer-events:none;white-space:pre-wrap;max-height:45vh;overflow:hidden";
    document.body.appendChild(box);
    (function f() { frames++; window.requestAnimationFrame(f); })();
    setInterval(function () {
      var st = document.querySelector(".porta__stage"), r = st && st.getBoundingClientRect();
      box.textContent = [navigator.userAgent,
        "y=" + Math.round(window.pageYOffset) + " ih=" + window.innerHeight + " vv=" + (window.visualViewport ? Math.round(window.visualViewport.height) : "-") + " docH=" + document.documentElement.scrollHeight,
        "seq=" + root.getAttribute("data-sequence") + " theme=" + root.getAttribute("data-theme") + " cls=" + root.className,
        "stage top=" + (r ? Math.round(r.top) : "-") + " h=" + (st ? st.offsetHeight : "-") + " pos=" + (st ? getComputedStyle(st).position : "-"),
        "frames/s=" + frames * 2, "errors: " + (ERR.length ? ERR.join(" | ") : "none")].join("\n");
      frames = 0;
    }, 500);
  }
})();
