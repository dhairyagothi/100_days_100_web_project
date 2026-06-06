# 📝 TodoList App

A clean, feature-rich Todo List application built with **React**, **TypeScript**, and **Tailwind CSS**, powered by **Vite**.

---

## ✨ Features

- ✅ **Add & Remove Tasks** — Quickly add todos with Enter key or the + button
- 🏷️ **Custom Tags** — Organize tasks under tags like `personal`, `work`, or any custom tag you create
- 📌 **Pin Tasks** — Pin important tasks to find them easily
- 🔁 **Recurring / Daily Tasks** — Mark tasks as daily; they auto-reset every new day
- ☑️ **Complete Tasks** — Strike through completed tasks
- 🔍 **Filter View** — Filter tasks by All, Tags, Completed, Pinned, or Dailies
- 🌙 **Dark Mode** — Toggle between light and dark theme
- 🖨️ **Export** — Print your todo list via the Export button
- 💾 **Persistent Storage** — All data saved in `localStorage`, survives page refresh

---

## 🛠️ Tech Stack

| Technology   | Purpose                 |
| ------------ | ----------------------- |
| React 18     | UI framework            |
| TypeScript   | Type safety             |
| Tailwind CSS | Styling                 |
| Vite         | Build tool & dev server |
| localStorage | Data persistence        |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [Bun](https://bun.sh/) (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd TodoList-React-TS-Tailwind

# Install dependencies
npm install
# or with bun
bun install
```

### Running the App

```bash
# Start development server
npm run dev
# or
bun run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
# or
bun run build
```

---

## 📁 Project Structure

```
TodoList-React-TS-Tailwind/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Header.tsx        # Top navbar with dark mode toggle & export
│   │   ├── Settings.tsx      # Settings panel (placeholder)
│   │   └── Todolist.tsx      # Main todo logic & UI
│   │   └── TodolistItem.css  # Icon sizing styles
│   ├── App.tsx               # Root component, dark mode state
│   ├── App.css               # Global font import (Jost)
│   ├── index.css             # Tailwind directives
│   └── main.tsx              # React entry point
├── index.html
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.app.json
```

---

## 🎮 How to Use

1. **Add a Task** — Type in the input box and press `Enter` or click `+`
2. **Select a Tag** — Choose a tag before adding (default: `personal`)
3. **Add Custom Tags** — Type in the "Add Tag..." box and press `Enter`
4. **Complete a Task** — Click anywhere on the task card to toggle completion
5. **Pin a Task** — Click the 📌 pin icon on the task
6. **Make it Recurring** — Click the 🔁 repeat icon; task resets daily
7. **Delete a Task** — Click the ✖ close icon
8. **Filter Tasks** — Use the "Filter By" dropdown to change view
9. **Dark Mode** — Click the 🌙/☀️ button in the header
10. **Reset Tags** — Click the reset button to restore default tags (`personal`, `work`)

---

## 📦 Dependencies

```json
"react": "^18",
"react-icons": "^5",
"tailwindcss": "^3",
"typescript": "^5",
"vite": "^5"
```

---

## 📄 License

This project was built as part of GSSoC contribution 2026.
