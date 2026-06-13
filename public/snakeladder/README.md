# 🐍 Snake & Ladder 🎮

A modern, interactive, and visually appealing implementation of the classic **Snake & Ladder** board game built using **HTML, CSS, and JavaScript**.

## ✨ Features

* 🎲 Animated dice rolling
* 🐍 Interactive snakes with custom graphics
* 🪜 Beautiful ladder rendering
* 🔊 Sound effects using Web Audio API
* 🎉 Winner celebration with confetti effects
* 👥 Two-player gameplay
* 📜 Live game activity log
* 📱 Responsive design for desktop and mobile devices
* 🎨 Modern UI with smooth animations
* 🏆 Winner screen with game statistics
* 🔄 Restart and New Game options

---

## 🚀 How to Play

1. Enter names for both players.
2. Click **Start Game**.
3. Players take turns rolling the dice.
4. Land on:

   * 🪜 A ladder to climb up.
   * 🐍 A snake to slide down.
5. Reach exactly **100** to win.
6. If a roll exceeds 100, the player bounces back according to the game rules.

---

## 🎮 Game Rules

* Each player starts at position **1**.
* Players roll a six-sided dice.
* The token moves forward according to the dice value.
* Landing on a ladder moves the player upward.
* Landing on a snake moves the player downward.
* A player must reach exactly **100** to win.
* Overshooting 100 causes a bounce-back movement.

---

## 🛠️ Technologies Used

* HTML5
* CSS3
* JavaScript (ES6+)
* Canvas API
* Web Audio API

---

## 📂 Project Structure

```text
project/
│
├── index.html      # Main application structure
├── style.css       # Styling and animations
├── script.js       # Game logic and rendering
├── preview.png
├── favicon.png
└── README.md
```

---

## 🎨 Highlights

### Dynamic Board Rendering

The game board, snakes, and ladders are drawn dynamically using the HTML5 Canvas API.

### Sound Effects

Custom-generated sound effects include:

* Dice roll
* Ladder climb
* Snake bite
* Token movement
* Victory celebration

### Responsive Design

The board automatically resizes for smaller screens, ensuring a smooth experience across devices.

---

## 🏆 Winning Celebration

When a player reaches square 100:

* Confetti animation is triggered.
* Victory sound plays.
* Winner statistics are displayed.
* Players can start a new game or play again.

---

## 📸 Preview

```text
🐍 Snake & Ladder
━━━━━━━━━━━━━━━━━━

🔴 Player 1 vs 🔵 Player 2

🎲 Roll Dice
🪜 Climb Ladders
🐍 Avoid Snakes
🏆 Reach 100 First!
```

---

## 🔧 Installation

1. Clone the repository:

```bash
git clone https://github.com/dhairyagothi/100_days_100_web_project.git

OR

https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/snakeladder.git
```

2. Open the project folder:

```bash
cd public
cd snakeladder
```

3. Launch `index.html` in your browser.

No additional dependencies are required.

---

## 🤝 Contributing

Contributions, bug reports, and feature suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Submit a pull request.

---

## ⭐ Future Enhancements

* Single-player mode with AI
* Multiplayer online support
* Custom board themes
* Dark/Light mode toggle
* More player support
* Save and load game progress
* Custom snake and ladder configurations

---

## 📄 License

This project is open-source and available under the MIT License.

---

Made with ❤️ using JavaScript.
