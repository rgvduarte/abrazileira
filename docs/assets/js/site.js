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
      if (still.matches) return apply(t);
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
     Scroll progress p (0..1 across the pinned stretch) drives every layer, each over its own
     sub-range and curve. Preferred driver: Web Animations on a ViewTimeline (runs on the
     compositor, in step with the scroll, no JS per frame; Chrome 115+, Safari 26+). Elsewhere a
     passive scroll listener + requestAnimationFrame writes transform/opacity directly. */
  (function () {
    var wrap = document.querySelector("[data-porta]");
    if (!wrap) return;
    var $ = function (s) { return wrap.querySelector(s); },
      stage = $(".porta__stage"), frame = $(".porta__frame"), intro = $(".intro"), scene = $(".scene"),
      door = (scene.getAttribute("data-door") || "0.5 0.5 0.3 0.5").split(" ").map(Number),
      css = getComputedStyle(root),
      openL = parseFloat(css.getPropertyValue("--open-l")) || 47,
      openR = parseFloat(css.getPropertyValue("--open-r")) || 55,
      cam = { dx: 0, dy: 0, s: 4 },
      probe = document.createElement("div"), camAnim = null, camOpt = null,
      mode = "", anims = [], top = 0, run = 1, last = -1, ticking = false, idle;
    probe.className = "porta__probe";
    probe.setAttribute("aria-hidden", "true");
    stage.appendChild(probe);

    /* curves (easings.net): out = easeOutCubic, door = easeInOutCubic, soft = easeInOutSine */
    var CURVE = { out: [0.33, 1, 0.68, 1], door: [0.65, 0, 0.35, 1], soft: [0.37, 0, 0.63, 1] };
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
    var EASE = { out: bezier(CURVE.out), door: bezier(CURVE.door), soft: bezier(CURVE.soft) };
    function cb(n) { return "cubic-bezier(" + CURVE[n].join(",") + ")"; }
    function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

    /* The timeline. Lead: doors, then the camera. Support: hall light, spill, text. Decoration: cue.
       [element, from p, to p, curve, value at 0, value at 1, style(v)] */
    var T = [
      [intro, 0, 0.2, "out", 0, 1, function (v) { return { opacity: 1 - v, transform: "translateY(" + (-24 * v) + "px)" }; }],
      [$(".porta__cue"), 0, 0.06, "out", 0, 1, function (v) { return { opacity: 1 - v, transform: "translateY(" + (6 * v) + "px)" }; }],
      [$(".leaf--l"), 0.04, 0.5, "door", 0, openL, function (v) { return { transform: "rotateY(" + v + "deg)" }; }],
      [$(".leaf--r"), 0.08, 0.52, "door", 0, openR, function (v) { return { transform: "rotateY(" + -v + "deg)" }; }],
      [$(".hall__dawn"), 0.06, 0.3, "soft", 0, 1, function (v) { return { opacity: v }; }],
      [$(".hall__light"), 0.2, 0.52, "soft", 0, 1, function (v) { return { opacity: v }; }],
      [$(".spill"), 0.14, 0.56, "soft", 0, 1, function (v) { return { opacity: v }; }],
      [$(".porta__flood"), 0.8, 1, "soft", 0, 1, function (v) { return { opacity: v }; }]
    ];
    /* the camera: pans the doorway to the centre of the screen, then walks in until the opening
       covers it. Scale is interpolated geometrically (constant perceived speed), eased in and out. */
    var PAN = [0.04, 0.56], ZOOM = [0.18, 1];
    function camAt(p) {
      var m = EASE.soft(clamp((p - PAN[0]) / (PAN[1] - PAN[0]))),
        z = EASE.soft(clamp((p - ZOOM[0]) / (ZOOM[1] - ZOOM[0]))),
        s = Math.pow(cam.s, z);
      return "translate(" + (cam.dx * m).toFixed(2) + "px," + (cam.dy * m).toFixed(2) + "px) scale(" + s.toFixed(4) + ")";
    }
    function camFrames() {
      var k = [], n = 40;
      for (var i = 0; i <= n; i++) {
        var o = PAN[0] + (1 - PAN[0]) * i / n;
        k.push({ offset: o, transform: camAt(o) });
      }
      k.unshift({ offset: 0, transform: camAt(0) });
      return k;
    }
    function frames(t) {
      var k = [], a = t[1], b = t[2], v0 = t[6](t[4]), v1 = t[6](t[5]);
      if (a > 0) k.push(assign({ offset: 0 }, v0));
      k.push(assign({ offset: a, easing: cb(t[3]) }, v0));
      k.push(assign({ offset: b }, v1));
      if (b < 1) k.push(assign({ offset: 1 }, v1));
      return k;
    }
    function assign(o, v) { for (var key in v) o[key] = v[key]; return o; }

    /* geometry: read once per resize (untransformed layout via offset*, never inside the scroll path) */
    function measure() {
      var W = scene.offsetWidth, H = scene.offsetHeight;
      var cx = scene.offsetLeft + door[0] * W, cy = scene.offsetTop + door[1] * H;
      for (var el = scene.offsetParent; el && el !== stage; el = el.offsetParent) { cx += el.offsetLeft; cy += el.offsetTop; }
      /* small-viewport height (stable while mobile toolbars come and go) and the pin offset */
      var vw = stage.clientWidth, vh = probe.offsetHeight || window.innerHeight,
        stick = Math.min(0, vh - frame.offsetHeight);
      stage.style.setProperty("--stick", stick + "px");
      var sh = Math.max(vh, stage.clientHeight + stick);   /* the large viewport: also stable */
      cam.dx = vw / 2 - cx;
      cam.dy = vh / 2 - stick - cy;
      /* portrait: the opening ends up covering the screen; landscape: it fills the height
         (up to 1.5x) and the flood does the rest, so the hall and its lamp stay in view */
      var sw = vw / (door[2] * W), shh = sh / (door[3] * H);
      cam.s = Math.max(shh * 1.1, Math.min(sw * 1.04, shh * 1.5));
      var r = wrap.getBoundingClientRect();
      top = r.top + window.pageYOffset;
      run = Math.max(1, wrap.offsetHeight - window.innerHeight);
    }
    function progress() { return clamp((window.pageYOffset - top) / run); }

    function render(p) {
      for (var i = 0; i < T.length; i++) {
        var t = T[i], u = EASE[t[3]](clamp((p - t[1]) / (t[2] - t[1]))), st = t[6](t[4] + (t[5] - t[4]) * u), s = t[0].style;
        if ("opacity" in st) s.opacity = st.opacity;
        if ("transform" in st) s.transform = st.transform;
      }
      scene.style.transform = camAt(p);
    }

    function viaTimeline() {
      if (typeof window.ViewTimeline !== "function" || !(window.CSS && CSS.supports("animation-timeline: view()"))) return false;
      try {
        var tl = new ViewTimeline({ subject: wrap, axis: "block" }),
          opt = { timeline: tl, rangeStart: "contain 0%", rangeEnd: "contain 100%", fill: "both" };
        anims = T.map(function (t) { return t[0].animate(frames(t), opt); });
        camOpt = opt;
        camLive();
      } catch (e) {
        stop();
        return false;
      }
      return true;
    }
    /* The camera rides the timeline while the page scrolls. At rest (and zoomed in) it is handed to a
       static transform, so the browser re-rasterises the drawing at its real size: crisp vectors at
       any zoom, without a permanent will-change. The next scroll gives it back to the timeline. */
    function camLive() {
      if (camAnim || !camOpt) return;
      camAnim = scene.animate(camFrames(), camOpt);
      scene.style.transform = "";
    }
    function camRest() {
      var p = progress();
      if (!camAnim || p < 0.3) return;
      scene.style.transform = camAt(p);
      camAnim.cancel();
      camAnim = null;
    }
    function onScrollTL() {
      camLive();
      clearTimeout(idle);
      idle = setTimeout(camRest, 220);
    }
    function check() {   /* trust the timeline only if it agrees with our own progress */
      var a = anims[anims.length - 1], ct = a && a.effect && a.effect.getComputedTiming();
      if (!ct || ct.progress == null || Math.abs(ct.progress - progress()) > 0.03) { stop(); start("frames"); }
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        ticking = false;
        var p = progress();
        if (p === last) return;
        last = p;
        /* promote the zooming layer only while it moves; at rest it re-rasters crisp */
        if (p > 0.12 && p < 1) { scene.style.willChange = "transform"; clearTimeout(idle); idle = setTimeout(function () { scene.style.willChange = ""; }, 180); }
        render(p);
      });
    }
    function onResize() {
      measure();
      if (mode === "timeline") { if (camAnim) camAnim.effect.setKeyframes(camFrames()); else scene.style.transform = camAt(progress()); }
      else if (mode === "frames") { last = -1; onScroll(); }
    }
    function stop() {
      anims.forEach(function (a) { a.cancel(); });
      anims = [];
      if (camAnim) camAnim.cancel();
      camAnim = camOpt = null;
      clearTimeout(idle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onScrollTL);
      T.forEach(function (t) { t[0].style.opacity = ""; t[0].style.transform = ""; });
      scene.style.transform = "";
      scene.style.willChange = "";
      stage.style.removeProperty("--stick");
      mode = "";
    }
    function start(force) {
      measure();
      if (force !== "frames" && viaTimeline()) {
        mode = "timeline";
        window.addEventListener("scroll", onScrollTL, { passive: true });
        onScrollTL();
        window.requestAnimationFrame(function () { window.requestAnimationFrame(check); });
      } else {
        mode = "frames";
        last = -1;
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
      }
      root.setAttribute("data-sequence", mode);
    }
    function set() {
      stop();
      if (!still.matches) {
        root.classList.add("porta-on");
        start();
      } else {
        root.classList.remove("porta-on");
        root.setAttribute("data-sequence", "static");
      }
    }
    var rt, w = window.innerWidth;
    window.addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(function () {
        /* width changes can change the layout; height-only changes (mobile toolbars) only re-measure */
        if (window.innerWidth !== w) { w = window.innerWidth; set(); } else if (mode) onResize();
      }, 120);
    });
    if (still.addEventListener) still.addEventListener("change", set);
    /* keyboard: a focused control in the stage must be visible, so rewind to the rest state */
    intro.addEventListener("focusin", function () {
      if (mode && progress() > 0.01) window.scrollTo({ top: top, behavior: "instant" });
    });
    set();
    /* arriving with #lista: the wrapper grew after the browser's first jump, so land on the list again */
    if (location.hash === "#lista" && mode) document.getElementById("lista").scrollIntoView({ block: "start", behavior: "instant" });
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

  /* ---------------------------------------------------------------- 4. The list rises in once */
  (function () {
    var el = document.querySelector("[data-reveal]"), list = document.getElementById("lista");
    if (!el) return;
    if (!still.matches && "IntersectionObserver" in window) {
      root.classList.add("js-reveal");
      var io = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { el.classList.add("is-in"); io.disconnect(); }
      }, { rootMargin: "0px 0px -12% 0px" });
      io.observe(el);
    }
    /* keyboard: arriving in the form from outside brings the whole list into view */
    if (list) list.addEventListener("focusin", function (e) {
      el.classList.add("is-in");
      if (e.relatedTarget && list.contains(e.relatedTarget)) return;
      var r = list.getBoundingClientRect();
      if (Math.abs(r.top) > 2 && r.height <= window.innerHeight + 2) list.scrollIntoView({ block: "start", behavior: "instant" });
    });
  })();
})();
