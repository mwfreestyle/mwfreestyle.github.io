
(function () {
  "use strict";

  function setFlipped(card, flipped) {
    var front = card.querySelector(".coach-face-front");
    var back = card.querySelector(".coach-face-back");
    var openBtn = card.querySelector(".coach-flip-open");
    var bio = card.querySelector(".coach-bio-scroll");

    card.classList.toggle("is-flipped", flipped);
    openBtn.setAttribute("aria-expanded", String(flipped));

    // Hide the face that is turned away: no focus, clicks or AT.
    front.inert = flipped;
    back.inert = !flipped;

    // Keep focus on the visible side. preventScroll avoids jumps
    // caused by the 3D transform during the flip.
    var target = flipped ? bio : openBtn;
    target.focus({ preventScroll: true });
  }

  document.querySelectorAll(".coach-card").forEach(function (card) {
    var openBtn = card.querySelector(".coach-flip-open");
    var closeBtn = card.querySelector(".coach-flip-close");
    var back = card.querySelector(".coach-face-back");

    if (!openBtn || !closeBtn || !back) {
      return;
    }

    openBtn.addEventListener("click", function () {
      setFlipped(card, true);
    });

    closeBtn.addEventListener("click", function () {
      setFlipped(card, false);
    });

    back.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setFlipped(card, false);
      }
    });
  });
})();
