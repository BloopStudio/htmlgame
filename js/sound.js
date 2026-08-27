/**
 * CodeQuest - petits effets sonores synthétisés avec la Web Audio API.
 * Pas de fichier audio à charger : tout est généré en code, ce qui reste
 * léger et fonctionne aussi bien en local que sur GitHub Pages.
 */
const CodeQuestSound = (function () {
  const MUTE_KEY = "codequest_muted_v1";
  let ctx = null;
  let muted = localStorage.getItem(MUTE_KEY) === "1";

  function getContext() {
    if (!ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      ctx = new AudioContextClass();
    }
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }

  function tone(freq, startOffset, duration, type, gainValue) {
    if (muted) return;
    try {
      const audioCtx = getContext();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type || "sine";
      osc.frequency.value = freq;
      const t0 = audioCtx.currentTime + startOffset;
      gain.gain.setValueAtTime(gainValue || 0.15, t0);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(t0);
      osc.stop(t0 + duration + 0.05);
    } catch (e) {
      /* Web Audio indisponible : le jeu continue simplement sans son */
    }
  }

  return {
    success() {
      tone(523.25, 0, 0.12, "sine", 0.15);
      tone(659.25, 0.1, 0.12, "sine", 0.15);
      tone(783.99, 0.2, 0.2, "sine", 0.15);
    },
    fail() {
      tone(220, 0, 0.22, "sawtooth", 0.08);
      tone(174.61, 0.12, 0.22, "sawtooth", 0.08);
    },
    click() {
      tone(440, 0, 0.05, "square", 0.05);
    },
    unlock() {
      tone(659.25, 0, 0.1, "triangle", 0.12);
      tone(987.77, 0.09, 0.16, "triangle", 0.12);
    },
    kingdomComplete() {
      tone(523.25, 0, 0.12, "sine", 0.16);
      tone(659.25, 0.12, 0.12, "sine", 0.16);
      tone(783.99, 0.24, 0.12, "sine", 0.16);
      tone(1046.5, 0.36, 0.35, "sine", 0.18);
    },
    isMuted() {
      return muted;
    },
    toggleMute() {
      muted = !muted;
      localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
      return muted;
    },
  };
})();
