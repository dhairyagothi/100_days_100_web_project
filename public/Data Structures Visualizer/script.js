// Array Visualizer State
const state = {
    arraySize: 5,
    arrayData: [],
    stackData: [],
    queueData: [],
    queueItemId: 0,
    isRunning: false,
    isStackRunning: false,
    isQueueRunning: false,
    currentStructure: 'array',
    arrayDefinitionTypingToken: 0,
    infoTypingToken: 0,
    stackDefinitionTypingToken: 0,
    stackLearnTypingToken: 0,
    queueDefinitionTypingToken: 0,
    queueLearnTypingToken: 0
};

const STACK_MAX_SIZE = 7;
const QUEUE_MAX_SIZE = 7;

const stackDefinition = "A stack is a linear data structure that follows the Last In, First Out (LIFO) principle. Elements are inserted and removed only from the top of the stack.";

const stackLearnDefinitions = {
    push: "Push adds a new element to the top of the stack.",
    pop: "Pop removes the topmost element from the stack.",
    peek: "Peek reads the top element without changing the stack.",
    overflow: "Overflow occurs when a new element is pushed into a completely full stack.",
    underflow: "Underflow occurs when a pop operation is attempted on an empty stack.",
    lifo: "LIFO means Last In, First Out. The most recently added element is removed first.",
    top: "The top points to the most recently inserted element in the stack."
};

const queueDefinition = "A queue is a linear data structure that follows the First In, First Out (FIFO) principle. Elements are inserted from the rear and removed from the front.";

const queueLearnDefinitions = {
    queue: "A queue stores elements in order so the first element added is the first one removed.",
    insert: "Insert adds a new element to the rear of the queue.",
    delete: "Delete removes the front element from the queue.",
    front: "Front reads the first element waiting to leave the queue.",
    rear: "Rear reads the most recently inserted element at the end of the queue.",
    peek: "Peek shows the front element without removing it.",
    fifo: "FIFO means First In, First Out. The earliest inserted element is removed first.",
    overflow: "Overflow occurs when an enqueue operation is attempted on a completely full queue.",
    underflow: "Underflow occurs when an operation tries to remove or read from an empty queue.",
    isFull: "isFull checks whether the queue has reached its maximum capacity.",
    isEmpty: "isEmpty checks whether the queue has no elements."
};

// Educational Information
const educationalInfo = {
    array: "An array is a linear data structure that stores elements in contiguous memory locations. Each value can be accessed quickly using its index, making arrays useful for organizing collections of data.",
    
    traversal: "Traversal means visiting each element of an array one by one to display, inspect, or process the stored values in a clear sequence.",
    
    search: "Searching is the process of finding a specific element inside an array. Linear search checks elements one at a time until the target is found or the array ends.",
    
    sort: "Sorting arranges elements in a specific order, usually ascending or descending. A sorted array is easier to read, compare, search, and process."
};

const arrayDefinition = "An array is a linear data structure that stores elements in indexed positions. It makes values easy to access, update, search, and sort.";

// DOM Elements
const sizeInput = document.getElementById('sizeInput');
const sizeError = document.getElementById('sizeError');
const arrayDefinitionText = document.getElementById('arrayDefinitionText');
const arrayVisualization = document.getElementById('arrayVisualization');
const inputsGrid = document.getElementById('inputsGrid');
const inputError = document.getElementById('inputError');
const traverseBtn = document.getElementById('traverseBtn');
const searchBtn = document.getElementById('searchBtn');
const sortBtn = document.getElementById('sortBtn');
const searchSection = document.getElementById('searchSection');
const searchInput = document.getElementById('searchInput');
const searchActionBtn = document.getElementById('searchActionBtn');
const statusDisplay = document.getElementById('statusDisplay');
const infoPanel = document.getElementById('infoPanel');
const selectorBtns = document.querySelectorAll('.selector-btn');
const infoBtns = document.querySelectorAll('.info-btn');
const visualizerSections = document.querySelectorAll('.visualizer-section');
const stackInput = document.getElementById('stackInput');
const pushBtn = document.getElementById('pushBtn');
const popBtn = document.getElementById('popBtn');
const peekBtn = document.getElementById('peekBtn');
const stackItems = document.getElementById('stackItems');
const stackEmptyState = document.getElementById('stackEmptyState');
const stackMotionLayer = document.getElementById('stackMotionLayer');
const stackStatus = document.getElementById('stackStatus');
const stackError = document.getElementById('stackError');
const stackBase = document.querySelector('.stack-base');
const stackShell = document.querySelector('.stack-shell');
const stackSizeDisplay = document.getElementById('stackSizeDisplay');
const stackVisualizationPanel = document.querySelector('.stack-visualization-panel');
const stackDefinitionText = document.getElementById('stackDefinitionText');
const stackWarningLabel = document.getElementById('stackWarningLabel');
const stackLearnBtns = document.querySelectorAll('.stack-learn-btn');
const stackLearnPanel = document.getElementById('stackLearnPanel');
const queueInput = document.getElementById('queueInput');
const enqueueBtn = document.getElementById('enqueueBtn');
const dequeueBtn = document.getElementById('dequeueBtn');
const frontBtn = document.getElementById('frontBtn');
const rearBtn = document.getElementById('rearBtn');
const queuePeekBtn = document.getElementById('queuePeekBtn');
const queueItems = document.getElementById('queueItems');
const queueEmptyState = document.getElementById('queueEmptyState');
const queueMotionLayer = document.getElementById('queueMotionLayer');
const queueStatus = document.getElementById('queueStatus');
const queueSizeDisplay = document.getElementById('queueSizeDisplay');
const queueDefinitionText = document.getElementById('queueDefinitionText');
const queueLearnBtns = document.querySelectorAll('.queue-learn-btn');
const queueLearnPanel = document.getElementById('queueLearnPanel');
const queueVisualizationPanel = document.querySelector('.queue-visualization-panel');
const queueChamber = document.querySelector('.queue-chamber');
const queueWarningLabel = document.getElementById('queueWarningLabel');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
initializeArray();
    typeArrayDefinition();
    renderStack();
    renderQueue();
    setupEventListeners();
});

// Setup Event Listeners
const setupEventListeners = () => {
    sizeInput.addEventListener('change', handleSizeChange);
    sizeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSizeChange(e);
    });
    traverseBtn.addEventListener('click', handleTraverse);
    searchBtn.addEventListener('click', toggleSearch);
    sortBtn.addEventListener('click', handleSort);
    searchActionBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
    pushBtn.addEventListener('click', handlePush);
    popBtn.addEventListener('click', handlePop);
    peekBtn.addEventListener('click', handlePeek);
    stackInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handlePush();
    });
    stackLearnBtns.forEach(btn => {
        btn.addEventListener('click', handleStackLearnClick);
    });
    enqueueBtn.addEventListener('click', handleEnqueue);
    dequeueBtn.addEventListener('click', handleDequeue);
    frontBtn.addEventListener('click', () => highlightQueueEnd('front'));
    rearBtn.addEventListener('click', () => highlightQueueEnd('rear'));
    queuePeekBtn.addEventListener('click', () => highlightQueueEnd('peek'));
    queueInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleEnqueue();
    });
    queueLearnBtns.forEach(btn => {
        btn.addEventListener('click', handleQueueLearnClick);
    });
    
    selectorBtns.forEach(btn => {
        btn.addEventListener('click', handleStructureChange);
    });
    
    infoBtns.forEach(btn => {
        btn.addEventListener('click', handleInfoClick);
    });
};

// Initialize Array with random values
const initializeArray = () => {
    state.arrayData = Array.from({ length: state.arraySize }, () => getRandomInt(1, 99));
    renderArray();
    renderInputFields();
};

// Get Random Integer
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Render Array Visualization
const renderArray = (isResizing = false) => {
    const fragment = document.createDocumentFragment();

    state.arrayData.forEach((value, index) => {
        const box = document.createElement('div');
        box.className = 'array-box';
        box.dataset.index = index;

        const indexLabel = document.createElement('div');
        indexLabel.className = 'array-box-index';
        indexLabel.textContent = index;

        const valueLabel = document.createElement('div');
        valueLabel.className = 'array-box-value';
        valueLabel.textContent = value;

        box.appendChild(indexLabel);
        box.appendChild(valueLabel);
        fragment.appendChild(box);
    });

    if (isResizing) {
        // Simple re-render on resize for now, animations can be added
        arrayVisualization.innerHTML = '';
        arrayVisualization.appendChild(fragment);
    } else {
        // Staggered animation for initial load and updates
        arrayVisualization.innerHTML = '';
        Array.from(fragment.children).forEach((box, i) => {
            setTimeout(() => {
                arrayVisualization.appendChild(box);
                box.style.animation = `scaleIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
            }, i * 75);
        });
    }
};

// Render Input Fields
const renderInputFields = () => {
    inputsGrid.innerHTML = '';
    
    state.arrayData.forEach((value, index) => {
        const field = document.createElement('div');
        field.className = 'input-field';
        
        const label = document.createElement('label');
        label.textContent = `[${index}]`;
        
        const input = document.createElement('input');
        input.type = 'number';
        input.value = value;
        input.placeholder = '1-99';
        input.dataset.index = index;
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') updateArrayValue(index, input.value);
        });
        
        input.addEventListener('keydown', handleInputKeydown);
        input.addEventListener('focus', () => handleInputFocus(index));
        input.addEventListener('blur', () => {
            updateArrayValue(index, input.value);
            handleInputBlur(index);
        });
        
        field.appendChild(label);
        field.appendChild(input);
        inputsGrid.appendChild(field);
    });
};

// Handle Size Change
const handleSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    clearSizeError();

    if (Number.isNaN(newSize) || newSize < 1) {
        showSizeError('Please enter a size greater than or equal to 1');
        sizeInput.value = state.arraySize;
        return;
    }

    if (newSize > 8) {
        showSizeError('Please enter a size less than or equal to 8');
        sizeInput.value = state.arraySize;
        return;
    }

    const oldSize = state.arraySize;
    state.arraySize = newSize;

    if (newSize > oldSize) {
        const newElements = Array.from({ length: newSize - oldSize }, () => getRandomInt(1, 99));
        state.arrayData.push(...newElements);
    } else {
        // Animate out old boxes before removing data
        const boxes = arrayVisualization.querySelectorAll('.array-box');
        for (let i = newSize; i < oldSize; i++) {
            const box = boxes[i];
            if (box) {
                box.style.animation = `scaleOut 0.3s ease-out forwards`;
            }
        }
        state.arrayData = state.arrayData.slice(0, newSize);
    }

    // Use a timeout to allow scaleOut animation to play
    setTimeout(() => {
        renderArray(true); // Re-render after animation
        renderInputFields();
        clearStatus();
    }, oldSize > newSize ? 300 : 0);
};

const showSizeError = (message) => {
    sizeError.textContent = message;
    sizeError.classList.add('show');
    setTimeout(() => {
        sizeError.classList.remove('show');
    }, 3000);
};

const clearSizeError = () => {
    sizeError.classList.remove('show');
};

// Update Array Value
const updateArrayValue = (index, value) => {
    if (state.isRunning) return;
    
    clearError();
    
    if (value === '') {
        state.arrayData[index] = null;
        renderArray();
        renderInputFields();
        return;
    }
    
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 1 || numValue > 99) {
        showError('Please enter integers between 1 and 99');
        const inputField = document.querySelector(`input[data-index="${index}"]`);
        if (inputField) {
            inputField.value = state.arrayData[index];
        }
        return;
    }
    
    state.arrayData[index] = numValue;
    renderArray();
    highlightBox(index);
};

// Highlight Array Box
const highlightBox = (index) => {
    const box = document.querySelector(`[data-index="${index}"]`);
    if (box) {
        box.classList.add('active');
        setTimeout(() => box.classList.remove('active'), 300);
    }
};

// Show Error Message
const showError = (message) => {
    inputError.textContent = message;
    inputError.classList.add('show');
    setTimeout(() => {
        inputError.classList.remove('show');
    }, 3000);
};

// Clear Error Message
const clearError = () => {
    inputError.classList.remove('show');
};

// Clear Status
const clearStatus = () => {
    statusDisplay.textContent = '';
    statusDisplay.className = 'status-display hidden';
};

const renderArrayView = () => {
    renderArray(true);
    renderInputFields();
    clearStatus();
    clearSearch();
    typeArrayDefinition();
};

const renderStackView = () => {
    renderStack();
    clearStackStatus();
    stackInput.value = '';
    typeStackDefinition();
};

const renderQueueView = () => {
    renderQueue();
    clearQueueStatus();
    queueInput.value = '';
    typeQueueDefinition();
};

const renderQueuePlaceholder = () => {
    clearStatus();
    clearSearch();
    clearStackStatus();
    clearQueueStatus();
};

const setOperationStatus = (message, stateClass = '') => {
    statusDisplay.textContent = message;
    statusDisplay.className = 'status-display';
    if (stateClass) {
        statusDisplay.classList.add(stateClass);
    }
};

// Handle Traverse Operation
const handleTraverse = async () => {
    if (state.isRunning) return;
    
    state.isRunning = true;
    traverseBtn.disabled = true;
    clearStatus();
    
    for (let i = 0; i < state.arrayData.length; i++) {
        const box = document.querySelector(`[data-index="${i}"]`);
        box.classList.add('visiting');
        setOperationStatus(`Currently visiting index ${i}`);
        
        await sleep(600);
        box.classList.remove('visiting');
    }
    
    setOperationStatus('Traversal complete!');
    state.isRunning = false;
    traverseBtn.disabled = false;
};

// Toggle Search Section
const toggleSearch = () => {
    if (searchSection.classList.contains('hidden')) {
        searchSection.classList.remove('hidden');
        searchInput.focus();
    } else {
        searchSection.classList.add('hidden');
        clearSearch();
    }
};

// Perform Search
const performSearch = async () => {
    if (state.isRunning) return;

    if (!searchInput.value) {
        setOperationStatus('Enter a value to search', 'failure');
        searchInput.focus();
        return;
    }
    
    const target = parseInt(searchInput.value);
    if (isNaN(target)) {
        setOperationStatus('Please enter a valid number', 'failure');
        return;
    }
    
    state.isRunning = true;
    searchActionBtn.disabled = true;
    clearAllHighlights();
    setOperationStatus(`Searching for ${target}...`, 'checking');
    
    let found = false;
    let foundIndex = -1;
    
    for (let i = 0; i < state.arrayData.length; i++) {
        const box = document.querySelector(`[data-index="${i}"]`);
        if (state.arrayData[i] === null || state.arrayData[i] === undefined) continue;
        
        box.classList.add('comparing');
        setOperationStatus(`Checking index ${i} for ${target}`, 'checking');
        
        await sleep(500);
        
        if (state.arrayData[i] === target) {
            found = true;
            foundIndex = i;
            box.classList.remove('comparing');
            box.classList.add('found');
            setOperationStatus(`Element found at index ${i}!`, 'success');
            break;
        }
        
        box.classList.remove('comparing');
    }
    
    if (!found) {
        setOperationStatus('Element not found in array', 'failure');
    }
    
    state.isRunning = false;
    searchActionBtn.disabled = false;
};

// Clear Search
const clearSearch = () => {
    searchInput.value = '';
    clearStatus();
    clearAllHighlights();
};

// Handle Sort Operation
const handleSort = async () => {
    if (state.isRunning) return;

    state.isRunning = true;
    sortBtn.disabled = true;
    clearStatus();
    clearAllHighlights();

    if (isArraySorted(state.arrayData)) {
        setOperationStatus('Array is already sorted', 'success');
        showAlreadySortedFeedback();
        await sleep(900);
        state.isRunning = false;
        sortBtn.disabled = false;
        return;
    }

    arrayVisualization.classList.add('sorting-active');
    await sleep(500);

    const arr = [...state.arrayData];
    const n = arr.length;
    let swapCount = 0;
    let passCount = 0;

    for (let i = 0; i < n - 1; i++) {
        passCount++;
        let swapped = false;
        setOperationStatus(`Pass ${passCount}: Comparing elements`);

        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] === null || arr[j + 1] === null) continue;

            const box1 = document.querySelector(`.array-box[data-index="${j}"]`);
            const box2 = document.querySelector(`.array-box[data-index="${j + 1}"]`);

            box1.classList.add('comparing');
            box2.classList.add('comparing');
            setOperationStatus(`Pass ${passCount}: Comparing ${arr[j]} and ${arr[j + 1]}`);
            await sleep(700);

            if (arr[j] > arr[j + 1]) {
                swapped = true;
                swapCount++;
                setOperationStatus(`Pass ${passCount}: Swapping ${arr[j]} and ${arr[j+1]}`);

                await animateSwap(box1, box2);
                
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                state.arrayData = [...arr];
                renderArray(true);
                restoreSortedTail(n - i);
                await sleep(160);
            } else {
                box1.classList.remove('comparing');
                box2.classList.remove('comparing');
                await sleep(180);
            }
        }
        
        const sortedBox = document.querySelector(`.array-box[data-index="${n - 1 - i}"]`);
        if (sortedBox) {
            if (sortedBox && state.arrayData[n - 1 - i] !== null) {
            sortedBox.classList.add('sorted', 'pass-complete');
        }
        }
        await sleep(360);

        if (!swapped) {
            for (let k = 0; k < n - i; k++) {
                const sortedBox = document.querySelector(`.array-box[data-index="${k}"]`);
                if (sortedBox && state.arrayData[k] !== null) sortedBox.classList.add('sorted', 'pass-complete');
            }
            break;
        }
    }
    
    state.arrayData = arr;
    renderArray(true);
    
    document.querySelectorAll('.array-box').forEach(box => {
        const idx = parseInt(box.dataset.index, 10);
        if (state.arrayData[idx] !== null) {
            box.classList.add('sorted', 'pass-complete');
        }
    });

    setOperationStatus(`Sorting complete! ${swapCount} swaps in ${passCount} passes`);

    arrayVisualization.classList.remove('sorting-active');

    state.isRunning = false;
    sortBtn.disabled = false;
};
const isArraySorted = (array) => {
    for (let i = 0; i < array.length - 1; i++) {
        if (array[i] !== null && array[i + 1] !== null && array[i] > array[i + 1]) {
            return false;
        }
    }

    return true;
};

const showAlreadySortedFeedback = () => {
    document.querySelectorAll('.array-box').forEach(box => {
        const idx = parseInt(box.dataset.index, 10);
        if (state.arrayData[idx] !== null) {
            box.classList.add('sorted', 'already-sorted');
        }
    });
};

const restoreSortedTail = (startIndex) => {
    for (let i = startIndex; i < state.arrayData.length; i++) {
        const box = document.querySelector(`.array-box[data-index="${i}"]`);
        if (box) box.classList.add('sorted');
    }
};

const animateSwap = async (box1, box2) => {
    const box1Rect = box1.getBoundingClientRect();
    const box2Rect = box2.getBoundingClientRect();
    const distance = box2Rect.left - box1Rect.left;

    box1.classList.remove('comparing');
    box2.classList.remove('comparing');
    box1.classList.add('moving', 'swapping');
    box2.classList.add('moving', 'swapping');

    box1.style.transform = `translateX(${distance}px)`;
    box2.style.transform = `translateX(-${distance}px)`;

    await sleep(720);

    box1.style.transform = '';
    box2.style.transform = '';

    box1.classList.remove('moving', 'swapping');
    box2.classList.remove('moving', 'swapping');
};

const renderStack = (highlightTop = false) => {
    if (!stackItems) return;

    stackItems.innerHTML = '';

    state.stackData.forEach((value, index) => {
        const item = document.createElement('div');
        item.className = 'stack-item';
        item.dataset.stackIndex = index;
        item.textContent = value;

        if (index === state.stackData.length - 1) {
            item.classList.add('top');
            if (highlightTop) {
                item.classList.add('just-added');
            }
        }

        stackItems.appendChild(item);
    });

    stackEmptyState.classList.toggle('hidden', state.stackData.length > 0);
    stackBase.textContent = `${state.stackData.length} ${state.stackData.length === 1 ? 'element' : 'elements'}`;
    updateStackSizeDisplay();
};

const updateStackSizeDisplay = () => {
    stackSizeDisplay.textContent = `${state.stackData.length} / ${STACK_MAX_SIZE}`;
    stackSizeDisplay.classList.toggle('full', state.stackData.length === STACK_MAX_SIZE);
    stackSizeDisplay.classList.add('updated');
    setTimeout(() => {
        stackSizeDisplay.classList.remove('updated');
    }, 260);
};

const setStackStatus = (message, stateClass = '') => {
    stackStatus.textContent = message;
    stackStatus.className = 'status-display';
    if (stateClass) {
        stackStatus.classList.add(stateClass);
    }
};

const clearStackStatus = () => {
    stackStatus.textContent = '';
    stackStatus.className = 'status-display hidden';
    clearStackError();
};

const showStackError = (message) => {
    stackError.textContent = message;
    stackError.classList.add('show');
    setTimeout(() => {
        stackError.classList.remove('show');
    }, 3000);
};

const clearStackError = () => {
    stackError.classList.remove('show');
};

const setStackControlsDisabled = (isDisabled) => {
    pushBtn.disabled = isDisabled;
    popBtn.disabled = isDisabled;
    peekBtn.disabled = isDisabled;
    stackInput.disabled = isDisabled;
};

const createStackArrow = (direction) => {
    const arrow = document.createElement('div');
    arrow.className = `stack-arrow ${direction}`;
    stackMotionLayer.appendChild(arrow);
};

const reactStackShell = (className = 'reacting', duration = 360) => {
    stackShell.classList.add(className);
    setTimeout(() => {
        stackShell.classList.remove(className);
    }, duration);
};

const showStackWarning = (message) => {
    setStackStatus(message, 'failure');
    stackWarningLabel.textContent = message.includes('Overflow') ? 'STACK OVERFLOW' : 'STACK UNDERFLOW';
    stackWarningLabel.classList.remove('hidden');
    stackShell.classList.add('warning');
    stackVisualizationPanel.classList.add('warning');

    setTimeout(() => {
        stackShell.classList.remove('warning');
        stackVisualizationPanel.classList.remove('warning');
        stackWarningLabel.classList.add('hidden');
    }, 760);
};

const animatePushPreview = async (value) => {
    stackMotionLayer.innerHTML = '';
    createStackArrow('push');

    const movingItem = document.createElement('div');
    movingItem.className = 'stack-moving-item pushing';
    movingItem.textContent = value;
    stackMotionLayer.appendChild(movingItem);

    await sleep(820);
    stackMotionLayer.innerHTML = '';
};

const handlePush = async () => {
    if (state.isStackRunning) return;

    const value = parseInt(stackInput.value, 10);
    clearStackError();

    if (!Number.isInteger(value)) {
        showStackError('Please enter a valid integer');
        setStackStatus('Push needs a valid integer value', 'failure');
        stackInput.focus();
        return;
    }

    if (state.stackData.length >= STACK_MAX_SIZE) {
        showStackError('Stack Overflow — maximum capacity reached');
        showStackWarning('Stack Overflow — maximum capacity reached');
        return;
    }

    state.isStackRunning = true;
    setStackControlsDisabled(true);
    setStackStatus(`Pushing ${value} into the stack`, 'checking');

    await animatePushPreview(value);
    reactStackShell();
    state.stackData.push(value);
    renderStack(true);

    stackInput.value = '';
    setStackStatus(`${value} pushed to the top of the stack`, 'success');
    state.isStackRunning = false;
    setStackControlsDisabled(false);
    stackInput.focus();
};

const handlePop = async () => {
    if (state.isStackRunning) return;

    clearStackError();

    if (state.stackData.length === 0) {
        showStackError('Stack Underflow — no elements to remove');
        showStackWarning('Stack Underflow — no elements to remove');
        return;
    }

    state.isStackRunning = true;
    setStackControlsDisabled(true);

    const topValue = state.stackData[state.stackData.length - 1];
    const topItem = stackItems.querySelector('.stack-item.top');
    stackMotionLayer.innerHTML = '';
    createStackArrow('pop');
    setStackStatus(`Popping ${topValue} from the top`, 'checking');
    reactStackShell();

    if (topItem) {
        topItem.classList.add('popping');
    }

    await sleep(720);
    state.stackData.pop();
    renderStack();
    stackMotionLayer.innerHTML = '';

    setStackStatus(`${topValue} popped from the stack`, 'success');
    state.isStackRunning = false;
    setStackControlsDisabled(false);
};

const handlePeek = async () => {
    if (state.isStackRunning) return;

    clearStackError();

    if (state.stackData.length === 0) {
        showStackError('Stack is empty. Push an element first.');
        setStackStatus('Stack is empty', 'failure');
        return;
    }

    state.isStackRunning = true;
    setStackControlsDisabled(true);

    const topValue = state.stackData[state.stackData.length - 1];
    const topItem = stackItems.querySelector('.stack-item.top');
    stackMotionLayer.innerHTML = '';
    reactStackShell('peeking', 900);

    if (topItem) {
        topItem.classList.add('peeking');
    }

    setStackStatus(`Top element is: ${topValue}`, 'success');
    await sleep(900);

    if (topItem) {
        topItem.classList.remove('peeking');
    }

    stackMotionLayer.innerHTML = '';
    state.isStackRunning = false;
    setStackControlsDisabled(false);
};

const renderQueue = (highlightIndex = -1, animatePositions = false) => {
    if (!queueItems) return;

    const previousRects = new Map();
    if (animatePositions) {
        queueItems.querySelectorAll('.queue-item').forEach(item => {
            previousRects.set(item.dataset.queueId, item.getBoundingClientRect());
        });
    }

    queueItems.innerHTML = '';

    state.queueData.forEach((entry, index) => {
        const item = document.createElement('div');
        item.className = 'queue-item';
        item.dataset.queueIndex = index;
        item.dataset.queueId = entry.id;
        item.textContent = entry.value;

        if (index === 0) item.classList.add('front');
        if (index === state.queueData.length - 1) item.classList.add('rear');
        if (index === highlightIndex) item.classList.add('just-added');

        queueItems.appendChild(item);
    });

    queueEmptyState.classList.toggle('hidden', state.queueData.length > 0);
    updateQueueSizeDisplay();

    if (animatePositions) {
        animateQueuePositionChanges(previousRects);
    }
};

const animateQueuePositionChanges = (previousRects) => {
    queueItems.querySelectorAll('.queue-item').forEach(item => {
        const previousRect = previousRects.get(item.dataset.queueId);
        if (!previousRect) return;

        const nextRect = item.getBoundingClientRect();
        const deltaX = previousRect.left - nextRect.left;
        const deltaY = previousRect.top - nextRect.top;

        if (deltaX === 0 && deltaY === 0) return;

        item.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        item.style.transition = 'none';

        requestAnimationFrame(() => {
            item.style.transition = 'transform 0.58s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease, border-color 0.3s ease';
            item.style.transform = '';
        });
    });
};

const updateQueueSizeDisplay = () => {
    queueSizeDisplay.textContent = `${state.queueData.length} / ${QUEUE_MAX_SIZE}`;
    queueSizeDisplay.classList.toggle('full', state.queueData.length === QUEUE_MAX_SIZE);
    queueSizeDisplay.classList.add('updated');
    setTimeout(() => {
        queueSizeDisplay.classList.remove('updated');
    }, 260);
};

const setQueueStatus = (message, stateClass = '') => {
    queueStatus.textContent = message;
    queueStatus.className = 'status-display';
    if (stateClass) {
        queueStatus.classList.add(stateClass);
    }
};

const clearQueueStatus = () => {
    queueStatus.textContent = '';
    queueStatus.className = 'status-display hidden';
    queueMotionLayer.innerHTML = '';
    queueItems.classList.remove('shifting-left');
    queueChamber.classList.remove('warning');
    queueVisualizationPanel.classList.remove('warning');
    queueWarningLabel.classList.add('hidden');
};

const setQueueControlsDisabled = (isDisabled) => {
    enqueueBtn.disabled = isDisabled;
    dequeueBtn.disabled = isDisabled;
    frontBtn.disabled = isDisabled;
    rearBtn.disabled = isDisabled;
    queuePeekBtn.disabled = isDisabled;
    queueInput.disabled = isDisabled;
};

const showQueueWarning = (message) => {
    setQueueStatus(message, 'failure');
    queueWarningLabel.textContent = message.includes('Overflow') ? 'QUEUE OVERFLOW' : 'QUEUE UNDERFLOW';
    queueWarningLabel.classList.remove('hidden');
    queueChamber.classList.add('warning');
    queueVisualizationPanel.classList.add('warning');

    setTimeout(() => {
        queueChamber.classList.remove('warning');
        queueVisualizationPanel.classList.remove('warning');
        queueWarningLabel.classList.add('hidden');
    }, 760);
};

const createQueueArrow = (direction) => {
    const arrow = document.createElement('div');
    arrow.className = `queue-arrow ${direction}`;
    queueMotionLayer.appendChild(arrow);
};

const animateEnqueuePreview = async (value) => {
    queueMotionLayer.innerHTML = '';
    createQueueArrow('enqueue');

    const movingItem = document.createElement('div');
    movingItem.className = 'queue-moving-item enqueuing';
    movingItem.textContent = value;
    queueMotionLayer.appendChild(movingItem);

    await sleep(860);
    queueItems.classList.add('recentering');
    setTimeout(() => {
        queueItems.classList.remove('recentering');
    }, 300);
    queueMotionLayer.innerHTML = '';
};

const handleEnqueue = async () => {
    if (state.isQueueRunning) return;

    const value = parseInt(queueInput.value, 10);
    if (!Number.isInteger(value)) {
        setQueueStatus('Insert needs a valid integer value', 'failure');
        queueInput.focus();
        return;
    }

    if (state.queueData.length >= QUEUE_MAX_SIZE) {
        showQueueWarning('Queue Overflow — maximum capacity reached');
        return;
    }

    state.isQueueRunning = true;
    setQueueControlsDisabled(true);
    setQueueStatus(`Inserting ${value} at the rear`, 'checking');

    const rearItem = queueItems.querySelector('.queue-item.rear');
    if (rearItem) rearItem.classList.add('highlight');

    await animateEnqueuePreview(value);
    state.queueData.push({
        id: `queue-item-${state.queueItemId}`,
        value
    });
    state.queueItemId++;
    renderQueue(state.queueData.length - 1, true);

    queueInput.value = '';
    setQueueStatus(`${value} inserted at the rear of the queue`, 'success');
    state.isQueueRunning = false;
    setQueueControlsDisabled(false);
    queueInput.focus();
};

const handleDequeue = async () => {
    if (state.isQueueRunning) return;

    if (state.queueData.length === 0) {
        showQueueWarning('Queue Underflow — no elements to remove');
        return;
    }

    state.isQueueRunning = true;
    setQueueControlsDisabled(true);

    const frontValue = state.queueData[0].value;
    const frontItem = queueItems.querySelector('.queue-item.front');
    queueMotionLayer.innerHTML = '';
    createQueueArrow('dequeue');
    setQueueStatus(`Deleting ${frontValue} from the front`, 'checking');

    if (frontItem) {
        frontItem.classList.add('dequeuing');
    }

    await sleep(780);
    state.queueData.shift();
    renderQueue(-1, true);
    queueItems.classList.add('recentering');
    setTimeout(() => {
        queueItems.classList.remove('recentering');
    }, 300);
    queueMotionLayer.innerHTML = '';

    setQueueStatus(`${frontValue} deleted from the front of the queue`, 'success');
    state.isQueueRunning = false;
    setQueueControlsDisabled(false);
};

const highlightQueueEnd = async (operation) => {
    if (state.isQueueRunning) return;

    if (state.queueData.length === 0) {
        showQueueWarning('Queue Underflow — queue is empty');
        return;
    }

    state.isQueueRunning = true;
    setQueueControlsDisabled(true);

    const isRear = operation === 'rear';
    const isFront = operation === 'front';
    const index = isRear ? state.queueData.length - 1 : 0;
    const item = queueItems.querySelector(`.queue-item[data-queue-index="${index}"]`);
    const label = isRear ? 'Rear' : operation === 'front' ? 'Front' : 'Peek';

    if (item) {
        item.classList.add('highlight');
        // Add operation-specific class for styling
        if (isRear) item.classList.add('highlight-rear');
        if (isFront) item.classList.add('highlight-front');
    }
    
    setQueueStatus(`${label} element is: ${state.queueData[index].value}`, 'success');

    await sleep(900);
    if (item) {
        item.classList.remove('highlight');
        item.classList.remove('highlight-rear');
        item.classList.remove('highlight-front');
    }

    state.isQueueRunning = false;
    setQueueControlsDisabled(false);
};

const typeArrayDefinition = async () => {
    const typingToken = state.arrayDefinitionTypingToken + 1;
    state.arrayDefinitionTypingToken = typingToken;
    await typeStackText(arrayDefinitionText, arrayDefinition, 22, typingToken, 'arrayDefinitionTypingToken');
};

const typeStackDefinition = async () => {
    const typingToken = state.stackDefinitionTypingToken + 1;
    state.stackDefinitionTypingToken = typingToken;
    await typeStackText(stackDefinitionText, stackDefinition, 22, typingToken, 'stackDefinitionTypingToken');
};

const handleStackLearnClick = async (e) => {
    const learnType = e.currentTarget.dataset.stackLearn;
    const definition = stackLearnDefinitions[learnType];
    const typingToken = state.stackLearnTypingToken + 1;
    state.stackLearnTypingToken = typingToken;

    stackLearnBtns.forEach(btn => {
        btn.classList.toggle('active', btn === e.currentTarget);
    });

    stackLearnPanel.classList.remove('hidden');
    await typeStackText(stackLearnPanel, definition, 24, typingToken, 'stackLearnTypingToken');
};

const typeQueueDefinition = async () => {
    const typingToken = state.queueDefinitionTypingToken + 1;
    state.queueDefinitionTypingToken = typingToken;
    await typeStackText(queueDefinitionText, queueDefinition, 22, typingToken, 'queueDefinitionTypingToken');
};

const handleQueueLearnClick = async (e) => {
    const learnType = e.currentTarget.dataset.queueLearn;
    const definition = queueLearnDefinitions[learnType];
    const typingToken = state.queueLearnTypingToken + 1;
    state.queueLearnTypingToken = typingToken;

    queueLearnBtns.forEach(btn => {
        btn.classList.toggle('active', btn === e.currentTarget);
    });

    queueLearnPanel.classList.remove('hidden');
    await typeStackText(queueLearnPanel, definition, 24, typingToken, 'queueLearnTypingToken');
};

const typeStackText = async (element, text, speed, typingToken, tokenName) => {
    element.textContent = '';

    for (let i = 0; i < text.length; i++) {
        if (typingToken !== state[tokenName]) return;
        element.textContent += text[i];
        await sleep(speed);
    }
};

// Handle Structure Selection
const handleStructureChange = (e) => {
    const structure = e.target.closest('.selector-btn').dataset.structure;

    switchStructureView(structure);
};

const switchStructureView = (structure) => {
    const selectedSection = document.querySelector(`.visualizer-section[data-structure="${structure}"]`);
    const selectedButton = document.querySelector(`.selector-btn[data-structure="${structure}"]`);

    if (!selectedSection || !selectedButton) return;

    state.currentStructure = structure;

    selectorBtns.forEach(btn => {
        btn.classList.toggle('active', btn === selectedButton);
    });

    visualizerSections.forEach(section => {
        section.classList.toggle('active', section === selectedSection);
    });

    if (structure === 'array') {
        renderArrayView();
        return;
    }

    if (structure === 'stack') {
        renderStackView();
        return;
    }

    if (structure === 'linkedlist') {
        renderLinkedListView();
        return;
    }

    renderQueueView();
};

// Show Coming Soon Toast
const showComingSoonToast = () => {
    const toast = document.getElementById('comingSoonToast');
    toast.textContent = 'Coming Soon! 🚀';
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
};

// Handle Info Click
const handleInfoClick = async (e) => {
    const infoType = e.target.dataset.info;
    const text = educationalInfo[infoType];
    const typingToken = state.infoTypingToken + 1;
    state.infoTypingToken = typingToken;
    
    infoBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    infoPanel.classList.remove('hidden');
    infoPanel.innerHTML = '';
    
    await typeText(infoPanel, text, 24, typingToken);
};

// Type Text Animation
const typeText = async (element, text, speed = 30, typingToken = state.infoTypingToken) => {
    element.textContent = '';
    
    for (let i = 0; i < text.length; i++) {
        if (typingToken !== state.infoTypingToken) return;
        element.textContent += text[i];
        await sleep(speed);
    }
};

// Clear All Highlights
const clearAllHighlights = () => {
    document.querySelectorAll('.array-box').forEach(box => {
        box.classList.remove('visiting', 'comparing', 'found', 'sorted', 'moving', 'swapping', 'pass-complete', 'already-sorted', 'active', 'focused');
    });
};

// Sleep Utility
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        clearSearch();
        clearStatus();
    }
});

// Handle Input Navigation and Highlighting
const handleInputKeydown = (e) => {
    const index = parseInt(e.target.dataset.index);
    let nextIndex;

    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        nextIndex = index > 0 ? index - 1 : state.arrayData.length - 1;
        const nextInput = document.querySelector(`input[data-index="${nextIndex}"]`);
        if (nextInput) nextInput.focus();
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextIndex = index < state.arrayData.length - 1 ? index + 1 : 0;
        const nextInput = document.querySelector(`input[data-index="${nextIndex}"]`);
        if (nextInput) nextInput.focus();
    }
};

const handleInputFocus = (index) => {
    const box = document.querySelector(`.array-box[data-index="${index}"]`);
    if (box) {
        box.classList.add('focused');
    }
};

const handleInputBlur = (index) => {
    const box = document.querySelector(`.array-box[data-index="${index}"]`);
    if (box) {
        box.classList.remove('focused');
    }
};

// ==========================================================
// LINKED LIST VISUALIZER MODULE
// All code below is fully isolated — no existing logic touched
// ==========================================================

// -- Linked List State --
const llState = {
    nodes: [],              // Array of { id: string, value: number }
    nodeIdCounter: 0,
    isRunning: false,
    definitionTypingToken: 0,
    learnTypingToken: 0
};

const LL_MAX_DESKTOP = 7;
const LL_MAX_MOBILE  = 4;

// -- Definitions --
const llDefinition = "A linked list is a linear data structure where elements are stored in nodes connected using pointers. It allows dynamic memory allocation and efficient insertions or deletions.";

const llLearnDefinitions = {
    linkedlist:  "A linked list stores elements in nodes, where each node holds data and a pointer to the next node in the chain.",
    node:        "A node is the basic unit of a linked list. It contains a data field and a next pointer that links to the following node.",
    head:        "The head is a pointer to the first node in the linked list. It serves as the entry point to traverse the entire list.",
    tail:        "The tail is the last node in the linked list. Its next pointer holds null, indicating the end of the list.",
    insertHead:  "Inserting at the head prepends a new node. The new node's next pointer links to the old head, and head is updated.",
    insertTail:  "Inserting at the tail appends a new node. The old tail's next pointer links to the new node, which then points to null.",
    insertIndex: "Inserting at an index traverses the list node by node to the target position, then links the new node between existing nodes.",
    deleteHead:  "Deleting at the head removes the first node. The head pointer is updated to point to the second node, or null if the list becomes empty.",
    deleteTail:  "Deleting at the tail removes the last node. The second-to-last node's next pointer is updated to null.",
    deleteIndex: "Deleting at an index traverses to find the target node, then removes it by reconnecting the previous node to the next node.",
    pointer:     "A pointer (next) stores the reference to the next node, creating the chain-like linked structure that gives the list its name."
};

// -- Cached DOM References (populated after DOMContentLoaded) --
let llDefinitionText, llNodeList, llEmptyState, llNodeCount, llHeadTailDisplay;
let llHeadInput, llInsertHeadBtn, llHeadError;
let llTailInput, llInsertTailBtn, llTailError;
let llIndexInput, llIndexValueInput, llInsertIndexBtn, llIndexError;
let llDeleteHeadBtn, llDeleteHeadError;
let llDeleteTailBtn, llDeleteTailError;
let llDeleteIndexInput, llDeleteIndexBtn, llDeleteIndexError;
let llStatus, llLearnPanel, llLearnBtns;
let llVisualizationPanel;

// -- Utilities --

const getLLMaxNodes = () => window.innerWidth <= 480 ? LL_MAX_MOBILE : LL_MAX_DESKTOP;

const initLLDOMRefs = () => {
    llDefinitionText  = document.getElementById('llDefinitionText');
    llNodeList        = document.getElementById('llNodeList');
    llEmptyState      = document.getElementById('llEmptyState');
    llNodeCount       = document.getElementById('llNodeCount');
    llHeadTailDisplay = document.getElementById('llHeadTailDisplay');
    llHeadInput       = document.getElementById('llHeadInput');
    llInsertHeadBtn   = document.getElementById('llInsertHeadBtn');
    llHeadError       = document.getElementById('llHeadError');
    llTailInput       = document.getElementById('llTailInput');
    llInsertTailBtn   = document.getElementById('llInsertTailBtn');
    llTailError       = document.getElementById('llTailError');
    llIndexInput      = document.getElementById('llIndexInput');
    llIndexValueInput = document.getElementById('llIndexValueInput');
    llInsertIndexBtn  = document.getElementById('llInsertIndexBtn');
    llIndexError      = document.getElementById('llIndexError');
    llDeleteHeadBtn   = document.getElementById('llDeleteHeadBtn');
    llDeleteHeadError = document.getElementById('llDeleteHeadError');
    llDeleteTailBtn   = document.getElementById('llDeleteTailBtn');
    llDeleteTailError = document.getElementById('llDeleteTailError');
    llDeleteIndexInput = document.getElementById('llDeleteIndexInput');
    llDeleteIndexBtn  = document.getElementById('llDeleteIndexBtn');
    llDeleteIndexError = document.getElementById('llDeleteIndexError');
    llStatus          = document.getElementById('llStatus');
    llLearnPanel      = document.getElementById('llLearnPanel');
    llLearnBtns       = document.querySelectorAll('.ll-learn-btn');
    llVisualizationPanel = document.querySelector('.ll-visualization-panel');
};

// -- Head / Tail Display --
const updateLLHeadTailDisplay = () => {
    if (!llHeadTailDisplay) return;
    if (llState.nodes.length === 0) {
        llHeadTailDisplay.innerHTML = `
            <div class="ll-ht-item">
                <span class="ll-ht-name">Head</span>
                <span class="ll-ht-arrow">→</span>
                <span class="ll-ht-value ll-ht-null">null</span>
            </div>
            <div class="ll-ht-sep">·</div>
            <div class="ll-ht-item">
                <span class="ll-ht-name">Tail</span>
                <span class="ll-ht-arrow">→</span>
                <span class="ll-ht-value ll-ht-null">null</span>
            </div>`;
    } else {
        const headVal = llState.nodes[0].value;
        const tailVal = llState.nodes[llState.nodes.length - 1].value;
        llHeadTailDisplay.innerHTML = `
            <div class="ll-ht-item">
                <span class="ll-ht-name">Head</span>
                <span class="ll-ht-arrow">→</span>
                <span class="ll-ht-value">${headVal}</span>
            </div>
            <div class="ll-ht-sep">·</div>
            <div class="ll-ht-item">
                <span class="ll-ht-name">Tail</span>
                <span class="ll-ht-arrow">→</span>
                <span class="ll-ht-value">${tailVal}</span>
            </div>`;
    }
};

// -- Render Linked List --
const renderLinkedList = (highlightIds = [], newNodeId = null) => {
    if (!llNodeList) return;

    const maxNodes = getLLMaxNodes();
    if (llNodeCount) {
        llNodeCount.textContent = `${llState.nodes.length} / ${maxNodes}`;
        llNodeCount.classList.toggle('ll-count-full', llState.nodes.length >= maxNodes);
        llNodeCount.classList.add('updated');
        setTimeout(() => llNodeCount.classList.remove('updated'), 260);
    }

    updateLLHeadTailDisplay();

    if (llState.nodes.length === 0) {
        if (llEmptyState) llEmptyState.classList.remove('hidden');
        llNodeList.innerHTML = '';
        return;
    }

    if (llEmptyState) llEmptyState.classList.add('hidden');
    llNodeList.innerHTML = '';

    const fragment = document.createDocumentFragment();

    llState.nodes.forEach((node, index) => {
        const isFirst      = index === 0;
        const isLast       = index === llState.nodes.length - 1;
        const isHighlighted = highlightIds.includes(node.id);
        const isNew        = node.id === newNodeId;

        // ---- Node Wrapper (pointer label + node box) ----
        const wrapper = document.createElement('div');
        wrapper.className = 'll-node-wrapper';

        // Pointer label row (HEAD / TAIL / spacer)
        const ptrRow = document.createElement('div');
        ptrRow.className = 'll-ptr-label-row';

        if (isFirst && isLast) {
            ptrRow.innerHTML = '<span class="ll-ptr-badge ll-head-badge">HEAD / TAIL</span>';
        } else if (isFirst) {
            ptrRow.innerHTML = '<span class="ll-ptr-badge ll-head-badge">HEAD</span>';
        } else if (isLast) {
            ptrRow.innerHTML = '<span class="ll-ptr-badge ll-tail-badge">TAIL</span>';
        } else {
            ptrRow.innerHTML = '&nbsp;';  // spacer keeps alignment consistent
        }
        wrapper.appendChild(ptrRow);

        // Node box: [data | next]
        const nodeEl = document.createElement('div');
        nodeEl.className = 'll-node';
        nodeEl.dataset.llId = node.id;
        if (isHighlighted) nodeEl.classList.add('ll-node--traverse');
        if (isNew)         nodeEl.classList.add('ll-node--new');
        if (isFirst)       nodeEl.classList.add('ll-node--head');
        if (isLast)        nodeEl.classList.add('ll-node--tail');

        const dataDiv = document.createElement('div');
        dataDiv.className = 'll-node__data';
        dataDiv.textContent = node.value;

        const sepDiv = document.createElement('div');
        sepDiv.className = 'll-node__sep';

        const nextDiv = document.createElement('div');
        nextDiv.className = 'll-node__next';
        nextDiv.textContent = isLast ? '∅' : '→';

        nodeEl.appendChild(dataDiv);
        nodeEl.appendChild(sepDiv);
        nodeEl.appendChild(nextDiv);
        wrapper.appendChild(nodeEl);

        fragment.appendChild(wrapper);

        // ---- Connector or null label ----
        if (!isLast) {
            const conn = document.createElement('div');
            conn.className = 'll-connector';
            fragment.appendChild(conn);
        } else {
            // null connector after last node
            const nullConn = document.createElement('div');
            nullConn.className = 'll-null-conn';

            const nullLine = document.createElement('div');
            nullLine.className = 'll-conn-line';

            const nullLabel = document.createElement('span');
            nullLabel.className = 'll-null-label';
            nullLabel.textContent = 'null';

            nullConn.appendChild(nullLine);
            nullConn.appendChild(nullLabel);
            fragment.appendChild(nullConn);
        }
    });

    llNodeList.appendChild(fragment);
};

// -- Status / Error Helpers --
const setLLStatus = (message, stateClass = '') => {
    if (!llStatus) return;
    llStatus.textContent = message;
    llStatus.className = 'status-display';
    if (stateClass) llStatus.classList.add(stateClass);
    
    // Auto-hide failure messages after 4 seconds for better UX
    if (stateClass === 'failure') {
        setTimeout(() => {
            if (llStatus && llStatus.classList.contains('failure')) {
                clearLLStatus();
            }
        }, 4000);
    }
};

const clearLLStatus = () => {
    if (!llStatus) return;
    llStatus.textContent = '';
    llStatus.className = 'status-display hidden';
};

const showLLFieldError = (element, message) => {
    if (!element) return;
    element.textContent = message;
    element.classList.add('show');
    setTimeout(() => element.classList.remove('show'), 3000);
};

const clearLLFieldError = (element) => {
    if (element) element.classList.remove('show');
};

const triggerLLErrorGlow = () => {
    if (!llVisualizationPanel) return;
    llVisualizationPanel.classList.add('ll-error-state');
    // Remove error state after delay to allow smooth fade-out transition
    setTimeout(() => llVisualizationPanel.classList.remove('ll-error-state'), 900);
};

const resetLLInvalidInputs = () => {
    if (llHeadInput) llHeadInput.value = '';
    if (llTailInput) llTailInput.value = '';
    if (llIndexInput) llIndexInput.value = '';
    if (llIndexValueInput) llIndexValueInput.value = '';
    if (llDeleteIndexInput) llDeleteIndexInput.value = '';
};

const setLLControlsDisabled = (disabled) => {
    [llInsertHeadBtn, llInsertTailBtn, llInsertIndexBtn,
     llDeleteHeadBtn, llDeleteTailBtn, llDeleteIndexBtn,
     llHeadInput, llTailInput, llIndexInput, llIndexValueInput, llDeleteIndexInput
    ].forEach(el => { if (el) el.disabled = disabled; });
};

// -- Operation: Insert at Head --
const handleLLInsertHead = async () => {
    if (llState.isRunning) return;
    clearLLFieldError(llHeadError);
    clearLLStatus();

    const raw = llHeadInput ? llHeadInput.value.trim() : '';
    if (raw === '' || isNaN(Number(raw)) || !Number.isInteger(Number(raw))) {
        showLLFieldError(llHeadError, 'Please enter a valid integer');
        triggerLLErrorGlow();
        setLLStatus('Invalid input — please enter a valid integer', 'failure');
        resetLLInvalidInputs();
        return;
    }

    const value = parseInt(raw, 10);
    const maxNodes = getLLMaxNodes();

    if (llState.nodes.length >= maxNodes) {
        triggerLLErrorGlow();
        setLLStatus(`Maximum node limit reached for smooth visualization (${maxNodes} nodes max)`, 'failure');
        resetLLInvalidInputs();
        return;
    }

    llState.isRunning = true;
    setLLControlsDisabled(true);
    setLLStatus(`Inserting ${value} at the head...`, 'checking');

    const newId = `ll-node-${llState.nodeIdCounter++}`;
    llState.nodes.unshift({ id: newId, value });
    renderLinkedList([], newId);

    if (llHeadInput) llHeadInput.value = '';
    await sleep(650);

    setLLStatus(`${value} inserted at the head`, 'success');
    llState.isRunning = false;
    setLLControlsDisabled(false);
    if (llHeadInput) llHeadInput.focus();
};

// -- Operation: Insert at Tail --
const handleLLInsertTail = async () => {
    if (llState.isRunning) return;
    clearLLFieldError(llTailError);
    clearLLStatus();

    const raw = llTailInput ? llTailInput.value.trim() : '';
    if (raw === '' || isNaN(Number(raw)) || !Number.isInteger(Number(raw))) {
        showLLFieldError(llTailError, 'Please enter a valid integer');
        triggerLLErrorGlow();
        setLLStatus('Invalid input — please enter a valid integer', 'failure');
        resetLLInvalidInputs();
        return;
    }

    const value = parseInt(raw, 10);
    const maxNodes = getLLMaxNodes();

    if (llState.nodes.length >= maxNodes) {
        triggerLLErrorGlow();
        setLLStatus(`Maximum node limit reached for smooth visualization (${maxNodes} nodes max)`, 'failure');
        resetLLInvalidInputs();
        return;
    }

    llState.isRunning = true;
    setLLControlsDisabled(true);
    setLLStatus(`Inserting ${value} at the tail...`, 'checking');

    // Briefly highlight the current tail node before linking
    if (llState.nodes.length > 0) {
        const currentTailId = llState.nodes[llState.nodes.length - 1].id;
        renderLinkedList([currentTailId], null);
        setLLStatus(`Linking from current tail (${llState.nodes[llState.nodes.length - 1].value})...`, 'checking');
        await sleep(520);
    }

    const newId = `ll-node-${llState.nodeIdCounter++}`;
    llState.nodes.push({ id: newId, value });
    renderLinkedList([], newId);

    if (llTailInput) llTailInput.value = '';
    await sleep(650);

    setLLStatus(`${value} inserted at the tail`, 'success');
    llState.isRunning = false;
    setLLControlsDisabled(false);
    if (llTailInput) llTailInput.focus();
};

// -- Operation: Insert at Index --
const handleLLInsertAtIndex = async () => {
    if (llState.isRunning) return;
    clearLLFieldError(llIndexError);
    clearLLStatus();

    const indexRaw = llIndexInput ? llIndexInput.value.trim() : '';
    const valueRaw = llIndexValueInput ? llIndexValueInput.value.trim() : '';

    if (indexRaw === '' || isNaN(Number(indexRaw)) || !Number.isInteger(Number(indexRaw))) {
        showLLFieldError(llIndexError, 'Please enter a valid index (integer ≥ 0)');
        triggerLLErrorGlow();
        setLLStatus('Invalid index — please enter a valid integer', 'failure');
        resetLLInvalidInputs();
        return;
    }
    if (valueRaw === '' || isNaN(Number(valueRaw)) || !Number.isInteger(Number(valueRaw))) {
        showLLFieldError(llIndexError, 'Please enter a valid integer value');
        triggerLLErrorGlow();
        setLLStatus('Invalid value — please enter a valid integer', 'failure');
        resetLLInvalidInputs();
        return;
    }

    const index = parseInt(indexRaw, 10);
    const value = parseInt(valueRaw, 10);
    const maxNodes = getLLMaxNodes();

    if (index < 0 || index > llState.nodes.length) {
        triggerLLErrorGlow();
        setLLStatus(
            `Index out of bounds — valid range is 0 to ${llState.nodes.length}`,
            'failure'
        );
        resetLLInvalidInputs();
        return;
    }

    if (llState.nodes.length >= maxNodes) {
        triggerLLErrorGlow();
        setLLStatus(`Maximum node limit reached for smooth visualization (${maxNodes} nodes max)`, 'failure');
        resetLLInvalidInputs();
        return;
    }

    llState.isRunning = true;
    setLLControlsDisabled(true);

    // Head shortcut (index 0)
    if (index === 0) {
        setLLStatus(`Inserting ${value} at index 0 (head)...`, 'checking');
        const newId = `ll-node-${llState.nodeIdCounter++}`;
        llState.nodes.unshift({ id: newId, value });
        renderLinkedList([], newId);
        if (llIndexInput) llIndexInput.value = '';
        if (llIndexValueInput) llIndexValueInput.value = '';
        await sleep(650);
        setLLStatus(`${value} inserted at index 0 (head)`, 'success');
        llState.isRunning = false;
        setLLControlsDisabled(false);
        return;
    }

    // Traversal animation — highlight nodes one by one
    setLLStatus(`Traversing to find index ${index}...`, 'checking');
    for (let i = 0; i < index; i++) {
        renderLinkedList([llState.nodes[i].id], null);
        setLLStatus(
            `Visiting index ${i} → value: ${llState.nodes[i].value}${i === index - 1 ? ' (insertion point found!)' : ''}`,
            'checking'
        );
        await sleep(430);
    }

    // Brief pause at insertion gap then insert
    renderLinkedList([], null);
    setLLStatus(`Inserting ${value} at index ${index}...`, 'checking');
    await sleep(220);

    const newId = `ll-node-${llState.nodeIdCounter++}`;
    llState.nodes.splice(index, 0, { id: newId, value });
    renderLinkedList([], newId);

    if (llIndexInput) llIndexInput.value = '';
    if (llIndexValueInput) llIndexValueInput.value = '';
    await sleep(650);

    setLLStatus(`${value} inserted at index ${index}`, 'success');
    llState.isRunning = false;
    setLLControlsDisabled(false);
};

// -- Operation: Delete at Head --
const handleLLDeleteHead = async () => {
    if (llState.isRunning) return;
    clearLLFieldError(llDeleteHeadError);
    clearLLStatus();

    if (llState.nodes.length === 0) {
        showLLFieldError(llDeleteHeadError, 'Cannot delete from empty list');
        triggerLLErrorGlow();
        setLLStatus('Cannot delete from an empty list', 'failure');
        resetLLInvalidInputs();
        return;
    }

    llState.isRunning = true;
    setLLControlsDisabled(true);
    setLLStatus(`Deleting node at head...`, 'checking');

    // Highlight head node to indicate deletion
    const headNodeId = llState.nodes[0].id;
    renderLinkedList([headNodeId], null);
    await sleep(420);

    // Remove head node
    llState.nodes.shift();
    renderLinkedList([], null);
    await sleep(320);

    setLLStatus(llState.nodes.length > 0 ? 'Node deleted from head' : 'Node deleted from head — list is now empty', 'success');
    llState.isRunning = false;
    setLLControlsDisabled(false);
};

// -- Operation: Delete at Tail --
const handleLLDeleteTail = async () => {
    if (llState.isRunning) return;
    clearLLFieldError(llDeleteTailError);
    clearLLStatus();

    if (llState.nodes.length === 0) {
        showLLFieldError(llDeleteTailError, 'Cannot delete from empty list');
        triggerLLErrorGlow();
        setLLStatus('Cannot delete from an empty list', 'failure');
        resetLLInvalidInputs();
        return;
    }

    llState.isRunning = true;
    setLLControlsDisabled(true);
    setLLStatus(`Deleting node at tail...`, 'checking');

    // Highlight tail node to indicate deletion
    const tailNodeId = llState.nodes[llState.nodes.length - 1].id;
    renderLinkedList([tailNodeId], null);
    await sleep(420);

    // Remove tail node
    llState.nodes.pop();
    renderLinkedList([], null);
    await sleep(320);

    setLLStatus(llState.nodes.length > 0 ? 'Node deleted from tail' : 'Node deleted from tail — list is now empty', 'success');
    llState.isRunning = false;
    setLLControlsDisabled(false);
};

// -- Operation: Delete at Index --
const handleLLDeleteAtIndex = async () => {
    if (llState.isRunning) return;
    clearLLFieldError(llDeleteIndexError);
    clearLLStatus();

    const indexRaw = llDeleteIndexInput ? llDeleteIndexInput.value.trim() : '';

    if (indexRaw === '' || isNaN(Number(indexRaw)) || !Number.isInteger(Number(indexRaw))) {
        showLLFieldError(llDeleteIndexError, 'Please enter a valid index (integer ≥ 0)');
        triggerLLErrorGlow();
        setLLStatus('Invalid index — please enter a valid integer', 'failure');
        resetLLInvalidInputs();
        return;
    }

    const index = parseInt(indexRaw, 10);

    if (llState.nodes.length === 0) {
            showLLFieldError(llDeleteIndexError, 'Cannot delete from empty list');
            triggerLLErrorGlow();
            setLLStatus('Cannot delete from an empty list', 'failure');
            resetLLInvalidInputs();
            return;
        }

        if (index < 0 || index >= llState.nodes.length) {
            const maxIndex = Math.max(0, llState.nodes.length - 1);
            showLLFieldError(llDeleteIndexError, `Invalid index — valid range is 0 to ${maxIndex}`);
            triggerLLErrorGlow();
            setLLStatus(`Invalid index — valid range is 0 to ${maxIndex}`, 'failure');
            resetLLInvalidInputs();
            return;
        }

    llState.isRunning = true;
    setLLControlsDisabled(true);

    // Head shortcut (index 0)
    if (index === 0) {
        setLLStatus(`Deleting node at index 0 (head)...`, 'checking');
        const headNodeId = llState.nodes[0].id;
        renderLinkedList([headNodeId], null);
        await sleep(420);
        llState.nodes.shift();
        renderLinkedList([], null);
        if (llDeleteIndexInput) llDeleteIndexInput.value = '';
        await sleep(320);
        setLLStatus(`Node deleted at index 0 (head)${llState.nodes.length === 0 ? ' — list is now empty' : ''}`, 'success');
        llState.isRunning = false;
        setLLControlsDisabled(false);
        return;
    }

    // Traversal animation — highlight nodes one by one to target
    setLLStatus(`Traversing to index ${index}...`, 'checking');
    for (let i = 0; i < index; i++) {
        renderLinkedList([llState.nodes[i].id], null);
        setLLStatus(
            `Visiting index ${i} → value: ${llState.nodes[i].value}${i === index - 1 ? ' (target node found!)' : ''}`,
            'checking'
        );
        await sleep(430);
    }

    // Highlight target node
    renderLinkedList([llState.nodes[index].id], null);
    setLLStatus(`Found target node at index ${index} (value: ${llState.nodes[index].value}) — deleting...`, 'checking');
    await sleep(420);

    // Remove node
    llState.nodes.splice(index, 1);
    renderLinkedList([], null);

    if (llDeleteIndexInput) llDeleteIndexInput.value = '';
    await sleep(320);

    setLLStatus(`Node deleted at index ${index}${llState.nodes.length === 0 ? ' — list is now empty' : ''}`, 'success');
    llState.isRunning = false;
    setLLControlsDisabled(false);
};

// -- Typing Animation for LL Definition --
const typeLLDefinition = async () => {
    if (!llDefinitionText) return;
    const token = ++llState.definitionTypingToken;
    llDefinitionText.textContent = '';
    for (let i = 0; i < llDefinition.length; i++) {
        if (token !== llState.definitionTypingToken) return;
        llDefinitionText.textContent += llDefinition[i];
        await sleep(20);
    }
};

// -- Learn Panel --
const handleLLLearnClick = async (e) => {
    const learnType = e.currentTarget.dataset.llLearn;
    const text = llLearnDefinitions[learnType];
    if (!text || !llLearnPanel) return;

    const token = ++llState.learnTypingToken;

    llLearnBtns.forEach(btn => btn.classList.toggle('active', btn === e.currentTarget));

    llLearnPanel.classList.remove('hidden');
    llLearnPanel.textContent = '';

    for (let i = 0; i < text.length; i++) {
        if (token !== llState.learnTypingToken) return;
        llLearnPanel.textContent += text[i];
        await sleep(22);
    }
};

// -- View Renderer (called when switching to LL tab) --
const renderLinkedListView = () => {
    renderLinkedList();
    clearLLStatus();
    typeLLDefinition();
};

// -- Event Listener Setup --
const setupLLEventListeners = () => {
    if (!llInsertHeadBtn) return;  // guard: DOM refs not ready

    llInsertHeadBtn.addEventListener('click', handleLLInsertHead);
    llInsertTailBtn.addEventListener('click', handleLLInsertTail);
    llInsertIndexBtn.addEventListener('click', handleLLInsertAtIndex);

    llDeleteHeadBtn.addEventListener('click', handleLLDeleteHead);
    llDeleteTailBtn.addEventListener('click', handleLLDeleteTail);
    llDeleteIndexBtn.addEventListener('click', handleLLDeleteAtIndex);

    llHeadInput.addEventListener('keypress', e => { if (e.key === 'Enter') handleLLInsertHead(); });
    llTailInput.addEventListener('keypress', e => { if (e.key === 'Enter') handleLLInsertTail(); });
    llIndexValueInput.addEventListener('keypress', e => { if (e.key === 'Enter') handleLLInsertAtIndex(); });
    llDeleteIndexInput.addEventListener('keypress', e => { if (e.key === 'Enter') handleLLDeleteAtIndex(); });

    llLearnBtns.forEach(btn => btn.addEventListener('click', handleLLLearnClick));
};

// -- Bootstrap on DOM ready --
document.addEventListener('DOMContentLoaded', () => {
    initLLDOMRefs();
    setupLLEventListeners();
    renderLinkedList(); // draw empty state
});
