# Secure Password Generator

A modern, responsive password generator web app built with pure HTML, CSS, and JavaScript. No frameworks, no dependencies — just open `index.html` and go.

---

## Features

- **Glassmorphism dark UI** — elegant frosted-glass card on an animated gradient background
- **Cryptographically random** — uses `crypto.getRandomValues` with a Math.random fallback
- **Flexible character sets** — toggle Uppercase, Lowercase, Numbers, and Symbols independently
- **Length slider** — range from 4 to 32 characters with live display
- **Guaranteed character inclusion** — at least one character from every selected type
- **Password strength meter** — visual bar + label (Weak / Medium / Strong)
- **Copy to clipboard** — one-click copy with a smooth toast notification
- **Regenerate button** — spin animation + instant new password without re-opening settings
- **Validation** — friendly error when no character type is selected
- **Fully responsive** — adapts to desktop, tablet, and mobile
- **Accessible** — semantic HTML, ARIA labels, keyboard navigation, `prefers-reduced-motion` support

### Strength Rules

| Level  | Condition |
|--------|-----------|
| Weak   | Length < 8 **or** only 1 type selected |
| Medium | Length 8–15 with 2–3 types selected |
| Strong | Length ≥ 16 **and** all 4 types selected |

---

## Tech Stack

| Layer      | Technology |
|------------|------------|
| Markup     | HTML5 (semantic) |
| Styling    | CSS3 (custom properties, Grid, Flexbox, animations) |
| Logic      | Vanilla JavaScript (ES2020+, Web Crypto API) |
| Fonts      | System font stack (no external requests) |

---

## How to Run

1. Clone or download this repository.
2. Open `Secure_Password_Generator/index.html` in any modern browser.
3. That's it — no build step, no server required.

```bash
# Optional: serve locally with a lightweight server
npx serve Secure_Password_Generator
# or
python -m http.server --directory Secure_Password_Generator 8080
```

---

## Screenshots

> _Add screenshots here after opening the app in your browser._

| Desktop | Mobile |
|---------|--------|
| _(screenshot)_ | _(screenshot)_ |

---

## Project Structure

```
Secure_Password_Generator/
├── index.html   # App markup and structure
├── style.css    # All styling (glassmorphism, animations, responsive)
├── script.js    # Password generation logic and UI interactions
└── README.md    # This file
```

---

## Part of 100 Days · 100 Web Projects

This project is Day _N_ of the **100 Days 100 Web Projects** challenge.

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.
