# Snake Game

A modern, interactive Snake game with achievements, statistics, and responsive design!

## Features

### Gameplay
- Classic Snake mechanics
- Level system that increases difficulty over time
- Responsive controls (keyboard, touch, swipe)
- Dark/Light theme toggle
- Pause functionality
- High score tracking

### Statistics Dashboard
The Statistics panel tracks:
- **Games Played**: Total number of games started
- **Highest Score**: The highest score ever achieved
- **Average Score**: Average of all game scores
- **Total Food Eaten**: Cumulative number of food items consumed
- **Longest Survival**: Maximum time survived in a single game

All statistics are persisted using `localStorage`.

### Achievement System
Unlock achievements by reaching milestones:
1. **Beginner Snake** 🐍 - Score 20 points
2. **Growing Hunter** 👑 - Score 50 points
3. **Snake Master** 🏆 - Score 100 points
4. **Snake Legend** 🔥 - Score 200 points

Achievements trigger notifications and are saved to `localStorage`.

## How to Play

1. Visit http://localhost:3000/public/snake_game/
2. Press **Start Game** or use arrow keys/WASD to begin
3. Control the snake to eat food
4. Avoid walls and your own tail
5. Press P to pause

## Controls

- **Keyboard**: Arrow Keys / WASD
- **Mobile**: On-screen D-pad or swipe on canvas
- **Pause**: P key

## Technical Details

- Built with vanilla JavaScript, HTML5 Canvas, and CSS
- No external frameworks required
- Uses requestAnimationFrame for smooth gameplay
- All data is stored in browser's localStorage
