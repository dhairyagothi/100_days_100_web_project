/* -------------------------------------------------------------
   EXPENSE TRACKER - MAIN APPLICATION LOGIC
   ------------------------------------------------------------- */

// Constants
var STORAGE_KEY = 'budgetbuddy_data';
var THEME_KEY = 'budgetbuddy_theme';

// App State
var expenses = [];
var income = 0;
var currentFilter = 'All';

// DOM Elements
var incomeForm = document.getElementById('income-form');
var incomeInput = document.getElementById('income-input');
var expenseForm = document.getElementById('expense-form');
var expenseNameInput = document.getElementById('expense-name');
var expenseAmountInput = document.getElementById('expense-amount');
var expenseCategorySelect = document.getElementById('expense-category');

var totalIncomeEl = document.getElementById('total-income');
var totalExpensesEl = document.getElementById('total-expenses');
var netBalanceEl = document.getElementById('net-balance');
var netBalanceCard = document.querySelector('.stat-card.balance');

var categoryFilterSelect = document.getElementById('category-filter');
var expenseListEl = document.getElementById('expense-list');
var noExpensesEl = document.getElementById('no-expenses');

var chartProgress = document.getElementById('chart-progress');
var expenseRatioEl = document.getElementById('expense-ratio');
var legendEl = document.getElementById('category-breakdown-legend');
var dateTextEl = document.getElementById('date-text');
var themeToggleBtn = document.getElementById('themeToggle');

// Category Configurations
var categories = {
    Food: {
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>',
        color: '#10b981',
        class: 'cat-food'
    },
    Travel: {
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>',
        color: '#0ea5e9',
        class: 'cat-travel'
    },
    Shopping: {
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/></svg>',
        color: '#8b5cf6',
        class: 'cat-shopping'
    },
    Bills: {
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1zM16 8H8m8 4H8m5 4H8"/></svg>',
        color: '#f59e0b',
        class: 'cat-bills'
    },
    Other: {
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01"/></svg>',
        color: '#64748b',
        class: 'cat-other'
    }
};

// ============================================================
// DATA MANAGEMENT (DEFINED FIRST)
// ============================================================

function saveData() {
    var data = {
        expenses: expenses,
        income: income
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadData() {
    var savedData = localStorage.getItem(STORAGE_KEY);
    
    if (savedData) {
        try {
            var data = JSON.parse(savedData);
            expenses = data.expenses || [];
            income = data.income || 0;
        } catch (e) {
            console.error('Error loading data:', e);
            expenses = [];
            income = 0;
        }
    } else {
        // Fallback: check for old storage keys
        var oldExpenses = localStorage.getItem('expenses');
        var oldIncome = localStorage.getItem('income');
        
        var needsMigration = false;
        
        if (oldExpenses) {
            try {
                expenses = JSON.parse(oldExpenses);
                needsMigration = true;
                localStorage.removeItem('expenses');
            } catch (e) {
                expenses = [];
            }
        }
        
        if (oldIncome) {
            income = parseFloat(oldIncome) || 0;
            needsMigration = true;
            localStorage.removeItem('income');
        }
        
        if (needsMigration) {
            saveData();
        }
    }
    
    // Pre-fill income input if set
    if (income > 0 && incomeInput) {
        incomeInput.value = income;
    }
}

// ============================================================
// THEME MANAGEMENT
// ============================================================

function updateThemeIcon() {
    var currentTheme = document.documentElement.getAttribute('data-theme');
    if (themeToggleBtn) {
        themeToggleBtn.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
        themeToggleBtn.setAttribute('aria-label', 
            currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
        );
    }
}

function initTheme() {
    var savedTheme = localStorage.getItem(THEME_KEY);
    
    if (!savedTheme) {
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        localStorage.setItem(THEME_KEY, prefersDark ? 'dark' : 'light');
    } else {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    updateThemeIcon();
}

function toggleTheme() {
    var currentTheme = document.documentElement.getAttribute('data-theme');
    var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    
    updateThemeIcon();
    
    if (typeof compileAndBuildAnalyticsLayout === 'function') {
        compileAndBuildAnalyticsLayout();
    }
}

// ============================================================
// UI HELPERS
// ============================================================

function displayCurrentDate() {
    if (!dateTextEl) return;
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var today = new Date();
    dateTextEl.textContent = today.toLocaleDateString('en-US', options);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(timestamp) {
    var date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function escapeHTML(str) {
    if (!str) return '';
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    };
    return String(str).replace(/[&<>'"]/g, function(m) { return map[m]; });
}

// ============================================================
// EXPENSE MANAGEMENT
// ============================================================

function addExpense() {
    if (!expenseNameInput || !expenseAmountInput || !expenseCategorySelect) return;
    
    var name = expenseNameInput.value.trim();
    var amount = parseFloat(expenseAmountInput.value);
    var category = expenseCategorySelect.value;

    if (!name || isNaN(amount) || amount <= 0 || !category) {
        alert('Please fill out all fields with valid data.');
        return;
    }

    var newExpense = {
        id: Date.now().toString(),
        name: name,
        amount: amount,
        category: category,
        date: Date.now()
    };

    expenses.push(newExpense);
    saveData();
    updateUI();

    expenseForm.reset();
    expenseCategorySelect.selectedIndex = 0;
}

function deleteExpense(id) {
    var expenseItem = document.querySelector('[data-id="' + id + '"]');
    if (expenseItem) {
        expenseItem.classList.add('deleting');
        expenseItem.addEventListener('animationend', function() {
            expenses = expenses.filter(function(exp) { return exp.id !== id; });
            saveData();
            updateUI();
        }, { once: true });
    } else {
        expenses = expenses.filter(function(exp) { return exp.id !== id; });
        saveData();
        updateUI();
    }
}

function filterExpenses() {
    renderExpenses();
}

function renderExpenses() {
    if (!expenseListEl || !noExpensesEl) return;
    
    expenseListEl.innerHTML = '';
    
    var filteredExpenses = currentFilter === 'All' 
        ? expenses 
        : expenses.filter(function(exp) { return exp.category === currentFilter; });

    var sortedExpenses = filteredExpenses.slice().sort(function(a, b) { 
        return b.date - a.date; 
    });

    if (sortedExpenses.length === 0) {
        noExpensesEl.style.display = 'flex';
        expenseListEl.style.display = 'none';
        return;
    }

    noExpensesEl.style.display = 'none';
    expenseListEl.style.display = 'flex';

    sortedExpenses.forEach(function(exp) {
        var catConfig = categories[exp.category] || categories.Other;
        var li = document.createElement('li');
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

// ============================================================
// SUMMARY & CHARTS
// ============================================================

function updateLegend(totalExpenses) {
    if (!legendEl) return;
    
    legendEl.innerHTML = '';
    
    var catTotals = { Food: 0, Travel: 0, Shopping: 0, Bills: 0, Other: 0 };
    expenses.forEach(function(exp) {
        if (catTotals[exp.category] !== undefined) {
            catTotals[exp.category] += exp.amount;
        } else {
            catTotals.Other += exp.amount;
        }
    });

    var activeCategories = Object.keys(catTotals).filter(function(cat) { 
        return catTotals[cat] > 0; 
    });

    if (activeCategories.length === 0) {
        legendEl.innerHTML = '<div class="legend-placeholder">No data to display. Add expenses to view category breakdown.</div>';
        return;
    }

    activeCategories.forEach(function(cat) {
        var total = catTotals[cat];
        var percent = totalExpenses > 0 ? Math.round((total / totalExpenses) * 100) : 0;
        var config = categories[cat] || categories.Other;

        var legendItem = document.createElement('div');
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

function updateSummary() {
    var totalExpenses = expenses.reduce(function(sum, exp) { 
        return sum + exp.amount; 
    }, 0);
    var balance = income - totalExpenses;

    if (totalIncomeEl) totalIncomeEl.textContent = formatCurrency(income);
    if (totalExpensesEl) totalExpensesEl.textContent = formatCurrency(totalExpenses);
    if (netBalanceEl) netBalanceEl.textContent = formatCurrency(balance);

    if (netBalanceCard) {
        if (balance < 0) {
            netBalanceCard.classList.add('negative-balance');
        } else {
            netBalanceCard.classList.remove('negative-balance');
        }
    }

    var percentage = 0;
    if (income > 0) {
        percentage = Math.round((totalExpenses / income) * 100);
    } else if (totalExpenses > 0) {
        percentage = 100;
    }

    if (expenseRatioEl) expenseRatioEl.textContent = percentage + '%';

    var strokeDashOffset = 251.2;
    if (percentage > 0) {
        var clampedPercentage = Math.min(percentage, 100);
        strokeDashOffset = 251.2 - (clampedPercentage / 100) * 251.2;
    }
    
    if (chartProgress) {
        chartProgress.style.strokeDashoffset = strokeDashOffset;
        
        if (percentage > 90) {
            chartProgress.style.stroke = 'var(--danger)';
        } else if (percentage > 70) {
            chartProgress.style.stroke = 'var(--color-bills)';
        } else {
            chartProgress.style.stroke = 'var(--primary)';
        }
    }

    updateLegend(totalExpenses);
}

function updateUI() {
    updateSummary();
    renderExpenses();
}

// ============================================================
// EVENT LISTENERS
// ============================================================

function setupEventListeners() {
    if (incomeForm) {
        incomeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var value = parseFloat(incomeInput.value);
            if (!isNaN(value) && value >= 0) {
                income = value;
                saveData();
                updateUI();
                
                var btn = incomeForm.querySelector('button');
                var originalText = btn.textContent;
                btn.textContent = '✅ Updated!';
                btn.style.background = 'var(--success)';
                setTimeout(function() {
                    btn.textContent = originalText;
                    btn.style.background = '';
                }, 1500);
            }
        });
    }

    if (expenseForm) {
        expenseForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addExpense();
        });
    }

    if (categoryFilterSelect) {
        categoryFilterSelect.addEventListener('change', function(e) {
            currentFilter = e.target.value;
            filterExpenses();
        });
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
}

// ============================================================
// EXPOSE FUNCTIONS TO GLOBAL SCOPE
// ============================================================

window.deleteExpense = deleteExpense;
window.loadData = loadData;
window.saveData = saveData;
window.updateUI = updateUI;
window.formatCurrency = formatCurrency;
window.formatDate = formatDate;
window.toggleTheme = toggleTheme;

// ============================================================
// INITIALIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    loadData();
    displayCurrentDate();
    setupEventListeners();
    updateUI();
});