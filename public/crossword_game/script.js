const puzzles = [
  // Puzzle 1: Animals
  {
    size: 12,
    words: [
      {
        word: "ELEPHANT",
        clue: "Largest land animal",
        row: 0,
        col: 2,
        dir: "across",
      },
      { word: "GIRAFFE", clue: "Tallest animal", row: 2, col: 0, dir: "down" },
      { word: "TIGER", clue: "Striped big cat", row: 1, col: 5, dir: "across" },
      { word: "ZEBRA", clue: "Striped horse", row: 4, col: 3, dir: "across" },
      {
        word: "KANGAROO",
        clue: "Australian jumper",
        row: 6,
        col: 1,
        dir: "down",
      },
      { word: "PENGUIN", clue: "Flightless bird", row: 3, col: 8, dir: "down" },
      {
        word: "OCTOPUS",
        clue: "8-armed sea creature",
        row: 8,
        col: 4,
        dir: "across",
      },
      {
        word: "DOLPHIN",
        clue: "Intelligent sea mammal",
        row: 5,
        col: 7,
        dir: "across",
      },
      { word: "LION", clue: "King of jungle", row: 7, col: 2, dir: "down" },
      {
        word: "MONKEY",
        clue: "Tree swinging primate",
        row: 9,
        col: 6,
        dir: "across",
      },
      { word: "PANDA", clue: "Bamboo eater", row: 2, col: 9, dir: "down" },
      {
        word: "KOALA",
        clue: "Australian bear",
        row: 10,
        col: 1,
        dir: "across",
      },
      { word: "CROCODILE", clue: "Large reptile", row: 4, col: 0, dir: "down" },
      {
        word: "FLAMINGO",
        clue: "Pink long-legged bird",
        row: 0,
        col: 7,
        dir: "across",
      },
      { word: "RHINO", clue: "Horned mammal", row: 11, col: 5, dir: "across" },
    ],
  },

  // Puzzle 2: Technology
  {
    size: 12,
    words: [
      {
        word: "COMPUTER",
        clue: "Electronic device",
        row: 0,
        col: 1,
        dir: "across",
      },
      {
        word: "SMARTPHONE",
        clue: "Mobile device",
        row: 2,
        col: 0,
        dir: "down",
      },
      {
        word: "INTERNET",
        clue: "Global network",
        row: 1,
        col: 6,
        dir: "across",
      },
      {
        word: "ROBOT",
        clue: "Automated machine",
        row: 4,
        col: 3,
        dir: "across",
      },
      { word: "SOFTWARE", clue: "Programs", row: 6, col: 2, dir: "down" },
      {
        word: "KEYBOARD",
        clue: "Typing device",
        row: 3,
        col: 8,
        dir: "across",
      },
      {
        word: "ALGORITHM",
        clue: "Step-by-step procedure",
        row: 5,
        col: 5,
        dir: "down",
      },
      {
        word: "DATABASE",
        clue: "Organized data",
        row: 8,
        col: 4,
        dir: "across",
      },
      { word: "CLOUD", clue: "Online storage", row: 7, col: 1, dir: "down" },
      { word: "VIRTUAL", clue: "Not physical", row: 9, col: 7, dir: "across" },
      { word: "HARDWARE", clue: "Physical parts", row: 0, col: 9, dir: "down" },
      {
        word: "NETWORK",
        clue: "Connected devices",
        row: 10,
        col: 2,
        dir: "across",
      },
      { word: "SECURITY", clue: "Protection", row: 4, col: 0, dir: "down" },
      { word: "DISPLAY", clue: "Screen", row: 11, col: 6, dir: "across" },
      {
        word: "PROCESSOR",
        clue: "Brain of computer",
        row: 2,
        col: 10,
        dir: "down",
      },
    ],
  },

  // Puzzle 3: Food & Drink
  {
    size: 12,
    words: [
      {
        word: "PIZZA",
        clue: "Italian favorite",
        row: 0,
        col: 3,
        dir: "across",
      },
      { word: "BURGER", clue: "American classic", row: 2, col: 1, dir: "down" },
      { word: "SUSHI", clue: "Japanese dish", row: 1, col: 7, dir: "across" },
      { word: "PASTA", clue: "Italian noodles", row: 4, col: 4, dir: "across" },
      { word: "CHOCOLATE", clue: "Sweet treat", row: 6, col: 0, dir: "down" },
      { word: "COFFEE", clue: "Morning drink", row: 3, col: 9, dir: "across" },
      { word: "TEA", clue: "Popular beverage", row: 5, col: 6, dir: "down" },
      {
        word: "ICE CREAM",
        clue: "Frozen dessert",
        row: 8,
        col: 2,
        dir: "across",
      },
      { word: "TACO", clue: "Mexican food", row: 7, col: 5, dir: "down" },
      { word: "SALAD", clue: "Healthy dish", row: 9, col: 8, dir: "across" },
      { word: "CURRY", clue: "Spicy dish", row: 0, col: 0, dir: "down" },
      { word: "SANDWICH", clue: "Bread meal", row: 10, col: 3, dir: "across" },
      { word: "PANCAKE", clue: "Breakfast item", row: 4, col: 10, dir: "down" },
      { word: "DONUT", clue: "Sweet ring", row: 11, col: 1, dir: "across" },
      {
        word: "BIRYANI",
        clue: "Indian rice dish",
        row: 2,
        col: 11,
        dir: "down",
      },
    ],
  },

  // Puzzle 4: Space & Science
  {
    size: 12,
    words: [
      { word: "PLANET", clue: "Orbiting body", row: 0, col: 2, dir: "across" },
      { word: "GALAXY", clue: "Star system", row: 2, col: 0, dir: "down" },
      { word: "ROCKET", clue: "Space vehicle", row: 1, col: 6, dir: "across" },
      { word: "ASTEROID", clue: "Space rock", row: 4, col: 3, dir: "across" },
      {
        word: "BLACKHOLE",
        clue: "Massive gravity",
        row: 6,
        col: 1,
        dir: "down",
      },
      {
        word: "GRAVITY",
        clue: "Force pulling down",
        row: 3,
        col: 8,
        dir: "across",
      },
      { word: "NEBULA", clue: "Star nursery", row: 5, col: 5, dir: "down" },
      {
        word: "SATELLITE",
        clue: "Orbiting object",
        row: 8,
        col: 4,
        dir: "across",
      },
      {
        word: "ASTRONAUT",
        clue: "Space traveler",
        row: 7,
        col: 2,
        dir: "down",
      },
      { word: "TELESCOPE", clue: "Star viewer", row: 9, col: 7, dir: "across" },
      { word: "METEOR", clue: "Shooting star", row: 0, col: 9, dir: "down" },
      { word: "COMET", clue: "Icy body", row: 10, col: 1, dir: "across" },
      { word: "UNIVERSE", clue: "Everything", row: 4, col: 0, dir: "down" },
      { word: "ORBIT", clue: "Path around", row: 11, col: 6, dir: "across" },
      {
        word: "SUPERNOVA",
        clue: "Exploding star",
        row: 2,
        col: 10,
        dir: "down",
      },
    ],
  },
];

let currentPuzzle = null;
let grid = [];
let userAnswers = [];

// Initialize game
function initGame() {
  currentPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
  grid = Array(currentPuzzle.size)
    .fill()
    .map(() => Array(currentPuzzle.size).fill(""));
  userAnswers = Array(currentPuzzle.size)
    .fill()
    .map(() => Array(currentPuzzle.size).fill(""));
  renderGrid();
  renderClues();
  document.getElementById("status").textContent = "";
}

function renderGrid() {
  const gridEl = document.getElementById("grid");
  gridEl.innerHTML = "";
  gridEl.style.gridTemplateColumns = `repeat(${currentPuzzle.size}, 45px)`;

  for (let i = 0; i < currentPuzzle.size; i++) {
    for (let j = 0; j < currentPuzzle.size; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = i;
      cell.dataset.col = j;

      // Check if cell has a letter from any word
      const hasLetter = currentPuzzle.words.some((word) => {
        if (
          word.dir === "across" &&
          word.row === i &&
          j >= word.col &&
          j < word.col + word.word.length
        ) {
          return true;
        }
        if (
          word.dir === "down" &&
          word.col === j &&
          i >= word.row &&
          i < word.row + word.word.length
        ) {
          return true;
        }
        return false;
      });

      if (!hasLetter) {
        cell.classList.add("black");
      } else {
        cell.contentEditable = true;
        cell.addEventListener("input", handleInput);
        cell.addEventListener("focus", () => highlightWord(i, j));
      }

      gridEl.appendChild(cell);
    }
  }
}

function handleInput(e) {
  const row = parseInt(e.target.dataset.row);
  const col = parseInt(e.target.dataset.col);
  userAnswers[row][col] = e.target.textContent.trim().toUpperCase().slice(0, 1);
}

function highlightWord(row, col) {
  document
    .querySelectorAll(".cell")
    .forEach((cell) => cell.classList.remove("highlight"));

  currentPuzzle.words.forEach((word) => {
    if (
      word.dir === "across" &&
      word.row === row &&
      col >= word.col &&
      col < word.col + word.word.length
    ) {
      for (let c = word.col; c < word.col + word.word.length; c++) {
        document
          .querySelector(`.cell[data-row="${row}"][data-col="${c}"]`)
          .classList.add("highlight");
      }
    }
    if (
      word.dir === "down" &&
      word.col === col &&
      row >= word.row &&
      row < word.row + word.word.length
    ) {
      for (let r = word.row; r < word.row + word.word.length; r++) {
        document
          .querySelector(`.cell[data-row="${r}"][data-col="${col}"]`)
          .classList.add("highlight");
      }
    }
  });
}

function renderClues() {
  const across = document.getElementById("across-clues");
  const down = document.getElementById("down-clues");
  across.innerHTML = "";
  down.innerHTML = "";

  currentPuzzle.words.forEach((w, i) => {
    const li = document.createElement("li");
    li.textContent = `${w.clue} (${w.word.length})`;
    if (w.dir === "across") across.appendChild(li);
    else down.appendChild(li);
  });
}

function checkAnswers() {
  let correct = 0;
  let total = 0;

  currentPuzzle.words.forEach((word) => {
    let isCorrect = true;
    for (let i = 0; i < word.word.length; i++) {
      total++;
      let r = word.row;
      let c = word.col;

      if (word.dir === "across") c += i;
      else r += i;

      if (userAnswers[r][c] !== word.word[i]) {
        isCorrect = false;
      }
    }
    if (isCorrect) correct++;
  });

  const status = document.getElementById("status");
  if (correct === currentPuzzle.words.length) {
    status.innerHTML = "🎉 Perfect! You solved it!";
    status.className = "correct";
  } else {
    status.innerHTML = `✅ ${correct}/${currentPuzzle.words.length} words correct`;
    status.className = "";
  }
}

// Event Listeners
document.getElementById("newGame").addEventListener("click", initGame);
document.getElementById("reset").addEventListener("click", () => {
  userAnswers = Array(currentPuzzle.size)
    .fill()
    .map(() => Array(currentPuzzle.size).fill(""));
  document.querySelectorAll(".cell:not(.black)").forEach((cell) => {
    cell.textContent = "";
  });
  document.getElementById("status").textContent = "";
});

document.getElementById("check").addEventListener("click", checkAnswers);

// Start the game
initGame();
