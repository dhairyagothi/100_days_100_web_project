# 🍅 Pomodoro Timer

A feature-rich, browser-based **Pomodoro Timer** built with vanilla **HTML, CSS, and JavaScript** — zero dependencies.

This project helps users improve productivity using the **Pomodoro Technique**, enhanced with a focus music player, task management, weekly streaks, strict mode, and full accessibility support.

---

## 📌 What is the Pomodoro Technique?

The **Pomodoro Technique** is a productivity method created by **Francesco Cirillo** in the late 1980s.

- Work with complete focus for a short period
- Take a small break
- Repeat the cycle

| Session Type | Default Duration |
|--------------|------------------|
| Focus Session | 25 Minutes |
| Short Break | 5 Minutes |
| Long Break | 15 Minutes |
| Cycles before Long Break | 4 |

> All durations are fully customisable via Settings.

---

## 🚀 Features

### ⏱️ Timer
- `Date.now()`-anchored countdown — immune to `setInterval` drift over long sessions
- `visibilitychange` listener recalculates elapsed time when you switch tabs and return
- Animated circular progress ring
- Auto-cycle: automatic work → short break → long break cycling
- Skip session button
- `meta theme-color` updates with mode colour (native mobile toolbar tint)

### 🎵 Focus Music Player
- 9 fully synthesized tracks via the **Web Audio API** — no external files, no network requests

| Category | Tracks |
|----------|--------|
| **Ambient** | Brown Noise, Pink Noise, White Noise, Lo-Fi, Deep Focus, Rain |
| **Binaural** | 40Hz Focus, Birdsong, Cafe Jazz |

- Volume control + mute toggle
- Last track & volume persisted to localStorage and auto-resumed on reload
- Auto-mutes tick sound when music is playing
- Headphone reminder toast for binaural tracks

### 📝 Task Management
- Add, complete, and delete tasks
- **Drag-to-reorder** tasks with HTML5 drag API and visual drop indicator
- Completed task guard: pomodoro not counted against already-completed tasks
- Confirm dialog before clearing completed tasks
- All tasks persisted to localStorage

### 📊 Stats & Streaks
- Weekly streak counter with a pure-CSS 7-day bar chart
- Session dot animations (scale + opacity transition on clear)
- Pomodoro count tracked per day

### ⚙️ Settings
- Custom durations for work, short break, and long break
- **Strict Mode** — blocks tab/mode switching mid-session
- Auto-start next session toggle
- All settings persisted to localStorage

### ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Start / Pause timer |
| `R` | Reset timer |
| `S` | Skip session |
| `M` | Mute / Unmute tick sound |

### ♿ Accessibility
- ARIA labels on all icon buttons (mute, music, settings, reset, skip)
- Visible focus rings for full keyboard navigation
- `prefers-reduced-motion` support
- Semantic HTML throughout

---

## 🐛 Bug Fixes (16 total)

| # | Bug | Fix |
|---|-----|-----|
| 1 | `setInterval` drift over long sessions | Anchored countdown to `Date.now()` |
| 2 | Tab switch loses elapsed time | `visibilitychange` recalculates on restore |
| 3 | `resetTimer()` throws NaN after settings change mid-session | NaN guard added |
| 4 | Progress ring divides by zero on first load | Fallback to `1` |
| 5 | `updateStats()` called on every tick second | Moved to `logPomodoro()` only |
| 6 | `tickTimeouts` not cleared on second `stopTick()` call | Guard added |
| 7 | `skipSession()` bypasses strict mode guard when timer not running | Guard tightened |
| 8 | `changeMode()` calls `pauseTimer()` redundantly before `startTimer()` | Removed redundant call |
| 9 | Settings save accepts NaN for numeric inputs | NaN guard on all numeric inputs |
| 10 | Space shortcut fires when modal inputs are focused | `tagName` guard widened to INPUT / TEXTAREA / role=dialog |
| 11 | AudioContext leaks on track change | `close()` old ctx before creating new one |
| 12 | iOS / Safari audio muted on synthesis start | `audioCtx.resume()` called before every synthesis |
| 13 | Jazz bass timer stored on `musicNodes` — missed on `stopMusic()` | Moved to module-level ref |
| 14 | Chirp timer same issue | Moved to module-level ref |
| 15 | `modeColors` throws on unknown mode key | Fallback guard added |
| 16 | localStorage `setItem` crashes silently on quota exceeded | All `setItem` calls wrapped in try/catch |

---

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Web Audio API

---

## 📂 Project Structure

```text
Pomodoro_Timer/
├── index.html       # Markup & layout
├── style.css        # Styles & animations
├── script.js        # Timer, audio, tasks & stats logic
└── README.md        # This file
```

---

## ⚙️ How It Works

1. Enter your current task in the task panel
2. Press **Start** or hit `Space` to begin the focus session
3. Work until the timer ends — it rings and auto-advances to a break
4. Mark your task complete after the session
5. Repeat — after 4 pomodoros a long break is triggered automatically

---

## 🏃 Run Locally

No build tools needed:

```bash
# Open directly in browser
open public/Pomodoro_Timer/index.html

# Or serve locally
npx serve public/Pomodoro_Timer
```

---

## 💡 Learning Objectives

This project demonstrates:
- DOM Manipulation & Event Handling
- Web Audio API (oscillators, noise synthesis, binaural beats)
- `Date.now()`-based accurate timers
- HTML5 Drag & Drop API
- localStorage persistence with quota error handling
- CSS animations & SVG progress rings
- Responsive design & accessibility (ARIA, keyboard nav)

---

## 🤝 Contribution

Contributions, feature suggestions, and improvements are welcome.

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Commit your changes
5. Open a Pull Request

---

## 📜 License

This project is open-source and available under the MIT License.

---

## ⭐ Acknowledgement

Inspired by the Pomodoro productivity technique developed by **Francesco Cirillo**.
