# SVG Path Builder

A lightweight, zero-dependency visual tool for developers to draw and generate SVG `<path>` codes instantly. Skip the heavy design software when you just need a simple, smooth UI curve.

## Features

- **Interactive Canvas**: Click to drop anchor points on a dotted design grid.
- **Drag & Drop**: Easily adjust existing points; the curve updates in real-time.
- **Smooth Interpolation**: Automatically generates fluid curves using quadratic Bezier midpoints.
- **Instant Code Generation**: The raw SVG code is built as you draw.
- **One-Click Copy**: Grab the clean markup directly to your clipboard.
- **Modern UI**: Expressive, minimal, card-based interface with micro-animations.

## Getting Started

Since this is built with vanilla HTML, CSS, and JavaScript, no build step is required. 

1. Clone the repository.
2. Open `index.html` in your web browser.
3. Start clicking on the canvas to generate paths!

## File Structure

- `index.html`: The markup and layout structure.
- `style.css`: Minimalist, dark-mode CSS with responsive flex/grid layouts.
- `script.js`: Core logic handling DOM events, path calculation, and clipboard interaction.