# CSS Animation Playground

## 🎨 Description

CSS Animation Playground is an interactive visual builder that lets you create stunning CSS animations with a live preview, keyframe timeline editor, and instant code generation. It features a premium dark neon theme with glassmorphism effects, making the process of building animations both powerful and beautiful.

## ✨ Features

* **12 Preset Animations**: Instantly apply and customize animations like Bounce, Fade In, Slide In, Spin, Pulse, Shake, Flip, Zoom In, Swing, Rubber Band, Jello, and Heartbeat.
* **Visual Keyframe Timeline**: Add, delete, and select keyframes directly on a timeline to edit your animation visually.
* **Full Animation Controls**: Adjust duration, delay, easing (timing function), iteration count, direction, and fill mode.
* **Per-Keyframe Properties**: Control TranslateX, TranslateY, Rotate, Scale, SkewX, Opacity, Border Radius, Background Color, and Box Shadow Blur for each keyframe individually.
* **5 Preview Shapes**: Test your animations on different shapes: Box, Circle, Text, Card, and Star.
* **Live Code Generation**: Instantly view the generated CSS code with syntax highlighting and copy it to your clipboard with a single click.
* **Playback Controls**: Play, pause, or stop the animation, and test it at different speeds (0.25x to 2x).
* **Premium UI**: Stunning dark neon theme with glassmorphism, animated background glows, and a responsive 3-panel grid layout.

## 🛠️ Technologies Used

* **HTML5**: Semantic structure and SVG icons.
* **CSS3**: Variables, Flexbox, CSS Grid, Glassmorphism, CSS Animations, and Custom Sliders.
* **JavaScript (ES6+)**: State management, DOM manipulation, dynamic CSS generation, and custom syntax highlighting.

## 📂 Folder Structure

```text
CSS-Animation-Playground/
├── index.html    # The main HTML structure
├── style.css     # The premium dark neon styling
├── script.js     # The core logic and state management
└── README.md     # This documentation file
```

## 🚀 How to Use

1. Open `index.html` in your web browser.
2. Select a **Preset** from the top bar to get started quickly, or start from scratch.
3. Use the **Animation Settings** panel on the left to adjust the overall animation duration, delay, easing, and preview shape.
4. Use the **Live Preview** panel in the center to watch your animation. Click the **Play/Pause** buttons to control playback.
5. In the **Keyframes** section below the preview, click on timeline dots to edit specific keyframes, or click `+ Add` to create new ones.
6. Adjust properties like Translate, Rotate, Scale, and Color for the active keyframe.
7. Once satisfied, click the **Copy** button in the **Generated CSS** panel on the right to copy the exact CSS code for your project.

## 🧑‍💻 Development Notes

* The project uses pure Vanilla JavaScript with no external dependencies or frameworks.
* Animations are generated dynamically by creating an `@keyframes` CSS rule and injecting it into a `<style>` tag in the document head.
* The code output panel uses a custom lightweight regex-based syntax highlighter for better readability.
