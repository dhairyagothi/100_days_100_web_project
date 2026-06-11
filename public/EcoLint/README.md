# EcoLint

EcoLint is a small browser tool that inspects pasted HTML, CSS, or JavaScript for performance and energy-use patterns, then reports an estimated eco score and code issues.

## Features

- Paste code and run an analysis
- Estimate payload size and monthly CO2 impact
- Detect common performance leaks
- Visualize the eco score with a gauge
- Show issue cards with severity and counts

## How to Use

1. Paste your source code into the editor.
2. Click **Analyze Code Density**.
3. Review the score, size, carbon estimate, and issue list.

## Files

- `index.html` - Dashboard layout
- `style.css` - Visual styling
- `app.js` - Rule engine and score calculation

## Notes

- The analyzer is heuristic-based and runs entirely in the browser.
- Carbon output is an approximate estimate for demonstration purposes.
