/* A Brazileira · site.js
   Progressive enhancement only: without it the page is complete (theme follows the system,
   no pinned sequence, the waiting list explains how to sign up).
   1. Dia / Noite   2. The door sequence (scroll-linked)   3. The waiting list   4. The list rises in once */
(function () {
  "use strict";
  var root = document.documentElement,
    still = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------------------------------------------------------------- 1. Dia / Noite */
  (function () {
    var group = document.querySelector("[data-theme-switch]"),
      dark = window.matchMedia("(prefers-color-scheme: dark)"),
      KEY = "ab-tema",
      timer;
    if (!group) return;
    var buttons = group.querySelectorAll("[data-theme-set]");

    function current() {
      var t = root.getAttribute("data-theme");
      return t === "dia" || t === "noite" ? t : dark.matches ? "noite" : "dia";
    }
    function sync() {
      var t = current(), i, metas = document.querySelectorAll('meta[name="theme-color"]');
      for (i = 0; i < buttons.length; i++) {
        buttons[i].setAttribute("aria-pressed", String(buttons[i].getAttribute("data-theme-set") === t));
      }
      if (root.hasAttribute("data-theme")) {
        var bg = getComputedStyle(root).getPropertyValue("--color-bg").trim() || getComputedStyle(document.body).backgroundColor;
        for (i = 0; i < metas.length; i++) metas[i].setAttribute("content", bg);
      }
    }
    function apply(t) {
      root.setAttribute("data-theme", t);
      try { localStorage.setItem(KEY, t); } catch (e) {}
      sync();
    }
    group.addEventListener("click", function (e) {
      var b = e.target.closest("[data-theme-set]");
      if (!b) return;
      var t = b.getAttribute("data-theme-set");
      if (t === current()) return;
      if (still.matches || (root.__portaBusy && root.__portaBusy())) return apply(t);
      if (document.startViewTransition) {
        document.startViewTransition(function () { apply(t); });
        return;
      }
      root.classList.add("is-theming");
      apply(t);
      clearTimeout(timer);
      timer = setTimeout(function () { root.classList.remove("is-theming"); }, 450);
    });
    if (dark.addEventListener) dark.addEventListener("change", sync);
    group.hidden = false;
    sync();
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
      cam = { dx: 0, dy: 0, s: 4 }, pin = 0, run = 1,
      probe = document.createElement("div"),
      shown = -1, raf = 0, last = 0, lastY = NaN, calm = 0, promoted = false, idle, rq = 0, on = false;
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
      zoom: curve("--curve-zoom", [0.5, 0.05, 0.3, 1]),
      fade: curve("--curve-fade", [0.45, 0, 0.55, 1])
    };
    function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

    /* The timeline: [element, from p, to p, curve, value(u) -> [opacity, transform]].
       Lead: the doors from the first pixel, then the camera. Support: text out, light carried by the
       doors, the hand-off. Decoration: the cue. The list title enters at p = 0.82 (CSS + section 4). */
    var DOOR = [0, 0.42], PAN = [0, 0.36], ZOOM = [0.04, 0.9], COVERED = 0.92;
    var T = [
      [intro, 0, 0.16, E.copy, function (u) { return [1 - u, "translate(0," + (-16 * u).toFixed(2) + "px)"]; }],
      [$(".porta__cue"), 0, 0.05, E.copy, function (u) { return [1 - u, null]; }],
      [$(".leaf--l"), DOOR[0], DOOR[1], E.door, function (u) { return [null, "rotateY(" + (openL * u).toFixed(3) + "deg)"]; }],
      [$(".leaf--r"), DOOR[0], DOOR[1], E.door, function (u) { return [null, "rotateY(" + (-openR * u).toFixed(3) + "deg)"]; }],
      [$(".hall__light"), DOOR[0], DOOR[1], E.door, function (u) { return [u, null]; }],     /* carried by the doors */
      [$(".spill"), DOOR[0], DOOR[1], E.door, function (u) { return [u, null]; }],
      [$(".hall__flat"), 0.6, 0.86, E.fade, function (u) { return [u, null]; }],             /* the hall becomes the list colour */
      [$(".porta__flood"), 0.86, 0.92, E.fade, function (u) { return [u, null]; }]           /* covers the edge-on leaves */
    ];
    /* the camera: the doorway travels to the centre of the screen while the text leaves, then the walk-in
       scales the scene around it until the opening covers the screen. Scale is geometric (constant
       perceived speed); the doorway centre moves on a straight line. */
    function camAt(p) {
      var m = E.pan(clamp((p - PAN[0]) / (PAN[1] - PAN[0]))),
        z = E.zoom(clamp((p - ZOOM[0]) / (ZOOM[1] - ZOOM[0])));
      return "translate(" + (cam.dx * m).toFixed(2) + "px," + (cam.dy * m).toFixed(2) + "px) scale(" + Math.pow(cam.s, z).toFixed(4) + ")";
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
      var sh = Math.max(vh, stage.clientHeight + stick);      /* bottom of the large viewport */
      cam.dx = vw / 2 - cx;
      cam.dy = vh / 2 - stick - cy;
      /* the walk-in ends with the opening covering the whole (large) viewport in every orientation and
         aspect ratio, so the hand-off is hall colour over hall colour, never a fade over the stone */
      /* across, the open leaves stand edge-on inside the opening: in the drawing's perspective each one
         still covers about 7% of its width, so the camera passes them too (LEAVES = the clear share) */
      var ow = door[2] * W, oh = door[3] * H, LEAVES = 0.86;
      cam.s = Math.max(vw / (ow * LEAVES), 2 * Math.max(vh / 2, sh - vh / 2) / oh) * 1.04;
      var r = wrap.getBoundingClientRect();
      pin = r.top + window.pageYOffset - stick;
      run = Math.max(1, wrap.offsetHeight - stage.offsetHeight);
    }
    function target() {
      var y = window.pageYOffset;
      return { y: y, p: clamp((y - pin) / run) };
    }

    function render(p) {
      var i, t, s, v;
      /* once the lit hall is opaque, the hall in shadow behind it is never seen: stop drawing it (at full
         zoom its hatching was the most expensive thing to raster) */
      if ((p >= DOOR[1]) !== backHidden) { backHidden = !backHidden; back.style.visibility = backHidden ? "hidden" : ""; }
      if (p <= 0) {                     /* exact rest: the CSS state, nothing inline */
        for (i = 0; i < T.length; i++) { s = T[i][0].style; s.opacity = ""; s.transform = ""; }
        scene.style.transform = "";
        return;
      }
      for (i = 0; i < T.length; i++) {
        t = T[i];
        v = t[4](t[3](clamp((p - t[1]) / (t[2] - t[1]))));
        s = t[0].style;
        if (v[0] !== null) s.opacity = v[0] <= 0 ? "0" : v[0] >= 1 ? "1" : v[0].toFixed(4);
        if (v[1] !== null) s.transform = v[1];
      }
      scene.style.transform = camAt(p);
    }

    /* Promote the moving layers only while they move; at rest the drawing re-rasters crisp at its size.
       Every layer whose opacity changes per frame gets its own compositor layer too: otherwise each change
       repaints the doorway inside the zooming camera layer and the browser re-rasters it at the new
       scale every frame (measured: 2.7s of raster per pass at 1440 x 900, frames up to 200ms).
       The transform hint also freezes their raster scale while the camera zooms. */
    var LAYERS = [[scene, "transform"], [$(".hall__light"), "transform, opacity"], [intro, "transform, opacity"],
      [$(".porta__cue"), "opacity"], [$(".spill"), "transform, opacity"], [$(".hall__flat"), "opacity"], [$(".porta__flood"), "opacity"]],
      DRAWN = 2,           /* the first two carry line work: they are re-rastered when the scroll rests */
      sharp = 0, sharpT;
    function promote(yes) {
      clearTimeout(sharpT);
      sharp = 0;
      if (yes === promoted) return;
      promoted = yes;
      for (var i = 0; i < LAYERS.length; i++) LAYERS[i][0].style.willChange = yes ? LAYERS[i][1] : "";
    }
    /* At rest mid-sequence: hand the drawn layers back for one frame (they re-raster crisp at the current
       zoom), then promote them again at that scale, so the next scroll starts without any raster work. */
    function rest() {
      if (!promoted || sharp) return;
      sharp = 1;
      for (var i = 0; i < DRAWN; i++) LAYERS[i][0].style.willChange = "";
      sharpT = setTimeout(function () {
        sharp = 2;
        for (var i = 0; i < DRAWN; i++) LAYERS[i][0].style.willChange = LAYERS[i][1];
      }, 120);
    }
    function tick(now) {
      raf = 0;
      if (!on) return;
      var g = target(), dt = last ? Math.min(64, now - last) : 16.7, r;
      last = now;
      if (shown < 0 || Math.abs(g.p - shown) > JUMP) r = g.p;           /* first frame, or a jump: no replay */
      else r = shown + (g.p - shown) * (1 - Math.exp(-dt / TAU));
      if (Math.abs(g.p - r) < EPS) r = g.p;
      if (r !== shown) {
        if (r > 0) {
          if (sharp === 1) promote(false);        /* moved again before the re-raster finished */
          promote(true);
          clearTimeout(idle);
        }
        render(r);
        shown = r;
      }
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
    /* a wheel turn or a touch at the top is about to scroll: promote now, so the first frame of the
       sequence does not also pay for creating its layers (dropped again if nothing moves) */
    function prime() {
      if (!on || promoted || shown > 0) return;
      promote(true);
      clearTimeout(idle);
      idle = setTimeout(function () { if (shown <= 0) promote(false); }, 400);
    }
    function refresh() {            /* new geometry, same progress */
      rq = 0;
      if (!on) return;
      measure();
      if (shown >= 0) render(shown);
      calm = 0;
      kick();
    }
    function queue() { if (on && !rq) rq = window.requestAnimationFrame(refresh); }

    function off() {
      on = false;
      if (raf) window.cancelAnimationFrame(raf);
      raf = 0;
      clearTimeout(idle);
      window.removeEventListener("scroll", kick);
      render(0);
      promote(false);
      stage.style.removeProperty("--stick");
      shown = -1;
    }
    function set() {
      off();
      if (still.matches) {
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
    window.addEventListener("touchstart", prime, { passive: true });
    window.addEventListener("resize", queue);
    window.addEventListener("orientationchange", queue);
    if (window.visualViewport) window.visualViewport.addEventListener("resize", queue);
    window.addEventListener("load", queue);
    window.addEventListener("pageshow", function () { shown = -1; queue(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(queue);
    if (still.addEventListener) still.addEventListener("change", set);
    else if (still.addListener) still.addListener(set);
    /* keyboard: a focused control in the stage must be visible, so rewind to the rest state (a jump: no replay) */
    intro.addEventListener("focusin", function () {
      if (on && target().p > 0.01) window.scrollTo(0, pin);
    });
    set();
    /* while the sequence is under way, the theme changes without a cross-fade (no snapshot mid-shot) */
    root.__portaBusy = function () { return on && shown > 0.01; };
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
      busy = false;

    function state(s) { form.setAttribute("data-state", s); }
    function mark(input, box, text) {
      box.textContent = text || "";
      box.hidden = !text;
      if (text) { input.setAttribute("aria-invalid", "true"); input.setAttribute("aria-describedby", box.id); }
      else { input.removeAttribute("aria-invalid"); input.removeAttribute("aria-describedby"); }
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
    function fail() {
      state("error");
      msg.textContent = d.msgError;
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
     The hero action and the scroll cue jump straight to the list (no smooth scroll: the sequence never
     plays as a flash) and put the focus in the email field. The list content rises in once, in two
     beats (title + sentence, then the form), as soon as its title enters the screen: that happens
     while the walk-in is still ending, because the list overlaps the last part of the run (CSS). */
  (function () {
    var el = document.querySelector("[data-reveal]"), list = document.getElementById("lista"),
      email = document.getElementById("email");
    if (!el || !list) return;
    function now() { el.classList.add("is-now", "is-in"); }
    function listY() { return list.getBoundingClientRect().top + window.pageYOffset; }
    if (!still.matches && "IntersectionObserver" in window) {
      root.classList.add("js-reveal");
      var io = new IntersectionObserver(function (es) {
        for (var i = 0; i < es.length; i++) if (es[i].isIntersecting) { el.classList.add("is-in"); io.disconnect(); return; }
      }, { rootMargin: "0px" });
      io.observe(el.firstElementChild || el);
    }
    function toList(e) {
      e.preventDefault();
      now();
      window.scrollTo(0, listY());
      if (email && !email.closest("fieldset:disabled")) email.focus({ preventScroll: true });
    }
    var links = document.querySelectorAll('.porta a[href="#lista"]');
    for (var i = 0; i < links.length; i++) links[i].addEventListener("click", toList);
    /* keyboard: arriving in the form from outside brings the whole list into view, already revealed */
    list.addEventListener("focusin", function (e) {
      now();
      if (e.relatedTarget && list.contains(e.relatedTarget)) return;
      var y = listY();
      if (Math.abs(y - window.pageYOffset) > 2 && list.offsetHeight <= window.innerHeight + 2) window.scrollTo(0, y);
    });
    /* arriving with #lista: the wrapper grew after the browser's first jump, so land on the list again */
    if (location.hash === "#lista") { now(); window.scrollTo(0, listY()); }
  })();
})();
