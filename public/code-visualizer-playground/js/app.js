// Encapsulates app state/controller and avoids leaking globals.
(function () {
  if (!window.VisualizerUtils || !window.SortingAlgorithms) {
    console.error(
      "Missing required scripts: utils or algorithms did not load.",
    );
    return;
  }

  var copyArray = window.VisualizerUtils.copyArray;
  var createDescendingArray = window.VisualizerUtils.createDescendingArray;
  var createNearlySortedArray = window.VisualizerUtils.createNearlySortedArray;
  var randomArray = window.VisualizerUtils.randomArray;
  var parseNumberList = window.VisualizerUtils.parseNumberList;
  var sleep = window.VisualizerUtils.sleep;
  var speedValueToDelay = window.VisualizerUtils.speedValueToDelay;

  var STOP_ERROR_MESSAGE = "VISUALIZATION_STOPPED";
  var ARRAY_SIZE = 32;
  var MIN_ARRAY_VALUE = 10;
  var MAX_ARRAY_VALUE = 100;

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
    isComparisonMode: false,
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
    executionTime: 0,
    compareIndices: [],
    swapIndices: [],
    sortedIndices: new Set(),
  };

  var elements = {
    barsContainer: document.getElementById("bars-container"),
    mainVisualizerPanel: document.getElementById("main-visualizer-panel"),
    mainExplanationPanel: document.getElementById("main-explanation-panel"),
    mainGuidePanel: document.getElementById("main-guide-panel"),
    tabs: document.querySelectorAll(".tab"),
    generateButton: document.getElementById("generate-btn"),
    comparisonModeButton: document.getElementById("comparison-mode-btn"),
    customArrayInput: document.getElementById("custom-array-input"),
    applyArrayButton: document.getElementById("apply-array-btn"),
    reversedArrayButton: document.getElementById("reversed-array-btn"),
    nearlySortedArrayButton: document.getElementById("nearly-sorted-array-btn"),
    arrayStatus: document.getElementById("array-status"),
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
    comparisonPanel: document.getElementById("comparison-panel"),
    comparisonRunButton: document.getElementById("comparison-run-btn"),
    comparisonResetButton: document.getElementById("comparison-reset-btn"),
    comparisonLeftSelect: document.getElementById("comparison-left-select"),
    comparisonRightSelect: document.getElementById("comparison-right-select"),
    comparisonStatus: document.getElementById("comparison-status"),
    comparisonLeftTitle: document.getElementById("comparison-left-title"),
    comparisonLeftSubtitle: document.getElementById("comparison-left-subtitle"),
    comparisonLeftTime: document.getElementById("comparison-left-time"),
    comparisonLeftComparisons: document.getElementById(
      "comparison-left-comparisons",
    ),
    comparisonLeftSwaps: document.getElementById("comparison-left-swaps"),
    comparisonLeftBars: document.getElementById("comparison-left-bars"),
    comparisonRightTitle: document.getElementById("comparison-right-title"),
    comparisonRightSubtitle: document.getElementById(
      "comparison-right-subtitle",
    ),
    comparisonRightTime: document.getElementById("comparison-right-time"),
    comparisonRightComparisons: document.getElementById(
      "comparison-right-comparisons",
    ),
    comparisonRightSwaps: document.getElementById("comparison-right-swaps"),
    comparisonRightBars: document.getElementById("comparison-right-bars"),
    performanceChartCanvas: document.getElementById("performance-chart"),
    performanceSummary: document.getElementById("performance-summary"),
    quizForm: document.getElementById("quiz-form"),
    quizSubmitButton: document.getElementById("quiz-submit-btn"),
    quizScore: document.getElementById("quiz-score"),
    quizFeedback: document.getElementById("quiz-feedback"),
  };

  var comparisonState = {
    isRunning: false,
    shouldStop: false,
    left: null,
    right: null,
  };

  var performanceChart = null;
  var QUIZ_QUESTIONS = [
    {
      id: "quiz-q1",
      prompt: "What is the average-case time complexity of Bubble Sort?",
      options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
      answer: "O(n²)",
    },
    {
      id: "quiz-q2",
      prompt: "Which algorithm is stable in its standard implementation?",
      options: ["Selection Sort", "Quick Sort", "Merge Sort", "Heap Sort"],
      answer: "Merge Sort",
    },
    {
      id: "quiz-q3",
      prompt: "What is the best-case time complexity of Insertion Sort?",
      options: ["O(n)", "O(n²)", "O(log n)", "O(n log n)"],
      answer: "O(n)",
    },
    {
      id: "quiz-q4",
      prompt: "What extra space complexity does Merge Sort typically require?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      answer: "O(n)",
    },
    {
      id: "quiz-q5",
      prompt: "What is the worst-case time complexity of Quick Sort?",
      options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
      answer: "O(n²)",
    },
  ];

  // Initializes event listeners and renders the first random array.
  function init() {
    bindEvents();
    initComparisonSessions();
    initPerformanceChart();
    renderQuizForm();
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
    elements.comparisonModeButton.addEventListener(
      "click",
      handleComparisonModeToggle,
    );
    elements.comparisonRunButton.addEventListener("click", handleComparisonRun);
    elements.comparisonResetButton.addEventListener(
      "click",
      handleComparisonReset,
    );
    elements.comparisonLeftSelect.addEventListener("change", function () {
      handleComparisonSelectionChange("left");
    });
    elements.comparisonRightSelect.addEventListener("change", function () {
      handleComparisonSelectionChange("right");
    });
    elements.quizSubmitButton.addEventListener("click", handleQuizSubmit);
    elements.applyArrayButton.addEventListener("click", handleCustomArrayApply);
    elements.reversedArrayButton.addEventListener(
      "click",
      generateReversedArray,
    );
    elements.nearlySortedArrayButton.addEventListener(
      "click",
      generateNearlySortedArray,
    );
    elements.customArrayInput.addEventListener("input", handleCustomArrayInput);
    elements.customArrayInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        handleCustomArrayApply();
      }
    });
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

  // Creates the paired visualizer sessions used by comparison mode.
  function initComparisonSessions() {
    comparisonState.left = createComparisonSession(
      "left",
      elements.comparisonLeftSelect,
      elements.comparisonLeftTitle,
      elements.comparisonLeftSubtitle,
      elements.comparisonLeftTime,
      elements.comparisonLeftComparisons,
      elements.comparisonLeftSwaps,
      elements.comparisonLeftBars,
    );
    comparisonState.right = createComparisonSession(
      "right",
      elements.comparisonRightSelect,
      elements.comparisonRightTitle,
      elements.comparisonRightSubtitle,
      elements.comparisonRightTime,
      elements.comparisonRightComparisons,
      elements.comparisonRightSwaps,
      elements.comparisonRightBars,
    );

    elements.comparisonLeftSelect.value = "bubble";
    elements.comparisonRightSelect.value = "quick";
    refreshComparisonPreview();
    updateComparisonModeUI();
  }

  // Builds a single comparison session with its own state and DOM bindings.
  function createComparisonSession(
    side,
    selectElement,
    titleElement,
    subtitleElement,
    timeElement,
    comparisonsElement,
    swapsElement,
    barsContainer,
  ) {
    return {
      side: side,
      selectElement: selectElement,
      titleElement: titleElement,
      subtitleElement: subtitleElement,
      timeElement: timeElement,
      comparisonsElement: comparisonsElement,
      swapsElement: swapsElement,
      barsContainer: barsContainer,
      array: [],
      initialArray: [],
      comparisons: 0,
      swaps: 0,
      compareIndices: [],
      swapIndices: [],
      sortedIndices: new Set(),
      algorithmKey: selectElement ? selectElement.value : "bubble",
      isRunning: false,
      shouldStop: false,
      elapsedTime: 0,
    };
  }

  // Flips comparison mode on or off and updates the visible layout.
  function handleComparisonModeToggle() {
    setComparisonMode(!state.isComparisonMode);
  }

  // Changes between the single and comparison layouts.
  function setComparisonMode(enabled) {
    state.isComparisonMode = Boolean(enabled);

    if (state.isComparisonMode && !state.initialArray.length) {
      generateNewArray();
    }

    updateComparisonModeUI();
    refreshComparisonPreview();
    updateControls();
  }

  // Shows or hides the single-view and comparison-view panels.
  function updateComparisonModeUI() {
    var enabled = state.isComparisonMode;

    elements.comparisonModeButton.classList.toggle("is-on", enabled);
    elements.comparisonModeButton.setAttribute("aria-pressed", String(enabled));
    elements.comparisonModeButton.textContent = enabled
      ? "Exit Comparison Mode"
      : "Enable Comparison Mode";

    if (elements.comparisonPanel) {
      elements.comparisonPanel.hidden = !enabled;
    }

    if (elements.mainVisualizerPanel) {
      elements.mainVisualizerPanel.hidden = enabled;
    }

    if (elements.mainExplanationPanel) {
      elements.mainExplanationPanel.hidden = enabled;
    }

    if (elements.mainGuidePanel) {
      elements.mainGuidePanel.hidden = enabled;
    }
  }

  // Keeps comparison preview cards aligned with the current array and selections.
  function refreshComparisonPreview(updateStatus) {
    if (!comparisonState.left || !comparisonState.right) {
      return;
    }

    syncComparisonSession(comparisonState.left, state.initialArray);
    syncComparisonSession(comparisonState.right, state.initialArray);
    renderComparisonSession(comparisonState.left);
    renderComparisonSession(comparisonState.right);

    if (updateStatus !== false && elements.comparisonStatus) {
      elements.comparisonStatus.textContent =
        "Comparison preview ready. Choose two algorithms and press Run Comparison.";
      elements.comparisonStatus.classList.remove("is-error");
    }
  }

  // Responds when one of the comparison algorithm selectors changes.
  function handleComparisonSelectionChange(side) {
    var session =
      side === "left" ? comparisonState.left : comparisonState.right;

    if (!session || !session.selectElement) {
      return;
    }

    session.algorithmKey = session.selectElement.value;
    refreshComparisonPreview();
  }

  // Applies the current baseline array to one comparison session.
  function syncComparisonSession(session, sourceArray) {
    var values = Array.isArray(sourceArray) ? copyArray(sourceArray) : [];

    session.initialArray = copyArray(values);
    session.array = copyArray(values);
    session.comparisons = 0;
    session.swaps = 0;
    session.compareIndices = [];
    session.swapIndices = [];
    session.sortedIndices = new Set();
    session.elapsedTime = 0;
    session.shouldStop = false;
    session.isRunning = false;
    session.algorithmKey = session.selectElement
      ? session.selectElement.value
      : session.algorithmKey;

    updateComparisonSessionLabels(session);
    updateComparisonSessionStats(session);
  }

  // Updates the visible titles and subtitles for a comparison session.
  function updateComparisonSessionLabels(session) {
    var algorithm = ALGORITHMS[session.algorithmKey];

    if (session.titleElement) {
      session.titleElement.textContent = algorithm
        ? algorithm.label
        : "Unknown Algorithm";
    }

    if (session.subtitleElement) {
      session.subtitleElement.textContent =
        session.side === "left" ? "Left visualizer" : "Right visualizer";
    }

    if (session.timeElement) {
      session.timeElement.textContent = "Time: 0ms";
    }
  }

  // Updates the counters for a comparison session.
  function updateComparisonSessionStats(session) {
    if (session.comparisonsElement) {
      session.comparisonsElement.textContent =
        "Comparisons: " + session.comparisons;
    }

    if (session.swapsElement) {
      session.swapsElement.textContent = "Swaps: " + session.swaps;
    }

    if (session.timeElement) {
      session.timeElement.textContent =
        "Time: " + Math.round(session.elapsedTime) + "ms";
    }
  }

  // Runs the currently selected comparison pair on the active array.
  async function handleComparisonRun() {
    if (comparisonState.isRunning) {
      return;
    }

    if (!state.initialArray.length) {
      generateNewArray();
    }

    if (!comparisonState.left || !comparisonState.right) {
      initComparisonSessions();
    }

    comparisonState.shouldStop = false;
    comparisonState.isRunning = true;
    updateControls();

    var sourceArray = copyArray(state.initialArray);
    syncComparisonSession(comparisonState.left, sourceArray);
    syncComparisonSession(comparisonState.right, sourceArray);
    renderComparisonSession(comparisonState.left);
    renderComparisonSession(comparisonState.right);

    setComparisonStatus(
      "Running " +
        ALGORITHMS[comparisonState.left.algorithmKey].label +
        " vs " +
        ALGORITHMS[comparisonState.right.algorithmKey].label +
        ".",
      false,
    );

    try {
      await Promise.all([
        runComparisonSession(comparisonState.left),
        runComparisonSession(comparisonState.right),
      ]);

      updatePerformanceChart([
        {
          label: ALGORITHMS[comparisonState.left.algorithmKey].label,
          comparisons: comparisonState.left.comparisons,
          swaps: comparisonState.left.swaps,
          time: comparisonState.left.elapsedTime,
        },
        {
          label: ALGORITHMS[comparisonState.right.algorithmKey].label,
          comparisons: comparisonState.right.comparisons,
          swaps: comparisonState.right.swaps,
          time: comparisonState.right.elapsedTime,
        },
      ]);

      setComparisonStatus(
        buildComparisonResultMessage(
          comparisonState.left,
          comparisonState.right,
        ),
        false,
      );
    } catch (error) {
      if (!error || error.message !== STOP_ERROR_MESSAGE) {
        console.error(error);
        setComparisonStatus(
          "An unexpected error occurred during comparison. Check the console.",
          true,
        );
      }
    } finally {
      comparisonState.isRunning = false;
      if (comparisonState.shouldStop) {
        setComparisonStatus(
          "Comparison reset. Press Run Comparison to try again.",
          false,
        );
      }

      comparisonState.shouldStop = false;
      updateControls();
      refreshComparisonPreview(false);
    }
  }

  // Stops an in-flight comparison run and restores the preview state.
  function handleComparisonReset() {
    comparisonState.shouldStop = true;

    if (!comparisonState.isRunning) {
      refreshComparisonPreview(false);
      setComparisonStatus(
        "Comparison reset. Press Run Comparison to try again.",
        false,
      );
      updateControls();
    } else {
      setComparisonStatus("Stopping comparison run...", false);
    }
  }

  // Builds a short end-of-run summary with the elapsed times and counters.
  function buildComparisonResultMessage(leftSession, rightSession) {
    var leftLabel = ALGORITHMS[leftSession.algorithmKey].label;
    var rightLabel = ALGORITHMS[rightSession.algorithmKey].label;

    return (
      leftLabel +
      ": " +
      Math.round(leftSession.elapsedTime) +
      "ms, " +
      rightLabel +
      ": " +
      Math.round(rightSession.elapsedTime) +
      "ms."
    );
  }

  // Writes status text for the comparison panel.
  function setComparisonStatus(text, isError) {
    if (!elements.comparisonStatus) {
      return;
    }

    elements.comparisonStatus.textContent = text;
    elements.comparisonStatus.classList.toggle("is-error", Boolean(isError));
  }

  // Runs one comparison session with its own counters and timing.
  async function runComparisonSession(session) {
    var runner =
      ALGORITHMS[session.algorithmKey] && ALGORITHMS[session.algorithmKey].run;

    if (typeof runner !== "function") {
      throw new Error(
        "Unsupported comparison algorithm: " + session.algorithmKey,
      );
    }

    session.isRunning = true;
    session.shouldStop = false;
    session.elapsedTime = 0;
    updateComparisonSessionLabels(session);
    updateComparisonSessionStats(session);

    var startedAt = performance.now();

    try {
      await runner(
        copyArray(session.array),
        state.delay,
        createComparisonCallbacks(session),
      );
      markComparisonSessionComplete(session);
    } finally {
      session.elapsedTime = performance.now() - startedAt;
      session.isRunning = false;
      updateComparisonSessionStats(session);
      renderComparisonSession(session);
    }
  }

  // Marks every item as sorted after the comparison run completes.
  function markComparisonSessionComplete(session) {
    for (var i = 0; i < session.array.length; i += 1) {
      session.sortedIndices.add(i);
    }

    session.compareIndices = [];
    session.swapIndices = [];
  }

  // Builds the algorithm callbacks used by each comparison session.
  function createComparisonCallbacks(session) {
    return {
      onCompare: function (i, j) {
        return comparisonOnCompare(session, i, j);
      },
      onSwap: function (i, j, updatedArray) {
        return comparisonOnSwap(session, i, j, updatedArray);
      },
      onSorted: function (i) {
        return comparisonOnSorted(session, i);
      },
      onExplain: function () {},
      wait: function () {
        return comparisonWaitForPlayback(session);
      },
      shouldStop: function () {
        return comparisonState.shouldStop || session.shouldStop;
      },
    };
  }

  // Handles compare events for one comparison session.
  async function comparisonOnCompare(session, i, j) {
    throwIfComparisonStopped();
    session.comparisons += 1;
    session.compareIndices = [i, j];
    session.swapIndices = [];
    updateComparisonSessionStats(session);
    renderComparisonSession(session);
  }

  // Handles swap/write events for one comparison session.
  async function comparisonOnSwap(session, i, j, updatedArray) {
    throwIfComparisonStopped();
    session.swaps += 1;
    session.swapIndices = [i, j];
    session.compareIndices = [];

    if (Array.isArray(updatedArray)) {
      session.array = copyArray(updatedArray);
    }

    updateComparisonSessionStats(session);
    renderComparisonSession(session);
  }

  // Marks a bar as sorted in one comparison session.
  async function comparisonOnSorted(session, i) {
    throwIfComparisonStopped();
    session.sortedIndices.add(i);
    renderComparisonSession(session);
  }

  // Applies the shared animation pacing to comparison mode.
  async function comparisonWaitForPlayback() {
    throwIfComparisonStopped();
    await sleep(state.delay);
    throwIfComparisonStopped();
  }

  // Throws when the comparison run has been interrupted.
  function throwIfComparisonStopped() {
    if (comparisonState.shouldStop) {
      throw new Error(STOP_ERROR_MESSAGE);
    }
  }

  // Renders the bars for one comparison session.
  function renderComparisonSession(session) {
    var container = session.barsContainer;

    if (!container) {
      return;
    }

    if (!session.array.length) {
      container.innerHTML = "";
      return;
    }

    var maxValue = Math.max.apply(null, session.array);
    var safeMaxValue = maxValue <= 0 ? 1 : maxValue;

    if (container.children.length !== session.array.length) {
      var fragment = document.createDocumentFragment();

      for (var i = 0; i < session.array.length; i += 1) {
        var bar = document.createElement("div");
        bar.className = "bar default";

        var label = document.createElement("span");
        label.className = "bar-label";
        bar.appendChild(label);

        fragment.appendChild(bar);
      }

      container.innerHTML = "";
      container.appendChild(fragment);
    }

    var bars = container.children;

    for (var index = 0; index < session.array.length; index += 1) {
      var currentBar = bars[index];
      var currentLabel = currentBar.querySelector(".bar-label");

      if (!currentLabel) {
        currentLabel = document.createElement("span");
        currentLabel.className = "bar-label";
        currentBar.appendChild(currentLabel);
      }

      currentBar.className =
        "bar " + getComparisonBarStateClass(session, index);
      currentBar.style.height =
        (Math.max(0, session.array[index]) / safeMaxValue) * 100 + "%";
      currentBar.title = "Index " + index + ": " + session.array[index];
      currentBar.setAttribute(
        "aria-label",
        "Index " + index + " value " + session.array[index],
      );
      currentLabel.textContent = String(session.array[index]);
    }
  }

  // Returns the correct state class for a comparison session bar.
  function getComparisonBarStateClass(session, index) {
    if (session.sortedIndices.has(index)) {
      return "sorted";
    }

    if (session.swapIndices.indexOf(index) !== -1) {
      return "swapping";
    }

    if (session.compareIndices.indexOf(index) !== -1) {
      return "comparing";
    }

    return "default";
  }

  // Initializes the Chart.js bar chart used for completed-run metrics.
  function initPerformanceChart() {
    if (
      !elements.performanceChartCanvas ||
      typeof window.Chart !== "function"
    ) {
      if (elements.performanceSummary) {
        elements.performanceSummary.textContent =
          "Chart.js is unavailable, so performance metrics are shown in the counters only.";
      }

      return;
    }

    performanceChart = new window.Chart(elements.performanceChartCanvas, {
      type: "bar",
      data: {
        labels: ["Comparisons", "Swaps", "Time (ms)"],
        datasets: [],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#e6edf9",
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: "#9fb0d5",
            },
            grid: {
              color: "rgba(148, 163, 184, 0.14)",
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: "#9fb0d5",
            },
            grid: {
              color: "rgba(148, 163, 184, 0.14)",
            },
          },
        },
      },
    });
  }

  // Updates the chart with the latest completed run metrics.
  function updatePerformanceChart(runs) {
    if (!performanceChart) {
      return;
    }

    var colors = [
      { fill: "rgba(45, 212, 191, 0.75)", border: "rgba(45, 212, 191, 1)" },
      { fill: "rgba(14, 165, 233, 0.75)", border: "rgba(14, 165, 233, 1)" },
    ];

    performanceChart.data.datasets = runs.map(function (run, index) {
      var palette = colors[index % colors.length];

      return {
        label: run.label,
        data: [run.comparisons, run.swaps, Math.round(run.time)],
        backgroundColor: [palette.fill, palette.fill, palette.fill],
        borderColor: [palette.border, palette.border, palette.border],
        borderWidth: 1,
      };
    });

    performanceChart.update();

    if (elements.performanceSummary) {
      elements.performanceSummary.textContent =
        runs.length === 1
          ? runs[0].label +
            " finished with " +
            runs[0].comparisons +
            " comparisons, " +
            runs[0].swaps +
            " swaps, and " +
            Math.round(runs[0].time) +
            "ms."
          : "Comparison chart updated with the latest run metrics.";
    }
  }

  // Renders the quiz questions into the quiz form.
  function renderQuizForm() {
    if (!elements.quizForm) {
      return;
    }

    var markup = [];

    for (var i = 0; i < QUIZ_QUESTIONS.length; i += 1) {
      var question = QUIZ_QUESTIONS[i];
      var fieldsetMarkup = [
        '<fieldset class="quiz-card">',
        "<h3>" + (i + 1) + ". " + question.prompt + "</h3>",
        '<div class="quiz-options">',
      ];

      for (var j = 0; j < question.options.length; j += 1) {
        var option = question.options[j];
        var optionId = question.id + "-" + j;

        fieldsetMarkup.push(
          '<label class="quiz-option" for="' +
            optionId +
            '">' +
            '<input type="radio" id="' +
            optionId +
            '" name="' +
            question.id +
            '" value="' +
            option +
            '" />' +
            "<span>" +
            option +
            "</span>" +
            "</label>",
        );
      }

      fieldsetMarkup.push("</div></fieldset>");
      markup.push(fieldsetMarkup.join(""));
    }

    elements.quizForm.innerHTML = markup.join("");
    setQuizFeedback(
      "Answer all five questions and submit to see your score.",
      false,
    );
    if (elements.quizScore) {
      elements.quizScore.textContent = "Score: 0/5";
    }
  }

  // Scores the selected quiz answers and updates the feedback text.
  function handleQuizSubmit() {
    if (!elements.quizForm) {
      return;
    }

    var score = 0;
    var unanswered = 0;

    for (var i = 0; i < QUIZ_QUESTIONS.length; i += 1) {
      var question = QUIZ_QUESTIONS[i];
      var selected = elements.quizForm.querySelector(
        'input[name="' + question.id + '"]:checked',
      );

      if (!selected) {
        unanswered += 1;
        continue;
      }

      if (selected.value === question.answer) {
        score += 1;
      }
    }

    if (elements.quizScore) {
      elements.quizScore.textContent =
        "Score: " + score + "/" + QUIZ_QUESTIONS.length;
    }

    if (unanswered > 0) {
      setQuizFeedback(
        "You left " +
          unanswered +
          " question" +
          (unanswered === 1 ? "" : "s") +
          " unanswered.",
        true,
      );
      return;
    }

    setQuizFeedback(
      "Quiz complete. You scored " +
        score +
        " out of " +
        QUIZ_QUESTIONS.length +
        ".",
      score < QUIZ_QUESTIONS.length,
    );
  }

  // Writes the quiz feedback message.
  function setQuizFeedback(text, isError) {
    if (!elements.quizFeedback) {
      return;
    }

    elements.quizFeedback.textContent = text;
    elements.quizFeedback.classList.toggle("is-error", Boolean(isError));
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
    loadArray(
      randomArray(ARRAY_SIZE, MIN_ARRAY_VALUE, MAX_ARRAY_VALUE),
      "Random array generated. Press Play to start " +
        ALGORITHMS[state.activeAlgorithm].label +
        ".",
      true,
    );
  }

  // Generates a reversed array for worst-case demonstrations.
  function generateReversedArray() {
    loadArray(
      createDescendingArray(ARRAY_SIZE, MIN_ARRAY_VALUE, MAX_ARRAY_VALUE),
      "Reversed array generated. Use it to compare algorithm behavior.",
      true,
    );
  }

  // Generates a nearly sorted array with a few local swaps.
  function generateNearlySortedArray() {
    loadArray(
      createNearlySortedArray(ARRAY_SIZE, MIN_ARRAY_VALUE, MAX_ARRAY_VALUE),
      "Nearly sorted array generated. This is useful for best-case demos.",
      true,
    );
  }

  // Parses and applies a custom comma-separated array from the text input.
  function handleCustomArrayApply() {
    applyCustomArrayFromInput();
  }

  // Keeps the status text in sync as the custom array input changes.
  function handleCustomArrayInput() {
    var parsed = parseNumberList(elements.customArrayInput.value);

    if (parsed.valid) {
      setArrayStatus(
        "Custom array looks valid. It is applied automatically while you type.",
        false,
      );
      loadArray(
        parsed.values,
        "Custom array updated from the input field.",
        false,
      );
      return;
    }

    setArrayStatus(parsed.message, true);
  }

  // Parses the input field and commits the array if the values are valid.
  function applyCustomArrayFromInput() {
    var parsed = parseNumberList(elements.customArrayInput.value);

    if (!parsed.valid) {
      setArrayStatus(parsed.message, true);
      return;
    }

    loadArray(
      parsed.values,
      "Custom array applied. Press Play to sort it.",
      false,
    );
  }

  // Commits a new array to both the rendered state and the reset baseline.
  function loadArray(values, message, syncInput) {
    if (state.isRunning) {
      requestStop();
    }

    state.initialArray = copyArray(values);
    state.array = copyArray(values);
    resetVisualState();

    if (syncInput) {
      elements.customArrayInput.value = values.join(", ");
    }

    renderBars();
    setArrayStatus(message, false);
    refreshComparisonPreview(false);
  }

  // Updates the visible status text for custom array operations.
  function setArrayStatus(text, isError) {
    if (!elements.arrayStatus) {
      return;
    }

    elements.arrayStatus.textContent = text;
    elements.arrayStatus.classList.toggle("is-error", Boolean(isError));
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
    elements.customArrayInput.value = state.initialArray.join(", ");
    setArrayStatus("Reset complete. The current array is restored.", false);
    explain("Reset complete. The current array is restored.");
    refreshComparisonPreview(false);
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
    state.executionTime = 0;
    state.compareIndices = [];
    state.swapIndices = [];
    state.sortedIndices.clear();
    state.array = copyArray(state.initialArray);

    updateStats();
    updateControls();
    renderBars();

    var runner = ALGORITHMS[state.activeAlgorithm].run;
    var startedAt = performance.now();

    try {
      await runner(copyArray(state.array), state.delay, createCallbacks());
      state.executionTime = performance.now() - startedAt;

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

      if (state.executionTime > 0) {
        updatePerformanceChart([
          {
            label: ALGORITHMS[state.activeAlgorithm].label,
            comparisons: state.comparisons,
            swaps: state.swaps,
            time: state.executionTime,
          },
        ]);
      }
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
    var safeMaxValue = maxValue <= 0 ? 1 : maxValue;

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
      var normalizedValue = Math.max(0, state.array[i]);
      var heightPercent = (normalizedValue / safeMaxValue) * 100;
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
    var running = state.isRunning || comparisonState.isRunning;
    var comparisonActive = state.isComparisonMode;

    elements.generateButton.disabled = running;
    elements.customArrayInput.disabled = running;
    elements.applyArrayButton.disabled = running;
    elements.reversedArrayButton.disabled = running;
    elements.nearlySortedArrayButton.disabled = running;
    elements.speedSlider.disabled = state.array.length === 0;
    elements.comparisonModeButton.disabled = running;

    if (elements.comparisonRunButton) {
      elements.comparisonRunButton.disabled =
        !comparisonActive || running || !state.initialArray.length;
    }

    if (elements.comparisonResetButton) {
      elements.comparisonResetButton.disabled =
        !comparisonActive || !state.initialArray.length;
    }

    if (elements.comparisonLeftSelect) {
      elements.comparisonLeftSelect.disabled = !comparisonActive || running;
    }

    if (elements.comparisonRightSelect) {
      elements.comparisonRightSelect.disabled = !comparisonActive || running;
    }

    elements.tabs.forEach(function (tabButton) {
      tabButton.disabled = running || comparisonActive;
    });

    elements.playButton.disabled =
      comparisonActive || (!running && state.array.length === 0);
    elements.pauseButton.disabled = comparisonActive || !running;
    elements.resetButton.disabled =
      comparisonActive || (!running && state.array.length === 0);
    elements.stepButton.disabled = comparisonActive || state.array.length === 0;

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
