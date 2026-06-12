let notesContainer = document.getElementById("notes-container");
let documentsList = document.querySelector(".documents-list");
let pdfMessage = document.getElementById("pdfMessage");

let currentTheme = "theme1"; // Default theme

// Task types with updated labels, values, and colors
const taskTypes = [
  { label: "Select Type", value: "", color: "white" },
  { label: "Work", value: "Work", color: "#FFDE59" }, // Bright Yellow
  { label: "Personal", value: "Personal", color: "#FFC0CB" }, // Soft Pastel Pink
  { label: "Professional", value: "Urgent", color: "#B0BEC5" }, // Cool Gray
  { label: "Fitness", value: "Fitness", color: "#B1EE99" }, // Vibrant Green
  { label: "Miscellaneous", value: "Miscellaneous", color: "#CAB9F5" }, // Vibrant Green
];

function Add() {
  const notes = document.querySelectorAll(".notes");

  if (notes.length > 0) {
    const lastNote = notes[notes.length - 1];
    const taskText = lastNote.querySelector("span");

    if (taskText && (taskText.innerText.trim() === "Click here to add a task..." || taskText.innerText.trim() === "")) {
      alert("Please add a task to the previous note before creating a new one!");
      return;
    }
  }

  // Create a note container
  const note = document.createElement("div");
  note.classList.add("notes");
  note.style.backgroundColor = "white";

  const noteWrapper = document.createElement("div");
  noteWrapper.style.display = "flex";
  noteWrapper.style.alignItems = "center";
  noteWrapper.style.justifyContent = "space-between";
  noteWrapper.style.width = "100%";

  const taskText = document.createElement("span");
  taskText.innerText = "Click here to add a task...";
  taskText.contentEditable = true;
  taskText.style.flex = "1";
  taskText.style.marginRight = "10px";

  // Dropdown menu for task type
  const dropdown = document.createElement("select");
  dropdown.style.marginLeft = "10px";
  dropdown.style.padding = "5px";
  dropdown.style.borderRadius = "6px";
  dropdown.style.border = "1px solid rgba(0,0,0,0.1)";
  dropdown.style.background = "rgba(255, 255, 255, 0.6)";
  dropdown.style.fontFamily = "'Poppins', sans-serif";
  dropdown.style.outline = "none";

  // Populate dropdown with task types
  taskTypes.forEach((taskType) => {
    const option = document.createElement("option");
    option.value = taskType.value;
    option.innerText = taskType.label;
    dropdown.appendChild(option);
  });

  // Update task background color based on dropdown selection
  dropdown.addEventListener("change", () => {
    const selectedType = taskTypes.find((type) => type.value === dropdown.value);
    if (selectedType) {
      note.style.backgroundColor = selectedType.color;
    }
  });

  const tickIcon = document.createElement("a");
  tickIcon.innerHTML = "&#10003"; // Checkmark symbol
  tickIcon.style.cursor = "pointer";
  tickIcon.style.color = "black";
  tickIcon.style.fontSize = "20px";
  tickIcon.style.marginLeft = "10px";

  const trashIcon = document.createElement("i");
  trashIcon.className = "fa-solid fa-trash";
  trashIcon.style.cursor = "pointer";
  trashIcon.style.color = "black";
  trashIcon.style.fontSize = "16px";
  trashIcon.style.marginLeft = "10px";
  
  trashIcon.addEventListener("click", (event) => {
    note.remove();
    event.stopPropagation();
  });

  noteWrapper.appendChild(taskText);
  noteWrapper.appendChild(dropdown);
  noteWrapper.appendChild(tickIcon);
  noteWrapper.appendChild(trashIcon);

// 2. Core Task CRUD & Operations
function addTask() {
  const text = taskInput.value.trim();
  const category = taskTypeSelect.value;

  if (!text) {
    showToast("⚠️ Please enter a task description!");
    return;
  }

  // Bug 4 fix: require a category selection; show a clear warning if omitted
  if (!category) {
    showToast("⚠️ Please select a category!");
    taskTypeSelect.focus();
    return;
  }

  // Find category color from the dropdown configuration (fallback)
  const selectedOption = taskTypeSelect.options[taskTypeSelect.selectedIndex];
  const color = (selectedOption && selectedOption.getAttribute && selectedOption.getAttribute("data-color")) || "#ffb86b";

  // Create local task object
  const newTask = {
    id: Date.now(),
    text: text,
    category: category,
    color: color,
    completed: false
  };

  tasks.push(newTask);
  saveTasks(); // Bug 1 fix: persist after add
  taskInput.value = "";
  taskTypeSelect.value = ""; // Reset dropdown

  renderTasks();
  showToast("✅ Task added successfully!");
}

function toggleTask(id) {
  tasks = tasks.map(task => {
    if (task.id === id) return { ...task, completed: !task.completed };
    return task;
  });
  saveTasks(); // Bug 1 fix: persist after toggle
  renderTasks();
}

function saveAsPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let tasks = document.querySelectorAll(".notes");
  let yPos = 20;
  doc.setFontSize(16);
  doc.text(20, yPos, "My To-Do List");
  yPos += 15;
  doc.setFontSize(12);

  tasks.forEach((task) => {
    let span = task.querySelector("span");
    let text = span ? span.innerText.trim() : "";
    if (text && text !== "Click here to add a task...") {
      let isCompleted = span.classList.contains("completed") ? "[Done] " : "[ ] ";
      let select = task.querySelector("select");
      let type = select && select.value ? ` (${select.value})` : "";
      
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(20, yPos, isCompleted + text + type);
      yPos += 10;
    }
  });

  if (yPos === 35 && doc.internal.getNumberOfPages() === 1) {
    doc.text(20, yPos, "No tasks added yet.");
  }

  let fileName = `ToDoList_${Date.now()}.pdf`;
  let fileURL = URL.createObjectURL(doc.output("blob"));
  saveDocument(fileName, fileURL);
  showPDFMessage();
}

function clearDone() {
  const previousLength = tasks.length;
  tasks = tasks.filter(task => !task.completed);
  if (tasks.length === previousLength) {
    showToast("ℹ️ No completed tasks to clear.");
  } else {
    saveTasks(); // Bug 1 fix: persist after clear
    renderTasks();
    showToast("🧹 Cleared all finished tasks!");
  }
}

// 3. Filtering & Rendering UI
function filterTasks(buttonElement, filterValue) {
  // Update active states on filter row
  document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
  buttonElement.classList.add("active");

  currentFilter = filterValue;
  renderTasks();
}

function renderTasks() {
  // Filter core task pool
  const filteredTasks = tasks.filter(task => {
    if (currentFilter === "all") return true;
    if (currentFilter === "pending") return !task.completed;
    if (currentFilter === "done") return task.completed;
    return task.category === currentFilter; // Matches Category Strings
  });

  // Clear container safely — no innerHTML (Bug 2 fix: XSS prevention)
  taskList.replaceChildren();

  // Toggle Visibility of Empty State Element
  if (filteredTasks.length === 0) {
    if (emptyState) {
      taskList.appendChild(emptyState);
      emptyState.style.display = "flex";
    }
  } else {
    if (emptyState) emptyState.style.display = "none";

    filteredTasks.forEach((task, idx) => {
      // Bug 3 fix: use <li> instead of <div> so <ul> contains valid children
      const card = document.createElement("li");
      card.className = "notes" + (task.completed ? " completed" : "");
      card.setAttribute("data-id", task.id);
      card.style.setProperty("--i", idx);

      // Bug 2 fix: build the card entirely with safe DOM APIs — no innerHTML
      const noteRow = document.createElement("div");
      noteRow.className = "note-row";

      // Editable textarea — textContent sets value safely
      const textarea = document.createElement("textarea");
      textarea.className = "note-text";
      textarea.value = task.text; // safe assignment; no HTML parsing
      textarea.addEventListener("change", () => updateTaskText(task.id, textarea.value));

      const noteActions = document.createElement("div");
      noteActions.className = "note-actions";

      const badge = document.createElement("div");
      badge.className = "category-badge";
      badge.textContent = task.category; // textContent: never executes scripts

      const btnGroup = document.createElement("div");

      const checkBtn = document.createElement("button");
      checkBtn.className = "note-check";
      checkBtn.textContent = task.completed ? "✓" : "✔";
      checkBtn.addEventListener("click", () => toggleTask(task.id));

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "note-delete";
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", () => deleteTask(task.id));

      btnGroup.appendChild(checkBtn);
      btnGroup.appendChild(deleteBtn);
      noteActions.appendChild(badge);
      noteActions.appendChild(btnGroup);
      noteRow.appendChild(textarea);
      noteRow.appendChild(noteActions);
      card.appendChild(noteRow);

      taskList.appendChild(card);
    });
  }

  updateMetrics();
}

function updateTaskText(id, newText) {
  tasks = tasks.map(task => {
    if (task.id === id) return { ...task, text: newText.trim() || "Untitled Task" };
    return task;
  });
  saveTasks(); // Bug 1 fix: persist inline edits
}

function updateMetrics() {
  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  // Update progress UI (matches HTML)
  if (progressFill) progressFill.style.width = `${pct}%`;
  if (progressText) progressText.innerText = `${done} / ${total} done`;

  // Show ‘Clear Done’ button only when at least one task is completed
  const clearDoneBtn = document.getElementById('cleardone');
  if (clearDoneBtn) clearDoneBtn.hidden = done === 0;
}

// 4. Tab Navigation System
function showHome() {
  document.getElementById("nav-home").classList.add("active");
  document.getElementById("nav-documents").classList.remove("active");
  document.getElementById("home-tab").removeAttribute("hidden");
  document.getElementById("home-tab").style.display = "block";
  document.getElementById("documents-tab").setAttribute("hidden", "");
  document.getElementById("documents-tab").style.display = "none";
}

function showDocuments() {
  document.getElementById("nav-home").classList.remove("active");
  document.getElementById("nav-documents").classList.add("active");
  document.getElementById("home-tab").setAttribute("hidden", "");
  document.getElementById("home-tab").style.display = "none";
  document.getElementById("documents-tab").removeAttribute("hidden");
  document.getElementById("documents-tab").style.display = "block";
}

// Wire up nav link click listeners
const navHome = document.getElementById("nav-home");
const navDocuments = document.getElementById("nav-documents");
if (navHome) {
  navHome.addEventListener("click", (e) => { e.preventDefault(); showHome(); });
}
if (navDocuments) {
  navDocuments.addEventListener("click", (e) => { e.preventDefault(); showDocuments(); });
}

// 5. Theme Customization System
function applyTheme(themeName) {
  document.body.classList.remove(
    "theme1",
    "theme2",
    "theme3",
    "theme4",
    "theme5"
  );

  document.body.classList.add(themeName);

  document.querySelectorAll(".theme-btn")
    .forEach(btn => btn.classList.remove("active"));

  const activeBtn = document.querySelector(
    `[data-theme="${themeName}"]`
  );

  if (activeBtn) {
    activeBtn.classList.add("active");
  }
  try { localStorage.setItem('todo-theme', themeName); } catch (e) { }
}
document.querySelectorAll(".theme-btn").forEach(button => {
  button.addEventListener("click", () => {
    const theme = button.dataset.theme;
    if (!theme) return;
    applyTheme(theme);
  });
});

// 6. PDF System using jsPDF Global Library
function saveAsPDF() {
  if (tasks.length === 0) {
    showToast("❌ Cannot export empty list!");
    return;
  }

  // Snapshot the current task list at this exact moment
  const snapshot = [...tasks];
  const doneCount = snapshot.filter(t => t.completed).length;
  const pendingCount = snapshot.length - doneCount;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // jsPDF v2.x API: doc.text(text, x, y)
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(22);
  doc.text("TaskFlow Agenda Report", 20, 24);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 32);
  doc.text(`Tasks: ${snapshot.length} total  |  ${doneCount} done  |  ${pendingCount} pending`, 20, 38);
  doc.line(20, 42, 190, 42);

  let verticalCursor = 52;
  doc.setFontSize(12);

  snapshot.forEach((task, index) => {
    if (verticalCursor > 270) { doc.addPage(); verticalCursor = 20; }
    const status = task.completed ? "[DONE]" : "[PENDING]";
    const printLine = `${index + 1}. ${status} (${task.category}) — ${task.text}`;
    doc.text(printLine, 20, verticalCursor);
    verticalCursor += 10;
  });

  const timeLabel = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const fileName = `TaskFlow_${Date.now()}.pdf`;
  const fileURL = URL.createObjectURL(doc.output("blob"));

  appendDocumentToList(fileName, fileURL, snapshot.length, doneCount, timeLabel);
  showToast(`📥 Saved ${snapshot.length} task${snapshot.length !== 1 ? 's' : ''} to Documents!`);

  // Auto-navigate to Documents tab so the user sees the new entry
  showDocuments();
}

function appendDocumentToList(fileName, fileURL, taskCount, doneCount, timeLabel) {
  // Hide the empty-state placeholder (it is a sibling of the ul, not inside it)
  const docEmptyState = document.getElementById("emptyDocsState");
  if (docEmptyState) docEmptyState.style.display = "none";

  // Bug 3 fix: use <li> instead of <div> — <ul> must only contain <li> children
  // Bug 2 fix: build entirely with safe DOM APIs — no innerHTML
  const docItem = document.createElement("li");
  docItem.className = "doc-item";

  const iconDiv = document.createElement("div");
  iconDiv.className = "doc-icon";
  iconDiv.textContent = "📄";

  const infoDiv = document.createElement("div");
  infoDiv.className = "doc-info";

  const nameDiv = document.createElement("div");
  nameDiv.className = "doc-name";
  nameDiv.textContent = fileName; // safe: textContent never parses HTML

  const metaDiv = document.createElement("div");
  metaDiv.className = "doc-meta";

  const dateSpan = document.createElement("span");
  dateSpan.className = "doc-date";
  dateSpan.textContent = `${new Date().toLocaleDateString()} ${timeLabel || ''}`;

  const countSpan = document.createElement("span");
  countSpan.className = "doc-task-count";
  countSpan.textContent = `${taskCount} task${taskCount !== 1 ? 's' : ''} · ${doneCount} done`;

  metaDiv.appendChild(dateSpan);
  metaDiv.appendChild(countSpan);
  infoDiv.appendChild(nameDiv);
  infoDiv.appendChild(metaDiv);

  const actionsDiv = document.createElement("div");
  actionsDiv.className = "doc-actions";

  const viewBtn = document.createElement("button");
  viewBtn.className = "doc-btn";
  viewBtn.textContent = "View";
  viewBtn.addEventListener("click", () => window.open(fileURL, "_blank"));

  const dlLink = document.createElement("a");
  dlLink.className = "doc-btn";
  dlLink.href = fileURL;
  dlLink.download = fileName; // safe attribute assignment
  dlLink.textContent = "Download";
  dlLink.style.cssText = "text-decoration:none;display:inline-block;text-align:center;";

  const delBtn = document.createElement("button");
  delBtn.className = "doc-btn del";
  delBtn.textContent = "Delete";
  delBtn.addEventListener("click", () => removeDocumentItem(delBtn));

  actionsDiv.appendChild(viewBtn);
  actionsDiv.appendChild(dlLink);
  actionsDiv.appendChild(delBtn);

  docItem.appendChild(iconDiv);
  docItem.appendChild(infoDiv);
  docItem.appendChild(actionsDiv);

  // PREPEND so newest document is always at the TOP — prevents users from
  // accidentally viewing an older document and thinking tasks are missing.
  documentsList.prepend(docItem);
}

function removeDocumentItem(button) {
  button.closest(".doc-item").remove();
  if (documentsList.children.length === 0) {
    // Restore the empty-state placeholder when all docs are deleted
    const docEmptyState = document.getElementById("emptyDocsState");
    if (docEmptyState) docEmptyState.style.display = "flex";
  }
}

// 7. Toast Alerts Notification System
function showToast(message) {
  const toast = document.getElementById("pdfMessage");
  if (!toast) {
    console.log('Toast:', message);
    return;
  }
  toast.innerText = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Listen for enter key in the input element
// Form submit handler + Enter key
const taskForm = document.getElementById('task-form');
if (taskForm) {
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTask();
  });
}

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addTask();
  }
});
// Wire up Save as PDF button click listener
const savePdfBtn = document.getElementById('savepdf');
if (savePdfBtn) {
  savePdfBtn.addEventListener('click', () => saveAsPDF());
}

// Wire up Clear Done button click listener
const clearDoneBtn = document.getElementById('cleardone');
if (clearDoneBtn) {
  clearDoneBtn.addEventListener('click', function () {
    if (typeof clearDone === 'function') clearDone();
  });
}

// Wire up filter bar buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (typeof filterTasks === 'function') filterTasks(btn, btn.dataset.filter);
  });
});

// --- Workspace Skin (Theme Switcher) ---
(function initTheme() {
  // Restore persisted theme on load
  const saved = localStorage.getItem('todo-workspace-theme');
  if (saved) document.body.setAttribute('data-theme', saved);

  document.querySelectorAll('.theme-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const theme = btn.getAttribute('data-theme');
      if (theme) {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('todo-workspace-theme', theme);
      }
    });
  });
})();

// --- Page Initialisation ---
// Set Home tab as active and apply default/saved theme on load
showHome();

try {
  const saved = localStorage.getItem('todo-theme');
  applyTheme(saved || 'theme1'); // fallback to theme1 if nothing saved
} catch (e) {
  applyTheme('theme1');
}

// Render tasks loaded from localStorage so they appear immediately on refresh
renderTasks();
