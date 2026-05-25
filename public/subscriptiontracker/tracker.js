/**
 * Premium SaaS Subscription Tracker - Frontend Logic
 */

// State Management
let subscriptions = [];
let editingId = null;
let currentFilter = 'All';
let currentSort = 'Date';
let searchQuery = '';
let currentCurrency = 'USD';

// DOM Elements
const els = {
  // Lists & Containers
  subsList: document.getElementById('subs-list'),
  renewalsList: document.getElementById('renewals-list'),
  emptyState: document.getElementById('empty-state'),
  
  // Analytics
  statActive: document.getElementById('stat-active'),
  statMonthly: document.getElementById('stat-monthly'),
  statYearly: document.getElementById('stat-yearly'),
  
  // Controls
  searchInput: document.getElementById('search-input'),
  filterTabs: document.getElementById('filter-tabs'),
  currencySelect: document.getElementById('currency-select'),
  
  // Modal
  modal: document.getElementById('sub-modal'),
  modalTitle: document.getElementById('modal-title'),
  form: document.getElementById('sub-form'),
  
  // Form Inputs
  inName: document.getElementById('sub-name'),
  inCost: document.getElementById('sub-cost'),
  inCycle: document.getElementById('sub-cycle'),
  inDate: document.getElementById('sub-date'),
  inCategory: document.getElementById('sub-category'),
  
  // Utilities
  toastContainer: document.getElementById('toast-container')
};

// ============================================================================
// Initialization
// ============================================================================
function init() {
  loadData();
  setupEventListeners();
  renderAll();
}

function loadData() {
  const saved = localStorage.getItem('subscription-tracker-data');
  if (saved) {
    try {
      subscriptions = JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse data");
      subscriptions = [];
    }
  }
  
  const savedCurr = localStorage.getItem('subscription-tracker-currency');
  if (savedCurr) {
    currentCurrency = savedCurr;
  }
  if (els.currencySelect) els.currencySelect.value = currentCurrency;
}

function saveData() {
  localStorage.setItem('subscription-tracker-data', JSON.stringify(subscriptions));
}

// ============================================================================
// Core Logic & Data Processing
// ============================================================================

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function calculateNextRenewal(dateStr, cycle) {
  const today = new Date();
  today.setHours(0,0,0,0);
  
  let renewal = new Date(dateStr);
  renewal.setHours(0,0,0,0);
  
  // A renewal is strictly AFTER the first billing date.
  // We must always add at least one cycle initially.
  if (cycle === 'Monthly') {
    renewal.setMonth(renewal.getMonth() + 1);
  } else {
    renewal.setFullYear(renewal.getFullYear() + 1);
  }
  
  // Now, if this calculated renewal is still in the past, roll it forward until it is >= today
  while (renewal < today) {
    if (cycle === 'Monthly') {
      renewal.setMonth(renewal.getMonth() + 1);
    } else {
      renewal.setFullYear(renewal.getFullYear() + 1);
    }
  }
  return renewal;
}

function getDaysUntil(dateObj) {
  const today = new Date();
  today.setHours(0,0,0,0);
  const diffTime = dateObj - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function formatDate(dateObj) {
  return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getInitials(name) {
  return name.substring(0, 2).toUpperCase();
}

function formatCurrency(amount) {
  const num = parseFloat(amount) || 0;
  if (currentCurrency === 'INR') {
    return num.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  }
  return num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

// ============================================================================
// Rendering
// ============================================================================

function renderAll() {
  renderAnalytics();
  renderSubscriptions();
  renderRenewals();
}

function getFilteredAndSorted() {
  // Filter by search
  let filtered = subscriptions.filter(sub => 
    sub.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter by category
  if (currentFilter !== 'All') {
    filtered = filtered.filter(sub => sub.category === currentFilter);
  }
  
  // Sort
  if (currentSort === 'Date') {
    filtered.sort((a, b) => {
      const dateA = calculateNextRenewal(a.date, a.cycle);
      const dateB = calculateNextRenewal(b.date, b.cycle);
      return dateA - dateB;
    });
  } else if (currentSort === 'Price') {
    filtered.sort((a, b) => b.cost - a.cost);
  }
  
  return filtered;
}

function renderSubscriptions() {
  const filtered = getFilteredAndSorted();
  
  if (filtered.length === 0) {
    els.subsList.innerHTML = '';
    els.emptyState.style.display = 'flex';
    return;
  }
  
  els.emptyState.style.display = 'none';
  
  els.subsList.innerHTML = filtered.map(sub => {
    const nextRenewal = calculateNextRenewal(sub.date, sub.cycle);
    const daysUntil = getDaysUntil(nextRenewal);
    
    let statusClass = 'badge-active';
    let statusText = 'Active';
    
    if (sub.cycle === 'Yearly' && daysUntil <= 30) {
      statusClass = 'badge-danger';
      statusText = 'Needs Renewal';
    } else if (sub.cycle === 'Monthly' && daysUntil <= 7) {
      statusClass = 'badge-danger';
      statusText = 'Needs Renewal';
    } else if (daysUntil <= 3) {
      statusClass = 'badge-danger';
      statusText = 'Needs Renewal';
    }
    
    return `
      <div class="sub-row">
        <div class="sub-cell service-info">
          <div class="service-logo">${getInitials(sub.name)}</div>
          <div>
            <div class="service-name">${sub.name}</div>
            <div class="service-category">${sub.category}</div>
          </div>
        </div>
        
        <div class="sub-cell">
          <span class="badge badge-outline">${sub.cycle}</span>
        </div>
        
        <div class="sub-cell">
          <div>
            <div class="sub-cost">${formatCurrency(sub.cost)}</div>
            <div class="sub-cycle">per ${sub.cycle.toLowerCase().replace('ly', '')}</div>
          </div>
        </div>
        
        <div class="sub-cell">
          <div>
            <div style="color: var(--text-primary); font-weight: 500;">${formatDate(nextRenewal)}</div>
            <div class="badge ${statusClass}" style="margin-top: 4px;">${statusText}</div>
          </div>
        </div>
        
        <div class="sub-cell row-actions">
          <button class="btn-icon" onclick="editSub('${sub.id}')" title="Edit">
            <i class="ph ph-pencil-simple"></i>
          </button>
          <button class="btn-icon danger" onclick="deleteSub('${sub.id}')" title="Delete">
            <i class="ph ph-trash"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function renderAnalytics() {
  const activeCount = subscriptions.length;
  
  let totalMonthly = 0;
  let totalYearly = 0;
  
  subscriptions.forEach(sub => {
    const cost = parseFloat(sub.cost) || 0;
    if (sub.cycle === 'Monthly') {
      totalMonthly += cost;
      totalYearly += cost * 12;
    } else {
      totalMonthly += cost / 12;
      totalYearly += cost;
    }
  });
  
  // Animate numbers (simple approach)
  els.statActive.innerText = activeCount;
  els.statMonthly.innerText = formatCurrency(totalMonthly);
  els.statYearly.innerText = formatCurrency(totalYearly);
}

function renderRenewals() {
  if (subscriptions.length === 0) {
    els.renewalsList.innerHTML = '<div style="color: var(--text-tertiary); font-size: 0.875rem; text-align: center; padding: 20px 0;">No upcoming renewals</div>';
    return;
  }
  
  // Get all subs with their calculated next renewal date
  const withDates = subscriptions.map(sub => ({
    ...sub,
    nextDate: calculateNextRenewal(sub.date, sub.cycle),
    daysUntil: getDaysUntil(calculateNextRenewal(sub.date, sub.cycle))
  }));
  
  // Sort by nearest date
  withDates.sort((a, b) => a.daysUntil - b.daysUntil);
  
  // Take top 4
  const upcoming = withDates.slice(0, 4);
  
  els.renewalsList.innerHTML = upcoming.map(sub => {
    let dotClass = 'safe';
    let countdownClass = '';
    
    if (sub.daysUntil <= 3) {
      dotClass = 'urgent';
      countdownClass = 'urgent';
    } else if (sub.daysUntil <= 7) {
      dotClass = 'warning';
    }
    
    let timeText = sub.daysUntil === 0 ? 'Today' : 
                   sub.daysUntil === 1 ? 'Tomorrow' : 
                   `In ${sub.daysUntil} days`;
                   
    return `
      <div class="renewal-item">
        <div class="renewal-service">
          <div class="renewal-dot ${dotClass}"></div>
          <div>
            <div class="renewal-name">${sub.name}</div>
            <div class="renewal-cost">${formatCurrency(sub.cost)}</div>
          </div>
        </div>
        <div class="renewal-countdown ${countdownClass}">${timeText}</div>
      </div>
    `;
  }).join('');
}

// ============================================================================
// Actions & Events
// ============================================================================

function setupEventListeners() {
  // Modal toggles
  document.getElementById('btn-add-sub').addEventListener('click', () => openModal());
  document.getElementById('btn-empty-add').addEventListener('click', () => openModal());
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', closeModal);
  });
  
  // Form Submit
  els.form.addEventListener('submit', handleFormSubmit);
  
  // Search
  els.searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderSubscriptions();
  });
  
  // Category Tabs
  els.filterTabs.addEventListener('click', (e) => {
    if (e.target.classList.contains('tab-btn')) {
      // Remove active class from all
      els.filterTabs.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      // Add to clicked
      e.target.classList.add('active');
      // Update filter
      currentFilter = e.target.dataset.filter;
      renderSubscriptions();
    }
  });
  
  // Currency Toggle
  if (els.currencySelect) {
    els.currencySelect.addEventListener('change', (e) => {
      currentCurrency = e.target.value;
      localStorage.setItem('subscription-tracker-currency', currentCurrency);
      renderAll();
    });
  }
}

function openModal(id = null) {
  els.modal.classList.add('active');
  editingId = id;
  
  if (id) {
    els.modalTitle.innerText = 'Edit Subscription';
    const sub = subscriptions.find(s => s.id === id);
    if (sub) {
      els.inName.value = sub.name;
      els.inCost.value = sub.cost;
      els.inCycle.value = sub.cycle;
      els.inDate.value = sub.date;
      els.inCategory.value = sub.category;
    }
  } else {
    els.modalTitle.innerText = 'Add Subscription';
    els.form.reset();
    // Default date to today
    els.inDate.valueAsDate = new Date();
  }
}

function closeModal() {
  els.modal.classList.remove('active');
  editingId = null;
}

function handleFormSubmit(e) {
  e.preventDefault();
  
  const payload = {
    name: els.inName.value.trim(),
    cost: parseFloat(els.inCost.value),
    cycle: els.inCycle.value,
    date: els.inDate.value,
    category: els.inCategory.value
  };
  
  if (!payload.name || isNaN(payload.cost) || !payload.date) {
    showToast('Please fill all required fields correctly', 'error');
    return;
  }
  
  if (editingId) {
    // Update existing
    subscriptions = subscriptions.map(sub => 
      sub.id === editingId ? { ...sub, ...payload } : sub
    );
    showToast('Subscription updated successfully', 'success');
  } else {
    // Create new
    subscriptions.push({ id: generateId(), ...payload });
    showToast('Subscription added successfully', 'success');
  }
  
  saveData();
  renderAll();
  closeModal();
}

// Global functions for inline HTML event handlers
window.editSub = (id) => openModal(id);
window.deleteSub = (id) => {
  if (confirm('Are you sure you want to delete this subscription?')) {
    subscriptions = subscriptions.filter(sub => sub.id !== id);
    saveData();
    renderAll();
    showToast('Subscription deleted', 'info');
  }
};

// ============================================================================
// UI Utilities
// ============================================================================

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let icon = 'ph-info';
  if (type === 'success') icon = 'ph-check-circle';
  if (type === 'error') icon = 'ph-warning-circle';
  
  toast.innerHTML = `<i class="ph ${icon}"></i> ${message}`;
  els.toastContainer.appendChild(toast);
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Start app
document.addEventListener('DOMContentLoaded', init);
