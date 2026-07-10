# Sorting Algorithm Visualizer

An interactive visualizer that animates how six classic sorting algorithms work, bar by bar, comparison by comparison.

## Description

This project renders an array as a row of vertical bars and animates the step-by-step process of sorting them. Watching the comparisons, swaps, and pivots play out in real time makes it much easier to build intuition for *why* one algorithm is faster than another, instead of just reading pseudocode.

## Features

- **6 Algorithms**: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort, and Heap Sort
- **Algorithm Info Card**: Shows time complexities (best/average/worst), space complexity, stability, in-place status, description, and real-world apps
- **Live Explanation Panel**: Displays what's currently happening (comparing, swapping, pivot selected, etc.)
- **Source Code Viewer**: Shows pseudocode with highlighted current step
- **Enhanced Statistics Panel**: Comparisons, swaps, array reads/writes, current pass, elapsed time, current speed, total operations, status
- **Array Pattern Generator**: Random, Nearly Sorted, Reverse Sorted, Few Unique Values, Mountain, Valley, Wave
- **Theme Switcher**: Dark, Light, Ocean, Neon, Matrix
- **Sound Effects**: Web Audio API with comparison/swap sounds and mute toggle
- **Sorting Summary Dialog**: Shows stats after sorting completes
- **Educational Learning Section**: How it works, advantages, disadvantages, when to use
- **Improved Controls**: Disabled while sorting, hover/click effects
- **Improved Sorting Animations**: Color-coded bar states (comparing, swapping, pivot, sorted)
- **Keyboard Shortcuts**:
  - Space: Start/Pause
  - R: Reset
  - N: New Array
  - M: Mute/Unmute
  - T: Cycle Themes
- **Local Storage**: Remembers your preferences (theme, algorithm, array size, speed, pattern, sound state)
- Adjustable array size (10–200 bars) and animation speed
- Fully responsive layout
- Zero dependencies — pure HTML, CSS, and JavaScript

## Technologies Used

- HTML5
- CSS3 (custom properties, flexbox, CSS grid)
- Vanilla JavaScript (async/await for animation timing)

## How to Run

1. Open `index.html` in any modern web browser.
2. Pick an algorithm from the dropdown.
3. Adjust array size, speed, and pattern to taste.
4. Click **Start** to watch it sort. Click again to pause/resume.
5. Click **New Array** for a fresh shuffle, or **Reset** to stop mid-sort.

## Implementation Notes

- Each algorithm is implemented as an `async` function that calls `await sleep(delay)` between meaningful steps, which yields to the browser's render loop so the animation is visible instead of happening instantly.
- A shared `checkControl()` guard is awaited inside every algorithm's inner loop to support pausing (busy-waits while paused) and stopping (throws to unwind the recursion/loops cleanly on Reset).
- Merge Sort and Quick Sort are implemented recursively; Heap Sort builds a max-heap first, then repeatedly extracts the max.
- Bar heights are recalculated from the live `array` values on every write, so the visualization always reflects the true in-memory state — there's no separate "animation-only" data path.

## Author

Melody (GitHub: CoderMS07)