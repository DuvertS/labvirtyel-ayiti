/* LabVirtyèl Ayiti — accès réservé aux participants connectés.
   Chargé dans le <head> de chaque page du laboratoire, avant l'affichage.
   Sans session enregistrée sur l'appareil, on part vers compte.html (inscription / connexion).
   La session reste valable hors ligne ; la vérification complète (compte confirmé, non suspendu)
   est faite par js/auth.js dès que le réseau répond. */
(function () {
  var ok = false;
  try {
    var s = JSON.parse(localStorage.getItem('lv-auth'));
    ok = !!(s && s.refresh_token && s.user && s.user.email_confirmed_at);
  } catch (e) { ok = false; }
  if (ok) return;
  var me = document.currentScript && document.currentScript.src;
  var base = me ? me.replace(/js\/gate\.js.*$/, '') : '';
  var here = location.href.indexOf(base) === 0 ? location.href.slice(base.length) : '';
  /* Dans une simulation intégrée, c'est la page parente qui redirige */
  if (window.top !== window.self) { document.documentElement.style.visibility = 'hidden'; return; }
  document.documentElement.style.visibility = 'hidden';
  location.replace(base + 'compte.html' + (here ? '?next=' + encodeURIComponent(here) : ''));
})();
