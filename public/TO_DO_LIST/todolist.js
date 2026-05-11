document.addEventListener('DOMContentLoaded', () => {
  const todoInput     = document.getElementById('todo-input');
  const addTaskBtn    = document.getElementById('add-task-btn');
  const printBtn      = document.getElementById('print-btn');
  const todoList      = document.getElementById('todo-list');
  const taskCountEl   = document.getElementById('task-count');
  const emptyState    = document.getElementById('empty-state');
  const saveDocBtn   = document.getElementById('save-doc-btn');
  const homeNav      = document.getElementById('home-nav');
  const docsNav      = document.getElementById('docs-nav');
  const homePage     = document.getElementById('home-page');
  const docsPage     = document.getElementById('documents-page');
  const documentsList = document.getElementById('documents-list');
  const progressFill = document.getElementById('progress-fill');
  const progressPercent =document.getElementById('progress-percent');
  const themeToggle = document.getElementById('theme-toggle');



  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // ── Init ──────────────────────────────────────────────
  tasks.forEach(task => renderTask(task));
  updateMeta();

  // ── Add task ──────────────────────────────────────────
  addTaskBtn.addEventListener('click', addTask);
  todoInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') addTask();
  });

  function addTask() {
    const text = todoInput.value.trim();
    if (!text) {
      todoInput.style.borderColor = 'rgba(255,77,109,0.6)';
      setTimeout(() => todoInput.style.borderColor = '', 600);
      return;
    }
    const newTask = { id: Date.now(), text, completed: false };
    tasks.push(newTask);
    renderTask(newTask);
    saveTasks();
    updateMeta();
    todoInput.value = '';
    todoInput.focus();
  }

  // ── Render ────────────────────────────────────────────
  function renderTask(task) {
    const li = document.createElement('li');
    li.setAttribute('data-id', task.id);
    if (task.completed) li.classList.add('completed');

    li.innerHTML = `
      <div class="task-checkbox"></div>
      <span class="task-text">${escapeHtml(task.text)}</span>
      <button class="delete-btn" title="Delete task">
        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;

    // Toggle complete
    li.addEventListener('click', e => {
      if (e.target.closest('.delete-btn')) return;
      task.completed = !task.completed;
      li.classList.toggle('completed');
      saveTasks();
      updateMeta();
    });

    // Delete
    li.querySelector('.delete-btn').addEventListener('click', e => {
      e.stopPropagation();
      li.style.transition = 'all 0.28s ease';
      li.style.opacity = '0';
      li.style.transform = 'translateX(20px)';
      setTimeout(() => {
        tasks = tasks.filter(t => t.id !== task.id);
        li.remove();
        saveTasks();
        updateMeta();
      }, 280);
    });

    todoList.appendChild(li);
  }

  // ── Meta ──────────────────────────────────────────────
  function updateMeta() {
    const remaining = tasks.filter(t => !t.completed).length;
    taskCountEl.textContent = remaining;
    emptyState.classList.toggle('visible', tasks.length === 0);
    // Progress calculation

const completed =
  tasks.filter(t => t.completed).length;

const percent =
  tasks.length === 0
    ? 0
    : Math.round((completed / tasks.length) * 100);

progressFill.style.width = `${percent}%`;

progressPercent.textContent = `${percent}%`;
  }

  // ── Save ──────────────────────────────────────────────
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // ── Print / PDF ───────────────────────────────────────
  printBtn.addEventListener('click', () => {
    window.print();
  });
  // ───────────────── SAVE DOCUMENT ─────────────────

saveDocBtn.addEventListener('click', () => {

  if (tasks.length === 0) return;

  const documents =
    JSON.parse(localStorage.getItem('documents')) || [];

  const snapshot = {
    id: Date.now(),
    date: new Date().toLocaleString(),
    tasks: [...tasks]
  };

  documents.unshift(snapshot);

  localStorage.setItem(
    'documents',
    JSON.stringify(documents)
  );

  renderDocuments();

  saveDocBtn.innerHTML = "✓ Saved";

  setTimeout(() => {
    saveDocBtn.innerHTML = `
      <svg viewBox="0 0 24 24">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
          <polyline points="17 21 17 13 7 13 7 21"/>
          <polyline points="7 3 7 8 15 8"/>
      </svg>
      Save Document
    `;
  }, 1500);
});


// ───────────────── NAVIGATION ─────────────────

homeNav.addEventListener('click', () => {

  homePage.classList.remove('hidden');
  docsPage.classList.add('hidden');

  homeNav.classList.add('active');
  docsNav.classList.remove('active');
});

docsNav.addEventListener('click', () => {

  docsPage.classList.remove('hidden');
  homePage.classList.add('hidden');

  docsNav.classList.add('active');
  homeNav.classList.remove('active');

  renderDocuments();
});


// ───────────────── DOCUMENT RENDER ─────────────────

function renderDocuments() {

  const documents =
    JSON.parse(localStorage.getItem('documents')) || [];

  documentsList.innerHTML = '';

  if (documents.length === 0) {

    documentsList.innerHTML = `
      <div class="empty-state visible">
        No saved documents yet ✦
      </div>
    `;

    return;
  }

  documents.forEach(doc => {

    const div = document.createElement('div');

    div.className = 'document-card';

    div.innerHTML = `
      <div class="doc-top">
        <div>
          <h3>Task Snapshot</h3>
          <p>${doc.date}</p>
        </div>

        <button class="view-doc-btn">
          View
        </button>
      </div>

      <div class="doc-preview hidden">
        ${
          doc.tasks.map(task => `
            <div class="preview-task">
              ${task.completed ? '✓' : '○'} ${task.text}
            </div>
          `).join('')
        }
      </div>
    `;

    const viewBtn = div.querySelector('.view-doc-btn');
    const preview = div.querySelector('.doc-preview');

    viewBtn.addEventListener('click', () => {

      preview.classList.toggle('hidden');

      viewBtn.textContent =
        preview.classList.contains('hidden')
          ? 'View'
          : 'Hide';
    });

    documentsList.appendChild(div);
  });
}
  // ── Util ──────────────────────────────────────────────
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ───────── THEME TOGGLE ─────────

const savedTheme =
  localStorage.getItem('theme');

if (savedTheme === 'light') {
  document.body.classList.add('light-mode');
}

themeToggle.addEventListener('click', () => {

  document.body.classList.toggle('light-mode');

  const currentTheme =
    document.body.classList.contains('light-mode')
      ? 'light'
      : 'dark';

  localStorage.setItem(
    'theme',
    currentTheme
  );
});
});

