# ✨ Boredom Buster

> Beat the block. Discover your next adventure — instantly.

A zero-dependency, single-page web app that suggests activities to cure boredom, with smart API fallback, persistent favourites, session history, and full dark/light mode.

---

## Features

- 🌙☀️ **Dark / Light Mode** — toggle anytime, preference persists via CSS variables
- 🔍 **Smart 3-Stage API Fallback** — tries full filters → category only → random before giving up
- 📚 **Local Activity Library** — 30 hand-curated activities across all 9 categories, used when the API is unavailable or returns no match
- 🧡 **Favourites** — save activities and re-visit them; stored in `localStorage` so they survive page refresh
- 🕓 **History** — tracks the last 20 activities found in the current session
- 📋 **Copy to Clipboard** — one-click copy of the activity text
- 🔔 **Toast Notifications** — non-intrusive slide-up messages for user feedback
- 🔀 **Shuffle** — find another activity with the same filters instantly

---

## How to Run

No build step, no dependencies, no server needed.

1. Clone or download the repository.
2. Open `public/BordemBuster/index.html` directly in any modern browser.
3. That's it — everything works offline thanks to the local activity library.

---

## File Structure

```
BordemBuster/
├── index.html   — App markup, semantic HTML5
├── style.css    — All styles, CSS variables for theming
├── script.js    — App logic, API calls, state management
└── README.md    — This file
```

---

## API Credit

Activities are sourced from the **[Bored API by Le Wagon](https://bored.api.lewagon.com)** — a free, open API for finding random activities.

- Base URL: `https://bored.api.lewagon.com/api/activity`
- Supports filters: `type`, `participants`, `price`, `minprice`, `maxprice`

---

## License

MIT — free to use, modify, and distribute.