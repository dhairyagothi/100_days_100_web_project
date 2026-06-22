// ─── State ────────────────────────────────────────────────────────────────
let tasks = JSON.parse(localStorage.getItem("kanban-board-tasks")) || [
  { id: "k-task-1", title: "Review Open-Source Pull Requests", category: "Work", priority: "High", status: "pending", dueDate: "" },
  { id: "k-task-2", title: "Refactor Theme Style Overlap Rules", category: "Study", priority: "Medium", status: "inprogress", dueDate: "" },
  { id: "k-task-3", title: "Verify Grid Layout Persistence", category: "Personal", priority: "Low", status: "completed", dueDate: "" },
];

let savedDocs = JSON.parse(localStorage.getItem("kanban-saved-docs-meta")) || [];

// ─── DOM refs ─────────────────────────────────────────────────────────────
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task");
const categorySelect = document.getElementById("task-category");
const prioritySelect = document.getElementById("task-priority");
const dueDateInput = document.getElementById("task-date");
const searchInput = document.getElementById("task-search");
const noResultsMsg = document.getElementById("no-results-msg");
const noResultsQuery = document.getElementById("no-results-query");
const emptyState = document.getElementById("emptyState");
const charCounter = document.getElementById("char-counter");

// Set minimum selectable date to today
dueDateInput.min = new Date().toISOString().split("T")[0];

// ─── Priority helpers ──────────────────────────────────────────────────────
function getPriorityClass(priority) {
  if (priority === "High") return "priority-high";
  if (priority === "Medium") return "priority-medium";
  return "priority-low";
}

function getPriorityEmoji(priority) {
  if (priority === "High") return "🔴";
  if (priority === "Medium") return "🟡";
  return "🟢";
}

// ─── Render Kanban Board ───────────────────────────────────────────────────
function renderKanban(filterQuery) {
  document.querySelectorAll(".kanban-column-drop-zone").forEach(z => (z.innerHTML = ""));

  const query = (filterQuery || searchInput.value || "").trim().toLowerCase();
  const visibleTasks = query
    ? tasks.filter(t => t.title.toLowerCase().includes(query))
    : tasks;

  // Show/hide empty state
  if (tasks.length === 0) {
    emptyState.style.display = "flex";
    document.getElementById("kanban-board").style.display = "none";
  } else {
    emptyState.style.display = "none";
    document.getElementById("kanban-board").style.display = "flex";
  }

  // Show/hide no-results
  if (query && visibleTasks.length === 0) {
    noResultsQuery.textContent = query;
    noResultsMsg.style.display = "block";
  } else {
    noResultsMsg.style.display = "none";
  }

  const today = new Date().toISOString().split("T")[0];

  visibleTasks.forEach(task => {
    const laneDropTarget = document.getElementById(task.status);
    if (!laneDropTarget) return;

    const isOverdue = task.dueDate && task.dueDate < today && task.status !== "completed";
    const isDueToday = task.dueDate === today && task.status !== "completed";
    const isCompleted = task.status === "completed";
    const isInProgress = task.status === "inprogress";

    const card = document.createElement("div");
    card.id = task.id;
    card.setAttribute("draggable", "true");
    card.setAttribute("data-taskid", task.id);
    card.setAttribute("role", "listitem");

    let cardClass = "kanban-task-card";
    if (isCompleted) cardClass += " task-completed";
    else if (isOverdue) cardClass += " overdue-task";
    else if (isDueToday) cardClass += " due-today-task";
    card.className = cardClass;

    const priorityClass = getPriorityClass(task.priority || "Medium");
    const priorityEmoji = getPriorityEmoji(task.priority || "Medium");

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
        <span style="font-size:0.65rem; padding:2px 8px; border-radius:4px; background:rgba(255,255,255,0.06); color:rgba(240,240,245,0.7); font-weight:700;">${task.category || "General"}</span>
        <span class="priority-badge ${priorityClass}" aria-label="Priority: ${task.priority || 'Medium'}">${priorityEmoji} ${task.priority || "Medium"}</span>
      </div>
      <p class="card-title-text" aria-label="Task: ${task.title}">${task.title}</p>
      ${task.dueDate ? `<p style="font-size:0.75rem; color:#94a3b8; margin-top:4px;">📅 ${task.dueDate}</p>` : ""}
      ${isOverdue ? `<span class="overdue-badge" aria-label="Overdue">⚠️ Overdue</span>` : ""}
      <div class="card-actions">
        <button
          class="card-action-btn btn-complete ${isCompleted ? "btn-active-complete" : ""}"
          onclick="markTaskCompleted('${task.id}')"
          title="${isCompleted ? "Unmark Completed" : "Mark as Completed"}"
          aria-label="${isCompleted ? "Unmark Completed" : "Mark as Completed"}"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </button>
        <button
          class="card-action-btn btn-inprogress ${isInProgress ? "btn-active-inprogress" : ""}"
          onclick="markTaskInProgress('${task.id}')"
          title="${isInProgress ? "Back to Pending" : "Mark as In Progress"}"
          aria-label="${isInProgress ? "Back to Pending" : "Mark as In Progress"}"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </button>
        <button
          class="card-action-btn btn-delete"
          onclick="deleteTaskNode('${task.id}')"
          title="Delete Task"
          aria-label="Delete Task"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
        </button>
      </div>
    `;

    // Drag events
    card.addEventListener("dragstart", e => {
      card.classList.add("dragging");
      e.dataTransfer.setData("text/plain", task.id);
    });
    card.addEventListener("dragend", () => card.classList.remove("dragging"));

    laneDropTarget.appendChild(card);
  });

  calculateSystemCounters();
}

// ─── Dashboard counters ────────────────────────────────────────────────────
function calculateSystemCounters() {
  const pendingCount = tasks.filter(t => t.status === "pending").length;
  const progressCount = tasks.filter(t => t.status === "inprogress").length;
  const completedCount = tasks.filter(t => t.status === "completed").length;
  const today = new Date().toISOString().split("T")[0];
  const overdueCount = tasks.filter(t => t.dueDate && t.dueDate < today && t.status !== "completed").length;

  const statEls = {
    "count-pending": pendingCount,
    "count-inprogress": progressCount,
    "count-completed": completedCount,
    "totalTasks": tasks.length,
    "dashboardPending": pendingCount,
    "dashboardInProgress": progressCount,
    "dashboardTotalCompleted": completedCount,
    "dashboardOverdue": overdueCount,
  };

  Object.entries(statEls).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  });

  // Hero progress bar
  const heroFill = document.getElementById("heroProgressFill");
  const heroText = document.getElementById("progressText");
  if (tasks.length > 0) {
    const pct = Math.round((completedCount / tasks.length) * 100);
    if (heroFill) heroFill.style.width = `${pct}%`;
    if (heroText) heroText.textContent = `${completedCount} / ${tasks.length} tasks finished (${pct}%)`;
  } else {
    if (heroFill) heroFill.style.width = "0%";
    if (heroText) heroText.textContent = "0 / 0 tasks completed";
  }

  // Show/hide "Clear Completed" button
  const ccBtn = document.getElementById("clearCompletedBtn");
  if (ccBtn) ccBtn.hidden = completedCount === 0;
}

// ─── Persist ───────────────────────────────────────────────────────────────
function saveTasks() {
  localStorage.setItem("kanban-board-tasks", JSON.stringify(tasks));
}

// ─── Character Counter ─────────────────────────────────────────────────────
taskInput.addEventListener("input", () => {
  const currentLen = taskInput.value.length;
  charCounter.textContent = `${currentLen} / 200`;
  if (currentLen > 198) {
    charCounter.classList.add("near-limit");
  } else {
    charCounter.classList.remove("near-limit");
  }
});

// ─── Add task ──────────────────────────────────────────────────────────────
taskForm.addEventListener("submit", e => {
  e.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;

  tasks.push({
    id: "task_" + Date.now(),
    title,
    category: categorySelect.value || "Others",
    priority: prioritySelect.value || "Medium",
    dueDate: dueDateInput.value,
    status: "pending",
  });

  saveTasks();
  renderKanban();
  showToast("✅ Task added!", "success");

  taskInput.value = "";
  charCounter.textContent = "0 / 200";
  charCounter.classList.remove("near-limit");
  categorySelect.selectedIndex = 0;
  prioritySelect.selectedIndex = 0;
  dueDateInput.value = "";
});

// ─── Delete ────────────────────────────────────────────────────────────────
window.deleteTaskNode = function (id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderKanban();
  showToast("🗑️ Task removed!", "info");
};

// ─── Toggle completed ──────────────────────────────────────────────────────
window.markTaskCompleted = function (id) {
  tasks = tasks.map(t =>
    t.id === id ? { ...t, status: t.status === "completed" ? "pending" : "completed" } : t
  );
  saveTasks();
  renderKanban();
  const t = tasks.find(t => t.id === id);
  showToast(t && t.status === "completed" ? "✅ Marked as Completed!" : "🔄 Moved back to Pending!", "success");
};

// ─── Toggle in-progress ────────────────────────────────────────────────────
window.markTaskInProgress = function (id) {
  tasks = tasks.map(t =>
    t.id === id ? { ...t, status: t.status === "inprogress" ? "pending" : "inprogress" } : t
  );
  saveTasks();
  renderKanban();
  const t = tasks.find(t => t.id === id);
  showToast(t && t.status === "inprogress" ? "⚡ Marked as In Progress!" : "🔄 Moved back to Pending!", "info");
};

// ─── Drag-and-drop between columns ────────────────────────────────────────
document.querySelectorAll(".kanban-column-drop-zone").forEach(zone => {
  zone.addEventListener("dragover", e => {
    e.preventDefault();
    zone.classList.add("drag-over");
  });
  zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
  zone.addEventListener("drop", e => {
    e.preventDefault();
    zone.classList.remove("drag-over");
    const droppedId = e.dataTransfer.getData("text/plain");
    const newStatus = zone.id;
    tasks = tasks.map(t => t.id === droppedId ? { ...t, status: newStatus } : t);
    saveTasks();
    renderKanban();
  });
});

// ─── Live search ───────────────────────────────────────────────────────────
searchInput.addEventListener("input", () => renderKanban());

// ─── Toast ────────────────────────────────────────────────────────────────
let _toastTimer = null;

function showToast(message, type) {
  const el = document.getElementById("appToast");
  if (!el) return;
  el.textContent = message;
  el.className = "toast-popup toast-show";
  if (type === "success") el.classList.add("toast-success");
  else if (type === "error") el.classList.add("toast-error");
  else el.classList.add("toast-info");
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => {
    el.classList.remove("toast-show", "toast-success", "toast-error", "toast-info");
  }, 3000);
}

// ─── Tab navigation ────────────────────────────────────────────────────────
window.showHome = function () {
  document.getElementById("home-tab").className = "active-section";
  document.getElementById("documents-tab").className = "inactive-section";
  document.getElementById("nav-home").classList.add("active");
  document.getElementById("nav-documents").classList.remove("active");
};

window.showDocuments = function () {
  document.getElementById("home-tab").className = "inactive-section";
  document.getElementById("documents-tab").className = "active-section";
  document.getElementById("nav-home").classList.remove("active");
  document.getElementById("nav-documents").classList.add("active");
  renderSavedDocuments();
};

// ─── Save as PDF ───────────────────────────────────────────────────────────
function saveAsPDF() {
  if (tasks.length === 0) { showToast("❌ No tasks to export!", "info"); return; }
  if (!window.jspdf) { showToast("⏳ PDF library loading, try again!", "info"); return; }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(22);
  doc.text("To-Do List Report", 20, 24);
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 32);

  const completedCount = tasks.filter(t => t.status === "completed").length;
  const inProgressCount = tasks.filter(t => t.status === "inprogress").length;
  const pendingCount = tasks.filter(t => t.status === "pending").length;
  doc.text(`Total: ${tasks.length}  |  Completed: ${completedCount}  |  In Progress: ${inProgressCount}  |  Pending: ${pendingCount}`, 20, 38);
  doc.line(20, 42, 190, 42);

  let y = 52;
  doc.setFontSize(12);
  tasks.forEach((task, i) => {
    if (y > 270) { doc.addPage(); y = 20; }
    const rawStatus = task.status || "pending";
    const status = rawStatus === "inprogress" ? "IN PROGRESS" : rawStatus.toUpperCase();
    doc.text(`${i + 1}. [${status}] [${task.priority || "Medium"}] [${task.category || "General"}] - ${task.title}`, 20, y);
    y += 10;
  });

  const fileName = `TodoList_${Date.now()}.pdf`;
  const pdfBlob = doc.output("blob");
  const fileURL = URL.createObjectURL(pdfBlob);

  const docEntry = {
    id: Date.now(),
    name: fileName,
    url: fileURL,
    total: tasks.length,
    completed: completedCount,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    date: new Date().toLocaleDateString(),
  };

  savedDocs.unshift(docEntry);
  const meta = savedDocs.map(({ url, ...rest }) => rest);
  localStorage.setItem("kanban-saved-docs-meta", JSON.stringify(meta));
  showToast("📥 PDF saved! Go to Documents to download.", "success");
  renderSavedDocuments();
}

// ─── Render saved documents ────────────────────────────────────────────────
function renderSavedDocuments() {
  const docEmptyState = document.getElementById("emptyDocsState");
  const docsList = document.querySelector(".documents-list");
  if (!docsList) return;
  docsList.innerHTML = "";

  if (savedDocs.length === 0) {
    if (docEmptyState) docEmptyState.style.display = "flex";
  } else {
    if (docEmptyState) docEmptyState.style.display = "none";
    savedDocs.forEach(docEntry => {
      const item = document.createElement("li");
      item.className = "doc-item";
      const hasUrl = !!docEntry.url;
      item.innerHTML = `
        <div class="doc-info">
          <div class="doc-name">📄 ${docEntry.name}</div>
          <div class="doc-meta">
            <span class="doc-date">${docEntry.date} ${docEntry.time}</span>
            <span class="doc-task-count">${docEntry.total} tasks · ${docEntry.completed} completed</span>
          </div>
          ${!hasUrl ? '<div class="doc-stale">⚠️ File unavailable after reload — re-export to download again.</div>' : ""}
        </div>
        <div class="doc-actions">
          ${hasUrl ? `<button class="doc-btn" onclick="window.open('${docEntry.url}', '_blank')">View</button>` : ""}
          ${hasUrl ? `<a class="doc-btn" href="${docEntry.url}" download="${docEntry.name}">Download</a>` : ""}
          <button class="doc-btn doc-btn-del" onclick="deleteDocEntry('${docEntry.id}')">Delete</button>
        </div>
      `;
      docsList.appendChild(item);
    });
  }
}

window.deleteDocEntry = function (id) {
  savedDocs = savedDocs.filter(d => String(d.id) !== String(id));
  const meta = savedDocs.map(({ url, ...rest }) => rest);
  localStorage.setItem("kanban-saved-docs-meta", JSON.stringify(meta));
  renderSavedDocuments();
  showToast("🗑️ Document removed!", "info");
};

// ─── Sidebar button wiring ─────────────────────────────────────────────────
document.getElementById("savepdf").addEventListener("click", saveAsPDF);

document.getElementById("cleardone").addEventListener("click", () => {
  document.getElementById("clearModal").style.display = "flex";
});

document.getElementById("modalCancelBtn").addEventListener("click", () => {
  document.getElementById("clearModal").style.display = "none";
});

document.getElementById("modalConfirmBtn").addEventListener("click", () => {
  tasks = [];
  saveTasks();
  renderKanban();
  document.getElementById("clearModal").style.display = "none";
  showToast("🧹 Workspace cleared!", "info");
});

document.getElementById("clearModal").addEventListener("click", e => {
  if (e.target === document.getElementById("clearModal"))
    document.getElementById("clearModal").style.display = "none";
});

const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const clearCompletedModal = document.getElementById("clearCompletedModal");

clearCompletedBtn.addEventListener("click", () => {
  const completedCount = tasks.filter(t => t.status === "completed").length;
  if (completedCount === 0) { showToast("✨ No completed tasks to clear!", "info"); return; }
  clearCompletedModal.style.display = "flex";
});

document.getElementById("completedModalCancelBtn").addEventListener("click", () => {
  clearCompletedModal.style.display = "none";
});

document.getElementById("completedModalConfirmBtn").addEventListener("click", () => {
  tasks = tasks.filter(t => t.status !== "completed");
  saveTasks();
  renderKanban();
  clearCompletedModal.style.display = "none";
  showToast("✅ Completed tasks cleared!", "success");
});

clearCompletedModal.addEventListener("click", e => {
  if (e.target === clearCompletedModal) clearCompletedModal.style.display = "none";
});

// ─── Theme switching ───────────────────────────────────────────────────────
const themeButtons = document.querySelectorAll(".theme-btn");

function applyTheme(theme) {
  document.body.classList.remove("theme1", "theme2", "theme3", "theme4", "theme5");
  document.body.classList.add(theme);
  themeButtons.forEach(btn =>
    btn.classList.toggle("active", btn.dataset.theme === theme)
  );
}

themeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const theme = btn.dataset.theme;
    applyTheme(theme);
    localStorage.setItem("selectedTheme", theme);
    showToast("🎨 Theme changed!", "success");
  });
});

// ─── Init ─────────────────────────────────────────────────────────────────
function init() {
  const savedTheme = localStorage.getItem("selectedTheme") || "theme1";
  applyTheme(savedTheme);
  renderKanban();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
