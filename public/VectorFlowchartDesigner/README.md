# Vector Flowchart Designer

A browser-native vector flowchart and diagramming workspace built with pure HTML, CSS, SVG, and JavaScript. The application provides a lightweight, dependency-free environment for creating flowcharts using draggable nodes, editable labels, and dynamic SVG connectors.

---

## Overview

Vector Flowchart Designer is a standalone visual diagram editor designed for rapid flowchart creation directly in the browser. Users can drag predefined node templates onto an interactive canvas, connect elements using vector paths, edit node text inline, and navigate large diagrams through pan and zoom controls.

The project uses native browser APIs and SVG rendering to maintain smooth interaction and crisp visuals without external libraries.

---

## Features

### Node Management

* Drag-and-drop shape creation
* Click-to-spawn templates
* Process nodes (Rectangle)
* Decision nodes (Diamond)
* Start/End nodes (Rounded Rectangle)
* Inline editable titles and subtitles

### Canvas Interaction

* Infinite-style workspace navigation
* Smooth viewport panning
* Zoom in/out controls
* Viewport reset functionality
* Workspace clearing tools

### Vector Connections

* SVG-based connector rendering
* Dynamic curved connection paths
* Interactive connection ports
* Arrowhead endpoint markers
* Live connection preview during linking

### User Experience

* Light and dark theme support
* Persistent theme preference storage
* Responsive workspace layout
* Keyboard-accessible node controls
* Touch and pointer device compatibility

---

## Technology Stack

| Technology     | Purpose                          |
| -------------- | -------------------------------- |
| HTML5          | Application structure            |
| CSS3           | Layout, themes, styling          |
| SVG            | Vector connectors and arrows     |
| JavaScript ES6 | Interaction and state management |
| Local Storage  | Theme persistence                |

---

## Project Structure

```text
vector-flowchart-designer/
│
├── index.html
├── style.css
├── script.js
├── README.md
├── preview.png
├── favicon_vector.png
```

---

## Core Architecture

### State Layer

The application maintains a centralized state object that stores:

* Nodes
* Connections
* Viewport transforms
* Selection state
* Interaction modes

### Rendering Layer

Rendering is divided into:

1. HTML Nodes

   * Draggable flowchart elements
   * Editable text regions

2. SVG Connection System

   * Curved vector paths
   * Arrow markers
   * Live connection previews

### Interaction Layer

Native Pointer Events handle:

* Node dragging
* Canvas panning
* Connection creation
* Template placement
* Touch support

---

## Getting Started

### Option 1: Open Directly

Simply open:

```text
index.html
```

in any modern browser.

### Option 2: Local Development Server

Using VS Code Live Server:

```bash
Right Click index.html
→ Open with Live Server
```

Using Python:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

---

## Controls

| Action               | Behavior                        |
| -------------------- | ------------------------------- |
| Click Template       | Create node                     |
| Drag Template        | Drop node onto canvas           |
| Drag Node            | Move node                       |
| Drag Connection Port | Create connector                |
| Zoom In              | Increase scale                  |
| Zoom Out             | Decrease scale                  |
| Reset Viewport       | Return to default view          |
| Clear Workspace      | Remove all nodes and connectors |
| Toggle Theme         | Switch Light/Dark mode          |

---

## Browser Support

* Google Chrome
* Microsoft Edge
* Mozilla Firefox
* Safari
* Brave
* Opera

Modern browsers with support for:

* Pointer Events
* SVG
* CSS Variables
* ES6 JavaScript

---

## Future Enhancements

* Export to SVG
* Export to PNG
* Undo / Redo history
* Node grouping
* Grid snapping
* Custom node templates
* Multi-selection support
* Auto-layout algorithms
* Import / Export project files

---

## License

MIT License

Feel free to use, modify, and distribute this project for personal or commercial applications.

---

## Author

Vector Flowchart Designer

A lightweight browser-based diagramming workspace built with modern web standards and zero external dependencies.
