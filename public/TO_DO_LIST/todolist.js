
/* ============================================
   TaskFlow — Task Manager JS
   Full rewrite: clean, functional, persistent
============================================ */

// ── State ──────────────────────────────────
let tasks = JSON.parse(localStorage.getItem('TaskFlow_tasks') || '[]');
let currentFilter = 'all';
let currentTheme = localStorage.getItem('TaskFlow_theme') || 'sunset';

// Tag colors map
const TAG_COLORS = {
  Work:      '#FFDE59',
  Personal:  '#FFC0CB',
  Urgent:    '#FF6B6B',
  Fitness:   '#B1EE99',
  Misc:      '#CAB9F5',
};

// ── Init ────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(currentTheme, false);
  renderAll();

  // Enter key to add task
  document.getElementById('task-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTask();
  });
});

// ── Persist ─────────────────────────────────
function save() {
  localStorage.setItem('TaskFlow_tasks', JSON.stringify(tasks));
}

// ── Add Task ────────────────────────────────
function addTask() {
  const input = document.getElementById('task-input');
  const typeSelect = document.getElementById('task-type-select');
  const text = input.value.trim();

  if (!text) {
    showToast('✏️ Please enter a task first!');
    input.focus();
    return;
  }

  const task = {
    id: Date.now(),
    text : text,
    type: typeSelect.value || 'Misc',
    done: false,
    createdAt: new Date().toISOString(),
  };

  tasks.unshift(task);
  save();
  renderAll();

  input.value = '';
  typeSelect.value = '';
  input.focus();
  showToast('✅ Task added!');
}

// ── Toggle Done ─────────────────────────────
function toggleDone(id) {
  const t = tasks.find(t => t.id === id);
  if (!t) return;
  t.done = !t.done;
  save();
  renderAll();
  showToast(t.done ? '🎉 Task completed!' : '↩️ Marked as pending');
}

// ── Delete Task ─────────────────────────────
function deleteTask(id) {
  const card = document.querySelector(`[data-id="${id}"]`);
  if (card) {
    card.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(() => {
      tasks = tasks.filter(t => t.id !== id);
      save();
      renderAll();
    }, 280);
  }
}

// ── Edit Task (inline) ──────────────────────
function editTask(id, newText) {
  const t = tasks.find(t => t.id === id);
  if (t) {
    t.text = newText.trim() || t.text;
    save();
  }
}

// ── Clear Done ──────────────────────────────
function clearDone() {
  const count = tasks.filter(t => t.done).length;
  if (!count) { showToast('No completed tasks to clear'); return; }
  tasks = tasks.filter(t => !t.done);
  save();
  renderAll();
  showToast(`🗑️ Cleared ${count} completed task${count > 1 ? 's' : ''}`);
}

// ── Filter ──────────────────────────────────
function filterTasks(btn, filter) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderList();
}

// ── Render All ──────────────────────────────
function renderAll() {
  renderList();
  renderStats();
}

function renderList() {
  const container = document.getElementById('task-list');
  const emptyState = document.getElementById('empty-state');

  // Filter tasks
  let filtered = tasks.filter(t => {
    if (currentFilter === 'all')     return true;
    if (currentFilter === 'done')    return t.done;
    if (currentFilter === 'pending') return !t.done;
    return t.type === currentFilter;
  });

  // Clear existing cards (keep empty state)
  container.querySelectorAll('.task-card').forEach(c => c.remove());

  if (filtered.length === 0) {
    emptyState.style.display = 'flex';
    return;
  }

  emptyState.style.display = 'none';

  filtered.forEach(task => {
    const card = buildCard(task);
    container.appendChild(card);
  });

  deleteBtn.addEventListener("click", () => {
    note.remove();
  });

  noteWrapper.appendChild(taskText);
  noteWrapper.appendChild(dropdown);
  noteWrapper.appendChild(tickIcon);
  noteWrapper.appendChild(deleteBtn);

  note.appendChild(noteWrapper);
  notesContainer.appendChild(note);
  task.value = "";
}

function buildCard(task) {
  const tagColor = TAG_COLORS[task.type] || '#CAB9F5';

  const card = document.createElement('div');
  card.className = 'task-card' + (task.done ? ' done' : '');
  card.dataset.id = task.id;
  card.style.setProperty('--tag-color', tagColor);

  // Checkbox
  const check = document.createElement('div');
  check.className = 'task-check' + (task.done ? ' checked' : '');
  check.innerHTML = task.done ? '✓' : '';
  check.onclick = () => toggleDone(task.id);

  // Text
  const text = document.createElement('span');
  text.className = 'task-text';
  text.contentEditable = true;
  text.textContent = task.text;
  text.spellcheck = false;
  text.onblur = () => editTask(task.id, text.textContent);
  text.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); text.blur(); } };

  // Tag
  const tag = document.createElement('span');
  tag.className = 'task-tag';
  tag.style.background = tagColor;
  tag.textContent = task.type;

  // Delete
  const del = document.createElement('button');
  del.className = 'task-del';
  del.title = 'Delete task';
  del.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14a2,2,0,0,1-2,2H8a2,2,0,0,1-2-2L5,6"/><path d="M10,11v6M14,11v6"/><path d="M9,6V4h6v2"/></svg>`;
  del.onclick = (e) => { e.stopPropagation(); deleteTask(task.id); };

  card.append(check, text, tag, del);
  return card;

}

// ── Stats ───────────────────────────────────
function renderStats() {
  const total   = tasks.length;
  const done    = tasks.filter(t => t.done).length;
  const pending = total - done;
  const pct     = total ? Math.round((done / total) * 100) : 0;

  document.getElementById('stat-total').textContent   = total;
  document.getElementById('stat-done').textContent    = done;
  document.getElementById('stat-pending').textContent = pending;
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-pct').textContent  = pct + '%';
}

// ── Nav ─────────────────────────────────────
function showHome() {
  document.getElementById('home-tab').style.display = '';
  document.getElementById('documents-tab').style.display = 'none';
  document.getElementById('btn-home').classList.add('active');
  document.getElementById('btn-docs').classList.remove('active');
}

function showDocuments() {
  document.getElementById('home-tab').style.display = 'none';
  document.getElementById('documents-tab').style.display = '';
  document.getElementById('btn-docs').classList.add('active');
  document.getElementById('btn-home').classList.remove('active');
}

// ── Themes ──────────────────────────────────
const THEMES = {
  sunset:   '',
  ocean:    'theme-ocean',
  forest:   'theme-forest',
  midnight: 'theme-midnight',
  aurora:   'theme-aurora',
};
const SWATCH_MAP = {
  sunset: 't1', ocean: 't2', forest: 't3', midnight: 't4', aurora: 't5'
};

function applyTheme(name, notify = true) {
  // Remove all theme classes
  Object.values(THEMES).forEach(cls => { if (cls) document.body.classList.remove(cls); });
  if (THEMES[name]) document.body.classList.add(THEMES[name]);

  // Update active swatch
  document.querySelectorAll('.theme-swatch').forEach(s => s.classList.remove('active'));
  const swatch = document.getElementById(SWATCH_MAP[name]);
  if (swatch) swatch.classList.add('active');

  currentTheme = name;
  localStorage.setItem('TaskFlow_theme', name);
  if (notify) showToast('🎨 Theme applied!');
}

// ── Premium PDF Export ────────────────────
function saveAsPDF() {
  if (!tasks.length) {
    showToast('⚠️ No tasks to export!');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4'
  });

  const now = new Date();
  // ── COLORS ──────────────────────────────────────────────────────
  const COLORS = {
    primary: [42, 12, 74],
    secondary: [93, 63, 211],
    accent: [255, 214, 10],
    light: [245, 240, 255],
    text: [45, 35, 60],
    muted: [130, 120, 150],
    success: [34, 197, 94],
    pending: [239, 68, 68],
    white: [255, 255, 255]
  };

  // ── PAGE SETTINGS ───────────────────────────────────────────────
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 14;

  let y = 20;

  // ── HEADER BACKGROUND ───────────────────────────────────────────
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Decorative Accent
  doc.setFillColor(...COLORS.secondary);
  doc.circle(pageWidth - 18, 10, 18, 'F');

  doc.setFillColor(...COLORS.accent);
  doc.circle(pageWidth - 8, 8, 8, 'F');

  // ── APP TITLE ───────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(...COLORS.accent);
  doc.text('TaskFlow', margin, 18);

  doc.setFontSize(11);
  doc.setTextColor(...COLORS.white);
  doc.text('Professional Task Report', margin, 27);

  doc.setFontSize(9);
  doc.setTextColor(210, 200, 240);
  doc.text(`Generated on ${now.toLocaleString()}`, margin, 34);

  // ── TASK STATS ──────────────────────────────────────────────────
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const pending = total - done;
  const progress = Math.round((done / total) * 100);

  // Stats Card
  doc.setFillColor(...COLORS.light);
  doc.roundedRect(130, 12, 65, 22, 4, 4, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.text);
  doc.text(`Total: ${total}`, 136, 20);

  doc.setTextColor(...COLORS.success);
  doc.text(`Done: ${done}`, 136, 26);

  doc.setTextColor(...COLORS.pending);
  doc.text(`Pending: ${pending}`, 168, 26);

  // Progress Bar
  y = 56;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.text);
  doc.text(`Overall Progress (${progress}%)`, margin, y);

  y += 6;

  // Progress Background
  doc.setFillColor(225, 220, 240);
  doc.roundedRect(margin, y, 180, 6, 3, 3, 'F');

  // Progress Fill
  doc.setFillColor(...COLORS.secondary);
  doc.roundedRect(
    margin,
    y,
    (180 * progress) / 100,
    6,
    3,
    3,
    'F'
  );

  y += 16;

  // ── GROUP TASKS BY CATEGORY ────────────────────────────────────
  const categories = [...new Set(tasks.map(t => t.type || 'General'))];

  categories.forEach(category => {
    const categoryTasks = tasks.filter(
      t => (t.type || 'General') === category
    );

    // Add page if needed
    if (y > pageHeight - 40) {
      doc.addPage();
      y = 20;
    }

    // Category Header
    doc.setFillColor(...COLORS.secondary);
    doc.roundedRect(margin, y - 5, 182, 12, 4, 4, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...COLORS.white);

    const categoryDone = categoryTasks.filter(t => t.done).length;

    doc.text(
      `${category.toUpperCase()} (${categoryDone}/${categoryTasks.length})`,
      margin + 4,
      y + 2
    );

    y += 14;

    // ── TASK ITEMS ────────────────────────────────────────────────
    categoryTasks.forEach((task, index) => {
      const lines = doc.splitTextToSize(task.text, 160);
      const boxHeight = Math.max(12, lines.length * 6 + 6);

      // New page check
      if (y + boxHeight > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }

      // Task Card Background
      doc.setFillColor(
        ...(task.done ? [240, 255, 245] : [255, 250, 250])
      );

      doc.roundedRect(
        margin,
        y - 4,
        182,
        boxHeight,
        3,
        3,
        'F'
      );

      // Left Status Border
      doc.setFillColor(
        ...(task.done ? COLORS.success : COLORS.pending)
      );

      doc.rect(margin, y - 4, 3, boxHeight, 'F');

      // Status Icon
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(
        ...(task.done ? COLORS.success : COLORS.pending)
      );

      doc.text(task.done ? '✓' : '○', margin + 7, y + 3);

      // Task Text
      doc.setFont(
        'helvetica',
        task.done ? 'italic' : 'normal'
      );

      doc.setFontSize(10);
      doc.setTextColor(...COLORS.text);
      doc.text(lines, margin + 16, y + 3);

      // Task Number
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.muted);

      doc.text(
        `#${index + 1}`,
        pageWidth - 22,
        y + 3
      );

      y += boxHeight + 5;
    });

    y += 4;
  });

  // ── FOOTER FOR ALL PAGES ───────────────────────────────────────
  const totalPages = doc.internal.getNumberOfPages();

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Footer Line
    doc.setDrawColor(220, 210, 240);
    doc.line(14, pageHeight - 14, pageWidth - 14, pageHeight - 14);

    // Footer Text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);

    doc.setTextColor(...COLORS.muted);

    doc.text(
      `Generated by TaskFlow`,
      14,
      pageHeight - 8
    );
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - 35,
      pageHeight - 8
    );
  }

  // ── SAVE FILE ──────────────────────────────────────────────────
  const fileName =
    `TaskFlow_Report_${now.getFullYear()}-` +
    `${String(now.getMonth() + 1).padStart(2, '0')}-` +
    `${String(now.getDate()).padStart(2, '0')}.pdf`;

  const blob = doc.output('blob');
  const fileURL = URL.createObjectURL(blob);

  addDocumentEntry(
    fileName,
    fileURL,
    now.toLocaleString()
  );

  doc.save(fileName);
  showToast('📄 Premium PDF exported successfully!');
}

function addDocumentEntry(fileName, fileURL, dateStr) {
  const list = document.getElementById('documents-list');

  // Remove empty state if present
  const empty = list.querySelector('.empty-state');
  if (empty) empty.remove();

  const item = document.createElement('div');
  item.className = 'doc-item';
  item.innerHTML = `
    <span class="doc-icon">📄</span>
    <div style="flex:1; min-width:0;">
      <div class="doc-name">${fileName}</div>
      <div class="doc-date">${dateStr}</div>
    </div>
    <div class="doc-actions">
      <button class="doc-btn" onclick="window.open('${fileURL}','_blank')">View</button>
      <button class="doc-btn" onclick="downloadFile('${fileURL}','${fileName}')">Download</button>
      <button class="doc-btn del" onclick="this.closest('.doc-item').remove(); checkEmptyDocs();">Delete</button>
    </div>
  `;
  list.insertBefore(item, list.firstChild);
}

function downloadFile(url, name) {
  const a = document.createElement('a');
  a.href = url; 
  a.download = name; 
  a.click();
}

function checkEmptyDocs() {
  const list = document.getElementById('documents-list');
  if (!list.querySelector('.doc-item')) {
    list.innerHTML = `<div class="empty-state"><div class="empty-icon">🗂️</div><p>No documents saved yet. Export your tasks!</p></div>`;
  }
}

// ── Toast ────────────────────────────────────
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}
