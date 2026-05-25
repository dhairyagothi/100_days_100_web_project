# Local Image Palette Extractor 🎨

A sleek, client-side web application that allows users to upload local images and instantly generate a matching color palette. Built with a focus on modern UI/UX using Material 3 design principles.

## ✨ Features
- **Local File Processing:** Images are read entirely in the browser using the HTML5 `FileReader` API. No server uploads are required, ensuring total privacy and rapid speed.
- **Instant Extraction:** Utilizes `ColorThief` to analyze pixel data and extract the 6 most dominant colors.
- **Material 3 UI:** Clean, responsive design featuring hover animations, interactive states, and soft shadows.
- **One-Click Copy:** Easily click any generated color swatch to copy its HEX value directly to your clipboard.

## 🚀 Tech Stack
- **HTML5:** Semantic document structure.
- **CSS3:** Flexbox, CSS Variables, and Material Design 3 tokens.
- **Vanilla JavaScript:** DOM manipulation, file handling, and Clipboard API.
- **[ColorThief](https://lokeshdhakar.com/projects/color-thief/):** Lightweight JavaScript library for grabbing color palettes from images.

## 🛠️ How to run locally
Because this project processes files entirely client-side, you can run it without a server:
1. Clone or download this repository.
2. Ensure `index.html`, `style.css`, and `script.js` are in the same folder.
3. Simply double-click `index.html` to open it in your web browser. 
4. Click "Upload Photo" and select an image from your computer to see it in action.