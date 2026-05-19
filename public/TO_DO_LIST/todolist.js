// ─── DOM References ────────────────────────────────────────────────────────────
const notesContainer = document.getElementById('notes-container');
const documentsList = document.querySelector('.documents-list');
const pdfMessage = document.getElementById('pdfMessage');
const taskInput = document.getElementById('task-input');
const taskTypeSelect = document.getElementById('task-type');

// ─── Theme State ───────────────────────────────────────────────────────────────
// Maps theme id → gradient for body + card fallback colour for default cards
const THEMES = {
  theme1: {
    body: 'linear-gradient(135deg, rgba(232,221,227,1) 0%, rgba(219,185,200,1) 55%, rgba(227,230,235,1) 100%)',
    card: 'rgba(232, 221, 227, 1)',
  },
  theme2: {
    body: 'linear-gradient(135deg, #e4afcb 0%, #e2c58b 50%, #7edbdc 100%)',
    card: '#e4afcb',
  },
  theme3: {
    body: 'linear-gradient(135deg, #39db8c 0%, #a0c559 30%, #d1ab51 55%, #e6936b 80%, #df868d 100%)',
    card: '#df868d',
  },
  theme4: {
    body: 'linear-gradient(135deg, rgb(120,25,105) 0%, rgb(197,211,201) 100%)',
    card: 'rgb(197, 211, 201)',
  },
  theme5: {
    body: 'linear-gradient(135deg, #b92b27 0%, #1565c0 100%)',
    card: '#c0cfe8',
  },
};

let currentTheme = 'theme1'; // default

function updateStats() {
  const total = document.querySelectorAll('.notes').length;

  const completed = document.querySelectorAll('.completed').length;

  const pending = total - completed;

  document.getElementById('totalTasks').innerText = total;

  document.getElementById('completedTasks').innerText = completed;

  document.getElementById('pendingTasks').innerText = pending;

  const progress = total === 0 ? 0 : (completed / total) * 100;

  document.getElementById('progressFill').style.width = `${progress}%`;
}

// ─── Task Type colour map ──────────────────────────────────────────────────────
// Keeps track of user-chosen type colours so they survive theme switches
const TYPE_COLORS = {
  '': null, // → use theme colour
  Work: '#FFDE59',
  Personal: '#FFC0CB',
  Professional: '#B0BEC5',
  Fitness: '#B1EE99',
  Miscellaneous: '#CAB9F5',
};

function showToast(message) {
  const toast = document.getElementById('toast');

  toast.innerText = message;

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// ─── Add Task ──────────────────────────────────────────────────────────────────
function Add() {
  const text = taskInput.value.trim();

  if (text === '') {
    taskInput.focus();
    taskInput.style.borderColor = 'rgba(255, 80, 80, 0.8)';
    setTimeout(() => {
      taskInput.style.borderColor = '';
    }, 1200);
    return;
  }

  const notes = document.querySelectorAll('.notes');

  if (notes.length > 0) {
    const lastNote = notes[notes.length - 1];
    const taskText = lastNote.querySelector('span');

    if (
      taskText &&
      (taskText.innerText.trim() === 'Click here to add a task...' ||
        taskText.innerText.trim() === '')
    ) {
      alert(
        'Please add a task to the previous note before creating a new one!'
      );
      return;
    }
  }

  const selectedType = taskTypeSelect.value;
  const typeColor = TYPE_COLORS[selectedType] ?? null;
  const isDefaultCard = !typeColor; // no type selected → follows theme

  // Card container
  const note = document.createElement('div');
  note.classList.add('notes');
  note.dataset.defaultCard = isDefaultCard ? 'true' : 'false';

  // Apply colour
  note.style.backgroundColor = isDefaultCard
    ? THEMES[currentTheme].card
    : typeColor;

  const isLightTheme = true; // All current card themes are light-colored

  note.style.color = isLightTheme ? '#1a1a1a' : '#ffffff';

  // Inner layout
  const noteWrapper = document.createElement('div');
  noteWrapper.style.cssText =
    'display:flex; align-items:flex-start; justify-content:space-between; width:100%; gap:8px;';

  // Task text
  const taskText = document.createElement('span');
  taskText.className = 'task-text';
  taskText.innerText = text;
  taskText.setAttribute('contenteditable', 'false');
  taskText.style.cssText = `
  flex:1;
  line-height:1.5;
  word-break:break-word;
  font-size:15px;
  font-weight:500;
  color:#111;
`;

  function saveTaskEdit() {
    const updatedText = taskText.innerText.trim();

    if (updatedText === '') {
      taskText.innerText = text;
    }

    taskText.setAttribute('contenteditable', 'false');
    note.classList.remove('editing');
    showToast('Task Updated');
  }

  taskText.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveTaskEdit();
    }

    if (e.key === 'Escape') {
      taskText.innerText = text;
      taskText.setAttribute('contenteditable', 'false');
      note.classList.remove('editing');
    }
  });

  taskText.addEventListener('blur', saveTaskEdit);

  // Actions column
  const actions = document.createElement('div');
  actions.style.cssText =
    'display:flex; flex-direction:row; align-items:center; gap:8px; flex-shrink:0;';

  // Tick / complete toggle
  const tickBtn = document.createElement('button');
  tickBtn.innerHTML = '&#10003;';
  tickBtn.title = 'Mark complete';
  tickBtn.style.cssText = [
    'background:none',
    'border:1.5px solid #555',
    'border-radius:8px',
    'width:32px',
    'height:32px',
    'cursor:pointer',
    'font-size:14px',
    'display:flex',
    'align-items:center',
    'justify-content:center',
    'transition:all 0.2s ease',
    'color:#111',
  ].join(';');

  tickBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    taskText.classList.toggle('completed');
    const isCompleted = taskText.classList.contains('completed');
    tickBtn.style.background = isCompleted ? '#4caf50' : 'none';
    tickBtn.style.color = isCompleted ? 'white' : '#111';
    tickBtn.style.borderColor = isCompleted ? '#4caf50' : '#555';
    updateStats();
  });

  tickBtn.addEventListener('mouseenter', () => {
    if (!taskText.classList.contains('completed')) {
      tickBtn.style.background = 'rgba(76, 175, 80, 0.15)';
      tickBtn.style.borderColor = '#4caf50';
      tickBtn.style.color = '#4caf50';
    }
  });

  tickBtn.addEventListener('mouseleave', () => {
    if (!taskText.classList.contains('completed')) {
      tickBtn.style.background = 'none';
      tickBtn.style.borderColor = '#555';
      tickBtn.style.color = '#111';
    }
  });

  // Edit button
  const editBtn = document.createElement('button');
  editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
  editBtn.title = 'Edit task';
  editBtn.style.cssText = [
    'background:none',
    'border:1.5px solid #555',
    'border-radius:8px',
    'width:32px',
    'height:32px',
    'cursor:pointer',
    'font-size:14px',
    'display:flex',
    'align-items:center',
    'justify-content:center',
    'transition:all 0.2s ease',
    'color:#111',
  ].join(';');

  editBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    taskText.setAttribute('contenteditable', 'true');
    taskText.focus();
    note.classList.add('editing');
    const range = document.createRange();
    range.selectNodeContents(taskText);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  });

  editBtn.addEventListener('mouseenter', () => {
    editBtn.style.background = 'rgba(245, 200, 66, 0.2)';
    editBtn.style.borderColor = '#f5c842';
    editBtn.style.color = '#f5c842';
  });

  editBtn.addEventListener('mouseleave', () => {
    editBtn.style.background = 'none';
    editBtn.style.borderColor = '#555';
    editBtn.style.color = '#111';
  });

  // Delete button
  const delBtn = document.createElement('button');
  delBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
  delBtn.title = 'Delete task';
  delBtn.classList.add('delete-btn');
  delBtn.style.cssText = [
    'background:rgba(255, 77, 77, 0.1)',
    'border:1.5px solid #ff4d4d',
    'width:32px',
    'height:32px',
    'border-radius:8px',
    'cursor:pointer',
    'display:flex',
    'align-items:center',
    'justify-content:center',
    'color:#ff4d4d',
    'font-size:14px',
    'transition:all 0.25s ease',
  ].join(';');

  delBtn.addEventListener('mouseenter', () => {
    delBtn.style.background = '#ff4d4d';
    delBtn.style.color = 'white';
    delBtn.style.transform = 'translateY(-2px) scale(1.05)';
    delBtn.style.boxShadow = '0 4px 12px rgba(255,77,77,0.4)';
  });

  delBtn.addEventListener('mouseleave', () => {
    delBtn.style.background = 'rgba(255, 77, 77, 0.1)';
    delBtn.style.color = '#ff4d4d';
    delBtn.style.transform = 'translateY(0) scale(1)';
    delBtn.style.boxShadow = 'none';
  });

  delBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    note.style.animation = 'none';
    note.style.transition = 'opacity 0.25s, transform 0.25s';
    note.style.opacity = '0';
    note.style.transform = 'scale(0.92)';
    setTimeout(() => {
      note.remove();

      updateStats();

      showToast('Task Deleted');
    }, 250);
  });

  // Type badge (only if type was selected)
  if (selectedType) {
    const badge = document.createElement('span');
    badge.innerText = selectedType;
    badge.style.cssText = [
      'font-size:10px',
      'font-weight:700',
      'padding:2px 7px',
      'border-radius:20px',
      'background:rgba(0,0,0,0.12)',
      'color:#111',
      'white-space:nowrap',
      'margin-top:4px',
      'align-self:flex-end',
    ].join(';');
    note.appendChild(badge);
  }

  actions.appendChild(tickBtn);
  actions.appendChild(editBtn);
  actions.appendChild(delBtn);
  noteWrapper.appendChild(taskText);
  noteWrapper.appendChild(actions);
  note.insertBefore(noteWrapper, note.firstChild);
  notesContainer.appendChild(note);

  updateStats();

  showToast('Task Added Successfully');

  // Reset inputs
  taskInput.value = '';
  taskTypeSelect.value = '';
  taskInput.focus();
}

// Allow pressing Enter in the input to add a task
taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') Add();
});

// ─── Theme Switching ───────────────────────────────────────────────────────────
function applyTheme(themeKey) {
  const theme = THEMES[themeKey];
  document.body.style.background = theme.body;
  currentTheme = themeKey;

  // Update CSS custom property → auto-updates all default cards via var()
  document.documentElement.style.setProperty('--theme-card-bg', theme.card);

  // Also imperatively update existing default cards
  const cards = document.querySelectorAll(".notes[data-default-card='true']");
  cards.forEach((card) => {
    card.style.backgroundColor = theme.card;
    card.style.color = '#1a1a1a'; // Ensure dark text on light cards
    
    // Update task text color
    const text = card.querySelector('.task-text');
    if (text) text.style.color = '#111';
    
    // Update button colors
    const btns = card.querySelectorAll('button');
    btns.forEach(btn => {
      if (!btn.classList.contains('delete-btn')) {
        btn.style.color = '#111';
      }
    });
  });
}

function c1() {
  applyTheme('theme1');
}
function c2() {
  applyTheme('theme2');
}
function c3() {
  applyTheme('theme3');
}
function c4() {
  applyTheme('theme4');
}
function c5() {
  applyTheme('theme5');
}

// ─── PDF Export ────────────────────────────────────────────────────────────────
function saveAsPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const cards = document.querySelectorAll('.notes');

  doc.setFontSize(18);
  doc.text('My To-Do List', 20, 18);
  doc.setFontSize(12);

  let y = 30;
  cards.forEach((card, i) => {
    const textNode = card.querySelector('.task-text');
    const text = textNode ? textNode.innerText.trim() : card.innerText.trim();
    if (text) {
      doc.text(`${i + 1}. ${text}`, 20, y);
      y += 10;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    }
  });

  const fileName = `ToDoList_${Date.now()}.pdf`;
  const fileURL = URL.createObjectURL(doc.output('blob'));
  saveDocument(fileName, fileURL);
  showPDFMessage();
}

function saveDocument(fileName, fileURL) {
  const emptyDocs = document.querySelector('.empty-docs');

  if (emptyDocs) {
    emptyDocs.remove();
  }
  const docItem = document.createElement('div');
  docItem.className = 'document-item';
  docItem.innerHTML = `
    <span>${fileName}</span>
    <button onclick="viewPDF('${fileURL}')">View</button>
    <button onclick="downloadPDF('${fileURL}', '${fileName}')">Download</button>
    <button onclick="deletePDF(this)">Delete</button>
  `;
  documentsList.appendChild(docItem);
}

function viewPDF(fileURL) {
  window.open(fileURL, '_blank');
}
function downloadPDF(fileURL, fileName) {
  const a = document.createElement('a');
  a.href = fileURL;
  a.download = fileName;
  a.click();
}
function deletePDF(button) {
  button.parentElement.remove();

  const remainingDocs = document.querySelectorAll('.document-item');

  if (remainingDocs.length === 0) {
    documentsList.innerHTML = `
      <div class="empty-docs">

        <div class="empty-icon">📂</div>

        <p>No documents exported yet.</p>

      </div>
    `;
  }

  showToast('Document Deleted');
}

function showPDFMessage() {
  pdfMessage.style.display = 'flex';
  setTimeout(() => {
    pdfMessage.style.display = 'none';
  }, 3000);
}

// ─── Tab Navigation ────────────────────────────────────────────────────────────
function showHome() {
  document.getElementById('home-tab').style.display = 'block';
  document.getElementById('documents-tab').style.display = 'none';
}

function showDocuments() {
  document.getElementById('home-tab').style.display = 'none';
  document.getElementById('documents-tab').style.display = 'block';
}

function c3() {
  let image = 'linear-gradient(90deg, #39db8c, #a0c559, #d1ab51, #e6936b, #df868d)';
  document.body.style.background = image;
  currentTheme = "theme3";
  updateNotesTheme();
}

function c4() {
  let image = 'linear-gradient(90deg,rgb(120, 25, 105),rgb(197, 211, 201))';
  document.body.style.background = image;
  currentTheme = "theme4";
  updateNotesTheme();
}

function c5() {
  let image = 'linear-gradient(90deg, #b92b27, #1565c0)';
  document.body.style.background = image;
  currentTheme = "theme5";
  updateNotesTheme();
}

function updateNotesTheme() {
  const notes = document.querySelectorAll(".notes");
  notes.forEach((note) => {
    if (note.style.backgroundColor === "white") {
      note.style.backgroundColor = currentTheme === "theme1"
        ? "rgba(232,221,227,1)"
        : currentTheme === "theme2"
          ? "#e4afcb"
          : currentTheme === "theme3"
            ? "#39db8c"
            : currentTheme === "theme4"
              ? "rgb(120, 25, 105)"
              : "#b92b27";
    }
  });
}
/* =========================
   KANBAN DRAG DROP FEATURE
   (Append below existing code)

// Make all newly created notes draggable
function enableDragForNotes() {
  const notes = document.querySelectorAll(".notes");

  notes.forEach((note, index) => {
    note.setAttribute("draggable", true);
    note.dataset.id = index;

    note.addEventListener("dragstart", function (e) {
      e.dataTransfer.setData("text/plain", note.dataset.id);
    });
  });
}

// Override existing Add() behavior slightly
const originalAdd = Add;

Add = function () {
  originalAdd();
  enableDragForNotes();
  saveTaskState();
};

// Save task positions/status
function saveTaskState() {
  const pendingTasks = [];
  const progressTasks = [];
  const completedTasks = [];

  document.querySelectorAll("#pending-list .notes").forEach(task => {
    pendingTasks.push(task.outerHTML);
  });

  document.querySelectorAll("#progress-list .notes").forEach(task => {
    progressTasks.push(task.outerHTML);
  });

  document.querySelectorAll("#completed-list .notes").forEach(task => {
    completedTasks.push(task.outerHTML);
  });

  localStorage.setItem("pendingTasks", JSON.stringify(pendingTasks));
  localStorage.setItem("progressTasks", JSON.stringify(progressTasks));
  localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
}

// Drag events
function allowDrop(event) {
  event.preventDefault();
}

function dropTask(event, sectionId) {
  event.preventDefault();

  const draggedId = event.dataTransfer.getData("text/plain");
  const draggedTask = document.querySelector(
    `.notes[data-id="${draggedId}"]`
  );

  if (draggedTask) {
    document.getElementById(sectionId).appendChild(draggedTask);
    saveTaskState();
  }
}

// Restore tasks after refresh
function loadTaskState() {
  const sections = [
    "pending-list",
    "progress-list",
    "completed-list"
  ];

  sections.forEach(section => {
    const savedTasks = JSON.parse(
      localStorage.getItem(
        section === "pending-list"
          ? "pendingTasks"
          : section === "progress-list"
          ? "progressTasks"
          : "completedTasks"
      )
    ) || [];

    const container = document.getElementById(section);

    if (container) {
      container.innerHTML = "";

      savedTasks.forEach(taskHTML => {
        container.innerHTML += taskHTML;
      });
    }
  });

  enableDragForNotes();
}

// Run when page loads
window.onload = function () {
  loadTaskState();
  enableDragForNotes();
};
