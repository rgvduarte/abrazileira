// The 3D entrance (door3d.js): ON BY DEFAULT where the device can draw it, with the CSS entrance as the automatic
// fallback at every step; lazy, never on the first paint, a canvas that takes over only while the
// doors move, and the CSS entrance whenever it cannot.
// Usage: node src/tests/door3d.test.js docs
// Headless Chromium has no GPU: by default the page refuses its software renderer (SwiftShader), as it should. The 3D
// path is driven either with ?3d=force (no GPU probe, no frame-time rule: frame rates here say nothing about a phone)
// or, for the default path, with a capable GPU spoofed in an init script (the renderer's name, the caveat flag dropped,
// 8 cores, 8 GB) and the frame-time rule given limits SwiftShader can meet (?guard=MED,MAX).
// 1. Per viewport (390 x 844 touch, 1440 x 900 mouse) and theme, ?3d=force:
//   requested after the first paint (at its first idle moment) and mounted with no scroll at all; at rest the canvas is hidden and the photograph's
//   layers are shown, with no inline style left; mid-run (p = 0.15, 0.3, 0.5) the canvas draws (not the wall colour) and
//   the layers it replaces are hidden; under the flat colour (p = 0.9) the canvas is hidden and every pixel is
//   --color-hall; back at the top: the exact rest state; the hero action's flight lands in the email field, the canvas
//   drawn on the way; a theme change mid-run: canvas or CSS entrance, never neither; a theme change at rest: the next
//   scroll uploads nothing; a context lost in the background (the page hidden): the CSS entrance while away, the 3D
//   rebuilt once the page is shown and still; a context lost while shown: the CSS entrance at the same progress with no
//   jump (mean |dRGB| of the frames before and after), for good (a later pageshow does not bring it back).
// 2. The gate, 390 x 844: the default page on a software renderer, ?sem3d, ?semporta, reduced motion (with and without
//   ?3d=force), a data saver, a 2G link, deviceMemory 1, 2 cores, a weak GPU's name: refused with the reason, nothing
//   requested (and no WebGL context made where the reason is known before); ?3d skips the soft heuristics (a weak GPU
//   draws) but keeps the probe (a software renderer is refused); a refusal is remembered for the session; a capable GPU
//   gets the 3D by default, fetched after the first paint, before any scroll.
// 3. The live safeguard (capable GPU spoofed): an injected 2.5 s frame (?guard=100000,1500), a slow median (?guard=25,..
//   with 50 ms of work in every frame) and an exception in a draw each hand back to the CSS entrance at the same
//   progress (the slow cases dissolve over --dur-handback) and say why in ?diag. A slow hand-back is counted for the
//   session (?diag «slow hand-backs 1/2»): the next load draws the 3D again, without a new probe; a second one refuses it
//   for the session, with the reason. An exception is
//   refused for the session at once. In one tab: the old build's memo for one slow frame counts as 1/2 (probed again,
//   the 3D on); a clean first second clears the count; the next slow hand-back is 1/2; a context lost during its
//   dissolve (the page hidden) rebuilds nothing in that page view; the next load draws the 3D. Not the 3D's own work, not counted: a 2.5 s stall in a take-over's frames, in a
//   resize's frame, in a theme change's frame, a tab switch; a page restored from the back/forward cache with its
//   context keeps the 3D without a rebuild.
// 4. iOS (iPhone user agent, DPR 3) and Android Chrome at DPR 3: the canvas at the device's ratio, 3, no MSAA (iOS was
//    capped at 2 until 9 Nov: softer than the photograph).
// 5. The take-over frame (1 px of scroll) is as sharp as the page's photograph (gradient energy, 3D / CSS) and equals it
//   (mean |dRGB|) at 390 x 844 @3 and 1440 x 900 @1; at p 0.15 and 0.3 the door's plane follows the CSS camera: the
//   facade outside the doorway aligns at a shift of (0, 0) device px (searched +-4) and differs by a mean of < 2 levels.
// 6. A wheel or a touch drag 300 ms after the load event, at 4x CPU throttle, has no long task over 50 ms (the module is
//   only fetched then; it is evaluated and mounted once the page is still). That last check is a timing gate: on a
//   machine busy with other headless browsers a task of the machine's own can land in the window (once: one 81 ms
//   task in one run of three), so it fails only if a second attempt, in a fresh context, shows a long task too.
// 6b. A touch drag that starts as the module is asked for, and one at the facade's first band (default path, 4x CPU
//   throttle): no input waits more than 50 ms (the same timing gate).
// 7. The open leaves' width against the doorway is flat from p 0.34 (the 3D frame's own meshes,
//   projected); a shader that does not compile is refused at the mount (nothing drawn, remembered); a draw that throws
//   while the mount warms up and a module that does not run are refused, named and remembered (the next load asks for
//   nothing); a hand-back lets the WebGL context go once the GPU has caught up and the page is still. Section 1 also records every frame of a touch drag (390) and
//   of the flight: while the camera moves, the canvas draws and the photograph is hidden, never a blank frame, the flight
//   0.9-1.1 s; under the flat colour the photograph stays hidden; section 3: nothing is drawn while handing back.
// 8. Ready sooner on iOS (the 3D should not still be «loading» at the first walk-in once the gate has passed). Under an
//   iPhone emulation (Safari 26 user agent, DPR 3, 390 x 796, 4x CPU throttle, Safari's API surface: no
//   requestIdleCallback, no navigator.scheduling, no scheduler, no deviceMemory, no navigator.connection; «Apple GPU»
//   spoofed): a still visitor gets the 3D soon after the load event (the gate within 1 s of the first paint; «on»
//   within 4 s of the load event and within 1.5 s of it net of the time spent waiting for SwiftShader, the tests' GPU,
//   on its fences), with no long task over 50 ms after the load event and almost no time held; a visitor who starts to
//   scroll 1 s after the load event (flicks with pauses): no input waits over 50 ms (timing gates, a second attempt).
//   ?diag names the stage while loading («3d=loading:upload 5/19 840ms») and lists when each stage began. The
//   watchdog: a step that hangs (a band's crop that never resolves) falls back to the CSS entrance after its limit,
//   named, remembered for the session; a decode that hangs (the worker never answers) too, not remembered (a network
//   fault is tried again on the next load). Then (10 Nov):
//   opened and scrolled at once (p 0.2 before the 3D is ready), the 3D takes over in that first walk-in as soon as it is
//   on, at the same progress, by a cross-fade over --dur-handback (never a blank frame, no long task over 50 ms), and the
//   next flick is drawn in 3D; a forced hand-back (?guard=25,60) leaves no long task over 50 ms in the next 2 s and lets
//   the context go later in a short task; the main thread held 12 s in «upload» (a page suspended in the background)
//   does not refuse the 3D.
setTimeout(() => { console.log("TIMEOUT"); process.exit(2); }, 1200000);
const { chromium } = require("playwright"), serve = require("./serve.js"), png = require("./png.js");
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.replace("#", "").padEnd(6, "0").slice(i - 1, i + 1), 16));
const [, , dir] = process.argv;
/* a capable GPU, in an init script: the renderer's name, the major-performance-caveat flag dropped (SwiftShader would
   be refused by it), 8 cores and 8 GB unless given; the WebGL contexts made are counted (window.__gl) */
const spoof = (o) => `(() => { const o = ${JSON.stringify(o || {})};
  window.__gl = 0;
  const g0 = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (k, a) { if (/webgl/.test(k)) { window.__gl++; if (o.gpu && a) { a = Object.assign({}, a); delete a.failIfMajorPerformanceCaveat; } } return g0.call(this, k, a); };
  if (o.gpu) { const p0 = WebGL2RenderingContext.prototype.getParameter;
    WebGL2RenderingContext.prototype.getParameter = function (k) { return k === 0x9246 || k === 0x1F01 ? o.gpu : p0.call(this, k); }; }
  Object.defineProperty(Navigator.prototype, "hardwareConcurrency", { configurable: true, get: () => o.cores || 8 });
  Object.defineProperty(Navigator.prototype, "deviceMemory", { configurable: true, get: () => o.mem || 8 });
  if (o.conn) Object.defineProperty(Navigator.prototype, "connection", { configurable: true, get: () => o.conn });
})();`;
const GPU = "ANGLE (Apple, ANGLE Metal Renderer: Apple M2, Unspecified Version)";
(async () => {
  const { srv, base } = await serve(dir);
  const b = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  let fail = 0;
  const report = (ok, ...a) => { if (!ok) fail++; console.log(ok ? "PASS" : "FAIL", ...a); };
  const geo = (pg) => pg.evaluate(() => document.documentElement.__porta.geo());
  const state = (pg) => pg.evaluate(() => { const c = document.querySelector(".porta__3d"), s = document.querySelector(".scene"), g = document.documentElement.__porta.geo();
    return { canvas: c ? getComputedStyle(c).visibility : "none", scene: getComputedStyle(s).visibility, inline: s.style.visibility, d3: g.d3, why: g.d3why, r: +g.r.toFixed(4) }; });
  const go = async (pg, p) => {
    const dead = await pg.evaluate(() => (document.documentElement.__porta ? null : (window.__abErr || []).join(" | ")));
    if (dead !== null) throw new Error("the sequence stepped aside: " + dead);
    await pg.evaluate((p) => { const g = document.documentElement.__porta.geo(); scrollTo(0, Math.round(g.pin + p * g.run)); }, p);
    /* the scroll has reached the driver (p is the new one) and the rendered progress has caught up with it */
    await pg.waitForFunction((p) => { const g = document.documentElement.__porta.geo(); return Math.abs(g.p - p) < 0.003 && g.r === g.p; }, p, { timeout: 8000 }).catch(() => {});
    await pg.waitForTimeout(150);
  };
  const settled = (pg, t) => pg.waitForFunction(() => { const g = document.documentElement.__porta && document.documentElement.__porta.geo(); return g && g.d3 !== "off" && g.d3 !== "loading"; }, null, { timeout: t || 30000 }).catch(() => {});
  const onAt = (pg) => pg.waitForFunction(() => document.documentElement.__porta.geo().d3 === "on", null, { timeout: 60000 }).catch(() => {});
  const shot = async (pg) => png.decode(await pg.screenshot());
  const mean = (A, B) => { let s = 0, n = 0; for (let y = 0; y < A.h; y += 2) for (let x = 0; x < A.w; x += 2) { const a = A.px(x, y), c = B.px(x, y); s += (Math.abs(a[0] - c[0]) + Math.abs(a[1] - c[1]) + Math.abs(a[2] - c[2])) / 3; n++; } return s / n; };
  const vis = (pg, hidden) => pg.evaluate((h) => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => h });
    Object.defineProperty(document, "visibilityState", { configurable: true, get: () => (h ? "hidden" : "visible") });
    document.dispatchEvent(new Event("visibilitychange"));
  }, hidden);
  const lose = (pg) => pg.evaluate(() => { const c = document.querySelector(".porta__3d"); c.getContext("webgl2").getExtension("WEBGL_lose_context").loseContext(); });
  /* the per-frame recorder (see section 1) and its check: [t, scrollY, r, canvas, photograph, flood, camera transform] */
  const REC3 = () => { window.__ff = []; const q = (s) => document.querySelector(s), d = document.createElement("div");
    d.style.cssText = "position:fixed;left:0;top:0;width:1px;height:1px;pointer-events:none;opacity:0"; document.body.appendChild(d);
    new ResizeObserver(() => { const g = document.documentElement.__porta.geo(), c = q(".porta__3d");
      __ff.push([performance.now(), scrollY, g.r, c ? getComputedStyle(c).visibility : "none", getComputedStyle(q(".scene")).visibility, +getComputedStyle(q(".porta__flood")).opacity, getComputedStyle(q(".scene")).transform]); }).observe(d);
    let k = 0; const L = () => { d.style.width = (1 + (k++ % 2)) + "px"; if (__ff.length < 900) requestAnimationFrame(L); }; requestAnimationFrame(L); };
  const VERIFY3 = (flat) => { const f = window.__ff, mv = []; for (let i = 1; i < f.length; i++) if (f[i][1] !== f[i - 1][1]) mv.push(i);
    const pick = (x) => x.slice(0, 3).map((e) => [Math.round(e[0]), +(+e[2]).toFixed(3), e[3], e[4], e[5]]);
    const walk = f.filter((e) => e[2] > 0.01 && e[2] < flat);
    const gaps = mv.map((i) => f[i][0] - f[i - 1][0]).sort((a, b) => a - b);
    return { frames: f.length, moving: mv.length, ms: mv.length ? Math.round(f[mv[mv.length - 1]][0] - f[mv[0] - 1][0]) : 0, gap: gaps.length ? Math.round(gaps[gaps.length >> 1]) : 0, drawn: walk.length,
      /* a frame of the walk-in under the hall's full light (flood 1: after a fast flight p - LAG reaches the flat point
         before r does, and the page shows the flat colour, as intended) is not a frame the canvas owes */
      notCanvas: pick(walk.filter((e) => !(e[3] === "visible" && e[4] === "hidden") && e[5] < 0.999)),
      blank: pick(f.filter((e) => e[3] !== "visible" && e[4] === "hidden" && e[5] < 0.999)),
      atRest: pick(f.filter((e) => e[2] > 0.05 && e[6] === "none" && e[5] < 0.999)) }; };
  const ctx = async (o) => {
    o = o || {};
    const mobile = (o.w || 390) < 900, c = await b.newContext({ viewport: { width: o.w || 390, height: o.h || 844 }, deviceScaleFactor: o.dpr || 2, isMobile: mobile, hasTouch: mobile,
      reducedMotion: o.reduce ? "reduce" : "no-preference", userAgent: o.ua });
    await c.addInitScript((t) => { try { localStorage.setItem("ab-tema", t); } catch (e) {} }, o.theme || "dia");
    await c.addInitScript(spoof(o.spoof));
    await c.addInitScript(() => { window.addEventListener("load", () => { window.__loadAt = performance.now(); }); window.__req3d = [];
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (/door3d|three\.min/.test(e.name)) window.__req3d.push(e.startTime); }).observe({ type: "resource", buffered: true }); });
    const pg = await c.newPage(); await serve.offline(pg);
    const reqs = [], errs = [];
    pg.on("request", (r) => { if (/door3d|three\.min/.test(r.url())) reqs.push(r.url()); });
    pg.on("pageerror", (e) => errs.push(String(e)));
    return { c, pg, reqs, errs };
  };

  // ---------------------------------------------------------------- 1. ?3d=force, per viewport and theme
  for (const [n, w, h, dpr] of [["m390", 390, 844, 2], ["d1440", 1440, 900, 1]]) for (const theme of ["dia", "noite"]) {
    const mobile = w < 900;
    const { c, pg, errs } = await ctx({ w, h, dpr, theme });
    await pg.addInitScript(() => { window.__tex = 0; const P = WebGL2RenderingContext.prototype;
      for (const k of ["texImage2D", "texStorage2D", "texSubImage2D"]) { const o = P[k]; P[k] = function () { window.__tex++; return o.apply(this, arguments); }; } });
    await pg.goto(base + "?3d=force", { waitUntil: "load" });
    await settled(pg);
    const t = await pg.evaluate(() => ({ fcp: Math.round((performance.getEntriesByName("first-contentful-paint")[0] || { startTime: -1 }).startTime), load: Math.round(window.__loadAt), first: Math.round(Math.min(...window.__req3d)), y: scrollY, d3: document.documentElement.__porta.geo().d3 }));
    report(t.d3 === "on" && t.fcp > 0 && t.first > t.fcp && t.first - t.load < 2500 && t.y === 0, n, theme, "early and lazy: requested after the first paint (at its first idle moment, not after the load event), mounted with no scroll", JSON.stringify(t));
    const hall = await pg.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--color-hall").trim());
    let s = await state(pg);
    report(s.canvas === "hidden" && s.scene === "visible" && s.inline === "", n, theme, "rest: the photograph, canvas hidden", JSON.stringify(s));
    for (const p of [0.15, 0.3, 0.5]) {
      await go(pg, p);
      s = await state(pg);
      const img = await shot(pg);
      const g = await geo(pg), wall = theme === "dia" ? [250, 236, 223] : [52, 37, 28];
      let k = 0, all = 0;           /* share of the screen that is not the wall colour: the doorway was drawn */
      for (let y = 0; y < img.h; y += 5) for (let x = 0; x < img.w; x += 5) { all++; if (Math.max(...img.px(x, y).map((v, i) => Math.abs(v - wall[i]))) > 8) k++; }
      const drawn = k / all;
      report(s.canvas === "visible" && s.scene === "hidden" && g.d3shown && drawn > 0.08, n, theme, "p=" + p + ": the canvas draws", JSON.stringify({ ...s, drawn: +drawn.toFixed(3) }));
    }
    await go(pg, 0.9);
    s = await state(pg);
    {
      /* the stage under the list: the flood alone (the list's own words excepted: sample a column clear of them) */
      const fl = await pg.evaluate(() => getComputedStyle(document.querySelector(".porta__flood")).opacity);
      const img = await shot(pg), want = hex(hall);
      let bad = 0;
      for (let y = 0; y < img.h; y += 3) for (const x of [2 * dpr, img.w - 3 * dpr]) { const p = img.px(x, y); if (Math.max(...p.map((v, i) => Math.abs(v - want[i]))) > 0) bad++; }
      /* the photograph's layers stay hidden under the flood too (before the door finish: shown there, they were decoded and
         painted just as the list rose in) */
      report(s.canvas === "hidden" && s.scene === "hidden" && fl === "1" && bad === 0, n, theme, "p=0.9: canvas and photograph hidden, flat --color-hall " + hall, JSON.stringify({ ...s, flood: fl, bad }));
    }
    await go(pg, 0);
    await pg.waitForTimeout(500);
    s = await state(pg);
    const rest = await pg.evaluate(() => ({ scene: getComputedStyle(document.querySelector(".scene")).transform, intro: document.querySelector(".intro").getAttribute("style") || "" }));
    report(s.canvas === "hidden" && s.scene === "visible" && s.inline === "" && rest.scene === "none" && !/opacity|transform/.test(rest.intro), n, theme, "back at the top: exact rest state", JSON.stringify({ ...s, ...rest }));
    /* every frame, after the driver wrote it (a ResizeObserver fires after the frame's rAF callbacks and layout): what
       the stage shows. While the camera moves (0.01 < r < flat) the canvas draws and the photograph is hidden; never a
       frame with neither the canvas nor the photograph under a stage that is not yet flat colour; never the camera at
       rest (transform none) deep in the run before the flat colour */
    if (mobile) {
      await pg.evaluate(REC3);
      const cdp = await c.newCDPSession(pg), gg = await geo(pg);
      for (const dir of [1, -1]) {
        const y0 = dir > 0 ? 700 : 200;
        await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 200, y: y0 }] });
        for (let m = 20; m <= Math.min(480, gg.run * 0.6); m += 20) { await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 200, y: y0 - dir * m }] }); await pg.waitForTimeout(16); }
        await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
        await pg.waitForTimeout(400);
      }
      const v = await pg.evaluate(VERIFY3, gg.flat);
      report(v.frames > 20 && v.moving > 10 && !v.notCanvas.length && !v.blank.length && !v.atRest.length, n, theme, "touch drags down and back: every frame of the walk-in drawn by the canvas, none blank", JSON.stringify(v));
      await go(pg, 0); await pg.waitForTimeout(400);
    }
    // the flight
    await pg.evaluate(REC3);
    if (mobile) { const r = await pg.evaluate(() => { const r = document.querySelector(".cta").getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }); await pg.touchscreen.tap(r.x, r.y); }
    else await pg.click(".cta");
    await pg.waitForTimeout(3500);
    const fl = await pg.evaluate(() => ({ active: document.activeElement && document.activeElement.id, canvas: getComputedStyle(document.querySelector(".porta__3d")).visibility }));
    const fv = await pg.evaluate(VERIFY3, (await geo(pg)).flat);
    report(fl.active === "email" && fl.canvas === "hidden" && fv.moving > 8 && fv.ms >= 900 - fv.gap && fv.ms <= 1100 + fv.gap && fv.drawn > 5 && !fv.notCanvas.length && !fv.blank.length && !fv.atRest.length, n, theme,
      "flight: lands in the email field in 0.9-1.1 s (within one frame: SwiftShader draws a frame in 60-90 ms), every frame of the walk-in drawn by the canvas, none blank", JSON.stringify({ ...fl, ...fv }));
    // theme change mid-run
    await go(pg, 0); await go(pg, 0.3);
    const other = theme === "dia" ? "noite" : "dia";
    await pg.evaluate((t) => { const bt = document.querySelector('[data-theme-set="' + t + '"]'); if (bt) bt.click(); else document.documentElement.setAttribute("data-theme", t); }, other);
    await pg.waitForFunction((t) => document.documentElement.getAttribute("data-theme") === t, other, { timeout: 5000 }).catch(() => {});
    await pg.waitForTimeout(3000);
    await go(pg, 0.32);
    s = await state(pg);
    const th = await pg.evaluate(() => document.documentElement.getAttribute("data-theme"));
    report(th === other && ((s.canvas === "visible" && s.scene === "hidden") || (s.canvas === "hidden" && s.scene === "visible")), n, theme, "theme change mid-run -> " + other + ": canvas or CSS entrance, never neither", JSON.stringify(s));
    // a theme change at rest: once its textures are in, a scroll uploads nothing
    await go(pg, 0);
    await pg.evaluate((t) => document.querySelector('[data-theme-set="' + t + '"]').click(), theme);
    await pg.waitForFunction((t) => document.documentElement.getAttribute("data-theme") === t && document.documentElement.__porta.geo().d3ok, theme, { timeout: 60000 }).catch(() => {});
    await pg.waitForTimeout(500);
    await pg.evaluate(() => { window.__tex = 0; });
    await go(pg, 0.15);
    { const u = await pg.evaluate(() => ({ uploads: window.__tex, ok: document.documentElement.__porta.geo().d3ok })); s = await state(pg);
      report(u.ok && u.uploads === 0 && s.canvas === "visible", n, theme, "theme change: the next scroll uploads nothing", JSON.stringify({ ...u, ...s })); }
    // a context lost in the background (iOS takes a hidden page's GPU memory): the CSS entrance while away, rebuilt when shown
    await go(pg, 0.3);
    await vis(pg, true);
    await lose(pg);
    await pg.waitForTimeout(300);
    const away = await state(pg);
    await vis(pg, false);
    await go(pg, 0);
    await onAt(pg);
    await pg.waitForTimeout(3200);           /* past the "just shown again" window: a loss now is the foreground's */
    await go(pg, 0.32);
    s = await state(pg);
    const tries = (await geo(pg)).d3try;
    report(away.d3 === "context lost" && away.canvas === "none" && away.scene === "visible" && s.d3 === "on" && s.canvas === "visible" && tries === 1, n, theme,
      "context lost in the background: the CSS entrance while away, the 3D rebuilt once shown", JSON.stringify({ away: away.d3, ...s, tries }));
    // a context lost while shown: the CSS entrance at the same progress, no jump, for good
    await go(pg, 0.3);
    await pg.waitForTimeout(1500);           /* SwiftShader presents a frame late: read the 3D frame once it has */
    const A = await shot(pg), r0 = (await state(pg)).r;
    await lose(pg);
    await pg.waitForTimeout(400);
    const B = await shot(pg);
    s = await state(pg);
    const jump = mean(A, B);
    report(s.canvas === "none" && s.scene === "visible" && s.d3 === "handed back" && /context lost while shown/.test(s.why) && Math.abs(s.r - r0) < 0.002 && jump < 6, n, theme,
      "context lost while shown: the CSS entrance at the same progress, no jump (mean |dRGB| " + jump.toFixed(2) + ")", JSON.stringify({ ...s, r0 }));
    await go(pg, 0.5);
    const after = await pg.evaluate(() => ({ scene: getComputedStyle(document.querySelector(".scene")).transform, seq: document.documentElement.dataset.sequence }));
    await go(pg, 0);
    await pg.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pageshow", { persisted: true })));
    await pg.waitForTimeout(1500);
    await go(pg, 0.3);
    s = await state(pg);
    report(after.scene !== "none" && after.seq === "scroll" && s.d3 === "handed back" && s.canvas === "none", n, theme, "after it: the CSS entrance keeps moving; a later pageshow does not bring the 3D back", JSON.stringify({ ...s, ...after }));
    report(!errs.length, n, theme, "no page errors", errs.join(" | "));
    await c.close();
  }

  // ---------------------------------------------------------------- 2. the gate
  for (const [label, q, o, want, why, probes] of [
    ["default page, software renderer", "", {}, "refused", /^software renderer \(/, 1],
    ["?sem3d", "?sem3d", { spoof: { gpu: GPU } }, "refused", /^\?sem3d$/, 0],
    ["?semporta", "?semporta", { spoof: { gpu: GPU } }, "refused", /^\?semporta$/, 0],
    ["reduced motion", "", { reduce: true, spoof: { gpu: GPU } }, "refused", /^reduced motion$/, 0],
    ["reduced motion, ?3d=force", "?3d=force", { reduce: true }, "refused", /^reduced motion$/, 0],
    ["a data saver", "", { spoof: { gpu: GPU, conn: { saveData: true, effectiveType: "4g" } } }, "refused", /^data saver$/, 0],
    ["a 2G link", "", { spoof: { gpu: GPU, conn: { saveData: false, effectiveType: "2g" } } }, "refused", /^2G link/, 0],
    ["deviceMemory 1 GB", "", { spoof: { gpu: GPU, mem: 1 } }, "refused", /^weak device \(deviceMemory 1 GB\)$/, 0],
    ["2 cores", "", { spoof: { gpu: GPU, cores: 2 } }, "refused", /^weak device \(2 cores\)$/, 0],
    ["a weak GPU (Mali-T720)", "", { spoof: { gpu: "Mali-T720" } }, "refused", /^weak GPU \(Mali-T720\)$/, 1],
    ["?3d on a software renderer (the probe stays)", "?3d", {}, "refused", /^software renderer \(/, 1]]) {
    const { c, pg, reqs } = await ctx(o);
    await pg.goto(base + q, { waitUntil: "load" }); await pg.waitForTimeout(3000);
    await pg.evaluate(() => scrollTo(0, 300)); await pg.waitForTimeout(800);
    const st = await pg.evaluate(() => ({ canvas: !!document.querySelector(".porta__3d"), seq: document.documentElement.dataset.sequence, gl: window.__gl,
      d3: document.documentElement.__porta && document.documentElement.__porta.geo().d3, why: document.documentElement.__porta && document.documentElement.__porta.geo().d3why }));
    report(!reqs.length && !st.canvas && st.d3 === want && why.test(st.why || "") && st.gl === probes, label + ": the CSS entrance, nothing requested", JSON.stringify({ reqs: reqs.length, ...st }));
    if (label === "default page, software renderer") {
      /* remembered for the session: the next load of the tab neither probes nor asks */
      await pg.reload({ waitUntil: "load" }); await pg.waitForTimeout(2000);
      const s2 = await pg.evaluate(() => ({ gl: window.__gl, d3: document.documentElement.__porta.geo().d3, why: document.documentElement.__porta.geo().d3why }));
      report(s2.d3 === "refused" && /^earlier in this session: software renderer/.test(s2.why) && s2.gl === 0 && !reqs.length, "the refusal is remembered for the session (no probe on the next load)", JSON.stringify(s2));
    }
    await c.close();
  }
  {
    /* ?3d skips the soft heuristics: the weak GPU draws */
    const { c, pg, reqs } = await ctx({ spoof: { gpu: "Mali-T720", mem: 1 } });
    await pg.goto(base + "?3d", { waitUntil: "load" }); await settled(pg, 60000);
    await go(pg, 0.3);
    const s = await state(pg);
    report(s.d3 === "on" && s.canvas === "visible" && reqs.length >= 2 && /^\?3d \(testing\)/.test(s.why), "?3d on a weak GPU with 1 GB: the soft heuristics are skipped, the 3D draws", JSON.stringify(s));
    await c.close();
  }
  {
    /* a capable GPU: the 3D by default, fetched at the first idle moment after the first paint, before any scroll */
    const { c, pg, reqs, errs } = await ctx({ spoof: { gpu: GPU } });
    await pg.goto(base + "?guard=5000,9000", { waitUntil: "load" }); await settled(pg, 60000);
    const t = await pg.evaluate(() => ({ fcp: Math.round((performance.getEntriesByName("first-contentful-paint")[0] || { startTime: -1 }).startTime), load: Math.round(window.__loadAt), first: Math.round(Math.min(...window.__req3d)), y: scrollY, mem: sessionStorage.getItem("ab-3d") }));
    await go(pg, 0.3);
    const s = await state(pg);
    report(s.d3 === "on" && s.canvas === "visible" && /^passed the gate: ANGLE \(Apple/.test(s.why) && t.y === 0 && t.fcp > 0 && t.first > t.fcp && t.first - t.load < 2500 && /^1\|/.test(t.mem) && !errs.length,
      "a capable GPU: the 3D by default, requested after the first paint, before any scroll", JSON.stringify({ ...s, ...t, reqs: reqs.length }));
    await c.close();
  }

  // ---------------------------------------------------------------- 3. the live safeguard
  /* The guard watches the first second of 3D motion: each case starts that motion from rest, freshly mounted. A
     slow frame is injected while the driver's loop runs (the 8th frame of a scroll blocks: the frames of the take-over,
     the first, are not the 3D's own work and are not counted; until 10 Nov the 2nd was the one that blocked). The 3D
     frame the canvas showed at p 0.3 comes from a ?3d=force page left to settle (SwiftShader draws it identically
     each time; a frame read too soon after a scroll is one it has not presented yet). */
  const toP = (pg, p, inject) => pg.evaluate(([p, inject]) => { const g = document.documentElement.__porta.geo(); scrollTo(0, Math.round(g.pin + p * g.run)); if (inject) (new Function(inject))(); }, [p, inject || ""]);
  /* a 2.5 s stall in the k-th frame after the scroll (the first is the take-over: the canvas shown, the photograph's
     layers hidden; it and the next two intervals are not the 3D's own work and are not counted) */
  const stallAt = (k) => "let k = " + k + "; const f = () => { if (--k > 0) return requestAnimationFrame(f); window.__stall = document.documentElement.__porta.geo().d3guard; const t = performance.now(); while (performance.now() - t < 2500) {} }; requestAnimationFrame(f);";
  const SLOW = stallAt(8), TAKEOVER = stallAt(2);
  const nudge = async (pg, k) => { for (let i = 0; i < (k || 6); i++) { await pg.evaluate(() => scrollBy(0, 1)); await pg.waitForTimeout(40); } };
  const handing = (pg) => pg.waitForFunction(() => /hand/.test(document.documentElement.__porta.geo().d3), null, { timeout: 15000, polling: "raf" }).catch(() => {});
  const still3d = (pg, st) => pg.waitForFunction((st) => { const g = document.documentElement.__porta.geo(); return g.r === g.p && g.d3 === st; }, st, { timeout: 15000 }).catch(() => {});
  const diagText = (pg) => pg.evaluate(() => { const d = [...document.querySelectorAll("pre")].pop(); return d ? d.textContent : ""; });
  const memo2 = (pg) => pg.evaluate(() => [sessionStorage.getItem("ab-3d"), sessionStorage.getItem("ab-3d-slow")]);
  for (const [n, w, h, dpr, theme] of [["m390", 390, 844, 2, "dia"], ["d1440", 1440, 900, 1, "noite"]]) {
    let A, rA;
    { const o = await ctx({ w, h, dpr, theme }); await o.pg.goto(base + "?3d=force", { waitUntil: "load" }); await onAt(o.pg); await go(o.pg, 0.3); await o.pg.waitForTimeout(1500);
      A = await shot(o.pg); rA = (await state(o.pg)).r; await o.c.close(); }
    /* a frame over the limit: dissolves into the CSS entrance at the same progress, counted for the session (1/2), said
       in ?diag; the next load of the tab draws the 3D again (no new probe); a second slow hand-back refuses it for the
       session (before, one slow frame refused it for the tab's session) */
    const { c, pg, reqs, errs } = await ctx({ w, h, dpr, theme, spoof: { gpu: GPU } });
    /* draws while the 3D hands back: none (its last frame is frozen and dissolves) */
    await pg.addInitScript(() => { window.__hb = 0; const P = WebGL2RenderingContext.prototype;
      for (const k of ["drawArrays", "drawElements"]) { const o = P[k]; P[k] = function () { const r = document.documentElement.__porta; if (r && r.geo().d3 === "handing back") window.__hb++; return o.apply(this, arguments); }; } });
    await pg.goto(base + "?guard=100000,1500&diag", { waitUntil: "load" }); await settled(pg, 60000);
    await pg.waitForTimeout(600);
    const g0 = (await geo(pg)).d3guard, gl1 = await pg.evaluate(() => window.__gl);
    await toP(pg, 0.3, SLOW);
    await handing(pg);
    const mid = await pg.evaluate(() => { const c = document.querySelector(".porta__3d"), g = document.documentElement.__porta.geo();
      return { d3: g.d3, canvas: !!c, opacity: c ? c.style.opacity : null, transition: c ? c.style.transition : null, scene: getComputedStyle(document.querySelector(".scene")).visibility }; });
    await still3d(pg, "handed back");
    await pg.waitForTimeout(600);
    const hb = await pg.evaluate(() => window.__hb);
    report(hb === 0, n, theme, "handing back: the slow 3D is not drawn again (draw calls while handing back: " + hb + ")");
    /* ?diag's own overlay is read, then hidden for the frame */
    const memo = await memo2(pg), diag = await diagText(pg);
    await pg.evaluate(() => { const d = [...document.querySelectorAll("pre")].pop(); if (d) d.style.visibility = "hidden"; });
    await pg.waitForTimeout(100);
    const B = await shot(pg);
    let s = await state(pg);
    const jump = mean(A, B);
    report(g0 && g0.n === 0 && /^a frame of \d+ ms \(limit 1500\)$/.test(s.why) && s.d3 === "handed back" && s.canvas === "none" && s.scene === "visible" && Math.abs(s.r - rA) < 0.002 && jump < 6
      && mid.d3 === "handing back" && mid.opacity === "0" && /opacity 0\.18s|opacity 180ms/.test(mid.transition) && mid.scene === "visible",
      n, theme, "a 2.5 s frame in the first second: the 3D dissolves into the CSS entrance, the same progress (mean |dRGB| at p 0.3 " + jump.toFixed(2) + ")", JSON.stringify({ ...s, rA, g0, mid }));
    report(/^1\|ANGLE \(Apple/.test(memo[0] || "") && memo[1] === "1" && /path=CSS 3d=handed back why=a frame of \d+ ms \(limit 1500\) slow hand-backs 1\/2/.test(diag), n, theme,
      "one slow hand-back: counted for the session (1/2), not refused; ?diag says why and «slow hand-backs 1/2»", JSON.stringify({ memo, diag: diag.split("\n").filter((l) => /path=/.test(l)) }));
    /* the next load of the tab (from the top): the 3D again, without a new probe; ?diag shows 1/2 */
    await go(pg, 0);
    await pg.reload({ waitUntil: "load" }); await settled(pg, 60000);
    await pg.waitForTimeout(700);
    s = await state(pg);
    const gl2 = await pg.evaluate(() => window.__gl), diag2 = await diagText(pg);
    report(s.d3 === "on" && /^passed the gate: ANGLE \(Apple/.test(s.why) && gl2 === gl1 - 1 && /path=CSS 3d=on why=passed the gate: .* slow hand-backs 1\/2/.test(diag2) && !errs.length, n, theme,
      "the next load of the tab after one slow hand-back: the 3D again (on), no new probe, ?diag «slow hand-backs 1/2»", JSON.stringify({ ...s, gl: [gl1, gl2], diag: diag2.split("\n").filter((l) => /path=/.test(l)) }));
    /* a second slow hand-back: the CSS entrance for this view and refused for the session, with the reason */
    const g1 = (await geo(pg)).d3guard;
    await toP(pg, 0.3, SLOW);
    await handing(pg);
    await still3d(pg, "handed back");
    await pg.waitForTimeout(600);
    const memoB = await memo2(pg), diagB = await diagText(pg);
    s = await state(pg);
    report(g1 && g1.n === 0 && s.d3 === "handed back" && /^a frame of \d+ ms \(limit 1500\)$/.test(s.why) && s.scene === "visible" && /^0\|slow hand-back 2\/2: a frame of \d+ ms \(limit 1500\)$/.test(memoB[0] || "") && memoB[1] === "2"
      && /path=CSS 3d=handed back why=a frame of .* slow hand-backs 2\/2/.test(diagB), n, theme, "a second slow hand-back in the session: handed back, refused for the session, «slow hand-backs 2/2»",
      JSON.stringify({ d3: s.d3, why: s.why, memo: memoB, diag: diagB.split("\n").filter((l) => /path=/.test(l)) }));
    const before = reqs.length;
    await go(pg, 0);
    await pg.reload({ waitUntil: "load" }); await pg.waitForTimeout(2500);
    s = await pg.evaluate(() => ({ d3: document.documentElement.__porta.geo().d3, why: document.documentElement.__porta.geo().d3why, gl: window.__gl }));
    report(s.d3 === "refused" && /^earlier in this session: slow hand-back 2\/2: a frame of \d+ ms \(limit 1500\)$/.test(s.why) && s.gl === 0 && reqs.length === before && !errs.length, n, theme,
      "the load after the second: the CSS entrance, refused with the reason, nothing probed or requested", JSON.stringify({ ...s, reqs: reqs.length - before }));
    await c.close();
  }
  {
    /* Not the 3D's own work, not counted (?guard=100000,1500), each on a fresh mount (a fresh guard): a 2.5 s stall in
       the frames of a take-over (the frame after the one in which the canvas was first shown: on an iPhone, the first
       frame of the first scroll, as Safari's toolbar starts to go), in the frame of a resize (a mobile toolbar, a
       rotation: a listener after the page's own, in the frame's resize steps), and in the frame of a theme change (the
       canvas cannot draw the new theme until its textures are in, then takes over again). The guard is still counting
       when it stalls (not done); the 3D stays, nothing is counted for the session */
    const { c, pg, errs } = await ctx({ spoof: { gpu: GPU } });
    await pg.goto(base + "?guard=100000,1500", { waitUntil: "load" });
    const run = (ms) => pg.evaluate((ms) => { const t0 = performance.now(), id = setInterval(() => { scrollBy(0, 1); if (performance.now() - t0 > ms) clearInterval(id); }, 30); }, ms);
    const STALL = "window.__stall = document.documentElement.__porta.geo().d3guard; const t = performance.now(); while (performance.now() - t < 2500) {}";
    const rows = [];
    for (const kind of ["take-over", "resize", "theme"]) {
      if (kind !== "take-over") { await go(pg, 0); await pg.reload({ waitUntil: "load" }); }
      await settled(pg, 60000); await pg.waitForTimeout(600);
      if (kind === "take-over") await toP(pg, 0.3, TAKEOVER);
      else {
        await toP(pg, 0.25); await run(1200); await pg.waitForTimeout(350);
        if (kind === "resize") {
          await pg.evaluate((st) => window.addEventListener("resize", () => (new Function(st))(), { once: true }), STALL);
          await pg.setViewportSize({ width: 390, height: 800 });
        } else await pg.evaluate((st) => requestAnimationFrame(() => { document.documentElement.setAttribute("data-theme", "noite"); (new Function(st))(); }), STALL);
      }
      await pg.waitForTimeout(3500); await still3d(pg, "on");
      if (kind === "theme") {       /* the new theme's textures in: the canvas takes over again */
        await pg.waitForFunction(() => document.documentElement.__porta.geo().d3ok, null, { timeout: 30000 }).catch(() => {});
        await go(pg, 0); await go(pg, 0.3);
      }
      const s = await state(pg), at = await pg.evaluate(() => window.__stall || null), g = (await geo(pg)).d3guard;
      rows.push({ kind, d3: s.d3, canvas: s.canvas, why: s.why, atStall: at && { n: at.n, ms: at.ms, done: at.done }, worst: g && g.worst, off: g && g.off });
    }
    const memo = await memo2(pg);
    report(rows.every((x) => x.d3 === "on" && x.atStall && !x.atStall.done && x.worst < 1500 && x.off >= 2) && rows[2].canvas === "visible" && memo[1] === null && /^1\|/.test(memo[0] || "") && !errs.length,
      "a 2.5 s stall in a take-over's frames, in a resize's frame, in a theme change's frame (the guard counting): not counted, the 3D stays (and takes over again in the new theme), nothing counted for the session", JSON.stringify({ rows, memo }));
    await c.close();
  }
  {
    /* a slow median: 50 ms of work in every frame through the first second of motion */
    const { c, pg } = await ctx({ spoof: { gpu: GPU } });
    await pg.goto(base + "?guard=25,100000", { waitUntil: "load" }); await settled(pg, 60000);
    await pg.waitForTimeout(600);
    await pg.evaluate(() => { const t0 = performance.now(); (function f() { const t = performance.now(); while (performance.now() - t < 50) {} if (performance.now() - t0 < 3000) requestAnimationFrame(f); })(); });
    for (let i = 0; i < 40; i++) { await pg.evaluate(() => scrollBy(0, 4)); await pg.waitForTimeout(30); }
    await pg.waitForTimeout(1500);
    const s = await state(pg), g = await geo(pg), memo = await memo2(pg);
    report(s.d3 === "handed back" && /^median frame \d+\.\d ms \(limit 25\)$/.test(s.why) && s.canvas === "none" && s.scene === "visible" && /^1\|/.test(memo[0] || "") && memo[1] === "1",
      "a slow median (50 ms of work a frame): handed back to the CSS entrance, counted for the session (1/2), not refused", JSON.stringify({ ...s, guard: g.d3guard, memo }));
    await c.close();
  }
  {
    /* an exception in a draw: handed back at once, at the same progress, and refused for the session at once (the device
       cannot draw it: not counted as a slow hand-back) */
    const { c, pg, reqs } = await ctx({ spoof: { gpu: GPU } });
    await pg.goto(base + "?guard=100000,100000", { waitUntil: "load" }); await settled(pg, 60000);
    await go(pg, 0); await go(pg, 0.3);
    const r0 = (await state(pg)).r;
    await pg.evaluate(() => { const P = WebGL2RenderingContext.prototype; for (const k of ["drawArrays", "drawElements"]) { const o = P[k]; P[k] = function () { if (window.__boom) throw new Error("boom"); return o.apply(this, arguments); }; } window.__boom = true; });
    await nudge(pg, 3);
    await pg.waitForTimeout(400);
    const s = await state(pg), memo = await memo2(pg), n1 = reqs.length;
    report(s.d3 === "handed back" && /^exception: boom$/.test(s.why) && s.canvas === "none" && s.scene === "visible" && Math.abs(s.r - r0) < 0.01, "an exception in a draw: handed back at once, at the same progress", JSON.stringify({ ...s, r0 }));
    await go(pg, 0);
    await pg.reload({ waitUntil: "load" }); await pg.waitForTimeout(2500);
    const s2 = await state(pg);
    report(/^0\|exception: boom$/.test(memo[0] || "") && memo[1] === null && s2.d3 === "refused" && /^earlier in this session: exception: boom$/.test(s2.why) && reqs.length === n1,
      "an exception: refused for the session at once (no slow count); the next load asks for nothing", JSON.stringify({ memo, next: [s2.d3, s2.why], requestedAfter: reqs.length - n1 }));
    await c.close();
  }
  {
    /* The session memory (10 Nov), one tab: what the build before 10 Nov wrote for one slow frame is read as one
       slow hand-back (the probe asked again, the 3D on); a clean first second of 3D motion clears the count; the next
       load's slow hand-back is then 1/2, not refused; a context lost during its dissolve with the page hidden (taken
       for a loss in the background, as on iOS) ends the hand-back and rebuilds nothing in that page view; the load
       after it draws the 3D again */
    const { c, pg, errs } = await ctx({ spoof: { gpu: GPU } });
    const MQ = "?guard=100000,1500&diag";
    await pg.goto(base + "?sem3d", { waitUntil: "load" });
    await pg.evaluate(() => sessionStorage.setItem("ab-3d", "0|a frame of 142 ms (limit 120)"));
    await pg.goto(base + MQ, { waitUntil: "load" }); await settled(pg, 60000);
    await pg.waitForTimeout(700);
    let s = await state(pg), m = await memo2(pg);
    const gl0 = await pg.evaluate(() => window.__gl), d0 = await diagText(pg);
    report(s.d3 === "on" && /^passed the gate: ANGLE \(Apple/.test(s.why) && gl0 === 2 && /^1\|ANGLE \(Apple/.test(m[0] || "") && m[1] === "1" && /slow hand-backs 1\/2/.test(d0), "the old build's memo for one slow frame («0|a frame of 142 ms (limit 120)»): one slow hand-back (1/2), probed again, the 3D on",
      JSON.stringify({ d3: s.d3, why: s.why, gl: gl0, memo: m }));
    /* a clean first second: scrolled to and fro between p 0.2 and 0.4 until the guard is done */
    await toP(pg, 0.25);
    await pg.evaluate(() => { const g = document.documentElement.__porta.geo(), lo = g.pin + 0.2 * g.run, hi = g.pin + 0.4 * g.run, t0 = performance.now(); let dir = 1;
      const id = setInterval(() => { const q = document.documentElement.__porta.geo().d3guard; if ((q && q.done) || performance.now() - t0 > 10000) return clearInterval(id);
        if (scrollY > hi) dir = -1; else if (scrollY < lo) dir = 1; scrollBy(0, 4 * dir); }, 20); });
    await pg.waitForFunction(() => { const q = document.documentElement.__porta.geo().d3guard; return q && q.done; }, null, { timeout: 15000 }).catch(() => {});
    await pg.waitForTimeout(400);
    s = await state(pg); m = await memo2(pg);
    const gq = (await geo(pg)).d3guard;
    report(s.d3 === "on" && gq && gq.done && gq.ms >= 1000 && /^1\|/.test(m[0] || "") && m[1] === null, "a clean first second of 3D motion: the slow count cleared", JSON.stringify({ d3: s.d3, guard: gq, memo: m }));
    /* the next load: slow (8th frame); as soon as it is handing back, the page hidden, the context lost, the page shown
       again 300 ms later */
    await go(pg, 0);
    await pg.reload({ waitUntil: "load" }); await settled(pg, 60000);
    await pg.waitForTimeout(600);
    await pg.evaluate(() => {
      const hide = (h) => { Object.defineProperty(document, "hidden", { configurable: true, get: () => h });
        Object.defineProperty(document, "visibilityState", { configurable: true, get: () => (h ? "hidden" : "visible") }); document.dispatchEvent(new Event("visibilitychange")); };
      const f = () => { const g = document.documentElement.__porta.geo(); if (g.d3 !== "handing back") return requestAnimationFrame(f);
        hide(true); document.querySelector(".porta__3d").getContext("webgl2").getExtension("WEBGL_lose_context").loseContext();
        window.__lostGl = window.__gl; window.__lostIn = g.d3; setTimeout(() => hide(false), 300); };
      requestAnimationFrame(f); });
    await toP(pg, 0.3, SLOW);
    await pg.waitForFunction(() => window.__lostIn, null, { timeout: 15000 }).catch(() => {});
    await pg.waitForTimeout(5000);
    s = await state(pg); m = await memo2(pg);
    const lo = await pg.evaluate(() => ({ lostIn: window.__lostIn || null, gl: [window.__lostGl, window.__gl], tries: document.documentElement.__porta.geo().d3try }));
    report(lo.lostIn === "handing back" && s.d3 === "handed back" && /^a frame of \d+ ms \(limit 1500\)$/.test(s.why) && s.canvas === "none" && s.scene === "visible" && lo.gl[0] === lo.gl[1] && lo.tries === 0
      && /^1\|ANGLE \(Apple/.test(m[0] || "") && m[1] === "1", "slow, clean, slow: 1/2, not refused; a context lost during the dissolve (page hidden): handed back 5 s later, nothing rebuilt (no new WebGL context)",
      JSON.stringify({ ...s, ...lo, memo: m }));
    await go(pg, 0);
    await pg.reload({ waitUntil: "load" }); await settled(pg, 60000);
    s = await state(pg);
    report(s.d3 === "on" && !errs.length, "the load after it: the 3D again", JSON.stringify({ d3: s.d3, why: s.why, errs }));
    await c.close();
  }
  {
    /* a tab switch in the first second: the frame after it is not counted; then a page restored from the back/forward
       cache with its context keeps it */
    const { c, pg } = await ctx({ spoof: { gpu: GPU } });
    await pg.goto(base + "?guard=100000,1500", { waitUntil: "load" }); await settled(pg, 60000);
    await pg.waitForTimeout(600);
    /* hidden in a frame of the loop; 2.5 s away with no frame (a task), then shown: the next frame comes 2.5 s later */
    await toP(pg, 0.3, "requestAnimationFrame(() => requestAnimationFrame(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange'));"
      + " setTimeout(() => { const t = performance.now(); while (performance.now() - t < 2500) {} Object.defineProperty(document, 'hidden', { configurable: true, get: () => false }); document.dispatchEvent(new Event('visibilitychange')); }, 0); }));");
    await pg.waitForTimeout(3500);
    await still3d(pg, "on");
    let s = await state(pg);
    const gq = (await geo(pg)).d3guard;
    report(s.d3 === "on" && s.canvas === "visible" && gq && gq.n > 0 && gq.worst < 1500, "a tab switch (2.5 s away) in the first second: the frame after it is not counted, the 3D stays", JSON.stringify({ ...s, guard: gq }));
    const el0 = await pg.evaluate(() => { window.__c0 = document.querySelector(".porta__3d"); return true; });
    await go(pg, 0);
    await pg.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pageshow", { persisted: true })));
    await pg.waitForTimeout(800);
    await go(pg, 0.3);
    s = await state(pg);
    const same = await pg.evaluate(() => window.__c0 === document.querySelector(".porta__3d")), tries = (await geo(pg)).d3try;
    report(el0 && s.d3 === "on" && s.canvas === "visible" && same && tries === 0, "a page restored from the back/forward cache with its context: the same 3D, no rebuild", JSON.stringify({ ...s, same, tries }));
    await c.close();
  }
  {
    /* ?diag on the default page in headless: the CSS path and why */
    const { c, pg } = await ctx({});
    await pg.goto(base + "?diag", { waitUntil: "load" }); await pg.waitForTimeout(2500);
    const d = await pg.evaluate(() => { const p = [...document.querySelectorAll("pre")].pop(); return p ? p.textContent : ""; });
    report(/path=CSS 3d=refused why=software renderer \(/.test(d), "?diag on a software renderer: path=CSS, refused, why", JSON.stringify(d.split("\n").filter((l) => /path=/.test(l))));
    await c.close();
  }
  {
    const { c, pg } = await ctx({ spoof: { gpu: GPU } });
    await pg.goto(base + "?guard=5000,9000&diag", { waitUntil: "load" }); await settled(pg, 60000);
    await go(pg, 0); await go(pg, 0.3); await nudge(pg, 4); await pg.waitForTimeout(700);
    const d = await pg.evaluate(() => { const p = [...document.querySelectorAll("pre")].pop(); return p ? p.textContent : ""; });
    report(/path=3D 3d=on why=passed the gate: ANGLE \(Apple/.test(d) && /guard=on frames=\d+/.test(d), "?diag on a capable GPU: path=3D, on, why, the guard's numbers", JSON.stringify(d.split("\n").filter((l) => /path=|guard=/.test(l))));
    await c.close();
  }

  // ---------------------------------------------------------------- 4. iOS and Android: the device's ratio, up to 3
  for (const [label, ua, want] of [["iPhone (iOS Safari)", "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1", 3], ["Android Chrome", undefined, 3]]) {
    const { c, pg } = await ctx({ dpr: 3, ua, spoof: { gpu: ua ? "Apple GPU" : GPU } });
    await pg.goto(base + "?guard=5000,9000", { waitUntil: "load" }); await settled(pg, 60000);
    await go(pg, 0); await go(pg, 0.3);
    const s = await pg.evaluate(() => { const c = document.querySelector(".porta__3d"), g = document.documentElement.__porta.geo(); return { d3: g.d3, dpr: g.d3dpr, width: c && c.width, aa: c && c.getContext("webgl2").getContextAttributes().antialias }; });
    report(s.d3 === "on" && s.dpr === want && s.width === 390 * want && s.aa === (want <= 2), label + " at DPR 3: the canvas at a ratio of " + want + (want <= 2 ? ", with MSAA" : ", no MSAA"), JSON.stringify(s));
    await c.close();
  }

  // ---------------------------------------------------------------- 5. the take-over frame and the camera
  const L = (p) => 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2];
  const energy = (im, bx) => { let e = 0, k = 0;
    for (let y = bx[1]; y < bx[3] - 1; y++) for (let x = bx[0]; x < bx[2] - 1; x++) { const a = L(im.px(x, y)); e += Math.abs(a - L(im.px(x + 1, y))) + Math.abs(a - L(im.px(x, y + 1))); k++; } return e / k; };
  for (const [w, h, dpr] of [[390, 844, 3], [1440, 900, 1]]) {
    const r = {}, im = {};
    let box;
    for (const q of ["", "?3d=force"]) {
      const { c, pg } = await ctx({ w, h, dpr });
      await pg.goto(base + q, { waitUntil: "load" });
      if (q) await onAt(pg); else await pg.waitForTimeout(3500);
      await pg.waitForTimeout(800);
      await pg.evaluate(() => scrollTo(0, 1)); await pg.waitForTimeout(900);
      box = await pg.evaluate(() => { const r = document.querySelector(".ph--facade").getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom]; });
      im[q] = await shot(pg);
      const bx = [0.25, 0.3, 0.75, 0.9].map((f, i) => Math.round((box[i & 1] + f * (box[(i & 1) + 2] - box[i & 1])) * dpr));
      r[q] = energy(im[q], bx);
      if (q) r.shown = (await geo(pg)).d3shown;
      await c.close();
    }
    const k = r["?3d=force"] / r[""], d = mean(im[""], im["?3d=force"]);
    report(r.shown && k >= 0.95 && k <= 1.3 && d < 2, w + "@" + dpr, "take-over frame: as sharp as the photograph (3D / CSS gradient energy " + k.toFixed(2) + ") and equal to it (mean |dRGB| " + d.toFixed(2) + ")", JSON.stringify(r));
  }
  for (const [w, h, dpr, theme] of [[390, 844, 2, "dia"], [1440, 900, 1, "noite"]]) {
    const pages = {};
    for (const q of ["?sem3d", "?3d=force"]) { const o = await ctx({ w, h, dpr, theme }); await o.pg.goto(base + q, { waitUntil: "load" }); if (q !== "?sem3d") await onAt(o.pg); await o.pg.waitForTimeout(1200); pages[q] = o; }
    for (const p of [0.15, 0.3]) {
      const im = {}, I = {};
      for (const q of Object.keys(pages)) {
        const pg = pages[q].pg;
        await go(pg, p); await pg.waitForTimeout(700);
        im[q] = await shot(pg);
        I[q] = await pg.evaluate(() => { const G = JSON.parse(document.querySelector(".scene").getAttribute("data-geo")), r = document.querySelector(".ph--facade").getBoundingClientRect(), it = document.querySelector(".intro").getBoundingClientRect();
          return { box: [r.left, r.top, r.width, r.height], door: G.door, intro: [it.left, it.top, it.right, it.bottom], op: +getComputedStyle(document.querySelector(".intro")).opacity, shown: document.documentElement.__porta.geo().d3shown }; });
      }
      const A = im["?sem3d"], B = im["?3d=force"], i0 = I["?sem3d"], [bx, by, bw, bh] = i0.box.map((v) => v * dpr), d = i0.door, gx = 0.04 * bw;
      const dr = [bx + d[0] * bw - gx, by + d[1] * bh - gx, bx + d[2] * bw + gx, by + d[3] * bh + gx], ir = i0.op > 0.02 ? i0.intro.map((v) => v * dpr) : [0, 0, -1, -1];
      const pts = [];
      for (let y = 8; y < A.h - 8; y += 3) for (let x = 8; x < A.w - 8; x += 3)
        if (x >= bx && x < bx + bw && y >= by && y < by + bh && !(x >= dr[0] && x < dr[2] && y >= dr[1] && y < dr[3]) && !(x >= ir[0] - 8 && x < ir[2] + 8 && y >= ir[1] - 8 && y < ir[3] + 8)) pts.push([x, y]);
      const at = (dx, dy) => { let s = 0; for (const [x, y] of pts) s += Math.abs(L(A.px(x, y)) - L(B.px(x + dx, y + dy))); return s / pts.length; };
      let best = [0, 0, at(0, 0)];
      for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) { const v = at(dx, dy); if (v < best[2] - 1e-9) best = [dx, dy, v]; }
      report(I["?3d=force"].shown && pts.length > 5000 && best[0] === 0 && best[1] === 0 && best[2] < 2, w + " " + theme + " p=" + p,
        "the door's plane follows the CSS camera: the facade aligns at (0, 0) and differs by a mean of " + best[2].toFixed(2), JSON.stringify({ pts: pts.length, best }));
    }
    for (const q of Object.keys(pages)) await pages[q].c.close();
  }

  // ---------------------------------------------------------------- 6. a gesture before the module is in (4x CPU throttle): no long task
  for (const [w, h, dpr] of [[1440, 900, 1], [390, 844, 3]]) for (let attempt = 1; attempt <= 2; attempt++) {
    const mobile = w < 900, c = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, isMobile: mobile, hasTouch: mobile });
    await c.addInitScript(() => { try { localStorage.setItem("ab-tema", "dia"); } catch (e) {} window.__lt = [];
      try { new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lt.push([e.startTime, e.duration]); }).observe({ type: "longtask", buffered: true }); } catch (e) {} });
    const pg = await c.newPage(); await serve.offline(pg);
    const cdp = await c.newCDPSession(pg);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await pg.goto(base + "?3d=force", { waitUntil: "load" });
    await pg.waitForTimeout(300);
    const g = await geo(pg), t0 = await pg.evaluate(() => performance.now());
    if (mobile) {
      for (let k = 0; k < 3; k++) {
        await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 200, y: 700 }] });
        for (let i = 1; i <= 17; i++) { await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 200, y: 700 - 18 * i }] }); await pg.waitForTimeout(16); }
        await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      }
    } else { await pg.mouse.move(w / 2, h / 2); for (let y = 0; y < g.run * 0.8; y += 40) { await pg.mouse.wheel(0, 40); await pg.waitForTimeout(16); } }
    const t1 = await pg.evaluate(() => performance.now());
    await pg.waitForTimeout(300);
    const d = await pg.evaluate(([t0, t1]) => ({ lt: window.__lt.filter((x) => x[0] + x[1] >= t0 && x[0] <= t1).map((x) => Math.round(x[0] - t0) + "+" + Math.round(x[1])), d3: document.documentElement.__porta.geo().d3 }), [t0, t1]);
    const clean = !d.lt.filter((x) => +x.split("+")[1] > 50).length;
    await c.close();
    if (!clean && attempt === 1) { console.log("RETRY", w + "@" + dpr, "a long task in the first attempt (timing gate):", JSON.stringify(d)); continue; }
    report(clean, w + "@" + dpr, "a gesture 300 ms after load (4x throttle): no long task over 50 ms" + (attempt > 1 ? " (second attempt)" : ""), JSON.stringify(d));
    break;
  }
  // ---------------------------------------------------------------- 6b. a gesture that lands IN the mount (4x CPU throttle)
  /* before the door finish the mount used to run as tasks of 50-234 ms (the module and the context in one, the facade's
     upload in one), so a finger that landed in one waited for all of it. A touch drag that starts the moment the module
     is asked for, and one that starts at the facade's first band, on the default path (a capable GPU spoofed): no input
     waits more than 50 ms (event timing: processingStart - startTime). A timing gate on a busy machine: it fails only
     if a second attempt, in a fresh context, fails too. */
  for (const trig of ["module", "upload"]) for (let attempt = 1; attempt <= 2; attempt++) {
    const c = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
    await c.addInitScript((t) => { try { localStorage.setItem("ab-tema", t); } catch (e) {} }, "dia");
    await c.addInitScript(spoof({ gpu: GPU }));
    await c.addInitScript((T) => { window.__ev = []; window.__trig = 0;
      new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__ev.push([e.name, e.startTime, e.processingStart - e.startTime]); }).observe({ type: "event", durationThreshold: 16, buffered: true });
      const fire = () => { if (!window.__trig) { window.__trig = performance.now(); console.log("TRIGGER"); } };
      if (T === "module") new MutationObserver((ms) => { for (const m of ms) for (const n of m.addedNodes) if (n.tagName === "SCRIPT" && n.type === "module") fire(); }).observe(document, { childList: true, subtree: true });
      else { const P = WebGL2RenderingContext.prototype, o = P.texSubImage2D; P.texSubImage2D = function () { const a = arguments[arguments.length - 1]; if (a && a.width > 2000) fire(); return o.apply(this, arguments); }; } }, trig);
    const pg = await c.newPage(); await serve.offline(pg);
    const cdp = await c.newCDPSession(pg);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    let fired = false;
    pg.on("console", (m) => { if (m.text() === "TRIGGER" && !fired) { fired = true; (async () => {
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 200, y: 700 }] });
      for (let i = 1; i <= 17; i++) await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 200, y: 700 - 18 * i }] });
      await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] }); })().catch(() => {}); } });
    await pg.goto(base + "?guard=5000,9000", { waitUntil: "load" });
    await pg.waitForFunction(() => window.__trig > 0, null, { timeout: 60000 }).catch(() => {});
    await pg.waitForTimeout(2500);
    const d = await pg.evaluate(() => ({ trig: Math.round(window.__trig), ev: window.__ev.filter((e) => e[1] >= window.__trig - 5 && /touch|pointer/.test(e[0])).map((e) => e[0] + "@" + Math.round(e[1] - window.__trig) + " waited " + Math.round(e[2])),
      worst: Math.round(Math.max(0, ...window.__ev.filter((e) => e[1] >= window.__trig - 5 && /touch|pointer/.test(e[0])).map((e) => e[2]))), y: scrollY }));
    await c.close();
    const ok = fired && d.y > 50 && d.worst <= 50;
    if (!ok && attempt === 1) { console.log("RETRY", trig, "an input waited in the first attempt (timing gate):", JSON.stringify(d)); continue; }
    report(ok, "390@3", "a touch drag that starts " + (trig === "module" ? "as the module is asked for" : "at the facade's first band") + " (4x throttle): no input waits over 50 ms" + (attempt > 1 ? " (second attempt)" : ""), JSON.stringify({ ...d, ev: d.ev.slice(0, 4) }));
    break;
  }

  // ---------------------------------------------------------------- 7. the door finish
  /* the open leaves keep their width against the doorway once the doors are open (the doors do not grow as the
     camera enters): the camera stays put from p 0.34 (the lens alone), the hall's camera keeps
     walking in. Read from the 3D frame itself (the leaves' meshes and the doorway, projected by the frame's camera). */
  for (const [w, h, dpr] of [[390, 844, 2], [1440, 900, 1]]) {
    const { c, pg } = await ctx({ w, h, dpr });
    await pg.goto(base + "?3d=force", { waitUntil: "load" }); await onAt(pg);
    const rows = [];
    for (const p of [0.34, 0.45, 0.54, 0.62]) {
      await go(pg, p); await pg.waitForTimeout(200);
      const q = await pg.evaluate(() => document.documentElement.__porta.d3probe());
      if (!q) { rows.push(null); continue; }
      const dw = q.door[1] - q.door[0];
      rows.push({ p, l: +((q.leafL[1] - q.leafL[0]) / dw).toFixed(4), r: +((q.leafR[1] - q.leafR[0]) / dw).toFixed(4), cam: q.cam });
    }
    const ok = rows.every(Boolean) && Math.max(...rows.map((x) => x.l)) / Math.min(...rows.map((x) => x.l)) < 1.01 && Math.max(...rows.map((x) => x.r)) / Math.min(...rows.map((x) => x.r)) < 1.01
      && rows.every((x) => x.cam[0] === rows[0].cam[0]) && rows.every((x, i) => !i || x.cam[1] < rows[i - 1].cam[1]);
    report(ok, w + "x" + h, "the open leaves' width against the doorway is flat from p 0.34 to 0.62 (within 1%); the camera still, the hall's camera walking in", JSON.stringify(rows));
    await c.close();
  }
  /* a shader that does not compile on the device's driver (injected: the leaves' wood and brass, the programs with
     uMean): refused at the mount, nothing drawn, the CSS entrance, remembered for the session; with ?3d=force too */
  const BREAK = `(() => { const P = WebGL2RenderingContext.prototype, s0 = P.shaderSource;
    P.shaderSource = function (sh, src) { if (src.indexOf("uMean") >= 0 && /gl_FragColor|pc_fragColor|out highp vec4/.test(src)) src = src.replace("void main()", "void main() { undefined_fn_x(); }\\nvoid main2()"); return s0.call(this, sh, src); }; })();`;
  for (const [label, q, sp] of [["the default path", "?guard=5000,9000", { gpu: GPU }], ["?3d=force", "?3d=force", {}]]) {
    const { c, pg, errs } = await ctx({ spoof: sp });
    await pg.addInitScript(BREAK);
    await pg.goto(base + q, { waitUntil: "load" }); await settled(pg, 60000);
    await go(pg, 0.3);
    const s = await state(pg), memo = await pg.evaluate(() => sessionStorage.getItem("ab-3d"));
    report(s.d3 === "refused" && /^mount: compile: shader: /.test(s.why) && s.canvas === "none" && s.scene === "visible" && (q !== "?3d=force" ? /^0\|mount: compile: shader/.test(memo || "") : true) && !errs.length,
      label + ": a shader that does not compile: refused at the mount, the CSS entrance, nothing drawn" + (q !== "?3d=force" ? ", remembered" : ""), JSON.stringify({ ...s, memo }));
    await c.close();
  }
  /* a draw that throws in the frames drawn ahead (the mount's last stage): refused and remembered, named by its stage;
     the next load asks for nothing. The module fetched but not running (a syntax error): the same, never «loading» */
  {
    const { c, pg, reqs } = await ctx({ spoof: { gpu: GPU } });
    await pg.addInitScript(() => { const P = WebGL2RenderingContext.prototype; for (const k of ["drawArrays", "drawElements"]) P[k] = function () { throw new Error("driver fault"); }; });
    await pg.goto(base, { waitUntil: "load" }); await settled(pg, 60000);
    const s1 = await state(pg), m1 = await pg.evaluate(() => sessionStorage.getItem("ab-3d")), n1 = reqs.length;
    await pg.reload({ waitUntil: "load" }); await pg.waitForTimeout(2500);
    const s2 = await state(pg);
    report(s1.d3 === "refused" && /^mount: warm: driver fault$/.test(s1.why) && /^0\|mount: warm: driver fault$/.test(m1 || "") && s2.d3 === "refused" && /^earlier in this session: mount: warm/.test(s2.why) && reqs.length === n1,
      "a draw that throws while the mount warms up: refused, named by its stage, remembered; the next load asks for nothing", JSON.stringify({ s1: [s1.d3, s1.why], m1, s2: [s2.d3, s2.why], requestedAfter: reqs.length - n1 }));
    await c.close();
  }
  {
    const { c, pg, reqs } = await ctx({ spoof: { gpu: GPU } });
    await pg.route(/door3d\.js/, async (rt) => { const r = await rt.fetch(); const body = await r.text(); await rt.fulfill({ response: r, body: "let let = 1;\n" + body }); });
    await pg.goto(base, { waitUntil: "load" }); await settled(pg, 20000);
    const s1 = await state(pg), m1 = await pg.evaluate(() => sessionStorage.getItem("ab-3d")), n1 = reqs.length;
    await pg.reload({ waitUntil: "load" }); await pg.waitForTimeout(2500);
    const s2 = await state(pg);
    report(s1.d3 === "refused" && /^module: /.test(s1.why) && /^0\|module: /.test(m1 || "") && s2.d3 === "refused" && /^earlier in this session: module: /.test(s2.why) && reqs.length === n1,
      "the module fetched but not running (a syntax error): refused, remembered, never left «loading»; the next load asks for nothing", JSON.stringify({ s1: [s1.d3, s1.why], m1, s2: [s2.d3, s2.why] }));
    await c.close();
  }
  /* a hand-back lets the context go (WEBGL_lose_context), not at the next garbage collection: once the GPU has done
     what was queued and the page is still (lost at once, it froze the page for 6-11 s, see section 8) */
  {
    const { c, pg } = await ctx({ spoof: { gpu: GPU } });
    await pg.goto(base + "?guard=100000,100000", { waitUntil: "load" }); await settled(pg, 60000);
    await go(pg, 0); await go(pg, 0.3);
    await pg.evaluate(() => { window.__gl2 = document.querySelector(".porta__3d").getContext("webgl2");
      const P = WebGL2RenderingContext.prototype; for (const k of ["drawArrays", "drawElements"]) { const o = P[k]; P[k] = function () { if (window.__boom) throw new Error("boom"); return o.apply(this, arguments); }; } window.__boom = true; });
    await nudge(pg, 3); await pg.waitForTimeout(500);
    const t0 = Date.now();
    await pg.waitForFunction(() => window.__gl2.isContextLost(), null, { timeout: 8000, polling: 50 }).catch(() => {});
    const r = await pg.evaluate(() => ({ d3: document.documentElement.__porta.geo().d3, lost: window.__gl2.isContextLost(), buffer: window.__gl2.drawingBufferWidth + "x" + window.__gl2.drawingBufferHeight }));
    r.after = Date.now() - t0 + 500;
    report(r.d3 === "handed back" && r.lost, "a hand-back lets the WebGL context go once the GPU has caught up and the page is still (" + r.after + " ms after it)", JSON.stringify(r));
    await c.close();
  }
  // ---------------------------------------------------------------- 8. iOS: ready sooner, ?diag stages, the watchdog
  const SAFARI = `(() => {
    window.requestIdleCallback = undefined; window.cancelIdleCallback = undefined;
    for (const k of ["scheduling", "deviceMemory", "connection"]) Object.defineProperty(Navigator.prototype, k, { configurable: true, get: () => undefined });
    try { Object.defineProperty(window, "scheduler", { configurable: true, value: undefined }); } catch (e) {}
    window.__fence = 0; window.__lt = []; window.__ev = [];
    const P = WebGL2RenderingContext.prototype, fs0 = P.fenceSync, ds0 = P.deleteSync, fT = new WeakMap();
    P.fenceSync = function () { const f = fs0.apply(this, arguments); if (f) fT.set(f, performance.now()); return f; };
    P.deleteSync = function (f) { const t = f && fT.get(f); if (t) window.__fence += performance.now() - t; return ds0.apply(this, arguments); };
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lt.push([e.startTime, e.duration]); }).observe({ type: "longtask", buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__ev.push([e.name, e.startTime, e.processingStart - e.startTime]); }).observe({ type: "event", durationThreshold: 16, buffered: true });
  })();`;
  const IUA = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.6.1 Mobile/15E148 Safari/604.1";
  const iphone = async () => {
    const c = await b.newContext({ viewport: { width: 390, height: 796 }, screen: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, userAgent: IUA });
    await c.addInitScript((t) => { try { localStorage.setItem("ab-tema", t); } catch (e) {} }, "dia");
    await c.addInitScript(spoof({ gpu: "Apple GPU" }));
    await c.addInitScript(SAFARI);
    const pg = await c.newPage(); await serve.offline(pg);
    const cdp = await c.newCDPSession(pg);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    return { c, pg, cdp };
  };
  for (let attempt = 1; attempt <= 2; attempt++) {
    const { c, pg } = await iphone();
    await pg.goto(base, { waitUntil: "load" }); await settled(pg, 60000);
    const d = await pg.evaluate(() => { const g = document.documentElement.__porta.geo(), nav = performance.getEntriesByType("navigation")[0], fcp = performance.getEntriesByName("first-contentful-paint")[0];
      const at = (s) => { const e = g.d3log.find((x) => x.split("@")[0] === s); return e ? +e.split("@")[1] : -1; }, L = nav.loadEventStart;
      return { d3: g.d3, why: g.d3why, ric: typeof window.requestIdleCallback, load: Math.round(L), fcp: fcp ? Math.round(fcp.startTime) : -1, gate: Math.round(at("gate")), on: Math.round(at("on") - L),
        fence: Math.round(window.__fence), held: g.d3times && g.d3times.held, log: g.d3log, long: window.__lt.filter((x) => x[0] > L && x[1] > 50).map((x) => Math.round(x[0] - L) + "+" + Math.round(x[1])) }; });
    const order = ["gate", "probe", "fetch", "eval", "context", "decode", "three", "scene", "theme", "upload", "compile", "warm", "frames", "on"].map((k) => { const e = d.log.find((x) => x.split("@")[0] === k); return e ? +e.split("@")[1] : -1; });
    const ok = d.d3 === "on" && /^passed the gate: Apple GPU$/.test(d.why) && d.ric === "undefined" && order.every((t, i) => t >= 0 && (!i || t >= order[i - 1])) && d.gate - d.fcp < 1000
      && d.on > 0 && d.on < 4000 && d.on - d.fence < 1500 && d.held < 300 && !d.long.length;
    await c.close();
    if (!ok && attempt === 1) { console.log("RETRY", "iPhone emulation, a still visitor (timing gate):", JSON.stringify({ ...d, log: undefined })); continue; }
    report(ok, "iPhone emulation (4x)", "a still visitor: the gate " + (d.gate - d.fcp) + " ms after the first paint, «on» " + d.on + " ms after the load event (" + (d.on - d.fence) + " ms net of SwiftShader's fences), every stage in order, held " + d.held + " ms, no long task" + (attempt > 1 ? " (second attempt)" : ""),
      JSON.stringify({ ...d, log: d.log.join(" ") }));
    break;
  }
  for (let attempt = 1; attempt <= 2; attempt++) {
    const { c, pg, cdp } = await iphone();
    await pg.goto(base + "?guard=5000,9000", { waitUntil: "load" });
    await pg.waitForFunction(() => performance.now() >= performance.getEntriesByType("navigation")[0].loadEventStart + 1000, null, { polling: 10 });
    for (let f = 0; f < 3; f++) {
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 200, y: 620 }] });
      for (let i = 1; i <= 12; i++) { await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 200, y: 620 - 14 * i }] }); await pg.waitForTimeout(16); }
      await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      await pg.waitForTimeout(900);
    }
    /* the inputs while it loads: once on, it may take over mid-walk (below), and SwiftShader then draws each frame at
       DPR 3 in 130-230 ms (the compositor waits for it: touches wait 100-340 ms); a phone's GPU does it in a fraction */
    const d = await pg.evaluate(() => { const L = performance.getEntriesByType("navigation")[0].loadEventStart, g = document.documentElement.__porta.geo();
      const on = g.d3log.find((x) => /^on@/.test(x)), until = on ? +on.split("@")[1] : Infinity;
      const ev = window.__ev.filter((e) => e[1] > L + 900 && e[1] < until && /touch|pointer/.test(e[0]));
      return { d3: g.d3, stage: g.d3stage, p: +g.p.toFixed(3), n: ev.length, worst: Math.round(Math.max(0, ...ev.map((e) => e[2]))), held: g.d3times && g.d3times.held, log: g.d3log.join(" ") }; });
    const ok = d.p > 0.3 && d.n > 0 && d.worst <= 50;
    await c.close();
    if (!ok && attempt === 1) { console.log("RETRY", "iPhone emulation, flicks from 1 s (timing gate):", JSON.stringify(d)); continue; }
    report(ok, "iPhone emulation (4x)", "a visitor flicking from 1 s after the load event while the 3D loads: no input waits over 50 ms (worst " + d.worst + " ms)" + (attempt > 1 ? " (second attempt)" : ""), JSON.stringify(d));
    break;
  }
  /* A common pattern on a phone: the visitor opens the page and
     scrolls at once, before the 3D is ready. It takes over in that first walk-in, as soon as it is on, at the same
     progress, by a cross-fade over --dur-handback (canvas from 0 to 1 over the CSS entrance, the photograph's layers
     hidden only once it is opaque; never a frame with neither), with no long task over 50 ms; the next flick is drawn
     in 3D. Until then it waited for rest or the flat colour: his first walk-in was always the CSS one. */
  const REC = () => { window.__xf = []; (function f() { const p = document.documentElement && document.documentElement.__porta;
    if (p && window.__xf.length < 600) { const g = p.geo(); if (g.d3 === "on") { const cv = document.querySelector(".porta__3d"), sc = document.querySelector(".scene");
      window.__xf.push([performance.now(), g.r, cv ? getComputedStyle(cv).visibility : "none", cv ? +(+getComputedStyle(cv).opacity).toFixed(3) : 0, getComputedStyle(sc).visibility]); } }
    requestAnimationFrame(f); })(); };
  const flick = async (cdp, pg) => {
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 200, y: 620 }] });
    for (let i = 1; i <= 12; i++) { await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 200, y: 620 - 14 * i }] }); await pg.waitForTimeout(16); }
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  };
  const parked = (pg) => pg.waitForFunction(() => { const g = document.documentElement.__porta.geo(); return Math.abs(g.r - g.p) < 1e-4; }, null, { timeout: 15000, polling: 30 }).catch(() => {});
  for (let attempt = 1; attempt <= 2; attempt++) {
    const { c, pg, cdp } = await iphone();
    await pg.addInitScript(REC);
    await pg.goto(base + "?guard=5000,9000", { waitUntil: "load" });
    await pg.waitForFunction(() => performance.now() >= performance.getEntriesByType("navigation")[0].loadEventStart + 300, null, { polling: 10 });
    await flick(cdp, pg); await parked(pg);
    const g0 = await pg.evaluate(() => { const g = document.documentElement.__porta.geo(); return { d3: g.d3, r: +g.r.toFixed(4) }; });
    await onAt(pg);
    await pg.waitForTimeout(1500);
    const d = await pg.evaluate(() => { const L = performance.getEntriesByType("navigation")[0].loadEventStart, g = document.documentElement.__porta.geo(), f = window.__xf;
      const on = g.d3log.find((x) => /^on@/.test(x)), tOn = on ? +on.split("@")[1] : 0;
      const i0 = f.findIndex((e) => e[2] === "visible"), i1 = f.findIndex((e, i) => i > i0 && e[2] === "visible" && e[4] === "hidden");
      return { d3: g.d3, on: Math.round(tOn - L), first: i0 >= 0 ? f[i0] : null, opaqueAt: i1 >= 0 ? Math.round(f[i1][0] - f[i0][0]) : -1, endOpacity: i1 >= 0 ? f[i1][3] : -1,
        mid: f.filter((e) => e[2] === "visible" && e[4] === "visible" && e[3] > 0.02 && e[3] < 0.98).length,
        blank: f.filter((e) => e[2] !== "visible" && e[4] === "hidden").length,
        long: window.__lt.filter((x) => x[0] > tOn - 300 && x[1] > 50).map((x) => Math.round(x[0] - L) + "+" + Math.round(x[1])) }; });
    /* the walk-in goes on in 3D */
    await flick(cdp, pg); await parked(pg); await pg.waitForTimeout(300);
    const s2 = await state(pg);
    const ok = g0.d3 === "loading" && g0.r > 0.05 && d.d3 === "on" && d.first && Math.abs(d.first[1] - g0.r) < 0.002 && d.first[4] === "visible" && d.first[3] < 0.5
      && d.mid >= 2 && d.opaqueAt >= 120 && d.opaqueAt < 700 && d.endOpacity === 1 && !d.blank && !d.long.length
      && s2.d3 === "on" && s2.canvas === "visible" && s2.scene === "hidden" && s2.r > g0.r + 0.05 && s2.r < 0.66;
    await c.close();
    if (!ok && attempt === 1) { console.log("RETRY", "iPhone emulation, the scroll-at-once take-over:", JSON.stringify({ g0, ...d, s2 })); continue; }
    report(ok, "iPhone emulation (4x)", "opened and scrolled at once (p " + g0.r + " while «" + g0.d3 + "»): the 3D takes over mid-walk at the same progress when on (+" + d.on + " ms), a cross-fade of "
      + d.opaqueAt + " ms (" + d.mid + " frames between), never a blank frame, no long task; the next flick in 3D (r " + s2.r + ")" + (attempt > 1 ? " (second attempt)" : ""), JSON.stringify({ g0, ...d, s2 }));
    break;
  }
  /* A hand-back never freezes the page (before: the context was lost 60 ms after it, in the visitor's
     gesture, and Chromium waited for the GPU's whole backlog: one main-thread task of 6-11 s, the next flick 12 s
     late). Forced here (?guard=25,60: SwiftShader draws a DPR 3 frame in 130-230 ms; the frame rule or the GPU-lag
     rule hands back): no long task over 50 ms in the next 2 s; the context is let go later, once the GPU has caught up
     and the page is still, in a short task. */
  for (let attempt = 1; attempt <= 2; attempt++) {
    const { c, pg, cdp } = await iphone();
    await pg.addInitScript(() => { window.__lose = []; window.__hbAt = 0; const g0 = WebGL2RenderingContext.prototype.getExtension;
      WebGL2RenderingContext.prototype.getExtension = function (n) { const x = g0.call(this, n); if (x && n === "WEBGL_lose_context" && !x.__w) { const l = x.loseContext.bind(x);
        x.loseContext = function () { const t = performance.now(); l(); window.__lose.push([t, performance.now() - t]); }; x.__w = 1; } return x; };
      (function f() { const p = document.documentElement && document.documentElement.__porta; if (p && !window.__hbAt && /hand/.test(p.geo().d3)) window.__hbAt = performance.now(); requestAnimationFrame(f); })(); });
    await pg.goto(base + "?guard=25,60", { waitUntil: "load" }); await onAt(pg);
    await pg.waitForTimeout(600);
    await flick(cdp, pg); await pg.waitForTimeout(400); await flick(cdp, pg);
    await pg.waitForFunction(() => window.__hbAt > 0, null, { timeout: 15000 }).catch(() => {});
    await pg.waitForFunction(() => performance.now() > window.__hbAt + 2000, null, { timeout: 15000 }).catch(() => {});
    await pg.waitForFunction(() => window.__lose.some((x) => x[0] > window.__hbAt), null, { timeout: 30000, polling: 100 }).catch(() => {});
    const d = await pg.evaluate(() => { const H = window.__hbAt, g = document.documentElement.__porta.geo(), lo = window.__lose.filter((x) => x[0] > H);
      return { d3: g.d3, why: g.d3why, hb: H > 0, long2s: window.__lt.filter((x) => x[0] >= H - 20 && x[0] < H + 2000 && x[1] > 50).map((x) => Math.round(x[0] - H) + "+" + Math.round(x[1])),
        lose: lo.map((x) => [Math.round(x[0] - H), +x[1].toFixed(1)]), longAtLose: lo.length ? window.__lt.filter((x) => x[1] > 50 && x[0] <= lo[0][0] && x[0] + x[1] >= lo[0][0]).map((x) => Math.round(x[1])) : [] }; });
    const ok = d.hb && d.d3 === "handed back" && /^(a frame of \d+ ms \(limit 60\)|median frame [\d.]+ ms \(limit \d+\)|the GPU \d+ ms behind, \d+ frames \(limit 60\))$/.test(d.why) && !d.long2s.length && d.lose.length === 1 && d.lose[0][1] < 50 && !d.longAtLose.length;
    await c.close();
    if (!ok && attempt === 1) { console.log("RETRY", "iPhone emulation, a forced hand-back:", JSON.stringify(d)); continue; }
    report(ok, "iPhone emulation (4x)", "a forced hand-back (" + d.why + "): no long task over 50 ms in the next 2 s; the context let go " + (d.lose[0] ? d.lose[0][0] + " ms later, in " + d.lose[0][1] + " ms" : "never") + (attempt > 1 ? " (second attempt)" : ""), JSON.stringify(d));
    break;
  }
  /* Time away is not stillness (10 Nov): the main thread held 12 s in «upload», as iOS suspends a page in
     the background and fires the overdue tick on its return, used to refuse the 3D for the session (4 of 6 runs,
     «timeout: upload n/19 (no progress in 12.0 s)»); a tick now counts 500 ms at most and a hidden page's none. */
  {
    const { c, pg, cdp } = await iphone();
    await pg.goto(base + "?guard=5000,9000", { waitUntil: "load" });
    await pg.waitForFunction(() => document.documentElement.__porta.geo().d3stage.indexOf("upload") === 0, null, { polling: 5, timeout: 30000 }).catch(() => {});
    await pg.waitForTimeout(100);
    const at = await pg.evaluate(() => document.documentElement.__porta.geo().d3stage);
    await cdp.send("Debugger.enable"); await cdp.send("Debugger.pause");
    await new Promise((r) => setTimeout(r, 12000));
    await cdp.send("Debugger.resume"); await cdp.send("Debugger.disable");
    await settled(pg, 60000);
    const s = await state(pg), memo = await pg.evaluate(() => sessionStorage.getItem("ab-3d"));
    report(/^upload/.test(at) && s.d3 === "on" && /^1\|/.test(memo || ""), "iPhone emulation (4x): the main thread held 12 s in «" + at + "» (a page suspended in the background): the 3D still comes on, nothing refused or remembered", JSON.stringify({ at, d3: s.d3, why: s.why, memo }));
    await c.close();
  }
  /* ?diag while loading and once on */
  {
    const { c, pg } = await ctx({ spoof: { gpu: GPU } });
    await pg.goto(base + "?guard=5000,9000&diag", { waitUntil: "load" });
    const seen = [];
    for (let i = 0; i < 200; i++) {
      const t = await pg.evaluate(() => { const p = document.querySelector("pre"); return p ? p.textContent.split("\n").filter((l) => /^path=|^3d steps/.test(l)).join(" || ") : ""; });
      if (t && seen[seen.length - 1] !== t) seen.push(t);
      if (/3d=on/.test(t)) break;
      await pg.waitForTimeout(100);
    }
    const loading = seen.filter((t) => /path=CSS 3d=loading:[a-z]+( \d+\/\d+)? \d+ms why=passed the gate: ANGLE/.test(t)), last = seen[seen.length - 1] || "";
    report(loading.length >= 2 && loading.some((t) => /3d=loading:upload \d+\/\d+ \d+ms/.test(t)) && /3d steps: load@\d+ gate@\d+ probe@\d+ fetch@\d+ .*upload@\d+ compile@\d+ warm@\d+ frames@\d+ on@\d+ held=\d+ms/.test(last) && /path=CSS 3d=on why=/.test(last),
      "?diag while loading names the stage, its step and the time since the load began; once on, when each stage began", JSON.stringify({ n: seen.length, loading: loading.slice(0, 3), last }));
    await c.close();
  }
  /* the watchdog: a band's crop that never resolves (a step that hangs) and a decode that never comes back (the worker) */
  for (const [label, hang, re, kept] of [
    ["a step that hangs (the facade's first band)", () => { const o = window.createImageBitmap; window.createImageBitmap = function (src) { return typeof ImageBitmap !== "undefined" && src instanceof ImageBitmap && arguments.length > 2 ? new Promise(() => {}) : o.apply(this, arguments); }; },
      /^timeout: upload 1\/\d+ \(no progress in 8\.\d s\)$/, true],
    ["a decode that never comes back (the worker)", () => { const W = window.Worker; window.Worker = function (u) { const w = new W(u); w.postMessage = function () {}; return w; }; },
      /^timeout: decode \(no progress in 20\.\d s\)$/, false]]) {
    const { c, pg, reqs } = await ctx({ spoof: { gpu: GPU } });
    await pg.addInitScript(hang);
    await pg.goto(base + "?guard=5000,9000&diag", { waitUntil: "load" }); await settled(pg, 40000);
    await pg.waitForTimeout(700);           /* ?diag writes every 500 ms */
    const s = await state(pg), memo = await pg.evaluate(() => sessionStorage.getItem("ab-3d")), n1 = reqs.length;
    const diag = await pg.evaluate(() => document.querySelector("pre").textContent);
    await pg.reload({ waitUntil: "load" }); await pg.waitForTimeout(2500);
    const s2 = await state(pg);
    report(s.d3 === "refused" && re.test(s.why) && s.canvas === "none" && s.scene === "visible" && /path=CSS 3d=refused why=timeout: /.test(diag)
      && (kept ? /^0\|timeout: upload/.test(memo || "") && s2.d3 === "refused" && /^earlier in this session: timeout: upload/.test(s2.why) && reqs.length === n1 : /^1\|/.test(memo || "") && s2.d3 !== "refused"),
      "the watchdog: " + label + ": the CSS entrance, named" + (kept ? ", remembered for the session" : ", not remembered (tried again on the next load)"), JSON.stringify({ why: s.why, memo, next: [s2.d3, s2.why] }));
    await c.close();
  }
  console.log("door3d", fail ? "FAILED" : "ok"); await b.close(); srv.close(); process.exit(fail ? 1 : 0);
})();
