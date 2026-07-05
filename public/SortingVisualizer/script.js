// ===== Algorithm Info Data =====
const ALGORITHM_INFO = {
  bubble: {
    name: "Bubble Sort",
    bestCase: "O(n)",
    averageCase: "O(n²)",
    worstCase: "O(n²)",
    space: "O(1)",
    stable: "Yes",
    inplace: "Yes",
    description:
      "Bubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.",
    applications:
      "Educational purposes, small datasets, checking if array is already sorted.",
    pseudocode: [
      "for i from 0 to n-2",
      "  for j from 0 to n-i-2",
      "    if array[j] > array[j+1]",
      "      swap(array[j], array[j+1])",
      "  mark position n-i-1 as sorted",
    ],
    education: {
      how:
        "Bubble Sort works by repeatedly swapping adjacent elements if they are in wrong order. The largest unsorted element 'bubbles up' to its correct position in each pass.",
      advantages: [
        "Simple to understand and implement",
        "Stable sorting algorithm",
        "In-place sorting algorithm",
        "Minimal auxiliary space required",
      ],
      disadvantages: [
        "Very inefficient for large datasets",
        "Quadratic time complexity",
        "Generally slow compared to other algorithms",
      ],
      when:
        "Use for educational purposes, very small datasets, or when you need a simple in-place stable sort.",
    },
  },
  selection: {
    name: "Selection Sort",
    bestCase: "O(n²)",
    averageCase: "O(n²)",
    worstCase: "O(n²)",
    space: "O(1)",
    stable: "No",
    inplace: "Yes",
    description:
      "Selection Sort divides the array into sorted and unsorted regions, repeatedly selecting the smallest element from the unsorted region.",
    applications:
      "Educational purposes, small datasets, when number of writes is a concern.",
    pseudocode: [
      "for i from 0 to n-2",
      "  minIndex = i",
      "  for j from i+1 to n-1",
      "    if array[j] < array[minIndex]",
      "      minIndex = j",
      "  if minIndex != i",
      "    swap(array[i], array[minIndex])",
    ],
    education: {
      how:
        "Selection Sort divides the input list into sorted and unsorted parts, repeatedly selecting the smallest element from the unsorted part and adding it to the sorted part.",
      advantages: [
        "Simple to implement",
        "Good for small datasets",
        "In-place sorting algorithm",
        "Minimal number of swaps",
      ],
      disadvantages: [
        "Quadratic time complexity",
        "Not stable",
        "Inefficient for large datasets",
      ],
      when:
        "Use when you need to minimize the number of swaps, or for small datasets where simplicity is a priority.",
    },
  },
  insertion: {
    name: "Insertion Sort",
    bestCase: "O(n)",
    averageCase: "O(n²)",
    worstCase: "O(n²)",
    space: "O(1)",
    stable: "Yes",
    inplace: "Yes",
    description:
      "Insertion Sort builds the final sorted array one item at a time, inserting each new element into its correct position.",
    applications:
      "Small datasets, nearly sorted arrays, online sorting, educational purposes.",
    pseudocode: [
      "for i from 1 to n-1",
      "  key = array[i]",
      "  j = i - 1",
      "  while j >= 0 and array[j] > key",
      "    array[j+1] = array[j]",
      "    j = j - 1",
      "  array[j+1] = key",
    ],
    education: {
      how:
        "Insertion Sort iterates through the elements, taking each element and inserting it into its correct position in the already-sorted part of the array.",
      advantages: [
        "Efficient for small arrays",
        "Efficient on nearly sorted arrays",
        "Stable sorting algorithm",
        "In-place sorting algorithm",
        "Adaptive sorting algorithm",
      ],
      disadvantages: [
        "Quadratic time complexity",
        "Inefficient on large datasets",
      ],
      when:
        "Use for small datasets or when the input is already mostly sorted. Great for learning about sorting algorithms.",
    },
  },
  merge: {
    name: "Merge Sort",
    bestCase: "O(n log n)",
    averageCase: "O(n log n)",
    worstCase: "O(n log n)",
    space: "O(n)",
    stable: "Yes",
    inplace: "No",
    description:
      "Merge Sort is a divide-and-conquer algorithm that splits the array into halves, sorts them, and then merges them back together.",
    applications:
      "Sorting linked lists, external sorting (large files), when stability is required.",
    pseudocode: [
      "function mergeSort(array, start, end)",
      "  if start >= end return",
      "  mid = floor((start+end)/2)",
      "  mergeSort(array, start, mid)",
      "  mergeSort(array, mid+1, end)",
      "  merge(array, start, mid, end)",
    ],
    education: {
      how:
        "Merge Sort works by recursively splitting the array into halves until we get subarrays of size 1, then merging them back together in sorted order.",
      advantages: [
        "Guaranteed O(n log n) time",
        "Stable sorting algorithm",
        "Efficient for large datasets",
        "Parallelizable",
      ],
      disadvantages: [
        "Requires O(n) auxiliary space",
        "Slower for small datasets compared to quadratic sorts",
        "Not in-place",
      ],
      when:
        "Use when stability is needed, or when you need guaranteed O(n log n) time complexity. Great for linked lists!",
    },
  },
  quick: {
    name: "Quick Sort",
    bestCase: "O(n log n)",
    averageCase: "O(n log n)",
    worstCase: "O(n²)",
    space: "O(log n)",
    stable: "No",
    inplace: "Yes",
    description:
      "Quick Sort is a divide-and-conquer algorithm that picks a pivot and partitions the array around the pivot.",
    applications:
      "General purpose sorting, in-memory sorting, most built-in sort functions.",
    pseudocode: [
      "function quickSort(array, start, end)",
      "  if start >= end return",
      "  pivotIndex = partition(array, start, end)",
      "  quickSort(array, start, pivotIndex-1)",
      "  quickSort(array, pivotIndex+1, end)",
    ],
    education: {
      how:
        "Quick Sort picks a pivot element, partitions the array into elements less than, equal to, and greater than the pivot, then recursively sorts those partitions.",
      advantages: [
        "Average case O(n log n)",
        "In-place sorting algorithm",
        "Very efficient in practice",
        "Good cache locality",
      ],
      disadvantages: [
        "Worst case O(n²)",
        "Not stable",
        "Performance depends heavily on pivot selection",
      ],
      when:
        "Use for general purpose sorting when you need a fast, in-place sort. This is the algorithm behind many standard library sort functions!",
    },
  },
  heap: {
    name: "Heap Sort",
    bestCase: "O(n log n)",
    averageCase: "O(n log n)",
    worstCase: "O(n log n)",
    space: "O(1)",
    stable: "No",
    inplace: "Yes",
    description:
      "Heap Sort converts the array into a max-heap, then repeatedly extracts the maximum element to build the sorted array.",
    applications:
      "Priority queues, when constant auxiliary space is required.",
    pseudocode: [
      "function heapSort(array)",
      "  buildMaxHeap(array)",
      "  for i from n-1 downto 1",
      "    swap(array[0], array[i])",
      "    heapify(array, 0, i)",
    ],
    education: {
      how:
        "Heap Sort first converts the array into a max-heap, then repeatedly extracts the maximum element and heapifies the remaining array to maintain the heap property.",
      advantages: [
        "Guaranteed O(n log n)",
        "In-place sorting algorithm",
        "Good for real-time systems",
      ],
      disadvantages: [
        "Not stable",
        "Poor cache performance",
        "Slower than Quick Sort in practice",
      ],
      when:
        "Use when you need guaranteed O(n log n) time complexity and O(1) auxiliary space.",
    },
  },
};

// ===== State =====
let array = [];
let bars = [];
let isSorting = false;
let isPaused = false;
let stopRequested = false;
let comparisons = 0;
let swaps = 0;
let arrayReads = 0;
let arrayWrites = 0;
let currentPass = 0;
let totalOps = 0;
let startTime = 0;
let timerInterval = null;
let isMuted = false;
let audioContext = null;

// ===== DOM References =====
const visualizer = document.getElementById("visualizer");
const algorithmSelect = document.getElementById("algorithm-select");
const patternSelect = document.getElementById("pattern-select");
const sizeSlider = document.getElementById("size-slider");
const speedSlider = document.getElementById("speed-slider");
const themeSelect = document.getElementById("theme-select");
const sizeValue = document.getElementById("size-value");
const speedValue = document.getElementById("speed-value");
const newArrayBtn = document.getElementById("new-array-btn");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const muteBtn = document.getElementById("mute-btn");
const comparisonsValue = document.getElementById("comparisons-value");
const swapsValue = document.getElementById("swaps-value");
const readsValue = document.getElementById("reads-value");
const writesValue = document.getElementById("writes-value");
const passValue = document.getElementById("pass-value");
const timeValue = document.getElementById("time-value");
const speedDisplay = document.getElementById("speed-display");
const opsValue = document.getElementById("ops-value");
const statusValue = document.getElementById("status-value");

// Algorithm Info
const algoName = document.getElementById("algo-name");
const algoBest = document.getElementById("algo-best");
const algoAverage = document.getElementById("algo-average");
const algoWorst = document.getElementById("algo-worst");
const algoSpace = document.getElementById("algo-space");
const algoStable = document.getElementById("algo-stable");
const algoInplace = document.getElementById("algo-inplace");
const algoDesc = document.getElementById("algo-desc");
const algoApplications = document.getElementById("algo-applications");

// Pseudocode
const pseudocodeEl = document.getElementById("pseudocode");

// Explanation
const explanationText = document.getElementById("explanation-text");

// Education
const eduHow = document.getElementById("edu-how");
const eduAdvantages = document.getElementById("edu-advantages");
const eduDisadvantages = document.getElementById("edu-disadvantages");
const eduWhen = document.getElementById("edu-when");

// Summary Modal
const summaryModal = document.getElementById("summary-modal");
const modalClose = document.getElementById("modal-close");
const sumAlgo = document.getElementById("sum-algo");
const sumSize = document.getElementById("sum-size");
const sumComp = document.getElementById("sum-comp");
const sumSwaps = document.getElementById("sum-swaps");
const sumTime = document.getElementById("sum-time");
const sumComplexity = document.getElementById("sum-complexity");
const sumRating = document.getElementById("sum-rating");
const sumNewArray = document.getElementById("sum-new-array");
const sumRunAgain = document.getElementById("sum-run-again");

// ===== Helpers =====
function getDelay() {
  const speed = Number(speedSlider.value);
  return Math.max(600 - speed * 58, 5);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkControl() {
  while (isPaused) {
    await sleep(80);
  }
  if (stopRequested) {
    throw new Error("SORT_STOPPED");
  }
}

// ===== Pattern Generators =====
function randomArray(size) {
  const arr = [];
  for (let i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * 280) + 10);
  }
  return arr;
}

function nearlySortedArray(size) {
  const arr = [];
  for (let i = 0; i < size; i++) {
    arr.push(i * (280 / size) + 10);
  }
  // Swap a few random pairs
  for (let i = 0; i < Math.max(3, Math.floor(size * 0.1)); i++) {
    const idx1 = Math.floor(Math.random() * size);
    const idx2 = Math.floor(Math.random() * size);
    [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
  }
  return arr;
}

function reverseSortedArray(size) {
  const arr = [];
  for (let i = size - 1; i >= 0; i--) {
    arr.push(i * (280 / size) + 10);
  }
  return arr;
}

function fewUniqueArray(size) {
  const arr = [];
  const uniqueVals = [50, 100, 150, 200, 250];
  for (let i = 0; i < size; i++) {
    arr.push(uniqueVals[Math.floor(Math.random() * uniqueVals.length)]);
  }
  return arr;
}

function mountainArray(size) {
  const arr = [];
  const mid = Math.floor(size / 2);
  for (let i = 0; i < mid; i++) {
    arr.push(i * (280 / mid) + 10);
  }
  for (let i = mid; i < size; i++) {
    arr.push((size - i - 1) * (280 / mid) + 10);
  }
  return arr;
}

function valleyArray(size) {
  const arr = [];
  const mid = Math.floor(size / 2);
  for (let i = 0; i < mid; i++) {
    arr.push((mid - i) * (280 / mid) + 10);
  }
  for (let i = mid; i < size; i++) {
    arr.push((i - mid) * (280 / mid) + 10);
  }
  return arr;
}

function waveArray(size) {
  const arr = [];
  for (let i = 0; i < size; i++) {
    const base = (i / size) * 280;
    arr.push(base + Math.sin((i / size) * Math.PI * 4) * 50 + 10);
  }
  return arr;
}

const PATTERNS = {
  random: randomArray,
  nearlySorted: nearlySortedArray,
  reverseSorted: reverseSortedArray,
  fewUnique: fewUniqueArray,
  mountain: mountainArray,
  valley: valleyArray,
  wave: waveArray,
};

// ===== Rendering =====
function renderBars() {
  visualizer.innerHTML = "";
  bars = [];
  const containerHeight = visualizer.clientHeight - 24;
  array.forEach((value) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    const heightPx = Math.max((value / 290) * containerHeight, 2);
    bar.style.height = `${heightPx}px`;
    visualizer.appendChild(bar);
    bars.push(bar);
  });
}

function setBarState(index, state) {
  if (bars[index]) {
    bars[index].className = `bar ${state}`;
  }
}

function clearBarState(index) {
  if (bars[index]) {
    bars[index].className = "bar";
  }
}

function markSorted(index) {
  if (bars[index]) {
    bars[index].className = "bar sorted";
  }
}

function updateBarHeight(index, value) {
  if (bars[index]) {
    const containerHeight = visualizer.clientHeight - 24;
    const heightPx = Math.max((value / 290) * containerHeight, 2);
    bars[index].style.height = `${heightPx}px`;
  }
}

// ===== Stats =====
function incrementComparisons(n = 1) {
  comparisons += n;
  arrayReads += 2;
  totalOps += n;
  updateStats();
}

function incrementSwaps(n = 1) {
  swaps += n;
  arrayWrites += n * 2;
  totalOps += n;
  updateStats();
}

function updateStats() {
  comparisonsValue.textContent = comparisons;
  swapsValue.textContent = swaps;
  readsValue.textContent = arrayReads;
  writesValue.textContent = arrayWrites;
  passValue.textContent = currentPass;
  opsValue.textContent = totalOps;
}

function setExplanation(text) {
  explanationText.textContent = text;
}

function highlightPseudocode(lineIndex) {
  const lines = pseudocodeEl.querySelectorAll("code");
  lines.forEach((line, idx) => {
    if (idx === lineIndex) {
      line.classList.add("highlighted");
    } else {
      line.classList.remove("highlighted");
    }
  });
}

function setControlsDisabled(disabled) {
  algorithmSelect.disabled = disabled;
  patternSelect.disabled = disabled;
  sizeSlider.disabled = disabled;
  newArrayBtn.disabled = disabled;
  themeSelect.disabled = disabled;
}

function resetStats() {
  comparisons = 0;
  swaps = 0;
  arrayReads = 0;
  arrayWrites = 0;
  currentPass = 0;
  totalOps = 0;
  comparisonsValue.textContent = "0";
  swapsValue.textContent = "0";
  readsValue.textContent = "0";
  writesValue.textContent = "0";
  passValue.textContent = "0";
  opsValue.textContent = "0";
  timeValue.textContent = "0.0s";
  speedDisplay.textContent = "0 ops/s";
  stopTimer();
}

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = (Date.now() - startTime) / 1000;
    timeValue.textContent = `${elapsed.toFixed(1)}s`;
    const opsPerSecond = elapsed > 0 ? Math.round(totalOps / elapsed) : 0;
    speedDisplay.textContent = `${opsPerSecond} ops/s`;
  }, 100);
}

function stopTimer() {
  clearInterval(timerInterval);
}

// ===== Sound =====
function playSound(frequency, duration = 100) {
  if (isMuted) return;
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.frequency.value = frequency;
  oscillator.type = "sine";
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + duration / 1000
  );
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration / 1000);
}

function playComparisonSound(value) {
  const freq = 200 + (value / 290) * 600;
  playSound(freq, 80);
}

function playSwapSound(value) {
  const freq = 100 + (value / 290) * 400;
  playSound(freq, 120);
}

// ===== Algorithm UI Update =====
function updateAlgorithmUI() {
  const key = algorithmSelect.value;
  const info = ALGORITHM_INFO[key];

  // Update Info Card
  algoName.textContent = info.name;
  algoBest.textContent = info.bestCase;
  algoAverage.textContent = info.averageCase;
  algoWorst.textContent = info.worstCase;
  algoSpace.textContent = info.space;
  algoStable.textContent = info.stable;
  algoInplace.textContent = info.inplace;
  algoDesc.textContent = info.description;
  algoApplications.textContent = info.applications;

  // Update Pseudocode
  pseudocodeEl.innerHTML = "";
  info.pseudocode.forEach((line, idx) => {
    const codeLine = document.createElement("code");
    codeLine.textContent = line;
    pseudocodeEl.appendChild(codeLine);
  });

  // Update Education
  eduHow.textContent = info.education.how;
  eduAdvantages.innerHTML = "";
  info.education.advantages.forEach((adv) => {
    const li = document.createElement("li");
    li.textContent = adv;
    eduAdvantages.appendChild(li);
  });
  eduDisadvantages.innerHTML = "";
  info.education.disadvantages.forEach((disadv) => {
    const li = document.createElement("li");
    li.textContent = disadv;
    eduDisadvantages.appendChild(li);
  });
  eduWhen.textContent = info.education.when;

  setExplanation("Select an algorithm and start sorting to see live explanations.");
}

// ===== Themes =====
const THEMES = {
  dark: {
    bgPrimary: "#0f1115",
    bgSecondary: "#171a21",
    bgCard: "#1d212b",
    borderColor: "#2a2f3a",
    textPrimary: "#e9edf3",
    textMuted: "#8c93a3",
    accent: "#1abc9c",
    accentHover: "#16a085",
    barDefault: "#3b4252",
    barComparing: "#f4d35e",
    barSwapping: "#e94f64",
    barPivot: "#9b59b6",
    barSorted: "#1abc9c",
  },
  light: {
    bgPrimary: "#f0f2f5",
    bgSecondary: "#ffffff",
    bgCard: "#f8fafc",
    borderColor: "#e2e8f0",
    textPrimary: "#1e293b",
    textMuted: "#64748b",
    accent: "#3b82f6",
    accentHover: "#2563eb",
    barDefault: "#94a3b8",
    barComparing: "#eab308",
    barSwapping: "#ef4444",
    barPivot: "#a855f7",
    barSorted: "#22c55e",
  },
  ocean: {
    bgPrimary: "#071934",
    bgSecondary: "#0c2649",
    bgCard: "#0e3160",
    borderColor: "#13407a",
    textPrimary: "#e0f2fe",
    textMuted: "#7dd3fc",
    accent: "#06b6d4",
    accentHover: "#0891b2",
    barDefault: "#0369a1",
    barComparing: "#fbbf24",
    barSwapping: "#f87171",
    barPivot: "#c084fc",
    barSorted: "#06b6d4",
  },
  neon: {
    bgPrimary: "#05000d",
    bgSecondary: "#0d001f",
    bgCard: "#150032",
    borderColor: "#250050",
    textPrimary: "#f0abfc",
    textMuted: "#d946ef",
    accent: "#a855f7",
    accentHover: "#9333ea",
    barDefault: "#4c1d95",
    barComparing: "#facc15",
    barSwapping: "#f43f5e",
    barPivot: "#06b6d4",
    barSorted: "#22c55e",
  },
  matrix: {
    bgPrimary: "#000000",
    bgSecondary: "#061a06",
    bgCard: "#0d2e0d",
    borderColor: "#166534",
    textPrimary: "#4ade80",
    textMuted: "#22c55e",
    accent: "#22c55e",
    accentHover: "#16a34a",
    barDefault: "#15803d",
    barComparing: "#facc15",
    barSwapping: "#ef4444",
    barPivot: "#a855f7",
    barSorted: "#4ade80",
  },
};

// Save all preferences
function savePreferences() {
  const preferences = {
    theme: themeSelect.value,
    algorithm: algorithmSelect.value,
    arraySize: sizeSlider.value,
    speed: speedSlider.value,
    pattern: patternSelect.value,
    isMuted: isMuted
  };
  localStorage.setItem("sortingPreferences", JSON.stringify(preferences));
}

function applyTheme(themeName) {
  const theme = THEMES[themeName];
  const root = document.documentElement;
  root.style.setProperty("--bg-primary", theme.bgPrimary);
  root.style.setProperty("--bg-secondary", theme.bgSecondary);
  root.style.setProperty("--bg-card", theme.bgCard);
  root.style.setProperty("--border-color", theme.borderColor);
  root.style.setProperty("--text-primary", theme.textPrimary);
  root.style.setProperty("--text-muted", theme.textMuted);
  root.style.setProperty("--accent", theme.accent);
  root.style.setProperty("--accent-hover", theme.accentHover);
  root.style.setProperty("--bar-default", theme.barDefault);
  root.style.setProperty("--bar-comparing", theme.barComparing);
  root.style.setProperty("--bar-swapping", theme.barSwapping);
  root.style.setProperty("--bar-pivot", theme.barPivot);
  root.style.setProperty("--bar-sorted", theme.barSorted);
  themeSelect.value = themeName;
  savePreferences();
}

function toggleMute() {
  isMuted = !isMuted;
  muteBtn.textContent = isMuted ? "🔇" : "🔊";
  savePreferences();
}

// ===== Summary Modal =====
function showSummary(algorithmKey, elapsedTime) {
  const info = ALGORITHM_INFO[algorithmKey];
  sumAlgo.textContent = info.name;
  sumSize.textContent = array.length;
  sumComp.textContent = comparisons;
  sumSwaps.textContent = swaps;
  sumTime.textContent = `${elapsedTime.toFixed(1)}s`;
  sumComplexity.textContent = info.averageCase;

  // Calculate rating
  let rating = "";
  if (algorithmKey === "bubble" || algorithmKey === "selection" || algorithmKey === "insertion") {
    rating = "⭐⭐";
  } else if (algorithmKey === "heap") {
    rating = "⭐⭐⭐";
  } else if (algorithmKey === "merge" || algorithmKey === "quick") {
    rating = "⭐⭐⭐⭐";
  }
  sumRating.textContent = rating;

  summaryModal.style.display = "flex";
  summaryModal.hidden = false;
  setTimeout(() => {
    summaryModal.classList.add("active");
  }, 10);
}

function hideSummary() {
  summaryModal.classList.remove("active");
  setTimeout(() => {
    summaryModal.style.display = "none";
    summaryModal.hidden = true;
  }, 300);
}

// ===== Sorting Algorithms =====
async function bubbleSort() {
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    currentPass = i + 1;
    passValue.textContent = currentPass;
    setExplanation(`Pass ${i + 1} of ${n - 1}`);
    highlightPseudocode(0);
    await sleep(getDelay());
    for (let j = 0; j < n - i - 1; j++) {
      await checkControl();
      setBarState(j, "comparing");
      setBarState(j + 1, "comparing");
      highlightPseudocode(1);
      setExplanation(`Comparing ${array[j]} and ${array[j+1]}`);
      playComparisonSound(array[j]);
      incrementComparisons();
      await sleep(getDelay());

      highlightPseudocode(2);
      if (array[j] > array[j + 1]) {
        setExplanation(`Swapping ${array[j]} and ${array[j+1]}`);
        playSwapSound(array[j]);
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        updateBarHeight(j, array[j]);
        updateBarHeight(j + 1, array[j + 1]);
        setBarState(j, "swapping");
        setBarState(j + 1, "swapping");
        incrementSwaps();
        await sleep(getDelay());
      } else {
        setExplanation(`${array[j]} is smaller, no swap`);
        await sleep(getDelay());
      }

      clearBarState(j);
      clearBarState(j + 1);
    }
    markSorted(n - i - 1);
    highlightPseudocode(4);
  }
  markSorted(0);
}

async function selectionSort() {
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    currentPass = i + 1;
    passValue.textContent = currentPass;
    let minIdx = i;
    setBarState(minIdx, "pivot");
    highlightPseudocode(1);
    setExplanation(`Finding minimum from index ${i}`);
    await sleep(getDelay());
    for (let j = i + 1; j < n; j++) {
      await checkControl();
      setBarState(j, "comparing");
      highlightPseudocode(2);
      incrementComparisons();
      playComparisonSound(array[j]);
      await sleep(getDelay());

      if (array[j] < array[minIdx]) {
        clearBarState(minIdx);
        minIdx = j;
        setBarState(minIdx, "pivot");
        setExplanation(`New minimum found at index ${j} (${array[j]})`);
      } else {
        clearBarState(j);
      }
    }
    if (minIdx !== i) {
      highlightPseudocode(5);
      setExplanation(`Swapping ${array[i]} and ${array[minIdx]}`);
      playSwapSound(array[i]);
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
      updateBarHeight(i, array[i]);
      updateBarHeight(minIdx, array[minIdx]);
      incrementSwaps();
      await sleep(getDelay());
    }
    clearBarState(minIdx);
    markSorted(i);
  }
  markSorted(n - 1);
}

async function insertionSort() {
  const n = array.length;
  markSorted(0);
  for (let i = 1; i < n; i++) {
    currentPass = i;
    passValue.textContent = currentPass;
    let key = array[i];
    let j = i - 1;
    setBarState(i, "comparing");
    highlightPseudocode(0);
    setExplanation(`Inserting ${key} into sorted portion`);
    await sleep(getDelay());

    while (j >= 0 && array[j] > key) {
      await checkControl();
      incrementComparisons();
      highlightPseudocode(3);
      playComparisonSound(array[j]);
      setBarState(j, "swapping");
      array[j + 1] = array[j];
      updateBarHeight(j + 1, array[j + 1]);
      await sleep(getDelay());
      clearBarState(j);
      j--;
      incrementSwaps();
    }
    highlightPseudocode(6);
    array[j + 1] = key;
    updateBarHeight(j + 1, key);
    setExplanation(`Placed ${key} at index ${j+1}`);
    await sleep(getDelay());

    for (let k = 0; k <= i; k++) {
      markSorted(k);
    }
  }
}

async function mergeSort(start = 0, end = array.length - 1) {
  highlightPseudocode(0);
  if (start >= end) {
    if (start === end) markSorted(start);
    return;
  }
  const mid = Math.floor((start + end) / 2);
  highlightPseudocode(2);
  await mergeSort(start, mid);
  highlightPseudocode(3);
  await mergeSort(mid + 1, end);
  highlightPseudocode(4);
  await merge(start, mid, end);
}

async function merge(start, mid, end) {
  const left = array.slice(start, mid + 1);
  const right = array.slice(mid + 1, end + 1);
  let i = 0;
  let j = 0;
  let k = start;
  setExplanation(`Merging ${start}-${mid} and ${mid+1}-${end}`);
  await sleep(getDelay());

  while (i < left.length && j < right.length) {
    await checkControl();
    setBarState(k, "comparing");
    incrementComparisons();
    playComparisonSound(left[i]);
    await sleep(getDelay());

    if (left[i] <= right[j]) {
      array[k] = left[i];
      i++;
    } else {
      array[k] = right[j];
      j++;
    }
    updateBarHeight(k, array[k]);
    setBarState(k, "swapping");
    incrementSwaps();
    k++;
  }

  while (i < left.length) {
    await checkControl();
    array[k] = left[i];
    updateBarHeight(k, array[k]);
    setBarState(k, "swapping");
    i++;
    k++;
    await sleep(getDelay());
  }

  while (j < right.length) {
    await checkControl();
    array[k] = right[j];
    updateBarHeight(k, array[k]);
    setBarState(k, "swapping");
    j++;
    k++;
    await sleep(getDelay());
  }

  for (let m = start; m <= end; m++) {
    markSorted(m);
  }
}

async function quickSort(start = 0, end = array.length - 1) {
  if (start >= end) {
    if (start === end) markSorted(start);
    return;
  }
  const pivotIndex = await partition(start, end);
  await quickSort(start, pivotIndex - 1);
  await quickSort(pivotIndex + 1, end);
}

async function partition(start, end) {
  const pivotValue = array[end];
  setBarState(end, "pivot");
  setExplanation(`Pivot selected: ${pivotValue}`);
  let pivotIndex = start;
  highlightPseudocode(0);

  for (let i = start; i < end; i++) {
    await checkControl();
    setBarState(i, "comparing");
    incrementComparisons();
    playComparisonSound(array[i]);
    await sleep(getDelay());

    if (array[i] < pivotValue) {
      setExplanation(`Swapping ${array[i]} and ${array[pivotIndex]}`);
      playSwapSound(array[i]);
      [array[i], array[pivotIndex]] = [array[pivotIndex], array[i]];
      updateBarHeight(i, array[i]);
      updateBarHeight(pivotIndex, array[pivotIndex]);
      setBarState(pivotIndex, "swapping");
      incrementSwaps();
      pivotIndex++;
      await sleep(getDelay());
    }
    clearBarState(i);
  }

  [array[pivotIndex], array[end]] = [array[end], array[pivotIndex]];
  updateBarHeight(pivotIndex, array[pivotIndex]);
  updateBarHeight(end, array[end]);
  incrementSwaps();
  markSorted(pivotIndex);
  clearBarState(end);
  setExplanation(`Pivot placed at index ${pivotIndex}`);
  await sleep(getDelay());
  return pivotIndex;
}

async function heapSort() {
  const n = array.length;
  highlightPseudocode(1);
  setExplanation("Building max heap");
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await heapify(n, i);
  }
  setExplanation("Extracting elements from heap");
  for (let i = n - 1; i > 0; i--) {
    currentPass = n - i;
    passValue.textContent = currentPass;
    await checkControl();
    [array[0], array[i]] = [array[i], array[0]];
    updateBarHeight(0, array[0]);
    updateBarHeight(i, array[i]);
    incrementSwaps();
    playSwapSound(array[i]);
    markSorted(i);
    await sleep(getDelay());
    await heapify(i, 0);
  }
  markSorted(0);
}

async function heapify(n, rootIndex) {
  let largest = rootIndex;
  const left = 2 * rootIndex + 1;
  const right = 2 * rootIndex + 2;

  await checkControl();
  setBarState(rootIndex, "pivot");
  if (left < n) setBarState(left, "comparing");
  if (right < n) setBarState(right, "comparing");
  incrementComparisons();
  await sleep(getDelay());

  if (left < n && array[left] > array[largest]) {
    largest = left;
  }
  if (right < n && array[right] > array[largest]) {
    largest = right;
  }

  clearBarState(rootIndex);
  if (left < n) clearBarState(left);
  if (right < n) clearBarState(right);

  if (largest !== rootIndex) {
    [array[rootIndex], array[largest]] = [array[largest], array[rootIndex]];
    updateBarHeight(rootIndex, array[rootIndex]);
    updateBarHeight(largest, array[largest]);
    incrementSwaps();
    await sleep(getDelay());
    await heapify(n, largest);
  }
}

const ALGORITHMS = {
  bubble: bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
  merge: () => mergeSort(0, array.length - 1),
  quick: () => quickSort(0, array.length - 1),
  heap: heapSort,
};

// ===== Control Flow =====
function generateNewArray() {
  if (isSorting) return;
  const size = Number(sizeSlider.value);
  const pattern = patternSelect.value;
  array = PATTERNS[pattern](size);
  renderBars();
  resetStats();
  statusValue.textContent = "Idle";
  setExplanation("Select an algorithm and start sorting to see live explanations.");
}

async function startSort() {
  if (isSorting) {
    isPaused = !isPaused;
    startBtn.textContent = isPaused ? "Resume" : "Pause";
    statusValue.textContent = isPaused ? "Paused" : "Sorting...";
    return;
  }

  isSorting = true;
  isPaused = false;
  stopRequested = false;
  setControlsDisabled(true);
  startBtn.textContent = "Pause";
  resetBtn.disabled = false;
  statusValue.textContent = "Sorting...";
  resetStats();
  startTimer();

  const algorithmKey = algorithmSelect.value;
  const sortFn = ALGORITHMS[algorithmKey];

  try {
    await sortFn();
    const elapsed = (Date.now() - startTime) / 1000;
    statusValue.textContent = "Sorted!";
    showSummary(algorithmKey, elapsed);
  } catch (err) {
    if (err.message !== "SORT_STOPPED") {
      console.error("Unexpected error during sorting:", err);
    }
    statusValue.textContent = "Stopped";
  } finally {
    stopTimer();
    isSorting = false;
    isPaused = false;
    setControlsDisabled(false);
    startBtn.textContent = "Start";
  }
}

function resetVisualizer() {
  stopRequested = true;
  isPaused = false;
  isSorting = false;
  setControlsDisabled(false);
  startBtn.textContent = "Start";
  stopTimer();
  setTimeout(() => {
    stopRequested = false;
    generateNewArray();
  }, 50);
}

// ===== Keyboard Shortcuts =====
function handleKeydown(e) {
  if (e.code === "Space") {
    e.preventDefault();
    startSort();
  } else if (e.key.toLowerCase() === "r") {
    resetVisualizer();
  } else if (e.key.toLowerCase() === "n") {
    generateNewArray();
  } else if (e.key.toLowerCase() === "m") {
    toggleMute();
  } else if (e.key.toLowerCase() === "t") {
    cycleThemes();
  }
}

function toggleMute() {
  isMuted = !isMuted;
  muteBtn.textContent = isMuted ? "🔇" : "🔊";
}

const THEME_ORDER = ["dark", "light", "ocean", "neon", "matrix"];
function cycleThemes() {
  const currentIndex = THEME_ORDER.indexOf(themeSelect.value);
  const nextIndex = (currentIndex + 1) % THEME_ORDER.length;
  applyTheme(THEME_ORDER[nextIndex]);
}

// ===== Event Listeners =====
sizeSlider.addEventListener("input", () => {
  sizeValue.textContent = sizeSlider.value;
});
sizeSlider.addEventListener("change", () => {
  savePreferences();
  generateNewArray();
});

speedSlider.addEventListener("input", () => {
  speedValue.textContent = speedSlider.value;
});
speedSlider.addEventListener("change", () => {
  savePreferences();
});

algorithmSelect.addEventListener("change", () => {
  updateAlgorithmUI();
  savePreferences();
});
patternSelect.addEventListener("change", () => {
  savePreferences();
  generateNewArray();
});

themeSelect.addEventListener("change", () => {
  applyTheme(themeSelect.value);
});

newArrayBtn.addEventListener("click", generateNewArray);
startBtn.addEventListener("click", startSort);
resetBtn.addEventListener("click", resetVisualizer);
muteBtn.addEventListener("click", toggleMute);

document.addEventListener("keydown", handleKeydown);

modalClose.addEventListener("click", hideSummary);
summaryModal.addEventListener("click", (e) => {
  if (e.target === summaryModal) {
    hideSummary();
  }
});
sumNewArray.addEventListener("click", () => {
  hideSummary();
  generateNewArray();
});
sumRunAgain.addEventListener("click", () => {
  hideSummary();
  startSort();
});

window.addEventListener("resize", () => {
  if (!isSorting) renderBars();
});

// ===== Init =====
document.addEventListener("DOMContentLoaded", () => {
  // Make sure modal is hidden initially
  summaryModal.style.display = "none";
  summaryModal.hidden = true;
  summaryModal.classList.remove("active");
  
  // Load saved preferences
  const savedPrefs = localStorage.getItem("sortingPreferences");
  if (savedPrefs) {
    const prefs = JSON.parse(savedPrefs);
    if (prefs.theme) applyTheme(prefs.theme);
    if (prefs.algorithm) algorithmSelect.value = prefs.algorithm;
    if (prefs.arraySize) sizeSlider.value = prefs.arraySize;
    if (prefs.speed) speedSlider.value = prefs.speed;
    if (prefs.pattern) patternSelect.value = prefs.pattern;
    if (typeof prefs.isMuted === "boolean") {
      isMuted = prefs.isMuted;
      muteBtn.textContent = isMuted ? "🔇" : "🔊";
    }
    sizeValue.textContent = sizeSlider.value;
    speedValue.textContent = speedSlider.value;
  }
  updateAlgorithmUI();
  generateNewArray();
});
