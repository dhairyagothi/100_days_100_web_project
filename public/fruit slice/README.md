# 🍉 Fruit Slice

A fast-paced, browser-based fruit slicing game inspired by Fruit Ninja — built with pure HTML, CSS, and JavaScript using the Canvas API. Slice flying fruits, dodge bombs, chain combos, and chase the high score!

---

## 📌 Introduction

Fruit Slice is a single-page arcade game where fruits are launched from the bottom of the screen and the player slices them by dragging the mouse (or finger, on touch devices) across them. Bombs are mixed in among the fruits — slicing one costs a life. The game features increasing difficulty, combo scoring, particle effects, and persistent high scores.

---

## ✨ Features

- 🍇 **8 unique fruit types** — watermelon, orange, lemon, grape, strawberry, peach, pineapple, and kiwi — each with its own color, emoji, and point value
- 💣 **Bomb hazards** that increase in frequency as levels progress
- 🔥 **Combo system** — slicing 3+ fruits in quick succession doubles points and triggers a "COMBO!" popup
- 📈 **Progressive difficulty** — level increases every 30 points, spawning fruits faster and more frequently
- ❤️ **Lives system** — 3 hearts, lost by missing a fruit or slicing a bomb; game ends at 0 lives
- 🎯 **Line-circle collision detection** for accurate, fast-swipe slicing
- 🧃 **Visual effects** — juice splatter particles, ground splat stains, sliced fruit halves with rotation physics, and floating score text
- 🌌 **Animated starry background** with a radial gradient theme
- ⏸️ **Pause/Resume** via on-screen button or keyboard shortcuts (`Space` / `P`)
- 🏆 **High score tracking** using browser local storage
- 📱 **Touch support** for mobile devices
- 🖥️ **Fully responsive canvas** that adapts to window resizing
- 🎬 **Start, Pause, and Game Over overlay screens** with smooth transitions and animations

---

## 🛠️ Technologies Used

- **HTML5** — structure and Canvas element
- **CSS3** — styling, gradients, animations, and responsive layout
- **JavaScript (Vanilla)** — game logic, physics, rendering, and event handling
- **Canvas API** — real-time 2D rendering of fruits, particles, and effects
- **Google Fonts** — `Bangers` and `Nunito` for game-style typography
- **LocalStorage API** — persisting high scores across sessions

---

## 📂 Project Structure

```text
Fruit_Slice/
│
├── index.html        # Main game file (HTML + CSS + JS combined)
└── README.md          # Project documentation
```

---

## ⚙️ Installation

No build tools or dependencies required — this is a single self-contained HTML file.

1. Clone or download the repository:
   ```bash
   git clone https://github.com/dhairyagothi/100_days_100_web_project.git
   ```
2. Navigate to the Fruit Slice project folder.
3. Open `index.html` directly in any modern web browser (Chrome, Edge, Firefox).

That's it — no server or npm install needed!

---

## 🎮 Usage

1. Open the game in your browser.
2. Click **▶ PLAY NOW** on the start screen.
3. Move your mouse (or swipe on touch devices) quickly across fruits to slice them.
4. Avoid slicing 💣 bombs — each one costs a life.
5. Chain multiple slices quickly to build a combo and earn double points.
6. Survive as long as possible, level up, and beat your high score!
7. Use the pause button (⏸) or press `Space`/`P` to pause/resume at any time.

---

## 🚀 Future Enhancements

- 🎵 Add background music and slicing/explosion sound effects
- 🏅 Global/online leaderboard support
- 🍎 Special power-up fruits (slow motion, double points, extra life)
- 🎨 Multiple visual themes/skins
- 📊 Post-game stats (accuracy, best combo, fruits sliced)
- 🕹️ Difficulty selection (Easy/Medium/Hard) before starting
- 📱 On-screen mobile control improvements for smaller screens

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes and commit (`git commit -m "Add: your feature"`)
4. Push to your branch (`git push origin feature/your-feature`)
5. Open a Pull Request describing your changes

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 👩‍💻 Author

**Documentation — Sanyogita Singh**
