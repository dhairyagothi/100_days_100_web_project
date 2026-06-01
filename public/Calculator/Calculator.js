const input = document.getElementById('inputBox');
const buttons = document.querySelectorAll('.calculator-button');
const STORAGE_KEY = 'calcHistory';
const MAX_HISTORY_ENTRIES = 50;
let string = "";
let calculated = false;
let history = loadHistory();

const pi = Math.PI;

function showConfirmToast(message, onYes, onNo) {
    const container = document.querySelector('.toast-container');

    const toast = document.createElement('div');
    toast.classList.add('toast');

    toast.innerHTML = `
        <div>${message}</div>
        <div class="toast-actions">
            <button class="yes">Yes</button>
            <button class="no">No</button>
        </div>
    `;

    container.appendChild(toast);

    const yesBtn = toast.querySelector('.yes');
    const noBtn = toast.querySelector('.no');

    const removeToast = () => {
        toast.remove();
    };

    yesBtn.addEventListener('click', () => {
        removeToast();
        if (onYes) onYes();
    });

    noBtn.addEventListener('click', () => {
        removeToast();
        if (onNo) onNo();
    });
}

function sin(value) {
    return Math.sin(Math.PI / 180 * Number(value));
}

function cos(value) {
    return Math.cos(Math.PI / 180 * Number(value));
}

function tan(value) {
    return Math.tan(Math.PI / 180 * Number(value));
}

function sqrt(value) {
    return Math.sqrt(Number(value));
}

function ln(value) {
    return Math.log(Number(value));
}

function log(value) {
    return Math.log10(Number(value));
}

function abs(value) {
    return Math.abs(Number(value));
}

function loadHistory() {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
        return [];
    }

    try {
        const parsed = JSON.parse(stored);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed
            .map(item => {
                if (typeof item === 'string') {
                    const separator = ' = ';
                    const index = item.lastIndexOf(separator);

                    if (index > 0) {
                        return {
                            expression: item.slice(0, index),
                            result: item.slice(index + separator.length),
                        };
                    }

                    return {
                        expression: item,
                        result: item,
                    };
                }

                if (
                    item &&
                    typeof item === 'object' &&
                    typeof item.expression === 'string' &&
                    typeof item.result === 'string'
                ) {
                    return item;
                }

                return null;
            })
            .filter(Boolean);
    } catch {
        return [];
    }
}

function saveHistory() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function normalizeExpression(expression) {
    return expression.replace(/\^/g, '**');
}

function addHistoryEntry(expression, result) {
    const latestEntry = history[0];

    if (
        latestEntry &&
        latestEntry.expression === expression &&
        latestEntry.result === result
    ) {
        return;
    }

    history.unshift({ expression, result });

    if (history.length > MAX_HISTORY_ENTRIES) {
        history = history.slice(0, MAX_HISTORY_ENTRIES);
    }

    saveHistory();
    renderHistory();
}

function isSavableResult(result) {
    if (result === undefined || result === null) {
        return false;
    }

    if (typeof result === 'number') {
        return Number.isFinite(result);
    }

    if (typeof result === 'string') {
        return result !== 'NaN' && result !== 'Infinity' && result !== '-Infinity';
    }

    return true;
}

function createHistoryItem(entry, index) {
    const div = document.createElement('div');
    div.classList.add('history-item');

    const content = document.createElement('div');
    content.classList.add('history-content');
    content.textContent = `${entry.expression} = ${entry.result}`;

    content.addEventListener('click', () => {
        string = entry.expression;
        input.value = entry.expression;
        calculated = false;
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('history-delete');
    deleteBtn.innerHTML = '✕';
    deleteBtn.setAttribute('aria-label', 'Delete history entry');

    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();

        history.splice(index, 1);

        saveHistory();
        renderHistory();
    });

    div.appendChild(content);
    div.appendChild(deleteBtn);

    return div;
}

function renderHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';

    if (history.length === 0) {
        const emptyState = document.createElement('div');

        emptyState.classList.add('history-empty');

        emptyState.innerHTML = `
            <h3>No calculations yet</h3>
            <p>Your recent calculations will appear here.</p>
        `;

        historyList.appendChild(emptyState);

        return;
    }

    history.forEach((entry, index) => {
        historyList.appendChild(
            createHistoryItem(entry, index)
        );
    });
}

renderHistory();

const arr = Array.from(buttons);

arr.forEach(button => {
    button.addEventListener('click', e => {
        const value = e.target.innerHTML;

        if (value === '=') {
            try {
                const expression = string;
                const normalized = normalizeExpression(expression);
                const result = eval(normalized);

                if (!isSavableResult(result)) {
                    throw new Error('Invalid calculation result');
                }

                const resultString = result.toString();
                addHistoryEntry(expression, resultString);

                string = resultString;
                input.value = string;
                calculated = true;
            } catch {
                input.value = 'Error';
                string = '';
                calculated = false;
            }

            return;
        }

        if (value === 'AC') {
            string = '';
            input.value = string;
            calculated = false;
            return;
        }

        if (value === 'DEL') {
            string = string.substring(0, string.length - 1);
            input.value = string;
            return;
        }

        if (calculated) {
            if (['+', '-', '*', '/', '%', '^'].includes(value)) {
                string += value;
            } else {
                string = value;
            }

            calculated = false;
        } else {
            string += value;
        }

        input.value = string;
    });
});

document.getElementById('clearHistory').addEventListener('click', () => {
    showConfirmToast(
        "Are you sure you want to clear history?",
        () => {
            // YES action
            history = [];
            localStorage.removeItem(STORAGE_KEY);
            renderHistory();
        }
    );
});
