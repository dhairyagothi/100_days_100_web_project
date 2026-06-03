// ==========================================================================
// APPLICATION STATE
// ==========================================================================
let notes = JSON.parse(localStorage.getItem('echo_notes') || '[]');
let folders = JSON.parse(localStorage.getItem('echo_folders') || '[]');
let activeFilters = new Set();
const defaultFolders = [
  { id: 'personal', name: 'Personal', icon: '👤' },
  { id: 'work', name: 'Work', icon: '💼' },
  { id: 'ideas', name: 'Ideas', icon: '💡' }
];

  canRedo() {
    return this.historyIndex < this.history.length - 1;
  }
}

let activeFolderId = 'all';
let activeId = null;
let unsaved = false;
let isDark = localStorage.getItem('echo_theme') === 'dark';
let currentMobileView = 'list';
let autosaveTimeout = null;
let trashedNotes = JSON.parse(localStorage.getItem('echo_trash') || '[]');
let versionHistory = JSON.parse(localStorage.getItem('echo_versions') || '{}');
const MAX_VERSIONS = 10;

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

function updateCharAndWordCount() {
  const text = noteContent.innerText || "";
  charCount.textContent = text.length;
  const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
  wordCount.textContent = words || 0;
}

function updateHistoryButtons() {
  undoBtn.style.opacity = undoRedoManager.canUndo() ? "1" : "0.5";
  redoBtn.style.opacity = undoRedoManager.canRedo() ? "1" : "0.5";
}

function updateUndoRedoHistory() {
  undoRedoManager.save(noteContent.innerHTML);
  updateHistoryButtons();
  updateCharAndWordCount();
  saveNoteToLocal();
}

function showToast(message, type = "success") {
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

function markAsUnsaved() {
  savedIndicator.textContent = "● Unsaved changes";
  savedIndicator.classList.add("unsaved");
}

function markAsSaved() {
  savedIndicator.textContent = "✓ Saved";
  savedIndicator.classList.remove("unsaved");
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

  html += `
    <div class="folder-item ${activeFolderId === 'trash' ? 'active' : ''}" onclick="selectFolder('trash')">
      <div class="folder-item-left">
        <span class="folder-item-icon">🗑️</span>
        <span class="folder-item-name">Trash</span>
      </div>
      <span class="folder-count">${trashedNotes.length}</span>
    </div>
    <div class="folder-item" onclick="openAnalytics()">
      <div class="folder-item-left">
        <span class="folder-item-icon">📊</span>
        <span class="folder-item-name">Analytics</span>
      </div>
    </div>
    <div class="folder-item" onclick="openBackupRestore()">
      <div class="folder-item-left">
        <span class="folder-item-icon">☁️</span>
        <span class="folder-item-name">Backup & Restore</span>
      </div>
    </div>
  `;

  list.innerHTML = html;
  populateFolderFilter();
  
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

function getCaretCoordinates() {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return { x: 0, y: 0 };

  const range = selection.getRangeAt(0);
  const span = document.createElement("span");
  range.insertNode(span);
  const { top, left } = span.getBoundingClientRect();
  span.parentNode.removeChild(span);

  return { x: left, y: top };
}

function positionDropdown(dropdown, trigger) {
  const rect = trigger.getBoundingClientRect();
  dropdown.style.left = rect.left + "px";
  dropdown.style.top = rect.bottom + 10 + "px";
}

function hideAllDropdowns() {
  colorDropdown.classList.remove("visible");
  highlightDropdown.classList.remove("visible");
  sizeDropdown.classList.remove("visible");
  shapesDropdown.classList.remove("visible");
  shapeColorDropdown.classList.remove("visible");
}

/* ============================================
   FORMATTING FUNCTIONS
   ============================================ */

function applyFormat(command, value = null) {
  document.execCommand(command, false, value);
  noteContent.focus();
  updateUndoRedoHistory();
}

function formatSelectedText(tag, styles = {}) {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) {
    showToast("Select text first!", "warning");
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

  if (!selectedText) {
    showToast("Please select text to highlight", "warning");
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

  if (highlight === "none") {
    const span = document.createElement("span");
    span.textContent = selectedText;
    range.deleteContents();
    range.insertNode(span);
  } else {
    const mark = document.createElement("mark");
    mark.style.backgroundColor = e.target.style.backgroundColor;
    mark.textContent = selectedText;
    range.deleteContents();
    range.insertNode(mark);
  }

  updateUndoRedoHistory();
  hideAllDropdowns();
  showToast("Highlight applied");
});
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
  // Save version snapshot
  if (!versionHistory[note.id]) versionHistory[note.id] = [];
  versionHistory[note.id].unshift({
    title: note.title,
    content: note.content,
    savedAt: new Date().toISOString()
  });
  // Keep only last MAX_VERSIONS
  versionHistory[note.id] = versionHistory[note.id].slice(0, MAX_VERSIONS);
  localStorage.setItem('echo_versions', JSON.stringify(versionHistory));

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
    const noteToTrash = notes.find(n => n.id === id);
    if (noteToTrash) {
      noteToTrash.deletedAt = new Date().toISOString();
      trashedNotes.unshift(noteToTrash);
      localStorage.setItem('echo_trash', JSON.stringify(trashedNotes));
    }
    notes = notes.filter(n => n.id !== id);
    saveAll();

/* ============================================
   TEXT SIZE
   ============================================ */

changeSizeBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  hideAllDropdowns();
  positionDropdown(sizeDropdown, changeSizeBtn);
  sizeDropdown.classList.toggle("visible");
});

sizeDropdown.addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON") return;

  const size = e.target.dataset.size;
  formatSelectedText("span", { fontSize: size });
  hideAllDropdowns();
  showToast(`Size: ${size}`);
});

/* ============================================
   UNDO/REDO
   ============================================ */

undoBtn.addEventListener("click", () => {
  const previousContent = undoRedoManager.undo();
  if (previousContent !== null) {
    noteContent.innerHTML = previousContent;
    updateCharAndWordCount();
    updateHistoryButtons();
    showToast("Undo");
  // 1. Filter by Folder
  let filtered = sortedNotes;
  if (activeFolderId === 'trash') {
  stats.textContent = `${trashedNotes.length} deleted note${trashedNotes.length !== 1 ? 's' : ''}`;
  list.innerHTML = trashedNotes.length === 0
    ? `<div class="empty-notes"><div class="empty-icon">🗑️</div><p>Trash is empty.</p></div>`
    : trashedNotes.map(n => `
        <div class="note-card">
          <div class="note-card-title">${escHtml(n.title || 'Untitled Note')}</div>
          <div class="note-card-preview">${escHtml(stripHtml(n.content || ''))}</div>
          <div class="note-card-footer">
            <div class="note-card-date">Deleted: ${formatDate(n.deletedAt)}</div>
            <div style="display:flex;gap:6px;">
              <button class="editor-action-btn" style="height:26px;font-size:11px;" onclick="restoreNote('${n.id}')">↩ Restore</button>
              <button class="editor-action-btn danger icon-btn" style="height:26px;" onclick="permanentDelete('${n.id}')">✕</button>
            </div>
          </div>
        </div>`).join('');
  return;
}
  if (activeFolderId === 'favorites') {
    filtered = sortedNotes.filter(n => n.isFavorite);
  } else if (activeFolderId === 'pinned') {
    filtered = sortedNotes.filter(n => n.isPinned);
  } else if (activeFolderId !== 'all') {
    filtered = sortedNotes.filter(n => n.folderId === activeFolderId);
  }
});

redoBtn.addEventListener("click", () => {
  const nextContent = undoRedoManager.redo();
  if (nextContent !== null) {
    noteContent.innerHTML = nextContent;
    updateCharAndWordCount();
    updateHistoryButtons();
    showToast("Redo");
  }
});
  // Advanced filters
if (activeFilters.has('favorites')) filtered = filtered.filter(n => n.isFavorite);
if (activeFilters.has('pinned')) filtered = filtered.filter(n => n.isPinned);
const folderFilter = document.getElementById('folderFilter')?.value;
if (folderFilter) filtered = filtered.filter(n => n.folderId === folderFilter);
// Tag search: if query starts with #
if (q.startsWith('#')) {
  const tag = q.slice(1).toLowerCase();
  filtered = filtered.filter(n => n.tags && n.tags.some(t => t.toLowerCase().includes(tag)));
}

/* ============================================
   SAVE AS PDF
   ============================================ */

saveNoteBtn.addEventListener("click", async () => {
  if (!noteTitle.value && !noteContent.innerText) {
    showToast("No content to save!", "error");
    return;
  }

  try {
    saveNoteBtn.style.opacity = "0.5";
    const noteSection = document.querySelector(".note-paper");
    const canvas = await html2canvas(noteSection, {
      scale: 2,
      backgroundColor: "#ffffff",
    });
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


function toggleFilter(type) {
  activeFilters.has(type) ? activeFilters.delete(type) : activeFilters.add(type);
  renderNotesList(document.getElementById('searchInput').value);
}

// Populate folder filter dropdown
function populateFolderFilter() {
  const sel = document.getElementById('folderFilter');
  if (!sel) return;
  sel.innerHTML = `<option value="">All Folders</option>` +
    folders.map(f => `<option value="${f.id}">${escHtml(f.name)}</option>`).join('');
}
// ==========================================================================
// TYPOGRAPHY / COLOR SELECTIONS
// ==========================================================================
function applyTextColor(c) {
  document.getElementById('note-content').style.color = c;
  triggerAutosave();
}

    const imgData = canvas.toDataURL("image/png");
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "pt", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth - 40;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 20, 20, imgWidth, imgHeight);

    const fileName = noteTitle.value
      ? `${noteTitle.value}.pdf`
      : "MyNote.pdf";
    pdf.save(fileName);

    showToast("PDF saved successfully!");
  } catch (error) {
    showToast("Failed to save PDF", "error");
    console.error(error);
  } finally {
    saveNoteBtn.style.opacity = "1";
  }
});

/* ============================================
   CLEAR NOTE
   ============================================ */

clearNoteBtn.addEventListener("click", () => {
  if (confirm("🤔 Are you sure? This action cannot be undone.")) {
    noteTitle.value = "";
    noteContent.innerHTML = "";
    localStorage.removeItem("myNote");
    undoRedoManager.history = [];
    undoRedoManager.historyIndex = -1;
    updateCharAndWordCount();
    updateHistoryButtons();
    showToast("Note cleared");
  }
});

/* ============================================
   LOCAL STORAGE
   ============================================ */

let autoSaveTimeout;

function saveNoteToLocal() {
  markAsUnsaved();
  clearTimeout(autoSaveTimeout);

  autoSaveTimeout = setTimeout(() => {
    const noteData = {
      title: noteTitle.value,
      content: noteContent.innerHTML,
    };
    localStorage.setItem("myNote", JSON.stringify(noteData));
    markAsSaved();
  }, 1000);
}

function loadNoteFromLocal() {
  const saved = localStorage.getItem("myNote");
  if (saved) {
    try {
      const noteData = JSON.parse(saved);
      noteTitle.value = noteData.title || "";
      noteContent.innerHTML = noteData.content || "";
      undoRedoManager.save(noteContent.innerHTML);
      updateCharAndWordCount();
      markAsSaved();
    } catch (error) {
      console.error("Error loading note:", error);
    }
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
function restoreNote(id) {
  const note = trashedNotes.find(n => n.id === id);
  if (!note) return;
  delete note.deletedAt;
  notes.unshift(note);
  trashedNotes = trashedNotes.filter(n => n.id !== id);
  localStorage.setItem('echo_trash', JSON.stringify(trashedNotes));
  saveAll();
  renderFoldersList();
  renderNotesList();
  showToast('↩', 'Note restored!', 'success');
}

function permanentDelete(id) {
  openModal('Permanently Delete', 'This cannot be undone. Delete forever?', () => {
    trashedNotes = trashedNotes.filter(n => n.id !== id);
    localStorage.setItem('echo_trash', JSON.stringify(trashedNotes));
    renderFoldersList();
    renderNotesList();
    showToast('🗑️', 'Permanently deleted', '');
  });
}

// ===================== VERSION HISTORY =====================
function openVersionHistory() {
  if (!activeId) return showToast('⚠️', 'Open a note first', 'error');
  const versions = versionHistory[activeId] || [];
  const note = notes.find(n => n.id === activeId);
  document.getElementById('versionModalSub').textContent =
    `${versions.length} saved version${versions.length !== 1 ? 's' : ''} for "${note?.title || 'Untitled'}"`;
  document.getElementById('versionList').innerHTML = versions.length === 0
    ? '<p style="color:var(--text-tertiary);font-size:13px;">No versions saved yet. Versions are saved automatically.</p>'
    : versions.map((v, i) => `
        <div style="border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px;margin-bottom:8px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:13px;font-weight:600;color:var(--text-primary);">
              ${i === 0 ? '⭐ Latest — ' : ''}${v.title || 'Untitled'}
            </span>
            <span style="font-size:11px;color:var(--text-tertiary);">${formatDate(v.savedAt)}</span>
          </div>
          <div style="font-size:12px;color:var(--text-secondary);margin-top:4px;overflow:hidden;max-height:40px;">
            ${escHtml(stripHtml(v.content || '').slice(0, 120))}...
          </div>
          ${i > 0 ? `<button class="btn" style="margin-top:8px;height:28px;font-size:12px;" onclick="restoreVersion(${i})">↩ Restore this version</button>` : ''}
        </div>`).join('');
  document.getElementById('versionModal').classList.add('show');
}

function restoreVersion(index) {
  if (!activeId) return;
  const v = (versionHistory[activeId] || [])[index];
  if (!v) return;
  openModal('Restore Version', 'This will overwrite your current note content. Continue?', () => {
    document.getElementById('noteTitleInput').value = v.title || '';
    document.getElementById('note-content').innerHTML = v.content || '';
    updateWordCount();
    triggerAutosave();
    closeVersionModal();
    showToast('↩', 'Version restored!', 'success');
  });
}

function closeVersionModal() {
  document.getElementById('versionModal').classList.remove('show');
}

// ===================== ANALYTICS =====================
function openAnalytics() {
  const total = notes.length;
  const totalWords = notes.reduce((sum, n) => {
    const txt = stripHtml(n.content || '').trim();
    return sum + (txt ? txt.split(/\s+/).length : 0);
  }, 0);
  const avgWords = total ? Math.round(totalWords / total) : 0;

  const folderCounts = {};
  folders.forEach(f => { folderCounts[f.name] = notes.filter(n => n.folderId === f.id).length; });
  const topFolder = Object.entries(folderCounts).sort((a,b) => b[1]-a[1])[0];

  const now = new Date();
  const last7 = notes.filter(n => (now - new Date(n.created)) < 7*86400000).length;
  const last30 = notes.filter(n => (now - new Date(n.created)) < 30*86400000).length;

  const colors = ['#5B5BD6','#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6'];
  const maxFolderCount = Math.max(...Object.values(folderCounts), 1);

  document.getElementById('analyticsContent').innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
      ${[
        ['📝','Total Notes', total],
        ['📖','Total Words', totalWords.toLocaleString()],
        ['📏','Avg Words/Note', avgWords],
        ['⭐','Favorites', notes.filter(n=>n.isFavorite).length],
        ['📌','Pinned', notes.filter(n=>n.isPinned).length],
        ['🗑️','In Trash', trashedNotes.length]
      ].map(([icon, label, val]) => `
        <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md);padding:16px;text-align:center;">
          <div style="font-size:1.5rem;">${icon}</div>
          <div style="font-size:1.4rem;font-weight:800;color:var(--text-primary);margin:4px 0;">${val}</div>
          <div style="font-size:11px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.05em;">${label}</div>
        </div>`).join('')}
    </div>
    <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md);padding:16px;margin-bottom:12px;">
      <div style="font-size:13px;font-weight:700;margin-bottom:12px;">📅 Notes Created</div>
      <div style="display:flex;gap:16px;">
        <span style="font-size:13px;color:var(--text-secondary);">Last 7 days: <strong style="color:var(--text-primary);">${last7}</strong></span>
        <span style="font-size:13px;color:var(--text-secondary);">Last 30 days: <strong style="color:var(--text-primary);">${last30}</strong></span>
      </div>
    </div>
    <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md);padding:16px;">
      <div style="font-size:13px;font-weight:700;margin-bottom:12px;">📁 Notes per Folder</div>
      ${Object.entries(folderCounts).map(([name, count], i) => `
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
          <span style="width:80px;font-size:12px;color:var(--text-secondary);text-align:right;">${name}</span>
          <div style="flex:1;background:var(--bg-app);border-radius:99px;height:18px;overflow:hidden;">
            <div style="height:100%;border-radius:99px;background:${colors[i%colors.length]};width:${Math.max(4,(count/maxFolderCount)*100).toFixed(1)}%;transition:width 0.5s ease;display:flex;align-items:center;padding-left:6px;">
              <span style="font-size:10px;font-weight:700;color:#fff;">${count}</span>
            </div>
          </div>
        </div>`).join('')}
      ${topFolder ? `<div style="margin-top:10px;font-size:12px;color:var(--text-tertiary);">🏆 Most active: <strong style="color:var(--text-primary);">${topFolder[0]}</strong> (${topFolder[1]} notes)</div>` : ''}
    </div>`;
  document.getElementById('analyticsModal').classList.add('show');
}

function closeAnalytics() {
  document.getElementById('analyticsModal').classList.remove('show');
}

// ===================== BACKUP & RESTORE =====================
function openBackupRestore() {
  document.getElementById('backupModal').classList.add('show');
}

function closeBackupModal() {
  document.getElementById('backupModal').classList.remove('show');
}

function exportBackup() {
  const backup = {
    exportedAt: new Date().toISOString(),
    notes, folders, trashedNotes, versionHistory
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `echonotes-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('⬇️', 'Backup exported!', 'success');
}

function importBackup(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      openModal('Restore Backup', 'This will replace all current notes, folders, and history. Continue?', () => {
        if (data.notes) { notes = data.notes; localStorage.setItem('echo_notes', JSON.stringify(notes)); }
        if (data.folders) { folders = data.folders; localStorage.setItem('echo_folders', JSON.stringify(folders)); }
        if (data.trashedNotes) { trashedNotes = data.trashedNotes; localStorage.setItem('echo_trash', JSON.stringify(trashedNotes)); }
        if (data.versionHistory) { versionHistory = data.versionHistory; localStorage.setItem('echo_versions', JSON.stringify(versionHistory)); }
        renderFoldersList();
        renderNotesList();
        closeBackupModal();
        showToast('⬆️', 'Workspace restored!', 'success');
      });
    } catch {
      showToast('⚠️', 'Invalid backup file', 'error');
    }
  };
  reader.readAsText(file);
}
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
