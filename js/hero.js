/* =========================================================================
   hero.js — rotating photo wash behind the DANK STREET slab
   Reads window.DANK_STREET.heroPhotos and cycles with a soft crossfade.
   First slide loads immediately; later slides lazy-load on first advance
   (or shortly after idle) to keep LCP lighter.
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

  var slides = [];
  photos.forEach(function (src, i) {
    var el = document.createElement("div");
    el.className = "hero-bg-slide" + (i === 0 ? " is-active" : "");
    el.dataset.src = src;
    if (i === 0) {
      el.style.backgroundImage = 'url("' + src + '")';
      el.dataset.loaded = "1";
      // Warm the LCP image
      var link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);
    }
    bg.appendChild(el);
    slides.push(el);
  });

  function ensureLoaded(el) {
    if (!el || el.dataset.loaded === "1") return;
    el.style.backgroundImage = 'url("' + el.dataset.src + '")';
    el.dataset.loaded = "1";
  }

  // Prefetch the rest after first paint / idle
  var warm = function () {
    slides.forEach(function (el, i) {
      if (i === 0) return;
      var img = new Image();
      img.onload = function () {
        ensureLoaded(el);
      };
      img.src = el.dataset.src;
    });
  };
  if (window.requestIdleCallback) {
    requestIdleCallback(warm, { timeout: 2500 });
  } else {
    setTimeout(warm, 1200);
  }

  if (reduceMotion || photos.length < 2) return;

  var idx = 0;
  setInterval(function () {
    slides[idx].classList.remove("is-active");
    idx = (idx + 1) % slides.length;
    ensureLoaded(slides[idx]);
    // Prefetch next
    ensureLoaded(slides[(idx + 1) % slides.length]);
    slides[idx].classList.add("is-active");
  }, 5500);
})();
