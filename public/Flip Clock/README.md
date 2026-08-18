# Flip Clock

A beautiful, real-time digital clock with a flipping card design and customizable pastel color themes for displaying time with style.

## Description

Flip Clock is an elegant time display application featuring a modern flip-card aesthetic with smooth animations and transitions. Display the current time in hours, minutes, and seconds with an accompanying date and day-of-week indicator. Choose from six preset pastel themes or create a fully custom color scheme with automatic text color adjustment for perfect contrast. Perfect as a desk display, learning project, or desktop ornament.

## Features

- **Real-Time Display**: Updates every second showing current hours, minutes, seconds
- **Large Typography**: 8rem font size on desktop for clear, visible time display
- **Flip Card Design**: Individual cards for hours, minutes, and seconds with center divider lines
- **Date & Day Display**: Shows current date and full weekday name below the clock
- **Preset Color Themes**:
  - **Mint**: Soft green (#dff7ea, text #5c9b7b)
  - **Lavender**: Purple hue (#e9defa, text #8b6fb3)
  - **Peach**: Warm peachy tone (#ffe7dd, text #d68a72)
  - **Sky**: Light blue (#dfefff, text #6f9ecf)
  - **Sakura**: Pink (#ffdfe8, text #c47a94)
  - **Butter**: Warm yellow (#fff4c9, text #c2a24a)
- **Custom Color Picker**: 
  - Visual color picker for intuitive selection
  - Hex input field for precise color codes
  - Support for 6-digit and 3-digit hex formats
  - Optional `#` prefix handling
- **Smart Text Color**: Automatically calculates optimal text color based on background luminance
  - Light backgrounds → dark text
  - Dark backgrounds → light text
- **Glassmorphism Design**: Frosted glass effect with backdrop blur
- **Smooth Transitions**: All color and theme changes animate smoothly (0.3-0.4s)
- **Responsive Design**: Adapts to desktop (800px), tablet (768px), and mobile (480px)
- **Accessibility**: ARIA labels for theme buttons, semantic HTML
- **No Dependencies**: Pure vanilla HTML, CSS, and JavaScript

## Tech Stack

- **HTML5** — semantic structure, form inputs, time display elements
- **CSS3** — CSS custom properties (variables), glassmorphism with backdrop-filter, flexbox, radial gradients, responsive design, smooth transitions
- **Vanilla JavaScript (ES6)** — date/time handling, hex color validation, luminance calculation, DOM manipulation, event handling, CSS variable updates

## Folder Structure

```text
Flip Clock/
│
├── index.html      # Clock layout — time cards, date, color controls
├── script.js        # Clock logic, theme management, color handling
├── style.css        # Glassmorphic design, color themes, responsive layout
└── README.md        # Project documentation
```

## Setup / Run Instructions

No build step or dependencies required. Pure web technologies.

### Option 1: Open Directly
1. Navigate to the `Flip Clock` folder.
2. Double-click `index.html` to open in your browser.

### Option 2: Use a Local Server (recommended)
Using VS Code:
1. Install the **Live Server** extension.
2. Open the project folder in VS Code.
3. Right-click `index.html` → **Open with Live Server**.

## Usage

### Viewing the Clock

**Display Elements**:
- **Large Time Display**: Hours:Minutes:Seconds in three flip cards (e.g., 14:35:42)
- **Date**: Formatted current date below (e.g., 1/15/2024)
- **Day**: Full weekday name (e.g., Tuesday)
- **Center Dividers**: Horizontal lines through middle of each card for flip-clock aesthetic

### Changing Themes with Presets

**6 Quick Theme Buttons** (circular color swatches):
1. Click any color circle in the theme picker
2. Entire clock instantly changes to that theme
3. Active theme shows thick dark border (3px)
4. Text color automatically adjusts for readability

**Theme Colors Match Their Names**:
- Mint green button → soft green theme
- Lavender button → purple theme
- Peach button → warm orange-pink
- Sky button → light blue
- Sakura button → pink
- Butter button → soft yellow

### Using the Color Picker

**Method 1: Visual Color Picker** (🎨 icon):
1. Click the circular color picker button
2. Native color picker dialog opens
3. Select desired color
4. Clock updates in real-time
5. Hex input auto-syncs with selected color

**Method 2: Hex Input** (✏️ icon):
1. Click hex input field (shows `#dff7ea` by default)
2. Type valid hex color:
   - Full format: `#dff7ea` or `dff7ea`
   - Short format: `#abc` (expands to `#aabbcc`)
3. Press Enter, Tab, or click Apply button
4. Clock updates with new color
5. Text color auto-adjusted for contrast

**Method 3: Apply Button**:
1. Enter hex code in input field
2. Click **Apply** button
3. Clock updates with entered color

### Resetting to Default

**Reset Button** (↺ symbol):
- Click to return to Mint theme (default)
- Restores `#dff7ea` background and auto-calculated text color
- Clears custom selections

### Hex Color Input Formats

**Valid Formats**:
- `#dff7ea` ✅ Full 6-digit hex with `#`
- `dff7ea` ✅ Full 6-digit hex without `#`
- `#fac` ✅ Short 3-digit hex with `#` (auto-expands to `#ffaacc`)
- `fac` ✅ Short 3-digit hex without `#`

**Invalid Formats**:
- `#dff7e` ❌ Incomplete hex
- `xyz` ❌ Non-hex characters
- `dff7eaa` ❌ Too many digits
- Alert: "Please enter a valid hex color, e.g., #dff7ea"

## How It Works

### Time Display

```javascript
function updateClock() {
    const now = new Date();
    document.getElementById('hour').textContent = String(now.getHours()).padStart(2, '0');
    document.getElementById('minute').textContent = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('second').textContent = String(now.getSeconds()).padStart(2, '0');
}

// Update every second
updateClock();
setInterval(updateClock, 1000);
```

Gets current time, pads with leading zeros, updates DOM elements. Runs on page load and every 1000ms.

### Theme System

```javascript
const themes = {
    mint: { text: '#5c9b7b', bg: '#dff7ea' },
    lavender: { text: '#8b6fb3', bg: '#e9defa' },
    // ...
};

function applyTheme(bg, text) {
    root.style.setProperty('--bg', bg);
    root.style.setProperty('--text', text);
    // Automatically adjust divider color
    const divider = calculateDarkerShade(bg);
    root.style.setProperty('--divider', divider);
}
```

CSS custom properties control all color changes. Updating root properties instantly refreshes entire UI via CSS transitions.

### Luminance-Based Text Color

```javascript
function applyCustomColor(hex) {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    
    // WCAG luminance formula
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    let text;
    if (luminance > 0.6) {
        text = darkenColor(r, g, b, 80);  // Light bg → dark text
    } else {
        text = lightenColor(r, g, b, 100); // Dark bg → light text
    }
}
```

Calculates perceived brightness using WCAG formula. Chooses dark or light text depending on background luminance for automatic contrast.

### Hex Color Validation

```javascript
function applyCustomColor(hex) {
    // Test formats in priority order
    if (!/^#[0-9a-f]{6}$/i.test(hex)) {
        if (/^[0-9a-f]{6}$/i.test(hex)) {
            hex = '#' + hex;
        } else if (/^[0-9a-f]{3}$/i.test(hex)) {
            hex = '#' + hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        } else {
            alert('Invalid hex color');
            return;
        }
    }
}
```

Regex patterns validate and normalize hex input. Supports multiple formats and auto-expands 3-digit codes.

### Divider Color Calculation

```javascript
let r = parseInt(bg.slice(1,3), 16);
let g = parseInt(bg.slice(3,5), 16);
let b = parseInt(bg.slice(5,7), 16);

// Darken by 20 points
r = Math.min(255, Math.max(0, r - 20));
g = Math.min(255, Math.max(0, g - 20));
b = Math.min(255, Math.max(0, b - 20));

const divider = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
```

Extracts RGB from hex background, darkens each channel by 20 points (clamped to 0-255), converts back to hex for divider line color.

## Implementation Notes

- **CSS Variables**: `--bg`, `--text`, `--divider`, `--shadow` updated dynamically for instant theme changes
- **Glassmorphism**: `backdrop-filter: blur(25px)` with `rgba(255,255,255,0.35)` for frosted glass effect
- **Responsive Font Sizes**: `font-size: clamp()` or media queries adapt text for mobile
- **Smooth Transitions**: `transition: 0.3s ease` on background, color, box-shadow for visual polish
- **ARIA Labels**: Theme buttons labeled with theme name and have `aria-pressed` attribute
- **Hex Parsing**: `parseInt(hex.slice(n,m), 16)` extracts and converts RGB channels
- **Flip Card Divider**: `::before` pseudo-element creates horizontal line at 50% height
- **Active State**: `active` class with thicker border (3px vs 2px) and scale(1.15)

## Educational Value

This project demonstrates:

- Real-time clock with `setInterval()` and Date API
- CSS variables for dynamic theming
- Glassmorphism design pattern with backdrop-filter
- Hex color parsing and manipulation
- Luminance calculation for automatic text color
- Color space conversions (hex ↔ RGB)
- Input validation with regex patterns
- DOM manipulation with vanilla JavaScript
- Smooth CSS transitions for UI feedback
- Responsive design with media queries
- ARIA attributes for accessibility
- Pseudo-elements for decorative lines
- Event delegation for theme buttons

## Common Scenarios

**As a Desktop Display**:
1. Open in fullscreen on secondary monitor
2. Choose calming color theme
3. Use as always-on time display

**As a Learning Project**:
1. Study hex color calculations
2. Understand CSS variables and theming
3. Learn luminance algorithms
4. Practice DOM manipulation

**Customization Examples**:
1. Change Gaegu font to any Google Font
2. Adjust flip card height/width ratio
3. Add more preset themes to `themes` object
4. Implement 12/24 hour format toggle
5. Add AM/PM indicator

## Future Enhancements

Potential improvements:

- **Time Format Toggle**: Switch between 12-hour (AM/PM) and 24-hour formats
- **Timezone Support**: Display time in different timezones
- **Alarm Functionality**: Set and manage alarms
- **Dark/Light Mode**: Automatic theme based on system preferences
- **Analog Clock**: Add traditional clock face alongside digital
- **Stopwatch/Timer**: Multi-purpose time display tool
- **Theme Presets Expansion**: Add more color themes (grayscale, neon, pastel, earth tones)
- **Color History**: Recently used colors for quick access
- **Gradient Backgrounds**: Option for gradient instead of solid color
- **Font Selection**: Switch between different font families
- **Weather Integration**: Show temperature alongside time
- **Animations**: Flip animation on second change (like real flip clock)
- **Audio**: Optional tick sound or chime
- **Fullscreen Mode**: Dedicated fullscreen button
- **Local Storage**: Save preferred theme and color

## Browser Compatibility

Works on all modern browsers supporting:
- ES6 JavaScript
- CSS custom properties
- CSS backdrop-filter
- Date API
- Flexbox

**Tested on**: Chrome, Firefox, Safari, Edge

**Not supported**: IE11 (lacks CSS variables)

## Accessibility

- **Theme Buttons**: ARIA labels with theme name
- **Pressed State**: `aria-pressed` attribute shows active theme
- **Color Contrast**: Auto-calculated text color meets WCAG AA standards
- **Keyboard Navigation**: Tab through all interactive elements
- **Semantic HTML**: Proper heading, button, input, label elements
- **Focus States**: Visible outline on focused inputs
- **Large Text**: 8rem time display easily readable

## Performance Notes

- **Lightweight**: Single file app, minimal DOM manipulation
- **Efficient Updates**: Only DOM text nodes updated each second (not entire clock)
- **CSS Transitions**: Hardware-accelerated via GPU
- **No Flicker**: Smooth updates at 60fps
- **Memory Efficient**: Single setInterval, no event listeners per element

## License

This project is open-source and available for educational and personal use.

## Author

Contributed as part of the [100 Days 100 Web Projects](../../README.md) challenge.
