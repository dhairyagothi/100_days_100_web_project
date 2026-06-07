# ⏰ Neon Reminders

A sleek, modern, and highly functional reminder web application built entirely with HTML, CSS, and Vanilla JavaScript. Say goodbye to bulky dependencies and hello to lightning-fast performance and a beautiful dark-mode UI.

## Features

- **Dark Mode UI**: A gorgeous, eye-friendly dark theme with vibrant neon accents.
- **Glassmorphism**: Subtle translucent panels that give the app a premium, modern feel.
- **Dynamic Analytics**: Keep track of your productivity with a real-time counter of Active vs. Completed tasks.
- **Priority Labeling**: Categorize your reminders by Low (Green), Medium (Orange), or High (Red) priority.
- **Smart Sorting**: Tasks automatically sort themselves. The ones due the earliest float to the top, and completed tasks get pushed to the bottom.
- **Background Alerts**: Set it and forget it! A lightweight background loop checks your deadlines every few seconds. When time is up, you get a beautiful in-app toast notification (and a native browser notification if you allow it).
- **Persistent Storage**: Close the tab? No problem. Everything is safely saved to your browser's Local Storage.

## 🚀 How to Run

Because this app uses purely native web technologies, there's absolutely no build step or package installation required!

1. **Open the folder**: Navigate into the `Reminder-App` directory.
2. **Launch the app**: Simply double-click the `index.html` file to open it in your favorite web browser. 
3. *(Optional)*: If you use VS Code, you can right-click `index.html` and select **"Open with Live Server"** for an even smoother experience.

## 🛠️ Architecture

The codebase is split cleanly into three modular files for maximum readability and maintainability:

1. `index.html`: The semantic structure and layout, utilizing modern HTML5 form elements like `datetime-local`.
2. `style.css`: The visual engine powered by CSS Custom Properties (variables) for easy theming, custom scrollbars, and keyframe micro-animations.
3. `script.js`: The brains of the operation. It manages state, talks to `localStorage`, handles DOM manipulation, and runs the silent interval loop for deadline checks.

## 🤝 Enjoy!

Whether you use this to remember to drink water, attend a meeting, or finish a coding project, I hope this little app brings a spark of neon joy to your day!
