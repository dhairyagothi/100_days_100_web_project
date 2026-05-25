
(function () {
  'use strict';

  // ============ GLOBAL STATE ============
  // These variables track the application's current state.

  let currentSection = 'dashboard';   // Which section/page is currently visible
  let allCategories = [];             // Cached list of all categories from the API
  let editingTransactionId = null;    // ID of the transaction being edited (null = adding new)
  let currencySymbol = '$';           // Current currency symbol for formatting
  let charts = {};                    // Store Chart.js instances for cleanup/rebuild
  let csvPreviewData = null;          // Temporary storage for CSV preview data
  let debounceTimer = null;           // Timer for search input debounce


  // Cache frequently used DOM elements for better performance.

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


  /**
   * Show the loading spinner overlay.
   */
  function showLoading() {
    elements.loadingOverlay.classList.add('active');
  }

  /**
   * Hide the loading spinner overlay.
   */
  function hideLoading() {
    elements.loadingOverlay.classList.remove('active');
  }

  /**
   * Show  toast notification message.
   * @param {string} message - The message to display
   * @param {string} type    - Toast type: 'success', 'error', 'warning', 'info'
   */
  function showToast(message, type = 'success') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    // Map type to emoji icon
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };

    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <span class="toast-message">${message}</span>
    `;

    //  container
    elements.toastContainer.appendChild(toast);

    // Auto-remove after 3 seconds with exit animation
    setTimeout(() => {
      toast.classList.add('removing');
      // Wait for animation to finish, then remove from DOM
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  /**
   * Fetch wrapper with error handling and loading indicator.
   * All API calls should go through this function.
   *
   * @param {string} url      - The API endpoint URL
   * @param {object} options  - Fetch options (method, body, headers, etc.)
   * @returns {Promise<any>}    Parsed JSON response data
   */
  async function api(url, options = {}) {
    try {
      showLoading();

      // fetch config 
      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      };

      // Don't set Content-Type for FormData (browser sets boundary automatically)
      if (options.body instanceof FormData) {
        delete config.headers['Content-Type'];
      }

      const response = await fetch(url, config);

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error ${response.status}`);
      }

      // Handle blob/file responses (e.g., CSV export)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/csv')) {
        return response.blob();
      }

      return await response.json();
    } catch (error) {
      showToast(error.message || 'Something went wrong', 'error');
      throw error; // Re-throw so callers can handle if needed
    } finally {
      hideLoading();
    }
  }

  /*
 Format a number as currency with the current symbol.
  Example: 1234.56 → "$1,234.56"

  @param {number} amount - The amount to format
  @returns {string}        Formatted currency string
   */
  function formatCurrency(amount) {
    const num = parseFloat(amount) || 0;
    return `${currencySymbol}${num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  }

  /*
  Format a date string for user-friendly display.
  from "2024-01-15" → "Jan 15, 2024"

   */
  function formatDate(dateStr) {
    if (!dateStr) return '';
    // Adding T00:00:00 prevents timezone offset issues
    const date = new Date(dateStr + 'T00:00:00'); // this 
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Show a confirmation dialog and wait for user response.
   * Returns a Promise that resolves to true (confirmed) or false (cancelled).
   */
  function confirmAction(message) {
    return new Promise((resolve) => {
      // Set message
      document.getElementById('confirm-message').textContent = message;
      // Show modal
      elements.confirmModal.style.display = 'flex';

      // Confirm button
      const handleConfirm = () => {
        elements.confirmModal.style.display = 'none';
        cleanup();
        resolve(true);
      };

      // Cancel button
      const handleCancel = () => {
        elements.confirmModal.style.display = 'none';
        cleanup();
        resolve(false);
      };

      // Remove listeners to avoid duplicates
      const cleanup = () => {
        document.getElementById('confirm-ok').removeEventListener('click', handleConfirm);
        document.getElementById('confirm-cancel').removeEventListener('click', handleCancel);
      };

      // Attach listeners
      document.getElementById('confirm-ok').addEventListener('click', handleConfirm);
      document.getElementById('confirm-cancel').addEventListener('click', handleCancel);
    });
  }


  function animateValue(element, target, isCurrency = true) {
    const duration = 800; // Animation duration
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      //smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (target - start) * eased;

      // Update text
      element.textContent = isCurrency
        ? formatCurrency(current)
        : Math.round(current).toString();

      // Continue animating if not done
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  function navigateTo(sectionName) {
    currentSection = sectionName;

    // Update active state on nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.section === sectionName);
    });

    // Show the target section and hide  others
    document.querySelectorAll('.section').forEach(section => {
      section.classList.remove('active');
    });
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    // Close sidebar on mobile after navigation
    elements.sidebar.classList.remove('open');

    // Call the appropriate loader for the section
    const loaders = {
      dashboard: loadDashboard,
      transactions: loadTransactions,
      analytics: loadAnalytics,
      budgets: loadBudgets,
      import: loadImport,
      export: loadExport,
      settings: loadSettings
    };

    if (loaders[sectionName]) {
      loaders[sectionName]();
    }
  }


  // ============================================================
  //  SECTION 1: DASHBOARD
  //  Shows financial overview with stat cards, top category,
  //  and recent transactions.
  // ============================================================

  /**
   * Load and display all dashboard data.
   * Fetches summary analytics and recent transactions.
   */
  async function loadDashboard() {
    try {
      // 1. Fetch summary analytics
      const summary = await api('/api/analytics/summary');

      // 2. Animate stat card values with count-up effect
      animateValue(document.getElementById('total-income'), summary.total_income || 0);
      animateValue(document.getElementById('total-expense'), summary.total_expense || 0);
      animateValue(document.getElementById('total-savings'), summary.total_savings || 0);
      animateValue(document.getElementById('transaction-count'), summary.transaction_count || 0, false);

      // 3. Display top spending category
      const topCategoryEl = document.getElementById('top-category');
      if (summary.top_category) {
        topCategoryEl.innerHTML = `
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 2rem;">🏷️</span>
            <div>
              <div style="font-weight: 600; font-size: 1.1rem;">${summary.top_category.name}</div>
              <div style="color: var(--text-secondary);">${formatCurrency(summary.top_category.amount)}</div>
            </div>
          </div>
        `;
      } else {
        topCategoryEl.innerHTML = '<p class="empty-text">No spending data available</p>';
      }

      // 4. Fetch and display recent transactions (last 10)
      const transactions = await api('/api/transactions?sort=date&order=desc');
      const recent = (transactions.transactions || transactions || []).slice(0, 10);
      renderRecentTransactions(recent);

    } catch (error) {
      // Errors are already displayed via toast in the api() function
    }
  }

  /**
   * Render the recent transactions table on the dashboard.
   *
   * @param {Array} transactions - Array of transaction objects
   */
  function renderRecentTransactions(transactions) {
    const tbody = document.getElementById('recent-transactions-body');

    if (!transactions || transactions.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 24px; color: var(--text-secondary);">
            No recent transactions
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = transactions.map(t => `
      <tr>
        <td>${formatDate(t.date)}</td>
        <td>${t.description}</td>
        <td class="${t.type === 'Income' ? 'text-income' : 'text-expense'}">
          ${t.type === 'Income' ? '+' : '-'}${formatCurrency(t.amount)}
        </td>
        <td><span class="badge badge-${t.type.toLowerCase()}">${t.type}</span></td>
        <td>${t.category || ''}</td>
      </tr>
    `).join('');
  }


  // ============================================================
  //  SECTION 2: TRANSACTIONS
  //  Full transaction management with CRUD, search, filter, sort.
  // ============================================================

  /**
   * Load and display the transactions section.
   * Fetches categories and transactions with current filters.
   */
  async function loadTransactions() {
    try {
      // Fetch categories for dropdowns
      await loadCategories();
      populateCategoryFilter();

      // Fetch and render transactions
      await fetchAndRenderTransactions();
    } catch (error) {
      // Errors shown via toast
    }
  }

  /**
   * Fetch all categories from the API and cache them.
   */
  async function loadCategories() {
    try {
      const data = await api('/api/categories');
      allCategories = data.categories || data || [];
    } catch (error) {
      allCategories = [];
    }
  }

  /**
   * Populate the category filter dropdown in the transactions section.
   */
  function populateCategoryFilter() {
    const filter = document.getElementById('transaction-category-filter');
    // Keep the "All Categories" default option
    filter.innerHTML = '<option value="">All Categories</option>';

    allCategories.forEach(cat => {
      const name = typeof cat === 'string' ? cat : cat.name;
      filter.innerHTML += `<option value="${name}">${name}</option>`;
    });
  }

  /**
   * Populate the category dropdown in the transaction form.
   * Filters categories based on the selected transaction type.
   *
   * @param {string} type - 'Income' or 'Expense'
   */
  function populateFormCategories(type) {
    const select = document.getElementById('form-category');
    select.innerHTML = '';

    // Filter categories by type (if type info is available)
    const filtered = allCategories.filter(cat => {
      const catType = typeof cat === 'string' ? null : cat.type;
      return !catType || catType === type;
    });

    if (filtered.length === 0) {
      select.innerHTML = '<option value="">No categories available</option>';
      return;
    }

    filtered.forEach(cat => {
      const name = typeof cat === 'string' ? cat : cat.name;
      select.innerHTML += `<option value="${name}">${name}</option>`;
    });
  }

  /**
   * Fetch transactions from the API using current filter/sort values,
   * then render them in the table.
   */
  async function fetchAndRenderTransactions() {
    try {
      // Read current filter values from the DOM
      const search = document.getElementById('transaction-search').value;
      const category = document.getElementById('transaction-category-filter').value;
      const type = document.getElementById('transaction-type-filter').value;
      const sortVal = document.getElementById('transaction-sort').value;

      // Build query string
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      if (type) params.set('type', type);

      // Parse sort value (e.g., "date-desc" → sort=date, order=desc)
      const [sortField, sortOrder] = sortVal.split('-');
      params.set('sort', sortField);
      params.set('order', sortOrder);

      const data = await api(`/api/transactions?${params.toString()}`);
      const transactions = data.transactions || data || [];

      renderTransactionsTable(transactions);
    } catch (error) {
      // Errors shown via toast
    }
  }

  /**
   * Render the full transactions table with edit/delete actions.
   *
   * @param {Array} transactions - Array of transaction objects
   */
  function renderTransactionsTable(transactions) {
    const tbody = document.getElementById('transactions-table-body');
    const emptyState = document.getElementById('transactions-empty');

    if (!transactions || transactions.length === 0) {
      tbody.innerHTML = '';
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';
    tbody.innerHTML = transactions.map(t => `
      <tr>
        <td>${formatDate(t.date)}</td>
        <td>${t.description}</td>
        <td class="${t.type === 'Income' ? 'text-income' : 'text-expense'}">
          ${t.type === 'Income' ? '+' : '-'}${formatCurrency(t.amount)}
        </td>
        <td><span class="badge badge-${t.type.toLowerCase()}">${t.type}</span></td>
        <td>${t.category || ''}</td>
        <td>
          <button class="action-btn btn-edit" onclick="window._editTransaction(${t.id})" title="Edit">
            ✏️ Edit
          </button>
          <button class="action-btn btn-delete" onclick="window._deleteTransaction(${t.id})" title="Delete">
            🗑️ Delete
          </button>
        </td>
      </tr>
    `).join('');
  }

  /**
   * Open the transaction modal for ADDING a new transaction.
   * Resets the form and sets default values.
   */
  function openAddModal() {
    editingTransactionId = null;
    document.getElementById('modal-title').textContent = 'Add Transaction';
    document.getElementById('modal-submit').textContent = 'Save';
    elements.transactionForm.reset();
    document.getElementById('transaction-id').value = '';

    // Set default date to today
    document.getElementById('form-date').value = new Date().toISOString().split('T')[0];

    // Populate categories for the default type
    populateFormCategories(document.getElementById('form-type').value);

    // Show the modal
    elements.transactionModal.style.display = 'flex';
  }

  /**
   * Open the transaction modal for EDITING an existing transaction.
   * Fetches the transaction data and pre-fills the form.
   *
   * @param {number} id - The transaction ID to edit
   */
  async function openEditModal(id) {
    try {
      editingTransactionId = id;

      // Fetch the transaction data
      const data = await api(`/api/transactions/${id}`);
      const t = data.transaction || data;

      // Pre-fill the form
      document.getElementById('modal-title').textContent = 'Edit Transaction';
      document.getElementById('modal-submit').textContent = 'Update';
      document.getElementById('transaction-id').value = t.id;
      document.getElementById('form-date').value = t.date;
      document.getElementById('form-description').value = t.description;
      document.getElementById('form-amount').value = t.amount;
      document.getElementById('form-type').value = t.type;

      // Populate and select the category
      populateFormCategories(t.type);
      document.getElementById('form-category').value = t.category;

      // Show the modal
      elements.transactionModal.style.display = 'flex';
    } catch (error) {
      // Error shown via toast
    }
  }

  /**
   * Close the transaction modal and reset state.
   */
  function closeModal() {
    elements.transactionModal.style.display = 'none';
    elements.transactionForm.reset();
    editingTransactionId = null;
  }

  /**
   * Handle transaction form submission (both add and edit).
   * Sends POST (new) or PUT (edit) request to the API.
   *
   * @param {Event} e - The form submit event
   */
  async function handleTransactionSubmit(e) {
    e.preventDefault();

    // Collect form data
    const formData = {
      date: document.getElementById('form-date').value,
      description: document.getElementById('form-description').value,
      amount: parseFloat(document.getElementById('form-amount').value),
      type: document.getElementById('form-type').value,
      category: document.getElementById('form-category').value
    };

    try {
      if (editingTransactionId) {
        // UPDATE existing transaction
        await api(`/api/transactions/${editingTransactionId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
        showToast('Transaction updated successfully');
      } else {
        // CREATE new transaction
        await api('/api/transactions', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        showToast('Transaction added successfully');
      }

      // Close modal and refresh
      closeModal();
      if (currentSection === 'transactions') {
        await fetchAndRenderTransactions();
      } else {
        navigateTo(currentSection);
      }
    } catch (error) {
      // Error shown via toast
    }
  }

  /**
   * Delete a transaction after user confirmation.
   *
   * @param {number} id - The transaction ID to delete
   */
  async function deleteTransaction(id) {
    const confirmed = await confirmAction(
      'Are you sure you want to delete this transaction? This action cannot be undone.'
    );
    if (!confirmed) return;

    try {
      await api(`/api/transactions/${id}`, { method: 'DELETE' });
      showToast('Transaction deleted successfully');
      await fetchAndRenderTransactions();
    } catch (error) {
      // Error shown via toast
    }
  }

  // Expose edit/delete functions globally so inline onclick handlers can call them
  window._editTransaction = openEditModal;
  window._deleteTransaction = deleteTransaction;


  // ============================================================
  //  SECTION 3: ANALYTICS
  //  Chart.js visualizations for financial data.
  // ============================================================

  /**
   * Load and render all analytics charts.
   * Fetches data from multiple endpoints and creates Chart.js instances.
   */
  async function loadAnalytics() {
    try {
      // Fetch all analytics data in parallel for performance
      const [categoryData, monthlyData, savingsData, incomeSourcesData, dailySpendingData, topCategoriesData] = await Promise.all([
        api('/api/analytics/category-breakdown'),
        api('/api/analytics/monthly-trend'),
        api('/api/analytics/savings-trend'),
        api('/api/analytics/income-sources'),
        api('/api/analytics/daily-spending'),
        api('/api/analytics/top-categories')
      ]);

      // Destroy existing chart instances to prevent memory leaks
      // (Chart.js requires manual cleanup)
      Object.values(charts).forEach(chart => {
        if (chart) chart.destroy();
      });
      charts = {};

      // Get theme-aware colors for chart styling
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';
      const textColor = isDark ? '#94a3b8' : '#6b7280';

      // Beautiful color palette for charts
      const chartColors = [
        '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316',
        '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6'
      ];

      // Create each chart
      createCategoryChart(categoryData, chartColors, textColor);
      createMonthlyChart(monthlyData, gridColor, textColor);
      createIncomeExpenseChart(monthlyData, gridColor, textColor);
      createSavingsChart(savingsData, gridColor, textColor);
      createIncomeSourcesChart(incomeSourcesData, chartColors, textColor);
      createDailySpendingChart(dailySpendingData, gridColor, textColor);
      createTopCategoriesChart(topCategoriesData, gridColor, textColor);

    } catch (error) {
      // Errors shown via toast
    }
  }

  /**
   * Create the Category Doughnut Chart.
   * Shows expense distribution by category.
   */
  function createCategoryChart(data, colors, textColor) {
    // Backend returns parallel arrays: {categories: [...], amounts: [...], colors: [...]}
    const categoryNames = data.categories || [];
    const categoryAmounts = data.amounts || [];
    if (categoryNames.length === 0) return;

    const ctx = document.getElementById('category-chart').getContext('2d');
    charts.category = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: categoryNames,
        datasets: [{
          data: categoryAmounts,
          backgroundColor: colors.slice(0, categoryNames.length),
          borderWidth: 0,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%', // Creates the "donut hole"
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: textColor,
              padding: 16,
              usePointStyle: true,
              font: { size: 12 }
            }
          }
        }
      }
    });
  }

  /**
   * Create the Monthly Expenses Bar Chart.
   * Shows expense amounts per month with gradient bars.
   */
  function createMonthlyChart(data, gridColor, textColor) {
    // Backend returns parallel arrays: {months: [...], income: [...], expenses: [...]}
    const monthLabels = data.months || [];
    const expenseValues = data.expenses || [];
    if (monthLabels.length === 0) return;

    const ctx = document.getElementById('monthly-chart').getContext('2d');

    // Create a vertical gradient for the bars
    const gradient = ctx.createLinearGradient(0, 0, 0, 350);
    gradient.addColorStop(0, 'rgba(239, 68, 68, 0.8)');
    gradient.addColorStop(1, 'rgba(239, 68, 68, 0.1)');

    charts.monthly = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: monthLabels,
        datasets: [{
          label: 'Expenses',
          data: expenseValues,
          backgroundColor: gradient,
          borderRadius: 8,       // Rounded bar corners
          borderSkipped: false   // Round all corners, not just top
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: textColor } }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: textColor }
          },
          y: {
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              callback: v => currencySymbol + v // Prefix with currency symbol
            }
          }
        }
      }
    });
  }

  /**
   * Create the Income vs Expense Grouped Bar Chart.
   * Compares income and expenses side-by-side per month.
   */
  function createIncomeExpenseChart(data, gridColor, textColor) {
    // Backend returns parallel arrays: {months: [...], income: [...], expenses: [...]}
    const monthLabels = data.months || [];
    const incomeValues = data.income || [];
    const expenseValues = data.expenses || [];
    if (monthLabels.length === 0) return;

    const ctx = document.getElementById('income-expense-chart').getContext('2d');
    charts.incomeExpense = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: monthLabels,
        datasets: [
          {
            label: 'Income',
            data: incomeValues,
            backgroundColor: 'rgba(16, 185, 129, 0.7)',
            borderRadius: 8,
            borderSkipped: false
          },
          {
            label: 'Expense',
            data: expenseValues,
            backgroundColor: 'rgba(239, 68, 68, 0.7)',
            borderRadius: 8,
            borderSkipped: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: textColor } }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: textColor }
          },
          y: {
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              callback: v => currencySymbol + v
            }
          }
        }
      }
    });
  }

  /**
   * Create the Savings Trend Line Chart.
   * Shows cumulative savings over time with gradient fill.
   */
  function createSavingsChart(data, gridColor, textColor) {
    // Backend returns parallel arrays: {months: [...], savings: [...], cumulative: [...]}
    const monthLabels = data.months || [];
    const cumulativeValues = data.cumulative || [];
    if (monthLabels.length === 0) return;

    const ctx = document.getElementById('savings-chart').getContext('2d');

    // Create gradient fill under the line
    const gradient = ctx.createLinearGradient(0, 0, 0, 350);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');

    charts.savings = new Chart(ctx, {
      type: 'line',
      data: {
        labels: monthLabels,
        datasets: [{
          label: 'Cumulative Savings',
          data: cumulativeValues,
          borderColor: '#3b82f6',
          backgroundColor: gradient,
          fill: true,             // Fill area under the line
          tension: 0.4,           // Smooth curve
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: textColor } }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: textColor }
          },
          y: {
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              callback: v => currencySymbol + v
            }
          }
        }
      }
    });
  }


  /**
   * Create the Income Sources Doughnut Chart.
   * Shows income distribution by source/category.
   */
  function createIncomeSourcesChart(data, colors, textColor) {
    const categoryNames = data.categories || [];
    const categoryAmounts = data.amounts || [];
    if (categoryNames.length === 0) return;

    const ctx = document.getElementById('income-sources-chart').getContext('2d');
    charts.incomeSources = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: categoryNames,
        datasets: [{
          data: categoryAmounts,
          backgroundColor: colors.slice(0, categoryNames.length),
          borderWidth: 0,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: textColor,
              padding: 16,
              usePointStyle: true,
              font: { size: 12 }
            }
          }
        }
      }
    });
  }

  /**
   * Create the Daily Spending Line Chart.
   * Shows expense amounts per day for the last 30 days.
   */
  function createDailySpendingChart(data, gridColor, textColor) {
    const dateLabels = data.dates || [];
    const amounts = data.amounts || [];
    if (dateLabels.length === 0) return;

    const ctx = document.getElementById('daily-spending-chart').getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 0, 350);
    gradient.addColorStop(0, 'rgba(233, 69, 96, 0.4)');
    gradient.addColorStop(1, 'rgba(233, 69, 96, 0.0)');

    charts.dailySpending = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dateLabels,
        datasets: [{
          label: 'Daily Spending',
          data: amounts,
          borderColor: '#e94560',
          backgroundColor: gradient,
          fill: true,
          tension: 0.3,
          pointBackgroundColor: '#e94560',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: textColor } }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: textColor,
              maxTicksLimit: 8
            }
          },
          y: {
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              callback: v => currencySymbol + v
            }
          }
        }
      }
    });
  }

  /**
   * Create the Top Categories Horizontal Bar Chart.
   * Shows the top 5 expense categories.
   */
  function createTopCategoriesChart(data, gridColor, textColor) {
    const categoryNames = data.categories || [];
    const amounts = data.amounts || [];
    const barColors = data.colors || ['#e94560', '#f5a623', '#50e3c2', '#4a90d9', '#c471ed'];
    if (categoryNames.length === 0) return;

    const ctx = document.getElementById('top-categories-chart').getContext('2d');
    charts.topCategories = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: categoryNames,
        datasets: [{
          label: 'Total Spent',
          data: amounts,
          backgroundColor: barColors.slice(0, categoryNames.length),
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              callback: v => currencySymbol + v
            }
          },
          y: {
            grid: { display: false },
            ticks: { color: textColor }
          }
        }
      }
    });
  }


  // ============================================================
  //  SECTION 4: BUDGETS
  //  Set spending limits per category and track progress.
  // ============================================================

  /**
   * Load and display the budgets section.
   * Fetches expense categories and existing budgets.
   */
  async function loadBudgets() {
    try {
      // Fetch categories and filter to expense-only for budget form
      await loadCategories();
      const budgetCategory = document.getElementById('budget-category');
      budgetCategory.innerHTML = '<option value="">Select Category</option>';

      allCategories
        .filter(cat => {
          const type = typeof cat === 'string' ? null : cat.type;
          return !type || type === 'Expense';
        })
        .forEach(cat => {
          const name = typeof cat === 'string' ? cat : cat.name;
          budgetCategory.innerHTML += `<option value="${name}">${name}</option>`;
        });

      // Fetch and render existing budgets
      const data = await api('/api/budgets');
      const budgets = data.budgets || data || [];
      renderBudgets(budgets);
    } catch (error) {
      // Error shown via toast
    }
  }

  /**
   * Render budget cards with progress bars.
   * Progress bar color changes based on spending percentage:
   *   - Green: < 70% used
   *   - Yellow: 70-89% used
   *   - Red: >= 90% used
   *
   * @param {Array} budgets - Array of budget objects
   */
  function renderBudgets(budgets) {
    const container = document.getElementById('budgets-list');
    const emptyState = document.getElementById('budgets-empty');

    if (!budgets || budgets.length === 0) {
      container.innerHTML = '';
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';
    container.innerHTML = budgets.map(b => {
      const spent = b.spent || 0;
      const limit = b.monthly_limit || b.limit || b.amount || 0;
      const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
      const remaining = limit - spent;

      // Determine progress bar color class
      let colorClass = 'green';
      if (percentage >= 90) colorClass = 'red';
      else if (percentage >= 70) colorClass = 'yellow';

      const isOverBudget = spent > limit;

      return `
        <div class="card budget-card">
          <button class="budget-delete" onclick="window._deleteBudget(${b.id})" title="Delete budget">&times;</button>
          <div class="budget-header">
            <span class="budget-category">${b.category}</span>
            <span class="budget-amount">${formatCurrency(limit)}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill ${colorClass}" style="width: ${percentage}%"></div>
          </div>
          <div class="budget-info">
            <span>Spent: ${formatCurrency(spent)}</span>
            <span>Remaining: ${formatCurrency(Math.max(remaining, 0))}</span>
          </div>
          ${isOverBudget
            ? `<div class="budget-warning">⚠️ Over budget by ${formatCurrency(Math.abs(remaining))}</div>`
            : ''
          }
        </div>
      `;
    }).join('');
  }

  /**
   * Handle budget form submission.
   * Creates a new budget for the selected category.
   *
   * @param {Event} e - The form submit event
   */
  async function handleBudgetSubmit(e) {
    e.preventDefault();

    const category = document.getElementById('budget-category').value;
    const amount = parseFloat(document.getElementById('budget-amount').value);

    if (!category || !amount) {
      showToast('Please fill in all fields', 'warning');
      return;
    }

    try {
      await api('/api/budgets', {
        method: 'POST',
        body: JSON.stringify({ category, amount })
      });
      showToast('Budget set successfully');
      document.getElementById('budget-form').reset();
      await loadBudgets();
    } catch (error) {
      // Error shown via toast
    }
  }

  /**
   * Delete a budget after user confirmation.
   *
   * @param {number} id - The budget ID to delete
   */
  async function deleteBudget(id) {
    const confirmed = await confirmAction('Are you sure you want to delete this budget?');
    if (!confirmed) return;

    try {
      await api(`/api/budgets/${id}`, { method: 'DELETE' });
      showToast('Budget deleted successfully');
      await loadBudgets();
    } catch (error) {
      // Error shown via toast
    }
  }

  // Expose globally for inline onclick handlers
  window._deleteBudget = deleteBudget;


  // ============================================================
  //  SECTION 5: IMPORT CSV
  //  Upload CSV files, preview data, and confirm import.
  // ============================================================

  /**
   * Initialize the import section.
   * Resets preview state and file input.
   */
  function loadImport() {
    csvPreviewData = null;
    document.getElementById('csv-preview-container').style.display = 'none';
    document.getElementById('csv-file-input').value = '';
  }

  /**
   * Handle CSV file upload.
   * Reads the selected file, sends it to the API, and shows a preview.
   */
  async function handleCSVUpload() {
    const fileInput = document.getElementById('csv-file-input');
    const file = fileInput.files[0];

    // Validate file selection
    if (!file) {
      showToast('Please select a CSV file', 'warning');
      return;
    }

    if (!file.name.endsWith('.csv')) {
      showToast('Please select a valid CSV file', 'error');
      return;
    }

    try {
      // Send file as FormData
      const formData = new FormData();
      formData.append('file', file);

      const data = await api('/api/csv/upload', {
        method: 'POST',
        body: formData
      });

      // Clear input and show success toast
      document.getElementById('csv-file-input').value = '';
      showToast(`Successfully imported ${data.count} transactions`);

      // Optionally refresh transactions if user clicks over to that tab
    } catch (error) {
      // Error shown via toast
    }
  }


  // ============================================================
  //  SECTION 6: EXPORT CHARTS
  //  Select and download charts as image files.
  // ============================================================

  /**
   * Initialize the export section.
   * No data to load — checkboxes retain their state.
   */
  function loadExport() {
    // Nothing to load, section is ready by default
  }

  /**
   * Handle chart export download.
   * Collects selected charts, sends to API, and triggers download.
   */
  async function handleExportDownload() {
    // Collect which charts are selected — use names that match the backend
    const selectedCharts = [];
    if (document.getElementById('export-category').checked) selectedCharts.push('category');
    if (document.getElementById('export-monthly').checked) selectedCharts.push('monthly');
    if (document.getElementById('export-income-expense').checked) selectedCharts.push('income-expense');
    if (document.getElementById('export-savings').checked) selectedCharts.push('savings');
    if (document.getElementById('export-income-sources').checked) selectedCharts.push('income-sources');
    if (document.getElementById('export-daily-spending').checked) selectedCharts.push('daily-spending');
    if (document.getElementById('export-top-categories').checked) selectedCharts.push('top-categories');

    // Validate at least one chart is selected
    if (selectedCharts.length === 0) {
      showToast('Please select at least one chart to export', 'warning');
      return;
    }

    const format = document.getElementById('export-format').value;

    try {
      const response = await fetch('/api/export/charts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ charts: selectedCharts, format })
      });

      if (!response.ok) throw new Error('Export failed');

      // Download the response as a file
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `fintrack-charts.${format === 'png' ? 'zip' : format}`;
      link.click();
      URL.revokeObjectURL(url);

      showToast('Charts exported successfully');
    } catch (error) {
      showToast('Failed to export charts', 'error');
    }
  }


  // ============================================================
  //  SECTION 7: SETTINGS
  //  Theme toggle, currency selection, data management.
  // ============================================================

  /**
   * Load settings section.
   * Settings are applied on app init, no need to reload here.
   */
  function loadSettings() {
    // Settings are loaded on init — nothing to re-fetch
  }

  /**
   * Handle dark/light theme toggle.
   * Updates the data-theme attribute and saves to API.
   */
  function handleThemeToggle() {
    const isDark = elements.themeToggle.checked;
    const theme = isDark ? 'dark' : 'light';

    // Apply theme immediately
    document.documentElement.setAttribute('data-theme', theme);

    // Persist to server (fire and forget)
    api('/api/settings', {
      method: 'POST',
      body: JSON.stringify({ key: 'theme', value: theme })
    }).catch(() => {});

    // Rebuild charts if currently viewing analytics
    // (chart colors need to match the new theme)
    if (currentSection === 'analytics') {
      loadAnalytics();
    }
  }

  /**
   * Handle currency selection change.
   * Updates the global currency symbol and refreshes the current view.
   */
  function handleCurrencyChange() {
    currencySymbol = elements.currencySelect.value;

    // Persist to server
    api('/api/settings', {
      method: 'POST',
      body: JSON.stringify({ key: 'currency', value: currencySymbol })
    }).catch(() => {});

    // Reload the current section to reflect new currency
    navigateTo(currentSection);
    showToast('Currency updated');
  }

  /**
   * Handle data export (download all transactions as CSV).
   */
  async function handleExportData() {
    try {
      const response = await fetch('/api/csv/export');
      if (!response.ok) throw new Error('Export failed');

      // Trigger file download
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'fintrack-data.csv';
      link.click();
      URL.revokeObjectURL(url);

      showToast('Data exported successfully');
    } catch (error) {
      showToast('Failed to export data', 'error');
    }
  }

  /**
   * Handle "Reset All Data" with double confirmation.
   * Permanently deletes all transactions, budgets, and settings.
   */
  async function handleResetData() {
    const confirmed = await confirmAction(
      'This will PERMANENTLY delete all your transactions, budgets, and settings. This action cannot be undone. Are you absolutely sure?'
    );
    if (!confirmed) return;

    try {
      await api('/api/settings/reset', { method: 'POST' });
      showToast('All data has been reset');
      navigateTo('dashboard');
    } catch (error) {
      // Error shown via toast
    }
  }


  // ============================================================
  //  INITIALIZATION
  //  App startup: load settings, attach event listeners, show dashboard.
  // ============================================================

  /**
   * Initialize the application.
   * Fetches saved settings and applies them.
   */
  async function init() {
    try {
      // Fetch saved settings from the server
      const settings = await api('/api/settings').catch(() => ({}));

      if (settings) {
        // Apply saved theme
        if (settings.theme) {
          document.documentElement.setAttribute('data-theme', settings.theme);
          elements.themeToggle.checked = settings.theme === 'dark';
        }

        // Apply saved currency
        if (settings.currency) {
          currencySymbol = settings.currency;
          elements.currencySelect.value = settings.currency;
        }
      }
    } catch (error) {
      // Use default settings if fetch fails — no toast needed
    }

    // Load the dashboard as the default view
    loadDashboard();
  }

  /**
   * Set up all event listeners for the application.
   * Called once on DOMContentLoaded.
   */
  function setupEventListeners() {

    // === Navigation Links ===
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(link.dataset.section);
      });
    });

    // === Sidebar Toggle (Mobile) ===
    elements.sidebarToggle.addEventListener('click', () => {
      elements.sidebar.classList.toggle('open');
    });

    // === Transaction Modal ===
    document.getElementById('add-transaction-btn').addEventListener('click', openAddModal);
    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('modal-cancel').addEventListener('click', closeModal);

    // Close modal on overlay click (clicking outside the modal)
    elements.transactionModal.addEventListener('click', (e) => {
      if (e.target === elements.transactionModal) closeModal();
    });

    // === Transaction Form ===
    elements.transactionForm.addEventListener('submit', handleTransactionSubmit);

    // When transaction type changes, update the category dropdown
    document.getElementById('form-type').addEventListener('change', (e) => {
      populateFormCategories(e.target.value);
    });

    // === Transaction Filters ===
    // Debounced search — waits 300ms after typing stops
    document.getElementById('transaction-search').addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(fetchAndRenderTransactions, 300);
    });

    // Immediate filter on dropdown changes
    document.getElementById('transaction-category-filter').addEventListener('change', fetchAndRenderTransactions);
    document.getElementById('transaction-type-filter').addEventListener('change', fetchAndRenderTransactions);
    document.getElementById('transaction-sort').addEventListener('change', fetchAndRenderTransactions);

    // === Budget Form ===
    document.getElementById('budget-form').addEventListener('submit', handleBudgetSubmit);

    // === CSV Import ===
    document.getElementById('csv-upload-btn').addEventListener('click', handleCSVUpload);

    // === Export Charts ===
    document.getElementById('select-all-btn').addEventListener('click', () => {
      document.querySelectorAll('.export-options input[type="checkbox"]').forEach(cb => cb.checked = true);
    });
    document.getElementById('deselect-all-btn').addEventListener('click', () => {
      document.querySelectorAll('.export-options input[type="checkbox"]').forEach(cb => cb.checked = false);
    });
    document.getElementById('export-download-btn').addEventListener('click', handleExportDownload);

    // === Settings ===
    elements.themeToggle.addEventListener('change', handleThemeToggle);
    elements.currencySelect.addEventListener('change', handleCurrencyChange);
    document.getElementById('export-data-btn').addEventListener('click', handleExportData);
    document.getElementById('reset-data-btn').addEventListener('click', handleResetData);

    // === Confirm Modal — close on overlay click ===
    elements.confirmModal.addEventListener('click', (e) => {
      if (e.target === elements.confirmModal) {
        elements.confirmModal.style.display = 'none';
      }
    });

    // === Global Keyboard Shortcuts ===
    document.addEventListener('keydown', (e) => {
      // Escape key closes any open modal
      if (e.key === 'Escape') {
        closeModal();
        elements.confirmModal.style.display = 'none';
      }
    });
  }


  // ============ START THE APPLICATION ============
  // Wait for the DOM to be fully loaded before initializing.

  document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    init();
  });

})();
