// --- INITIAL STATE / DUMMY DATA ---
const DEFAULT_FOLDERS = [];
const DEFAULT_NOTES = [];

// --- APP STATE ---
let folders = [];
let notes = [];
let calendarTasks = [];
let activeFolderId = null; // Currently clicked folder filter
let currentView = 'all'; // all, calendar, archive, trash
let activeNotesFilter = 'today'; // today, week, month
let activeFoldersFilter = 'week'; // all, week, month
let searchQuery = '';

// Current date defaults
const currentDate = new Date();
let displayYear = currentDate.getFullYear();
let displayMonth = currentDate.getMonth(); // 0-indexed

// Calendar state month tracking (syncs with main display)
let calYear = currentDate.getFullYear();
let calMonth = currentDate.getMonth();

// --- DOM CACHE ---
const sidebar = document.getElementById('sidebar');
const mobileToggle = document.getElementById('mobile-toggle');
const workspaceTitleDisplay = document.getElementById(
  'workspace-title-display'
);
const searchInput = document.getElementById('search-input');
const headerSettingsBtn = document.getElementById('header-settings-btn');

const foldersSection = document.getElementById('folders-section');
const foldersGrid = document.getElementById('folders-grid');
const foldersFilterTabs = document.getElementById('folders-filter-tabs');

const notesSection = document.getElementById('notes-section');
const notesGrid = document.getElementById('notes-grid');
const notesFilterTabs = document.getElementById('notes-filter-tabs');
const notesTitleHeading = document.getElementById('notes-title-heading');

const monthSelectorWidget = document.getElementById('month-selector-widget');
const monthDisplay = document.getElementById('month-display');
const prevMonthBtn = document.getElementById('prev-month-btn');
const nextMonthBtn = document.getElementById('next-month-btn');

const calendarSection = document.getElementById('calendar-section');
const calMonthTitle = document.getElementById('cal-month-title');
const calPrevMonth = document.getElementById('cal-prev-month');
const calNextMonth = document.getElementById('cal-next-month');
const calendarDaysGrid = document.getElementById('calendar-days-grid');

// Sidebar Nav Buttons
const navAllNotes = document.getElementById('nav-all-notes');
const navCalendar = document.getElementById('nav-calendar');
const navArchive = document.getElementById('nav-archive');
const navTrash = document.getElementById('nav-trash');

// Dropdowns & Promos
const addDropdownMenu = document.getElementById('add-dropdown-menu');
const addNewTrigger = document.getElementById('add-new-trigger');
const newFolderMenuItem = document.getElementById('new-folder-menu-item');
const newNoteMenuItem = document.getElementById('new-note-menu-item');
// Modals overlays
const folderModal = document.getElementById('folder-modal');
const noteModal = document.getElementById('note-modal');
const viewNoteModal = document.getElementById('view-note-modal');

// Folder Form elements
const folderForm = document.getElementById('folder-form');
const folderNameInput = document.getElementById('folder-name-input');
const closeFolderModal = document.getElementById('close-folder-modal');
const cancelFolderBtn = document.getElementById('cancel-folder-btn');

// Note Form elements
const noteForm = document.getElementById('note-form');
const noteModalTitle = document.getElementById('note-modal-title');
const editNoteId = document.getElementById('edit-note-id');
const noteTitleInput = document.getElementById('note-title-input');
const noteFolderSelect = document.getElementById('note-folder-select');
const noteContentInput = document.getElementById('note-content-input');
const noteTimeInput = document.getElementById('note-time-input');
const noteDaySelect = document.getElementById('note-day-select');
const closeNoteModal = document.getElementById('close-note-modal');
const cancelNoteBtn = document.getElementById('cancel-note-btn');

// Note Details view elements
const viewCardColor = document.getElementById('view-card-color');
const viewNoteTitle = document.getElementById('view-note-title');
const viewNoteFolder = document.getElementById('view-note-folder');
const viewNoteDate = document.getElementById('view-note-date');
const viewReminderText = document.getElementById('view-reminder-text');
const viewNoteContentText = document.getElementById('view-note-content-text');
const viewEditBtn = document.getElementById('view-edit-btn');
const viewArchiveBtn = document.getElementById('view-archive-btn');
const viewDeleteBtn = document.getElementById('view-delete-btn');
const closeViewNoteModal = document.getElementById('close-view-note-modal');

// Theme Dots color selectors
const themeColorDots = document.querySelectorAll(
  '.color-indicators .color-dot'
);

// --- DATABASE LOGIC (LOCAL STORAGE) ---
function loadData() {
  // Reset database for a fresh site with no dummy mock data
  if (!localStorage.getItem('mino_empty_reset_v3')) {
    localStorage.removeItem('mino_folders');
    localStorage.removeItem('mino_notes');
    localStorage.removeItem('mino_calendar_tasks');
    localStorage.setItem('mino_empty_reset_v3', 'true');
  }

  const storedFolders = localStorage.getItem('mino_folders');
  const storedNotes = localStorage.getItem('mino_notes');
  const storedTasks = localStorage.getItem('mino_calendar_tasks');

  if (storedFolders) {
    folders = JSON.parse(storedFolders);
  } else {
    folders = [...DEFAULT_FOLDERS];
    saveFolders();
  }

  if (storedNotes) {
    notes = JSON.parse(storedNotes);
  } else {
    notes = [...DEFAULT_NOTES];
    saveNotes();
  }

  if (storedTasks) {
    calendarTasks = JSON.parse(storedTasks);
  } else {
    // Seed default tasks for the current calendar month
    const currentMonthKey = `${calYear}-${String(calMonth + 1).padStart(2, '0')}`;
    calendarTasks = [
      {
        id: 'task-1',
        monthKey: currentMonthKey,
        text: 'grocery shopping',
        completed: false,
      },
      {
        id: 'task-2',
        monthKey: currentMonthKey,
        text: 'dinner with Mark',
        completed: false,
      },
      {
        id: 'task-3',
        monthKey: currentMonthKey,
        text: 'read book',
        completed: true,
      },
      {
        id: 'task-4',
        monthKey: currentMonthKey,
        text: 'edit video',
        completed: true,
      },
      {
        id: 'task-5',
        monthKey: currentMonthKey,
        text: 'go to gym 7pm',
        completed: false,
      },
      {
        id: 'task-6',
        monthKey: currentMonthKey,
        text: 'morning yoga',
        completed: true,
      },
      {
        id: 'task-7',
        monthKey: currentMonthKey,
        text: 'publish blog post',
        completed: false,
      },
    ];
    saveCalendarTasks();
  }
}

function saveFolders() {
  localStorage.setItem('mino_folders', JSON.stringify(folders));
}

function saveNotes() {
  localStorage.setItem('mino_notes', JSON.stringify(notes));
}

function saveCalendarTasks() {
  localStorage.setItem('mino_calendar_tasks', JSON.stringify(calendarTasks));
}

// --- CALENDAR RENDER ENGINE ---
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function renderCalendar() {
  calMonthTitle.textContent = `${MONTH_NAMES[calMonth]} ${calYear}`;

  // Left column titles
  const calLeftMonthName = document.getElementById('cal-left-month-name');
  if (calLeftMonthName)
    calLeftMonthName.textContent = MONTH_NAMES[calMonth].toUpperCase();
  const calLeftYearDisplay = document.getElementById('cal-left-year-display');
  if (calLeftYearDisplay) calLeftYearDisplay.textContent = `♥ ${calYear} ♥`;

  // Left column checklist notes
  const checklistUl = document.getElementById('calendar-checklist-ul');
  if (checklistUl) {
    checklistUl.innerHTML = '';

    const currentMonthKey = `${calYear}-${String(calMonth + 1).padStart(2, '0')}`;
    const monthTasks = calendarTasks.filter(
      (t) => t.monthKey === currentMonthKey
    );

    // Render existing tasks
    monthTasks.forEach((task) => {
      const li = document.createElement('li');
      li.className = `lined-paper-item ${task.completed ? 'completed' : ''}`;
      li.dataset.id = task.id;

      li.innerHTML = `
        <span class="checkbox-circle ${task.completed ? 'checked' : ''}"></span>
        <span class="task-text" contenteditable="true" spellcheck="false" placeholder="Empty task">${task.text}</span>
        <button class="delete-task-btn" title="Delete task">&times;</button>
      `;

      const checkbox = li.querySelector('.checkbox-circle');
      const textSpan = li.querySelector('.task-text');
      const deleteBtn = li.querySelector('.delete-task-btn');

      // Toggle complete state
      checkbox.addEventListener('click', (e) => {
        e.stopPropagation();
        task.completed = !task.completed;
        saveCalendarTasks();
        renderCalendar();
      });

      // Inline edit task text
      textSpan.addEventListener('blur', () => {
        const newText = textSpan.textContent.trim();
        if (newText === '') {
          // If empty, delete it
          calendarTasks = calendarTasks.filter((t) => t.id !== task.id);
        } else {
          task.text = newText;
        }
        saveCalendarTasks();
        renderCalendar();
      });

      textSpan.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          textSpan.blur();
        }
      });

      // Delete task
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        calendarTasks = calendarTasks.filter((t) => t.id !== task.id);
        saveCalendarTasks();
        renderCalendar();
      });

      checklistUl.appendChild(li);
    });

    // Render Add New Task Row
    const addLi = document.createElement('li');
    addLi.className = 'lined-paper-item add-task-row';
    addLi.innerHTML = `
      <span class="checkbox-circle add-btn-circle" style="border-style: dashed; opacity: 0.5;">+</span>
      <span class="task-text new-task-input" contenteditable="true" spellcheck="false" placeholder="Add task..."></span>
    `;

    const newInputSpan = addLi.querySelector('.new-task-input');

    const handleAddNewTask = () => {
      const text = newInputSpan.textContent.trim();
      if (text !== '') {
        const newTask = {
          id: 'task-' + Date.now(),
          monthKey: currentMonthKey,
          text: text,
          completed: false,
        };
        calendarTasks.push(newTask);
        saveCalendarTasks();
        renderCalendar();
      } else {
        newInputSpan.textContent = ''; // clear any whitespace
      }
    };

    newInputSpan.addEventListener('blur', handleAddNewTask);
    newInputSpan.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        newInputSpan.blur();
      }
    });

    checklistUl.appendChild(addLi);

    // Fill remaining rows (total 13 rows to keep the lined notebook paper style looking full)
    const totalRendered = monthTasks.length + 1; // tasks + add task row
    const targetRows = 13;
    if (totalRendered < targetRows) {
      const emptyLinesNeeded = targetRows - totalRendered;
      for (let i = 0; i < emptyLinesNeeded; i++) {
        const emptyLi = document.createElement('li');
        emptyLi.className = 'lined-paper-item empty-line';
        emptyLi.innerHTML = `
          <span class="checkbox-circle" style="opacity: 0.15;"></span>
          <span class="task-text" style="pointer-events: none; opacity: 0.3;"></span>
        `;

        // Focus the add-task-row when clicking an empty line
        emptyLi.addEventListener('click', () => {
          newInputSpan.focus();
        });

        checklistUl.appendChild(emptyLi);
      }
    }
  }

  // Clear day cells (keep header MON-SUN rows)
  const headerCells = calendarDaysGrid.querySelectorAll('.calendar-day-header');
  calendarDaysGrid.innerHTML = '';
  headerCells.forEach((h) => calendarDaysGrid.appendChild(h));

  // Calculate Monday-start weekday offset
  let firstDay = new Date(calYear, calMonth, 1).getDay(); // 0 is Sunday, 1 is Monday...
  firstDay = firstDay === 0 ? 6 : firstDay - 1; // shift Sunday to 6, Monday to 0

  const totalDays = new Date(calYear, calMonth + 1, 0).getDate();
  const prevMonthTotalDays = new Date(calYear, calMonth, 0).getDate();

  const todayDate = new Date();

  // 1. Previous Month Days spacing
  for (let i = firstDay - 1; i >= 0; i--) {
    const dayVal = prevMonthTotalDays - i;
    const cell = createCalendarDayCell(dayVal, true);
    calendarDaysGrid.appendChild(cell);
  }

  // 2. Current Month Days
  for (let d = 1; d <= totalDays; d++) {
    const cell = createCalendarDayCell(d, false);

    // Check if cell is Today
    if (
      todayDate.getDate() === d &&
      todayDate.getMonth() === calMonth &&
      todayDate.getFullYear() === calYear
    ) {
      cell.classList.add('today-cell');
    }

    calendarDaysGrid.appendChild(cell);
  }

  // 3. Next Month Days filling grid cells
  const totalRendered = firstDay + totalDays;
  const remaining = totalRendered % 7 === 0 ? 0 : 7 - (totalRendered % 7);
  for (let n = 1; n <= remaining; n++) {
    const cell = createCalendarDayCell(n, true);
    calendarDaysGrid.appendChild(cell);
  }
}

function createCalendarDayCell(dayNum, isOtherMonth) {
  const cell = document.createElement('div');
  cell.className = `calendar-day-cell ${isOtherMonth ? 'other-month' : ''}`;

  const numSpan = document.createElement('span');
  numSpan.className = 'calendar-day-num';
  numSpan.textContent = dayNum;
  cell.appendChild(numSpan);

  if (!isOtherMonth) {
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    const dateNotes = notes.filter(
      (n) => n.date === dateStr && !n.isDeleted && !n.isArchived
    );

    if (dateNotes.length > 0) {
      const eventsContainer = document.createElement('div');
      eventsContainer.className = 'calendar-cell-events';

      dateNotes.forEach((note) => {
        const tag = document.createElement('div');
        tag.className = 'calendar-event-tag';
        tag.style.backgroundColor = note.color;
        tag.textContent = note.title;
        tag.title = note.title;

        // Open Note Details View Modal on tag click
        tag.addEventListener('click', (e) => {
          e.stopPropagation(); // Stop opening note creation form
          openViewNoteModal(note);
        });

        eventsContainer.appendChild(tag);
      });

      cell.appendChild(eventsContainer);
    }

    // Clicking empty cell space triggers Add Note form
    cell.addEventListener('click', () => {
      openAddNoteModal(dateStr);
    });
  }

  return cell;
}

// --- HELPER DATE FILTERS ---
function parseDateString(dateStr) {
  return new Date(dateStr);
}

function isSameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function getWeekNumber(d) {
  const onejan = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d - onejan) / 86400000 + onejan.getDay() + 1) / 7);
}

function isThisWeek(d, referenceDate = new Date()) {
  return (
    d.getFullYear() === referenceDate.getFullYear() &&
    getWeekNumber(d) === getWeekNumber(referenceDate)
  );
}

function isThisMonth(d, referenceYear, referenceMonth) {
  return d.getFullYear() === referenceYear && d.getMonth() === referenceMonth;
}

// --- RENDER FOLDERS GRID ---
function renderFolders() {
  foldersGrid.innerHTML = '';

  let filteredFolders = [...folders];

  // Filter search matches
  if (searchQuery.trim() !== '') {
    filteredFolders = filteredFolders.filter((f) =>
      f.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Filter tabs: Week, Month, All
  const todayRef = new Date();
  if (activeFoldersFilter === 'week') {
    filteredFolders = filteredFolders.filter((f) => {
      const fDate = new Date(f.date);
      return isThisWeek(fDate, todayRef);
    });
  } else if (activeFoldersFilter === 'month') {
    filteredFolders = filteredFolders.filter((f) => {
      const fDate = new Date(f.date);
      return (
        fDate.getMonth() === todayRef.getMonth() &&
        fDate.getFullYear() === todayRef.getFullYear()
      );
    });
  }

  // Render Folder Cards
  filteredFolders.forEach((folder) => {
    const card = document.createElement('div');
    card.className = `folder-card ${activeFolderId === folder.id ? 'active-folder' : ''}`;
    card.style.backgroundColor = folder.color;

    card.innerHTML = `
      <div class="folder-header">
        <div class="folder-icon-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
        </div>
        <button class="folder-options-btn" data-id="${folder.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="1.5"></circle><circle cx="5" cy="12" r="1.5"></circle><circle cx="19" cy="12" r="1.5"></circle></svg>
        </button>
      </div>
      <div class="folder-meta">
        <h4 class="folder-title">${folder.title}</h4>
        <span class="folder-date">${(() => {
          const parts = folder.date.split('-');
          return parts.length === 3
            ? `${parts[2]}/${parts[1]}/${parts[0]}`
            : folder.date;
        })()}</span>
      </div>
    `;

    // Click on folder to filter notes
    card.addEventListener('click', (e) => {
      if (e.target.closest('.folder-options-btn')) {
        e.stopPropagation();
        if (
          confirm(
            `Delete folder "${folder.title}"? Notes inside will lose folder assignment.`
          )
        ) {
          deleteFolder(folder.id);
        }
        return;
      }
      toggleFolderFilter(folder.id);
    });

    foldersGrid.appendChild(card);
  });

  // Append Dashed New Folder Button Card
  const newFolderCard = document.createElement('div');
  newFolderCard.className = 'folder-card folder-create-card';
  newFolderCard.innerHTML = `
    <div class="create-icon-wrap">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
    </div>
    <span>New folder</span>
  `;
  newFolderCard.addEventListener('click', () => {
    folderModal.classList.add('active');
    folderNameInput.focus();
  });
  foldersGrid.appendChild(newFolderCard);
}

function toggleFolderFilter(folderId) {
  if (activeFolderId === folderId) {
    activeFolderId = null; // Unselect
  } else {
    activeFolderId = folderId;
  }
  renderFolders();
  renderNotes();
}

function deleteFolder(folderId) {
  folders = folders.filter((f) => f.id !== folderId);
  // Reset notes assigned to this folder to no folder
  notes.forEach((n) => {
    if (n.folderId === folderId) n.folderId = '';
  });
  if (activeFolderId === folderId) activeFolderId = null;
  saveFolders();
  saveNotes();
  renderFolders();
  renderNotes();
}

// --- RENDER NOTES GRID ---
function renderNotes() {
  notesGrid.innerHTML = '';

  // Format Month displaying header
  monthDisplay.textContent = `${MONTH_NAMES[displayMonth]} ${displayYear}`;

  let filteredNotes = notes.filter((n) => {
    if (currentView === 'all') return !n.isArchived && !n.isDeleted;
    if (currentView === 'archive') return n.isArchived && !n.isDeleted;
    if (currentView === 'trash') return n.isDeleted;
    return true;
  });

  // Filter search matches
  if (searchQuery.trim() !== '') {
    filteredNotes = filteredNotes.filter(
      (n) =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Filter by active folder click
  if (activeFolderId) {
    filteredNotes = filteredNotes.filter((n) => n.folderId === activeFolderId);
  }

  // Filter notes by date selector (Today, Week, Month tabs)
  if (currentView === 'all') {
    filteredNotes = filteredNotes.filter((n) => {
      const nDate = new Date(n.date);

      if (activeNotesFilter === 'today') {
        return isSameDay(nDate, new Date());
      } else if (activeNotesFilter === 'week') {
        return isThisWeek(nDate, new Date());
      } else {
        return isThisMonth(nDate, displayYear, displayMonth);
      }
    });
  }

  // Render Cards
  filteredNotes.forEach((note) => {
    const card = document.createElement('div');
    card.className = 'note-card';
    card.style.backgroundColor = note.color;

    // Format Display date (e.g. 12/12/2021)
    const dObj = new Date(note.date);
    const displayDateStr = `${dObj.getDate()}/${dObj.getMonth() + 1}/${dObj.getFullYear()}`;

    // Get folder title
    const folderObj = folders.find((f) => f.id === note.folderId);
    const folderName = folderObj ? folderObj.title : 'Unassigned';

    card.innerHTML = `
      <div class="note-card-header">
        <span class="note-card-date">${displayDateStr}</span>
        <button class="note-edit-icon-btn" data-id="${note.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
        </button>
      </div>
      <div class="note-card-body">
        <h4 class="note-card-title">${note.title}</h4>
        <p class="note-card-snippet">${note.content}</p>
      </div>
      <div class="note-card-footer">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <span>${note.time ? formatTime(note.time) : '10:30 PM'}, ${note.day || 'Monday'}</span>
      </div>
    `;

    // Click note to view detail modal
    card.addEventListener('click', (e) => {
      if (e.target.closest('.note-edit-icon-btn')) {
        e.stopPropagation();
        openEditNoteModal(note.id);
        return;
      }
      openViewNoteModal(note);
    });

    notesGrid.appendChild(card);
  });

  // Append Dashed New Note Button Card
  if (currentView === 'all') {
    const newNoteCard = document.createElement('div');
    newNoteCard.className = 'note-card note-create-card';
    newNoteCard.innerHTML = `
      <div class="create-icon-wrap">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      </div>
      <span>New Note</span>
    `;
    newNoteCard.addEventListener('click', () => {
      openAddNoteModal();
    });
    notesGrid.appendChild(newNoteCard);
  }
}

function formatTime(timeStr) {
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;
  let hrs = parseInt(parts[0]);
  const mins = parts[1];
  const ampm = hrs >= 12 ? 'PM' : 'AM';
  hrs = hrs % 12;
  hrs = hrs ? hrs : 12; // 0 matches 12
  return `${String(hrs).padStart(2, '0')}:${mins} ${ampm}`;
}

// --- FOLDER & NOTE SUBMISSION CRUD ---
folderForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = folderNameInput.value.trim();
  const color = document.querySelector(
    'input[name="folder-color"]:checked'
  ).value;

  const dObj = new Date();
  const dateStr = dObj.toISOString().split('T')[0]; // Store as YYYY-MM-DD

  const newFolder = {
    id: 'folder-' + Date.now(),
    title,
    color,
    date: dateStr,
  };

  folders.push(newFolder);
  saveFolders();

  folderModal.classList.remove('active');
  folderNameInput.value = '';

  renderFolders();
  populateFolderDropdown();
});

function openAddNoteModal(targetDate = null) {
  noteModalTitle.textContent = 'Create Note';
  editNoteId.value = '';
  noteTitleInput.value = '';
  noteContentInput.value = '';
  noteTimeInput.value = '10:30';
  noteDaySelect.value = 'Monday';

  // Pre-populate target date in form dataset
  noteForm.dataset.targetDate =
    targetDate || new Date().toISOString().split('T')[0];

  populateFolderDropdown();
  noteModal.classList.add('active');
}

function openEditNoteModal(noteId) {
  const note = notes.find((n) => n.id === noteId);
  if (!note) return;

  noteModalTitle.textContent = 'Edit Note';
  editNoteId.value = note.id;
  noteTitleInput.value = note.title;
  noteContentInput.value = note.content;
  noteTimeInput.value = note.time || '10:30';
  noteDaySelect.value = note.day || 'Monday';
  noteForm.dataset.targetDate = note.date;

  populateFolderDropdown();
  noteFolderSelect.value = note.folderId;

  // Highlight note color
  const radio = document.querySelector(
    `input[name="note-color"][value="${note.color}"]`
  );
  if (radio) radio.checked = true;

  noteModal.classList.add('active');
}

function populateFolderDropdown() {
  noteFolderSelect.innerHTML = '<option value="">Unassigned Folder</option>';
  folders.forEach((f) => {
    const opt = document.createElement('option');
    opt.value = f.id;
    opt.textContent = f.title;
    noteFolderSelect.appendChild(opt);
  });
}

noteForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const id = editNoteId.value;
  const title = noteTitleInput.value.trim();
  const folderId = noteFolderSelect.value;
  const content = noteContentInput.value.trim();
  const time = noteTimeInput.value;
  const day = noteDaySelect.value;
  const color = document.querySelector(
    'input[name="note-color"]:checked'
  ).value;
  const targetDate = noteForm.dataset.targetDate;

  if (id) {
    // EDIT
    const note = notes.find((n) => n.id === id);
    if (note) {
      note.title = title;
      note.folderId = folderId;
      note.content = content;
      note.time = time;
      note.day = day;
      note.color = color;
    }
  } else {
    // CREATE
    const newNote = {
      id: 'note-' + Date.now(),
      folderId,
      title,
      content,
      color,
      date: targetDate,
      time,
      day,
      isArchived: false,
      isDeleted: false,
    };

    notes.push(newNote);

    /*
     * Ensure the newly created note is immediately visible.
     * If the current filter would hide the note,
     * switch to Month view for the note's month.
     */
    const createdDate = new Date(targetDate);

    if (
      (activeNotesFilter === 'today' && !isSameDay(createdDate, new Date())) ||
      (activeNotesFilter === 'week' && !isThisWeek(createdDate, new Date()))
    ) {
      activeNotesFilter = 'month';
      displayYear = createdDate.getFullYear();
      displayMonth = createdDate.getMonth();

      document
        .querySelectorAll('#notes-filter-tabs .filter-tab')
        .forEach((tab) => {
          tab.classList.toggle('active', tab.dataset.filter === 'month');
        });

      alert(
        'Note saved successfully. The view has been switched to the appropriate month so the new note is visible.'
      );
    }
  }

  saveNotes();
  noteModal.classList.remove('active');
  renderNotes();
  renderCalendar();
});

// --- NOTE DETAILS WORKSPACE VIEW MODAL ---
let currentViewingNote = null;

function openViewNoteModal(note) {
  currentViewingNote = note;
  viewCardColor.style.backgroundColor = note.color;
  viewNoteTitle.textContent = note.title;

  const folderObj = folders.find((f) => f.id === note.folderId);
  viewNoteFolder.textContent = folderObj ? folderObj.title : 'Unassigned';

  const dObj = new Date(note.date);
  viewNoteDate.textContent = dObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  viewReminderText.textContent = `${note.time ? formatTime(note.time) : '10:30 PM'}, ${note.day || 'Monday'}`;
  viewNoteContentText.textContent = note.content;

  // Icon States depending on View mode (Archive / Trash actions)
  if (note.isDeleted) {
    viewArchiveBtn.style.display = 'none';
    viewEditBtn.style.display = 'none';
    // Delete icon acts as delete permanently, and we add restore icon
    viewDeleteBtn.title = 'Delete Permanently';

    // Add restore button if not exists
    let restoreBtn = document.getElementById('view-restore-btn');
    if (!restoreBtn) {
      restoreBtn = document.createElement('button');
      restoreBtn.className = 'view-action-btn';
      restoreBtn.id = 'view-restore-btn';
      restoreBtn.title = 'Restore note';
      restoreBtn.innerHTML =
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>';
      restoreBtn.addEventListener('click', () => {
        restoreNote(currentViewingNote.id);
        viewNoteModal.classList.remove('active');
      });
      viewArchiveBtn.parentElement.insertBefore(restoreBtn, viewDeleteBtn);
    } else {
      restoreBtn.style.display = 'flex';
    }
  } else {
    viewArchiveBtn.style.display = 'flex';
    viewEditBtn.style.display = 'flex';
    viewDeleteBtn.title = 'Move to Trash';

    const restoreBtn = document.getElementById('view-restore-btn');
    if (restoreBtn) restoreBtn.style.display = 'none';
  }

  viewNoteModal.classList.add('active');
}

viewEditBtn.addEventListener('click', () => {
  if (currentViewingNote) {
    viewNoteModal.classList.remove('active');
    openEditNoteModal(currentViewingNote.id);
  }
});

viewArchiveBtn.addEventListener('click', () => {
  if (currentViewingNote) {
    currentViewingNote.isArchived = !currentViewingNote.isArchived;
    saveNotes();
    viewNoteModal.classList.remove('active');
    renderNotes();
  }
});

viewDeleteBtn.addEventListener('click', () => {
  if (currentViewingNote) {
    if (currentViewingNote.isDeleted) {
      if (
        confirm('Permanently delete this note? This action cannot be undone.')
      ) {
        notes = notes.filter((n) => n.id !== currentViewingNote.id);
      } else {
        return;
      }
    } else {
      currentViewingNote.isDeleted = true;
      currentViewingNote.isArchived = false; // remove archive state
    }
    saveNotes();
    viewNoteModal.classList.remove('active');
    renderNotes();
    renderCalendar();
  }
});

function restoreNote(noteId) {
  const note = notes.find((n) => n.id === noteId);
  if (note) {
    note.isDeleted = false;
    saveNotes();
    renderNotes();
    renderCalendar();
  }
}

// --- SIDEBAR VIEW TOGGLER ---
function switchView(viewName) {
  currentView = viewName;
  activeFolderId = null; // reset folder filter

  // Manage active nav tab highlight
  navAllNotes.classList.toggle('active', viewName === 'all');
  navCalendar.classList.toggle('active', viewName === 'calendar');
  navArchive.classList.toggle('active', viewName === 'archive');
  navTrash.classList.toggle('active', viewName === 'trash');

  // Toggle sections display
  if (viewName === 'calendar') {
    foldersSection.classList.add('hidden');
    notesSection.classList.add('hidden');
    calendarSection.classList.remove('hidden');
    workspaceTitleDisplay.textContent = 'CALENDAR';
    renderCalendar();
  } else {
    calendarSection.classList.add('hidden');
    foldersSection.classList.remove('hidden');
    notesSection.classList.remove('hidden');

    if (viewName === 'all') {
      workspaceTitleDisplay.textContent = 'MY NOTES';
      notesTitleHeading.textContent = 'My Notes';
      foldersSection.style.display = 'block';
    } else if (viewName === 'archive') {
      workspaceTitleDisplay.textContent = 'ARCHIVE';
      notesTitleHeading.textContent = 'Archived Notes';
      foldersSection.style.display = 'none'; // hide folders list in Archive
    } else if (viewName === 'trash') {
      workspaceTitleDisplay.textContent = 'TRASH';
      notesTitleHeading.textContent = 'Deleted Notes (Trash)';
      foldersSection.style.display = 'none'; // hide folders in Trash
    }
    renderFolders();
    renderNotes();
  }
}

// --- EVENT HANDLERS ---
function bindEvents() {
  // Mobile sidebar burger toggle
  mobileToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
  });

  // Close mobile sidebar on outer clicks
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      if (
        !sidebar.contains(e.target) &&
        !mobileToggle.contains(e.target) &&
        sidebar.classList.contains('active')
      ) {
        sidebar.classList.remove('active');
      }
    }

    // Close "+ Add new" dropdown on outer click
    if (
      !addNewTrigger.contains(e.target) &&
      !addDropdownMenu.contains(e.target)
    ) {
      addDropdownMenu.classList.remove('active');
    }
  });

  // Header menu dummy alert
  headerSettingsBtn.addEventListener('click', () => {
    alert('Mino Dashboard Settings Menu. Open source offline platform.');
  });

  // Top bar search handler
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderFolders();
    renderNotes();
  });

  // Month selectors events
  prevMonthBtn.addEventListener('click', () => {
    displayMonth--;
    if (displayMonth < 0) {
      displayMonth = 11;
      displayYear--;
    }
    renderNotes();
  });

  nextMonthBtn.addEventListener('click', () => {
    displayMonth++;
    if (displayMonth > 11) {
      displayMonth = 0;
      displayYear++;
    }
    renderNotes();
  });

  // Calendar month selectors events
  calPrevMonth.addEventListener('click', () => {
    calMonth--;
    if (calMonth < 0) {
      calMonth = 11;
      calYear--;
    }
    renderCalendar();
  });

  calNextMonth.addEventListener('click', () => {
    calMonth++;
    if (calMonth > 11) {
      calMonth = 0;
      calYear++;
    }
    renderCalendar();
  });

  // Nav buttons click binding
  navAllNotes.addEventListener('click', () => switchView('all'));
  navCalendar.addEventListener('click', () => switchView('calendar'));
  navArchive.addEventListener('click', () => switchView('archive'));
  navTrash.addEventListener('click', () => switchView('trash'));

  // Folder filter tabs click
  foldersFilterTabs.querySelectorAll('.filter-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      foldersFilterTabs
        .querySelector('.filter-tab.active')
        .classList.remove('active');
      tab.classList.add('active');
      activeFoldersFilter = tab.dataset.filter;
      renderFolders();
    });
  });

  // Notes filter tabs click
  notesFilterTabs.querySelectorAll('.filter-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      notesFilterTabs
        .querySelector('.filter-tab.active')
        .classList.remove('active');
      tab.classList.add('active');
      activeNotesFilter = tab.dataset.filter;
      renderNotes();
    });
  });

  // Dropdown "+ Add new" click
  addNewTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    addDropdownMenu.classList.toggle('active');
  });

  newFolderMenuItem.addEventListener('click', () => {
    addDropdownMenu.classList.remove('active');
    folderModal.classList.add('active');
    folderNameInput.focus();
  });

  newNoteMenuItem.addEventListener('click', () => {
    addDropdownMenu.classList.remove('active');
    openAddNoteModal();
  });

  // Close modals buttons events
  closeFolderModal.addEventListener('click', () =>
    folderModal.classList.remove('active')
  );
  cancelFolderBtn.addEventListener('click', () =>
    folderModal.classList.remove('active')
  );

  closeNoteModal.addEventListener('click', () =>
    noteModal.classList.remove('active')
  );
  cancelNoteBtn.addEventListener('click', () =>
    noteModal.classList.remove('active')
  );

  closeViewNoteModal.addEventListener('click', () =>
    viewNoteModal.classList.remove('active')
  );

  // Close modals on clicking outer dark space
  window.addEventListener('click', (e) => {
    if (e.target === folderModal) folderModal.classList.remove('active');
    if (e.target === noteModal) noteModal.classList.remove('active');
    if (e.target === viewNoteModal) viewNoteModal.classList.remove('active');
  });

  // Color Accent quick pickers theme
  themeColorDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const colorVal = dot.dataset.color;
      document.body.style.backgroundColor = colorVal;
      // Fade accent theme to scroll container too
      document.getElementById(
        'workspace-scroll-container'
      ).style.backgroundColor = colorVal;
    });
  });
}

// --- INITIALIZE APPLICATION ---
function init() {
  loadData();
  bindEvents();

  // Render default workspace views
  renderFolders();
  renderNotes();
}

window.addEventListener('DOMContentLoaded', init);
