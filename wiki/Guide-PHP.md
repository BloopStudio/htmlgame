# Guide PHP 🐘

PHP est un langage qui s'exécute **côté serveur** : c'est lui qui, par
exemple, génère le contenu d'une page avant de l'envoyer au navigateur.

## Pourquoi le parcours PHP est différent

GitHub Pages n'héberge que des fichiers statiques (HTML/CSS/JS) : il ne peut
pas exécuter de PHP. Le parcours PHP de CodeQuest se joue donc sous forme de
**questions à choix multiples** : tu lis un extrait de code PHP, et tu dois
deviner ce qu'il affiche, ou quelle fonction utiliser.

## Les bases du PHP

Un script PHP commence par `<?php` et se termine par `?>`. On affiche du
texte avec `echo` :

```php
<?php
$nom = "Alice";
echo "Bonjour " . $nom;
?>
```

## Les notions utilisées dans les défis CodeQuest

| Notion | Exemple |
|---|---|
| Variable | `$nom = "Alice";` (toujours précédée de `$`) |
| Concaténation | `"Bonjour " . $nom` (le point `.` colle les chaînes) |
| Boucle for | `for ($i = 1; $i <= 3; $i++) { ... }` |
| Tableaux | `["pomme", "poire"]`, `count($tableau)` |
| Comparaison stricte | `===` compare la valeur **et** le type |

## Astuces pour les défis

- En PHP, `.` sert à concaténer (coller des chaînes), alors qu'en JavaScript
  c'est `+`. C'est une source classique de confusion !
- `==` compare seulement la valeur (`"5" == 5` est vrai), alors que `===`
  compare aussi le type (`"5" === 5` est faux, car une chaîne n'est pas un
  entier).

## Aller plus loin : le vrai backend PHP du projet

Le dépôt contient un petit backend PHP fonctionnel dans
[`php/api`](https://github.com/BloopStudio/htmlgame/tree/main/php/api), qui
sauvegarde la progression de jeu dans un fichier JSON. Il ne s'exécute pas
sur GitHub Pages, mais tu peux le lancer en local avec :

```bash
php -S localhost:8080
```

C'est un bon exemple de code PHP réel à étudier une fois les bases acquises.

## Pour aller plus loin

- [PHP.net — Manuel officiel](https://www.php.net/manual/fr/)
