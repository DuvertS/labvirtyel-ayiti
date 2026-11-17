/* LabVirtyèl Ayiti — applique les préférences d'affichage AVANT l'affichage de la page
   (chargé dans <head> pour éviter un flash de couleurs).
   Préférences : palette (classique | haiti | sobre | contraste), mode (auto | clair | sombre), taille (petit | normal | grand).
   Une simulation intégrée reçoit les préférences de la page parente par l'adresse (?palette=…&mode=…&taille=…). */
(function () {
  var prefs = {};
  try { prefs = JSON.parse(localStorage.getItem('lv-prefs')) || {}; } catch (e) { prefs = {}; }
  var q = new URLSearchParams(location.search);
  var palette = q.get('palette') || prefs.palette || 'classique';
  var mode = q.get('mode') || prefs.mode || 'auto';
  var taille = q.get('taille') || prefs.taille || 'normal';
  var html = document.documentElement;
  html.setAttribute('data-palette', palette);
  html.setAttribute('data-taille', taille);
  var dark = mode === 'sombre' || (mode === 'auto' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
  html.setAttribute('data-mode', dark ? 'sombre' : 'clair');
})();
