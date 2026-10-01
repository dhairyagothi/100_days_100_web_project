# Dots and Boxes

A classic two-player strategy board game where players draw lines between dots to claim boxes and outmaneuver their opponent.

## Description

Dots and Boxes is a timeless pencil-and-paper game brought to life as an interactive web application. Two players take turns drawing lines between dots on a grid. Completing the fourth side of a box claims it for that player and earns them another turn. The player who claims the most boxes by game's end wins. This implementation features a beautiful glassmorphic UI, real-time game state management, and a strategic challenge suitable for all ages.

## Features

- **Two-Player Gameplay**: Local multiplayer where players take turns on the same device
- **4×4 Grid**: 16 dots with 24 lines and 9 boxes to claim
- **Turn-Based Mechanics**: 
  - Draw a line by clicking between two adjacent dots
  - Complete a box to score a point and take another turn
  - Switch to opponent's turn if no box is completed
- **Score Tracking**: Real-time score display for both players with animated box claims
- **Game Statistics**:
  - Total moves counter
  - Completed boxes tracker
  - Turn indicator showing current player
  - Box claim visualization with star symbols
- **Color-Coded Players**:
  - Player 1: Blue lines and boxes
  - Player 2: Red lines and boxes
- **Visual Feedback**:
  - Hover effects on available lines
  - Animated box claiming with scale and opacity transitions
  - Active player card highlighting
  - Color-coded turn indicator
- **Win Detection**: Automatically declares winner or draw when all boxes are claimed
- **Game Restart**: One-click "New Game" button to reset and play again
- **Responsive Design**: Adapts layout for desktop, tablet, and mobile screens
- **Glassmorphism UI**: Modern frosted glass aesthetic with backdrop blur effects
- **Accessible**: ARIA labels for screen readers, keyboard-navigable
- **Message Display**: Real-time status updates (turn info, box claims, winner announcement)

## Tech Stack

- **HTML5** — semantic structure, button elements, ARIA labels for accessibility
- **CSS3** — CSS custom properties (variables), glassmorphism, backdrop filter, flexbox, CSS Grid, animations, responsive design, radial gradients
- **Vanilla JavaScript (ES6)** — game logic, turn management, box completion detection, state management, DOM manipulation, event handling

## Folder Structure

```text
Dots_And_Boxes/
│
├── index.html       # Game UI — navbar, player cards, board, messages
├── script.js         # Game logic — turn management, box detection, scoring, win conditions
├── style.css         # Glassmorphism styling, board rendering, animations, responsive layout
└── README.md         # Project documentation
```

## Setup / Run Instructions

No build step or dependencies required. Pure vanilla web technologies.

### Option 1: Open Directly
1. Navigate to the `Dots_And_Boxes` folder.
2. Double-click `index.html` to open in your browser.

### Option 2: Use a Local Server (recommended)
Using VS Code:
1. Install the **Live Server** extension.
2. Open the project folder in VS Code.
3. Right-click `index.html` → **Open with Live Server**.

## Usage

### Starting a Game
1. Open `index.html` in your browser
2. Game initializes automatically with Player 1 (Blue) ready
3. Read the message: "Click any open line between adjacent dots to begin"

### Drawing Lines

**To Draw a Line:**
1. Click on any open line between two adjacent dots
2. The line changes color to indicate which player claimed it
3. Hover over available lines to preview where you're clicking

**Line Positions:**
- **Horizontal Lines**: Click between dots on the same row
- **Vertical Lines**: Click between dots on the same column

### Completing Boxes

**Box Completion Rules:**
- A box needs all 4 sides to be drawn (top, bottom, left, right)
- When you complete a box:
  - It fills with your color
  - A ★ star appears in the center
  - You score 1 point
  - You get another turn (no turn switch)
- If you complete multiple boxes in one turn, you keep playing

### Winning the Game

**Game Ends When:**
- All 9 boxes on the grid are claimed
- The message displays the final score and winner
- Click "New Game" to play again

**Win Conditions:**
- Player with higher score wins
- If both players have equal scores, it's a draw

### Game Information

**Player Cards (Left & Right):**
- Shows player name (Player 1 / Player 2)
- Player avatar with color indicator
- Current score (number of boxes claimed)

**Turn Indicator Card:**
- Shows whose turn it is
- Highlights active player card in blue or red
- Updates after each line drawn

**Statistics Card:**
- **Total Moves**: Number of lines drawn so far
- **Completed Boxes**: Number of boxes claimed so far
- **Grid Size**: 4 × 4 (16 dots)
- **Total Boxes**: 9 boxes available to claim

**Legend:**
- Blue line = Player 1's claimed line
- Red line = Player 2's claimed line

### Restarting

**To Play Again:**
- Click the **New Game** button in the top-right
- Board resets, scores return to 0, Player 1 goes first
- Game is ready to begin

## How It Works

### Game Grid

The board is represented as:
- **Dots**: 4×4 grid (16 total) positioned using percentage-based layout
- **Lines**: 24 clickable lines connecting adjacent dots (12 horizontal + 12 vertical)
- **Boxes**: 9 boxes (3×3 grid) positioned between dots

```
(0,0) -- (0,1) -- (0,2) -- (0,3)
  |        |        |        |
(1,0) -- (1,1) -- (1,2) -- (1,3)
  |        |        |        |
(2,0) -- (2,1) -- (2,2) -- (2,3)
  |        |        |        |
(3,0) -- (3,1) -- (3,2) -- (3,3)
```

### Line Identification

Lines are identified by type, row, and column:
- **Horizontal Lines**: `h-row-col` (e.g., `h-0-0` for top-left horizontal line)
- **Vertical Lines**: `v-row-col` (e.g., `v-0-0` for top-left vertical line)

### Box Completion Detection

When a line is clicked, the game checks adjacent boxes:

```javascript
function checkCompletedBoxes(type, row, col) {
    // A horizontal line can complete boxes above or below it
    // A vertical line can complete boxes left or right of it
    // For each possible box, check if all 4 sides are drawn
    if (isBoxComplete(boxRow, boxCol)) {
        claimBox(boxRow, boxCol);
    }
}
```

For a box to be complete, all four sides must be selected:
- Top line
- Bottom line
- Left line
- Right line

### Turn Management

```javascript
function handleLineClick(event) {
    selectedLines[lineId] = currentPlayer;
    const boxesMade = checkCompletedBoxes(...);
    
    if (boxesMade > 0) {
        scores[currentPlayer] += boxesMade;
        // Player keeps turn (no switch)
    } else {
        switchPlayer(); // Switch to other player
    }
}
```

### Win Detection

Game ends when all boxes are claimed AND all lines are drawn:

```javascript
if (completedBoxes === totalBoxes && totalMoves === totalLines) {
    if (scores[1] > scores[2]) {
        declareWinner("Player 1");
    } else if (scores[2] > scores[1]) {
        declareWinner("Player 2");
    } else {
        announceDraw();
    }
}
```

## Implementation Notes

- **State Variables**: Game state tracked in `selectedLines` (claimed lines) and `claimedBoxes` (claimed boxes)
- **Turn Tracking**: `currentPlayer` switches only when no boxes are completed in a turn
- **Disabled Lines**: Once claimed, lines get `disabled: true` and `selected` class to prevent re-clicking
- **Responsive Positioning**: All elements use percentage-based positioning for responsive scaling
- **Color Scheme**:
  - Blue (`#3f63f4`) for Player 1
  - Red (`#f04444`) for Player 2
  - Muted gray (`#78829f`) for secondary text
- **Glassmorphism**: Cards use `backdrop-filter: blur(18px)` with semi-transparent backgrounds for modern aesthetic

## Educational Value

This project demonstrates:

- Game state management without external libraries
- Turn-based game logic implementation
- Box/line detection algorithms
- 2D grid coordinate system
- CSS Grid and Flexbox for responsive layouts
- CSS custom properties for theming
- Glassmorphism design pattern
- Animated transitions and scale transforms
- Event delegation and button handling
- ARIA labels for accessibility
- Dynamic score and message updates
- Win/loss condition detection

## Strategic Tips

- **Control the Center**: Early moves in the center of the board offer more strategic options
- **Sacrifice Lines**: Avoid leaving three sides of a box open to your opponent
- **Trap Strategy**: Try to force your opponent to complete boxes in bad positions
- **Chain Moves**: Completing a box gives you another turn—use it to set up more boxes

## Future Enhancements

Potential improvements:

- **AI Opponent**: Single-player mode against computer with difficulty levels
- **Undo Move**: Take back the last line drawn
- **Custom Grid Sizes**: Play on 3×3 (4 boxes), 5×5 (16 boxes), etc.
- **Game Replays**: Replay moves from previous games
- **Move History**: View and navigate through all moves
- **Timer Mode**: Speed-play with time limits per turn
- **Leaderboard**: Track wins/losses across sessions with localStorage
- **Sound Effects**: Audio feedback for line draws and box completions
- **Animations**: Confetti or celebration effects for wins
- **Mobile Optimizations**: Touch-friendly button sizing
- **Multiplayer Online**: WebSocket support for remote play
- **Accessibility Features**: High contrast mode, larger text options
- **Tutorial Mode**: Interactive guide for new players

## Browser Compatibility

Works on all modern browsers supporting:
- ES6 JavaScript
- CSS Flexbox and Grid
- CSS custom properties
- CSS backdrop-filter

**Tested on**: Chrome, Firefox, Safari, Edge

## License

This project is open-source and available for educational and personal use.

## Author

Contributed as part of the [100 Days 100 Web Projects](../../README.md) challenge.
