// Transaction storage - source of truth
let transactions = [];

// DOM Elements
const transactionForm = document.getElementById('transactionForm');
const amountInput = document.getElementById('amount');
const descriptionInput = document.getElementById('description');
const typeIncomeInput = document.getElementById('type-income');
const typeExpenseInput = document.getElementById('type-expense');
const categorySelect = document.getElementById('category');
const dateInput = document.getElementById('date');

const accountBalanceEl = document.getElementById('accountBalance');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpenseEl = document.getElementById('totalExpense');
const transactionsBody = document.getElementById('transactionsBody');
const noTransactionsMessage = document.getElementById('noTransactionsMessage');

// Error elements
const errorElements = {
    amount: document.getElementById('amountError'),
    description: document.getElementById('descriptionError'),
    type: document.getElementById('typeError'),
    category: document.getElementById('categoryError'),
    date: document.getElementById('dateError')
};

// Helper message element
const dateHelper = document.getElementById('dateHelper');
let dateHelperTimeout;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    setMaxDateToToday();
    setupDatePickerBehavior();
    renderDashboard();
    renderTransactions();
});

// Set max date to today to prevent future dates
function setMaxDateToToday() {
    const today = new Date().toISOString().split('T')[0];
    dateInput.max = today;
}

// Show helper message for a short duration
function showDateHelper(message, duration = 4000) {
    dateHelper.textContent = message;
    dateHelper.classList.add('visible');
    
    clearTimeout(dateHelperTimeout);
    dateHelperTimeout = setTimeout(() => {
        dateHelper.classList.remove('visible');
    }, duration);
}

// Hide helper message
function hideDateHelper() {
    dateHelper.classList.remove('visible');
    clearTimeout(dateHelperTimeout);
}

// Setup date picker behavior to encourage using calendar picker and prevent manual typing
function setupDatePickerBehavior() {
    // Show helper message on focus
    dateInput.addEventListener('focus', function () {
        showDateHelper('Only today or past dates are allowed.');
    });

    // Hide helper message on blur
    dateInput.addEventListener('blur', function () {
        hideDateHelper();
    });

    // Clear invalid manual input to encourage using the picker
    dateInput.addEventListener('keydown', function (e) {
        // Allow only: Tab, Backspace, Delete, and the picker opening
        const allowedKeys = ['Tab', 'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
        if (!allowedKeys.includes(e.key)) {
            e.preventDefault();
        }
    });

    // Prevent paste of invalid dates
    dateInput.addEventListener('paste', function (e) {
        e.preventDefault();
    });

    // Auto-focus the picker on click
    dateInput.addEventListener('click', function () {
        this.showPicker();
    });
}

// Format money with rupee symbol
function formatMoney(amount) {
    return '₹' + parseFloat(amount).toFixed(2);
}

// Clear all error messages
function clearErrors() {
    Object.values(errorElements).forEach(el => el.textContent = '');
}

// Validate form inputs
function validateForm() {
    clearErrors();
    let isValid = true;

    // Validate amount
    const amount = parseFloat(amountInput.value);
    if (!amountInput.value.trim()) {
        errorElements.amount.textContent = 'Amount is required';
        isValid = false;
    } else if (amount <= 0) {
        errorElements.amount.textContent = 'Amount must be greater than 0';
        isValid = false;
    }

    // Validate description
    if (!descriptionInput.value.trim()) {
        errorElements.description.textContent = 'Description is required';
        isValid = false;
    }

    // Validate type
    const selectedType = document.querySelector('input[name="type"]:checked')?.value;
    if (!selectedType) {
        errorElements.type.textContent = 'Type is required';
        isValid = false;
    }

    // Validate category - required only for expenses
    if (selectedType === 'Expense' && !categorySelect.value) {
        errorElements.category.textContent = 'Category is required for expenses';
        isValid = false;
    }

    // Validate date
    if (!dateInput.value) {
        errorElements.date.textContent = 'Date is required';
        isValid = false;
    } else {
        // Compare date strings directly to avoid timezone issues
        const today = new Date().toISOString().split('T')[0];
        if (dateInput.value > today) {
            errorElements.date.textContent = 'Future entries cannot be added right now. Please select today or a past date.';
            isValid = false;
        }
    }

    return isValid;
}

// Handle form submission
transactionForm.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    // Create transaction object
    const selectedType = document.querySelector('input[name="type"]:checked').value;
    const transaction = {
        id: Date.now(), // Simple unique ID
        amount: parseFloat(amountInput.value),
        description: descriptionInput.value.trim(),
        type: selectedType,
        category: selectedType === 'Expense' ? categorySelect.value : null,
        date: dateInput.value
    };

    // Add to transactions array
    transactions.push(transaction);

    // Reset form
    transactionForm.reset();
    clearErrors();

    // Update UI
    renderDashboard();
    renderTransactions();
});

// Calculate totals from transactions
function calculateTotals() {
    let totalIncome = 0;
    let totalExpense = 0;
    const categoryTotals = {
        Food: 0,
        Travel: 0,
        Shopping: 0,
        Utilities: 0,
        Others: 0
    };

    transactions.forEach(transaction => {
        if (transaction.type === 'Income') {
            totalIncome += transaction.amount;
        } else if (transaction.type === 'Expense') {
            totalExpense += transaction.amount;
            if (transaction.category) {
                categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount;
            }
        }
    });

    return {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        categoryTotals
    };
}

// Render dashboard with updated values
function renderDashboard() {
    const totals = calculateTotals();

    // Update main cards
    accountBalanceEl.textContent = formatMoney(totals.balance);
    totalIncomeEl.textContent = formatMoney(totals.totalIncome);
    totalExpenseEl.textContent = formatMoney(totals.totalExpense);

    // Update category breakdown
    Object.entries(totals.categoryTotals).forEach(([category, amount]) => {
        const categoryEl = document.getElementById(`cat-${category}`);
        if (categoryEl) {
            categoryEl.textContent = formatMoney(amount);
        }
    });

    // Color account balance based on positive/negative
    if (totals.balance >= 0) {
        accountBalanceEl.style.color = '#4CAF50';
    } else {
        accountBalanceEl.style.color = '#FF6B6B';
    }
}

// Render transactions table
function renderTransactions() {
    if (transactions.length === 0) {
        transactionsBody.innerHTML = '';
        noTransactionsMessage.style.display = 'block';
        return;
    }

    noTransactionsMessage.style.display = 'none';

    // Sort transactions by date (newest first)
    const sortedTransactions = [...transactions].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });

    transactionsBody.innerHTML = sortedTransactions.map(transaction => {
        // Format date for display
        const dateObj = new Date(transaction.date);
        const formattedDate = dateObj.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        // Determine amount display and category
        const amountDisplay = transaction.type === 'Income' 
            ? `+${formatMoney(transaction.amount)}` 
            : formatMoney(transaction.amount);
        const categoryDisplay = transaction.category || transaction.type;

        return `
            <tr>
                <td>${formattedDate}</td>
                <td>${transaction.description}</td>
                <td>${categoryDisplay}</td>
                <td>${amountDisplay}</td>
                <td>
                    <button class="btn-delete" onclick="deleteTransaction(${transaction.id})">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
}

// Delete transaction by ID
function deleteTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    renderDashboard();
    renderTransactions();
}
