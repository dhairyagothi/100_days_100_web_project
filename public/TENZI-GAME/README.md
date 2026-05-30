# 🎲 Tenzies Game

A simple, fast, and fun dice game built with React. Play against the clock, try to match all the dice, and beat your high score!

## ✨ Features

- **Random Dice:** Click "Roll" to change all the dice that are not locked.
- **Lock Dice:** Click on any die to freeze its number while you roll the rest.
- **Timer & Roll Counter:** See how many seconds have passed and how many times you have rolled the dice.
- **High Scores:** The game automatically saves your fastest time and fewest rolls on your browser so you can try to beat your personal best.
- **Victory Confetti:** When all 10 dice match, a confetti explosion shoots up on your screen to celebrate your win!
- **Moving Background:** Smooth, fast-moving shapes float up the screen to make the game look dynamic.
- **Mobile Friendly:** The game layout automatically changes to fit perfectly on phones, tablets, and computers.

## 🛠️ Tech Stack

- **Framework:** React.js
- **Packages:**
  - `react-timer-hook` (for the stopwatch)
  - `nanoid` (for giving dice unique IDs)
  - `canvas-confetti` (for the winning confetti blast)
- **Styling:** Responsive Custom CSS (Grid & Flexbox)

## 📁 Project Structure

- **`App.jsx`**: Controls the core game rules, high scores, and stopwatch.
- **`Die.jsx`**: Handles the individual dice buttons and their colors.
- **`index.css`**: Controls the look of the game, mobile screen resizing, and the fast floating particle background.
- **`index.html`**: The main page shell that holds the game canvas.

## 🚀 How to Run It Locally
```
1. Go into the project folder:
    cd TENZIES-GAME

2. Install the required packages (including canvas-confetti):
   npm install

3. Start the local server:
   npm run dev

4. Click the link shown in your terminal to open and play the game in your browser!
```
