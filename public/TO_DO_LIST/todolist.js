let notesContainer = document.getElementById("notes-container");
let documentsList = document.querySelector(".documents-list");
let pdfMessage = document.getElementById("pdfMessage");
let task = document.getElementById("task");
let currentTheme = "theme1";
let currentFilter = "all";

// Task type colors for the dropdown inside each card
const taskTypes = [
  { label: "Select Type", value: "", color: null },
  { label: "Work",          value: "Work",          color: "#FFDE59" },
  { label: "Personal",      value: "Personal",      color: "#FFC0CB" },
  { label: "Urgent",        value: "Urgent",        color: "#B0BEC5" },
  { label: "Fitness",       value: "Fitness",       color: "#B1EE99" },
  { label: "Miscellaneous", value: "Miscellaneous", color: "#CAB9F5" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function getTodayStr() {
  return new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
}

function getDueDateLabel(dueDateStr) {
  if (!dueDateStr) return null;
  const today = new Date(getTodayStr());
  const due   = new Date(dueDateStr);
  const diff  = Math.round((due - today) / (1000 * 60 * 60 * 24));

  if (diff < 0)  return { text: `⏰ Overdue by ${Math.abs(diff)}d`, cls: "overdue" };
  if (diff === 0) return { text: "📅 Due Today",  cls: "due-today" };
  if (diff === 1) return { text: "📅 Due Tomorrow", cls: "due-soon" };
  if (diff <= 3)  return { text: `📅 Due in ${diff} days`, cls: "due-soon" };
  return { text: `📅 ${due.toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}`, cls: "" };
}

function updateStats() {
  const all       = document.querySelectorAll(".notes");
  const total     = all.length;
  const completed = document.querySelectorAll(".notes.completed").length;
  const pending   = total - completed;
  const statsEl   = document.getElementById("taskStats");
  if (statsEl) statsEl.textContent = total ? `${pending} pending · ${completed} done` : "";

  const emptyMsg = document.getElementById("empty-msg");
  if (emptyMsg) emptyMsg.classList.toggle("show", total === 0);
}

// ─── ADD TASK ─────────────────────────────────────────────────────────────────

function Add() {
  if (!task.value.trim()) {
    alert("Please enter a task");
    return;
  }

  const priority = document.getElementById("taskPriority").value;
  const category = document.getElementById("taskCategory").value;
  const dueDate  = document.getElementById("taskDueDate").value;

  const note = document.createElement("div");
  note.className = "notes";
  note.style.backgroundColor = "white";
  note.dataset.priority = priority;
  note.dataset.category = category;
  note.dataset.due      = dueDate;

  const noteWrapper = document.createElement("div");
  noteWrapper.className = "note-row";

  // ── Task text (editable) ──
  const taskText = document.createElement("span");
  taskText.className = "note-text";
  taskText.innerText = task.value.trim();
  taskText.contentEditable = true;

  // ── Badges row ──
  const badgesRow = document.createElement("div");
  badgesRow.className = "note-badges";

  if (priority) {
    const pBadge = document.createElement("span");
    pBadge.className = `badge badge-priority-${priority}`;
    pBadge.textContent = priority === "High" ? "🔴 High" : priority === "Medium" ? "🟡 Medium" : "🟢 Low";
    badgesRow.appendChild(pBadge);
  }

  if (category) {
    const cBadge = document.createElement("span");
    cBadge.className = "badge badge-category";
    const catEmojis = { Work:"💼", Personal:"🏠", Fitness:"💪", Urgent:"🚨", Miscellaneous:"🗂️" };
    cBadge.textContent = `${catEmojis[category] || ""} ${category}`;
    badgesRow.appendChild(cBadge);
  }

  // ── Due date label ──
  const dueLabelInfo = getDueDateLabel(dueDate);
  const dueEl = document.createElement("div");
  dueEl.className = `note-due ${dueLabelInfo ? dueLabelInfo.cls : ""}`;
  if (dueLabelInfo) {
    dueEl.textContent = dueLabelInfo.text;
  }
  dueEl.style.display = dueLabelInfo ? "flex" : "none";

  // ── Type dropdown (colour changer) ──
  const dropdown = document.createElement("select");
  dropdown.className = "note-type";
  taskTypes.forEach((taskType) => {
    const option = document.createElement("option");
    option.value   = taskType.value;
    option.innerText = taskType.label;
    dropdown.appendChild(option);
  });
  dropdown.addEventListener("change", () => {
    const selected = taskTypes.find((t) => t.value === dropdown.value);
    if (selected && selected.color) note.style.backgroundColor = selected.color;
  });

  // ── Action buttons ──
  const actionsRow = document.createElement("div");
  actionsRow.className = "note-actions";

  const tickBtn = document.createElement("button");
  tickBtn.type = "button";
  tickBtn.className = "note-check";
  tickBtn.innerHTML = "✓ Done";
  tickBtn.addEventListener("click", (e) => {
    note.classList.toggle("completed");
    tickBtn.innerHTML = note.classList.contains("completed") ? "↩ Undo" : "✓ Done";
    e.stopPropagation();
    applyFilter(currentFilter);
    updateStats();
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "note-delete";
  deleteBtn.innerText = "🗑 Delete";
  deleteBtn.addEventListener("click", () => {
    note.remove();
    updateStats();
  });

  actionsRow.appendChild(tickBtn);
  actionsRow.appendChild(deleteBtn);

  // ── Assemble ──
  noteWrapper.appendChild(taskText);
  if (priority || category) noteWrapper.appendChild(badgesRow);
  if (dueLabelInfo)         noteWrapper.appendChild(dueEl);
  noteWrapper.appendChild(dropdown);
  noteWrapper.appendChild(actionsRow);

  note.appendChild(noteWrapper);
  notesContainer.appendChild(note);

  // Reset inputs
  task.value = "";
  document.getElementById("taskPriority").value = "";
  document.getElementById("taskCategory").value = "";
  document.getElementById("taskDueDate").value  = "";

  applyFilter(currentFilter);
  updateStats();
}

// Allow Enter key to add task
document.getElementById("task").addEventListener("keydown", (e) => {
  if (e.key === "Enter") Add();
});

// ─── FILTER ───────────────────────────────────────────────────────────────────

function filterTasks(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  applyFilter(filter);
}

function applyFilter(filter) {
  const notes = document.querySelectorAll(".notes");
  const today = getTodayStr();
  notes.forEach((note) => {
    let show = false;
    const isCompleted = note.classList.contains("completed");
    const priority    = note.dataset.priority;
    const due         = note.dataset.due;
    const isOverdue   = due && due < today && !isCompleted;

    if (filter === "all")       show = true;
    else if (filter === "completed") show = isCompleted;
    else if (filter === "overdue")   show = isOverdue;
    else if (["High","Medium","Low"].includes(filter)) show = priority === filter;
    else show = true;

    note.classList.toggle("hidden", !show);
  });
}

// ─── SAVE AS PDF ─────────────────────────────────────────────────────────────

function saveAsPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const tasks = document.querySelectorAll(".notes");
  let y = 20;

  doc.setFontSize(18);
  doc.text("My To-Do List", 20, y);
  y += 10;
  doc.setFontSize(11);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 20, y);
  y += 12;

  tasks.forEach((task, index) => {
    const text     = task.querySelector(".note-text")?.textContent.trim() || "";
    const priority = task.dataset.priority || "—";
    const category = task.dataset.category || "—";
    const due      = task.dataset.due || "—";
    const done     = task.classList.contains("completed") ? "✓" : "○";
    if (!text) return;

    doc.setFontSize(13);
    doc.text(`${index + 1}. [${done}] ${text}`, 20, y);
    y += 7;
    doc.setFontSize(10);
    doc.text(`   Priority: ${priority}   Category: ${category}   Due: ${due}`, 20, y);
    y += 10;
    if (y > 270) { doc.addPage(); y = 20; }
  });

  const fileName = `ToDoList_${Date.now()}.pdf`;
  const fileURL  = URL.createObjectURL(doc.output("blob"));
  saveDocument(fileName, fileURL);
  showPDFMessage();
}

function saveDocument(fileName, fileURL) {
  let docItem = document.createElement("div");
  docItem.className = "document-item";
  docItem.innerHTML = `
    <span>${fileName}</span>
    <button onclick="viewPDF('${fileURL}')">View</button>
    <button onclick="downloadPDF('${fileURL}', '${fileName}')">Download</button>
    <button onclick="deletePDF(this)">Delete</button>
  `;
  documentsList.appendChild(docItem);
}

function viewPDF(fileURL)                    { window.open(fileURL, "_blank"); }
function downloadPDF(fileURL, fileName)      { let a = document.createElement("a"); a.href = fileURL; a.download = fileName; a.click(); }
function deletePDF(button)                   { button.parentElement.remove(); }

function showPDFMessage() {
  pdfMessage.style.display = "block";
  setTimeout(() => { pdfMessage.style.display = "none"; }, 3000);
}

// ─── TAB SWITCHER ─────────────────────────────────────────────────────────────

function showHome() {
  document.getElementById("home-tab").style.display = "block";
  document.getElementById("documents-tab").style.display = "none";
}
function showDocuments() {
  document.getElementById("home-tab").style.display = "none";
  document.getElementById("documents-tab").style.display = "block";
}

// ─── THEMES ──────────────────────────────────────────────────────────────────

function c1() { document.body.style.background = 'linear-gradient(90deg, rgba(232,221,227,1) 33%, rgba(219,185,200,1) 100%)'; currentTheme = "theme1"; updateNotesTheme(); }
function c2() { document.body.style.background = 'linear-gradient(90deg, #e4afcb 0%, #e2c58b 30%, #7edbdc 100%)'; currentTheme = "theme2"; updateNotesTheme(); }
function c3() { document.body.style.background = 'linear-gradient(90deg, #39db8c, #d1ab51, #df868d)'; currentTheme = "theme3"; updateNotesTheme(); }
function c4() { document.body.style.background = 'linear-gradient(90deg,rgb(120,25,105),rgb(197,211,201))'; currentTheme = "theme4"; updateNotesTheme(); }
function c5() { document.body.style.background = 'linear-gradient(90deg, #b92b27, #1565c0)'; currentTheme = "theme5"; updateNotesTheme(); }

const themeColors = { theme1:"rgba(232,221,227,1)", theme2:"#e4afcb", theme3:"#39db8c", theme4:"rgb(120,25,105)", theme5:"#b92b27" };

function updateNotesTheme() {
  document.querySelectorAll(".notes").forEach((note) => {
    if (note.style.backgroundColor === "white") {
      note.style.backgroundColor = themeColors[currentTheme] || "white";
    }
  });
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
updateStats();