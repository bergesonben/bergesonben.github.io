(function () {
  var versions = Array.prototype.slice.call(document.querySelectorAll(".recipe-version"));
  versions.forEach(function (section, i) {
    if (!section.id) section.id = "version-" + (i + 1);
  });

  // Version tabs on recipe posts with more than one <section class="recipe-version">.
  // Shows one version at a time. A #hash inside a version wins, then the last version
  // this browser picked on this page, then the first version. Each section's
  // .version-label names its tab, and data-serves / data-time override the fact strip.
  if (versions.length > 1) {
    var key = "recipe-version:" + location.pathname;
    var facts = ["serves", "time"].map(function (name) {
      var dd = document.querySelector('[data-fact="' + name + '"] dd');
      return { name: name, dd: dd, original: dd && dd.textContent };
    });

    var tabs = document.createElement("div");
    tabs.className = "version-tabs";
    tabs.setAttribute("role", "group");
    tabs.setAttribute("aria-label", "Recipe version");

    var buttons = versions.map(function (section) {
      var label = section.querySelector(".version-label");
      if (label) label.hidden = true;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip mono";
      btn.textContent = label ? label.textContent : section.id;
      btn.addEventListener("click", function () {
        show(section);
        try { localStorage.setItem(key, section.id); } catch (e) {}
        history.replaceState(null, "", "#" + section.id);
      });
      tabs.appendChild(btn);
      return btn;
    });
    versions[0].before(tabs);

    var show = function (shown) {
      versions.forEach(function (section, i) {
        section.hidden = section !== shown;
        buttons[i].setAttribute("aria-pressed", section === shown ? "true" : "false");
      });
      facts.forEach(function (f) {
        if (!f.dd) return;
        var v = shown.dataset[f.name];
        f.dd.textContent = v ? (f.name === "time" ? v + " min" : v) : f.original;
      });
    };

    // Scrolls on the next frame so it lands after the browser restores the old scroll
    // position on back/forward, which is stale once a different version is showing.
    var fromHash = function () {
      var target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (!target) return false;
      var section = target.closest(".recipe-version");
      if (section) show(section);
      requestAnimationFrame(function () { target.scrollIntoView(); });
      return !!section;
    };

    if (!fromHash()) {
      var saved = null;
      try { saved = localStorage.getItem(key); } catch (e) {}
      show(versions.filter(function (s) { return s.id === saved; })[0] || versions[0]);
    }
    window.addEventListener("hashchange", fromHash);
  }

  // "Copy ingredients" button on recipe posts. Copies the list under the Ingredients
  // heading (including lists under ### subheadings), one item per line, so it pastes
  // into a Keep checklist as separate items. Each recipe version gets its own button.
  if (!navigator.clipboard) return;
  var containers = versions.length ? versions : [document.querySelector(".prose")].filter(Boolean);
  containers.forEach(function (container) {
    var heading = Array.prototype.filter.call(container.querySelectorAll("h2"), function (h) {
      return /^ingredients\b/i.test(h.textContent.trim());
    })[0];
    if (!heading) return;

    var items = [];
    for (var el = heading.nextElementSibling; el && el.tagName !== "H2"; el = el.nextElementSibling) {
      if (el.tagName !== "UL") continue;
      Array.prototype.forEach.call(el.querySelectorAll(":scope > li"), function (li) {
        items.push(li.textContent.trim());
      });
    }
    if (!items.length) return;
    var text = items.join("\n");

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip mono";
    btn.setAttribute("aria-live", "polite");
    btn.textContent = "Copy ingredients";
    heading.after(btn);

    var timer;
    btn.addEventListener("click", function () {
      navigator.clipboard.writeText(text).then(
        function () { flash("Copied"); },
        function () { flash("Couldn't copy"); }
      );
    });

    function flash(label) {
      btn.textContent = label;
      clearTimeout(timer);
      timer = setTimeout(function () { btn.textContent = "Copy ingredients"; }, 2000);
    }
  });
})();
