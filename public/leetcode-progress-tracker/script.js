/* ============================================================
   LEETCODE PROGRESS TRACKER — Complete JS
   ============================================================ */

'use strict';

// ── Constants ─────────────────────────────────────────────────
const STORAGE_KEY   = 'lc_tracker_problems';
const SETTINGS_KEY  = 'lc_tracker_settings';
const ITEMS_PER_PAGE = 8;
const TOTAL_PROBLEMS = { easy: 840, medium: 1757, hard: 767 }; // approx LeetCode counts

// ── State ──────────────────────────────────────────────────────
let problems   = [];
let settings   = { goals: { easy: 0, medium: 0, hard: 0 }, theme: 'dark', streak: 0, lastDate: null };
let filter     = 'all';
let searchQuery = '';
let sortMode   = 'newest';
let currentPage = 1;
let editingId  = null;
let currentModalId = null;

// ── DOM Refs ───────────────────────────────────────────────────
const $ = id => document.getElementById(id);

const problemForm   = $('problemForm');
const problemName   = $('problemName');
const difficulty    = $('difficulty');
const topic         = $('topic');
const timeTaken     = $('timeTaken');
const attempts      = $('attempts');
const problemLink   = $('problemLink');
const notes         = $('notes');
const needsReview   = $('needsReview');
const isStarred     = $('isStarred');
const submitBtn     = $('submitBtn');
const searchInput   = $('searchInput');
const clearSearch   = $('clearSearch');
const sortSelect    = $('sortSelect');
const problemList   = $('problemList');
const emptyState    = $('emptyState');
const pagination    = $('pagination');
const themeToggle   = $('themeToggle');
const exportBtn     = $('exportBtn');
const resetBtn      = $('resetBtn');
const toast         = $('toast');
const toastMsg      = $('toastMsg');
const modalOverlay  = $('modalOverlay');
const modalClose    = $('modalClose');
const modalEdit     = $('modalEdit');
const modalDelete   = $('modalDelete');
const confettiCanvas = $('confettiCanvas');

// ── Init ───────────────────────────────────────────────────────
function init() {
  loadData();
  applyTheme();
  updateStreak();
  renderAll();
  buildHeatmap();
  bindEvents();
  $('heatmapYear').textContent = new Date().getFullYear();
}

// ── Storage ────────────────────────────────────────────────────
function loadData() {
  try {
    problems = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    settings = {
      goals: { easy: 0, medium: 0, hard: 0 },
      theme: 'dark',
      streak: 0,
      lastDate: null,
      ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}')
    };
    // restore goal inputs
    $('easyGoal').value   = settings.goals.easy;
    $('mediumGoal').value = settings.goals.medium;
    $('hardGoal').value   = settings.goals.hard;
  } catch(e) {
    problems = []; settings = { goals: { easy:0, medium:0, hard:0 }, theme:'dark', streak:0, lastDate:null };
  }
}

function saveProblems() { localStorage.setItem(STORAGE_KEY, JSON.stringify(problems)); }
function saveSettings() { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); }

// ── Streak ─────────────────────────────────────────────────────
function updateStreak() {
  const today = new Date().toDateString();
  if (!settings.lastDate) {
    // first time
  } else if (settings.lastDate === today) {
    // same day, no change
  } else {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (settings.lastDate === yesterday) {
      // streak continues — will increment on new problem
    } else {
      settings.streak = 0; // streak broken
    }
  }
  $('streakCount').textContent = settings.streak;
  const flame = $('streakFlame');
  flame.style.opacity = settings.streak > 0 ? '0.6' : '0.15';
}

function incrementStreakIfNeeded() {
  const today = new Date().toDateString();
  if (settings.lastDate !== today) {
    settings.streak += 1;
    settings.lastDate = today;
    saveSettings();
    $('streakCount').textContent = settings.streak;
    $('streakFlame').style.opacity = '0.6';
  }
}

// ── Theme ──────────────────────────────────────────────────────
function applyTheme() {
  document.documentElement.setAttribute('data-theme', settings.theme);
  const icon = themeToggle.querySelector('i');
  icon.className = settings.theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

function toggleTheme() {
  settings.theme = settings.theme === 'dark' ? 'light' : 'dark';
  applyTheme();
  saveSettings();
}

// ── Bind Events ────────────────────────────────────────────────
function bindEvents() {
  problemForm.addEventListener('submit', handleFormSubmit);
  themeToggle.addEventListener('click', toggleTheme);
  exportBtn.addEventListener('click', exportData);
  resetBtn.addEventListener('click', resetData);

  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value.trim().toLowerCase();
    clearSearch.classList.toggle('visible', searchQuery.length > 0);
    currentPage = 1;
    renderProblemList();
  });
  clearSearch.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    clearSearch.classList.remove('visible');
    currentPage = 1;
    renderProblemList();
  });

  sortSelect.addEventListener('change', () => {
    sortMode = sortSelect.value;
    currentPage = 1;
    renderProblemList();
  });

  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      filter = chip.dataset.filter;
      currentPage = 1;
      renderProblemList();
    });
  });

  document.querySelectorAll('.goal-save').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;
      const val  = parseInt(document.getElementById(`${type}Goal`).value) || 0;
      settings.goals[type] = val;
      saveSettings();
      renderStats();
      showToast(`${cap(type)} goal set to ${val}!`, 'info');
    });
  });

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', e => { if(e.target === modalOverlay) closeModal(); });
  modalEdit.addEventListener('click', startEdit);
  modalDelete.addEventListener('click', deleteFromModal);

  document.addEventListener('keydown', e => {
    if(e.key === 'Escape') closeModal();
  });
}

// ── Form Submit ────────────────────────────────────────────────
function handleFormSubmit(e) {
  e.preventDefault();
  const name = problemName.value.trim();
  if(!name) { showToast('Please enter a problem name.', 'error'); return; }

  const problem = {
    id:        editingId || generateId(),
    name,
    difficulty: difficulty.value,
    topic:      topic.value,
    timeTaken:  parseInt(timeTaken.value) || 0,
    attempts:   parseInt(attempts.value)  || 1,
    link:       problemLink.value.trim(),
    notes:      notes.value.trim(),
    needsReview:needsReview.checked,
    starred:    isStarred.checked,
    date:       editingId ? (problems.find(p=>p.id===editingId)?.date || new Date().toISOString()) : new Date().toISOString()
  };

  if(editingId) {
    const idx = problems.findIndex(p => p.id === editingId);
    if(idx !== -1) problems[idx] = problem;
    editingId = null;
    submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Problem';
    submitBtn.classList.remove('editing');
    document.querySelector('.form-card').classList.remove('editing-mode');
    showToast('Problem updated!', 'success');
  } else {
    problems.unshift(problem);
    incrementStreakIfNeeded();
    showToast('Problem added! 🎉', 'success');
    if(problem.difficulty === 'hard') launchConfetti();
  }

  saveProblems();
  problemForm.reset();
  renderAll();
  buildHeatmap();
}

// ── Render All ─────────────────────────────────────────────────
function renderAll() {
  renderStats();
  renderProblemList();
  renderTopicChart();
}

// ── Stats ──────────────────────────────────────────────────────
function renderStats() {
  const easy   = problems.filter(p => p.difficulty === 'easy').length;
  const medium = problems.filter(p => p.difficulty === 'medium').length;
  const hard   = problems.filter(p => p.difficulty === 'hard').length;
  const total  = easy + medium + hard;

  animateNumber($('easySolved'),   easy);
  animateNumber($('mediumSolved'), medium);
  animateNumber($('hardSolved'),   hard);
  animateNumber($('totalSolved'),  total);

  // Goals
  const { goals } = settings;
  $('easyGoalDisplay').textContent   = `/ ${goals.easy} goal`;
  $('mediumGoalDisplay').textContent = `/ ${goals.medium} goal`;
  $('hardGoalDisplay').textContent   = `/ ${goals.hard} goal`;

  // Rings (vs total LC problems)
  setRing('easyRing',   'easyPct',   easy,   TOTAL_PROBLEMS.easy);
  setRing('mediumRing', 'mediumPct', medium, TOTAL_PROBLEMS.medium);
  setRing('hardRing',   'hardPct',   hard,   TOTAL_PROBLEMS.hard);
  setRing('totalRing',  'totalPct',  total,  TOTAL_PROBLEMS.easy + TOTAL_PROBLEMS.medium + TOTAL_PROBLEMS.hard);

  // Goal bars
  setBar('easyBar',   easy,   goals.easy);
  setBar('mediumBar', medium, goals.medium);
  setBar('hardBar',   hard,   goals.hard);

  // Acceptance rate (simulated as solved / (solved + attempts-1) approx)
  const totalAttempts = problems.reduce((s,p) => s + (p.attempts || 1), 0);
  const accRate = totalAttempts > 0 ? Math.round((total / totalAttempts) * 100) : 0;
  $('acceptanceRate').textContent = accRate + '%';

  // Avg time
  const timed = problems.filter(p => p.timeTaken > 0);
  const avgT  = timed.length > 0 ? Math.round(timed.reduce((s,p) => s+p.timeTaken, 0) / timed.length) : 0;
  $('avgTime').textContent = avgT > 0 ? avgT + ' min' : '—';

  // Rank
  $('userRank').textContent = getRank(total);
}

function setRing(ringId, pctId, val, max) {
  const pct  = Math.min(Math.round((val / max) * 100), 100);
  const dash = (pct / 100) * 100;
  $(ringId).setAttribute('stroke-dasharray', `${dash}, 100`);
  $(pctId).textContent = pct + '%';
}

function setBar(barId, val, goal) {
  const pct = goal > 0 ? Math.min((val / goal) * 100, 100) : 0;
  $(barId).style.width = pct + '%';
}

function getRank(total) {
  if(total === 0)   return '—';
  if(total < 25)    return '🥉 Beginner';
  if(total < 75)    return '🥈 Learner';
  if(total < 150)   return '🥇 Solver';
  if(total < 300)   return '💎 Expert';
  if(total < 500)   return '🚀 Master';
  return '👑 Legend';
}

function animateNumber(el, target) {
  const start = parseInt(el.textContent) || 0;
  if(start === target) return;
  const steps = 20;
  const inc   = (target - start) / steps;
  let cur = start, s = 0;
  const interval = setInterval(() => {
    cur += inc; s++;
    el.textContent = Math.round(cur);
    if(s >= steps) { el.textContent = target; clearInterval(interval); }
  }, 20);
}

// ── Problem List ───────────────────────────────────────────────
function getFilteredSorted() {
  let list = [...problems];

  // Search
  if(searchQuery) {
    list = list.filter(p =>
      p.name.toLowerCase().includes(searchQuery) ||
      p.topic.toLowerCase().includes(searchQuery) ||
      (p.notes || '').toLowerCase().includes(searchQuery)
    );
  }

  // Filter
  if(filter === 'easy')    list = list.filter(p => p.difficulty === 'easy');
  if(filter === 'medium')  list = list.filter(p => p.difficulty === 'medium');
  if(filter === 'hard')    list = list.filter(p => p.difficulty === 'hard');
  if(filter === 'review')  list = list.filter(p => p.needsReview);
  if(filter === 'starred') list = list.filter(p => p.starred);

  // Sort
  if(sortMode === 'oldest')    list.sort((a,b) => new Date(a.date) - new Date(b.date));
  if(sortMode === 'newest')    list.sort((a,b) => new Date(b.date) - new Date(a.date));
  if(sortMode === 'name')      list.sort((a,b) => a.name.localeCompare(b.name));
  if(sortMode === 'difficulty'){
    const order = { easy:0, medium:1, hard:2 };
    list.sort((a,b) => order[a.difficulty] - order[b.difficulty]);
  }
  if(sortMode === 'time') list.sort((a,b) => (b.timeTaken||0) - (a.timeTaken||0));

  return list;
}

function renderProblemList() {
  const list = getFilteredSorted();
  const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE);
  if(currentPage > totalPages) currentPage = 1;

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const page  = list.slice(start, start + ITEMS_PER_PAGE);

  // Clear all except empty state
  const items = problemList.querySelectorAll('.problem-item');
  items.forEach(i => i.remove());

  if(list.length === 0) {
    emptyState.style.display = 'block';
    pagination.innerHTML = '';
    return;
  }
  emptyState.style.display = 'none';

  page.forEach((p, i) => {
    const el = buildProblemItem(p);
    el.style.animationDelay = `${i * 40}ms`;
    problemList.appendChild(el);
  });

  renderPagination(totalPages);
}

function buildProblemItem(p) {
  const el = document.createElement('div');
  el.className = `problem-item ${p.difficulty}`;
  el.dataset.id = p.id;

  const dateStr = new Date(p.date).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });

  el.innerHTML = `
    <div class="problem-diff-badge badge-${p.difficulty}">
      ${p.difficulty === 'easy' ? 'E' : p.difficulty === 'medium' ? 'M' : 'H'}
    </div>
    <div class="problem-info">
      <div class="problem-name">${escapeHTML(p.name)}</div>
      <div class="problem-meta-row">
        <span class="problem-tag">${escapeHTML(p.topic)}</span>
        <span class="problem-date">${dateStr}</span>
        ${p.timeTaken ? `<span class="problem-time"><i class="fas fa-clock"></i>${p.timeTaken} min</span>` : ''}
      </div>
    </div>
    <div class="problem-flags">
      ${p.starred    ? '<span class="flag flag-star" title="Starred">⭐</span>' : ''}
      ${p.needsReview? '<span class="flag flag-review" title="Needs Review">🔄</span>' : ''}
    </div>
  `;

  el.addEventListener('click', () => openModal(p.id));
  return el;
}

// ── Pagination ─────────────────────────────────────────────────
function renderPagination(totalPages) {
  pagination.innerHTML = '';
  if(totalPages <= 1) return;

  const prev = document.createElement('button');
  prev.className = 'page-btn';
  prev.innerHTML = '<i class="fas fa-chevron-left"></i>';
  prev.disabled  = currentPage === 1;
  prev.addEventListener('click', () => { currentPage--; renderProblemList(); });
  pagination.appendChild(prev);

  for(let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.className = `page-btn${i === currentPage ? ' active' : ''}`;
    btn.textContent = i;
    btn.addEventListener('click', () => { currentPage = i; renderProblemList(); });
    pagination.appendChild(btn);
  }

  const next = document.createElement('button');
  next.className = 'page-btn';
  next.innerHTML = '<i class="fas fa-chevron-right"></i>';
  next.disabled  = currentPage === totalPages;
  next.addEventListener('click', () => { currentPage++; renderProblemList(); });
  pagination.appendChild(next);
}

// ── Topic Chart ────────────────────────────────────────────────
function renderTopicChart() {
  const chart = $('topicChart');
  chart.innerHTML = '';

  const counts = {};
  problems.forEach(p => { counts[p.topic] = (counts[p.topic] || 0) + 1; });
  const sorted = Object.entries(counts).sort((a,b) => b[1] - a[1]).slice(0, 10);
  const max    = sorted[0]?.[1] || 1;

  if(sorted.length === 0) {
    chart.innerHTML = '<p style="color:var(--text3);font-size:0.85rem;">No data yet.</p>';
    return;
  }

  sorted.forEach(([name, count]) => {
    const pct = (count / max) * 100;
    const row = document.createElement('div');
    row.className = 'topic-row';
    row.innerHTML = `
      <span class="topic-name" title="${name}">${name}</span>
      <div class="topic-bar-wrap">
        <div class="topic-bar-fill" style="width:0%" data-pct="${pct}"></div>
      </div>
      <span class="topic-count">${count}</span>
    `;
    chart.appendChild(row);
  });

  // Animate bars after render
  requestAnimationFrame(() => {
    chart.querySelectorAll('.topic-bar-fill').forEach(bar => {
      setTimeout(() => { bar.style.width = bar.dataset.pct + '%'; }, 100);
    });
  });
}

// ── Heatmap ────────────────────────────────────────────────────
function buildHeatmap() {
  const grid = $('heatmapGrid');
  grid.innerHTML = '';

  // Count problems per day
  const dayMap = {};
  problems.forEach(p => {
    const d = new Date(p.date).toDateString();
    dayMap[d] = (dayMap[d] || 0) + 1;
  });

  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 364);
  // align to Sunday
  startDate.setDate(startDate.getDate() - startDate.getDay());

  let current = new Date(startDate);
  while(current <= today) {
    const week = document.createElement('div');
    week.className = 'heatmap-week';

    for(let d = 0; d < 7; d++) {
      if(current > today) { current.setDate(current.getDate()+1); continue; }
      const ds    = current.toDateString();
      const count = dayMap[ds] || 0;
      const level = Math.min(count, 5);
      const cell  = document.createElement('div');
      cell.className = 'heatmap-cell';
      cell.setAttribute('data-count', level);
      cell.setAttribute('data-tooltip', `${formatDate(current)}: ${count} problem${count!==1?'s':''}`);
      week.appendChild(cell);
      current.setDate(current.getDate() + 1);
    }
    grid.appendChild(week);
  }
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ── Modal ──────────────────────────────────────────────────────
function openModal(id) {
  const p = problems.find(p => p.id === id);
  if(!p) return;
  currentModalId = id;

  $('modalDifficulty').textContent = cap(p.difficulty);
  $('modalDifficulty').className   = `modal-badge badge-${p.difficulty}-modal`;
  $('modalTitle').textContent      = p.name;
  $('modalTopic').textContent      = '🏷 ' + p.topic;
  $('modalDate').textContent       = '📅 ' + new Date(p.date).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});
  $('modalTime').textContent       = p.timeTaken ? `${p.timeTaken} min` : 'Not recorded';
  $('modalAttempts').textContent   = `${p.attempts || 1} attempt${(p.attempts||1)!==1?'s':''}`;

  const starWrap   = $('modalStarWrap');
  const reviewWrap = $('modalReviewWrap');
  starWrap.classList.toggle('hidden', !p.starred);
  reviewWrap.classList.toggle('hidden', !p.needsReview);

  const notesWrap = $('modalNotesWrap');
  if(p.notes) {
    notesWrap.style.display = 'block';
    $('modalNotes').textContent = p.notes;
  } else {
    notesWrap.style.display = 'none';
  }

  const linkEl = $('modalLink');
  if(p.link) {
    linkEl.href = p.link;
    linkEl.classList.remove('hidden');
  } else {
    linkEl.classList.add('hidden');
  }

  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
  currentModalId = null;
}

function startEdit() {
  const p = problems.find(p => p.id === currentModalId);
  if(!p) return;
  closeModal();
  editingId = p.id;

  // Fill form
  problemName.value  = p.name;
  difficulty.value   = p.difficulty;
  topic.value        = p.topic;
  timeTaken.value    = p.timeTaken || '';
  attempts.value     = p.attempts  || '';
  problemLink.value  = p.link      || '';
  notes.value        = p.notes     || '';
  needsReview.checked = p.needsReview || false;
  isStarred.checked   = p.starred   || false;

  submitBtn.innerHTML = '<i class="fas fa-check"></i> Update Problem';
  submitBtn.classList.add('editing');
  document.querySelector('.form-card').classList.add('editing-mode');

  // Scroll to form
  document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function deleteFromModal() {
  if(!currentModalId) return;
  const p = problems.find(p => p.id === currentModalId);
  if(!p) return;

  if(!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
  problems = problems.filter(p => p.id !== currentModalId);
  saveProblems();
  closeModal();
  renderAll();
  buildHeatmap();
  showToast('Problem deleted.', 'error');
}

// ── Export ─────────────────────────────────────────────────────
function exportData() {
  if(problems.length === 0) { showToast('No data to export!', 'error'); return; }

  // CSV
  const headers = ['Name','Difficulty','Topic','Date','Time(min)','Attempts','Starred','Needs Review','Notes','Link'];
  const rows = problems.map(p => [
    `"${p.name.replace(/"/g,'""')}"`,
    p.difficulty,
    p.topic,
    new Date(p.date).toLocaleDateString(),
    p.timeTaken || '',
    p.attempts  || 1,
    p.starred     ? 'Yes' : 'No',
    p.needsReview ? 'Yes' : 'No',
    `"${(p.notes||'').replace(/"/g,'""')}"`,
    p.link || ''
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `leetcode-progress-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Data exported as CSV!', 'success');
}

// ── Reset ──────────────────────────────────────────────────────
function resetData() {
  if(!confirm('Reset ALL progress? This cannot be undone!')) return;
  problems  = [];
  settings.streak   = 0;
  settings.lastDate = null;
  settings.goals    = { easy: 0, medium: 0, hard: 0 };
  saveProblems();
  saveSettings();
  $('easyGoal').value = $('mediumGoal').value = $('hardGoal').value = 0;
  $('streakCount').textContent = 0;
  renderAll();
  buildHeatmap();
  showToast('All data reset.', 'error');
}

// ── Toast ──────────────────────────────────────────────────────
let toastTimer;
function showToast(msg, type = 'success') {
  clearTimeout(toastTimer);
  toastMsg.textContent = msg;
  const icon = toast.querySelector('.toast-icon');
  icon.className = `toast-icon fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : 'fa-info-circle'}`;
  toast.className = `toast ${type} show`;
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

// ── Confetti ───────────────────────────────────────────────────
function launchConfetti() {
  const canvas = confettiCanvas;
  const ctx    = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = 'block';

  const colors = ['#6366f1','#00b8a3','#ffc01e','#ff375f','#22c55e','#f97316'];
  const pieces = Array.from({length: 120}, () => ({
    x: Math.random() * canvas.width,
    y: -10,
    r: Math.random() * 6 + 3,
    d: Math.random() * 4 + 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    rot: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.2,
    vx: (Math.random() - 0.5) * 4
  }));

  let frame = 0;
  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.r, -p.r/2, p.r*2, p.r);
      ctx.restore();
      p.y   += p.d;
      p.x   += p.vx;
      p.rot += p.spin;
    });
    frame++;
    if(frame < 180) requestAnimationFrame(draw);
    else { canvas.style.display = 'none'; ctx.clearRect(0,0,canvas.width,canvas.height); }
  }
  draw();
}

// ── Helpers ────────────────────────────────────────────────────
function generateId() {
  return '_' + Math.random().toString(36).slice(2,11);
}

function escapeHTML(str) {
  const el = document.createElement('div');
  el.textContent = str || '';
  return el.innerHTML;
}

function cap(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ── Start ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);