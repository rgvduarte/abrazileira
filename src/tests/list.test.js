// The waiting list: arrival, focus and states. Usage: node src/tests/list.test.js docs
// A. A tap or a click into the form never moves the page: at 390 x 844 and 375 x 667 (touch) and
//    1440 x 900 and 1280 x 720 (mouse), resting part-way through the list's rise, at the end of the run and at the
//    end of the page: the first press on the email field or on the button leaves scrollY where it was; the button's
//    first press runs the validation (both messages shown).
// B. The list content is never left invisible where the screen behind it is the flat hall colour: reload with the
//    page restored at the bottom and a jump to the end, on short screens (844 x 390, 932 x 430, 667 x 375,
//    720 x 450 = 1440 x 900 at 200%) and tall ones; and every rest position from the flat moment to the end of the
//    page (title, sentence and form opacity > 0 while on screen, 1 from the end of the run on).
// C. The hero is reachable in about one screen: the scroll from the top until the list title and the email field are
//    fully in view and readable (opacity >= 0.99) is 0.6-1.0 viewport heights (0.9-1.2 before the 9 Nov shorter walk-in).
// D. States: a failed send offers the house's address as a real mailto link; the success line sits where the field
//    was (not floating in the form's box) and does not repeat the sentence above it.
// E. The sun note: with no stored choice, the sky over Torres Vedras decides (a system dark mode does not override
//    it); the note is visible on phones too, in the serif, and never touches the crest.
// F. The walk-in is fluid on portrait screens: the doorway's foot, sampled every 0.004 of progress from 0.3 to 0.6
//    (settled), never changes speed by more than 1.8px from one step to the next (1.5px before the 9 Nov shorter
//    walk-in compressed the same curve; the camera's rise was clipped, a bob of about 6px per step).
// G. The list stays at rest when the screen changes size under it: a keyboard that resizes the page (focus in the
//    email field at the end of the run and at the page end, the page 300px shorter, then back) and a rotation round
//    trip: the field stays opaque and in view, and the page comes back where it was.
// H. The doors start on the first pixel, also where the stage first scrolls to its pin (390 x 664: stick < 0).
// I. No pale pinstripe round the doors at rest (before: the page colour showed through along the hinges and the
//    head): at 393 x 852 @3, 844 x 390 @3, 1440 x 900 @2 and 768 x 1024 @2, Dia, with the layers as loaded and
//    promoted, no unsaturated pixel within 1.5 device px of the doorway's edge is 40 levels brighter than the walnut
//    3px either side of it (brass hinges and the gap excepted).
// J. Where the scroll stops the block (title to button) stands in the middle of what the visitor sees (centred in the
//    page's height): at 320 x 568, 375 x 667, 390 x 844, 390 x 796,
//    430 x 932, 768 x 1024, 1024 x 768, 1440 x 900 and 1920 x 1080, Dia and Noite, PT and EN, settled, at
//    the end of the run and at the end of the page. Where the block and the footer fit on one screen (16px between
//    them), the page ends one large viewport after the run, and there the block is within 8px of the middle when the
//    footer fits under it with 32px clear; otherwise it stands 16-32px above the footer, the title on screen and the
//    field whole (320 x 568, 375 x 667: the page went on 100px and 51px before, the title cut by the top). Taller than
//    that: where the run ends the block starts 16px from the top, the field whole. Opaque. (Landscape phones: L.)
//    An iPhone with Safari's bars, emulated (serve.ios: stylesheets served with svh, lvh, dvh in px; headless Chromium
//    has svh = lvh = dvh): 390 wide, 796 shown / 836 hidden (Safari 26), 393 x 695 / 735, 375 x 553 / 627 (SE):
//    with the bars shown the page ends 40px (74px) after the run, with them hidden at the run's end; in both, where the
//    scroll stops, the same rule as above; the hero action's flight and #lista on load land there, the focus in the
//    field. Before, the block was 40px (bars shown) and 20px (hidden) high there.
//    The hero action's flight in Chromium (390 x 796, 1440 x 900): centred, focus in the field; the messages of a failed
//    check lengthen the form downwards (the title and the field do not move).
// K. Reduced motion and no JavaScript (390 x 844, 1440 x 900): the list starts at the photograph's foot (no void), and
//    arriving with #lista its block is in the middle (8px; 16px without JavaScript, where its height is a guess).
// L. Landscape phones: the whole block (title, sentence, field, consent, button) on screen where the scroll stops, the
//    title whole, never cut (before: at 844 x 390 the block and the footer were 428px together, the page went on 69px
//    past the run and its end showed the title cut by the top; with Safari's bars, by 104px). At 844 x 390,
//    932 x 430, 812 x 375, 667 x 375, 568 x 320 and 720 x 450 (1440 x 900 at 200%), and on emulated iPhones in
//    Safari (serve.ios, with the safe areas of the notched ones: 47 / 59 / 44px left and right, 21px below) with the
//    bars shown (844 x 340, 932 x 380, 812 x 325, 667 x 325, 568 x 270) and hidden; PT and EN, Dia (Noite at 844 x 390):
//    at the page's end, at the run's end where that is the page's end, after the hero action's flight (the focus in the
//    field) and on #lista on load: the block whole and opaque, within 8px of the middle of what is seen between the
//    safe areas, or at least 16px from both edges where it is too tall for that; the footer whole on the same screen,
//    its lines clear of the block's words (beside the sentence, under it); the field and the button 44px or more and
//    the field's text 16px or more; a tap on the button's centre and on the footer's link reaches them. With the bars
//    shown the page ends 50px after the run (the bars' height), and that is where the scroll stops.
//    The footer during the run (844 x 390, 667 x 375, 568 x 320, an iPhone 844 wide with the bars hidden and shown): it
//    scrolls into the last screen before the flat moment (844 x 390, 667 x 375, bars hidden), and there no pixel of it
//    shows (opacity 0, its link no tap target) until the screen is one colour; opaque, its link live, from 0.87 on;
//    at 390 x 844 (in the flow) never held.
//    A failed check at the page's end (844 x 340 PT and EN, 667 x 325 PT and EN, 812 x 325, 780 x 310, 568 x 320 and
//    844 x 390 in English, 568 x 270 PT): the focus in the field, the field and the button whole on screen; 568 x 270
//    in English (the form from the field to the button is 276px): the field whole and the button's label on screen.
// M. Dia / Noite follows the sun on every visit (the clock pinned in Torres Vedras, 8 Nov 2026: sunrise 07:13 UTC,
//    sunset 17:29 UTC). On every load the first paint is right: data-theme is set once, by the head script, before
//    <body> exists, never changed afterwards, and the first animation frame (before the first paint) already has it.
//    1. A first visit by night opens Noite and by day Dia, with the sun note, in either system scheme, also for a
//       visitor whose earlier visit stored a choice in localStorage («dia» at night, «noite» by day: earlier builds
//       kept it for good); that old key is ignored and removed. 390 x 844 and 1440 x 900.
//    2. A choice holds for the visit while the sun stays on the same side of the horizon: by day, Noite pressed;
//       a reload, then the English page: Noite, no sun note, the choice in sessionStorage (never in localStorage);
//       a new tab (a new visit): Dia again, by the sky.
//    3. A choice lapses when the sun rises or sets: Dia pressed back by day at 17:20 (Noite, then Dia); a reload at
//       17:25 keeps it; at sunset, with the page open, the lamps come on by themselves (Noite, the sun note, the
//       choice dropped); a reload then: Noite. The same choice with the clock moved past sunset while the page sleeps
//       (no timer runs): the reload opens Noite. Noite pressed by day, reopened by day the next day: Dia (a choice
//       is for that day or night only, not for the next one of the same kind).
//    4. Back from the back/forward cache (replayed: headless Chromium does not restore from it here): the home page by
//       day (Dia, the sun note); Noite pressed on the privacy notice in the same visit, the value it stored written into
//       the home page's sessionStorage, then pageshow (persisted) and visibilitychange: Noite, no sun note; Dia pressed
//       there next: Dia as a choice, no note; no choice left: the sky, with the note; a reload: the same.
//    SUN_ONLY=1 runs this part alone; SUN_SHOTS=<dir> saves a screenshot of each state there.
setTimeout(() => { console.log("TIMEOUT"); process.exit(2); }, 900000);
const { chromium } = require("playwright"), serve = require("./serve.js"), choose = require("./theme.js");
const [, , dir] = process.argv;
(async () => {
  const { srv, base } = await serve(dir); const b = await chromium.launch(); let fail = 0;
  const report = (ok, ...a) => { if (!ok) fail++; console.log(ok ? "PASS" : "FAIL", ...a); };
  if (process.env.SUN_ONLY) { await sun(b, base, report); console.log("list", fail ? "FAILED" : "ok"); await b.close(); srv.close(); process.exit(fail ? 1 : 0); }
  const ctx = async (w, h, o = {}) => { const m = w < 900, c = await b.newContext({ viewport: { width: w, height: h }, isMobile: m && h > w, hasTouch: m, ...o });
    if (o.theme !== null) await choose(c, o.theme || "dia", dir); return c; };
  const geo = (pg) => pg.evaluate(() => { const P = document.documentElement.__porta.geo(); return { ...P, listY: Math.round(document.getElementById("lista").getBoundingClientRect().top + scrollY), max: document.documentElement.scrollHeight - innerHeight }; });

  // A. tap / click focus never jumps
  for (const [n, w, h] of [["m390", 390, 844], ["m375", 375, 667], ["d1440", 1440, 900], ["d1280", 1280, 720]]) {
    const touch = w < 900;
    for (const where of ["rise", "end-of-run", "page-end"]) for (const what of ["email", "button"]) {
      const c = await ctx(w, h); const pg = await c.newPage(); await serve.offline(pg); const errs = []; pg.on("pageerror", (e) => errs.push(String(e)));
      await pg.goto(base, { waitUntil: "networkidle" }); await pg.waitForTimeout(1000);
      const g = await geo(pg);
      const y = where === "rise" ? Math.round(g.pin + 0.9 * g.run) : where === "end-of-run" ? g.listY : g.max;
      // arrive by hand: wheel or finger, not a jump
      if (touch) { const cdp = await c.newCDPSession(pg);   /* finger drags of up to 60% of the screen, 20px a frame, no fling */
        const T = (type, pts) => cdp.send("Input.dispatchTouchEvent", { type, touchPoints: pts });
        for (let guard = 0; guard < 12; guard++) { const left = y - await pg.evaluate(() => scrollY); if (left < 3) break;
          if (left < 40) { await pg.evaluate((d) => scrollBy(0, d), left); break; }   /* a drag that short would be a tap */
          const s = Math.min(Math.round(h * 0.6), left), x0 = 6, y0 = Math.round(h * 0.8);   /* in the gutter: never on a link */
          await T("touchStart", [{ x: x0, y: y0 }]); for (let m = 20; m < s + 20; m += 20) { await T("touchMove", [{ x: x0, y: y0 - Math.min(m, s) }]); await pg.waitForTimeout(16); }
          await pg.waitForTimeout(120); await T("touchEnd", []); await pg.waitForTimeout(150); } }
      else { await pg.mouse.move(w / 2, h / 2); let d = 0; while (d < y) { const s = Math.min(100, y - d); await pg.mouse.wheel(0, s); d += s; await pg.waitForTimeout(16); } }
      await pg.waitForTimeout(900);
      const sel = what === "email" ? "#email" : ".button";
      const box = await pg.evaluate((s) => { const e = document.querySelector(s), r = e.getBoundingClientRect(), f = document.querySelector(".lista .form");
        return { x: r.left + r.width / 2, y: r.top + r.height / 2, inView: r.top >= 0 && r.bottom <= innerHeight, op: +getComputedStyle(f).opacity, y0: scrollY }; }, sel);
      if (!box.inView || box.op < 0.5) { console.log("SKIP", n, where, what, "not on screen here", JSON.stringify(box)); await c.close(); continue; }
      if (touch) await pg.touchscreen.tap(box.x, box.y); else await pg.mouse.click(box.x, box.y);
      await pg.waitForTimeout(700);
      const r = await pg.evaluate(() => ({ y: scrollY, active: document.activeElement && (document.activeElement.id || document.activeElement.className),
        invalid: document.getElementById("email").getAttribute("aria-invalid"), emailMsg: !document.getElementById("email-msg").hidden, consentMsg: !document.getElementById("consent-msg").hidden }));
      const still = Math.abs(r.y - box.y0) <= 1;
      const ok = still && !errs.length && (what === "email" ? r.active === "email" : r.invalid === "true" && r.emailMsg && r.consentMsg);
      report(ok, n, "A tap/click", what, "at", where, JSON.stringify({ y0: Math.round(box.y0), y: Math.round(r.y), ...r, errs }));
      await c.close();
    }
  }

  // B. never invisible on the flat colour; restored and jumped positions
  for (const [n, w, h] of [["l844", 844, 390], ["l932", 932, 430], ["l667", 667, 375], ["z200", 720, 450], ["m390", 390, 844], ["d1440", 1440, 900]]) {
    const c = await ctx(w, h); const pg = await c.newPage(); await serve.offline(pg);
    await pg.goto(base, { waitUntil: "networkidle" }); await pg.waitForTimeout(800);
    const g = await geo(pg);
    const look = () => pg.evaluate(() => { const q = (s) => document.querySelector(s), o = (s) => +getComputedStyle(q(s)).opacity, R = (s) => q(s).getBoundingClientRect();
      const on = (s) => { const r = R(s); return r.bottom > 0 && r.top < innerHeight; };
      return { y: Math.round(scrollY), title: [o(".lista__title"), on(".lista__title")], lede: [o(".lista__lede"), on(".lista__lede")], form: [o(".lista .form"), on(".lista .form")] }; });
    const bad = [];
    // every rest position from the flat moment to the page end
    const ys = []; for (let k = 0; k <= 10; k++) ys.push(Math.round(g.pin + g.flat * g.run + (g.max - g.pin - g.flat * g.run) * k / 10));
    for (const y of ys) {
      await pg.evaluate((y) => scrollTo(0, y), y); await pg.waitForTimeout(500); const r = await look();
      for (const k of ["title", "lede", "form"]) { const [op, on] = r[k];
        if (on && op <= 0) bad.push(k + "@" + r.y + " invisible");
        if (on && r.y >= g.listY - 1 && op < 0.999) bad.push(k + "@" + r.y + " op " + op); }
    }
    // reload with the position restored at the bottom
    await pg.evaluate(() => scrollTo(0, document.documentElement.scrollHeight)); await pg.waitForTimeout(400);
    await pg.reload({ waitUntil: "networkidle" }); await pg.waitForTimeout(1200);
    const rr = await look();
    for (const k of ["title", "lede", "form"]) if (rr[k][1] && rr[k][0] < 0.999) bad.push("reload " + k + " op " + rr[k][0]);
    report(!bad.length && rr.y > g.listY - 2, n, "B list visible at rest (flat moment to page end, reload at the bottom)", JSON.stringify({ reloadY: rr.y, listY: g.listY, bad: bad.slice(0, 5) }));
    await c.close();
  }

  // C. scroll from the top to the readable form, in viewport heights  (0.6-1.0 since the 9 Nov shorter walk-in; it was 0.9-1.2)
  for (const [n, w, h] of [["m390", 390, 844], ["m430", 430, 932], ["m375", 375, 667], ["land", 844, 390], ["d1440", 1440, 900], ["d1920", 1920, 1080]]) {
    const c = await ctx(w, h); const pg = await c.newPage(); await serve.offline(pg); await pg.goto(base, { waitUntil: "networkidle" }); await pg.waitForTimeout(800);
    const g = await geo(pg);
    const ok = (y) => pg.evaluate(async (y) => { scrollTo(0, y); await new Promise((r) => setTimeout(r, 450));
      const q = (s) => document.querySelector(s), t = q(".lista__title").getBoundingClientRect(), e = q("#email").getBoundingClientRect();
      return t.top >= 0 && e.bottom <= innerHeight && [".lista__title", ".lista__lede", ".lista .form"].every((s) => +getComputedStyle(q(s)).opacity >= 0.99); }, y);
    let lo = Math.round(g.pin + 0.5 * g.run), hi = g.listY;
    const reach = await ok(hi);
    while (reach && hi - lo > 2) { const mid = Math.round((lo + hi) / 2); if (await ok(mid)) hi = mid; else lo = mid; }
    const vh = +(hi / h).toFixed(3);
    report(reach && vh >= 0.6 && vh <= 1.0, n, "C scroll to the readable form", JSON.stringify({ px: hi, vh, endOfRun: g.listY, endVh: +(g.listY / h).toFixed(3) }));
    await c.close();
  }

  // D. states
  for (const [mode, status] of [["fail", 500], ["ok", 204]]) for (const page of ["", "en/"]) {
    const c = await ctx(390, 844); const pg = await c.newPage();
    await pg.route("**/*", (rt) => { const u = rt.request().url(); if (u.startsWith("http://127.0.0.1")) return rt.continue();
      if (u.includes("/rest/v1/rpc/join_waitlist")) return rt.fulfill({ status, body: status === 500 ? "{}" : "" }); return rt.abort(); });
    await pg.goto(base + page + "#lista", { waitUntil: "networkidle" }); await pg.waitForTimeout(800);
    await pg.fill("#email", "teste@example.com"); await pg.check("#consent", { force: true }); await pg.click(".button"); await pg.waitForTimeout(900);
    const r = await pg.evaluate(() => { const m = document.querySelector(".form__msg"), a = m.querySelector("a"), lede = document.querySelector(".lista__lede"), f = document.querySelector(".lista .form");
      return { state: f.dataset.state, text: m.textContent, mail: a ? a.getAttribute("href") : null, gap: Math.round(m.getBoundingClientRect().top - lede.getBoundingClientRect().bottom), lede: lede.textContent }; });
    const ok = mode === "fail" ? r.state === "error" && r.mail === "mailto:inn@abrazileira.com" && r.text.includes("inn@abrazileira.com")
      : r.state === "done" && r.gap <= 64 && r.text.trim() !== r.lede.trim() && !r.text.includes(r.lede.split(" ").slice(-3).join(" "));
    report(ok, "D", mode, page || "pt", JSON.stringify(r));
    await c.close();
  }

  // E. the sun note
  for (const [n, w, h] of [["se320", 320, 568], ["m375", 375, 667], ["m390", 390, 844], ["land", 844, 390], ["d1440", 1440, 900]]) for (const [when, scheme, want] of [["2026-11-08T21:00:00Z", "light", "noite"], ["2026-11-08T13:00:00Z", "dark", "dia"]]) {
    const c = await ctx(w, h, { theme: null, colorScheme: scheme }); const pg = await c.newPage(); await pg.clock.install({ time: new Date(when) }); await serve.offline(pg);
    await pg.goto(base, { waitUntil: "networkidle" }); await pg.waitForTimeout(1000);
    const r = await pg.evaluate(() => { const n = document.getElementById("sol-note"), e = document.querySelector(".lockup__crest svg"), nr = n.getBoundingClientRect(), er = e.getBoundingClientRect();
      const vis = [...n.children].find((s) => getComputedStyle(s).display !== "none");
      return { theme: document.documentElement.dataset.theme, sol: document.documentElement.hasAttribute("data-sol"), w: Math.round(nr.width), h: Math.round(nr.height), text: vis && vis.textContent,
        font: getComputedStyle(n).fontFamily.split(",")[0], noteBottom: Math.round(nr.bottom), noteRight: Math.round(nr.right), emblemTop: Math.round(er.top), emblemLeft: Math.round(er.left) }; });
    const clear = r.noteBottom <= r.emblemTop || r.noteRight <= r.emblemLeft;
    report(r.theme === want && r.sol && r.w > 100 && r.h >= 16 && /EB Garamond"?$/.test(r.font.replace(/'/g, '"')) && clear, n, "E sun note", scheme, when.slice(11, 16), JSON.stringify(r));
    await c.close();
  }
  // F. camera smoothness on portrait screens
  for (const [n, w, h] of [["m390", 390, 844], ["m664", 390, 664], ["t768", 768, 1024]]) {
    const c = await ctx(w, h); const pg = await c.newPage(); await serve.offline(pg); await pg.goto(base, { waitUntil: "networkidle" }); await pg.waitForTimeout(800);
    const ys = [], ps = [];
    for (let p = 0.3; p <= 0.6001; p += 0.004) {
      const r = await pg.evaluate(async (p) => { const G = document.documentElement.__porta.geo(), y = Math.round(G.pin + p * G.run), want = Math.min(1, Math.max(0, (y - G.pin) / G.run)); scrollTo(0, y);
        let ok = false; for (let i = 0; i < 200 && !ok; i++) { await new Promise((f) => requestAnimationFrame(f)); const g = document.documentElement.__porta.geo(); ok = Math.abs(g.r - want) < 1e-9 && g.r === g.p; }
        return { ok, y: document.querySelector(".ph--hall").getBoundingClientRect().bottom, p: document.documentElement.__porta.geo().r }; }, p);
      if (r.ok) { ys.push(r.y); ps.push(r.p); }
    }
    const v = (i) => (ys[i] - ys[i - 1]) / (ps[i] - ps[i - 1]) * 0.004;     /* px per 0.004 of progress, whatever the rounding of scrollY */
    /* 1.8 (was 1.5) since 9 Nov: the walk-in is shorter (keys 0.34-0.54 instead of 0.36-0.58), so the same curve is
       compressed by 0.91 in p, and a change of speed per step grows by 1 / 0.91^2 = 1.21 */
    let dv = 0, at = 0; for (let i = 2; i < ys.length; i++) { const d = Math.abs(v(i) - v(i - 1)); if (d > dv) { dv = d; at = ps[i]; } }
    report(ys.length >= 70 && isFinite(dv) && dv <= 1.8, n, "F doorway foot: largest change of speed per 0.004 of progress (px)", JSON.stringify({ samples: ys.length, dv: +dv.toFixed(2), at: +at.toFixed(3) }));
    await c.close();
  }

  // G. keyboard resize and rotation with the list at rest
  const look = (pg) => pg.evaluate(() => { const q = (s) => document.querySelector(s), r = q("#email").getBoundingClientRect(); let o = 1; for (let e = q("#email"); e; e = e.parentElement) o *= +getComputedStyle(e).opacity;
    return { y: Math.round(scrollY), op: +o.toFixed(3), top: Math.round(r.top), bottom: Math.round(r.bottom), ih: innerHeight, active: document.activeElement && document.activeElement.id }; });
  for (const [n, w, h, kb] of [["m375", 375, 667, 300], ["m390", 390, 844, 330]]) for (const where of ["end-of-run", "page-end"]) {
    const c = await ctx(w, h); const pg = await c.newPage(); await serve.offline(pg); await pg.goto(base, { waitUntil: "networkidle" }); await pg.waitForTimeout(800);
    const g = await geo(pg); await pg.evaluate((y) => scrollTo(0, y), where === "page-end" ? g.max : g.listY); await pg.waitForTimeout(900);
    const box = await pg.locator("#email").boundingBox(); await pg.touchscreen.tap(box.x + 30, box.y + 20); await pg.waitForTimeout(400);
    const a0 = await look(pg);
    await pg.setViewportSize({ width: w, height: h - kb }); await pg.waitForTimeout(900); const a1 = await look(pg);
    await pg.setViewportSize({ width: w, height: h }); await pg.waitForTimeout(900); const a2 = await look(pg);
    const vis = (r) => r.op >= 0.999 && r.top >= 0 && r.bottom <= r.ih && r.active === "email";
    report(vis(a0) && vis(a1) && vis(a2) && Math.abs(a2.y - a0.y) <= 2, n, "G keyboard resize at", where, JSON.stringify({ a0, a1, a2 }));
    await c.close();
  }
  {
    const c = await ctx(375, 667); const pg = await c.newPage(); await serve.offline(pg); await pg.goto(base, { waitUntil: "networkidle" }); await pg.waitForTimeout(800);
    const g = await geo(pg); await pg.evaluate((y) => scrollTo(0, y), g.listY); await pg.waitForTimeout(900);
    const box = await pg.locator("#email").boundingBox(); await pg.touchscreen.tap(box.x + 30, box.y + 20); await pg.waitForTimeout(400);
    const a0 = await look(pg);
    await pg.setViewportSize({ width: 667, height: 375 }); await pg.waitForTimeout(900); const a1 = await look(pg);
    await pg.setViewportSize({ width: 375, height: 667 }); await pg.waitForTimeout(900); const a2 = await look(pg);
    report(a1.op >= 0.999 && a2.op >= 0.999 && a2.top >= 0 && a2.bottom <= a2.ih && Math.abs(a2.y - a0.y) <= 2, "m375", "G rotation round trip", JSON.stringify({ a0, a1, a2 }));
    await c.close();
  }

  // H. the first pixel moves the doors, also before the stage pins
  for (const [n, w, h] of [["m664", 390, 664], ["m390", 390, 844]]) {
    const c = await ctx(w, h); const pg = await c.newPage(); await serve.offline(pg); await pg.goto(base, { waitUntil: "networkidle" }); await pg.waitForTimeout(800);
    const r = await pg.evaluate(async () => { scrollTo(0, 2); for (let i = 0; i < 60; i++) await new Promise((f) => requestAnimationFrame(f));
      const m = new DOMMatrix(getComputedStyle(document.querySelector(".leaf--l")).transform);
      return { y: scrollY, stick: parseFloat(document.querySelector(".porta__stage").style.getPropertyValue("--stick")) || 0, deg: +(Math.atan2(-m.m13, m.m11) * 180 / Math.PI).toFixed(3) }; });
    report(r.deg > 0.05, n, "H doors move on the first pixels", JSON.stringify(r));
    await c.close();
  }
  // I. the doorway's edge at rest
  const png = require("./png.js");
  for (const [w, h, dpr] of [[393, 852, 3], [844, 390, 3], [1440, 900, 2], [768, 1024, 2]]) for (const promote of [false, true]) {
    const c = await ctx(w, h, { deviceScaleFactor: dpr }); const pg = await c.newPage(); await serve.offline(pg); await pg.goto(base, { waitUntil: "networkidle" }); await pg.waitForTimeout(1200);
    if (promote) await pg.evaluate(() => { for (const s of [".ph--facade", ".scene", ".ph--plate", ".leaf--l", ".leaf--r"]) document.querySelector(s).style.willChange = "transform"; });
    await pg.waitForTimeout(300);
    const s = await pg.evaluate(() => { const r = document.querySelector(".scene").getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
    const clip = { x: s.x + s.w * 0.30, y: s.y + s.h * 0.33, width: s.w * 0.36, height: s.h * 0.53 };
    const im = png.decode(await pg.screenshot({ clip }));
    const P = (x, y) => im.px(Math.max(0, Math.min(im.w - 1, Math.round(x))), Math.max(0, Math.min(im.h - 1, Math.round(y))));
    const L = (x, y) => { const p = P(x, y); return 0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2]; }, Lp = (x, y) => { const p = P(x, y); return p[0] - p[2] > 45 ? 0 : L(x, y); };
    const I = 4 / 2388, ex = (f) => (s.x + f * s.w - clip.x) * dpr, ey = (f) => (s.y + f * s.h - clip.y) * dpr;
    let seams = 0;
    for (const xe of [ex(0.32412 + I), ex(0.6407 - I)]) for (let y = Math.ceil(ey(0.40)); y < ey(0.80); y++) {
      let m = 0; for (let x = Math.floor(xe - 1.5); x <= Math.ceil(xe + 1.5); x++) m = Math.max(m, Lp(x, y));
      const a = L(xe - 3, y), b2 = L(xe + 3, y); if (Math.max(a, b2) <= 110 && m - Math.max(a, b2) > 40) seams++; }
    const top = ey(0.34776 + 4 / 2634), g0 = ex(0.4537), g1 = ex(0.5111);
    for (let x = Math.ceil(ex(0.34)); x < ex(0.625); x++) { if (x > g0 && x < g1) continue;
      let m = 0; for (let y = Math.floor(top - 1.5); y <= Math.ceil(top + 1.5); y++) m = Math.max(m, Lp(x, y));
      const a = L(x, top - 3), b2 = L(x, top + 3); if (Math.max(a, b2) <= 110 && m - Math.max(a, b2) > 40) seams++; }
    report(!seams, `${w}x${h}@${dpr}`, "I doorway edge at rest" + (promote ? " (layers promoted)" : ""), JSON.stringify({ seams }));
    await c.close();
  }
  // J. the block in the middle of what the visitor sees where the scroll stops (the page's end), the footer whole under it
  const AIR = 16, GAP = 32, block = (pg) => pg.evaluate(() => { const q = (s) => document.querySelector(s).getBoundingClientRect(), t = q(".lista__title"), b = q(".lista .button"), e = q("#email"), f = q(".foot");
    const vh = window.visualViewport ? visualViewport.height : innerHeight;
    return { y: Math.round(scrollY), vh, top: +t.top.toFixed(1), bot: +b.bottom.toFixed(1), h: Math.round(b.bottom - t.top), off: +((t.top + b.bottom) / 2 - vh / 2).toFixed(1),
      email: [Math.round(e.top), Math.round(e.bottom)], foot: Math.round(f.height), footTop: Math.round(f.top), footBot: Math.round(f.bottom), max: document.documentElement.scrollHeight - innerHeight,
      op: Math.min(...[".lista__title", ".lista__lede", ".lista .form"].map((s) => +getComputedStyle(document.querySelector(s)).opacity)), active: document.activeElement && document.activeElement.id }; });
  /* where the scroll stops: the block (title to button) and the footer share the screen when they fit together with
     16px between them: then the page ends one large viewport after the run, and there the block is within 8px of the
     middle where the footer fits under it with 32px clear; otherwise it stands 16-32px above the footer, the title on
     screen and the field whole. Too tall for that (844 x 390): where the run ends, the block starts 16px from the top
     with the field whole (or is centred, when it fits alone). */
  const together = (r) => r.h + r.foot + AIR <= r.vh + 0.5;
  const atEnd = (r) => { const gap = r.footTop - r.bot, centred = (r.vh - r.h) / 2 - r.foot >= GAP;
    return r.top >= 0 && r.email[0] >= 0 && r.email[1] <= r.vh && r.footBot <= r.vh + 1 && gap >= AIR - 0.5 && (centred ? Math.abs(r.off) <= 8 : gap <= GAP + 1); };
  const alone = (r) => r.h + 2 * AIR <= r.vh ? Math.abs(r.off) <= 8 : r.top >= 0 && r.top <= AIR + 1 && r.email[0] >= 0 && r.email[1] <= r.vh;
  const walk = async (pg) => { const g = await geo(pg), end = Math.round(g.pin + g.run);
    await pg.evaluate((y) => scrollTo(0, y), end);
    await pg.waitForFunction(() => { const P = document.documentElement.__porta.geo(); return P.r === P.p && P.p === 1; }, null, { timeout: 8000 }).catch(() => {});
    await pg.waitForTimeout(300); const run = await block(pg);
    await pg.evaluate(() => scrollTo(0, 1e6)); await pg.waitForTimeout(400); const pageEnd = await block(pg);
    return { g, end, run, pageEnd }; };
  for (const [n, w, h] of [["se320", 320, 568], ["m375", 375, 667], ["m390", 390, 844], ["m796", 390, 796], ["m430", 430, 932], ["t768", 768, 1024], ["t1024", 1024, 768], ["d1440", 1440, 900], ["d1920", 1920, 1080]])
    for (const theme of ["dia", "noite"]) for (const page of ["", "en/"]) {
      const c = await ctx(w, h, { theme }); const pg = await c.newPage(); await serve.offline(pg); await pg.goto(base + page, { waitUntil: "networkidle" }); await pg.waitForTimeout(800);
      const { g, end, run, pageEnd } = await walk(pg), past = pageEnd.max - end;
      const ok = Math.abs(end - g.listY) <= 1 && run.op >= 0.999 && pageEnd.op >= 0.999 && (together(run) ? past <= 1 && atEnd(pageEnd) : alone(run));
      report(ok, n, "J block centred where the scroll stops", theme, page || "pt",
        JSON.stringify({ end, listY: g.listY, pageEndPastRun: past, together: together(run), run: { top: run.top, bot: run.bot, h: run.h, off: run.off, foot: run.foot }, pageEnd }));
      await c.close();
    }
  /* an iPhone with Safari's bars, emulated (serve.ios): a 390-wide iPhone (796 shown, 836 hidden, Safari 26), a
     393 x 695 / 735 phone and an iPhone SE (375 x 553 / 627). Bars shown, the page ends one large viewport
     after the run, 40px (74px) past it, and the block must be in the middle there, where the scroll stops; bars hidden
     (a finger scroll), the page ends with the run. Before, the block was centred in the small viewport from the
     list's top: 40px high at the page's end with the bars shown, 20px high with them hidden. The hero action's flight
     and #lista land at the page's end, the block centred, the focus in the field. */
  for (const [n, w, sv, lv, themes] of [["ios390", 390, 796, 836, ["dia", "noite"]], ["ios393", 393, 695, 735, ["dia"]], ["iosSE", 375, 553, 627, ["dia"]]])
    for (const bars of ["shown", "hidden"]) for (const theme of themes) for (const page of ["", "en/"]) {
      const vh = bars === "shown" ? sv : lv, c = await ctx(w, vh, { theme, isMobile: true, hasTouch: true }), pg = await c.newPage();
      await serve.offline(pg); await serve.ios(pg, sv, lv, vh); await pg.goto(base + page, { waitUntil: "networkidle" }); await pg.waitForTimeout(800);
      const probe = await pg.evaluate(() => [document.querySelector(".porta__probe").offsetHeight, innerHeight]);
      const { g, end, run, pageEnd } = await walk(pg), past = pageEnd.max - end;
      const ok = probe[0] === sv && probe[1] === vh && Math.abs(end - g.listY) <= 1 && run.op >= 0.999 && pageEnd.op >= 0.999 && together(pageEnd) && Math.abs(past - (lv - vh)) <= 1 && atEnd(pageEnd);
      report(ok, n, "J iPhone, bars " + bars, "block centred where the scroll stops", theme, page || "pt",
        JSON.stringify({ svh: sv, lvh: lv, ih: vh, end, pageEndPastRun: past, run: { top: run.top, off: run.off }, pageEnd }));
      if (theme === "dia") {
        await pg.evaluate(() => scrollTo(0, 0)); await pg.waitForTimeout(500);
        await pg.click(".porta .cta"); await pg.waitForFunction(() => document.activeElement && document.activeElement.id === "email", null, { timeout: 6000 }).catch(() => {});
        await pg.waitForTimeout(500); const f = await block(pg);
        report(f.y === f.max && f.active === "email" && f.op >= 0.999 && atEnd(f), n, "J iPhone, bars " + bars, "the hero action lands where the scroll stops", page || "pt", JSON.stringify(f));
        if (!page) { await pg.goto("about:blank"); await pg.goto(base + "#lista", { waitUntil: "networkidle" }); await pg.waitForTimeout(900); const a = await block(pg);
          report(a.y === a.max && a.op >= 0.999 && atEnd(a), n, "J iPhone, bars " + bars, "#lista on load lands where the scroll stops", JSON.stringify(a));
          /* the address typed again: a jump within the page */
          await pg.evaluate(() => { scrollTo(0, 0); location.hash = ""; }); await pg.waitForTimeout(600); await pg.evaluate(() => { location.hash = "#lista"; }); await pg.waitForTimeout(900); const j = await block(pg);
          report(j.y === j.max && j.op >= 0.999 && atEnd(j), n, "J iPhone, bars " + bars, "a jump to #lista within the page lands where the scroll stops", JSON.stringify(j)); }
      }
      await c.close();
    }
  for (const [n, w, h] of [["m796", 390, 796], ["d1440", 1440, 900]]) {
    const c = await ctx(w, h); const pg = await c.newPage(); await serve.offline(pg); await pg.goto(base, { waitUntil: "networkidle" }); await pg.waitForTimeout(1000);
    await pg.click(".porta .cta"); await pg.waitForFunction(() => document.activeElement && document.activeElement.id === "email", null, { timeout: 5000 }).catch(() => {});
    await pg.waitForTimeout(500);
    const r = await block(pg);
    report(Math.abs(r.off) <= 8 && r.active === "email" && r.op >= 0.999, n, "J the hero action lands with the block centred", JSON.stringify(r));
    // a failed check: the messages lengthen the form downwards; the title and the field stay where they are
    const at = await pg.evaluate(() => [document.querySelector(".lista__title").getBoundingClientRect().top, document.getElementById("email").getBoundingClientRect().top]);
    if (w < 900) await pg.touchscreen.tap(w / 2, (await pg.locator(".lista .button").boundingBox()).y + 20); else await pg.click(".lista .button");
    await pg.waitForTimeout(600);
    const after = await pg.evaluate(() => ({ title: document.querySelector(".lista__title").getBoundingClientRect().top, email: document.getElementById("email").getBoundingClientRect().top,
      msgs: [...document.querySelectorAll(".field__msg")].filter((m) => !m.hidden).length, y: scrollY }));
    report(after.msgs === 2 && Math.abs(after.title - at[0]) <= 0.5 && Math.abs(after.email - at[1]) <= 0.5, n, "J messages grow the form downwards", JSON.stringify({ before: at.map(Math.round), after }));
    await c.close();
  }
  // L. landscape phones: the whole block on screen where the scroll stops, the footer whole beside it, never cut
  const land = (pg, sb) => pg.evaluate((sb) => { const q = (s) => document.querySelector(s), R = (s) => q(s).getBoundingClientRect(), vh = innerHeight;
    const parts = [".lista__title", ".lista__lede", ".field__label", "#email", ".check__label", ".lista .button"].map(R), f = R(".foot"), e = R("#email"), bt = R(".lista .button");
    const top = Math.min(...parts.map((r) => r.top)), bot = Math.max(...parts.map((r) => r.bottom)), t = R(".lista__title");
    const lines = [...q(".foot p").children].filter((c) => getComputedStyle(c).display !== "none").map((c) => c.getBoundingClientRect());
    const words = [".lista__title", ".lista__lede", ".lista .form"].map(R), meet = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
    const hit = (s) => { const r = R(s), el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return !!el && (el === q(s) || q(s).contains(el)); };
    return { y: Math.round(scrollY), max: document.documentElement.scrollHeight - innerHeight, vh, top: +top.toFixed(1), bot: +bot.toFixed(1), h: Math.round(bot - top),
      off: +((top + bot) / 2 - (vh - sb) / 2).toFixed(1), title: [+t.top.toFixed(1), +t.bottom.toFixed(1)], foot: [Math.round(Math.min(...lines.map((r) => r.top))), Math.round(Math.max(...lines.map((r) => r.bottom)))],
      footClear: !lines.some((l) => words.some((w) => meet(l, w))), field: [Math.round(e.height), parseFloat(getComputedStyle(q("#email")).fontSize)], button: Math.round(bt.height),
      taps: hit(".lista .button") && hit(".foot__link"), op: Math.min(...[".lista__title", ".lista__lede", ".lista .form"].map((s) => +getComputedStyle(q(s)).opacity)),
      active: document.activeElement && document.activeElement.id }; }, sb);
  const whole = (r) => r.op >= 0.999 && r.top >= -0.5 && r.bot <= r.vh + 0.5 && r.title[0] >= 0 && r.title[1] <= r.vh && r.field[0] >= 44 && r.field[1] >= 16 && r.button >= 44 &&
    (r.h + 32 <= r.vh ? Math.abs(r.off) <= 8 : true) && r.foot[0] >= 0 && r.foot[1] <= r.vh + 0.5 && r.footClear && r.taps;
  const LAND = [["l844", 844, 390], ["l932", 932, 430], ["l812", 812, 375], ["l667", 667, 375], ["l568", 568, 320], ["z200", 720, 450]].map((v) => v.concat([null]))
    .concat([["ios844", 844, 340, 390, { left: 47, right: 47, bottom: 21 }], ["ios932", 932, 380, 430, { left: 59, right: 59, bottom: 21 }], ["ios812", 812, 325, 375, { left: 44, right: 44, bottom: 21 }],
      ["ios667", 667, 325, 375, null], ["ios568", 568, 270, 320, null]].flatMap(([n, w, sv, lv, safe]) => [[n + "-bars", w, sv, [sv, lv, safe]], [n + "-full", w, lv, [sv, lv, safe]]]));
  for (const [n, w, h, ios] of LAND) for (const [theme, page] of [["dia", ""], ["dia", "en/"]].concat(n === "l844" ? [["noite", ""]] : [])) {
    const sb = ios && ios[2] ? ios[2].bottom : 0, c = await ctx(w, h, { theme, isMobile: true, hasTouch: true }), pg = await c.newPage(); await serve.offline(pg);
    if (ios) await serve.ios(pg, ios[0], ios[1], h, ios[2] || undefined);
    await pg.goto(base + page, { waitUntil: "networkidle" }); await pg.waitForTimeout(800);
    const { g, end, pageEnd } = await walk(pg), past = pageEnd.max - end, run = await (async () => { await pg.evaluate((y) => scrollTo(0, y), end); await pg.waitForTimeout(400); return land(pg, sb); })();
    await pg.evaluate(() => scrollTo(0, 1e6)); await pg.waitForTimeout(400); const atEnd = await land(pg, sb);
    await pg.evaluate(() => scrollTo(0, 0)); await pg.waitForTimeout(500);
    await pg.click(".porta .cta"); await pg.waitForFunction(() => document.activeElement && document.activeElement.id === "email", null, { timeout: 6000 }).catch(() => {});
    await pg.waitForTimeout(500); const fl = await land(pg, sb);
    await pg.goto("about:blank"); await pg.goto(base + page + "#lista", { waitUntil: "networkidle" }); await pg.waitForTimeout(900); const hash = await land(pg, sb);
    const bars = ios ? ios[1] - h : 0, ok = Math.abs(end - g.listY) <= 1 && Math.abs(past - bars) <= 1 && whole(atEnd) && (past > 1 || whole(run)) &&
      fl.y === fl.max && fl.active === "email" && whole(fl) && hash.y === hash.max && whole(hash);
    report(ok, n, "L landscape: the whole block where the scroll stops", theme, page || "pt", JSON.stringify({ end, pageEndPastRun: past, atEnd, ...(past > 1 ? {} : { run: { top: run.top, bot: run.bot, off: run.off } }),
      flight: { y: fl.y, top: fl.top, bot: fl.bot, active: fl.active }, hash: { y: hash.y, top: hash.top, bot: hash.bot } }));
    await c.close();
  }
  /* L, the footer during the run: beside the form it stands at the page's foot, so it scrolls into the last screen while
     the camera is still walking in. Until the screen is one colour (p < flat) no pixel of it shows (opacity 0 wherever
     its lines are on screen) and its link takes no tap; it fades in with the list and is opaque, its link live, from
     0.87 on. Settled at each progress. 844 x 390, 667 x 375 and an iPhone 844 wide with Safari's bars hidden (as during a
     finger's scroll: 390 tall, svh 340), where its lines are on screen before the flat moment (49 / 33 / 49px of
     scroll before); 568 x 320 and the same iPhone with the bars shown (340 tall: the page ends 50px after the run, so
     its lines come on screen only after the flat moment); at 390 x 844, where it follows the list in the flow, it is
     never held (no inline opacity at any point). */
  for (const [n, w, h, ios, must] of [["l844", 844, 390, null, 1], ["l667", 667, 375, null, 1], ["l568", 568, 320, null, 0],
    ["ios844-full", 844, 390, [340, 390, { left: 47, right: 47, bottom: 21 }], 1], ["ios844-bars", 844, 340, [340, 390, { left: 47, right: 47, bottom: 21 }], 0],
    ["m390", 390, 844, null, 0]]) {
    const c = await ctx(w, h, { theme: "dia", isMobile: true, hasTouch: true }), pg = await c.newPage(); await serve.offline(pg);
    if (ios) await serve.ios(pg, ios[0], ios[1], h, ios[2]);
    await pg.goto(base, { waitUntil: "networkidle" }); await pg.waitForTimeout(800);
    const g = await geo(pg), held = w > h, rows = [];
    for (const q of [0.3, 0.45, 0.55, 0.6, 0.63, 0.65, g.flat - 0.004, 0.7, 0.75, 0.8, 0.87, 0.93, 1]) {
      await pg.evaluate((y) => scrollTo(0, y), Math.floor(g.pin + q * g.run));
      await pg.waitForFunction(() => { const P = document.documentElement.__porta.geo(); return P.r === P.p; }, null, { timeout: 8000 }).catch(() => {});
      await pg.waitForTimeout(120);
      rows.push(await pg.evaluate(() => { const f = document.querySelector(".foot"), l = f.querySelector(".foot__link"), P = document.documentElement.__porta.geo(), vh = innerHeight;
        const lines = [...f.querySelector("p").children].filter((e) => getComputedStyle(e).display !== "none").map((e) => e.getBoundingClientRect());
        const lr = l.getBoundingClientRect(), whole = lr.top >= 0 && lr.bottom <= vh, at = whole && document.elementFromPoint(lr.left + lr.width / 2, lr.top + lr.height / 2);
        return { p: +P.p.toFixed(3), seen: lines.some((r) => r.bottom > 0 && r.top < vh), op: +getComputedStyle(f).opacity, inline: f.style.opacity, link: whole ? !!at && (at === l || l.contains(at)) : null }; }));
    }
    const before = rows.filter((r) => r.p < g.flat), late = rows.filter((r) => r.p >= 0.87);
    const ok = held ? before.every((r) => !r.seen || (r.op === 0 && !r.link)) && (!must || before.some((r) => r.seen)) && late.every((r) => r.op === 1 && r.link !== false)
      : rows.every((r) => r.inline === "" && r.op === 1);
    report(ok, n, held ? "L the footer held with the list during the run: no pixel before the flat moment" : "L the footer in the flow: never held", JSON.stringify({ flat: g.flat, rows }));
    await c.close();
  }
  /* L, a failed check where the scroll stops (the page's end): the two messages lengthen the form (by 42px; 67px in
     English at 568px wide, where the consent's takes two lines), and the button and the footer beside it went under
     the screen's edge (before: 12px at 844 x 340 in English, 30px at 667 x 325); now the page moves up by what is
     needed, the field and the button whole on screen, the focus in the field. 568 x 270 in English, where the form
     from the field to the button (276px) is taller than the screen: the field whole and the button's label on screen. */
  for (const [n, w, sv, lv, safe, h, page] of [["ios844-bars", 844, 340, 390, { left: 47, right: 47, bottom: 21 }, 340, "en/"],
    ["ios844-bars", 844, 340, 390, { left: 47, right: 47, bottom: 21 }, 340, ""], ["ios667-bars", 667, 325, 375, null, 325, ""], ["ios667-bars", 667, 325, 375, null, 325, "en/"],
    ["ios812-bars", 812, 325, 375, { left: 44, right: 44, bottom: 21 }, 325, "en/"], ["ios780-bars", 780, 310, 360, { left: 50, right: 50, bottom: 21 }, 310, "en/"],
    ["ios568-full", 568, 270, 320, null, 320, "en/"], ["ios568-bars", 568, 270, 320, null, 270, ""], ["ios568-bars", 568, 270, 320, null, 270, "en/"], ["l844", 844, 390, 390, null, 390, "en/"]]) {
    const c = await ctx(w, h, { theme: "dia", isMobile: true, hasTouch: true }), pg = await c.newPage(); await serve.offline(pg);
    if (sv !== lv) await serve.ios(pg, sv, lv, h, safe || undefined);
    await pg.goto(base + page, { waitUntil: "networkidle" }); await pg.waitForTimeout(800);
    await pg.evaluate(() => scrollTo(0, 1e6)); await pg.waitForTimeout(500);
    const bb = await pg.locator(".lista .button").boundingBox(); await pg.touchscreen.tap(bb.x + bb.width / 2, bb.y + Math.min(bb.height / 2, h - bb.y - 4)); await pg.waitForTimeout(700);
    const r = await pg.evaluate(() => { const R = (s) => document.querySelector(s).getBoundingClientRect(), e = R("#email"), b = R(".lista .button"), l = R(".button__idle");
      return { vh: innerHeight, y: Math.round(scrollY), email: [+e.top.toFixed(1), +e.bottom.toFixed(1)], button: [+b.top.toFixed(1), +b.bottom.toFixed(1)], label: [+l.top.toFixed(1), +l.bottom.toFixed(1)],
        title: +R(".lista__title").top.toFixed(1), msgs: [...document.querySelectorAll(".lista .field__msg")].filter((m) => !m.hidden).length, active: document.activeElement && document.activeElement.id }; });
    const tall = w === 568 && h === 270 && page, ok = r.msgs === 2 && r.active === "email" && r.email[0] >= 0 && r.email[1] <= r.vh &&
      (tall ? r.label[0] >= 0 && r.label[1] <= r.vh : r.button[0] >= 0 && r.button[1] <= r.vh + 0.5);
    report(ok, `${n}${page ? "-en" : ""}`, "L a failed check: the field and the button whole on screen" + (tall ? " (568 x 270 EN: the field whole, the button's label on screen)" : ""), JSON.stringify(r));
    await c.close();
  }
  // K. reduced motion and no JavaScript: the list right after the photograph, and centred on arrival at #lista
  for (const [n, w, h] of [["m390", 390, 844], ["d1440", 1440, 900]]) for (const mode of ["reduce", "nojs"]) {
    const c = await ctx(w, h, { reducedMotion: mode === "reduce" ? "reduce" : "no-preference", javaScriptEnabled: mode !== "nojs" }); const pg = await c.newPage(); await serve.offline(pg);
    await pg.goto(base + "#lista", { waitUntil: "networkidle" }); await pg.waitForTimeout(800);
    const r = await pg.evaluate(() => { const q = (s) => document.querySelector(s), L = q("#lista").getBoundingClientRect(), S = q(".porta__stage").getBoundingClientRect(), t = q(".lista__title").getBoundingClientRect(),
      last = (q(".lista__noscript") || q(".lista .button")).getBoundingClientRect();
      return { on: document.documentElement.classList.contains("porta-on"), gap: Math.round(L.top - S.bottom), top: Math.round(t.top), off: +((t.top + last.bottom) / 2 - innerHeight / 2).toFixed(1), bottom: Math.round(last.bottom), ih: innerHeight }; });
    report(!r.on && Math.abs(r.gap) <= 1 && r.top >= 0 && r.bottom <= r.ih && Math.abs(r.off) <= (mode === "nojs" ? 16 : 8), n, "K list after the photograph, centred at #lista,", mode, JSON.stringify(r));
    await c.close();
  }
  await sun(b, base, report);
  console.log("list", fail ? "FAILED" : "ok"); await b.close(); srv.close(); process.exit(fail ? 1 : 0);
})();

// M. Dia / Noite on every visit (see the header)
const FIRST = () => {   // every change of data-theme while the page loads, and the theme at the first animation frame
  window.__th = []; window.__first = null;
  new MutationObserver((ms) => { for (const m of ms) if (m.target === document.documentElement)
    window.__th.push([Math.round(performance.now()), m.target.getAttribute("data-theme"), !!document.body]); })
    .observe(document, { attributes: true, subtree: true, attributeFilter: ["data-theme"] });
  requestAnimationFrame(() => { const r = document.documentElement;
    window.__first = [r.getAttribute("data-theme"), r.hasAttribute("data-sol"), getComputedStyle(r).backgroundColor, !!document.body]; });
};
async function sun(b, base, report) {
  const fs = require("fs"), path = require("path"), SHOTS = process.env.SUN_SHOTS;
  if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
  const shot = async (pg, name) => { if (SHOTS) await pg.screenshot({ path: path.join(SHOTS, name + ".png") }); };
  const NIGHT = "2026-11-08T21:00:00Z", DAY = "2026-11-08T13:00:00Z";
  const ctx = async (w, h, when, scheme) => { const m = w < 900, c = await b.newContext({ viewport: { width: w, height: h }, isMobile: m, hasTouch: m, colorScheme: scheme || "light" });
    await c.addInitScript(FIRST); await c.clock.install({ time: new Date(when) }); return c; };   /* FIRST before the clock: the browser's own frames */
  const open = async (c, url) => { const pg = await c.newPage(); await serve.offline(pg); await pg.goto(url || base, { waitUntil: "networkidle" }); await pg.waitForTimeout(700); return pg; };
  const state = async (pg) => { await pg.waitForFunction(() => window.__first, null, { timeout: 3000 }).catch(() => {}); return pg.evaluate(() => { const r = document.documentElement, n = document.getElementById("sol-note"),
      vis = n && [...n.children].find((s) => getComputedStyle(s).display !== "none" && s.getBoundingClientRect().height > 0),
      bg = (() => { const d = document.createElement("div"); d.style.cssText = "position:absolute;width:1px;height:1px;background:var(--color-bg)"; document.body.appendChild(d); const v = getComputedStyle(d).backgroundColor; d.remove(); return v; })();
    let local = "?", sess = "?"; try { local = localStorage.getItem("ab-tema"); sess = sessionStorage.getItem("ab-tema"); } catch (e) {}
    return { theme: r.getAttribute("data-theme"), sol: r.hasAttribute("data-sol"), note: vis ? vis.textContent : null,
      pressed: [...document.querySelectorAll("[data-theme-set]")].filter((x) => x.getAttribute("aria-pressed") === "true").map((x) => x.getAttribute("data-theme-set")),
      local, sess, th: window.__th, first: window.__first, bg, clock: new Date().toISOString().slice(0, 16) }; }); };
  /* the first paint: data-theme set once, before <body>, never again; the first frame already shows it */
  const firstOk = (s, want) => s.th.length === 1 && s.th[0][1] === want && !s.th[0][2] && !!s.first && s.first[0] === want && s.first[1] === s.sol;
  const NOTE = { noite: /^(É noite em Torres Vedras\.|It is night in Torres Vedras\.)$/, dia: /^(É dia em Torres Vedras\.|It is daytime in Torres Vedras\.)$/ };
  const skyOk = (s, want) => s.theme === want && s.sol && NOTE[want].test(s.note || "") && s.pressed.join() === want && firstOk(s, want);
  const mineOk = (s, want) => s.theme === want && !s.sol && s.note === null && s.pressed.join() === want && firstOk(s, want);
  const brief = (s) => JSON.stringify({ ...s, th: s.th.map((x) => x.join(":")) });
  const press = async (pg, t) => { await pg.click(`[data-theme-set="${t}"]`); await pg.waitForTimeout(1300); };

  // 1. a first visit follows the sky, whatever an earlier visit stored
  for (const [n, w, h] of [["m390", 390, 844], ["d1440", 1440, 900]])
    for (const [when, want, scheme] of [[NIGHT, "noite", "light"], [DAY, "dia", "dark"]]) for (const old of [null, want === "noite" ? "dia" : "noite"]) {
      const c = await ctx(w, h, when, scheme);
      if (old) { const p0 = await c.newPage(); await serve.offline(p0); await p0.goto(base + "robots.txt"); await p0.evaluate((v) => localStorage.setItem("ab-tema", v), old); await p0.close(); }
      const pg = await open(c), s = await state(pg);
      report(skyOk(s, want) && s.local === null && s.sess === null, n, "M1", want === "noite" ? "night" : "day", "clock, system " + scheme + (old ? ", old localStorage choice «" + old + "»" : ", first visit"), "opens", want, brief(s));
      if (n === "m390") await shot(pg, `M1-${want}${old ? "-old-" + old : ""}`);
      await c.close();
    }

  // 2. a choice holds for the visit, in the same day or night
  {
    const c = await ctx(390, 844, DAY), pg = await open(c), s0 = await state(pg);
    await press(pg, "noite"); const s1 = await state(pg);
    const end = s1.sess && +s1.sess.split("|")[2];
    report(skyOk(s0, "dia") && s1.theme === "noite" && !s1.sol && /^noite\|dia\|\d+$/.test(s1.sess || "") && end > Date.parse(DAY) && end <= Date.parse("2026-11-08T17:31:00Z") && s1.local === null,
      "m390", "M2 by day, Noite pressed: stored for the visit with the day it was made in", brief(s1));
    await shot(pg, "M2-day-pressed-noite");
    await pg.reload({ waitUntil: "networkidle" }); await pg.waitForTimeout(700); const s2 = await state(pg);
    report(mineOk(s2, "noite") && s2.sess === s1.sess && s2.local === null, "m390", "M2 reload in the same day: Noite, first paint Noite, no sun note", brief(s2));
    await shot(pg, "M2-day-reload-noite");
    await pg.goto(base + "en/", { waitUntil: "networkidle" }); await pg.waitForTimeout(700); const s3 = await state(pg);
    report(mineOk(s3, "noite"), "m390", "M2 the English page in the same visit: Night", brief(s3));
    const p2 = await open(c), s4 = await state(p2);
    report(skyOk(s4, "dia") && s4.sess === null, "m390", "M2 a new tab (a new visit): Dia, by the sky", brief(s4));
    await c.close();
  }

  // 3. a choice lapses at sunrise or sunset
  {
    const c = await ctx(390, 844, "2026-11-08T17:20:00Z"), pg = await open(c), s0 = await state(pg);
    await press(pg, "noite"); await press(pg, "dia"); const s1 = await state(pg);
    report(skyOk(s0, "dia") && s1.theme === "dia" && !s1.sol && /^dia\|dia\|\d+$/.test(s1.sess || ""), "m390", "M3 17:20, Noite then Dia pressed: Dia chosen", brief(s1));
    await c.clock.setSystemTime(new Date("2026-11-08T17:25:00Z"));
    await pg.reload({ waitUntil: "networkidle" }); await pg.waitForTimeout(700); const s2 = await state(pg);
    report(mineOk(s2, "dia"), "m390", "M3 reload at 17:25 (before sunset): the choice holds", brief(s2));
    await shot(pg, "M3-1725-chosen-dia");
    await c.clock.fastForward("08:00"); await pg.waitForTimeout(2500); const s3 = await state(pg);
    report(s3.theme === "noite" && s3.sol && NOTE.noite.test(s3.note || "") && s3.pressed.join() === "noite" && s3.sess === null && s3.clock >= "2026-11-08T17:30",
      "m390", "M3 sunset with the page open: the lamps come on, the choice dropped", JSON.stringify({ theme: s3.theme, sol: s3.sol, note: s3.note, sess: s3.sess, clock: s3.clock }));
    await shot(pg, "M3-sunset-live-noite");
    await pg.reload({ waitUntil: "networkidle" }); await pg.waitForTimeout(700); const s4 = await state(pg);
    report(skyOk(s4, "noite"), "m390", "M3 reload after sunset: Noite, by the sky", brief(s4));
    await c.close();
  }
  {
    const c = await ctx(390, 844, "2026-11-08T17:20:00Z"), pg = await open(c);
    await press(pg, "noite"); await press(pg, "dia"); const s1 = await state(pg);
    await c.clock.setSystemTime(new Date("2026-11-08T17:40:00Z"));   /* the page asleep: the clock moves, no timer runs */
    const s2 = await state(pg);
    await pg.reload({ waitUntil: "networkidle" }); await pg.waitForTimeout(700); const s3 = await state(pg);
    report(s1.theme === "dia" && !s1.sol && s2.theme === "dia" && skyOk(s3, "noite") && s3.sess === null, "m390", "M3 a choice made by day, the page reopened after sunset: Noite, first paint Noite",
      JSON.stringify({ before: [s1.theme, s1.sess], asleep: [s2.theme, s2.clock], after: JSON.parse(brief(s3)) }));
    await shot(pg, "M3-reopened-after-sunset-noite");
    await c.close();
  }
  {
    const c = await ctx(390, 844, DAY), pg = await open(c);
    await press(pg, "noite"); const s1 = await state(pg);
    await c.clock.setSystemTime(new Date("2026-11-09T13:00:00Z"));
    await pg.reload({ waitUntil: "networkidle" }); await pg.waitForTimeout(700); const s2 = await state(pg);
    report(s1.theme === "noite" && /^noite\|dia\|/.test(s1.sess || "") && skyOk(s2, "dia") && s2.sess === null, "m390", "M3 Noite pressed by day, reopened by day the next day: Dia, by the sky",
      JSON.stringify({ before: [s1.theme, s1.sess], after: JSON.parse(brief(s2)) }));
    await c.close();
  }

  // 4. back to a page from the back/forward cache (a swipe back in Safari) after a choice on another page of the visit
  {
    /* headless Chromium does not restore from that cache here, so the restore is replayed: what the other page writes
       is made by that page itself (the privacy notice, pressed in a second tab, read from its sessionStorage), written
       into the home page's, then the restore's events (pageshow with persisted, visibilitychange) */
    const c = await ctx(390, 844, DAY), pg = await open(c), s0 = await state(pg);
    const other = await open(c, base + "privacidade/"), stored = async () => other.evaluate(() => sessionStorage.getItem("ab-tema"));
    const restore = async (v) => { await pg.evaluate((v) => { if (v === null) sessionStorage.removeItem("ab-tema"); else sessionStorage.setItem("ab-tema", v);
      dispatchEvent(new PageTransitionEvent("pageshow", { persisted: true })); document.dispatchEvent(new Event("visibilitychange")); }, v); await pg.waitForTimeout(1500); return state(pg); };
    await press(other, "noite"); const v1 = await stored(), s1 = await restore(v1);
    report(skyOk(s0, "dia") && /^noite\|dia\|\d+$/.test(v1 || "") && s1.theme === "noite" && !s1.sol && s1.note === null && s1.pressed.join() === "noite" && s1.sess === v1,
      "m390", "M4 home by day, Noite pressed on the privacy notice, back from the cache: Noite, no sun note", JSON.stringify({ before: [s0.theme, s0.sol], stored: v1, after: JSON.parse(brief(s1)) }));
    await shot(pg, "M4-back-after-noite-elsewhere");
    await press(other, "dia"); const v2 = await stored(), s2 = await restore(v2);
    report(/^dia\|dia\|\d+$/.test(v2 || "") && s2.theme === "dia" && !s2.sol && s2.note === null && s2.pressed.join() === "dia" && s2.sess === v2,
      "m390", "M4 then Dia pressed there, back again: Dia as a choice (no sun note)", JSON.stringify({ stored: v2, after: JSON.parse(brief(s2)) }));
    const s3 = await restore(null);
    report(s3.theme === "dia" && s3.sol && NOTE.dia.test(s3.note || "") && s3.sess === null, "m390", "M4 no choice left in the visit, back again: the sky decides, with the sun note",
      JSON.stringify({ after: JSON.parse(brief(s3)) }));
    await pg.reload({ waitUntil: "networkidle" }); await pg.waitForTimeout(700); const s4 = await state(pg);
    report(skyOk(s4, "dia"), "m390", "M4 a reload then: the same (Dia, by the sky)", brief(s4));
    await c.close();
  }
}
