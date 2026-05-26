(() => {
  const notesContainer = document.getElementById('notesContainer');
  const addBtn = document.querySelector('.add-btn');
  const statusEl = document.getElementById('saveStatus');

  let notes = JSON.parse(localStorage.getItem('notes')) || [];

  // migrate legacy string-array notes to objects
  if (notes.length && typeof notes[0] === 'string') {
    notes = notes.map(text => ({ text, createdAt: Date.now(), updatedAt: Date.now() }));
    saveToLocalStorage();
  }

  function saveToLocalStorage() {
    localStorage.setItem('notes', JSON.stringify(notes));
  }

  function debounce(fn, wait = 400) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
  }

  function showStatus(message = '') {
    if (!statusEl) return;
    statusEl.textContent = message;
    if (message) setTimeout(() => { if (statusEl.textContent === message) statusEl.textContent = ''; }, 1200);
  }

  function renderNotes() {
    notesContainer.innerHTML = '';

    notes.forEach((note, index) => {
      const noteDiv = document.createElement('div');
      noteDiv.className = 'note';

      const textarea = document.createElement('textarea');
      textarea.value = note.text || '';
      textarea.setAttribute('aria-label', `Note ${index + 1}`);

      const meta = document.createElement('div');
      meta.className = 'note-meta';
      const updated = note.updatedAt ? new Date(note.updatedAt).toLocaleString() : new Date().toLocaleString();
      meta.textContent = `Updated: ${updated}`;

      const buttons = document.createElement('div');
      buttons.className = 'note-buttons';

      const saveBtn = document.createElement('button');
      saveBtn.type = 'button';
      saveBtn.className = 'save-btn';
      saveBtn.textContent = 'Save';
      saveBtn.addEventListener('click', () => {
        saveToLocalStorage();
        showStatus('Saved');
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => {
        if (confirm('Delete this note?')) {
          deleteNote(index);
          showStatus('Deleted');
        }
      });

      // Autosave on input (debounced)
      const onInput = debounce((e) => {
        updateNote(index, e.target.value);
        meta.textContent = `Updated: ${new Date(notes[index].updatedAt).toLocaleString()}`;
        showStatus('Saved');
      }, 600);
      textarea.addEventListener('input', onInput);

      buttons.appendChild(saveBtn);
      buttons.appendChild(deleteBtn);

      noteDiv.appendChild(textarea);
      noteDiv.appendChild(meta);
      noteDiv.appendChild(buttons);

      notesContainer.appendChild(noteDiv);
    });
  }

  function addNote() {
    // add to start so new note appears first
    const now = Date.now();
    notes.unshift({ text: '', createdAt: now, updatedAt: now });
    saveToLocalStorage();
    renderNotes();
    const firstTextarea = notesContainer.querySelector('textarea');
    if (firstTextarea) firstTextarea.focus();
    showStatus('Added');
  }

  function updateNote(index, value) {
    if (!notes[index]) return;
    notes[index].text = value;
    notes[index].updatedAt = Date.now();
    saveToLocalStorage();
  }

  function deleteNote(index) {
    notes.splice(index, 1);
    saveToLocalStorage();
    renderNotes();
  }

  // wire up add button
  if (addBtn) {
    addBtn.addEventListener('click', addNote);
    addBtn.type = 'button';
  }

  // initial render
  renderNotes();

  // expose nothing to global scope
})();