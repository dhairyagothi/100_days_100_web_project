# Dot-Matrix Glyph Pattern Maker

An interactive visualizer inspired by modern, transparent hardware aesthetics. Users can draw patterns on a digital grid that translates into glowing, monochromatic LED-style arrays.

## Core Features

* **Interactive Canvas:** A dynamic matrix where users can click and drag to toggle LEDs on and off, sketching custom shapes or symbols seamlessly.
* **Random Color Mode:** A toggle lets users paint each cell with a random color from the existing palette while keeping the rest of the drawing workflow unchanged.
* **Hardware Aesthetic:** High-contrast, dark mode UI utilizing advanced CSS `box-shadow` properties to create realistic, glowing neon hardware effects.
* **Animation Sequencer:** Built-in playback controls allowing users to animate their active patterns utilizing pulse, flash, and programmatic scrolling effects.
* **JSON Export:** A direct utility button that translates the current matrix state into a multi-dimensional array object and downloads it as a `.json` configuration file.

## Tech Stack

* HTML5
* CSS3
* Vanilla JavaScript

## Setup & Usage

1. Clone or download the repository.
2. Ensure `index.html`, `style.css`, and `script.js` are in the same root directory.
3. Open `index.html` in any modern web browser. No local server or build tools are required.
4. Set your desired grid dimensions and click "Update".
5. Click and drag across the dark circles to draw your pattern.
6. Toggle "Random Colors" to paint each cell with a different palette color while drawing.
7. Select an animation style from the dropdown and hit "Play".
8. Click "Export JSON" to save your configuration.