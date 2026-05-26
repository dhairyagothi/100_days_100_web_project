document.addEventListener("DOMContentLoaded", function () {
  /* ── AUDIO SETUP ── */
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  let audioCtx = null;

  function getAudioCtx() {
    if (!audioCtx) audioCtx = new AudioCtx();
    return audioCtx;
  }

  function playTone(frequency, type, duration, volume = 0.3) {
    try {
      const ctx = getAudioCtx();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + duration,
      );

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      console.log("Audio not supported");
    }
  }

  function playHighSound() {
    playTone(300, "sawtooth", 0.25, 0.25);
  }

  function playLowSound() {
    playTone(180, "sawtooth", 0.25, 0.25);
  }

  function playWinSound() {
    const ctx = getAudioCtx();
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, "sine", 0.3, 0.4), i * 120);
    });
  }

  function playClickSound() {
    playTone(600, "sine", 0.08, 0.15);
  }

  /* ── GAME STATE ── */
  let secret, attempts, bestScore, guesses, gameOver;
  let low = 1,
    high = 100;

  /* ── DOM REFS ── */
  const attemptsEl = document.getElementById("attempts");
  const bestScoreEl = document.getElementById("bestScore");
  const guessInput = document.getElementById("guessInput");
  const guessBtn = document.getElementById("guessBtn");
  const hintBox = document.getElementById("hintBox");
  const rangeHint = document.getElementById("rangeHint");
  const historySection = document.getElementById("historySection");
  const historyChips = document.getElementById("historyChips");
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");

  /* ── THEME TOGGLE ── */
  let currentTheme = localStorage.getItem("ngg-theme") || "light";
  applyTheme(currentTheme);

  themeToggle.addEventListener("click", function () {
    playClickSound();
    currentTheme = currentTheme === "light" ? "dark" : "light";
    applyTheme(currentTheme);
    localStorage.setItem("ngg-theme", currentTheme);
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    themeIcon.textContent = theme === "light" ? "🌙" : "☀️";
  }

  /* ── INIT GAME ── */
  function initGame() {
    secret = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    guesses = [];
    gameOver = false;
    low = 1;
    high = 100;

    attemptsEl.textContent = "0";
    guessInput.value = "";
    guessInput.disabled = false;
    guessBtn.disabled = false;

    hintBox.textContent = "";
    hintBox.className = "hint-box";
    rangeHint.textContent = "";
    historySection.style.display = "none";
    historyChips.innerHTML = "";

    guessInput.focus();
  }

  /* ── MAKE GUESS ── */
  function makeGuess() {
    if (gameOver) return;

    const val = parseInt(guessInput.value);

    if (!val || val < 1 || val > 100) {
      showHint("⚠️ Please enter a number between 1 and 100!", "high");
      playHighSound();
      guessInput.value = "";
      return;
    }

    if (guesses.includes(val)) {
      showHint(`⚠️ You already guessed ${val}! Try another.`, "high");
      guessInput.value = "";
      return;
    }

    attempts++;
    guesses.push(val);
    attemptsEl.textContent = attempts;

    addChip(val, val === secret ? "win" : val > secret ? "high" : "low");
    historySection.style.display = "block";

    if (val === secret) {
      showHint(
        `🎉 Correct! The number was ${secret}. You got it in ${attempts} attempt${attempts > 1 ? "s" : ""}!`,
        "win",
      );
      rangeHint.textContent = "";
      updateBestScore(attempts);
      playWinSound();
      gameOver = true;
      guessInput.disabled = true;
      guessBtn.disabled = true;
    } else if (val > secret) {
      showHint("📉 Too High! Try a lower number.", "high");
      high = Math.min(high, val - 1);
      rangeHint.textContent = `Hint: number is between ${low} and ${high}`;
      playHighSound();
    } else {
      showHint("📈 Too Low! Try a higher number.", "low");
      low = Math.max(low, val + 1);
      rangeHint.textContent = `Hint: number is between ${low} and ${high}`;
      playLowSound();
    }

    guessInput.value = "";
    guessInput.focus();
  }

  /* ── HELPERS ── */
  function showHint(message, type) {
    hintBox.textContent = message;
    hintBox.className = `hint-box ${type} show`;
  }

  function addChip(val, type) {
    const chip = document.createElement("span");
    chip.className = `chip ${type}`;
    chip.textContent = val;
    historyChips.appendChild(chip);
  }

  function updateBestScore(score) {
    const saved = localStorage.getItem("ngg-best");
    if (!saved || score < parseInt(saved)) {
      localStorage.setItem("ngg-best", score);
      bestScoreEl.textContent = score;
    } else {
      bestScoreEl.textContent = saved;
    }
  }

  function loadBestScore() {
    const saved = localStorage.getItem("ngg-best");
    bestScoreEl.textContent = saved || "—";
  }

  /* ── RESET ── */
  window.resetGame = function () {
    playClickSound();
    initGame();
  };

  /* ── GUESS BUTTON ── */
  window.makeGuess = makeGuess;

  /* ── ENTER KEY ── */
  guessInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") makeGuess();
  });

  /* ── START ── */
  loadBestScore();
  initGame();
});
