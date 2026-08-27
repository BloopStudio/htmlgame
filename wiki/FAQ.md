# FAQ

### Ma progression a disparu, que s'est-il passé ?

La progression est stockée dans le `localStorage` de ton navigateur, sur
l'appareil et le navigateur utilisés. Si tu vides le cache, utilises la
navigation privée, ou changes de navigateur/appareil, ta progression ne sera
pas conservée. Il n'y a pas (encore) de compte utilisateur.

### Pourquoi je ne peux pas exécuter mon code PHP dans le jeu ?

GitHub Pages, où le jeu est hébergé, ne sait servir que des fichiers
statiques (HTML, CSS, JS, images...) : il ne peut pas exécuter de PHP côté
serveur. Le parcours PHP est donc proposé sous forme de questions. Voir le
[[Guide PHP]] pour plus de détails, et comment lancer le vrai backend PHP du
projet en local.

### Un parcours reste verrouillé, pourquoi ?

Les parcours se débloquent dans l'ordre : HTML → CSS → JavaScript → PHP. Il
faut terminer **tous** les défis d'un parcours pour débloquer le suivant.

### Mon code HTML/CSS semble correct mais le test échoue, pourquoi ?

La validation est stricte sur certains points (texte exact, valeur de couleur
calculée...). Relis attentivement l'énoncé et utilise le bouton **💡
Indice**. Tu peux aussi ouvrir les outils de développement du navigateur
(F12) pour inspecter l'aperçu généré.

### J'ai trouvé un bug, ou une idée de défi à ajouter, où en parler ?

Ouvre une [issue sur GitHub](https://github.com/BloopStudio/htmlgame/issues)
en choisissant le modèle adapté (bug ou idée). Voir aussi [[Contribuer]].
