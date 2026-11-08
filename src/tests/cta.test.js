// The hero action «Entrar na lista de espera» (and the scroll cue) walks in through the door: an animated flight
// of the scroll, driven by the one JS loop, that lands on the list with the email focused.
// Usage: node src/tests/cta.test.js docs
// Per viewport (390 x 844 touch, 1440 x 900 mouse):
//   click, Enter, Space, scroll cue: the scroll moves only forwards over many frames (no jump), the scene plays
//     (scale strictly between 1 and S on the way), the flight lasts 1.1-1.3 s, it lands with the list title and
//     the email field in view and the focus in the email field;
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
// (320 x 568, 375 x 553) the door stands on the floor line inside the first screen and the scroll cue is never sliced
// by the screen's edge.
setTimeout(() => { console.log("TIMEOUT"); process.exit(2); }, 600000);
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
          return { y: scrollY, o: cs(i).opacity, t: cs(i).transform, inline: i.getAttribute("style") || "", scene: cs(q(".scene")).transform, light: cs(q(".hall__light")).opacity }; });
        report(r.y <= 0 && r.o === "1" && r.t === "none" && !/opacity|transform/.test(r.inline) && r.scene === "none" && r.light === "0" && !errs.length, n, mode, theme, JSON.stringify(r));
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
        ok = land && !backwards && moving.length >= 40 && mids >= 20 && dur >= 1100 && dur <= 1300 && stall < 3;
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
  // the colour hand-off, in both themes and on every aspect ratio: the whole frame is --color-hall (list content and
  // footer text excepted) from the moment the screen is one colour (p = flat) to the end, and with the seam on screen
  for (const [n, w, h] of [["m390", 390, 844], ["m430", 430, 932], ["m375", 375, 667], ["se320", 320, 568], ["land", 844, 390], ["tab", 768, 1024], ["d1440", 1440, 900], ["d1920", 1920, 1080], ["wide", 2560, 1080]]) for (const theme of ["dia", "noite"]) {
    const mobile = w < 900, c = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: mobile && h > w, hasTouch: mobile });
    await c.addInitScript((t) => { try { localStorage.setItem("ab-tema", t); } catch (e) {} }, theme);
    const pg = await c.newPage(); await serve.offline(pg); await pg.goto(base, { waitUntil: "networkidle" }); await pg.waitForTimeout(1200);
    const g = await pg.evaluate(() => { const d = document.createElement("div"), P = document.documentElement.__porta.geo();
      d.style.cssText = "position:absolute;width:1px;height:1px;background:var(--color-hall)"; document.querySelector(".lista").appendChild(d);
      const tok = getComputedStyle(d).backgroundColor.match(/\d+/g).slice(0, 3).map(Number); d.remove();
      return { pin: P.pin, run: P.run, flat: P.flat, rise: (P.list[0] + P.list[1]) / 2, tok }; });
    const bad = []; let n0 = 0;
    for (const [label, p] of [["flat", g.flat + 0.002], ["rise", g.rise], ["p100", 1], ["seam", null]]) {
      const y = p === null ? 1e6 : Math.round(g.pin + p * g.run);
      await pg.evaluate((y) => scrollTo(0, y), y); await pg.waitForTimeout(900);
      const skip = await pg.evaluate(() => [...document.querySelectorAll(".lista__inner > *, .foot p")].filter((e) => +getComputedStyle(e).opacity > 0).map((e) => { const r = e.getBoundingClientRect(); return [r.left - 4, r.top - 4, r.right + 4, r.bottom + 4]; }));
      const im = png.decode(await pg.screenshot());
      for (let yy = 0; yy < h; yy++) for (let x = 0; x < w; x++) {
        if (skip.some((r) => x >= r[0] && x <= r[2] && yy >= r[1] && yy <= r[3])) continue;
        n0++; const v = im.px(x, yy); if (v[0] !== g.tok[0] || v[1] !== g.tok[1] || v[2] !== g.tok[2]) bad.push(label + "@" + x + "," + yy + "=" + v.join(","));
      }
    }
    report(!bad.length, n, "handoff", theme, JSON.stringify({ token: g.tok.join(","), pixels: n0, off: bad.length, first: bad.slice(0, 4) }));
    await c.close();
  }
  // short portrait phones: the first screen holds the door on its floor line, and the cue is whole or absent
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
  console.log("cta", fail ? "FAILED" : "ok"); await b.close(); srv.close(); process.exit(fail ? 1 : 0);
})();
