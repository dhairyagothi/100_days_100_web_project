# 🌍 Travel Website

A visually immersive travel website built with **React + Vite** featuring a fullscreen video slider powered by **Swiper.js**. Each slide showcases a different travel experience with smooth autoplay transitions, navigation controls, and a responsive layout.

---

## ✨ Features

- 🎬 Fullscreen autoplay video background slider
- 🎯 Swiper.js integration with pagination & navigation arrows
- 🌙 Dark overlay for text readability
- 📱 Fully responsive — mobile & tablet friendly
- 🔤 Poppins font with bold uppercase slide headings
- 🔙 Back to Home button (fixed, glassmorphism style)
- 🧭 Navbar with smooth hover underline animations

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI rendering |
| Vite | Build tool & dev server |
| Swiper.js v11 | Video carousel/slider |
| CSS3 | Styling & animations |
| HTML5 Video | Background video playback |

---

## 📁 Project Structure

```
travel_website/
├── src/
│   ├── video/
│   │   ├── 1.mp4
│   │   ├── 2.mp4
│   │   ├── 3.mp4
│   │   ├── 4.mp4
│   │   └── 5.mp4
│   ├── App.jsx
│   ├── main.jsx
│   └── style.css
├── index.html
├── package.json
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/your-username/100_days_100_web_project.git

# Navigate to project
cd public/travel_website

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open **`http://localhost:5173`** in your browser.

> ⚠️ Do NOT open `index.html` directly in the browser — React/Vite projects require a dev server to run correctly.

---

## 🐛 Bug Fixes Applied

- **React 18 API fix** — Replaced deprecated `ReactDOM.render()` with `ReactDOM.createRoot().render()` in `main.jsx`
- **Duplicate DOM element removed** — Removed hardcoded `<a>` Back to Home button from `index.html` that was conflicting with the React-rendered styled button in `App.jsx`

---

## 👤 Author

**App Development and Documentation** — Sanyogita Singh

---

## 📄 License

This project is part of the [100 Days 100 Web Projects](https://github.com/dhairyagothi/100_days_100_web_project) open-source challenge.