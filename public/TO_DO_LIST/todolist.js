// ============================================
// 🚀 TO-DO LIST — REDESIGN
// Semantic HTML + Event-driven JavaScript
// ============================================

const notesContainer = document.getElementById("notes-container");
const documentsList = document.querySelector(".documents-list");
const pdfMessage = document.getElementById("pdfMessage");
const taskInput = document.getElementById("task");
const taskCategory = document.getElementById("task-category");
const emptyState = document.getElementById("emptyState");
const emptyDocsState = document.getElementById("emptyDocsState");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const taskForm = document.getElementById("task-form");
const savePdfBtn = document.getElementById("savepdf");
const navHome = document.getElementById("nav-home");
const navDocuments = document.getElementById("nav-documents");
const homeTab = document.getElementById("home-tab");
const documentsTab = document.getElementById("documents-tab");

let currentTheme = "theme1";

// ---------- Theme Configuration ----------
const themeConfig = {
  theme1: {
    body: "linear-gradient(135deg, #2f1d70 0%, #1f1c4d 45%, #0c1530 100%)",
    noteColor: "rgba(255,255,255,0.95)",
  },
  theme2: {
    body: "linear-gradient(135deg, #e6a8d7 0%, #cdb6e6 42%, #87cbdc 100%)",
    noteColor: "rgba(255, 250, 253, 0.95)",
  },
  theme3: {
    body: "linear-gradient(135deg, #7dd8b8 0%, #d1c772 45%, #e68c72 100%)",
    noteColor: "rgba(255, 255, 255, 0.95)",
  },
  theme4: {
    body: "linear-gradient(135deg, #60177e 0%, #24334b 55%, #121a2c 100%)",
    noteColor: "rgba(245, 241, 255, 0.92)",
  },
  theme5: {
    body: "linear-gradient(135deg, #b72f2a 0%, #2a4b7a 100%)",
    noteColor: "rgba(255, 249, 244, 0.94)",
  },
};

// ---------- Task Types (Category Colours) ----------
const taskTypes = [
  { label: "Select Type", value: "", color: "rgba(255, 255, 255, 0.95)", badgeClass: "" },
  { label: "Work", value: "Work", color: "#FFDE59", badgeClass: "💼" },
  { label: "Personal", value: "Personal", color: "#FFC0CB", badgeClass: "🧑" },
  { label: "Urgent", value: "Urgent", color: "#B0BEC5", badgeClass: "⚡" },
  { label: "Fitness", value: "Fitness", color: "#B1EE99", badgeClass: "💪" },
  { label: "Miscellaneous", value: "Miscellaneous", color: "#CAB9F5", badgeClass: "📌" },
];

// ---------- Progress Bar Update ----------
function updateProgress() {
  const notes = document.querySelectorAll(".notes");
  const total = notes.length;
  const completed = document.querySelectorAll(".notes .completed").length;
  const percent = total > 0 ? (completed / total) * 100 : 0;

  progressFill.style.width = `${percent}%`;
  progressText.value = `${completed} / ${total} done`;

  // Toggle empty state
  if (emptyState) {
    emptyState.style.display = total === 0 ? "flex" : "none";
  }
}

// ---------- Update Category Badge ----------
function updateBadge(badge, type) {
  if (type && type.value && type.badgeClass) {
    badge.textContent = `${type.badgeClass} ${type.label}`;
    badge.style.backgroundColor = type.color || "rgba(255,255,255,0.95)";
    badge.style.display = "inline-flex";
  } else {
    badge.style.display = "none";
  }
}

// ---------- Add Task ----------
function addTask(event) {
  if (event) event.preventDefault();

  const taskValue = taskInput.value.trim();
  if (!taskValue) {
    alert("Please enter a task");
    return;
  }

  // Create a note container as <li>
  const note = document.createElement("li");
  note.className = "notes";
  note.style.backgroundColor = themeConfig[currentTheme].noteColor;
  note.dataset.isDefaultTheme = "true";
  // Stagger animation index
  const existingNotes = document.querySelectorAll(".notes");
  note.style.setProperty("--i", existingNotes.length);

  const noteRow = document.createElement("div");
  noteRow.className = "note-row";

  // ── Task Text ──
  const taskText = document.createElement("span");
  taskText.className = "note-text";
  taskText.innerText = taskValue;
  taskText.contentEditable = true;
  taskText.setAttribute("role", "textbox");
  taskText.setAttribute("aria-label", "Editable task text");

  // ── Category Badge ──
  const badge = document.createElement("span");
  badge.className = "category-badge";
  badge.style.display = "none";

  // ── Actions Container ──
  const actions = document.createElement("div");
  actions.className = "note-actions";

  // ── Category Dropdown ──
  const dropdown = document.createElement("select");
  dropdown.style.marginLeft = "10px";

  // Populate dropdown with task types
  taskTypes.forEach((taskType) => {
    const option = document.createElement("option");
    option.value = taskType.value;
    option.innerText = taskType.label;
    dropdown.appendChild(option);
  });

  // Set initial category from main dropdown
  const selectedCategory = taskCategory ? taskCategory.value : "";
  if (selectedCategory) {
    dropdown.value = selectedCategory;
    const selectedType = taskTypes.find((type) => type.value === selectedCategory);
    if (selectedType) {
      note.style.backgroundColor = selectedType.color;
      note.dataset.isDefaultTheme = "false";
      updateBadge(badge, selectedType);
    }
  }

  // ── Dropdown Change ──
  dropdown.addEventListener("change", () => {
    const selectedType = taskTypes.find((type) => type.value === dropdown.value);
    if (selectedType) {
      note.style.backgroundColor = selectedType.color || themeConfig[currentTheme].noteColor;
      note.dataset.isDefaultTheme = dropdown.value === "" ? "true" : "false";
      updateBadge(badge, selectedType);
    } else {
      note.style.backgroundColor = themeConfig[currentTheme].noteColor;
      note.dataset.isDefaultTheme = "true";
      badge.style.display = "none";
    }
  });

  // ── Tick (Complete) Button ──
  const tickIcon = document.createElement("button");
  tickIcon.type = "button";
  tickIcon.className = "note-check";
  tickIcon.innerHTML = "✔ Done";
  tickIcon.setAttribute("aria-label", "Mark task complete");

  tickIcon.addEventListener("click", (event) => {
    taskText.classList.toggle("completed");
    updateProgress();
    event.stopPropagation();
  });

  // ── Delete Button ──
  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "note-delete";
  deleteBtn.innerHTML = "✕ Delete";
  deleteBtn.setAttribute("aria-label", "Delete task");

  deleteBtn.addEventListener("click", () => {
    note.remove();
    updateProgress();
  });

  // ── Assemble ──
  actions.appendChild(dropdown);
  actions.appendChild(tickIcon);
  actions.appendChild(deleteBtn);

  noteRow.appendChild(taskText);
  noteRow.appendChild(badge);
  noteRow.appendChild(actions);

  note.appendChild(noteRow);
  notesContainer.appendChild(note);

  taskInput.value = "";
  taskInput.focus();

  updateProgress();
}

// ---------- Save as PDF ----------
function saveAsPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const tasks = Array.from(document.querySelectorAll(".notes"));

  if (tasks.length === 0) {
    alert("Add at least one task before saving a PDF.");
    return;
  }

  let yPosition = 40;
  const margin = 40;
  const lineHeight = 18;
  const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;

  doc.setFontSize(18);
  doc.text("📋 My To-Do List", margin, yPosition);
  yPosition += 30;

  doc.setFontSize(12);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPosition);
  yPosition += 24;

  doc.setFontSize(14);
  tasks.forEach((task, index) => {
    const taskText = task.querySelector(".note-text");
    const badge = task.querySelector(".category-badge");
    const isCompleted = taskText && taskText.classList.contains("completed");
    const text = taskText ? taskText.textContent.trim() : "";
    const category = badge && badge.style.display !== "none" ? badge.textContent.trim() : "";

    let prefix = `${index + 1}.`;
    if (isCompleted) prefix = `✔ ${index + 1}.`;
    if (category) prefix += ` [${category}]`;

    const wrapped = doc.splitTextToSize(`${prefix} ${text}`, pageWidth);

    if (yPosition + wrapped.length * lineHeight > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      yPosition = margin;
    }

    doc.text(wrapped, margin, yPosition);
    yPosition += wrapped.length * lineHeight + 10;
  });

  const fileName = `ToDoList_${Date.now()}.pdf`;
  const blob = doc.output("blob");
  const fileURL = URL.createObjectURL(blob);
  saveDocument(fileName, fileURL);
  showPDFMessage();
}

// ---------- Document Management ----------
function saveDocument(fileName, fileURL) {
  // Hide empty docs state if visible
  if (emptyDocsState) emptyDocsState.style.display = "none";

  const docItem = document.createElement("li");
  docItem.className = "document-item";

  const nameSpan = document.createElement("span");
  nameSpan.textContent = fileName;

  const actionDiv = document.createElement("div");
  actionDiv.className = "doc-actions";

  const viewBtn = document.createElement("button");
  viewBtn.type = "button";
  viewBtn.textContent = "👁 View";
  viewBtn.addEventListener("click", () => viewPDF(fileURL));

  const downloadBtn = document.createElement("button");
  downloadBtn.type = "button";
  downloadBtn.textContent = "⬇ Download";
  downloadBtn.addEventListener("click", () => downloadPDF(fileURL, fileName));

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.textContent = "✕ Delete";
  deleteBtn.addEventListener("click", function () {
    docItem.remove();
    // Show empty state if no documents left
    if (documentsList && documentsList.children.length === 0 && emptyDocsState) {
      emptyDocsState.style.display = "flex";
    }
  });

  actionDiv.appendChild(viewBtn);
  actionDiv.appendChild(downloadBtn);
  actionDiv.appendChild(deleteBtn);

  docItem.appendChild(nameSpan);
  docItem.appendChild(actionDiv);
  documentsList.appendChild(docItem);
}

function viewPDF(fileURL) {
  window.open(fileURL, "_blank");
}

function downloadPDF(fileURL, fileName) {
  const anchor = document.createElement("a");
  anchor.href = fileURL;
  anchor.download = fileName;
  anchor.click();
}

// ---------- PDF Toast ----------
function showPDFMessage() {
  pdfMessage.style.display = "block";
  setTimeout(() => {
    pdfMessage.style.display = "none";
  }, 2800);
}

// ---------- Tab Navigation ----------
function showHome() {
  homeTab.hidden = false;
  documentsTab.hidden = true;
  navHome.setAttribute("aria-current", "page");
  navDocuments.removeAttribute("aria-current");
}

function showDocuments() {
  homeTab.hidden = true;
  documentsTab.hidden = false;
  navDocuments.setAttribute("aria-current", "page");
  navHome.removeAttribute("aria-current");
}

// ---------- Theme Application ----------
function applyTheme(themeKey) {
  if (!themeConfig[themeKey]) return;
  currentTheme = themeKey;
  document.body.style.background = themeConfig[themeKey].body;
  updateNotesTheme();
}

function updateNotesTheme() {
  const notes = document.querySelectorAll(".notes");
  notes.forEach((note) => {
    if (note.dataset.isDefaultTheme === "true") {
      note.style.backgroundColor = themeConfig[currentTheme].noteColor;
    }
  });
}

// ---------- Event Binding ----------
// Task form submit
taskForm.addEventListener("submit", addTask);

// Save PDF button
savePdfBtn.addEventListener("click", saveAsPDF);

// Enter key in task input (backup for form submit)
taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addTask(event);
  }
});

// Tab navigation
navHome.addEventListener("click", (event) => {
  event.preventDefault();
  showHome();
});

navDocuments.addEventListener("click", (event) => {
  event.preventDefault();
  showDocuments();
});

// Theme buttons (using event delegation on the nav-right)
document.querySelectorAll(".theme-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const theme = btn.getAttribute("data-theme");
    if (theme) applyTheme(theme);
  });
});

// ---------- Init ----------
window.addEventListener("DOMContentLoaded", () => {
  showHome();
  updateProgress();
  if (taskInput) taskInput.focus();

  // Show empty state for docs if no items
  if (documentsList && documentsList.children.length === 0 && emptyDocsState) {
    emptyDocsState.style.display = "flex";
  }
});
