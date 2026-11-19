(function () {
  var root = document.querySelector("[data-tabs]");
  if (!root) return;

  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(
    list.querySelectorAll('[role="tab"]')
  );
  var panels = tabs.map(function (tab) {
    return document.getElementById(tab.getAttribute("aria-controls"));
  });

  // JS is running: show the tabs, hide the duplicate headings.
  list.hidden = false;
  root.querySelectorAll(".schedule-heading").forEach(function (h) {
    h.classList.add("visually-hidden");
  });

  function nameOf(tab) {
    return tab.id.replace("tab-", "");
  }

  function indexFromHash() {
    var name = window.location.hash.replace("#", "");
    for (var i = 0; i < tabs.length; i++) {
      if (nameOf(tabs[i]) === name) return i;
    }
    return 0;
  }

  function select(i, focus, setHash) {
    tabs.forEach(function (tab, n) {
      var on = n === i;
      tab.setAttribute("aria-selected", on ? "true" : "false");
      tab.tabIndex = on ? 0 : -1;
      panels[n].hidden = !on;
    });
    if (focus) tabs[i].focus();
    if (setHash) {
      history.replaceState(null, "", "#" + nameOf(tabs[i]));
    }
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () {
      select(i, false, true);
    });
    tab.addEventListener("keydown", function (e) {
      var next = null;
      if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
      if (e.key === "ArrowLeft") {
        next = (i - 1 + tabs.length) % tabs.length;
      }
      if (e.key === "Home") next = 0;
      if (e.key === "End") next = tabs.length - 1;
      if (next === null) return;
      e.preventDefault();
      select(next, true, true);
    });
  });

  window.addEventListener("hashchange", function () {
    select(indexFromHash(), false, false);
  });

  select(indexFromHash(), false, false);
})();
