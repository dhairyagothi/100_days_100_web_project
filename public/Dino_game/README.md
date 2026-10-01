<div align="center">

# 🦖 Chrome Dino - T-Rex Runner

**A fully playable, web-based clone of the classic offline Chrome Dinosaur game.**

[![GSSoC 2026](https://img.shields.io/badge/GSSoC-2026-F96F36?style=for-the-badge&logo=girlscript)](#)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](#)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](#)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](#)

</div>

<br/>

## 🦖 About The Project

This project is a fully playable, web-based clone of the classic offline Chrome Dinosaur game. It brings the nostalgic T-Rex runner to life using vanilla web technologies and an added touch of modern responsive design via Bootstrap for the overlays. This project is a part of the `100_days_100_web_project` repository, located in the `public/Dino_game` directory.

---

## ✨ Key Features

*   **Core Mechanics**: Fully functioning jumping and ducking physics for the T-Rex.
*   **Dynamic Obstacles**: Randomly generates different obstacles including multiple types of cacti and flying birds.
*   **Progressive Difficulty**: The game speed gradually increases as your score gets higher.
*   **High Score Tracking**: Automatically saves your highest score using the browser's `localStorage`.
*   **Retro Aesthetic**: Uses CSS `image-rendering: pixelated` on the canvas element to maintain that classic, retro visual style.
*   **Responsive UI**: Start and Game Over overlays are built and styled utilizing Bootstrap 5.3.3.
*   **Cross-Platform Controls**: Full support for keyboard input, mobile touch screens, and mouse clicks.

---

## 📁 Project Structure

```text
Dino_game/
├── index.html   # Main semantic structure and canvas container
├── styles.css       # Core styling, responsive layouts, and UI animations
├── script.js        # Main game logic, physics, rendering, and event listeners
└── README.md        # Project documentation
```
## 🛠️ Technologies Used

*   **HTML5**: Structure and Canvas API integration for rendering the retro 2D pixel world.
*   **CSS3**: Custom pixelated image rendering, responsive layouts, text shadows, background gradients, and keyframe animations.
*   **JavaScript (Vanilla)**: All core game logic, including custom velocity/gravity physics, obstacle generation, dynamic scoring, and local storage state persistence.
*   **Bootstrap 5.3.3**: Utility classes and pre-styled responsive containers for clean start/end overlay screens.

---

## 🎮 How to Play

### Controls
*   **Start / Restart**: Press `Spacebar`, `Enter`, `ArrowUp`, or simply tap/click the screen.
*   **Jump**: Press `Spacebar`, `ArrowUp`, or tap/click to leap over cacti and flying birds.
*   **Duck**: Press and hold `ArrowDown` to duck under low-flying obstacles.

---

## 🚀 How to Run Locally

1. **Clone the repository** to your local machine.
2. **Navigate** to the `public/Dino_game` directory.
3. **Open the `index (1).html` file** directly in any modern web browser.
    * *Note: No external build tools, compilers, or local servers are required to run this project!*

---

## 🤝 Contribution

This documentation was created and enhanced as part of **GSSoC 2026 (GirlScript Summer of Code)** under open source contribution guidelines.

### Contributor
**[Ananya Joshi](https://github.com/ananyajoshi-cseai)** *GSSoC 2026 Contributor*
