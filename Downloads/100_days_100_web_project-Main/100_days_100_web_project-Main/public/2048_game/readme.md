<div align="center">

# 🎮 2048: Enhanced Edition

**A fully redesigned and feature-rich version of the classic 2048 tile puzzle game.**

[![GSSoC 2026](https://img.shields.io/badge/GSSoC-2026-F96F36?style=for-the-badge&logo=girlscript)](https://gssoc.girlscript.org/projects/dhairyagothi%2F100_days_100_web_project)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/ananyajoshi-cseai/100_days_100_web_project/tree/Main/public/2048_game)
[![Play Live](https://img.shields.io/badge/Play-Live_Demo-00C7B7?style=for-the-badge&logo=vercel)](https://100-days-100-web-project.vercel.app/public/2048_game/index.html)

### 🚀 [Play the Live Game Here](https://100-days-100-web-project.vercel.app/public/2048_game/index.html)

</div>

<br/>

## 🌌 About The Project

Built as an open-source contribution for **GSSoC 2026**, this upgrade transforms the original bare-bones 2048 game into a polished, responsive, and engaging experience. Featuring a modern glassmorphism UI, fluid animations, immersive sound effects, and multiple game modes, it brings a fresh, highly responsive feel to a beloved classic.

---

## ✨ Improvements & Features Breakdown

### 🎨 UI & Visual Design
* **Complete Visual Overhaul:** Replaced the flat layout with a deep purple/indigo-themed interface.
* **Animated Background Blobs:** Soft, glowing color orbs slowly drift and pulse behind the board, delivering a premium glassmorphism aesthetic.
* **Gradient Tile Colors:** Every tile value boasts a unique, vibrant gradient (white → orange → red → pink → purple → blue → cyan → gold fire for 2048).
* **Frosted Glass UI:** Score boxes, buttons, and modals utilize semi-transparent glass-style backgrounds with subtle borders.
* **Dynamic Typography & Logos:** Features a gradient 2048 title that adapts to the active theme, alongside the rounded, bold **Nunito** Google Font.
* **🌙 Dark / Light Theme:** Instant toggle (☀/🌙) with distinct color palettes, blob colors, and board styles.

### 💨 Animations
* **Tile Physics:** New tiles appear with a spring-physics scale and slight rotation effect. 
* **Satisfying Merges:** Merged tiles bounce with a scale pulse, accompanied by an 8-particle colorful burst explosion.
* **Score Dynamics:** A `+points` float rises on every merge, the score display scales up briefly, and the best score card flashes gold upon breaking records.
* **Combo Streaks & Confetti:** Consecutive merges trigger escalating text labels (*"3× combo!" → "On fire!" → "Unstoppable!" → "LEGENDARY!"*). Reaching 2048 fires a full canvas-based confetti shower.

### 🕹️ Gameplay Features
* **Undo Button:** Step back one move at any time.
* **Three Game Modes:**
  * 🧊 **Classic:** Standard 4×4 grid.
  * ⏳ **Timed (60s):** Race against a countdown timer with a live progress bar that turns red under 15 seconds.
  * 🧘 **Zen 5×5:** Larger grid for a more relaxed, strategic experience.
* **State Persistence:** Auto-save & resume functionality via `localStorage`. Refreshing the page brings you back exactly where you left off.
* **Live Metadata:** Real-time move counter, active tile count, and highest tile display.

### 🏆 Achievements System
Six unlockable achievements pop up in-game when earned and persist across sessions.

| Achievement | Condition |
| :--- | :--- |
| 🥉 **Quarter Way** | Reach tile 256 |
| 🥈 **Halfway** | Reach tile 512 |
| 🥇 **So Close** | Reach tile 1024 |
| 👑 **Winner!** | Reach tile 2048 |
| 💯 **Century** | Play 100 moves |
| 🔥 **High Scorer** | Score over 2000 points |

### 📊 Stats Modal & 🔊 Audio
* **Comprehensive Tracking (📊):** View your best score, total games played, total wins, best tile ever reached, and a visual display of all earned achievement badges.
* **Web Audio API Effects:** Soft click on moves, rising tones on merges, and a triumphant three-note chime for achievements. Includes a quick mute/unmute toggle (🔊 / 🔇).

### 📱 Responsive & Accessible
* **Mobile & Touch:** Fully responsive design that scales perfectly. Swipe in any direction on mobile devices to play.
* **Keyboard Support:** Arrow keys and `W A S D` functionality.
* **Accessibility (a11y):** Integrated ARIA labels for the board, score, overlays, and controls.
* **Reduced Motion:** Particles, confetti, and animations automatically disable for users with `prefers-reduced-motion` enabled.

---

## 🛠️ Technologies Used

* **HTML5:** Semantic structure with ARIA accessibility attributes.
* **CSS3:** Custom properties (variables), gradients, keyframe animations, glassmorphism, responsive design, `prefers-reduced-motion`.
* **JavaScript (ES6+):** Game logic, Web Audio API, Canvas API (confetti), `localStorage`, touch events.
* **Google Fonts:** Nunito (700, 800, 900 weights).

---

## 🚀 How to Run Locally

1. Clone or download this repository.
2. Ensure all three core files are in the same directory:
   * `index.html`
   * `style.css`
   * `script.js`
3. Open `index.html` in any modern web browser.
4. *No build tools, no dependencies, and no internet connection required (except to load the Google Font).*

### 📁 Project Structure
```text
2048-game/
├── game images/    # Assorted project assets
├── index.html      # Game structure and markup
├── README.md       # Project documentation
├── script.js       # Game logic, sound, achievements, persistence
└── style.css       # All styles, themes, and animations
```
## 🤝 Contribution
This project was proudly built as part of GSSoC 2026 (GirlScript Summer of Code) under open source contribution guidelines.
1. Issue addressed: UI enhancement, responsiveness, gameplay features, accessibility, and code quality improvements for the existing 2048 game:
    * Author : Pratham Srivastava GSSoC 2026 Contributor
2. Documentation: Enhanced the Readme.md file:
    * Author : Ananya Joshi
