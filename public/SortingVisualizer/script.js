// ===== State =====
let array = [];
let bars = [];
let isSorting = false;
let isPaused = false;
let stopRequested = false;
let comparisons = 0;
let swaps = 0;
let startTime = 0;
let timerInterval = null;

// ===== DOM References =====
const visualizer = document.getElementById('visualizer');
const algorithmSelect = document.getElementById('algorithm-select');
const sizeSlider = document.getElementById('size-slider');
const speedSlider = document.getElementById('speed-slider');
const sizeValue = document.getElementById('size-value');
const speedValue = document.getElementById('speed-value');
const newArrayBtn = document.getElementById('new-array-btn');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const comparisonsValue = document.getElementById('comparisons-value');
const swapsValue = document.getElementById('swaps-value');
const timeValue = document.getElementById('time-value');
const statusValue = document.getElementById('status-value');

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
        throw new Error('SORT_STOPPED');
    }
}

function randomArray(size) {
    const arr = [];
    for (let i = 0; i < size; i++) {
        arr.push(Math.floor(Math.random() * 280) + 10);
    }
    return arr;
}

function renderBars() {
    visualizer.innerHTML = '';
    bars = [];
    const containerHeight = visualizer.clientHeight - 24;
    array.forEach((value) => {
        const bar = document.createElement('div');
        bar.className = 'bar';
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
        bars[index].className = 'bar';
    }
}

function markSorted(index) {
    if (bars[index]) {
        bars[index].className = 'bar sorted';
    }
}

function updateBarHeight(index, value) {
    if (bars[index]) {
        const containerHeight = visualizer.clientHeight - 24;
        const heightPx = Math.max((value / 290) * containerHeight, 2);
        bars[index].style.height = `${heightPx}px`;
    }
}

function incrementComparisons(n = 1) {
    comparisons += n;
    comparisonsValue.textContent = comparisons;
}

function incrementSwaps(n = 1) {
    swaps += n;
    swapsValue.textContent = swaps;
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        timeValue.textContent = `${elapsed.toFixed(1)}s`;
    }, 100);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function setControlsDisabled(disabled) {
    algorithmSelect.disabled = disabled;
    sizeSlider.disabled = disabled;
    newArrayBtn.disabled = disabled;
}

function resetStats() {
    comparisons = 0;
    swaps = 0;
    comparisonsValue.textContent = '0';
    swapsValue.textContent = '0';
    timeValue.textContent = '0.0s';
    stopTimer();
}

// ===== Sorting Algorithms =====.

async function bubbleSort() {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            await checkControl();
            setBarState(j, 'comparing');
            setBarState(j + 1, 'comparing');
            incrementComparisons();
            await sleep(getDelay());

            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                updateBarHeight(j, array[j]);
                updateBarHeight(j + 1, array[j + 1]);
                setBarState(j, 'swapping');
                setBarState(j + 1, 'swapping');
                incrementSwaps();
                await sleep(getDelay());
            }

            clearBarState(j);
            clearBarState(j + 1);
        }
        markSorted(n - i - 1);
    }
    markSorted(0);
}

async function selectionSort() {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        setBarState(minIdx, 'pivot');
        for (let j = i + 1; j < n; j++) {
            await checkControl();
            setBarState(j, 'comparing');
            incrementComparisons();
            await sleep(getDelay());

            if (array[j] < array[minIdx]) {
                clearBarState(minIdx);
                minIdx = j;
                setBarState(minIdx, 'pivot');
            } else {
                clearBarState(j);
            }
        }
        if (minIdx !== i) {
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
        let key = array[i];
        let j = i - 1;
        setBarState(i, 'comparing');
        await sleep(getDelay());

        while (j >= 0 && array[j] > key) {
            await checkControl();
            incrementComparisons();
            setBarState(j, 'swapping');
            array[j + 1] = array[j];
            updateBarHeight(j + 1, array[j + 1]);
            await sleep(getDelay());
            clearBarState(j);
            j--;
            incrementSwaps();
        }
        array[j + 1] = key;
        updateBarHeight(j + 1, key);

        for (let k = 0; k <= i; k++) {
            markSorted(k);
        }
    }
}

async function mergeSort(start = 0, end = array.length - 1) {
    if (start >= end) {
        if (start === end) markSorted(start);
        return;
    }
    const mid = Math.floor((start + end) / 2);
    await mergeSort(start, mid);
    await mergeSort(mid + 1, end);
    await merge(start, mid, end);
}

async function merge(start, mid, end) {
    const left = array.slice(start, mid + 1);
    const right = array.slice(mid + 1, end + 1);
    let i = 0;
    let j = 0;
    let k = start;

    while (i < left.length && j < right.length) {
        await checkControl();
        setBarState(k, 'comparing');
        incrementComparisons();
        await sleep(getDelay());

        if (left[i] <= right[j]) {
            array[k] = left[i];
            i++;
        } else {
            array[k] = right[j];
            j++;
        }
        updateBarHeight(k, array[k]);
        setBarState(k, 'swapping');
        incrementSwaps();
        k++;
    }

    while (i < left.length) {
        await checkControl();
        array[k] = left[i];
        updateBarHeight(k, array[k]);
        setBarState(k, 'swapping');
        i++;
        k++;
        await sleep(getDelay());
    }

    while (j < right.length) {
        await checkControl();
        array[k] = right[j];
        updateBarHeight(k, array[k]);
        setBarState(k, 'swapping');
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
    setBarState(end, 'pivot');
    let pivotIndex = start;

    for (let i = start; i < end; i++) {
        await checkControl();
        setBarState(i, 'comparing');
        incrementComparisons();
        await sleep(getDelay());

        if (array[i] < pivotValue) {
            [array[i], array[pivotIndex]] = [array[pivotIndex], array[i]];
            updateBarHeight(i, array[i]);
            updateBarHeight(pivotIndex, array[pivotIndex]);
            setBarState(pivotIndex, 'swapping');
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
    await sleep(getDelay());

    return pivotIndex;
}

async function heapSort() {
    const n = array.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(n, i);
    }

    for (let i = n - 1; i > 0; i--) {
        await checkControl();
        [array[0], array[i]] = [array[i], array[0]];
        updateBarHeight(0, array[0]);
        updateBarHeight(i, array[i]);
        incrementSwaps();
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
    setBarState(rootIndex, 'pivot');
    if (left < n) setBarState(left, 'comparing');
    if (right < n) setBarState(right, 'comparing');
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
    array = randomArray(size);
    renderBars();
    resetStats();
    statusValue.textContent = 'Idle';
}

async function startSort() {
    if (isSorting) {
        isPaused = !isPaused;
        startBtn.textContent = isPaused ? 'Resume' : 'Pause';
        statusValue.textContent = isPaused ? 'Paused' : 'Sorting...';
        return;
    }

    isSorting = true;
    isPaused = false;
    stopRequested = false;
    setControlsDisabled(true);
    startBtn.textContent = 'Pause';
    resetBtn.disabled = false;
    statusValue.textContent = 'Sorting...';
    resetStats();
    startTimer();

    const algorithmKey = algorithmSelect.value;
    const sortFn = ALGORITHMS[algorithmKey];

    try {
        await sortFn();
        statusValue.textContent = 'Sorted!';
    } catch (err) {
        if (err.message !== 'SORT_STOPPED') {
            console.error('Unexpected error during sorting:', err);
        }
        statusValue.textContent = 'Stopped';
    } finally {
        stopTimer();
        isSorting = false;
        isPaused = false;
        setControlsDisabled(false);
        startBtn.textContent = 'Start';
    }
}

function resetVisualizer() {
    stopRequested = true;
    isPaused = false;
    isSorting = false;
    setControlsDisabled(false);
    startBtn.textContent = 'Start';
    stopTimer();
    setTimeout(() => {
        stopRequested = false;
        generateNewArray();
    }, 50);
}

// ===== Event Listeners =====

sizeSlider.addEventListener('input', () => {
    sizeValue.textContent = sizeSlider.value;
});

sizeSlider.addEventListener('change', () => {
    generateNewArray();
});

speedSlider.addEventListener('input', () => {
    speedValue.textContent = speedSlider.value;
});

newArrayBtn.addEventListener('click', generateNewArray);
startBtn.addEventListener('click', startSort);
resetBtn.addEventListener('click', resetVisualizer);

window.addEventListener('resize', () => {
    if (!isSorting) renderBars();
});

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
    generateNewArray();
});