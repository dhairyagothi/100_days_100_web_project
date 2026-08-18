# Crossword Quest 🧩

A premium, interactive, and portfolio-level **Crossword Puzzle Game** built using **HTML5, CSS3, and Vanilla JavaScript (ES6+)**.

---

## 🌟 Core Features

- **Responsive Crossword Grid**: Fits beautifully on desktop, tablets, and mobile screens.
- **Dynamic Intersections Highlight**: Active selected cell highlights the primary word (Across or Down) and intersecting crosswords.
- **Sleek Themes Customization**: Offers Classic Dark, Emerald Glow, Cosmic Purple, and Retro Light styling modes.
- **Greedy Layout Compiler Engine**: Build custom crossword grids dynamically from arbitrary word lists and clues.
- **Daily Crossword Challenges**: Seed-based puzzles refreshed every calendar day with streak indicators.
- **Validation & Hints**: Instant checker verifying matching letters, plus single-letter, single-word, or full grid reveal.
- **Leaderboards & Competitors**: Race against simulated computer bots in real-time or view rank records.
- **Analytics Dashboard**: Performance metrics rendered on Canvas charts via Chart.js integration.
- **Exporting Options**: Download printable crosswords as PDFs or share custom JSON configurations.
- **Web Audio Sound Effects**: Dynamic synthesizer generating click, success, and win fanfare sounds natively.

---

## 📂 Project Structure

```text
crossword-game/
│
├── index.html
├── style.css
├── script.js
├── data/
│   ├── easy.json
│   ├── medium.json
│   ├── hard.json
│   └── programming.json
└── README.md
```

---

## 🛠️ Technology Stack

- **HTML5 & CSS3**: Flexbox, CSS Grid, Glassmorphism backdrop blurs, Keyframe Animations, Print-media styling.
- **Vanilla JavaScript**: ES6+ modules, Web Audio API, Canvas Confetti CDN, Chart.js CDN, jsPDF & html2canvas CDNs.
- **Persistence**: `localStorage` auto-saving and statistics caching.

---

## 🚀 How to Run Locally

1. Clone or download the project workspace directory.
2. Open `index.html` directly in your browser, or run a local dev server:
   ```bash
   npx serve -s ./crossword-game
   ```
3. Open `http://localhost:3000` (or the port specified) to start playing!
