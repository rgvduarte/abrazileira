// The hero action «Entrar na lista de espera» (and the scroll cue) walks in through the door: an animated flight
// of the scroll, driven by the one JS loop, that lands on the list with the email focused.
// Usage: node src/tests/cta.test.js docs
// Per viewport (390 x 844 touch, 1440 x 900 mouse):
//   click, Enter, Space, scroll cue: the scroll moves only forwards over many frames (no jump), the scene plays
//     (scale strictly between 1 and S on the way), the flight lasts 1.2-1.7 s, it lands with the list title and
//     the email field in view and the focus in the email field;
//   interrupted by a wheel turn, a touch, a key press or a pointer press mid-flight: the flight stops at once,
//     nothing moves the page afterwards and the focus is not moved;
//   Tab from the action: lands on the email with the list in view, without replaying the sequence;
//   reduced motion: the same landing at once (at most 2 scroll positions, no intermediate frame);
//   #lista on load: a jump to the list, never a replay;
//   after a flight, wheeling all the way back up leaves the hero at its exact rest state (no inline style left).
setTimeout(() => { console.log("TIMEOUT"); process.exit(2); }, 600000);
const { chromium } = require("playwright"), serve = require("./serve.js");
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
  for (const [n, w, h] of [["m390", 390, 844], ["d1440", 1440, 900]]) {
    const mobile = w < 900;
    for (const mode of ["click", "enter", "space", "cue", "tab", "stop-wheel", "stop-key", "stop-pointer", mobile ? "stop-touch" : null, "reduced-click", "hash", "back"]) {
      if (!mode) continue;
      const c = await b.newContext({ viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile, reducedMotion: mode === "reduced-click" ? "reduce" : "no-preference" });
      const pg = await c.newPage(); await serve.offline(pg); const errs = []; pg.on("pageerror", (e) => errs.push(String(e)));
      if (mode === "hash") { await c.addInitScript(REC); await pg.goto(base + "#lista", { waitUntil: "networkidle" }); await pg.waitForTimeout(1500); }
      else { await pg.goto(base, { waitUntil: "networkidle" }); await pg.waitForTimeout(1300); await pg.evaluate(REC); }
      if (mode === "click" || mode === "reduced-click" || mode === "back" || mode.startsWith("stop")) await pg.click(".cta");
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
        report(ok, n, mode, JSON.stringify({ yAfterStop: Math.round(y1), yLater: r.y, listY: r.listY, active: r.active, errs }));
        await c.close(); continue;
      }
      await pg.waitForTimeout(2200);
      if (mode === "back") {
        await pg.mouse.move(w / 2, h / 2);
        for (let k = 0; k < 40; k++) { await pg.mouse.wheel(0, -120); await pg.waitForTimeout(16); }
        await pg.waitForTimeout(1000);
        const r = await pg.evaluate(() => { const q = (s) => document.querySelector(s), cs = (e) => getComputedStyle(e), i = q(".intro");
          return { y: scrollY, o: cs(i).opacity, t: cs(i).transform, inline: i.getAttribute("style") || "", scene: cs(q(".scene")).transform, light: cs(q(".hall__light")).opacity }; });
        report(r.y <= 0 && r.o === "1" && r.t === "none" && !/opacity|transform/.test(r.inline) && r.scene === "none" && r.light === "0" && !errs.length, n, mode, JSON.stringify(r));
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
      if (["click", "enter", "space", "cue"].includes(mode)) {
        ok = land && !backwards && moving.length >= 40 && mids >= 20 && dur >= 1200 && dur <= 1700;
        Object.assign(info, { scrollFrames: moving.length, flightMs: dur, sceneMidFrames: mids, S: Smax, backwards });
      } else {   // tab, reduced motion, hash: a jump, never a replay
        const distinct = [...new Set(ys.map(Math.round))].length;
        ok = (mode === "tab" ? r.active === "email" && r.emailInView && r.titleInView : land || (mode === "hash" && r.titleInView && r.emailInView)) && distinct <= 2 && mids === 0;
        Object.assign(info, { distinctScroll: distinct, sceneMidFrames: mids });
      }
      report(ok, n, mode, JSON.stringify(info));
      await c.close();
    }
  }
  console.log("cta", fail ? "FAILED" : "ok"); await b.close(); srv.close(); process.exit(fail ? 1 : 0);
})();
