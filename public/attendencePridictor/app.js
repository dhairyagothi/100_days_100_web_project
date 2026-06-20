/* ===== Attendance Calculator & Predictor ===== */

const STORAGE_KEYS = {
  theme: 'attendance_theme',
  subjects: 'attendance_subjects',
  history: 'attendance_history',
  form: 'attendance_form',
};

const CIRCUMFERENCE = 2 * Math.PI * 85;

// DOM Elements
const els = {
  themeToggle: document.getElementById('themeToggle'),
  calculatorForm: document.getElementById('calculatorForm'),
  totalClasses: document.getElementById('totalClasses'),
  classesAttended: document.getElementById('classesAttended'),
  minAttendance: document.getElementById('minAttendance'),
  targetAttendance: document.getElementById('targetAttendance'),
  futureMisses: document.getElementById('futureMisses'),
  saveAsSubject: document.getElementById('saveAsSubject'),
  dashboard: document.getElementById('dashboard'),
  currentPercent: document.getElementById('currentPercent'),
  attendanceStatus: document.getElementById('attendanceStatus'),
  meterProgress: document.getElementById('meterProgress'),
  safeBunks: document.getElementById('safeBunks'),
  safeBunksHint: document.getElementById('safeBunksHint'),
  shortageCard: document.getElementById('shortageCard'),
  shortageValue: document.getElementById('shortageValue'),
  shortageHint: document.getElementById('shortageHint'),
  classesNeeded: document.getElementById('classesNeeded'),
  recoveryHint: document.getElementById('recoveryHint'),
  futurePrediction: document.getElementById('futurePrediction'),
  targetCard: document.getElementById('targetCard'),
  targetClasses: document.getElementById('targetClasses'),
  targetHint: document.getElementById('targetHint'),
  subjectsList: document.getElementById('subjectsList'),
  subjectsEmpty: document.getElementById('subjectsEmpty'),
  clearSubjects: document.getElementById('clearSubjects'),
  chartsSection: document.getElementById('chartsSection'),
  subjectModal: document.getElementById('subjectModal'),
  subjectForm: document.getElementById('subjectForm'),
  subjectName: document.getElementById('subjectName'),
  cancelSubject: document.getElementById('cancelSubject'),
};

let overviewChart = null;
let trendChart = null;
let lastResult = null;

let lastHistorySnapshot = null;

/* ===== Core Calculations ===== */

function calcAttendance(attended, total) {
  if (total <= 0) return 0;
  return (attended / total) * 100;
}

function calcSafeBunks(attended, total, minPercent) {
  if (total <= 0 || attended < 0 || minPercent <= 0) return 0;
  // attended / (total + bunks) >= minPercent → max bunks before dropping below minimum
  const maxBunks = Math.floor((attended * 100) / minPercent - total);
  return Math.max(0, maxBunks);
}

function calcClassesNeeded(attended, total, minPercent) {
  if (total <= 0) return 0;
  const current = calcAttendance(attended, total);
  if (current >= minPercent) return 0;

  let needed = 0;
  let a = attended;
  let t = total;
  while (calcAttendance(a, t) < minPercent && needed < 500) {
    needed++;
    a++;
    t++;
  }
  return needed;
}

function calcClassesToTarget(attended, total, targetPercent) {
  if (!targetPercent || total <= 0) return 0;
  const current = calcAttendance(attended, total);
  if (current >= targetPercent) return 0;

  let needed = 0;
  let a = attended;
  let t = total;
  while (calcAttendance(a, t) < targetPercent && needed < 500) {
    needed++;
    a++;
    t++;
  }
  return needed;
}

function predictFutureAttendance(attended, total, futureMisses) {
  const newTotal = total + futureMisses;
  if (newTotal <= 0) return 0;
  return (attended / newTotal) * 100;
}

function getStatus(percent, minPercent) {
  if (percent >= minPercent + 5) return 'safe';
  if (percent >= minPercent) return 'warning';
  return 'danger';
}

function getStatusLabel(status) {
  const labels = { safe: 'Safe', warning: 'At Risk', danger: 'Critical' };
  return labels[status];
}

function calculate(data) {
  const { total, attended, minPercent, targetPercent, futureMisses } = data;
  const currentPercent = calcAttendance(attended, total);
  const safeBunks = calcSafeBunks(attended, total, minPercent);
  const classesNeeded = calcClassesNeeded(attended, total, minPercent);
  const classesToTarget = calcClassesToTarget(attended, total, targetPercent);
  const futurePercent = predictFutureAttendance(attended, total, futureMisses);
  const status = getStatus(currentPercent, minPercent);
  const shortage =
    currentPercent < minPercent ? (minPercent - currentPercent).toFixed(1) : 0;

  return {
    currentPercent,
    safeBunks,
    classesNeeded,
    classesToTarget,
    futurePercent,
    futureMisses,
    status,
    shortage,
    minPercent,
    targetPercent,
    total,
    attended,
  };
}

/* ===== UI Updates ===== */

function updateMeter(percent, status) {
  const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;
  els.meterProgress.style.strokeDashoffset = offset;
  els.meterProgress.className = 'meter__progress';
  if (status === 'warning')
    els.meterProgress.classList.add('meter__progress--warning');
  if (status === 'danger')
    els.meterProgress.classList.add('meter__progress--danger');

  els.currentPercent.textContent = `${percent.toFixed(1)}%`;
  els.attendanceStatus.textContent = getStatusLabel(status);
  els.attendanceStatus.className = `meter__status meter__status--${status}`;
}

function renderResults(result) {
  lastResult = result;
  els.dashboard.hidden = false;

  updateMeter(result.currentPercent, result.status);

  els.safeBunks.textContent = `${result.safeBunks} Classes`;
  els.safeBunksHint.textContent =
    result.safeBunks > 0
      ? `You can miss up to ${result.safeBunks} more class${result.safeBunks !== 1 ? 'es' : ''} and stay above ${result.minPercent}%`
      : 'No safe bunks remaining — attend every class!';

  if (result.shortage > 0) {
    els.shortageCard.classList.add('stat-card--danger-border');
    els.shortageValue.textContent = `${result.shortage}% below minimum`;
    els.shortageHint.textContent = `You need ${result.classesNeeded} more attended classes without missing any`;
  } else {
    els.shortageCard.classList.remove('stat-card--danger-border');
    els.shortageValue.textContent = 'None';
    els.shortageHint.textContent = `You're above the ${result.minPercent}% requirement`;
  }

  if (result.classesNeeded > 0) {
    els.classesNeeded.textContent = `${result.classesNeeded} Classes`;
    els.recoveryHint.textContent = `Attend ${result.classesNeeded} more without missing any to reach ${result.minPercent}%`;
  } else {
    els.classesNeeded.textContent = '0 Classes';
    els.recoveryHint.textContent =
      'You meet the minimum attendance requirement';
  }

  if (result.futureMisses > 0) {
    const drop = result.currentPercent - result.futurePercent;
    els.futurePrediction.textContent =
      `If you miss ${result.futureMisses} more class${result.futureMisses !== 1 ? 'es' : ''}, ` +
      `your attendance will drop to ${result.futurePercent.toFixed(1)}%` +
      (drop > 0 ? ` (−${drop.toFixed(1)}%)` : '');
  } else {
    els.futurePrediction.textContent =
      'Enter future misses above to see a prediction';
  }

  if (result.targetPercent && result.targetPercent > 0) {
    els.targetCard.hidden = false;
    if (result.classesToTarget > 0) {
      els.targetClasses.textContent = `${result.classesToTarget} Classes`;
      els.targetHint.textContent = `Attend ${result.classesToTarget} more without missing any to reach ${result.targetPercent}%`;
    } else {
      els.targetClasses.textContent = 'Target Met';
      els.targetHint.textContent = `You've already reached ${result.targetPercent}%`;
    }
  } else {
    els.targetCard.hidden = true;
  }
}

function getFormData() {
  return {
    total: parseInt(els.totalClasses.value, 10) || 0,
    attended: parseInt(els.classesAttended.value, 10) || 0,
    minPercent: parseFloat(els.minAttendance.value) || 75,
    targetPercent: parseFloat(els.targetAttendance.value) || 0,
    futureMisses: parseInt(els.futureMisses.value, 10) || 0,
  };
}

function validateForm(data) {
  if (data.attended > data.total) {
    alert('Classes attended cannot exceed total classes conducted.');
    return false;
  }
  return true;
}

/* ===== LocalStorage ===== */

function saveForm() {
  const data = getFormData();
  localStorage.setItem(STORAGE_KEYS.form, JSON.stringify(data));
}

function loadForm() {
  const saved = localStorage.getItem(STORAGE_KEYS.form);
  if (!saved) return;
  try {
    const data = JSON.parse(saved);
    els.totalClasses.value = data.total ?? '';
    els.classesAttended.value = data.attended ?? '';
    els.minAttendance.value = data.minPercent ?? 75;
    els.targetAttendance.value = data.targetPercent || '';
    els.futureMisses.value = data.futureMisses ?? 0;
  } catch {
    /* ignore corrupt data */
  }
}

function getSubjects() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.subjects)) || [];
  } catch {
    return [];
  }
}

function saveSubjects(subjects) {
  localStorage.setItem(STORAGE_KEYS.subjects, JSON.stringify(subjects));
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.history)) || [];
  } catch {
    return [];
  }
}

function addHistoryEntry(result) {
  const history = getHistory();

  const lastEntry = history[history.length - 1];

  if (
    lastEntry &&
    lastEntry.total === result.total &&
    lastEntry.attended === result.attended &&
    Math.abs(lastEntry.percent - result.currentPercent) < 0.01
  ) {
    return;
  }

  history.push({
    date: new Date().toISOString(),
    percent: result.currentPercent,
    total: result.total,
    attended: result.attended,
  });

  if (history.length > 30) {
    history.shift();
  }

  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
}

function addHistoryEntryIfChanged(result) {
  const history = getHistory();

  const lastEntry = history[history.length - 1];

  if (
    lastEntry &&
    lastEntry.total === result.total &&
    lastEntry.attended === result.attended
  ) {
    return;
  }

  addHistoryEntry(result);
}

/* ===== Subject Management ===== */

function renderSubjects() {
  const subjects = getSubjects();
  els.clearSubjects.hidden = subjects.length === 0;
  els.subjectsEmpty.hidden = subjects.length > 0;

  const existing = els.subjectsList.querySelectorAll('.subject-item');
  existing.forEach((el) => el.remove());

  subjects.forEach((sub, index) => {
    const result = calculate({
      total: sub.total,
      attended: sub.attended,
      minPercent: sub.minPercent,
      targetPercent: sub.targetPercent || 0,
      futureMisses: 0,
    });

    const item = document.createElement('div');
    item.className = 'subject-item';
    item.innerHTML = `
      <div class="subject-item__info">
        <div class="subject-item__name">${escapeHtml(sub.name)}</div>
        <div class="subject-item__meta">${sub.attended}/${sub.total} classes · Min ${sub.minPercent}% · ${result.safeBunks} safe bunks</div>
      </div>
      <span class="subject-item__badge subject-item__badge--${result.status}">${result.currentPercent.toFixed(1)}%</span>
      <div class="subject-item__actions">
        <button class="btn btn--danger" data-action="delete" data-index="${index}" aria-label="Delete ${escapeHtml(sub.name)}">✕</button>
      </div>
    `;

    item.addEventListener('click', (e) => {
      if (e.target.closest('[data-action="delete"]')) return;
      loadSubject(sub);
    });

    item
      .querySelector('[data-action="delete"]')
      .addEventListener('click', (e) => {
        e.stopPropagation();
        deleteSubject(index);
      });

    els.subjectsList.appendChild(item);
  });

  updateCharts();
}

function loadSubject(sub) {
  els.totalClasses.value = sub.total;
  els.classesAttended.value = sub.attended;
  els.minAttendance.value = sub.minPercent;
  els.targetAttendance.value = sub.targetPercent || '';
  els.futureMisses.value = 0;
  handleCalculate();
}

function deleteSubject(index) {
  const subjects = getSubjects();
  subjects.splice(index, 1);
  saveSubjects(subjects);
  renderSubjects();
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ===== Charts ===== */

function getChartColors() {
  const isDark = document.documentElement.dataset.theme === 'dark';
  return {
    text: isDark ? '#94a3b8' : '#64748b',
    grid: isDark ? '#334155' : '#e2e8f0',
    safe: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    primary: isDark ? '#818cf8' : '#4f46e5',
    bg: isDark ? '#1e293b' : '#ffffff',
  };
}

function updateCharts() {
  const subjects = getSubjects();
  const history = getHistory();

  if (subjects.length === 0 && history.length === 0) {
    els.chartsSection.hidden = true;
    return;
  }

  els.chartsSection.hidden = false;
  const colors = getChartColors();

  if (subjects.length > 0) {
    renderOverviewChart(subjects, colors);
  }

  if (history.length > 1 || subjects.length > 0) {
    renderTrendChart(subjects, history, colors);
  }
}

function renderOverviewChart(subjects, colors) {
  const ctx = document.getElementById('overviewChart').getContext('2d');
  const labels = subjects.map((s) => s.name);
  const data = subjects.map((s) => calcAttendance(s.attended, s.total));
  const bgColors = data.map((p, i) => {
    const status = getStatus(p, subjects[i].minPercent);
    return status === 'safe'
      ? colors.safe
      : status === 'warning'
        ? colors.warning
        : colors.danger;
  });

  if (overviewChart) overviewChart.destroy();

  overviewChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Attendance %',
          data,
          backgroundColor: bgColors,
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.parsed.y.toFixed(1)}%`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: { color: colors.text, callback: (v) => `${v}%` },
          grid: { color: colors.grid },
        },
        x: {
          ticks: { color: colors.text },
          grid: { display: false },
        },
      },
    },
  });
}

function renderTrendChart(subjects, history, colors) {
  const ctx = document.getElementById('trendChart').getContext('2d');

  if (trendChart) trendChart.destroy();

  if (subjects.length > 1) {
    const labels = subjects.map((s) => s.name);
    const attended = subjects.map((s) => s.attended);
    const missed = subjects.map((s) => s.total - s.attended);

    trendChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Attended',
            data: attended,
            borderColor: colors.safe,
            backgroundColor: colors.safe + '33',
            fill: true,
            tension: 0.3,
          },
          {
            label: 'Missed',
            data: missed,
            borderColor: colors.danger,
            backgroundColor: colors.danger + '33',
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: chartLineOptions(colors),
    });
  } else if (history.length > 1) {
    const labels = history.map((h) => {
      const d = new Date(h.date);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    });
    const data = history.map((h) => h.percent);

    trendChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Attendance %',
            data,
            borderColor: colors.primary,
            backgroundColor: colors.primary + '33',
            fill: true,
            tension: 0.3,
            pointRadius: 4,
          },
        ],
      },
      options: chartLineOptions(colors, true),
    });
  }
}

function chartLineOptions(colors, isPercent = false) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: colors.text },
      },
    },
    scales: {
      y: {
        beginAtZero: !isPercent,
        max: isPercent ? 100 : undefined,
        ticks: {
          color: colors.text,
          callback: isPercent ? (v) => `${v}%` : undefined,
        },
        grid: { color: colors.grid },
      },
      x: {
        ticks: { color: colors.text },
        grid: { color: colors.grid },
      },
    },
  };
}

/* ===== Theme ===== */

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(STORAGE_KEYS.theme, theme);
  if (lastResult || getSubjects().length > 0) updateCharts();
}

function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEYS.theme);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(saved || (prefersDark ? 'dark' : 'light'));
}

/* ===== Event Handlers ===== */

function handleCalculate(e, saveHistory = true) {
  if (e) e.preventDefault();

  const data = getFormData();

  if (!validateForm(data)) return;

  const result = calculate(data);

  renderResults(result);

  addHistoryEntryIfChanged(result);

  saveForm();

  updateCharts();
}

function handleSaveSubject() {
  const data = getFormData();
  if (!validateForm(data)) return;
  els.subjectName.value = '';
  els.subjectModal.showModal();
}

function handleSubjectSubmit(e) {
  e.preventDefault();
  const name = els.subjectName.value.trim();
  if (!name) return;

  const data = getFormData();
  const subjects = getSubjects();

  const existing = subjects.findIndex(
    (s) => s.name.toLowerCase() === name.toLowerCase()
  );
  const entry = {
    name,
    total: data.total,
    attended: data.attended,
    minPercent: data.minPercent,
    targetPercent: data.targetPercent,
    savedAt: new Date().toISOString(),
  };

  if (existing >= 0) {
    subjects[existing] = entry;
  } else {
    subjects.push(entry);
  }

  saveSubjects(subjects);
  renderSubjects();
  els.subjectModal.close();
}

function handleClearSubjects() {
  if (confirm('Remove all saved subjects?')) {
    localStorage.removeItem(STORAGE_KEYS.subjects);
    renderSubjects();
  }
}

/* ===== Init ===== */

function init() {
  initTheme();
  loadForm();
  renderSubjects();

  els.themeToggle.addEventListener('click', () => {
    const current = document.documentElement.dataset.theme;
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  els.calculatorForm.addEventListener('submit', handleCalculate);
  els.saveAsSubject.addEventListener('click', handleSaveSubject);
  els.subjectForm.addEventListener('submit', handleSubjectSubmit);
  els.cancelSubject.addEventListener('click', () => els.subjectModal.close());
  els.clearSubjects.addEventListener('click', handleClearSubjects);

  [
    'totalClasses',
    'classesAttended',
    'minAttendance',
    'targetAttendance',
    'futureMisses',
  ].forEach((id) => {
    document.getElementById(id).addEventListener('input', () => {
      if (lastResult) {
        handleCalculate(null, false);
      }
    });
  });

  if (els.totalClasses.value && els.classesAttended.value) {
    handleCalculate();
  }
}

document.addEventListener('DOMContentLoaded', init);
