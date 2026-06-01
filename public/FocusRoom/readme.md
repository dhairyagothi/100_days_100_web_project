# ⚡ FocusForge — Pomodoro Focus Timer

A modern, feature-rich Pomodoro timer web app built with pure HTML, CSS, and JavaScript. Stay productive with timed focus sessions, structured breaks, motivational quotes, and a beautiful glassmorphism dark-mode UI.

---

## Description

FocusForge applies the **Pomodoro Technique** to help you achieve deep, distraction-free work. Work in focused sprints, take structured breaks, track completed sessions, and stay motivated — all from a single HTML file with no build tools or dependencies required.

---

## Features

| Feature | Details |
|---|---|
| ⏱ Pomodoro Timer | 25-min focus / 5-min break (fully customizable) |
| ▶ Controls | Start, Pause, Reset, Skip |
| 🔄 Auto-switch | Automatically transitions focus → break → focus |
| 🎯 Session Counter | Tracks completed focus sessions (persisted) |
| 🔔 Sound Notification | Web Audio API chime — no external audio files |
| 🌐 Browser Notifications | Optional desktop push notifications |
| 💬 Motivational Quotes | 24 handpicked quotes shown after each focus session |
| 💾 LocalStorage | Persists settings, session count, and theme |
| 🌙 Theme Toggle | Dark (default) and Light modes |
| 📱 Responsive | Desktop, tablet, and mobile friendly |
| ⌨ Keyboard Shortcuts | `Space`, `R`, `S`, `Esc` |
| ♿ Accessible | Semantic HTML, ARIA labels, focus management |

---

## Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Semantic structure & accessibility |
| CSS3 | Glassmorphism design, SVG ring animation, responsive layout |
| JavaScript (ES6+) | Timer logic, modular IIFE architecture |
| Web Audio API | Completion chime (no external files) |
| Notification API | Optional desktop notifications |
| LocalStorage API | Settings & session persistence |

---

## How to Run

No build tools, servers, or npm installs required.

1. **Clone** or download the repository
2. **Navigate** to `public/FocusForge/`
3. **Open** `index.html` in any modern browser

```bash
# Optional: serve with a local static server
npx serve public/FocusForge
# or
python -m http.server 8080 --directory public/FocusForge
```

---

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `Space` | Start / Pause timer |
| `R` | Reset current mode timer |
| `S` | Skip to next mode |
| `Esc` | Close settings panel / popup |

---

## Screenshots

> _Open `index.html` in your browser to see the live app!_
>
> `[screenshot-dark.png]` — Dark mode (default)  
> `[screenshot-light.png]` — Light mode  
> `[screenshot-mobile.png]` — Mobile view  

---

## Project Structure

```
FocusForge/
├── index.html   # Semantic HTML structure & accessibility markup
├── style.css    # Glassmorphism UI, SVG ring, dark/light themes, animations
├── script.js    # Modular JS: State, Timer, Audio, Notifications, UI, Quotes
└── README.md    # This file
```

---

## Future Improvements

- [ ] Long break mode (15 min after every 4 focus sessions)
- [ ] Task list / to-do integration per session
- [ ] Daily & weekly focus statistics dashboard
- [ ] Custom alarm sound upload
- [ ] Progressive Web App (PWA) with offline support & installability
- [ ] Pomodoro session log export (CSV / JSON)
- [ ] Ambient background sounds (rain, white noise)
- [ ] Multiple Pomodoro presets (52/17, 90-min deep work blocks)

---

## Contribution Note

Contributions, issues, and feature requests are welcome!  
Feel free to open a pull request or file an issue on the main repository.

Please follow the existing code style: vanilla JS only, no frameworks, no backend.

---

Built with focus. Ship with momentum. ⚡
