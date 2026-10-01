# 🔄 Pageloader Demo

> **See It Load Before It Loads** — A clean, minimal web app demonstrating how a page preloader works, built with pure HTML, CSS, and Vanilla JavaScript. No frameworks, no dependencies.

---

## ✨ Overview

Pageloader Demo is a lightweight single-page application that showcases a smooth preloader experience with real load time measurement, hash-based routing, and an accessible contact form. Built as part of the **100 Days 100 Web Projects** challenge, it demonstrates core web concepts without relying on any external libraries or frameworks.

---

## 🚀 Features

### 🔄 Preloader / Loading Screen
- Full-screen loading overlay appears before page content is shown
- Animated spinner and sliding progress bar
- Automatically hides once all assets are loaded via `window load` event
- Page content fades in smoothly after preloader disappears
- Built with pure CSS animations — no JavaScript animation libraries needed

### ⏱️ Real Load Time Measurement
- Measures actual page load time using the browser's `performance.now()` API
- Real load time displayed live on the Home section stats
- Dynamic and accurate — not hardcoded

### 🧭 Single Page Navigation (Hash Routing)
- Navbar with three links — Home, About, and Contact
- Clicking a link does not reload the page — only the active section switches
- Routing handled via URL hash (`#home`, `#about`, `#contact`)
- Active nav link highlighted automatically based on current hash
- Uses `hashchange` and `DOMContentLoaded` events to manage routing

### 📬 Contact Form with Validation
- Form includes Name, Email, and Message fields
- Validation check — all fields must be filled
- Button changes to "Sending…" state for 1.2 seconds (simulates network request)
- Success message appears on submission
- All fields automatically cleared after sending
- Success/error message auto-hides after 4 seconds

### 📱 Responsive Design
- Desktop optimized
- Tablet friendly
- Mobile responsive

### ♿ Accessibility Support
- Preloader uses `aria-hidden="true"` so screen readers skip it
- Success message uses `aria-live="polite"` to announce form feedback
- Supports `prefers-reduced-motion` — all animations disabled for users who prefer no motion

---

## 📸 Screenshots

### Preloader Screen
- Full-screen animated overlay with spinner
- Sliding progress bar before content loads

### Home Section
- Live load time stat display
- Clean hero layout with navigation

### Contact Form
- Validated form with success feedback
- Responsive single-column layout on mobile

---

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript (ES6+)

### UI & Styling
- CSS Flexbox
- CSS Grid
- Custom Animations
- Responsive Design Principles

### Features
- Hash-based SPA Routing
- Preloader Logic
- Contact Form Validation
- Real Load Time Measurement via `performance.now()`
- Accessibility (`aria-hidden`, `aria-live`, `prefers-reduced-motion`)

---

## 📂 Project Structure

```bash
pageloader/
│
├── pageloader.html   → Main HTML structure
├── pageloader.css    → All styles and animations
├── pageloader.js     → Preloader logic, routing, form handling
└── README.md         → Project documentation
```

---

## ⚡ Getting Started

### Clone the Repository

```bash
git clone https://github.com/your-username/pageloader-demo.git
```

### Navigate to Project Directory

```bash
cd pageloader
```

### Run the Project

Simply open:

```bash
pageloader.html
```

or use VS Code Live Server:

```bash
Right Click → Open with Live Server
```

---

## 🎯 Future Enhancements

- Multiple theme support
- Custom preloader animation styles
- Backend-connected contact form
- Progress bar tied to real asset loading
- Page transition animations between sections
- Preloader percentage counter

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to GitHub

```bash
git push origin feature-name
```

5. Open a Pull Request

---

## 🌟 Acknowledgements

Built as part of the **100 Days 100 Web Projects** challenge — focused on demonstrating core web fundamentals with clean, dependency-free code.

---

## 👩‍💻 Authors

| Role | Name |
|---|---|
| 💻 App Development | **Sanyogita Singh** |
| 📝 Documentation | **Sanyogita Singh** |

---

## 📜 License

This project is licensed under the MIT License.

---

<div align="center">

### 🔄 Pageloader Demo

**See It Load Before It Loads**

Built with ❤️ and lots of coffee ☕

</div>