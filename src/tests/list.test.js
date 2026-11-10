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
//    430 x 932, 844 x 390, 768 x 1024, 1024 x 768, 1440 x 900 and 1920 x 1080, Dia and Noite, PT and EN, settled, at
//    the end of the run and at the end of the page. Where the block and the footer fit on one screen (16px between
//    them), the page ends one large viewport after the run, and there the block is within 8px of the middle when the
//    footer fits under it with 32px clear; otherwise it stands 16-32px above the footer, the title on screen and the
//    field whole (320 x 568, 375 x 667: the page went on 100px and 51px before, the title cut by the top). Taller than
//    that (844 x 390): where the run ends the block starts 16px from the top, the field whole. Opaque.
//    An iPhone with Safari's bars, emulated (serve.ios: stylesheets served with svh, lvh, dvh in px; headless Chromium
//    has svh = lvh = dvh): 390 wide, 796 shown / 836 hidden (Safari 26), 393 x 695 / 735, 375 x 553 / 627 (SE):
//    with the bars shown the page ends 40px (74px) after the run, with them hidden at the run's end; in both, where the
//    scroll stops, the same rule as above; the hero action's flight and #lista on load land there, the focus in the
//    field. Before, the block was 40px (bars shown) and 20px (hidden) high there.
//    The hero action's flight in Chromium (390 x 796, 1440 x 900): centred, focus in the field; the messages of a failed
//    check lengthen the form downwards (the title and the field do not move).
// K. Reduced motion and no JavaScript (390 x 844, 1440 x 900): the list starts at the photograph's foot (no void), and
//    arriving with #lista its block is in the middle (8px; 16px without JavaScript, where its height is a guess).
setTimeout(() => { console.log("TIMEOUT"); process.exit(2); }, 900000);
const { chromium } = require("playwright"), serve = require("./serve.js");
const [, , dir] = process.argv;
(async () => {
  const { srv, base } = await serve(dir); const b = await chromium.launch(); let fail = 0;
  const report = (ok, ...a) => { if (!ok) fail++; console.log(ok ? "PASS" : "FAIL", ...a); };
  const ctx = async (w, h, o = {}) => { const m = w < 900, c = await b.newContext({ viewport: { width: w, height: h }, isMobile: m && h > w, hasTouch: m, ...o });
    if (o.theme !== null) await c.addInitScript((t) => { try { localStorage.setItem("ab-tema", t); } catch (e) {} }, o.theme || "dia"); return c; };
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
  for (const [n, w, h] of [["se320", 320, 568], ["m375", 375, 667], ["m390", 390, 844], ["m796", 390, 796], ["m430", 430, 932], ["land", 844, 390], ["t768", 768, 1024], ["t1024", 1024, 768], ["d1440", 1440, 900], ["d1920", 1920, 1080]])
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
  console.log("list", fail ? "FAILED" : "ok"); await b.close(); srv.close(); process.exit(fail ? 1 : 0);
})();
