const input = document.getElementById('inputBox');
const buttons = document.querySelectorAll('.calculator-button');
const STORAGE_KEY = 'calcHistory';
const MAX_HISTORY_ENTRIES = 50;
let string = "";
let calculated = false;
let alternateMode = false;
let history = loadHistory();

const pi = Math.PI;
const scientificButtons = {
    sin: null,
    cos: null,
    tan: null,
    sqrt: null,
    ln: null,
    log: null
};

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
function showToast(message) {
    const container = document.querySelector('.toast-container');

    const toast = document.createElement('div');

    toast.classList.add('toast');

    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 2000);
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
function asin(value) {
    return Math.asin(Number(value)) * 180 / Math.PI;
}

function acos(value) {
    return Math.acos(Number(value)) * 180 / Math.PI;
}

function atan(value) {
    return Math.atan(Number(value)) * 180 / Math.PI;
}
function square(value) {
    return Math.pow(Number(value), 2);
}

function exp(value) {
    return Math.exp(Number(value));
}

function tenPower(value) {
    return Math.pow(10, Number(value));
}

function abs(value) {
    return Math.abs(Number(value));
}
function updateScientificLabels() {

    const labels = alternateMode
        ? {
            sin: 'sin⁻¹',
            cos: 'cos⁻¹',
            tan: 'tan⁻¹',
            sqrt: 'x²',
            ln: 'eˣ',
            log: '10ˣ'
        }
        : {
            sin: 'sin',
            cos: 'cos',
            tan: 'tan',
            sqrt: 'sqrt',
            ln: 'ln',
            log: 'log'
        };

    buttons.forEach(btn => {

        const text = btn.textContent;

        if (labels.sin && (text === 'sin' || text === 'sin⁻¹'))
            btn.textContent = labels.sin;

        if (labels.cos && (text === 'cos' || text === 'cos⁻¹'))
            btn.textContent = labels.cos;

        if (labels.tan && (text === 'tan' || text === 'tan⁻¹'))
            btn.textContent = labels.tan;

        if (labels.sqrt && (text === 'sqrt' || text === 'x²'))
            btn.textContent = labels.sqrt;

        if (labels.ln && (text === 'ln' || text === 'eˣ'))
            btn.textContent = labels.ln;

        if (labels.log && (text === 'log' || text === '10ˣ'))
            btn.textContent = labels.log;
    });
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
function updateHistoryTitle() {
    const historyTitle = document.getElementById('historyTitle');
    historyTitle.textContent = `History (${history.length})`;
}
function renderHistory() {
    updateHistoryTitle();
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

const toggleButton = document.getElementById('toggleFunctions');

toggleButton.addEventListener('click', () => {

    alternateMode = !alternateMode;

    toggleButton.classList.toggle('active');

    updateScientificLabels();
});

const arr = Array.from(buttons);

arr.forEach(button => {
    button.addEventListener('click', e => {
        const value = e.target.innerHTML;
        if (alternateMode) {

    if (value === 'sin⁻¹') {
        string += 'asin(';
        input.value = string;
        return;
    }

    if (value === 'cos⁻¹') {
        string += 'acos(';
        input.value = string;
        return;
    }

    if (value === 'tan⁻¹') {
        string += 'atan(';
        input.value = string;
        return;
    }

    if (value === 'eˣ') {
        string += 'exp(';
        input.value = string;
        return;
    }

    if (value === '10ˣ') {
        string += 'tenPower(';
        input.value = string;
        return;
    }

    if (value === 'x²') {
        string += '^2';
        input.value = string;
        return;
    }
}
        if (value === '↔') {
    return;
}

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
document
    .getElementById('copyResult')
    .addEventListener('click', async () => {

        const value = input.value.trim();

        if (!value || value === 'Error') {
            return;
        }

        try {
            await navigator.clipboard.writeText(value);

            showToast('Copied to clipboard');
        } catch {
            showToast('Failed to copy');
        }
    });
document.getElementById('clearHistory').addEventListener('click', () => {

    if (history.length === 0) {
        showToast('History is already empty');
        return;
    }

    showConfirmToast(
        "Are you sure you want to clear history?",
        () => {
            history = [];
            localStorage.removeItem(STORAGE_KEY);
            renderHistory();
        }
    );
});
document.addEventListener('keydown', (e) => {

    const activeElement = document.activeElement;

    if (
        activeElement &&
        activeElement.tagName === 'INPUT'
    ) {
        return;
    }

    if (e.key === 'Enter') {

        e.preventDefault();

        document
            .querySelector('.equalTo')
            .click();
    }

    if (e.key === 'Escape') {

        document
            .querySelector('.Clear')
            .click();
    }

    if (e.key === 'Backspace') {

        e.preventDefault();

        const deleteButton = Array
            .from(buttons)
            .find(btn => btn.textContent === 'DEL');

        deleteButton?.click();
    }
});
