# Contenu du Wiki GitHub

Ce dossier contient le contenu prévu pour le **Wiki** du dépôt GitHub
(`https://github.com/BloopStudio/htmlgame/wiki`).

Il est versionné ici en source de vérité, car le Wiki GitHub est un dépôt
git séparé (`htmlgame.wiki.git`) qui n'existe que si la fonctionnalité Wiki
est activée sur le dépôt principal, et il faut être propriétaire/admin du
dépôt pour l'activer et y pousser du contenu.

## Comment publier ces pages sur le vrai Wiki

1. Aller dans **Settings → Features** du dépôt et cocher **Wikis**.
2. Aller dans l'onglet **Wiki** du dépôt et cliquer sur **Create the first page**
   (cela initialise le dépôt `htmlgame.wiki.git`).
3. Cloner ce nouveau dépôt en local :
   ```bash
   git clone https://github.com/BloopStudio/htmlgame.wiki.git
   ```
4. Copier tous les fichiers de ce dossier (`wiki/*.md`, sauf ce README) dans
   le clone du wiki, puis committer et pousser :
   ```bash
   cp wiki/*.md htmlgame.wiki/
   rm htmlgame.wiki/README.md   # ce fichier explicatif n'a pas sa place dans le wiki
   cd htmlgame.wiki
   git add .
   git commit -m "Ajoute les pages du wiki CodeQuest"
   git push
   ```

`Home.md` devient la page d'accueil du wiki, et `_Sidebar.md` fournit le menu
de navigation latéral affiché sur toutes les pages.

Pense à garder ce dossier synchronisé si tu modifies le wiki par la suite (ou
inversement).
