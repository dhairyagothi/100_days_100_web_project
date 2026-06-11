# High-Throughput Critical DOM Virtualization Pipeline

This project demonstrates a high-throughput virtual scrolling engine that manages a very large dataset while only rendering a small reusable pool of DOM nodes.

## Features

- Virtualized rendering for large datasets
- Manual lead insertion into the data set
- Scroll-based row recycling
- Lightweight diagnostic output
- Minimal physical DOM footprint

## How to Use

1. Open the page in a browser.
2. Scroll inside the virtual viewport.
3. Add a manual lead using the form controls.
4. Watch the DOM pool update without rebuilding the full list.

## Files

- `index.html` - Demo page and controls
- `app.js` - Dataset bootstrap and interactions
- `virtualEngine.js` - Virtual scrolling engine

## Notes

- The engine reuses a small pool of rows for performance.
- The dataset in the demo is intentionally large to showcase virtualization.
