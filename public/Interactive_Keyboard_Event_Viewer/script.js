const initialState = document.getElementById('initial-state');
const activeState = document.getElementById('active-state');

const valKeyCode = document.getElementById('big-keycode');
const valKey = document.getElementById('val-key');
const valLocation = document.getElementById('val-location');
const valCode = document.getElementById('val-code');
const valWhich = document.getElementById('val-which');
const historyList = document.getElementById('history-list');

// Array to hold recent keys
const keyHistory = [];
const MAX_HISTORY = 5;

// Keys that should have their default action prevented to avoid page scrolling/refreshing
// Space (32), ArrowUp (38), ArrowDown (40), Slash (191), Quote (222), etc.
const keysToPreventDefault = [32, 38, 40, 191, 222];

window.addEventListener('keydown', (e) => {
    // Prevent default browser behavior for specific keys
    if (keysToPreventDefault.includes(e.keyCode) || e.key === '/') {
        e.preventDefault();
    }

    // Switch from initial state to active state on first key press
    if (initialState.classList.contains('active')) {
        initialState.classList.remove('active');
        activeState.classList.add('active');
    }

    // Determine the key representation
    let keyStr = e.key;
    if (keyStr === ' ') {
        keyStr = '(Space character)';
    } else if (keyStr === '') {
        keyStr = '(Unidentified)';
    }

    // Update main DOM elements
    valKeyCode.textContent = e.keyCode;
    valKey.textContent = keyStr;
    valLocation.textContent = e.location;
    valCode.textContent = e.code;
    valWhich.textContent = e.which;

    // Add animation effect to the main keycode
    valKeyCode.style.transform = 'scale(1.1)';
    setTimeout(() => {
        valKeyCode.style.transform = 'scale(1)';
    }, 150);

    // Update History
    updateHistory(e.key, e.keyCode);
});

function updateHistory(key, keyCode) {
    let displayKey = key;
    if (key === ' ') displayKey = 'Space';
    
    // Add to beginning of array
    keyHistory.unshift({ key: displayKey, code: keyCode });
    
    // Maintain max size
    if (keyHistory.length > MAX_HISTORY) {
        keyHistory.pop();
    }

    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    
    keyHistory.forEach((item, index) => {
        const historyEl = document.createElement('div');
        historyEl.className = 'history-item';
        if (index === 0) {
            historyEl.classList.add('newest');
        }
        
        const keySpan = document.createElement('span');
        keySpan.className = 'history-key';
        keySpan.textContent = item.key;
        
        const codeSpan = document.createElement('span');
        codeSpan.textContent = `(${item.code})`;
        
        historyEl.appendChild(keySpan);
        historyEl.appendChild(codeSpan);
        
        historyList.appendChild(historyEl);
    });
}
