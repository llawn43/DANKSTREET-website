/* =========================================================================
   hero.js — rotating photo wash behind the DANK STREET slab
   Reads window.DANK_STREET.heroPhotos and cycles with a soft crossfade.
   ========================================================================= */
(function () {
  "use strict";

  var data = window.DANK_STREET || {};
  var photos = data.heroPhotos || [];
  var bg = document.getElementById("heroBg");
  var logo = document.getElementById("heroLogo");
  if (!bg || !photos.length) return;

  if (logo && data.logo) logo.src = data.logo;

  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  photos.forEach(function (src, i) {
    var el = document.createElement("div");
    el.className = "hero-bg-slide" + (i === 0 ? " is-active" : "");
    el.style.backgroundImage = 'url("' + src + '")';
    bg.appendChild(el);
  });

  if (reduceMotion || photos.length < 2) return;

  var idx = 0;
  var slides = bg.querySelectorAll(".hero-bg-slide");
  setInterval(function () {
    slides[idx].classList.remove("is-active");
    idx = (idx + 1) % slides.length;
    slides[idx].classList.add("is-active");
  }, 5500);
})();
