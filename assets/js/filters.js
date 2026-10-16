// Filter chips on section pages. Progressive enhancement: without JS every post shows.
// Filters can be preset from the URL, e.g. /tinkering/?tags=fj-cruiser or /eating-out/?place=Taipei
(function () {
  var list = document.querySelector("[data-filterable]");
  var bar = document.querySelector("[data-filters]");
  if (!list || !bar) return;

  var items = Array.prototype.slice.call(list.querySelectorAll("[data-item]"));
  var groups = Array.prototype.slice.call(bar.querySelectorAll("[data-filter-group]"));
  var empty = document.querySelector("[data-empty]");
  var params = new URLSearchParams(window.location.search);
  var state = {};

  groups.forEach(function (group) {
    var key = group.getAttribute("data-filter-group");
    state[key] = params.get(key) || "";
    group.querySelectorAll("button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state[key] = btn.getAttribute("data-value");
        apply();
        syncUrl();
      });
    });
  });

  function matches(el) {
    return Object.keys(state).every(function (key) {
      var want = state[key];
      if (!want) return true;
      var have = (el.getAttribute("data-" + key) || "").split("|");
      return have.indexOf(want) !== -1;
    });
  }

  function apply() {
    var shown = 0;
    items.forEach(function (el) {
      var ok = matches(el);
      el.hidden = !ok;
      if (ok) shown++;
    });
    groups.forEach(function (group) {
      var key = group.getAttribute("data-filter-group");
      group.querySelectorAll("button").forEach(function (btn) {
        btn.setAttribute("aria-pressed", String(btn.getAttribute("data-value") === state[key]));
      });
    });
    if (empty) empty.hidden = shown > 0;
  }

  function syncUrl() {
    var next = new URLSearchParams();
    Object.keys(state).forEach(function (key) {
      if (state[key]) next.set(key, state[key]);
    });
    var qs = next.toString();
    history.replaceState(null, "", qs ? "?" + qs : window.location.pathname);
  }

  bar.hidden = false;
  apply();
})();
