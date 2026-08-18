# Quantum Codebreaker

A futuristic cyber-themed code-breaking puzzle game inspired by **Mastermind**, where players must deduce a hidden 4-node quantum matrix before the system enters lockdown.

## 🚀 Overview

**Quantum Codebreaker** challenges players to identify a secret sequence of four colored quantum nodes within a limited number of attempts and under a strict countdown timer.

Using feedback provided after each probe, players must logically determine the correct sequence before system integrity reaches critical failure.

---

## 🎮 Gameplay

### Objective

Discover the hidden 4-node matrix key before:

* All **8 attempts** are used.
* The **120-second countdown** expires.

### How It Works

1. Press **Start Operation**.
2. Select colors from the **Quantum Node Color Picker**.
3. Fill the four slots in the **Active Sequence Deck**.
4. Launch a probe using **Fire Quantum Probe**.
5. Analyze the feedback pegs.
6. Repeat until the correct sequence is found or the system locks down.

---

## 🧩 Feedback System

Each submitted probe returns feedback indicators:

| Indicator | Meaning                                     |
| --------- | ------------------------------------------- |
| 🟢 Green  | Correct color in the correct position       |
| 🟡 Yellow | Correct color in the wrong position         |
| 🔴 Red    | Color does not exist in the secret sequence |

### Position Mapping

The node positions correspond to:

```text
Top Left     = Node 1
Top Right    = Node 2
Bottom Left  = Node 3
Bottom Right = Node 4
```

---

## ✨ Features

### Cyberpunk Interface

* Futuristic terminal-inspired design
* Dynamic streaming background canvas
* CRT scanline effects
* Glassmorphism-inspired panels

### Strategic Gameplay

* Randomized secret code generation
* Real-time attempt tracking
* Countdown timer system
* System integrity monitoring
* Historical guess tracking

### Responsive Design

* Desktop and mobile support
* Adaptive layout using CSS Grid
* Touch-friendly controls

---

## 🏗 Project Structure

```text
project/
│
├── index.html      # Main application structure
├── style.css       # Visual design and layout
├── script.js       # Game logic and interactions
└── README.md       # Documentation
```

---

## 🖥 Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript (ES6)

### UI Enhancements

* CSS Grid
* Flexbox
* CSS Variables
* Canvas API
* Font Awesome Icons

---

## 🎨 Color Palette

| Node    | Color   |
| ------- | ------- |
| Cyan    | #00BCD4 |
| Magenta | #E91E63 |
| Yellow  | #FFEB3B |
| Purple  | #9C27B0 |
| Orange  | #FF9800 |
| Green   | #4CAF50 |

---

## ⚙ Installation

### Clone Repository

```bash
git clone https://github.com/dhairyagothi/100_days_100_web_project/public/quantum-codebreaker.git
```

### Open Project

Simply open:

```text
index.html
```

in your browser.

No build tools or dependencies are required.

---

## 🔧 Future Improvements

Potential enhancements include:

* Multiple difficulty levels
* Sound effects and ambient cyber audio
* Score tracking system
* Online leaderboard
* Power-ups and hints
* Custom themes
* Local storage game statistics

---

## 📱 Responsive Support

The interface automatically adapts for:

* Desktop
* Tablet
* Mobile devices

Layouts collapse into a single-column format on smaller screens for improved usability.

---

## 🏆 Winning Condition

You win when all four positions receive:

```text
🟢 🟢 🟢 🟢
```

The complete quantum matrix is successfully decoded.

---

## 📜 License

This project is available under the MIT License.

---

## Author

Created as a cyber-themed puzzle game inspired by classic code-breaking mechanics and futuristic terminal interfaces.
