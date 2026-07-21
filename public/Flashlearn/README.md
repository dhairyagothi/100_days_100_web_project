# ⚡ FlashLearn - Interactive Flashcard Platform

A clean, minimalist, and fully responsive **Flashcard Learning Platform** built with Vanilla HTML5, CSS3, and JavaScript. Features interactive 3D card flips, text-to-speech audio, customizable deck and card management, learning analytics, dark mode, and complete `localStorage` data persistence.

---

## 🌟 Key Features

1. **Clean & Minimal UI Design**:
   - Modern typography (`Plus Jakarta Sans` & `Inter`).
   - Smooth light & dark mode toggle with automatic preference saving.
   - Glassmorphic navigation header and micro-interactions.

2. **Pre-Loaded Sample Decks**:
   - **JavaScript Essentials** (Coding)
   - **Web Development 101** (Coding)
   - **Spanish Vocabulary** (Languages)
   - **Science & Nature** (General Science)

3. **Interactive 3D Study Engine**:
   - 3D CSS flip animation with question on front, answer and hint on back.
   - **Text-to-Speech (Pronunciation)**: Listen to cards using browser speech synthesis.
   - **Keyboard Controls**:
     - <kbd>Space</kbd>: Flip card
     - <kbd>←</kbd> / <kbd>→</kbd>: Previous / Next card
     - <kbd>1</kbd>: Mark as "Still Learning"
     - <kbd>2</kbd>: Mark as "Mastered"
   - Card Shuffle & Session Restart options.

4. **Deck & Card Manager**:
   - Create, edit, and delete custom decks with categories and emoji icons.
   - Add, edit, or remove flashcards with custom questions, answers, and hints.
   - Tabular overview with instant card count and mastery tags.

5. **Analytics & Local Data Persistence**:
   - Overall mastery rate (%) and deck progress indicators.
   - Automatic `localStorage` saving — your progress, custom decks, and edits are stored locally.
   - **Export / Import JSON**: Backup or share flashcard decks across browsers.
   - Reset option to restore default sample decks anytime.

---

## 🚀 How to Run the Project Locally in a Browser

No Node.js, npm, or build tools are required! The platform runs directly in any standard modern web browser.

### Option 1: Direct File Double-Click (Easiest)
1. Open your File Explorer / Finder.
2. Navigate to the project directory:
   `c:\Users\dell\OneDrive\Desktop\project\cute-project\flashcard-learning-platform\`
3. Double-click on `index.html` (or right-click -> **Open With** -> **Google Chrome** / **Microsoft Edge** / **Firefox** / **Safari**).

### Option 2: Using VS Code Live Server Extension (Recommended for Development)
1. Open the folder `flashcard-learning-platform` in Visual Studio Code.
2. If installed, click **"Go Live"** in the bottom status bar or right-click `index.html` and select **"Open with Live Server"**.
3. Your default browser will open `http://127.0.0.1:5500/index.html`.

### Option 3: Using a Simple Local HTTP Server (Python)
If you have Python installed, open terminal in the project directory and run:
```bash
# Python 3.x
python -m http.server 8000
```
Then open your browser and navigate to `http://localhost:8000`.

---

## 📁 File Structure

```
flashcard-learning-platform/
├── index.html     # App markup, modal dialogs, and semantic structure
├── styles.css     # CSS variables, 3D flip card animations, light/dark themes
├── app.js         # State management, study logic, audio speech, localStorage manager
└── README.md      # Documentation and local running instructions
```

---

## 💡 Technologies Used

- **HTML5**: Semantic tags, accessibility (ARIA attributes), form controls.
- **CSS3**: Custom properties (Variables), CSS Grid & Flexbox, CSS Perspective & 3D `rotateY()` animations, Glassmorphism.
- **Vanilla JavaScript (ES6+)**: Event delegation, Web Speech API (`SpeechSynthesis`), `localStorage` API, File Reader API for JSON import/export.
- **Google Fonts & FontAwesome**: Modern typography (`Inter`, `Plus Jakarta Sans`) and icon set.
