# Neon Tic Tac Toe

A modern, neon-themed Tic Tac Toe game with statistics tracking!

## Features

### Gameplay
- Classic 3x3 Tic Tac Toe
- Player vs Player (PvP) mode
- Player vs CPU (3 difficulty levels: Easy, Medium, Hard)
- Hint system
- Undo last move
- Game history (last 10 moves)

### Statistics Dashboard
- **Total Games Played**: Total number of games completed
- **Player X Wins**: Number of games won by Player X
- **Player O Wins**: Number of games won by Player O
- **Draws**: Number of games that ended in a draw
- **X Win Rate (%)**: Player X's win percentage
- **O Win Rate (%)**: Player O's win percentage
- **Current Win Streak**: Consecutive wins for the current player
- **Best Win Streak**: Longest winning streak ever

### Visual & UX
- 3 themes (Neon, Pastel, Mono)
- Glassmorphism design
- Smooth animations
- Confetti on win
- Victory sound effects
- Responsive design (mobile-friendly)

## LocalStorage Persistence
All data is saved in your browser's localStorage:
- `neon-tic-tac-toe-stats`: Statistics data
- `neon-tic-tac-toe-scores`: Current game scores

## How to Play
1. Open `index.html` in your browser
2. Select your preferred mode (PvP or CPU)
3. Choose your theme (optional)
4. Start playing!
5. Check your statistics in the "📊 Statistics Dashboard" section

## Reset Options
- **Reset Scores**: Resets current session scores (X, O, Draws)
- **Reset Statistics**: Resets all statistics (requires confirmation)

## Technologies Used
- HTML5
- CSS3
- Vanilla JavaScript
- LocalStorage API
