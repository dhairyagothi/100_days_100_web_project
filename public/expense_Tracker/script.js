/* -------------------------------------------------------------
   EXPENSE TRACKER - MAIN APPLICATION LOGIC
   ------------------------------------------------------------- */

// App State
let expenses = [];
let income = 0;
let currentFilter = 'All';

// DOM Elements
const incomeForm = document.getElementById('income-form');
const incomeInput = document.getElementById('income-input');
const expenseForm = document.getElementById('expense-form');
const expenseNameInput = document.getElementById('expense-name');
const expenseAmountInput = document.getElementById('expense-amount');
const expenseCategorySelect = document.getElementById('expense-category');

const totalIncomeEl = document.getElementById('total-income');
const totalExpensesEl = document.getElementById('total-expenses');
const netBalanceEl = document.getElementById('net-balance');
const netBalanceCard = document.querySelector('.stat-card.balance');

const categoryFilterSelect = document.getElementById('category-filter');
const expenseListEl = document.getElementById('expense-list');
const noExpensesEl = document.getElementById('no-expenses');

const chartProgress = document.getElementById('chart-progress');
const expenseRatioEl = document.getElementById('expense-ratio');
const legendEl = document.getElementById('category-breakdown-legend');
const dateTextEl = document.getElementById('date-text');

// Category Configurations
const categories = {
    Food: {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>`,
        color: '#10b981',
        class: 'cat-food'
    },
    Travel: {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>`,
        color: '#0ea5e9',
        class: 'cat-travel'
    },
    Shopping: {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/></svg>`,
        color: '#8b5cf6',
        class: 'cat-shopping'
    },
    Bills: {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1zM16 8H8m8 4H8m5 4H8"/></svg>`,
        color: '#f59e0b',
        class: 'cat-bills'
    },
    Other: {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01"/></svg>`,
        color: '#64748b',
        class: 'cat-other'
    }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    displayCurrentDate();
    setupEventListeners();
    updateUI();
});

// Load Data from LocalStorage
function loadData() {
    const savedExpenses = localStorage.getItem('expenses');
    const savedIncome = localStorage.getItem('income');

    expenses = savedExpenses ? JSON.parse(savedExpenses) : [];
    income = savedIncome ? parseFloat(savedIncome) : 0;
    
    // Pre-fill income input if set
    if (income > 0) {
        incomeInput.value = income;
    }
}

// Display Live/Current Date in header
function displayCurrentDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    dateTextEl.textContent = today.toLocaleDateString('en-US', options);
}

// Set up Event Listeners
function setupEventListeners() {
    // Add/Update Income
    incomeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const value = parseFloat(incomeInput.value);
        if (!isNaN(value) && value >= 0) {
            income = value;
            localStorage.setItem('income', income.toString());
            updateUI();
            
            // Trigger visual button feedback
            const btn = incomeForm.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = 'Updated!';
            btn.style.background = 'var(--success)';
            btn.style.borderColor = 'var(--success)';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.style.borderColor = '';
            }, 1500);
        }
    });

    // Add Expense
    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addExpense();
    });

    // Category Filter
    categoryFilterSelect.addEventListener('change', (e) => {
        currentFilter = e.target.value;
        filterExpenses();
    });
}

// Add Expense logic
function addExpense() {
    const name = expenseNameInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value);
    const category = expenseCategorySelect.value;

    if (!name || isNaN(amount) || amount <= 0 || !category) {
        alert('Please fill out all fields with valid data.');
        return;
    }

    const newExpense = {
        id: Date.now().toString(), // unique string ID
        name: name,
        amount: amount,
        category: category,
        date: Date.now() // timestamp
    };

    expenses.push(newExpense);
    saveExpenses();
    updateUI();

    // Reset Form
    expenseForm.reset();
    expenseCategorySelect.selectedIndex = 0; // Reset category select dropdown
}

// Delete Expense logic
function deleteExpense(id) {
    const expenseItem = document.querySelector(`[data-id="${id}"]`);
    if (expenseItem) {
        // Add deleting class for smooth fadeout transition
        expenseItem.classList.add('deleting');
        
        // Wait for the animation to end before actual DOM removal
        expenseItem.addEventListener('animationend', () => {
            expenses = expenses.filter(exp => exp.id !== id);
            saveExpenses();
            updateUI();
        });
    } else {
        expenses = expenses.filter(exp => exp.id !== id);
        saveExpenses();
        updateUI();
    }
}

// Save Expenses to LocalStorage
function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Filter Expenses
function filterExpenses() {
    renderExpenses();
}

// Format Currency Utility Helper
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Format Date Utility Helper
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Render dynamic list of expenses
function renderExpenses() {
    expenseListEl.innerHTML = '';
    
    // Apply category filter
    const filteredExpenses = currentFilter === 'All' 
        ? expenses 
        : expenses.filter(exp => exp.category === currentFilter);

    // Sort by newest first
    const sortedExpenses = [...filteredExpenses].sort((a, b) => b.date - a.date);

    if (sortedExpenses.length === 0) {
        noExpensesEl.style.display = 'flex';
        expenseListEl.style.display = 'none';
        return;
    }

    noExpensesEl.style.display = 'none';
    expenseListEl.style.display = 'flex';

    sortedExpenses.forEach(exp => {
        const catConfig = categories[exp.category] || categories.Other;
        const li = document.createElement('li');
        li.className = 'expense-item';
        li.setAttribute('data-id', exp.id);

        li.innerHTML = `
            <div class="item-category-icon ${catConfig.class}">
                ${catConfig.icon}
            </div>
            <div class="item-details">
                <span class="item-name">${escapeHTML(exp.name)}</span>
                <div class="item-meta">
                    <span class="item-category-label ${catConfig.class}-label">${exp.category}</span>
                    <span>&bull;</span>
                    <span>${formatDate(exp.date)}</span>
                </div>
            </div>
            <div class="item-amount">-${formatCurrency(exp.amount)}</div>
            <button class="btn-delete" aria-label="Delete expense" onclick="deleteExpense('${exp.id}')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
        `;
        expenseListEl.appendChild(li);
    });
}

// Update the Top Dashboard Cards and Visual Charts
function updateSummary() {
    // 1. Calculate Totals
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const balance = income - totalExpenses;

    // 2. Set DOM content
    totalIncomeEl.textContent = formatCurrency(income);
    totalExpensesEl.textContent = formatCurrency(totalExpenses);
    netBalanceEl.textContent = formatCurrency(balance);

    // 3. Negative Balance visual styling toggle
    if (balance < 0) {
        netBalanceCard.classList.add('negative-balance');
    } else {
        netBalanceCard.classList.remove('negative-balance');
    }

    // 4. Update SVG Circle Donut Chart
    let percentage = 0;
    if (income > 0) {
        percentage = Math.round((totalExpenses / income) * 100);
    } else if (totalExpenses > 0) {
        percentage = 100;
    }

    expenseRatioEl.textContent = `${percentage}%`;

    // 251.2 is 2 * PI * r (r=40)
    // Offset represents the dashoffset to hide/show the circle fill
    let strokeDashOffset = 251.2;
    if (percentage > 0) {
        const clampedPercentage = Math.min(percentage, 100);
        strokeDashOffset = 251.2 - (clampedPercentage / 100) * 251.2;
    }
    chartProgress.style.strokeDashoffset = strokeDashOffset;

    // Donut chart color based on budget thresholds
    if (percentage > 90) {
        chartProgress.style.stroke = 'var(--danger)';
    } else if (percentage > 70) {
        chartProgress.style.stroke = 'var(--color-bills)';
    } else {
        chartProgress.style.stroke = 'var(--primary)';
    }

    // 5. Update Legend Breakdown listing
    updateLegend(totalExpenses);
}

// Generate the visual category summary cards below the donut chart
function updateLegend(totalExpenses) {
    legendEl.innerHTML = '';
    
    // Group totals by category
    const catTotals = { Food: 0, Travel: 0, Shopping: 0, Bills: 0, Other: 0 };
    expenses.forEach(exp => {
        if (catTotals[exp.category] !== undefined) {
            catTotals[exp.category] += exp.amount;
        } else {
            catTotals.Other += exp.amount;
        }
    });

    const activeCategories = Object.keys(catTotals).filter(cat => catTotals[cat] > 0);

    if (activeCategories.length === 0) {
        legendEl.innerHTML = `<div class="legend-placeholder">No data to display. Add expenses to view category breakdown.</div>`;
        return;
    }

    activeCategories.forEach(cat => {
        const total = catTotals[cat];
        const percent = totalExpenses > 0 ? Math.round((total / totalExpenses) * 100) : 0;
        const config = categories[cat] || categories.Other;

        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.innerHTML = `
            <div class="legend-left">
                <span class="legend-color" style="background-color: ${config.color}"></span>
                <span class="legend-category">${cat}</span>
            </div>
            <div class="legend-right">
                <span class="legend-value">${formatCurrency(total)}</span>
                <span class="legend-percent">${percent}%</span>
            </div>
        `;
        legendEl.appendChild(legendItem);
    });
}

// Master UI Update controller
function updateUI() {
    updateSummary();
    renderExpenses();
}

// Helper to escape potential HTML inputs (XSS Defense)
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

// Expose deleteExpense to the global window scope so dynamic elements can call it
window.deleteExpense = deleteExpense;
