// The hero action «Entrar na lista de espera» (and the scroll cue) walks in through the door: an animated flight
// of the scroll, driven by the one JS loop, that lands on the list with the email focused.
// Usage: node src/tests/cta.test.js docs
// Per viewport (390 x 844 touch, 1440 x 900 mouse):
//   click, Enter, Space, scroll cue: the scroll moves only forwards over many frames (no jump), the scene plays
//     (scale strictly between 1 and S on the way), the flight lasts 0.9-1.1 s (--dur-flight 1000ms since 9 Nov),
//     it lands with the list title and the email field in view and the focus in the email field;
//   interrupted by a wheel turn, a touch, a key press or a pointer press mid-flight: the flight stops at once,
//     nothing moves the page afterwards and the focus is not moved;
//   Tab from the action: lands on the email with the list in view, without replaying the sequence;
//   reduced motion: the same landing at once (at most 2 scroll positions, no intermediate frame);
//   #lista on load: a jump to the list, never a replay;
//   after a flight, wheeling all the way back up leaves the hero at its exact rest state (no inline style left);
//   the English page, both themes (each mode runs in a fixed theme, so the result never depends on the hour), and
//     the default theme (Torres Vedras time, with a pinned clock);
//   a held Space or Enter (key repeat) and a double click still land in the email field, without a stall;
//   mid-sequence, a tap where the faded action used to be does nothing (no ghost target).
// Then: the colour hand-off, in Dia and Noite, on nine aspect ratios (390 x 844, 430 x 932, 375 x 667, 320 x 568,
// 844 x 390, 768 x 1024, 1440 x 900, 1920 x 1080, 2560 x 1080): EVERY pixel of the frame (list content and footer text excepted) is exactly
// --color-hall from the moment the screen becomes one colour (p = flat), at the middle of the list's rise, at p = 1 and
// with the seam (where the stage releases) on screen: no second colour, no edge left; and on short portrait phones
// (320 x 568, 375 x 553) the photograph's foot (the steps) is inside the first screen and the scroll cue is never
// sliced by the screen's edge. The hand-off again on the 3D path (?3d=force, walked in by wheel) at 390 x 844, 844 x 390
// and 1440 x 900; fast flicks (1500-3500 px/s) at 390 x 844 and 844 x 390 never cut the walk-in ahead in one frame.
setTimeout(() => { console.log("TIMEOUT"); process.exit(2); }, 1200000);
const { chromium } = require("playwright"), serve = require("./serve.js"), png = require("./png.js");
const [, , dir] = process.argv;
const REC = () => {   // every rAF frame: [t, scrollY, scene scale, intro opacity]
  window.__fr = []; const t0 = performance.now();
  const L = (t) => { if (!document.querySelector(".scene") || !document.querySelector(".intro")) return requestAnimationFrame(L);
    const s = new DOMMatrix(getComputedStyle(document.querySelector(".scene")).transform).a;
    __fr.push([Math.round(t - t0), +scrollY.toFixed(1), +s.toFixed(3), +(+getComputedStyle(document.querySelector(".intro")).opacity).toFixed(3)]);
    if (__fr.length < 240) requestAnimationFrame(L); };
  requestAnimationFrame(L);
};
const STATE = () => {
  const a = document.activeElement, er = document.getElementById("email").getBoundingClientRect(),
    tr = document.getElementById("lista-titulo").getBoundingClientRect();
  return { active: a && (a.id || a.className), emailInView: er.top >= 0 && er.bottom <= innerHeight, titleInView: tr.top >= 0 && tr.bottom <= innerHeight,
    y: Math.round(scrollY), listY: Math.round(document.getElementById("lista").getBoundingClientRect().top + scrollY), seq: document.documentElement.dataset.sequence };
};
(async () => {
  const { srv, base } = await serve(dir); const b = await chromium.launch(); let fail = 0;
  const report = (ok, ...a) => { if (!ok) fail++; console.log(ok ? "PASS" : "FAIL", ...a); };
  if (process.env.GEO_ONLY) { await geometry(b, base, report); console.log("cta", fail ? "FAILED" : "ok"); await b.close(); srv.close(); process.exit(fail ? 1 : 0); }
  for (const [n, w, h] of [["m390", 390, 844], ["d1440", 1440, 900]]) {
    const mobile = w < 900;
    const MODES = ["click", "enter", "space", "cue", "tab", "stop-wheel", "stop-key", "stop-pointer", mobile ? "stop-touch" : null, "reduced-click", "hash", "back",
      "click-en", "click-other", "click-sun", "hold-space", "hold-enter", "dblclick", "ghost"].filter(Boolean);
    for (let mi = 0; mi < MODES.length; mi++) {
      const mode = MODES[mi];
      // a fixed theme per mode (alternating, and the other way round on the other viewport): both themes are covered
      // whatever the hour; click-other repeats the click in the other theme; click-sun leaves the default (sky) theme
      const theme = ((mi + (mobile ? 0 : 1)) % 2 ? "noite" : "dia"), page = mode === "click-en" ? "en/" : "";
      const c = await b.newContext({ viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile, reducedMotion: mode === "reduced-click" ? "reduce" : "no-preference" });
      if (mode !== "click-sun") await c.addInitScript((t) => { try { localStorage.setItem("ab-tema", t); } catch (e) {} }, mode === "click-other" ? (theme === "dia" ? "noite" : "dia") : theme);
      const pg = await c.newPage(); await serve.offline(pg); const errs = []; pg.on("pageerror", (e) => errs.push(String(e)));
      if (mode === "click-sun") await pg.clock.install({ time: new Date(mobile ? "2026-11-08T21:00:00Z" : "2026-11-08T11:00:00Z") });
      if (mode === "hash") { await c.addInitScript(REC); await pg.goto(base + "#lista", { waitUntil: "networkidle" }); await pg.waitForTimeout(1500); }
      else { await pg.goto(base + page, { waitUntil: "networkidle" }); await pg.waitForTimeout(1300); await pg.evaluate(REC); }
      if (mode === "ghost") {   // mid-sequence (p ~ 0.3): tap where the faded action is; nothing may happen
        const box = await pg.evaluate(() => { const r = document.querySelector(".cta").getBoundingClientRect(), w = document.querySelector(".porta"), st = document.querySelector(".porta__stage");
          scrollTo(0, w.getBoundingClientRect().top + scrollY + (w.offsetHeight - st.offsetHeight) * 0.3); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
        await pg.waitForTimeout(900);
        const y0 = await pg.evaluate(() => scrollY);
        if (mobile) await pg.touchscreen.tap(box.x, box.y); else await pg.mouse.click(box.x, box.y);
        await pg.waitForTimeout(1600);
        const r = await pg.evaluate(() => ({ y: scrollY, active: document.activeElement && (document.activeElement.id || document.activeElement.className), hit: document.elementFromPoint(innerWidth / 2, innerHeight / 2) && document.elementFromPoint(innerWidth / 2, innerHeight / 2).className }));
        report(Math.abs(r.y - y0) < 1 && r.active !== "email" && !errs.length, n, mode, theme, JSON.stringify({ y0, ...r }));
        await c.close(); continue;
      }
      if (mode === "hold-space" || mode === "hold-enter") {   // the OS repeats the key after 500ms while it is held
        const key = mode === "hold-space" ? { key: " ", code: "Space", windowsVirtualKeyCode: 32, text: " " } : { key: "Enter", code: "Enter", windowsVirtualKeyCode: 13, text: "\r" };
        await pg.focus(".cta"); const cdp = await c.newCDPSession(pg);
        await cdp.send("Input.dispatchKeyEvent", { type: "keyDown", ...key }); await pg.waitForTimeout(500);
        for (let k = 0; k < 8; k++) { await cdp.send("Input.dispatchKeyEvent", { type: "keyDown", autoRepeat: true, ...key }); await pg.waitForTimeout(33); }
        await cdp.send("Input.dispatchKeyEvent", { type: "keyUp", key: key.key, code: key.code, windowsVirtualKeyCode: key.windowsVirtualKeyCode });
      } else if (mode === "dblclick") { await pg.click(".cta"); await pg.waitForTimeout(120); await pg.click(".cta", { force: true }); }
      else if (mode.startsWith("click") || mode === "reduced-click" || mode === "back" || mode.startsWith("stop")) await pg.click(".cta");
      else if (mode === "cue") await pg.evaluate(() => document.querySelector(".porta__cue").click());
      else if (mode === "enter" || mode === "space" || mode === "tab") { await pg.focus(".cta"); await pg.keyboard.press(mode === "enter" ? "Enter" : mode === "space" ? " " : "Tab"); }
      if (mode.startsWith("stop")) {
        await pg.waitForTimeout(500);
        if (mode === "stop-wheel") { await pg.mouse.move(w / 2, h / 2); await pg.mouse.wheel(0, -40); }
        else if (mode === "stop-key") await pg.keyboard.press("Shift");
        else if (mode === "stop-pointer") await pg.mouse.click(w / 2, h / 2);
        else { const cdp = await c.newCDPSession(pg); await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: w / 2, y: h / 2 }] }); await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] }); }
        await pg.waitForTimeout(250);
        const y1 = await pg.evaluate(() => scrollY); await pg.waitForTimeout(1300);
        const r = await pg.evaluate(STATE);
        const ok = Math.abs(r.y - y1) < 1 && r.y < r.listY - 50 && r.active !== "email" && !errs.length;
        report(ok, n, mode, theme, JSON.stringify({ yAfterStop: Math.round(y1), yLater: r.y, listY: r.listY, active: r.active, errs }));
        await c.close(); continue;
      }
      await pg.waitForTimeout(2200);
      if (mode === "back") {
        await pg.mouse.move(w / 2, h / 2);
        for (let k = 0; k < 40; k++) { await pg.mouse.wheel(0, -120); await pg.waitForTimeout(16); }
        await pg.waitForTimeout(1000);
        const r = await pg.evaluate(() => { const q = (s) => document.querySelector(s), cs = (e) => getComputedStyle(e), i = q(".intro");
          return { y: scrollY, o: cs(i).opacity, t: cs(i).transform, inline: i.getAttribute("style") || "", scene: cs(q(".scene")).transform, leaf: cs(q(".leaf--l")).transform, light: cs(q(".leaf__shade")).opacity }; });
        report(r.y <= 0 && r.o === "1" && r.t === "none" && !/opacity|transform/.test(r.inline) && r.scene === "none" && r.leaf === "none" && r.light === "0" && !errs.length, n, mode, theme, JSON.stringify(r));
        await c.close(); continue;
      }
      const fr = await pg.evaluate(() => __fr), r = await pg.evaluate(STATE);
      const ys = fr.map((f) => f[1]), moving = []; for (let i = 1; i < fr.length; i++) if (ys[i] !== ys[i - 1]) moving.push(i);
      const backwards = fr.some((f, i) => i && f[1] < fr[i - 1][1] - 0.5);
      const dur = moving.length ? fr[moving[moving.length - 1]][0] - fr[moving[0] - 1][0] : 0;
      const Smax = Math.max(...fr.map((f) => f[2]));
      const mids = fr.filter((f) => f[2] > 1.001 && f[2] < Smax - 0.001).length;
      const land = r.active === "email" && r.emailInView && r.titleInView && Math.abs(r.y - r.listY) <= 2 && !errs.length;
      let ok, info = { active: r.active, emailInView: r.emailInView, titleInView: r.titleInView, y: r.y, listY: r.listY, seq: r.seq };
      // a stall: three or more frames without movement in the middle of the flight (a restart from rest)
      let stall = 0, run0 = 0; for (let i = moving[0] || 0; i < (moving[moving.length - 1] || 0); i++) { run0 = ys[i + 1] === ys[i] ? run0 + 1 : 0; stall = Math.max(stall, run0); }
      if (["click", "enter", "space", "cue", "click-en", "click-other", "click-sun", "hold-space", "hold-enter", "dblclick"].includes(mode)) {
        ok = land && !backwards && moving.length >= 40 && mids >= 15 && dur >= 900 && dur <= 1100 && stall < 3;   /* --dur-flight 1000ms since 9 Nov (shorter) */
        Object.assign(info, { scrollFrames: moving.length, flightMs: dur, sceneMidFrames: mids, S: Smax, backwards, stall, theme: await pg.evaluate(() => document.documentElement.dataset.theme) });
      } else {   // tab, reduced motion, hash: a jump, never a replay
        const distinct = [...new Set(ys.map(Math.round))].length;
        ok = (mode === "tab" ? r.active === "email" && r.emailInView && r.titleInView : land || (mode === "hash" && r.titleInView && r.emailInView)) && distinct <= 2 && mids === 0;
        Object.assign(info, { distinctScroll: distinct, sceneMidFrames: mids });
      }
      report(ok, n, mode, theme, JSON.stringify(info));
      await c.close();
    }
  }
  // fast flicks (since the door finish): the jump rule is the scroll's own change in a frame, never its distance from r,
  // so a fast flick (1500-3500 px/s, a mouse-driven gesture) never cuts the walk-in ahead in one frame. Every frame after
  // the driver wrote it: the largest step of r is at most 0.15 (or the scroll's own largest step in a frame, where that is
// more), and r never jumps to p with a step over 0.1 beyond the scroll's own.
  for (const [n, w, h] of [["m390", 390, 844], ["land", 844, 390]]) for (const sp of [1500, 2500, 3500]) {
    const mobile = w < 900, c = await b.newContext({ viewport: { width: w, height: h }, isMobile: mobile && h > w, hasTouch: mobile });
    await c.addInitScript(() => { try { localStorage.setItem("ab-tema", "dia"); } catch (e) {} });
    const pg = await c.newPage(); await serve.offline(pg); await pg.goto(base, { waitUntil: "networkidle" }); await pg.waitForTimeout(1200);
    const g = await pg.evaluate(() => document.documentElement.__porta.geo());
    await pg.evaluate(() => { window.__rf = []; const d = document.createElement("div"); d.style.cssText = "position:fixed;left:0;top:0;width:1px;height:1px;pointer-events:none;opacity:0"; document.body.appendChild(d);
      new ResizeObserver(() => { const g = document.documentElement.__porta.geo(); __rf.push([scrollY, g.r, g.p]); }).observe(d);
      let k = 0; const L = () => { d.style.width = (1 + (k++ % 2)) + "px"; if (__rf.length < 1500) requestAnimationFrame(L); }; requestAnimationFrame(L); });
    const cdp = await c.newCDPSession(pg);
    await cdp.send("Input.synthesizeScrollGesture", { x: Math.round(w / 2), y: Math.round(h * 0.8), yDistance: -Math.round(g.pin + g.run * 0.9), speed: sp, gestureSourceType: "mouse", preventFling: true });
    await pg.waitForTimeout(1200);
    const rf = await pg.evaluate(() => __rf);
    let step = 0, dp = 0, snaps = [];
    for (let i = 1; i < rf.length; i++) { const dr = Math.abs(rf[i][1] - rf[i - 1][1]); if (dr > step) step = dr; dp = Math.max(dp, Math.abs(rf[i][2] - rf[i - 1][2]));
      if (rf[i][1] === rf[i][2] && dr > 0.1 && dr > Math.abs(rf[i][2] - rf[i - 1][2]) + 0.02) snaps.push([+rf[i - 1][1].toFixed(3), +rf[i][1].toFixed(3)]); }
    const reached = Math.max(...rf.map((f) => f[2]));
    /* r never steps more than 0.15 in a frame, or more than the scroll itself did in its largest frame where that is
       more (844 x 390 at 3500 px/s: the run is 371 px, the scroll moves about 0.16 of it a frame) */
    report(rf.length > 20 && reached > 0.8 && step <= Math.max(0.15, dp + 0.005) && !snaps.length, n, "flick " + sp + " px/s: the walk-in follows, never cut ahead", JSON.stringify({ frames: rf.length, reached: +reached.toFixed(3), maxStep: +step.toFixed(3), scrollMaxStep: +dp.toFixed(3), snaps }));
    await c.close();
  }
  // the colour hand-off, in both themes and on every aspect ratio: the whole frame is --color-hall (list content and
  // footer text excepted) from the moment the screen is one colour (p = flat) to the end, and with the seam on screen.
  // Then the same on the 3D path (?3d=force), walked in by wheel so the canvas has drawn before the
  // flat colour, at 390 x 844, 844 x 390 and 1440 x 900, Dia and Noite, each frame read once r has caught up with p;
  // under the flat colour the canvas and the photograph's layers are both hidden.
  const b3 = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  const HAND = [["m390", 390, 844], ["m430", 430, 932], ["m375", 375, 667], ["se320", 320, 568], ["land", 844, 390], ["tab", 768, 1024], ["d1440", 1440, 900], ["d1920", 1920, 1080], ["wide", 2560, 1080]].map((v) => v.concat([""]))
    .concat([["m390", 390, 844, "?3d=force"], ["land", 844, 390, "?3d=force"], ["d1440", 1440, 900, "?3d=force"]]);
  for (const [n, w, h, q] of HAND) for (const theme of ["dia", "noite"]) {
    const mobile = w < 900, c = await (q ? b3 : b).newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: mobile && h > w, hasTouch: mobile });
    await c.addInitScript((t) => { try { localStorage.setItem("ab-tema", t); } catch (e) {} }, theme);
    const pg = await c.newPage(); await serve.offline(pg); await pg.goto(base + q, { waitUntil: "networkidle" }); await pg.waitForTimeout(1200);
    const g = await pg.evaluate(() => { const d = document.createElement("div"), P = document.documentElement.__porta.geo();
      d.style.cssText = "position:absolute;width:1px;height:1px;background:var(--color-hall)"; document.querySelector(".lista").appendChild(d);
      const tok = getComputedStyle(d).backgroundColor.match(/\d+/g).slice(0, 3).map(Number); d.remove();
      return { pin: P.pin, run: P.run, flat: P.flat, rise: (P.list[0] + P.list[1]) / 2, tok }; });
    let walk = null;
    if (q) {
      await pg.waitForFunction(() => document.documentElement.__porta.geo().d3 === "on", null, { timeout: 60000 }).catch(() => {});
      await pg.mouse.move(w / 2, h / 2);
      let shown = false;
      for (let k = 0; k < 200; k++) {
        await pg.mouse.wheel(0, 40); await pg.waitForTimeout(30);
        const s = await pg.evaluate(() => { const P = document.documentElement.__porta.geo(); return { p: P.p, shown: P.d3shown }; });
        if (s.shown && s.p < g.flat) shown = true;
        if (s.p >= g.flat + 0.01) break;
      }
      await pg.waitForFunction(() => { const P = document.documentElement.__porta.geo(); return P.r === P.p; }, null, { timeout: 8000 }).catch(() => {});
      walk = await pg.evaluate(() => { const c = document.querySelector(".porta__3d"), P = document.documentElement.__porta.geo();
        return { d3: P.d3, canvas: c ? getComputedStyle(c).visibility : "none", scene: getComputedStyle(document.querySelector(".scene")).visibility }; });
      walk.shownBeforeFlat = shown;
    }
    const bad = []; let n0 = 0;
    for (const [label, p] of [["flat", g.flat + 0.002], ["rise", g.rise], ["p100", 1], ["seam", null]]) {
      const y = p === null ? 1e6 : Math.round(g.pin + p * g.run);
      await pg.evaluate((y) => scrollTo(0, y), y); await pg.waitForTimeout(900);
      if (q) await pg.waitForFunction(() => { const P = document.documentElement.__porta.geo(); return P.r === P.p; }, null, { timeout: 8000 }).catch(() => {});
      const skip = await pg.evaluate(() => [...document.querySelectorAll(".lista__inner > *, .foot p")].filter((e) => +getComputedStyle(e).opacity > 0).map((e) => { const r = e.getBoundingClientRect(); return [r.left - 4, r.top - 4, r.right + 4, r.bottom + 4]; }));
      const im = png.decode(await pg.screenshot());
      for (let yy = 0; yy < h; yy++) for (let x = 0; x < w; x++) {
        if (skip.some((r) => x >= r[0] && x <= r[2] && yy >= r[1] && yy <= r[3])) continue;
        n0++; const v = im.px(x, yy); if (v[0] !== g.tok[0] || v[1] !== g.tok[1] || v[2] !== g.tok[2]) bad.push(label + "@" + x + "," + yy + "=" + v.join(","));
      }
    }
    const w3 = !q || (walk.d3 === "on" && walk.shownBeforeFlat && walk.canvas === "hidden" && walk.scene === "hidden");
    report(!bad.length && w3, n, "handoff" + (q ? " 3D" : ""), theme, JSON.stringify({ token: g.tok.join(","), pixels: n0, off: bad.length, first: bad.slice(0, 4), ...(q ? { walk } : {}) }));
    await c.close();
  }
  await b3.close();
  // short portrait phones: the first screen holds the whole photograph down to its steps, and the cue is whole or absent
  for (const [n, w, h] of [["se320", 320, 568], ["se375", 375, 553], ["m375", 375, 667], ["m390s", 390, 664]]) for (const page of ["", "en/"]) {
    const c = await b.newContext({ viewport: { width: w, height: h }, isMobile: true, hasTouch: true }); const pg = await c.newPage(); await serve.offline(pg);
    await pg.goto(base + page, { waitUntil: "networkidle" }); await pg.waitForTimeout(1300);
    const r = await pg.evaluate(() => { const s = document.querySelector(".scene").getBoundingClientRect(), i = document.querySelector(".porta__cue svg").getBoundingClientRect(),
      cue = getComputedStyle(document.querySelector(".porta__cue")), shown = cue.visibility !== "hidden" && i.height > 0;
      return { floor: Math.round(s.bottom), ih: innerHeight, cue: shown ? [Math.round(i.top), Math.round(i.bottom)] : "none" }; });
    const sliced = r.cue !== "none" && r.cue[0] < r.ih && r.cue[1] > r.ih + 0.5;
    report(r.floor <= r.ih && !sliced, n, "rest" + (page ? "-en" : ""), JSON.stringify(r));
    await c.close();
  }
  await geometry(b, base, report);
  console.log("cta", fail ? "FAILED" : "ok"); await b.close(); srv.close(); process.exit(fail ? 1 : 0);
})();

// First-screen geometry and the identity in the DOM (the vertical lockup is taller per em
// than the old one, and where the text column sets the stage's row (short split windows, landscape phones) the
// photograph grew with it and the cue left the screen, and no test noticed). At each size below, on a first visit (no
// stored theme, the clock at noon in Torres Vedras, so the theme is Dia and the sun note shows; PT), .scene, .entrance,
// .cta and the cue's icon (its box, or its absence) are compared with stored values, 0.5px either way. The stored
// values are cb77856's (the old lockup) for the scene, the entrance and the cue at every size (the two builds measure
// within 0.05px of each other); the action is cb77856's too except where the window has the height for the larger
// lockup (1280 x 561: 7.8px lower; 1440 x 900: 20.6px lower), where it is this build's.
// Then, on every page (home PT and EN, privacy PT and EN, 404): one crest (svg.crest), aria-hidden and not focusable;
// the drawn wordmark aria-hidden; the lockup reads «A Brazileira» then «Boutique Hotel», and nothing of Torres Vedras;
// on the home pages the h1 is the lockup and its accessible name starts «A Brazileira»; no <img> and no CSS background
// anywhere names the identity's source images or a raster of the crest (the crest is drawn inline, never a bitmap).
// GEO_ONLY=1 runs this part alone; GEO_WRITE=1 prints the measured table (to refresh the stored values).
const GEO = {
  // size: [scene x, y, w, h], [entrance], [cta], cue icon [x, y, w, h] or null (not shown)
  "568x320": [[278.38,73.86,259.45,286.17], [278.38,69.25,259.45,290.78], [48.73,268.03,179.08,44], [393.09,375.28,20,12.5]],
  "667x375": [[352.42,69.27,252.45,278.45], [323.66,69.25,310,278.47], [72.95,255.72,179.08,44], [463.66,362.97,20,12.5]],
  "740x360": [[406.45,69.27,248.45,274.03], [357.05,69.25,347.28,274.05], [90.81,251.28,179.08,44],null],
  "844x390": [[476.13,69.27,257.38,283.88], [404.63,69.25,400.38,283.89], [116.27,261.11,179.08,44], [589.81,368.39,20,12.5]],
  "932x430": [[523.05,69.27,288.97,318.73], [444.89,69.25,445.3,318.75], [128.69,279.17,197.31,44], [651.53,403.25,20,12.5]],
  "320x568": [[49.05,313.36,229.95,253.64], [12,310.03,296,256.97], [70.45,250.03,179.08,44],null],
  "375x667": [[72.58,354.25,238.22,262.75], [12,351.38,351,265.63], [97.95,287.38,179.08,44], [180.5,638.13,14,8.75]],
  "390x844": [[27.89,403.95,346.38,382.05], [12.47,415.05,365.06,370.95], [105.45,335.63,179.08,44], [188,811.13,14,8.75]],
  "1024x520": [[573.55,105.27,336.55,371.2], [504.42,105.25,474.81,371.22], [143.94,368.45,197.31,44], [726.83,499.72,20,12.5]],
  "1280x525": [[755.42,105.27,337.72,372.5], [621.53,105.25,605.52,372.52], [197.05,369.75,216.39,44], [908.28,501.02,20,12.5]],
  "1280x561": [[743.98,105.27,360.59,397.73], [621.53,105.25,605.52,397.75], [197.05,394.98,216.39,44], [908.28,526.25,20,12.5]],
  "1920x589": [[1141.69,118.42,379.53,418.63], [928.91,118.41,805.09,418.64], [399.8,415.56,243.3,49.5], [1313.2,563.08,22.5,14.06]],
  "2560x669": [[1494.13,120.77,438.47,483.63], [1243.72,120.75,939.28,483.64], [626.42,462.63,283.86,57.75], [1692.23,634.59,26.25,16.41]],
  "1440x900": [[698.34,92.02,679.95,749.98], [694.73,92,687.19,750], [236.2,581.09,216.39,44], [1016.33,865.25,20,12.5]],
};
async function geometry(b, base, report) {
  const out = {};
  for (const key of Object.keys(GEO)) {
    const [w, h] = key.split("x").map(Number), mob = w < 900 || h < 500;
    const c = await b.newContext({ viewport: { width: w, height: h }, isMobile: mob && w < h, hasTouch: mob });
    const pg = await c.newPage(); await serve.offline(pg); await pg.clock.install({ time: new Date("2026-11-10T12:00:00Z") });
    await pg.goto(base, { waitUntil: "networkidle" }); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(1300);
    const m = await pg.evaluate(() => {
      const R = (e) => { const r = e.getBoundingClientRect(); return [r.left, r.top, r.width, r.height].map((v) => +v.toFixed(2)); };
      const q = (s) => document.querySelector(s), cue = q(".porta__cue"), icon = cue.firstElementChild, cs = getComputedStyle(cue);
      const shown = cs.visibility !== "hidden" && cs.display !== "none" && icon.getBoundingClientRect().height > 0;
      return [R(q(".scene")), R(q(".entrance")), R(q(".cta")), shown ? R(icon) : null];
    });
    out[key] = m;
    if (!process.env.GEO_WRITE && GEO[key]) {
      const e = GEO[key], names = ["scene", "entrance", "cta", "cue"], off = [];
      names.forEach((n, i) => {
        if ((e[i] === null) !== (m[i] === null)) off.push(n + (e[i] === null ? " shown, expected absent" : " absent, expected shown"));
        else if (e[i]) e[i].forEach((v, j) => { if (Math.abs(v - m[i][j]) > 0.5) off.push(n + "[" + j + "] " + m[i][j] + " (expected " + v + ")"); });
      });
      report(!off.length, key, "first-screen geometry", off.length ? off.join("; ") : "scene " + m[0].join(",") + " cue " + (m[3] ? m[3].join(",") : "none"));
    }
    await c.close();
  }
  if (process.env.GEO_WRITE) console.log(JSON.stringify(out));
  for (const page of ["", "en/", "privacidade/", "en/privacy/", "404.html"]) {
    const c = await b.newContext({ viewport: { width: 390, height: 844 } }); const pg = await c.newPage(); await serve.offline(pg);
    await pg.goto(base + page, { waitUntil: "networkidle" });
    const r = await pg.evaluate(() => {
      const crests = [...document.querySelectorAll("svg.crest")], lk = document.querySelector(".lockup"), name = document.querySelector(".lockup__name");
      const text = lk ? lk.textContent.replace(/\s+/g, " ").trim() : "";
      const raster = /identity|board|quadro|crest[^/]*\.(png|jpe?g|webp|avif)|monogram[^/]*\.(png|jpe?g|webp|avif)/i;
      const imgs = [...document.images].map((i) => i.currentSrc || i.src).filter((u) => raster.test(u));
      const bgs = [...document.querySelectorAll("*")].map((e) => getComputedStyle(e).backgroundImage).filter((v) => v !== "none" && raster.test(v));
      return { crests: crests.length, hidden: crests.every((s) => s.getAttribute("aria-hidden") === "true" && s.getAttribute("focusable") === "false"),
        name: !!name && name.getAttribute("aria-hidden") === "true", text, h1lockup: !!document.querySelector("h1.lockup"), imgs, bgs };
    });
    const home = page === "" || page === "en/";
    const h1 = home ? await pg.getByRole("heading", { level: 1, name: /^A Brazileira/ }).count() : 1;
    const ok = r.crests === 1 && r.hidden && r.name && /^A Brazileira\W+Boutique Hotel$/.test(r.text) && !/torres/i.test(r.text)
      && (!home || (r.h1lockup && h1 === 1)) && !r.imgs.length && !r.bgs.length;
    report(ok, page || "home", "identity in the DOM", JSON.stringify({ ...r, h1 }));
    await c.close();
  }
}
