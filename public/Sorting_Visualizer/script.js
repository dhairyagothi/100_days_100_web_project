/**
 * Advanced Sorting Visualizer
 */

// --- Settings Management (Colors) ---
const DEFAULTS = {
    primary: '#3b82f6',
    compare: '#ff0055',
    swap: '#ffcc00',
    sorted: '#00ff99'
};

function getSetting(key) {
    return localStorage.getItem('sort_' + key) || DEFAULTS[key];
}

function setSetting(key, value) {
    localStorage.setItem('sort_' + key, value);
}

function applySettings() {
    document.documentElement.style.setProperty('--color-primary', getSetting('primary'));
    document.documentElement.style.setProperty('--color-compare', getSetting('compare'));
    document.documentElement.style.setProperty('--color-swap', getSetting('swap'));
    document.documentElement.style.setProperty('--color-sorted', getSetting('sorted'));
}
applySettings();

// --- Settings Page Logic ---
if (window.location.pathname.includes('settings.html')) {
    const ids = ['primary', 'compare', 'swap', 'sorted'];
    ids.forEach(id => {
        const input = document.getElementById('color-' + id);
        input.value = getSetting(id);
        input.addEventListener('change', e => {
            setSetting(id, e.target.value);
            applySettings();
        });
    });

    document.getElementById('btn-reset-colors').addEventListener('click', () => {
        ids.forEach(id => {
            setSetting(id, DEFAULTS[id]);
            document.getElementById('color-' + id).value = DEFAULTS[id];
        });
        applySettings();
    });
}

// --- Visualizer Logic ---
if (window.location.pathname.includes('visualizer.html')) {

    const container = document.getElementById('array-container');
    const sliderSize = document.getElementById('slider-size');
    const sliderSpeed = document.getElementById('slider-speed');
    const btnGenerate = document.getElementById('btn-generate');
    const btnSort = document.getElementById('btn-sort');
    const algoSelector = document.getElementById('algo-selector');

    let array = [];
    let isSorting = false;

    // --- State Generation ---
    function generateArray() {
        if (isSorting) return;
        array = [];
        container.innerHTML = '';
        const size = sliderSize.value;
        const containerWidth = container.clientWidth - 40; // padding
        const barWidth = Math.max(1, Math.floor(containerWidth / size) - 2);

        for (let i = 0; i < size; i++) {
            // Random value between 10 and 100 for percentage height
            const value = Math.floor(Math.random() * 90) + 10;
            array.push(value);

            const bar = document.createElement('div');
            bar.classList.add('array-bar');
            bar.style.height = `${value}%`;
            bar.style.width = `${barWidth}px`;
            container.appendChild(bar);
        }
    }

    sliderSize.addEventListener('input', generateArray);
    btnGenerate.addEventListener('click', generateArray);
    window.addEventListener('resize', generateArray);

    // Initial load
    generateArray();


    // --- Animation Engine ---
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getSpeed() {
        // Speed slider: 1 (slow) to 100 (fast).
        // Return ms delay.
        const val = parseInt(sliderSpeed.value);
        return Math.floor(1000 / val) - 9; // Range approx 1ms to 1000ms
    }

    async function playAnimations(animations) {
        isSorting = true;
        const bars = document.getElementsByClassName('array-bar');
        
        for (let i = 0; i < animations.length; i++) {
            const anim = animations[i];
            const type = anim.type; // 'compare', 'swap', 'overwrite', 'revert'
            
            if (type === 'compare') {
                const [idx1, idx2] = anim.indices;
                bars[idx1].style.backgroundColor = 'var(--color-compare)';
                bars[idx2].style.backgroundColor = 'var(--color-compare)';
                await sleep(getSpeed());
                bars[idx1].style.backgroundColor = 'var(--color-primary)';
                bars[idx2].style.backgroundColor = 'var(--color-primary)';
            } 
            else if (type === 'swap') {
                const [idx1, idx2] = anim.indices;
                bars[idx1].style.backgroundColor = 'var(--color-swap)';
                bars[idx2].style.backgroundColor = 'var(--color-swap)';
                
                // Swap heights
                const temp = bars[idx1].style.height;
                bars[idx1].style.height = bars[idx2].style.height;
                bars[idx2].style.height = temp;

                await sleep(getSpeed());
                bars[idx1].style.backgroundColor = 'var(--color-primary)';
                bars[idx2].style.backgroundColor = 'var(--color-primary)';
            }
            else if (type === 'overwrite') {
                // Used for Merge Sort
                const [idx, value] = anim.indices;
                bars[idx].style.backgroundColor = 'var(--color-swap)';
                bars[idx].style.height = `${value}%`;
                await sleep(getSpeed());
                bars[idx].style.backgroundColor = 'var(--color-primary)';
            }
        }

        // Sorted Animation Sweep
        for (let i = 0; i < bars.length; i++) {
            bars[i].style.backgroundColor = 'var(--color-sorted)';
            await sleep(10);
        }
        
        isSorting = false;
    }


    // --- Algorithms ---
    
    function bubbleSort(arr) {
        const anims = [];
        let n = arr.length;
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                anims.push({ type: 'compare', indices: [j, j+1] });
                if (arr[j] > arr[j+1]) {
                    anims.push({ type: 'swap', indices: [j, j+1] });
                    let temp = arr[j];
                    arr[j] = arr[j+1];
                    arr[j+1] = temp;
                }
            }
        }
        return anims;
    }

    function insertionSort(arr) {
        const anims = [];
        let n = arr.length;
        for (let i = 1; i < n; i++) {
            let key = arr[i];
            let j = i - 1;
            while (j >= 0 && arr[j] > key) {
                anims.push({ type: 'compare', indices: [j, j+1] });
                anims.push({ type: 'swap', indices: [j, j+1] }); // visually swap
                arr[j + 1] = arr[j];
                j = j - 1;
            }
            arr[j + 1] = key;
        }
        return anims;
    }

    // Merge Sort
    function mergeSort(arr) {
        const anims = [];
        const aux = [...arr];
        mergeSortHelper(arr, 0, arr.length - 1, aux, anims);
        return anims;
    }

    function mergeSortHelper(mainArray, startIdx, endIdx, auxiliaryArray, animations) {
        if (startIdx === endIdx) return;
        const middleIdx = Math.floor((startIdx + endIdx) / 2);
        mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray, animations);
        mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray, animations);
        doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations);
    }

    function doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations) {
        let k = startIdx;
        let i = startIdx;
        let j = middleIdx + 1;

        while (i <= middleIdx && j <= endIdx) {
            animations.push({ type: 'compare', indices: [i, j] });
            if (auxiliaryArray[i] <= auxiliaryArray[j]) {
                animations.push({ type: 'overwrite', indices: [k, auxiliaryArray[i]] });
                mainArray[k++] = auxiliaryArray[i++];
            } else {
                animations.push({ type: 'overwrite', indices: [k, auxiliaryArray[j]] });
                mainArray[k++] = auxiliaryArray[j++];
            }
        }
        while (i <= middleIdx) {
            animations.push({ type: 'compare', indices: [i, i] }); // pseudo compare
            animations.push({ type: 'overwrite', indices: [k, auxiliaryArray[i]] });
            mainArray[k++] = auxiliaryArray[i++];
        }
        while (j <= endIdx) {
            animations.push({ type: 'compare', indices: [j, j] }); // pseudo compare
            animations.push({ type: 'overwrite', indices: [k, auxiliaryArray[j]] });
            mainArray[k++] = auxiliaryArray[j++];
        }
    }

    // Quick Sort
    function quickSort(arr) {
        const anims = [];
        quickSortHelper(arr, 0, arr.length - 1, anims);
        return anims;
    }

    function quickSortHelper(arr, low, high, anims) {
        if (low < high) {
            let pi = partition(arr, low, high, anims);
            quickSortHelper(arr, low, pi - 1, anims);
            quickSortHelper(arr, pi + 1, high, anims);
        }
    }

    function partition(arr, low, high, anims) {
        let pivot = arr[high];
        let i = (low - 1);
        
        for (let j = low; j <= high - 1; j++) {
            anims.push({ type: 'compare', indices: [j, high] });
            if (arr[j] < pivot) {
                i++;
                anims.push({ type: 'swap', indices: [i, j] });
                let temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        anims.push({ type: 'swap', indices: [i + 1, high] });
        let temp2 = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp2;
        return (i + 1);
    }

    // --- Action Trigger ---
    btnSort.addEventListener('click', () => {
        if (isSorting) return;
        
        const algo = algoSelector.value;
        const copyArr = [...array];
        let animations = [];

        if (algo === 'bubble') animations = bubbleSort(copyArr);
        else if (algo === 'insertion') animations = insertionSort(copyArr);
        else if (algo === 'merge') animations = mergeSort(copyArr);
        else if (algo === 'quick') animations = quickSort(copyArr);

        // State is updated behind the scenes.
        // We now play the visual animations.
        playAnimations(animations);
    });

}
