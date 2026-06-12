// DOM Elements
const barsContainer = document.getElementById('bars-container');
const generateArrayBtn = document.getElementById('generate-array');
const sortBtn = document.getElementById('sort-btn');
const arraySizeSlider = document.getElementById('array-size');
const speedSlider = document.getElementById('speed');
const sizeValue = document.getElementById('size-value');
const speedValue = document.getElementById('speed-value');
const algorithmSelect = document.getElementById('algorithm');
const comparisonsCountEl = document.getElementById('comparisons-count');
const swapsCountEl = document.getElementById('swaps-count');

// State
let array = [];
let delay = 20; // Default delay based on slider (100 - speed)
let comparisons = 0;
let swaps = 0;
let isSorting = false;
let abortController = null;

// Initialize
function init() {
    generateArray();
    
    // Event Listeners
    generateArrayBtn.addEventListener('click', generateArray);
    
    arraySizeSlider.addEventListener('input', (e) => {
        sizeValue.innerText = e.target.value;
        if (!isSorting) {
            generateArray();
        }
    });
    
    speedSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        if (val < 30) speedValue.innerText = "Slow";
        else if (val < 70) speedValue.innerText = "Medium";
        else speedValue.innerText = "Fast";
        
        // delay goes from 100ms (slow) to 2ms (fast)
        delay = Math.floor(1000 / val);
    });
    
    sortBtn.addEventListener('click', startSorting);
}

// Array Generation
function generateArray() {
    if (isSorting) return;
    
    const size = parseInt(arraySizeSlider.value);
    array = [];
    comparisons = 0;
    swaps = 0;
    updateStats();
    
    barsContainer.innerHTML = '';
    
    // Container height constraint
    const maxHeight = barsContainer.clientHeight * 0.9;
    
    for (let i = 0; i < size; i++) {
        // Random value between 5 and 100
        const value = Math.floor(Math.random() * 95) + 5;
        array.push(value);
        
        const bar = document.createElement('div');
        bar.classList.add('array-bar');
        
        // Calculate height percentage based on max value (100)
        bar.style.height = `${(value / 100) * maxHeight}px`;
        
        // Dynamic width based on container size and gap
        const totalGap = (size - 1) * 2; // 2px gap
        const availableWidth = barsContainer.clientWidth - totalGap - 20; // 20px padding
        bar.style.width = `${Math.max(2, availableWidth / size)}px`;
        
        barsContainer.appendChild(bar);
    }
}

function updateStats() {
    comparisonsCountEl.innerText = comparisons;
    swapsCountEl.innerText = swaps;
}

// UI Controls
function toggleControls(disabled) {
    generateArrayBtn.disabled = disabled;
    arraySizeSlider.disabled = disabled;
    algorithmSelect.disabled = disabled;
    sortBtn.disabled = disabled;
}

// Utility: Sleep function for animations
function sleep(ms, signal) {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(resolve, ms);
        if (signal) {
            signal.addEventListener('abort', () => {
                clearTimeout(timeout);
                reject(new Error('Aborted'));
            });
        }
    });
}

// Utility: Change bar state
function setBarState(index, state) {
    const bars = document.getElementsByClassName('array-bar');
    if (!bars[index]) return;
    
    bars[index].className = 'array-bar';
    if (state) {
        bars[index].classList.add(state);
    }
}

// Utility: Swap bars visually and in array
async function swap(i, j, signal) {
    const bars = document.getElementsByClassName('array-bar');
    
    setBarState(i, 'swapping');
    setBarState(j, 'swapping');
    
    await sleep(delay, signal);
    
    // Swap heights in DOM
    const tempHeight = bars[i].style.height;
    bars[i].style.height = bars[j].style.height;
    bars[j].style.height = tempHeight;
    
    // Swap in array
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
    
    swaps++;
    updateStats();
    
    setBarState(i, '');
    setBarState(j, '');
}

// Sorting Algorithms

async function bubbleSort(signal) {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            setBarState(j, 'comparing');
            setBarState(j + 1, 'comparing');
            
            comparisons++;
            updateStats();
            await sleep(delay, signal);
            
            if (array[j] > array[j + 1]) {
                await swap(j, j + 1, signal);
            }
            
            setBarState(j, '');
            setBarState(j + 1, '');
        }
        setBarState(n - i - 1, 'sorted');
    }
    setBarState(0, 'sorted');
}

async function selectionSort(signal) {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        setBarState(minIdx, 'swapping'); // Highlight current min
        
        for (let j = i + 1; j < n; j++) {
            setBarState(j, 'comparing');
            
            comparisons++;
            updateStats();
            await sleep(delay, signal);
            
            if (array[j] < array[minIdx]) {
                if (minIdx !== i) setBarState(minIdx, '');
                minIdx = j;
                setBarState(minIdx, 'swapping');
            } else {
                setBarState(j, '');
            }
        }
        
        if (minIdx !== i) {
            await swap(i, minIdx, signal);
        }
        setBarState(minIdx, '');
        setBarState(i, 'sorted');
    }
    setBarState(n - 1, 'sorted');
}

async function insertionSort(signal) {
    const n = array.length;
    setBarState(0, 'sorted');
    
    for (let i = 1; i < n; i++) {
        let key = array[i];
        let j = i - 1;
        
        // Temporarily store height to "move" it
        const bars = document.getElementsByClassName('array-bar');
        let keyHeight = bars[i].style.height;
        
        setBarState(i, 'swapping');
        await sleep(delay, signal);
        
        while (j >= 0) {
            setBarState(j, 'comparing');
            comparisons++;
            updateStats();
            await sleep(delay, signal);
            
            if (array[j] > key) {
                // Move visually
                bars[j + 1].style.height = bars[j].style.height;
                array[j + 1] = array[j];
                swaps++;
                updateStats();
                
                setBarState(j, 'sorted');
                j--;
            } else {
                setBarState(j, 'sorted');
                break;
            }
        }
        
        array[j + 1] = key;
        bars[j + 1].style.height = keyHeight;
        setBarState(j + 1, 'sorted');
        
        // Ensure all previous are marked sorted
        for(let k = 0; k <= i; k++) setBarState(k, 'sorted');
    }
}

async function partition(low, high, signal) {
    const pivot = array[high];
    setBarState(high, 'swapping'); // Pivot
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        setBarState(j, 'comparing');
        comparisons++;
        updateStats();
        await sleep(delay, signal);
        
        if (array[j] < pivot) {
            i++;
            if(i !== j) await swap(i, j, signal);
        }
        setBarState(j, '');
    }
    
    if(i + 1 !== high) await swap(i + 1, high, signal);
    setBarState(high, '');
    
    return i + 1;
}

async function quickSortHelper(low, high, signal) {
    if (low < high) {
        let pi = await partition(low, high, signal);
        setBarState(pi, 'sorted');
        
        await quickSortHelper(low, pi - 1, signal);
        await quickSortHelper(pi + 1, high, signal);
    } else if (low === high) {
        setBarState(low, 'sorted');
    }
}

async function quickSort(signal) {
    await quickSortHelper(0, array.length - 1, signal);
}

// Merge Sort Implementation
async function merge(l, m, r, signal) {
    const n1 = m - l + 1;
    const n2 = r - m;
    
    let L = new Array(n1);
    let R = new Array(n2);
    
    const bars = document.getElementsByClassName('array-bar');
    
    for (let i = 0; i < n1; i++) L[i] = array[l + i];
    for (let j = 0; j < n2; j++) R[j] = array[m + 1 + j];
    
    let i = 0, j = 0, k = l;
    
    while (i < n1 && j < n2) {
        setBarState(k, 'comparing');
        comparisons++;
        updateStats();
        await sleep(delay, signal);
        
        if (L[i] <= R[j]) {
            array[k] = L[i];
            bars[k].style.height = `${(L[i] / 100) * (barsContainer.clientHeight * 0.9)}px`;
            i++;
        } else {
            array[k] = R[j];
            bars[k].style.height = `${(R[j] / 100) * (barsContainer.clientHeight * 0.9)}px`;
            j++;
        }
        setBarState(k, '');
        swaps++; // Treating rewrite as swap for stats
        updateStats();
        k++;
    }
    
    while (i < n1) {
        setBarState(k, 'comparing');
        await sleep(delay, signal);
        array[k] = L[i];
        bars[k].style.height = `${(L[i] / 100) * (barsContainer.clientHeight * 0.9)}px`;
        setBarState(k, '');
        i++;
        k++;
        swaps++;
        updateStats();
    }
    
    while (j < n2) {
        setBarState(k, 'comparing');
        await sleep(delay, signal);
        array[k] = R[j];
        bars[k].style.height = `${(R[j] / 100) * (barsContainer.clientHeight * 0.9)}px`;
        setBarState(k, '');
        j++;
        k++;
        swaps++;
        updateStats();
    }
}

async function mergeSortHelper(l, r, signal) {
    if (l >= r) return;
    
    const m = l + Math.floor((r - l) / 2);
    
    await mergeSortHelper(l, m, signal);
    await mergeSortHelper(m + 1, r, signal);
    await merge(l, m, r, signal);
    
    // Only mark sorted if it's the final merge, or mark progressively
    if (l === 0 && r === array.length - 1) {
        for(let i = 0; i <= r; i++) setBarState(i, 'sorted');
    }
}

async function mergeSort(signal) {
    await mergeSortHelper(0, array.length - 1, signal);
}

// Main Sorting Handler
async function startSorting() {
    if (isSorting) return;
    
    isSorting = true;
    toggleControls(true);
    abortController = new AbortController();
    
    // Clear sorted states if re-sorting
    for (let i = 0; i < array.length; i++) {
        setBarState(i, '');
    }
    
    comparisons = 0;
    swaps = 0;
    updateStats();
    
    const algo = algorithmSelect.value;
    
    try {
        if (algo === 'bubble') await bubbleSort(abortController.signal);
        else if (algo === 'selection') await selectionSort(abortController.signal);
        else if (algo === 'insertion') await insertionSort(abortController.signal);
        else if (algo === 'quick') await quickSort(abortController.signal);
        else if (algo === 'merge') await mergeSort(abortController.signal);
        
        // Ensure all are green at the end
        for(let i = 0; i < array.length; i++) setBarState(i, 'sorted');
    } catch (err) {
        console.log("Sorting aborted", err);
    } finally {
        isSorting = false;
        toggleControls(false);
        abortController = null;
    }
}

// Window resize handler to readjust bar widths
window.addEventListener('resize', () => {
    if (array.length === 0) return;
    const bars = document.getElementsByClassName('array-bar');
    const totalGap = (array.length - 1) * 2;
    const availableWidth = barsContainer.clientWidth - totalGap - 20;
    const newWidth = Math.max(2, availableWidth / array.length);
    
    for (let i = 0; i < bars.length; i++) {
        bars[i].style.width = `${newWidth}px`;
        // Also adjust max height
        bars[i].style.height = `${(array[i] / 100) * (barsContainer.clientHeight * 0.9)}px`;
    }
});

init();
