# EcoLint - Green Code Checker

An eco-conscious code analysis tool that detects energy-inefficient patterns and estimates the digital carbon footprint of your web code.

## Description

EcoLint is a sustainability-focused code checker that helps developers write more energy-efficient web applications. By analyzing your code for common performance anti-patterns that waste CPU, GPU, and battery energy, EcoLint provides an "Eco Score" and estimates the carbon emissions associated with your code's execution. Perfect for developers who want to build faster, more efficient websites that reduce environmental impact.

## Features

- **Code Analysis Engine**: Scans HTML, CSS, and JavaScript for energy-inefficient patterns
- **Detection Rules**:
  - **Unthrottled Scroll Events**: Identifies scroll/resize listeners without throttling/debouncing (wastes CPU/battery)
  - **Heavy Box Shadows**: Detects box-shadows with blur radius > 20px (forces GPU overwork)
  - **Forced Layout Repaints**: Finds offsetHeight/offsetWidth/getComputedStyle usage (causes layout thrashing)
- **Eco Score (0-100)**: Sustainability rating based on detected issues
  - 100: Eco-friendly, energy-efficient code
  - 80-99: Minor issues detected
  - 50-79: Moderate efficiency concerns
  - 0-49: Serious energy waste patterns
- **Payload Size**: Displays code size in KB for quick reference
- **Carbon Footprint Estimation**: Approximates monthly CO₂ emissions for 10,000 visits
  - Based on 0.2g CO₂ per GB data transfer model
  - Helps visualize environmental impact
- **Severity-Based Issue Cards**: 
  - **High Severity** (Red): Critical energy waste patterns
  - **Medium Severity** (Yellow): Moderate optimization opportunities
  - **Low Severity** (Green): Minor improvements
- **Animated Gauge Display**: Visual progress indicator that changes color based on score
  - Green (> 80): Efficient code
  - Yellow (50-79): Warning zone
  - Red (< 50): Danger zone
- **Issue Counter**: Shows count of each issue type found
- **Dark/Light Theme**: Toggle between themes with localStorage persistence
- **Responsive Design**: Adapts to mobile and tablet screens
- **Real-Time Feedback**: Animated issue cards with staggered appearance
- **Zero Dependencies**: Pure vanilla JavaScript and CSS

## Tech Stack

- **HTML5** — semantic structure, form elements
- **CSS3** — custom properties (variables), dark/light theme, conic-gradient for gauge, responsive grid layout
- **Vanilla JavaScript (ES6+)** — regex-based pattern matching, DOM manipulation, animation with `requestAnimationFrame`, localStorage API, localStorage for persistence

## Folder Structure

```text
EcoLint/
│
├── index.html      # Dashboard layout — code input, metrics display
├── app.js           # Analysis engine, scoring logic, theme management
├── style.css        # Dark/light theme, component styling, animations
└── README.md        # Project documentation
```

## Setup / Run Instructions

No build step or dependencies required. Pure web technologies.

### Option 1: Open Directly
1. Navigate to the `EcoLint` folder.
2. Double-click `index.html` to open in your browser.

### Option 2: Use a Local Server (recommended)
Using VS Code:
1. Install the **Live Server** extension.
2. Open the project folder in VS Code.
3. Right-click `index.html` → **Open with Live Server**.

## Usage

### Analyzing Code

1. **Paste Code**: Copy and paste your HTML, CSS, or JavaScript code into the left textarea
2. **Click Analyze**: Click the "Analyze Code Density" button
3. **View Results**: 
   - Eco Score updates with animation
   - Payload size shows in KB
   - Carbon footprint displays in mg CO₂
   - Issues appear below with details

### Understanding the Eco Score

**Perfect Score (100)**:
- No energy-inefficient patterns detected
- Code is optimized for performance and sustainability

**High Score (80-99)**:
- Minor issues found; code is mostly efficient
- Small improvements recommended

**Medium Score (50-79)**:
- Multiple efficiency concerns detected
- Consider optimizing identified areas

**Low Score (0-49)**:
- Significant energy waste patterns
- Urgent optimization needed

### Interpreting Issue Cards

**Issue Card Structure**:
- **Title**: Name of the detected pattern
- **Count**: How many instances found
- **Severity**: Color-coded level (red/yellow/green)
- **Description**: Why it wastes energy and what it affects

**Example Issues**:

**Unthrottled Scroll Event** (High Severity):
```javascript
// ❌ Bad: Fires on every scroll pixel
window.addEventListener('scroll', () => {
    // Heavy computation
});

// ✅ Good: Throttled to reduce firing
window.addEventListener('scroll', throttle(() => {
    // Heavy computation
}, 1000));
```

**Heavy Box Shadow** (Medium Severity):
```css
/* ❌ Bad: 50px blur forces GPU recalculation every frame */
.box { box-shadow: 0 0 50px rgba(0, 0, 0, 0.5); }

/* ✅ Good: Smaller blur or hardware-accelerated property */
.box { box-shadow: 0 0 15px rgba(0, 0, 0, 0.5); }
```

**Forced Layout Repaint** (Low Severity):
```javascript
// ❌ Bad: Reading offsetHeight forces layout recalculation
const height = element.offsetHeight;

// ✅ Good: Cache value or use CSS-based approach
const height = element.getBoundingClientRect().height;
```

### Theme Toggle

**Switch Between Dark and Light Modes**:
1. Click the moon/sun icon (🌙/☀️) in the top-left
2. Theme preference saves automatically
3. Gauge color updates to match theme

### Carbon Footprint Calculation

**Formula**:
```
Monthly CO₂ (mg) = (Code Size in KB / 1,048,576 MB) × 0.2g × 1000mg × 10,000 visits
```

**What This Means**:
- Assumes 0.2g CO₂ per GB of data transferred
- Scaled to 10,000 monthly visits for visibility
- Shows environmental cost of your code

**Example**:
- 50 KB code × 10,000 visits = 500 MB data
- Estimated: ~0.1 mg CO₂/month

## How It Works

### Detection Engine

```javascript
const EcoRules = [
    {
        regex: /\.addEventListener\s*\(\s*['"](scroll|resize)['"]\s*,\s*(?![^)]*throttle)/g,
        severity: 'high',
        deduction: 20  // Reduces score by 20 per match
    },
    // More rules...
];
```

Rules use regex patterns to search for problematic code. Each match deducts points from the Eco Score.

### Scoring Algorithm

```javascript
let score = 100;
for (const rule of EcoRules) {
    const matches = code.match(rule.regex);
    score -= rule.deduction * matches.length;
}
finalScore = Math.max(0, score);
```

Each pattern found reduces score by its deduction value multiplied by occurrence count.

### Animated Value Updates

```javascript
function animateValue(start, end, duration, element) {
    // Uses requestAnimationFrame for smooth 60fps animation
    // Interpolates from start to end value over duration (milliseconds)
}
```

Score, payload, and carbon values animate from previous to new values for visual feedback.

### Gauge Visualization

```javascript
function updateGaugeVisuals(score) {
    let color = '#00e676';  // Green
    if (score < 80) color = '#ffd600';   // Yellow
    if (score < 50) color = '#ff1744';   // Red
    
    gaugeCircle.style.background = `conic-gradient(${color} ${score}%, #border 0)`;
}
```

The circular gauge fills from 0 to 100%, changing color based on score.

### Theme Persistence

```javascript
// Load theme on page load
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-theme');
}

// Save theme on toggle
localStorage.setItem('theme', isLight ? 'light' : 'dark');
```

Theme preference stored in localStorage survives browser restarts.

## Implementation Notes

- **Regex Patterns**: Detection uses JavaScript `String.match()` with regex patterns compiled for each rule
- **Score Deduction**: Each rule multiplies its deduction by the number of matches found
- **Animation Timing**: 1000ms duration with `requestAnimationFrame` for smooth 60fps updates
- **Severity Levels**: Impact score differently (high = -20, medium = -10, low = -5)
- **Threshold-Based**: Rules use numeric thresholds (e.g., box-shadow blur > 20px)
- **CSS Variables**: All colors switch via single theme class toggle
- **Responsive Grid**: Two-column layout collapses to single column on tablets

## Educational Value

This project demonstrates:

- Regular expressions for pattern matching in code
- Dynamic scoring algorithms
- Animated number transitions with `requestAnimationFrame`
- CSS conic-gradient for circular progress indicators
- Dark/light theme implementation with CSS variables
- localStorage API for persistence
- DOM manipulation for real-time updates
- Responsive design with CSS Grid and media queries
- Code analysis and linting concepts
- Environmental sustainability in web development

## Common Scenarios

**Optimization During Development**:
1. Write component code
2. Paste into EcoLint
3. Check Eco Score
4. Fix flagged issues
5. Reanalyze to verify improvements

**Auditing Existing Code**:
1. Export production JavaScript
2. Analyze with EcoLint
3. Identify most common issues
4. Prioritize fixes by severity

**Educational Use**:
1. Teach developers about energy-efficient code
2. Show visual feedback on performance impact
3. Demonstrate environmental consequences of choices

## Limitations & Notes

- **Pattern Detection**: Only detects specific known patterns; not exhaustive analysis
- **Regex-Based**: Can have false positives or false negatives depending on code style
- **Approximation**: Carbon calculation is an estimate based on average values
- **No Execution**: Doesn't actually run code; purely static analysis
- **Manual Review**: Results should be verified with profiling tools

## Future Enhancements

Potential improvements:

- **More Detection Rules**: Animation frame throttling, network waterfalls, bundle bloat
- **Context-Aware Analysis**: Understand if throttling/debouncing is already applied
- **Code Suggestions**: Provide fixes for detected issues inline
- **Performance Metrics**: Link to real performance impact (ms, CPU, memory)
- **Historical Tracking**: Track improvements over time
- **Batch Analysis**: Analyze multiple files at once
- **Integration**: VS Code extension, GitHub actions, CI/CD pipeline
- **Custom Rules**: Allow users to define custom detection rules
- **Data Visualization**: Charts showing energy consumption per rule type
- **Export Reports**: Generate PDF or HTML sustainability reports
- **Web Vitals Integration**: Correlate with CWV metrics
- **Framework-Specific Rules**: React, Vue, Angular optimization patterns
- **ESLint Plugin**: Integrate as ESLint plugin for automatic linting

## Real-World Impact

**Why Energy Efficiency Matters**:
- Websites serve billions of visitors annually
- Inefficient code multiplies environmental impact at scale
- 10,000 monthly visitors × 50KB × 12 months = 6GB data annually
- Small optimizations compound across millions of sites

**Examples of High-Impact Issues**:
- Unthrottled scroll handlers: Can fire 10+ times per second, wasting CPU
- Heavy shadows: GPU recalculates per frame (60fps = thousands of recalculations)
- Layout thrashing: Single property read can trigger full page recalculation

## Browser Compatibility

Works on all modern browsers supporting:
- ES6 JavaScript
- CSS custom properties
- CSS conic-gradient
- localStorage API
- requestAnimationFrame

**Tested on**: Chrome, Firefox, Safari, Edge

## Accessibility

- Theme toggle clearly labeled and visually distinct
- High contrast colors in both themes
- Semantic HTML for screen readers
- Descriptive issue cards with clear language
- Color-coding supplemented with text labels

## License

This project is open-source and available for educational and personal use.

## Author

Contributed as part of the [100 Days 100 Web Projects](../../README.md) challenge.
