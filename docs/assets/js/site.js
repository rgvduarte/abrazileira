(function () {
"use strict";
var ERR = (window.__abErr = window.__abErr || []);
window.addEventListener("error", function (e) { ERR.push(String(e.message || e.error || e)); });
window.addEventListener("unhandledrejection", function (e) { ERR.push("promise: " + String(e.reason)); });
var root = document.documentElement,
still = window.matchMedia("(prefers-reduced-motion: reduce)"),
keyed = false, PRESS = ["pointerdown", "mousedown", "touchstart"], ki;
window.addEventListener("keydown", function () { keyed = true; }, true);
for (ki = 0; ki < PRESS.length; ki++) window.addEventListener(PRESS[ki], function () { keyed = false; }, { capture: true, passive: true });
(function () {
var group = document.querySelector("[data-theme-switch]"),
dark = window.matchMedia("(prefers-color-scheme: dark)"),
KEY = "ab-tema",
sol = root.__sol,
mine = null,
timer, solT;
if (!group) return;
var buttons = group.querySelectorAll("[data-theme-set]"),
note = document.getElementById("sol-note");
try { localStorage.removeItem(KEY); } catch (e) {}
try {
var s0 = (sessionStorage.getItem(KEY) || "").split("|");
if (!root.hasAttribute("data-sol") && s0[0] === root.getAttribute("data-theme")) mine = [s0[0], s0[1], +s0[2]];
else sessionStorage.removeItem(KEY);
} catch (e) {}
function current() {
var t = root.getAttribute("data-theme");
return t === "dia" || t === "noite" ? t : dark.matches ? "noite" : "dia";
}
function free(now) { return sol(now) ? "dia" : "noite"; }
function turn(now) { var up = sol(now), m; for (m = 1; m <= 1440 && sol(now + m * 60000) === up; m++); return m; }
function sync() {
var t = current(), i, told = root.hasAttribute("data-sol") && note;
for (i = 0; i < buttons.length; i++) {
buttons[i].setAttribute("aria-pressed", String(buttons[i].getAttribute("data-theme-set") === t));
if (told) buttons[i].setAttribute("aria-describedby", note.id); else buttons[i].removeAttribute("aria-describedby");
}
tint();
}
function tint() {
if (!root.hasAttribute("data-theme")) return;
var metas = document.querySelectorAll('meta[name="theme-color"]'), i,
bg = getComputedStyle(root).getPropertyValue(root.style.backgroundColor ? "--color-hall" : "--color-bg").trim() || getComputedStyle(document.body).backgroundColor;
for (i = 0; i < metas.length; i++) if (metas[i].getAttribute("content") !== bg) metas[i].setAttribute("content", bg);
}
root.__tint = tint;
function apply(t, keep, sky) {
root.classList.add("is-instant");
root.setAttribute("data-theme", t);
if (keep) {
var now = Date.now();
mine = sol ? [t, free(now), now + turn(now) * 60000] : [t, "", now + 864e5];
root.removeAttribute("data-sol");
try { sessionStorage.setItem(KEY, mine.join("|")); } catch (e) {}
} else if (sky !== undefined) {
if (sky) root.setAttribute("data-sol", ""); else root.removeAttribute("data-sol");
}
sync();
if (root.__photo) { root.__photo.loaded(); root.__photo.enlarge(t); }
window.requestAnimationFrame(function () { root.classList.remove("is-instant"); });
}
var want = null;
function swap(t, keep, sky) {
var w = root.__photo && root.__photo.ready(t);
if (!w) return swapNow(t, keep, sky);
want = t;
w.then(function () { if (want === t) { want = null; if (t !== current()) swapNow(t, keep, sky); } });
}
function warmOther() { if (root.__photo) root.__photo.ready(current() === "dia" ? "noite" : "dia", 1); }
group.addEventListener("pointerenter", warmOther);
group.addEventListener("focusin", warmOther);
group.addEventListener("touchstart", warmOther, { passive: true });
function swapNow(t, keep, sky) {
var slow = !keep && sky !== undefined;
if (still.matches || (root.__portaBusy && root.__portaBusy())) return apply(t, keep, sky);
if (slow) root.classList.add("is-sky");
if (document.startViewTransition) {
var vt = document.startViewTransition(function () { apply(t, keep, sky); }),
end = function () { root.classList.remove("is-sky"); };
if (vt && vt.finished) vt.finished.then(end, end); else end();
return;
}
root.classList.add("is-theming");
apply(t, keep, sky);
clearTimeout(timer);
timer = setTimeout(function () { root.classList.remove("is-theming", "is-sky"); }, slow ? 1650 : 450);
}
group.addEventListener("click", function (e) {
var b = e.target.closest("[data-theme-set]");
if (!b) return;
var t = b.getAttribute("data-theme-set");
if (t === current()) return;
swap(t, true);
});
function sky() {
clearTimeout(solT);
if (!sol) return;
var now = Date.now(), t = free(now), m;
if (mine && (mine[1] !== t || !(now < mine[2]))) {
mine = null;
try { sessionStorage.removeItem(KEY); } catch (e) {}
}
if (!mine && (t !== current() || !root.hasAttribute("data-sol"))) {
if (root.__portaBusy && root.__portaBusy()) { solT = setTimeout(sky, 700); return; }
if (t !== current()) swap(t, false, true); else apply(t, false, true);
}
m = turn(now);
if (m <= 1440) solT = setTimeout(sky, m * 60000 - (now % 60000) + 500);
}
document.addEventListener("visibilitychange", function () { if (!document.hidden) sky(); });
window.addEventListener("pageshow", function (e) {
if (!e.persisted || !sol) return;
var s = [], now = Date.now();
try { s = (sessionStorage.getItem(KEY) || "").split("|"); } catch (er) {}
if ((s[0] === "dia" || s[0] === "noite") && s[1] === free(now) && now < +s[2]) {
mine = [s[0], s[1], +s[2]];
if (s[0] !== current() || root.hasAttribute("data-sol")) apply(s[0], false, false);
} else {
mine = null;
try { sessionStorage.removeItem(KEY); } catch (er) {}
}
sky();
});
group.hidden = false;
sync();
sky();
})();
(function () {
var bar = document.querySelector(".topbar"), lang = bar && bar.querySelector(".controls--lang"),
theme = bar && bar.querySelector("[data-theme-switch]"), note = document.getElementById("sol-note"), raf = 0;
if (!bar || !lang || !theme || !window.ResizeObserver) return;
function fit() {
raf = 0;
lang.style.marginBlockStart = "";
var b = bar.getBoundingClientRect(), t = theme.getBoundingClientRect(), l = lang.getBoundingClientRect(),
n = note ? note.getBoundingClientRect() : null, lh = note ? parseFloat(getComputedStyle(note).lineHeight) || 24 : 24,
wrapped = l.top > t.top + 1, tall = n && n.height > lh * 1.25, bottom = b.bottom;
if (n && !n.height) n = null;
if (!wrapped && !tall) { root.style.removeProperty("--bar-h"); return; }
if (n && wrapped) { lang.style.marginBlockStart = Math.ceil(n.bottom - l.top + 4) + "px"; l = lang.getBoundingClientRect(); }
bottom = Math.max(bottom, l.bottom, n ? n.bottom + 8 : 0);
root.style.setProperty("--bar-h", Math.ceil(bottom - b.top) + "px");
}
function later() { if (!raf) raf = window.requestAnimationFrame(fit); }
var ro = new ResizeObserver(later);
ro.observe(bar); ro.observe(theme); if (note) ro.observe(note);
new MutationObserver(later).observe(root, { attributes: true, attributeFilter: ["data-sol", "data-theme"] });
later();
})();
(function () {
var scene = document.querySelector(".scene[data-geo]");
if (!scene) return;
function theme() {
var t = root.getAttribute("data-theme");
return t === "dia" || t === "noite" ? t : window.matchMedia("(prefers-color-scheme: dark)").matches ? "noite" : "dia";
}
function imgs(t) { return scene.querySelectorAll("picture.t-" + t + " img"); }
function ok(im) { return im && im.complete && im.naturalWidth > 0; }
function loaded() {
var f = scene.querySelector(".ph--facade picture.t-" + theme() + " img");
if (ok(f)) { scene.classList.add("is-loaded"); return; }
scene.classList.remove("is-loaded");
if (f) f.addEventListener("load", loaded, { once: true });
}
function ready(t, wait) {
var list = imgs(t), ps = [], i;
for (i = 0; i < list.length; i++) {
if (list[i].loading !== "eager") list[i].loading = "eager";
if (list[i].decode) ps.push(list[i].decode().catch(function () {}));
}
if (!window.Promise) return null;
return Promise.race([Promise.all(ps), new Promise(function (r) { setTimeout(r, wait || 800); })]);
}
var BIG = ".ph--facade picture, .leaf picture", big = false, warmed = {};
function slow() { var c = navigator.connection; return !!(c && (c.saveData || /2g/.test(c.effectiveType || ""))); }
function bigSizes() { return Math.round(scene.offsetWidth * 3) + "px"; }
function setSizes(pic, v) { var e = pic.querySelectorAll("source, img"), i; for (i = 0; i < e.length; i++) if (e[i].getAttribute("sizes") !== v) e[i].setAttribute("sizes", v); }
function pics(t) { return scene.querySelectorAll(BIG.replace(/picture/g, "picture.t-" + t)); }
function warmBig(t) {
if (warmed[t] || slow() || !scene.offsetWidth || root.getAttribute("data-sequence") !== "scroll") return;
warmed[t] = 1;
var list = pics(t), v = bigSizes(), i;
for (i = 0; i < list.length; i++) {
var c = list[i].cloneNode(true), im = c.querySelector("img");
im.setAttribute("loading", "eager");
setSizes(c, v);
if (im.decode) im.decode().catch(function () {});
}
}
function enlarge(t) {
if (!big || slow()) return;
var list = pics(t || theme()), v = bigSizes(), i;
for (i = 0; i < list.length; i++) setSizes(list[i], v);
}
function upgrade() { if (big) return; big = true; enlarge(); }
root.__photo = { ready: ready, loaded: loaded, theme: theme, upgrade: upgrade, enlarge: enlarge, slow: slow };
loaded();
function later() {
scene.classList.add("is-ready");
ready(theme(), 4000);
var idle = window.requestIdleCallback || function (f) { return setTimeout(f, 1200); };
setTimeout(function () { idle(function () { warmBig(theme()); }, { timeout: 3000 }); }, 600);
}
if (document.readyState === "complete") later(); else window.addEventListener("load", later, { once: true });
})();
(function () {
var wrap = document.querySelector("[data-porta]");
if (!wrap) return;
var $ = function (s) { return wrap.querySelector(s); },
stage = $(".porta__stage"), frame = $(".porta__frame"), intro = $(".intro"), scene = $(".scene"),
plate = $(".ph--plate"), facade = $(".ph--facade"), leafL = $(".leaf--l"), leafR = $(".leaf--r"),
shadeL = leafL.querySelector(".leaf__shade"), shadeR = leafR.querySelector(".leaf__shade"),
G = JSON.parse(scene.getAttribute("data-geo") || "{}"),
css = getComputedStyle(root),
num = function (n, d) { var v = parseFloat(css.getPropertyValue(n)); return isNaN(v) ? d : v; },
OPEN = num("--open-door", G.open || 84) * Math.PI / 180, COS = 1 - Math.cos(OPEN),
TAU = num("--scroll-tau", 90), EPS = 0.0005, JUMP = 0.35, LAGMAX = 0.25,
cam = { dx: 0, dy: 0, k: 0, s: 8, kp: G.k || 0.8 }, pin = 0, run = 1,
probe = document.createElement("div"),
cue = $(".porta__cue"),
list = document.getElementById("lista"), reveal = list && list.querySelector("[data-reveal]"),
rv = function (s) { return (reveal && reveal.querySelector(s)) || document.createElement("i"); },
foot = document.querySelector(".foot"), footLink = foot && foot.querySelector(".foot__link"), footOut = false,
shown = -1, seen = -1, lit = false, raf = 0, last = 0, lastY = NaN, calm = 0, promoted = false, idle, rq = 0, on = false,
held = { w: 0, run: 0 }, mw = 0, mh = 0, endOff = -1, box3 = null;
probe.className = "porta__probe";
probe.setAttribute("aria-hidden", "true");
stage.appendChild(probe);
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
function curve(name, d) {
var m = css.getPropertyValue(name).match(/-?\d*\.?\d+/g);
return bezier(m && m.length === 4 ? m.map(Number) : d);
}
var E = {
copy: curve("--curve-copy", [0.33, 1, 0.68, 1]),
door: curve("--curve-door", [0.3, 0.55, 0.35, 1]),
pan: curve("--curve-pan", [0.35, 0.4, 0.3, 1]),
light: curve("--curve-light", [0.55, 0, 0.75, 0.55]),
rise: curve("--ease-out", [0.23, 1, 0.32, 1]),
flight: curve("--curve-flight", [0.45, 0, 0.3, 1])
};
var FLIGHT = num("--dur-flight", 1250), WEIGHT = num("--flight-weight", 2), WLIST = num("--flight-weight-list", 1.2),
RISE = num("--rise-list", 16);
function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
var DOOR = [0, 0.34], PAN = [0, 0.28], CENTRE = [0.32, 0.5], KX = [0.01, 0.34, 0.54, 0.66], LIGHT = [0.52, 0.66],
COVER_AT = 0.66, LAG = 0.1, TEXT = 1, COVER = 2, LIST = 3, FOOT = 4,
lift = function (k) { return function (u) { return [u, "translate(0," + ((1 - u) * RISE * k).toFixed(2) + "px)"]; }; };
var T = [
[intro, 0, 0.14, E.copy, function (u) { return [1 - u, "translate(0," + (-16 * u).toFixed(2) + "px)"]; }, TEXT],
[cue, 0, 0.05, E.copy, function (u) { return [1 - u, null]; }, TEXT],
[leafL, DOOR[0], DOOR[1], E.door, function (u) { return [null, "rotateY(" + (OPEN * u).toFixed(4) + "rad)"]; }],
[leafR, DOOR[0], DOOR[1], E.door, function (u) { return [null, "rotateY(" + (-OPEN * u).toFixed(4) + "rad)"]; }],
[shadeL, DOOR[0], DOOR[1], E.door, function (u) { return [Math.sin(OPEN * u), null]; }],
[shadeR, DOOR[0], DOOR[1], E.door, function (u) { return [Math.sin(OPEN * u), null]; }],
[$(".ph--spill"), DOOR[0], DOOR[1], E.door, function (u) { return [(1 - Math.cos(OPEN * u)) / COS, null]; }],
[$(".porta__flood"), LIGHT[0], LIGHT[1], E.light, function (u) { return [u, null]; }, COVER],
[rv(".lista__title"), 0.645, 0.8, E.rise, lift(1), LIST],
[rv(".lista__lede"), 0.65, 0.83, E.rise, lift(1), LIST],
[rv(".form"), 0.655, 0.87, E.rise, lift(0.6), LIST],
[foot || document.createElement("i"), COVER_AT, 0.87, E.rise, function (u) { return [u, null]; }, FOOT]
];
var KNEE = 0.25;
function knee(a) {
if (a <= 1 - KNEE) return a < 0 ? 0 : a;
if (a >= 1 + KNEE) return 1;
var d = a - 1 + KNEE;
return a - d * d / (4 * KNEE);
}
function camV(p) {
var m = E.pan(clamp((p - PAN[0]) / (PAN[1] - PAN[0]))), s = scaleAt(p), my = m, a, b;
if (cam.k) {
a = knee((s - 1) * cam.k);
b = clamp((p - CENTRE[0]) / (CENTRE[1] - CENTRE[0]));
b = b * b * (3 - 2 * b);
my = 1 - (1 - a) * (1 - b);
}
return [cam.dx * m, cam.dy * my, s];
}
function camAt(p) {
var c = camV(p);
return "translate(" + c[0].toFixed(2) + "px," + c[1].toFixed(2) + "px) scale(" + c[2].toFixed(4) + ")";
}
var KY = [0, 1, 1.5, 2], KM = [0, 0, 0, 0];
function keys(sA, sB, S) {
var i, d = [], a, b, h;
KY = [0, Math.log(sA), Math.log(sB), Math.log(S)];
for (i = 0; i < 3; i++) d.push((KY[i + 1] - KY[i]) / (KX[i + 1] - KX[i]));
KM = [0, (d[0] + d[1]) / 2, (d[1] + d[2]) / 2, d[2]];
for (i = 0; i < 3; i++) {
if (d[i] <= 0) { KM[i] = KM[i + 1] = 0; continue; }
a = KM[i] / d[i]; b = KM[i + 1] / d[i]; h = a * a + b * b;
if (h > 9) { h = 3 / Math.sqrt(h); KM[i] = h * a * d[i]; KM[i + 1] = h * b * d[i]; }
}
}
function scaleAt(p) {
if (p <= KX[0]) return 1;
if (p >= KX[3]) return Math.exp(KY[3]);
var i = p < KX[1] ? 0 : p < KX[2] ? 1 : 2, h = KX[i + 1] - KX[i], t = (p - KX[i]) / h, t2 = t * t, t3 = t2 * t;
return Math.exp((2 * t3 - 3 * t2 + 1) * KY[i] + (t3 - 2 * t2 + t) * h * KM[i] + (-2 * t3 + 3 * t2) * KY[i + 1] + (t3 - t2) * h * KM[i + 1]);
}
function aim() {
if (!cue) return;
var x = scene.offsetLeft + G.hp[0] * scene.offsetWidth, q;
for (q = scene.offsetParent; q && q !== stage; q = q.offsetParent) x += q.offsetLeft;
x -= cue.offsetLeft + cue.offsetWidth / 2;
for (q = cue.offsetParent; q && q !== stage; q = q.offsetParent) x -= q.offsetLeft;
cue.style.setProperty("--cue-dx", Math.round(x) + "px");
}
function measure() {
var fw = stage.clientWidth, focused = !!(list && document.activeElement && document.activeElement !== list && list.contains(document.activeElement));
if (focused && held.w === fw && held.run > 0) wrap.style.setProperty("--porta-run", held.run + "px");
else if (wrap.style.getPropertyValue("--porta-run")) wrap.style.removeProperty("--porta-run");
var W = scene.offsetWidth, H = scene.offsetHeight, hx = G.hp[0] * W, hy = G.hp[1] * H;
var cx = scene.offsetLeft + hx, cy = scene.offsetTop + hy;
for (var el = scene.offsetParent; el && el !== stage; el = el.offsetParent) { cx += el.offsetLeft; cy += el.offsetTop; }
var vw = stage.clientWidth, vh = probe.offsetHeight || window.innerHeight,
stick = Math.min(0, vh - frame.offsetHeight);
stage.style.setProperty("--stick", stick + "px");
var icon = cue && cue.firstElementChild;
if (icon) {
cue.style.visibility = "";
var st = stage.getBoundingClientRect().top, ir = icon.getBoundingClientRect();
if (ir.top - st < vh && ir.bottom - st > vh + 0.5) cue.style.visibility = "hidden";
}
var sh = Math.max(vh, stage.clientHeight + stick);
cam.dx = vw / 2 - cx;
cam.dy = vh / 2 - stick - cy;
box3 = { x: cx - hx, y: cy - hy, w: W, h: H };
cam.k = vh > vw * 1.1 && cam.dy < -1 ? (1 - G.hp[1]) * H / -cam.dy : 0;
var d = G.persp * H, lw = (G.gap[0] - G.door[0]) * W, f = d / (d + lw * Math.sin(OPEN)),
xl = hx + (G.door[0] * W + lw * Math.cos(OPEN) - hx) * f, xr = hx + (G.door[2] * W - lw * Math.cos(OPEN) - hx) * f;
var inDoor = Math.max(vw / 2 / Math.min(hx - xl, xr - hx), vh / 2 / ((G.hp[1] - G.door[1]) * H),
(sh - vh / 2) / ((G.door[3] - G.hp[1]) * H)) * 1.05;
var end = Math.min(inDoor * 1.15, G.cover);
cam.kp = Math.max(G.k, 1 - Math.log(G.grow * 0.97) / Math.log(end));
cam.s = end;
keys(Math.pow(inDoor, 0.3), inDoor, end);
var r = wrap.getBoundingClientRect(), natural = wrap.offsetHeight - stage.offsetHeight;
if (!wrap.style.getPropertyValue("--porta-run")) held = { w: fw, run: natural };
pin = r.top + window.pageYOffset;
run = Math.max(1, natural - stick);
mw = vw; mh = vh;
footOut = !!foot && getComputedStyle(foot).position === "absolute";
}
function target() {
var y = window.pageYOffset;
return { y: y, p: clamp((y - pin) / run) };
}
function render(r, p) {
if (p === undefined) p = r;
var i, t, s, v, q;
if ((Math.max(r, p - LAG) >= COVER_AT) !== lit) {
lit = !lit;
document.body.style.backgroundColor = root.style.backgroundColor = lit ? "var(--color-hall)" : "";
if (root.__tint) root.__tint();
}
if (r <= 0 && p <= 0) {
for (i = 0; i < T.length; i++) { s = T[i][0].style; s.opacity = ""; s.transform = ""; s.pointerEvents = ""; }
if (footLink) footLink.style.pointerEvents = "";
scene.style.transform = "";
plate.style.transform = "";
draw3d(0, 0);
return;
}
for (i = 0; i < T.length; i++) {
t = T[i];
q = t[5] === TEXT ? Math.min(r, p) : t[5] === COVER ? Math.max(r, p - LAG) : r;
s = t[0].style;
if (t[5] === TEXT && q <= 0) { s.opacity = ""; s.transform = ""; s.pointerEvents = ""; continue; }
if (t[5] === FOOT && !footOut) {
if (s.opacity) { s.opacity = ""; if (footLink) footLink.style.pointerEvents = ""; }
continue;
}
v = t[4](t[3](clamp((q - t[1]) / (t[2] - t[1]))));
if (v[0] !== null) s.opacity = v[0] <= 0 ? "0" : v[0] >= 1 ? "1" : v[0].toFixed(4);
if (v[1] !== null) s.transform = v[1];
if (t[5] === TEXT) s.pointerEvents = v[0] < 0.5 ? "none" : "";
else if (t[5] === LIST) s.pointerEvents = v[0] < 0.5 ? "none" : "auto";
else if (t[5] === FOOT && footLink) footLink.style.pointerEvents = v[0] < 0.5 ? "none" : "";
}
scene.style.transform = low ? "none" : camAt(r);
plate.style.transform = "scale(" + Math.pow(scaleAt(r), cam.kp - 1).toFixed(5) + ")";
draw3d(r, p);
}
var Q = location.search, F3 = /[?&]3d=force(&|$)/.test(Q), T3 = !F3 && /[?&]3d(=1)?(&|$)/.test(Q),
IOS = /iP(hone|od|ad)/.test(navigator.userAgent) || (/^Mac/.test(navigator.platform || "") && navigator.maxTouchPoints > 1),
WK = IOS || (/AppleWebKit/.test(navigator.userAgent) && !/Chrome|Chromium|Edg|OPR|Android/.test(navigator.userAgent)),
gq = /[?&]guard(?:=(\d+)(?:,(\d+))?)?(?:&|$)/.exec(Q),
GUARD = { on: !!gq || (!F3 && !T3), med: gq && gq[1] ? +gq[1] : 25, max: gq && gq[2] ? +gq[2] : 120 },
SOFT = /swiftshader|llvmpipe|softpipe|software|basic render/i,
WEAK = /mali-(4\d\d|t[678]\d\d|g31)\b|adreno \(tm\) ([1-4]\d\d|50\d)\b|powervr (sgx|rogue ge8[0-3]\d\d)|\bgma ?\d|hd graphics (2000|3000)\b|videocore|vivante|tegra [234]\b/i,
d3 = null, d3on = false, d3arm = false, d3st = "off", d3why = "", d3try = 0, backed = false, pre = null, gpu = "", visAt = -1e9, awayAt = -1e9,
cad = 0, gd = null, fnow = 0, cur = null, fading = 0, FADE = num("--dur-handback", 180);
function asc(a, b) { return a - b; }
var SLOWS = 2;
function mem(v, k) {
try {
if (v === undefined) return F3 || T3 ? "" : sessionStorage.getItem(k || "ab-3d") || "";
if (F3 || T3) return "";
if (v === null) sessionStorage.removeItem(k || "ab-3d");
else sessionStorage.setItem(k || "ab-3d", v);
} catch (e) {}
return "";
}
function slows() { return +mem(undefined, "ab-3d-slow") || 0; }
var moved = 0, touched = 0, CALM = 150;
function quiet() {
var sc = navigator.scheduling, t = performance.now();
return !fl && !raf && t - moved > CALM && t - touched > CALM && !(sc && sc.isInputPending && sc.isInputPending());
}
["touchstart", "touchmove", "touchend", "pointerdown", "wheel", "keydown"].forEach(function (k) {
window.addEventListener(k, function () { touched = performance.now(); }, { passive: true, capture: true });
});
var turn = (function () {
if (window.requestIdleCallback) return function (f) { window.requestIdleCallback(f, { timeout: 120 }); };
if (!window.MessageChannel) return function (f) { setTimeout(f, 0); };
var ch = new MessageChannel(), q = [];
ch.port1.onmessage = function () { var f = q.shift(); if (f) f(); };
return function (f) { q.push(f); ch.port2.postMessage(0); };
})();
function whenQuiet(f) {
(function w() { if (!quiet()) return setTimeout(w, 60); turn(function () { if (quiet()) f(); else setTimeout(w, 60); }); })();
}
var DOLLY = 0.12;
function view3d(r, ez) {
var c = camV(r), u = E.door(clamp((r - DOOR[0]) / (DOOR[1] - DOOR[0]))),
v = { cw: stage.clientWidth, ch: stage.clientHeight, rect: box3, tx: c[0], ty: c[1], u: u, spill: (1 - Math.cos(OPEN * u)) / COS };
v.s = scaleAt(r);
v.zc = Math.pow(Math.min(v.s, scaleAt(DOOR[1])), -DOLLY);
v.zh = Math.pow(v.s, -DOLLY);
return v;
}
var d3m = 0, xf = null, xin = false;
function xstop() { if (xf) { try { xf.cancel(); } catch (e) {} xf = null; } }
function show3d(m) {
m = +m;
if (m === d3m) return;
xstop();
d3m = m;
d3on = m === 1;
if (d3on) uncount();
d3.canvas.style.visibility = m === 1 ? "visible" : "";
if (m === 1 && xin && d3.canvas.animate) {
var a = (xf = d3.canvas.animate([{ opacity: 0 }, { opacity: 1 }], { duration: FADE, easing: "linear" }));
a.onfinish = function () { if (xf === a) { xf = null; uncount(); if (d3m === 1 && !fading) scene.style.visibility = "hidden"; } };
xin = false;
scene.style.visibility = "";
return;
}
xin = false;
scene.style.visibility = m && !fading ? "hidden" : "";
}
function draw3d(r, p) {
if (!d3 || !box3 || fading) return;
var flat = Math.max(r, p - LAG) >= COVER_AT, ok;
if (!d3arm) { d3arm = true; xin = r > 0 && !flat; }
if (!(r > 0) || flat) xin = false;
if (flat && r > 0 && d3m && d3.ok) { show3d(2); return; }
ok = r > 0 && !flat && d3.draw(view3d(r));
if (!d3) return;
if (!ok && d3on && r > 0 && !flat && !decoded()) return;
if (!ok && d3m && flat && scaleAt(r) > STEP) { low = 3; lowT = performance.now(); scene.style.transform = "none"; }
show3d(ok ? 1 : 0);
if (ok && gd) gd.drew = true;
}
function watch3d() {
if (!gd || gd.done || !fnow) return;
var drew = gd.drew, th = root.getAttribute("data-theme");
gd.drew = false;
if (th !== gd.th) { gd.th = th; uncount(); }
if (!d3on || xf) { gd.prev = 0; gd.last = false; return; }
if (gd.skip > 0) { if (gd.prev) gd.off++; if (!--gd.skip) gd.from = moved; }
else if (gd.prev && gd.last && fnow > gd.prev) {
var d = fnow - gd.prev, s, lim;
gd.t.push(d);
gd.sum += d;
if (d > gd.worst) gd.worst = d;
if (GUARD.on && d > GUARD.max) { handBack("a frame of " + Math.round(d) + " ms (limit " + GUARD.max + ")", true); return; }
var lg = d3.lag ? d3.lag(gd.from) : [0, 0];
if (lg[0] > gd.lag) gd.lag = lg[0];
if (GUARD.on && lg[0] > GUARD.max && lg[1] >= 3) { handBack("the GPU " + Math.round(lg[0]) + " ms behind, " + lg[1] + " frames (limit " + GUARD.max + ")", true); return; }
if (gd.sum >= 1000) {
s = gd.t.slice().sort(asc);
gd.med = s[s.length >> 1];
gd.done = true;
lim = Math.max(GUARD.med, 1.5 * (cad || 16.7));
if (GUARD.on && gd.med > lim) { handBack("median frame " + gd.med.toFixed(1) + " ms (limit " + Math.round(lim) + ")", true); return; }
if (GUARD.on && slows()) mem(null, "ab-3d-slow");
}
}
gd.prev = fnow;
gd.last = drew;
}
function uncount() { if (gd && !gd.done) { gd.prev = 0; gd.skip = 3; } }
window.addEventListener("resize", uncount);
if (window.visualViewport) window.visualViewport.addEventListener("resize", uncount);
function cadence() {
var ts = [], t0 = 0;
function f(t) {
if (t0) ts.push(t - t0);
t0 = t;
if (ts.length < 12 && !document.hidden) window.requestAnimationFrame(f);
else if (ts.length > 4) { ts.sort(asc); cad = Math.min(34, Math.max(6, ts[ts.length >> 1])); }
}
window.requestAnimationFrame(f);
}
var hold = null;
function decoded() {
var t = root.__photo.theme();
if (!hold || hold.t !== t) {
var h = (hold = { t: t, done: false, t0: performance.now() }), ps = [], i,
ims = scene.querySelectorAll(".ph--facade picture.t-" + t + " img, .leaf picture.t-" + t + " img");
for (i = 0; i < ims.length; i++) if (ims[i].decode) ps.push(ims[i].decode().catch(function () {}));
Promise.all(ps).then(function () { window.requestAnimationFrame(function () { h.done = true; queue(); }); });
}
return hold.done || performance.now() - hold.t0 > 300;
}
function lost3d(st, why) {
var m = cur || d3;
if (d3) show3d(0);
d3 = cur = null;
fading = 0;
if (m) setTimeout(function () { try { m.destroy(); } catch (e) {} }, 60);
d3st = st;
if (why) d3why = why;
wrap.classList.remove("porta--3d");
ERR.push("3d: " + st + (why ? " (" + why + ")" : ""));
}
function handBack(why, slow) {
var n = slow ? slows() + 1 : 0;
backed = true;
if (slow) mem(String(n), "ab-3d-slow");
if (!slow || n >= SLOWS) mem("0|" + (slow ? "slow hand-back " + n + "/" + SLOWS + ": " : "") + why);
if (gd) gd.done = true;
if (!slow || !d3 || !d3on || fading || xf) { lost3d("handed back", why); queue(); return; }
d3st = "handing back";
d3why = why;
fading = performance.now();
scene.style.visibility = "";
d3.canvas.style.transition = "opacity " + FADE + "ms linear";
d3.canvas.style.opacity = "0";
setTimeout(function () { if (fading) { lost3d("handed back", why); queue(); } }, FADE + 50);
}
function refuse(why) { d3st = "refused"; d3why = why; }
var d3stg = "", d3n = "", d3t0 = 0, d3log = [], wd = 0, wdAct = 0, wdT = 0,
LIMIT = { fetch: 20000, decode: 20000, eval: 12000 }, LIMIT0 = 8000, NET = /^(fetch|decode)$/;
function stg(s, i, n) {
var t = performance.now();
if (s !== d3stg) d3log.push(s + "@" + Math.round(t));
d3stg = s;
d3n = n ? i + "/" + n : "";
wdAct = 0;
wdT = t;
if (!wd && d3st === "loading") wd = setInterval(watchdog, 250);
}
function watchdog() {
var t = performance.now(), dt = Math.min(t - wdT, 500), why;
wdT = t;
if (d3st !== "loading") { clearInterval(wd); wd = 0; return; }
if (document.hidden) return;
if (d3stg === "wait" || !(NET.test(d3stg) || quiet())) return;
wdAct += dt;
if (wdAct <= (LIMIT[d3stg] || LIMIT0)) return;
why = "timeout: " + d3stg + (d3n ? " " + d3n : "") + " (no progress in " + (wdAct / 1000).toFixed(1) + " s)";
clearInterval(wd);
wd = 0;
if (!NET.test(d3stg)) mem("0|" + why);
lost3d("refused", why);
queue();
}
function gate() {
var c = navigator.connection, m, dm = navigator.deviceMemory, hc = navigator.hardwareConcurrency;
if (still.matches) return "reduced motion";
if (/[?&]semporta\b/.test(Q)) return "?semporta";
if (/[?&]sem3d\b/.test(Q)) return "?sem3d";
if (!on) return "the sequence is off";
if (c && c.saveData) return "data saver";
if (c && /2g/.test(c.effectiveType || "")) return "2G link (" + c.effectiveType + ")";
if (!("noModule" in HTMLScriptElement.prototype)) return "no ES modules";
if (!window.WebGL2RenderingContext) return "no WebGL 2";
if (!wrap.getAttribute("data-3d")) return "no 3D module on this page";
if (F3 || T3) return "";
m = mem();
if (/^0\|(a frame of|median frame|the GPU )/.test(m)) { if (!slows()) mem("1", "ab-3d-slow"); mem(null); m = ""; }
if (m.charAt(0) === "0") return "earlier in this session: " + m.slice(2);
if (dm && dm < 2) return "weak device (deviceMemory " + dm + " GB)";
if (!IOS && hc && hc < 4) return "weak device (" + hc + " cores)";
return "";
}
function gpu3d() {
var m = mem(), cv, gl = null, x, lose, mt, why = "";
if (m.charAt(0) === "1") { gpu = m.slice(2); return ""; }
try { cv = document.createElement("canvas"); gl = cv.getContext("webgl2", { failIfMajorPerformanceCaveat: true, antialias: false, depth: false }); } catch (e) {}
if (!gl) why = "no GPU-backed WebGL 2 context (failIfMajorPerformanceCaveat)";
else {
try {
x = gl.getExtension("WEBGL_debug_renderer_info");
lose = gl.getExtension("WEBGL_lose_context");
gpu = String(gl.getParameter(x ? x.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
mt = gl.getParameter(gl.MAX_TEXTURE_SIZE);
if (SOFT.test(gpu)) why = "software renderer (" + gpu + ")";
else if (mt < 4096) why = "MAX_TEXTURE_SIZE " + mt;
else if (!T3 && WEAK.test(gpu)) why = "weak GPU (" + gpu + ")";
if (lose) lose.loseContext();
} catch (e) { why = "probe: " + (e && e.message || e); }
}
mem(why ? "0|" + why : "1|" + gpu);
return why;
}
function pre3d() {
if (pre) return pre;
var urls = [wrap.getAttribute("data-3d"), wrap.getAttribute("data-3d-dep")], ps = [], l0 = document.createElement("link");
if (!(l0.relList && l0.relList.supports && l0.relList.supports("modulepreload"))) return (pre = Promise.resolve());
urls.forEach(function (u) {
if (u) ps.push(new Promise(function (ok) { var l = document.createElement("link"); l.rel = "modulepreload"; l.href = u; l.fetchPriority = "low"; l.onload = l.onerror = ok; document.head.appendChild(l); }));
});
return (pre = Promise.all(ps));
}
function load3d() {
if (d3st !== "off") return;
d3t0 = performance.now();
d3log = [];
stg("gate");
var why = gate();
if (!why && !F3) { stg("probe"); why = gpu3d(); }
if (why) { refuse(why); return; }
d3st = "loading";
stg("fetch");
d3why = (F3 ? "?3d=force" : T3 ? "?3d (testing)" : "passed the gate") + (gpu ? ": " + gpu : "");
if (!cad) cadence();
pre3d().then(function () {
if (d3st === "loading") stg("wait");
whenQuiet(function () {
if (d3st !== "loading") return;
if (root.__door3d) return mount3d();
stg("eval");
window.addEventListener("door3d", function () { if (d3st === "loading") stg("wait"); whenQuiet(mount3d); }, { once: true });
var s = document.createElement("script"), t0;
s.src = wrap.getAttribute("data-3d");
s.type = "module";
s.onerror = function () { lost3d("refused", "the module failed to load"); };
function bad(why) {
window.removeEventListener("error", onErr);
clearTimeout(t0);
if (d3st !== "loading" || root.__door3d) return;
mem("0|module: " + why);
lost3d("refused", "module: " + why);
}
function onErr(e) { if (/door3d|three/.test(e && e.filename || "")) bad(String(e.message || "error").slice(0, 80)); }
window.addEventListener("error", onErr);
t0 = setTimeout(function () { bad("not evaluated within 10 s"); }, 10000);
window.addEventListener("door3d", function () { window.removeEventListener("error", onErr); clearTimeout(t0); }, { once: true });
document.head.appendChild(s);
});
});
}
function mount3d() {
if (d3st !== "loading") return;
try {
var m = cur = root.__door3d.mount({ stage: stage, scene: scene, G: G, theme: root.__photo.theme, force: F3,
maxDpr: 3,
serial: WK,
big: function () { return Math.round(scene.offsetWidth * 3) + "px"; },
quiet: quiet,
step: function (s, i, n) { if (d3st === "loading" && (m === undefined || m === cur)) stg(s, i, n); },
views: function (ez) { return box3 ? [view3d(0.3, ez), view3d(0.05, ez)] : []; },
onLost: function () {
if (m !== cur) return;
if (backed) { lost3d("handed back", d3why); queue(); return; }
if (document.hidden || awayAt > visAt || performance.now() - visAt < 3000) {
lost3d("context lost", "lost in the background: rebuilt when shown");
queue();
setTimeout(revive3d, 3000);
} else handBack("context lost while shown");
},
onError: function (e) { if (m === cur) handBack("exception: " + String(e && e.message || e).slice(0, 80)); },
onTheme: function () { if (m === cur) { d3arm = false; queue(); } } });
m.ready.then(function () {
if (m !== cur || d3st !== "loading") { m.destroy(); return; }
d3 = m;
d3st = "on";
stg("on");
d3arm = false;
gd = { t: [], sum: 0, prev: 0, last: false, drew: false, skip: 0, off: 0, from: 0, th: root.getAttribute("data-theme"), worst: 0, med: 0, lag: 0, done: false };
wrap.classList.add("porta--3d");
queue();
}, function (e) {
if (m !== cur) { m.destroy(); return; }
var msg = String(e && e.message || e).slice(0, 120);
if (!(e && e.stage === "textures")) mem("0|mount: " + msg);
lost3d("refused", "mount: " + msg);
});
} catch (err) {
var msg = String(err && err.message || err).slice(0, 120);
cur = null;
mem("0|mount: context: " + msg);
if (/context/i.test(msg)) { refuse("mount: context: " + msg); wrap.classList.remove("porta--3d"); } else lost3d("refused", "mount: context: " + msg);
}
}
function revive3d() {
if (backed) return;
if (d3 && d3.lost()) lost3d("context lost", "lost in the background: rebuilt when shown");
if (d3st !== "context lost" || d3try >= 2 || document.hidden) return;
d3try++;
d3st = "off";
whenQuiet(load3d);
}
function back3d(e) {
uncount();
if (e.type === "pagehide" || (e.type === "visibilitychange" && document.hidden)) { awayAt = performance.now(); return; }
if (e.type === "pageshow" ? e.persisted : !document.hidden) { visAt = wdT = performance.now(); wdAct = 0; revive3d(); }
}
document.addEventListener("visibilitychange", back3d);
window.addEventListener("pageshow", back3d);
window.addEventListener("pagehide", back3d);
var LAYERS = [[facade, "transform"], [scene, "transform"], [plate, "transform"], [leafL, "transform"], [leafR, "transform"],
[shadeL, "opacity"], [shadeR, "opacity"], [$(".ph--spill"), "opacity"], [intro, "transform, opacity"],
[$(".porta__cue"), "opacity"], [$(".porta__flood"), "opacity"]],
DRAWN = 1,
WARM = 8,
sharp = 0, sharpT, rasterS = 1, lift = 0, STEP = 2.2, ready = false, low = 0, lowT = 0;
function promote(yes) {
clearTimeout(sharpT);
sharp = 0;
if (yes === promoted) return;
promoted = yes;
ready = false;
if (yes && root.__photo) root.__photo.upgrade();
lift = 0;
rasterS = scaleAt(Math.max(0, shown));
for (var i = 0; i < LAYERS.length; i++) LAYERS[i][0].style.willChange = yes ? LAYERS[i][1] : "";
}
function crisp(r) {
if (!promoted || sharp) return;
if (lift) {
LAYERS[0][0].style.willChange = LAYERS[0][1];
lift = 0;
return;
}
var sNow = scaleAt(r);
if (fl && r < KX[2] && sNow > rasterS * STEP) {
LAYERS[0][0].style.willChange = "";
rasterS = sNow;
lift = 1;
}
}
function rest() {
if (!promoted || sharp) return;
sharp = 1;
lift = 0;
rasterS = scaleAt(Math.max(0, shown));
for (var i = 0; i < DRAWN; i++) LAYERS[i][0].style.willChange = "";
sharpT = setTimeout(function () {
sharp = 2;
for (var i = 0; i < DRAWN; i++) LAYERS[i][0].style.willChange = LAYERS[i][1];
}, 120);
}
function bail(where, err) {
ERR.push(where + ": " + (err && err.message ? err.message : String(err)));
try { off(); } catch (e) {}
root.classList.remove("porta-on");
root.setAttribute("data-sequence", "static");
root.__porta = null;
}
function tick(now) { try { tickInner(now); } catch (err) { bail("tick", err); } }
function tickInner(now) {
raf = 0;
moved = performance.now();
if (!on) return;
fnow = now;
var g = fl ? flightStep(now) : target(), dt = last ? Math.min(64, now - last) : 16.7, r;
last = now;
if (!rq && !fl) endOff = g.p >= 1 ? g.y - pin - run : -1;
if (shown < 0 || seen < 0 || Math.abs(g.p - seen) > JUMP) r = g.p;
else {
r = shown + (g.p - shown) * (1 - Math.exp(-dt / TAU));
r = Math.min(Math.max(r, g.p - LAGMAX), g.p + LAGMAX);
}
if (Math.abs(g.p - r) < EPS) r = g.p;
if (r !== shown || g.p !== seen || low) {
if (r > 0) {
if (sharp === 1) promote(false);
if (!promoted && !low && Math.max(r, g.p - LAG) >= COVER_AT && scaleAt(r) > STEP) { low = 3; lowT = now; }
promote(true);
clearTimeout(idle);
}
if (low) {
if (Math.max(r, g.p - LAG) >= COVER_AT && (low > 1 || now - lowT < 60)) { if (low > 1) low--; }
else { low = 0; rasterS = 1; }
}
render(r, g.p);
shown = r;
seen = g.p;
crisp(r);
} else if (lift) crisp(r);
watch3d();
fnow = 0;
if (g.y !== lastY) { lastY = g.y; calm = 0; } else calm++;
if (r !== g.p || calm < 8 || low) raf = window.requestAnimationFrame(tick);
else {
last = 0;
if (gd) gd.prev = 0;
clearTimeout(idle);
if (shown <= 0) idle = setTimeout(settle, 300);
else if (shown < KX[2]) idle = setTimeout(rest, 250);
}
}
function kick() { if (on && !raf) raf = window.requestAnimationFrame(tick); }
var fl = null, STOP = ["wheel", "touchstart", "pointerdown", "keydown"], ACTION = 'a[href="#lista"]';
function listen(yes) {
for (var i = 0; i < STOP.length; i++) window[yes ? "addEventListener" : "removeEventListener"](STOP[i], land, { passive: true, capture: true });
}
function again(e) {
var t = e.touches && e.touches[0] ? e.touches[0] : e, x = t.clientX, y = t.clientY, els = wrap.querySelectorAll(ACTION), r, i;
if (x === undefined || performance.now() - fl.t > 450) return false;
for (i = 0; i < els.length; i++) {
r = els[i].getBoundingClientRect();
if (r.width && x >= r.left - 6 && x <= r.right + 6 && y >= r.top - 6 && y <= r.bottom + 6) return true;
}
return false;
}
function land(e) {
if (!fl) return;
if (e && e.type === "keydown" && e.repeat) return;
if (e && (e.type === "pointerdown" || e.type === "touchstart") && again(e)) return;
fl = null;
listen(false);
}
function zoomAt(y) { return Math.log(scaleAt(clamp((y - pin) / run))) / KY[3]; }
function listAt(y) {
var q = clamp((y - pin) / run), a = 0, i, t;
for (i = 8; i < 11; i++) { t = T[i]; a += t[3](clamp((q - t[1]) / (t[2] - t[1]))); }
return a / 3;
}
function journey(y0, y1) {
var N = 96, ys = [y0], J = [0], i, y, z, pz = zoomAt(y0), l, pl = listAt(y0);
for (i = 1; i <= N; i++) {
y = y0 + (y1 - y0) * i / N;
z = zoomAt(y);
l = listAt(y);
ys.push(y);
J.push(J[i - 1] + Math.abs(y - ys[i - 1]) / run + WEIGHT * Math.abs(z - pz) + WLIST * Math.abs(l - pl));
pz = z;
pl = l;
}
return function (j) {
j *= J[N];
for (i = 1; i < N && J[i] < j; i++);
var a = J[i - 1], b = J[i];
return ys[i - 1] + (b > a ? Math.min(1, (j - a) / (b - a)) : 1) * (ys[i] - ys[i - 1]);
};
}
function flightStep(now) {
var f = fl, y0 = window.pageYOffset;
if (f.y >= 0 && Math.abs(y0 - f.y) > 4) { land(); return target(); }
if (f.t0 < 0) f.t0 = now;
var u = Math.min(1, (now - f.t0) / f.d), y = f.at(E.flight(u));
if (u >= 1) y = f.y1;
f.y = y;
window.scrollTo(0, y);
if (u >= 1) { land(); f.done(); }
return { y: y, p: clamp((y - pin) / run) };
}
function fly(to, done) { try { return flyInner(to, done); } catch (err) { bail("fly", err); return false; } }
function flyInner(to, done) {
if (!on) return false;
if (fl && fl.to === to) return true;
land();
var y0 = window.pageYOffset, y1 = to(), full = Math.max(1, y1 - pin), dist = Math.abs(y1 - y0);
if (dist < 2) { done(); return true; }
fl = { to: to, y0: y0, y1: y1, y: -1, t0: -1, t: performance.now(), done: done, at: journey(y0, y1),
d: FLIGHT * Math.min(1, Math.max(0.35, Math.sqrt(dist / full))) };
promote(true);
clearTimeout(idle);
listen(true);
calm = 0;
kick();
return true;
}
function prime() {
if (d3st === "loading") pre3d();
if (!on || promoted || shown > 0) return;
promote(true);
clearTimeout(idle);
idle = setTimeout(function () { if (shown <= 0) settle(); }, 400);
}
function warm(e) {
if (!on || promoted || ready || shown > 0 || (e && e.pointerType && e.pointerType !== "mouse")) return;
ready = true;
for (var i = 0; i < WARM; i++) LAYERS[i][0].style.willChange = LAYERS[i][1];
}
function refresh() { try { refreshInner(); } catch (err) { bail("refresh", err); } }
function refreshInner() {
rq = 0;
aim();
if (!on) return;
var was = endOff, w0 = mw, h0 = mh;
measure();
if (was >= 0 && !fl && (mw !== w0 || mh !== h0) && target().p < 1) window.scrollTo(0, pin + run + was);
if (fl) { fl.y1 = fl.to(); fl.at = journey(fl.y0, fl.y1); }
if (promoted && !fl && (mw !== w0 || mh !== h0) && scaleAt(Math.max(0, shown)) > STEP) promote(false);
if (shown >= 0) render(shown, seen < 0 ? shown : seen);
calm = 0;
kick();
}
function queue() { if (!rq) rq = window.requestAnimationFrame(refresh); }
function off() {
land();
if (d3) show3d(0);
on = false;
if (raf) window.cancelAnimationFrame(raf);
raf = 0;
clearTimeout(idle);
window.removeEventListener("scroll", kick);
render(0);
promote(false);
if (ready) { ready = false; for (var j = 0; j < WARM; j++) LAYERS[j][0].style.willChange = ""; }
stage.style.removeProperty("--stick");
if (cue) cue.style.visibility = "";
shown = -1;
seen = -1;
}
function set() {
off();
aim();
if (still.matches || /[?&]semporta\b/.test(location.search)) {
root.classList.remove("porta-on");
root.setAttribute("data-sequence", "static");
return;
}
root.classList.add("porta-on");
root.setAttribute("data-sequence", "scroll");
on = true;
measure();
window.addEventListener("scroll", kick, { passive: true });
kick();
if (d3st === "refused" && d3why === "reduced motion") { d3st = "off"; whenQuiet(load3d); }
}
window.addEventListener("wheel", prime, { passive: true });
wrap.addEventListener("pointerdown", function (e) { if (e.target.closest && e.target.closest('a[href="#lista"]')) prime(); }, { passive: true });
window.addEventListener("pointermove", warm, { passive: true });
function settle() { if (promoted) promote(false); }
window.addEventListener("touchstart", prime, { passive: true });
window.addEventListener("resize", queue);
window.addEventListener("orientationchange", queue);
if (list) list.addEventListener("focusout", function () { if (wrap.style.getPropertyValue("--porta-run")) queue(); });
if (window.visualViewport) window.visualViewport.addEventListener("resize", queue);
window.addEventListener("load", queue);
window.addEventListener("pageshow", function () { shown = -1; seen = -1; queue(); });
if (document.fonts && document.fonts.ready) document.fonts.ready.then(queue);
if (still.addEventListener) still.addEventListener("change", set);
else if (still.addListener) still.addListener(set);
intro.addEventListener("focusin", function () {
if (keyed && on && target().p > 0.01) window.scrollTo(0, pin);
});
try { set(); } catch (err) { bail("set", err); }
(function () {
function go() { turn(function () { if (raf || fl) return setTimeout(go, 100); try { load3d(); } catch (e) { refuse("load: " + (e && e.message || e)); } }); }
window.requestAnimationFrame(function () { setTimeout(go, 0); });
})();
root.__portaBusy = function () { return on && (!!fl || !!raf); };
root.__porta = { fly: fly, land: land, d3probe: function () { return d3 && d3.probe ? d3.probe() : null; }, geo: function () {
return { pin: pin, run: run, S: cam.s, kp: cam.kp, keys: KX, scales: KY.map(Math.exp), light: LIGHT, flat: COVER_AT, list: [T[8][1], T[10][2]], r: shown, p: seen,
d3: d3st, d3stage: d3stg + (d3n ? " " + d3n : ""), d3ms: d3t0 ? Math.round(performance.now() - d3t0) : 0, d3log: d3log.slice(), d3times: cur && cur.times ? cur.times() : d3 && d3.times ? d3.times() : null, d3quiet: quiet(), d3shown: d3on, d3ok: !!(d3 && d3.ok), d3try: d3try, d3why: d3why, d3gpu: gpu, d3dpr: d3 ? d3.dpr() : 0,
d3slow: F3 || T3 ? null : [slows(), SLOWS],
d3guard: gd ? { on: GUARD.on, n: gd.t.length, ms: Math.round(gd.sum), med: +gd.med.toFixed(1), worst: Math.round(gd.worst), lag: Math.round(gd.lag), off: gd.off, done: gd.done, cadence: +cad.toFixed(1) } : null };
} };
})();
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
ctx = email.getAttribute("aria-describedby"),
busy = false, said;
function state(s) { form.setAttribute("data-state", s); }
function mark(input, box, text) {
var base = input === email ? ctx : null;
box.textContent = text || "";
box.hidden = !text;
if (text) { input.setAttribute("aria-invalid", "true"); input.setAttribute("aria-describedby", box.id); }
else {
input.removeAttribute("aria-invalid");
if (base) input.setAttribute("aria-describedby", base); else input.removeAttribute("aria-describedby");
}
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
form.style.minBlockSize = form.offsetHeight + "px";
state("done");
email.value = "";
msg.textContent = d.msgOk;
msg.focus();
}
function fail() {
state("error");
clearTimeout(said);
said = setTimeout(function () {
var parts = String(d.msgError).split("{mail}"), a;
msg.textContent = parts[0];
if (parts.length > 1 && d.mail) {
a = document.createElement("a");
a.className = "link-inline";
a.href = "mailto:" + d.mail;
a.textContent = d.mail;
msg.appendChild(a);
msg.appendChild(document.createTextNode(parts.slice(1).join("")));
}
fit();
}, 60);
}
function idle() {
busy = false;
form.removeAttribute("aria-busy");
button.removeAttribute("aria-disabled");
}
var lista = form.closest(".lista"), inner = lista && lista.querySelector(".lista__inner");
function fit() {
if (!inner || getComputedStyle(inner).display !== "grid") return;
var vh = window.innerHeight, g = parseFloat(getComputedStyle(lista).paddingBottom) || 0,
top = form.getBoundingClientRect().top, field = email.getBoundingClientRect().top,
end = Math.max(button.getBoundingClientRect().bottom, msg.textContent ? msg.getBoundingClientRect().bottom : 0),
air = Math.max(0, Math.min(g, (vh - (end - top)) / 2)),
d = Math.min(Math.ceil(end - (vh - air)), Math.floor(field));
if (d > 0) window.scrollBy(0, d);
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
clearTimeout(said);
msg.textContent = "";
state("idle");
var bad = validate();
if (bad.length) { bad[0].focus(); fit(); return; }
if (hp.value) { done(); return; }
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
if (m === "invalid_email") { state("idle"); mark(email, emailMsg, d.msgEmail); email.focus(); fit(); }
else if (m === "consent_required") { state("idle"); mark(consent, consentMsg, d.msgConsent); consent.focus(); fit(); }
else fail();
}, fail);
}, fail).then(function () { clearTimeout(timer); idle(); }, function () { clearTimeout(timer); idle(); fail(); });
});
set.disabled = false;
state("idle");
})();
(function () {
var list = document.getElementById("lista"), email = document.getElementById("email");
if (!list) return;
function listY() { return list.getBoundingClientRect().top + window.pageYOffset; }
var porta = document.querySelector(".porta");
function rest() {
var y = listY(), d = document.documentElement, end;
if (!porta || !d.classList.contains("porta-on")) return y;
end = porta.getBoundingClientRect().bottom + window.pageYOffset;
return d.scrollHeight <= end + 1 ? Math.max(y, d.scrollHeight - window.innerHeight) : y;
}
var inner = list.querySelector(".lista__inner"), form = list.querySelector(".form"), foot = document.querySelector(".foot"),
kept = { w: -1, top: "" }, lb = "", lf = "", lq = 0;
function inside() { var a = document.activeElement; return !!(a && a !== list && list.contains(a)); }
function keep() { kept = { w: list.clientWidth, top: getComputedStyle(list).paddingTop }; }
function lay() {
lq = 0;
var w = list.clientWidth, focused = inside();
if (focused && w === kept.w && kept.top) { if (list.style.paddingBlockStart !== kept.top) list.style.paddingBlockStart = kept.top; return; }
var b = inner && form && (form.getAttribute("data-state") || "idle") === "idle" && !form.querySelector(".field__msg:not([hidden])") ? inner.offsetHeight + "px" : lb,
f = foot ? foot.offsetHeight + "px" : lf;
if (list.style.paddingBlockStart) list.style.paddingBlockStart = "";
if (b !== lb) { list.style.setProperty("--lista-b", (lb = b)); if (foot) foot.style.setProperty("--lista-b", b); }
if (f !== lf) list.style.setProperty("--foot-h", (lf = f));
if (focused) keep(); else kept = { w: w, top: "" };
}
function relay() { if (!lq) lq = window.requestAnimationFrame(lay); }
lay();
window.addEventListener("resize", lay);
list.addEventListener("focusin", function () { if (!kept.top || kept.w !== list.clientWidth) keep(); });
list.addEventListener("focusout", relay);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(relay);
function arrive() {
if (email && !email.closest("fieldset:disabled")) email.focus({ preventScroll: true });
}
function toList(e) {
e.preventDefault();
if (!still.matches && root.__porta && root.__porta.fly(rest, arrive)) return;
window.scrollTo(0, rest());
arrive();
}
var links = document.querySelectorAll('.porta a[href="#lista"]');
for (var i = 0; i < links.length; i++) {
links[i].addEventListener("click", toList);
links[i].addEventListener("keydown", function (e) {
if ((e.key === " " || e.key === "Enter") && e.repeat) { e.preventDefault(); return; }
if (e.key === " ") toList(e);
});
}
list.addEventListener("focusin", function (e) {
if (!keyed || (e.relatedTarget && list.contains(e.relatedTarget))) return;
var y = rest(), d = y - window.pageYOffset,
fits = e.target.getBoundingClientRect().bottom - list.getBoundingClientRect().top <= window.innerHeight - 8;
if (list.offsetHeight <= window.innerHeight + 2) { if (Math.abs(d) > 2) window.scrollTo(0, y); }
else if (fits) { if (Math.abs(d) > 2) window.scrollTo(0, y); }
else if (d > 2) {
window.scrollTo(0, y);
if (e.target.scrollIntoView) e.target.scrollIntoView({ block: "nearest" });
}
});
var reland = function () {
window.requestAnimationFrame(function () {
if (location.hash === "#lista" && Math.abs(window.pageYOffset - listY()) <= 2 && Math.abs(rest() - window.pageYOffset) > 2) window.scrollTo(0, rest());
});
};
if (location.hash === "#lista") {
window.scrollTo(0, rest());
if (document.readyState === "complete") reland(); else window.addEventListener("load", reland);
}
window.addEventListener("hashchange", reland);
})();
if (/[?&]diag\b/.test(location.search)) {
var box = document.createElement("pre"), frames = 0;
box.setAttribute("aria-hidden", "true");
box.style.cssText = "position:fixed;left:8px;right:8px;bottom:8px;z-index:9999;margin:0;padding:8px;font:11px/1.35 ui-monospace,Menlo,monospace;background:rgba(0,0,0,.8);color:#fff;border-radius:6px;pointer-events:none;white-space:pre-wrap;max-height:45vh;overflow:hidden";
document.body.appendChild(box);
(function f() { frames++; window.requestAnimationFrame(f); })();
var diag3d = function () {
var g = root.__porta && root.__porta.geo(), q = g && g.d3guard, nav = performance.getEntriesByType && performance.getEntriesByType("navigation")[0], t = g && g.d3times;
if (!g) return "path=CSS (the sequence stepped aside)";
return "path=" + (g.d3shown ? "3D" : "CSS") + " 3d=" + g.d3 + (g.d3 === "loading" ? ":" + g.d3stage + " " + g.d3ms + "ms" : "") + " why=" + (g.d3why || "-") + (g.d3dpr ? " dpr=" + g.d3dpr : "") + (g.d3slow ? " slow hand-backs " + g.d3slow.join("/") : "") +
(g.d3log && g.d3log.length ? "\n3d steps: load@" + (nav && nav.loadEventStart ? Math.round(nav.loadEventStart) : "-") + " " + g.d3log.join(" ") + (t ? " held=" + t.held + "ms" : "") : "") +
(q ? "\nguard=" + (q.on ? "on" : "off (measuring)") + " frames=" + q.n + " " + q.ms + "ms median=" + q.med + "ms worst=" + q.worst + "ms gpu lag=" + q.lag + "ms cadence=" + q.cadence + "ms not counted=" + q.off + (q.done ? " (done)" : "") : "");
};
setInterval(function () {
var st = document.querySelector(".porta__stage"), r = st && st.getBoundingClientRect();
box.textContent = [navigator.userAgent,
"y=" + Math.round(window.pageYOffset) + " ih=" + window.innerHeight + " vv=" + (window.visualViewport ? Math.round(window.visualViewport.height) : "-") + " docH=" + document.documentElement.scrollHeight,
"seq=" + root.getAttribute("data-sequence") + " theme=" + root.getAttribute("data-theme") + " cls=" + root.className,
diag3d(),
"stage top=" + (r ? Math.round(r.top) : "-") + " h=" + (st ? st.offsetHeight : "-") + " pos=" + (st ? getComputedStyle(st).position : "-"),
"frames/s=" + frames * 2, "errors: " + (ERR.length ? ERR.join(" | ") : "none")].join("\n");
frames = 0;
}, 500);
}
})();
