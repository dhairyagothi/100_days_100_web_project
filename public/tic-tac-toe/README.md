# Tic Tac Toe Odyssey

A portfolio-grade, interactive, and highly optimized **Tic Tac Toe Game** built using modern web standards (Vanilla HTML5, CSS3, and JavaScript). It features a clean, responsive light glassmorphism dashboard layout that remains completely locked in height with zero layout shifts.

## 🚀 Key Features

### 🎮 Game Modes
- 👤 **Local PvP**: Pass and play with a friend locally.
- 🤖 **Player vs AI (Easy)**: AI plays random available cells.
- 🤖 **Player vs AI (Medium)**: AI prioritizes immediate wins and blocks opponent victories.
- 🤖 **Player vs AI (Hard)**: Uses a full search **Minimax Algorithm** to create an unbeatable opponent.

### 🔬 Advanced Gameplay Mechanics
- **AI Thought Process (Explainable AI)**: The AI panel explains its "thought process" in real-time, detailing *why* it made each decision.
- **Dynamic Tabs Card**: Groups user statistics, win records, and unlocked badge achievements inside a compact tabbed card using CSS transitions to bring information above the fold.
- **Match Replay Engine**: Allows step-by-step playbacks of completed matches with auto-play, step forward, and step backward controls.
- **Move History Horizontal Scroll**: Shows chronological coordinates of moves (e.g. `X: R1C2`) with horizontal scrollbars.
- **Blitz Timer**: Optional 10-second turn limit that forfeits the active player's turn on timeout.
- **Undo last move**: Instantly roll back gameplay.
- **Session Auto-Save**: Saves play states to `localStorage` so sessions can be restored on page refreshes.

### 🎹 Audio Synthesis & Themes
- **Web Audio API Synth Engine**: Synthesizes custom square, sine, and triangle waves for clicking, winning, drawing, and badge unlocks directly in the browser—guaranteeing 100% audio loading reliability offline.
- **Light Glassmorphism Design**: Frosted glass cards (`rgba(255,255,255,0.65)`), soft drop shadows, pastel indicators, and floating decorative background orbs.
- **Aria Keyboard Accessibility**: Navigation via arrow keys, Enter/Space placement, and fully focusable board elements.

---

## 🛠️ Folder Structure

```text
tic-tac-toe/
│
├── index.html       # Three-column responsive grid layout
├── style.css        # Glassmorphic themes and zero-shift layout locks
├── script.js        # Main game controller and event binder
├── ai.js            # Decision engine, minimax solver, and explanations
├── storage.js       # Persistent stats, records, and badge manager
└── sounds.js        # Audio wave generator via Web Audio API synth
```

---

## 🧠 AI Deep Dive: Minimax Algorithm

Since the game is locked to the classic $3 \times 3$ grid size, the total search space is tiny (a maximum of $9! = 362,880$ terminal leaf nodes). 

The AI exploits this by running a **full minimax search** (depth 9) upon every hard-level turn.
1. The minimax solver recursively calculates every possible match path.
2. It assigns scores of $+100$ (win), $-100$ (loss), or $0$ (draw), factoring in search depth to favor quicker victories.
3. This creates a flawless, unbeatable AI agent that moves in under $1$ms.
