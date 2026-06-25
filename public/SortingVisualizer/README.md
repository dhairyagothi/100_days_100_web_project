# Sorting Algorithm Visualizer

An interactive visualizer that animates how six classic sorting algorithms work, bar by bar, comparison by comparison.

## Description

This project renders an array as a row of vertical bars and animates the step-by-step process of sorting them. Watching the comparisons, swaps, and pivots play out in real time makes it much easier to build intuition for *why* one algorithm is faster than another, instead of just reading pseudocode.

## Features

- 6 algorithms: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort, and Heap Sort
- Adjustable array size (10–120 bars) and animation speed
- Live stats: comparison count, swap/write count, and elapsed time
- Color-coded bar states (comparing, swapping, pivot, sorted) with a legend
- Pause / Resume mid-sort, plus a one-click reset with a fresh random array
- Fully responsive layout
- Zero dependencies — pure HTML, CSS, and JavaScript

## Technologies Used

- HTML5
- CSS3 (custom properties, flexbox, CSS grid)
- Vanilla JavaScript (async/await for animation timing)

## How to Run

1. Open `index.html` in any modern web browser.
2. Pick an algorithm from the dropdown.
3. Adjust array size and speed to taste.
4. Click **Start** to watch it sort. Click again to pause/resume.
5. Click **New Array** for a fresh shuffle, or **Reset** to stop mid-sort.

## Implementation Notes

- Each algorithm is implemented as an `async` function that calls `await sleep(delay)` between meaningful steps, which yields to the browser's render loop so the animation is visible instead of happening instantly.
- A shared `checkControl()` guard is awaited inside every algorithm's inner loop to support pausing (busy-waits while paused) and stopping (throws to unwind the recursion/loops cleanly on Reset).
- Merge Sort and Quick Sort are implemented recursively; Heap Sort builds a max-heap first, then repeatedly extracts the max.
- Bar heights are recalculated from the live `array` values on every write, so the visualization always reflects the true in-memory state — there's no separate "animation-only" data path.

## Author

Melody (GitHub: CoderMS07)