/* ============================================================
   SUBSCRIPTION TRACKER — Complete JS
   ============================================================ */
'use strict';

// ── Constants ──────────────────────────────────────────────────
const STORAGE_KEY  = 'subtracker_subs';
const SETTINGS_KEY = 'subtracker_settings';
const ITEMS_PER_PAGE = 8;

const CATEGORY_COLORS = {
  Entertainment: '#f97316',
  Productivity:  '#6366f1',
  Health:        '#ef4444',
  Education:     '#8b5cf6',
  Music:         '#ec4899',
  Cloud:         '#38bdf8',
  Gaming:        '#22c55e',
  News:          '#f59e0b',
  Finance:       '#10b981',
  Other:         '#94a3b8'
};

const CATEGORY_EMOJI = {
  Entertainment: '🎬',
  Productivity:  '💼',
  Health:        '❤️',
  Education:     '📚',
  Music:         '🎵',
  Cloud:         '☁️',
  Gaming:        '🎮',
  News:          '📰',
  Finance:       '💰',
  Other:         '📦'
};

// ── State ──────────────────────────────────────────────────────
let subs        = [];
let settings    = { theme: 'dark' };
let filter      = 'all';
let categoryFilter = 'all';
let searchQuery = '';
let sortMode    = 'newest';
let currentPage = 1;
let editingId   = null;
let currentModalId = null;

// ── DOM ────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

// ── Init ───────────────────────────────────────────────────────
function init() {
  loadData();
  applyTheme();
  setDefaultDate();
  renderAll();
  bindEvents();
}

// ── Storage ────────────────────────────────────────────────────
function loadData() {
  try {
    subs     = JSON.parse(localStorage.getItem(STORAGE_KEY)  || '[]');
    settings = { theme: 'dark', ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') };
  } catch(e) { subs = []; }
}
function saveSubs()     { localStorage.setItem(STORAGE_KEY,  JSON.stringify(subs)); }
function saveSettings() { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); }

// ── Theme ──────────────────────────────────────────────────────
function applyTheme() {
  document.documentElement.setAttribute('data-theme', settings.theme);
  const icon = $('themeToggle').querySelector('i');
  icon.className = settings.theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}
function toggleTheme() {
  settings.theme = settings.theme === 'dark' ? 'light' : 'dark';
  applyTheme(); saveSettings();
}

// ── Default Date ───────────────────────────────────────────────
function setDefaultDate() {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  $('subRenewal').value = d.toISOString().split('T')[0];
}

// ── Bind Events ────────────────────────────────────────────────
function bindEvents() {
  $('themeToggle').addEventListener('click', toggleTheme);
  $('exportBtn').addEventListener('click', exportCSV);
  $('resetBtn').addEventListener('click', resetAll);
  $('subForm').addEventListener('submit', handleSubmit);
  $('cancelEdit').addEventListener('click', cancelEdit);

  $('searchInput').addEventListener('input', () => {
    searchQuery = $('searchInput').value.trim().toLowerCase();
    $('clearSearch').classList.toggle('visible', searchQuery.length > 0);
    currentPage = 1; renderSubList();
  });
  $('clearSearch').addEventListener('click', () => {
    $('searchInput').value = ''; searchQuery = '';
    $('clearSearch').classList.remove('visible');
    currentPage = 1; renderSubList();
  });

  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      filter = chip.dataset.filter;
      currentPage = 1; renderSubList();
    });
  });

  $('sortSelect').addEventListener('change', () => {
    sortMode = $('sortSelect').value;
    currentPage = 1; renderSubList();
  });

  $('categoryFilter').addEventListener('change', () => {
    categoryFilter = $('categoryFilter').value;
    currentPage = 1; renderSubList();
  });

  $('modalClose').addEventListener('click', closeModal);
  $('modalOverlay').addEventListener('click', e => { if(e.target === $('modalOverlay')) closeModal(); });
  $('modalEdit').addEventListener('click', startEdit);
  $('modalDelete').addEventListener('click', deleteFromModal);
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });
}

// ── Form Submit ────────────────────────────────────────────────
function handleSubmit(e) {
  e.preventDefault();
  const name    = $('subName').value.trim();
  const cost    = parseFloat($('subCost').value);
  const cycle   = $('subCycle').value;
  const category= $('subCategory').value;
  const status  = $('subStatus').value;
  const renewal = $('subRenewal').value;
  const notes   = $('subNotes').value.trim();

  if(!name || isNaN(cost)) { showToast('Please fill required fields.', 'error'); return; }

  const sub = {
    id: editingId || genId(),
    name, cost, cycle, category, status, renewal, notes,
    createdAt: editingId
      ? (subs.find(s => s.id === editingId)?.createdAt || new Date().toISOString())
      : new Date().toISOString()
  };

  if(editingId) {
    const idx = subs.findIndex(s => s.id === editingId);
    if(idx !== -1) subs[idx] = sub;
    cancelEdit();
    showToast('Subscription updated!', 'success');
  } else {
    subs.unshift(sub);
    showToast('Subscription added!', 'success');
  }

  saveSubs();
  $('subForm').reset();
  setDefaultDate();
  renderAll();
}

function cancelEdit() {
  editingId = null;
  $('subForm').reset();
  setDefaultDate();
  $('formTitle').textContent = 'Add Subscription';
  $('submitBtn').innerHTML = '<i class="fas fa-plus"></i> Add Subscription';
  $('submitBtn').classList.remove('editing');
  $('cancelEdit').classList.add('hidden');
  $('formCard').style.borderColor = '';
}

// ── Render All ─────────────────────────────────────────────────
function renderAll() {
  renderStats();
  renderSubList();
  renderCategoryChart();
  checkRenewals();
}

// ── Stats ──────────────────────────────────────────────────────
function renderStats() {
  const active = subs.filter(s => s.status === 'active');
  let monthly = 0;

  active.forEach(s => {
    const c = parseFloat(s.cost) || 0;
    if(s.cycle === 'monthly') monthly += c;
    else if(s.cycle === 'yearly') monthly += c / 12;
    else if(s.cycle === 'weekly') monthly += c * 4.33;
  });

  $('totalMonthly').textContent = `$${monthly.toFixed(2)}`;
  $('totalYearly').textContent  = `$${(monthly * 12).toFixed(2)}`;
  $('totalActive').textContent  = active.length;

  const now  = new Date();
  const week = new Date(now.getTime() + 7 * 86400000);
  const upcoming = subs.filter(s => {
    if(s.status !== 'active') return false;
    const d = new Date(s.renewal);
    return d >= now && d <= week;
  }).length;
  $('totalUpcoming').textContent = upcoming;
}

// ── Renewal Alerts ─────────────────────────────────────────────
function checkRenewals() {
  const now  = new Date();
  const week = new Date(now.getTime() + 7 * 86400000);
  const upcoming = subs.filter(s => {
    if(s.status !== 'active') return false;
    const d = new Date(s.renewal);
    return d >= now && d <= week;
  });

  const alert = $('renewalAlert');
  if(upcoming.length === 0) { alert.style.display = 'none'; return; }

  alert.style.display = 'flex';
  const names = upcoming.map(s => s.name).join(', ');
  $('renewalAlertText').textContent =
    `${upcoming.length} subscription${upcoming.length > 1 ? 's' : ''} renewing this week: ${names}`;
}

// ── Category Chart ─────────────────────────────────────────────
function renderCategoryChart() {
  const chart = $('categoryChart');
  chart.innerHTML = '';
  const active = subs.filter(s => s.status === 'active');

  if(active.length === 0) {
    chart.innerHTML = '<p class="cat-empty">No active subscriptions.</p>';
    return;
  }

  const totals = {};
  active.forEach(s => {
    const cost = toMonthly(s);
    totals[s.category] = (totals[s.category] || 0) + cost;
  });

  const sorted = Object.entries(totals).sort((a,b) => b[1] - a[1]);
  const max    = sorted[0]?.[1] || 1;

  sorted.forEach(([cat, amount]) => {
    const pct   = (amount / max) * 100;
    const color = CATEGORY_COLORS[cat] || '#94a3b8';
    const row   = document.createElement('div');
    row.className = 'cat-row';
    row.innerHTML = `
      <div class="cat-dot" style="background:${color}"></div>
      <span class="cat-name" title="${cat}">${cat}</span>
      <div class="cat-bar-wrap">
        <div class="cat-bar-fill" style="width:0%;background:${color}" data-pct="${pct}"></div>
      </div>
      <span class="cat-amount">$${amount.toFixed(0)}/mo</span>
    `;
    chart.appendChild(row);
  });

  requestAnimationFrame(() => {
    chart.querySelectorAll('.cat-bar-fill').forEach(bar => {
      setTimeout(() => { bar.style.width = bar.dataset.pct + '%'; }, 80);
    });
  });
}

// ── Sub List ───────────────────────────────────────────────────
function getFiltered() {
  let list = [...subs];

  if(searchQuery) {
    list = list.filter(s =>
      s.name.toLowerCase().includes(searchQuery) ||
      s.category.toLowerCase().includes(searchQuery) ||
      (s.notes || '').toLowerCase().includes(searchQuery)
    );
  }
  if(filter !== 'all')         list = list.filter(s => s.status === filter);
  if(categoryFilter !== 'all') list = list.filter(s => s.category === categoryFilter);

  if(sortMode === 'newest')    list.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  if(sortMode === 'oldest')    list.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
  if(sortMode === 'name')      list.sort((a,b) => a.name.localeCompare(b.name));
  if(sortMode === 'cost-high') list.sort((a,b) => toMonthly(b) - toMonthly(a));
  if(sortMode === 'cost-low')  list.sort((a,b) => toMonthly(a) - toMonthly(b));
  if(sortMode === 'renewal')   list.sort((a,b) => new Date(a.renewal) - new Date(b.renewal));

  return list;
}

function renderSubList() {
  const list  = getFiltered();
  const total = Math.ceil(list.length / ITEMS_PER_PAGE);
  if(currentPage > total) currentPage = 1;

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const page  = list.slice(start, start + ITEMS_PER_PAGE);

  const subList = $('subList');
  subList.querySelectorAll('.sub-item').forEach(i => i.remove());

  if(list.length === 0) {
    $('emptyState').style.display = 'block';
    $('pagination').innerHTML = '';
    return;
  }
  $('emptyState').style.display = 'none';

  page.forEach((s, i) => {
    const el = buildSubItem(s);
    el.style.animationDelay = `${i * 40}ms`;
    subList.appendChild(el);
  });

  renderPagination(total);
}

function buildSubItem(s) {
  const el    = document.createElement('div');
  el.className = 'sub-item';
  el.dataset.id = s.id;

  const color   = CATEGORY_COLORS[s.category] || '#94a3b8';
  const emoji   = CATEGORY_EMOJI[s.category]  || '📦';
  const renewal = new Date(s.renewal);
  const now     = new Date();
  const daysLeft = Math.ceil((renewal - now) / 86400000);
  const soon    = daysLeft >= 0 && daysLeft <= 7;
  const renewalStr = renewal.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });

  el.style.setProperty('--item-color', color);
  el.style.cssText += `--item-color:${color}`;
  el.querySelector
    ? null : null;
  el.style.borderLeftColor = color;

  el.innerHTML = `
    <div class="sub-emoji">${emoji}</div>
    <div class="sub-info">
      <div class="sub-name">${escapeHTML(s.name)}</div>
      <div class="sub-meta">
        <span class="sub-category" style="background:${color}22;color:${color}">${s.category}</span>
        <span class="sub-cycle">${cap(s.cycle)}</span>
        <span class="sub-renewal ${soon ? 'renewal-soon' : ''}">
          <i class="fas fa-calendar-alt"></i>
          ${soon ? `⚠️ ${daysLeft === 0 ? 'Today' : `${daysLeft}d`}` : renewalStr}
        </span>
      </div>
    </div>
    <div class="sub-right">
      <span class="sub-cost">${formatCost(s)}</span>
      <span class="sub-status-badge status-${s.status}">${cap(s.status)}</span>
    </div>
  `;

  el.style.borderLeft = `3px solid ${color}`;
  el.addEventListener('click', () => openModal(s.id));
  return el;
}

// ── Pagination ─────────────────────────────────────────────────
function renderPagination(total) {
  const p = $('pagination');
  p.innerHTML = '';
  if(total <= 1) return;

  const prev = document.createElement('button');
  prev.className = 'page-btn';
  prev.innerHTML = '<i class="fas fa-chevron-left"></i>';
  prev.disabled  = currentPage === 1;
  prev.addEventListener('click', () => { currentPage--; renderSubList(); });
  p.appendChild(prev);

  for(let i = 1; i <= total; i++) {
    const btn = document.createElement('button');
    btn.className = `page-btn${i === currentPage ? ' active' : ''}`;
    btn.textContent = i;
    btn.addEventListener('click', () => { currentPage = i; renderSubList(); });
    p.appendChild(btn);
  }

  const next = document.createElement('button');
  next.className = 'page-btn';
  next.innerHTML = '<i class="fas fa-chevron-right"></i>';
  next.disabled  = currentPage === total;
  next.addEventListener('click', () => { currentPage++; renderSubList(); });
  p.appendChild(next);
}

// ── Modal ──────────────────────────────────────────────────────
function openModal(id) {
  const s = subs.find(s => s.id === id);
  if(!s) return;
  currentModalId = id;

  const color   = CATEGORY_COLORS[s.category] || '#94a3b8';
  const emoji   = CATEGORY_EMOJI[s.category]  || '📦';
  const renewal = new Date(s.renewal).toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' });
  const yearly  = toYearly(s);

  $('modalEmoji').textContent    = emoji;
  $('modalName').textContent     = s.name;
  $('modalStatus').textContent   = cap(s.status);
  $('modalStatus').className     = `modal-badge status-${s.status}`;
  $('modalCost').textContent     = formatCost(s);
  $('modalCycle').textContent    = cap(s.cycle);
  $('modalRenewal').textContent  = renewal;
  $('modalCategory').textContent = s.category;
  $('modalYearly').textContent   = `$${yearly.toFixed(2)}/yr`;

  const notesWrap = $('modalNotesWrap');
  if(s.notes) {
    notesWrap.style.display = 'flex';
    $('modalNotes').textContent = s.notes;
  } else {
    notesWrap.style.display = 'none';
  }

  $('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  $('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
  currentModalId = null;
}

function startEdit() {
  const s = subs.find(s => s.id === currentModalId);
  if(!s) return;
  closeModal();
  editingId = s.id;

  $('subName').value     = s.name;
  $('subCost').value     = s.cost;
  $('subCycle').value    = s.cycle;
  $('subCategory').value = s.category;
  $('subStatus').value   = s.status;
  $('subRenewal').value  = s.renewal;
  $('subNotes').value    = s.notes || '';

  $('formTitle').textContent = 'Edit Subscription';
  $('submitBtn').innerHTML   = '<i class="fas fa-check"></i> Update Subscription';
  $('submitBtn').classList.add('editing');
  $('cancelEdit').classList.remove('hidden');
  $('formCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function deleteFromModal() {
  const s = subs.find(s => s.id === currentModalId);
  if(!s) return;
  if(!confirm(`Delete "${s.name}"? This cannot be undone.`)) return;
  subs = subs.filter(s => s.id !== currentModalId);
  saveSubs(); closeModal(); renderAll();
  showToast('Subscription deleted.', 'error');
}

// ── Export CSV ─────────────────────────────────────────────────
function exportCSV() {
  if(subs.length === 0) { showToast('No data to export!', 'error'); return; }
  const headers = ['Name','Cost','Cycle','Category','Status','Renewal Date','Monthly Cost','Notes'];
  const rows = subs.map(s => [
    `"${s.name.replace(/"/g,'""')}"`,
    s.cost, s.cycle, s.category, s.status, s.renewal,
    toMonthly(s).toFixed(2),
    `"${(s.notes||'').replace(/"/g,'""')}"`
  ]);
  const csv  = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = `subscriptions-${new Date().toISOString().slice(0,10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
  showToast('Exported as CSV!', 'success');
}

// ── Reset ──────────────────────────────────────────────────────
function resetAll() {
  if(!confirm('Reset ALL subscription data? This cannot be undone!')) return;
  subs = []; saveSubs(); renderAll();
  showToast('All data reset.', 'error');
}

// ── Toast ──────────────────────────────────────────────────────
let toastTimer;
function showToast(msg, type = 'success') {
  clearTimeout(toastTimer);
  $('toastMsg').textContent = msg;
  const icon = $('toast').querySelector('.toast-icon');
  icon.className = `toast-icon fas ${
    type === 'success' ? 'fa-check-circle' :
    type === 'error'   ? 'fa-times-circle' : 'fa-info-circle'
  }`;
  const t = $('toast');
  t.className = `toast ${type} show`;
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

// ── Helpers ────────────────────────────────────────────────────
function toMonthly(s) {
  const c = parseFloat(s.cost) || 0;
  if(s.cycle === 'monthly') return c;
  if(s.cycle === 'yearly')  return c / 12;
  if(s.cycle === 'weekly')  return c * 4.33;
  return c;
}
function toYearly(s) {
  const c = parseFloat(s.cost) || 0;
  if(s.cycle === 'monthly') return c * 12;
  if(s.cycle === 'yearly')  return c;
  if(s.cycle === 'weekly')  return c * 52;
  return c;
}
function formatCost(s) {
  const suffix = s.cycle === 'monthly' ? '/mo' : s.cycle === 'yearly' ? '/yr' : '/wk';
  return `$${parseFloat(s.cost).toFixed(2)}${suffix}`;
}
function genId()       { return '_' + Math.random().toString(36).slice(2,11); }
function cap(str)      { return str.charAt(0).toUpperCase() + str.slice(1); }
function escapeHTML(s) {
  const el = document.createElement('div');
  el.textContent = s || ''; return el.innerHTML;
}

// ── Start ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);