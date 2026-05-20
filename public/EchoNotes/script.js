// ── STATE ──
let notes = JSON.parse(localStorage.getItem('echo_notes') || '[]');
let activeId = null;
let unsaved = false;
let isDark = localStorage.getItem('echo_theme') === 'dark';

// ── INIT ──
if (isDark) applyTheme(true);
renderNotesList();

// ── THEME ──
function applyTheme(dark) {
  isDark = dark;
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : '');
  document.getElementById('themeBtn').textContent = dark ? '☀️' : '🌙';
  localStorage.setItem('echo_theme', dark ? 'dark' : 'light');
}

document.getElementById('themeBtn').onclick = () => applyTheme(!isDark);

// ── CREATE NEW NOTE ──
function createNewNote() {
  const note = {
    id: Date.now().toString(),
    title: '',
    content: '',
    color: isDark ? '#f0ebe3' : '#2a2118',
    size: '16',
    created: new Date().toISOString(),
    updated: new Date().toISOString()
  };
  notes.unshift(note);
  saveAll();
  openNote(note.id);
}

// ── OPEN NOTE ──
function openNote(id) {
  activeId = id;
  const note = notes.find(n => n.id === id);
  if (!note) return;

  document.getElementById('welcomeScreen').style.display = 'none';

  const ew = document.getElementById('editorWrapper');
  ew.style.display = 'flex';

  document.getElementById('noteTitleInput').value = note.title;
  document.getElementById('note-content').value = note.content;
  document.getElementById('note-content').style.color = note.color || (isDark ? '#f0ebe3' : '#2a2118');
  document.getElementById('note-content').style.fontSize = (note.size || '16') + 'px';
  document.getElementById('textColorInput').value = note.color || '#2a2118';
  document.getElementById('fontSizeSelect').value = note.size || '16';

  updateWordCount();
  markSaved();
  renderNotesList();
  document.getElementById('noteTitleInput').focus();
}

// ── SAVE NOTE ──
function saveNote() {
  if (!activeId) return;
  const note = notes.find(n => n.id === activeId);
  if (!note) return;

  note.title = document.getElementById('noteTitleInput').value.trim() || 'Untitled Note';
  note.content = document.getElementById('note-content').value;
  note.updated = new Date().toISOString();

  saveAll();
  markSaved();
  renderNotesList();
  showToast('✅', 'Note saved!', 'success');
}

// ── DELETE NOTE ──
function deleteNote(id, e) {
  if (e) e.stopPropagation();
  openModal('Delete Note', 'This note will be permanently deleted. Are you sure?', () => {
    notes = notes.filter(n => n.id !== id);
    saveAll();
    if (activeId === id) {
      activeId = null;
      document.getElementById('welcomeScreen').style.display = 'flex';
      document.getElementById('editorWrapper').style.display = 'none';
    }
    renderNotesList();
    showToast('🗑️', 'Note deleted.', '');
  });
}

// ── SAVE TO LOCALSTORAGE ──
function saveAll() {
  localStorage.setItem('echo_notes', JSON.stringify(notes));
}

// ── RENDER NOTES LIST ──
function renderNotesList(filter = '') {
  const list = document.getElementById('notesList');
  const stats = document.getElementById('sidebarStats');

  let filtered = notes;
  if (filter) {
    const q = filter.toLowerCase();
    filtered = notes.filter(n =>
      n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
    );
  }

  stats.textContent = `${filtered.length} note${filtered.length !== 1 ? 's' : ''}`;

  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="empty-notes">
        <div class="empty-icon">${filter ? '🔎' : '🗒️'}</div>
        <p>${filter
          ? 'No notes match your search.'
          : 'No notes yet.<br/>Click <strong>+ New Note</strong> to start!'
        }</p>
      </div>`;
    return;
  }

  list.innerHTML = filtered.map(n => `
    <div class="note-card ${n.id === activeId ? 'active' : ''}" onclick="openNote('${n.id}')">
      <div class="note-card-title">${escHtml(n.title || 'Untitled Note')}</div>
      <div class="note-card-preview">${escHtml(n.content || 'No content…')}</div>
      <div class="note-card-date">${formatDate(n.updated)}</div>
      <button class="note-delete-btn" onclick="deleteNote('${n.id}', event)" title="Delete">✕</button>
    </div>
  `).join('');
}

// ── FILTER NOTES (SEARCH) ──
function filterNotes(q) {
  renderNotesList(q);
}

// ── HELPERS ──
function escHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// ── TEXT COLOR ──
function applyTextColor(c) {
  document.getElementById('note-content').style.color = c;
  if (activeId) {
    const n = notes.find(x => x.id === activeId);
    if (n) n.color = c;
  }
  markUnsaved();
}

// ── FONT SIZE ──
function applyFontSize(s) {
  document.getElementById('note-content').style.fontSize = s + 'px';
  if (activeId) {
    const n = notes.find(x => x.id === activeId);
    if (n) n.size = s;
  }
  markUnsaved();
}

// ── CLEAR NOTE ──
function confirmClear() {
  openModal('Clear Note', 'This will erase all content in the current note. Continue?', () => {
    document.getElementById('note-content').value = '';
    document.getElementById('noteTitleInput').value = '';
    updateWordCount();
    markUnsaved();
  });
}

// ── EXPORT PDF ──
function exportPDF() {
  if (!activeId) return;
  const title = document.getElementById('noteTitleInput').value || 'Untitled Note';
  const content = document.getElementById('note-content').value;

  if (!content.trim()) {
    showToast('⚠️', 'Note is empty!', '');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const marginL = 20, marginR = 20, marginT = 24;
  const pageW = doc.internal.pageSize.getWidth();
  const contentW = pageW - marginL - marginR;

  // Header bar
  doc.setFillColor(192, 98, 42);
  doc.rect(0, 0, pageW, 18, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Echo Notes', marginL, 12);

  // Note title
  doc.setTextColor(42, 33, 24);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(title, marginL, marginT + 10);

  // Export date
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(156, 143, 130);
  doc.text('Exported: ' + new Date().toLocaleString('en-IN'), marginL, marginT + 17);

  // Divider line
  doc.setDrawColor(214, 207, 195);
  doc.line(marginL, marginT + 20, pageW - marginR, marginT + 20);

  // Note content
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(42, 33, 24);

  const lines = doc.splitTextToSize(content, contentW);
  let y = marginT + 28;
  const lineH = 6;
  const pageH = doc.internal.pageSize.getHeight();

  lines.forEach(line => {
    if (y + lineH > pageH - 16) {
      doc.addPage();
      y = 20;
    }
    doc.text(line, marginL, y);
    y += lineH;
  });

  doc.save((title.replace(/[^a-z0-9]/gi, '_') || 'note') + '.pdf');
  showToast('📄', 'PDF exported!', 'success');
}

// ── SAVE STATUS ──
function markUnsaved() {
  unsaved = true;
  document.getElementById('statusDot').className = 'status-dot unsaved';
  document.getElementById('saveStatusText').textContent = 'Unsaved changes';
}

function markSaved() {
  unsaved = false;
  document.getElementById('statusDot').className = 'status-dot saved';
  document.getElementById('saveStatusText').textContent = 'Saved';
}

// ── WORD COUNT ──
function updateWordCount() {
  const txt = document.getElementById('note-content').value;
  const words = txt.trim() ? txt.trim().split(/\s+/).length : 0;
  document.getElementById('wordCount').textContent =
    `${words} word${words !== 1 ? 's' : ''} · ${txt.length} chars`;
}

// ── TOAST NOTIFICATION ──
let toastTimer;
function showToast(icon, msg, type) {
  const t = document.getElementById('toast');
  document.getElementById('toastIcon').textContent = icon;
  document.getElementById('toastMsg').textContent = msg;
  t.className = 'toast show' + (type ? ' ' + type : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.classList.remove('show'); }, 2400);
}

// ── MODAL ──
let modalCallback = null;

function openModal(title, msg, cb) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalMsg').textContent = msg;
  modalCallback = cb;
  document.getElementById('modalOverlay').classList.add('show');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('show');
}

document.getElementById('modalConfirmBtn').onclick = () => {
  closeModal();
  if (modalCallback) modalCallback();
};

document.getElementById('modalOverlay').onclick = (e) => {
  if (e.target === e.currentTarget) closeModal();
};

// ── KEYBOARD SHORTCUT: Ctrl+S to Save ──
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    saveNote();
  }
});
