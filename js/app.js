/* LabVirtyèl Ayiti — logique commune des pages Accueil, Bibliothèque, Ressource et Parcours.
   Dépend de js/common.js (LV) et js/data.js (LV_DATA). */

var APP = (function () {
  var D = LV_DATA;

  /* Texte dans la langue active : L({fr:'…', ht:'…'}) */
  function L(o) { return o == null ? '' : (typeof o === 'string' ? o : (o[LV.lang()] || o.fr)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function resource(id) { return D.resources.filter(function (r) { return r.id === id; })[0]; }
  function pathway(id) { return D.pathways.filter(function (p) { return p.id === id; })[0]; }
  function pathwaysOf(resId) { return D.pathways.filter(function (p) { return p.steps.indexOf(resId) >= 0; }); }
  function param(name) { return new URLSearchParams(location.search).get(name); }

  /* ---------- Progression (stockée dans ce navigateur uniquement) ---------- */
  var KEY = 'lv-progress';
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || { done: {}, quiz: {} }; } catch (e) { return { done: {}, quiz: {} }; } }
  function save(s) {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* stockage indisponible */ }
    if (window.AUTH) AUTH.syncSoon();   /* envoie aussi la progression au compte du participant */
  }
  function isDone(id) { return !!load().done[id]; }
  function markDone(id) { var s = load(); s.done[id] = Date.now(); save(s); }
  function setQuizScore(id, score, total) { var s = load(); s.quiz[id] = { score: score, total: total }; s.done[id] = Date.now(); save(s); }
  function quizScore(id) { return load().quiz[id]; }
  function pathProgress(p) { var n = p.steps.filter(isDone).length; return { n: n, total: p.steps.length, pct: Math.round(n / p.steps.length * 100) }; }
  function pathMinutes(p) { return p.steps.reduce(function (s, id) { return s + resource(id).minutes; }, 0); }

  /* ---------- Icônes ---------- */
  var ICON = {
    simulation: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6M10 3v6L4.5 18.5A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-2.5L14 9V3"/><path d="M7 15h10"/></svg>',
    article: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h12l4 4v12H4z"/><path d="M8 10h8M8 14h8M8 18h5"/></svg>',
    quiz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14"/><path d="M12 17.5h.01"/></svg>',
    pathway: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 6h8a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h8"/></svg>'
  };

  /* ---------- Cartes ---------- */
  function dc(domain) { return 'style="--dc:' + D.domains[domain].color + '"'; }

  function resourceCard(r) {
    return '<a class="rcard" ' + dc(r.domain) + ' href="ressource.html?id=' + r.id + '">' +
      '<div class="thumb">' + ICON[r.type] + '<span class="type">' + esc(L(D.types[r.type])) + '</span>' +
      (isDone(r.id) ? '<span class="done">✓ ' + LV.t('Terminé', 'Fini') + '</span>' : '') + '</div>' +
      '<div class="body"><div class="dom">' + esc(L(D.domains[r.domain])) + '</div>' +
      '<h3>' + esc(L(r.title)) + '</h3><p>' + esc(L(r.summary)) + '</p>' +
      '<div class="meta"><span>' + r.minutes + ' min</span><span>' + esc(L(D.levels[r.level])) + '</span></div></div></a>';
  }

  function pathwayCard(p) {
    var pr = pathProgress(p);
    var bars = p.steps.map(function (id) { return '<i class="' + (isDone(id) ? 'ok' : '') + '"></i>'; }).join('');
    return '<a class="rcard pathway" ' + dc(p.domain) + ' href="parcours.html?id=' + p.id + '">' +
      '<div class="thumb">' + ICON.pathway + '<span class="type">' + LV.t('Parcours', 'Pakou') + ' · ' + p.steps.length + ' ' + LV.t('étapes', 'etap') + '</span>' +
      (pr.n === pr.total ? '<span class="done">✓ ' + LV.t('Terminé', 'Fini') + '</span>' : '') + '</div>' +
      '<div class="body"><div class="dom">' + esc(L(D.domains[p.domain])) + '</div>' +
      '<h3>' + esc(L(p.title)) + '</h3><p>' + esc(L(p.summary)) + '</p>' +
      '<div class="meta"><span>' + pathMinutes(p) + ' min</span><span>' + esc(L(D.levels[p.level])) + '</span>' +
      (pr.n ? '<span>' + pr.pct + ' %</span>' : '') + '</div>' +
      '<div class="steps-mini">' + bars + '</div></div></a>';
  }

  /* ---------- Vignettes de simulation (style galerie) ---------- */
  var NEW = ['sim-solaire'];   /* simulations marquées « Nouveau » */
  function thumb(r) { return r.src.replace('sims/', 'img/sims/').replace('.html', '.jpg'); }
  var PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="currentColor"/><path d="M10 8l6 4-6 4z" fill="#fff"/></svg>';
  function simTile(r) {
    return '<a class="sim-tile" ' + dc(r.domain) + ' href="ressource.html?id=' + r.id + '">' +
      '<div class="sim-img"><img src="' + thumb(r) + '" alt="" loading="lazy"><span class="play">' + PLAY + '</span>' +
      (NEW.indexOf(r.id) >= 0 ? '<span class="badge new">' + LV.t('Nouveau', 'Nouvo') + '</span>' : '') +
      (isDone(r.id) ? '<span class="badge ok">✓ ' + LV.t('Terminé', 'Fini') + '</span>' : '') + '</div>' +
      '<div class="sim-txt"><div class="sim-name">' + esc(L(r.title)) + '</div>' +
      '<div class="sim-dom">' + esc(L(D.domains[r.domain])) + '</div>' +
      '<p class="sim-sum">' + esc(L(r.summary)) + '</p></div></a>';
  }

  /* Icônes des domaines */
  var DOMAIN_ICON = {
    physique: '<path d="M12 3v4"/><circle cx="12" cy="17" r="3"/><path d="M12 7l0 7"/><path d="M5 3h14"/>',
    chimie: '<path d="M9 3h6M10 3v6L4.5 18.5A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-2.5L14 9V3"/><path d="M7 15h10"/>',
    svt: '<path d="M7 3c0 6 10 6 10 12s-10 6-10 6"/><path d="M17 3c0 6-10 6-10 12"/><path d="M8 7h8M8 17h8"/>',
    electronique: '<path d="M13 2L5 14h6l-1 8 8-12h-6z"/>',
    informatique: '<rect x="3" y="4" width="18" height="12" rx="1"/><path d="M8 20h8M12 16v4"/>',
    sante: '<path d="M12 21s-7-4.5-9-9.5C1.7 8 4 4 7.5 4c2 0 3.5 1.2 4.5 2.7C13 5.2 14.5 4 16.5 4 20 4 22.3 8 21 11.5 19 16.5 12 21 12 21z"/><path d="M8 12h2l1.5-2.5L13 14l1.5-2H16"/>'
  };
  function domainIcon(k) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + DOMAIN_ICON[k] + '</svg>';
  }

  /* ---------- Contenu d'une ressource (utilisé par ressource.html et parcours.html) ---------- */
  function renderBody(r, el, onDone) {
    if (r.type === 'simulation') {
      el.innerHTML = '<iframe class="sim" title="' + esc(L(r.title)) + '" src="' + r.src + '?embed=1&lang=' + LV.lang() + '&' + LV.themeQuery() + '"></iframe>' +
        '<p style="font-size:.88rem;margin-top:8px"><a href="' + r.src + '" target="_blank">' + LV.t('Ouvrir la simulation en plein écran ↗', 'Louvri simulasyon an sou tout ekran an ↗') + '</a></p>';
    } else if (r.type === 'article') {
      el.innerHTML = '<div class="article">' + L(r.body) + '</div>';   /* contenu interne de confiance (data.js) */
    } else if (r.type === 'quiz') {
      renderQuiz(r, el, onDone);
    }
  }

  function renderQuiz(r, el, onDone) {
    var prev = quizScore(r.id);
    var html = '<form class="quiz">';
    r.questions.forEach(function (q, i) {
      html += '<div class="qitem"><h3>' + (i + 1) + '. ' + esc(L(q.q)) + '</h3>';
      q.options.forEach(function (o, j) {
        html += '<label class="qopt"><input type="radio" name="q' + i + '" value="' + j + '"> ' + esc(L(o)) + '</label>';
      });
      html += '<div class="qexp">' + esc(L(q.explain)) + '</div></div>';
    });
    html += '<button class="btn primary" type="submit">' + LV.t('Vérifier mes réponses', 'Verifye repons mwen yo') + '</button>' +
      ' <button class="btn" type="button" data-reset>' + LV.t('Recommencer', 'Rekòmanse') + '</button>' +
      '<div class="score" ' + (prev ? '' : 'hidden') + '>' + (prev ? LV.t('Dernier score : ', 'Dènye nòt : ') + prev.score + ' / ' + prev.total : '') + '</div></form>';
    el.innerHTML = html;
    var form = el.querySelector('form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var score = 0;
      r.questions.forEach(function (q, i) {
        var chosen = form.querySelector('input[name="q' + i + '"]:checked');
        form.querySelectorAll('input[name="q' + i + '"]').forEach(function (inp) {
          var lab = inp.parentNode;
          lab.classList.remove('right', 'wrong');
          if (+inp.value === q.answer) lab.classList.add('right');
          else if (inp.checked) lab.classList.add('wrong');
        });
        if (chosen && +chosen.value === q.answer) score++;
      });
      form.classList.add('checked');
      var box = form.querySelector('.score');
      box.hidden = false;
      box.textContent = LV.t('Score : ', 'Nòt : ') + score + ' / ' + r.questions.length +
        (score === r.questions.length ? LV.t(' · Excellent !', ' · Bravo !') : LV.t(' · Relisez les explications.', ' · Li eksplikasyon yo ankò.'));
      setQuizScore(r.id, score, r.questions.length);
      if (onDone) onDone();
    });
    form.querySelector('[data-reset]').addEventListener('click', function () { renderQuiz(r, el, onDone); });
  }

  /* Ajuste la hauteur des simulations intégrées (message envoyé par common.js). */
  window.addEventListener('message', function (e) {
    if (!e.data || typeof e.data.lvHeight !== 'number') return;
    document.querySelectorAll('iframe.sim').forEach(function (f) {
      if (f.contentWindow === e.source) f.style.height = (e.data.lvHeight + 8) + 'px';
    });
  });

  return {
    D: D, L: L, esc: esc, resource: resource, pathway: pathway, pathwaysOf: pathwaysOf, param: param,
    isDone: isDone, markDone: markDone, pathProgress: pathProgress, pathMinutes: pathMinutes, load: load,
    resourceCard: resourceCard, pathwayCard: pathwayCard, renderBody: renderBody, ICON: ICON,
    thumb: thumb, simTile: simTile, domainIcon: domainIcon, PLAY: PLAY
  };
})();
