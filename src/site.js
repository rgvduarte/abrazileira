/* A Brazileira · site.js
   Progressive enhancement only: without it the page is complete (the theme follows the system,
   no pinned sequence, the waiting list explains how to sign up).
   1. Dia / Noite   2a. The photograph   2. The door sequence (scroll-linked)   3. The waiting list   4. The list: arrival */
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
      if (root.__photo) { root.__photo.loaded(); root.__photo.enlarge(t); }   /* the placeholder returns if this theme's photo is not in yet */
      window.requestAnimationFrame(function () { root.classList.remove("is-instant"); });
    }
    /* the cross-fade: 400ms for a choice; slower and gentler (--dur-sky) when the sky changes it on its own.
       No snapshot while the sequence is moving, and none with reduced motion. The other theme is its own
       photograph: the change waits until it is fetched and decoded (at most 800ms; warmed when a pointer or the
       focus arrives on the control), so the cross-fade never lands on a half-loaded entrance. */
    var want = null;
    function swap(t, keep, sky) {
      var w = root.__photo && root.__photo.ready(t);
      if (!w) return swapNow(t, keep, sky);
      want = t;
      w.then(function () { if (want === t) { want = null; if (t !== current()) swapNow(t, keep, sky); } });
    }
    function warmOther() { if (root.__photo) root.__photo.ready(current() === "dia" ? "noite" : "dia", 1); }
    group.addEventListener("pointerenter", warmOther);
    group.addEventListener("focusin", warmOther);
    group.addEventListener("touchstart", warmOther, { passive: true });
    function swapNow(t, keep, sky) {
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

  /* ---------------------------------------------------------------- 2a. The photograph
     The entrance is a photograph in layers, each a <picture> per theme (photo.py); CSS shows the theme's own.
     Its blurred placeholder goes once the shown facade has loaded. ready(t) fetches and decodes a theme's layers
     (a hidden picture's lazy image is never fetched on its own): the theme control warms the other theme when a
     pointer or the focus arrives on it, and a theme change waits (at most 800ms) for its photograph, so the
     cross-fade never shows a half-loaded entrance; the sequence decodes the shown theme before it moves. */
  (function () {
    var scene = document.querySelector(".scene[data-geo]");
    if (!scene) return;
    function theme() {
      var t = root.getAttribute("data-theme");
      return t === "dia" || t === "noite" ? t : window.matchMedia("(prefers-color-scheme: dark)").matches ? "noite" : "dia";
    }
    function imgs(t) { return scene.querySelectorAll("picture.t-" + t + " img"); }
    function ok(im) { return im && im.complete && im.naturalWidth > 0; }
    function loaded() {
      var f = scene.querySelector(".ph--facade picture.t-" + theme() + " img");
      if (ok(f)) { scene.classList.add("is-loaded"); return; }
      scene.classList.remove("is-loaded");
      if (f) f.addEventListener("load", loaded, { once: true });
    }
    function ready(t, wait) {
      var list = imgs(t), ps = [], i;
      for (i = 0; i < list.length; i++) {
        if (list[i].loading !== "eager") list[i].loading = "eager";
        if (list[i].decode) ps.push(list[i].decode().catch(function () {}));
      }
      if (!window.Promise) return null;
      return Promise.race([Promise.all(ps), new Promise(function (r) { setTimeout(r, wait || 800); })]);
    }
    /* The walk-in magnifies the facade and the leaves 3-6x: the files picked for the rest size (sizes = the scene's
       width) are then drawn from too few pixels, the stone, the 11 and the walnut go soft (review r1). Once the page
       has loaded and is idle, the larger files of the shown theme are fetched and decoded in a detached copy of
       each picture (sizes = 3x the scene: the 2388 master on almost every screen); the first time the sequence
       moves, the real pictures take the same sizes and swap to those files from the cache while the doors are
       still near rest. Not on a data saver or a 2G link. */
    var BIG = ".ph--facade picture, .leaf picture", big = false, warmed = {};
    function slow() { var c = navigator.connection; return !!(c && (c.saveData || /2g/.test(c.effectiveType || ""))); }
    function bigSizes() { return Math.round(scene.offsetWidth * 3) + "px"; }
    function setSizes(pic, v) { var e = pic.querySelectorAll("source, img"), i; for (i = 0; i < e.length; i++) if (e[i].getAttribute("sizes") !== v) e[i].setAttribute("sizes", v); }
    function pics(t) { return scene.querySelectorAll(BIG.replace(/picture/g, "picture.t-" + t)); }
    function warmBig(t) {
      /* only for the sequence: reduced motion, ?semporta and the safety net never zoom */
      if (warmed[t] || slow() || !scene.offsetWidth || root.getAttribute("data-sequence") !== "scroll") return;
      warmed[t] = 1;
      var list = pics(t), v = bigSizes(), i;
      for (i = 0; i < list.length; i++) {
        var c = list[i].cloneNode(true), im = c.querySelector("img");
        im.setAttribute("loading", "eager");
        setSizes(c, v);
        if (im.decode) im.decode().catch(function () {});
      }
    }
    function enlarge(t) {
      if (!big || slow()) return;
      var list = pics(t || theme()), v = bigSizes(), i;
      for (i = 0; i < list.length; i++) setSizes(list[i], v);
    }
    function upgrade() { if (big) return; big = true; enlarge(); }
    root.__photo = { ready: ready, loaded: loaded, theme: theme, upgrade: upgrade, enlarge: enlarge };
    loaded();
    /* after the page has loaded: the lamplight on the steps (Noite) joins the scene (it is not needed for the first
       paint: it is invisible until the doors open), and the shown theme is decoded before anything moves */
    function later() {
      scene.classList.add("is-ready");
      ready(theme(), 4000);
      var idle = window.requestIdleCallback || function (f) { return setTimeout(f, 1200); };
      setTimeout(function () { idle(function () { warmBig(theme()); }, { timeout: 3000 }); }, 600);
    }
    if (document.readyState === "complete") later(); else window.addEventListener("load", later, { once: true });
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
     removed, so the hero is exactly its CSS rest state (the photograph as it is, doors closed). */
  (function () {
    var wrap = document.querySelector("[data-porta]");
    if (!wrap) return;
    var $ = function (s) { return wrap.querySelector(s); },
      stage = $(".porta__stage"), frame = $(".porta__frame"), intro = $(".intro"), scene = $(".scene"),
      plate = $(".ph--plate"), facade = $(".ph--facade"), leafL = $(".leaf--l"), leafR = $(".leaf--r"),
      shadeL = leafL.querySelector(".leaf__shade"), shadeR = leafR.querySelector(".leaf__shade"),
      G = JSON.parse(scene.getAttribute("data-geo") || "{}"),
      css = getComputedStyle(root),
      num = function (n, d) { var v = parseFloat(css.getPropertyValue(n)); return isNaN(v) ? d : v; },
      OPEN = num("--open-door", G.open || 84) * Math.PI / 180, COS = 1 - Math.cos(OPEN),
      TAU = num("--scroll-tau", 90), EPS = 0.0005, JUMP = 0.35,
      cam = { dx: 0, dy: 0, k: 0, s: 8, kp: G.k || 0.8 }, pin = 0, run = 1,
      probe = document.createElement("div"),
      cue = $(".porta__cue"),
      list = document.getElementById("lista"), reveal = list && list.querySelector("[data-reveal]"),
      rv = function (s) { return (reveal && reveal.querySelector(s)) || document.createElement("i"); },
      shown = -1, seen = -1, lit = false, raf = 0, last = 0, lastY = NaN, calm = 0, promoted = false, idle, rq = 0, on = false,
      held = { w: 0, run: 0 }, mw = 0, mh = 0, endOff = -1;
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
      light: curve("--curve-light", [0.55, 0, 0.75, 0.55]),
      rise: curve("--ease-out", [0.23, 1, 0.32, 1]),
      flight: curve("--curve-flight", [0.45, 0, 0.3, 1])
    };
    var FLIGHT = num("--dur-flight", 1250), WEIGHT = num("--flight-weight", 2), WLIST = num("--flight-weight-list", 1.2),
      RISE = num("--rise-list", 16);
    function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

    /* The timeline: [element, from p, to p, curve, value(u) -> [opacity, transform], progress].
       One short run (--porta-run, about one screen of scroll) in three overlapping beats:
         the doors swing inwards from the first pixel (0 -> 0.36) and the camera starts with them;
         the camera walks in through the doorway, towards the hall point (the photo's vanishing point): by 0.58
           the doorway covers the screen and the leaves, edge-on, have passed out of frame; it keeps walking, into
           the arch of light at the end of the hall (the room beyond, which the photograph clips to the hall
           colour), while the hall's light, one flat --color-hall, fades in over the whole stage (0.6 -> 0.76);
         at 0.76 the screen is that one colour, exactly the token, and the list (title + sentence, then the form)
           rises in on it at once, over the last quarter of the run, and is at rest when the run ends.
       Progress: the rendered (smoothed) r, except
         TEXT  the crest and the cue take min(r, p): they leave with the doors, but come back with the scroll
               itself, so after a fast flick to the top the title is there as the page arrives, not 500ms later;
         COVER the hall's light takes max(r, p - LAG): at hand speed (lag under 0.1) exactly r; after a fast
               flick the stage is flat hall colour before the list panel arrives (p = 1), never a hard edge
               rising over a photograph the smoothing has not caught up with.
       The list (LIST) reads r, so it never shows before the light (which reads max(r, p - LAG)): its words
       only ever rise over the flat colour. */
    var DOOR = [0, 0.36], PAN = [0, 0.3], CENTRE = [0.36, 0.56], KX = [0.01, 0.36, 0.58, 0.76], LIGHT = [0.6, 0.76],
      COVER_AT = 0.76, LAG = 0.1, TEXT = 1, COVER = 2, LIST = 3,
      lift = function (k) { return function (u) { return [u, "translate(0," + ((1 - u) * RISE * k).toFixed(2) + "px)"]; }; };
    var T = [
      [intro, 0, 0.14, E.copy, function (u) { return [1 - u, "translate(0," + (-16 * u).toFixed(2) + "px)"]; }, TEXT],
      [cue, 0, 0.05, E.copy, function (u) { return [1 - u, null]; }, TEXT],
      /* the leaves swing inwards about their outer hinges; a leaf turning away from the street darkens
         (sin of the angle, the depth is the theme's --color-leaf-shade); the lamplight on the steps (Noite) grows
         with the opening (1 - cos of the angle) */
      [leafL, DOOR[0], DOOR[1], E.door, function (u) { return [null, "rotateY(" + (OPEN * u).toFixed(4) + "rad)"]; }],
      [leafR, DOOR[0], DOOR[1], E.door, function (u) { return [null, "rotateY(" + (-OPEN * u).toFixed(4) + "rad)"]; }],
      [shadeL, DOOR[0], DOOR[1], E.door, function (u) { return [Math.sin(OPEN * u), null]; }],
      [shadeR, DOOR[0], DOOR[1], E.door, function (u) { return [Math.sin(OPEN * u), null]; }],
      [$(".ph--spill"), DOOR[0], DOOR[1], E.door, function (u) { return [(1 - Math.cos(OPEN * u)) / COS, null]; }],
      [$(".porta__flood"), LIGHT[0], LIGHT[1], E.light, function (u) { return [u, null]; }, COVER],   /* the hall's light */
      /* the list: title, sentence and form all begin as the screen turns one colour (so none of them is ever an
         empty field on it) and settle one after the other: the stagger is in how long each takes */
      [rv(".lista__title"), 0.745, 0.88, E.rise, lift(1), LIST],
      [rv(".lista__lede"), 0.75, 0.9, E.rise, lift(1), LIST],
      [rv(".form"), 0.755, 0.94, E.rise, lift(0.6), LIST]
    ];
    /* The camera: the hall point travels to the centre of the screen while the text leaves, and the walk-in scales
       the scene around it. Scale is geometric (constant perceived speed); the hall point moves on a straight line.
       The plate (the hall beyond) grows slower than the doorway, as zoom^kp (kp about 0.8): it is further away,
       so the hall opens up behind the jambs as the camera nears them. */
    /* On portrait screens the photo stands at the foot of the screen: if it rose to the centre before growing,
       its foot would ride up and leave an empty band under it, a page scrolling rather than a camera approaching.
       There the rise is tied to the walk-in: the hall point rises only as much as the photo grows, so its foot
       holds at the visitor's feet and then leaves through the bottom edge (as when walking towards a door). It
       is centred by s = 1 + |dy| / foot distance, and in any case by p = 0.56, before the doorway covers the
       screen. Both terms ease into the centre with zero slope and combine smoothly (1 - (1 - a)(1 - b)): the rise
       was clipped at 1 before, so its speed changed in one step mid walk-in (a bob of the threshold, review r1). */
    var KNEE = 0.25;
    function knee(a) {                    /* a, eased into 1 over [1 - KNEE, 1 + KNEE]: C1, zero slope at the end */
      if (a <= 1 - KNEE) return a < 0 ? 0 : a;
      if (a >= 1 + KNEE) return 1;
      var d = a - 1 + KNEE;
      return a - d * d / (4 * KNEE);
    }
    function camAt(p) {
      var m = E.pan(clamp((p - PAN[0]) / (PAN[1] - PAN[0]))), s = scaleAt(p), my = m, a, b;
      if (cam.k) {
        a = knee((s - 1) * cam.k);
        b = clamp((p - CENTRE[0]) / (CENTRE[1] - CENTRE[0]));
        b = b * b * (3 - 2 * b);
        my = 1 - (1 - a) * (1 - b);
      }
      return "translate(" + (cam.dx * m).toFixed(2) + "px," + (cam.dy * my).toFixed(2) + "px) scale(" + s.toFixed(4) + ")";
    }
    /* The walk-in: log(scale) through four keyframes, made per screen in measure(): 1 at p = 0.01; a first step
       to the threshold as the doors finish opening (0.36); the scale at which the doorway covers the screen
       (0.58); the end, inside the arch of light (0.76). Between them a monotone cubic (Fritsch-Carlson): it never
       goes back, never overshoots, starts softly (zero slope) and keeps going into the light (no landing: the
       screen is one colour by then). Equal steps of log(scale) read as equal steps forward. */
    var KY = [0, 1, 1.5, 2], KM = [0, 0, 0, 0];
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
      /* while a field of the list has the focus and only the height changed (a keyboard that resizes the page, as
         Android in-app browsers do), the run keeps its length in px: the list, and the field in it, stay where they
         are (svh would shorten the run under the keyboard and move the list up, review r1) */
      var fw = stage.clientWidth, focused = !!(list && document.activeElement && document.activeElement !== list && list.contains(document.activeElement));
      if (focused && held.w === fw && held.run > 0) wrap.style.setProperty("--porta-run", held.run + "px");
      else if (wrap.style.getPropertyValue("--porta-run")) wrap.style.removeProperty("--porta-run");
      var W = scene.offsetWidth, H = scene.offsetHeight, hx = G.hp[0] * W, hy = G.hp[1] * H;
      var cx = scene.offsetLeft + hx, cy = scene.offsetTop + hy;
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
      /* portrait, hall point below the centre: the rise follows the growth (see camAt) */
      cam.k = vh > vw * 1.1 && cam.dy < -1 ? (1 - G.hp[1]) * H / -cam.dy : 0;
      /* the clear opening between the open leaves: each stands edge-on at OPEN inside the doorway, its free edge
         seen in the photo's perspective (distance G.persp of the photo's height, centred on the hall point) */
      var d = G.persp * H, lw = (G.gap[0] - G.door[0]) * W, f = d / (d + lw * Math.sin(OPEN)),
        xl = hx + (G.door[0] * W + lw * Math.cos(OPEN) - hx) * f, xr = hx + (G.door[2] * W - lw * Math.cos(OPEN) - hx) * f;
      /* the doorway covers the whole (large) viewport in every orientation and aspect ratio */
      var inDoor = Math.max(vw / 2 / Math.min(hx - xl, xr - hx), vh / 2 / ((G.hp[1] - G.door[1]) * H),
        (sh - vh / 2) / ((G.door[3] - G.hp[1]) * H)) * 1.05;
      /* the end: the arch of light at the end of the hall (G.light: its half width, its reach above and below the
         hall point, as shares of the photo, where it is within a few levels of the hall colour) fills the screen,
         seen through the plate's slower zoom; at least 1.5x past the doorway, at most what the plate covers */
      var L = G.light, zl = Math.max(vw / 2 / (L[0] * W), vh / 2 / (L[1] * H), (sh - vh / 2) / (L[2] * H)),
        end = Math.max(inDoor * 1.5, Math.min(Math.pow(zl, 1 / G.k), G.cover));
      /* the plate always covers the doorway: its zoom is end^kp with kp raised on very wide screens if needed */
      cam.kp = Math.max(G.k, 1 - Math.log(G.grow * 0.97) / Math.log(end));
      cam.s = end;
      keys(Math.pow(inDoor, 0.3), inDoor, end);
      /* the timeline starts at the wrapper's top, not where the stage pins: on screens shorter than the rest
         composition (stick < 0) the doors open on the first pixel too, while the stage is still scrolling to its pin
         (review r1); it ends where it did, at the pin plus the run */
      var r = wrap.getBoundingClientRect(), natural = wrap.offsetHeight - stage.offsetHeight;
      if (!wrap.style.getPropertyValue("--porta-run")) held = { w: fw, run: natural };
      pin = r.top + window.pageYOffset;
      run = Math.max(1, natural - stick);
      mw = vw; mh = vh;
    }
    function target() {
      var y = window.pageYOffset;
      return { y: y, p: clamp((y - pin) / run) };
    }

    /* r: the rendered progress; p: the scroll progress (see TEXT and COVER above) */
    function render(r, p) {
      if (p === undefined) p = r;
      var i, t, s, v, q;
      /* once the screen is one colour, the page behind the stage takes that colour too: if a frame ever draws the
         pinned stage a step behind a fast scroll, the strip it uncovers is the same light, never the hero's paper.
         An inline style on body, not a class on html: a class there restyles the whole document (35ms of style
         recalculation at the hand-off under 4x CPU throttle; this costs nothing measurable). */
      if ((Math.max(r, p - LAG) >= COVER_AT) !== lit) { lit = !lit; document.body.style.backgroundColor = lit ? "var(--color-hall)" : ""; }
      if (r <= 0 && p <= 0) {           /* exact rest: the CSS state, nothing inline */
        for (i = 0; i < T.length; i++) { s = T[i][0].style; s.opacity = ""; s.transform = ""; s.pointerEvents = ""; }
        scene.style.transform = "";
        plate.style.transform = "";
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
        /* a faded action or cue is not a live target over the photograph, and the list is not one before it
           shows (focus still reaches both: see the focusin handlers) */
        if (t[5] === TEXT) s.pointerEvents = v[0] < 0.5 ? "none" : "";
        else if (t[5] === LIST) s.pointerEvents = v[0] < 0.5 ? "none" : "auto";
      }
      scene.style.transform = camAt(r);
      /* the hall beyond: zoom^kp in all, so it gets zoom^(kp - 1) inside the camera */
      plate.style.transform = "scale(" + Math.pow(scaleAt(r), cam.kp - 1).toFixed(5) + ")";
    }

    /* Promote the moving layers only while they move; at rest the photograph is drawn as it is. Every layer whose
       opacity changes per frame gets its own compositor layer too (the leaves' shade, the lamplight, the hall's
       light, the text): otherwise each change repaints the doorway inside the zooming camera layer. The facade
       has a layer of its own (so a browser can composite the image as it is, without a backing store sized to
       the zoom); its transform hint freezes its raster scale while the camera zooms. */
    var LAYERS = [[facade, "transform"], [scene, "transform"], [plate, "transform"], [leafL, "transform"], [leafR, "transform"],
      [shadeL, "opacity"], [shadeR, "opacity"], [$(".ph--spill"), "opacity"], [intro, "transform, opacity"],
      [$(".porta__cue"), "opacity"], [$(".porta__flood"), "opacity"]],
      DRAWN = 1,           /* the facade carries the photograph's detail: it is re-rastered when the scroll rests */
      WARM = 8,            /* readied before the first frame (see warm()): every layer but the text and the cue */
      sharp = 0, sharpT, rasterS = 1, lift = 0, STEP = 2.2, ready = false;
    function promote(yes) {
      clearTimeout(sharpT);
      sharp = 0;
      if (yes === promoted) return;
      promoted = yes;
      ready = false;
      if (yes && root.__photo) root.__photo.upgrade();
      lift = 0;
      rasterS = scaleAt(Math.max(0, shown));
      for (var i = 0; i < LAYERS.length; i++) LAYERS[i][0].style.willChange = yes ? LAYERS[i][1] : "";
    }
    /* The walk-in on request would show the promoted facade from the raster made when it was promoted, soft at
       3-9x. So during a flight, while the zoom grows past 2.2x the scale of the last raster (and the jambs are
       still on screen, r < KX[2]), the facade is handed back for one frame and promoted again: a fresh raster at
       the current zoom. A hand scroll keeps the raster it has while it moves and is made crisp when it rests. */
    function crisp(r) {
      if (!promoted || sharp) return;
      if (lift) {
        LAYERS[0][0].style.willChange = LAYERS[0][1];
        lift = 0;
        return;
      }
      var sNow = scaleAt(r);
      if (fl && r < KX[2] && sNow > rasterS * STEP) {
        LAYERS[0][0].style.willChange = "";
        rasterS = sNow;
        lift = 1;
      }
    }
    /* At rest mid-sequence: hand the facade back for one frame (it re-rasters crisp at the current zoom), then
       promote it again at that scale, so the next scroll starts without any raster work. */
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
      /* the list at rest (the run is over): how far past its end the page is, kept for refresh() (not while new
         geometry is waiting to be measured: this frame may read the new layout against the old run) */
      if (!rq && !fl) endOff = g.p >= 1 ? g.y - pin - run : -1;
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
        /* at the top: no hints at all (the exact rest state), 300ms after the loop settles (about 0.8s after a fast
           scroll reaches the top). Mid-sequence, while the jambs are on screen: crisp re-raster (see rest()). Inside
           the hall there is nothing to re-raster. */
        if (shown <= 0) idle = setTimeout(settle, 300);
        else if (shown < KX[2]) idle = setTimeout(rest, 250);
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
    /* the list's arrival at y: the mean opacity of its title, sentence and form (the T rows) */
    function listAt(y) {
      var q = clamp((y - pin) / run), a = 0, i, t;
      for (i = 8; i < 11; i++) { t = T[i]; a += t[3](clamp((q - t[1]) / (t[2] - t[1]))); }
      return a / 3;
    }
    /* journey share (0..1) -> scroll position, from a table of the weighted way (96 steps, built once). The list's
       arrival weighs too (--flight-weight-list x its change of opacity): the flight slows across it, so the words
       rise in over about 300ms instead of 100ms at the flight's top speed (review r1) */
    function journey(y0, y1) {
      var N = 96, ys = [y0], J = [0], i, y, z, pz = zoomAt(y0), l, pl = listAt(y0);
      for (i = 1; i <= N; i++) {
        y = y0 + (y1 - y0) * i / N;
        z = zoomAt(y);
        l = listAt(y);
        ys.push(y);
        J.push(J[i - 1] + Math.abs(y - ys[i - 1]) / run + WEIGHT * Math.abs(z - pz) + WLIST * Math.abs(l - pl));
        pz = z;
        pl = l;
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
    /* a wheel turn or a touch at the top is about to scroll, and a press on the action or the cue is about to start
       the walk-in (a press lasts about 100ms before its click): promote now, so the first frame of the sequence does
       not also pay for creating its layers (dropped again if nothing moves) */
    function prime() {
      if (!on || promoted || shown > 0) return;
      promote(true);
      clearTimeout(idle);
      idle = setTimeout(function () { if (shown <= 0) settle(); }, 400);
    }
    /* A mouse arriving over the first screen readies the image layers at rest, at their rest scale (the facade,
       the camera, the plate, the leaves, their shade, the lamplight), so the first frame of a wheel scroll or of the
       walk-in creates no layer and rasters nothing. Images only, never the text (a promoted text layer can lose
       subpixel antialiasing); kept until the sequence takes over; back at the top all hints are dropped (settle()). */
    function warm(e) {
      if (!on || promoted || ready || shown > 0 || (e && e.pointerType && e.pointerType !== "mouse")) return;
      ready = true;
      for (var i = 0; i < WARM; i++) LAYERS[i][0].style.willChange = LAYERS[i][1];
    }
    function refresh() { try { refreshInner(); } catch (err) { bail("refresh", err); } }
    function refreshInner() {            /* new geometry, same progress */
      rq = 0;
      if (!on) return;
      var was = endOff, w0 = mw, h0 = mh;
      measure();
      /* the list was at rest and the screen changed size (a rotation, a keyboard closing in a browser that resizes
         the page): the run is measured again in svh but the scroll position is kept, so the page would land back
         in the door sequence with the list hidden, a focused field invisible (review r1). Keep the list at rest,
         at the same distance into it. */
      if (was >= 0 && !fl && (mw !== w0 || mh !== h0) && target().p < 1) window.scrollTo(0, pin + run + was);
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
      if (ready) { ready = false; for (var j = 0; j < WARM; j++) LAYERS[j][0].style.willChange = ""; }   /* the readied layers too */
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
    wrap.addEventListener("pointerdown", function (e) { if (e.target.closest && e.target.closest('a[href="#lista"]')) prime(); }, { passive: true });
    window.addEventListener("pointermove", warm, { passive: true });
    /* back at the top (or a wheel at the top that did not scroll): every hint of the run goes; a mouse readies the
       image layers again when it next moves. (Readying them at idle on every device was tried: a layer is placed on
       whole device pixels, so the photograph moved by a fraction of a pixel a second after the load, up to 194
       levels on its sharpest edges at 390 x 844. On a phone the layers are made on the touch that starts the
       scroll, or in the walk-in's first frame, which moves nothing.) */
    function settle() { if (promoted) promote(false); }
    window.addEventListener("touchstart", prime, { passive: true });
    window.addEventListener("resize", queue);
    window.addEventListener("orientationchange", queue);
    /* the run held for a focused field (measure()) is let go when the focus leaves the list */
    if (list) list.addEventListener("focusout", function () { if (wrap.style.getPropertyValue("--porta-run")) queue(); });
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
      return { pin: pin, run: run, S: cam.s, kp: cam.kp, keys: KX, scales: KY.map(Math.exp), light: LIGHT, flat: COVER_AT, list: [T[8][1], T[10][2]], r: shown, p: seen };
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
      var y = listY(), d = y - window.pageYOffset,
        fits = e.target.getBoundingClientRect().bottom - list.getBoundingClientRect().top <= window.innerHeight - 8;
      if (list.offsetHeight <= window.innerHeight + 2) { if (Math.abs(d) > 2) window.scrollTo(0, y); }
      /* a list taller than the screen: its rest position whenever what took the focus is in view there (from either
         side: the browser's own focus scroll may have gone past it and clipped the title, review r1); otherwise its
         start, then whatever took the focus */
      else if (fits) { if (Math.abs(d) > 2) window.scrollTo(0, y); }
      else if (d > 2) {
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
