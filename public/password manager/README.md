# PassX — Modern Personal Password Manager (Day 31)

PassX is a sleek, state-of-the-art, client-side password manager featuring a premium dark cybersecurity interface, dynamic live complexity analysis, multi-layered visibility controls, and offline-first data persistence.

Built entirely using pure web standards (HTML5, CSS3, Vanilla JS) with zero external dependencies.

---

## ✨ Features & Enhancements

### 🎨 1. Premium Cyberpunk Dark Aesthetics
- **Harmonious Color Palette:** Designed with deep midnight-slate (`#080b11`), card backgrounds with subtle gradients, and glowing emerald-green accent states.
- **Glassmorphism Components:** Sleek frosted cards utilizing `backdrop-filter` rules.
- **Responsive Layout:** Engineered using CSS Flexbox and Grid to look stunning on desktop monitors, tablets, and small mobile screens.
- **Interactive Micro-animations:** Smooth scaling transitions, input focus glows, and slide-in toast prompts.

### ⚡ 2. Real-Time Password Strength Indicator
- Evaluates password complexity character-by-character as you type.
- Analyzes length, lowercase, uppercase, digits, and special characters.
- Dynamically scales and transitions color-coded segments:
  - **Weak:** Solid Red (too insecure)
  - **Medium:** Amber/Orange (good standard)
  - **Strong:** Glowing Emerald Green (highly secure)

### 👁️ 3. Dual-Layer Show/Hide Visibility Toggles
- **Form Input Visibility:** Toggle the password input field instantly between masked `password` and readable `text` views using the inline SVG eye icon.
- **Saved Entries Table Visibility:** Passwords are securely masked by default using modern bullet points (`••••••••`) matching the exact character length. An inline toggle button enables users to reveal or hide individual passwords in-place.

### 📋 4. One-Click Smart Actions
- Dedicated inline clipboard copy buttons for **Website**, **Username**, and **Password** columns.
- One-click credential deletion with reactive list updating.

### 🔔 5. Animated Toast Notifications
- Replaced intrusive browser-native `alert()` popups with elegant, self-expiring Toast notification slide-ins at the bottom-right.
- Color-coded states to represent copies (indigo), successes (green), and deletions (rose).

### 🔒 6. Zero-Server Local Storage
- Seamless client-side persistence using `localStorage`.
- Remains 100% compatible with existing credential data models.

---

## 🛠️ Technology Stack
- **Structure:** Semantic HTML5 Markup
- **Styling:** Vanilla CSS3 (featuring HSL tailored variables & custom Google Fonts: `Space Grotesk` & `Plus Jakarta Sans`)
- **Logic:** Vanilla JavaScript (ES6 Modules)
- **Icons:** Highly scalable inline SVGs

---

## 🚀 How to Run Locally

1. Clone or navigate to the repository directory.
2. Open the file `public/password manager/index.html` directly in any web browser.
3. Alternatively, launch a local web server (e.g. VS Code Live Server or python `http.server`) to access:
   ```bash
   http://localhost:5500/public/password%20manager/index.html
   ```
