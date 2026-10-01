<div align="center">

# 🎮 Connect Four Multiplayer

**A modern, neon-themed take on the classic Connect Four strategy game, built with smooth animations and dynamic win detection.**

[![GSSoC 2026](https://img.shields.io/badge/GSSoC-2026-F96F36?style=for-the-badge&logo=girlscript)](#)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](#)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](#)

</div>

<br/>

## 🌌 About The Project

Drop discs into the grid and connect four in a row before your opponent does. This project elevates the traditional two-player board game by introducing a futuristic, cybernetic UI. Featuring deep dark-mode backgrounds, glowing neon accents, and satisfying particle bursts, it provides an immersive and highly interactive browser-based gaming experience.

---

## ✨ Key Features

* 🕹️ **Two-Player Gameplay:** Compete locally against a friend, alternating turns as Player 1 (Red) and Player 2 (Yellow).
* 🧠 **Smart Win Detection:** The game engine automatically calculates horizontal, vertical, and diagonal connections across the 6x7 grid.
* 📊 **Live Game Tracking:** A dynamic scorebar actively monitors the current turn, while a dedicated status row tracks the total number of moves made.
* 🎨 **Cybernetic UI:** Designed with a striking dark mode interface, utilizing glassmorphism panels, cyan/pink neon gradients, and deep glowing shadows.
* 🎉 **Dynamic Celebrations:** Winning triggers a custom animated particle burst and glowing pulses on the winning discs.
* 📱 **Responsive Design:** The game board scales fluidly, adapting seamlessly to both desktop monitors and smaller mobile screens.

---

## 📁 Project Structure

```text
Connect-Four/
├── index.html      # Semantic game structure and layout
├── script.js       # Game logic, win detection, and DOM updates
├── style.css       # Neon styling, responsive grids, and keyframe animations
└── README.md       # Project documentation
```
## 🛠️ Technologies Used

* **HTML5:** Provides the semantic structure and accessibility attributes (`aria-live`, `role="grid"`).
* **CSS3:** Utilizes CSS variables for theme colors, CSS Grid for the 6x7 board layout, and advanced `@keyframes` for the celebration effects.
* **JavaScript (ES6+):** Manages the game state, handles player turns, traverses the array to detect win conditions, and generates dynamic DOM particles.

---

## 🎲 How to Play

1. **Start the Game:** Player 1 (Red) always moves first.
2. **Make a Move:** Click on any of the 7 columns to drop your disc into the lowest available slot.
3. **Strategize:** Block your opponent while trying to line up 4 of your own discs horizontally, vertically, or diagonally.
4. **Win or Draw:** The game ends when a player successfully connects four discs, or when the board fills up completely (a draw).
5. **Play Again:** Click the "Restart Game" button at any time to clear the board and reset the move counter.

---

## 🚀 How to Run Locally

1. Clone or download the repository to your local machine.
2. Navigate to the `Connect-Four` directory.
3. Open the `index.html` file in any modern web browser.
   * *No internet connection, dependencies, or build tools are required to play!*

---

## 🤝 Contribution

This documentation was created and enhanced as part of **GSSoC 2026 (GirlScript Summer of Code)** under open source contribution guidelines.

### Contributor
**[Ananya Joshi](https://github.com/ananyajoshi-cseai)** *GSSoC 2026 Contributor*
