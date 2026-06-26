const currentMlEl = document.getElementById('currentMl');
const goalMlEl = document.getElementById('goalMl');
const remainingMlEl = document.getElementById('remainingMl');
const progressBar = document.getElementById('progressBar');
const water = document.getElementById('water');
const dropsGrid = document.getElementById('dropsGrid');
const toast = document.getElementById('toast');
const goalInput = document.getElementById('goalInput');
const customAmount = document.getElementById('customAmount');
const dropLabel = document.getElementById('dropLabel');
const mainDrop = document.getElementById('mainDrop');

const colors = [
  '#63d3ff',
  '#ffb7d5',
  '#d9b8ff',
  '#cff5c4',
  '#fff3a6',
  '#aeefff',
  '#8ed8ff',
  '#f7c2ff',
];

const today = new Date().toISOString().split('T')[0];

let state = JSON.parse(localStorage.getItem('aquaglowState')) || {
  current: 0,
  goal: 2000,
  glasses: 0,
  lastResetDate: today,
};

function checkAndResetForNewDay() {
  const today = new Date().toISOString().split('T')[0];

  if (!state.lastResetDate) {
    state.lastResetDate = today;
    save();
    return;
  }

  if (state.lastResetDate !== today) {
    state.current = 0;
    state.glasses = 0;

    // Preserve user's hydration goal
    state.lastResetDate = today;

    save();
    showToast('New day started - hydration reset');
  }
}

document.querySelectorAll('[data-amount]').forEach((button) => {
  button.addEventListener('click', () => {
    addWater(Number(button.dataset.amount));
  });
});

document.getElementById('customAddBtn').addEventListener('click', () => {
  const amount = Number(customAmount.value);

  if (amount > 0) {
    addWater(amount);
    customAmount.value = '';
  }
});

document.getElementById('setGoalBtn').addEventListener('click', () => {
  const goal = Number(goalInput.value);

  if (goal >= 250) {
    state.goal = goal;
    goalInput.value = '';
    save();
    render();
    showToast('Goal updated');
  }
});

document.getElementById('resetBtn').addEventListener('click', () => {
  state.current = 0;
  state.glasses = 0;
  state.lastResetDate = new Date().toISOString().split('T')[0];

  save();
  render();
  showToast('Today reset');
});

document.getElementById('completeBtn').addEventListener('click', () => {
  if (state.current < state.goal) {
    const needed = state.goal - state.current;
    addWater(needed);
  } else {
    showToast('Goal already complete');
  }
});

function addWater(amount) {
  state.current += amount;
  state.glasses += 1;
  save();
  render();
  showToast(`Added ${amount} ml`);
}

function save() {
  localStorage.setItem(
    'aquaglowState',
    JSON.stringify({
      ...state,
      lastResetDate: state.lastResetDate,
    })
  );
}

function render() {
  const percent = Math.min(100, Math.round((state.current / state.goal) * 100));
  const remaining = Math.max(0, state.goal - state.current);

  currentMlEl.textContent = state.current;
  goalMlEl.textContent = state.goal;
  remainingMlEl.textContent = remaining;

  progressBar.style.width = percent + '%';
  water.style.height = percent + '%';

  renderDrops();
  updateGlow(percent);
  updateAchievements(percent);
}

function renderDrops() {
  dropsGrid.innerHTML = '';
  const maxDrops = 12;

  for (let i = 0; i < maxDrops; i++) {
    const card = document.createElement('div');
    card.className = 'mini-drop-card' + (i >= state.glasses ? ' locked' : '');

    const drop = document.createElement('div');
    drop.className = 'mini-drop';
    drop.style.color = colors[i % colors.length];

    card.appendChild(drop);
    dropsGrid.appendChild(card);
  }
}

function updateGlow(percent) {
  if (percent === 0) {
    dropLabel.textContent = 'waiting for first sip';
  } else if (percent < 35) {
    dropLabel.textContent = 'gentle glow';
  } else if (percent < 75) {
    dropLabel.textContent = 'bright glow';
  } else if (percent < 100) {
    dropLabel.textContent = 'almost radiant';
  } else {
    dropLabel.textContent = 'radiant goal complete';
  }

  const glow = 20 + percent * 0.7;
  mainDrop.style.filter = `drop-shadow(0 0 ${glow}px rgba(174,239,255,.95)) drop-shadow(0 0 ${glow * 2}px rgba(99,211,255,.45))`;
}

function updateAchievements(percent) {
  document
    .getElementById('firstDrop')
    .classList.toggle('unlocked', state.current > 0);
  document
    .getElementById('halfGoal')
    .classList.toggle('unlocked', percent >= 50);
  document
    .getElementById('goalDone')
    .classList.toggle('unlocked', percent >= 100);
  document
    .getElementById('overGlow')
    .classList.toggle('unlocked', state.current > state.goal);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 1300);
}

checkAndResetForNewDay();
render();
