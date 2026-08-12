/* =========================================================================
   router.js — hash routing + section rendering from content.js
   Routes: #home #music #tour #media #socials #merch #contact
   Merch CTA opens merch.subscribeUrl (Feature.fm).
   Tour past dates (isoDate) auto-archive. Contact form uses FormSubmit AJAX.
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

  function todayIso() {
    var d = new Date();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  function splitTour() {
    var today = todayIso();
    var upcoming = [];
    var past = (data.tourPast || []).slice();
    (data.tour || []).forEach(function (d) {
      if (d.isoDate && d.isoDate < today) past.push(d);
      else upcoming.push(d);
    });
    past.sort(function (a, b) {
      return String(b.isoDate || "").localeCompare(String(a.isoDate || ""));
    });
    return { upcoming: upcoming, past: past };
  }

  function sectionHead(index, title) {
    return (
      '<div class="section-head">' +
      '<span class="section-index">' +
      esc(index) +
      "</span>" +
      '<h2 class="section-title" data-scramble="' +
      attr(title) +
      '">' +
      esc(title) +
      "</h2>" +
      "</div>"
    );
  }

  function icsFor(d) {
    if (!d.isoDate) return "";
    var start = d.isoDate.replace(/-/g, "") + "T210000";
    var end = d.isoDate.replace(/-/g, "") + "T235900";
    var summary = "DANK STREET — " + (d.venue || d.city || "Show");
    var desc = [d.city, d.venue, d.tickets].filter(Boolean).join(" | ");
    var body =
      "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//DANK STREET//Tour//EN\r\n" +
      "BEGIN:VEVENT\r\nDTSTART:" +
      start +
      "\r\nDTEND:" +
      end +
      "\r\nSUMMARY:" +
      summary.replace(/[,;\\]/g, " ") +
      "\r\nDESCRIPTION:" +
      desc.replace(/[,;\\]/g, " ") +
      "\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n";
    return "data:text/calendar;charset=utf-8," + encodeURIComponent(body);
  }

  function tourRows(dates, withIcs) {
    return dates
      .map(function (d) {
        var cta = isRealUrl(d.tickets)
          ? '<a class="btn sm primary" href="' +
            attr(d.tickets) +
            '" target="_blank" rel="noopener">Tickets</a>'
          : '<span class="release-meta">Soon</span>';
        var ics = withIcs && d.isoDate
          ? '<a class="btn sm" href="' +
            attr(icsFor(d)) +
            '" download="dank-street-' +
            attr(d.isoDate) +
            '.ics">.ics</a>'
          : "";
        return (
          '<div class="tour-row">' +
          '<div class="tour-date">' +
          esc(d.date) +
          "</div>" +
          '<div class="tour-place"><span class="tour-city">' +
          esc(d.city) +
          '</span><span class="tour-venue">' +
          esc(d.venue || "") +
          "</span></div>" +
          '<div class="tour-actions">' +
          cta +
          ics +
          "</div>" +
          "</div>"
        );
      })
      .join("");
  }

  // --- section renderers ---
  function renderMusic() {
    var tracks = data.tracks || [];
    var cards = tracks
      .map(function (t) {
        var cover = t.cover
          ? '<img class="release-cover" src="' +
            attr(t.cover) +
            '" alt="' +
            attr(t.title) +
            ' cover" loading="lazy" />'
          : '<div class="release-cover placeholder">' + esc(t.title) + "</div>";
        var links = (t.links || [])
          .filter(function (l) {
            return isRealUrl(l.url);
          })
          .map(function (l) {
            return (
              '<a class="btn sm" href="' +
              attr(l.url) +
              '" target="_blank" rel="noopener">' +
              esc(l.label) +
              "</a>"
            );
          })
          .join("");
        var embed = t.embed
          ? '<div class="embed-wrap"><iframe src="' +
            attr(t.embed) +
            '" height="152" loading="lazy" allow="autoplay; encrypted-media" allowtransparency="true" title="' +
            attr(t.title) +
            '"></iframe></div>'
          : "";
        return (
          '<article class="card">' +
          cover +
          '<div class="release-body">' +
          '<h3 class="release-title">' +
          esc(t.title) +
          "</h3>" +
          '<div class="release-meta">' +
          esc(t.year || "") +
          "</div>" +
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
    var split = splitTour();
    var body = "";
    if (split.upcoming.length) {
      body += tourRows(split.upcoming, true);
    } else {
      body += '<div class="empty-state">No upcoming dates. Check back soon.</div>';
    }
    if (split.past.length) {
      body +=
        '<h3 class="subhead">Recent</h3>' +
        '<div class="tour-archive">' +
        tourRows(split.past, false) +
        "</div>";
    }
    return '<section class="section">' + sectionHead("02", "Tour") + body + "</section>";
  }

  function renderMedia() {
    var m = data.media || {};
    var photos = m.photos || [];
    var videos = m.videos || [];
    var grid = photos
      .map(function (p) {
        return (
          '<a class="media-tile" href="' +
          attr(p.src) +
          '" target="_blank" rel="noopener">' +
          '<img src="' +
          attr(p.src) +
          '" alt="' +
          attr(p.alt || "DANK STREET") +
          '" loading="lazy" />' +
          "</a>"
        );
      })
      .join("");
    var vids = videos
      .map(function (v) {
        if (!v.src) return "";
        return (
          '<figure class="media-video">' +
          '<video controls preload="metadata" playsinline src="' +
          attr(v.src) +
          '" title="' +
          attr(v.title || "Video") +
          '"></video>' +
          "<figcaption><strong>" +
          esc(v.title || "") +
          "</strong> " +
          esc(v.blurb || "") +
          "</figcaption>" +
          "</figure>"
        );
      })
      .join("");
    return (
      '<section class="section">' +
      sectionHead("03", "Media") +
      (m.blurb ? '<p class="lead">' + esc(m.blurb) + "</p>" : "") +
      (grid ? '<div class="media-grid">' + grid + "</div>" : "") +
      vids +
      (!photos.length && !videos.length
        ? '<div class="empty-state">Media coming soon.</div>'
        : "") +
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
          ? '<span class="social-icon" style="--icon:url(&quot;' +
            attr(s.icon) +
            '&quot;)" aria-hidden="true"></span>'
          : "";
        return (
          '<a class="btn" href="' +
          attr(s.url) +
          '" target="_blank" rel="noopener">' +
          icon +
          esc(s.label) +
          "</a>"
        );
      })
      .join("");
    return (
      '<section class="section">' +
      sectionHead("04", "Socials") +
      (socials.length
        ? '<div class="social-list">' + links + "</div>"
        : '<div class="empty-state">Social links coming soon.</div>') +
      "</section>"
    );
  }

  function renderMerch() {
    var m = data.merch || {};
    var badge = m.status ? '<div class="coming-soon">' + esc(m.status) + "</div>" : "";
    var url = m.subscribeUrl || "";
    var cta = url
      ? '<p class="contact-actions"><a class="btn primary" href="' +
        attr(url) +
        '" target="_blank" rel="noopener">' +
        esc(m.cta || "Join the list") +
        "</a></p>"
      : "";
    return (
      '<section class="section">' +
      sectionHead("05", "Merch") +
      badge +
      '<p class="lead">' +
      esc(m.blurb || "") +
      "</p>" +
      cta +
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
          '</div><a href="mailto:' +
          attr(l.value) +
          '">' +
          esc(l.value) +
          "</a></div>"
        );
      })
      .join("");
    var shot = data.headshot
      ? '<img class="contact-shot" src="' +
        attr(data.headshot) +
        '" alt="DANK STREET" loading="lazy" width="440" height="440" />'
      : "";
    var actions = [];
    if (c.email) {
      actions.push(
        '<a class="btn primary" href="mailto:' + attr(c.email) + '">Email bookings</a>'
      );
    }
    if (data.epk) {
      actions.push(
        '<a class="btn" href="' +
          attr(data.epk) +
          '" download="DANK-STREET-EPK.jpg" target="_blank" rel="noopener">Download EPK</a>'
      );
    }

    var about =
      (data.bio
        ? '<div class="about-block"><h3 class="subhead">About</h3><p class="lead">' +
          esc(data.bio) +
          "</p>" +
          (data.billing ? '<p class="lead muted">' + esc(data.billing) + "</p>" : "") +
          "</div>"
        : "");

    var form = "";
    if (c.formEndpoint) {
      form =
        '<form class="form" id="bookingForm" novalidate>' +
        '<div class="field"><label for="bk-name">Name</label>' +
        '<input id="bk-name" name="name" type="text" autocomplete="name" required /></div>' +
        '<div class="field"><label for="bk-email">Email</label>' +
        '<input id="bk-email" name="email" type="email" autocomplete="email" required /></div>' +
        '<div class="field"><label for="bk-msg">Message</label>' +
        '<textarea id="bk-msg" name="message" rows="4" required placeholder="Date, city, venue, budget…"></textarea></div>' +
        '<input type="hidden" name="_subject" value="DANK STREET booking inquiry" />' +
        '<button class="btn primary" type="submit">Send inquiry</button>' +
        '<p class="form-note" id="formNote" role="status"></p>' +
        "</form>";
    }

    var body =
      about +
      '<p class="lead">' +
      esc(c.blurb || "") +
      "</p>" +
      (lines || "") +
      (actions.length ? '<div class="contact-actions">' + actions.join("") + "</div>" : "") +
      (form ? '<h3 class="subhead">Booking form</h3>' + form : "");

    return (
      '<section class="section">' +
      sectionHead("06", "Contact") +
      (shot
        ? '<div class="contact-layout">' + shot + "<div>" + body + "</div></div>"
        : body) +
      "</section>"
    );
  }

  function bindBookingForm() {
    var form = document.getElementById("bookingForm");
    if (!form) return;
    var note = document.getElementById("formNote");
    var endpoint = (data.contact && data.contact.formEndpoint) || "";
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!endpoint) return;
      var fd = new FormData(form);
      if (note) {
        note.className = "form-note";
        note.textContent = "Sending…";
      }
      fetch(endpoint, {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
      })
        .then(function (res) {
          if (!res.ok) throw new Error("fail");
          return res.json().catch(function () {
            return {};
          });
        })
        .then(function () {
          form.reset();
          if (note) {
            note.className = "form-note ok";
            note.textContent = "Sent — we will get back to you.";
          }
        })
        .catch(function () {
          if (note) {
            note.className = "form-note err";
            note.textContent =
              "Could not send. Email " + ((data.contact && data.contact.email) || "us") + " directly.";
          }
        });
    });
  }

  function injectEventSchema() {
    var old = document.getElementById("dank-event-schema");
    if (old) old.remove();
    var split = splitTour();
    if (!split.upcoming.length) return;
    var events = split.upcoming.map(function (d) {
      var obj = {
        "@type": "MusicEvent",
        name: "DANK STREET — " + (d.venue || d.city),
        startDate: d.isoDate,
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        performer: {
          "@type": "MusicGroup",
          name: "DANK STREET",
          url: "https://dankstreetmusic.com/",
        },
        location: {
          "@type": "Place",
          name: d.venue || d.city,
          address: d.city || undefined,
        },
      };
      if (isRealUrl(d.tickets)) {
        obj.offers = {
          "@type": "Offer",
          url: d.tickets,
          availability: "https://schema.org/InStock",
        };
      }
      return obj;
    });
    var script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "dank-event-schema";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": events,
    });
    document.head.appendChild(script);
  }

  var ROUTES = {
    home: null,
    music: renderMusic,
    tour: renderTour,
    media: renderMedia,
    socials: renderSocials,
    merch: renderMerch,
    contact: renderContact,
  };

  var ALIASES = { signup: "merch", gallery: "media", about: "contact" };

  function currentRoute() {
    var h = (location.hash || "#home").replace("#", "").trim().toLowerCase();
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
    injectEventSchema();

    if (route === "home") {
      root.innerHTML = "";
      if (window.DankSlab) window.DankSlab.nudge(0.22);
    } else {
      root.innerHTML = ROUTES[route]();
      if (window.Scramble) window.Scramble.autoInit(root);
      bindBookingForm();
      root.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  window.addEventListener("hashchange", render);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
