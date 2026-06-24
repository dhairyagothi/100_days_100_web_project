# 🧩 Slide Puzzle Game

A classic **3×3 sliding puzzle game** built using **HTML, CSS, and JavaScript**. The goal is to arrange the shuffled image tiles in the correct order before the timer runs out.

---

## 📸 Preview

The game displays an image split into 9 tiles, with one tile acting as the blank space. Players drag adjacent tiles into the blank space to solve the puzzle.

---

## 🚀 Features

* 🎮 Classic 3×3 sliding puzzle gameplay
* 🔀 Randomized puzzle generation
* ✅ Guaranteed solvable puzzle configurations
* 🖱️ Drag and drop tile movement
* ⏱️ 5-minute countdown timer
* 🔢 Move counter to track the number of turns
* 🏆 Win detection with a congratulations message
* 🔄 Restart and reshuffle functionality
* 🎨 Clean and responsive user interface

---

## 🛠️ Technologies Used

* **HTML5** – Game structure
* **CSS3** – Styling and layout
* **JavaScript (Vanilla JS)** – Game logic and interactions

---

## 📁 Project Structure

```
Slide-Puzzle-Game/
│
├── index.html          # Main HTML page
├── puzzle.css          # Game styling
├── puzzle.js           # Puzzle logic and functionality
├──  preview.png
├── README.md
├── favicon.png
│
└── img/
    ├── 1.jpg
    ├── 2.jpg
    ├── 3.jpg           # Blank tile
    ├── 4.jpg
    ├── 5.jpg
    ├── 6.jpg
    ├── 7.jpg
    ├── 8.jpg
    ├── 9.jpg
    └── logo.png        # Game title/logo
```

---

## 🎯 How to Play

1. Click the **Randomize** button to shuffle the puzzle.
2. Drag a tile that is directly next to the blank tile.
3. The tile will swap places with the blank space.
4. Continue arranging all pieces in the correct order.
5. Solve the puzzle before the **5-minute timer** reaches zero.

---

## 🧠 How the Randomization Works

The game uses the **Fisher–Yates shuffle algorithm** to generate random puzzle layouts.

Since not every random arrangement of a sliding puzzle can be solved, the game performs a **solvability check using inversion counting**:

* For a 3×3 puzzle, the number of inversions must be even.
* If the generated board is unsolvable, two non-blank tiles are swapped to correct the parity.

This guarantees that every generated puzzle can be completed.

---

## ⏲️ Timer System

* Every game starts with a **5-minute countdown**.
* The timer resets whenever the puzzle is randomized.
* If time reaches zero, the game ends and a message is displayed.

---

## 🏆 Winning Condition

The player wins when all image tiles match the correct order:

```
1.jpg → 2.jpg → 4.jpg
5.jpg → 6.jpg → 7.jpg
8.jpg → 9.jpg → 3.jpg (blank)
```

When the puzzle is solved:

* The timer stops.
* A congratulation message is displayed.

---

## 💡 Possible Future Improvements

* Add multiple difficulty levels (3×3, 4×4, 5×5)
* Add a best score system using local storage
* Add sound effects and animations
* Make the layout fully responsive for mobile devices
* Add a pause and resume option
* Display a preview of the completed image

---

## 🖥️ Installation & Setup

1. Clone the repository:

```bash
git clone https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/Slide%20puzzle%20Game.git
or
https://github.com/dhairyagothi/100_days_100_web_project.git 
```

2. Open the project folder:

```bash
cd slide-puzzle-game
```

3. Run the game by opening `index.html` in your browser.

No additional libraries or dependencies are required.

---

## 📄 License

This project is open-source and available under the **MIT License**.

---

## 👨‍💻 Author

Created with ❤️ using HTML, CSS, and JavaScript.
