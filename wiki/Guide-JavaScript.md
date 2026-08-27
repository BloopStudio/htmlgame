# Guide JavaScript ⚡

JavaScript est le langage qui rend une page web **interactive** : calculs,
conditions, boucles, réactions aux clics...

## Les bases

Une fonction se déclare avec le mot-clé `function`, et renvoie une valeur
avec `return` :

```js
function addition(a, b) {
  return a + b;
}
```

## Les notions utilisées dans les défis CodeQuest

| Notion | Exemple |
|---|---|
| Fonction | `function nom(param) { ... }` |
| Condition | `if (n % 2 === 0) { ... } else { ... }` |
| Modulo (reste de division) | `n % 2` (pair si égal à 0) |
| Tableaux | `[3, 7, 2]`, `Math.max(...tableau)` |
| Chaînes de caractères | `"bonjour".split('').reverse().join('')` |

## Astuces pour les défis

- Chaque défi te donne le **nom exact** de la fonction à écrire : respecte-le
  bien (majuscules comprises), sinon le jeu ne pourra pas l'appeler.
- Le jeu exécute ton code dans une iframe totalement isolée du reste de la
  page : c'est normal si tu ne peux pas accéder à `document` ou
  `localStorage` depuis ton code, ce n'est pas nécessaire pour les défis.
- La console de test à droite de l'éditeur affiche le résultat de chaque
  appel de ta fonction, avec ce qui était attendu si ça ne correspond pas.

## Pour aller plus loin

- [MDN Web Docs — JavaScript](https://developer.mozilla.org/fr/docs/Web/JavaScript)
