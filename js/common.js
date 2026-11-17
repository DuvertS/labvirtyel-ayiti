/* LabVirtyèl Ayiti — fonctions communes (langue, couleurs, graphiques)
   Fonctionne en ouvrant les fichiers directement (file://), sans serveur. */

var LV = (function () {
  var lang = 'fr';
  var listeners = [];

  var params = new URLSearchParams(location.search);
  var embedded = params.get('embed') === '1';
  /* Mode intégré : la simulation est affichée dans une page ressource ou un parcours. */
  if (embedded) document.documentElement.classList.add('embed');

  function readLang() {
    var fromUrl = params.get('lang');
    if (fromUrl === 'fr' || fromUrl === 'ht') return fromUrl;
    try { return localStorage.getItem('lv-lang') || 'fr'; } catch (e) { return 'fr'; }
  }

  /* En mode intégré, on envoie la hauteur de la page au parent pour ajuster le cadre. */
  function postHeight() {
    if (!embedded || window.parent === window) return;
    window.parent.postMessage({ lvHeight: document.documentElement.scrollHeight }, '*');
  }
  function saveLang(l) {
    try { localStorage.setItem('lv-lang', l); } catch (e) { /* stockage indisponible */ }
  }

  /* Tout élément avec data-fr et data-ht est traduit automatiquement. */
  function applyLang(l) {
    lang = l;
    document.documentElement.lang = l === 'ht' ? 'ht' : 'fr';
    document.querySelectorAll('[data-fr]').forEach(function (el) {
      var txt = el.getAttribute('data-' + l) || el.getAttribute('data-fr');
      if (el.hasAttribute('data-html')) el.innerHTML = txt; else el.textContent = txt;
    });
    document.querySelectorAll('.lang-switch button').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-lang') === l);
    });
    saveLang(l);
    listeners.forEach(function (fn) { fn(l); });
  }

  /* t('Texte FR', 'Tèks HT') : choisit selon la langue active (pour le texte généré en JS). */
  function t(fr, ht) { return lang === 'ht' ? ht : fr; }

  function css(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  /* Graphique simple : axes, grille, séries de points. */
  function plot(ctx, w, h, opts) {
    var pad = { l: 48, r: 14, t: 14, b: 36 };
    var x0 = pad.l, x1 = w - pad.r, y0 = pad.t, y1 = h - pad.b;
    var X = function (v) { return x0 + (v - opts.xmin) / (opts.xmax - opts.xmin) * (x1 - x0); };
    var Y = function (v) { return y1 - (v - opts.ymin) / (opts.ymax - opts.ymin) * (y1 - y0); };
    ctx.clearRect(0, 0, w, h);
    ctx.font = '12px ' + css('--font');
    ctx.lineWidth = 1;
    ctx.strokeStyle = css('--plot-grid');
    ctx.fillStyle = css('--muted');
    ctx.textAlign = 'center';
    for (var i = 0; i <= opts.xticks; i++) {
      var xv = opts.xmin + i * (opts.xmax - opts.xmin) / opts.xticks;
      ctx.beginPath(); ctx.moveTo(X(xv), y0); ctx.lineTo(X(xv), y1); ctx.stroke();
      ctx.fillText(+xv.toFixed(1), X(xv), y1 + 16);
    }
    ctx.textAlign = 'right';
    for (var j = 0; j <= opts.yticks; j++) {
      var yv = opts.ymin + j * (opts.ymax - opts.ymin) / opts.yticks;
      ctx.beginPath(); ctx.moveTo(x0, Y(yv)); ctx.lineTo(x1, Y(yv)); ctx.stroke();
      ctx.fillText(opts.yfmt ? opts.yfmt(yv) : +yv.toFixed(1), x0 - 6, Y(yv) + 4);
    }
    ctx.textAlign = 'center';
    if (opts.xlabel) ctx.fillText(opts.xlabel, (x0 + x1) / 2, h - 4);
    (opts.series || []).forEach(function (s) {
      ctx.strokeStyle = s.color; ctx.lineWidth = s.width || 2;
      ctx.beginPath();
      s.points.forEach(function (p, k) { if (k) ctx.lineTo(X(p[0]), Y(p[1])); else ctx.moveTo(X(p[0]), Y(p[1])); });
      ctx.stroke();
    });
    return { X: X, Y: Y };
  }

  /* Canvas net sur écrans haute densité. */
  function setupCanvas(canvas, w, h) {
    var r = window.devicePixelRatio || 1;
    canvas.width = w * r; canvas.height = h * r;
    var ctx = canvas.getContext('2d');
    ctx.setTransform(r, 0, 0, r, 0, 0);
    return ctx;
  }

  /* Relie un curseur à son affichage <output> et à une fonction. */
  function bindRange(id, fmt, onChange) {
    var input = document.getElementById(id);
    var out = document.querySelector('output[for="' + id + '"]');
    function upd() { if (out) out.textContent = fmt(+input.value); onChange(+input.value); }
    input.addEventListener('input', upd);
    upd();
    return input;
  }

  /* ---------- Application installable (PWA) ----------
     Le service worker ne fonctionne qu'en http(s), pas en ouvrant le fichier directement. */
  var base = (document.currentScript && document.currentScript.src) ? new URL('../', document.currentScript.src) : null;
  var installEvent = null;
  if (base && 'serviceWorker' in navigator && /^https?:$/.test(location.protocol) && !embedded) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register(new URL('sw.js', base).href, { scope: base.href }).catch(function () { /* ignoré */ });
    });
  }
  function isStandalone() {
    return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
  }
  function isIOS() { return /iphone|ipad|ipod/i.test(navigator.userAgent); }
  /* Android / ordinateur : le navigateur propose l'installation, on affiche notre bouton */
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    installEvent = e;
    showInstallButton();
  });
  window.addEventListener('appinstalled', function () {
    installEvent = null;
    var b = document.getElementById('lv-install'); if (b) b.remove();
  });
  function showInstallButton() {
    if (isStandalone() || embedded || document.getElementById('lv-install')) return;
    var sw = document.querySelector('header.site .lang-switch');
    if (!sw) return;
    var b = document.createElement('button');
    b.id = 'lv-install';
    b.className = 'install-btn';
    b.setAttribute('data-fr', 'Installer');
    b.setAttribute('data-ht', 'Enstale');
    b.textContent = t('Installer', 'Enstale');
    b.addEventListener('click', function () {
      if (installEvent) {
        installEvent.prompt();
        installEvent.userChoice.then(function () { installEvent = null; b.remove(); });
      } else {
        location.href = new URL('installer.html', base).href;   /* iPhone : instructions */
      }
    });
    sw.parentNode.insertBefore(b, sw);
  }

  /* Petit bandeau quand l'appareil perd la connexion */
  function connectionBanner() {
    var id = 'lv-offline', el = document.getElementById(id);
    if (navigator.onLine) { if (el) el.remove(); return; }
    if (el || embedded) return;
    el = document.createElement('div');
    el.id = id; el.className = 'offline-banner';
    el.setAttribute('data-fr', 'Hors ligne : le site continue de fonctionner.');
    el.setAttribute('data-ht', 'San entènèt : sit la kontinye mache.');
    el.textContent = t('Hors ligne : le site continue de fonctionner.', 'San entènèt : sit la kontinye mache.');
    document.body.insertBefore(el, document.body.firstChild);
  }
  window.addEventListener('online', connectionBanner);
  window.addEventListener('offline', connectionBanner);

  document.addEventListener('DOMContentLoaded', function () {
    connectionBanner();
    /* Lien « Mon profil » dans l'en-tête de toutes les pages */
    var sw = document.querySelector('header.site .lang-switch');
    if (sw && base && !embedded && !document.getElementById('lv-profile')) {
      var a = document.createElement('a');
      a.id = 'lv-profile'; a.className = 'profile-link';
      a.href = new URL('profil.html', base).href;
      a.setAttribute('data-fr', 'Mon profil'); a.setAttribute('data-ht', 'Pwofil mwen');
      a.textContent = 'Mon profil';
      if (/profil\.html$/.test(location.pathname)) a.classList.add('active');
      sw.parentNode.insertBefore(a, sw);
    }
    /* iPhone : pas d'invite automatique, le bouton mène aux instructions */
    if (isIOS() && !isStandalone() && /^https?:$/.test(location.protocol)) showInstallButton();
    document.querySelectorAll('.lang-switch button').forEach(function (b) {
      b.addEventListener('click', function () { applyLang(b.getAttribute('data-lang')); });
    });
    applyLang(readLang());
    if (embedded) {
      postHeight();
      window.addEventListener('load', postHeight);
      window.addEventListener('resize', postHeight);
      if (window.ResizeObserver) new ResizeObserver(postHeight).observe(document.body);
    }
  });

  /* Préférences d'affichage (palette, mode, taille) — lues aussi par js/theme.js */
  function prefs() {
    try { return JSON.parse(localStorage.getItem('lv-prefs')) || {}; } catch (e) { return {}; }
  }
  function setPrefs(p) {
    try { localStorage.setItem('lv-prefs', JSON.stringify(p)); } catch (e) { /* stockage indisponible */ }
  }
  /* Paramètres à transmettre à une simulation intégrée pour qu'elle garde la même apparence */
  function themeQuery() {
    var h = document.documentElement;
    return 'palette=' + (h.getAttribute('data-palette') || 'classique') + '&mode=' + (h.getAttribute('data-mode') || 'clair') +
      '&taille=' + (h.getAttribute('data-taille') || 'normal');
  }

  return {
    prefs: prefs, setPrefs: setPrefs, themeQuery: themeQuery, setLang: function (l) { applyLang(l); },
    t: t, css: css, plot: plot, setupCanvas: setupCanvas, bindRange: bindRange,
    onLang: function (fn) { listeners.push(fn); },
    lang: function () { return lang; }
  };
})();
