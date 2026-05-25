# Pomodoro Garden 🌱

> A meditative focus timer that grows a wabi-sabi inspired garden as you work.

Pomodoro Garden reframes the productivity timer as a quiet, accumulating ritual.
Each completed focus session plants a new procedurally-generated SVG plant in
your garden. Over days and weeks, an asymmetric grove emerges — a slow,
material record of your time.

Built entirely with vanilla HTML/CSS/JavaScript. No frameworks. No build step.
ES modules, native Web APIs, and a deliberately small surface area.

---

## ✦ Features

### Focus
- **Pomodoro state machine** — focus → short break → long break, configurable cycle
- **Drift-free countdown** — wall-clock anchored timing survives tab throttling
- **Wake Lock API** — keeps the screen awake during focus sessions
- **Page Visibility API** — re-acquires wake lock when the tab regains focus
- **Web Notifications** when a session ends (background tab only)
- **Keyboard shortcuts** — `Space` start/pause · `R` reset · `S` skip · `C` settings · `T` theme

### Garden
- **8 procedural plant archetypes** — sprout, herb, flower, fern, bonsai, bamboo, pine, maple
- **Seeded PRNG** (mulberry32) — each plant is deterministic but unique
- **Poisson-ish placement** — plants distribute naturally, no overlap
- **Depth-scaled rendering** — plants closer to the foreground draw larger and on top
- **Rarity-by-duration** — longer focus sessions unlock rarer plant types
- **Procedural SVG with per-instance palettes** — colors theme automatically with the page

### Soundscapes
- **Web Audio synthesized** — no mp3 files, every sound is generated live
- **Forest** — filtered noise + slow LFO + scheduled FM bird chirps
- **Rain** — high-pass noise with modulation
- **Singing bowls** — harmonic stacks at A3/C4/E4/G4/A4 with long exponential decay
- **Session chimes** — soft bell tones at phase boundaries

### Atmosphere
- **Time-of-day rendering** — palette and particles shift between dawn / morning / day / afternoon / dusk / night based on real clock
- **Particle canvas** — fireflies at night, warm dust motes at dusk and dawn, drifting petals in the day
- **Paper-grain overlay** — SVG turbulence noise for material texture
- **Breathing timer ring** — active focus mode adds a subtle inhale/exhale animation

### Data
- **IndexedDB persistence** with localStorage fallback
- **GitHub-style heatmap** — last 90 days of focus activity
- **Streak tracking** — forgives missing today, breaks on yesterday
- **Stats** — current streak, today's sessions, lifetime hours focused

### Achievements
Ten milestones tracking session counts, streaks, time totals, and time-of-day
patterns (early bird, night owl). Toast notifications on unlock.

### PWA
- **Installable** as a standalone app via the web app manifest
- **Offline-capable** via service worker (cache-first app shell, network-first for fonts)

### Easter egg
Try the Konami code. `⬆ ⬆ ⬇ ⬇ ⬅ ➡ ⬅ ➡ b a`

---

## ✦ Architecture
Pomodoro-Garden/
├── index.html              Semantic markup, dialog modal, canvas hook
├── style.css               Full design system: tokens, themes, time-of-day overrides
├── manifest.webmanifest    PWA metadata
├── service-worker.js       Offline cache
└── src/
├── main.js             Entry — wires all subsystems
├── store.js            Proxy-based reactive store with path subscriptions
├── bus.js              Cross-module event bus
├── storage.js          IndexedDB KV wrapper + localStorage fallback
├── timer.js            State machine (idle/focus/short-break/long-break/paused)
├── garden.js           Procedural SVG plant generation + Poisson placement
├── audio.js            Web Audio API ambient soundscapes + chimes
├── analytics.js        90-day heatmap + streak/stats computation
├── achievements.js     Milestone tracking + toast UI
└── effects.js          Time-of-day watcher + particle field

### Design notes

**No build step.** The repository is a static site. ES modules load natively via
`<script type="module">`. Open `index.html` over a local web server.

**Reactive state via Proxy.** `store.js` provides path-based subscriptions
(`store.subscribe('settings.theme', fn)`) and bubble-up notifications when nested
properties change. Around 60 lines, no dependencies.

**Event bus for decoupling.** Modules don't import each other directly. The
timer emits `session:complete`, and the garden, analytics, and achievements
each subscribe independently.

**SVG palettes use CSS variables.** Plant colors are declared as CSS custom
properties on each `.plant` element, allowing the page theme (light/dark) and
time-of-day to retint the entire garden without re-rendering.

---

## ✦ Run it

This is a static site. You need to serve it over HTTP (not `file://`) because
ES modules and the service worker require an origin.

```bash
# In VS Code: install the Live Server extension, then right-click index.html → "Open with Live Server"

# Or with Python:
python -m http.server 8080

# Or with Node:
npx serve .
```

Open `http://localhost:8080` (or whatever port).

---

## ✦ Browser support

Tested on modern Chrome, Firefox, Safari, Edge. Uses:

- ES2020 modules
- `Proxy`
- `IndexedDB` (with localStorage fallback)
- `Web Audio API`
- `Wake Lock API` (Chrome/Edge; gracefully skipped elsewhere)
- `Web Notifications` (optional, off by default)
- `Service Worker` + Web App Manifest
- CSS `color-mix()`, custom properties, `dvh` units, `<dialog>` element

Reduced motion respected.

---

## ✦ Credits

Built for [100_days_100_web_project](https://github.com/dhairyagothi/100_days_100_web_project)
during GSSOC'26 by [@snowhiteohno](https://github.com/snowhiteohno).

Fonts: [Shippori Mincho](https://fonts.google.com/specimen/Shippori+Mincho),
[Zen Maru Gothic](https://fonts.google.com/specimen/Zen+Maru+Gothic),
[JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) — all SIL OFL.

Aesthetic owes a debt to wabi-sabi (侘寂) and sumi-e ink-wash traditions.