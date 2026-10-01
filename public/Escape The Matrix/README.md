# 🟢 ESCAPE THE MATRIX

> _A classified infiltration protocol. Breach the system. Evade the trace. Escape._

A browser-based hacking terminal game with a futuristic cyberpunk aesthetic. Navigate five escalating security layers using real-feeling terminal commands, cipher solving, memory challenges, and split-second decision-making — all wrapped in a CRT-filtered, matrix rain world.

---

## 📸 Screenshots

|              Boot Sequence               |              Main Menu               |                Gameplay                 |
| :--------------------------------------: | :----------------------------------: | :-------------------------------------: |
| ![Boot Sequence](assets/images/Boot.png) | ![Main Menu](assets/images/Menu.png) | ![Gameplay](assets/images/Gameplay.png) |

---

## ✨ Features

- **5 Unique Levels** — each with a distinct hacking mechanic
- **3 Difficulty Modes** — Easy, Medium, and Hard with scaling timers, attempts, and trace speeds
- **Matrix Rain Background** — animated canvas rain using katakana + hex characters
- **CRT Monitor Effect** — scanlines and vignette overlay for authentic retro-terminal feel
- **Custom Glitch Cursor** — a glowing dot that pulses and scales on click
- **Procedural Audio Engine** — Web Audio API tones for key clicks, alerts, success, failure, and warp effects
- **Trace Detection Meter** — rising danger bar that ends the run if it hits 100%
- **AI_CORE Messages** — antagonist AI sends contextual and periodic taunts/warnings
- **Achievement Popups** — slide-in notifications on milestone completions
- **Save & Resume** — `localStorage` progress save between sessions
- **Responsive Design** — collapses gracefully on mobile (sidebar hidden, terminal full-width)
- **Glitch Animations** — CSS glitch effects on logos and result screens

---

## 🎮 Gameplay Description

You play as a rogue agent attempting to escape the Matrix by breaching five successive security layers:

| Level | Name                  | Mechanic                                                                                                                                 |
| :---: | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
|   1   | **Password Crack**    | Guess the hidden code word using `crack`, `hint`, and `scan` commands. Partial match feedback (position + presence) guides each attempt. |
|   2   | **Command Injection** | Execute a series of exact terminal commands (`ls -la`, `sudo su -`, etc.) to escalate privileges and extract credentials.                |
|   3   | **Trace Avoidance**   | Solve five randomised cipher challenges (Caesar, binary, hex, ROT13, reversal) to reduce the rising trace meter before it hits 100%.     |
|   4   | **Firewall Puzzle**   | A Simon-style memory game: watch a sequence of firewall nodes light up, then click them in the correct order. Three mistakes = lockout.  |
|   5   | **Escape Sequence**   | Type three precise escape commands against a tight countdown timer with the fastest trace speed in the game.                             |

---

## 🛠 Technologies Used

| Technology                   | Purpose                                                               |
| ---------------------------- | --------------------------------------------------------------------- |
| HTML5                        | Semantic structure and screen layout                                  |
| CSS3                         | Animations, keyframes, custom properties (variables), responsive grid |
| Vanilla JavaScript (ES2020+) | Game engine, async/await level runners, DOM manipulation              |
| Canvas API                   | Matrix rain animation                                                 |
| Web Audio API                | Procedural sound effects (no audio files needed)                      |
| localStorage                 | Save/load game progress                                               |
| Google Fonts                 | Orbitron (headings) + Share Tech Mono (terminal body)                 |

No frameworks. No build tools. No dependencies beyond a browser.

---

## 📁 Folder Structure

```
Escape-The-Matrix/
│
├── index.html          # HTML structure (no inline styles or scripts)
├── style.css           # All CSS — organised into 21 labelled sections
├── script.js           # Full game engine — organised into 24 labelled sections
│
└── assets/
    ├── sounds/         # (Reserved) External audio files if added later
    ├── images/         # (Reserved) Screenshots, icons, or background images
    └── fonts/          # (Reserved) Self-hosted font files if needed offline
```

---

## 🚀 Installation / How to Run

No build step required. Works offline out of the box.

**Option A — Double-click**

1. Download or clone this repository
2. Open `index.html` directly in any modern browser

**Option B — Local server (recommended for development)**

```bash
# Using Python
python -m http.server 8080

# Using Node.js (npx)
npx serve .

# Using VS Code
# Install the "Live Server" extension, right-click index.html → Open with Live Server
```

Then navigate to `http://localhost:8080`.

**Browser compatibility:** Chrome 90+, Firefox 88+, Edge 90+, Safari 14+

---

## 🎯 How to Play

1. Wait for the boot sequence to complete
2. Select a difficulty (Easy / Medium / Hard)
3. Click **[ NEW MISSION ]** to start
4. Read the terminal output carefully — it tells you exactly what to do
5. Type commands in the input bar at the bottom and press **Enter**
6. Keep the trace meter below 100% and complete all 5 levels to escape

**Tip:** On Easy mode, full hints and extra attempts are available. On Hard mode, hints are hidden and timers are brutal.

---

## 🔮 Future Improvements

- [ ] Additional levels (brute-force cracker, social engineering, network mapping)
- [ ] Leaderboard / high score tracking
- [ ] Custom terminal themes (amber, phosphor-green, blue)
- [ ] Mobile virtual keyboard with hacker-style layout
- [ ] Procedurally generated cipher puzzles with difficulty scaling
- [ ] Narrative storyline with lore entries between levels
- [ ] Sound effects pack using actual audio files for richer audio
- [ ] Keyboard shortcut cheatsheet overlay
- [ ] Animated intro cinematic before the boot screen
- [ ] Two-player co-op mode (one types, one manages trace)

---

## 👤 Author

**Escape the Matrix** was designed and built as a portfolio project demonstrating:

- Pure vanilla JS game architecture (no frameworks)
- CSS animation mastery (keyframes, custom properties, clip-paths)
- Web API usage (Canvas, Web Audio, localStorage)
- Cyberpunk UI/UX design principles

---

## 📄 License

This project is open source. Feel free to fork, modify, and build upon it.

---

<div align="center">

```
// CLASSIFIED INFILTRATION PROTOCOL v4.2.1 //
ACCESS GRANTED. WELCOME, AGENT.
```

</div>
