# LabVirtyèl Ayiti — prototype

Un projet **DUVTECH**.

Un laboratoire virtuel bilingue (français et kreyòl) qui fonctionne **sans Internet et sans serveur**.

Publics : écoles classiques (3e cycle du fondamental et secondaire), universités, formation professionnelle et grand public. L'accueil renvoie aussi vers le catalogue Harvard de 34 000 ressources d'apprentissage et d'enseignement (en ligne, surtout en anglais).

## Lancer le prototype
Double-cliquez sur `index.html`, ou copiez le dossier sur une clé USB ou un téléphone et ouvrez `index.html` dans le navigateur.

## Structure
```
LabVirtyel-Ayiti/
├── index.html          Accueil : recherche, domaines, parcours à la une
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
└── sims/
    ├── pendule.html    Physique : pendule simple
    ├── titrage.html    Chimie : titrage acide-base
    ├── mendel.html     SVT : croisements de Mendel
    ├── ohm.html        Électronique : loi d'Ohm et LED
    ├── logique.html    Informatique : portes logiques
    ├── sir.html        Santé : épidémie (modèle SIR)
    └── solaire.html    Physique : panneau solaire et bilan d'énergie d'une maison
```

## Apparence et profil utilisateur
- `profil.html` (lien « Mon profil » en haut de chaque page) : nom, établissement, rôle, progression personnelle, export de ses données, et réglages d'affichage.
- 4 palettes, chacune en clair et en sombre : **Classique** (par défaut : papier, bleu marine, bordeaux), **Haïti** (bleu et rouge du drapeau), **Sobre** (gris anthracite), **Contraste élevé** (accessibilité). 3 tailles de texte.
- Les couleurs sont définies une seule fois, en haut de `css/style.css` (variables `--accent`, `--red`, `--d-physique`…). Pour créer une nouvelle palette, copiez un bloc `[data-palette="…"]` et ajoutez-la dans la liste `PALETTES` de `profil.html`.
- `js/theme.js` applique les réglages avant l'affichage. Une adresse peut aussi les forcer : `index.html?palette=haiti&mode=sombre`.

## Application installable (téléphone et ordinateur)
Le site est une PWA : `manifest.webmanifest` (nom, icônes, couleurs) et `sw.js` (copie hors ligne de tous les fichiers).
- **Condition :** l'installation ne marche qu'avec une adresse **https://** (ou `http://localhost`). En ouvrant le fichier directement (`file://`), le site fonctionne mais ne s'installe pas.
- **Tester sur l'ordinateur :** double-cliquez sur `lancer-serveur.bat` (Python requis), puis « Installer » dans Chrome ou Edge.
- **Publier pour les téléphones :** hébergez le dossier sur un hébergement statique gratuit en https (GitHub Pages, Netlify, Cloudflare Pages).
- **Mise à jour :** après toute modification, changez `VERSION` dans `sw.js` (ex. `lv-v2`), sinon les téléphones gardent l'ancienne version.
- **Nouveau fichier :** ajoutez-le à la liste `FILES` de `sw.js` pour qu'il soit disponible hors ligne.

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
5. Déclarez-la dans `js/data.js` (type `simulation`, champ `src`) : elle apparaît alors dans la bibliothèque et peut être intégrée à un parcours.

## Règles
- Pas de bibliothèque externe ni de chargement réseau : tout doit marcher hors ligne.
- Pas de modules ES (`import`), car ils ne fonctionnent pas en ouvrant le fichier directement.
- Les textes en kreyòl doivent être relus par un locuteur formé avant toute diffusion.
