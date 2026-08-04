/* =========================================================================
   scramble.js — text scramble / glitch reveal effect
   Exposes: window.Scramble.to(el, text, opts)
            window.Scramble.apply(el, opts)  // scramble element's own text
            auto-inits any [data-scramble] element on load
   ========================================================================= */
(function () {
  "use strict";

  var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*/\\<>_-=+";
  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function rand(set) {
    return set.charAt(Math.floor(Math.random() * set.length));
  }

  // Animate `el` from its current text to `text` with a scramble reveal.
  function to(el, text, opts) {
    if (!el) return Promise.resolve();
    opts = opts || {};
    var duration = opts.duration || 900;
    var chars = opts.chars || CHARS;

    if (reduceMotion) {
      el.textContent = text;
      return Promise.resolve();
    }

    var from = el.textContent || "";
    var length = Math.max(from.length, text.length);
    var start = performance.now();

    // Each character resolves at a staggered point in the timeline.
    var reveal = [];
    for (var i = 0; i < length; i++) {
      var s = Math.floor(Math.random() * (duration * 0.5));
      var e = s + Math.floor(duration * 0.4 + Math.random() * duration * 0.4);
      reveal.push([s, e]);
    }

    return new Promise(function (resolve) {
      function frame(now) {
        var elapsed = now - start;
        var out = "";
        var done = 0;
        for (var i = 0; i < length; i++) {
          var target = text[i] || "";
          var win = reveal[i];
          if (elapsed >= win[1]) {
            out += target;
            done++;
          } else if (elapsed >= win[0]) {
            out += target === " " ? " " : rand(chars);
          } else {
            out += from[i] ? rand(chars) : "";
          }
        }
        el.textContent = out;
        if (done === length) {
          el.textContent = text;
          resolve();
        } else {
          requestAnimationFrame(frame);
        }
      }
      requestAnimationFrame(frame);
    });
  }

  // Scramble an element into the text stored in data-scramble (or its own text).
  function apply(el, opts) {
    var text = el.getAttribute("data-scramble") || el.textContent || "";
    return to(el, text, opts);
  }

  function autoInit(root) {
    var scope = root || document;
    var els = scope.querySelectorAll("[data-scramble]");
    els.forEach(function (el, idx) {
      setTimeout(function () {
        apply(el, { duration: 1100 });
      }, 120 * idx);
    });
  }

  window.Scramble = { to: to, apply: apply, autoInit: autoInit, CHARS: CHARS };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      autoInit(document);
    });
  } else {
    autoInit(document);
  }
})();
