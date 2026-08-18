# Word Search Quest - Interactive Web Game

Word Search Quest is a premium, interactive, and responsive Word Search Game built from scratch using HTML5, Vanilla CSS, and JavaScript. The layout features beautiful glassmorphism designs, glowing highlights, synthesized audio using the browser's Web Audio API, and full drag-and-touch selection path indicators.

## Features

- **Dynamic Grid Generation**: Generates grid boards in four difficulties (Easy, Medium, Hard, Expert). Packing logic fits words in multiple direction vectors (forward, backward, and diagonal overlays) based on the chosen challenge level.
- **Pointer Event Pathing**: Complete drag and touch dragging selection logic with a locking cursor (coordinates automatically adjust to exact lines) and glowing line indicators drawn inside SVG overlay layers.
- **8 Thematic Categories**: Animals, Countries, Programming, Movies, Sports, Food, Science, and Geography.
- **Seeded Daily Challenge**: A unique puzzle generated daily using date seeds (e.g. `2026-07-10`). All players worldwide challenge the same layout every day. Streak tracking is persisted.
- **Synthesized Audio System**: In-game audio synthesized in real-time via oscillator and sound envelope nodes through the Web Audio API. Requires no asset downloads.
- **Premium Light Mode Theme**: Soft, pastel glassmorphic interface keeping graphics readable, clean, and crisp across all screens.
- **Confetti Victory Ceremony**: High-performance canvas-rendered falling ribbon particle simulations on grid completion.
- **Personal Records Board**: Persistent scoreboard tracking completion counts, scores, and best times via `localStorage`.

## Folder Structure

```text
word-search-game/
├── index.html       # Visual layout, modal frames, and configuration selectors
├── style.css        # Responsive stylesheets, animations, themes, and layouts
├── script.js        # Seeded randomizer, packing algorithm, pointers, sounds, and UI binds
├── README.md        # Documentation and guide
└── data/
    └── words.json   # Curated list of target words for categories
```

## How to Play

1. **Setup**: Select your preferred difficulty level and category. Alternatively, click on **Daily Challenge** to play the seeded puzzle of the day.
2. **Search**: Find the target words listed in the panel.
3. **Select**: Click/Touch and drag a path from the starting letter to the ending letter of the word. You can drag horizontally, vertically, or diagonally in all directions.
4. **Highlights**: Correct words are highlighted on the grid with permanent neon capsules and struck out on the target panel list.
5. **Hints**: If you get stuck, use the **Hint** bulb button (reduces current score by 50 points) to pulse-highlight the starting cell of a random unfound word.
6. **Victory**: Find all target words to win and trigger the victory modal and confetti!
