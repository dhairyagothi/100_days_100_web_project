# 🎲 Dice Roller

An interactive dice roller web application built with **HTML**, **CSS**, and **JavaScript** — no frameworks, no dependencies.

---

## 📸 Preview

> Roll one die or up to ten at once, track your stats, and watch the tally marks fill up in real time.

---

## ✨ Features

- 🎲 **Roll 1–10 dice** at once with a single click
- 🎨 **5 pastel color themes** for the dice face
- 🌙 **Dark / Light mode** toggle (fixed to the top-right of the page)
- 🔊 **Real dice sound effects** — different sounds for 1 die vs. multiple dice
- 📊 **Live statistics** — total rolls, average, min, and max
- 🖊️ **Tally mark distribution** — classic tally scoring (resets every 10 rolls per face)
- ⚡ **Smooth animations** — rolling spin effect on every throw
- 📱 **Fully responsive** — works on mobile and desktop

---

## 🛠️ Tech Stack

| Technology | Usage |
|------------|-------|
| HTML5 | Structure and layout |
| CSS3 | Styling, animations, dark/light theming via CSS variables |
| JavaScript (Vanilla) | Game logic, DOM manipulation, Web Audio API |
| SVG | Dice faces with pip layouts, tally mark rendering |

---

## 📁 File Structure

```
Dice-Roller/
├── main.html          # Main application (self-contained)
├── style.css          # Styles (embedded in main.html)
├── script.js          # Logic (embedded in main.html)
├── dice-single.mp3    # Sound effect for 1 die roll
├── dice-multi.mp3     # Sound effect for 2–10 dice roll
└── README.md          # This file
```

---

## 🚀 How to Run

1. Clone or download this repository
2. Make sure `dice-single.mp3` and `dice-multi.mp3` are in the same folder as `main.html`
3. Open `main.html` in any modern browser
4. No build step, no installs — just open and play!

---

## 🎮 How to Use

| Action | What it does |
|--------|-------------|
| Set **Number of Dice** | Choose 1–10 dice to roll |
| Pick a **Dice Color** | 5 pastel options (pink, peach, yellow, green, blue) |
| Click **Roll Dice** | Rolls all dice with animation + sound |
| Click **🔊** | Toggles sound on/off |
| Click **Reset Stats** | Clears all statistics and tally marks |
| Click **🌙 / ☀️** | Toggles dark/light mode |

---

## 📚 Concepts Covered

- Random number generation (`Math.random`)
- DOM manipulation (dynamic SVG rendering)
- CSS custom properties (variables) for theming
- CSS keyframe animations
- Event handling
- State management (vanilla JS object)
- SVG drawing (dice pips, tally marks)
- Web Audio API (fallback sound synthesis)
- Responsive layout with CSS Grid and Flexbox

---

## 🔧 Difficulty

**Intermediate**

---

## 🙌 Part of

[100 Days 100 Web Projects](https://github.com/dhairyagothi/100_days_100_web_project) — GSSoC 2026