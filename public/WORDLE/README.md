# 🎯 Wordle Clone

A browser-based clone of the popular **Wordle** game built using **HTML, CSS, and JavaScript**. Players have six attempts to guess a hidden five-letter word, with color-coded feedback provided after each guess.

## ✨ Features

* Daily random word selection
* Interactive on-screen keyboard
* Physical keyboard support
* Word validation using predefined word lists
* Color-coded feedback:

  * 🟩 Green: Correct letter in correct position
  * 🟨 Yellow: Correct letter in wrong position
  * ⬜ Grey: Letter not present in the word
* Rules popup
* Statistics popup
* Reset game functionality
* Responsive design

---

## 📁 Project Structure

```text
wordle/
│
├── index.html
├── favicon_wordle.png
│
├── assets/
│   ├── css/
│   │   └── style.css
│   │
│   └── js/
│       ├── script.js
│       └── words.js
│
├── img/
│   ├── information.png
│   ├── statistics.png
│   └── rules.png
│
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/dhairyagothi/100_days_100_web_project.git

```

### 2. Navigate to the Project Folder

```bash
cd wordle
```

### 3. Open the Game

Simply open `index.html` in your browser.

---

## 🎮 How to Play

1. Guess the hidden five-letter word.
2. Enter your guess using either:

   * The on-screen keyboard
   * Your physical keyboard
3. Press **ENTER** to submit.
4. Tile colors indicate how close your guess is:

| Color     | Meaning                        |
| --------- | ------------------------------ |
| 🟩 Green  | Correct letter and position    |
| 🟨 Yellow | Correct letter, wrong position |
| ⬜ Grey    | Letter not in the word         |

5. You have **6 attempts** to find the correct word.

---

## 🛠 Technologies Used

* HTML5
* CSS3
* JavaScript (ES6)

---

## 📌 Future Improvements

* Local storage statistics tracking
* Dark mode support
* Animations and tile flip effects
* Share results feature
* Mobile optimizations
* Multiple difficulty levels

---

## 📄 License

This project is created for educational and learning purposes. Feel free to modify and enhance it for personal use.

---

## 👨‍💻 Author

Developed as a Wordle-inspired web application using vanilla JavaScript.
