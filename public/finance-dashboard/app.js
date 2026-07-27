// State Management
const STATE_KEY = 'minimal_finance_state_v2';

const defaultState = {
    transactions: [],
    savingsGoal: {
        title: 'Emergency Fund',
        target: 10000.00,
        current: 0.00
    }
};

let state = { ...defaultState };

// Icon Mapping for Categories
const categoryIcons = {
    Salary: 'briefcase',
    Investments: 'trending-up',
    Food: 'utensils',
    Rent: 'home',
    Utilities: 'zap',
    Entertainment: 'film',
    Transport: 'car',
    Other: 'help-circle'
};

// DOM Elements
const totalBalanceEl = document.getElementById('total-balance');
const totalIncomeEl = document.getElementById('total-income');
const totalExpenseEl = document.getElementById('total-expense');
const goalNameEl = document.getElementById('goal-name');
const goalProgressFillEl = document.getElementById('goal-progress-fill');
const goalCurrentEl = document.getElementById('goal-current');
const goalTargetEl = document.getElementById('goal-target');
const transactionsListEl = document.getElementById('transactions-list');
const emptyStateEl = document.getElementById('empty-state');
const currentDateEl = document.getElementById('current-date');

// Interactive elements
const transactionForm = document.getElementById('transaction-form');
const goalContributionForm = document.getElementById('goal-contribution-form');
const searchInput = document.getElementById('search-input');
const filterBtns = document.querySelectorAll('.filter-btn');
const exportBtn = document.getElementById('export-btn');
const clearAllBtn = document.getElementById('clear-all-btn');

// Modal Elements
const goalModal = document.getElementById('goal-modal');
const editGoalBtn = document.getElementById('edit-goal-btn');
const closeGoalModalBtn = document.getElementById('close-goal-modal');
const cancelGoalModalBtn = document.getElementById('cancel-goal-modal');
const editGoalForm = document.getElementById('edit-goal-form');

// State Helpers
function loadState() {
    const saved = localStorage.getItem(STATE_KEY);
    if (saved) {
        try {
            state = JSON.parse(saved);
        } catch (e) {
            console.error('Failed to parse state, using defaults', e);
            state = { ...defaultState };
        }
    } else {
        state = { ...defaultState };
        saveState();
    }
}

function saveState() {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

// Formatting Utilities
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(dateStr) {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', options);
}

// Compute & Render Metrics
function updateMetrics() {
    let incomeSum = 0;
    let expenseSum = 0;

    state.transactions.forEach(tx => {
        if (tx.type === 'income') {
            incomeSum += tx.amount;
        } else if (tx.type === 'expense') {
            expenseSum += tx.amount;
        }
    });

    // Available balance = Net cashflow - money committed to savings
    const netCashflow = incomeSum - expenseSum;
    const availableBalance = netCashflow - state.savingsGoal.current;

    totalBalanceEl.textContent = formatCurrency(availableBalance);
    totalIncomeEl.textContent = formatCurrency(incomeSum);
    totalExpenseEl.textContent = formatCurrency(expenseSum);

    // Goal Rendering
    goalNameEl.textContent = state.savingsGoal.title;
    goalCurrentEl.textContent = formatCurrency(state.savingsGoal.current);
    goalTargetEl.textContent = formatCurrency(state.savingsGoal.target);
    
    // Progress calculation (clamp between 0 and 100)
    const progressPercent = Math.min(100, Math.max(0, (state.savingsGoal.current / state.savingsGoal.target) * 100));
    goalProgressFillEl.style.width = `${progressPercent}%`;
}

// Render Transaction List
function renderTransactions() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;

    // Filter transactions
    const filtered = state.transactions.filter(tx => {
        const matchesSearch = tx.description.toLowerCase().includes(searchTerm) || 
                              tx.category.toLowerCase().includes(searchTerm);
        
        const matchesFilter = activeFilter === 'all' || tx.type === activeFilter;

        return matchesSearch && matchesFilter;
    });

    // Handle Empty State
    if (filtered.length === 0) {
        transactionsListEl.innerHTML = '';
        emptyStateEl.style.display = 'flex';
        return;
    }

    emptyStateEl.style.display = 'none';

    // Sort: Latest first
    const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));

    transactionsListEl.innerHTML = sorted.map(tx => {
        const iconName = categoryIcons[tx.category] || 'help-circle';
        const sign = tx.type === 'income' ? '+' : '-';
        const amountClass = tx.type === 'income' ? 'income' : 'expense';
        
        return `
            <li class="transaction-item" data-id="${tx.id}">
                <div class="tx-main-group">
                    <div class="tx-category-icon cat-${tx.category}">
                        <i data-lucide="${iconName}"></i>
                    </div>
                    <div class="tx-details">
                        <span class="tx-desc">${escapeHTML(tx.description)}</span>
                        <div class="tx-meta">
                            <span>${tx.category}</span>
                            <span class="tx-dot"></span>
                            <span>${formatDate(tx.date)}</span>
                        </div>
                    </div>
                </div>
                <div class="tx-right-group">
                    <span class="tx-amount ${amountClass}">${sign}${formatCurrency(tx.amount)}</span>
                    <button class="tx-delete-btn" onclick="deleteTransaction('${tx.id}')" title="Delete transaction">
                        <i data-lucide="trash"></i>
                    </button>
                </div>
            </li>
        `;
    }).join('');

    // Re-create icons dynamically
    lucide.createIcons();
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// Delete Transaction
window.deleteTransaction = function(id) {
    state.transactions = state.transactions.filter(tx => tx.id !== id);
    saveState();
    updateMetrics();
    renderTransactions();
};

// Form Event Listeners
transactionForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const descInput = document.getElementById('tx-description');
    const amountInput = document.getElementById('tx-amount');
    const typeInput = document.getElementById('tx-type');
    const catInput = document.getElementById('tx-category');

    const newTx = {
        id: Date.now().toString(),
        description: descInput.value.trim(),
        amount: parseFloat(amountInput.value),
        type: typeInput.value,
        category: catInput.value,
        date: new Date().toISOString().split('T')[0] // Localized current date YYYY-MM-DD
    };

    state.transactions.push(newTx);
    saveState();
    
    // Reset Form
    transactionForm.reset();

    // Re-render
    updateMetrics();
    renderTransactions();
});

// Savings Goal Contribution Form
goalContributionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const amountInput = document.getElementById('goal-contrib-amount');
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount <= 0) return;

    state.savingsGoal.current += amount;
    saveState();
    amountInput.value = '';

    updateMetrics();
});

// Search & Filter Events
searchInput.addEventListener('input', () => {
    renderTransactions();
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        renderTransactions();
    });
});

// Edit Savings Goal Modal Handlers
editGoalBtn.addEventListener('click', () => {
    document.getElementById('input-goal-title').value = state.savingsGoal.title;
    document.getElementById('input-goal-target').value = state.savingsGoal.target;
    document.getElementById('input-goal-current').value = state.savingsGoal.current;
    goalModal.classList.add('active');
});

function closeGoalModal() {
    goalModal.classList.remove('active');
}

closeGoalModalBtn.addEventListener('click', closeGoalModal);
cancelGoalModalBtn.addEventListener('click', closeGoalModal);
goalModal.addEventListener('click', (e) => {
    if (e.target === goalModal) closeGoalModal();
});

editGoalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('input-goal-title').value.trim();
    const target = parseFloat(document.getElementById('input-goal-target').value);
    const current = parseFloat(document.getElementById('input-goal-current').value);

    state.savingsGoal = {
        title: title || 'Savings Goal',
        target: isNaN(target) || target <= 0 ? 1000 : target,
        current: isNaN(current) || current < 0 ? 0 : current
    };

    saveState();
    updateMetrics();
    closeGoalModal();
});

// Theme management removed for Light-only design

// Clear All Transactions
clearAllBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all transactions? This will reset your history.')) {
        state.transactions = [];
        state.savingsGoal.current = 0;
        saveState();
        updateMetrics();
        renderTransactions();
    }
});

// Export to CSV
exportBtn.addEventListener('click', () => {
    if (state.transactions.length === 0) {
        alert('No transactions to export.');
        return;
    }

    const headers = ['ID', 'Description', 'Amount', 'Type', 'Category', 'Date'];
    const rows = state.transactions.map(tx => [
        tx.id,
        `"${tx.description.replace(/"/g, '""')}"`,
        tx.amount,
        tx.type,
        tx.category,
        tx.date
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `minimal_finance_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Initialize Date Header
function initDateHeader() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    currentDateEl.textContent = today.toLocaleDateString('en-US', options);
}

// App Initialization
function init() {
    loadState();
    initDateHeader();
    updateMetrics();
    renderTransactions();
    lucide.createIcons();
}

window.addEventListener('DOMContentLoaded', init);
