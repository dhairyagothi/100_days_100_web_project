# 🚦 Traffic Rush

A fast-paced **Traffic Signal Simulation Game** built with **HTML5 Canvas, CSS, and Vanilla JavaScript**. Players control the flow of traffic through an intersection by managing traffic signals, preventing collisions, and maximizing the number of vehicles that safely pass through.

---

## 🎮 Gameplay

The objective is simple:

- Manage traffic at a busy intersection.
- Vehicles obey the traffic light system.
- Avoid vehicle collisions.
- Earn points for every vehicle that safely passes.
- Survive increasingly difficult levels.
- Reach the highest score before accumulating too many crashes.

The game ends after **5 collisions**.

---

## ✨ Features

### 🚗 Dynamic Traffic System

- Multiple vehicle types:
  - Sedan
  - Truck
  - Bus
  - Sports Car
- Random vehicle colors
- Realistic stopping and acceleration behavior
- Lane-based traffic flow

### 🚦 Smart Traffic Lights

- Red, Yellow, and Green signal states
- Visual countdown timer
- Signal duration adapts as difficulty increases

### 📈 Progressive Difficulty

- Levels increase automatically every 20 seconds
- Faster vehicle speeds
- Higher vehicle spawn rates
- Difficulty badges:
  - Easy
  - Medium
  - Hard
  - Extreme

### 🌙 Day / Night Mode

Switch between:

- Sunny daytime cityscape
- Night mode with:
  - Stars
  - Moon
  - Illuminated building windows

### 🏙️ Animated Environment

- Procedurally generated buildings
- Moving clouds
- Dynamic sky gradients
- Responsive city background

### 💥 Collision Effects

- Collision detection system
- Vehicle crash animations
- Flash warning effect
- Score penalties for crashes

### 📊 HUD Dashboard

Track:

- Score
- Cars Passed
- Collisions
- Current Level
- Signal Countdown

### ⏸ Game Controls

- Pause / Resume
- Day / Night Toggle
- Restart after Game Over

---

## 🕹️ Controls

| Action | Control |
|----------|----------|
| Start Game | Start Button |
| Toggle Day/Night | 🌙 Day/Night |
| Pause Game | ⏸ Pause |
| Resume Game | ▶ Resume |

---

## 🏆 Scoring System

### Cars Passed

```text
Score += 10 + (Level × 2)
```

### Collision Penalty

```text
Score -= 30
```

Score never drops below zero.

---

## 📉 Game Over Conditions

The game ends when:

```text
Collisions >= 5
```

Final statistics displayed:

- Total Score
- Cars Passed
- Collisions
- Highest Level Reached

---

## 🏗️ Project Structure

```text
traffic-rush/
│
├── index.html      # Game UI and layout
├── style.css       # Styling and HUD design
├── script.js       # Game logic and rendering
├── favicon_traffic.png
└── README.md
```

---

## 🛠 Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript (ES6)

### Graphics

- HTML5 Canvas API
- Canvas Animations
- RequestAnimationFrame

### Fonts

- Orbitron
- Rajdhani

Loaded from Google Fonts.

---

## ⚙️ Core Systems

### Vehicle System

Each vehicle contains:

```javascript
{
  x,
  y,
  lane,
  speed,
  type,
  color,
  state,
  collided,
  passed
}
```

### Traffic Signal System

Signal cycle:

```text
RED → GREEN → YELLOW → RED
```

Default timings:

```javascript
{
  red: 5,
  yellow: 1.5,
  green: 4
}
```

Timings become shorter as levels increase.

### Level Progression

```text
Every 20 seconds:
Level += 1
```

Maximum level:

```text
12
```

---

## 📱 Responsive Design

The game automatically adapts to:

- Desktop
- Laptop
- Tablet
- Mobile browsers

Canvas resizes dynamically with window size changes.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/dhairyagothi/100_days_100_web_project.git
```

### 2. Open Project

```bash
cd traffic-rush
```

### 3. Run

Simply open:

```text
index.html
```

in any modern web browser.

No build tools or dependencies required.

---

## 🌟 Future Improvements

Potential enhancements:

- Sound effects and background music
- Multiple intersections
- Emergency vehicles
- Traffic AI improvements
- Power-ups
- Online leaderboard
- Touch controls optimization
- Weather system (Rain, Snow, Fog)

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 👨‍💻 Author

Built using HTML5 Canvas and JavaScript as a traffic management simulation game demonstrating:

- Game loops
- Collision detection
- Canvas rendering
- Procedural environment generation
- State management
- Responsive game design

---

### 🚦 Keep the traffic moving and prevent crashes!