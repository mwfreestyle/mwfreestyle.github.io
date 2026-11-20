(function () {
  var v = document.querySelector(".volunteer-video video");
  if (!v) return;
  var q = "(prefers-reduced-motion: reduce)";
  if (window.matchMedia(q).matches) {
    v.pause();
    v.removeAttribute("autoplay");
    v.controls = true;
  }
})();
