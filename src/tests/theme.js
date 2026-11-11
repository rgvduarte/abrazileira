// Test helper: open the site in a fixed theme, as a visitor who chose it on the control earlier in this visit.
// The page follows the sky over Torres Vedras on every visit; a choice holds only for the visit (sessionStorage
// "ab-tema" = "<theme>|<the sky then: dia or noite>|<the end of that day or night, ms>") and only while the sun stays
// on the same side of the horizon. The init script stores such a choice each time a document starts, computed with
// the page's own ephemeris (read from the built head script, so the two never differ) at the page's own clock (a
// page.clock installed before this call is the clock it reads).
//   const theme = require("./theme.js"); await theme(contextOrPage, "noite", dir);
// A test running across a real sunrise or sunset sees the choice lapse there, as a visitor would; pin the clock
// (page.clock.install) where that matters.
const fs = require("fs"), path = require("path");
const SOL = {};
function sol(dir) {
  if (!SOL[dir]) {
    const m = fs.readFileSync(path.join(dir, "index.html"), "utf8").match(/r\.__sol=(function\(m\)\{[^}]*\})/);
    if (!m) throw new Error("theme.js: no sun ephemeris (r.__sol) in " + path.join(dir, "index.html"));
    SOL[dir] = m[1];
  }
  return SOL[dir];
}
// the stored value for a choice of theme t made at time now (ms), as site.js writes it; f is the ephemeris
function choice(f, t, now) {
  const up = f(now); let m = 1;
  while (m <= 1440 && f(now + m * 60000) === up) m++;
  return t + "|" + (up ? "dia" : "noite") + "|" + (now + m * 60000);
}
module.exports = (target, t, dir) => {
  if (t !== "dia" && t !== "noite") throw new Error("theme.js: theme must be dia or noite, not " + t);
  return target.addInitScript({ content: `(function () { try {
    var f = ${sol(dir)};
    sessionStorage.setItem("ab-tema", (${choice.toString()})(f, ${JSON.stringify(t)}, Date.now()));
  } catch (e) {} })();` });
};
module.exports.sol = sol;
module.exports.choice = choice;
