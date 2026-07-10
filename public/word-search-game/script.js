// Word Search Quest Game Logic

// Seeded Pseudo-Random Number Generator (PRNG) for Daily Challenge
class SeededRandom {
  constructor(seed) {
    this.seed = seed;
  }
  // Linear Congruential Generator
  next() {
    this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
    return this.seed / 4294967296;
  }
  range(min, max) {
    return min + Math.floor(this.next() * (max - min));
  }
  choice(arr) {
    return arr[this.range(0, arr.length)];
  }
  shuffle(arr) {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = this.range(0, i + 1);
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  }
}

// Fallback Word Database (used if fetch() fails due to CORS / local file opening)
const FALLBACK_WORDS = {
  animals: ["LION", "TIGER", "ELEPHANT", "GIRAFFE", "MONKEY", "PENGUIN", "DOLPHIN", "KANGAROO", "CHEETAH", "EAGLE", "PANDA", "KOALA", "OCTOPUS", "ZEBRA", "SHARK", "GORILLA", "RABBIT", "LEOPARD", "FLAMINGO", "SQUIRREL"],
  countries: ["CANADA", "BRAZIL", "FRANCE", "JAPAN", "EGYPT", "INDIA", "AUSTRALIA", "GERMANY", "MEXICO", "ITALY", "SPAIN", "CHINA", "RUSSIA", "SWEDEN", "KENYA", "PORTUGAL", "ARGENTINA", "THAILAND", "SINGAPORE", "COLOMBIA"],
  programming: ["JAVASCRIPT", "PYTHON", "COMPILER", "VARIABLE", "FUNCTION", "DATABASE", "INTERFACE", "ALGORITHM", "HTML", "CSS", "REACT", "ARRAY", "POINTER", "INHERITANCE", "RECURSION", "BOOLEAN", "TERMINAL", "COMPUTE", "FRONTEND", "BACKEND"],
  movies: ["INCEPTION", "GLADIATOR", "TITANIC", "AVATAR", "MATRIX", "JAWS", "FROZEN", "CASABLANCA", "GOODFELLAS", "ALIEN", "PSYCHO", "AMELIE", "INTERSTELLAR", "TOYSTORY", "PULPFICTION", "WHIPLASH", "STARWARS", "THEGODFATHER", "FIGHTCLUB", "MEMENTO"],
  sports: ["SOCCER", "BASKETBALL", "TENNIS", "BASEBALL", "CRICKET", "VOLLEYBALL", "RUGBY", "HOCKEY", "SWIMMING", "RUNNING", "CYCLING", "BOXING", "GOLF", "GYMNASTICS", "ATHLETICS", "BADMINTON", "BILLIARDS", "SURFING", "ARCHERY", "WRESTLING"],
  food: ["PIZZA", "BURGER", "SPAGHETTI", "CHOCOLATE", "SUSHI", "AVOCADO", "CHEESE", "SALAD", "WAFFLE", "PANCAKE", "TACO", "CROISSANT", "LASAGNA", "ICECREAM", "BURRITO", "SANDWICH", "DOUGHNUT", "NOODLES", "POPCORN", "BROWNIE"],
  science: ["GRAVITY", "ATOM", "MOLECULE", "EVOLUTION", "PHYSICS", "CHEMISTRY", "BIOLOGY", "NEURON", "GENETICS", "QUANTUM", "NEBULA", "TELESCOPE", "ELECTRON", "ASTROPHYSICS", "LABORATORY", "DNA", "PHOTOSYNTHESIS", "CELL", "FOSSIL", "ELEMENT"],
  geography: ["MOUNTAIN", "RIVER", "OCEAN", "VOLCANO", "DESERT", "CANYON", "PENINSULA", "CONTINENT", "ISLAND", "GLACIER", "VALLEY", "PLATEAU", "ARCHIPELAGO", "EQUATOR", "LATITUDE", "LONGITUDE", "HEMISPHERE", "ATMOSPHERE", "WATERFALL", "FOREST"]
};

// Web Audio API Sound Effects Synthesizer
class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem("wordSearch_muted") === "true";
  }

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      this.ctx = new AudioContextClass();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem("wordSearch_muted", this.muted);
    return this.muted;
  }

  playSelect() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(550, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playSuccess() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    
    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25]; // C Major Chord (C4 - E4 - G4 - C5)
    
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      
      gain.gain.setValueAtTime(0.06, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);
      
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.25);
    });
  }

  playError() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.type = "triangle";
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(70, this.ctx.currentTime + 0.2);
    
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  playConfetti() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    
    const now = this.ctx.currentTime;
    // Swoosh arpeggio
    const notes = [300, 450, 600, 900, 1200, 1500];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + idx * 0.08 + 0.2);
      
      gain.gain.setValueAtTime(0.03, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.2);
      
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.2);
    });
  }
}

// Canvas Confetti Effect
class ConfettiEffect {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.active = false;
    
    window.addEventListener("resize", () => this.resizeCanvas());
    this.resizeCanvas();
  }
  
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  start() {
    this.active = true;
    this.particles = [];
    
    const colors = ["#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#06b6d4", "#a855f7", "#ec4899"];
    
    // Spawn 120 colored paper particles
    for (let i = 0; i < 120; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * -100 - 20, // Spawn offscreen top
        size: Math.random() * 6 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 4 - 2,
        speedX: Math.random() * 4 - 2,
        speedY: Math.random() * 3 + 3,
        opacity: Math.random() * 0.4 + 0.6
      });
    }
    
    this.animate();
  }
  
  stop() {
    this.active = false;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  animate = () => {
    if (!this.active) return;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    let activeParticles = 0;
    
    this.particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotationSpeed;
      
      if (p.y < this.canvas.height + 20) {
        activeParticles++;
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.globalAlpha = p.opacity;
        this.ctx.fillStyle = p.color;
        
        // Draw confetti rectangular ribbon
        this.ctx.fillRect(-p.size / 2, -p.size, p.size, p.size * 1.5);
        this.ctx.restore();
      }
    });
    
    if (activeParticles > 0 && this.active) {
      requestAnimationFrame(this.animate);
    } else {
      this.stop();
    }
  }
}

// Game Core Manager
class WordSearchGame {
  constructor() {
    this.wordsData = FALLBACK_WORDS;
    
    // Core Elements
    this.gridElement = document.getElementById("grid");
    this.wordListElement = document.getElementById("word-list");
    this.timerValElement = document.getElementById("timer-val");
    this.scoreValElement = document.getElementById("score-val");
    this.wordsProgressElement = document.getElementById("words-progress");
    this.bestScoreElement = document.getElementById("best-score-val");
    
    // SVG selection overlay elements
    this.svgOverlay = document.getElementById("selection-svg");
    this.dragLine = document.getElementById("drag-line");
    this.completedLinesGroup = document.getElementById("completed-lines");
    
    // Systems
    this.sfx = new SoundFX();
    this.confetti = new ConfettiEffect("confetti-canvas");
    
    // Game States
    this.difficulty = "medium";
    this.category = "animals";
    this.gridSize = 10;
    this.grid = [];
    this.placedWords = []; // Array of {word, coords: [{r,c}], start: {r,c}, end: {r,c}, color}
    this.remainingWords = [];
    this.foundWords = [];
    
    this.score = 0;
    this.timer = 0;
    this.timerInterval = null;
    this.hintsUsed = 0;
    this.isDailyChallenge = false;
    this.dailyDateString = "";
    
    // Drag tracking state
    this.isDragging = false;
    this.startCell = null; // {r, c}
    this.currentCell = null; // {r, c}
    this.selectedCells = []; // Array of {r, c}
    
    // Custom Seeded Random Generator
    this.rng = new SeededRandom(Math.floor(Math.random() * 1000000));
    
    // Setup UI Theme & Sound button states on startup
    this.initSettings();
    this.loadDatabase();
    this.setupEventListeners();
  }

  // Load words dataset from server/local file, with code fallback
  async loadDatabase() {
    try {
      const response = await fetch("data/words.json");
      if (response.ok) {
        this.wordsData = await response.json();
      }
    } catch (e) {
      console.warn("Failed to fetch words.json, using local fallback copy.", e);
      this.wordsData = FALLBACK_WORDS;
    }
    
    // Start game after loading dictionary
    this.newGame();
  }

  initSettings() {
    // Force light theme
    document.documentElement.setAttribute("data-theme", "light");

    // Sound button state
    const soundIcon = document.querySelector("#sound-toggle i");
    if (this.sfx.muted) {
      soundIcon.className = "fa-solid fa-volume-xmark";
    } else {
      soundIcon.className = "fa-solid fa-volume-high";
    }
  }

  setupEventListeners() {
    // Select dropdowns
    document.getElementById("difficulty-select").addEventListener("change", (e) => {
      this.difficulty = e.target.value;
      this.isDailyChallenge = false;
      this.newGame();
    });
    
    document.getElementById("category-select").addEventListener("change", (e) => {
      this.category = e.target.value;
      this.isDailyChallenge = false;
      this.newGame();
    });

    // Action buttons
    document.getElementById("new-puzzle-btn").addEventListener("click", () => {
      this.isDailyChallenge = false;
      this.newGame();
    });
    document.getElementById("restart-btn").addEventListener("click", () => this.restartGame());
    document.getElementById("hint-btn").addEventListener("click", () => this.giveHint());
    document.getElementById("daily-challenge-btn").addEventListener("click", () => this.startDailyChallenge());
    
    // Header Actions
    document.getElementById("sound-toggle").addEventListener("click", () => this.toggleSound());
    document.getElementById("leaderboard-btn").addEventListener("click", () => this.openLeaderboard());
    document.getElementById("help-btn").addEventListener("click", () => this.openHelp());

    // Modal Close
    document.querySelectorAll(".modal-close, .modal-close-btn, #victory-close-btn").forEach(btn => {
      btn.addEventListener("click", () => this.closeAllModals());
    });
    
    document.getElementById("victory-next-btn").addEventListener("click", () => {
      this.closeAllModals();
      this.isDailyChallenge = false;
      this.newGame();
    });

    
    // Leaderboard Tabs
    document.querySelectorAll(".leaderboard-tabs .tab-btn").forEach(tab => {
      tab.addEventListener("click", (e) => {
        document.querySelectorAll(".leaderboard-tabs .tab-btn").forEach(t => t.classList.remove("active"));
        e.target.classList.add("active");
        
        const tabName = e.target.dataset.tab;
        if (tabName === "normal") {
          document.getElementById("normal-records-pane").classList.remove("hidden");
          document.getElementById("daily-records-pane").classList.add("hidden");
          this.updateRecordsUI();
        } else {
          document.getElementById("normal-records-pane").classList.add("hidden");
          document.getElementById("daily-records-pane").classList.remove("hidden");
          this.updateDailyRecordsUI();
        }
      });
    });

    document.getElementById("leaderboard-diff").addEventListener("change", () => this.updateRecordsUI());
    document.getElementById("leaderboard-cat").addEventListener("change", () => this.updateRecordsUI());
    document.getElementById("clear-records-btn").addEventListener("click", () => this.clearSelectedRecord());

    // Pointer drag listeners on grid container
    // We attach them here for robust mouse/touch captures
    const gridContainer = document.getElementById("grid-container");
    gridContainer.addEventListener("pointerdown", (e) => this.handleDragStart(e));
    window.addEventListener("pointermove", (e) => this.handleDragMove(e));
    window.addEventListener("pointerup", (e) => this.handleDragEnd(e));
    
    // Re-adjust completed line coords on screen resize
    window.addEventListener("resize", () => {
      this.redrawCompletedLines();
    });
  }

  // --- CONFIG / GENERATION LOGIC ---

  newGame() {
    this.confetti.stop();
    this.hintsUsed = 0;
    this.score = 0;
    this.timer = 0;
    
    // Update labels
    document.getElementById("difficulty-badge").textContent = this.difficulty.toUpperCase();
    document.getElementById("difficulty-badge").className = `badge badge-difficulty difficulty-${this.difficulty}`;
    
    if (this.isDailyChallenge) {
      document.getElementById("daily-challenge-btn").classList.add("btn-accent");
      document.getElementById("daily-challenge-btn").classList.remove("btn-secondary");
      // Disable selecting settings during Daily Challenge to prevent changing seed
      document.getElementById("difficulty-select").disabled = true;
      document.getElementById("category-select").disabled = true;
    } else {
      document.getElementById("daily-challenge-btn").classList.remove("btn-accent");
      document.getElementById("daily-challenge-btn").classList.add("btn-secondary");
      document.getElementById("difficulty-select").disabled = false;
      document.getElementById("category-select").disabled = false;
      
      // Seed randomizer with timestamp for regular play
      this.rng = new SeededRandom(Math.floor(Math.random() * 999999));
    }

    // Set grid sizes & target word counts
    switch (this.difficulty) {
      case "easy":
        this.gridSize = 8;
        this.wordCount = 5;
        break;
      case "medium":
        this.gridSize = 10;
        this.wordCount = 7;
        break;
      case "hard":
        this.gridSize = 12;
        this.wordCount = 9;
        break;
      case "expert":
        this.gridSize = 14;
        this.wordCount = 12;
        break;
    }

    // Clear UI layout classes
    this.gridElement.className = "letters-grid";
    this.gridElement.classList.add(`grid-size-${this.difficulty}`);
    document.getElementById("grid-container").className = `grid-container grid-size-${this.difficulty}`;

    // Load High score display
    this.updateBestScoreDisplay();

    // Reset grid
    this.grid = Array(this.gridSize).fill(null).map(() => Array(this.gridSize).fill(null));
    this.placedWords = [];
    this.foundWords = [];
    
    // Fetch Category Wordbank
    let sourceWords = this.wordsData[this.category] || FALLBACK_WORDS[this.category];
    
    // Filter and shuffle words
    // Cap words length to grid size - 1
    let filtered = sourceWords.filter(w => w.length <= this.gridSize && w.length >= 3);
    
    // Seeded shuffle & select words
    let shuffled = this.rng.shuffle(filtered);
    let selectCount = Math.min(this.wordCount, shuffled.length);
    let targetWords = shuffled.slice(0, selectCount);
    
    // Sort words by length descending (longest first - easier to fit in packing algorithm)
    targetWords.sort((a, b) => b.length - a.length);
    this.remainingWords = [...targetWords];

    // Determine allowed placement directions
    let directions = [];
    if (this.difficulty === "easy") {
      directions = [
        { r: 0, c: 1 }, // Right
        { r: 1, c: 0 }  // Down
      ];
    } else if (this.difficulty === "medium") {
      directions = [
        { r: 0, c: 1 }, // Right
        { r: 1, c: 0 }, // Down
        { r: 1, c: 1 }  // Down-Right
      ];
    } else { // Hard & Expert (8 directions)
      directions = [
        { r: 0, c: 1 },   // Right
        { r: 1, c: 0 },   // Down
        { r: 1, c: 1 },   // Down-Right
        { r: 0, c: -1 },  // Left
        { r: -1, c: 0 },  // Up
        { r: -1, c: -1 }, // Up-Left
        { r: 1, c: -1 },  // Down-Left
        { r: -1, c: 1 }   // Up-Right
      ];
    }

    // Colors list for permanent capsules
    const wordPillColors = [
      "rgba(59, 130, 246, 0.45)",  // blue
      "rgba(236, 72, 153, 0.45)",  // pink
      "rgba(16, 185, 129, 0.45)",  // emerald
      "rgba(245, 158, 11, 0.45)",  // amber
      "rgba(139, 92, 246, 0.45)",  // purple
      "rgba(6, 182, 212, 0.45)",   // cyan
      "rgba(20, 184, 166, 0.45)",  // teal
      "rgba(168, 85, 247, 0.45)"   // purple-pink
    ];

    // Place words in grid
    targetWords.forEach((word, index) => {
      const placed = this.tryPlaceWord(word, directions);
      if (placed) {
        placed.color = wordPillColors[index % wordPillColors.length];
        this.placedWords.push(placed);
      } else {
        // If word fails to place, remove it from list
        const idx = this.remainingWords.indexOf(word);
        if (idx > -1) {
          this.remainingWords.splice(idx, 1);
        }
      }
    });

    // Fill remaining cells with random letters
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let r = 0; r < this.gridSize; r++) {
      for (let c = 0; c < this.gridSize; c++) {
        if (this.grid[r][c] === null) {
          // If seeded challenge, choose seeded letter
          this.grid[r][c] = this.rng.choice(alphabet);
        }
      }
    }

    // Render elements
    this.renderGrid();
    this.renderWordList();
    this.resetTimer();
    this.updateStats();
    
    // Clear completion paths
    this.completedLinesGroup.innerHTML = "";
    this.dragLine.setAttribute("x1", 0);
    this.dragLine.setAttribute("y1", 0);
    this.dragLine.setAttribute("x2", 0);
    this.dragLine.setAttribute("y2", 0);
  }

  // Restart the current puzzle grid
  restartGame() {
    this.confetti.stop();
    this.hintsUsed = 0;
    this.score = 0;
    this.foundWords = [];
    
    // Refresh remaining words list to all placed words
    this.remainingWords = this.placedWords.map(pw => pw.word);

    // Refresh elements
    this.renderGrid();
    this.renderWordList();
    this.resetTimer();
    this.updateStats();

    // Clear completed lines in SVG
    this.completedLinesGroup.innerHTML = "";
    this.dragLine.setAttribute("x1", 0);
    this.dragLine.setAttribute("y1", 0);
    this.dragLine.setAttribute("x2", 0);
    this.dragLine.setAttribute("y2", 0);
  }

  tryPlaceWord(word, directions) {
    // Attempt random placement coordinates up to 150 times
    for (let attempt = 0; attempt < 150; attempt++) {
      const dir = this.rng.choice(directions);
      const startR = this.rng.range(0, this.gridSize);
      const startC = this.rng.range(0, this.gridSize);

      let fits = true;
      const endR = startR + dir.r * (word.length - 1);
      const endC = startC + dir.c * (word.length - 1);

      // Check boundary limits
      if (endR < 0 || endR >= this.gridSize || endC < 0 || endC >= this.gridSize) {
        continue;
      }

      // Check overlap letters clashes
      for (let i = 0; i < word.length; i++) {
        const currR = startR + dir.r * i;
        const currC = startC + dir.c * i;
        const existingLetter = this.grid[currR][currC];
        if (existingLetter !== null && existingLetter !== word[i]) {
          fits = false;
          break;
        }
      }

      // Write to grid if fits perfectly
      if (fits) {
        const coords = [];
        for (let i = 0; i < word.length; i++) {
          const currR = startR + dir.r * i;
          const currC = startC + dir.c * i;
          this.grid[currR][currC] = word[i];
          coords.push({ r: currR, c: currC });
        }

        return {
          word: word,
          coords: coords,
          start: { r: startR, c: startC },
          end: { r: endR, c: endC }
        };
      }
    }
    return null; // Could not place
  }

  // --- RENDER METHODS ---

  renderGrid() {
    this.gridElement.innerHTML = "";
    this.gridElement.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;
    this.gridElement.style.gridTemplateRows = `repeat(${this.gridSize}, 1fr)`;

    for (let r = 0; r < this.gridSize; r++) {
      for (let c = 0; c < this.gridSize; c++) {
        const cell = document.createElement("div");
        cell.className = "grid-cell";
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.textContent = this.grid[r][c];
        
        this.gridElement.appendChild(cell);
      }
    }
  }

  renderWordList() {
    this.wordListElement.innerHTML = "";
    // Recombine all original words of current grid to show list
    const allWords = this.placedWords.map(pw => pw.word);
    
    // Sort alphabetically to display to user
    allWords.sort();

    allWords.forEach(word => {
      const item = document.createElement("div");
      item.className = "word-item";
      item.id = `word-item-${word}`;
      item.textContent = word;
      this.wordListElement.appendChild(item);
    });
  }

  // --- INTERACTION LOGIC (DRAG-TO-SELECT) ---

  handleDragStart(e) {
    e.preventDefault();
    
    // Identify grid-cell target
    const cell = e.target.closest(".grid-cell");
    if (!cell) return;
    
    this.sfx.init(); // Initialize audio context on first click
    this.isDragging = true;
    this.startCell = {
      r: parseInt(cell.dataset.row),
      c: parseInt(cell.dataset.col)
    };
    this.currentCell = { ...this.startCell };
    this.selectedCells = [this.startCell];
    
    this.sfx.playSelect();
    this.updateHighlighting();
    this.drawDragLine();
  }

  handleDragMove(e) {
    if (!this.isDragging || !this.startCell) return;
    
    // On touch screen drag move, hover over elements is not triggered on pointerover,
    // so we calculate cell under clientX/clientY position coordinates.
    const element = document.elementFromPoint(e.clientX, e.clientY);
    const cell = element ? element.closest(".grid-cell") : null;
    if (!cell) return;

    const r = parseInt(cell.dataset.row);
    const c = parseInt(cell.dataset.col);

    if (r === this.currentCell.r && c === this.currentCell.c) {
      return; // Haven't moved to another cell
    }

    // Check line locking: dragging must lock to horizontal, vertical, or diagonal
    const dRow = r - this.startCell.r;
    const dCol = c - this.startCell.c;

    const absDR = Math.abs(dRow);
    const absDC = Math.abs(dCol);

    let targetR = r;
    let targetC = c;

    // Smart locking to the nearest valid vector direction
    if (absDR === 0) {
      // Perfect Horizontal
      targetR = this.startCell.r;
    } else if (absDC === 0) {
      // Perfect Vertical
      targetC = this.startCell.c;
    } else if (absDR === absDC) {
      // Perfect Diagonal
      // No adjustment needed
    } else {
      // Lock it: determine if dragging is closer to diagonal or orthagonal
      if (absDR > 1.8 * absDC) {
        // Closer to vertical line
        targetC = this.startCell.c;
      } else if (absDC > 1.8 * absDR) {
        // Closer to horizontal line
        targetR = this.startCell.r;
      } else {
        // Force perfect diagonal by matching displacement length
        const step = Math.min(absDR, absDC);
        targetR = this.startCell.r + Math.sign(dRow) * step;
        targetC = this.startCell.c + Math.sign(dCol) * step;
      }
    }

    this.currentCell = { r: targetR, c: targetC };
    this.selectedCells = this.getCellsInBetween(this.startCell, this.currentCell);
    
    this.sfx.playSelect();
    this.updateHighlighting();
    this.drawDragLine();
  }

  handleDragEnd(e) {
    if (!this.isDragging) return;
    this.isDragging = false;
    
    // Clear selecting classes
    document.querySelectorAll(".grid-cell.selecting").forEach(cell => {
      cell.classList.remove("selecting");
    });
    
    // Hide drag line in SVG
    this.dragLine.setAttribute("x1", 0);
    this.dragLine.setAttribute("y1", 0);
    this.dragLine.setAttribute("x2", 0);
    this.dragLine.setAttribute("y2", 0);

    if (this.selectedCells.length > 0) {
      // Build selected word text string
      let selectedWord = this.selectedCells.map(coord => this.grid[coord.r][coord.c]).join("");
      let reversedWord = selectedWord.split("").reverse().join("");

      let foundInfo = null;
      
      // Match forward or backward placed words
      for (let pw of this.placedWords) {
        if (this.remainingWords.includes(pw.word)) {
          if (pw.word === selectedWord || pw.word === reversedWord) {
            foundInfo = pw;
            break;
          }
        }
      }

      if (foundInfo) {
        // Word found!
        this.markWordAsFound(foundInfo);
      } else {
        this.sfx.playError();
      }
    }

    this.startCell = null;
    this.currentCell = null;
    this.selectedCells = [];
  }

  // Get all cell coordinates in a straight line path
  getCellsInBetween(start, end) {
    const dRow = end.r - start.r;
    const dCol = end.c - start.c;
    
    const stepR = dRow === 0 ? 0 : Math.sign(dRow);
    const stepC = dCol === 0 ? 0 : Math.sign(dCol);
    
    const cells = [];
    let r = start.r;
    let c = start.c;
    
    const length = Math.max(Math.abs(dRow), Math.abs(dCol)) + 1;
    for (let i = 0; i < length; i++) {
      cells.push({ r, c });
      r += stepR;
      c += stepC;
    }
    
    return cells;
  }

  // Update real-time grid cells background selection coloring
  updateHighlighting() {
    document.querySelectorAll(".grid-cell.selecting").forEach(cell => {
      cell.classList.remove("selecting");
    });

    this.selectedCells.forEach(coord => {
      const cell = document.querySelector(`.grid-cell[data-row="${coord.r}"][data-col="${coord.c}"]`);
      if (cell) {
        cell.classList.add("selecting");
      }
    });
  }

  // Get grid-relative cell centers for drawing SVG lines
  getCellCenter(row, col) {
    const cell = document.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
    if (!cell) return { x: 0, y: 0 };
    
    const rect = cell.getBoundingClientRect();
    const gridRect = document.getElementById("grid-container").getBoundingClientRect();
    
    const x = rect.left - gridRect.left + rect.width / 2;
    const y = rect.top - gridRect.top + rect.height / 2;
    
    return { x, y };
  }

  // Draw active dragging select indicator
  drawDragLine() {
    if (!this.startCell || !this.currentCell) return;
    const startPt = this.getCellCenter(this.startCell.r, this.startCell.c);
    const endPt = this.getCellCenter(this.currentCell.r, this.currentCell.c);
    
    this.dragLine.setAttribute("x1", startPt.x);
    this.dragLine.setAttribute("y1", startPt.y);
    this.dragLine.setAttribute("x2", endPt.x);
    this.dragLine.setAttribute("y2", endPt.y);
  }

  // Marks a word as completed
  markWordAsFound(placedInfo) {
    const word = placedInfo.word;
    
    // Remove from remaining, push to found
    this.remainingWords = this.remainingWords.filter(w => w !== word);
    this.foundWords.push(word);

    // Apply sound
    this.sfx.playSuccess();

    // Mark word item found in checklist
    const checklistItem = document.getElementById(`word-item-${word}`);
    if (checklistItem) {
      checklistItem.classList.remove("hinted");
      checklistItem.classList.add("found");
    }

    // Add font glow styling classes to letters
    placedInfo.coords.forEach(coord => {
      const cell = document.querySelector(`.grid-cell[data-row="${coord.r}"][data-col="${coord.c}"]`);
      if (cell) {
        cell.classList.add("found-cell");
        cell.classList.remove("hint-pulse");
      }
    });

    // Draw permanent background line inside SVG overlay
    this.drawCompletedLine(placedInfo);

    // Update Score: 100 points base + length * 10
    const wordPoints = 100 + (word.length * 10);
    let diffMultiplier = 1;
    if (this.difficulty === "medium") diffMultiplier = 1.5;
    else if (this.difficulty === "hard") diffMultiplier = 2;
    else if (this.difficulty === "expert") diffMultiplier = 3;
    
    this.score += Math.floor(wordPoints * diffMultiplier);

    this.updateStats();

    // Check win condition
    if (this.remainingWords.length === 0) {
      this.handleVictory();
    }
  }

  drawCompletedLine(placedInfo) {
    const startPt = this.getCellCenter(placedInfo.start.r, placedInfo.start.c);
    const endPt = this.getCellCenter(placedInfo.end.r, placedInfo.end.c);
    
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", startPt.x);
    line.setAttribute("y1", startPt.y);
    line.setAttribute("x2", endPt.x);
    line.setAttribute("y2", endPt.y);
    line.setAttribute("class", "completed-line");
    line.setAttribute("style", `stroke: ${placedInfo.color || 'var(--accent-color)'};`);
    line.dataset.word = placedInfo.word; // store identifier to redraw on resize
    
    this.completedLinesGroup.appendChild(line);
  }

  // Redraw SVG overlays when viewport resizes (highly responsive!)
  redrawCompletedLines() {
    // Clear lines
    this.completedLinesGroup.innerHTML = "";
    
    // Find matching completed lines and redraw
    this.placedWords.forEach(pw => {
      if (this.foundWords.includes(pw.word)) {
        this.drawCompletedLine(pw);
      }
    });
  }

  // --- STATS / TIMER LOGIC ---

  resetTimer() {
    clearInterval(this.timerInterval);
    this.timer = 0;
    this.timerValElement.textContent = "00:00";
    
    this.timerInterval = setInterval(() => {
      this.timer++;
      
      const mins = Math.floor(this.timer / 60).toString().padStart(2, "0");
      const secs = (this.timer % 60).toString().padStart(2, "0");
      this.timerValElement.textContent = `${mins}:${secs}`;
    }, 1000);
  }

  updateStats() {
    this.scoreValElement.textContent = this.score;
    
    const totalCount = this.placedWords.length;
    const foundCount = this.foundWords.length;
    this.wordsProgressElement.textContent = `${foundCount}/${totalCount}`;
  }

  updateBestScoreDisplay() {
    const key = `bestScore_${this.difficulty}_${this.category}`;
    const best = localStorage.getItem(key) || "0";
    this.bestScoreElement.textContent = best;
  }

  // --- GAME SYSTEM HELPERS ---

  giveHint() {
    // Hints cost 50 points, cannot bring below 0 score
    if (this.score < 50 && this.score > 0) {
      alert("Not enough points! Hints cost 50 score points.");
      return;
    }
    
    if (this.remainingWords.length === 0) return;
    
    // Select a random unfound word
    const nextWord = this.remainingWords[Math.floor(Math.random() * this.remainingWords.length)];
    const placed = this.placedWords.find(pw => pw.word === nextWord);
    if (!placed) return;

    // Highlight the starting cell of that word
    const startPt = placed.start;
    const cell = document.querySelector(`.grid-cell[data-row="${startPt.r}"][data-col="${startPt.c}"]`);
    if (cell) {
      // Trigger glowing keyframe animation on cell
      cell.classList.add("hint-pulse");
      
      // Remove hint glow after 3.5 seconds
      setTimeout(() => {
        cell.classList.remove("hint-pulse");
      }, 3500);
    }

    // Highlight word in the list panel to help match
    const listItem = document.getElementById(`word-item-${nextWord}`);
    if (listItem) {
      listItem.classList.add("hinted");
      setTimeout(() => {
        listItem.classList.remove("hinted");
      }, 3500);
    }

    // Apply points cost penalty
    this.score = Math.max(0, this.score - 50);
    this.hintsUsed++;
    this.updateStats();
    this.sfx.playSelect();
  }


  // Sound FX Mute Toggler
  toggleSound() {
    const isMuted = this.sfx.toggleMute();
    const soundIcon = document.querySelector("#sound-toggle i");
    if (isMuted) {
      soundIcon.className = "fa-solid fa-volume-xmark";
    } else {
      soundIcon.className = "fa-solid fa-volume-high";
    }
  }

  // --- DAILY CHALLENGE FEATURES ---

  startDailyChallenge() {
    const today = new Date();
    const dateString = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
    
    // Check if challenge is already completed today
    const dailyKey = `dailyCompleted_${dateString}`;
    if (localStorage.getItem(dailyKey)) {
      alert(`You've already completed the Daily Challenge for ${dateString}!`);
      this.openLeaderboard();
      return;
    }

    this.isDailyChallenge = true;
    this.dailyDateString = dateString;

    // Use current date seed for generator (format: YYYYMMDD)
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    this.rng = new SeededRandom(seed);

    // Hardcode category & difficulty based on weekday for daily challenge
    // Monday (1) = Countries, Tuesday (2) = Programming, etc.
    const dayOfWeek = today.getDay(); // 0-6
    const dailyCategories = ["animals", "countries", "programming", "movies", "sports", "food", "science"];
    
    this.difficulty = "hard"; // Daily challenge is always Hard!
    this.category = dailyCategories[dayOfWeek];

    // Align SELECT inputs
    document.getElementById("difficulty-select").value = this.difficulty;
    document.getElementById("category-select").value = this.category;

    this.newGame();
  }

  // --- RECORD KEEPING & LOCALSTORAGE ---

  saveRecord() {
    const timeTakenStr = this.timerValElement.textContent;
    
    if (this.isDailyChallenge) {
      // Save Daily Challenge record
      const dailyRecord = {
        date: this.dailyDateString,
        score: this.score,
        time: timeTakenStr
      };

      const dailyRecords = JSON.parse(localStorage.getItem("wordSearch_daily_records") || "[]");
      // Prevent duplicates
      if (!dailyRecords.some(r => r.date === this.dailyDateString)) {
        dailyRecords.push(dailyRecord);
        localStorage.setItem("wordSearch_daily_records", JSON.stringify(dailyRecords));
      }
      
      // Save daily completion flag to lock play
      localStorage.setItem(`dailyCompleted_${this.dailyDateString}`, "true");
    } else {
      // Save Classic record
      const recordKey = `bestScore_${this.difficulty}_${this.category}`;
      const bestScore = parseInt(localStorage.getItem(recordKey) || "0");
      if (this.score > bestScore) {
        localStorage.setItem(recordKey, this.score.toString());
      }

      const bestTimeKey = `bestTime_${this.difficulty}_${this.category}`;
      const bestTime = localStorage.getItem(bestTimeKey); // e.g. "02:15"
      if (!bestTime || this.compareTimes(timeTakenStr, bestTime) < 0) {
        localStorage.setItem(bestTimeKey, timeTakenStr);
      }

      const completedCountKey = `completedCount_${this.difficulty}_${this.category}`;
      const count = parseInt(localStorage.getItem(completedCountKey) || "0");
      localStorage.setItem(completedCountKey, (count + 1).toString());
    }
  }

  // Returns negative if t1 < t2, positive if t1 > t2
  compareTimes(t1, t2) {
    const parseTime = (str) => {
      const parts = str.split(":");
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    };
    return parseTime(t1) - parseTime(t2);
  }

  // --- VICTORY MANAGEMENT ---

  handleVictory() {
    clearInterval(this.timerInterval);
    
    // Stop timers, play victory sounds
    this.sfx.playConfetti();
    this.confetti.start();
    
    // Save record to local storage
    this.saveRecord();

    // Populate Victory Modal values
    const timeTaken = this.timerValElement.textContent;
    document.getElementById("v-score").textContent = this.score;
    document.getElementById("v-time").textContent = timeTaken;
    document.getElementById("v-hints").textContent = this.hintsUsed;

    // Victory subtitle adjustments
    if (this.isDailyChallenge) {
      document.getElementById("victory-subtitle").textContent = `Daily Challenge (${this.dailyDateString}) Completed!`;
    } else {
      document.getElementById("victory-subtitle").textContent = `Classic Mode - ${this.category.toUpperCase()} (${this.difficulty.toUpperCase()})`;
    }

    // Unlock badges / Achievements
    const badgesContainer = document.getElementById("victory-achievements-container");
    badgesContainer.innerHTML = "";

    // Achievement: No Hints used
    if (this.hintsUsed === 0) {
      const badge = document.createElement("span");
      badge.className = "achievement-badge";
      badge.innerHTML = `<i class="fa-solid fa-eye-slash"></i> Sharp Eye`;
      badgesContainer.appendChild(badge);
    }
    // Achievement: Fast Completion (under 60s)
    if (this.timer < 60) {
      const badge = document.createElement("span");
      badge.className = "achievement-badge";
      badge.innerHTML = `<i class="fa-solid fa-bolt"></i> Speed Demon`;
      badgesContainer.appendChild(badge);
    }
    // Achievement: Expert Cleared
    if (this.difficulty === "expert") {
      const badge = document.createElement("span");
      badge.className = "achievement-badge";
      badge.innerHTML = `<i class="fa-solid fa-medal"></i> Mastermind`;
      badgesContainer.appendChild(badge);
    }

    // Refresh best score indicator
    this.updateBestScoreDisplay();

    // Display modal
    setTimeout(() => {
      document.getElementById("victory-modal").classList.remove("hidden");
    }, 800);
  }


  // --- MODALS ACTIONS ---

  openHelp() {
    this.sfx.playSelect();
    document.getElementById("help-modal").classList.remove("hidden");
  }

  openLeaderboard() {
    this.sfx.playSelect();
    document.getElementById("leaderboard-modal").classList.remove("hidden");
    
    // Default Tab
    document.querySelector('.tab-btn[data-tab="normal"]').click();
    
    // Set matching selects for normal records view
    document.getElementById("leaderboard-diff").value = this.difficulty;
    document.getElementById("leaderboard-cat").value = this.category;
    
    this.updateRecordsUI();
  }

  updateRecordsUI() {
    const diff = document.getElementById("leaderboard-diff").value;
    const cat = document.getElementById("leaderboard-cat").value;

    const scoreVal = localStorage.getItem(`bestScore_${diff}_${cat}`) || "0";
    const timeVal = localStorage.getItem(`bestTime_${diff}_${cat}`) || "--:--";
    const countVal = localStorage.getItem(`completedCount_${diff}_${cat}`) || "0";

    document.getElementById("record-best-score").textContent = scoreVal;
    document.getElementById("record-best-time").textContent = timeVal;
    document.getElementById("record-completed-count").textContent = countVal;
  }

  updateDailyRecordsUI() {
    const container = document.getElementById("daily-records-body");
    container.innerHTML = "";

    const records = JSON.parse(localStorage.getItem("wordSearch_daily_records") || "[]");

    if (records.length === 0) {
      container.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--text-muted);">No records found. Play a Daily Challenge!</td></tr>`;
      return;
    }

    // Sort records newest first
    records.sort((a, b) => b.date.localeCompare(a.date));

    records.forEach(r => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${r.date}</td>
        <td>${r.time}</td>
        <td>${r.score}</td>
      `;
      container.appendChild(row);
    });
  }

  clearSelectedRecord() {
    const diff = document.getElementById("leaderboard-diff").value;
    const cat = document.getElementById("leaderboard-cat").value;

    if (confirm(`Reset all classic records for ${cat.toUpperCase()} (${diff.toUpperCase()})?`)) {
      localStorage.removeItem(`bestScore_${diff}_${cat}`);
      localStorage.removeItem(`bestTime_${diff}_${cat}`);
      localStorage.removeItem(`completedCount_${diff}_${cat}`);
      this.updateRecordsUI();
      this.updateBestScoreDisplay();
    }
  }

  closeAllModals() {
    document.querySelectorAll(".modal-overlay").forEach(modal => {
      modal.classList.add("hidden");
    });
    this.confetti.stop();
  }
}

// Initial Launch
window.addEventListener("DOMContentLoaded", () => {
  window.Game = new WordSearchGame();
});
