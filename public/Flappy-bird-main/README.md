# 🐦 Flappy Bird — Enhanced

> A polished, physics-accurate browser remake of Flappy Bird built with vanilla HTML5 Canvas and the Web Audio API. No dependencies, no build step, no server required.

---

## 🚀 How to Run

1. Download or clone the repository
2. Open `public/Flappy-bird-main/index.html` directly in any modern browser

That’s it. No server, no install, no terminal — just open the file.

> Works in Chrome, Firefox, Edge, and Safari. Sprites load via relative paths so the file must be opened from its own folder (not moved out individually).

---

## ✨ Features

| Category | Detail |
|---|---|
| **Physics** | Gravity `0.5 px/frame²`, jump impulse `-8.5 px/frame`, terminal velocity `12 px/frame` |
| **Fair pipe generation** | Gap centre clamped within `±110 px` of the previous pipe — every opening is reachable |
| **Consistent spacing** | Pipe gap measured in pixels (`380 px`), not milliseconds, so spacing stays constant at all speeds |
| **Progressive difficulty** | Speed ↑ and gap ↓ every 5 points, both capped at safe limits |
| **Screen shake** | Decaying camera shake on death, fades to zero over ~0.67 s (40 frames) |
| **Scrolling ground** | Animated dashed strip synced to pipe speed |
| **Sound effects** | Flap / score / death tones via Web Audio API — no audio files needed |
| **Best score** | Persists across restarts in the same session; ★ NEW BEST badge on game-over |
| **Milestone flash** | Full-screen flash + score popup every 5 points |
| **Tab auto-pause** | Pauses automatically when you switch tabs |
| **Mobile support** | Touch events on canvas |

---

## 🎮 Controls

| Action | Input |
|---|---|
| Flap | `Space` / Click / Tap |
| Pause / Resume | `P` |
| Restart (after death) | `Space` / Click / Tap |

---

## 📁 File Structure

```
Flappy-bird-main/
├── index.html            # Entry point — open this in your browser
├── style.css             # Page and canvas layout
├── script.js             # All game logic
├── flappybird.png        # Bird sprite
├── toppipe.png           # Top pipe sprite
├── bottompipe.png        # Bottom pipe sprite
├── flappybirdbg.png      # Background image
├── FlappyBirdRegular.ttf # Custom game font
└── README.md             # This file
```

---

## ⚙️ Physics Reference

| Constant | Value | Purpose |
|---|---|---|
| `GRAVITY` | `0.5` | Downward acceleration (px/frame²) |
| `JUMP_VEL` | `-8.5` | Velocity on flap (px/frame) |
| `TERM_VEL` | `12` | Terminal velocity cap (px/frame) |
| `BASE_GAP` | `200 px` | Opening height at level 1 |
| `MIN_GAP` | `150 px` | Minimum opening at max difficulty |
| `BASE_SPEED` | `2.5 px/frame` | Pipe speed at level 1 |
| `MAX_SPEED` | `5.5 px/frame` | Hard cap on pipe speed |
| `MAX_GAP_JUMP` | `110 px` | Max vertical shift between consecutive pipe centres |
| `PIPE_SPACING` | `380 px` | Horizontal distance between pipe leading edges |
| `SHAKE_FRAMES` | `40 frames` | Death shake duration (~0.67 s) |

---

## 🏗️ Architecture

```
gameLoop()  ── requestAnimationFrame
  ├── update()        Physics tick (skipped when paused / game-over)
  │     ├── bird.update()      gravity, velocity clamp, collision
  │     ├── updatePipes()      translate, score, collision, cull
  │     └── updateGround()     scroll offset
  └── draw()          Render tick (always runs for shake decay)
        ├── camera shake
        ├── background, pipes, ground, bird
        ├── HUD (score, pills, flash)
        └── overlay (Start / Pause / Game Over)

scheduleNextPipe()  ── setTimeout, pixel-based interval
  └── createPipe()    clamped gapY spawn
```

---

## 🤝 Contributing

This project is part of the [100 Days 100 Web Projects](https://github.com/dhairyagothi/100_days_100_web_project) challenge.

1. Fork the repository
2. Create a branch: `git checkout -b enhance/<project-name>`
3. Commit with a conventional prefix: `fix:` `feat:` `docs:`
4. Open a Pull Request referencing the relevant issue

---

## 📄 License

Distributed under the MIT License. See the root [`LICENSE`](../../LICENSE) file.
