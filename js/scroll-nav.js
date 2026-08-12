/* =========================================================================
   scroll-nav.js — wheel / touch section paging through header order
   home → music → tour → media → socials → merch → contact
   - Scroll down at page bottom (or on home) → next section
   - Scroll up while still in the hero band / at page top → home
   ========================================================================= */
(function () {
  "use strict";

  var ORDER = ["home", "music", "tour", "media", "socials", "merch", "contact"];
  var THRESH = 70;
  var COOLDOWN_MS = 850;
  var EDGE_PX = 8;

  var locked = false;
  var acc = 0;
  var touchY = null;
  var homeArmed = false;

  window.__DANK_SCROLL_NAV = true;

  function currentRoute() {
    var h = (location.hash || "#home").replace("#", "").trim().toLowerCase();
    if (h === "signup") h = "merch";
    if (h === "gallery") h = "media";
    if (h === "about") h = "contact";
    return ORDER.indexOf(h) >= 0 ? h : "home";
  }

  function maxScroll() {
    var docEl = document.documentElement;
    return Math.max(0, docEl.scrollHeight - window.innerHeight);
  }

  function atTop() {
    return window.scrollY <= EDGE_PX;
  }

  function atBottom() {
    var max = maxScroll();
    if (max <= EDGE_PX) return true;
    return window.scrollY >= max - EDGE_PX;
  }

  function heroBandBottom() {
    var hero = document.getElementById("hero");
    if (!hero) return 120;
    return Math.round(hero.getBoundingClientRect().height) + 24;
  }

  function inHeroBand() {
    return window.scrollY <= heroBandBottom();
  }

  function scrollableTarget(el) {
    while (el && el !== document.body && el !== document.documentElement) {
      if (el instanceof HTMLElement) {
        var style = window.getComputedStyle(el);
        var oy = style.overflowY;
        if (
          (oy === "auto" || oy === "scroll" || oy === "overlay") &&
          el.scrollHeight > el.clientHeight + 1
        ) {
          return el;
        }
      }
      el = el.parentElement;
    }
    return null;
  }

  function go(route) {
    if (locked) return;
    var from = currentRoute();
    if (route === from) return;
    locked = true;
    acc = 0;
    homeArmed = false;
    if (route === "home") {
      location.hash = "#home";
      window.scrollTo(0, 0);
    } else {
      location.hash = "#" + route;
    }
    window.setTimeout(function () {
      locked = false;
      acc = 0;
    }, COOLDOWN_MS);
  }

  function neighbor(dir) {
    var idx = ORDER.indexOf(currentRoute());
    if (idx < 0) idx = 0;
    var next = idx + dir;
    if (next < 0 || next >= ORDER.length) return null;
    return ORDER[next];
  }

  function onIntent(deltaY, target) {
    if (locked) return;
    if (Math.abs(deltaY) < 1) return;
    if (scrollableTarget(target)) return;

    var route = currentRoute();
    var down = deltaY > 0;

    if (route === "home") {
      if (down) {
        acc += Math.abs(deltaY);
        if (acc >= THRESH) go("music");
      } else {
        acc = 0;
      }
      return;
    }

    // Parked just under the hero: scroll-up returns home immediately.
    if (!down && inHeroBand()) {
      acc += Math.abs(deltaY);
      if (acc >= THRESH) go("home");
      return;
    }

    if (down && atBottom()) {
      acc += Math.abs(deltaY);
      if (acc >= THRESH) {
        var next = neighbor(1);
        if (next) go(next);
        else acc = 0;
      }
      return;
    }

    if (!down && atTop()) {
      acc += Math.abs(deltaY);
      if (acc >= THRESH) go("home");
      return;
    }

    acc = 0;
  }

  window.addEventListener(
    "wheel",
    function (e) {
      if (e.ctrlKey) return;
      var route = currentRoute();
      var upInHero = e.deltaY < 0 && route !== "home" && inHeroBand();
      var edgeIntent =
        (route === "home" && e.deltaY > 0) ||
        (e.deltaY > 0 && atBottom()) ||
        (e.deltaY < 0 && atTop() && route !== "home") ||
        upInHero;
      if (edgeIntent && !scrollableTarget(e.target)) {
        if (Math.abs(acc) + Math.abs(e.deltaY) >= THRESH * 0.5 || locked || upInHero) {
          e.preventDefault();
        }
      }
      onIntent(e.deltaY, e.target);
    },
    { passive: false }
  );

  window.addEventListener(
    "touchstart",
    function (e) {
      if (!e.touches || !e.touches.length) return;
      touchY = e.touches[0].clientY;
    },
    { passive: true }
  );

  window.addEventListener(
    "touchend",
    function (e) {
      if (touchY == null) return;
      var y = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientY : touchY;
      var dy = touchY - y;
      touchY = null;
      if (Math.abs(dy) < 40) return;
      onIntent(dy, e.target);
    },
    { passive: true }
  );

  window.addEventListener(
    "scroll",
    function () {
      if (locked) return;
      var route = currentRoute();
      if (route === "home") {
        homeArmed = false;
        return;
      }
      if (window.scrollY > heroBandBottom() + 40) homeArmed = true;
      if (homeArmed && atTop()) {
        homeArmed = false;
        go("home");
      }
    },
    { passive: true }
  );
})();
