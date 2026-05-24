// Encapsulates app state/controller and avoids leaking globals.
(function () {
  if (!window.VisualizerUtils || !window.SortingAlgorithms) {
    console.error(
      "Missing required scripts: utils or algorithms did not load.",
    );
    return;
  }

  var copyArray = window.VisualizerUtils.copyArray;
  var randomArray = window.VisualizerUtils.randomArray;
  var sleep = window.VisualizerUtils.sleep;
  var speedValueToDelay = window.VisualizerUtils.speedValueToDelay;

  var STOP_ERROR_MESSAGE = "VISUALIZATION_STOPPED";
  var ARRAY_SIZE = 32;

  var ALGORITHMS = {
    bubble: { label: "Bubble Sort", run: window.SortingAlgorithms.bubble },
    selection: {
      label: "Selection Sort",
      run: window.SortingAlgorithms.selection,
    },
    insertion: {
      label: "Insertion Sort",
      run: window.SortingAlgorithms.insertion,
    },
    merge: { label: "Merge Sort", run: window.SortingAlgorithms.merge },
    quick: { label: "Quick Sort", run: window.SortingAlgorithms.quick },
  };

  var ALGORITHM_GUIDES = {
    bubble: {
      theory:
        "Bubble Sort compares adjacent values and swaps them when out of order. Each pass pushes the largest unsorted value to the right. It is easy to understand but slower on large arrays.",
      complexity:
        "Time: O(n²) avg/worst, O(n) best (nearly sorted) · Space: O(1)",
      code: [
        "for (let end = n - 1; end > 0; end--) {",
        "  let swapped = false;",
        "  for (let i = 0; i < end; i++) {",
        "    if (arr[i] > arr[i + 1]) {",
        "      [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];",
        "      swapped = true;",
        "    }",
        "  }",
        "  if (!swapped) break;",
        "}",
      ].join("\n"),
    },
    selection: {
      theory:
        "Selection Sort repeatedly selects the minimum value from the unsorted part and places it at the current index. It performs fewer swaps than Bubble Sort but still scans repeatedly.",
      complexity: "Time: O(n²) avg/worst/best · Space: O(1)",
      code: [
        "for (let i = 0; i < n - 1; i++) {",
        "  let minIndex = i;",
        "  for (let j = i + 1; j < n; j++) {",
        "    if (arr[j] < arr[minIndex]) minIndex = j;",
        "  }",
        "  if (minIndex !== i) {",
        "    [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];",
        "  }",
        "}",
      ].join("\n"),
    },
    insertion: {
      theory:
        "Insertion Sort grows a sorted prefix one item at a time by inserting each new value into its correct position. It works very well for small or nearly sorted datasets.",
      complexity: "Time: O(n²) avg/worst, O(n) best · Space: O(1)",
      code: [
        "for (let i = 1; i < n; i++) {",
        "  const key = arr[i];",
        "  let j = i - 1;",
        "  while (j >= 0 && arr[j] > key) {",
        "    arr[j + 1] = arr[j];",
        "    j--;",
        "  }",
        "  arr[j + 1] = key;",
        "}",
      ].join("\n"),
    },
    merge: {
      theory:
        "Merge Sort uses divide-and-conquer: split the array into halves, recursively sort each half, then merge them in order. It is stable and efficient for large inputs.",
      complexity: "Time: O(n log n) avg/worst/best · Space: O(n)",
      code: [
        "function mergeSort(arr) {",
        "  if (arr.length <= 1) return arr;",
        "  const mid = Math.floor(arr.length / 2);",
        "  const left = mergeSort(arr.slice(0, mid));",
        "  const right = mergeSort(arr.slice(mid));",
        "  return merge(left, right);",
        "}",
      ].join("\n"),
    },
    quick: {
      theory:
        "Quick Sort picks a pivot, partitions values into smaller/greater sides, then recursively sorts each side. It is very fast in practice, though worst-case time appears with poor pivots.",
      complexity:
        "Time: O(n log n) avg/best, O(n²) worst · Space: O(log n) recursion",
      code: [
        "function quickSort(arr, low, high) {",
        "  if (low >= high) return;",
        "  const pivotIndex = partition(arr, low, high);",
        "  quickSort(arr, low, pivotIndex - 1);",
        "  quickSort(arr, pivotIndex + 1, high);",
        "}",
      ].join("\n"),
    },
  };

  var state = {
    activeAlgorithm: "bubble",
    initialArray: [],
    array: [],
    comparisons: 0,
    swaps: 0,
    isRunning: false,
    isPaused: false,
    pendingStep: false,
    stepQueue: 0,
    shouldStop: false,
    speedValue: 50,
    delay: speedValueToDelay(50),
    compareIndices: [],
    swapIndices: [],
    sortedIndices: new Set(),
  };

  var elements = {
    barsContainer: document.getElementById("bars-container"),
    tabs: document.querySelectorAll(".tab"),
    generateButton: document.getElementById("generate-btn"),
    speedSlider: document.getElementById("speed-slider"),
    speedLabel: document.getElementById("speed-label"),
    playButton: document.getElementById("play-btn"),
    pauseButton: document.getElementById("pause-btn"),
    resetButton: document.getElementById("reset-btn"),
    stepButton: document.getElementById("step-btn"),
    comparisonsCount: document.getElementById("comparisons-count"),
    swapsCount: document.getElementById("swaps-count"),
    explanationText: document.getElementById("explanation-text"),
    guideTitle: document.getElementById("guide-title"),
    guideTheory: document.getElementById("guide-theory"),
    guideComplexity: document.getElementById("guide-complexity"),
    guideCode: document.getElementById("guide-code"),
  };

  // Initializes event listeners and renders the first random array.
  function init() {
    bindEvents();
    generateNewArray();
    updateSpeedLabel();
    updateStats();
    updateControls();
    updateAlgorithmGuide();
    explain("Choose an algorithm and press Play to watch each step.");
  }

  // Wires all control and navigation events.
  function bindEvents() {
    elements.generateButton.addEventListener("click", generateNewArray);
    elements.playButton.addEventListener("click", handlePlay);
    elements.pauseButton.addEventListener("click", handlePause);
    elements.resetButton.addEventListener("click", handleReset);
    elements.stepButton.addEventListener("click", handleStep);
    elements.speedSlider.addEventListener("input", handleSpeedChange);

    elements.tabs.forEach(function (tabButton) {
      tabButton.addEventListener("click", function () {
        var algorithmKey = tabButton.getAttribute("data-algo");
        switchAlgorithm(algorithmKey);
      });
    });
  }

  // Adds a short visual click flash to a button so clicks feel responsive.
  function flashButton(buttonElement) {
    if (!buttonElement || buttonElement.disabled) {
      return;
    }

    buttonElement.classList.add("flash-click");

    setTimeout(function () {
      buttonElement.classList.remove("flash-click");
    }, 130);
  }

  // Generates a new random array and resets current counters/highlights.
  function generateNewArray() {
    if (state.isRunning) {
      requestStop();
    }

    state.initialArray = randomArray(ARRAY_SIZE, 10, 100);
    state.array = copyArray(state.initialArray);
    resetVisualState();
    renderBars();
    explain(
      "New array generated. Press Play to start " +
        ALGORITHMS[state.activeAlgorithm].label +
        ".",
    );
  }

  // Handles algorithm tab switching without reloading the page.
  function switchAlgorithm(algorithmKey) {
    if (!ALGORITHMS[algorithmKey] || state.isRunning) {
      return;
    }

    state.activeAlgorithm = algorithmKey;
    elements.tabs.forEach(function (tabButton) {
      tabButton.classList.toggle(
        "active",
        tabButton.getAttribute("data-algo") === algorithmKey,
      );
    });

    handleReset();
    updateAlgorithmGuide();
    explain(
      ALGORITHMS[algorithmKey].label +
        " selected. Press Play or Step to begin.",
    );
  }

  // Updates the learning panel with theory and code for the active algorithm.
  function updateAlgorithmGuide() {
    var guide = ALGORITHM_GUIDES[state.activeAlgorithm];

    if (!guide) {
      return;
    }

    elements.guideTitle.textContent =
      ALGORITHMS[state.activeAlgorithm].label + " Guide";
    elements.guideTheory.textContent = guide.theory;
    elements.guideComplexity.textContent = guide.complexity;
    elements.guideCode.textContent = guide.code;
  }

  // Starts full playback or resumes if already running.
  function handlePlay() {
    flashButton(elements.playButton);

    if (state.isRunning) {
      state.isPaused = false;
      state.pendingStep = false;
      state.stepQueue = 0;
      updateControls();
      explain("Resumed " + ALGORITHMS[state.activeAlgorithm].label + ".");
      return;
    }

    runCurrentAlgorithm(false);
  }

  // Pauses the current animation.
  function handlePause() {
    if (!state.isRunning) {
      return;
    }

    flashButton(elements.pauseButton);

    state.isPaused = true;
    state.pendingStep = false;
    state.stepQueue = 0;
    updateControls();
    explain("Paused. Press Step for one operation, or Play to continue.");
  }

  // Resets current run and restores the original unsorted array.
  function handleReset() {
    flashButton(elements.resetButton);

    if (state.isRunning) {
      requestStop();
    }

    state.array = copyArray(state.initialArray);
    resetVisualState();
    renderBars();
    explain("Reset complete. The original random array is restored.");
  }

  // Advances exactly one operation while paused, or starts in step mode.
  function handleStep() {
    if (state.isRunning) {
      state.isPaused = true;
      state.pendingStep = true;
      state.stepQueue += 1;
      updateControls();
      return;
    }

    runCurrentAlgorithm(true);
  }

  // Updates delay when the speed slider value changes.
  function handleSpeedChange() {
    state.speedValue = Number(elements.speedSlider.value);
    state.delay = speedValueToDelay(state.speedValue);
    updateSpeedLabel();
  }

  // Runs the currently selected sorting algorithm with visual callbacks.
  async function runCurrentAlgorithm(startInStepMode) {
    state.isRunning = true;
    state.isPaused = Boolean(startInStepMode);
    state.pendingStep = Boolean(startInStepMode);
    state.stepQueue = startInStepMode ? 1 : 0;
    state.shouldStop = false;
    state.comparisons = 0;
    state.swaps = 0;
    state.compareIndices = [];
    state.swapIndices = [];
    state.sortedIndices.clear();
    state.array = copyArray(state.initialArray);

    updateStats();
    updateControls();
    renderBars();

    var runner = ALGORITHMS[state.activeAlgorithm].run;

    try {
      await runner(copyArray(state.array), state.delay, createCallbacks());

      for (var i = 0; i < state.array.length; i += 1) {
        state.sortedIndices.add(i);
      }

      state.compareIndices = [];
      state.swapIndices = [];
      renderBars();
      explain(
        ALGORITHMS[state.activeAlgorithm].label + " complete. Array is sorted.",
      );
    } catch (error) {
      if (!error || error.message !== STOP_ERROR_MESSAGE) {
        console.error(error);
        explain("An unexpected error occurred. Check console for details.");
      }
    } finally {
      state.isRunning = false;
      state.isPaused = false;
      state.pendingStep = false;
      state.stepQueue = 0;
      state.shouldStop = false;
      updateControls();
    }
  }

  // Creates all callbacks consumed by algorithm modules.
  function createCallbacks() {
    return {
      onCompare: onCompare,
      onSwap: onSwap,
      onSorted: onSorted,
      onExplain: explain,
      wait: waitForPlayback,
      shouldStop: function () {
        return state.shouldStop;
      },
    };
  }

  // Handles compare events by updating highlights and counters.
  async function onCompare(i, j) {
    throwIfStopped();
    state.comparisons += 1;
    state.compareIndices = [i, j];
    state.swapIndices = [];
    updateStats();
    renderBars();
  }

  // Handles swap/write events by updating array state, highlights, and counters.
  async function onSwap(i, j, updatedArray) {
    throwIfStopped();
    state.swaps += 1;
    state.swapIndices = [i, j];
    state.compareIndices = [];

    if (Array.isArray(updatedArray)) {
      state.array = copyArray(updatedArray);
    }

    updateStats();
    renderBars();
  }

  // Marks a bar as sorted and keeps it green.
  async function onSorted(i) {
    throwIfStopped();
    state.sortedIndices.add(i);
    renderBars();
  }

  // Applies pause/step behavior and timing between operations.
  async function waitForPlayback() {
    throwIfStopped();

    while (state.isPaused && state.stepQueue === 0) {
      await sleep(25);
      throwIfStopped();
    }

    if (state.stepQueue > 0) {
      state.stepQueue -= 1;
      state.pendingStep = state.stepQueue > 0;
      state.isPaused = true;
      updateControls();
    }

    await sleep(state.delay);
    throwIfStopped();
  }

  // Throws a controlled stop error if reset/new-array was requested.
  function throwIfStopped() {
    if (state.shouldStop) {
      throw new Error(STOP_ERROR_MESSAGE);
    }
  }

  // Requests current visualization to stop at next checkpoint.
  function requestStop() {
    state.shouldStop = true;
  }

  // Clears counters and color/highlight state.
  function resetVisualState() {
    state.comparisons = 0;
    state.swaps = 0;
    state.compareIndices = [];
    state.swapIndices = [];
    state.sortedIndices.clear();
    updateStats();
    updateControls();
  }

  // Re-renders all bars using current data and active color states.
  function renderBars() {
    var maxValue = Math.max.apply(null, state.array);

    // Create bars only when needed, then update existing nodes for smooth CSS transitions.
    if (elements.barsContainer.children.length !== state.array.length) {
      var fragment = document.createDocumentFragment();

      for (var barIndex = 0; barIndex < state.array.length; barIndex += 1) {
        var newBar = document.createElement("div");
        newBar.className = "bar default";

        var valueLabel = document.createElement("span");
        valueLabel.className = "bar-label";
        newBar.appendChild(valueLabel);

        fragment.appendChild(newBar);
      }

      elements.barsContainer.innerHTML = "";
      elements.barsContainer.appendChild(fragment);
    }

    var bars = elements.barsContainer.children;

    for (var i = 0; i < state.array.length; i += 1) {
      var bar = bars[i];
      var heightPercent = (state.array[i] / maxValue) * 100;
      var label = bar.querySelector(".bar-label");

      if (!label) {
        label = document.createElement("span");
        label.className = "bar-label";
        bar.appendChild(label);
      }

      bar.className = "bar " + getBarStateClass(i);
      bar.style.height = heightPercent + "%";
      bar.title = "Index " + i + ": " + state.array[i];
      bar.setAttribute("aria-label", "Index " + i + " value " + state.array[i]);
      label.textContent = String(state.array[i]);
    }
  }

  // Returns the correct CSS state class for a bar index.
  function getBarStateClass(index) {
    if (state.sortedIndices.has(index)) {
      return "sorted";
    }

    if (state.swapIndices.indexOf(index) !== -1) {
      return "swapping";
    }

    if (state.compareIndices.indexOf(index) !== -1) {
      return "comparing";
    }

    return "default";
  }

  // Updates live comparison and swap counters.
  function updateStats() {
    elements.comparisonsCount.textContent = "Comparisons: " + state.comparisons;
    elements.swapsCount.textContent = "Swaps: " + state.swaps;
  }

  // Updates the visible speed text in milliseconds.
  function updateSpeedLabel() {
    elements.speedLabel.textContent = state.delay + "ms";
  }

  // Writes current explanatory text for the learner.
  function explain(text) {
    elements.explanationText.textContent = text;
  }

  // Enables or disables controls depending on run state.
  function updateControls() {
    var running = state.isRunning;

    elements.generateButton.disabled = running;
    elements.speedSlider.disabled = state.array.length === 0;

    elements.tabs.forEach(function (tabButton) {
      tabButton.disabled = running;
    });

    elements.playButton.disabled = !running && state.array.length === 0;
    elements.pauseButton.disabled = !running;
    elements.resetButton.disabled = !running && state.array.length === 0;
    elements.stepButton.disabled = state.array.length === 0;

    // Keep mode buttons visually in sync with current playback state.
    elements.playButton.classList.toggle("is-on", running && !state.isPaused);
    elements.pauseButton.classList.toggle("is-on", running && state.isPaused);

    elements.playButton.setAttribute(
      "aria-pressed",
      String(running && !state.isPaused),
    );
    elements.pauseButton.setAttribute(
      "aria-pressed",
      String(running && state.isPaused),
    );
  }

  init();
})();
