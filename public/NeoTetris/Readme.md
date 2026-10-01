# 🎮 NeoTetris — Premium Cyberpunk Tetris Experience

<div align="center">


### A Modern Tetris Reimagined with Cyberpunk Visuals, Procedural Audio, Achievements, Daily Challenges, and Premium Game Feel.

[Live Demo](#) • [Report Bug](#) • [Request Feature](#)

</div>

---

## ✨ Overview

NeoTetris is a modern browser-based Tetris experience built from scratch using Vanilla JavaScript, HTML, and CSS.

Unlike traditional Tetris clones, NeoTetris focuses heavily on:

- Premium cyberpunk aesthetics
- Smooth gameplay mechanics
- Daily challenges
- Achievement progression
- Combo systems
- Theme customization
- Procedural sound effects
- Dynamic background music
- Particle effects
- Responsive design

The project combines classic arcade gameplay with modern UI/UX principles to create an engaging and visually immersive experience.

---

# 🚀 Features

## 🎯 Core Tetris Engine

- 10×20 official playfield
- 7-Bag randomizer system
- Tetromino rotation system
- Wall kick support
- Collision detection
- Gravity system
- Lock delay system
- Soft Drop
- Hard Drop
- Hold Piece
- Next Queue Preview
- Line Clearing
- Level Progression
- Score Calculation
- Game Over Detection

---

## 👻 Ghost Piece

A real-time ghost projection displays where the active piece will land.

Features:

- Updates instantly while moving
- Updates during rotations
- Semi-transparent rendering
- Active piece always takes visual priority

---

## 🔥 Combo System

Build consecutive line clears to trigger combo streaks.

Features:

- Live combo counter
- Combo multiplier display
- Visual combo tracker
- Combo milestones
- Bonus scoring rewards

---

## 🏆 Achievement System

Unlock achievements through gameplay milestones.

Examples:

- First Clear
- Combo Master
- Tetris Specialist
- Speed Runner
- Line Crusher
- Hold Expert
- High Score Hunter

Features:

- Persistent storage
- Progress tracking
- Unlock notifications
- Achievement progress bars

---

## 📅 Daily Challenge System

Every day generates a new set of challenges.

Examples:

- Clear 20 lines
- Reach Level 5
- Perform 10 Hard Drops
- Achieve a 5x Combo

Features:

- Daily rotation
- Progress persistence
- Completion rewards
- Dynamic challenge generation

---

## 🎨 Multiple Themes

### Neon Cyberpunk

- Neon cyan glow
- Purple accents
- Futuristic UI
- Synthwave atmosphere

### Classic Retro

- Arcade-inspired colors
- Vintage aesthetic
- Nostalgic feel

### Dark Minimal

- Clean modern design
- Reduced visual noise
- Professional appearance

### Space Theme

- Deep-space inspired palette
- Cosmic glow effects
- Atmospheric visuals

Theme preferences are automatically saved.

---

## 🎵 Dynamic Audio System

Built entirely using the Web Audio API.

No external audio files required.

### Sound Effects

- Movement
- Rotation
- Hold
- Soft Drop
- Hard Drop
- Piece Lock
- Line Clear
- Double Clear
- Triple Clear
- Tetris
- Combo Milestones
- Achievement Unlocks
- Level Ups
- Game Over

### Background Music

Procedurally generated music changes according to the selected theme.

#### Neon Cyberpunk

- Synthwave inspired
- Bass pulses
- Arpeggiated melodies

#### Classic Retro

- 8-bit arcade music
- Chiptune sounds

#### Dark Minimal

- Ambient electronic tones

#### Space Theme

- Atmospheric sci-fi pads

---

## ✨ Particle Effects

Interactive visual feedback system.

Effects include:

- Hard Drop Sparks
- Line Clear Explosions
- Achievement Celebrations
- High Score Confetti
- Level Up Effects

---

## 💾 Persistent Storage

NeoTetris stores:

- High Score
- Achievements
- Daily Progress
- Theme Selection
- Volume Settings
- Audio Preferences

using LocalStorage.

---

# 🛠️ Tech Stack

| Technology | Purpose |
|------------|----------|
| HTML5 | Structure |
| CSS3 | Styling |
| JavaScript (ES6+) | Game Logic |
| Web Audio API | Audio Synthesis |
| Canvas API | Particle Effects |
| LocalStorage | Persistence |

---

# 🧠 Architecture

```text
NeoTetris
│
├── Engine
│   ├── Board Logic
│   ├── Collision System
│   ├── Rotation System
│   ├── Gravity
│   ├── Lock Delay
│   └── Spawn System
│
├── Renderer
│   ├── Board Rendering
│   ├── Ghost Piece
│   ├── UI Updates
│   └── Animations
│
├── Audio
│   ├── Procedural SFX
│   ├── Background Music
│   └── Audio Controls
│
├── Progression
│   ├── Scoring
│   ├── Levels
│   ├── Achievements
│   └── Daily Challenges
│
└── Persistence
    └── LocalStorage
```

---

# 🎮 Controls

| Key | Action |
|------|---------|
| ← | Move Left |
| → | Move Right |
| ↓ | Soft Drop |
| ↑ | Rotate |
| Space | Hard Drop |
| C | Hold Piece |
| P | Pause Game |
| Enter | Start Game |

---

# 🌟 Highlights

### Premium UI

Designed with a modern cyberpunk aesthetic featuring:

- Glassmorphism
- Neon glows
- Animated overlays
- Responsive layouts

### Fully Procedural Audio

No audio assets required.

Everything is synthesized in real time.

### High Performance

Optimized rendering pipeline:

- DOM diff rendering
- Cached board cells
- Efficient particle system
- Minimal reflows

---

# 🔮 Future Roadmap

## v1.1

- Mobile controls
- Touch gestures
- Key rebinding

## v1.2

- Online leaderboard
- Replay system
- Statistics dashboard

## v2.0

- Multiplayer mode
- Ranked matches
- Global events

---

# 🤝 Contributing

Contributions, issues, and feature requests are welcome.

Feel free to:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

---

# 📜 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Tanmoy Saha**

Passionate about software engineering, open source, web development, and building polished user experiences.

---

<div align="center">

### ⭐ If you enjoyed NeoTetris, consider giving the repository a star!

Built with ❤️ and lots of ☕ by Tanmoy Saha

</div>