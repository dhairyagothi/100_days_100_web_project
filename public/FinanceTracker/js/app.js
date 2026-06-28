// js/app.js - Complete working version
import {
    addTransaction,
    getTransactions,
    deleteTransaction
} from './transactionManager.js';

import {
    addGoal,
    getGoals,
    deleteGoal
} from './savingsManager.js';

import {
    getDetailedInsights
} from './financialInsights.js';

import {
    addBudget,
    getBudgets,
    deleteBudget
} from './budgetManager.js';

// DOM Elements
const form = document.getElementById('transaction-form');
const transactionList = document.getElementById('transaction-list');
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const totalTransactionsEl = document.getElementById('total-transactions');
const avgDailyEl = document.getElementById('avg-daily');
const insightsBox = document.getElementById('insights-box');
const goalForm = document.getElementById('goal-form');
const goalList = document.getElementById('goal-list');
const budgetForm = document.getElementById('budget-form');
const budgetList = document.getElementById('budget-list');
const themeToggle = document.getElementById('theme-toggle');
const searchInput = document.getElementById('search-transactions');
const filterType = document.getElementById('filter-type');
const filterCategory = document.getElementById('filter-category');
const clearFiltersBtn = document.getElementById('clear-filters');
const exportCSVBtn = document.getElementById('export-csv-btn');
const importBtn = document.getElementById('import-btn');
const exportBtn = document.getElementById('export-btn');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const toastClose = document.getElementById('toast-close');

let expenseChart = null;
let trendChart = null;
let currentSort = { column: 'date', direction: 'desc' };

// Show Toast Notification
function showToast(message, duration = 3000) {
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 300);
    }, duration);
}

toastClose.addEventListener('click', () => {
    toast.classList.remove('show');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 300);
});

// ADD TRANSACTION
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const description = document.getElementById('description').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;
    const category = document.getElementById('category').value;
    const dateInput = document.getElementById('transaction-date');
    const date = dateInput.value ? formatDate(dateInput.value) : new Date().toLocaleDateString();

    if (!description || isNaN(amount) || amount <= 0) {
        showToast('Please enter valid transaction details', 3000);
        return;
    }

    const transaction = {
        description,
        amount,
        type,
        category,
        date: date
    };

    addTransaction(transaction);
    form.reset();
    renderTransactions();
    updateCharts();
    showToast('Transaction added successfully! 🎉', 2000);
});

// Format Date
function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// RENDER TRANSACTIONS
function renderTransactions() {
    let transactions = getTransactions();
    const searchTerm = searchInput.value.toLowerCase();
    const typeFilter = filterType.value;
    const categoryFilter = filterCategory.value;

    // Apply filters
    if (searchTerm) {
        transactions = transactions.filter(t =>
            t.description.toLowerCase().includes(searchTerm) ||
            t.category.toLowerCase().includes(searchTerm)
        );
    }

    if (typeFilter !== 'all') {
        transactions = transactions.filter(t => t.type === typeFilter);
    }

    if (categoryFilter !== 'all') {
        transactions = transactions.filter(t => t.category === categoryFilter);
    }

    // Apply sorting
    transactions.sort((a, b) => {
        let valA = a[currentSort.column];
        let valB = b[currentSort.column];

        if (currentSort.column === 'amount') {
            valA = parseFloat(valA);
            valB = parseFloat(valB);
        } else if (currentSort.column === 'date') {
            valA = new Date(valA);
            valB = new Date(valB);
        } else {
            valA = String(valA).toLowerCase();
            valB = String(valB).toLowerCase();
        }

        if (valA < valB) return currentSort.direction === 'asc' ? -1 : 1;
        if (valA > valB) return currentSort.direction === 'asc' ? 1 : -1;
        return 0;
    });

    transactionList.innerHTML = '';

    if (transactions.length === 0) {
        transactionList.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:20px;">No transactions found</td></tr>';
    }

    transactions.forEach((transaction) => {
        const row = document.createElement('tr');

        const descTd = document.createElement('td');
        descTd.textContent = transaction.description;

        const amountTd = document.createElement('td');
        amountTd.textContent = `$${transaction.amount.toFixed(2)}`;
        amountTd.className = transaction.type === 'Income' ? 'income-badge' : 'expense-badge';

        const typeTd = document.createElement('td');
        typeTd.innerHTML = `<span class="${transaction.type === 'Income' ? 'income-badge' : 'expense-badge'}">${transaction.type}</span>`;

        const categoryTd = document.createElement('td');
        categoryTd.textContent = transaction.category;

        const dateTd = document.createElement('td');
        dateTd.textContent = transaction.date;

        const actionTd = document.createElement('td');
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            const allTransactions = getTransactions();
            const index = allTransactions.indexOf(transaction);
            if (index !== -1) {
                removeTransaction(index);
            }
        });

        actionTd.appendChild(deleteBtn);
        row.appendChild(descTd);
        row.appendChild(amountTd);
        row.appendChild(typeTd);
        row.appendChild(categoryTd);
        row.appendChild(dateTd);
        row.appendChild(actionTd);
        transactionList.appendChild(row);
    });

    // Update summary
    const allTransactions = getTransactions();
    const totalIncome = allTransactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = allTransactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
    const totalTransactions = allTransactions.length;

    balanceEl.textContent = `$${(totalIncome - totalExpense).toFixed(2)}`;
    incomeEl.textContent = `$${totalIncome.toFixed(2)}`;
    expenseEl.textContent = `$${totalExpense.toFixed(2)}`;
    totalTransactionsEl.textContent = totalTransactions;

    // Calculate average daily spending
    if (totalTransactions > 0) {
        const expenseTransactions = allTransactions.filter(t => t.type === 'Expense');
        const days = getDaysWithTransactions(expenseTransactions);
        const avg = days > 0 ? totalExpense / days : 0;
        avgDailyEl.textContent = `$${avg.toFixed(2)}`;
    } else {
        avgDailyEl.textContent = '$0.00';
    }

    // Update transaction count
    document.getElementById('transaction-count').textContent =
        `Showing ${transactions.length} of ${totalTransactions} transactions`;

    // Generate insights
    const insights = getDetailedInsights(allTransactions);
    renderInsights(insights);

    // Update budgets
    renderBudgets();

    // Update goals
    renderGoals();

    // Update filter categories
    updateCategoryFilter();
}

function getDaysWithTransactions(transactions) {
    if (transactions.length === 0) return 0;
    const dates = new Set();
    transactions.forEach(t => {
        if (t.date) {
            dates.add(t.date);
        }
    });
    return dates.size || 1;
}

// RENDER INSIGHTS
function renderInsights(insights) {
    if (!insights || insights.length === 0) {
        insightsBox.innerHTML = '<p>Add transactions to receive AI-powered insights.</p>';
        return;
    }

    let html = '';
    insights.forEach(insight => {
        const className = insight.type || 'info';
        html += `
            <div class="insight-item ${className}">
                <strong>${insight.title}</strong>
                <p>${insight.message}</p>
                ${insight.detail ? `<small>${insight.detail}</small>` : ''}
            </div>
        `;
    });
    insightsBox.innerHTML = html;
}

// DELETE TRANSACTION
window.removeTransaction = function(index) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        deleteTransaction(index);
        renderTransactions();
        updateCharts();
        showToast('Transaction deleted', 2000);
    }
};

// SAVINGS GOALS
goalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const goalName = document.getElementById('goal-name').value.trim();
    const goalAmount = parseFloat(document.getElementById('goal-amount').value);

    if (!goalName || isNaN(goalAmount) || goalAmount <= 0) {
        showToast('Please enter valid goal details', 3000);
        return;
    }

    const goal = {
        name: goalName,
        amount: goalAmount,
        saved: 0,
        createdAt: new Date().toISOString()
    };

    addGoal(goal);
    goalForm.reset();
    renderGoals();
    showToast('Savings goal added! 🎯', 2000);
});

function renderGoals() {
    const goals = getGoals();
    goalList.innerHTML = '';

    if (goals.length === 0) {
        goalList.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:20px;">No savings goals yet. Add one above!</td></tr>';
        return;
    }

    const allTransactions = getTransactions();
    const totalSavings = allTransactions
        .filter(t => t.type === 'Income')
        .reduce((sum, t) => sum + t.amount, 0) -
        allTransactions
        .filter(t => t.type === 'Expense')
        .reduce((sum, t) => sum + t.amount, 0);

    goals.forEach((goal, index) => {
        const progress = Math.min((totalSavings / goal.amount) * 100, 100);
        const row = document.createElement('tr');

        const nameTd = document.createElement('td');
        nameTd.textContent = goal.name;

        const amountTd = document.createElement('td');
        amountTd.textContent = `$${goal.amount.toFixed(2)}`;

        const progressTd = document.createElement('td');
        progressTd.innerHTML = `
            <div class="goal-progress">
                <div class="progress-circle" style="--progress: ${progress}%">
                    <span>${Math.round(progress)}%</span>
                </div>
                <span>$${Math.min(totalSavings, goal.amount).toFixed(2)} / $${goal.amount.toFixed(2)}</span>
            </div>
        `;

        const actionTd = document.createElement('td');
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            if (confirm('Delete this savings goal?')) {
                deleteGoal(index);
                renderGoals();
                showToast('Goal deleted', 2000);
            }
        });
        actionTd.appendChild(deleteBtn);

        row.appendChild(nameTd);
        row.appendChild(amountTd);
        row.appendChild(progressTd);
        row.appendChild(actionTd);
        goalList.appendChild(row);
    });
}

// BUDGET TRACKER
budgetForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const category = document.getElementById('budget-category').value;
    const limit = parseFloat(document.getElementById('budget-limit').value);

    if (!category || isNaN(limit) || limit <= 0) {
        showToast('Please enter valid budget details', 3000);
        return;
    }

    addBudget(category, limit);
    budgetForm.reset();
    renderBudgets();
    showToast(`Budget set for ${category} ✅`, 2000);
});

function renderBudgets() {
    const budgets = getBudgets();
    budgetList.innerHTML = '';

    if (budgets.length === 0) {
        budgetList.innerHTML = '<p style="padding:20px;text-align:center;color:var(--text-secondary);">No budgets set. Create one above!</p>';
        return;
    }

    budgets.forEach(budget => {
        const percentage = Math.min((budget.spent / budget.monthly_limit) * 100, 100);
        const isWarning = percentage > 80;

        const div = document.createElement('div');
        div.className = 'budget-item';
        div.innerHTML = `
            <div class="budget-info">
                <h4>${budget.category}</h4>
                <div class="budget-bar">
                    <div class="budget-bar-fill ${isWarning ? 'warning' : ''}" style="width: ${percentage}%"></div>
                </div>
            </div>
            <div class="budget-amount">
                $${budget.spent.toFixed(2)} / $${budget.monthly_limit.toFixed(2)}
                <small>${Math.round(percentage)}% used</small>
                <button class="delete-btn" style="margin-top:5px;padding:4px 12px;font-size:12px;" 
                        onclick="window.removeBudget('${budget.id}')">
                    Delete
                </button>
            </div>
        `;
        budgetList.appendChild(div);
    });
}

window.removeBudget = function(id) {
    if (confirm('Delete this budget?')) {
        deleteBudget(id);
        renderBudgets();
        showToast('Budget deleted', 2000);
    }
};

// CHARTS
function updateCharts() {
    const transactions = getTransactions();
    updateExpenseChart(transactions);
    updateTrendChart(transactions);
}

function updateExpenseChart(transactions) {
    const expenses = transactions.filter(t => t.type === 'Expense');
    const categories = {};
    expenses.forEach(t => {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
    });

    const labels = Object.keys(categories);
    const data = Object.values(categories);
    const colors = ['#7c5cff', '#00ff9d', '#ff6b6b', '#ffd93d', '#6bcbff', '#ff8a5c', '#a29bfe', '#fd79a8', '#00cec9'];

    if (expenseChart) {
        expenseChart.destroy();
    }

    const ctx = document.getElementById('expenseChart').getContext('2d');
    if (labels.length === 0) {
        expenseChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['No Data'],
                datasets: [{
                    data: [1],
                    backgroundColor: ['rgba(255,255,255,0.1)']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: getComputedStyle(document.body).getPropertyValue('--text-secondary') || '#ddd'
                        }
                    }
                }
            }
        });
        return;
    }

    expenseChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, labels.length),
                borderWidth: 2,
                borderColor: 'rgba(255,255,255,0.1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: getComputedStyle(document.body).getPropertyValue('--text-secondary') || '#ddd',
                        padding: 15
                    }
                }
            },
            cutout: '60%'
        }
    });
}

function updateTrendChart(transactions) {
    const monthly = {};
    transactions.forEach(t => {
        let dateStr = t.date;
        // Try to parse various date formats
        let date;
        if (dateStr.includes('/')) {
            const parts = dateStr.split('/');
            if (parts.length === 3) {
                date = new Date(parts[2], parts[0] - 1, parts[1]);
            }
        } else {
            date = new Date(dateStr);
        }
        
        if (isNaN(date.getTime())) return;
        
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!monthly[month]) {
            monthly[month] = { income: 0, expense: 0 };
        }
        if (t.type === 'Income') {
            monthly[month].income += t.amount;
        } else {
            monthly[month].expense += t.amount;
        }
    });

    const sortedMonths = Object.keys(monthly).sort();
    const labels = sortedMonths.map(m => {
        const [year, month] = m.split('-');
        return `${month}/${year}`;
    });
    const incomeData = sortedMonths.map(m => monthly[m].income);
    const expenseData = sortedMonths.map(m => monthly[m].expense);

    if (trendChart) {
        trendChart.destroy();
    }

    const ctx = document.getElementById('trendChart').getContext('2d');
    
    if (labels.length === 0) {
        trendChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['No Data'],
                datasets: [{
                    label: 'Income',
                    data: [0],
                    backgroundColor: 'rgba(0, 255, 157, 0.6)'
                }, {
                    label: 'Expense',
                    data: [0],
                    backgroundColor: 'rgba(255, 107, 107, 0.6)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: getComputedStyle(document.body).getPropertyValue('--text-secondary') || '#ddd'
                        }
                    }
                }
            }
        });
        return;
    }

    trendChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Income',
                data: incomeData,
                backgroundColor: 'rgba(0, 255, 157, 0.6)',
                borderColor: '#00ff9d',
                borderWidth: 2
            }, {
                label: 'Expense',
                data: expenseData,
                backgroundColor: 'rgba(255, 107, 107, 0.6)',
                borderColor: '#ff6b6b',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: getComputedStyle(document.body).getPropertyValue('--text-secondary') || '#ddd',
                        padding: 15
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: getComputedStyle(document.body).getPropertyValue('--text-secondary') || '#ddd',
                        callback: function(value) {
                            return '$' + value.toFixed(0);
                        }
                    }
                },
                x: {
                    ticks: {
                        color: getComputedStyle(document.body).getPropertyValue('--text-secondary') || '#ddd'
                    }
                }
            }
        }
    });
}

// UPDATE CATEGORY FILTER
function updateCategoryFilter() {
    const transactions = getTransactions();
    const categories = new Set();
    transactions.forEach(t => categories.add(t.category));

    const currentValue = filterCategory.value;
    filterCategory.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        filterCategory.appendChild(option);
    });
    filterCategory.value = currentValue;
}

// SEARCH AND FILTER
searchInput.addEventListener('input', renderTransactions);
filterType.addEventListener('change', renderTransactions);
filterCategory.addEventListener('change', renderTransactions);

clearFiltersBtn.addEventListener('click', () => {
    searchInput.value = '';
    filterType.value = 'all';
    filterCategory.value = 'all';
    renderTransactions();
});

// SORTABLE COLUMNS
document.querySelectorAll('th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
        const column = th.dataset.sort;
        if (currentSort.column === column) {
            currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            currentSort.column = column;
            currentSort.direction = 'asc';
        }
        renderTransactions();
    });
});

// EXPORT CSV
exportCSVBtn.addEventListener('click', () => {
    const transactions = getTransactions();
    if (transactions.length === 0) {
        showToast('No transactions to export', 3000);
        return;
    }

    const headers = ['Date', 'Description', 'Amount', 'Type', 'Category'];
    const rows = transactions.map(t => [
        t.date,
        `"${t.description}"`,
        t.amount.toFixed(2),
        t.type,
        t.category
    ]);

    const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported successfully! 📊', 2000);
});

// IMPORT CSV
importBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const text = await file.text();
        const lines = text.trim().split('\n');
        if (lines.length < 2) {
            showToast('CSV file is empty', 3000);
            return;
        }

        let imported = 0;
        const headers = lines[0].split(',').map(h => h.trim());
        const dateIdx = headers.findIndex(h => h.toLowerCase().includes('date'));
        const descIdx = headers.findIndex(h => h.toLowerCase().includes('description') || h.toLowerCase().includes('desc'));
        const amountIdx = headers.findIndex(h => h.toLowerCase().includes('amount'));
        const typeIdx = headers.findIndex(h => h.toLowerCase().includes('type'));
        const catIdx = headers.findIndex(h => h.toLowerCase().includes('category') || h.toLowerCase().includes('cat'));

        if (descIdx === -1 || amountIdx === -1) {
            showToast('CSV must have Description and Amount columns', 3000);
            return;
        }

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            const description = values[descIdx] || 'Unknown';
            const amount = parseFloat(values[amountIdx]) || 0;
            const type = typeIdx !== -1 ? (values[typeIdx] || 'Expense') : 'Expense';
            const category = catIdx !== -1 ? (values[catIdx] || 'Other') : 'Other';
            const date = dateIdx !== -1 ? values[dateIdx] : new Date().toLocaleDateString();

            if (description && amount > 0) {
                addTransaction({ description, amount, type, category, date });
                imported++;
            }
        }

        renderTransactions();
        updateCharts();
        showToast(`Successfully imported ${imported} transactions! 🎉`, 3000);
    };
    input.click();
});

// THEME TOGGLE - FIXED
function setTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'light');
    } else {
        document.body.classList.remove('light-mode');
        themeToggle.textContent = '🌙';
        localStorage.setItem('theme', 'dark');
    }
}

themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-mode');
    setTheme(isLight ? 'dark' : 'light');
    // Re-render charts with new colors
    setTimeout(updateCharts, 100);
});

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    setTheme('light');
} else {
    setTheme('dark');
}

// INITIAL RENDER
renderTransactions();
setTimeout(updateCharts, 200);