# Politique de sécurité

## Portée

CodeQuest est un jeu pédagogique statique (HTML/CSS/JS) avec un petit backend
PHP optionnel (`php/api`) utilisé uniquement pour sauvegarder la progression
de jeu. Il ne traite ni données personnelles sensibles, ni paiements, ni
authentification.

Points d'attention connus, déjà pris en compte dans le code :

- Le code HTML/CSS écrit par le joueur est rendu dans une iframe sandboxée
  (`sandbox="allow-same-origin"`, sans `allow-scripts`) : les scripts qu'il
  contiendrait ne s'exécutent pas.
- Le code JavaScript écrit par le joueur s'exécute dans une iframe isolée
  (`sandbox="allow-scripts"`, sans `allow-same-origin`) : il n'a accès ni au
  DOM de la page, ni à `localStorage`, ni aux cookies.
- Le backend PHP valide le format du jeton de progression (alphanumérique)
  avant de construire un chemin de fichier, pour éviter toute traversée de
  répertoire.

## Signaler une vulnérabilité

Si tu découvres une faille de sécurité (par exemple un moyen de sortir du
bac à sable des iframes, ou une faille dans le backend PHP), merci de la
signaler de façon responsable :

- Ouvre une [Security Advisory privée](../../security/advisories/new) sur ce
  dépôt GitHub plutôt qu'une issue publique.
- Décris le problème, les étapes de reproduction, et l'impact potentiel.

Nous ferons de notre mieux pour répondre rapidement et corriger le problème
avant toute divulgation publique.
