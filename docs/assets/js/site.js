/* A Brazileira · Dia / Noite (progressive enhancement: without JS the page follows the system). */
(function () {
  var root = document.documentElement,
    group = document.querySelector("[data-theme-switch]"),
    dark = window.matchMedia("(prefers-color-scheme: dark)"),
    still = window.matchMedia("(prefers-reduced-motion: reduce)"),
    KEY = "ab-tema",
    timer;
  if (!group) return;
  var buttons = group.querySelectorAll("[data-theme-set]");

  function current() {
    var t = root.getAttribute("data-theme");
    return t === "dia" || t === "noite" ? t : dark.matches ? "noite" : "dia";
  }
  function sync() {
    var t = current(), i, metas = document.querySelectorAll('meta[name="theme-color"]');
    for (i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute("aria-pressed", String(buttons[i].getAttribute("data-theme-set") === t));
    }
    if (root.hasAttribute("data-theme")) {
      var bg = getComputedStyle(root).getPropertyValue("--color-bg").trim() || getComputedStyle(document.body).backgroundColor;
      for (i = 0; i < metas.length; i++) metas[i].setAttribute("content", bg);
    }
  }
  function apply(t) {
    root.setAttribute("data-theme", t);
    try { localStorage.setItem(KEY, t); } catch (e) {}
    sync();
  }
  group.addEventListener("click", function (e) {
    var b = e.target.closest("[data-theme-set]");
    if (!b) return;
    var t = b.getAttribute("data-theme-set");
    if (t === current()) return;
    if (still.matches) return apply(t);
    if (document.startViewTransition) {
      document.startViewTransition(function () { apply(t); });
      return;
    }
    root.classList.add("is-theming");
    apply(t);
    clearTimeout(timer);
    timer = setTimeout(function () { root.classList.remove("is-theming"); }, 450);
  });
  if (dark.addEventListener) dark.addEventListener("change", sync);
  group.hidden = false;
  sync();
})();
