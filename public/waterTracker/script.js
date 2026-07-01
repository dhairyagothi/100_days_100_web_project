(() => {
  const STORAGE_KEY = 'waterTracker';

  const elements = {
  dailyGoal: document.getElementById("dailyGoal"),
  saveGoalBtn: document.getElementById("saveGoalBtn"),
  waterLevel: document.getElementById("waterLevel"),
  consumedAmount: document.getElementById("consumedAmount"),
  goalAmount: document.getElementById("goalAmount"),
  progressPercent: document.getElementById("progressPercent"),
  progressText: document.getElementById("progressText"),
  statusMessage: document.getElementById("statusMessage"),
  customAmount: document.getElementById("customAmount"),
  customAddBtn: document.getElementById("customAddBtn"),
  undoBtn: document.getElementById("undoBtn"),
  resetBtn: document.getElementById("resetBtn"),
  quickAddButtons: document.querySelectorAll(".btn-add"),
};

  const requiredElements = [
  "dailyGoal",
  "saveGoalBtn",
  "waterLevel",
  "consumedAmount",
  "goalAmount",
  "progressPercent",
  "progressText",
  "statusMessage",
  "customAmount",
  "customAddBtn",
  "undoBtn",
  "resetBtn",
];

const missingElements = requiredElements.filter(
  (key) => !elements[key]
);

if (missingElements.length > 0) {
  console.error(
    `Water Tracker initialization failed. Missing elements: ${missingElements.join(", ")}`
  );
  return;
}

  let state = loadState();

  function todayKey() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

  function defaultState() {
    return {
      goal: 2000,
      consumed: 0,
      date: todayKey(),
      history: [],
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();

      const parsed = JSON.parse(raw);
      const base = { ...defaultState(), ...parsed };

      if (base.date !== todayKey()) {
        return {
          goal: base.goal ?? 2000,
          consumed: 0,
          date: todayKey(),
          history: [],
        };
      }

      base.history = Array.isArray(base.history) ? base.history : [];
      return base;
    } catch {
      return defaultState();
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function clampGoal(value) {
    const num = Number(value);
    if (!Number.isFinite(num)) return state.goal;
    return Math.min(10000, Math.max(250, Math.round(num)));
  }

  function clampAmount(value) {
    const num = Number(value);
    if (!Number.isFinite(num) || num <= 0) return 0;
    return Math.min(5000, Math.round(num));
  }

  function getProgressPercent() {
    if (state.goal <= 0) return 0;
    return Math.min(100, Math.round((state.consumed / state.goal) * 100));
  }

  function showStatus(message, type = 'success') {
    elements.statusMessage.textContent = message;
    elements.statusMessage.classList.toggle('is-warning', type === 'info');
    if (message) {
      clearTimeout(showStatus._timer);
      showStatus._timer = setTimeout(() => {
        if (elements.statusMessage.textContent === message) {
          elements.statusMessage.textContent = '';
        }
      }, 2200);
    }
  }

  function render() {
    const percent = getProgressPercent();
    const fill = Math.min(100, (state.consumed / state.goal) * 100);

    elements.dailyGoal.value = state.goal;
    elements.consumedAmount.textContent = state.consumed;
    elements.goalAmount.textContent = state.goal;
    elements.progressPercent.textContent = `${percent}%`;
    elements.waterLevel.style.setProperty('--fill', `${fill}%`);
    elements.waterLevel.classList.toggle(
      'goal-reached',
      state.consumed >= state.goal
    );
    elements.undoBtn.disabled = state.history.length === 0;

    const remaining = Math.max(0, state.goal - state.consumed);
    if (state.consumed >= state.goal) {
      elements.progressText.setAttribute(
        'aria-label',
        `Goal reached. You drank ${state.consumed} milliliters of your ${state.goal} milliliter goal.`
      );
    } else {
      elements.progressText.setAttribute(
        'aria-label',
        `${state.consumed} of ${state.goal} milliliters consumed. ${remaining} milliliters remaining.`
      );
    }
  }

  function addWater(amount) {
    const ml = clampAmount(amount);
    if (!ml) {
      showStatus('Enter a valid amount.', 'info');
      return;
    }

    state.consumed += ml;
    state.history.push(ml);
    saveState();
    render();

    if (state.consumed >= state.goal) {
      showStatus('Goal reached — great job staying hydrated!');
    } else {
      showStatus(`Added ${ml} ml`);
    }
  }

  function setGoal() {
    const goal = clampGoal(elements.dailyGoal.value);
    state.goal = goal;
    elements.dailyGoal.value = goal;
    saveState();
    render();
    showStatus(`Daily goal set to ${goal} ml`);
  }

  function undoLast() {
    if (!state.history.length) return;
    const last = state.history.pop();
    state.consumed = Math.max(0, state.consumed - last);
    saveState();
    render();
    showStatus(`Removed ${last} ml`, 'info');
  }

  function resetToday() {
    if (!state.consumed && !state.history.length) {
      showStatus('Nothing to reset.', 'info');
      return;
    }
    if (!confirm("Reset today's water intake to zero?")) return;

    state.consumed = 0;
    state.history = [];
    state.date = todayKey();
    saveState();
    render();
    showStatus("Today's progress reset.", 'info');
  }

  elements.quickAddButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      addWater(Number(btn.dataset.amount));
    });
  });

  elements.customAddBtn.addEventListener('click', () => {
    addWater(elements.customAmount.value);
    elements.customAmount.value = '';
  });

  elements.customAmount.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      elements.customAddBtn.click();
    }
  });

  elements.saveGoalBtn.addEventListener('click', setGoal);

  elements.dailyGoal.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setGoal();
    }
  });

  elements.undoBtn.addEventListener('click', undoLast);
  elements.resetBtn.addEventListener('click', resetToday);

  render();
})();
