# Guide HTML 🧱

HTML (*HyperText Markup Language*) sert à **structurer** le contenu d'une
page web : titres, paragraphes, listes, liens, images, formulaires...

## Les bases

Une page HTML est faite de **balises**, généralement ouvertes et fermées :

```html
<h1>Ceci est un titre</h1>
<p>Ceci est un paragraphe.</p>
```

Certaines balises n'ont pas de fermeture, comme `<img>` ou `<input>`.

## Les balises utilisées dans les défis CodeQuest

| Balise | Rôle |
|---|---|
| `<h1>` à `<h6>` | Titres, du plus important au moins important |
| `<ul>` / `<li>` | Liste à puces et ses éléments |
| `<a href="...">` | Lien vers une autre page |
| `<img src="..." alt="...">` | Image (l'attribut `alt` la décrit) |
| `<input type="...">` | Champ de formulaire (`text`, `email`...) |
| `<button>` | Bouton cliquable |

## Astuces pour les défis

- Le texte à l'intérieur d'une balise doit correspondre **exactement** à ce
  qui est demandé (attention aux majuscules et aux espaces).
- L'attribut `alt` d'une image sert à décrire l'image pour les personnes
  malvoyantes ou si l'image ne charge pas : pense toujours à le renseigner.
- Tu peux ouvrir les outils de développement de ton navigateur (touche F12)
  pour inspecter le HTML généré si un test ne passe pas.

## Pour aller plus loin

- [MDN Web Docs — HTML](https://developer.mozilla.org/fr/docs/Web/HTML)
