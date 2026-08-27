# Guide CSS 🎨

CSS (*Cascading Style Sheets*) sert à **mettre en forme** une page HTML :
couleurs, tailles, espacements, mise en page...

## Les bases

Une règle CSS cible un élément (par un sélecteur) et lui applique des
propriétés :

```css
#target {
  color: red;
  background-color: yellow;
}
```

Ici, `#target` cible l'élément dont l'attribut `id="target"`.

## Les propriétés utilisées dans les défis CodeQuest

| Propriété | Rôle |
|---|---|
| `color` | Couleur du texte |
| `background-color` | Couleur de fond |
| `text-align` | Alignement du texte (`left`, `center`, `right`) |
| `border-radius` | Arrondi des coins d'un élément |
| `display: flex` | Active la mise en page Flexbox |
| `justify-content` | Alignement horizontal en Flexbox |
| `align-items` | Alignement vertical en Flexbox |

## Astuces pour les défis

- Les défis CSS te fournissent un HTML déjà écrit (affiché en lecture
  seule) : tu n'as qu'à écrire les règles CSS qui s'y appliquent.
- Le jeu vérifie le **style calculé** (`getComputedStyle`) : peu importe la
  syntaxe exacte que tu utilises (`red` ou `#ff0000`), tant que le résultat
  final est le bon.
- Pour Flexbox, retiens ces trois propriétés qui vont souvent ensemble :
  `display: flex; justify-content: center; align-items: center;`

## Pour aller plus loin

- [MDN Web Docs — CSS](https://developer.mozilla.org/fr/docs/Web/CSS)
- [Flexbox Froggy](https://flexboxfroggy.com/#fr) — un jeu pour pratiquer Flexbox
