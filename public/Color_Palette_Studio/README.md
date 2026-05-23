# 🎨 Color Palette Studio

A beautiful, browser-based tool for generating harmonious color palettes using color theory. Pick any seed color, choose a harmony mode, and instantly get a professional color scheme you can export to CSS or copy to your clipboard.

## ✨ Features

- **7 Harmony Modes** — Monochromatic, Analogous, Complementary, Triadic, Tetradic, Split-Complementary, Shades & Tints
- **Adjustable Count** — Generate between 3 and 10 swatches per palette
- **Random Seed Generator** — Discover unexpected combinations in one click
- **Grid & Strip Views** — Switch between a card grid layout and a fluid color strip
- **Color Detail Panel** — Click any swatch to see HEX, RGB, and HSL values with one-click copy
- **CSS Export** — Generates CSS custom properties (variables) ready to paste into any project, with download support
- **Save & Load Palettes** — Save your favorite palettes to `localStorage` and reload them anytime
- **Luminance Labels** — Each swatch is labeled with a human-readable brightness description

## 🛠️ Technologies Used

- HTML5
- CSS3 (CSS custom properties, grid, flexbox, transitions)
- Vanilla JavaScript (ES6+)
- Color theory math (HSL ↔ RGB conversion, luminance, harmony algorithms)
- `localStorage` for palette persistence
- Clipboard API for copy-to-clipboard

## 🚀 How to Run

1. Clone the repository
2. Open `public/Color_Palette_Studio/index.html` in any modern browser
3. No build step or server required — works entirely offline

## 📸 Screenshots

> Pick a seed color, select a harmony, and watch your palette update instantly.

## 🧠 How It Works

The app converts colors between HEX → RGB → HSL, applies the selected harmony algorithm (e.g., rotate hue by 120° for triadic), and converts back to HEX for display. Luminance is calculated using the WCAG relative luminance formula.

## 👤 Author

Sahit — GSSoC '26 Contributor
