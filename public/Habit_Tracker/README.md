# 🌱 Habit Tracker

A clean, glassmorphism-styled habit tracking web app that helps you build and maintain daily habits with streak tracking, category organization, and a satisfying completion experience.

---

## 📌 Introduction

Habit Tracker Pro is a lightweight, browser-based habit tracker built with plain HTML, CSS, and JavaScript. It lets users add daily habits, mark them as done, and automatically tracks streaks — all without needing a backend, since data is stored locally in the browser.

---

## ✨ Features

- **Add, complete, and delete habits** with a name, category, custom color, and optional notes
- **Live stats dashboard** showing Total Habits, Completed Today, and Best Streak
- **Search/filter** habits by name in real time
- **Daily streak tracking** with automatic daily reset and streak-decay if a day is missed
- **Motivational quote box** that displays a random quote on every load
- **Dark mode / light mode toggle**, with the selected theme persisted across sessions
- **Confetti celebration animation** when a habit is marked as done
- **Local storage based persistence** — no backend or database required
- **Responsive UI** that works smoothly on both desktop and mobile
- **Empty-state and no-results messaging** for a polished user experience

---

## 🛠️ Technologies Used

- **HTML5** — semantic structure and markup
- **CSS3** — glassmorphism design, responsive layout, dark mode theming, animations
- **JavaScript (Vanilla ES6)** — app logic, DOM manipulation, and state management
- **Web Storage API (`localStorage`)** — client-side data persistence

---

## 📁 Project Structure

```text
Habit_Tracker/
│
├── index.html      # App markup — header, stats, habit list, and Add Habit modal
├── script.js       # App logic — habits state, rendering, streaks, theme, confetti
└── styles.css      # Styling — layout, glassmorphism cards, dark mode, animations
└── README.md       # Documentation 
```

---

## ⚙️ Installation and Setup

No build tools or dependencies are required.

1. Clone or download this repository:
   ```bash
   git clone https://github.com/<your-username>/Habit_Tracker.git
   ```
2. Navigate into the project folder:
   ```bash
   cd Habit_Tracker
   ```
3. Open `index.html` directly in your browser, or serve it locally:
   ```bash
   npx serve .
   ```

---

## 🚀 Usage

1. Click **+ Add Habit** to open the modal.
2. Enter a habit name, choose a category, pick a color, and optionally add notes.
3. Click **Save Habit** to add it to your list.
4. Click **Mark Done** on a habit card once you've completed it for the day — this updates your streak and triggers a confetti animation.
5. Use the **search bar** to quickly filter habits by name.
6. Toggle the 🌙 / ☀️ button in the header to switch between dark and light mode.
7. Delete a habit anytime using the **Delete** button on its card.

---

## 🔮 Future Enhancements

- Edit existing habits instead of only add/delete
- Weekly/monthly habit completion history and charts
- Habit reminders/notifications
- Export/import habit data (backup and restore)
- Cloud sync/account support for multi-device access
- Accessibility improvements (ARIA roles, focus trapping in modal)

---

## 🤝 Contributing

Contributions are welcome!

1. Fork this repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m "Add: your feature description"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a Pull Request describing your changes

Please follow the existing code style and test your changes across browsers before submitting a PR.

---

## 📄 License

This project is open-source and available for learning and contribution purposes. Add your preferred license (e.g., MIT License) here.

---

## 👩‍💻 Author

**App Development and Documentation** — Sanyogita Singh
