let count = 0;

const counterValue = document.getElementById('counter-value');
const incrementBtn = document.getElementById('increment-btn');
const decrementBtn = document.getElementById('decrement-btn');
const resetBtn = document.getElementById('reset-btn');
const saveBtn = document.getElementById('save-btn');
const historyLog = document.getElementById('history-log');
const clearHistoryBtn = document.getElementById('clear-history-btn');

// Update UI
function updateDisplay() {
    counterValue.textContent = count;

    // Simple visual pop on change
    counterValue.style.transform = 'scale(1.1)';
    setTimeout(() => {
        counterValue.style.transform = 'scale(1)';
    }, 100);
}

// Increment
incrementBtn.addEventListener('click', () => {
    count++;
    updateDisplay();
});

// Decrement
decrementBtn.addEventListener('click', () => {
    count--;
    updateDisplay();
});

// Reset
resetBtn.addEventListener('click', () => {
    count = 0;
    updateDisplay();
});

// Save Count
saveBtn.addEventListener('click', () => {
    // Remove empty state if it exists
    const emptyMessage = historyLog.querySelector('.empty-history');
    if (emptyMessage) {
        emptyMessage.remove();
    }

    const li = document.createElement('li');

    const timestamp = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    li.textContent = `Saved Count: ${count} at ${timestamp}`;

    // Adds newest log to the top
    historyLog.prepend(li);
});

// Clear History
clearHistoryBtn.addEventListener('click', () => {
    if (historyLog.children.length === 0) {
        alert('History is already empty!');
        return;
    }

    const confirmClear = confirm(
        'Are you sure you want to clear the history?'
    );

    if (!confirmClear) return;

    historyLog.innerHTML = '';

    const emptyState = document.createElement('li');
    emptyState.classList.add('empty-history');
    emptyState.textContent = 'No saved history available.';
    historyLog.appendChild(emptyState);
});

// Initialize Display
updateDisplay();