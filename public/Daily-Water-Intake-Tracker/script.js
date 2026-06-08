const goalForm = document.getElementById('goalForm');
const goalInput = document.getElementById('goalInput');
const customForm = document.getElementById('customForm');
const customInput = document.getElementById('customInput');
const resetBtn = document.getElementById('resetBtn');
const goalValue = document.getElementById('goalValue');
const intakeValue = document.getElementById('intakeValue');
const remainingValue = document.getElementById('remainingValue');
const completionValue = document.getElementById('completionValue');
const progressFill = document.getElementById('progressFill');
const progressBar = document.getElementById('progressBar');
const percentageLabel = document.getElementById('percentageLabel');
const completionMessage = document.getElementById('completionMessage');
const waterButtons = document.querySelectorAll('.water-button');

const STORAGE_KEYS = {
  waterGoal: 'waterGoal',
  waterIntake: 'waterIntake',
};

let waterGoal = 2000;
let waterIntake = 0;

function saveData() {
  localStorage.setItem(STORAGE_KEYS.waterGoal, String(waterGoal));
  localStorage.setItem(STORAGE_KEYS.waterIntake, String(waterIntake));
}

function loadData() {
  const savedGoal = Number(localStorage.getItem(STORAGE_KEYS.waterGoal));
  const savedIntake = Number(localStorage.getItem(STORAGE_KEYS.waterIntake));

  waterGoal = Number.isFinite(savedGoal) && savedGoal > 0 ? savedGoal : 2000;
  waterIntake = Number.isFinite(savedIntake) && savedIntake >= 0 ? savedIntake : 0;

  goalInput.value = waterGoal;
  updateUI();
}

function updateUI() {
  const remaining = Math.max(waterGoal - waterIntake, 0);
  const percent = waterGoal > 0 ? Math.min((waterIntake / waterGoal) * 100, 100) : 0;

  goalValue.textContent = `${waterGoal.toLocaleString()} ml`;
  intakeValue.textContent = `${waterIntake.toLocaleString()} ml`;
  remainingValue.textContent = `${remaining.toLocaleString()} ml`;
  completionValue.textContent = `${Math.round(percent)}%`;
  percentageLabel.textContent = `${Math.round(percent)}%`;
  progressFill.style.width = `${percent}%`;
  progressBar.setAttribute('aria-valuenow', String(Math.round(percent)));

  if (waterIntake >= waterGoal && waterGoal > 0) {
    completionMessage.textContent = 'Goal reached — excellent hydration! Keep the momentum going.';
  } else if (waterIntake > 0) {
    completionMessage.textContent = `Only ${remaining.toLocaleString()} ml left to reach your goal.`;
  } else {
    completionMessage.textContent = 'Start logging your water intake to see progress here.';
  }
}

function setGoal(event) {
  event.preventDefault();
  const value = Number(goalInput.value);

  if (!Number.isFinite(value) || value < 100) {
    goalInput.focus();
    goalInput.setAttribute('aria-invalid', 'true');
    return;
  }

  waterGoal = Math.round(value);
  goalInput.setAttribute('aria-invalid', 'false');
  saveData();
  updateUI();
}

function addWater(amount) {
  if (!Number.isFinite(amount) || amount <= 0) return;

  waterIntake += amount;
  saveData();
  updateUI();
}

function resetTracker() {
  waterIntake = 0;
  saveData();
  updateUI();
}

goalForm.addEventListener('submit', setGoal);
customForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const amount = Number(customInput.value);

  if (!Number.isFinite(amount) || amount <= 0) {
    customInput.focus();
    customInput.setAttribute('aria-invalid', 'true');
    return;
  }

  customInput.value = '';
  customInput.setAttribute('aria-invalid', 'false');
  addWater(Math.round(amount));
});

waterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const amount = Number(button.dataset.amount);
    addWater(amount);
  });
});

resetBtn.addEventListener('click', resetTracker);
window.addEventListener('DOMContentLoaded', loadData);
