# NeuralSnake 3310

A Snake game with AI pathfinding built with React, styled to look like the classic Nokia 3310 phone.

[Live Demo](https://6947a2632551439028578bd1--subtle-twilight-11905d.netlify.app/)


## About

A project combining the nostalgia of the old Nokia 3310 Snake game with modern AI techniques and React.

The AI can play the game automatically using BFS (Breadth-First Search) pathfinding to find the shortest path to food. When it can't find a safe path, it uses a survival mode that calculates available space to avoid trapping itself. As a last resort, it chases its own tail to buy time.

## Features

- Play manually or watch the AI play
- Nokia 3310 retro design with green LCD screen effect
- Real-time visualization of the AI's decision-making
- High score tracking (saved in browser)
- Shows the AI's planned path on the grid

## How to Run

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Build for production
npm run build
```

## Controls

- **Arrow Keys or WASD** - Move the snake
- **Spacebar** - Pause/Resume
- **R** - Restart game
- **Neural Toggle Button** - Switch between manual and AI mode

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Custom pathfinding algorithms

## What I Learned

This project helped me understand:
- How BFS pathfinding works in games
- Managing game state in React
- Creating retro UI designs with CSS
- Optimizing React performance for game loops

## Future Ideas

- Add difficulty levels
- Implement A* pathfinding as an alternative
- Add sound effects
- Mobile touch controls


