2048 — Enhanced Edition
A fully redesigned and feature-rich version of the classic 2048 tile puzzle game, built as a GSSoC 2026 open source contribution. This upgrade transforms the original bare-bones game into a polished, responsive, and engaging experience with modern UI, animations, sound, multiple game modes, and much more.

What Was Improved
Here is a full breakdown of every improvement made over the original game:
🎨 UI & Visual Design

Complete visual overhaul — replaced the flat, colourless layout with a deep purple/indigo themed interface
Animated background blobs — soft glowing colour orbs slowly drift and pulse behind the board, giving a modern glassmorphism feel
Gradient tile colours — every tile value now has a unique vibrant gradient (white → orange → red → pink → purple → blue → cyan → green → gold fire for 2048), replacing the dull flat tile colours of the original
Frosted glass UI cards — score boxes, buttons, and modals use semi-transparent glass-style backgrounds with subtle borders
Gradient logo — the 2048 title uses a dynamic colour gradient that adapts to the active theme
Google Fonts (Nunito) — replaced the default system font with a bold, rounded typeface for a premium feel

✨ Animations

Tile pop animation — new tiles appear with a spring-physics scale + slight rotation effect
Tile merge animation — merged tiles bounce with a satisfying scale pulse
Smooth tile movement — tiles slide across the board with CSS transitions
Particle burst on merge — 8 colourful particles explode outward every time two tiles combine
Score float — a +points number rises from the board on every merge
Confetti shower on winning — a full canvas-based confetti animation fires when you reach 2048
Animated score bump — the score display scales up briefly on every change
Best score gold flash — the best score card flashes gold when you beat your record
Combo streak labels — consecutive merges trigger escalating text labels: "3× combo!" → "On fire!" → "Unstoppable!" → "LEGENDARY!"

🕹️ Gameplay Features

Undo button — step back one move at any time
Three game modes:

Classic — standard 4×4 grid
Timed (60s) — race against a countdown timer with a live progress bar that turns red when under 15 seconds
Zen 5×5 — larger grid for a more relaxed, strategic experience


Auto-save & resume — the game state is saved to localStorage so refreshing the page brings you back to exactly where you left off
Move counter — live display of how many moves have been played
Tile count & best tile — live metadata bar showing active tile count and highest tile on the board

🏆 Achievements System
Six unlockable achievements that pop up in-game when earned and persist across sessions:
AchievementConditionQuarter WayReach tile 256HalfwayReach tile 512So CloseReach tile 1024Winner!Reach tile 2048CenturyPlay 100 movesHigh ScorerScore over 2000 points
📊 Stats Modal
A full statistics panel (📊 button) tracking:

Best score ever
Total games played
Total wins
Best tile ever reached
All earned achievement badges displayed visually

All stats persist in localStorage across browser sessions.
🔊 Sound Effects
Implemented using the Web Audio API — no external files required:

Soft click on every move
Rising tone on every merge
Triumphant three-note chime on achievement unlock
Mute/unmute toggle button (🔊 / 🔇)

🌙 Dark / Light Theme

Full dark and light theme toggle (☀ / 🌙 button)
Each theme has its own distinct background colour palette, blob colours, board style, and tile adjustments
Theme applies instantly across every element

📱 Responsive & Accessible

Fully mobile responsive — tile sizes, fonts, and layout scale down for small screens
Touch / swipe support — swipe in any direction on mobile to play
Keyboard support — Arrow keys and WASD both work
ARIA labels — board, score, overlays, and controls all have accessibility attributes
Reduced motion support — particles, confetti, and animations are automatically disabled for users with prefers-reduced-motion set

🧹 Code Quality

Clean separation of concerns: index.html, style.css, script.js
CSS custom properties (variables) used throughout for easy theming
All game state managed in a single clear state block
Modular functions — rendering, game logic, sound, and persistence are all separate
Fully commented codebase


Features Summary

Vibrant gradient tile colour system (2 → 2048)
Animated drifting background blobs
Spring-physics tile pop & merge animations
Particle burst on every merge
Confetti explosion on winning
Score float (+pts) on merge
Combo streak notifications
Classic, Timed (60s), and Zen 5×5 game modes
Undo last move
Auto-save and resume on page refresh
6 unlockable achievements with in-game pop-ups
Full stats modal with localStorage persistence
Web Audio API sound effects with mute toggle
Dark and light theme toggle
Live move counter, tile count, best tile display
Fully responsive for mobile
Swipe gesture support
Arrow keys + WASD keyboard support
ARIA accessibility attributes
Reduced motion support


Technologies Used

HTML5 — semantic structure with ARIA accessibility attributes
CSS3 — custom properties, gradients, keyframe animations, glassmorphism, responsive design, prefers-reduced-motion
JavaScript (ES6+) — game logic, Web Audio API, Canvas API (confetti), localStorage, touch events
Google Fonts — Nunito (700, 800, 900 weights)


How to Run

Clone or download this repository
Make sure all three files are in the same folder:

   index.html
   style.css
   script.js

Open index.html in any modern web browser
No build tools, no dependencies, no internet connection required (except for the Google Font)


Project Structure
2048-game/
├── game images
├── index.html      # Game structure and markup
├── README.md
├── script.js       # Game logic, sound, achievements, persistence
├── style.css       # All styles, themes, animations
    
       

Screenshots

Light Theme
![alt text](image.png)

Dark Theme
![alt text](image-1.png)


Win ScreenStats Modal
![alt text](image-2.png)



Contribution
This project was built as part of GSSoC 2026 (GirlScript Summer of Code) under open source contribution guidelines.
Issue addressed: UI enhancement, responsiveness, gameplay features, accessibility, and code quality improvements for the existing 2048 game.

Author
Pratham Srivastava
GSSoC 2026 Contributor
