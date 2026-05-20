# ⚡ Reaction Time Tester - F1 Challenge

A sleek, interactive web-based reaction time game inspired by real F1-style driver tests. Test your reflexes against the clock, beat your personal best, and see if you can match professional driver speeds!

---

## 🎯 Overview

This application simulates the high-pressure environment of an F1 pit crew reaction test. A traffic light countdown (Red → Orange → Green) indicates when you need to react. The faster you click after the green light, the better your score. Your top 5 best times are automatically saved and displayed on a live leaderboard.

---

## ✨ Features

### Core Gameplay
- 🚦 **Authentic Traffic Light System** - Red (3s), Orange (2s), Green (GO!) countdown sequence
- ⚡ **Precise Millisecond Tracking** - Measures reaction time from the exact moment the green light activates
- 🎯 **Instant Feedback** - Shows your reaction time immediately after clicking
- ⏱️ **Auto-Timeout** - Automatically registers a "Missed!" if you don't react within 5 seconds

### User Experience
- 🌙 **Dark/Light Mode Toggle** - Switch between futuristic dark theme and clean light theme
- 📱 **Fully Responsive Design** - Optimized for desktop, tablet, and mobile devices
- 🎨 **Smooth Animations** - Pulsing green button, glowing lights, and smooth transitions
- 🧩 **Intuitive Controls** - Single button interface: "Click to Start" → "Click!" → "Ready?"

### Leaderboard & Tracking
- 🏆 **Top 5 Leaderboard** - Automatically tracks and displays your best 5 reaction times
- 💾 **Persistent Storage** - Uses browser localStorage to save scores across sessions
- ✨ **New Score Highlight** - Latest score animates with a special gradient effect
- 🔄 **Auto-Sorting** - Scores automatically sort from fastest to slowest (best to worst)

### Visual Feedback
- 💡 **Glowing Traffic Lights** - Red, orange, and green lights with realistic glow effects
- 🎬 **Dynamic Button States** - Button transforms when green light activates
- 📊 **Real-time Display** - Countdown text and reaction time shown in large, readable format
- 🎪 **Engaging Animations** - Pop-in effects for new scores and slide-in effects for leaderboard updates

---

## 🎮 How to Play

1. **Click "Click to Start"** - Initiate the game
2. **Watch the Traffic Light** - Red (3) → Orange (2) → Green (GO!)
3. **React Instantly** - Click the button the moment the green light appears
4. **See Your Score** - Your reaction time displays in milliseconds
5. **Beat Your Best** - Repeat to improve and climb the leaderboard

**Pro Tip:** The fastest human reaction time is around 150-200ms. Professional F1 drivers average 150-200ms. Can you beat them? 🏎️

---

## 🛠️ Technologies Used

- **HTML5** - Semantic structure and form elements
- **CSS3** - Grid layout, flexbox, animations, gradients, and CSS variables for theming
- **Vanilla JavaScript (ES6+)** - No dependencies, lightweight and fast
  - Event listeners for button interactions
  - `Date.now()` for precise timing measurements
  - `localStorage` API for persistent data storage
  - Dynamic DOM manipulation

---

## 📂 Project Structure

```
ReactionTimeTester/
├── index.html          # Single-file application (HTML + CSS + JS)
├── README.md           # Project documentation
└── assets/
    └── screenshot.png  # Demo screenshot
```

**Note:** This is a single-file application with embedded CSS and JavaScript for easy deployment and sharing.

---

## 🚀 Quick Start

### Option 1: Direct Browser
1. Download `index.html`
2. Double-click the file to open in your browser
3. Start testing your reaction time!

### Option 2: Web Server
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (with http-server)
npx http-server

# Then visit: http://localhost:8000
```

### Option 3: Online Deployment
- Upload the HTML file to any web hosting service (GitHub Pages, Netlify, Vercel, etc.)
- Share the link with friends to compete!

---

## 📋 Detailed Feature Breakdown

### 🎮 Game Mechanics

**Start Phase**
- Button shows "Click to Start"
- Clicking initiates the countdown sequence

**Countdown Phase**
- Traffic light cycles through: Red (3s) → Orange (2s) → blank (1s) → Green
- Countdown numbers display for player awareness
- Cannot click during countdown (button disabled)

**Active Phase**
- Green light activates with "GO!" text
- Button transforms to bright green with pulsing animation
- Button text changes to "Click!"
- Timer starts recording from this exact moment
- 5-second window to respond before auto-fail

**Result Phase**
- Reaction time displays (e.g., "⚡ 245 ms!")
- Score automatically added to leaderboard if in top 5
- Button resets after 1.5 seconds for next attempt

### 🌙 Theme System

**CSS Variables for Easy Theming**
```css
--bg-primary: Background color
--bg-secondary: Secondary background
--text-color: Text color
--card-bg: Card backgrounds
--border-color: Borders and accents
```

**Dark Mode (Default)**
- Black background with dark gray accents
- High contrast white text
- Glowing effects on traffic lights

**Light Mode**
- Light gray background
- Dark text for readability
- Subtle glow effects

Theme preference saved in `localStorage` and persists across sessions.

### 📊 Leaderboard System

**Scoring Rules**
- Lower time = Better score (faster reaction)
- Top 5 best times automatically saved
- Duplicates allowed (you can record the same time multiple times)
- Scores persist across browser sessions

**Storage Details**
- Uses browser `localStorage` under key: `reactionScores`
- Stores array of millisecond values
- Data cleared only when browser cache is cleared

**Display Features**
- Ranked #1 to #5 with gold rank numbers
- Millisecond precision display
- New score highlights with gradient animation
- Empty state message when no scores yet

### 🎨 Animations & Effects

| Element | Animation | Trigger |
|---------|-----------|---------|
| Green Button | Pulsing glow | Green light activates |
| Traffic Light | Color transition | Countdown sequence |
| New Score | Pop-in + scale | Score added to top 5 |
| Leaderboard Items | Slide-in | Page load or new score |
| Theme Toggle | Scale transform | Hover effect |

---

## 💾 Data Storage

### localStorage Structure
```javascript
// Key: "reactionScores"
// Value: JSON array of numbers (milliseconds)
// Example: [245, 267, 289, 312, 334]

localStorage.getItem("reactionScores");
// Returns: "[245, 267, 289, 312, 334]"
```

### Clearing Data
To reset leaderboard:
1. Open Browser DevTools (F12 or Right-click → Inspect)
2. Go to Application → Local Storage
3. Find `reactionScores` and delete it
4. Refresh the page

Or programmatically:
```javascript
localStorage.removeItem("reactionScores");
location.reload();
```

---

## 📱 Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| Desktop (>768px) | Side-by-side layout with leaderboard on right |
| Tablet/Mobile (<768px) | Stacked layout with leaderboard below game |
| Very Small (<480px) | Compact traffic light and reduced button padding |

All elements resize smoothly with CSS media queries.

---

## ⚙️ Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome/Edge | ✅ Full | Recommended for best performance |
| Firefox | ✅ Full | Excellent support |
| Safari | ✅ Full | iOS Safari supported |
| Opera | ✅ Full | No issues reported |
| IE 11 | ❌ No | Uses ES6 syntax and CSS Grid |

**Minimum Requirements:**
- JavaScript enabled
- CSS3 support (flexbox, grid)
- localStorage support (optional for leaderboard)

---

## 🎓 Learning Resources

This project demonstrates:
- **Event Handling** - Click events and game state management
- **Precise Timing** - Using `Date.now()` for millisecond accuracy
- **Data Persistence** - localStorage for saving scores
- **DOM Manipulation** - Creating and updating leaderboard dynamically
- **CSS Animations** - Keyframe animations and transitions
- **Responsive Design** - Media queries and flexible layouts
- **Theme Switching** - CSS variables and class toggling

---

## 🔧 Customization Guide

### Change Traffic Light Colors
```css
.light.red { background: #ff4444; }
.light.orange { background: #ffaa00; }
.light.green { background: #00ff00; }
```

### Adjust Countdown Timing
```javascript
const countdownInterval = setInterval(() => { ... }, 1000); // 1000ms = 1 second
```

### Modify Timeout Duration
```javascript
setTimeout(() => { /* Missed! */ }, 5000); // 5 seconds to respond
```

### Change Leaderboard Size
```javascript
scores = scores.slice(0, 5); // Change 5 to desired number
```

### Custom Theme Colors
```css
:root {
  --bg-primary: #your-color;
  --text-color: #your-color;
  /* etc */
}
```

---

## 🐛 Troubleshooting

### Scores not saving?
- Check if localStorage is enabled in browser settings
- Clear browser cache and try again
- Try a different browser

### Traffic light not showing?
- Ensure JavaScript is enabled
- Check browser console for errors (F12)
- Try refreshing the page

### Button not responding?
- Make sure you're clicking during the green light phase
- Check if browser has JavaScript enabled
- Clear cache and reload

### Leaderboard showing "No scores yet"?
- This is normal on first load
- Play the game to record scores
- Scores save automatically

---

## 🎯 Challenge Ideas

1. **Personal Best** - Try to get under 200ms (F1 driver level)
2. **Consistency** - Get all 5 top scores within 50ms range
3. **Speed Run** - Record 5 scores as fast as possible
4. **Competitive** - Share the link and compete with friends
5. **Mobile vs Desktop** - Compare reaction times on different devices

---

## 📄 License

This project is open-source and free to use, modify, and distribute.

---

## 🤝 Contributing

Found a bug or have a feature idea? You can:
- Modify the HTML file directly
- Share improvements with others
- Customize the design to match your style

---

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section above
2. Verify browser compatibility
3. Clear cache and try again
4. Check browser console for error messages (F12)

---

## 🎉 Have Fun!

Test your reflexes, beat your personal best, and see if you have what it takes to match professional F1 driver reaction times. Good luck! 🏎️⚡

**Average Human Reaction Time:** 200-300ms  
**F1 Driver Average:** 150-200ms  
**World Record:** 101ms

Can you beat the clock? 🏆