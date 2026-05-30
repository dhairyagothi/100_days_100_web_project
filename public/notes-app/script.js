const noteModal = document.getElementById('noteModal');
const overlay = document.getElementById('overlay');
const newNoteBtn = document.getElementById('newNoteBtn');
const emptyAddBtn = document.getElementById('emptyAddBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
const noteForm = document.getElementById('noteForm');
const noteTitle = document.getElementById('noteTitle');
const noteContent = document.getElementById('noteContent');
const noteTag = document.getElementById('noteTag');
const notesGrid = document.getElementById('notesGrid');
const searchInput = document.getElementById('searchInput');
const noteCount = document.getElementById('noteCount');
const activeCount = document.getElementById('activeCount');
const emptyState = document.getElementById('emptyState');
const toast = document.getElementById('toast');
const modalTitle = document.getElementById('modalTitle');

let notes = JSON.parse(localStorage.getItem('notes') || '[]');
let editingNoteId = null;

function saveNotes() {
  localStorage.setItem('notes', JSON.stringify(notes));
}

function formatTimestamp(value) {
  const date = new Date(value);
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function openModal(editNote = null) {
  noteModal.classList.add('open');
  overlay.hidden = false;
  overlay.classList.add('visible');
  noteModal.setAttribute('aria-hidden', 'false');
  noteTitle.focus();

  if (editNote) {
    modalTitle.textContent = 'Edit note';
    noteTitle.value = editNote.title;
    noteContent.value = editNote.content;
    noteTag.value = editNote.tag;
    editingNoteId = editNote.id;
  } else {
    modalTitle.textContent = 'New note';
    noteTitle.value = '';
    noteContent.value = '';
    noteTag.value = 'Personal';
    editingNoteId = null;
  }
}

function closeModal() {
  noteModal.classList.remove('open');
  overlay.classList.remove('visible');
  overlay.hidden = true;
  noteModal.setAttribute('aria-hidden', 'true');
  noteForm.reset();
  editingNoteId = null;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

function getFilteredNotes() {
  const query = searchInput.value.trim().toLowerCase();
  return notes.filter((note) => {
    if (!note || note.trash) return false;
    const titleMatch = note.title.toLowerCase().includes(query);
    const contentMatch = note.content.toLowerCase().includes(query);
    const tagMatch = note.tag.toLowerCase().includes(query);
    return query === '' || titleMatch || contentMatch || tagMatch;
  });
}

function renderNotes() {
  const visibleNotes = getFilteredNotes();
  notesGrid.innerHTML = '';

  if (visibleNotes.length === 0) {
    emptyState.style.display = 'block';
    notesGrid.style.display = 'none';
  } else {
    emptyState.style.display = 'none';
    notesGrid.style.display = 'grid';
    visibleNotes.forEach((note) => {
      const article = document.createElement('article');
      article.className = 'note-card';
      article.dataset.id = note.id;
      article.innerHTML = `
        <div class="note-meta">
          <span class="note-tag">${note.tag}</span>
          <span class="note-date">${formatTimestamp(note.createdAt)}</span>
        </div>
        <div>
          <h2 class="note-title">${note.title}</h2>
          <p class="note-content">${note.content.replace(/\n/g, '<br>')}</p>
        </div>
        <div class="note-actions">
          <button class="secondary-btn edit-btn" type="button" data-action="edit">Edit</button>
          <button class="secondary-btn delete-btn" type="button" data-action="delete">Delete</button>
        </div>
      `;
      notesGrid.appendChild(article);
    });
  }

  const totalNotes = notes.filter((note) => note && !note.trash).length;
  noteCount.textContent = `${totalNotes} note${totalNotes === 1 ? '' : 's'}`;
  activeCount.textContent = `${visibleNotes.length} visible`;
}

function handleSave(event) {
  event.preventDefault();
  const titleValue = noteTitle.value.trim();
  const contentValue = noteContent.value.trim();
  const tagValue = noteTag.value;

  if (!titleValue || !contentValue) {
    showToast('Please add a title and content.');
    return;
  }

  if (editingNoteId) {
    notes = notes.map((note) => {
      if (note.id === editingNoteId) {
        return {
          ...note,
          title: titleValue,
          content: contentValue,
          tag: tagValue,
          updatedAt: new Date().toISOString(),
        };
      }
      return note;
    });
    saveNotes();
    showToast('Note updated successfully');
  } else {
    const newNote = {
      id: Date.now(),
      title: titleValue,
      content: contentValue,
      tag: tagValue,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      trash: false,
    };
    notes.unshift(newNote);
    saveNotes();
    showToast('Note created successfully');
  }

  closeModal();
  renderNotes();
}

function handleNotesGridClick(event) {
  const button = event.target.closest('button');
  if (!button) return;
  const article = event.target.closest('.note-card');
  if (!article) return;
  const noteId = Number(article.dataset.id);
  const noteItem = notes.find((note) => note.id === noteId);
  if (!noteItem) return;

  if (button.dataset.action === 'edit') {
    openModal(noteItem);
  }

  if (button.dataset.action === 'delete') {
    notes = notes.filter((note) => note.id !== noteId);
    saveNotes();
    renderNotes();
    showToast('Note deleted');
  }
}

function closeModalOnOverlay(event) {
  if (event.target === overlay) {
    closeModal();
  }
}

newNoteBtn.addEventListener('click', () => openModal());
emptyAddBtn.addEventListener('click', () => openModal());
closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModalOnOverlay);
searchInput.addEventListener('input', renderNotes);
noteForm.addEventListener('submit', handleSave);
notesGrid.addEventListener('click', handleNotesGridClick);

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && noteModal.classList.contains('open')) {
    closeModal();
  }
});

renderNotes();
