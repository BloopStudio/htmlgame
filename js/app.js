/**
 * CodeQuest - moteur du jeu.
 * Gère la navigation entre parcours/défis, l'éditeur, la validation
 * (via iframes sandboxées) et la sauvegarde de la progression.
 */
(function () {
  "use strict";

  const STORAGE_KEY = "codequest_progress_v1";
  const TOKEN_KEY = "codequest_token_v1";

  const state = {
    trackIndex: 0,
    challengeIndex: 0,
    progress: loadProgress(),
  };

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      /* localStorage indisponible ou corrompu : on repart de zéro */
    }
    return { completed: {}, xp: 0 };
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

  // Le backend PHP est optionnel : il n'existe que si le site est servi par un
  // vrai serveur PHP (ex: `php -S localhost:8000`). Sur GitHub Pages cet appel
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

  function markChallengeDone(challenge) {
    if (!isChallengeDone(challenge.id)) {
      state.progress.completed[challenge.id] = true;
      state.progress.xp += challenge.xp || 0;
      saveProgress();
    }
  }

  function isTrackUnlocked(trackIdx) {
    if (trackIdx === 0) return true;
    const prev = CODEQUEST_DATA.tracks[trackIdx - 1];
    return prev.challenges.every((c) => isChallengeDone(c.id));
  }

  function trackCompletionCount(track) {
    return track.challenges.filter((c) => isChallengeDone(c.id)).length;
  }

  // --- Rendu ---

  const sidebarEl = document.getElementById("sidebar");
  const challengeEl = document.getElementById("challenge");
  const xpValueEl = document.getElementById("xp-value");
  const xpFillEl = document.getElementById("xp-fill");

  function totalXp() {
    let total = 0;
    CODEQUEST_DATA.tracks.forEach((t) => t.challenges.forEach((c) => (total += c.xp || 0)));
    return total;
  }

  function renderXp() {
    xpValueEl.textContent = state.progress.xp;
    const pct = Math.min(100, Math.round((state.progress.xp / totalXp()) * 100));
    xpFillEl.style.width = pct + "%";
  }

  function renderSidebar() {
    sidebarEl.innerHTML = "";
    CODEQUEST_DATA.tracks.forEach((track, tIdx) => {
      const unlocked = isTrackUnlocked(tIdx);
      const done = trackCompletionCount(track);
      const trackEl = document.createElement("div");
      trackEl.className = "track" + (unlocked ? "" : " locked") + (tIdx === state.trackIndex ? " active" : "");

      const header = document.createElement("button");
      header.className = "track-header";
      header.type = "button";
      header.disabled = !unlocked;
      header.innerHTML = `
        <span class="track-icon">${track.icon}</span>
        <span class="track-title">${track.title}</span>
        <span class="track-count">${done}/${track.challenges.length}</span>
        ${unlocked ? "" : '<span class="lock" title="Termine le parcours précédent pour débloquer">🔒</span>'}
      `;
      header.addEventListener("click", () => {
        if (!unlocked) return;
        state.trackIndex = tIdx;
        state.challengeIndex = firstUnfinishedIndex(track);
        renderAll();
      });
      trackEl.appendChild(header);

      if (tIdx === state.trackIndex && unlocked) {
        const list = document.createElement("ul");
        list.className = "challenge-list";
        track.challenges.forEach((c, cIdx) => {
          const li = document.createElement("li");
          li.className = cIdx === state.challengeIndex ? "current" : "";
          const done = isChallengeDone(c.id);
          li.innerHTML = `<button type="button">${done ? "✅" : "▫️"} ${c.title}</button>`;
          li.querySelector("button").addEventListener("click", () => {
            state.challengeIndex = cIdx;
            renderAll();
          });
          list.appendChild(li);
        });
        trackEl.appendChild(list);
      }

      sidebarEl.appendChild(trackEl);
    });
  }

  function firstUnfinishedIndex(track) {
    const idx = track.challenges.findIndex((c) => !isChallengeDone(c.id));
    return idx === -1 ? 0 : idx;
  }

  function currentTrack() {
    return CODEQUEST_DATA.tracks[state.trackIndex];
  }

  function currentChallenge() {
    return currentTrack().challenges[state.challengeIndex];
  }

  function renderChallenge() {
    const track = currentTrack();
    const challenge = currentChallenge();
    challengeEl.innerHTML = "";

    const header = document.createElement("div");
    header.className = "challenge-header";
    header.innerHTML = `
      <h2>${track.icon} ${challenge.title}</h2>
      <p class="instructions">${challenge.instructions || ""}</p>
    `;
    challengeEl.appendChild(header);

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

    if (challenge.type === "css" && challenge.baseHtml) {
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
    label.textContent = challenge.type === "css" ? "Ton CSS :" : challenge.type === "js" ? "Ton JavaScript :" : "Ton HTML :";
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
      iframe.setAttribute("sandbox", "allow-same-origin");
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
  }

  function handleOutcome(pass, challenge, message) {
    showResult(pass, message);
    if (pass) {
      const alreadyDone = isChallengeDone(challenge.id);
      markChallengeDone(challenge);
      if (!alreadyDone) {
        showXpToast(challenge.xp);
      }
      renderSidebar();
      renderXp();
      showNextButton();
    }
  }

  function showXpToast(xp) {
    const toast = document.createElement("div");
    toast.className = "xp-toast";
    toast.textContent = `+${xp} XP`;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("show"));
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 1400);
  }

  function showNextButton() {
    if (document.getElementById("next-btn")) return;
    const track = currentTrack();
    const hasNextChallenge = state.challengeIndex < track.challenges.length - 1;
    const hasNextTrack = state.trackIndex < CODEQUEST_DATA.tracks.length - 1;
    if (!hasNextChallenge && !hasNextTrack) return;

    const btn = document.createElement("button");
    btn.id = "next-btn";
    btn.type = "button";
    btn.className = "btn btn-primary next-btn";
    btn.textContent = hasNextChallenge ? "Défi suivant →" : "Parcours suivant →";
    btn.addEventListener("click", () => {
      if (hasNextChallenge) {
        state.challengeIndex++;
      } else if (hasNextTrack) {
        state.trackIndex++;
        state.challengeIndex = 0;
      }
      renderAll();
    });
    challengeEl.appendChild(btn);
  }

  function renderAll() {
    renderSidebar();
    renderChallenge();
    renderXp();
  }

  // Point de départ : reprend la première épreuve non terminée du premier
  // parcours débloqué, pour retomber pile là où le joueur s'était arrêté.
  function initState() {
    let target = 0;
    for (let i = 0; i < CODEQUEST_DATA.tracks.length; i++) {
      if (!isTrackUnlocked(i)) break;
      target = i;
      if (trackCompletionCount(CODEQUEST_DATA.tracks[i]) < CODEQUEST_DATA.tracks[i].challenges.length) break;
    }
    state.trackIndex = target;
    state.challengeIndex = firstUnfinishedIndex(CODEQUEST_DATA.tracks[target]);
  }

  initState();
  renderAll();
})();
