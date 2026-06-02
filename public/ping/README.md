# 🏓 Ping Pong Game

A simple browser-based Ping Pong game built using **HTML5 Canvas**, **JavaScript**, and **CSS**. The player controls the left paddle using the mouse while the computer controls the right paddle with a basic AI algorithm.

## 🎮 Features

- Interactive gameplay using HTML5 Canvas
- Mouse-controlled player paddle
- Computer-controlled AI paddle
- Real-time collision detection
- Dynamic ball physics and bounce angles
- Score tracking system
- Start, Pause, and Restart controls
- Responsive and lightweight design

---

## 📸 Preview

<img src="https://img.freepik.com/premium-vector/table-tennis-vector-logo-ping-pong-ball-with-emblem-shape-perfect-table-tennis_297778-950.jpg" width="120" alt="Ping Pong Logo">

---

## 🚀 How to Run

### Option 1: Open Locally

1. Clone the repository:

```bash
git clone https://github.com/your-username/ping-pong-game.git
```

2. Navigate to the project folder:

```bash
cd ping-pong-game
```

3. Open `index.html` in your browser.

---

### Option 2: Using VS Code Live Server

1. Install the **Live Server** extension.
2. Open the project folder in VS Code.
3. Right-click `index.html`.
4. Click **Open with Live Server**.

---

## 🎯 Controls

| Action | Control |
|----------|----------|
| Move Paddle | Mouse Movement |
| Start Game | Start Button |
| Pause Game | Pause Button |
| Restart Game | Restart Button |

---

## 🧠 Game Mechanics

### Player Paddle

- Located on the left side.
- Follows mouse movement along the Y-axis.

### Computer Paddle

- Located on the right side.
- Uses a simple tracking algorithm to follow the ball.

```javascript
computer.y += (ball.y - (computer.y + computer.height / 2)) * 0.1;
```

### Ball Physics

- Bounces off top and bottom walls.
- Rebounds at different angles depending on where it hits a paddle.
- Speed increases after every paddle hit.

### Scoring

- If the ball exits the left side:
  - Computer scores.

- If the ball exits the right side:
  - Player scores.

- Ball resets to the center after each point.

---

## 📂 Project Structure

```text
ping-pong-game/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

---

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript (ES6)
- HTML5 Canvas API

---

## 📜 Core Functions

### Drawing Functions

```javascript
drawRectangle()
drawCircle()
drawText()
drawNet()
```

Responsible for rendering all game elements.

### Game Loop

```javascript
animate()
```

Runs the update and render cycle using:

```javascript
requestAnimationFrame()
```

### Collision Detection

```javascript
collision(ball, player)
```

Checks whether the ball intersects with a paddle.

### Game State Updates

```javascript
update()
```

Handles:

- Ball movement
- Paddle movement
- Collision responses
- Score updates

---

## 🔮 Future Improvements

- Difficulty levels
- Sound effects
- Mobile touch controls
- Winning score limit
- Multiplayer mode
- Power-ups
- Better AI behavior
- Dark/Light themes

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to your branch

```bash
git push origin feature-name
```

5. Open a Pull Request



## 👨‍💻 Author

Developed as a JavaScript Canvas project to demonstrate:

- Game loops
- Collision detection
- Canvas rendering
- Basic AI movement
- Event-driven programming

---

### 🏆 Have Fun Playing!

A reminder that even in a game where a ball endlessly bounces between two paddles, somebody eventually keeps score.
