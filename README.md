# LabVirtyèl Ayiti — prototype

Un projet **DUVTECH**.

Un laboratoire virtuel bilingue (français et kreyòl) qui fonctionne **sans Internet et sans serveur**.

Publics : écoles classiques (3e cycle du fondamental et secondaire), universités, formation professionnelle et grand public.

## Lancer le prototype
Double-cliquez sur `index.html`, ou copiez le dossier sur une clé USB ou un téléphone et ouvrez `index.html` dans le navigateur.

## Structure
```
LabVirtyel-Ayiti/
├── index.html          Accueil : recherche, domaines, parcours à la une
├── simulations.html    Galerie des simulations : vignettes, filtres par domaine et niveau, vue grille ou liste
├── bibliotheque.html   Bibliothèque : ressources et parcours, filtres et recherche
├── ressource.html      Page d'une ressource (?id=sim-titrage)
├── parcours.html       Parcours guidé en étapes (?id=p-chimie)
├── etudiant.html       Ma classe : rejoindre une classe, envoyer sa progression
├── enseignant.html     Espace enseignant : classes, parcours assignés, tableau de bord
├── js/classe.js        codes d'invitation (LVC1.) et de résultats (LVR1.), sans serveur
├── css/style.css       styles communs (thème clair et sombre)
├── css/app.css         styles des pages Accueil, Bibliothèque, Ressource, Parcours
├── js/common.js        langue FR/HT, graphiques, curseurs, mode intégré
├── js/data.js          CATALOGUE : ressources (simulations, articles, quiz) et parcours
├── js/app.js           cartes, quiz, progression (stockée dans le navigateur)
├── img/sims/          Vignettes des simulations (640 × 360, JPEG). Une par simulation, même nom que le fichier HTML.
└── sims/
    ├── pendule.html    Physique : pendule simple
    ├── titrage.html    Chimie : titrage acide-base
    ├── mendel.html     SVT : croisements de Mendel
    ├── ohm.html        Électronique : loi d'Ohm et LED
    ├── logique.html    Informatique : portes logiques
    ├── sir.html        Santé : épidémie (modèle SIR)
    └── solaire.html    Physique : panneau solaire et bilan d'énergie d'une maison
```

## Matériel de physique (3B Scientific)
`js/data-materiel.js` ajoute 1292 fiches « Matériel » au domaine Physique de la bibliothèque (nom, référence, code fabricant, description courte, lien vers la fiche du fournisseur). Les données ont été relevées le 19/11/2026 sur le catalogue en ligne de 3B Scientific ; les descriptions sont en français seulement et les photos restent sur le site du fournisseur. Le fichier n'est chargé que par `bibliotheque.html` et `ressource.html`.

## Apparence et profil utilisateur
- `profil.html` (lien « Mon profil » en haut de chaque page) : nom, établissement, rôle, progression personnelle, export de ses données, et réglages d'affichage.
- 4 palettes, chacune en clair et en sombre : **Classique** (par défaut : blanc, bleu, brique), **Haïti** (bleu et rouge du drapeau), **Sobre** (gris anthracite), **Contraste élevé** (accessibilité). 3 tailles de texte.
- Les couleurs sont définies une seule fois, en haut de `css/style.css` (variables `--accent`, `--red`, `--d-physique`…). Pour créer une nouvelle palette, copiez un bloc `[data-palette="…"]` et ajoutez-la dans la liste `PALETTES` de `profil.html`.
- `js/theme.js` applique les réglages avant l'affichage. Une adresse peut aussi les forcer : `index.html?palette=haiti&mode=sombre`.

## Application installable (téléphone et ordinateur)
Le site est une PWA : `manifest.webmanifest` (nom, icônes, couleurs) et `sw.js` (copie hors ligne de tous les fichiers).
- **Condition :** l'installation ne marche qu'avec une adresse **https://** (ou `http://localhost`). En ouvrant le fichier directement (`file://`), le site fonctionne mais ne s'installe pas.
- **Tester sur l'ordinateur :** double-cliquez sur `lancer-serveur.bat` (Python requis), puis « Installer » dans Chrome ou Edge.
- **Publier pour les téléphones :** hébergez le dossier sur un hébergement statique gratuit en https (GitHub Pages, Netlify, Cloudflare Pages).
- **Mise à jour :** après toute modification, changez `VERSION` dans `sw.js` (ex. `lv-v2`), sinon les téléphones gardent l'ancienne version.
- **Nouveau fichier :** ajoutez-le à la liste `FILES` de `sw.js` pour qu'il soit disponible hors ligne.

## Comptes, ressources des enseignants et administration (Supabase)
Le laboratoire est réservé aux participants inscrits. Le serveur est un projet Supabase (`js/config.js`).

| Page | Pour qui | Rôle |
|---|---|---|
| `compte.html` | tout le monde | inscription, connexion, confirmation par e-mail, mot de passe oublié |
| `confidentialite.html` | tout le monde | données personnelles |
| `communaute.html` | participants confirmés | ressources publiées par les enseignants |
| `contribuer.html` | enseignants validés | dépôt d'articles, de documents (PDF, PNG, JPEG, WebP, 10 Mo) et de liens https |
| `admin.html` | administrateurs | tableau de bord, participants, demandes enseignant, validation des ressources, export CSV |

Sécurité :
- Toutes les règles sont appliquées par le serveur (`supabase/schema.sql`, Row Level Security). Modifier la page ne donne aucun droit.
- Un participant ne peut pas changer son rôle ni son statut. Une ressource ajoutée ou modifiée repasse toujours « en attente ».
- Les fichiers sont privés et ne s'ouvrent que par un lien signé valable 2 minutes. Le texte des dépôts n'est jamais interprété comme du HTML.
- `js/gate.js` renvoie vers `compte.html` sans session. Le code des simulations reste lisible dans le dépôt public GitHub : la garde protège l'accès au site, pas le code source.
- Ne jamais mettre la clé `service_role` ni le mot de passe de la base dans le site.

Mise en service (une seule fois) :
1. Supabase → SQL Editor : exécuter `supabase/schema.sql`.
2. Supabase → Authentication → URL Configuration : Site URL = `https://duverts.github.io/labvirtyel-ayiti/`, Redirect URLs = `https://duverts.github.io/labvirtyel-ayiti/**` et `http://localhost:8000/**`.
3. Supabase → Authentication → Emails → SMTP Settings : brancher un service d'envoi (Brevo, Resend…). Sans cela, Supabase n'envoie les e-mails qu'aux membres de l'équipe du projet.
4. Créer son propre compte sur le site, confirmer l'e-mail, puis exécuter dans SQL Editor :
   `update public.profiles set role = 'admin', teacher_status = 'approuve' where email = 'votre@adresse';`

## Suivi des étudiants sans serveur
1. L'enseignant crée une classe dans « Espace enseignant » et partage le **code d'invitation** (`LVC1.…`).
2. L'étudiant le colle dans « Ma classe », fait les parcours, puis génère son **code de résultats** (`LVR1.…`) et l'envoie (WhatsApp, SMS, fichier).
3. L'enseignant colle les codes reçus (ou choisit les fichiers) dans « Importer des résultats ». Le tableau de bord se met à jour. Export CSV possible.

Limites : les données restent dans le navigateur de chacun. Sur un ordinateur partagé, la progression des étudiants se mélange. La vraie plateforme (phase pilote) remplacera ces codes par une synchronisation automatique avec un serveur.

## Ajouter un article, un quiz ou un parcours
Tout se fait dans `js/data.js`, sans toucher aux pages : copiez un bloc existant, changez son `id` et ses textes `fr`/`ht`. Pour un parcours, listez les `id` des ressources dans `steps`.

## Ajouter une nouvelle simulation
1. Copiez `sims/pendule.html` sous un nouveau nom.
2. Pour chaque texte visible, ajoutez les deux langues : `data-fr="..."` et `data-ht="..."`.
3. Pour le texte généré en JavaScript, utilisez `LV.t('texte français', 'tèks kreyòl')`, et appelez `LV.onLang(render)` pour redessiner quand la langue change.
4. Pour relier un curseur, utilisez `LV.bindRange('id', format, fonction)`.
5. Ajoutez sa vignette dans `img/sims/` (capture de la simulation, 640 × 360) et dans la liste `FILES` de `sw.js`.
6. Déclarez-la dans `js/data.js` (type `simulation`, champ `src`) : elle apparaît alors dans la bibliothèque et peut être intégrée à un parcours.

## Règles
- Pas de bibliothèque externe ni de chargement réseau : tout doit marcher hors ligne.
- Pas de modules ES (`import`), car ils ne fonctionnent pas en ouvrant le fichier directement.
- Les textes en kreyòl doivent être relus par un locuteur formé avant toute diffusion.
