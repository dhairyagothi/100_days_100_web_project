# Pageloader Demo

A clean, minimal web app that demonstrates how a **page preloader** works — built with pure HTML, CSS, and vanilla JavaScript. No frameworks, no dependencies.

---

## 📁 Project Structure

```
pageloader/
├── pageloader.html   → Main HTML structure
├── pageloader.css    → All styles and animations
├── pageloader.js     → Preloader logic, routing, form handling
└── README.md         → Project documentation
```

---

## ✨ Features

### 1. 🔄 Preloader / Loading Screen
- A full-screen loading overlay appears **before** the page content is shown
- Contains an animated **spinner** and a sliding **progress bar**
- Automatically hides once the browser has finished loading all assets (`window load` event)
- Page content fades in smoothly after the preloader disappears
- Built with pure CSS animations — no JavaScript animation libraries needed

### 2. ⏱️ Real Load Time Measurement
- The app measures the **actual page load time** using the browser's `performance.now()` API
- The real load time (in milliseconds) is displayed live on the **Home** section stats
- This makes the "99ms Load Time" stat dynamic and accurate — not hardcoded

### 3. 🧭 Single Page Navigation (Hash Routing)
- Navbar has three links — **Home**, **About**, and **Contact**
- Clicking a link does **not reload the page** — only the active section switches
- Routing is handled via URL hash (`#home`, `#about`, `#contact`)
- The active nav link is highlighted automatically based on the current hash
- Uses `hashchange` and `DOMContentLoaded` events to manage routing

### 4. 📬 Contact Form with Validation
- Form includes **Name**, **Email**, and **Message** fields
- Clicking **Send Message** triggers:
  - ⚠️ Validation check — all fields must be filled
  - ⏳ Button changes to "Sending…" state for 1.2 seconds (simulates network request)
  - ✅ Success message appears on submission
  - 🧹 All fields are automatically cleared after sending
  - Success/error message auto-hides after 4 seconds

### 5. 🎨 Responsive Design
- Layout adapts to all screen sizes — mobile, tablet, and desktop
- Navbar stacks vertically on small screens
- Feature grid and form rows collapse to single column on mobile
- Fully usable on any device

### 6. ♿ Accessibility Support
- Preloader uses `aria-hidden="true"` so screen readers skip it
- Success message uses `aria-live="polite"` to announce form feedback
- Supports `prefers-reduced-motion` — all animations are disabled for users who prefer no motion

---

## 🚀 How to Run

No installation or server required.

**Option 1 — Direct open:**
Double-click `pageloader.html` in your file explorer. It opens directly in your browser.

**Option 2 — VS Code Live Server:**
1. Open the `pageloader` folder in VS Code
2. Right-click `pageloader.html` → **Open with Live Server**
3. App runs at `http://127.0.0.1:5500/pageloader.html`

---

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| HTML5 | Page structure and semantics |
| CSS3 | Styling, animations, responsive layout |
| Vanilla JavaScript | Preloader logic, routing, form handling |
| Google Fonts (Syne + DM Sans) | Typography |
| CSS Custom Properties | Design tokens / theming |
| `performance.now()` | Real load time measurement |

---

## 🧠 Key JavaScript Concepts Covered

- `window.addEventListener("load", ...)` — fires after all assets are loaded
- `performance.now()` — high-precision timer for measuring load time
- `classList.add() / remove() / toggle()` — DOM class manipulation
- `window.location.hash` — reading URL hash for routing
- `hashchange` event — detecting navigation between sections
- `setTimeout()` — simulating async behavior (form send delay)
- `aria-live` — accessible live region for dynamic content

---

## 👩‍💻 Author

Built as part of the **100 Days 100 Web Projects** challenge.