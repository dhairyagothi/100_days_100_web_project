(() => {
  const DIFFICULTIES = {
    easy: { rows: 9, cols: 9, mines: 10 },
    medium: { rows: 12, cols: 14, mines: 28 },
    hard: { rows: 16, cols: 18, mines: 52 },
  };

  const boardEl = document.querySelector("#board");
  const mineCountEl = document.querySelector("#mine-count");
  const timerEl = document.querySelector("#timer");
  const messageEl = document.querySelector("#game-message");
  const restartButton = document.querySelector("#restart-button");
  const gameCard = document.querySelector(".game-card");
  const difficultyButtons = document.querySelectorAll("[data-difficulty]");
  const bestScoreEl = document.querySelector("#best-score");
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const themeIconEl = document.querySelector("[data-theme-icon]");
  const soundToggle = document.querySelector("[data-sound-toggle]");
  const soundIconEl = document.querySelector("[data-sound-icon]");
  const modalEl = document.querySelector("[data-modal]");
  const modalTitleEl = document.querySelector("[data-modal-title]");
  const modalMessageEl = document.querySelector("[data-modal-message]");
  const modalIconEl = document.querySelector("[data-modal-icon]");
  const modalRestartButton = document.querySelector("[data-modal-restart]");

  const state = {
    difficulty: "easy",
    grid: [],
    rows: 0,
    cols: 0,
    mines: 0,
    flags: 0,
    revealed: 0,
    started: false,
    gameOver: false,
    timerId: null,
    lossModalTimer: null,
    seconds: 0,
    longPressTimer: null,
    skipNextClick: false,
    soundEnabled: localStorage.getItem("minesweeper-sound") !== "off",
  };

  const pad = (value) => String(value).padStart(3, "0");
  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${pad(minutes).slice(-2)}:${String(remainingSeconds).padStart(2, "0")}`;
  };
  const formatMineCount = (count) => `${count < 0 ? "-" : ""}${pad(Math.abs(count))}`;
  const indexOf = (row, col) => row * state.cols + col;
  const isInside = (row, col) => row >= 0 && row < state.rows && col >= 0 && col < state.cols;
  const icon = {
    flag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 21V4"/><path d="M6 5h11l-2 4 2 4H6"/></svg>',
    mine: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M19.1 4.9l-2.8 2.8M7.7 16.3l-2.8 2.8"/></svg>',
    restart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.34-5.66"/><path d="M20 4v6h-6"/></svg>',
    win: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
    moon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.4 15.4A8.5 8.5 0 0 1 8.6 3.6 8.7 8.7 0 1 0 20.4 15.4Z"/></svg>',
    sun: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>',
    soundOn: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="M17 9a4 4 0 0 1 0 6"/></svg>',
    soundOff: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="M19 9l-4 6M15 9l4 6"/></svg>',
  };

  function newGame(difficulty = state.difficulty) {
    const config = DIFFICULTIES[difficulty];
    state.difficulty = difficulty;
    state.rows = config.rows;
    state.cols = config.cols;
    state.mines = config.mines;
    state.flags = 0;
    state.revealed = 0;
    state.started = false;
    state.gameOver = false;
    state.seconds = 0;
    clearInterval(state.timerId);
    clearTimeout(state.lossModalTimer);
    state.timerId = null;
    state.lossModalTimer = null;
    closeModal();
    setControlsDisabled(false);
    gameCard.classList.remove("won", "game-lost");
    boardEl.classList.remove("board-locked");

    state.grid = Array.from({ length: state.rows * state.cols }, (_, index) => ({
      index,
      row: Math.floor(index / state.cols),
      col: index % state.cols,
      mine: false,
      revealed: false,
      flagged: false,
      exploded: false,
      justRevealed: false,
      adjacent: 0,
    }));

    placeMines();
    calculateNumbers();
    renderBoard();
    updateStatus();
    updateBestScore();
    messageEl.textContent = "Find every safe tile. Right click or long press to flag.";
  }

  function placeMines() {
    const picked = new Set();
    while (picked.size < state.mines) {
      picked.add(Math.floor(Math.random() * state.grid.length));
    }
    picked.forEach((index) => {
      state.grid[index].mine = true;
    });
  }

  function calculateNumbers() {
    state.grid.forEach((cell) => {
      if (cell.mine) return;
      cell.adjacent = neighbors(cell).filter((item) => item.mine).length;
    });
  }

  function neighbors(cell) {
    const nearby = [];
    for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
      for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
        if (rowOffset === 0 && colOffset === 0) continue;
        const row = cell.row + rowOffset;
        const col = cell.col + colOffset;
        if (isInside(row, col)) nearby.push(state.grid[indexOf(row, col)]);
      }
    }
    return nearby;
  }

  function renderBoard() {
    boardEl.style.gridTemplateColumns = `repeat(${state.cols}, var(--cell-size))`;
    boardEl.innerHTML = state.grid.map((cell) => {
      const content = getCellContent(cell);
      const classes = getCellClasses(cell).join(" ");
      return `<button class="${classes}" type="button" role="gridcell" data-index="${cell.index}" aria-label="${getCellLabel(cell)}">${content}</button>`;
    }).join("");
    clearRevealMarks();
  }

  function getCellClasses(cell) {
    const classes = ["cell"];
    if (cell.exploded) classes.push("exploded-mine");
    else if (cell.revealed && cell.mine) classes.push("mine-cell");
    else if (cell.revealed) classes.push("revealed-cell");
    else if (cell.flagged) classes.push("hidden-cell", "flagged-cell");
    else classes.push("hidden-cell");
    if (cell.revealed && cell.adjacent > 0) classes.push(`number-${cell.adjacent}`);
    if (cell.justRevealed) classes.push("newly-revealed");
    return classes;
  }

  function clearRevealMarks() {
    state.grid.forEach((cell) => {
      cell.justRevealed = false;
    });
  }

  function getCellContent(cell) {
    if (cell.flagged && !cell.revealed) return icon.flag;
    if (!cell.revealed) return "";
    if (cell.mine) return icon.mine;
    return cell.adjacent || "";
  }

  function getCellLabel(cell) {
    if (cell.flagged && !cell.revealed) return "Flagged cell";
    if (!cell.revealed) return "Hidden cell";
    if (cell.mine) return "Mine";
    if (cell.adjacent) return `${cell.adjacent} adjacent mines`;
    return "Empty revealed cell";
  }

  function startTimer() {
    if (state.started) return;
    state.started = true;
    state.timerId = setInterval(() => {
      state.seconds += 1;
      timerEl.textContent = formatTimer(state.seconds);
    }, 1000);
  }

  function revealCell(index) {
    const cell = state.grid[index];
    if (!cell || state.gameOver || cell.revealed || cell.flagged) return;
    startTimer();

    if (cell.mine) {
      cell.exploded = true;
      loseGame();
      return;
    }

    floodReveal(cell);
    if (checkWin()) return;
    renderBoard();
    updateStatus();
  }

  // Breadth-first reveal opens connected empty cells and their numbered edge.
  function floodReveal(startCell) {
    const queue = [startCell];
    const seen = new Set();

    while (queue.length) {
      const cell = queue.shift();
      if (seen.has(cell.index) || cell.flagged || cell.revealed || cell.mine) continue;
      seen.add(cell.index);
      cell.revealed = true;
      cell.justRevealed = true;
      state.revealed += 1;

      if (cell.adjacent === 0) {
        neighbors(cell).forEach((neighbor) => {
          if (!neighbor.revealed && !neighbor.mine) queue.push(neighbor);
        });
      }
    }
  }

  function toggleFlag(index) {
    const cell = state.grid[index];
    if (!cell || state.gameOver || cell.revealed) return;
    startTimer();
    cell.flagged = !cell.flagged;
    state.flags += cell.flagged ? 1 : -1;
    renderBoard();
    updateStatus();
  }

  function loseGame() {
    state.gameOver = true;
    clearInterval(state.timerId);
    setControlsDisabled(true);
    state.grid.forEach((cell) => {
      if (cell.mine) cell.revealed = true;
    });
    renderBoard();
    updateStatus();
    gameCard.classList.add("game-lost");
    boardEl.classList.add("board-locked");
    messageEl.textContent = "Mine triggered. Study the field before the next sweep.";
    playTone(120, 0.12);
    setTimeout(() => playTone(90, 0.12), 120);

    state.lossModalTimer = setTimeout(() => {
      openModal("Game Over", "A mine was triggered. Reset the grid and make a cleaner sweep.", "lose", getLossStats());
      state.lossModalTimer = null;
    }, 2400);
  }

  function checkWin() {
    const safeCells = state.rows * state.cols - state.mines;
    if (state.revealed !== safeCells) return false;

    state.gameOver = true;
    clearInterval(state.timerId);
    state.grid.forEach((cell) => {
      if (cell.mine && !cell.flagged) {
        cell.flagged = true;
        state.flags += 1;
      }
    });
    saveBestScore();
    renderBoard();
    updateStatus();
    updateBestScore();
    messageEl.textContent = "Board cleared. Nicely done.";
    gameCard.classList.add("won");
    openModal("You Win", `Board cleared in ${formatTimer(state.seconds)}. Best time saved for ${state.difficulty} mode.`, "win");
    playTone(620, 0.1);
    setTimeout(() => playTone(880, 0.12), 100);
    return true;
  }

  function updateStatus() {
    mineCountEl.textContent = formatMineCount(state.mines - state.flags);
    timerEl.textContent = formatTimer(state.seconds);
  }

  function bestScoreKey() {
    return `minesweeper-best-${state.difficulty}`;
  }

  function updateBestScore() {
    const score = localStorage.getItem(bestScoreKey());
    bestScoreEl.textContent = score ? formatTimer(Number(score)) : "--";
  }

  function saveBestScore() {
    const key = bestScoreKey();
    const currentBest = Number(localStorage.getItem(key));
    if (!currentBest || state.seconds < currentBest) {
      localStorage.setItem(key, String(state.seconds));
    }
  }

  function playTone(frequency, duration) {
    if (!state.soundEnabled) return;
    if (!window.AudioContext && !window.webkitAudioContext) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audio = new AudioContext();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.frequency.value = frequency;
    oscillator.type = "sine";
    gain.gain.setValueAtTime(0.04, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start();
    oscillator.stop(audio.currentTime + duration);
  }

  function getLossStats() {
    const correctFlags = state.grid.filter((cell) => cell.mine && cell.flagged).length;
    const safeCells = state.rows * state.cols - state.mines;
    return [
      ["Final time", formatTimer(state.seconds)],
      ["Mines cleared", `${correctFlags}/${state.mines}`],
      ["Safe tiles opened", `${state.revealed}/${safeCells}`],
    ];
  }

  function openModal(title, message, type, stats = []) {
    setControlsDisabled(false);
    modalTitleEl.textContent = title;
    modalMessageEl.innerHTML = buildModalMessage(message, stats);
    modalIconEl.innerHTML = type === "win" ? icon.win : icon.mine;
    modalEl.hidden = false;
  }

  function closeModal() {
    modalEl.hidden = true;
  }

  function buildModalMessage(message, stats) {
    const statMarkup = stats.map(([label, value]) => (
      `<span class="modal-stat"><span>${label}</span><strong>${value}</strong></span>`
    )).join("");
    return `${message}${statMarkup ? `<span class="modal-stats">${statMarkup}</span>` : ""}`;
  }

  function setControlsDisabled(disabled) {
    restartButton.disabled = disabled;
    difficultyButtons.forEach((button) => {
      button.disabled = disabled;
    });
  }

  function restartWithAnimation() {
    gameCard.classList.add("restarting");
    setTimeout(() => gameCard.classList.remove("restarting"), 460);
    newGame();
  }

  function updateChromeIcons() {
    themeIconEl.innerHTML = document.body.classList.contains("light-mode") ? icon.sun : icon.moon;
    soundIconEl.innerHTML = state.soundEnabled ? icon.soundOn : icon.soundOff;
    document.querySelector(".restart-icon").innerHTML = icon.restart;
    document.querySelector("[data-guide-flag]").innerHTML = icon.flag;
    document.querySelector("[data-guide-mine]").innerHTML = icon.mine;
    document.querySelector("[data-guide-explosion]").innerHTML = icon.mine;
  }

  boardEl.addEventListener("click", (event) => {
    if (state.skipNextClick) {
      state.skipNextClick = false;
      return;
    }
    const cellEl = event.target.closest(".cell");
    if (!cellEl) return;
    revealCell(Number(cellEl.dataset.index));
  });

  boardEl.addEventListener("contextmenu", (event) => {
    const cellEl = event.target.closest(".cell");
    if (!cellEl) return;
    event.preventDefault();
    toggleFlag(Number(cellEl.dataset.index));
  });

  boardEl.addEventListener("pointerdown", (event) => {
    const cellEl = event.target.closest(".cell");
    if (!cellEl || event.pointerType === "mouse") return;
    state.longPressTimer = setTimeout(() => {
      toggleFlag(Number(cellEl.dataset.index));
      state.skipNextClick = true;
      state.longPressTimer = null;
    }, 480);
  });

  boardEl.addEventListener("pointerup", () => clearTimeout(state.longPressTimer));
  boardEl.addEventListener("pointerleave", () => clearTimeout(state.longPressTimer));

  difficultyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      difficultyButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      newGame(button.dataset.difficulty);
    });
  });

  restartButton.addEventListener("click", restartWithAnimation);
  modalRestartButton.addEventListener("click", restartWithAnimation);
  modalEl.addEventListener("click", (event) => {
    if (event.target === modalEl) closeModal();
  });

  soundToggle.addEventListener("click", () => {
    state.soundEnabled = !state.soundEnabled;
    localStorage.setItem("minesweeper-sound", state.soundEnabled ? "on" : "off");
    updateChromeIcons();
  });

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    localStorage.setItem("minesweeper-theme", document.body.classList.contains("light-mode") ? "light" : "dark");
    updateChromeIcons();
  });

  if (localStorage.getItem("minesweeper-theme") === "light") {
    document.body.classList.add("light-mode");
  }

  updateChromeIcons();
  newGame();
})();
