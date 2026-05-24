# 📊 Code Visualizer Playground

A beginner-friendly sorting visualizer in the **100 Days 100 Web Projects** collection.

This project helps learners understand sorting algorithms through animated bars, live operation tracking, and algorithm-specific explanations.

It runs fully offline using plain HTML, CSS, and JavaScript—no backend or build tooling required.

## 🌐 Live Demo

- Main website: [100-days-100-web-project.vercel.app](https://100-days-100-web-project.vercel.app/)
- Project page: [Code Visualizer Playground](https://100-days-100-web-project.vercel.app/public/code-visualizer-playground/)

## ✨ Features

- **Sorting Visualizer** with animated bars and state-based colors
- **5 Algorithms Included**
  - Bubble Sort
  - Selection Sort
  - Insertion Sort
  - Merge Sort
  - Quick Sort
- **Playback Controls**
  - Generate New Array
  - Play / Pause / Reset / Step
  - Speed Slider (`500ms` → `50ms`)
  - Speed updates are applied even while sorting is running
- **Live Learning Aids**
  - Comparisons and Swaps counters
  - Explanation panel for current operation
  - Algorithm Guide section with:
    - Theoretical explanation
    - Time/space complexity
    - Code-based snippet
- **Responsive UI**
  - Mobile-friendly navbar and layout
  - Bar/label adjustments for smaller screens

## 🚀 Run Locally

1. Open the `public/code-visualizer-playground` folder.
2. Open `index.html` in your browser (double-click works).

That’s it—no install/setup needed.

## 🛠️ Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (classic script files, no bundler)

## 📁 Project Structure

```text
code-visualizer-playground/
├── index.html
├── styles/
│   ├── main.css
│   └── visualizer.css
├── js/
│   ├── app.js
│   ├── utils.js
│   └── algorithms/
│       ├── bubbleSort.js
│       ├── selectionSort.js
│       ├── insertionSort.js
│       ├── mergeSort.js
│       └── quickSort.js
└── README.md
```

## ➕ Add a New Algorithm

1. Create a new file in `js/algorithms/` (example: `heapSort.js`).
2. Register your visualizer function in `window.SortingAlgorithms` using the existing pattern.

```js
(function () {
  window.SortingAlgorithms = window.SortingAlgorithms || {};

  async function visualize(array, speed, callbacks) {
    // callbacks.onCompare(i, j)
    // callbacks.onSwap(i, j, array)
    // callbacks.onSorted(i)
    // callbacks.onExplain(text)
    // callbacks.wait()
  }

  window.SortingAlgorithms.heap = visualize;
})();
```

3. Add the algorithm entry in `js/app.js` under `ALGORITHMS`.
4. Add guide content in `js/app.js` under `ALGORITHM_GUIDES`.
5. Add a new tab button in `index.html` with matching `data-algo`.
6. Reload `index.html` and verify animation, counters, and guide content.

## 🤝 Contributing

Contributions are welcome! Please follow the repository’s contribution guidelines from the root project before submitting changes.

## 📄 License


