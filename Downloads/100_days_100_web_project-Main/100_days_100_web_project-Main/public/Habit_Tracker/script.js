const state = {
  habits: JSON.parse(localStorage.getItem('habits')) || [],
  view: new Date(),
};

const $ = (s) => document.querySelector(s);

// ---- Render Functions ----
function renderHabits() {
  const list = $('#habitList');
  list.innerHTML = '';
  state.habits.forEach((h) => {
    const div = document.createElement('div');
    div.className = 'habit-item';
    div.innerHTML = `
      <div class="habit-info">
        <strong>${h.name}</strong> 
        <div class="habit-progress"><span style="width:${h.progress || 0}%"></span></div>
      </div>
      <button class="delete-btn" data-id="${h.id}">🗑</button>
    `;
    list.appendChild(div);
  });

  document.querySelectorAll('.delete-btn').forEach((btn) =>
    btn.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      state.habits = state.habits.filter((h) => h.id != id);
      save();
      renderHabits();
    })
  );
}

function renderCalendar() {
  const cal = $('#calendar');
  cal.innerHTML = '';
  const y = state.view.getFullYear();
  const m = state.view.getMonth();
  const days = new Date(y, m + 1, 0).getDate();

  $('#monthLabel').textContent = state.view.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  for (let d = 1; d <= days; d++) {
    const day = document.createElement('div');
    day.className = 'day';
    day.textContent = d;
    day.onclick = () => {
      day.classList.toggle('checked');
      updateProgress();
    };
    cal.appendChild(day);
  }
}

function updateProgress() {
  const totalDays = document.querySelectorAll('.day').length;
  const checkedDays = document.querySelectorAll('.day.checked').length;
  const progress = Math.round((checkedDays / totalDays) * 100);

  state.habits.forEach((h) => (h.progress = progress));
  save();
  renderHabits();
}

function save() {
  localStorage.setItem('habits', JSON.stringify(state.habits));
}

// ---- Theme Toggle ----
$('#themeToggle').onchange = (e) => {
  const isDark = e.target.checked;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : '');
  $('#themeLabel').textContent = isDark ? '🌙 Dark' : '☀️ Light';
};

// ---- Modal ----
$('#addHabitBtn').onclick = () => $('#habitModal').classList.add('show');
$('#closeModal').onclick = () => $('#habitModal').classList.remove('show');
$('#saveHabitBtn').onclick = () => {
  const name = $('#habitName').value.trim();
  const color = $('#habitColor').value;
  if (!name) return alert('Please enter a habit name!');
  state.habits.push({ id: Date.now(), name, color, progress: 0 });
  save();
  renderHabits();
  $('#habitModal').classList.remove('show');
  $('#habitName').value = '';
};

// ---- Month Navigation ----
$('#prevMonth').onclick = () => {
  state.view.setMonth(state.view.getMonth() - 1);
  renderCalendar();
};
$('#nextMonth').onclick = () => {
  state.view.setMonth(state.view.getMonth() + 1);
  renderCalendar();
};

// ---- Init ----
renderHabits();
renderCalendar();
