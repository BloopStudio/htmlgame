/**
 * CodeQuest - Données des parcours et des défis.
 * 4 parcours : HTML, CSS, JS, PHP. Chaque parcours enseigne un concept à la
 * fois : chaque défi a un champ "lesson" (courte leçon + exemple) affiché
 * avant l'exercice, pour progresser étape par étape.
 *
 * Le "type" détermine comment un défi est validé (voir js/app.js) :
 *  - "html" : le joueur écrit du HTML, testé via le DOM d'un iframe sandboxé.
 *  - "css"  : le joueur écrit du CSS appliqué à un HTML fixe, testé via getComputedStyle.
 *  - "js"   : le joueur écrit une fonction JS, testée via des cas d'entrée/sortie.
 *  - "quiz" : le joueur répond à une question à choix multiple (utilisé pour PHP,
 *             car GitHub Pages ne peut pas exécuter de PHP côté client).
 */

const CODEQUEST_DATA = {
  tracks: [
    {
      id: "html",
      title: "HTML",
      icon: "🧱",
      pitch: "Structure une page web, une balise à la fois.",
      challenges: [
        {
          id: "html-01",
          type: "html",
          title: "Ton premier titre",
          lesson:
            "Une page HTML est construite avec des <strong>balises</strong>. La balise <code>&lt;h1&gt;</code> sert à écrire le titre principal d'une page (il ne devrait y en avoir qu'un seul). Exemple : <code>&lt;h1&gt;Mon site&lt;/h1&gt;</code>.",
          instructions:
            "Crée un titre principal <code>&lt;h1&gt;</code> contenant exactement le texte : <strong>Bonjour le Web</strong>",
          starter: "<!-- Écris ton code HTML ici -->\n",
          hint: "&lt;h1&gt;Bonjour le Web&lt;/h1&gt;",
          xp: 10,
          test(doc) {
            const h1 = doc.querySelector("h1");
            if (!h1) return { pass: false, message: "Aucune balise <h1> trouvée." };
            if (h1.textContent.trim() !== "Bonjour le Web") {
              return { pass: false, message: `Le texte du <h1> doit être exactement "Bonjour le Web".` };
            }
            return { pass: true, message: "Bien joué, ton titre est parfait !" };
          },
        },
        {
          id: "html-02",
          type: "html",
          title: "Ton premier paragraphe",
          lesson:
            "Le texte courant d'une page se place dans des paragraphes, avec la balise <code>&lt;p&gt;</code> (comme <em>paragraph</em>). Exemple : <code>&lt;p&gt;Voici un paragraphe.&lt;/p&gt;</code>.",
          instructions:
            "Crée un paragraphe <code>&lt;p&gt;</code> contenant exactement le texte : <strong>J'apprends à coder.</strong>",
          starter: "<!-- Écris ton code HTML ici -->\n",
          hint: "&lt;p&gt;J'apprends à coder.&lt;/p&gt;",
          xp: 10,
          test(doc) {
            const p = doc.querySelector("p");
            if (!p) return { pass: false, message: "Aucune balise <p> trouvée." };
            if (p.textContent.trim() !== "J'apprends à coder.") {
              return { pass: false, message: `Le texte du <p> doit être exactement "J'apprends à coder.".` };
            }
            return { pass: true, message: "Ton premier paragraphe est parfait !" };
          },
        },
        {
          id: "html-03",
          type: "html",
          title: "Un sous-titre",
          lesson:
            "Les titres sont hiérarchisés de <code>&lt;h1&gt;</code> (le plus important) à <code>&lt;h6&gt;</code> (le moins important). Un <code>&lt;h2&gt;</code> sert par exemple à introduire une section sous le titre principal.",
          instructions:
            "Crée un sous-titre <code>&lt;h2&gt;</code> contenant exactement le texte : <strong>Mes loisirs</strong>",
          starter: "<!-- Écris ton code HTML ici -->\n",
          hint: "&lt;h2&gt;Mes loisirs&lt;/h2&gt;",
          xp: 10,
          test(doc) {
            const h2 = doc.querySelector("h2");
            if (!h2) return { pass: false, message: "Aucune balise <h2> trouvée." };
            if (h2.textContent.trim() !== "Mes loisirs") {
              return { pass: false, message: `Le texte du <h2> doit être exactement "Mes loisirs".` };
            }
            return { pass: true, message: "Parfait, ta hiérarchie de titres prend forme !" };
          },
        },
        {
          id: "html-04",
          type: "html",
          title: "Mettre en valeur du texte",
          lesson:
            "Pour insister sur un mot, on utilise <code>&lt;strong&gt;</code> (important, généralement en gras) ou <code>&lt;em&gt;</code> (emphase, généralement en italique). Exemple : <code>&lt;strong&gt;Attention&lt;/strong&gt;</code>.",
          instructions:
            'Ajoute un texte en <code>&lt;strong&gt;</code> qui contient le mot <strong>important</strong>, ainsi qu\'un texte en <code>&lt;em&gt;</code> (n\'importe lequel).',
          starter: "<!-- Écris ton code HTML ici -->\n",
          hint: "&lt;strong&gt;C'est important&lt;/strong&gt; &lt;em&gt;vraiment&lt;/em&gt;",
          xp: 15,
          test(doc) {
            const strong = doc.querySelector("strong");
            const em = doc.querySelector("em");
            if (!strong) return { pass: false, message: "Aucune balise <strong> trouvée." };
            if (!strong.textContent.toLowerCase().includes("important")) {
              return { pass: false, message: 'Le texte du <strong> doit contenir le mot "important".' };
            }
            if (!em || !em.textContent.trim()) {
              return { pass: false, message: "Aucune balise <em> avec du texte trouvée." };
            }
            return { pass: true, message: "Ton texte a maintenant du relief !" };
          },
        },
        {
          id: "html-05",
          type: "html",
          title: "Un lien vers l'extérieur",
          lesson:
            "Un lien hypertexte s'écrit avec <code>&lt;a href=\"...\"&gt;texte&lt;/a&gt;</code>. L'attribut <code>href</code> donne l'adresse de destination.",
          instructions:
            'Crée un lien <code>&lt;a&gt;</code> qui pointe vers <code>https://example.com</code> et affiche le texte <strong>Visiter</strong>.',
          starter: "<!-- Ajoute ton lien ici -->\n",
          hint: '&lt;a href="https://example.com"&gt;Visiter&lt;/a&gt;',
          xp: 15,
          test(doc) {
            const link = doc.querySelector('a[href="https://example.com"]');
            if (!link) return { pass: false, message: 'Aucun lien avec href="https://example.com" trouvé.' };
            if (link.textContent.trim().toLowerCase() !== "visiter") {
              return { pass: false, message: 'Le texte du lien doit être "Visiter".' };
            }
            return { pass: true, message: "Ton lien fonctionne à merveille !" };
          },
        },
        {
          id: "html-06",
          type: "html",
          title: "Ajoute une image",
          lesson:
            "La balise <code>&lt;img&gt;</code> ne s'écrit pas en deux morceaux (pas de fermeture). Elle a besoin d'un attribut <code>src</code> (l'image) et d'un attribut <code>alt</code> qui la décrit, pour l'accessibilité.",
          instructions:
            'Ajoute une balise <code>&lt;img&gt;</code> avec un attribut <code>alt</code> qui contient le mot <strong>chat</strong> (peu importe la casse).',
          starter: "<!-- Ajoute ton image ici -->\n",
          hint: '&lt;img src="chat.jpg" alt="Un chat roux"&gt;',
          xp: 15,
          test(doc) {
            const img = doc.querySelector("img[alt]");
            if (!img) return { pass: false, message: "Aucune image avec un attribut alt trouvée." };
            if (!img.getAttribute("alt").toLowerCase().includes("chat")) {
              return { pass: false, message: 'L\'attribut alt doit contenir le mot "chat".' };
            }
            return { pass: true, message: "Super, ton image est bien décrite !" };
          },
        },
        {
          id: "html-07",
          type: "html",
          title: "Liste de courses",
          lesson:
            "Une liste à puces se construit avec <code>&lt;ul&gt;</code> (la liste) contenant des <code>&lt;li&gt;</code> (chaque élément, comme <em>list item</em>).",
          instructions:
            "Crée une liste à puces <code>&lt;ul&gt;</code> contenant exactement <strong>3</strong> éléments <code>&lt;li&gt;</code>.",
          starter: "<!-- Ajoute ta liste ici -->\n",
          hint: "&lt;ul&gt;&lt;li&gt;Pommes&lt;/li&gt;&lt;li&gt;Pain&lt;/li&gt;&lt;li&gt;Lait&lt;/li&gt;&lt;/ul&gt;",
          xp: 15,
          test(doc) {
            const items = doc.querySelectorAll("ul li");
            if (items.length === 0) return { pass: false, message: "Aucun <ul><li> trouvé." };
            if (items.length !== 3) {
              return { pass: false, message: `Il faut exactement 3 <li> (trouvé : ${items.length}).` };
            }
            return { pass: true, message: "Parfait, ta liste contient bien 3 éléments !" };
          },
        },
        {
          id: "html-08",
          type: "html",
          title: "Étapes numérotées",
          lesson:
            "Quand l'ordre compte (une recette, un classement...), on utilise une liste numérotée <code>&lt;ol&gt;</code> (comme <em>ordered list</em>) au lieu de <code>&lt;ul&gt;</code>. Les éléments restent des <code>&lt;li&gt;</code>.",
          instructions:
            "Crée une liste numérotée <code>&lt;ol&gt;</code> contenant exactement <strong>3</strong> éléments <code>&lt;li&gt;</code>.",
          starter: "<!-- Ajoute ta liste ici -->\n",
          hint: "&lt;ol&gt;&lt;li&gt;Se lever&lt;/li&gt;&lt;li&gt;Manger&lt;/li&gt;&lt;li&gt;Coder&lt;/li&gt;&lt;/ol&gt;",
          xp: 15,
          test(doc) {
            const items = doc.querySelectorAll("ol li");
            if (items.length === 0) return { pass: false, message: "Aucun <ol><li> trouvé." };
            if (items.length !== 3) {
              return { pass: false, message: `Il faut exactement 3 <li> (trouvé : ${items.length}).` };
            }
            return { pass: true, message: "Tes étapes sont bien numérotées !" };
          },
        },
        {
          id: "html-09",
          type: "html",
          title: "Un tableau simple",
          lesson:
            "Un tableau se construit avec <code>&lt;table&gt;</code>, des lignes <code>&lt;tr&gt;</code> (<em>table row</em>) et des cellules <code>&lt;td&gt;</code> (<em>table data</em>) à l'intérieur de chaque ligne.",
          instructions:
            "Crée un <code>&lt;table&gt;</code> avec au moins 2 lignes <code>&lt;tr&gt;</code>, chacune contenant au moins 2 cellules <code>&lt;td&gt;</code>.",
          starter: "<!-- Ajoute ton tableau ici -->\n",
          hint:
            "&lt;table&gt;&lt;tr&gt;&lt;td&gt;Nom&lt;/td&gt;&lt;td&gt;Âge&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td&gt;Léo&lt;/td&gt;&lt;td&gt;12&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;",
          xp: 20,
          test(doc) {
            const rows = doc.querySelectorAll("table tr");
            const cells = doc.querySelectorAll("table td");
            if (rows.length < 2) return { pass: false, message: "Il faut au moins 2 lignes <tr> dans le tableau." };
            if (cells.length < 4) return { pass: false, message: "Il faut au moins 2 cellules <td> par ligne." };
            return { pass: true, message: "Ton tableau est bien structuré !" };
          },
        },
        {
          id: "html-10",
          type: "html",
          title: "Formulaire de contact",
          lesson:
            "Un formulaire recueille des informations grâce à des champs <code>&lt;input&gt;</code>. L'attribut <code>type</code> change son comportement : <code>type=\"email\"</code> attend une adresse mail. Un <code>&lt;button&gt;</code> permet de le valider.",
          instructions:
            'Crée un champ <code>&lt;input type="email"&gt;</code> et un <code>&lt;button&gt;</code> pour valider un formulaire.',
          starter: "<!-- Ajoute ton formulaire ici -->\n",
          hint: '&lt;input type="email"&gt;\n&lt;button&gt;Envoyer&lt;/button&gt;',
          xp: 20,
          test(doc) {
            const input = doc.querySelector('input[type="email"]');
            const button = doc.querySelector("button");
            if (!input) return { pass: false, message: 'Aucun <input type="email"> trouvé.' };
            if (!button) return { pass: false, message: "Aucun <button> trouvé." };
            return { pass: true, message: "Ton formulaire est prêt à recevoir des messages !" };
          },
        },
        {
          id: "html-11",
          type: "html",
          title: "Une zone de texte",
          lesson:
            "Pour un texte sur plusieurs lignes (un message, un commentaire...), on utilise <code>&lt;textarea&gt;&lt;/textarea&gt;</code> plutôt qu'un <code>&lt;input&gt;</code>.",
          instructions:
            "Crée une <code>&lt;textarea&gt;&lt;/textarea&gt;</code> et un <code>&lt;button&gt;</code> pour envoyer un message.",
          starter: "<!-- Ajoute ta zone de texte ici -->\n",
          hint: "&lt;textarea&gt;&lt;/textarea&gt;\n&lt;button&gt;Envoyer&lt;/button&gt;",
          xp: 20,
          test(doc) {
            const textarea = doc.querySelector("textarea");
            const button = doc.querySelector("button");
            if (!textarea) return { pass: false, message: "Aucune <textarea> trouvée." };
            if (!button) return { pass: false, message: "Aucun <button> trouvé." };
            return { pass: true, message: "Ta zone de message est prête !" };
          },
        },
        {
          id: "html-12",
          type: "html",
          title: "Conteneurs et classes",
          lesson:
            "<code>&lt;div&gt;</code> et <code>&lt;span&gt;</code> sont des conteneurs génériques, sans signification particulière : ils servent surtout à regrouper du contenu pour le styliser en CSS, grâce à l'attribut <code>class</code>. <code>&lt;div&gt;</code> est un bloc, <code>&lt;span&gt;</code> reste sur la même ligne.",
          instructions:
            'Crée un <code>&lt;div class="carte"&gt;</code> qui contient un <code>&lt;span&gt;</code> avec du texte à l\'intérieur.',
          starter: "<!-- Ajoute ton conteneur ici -->\n",
          hint: '&lt;div class="carte"&gt;\n  &lt;span&gt;Contenu de la carte&lt;/span&gt;\n&lt;/div&gt;',
          xp: 20,
          test(doc) {
            const div = doc.querySelector("div.carte");
            if (!div) return { pass: false, message: 'Aucun <div class="carte"> trouvé.' };
            const span = div.querySelector("span");
            if (!span || !span.textContent.trim()) {
              return { pass: false, message: "Le <div> doit contenir un <span> avec du texte." };
            }
            return { pass: true, message: "Ta carte est prête à être stylisée en CSS !" };
          },
        },
      ],
    },
    {
      id: "css",
      title: "CSS",
      icon: "🎨",
      pitch: "Mets en forme et en couleur tes pages.",
      challenges: [
        {
          id: "css-01",
          type: "css",
          title: "Couleur de texte",
          lesson:
            "Une règle CSS cible un élément (ici <code>#target</code>, qui vise l'élément portant <code>id=\"target\"</code>) et lui applique des propriétés entre accolades. La propriété <code>color</code> change la couleur du texte.",
          instructions:
            "La page contient un élément <code>#target</code>. Donne-lui une couleur de texte <strong>rouge</strong>.",
          baseHtml: '<div id="target">Coucou !</div>',
          starter: "#target {\n  /* ta règle ici */\n}\n",
          hint: "color: red;",
          xp: 10,
          test(win, doc) {
            const el = doc.getElementById("target");
            const color = win.getComputedStyle(el).color;
            if (color === "rgb(255, 0, 0)") return { pass: true, message: "Rouge vif, exactement ce qu'il fallait !" };
            return { pass: false, message: `La couleur actuelle est ${color}, essaie color: red;` };
          },
        },
        {
          id: "css-02",
          type: "css",
          title: "Fond coloré",
          lesson:
            "La propriété <code>background-color</code> change la couleur de fond d'un élément, indépendamment de la couleur de son texte.",
          instructions: "Donne à <code>#target</code> un fond de couleur <strong>jaune</strong>.",
          baseHtml: '<div id="target">Boîte à colorier</div>',
          starter: "#target {\n  /* ta règle ici */\n}\n",
          hint: "background-color: yellow;",
          xp: 10,
          test(win, doc) {
            const el = doc.getElementById("target");
            const bg = win.getComputedStyle(el).backgroundColor;
            if (bg === "rgb(255, 255, 0)") return { pass: true, message: "Un joli fond jaune, bravo !" };
            return { pass: false, message: `Le fond actuel est ${bg}, essaie background-color: yellow;` };
          },
        },
        {
          id: "css-03",
          type: "css",
          title: "Taille du texte",
          lesson:
            "La propriété <code>font-size</code> définit la taille du texte, le plus souvent en pixels (<code>px</code>). Plus la valeur est grande, plus le texte est gros.",
          instructions: "Donne à <code>#target</code> une taille de texte d'au moins 24px.",
          baseHtml: '<p id="target">Grand texte</p>',
          starter: "#target {\n  /* ta règle ici */\n}\n",
          hint: "font-size: 28px;",
          xp: 10,
          test(win, doc) {
            const el = doc.getElementById("target");
            const size = parseFloat(win.getComputedStyle(el).fontSize) || 0;
            if (size >= 24) return { pass: true, message: "Un texte bien visible, parfait !" };
            return { pass: false, message: `Taille actuelle : ${size}px, il en faut au moins 24px.` };
          },
        },
        {
          id: "css-04",
          type: "css",
          title: "Texte en gras",
          lesson:
            "La propriété <code>font-weight</code> contrôle l'épaisseur du texte. La valeur <code>bold</code> (ou <code>700</code>) le met en gras.",
          instructions: "Mets le texte de <code>#target</code> en gras.",
          baseHtml: '<p id="target">Texte important</p>',
          starter: "#target {\n  /* ta règle ici */\n}\n",
          hint: "font-weight: bold;",
          xp: 10,
          test(win, doc) {
            const el = doc.getElementById("target");
            const weight = win.getComputedStyle(el).fontWeight;
            if (weight === "700" || weight === "bold") return { pass: true, message: "Bien en gras, parfait !" };
            return { pass: false, message: `font-weight actuel : ${weight}, essaie font-weight: bold;` };
          },
        },
        {
          id: "css-05",
          type: "css",
          title: "Texte centré",
          lesson:
            "La propriété <code>text-align</code> aligne le texte à l'intérieur de son élément : <code>left</code>, <code>right</code> ou <code>center</code>.",
          instructions: "Centre horizontalement le texte de <code>#target</code>.",
          baseHtml: '<div id="target" style="width:300px;border:1px solid #888;">Texte à centrer</div>',
          starter: "#target {\n  /* ta règle ici */\n}\n",
          hint: "text-align: center;",
          xp: 10,
          test(win, doc) {
            const el = doc.getElementById("target");
            const align = win.getComputedStyle(el).textAlign;
            if (align === "center") return { pass: true, message: "Ton texte est bien centré !" };
            return { pass: false, message: `text-align actuel: "${align}", essaie text-align: center;` };
          },
        },
        {
          id: "css-06",
          type: "css",
          title: "Marge extérieure",
          lesson:
            "La propriété <code>margin</code> crée de l'espace <strong>autour</strong> d'un élément, en dehors de son cadre, pour l'éloigner des éléments voisins.",
          instructions: "Donne à <code>#target</code> une marge en haut (margin-top) d'au moins 20px.",
          baseHtml: '<div>Élément précédent</div><div id="target">Élément à espacer</div>',
          starter: "#target {\n  /* ta règle ici */\n}\n",
          hint: "margin-top: 24px;",
          xp: 15,
          test(win, doc) {
            const el = doc.getElementById("target");
            const margin = parseFloat(win.getComputedStyle(el).marginTop) || 0;
            if (margin >= 20) return { pass: true, message: "Un bel espace créé, bravo !" };
            return { pass: false, message: `margin-top actuel : ${margin}px, il en faut au moins 20px.` };
          },
        },
        {
          id: "css-07",
          type: "css",
          title: "Espace intérieur",
          lesson:
            "La propriété <code>padding</code> crée de l'espace <strong>à l'intérieur</strong> d'un élément, entre son contenu et son bord (contrairement à <code>margin</code>, qui agit à l'extérieur).",
          instructions: "Donne à <code>#target</code> un padding d'au moins 20px.",
          baseHtml: '<div id="target" style="background:#5b8def;color:white;">Contenu</div>',
          starter: "#target {\n  /* ta règle ici */\n}\n",
          hint: "padding: 24px;",
          xp: 15,
          test(win, doc) {
            const el = doc.getElementById("target");
            const padding = parseFloat(win.getComputedStyle(el).paddingLeft) || 0;
            if (padding >= 20) return { pass: true, message: "Ton contenu respire enfin !" };
            return { pass: false, message: `padding actuel : ${padding}px, il en faut au moins 20px.` };
          },
        },
        {
          id: "css-08",
          type: "css",
          title: "Une bordure",
          lesson:
            "La propriété raccourcie <code>border</code> combine largeur, style et couleur en une seule ligne : <code>border: 2px solid black;</code>.",
          instructions: "Donne à <code>#target</code> une bordure pleine (solid) d'au moins 2px.",
          baseHtml: '<div id="target" style="width:120px;height:60px;"></div>',
          starter: "#target {\n  /* ta règle ici */\n}\n",
          hint: "border: 3px solid #333;",
          xp: 15,
          test(win, doc) {
            const el = doc.getElementById("target");
            const style = win.getComputedStyle(el);
            const width = parseFloat(style.borderTopWidth) || 0;
            if (style.borderTopStyle !== "solid") {
              return { pass: false, message: "Le style de bordure doit être solid." };
            }
            if (width < 2) {
              return { pass: false, message: `Largeur de bordure actuelle : ${width}px, il en faut au moins 2px.` };
            }
            return { pass: true, message: "Une belle bordure bien nette !" };
          },
        },
        {
          id: "css-09",
          type: "css",
          title: "Coins arrondis",
          lesson:
            "La propriété <code>border-radius</code> arrondit les coins d'un élément. Plus la valeur est grande, plus l'arrondi est prononcé.",
          instructions: "Donne à <code>#target</code> des coins arrondis (border-radius d'au moins 10px).",
          baseHtml: '<div id="target" style="width:120px;height:60px;background:#5b8def;"></div>',
          starter: "#target {\n  /* ta règle ici */\n}\n",
          hint: "border-radius: 12px;",
          xp: 15,
          test(win, doc) {
            const el = doc.getElementById("target");
            const radius = parseFloat(win.getComputedStyle(el).borderTopLeftRadius) || 0;
            if (radius >= 10) return { pass: true, message: "De belles courbes bien arrondies !" };
            return { pass: false, message: `border-radius actuel : ${radius}px, il en faut au moins 10px.` };
          },
        },
        {
          id: "css-10",
          type: "css",
          title: "Largeur et hauteur",
          lesson:
            "Les propriétés <code>width</code> et <code>height</code> fixent la taille d'un élément. Elles sont surtout utiles sur des éléments de type bloc, comme <code>&lt;div&gt;</code>.",
          instructions: "Donne à <code>#target</code> une largeur de 200px et une hauteur de 100px.",
          baseHtml: '<div id="target" style="background:#5b8def;"></div>',
          starter: "#target {\n  /* ta règle ici */\n}\n",
          hint: "width: 200px;\nheight: 100px;",
          xp: 15,
          test(win, doc) {
            const el = doc.getElementById("target");
            const style = win.getComputedStyle(el);
            const width = parseFloat(style.width) || 0;
            const height = parseFloat(style.height) || 0;
            if (width !== 200) return { pass: false, message: `Largeur actuelle : ${width}px, il faut 200px.` };
            if (height !== 100) return { pass: false, message: `Hauteur actuelle : ${height}px, il faut 100px.` };
            return { pass: true, message: "Une boîte à la taille parfaite !" };
          },
        },
        {
          id: "css-11",
          type: "css",
          title: "Centrage flexbox",
          lesson:
            "Flexbox est un mode de mise en page puissant. <code>display: flex;</code> l'active sur un conteneur ; <code>justify-content: center;</code> centre horizontalement son contenu, et <code>align-items: center;</code> le centre verticalement.",
          instructions:
            "Utilise Flexbox pour centrer <code>#target</code> horizontalement et verticalement à l'intérieur de <code>#container</code>.",
          baseHtml:
            '<div id="container" style="height:150px;border:2px dashed #888;"><div id="target">Centré ?</div></div>',
          starter: "#container {\n  /* display flex + centrage ici */\n}\n",
          hint: "display: flex;\njustify-content: center;\nalign-items: center;",
          xp: 20,
          test(win, doc) {
            const el = doc.getElementById("container");
            const style = win.getComputedStyle(el);
            if (style.display !== "flex") return { pass: false, message: "#container doit avoir display: flex;" };
            if (style.justifyContent !== "center")
              return { pass: false, message: "justify-content doit valoir center." };
            if (style.alignItems !== "center") return { pass: false, message: "align-items doit valoir center." };
            return { pass: true, message: "Ta boîte est parfaitement centrée, bravo !" };
          },
        },
        {
          id: "css-12",
          type: "css",
          title: "Empiler en colonne",
          lesson:
            "Par défaut, Flexbox aligne les éléments en ligne (<code>row</code>). La propriété <code>flex-direction: column;</code> les empile verticalement à la place.",
          instructions: "Change la direction de <code>#container</code> pour empiler ses éléments en colonne.",
          baseHtml:
            '<div id="container" style="display:flex;height:150px;border:2px dashed #888;"><div>Un</div><div id="target">Deux</div></div>',
          starter: "#container {\n  /* ta règle ici */\n}\n",
          hint: "flex-direction: column;",
          xp: 20,
          test(win, doc) {
            const el = doc.getElementById("container");
            const direction = win.getComputedStyle(el).flexDirection;
            if (direction === "column") return { pass: true, message: "Tes éléments sont bien empilés !" };
            return { pass: false, message: `flex-direction actuel : "${direction}", essaie flex-direction: column;` };
          },
        },
      ],
    },
    {
      id: "js",
      title: "JavaScript",
      icon: "⚡",
      pitch: "Donne vie à tes pages avec la logique et l'interactivité.",
      challenges: [
        {
          id: "js-01",
          type: "js",
          title: "Addition",
          lesson:
            "Une fonction regroupe des instructions réutilisables. <code>function addition(a, b) { return a + b; }</code> définit une fonction qui reçoit deux <strong>paramètres</strong> et <code>return</code> renvoie le résultat.",
          instructions: "Écris une fonction <code>addition(a, b)</code> qui renvoie la somme de <code>a</code> et <code>b</code>.",
          functionName: "addition",
          starter: "function addition(a, b) {\n  // ton code ici\n}\n",
          hint: "return a + b;",
          xp: 10,
          tests: [
            { args: [2, 3], expected: 5 },
            { args: [10, -2], expected: 8 },
            { args: [0, 0], expected: 0 },
          ],
        },
        {
          id: "js-02",
          type: "js",
          title: "Nombre pair",
          lesson:
            "L'opérateur <code>%</code> (modulo) donne le reste d'une division. <code>n % 2</code> vaut 0 si <code>n</code> est pair. <code>===</code> compare deux valeurs et renvoie <code>true</code> ou <code>false</code>.",
          instructions:
            "Écris une fonction <code>estPair(n)</code> qui renvoie <code>true</code> si <code>n</code> est pair, sinon <code>false</code>.",
          functionName: "estPair",
          starter: "function estPair(n) {\n  // ton code ici\n}\n",
          hint: "return n % 2 === 0;",
          xp: 10,
          tests: [
            { args: [4], expected: true },
            { args: [7], expected: false },
            { args: [0], expected: true },
          ],
        },
        {
          id: "js-03",
          type: "js",
          title: "Le plus grand de deux nombres",
          lesson:
            "Une condition <code>if (...) { ... } else { ... }</code> exécute un bloc de code différent selon qu'une expression est vraie ou fausse.",
          instructions:
            "Écris une fonction <code>maxDeDeux(a, b)</code> qui renvoie le plus grand des deux nombres (ou l'un des deux s'ils sont égaux).",
          functionName: "maxDeDeux",
          starter: "function maxDeDeux(a, b) {\n  // ton code ici\n}\n",
          hint: "if (a >= b) { return a; } else { return b; }",
          xp: 10,
          tests: [
            { args: [2, 5], expected: 5 },
            { args: [7, 3], expected: 7 },
            { args: [4, 4], expected: 4 },
          ],
        },
        {
          id: "js-04",
          type: "js",
          title: "Inverser une chaîne",
          lesson:
            "Les chaînes de caractères ont des méthodes utiles : <code>.split('')</code> découpe le texte en tableau de lettres, <code>.reverse()</code> inverse un tableau, <code>.join('')</code> recolle le tableau en texte.",
          instructions: "Écris une fonction <code>inverser(texte)</code> qui renvoie la chaîne inversée.",
          functionName: "inverser",
          starter: "function inverser(texte) {\n  // ton code ici\n}\n",
          hint: "return texte.split('').reverse().join('');",
          xp: 15,
          tests: [
            { args: ["bonjour"], expected: "ruojnob" },
            { args: ["abc"], expected: "cba" },
          ],
        },
        {
          id: "js-05",
          type: "js",
          title: "Compter les voyelles",
          lesson:
            "Une boucle <code>for (let i = 0; i &lt; texte.length; i++) { ... }</code> répète des instructions pour chaque lettre d'un texte. <code>texte[i]</code> accède à la lettre à la position <code>i</code>.",
          instructions:
            'Écris une fonction <code>compterVoyelles(texte)</code> qui renvoie le nombre de voyelles (a, e, i, o, u, majuscules ou minuscules) dans <code>texte</code>.',
          functionName: "compterVoyelles",
          starter: "function compterVoyelles(texte) {\n  // ton code ici\n}\n",
          hint:
            "let compteur = 0;\nfor (let i = 0; i < texte.length; i++) {\n  if ('aeiouAEIOU'.includes(texte[i])) compteur++;\n}\nreturn compteur;",
          xp: 20,
          tests: [
            { args: ["bonjour"], expected: 3 },
            { args: ["xyz"], expected: 0 },
            { args: ["Ecole"], expected: 3 },
          ],
        },
        {
          id: "js-06",
          type: "js",
          title: "Mettre en majuscules",
          lesson:
            "JavaScript fournit des méthodes toutes faites pour les chaînes, comme <code>.toUpperCase()</code> (met en majuscules) et <code>.toLowerCase()</code> (met en minuscules).",
          instructions: "Écris une fonction <code>majuscule(texte)</code> qui renvoie <code>texte</code> tout en majuscules.",
          functionName: "majuscule",
          starter: "function majuscule(texte) {\n  // ton code ici\n}\n",
          hint: "return texte.toUpperCase();",
          xp: 10,
          tests: [
            { args: ["bonjour"], expected: "BONJOUR" },
            { args: ["Chat"], expected: "CHAT" },
          ],
        },
        {
          id: "js-07",
          type: "js",
          title: "Somme d'un tableau",
          lesson:
            "On peut aussi boucler sur un tableau avec <code>for (let i = 0; i &lt; tableau.length; i++) { tableau[i] }</code>, en accumulant un résultat dans une variable qu'on met à jour à chaque tour.",
          instructions:
            "Écris une fonction <code>somme(tableau)</code> qui renvoie la somme de tous les nombres du tableau.",
          functionName: "somme",
          starter: "function somme(tableau) {\n  // ton code ici\n}\n",
          hint: "let total = 0;\nfor (let i = 0; i < tableau.length; i++) {\n  total += tableau[i];\n}\nreturn total;",
          xp: 20,
          tests: [
            { args: [[1, 2, 3]], expected: 6 },
            { args: [[10, -5, 5]], expected: 10 },
            { args: [[]], expected: 0 },
          ],
        },
        {
          id: "js-08",
          type: "js",
          title: "Maximum d'un tableau",
          lesson:
            "<code>Math.max(...tableau)</code> renvoie la plus grande valeur d'un tableau. Les trois petits points (<code>...</code>) s'appellent l'opérateur de décomposition (<em>spread</em>) : ils \"éclatent\" le tableau en arguments séparés.",
          instructions: "Écris une fonction <code>maximum(tableau)</code> qui renvoie la plus grande valeur du tableau.",
          functionName: "maximum",
          starter: "function maximum(tableau) {\n  // ton code ici\n}\n",
          hint: "return Math.max(...tableau);",
          xp: 15,
          tests: [
            { args: [[3, 7, 2]], expected: 7 },
            { args: [[-1, -5, -2]], expected: -1 },
          ],
        },
        {
          id: "js-09",
          type: "js",
          title: "Palindrome",
          lesson:
            "Un palindrome se lit pareil dans les deux sens (comme \"radar\"). On peut réutiliser l'idée de la fonction <code>inverser</code> et comparer le résultat au texte de départ.",
          instructions:
            "Écris une fonction <code>estPalindrome(texte)</code> qui renvoie <code>true</code> si <code>texte</code> est un palindrome, sinon <code>false</code>.",
          functionName: "estPalindrome",
          starter: "function estPalindrome(texte) {\n  // ton code ici\n}\n",
          hint: "const inverse = texte.split('').reverse().join('');\nreturn texte === inverse;",
          xp: 20,
          tests: [
            { args: ["radar"], expected: true },
            { args: ["bonjour"], expected: false },
            { args: ["kayak"], expected: true },
          ],
        },
        {
          id: "js-10",
          type: "js",
          title: "FizzBuzz",
          lesson:
            "On peut enchaîner plusieurs conditions avec <code>if</code> / <code>else if</code> / <code>else</code>. FizzBuzz est un exercice classique qui combine modulo et conditions en cascade.",
          instructions:
            'Écris une fonction <code>fizzbuzz(n)</code> qui renvoie "Fizz" si <code>n</code> est multiple de 3, "Buzz" si multiple de 5, "FizzBuzz" si multiple des deux, sinon <code>n</code> transformé en texte.',
          functionName: "fizzbuzz",
          starter: "function fizzbuzz(n) {\n  // ton code ici\n}\n",
          hint:
            "if (n % 15 === 0) return 'FizzBuzz';\nif (n % 3 === 0) return 'Fizz';\nif (n % 5 === 0) return 'Buzz';\nreturn String(n);",
          xp: 25,
          tests: [
            { args: [3], expected: "Fizz" },
            { args: [5], expected: "Buzz" },
            { args: [15], expected: "FizzBuzz" },
            { args: [7], expected: "7" },
          ],
        },
        {
          id: "js-11",
          type: "js",
          title: "Compter les occurrences",
          lesson:
            "Une fonction peut prendre plusieurs paramètres, comme <code>compterLettre(texte, lettre)</code>. Combine une boucle et une condition pour compter combien de fois <code>lettre</code> apparaît dans <code>texte</code>.",
          instructions:
            "Écris une fonction <code>compterLettre(texte, lettre)</code> qui renvoie le nombre d'occurrences de <code>lettre</code> dans <code>texte</code>.",
          functionName: "compterLettre",
          starter: "function compterLettre(texte, lettre) {\n  // ton code ici\n}\n",
          hint:
            "let compteur = 0;\nfor (let i = 0; i < texte.length; i++) {\n  if (texte[i] === lettre) compteur++;\n}\nreturn compteur;",
          xp: 20,
          tests: [
            { args: ["ananas", "a"], expected: 3 },
            { args: ["bonjour", "o"], expected: 2 },
            { args: ["test", "z"], expected: 0 },
          ],
        },
        {
          id: "js-12",
          type: "js",
          title: "Trier un tableau",
          lesson:
            "<code>tableau.sort()</code> trie un tableau, mais par défaut il compare les valeurs comme du texte (10 passerait avant 2 !). Pour trier des nombres correctement, il faut lui donner une fonction de comparaison : <code>tableau.sort((a, b) =&gt; a - b)</code>.",
          instructions:
            "Écris une fonction <code>trierCroissant(tableau)</code> qui renvoie le tableau trié du plus petit au plus grand nombre.",
          functionName: "trierCroissant",
          starter: "function trierCroissant(tableau) {\n  // ton code ici\n}\n",
          hint: "return tableau.sort((a, b) => a - b);",
          xp: 25,
          tests: [
            { args: [[3, 1, 2]], expected: [1, 2, 3] },
            { args: [[10, 2, 33]], expected: [2, 10, 33] },
            { args: [[-1, -5, 0]], expected: [-5, -1, 0] },
          ],
        },
      ],
    },
    {
      id: "php",
      title: "PHP",
      icon: "🐘",
      pitch:
        "Découvre le langage serveur le plus utilisé du Web (en questions, car GitHub Pages ne peut pas exécuter de PHP).",
      challenges: [
        {
          id: "php-01",
          type: "quiz",
          title: "Variables et echo",
          lesson:
            "En PHP, une variable commence toujours par <code>$</code>. <code>echo</code> affiche du texte ou une valeur à l'écran. Un script PHP commence par <code>&lt;?php</code> et se termine par <code>?&gt;</code>.",
          code: '<?php\n$nom = "Alice";\necho "Bonjour " . $nom;\n?>',
          question: "Que s'affiche à l'écran ?",
          options: ["Bonjour Alice", "Bonjour $nom", "Alice Bonjour", "Erreur de syntaxe"],
          correct: 0,
          hint: "Le point (.) sert à concaténer une chaîne et une variable.",
          xp: 10,
        },
        {
          id: "php-02",
          type: "quiz",
          title: "Concaténation",
          lesson:
            "Contrairement à JavaScript qui utilise <code>+</code>, PHP utilise le point <code>.</code> pour coller (concaténer) plusieurs morceaux de texte ensemble.",
          code: '<?php\n$prenom = "Léo";\n$phrase = "Salut " . $prenom . " !";\necho $phrase;\n?>',
          question: "Que s'affiche à l'écran ?",
          options: ["Salut Léo !", "Salut $prenom !", "Salut . Léo . !", "Erreur"],
          correct: 0,
          hint: "Chaque . colle simplement le morceau de texte suivant à la suite.",
          xp: 10,
        },
        {
          id: "php-03",
          type: "quiz",
          title: "Types de données",
          lesson:
            "Chaque valeur PHP a un type : <code>int</code> (nombre entier), <code>string</code> (texte), <code>bool</code> (vrai/faux)... La fonction <code>var_dump()</code> affiche à la fois le type et la valeur, utile pour déboguer.",
          code: '<?php\n$age = 25;\nvar_dump($age);\n?>',
          question: "Que s'affiche à l'écran ?",
          options: ['int(25)', 'string(25) "25"', "bool(true)", "Erreur"],
          correct: 0,
          hint: "25 est écrit sans guillemets : c'est un entier (int), pas du texte.",
          xp: 15,
        },
        {
          id: "php-04",
          type: "quiz",
          title: "Opérateurs arithmétiques",
          lesson:
            "PHP propose les opérateurs classiques <code>+ - * /</code>, ainsi que <code>%</code> (modulo), qui donne le <strong>reste</strong> d'une division entière.",
          code: '<?php\n$a = 10;\n$b = 3;\necho $a % $b;\n?>',
          question: "Que s'affiche à l'écran ?",
          options: ["1", "3", "3.33", "0"],
          correct: 0,
          hint: "10 divisé par 3 fait 3, reste 1 : c'est ce reste que % renvoie.",
          xp: 15,
        },
        {
          id: "php-05",
          type: "quiz",
          title: "Comparaison stricte",
          lesson:
            "L'opérateur <code>==</code> compare uniquement la valeur, alors que <code>===</code> compare aussi le <strong>type</strong>. Une chaîne <code>\"5\"</code> n'est donc pas strictement égale à l'entier <code>5</code>.",
          code: '<?php\n$a = "5";\n$b = 5;\nif ($a === $b) {\n    echo "Egal strict";\n} else {\n    echo "Different";\n}\n?>',
          question: "Que s'affiche à l'écran ?",
          options: ["Different", "Egal strict", "Erreur", "5"],
          correct: 0,
          hint: "=== compare aussi le type : une chaîne \"5\" n'est pas un entier 5.",
          xp: 20,
        },
        {
          id: "php-06",
          type: "quiz",
          title: "Condition if/else",
          lesson:
            "La structure <code>if (condition) { ... } else { ... }</code> exécute un bloc ou l'autre selon qu'une condition est vraie ou fausse, tout comme en JavaScript.",
          code: '<?php\n$note = 12;\nif ($note >= 10) {\n    echo "Admis";\n} else {\n    echo "Recalé";\n}\n?>',
          question: "Que s'affiche à l'écran ?",
          options: ["Admis", "Recalé", "10", "Erreur"],
          correct: 0,
          hint: "12 est bien supérieur ou égal à 10.",
          xp: 15,
        },
        {
          id: "php-07",
          type: "quiz",
          title: "Boucle for",
          lesson:
            "La boucle <code>for ($i = début; condition; $i++)</code> répète un bloc d'instructions tant que la condition est vraie, en incrémentant <code>$i</code> à chaque tour.",
          code: '<?php\nfor ($i = 1; $i <= 3; $i++) {\n    echo $i . " ";\n}\n?>',
          question: "Que s'affiche à l'écran ?",
          options: ["1 2 3 ", "0 1 2 ", "1 2 3 4 ", "Erreur de syntaxe"],
          correct: 0,
          hint: "La boucle démarre à 1 et s'arrête quand $i dépasse 3.",
          xp: 15,
        },
        {
          id: "php-08",
          type: "quiz",
          title: "Boucle while",
          lesson:
            "La boucle <code>while (condition) { ... }</code> répète un bloc tant qu'une condition reste vraie. Il faut penser à modifier une variable à l'intérieur, sinon la boucle ne s'arrête jamais !",
          code: '<?php\n$i = 0;\nwhile ($i < 3) {\n    echo "x";\n    $i++;\n}\n?>',
          question: "Que s'affiche à l'écran ?",
          options: ["xxx", "xx", "xxxx", "Boucle infinie"],
          correct: 0,
          hint: "$i vaut 0, 1 puis 2 : la boucle s'exécute 3 fois avant que $i atteigne 3.",
          xp: 15,
        },
        {
          id: "php-09",
          type: "quiz",
          title: "Tableau indexé",
          lesson:
            "Un tableau indexé se crée avec des crochets <code>[valeur1, valeur2, ...]</code>. La fonction <code>count()</code> renvoie le nombre d'éléments qu'il contient.",
          code: '<?php\n$fruits = ["pomme", "poire", "banane"];\necho count($fruits);\n?>',
          question: "Quelle fonction utilise-t-on ici, et qu'affiche ce code ?",
          options: [
            "count($fruits) affiche 3",
            "length($fruits) affiche 3",
            "size($fruits) affiche 3",
            "count($fruits) affiche 2",
          ],
          correct: 0,
          hint: "En PHP, count() renvoie le nombre d'éléments d'un tableau.",
          xp: 15,
        },
        {
          id: "php-10",
          type: "quiz",
          title: "Tableau associatif",
          lesson:
            "Un tableau associatif associe une <strong>clé</strong> à chaque valeur, avec la syntaxe <code>\"clé\" =&gt; valeur</code>. On accède ensuite à une valeur avec <code>$tableau[\"clé\"]</code>.",
          code: '<?php\n$personne = ["nom" => "Lina", "age" => 30];\necho $personne["nom"];\n?>',
          question: "Que s'affiche à l'écran ?",
          options: ["Lina", "nom", "30", "Erreur"],
          correct: 0,
          hint: '$personne["nom"] va chercher la valeur associée à la clé "nom".',
          xp: 20,
        },
        {
          id: "php-11",
          type: "quiz",
          title: "Boucle foreach",
          lesson:
            "<code>foreach ($tableau as $element) { ... }</code> parcourt automatiquement chaque élément d'un tableau, sans avoir besoin de compteur.",
          code: '<?php\n$fruits = ["pomme", "poire"];\nforeach ($fruits as $fruit) {\n    echo $fruit . "-";\n}\n?>',
          question: "Que s'affiche à l'écran ?",
          options: ["pomme-poire-", "pomme-poire", "poire-pomme-", "Erreur"],
          correct: 0,
          hint: "Chaque élément du tableau est affiché suivi d'un tiret.",
          xp: 20,
        },
        {
          id: "php-12",
          type: "quiz",
          title: "Fonctions",
          lesson:
            "Comme en JavaScript, une fonction PHP se déclare avec <code>function nom($parametre) { ... return ...; }</code> et peut être appelée ailleurs dans le script avec <code>nom(valeur)</code>.",
          code: '<?php\nfunction carre($n) {\n    return $n * $n;\n}\necho carre(4);\n?>',
          question: "Que s'affiche à l'écran ?",
          options: ["16", "8", "4", "Erreur"],
          correct: 0,
          hint: "carre(4) renvoie 4 * 4.",
          xp: 20,
        },
      ],
    },
  ],
};
