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
            if (input.value !== '') updateArrayValue(index, input.value);
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
            sortedBox.classList.add('sorted', 'pass-complete');
        }
        await sleep(360);

        if (!swapped) {
            for (let k = 0; k < n - i; k++) {
                const sortedBox = document.querySelector(`.array-box[data-index="${k}"]`);
                if (sortedBox) sortedBox.classList.add('sorted', 'pass-complete');
            }
            break;
        }
    }
    
    state.arrayData = arr;
    renderArray(true);
    
    document.querySelectorAll('.array-box').forEach(box => {
        if (box.querySelector('.array-box-value').textContent !== 'Empty') {
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
        box.classList.add('sorted', 'already-sorted');
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
