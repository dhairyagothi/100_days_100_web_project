# ⌨️ Typer — Relaxing Typing Speed Test

A beautiful, minimalist typing speed test built with vanilla HTML, CSS, and JavaScript. Practice typing speed and accuracy across three difficulty levels in a calm, distraction-free environment.

---

## 🆕 What's New in v2.0

- **Difficulty Levels** — Choose Easy, Medium, or Hard before every test
- **Live Difficulty Badge** — Color-coded badge displayed during the test
- **Results Enhancement** — Difficulty level shown on the results screen
- **Hard Mode** — New sentences with technical vocabulary, numbers, and special characters

---

## 🎯 Features

### Difficulty Levels

| Level | Content | Example |
|-------|---------|---------|
| 🟢 Easy | Short sentences, common words | `The cat sat on the mat.` |
| 🟡 Medium | Moderate length, mixed vocabulary | `Patience and persistence are keys to achieving success.` |
| 🔴 Hard | Long sentences, technical terms, numbers & symbols | `HTTP/3 uses QUIC over UDP; latency reduces by 12–15%.` |

Each difficulty has a pool of 15 sentences that are picked at random each test.

### Real-Time Visual Feedback
- ✅ **Correct characters** turn **green**
- ❌ **Wrong characters** turn **red** with a highlight
- 🔵 **Current character** shows a blinking blue cursor
- Untyped text appears in muted gray

### Live Statistics (during test)
- **WPM** — updates on every keystroke
- **Accuracy %** — recalculates in real time
- **Characters typed** — running count
- **Stopwatch** — elapsed time in minutes and seconds

### Results Dashboard (after test)
- Words Per Minute
- Accuracy %
- Time taken
- Error count
- Difficulty completed

### Design & UX
- **Dark / Light Mode** — toggle with the moon/sun button; preference saved to `localStorage`
- **Responsive** — works on desktop and mobile
- **Smooth animations** — fade-in, slide-in, micro-interactions
- **Zero dependencies** — no frameworks, no build tools

---

## 🚀 How to Use

1. Open `index.html` in your browser
2. Select a difficulty — **Easy**, **Medium**, or **Hard**
3. Click **START TEST**
4. Type the sentence exactly as shown
5. Finish typing to see your results automatically
6. Click **TRY AGAIN** for a new sentence at any difficulty

### Controls

| Button | Action |
|--------|--------|
| Start Test | Begin a new typing test |
| Reset | Clear input and return to difficulty selection |
| Try Again | Start fresh (keeps current difficulty) |
| 🌙 / ☀️ | Toggle dark / light mode |

---

## 📊 How Stats Are Calculated

| Stat | Formula |
|------|---------|
| WPM | `(Characters Typed / 5) / Time in Minutes` |
| Accuracy | `(Correct Characters / Total Typed) × 100%` |
| Errors | `Total Typed − Correct Characters` |

The standard 5-characters-per-word formula is used for WPM.

---

## 💾 File Structure

```
typer/
├── index.html     — Page layout, difficulty UI, styles, results screen
├── script.js      — Difficulty data, game logic, WPM/accuracy, events
└── style.css      — Reserved for additional custom styles
```

---

## 🎨 Customization

### Add sentences to a difficulty pool

In `script.js`, each difficulty has a `sentences` array:

```javascript
const difficultyData = {
    easy: {
        sentences: [
            "Your new easy sentence here.",
            // add as many as you like
        ]
    },
    medium: { sentences: [ /* ... */ ] },
    hard:   { sentences: [ /* ... */ ] }
};
```

### Change theme colors

Edit CSS variables inside `index.html`:

```css
:root {
    --correct: #4ade80;   /* green for correct chars */
    --wrong:   #ef4444;   /* red for wrong chars     */
    --accent:  #3b82f6;   /* blue cursor & buttons   */
}
```

### Adjust timer update frequency

In `script.js` inside `initTest()`:

```javascript
timerInterval = setInterval(() => { ... }, 100); // ms between updates
```

---

## 🌓 Theme Colors

### Light Mode (default)
- Background: White / `#f8f9fa`
- Text: `#1a1a1a`
- Borders: `#e0e0e0`

### Dark Mode
- Background: `#0f0f0f` / `#1a1a1a`
- Text: White
- Accent: `#60a5fa`

---

## 📱 Browser Support

| Browser | Status |
|---------|--------|
| Chrome / Chromium | ✅ |
| Firefox | ✅ |
| Safari | ✅ |
| Edge | ✅ |
| iOS Safari / Chrome Mobile | ✅ |

---

## 🔧 Technical Details

- **HTML5** — semantic markup
- **CSS3** — flexbox, grid, custom properties, animations
- **Vanilla JavaScript** — no libraries or build tools
- **localStorage** — saves theme preference between sessions
- Lightweight — three files, no external dependencies

---

## 💡 Tips for Best Results

1. **Sit up straight** — good posture improves accuracy
2. **Use home row** — keep fingers on ASDF / JKL;
3. **Eyes on screen** — don't look at the keyboard
4. **Accuracy first** — speed follows naturally
5. **Practice daily** — 5 minutes a day makes a real difference
6. **Take breaks** — rest hands every 20–30 minutes

---

## 📈 Planned Enhancements

- Timed challenges (30s / 60s / 120s countdown modes)
- Custom difficulty mode
- Difficulty-based leaderboards
- Achievement badges
- Keyboard shortcuts
- Multilingual sentence packs

---

## ⚙️ Version Info

| Field | Value |
|-------|-------|
| Version | 2.0 |
| Updated | June 2026 |
| Project | 100 Days of Web — GSSoC 2026 |
| Status | Active development |

---

## 📄 License

Free to use and modify for personal and educational purposes.

---

**Happy Typing! 🎉** Practice daily and watch your speed soar.
