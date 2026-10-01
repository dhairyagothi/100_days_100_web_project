# 🐹 Whack-a-Mole Game

A simple browser-based **Whack-a-Mole** game built using **HTML, CSS, and JavaScript**. Test your reflexes by clicking on moles as they randomly appear from holes before the timer runs out!

## 🎮 Features

* 3×3 game grid
* Random mole appearances
* Score tracking
* 50-second countdown timer
* Sound effect when a mole is hit
* Game Over message
* Custom hammer cursor support
* Responsive and beginner-friendly code structure

## 📂 Project Structure

```
whack-a-mole/
│
├── whack_a_mole.html
├── style.css
├── script.js
├── hammer.png
└── README.md
└── Favicon_Mole.png
```

## 🚀 How to Run

### Option 1: Using Live Server (Recommended)

1. Open the project folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `whack_a_mole.html`.
4. Select **"Open with Live Server"**.

### Option 2: Open Directly

Double-click `whack_a_mole.html` to open it in a browser.

> Note: Some browsers may restrict custom cursor images when opening files directly (`file://`). Running through a local server is recommended.

## 🎯 How to Play

1. Click the **Start Game** button.
2. Moles will randomly appear in different holes.
3. Click a visible mole to score a point.
4. Each successful hit:

   * Increases your score.
   * Plays a whack sound effect.
5. The game ends after **50 seconds**.
6. Your final score remains displayed on the screen.

## ⚙️ Game Logic

### Random Hole Selection

The game avoids showing the mole in the same hole twice in a row.

```javascript
function RandomHole(holes) {
    const index = Math.floor(Math.random() * holes.length);
    const hole = holes[index];

    if (hole === lastHole) {
        return RandomHole(holes);
    }

    lastHole = hole;
    return hole;
}
```

### Mole Pop-Up

Moles appear for a random duration between 200ms and 1000ms.

```javascript
const time = Math.random() * 800 + 200;
```

### Countdown Timer

A 50-second timer updates every second and automatically ends the game.

## 🎨 Custom Cursor

The game uses a hammer cursor:

```css
cursor: url('hammer.png') 32 32, auto;
```

A Base64-encoded fallback cursor is also included to improve compatibility if the image fails to load.

## 🔊 Assets Required

### hammer.png

A hammer image used as the custom cursor.

### whack.mp3

A sound effect that plays whenever a mole is successfully hit.

## 🛠 Technologies Used

* HTML5
* CSS3
* JavaScript (Vanilla JS)

## 🧩 Possible Improvements

* Add difficulty levels
* High-score storage using Local Storage
* Multiple mole types with different point values
* Pause and Resume functionality
* Mobile touch support
* Animated mole graphics
* Background music
* Start and restart screens

## 🐞 Known Issues

* Very large cursor images may not work in some browsers.
* Audio playback may require user interaction before the first sound can play.
* Direct file opening (`file://`) may limit custom cursor behavior.

## 📜 License

This project is free to use for learning and educational purposes.

## 👨‍💻 Author

Created as a JavaScript practice project to demonstrate DOM manipulation, event handling, timers, animations, and game logic.
