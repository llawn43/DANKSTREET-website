/* =========================================================================
   audio.js — Dank Street release preview playlist + UI sound effects
   - Autoplay-safe: audio only starts after a user gesture (button/first click).
   - Cycles 30s release previews from content.js audio.playlist.
   - Toggle reflects on/off; preference stored in localStorage.
   - Exposes window.DankAudio.sfx("hover"|"click") for other scripts.
   ========================================================================= */
(function () {
  "use strict";

  var cfg = (window.DANK_STREET && window.DANK_STREET.audio) || {};
  var bg = document.getElementById("bgAudio");
  var sfxHover = document.getElementById("sfxHover");
  var sfxClick = document.getElementById("sfxClick");
  var toggle = document.getElementById("audioToggle");
  var label = toggle ? toggle.querySelector(".audio-label") : null;

  var STORAGE_KEY = "dankstreet-sound";
  var enabled = false;

  var playlist = Array.isArray(cfg.playlist) ? cfg.playlist.slice() : [];
  if (!playlist.length && cfg.ambient) {
    playlist = [{ src: cfg.ambient, label: "" }];
  }

  var index = 0;

  if (sfxHover) sfxHover.src = cfg.hover || "";
  if (sfxClick) sfxClick.src = cfg.click || "";

  function current() {
    return playlist[index] || null;
  }

  function setLabel() {
    if (!label) return;
    if (!enabled) {
      label.textContent = "SOUND OFF";
    } else {
      var item = current();
      label.textContent = item && item.label ? item.label : "SOUND ON";
    }
    if (toggle) toggle.setAttribute("aria-pressed", enabled ? "true" : "false");
    if (toggle) {
      var tip = enabled
        ? "Playing " + ((current() && current().label) || "Dank Street") + " — tap to mute"
        : "Play Dank Street release previews";
      toggle.title = tip;
    }
  }

  function loadTrack(i) {
    if (!bg || !playlist.length) return;
    index = ((i % playlist.length) + playlist.length) % playlist.length;
    var item = playlist[index];
    bg.src = item.src;
    bg.load();
  }

  function playBg() {
    if (!bg || !playlist.length) return;
    if (!bg.getAttribute("src")) loadTrack(index);
    var p = bg.play();
    if (p && p.catch) p.catch(function () {});
  }

  function nextTrack() {
    if (!playlist.length) return;
    loadTrack(index + 1);
    if (enabled) playBg();
    setLabel();
  }

  function enable() {
    enabled = true;
    if (!bg.getAttribute("src")) loadTrack(index);
    playBg();
    setLabel();
    try {
      localStorage.setItem(STORAGE_KEY, "on");
    } catch (e) {}
  }

  function disable() {
    enabled = false;
    if (bg) bg.pause();
    setLabel();
    try {
      localStorage.setItem(STORAGE_KEY, "off");
    } catch (e) {}
  }

  function sfx(kind) {
    if (!enabled) return;
    var el = kind === "hover" ? sfxHover : sfxClick;
    if (!el || !el.getAttribute("src")) return;
    try {
      el.currentTime = 0;
      var p = el.play();
      if (p && p.catch) p.catch(function () {});
    } catch (e) {}
  }

  if (bg) {
    bg.removeAttribute("loop");
    bg.addEventListener("ended", function () {
      if (!enabled) return;
      nextTrack();
    });
  }

  if (playlist.length) loadTrack(0);

  if (toggle) {
    toggle.addEventListener("click", function () {
      if (enabled) disable();
      else enable();
    });
  }

  document.addEventListener(
    "mouseover",
    function (e) {
      var t = e.target.closest && e.target.closest(".nav-link, .btn");
      if (t) sfx("hover");
    },
    true
  );

  var pref = null;
  try {
    pref = localStorage.getItem(STORAGE_KEY);
  } catch (e) {}

  if (pref === "on") {
    var resume = function () {
      enable();
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("keydown", resume);
    };
    window.addEventListener("pointerdown", resume, { once: true });
    window.addEventListener("keydown", resume, { once: true });
  }

  setLabel();

  window.DankAudio = {
    sfx: sfx,
    enable: enable,
    disable: disable,
    next: nextTrack,
  };
})();
