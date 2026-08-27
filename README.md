<img src="assets/logo.svg" alt="Logo CodeQuest" width="72" height="72">

# CodeQuest

CodeQuest est un jeu d'aventure web gratuit et open source pour **apprendre à coder en HTML, CSS, JavaScript et PHP**, en s'amusant. Explore une carte de royaumes, résous des défis de code avec un retour instantané, gagne de l'XP, débloque des badges et laisse Pixel, ta mascotte, t'encourager en chemin.

**👉 Jouer en ligne :** `https://bloopstudio.github.io/htmlgame/` *(à activer, voir plus bas)*

## Comment ça marche

Le jeu propose 4 royaumes de 12 défis chacun (48 au total), à conquérir dans l'ordre sur la carte :

| Royaume | Langage | Contenu | Format des défis |
|---|---|---|---|
| 🧱 Le Village des Balises | HTML | Balises, listes, tableaux, formulaires, conteneurs | Écris du HTML, testé en direct sur le DOM |
| 🎨 La Forêt des Couleurs | CSS | Couleurs, boîte de modèle, bordures, Flexbox | Écris du CSS, testé via les styles calculés |
| ⚡ La Montagne de la Logique | JavaScript | Fonctions, conditions, boucles, tableaux | Écris une fonction, testée avec plusieurs cas |
| 🐘 La Citadelle du Serveur | PHP | Variables, types, boucles, tableaux, fonctions | Questions à choix multiples (voir pourquoi ci-dessous) |

Chaque défi commence par une courte **leçon** (📘, avec explication et exemple) avant l'exercice : les parcours sont construits pour introduire un seul concept nouveau à la fois, en s'appuyant sur les précédents. À l'intérieur d'un royaume, les défis se débloquent un par un, façon jeu mobile : impossible de sauter une étape.

Chaque défi réussi rapporte de l'XP et fait avancer ta série (🔥) ; un royaume se débloque une fois le précédent entièrement conquis. En chemin, tu peux débloquer des **badges** (🏅, ex: "Sans-faute", "Série de 10", "Légende de CodeQuest") consultables à tout moment depuis l'en-tête. Des sons et des confettis accompagnent chaque victoire (les sons se coupent depuis le bouton 🔊). La progression est sauvegardée automatiquement dans le navigateur (`localStorage`).

### Pourquoi le PHP est en mode "quiz" ?

GitHub Pages n'héberge que des fichiers statiques : il ne peut pas exécuter de code PHP côté serveur. Le parcours PHP est donc présenté sous forme de questions (lire un extrait de code, prédire ce qu'il affiche, choisir la bonne fonction...), ce qui reste pédagogique sans nécessiter de serveur.

Pour celles et ceux qui veulent aussi *exécuter* du vrai PHP, le dossier [`php/`](php) contient un petit backend fonctionnel (voir plus bas).

## Lancer le projet en local

Aucune installation n'est nécessaire pour la partie HTML/CSS/JS : c'est un site 100% statique.

```bash
git clone https://github.com/BloopStudio/htmlgame.git
cd htmlgame
python3 -m http.server 8080
# puis ouvre http://localhost:8080
```

### Avec le backend PHP (optionnel)

Le dossier [`php/api`](php/api) contient deux scripts (`save_progress.php` et `get_progress.php`) qui sauvegardent la progression côté serveur, dans un fichier JSON par joueur. Ils sont ignorés par GitHub Pages, mais fonctionnent avec un vrai serveur PHP :

```bash
php -S localhost:8080
```

Le jeu essaie automatiquement d'appeler ces endpoints après chaque défi réussi ; si l'appel échoue (comme sur GitHub Pages), tout continue de fonctionner normalement grâce à `localStorage`.

## Déploiement sur GitHub Pages

Ce dépôt inclut un workflow GitHub Actions ([`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)) qui déploie automatiquement le site à chaque push sur `main`.

Pour l'activer :
1. Aller dans **Settings → Pages** du dépôt.
2. Dans **Build and deployment → Source**, choisir **GitHub Actions**.
3. Pousser (ou fusionner) sur `main` : le site se déploie automatiquement à l'URL `https://bloopstudio.github.io/htmlgame/`.

## Structure du projet

```
index.html          Page principale du jeu
css/style.css        Styles (carte, chemins, mascotte, badges, confettis...)
js/data.js           Contenu des royaumes/défis, badges et messages de la mascotte
js/sound.js          Effets sonores synthétisés (Web Audio API, aucun fichier audio)
js/app.js            Moteur du jeu (carte, navigation, validation, sauvegarde)
php/api/             Backend optionnel (sauvegarde de progression)
.github/workflows/   Déploiement automatique sur GitHub Pages
```

## Ajouter un nouveau défi

Tous les défis sont définis dans [`js/data.js`](js/data.js), dans le tableau `CODEQUEST_DATA.tracks` (un royaume = un `track`, avec son `worldName` et sa couleur `theme`). Chaque royaume a un tableau `challenges`, avec un `type` (`html`, `css`, `js` ou `quiz`) qui détermine la façon dont il est validé, et un champ `lesson` (courte explication + exemple) affiché avant l'énoncé — voir les exemples existants et [`js/app.js`](js/app.js) pour le détail de la validation. Les badges à débloquer sont définis dans `CODEQUEST_BADGES`, et les messages de la mascotte dans `CODEQUEST_MASCOT`, dans le même fichier.

Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour proposer une contribution.

## Licence

Ce projet est distribué sous licence [MIT](LICENSE).
