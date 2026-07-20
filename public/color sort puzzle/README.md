# 🧪 ColorSort — Color Sort Puzzle Game

A browser-based liquid color-sorting puzzle game where players pour colored liquid between tubes until every tube contains a single, uniform color — built entirely with vanilla HTML, CSS, and JavaScript.

---

## 📖 Introduction

**ColorSort** is a relaxing yet challenging puzzle game inspired by the classic "water sort" genre. Players select a tube and pour its top liquid into another tube, following simple pouring rules, until all colors are perfectly sorted. The game features multiple difficulty levels, a move counter, a live timer, undo support, and dynamically generated sound effects — all without any external libraries or audio files.

---

## ✨ Features

- 🎚️ **Three Difficulty Levels** — Easy (4 colors), Medium (6 colors), and Hard (8 colors), each with adjustable tube counts.
- ⏱️ **Live Timer & Move Counter** — Tracks elapsed time and number of moves for every puzzle attempt.
- 🖱️ **Intuitive Pour Mechanics** — Select a tube, then click a destination tube; pouring is only allowed onto matching colors or into empty tubes.
- ↩️ **Undo & Reset** — Undo reverses the last move, while Reset restarts the current puzzle from its original shuffled state.
- 🔄 **New Game Generator** — Instantly creates a new, randomly shuffled puzzle at the selected difficulty.
- 🎬 **Pour & Bubble Animations** — Smooth liquid pour-in animation with rising bubble effects for a satisfying visual experience.
- ⚠️ **Invalid Move Feedback** — A shake animation and on-screen message alert the player when an illegal pour is attempted.
- ✅ **Completed Tube Highlighting** — Finished tubes are visually highlighted with a glowing border and a "✓ Done" label.
- 🏆 **Win Celebration** — A congratulatory modal appears on completion, showing total moves taken along with a confetti animation.
- ❔ **How To Play Modal** — Built-in instructions overlay explaining the rules, accessible at any time (pauses the timer while open).
- 🔊 **Custom Web Audio Sound Effects** — Pour, select, invalid move, tube-complete, and win sounds generated in real time using the Web Audio API, with a mute/unmute toggle.
- 🏠 **Home Navigation** — Quick link back to the main project hub.
- 📱 **Responsive Layout** — Flexbox-based arena and controls adapt cleanly to different screen sizes.

---

## 📁 Folder Structure

- **HTML5** — Page structure and semantic layout
- **CSS3** — Styling, animations (pour, shake, confetti, bubbles), and responsive layout using CSS variables
- **JavaScript (Vanilla)** — Game logic, state management, pour validation, undo/history stack, and timer
- **Web Audio API** — Procedurally generated sound effects with no external audio assets

---

## 📁 Project Structure

```text
Color-Sort-Puzzle/
│
├── index.html    # Complete game — structure, styles, and logic in a single file
```

---

## ⚙️ Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/dhairyagothi/100_days_100_web_project.git
   ```
2. Navigate to the project folder:
   ```bash
   cd 100_days_100_web_project/Color-Sort-Puzzle
   ```
3. Open `index.html` directly in your browser — no build tools, dependencies, or server required.

---

## 🎮 Usage Guide

1. Choose a difficulty level — **Easy**, **Medium**, or **Hard** — from the top control bar.
2. Click a tube to select it (it lifts slightly with a highlighted border).
3. Click a second tube to pour the selected tube's top color into it.
4. Pouring succeeds only if the destination tube is empty or already has the same top color; otherwise an error message and shake animation appear.
5. Use **Undo** to reverse your last move, or **Reset** to restart the puzzle from scratch.
6. Click **New Game** at any time to generate a fresh, shuffled puzzle.
7. Sort every color into its own tube to win — a celebration modal will display your total moves and elapsed time.
8. Click **❔ How To Play** for in-game instructions, or toggle **🔊 Sound** to mute/unmute effects.

---

## 🚀 Future Enhancements

- Add a hint system to suggest the next valid move
- Add a best-time and best-moves leaderboard per difficulty level
- Add more difficulty tiers with larger tube counts
- Add keyboard accessibility for tube selection and pouring
- Add a daily-challenge mode with a fixed shuffle seed

---

## 🤝 Contributing

Contributions are welcome! To contribute:
1. Fork the repository
2. Create a new branch (`git checkout -b feature-name`)
3. Commit your changes
4. Push to your branch and open a Pull Request

---

## 📄 License

This project is open-source and available for learning and contribution purposes under the repository's existing license.

---

## ✍️ Author

**Documentation by Sanyogita Singh**
