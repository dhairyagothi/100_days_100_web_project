# Color Palette Generator

A simple yet powerful utility for generating random color palettes with one-click generation, individual color copying, and an intuitive visual interface ideal for designers and developers.

## Brief Description

The Color Palette Generator creates beautiful random 5-color palettes with a single click or spacebar press. Each color can be independently copied to the clipboard by clicking on its tile. Perfect for finding color schemes for web design, graphic design, branding, and creative projects. The minimalist interface emphasizes the colors themselves.

## Features

- **Random Palette Generation** - Creates harmonious 5-color palettes with one click
- **Easy Color Copying** - Click any color tile to copy its hex code to clipboard
- **Spacebar Trigger** - Quick palette generation using spacebar (no mouse needed)
- **Visual Hex Display** - Each color shows its hex code prominently
- **Interactive Feedback** - Visual expansion effect on color hover
- **Clean Interface** - Minimal design that lets colors shine
- **Responsive Layout** - Works on desktop and mobile devices
- **Real-time Hex Updates** - Live display of color values
- **No External Dependencies** - Pure HTML, CSS, and JavaScript

## Technologies Used

- **HTML5** - Semantic page structure
- **CSS3** - Advanced styling with:
  - Flexbox layout for dynamic color display
  - Hover effects and smooth transitions
  - Semi-transparent overlays for text contrast
  - Responsive design patterns
- **JavaScript (ES6+)** - Color generation and manipulation
- **Clipboard API** - Copy hex codes functionality
- **Random Color Generation** - Client-side color algorithms

## Installation / Setup Instructions

1. **Navigate to the project folder:**
   ```bash
   cd public/Color-Pelette
   ```

2. **Open in a web browser:**
   - Simply open `index.html` in any modern web browser
   - No build process, dependencies, or setup required
   - Works offline without internet connectivity
   - Chrome, Firefox, Safari, Edge all supported

3. **Alternative - Local development server:**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Navigate to: http://localhost:8000/Color-Pelette
   ```

## Usage Instructions

1. **Launch the Generator:**
   - Open `index.html` in your browser
   - A default palette loads on startup

2. **Generate New Palettes:**

   **Method 1 - Click Button:**
   - Click **"Generate New Palette (or press Space)"** button
   - Palette updates instantly with new colors

   **Method 2 - Spacebar:**
   - Press the spacebar anywhere on the page
   - Palette generates without needing to click

3. **View Color Hex Codes:**
   - Each color displays its hex code in the center
   - Hex codes update with each generation
   - Format: `#XXXXXX` (standard web color format)

4. **Copy Colors to Clipboard:**
   - Click on any color tile
   - Hex code automatically copies to clipboard
   - Browser shows confirmation alert
   - Paste into any application (design tools, code, etc.)

5. **Export Palette:**
   - Once you have colors you like, copy each individually
   - Or use browser's developer tools to inspect computed styles
   - Create a palette file in your chosen format

## Project Structure

```
Color-Pelette/
├── index.html          # Main application with embedded styles
└── README.md           # This file
```

## Color Generation Algorithm

The generator creates random hex colors using:

1. **Random Number Generation** - `Math.random()` generates decimal 0-1
2. **Conversion to Integer** - Multiplies by 16777215 (0xFFFFFF)
3. **Base-16 Conversion** - Converts to hexadecimal string
4. **Padding** - Ensures 6-character format with leading zeros
5. **Repetition** - Generates 5 unique colors per palette

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| SPACEBAR | Generate new palette |

## Mouse Interactions

| Action | Effect |
|--------|--------|
| **Hover over color** | Tile expands/grows slightly |
| **Click on color** | Hex code copies to clipboard, confirmation shown |

## Browser Compatibility

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Clipboard Support

- Modern Clipboard API for copying
- Fallback to alert display if copy fails
- Manual selection available for older browsers

## Tips for Use

1. **Design Inspiration** - Generate palettes until you find something inspiring
2. **Save Combinations** - Screenshot palettes you love for reference
3. **Accessibility** - Ensure sufficient contrast between foreground and background
4. **Consistency** - Use all 5 colors or select your favorites
5. **Testing** - Test colors in your actual design before committing
6. **Iteration** - Keep generating until you get the right feel

## Common Workflows

### For Web Designers
1. Generate palette
2. Copy primary color (1st tile)
3. Copy accent color (2nd tile)
4. Use remaining colors for highlights and neutrals

### For Developers
1. Generate palette
2. Copy each color individually
3. Store in CSS variables or config file
4. Reference in stylesheets

### For Brand Development
1. Generate multiple palettes
2. Screenshot favorites
3. Combine best colors from different palettes
4. Create custom palettes

## Notes

- All color generation is random; results vary with each generation
- No guarantee of color harmony (though many combinations are pleasing)
- Pure JavaScript implementation - no server required
- Works offline without internet connection
- Great for quick inspiration and prototyping
- Consider using color theory tools for refined palettes
- Perfect for rapid prototyping and exploration
