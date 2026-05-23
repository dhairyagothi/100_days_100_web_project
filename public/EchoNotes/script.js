// ==========================================================================
// APPLICATION STATE
// ==========================================================================
let notes = JSON.parse(localStorage.getItem('echo_notes') || '[]');
let folders = JSON.parse(localStorage.getItem('echo_folders') || '[]');

const defaultFolders = [
  { id: 'personal', name: 'Personal', icon: '👤' },
  { id: 'work', name: 'Work', icon: '💼' },
  { id: 'ideas', name: 'Ideas', icon: '💡' }
];

// Initialize default folders if not present
if (folders.length === 0) {
  folders = [...defaultFolders];
  localStorage.setItem('echo_folders', JSON.stringify(folders));
}

let activeFolderId = 'all';
let activeId = null;
let unsaved = false;
let isDark = localStorage.getItem('echo_theme') === 'dark';
let currentMobileView = 'list';
let autosaveTimeout = null;

// ==========================================================================
// INITIALIZATION
// ==========================================================================
applyTheme(isDark);
renderFoldersList();
renderNotesList();

// Set default mobile view attributes
document.body.setAttribute('data-mobile-view', 'list');

// ==========================================================================
// THEME MANAGEMENT
// ==========================================================================
function applyTheme(dark) {
  isDark = dark;
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  document.getElementById('themeIcon').textContent = dark ? '☀️' : '🌙';
  document.getElementById('themeText').textContent = dark ? 'Light Theme' : 'Dark Theme';
  localStorage.setItem('echo_theme', dark ? 'dark' : 'light');
  
  // Re-apply theme classes on body
  document.body.classList.remove('theme-dark', 'theme-light');
  document.body.classList.add(dark ? 'theme-dark' : 'theme-light');
}

document.getElementById('themeBtn').onclick = () => applyTheme(!isDark);

// ==========================================================================
// FOLDER OPERATIONS
// ==========================================================================
function renderFoldersList() {
  const list = document.getElementById('foldersList');
  if (!list) return;

  const allCount = notes.length;

  let html = `
    <div class="folder-item ${activeFolderId === 'favorites' ? 'active' : ''}" onclick="selectFolder('favorites')">
      <div class="folder-item-left">
        <span class="folder-item-icon">⭐</span>
        <span class="folder-item-name">Favorites</span>
      </div>
      <span class="folder-count">${notes.filter(n => n.isFavorite).length}</span>
    </div>
    <div class="folder-item ${activeFolderId === 'pinned' ? 'active' : ''}" onclick="selectFolder('pinned')">
      <div class="folder-item-left">
        <span class="folder-item-icon">📌</span>
        <span class="folder-item-name">Pinned</span>
      </div>
      <span class="folder-count">${notes.filter(n => n.isPinned).length}</span>
    </div>
    <div class="folder-item ${activeFolderId === 'all' ? 'active' : ''}" onclick="selectFolder('all')">
      <div class="folder-item-left">
        <span class="folder-item-icon">📁</span>
        <span class="folder-item-name">All Notes</span>
      </div>
      <span class="folder-count">${allCount}</span>
    </div>
  `;

  html += folders.map(f => {
    const count = notes.filter(n => n.folderId === f.id).length;
    const isDefault = f.id === 'personal' || f.id === 'work' || f.id === 'ideas';

    return `
      <div class="folder-item ${activeFolderId === f.id ? 'active' : ''}" onclick="selectFolder('${f.id}')">
        <div class="folder-item-left">
          <span class="folder-item-icon">${f.icon || '📂'}</span>
          <span class="folder-item-name">${escHtml(f.name)}</span>
        </div>
        <div class="folder-item-right">
          <span class="folder-count">${count}</span>
          ${!isDefault ? `<button class="folder-delete-btn" onclick="deleteFolder('${f.id}', event)" title="Delete Folder">✕</button>` : ''}
        </div>
      </div>
    `;
  }).join('');

  list.innerHTML = html;
}

function selectFolder(folderId) {
  activeFolderId = folderId;
  renderFoldersList();
  renderNotesList();
  
  // Close mobile sidebar drawer and return to list
  if (window.innerWidth <= 768) {
    setMobileView('list');
  }
}

function showFolderInput() {
  const list = document.getElementById('foldersList');
  if (!list) return;

  if (document.getElementById('newFolderInput')) {
    document.getElementById('newFolderInput').focus();
    return;
  }

  const item = document.createElement('div');
  item.className = 'folder-input-item';
  item.innerHTML = `
    <span class="folder-item-icon">📂</span>
    <input type="text" id="newFolderInput" placeholder="Folder name..." onblur="saveNewFolder()" onkeydown="handleFolderInputKey(event)" />
  `;
  list.appendChild(item);
  document.getElementById('newFolderInput').focus();
}

function saveNewFolder() {
  const input = document.getElementById('newFolderInput');
  if (!input) return;

  const name = input.value.trim();
  if (name) {
    // Check for duplicate names
    const exists = folders.some(f => f.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      showToast('⚠️', 'Folder name already exists', 'error');
      renderFoldersList();
      return;
    }

    const newFolder = {
      id: 'folder_' + Date.now().toString(),
      name: name,
      icon: '📂'
    };
    folders.push(newFolder);
    localStorage.setItem('echo_folders', JSON.stringify(folders));
    showToast('📂', `Folder "${name}" created!`, 'success');
  }
  renderFoldersList();
}

// Handler for keyboard event inside new folder input
function handleFolderInputKey(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    saveNewFolder();
  } else if (e.key === 'Escape') {
    e.preventDefault();
    renderFoldersList();
  }
}

function deleteFolder(folderId, e) {
  if (e) e.stopPropagation();

  if (folderId === 'personal' || folderId === 'work' || folderId === 'ideas') {
    showToast('⚠️', 'Default folders cannot be deleted', 'error');
    return;
  }

  openModal('Delete Folder', 'Are you sure? Notes in this folder will be uncategorized (but not deleted).', () => {
    folders = folders.filter(f => f.id !== folderId);
    localStorage.setItem('echo_folders', JSON.stringify(folders));

    // Clear folder association for notes in this folder
    notes.forEach(n => {
      if (n.folderId === folderId) {
        n.folderId = null;
      }
    });
    saveAll();

    if (activeFolderId === folderId) {
      activeFolderId = 'all';
    }

    renderFoldersList();
    renderNotesList();
    showToast('🗑️', 'Folder deleted', '');
  });
}

function populateFolderSelect(folderId) {
  const select = document.getElementById('noteFolderSelect');
  if (!select) return;
  select.innerHTML = folders.map(f => `<option value="${f.id}" ${f.id === folderId ? 'selected' : ''}>${escHtml(f.name)}</option>`).join('');
}

function changeNoteFolder() {
  if (!activeId) return;
  const select = document.getElementById('noteFolderSelect');
  const note = notes.find(n => n.id === activeId);
  if (note && select) {
    note.folderId = select.value;
    note.updated = new Date().toISOString();
    saveAll();
    renderFoldersList();
    renderNotesList();
    showToast('📂', 'Note moved', 'success');
  }
}

function updatePinFavoriteButtons() {
  const note = notes.find(n => n.id === activeId);
  if (!note) return;
  document.getElementById('pinBtn').classList.toggle('active', !!note.isPinned);
  document.getElementById('favBtn').classList.toggle('active', !!note.isFavorite);
}

function togglePin() {
  if (!activeId) return;
  const note = notes.find(n => n.id === activeId);
  if (note) {
    note.isPinned = !note.isPinned;
    saveAll();
    updatePinFavoriteButtons();
    renderNotesList();
    renderFoldersList();
  }
}

function toggleFavorite() {
  if (!activeId) return;
  const note = notes.find(n => n.id === activeId);
  if (note) {
    note.isFavorite = !note.isFavorite;
    saveAll();
    updatePinFavoriteButtons();
    renderNotesList();
    renderFoldersList();
  }
}

function handleTagInput(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    if (!activeId) return;
    const note = notes.find(n => n.id === activeId);
    if (!note) return;
    
    const val = e.target.value.trim();
    if (val) {
      if (!note.tags) note.tags = [];
      if (!note.tags.includes(val)) {
        note.tags.push(val);
        saveAll();
        renderTags();
      }
    }
    e.target.value = '';
  }
}

function removeTag(tag) {
  if (!activeId) return;
  const note = notes.find(n => n.id === activeId);
  if (note && note.tags) {
    note.tags = note.tags.filter(t => t !== tag);
    saveAll();
    renderTags();
  }
}

function renderTags() {
  const list = document.getElementById('tagsList');
  if (!list) return;
  const note = notes.find(n => n.id === activeId);
  if (!note || !note.tags) {
    list.innerHTML = '';
    return;
  }
  
  list.innerHTML = note.tags.map(t => `
    <div class="tag-pill">
      #${escHtml(t)}
      <button onclick="removeTag('${escHtml(t)}')">✕</button>
    </div>
  `).join('');
}

// ==========================================================================
// NOTE CREATION & LOADING
// ==========================================================================
function createNewNote() {
  // If active folder is not 'all', assign to active folder, else default to first folder
  let folderId = activeFolderId;
  if (folderId === 'all') {
    folderId = folders[0] ? folders[0].id : null;
  }

  const note = {
    id: Date.now().toString(),
    title: '',
    content: '',
    color: isDark ? '#f5f5f7' : '#1c1c1a',
    size: '16',
    folderId: folderId,
    created: new Date().toISOString(),
    updated: new Date().toISOString()
  };

  notes.unshift(note);
  saveAll();
  openNote(note.id);

  setTimeout(() => {
    const titleInput = document.getElementById('noteTitleInput');
    if (titleInput) titleInput.focus();
  }, 50);
}

function openNote(id) {
  activeId = id;
  const note = notes.find(n => n.id === id);
  if (!note) return;

  document.getElementById('welcomeScreen').style.display = 'none';

  const ew = document.getElementById('editorWrapper');
  ew.style.display = 'flex';

  document.getElementById('noteTitleInput').value = note.title || '';
  
  populateFolderSelect(note.folderId);
  updatePinFavoriteButtons();
  renderTags();
  
  const editor = document.getElementById('note-content');
  editor.innerHTML = convertPlainToHtml(note.content || '');
  
  // Apply formatting preferences (global text color and font size)
  editor.style.color = note.color || (isDark ? '#f5f5f7' : '#1c1c1a');
  editor.style.fontSize = (note.size || '16') + 'px';
  document.getElementById('textColorInput').value = note.color || (isDark ? '#f5f5f7' : '#1c1c1a');
  document.getElementById('fontSizeSelect').value = note.size || '16';

  updateWordCount();
  markSaved();
  renderNotesList();

  if (window.innerWidth > 768) {
    document.getElementById('noteTitleInput').focus();
  } else {
    setMobileView('editor');
  }
}

// ==========================================================================
// DEBOUNCED AUTOSAVE & ACTIONS
// ==========================================================================
function triggerAutosave() {
  markUnsaved();
  clearTimeout(autosaveTimeout);
  autosaveTimeout = setTimeout(() => {
    if (activeId && unsaved) {
      saveNoteSilently();
    }
  }, 1200); // Trigger saving 1.2s after inactivity
}

function saveNoteSilently() {
  if (!activeId) return;
  const note = notes.find(n => n.id === activeId);
  if (!note) return;

  note.title = document.getElementById('noteTitleInput').value.trim() || 'Untitled Note';
  note.content = document.getElementById('note-content').innerHTML;
  note.color = document.getElementById('textColorInput').value;
  note.size = document.getElementById('fontSizeSelect').value;
  note.updated = new Date().toISOString();

  saveAll();
  markSaved();
  renderNotesList();
  renderFoldersList();
}

function saveNote() {
  if (!activeId) return;
  saveNoteSilently();
  showToast('✅', 'Note saved!', 'success');
}

function deleteNote(id, e) {
  if (e) e.stopPropagation();
  const note = notes.find(n => n.id === id);
  const noteTitle = note ? (note.title || 'Untitled Note') : 'this note';

  openModal('Delete Note', `Are you sure you want to permanently delete "${noteTitle}"? This action cannot be undone.`, () => {
    notes = notes.filter(n => n.id !== id);
    saveAll();

    if (activeId === id) {
      activeId = null;
      document.getElementById('welcomeScreen').style.display = 'flex';
      document.getElementById('editorWrapper').style.display = 'none';
      if (window.innerWidth <= 768) {
        setMobileView('list');
      }
    }

    renderNotesList();
    renderFoldersList();
    showToast('🗑️', 'Note deleted', '');
  });
}

function confirmClear() {
  openModal('Clear Note', 'This will erase all content in the current editor. Continue?', () => {
    document.getElementById('note-content').innerHTML = '';
    document.getElementById('noteTitleInput').value = '';
    updateWordCount();
    triggerAutosave();
  });
}

function saveAll() {
  localStorage.setItem('echo_notes', JSON.stringify(notes));
}

// ==========================================================================
// RENDER NOTE LISTS & SEARCH
// ==========================================================================
function renderNotesList(filter = '') {
  const list = document.getElementById('notesList');
  const stats = document.getElementById('sidebarStats');
  if (!list || !stats) return;

  // 0. Sort by pinned first, then recently edited
  let sortedNotes = [...notes].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    return new Date(b.updated) - new Date(a.updated);
  });

  // 1. Filter by Folder
  let filtered = sortedNotes;
  if (activeFolderId === 'favorites') {
    filtered = sortedNotes.filter(n => n.isFavorite);
  } else if (activeFolderId === 'pinned') {
    filtered = sortedNotes.filter(n => n.isPinned);
  } else if (activeFolderId !== 'all') {
    filtered = sortedNotes.filter(n => n.folderId === activeFolderId);
  }

  // 2. Filter by Search Query (Realtime Title & Content match)
  const q = (filter || document.getElementById('searchInput').value).toLowerCase().trim();
  if (q) {
    filtered = filtered.filter(n => {
      const plainText = stripHtml(n.content || '').toLowerCase();
      const titleText = (n.title || '').toLowerCase();
      return titleText.includes(q) || plainText.includes(q);
    });
  }

  stats.textContent = `${filtered.length} note${filtered.length !== 1 ? 's' : ''}`;

  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="empty-notes">
        <div class="empty-icon">${q ? '🔍' : '🗒️'}</div>
        <p>${q ? 'No notes match your search.' : 'No notes yet. Click <strong>+ New Note</strong> to start!'}</p>
      </div>`;
    return;
  }

  list.innerHTML = filtered.map(n => {
    const preview = stripHtml(n.content || '');
    return `
      <div class="note-card ${n.id === activeId ? 'active' : ''}" onclick="openNote('${n.id}')">
        <div class="note-card-title">${escHtml(n.title || 'Untitled Note')}</div>
        <div class="note-card-preview">${escHtml(preview || 'No content…')}</div>
        <div class="note-card-footer">
          <div class="note-card-date">
            ${formatDate(n.updated)}
            <div class="note-indicators">
              ${n.isPinned ? '📌' : ''}
              ${n.isFavorite ? '⭐' : ''}
            </div>
          </div>
          <button class="note-delete-btn" onclick="deleteNote('${n.id}', event)" title="Delete note">✕</button>
        </div>
      </div>
    `;
  }).join('');
}

function filterNotes(q) {
  renderNotesList(q);
}

// ==========================================================================
// TYPOGRAPHY / COLOR SELECTIONS
// ==========================================================================
function applyTextColor(c) {
  document.getElementById('note-content').style.color = c;
  triggerAutosave();
}

// Function to apply selected font size to the editor content
function applyFontSize(s) {
  document.getElementById('note-content').style.fontSize = s + 'px';
  triggerAutosave();
}

// ==========================================================================
// PDF EXPORT
// ==========================================================================
function exportPDF() {
  if (!activeId) return;
  const title = document.getElementById('noteTitleInput').value || 'Untitled Note';
  const content = document.getElementById('note-content').innerText;

  if (!content.trim()) {
    showToast('⚠️', 'Note is empty!', 'error');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const marginL = 20, marginR = 20, marginT = 24;
  const pageW = doc.internal.pageSize.getWidth();
  const contentW = pageW - marginL - marginR;

  // Header band
  doc.setFillColor(194, 89, 37); // Terracotta Accent Color
  doc.rect(0, 0, pageW, 18, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Echo Notes', marginL, 12);

  // Note title
  doc.setTextColor(28, 28, 26);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(title, marginL, marginT + 10);

  // Export metadata
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(139, 139, 137);
  doc.text('Exported: ' + new Date().toLocaleString('en-IN'), marginL, marginT + 17);

  // Decorative Divider Line
  doc.setDrawColor(228, 228, 227);
  doc.line(marginL, marginT + 20, pageW - marginR, marginT + 20);

  // Render content
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(28, 28, 26);

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

function exportTXT() {
  if (!activeId) return;
  const note = notes.find(n => n.id === activeId);
  if (!note) return;
  
  const title = document.getElementById('noteTitleInput').value || 'Untitled Note';
  const content = document.getElementById('note-content').innerText;
  
  if (!content.trim()) {
    showToast('⚠️', 'Note is empty!', 'error');
    return;
  }
  
  const blob = new Blob([`${title}\n\n${content}`], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = (title.replace(/[^a-z0-9]/gi, '_') || 'note') + '.txt';
  a.click();
  URL.revokeObjectURL(url);
  showToast('📝', 'TXT exported!', 'success');
}

// ==========================================================================
// MOBILE RESPONSIBILITY & PANEL TOGGLES
// ==========================================================================
function setMobileView(view) {
  currentMobileView = view;
  document.body.setAttribute('data-mobile-view', view);
}

function toggleMobileSidebar() {
  setMobileView('sidebar');
}

function backToNotesList() {
  setMobileView('list');
}

// Dismiss mobile sidebar drawer on tap outside
document.body.addEventListener('click', (e) => {
  if (document.body.getAttribute('data-mobile-view') === 'sidebar') {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.querySelector('.mobile-menu-btn');
    if (sidebar && !sidebar.contains(e.target) && (!toggleBtn || !toggleBtn.contains(e.target))) {
      setMobileView('list');
    }
  }
});

// Distraction Free Writing Mode (Desktop Pane Collapse)
function toggleSidebar() {
  document.getElementById('appContainer').classList.toggle('distraction-free');
}

function toggleDistractionFree() {
  document.getElementById('appContainer').classList.add('distraction-free');
}

function exitDistractionFree() {
  document.getElementById('appContainer').classList.remove('distraction-free');
}

// ==========================================================================
// HELPERS
// ==========================================================================
function escHtml(s) {
  if (!s) return '';
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function stripHtml(html) {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

function convertPlainToHtml(text) {
  if (!text) return '';
  // If text does not contain HTML tags, convert newlines to linebreaks
  if (!/<[a-z][\s\S]*>/i.test(text)) {
    return text.replace(/\n/g, '<br>');
  }
  return text;
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

function markUnsaved() {
  unsaved = true;
  const dot = document.getElementById('statusDot');
  if (dot) dot.className = 'status-dot unsaved';
  const txt = document.getElementById('saveStatusText');
  if (txt) txt.textContent = 'Unsaved Changes';
}

function markSaved() {
  unsaved = false;
  const dot = document.getElementById('statusDot');
  if (dot) dot.className = 'status-dot saved';
  const txt = document.getElementById('saveStatusText');
  if (txt) txt.textContent = 'Saved';
}

function updateWordCount() {
  const txt = document.getElementById('note-content').innerText || '';
  const words = txt.trim() ? txt.trim().split(/\s+/).length : 0;
  document.getElementById('wordCount').textContent =
    `${words} word${words !== 1 ? 's' : ''} · ${txt.length} chars`;
}

// ==========================================================================
// TOAST NOTIFICATIONS
// ==========================================================================
let toastTimer;
function showToast(icon, msg, type) {
  const t = document.getElementById('toast');
  const tIcon = document.getElementById('toastIcon');
  const tMsg = document.getElementById('toastMsg');
  
  if (!t || !tIcon || !tMsg) return;
  
  tIcon.textContent = icon;
  tMsg.textContent = msg;
  t.className = 'toast show' + (type ? ' ' + type : '');
  
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.classList.remove('show'); }, 2400);
}

// ==========================================================================
// MODALS
// ==========================================================================
let modalCallback = null;

function openModal(title, msg, cb) {
  const mTitle = document.getElementById('modalTitle');
  const mMsg = document.getElementById('modalMsg');
  const mOverlay = document.getElementById('modalOverlay');

  if (!mTitle || !mMsg || !mOverlay) return;

  mTitle.textContent = title;
  mMsg.textContent = msg;
  modalCallback = cb;
  mOverlay.classList.add('show');
}

function closeModal() {
  const mOverlay = document.getElementById('modalOverlay');
  if (mOverlay) mOverlay.classList.remove('show');
}

document.getElementById('modalConfirmBtn').onclick = () => {
  closeModal();
  if (modalCallback) modalCallback();
};

document.getElementById('modalOverlay').onclick = (e) => {
  if (e.target === e.currentTarget) closeModal();
};

// ==========================================================================
// INTERFACE SYNC & TOOLBAR LISTENERS
// ==========================================================================

// Track and highlight active toolbar buttons for current selection
function checkActiveFormats() {
  const btns = document.querySelectorAll('.toolbar .format-btn');
  if (btns.length === 0) return;

  // Group 1: Basic styles
  if (btns[0]) btns[0].classList.toggle('active', document.queryCommandState('bold'));
  if (btns[1]) btns[1].classList.toggle('active', document.queryCommandState('italic'));
  if (btns[2]) btns[2].classList.toggle('active', document.queryCommandState('underline'));
  
  // Group 2: Headings & text
  const blockType = document.queryCommandValue('formatBlock');
  if (btns[3]) btns[3].classList.toggle('active', blockType === 'h3');
  if (btns[4]) btns[4].classList.toggle('active', blockType === 'h4');
  if (btns[5]) btns[5].classList.toggle('active', blockType === 'p' || (blockType !== 'h3' && blockType !== 'h4'));

  // Group 3: Lists
  if (btns[6]) btns[6].classList.toggle('active', document.queryCommandState('insertUnorderedList'));
  if (btns[7]) btns[7].classList.toggle('active', document.queryCommandState('insertOrderedList'));

  // Group 4: Alignments
  if (btns[8]) btns[8].classList.toggle('active', document.queryCommandState('justifyLeft'));
  if (btns[9]) btns[9].classList.toggle('active', document.queryCommandState('justifyCenter'));
  if (btns[10]) btns[10].classList.toggle('active', document.queryCommandState('justifyRight'));
  if (btns[11]) btns[11].classList.toggle('active', document.queryCommandState('justifyFull'));
}

// Sync formatting states when cursor position changes in editor
document.addEventListener('selectionchange', () => {
  const activeEl = document.activeElement;
  if (activeEl && activeEl.id === 'note-content') {
    checkActiveFormats();
  }
});

// Bind autosave and word counts to editor changes
document.getElementById('noteTitleInput').addEventListener('input', triggerAutosave);
document.getElementById('note-content').addEventListener('input', () => {
  updateWordCount();
  triggerAutosave();
});
document.getElementById('textColorInput').addEventListener('input', triggerAutosave);
document.getElementById('fontSizeSelect').addEventListener('change', triggerAutosave);

// ==========================================================================
// KEYBOARD SHORTCUTS
// ==========================================================================
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    saveNote();
  } else if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
    e.preventDefault();
    createNewNote();
  } else if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
    e.preventDefault();
    document.getElementById('searchInput').focus();
  } else if (e.altKey && e.key === 'p') {
    e.preventDefault();
    togglePin();
  }
});
