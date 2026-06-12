// script.js - Dark Neon Memory Match Game
const emojiThemes = [
  // Theme 1: Animals
  [
    "🐶",
    "🐱",
    "🐭",
    "🐹",
    "🐰",
    "🦊",
    "🐻",
    "🐼",
    "🐨",
    "🐯",
    "🦁",
    "🐮",
    "🐷",
    "🐸",
    "🐵",
    "🐔",
  ],
  // Theme 2: Nature & Food
  [
    "🍎",
    "🍌",
    "🍉",
    "🍇",
    "🍓",
    "🍒",
    "🥑",
    "🥕",
    "🌽",
    "🍄",
    "🌵",
    "🌲",
    "🌴",
    "🍁",
    "🌸",
    "🌼",
  ],
  // Theme 3: Space & Fantasy
  [
    "🚀",
    "🪐",
    "🌕",
    "⭐",
    "🌠",
    "🛸",
    "👽",
    "🧙",
    "🧝",
    "🧚",
    "🔮",
    "⚡",
    "🔥",
    "❄️",
    "🌊",
    "🌪️",
  ],
  // Theme 4: Sports & Activities
  [
    "⚽",
    "🏀",
    "🏈",
    "🎾",
    "🏓",
    "🏸",
    "🥊",
    "🏄",
    "🚴",
    "🏊",
    "🎸",
    "🎨",
    "📚",
    "🎥",
    "🎮",
    "🎲",
  ],
  // Theme 5: Emojis Mix
  [
    "😀",
    "😂",
    "😍",
    "🥰",
    "😎",
    "🤩",
    "🤖",
    "👻",
    "👽",
    "🦄",
    "🍔",
    "🍕",
    "🚗",
    "✈️",
    "🎸",
    "🏆",
  ],
  // Theme 6: Ocean & Sea
  [
    "🐙",
    "🐡",
    "🐠",
    "🐬",
    "🐳",
    "🦈",
    "🐢",
    "🦀",
    "🐚",
    "🌊",
    "🪼",
    "🦭",
    "🐋",
    "🦞",
    "🐟",
    "🦑",
  ],
];

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let seconds = 0;
let timerInterval = null;
let isProcessing = false;
let gridSize = 6;
let currentTheme = [];

const grid = document.getElementById("grid");
const movesEl = document.getElementById("moves");
const timerEl = document.getElementById("timer");
const progressEl = document.getElementById("progress");
const difficultySelect = document.getElementById("difficulty");
const newGameBtn = document.getElementById("new-game");
const restartBtn = document.getElementById("restart");
const winModal = new bootstrap.Modal(document.getElementById("winModal"));
const finalMovesEl = document.getElementById("final-moves");
const finalTimeEl = document.getElementById("final-time");
const bestTimeEl = document.getElementById("best-time");
const playAgainBtn = document.getElementById("play-again");
const confettiCanvas = document.getElementById("confetti");

// Create confetti
function launchConfetti() {
  const ctx = confettiCanvas.getContext("2d");
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;

  let particles = [];
  class Particle {
    constructor() {
      this.x = Math.random() * confettiCanvas.width;
      this.y = Math.random() * confettiCanvas.height - confettiCanvas.height;
      this.size = Math.random() * 12 + 6;
      this.speed = Math.random() * 4 + 2;
      this.angle = Math.random() * 360;
      this.color = ["#00ffcc", "#00ccff", "#ff00cc", "#ffff00"][
        Math.floor(Math.random() * 4)
      ];
    }
    update() {
      this.y += this.speed;
      this.angle += 5;
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.angle * Math.PI) / 180);
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
      ctx.restore();
    }
  }

  for (let i = 0; i < 150; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    particles.forEach((p, i) => {
      p.update();
      p.draw();
      if (p.y > confettiCanvas.height) particles.splice(i, 1);
    });
    if (particles.length > 0) requestAnimationFrame(animate);
  }
  animate();

  setTimeout(
    () =>
      confettiCanvas
        .getContext("2d")
        .clearRect(0, 0, confettiCanvas.width, confettiCanvas.height),
    8000,
  );
}

// Create board with random theme
function createBoard(size) {
  gridSize = size;
  grid.innerHTML = "";
  grid.className = `grid grid-${size}`;

  const totalPairs = (size * size) / 2;

  // Select random theme
  currentTheme = [
    ...emojiThemes[Math.floor(Math.random() * emojiThemes.length)],
  ];
  // Shuffle and take needed emojis
  currentTheme.sort(() => Math.random() - 0.5);
  const selectedEmojis = currentTheme.slice(0, totalPairs);

  cards = [...selectedEmojis, ...selectedEmojis];
  cards.sort(() => Math.random() - 0.5); // Final shuffle

  cards.forEach((emoji, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.value = emoji;
    card.dataset.index = index;

    card.innerHTML = `
            <div class="card-front"></div>
            <div class="card-back">${emoji}</div>
        `;

    card.addEventListener("click", handleCardClick);
    grid.appendChild(card);
  });

  resetGameState();
  updateProgress();
}

// Card click handler
function handleCardClick(e) {
  const card = e.currentTarget;

  if (
    isProcessing ||
    card.classList.contains("flipped") ||
    card.classList.contains("matched") ||
    flippedCards.length >= 2
  )
    return;

  card.classList.add("flipped");
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    moves++;
    movesEl.textContent = moves;
    isProcessing = true;

    const [card1, card2] = flippedCards;

    if (card1.dataset.value === card2.dataset.value) {
      card1.classList.add("matched");
      card2.classList.add("matched");
      matchedPairs++;
      updateProgress();

      flippedCards = [];
      isProcessing = false;

      if (matchedPairs === (gridSize * gridSize) / 2) {
        setTimeout(endGame, 600);
      }
    } else {
      setTimeout(() => {
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        flippedCards = [];
        isProcessing = false;
      }, 900);
    }
  }
}

function updateProgress() {
  const totalPairs = (gridSize * gridSize) / 2;
  progressEl.textContent = `${matchedPairs}/${totalPairs}`;
}

// Timer
function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  seconds = 0;
  timerEl.textContent = "0s";

  timerInterval = setInterval(() => {
    seconds++;
    timerEl.textContent = `${seconds}s`;
  }, 1000);
}

function resetGameState() {
  flippedCards = [];
  matchedPairs = 0;
  moves = 0;
  movesEl.textContent = "0";
  if (timerInterval) clearInterval(timerInterval);
  seconds = 0;
  timerEl.textContent = "0s";
  isProcessing = false;
}

function getBestTimeKey() {
  return `bestTime_${gridSize}`;
}

function endGame() {
  clearInterval(timerInterval);

  const bestTimeKey = getBestTimeKey();
  let bestTime = localStorage.getItem(bestTimeKey);
  const isNewBest = !bestTime || seconds < parseInt(bestTime);

  if (isNewBest) {
    localStorage.setItem(bestTimeKey, seconds);
    bestTime = seconds;
  } else {
    bestTime = parseInt(bestTime);
  }

  finalMovesEl.textContent = moves;
  finalTimeEl.textContent = `${seconds}s`;
  bestTimeEl.textContent = `${bestTime}s ${isNewBest ? "(New Best!)" : ""}`;

  winModal.show();
  launchConfetti();
}

// New Game
function newGame() {
  const size = parseInt(difficultySelect.value);
  createBoard(size);
  startTimer();
}

// Event Listeners
newGameBtn.addEventListener("click", newGame);
restartBtn.addEventListener("click", () => {
  createBoard(gridSize);
  startTimer();
});

playAgainBtn.addEventListener("click", () => {
  winModal.hide();
  newGame();
});

difficultySelect.addEventListener("change", newGame);

// Keyboard support
document.addEventListener("keydown", (e) => {
  if (e.key === "r" || e.key === "R") {
    createBoard(gridSize);
    startTimer();
  }
});

// Initialize
window.onload = () => {
  createBoard(6);
  startTimer();

  // Resize confetti canvas
  window.addEventListener("resize", () => {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  });
};
