// LocalStorage Keys
const STORAGE_KEYS = {
    TOTAL_INCOME: 'expense_tracker_total_income',
    TOTAL_SPENT: 'expense_tracker_total_spent',
    EXPENSE_HISTORY: 'expense_tracker_history'
};

// Initialize variables from LocalStorage or defaults
let totalincome = loadFromLocalStorage(STORAGE_KEYS.TOTAL_INCOME, 0);
let totalSpent = loadFromLocalStorage(STORAGE_KEYS.TOTAL_SPENT, 0);
let expenseHistory = loadFromLocalStorage(STORAGE_KEYS.EXPENSE_HISTORY, []);

/**
 * Safe LocalStorage read with error handling
 * @param {string} key - LocalStorage key
 * @param {*} defaultValue - Default value if key doesn't exist or error occurs
 * @returns {*} - Parsed value or default
 */
function loadFromLocalStorage(key, defaultValue) {
    try {
        const stored = localStorage.getItem(key);
        if (stored === null) {
            return defaultValue;
        }
        return JSON.parse(stored);
    } catch (error) {
        console.warn(`Error loading from localStorage (key: ${key}):`, error);
        return defaultValue;
    }
}

/**
 * Safe LocalStorage write with error handling
 * @param {string} key - LocalStorage key
 * @param {*} value - Value to store (will be JSON stringified)
 */
function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        if (error.name === 'QuotaExceededError') {
            console.error('LocalStorage quota exceeded. Cannot save data.');
            alert('Storage limit reached. Please clear some data.');
        } else if (error.name === 'NS_ERROR_FILE_CORRUPTED') {
            console.error('LocalStorage is corrupted.');
        } else {
            console.warn(`Error saving to localStorage (key: ${key}):`, error);
        }
    }
}

/**
 * Format currency with Indian Rupee symbol
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted currency string
 */
function formatmoney(amount) {
    return '₹' + amount.toFixed(2);
}

/**
 * Update all display elements with current values
 */
function updateDisplay() {
    const moneyLeft = totalincome - totalSpent;
    document.getElementById('total').textContent = formatmoney(totalincome);
    document.getElementById('spent').textContent = formatmoney(totalSpent);
    document.getElementById('moneyleft').textContent = formatmoney(moneyLeft);
}

/**
 * Update income - save income and persist to LocalStorage
 */
function updatethemoney() {
    const incomeInput = document.getElementById('income').value;
    const income = parseFloat(incomeInput) || 0;

    if (income <= 0) {
        alert('Please enter a valid income amount');
        return;
    }

    totalincome += income;

    // Save to LocalStorage
    saveToLocalStorage(STORAGE_KEYS.TOTAL_INCOME, totalincome);

    // Update display
    updateDisplay();

    // Clear input
    document.getElementById('income').value = '';
}

/**
 * Update spending - record expense and persist to LocalStorage
 */
function updateSpending() {
    const spendingInput = document.getElementById('spending').value;
    const spending = parseFloat(spendingInput) || 0;

    if (spending <= 0) {
        alert('Please enter a valid spending amount');
        return;
    }

    // Check if spending exceeds available money
    const availableMoney = totalincome - totalSpent;
    if (spending > availableMoney) {
        alert('Spending cannot exceed available money!');
        return;
    }

    totalSpent += spending;

    // Add to expense history
    expenseHistory.push({
        amount: spending,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('en-IN')
    });

    // Save to LocalStorage
    saveToLocalStorage(STORAGE_KEYS.TOTAL_SPENT, totalSpent);
    saveToLocalStorage(STORAGE_KEYS.TOTAL_INCOME, totalincome);
    saveToLocalStorage(STORAGE_KEYS.EXPENSE_HISTORY, expenseHistory);

    // Update display
    updateDisplay();

    // Clear input
    document.getElementById('spending').value = '';
}

/**
 * Clear all data from LocalStorage and reset variables
 */
function clearAllData() {
    if (confirm('Are you sure you want to clear all expense data? This action cannot be undone.')) {
        totalincome = 0;
        totalSpent = 0;
        expenseHistory = [];

        // Clear LocalStorage
        localStorage.removeItem(STORAGE_KEYS.TOTAL_INCOME);
        localStorage.removeItem(STORAGE_KEYS.TOTAL_SPENT);
        localStorage.removeItem(STORAGE_KEYS.EXPENSE_HISTORY);

        // Update display
        updateDisplay();
    }
}

/**
 * Export expense data as JSON
 */
function exportData() {
    const data = {
        totalIncome: totalincome,
        totalSpent: totalSpent,
        moneyLeft: totalincome - totalSpent,
        expenseHistory: expenseHistory,
        exportedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-tracker-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Initialize display on page load
document.addEventListener('DOMContentLoaded', function () {
    // Update display with loaded values
    updateDisplay();

    // Spending link event listener
    const spendingLink = document.getElementById('spending-link');
    const mainContent = document.getElementById('main');

    spendingLink.addEventListener('click', function (event) {
        event.preventDefault();

        mainContent.innerHTML = `
            <div class="left" style="color: white;">
                <h2 style="text-align: center;text-decoration:dotted;">Expense Categories</h2>
                <a href="index.html">Income</a>
                <a href="#">Travel Expense</a>
                <a href="#">Food</a>
                <a href="#">Transport</a>
                <a href="#">Utilities</a>
                <a href="#">Personal</a>
                <a href="#">EMI</a>
                <a href="#">Credit Card</a>
                <a href="#">Entertainment</a>
                <a href="#">Health</a>
                <a href="#">Miscellaneous</a>
            </div>
            <div class="right">
                <div class="income">
                    <h2>Money Spent</h2>
                    <br>
                    <input type="text" id="spending" placeholder="Money Spent" style="width: 100%; padding: 10px;">
                    <br><br>
                    <button id="submit-spending" class="submit-button">Submit</button>
                </div>
            </div>
        `;

        const submitSpendingButton = document.getElementById('submit-spending');
        submitSpendingButton.addEventListener('click', updateSpending);
    });

    // Add keyboard support for Enter key
    document.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            const activeElement = document.activeElement;
            if (activeElement && activeElement.id === 'income') {
                updatethemoney();
            } else if (activeElement && activeElement.id === 'spending') {
                updateSpending();
            }
        }
    });
});
