/* ============================================
   ELEMENTS
   ============================================ */

const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const charCount = document.getElementById("charCount");
const wordCount = document.getElementById("wordCount");
const savedIndicator = document.getElementById("savedIndicator");
const toast = document.getElementById("toast");

// Dropdown Elements
const colorDropdown = document.getElementById("colorDropdown");
const highlightDropdown = document.getElementById("highlightDropdown");
const sizeDropdown = document.getElementById("sizeDropdown");
const shapesDropdown = document.getElementById("shapesDropdown");
const shapeColorDropdown = document.getElementById("shapeColorDropdown");

// Button Elements
const boldBtn = document.getElementById("boldBtn");
const italicBtn = document.getElementById("italicBtn");
const underlineBtn = document.getElementById("underlineBtn");
const changeColorBtn = document.getElementById("changeColorBtn");
const highlightBtn = document.getElementById("highlightBtn");
const changeSizeBtn = document.getElementById("changeSizeBtn");
const shapesBtn = document.getElementById("shapesBtn");
const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");
const saveNoteBtn = document.getElementById("saveNoteBtn");
const clearNoteBtn = document.getElementById("clearNoteBtn");

/* ============================================
   UNDO/REDO SYSTEM
   ============================================ */

class UndoRedoManager {
  constructor() {
    this.history = [];
    this.historyIndex = -1;
    this.maxHistorySize = 50;
  }

  save(content) {
    this.historyIndex++;
    if (this.historyIndex < this.history.length) {
      this.history = this.history.slice(0, this.historyIndex);
    }
    this.history.push(content);
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
      this.historyIndex--;
    }
    updateHistoryButtons();
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      return this.history[this.historyIndex];
    }
    return null;
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      return this.history[this.historyIndex];
    }
    return null;
  }

  canUndo() {
    return this.historyIndex > 0;
  }

  canRedo() {
    return this.historyIndex < this.history.length - 1;
  }
}

const undoRedoManager = new UndoRedoManager();

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
