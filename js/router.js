/* =========================================================================
   router.js — hash routing + section rendering from content.js
   Routes: #home #music #tour #socials #merch #contact
   ========================================================================= */
(function () {
  "use strict";

  var data = window.DANK_STREET || {};
  var root = document.getElementById("root");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll("[data-nav]"));

  // Footer year
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- helpers ---
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function attr(s) {
    return esc(s);
  }
  function isRealUrl(u) {
    return u && u !== "#";
  }

  function sectionHead(index, title) {
    return (
      '<div class="section-head">' +
      '<span class="section-index">' + esc(index) + "</span>" +
      '<h2 class="section-title" data-scramble="' + attr(title) + '">' + esc(title) + "</h2>" +
      "</div>"
    );
  }

  // --- section renderers ---
  function renderMusic() {
    var tracks = data.tracks || [];
    var cards = tracks
      .map(function (t) {
        var cover = t.cover
          ? '<img class="release-cover" src="' + attr(t.cover) + '" alt="' + attr(t.title) + ' cover" loading="lazy" />'
          : '<div class="release-cover placeholder">' + esc(t.title) + "</div>";
        var links = (t.links || [])
          .filter(function (l) {
            return isRealUrl(l.url);
          })
          .map(function (l) {
            return '<a class="btn sm" href="' + attr(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + "</a>";
          })
          .join("");
        var embed = t.embed
          ? '<div class="embed-wrap"><iframe src="' + attr(t.embed) + '" height="152" loading="lazy" allow="autoplay; encrypted-media" allowtransparency="true"></iframe></div>'
          : "";
        return (
          '<article class="card">' +
          cover +
          '<div class="release-body">' +
          '<h3 class="release-title">' + esc(t.title) + "</h3>" +
          '<div class="release-meta">' + esc(t.year || "") + "</div>" +
          (links ? '<div class="release-links">' + links + "</div>" : "") +
          "</div>" +
          embed +
          "</article>"
        );
      })
      .join("");
    return (
      '<section class="section">' +
      sectionHead("01", "Music") +
      (tracks.length
        ? '<div class="grid cols-3">' + cards + "</div>"
        : '<div class="empty-state">Releases coming soon.</div>') +
      "</section>"
    );
  }

  function renderTour() {
    var dates = data.tour || [];
    var rows = dates
      .map(function (d) {
        var cta = isRealUrl(d.tickets)
          ? '<a class="btn sm primary" href="' + attr(d.tickets) + '" target="_blank" rel="noopener">Tickets</a>'
          : '<span class="release-meta">Soon</span>';
        return (
          '<div class="tour-row">' +
          '<div class="tour-date">' + esc(d.date) + "</div>" +
          '<div class="tour-place"><span class="tour-city">' + esc(d.city) + "</span>" +
          '<span class="tour-venue">' + esc(d.venue || "") + "</span></div>" +
          cta +
          "</div>"
        );
      })
      .join("");
    return (
      '<section class="section">' +
      sectionHead("02", "Tour") +
      (dates.length ? rows : '<div class="empty-state">No dates announced. Check back soon.</div>') +
      "</section>"
    );
  }

  function renderSocials() {
    var socials = (data.socials || []).filter(function (s) {
      return isRealUrl(s.url);
    });
    var links = socials
      .map(function (s) {
        var icon = s.icon
          ? '<span class="social-icon" style="--icon:url(&quot;' + attr(s.icon) + '&quot;)" aria-hidden="true"></span>'
          : "";
        return (
          '<a class="btn" href="' + attr(s.url) + '" target="_blank" rel="noopener">' +
          icon +
          esc(s.label) +
          "</a>"
        );
      })
      .join("");
    return (
      '<section class="section">' +
      sectionHead("03", "Socials") +
      (socials.length
        ? '<div class="social-list">' + links + "</div>"
        : '<div class="empty-state">Social links coming soon.</div>') +
      "</section>"
    );
  }

  function renderMerch() {
    var m = data.merch || {};
    var badge = m.status
      ? '<div class="coming-soon">' + esc(m.status) + "</div>"
      : "";
    return (
      '<section class="section">' +
      sectionHead("04", "Merch") +
      badge +
      "<p class=\"lead\">" + esc(m.blurb || "") + "</p>" +
      '<form class="form" id="merchForm" novalidate>' +
      '<div class="field"><label for="mc-email">Email</label>' +
      '<input id="mc-email" name="email" type="email" placeholder="you@email.com" autocomplete="email" required /></div>' +
      '<button class="btn primary" type="submit">' + esc(m.cta || "Notify me") + "</button>" +
      '<p class="form-note" id="merchNote" role="status"></p>' +
      "</form>" +
      "</section>"
    );
  }

  function renderContact() {
    var c = data.contact || {};
    var lines = (c.lines || [])
      .map(function (l) {
        return (
          '<div class="tour-row"><div class="tour-date" style="min-width:120px">' +
          esc(l.label) +
          '</div><a href="mailto:' + attr(l.value) + '">' + esc(l.value) + "</a></div>"
        );
      })
      .join("");
    var shot = data.headshot
      ? '<img class="contact-shot" src="' + attr(data.headshot) + '" alt="DANK STREET" loading="lazy" />'
      : "";
    var actions = [];
    if (c.email) {
      actions.push('<a class="btn primary" href="mailto:' + attr(c.email) + '">Email bookings</a>');
    }
    if (data.epk) {
      actions.push(
        '<a class="btn" href="' + attr(data.epk) + '" download="DANK-STREET-EPK.jpg" target="_blank" rel="noopener">Download EPK</a>'
      );
    }
    var body =
      "<p class=\"lead\">" + esc(c.blurb || "") + "</p>" +
      (lines || "") +
      (actions.length ? '<div class="contact-actions">' + actions.join("") + "</div>" : "");
    return (
      '<section class="section">' +
      sectionHead("05", "Contact") +
      (shot
        ? '<div class="contact-layout">' + shot + '<div>' + body + "</div></div>"
        : body) +
      "</section>"
    );
  }

  var ROUTES = {
    home: null, // hero only
    music: renderMusic,
    tour: renderTour,
    socials: renderSocials,
    merch: renderMerch,
    contact: renderContact,
  };

  // Retired hashes that should still resolve for old links and bookmarks.
  var ALIASES = { signup: "merch" };

  function currentRoute() {
    var h = (location.hash || "#home").replace("#", "").trim();
    if (ALIASES[h]) h = ALIASES[h];
    return ROUTES.hasOwnProperty(h) ? h : "home";
  }

  function setActiveNav(route) {
    navLinks.forEach(function (a) {
      var target = a.getAttribute("href").replace("#", "");
      a.classList.toggle("is-active", target === route);
    });
  }

  function render() {
    var route = currentRoute();
    setActiveNav(route);
    document.body.classList.toggle("route-active", route !== "home");

    if (route === "home") {
      root.innerHTML = "";
      if (window.DankSlab) window.DankSlab.nudge(0.22);
    } else {
      root.innerHTML = ROUTES[route]();
      if (window.Scramble) window.Scramble.autoInit(root);
      if (route === "merch") wireMerch();
      // Scroll content into view below the hero.
      root.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  // --- Merch list form handling (validation + endpoint / mailto fallback) ---
  function wireMerch() {
    var form = document.getElementById("merchForm");
    var note = document.getElementById("merchNote");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      note.className = "form-note";
      note.textContent = "";

      var input = form.querySelector('input[name="email"]');
      var email = (input.value || "").trim();
      var valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!valid) {
        note.classList.add("err");
        note.textContent = "Please enter a valid email address.";
        input.focus();
        return;
      }

      var endpoint = (data.merch && data.merch.endpoint) || "";
      if (window.DankAudio) window.DankAudio.sfx("click");

      if (!endpoint) {
        // Fallback: open a pre-filled mailto to the booking/contact address.
        var to = (data.contact && data.contact.email) || "";
        note.classList.add("ok");
        note.textContent = "Opening your email app...";
        var subject = encodeURIComponent("Add me to the DANK STREET merch list");
        var body = encodeURIComponent("Notify me about merch drops: " + email);
        window.location.href = "mailto:" + to + "?subject=" + subject + "&body=" + body;
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      note.classList.add("ok");
      note.textContent = "Submitting...";

      fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ email: email }),
      })
        .then(function (res) {
          if (!res.ok) throw new Error("bad status");
          note.className = "form-note ok";
          note.textContent = "You're on the list. We'll hit you when the first drop lands.";
          form.reset();
        })
        .catch(function () {
          note.className = "form-note err";
          note.textContent = "Something went wrong. Try again later.";
        })
        .finally(function () {
          btn.disabled = false;
        });
    });
  }

  window.addEventListener("hashchange", render);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
