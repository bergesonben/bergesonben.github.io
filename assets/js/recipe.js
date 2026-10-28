// "Copy ingredients" button on recipe posts. Copies the list under the Ingredients
// heading (including lists under ### subheadings), one item per line, so it pastes
// into a Keep checklist as separate items.
(function () {
  var heading = document.getElementById("ingredients");
  if (!heading || !navigator.clipboard) return;

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
})();
