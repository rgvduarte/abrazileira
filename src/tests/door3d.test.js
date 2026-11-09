// The 3D entrance (door3d.js): opt-in (?3d, for testing on real devices; the default page is the CSS entrance), lazy,
// never on the first paint, a canvas that takes over only while the doors move, and the CSS entrance whenever it cannot.
// Usage: node src/tests/door3d.test.js docs
// Headless Chromium has no GPU: the page refuses a software renderer, so this test forces it with ?3d=force
// (SwiftShader; frame rates here say nothing about a phone). Per viewport (390 x 844 touch, 1440 x 900 mouse) and theme:
//   nothing of the 3D entrance is requested before the page's load event; it is mounted after idle;
//   at rest (p = 0) the canvas is hidden and the photograph's layers are shown, with no inline style left;
//   mid-run (p = 0.15, 0.3, 0.5) the canvas is shown, has drawn the doorway (not the wall colour), and the layers it
//     replaces are hidden; under the flat colour (p = 0.9) the canvas is hidden and every pixel is --color-hall;
//   back at the top: the exact rest state again;
//   the hero action's flight still lands in the email field, and the canvas is drawn during it;
//   a theme change mid-run: the canvas follows the theme (or steps aside to the CSS entrance until it can);
//   a theme change at rest: once its textures are in, the next scroll's frames upload nothing (review r1);
//   a lost WebGL context mid-run: the canvas is gone, the CSS entrance is shown at the same progress and goes on moving;
//     shown again (pageshow), the page mounts the 3D entrance again (review r1).
// Then: the default page (no ?3d) never probes WebGL nor requests the module; ?sem3d, ?semporta and reduced motion never
// request it, nor does ?3d on a software renderer (the page probes WebGL 2 before fetching anything, review r1).
// Then (review r1): the take-over frame is as sharp as the page's own photograph (gradient energy, ?3d=force / default, at 1px of
// scroll) at 390 x 844 @3 (the canvas at the device's ratio) and 1440 x 900 @1; and a wheel or a touch drag 300 ms after
// the load event, at 4x CPU throttle, has no long task over 50 ms (the module is only fetched then; it is evaluated and
// mounted once the page is still).
setTimeout(() => { console.log("TIMEOUT"); process.exit(2); }, 600000);
const { chromium } = require("playwright"), serve = require("./serve.js"), png = require("./png.js");
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.replace("#", "").padEnd(6, "0").slice(i - 1, i + 1), 16));
const [, , dir] = process.argv;
(async () => {
  const { srv, base } = await serve(dir);
  const b = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  let fail = 0;
  const report = (ok, ...a) => { if (!ok) fail++; console.log(ok ? "PASS" : "FAIL", ...a); };
  const geo = (pg) => pg.evaluate(() => document.documentElement.__porta.geo());
  const state = (pg) => pg.evaluate(() => { const c = document.querySelector(".porta__3d"), s = document.querySelector(".scene");
    return { canvas: c ? getComputedStyle(c).visibility : "none", scene: getComputedStyle(s).visibility, inline: s.style.visibility, d3: document.documentElement.__porta.geo().d3 }; });
  const go = async (pg, p) => {
    const dead = await pg.evaluate(() => (document.documentElement.__porta ? null : (window.__abErr || []).join(" | ")));
    if (dead !== null) throw new Error("the sequence stepped aside: " + dead);
    await pg.evaluate((p) => { const g = document.documentElement.__porta.geo(); scrollTo(0, Math.round(g.pin + p * g.run)); }, p);
    await pg.waitForFunction(() => { const g = document.documentElement.__porta.geo(); return g.r === g.p; }, null, { timeout: 8000 }).catch(() => {});
    await pg.waitForTimeout(150);
  };
  for (const [n, w, h, dpr] of [["m390", 390, 844, 2], ["d1440", 1440, 900, 1]]) for (const theme of ["dia", "noite"]) {
    const mobile = w < 900;
    const c = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, isMobile: mobile, hasTouch: mobile });
    await c.addInitScript((t) => { try { localStorage.setItem("ab-tema", t); } catch (e) {} }, theme);
    const pg = await c.newPage(); await serve.offline(pg);
    const errs = [], reqs = [];
    pg.on("pageerror", (e) => errs.push(String(e)));
    pg.on("request", (r) => { if (/door3d|three\.min|hall/.test(r.url())) reqs.push(r.url()); });
    await pg.addInitScript(() => { window.__tex = 0; const P = WebGL2RenderingContext.prototype;
      for (const k of ["texImage2D", "texStorage2D", "texSubImage2D"]) { const o = P[k]; P[k] = function () { window.__tex++; return o.apply(this, arguments); }; } });
    await pg.addInitScript(() => { window.addEventListener("load", () => { window.__loadAt = performance.now(); }); window.__req3d = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (/door3d|three\.min/.test(e.name)) window.__req3d.push(e.startTime); }).observe({ type: "resource", buffered: true }); });
    await pg.goto(base + "?3d=force", { waitUntil: "load" });
    await pg.waitForFunction(() => { const g = document.documentElement.__porta.geo(); return g.d3 !== "off" && g.d3 !== "loading"; }, null, { timeout: 30000 }).catch(() => {});
    const t = await pg.evaluate(() => ({ load: window.__loadAt, first: Math.min(...window.__req3d), d3: document.documentElement.__porta.geo().d3 }));
    report(t.d3 === "on" && t.first > t.load, n, theme, "lazy: mounted after the load event", JSON.stringify(t));
    const hall = await pg.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--color-hall").trim());
    let s = await state(pg);
    report(s.canvas === "hidden" && s.scene === "visible" && s.inline === "", n, theme, "rest: the photograph, canvas hidden", JSON.stringify(s));
    for (const p of [0.15, 0.3, 0.5]) {
      await go(pg, p);
      s = await state(pg);
      const img = png.decode(await pg.screenshot());
      const g = await geo(pg), wall = theme === "dia" ? [250, 236, 223] : [28, 20, 15];
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
      const img = png.decode(await pg.screenshot()), want = hex(hall);
      let bad = 0;
      for (let y = 0; y < img.h; y += 3) for (const x of [2 * dpr, img.w - 3 * dpr]) { const p = img.px(x, y); if (Math.max(...p.map((v, i) => Math.abs(v - want[i]))) > 0) bad++; }
      report(s.canvas === "hidden" && fl === "1" && bad === 0, n, theme, "p=0.9: canvas hidden, flat --color-hall " + hall, JSON.stringify({ ...s, flood: fl, bad }));
    }
    await go(pg, 0);
    await pg.waitForTimeout(500);
    s = await state(pg);
    const rest = await pg.evaluate(() => ({ scene: getComputedStyle(document.querySelector(".scene")).transform, intro: document.querySelector(".intro").getAttribute("style") || "" }));
    report(s.canvas === "hidden" && s.scene === "visible" && s.inline === "" && rest.scene === "none" && !/opacity|transform/.test(rest.intro), n, theme, "back at the top: exact rest state", JSON.stringify({ ...s, ...rest }));
    // the flight
    await pg.evaluate(() => { window.__seen3d = 0; const L = () => { const c = document.querySelector(".porta__3d"); if (c && getComputedStyle(c).visibility === "visible") __seen3d++; if (performance.now() < 5000 + (window.__t0 || 0)) requestAnimationFrame(L); }; window.__t0 = performance.now(); requestAnimationFrame(L); });
    if (mobile) { const r = await pg.evaluate(() => { const r = document.querySelector(".cta").getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }); await pg.touchscreen.tap(r.x, r.y); }
    else await pg.click(".cta");
    await pg.waitForTimeout(3500);
    const fl = await pg.evaluate(() => ({ active: document.activeElement && document.activeElement.id, seen: window.__seen3d, canvas: getComputedStyle(document.querySelector(".porta__3d")).visibility }));
    report(fl.active === "email" && fl.seen > 0 && fl.canvas === "hidden", n, theme, "flight: lands in the email field, 3D drawn on the way", JSON.stringify(fl));
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
    // context loss
    await pg.evaluate(() => { const c = document.querySelector(".porta__3d"); const gl = c.getContext("webgl2"); gl.getExtension("WEBGL_lose_context").loseContext(); });
    await pg.waitForTimeout(300);
    await go(pg, 0.5);
    s = await state(pg);
    const after = await pg.evaluate(() => ({ scene: getComputedStyle(document.querySelector(".scene")).transform, seq: document.documentElement.dataset.sequence }));
    report(s.canvas === "none" && s.scene === "visible" && after.scene !== "none" && after.seq === "scroll" && /lost/.test(s.d3), n, theme, "context lost: the CSS entrance takes over and keeps moving", JSON.stringify({ ...s, ...after }));
    // shown again: mounted again (the module is in; textures from the cache)
    await go(pg, 0);
    await pg.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pageshow", { persisted: true })));
    await pg.waitForFunction(() => document.documentElement.__porta.geo().d3 === "on", null, { timeout: 60000 }).catch(() => {});
    await go(pg, 0.3);
    s = await state(pg);
    report(s.d3 === "on" && s.canvas === "visible", n, theme, "context lost, page shown again: the 3D entrance is back", JSON.stringify(s));
    report(!errs.length, n, theme, "no page errors", errs.join(" | "));
    await c.close();
  }
  // never requested
  for (const [label, q, reduce, want] of [["default (no ?3d)", "", false, "off"], ["?sem3d", "?3d&sem3d", false, "off"], ["?semporta", "?3d&semporta", false, null],
    ["reduced motion", "?3d=force", true, null], ["software renderer (?3d, the probe)", "?3d", false, "refused"]]) {
    const c = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: reduce ? "reduce" : "no-preference" });
    const pg = await c.newPage(); await serve.offline(pg); const reqs = [];
    pg.on("request", (r) => { if (/door3d|three\.min|hall\./.test(r.url())) reqs.push(r.url()); });
    await pg.goto(base + q, { waitUntil: "load" }); await pg.waitForTimeout(5000);
    await pg.evaluate(() => scrollTo(0, 300)); await pg.waitForTimeout(800);
    const st = await pg.evaluate(() => ({ canvas: !!document.querySelector(".porta__3d"), seq: document.documentElement.dataset.sequence, d3: document.documentElement.__porta && document.documentElement.__porta.geo().d3 }));
    report(!reqs.length && !st.canvas && (want === null || st.d3 === want), label, "never loads the 3D entrance", JSON.stringify({ reqs: reqs.length, ...st }));
    await c.close();
  }
  // the take-over frame: as sharp as the page's photograph
  const energy = (im, bx) => { let e = 0, k = 0; const L = (p) => 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2];
    for (let y = bx[1]; y < bx[3] - 1; y++) for (let x = bx[0]; x < bx[2] - 1; x++) { const a = L(im.px(x, y)); e += Math.abs(a - L(im.px(x + 1, y))) + Math.abs(a - L(im.px(x, y + 1))); k++; } return e / k; };
  for (const [w, h, dpr] of [[390, 844, 3], [1440, 900, 1]]) {
    const r = {};
    for (const q of ["", "?3d=force"]) {
      const mobile = w < 900, c = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, isMobile: mobile, hasTouch: mobile });
      await c.addInitScript(() => { try { localStorage.setItem("ab-tema", "dia"); } catch (e) {} });
      const pg = await c.newPage(); await serve.offline(pg);
      await pg.goto(base + q, { waitUntil: "load" });
      if (q) await pg.waitForFunction(() => document.documentElement.__porta.geo().d3 === "on", null, { timeout: 60000 }).catch(() => {}); else await pg.waitForTimeout(3500);
      await pg.waitForTimeout(800);
      await pg.evaluate(() => scrollTo(0, 1)); await pg.waitForTimeout(900);
      const box = await pg.evaluate(() => { const r = document.querySelector(".ph--facade").getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom]; });
      const im = png.decode(await pg.screenshot());
      const bx = [0.25, 0.3, 0.75, 0.9].map((f, i) => Math.round((box[i & 1] + f * (box[(i & 1) + 2] - box[i & 1])) * dpr));
      r[q] = energy(im, [bx[0], bx[1], bx[2], bx[3]]);
      if (q) r.shown = await pg.evaluate(() => document.documentElement.__porta.geo().d3shown);
      await c.close();
    }
    const k = r["?3d=force"] / r[""];
    report(r.shown && k >= 0.95 && k <= 1.3, w + "@" + dpr, "take-over frame as sharp as the photograph (3D / CSS gradient energy " + k.toFixed(2) + ")", JSON.stringify(r));
  }
  // a gesture before the module is in (4x CPU throttle): no long task
  for (const [w, h, dpr] of [[1440, 900, 1], [390, 844, 3]]) {
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
    report(!d.lt.filter((x) => +x.split("+")[1] > 50).length, w + "@" + dpr, "a gesture 300 ms after load (4x throttle): no long task over 50 ms", JSON.stringify(d));
    await c.close();
  }
  console.log("door3d", fail ? "FAILED" : "ok"); await b.close(); srv.close(); process.exit(fail ? 1 : 0);
})();
