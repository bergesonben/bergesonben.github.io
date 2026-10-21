// "Copy ingredients" button on recipe posts. Copies the list under the Ingredients
// heading, one item per line, so it pastes into a Keep checklist as separate items.
(function () {
  var heading = document.getElementById("ingredients");
  var list = heading && heading.nextElementSibling;
  if (!list || list.tagName !== "UL" || !navigator.clipboard) return;

  var text = Array.prototype.map.call(list.querySelectorAll(":scope > li"), function (li) {
    return li.textContent.trim();
  }).join("\n");

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
})();
