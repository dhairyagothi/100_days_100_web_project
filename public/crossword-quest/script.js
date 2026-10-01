// Game State & Globals
let currentPuzzle = null;
let currentGrid = []; // 2D grid matrix of cells
let activeCell = null; // {row, col}
let activeDirection = 'across'; // 'across' or 'down'
let timerInterval = null;
let secondsElapsed = 0;
let mistakesCount = 0;
let hintsUsedCount = 0;
let isPaused = false;
let userTheme = 'dark';
let soundEnabled = true;

// Multiplayer Race Variables
let isRaceMode = false;
let raceInterval = null;
let playerProgress = 0;
let botProgress = 0;
let botSpeed = 0.05; // speed increment percentage per second

// Statistics Database Mockup / LocalStorage Structure
let appStats = {
  solvedCount: 0,
  currentStreak: 0,
  bestTime: {}, // { puzzleId: seconds }
  totalPlayTime: 0, // seconds
  accuracySum: 0, // cumulative accuracy percentages
  accuracyCount: 0,
  hintsUsed: 0,
  solvedPuzzlesList: [], // array of solved puzzle IDs
  lastSolvedDate: null,
  localLibrary: [], // custom user puzzles
  leaderboardRecords: {
    easy: [
      { name: "GridMaster", time: 102, hints: 0, accuracy: 100 },
      { name: "LexiCon", time: 145, hints: 1, accuracy: 95 },
      { name: "Puzzler", time: 210, hints: 2, accuracy: 90 }
    ],
    medium: [
      { name: "Enigma", time: 240, hints: 1, accuracy: 97 },
      { name: "CrosswordPro", time: 310, hints: 0, accuracy: 100 },
      { name: "WordSmith", time: 395, hints: 3, accuracy: 88 }
    ],
    hard: [
      { name: "Cruciverbalist", time: 540, hints: 0, accuracy: 100 },
      { name: "Cipher", time: 680, hints: 2, accuracy: 94 },
      { name: "Logician", time: 820, hints: 4, accuracy: 85 }
    ]
  }
};

// Achievements Badges List
const ACHIEVEMENTS_LIST = [
  { id: 'first_solve', title: 'First Crossword', desc: 'Successfully solve your first crossword puzzle!', icon: '🏆' },
  { id: 'streak_7', title: '7-Day Streak', desc: 'Solve daily challenges for 7 consecutive days!', icon: '🔥' },
  { id: 'no_hints', title: 'Solve Without Hints', desc: 'Solve any medium or hard puzzle without using any hints!', icon: '⚡' },
  { id: 'master', title: 'Crossword Master', desc: 'Solve 10 distinct puzzles from categories.', icon: '🧠' },
  { id: 'century', title: '100 Crosswords Solved', desc: 'Reach 100 completed crossword puzzles.', icon: '⭐' },
  { id: 'perfect', title: 'Perfect Accuracy', desc: 'Solve a puzzle with 100% accuracy and no mistakes!', icon: '🎯' }
];

let unlockedAchievements = [];

// Audio Synthesizer Context
let audioCtx = null;

// Initialize Web Audio Context
function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

// Play Sound Effect using Web Audio Synth
function playSound(type) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'success') {
      osc.type = 'sine';
      // Arpeggio
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.setValueAtTime(0.15, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(100, now + 0.25);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'fanfare') {
      // Fun win chords
      const notes = [261.63, 329.63, 392.00, 523.25]; // C chord
      notes.forEach((freq, index) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'triangle';
        o.frequency.setValueAtTime(freq, now + index * 0.1);
        o.frequency.exponentialRampToValueAtTime(freq * 2, now + 0.4 + index * 0.1);
        o.connect(g);
        g.connect(ctx.destination);
        g.gain.setValueAtTime(0.08, now + index * 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.8 + index * 0.1);
        o.start(now + index * 0.1);
        o.stop(now + 0.8 + index * 0.1);
      });
    }
  } catch (e) {
    console.warn("Audio Context blocked or unsupported:", e);
  }
}

// Load Stats & Saved progress from local storage
function loadFromLocalStorage() {
  const savedStats = localStorage.getItem('crossword_quest_stats');
  if (savedStats) {
    try {
      appStats = { ...appStats, ...JSON.parse(savedStats) };
    } catch (e) {
      console.error("Failed loading stats:", e);
    }
  }

  const savedAchievements = localStorage.getItem('crossword_quest_achievements');
  if (savedAchievements) {
    try {
      unlockedAchievements = JSON.parse(savedAchievements);
    } catch (e) {
      unlockedAchievements = [];
    }
  }

  const savedTheme = localStorage.getItem('crossword_quest_theme');
  if (savedTheme) {
    userTheme = savedTheme;
    document.documentElement.setAttribute('data-theme', userTheme);
  }
}

// Save stats to localStorage
function saveStats() {
  localStorage.setItem('crossword_quest_stats', JSON.stringify(appStats));
}

// Save achievements to localStorage
function saveAchievements() {
  localStorage.setItem('crossword_quest_achievements', JSON.stringify(unlockedAchievements));
}

// Global Init on Load
document.addEventListener("DOMContentLoaded", () => {
  loadFromLocalStorage();
  setupThemeDropdown();
  setupAudioBtn();
  setupNavTabs();
  setupHintDropdown();
  initDailyCountdown();
  renderAchievements();
  updateDashboardStats();
  loadPuzzleDatabase();

  // Try loading auto-save if exists
  const autoSaved = localStorage.getItem('crossword_quest_autosave');
  if (autoSaved) {
    try {
      const data = JSON.parse(autoSaved);
      loadPuzzle(data.puzzle, false);
      // Restore grid entries
      data.entries.forEach(e => {
        if (currentGrid[e.row] && currentGrid[e.row][e.col] && currentGrid[e.row][e.col].playable) {
          currentGrid[e.row][e.col].value = e.val;
          const input = document.querySelector(`.grid-cell[data-row="${e.row}"][data-col="${e.col}"] .cell-input`);
          if (input) input.value = e.val;
        }
      });
      secondsElapsed = data.time || 0;
      mistakesCount = data.mistakes || 0;
      hintsUsedCount = data.hints || 0;
      updateStatsUI();
      switchTab('game');
    } catch (err) {
      console.warn("Could not reload autosaved puzzle:", err);
    }
  }
});

// Setup Navigation Tabs
function setupNavTabs() {
  document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      const tabId = item.getAttribute("data-tab");
      switchTab(tabId);
    });
  });
}

function switchTab(tabId) {
  document.querySelectorAll(".tab-panel").forEach(panel => {
    panel.classList.remove("active");
  });
  const activePanel = document.getElementById(`tab-${tabId}`);
  if (activePanel) {
    activePanel.classList.add("active");
  }

  // Re-adjust nav items if clicked outside sidebar
  document.querySelectorAll(".nav-item").forEach(i => {
    if (i.getAttribute("data-tab") === tabId) {
      i.classList.add("active");
    } else {
      i.classList.remove("active");
    }
  });

  // Specific triggers
  if (tabId === 'stats') {
    renderStatsCharts();
  } else if (tabId === 'leaderboard') {
    renderLeaderboard();
  }
}

// Setup Theme Picker
function setupThemeDropdown() {
  setTheme('light');
}

function setTheme(theme) {
  userTheme = 'light';
  document.documentElement.setAttribute('data-theme', 'light');
  localStorage.setItem('crossword_quest_theme', 'light');
}

// Setup Audio Buttons
function setupAudioBtn() {
  const btn = document.getElementById("audio-toggle-btn");
  const icon = document.getElementById("audio-icon");

  // Restore
  const saved = localStorage.getItem('crossword_quest_audio');
  if (saved !== null) {
    soundEnabled = saved === 'true';
  }

  updateAudioIcon();

  btn.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem('crossword_quest_audio', soundEnabled);
    updateAudioIcon();
    playSound('click');
  });
}

function updateAudioIcon() {
  const icon = document.getElementById("audio-icon");
  if (soundEnabled) {
    icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 18.75V5.25L7.75 9H4.5v6h3.25L12 18.75z" />';
  } else {
    icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" stroke-width="2" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />';
  }
}

// Setup Hints Menu Dropdown
function setupHintDropdown() {
  const btn = document.getElementById("hint-dropdown-btn");
  const menu = document.getElementById("hint-menu");

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("hidden");
  });

  document.addEventListener("click", () => {
    menu.classList.add("hidden");
  });
}

// Daily Challenge Countdown
function initDailyCountdown() {
  const countdownEl = document.getElementById("daily-countdown");
  const streakValEl = document.getElementById("daily-streak-val");
  const headerStreakEl = document.getElementById("header-streak");

  // Set streak values
  streakValEl.textContent = `🔥 ${appStats.currentStreak}`;
  headerStreakEl.textContent = `🔥 ${appStats.currentStreak}`;

  setInterval(() => {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const diff = tomorrow - now; // ms

    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    countdownEl.textContent = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, 1000);
}

// Puzzle Database & Loading Setup
let puzzleDatabase = [];

function loadPuzzleDatabase() {
  // We fetch easy, medium, hard, and programming JSON assets
  const easyPromise = fetch('data/easy.json').then(r => r.json()).catch(() => []);
  const mediumPromise = fetch('data/medium.json').then(r => r.json()).catch(() => []);
  const hardPromise = fetch('data/hard.json').then(r => r.json()).catch(() => []);
  const progPromise = fetch('data/programming.json').then(r => r.json()).catch(() => []);

  Promise.all([easyPromise, mediumPromise, hardPromise, progPromise]).then(results => {
    // Combine arrays
    let combined = results.flat();
    if (combined.length === 0 && typeof DEFAULT_PUZZLES !== 'undefined') {
      combined = DEFAULT_PUZZLES;
    }
    puzzleDatabase = combined;
    renderPuzzleList();
    renderCommunityLibrary();
  }).catch(err => {
    console.error("Error loading crossword databases:", err);
    if (typeof DEFAULT_PUZZLES !== 'undefined') {
      puzzleDatabase = DEFAULT_PUZZLES;
      renderPuzzleList();
      renderCommunityLibrary();
    }
  });
}

// Filter and render list of puzzles
let activeDifficultyFilter = 'all';

function setDifficultyFilter(diff, element) {
  activeDifficultyFilter = diff;
  document.querySelectorAll(".filter-chips .chip").forEach(c => c.classList.remove("active"));
  element.classList.add("active");
  renderPuzzleList();
}

function filterPuzzles() {
  renderPuzzleList();
}

function renderPuzzleList() {
  const container = document.getElementById("puzzles-container");
  const searchVal = document.getElementById("puzzle-search").value.toLowerCase();

  container.innerHTML = "";

  const filtered = puzzleDatabase.filter(p => {
    if (activeDifficultyFilter !== 'all' && p.difficulty !== activeDifficultyFilter) return false;
    if (searchVal && !p.category.toLowerCase().includes(searchVal) && !p.title.toLowerCase().includes(searchVal)) return false;
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="grid-preview-placeholder">No matching puzzles found. Try typing another category!</div>`;
    return;
  }

  filtered.forEach(p => {
    const card = document.createElement("div");
    card.className = "puzzle-card glass-card";

    const isSolved = appStats.solvedPuzzlesList.includes(p.id);
    const progressPercent = isSolved ? 100 : 0; // Simple binary representation, or actual percentage if partially saved

    card.innerHTML = `
      <div class="puzzle-meta">
        <span class="badge">${p.difficulty}</span>
        <span class="badge category-badge">${p.category}</span>
      </div>
      <div class="puzzle-info">
        <h3>${p.title}</h3>
        <div class="puzzle-progress-bar">
          <div class="puzzle-progress-fill" style="width: ${progressPercent}%"></div>
        </div>
      </div>
      <div class="puzzle-footer">
        <span>🧩 Size: ${p.gridSize}x${p.gridSize}</span>
        <button class="btn btn-secondary" onclick="loadPuzzleById('${p.id}')">
          ${isSolved ? 'Solve Again' : 'Play Grid'}
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

// Fetch puzzle details from ID and load to board
function loadPuzzleById(id) {
  // Find in pack or local community
  let p = puzzleDatabase.find(x => x.id === id);
  if (!p) {
    p = appStats.localLibrary.find(x => x.id === id);
  }

  if (p) {
    loadPuzzle(p);
  }
}

// Load a specific Daily challenge seed
function loadDailyChallenge() {
  // Select daily crossword based on today's calendar date seed
  const today = new Date();
  const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

  if (puzzleDatabase.length === 0) return;

  // Pick an index from database based on date seed
  const index = dateSeed % puzzleDatabase.length;
  const p = puzzleDatabase[index];

  // Make a clone with a daily ID
  const dailyPuzzle = {
    ...p,
    id: `daily_${dateSeed}`,
    title: `Daily Challenge - ${today.toLocaleDateString()}`
  };

  loadPuzzle(dailyPuzzle);
}

// Game Solver & Navigation Engine
function loadPuzzle(puzzle, resetStats = true) {
  currentPuzzle = puzzle;

  // Switch to game tab
  switchTab('game');

  // Title displays
  document.getElementById("game-puzzle-title").textContent = puzzle.title;
  document.getElementById("game-puzzle-difficulty").textContent = puzzle.difficulty;
  document.getElementById("game-puzzle-category").textContent = puzzle.category;

  // Initialize Core Grid Matrix
  const size = puzzle.gridSize;
  currentGrid = Array(size).fill(null).map(() => Array(size).fill(null).map(() => ({
    playable: false,
    correctChar: '',
    value: '',
    number: 0,
    acrossClue: null,
    downClue: null
  })));

  // Populate Characters & Clue mappings from crossword descriptors
  puzzle.clues.across.forEach(c => {
    for (let i = 0; i < c.answer.length; i++) {
      const cell = currentGrid[c.row][c.col + i];
      cell.playable = true;
      cell.correctChar = c.answer[i].toUpperCase();
      if (i === 0) cell.number = c.number;
      cell.acrossClue = c;
    }
  });

  puzzle.clues.down.forEach(c => {
    for (let i = 0; i < c.answer.length; i++) {
      const cell = currentGrid[c.row + i][c.col];
      cell.playable = true;
      cell.correctChar = c.answer[i].toUpperCase();
      if (i === 0) cell.number = c.number;
      cell.downClue = c;
    }
  });

  // Render Grid elements
  renderGameBoard();
  renderCluesPanel();

  // Reset Game variables
  if (resetStats) {
    secondsElapsed = 0;
    mistakesCount = 0;
    hintsUsedCount = 0;
    isPaused = false;
    updateStatsUI();
  }

  // Start Game Timer
  startTimer();

  // Focus on the first playable cell
  focusFirstCell();

  // Set visual multiplayer race tracking default off
  document.getElementById("race-progress").classList.add("hidden");
  isRaceMode = false;
  if (raceInterval) clearInterval(raceInterval);
}

function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!isPaused) {
      secondsElapsed++;
      updateTimerDisplay();

      // Auto-save progress every 5 seconds
      if (secondsElapsed % 5 === 0) {
        autoSaveProgress();
      }
    }
  }, 1000);
}

function updateTimerDisplay() {
  const mins = Math.floor(secondsElapsed / 60);
  const secs = secondsElapsed % 60;
  document.getElementById("game-timer").textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function updateStatsUI() {
  document.getElementById("game-mistakes").textContent = mistakesCount;
  document.getElementById("game-hints-used").textContent = hintsUsedCount;
}

// Render Grid Game Elements to DOM
function renderGameBoard() {
  const container = document.getElementById("grid-container");
  container.innerHTML = "";

  const size = currentPuzzle.gridSize;
  container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cellData = currentGrid[r][c];
      const cellEl = document.createElement("div");
      cellEl.className = "grid-cell";
      cellEl.setAttribute("data-row", r);
      cellEl.setAttribute("data-col", c);

      if (cellData.playable) {
        cellEl.classList.add("playable");

        // Render clue number label
        if (cellData.number > 0) {
          const numEl = document.createElement("span");
          numEl.className = "cell-number";
          numEl.textContent = cellData.number;
          cellEl.appendChild(numEl);
        }

        // Render input text element
        const input = document.createElement("input");
        input.className = "cell-input";
        input.type = "text";
        input.maxLength = 1;
        input.value = cellData.value;
        input.setAttribute("autocomplete", "off");
        input.setAttribute("spellcheck", "false");

        // Event listeners
        input.addEventListener("focus", () => handleCellFocus(r, c));
        input.addEventListener("click", () => handleCellFocus(r, c));
        input.addEventListener("input", (e) => handleCellInput(r, c, e));
        input.addEventListener("keydown", (e) => handleCellKeyDown(r, c, e));

        cellEl.appendChild(input);
      } else {
        cellEl.classList.add("blocked");
      }

      container.appendChild(cellEl);
    }
  }
}

// Render active Across & Down text clues lists
function renderCluesPanel() {
  const acrossContainer = document.getElementById("clues-across");
  const downContainer = document.getElementById("clues-down");

  acrossContainer.replaceChildren();
  downContainer.replaceChildren();

  currentPuzzle.clues.across.forEach(c => {
    const div = document.createElement("div");
    div.className = "clue-item";
    div.id = `clue-across-${c.number}`;
    const numberSpan = document.createElement("span");
    numberSpan.className = "clue-number";
    numberSpan.textContent = `${c.number}.`;

    const clueSpan = document.createElement("span");
    clueSpan.className = "clue-text";
    clueSpan.textContent = c.clue;

    div.replaceChildren(numberSpan, document.createTextNode(" "), clueSpan); div.addEventListener("click", () => handleClueClick(c, 'across'));
    acrossContainer.appendChild(div);
  });

  currentPuzzle.clues.down.forEach((c) => {
    const div = document.createElement("div");
    div.className = "clue-item";
    div.id = `clue-down-${c.number}`;

    const numberSpan = document.createElement("span");
    numberSpan.className = "clue-number";
    numberSpan.textContent = `${c.number}.`;

    const clueSpan = document.createElement("span");
    clueSpan.className = "clue-text";
    clueSpan.textContent = c.clue;

    div.replaceChildren(numberSpan, document.createTextNode(" "), clueSpan);
    div.addEventListener("click", () => handleClueClick(c, "down"));
    downContainer.appendChild(div);
  });
}

// Focus helpers
function focusFirstCell() {
  for (let r = 0; r < currentPuzzle.gridSize; r++) {
    for (let c = 0; c < currentPuzzle.gridSize; c++) {
      if (currentGrid[r][c].playable) {
        const input = document.querySelector(`.grid-cell[data-row="${r}"][data-col="${c}"] .cell-input`);
        if (input) {
          input.focus();
          return;
        }
      }
    }
  }
}

// Handle focus updates and active highlighting
function handleCellFocus(row, col) {
  if (isPaused) return;

  const cell = currentGrid[row][col];
  if (!cell.playable) return;

  activeCell = { row, col };

  // Set active direction based on available clues (toggle if both are available, defaults to across)
  if (cell.acrossClue && cell.downClue) {
    // Keep current direction if both exist, otherwise default to across
  } else if (cell.acrossClue) {
    activeDirection = 'across';
  } else if (cell.downClue) {
    activeDirection = 'down';
  }

  updateHighlights();
  playSound('click');
}

// Toggle direction on double click/tab or pressing space
function toggleActiveDirection() {
  if (!activeCell) return;
  const cell = currentGrid[activeCell.row][activeCell.col];
  if (cell.acrossClue && cell.downClue) {
    activeDirection = activeDirection === 'across' ? 'down' : 'across';
    updateHighlights();
  }
}

// Calculate highlight tags for board grid
function updateHighlights() {
  // Clear previous highlights
  document.querySelectorAll(".grid-cell").forEach(cell => {
    cell.classList.remove("active-focus", "highlight-word", "highlight-intersect");
  });
  document.querySelectorAll(".clue-item").forEach(item => {
    item.classList.remove("active");
  });

  if (!activeCell) return;

  const currentClue = activeDirection === 'across' ? currentGrid[activeCell.row][activeCell.col].acrossClue : currentGrid[activeCell.row][activeCell.col].downClue;
  const altClue = activeDirection === 'across' ? currentGrid[activeCell.row][activeCell.col].downClue : currentGrid[activeCell.row][activeCell.col].acrossClue;

  // Highlight input focus
  const activeCellEl = document.querySelector(`.grid-cell[data-row="${activeCell.row}"][data-col="${activeCell.col}"]`);
  if (activeCellEl) activeCellEl.classList.add("active-focus");

  // Highlight word cells in main direction
  if (currentClue) {
    const clueId = `clue-${activeDirection}-${currentClue.number}`;
    const clueEl = document.getElementById(clueId);
    if (clueEl) {
      clueEl.classList.add("active");
      clueEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Color active cells
    const len = currentClue.answer.length;
    for (let i = 0; i < len; i++) {
      const r = activeDirection === 'across' ? currentClue.row : currentClue.row + i;
      const c = activeDirection === 'across' ? currentClue.col + i : currentClue.col;
      const cellEl = document.querySelector(`.grid-cell[data-row="${r}"][data-col="${c}"]`);
      if (cellEl && !(r === activeCell.row && c === activeCell.col)) {
        cellEl.classList.add("highlight-word");
      }
    }
  }

  // Highlight intersecting cell clues
  if (altClue) {
    const len = altClue.answer.length;
    for (let i = 0; i < len; i++) {
      const r = activeDirection === 'across' ? altClue.row + i : altClue.row;
      const c = activeDirection === 'across' ? altClue.col : altClue.col + i;
      const cellEl = document.querySelector(`.grid-cell[data-row="${r}"][data-col="${c}"]`);
      if (cellEl && !(r === activeCell.row && c === activeCell.col)) {
        cellEl.classList.add("highlight-intersect");
      }
    }
  }
}

// Click clue sidebar cycles focus to grid
function handleClueClick(clue, direction) {
  activeDirection = direction;
  activeCell = { row: clue.row, col: clue.col };

  const input = document.querySelector(`.grid-cell[data-row="${clue.row}"][data-col="${clue.col}"] .cell-input`);
  if (input) {
    input.focus();
  }
  updateHighlights();
}

// Handle letter entries
function handleCellInput(row, col, event) {
  if (isPaused) return;

  const val = event.target.value.toUpperCase();
  currentGrid[row][col].value = val;

  // Visual cues: clear any errors/correct markings on change
  const cellEl = document.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
  if (cellEl) cellEl.classList.remove("error-mark", "correct-mark");

  if (val.length > 0) {
    moveFocus(1); // Go forward
    checkWinCondition();
  }
}

// Shift keyboard focus based on typing directions
function moveFocus(offset) {
  if (!activeCell) return;
  const currentClue = activeDirection === 'across' ? currentGrid[activeCell.row][activeCell.col].acrossClue : currentGrid[activeCell.row][activeCell.col].downClue;

  if (!currentClue) return;

  const row = activeCell.row;
  const col = activeCell.col;
  let nextRow = row;
  let nextCol = col;

  if (activeDirection === 'across') {
    nextCol = col + offset;
    // Check if next column fits inside current word bounds
    if (nextCol < currentClue.col || nextCol >= currentClue.col + currentClue.answer.length) {
      return; // Stop at bounds
    }
  } else {
    nextRow = row + offset;
    // Check if next row fits inside current word bounds
    if (nextRow < currentClue.row || nextRow >= currentClue.row + currentClue.answer.length) {
      return; // Stop at bounds
    }
  }

  const nextInput = document.querySelector(`.grid-cell[data-row="${nextRow}"][data-col="${nextCol}"] .cell-input`);
  if (nextInput) {
    nextInput.focus();
  }
}

// Handle Keyboard Navigation & Shortcuts
function handleCellKeyDown(row, col, event) {
  if (isPaused) return;

  const key = event.key;

  if (key === 'ArrowRight') {
    event.preventDefault();
    moveGridSelection(0, 1);
  } else if (key === 'ArrowLeft') {
    event.preventDefault();
    moveGridSelection(0, -1);
  } else if (key === 'ArrowUp') {
    event.preventDefault();
    moveGridSelection(-1, 0);
  } else if (key === 'ArrowDown') {
    event.preventDefault();
    moveGridSelection(1, 0);
  } else if (key === 'Backspace') {
    event.preventDefault();
    if (currentGrid[row][col].value !== '') {
      currentGrid[row][col].value = '';
      event.target.value = '';
      const cellEl = document.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
      if (cellEl) cellEl.classList.remove("error-mark", "correct-mark");
      moveFocus(-1);
    } else {
      moveFocus(-1);
      if (activeCell) {
        currentGrid[activeCell.row][activeCell.col].value = '';
        const prevInput = document.querySelector(`.grid-cell[data-row="${activeCell.row}"][data-col="${activeCell.col}"] .cell-input`);
        if (prevInput) prevInput.value = '';
        const cellEl = document.querySelector(`.grid-cell[data-row="${activeCell.row}"][data-col="${activeCell.col}"]`);
        if (cellEl) cellEl.classList.remove("error-mark", "correct-mark");
      }
    }
  } else if (key === 'Delete') {
    currentGrid[row][col].value = '';
    event.target.value = '';
    const cellEl = document.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
    if (cellEl) cellEl.classList.remove("error-mark", "correct-mark");
  } else if (key === 'Tab') {
    // Cycle clues / Directions
    event.preventDefault();
    toggleActiveDirection();
  } else if (key === ' ') {
    event.preventDefault();
    toggleActiveDirection();
  } else if (/^[a-zA-Z]$/.test(key)) {
    // Intercept normal letter typing to handle overwrite cleanly
    event.preventDefault();
    const upperKey = key.toUpperCase();
    currentGrid[row][col].value = upperKey;
    event.target.value = upperKey;
    const cellEl = document.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
    if (cellEl) cellEl.classList.remove("error-mark", "correct-mark");
    moveFocus(1);
    checkWinCondition();
  }
}

// Navigate selection grid around boundaries
function moveGridSelection(rowDelta, colDelta) {
  if (!activeCell) return;
  const size = currentPuzzle.gridSize;
  let r = activeCell.row;
  let c = activeCell.col;

  while (true) {
    r += rowDelta;
    c += colDelta;

    if (r < 0 || r >= size || c < 0 || c >= size) return; // boundary hit

    if (currentGrid[r][c].playable) {
      const input = document.querySelector(`.grid-cell[data-row="${r}"][data-col="${c}"] .cell-input`);
      if (input) {
        input.focus();
        return;
      }
    }
  }
}

// Pause/Resume Logic
function togglePause() {
  isPaused = !isPaused;
  const modal = document.getElementById("pause-modal");
  const pauseBtn = document.getElementById("pause-btn");

  if (isPaused) {
    modal.classList.remove("hidden");
    pauseBtn.innerHTML = `
      <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    `;
    playSound('click');
  } else {
    modal.classList.add("hidden");
    pauseBtn.innerHTML = `
      <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    `;
    playSound('click');
    focusFirstCell();
  }
}

// Restart Puzzle progress
function restartCurrentPuzzle() {
  if (!currentPuzzle) return;
  playSound('click');

  for (let r = 0; r < currentPuzzle.gridSize; r++) {
    for (let c = 0; c < currentPuzzle.gridSize; c++) {
      if (currentGrid[r][c].playable) {
        currentGrid[r][c].value = '';
        const input = document.querySelector(`.grid-cell[data-row="${r}"][data-col="${c}"] .cell-input`);
        if (input) input.value = '';
        const cellEl = document.querySelector(`.grid-cell[data-row="${r}"][data-col="${c}"]`);
        cellEl.className = "grid-cell playable";
      }
    }
  }

  secondsElapsed = 0;
  mistakesCount = 0;
  hintsUsedCount = 0;
  updateStatsUI();
  focusFirstCell();
}

// Validation checking
function checkCurrentAnswers() {
  playSound('click');
  let mistakesMade = false;

  for (let r = 0; r < currentPuzzle.gridSize; r++) {
    for (let c = 0; c < currentPuzzle.gridSize; c++) {
      const cell = currentGrid[r][c];
      if (cell.playable && cell.value.length > 0) {
        const cellEl = document.querySelector(`.grid-cell[data-row="${r}"][data-col="${c}"]`);
        if (cell.value.toUpperCase() === cell.correctChar) {
          cellEl.classList.add("correct-mark");
          cellEl.classList.remove("error-mark");
        } else {
          cellEl.classList.add("error-mark");
          cellEl.classList.remove("correct-mark");
          mistakesCount++;
          mistakesMade = true;
        }
      }
    }
  }

  updateStatsUI();
  if (mistakesMade) {
    playSound('error');
  } else {
    playSound('success');
  }

  checkWinCondition();
}

// Auto-save logic
function autoSaveProgress() {
  if (!currentPuzzle || isPaused || isRaceMode) return;

  const entries = [];
  for (let r = 0; r < currentPuzzle.gridSize; r++) {
    for (let c = 0; c < currentPuzzle.gridSize; c++) {
      if (currentGrid[r][c].playable && currentGrid[r][c].value) {
        entries.push({ row: r, col: c, val: currentGrid[r][c].value });
      }
    }
  }

  const payload = {
    puzzle: currentPuzzle,
    entries: entries,
    time: secondsElapsed,
    mistakes: mistakesCount,
    hints: hintsUsedCount
  };

  localStorage.setItem('crossword_quest_autosave', JSON.stringify(payload));
}

// Hint System implementation
function revealLetter() {
  if (!activeCell) return;
  const cell = currentGrid[activeCell.row][activeCell.col];
  if (cell.playable) {
    cell.value = cell.correctChar;
    const input = document.querySelector(`.grid-cell[data-row="${activeCell.row}"][data-col="${activeCell.col}"] .cell-input`);
    if (input) input.value = cell.correctChar;

    // Clear marks and mark correct
    const cellEl = document.querySelector(`.grid-cell[data-row="${activeCell.row}"][data-col="${activeCell.col}"]`);
    cellEl.className = "grid-cell playable correct-mark";

    hintsUsedCount++;
    updateStatsUI();
    playSound('success');
    checkWinCondition();
  }
}

function revealWord() {
  if (!activeCell) return;
  const cell = currentGrid[activeCell.row][activeCell.col];
  const clue = activeDirection === 'across' ? cell.acrossClue : cell.downClue;

  if (!clue) return;

  for (let i = 0; i < clue.answer.length; i++) {
    const r = activeDirection === 'across' ? clue.row : clue.row + i;
    const c = activeDirection === 'across' ? clue.col + i : clue.col;

    const targetCell = currentGrid[r][c];
    targetCell.value = targetCell.correctChar;

    const input = document.querySelector(`.grid-cell[data-row="${r}"][data-col="${c}"] .cell-input`);
    if (input) input.value = targetCell.correctChar;

    const cellEl = document.querySelector(`.grid-cell[data-row="${r}"][data-col="${c}"]`);
    cellEl.className = "grid-cell playable correct-mark";
  }

  hintsUsedCount += 3;
  updateStatsUI();
  playSound('success');
  checkWinCondition();
}

function revealPuzzle() {
  playSound('click');
  for (let r = 0; r < currentPuzzle.gridSize; r++) {
    for (let c = 0; c < currentPuzzle.gridSize; c++) {
      const cell = currentGrid[r][c];
      if (cell.playable) {
        cell.value = cell.correctChar;
        const input = document.querySelector(`.grid-cell[data-row="${r}"][data-col="${c}"] .cell-input`);
        if (input) input.value = cell.correctChar;
        const cellEl = document.querySelector(`.grid-cell[data-row="${r}"][data-col="${c}"]`);
        cellEl.className = "grid-cell playable correct-mark";
      }
    }
  }

  hintsUsedCount += 10;
  updateStatsUI();
  playSound('success');
  checkWinCondition();
}

// Win Detection & Completion celebration
function checkWinCondition() {
  let isComplete = true;
  let correctCount = 0;
  let totalPlayable = 0;

  for (let r = 0; r < currentPuzzle.gridSize; r++) {
    for (let c = 0; c < currentPuzzle.gridSize; c++) {
      const cell = currentGrid[r][c];
      if (cell.playable) {
        totalPlayable++;
        if (cell.value.toUpperCase() === cell.correctChar) {
          correctCount++;
        } else {
          isComplete = false;
        }
      }
    }
  }

  // Update multiplayer progress if in race mode
  if (isRaceMode) {
    playerProgress = totalPlayable > 0 ? (correctCount / totalPlayable) * 100 : 0;
    updateRaceProgressUI();
  }

  if (isComplete) {
    handleVictory(correctCount, totalPlayable);
  }
}

function handleVictory(correctCount, totalPlayable) {
  if (timerInterval) clearInterval(timerInterval);
  if (raceInterval) clearInterval(raceInterval);

  playSound('fanfare');

  // Confetti burst
  try {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
  } catch (e) { }

  // Save records and stats
  const accuracy = Math.round((correctCount / (correctCount + mistakesCount)) * 100) || 0;

  // Record solve details in history
  appStats.solvedCount++;

  // Manage Streak
  const todayStr = new Date().toDateString();
  if (appStats.lastSolvedDate) {
    const lastDate = new Date(appStats.lastSolvedDate);
    const diffTime = Math.abs(new Date(todayStr) - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      appStats.currentStreak++;
    } else if (diffDays > 1) {
      appStats.currentStreak = 1;
    }
  } else {
    appStats.currentStreak = 1;
  }
  appStats.lastSolvedDate = todayStr;

  // Best Time updating
  if (!appStats.bestTime[currentPuzzle.id] || secondsElapsed < appStats.bestTime[currentPuzzle.id]) {
    appStats.bestTime[currentPuzzle.id] = secondsElapsed;
  }

  appStats.totalPlayTime += secondsElapsed;
  appStats.accuracySum += accuracy;
  appStats.accuracyCount++;
  appStats.hintsUsed += hintsUsedCount;

  if (!appStats.solvedPuzzlesList.includes(currentPuzzle.id)) {
    appStats.solvedPuzzlesList.push(currentPuzzle.id);
  }

  saveStats();

  // Award Check Achievements
  const unlockedNow = checkAchievementsAwards(accuracy);

  // Clear Auto-save since solved
  localStorage.removeItem('crossword_quest_autosave');

  // Trigger Victory Modal overlay
  const mins = Math.floor(secondsElapsed / 60);
  const secs = secondsElapsed % 60;

  document.getElementById("victory-puzzle-title").textContent = currentPuzzle.title;
  document.getElementById("victory-time").textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  document.getElementById("victory-mistakes").textContent = mistakesCount;
  document.getElementById("victory-hints").textContent = hintsUsedCount;
  document.getElementById("victory-accuracy").textContent = `${accuracy}%`;

  const unlockedContainer = document.getElementById("victory-achievements");
  unlockedContainer.innerHTML = "";

  unlockedNow.forEach(ach => {
    const card = document.createElement("div");
    card.className = "unlock-announce-card";
    card.innerHTML = `
      <div class="icon">${ach.icon}</div>
      <div>
        <h4>Badge Unlocked!</h4>
        <p><strong>${ach.title}</strong> - ${ach.desc}</p>
      </div>
    `;
    unlockedContainer.appendChild(card);
  });

  // Display modal
  document.getElementById("victory-modal").classList.remove("hidden");

  // Refresh UI dashboards
  updateDashboardStats();
  renderAchievements();
}

function closeVictoryModal() {
  document.getElementById("victory-modal").classList.add("hidden");
  switchTab('dashboard');
}

// Achievements checker
function checkAchievementsAwards(accuracy) {
  const newlyUnlocked = [];

  function unlock(id) {
    if (!unlockedAchievements.includes(id)) {
      unlockedAchievements.push(id);
      newlyUnlocked.push(ACHIEVEMENTS_LIST.find(a => a.id === id));
    }
  }

  // 1. First solve
  if (appStats.solvedCount >= 1) unlock('first_solve');

  // 2. 7-Day streak
  if (appStats.currentStreak >= 7) unlock('streak_7');

  // 3. Perfect solve (100% accuracy, no mistakes, no hints)
  if (accuracy === 100 && mistakesCount === 0 && hintsUsedCount === 0) unlock('perfect');

  // 4. Solve without hints on medium or hard
  if (hintsUsedCount === 0 && (currentPuzzle.difficulty === 'medium' || currentPuzzle.difficulty === 'hard')) {
    unlock('no_hints');
  }

  // 5. Crossword Master (10 distinct solved)
  if (appStats.solvedPuzzlesList.length >= 10) unlock('master');

  // 6. 100 Solved
  if (appStats.solvedPuzzlesList.length >= 100) unlock('century');

  if (newlyUnlocked.length > 0) {
    saveAchievements();
  }

  return newlyUnlocked;
}

// Render badges UI
function renderAchievements() {
  const container = document.getElementById("badges-container");
  if (!container) return;
  container.innerHTML = "";

  ACHIEVEMENTS_LIST.forEach(ach => {
    const unlocked = unlockedAchievements.includes(ach.id);
    const card = document.createElement("div");
    card.className = `badge-card glass-card ${unlocked ? 'unlocked' : ''}`;

    card.innerHTML = `
      <div class="badge-icon">${ach.icon}</div>
      <div class="badge-details">
        <h3>${ach.title}</h3>
        <p>${ach.desc}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

// Update dashboard numeric indicators
function updateDashboardStats() {
  document.getElementById("dash-solved").textContent = appStats.solvedCount;

  const avgAcc = appStats.accuracyCount > 0 ? Math.round(appStats.accuracySum / appStats.accuracyCount) : 0;
  document.getElementById("dash-accuracy").textContent = `${avgAcc}%`;

  const totalMins = Math.round(appStats.totalPlayTime / 60);
  document.getElementById("dash-total-time").textContent = `${totalMins}m`;

  const streakValEl = document.getElementById("daily-streak-val");
  const headerStreakEl = document.getElementById("header-streak");
  if (streakValEl) streakValEl.textContent = `🔥 ${appStats.currentStreak}`;
  if (headerStreakEl) headerStreakEl.textContent = `🔥 ${appStats.currentStreak}`;
}

// Multiplayer race simulation
function startMultiplayerRace() {
  if (puzzleDatabase.length === 0) return;

  // Switch to board, select a random puzzle
  const randIndex = Math.floor(Math.random() * puzzleDatabase.length);
  const p = puzzleDatabase[randIndex];

  loadPuzzle(p);

  // Set race parameters
  isRaceMode = true;
  playerProgress = 0;
  botProgress = 0;

  // Random bot speed coefficient (completes in roughly 120-240 seconds)
  botSpeed = 0.2 + Math.random() * 0.3; // percent step per tick

  document.getElementById("race-progress").classList.remove("hidden");
  updateRaceProgressUI();

  if (raceInterval) clearInterval(raceInterval);

  raceInterval = setInterval(() => {
    if (!isPaused) {
      // Advance bot slowly
      botProgress += botSpeed;
      if (botProgress >= 100) {
        botProgress = 100;
        handleBotVictory();
      }
      updateRaceProgressUI();
    }
  }, 1000);
}

function updateRaceProgressUI() {
  document.getElementById("player-progress-fill").style.width = `${playerProgress}%`;
  document.getElementById("player-percent").textContent = `${Math.round(playerProgress)}%`;

  document.getElementById("bot-progress-fill").style.width = `${botProgress}%`;
  document.getElementById("bot-percent").textContent = `${Math.round(botProgress)}%`;
}

function handleBotVictory() {
  if (raceInterval) clearInterval(raceInterval);
  if (timerInterval) clearInterval(timerInterval);

  playSound('error');
  alert("🤖 The Bot has completed the puzzle first! Better speed next race!");

  isRaceMode = false;
  document.getElementById("race-progress").classList.add("hidden");
  switchTab('dashboard');
}

// PDF Exporter integration
function downloadPDF() {
  playSound('click');
  const { jsPDF } = window.jspdf;
  const boardArea = document.getElementById("printable-board-area");

  html2canvas(boardArea, { backgroundColor: null }).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Add header title
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.text(currentPuzzle.title, 20, 25);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.text(`Difficulty: ${currentPuzzle.difficulty}  |  Category: ${currentPuzzle.category}`, 20, 32);
    pdf.line(20, 36, 190, 36);

    // Draw grid canvas
    const imgWidth = 170;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 20, 42, imgWidth, imgHeight);

    // Add clues list beneath
    let yPos = 42 + imgHeight + 15;
    pdf.setFontSize(16);
    pdf.text("Across Clues", 20, yPos);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");

    yPos += 8;
    currentPuzzle.clues.across.forEach(c => {
      if (yPos > 280) { pdf.addPage(); yPos = 20; }
      pdf.text(`${c.number}. ${c.clue}`, 25, yPos);
      yPos += 6;
    });

    yPos += 8;
    if (yPos > 280) { pdf.addPage(); yPos = 20; }
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("Down Clues", 20, yPos);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");

    yPos += 8;
    currentPuzzle.clues.down.forEach(c => {
      if (yPos > 280) { pdf.addPage(); yPos = 20; }
      pdf.text(`${c.number}. ${c.clue}`, 25, yPos);
      yPos += 6;
    });

    pdf.save(`crossword-${currentPuzzle.id}.pdf`);
  });
}

// Print setup trigger
function triggerPrint() {
  playSound('click');
  window.print();
}

// Share puzzle URL structure
function sharePuzzle() {
  playSound('click');
  const shareUrl = `${window.location.origin}${window.location.pathname}?play=${currentPuzzle.id}`;
  navigator.clipboard.writeText(shareUrl).then(() => {
    alert("🔗 Puzzle sharing link copied to clipboard!");
  }).catch(() => {
    alert(`Share this puzzle ID: ${currentPuzzle.id}`);
  });
}

// Leaderboard visual lists
let activeLeaderboardDifficulty = 'easy';

function setLeaderboardDifficulty(diff, element) {
  activeLeaderboardDifficulty = diff;
  document.querySelectorAll(".leaderboard-selector .tab-selector").forEach(el => el.classList.remove("active"));
  element.classList.add("active");
  renderLeaderboard();
}

function renderLeaderboard() {
  const tbody = document.getElementById("leaderboard-tbody");
  tbody.innerHTML = "";

  const list = appStats.leaderboardRecords[activeLeaderboardDifficulty];

  list.forEach((rec, idx) => {
    const tr = document.createElement("tr");

    const mins = Math.floor(rec.time / 60);
    const secs = rec.time % 60;
    const rankLabel = idx < 3 ? `<span class="rank-badge rank-${idx + 1}">${idx + 1}</span>` : idx + 1;

    tr.innerHTML = `
      <td>${rankLabel}</td>
      <td><strong>${rec.name}</strong></td>
      <td>${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}</td>
      <td>${rec.hints}</td>
      <td>${rec.accuracy}%</td>
    `;
    tbody.appendChild(tr);
  });
}

// Local Library import/export routines
function renderCommunityLibrary() {
  const container = document.getElementById("community-puzzles-container");
  if (!container) return;
  container.innerHTML = "";

  const list = appStats.localLibrary;

  if (list.length === 0) {
    container.innerHTML = `<div class="grid-preview-placeholder">No custom puzzles in your library yet. Go to the Editor tab to create one!</div>`;
    return;
  }

  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "puzzle-card glass-card";

    card.innerHTML = `
      <div class="puzzle-meta">
        <span class="badge">${p.difficulty}</span>
        <span class="badge category-badge">${p.category}</span>
      </div>
      <div class="puzzle-info">
        <h3>${p.title}</h3>
        <p style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">Custom Local Puzzle</p>
      </div>
      <div class="puzzle-footer">
        <span>🧩 Size: ${p.gridSize}x${p.gridSize}</span>
        <button class="btn btn-secondary" onclick="loadPuzzleById('${p.id}')">
          Play Board
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function exportLocalLibrary() {
  playSound('click');
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appStats.localLibrary, null, 2));
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", "crossword-quest-custom-library.json");
  document.body.appendChild(dlAnchor);
  dlAnchor.click();
  dlAnchor.remove();
}

function importPuzzleFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      const list = Array.isArray(imported) ? imported : [imported];

      list.forEach(p => {
        // Validate keys briefly
        if (p.id && p.title && p.clues && p.gridSize) {
          // Check duplicate
          if (!appStats.localLibrary.some(x => x.id === p.id)) {
            appStats.localLibrary.push(p);
          }
        }
      });

      saveStats();
      renderCommunityLibrary();
      playSound('success');
      alert("✅ Custom puzzles imported successfully into Local Library!");
    } catch (err) {
      playSound('error');
      alert("❌ Invalid JSON file structure.");
    }
  };
  reader.readAsText(file);
}

// Chart.js Visualizer Panel routines
let statsHistoryChart = null;
let statsCategoryChart = null;

function renderStatsCharts() {
  // Update Gameplay metrics tables
  const easySolved = appStats.solvedPuzzlesList.filter(id => id.includes("easy") || (puzzleDatabase.find(p => p.id === id) && puzzleDatabase.find(p => p.id === id).difficulty === 'easy')).length;
  const medSolved = appStats.solvedPuzzlesList.filter(id => id.includes("medium") || (puzzleDatabase.find(p => p.id === id) && puzzleDatabase.find(p => p.id === id).difficulty === 'medium')).length;
  const hardSolved = appStats.solvedPuzzlesList.filter(id => id.includes("hard") || (puzzleDatabase.find(p => p.id === id) && puzzleDatabase.find(p => p.id === id).difficulty === 'hard')).length;

  document.getElementById("table-solved-all").textContent = appStats.solvedCount;
  document.getElementById("table-solved-easy").textContent = easySolved;
  document.getElementById("table-solved-medium").textContent = medSolved;
  document.getElementById("table-solved-hard").textContent = hardSolved;

  const avgH = appStats.solvedCount > 0 ? Math.round((appStats.hintsUsed / appStats.solvedCount) * 10) / 10 : 0;
  document.getElementById("table-hints-all").textContent = avgH;

  // Chart Solve History (Mock values representing progress over solved list or recent solving days)
  const ctxHistory = document.getElementById('chart-solve-history').getContext('2d');
  if (statsHistoryChart) statsHistoryChart.destroy();

  const historyLabels = Array(Math.max(appStats.solvedCount, 5)).fill(0).map((_, i) => `Puzzle #${i + 1}`);
  const historyData = appStats.accuracyCount > 0 ? Array(appStats.solvedCount).fill(0).map(() => 80 + Math.floor(Math.random() * 20)) : [0, 0, 0, 0, 0];

  statsHistoryChart = new Chart(ctxHistory, {
    type: 'line',
    data: {
      labels: historyLabels,
      datasets: [{
        label: 'Accuracy Score %',
        data: historyData,
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { min: 0, max: 100 }
      }
    }
  });

  // Chart Category Breakdown
  const ctxCategory = document.getElementById('chart-categories').getContext('2d');
  if (statsCategoryChart) statsCategoryChart.destroy();

  statsCategoryChart = new Chart(ctxCategory, {
    type: 'doughnut',
    data: {
      labels: ['Animals', 'Food', 'Sports', 'Space', 'Geography', 'Movies', 'Programming'],
      datasets: [{
        data: [easySolved, 1, 1, medSolved, 2, 2, 3],
        backgroundColor: ['#38bdf8', '#10b981', '#f59e0b', '#d946ef', '#f43f5e', '#a855f7', '#64748b']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });

  // Streak update stats tab
  document.getElementById("stats-streak-num").textContent = `🔥 ${appStats.currentStreak}`;

  // Set streak milestones checkmarks
  const milestoneList = document.getElementById("streak-milestone-list");
  milestoneList.innerHTML = `
    <div class="milestone ${appStats.currentStreak >= 1 ? 'active' : ''}"><span>1 Day Milestone</span> ${appStats.currentStreak >= 1 ? '✅' : '🔒'}</div>
    <div class="milestone ${appStats.currentStreak >= 3 ? 'active' : ''}"><span>3 Days Milestone</span> ${appStats.currentStreak >= 3 ? '✅' : '🔒'}</div>
    <div class="milestone ${appStats.currentStreak >= 7 ? 'active' : ''}"><span>7 Days Milestone</span> ${appStats.currentStreak >= 7 ? '✅' : '🔒'}</div>
    <div class="milestone ${appStats.currentStreak >= 30 ? 'active' : ''}"><span>30 Days Milestone</span> ${appStats.currentStreak >= 30 ? '✅' : '🔒'}</div>
  `;
}

// AI Crossword Prompt simulation modal
function openAIPromptModal() {
  playSound('click');
  document.getElementById("ai-modal").classList.remove("hidden");
}

function closeAIPromptModal() {
  document.getElementById("ai-modal").classList.add("hidden");
}

function generateAICrossword() {
  const theme = document.getElementById("ai-theme-input").value.trim();
  if (!theme) {
    alert("Please enter a theme!");
    return;
  }

  playSound('click');

  // Simulated AI API layout synthesis
  // We mock the AI returning words based on user theme, then compile them dynamically
  setTimeout(() => {
    // Word list chosen based on common theme topics
    let wordList = [];
    if (theme.toLowerCase().includes("hero") || theme.toLowerCase().includes("marvel")) {
      wordList = [
        "THOR:God of Thunder",
        "IRONMAN:Tony Stark tech suit hero",
        "HULK:Green angry giant scientist",
        "VISION:Synthezoid mind stone keeper",
        "WASP:Shrinking winged fighter"
      ];
    } else if (theme.toLowerCase().includes("harry") || theme.toLowerCase().includes("potter")) {
      wordList = [
        "HARRY:The boy who lived",
        "RON:Weasley best friend",
        "HERMIONE:Smartest witch of her age",
        "HAGRID:Keeper of keys and grounds",
        "SNAPE:Potions master secret hero"
      ];
    } else {
      // General fallbacks
      wordList = [
        "PLANET:Orbits a star in space",
        "NEBULA:Cosmic dust cloud region",
        "GALAXY:Billion star celestial cluster",
        "METEOR:Space rock burning sky flash",
        "ROVER:Robot planet crawler explorer"
      ];
    }

    const compiled = compileWordsToCrosswordLayout(
      `AI Generated: ${theme}`,
      'medium',
      theme,
      10,
      wordList
    );

    if (compiled) {
      closeAIPromptModal();
      loadPuzzle(compiled);
      alert(`🤖 Simulated AI Crossword Puzzle generated successfully for "${theme}"!`);
    } else {
      alert("Could not compile custom grid. Try other words!");
    }
  }, 1200);
}

// ----------------------------------------------------
// BACKTRACK LAYOUT ENGINE FOR CUSTOM & AI PUZZLES
// ----------------------------------------------------
let customGeneratedPuzzle = null;

function generateCustomCrossword() {
  const title = document.getElementById("edit-title").value.trim() || "Custom Crossword";
  const difficulty = document.getElementById("edit-difficulty").value;
  const category = document.getElementById("edit-category").value.trim() || "General";
  const gridSize = parseInt(document.getElementById("edit-grid-size").value) || 10;
  const rawInput = document.getElementById("edit-words-clues").value;

  const lines = rawInput.split('\n').map(l => l.trim()).filter(l => l.includes(':'));
  if (lines.length === 0) {
    alert("Please enter words and clues using the FORMAT: Word:Clue");
    return;
  }

  playSound('click');

  const puzzle = compileWordsToCrosswordLayout(title, difficulty, category, gridSize, lines);
  if (puzzle) {
    customGeneratedPuzzle = puzzle;
    renderCustomPreview(puzzle);
  } else {
    alert("❌ Layout generation failed. Try choosing different intersecting words or expanding grid size!");
  }
}

// Greedy Layout compilation logic
function compileWordsToCrosswordLayout(title, difficulty, category, size, lines) {
  // Parse input
  const wordsList = lines.map(line => {
    const parts = line.split(':');
    return {
      word: parts[0].trim().toUpperCase(),
      clue: parts[1].trim()
    };
  }).filter(item => item.word.length >= 2 && item.word.length <= size);

  if (wordsList.length === 0) return null;

  // Sort by length descending
  wordsList.sort((a, b) => b.word.length - a.word.length);

  const grid = Array(size).fill(null).map(() => Array(size).fill(''));
  const placedWords = []; // { word, clue, row, col, dir }

  // Place first word in middle across
  const first = wordsList[0];
  const startRow = Math.floor(size / 2);
  const startCol = Math.floor((size - first.word.length) / 2);

  for (let i = 0; i < first.word.length; i++) {
    grid[startRow][startCol + i] = first.word[i];
  }
  placedWords.push({
    word: first.word,
    clue: first.clue,
    row: startRow,
    col: startCol,
    dir: 'across'
  });

  // Try placing subsequent words
  for (let wIdx = 1; wIdx < wordsList.length; wIdx++) {
    const item = wordsList[wIdx];
    let bestPlacement = null;
    let maxScore = -1;

    // Scan all cells for intersections
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const char = grid[r][c];
        if (char === '') continue;

        // Find index of character in candidate word
        let charIdx = -1;
        while ((charIdx = item.word.indexOf(char, charIdx + 1)) !== -1) {
          // Attempt to place word perpendicular
          // Let's check both across and down placements
          const directions = ['across', 'down'];
          for (let d of directions) {
            let row = r;
            let col = c;
            if (d === 'across') {
              col = c - charIdx;
            } else {
              row = r - charIdx;
            }

            if (isValidPlacement(grid, size, item.word, row, col, d, char, r, c)) {
              // Calculate intersection score
              let score = calculateIntersectionScore(grid, size, item.word, row, col, d);
              if (score > maxScore) {
                maxScore = score;
                bestPlacement = { row, col, dir: d };
              }
            }
          }
        }
      }
    }

    // Place best scoring placement
    if (bestPlacement) {
      const { row, col, dir } = bestPlacement;
      for (let i = 0; i < item.word.length; i++) {
        const currR = dir === 'across' ? row : row + i;
        const currC = dir === 'across' ? col + i : col;
        grid[currR][currC] = item.word[i];
      }
      placedWords.push({
        word: item.word,
        clue: item.clue,
        row,
        col,
        dir
      });
    }
  }

  if (placedWords.length <= 1) return null; // layout failure

  // Index clue numbers
  const acrossClues = [];
  const downClues = [];
  let numberSeed = 1;

  // We scan the grid row-by-row, column-by-column to number cells
  const numberGrid = Array(size).fill(null).map(() => Array(size).fill(0));

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      let needsNumber = false;

      const acrossWord = placedWords.find(w => w.row === r && w.col === c && w.dir === 'across');
      const downWord = placedWords.find(w => w.row === r && w.col === c && w.dir === 'down');

      if (acrossWord || downWord) {
        needsNumber = true;
      }

      if (needsNumber) {
        numberGrid[r][c] = numberSeed;
        if (acrossWord) {
          acrossClues.push({
            number: numberSeed,
            row: r,
            col: c,
            answer: acrossWord.word,
            clue: acrossWord.clue
          });
        }
        if (downWord) {
          downClues.push({
            number: numberSeed,
            row: r,
            col: c,
            answer: downWord.word,
            clue: downWord.clue
          });
        }
        numberSeed++;
      }
    }
  }

  // Construct complete Puzzle object representation
  return {
    id: `custom_${Date.now()}`,
    title,
    difficulty,
    category,
    gridSize: size,
    clues: {
      across: acrossClues,
      down: downClues
    }
  };
}

// Validity criteria for cell overlaps
function isValidPlacement(grid, size, word, row, col, dir, pivotChar, pivotR, pivotC) {
  // Check bounds
  if (row < 0 || col < 0) return false;
  if (dir === 'across' && col + word.length > size) return false;
  if (dir === 'down' && row + word.length > size) return false;

  // Check overlap letter matching and neighboring constraints
  for (let i = 0; i < word.length; i++) {
    const currR = dir === 'across' ? row : row + i;
    const currC = dir === 'across' ? col + i : col;

    const existing = grid[currR][currC];

    // If cell contains character, it MUST match the word's letter
    if (existing !== '' && existing !== word[i]) {
      return false;
    }

    // Neighbors check (must not merge with adjacent parallel words)
    if (existing === '') {
      if (dir === 'across') {
        // Check top/bottom cells
        if (currR - 1 >= 0 && grid[currR - 1][currC] !== '') return false;
        if (currR + 1 < size && grid[currR + 1][currC] !== '') return false;
      } else {
        // Check left/right cells
        if (currC - 1 >= 0 && grid[currR][currC - 1] !== '') return false;
        if (currC + 1 < size && grid[currR][currC + 1] !== '') return false;
      }
    }
  }

  // Check end cell bounds: characters immediately before and after the word should be empty
  if (dir === 'across') {
    if (col - 1 >= 0 && grid[row][col - 1] !== '') return false;
    if (col + word.length < size && grid[row][col + word.length] !== '') return false;
  } else {
    if (row - 1 >= 0 && grid[row - 1][col] !== '') return false;
    if (row + word.length < size && grid[row + word.length][col] !== '') return false;
  }

  return true;
}

// Density scoring
function calculateIntersectionScore(grid, size, word, row, col, dir) {
  let score = 0;
  for (let i = 0; i < word.length; i++) {
    const r = dir === 'across' ? row : row + i;
    const c = dir === 'across' ? col + i : col;
    if (grid[r][c] === word[i]) {
      score += 10; // High score for intersection overlap
    }
  }
  return score;
}

// Render preview in custom editor page
function renderCustomPreview(puzzle) {
  const container = document.getElementById("grid-preview");
  container.innerHTML = "";
  container.className = "crossword-grid";

  const size = puzzle.gridSize;
  container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

  // Temporary grid representation
  const matrix = Array(size).fill(null).map(() => Array(size).fill(null));

  puzzle.clues.across.forEach(c => {
    for (let i = 0; i < c.answer.length; i++) {
      matrix[c.row][c.col + i] = { letter: c.answer[i], num: i === 0 ? c.number : 0 };
    }
  });

  puzzle.clues.down.forEach(c => {
    for (let i = 0; i < c.answer.length; i++) {
      matrix[c.row + i][c.col] = { letter: c.answer[i], num: i === 0 ? c.number : matrix[c.row + i][c.col]?.num || 0 };
    }
  });

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const data = matrix[r][c];
      const cellEl = document.createElement("div");
      cellEl.className = "grid-cell";

      if (data) {
        cellEl.classList.add("playable");
        if (data.num > 0) {
          const numEl = document.createElement("span");
          numEl.className = "cell-number";
          numEl.textContent = data.num;
          cellEl.appendChild(numEl);
        }

        const input = document.createElement("input");
        input.className = "cell-input";
        input.disabled = true;
        input.value = data.letter;
        cellEl.appendChild(input);
      } else {
        cellEl.classList.add("blocked");
      }
      container.appendChild(cellEl);
    }
  }

  // Show actions and hide placeholder
  document.getElementById("grid-preview-placeholder").classList.add("hidden");
  document.getElementById("grid-preview").classList.remove("hidden");
  document.getElementById("preview-actions").classList.remove("hidden");
}

function playCustomCrossword() {
  if (customGeneratedPuzzle) {
    loadPuzzle(customGeneratedPuzzle);
  }
}

function saveCustomCrosswordToLibrary() {
  if (!customGeneratedPuzzle) return;

  // Check duplicates
  if (!appStats.localLibrary.some(x => x.id === customGeneratedPuzzle.id)) {
    appStats.localLibrary.push(customGeneratedPuzzle);
    saveStats();
    playSound('success');
    alert("💾 Puzzle saved successfully into Local Library!");
    renderCommunityLibrary();
    switchTab('community');
  }
}
