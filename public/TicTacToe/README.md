# 🎮 Tic Tac Toe Game - Enhanced

A modern, interactive Tic Tac Toe game with AI opponent, dark mode, sound effects, and smooth animations. Perfect for learning game development!

## ✨ Features

### Core Gameplay
- 👥 **Player vs Player** - Two-player local gameplay
- 🤖 **AI Opponent** - Play against the computer with difficulty levels:
  - **Easy Mode** - AI makes random moves
  - **Hard Mode** - AI uses minimax algorithm for optimal play
- 🏆 **Score Tracking** - Keep track of wins and draws across multiple rounds
- 🔄 **Game Reset** - Start fresh games anytime

### User Experience
- 🌙 **Dark Mode** - Toggle between light and dark themes (persists across sessions)
- 🔊 **Sound Effects** - Audio feedback for moves and wins
- ✨ **Smooth Animations** - Pop animations on cell clicks and smooth transitions
- 📱 **Fully Responsive** - Works seamlessly on desktop and mobile devices
- 🎨 **Modern UI** - Beautiful gradient backgrounds and hover effects

## 🛠️ Technologies Used
- **HTML5** - Semantic structure
- **CSS3** - Gradients, animations, flexbox, grid
- **Vanilla JavaScript (ES6+)** - Game logic, AI algorithm, DOM manipulation

## 🎯 Game Rules
1. Two players take turns marking spaces on a 3×3 grid
2. Players are X and O
3. Win by getting three marks in a row (horizontal, vertical, or diagonal)
4. If all 9 squares are filled with no winner, it's a draw
5. Click "Restart Game" to start a new match
6. Scores are tracked across multiple games

## 📖 How to Run

1. **Open in Browser**
   ```bash
   # Simply open the index.html file in your web browser
   ```

2. **Select Game Mode**
   - Click "Player vs Player" for local 2-player mode
   - Click "vs AI (Easy)" for an easier AI opponent
   - Click "vs AI (Hard)" for a challenging AI using minimax algorithm

3. **Toggle Dark Mode**
   - Click the moon/sun button in the top-right corner
   - Your preference is saved automatically

4. **Play**
   - Click on empty cells to make your move
   - X always goes first
   - AI will automatically respond (in AI modes)

5. **Track Progress**
   - View your score on the scoreboard
   - Click "Reset Scoreboard" to see overall winner and reset scores

## 🤖 AI Algorithm

The **Hard Mode** uses the **Minimax algorithm**:
- Evaluates all possible game states
- Assigns scores to positions
- Maximizes AI's chances of winning
- Minimizes player's chances of winning
- Results in unbeatable AI play

## 🎨 Features Breakdown

### Dark Mode
- Saves preference to browser localStorage
- Smooth transitions between themes
- Automatically applies on page reload

### Sound Effects
- Move sound - plays when any player makes a move
- Win sound - plays when someone wins
- Gracefully handles autoplay restrictions

### Animations
- Cells pop when clicked
- Smooth hover effects
- Scoreboard slides in on load
- Theme toggle smooth transitions

## 🌐 Browser Support
✅ Chrome/Chromium  
✅ Firefox  
✅ Safari  
✅ Edge  
✅ Mobile Browsers  

## 🚀 Future Enhancements
- Multiplayer online support
- Leaderboard system
- Different board sizes (4x4, 5x5)
- Custom themes and color schemes
- Replay system
- Difficulty rating system

## 🤝 Contributing
Found a bug or have an idea? Feel free to:
1. Report issues
2. Suggest improvements
3. Submit pull requests with enhancements

## 📝 Code Quality
- Clean, well-organized code
- Comprehensive game logic
- Efficient AI algorithm
- Responsive design principles
- Accessibility considerations

## 🎓 Learning Outcomes
By studying this code, you'll learn:
- Game state management
- Algorithm implementation (minimax)
- DOM manipulation and events
- CSS animations and themes
- Local storage usage
- Responsive web design

## 📄 License
MIT License

## 👨‍💻 Author
Contributor to 100 Days 100 Web Projects

---

**Enjoy the game and happy coding! 🚀**

