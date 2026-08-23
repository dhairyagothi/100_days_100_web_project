# Binary Tree Traversal Visualizer

An interactive visualizer for building a Binary Search Tree (BST) and watching **Pre-Order**, **In-Order**, and **Post-Order** traversals animate step by step, node by node, edge by edge.

## Description

This project lets you construct your own Binary Search Tree by inserting numbers one at a time, then pick a traversal algorithm to see exactly how it walks the tree. Each visit "lights up" the current node and the edge leading to it, and each value gets appended to a running output log as it's extracted — turning the classic Root/Left/Right recursion into something you can watch happen instead of just trace on paper.

## Features

- **Build-your-own BST**: Insert any integer and watch it land in its correct position via standard BST insertion rules (duplicates are ignored).
- **3 Classic Traversals**:
  - **Pre-Order** (Root → Left → Right)
  - **In-Order** (Left → Root → Right)
  - **Post-Order** (Left → Right → Root)
- **Animated walkthrough**: The active node and the edge being traversed are highlighted in real time, with visited nodes marked distinctly.
- **Live Traversal Output**: Extracted values are appended to an output log (`[ 5, 3, 8, ... ]`) as the algorithm runs.
- **Adjustable Animation Speed**: A slider controls how fast the traversal plays out.
- **Auto-scaling tree layout**: Node positions are computed recursively so the tree stays centered and readable as it grows.
- **Clear Tree**: Reset the canvas and start over with a fresh tree.
- **Input locking during traversal**: Controls are disabled mid-animation to prevent state corruption from concurrent operations.
- **Responsive, glassmorphism UI**: Clean dark theme with blurred glass panels, gradient header text, and a layout that adapts to mobile screens.
- Zero dependencies — pure HTML, CSS, and JavaScript.

## Tech Stack

- **HTML5** — semantic structure and layout
- **CSS3** — custom properties (CSS variables), Flexbox, glassmorphism (`backdrop-filter`), gradient text, media queries for responsiveness
- **Vanilla JavaScript (ES6)** — recursive BST insertion, recursive `async`/`await` traversal algorithms, dynamic SVG edge rendering and DOM node rendering

## Folder Structure

```text
BinaryTreeTraversalVisualizer/
│
├── index.html      # App structure — controls, output log, visualization area
├── style.css        # Glassmorphism styling, node/edge states, responsive layout
├── script.js        # BST insertion, tree rendering, traversal algorithms & animation
└── README.md         # Project documentation
```

## Setup / Run Instructions

No build step or dependencies are required.

### Option 1: Open Directly
1. Navigate to the `BinaryTreeTraversalVisualizer` folder.
2. Double-click `index.html` (or open it) in any modern web browser.

### Option 2: Use a Local Server (recommended for live-reload)
Using VS Code:
1. Install the **Live Server** extension.
2. Open the project folder in VS Code.
3. Right-click `index.html` → **Open with Live Server**.

## Usage

1. Type a number into the input field and click **Insert Node** (or press **Enter**) to add it to the tree. Repeat to build up your BST.
2. Click **Pre-Order**, **In-Order**, or **Post-Order** to animate that traversal over the current tree.
3. Watch the **Traversal Output** panel fill in as each node is visited, and follow the highlighted node/edge in the visualization area.
4. Drag the **Animation Speed** slider to speed up or slow down the walkthrough.
5. Click **Clear Tree** to reset everything and start building a new tree.

> Note: While a traversal is animating, the insert field, buttons, and speed slider are temporarily disabled to keep the tree state consistent.

## How It Works

### BST Insertion
`insertNode` places the root on first insert; subsequent values recurse left or right (`insertBST`) by comparing against each node's value, halving the horizontal offset at each depth so the tree layout naturally narrows as it grows.

### Traversal Algorithms
Each traversal (`preOrder`, `inOrder`, `postOrder`) is an `async` recursive function that:
1. Marks the current node `active` (`visit`) and `await`s a `sleep()` tied to the speed slider.
2. Appends the node's value to the output log when it's the traversal's "extraction point" (`extract`).
3. Toggles the connecting edge's `active` class while recursing into a child, then clears it on the way back up.

```javascript
async function preOrder(node) {
    if (!node || !isTraversing) return;
    await visit(node.id); await extract(node.id);
    if (node.left) { /* highlight edge, recurse, un-highlight */ }
    if (node.right) { /* highlight edge, recurse, un-highlight */ }
}
```

### Rendering
`drawTree` clears and redraws the whole tree on every insert: SVG `<line>` elements are drawn for edges and absolutely-positioned `<div>` nodes for values, using percentage-based `x`/`y` coordinates computed during insertion.

## Author

Contributed as part of the [100 Days 100 Web Projects](../../README.md) challenge.
