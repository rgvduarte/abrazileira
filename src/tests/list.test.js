// The waiting list: arrival, focus and states. Usage: node src/tests/list.test.js docs
// A. A tap or a click into the form never moves the page (round 2 blocker): at 390 x 844 and 375 x 667 (touch) and
//    1440 x 900 and 1280 x 720 (mouse), resting part-way through the list's rise, at the end of the run and at the
//    end of the page: the first press on the email field or on the button leaves scrollY where it was; the button's
//    first press runs the validation (both messages shown).
// B. The list content is never left invisible where the screen behind it is the flat hall colour: reload with the
//    page restored at the bottom and a jump to the end, on short screens (844 x 390, 932 x 430, 667 x 375,
//    720 x 450 = 1440 x 900 at 200%) and tall ones; and every rest position from the flat moment to the end of the
//    page (title, sentence and form opacity > 0 while on screen, 1 from the end of the run on).
// C. The hero is reachable in about one screen: the scroll from the top until the list title and the email field are
//    fully in view and readable (opacity >= 0.99) is 0.9-1.2 viewport heights.
// D. States: a failed send offers the house's address as a real mailto link; the success line sits where the field
//    was (not floating in the form's box) and does not repeat the sentence above it.
// E. The sun note: with no stored choice, the sky over Torres Vedras decides (a system dark mode does not override
//    it); the note is visible on phones too, in the serif, and never touches the crest.
setTimeout(() => { console.log("TIMEOUT"); process.exit(2); }, 600000);
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

  // C. scroll from the top to the readable form, in viewport heights
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
    report(reach && vh >= 0.9 && vh <= 1.2, n, "C scroll to the readable form", JSON.stringify({ px: hi, vh, endOfRun: g.listY, endVh: +(g.listY / h).toFixed(3) }));
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
    const r = await pg.evaluate(() => { const n = document.getElementById("sol-note"), e = document.querySelector(".lockup__emblem svg"), nr = n.getBoundingClientRect(), er = e.getBoundingClientRect();
      const vis = [...n.children].find((s) => getComputedStyle(s).display !== "none");
      return { theme: document.documentElement.dataset.theme, sol: document.documentElement.hasAttribute("data-sol"), w: Math.round(nr.width), h: Math.round(nr.height), text: vis && vis.textContent,
        font: getComputedStyle(n).fontFamily.split(",")[0], noteBottom: Math.round(nr.bottom), noteRight: Math.round(nr.right), emblemTop: Math.round(er.top), emblemLeft: Math.round(er.left) }; });
    const clear = r.noteBottom <= r.emblemTop || r.noteRight <= r.emblemLeft;
    report(r.theme === want && r.sol && r.w > 100 && r.h >= 16 && /Alegreya"?$/.test(r.font.replace(/'/g, '"')) && clear, n, "E sun note", scheme, when.slice(11, 16), JSON.stringify(r));
    await c.close();
  }
  console.log("list", fail ? "FAILED" : "ok"); await b.close(); srv.close(); process.exit(fail ? 1 : 0);
})();
