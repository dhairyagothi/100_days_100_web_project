# 🎯 Number Guessing Game

A simple and interactive **Number Guessing Game** built using **HTML, CSS, and Vanilla JavaScript**. The game randomly generates a number between **1 and 100**, and the player has **10 attempts** to guess it correctly.

It also includes a **Dark/Light Mode** toggle with theme persistence using `localStorage`.

---

## ✨ Features

* 🎲 Random number generation between **1 and 100**
* 🔢 Maximum of **10 guessing attempts**
* 📋 Displays all previous guesses
* 📉 Tracks remaining guesses
* ⬆️ Gives hints whether the guess is **too high** or **too low**
* 🏆 Detects a correct guess and ends the game
* 🔄 Restart the game without refreshing the page
* 🌙 Light/Dark mode support
* 💾 Theme preference saved using `localStorage`
* 📱 Responsive and lightweight design

---

## 🖥️ Demo

The player is prompted to guess a number between **1 and 100**.

After each guess, the game:

* Validates the input
* Stores previous guesses
* Displays the remaining attempts
* Indicates whether the guess is too high or too low
* Ends the game after a correct guess or after 10 attempts

---

## 🚀 How to Play

1. Enter a number between **1 and 100**.
2. Click **Submit Your Guess**.
3. Read the hint:

   * Number is too low
   * Number is too high
   * You Win 🎉
4. Continue guessing until:

   * You guess correctly, or
   * You use all 10 attempts.
5. Click **Start New Game** to play again.

---

## 🌙 Dark Mode

The project supports both **Light** and **Dark** themes.

Features include:

* Theme toggle button
* Automatic detection of the system's preferred color scheme
* Theme preference stored using `localStorage`
* Theme persists across browser sessions

---

## 🛠️ Technologies Used

* HTML5
* CSS3
* Vanilla JavaScript
* DOM Manipulation
* Local Storage API

---

## 📂 Project Structure

```text
Number-Guessing-Game/
│
├── index.html
├── style.css
├── GuessNumber.js
├── image.png
└── README.md
```

---

## ⚙️ Game Logic

The application follows these steps:

1. Generate a random number between **1 and 100**.
2. Validate the player's input.
3. Compare the guess with the target number.
4. Display:

   * Previous guesses
   * Remaining attempts
   * Hint messages
5. End the game after:

   * Correct guess
   * 10 unsuccessful attempts
6. Allow restarting without reloading the page.

---

## 📸 Features Overview

* ✅ Random Number Generation
* ✅ Guess Validation
* ✅ Hint System
* ✅ Previous Guess Tracking
* ✅ Remaining Attempt Counter
* ✅ Win/Loss Detection
* ✅ Restart Game Functionality
* ✅ Dark/Light Theme Toggle
* ✅ Persistent Theme Preference

---

## 🚀 Getting Started

1. Clone the repository

```bash
git clone https://github.com/100_days_100_project.git
```

2. Open the project folder.
```
cd Number-Guessing-Game
```

3. Launch `index.html` in your preferred web browser.

No installation or dependencies are required.

---

## 💡 Future Improvements

* Difficulty levels (Easy, Medium, Hard)
* Score tracking
* Best score leaderboard
* Sound effects
* Countdown timer
* Animated win/loss effects
* Mobile-friendly keyboard improvements
* Confetti celebration on winning

---

## 🤝 Contributing

Contributions are welcome!

Feel free to fork the repository, improve the project, and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Developed as a beginner-friendly JavaScript project to practice:

* DOM Manipulation
* Event Handling
* Conditional Logic
* Random Number Generation
* Local Storage
* Theme Switching
* Interactive User Interfaces
