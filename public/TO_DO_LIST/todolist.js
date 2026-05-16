let tasks = [];
let currentFilter = 'all';

const CATEGORY_COLORS = {
  'Work': '#FFDE59',
  'Personal': '#FFC0CB',
  'Urgent': '#FF6B6B',
  'Fitness': '#B1EE99',
  'Misc': '#CAB9F5'
};

function addTask() {
  const input = document.getElementById('task-input');
  const select = document.getElementById('task-type-select');
  const text = input.value.trim();
  if (!text) {
    showToast('Please enter a task');
    input.focus();
    return;
  }
  const category = select.value || 'Work';
  const task = { id: Date.now(), text, category, done: false };
  tasks.push(task);
  input.value = '';
  select.value = '';
  renderTasks();
  updateStats();
  showToast('Task added');
  input.focus();
}

function renderTasks() {
  const list = document.getElementById('task-list');
  const empty = list.querySelector('.empty-state');

  let filtered = tasks;
  if (currentFilter === 'pending') filtered = tasks.filter(t => !t.done);
  else if (currentFilter === 'done') filtered = tasks.filter(t => t.done);
  else if (currentFilter !== 'all') filtered = tasks.filter(t => t.category === currentFilter);

  list.querySelectorAll('.task-card').forEach(el => el.remove());

  if (filtered.length === 0) {
    if (empty) empty.style.display = 'flex';
    return;
  }
  if (empty) empty.style.display = 'none';

  filtered.forEach(task => {
    const card = document.createElement('div');
    card.className = 'task-card' + (task.done ? ' done' : '');
    card.style.setProperty('--tag-color', CATEGORY_COLORS[task.category] || '#f5c842');
    card.dataset.taskId = task.id;

    const check = document.createElement('div');
    check.className = 'task-check' + (task.done ? ' checked' : '');
    if (task.done) check.textContent = '\u2713';
    check.addEventListener('click', () => toggleTask(task.id));

    const textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    textSpan.contentEditable = true;
    textSpan.textContent = task.text;
    textSpan.addEventListener('blur', () => {
      const trimmed = textSpan.textContent.trim();
      if (trimmed) task.text = trimmed;
      else textSpan.textContent = task.text;
    });

    const tag = document.createElement('span');
    tag.className = 'task-tag';
    tag.textContent = task.category;
    tag.style.background = CATEGORY_COLORS[task.category] || '#f5c842';

    const del = document.createElement('button');
    del.className = 'task-del';
    del.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    del.addEventListener('click', () => deleteTask(task.id));

    card.appendChild(check);
    card.appendChild(textSpan);
    card.appendChild(tag);
    card.appendChild(del);
    list.appendChild(card);
  });
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.done = !task.done;
    renderTasks();
    updateStats();
  }
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  renderTasks();
  updateStats();
  showToast('Task deleted');
}

function updateStats() {
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const pending = total - done;
  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-done').textContent = done;
  document.getElementById('stat-pending').textContent = pending;
  const pct = total ? Math.round((done / total) * 100) : 0;
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-pct').textContent = pct + '%';
}

function filterTasks(btn, filter) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderTasks();
}

function clearDone() {
  const before = tasks.length;
  tasks = tasks.filter(t => !t.done);
  if (tasks.length < before) {
    renderTasks();
    updateStats();
    showToast('Cleared completed tasks');
  }
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2500);
}

function applyTheme(name) {
  document.body.className = 'theme-' + name;
  document.querySelectorAll('.theme-swatch').forEach(s => s.classList.remove('active'));
  const map = { sunset: 't1', ocean: 't2', forest: 't3', midnight: 't4', aurora: 't5' };
  const el = document.getElementById(map[name]);
  if (el) el.classList.add('active');
}

function showHome() {
  document.getElementById('home-tab').style.display = 'block';
  document.getElementById('documents-tab').style.display = 'none';
  document.getElementById('btn-home').classList.add('active');
  document.getElementById('btn-docs').classList.remove('active');
}

function showDocuments() {
  document.getElementById('home-tab').style.display = 'none';
  document.getElementById('documents-tab').style.display = 'block';
  document.getElementById('btn-docs').classList.add('active');
  document.getElementById('btn-home').classList.remove('active');
}

function saveAsPDF() {
  if (tasks.length === 0) {
    showToast('No tasks to save');
    return;
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('TaskFlow - My Tasks', 20, 20);
  doc.setFontSize(11);
  tasks.forEach((t, i) => {
    const status = t.done ? '[x]' : '[ ]';
    doc.text(20, 35 + 8 * i, status + ' ' + t.text + ' (' + t.category + ')');
  });
  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);
  const fileName = 'TaskFlow_' + Date.now() + '.pdf';
  const list = document.querySelector('.documents-list');
  const empty = list.querySelector('.empty-state');
  if (empty) empty.remove();
  const item = document.createElement('div');
  item.className = 'doc-item';
  item.innerHTML =
    '<span class="doc-icon">📄</span>' +
    '<span class="doc-name">' + fileName + '</span>' +
    '<span class="doc-date">' + new Date().toLocaleDateString() + '</span>' +
    '<div class="doc-actions">' +
    '<button class="doc-btn" onclick="window.open(\'' + url + '\')">View</button>' +
    '<button class="doc-btn" onclick="downloadPDF(\'' + url + "','" + fileName + '\')">Download</button>' +
    '<button class="doc-btn del" onclick="this.closest(\'.doc-item\').remove()">Delete</button>' +
    '</div>';
  list.appendChild(item);
  showToast('PDF saved');
}

function downloadPDF(url, name) {
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
}
