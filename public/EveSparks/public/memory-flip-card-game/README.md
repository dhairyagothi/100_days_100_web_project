# 🃏 Memory Flip Card Game

A classic Memory Matching Game where players flip cards to find matching pairs. This project demonstrates key JavaScript concepts like event handling, DOM manipulation, timers, and data persistence using `localStorage`.

## 🚀 Features
- 🃏 Flip cards with smooth animations
- 🔍 Match pairs logic with instant feedback
- ⏱️ Countdown timer (speed challenge)
- 📊 Move counter & matched pairs tracker
- 🔁 Restart & hard reset functionality
- 💾 Save best score using `localStorage`
- 🎯 “New Best Score” indicator
- 🎮 Responsive design for mobile & desktop

## 🧠 Concepts Covered
1. **Flip Cards with Click Events**
   - Handle card clicks using `addEventListener`
   - Track first and second card selection
   - Prevent invalid or rapid clicks using a busy flag

2. **DOM Updates (Match / Mismatch)**
   - Use `classList` to visually mark matches
   - Animate mismatches and flip cards back
   - Update UI counters dynamically

3. **Timers (Auto Flip + Game Timer)**
   - `setTimeout` for flipping back unmatched cards
   - `setInterval` for countdown timer
   - Track and clear timeouts during reset

4. **Restart / Reset Functionality**
   - Reset board, timer, and game state
   - Restart with animated countdown
   - Hard reset clears saved data

5. **localStorage for Scores**
   - Save best score across sessions
   - Maintain leaderboard-style data

## 🛠️ Tech Stack
- HTML5 – Structure
- CSS3 – Styling & animations
- JavaScript (ES6) – Game logic

## 🎮 How to Play
1. Click **Start Game** to begin.
2. Flip two cards at a time.
3. If cards match: ✅ They stay flipped (with a small pop animation).
4. If cards don’t match: ❌ They flip back after a short delay.
5. Match all pairs before time runs out (60 seconds).
6. Try to finish in minimum moves for the best score!

## ⚙️ Installation & Setup
1. Clone the repository or download the files.
2. Open `index.html` in your browser.

## 📊 Game Flow
```
Start Game
   ↓
Shuffle Cards
   ↓
User Flips Two Cards
   ↓
Match?
├── Yes → Keep Flipped
└── No → Flip Back (after delay)
   ↓
All Pairs Matched?
├── Yes → Win Game 🎉
└── No → Continue
   ↓
Time Over?
├── Yes → Game Over ❌
```

## 🔥 Future Enhancements
- 🎵 Sound effects for flips and matches
- 🏆 Global leaderboard system
- 🎨 Themes (dark mode, custom card designs)
- 🤝 Multiplayer mode
- 📱 Mobile app version

## 📜 License
This project is licensed under the MIT License.
