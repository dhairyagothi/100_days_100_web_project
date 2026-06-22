/* ===== CGPA Goal Planner — Core Logic ===== */

const STORAGE_KEYS = {
  theme: 'cgpa-planner-theme',
  plans: 'cgpa-planner-saved-plans',
};

const feasibility = getFeasibility(
    requiredSgpa,
    currentCgpa,
    targetCgpa
);

let currentPlan = null;
let cgpaChart = null;
let courseGrades = [];

// ===== DOM Elements =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const form = $('#plannerForm');
const themeToggle = $('#themeToggle');
const savePlanBtn = $('#savePlanBtn');
const saveModal = $('#saveModal');
const saveModalForm = $('#saveModalForm');

// ===== Theme =====
function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEYS.theme) || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(STORAGE_KEYS.theme, next);
  updateThemeIcon(next);
  if (currentPlan && cgpaChart) renderChart(currentPlan);
}

function updateThemeIcon(theme) {
  $('.theme-icon').textContent = theme === 'dark' ? '🌙' : '☀️';
}

if (targetCgpa < currentCgpa) {
    showError("Target CGPA cannot be less than current CGPA");
    return false;
}

if (gapToClose === 0) {
    badge.textContent =
        "On Track — Maintain your current performance!";

    badge.classList.remove(
        "danger",
        "warning"
    );

    badge.classList.add("success");
}
// ===== Validation =====
function validateForm(data) {
  const errors = [];

  if (data.currentCgpa < 0 || data.currentCgpa > 10) {
    errors.push({ field: 'currentCgpa', msg: 'CGPA must be between 0 and 10' });
  }
  if (data.targetCgpa < 0 || data.targetCgpa > 10) {
    errors.push({ field: 'targetCgpa', msg: 'Target CGPA must be between 0 and 10' });
  }
  if (data.completedSemesters < 1) {
    errors.push({ field: 'completedSemesters', msg: 'At least 1 completed semester required' });
  }
  if (data.remainingSemesters < 1) {
    errors.push({ field: 'remainingSemesters', msg: 'At least 1 remaining semester required' });
  }
  if (data.targetCgpa < data.currentCgpa) {
    errors.push({ field: 'targetCgpa', msg: 'Target CGPA should be higher than or equal to current CGPA' });
  }
  if (data.creditsCompleted !== null && data.creditsCompleted < 0) {
    errors.push({ field: 'creditsCompleted', msg: 'Credits cannot be negative' });
  }

  return errors;
}

function clearFieldErrors() {
  $$('.form-group input').forEach((el) => el.classList.remove('error'));
}

function showFieldErrors(errors) {
  clearFieldErrors();
  errors.forEach(({ field }) => {
    const el = $(`#${field}`);
    if (el) el.classList.add('error');
  });
  if (errors.length) alert(errors[0].msg);
}

function getFormData() {
  const val = (id) => {
    const el = $(`#${id}`);
    const v = el.value.trim();
    return v === '' ? null : parseFloat(v);
  };

  return {
    currentCgpa: val('currentCgpa'),
    completedSemesters: val('completedSemesters'),
    creditsCompleted: val('creditsCompleted'),
    targetCgpa: val('targetCgpa'),
    remainingSemesters: val('remainingSemesters'),
    creditsPerSemester: val('creditsPerSemester'),
  };
}

// ===== Calculations =====
function calculateRequiredSgpa(data, whatIfSgpas = {}) {
  const {
    currentCgpa,
    completedSemesters,
    creditsCompleted,
    targetCgpa,
    remainingSemesters,
    creditsPerSemester,
  } = data;

  const totalSemesters = completedSemesters + remainingSemesters;
  const startSem = completedSemesters + 1;

  let remainingNeeded;
  let remainingUnits;
  let useCredits = false;

  const enteredWhatIf = Object.entries(whatIfSgpas).filter(([, v]) => v !== null && !isNaN(v));
  const whatIfTotal = enteredWhatIf.reduce((sum, [, sgpa]) => sum + sgpa, 0);
  const whatIfCount = enteredWhatIf.length;
  const semestersLeftAfterWhatIf = remainingSemesters - whatIfCount;

  if (creditsCompleted && creditsPerSemester) {
    useCredits = true;
    const creditsPerSem = creditsPerSemester;
    const totalCredits = creditsCompleted + creditsPerSem * remainingSemesters;
    const targetPoints = targetCgpa * totalCredits;
    const currentPoints = currentCgpa * creditsCompleted;

    let whatIfPoints = 0;
    enteredWhatIf.forEach(([semIdx, sgpa]) => {
      whatIfPoints += sgpa * creditsPerSem;
    });

    remainingNeeded = targetPoints - currentPoints - whatIfPoints;
    remainingUnits = creditsPerSem * semestersLeftAfterWhatIf;
  } else {
    const targetPoints = targetCgpa * totalSemesters;
    const currentPoints = currentCgpa * completedSemesters;

    let whatIfPoints = 0;
    enteredWhatIf.forEach(([, sgpa]) => {
      whatIfPoints += sgpa;
    });

    remainingNeeded = targetPoints - currentPoints - whatIfPoints;
    runningPoints = currentPoints;
    remainingUnits = semestersLeftAfterWhatIf;
  }

  let requiredSgpa = remainingUnits > 0 ? remainingNeeded / remainingUnits : null;

  return {
    requiredSgpa,
    totalSemesters,
    startSem,
    remainingNeeded,
    remainingUnits,
    semestersLeftAfterWhatIf,
    whatIfCount,
    useCredits,
    impossible: requiredSgpa !== null && requiredSgpa > 10,
  };
}

function getFeasibility(requiredSgpa, currentCgpa = null, targetCgpa = null) {
  // Edge-case check for users maintaining an active target performance (e.g., 10.00 -> 10.00)
  if (currentCgpa !== null && targetCgpa !== null && currentCgpa === targetCgpa && requiredSgpa <= currentCgpa) {
    return { level: 'easy', dot: '🟢', text: 'On Track — Maintain your current performance!' };
  }

  if (requiredSgpa === null || requiredSgpa > 10) {
    return { level: 'impossible', dot: '🔴', text: 'Nearly impossible — exceeds max SGPA of 10' };
  }
  if (requiredSgpa <= 8.0) {
    return { level: 'easy', dot: '🟢', text: 'Easily achievable' };
  }
  if (requiredSgpa <= 9.5) {
    return { level: 'challenging', dot: '🟡', text: 'Challenging — requires consistent high performance' };
  }
  return { level: 'impossible', dot: '🔴', text: 'Nearly impossible — very demanding target' };
}

function formatNum(n, decimals = 2) {
  if (n === null || isNaN(n)) return '—';
  return n.toFixed(decimals);
}

// ===== Render Results =====
function renderResults(plan) {
  const { data, calc } = plan;
  const { requiredSgpa } = calc;
  
  // FIXED: Added missing data variables so the target tracking check functions properly
  const feasibility = getFeasibility(requiredSgpa, data.currentCgpa, data.targetCgpa);

  $('#resultsPlaceholder').classList.add('hidden');
  $('#resultsContent').classList.remove('hidden');

  const displaySgpa = calc.impossible ? '> 10.0' : formatNum(requiredSgpa);
  $('#requiredSgpa').textContent = displaySgpa;

  const remaining = calc.semestersLeftAfterWhatIf;
  if (calc.whatIfCount > 0) {
    $('#resultMessage').textContent =
      `After ${calc.whatIfCount} planned semester(s), you need an average SGPA of ${displaySgpa} in the remaining ${remaining} semester(s).`;
  } else {
    $('#resultMessage').textContent =
      `You need an average SGPA of ${displaySgpa} in the next ${data.remainingSemesters} semester(s).`;
  }

  const badge = $('#feasibilityBadge');
  badge.className = `feasibility-badge ${feasibility.level}`;
  $('#feasibilityDot').textContent = feasibility.dot;
  $('#feasibilityText').textContent = feasibility.text;

  const progressPct = Math.min(100, (data.currentCgpa / data.targetCgpa) * 100);
  $('#progressPercent').textContent = `${progressPct.toFixed(1)}%`;
  $('#progressFill').style.width = `${progressPct}%`;
  $('#progressCurrent').textContent = `Current: ${formatNum(data.currentCgpa)}`;
  $('#progressTarget').textContent = `Target: ${formatNum(data.targetCgpa)}`;

  $('#totalSemesters').textContent = calc.totalSemesters;
  $('#gapValue').textContent = `+${formatNum(data.targetCgpa - data.currentCgpa)}`;
  $('#projectedCgpa').textContent = formatNum(data.targetCgpa);

  renderChart(plan);
}

function renderChart(plan) {
  const { data, calc } = plan;
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const textColor = isDark ? '#94a3b8' : '#475569';
  const gridColor = isDark ? 'rgba(148,163,184,0.15)' : 'rgba(148,163,184,0.3)';

  const labels = [];
  const cgpaLine = [];

  for (let i = 1; i <= data.completedSemesters; i++) {
    labels.push(`Sem ${i}`);
    cgpaLine.push(data.currentCgpa);
  }

  const reqSgpa = calc.requiredSgpa ?? 10;
  let runningPoints = data.currentCgpa * data.completedSemesters;

  for (let i = 0; i < data.remainingSemesters; i++) {
    const semNum = data.completedSemesters + i + 1;
    labels.push(`Sem ${semNum}`);
    const whatIfVal = plan.whatIfSgpas[semNum];
    const sgpa = whatIfVal !== undefined && whatIfVal !== null ? whatIfVal : reqSgpa;
    runningPoints += sgpa;
    const projected = runningPoints / (data.completedSemesters + i + 1);
    cgpaLine.push(projected);
  }

  const targetLine = Array(labels.length).fill(data.targetCgpa);

  const ctx = $('#cgpaChart').getContext('2d');
  if (cgpaChart) cgpaChart.destroy();

  cgpaChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Projected CGPA',
          data: cgpaLine,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 4,
        },
        {
          label: 'Target CGPA',
          data: targetLine,
          borderColor: '#22c55e',
          borderDash: [6, 4],
          pointRadius: 0,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: textColor, font: { family: 'Inter' } },
        },
      },
      scales: {
        x: {
          ticks: { color: textColor, font: { size: 11 } },
          grid: { color: gridColor },
        },
        y: {
          min: 0,
          max: 10,
          ticks: { color: textColor, stepSize: 2 },
          grid: { color: gridColor },
        },
      },
    },
  });
}

// ===== Predictor Table / What-If =====
function renderPredictor(plan) {
  const { data, calc } = plan;

  $('#predictorPlaceholder').classList.add('hidden');
  $('#predictorContent').classList.remove('hidden');

  const tbody = $('#predictorBody');
  tbody.innerHTML = '';

  for (let i = 1; i <= data.completedSemesters; i++) {
    const tr = document.createElement('tr');
    tr.className = 'sem-completed';
    tr.innerHTML = `
      <td>Sem ${i}</td>
      <td><span class="status-badge done">Completed</span></td>
      <td>—</td>
      <td>Included in current CGPA (${formatNum(data.currentCgpa)})</td>
    `;
    tbody.appendChild(tr);
  }

  const defaultReq = calc.requiredSgpa;

  for (let i = 0; i < data.remainingSemesters; i++) {
    const semNum = data.completedSemesters + i + 1;
    const whatIfVal = plan.whatIfSgpas[semNum];
    const hasWhatIf = whatIfVal !== undefined && whatIfVal !== null;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>Sem ${semNum}</td>
      <td><span class="status-badge ${hasWhatIf ? 'done' : 'future'}">${hasWhatIf ? 'Planned' : 'Upcoming'}</span></td>
      <td>
        <input type="number" class="sgpa-input" data-sem="${semNum}"
          step="0.01" min="0" max="10" placeholder="${formatNum(defaultReq)}"
          value="${hasWhatIf ? whatIfVal : ''}">
      </td>
      <td class="req-cell" data-sem="${semNum}">
        ${hasWhatIf ? `Entered: ${formatNum(whatIfVal)}` : `Required: ${calc.impossible ? '> 10' : formatNum(defaultReq)}`}
      </td>
    `;
    tbody.appendChild(tr);
  }

  tbody.querySelectorAll('.sgpa-input').forEach((input) => {
    input.addEventListener('input', () => handleWhatIfChange(plan));
  });

  updateWhatIfSummary(plan);
}

function handleWhatIfChange(plan) {
  const whatIfSgpas = {};
  $$('#predictorBody .sgpa-input').forEach((input) => {
    const sem = parseInt(input.dataset.sem, 10);
    const val = input.value.trim();
    if (val !== '') whatIfSgpas[sem] = parseFloat(val);
  });

  plan.whatIfSgpas = whatIfSgpas;
  plan.calc = calculateRequiredSgpa(plan.data, whatIfSgpas);

  renderResults(plan);
  updatePredictorTargets(plan);
  updateWhatIfSummary(plan);
}

function updatePredictorTargets(plan) {
  const { calc } = plan;
  const req = calc.impossible ? '> 10' : formatNum(calc.requiredSgpa);

  $$('#predictorBody .sgpa-input').forEach((input) => {
    const sem = parseInt(input.dataset.sem, 10);
    const val = input.value.trim();
    const cell = $(`.req-cell[data-sem="${sem}"]`);
    if (val !== '') {
      cell.textContent = `Entered: ${formatNum(parseFloat(val))}`;
    } else {
      cell.textContent = `Required: ${req}`;
    }
    input.placeholder = formatNum(calc.requiredSgpa);
  });
}

function updateWhatIfSummary(plan) {
  const { data, calc } = plan;
  const entered = Object.entries(plan.whatIfSgpas);

  if (!entered.length) {
    $('#whatifSummary').innerHTML =
      `<p>💡 <strong>Tip:</strong> Enter SGPA values for upcoming semesters (e.g. 9.0 in Sem 5, 9.5 in Sem 6) to see updated targets for the rest.</p>`;
    return;
  }

  const entries = entered.map(([sem, sgpa]) => `Sem ${sem}: <strong>${formatNum(sgpa)}</strong>`).join(', ');
  const req = calc.impossible ? 'more than 10.0 (impossible)' : formatNum(calc.requiredSgpa);

  $('#whatifSummary').innerHTML = `<p>📌 
  <strong>What-If:</strong> With ${entries}, you now need an average SGPA of <strong>${req}</strong> 
  across the remaining <strong>${calc.semestersLeftAfterWhatIf}</strong> semester(s).</p>`;
}

// ===== Main Calculate =====
function calculatePlan() {
  const data = getFormData();

  if ([data.currentCgpa, 
    data.completedSemesters, 
    data.targetCgpa, 
    data.remainingSemesters]
    .some((v) => v === null || isNaN(v))) {
    alert('Please fill in all required fields.');
    return;
  }

  const errors = validateForm(data);
  if (errors.length) {
    showFieldErrors(errors);
    return;
  }

  clearFieldErrors();

  const whatIfSgpas = currentPlan?.whatIfSgpas || {};
  const calc = calculateRequiredSgpa(data, whatIfSgpas);

  currentPlan = { data, calc, whatIfSgpas };
  renderResults(currentPlan);
  renderPredictor(currentPlan);
}

// ===== LocalStorage — Saved Plans =====
function getSavedPlans() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.plans)) || [];
  } catch {
    return [];
  }
}

function savePlans(plans) {
  localStorage.setItem(STORAGE_KEYS.plans, JSON.stringify(plans));
}

function renderSavedPlans() {
  const plans = getSavedPlans();
  const container = $('#savedPlansList');

  if (!plans.length) {
    container.innerHTML = '<p class="empty-state">No saved plans yet.</p>';
    return;
  }

  container.innerHTML = plans
    .map(
      (plan, idx) => `<div class="plan-item" data-idx="${idx}">
      <div class="plan-info">
        <h4>${escapeHtml(plan.name)}</h4>
        <p>CGPA ${formatNum(plan.data.currentCgpa)} → ${formatNum(plan.data.targetCgpa)} · ${plan.data.remainingSemesters} sem remaining · Req: ${formatNum(plan.calc.requiredSgpa)}</p>
      </div>
      <div class="plan-actions">
        <button type="button" class="load-btn" data-idx="${idx}">Load</button>
        <button type="button" class="delete-btn" data-idx="${idx}">Delete</button>
      </div>
    </div>`
    )
    .join('');

  container.querySelectorAll('.load-btn').forEach((btn) => {
    btn.addEventListener('click', () => loadPlan(parseInt(btn.dataset.idx, 10)));
  });

  container.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', () => deletePlan(parseInt(btn.dataset.idx, 10)));
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function loadPlan(idx) {
  const plans = getSavedPlans();
  const plan = plans[idx];
  if (!plan) return;

  $('#currentCgpa').value = plan.data.currentCgpa;
  $('#completedSemesters').value = plan.data.completedSemesters;
  $('#creditsCompleted').value = plan.data.creditsCompleted ?? '';
  $('#targetCgpa').value = plan.data.targetCgpa;
  $('#remainingSemesters').value = plan.data.remainingSemesters;
  $('#creditsPerSemester').value = plan.data.creditsPerSemester ?? '';

  currentPlan = {
    data: plan.data,
    calc: calculateRequiredSgpa(plan.data, plan.whatIfSgpas || {}),
    whatIfSgpas: plan.whatIfSgpas || {},
  };

  renderResults(currentPlan);
  renderPredictor(currentPlan);
  $('#resultsCard').scrollIntoView({ 
    block: 'start',
    behavior: 'smooth'
  });
}

function deletePlan(idx) {
  const plans = getSavedPlans();
  plans.splice(idx, 1);
  savePlans(plans);
  renderSavedPlans();
}

function openSaveModal() {
  if (!currentPlan) {
    alert('Calculate a plan first before saving.');
    return;
  }
  $('#planName').value = '';
  saveModal.showModal();
}

function saveCurrentPlan(e) {
  e.preventDefault();
  const name = $('#planName').value.trim();
  if (!name) return;

  const plans = getSavedPlans();
  plans.push({
    name,
    data: currentPlan.data,
    calc: currentPlan.calc,
    whatIfSgpas: currentPlan.whatIfSgpas,
    savedAt: new Date().toISOString(),
  });

  savePlans(plans);
  renderSavedPlans();
  saveModal.close();
}

// ===== Grade Converter =====
function initGradeConverter() {
  $('#gradeInput').addEventListener('change', (e) => {
    const val = e.target.value;
    $('#gradePoint').textContent = val !== '' ? val : '—';
  });

  $('#addGradeBtn').addEventListener('click', addCourseGrade);
  $('#clearGradesBtn').addEventListener('click', clearCourseGrades);
}

function addCourseGrade() {
  const grade = parseFloat($('#courseGrade').value);
  courseGrades.push(grade);
  renderGradeList();
}

function removeGrade(idx) {
  courseGrades.splice(idx, 1);
  renderGradeList();
}

function clearCourseGrades() {
  courseGrades = [];
  renderGradeList();
}

function renderGradeList() {
  const list = $('#gradeList');
  list.innerHTML = courseGrades
    .map(
      (g, i) => `
    <li>${g} <button type="button" data-idx="${i}" aria-label="Remove">×</button></li>
  `
    )
    .join('');

  list.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => removeGrade(parseInt(btn.dataset.idx, 10)));
  });

  if (courseGrades.length) {
    const avg = courseGrades.reduce((a, b) => a + b, 0) / courseGrades.length;
    $('#calculatedSgpa').textContent = formatNum(avg);
  } else {
    $('#calculatedSgpa').textContent = '—';
  }
}

// ===== Event Listeners =====
function init() {
  initTheme();
  initGradeConverter();
  renderSavedPlans();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    calculatePlan();
  });

  form.addEventListener('reset', () => {
    setTimeout(() => {
      currentPlan = null;
      $('#resultsPlaceholder').classList.remove('hidden');
      $('#resultsContent').classList.add('hidden');
      $('#predictorPlaceholder').classList.remove('hidden');
      $('#predictorContent').classList.add('hidden');
      if (cgpaChart) {
        cgpaChart.destroy();
        cgpaChart = null;
      }
      clearFieldErrors();
    }, 0);
  });

  themeToggle.addEventListener('click', toggleTheme);
  savePlanBtn.addEventListener('click', openSaveModal);
  saveModalForm.addEventListener('submit', saveCurrentPlan);
  $('#cancelSave').addEventListener('click', () => saveModal.close());
}

document.addEventListener('DOMContentLoaded', init);