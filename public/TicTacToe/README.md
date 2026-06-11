# 🎮 Neon Tic Tac Toe

A modern, feature-rich Tic Tac Toe experience built with vanilla JavaScript, featuring multiple AI difficulty levels, advanced statistics tracking, customizable themes, move history, win streak analytics, and immersive visual effects.

Designed with a futuristic neon-inspired interface and responsive layout, the game provides both casual fun and competitive replayability.

---

## ✨ Features

### 🎯 Core Gameplay

* Classic 3×3 Tic Tac Toe board
* Real-time turn tracking
* Automatic win and draw detection
* Winning line highlighting
* Quick new-round restart
* Full score tracking across rounds

### 🤖 Multiple Game Modes

Choose how you want to play:

| Mode             | Description                                         |
| ---------------- | --------------------------------------------------- |
| Player vs Player | Two players on the same device                      |
| CPU Easy         | Random move selection                               |
| CPU Medium       | Smarter move logic with basic strategy              |
| CPU Hard         | Advanced AI prioritizing winning and blocking moves |

---

## 📊 Advanced Statistics Dashboard

Track your performance across every game session.

### Available Metrics

* Total Games Played
* Player X Victories
* Player O Victories
* Draw Matches
* X Win Percentage
* O Win Percentage
* Current Winning Streak
* Best Winning Streak

### Visual Analytics

* Dynamic progress bars
* Real-time win rate calculations
* Performance distribution tracking
* Streak monitoring system

Statistics automatically update after every completed match.

---

## 🏆 Scoreboard System

Live scoreboard displaying:

* Player X Score
* Player O Score
* Draw Count

Scores persist between rounds until manually reset.

---

## 🎨 Theme System

Switch between multiple visual styles instantly:

### Neon

Cyberpunk-inspired glowing interface with vibrant accents.

### Pastel

Soft and colorful aesthetic with minimal contrast.

### Mono

Clean monochrome design focused on simplicity.

Theme selection updates the entire interface in real time.

---

## 🧠 Smart Gameplay Tools

### Hint System

Need help?

The hint engine suggests a strong next move based on the current board state.

### Undo Move

Made a mistake?

Undo the previous move and continue playing.

### Move History

Review every move made during the current game through the built-in history panel.

---

## 🎉 Interactive Effects

### Winner Modal

Dedicated victory screen after each match.

### Confetti Celebration

Animated confetti effect when a player wins.

### Smooth Animations

Polished transitions throughout the interface.

### Responsive Feedback

Visual indicators for:

* Active player
* Current turn
* Winning state
* Selected theme

---

## 💾 Persistent Storage

Game data is automatically stored using the browser's LocalStorage API.

### Stored Data

| Key                       | Purpose                           |
| ------------------------- | --------------------------------- |
| `neon-tic-tac-toe-stats`  | Statistics and streak information |
| `neon-tic-tac-toe-scores` | Current scoreboard values         |
| `neon-tic-tac-toe-theme`  | Selected theme preference         |

Players can leave and return without losing progress.

---

## 📱 Responsive Design

Optimized for:

* Desktop
* Laptop
* Tablet
* Mobile Devices

The layout automatically adapts to different screen sizes.

---

## 🛠 Technology Stack

### Frontend

* HTML5
* CSS3
* Vanilla JavaScript (ES6+)

### Browser APIs

* LocalStorage API
* Canvas API
* DOM Manipulation API

### Design

* Glassmorphism UI
* Neon Effects
* Responsive Layouts
* Modern Typography

---

## 📂 Project Structure

```text
TicTacToe/
├── index.html
├── style.css
├── script.js
├── favicon.png
├── preview.png
├── victory.mp3
└── README.md
```

---

## 🚀 Getting Started

### Clone the Repository

```bash
git clone <repository-url>
```

### Open the Project

```bash
cd TicTacToe
```

Open `index.html` directly in your browser or serve locally:

```bash
python -m http.server 8000
```

Visit:

```text
http://localhost:8000
```

---

## 🎮 How to Play

1. Select a game mode.
2. Choose your preferred theme.
3. Click any empty square to place your mark.
4. Align three symbols horizontally, vertically, or diagonally.
5. Win rounds and build streaks.
6. Track your performance using the statistics dashboard.

---

## 🔄 Reset Options

### New Round

Starts a fresh round while keeping scores and statistics.

### Reset Scores

Clears the current scoreboard.

### Reset Statistics

Removes all stored statistics, streaks, and analytics after confirmation.

---

## 🌟 Highlights

* No external frameworks
* Lightweight and fast
* Advanced statistics system
* Three unique themes
* Multiple AI difficulty levels
* Persistent game data
* Mobile-friendly experience
* Modern UI/UX design

---

## 📄 License

This project is available for educational, personal, and portfolio use.

---

Built with ❤️ using HTML, CSS, and JavaScript.
