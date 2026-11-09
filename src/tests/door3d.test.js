// The 3D entrance (door3d.js): ON BY DEFAULT where the device can draw it, with the CSS entrance as the automatic
// fallback at every step (DOOR_FINISH_BRIEF); lazy, never on the first paint, a canvas that takes over only while the
// doors move, and the CSS entrance whenever it cannot.
// Usage: node src/tests/door3d.test.js docs
// Headless Chromium has no GPU: by default the page refuses its software renderer (SwiftShader), as it should. The 3D
// path is driven either with ?3d=force (no GPU probe, no frame-time rule: frame rates here say nothing about a phone)
// or, for the default path, with a capable GPU spoofed in an init script (the renderer's name, the caveat flag dropped,
// 8 cores, 8 GB) and the frame-time rule given limits SwiftShader can meet (?guard=MED,MAX).
// 1. Per viewport (390 x 844 touch, 1440 x 900 mouse) and theme, ?3d=force:
//   requested after the load event and mounted with no scroll at all; at rest the canvas is hidden and the photograph's
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
//   gets the 3D by default, fetched at idle right after the load event, before any scroll.
// 3. The live safeguard (capable GPU spoofed): an injected 2.5 s frame (?guard=100000,1500), a slow median (?guard=25,..
//   with 50 ms of work in every frame) and an exception in a draw each hand back to the CSS entrance at the same
//   progress (the slow cases dissolve over --dur-handback), remember it for the session (the next load is refused before
//   any request) and say why in ?diag; a tab switch's frame is not counted; a page restored from the back/forward cache
//   with its context keeps the 3D without a rebuild.
// 4. iOS (iPhone user agent, DPR 3) and Android Chrome at DPR 3: the canvas at the device's ratio, 3, no MSAA (iOS was
//    capped at 2 until 9 Nov: softer than the photograph).
// 5. The take-over frame (1 px of scroll) is as sharp as the page's photograph (gradient energy, 3D / CSS) and equals it
//   (mean |dRGB|) at 390 x 844 @3 and 1440 x 900 @1; at p 0.15 and 0.3 the door's plane follows the CSS camera: the
//   facade outside the doorway aligns at a shift of (0, 0) device px (searched +-4) and differs by a mean of < 2 levels.
// 6. A wheel or a touch drag 300 ms after the load event, at 4x CPU throttle, has no long task over 50 ms (the module is
//   only fetched then; it is evaluated and mounted once the page is still). That last check is a timing gate: on a
//   machine busy with other headless browsers a task of the machine's own can land in the window (review r2: one 81 ms
//   task in one run of three), so it fails only if a second attempt, in a fresh context, shows a long task too.
// 6b. A touch drag that starts as the module is asked for, and one at the facade's first band (default path, 4x CPU
//   throttle): no input waits more than 50 ms (the same timing gate).
// 7. Review, door finish: the open leaves' width against the doorway is flat from p 0.34 (the 3D frame's own meshes,
//   projected); a shader that does not compile is refused at the mount (nothing drawn, remembered); a draw that throws
//   while the mount warms up and a module that does not run are refused, named and remembered (the next load asks for
//   nothing); a hand-back lets the WebGL context go at once. Section 1 also records every frame of a touch drag (390) and
//   of the flight: while the camera moves, the canvas draws and the photograph is hidden, never a blank frame, the flight
//   0.9-1.1 s; under the flat colour the photograph stays hidden; section 3: nothing is drawn while handing back.
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
    const t = await pg.evaluate(() => ({ load: Math.round(window.__loadAt), first: Math.round(Math.min(...window.__req3d)), y: scrollY, d3: document.documentElement.__porta.geo().d3 }));
    report(t.d3 === "on" && t.first > t.load && t.first - t.load < 2500 && t.y === 0, n, theme, "early and lazy: requested at idle right after the load event, mounted with no scroll", JSON.stringify(t));
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
      /* the photograph's layers stay hidden under the flood too (review, door finish: shown there, they were decoded and
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
       rest (transform none) deep in the run before the flat colour (review, door finish) */
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
    /* a capable GPU: the 3D by default, fetched at idle right after the load event, before any scroll */
    const { c, pg, reqs, errs } = await ctx({ spoof: { gpu: GPU } });
    await pg.goto(base + "?guard=5000,9000", { waitUntil: "load" }); await settled(pg, 60000);
    const t = await pg.evaluate(() => ({ load: Math.round(window.__loadAt), first: Math.round(Math.min(...window.__req3d)), y: scrollY, mem: sessionStorage.getItem("ab-3d") }));
    await go(pg, 0.3);
    const s = await state(pg);
    report(s.d3 === "on" && s.canvas === "visible" && /^passed the gate: ANGLE \(Apple/.test(s.why) && t.y === 0 && t.first > t.load && t.first - t.load < 2500 && /^1\|/.test(t.mem) && !errs.length,
      "a capable GPU: the 3D by default, requested at idle right after the load event, before any scroll", JSON.stringify({ ...s, ...t, reqs: reqs.length }));
    await c.close();
  }

  // ---------------------------------------------------------------- 3. the live safeguard
  /* The guard watches the first second of 3D motion: each case starts that motion from rest, freshly mounted. A
     slow frame is injected while the driver's loop runs (the frame after the first one of a scroll blocks). The 3D
     frame the canvas showed at p 0.3 comes from a ?3d=force page left to settle (SwiftShader draws it identically
     each time; a frame read too soon after a scroll is one it has not presented yet). */
  const toP = (pg, p, inject) => pg.evaluate(([p, inject]) => { const g = document.documentElement.__porta.geo(); scrollTo(0, Math.round(g.pin + p * g.run)); if (inject) (new Function(inject))(); }, [p, inject || ""]);
  const SLOW = "requestAnimationFrame(() => requestAnimationFrame(() => { const t = performance.now(); while (performance.now() - t < 2500) {} }));";
  const nudge = async (pg, k) => { for (let i = 0; i < (k || 6); i++) { await pg.evaluate(() => scrollBy(0, 1)); await pg.waitForTimeout(40); } };
  const handing = (pg) => pg.waitForFunction(() => /hand/.test(document.documentElement.__porta.geo().d3), null, { timeout: 15000, polling: "raf" }).catch(() => {});
  const still3d = (pg, st) => pg.waitForFunction((st) => { const g = document.documentElement.__porta.geo(); return g.r === g.p && g.d3 === st; }, st, { timeout: 15000 }).catch(() => {});
  for (const [n, w, h, dpr, theme] of [["m390", 390, 844, 2, "dia"], ["d1440", 1440, 900, 1, "noite"]]) {
    let A, rA;
    { const o = await ctx({ w, h, dpr, theme }); await o.pg.goto(base + "?3d=force", { waitUntil: "load" }); await onAt(o.pg); await go(o.pg, 0.3); await o.pg.waitForTimeout(1500);
      A = await shot(o.pg); rA = (await state(o.pg)).r; await o.c.close(); }
    /* a frame over the limit: dissolves into the CSS entrance at the same progress, remembered, said in ?diag */
    const { c, pg, reqs, errs } = await ctx({ w, h, dpr, theme, spoof: { gpu: GPU } });
    /* draws while the 3D hands back: none (its last frame is frozen and dissolves; review, door finish) */
    await pg.addInitScript(() => { window.__hb = 0; const P = WebGL2RenderingContext.prototype;
      for (const k of ["drawArrays", "drawElements"]) { const o = P[k]; P[k] = function () { const r = document.documentElement.__porta; if (r && r.geo().d3 === "handing back") window.__hb++; return o.apply(this, arguments); }; } });
    await pg.goto(base + "?guard=100000,1500&diag", { waitUntil: "load" }); await settled(pg, 60000);
    await pg.waitForTimeout(600);
    const g0 = (await geo(pg)).d3guard;
    await toP(pg, 0.3, SLOW);
    await handing(pg);
    const mid = await pg.evaluate(() => { const c = document.querySelector(".porta__3d"), g = document.documentElement.__porta.geo();
      return { d3: g.d3, canvas: !!c, opacity: c ? c.style.opacity : null, transition: c ? c.style.transition : null, scene: getComputedStyle(document.querySelector(".scene")).visibility }; });
    await still3d(pg, "handed back");
    await pg.waitForTimeout(600);
    const hb = await pg.evaluate(() => window.__hb);
    report(hb === 0, n, theme, "handing back: the slow 3D is not drawn again (draw calls while handing back: " + hb + ")");
    /* ?diag's own overlay is read, then hidden for the frame */
    const memo = await pg.evaluate(() => sessionStorage.getItem("ab-3d")), diag = await pg.evaluate(() => { const d = [...document.querySelectorAll("pre")].pop(); if (!d) return ""; const t = d.textContent; d.style.visibility = "hidden"; return t; });
    await pg.waitForTimeout(100);
    const B = await shot(pg);
    let s = await state(pg);
    const jump = mean(A, B);
    report(g0 && g0.n === 0 && /^a frame of \d+ ms \(limit 1500\)$/.test(s.why) && s.d3 === "handed back" && s.canvas === "none" && s.scene === "visible" && Math.abs(s.r - rA) < 0.002 && jump < 6
      && mid.d3 === "handing back" && mid.opacity === "0" && /opacity 0\.18s|opacity 180ms/.test(mid.transition) && mid.scene === "visible",
      n, theme, "a 2.5 s frame in the first second: the 3D dissolves into the CSS entrance, the same progress (mean |dRGB| at p 0.3 " + jump.toFixed(2) + ")", JSON.stringify({ ...s, rA, g0, mid }));
    report(/^0\|a frame of/.test(memo || "") && /path=CSS 3d=handed back why=a frame of/.test(diag), n, theme, "remembered for the session; ?diag says why", JSON.stringify({ memo, diag: diag.split("\n").filter((l) => /path=/.test(l)) }));
    const before = reqs.length;
    await pg.reload({ waitUntil: "load" }); await pg.waitForTimeout(2500);
    s = await pg.evaluate(() => ({ d3: document.documentElement.__porta.geo().d3, why: document.documentElement.__porta.geo().d3why, gl: window.__gl }));
    report(s.d3 === "refused" && /^earlier in this session: a frame of/.test(s.why) && s.gl === 0 && reqs.length === before && !errs.length, n, theme, "the next load of the tab: the CSS entrance, nothing probed or requested", JSON.stringify({ ...s, reqs: reqs.length - before }));
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
    const s = await state(pg), g = await geo(pg);
    report(s.d3 === "handed back" && /^median frame \d+\.\d ms \(limit 25\)$/.test(s.why) && s.canvas === "none" && s.scene === "visible", "a slow median (50 ms of work a frame): handed back to the CSS entrance", JSON.stringify({ ...s, guard: g.d3guard }));
    await c.close();
  }
  {
    /* an exception in a draw: handed back at once, at the same progress */
    const { c, pg } = await ctx({ spoof: { gpu: GPU } });
    await pg.goto(base + "?guard=100000,100000", { waitUntil: "load" }); await settled(pg, 60000);
    await go(pg, 0); await go(pg, 0.3);
    const r0 = (await state(pg)).r;
    await pg.evaluate(() => { const P = WebGL2RenderingContext.prototype; for (const k of ["drawArrays", "drawElements"]) { const o = P[k]; P[k] = function () { if (window.__boom) throw new Error("boom"); return o.apply(this, arguments); }; } window.__boom = true; });
    await nudge(pg, 3);
    await pg.waitForTimeout(400);
    const s = await state(pg);
    report(s.d3 === "handed back" && /^exception: boom$/.test(s.why) && s.canvas === "none" && s.scene === "visible" && Math.abs(s.r - r0) < 0.01, "an exception in a draw: handed back at once, at the same progress", JSON.stringify({ ...s, r0 }));
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
  /* review, door finish: the mount used to run as tasks of 50-234 ms (the module and the context in one, the facade's
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

  // ---------------------------------------------------------------- 7. review, door finish
  /* the open leaves keep their width against the doorway once the doors are open (client, 9 Nov: «as portas aumentam de
     tamanho (largura) quando se entra»): the camera stays put from p 0.34 (the lens alone), the hall's camera keeps
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
  /* a hand-back lets the context go at once (WEBGL_lose_context), not at the next garbage collection */
  {
    const { c, pg } = await ctx({ spoof: { gpu: GPU } });
    await pg.goto(base + "?guard=100000,100000", { waitUntil: "load" }); await settled(pg, 60000);
    await go(pg, 0); await go(pg, 0.3);
    await pg.evaluate(() => { window.__gl2 = document.querySelector(".porta__3d").getContext("webgl2");
      const P = WebGL2RenderingContext.prototype; for (const k of ["drawArrays", "drawElements"]) { const o = P[k]; P[k] = function () { if (window.__boom) throw new Error("boom"); return o.apply(this, arguments); }; } window.__boom = true; });
    await nudge(pg, 3); await pg.waitForTimeout(500);
    const r = await pg.evaluate(() => ({ d3: document.documentElement.__porta.geo().d3, lost: window.__gl2.isContextLost(), buffer: window.__gl2.drawingBufferWidth + "x" + window.__gl2.drawingBufferHeight }));
    report(r.d3 === "handed back" && r.lost, "a hand-back lets the WebGL context go at once", JSON.stringify(r));
    await c.close();
  }
  console.log("door3d", fail ? "FAILED" : "ok"); await b.close(); srv.close(); process.exit(fail ? 1 : 0);
})();
