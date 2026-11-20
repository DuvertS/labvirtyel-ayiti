/* LabVirtyèl Ayiti — ressources déposées par les enseignants (affichage commun).
   Dépend de : js/auth.js (AUTH), js/app.js (APP).
   Tout texte venant d'un participant est échappé : aucun HTML d'un dépôt n'est jamais interprété. */
var COMM = (function () {
  var D = APP.D, esc = APP.esc;
  var KINDS = {
    article:  { fr: 'Article', ht: 'Atik' },
    document: { fr: 'Document (PDF ou image)', ht: 'Dokiman (PDF oswa imaj)' },
    lien:     { fr: 'Lien vers un site', ht: 'Lyen sou yon sit' }
  };
  var STATUS = {
    en_attente: { fr: 'En attente de validation', ht: 'Ap tann validasyon', cls: 'warn' },
    publie:     { fr: 'Publiée', ht: 'Pibliye', cls: 'good' },
    refuse:     { fr: 'Refusée', ht: 'Refize', cls: 'bad' }
  };
  function T(o) { return LV.t(o.fr, o.ht); }
  function title(r) { return LV.lang() === 'ht' && r.title_ht ? r.title_ht : r.title_fr; }
  function summary(r) { return LV.lang() === 'ht' && r.summary_ht ? r.summary_ht : r.summary_fr; }
  function date(s) { return s ? new Date(s).toLocaleDateString(LV.lang() === 'ht' ? 'fr-HT' : 'fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'; }
  function badge(status) { var s = STATUS[status]; return '<span class="st ' + s.cls + '">' + T(s) + '</span>'; }

  /* Texte d'article : paragraphes séparés par une ligne vide, rendus comme du texte simple */
  function bodyHtml(text) {
    return String(text || '').split(/\n\s*\n/).filter(function (p) { return p.trim(); })
      .map(function (p) { return '<p>' + esc(p.trim()).replace(/\n/g, '<br>') + '</p>'; }).join('');
  }

  function card(r, opts) {
    opts = opts || {};
    var dom = D.domains[r.domain];
    return '<article class="cres" style="--dc:' + dom.color + '" data-id="' + r.id + '">' +
      '<div class="cres-head"><span class="dom">' + esc(APP.L(dom)) + ' · ' + T(KINDS[r.kind]) + '</span>' + (opts.status ? badge(r.status) : '') + '</div>' +
      '<h3>' + esc(title(r)) + '</h3>' +
      (summary(r) ? '<p class="muted">' + esc(summary(r)) + '</p>' : '') +
      (opts.author ? '<p class="by">' + LV.t('Par ', 'Pa ') + esc(opts.author) + ' · ' + date(r.created_at) + '</p>' : '') +
      (r.status === 'refuse' && r.review_note && opts.status ? '<p class="note">' + LV.t('Motif : ', 'Rezon : ') + esc(r.review_note) + '</p>' : '') +
      '<div class="cres-body" hidden></div>' +
      '<div class="btn-row">' + '<button class="btn" data-open>' + LV.t('Voir', 'Gade') + '</button>' + (opts.actions || '') + '</div>' +
      '</article>';
  }

  /* Ouvre le contenu : article déplié, fichier via lien signé (valable 2 minutes), ou lien externe */
  async function open(r, cardEl) {
    var box = cardEl.querySelector('.cres-body');
    if (r.kind === 'article') {
      box.hidden = !box.hidden;
      box.innerHTML = bodyHtml(r.body);
      return;
    }
    if (r.kind === 'lien' && /^https:\/\//i.test(r.url || '')) {
      box.hidden = false;
      var host = '';
      try { host = new URL(r.url).hostname; } catch (e) { host = ''; }
      box.innerHTML = '<p>' + LV.t('Ce lien ouvre un site extérieur : ', 'Lyen sa a louvri yon sit deyò : ') + '<b>' + esc(host) + '</b></p>' +
        '<a class="btn primary" href="' + esc(r.url) + '" target="_blank" rel="noopener noreferrer nofollow">' + LV.t('Ouvrir le site', 'Louvri sit la') + '</a>';
      return;
    }
    if (r.kind === 'document' && r.file_path) {
      var s = await AUTH.client.storage.from('ressources').createSignedUrl(r.file_path, 120);
      box.hidden = false;
      if (s.error) { box.innerHTML = '<p class="note">' + LV.t('Fichier indisponible (connexion Internet requise).', 'Fichye a pa disponib (fòk gen entènèt).') + '</p>'; return; }
      box.innerHTML = '<p>' + esc(r.file_name || '') + '</p>' + (r.body ? bodyHtml(r.body) : '') +
        '<a class="btn primary" href="' + esc(s.data.signedUrl) + '" target="_blank" rel="noopener noreferrer">' + LV.t('Ouvrir le fichier', 'Louvri fichye a') + '</a>';
    }
  }

  return { KINDS: KINDS, STATUS: STATUS, T: T, title: title, card: card, open: open, badge: badge, date: date, bodyHtml: bodyHtml };
})();
