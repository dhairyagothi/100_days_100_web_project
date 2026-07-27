# ⌨️ TypeMaster Keyboard Analytics

TypeMaster Keyboard Analytics is an advanced typing speed and accuracy trainer built with vanilla HTML, CSS, and JavaScript. It provides real-time performance tracking, live keyboard heatmaps, error analysis, and detailed session statistics to help users improve their typing skills.

---

## 🚀 Features

### ⚡ Real-Time Typing Analytics
- Live WPM (Words Per Minute) tracking
- Peak WPM recording
- Accuracy percentage calculation
- Error rate monitoring
- Session timer

### 🎯 Multiple Practice Modes
Choose from:

- **Words Mode**
  - Easy
  - Medium
  - Hard

- **Sentences Mode**
  - Easy
  - Medium
  - Hard

- **Code Mode**
  - Easy
  - Medium
  - Hard

- **Custom Mode**
  - Practice with your own text

---

### 🔥 Live Keyboard Heatmap
The on-screen keyboard highlights keys where mistakes occur.

Heat levels:
- 🟡 Low Error Frequency
- 🟠 Medium Error Frequency
- 🔴 High Error Frequency

This helps identify weak typing areas.

---

### 📊 Error Tracking
TypeMaster records:

- Total errors
- Error percentage
- Frequently mistyped keys
- Live error log updates

---

### 📈 Progress Tracking
- Character completion progress
- Word completion progress
- Visual progress bar

---

### 🏆 Session Results Dashboard
After completing a typing session, TypeMaster displays:

- Final WPM
- Peak WPM
- Accuracy
- Total Errors
- Time Taken
- Most Mistyped Keys
- Personalized performance feedback

---

## 🖥️ Keyboard Layout

The application includes a full virtual keyboard featuring:

- Function keys (F1–F12)
- Number row
- QWERTY layout
- Modifier keys
- Spacebar row

Pressed keys receive visual feedback during typing.

---

## 📂 Project Structure
```project/
│
├── index.html
├── style.css
├── script.js
├── favicon_typemaster.png
├── preview.png
└── README.md
```

---

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript (ES6)

No external frameworks or libraries are required.

---

## 🎮 Controls

| Action | Key/Button |
|----------|------------|
| Reset Current Session | Esc |
| Reset Session | Reset Button |
| Generate New Prompt | New Text Button |
| Backspace Previous Character | Backspace |
| Select Mode | Mode Buttons |
| Select Difficulty | Difficulty Buttons |

---

## 📐 WPM Calculation

TypeMaster uses the standard typing formula:

```text
WPM = (Correct Characters ÷ 5) ÷ Minutes Elapsed
```

Where:

- 5 characters = 1 word
- Only correctly typed characters contribute to WPM

---

## 🎯 Accuracy Calculation

```text
Accuracy = ((Total Typed - Errors) ÷ Total Typed) × 100
```

---

## 🔥 Heatmap Logic

Error counts per key determine heat intensity:

| Error Count | Heat Level |
|-------------|-----------|
| 1–2 | Low |
| 3–4 | Medium |
| 5+ | High |

---

## ✨ Practice Content

### Words Mode
Contains:
- Common English phrases
- Pangrams
- Vocabulary-building prompts

### Sentences Mode
Contains:
- Tongue twisters
- Typing drills
- Sentence challenges

### Code Mode
Contains:
- JavaScript snippets
- ES6 syntax
- Functions
- Classes
- Algorithms

---

## 📱 Responsive Design

TypeMaster is designed to work on:

- Desktop
- Laptop
- Tablet
- Modern browsers

Recommended browsers:

- Chrome
- Edge
- Firefox
- Brave

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/dhairyagothi/100_days_100_web_project.git
```

### 2. Open the Project

```bash
cd typemaster-keyboard-analytics
```

### 3. Launch

Open:

```text
index.html
```

in your browser.

No build process required.

---

## 📊 Example Workflow

1. Select a mode.
2. Select difficulty.
3. Begin typing.
4. Watch live:
   - WPM
   - Accuracy
   - Error Heatmap
5. Finish the prompt.
6. Review session analytics.
7. Restart or generate a new prompt.

---

## 🔮 Future Improvements

Potential enhancements:

- User profiles
- Typing history
- Dark/Light themes
- Leaderboards
- CSV result export
- Typing streak tracking
- Advanced analytics dashboard
- Multiple keyboard layouts
- Multiplayer typing races

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 👨‍💻 Author

Built to help users improve typing speed, accuracy, and keyboard familiarity through interactive analytics and visual feedback.
```

This README presents the project professionally and is suitable for a GitHub repository.