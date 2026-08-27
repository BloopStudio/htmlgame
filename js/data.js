/**
 * CodeQuest - Données des parcours et des défis.
 * 4 parcours : HTML, CSS, JS, PHP.
 * Chaque défi a un type qui détermine comment il est validé (voir js/app.js) :
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
      pitch: "Structure une page web avec les bonnes balises.",
      challenges: [
        {
          id: "html-1",
          type: "html",
          title: "Ton premier titre",
          instructions:
            "Crée un titre principal <code>&lt;h1&gt;</code> contenant exactement le texte : <strong>Bonjour le Web</strong>",
          starter: "<!-- Écris ton code HTML ici -->\n",
          hint: "La balise pour un titre de niveau 1 s'écrit &lt;h1&gt;...&lt;/h1&gt;.",
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
          id: "html-2",
          type: "html",
          title: "Liste de courses",
          instructions:
            "Crée une liste à puces <code>&lt;ul&gt;</code> contenant exactement <strong>3</strong> éléments <code>&lt;li&gt;</code>.",
          starter: "<!-- Ajoute ta liste ici -->\n",
          hint: "&lt;ul&gt;&lt;li&gt;Pommes&lt;/li&gt;&lt;li&gt;Pain&lt;/li&gt;&lt;li&gt;Lait&lt;/li&gt;&lt;/ul&gt;",
          xp: 10,
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
          id: "html-3",
          type: "html",
          title: "Un lien vers l'extérieur",
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
          id: "html-4",
          type: "html",
          title: "Ajoute une image",
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
          id: "html-5",
          type: "html",
          title: "Formulaire de contact",
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
      ],
    },
    {
      id: "css",
      title: "CSS",
      icon: "🎨",
      pitch: "Mets en forme et en couleur tes pages.",
      challenges: [
        {
          id: "css-1",
          type: "css",
          title: "Couleur de texte",
          instructions:
            "La page contient un élément <code>#target</code>. Donne-lui une couleur de texte <strong>rouge</strong>.",
          baseHtml: '<div id="target">Coucou !</div>',
          starter: "#target {\n  /* ta règle ici */\n}\n",
          hint: "color: red; (ou color: #ff0000;)",
          xp: 10,
          test(win, doc) {
            const el = doc.getElementById("target");
            const color = win.getComputedStyle(el).color;
            if (color === "rgb(255, 0, 0)") return { pass: true, message: "Rouge vif, exactement ce qu'il fallait !" };
            return { pass: false, message: `La couleur actuelle est ${color}, essaie color: red;` };
          },
        },
        {
          id: "css-2",
          type: "css",
          title: "Fond coloré",
          instructions:
            "Donne à <code>#target</code> un fond de couleur <strong>jaune</strong>.",
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
          id: "css-3",
          type: "css",
          title: "Texte centré",
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
          id: "css-4",
          type: "css",
          title: "Coins arrondis",
          instructions:
            "Donne à <code>#target</code> des coins arrondis (border-radius d'au moins 10px).",
          baseHtml:
            '<div id="target" style="width:120px;height:60px;background:#5b8def;"></div>',
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
          id: "css-5",
          type: "css",
          title: "Centrage flexbox",
          instructions:
            "Utilise Flexbox pour centrer <code>#target</code> horizontalement et verticalement à l'intérieur de <code>#container</code>.",
          baseHtml:
            '<div id="container" style="height:150px;border:2px dashed #888;"><div id="target">Centré ?</div></div>',
          starter: "#container {\n  /* display flex + centrage ici */\n}\n",
          hint: "display: flex; justify-content: center; align-items: center;",
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
      ],
    },
    {
      id: "js",
      title: "JavaScript",
      icon: "⚡",
      pitch: "Donne vie à tes pages avec la logique et l'interactivité.",
      challenges: [
        {
          id: "js-1",
          type: "js",
          title: "Addition",
          instructions:
            "Écris une fonction <code>addition(a, b)</code> qui renvoie la somme de <code>a</code> et <code>b</code>.",
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
          id: "js-2",
          type: "js",
          title: "Nombre pair",
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
          id: "js-3",
          type: "js",
          title: "Inverser une chaîne",
          instructions:
            "Écris une fonction <code>inverser(texte)</code> qui renvoie la chaîne inversée.",
          functionName: "inverser",
          starter: "function inverser(texte) {\n  // ton code ici\n}\n",
          hint: "texte.split('').reverse().join('')",
          xp: 15,
          tests: [
            { args: ["bonjour"], expected: "ruojnob" },
            { args: ["abc"], expected: "cba" },
          ],
        },
        {
          id: "js-4",
          type: "js",
          title: "Maximum d'un tableau",
          instructions:
            "Écris une fonction <code>maximum(tableau)</code> qui renvoie la plus grande valeur du tableau.",
          functionName: "maximum",
          starter: "function maximum(tableau) {\n  // ton code ici\n}\n",
          hint: "Math.max(...tableau)",
          xp: 15,
          tests: [
            { args: [[3, 7, 2]], expected: 7 },
            { args: [[-1, -5, -2]], expected: -1 },
          ],
        },
        {
          id: "js-5",
          type: "js",
          title: "FizzBuzz",
          instructions:
            'Écris une fonction <code>fizzbuzz(n)</code> qui renvoie "Fizz" si <code>n</code> est multiple de 3, "Buzz" si multiple de 5, "FizzBuzz" si multiple des deux, sinon <code>n</code> transformé en texte.',
          functionName: "fizzbuzz",
          starter: "function fizzbuzz(n) {\n  // ton code ici\n}\n",
          hint: "if (n % 15 === 0) return 'FizzBuzz'; ...",
          xp: 25,
          tests: [
            { args: [3], expected: "Fizz" },
            { args: [5], expected: "Buzz" },
            { args: [15], expected: "FizzBuzz" },
            { args: [7], expected: "7" },
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
          id: "php-1",
          type: "quiz",
          title: "Variables et echo",
          code: '<?php\n$nom = "Alice";\necho "Bonjour " . $nom;\n?>',
          question: "Que s'affiche à l'écran ?",
          options: ["Bonjour Alice", "Bonjour $nom", "Alice Bonjour", "Erreur de syntaxe"],
          correct: 0,
          hint: "Le point (.) sert à concaténer une chaîne et une variable.",
          xp: 10,
        },
        {
          id: "php-2",
          type: "quiz",
          title: "Boucle for",
          code: '<?php\nfor ($i = 1; $i <= 3; $i++) {\n    echo $i . " ";\n}\n?>',
          question: "Que s'affiche à l'écran ?",
          options: ["1 2 3 ", "0 1 2 ", "1 2 3 4 ", "Erreur de syntaxe"],
          correct: 0,
          hint: "La boucle démarre à 1 et s'arrête quand $i dépasse 3.",
          xp: 15,
        },
        {
          id: "php-3",
          type: "quiz",
          title: "Compter un tableau",
          code: '<?php\n$fruits = ["pomme", "poire", "banane"];\necho count($fruits);\n?>',
          question: "Quelle fonction utilise-t-on ici, et qu'affiche ce code ?",
          options: ["count($fruits) affiche 3", "length($fruits) affiche 3", "size($fruits) affiche 3", "count($fruits) affiche 2"],
          correct: 0,
          hint: "En PHP, count() renvoie le nombre d'éléments d'un tableau.",
          xp: 15,
        },
        {
          id: "php-4",
          type: "quiz",
          title: "Comparaison stricte",
          code: '<?php\n$a = "5";\n$b = 5;\nif ($a === $b) {\n    echo "Egal strict";\n} else {\n    echo "Different";\n}\n?>',
          question: "Que s'affiche à l'écran ?",
          options: ["Different", "Egal strict", "Erreur", "5"],
          correct: 0,
          hint: "=== compare aussi le type : une chaîne \"5\" n'est pas un entier 5.",
          xp: 20,
        },
        {
          id: "php-5",
          type: "quiz",
          title: "Concaténation",
          code: '<?php\n$prenom = "Léo";\n$phrase = "Salut " . $prenom . " !";\necho $phrase;\n?>',
          question: "Quel symbole permet de concaténer deux chaînes en PHP ?",
          options: [".", "+", "&", ","],
          correct: 0,
          hint: "Contrairement à JavaScript, PHP utilise le point pour concaténer.",
          xp: 15,
        },
      ],
    },
  ],
};
