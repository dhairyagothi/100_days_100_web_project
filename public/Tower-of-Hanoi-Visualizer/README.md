# Tower of Hanoi Visualizer

An interactive and responsive **Tower of Hanoi** puzzle game built with **HTML, CSS, and JavaScript**. The application allows users to manually solve the puzzle, step through the optimal solution, or watch the automatic solver demonstrate the recursive algorithm in action.

## Features

* Interactive Tower of Hanoi gameplay
* Select between **3 and 8 disks**
* Manual disk movement with rule validation
* Move counter and minimum move tracker
* Step-by-step solution visualization
* Automatic recursive solver
* Responsive design for desktop and mobile devices
* Visual feedback for invalid moves
* Win detection and completion statistics

## Demo

The objective is to move all disks from **Tower A** to **Tower C** while following these rules:

1. Move only one disk at a time.
2. Only the top disk of a tower can be moved.
3. A larger disk cannot be placed on top of a smaller disk.

---

## Project Structure

```text
tower-of-hanoi/
│
├── index.html      # Application structure
├── style.css       # Styling and responsive layout
├── script.js       # Game logic and recursive solver
├── favicon_tower_hanoi_visualizer.png
└── README.md       # Project documentation
```

---

## Technologies Used

* HTML5
* CSS3
* Vanilla JavaScript (ES6)

---

## How It Works

### Recursive Algorithm

The automatic solver uses the classic recursive Tower of Hanoi algorithm:

```javascript
function solve(n, from, to, helper) {
  if (n === 0) return;

  solve(n - 1, from, helper, to);
  moveDisk(from, to);
  solve(n - 1, helper, to, from);
}
```

### Minimum Number of Moves

The optimal solution requires:

```text
2^n - 1
```

moves, where `n` is the number of disks.

Examples:

| Disks | Minimum Moves |
| ----- | ------------- |
| 3     | 7             |
| 4     | 15            |
| 5     | 31            |
| 6     | 63            |
| 7     | 127           |
| 8     | 255           |

---

## Controls

### Start

Creates a new puzzle using the selected number of disks.

### Reset

Restarts the current puzzle and clears all progress.

### Step

Performs the next move in the optimal solution sequence.

### Auto

Automatically solves the puzzle using the recursive algorithm.

---

## Running the Project

### Option 1: Open Directly

Simply open `index.html` in your web browser.

### Option 2: Use a Local Server

Using VS Code:

1. Install the **Live Server** extension.
2. Open the project folder.
3. Right-click `index.html`.
4. Select **Open with Live Server**.

---

## Game Logic Overview

### State Management

The towers are stored as arrays:

```javascript
towers = [
  [5, 4, 3, 2, 1],
  [],
  []
];
```

Each number represents a disk size.

### Move Validation

Before a disk is moved, the game checks:

```javascript
movingDisk < targetDisk
```

or allows the move if the destination tower is empty.

### Win Condition

The puzzle is solved when all disks are moved to Tower C:

```javascript
towers[2].length === diskCount
```

---

## Responsive Design

The interface adapts to:

* Desktop screens
* Tablets
* Mobile devices

Features include:

* Flexible grid layouts
* Scalable disks and towers
* Touch-friendly controls
* Mobile-optimized board arrangement

---

## Educational Value

This project demonstrates:

* Recursion
* Algorithm visualization
* State management
* DOM manipulation
* Event handling
* Responsive UI design
* Interactive problem solving

---

## Future Enhancements

Potential improvements:

* Move history and undo functionality
* Adjustable auto-solve speed
* Dark/light themes
* Sound effects and animations
* Timer tracking
* High score storage using Local Storage
* Drag-and-drop disk movement

---

## License

This project is open-source and available for educational and personal use. MIT License

---

## Author

Developed as an interactive visualization of the classic **Tower of Hanoi** recursive puzzle using modern web technologies.
