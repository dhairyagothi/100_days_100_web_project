// Game State Variables
let size = 4;
let mode = 'ai'; // 'ai' or 'pvp'
let difficulty = 'smart'; // 'easy' or 'smart'
let currentPlayer = 1; // 1 or 2
let scores = { 1: 0, 2: 0 };
let hLines = [];
let vLines = [];
let boxes = [];
let aiTimerId = null;

// DOM Elements
const gameBoardEl = document.getElementById('game-board');
const modeSelect = document.getElementById('mode-select');
const difficultySelect = document.getElementById('difficulty-select');
const difficultyGroup = document.getElementById('difficulty-group');
const sizeSelect = document.getElementById('size-select');
const restartBtn = document.getElementById('restart-btn');

const p1NameDisplay = document.getElementById('p1-name-display');
const p2NameDisplay = document.getElementById('p2-name-display');
const p1ScoreEl = document.getElementById('p1-score');
const p2ScoreEl = document.getElementById('p2-score');
const player1Card = document.getElementById('player1-card');
const player2Card = document.getElementById('player2-card');
const statusMessageEl = document.getElementById('status-message');

const modalOverlay = document.getElementById('game-over-modal');
const modalTitle = document.getElementById('modal-title');
const modalResult = document.getElementById('modal-result');
const modalP1Label = document.getElementById('modal-p1-label');
const modalP2Label = document.getElementById('modal-p2-label');
const modalP1Score = document.getElementById('modal-p1-score');
const modalP2Score = document.getElementById('modal-p2-score');
const modalPlayAgain = document.getElementById('modal-play-again');

// Initialize Game
function initGame() {
  // Clear any active AI turns
  if (aiTimerId) {
    clearTimeout(aiTimerId);
    aiTimerId = null;
  }

  // Get Settings
  size = parseInt(sizeSelect.value);
  mode = modeSelect.value;
  difficulty = difficultySelect.value;
  currentPlayer = 1;
  scores[1] = 0;
  scores[2] = 0;

  // Toggle Difficulty Select visibility
  if (mode === 'pvp') {
    difficultyGroup.style.display = 'none';
    p2NameDisplay.textContent = 'Player 2';
  } else {
    difficultyGroup.style.display = 'flex';
    p2NameDisplay.textContent = 'AI Opponent';
  }

  // Initialize Line & Box Arrays
  // hLines: (size + 1) rows, each size cols
  hLines = Array.from({ length: size + 1 }, () => Array(size).fill(false));
  // vLines: size rows, each (size + 1) cols
  vLines = Array.from({ length: size }, () => Array(size + 1).fill(false));
  // boxes: size rows, each size cols
  boxes = Array.from({ length: size }, () => Array(size).fill(0));

  // Reset DOM Board
  buildDOMBoard();

  // Reset UI State
  gameBoardEl.style.pointerEvents = 'auto';
  document.body.classList.remove('ai-thinking');
  modalOverlay.style.display = 'none';

  updateUI();
}

// Build the SVG-free grid elements using CSS Grid columns/rows
function buildDOMBoard() {
  gameBoardEl.innerHTML = '';
  
  // Set template columns & rows
  let trackStr = '';
  for (let i = 0; i < size; i++) {
    trackStr += 'var(--grid-line-size, 16px) 1fr ';
  }
  trackStr += 'var(--grid-line-size, 16px)';
  
  gameBoardEl.style.gridTemplateColumns = trackStr;
  gameBoardEl.style.gridTemplateRows = trackStr;

  // Generate grid children row-by-row
  for (let r = 0; r <= 2 * size; r++) {
    for (let c = 0; c <= 2 * size; c++) {
      const isRowEven = r % 2 === 0;
      const isColEven = c % 2 === 0;

      if (isRowEven && isColEven) {
        // Dot
        const dotEl = document.createElement('div');
        dotEl.className = 'dot';
        gameBoardEl.appendChild(dotEl);
      } 
      else if (isRowEven && !isColEven) {
        // Horizontal Line
        const lineRow = r / 2;
        const lineCol = (c - 1) / 2;
        
        const lineEl = document.createElement('div');
        lineEl.className = 'line horizontal';
        lineEl.dataset.type = 'h';
        lineEl.dataset.row = lineRow;
        lineEl.dataset.col = lineCol;

        const innerEl = document.createElement('div');
        innerEl.className = 'line-inner';
        lineEl.appendChild(innerEl);

        lineEl.addEventListener('click', () => handleLineClick('h', lineRow, lineCol, lineEl));
        gameBoardEl.appendChild(lineEl);
      } 
      else if (!isRowEven && isColEven) {
        // Vertical Line
        const lineRow = (r - 1) / 2;
        const lineCol = c / 2;

        const lineEl = document.createElement('div');
        lineEl.className = 'line vertical';
        lineEl.dataset.type = 'v';
        lineEl.dataset.row = lineRow;
        lineEl.dataset.col = lineCol;

        const innerEl = document.createElement('div');
        innerEl.className = 'line-inner';
        lineEl.appendChild(innerEl);

        lineEl.addEventListener('click', () => handleLineClick('v', lineRow, lineCol, lineEl));
        gameBoardEl.appendChild(lineEl);
      } 
      else {
        // Box
        const boxRow = (r - 1) / 2;
        const boxCol = (c - 1) / 2;

        const boxEl = document.createElement('div');
        boxEl.className = 'box';
        boxEl.dataset.row = boxRow;
        boxEl.dataset.col = boxCol;

        const ownerEl = document.createElement('span');
        ownerEl.className = 'box-owner';
        boxEl.appendChild(ownerEl);

        gameBoardEl.appendChild(boxEl);
      }
    }
  }
}

// Click Handler
function handleLineClick(type, r, c, lineEl) {
  // Ignore clicks if line is already drawn, or if it is AI's turn
  if (lineEl.classList.contains('drawn') || (mode === 'ai' && currentPlayer === 2)) return;

  // Mark line as drawn in state
  if (type === 'h') {
    hLines[r][c] = true;
  } else {
    vLines[r][c] = true;
  }

  // Visual Update
  lineEl.classList.add('drawn', `p${currentPlayer}-drawn`);

  // Check boxes completion
  const completedBox = checkAndCompleteBoxes(type, r, c);
  
  updateUI();

  // Check Game Over
  if (scores[1] + scores[2] === size * size) {
    endGame();
    return;
  }

  if (completedBox) {
    // Player retains their turn, do nothing else
  } else {
    // Switch turn
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updateUI();

    // Trigger AI move if vs AI
    if (mode === 'ai' && currentPlayer === 2) {
      triggerAIMove();
    }
  }
}

// Check adjacent boxes and complete if all 4 lines are drawn
function checkAndCompleteBoxes(type, r, c) {
  let boxesCompleted = false;
  const adjacentBoxes = getAdjacentBoxes(type, r, c);

  for (const box of adjacentBoxes) {
    if (isBoxComplete(box.r, box.c)) {
      boxes[box.r][box.c] = currentPlayer;
      scores[currentPlayer]++;

      // Update Box DOM
      const boxEl = document.querySelector(`.box[data-row="${box.r}"][data-col="${box.c}"]`);
      if (boxEl) {
        boxEl.classList.add(`completed-p${currentPlayer}`);
        const ownerEl = boxEl.querySelector('.box-owner');
        if (ownerEl) {
          ownerEl.textContent = currentPlayer === 1 ? '1' : (mode === 'pvp' ? '2' : 'AI');
        }
      }
      boxesCompleted = true;
    }
  }

  return boxesCompleted;
}

// Get boxes adjacent to a line
function getAdjacentBoxes(type, r, c) {
  const list = [];
  if (type === 'h') {
    // Box above (r-1, c) and box below (r, c)
    if (r > 0) list.push({ r: r - 1, c: c });
    if (r < size) list.push({ r: r, c: c });
  } else {
    // Box left (r, c-1) and box right (r, c)
    if (c > 0) list.push({ r: r, c: c - 1 });
    if (c < size) list.push({ r: r, c: c });
  }
  return list;
}

// Check if a single box is complete
function isBoxComplete(boxR, boxC) {
  return hLines[boxR][boxC] &&         // top
         hLines[boxR + 1][boxC] &&     // bottom
         vLines[boxR][boxC] &&         // left
         vLines[boxR][boxC + 1];       // right
}

// Count lines drawn for a box
function countBoxLinesDrawn(boxR, boxC) {
  let count = 0;
  if (hLines[boxR][boxC]) count++;
  if (hLines[boxR + 1][boxC]) count++;
  if (vLines[boxR][boxC]) count++;
  if (vLines[boxR][boxC + 1]) count++;
  return count;
}

// Check if drawing a line completes a box
function countBoxesCompletedByMove(type, r, c) {
  if (type === 'h') hLines[r][c] = true;
  else vLines[r][c] = true;

  let count = 0;
  const adjacent = getAdjacentBoxes(type, r, c);
  for (const box of adjacent) {
    if (isBoxComplete(box.r, box.c)) {
      count++;
    }
  }

  if (type === 'h') hLines[r][c] = false;
  else vLines[r][c] = false;

  return count;
}

// Check if drawing a line is safe (doesn't create a 3rd line for any box)
function isMoveSafe(type, r, c) {
  if (type === 'h') hLines[r][c] = true;
  else vLines[r][c] = true;

  let safe = true;
  const adjacent = getAdjacentBoxes(type, r, c);
  for (const box of adjacent) {
    if (countBoxLinesDrawn(box.r, box.c) === 3) {
      safe = false;
      break;
    }
  }

  if (type === 'h') hLines[r][c] = false;
  else vLines[r][c] = false;

  return safe;
}

// Count how many boxes are made 3-sided by this line
function countBoxesMadeThreeSided(type, r, c) {
  if (type === 'h') hLines[r][c] = true;
  else vLines[r][c] = true;

  let count = 0;
  const adjacent = getAdjacentBoxes(type, r, c);
  for (const box of adjacent) {
    if (countBoxLinesDrawn(box.r, box.c) === 3) {
      count++;
    }
  }

  if (type === 'h') hLines[r][c] = false;
  else vLines[r][c] = false;

  return count;
}

// Calculate the best AI Move
function getBestAIMove() {
  const openLines = [];

  // Gather h-lines
  for (let r = 0; r <= size; r++) {
    for (let c = 0; c < size; c++) {
      if (!hLines[r][c]) openLines.push({ type: 'h', r, c });
    }
  }
  // Gather v-lines
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size; c++) {
      if (!vLines[r][c]) openLines.push({ type: 'v', r, c });
    }
  }

  if (openLines.length === 0) return null;

  if (difficulty === 'easy') {
    const idx = Math.floor(Math.random() * openLines.length);
    return openLines[idx];
  }

  // Smart AI Logic:
  // 1. Check for immediate completing moves (gives AI points and extra turn)
  const completingMoves = [];
  for (const move of openLines) {
    const completedCount = countBoxesCompletedByMove(move.type, move.r, move.c);
    if (completedCount > 0) {
      completingMoves.push({ move, count: completedCount });
    }
  }

  if (completingMoves.length > 0) {
    // Sort to prefer completing 2 boxes in one move
    completingMoves.sort((a, b) => b.count - a.count);
    return completingMoves[0].move;
  }

  // 2. Play safe moves (moves that do not give the opponent an opportunity to complete a box)
  const safeMoves = [];
  const unsafeMoves = [];

  for (const move of openLines) {
    if (isMoveSafe(move.type, move.r, move.c)) {
      safeMoves.push(move);
    } else {
      unsafeMoves.push(move);
    }
  }

  if (safeMoves.length > 0) {
    const idx = Math.floor(Math.random() * safeMoves.length);
    return safeMoves[idx];
  }

  // 3. Forced unsafe moves: Pick a move that minimizes the immediate box giveaway (prefers making 1 box 3-sided over 2)
  let bestForcedMove = null;
  let minThreeSided = Infinity;

  for (const move of unsafeMoves) {
    const threeSidedCount = countBoxesMadeThreeSided(move.type, move.r, move.c);
    if (threeSidedCount < minThreeSided) {
      minThreeSided = threeSidedCount;
      bestForcedMove = move;
    }
  }

  if (bestForcedMove) return bestForcedMove;

  // Fallback
  return openLines[Math.floor(Math.random() * openLines.length)];
}

// Trigger AI Move Loop
function triggerAIMove() {
  gameBoardEl.style.pointerEvents = 'none';
  document.body.classList.add('ai-thinking');

  aiTimerId = setTimeout(() => {
    const move = getBestAIMove();
    if (!move) return;

    // Draw the line in state
    if (move.type === 'h') {
      hLines[move.r][move.c] = true;
    } else {
      vLines[move.r][move.c] = true;
    }

    // Find and update DOM
    const lineEl = document.querySelector(`.line[data-type="${move.type}"][data-row="${move.r}"][data-col="${move.c}"]`);
    if (lineEl) {
      lineEl.classList.add('drawn', 'p2-drawn');
    }

    const completed = checkAndCompleteBoxes(move.type, move.r, move.c);
    updateUI();

    // Check Game Over
    if (scores[1] + scores[2] === size * size) {
      endGame();
      return;
    }

    if (completed) {
      // AI completed a box, gets another turn!
      triggerAIMove();
    } else {
      // Return turn to Player 1
      currentPlayer = 1;
      gameBoardEl.style.pointerEvents = 'auto';
      document.body.classList.remove('ai-thinking');
      updateUI();
    }
  }, 700);
}

// Update Active/In-active indicators, messages and scores
function updateUI() {
  p1ScoreEl.textContent = scores[1];
  p2ScoreEl.textContent = scores[2];

  if (currentPlayer === 1) {
    player1Card.classList.add('p1-active');
    player2Card.classList.remove('p2-active');
    statusMessageEl.textContent = "Player 1's turn";
    document.body.classList.remove('p2-turn');
  } else {
    player2Card.classList.add('p2-active');
    player1Card.classList.remove('p1-active');
    statusMessageEl.textContent = mode === 'pvp' ? "Player 2's turn" : "AI is thinking...";
    document.body.classList.add('p2-turn');
  }
}

// End Game Modal display
function endGame() {
  modalP1Score.textContent = scores[1];
  modalP2Score.textContent = scores[2];
  modalP1Label.textContent = 'Player 1';
  modalP2Label.textContent = mode === 'pvp' ? 'Player 2' : 'AI Opponent';

  if (scores[1] > scores[2]) {
    modalResult.textContent = 'Player 1 Wins!';
  } else if (scores[2] > scores[1]) {
    modalResult.textContent = mode === 'pvp' ? 'Player 2 Wins!' : 'AI Opponent Wins!';
  } else {
    modalResult.textContent = 'It\'s a Tie!';
  }

  modalOverlay.style.display = 'flex';
}



// Event Listeners for Controls
modeSelect.addEventListener('change', initGame);
difficultySelect.addEventListener('change', initGame);
sizeSelect.addEventListener('change', initGame);
restartBtn.addEventListener('click', initGame);
modalPlayAgain.addEventListener('click', initGame);

// Load game on start
window.addEventListener('DOMContentLoaded', initGame);
