// js/app.js — Main Application Controller
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
import { initDefaults, saveData, loadData, STORAGE_KEYS } from './storage.js';
import {
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactions,
  getTransactionById,
  normalizeDate
} from './transactionManager.js';
import {
  getCategories, getCategoriesByType,
  addCategory, updateCategory, deleteCategory
} from './categoryManager.js';
import {
  getBudgets,
  addBudget,
  deleteBudget
} from './budgetManager.js';
import {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrend,
  getDailySpending,
  getIncomeSources,
  getTopCategories
} from './analyticsEngine.js';
import { parseCSV, importCSVData, exportCSV } from './csvManager.js';
import { getSettings, updateSetting, getCurrencySymbol } from './settingsManager.js';
import { generateInsights } from './financialInsights.js';


// ============ INITIALIZATION ============

initDefaults();

let currentSection = 'dashboard';
let editingTransactionId = null;
let currencySymbol = getCurrencySymbol();
let charts = {};
let csvPreviewData = null;
let debounceTimer = null;


// ============ DOM CACHE ============

const elements = {
  sidebar: document.getElementById('sidebar'),
  sidebarToggle: document.getElementById('sidebar-toggle'),
  loadingOverlay: document.getElementById('loading-overlay'),
  toastContainer: document.getElementById('toast-container'),
  transactionModal: document.getElementById('transaction-modal'),
  confirmModal: document.getElementById('confirm-modal'),
  transactionForm: document.getElementById('transaction-form'),
  themeToggle: document.getElementById('theme-toggle'),
  currencySelect: document.getElementById('currency-select'),
};


// ============ UTILITY FUNCTIONS ============

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  toast.innerHTML = `
  <span class="toast-icon">${icons[type] || icons.info}</span>
  <span class="toast-message"></span>
`;

  toast.querySelector('.toast-message').textContent = message;
  elements.toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function formatCurrency(amount) {
  const num = parseFloat(amount) || 0;
  return `${currencySymbol}${num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  let date = new Date(dateStr + 'T00:00:00');
  if (isNaN(date.getTime())) {
    date = new Date(dateStr);
  }
  if (isNaN(date.getTime())) return dateStr; 
  return date.toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

function confirmAction(message) {
  return new Promise((resolve) => {
    document.getElementById('confirm-message').textContent = message;
    elements.confirmModal.style.display = 'flex';

    const handleConfirm = () => { elements.confirmModal.style.display = 'none'; cleanup(); resolve(true); };
    const handleCancel = () => { elements.confirmModal.style.display = 'none'; cleanup(); resolve(false); };
    const cleanup = () => {
      document.getElementById('confirm-ok').removeEventListener('click', handleConfirm);
      document.getElementById('confirm-cancel').removeEventListener('click', handleCancel);
    };
    document.getElementById('confirm-ok').addEventListener('click', handleConfirm);
    document.getElementById('confirm-cancel').addEventListener('click', handleCancel);
  });
}

function animateValue(element, target, isCurrency = true) {
  const duration = 800;
  const startTime = performance.now();
  function update(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;
    element.textContent = isCurrency ? formatCurrency(current) : Math.round(current).toString();
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}


// ============ NAVIGATION ============

function navigateTo(sectionName) {
  currentSection = sectionName;

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.section === sectionName);
  });

  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });

  const target = document.getElementById(`${sectionName}-section`);
  if (target) target.classList.add('active');

  elements.sidebar.classList.remove('open');

  const loaders = {
    dashboard: loadDashboard,
    transactions: loadTransactionsSection,
    analytics: loadAnalytics,
    budgets: loadBudgetsSection,
    import: () => {},
    export: () => { loadAnalytics(); },
    settings: loadSettingsSection
  };

  if (loaders[sectionName]) loaders[sectionName]();
}


// ============ SECTION 1: DASHBOARD ============

function loadDashboard() {
  const summary = getSummary();

  animateValue(document.getElementById('total-income'), summary.total_income);
  animateValue(document.getElementById('total-expense'), summary.total_expense);
  animateValue(document.getElementById('total-savings'), summary.total_savings);
  animateValue(document.getElementById('transaction-count'), summary.transaction_count, false);

  // Top category
  const topEl = document.getElementById('top-category');
  if (summary.top_category) {
    topEl.innerHTML = `
    <div style="display:flex; align-items:center; gap:12px;">
      <div>
        <div class="top-cat-name" style="font-weight:600; font-size:1.1rem;"></div>
        <div class="top-cat-amount" style="color:var(--text-secondary);"></div>
      </div>
    </div>
`;
    topEl.querySelector('.top-cat-name').textContent = summary.top_category.name;
    topEl.querySelector('.top-cat-amount').textContent = formatCurrency(summary.top_category.amount);
  } else {
    topEl.innerHTML = '<p class="empty-text">No spending data available</p>';
  }

  // AI Insights
  document.getElementById('insights-box').textContent = generateInsights();

  // Recent transactions
  const recent = getTransactions({ sort: 'date', order: 'desc' }).slice(0, 10);
  const tbody = document.getElementById('recent-transactions-body');

  if (recent.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-cell">No recent transactions</td></tr>';
  } else {
  tbody.innerHTML = recent.map(t => `
    <tr>
      <td>${formatDate(t.date)}</td>
      <td>${escapeHTML(t.description)}</td>
      <td class="${t.type === 'Income' ? 'text-income' : 'text-expense'}" style="color:${t.type === 'Income' ? 'var(--income-color)' : 'var(--expense-color)'}">
      ${t.type === 'Income' ? '+' : '-'}${formatCurrency(t.amount)}
    </td>
    <td><span class="badge badge-${t.type.toLowerCase()}">${escapeHTML(t.type)}</span></td>
    <td>${escapeHTML(t.category)}</td>
    </tr>
`).join('');
  }
}


// ============ SECTION 2: TRANSACTIONS ============

function loadTransactionsSection() {
  populateCategoryFilter();
  renderTransactions();
}

function populateCategoryFilter() {
  const filterSelect = document.getElementById('filter-category');
  const categories = getCategories();
  filterSelect.innerHTML = '<option value="">All Categories</option>';
  categories.forEach(c => {
    filterSelect.innerHTML += `<option value="${c.name}">${c.name} (${c.type})</option>`;
  });
}

function renderTransactions() {
  const search = document.getElementById('search-input').value;
  const type = document.getElementById('filter-type').value;
  const category = document.getElementById('filter-category').value;
  const sortVal = document.getElementById('sort-select').value;
  const [sort, order] = sortVal.split('-');

  const transactions = getTransactions({ search, type, category, sort, order });
  const tbody = document.getElementById('transactions-body');

  if (transactions.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-cell">No transactions found</td></tr>';
    return;
  }

tbody.innerHTML = transactions.map(t => `
  <tr>
    <td>${formatDate(t.date)}</td>
    <td>${escapeHTML(t.description)}</td>
    <td style="color:${t.type === 'Income' ? 'var(--income-color)' : 'var(--expense-color)'}">
      ${t.type === 'Income' ? '+' : '-'}${formatCurrency(t.amount)}
    </td>
    <td><span class="badge badge-${t.type.toLowerCase()}">${escapeHTML(t.type)}</span></td>
    <td>${escapeHTML(t.category)}</td>
    <td>
      <button class="btn-icon edit" onclick="window.editTxn(${t.id})" title="Edit">📝</button>
      <button class="btn-icon danger" onclick="window.deleteTxn(${t.id})" title="Delete">🗑️</button>
    </td>
  </tr>
`).join('');
}

function openTransactionModal(id = null) {
  editingTransactionId = id;
  const form = elements.transactionForm;
  const title = document.getElementById('modal-title');
  const submitBtn = document.getElementById('txn-submit-btn');

  // Populate category dropdown
  const catSelect = document.getElementById('txn-category');
  const categories = getCategories();
  catSelect.innerHTML = '<option value="">Select Category</option>';
  categories.forEach(c => {
    catSelect.innerHTML += `<option value="${c.name}">${c.name} (${c.type})</option>`;
  });

  if (id) {
    // Edit mode
    const txn = getTransactionById(id);
    if (!txn) return;
    title.textContent = 'Edit Transaction';
    submitBtn.textContent = 'Update Transaction';
    document.getElementById('txn-date').value = normalizeDate(txn.date);
    document.getElementById('txn-description').value = txn.description;
    document.getElementById('txn-amount').value = txn.amount;
    document.getElementById('txn-type').value = txn.type;
    document.getElementById('txn-category').value = txn.category;
  } else {
    // Add mode
    title.textContent = 'Add Transaction';
    submitBtn.textContent = 'Add Transaction';
    form.reset();
    document.getElementById('txn-date').value = new Date().toISOString().split('T')[0];
  }

  elements.transactionModal.style.display = 'flex';
}

function closeTransactionModal() {
  elements.transactionModal.style.display = 'none';
  editingTransactionId = null;
}


// ============ SECTION 3: ANALYTICS ============

function loadAnalytics() {
  renderCategoryChart();
  renderIncomeExpenseChart();
  renderMonthlyChart();
  renderSavingsChart();
  renderDailyChart();
  renderIncomeSourcesChart();
  renderTopCategoriesChart();
}

function destroyChart(name) {
  if (charts[name]) {
    charts[name].destroy();
    delete charts[name];
  }
}

const CHART_COLORS = [
  '#7c3aed', '#6366f1', '#ec4899', '#f43f5e',
  '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6',
  '#14b8a6', '#f97316', '#ef4444', '#22c55e'
];

function renderCategoryChart() {
  destroyChart('category');
  const data = getCategoryBreakdown();
  if (data.length === 0) return;

  const ctx = document.getElementById('category-chart').getContext('2d');
  charts.category = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: data.map(d => d.category),
      datasets: [{
        data: data.map(d => d.amount),
        backgroundColor: CHART_COLORS.slice(0, data.length),
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right', labels: { color: getComputedStyle(document.body).getPropertyValue('--text-primary').trim(), padding: 12 } }
      }
    }
  });
}

function renderIncomeExpenseChart() {
  destroyChart('incomeExpense');
  const data = getMonthlyTrend();
  if (data.length === 0) return;

  const ctx = document.getElementById('income-expense-chart').getContext('2d');
  charts.incomeExpense = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(d => d.month),
      datasets: [
        { label: 'Income', data: data.map(d => d.income), backgroundColor: '#10b981', borderRadius: 6 },
        { label: 'Expense', data: data.map(d => d.expense), backgroundColor: '#ef4444', borderRadius: 6 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: getComputedStyle(document.body).getPropertyValue('--text-primary').trim() } } },
      scales: {
        x: { ticks: { color: getComputedStyle(document.body).getPropertyValue('--text-secondary').trim() }, grid: { display: false } },
        y: { ticks: { color: getComputedStyle(document.body).getPropertyValue('--text-secondary').trim() }, grid: { color: 'rgba(128,128,128,0.1)' } }
      }
    }
  });
}

function renderMonthlyChart() {
  destroyChart('monthly');
  const data = getMonthlyTrend();
  if (data.length === 0) return;

  const ctx = document.getElementById('monthly-chart').getContext('2d');
  charts.monthly = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(d => d.month),
      datasets: [{
        label: 'Expenses',
        data: data.map(d => d.expense),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239,68,68,0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#ef4444'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: getComputedStyle(document.body).getPropertyValue('--text-primary').trim() } } },
      scales: {
        x: { ticks: { color: getComputedStyle(document.body).getPropertyValue('--text-secondary').trim() }, grid: { display: false } },
        y: { ticks: { color: getComputedStyle(document.body).getPropertyValue('--text-secondary').trim() }, grid: { color: 'rgba(128,128,128,0.1)' } }
      }
    }
  });
}

function renderSavingsChart() {
  destroyChart('savings');
  const data = getMonthlyTrend();
  if (data.length === 0) return;

  // Cumulative savings
  let cumulative = 0;
  const savingsData = data.map(d => {
    cumulative += d.savings;
    return cumulative;
  });

  const ctx = document.getElementById('savings-chart').getContext('2d');
  charts.savings = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(d => d.month),
      datasets: [{
        label: 'Cumulative Savings',
        data: savingsData,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#6366f1'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: getComputedStyle(document.body).getPropertyValue('--text-primary').trim() } } },
      scales: {
        x: { ticks: { color: getComputedStyle(document.body).getPropertyValue('--text-secondary').trim() }, grid: { display: false } },
        y: { ticks: { color: getComputedStyle(document.body).getPropertyValue('--text-secondary').trim() }, grid: { color: 'rgba(128,128,128,0.1)' } }
      }
    }
  });
}

function renderDailyChart() {
  destroyChart('daily');
  const data = getDailySpending();
  if (data.length === 0) return;

  const ctx = document.getElementById('daily-chart').getContext('2d');
  charts.daily = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(d => d.date.substring(5)),
      datasets: [{
        label: 'Daily Spending',
        data: data.map(d => d.amount),
        backgroundColor: '#f59e0b',
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: getComputedStyle(document.body).getPropertyValue('--text-primary').trim() } } },
      scales: {
        x: { ticks: { color: getComputedStyle(document.body).getPropertyValue('--text-secondary').trim() }, grid: { display: false } },
        y: { ticks: { color: getComputedStyle(document.body).getPropertyValue('--text-secondary').trim() }, grid: { color: 'rgba(128,128,128,0.1)' } }
      }
    }
  });
}

function renderIncomeSourcesChart() {
  destroyChart('incomeSources');
  const data = getIncomeSources();
  if (data.length === 0) return;

  const ctx = document.getElementById('income-sources-chart').getContext('2d');
  charts.incomeSources = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: data.map(d => d.category),
      datasets: [{
        data: data.map(d => d.amount),
        backgroundColor: ['#10b981', '#14b8a6', '#22c55e', '#3b82f6', '#6366f1'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right', labels: { color: getComputedStyle(document.body).getPropertyValue('--text-primary').trim(), padding: 12 } }
      }
    }
  });
}

/**
 * Top 5 Expense Categories — horizontal bar chart.
 * Ported from Python's analytics_top_categories() endpoint.
 */
function renderTopCategoriesChart() {
  destroyChart('topCategories');
  const data = getTopCategories(5);
  if (data.length === 0) return;

  const ctx = document.getElementById('top-categories-chart').getContext('2d');
  charts.topCategories = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(d => d.category),
      datasets: [{
        label: 'Amount Spent',
        data: data.map(d => d.amount),
        backgroundColor: CHART_COLORS.slice(0, data.length),
        borderRadius: 6,
        borderWidth: 0
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${currencySymbol}${ctx.parsed.x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} — ${data[ctx.dataIndex].percentage}% of expenses`
          }
        }
      },
      scales: {
        x: {
          ticks: { color: getComputedStyle(document.body).getPropertyValue('--text-secondary').trim() },
          grid: { color: 'rgba(128,128,128,0.1)' }
        },
        y: {
          ticks: { color: getComputedStyle(document.body).getPropertyValue('--text-primary').trim() },
          grid: { display: false }
        }
      }
    }
  });
}


// ============ SECTION 4: BUDGETS ============

function loadBudgetsSection() {
  populateBudgetCategories();
  renderBudgets();
}

function populateBudgetCategories() {
  const select = document.getElementById('budget-category');
  const categories = getCategoriesByType('Expense');
  select.innerHTML = '<option value="">Select Category</option>';
  categories.forEach(c => {
    select.innerHTML += `<option value="${c.name}">${c.name}</option>`;
  });
}

function renderBudgets() {
  const budgets = getBudgets();
  const container = document.getElementById('budgets-list');

  if (budgets.length === 0) {
    container.innerHTML = '<div class="card"><p class="empty-text">No budgets set yet. Add one to start tracking!</p></div>';
    return;
  }

  container.innerHTML = budgets.map(b => {
    const statusClass = b.percentage >= 90 ? 'danger' : b.percentage >= 70 ? 'warning' : '';
    const statusColor = b.percentage >= 90 ? 'var(--expense-color)' : b.percentage >= 70 ? 'var(--warning-color)' : '';
  
    return `
      <div class="budget-card">
        <div class="budget-header">
          <span class="budget-category">${escapeHTML(b.category)}</span>
          <button class="btn-icon danger" onclick="window.deleteBdg(${b.id})" title="Delete">🗑️</button>
        </div>
        <div class="budget-amounts">
          <span>Spent: ${formatCurrency(b.spent)}</span>
          <span>Limit: ${formatCurrency(b.monthly_limit)}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill ${statusClass}" style="width:${b.percentage}%"></div>
        </div>
        <div class="budget-percentage" style="color:${statusColor}">
          ${b.percentage}% used · ${formatCurrency(b.monthly_limit - b.spent)} remaining
        </div>
      </div>
  `;
}).join('');
}


// ============ SECTION 7: SETTINGS ============

function loadSettingsSection() {
  const settings = getSettings();
  elements.currencySelect.value = settings.currency || '$';
  renderCategoryList();
}


// ============ CATEGORY MANAGEMENT (Ported from Python’s update_category cascade) ============

function renderCategoryList() {
  const container = document.getElementById('category-list-container');
  if (!container) return;

  const categories = getCategories();
  if (categories.length === 0) {
    container.innerHTML = '<p class="empty-text">No categories found.</p>';
    return;
  }

  const income  = categories.filter(c => c.type === 'Income');
  const expense = categories.filter(c => c.type === 'Expense');

  function renderGroup(title, cats) {
    if (cats.length === 0) return '';
    const badgeClass = title === 'Income' ? 'badge-income' : 'badge-expense';
    return `
      <div class="cat-group-title">${title}</div>
      ${cats.map(c => `
        <div class="category-row" id="cat-row-${c.id}">
          <span class="cat-name">${c.name}</span>
          <span class="badge ${badgeClass}" style="font-size:0.7rem;">${c.type}</span>
          <div style="margin-left:auto; display:flex; gap:6px;">
            <button class="btn-icon edit" onclick="window.editCat(${c.id})" title="Rename">✏️</button>
            <button class="btn-icon danger" onclick="window.deleteCatById(${c.id})" title="Delete">🗑️</button>
          </div>
        </div>
      `).join('')}
    `;
  }

  container.innerHTML = renderGroup('Income', income) + renderGroup('Expense', expense);
}

window.editCat = (id) => {
  const cat = getCategories().find(c => c.id === id);
  if (!cat) return;
  const row = document.getElementById(`cat-row-${id}`);
  row.innerHTML = `
    <input type="text" class="form-input" id="edit-cat-name-${id}" value="${cat.name}"
      style="flex:1; padding:8px 12px; margin-right:6px;">
    <select class="form-select" id="edit-cat-type-${id}"
      style="width:130px; padding:8px 12px; margin-right:6px;">
      <option value="Expense" ${cat.type === 'Expense' ? 'selected' : ''}>Expense</option>
      <option value="Income"  ${cat.type === 'Income'  ? 'selected' : ''}>Income</option>
    </select>
    <button class="btn btn-primary btn-sm" onclick="window.saveCat(${id})">Save</button>
    <button class="btn btn-secondary btn-sm" style="margin-left:6px;" onclick="renderCategoryList()">Cancel</button>
  `;
};

window.saveCat = (id) => {
  const newName = document.getElementById(`edit-cat-name-${id}`).value.trim();
  const newType = document.getElementById(`edit-cat-type-${id}`).value;
  if (!newName) { showToast('Category name cannot be empty', 'warning'); return; }
  const result = updateCategory(id, newName, newType);
  if (result) {
    showToast(`✅ "${newName}" updated — all linked transactions & budgets refreshed`);
    renderCategoryList();
    populateCategoryFilter(); // keep transaction filter in sync
  } else {
    showToast('A category with that name and type already exists', 'warning');
  }
};

window.deleteCatById = async (id) => {
  const cat = getCategories().find(c => c.id === id);
  const catName = cat ? cat.name : 'this category';
  const ok = await confirmAction(`Delete “${catName}”? Existing transactions will keep their category label.`);
  if (ok) {
    deleteCategory(id);
    showToast('Category deleted', 'info');
    renderCategoryList();
    populateCategoryFilter();
  }
};


// ============ EVENT LISTENERS ============

// --- Navigation ---
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navigateTo(link.dataset.section));
});

// --- Sidebar toggle (mobile) ---
elements.sidebarToggle.addEventListener('click', () => {
  elements.sidebar.classList.toggle('open');
});

// --- Transaction form submit ---
elements.transactionForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = {
    date: document.getElementById('txn-date').value,
    description: document.getElementById('txn-description').value,
    amount: document.getElementById('txn-amount').value,
    type: document.getElementById('txn-type').value,
    category: document.getElementById('txn-category').value
  };

  if (editingTransactionId) {
    updateTransaction(editingTransactionId, data);
    showToast('Transaction updated successfully');
  } else {
    addTransaction(data);
    showToast('Transaction added successfully');
  }

  closeTransactionModal();
  renderTransactions();
});

// --- Add transaction button ---
document.getElementById('add-transaction-btn').addEventListener('click', () => openTransactionModal());

// --- Modal close buttons ---
document.getElementById('modal-close').addEventListener('click', closeTransactionModal);
document.getElementById('txn-cancel-btn').addEventListener('click', closeTransactionModal);

// --- Search & filters (with debounce) ---
document.getElementById('search-input').addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(renderTransactions, 300);
});
document.getElementById('filter-type').addEventListener('change', renderTransactions);
document.getElementById('filter-category').addEventListener('change', renderTransactions);
document.getElementById('sort-select').addEventListener('change', renderTransactions);

// --- Global actions (called from inline onclick) ---
window.editTxn = (id) => openTransactionModal(id);
window.deleteTxn = async (id) => {
  const ok = await confirmAction('Delete this transaction?');
  if (ok) {
    deleteTransaction(id);
    showToast('Transaction deleted');
    renderTransactions();
  }
};
window.deleteBdg = async (id) => {
  const ok = await confirmAction('Delete this budget?');
  if (ok) {
    deleteBudget(id);
    showToast('Budget deleted');
    renderBudgets();
  }
};

// --- Budget form ---
document.getElementById('add-budget-btn').addEventListener('click', () => {
  document.getElementById('budget-form-card').style.display = 'block';
});
document.getElementById('cancel-budget-btn').addEventListener('click', () => {
  document.getElementById('budget-form-card').style.display = 'none';
});
document.getElementById('budget-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const category = document.getElementById('budget-category').value;
  const limit = document.getElementById('budget-limit').value;

  if (!category || !limit) {
    showToast('Please fill all fields', 'warning');
    return;
  }

  const result = addBudget(category, limit);
  if (result) {
    showToast(result.updated ? 'Budget limit updated — already existed for this category' : 'Budget added');
    document.getElementById('budget-form-card').style.display = 'none';
    document.getElementById('budget-form').reset();
    renderBudgets();
  } else {
    showToast('Failed to save budget', 'error');
  }
});

// --- Theme toggle ---
elements.themeToggle.addEventListener('click', () => {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  updateSetting('theme', next);
  elements.themeToggle.textContent = next === 'dark' ? '🌙 Toggle Theme' : '☀️ Toggle Theme';
  showToast(`Switched to ${next} mode`, 'info');

  // Re-render charts with new theme colors
  if (currentSection === 'analytics') loadAnalytics();
});

// --- Category Management (Settings) ---
document.getElementById('add-category-btn').addEventListener('click', () => {
  document.getElementById('add-category-form').style.display = 'grid';
  document.getElementById('add-category-btn').style.display = 'none';
  document.getElementById('new-cat-name').focus();
});
document.getElementById('cancel-cat-btn').addEventListener('click', () => {
  document.getElementById('add-category-form').style.display = 'none';
  document.getElementById('add-category-btn').style.display = '';
  document.getElementById('new-cat-name').value = '';
});
document.getElementById('save-cat-btn').addEventListener('click', () => {
  const name = document.getElementById('new-cat-name').value.trim();
  const type = document.getElementById('new-cat-type').value;
  if (!name) { showToast('Category name is required', 'warning'); return; }
  const result = addCategory(name, type);
  if (result) {
    showToast(`Category "${name}" added`);
    document.getElementById('new-cat-name').value = '';
    document.getElementById('add-category-form').style.display = 'none';
    document.getElementById('add-category-btn').style.display = '';
    renderCategoryList();
    populateCategoryFilter();
  } else {
    showToast('A category with that name and type already exists', 'warning');
  }
});

// --- Currency select ---
elements.currencySelect.addEventListener('change', () => {
  const symbol = elements.currencySelect.value;
  updateSetting('currency', symbol);
  currencySymbol = symbol;
  showToast(`Currency set to ${symbol}`, 'info');

  // Refresh current section to update displayed values
  navigateTo(currentSection);
});

// --- CSV Import ---
const csvDropZone = document.getElementById('csv-drop-zone');
const csvFileInput = document.getElementById('csv-file-input');

csvDropZone.addEventListener('click', () => csvFileInput.click());

csvDropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  csvDropZone.classList.add('drag-over');
});
csvDropZone.addEventListener('dragleave', () => {
  csvDropZone.classList.remove('drag-over');
});
csvDropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  csvDropZone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file) handleCSVFile(file);
});
csvFileInput.addEventListener('change', () => {
  if (csvFileInput.files[0]) handleCSVFile(csvFileInput.files[0]);
});

function handleCSVFile(file) {
  if (!file.name.endsWith('.csv')) {
    showToast('Please upload a .csv file', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const result = parseCSV(e.target.result);

    if (result.error) {
      showToast(result.error, 'error');
      return;
    }

    csvPreviewData = result.data;
    document.getElementById('csv-preview-count').textContent = csvPreviewData.length;

    const tbody = document.getElementById('csv-preview-body');
    tbody.innerHTML = csvPreviewData.slice(0, 20).map(r => `
      <tr>
        <td>${r.date}</td>
        <td>${r.description}</td>
        <td>${r.amount}</td>
        <td><span class="badge badge-${r.type.toLowerCase()}">${r.type}</span></td>
        <td>${r.category}</td>
      </tr>
    `).join('');

    document.getElementById('csv-preview-card').style.display = 'block';
    showToast(`${csvPreviewData.length} rows parsed. Review and click Import.`, 'info');
  };
  reader.readAsText(file);
}

document.getElementById('csv-import-btn').addEventListener('click', () => {
  if (!csvPreviewData || csvPreviewData.length === 0) return;
  const count = importCSVData(csvPreviewData);
  showToast(`${count} transactions imported!`, 'success');
  csvPreviewData = null;
  document.getElementById('csv-preview-card').style.display = 'none';
  csvFileInput.value = '';
});

document.getElementById('csv-cancel-btn').addEventListener('click', () => {
  csvPreviewData = null;
  document.getElementById('csv-preview-card').style.display = 'none';
  csvFileInput.value = '';
});

// --- Export CSV ---
document.getElementById('export-csv-btn').addEventListener('click', () => {
  const success = exportCSV();
  if (success) {
    showToast('CSV exported successfully');
  } else {
    showToast('No transactions to export', 'warning');
  }
});

// --- Export Charts as ZIP ---
document.getElementById('export-charts-btn').addEventListener('click', async () => {
  const checkboxes = document.querySelectorAll('#export-checkboxes input[type="checkbox"]:checked');
  if (checkboxes.length === 0) {
    showToast('Select at least one chart to export', 'warning');
    return;
  }

  // ── Step 1: Navigate to Analytics so canvases become visible ──
  // Charts can't render into a hidden (display:none) section — canvas stays blank.
  const prevSection = currentSection;
  showToast('Rendering charts…', 'info');
  navigateTo('analytics');

  // ── Step 2: Wait for Chart.js animations to finish ──
  await new Promise(resolve => setTimeout(resolve, 700));

  // ── Step 3: Capture each selected canvas ──
  // Use data-URL length as blank-check: a truly empty canvas is ~80 chars,
  // a real chart is several thousand.
  const entries = [];
  checkboxes.forEach(cb => {
    const canvas = document.getElementById(cb.value);
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      if (dataUrl.length > 1000) {
        entries.push({ name: `${cb.value}.png`, dataUrl });
      }
    }
  });

  if (entries.length === 0) {
    showToast('No chart data — add transactions first.', 'warning');
    navigateTo(prevSection);
    return;
  }

  // ── Step 4a: Single chart → direct PNG download ──
  if (entries.length === 1) {
    const link = document.createElement('a');
    link.download = `fintrack_${entries[0].name}`;
    link.href = entries[0].dataUrl;
    link.click();
    showToast('Chart downloaded as PNG');
    navigateTo(prevSection);
    return;
  }

  // ── Step 4b: Multiple charts → one ZIP ──
  try {
    showToast('Building ZIP…', 'info');

    const zip = new JSZip();
    const folder = zip.folder('fintrack_charts');

    for (const entry of entries) {
      const base64 = entry.dataUrl.split(',')[1];
      folder.file(entry.name, base64, { base64: true });
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'fintrack_charts.zip';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);

    showToast(`✅ ${entries.length} charts saved to fintrack_charts.zip`);
  } catch (err) {
    console.error('ZIP export failed:', err);
    showToast('Failed to create ZIP: ' + err.message, 'error');
  }

  // ── Step 5: Return user to where they were ──
  navigateTo(prevSection);
});


// --- Clear All Data ---
// --- Clear Data (surgical: keeps categories & settings) ---
document.getElementById('clear-data-btn').addEventListener('click', async () => {
  const ok = await confirmAction('This will permanently delete all transactions and budgets.\nYour categories and settings will be kept.');
  if (ok) {
    // Surgical reset — ported from Python’s /api/settings/reset endpoint
    saveData(STORAGE_KEYS.transactions, []);
    saveData(STORAGE_KEYS.budgets, []);
    // Reset only transaction and budget ID counters
    const ids = loadData(STORAGE_KEYS.nextId) || { transactions: 1, categories: 12, budgets: 1 };
    ids.transactions = 1;
    ids.budgets = 1;
    saveData(STORAGE_KEYS.nextId, ids);
    currencySymbol = getCurrencySymbol();
    showToast('Transactions & budgets cleared — categories and settings preserved', 'info');
    navigateTo('dashboard');
  }
});


// ============ INITIAL LOAD ============

// Apply saved theme
const savedTheme = getSettings().theme || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
elements.themeToggle.textContent = savedTheme === 'dark' ? '🌙 Toggle Theme' : '☀️ Toggle Theme';

// Apply saved currency
currencySymbol = getCurrencySymbol();

// Load dashboard
loadDashboard();