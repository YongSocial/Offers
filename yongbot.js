/* Yong Social friendly navigation bot.
   Host this file in the same GitHub repo as offers.js (offers.yongsocial.com).
   The blog loads it from there, so any change here shows up on the blog within about 10 minutes,
   with no theme update needed.

   What the bot does
   1. Tap the bot: your X, Telegram and WhatsApp icons fan out around it.
   2. Reader idle for a while: it asks "Looking for anything specific?" (Yes / No).
        Yes -> opens the blog's search bar, ready to type.   No -> "I'll be here if you need me."
   3. Reader spends a while on an article: it asks "Want more on <topic>?" (Yes / No).
        Yes -> runs a smart search by itself, using the article's label (or its title keywords).
   4. Its eyes follow the pointer, and readers can drag it anywhere.

   Change the settings below. Everything else can stay as it is. */
(function () {
  var BOT = {
    enabled: true,                 // false = hide the bot everywhere
    size: 60,                      // bot size in pixels
    color: "#000000",              // bot face colour
    eyes: "#ffffff",               // eye colour
    label: "Yong Social assistant",// screen-reader label for the bot

    /* The three icons that open when the bot is tapped */
    links: {
      x:        "https://x.com/YSFNews",
      telegram: "https://t.me/yongsocialfinance",
      whatsapp: "https://whatsapp.com/channel/0029Vb8bp4dA2pLGEi7cJQ0M"
    },

    /* Question 1: the reader has been idle */
    idleEnabled: true,
    idleSeconds: 20,               // seconds of no activity before the bot speaks up
    idleText: "Hey there! Looking for anything specific?",

    /* Question 2: the reader is reading an article */
    readEnabled: true,
    readSeconds: 30,               // seconds spent on the article before the bot asks
    readText: "Enjoying this one? Want more on {topic}?",
    readTextNoTopic: "Enjoying this one? Want more stories like it?",

    yes: "Yes",
    no: "No",
    noReply: "Okay, I'll be here if you need me.",
    maxNo: 2,                      // after this many "No" answers, stay quiet for the rest of the visit

    /* Labels too broad to search by. The bot prefers a more specific label. */
    genericLabels: ["news", "blog", "featured", "uncategorized", "trending", "breaking", "latest",
                    "markets", "wealth", "technology", "tech", "finance", "ai"]
  };

  /* optional override from the page: window.YS_BOT_CONFIG = {...} */
  try {
    var o = window.YS_BOT_CONFIG;
    if (o && typeof o === "object") {
      for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) {
        if (k === "links" && o.links) { for (var j in o.links) BOT.links[j] = o.links[j]; }
        else BOT[k] = o[k];
      }
    }
  } catch (e) {}

  if (!BOT.enabled || window.__ysBotLoaded) return;
  window.__ysBotLoaded = true;

  function start() {
    if (document.getElementById("ysBotBtn")) return;
    var S = Math.max(40, +BOT.size || 60), ICON = 44;

    function ss(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) {} return null; }

    /* ---------- styles ---------- */
    var css = document.createElement("style");
    css.textContent =
      ".ys-bot{position:fixed;right:16px;bottom:calc(18px + env(safe-area-inset-bottom,0px));width:" + S + "px;height:" + S + "px;padding:0;border:0;background:none;z-index:9990;filter:drop-shadow(0 8px 10px rgba(0,0,0,.28));-webkit-tap-highlight-color:transparent;touch-action:none;cursor:grab;-webkit-user-select:none;user-select:none}" +
      ".ys-bot.dragging{cursor:grabbing;filter:drop-shadow(0 14px 16px rgba(0,0,0,.4))}" +
      ".ys-bot svg{display:block;width:100%;height:100%;transition:transform .12s ease-out;pointer-events:none}" +
      ".ys-bot:active svg{transform:scale(.94)!important}" +
      ".ys-bot-bubble{position:fixed;right:16px;bottom:calc(" + (S + 28) + "px + env(safe-area-inset-bottom,0px));max-width:min(270px,calc(100vw - 32px));padding:12px 34px 12px 14px;border-radius:16px 16px 4px 16px;background:#111;color:#fff;font:600 14px/1.4 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;box-shadow:0 10px 28px rgba(0,0,0,.3);z-index:9991;opacity:0;visibility:hidden;transform:translateY(8px) scale(.96);transform-origin:center;transition:opacity .2s ease,transform .2s ease,visibility .2s}" +
      ".ys-bot-bubble.show{opacity:1;visibility:visible;transform:none}" +
      ".ys-bot-bubble .ys-bot-x{position:absolute;top:4px;right:6px;border:0;background:none;color:#aaa;font-size:20px;line-height:1;cursor:pointer;padding:4px}" +
      ".ys-bot-actions{display:flex;gap:8px;margin-top:10px}" +
      ".ys-bot-actions button{border:1px solid #444;background:transparent;color:#eee;border-radius:999px;padding:7px 18px;font:600 13px/1 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;cursor:pointer}" +
      ".ys-bot-actions button.yes{background:#2563EB;border-color:#2563EB;color:#fff}" +
      ".ys-bot-find{display:flex;gap:8px;margin-top:10px}" +
      ".ys-bot-find input{flex:1;min-width:0;border:1px solid #444;background:#1c1c1c;color:#fff;border-radius:999px;padding:8px 12px;font:500 14px system-ui,-apple-system,Segoe UI,Roboto,sans-serif;outline:0}" +
      ".ys-bot-find button{border:0;background:#2563EB;color:#fff;border-radius:999px;padding:8px 14px;font:600 13px system-ui,-apple-system,Segoe UI,Roboto,sans-serif;cursor:pointer}" +
      ".ys-bot-menu{position:fixed;left:0;top:0;width:0;height:0;z-index:9989;pointer-events:none}" +
      ".ys-bot-line{position:absolute;left:0;top:-1px;height:2px;border-radius:2px;background:rgba(120,128,150,.75);transform-origin:0 50%;opacity:0;transition:opacity .2s ease}" +
      ".ys-bot-ico{position:absolute;width:" + ICON + "px;height:" + ICON + "px;margin:-" + (ICON / 2) + "px 0 0 -" + (ICON / 2) + "px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 6px 16px rgba(0,0,0,.28);transform:translate(var(--tx,0),var(--ty,0)) scale(.2);opacity:0;transition:transform .28s cubic-bezier(.2,.9,.3,1.3),opacity .2s ease;text-decoration:none;-webkit-tap-highlight-color:transparent}" +
      ".ys-bot-ico svg{width:22px;height:22px;fill:currentColor;display:block}" +
      ".ys-bot-menu.open .ys-bot-ico{pointer-events:auto;opacity:1;transform:translate(var(--tx,0),var(--ty,0)) scale(1)}" +
      ".ys-bot-menu.open .ys-bot-line{opacity:1}" +
      ".ys-bot-menu.open .ys-bot-ico:nth-of-type(2){transition-delay:.04s}.ys-bot-menu.open .ys-bot-ico:nth-of-type(3){transition-delay:.08s}" +
      ".ys-bot-ico.x{background:#111;box-shadow:0 0 0 1.5px #3a3a3a,0 6px 16px rgba(0,0,0,.28)}.ys-bot-ico.tg{background:#229ED9}.ys-bot-ico.wa{background:#25D366}";
    document.head.appendChild(css);

    /* ---------- elements ---------- */
    var SVG_X = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2H21l-6.51 7.44L22 22h-6.844l-4.79-6.26L4.8 22H2l6.96-7.953L2 2h6.91l4.33 5.77L18.244 2Zm-1.2 18h1.66L7.04 4H5.28l11.764 16Z"/></svg>';
    var SVG_TG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.91 3.79 20.3 20.84c-.25 1.21-.98 1.5-2 .94l-5.5-4.07-2.66 2.57c-.3.3-.55.56-1.12.56l.4-5.7 10.38-9.4c.45-.4-.1-.62-.7-.22L7.28 13.6l-5.53-1.73c-1.2-.38-1.23-1.2.25-1.77L22.46 2.5c1-.36 1.87.24 1.45 1.29Z"/></svg>';
    var SVG_WA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.18 2.095 3.195 5.076 4.483.709.3 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.696.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>';

    var holder = document.createElement("div");
    holder.innerHTML =
      '<div class="ys-bot-menu" id="ysBotMenu">' +
        '<i class="ys-bot-line"></i><i class="ys-bot-line"></i><i class="ys-bot-line"></i>' +
        '<a class="ys-bot-ico x" data-k="x" target="_blank" rel="noopener" title="Follow us on X" aria-label="Follow us on X">' + SVG_X + '</a>' +
        '<a class="ys-bot-ico tg" data-k="telegram" target="_blank" rel="noopener" title="Join us on Telegram" aria-label="Join us on Telegram">' + SVG_TG + '</a>' +
        '<a class="ys-bot-ico wa" data-k="whatsapp" target="_blank" rel="noopener" title="Join our WhatsApp channel" aria-label="Join our WhatsApp channel">' + SVG_WA + '</a>' +
      '</div>' +
      '<button aria-label="" class="ys-bot" id="ysBotBtn" type="button">' +
        '<svg aria-hidden="true" id="ysBotSvg" viewBox="0 0 100 100">' +
          '<circle cx="50" cy="50" fill="' + BOT.color + '" r="48" stroke="#333" stroke-width="1"/>' +
          '<g id="ysBotEyes">' +
            '<g id="ysBotEyeL"><rect fill="' + BOT.eyes + '" height="19" rx="6" width="12" x="-6" y="-9.5"/></g>' +
            '<g id="ysBotEyeR"><rect fill="' + BOT.eyes + '" height="19" rx="6" width="12" x="-6" y="-9.5"/></g>' +
          '</g>' +
        '</svg>' +
      '</button>' +
      '<div aria-live="polite" class="ys-bot-bubble" id="ysBotBubble" role="status">' +
        '<button aria-label="Close" class="ys-bot-x" id="ysBotClose" type="button">&#215;</button>' +
        '<span id="ysBotMsg"></span><div class="ys-bot-actions" id="ysBotActions" hidden></div>' +
      '</div>';
    while (holder.firstChild) document.body.appendChild(holder.firstChild);

    var btn = document.getElementById("ysBotBtn"), svg = document.getElementById("ysBotSvg"),
        eyes = document.getElementById("ysBotEyes"), eL = document.getElementById("ysBotEyeL"),
        eR = document.getElementById("ysBotEyeR"), bubble = document.getElementById("ysBotBubble"),
        closeBtn = document.getElementById("ysBotClose"), msgEl = document.getElementById("ysBotMsg"),
        actions = document.getElementById("ysBotActions"), menu = document.getElementById("ysBotMenu");
    btn.setAttribute("aria-label", BOT.label || "Yong Social assistant");
    var icos = [].slice.call(menu.querySelectorAll(".ys-bot-ico")), lines = [].slice.call(menu.querySelectorAll(".ys-bot-line"));
    icos.forEach(function (a) { a.href = BOT.links[a.getAttribute("data-k")] || "#"; a.addEventListener("click", closeMenu); });

    /* ---------- eyes ---------- */
    var tx = 0, ty = 0, cx = 0, cy = 0, idle = true, idleTimer, t = 0, hideTimer;
    function setLook(x, y) {
      var M = 27, ax = Math.abs(x) / M, ay = Math.abs(y) / M;
      var gap = 32 * (1 - 0.4 * ax), sx = 1 - 0.35 * ax, sy = 1 - 0.3 * ay, oy = y + 2;
      eL.setAttribute("transform", "translate(" + (50 + x - gap / 2) + "," + (50 + oy) + ") scale(" + sx + "," + sy + ")");
      eR.setAttribute("transform", "translate(" + (50 + x + gap / 2) + "," + (50 + oy) + ") scale(" + sx + "," + sy + ")");
      svg.style.transform = "translate(" + (x * 0.3) + "px," + (y * 0.3) + "px)";
    }
    function tick() {
      if (!document.hidden) {
        var r = btn.getBoundingClientRect(), bx = r.left + r.width / 2, by = r.top + r.height / 2, dx, dy;
        if (idle) { t += 0.02; dx = Math.cos(t) * 120 - 60; dy = Math.sin(t * 0.8) * 80 - 70; }
        else { dx = tx - bx; dy = ty - by; }
        var d = Math.hypot(dx, dy) || 1, k = Math.min(d / 90, 1);
        cx += (dx / d * 27 * k - cx) * 0.35; cy += (dy / d * 27 * k - cy) * 0.35;
        setLook(cx, cy);
      }
      requestAnimationFrame(tick);
    }
    function onMove(e) {
      var p = e.touches ? e.touches[0] : e; if (!p) return;
      tx = p.clientX; ty = p.clientY; idle = false;
      clearTimeout(idleTimer);
      idleTimer = setTimeout(function () { idle = true; }, 3500);
      activity();
    }
    ["pointermove", "pointerdown", "mousemove", "touchmove", "touchstart"].forEach(function (n) {
      document.addEventListener(n, onMove, { passive: true, capture: true });
    });
    function blink() {
      eyes.style.transformOrigin = "center"; eyes.style.transformBox = "fill-box";
      eyes.style.transition = "transform .08s"; eyes.style.transform = "scaleY(.1)";
      setTimeout(function () { eyes.style.transform = "scaleY(1)"; }, 110);
      setTimeout(blink, 2500 + Math.random() * 3000);
    }
    setTimeout(blink, 1200);

    /* ---------- position and dragging ---------- */
    var KEY = "ysBotPos", MARGIN = 8, pos = null, drag = null, suppressClick = false;
    function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
    function bounds() {
      var w = document.documentElement.clientWidth, h = window.innerHeight;
      return { minX: MARGIN, maxX: Math.max(MARGIN, w - S - MARGIN), minY: MARGIN, maxY: Math.max(MARGIN, h - S - MARGIN) };
    }
    function loadPos() {
      try {
        var v = JSON.parse(localStorage.getItem(KEY));
        if (v && isFinite(v.x) && isFinite(v.y)) return { x: clamp(v.x, 0, 1), y: clamp(v.y, 0, 1) };
      } catch (e) {}
      return { x: 1, y: 0.88 };
    }
    function savePos() { try { localStorage.setItem(KEY, JSON.stringify(pos)); } catch (e) {} }
    function placeBubble() {
      var r = btn.getBoundingClientRect(), bw = bubble.offsetWidth, bh = bubble.offsetHeight;
      var w = document.documentElement.clientWidth, h = window.innerHeight;
      var left = clamp(r.left + r.width / 2 - bw / 2, 8, Math.max(8, w - bw - 8));
      var top = r.top - bh - 10;
      if (top < 8) top = r.bottom + 10;
      top = clamp(top, 8, Math.max(8, h - bh - 8));
      bubble.style.right = "auto"; bubble.style.bottom = "auto";
      bubble.style.left = left + "px"; bubble.style.top = top + "px";
    }
    function applyPos() {
      var b = bounds();
      btn.style.right = "auto"; btn.style.bottom = "auto";
      btn.style.left = (b.minX + pos.x * (b.maxX - b.minX)) + "px";
      btn.style.top = (b.minY + pos.y * (b.maxY - b.minY)) + "px";
      if (bubble.classList.contains("show")) placeBubble();
      if (menu.classList.contains("open")) layoutMenu();
    }
    pos = loadPos(); applyPos();

    btn.addEventListener("pointerdown", function (e) {
      var r = btn.getBoundingClientRect();
      drag = { id: e.pointerId, sx: e.clientX, sy: e.clientY, ox: e.clientX - r.left, oy: e.clientY - r.top, moved: false };
      try { btn.setPointerCapture(e.pointerId); } catch (err) {}
    });
    btn.addEventListener("pointermove", function (e) {
      if (!drag || e.pointerId !== drag.id) return;
      if (!drag.moved) {
        if (Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) < 6) return;
        drag.moved = true; btn.classList.add("dragging"); closeMenu();
      }
      var b = bounds();
      var x = clamp(e.clientX - drag.ox, b.minX, b.maxX), y = clamp(e.clientY - drag.oy, b.minY, b.maxY);
      btn.style.left = x + "px"; btn.style.top = y + "px";
      pos = { x: b.maxX > b.minX ? (x - b.minX) / (b.maxX - b.minX) : 1, y: b.maxY > b.minY ? (y - b.minY) / (b.maxY - b.minY) : 0 };
      if (bubble.classList.contains("show")) placeBubble();
    });
    function endDrag(e) {
      if (!drag || e.pointerId !== drag.id) return;
      if (drag.moved) {
        savePos(); suppressClick = true;
        setTimeout(function () { suppressClick = false; }, 350);
      }
      btn.classList.remove("dragging"); drag = null;
    }
    btn.addEventListener("pointerup", endDrag);
    btn.addEventListener("pointercancel", endDrag);
    window.addEventListener("resize", function () { if (!drag) applyPos(); });

    /* ---------- the icon fan (X, Telegram, WhatsApp) ---------- */
    function layoutMenu() {
      var r = btn.getBoundingClientRect(), mx = r.left + r.width / 2, my = r.top + r.height / 2;
      var w = document.documentElement.clientWidth, h = window.innerHeight;
      var D = S / 2 + ICON / 2 + 24, base = mx > w / 2 ? 180 : 0, sgn = base === 180 ? 1 : -1;
      var shifts = [0], best = null, i; for (i = 5; i <= 140; i += 5) shifts.push(i, -i);
      function pts(shift) {
        return [base + sgn * 50 + shift, base + shift, base - sgn * 50 + shift].map(function (a) {
          var rad = a * Math.PI / 180;
          return { a: a, x: Math.cos(rad) * D, y: Math.sin(rad) * D };
        });
      }
      function fits(p) {
        var m = ICON / 2 + 6;
        return mx + p.x >= m && mx + p.x <= w - m && my + p.y >= m && my + p.y <= h - m;
      }
      for (i = 0; i < shifts.length; i++) {
        var P = pts(shifts[i]);
        if (P.every(fits)) { best = P; break; }
      }
      if (!best) best = pts(0);
      menu.style.left = mx + "px"; menu.style.top = my + "px";
      best.forEach(function (p, n) {
        var m = ICON / 2 + 6;
        var px = clamp(mx + p.x, m, w - m) - mx, py = clamp(my + p.y, m, h - m) - my;
        icos[n].style.setProperty("--tx", px + "px"); icos[n].style.setProperty("--ty", py + "px");
        var len = Math.hypot(px, py), ang = Math.atan2(py, px) * 180 / Math.PI, from = S / 2 + 4, to = len - ICON / 2 - 3;
        lines[n].style.width = Math.max(0, to - from) + "px";
        lines[n].style.transform = "rotate(" + ang + "deg) translateX(" + from + "px)";
      });
    }
    function openMenu() { hideBubble(); layoutMenu(); menu.classList.add("open"); }
    function closeMenu() { menu.classList.remove("open"); }
    document.addEventListener("pointerdown", function (e) {
      if (!menu.classList.contains("open")) return;
      if (e.target.closest && (e.target.closest("#ysBotMenu") || e.target.closest("#ysBotBtn"))) return;
      closeMenu();
    }, true);

    /* ---------- speech bubble ---------- */
    function hideBubble() { bubble.classList.remove("show"); clearTimeout(hideTimer); }
    function say(text, opt) {
      opt = opt || {};
      closeMenu();
      msgEl.textContent = text;
      actions.innerHTML = ""; actions.hidden = true;
      var old = bubble.querySelector(".ys-bot-find"); if (old) old.parentNode.removeChild(old);
      if (opt.yes) {
        actions.hidden = false;
        [["yes", BOT.yes, opt.yes], ["no", BOT.no, opt.no]].forEach(function (b) {
          var el = document.createElement("button");
          el.type = "button"; el.className = b[0]; el.textContent = b[1];
          el.addEventListener("click", function () { b[2] && b[2](); });
          actions.appendChild(el);
        });
      }
      if (opt.find) {
        var f = document.createElement("form"); f.className = "ys-bot-find";
        f.innerHTML = '<input type="search" name="q" placeholder="Search Yong Social" aria-label="Search" autocomplete="off"><button type="submit">Go</button>';
        f.addEventListener("submit", function (e) {
          e.preventDefault();
          var q = f.q.value.trim(); if (q) location.href = "/search?q=" + encodeURIComponent(q);
        });
        bubble.appendChild(f);
        setTimeout(function () { try { f.q.focus(); } catch (e) {} }, 50);
      }
      placeBubble();
      bubble.classList.add("show");
      clearTimeout(hideTimer);
      if (opt.seconds) hideTimer = setTimeout(hideBubble, opt.seconds * 1000);
    }
    closeBtn.addEventListener("click", hideBubble);

    btn.addEventListener("click", function (e) {
      if (suppressClick) { e.preventDefault(); return; }
      if (menu.classList.contains("open")) closeMenu(); else openMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { closeMenu(); hideBubble(); }
    });

    /* ---------- finding things on the blog ---------- */
    function openSearch() {
      var s = document.querySelector(".search"), input = s && s.querySelector('input[name="q"]');
      if (!s || !input) { say("What are you looking for?", { find: true }); return; }
      window.scrollTo(0, 0);
      var exp = s.querySelector(".search-expand");
      if (!s.classList.contains("focused") && exp) exp.click();
      try { input.focus(); } catch (e) {}
      setTimeout(function () {
        if (!s.classList.contains("focused")) {
          s.classList.add("focused");
          var ct = document.querySelector(".centered-top"); if (ct) ct.classList.add("search-focused");
        }
        try { input.focus(); } catch (e) {}
      }, 350);
    }

    function isArticle() {
      if (/^\/p\//.test(location.pathname)) return false;   // static pages (About, Contact...) are not articles
      return !!document.querySelector('.post-body[id^="post-body-"]') && /item-view/.test(document.body.className);
    }
    function articleLabels() {
      var out = [], seen = {};
      function add(v) { v = (v || "").trim(); var k = v.toLowerCase(); if (v && !seen[k]) { seen[k] = 1; out.push(v); } }
      [].forEach.call(document.querySelectorAll(".ys-lbls i[data-n]"), function (i) { add(i.getAttribute("data-n")); });
      if (!out.length) [].forEach.call(document.querySelectorAll('.post-labels a, a[rel="tag"]'), function (a) { add(a.textContent); });
      return out;
    }
    var STOP = "the a an and or but of to in on for with at by from as is are was were be been it its this that these those you your we our they their how what why when who which will can could should would may might not no yes more most new says say after before over into than then about up out just also".split(" ");
    function titleKeywords() {
      var el = document.querySelector("h1.post-title, h3.post-title, .post-title, h1"), t = el ? el.textContent : (document.title || "");
      var words = t.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(function (w) { return w.length > 3 && STOP.indexOf(w) < 0; });
      var uniq = []; words.forEach(function (w) { if (uniq.indexOf(w) < 0) uniq.push(w); });
      return uniq.sort(function (a, b) { return b.length - a.length; }).slice(0, 3);
    }
    function smartTarget() {
      var labels = articleLabels(), gen = (BOT.genericLabels || []).map(function (g) { return String(g).toLowerCase(); }), pick = null, i;
      for (i = 0; i < labels.length; i++) if (gen.indexOf(labels[i].toLowerCase()) < 0) { pick = labels[i]; break; }
      if (!pick && labels.length) pick = labels[0];
      if (pick) return { topic: pick, url: "/search/label/" + encodeURIComponent(pick) };
      var kw = titleKeywords();
      if (kw.length) return { topic: null, url: "/search?q=" + encodeURIComponent(kw.join(" ")) };
      return { topic: null, url: "/" };
    }

    /* ---------- the two questions ---------- */
    var promptOpen = false;
    function declined() {
      var n = (parseInt(ss("ysBotNo"), 10) || 0) + 1; ss("ysBotNo", String(n));
    }
    function quiet() { return (parseInt(ss("ysBotNo"), 10) || 0) >= (+BOT.maxNo || 2); }
    function busy() {
      var ae = document.activeElement, tag = ae && ae.tagName;
      var s = document.querySelector(".search.focused");
      return promptOpen || menu.classList.contains("open") || bubble.classList.contains("show") || document.hidden ||
             !!s || tag === "INPUT" || tag === "TEXTAREA" || (ae && ae.isContentEditable) || !!drag;
    }
    function ask(text, onYes, key) {
      promptOpen = true;
      say(text, {
        seconds: 20,
        yes: function () { promptOpen = false; hideBubble(); onYes(); },
        no: function () { promptOpen = false; declined(); say(BOT.noReply, { seconds: 4 }); }
      });
      setTimeout(function () { if (!bubble.classList.contains("show")) promptOpen = false; }, 20500);
      if (key) ss(key, "1");
    }
    closeBtn.addEventListener("click", function () { promptOpen = false; });

    var idleT, scrolledOnce = false;
    function canIdle() { return BOT.idleEnabled && !isArticle() && ss("ysBotIdle") !== "1" && !quiet(); }
    function idleFire() {
      if (!canIdle()) return;
      if (busy()) { armIdle(); return; }
      ask(BOT.idleText, openSearch, "ysBotIdle");
    }
    function armIdle() {
      clearTimeout(idleT);
      if (!canIdle()) return;
      idleT = setTimeout(idleFire, Math.max(3, +BOT.idleSeconds || 20) * 1000);
    }
    function activity() { armIdle(); }
    window.addEventListener("scroll", function () { scrolledOnce = true; activity(); }, { passive: true, capture: true });
    document.addEventListener("keydown", activity, true);
    document.addEventListener("wheel", function () { scrolledOnce = true; activity(); }, { passive: true, capture: true });
    document.addEventListener("touchmove", function () { scrolledOnce = true; }, { passive: true, capture: true });
    armIdle();

    var readSecs = 0, readAsked = false;
    if (BOT.readEnabled && isArticle()) {
      setInterval(function () {
        if (readAsked || quiet() || document.hidden || !scrolledOnce) return;
        if (menu.classList.contains("open")) return;
        readSecs++;
        if (readSecs < Math.max(5, +BOT.readSeconds || 30)) return;
        if (busy()) { readSecs--; return; }
        readAsked = true;
        var tg = smartTarget();
        ask(tg.topic ? String(BOT.readText).replace("{topic}", tg.topic) : BOT.readTextNoTopic, function () {
          say(tg.topic ? "Sure thing. Finding more on " + tg.topic + "..." : "Sure thing. Finding more like this...", { seconds: 3 });
          setTimeout(function () { location.href = tg.url; }, 700);
        });
      }, 1000);
    }

    tick();
  }

  if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);
})();
