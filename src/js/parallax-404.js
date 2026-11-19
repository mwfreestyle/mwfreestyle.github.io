// Mouse-move parallax for the 404 sign and patrol layers.
// No scroll dependency -- layers drift with cursor position.
// On narrow viewports, device tilt drives the same effect
// instead, where the browser allows it without a permission
// prompt (i.e. not iOS Safari).
(function () {
  "use strict";
  var prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReduced) {
    return;
  }
  var isNarrow = window.matchMedia(
    "(max-width: 600px)"
  ).matches;
  var section = document.getElementById("error-404");
  var layers = document.querySelectorAll(
    "#error-404 .error-404__layer"
  );
  if (!section || !layers.length) {
    return;
  }
  var ticking = false;
  var mouseX = 0;
  var mouseY = 0;

  function getDepth(layer) {
    var attr = isNarrow && layer.hasAttribute(
      "data-depth-mobile"
    ) ? "data-depth-mobile" : "data-depth";
    return parseFloat(layer.getAttribute(attr)) || 0.2;
  }

  function applyShift(relX, relY) {
    layers.forEach(function (layer) {
      var depth = getDepth(layer);
      var maxShift = 60; // px, tune to taste
      var shiftX = relX * maxShift * depth * 2;
      var shiftY = relY * maxShift * depth * 2;
      layer.style.transform =
        "translate(" + shiftX + "px, " +
        shiftY + "px)";
    });
    ticking = false;
  }

  function updateLayersFromMouse() {
    var rect = section.getBoundingClientRect();
    var relX = (mouseX - rect.left) / rect.width - 0.5;
    var relY = (mouseY - rect.top) / rect.height - 0.5;
    applyShift(relX, relY);
  }

  function onMouseMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    if (!ticking) {
      window.requestAnimationFrame(updateLayersFromMouse);
      ticking = true;
    }
  }

  function onDeviceOrientation(event) {
    // gamma: left-right tilt, -90..90
    // beta: front-back tilt, -180..180
    if (event.gamma === null || event.beta === null) {
      return;
    }
    var relX = Math.max(-1, Math.min(1, event.gamma / 45)) / 2;
    var relY = Math.max(-1, Math.min(1,
      (event.beta - 45) / 45
    )) / 2;
    if (!ticking) {
      window.requestAnimationFrame(function () {
        applyShift(relX, relY);
      });
      ticking = true;
    }
  }

  function recentre() {
    layers.forEach(function (layer) {
      layer.style.transform = "translate(0, 0)";
    });
  }

  if (isNarrow) {
    // Only wire up tilt where the browser exposes it
    // without a permission gate (mainly Android). iOS
    // Safari is silently skipped rather than prompting.
    var needsPermission =
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission ===
        "function";
    if (!needsPermission &&
        typeof DeviceOrientationEvent !== "undefined") {
      window.addEventListener(
        "deviceorientation",
        onDeviceOrientation
      );
    }
    return;
  }

  section.addEventListener("mousemove", onMouseMove);
  section.addEventListener("mouseleave", recentre);
})();

