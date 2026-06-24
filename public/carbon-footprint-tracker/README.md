# Carbon Footprint Tracker

A beautiful, modern web application to track and calculate your daily carbon footprint!

## Features

### 🎨 Modern Design
- Glassmorphism UI
- Dark/Light mode toggle
- Smooth animations
- Responsive layout for all devices

### 📊 Calculation
- Input daily travel distance (km)
- Input electricity usage (kWh)
- Input waste generated (kg)
- Calculate CO₂ emissions using:
  ```
  Carbon Footprint = (Travel × 0.21) + (Electricity × 0.85) + (Waste × 0.45)
  ```

### 📈 Results Display
- Total CO₂ emissions (kg/day) with animated counter
- Carbon level indicator (Low/Medium/High)
- Environmental impact message
- Visual progress bar

### 💾 Data Management
- Save history to localStorage
- View previous calculations (up to 10 entries)
- Reset button to clear inputs

## Project Structure
```
carbon-footprint-tracker/
├── index.html
├── style.css
├── script.js
└── README.md
```

## How to Use

1. Navigate to the project directory
2. Open `index.html` in your browser, or
3. Run a local server (e.g., `python -m http.server 3000`) and visit `http://localhost:3000`

## Technologies Used
- HTML5 (Semantic)
- CSS3
- Vanilla JavaScript
- LocalStorage
- Font Awesome icons (via Unicode emojis)
- Google Fonts (Inter)

## Accessibility
- Proper labels for all inputs
- Keyboard navigation support
- Semantic HTML tags
- High contrast between text and background

## License
MIT
