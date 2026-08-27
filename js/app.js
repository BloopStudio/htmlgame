/**
 * CodeQuest - moteur du jeu.
 * Gère la carte des royaumes, la navigation vers les défis, l'éditeur, la
 * validation (via iframes sandboxées), les badges, la mascotte et les
 * effets (sons, confettis), ainsi que la sauvegarde de la progression.
 */
(function () {
  "use strict";

  const STORAGE_KEY = "codequest_progress_v2";
  const TOKEN_KEY = "codequest_token_v1";

  const state = {
    mapSubview: "overview", // "overview" | "path"
    activeTrackId: null,
    trackIndex: 0,
    challengeIndex: 0,
    progress: loadProgress(),
  };

  function defaultProgress() {
    return { completed: {}, xp: 0, streak: 0, bestStreak: 0, wrongAttempts: {}, badgesAwarded: [] };
  }

  function loadProgress() {
    const defaults = defaultProgress();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        return Object.assign({}, defaults, saved, {
          completed: Object.assign({}, defaults.completed, saved.completed),
          wrongAttempts: Object.assign({}, defaults.wrongAttempts, saved.wrongAttempts),
          badgesAwarded: saved.badgesAwarded || [],
        });
      }
    } catch (e) {
      /* localStorage indisponible ou corrompu : on repart de zéro */
    }
    return defaults;
  }

  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
    } catch (e) {
      /* stockage plein ou bloqué : la partie reste jouable, juste non sauvegardée */
    }
    syncToServer();
  }

  function getToken() {
    let token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      token = "p-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem(TOKEN_KEY, token);
    }
    return token;
  }

  // Le backend PHP est optionnel : il n'existe que si le site est servi par
  // un vrai serveur PHP (ex: `php -S localhost:8000`). Sur GitHub Pages cet appel
  // échoue silencieusement et le jeu continue avec localStorage uniquement.
  function syncToServer() {
    fetch("php/api/save_progress.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: getToken(), progress: state.progress }),
    }).catch(() => {});
  }

  function isChallengeDone(id) {
    return !!state.progress.completed[id];
  }

  function isTrackUnlocked(trackIdx) {
    if (trackIdx === 0) return true;
    const prev = CODEQUEST_DATA.tracks[trackIdx - 1];
    return prev.challenges.every((c) => isChallengeDone(c.id));
  }

  function trackCompletionCount(track) {
    return track.challenges.filter((c) => isChallengeDone(c.id)).length;
  }

  function firstUnfinishedIndex(track) {
    const idx = track.challenges.findIndex((c) => !isChallengeDone(c.id));
    return idx === -1 ? track.challenges.length - 1 : idx;
  }

  function currentTrack() {
    return CODEQUEST_DATA.tracks[state.trackIndex];
  }

  function currentChallenge() {
    return currentTrack().challenges[state.challengeIndex];
  }

  function totalXp() {
    let total = 0;
    CODEQUEST_DATA.tracks.forEach((t) => t.challenges.forEach((c) => (total += c.xp || 0)));
    return total;
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // --- Éléments du DOM ---

  const mapViewEl = document.getElementById("map-view");
  const challengeViewEl = document.getElementById("challenge-view");
  const challengeEl = document.getElementById("challenge");

  // --- En-tête (XP, série, badges, son) ---

  function renderHeader() {
    document.getElementById("xp-value").textContent = state.progress.xp;
    const pct = Math.min(100, Math.round((state.progress.xp / totalXp()) * 100));
    document.getElementById("xp-fill").style.width = pct + "%";
    document.getElementById("streak-value").textContent = state.progress.streak || 0;
    const earnedCount = CODEQUEST_BADGES.filter((b) => b.test(state.progress)).length;
    document.getElementById("badges-count").textContent = earnedCount;
    document.getElementById("badges-total").textContent = CODEQUEST_BADGES.length;
    document.getElementById("mute-btn").textContent = CodeQuestSound.isMuted() ? "🔇" : "🔊";
  }

  // --- Vue carte ---

  function showMapView() {
    challengeViewEl.classList.add("hidden");
    mapViewEl.classList.remove("hidden");
    renderHeader();
    renderMap();
  }

  function renderMap() {
    if (state.mapSubview === "path" && state.activeTrackId) {
      renderPathView(state.activeTrackId);
    } else {
      renderKingdomsOverview();
    }
  }

  function renderKingdomsOverview() {
    mapViewEl.innerHTML = "";

    const intro = document.createElement("div");
    intro.className = "map-intro";
    intro.innerHTML = "<h1>🗺️ La carte de CodeQuest</h1><p>Explore les royaumes dans l'ordre pour apprendre à coder, un défi à la fois.</p>";
    mapViewEl.appendChild(intro);

    const grid = document.createElement("div");
    grid.className = "kingdoms-grid";

    CODEQUEST_DATA.tracks.forEach((track, idx) => {
      const unlocked = isTrackUnlocked(idx);
      const done = trackCompletionCount(track);
      const total = track.challenges.length;

      const card = document.createElement("button");
      card.type = "button";
      card.className = "kingdom-card" + (unlocked ? "" : " locked") + (done === total ? " complete" : "");
      card.style.setProperty("--kingdom-color", track.theme);
      card.disabled = !unlocked;
      card.innerHTML = `
        <span class="kingdom-icon">${track.icon}</span>
        <h3>${track.worldName}</h3>
        <p class="kingdom-pitch">${track.title} — ${track.pitch}</p>
        <div class="kingdom-progress-track"><div class="kingdom-progress-fill" style="width:${Math.round((done / total) * 100)}%"></div></div>
        <span class="kingdom-count">${unlocked ? `${done}/${total}` : "🔒 Verrouillé"}</span>
      `;
      card.addEventListener("click", () => {
        if (!unlocked) return;
        CodeQuestSound.click();
        state.activeTrackId = track.id;
        state.mapSubview = "path";
        renderMap();
      });
      grid.appendChild(card);
    });

    mapViewEl.appendChild(grid);
  }

  function renderPathView(trackId) {
    const trackIdx = CODEQUEST_DATA.tracks.findIndex((t) => t.id === trackId);
    const track = CODEQUEST_DATA.tracks[trackIdx];
    mapViewEl.innerHTML = "";

    const header = document.createElement("div");
    header.className = "path-header";
    header.style.setProperty("--kingdom-color", track.theme);
    header.innerHTML = `
      <button type="button" class="btn btn-ghost" id="back-to-kingdoms">← Royaumes</button>
      <h2>${track.icon} ${track.worldName}</h2>
      <p class="path-pitch">${track.pitch}</p>
    `;
    mapViewEl.appendChild(header);
    header.querySelector("#back-to-kingdoms").addEventListener("click", () => {
      CodeQuestSound.click();
      state.mapSubview = "overview";
      renderMap();
    });

    const nextIdx = firstUnfinishedIndex(track);
    const path = document.createElement("div");
    path.className = "path";
    path.style.setProperty("--kingdom-color", track.theme);

    track.challenges.forEach((challenge, idx) => {
      const done = isChallengeDone(challenge.id);
      const isCurrent = !done && idx === nextIdx;
      const isLocked = !done && idx > nextIdx;
      const align = ["left", "center", "right"][idx % 3];

      const node = document.createElement("button");
      node.type = "button";
      node.className = "path-node align-" + align + (done ? " done" : "") + (isCurrent ? " current" : "") + (isLocked ? " locked" : "");
      node.disabled = isLocked;
      node.innerHTML = `
        <span class="node-circle">${done ? "✅" : isCurrent ? "🧙" : "🔒"}</span>
        <span class="node-title">${challenge.title}</span>
      `;
      node.addEventListener("click", () => {
        if (isLocked) return;
        CodeQuestSound.click();
        showChallengeView(trackIdx, idx);
      });
      path.appendChild(node);
    });

    mapViewEl.appendChild(path);
  }

  // --- Vue défi ---

  function showChallengeView(trackIdx, challengeIdx) {
    state.trackIndex = trackIdx;
    state.challengeIndex = challengeIdx;
    mapViewEl.classList.add("hidden");
    challengeViewEl.classList.remove("hidden");
    renderHeader();
    renderChallenge();
  }

  function renderChallenge() {
    const track = currentTrack();
    const challenge = currentChallenge();
    challengeEl.innerHTML = "";

    const header = document.createElement("div");
    header.className = "challenge-header";
    header.innerHTML = `<h2>${track.icon} ${challenge.title}</h2>`;
    challengeEl.appendChild(header);

    if (challenge.lesson) {
      const lessonBox = document.createElement("div");
      lessonBox.className = "lesson-box";
      lessonBox.innerHTML = `<p class="lesson-label">📘 Leçon</p><div class="lesson-body">${challenge.lesson}</div>`;
      challengeEl.appendChild(lessonBox);
    }

    const instructionsEl = document.createElement("p");
    instructionsEl.className = "instructions";
    instructionsEl.innerHTML = challenge.instructions || "";
    challengeEl.appendChild(instructionsEl);

    if (challenge.type === "quiz") {
      renderQuiz(challenge);
    } else {
      renderCodeChallenge(challenge);
    }

    const hintWrap = document.createElement("div");
    hintWrap.className = "hint-wrap";
    const hintBtn = document.createElement("button");
    hintBtn.type = "button";
    hintBtn.className = "btn btn-ghost";
    hintBtn.textContent = "💡 Indice";
    const hintText = document.createElement("p");
    hintText.className = "hint-text hidden";
    hintText.innerHTML = challenge.hint || "";
    hintBtn.addEventListener("click", () => hintText.classList.toggle("hidden"));
    hintWrap.appendChild(hintBtn);
    hintWrap.appendChild(hintText);
    challengeEl.appendChild(hintWrap);

    const resultEl = document.createElement("div");
    resultEl.id = "result";
    resultEl.className = "result";
    challengeEl.appendChild(resultEl);
  }

  function renderQuiz(challenge) {
    const pre = document.createElement("pre");
    pre.className = "code-block";
    pre.textContent = challenge.code;
    challengeEl.appendChild(pre);

    const q = document.createElement("p");
    q.className = "quiz-question";
    q.textContent = challenge.question;
    challengeEl.appendChild(q);

    const form = document.createElement("form");
    form.className = "quiz-options";
    challenge.options.forEach((opt, idx) => {
      const label = document.createElement("label");
      label.className = "quiz-option";
      label.innerHTML = `<input type="radio" name="quiz" value="${idx}"> <span>${opt}</span>`;
      form.appendChild(label);
    });
    challengeEl.appendChild(form);

    const validateBtn = document.createElement("button");
    validateBtn.type = "button";
    validateBtn.className = "btn btn-primary";
    validateBtn.textContent = "Valider";
    validateBtn.addEventListener("click", () => {
      const picked = form.querySelector('input[name="quiz"]:checked');
      if (!picked) {
        showResult(false, "Choisis une réponse avant de valider.");
        return;
      }
      const pass = parseInt(picked.value, 10) === challenge.correct;
      handleOutcome(pass, challenge, pass ? "Bonne réponse !" : "Ce n'est pas ça, réessaie.");
    });
    challengeEl.appendChild(validateBtn);
  }

  function renderCodeChallenge(challenge) {
    const layout = document.createElement("div");
    layout.className = "editor-layout";

    if ((challenge.type === "css" || challenge.type === "domjs") && challenge.baseHtml) {
      const baseInfo = document.createElement("div");
      baseInfo.className = "base-html-info";
      baseInfo.innerHTML = `<p class="label">HTML fourni (lecture seule) :</p><pre class="code-block">${escapeHtml(
        challenge.baseHtml
      )}</pre>`;
      layout.appendChild(baseInfo);
    }

    const editorWrap = document.createElement("div");
    editorWrap.className = "editor-wrap";
    const label = document.createElement("p");
    label.className = "label";
    label.textContent =
      challenge.type === "css" ? "Ton CSS :" : challenge.type === "js" || challenge.type === "domjs" ? "Ton JavaScript :" : "Ton HTML :";
    editorWrap.appendChild(label);

    const textarea = document.createElement("textarea");
    textarea.className = "editor";
    textarea.spellcheck = false;
    textarea.value = getSavedCode(challenge) || challenge.starter;
    textarea.addEventListener("input", () => {
      saveCode(challenge, textarea.value);
    });
    textarea.addEventListener("keydown", handleTabKey);
    editorWrap.appendChild(textarea);
    layout.appendChild(editorWrap);

    const previewWrap = document.createElement("div");
    previewWrap.className = "preview-wrap";
    const previewLabel = document.createElement("p");
    previewLabel.className = "label";
    previewLabel.textContent = challenge.type === "js" ? "Console de test :" : "Aperçu :";
    previewWrap.appendChild(previewLabel);

    if (challenge.type === "js") {
      const consoleEl = document.createElement("div");
      consoleEl.className = "console";
      consoleEl.id = "console";
      previewWrap.appendChild(consoleEl);
    } else {
      const iframe = document.createElement("iframe");
      iframe.className = "preview";
      iframe.id = "preview";
      iframe.setAttribute("sandbox", challenge.type === "domjs" ? "allow-scripts" : "allow-same-origin");
      iframe.title = "Aperçu du rendu";
      previewWrap.appendChild(iframe);
    }
    layout.appendChild(previewWrap);

    challengeEl.appendChild(layout);

    const actions = document.createElement("div");
    actions.className = "actions";

    const resetBtn = document.createElement("button");
    resetBtn.type = "button";
    resetBtn.className = "btn btn-ghost";
    resetBtn.textContent = "↺ Réinitialiser";
    resetBtn.addEventListener("click", () => {
      textarea.value = challenge.starter;
      saveCode(challenge, textarea.value);
      updatePreview(challenge, textarea.value);
    });
    actions.appendChild(resetBtn);

    const runBtn = document.createElement("button");
    runBtn.type = "button";
    runBtn.className = "btn btn-primary";
    runBtn.textContent = "▶ Vérifier";
    runBtn.addEventListener("click", () => runChallenge(challenge, textarea.value));
    actions.appendChild(runBtn);

    challengeEl.appendChild(actions);

    updatePreview(challenge, textarea.value);
  }

  function handleTabKey(e) {
    if (e.key !== "Tab") return;
    e.preventDefault();
    const el = e.target;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    el.value = el.value.slice(0, start) + "  " + el.value.slice(end);
    el.selectionStart = el.selectionEnd = start + 2;
  }

  function codeStorageKey(challenge) {
    return "codequest_code_" + challenge.id;
  }

  function getSavedCode(challenge) {
    try {
      return localStorage.getItem(codeStorageKey(challenge));
    } catch (e) {
      return null;
    }
  }

  function saveCode(challenge, value) {
    try {
      localStorage.setItem(codeStorageKey(challenge), value);
    } catch (e) {
      /* stockage indisponible : le code reste dans l'éditeur pour cette session */
    }
  }

  function updatePreview(challenge, code) {
    if (challenge.type === "html") {
      const iframe = document.getElementById("preview");
      if (iframe) iframe.srcdoc = code;
    } else if (challenge.type === "css") {
      const iframe = document.getElementById("preview");
      if (iframe) iframe.srcdoc = `<style>${code}</style>${challenge.baseHtml}`;
    } else if (challenge.type === "domjs") {
      const iframe = document.getElementById("preview");
      if (iframe) iframe.srcdoc = `${challenge.baseHtml}<script>${code}<\/script>`;
    }
  }

  function runChallenge(challenge, code) {
    if (challenge.type === "html") {
      const iframe = document.getElementById("preview");
      iframe.srcdoc = code;
      iframe.addEventListener(
        "load",
        function onLoad() {
          iframe.removeEventListener("load", onLoad);
          const result = challenge.test(iframe.contentDocument);
          handleOutcome(result.pass, challenge, result.message);
        },
        { once: true }
      );
    } else if (challenge.type === "css") {
      const iframe = document.getElementById("preview");
      iframe.srcdoc = `<style>${code}</style>${challenge.baseHtml}`;
      iframe.addEventListener(
        "load",
        function onLoad() {
          iframe.removeEventListener("load", onLoad);
          const result = challenge.test(iframe.contentWindow, iframe.contentDocument);
          handleOutcome(result.pass, challenge, result.message);
        },
        { once: true }
      );
    } else if (challenge.type === "js") {
      runJsChallenge(challenge, code);
    } else if (challenge.type === "domjs") {
      runDomJsChallenge(challenge, code);
    }
  }

  function runJsChallenge(challenge, code) {
    const consoleEl = document.getElementById("console");
    consoleEl.innerHTML = "";

    const harness = buildJsHarness(challenge, code);

    const sandbox = document.createElement("iframe");
    sandbox.setAttribute("sandbox", "allow-scripts");
    sandbox.style.display = "none";
    sandbox.srcdoc = harness;

    function onMessage(event) {
      if (event.source !== sandbox.contentWindow) return;
      window.removeEventListener("message", onMessage);
      sandbox.remove();

      const data = event.data;
      if (data.error) {
        logConsole(`❌ Erreur : ${data.error}`, "fail");
        handleOutcome(false, challenge, "Ton code contient une erreur, regarde la console de test.");
        return;
      }
      let allPass = true;
      data.results.forEach((r) => {
        const argsStr = JSON.stringify(r.args);
        if (r.pass) {
          logConsole(`✅ ${challenge.functionName}(${argsStr.slice(1, -1)}) → ${JSON.stringify(r.actual)}`, "pass");
        } else {
          allPass = false;
          logConsole(
            `❌ ${challenge.functionName}(${argsStr.slice(1, -1)}) → ${JSON.stringify(
              r.actual
            )} (attendu : ${JSON.stringify(r.expected)})`,
            "fail"
          );
        }
      });
      handleOutcome(allPass, challenge, allPass ? "Tous les tests passent, bravo !" : "Certains tests échouent encore.");
    }

    window.addEventListener("message", onMessage);
    document.body.appendChild(sandbox);
  }

  function buildJsHarness(challenge, userCode) {
    const testsJson = JSON.stringify(challenge.tests);
    const fnName = challenge.functionName;
    return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><script>
      (function () {
        try {
          ${userCode}
          const tests = ${testsJson};
          const results = tests.map(function (t) {
            let actual;
            try {
              actual = ${fnName}.apply(null, t.args);
            } catch (e) {
              actual = "Erreur: " + e.message;
            }
            return {
              args: t.args,
              expected: t.expected,
              actual: actual,
              pass: JSON.stringify(actual) === JSON.stringify(t.expected),
            };
          });
          parent.postMessage({ results: results }, "*");
        } catch (e) {
          parent.postMessage({ error: e.message }, "*");
        }
      })();
    <\/script></body></html>`;
  }

  function runDomJsChallenge(challenge, code) {
    updatePreview(challenge, code);

    const harness = buildDomJsHarness(challenge, code);

    const sandbox = document.createElement("iframe");
    sandbox.setAttribute("sandbox", "allow-scripts");
    sandbox.style.display = "none";
    sandbox.srcdoc = harness;

    function onMessage(event) {
      if (event.source !== sandbox.contentWindow) return;
      window.removeEventListener("message", onMessage);
      sandbox.remove();

      const data = event.data;
      if (data.error) {
        handleOutcome(false, challenge, "Ton code contient une erreur : " + data.error);
        return;
      }
      const allPass = data.results.every((r) => r.pass);
      if (allPass) {
        handleOutcome(true, challenge, "Le DOM a été modifié comme attendu, bravo !");
      } else {
        const failed = data.results.find((r) => !r.pass);
        handleOutcome(
          false,
          challenge,
          `${failed.selector} vaut "${failed.actual}", attendu "${failed.expected}".`
        );
      }
    }

    window.addEventListener("message", onMessage);
    document.body.appendChild(sandbox);
  }

  function buildDomJsHarness(challenge, userCode) {
    const checksJson = JSON.stringify(challenge.checks);
    const interactCode = challenge.interact || "";
    return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>
      ${challenge.baseHtml}
      <script>
        (function () {
          try {
            ${userCode}
            ${interactCode}
            const checks = ${checksJson};
            const results = checks.map(function (c) {
              const el = document.querySelector(c.selector);
              const actual = el ? el[c.property] : undefined;
              return {
                selector: c.selector,
                property: c.property,
                expected: c.expected,
                actual: actual,
                pass: JSON.stringify(actual) === JSON.stringify(c.expected),
              };
            });
            parent.postMessage({ results: results }, "*");
          } catch (e) {
            parent.postMessage({ error: e.message }, "*");
          }
        })();
      <\/script>
    </body></html>`;
  }

  function logConsole(text, cls) {
    const consoleEl = document.getElementById("console");
    const line = document.createElement("div");
    line.className = "console-line " + (cls || "");
    line.textContent = text;
    consoleEl.appendChild(line);
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function showResult(pass, message) {
    const resultEl = document.getElementById("result");
    if (!resultEl) return;
    resultEl.className = "result " + (pass ? "pass" : "fail");
    resultEl.textContent = message;
    if (!pass) {
      state.progress.wrongAttempts[currentChallenge().id] = (state.progress.wrongAttempts[currentChallenge().id] || 0) + 1;
    }
  }

  function clearActionArea() {
    const existing = document.getElementById("post-actions");
    if (existing) existing.remove();
  }

  function renderNextChallengeActions() {
    clearActionArea();
    const track = currentTrack();
    const hasNextChallenge = state.challengeIndex < track.challenges.length - 1;
    if (!hasNextChallenge) return;

    const wrap = document.createElement("div");
    wrap.id = "post-actions";
    wrap.className = "post-actions";

    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "btn btn-primary";
    nextBtn.textContent = "Défi suivant →";
    nextBtn.addEventListener("click", () => {
      CodeQuestSound.click();
      showChallengeView(state.trackIndex, state.challengeIndex + 1);
    });
    wrap.appendChild(nextBtn);

    const mapBtn = document.createElement("button");
    mapBtn.type = "button";
    mapBtn.className = "btn btn-ghost";
    mapBtn.textContent = "🗺️ Carte";
    mapBtn.addEventListener("click", () => {
      CodeQuestSound.click();
      state.activeTrackId = track.id;
      state.mapSubview = "path";
      showMapView();
    });
    wrap.appendChild(mapBtn);

    challengeEl.appendChild(wrap);
  }

  function renderKingdomCompleteAction(track) {
    clearActionArea();
    const trackIdx = CODEQUEST_DATA.tracks.indexOf(track);
    const hasNextTrack = trackIdx < CODEQUEST_DATA.tracks.length - 1;

    const banner = document.createElement("div");
    banner.id = "post-actions";
    banner.className = "kingdom-banner";
    banner.style.setProperty("--kingdom-color", track.theme);
    banner.innerHTML = `<p class="kingdom-banner-title">🎉 ${track.worldName} conquis !</p>`;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-primary";
    btn.textContent = hasNextTrack ? "🗺️ Vers le royaume suivant" : "🏆 Voir mes badges";
    btn.addEventListener("click", () => {
      CodeQuestSound.click();
      state.mapSubview = "overview";
      showMapView();
      if (!hasNextTrack) openBadgesModal();
    });
    banner.appendChild(btn);
    challengeEl.appendChild(banner);
  }

  // --- Mascotte ---

  let mascotTimeout;
  function showMascotMessage(text, mood) {
    const mascot = document.getElementById("mascot");
    const bubble = document.getElementById("mascot-bubble");
    bubble.textContent = text;
    mascot.classList.remove("hidden", "mood-success", "mood-fail", "mood-kingdom", "mood-badge");
    mascot.classList.add("mood-" + (mood || "success"), "show");
    clearTimeout(mascotTimeout);
    mascotTimeout = setTimeout(() => mascot.classList.remove("show"), 4000);
  }

  // --- Confettis ---

  function burstConfetti(count) {
    const layer = document.getElementById("confetti-layer");
    const colors = ["#5b8def", "#3ecf8e", "#f5c542", "#ef5b6b", "#7aa4f7"];
    for (let i = 0; i < count; i++) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.style.left = Math.random() * 100 + "vw";
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = Math.random() * 0.25 + "s";
      piece.style.setProperty("--rot", Math.random() * 360 + "deg");
      piece.addEventListener("animationend", () => piece.remove());
      layer.appendChild(piece);
    }
  }

  // --- Badges ---

  function checkNewBadges() {
    const earnedIds = CODEQUEST_BADGES.filter((b) => b.test(state.progress)).map((b) => b.id);
    const already = state.progress.badgesAwarded || [];
    const newOnes = CODEQUEST_BADGES.filter((b) => earnedIds.includes(b.id) && !already.includes(b.id));
    if (newOnes.length > 0) {
      state.progress.badgesAwarded = earnedIds;
      saveProgress();
    }
    return newOnes;
  }

  function openBadgesModal() {
    const grid = document.getElementById("badges-grid");
    grid.innerHTML = "";
    CODEQUEST_BADGES.forEach((badge) => {
      const earned = badge.test(state.progress);
      const card = document.createElement("div");
      card.className = "badge-card" + (earned ? " earned" : "");
      card.innerHTML = `
        <span class="badge-icon">${badge.icon}</span>
        <h4>${badge.title}</h4>
        <p>${badge.description}</p>
      `;
      grid.appendChild(card);
    });
    document.getElementById("badges-modal").classList.remove("hidden");
  }

  function closeBadgesModal() {
    document.getElementById("badges-modal").classList.add("hidden");
  }

  // --- Résolution d'un défi ---

  function handleOutcome(pass, challenge, message) {
    showResult(pass, message);

    if (!pass) {
      CodeQuestSound.fail();
      state.progress.streak = 0;
      saveProgress();
      renderHeader();
      showMascotMessage(pickRandom(CODEQUEST_MASCOT.fail), "fail");
      return;
    }

    CodeQuestSound.success();
    state.progress.streak = (state.progress.streak || 0) + 1;
    state.progress.bestStreak = Math.max(state.progress.bestStreak || 0, state.progress.streak);

    const track = currentTrack();
    const wasTrackDoneBefore = trackCompletionCount(track) === track.challenges.length;
    const isNewCompletion = !isChallengeDone(challenge.id);
    if (isNewCompletion) {
      state.progress.completed[challenge.id] = true;
      state.progress.xp += challenge.xp || 0;
    }
    saveProgress();

    const newBadges = checkNewBadges();
    renderHeader();

    const trackDoneNow = trackCompletionCount(track) === track.challenges.length;
    const justFinishedTrack = isNewCompletion && !wasTrackDoneBefore && trackDoneNow;

    if (newBadges.length > 0) {
      showMascotMessage(`${CODEQUEST_MASCOT.badge} ${newBadges.map((b) => b.icon + " " + b.title).join(", ")}`, "badge");
      CodeQuestSound.unlock();
    } else if (justFinishedTrack) {
      showMascotMessage(pickRandom(CODEQUEST_MASCOT.kingdomComplete), "kingdom");
    } else if (isNewCompletion) {
      showMascotMessage(pickRandom(CODEQUEST_MASCOT.success), "success");
    }

    if (justFinishedTrack) {
      CodeQuestSound.kingdomComplete();
      burstConfetti(60);
      renderKingdomCompleteAction(track);
    } else {
      burstConfetti(newBadges.length > 0 ? 40 : 18);
      renderNextChallengeActions();
    }
  }

  // --- Câblage de l'en-tête et des modales ---

  document.getElementById("back-to-map").addEventListener("click", () => {
    CodeQuestSound.click();
    const track = currentTrack();
    state.activeTrackId = track.id;
    state.mapSubview = "path";
    showMapView();
  });

  document.getElementById("badges-btn").addEventListener("click", () => {
    CodeQuestSound.click();
    openBadgesModal();
  });
  document.getElementById("close-badges").addEventListener("click", closeBadgesModal);
  document.getElementById("badges-backdrop").addEventListener("click", closeBadgesModal);

  document.getElementById("mute-btn").addEventListener("click", () => {
    CodeQuestSound.toggleMute();
    renderHeader();
  });

  // --- Démarrage ---

  function initState() {
    let current = CODEQUEST_DATA.tracks[0];
    for (let i = 0; i < CODEQUEST_DATA.tracks.length; i++) {
      if (!isTrackUnlocked(i)) break;
      current = CODEQUEST_DATA.tracks[i];
      if (trackCompletionCount(current) < current.challenges.length) break;
    }
    state.activeTrackId = current.id;
    const hasProgress = Object.keys(state.progress.completed).length > 0;
    state.mapSubview = hasProgress ? "path" : "overview";
  }

  initState();
  showMapView();
})();
