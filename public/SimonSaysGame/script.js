/**
 * Simon Says Game — script.js
 * ============================
 * Classic & Advanced modes.
 * Uses the Web Audio API for responsive tones (no external assets).
 */

(() => {
  "use strict";

  // ── DOM Elements ──────────────────────────────────────────────
  const padGreen = document.getElementById("pad-green");
  const padRed = document.getElementById("pad-red");
  const padYellow = document.getElementById("pad-yellow");
  const padBlue = document.getElementById("pad-blue");
  const scoreDisplay = document.getElementById("score-display");
  const levelDisplay = document.getElementById("level-display");
  const highscoreDisplay = document.getElementById("highscore-display");
  const statusMessage = document.getElementById("status-message");
  const centerText = document.getElementById("center-text");
  const simonCenter = document.getElementById("simon-center");
  const btnStart = document.getElementById("btn-start");
  const btnMode = document.getElementById("btn-mode");
  const modeBadge = document.getElementById("mode-badge");
  const modeDesc = document.getElementById("mode-desc");

  // ── Pad map ──────────────────────────────────────────────────
  const PADS = {
    green: padGreen,
    red: padRed,
    yellow: padYellow,
    blue: padBlue,
  };
  const COLOR_KEYS = Object.keys(PADS);

  // ── Audio context (Web Audio API) ────────────────────────────
  const FREQUENCIES = {
    green: 392.0, // G4
    red: 261.63, // C4
    yellow: 329.63, // E4
    blue: 523.25, // C5
  };

  let audioCtx = null;

  const ensureAudioCtx = () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  };

  const playTone = (color, duration = 0.3) => {
    ensureAudioCtx();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.value = FREQUENCIES[color];
    gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioCtx.currentTime + duration
    );
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  };

  const playErrorTone = () => {
    ensureAudioCtx();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sawtooth";
    osc.frequency.value = 120;
    gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.6);
  };

  // ── Game State ───────────────────────────────────────────────
  let gameSequence = [];
  let playerSequence = [];
  let level = 0;
  let score = 0;
  let highscore = parseInt(localStorage.getItem("simonHighscore") || "0", 10);
  let isPlaying = false;
  let isShowingSequence = false;
  let advancedMode = false; // false = Classic, true = Advanced

  highscoreDisplay.textContent = highscore;

  // ── Utility ──────────────────────────────────────────────────
  const randomColor = () => COLOR_KEYS[Math.floor(Math.random() * 4)];

  const setStatus = (text, type = "") => {
    statusMessage.textContent = text;
    statusMessage.className = "status-message";
    if (type) statusMessage.classList.add(type);
  };

  const flashLevelUp = () => {
    const flash = document.createElement("div");
    flash.className = "level-up-flash";
    document.body.appendChild(flash);
    flash.addEventListener("animationend", () => flash.remove());
  };

  // ── Pad lighting ─────────────────────────────────────────────
  const lightPad = (color, duration = 400) => {
    return new Promise((resolve) => {
      const pad = PADS[color];
      pad.classList.add("lit");
      playTone(color, duration / 1000);
      setTimeout(() => {
        pad.classList.remove("lit");
        setTimeout(resolve, 100); // gap between lights
      }, duration);
    });
  };

  // ── Show sequence ────────────────────────────────────────────
  const showSequence = async () => {
    isShowingSequence = true;
    setStatus("Watch carefully...");
    centerText.textContent = "👀";

    // Speed increases with level
    const baseDelay = advancedMode ? 350 : 500;
    const minDelay = advancedMode ? 150 : 250;
    const delay = Math.max(minDelay, baseDelay - level * 15);

    await new Promise((r) => setTimeout(r, 500));

    for (let i = 0; i < gameSequence.length; i++) {
      if (!isPlaying) return; // game was reset
      await lightPad(gameSequence[i], delay);
    }

    isShowingSequence = false;
    centerText.textContent = "GO!";
    setStatus("Your turn! Repeat the pattern.", "success");
  };

  // ── Next round ───────────────────────────────────────────────
  const nextRound = () => {
    playerSequence = [];
    level++;
    levelDisplay.textContent = level;

    // In advanced mode, occasionally insert TWO new colors at higher levels
    if (advancedMode && level > 5 && Math.random() < 0.35) {
      gameSequence.push(randomColor(), randomColor());
    } else {
      gameSequence.push(randomColor());
    }

    flashLevelUp();
    showSequence();
  };

  // ── Handle player input ──────────────────────────────────────
  const handlePadClick = (color) => {
    if (!isPlaying || isShowingSequence) return;

    // Visual + audio feedback
    const pad = PADS[color];
    pad.classList.add("active");
    playTone(color, 0.2);
    setTimeout(() => pad.classList.remove("active"), 200);

    playerSequence.push(color);
    const idx = playerSequence.length - 1;

    // Check correctness
    if (playerSequence[idx] !== gameSequence[idx]) {
      gameOver();
      return;
    }

    // Completed the round
    if (playerSequence.length === gameSequence.length) {
      // Score: more points at higher levels
      const roundPoints = level * (advancedMode ? 15 : 10);
      score += roundPoints;
      scoreDisplay.textContent = score;
      setStatus(`+${roundPoints} points! Get ready...`, "success");
      centerText.textContent = "✓";

      setTimeout(nextRound, 1200);
    }
  };

  // ── Game Over ────────────────────────────────────────────────
  const gameOver = () => {
    isPlaying = false;
    playErrorTone();
    setStatus("Wrong! Game Over.", "error");
    centerText.textContent = "✗";

    // Flash all pads red
    Object.values(PADS).forEach((p) => p.classList.add("active"));
    setTimeout(
      () => Object.values(PADS).forEach((p) => p.classList.remove("active")),
      600
    );

    const isNewRecord = score > highscore;
    if (isNewRecord) {
      highscore = score;
      localStorage.setItem("simonHighscore", highscore.toString());
      highscoreDisplay.textContent = highscore;
    }

    // Show overlay after short delay
    setTimeout(() => showGameOverOverlay(isNewRecord), 800);
  };

  const showGameOverOverlay = (isNewRecord) => {
    const overlay = document.createElement("div");
    overlay.className = "game-over-overlay";
    overlay.id = "game-over-overlay";
    overlay.innerHTML = `
      <div class="game-over-card">
        <h2>Game Over!</h2>
        <p class="final-label">Final Score</p>
        <p class="final-score">${score}</p>
        <p class="final-label">Level reached: ${level}</p>
        ${isNewRecord ? '<p class="new-record">🏆 NEW HIGH SCORE!</p>' : ""}
        <button class="btn btn--primary" id="btn-restart">
          <span class="btn-icon">🔄</span>
          Play Again
        </button>
      </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById("btn-restart").addEventListener("click", () => {
      overlay.remove();
      startGame();
    });

    // Close on overlay click (outside card)
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.remove();
        resetGame();
      }
    });
  };

  // ── Start / Reset ────────────────────────────────────────────
  const startGame = () => {
    ensureAudioCtx();
    gameSequence = [];
    playerSequence = [];
    level = 0;
    score = 0;
    isPlaying = true;
    isShowingSequence = false;
    scoreDisplay.textContent = 0;
    levelDisplay.textContent = 0;
    btnStart.querySelector(".btn-icon").textContent = "⏹";
    btnStart.childNodes[2].textContent = " Reset";
    setStatus("Starting...");
    nextRound();
  };

  const resetGame = () => {
    isPlaying = false;
    isShowingSequence = false;
    gameSequence = [];
    playerSequence = [];
    level = 0;
    score = 0;
    scoreDisplay.textContent = 0;
    levelDisplay.textContent = 0;
    centerText.textContent = "START";
    btnStart.querySelector(".btn-icon").textContent = "▶";
    btnStart.childNodes[2].textContent = " Start Game";
    setStatus("Press Start or any key to begin!");
    Object.values(PADS).forEach((p) => {
      p.classList.remove("active", "lit");
    });
  };

  // ── Toggle Mode ──────────────────────────────────────────────
  const toggleMode = () => {
    if (isPlaying) {
      resetGame();
    }
    advancedMode = !advancedMode;
    if (advancedMode) {
      btnMode.childNodes[2].textContent = " Advanced Mode";
      modeBadge.textContent = "ADVANCED";
      modeBadge.className = "mode-badge mode-badge--advanced";
      modeDesc.textContent =
        "Faster pace, double-adds, and shorter display times. Good luck!";
    } else {
      btnMode.childNodes[2].textContent = " Classic Mode";
      modeBadge.textContent = "CLASSIC";
      modeBadge.className = "mode-badge mode-badge--classic";
      modeDesc.textContent =
        "Repeat the pattern as it grows longer each round.";
    }
  };

  // ── Event Listeners ──────────────────────────────────────────
  Object.entries(PADS).forEach(([color, pad]) => {
    pad.addEventListener("click", () => handlePadClick(color));
  });

  simonCenter.addEventListener("click", () => {
    if (isPlaying) {
      resetGame();
    } else {
      startGame();
    }
  });

  btnStart.addEventListener("click", () => {
    if (isPlaying) {
      resetGame();
    } else {
      startGame();
    }
  });

  btnMode.addEventListener("click", toggleMode);

  // Keyboard: start with any key, or use arrow keys / WASD
  document.addEventListener("keydown", (e) => {
    if (!isPlaying) {
      startGame();
      return;
    }

    const keyMap = {
      ArrowUp: "green",
      ArrowRight: "red",
      ArrowDown: "blue",
      ArrowLeft: "yellow",
      w: "green",
      d: "red",
      s: "blue",
      a: "yellow",
      W: "green",
      D: "red",
      S: "blue",
      A: "yellow",
    };

    if (keyMap[e.key]) {
      handlePadClick(keyMap[e.key]);
    }
  });
})();
