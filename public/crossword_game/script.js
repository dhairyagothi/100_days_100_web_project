// ─────────────────────────────────────────────────────────────────────────────
// PUZZLE DATA  – each puzzle is fully validated:
//   • Every across word occupies a UNIQUE row   (no same-row across conflicts)
//   • Every down  word occupies a UNIQUE column (no same-col  down  conflicts)
//   • All words fit within the 12×12 grid       (no out-of-bounds)
//   • Cross-direction intersections use matching letters (verified in comments)
// ─────────────────────────────────────────────────────────────────────────────
const puzzles = [

  // ── PUZZLE 1: Animals ────────────────────────────────────────────────────
  {
    size: 12,
    words: [
      // Across  (rows 0, 2, 4, 6, 8, 9, 10 – one per row)
      { word: "ELEPHANT", clue: "Largest land animal",    row: 0,  col: 2,  dir: "across" },
      { word: "GIRAFFE",  clue: "Tallest animal",         row: 2,  col: 0,  dir: "across" },
      { word: "ZEBRA",    clue: "Striped horse",          row: 4,  col: 6,  dir: "across" },
      { word: "OCTOPUS",  clue: "8-armed sea creature",   row: 6,  col: 2,  dir: "across" },
      { word: "DOLPHIN",  clue: "Intelligent sea mammal", row: 8,  col: 1,  dir: "across" },
      { word: "MONKEY",   clue: "Tree-swinging primate",  row: 9,  col: 6,  dir: "across" },
      { word: "KOALA",    clue: "Australian bear",        row: 10, col: 1,  dir: "across" },
      // Down  (cols 0, 2, 3, 9, 10, 11 – one per column)
      { word: "GORILLA",  clue: "Largest primate",        row: 2,  col: 0,  dir: "down"   },
      // (2,0): GIRAFFE[0]=G = GORILLA[0]=G ✓
      { word: "RHINO",    clue: "Horned mammal",          row: 2,  col: 2,  dir: "down"   },
      // (2,2): GIRAFFE[2]=R = RHINO[0]=R ✓   (6,2): OCTOPUS[0]=O = RHINO[4]=O ✓
      { word: "PANDA",    clue: "Bamboo eater",           row: 1,  col: 3,  dir: "down"   },
      // (2,3): GIRAFFE[3]=A = PANDA[1]=A ✓
      { word: "TIGER",    clue: "Striped big cat",        row: 0,  col: 9,  dir: "down"   },
      // (0,9): ELEPHANT[7]=T = TIGER[0]=T ✓   (4,9): ZEBRA[3]=R = TIGER[4]=R ✓
      { word: "LION",     clue: "King of the jungle",     row: 5,  col: 10, dir: "down"   },
      { word: "PENGUIN",  clue: "Flightless bird",        row: 1,  col: 11, dir: "down"   },
    ],
  },

  // ── PUZZLE 2: Technology ─────────────────────────────────────────────────
  {
    size: 12,
    words: [
      // Across  (rows 0, 2, 4, 6, 8, 10 – one per row)
      { word: "COMPUTER", clue: "Electronic device",        row: 0,  col: 0,  dir: "across" },
      { word: "KEYBOARD", clue: "Typing device",            row: 2,  col: 2,  dir: "across" },
      { word: "INTERNET", clue: "Global network",           row: 4,  col: 0,  dir: "across" },
      { word: "DATABASE", clue: "Organised data store",     row: 6,  col: 2,  dir: "across" },
      { word: "NETWORK",  clue: "Connected devices",        row: 8,  col: 0,  dir: "across" },
      { word: "DISPLAY",  clue: "Screen output",            row: 10, col: 2,  dir: "across" },
      // Down  (cols 1, 4, 9, 10, 11 – one per column)
      { word: "ONLINE",   clue: "Connected to the internet", row: 0, col: 1,  dir: "down"  },
      // (0,1): COMPUTER[1]=O = ONLINE[0]=O ✓   (4,1): INTERNET[1]=N = ONLINE[4]=N ✓
      { word: "RATIO",    clue: "Mathematical proportion",   row: 4,  col: 4,  dir: "down"  },
      // (4,4): INTERNET[4]=R = RATIO[0]=R ✓
      // (6,4): DATABASE[2]=T = RATIO[2]=T ✓   (8,4): NETWORK[4]=O = RATIO[4]=O ✓
      { word: "DRONE",    clue: "Unmanned aerial vehicle",   row: 2,  col: 9,  dir: "down"  },
      // (2,9): KEYBOARD[7]=D = DRONE[0]=D ✓   (6,9): DATABASE[7]=E = DRONE[4]=E ✓
      { word: "CLOUD",    clue: "Remote storage system",     row: 2,  col: 10, dir: "down"  },
      { word: "ROBOT",    clue: "Automated machine",         row: 4,  col: 11, dir: "down"  },
    ],
  },

  // ── PUZZLE 3: Food & Drink ───────────────────────────────────────────────
  {
    size: 12,
    words: [
      // Across  (rows 0, 2, 4, 6, 8, 10, 11 – one per row)
      { word: "PIZZA",    clue: "Italian favorite",          row: 0,  col: 0,  dir: "across" },
      { word: "SUSHI",    clue: "Japanese dish",             row: 2,  col: 5,  dir: "across" },
      { word: "BURGER",   clue: "American classic",          row: 4,  col: 0,  dir: "across" },
      { word: "COFFEE",   clue: "Morning drink",             row: 6,  col: 4,  dir: "across" },
      { word: "SANDWICH", clue: "Bread-based meal",          row: 8,  col: 1,  dir: "across" },
      { word: "SALAD",    clue: "Healthy dish",              row: 10, col: 3,  dir: "across" },
      { word: "DONUT",    clue: "Sweet glazed ring",         row: 11, col: 0,  dir: "across" },
      // Down  (cols 4, 8, 10, 11 – one per column)
      { word: "APPLE",    clue: "Red or green fruit",        row: 0,  col: 4,  dir: "down"  },
      // (0,4): PIZZA[4]=A = APPLE[0]=A ✓   (4,4): BURGER[4]=E = APPLE[4]=E ✓
      { word: "HAKE",     clue: "White sea fish",            row: 2,  col: 8,  dir: "down"  },
      // (2,8): SUSHI[3]=H = HAKE[0]=H ✓
      { word: "RICE",     clue: "Asian staple grain",        row: 6,  col: 10, dir: "down"  },
      { word: "MILK",     clue: "Dairy drink",               row: 4,  col: 11, dir: "down"  },
    ],
  },

  // ── PUZZLE 4: Space & Science ────────────────────────────────────────────
  {
    size: 12,
    words: [
      // Across  (rows 0, 2, 4, 6, 8, 10, 11 – one per row)
      { word: "PLANET",   clue: "Orbiting body",             row: 0,  col: 2,  dir: "across" },
      { word: "ROCKET",   clue: "Space launch vehicle",      row: 2,  col: 0,  dir: "across" },
      { word: "COMET",    clue: "Icy celestial body",        row: 4,  col: 4,  dir: "across" },
      { word: "GALAXY",   clue: "Vast star system",          row: 6,  col: 0,  dir: "across" },
      { word: "METEOR",   clue: "Shooting star",             row: 8,  col: 3,  dir: "across" },
      { word: "NEBULA",   clue: "Star-forming gas cloud",    row: 10, col: 1,  dir: "across" },
      { word: "ORBIT",    clue: "Path around a planet",      row: 11, col: 5,  dir: "across" },
      // Down  (cols 2, 7, 8, 10, 11 – one per column)
      { word: "CRAWL",    clue: "Move at very low speed",    row: 2,  col: 2,  dir: "down"  },
      // (2,2): ROCKET[2]=C = CRAWL[0]=C ✓   (6,2): GALAXY[2]=L = CRAWL[4]=L ✓
      { word: "THEME",    clue: "Central subject",           row: 0,  col: 7,  dir: "down"  },
      // (0,7): PLANET[5]=T = THEME[0]=T ✓   (4,7): COMET[3]=E = THEME[4]=E ✓
      { word: "TOWER",    clue: "Tall launch structure",     row: 4,  col: 8,  dir: "down"  },
      // (4,8): COMET[4]=T = TOWER[0]=T ✓   (8,8): METEOR[5]=R = TOWER[4]=R ✓
      { word: "NOVA",     clue: "Stellar explosion",         row: 6,  col: 10, dir: "down"  },
      { word: "STAR",     clue: "Burning ball of gas",       row: 8,  col: 11, dir: "down"  },
    ],
  },
];

let currentPuzzle = null;
let grid = [];
let userAnswers = [];

// Tracks the current typing direction ('across' or 'down') for auto-advance
let currentDirection = "across";

// Maps "row,col" -> clue number, following standard left-to-right top-to-bottom order
let clueNumbers = {};

// ---------- Initialisation ----------

/**
 * Assigns sequential clue numbers to word-start cells in standard crossword
 * order: left-to-right, top-to-bottom. A cell gets a number if it is the
 * start of at least one word (across or down). Both words sharing a start
 * cell receive the same number.
 */
function computeClueNumbers(puzzle) {
  const seen = new Set();
  const positions = [];

  puzzle.words.forEach((word) => {
    const key = `${word.row},${word.col}`;
    if (!seen.has(key)) {
      seen.add(key);
      positions.push({ row: word.row, col: word.col });
    }
  });

  // Standard crossword order: row first, then column
  positions.sort((a, b) =>
    a.row !== b.row ? a.row - b.row : a.col - b.col
  );

  const numbers = {};
  positions.forEach((pos, idx) => {
    numbers[`${pos.row},${pos.col}`] = idx + 1;
  });

  return numbers;
}

function initGame() {
  currentPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
  grid = Array(currentPuzzle.size)
    .fill()
    .map(() => Array(currentPuzzle.size).fill(""));
  userAnswers = Array(currentPuzzle.size)
    .fill()
    .map(() => Array(currentPuzzle.size).fill(""));
  currentDirection = "across";
  // Compute canonical numbering before rendering
  clueNumbers = computeClueNumbers(currentPuzzle);
  renderGrid();
  renderClues();
  document.getElementById("status").textContent = "";
}

// ---------- Rendering ----------

function renderGrid() {
  const gridEl = document.getElementById("grid");
  gridEl.innerHTML = "";
  gridEl.style.gridTemplateColumns = `repeat(${currentPuzzle.size}, 45px)`;

  for (let i = 0; i < currentPuzzle.size; i++) {
    for (let j = 0; j < currentPuzzle.size; j++) {
      const cell = document.createElement("input");
      cell.type = "text";
      cell.maxLength = 1;
      cell.classList.add("cell");
      cell.dataset.row = i;
      cell.dataset.col = j;

      // Show the canonical clue number as placeholder on word-start cells
      const clueNum = clueNumbers[`${i},${j}`];
      if (clueNum !== undefined) {
        cell.placeholder = clueNum;
      }

      // Determine if this cell belongs to any word
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
        cell.disabled = true;
        cell.readOnly = true;
        cell.tabIndex = -1;
      } else {
        cell.addEventListener("input", handleInput);
        cell.addEventListener("keydown", handleNavigation);
        cell.addEventListener("focus", () => {
          highlightWord(i, j);
          // When the user clicks a cell, detect which direction(s) it belongs to
          // and keep the current direction if valid, otherwise switch.
          const inAcross = currentPuzzle.words.some(
            (w) =>
              w.dir === "across" &&
              w.row === i &&
              j >= w.col &&
              j < w.col + w.word.length
          );
          const inDown = currentPuzzle.words.some(
            (w) =>
              w.dir === "down" &&
              w.col === j &&
              i >= w.row &&
              i < w.row + w.word.length
          );
          if (inAcross && !inDown) currentDirection = "across";
          else if (inDown && !inAcross) currentDirection = "down";
          // If both, keep current direction (toggle on double-click is handled via keydown)
        });
      }

      gridEl.appendChild(cell);
    }
  }
}

// ---------- Input handling ----------

function handleInput(e) {
  const row = parseInt(e.target.dataset.row);
  const col = parseInt(e.target.dataset.col);

  // FIX: cells are <input> elements — use .value, not .textContent
  let value = e.target.value.toUpperCase().replace(/[^A-Z]/g, "").charAt(0);
  e.target.value = value;

  // Remove any previous validation colouring when user types
  e.target.classList.remove("cell-correct", "cell-wrong");

  userAnswers[row][col] = value;

  // Auto-advance to the next cell after a letter is entered
  if (value) {
    moveFocus(row, col, currentDirection, 1);
  }
}

// ---------- Keyboard navigation ----------

function handleNavigation(e) {
  const row = Number(e.target.dataset.row);
  const col = Number(e.target.dataset.col);

  switch (e.key) {
    case "ArrowRight":
      e.preventDefault();
      currentDirection = "across";
      moveFocus(row, col, "across", 1);
      break;

    case "ArrowLeft":
      e.preventDefault();
      currentDirection = "across";
      moveFocus(row, col, "across", -1);
      break;

    case "ArrowDown":
      e.preventDefault();
      currentDirection = "down";
      moveFocus(row, col, "down", 1);
      break;

    case "ArrowUp":
      e.preventDefault();
      currentDirection = "down";
      moveFocus(row, col, "down", -1);
      break;

    case "Backspace":
      // If the cell already has a value, clear it and stay put.
      // If the cell is already empty, move to the previous cell and clear that.
      if (e.target.value === "") {
        e.preventDefault();
        const prevCell = getAdjacentCell(row, col, currentDirection, -1);
        if (prevCell) {
          const pr = parseInt(prevCell.dataset.row);
          const pc = parseInt(prevCell.dataset.col);
          prevCell.value = "";
          userAnswers[pr][pc] = "";
          prevCell.classList.remove("cell-correct", "cell-wrong");
          prevCell.focus();
        }
      } else {
        // Let the browser clear the value, then record it
        // We use setTimeout so the value is already cleared by the browser
        setTimeout(() => {
          e.target.value = "";
          userAnswers[row][col] = "";
          e.target.classList.remove("cell-correct", "cell-wrong");
        }, 0);
      }
      break;

    // Allow default tab behaviour so keyboard users can tab through cells
    case "Tab":
      break;

    default:
      break;
  }
}

// ---------- Focus movement helpers ----------

/**
 * Returns the next/previous non-black cell in the given direction, or null.
 * @param {number} row
 * @param {number} col
 * @param {'across'|'down'} direction
 * @param {1|-1} step  – 1 = forward, -1 = backward
 */
function getAdjacentCell(row, col, direction, step) {
  let nextRow = row + (direction === "down" ? step : 0);
  let nextCol = col + (direction === "across" ? step : 0);

  // Walk until we find a valid (non-black) cell or go out of bounds
  while (
    nextRow >= 0 &&
    nextRow < currentPuzzle.size &&
    nextCol >= 0 &&
    nextCol < currentPuzzle.size
  ) {
    const candidate = document.querySelector(
      `.cell[data-row="${nextRow}"][data-col="${nextCol}"]`
    );
    if (candidate && !candidate.classList.contains("black")) {
      return candidate;
    }
    // Skip black cells and keep moving
    nextRow += direction === "down" ? step : 0;
    nextCol += direction === "across" ? step : 0;
  }
  return null;
}

/**
 * Move keyboard focus one step from the current cell in the given direction.
 */
function moveFocus(row, col, direction, step) {
  const nextCell = getAdjacentCell(row, col, direction, step);
  if (nextCell) {
    nextCell.focus();
    // Select so any existing letter is replaced by the next keystroke
    nextCell.select();
  }
}

// ---------- Word / cell highlighting ----------

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
          ?.classList.add("highlight");
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
          ?.classList.add("highlight");
      }
    }
  });
}

// ---------- Clues ----------

function renderClues() {
  const acrossEl = document.getElementById("across-clues");
  const downEl = document.getElementById("down-clues");
  acrossEl.innerHTML = "";
  downEl.innerHTML = "";

  // Separate words by direction, then sort each group by their canonical number
  // so the sidebar list order always matches the grid numbering.
  const acrossWords = currentPuzzle.words
    .filter((w) => w.dir === "across")
    .sort(
      (a, b) =>
        clueNumbers[`${a.row},${a.col}`] - clueNumbers[`${b.row},${b.col}`]
    );

  const downWords = currentPuzzle.words
    .filter((w) => w.dir === "down")
    .sort(
      (a, b) =>
        clueNumbers[`${a.row},${a.col}`] - clueNumbers[`${b.row},${b.col}`]
    );

  acrossWords.forEach((w) => {
    const num = clueNumbers[`${w.row},${w.col}`];
    const li = document.createElement("li");
    li.textContent = `${num}. ${w.clue} (${w.word.length})`;
    acrossEl.appendChild(li);
  });

  downWords.forEach((w) => {
    const num = clueNumbers[`${w.row},${w.col}`];
    const li = document.createElement("li");
    li.textContent = `${num}. ${w.clue} (${w.word.length})`;
    downEl.appendChild(li);
  });
}

// ---------- Answer checking ----------

function checkAnswers() {
  // Clear old validation colours
  document
    .querySelectorAll(".cell")
    .forEach((cell) => cell.classList.remove("cell-correct", "cell-wrong"));

  let correctWords = 0;
  const totalWords = currentPuzzle.words.length;

  currentPuzzle.words.forEach((word) => {
    let wordCorrect = true;

    for (let i = 0; i < word.word.length; i++) {
      const r = word.dir === "across" ? word.row : word.row + i;
      const c = word.dir === "across" ? word.col + i : word.col;

      const cell = document.querySelector(
        `.cell[data-row="${r}"][data-col="${c}"]`
      );

      const userChar = userAnswers[r][c];
      const solutionChar = word.word[i];

      if (userChar === solutionChar) {
        // Only mark correct if not already marked wrong by a crossing word
        if (!cell.classList.contains("cell-wrong")) {
          cell.classList.add("cell-correct");
        }
      } else {
        // Wrong always wins over correct (crossing-word tie-break)
        cell.classList.remove("cell-correct");
        cell.classList.add("cell-wrong");
        wordCorrect = false;
      }
    }

    if (wordCorrect) correctWords++;
  });

  const status = document.getElementById("status");
  if (correctWords === totalWords) {
    status.innerHTML = "🎉 Perfect! You solved it!";
    status.className = "correct";
  } else {
    status.innerHTML = `✅ ${correctWords}/${totalWords} words correct`;
    status.className = "";
  }
}

// ---------- Event listeners ----------

document.getElementById("newGame").addEventListener("click", initGame);

document.getElementById("reset").addEventListener("click", () => {
  userAnswers = Array(currentPuzzle.size)
    .fill()
    .map(() => Array(currentPuzzle.size).fill(""));

  // FIX: clear input values (not textContent) and remove validation colours
  document.querySelectorAll(".cell:not(.black)").forEach((cell) => {
    cell.value = "";
    cell.classList.remove("cell-correct", "cell-wrong");
  });

  document.getElementById("status").textContent = "";
});

document.getElementById("check").addEventListener("click", checkAnswers);

// Remove word highlighting when clicking outside the grid
document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("cell")) {
    document
      .querySelectorAll(".cell")
      .forEach((cell) => cell.classList.remove("highlight"));
  }
});

// Start the game
initGame();