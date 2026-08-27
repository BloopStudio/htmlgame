# Contribuer à CodeQuest

Merci de vouloir contribuer ! CodeQuest est un projet 100% statique
(HTML/CSS/JS) avec un petit backend PHP optionnel : aucune dépendance ni
étape de build n'est nécessaire.

## Avant de commencer

- Vérifie les [issues existantes](../../issues) pour éviter les doublons.
- Pour un changement important (nouveau parcours, refonte de l'interface...),
  ouvre d'abord une issue pour en discuter.
- Pour une correction simple (bug, typo, petit ajustement), une pull request
  directe est la bienvenue.

## Mettre en place le projet en local

```bash
git clone https://github.com/BloopStudio/htmlgame.git
cd htmlgame
python3 -m http.server 8080
# ouvre http://localhost:8080
```

Pour tester le backend PHP optionnel :

```bash
php -S localhost:8080
```

## Ajouter un défi

Les défis vivent dans [`js/data.js`](js/data.js). Chaque parcours
(`CODEQUEST_DATA.tracks`) contient un tableau `challenges`. Choisis le `type`
adapté :

- `"html"` : le joueur écrit du HTML, validé via `test(document)` sur le DOM
  rendu dans un iframe sandboxée.
- `"css"` : le joueur écrit du CSS appliqué à un `baseHtml` fixe, validé via
  `test(window, document)` sur les styles calculés.
- `"js"` : le joueur écrit une fonction (`functionName`), validée par une
  liste de `tests` (`args` / `expected`), exécutée de façon isolée dans une
  iframe sandboxée sans accès à la page.
- `"quiz"` : question à choix multiples (utilisé pour PHP, non exécutable sur
  GitHub Pages), avec `code`, `question`, `options` et l'index `correct`.

Chaque défi doit aussi avoir un champ `lesson` : une courte explication (2-3
phrases) avec un exemple de code, qui introduit **un seul concept nouveau**
en s'appuyant sur ce qui a déjà été enseigné dans les défis précédents du
même parcours. Regarde les défis existants comme modèles, et garde des
instructions et des indices clairs, adaptés à un public débutant.

## Style de code

- Pas de dépendance externe ni de bundler : du HTML/CSS/JS "vanille".
- Commentaires en français, dans le même ton pédagogique que le reste du
  projet.
- Merci de tester manuellement le défi ajouté (le vérifier en local dans le
  navigateur) avant d'ouvrir la pull request.

## Pull requests

- Décris clairement ce que change ta PR et pourquoi.
- Une PR = un sujet (évite de mélanger plusieurs changements sans rapport).
- Sois patient·e le temps qu'une relecture ait lieu.

Merci de contribuer à rendre l'apprentissage du code plus accessible ! 🎉
