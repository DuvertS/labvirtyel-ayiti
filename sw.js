/* LabVirtyèl Ayiti — service worker : rend le site installable et utilisable hors ligne.
   À la première visite, tous les fichiers ci-dessous sont copiés sur l'appareil.
   IMPORTANT : à chaque modification du site, augmentez VERSION pour que les téléphones
   téléchargent la nouvelle version. */

var VERSION = 'lv-v16';
var FILES = [
  './',
  'index.html', 'bibliotheque.html', 'ressource.html', 'parcours.html', 'etudiant.html', 'enseignant.html', 'installer.html', 'profil.html', 'simulations.html', 'compte.html', 'confidentialite.html', 'communaute.html', 'contribuer.html', 'admin.html',
  'css/style.css', 'css/app.css',
  'js/theme.js', 'js/gate.js', 'js/config.js', 'js/auth.js', 'js/community.js', 'js/vendor/supabase.js', 'js/common.js', 'js/data.js', 'js/data-materiel.js', 'js/app.js', 'js/classe.js',
  'sims/pendule.html', 'sims/titrage.html', 'sims/mendel.html', 'sims/ohm.html', 'sims/logique.html', 'sims/sir.html', 'sims/solaire.html',
  'manifest.webmanifest',
  'img/sims/pendule.jpg', 'img/sims/titrage.jpg', 'img/sims/mendel.jpg', 'img/sims/ohm.jpg', 'img/sims/logique.jpg', 'img/sims/sir.jpg', 'img/sims/solaire.jpg', 'img/fond-lab.jpg', 'img/fond-tableau.jpg', 'img/fond-admin.jpg',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png', 'icons/favicon-32.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});

/* Supprime les anciennes versions du cache */
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

/* Stratégie : le cache d'abord (rapide et hors ligne), mise à jour en arrière-plan quand le réseau répond.
   ignoreSearch : ressource.html?id=… et sims/x.html?embed=1 utilisent le même fichier en cache. */
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(caches.open(VERSION).then(function (cache) {
    return cache.match(req, { ignoreSearch: true }).then(function (cached) {
      var network = fetch(req).then(function (res) {
        if (res && res.ok) cache.put(req.url.split('?')[0], res.clone());   /* stocké sans paramètres */
        return res;
      }).catch(function () {
        /* hors ligne et fichier jamais vu : on renvoie l'accueil pour une page, rien sinon */
        return cached || (req.mode === 'navigate' ? cache.match('index.html') : Response.error());
      });
      return cached || network;
    });
  }).catch(function () { return fetch(req); }));
});
