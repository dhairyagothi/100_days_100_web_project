# Flood Fill Territory Game

A fast-paced two-player strategy board game where players claim cells using flood-fill expansion, with classic and time-attack modes for competitive gameplay.

## Description

Flood Fill Territory Game is an interactive territory conquest game featuring two players competing on a customizable grid. Click an empty cell to claim it—the flood-fill algorithm automatically expands to adjacent empty cells, spreading your territory across the board. Opponent territory acts as a barrier, blocking expansion and creating strategic chokepoints. Choose between unlimited moves (Classic mode) or high-pressure 30-second turns (Time Attack mode) to test your decision-making under pressure. The player controlling the most cells when the board fills wins!

## Features

- **Two Game Modes**:
  - **Classic Mode**: Unlimited time per turn, strategic planning at your pace
  - **Time Attack Mode**: 30 seconds per turn with countdown timer, real-time pressure (⏱️ with color warnings)
  
- **Flood-Fill Mechanics**: Click any empty cell to claim it and adjacent empty neighbors (1-cell radius expansion)
  
- **Customizable Board Sizes**: 6×6, 8×8, 10×10 (default), 12×12, 15×15 grids for varied game lengths
  
- **Real-Time Scoring System**:
  - Live cell count and percentage ownership for each player
  - Move counter tracking total claims
  - Progress bar showing board coverage
  - Detailed opponent territory expansion tracking
  
- **Dynamic Timer** (Time Attack mode):
  - Green (30-10s): Normal time remaining
  - Yellow (10-5s): Warning threshold
  - Red + pulsing (≤5s): Danger zone
  - Auto-turn switch on timeout
  
- **Visual Feedback**:
  - Claimed cells glow with pop animation (scale 0.86→1.06→1)
  - Recently claimed cells highlight briefly (280ms "just-claimed" state)
  - Owned cells disabled and visually distinct (Player 1 = blue, Player 2 = red)
  - Turn indicator card with player color and timer display
  
- **Game Statistics**:
  - Player 1 & 2 territory percentages
  - Total claimed cells vs. grid size
  - Move count history
  - Celebration highlight animation on game end
  
- **Responsive Design**: Adapts from desktop (3-column layout) to mobile (single column)
  
- **Accessibility**: ARIA labels, semantic HTML buttons, live region for status updates
  
- **Keyboard Support**: 'R' key to restart game instantly

## Tech Stack

- **HTML5** — semantic grid structure, form selectors, accessible button elements, ARIA labels
- **CSS3** — CSS variables (colors, shadows), glass-morphism design, CSS Grid, Flexbox, animations (pulse, pop, highlight), responsive media queries
- **Vanilla JavaScript (ES6)** — flood-fill algorithm (BFS), game state management, timer loop, DOM manipulation, event delegation

## Folder Structure

```text
Flood_Fill_Territory_Game/
│
├── index.html      # Game shell — board, controls, stats panel, rules
├── script.js        # Game logic, flood-fill, turn management, timer
├── style.css        # Glass-morphic UI, animations, responsive layout
└── README.md        # Project documentation
```

## Setup / Run Instructions

No build step or dependencies required. Pure web technologies.

### Option 1: Open Directly
1. Navigate to the `Flood_Fill_Territory_Game` folder.
2. Double-click `index.html` to open in your browser.

### Option 2: Use a Local Server (recommended)
Using VS Code:
1. Install the **Live Server** extension.
2. Open the project folder in VS Code.
3. Right-click `index.html` → **Open with Live Server**.

## Usage

### Starting a Game

1. **Select Board Size**: Choose 6×6, 8×8, 10×10, 12×12, or 15×15 from the dropdown (default: 10×10)
2. **Choose Game Mode**: Select **Classic** (unlimited time) or **Time Attack** (30 seconds per turn)
3. **Click a Cell**: Click any empty cell to begin claiming territory

### Playing the Game

**Basic Flow**:
1. Current player clicks an empty cell
2. Flood-fill algorithm claims that cell plus adjacent empty neighbors (1-cell radius)
3. Cell count updates in real-time
4. Turn passes to opponent
5. Repeat until board is full

**Territory Capture**:
- **Your Move**: Click an empty cell → it claims that cell and floods to adjacent empty cells
- **Neighbor Limit**: Flood-fill only expands 1 cell outward from your click (not unlimited)
- **Blocking**: Opponent's cells block expansion, creating strategic frontiers
- **Cell Color**: Your cells stay your color; claimed cells are disabled (can't be clicked again)

**Time Attack Mode** (if selected):
- Timer shows at top: ⏱️ [seconds] s
- Green (30-10s): Plenty of time
- Yellow (10-5s): Hurry up!
- Red + pulse (≤5s): Last few seconds!
- Auto-switch: If timer runs out, turn passes to opponent
- Reset: Timer resets to 30 each turn (on successful move)

### Monitoring Progress

**Left Panel** (Stats):
- **Player Scores**: Blue (P1) and Red (P2) cells owned and ownership percentage
- **Claimed Cells**: Progress bar + text showing [claimed] / [total]
- **Move Count**: Total moves made in this game
- **Status Message**: Real-time feedback ("X cells captured", "Your turn!", etc.)

**Top Panel** (Turn Card):
- Shows current player name and color
- Displays timer in Time Attack mode
- Updates with player turn switches

### Winning

**Game End Conditions**:
- Board is completely filled (no empty cells remain)
- Winner determined by who owns more cells
- Celebration animation: all cells pulse highlight (3× pulse)
- Result message: "🏆 Player 1 wins!", "🏆 Player 2 wins!", or "🤝 Draw game!"

### Restarting

- **Restart Button** (🔄): Click to reset and start new game with current settings
- **Keyboard**: Press 'R' to restart instantly
- **Mode/Size Change**: Changing either setting asks for confirmation, then restarts

## How It Works

### Flood Fill Algorithm (BFS)

```javascript
function floodFill(startRow, startCol, player) {
  const visited = Array.from(...).fill(false);
  const queue = [[startRow, startCol, 0]];  // [row, col, depth]
  
  while (queue.length > 0) {
    const [row, col, depth] = queue.shift();
    
    if (board[row][col] !== EMPTY) continue;
    
    board[row][col] = player;
    capturedCells.push(`${row}-${col}`);
    
    // Only expand if depth < 1 (one-cell radius limit)
    if (depth >= FLOOD_RADIUS) continue;
    
    // Check all 4 neighbors
    directions.forEach(([rowStep, colStep]) => {
      const nextRow = row + rowStep;
      const nextCol = col + colStep;
      
      if (isInsideBoard(nextRow, nextCol) && !visited[nextRow][nextCol] && board[nextRow][nextCol] === EMPTY) {
        visited[nextRow][nextCol] = true;
        queue.push([nextRow, nextCol, depth + 1]);
      }
    });
  }
  
  return capturedCells;  // Set of claimed cell coordinates
}
```

**How It Works**:
1. Start at clicked cell (depth 0)
2. Mark it as claimed for current player
3. Check 4 adjacent neighbors (up, down, left, right)
4. If neighbor is empty and unvisited, add to queue with depth 1
5. Process neighbors: if depth < 1, add their neighbors (depth 2, exceeds limit, stops)
6. Result: Original cell + immediate neighbors claimed

### Game State Management

```javascript
let board = [];        // 2D array: 0=empty, 1=player1, 2=player2
let currentPlayer = 1; // Track turn
let gameOver = false;  // Block moves when finished
let moveCount = 0;     // Count total moves
```

**Turn Flow**:
1. Player clicks cell
2. Validate: cell must be empty
3. Execute flood-fill for player
4. Update DOM with newly claimed cells
5. Check if board full → end game or switch turn

### Timer System (Time Attack Mode)

```javascript
function startTimer() {
  timeRemaining = TIME_LIMIT;  // 30 seconds
  
  timer = setInterval(() => {
    timeRemaining -= 1;
    updateTimerDisplay();
    
    if (timeRemaining <= 0) {
      handleTimeout();  // Switch turn
    }
  }, 1000);  // Tick every second
}

function handleTimeout() {
  resultMessage.textContent = `⏱️ ${players[currentPlayer].name} ran out of time!`;
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  resetTimer();  // Restart for new player
}
```

**Timer States**:
- Green: >= 10 seconds
- Yellow: 5–10 seconds
- Red + pulse animation: < 5 seconds

### Scoring Calculation

```javascript
function getScores() {
  let player1 = 0, player2 = 0;
  
  board.forEach(row => {
    row.forEach(owner => {
      if (owner === 1) player1 += 1;
      if (owner === 2) player2 += 1;
    });
  });
  
  return { player1, player2 };
}

// Percentage = (player cells / total cells) × 100
const percent1 = Math.round((scores.player1 / totalCells) * 100);
```

### Visual Feedback: Just-Claimed Animation

```javascript
if (recentlyClaimed.has(key)) {
  cell.classList.add("just-claimed");
  window.setTimeout(() => cell.classList.remove("just-claimed"), 280);
}
```

**CSS Animation**:
```css
@keyframes claimPop {
  0%   { transform: scale(0.86); }
  70%  { transform: scale(1.06); }
  100% { transform: scale(1); }
}

.cell.just-claimed {
  animation: claimPop 260ms ease both;
}
```

## Implementation Notes

- **Flood-Fill Radius**: Fixed at `FLOOD_RADIUS = 1` (1-cell expansion only), creating balanced gameplay
- **CSS Variables**: `--blue`, `--red`, `--muted`, `--panel`, etc. for consistent theming
- **Timer Reset**: Resets on each successful move in Time Attack, not on timeout (encourages quick decisions)
- **Board Sizing**: CSS Grid with `aspect-ratio: 1` and `clamp()` for responsive square cells
- **Visited Tracking**: Separate 2D array prevents duplicate processing in BFS queue
- **Disabled State**: Claimed cells set `disabled="true"` to block re-claiming
- **Event Delegation**: Single click handler on all cells (no per-cell listener needed)
- **Performance**: Game state stored in arrays, not DOM (faster game logic)
- **Accessibility**: ARIA labels include row/column numbers; live region for status updates

## Educational Value

This project demonstrates:

- **Flood-Fill Algorithm**: BFS with depth limiting for controlled territory expansion
- **Game State Management**: Turn-based logic, validation, and win conditions
- **JavaScript Timers**: `setInterval()` and `setTimeout()` for game loops and animations
- **DOM Manipulation**: Dynamic grid generation, class toggling, text updates
- **CSS Animations**: Keyframes for pop, pulse, and highlight effects
- **Responsive Design**: Mobile-first layout with CSS Grid and media queries
- **Accessibility**: ARIA labels, semantic HTML, keyboard shortcuts
- **2D Array Algorithms**: Board representation, neighbor checking, flood-fill traversal
- **Real-Time Score Calculation**: Counting and percentage math
- **Event Handling**: Click validation, event delegation, keyboard shortcuts

## Common Scenarios

**Quick Solo Test**:
1. Open index.html
2. Select 6×6 board (fastest game)
3. Play Classic mode for relaxed learning

**Strategy Practice**:
1. Choose 10×10 board
2. Classic mode for time to think
3. Study how flood-fill expands around obstacles

**Competitive Play**:
1. 10×10 or larger board
2. Time Attack mode
3. High-speed decision-making under pressure

**Educational Demo**:
1. Open DevTools (F12)
2. Add console logs to `floodFill()` function
3. Observe BFS queue processing
4. Watch visited array updates

## Future Enhancements

Potential improvements:

- **Difficulty Levels**: AI opponent with varying strategies (random, greedy, minimax)
- **Undo/Redo**: Move history stack to revert decisions (not just restart)
- **Replay System**: Save and replay game moves
- **Leaderboard**: Track wins/losses, calculate Elo rating
- **Custom Color Themes**: Player 1 & 2 color pickers
- **Sound Effects**: Claim pop sound, timer warning beep, win chime
- **Touch Optimization**: Prevent hover states on mobile, improve tap targets
- **Advanced Flood Fill**: Variable radius expansion (radius 0, 1, 2, 3+)
- **Power-ups**: Temporary radius boost, freeze opponent, double points
- **Network Multiplayer**: WebSocket or Firebase for real-time remote play
- **Analytics**: Win rate tracking, average game length, hot zones on board
- **Accessibility Modes**: High contrast, larger text, screen reader support
- **Animation Tweaking**: Adjustable speed for particles, transitions
- **Board Presets**: Obstacle patterns, asymmetric maps, custom layouts

## Browser Compatibility

Works on all modern browsers supporting:
- ES6 JavaScript
- CSS Grid and Flexbox
- CSS animations and transitions
- CSS backdrop-filter (for glass-morphism)
- Array methods (Array.from(), forEach())

**Tested on**: Chrome, Firefox, Safari, Edge

**Not supported**: IE11 (lacks CSS Grid, Backdrop Filter)

## Accessibility

- **Semantic HTML**: `<button>`, `<select>`, `<label>` elements
- **ARIA Labels**: Each cell labeled with row/column number (e.g., "Claim row 1, column 1")
- **Live Region**: Result message has `aria-live="polite"` for status updates
- **Keyboard Navigation**: Tab through buttons and selects
- **Keyboard Shortcut**: 'R' to restart without mouse
- **Color Contrast**: Blue (#16c7ff) and Red (#ff3f68) chosen for accessibility
- **Focus States**: Visible outline on focused elements
- **Disabled State**: Claimed cells have `disabled` attribute to prevent re-clicking

## Performance Notes

- **Lightweight**: Single file game, minimal DOM manipulation
- **Efficient Updates**: Only re-render changed cells and scores
- **CSS Transitions**: Hardware-accelerated via GPU
- **No Flicker**: DOM updates batched before reflow
- **Memory Efficient**: Board array reused across turns, timers cleared properly
- **Smooth Animations**: 60fps capability via CSS keyframes

## License

This project is open-source and available for educational and personal use.

## Author

Contributed as part of the [100 Days 100 Web Projects](../../README.md) challenge.
