const input = document.getElementById('inputBox');
const buttons = document.querySelectorAll('.calculator button');
const STORAGE_KEY = 'calcHistory';
const MAX_HISTORY_ENTRIES = 50;
let string = "";
let calculated = false;
let history = loadHistory();

const pi = Math.PI;

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

function createHistoryItem(entry) {
    const div = document.createElement('div');
    div.classList.add('history-item');
    div.textContent = `${entry.expression} = ${entry.result}`;

    div.addEventListener('click', () => {
        string = entry.result;
        input.value = entry.result;
        calculated = true;
    });

    return div;
}

function renderHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';

    history.forEach(entry => {
        historyList.appendChild(createHistoryItem(entry));
    });
}

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
    const confirmed = window.confirm(
        'Are you sure you want to clear calculation history?'
    );

    if (!confirmed) {
        return;
    }

    history = [];
    localStorage.removeItem(STORAGE_KEY);
    renderHistory();
});

renderHistory();
