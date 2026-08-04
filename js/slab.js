/* =========================================================================
   slab.js — animated 3D extruded DANK STREET icon logo
   Loads assets/img/icon-logo.png, extrudes it as layered depth slices,
   and spins with drag + momentum (mouse & touch). No dependencies.
   ========================================================================= */
(function () {
  "use strict";

  var canvas = document.getElementById("slab");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");

  var data = window.DANK_STREET || {};
  var logoSrc = data.emblemImage || "assets/img/icon-logo.png";
  var rimSrc = "assets/img/icon-logo-rim.png";

  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var logoImg = new Image();
  var rimImg = new Image();
  var ready = false;
  var rimSheets = []; // pre-tinted extrusion slices

  // Half-extents of the logo plane in world units (set after load).
  var HW = 1.0;
  var HH = 1.0;
  var HD = 0.28;
  var LAYERS = 22;

  var yaw = -0.55;
  var pitch = 0.36;
  var vel = 0.01;
  var IDLE_VEL = 0.01;
  var FRICTION = 0.94;
  var dragging = false;
  var lastX = 0;
  // Touch gestures start undecided: the first few pixels decide whether the
  // drag spins the slab or is handed back to the browser as a page scroll.
  var startX = 0;
  var startY = 0;
  var axis = "";
  var AXIS_SLOP = 8;

  var W = 300;
  var H = 300;
  var dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));

  function resize() {
    var rect = canvas.getBoundingClientRect();
    W = Math.max(1, rect.width);
    H = Math.max(1, rect.height);
    dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function rotate(v, ay, ax) {
    var x = v[0],
      y = v[1],
      z = v[2];
    var cy = Math.cos(ay),
      sy = Math.sin(ay);
    var x1 = x * cy + z * sy;
    var z1 = -x * sy + z * cy;
    var cx = Math.cos(ax),
      sx = Math.sin(ax);
    var y1 = y * cx - z1 * sx;
    var z2 = y * sx + z1 * cx;
    return [x1, y1, z2];
  }

  function project(v) {
    var scale = Math.min(W, H) * 0.4;
    var fov = 4.6;
    var depth = fov / (fov + v[2]);
    return [W / 2 + v[0] * scale * depth, H / 2 + v[1] * scale * depth, v[2]];
  }

  function planeCorners(z) {
    return [
      [-HW, -HH, z],
      [HW, -HH, z],
      [HW, HH, z],
      [-HW, HH, z],
    ].map(function (v) {
      return project(rotate(v, yaw, pitch));
    });
  }

  function edgeTint(t) {
    var r = Math.round(40 + (150 - 40) * t);
    var g = Math.round(70 + (70 - 70) * t);
    var b = Math.round(220 + (255 - 220) * t);
    // lean purple through the stack
    r = Math.round(55 + (130 - 55) * t);
    g = Math.round(95 + (55 - 95) * t);
    b = Math.round(255 + (240 - 255) * t);
    return "rgb(" + r + "," + g + "," + b + ")";
  }

  function bakeRimSheets() {
    rimSheets = [];
    if (!rimImg.naturalWidth) return;
    var w = rimImg.naturalWidth;
    var h = rimImg.naturalHeight;
    for (var i = 0; i <= LAYERS; i++) {
      var t = i / LAYERS;
      var off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      var c = off.getContext("2d");
      c.drawImage(rimImg, 0, 0);
      c.globalCompositeOperation = "source-in";
      c.fillStyle = edgeTint(t);
      c.fillRect(0, 0, w, h);
      // slight brightness falloff for depth
      c.globalCompositeOperation = "source-atop";
      c.fillStyle = "rgba(0,0,0," + (0.35 * (1 - t)).toFixed(3) + ")";
      c.fillRect(0, 0, w, h);
      rimSheets.push(off);
    }
  }

  /** Affine-map image onto parallelogram p0-p1-p2-p3 (uses p0,p1,p3). */
  function drawMapped(img, pts, alpha) {
    if (!img || !img.width) return;
    var p0 = pts[0],
      p1 = pts[1],
      p3 = pts[3];
    var iw = img.width,
      ih = img.height;
    var a = (p1[0] - p0[0]) / iw;
    var b = (p1[1] - p0[1]) / iw;
    var c = (p3[0] - p0[0]) / ih;
    var d = (p3[1] - p0[1]) / ih;

    // Skip degenerate / edge-on faces
    if (Math.abs(a * d - b * c) < 1e-8) return;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.setTransform(a * dpr, b * dpr, c * dpr, d * dpr, p0[0] * dpr, p0[1] * dpr);
    ctx.drawImage(img, 0, 0);
    ctx.restore();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawGlow(pts) {
    var cx = (pts[0][0] + pts[1][0] + pts[2][0] + pts[3][0]) / 4;
    var cy = (pts[0][1] + pts[1][1] + pts[2][1] + pts[3][1]) / 4;
    var g = ctx.createRadialGradient(cx, cy, 2, cx, cy, Math.min(W, H) * 0.45);
    g.addColorStop(0, "rgba(91,158,245,0.32)");
    g.addColorStop(0.4, "rgba(124,58,237,0.16)");
    g.addColorStop(1, "rgba(124,58,237,0)");
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, Math.min(W, H) * 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    if (!ready) return;

    var facingFront = Math.cos(yaw) >= 0;
    var frontZ = facingFront ? HD : -HD;
    var backZ = -frontZ;

    drawGlow(planeCorners(0));

    for (var i = 0; i <= LAYERS; i++) {
      var t = i / LAYERS;
      var z = backZ + (frontZ - backZ) * t;
      var pts = planeCorners(z);
      var isFront = i === LAYERS;

      if (isFront) {
        drawMapped(logoImg, pts, 1);
        // cool rim sheen on the face
        if (rimSheets.length) {
          ctx.save();
          ctx.globalCompositeOperation = "lighter";
          drawMapped(rimSheets[LAYERS], pts, 0.18);
          ctx.restore();
        }
      } else if (rimSheets.length) {
        drawMapped(rimSheets[i], pts, 0.92);
      } else {
        drawMapped(logoImg, pts, 0.35 + 0.4 * t);
      }
    }
  }

  function tick() {
    if (!dragging) {
      yaw += vel;
      if (Math.abs(vel) > IDLE_VEL) {
        vel *= FRICTION;
      } else if (!reduceMotion) {
        vel = vel < 0 ? -IDLE_VEL : IDLE_VEL;
        vel += (IDLE_VEL - vel) * 0.02;
      } else {
        vel = 0;
      }
    }
    draw();
    requestAnimationFrame(tick);
  }

  function pointerDown(e) {
    dragging = true;
    var t = e.touches ? e.touches[0] : e;
    lastX = t.clientX;
    startX = t.clientX;
    startY = t.clientY;
    axis = e.touches ? "" : "x";
    if (window.DankAudio && window.DankAudio.sfx) window.DankAudio.sfx("click");
  }
  function pointerMove(e) {
    if (!dragging) return;
    var t = e.touches ? e.touches[0] : e;

    if (!axis) {
      var totalX = Math.abs(t.clientX - startX);
      var totalY = Math.abs(t.clientY - startY);
      if (totalX < AXIS_SLOP && totalY < AXIS_SLOP) return;
      axis = totalX > totalY ? "x" : "y";
      if (axis === "y") {
        // Vertical intent: let the browser scroll the page instead.
        dragging = false;
        return;
      }
      lastX = t.clientX;
    }

    var dx = t.clientX - lastX;
    lastX = t.clientX;
    var delta = dx * 0.012;
    yaw += delta;
    vel = delta;
    if (e.cancelable) e.preventDefault();
  }
  function pointerUp() {
    if (!dragging) return;
    dragging = false;
    axis = "";
    var max = 0.45;
    if (vel > max) vel = max;
    if (vel < -max) vel = -max;
    if (Math.abs(vel) < IDLE_VEL) vel = IDLE_VEL;
  }

  canvas.addEventListener("mousedown", pointerDown);
  window.addEventListener("mousemove", pointerMove);
  window.addEventListener("mouseup", pointerUp);
  canvas.addEventListener("touchstart", pointerDown, { passive: true });
  canvas.addEventListener("touchmove", pointerMove, { passive: false });
  window.addEventListener("touchend", pointerUp);
  window.addEventListener("resize", resize);

  function fitAspect() {
    var w = logoImg.naturalWidth || 1;
    var h = logoImg.naturalHeight || 1;
    if (w >= h) {
      HW = 1.0;
      HH = h / w;
    } else {
      HH = 1.0;
      HW = w / h;
    }
  }

  var pending = 2;
  function doneOne() {
    pending -= 1;
    if (pending <= 0) {
      fitAspect();
      bakeRimSheets();
      ready = true;
    }
  }

  logoImg.onload = doneOne;
  logoImg.onerror = doneOne;
  rimImg.onload = doneOne;
  rimImg.onerror = doneOne;
  logoImg.src = logoSrc;
  rimImg.src = rimSrc;

  resize();
  requestAnimationFrame(tick);

  window.DankSlab = {
    nudge: function (v) {
      vel = v || 0.25;
    },
  };
})();
