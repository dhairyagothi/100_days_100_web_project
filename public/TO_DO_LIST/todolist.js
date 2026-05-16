let documentsList = document.getElementById("documents-list");
let toast = document.getElementById("toast");

let currentFilter = "all";

/* =========================
   ADD TASK
========================= */
function addTask() {
  const input = document.getElementById("task-input");
  const category = document.getElementById("task-type-select");
  const taskList = document.getElementById("task-list");
  const emptyState = document.getElementById("empty-state");

  const text = input.value.trim();

  if (text === "") {
    showToast("Please enter a task");
    return;
  }

  // Remove empty state
  if (emptyState) {
    emptyState.style.display = "none";
  }

  const selectedOption =
    category.options[category.selectedIndex];

  const categoryText =
    category.value || "Misc";

  const categoryColor =
    selectedOption.dataset.color || "#ffffff";

  // Create task card
  const taskCard = document.createElement("div");
  taskCard.className = "task-card";
  taskCard.dataset.category = categoryText;
  taskCard.dataset.status = "pending";
  taskCard.style.setProperty("--tag-color", categoryColor);

  taskCard.innerHTML = `
    <button class="task-check">
      ✓
    </button>

    <div class="task-text">
      ${text}
    </div>

    <span class="task-tag">
      ${categoryText}
    </span>

    <button class="task-del">
      ✕
    </button>
  `;

  taskList.appendChild(taskCard);

  // Clear input
  input.value = "";
  category.selectedIndex = 0;

  // Complete task
  const checkBtn =
    taskCard.querySelector(".task-check");

  checkBtn.addEventListener("click", () => {
    taskCard.classList.toggle("done");

    checkBtn.classList.toggle("checked");

    if (taskCard.classList.contains("done")) {
      taskCard.dataset.status = "done";
    } else {
      taskCard.dataset.status = "pending";
    }

    updateStats();
    applyCurrentFilter();
  });

  // Delete task
  const delBtn =
    taskCard.querySelector(".task-del");

  delBtn.addEventListener("click", () => {
    taskCard.style.animation =
      "fadeOut 0.3s ease forwards";

    setTimeout(() => {
      taskCard.remove();

      if (
        document.querySelectorAll(".task-card")
          .length === 0
      ) {
        document.getElementById(
          "empty-state"
        ).style.display = "flex";
      }

      updateStats();
    }, 300);
  });

  updateStats();
  applyCurrentFilter();

  showToast("Task added");
}

/* =========================
   FILTER TASKS
========================= */
function filterTasks(btn, filter) {
  currentFilter = filter;

  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => {
      b.classList.remove("active");
    });

  btn.classList.add("active");

  applyCurrentFilter();
}

function applyCurrentFilter() {
  const tasks =
    document.querySelectorAll(".task-card");

  tasks.forEach((task) => {
    const status = task.dataset.status;
    const category = task.dataset.category;

    let shouldShow = false;

    if (currentFilter === "all") {
      shouldShow = true;
    } else if (currentFilter === "pending") {
      shouldShow = status === "pending";
    } else if (currentFilter === "done") {
      shouldShow = status === "done";
    } else {
      shouldShow = category === currentFilter;
    }

    task.style.display = shouldShow
      ? "flex"
      : "none";
  });
}

/* =========================
   CLEAR DONE
========================= */
function clearDone() {
  const doneTasks =
    document.querySelectorAll(
      ".task-card.done"
    );

  doneTasks.forEach((task) => {
    task.remove();
  });

  if (
    document.querySelectorAll(".task-card")
      .length === 0
  ) {
    document.getElementById(
      "empty-state"
    ).style.display = "flex";
  }

  updateStats();

  showToast("Completed tasks cleared");
}

/* =========================
   UPDATE STATS
========================= */
function updateStats() {
  const allTasks =
    document.querySelectorAll(".task-card");

  const doneTasks =
    document.querySelectorAll(
      ".task-card.done"
    );

  const total = allTasks.length;
  const done = doneTasks.length;
  const pending = total - done;

  document.getElementById(
    "stat-total"
  ).textContent = total;

  document.getElementById(
    "stat-done"
  ).textContent = done;

  document.getElementById(
    "stat-pending"
  ).textContent = pending;

  const percent =
    total === 0
      ? 0
      : Math.round((done / total) * 100);

  document.getElementById(
    "progress-fill"
  ).style.width = `${percent}%`;

  document.getElementById(
    "progress-pct"
  ).textContent = `${percent}%`;
}

/* =========================
   SAVE PDF
========================= */
function saveAsPDF() {
  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();

  const tasks =
    document.querySelectorAll(".task-card");

  if (tasks.length === 0) {
    showToast("No tasks to export");
    return;
  }

  doc.setFontSize(18);
  doc.text("TaskFlow Tasks", 20, 20);

  let y = 40;

  tasks.forEach((task, index) => {
    const text =
      task.querySelector(".task-text")
        .textContent;

    const category =
      task.querySelector(".task-tag")
        .textContent;

    const done =
      task.classList.contains("done")
        ? "✓"
        : "•";

    doc.setFontSize(12);

    doc.text(
      `${done} ${text} (${category})`,
      20,
      y
    );

    y += 10;
  });

  const fileName = `TaskFlow_${Date.now()}.pdf`;

  doc.save(fileName);

  saveDocument(fileName);

  showToast("PDF exported");
}

/* =========================
   SAVE DOCUMENT LIST
========================= */
function saveDocument(fileName) {
  const emptyDoc =
    documentsList.querySelector(
      ".empty-state"
    );

  if (emptyDoc) {
    emptyDoc.remove();
  }

  const docItem =
    document.createElement("div");

  docItem.className = "doc-item";

  docItem.innerHTML = `
    <div class="doc-icon">📄</div>

    <div class="doc-name">
      ${fileName}
    </div>

    <div class="doc-date">
      ${new Date().toLocaleString()}
    </div>

    <div class="doc-actions">
      <button class="doc-btn del">
        Delete
      </button>
    </div>
  `;

  documentsList.appendChild(docItem);

  const delBtn =
    docItem.querySelector(".doc-btn.del");

  delBtn.addEventListener("click", () => {
    docItem.remove();

    if (
      documentsList.children.length === 0
    ) {
      documentsList.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🗂️</div>
          <p>No documents saved yet. Export your tasks!</p>
        </div>
      `;
    }
  });
}

/* =========================
   TOAST
========================= */
function showToast(message) {
  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

/* =========================
   TABS
========================= */
function showHome() {
  document.getElementById(
    "home-tab"
  ).style.display = "block";

  document.getElementById(
    "documents-tab"
  ).style.display = "none";

  document
    .getElementById("btn-home")
    .classList.add("active");

  document
    .getElementById("btn-docs")
    .classList.remove("active");
}

function showDocuments() {
  document.getElementById(
    "home-tab"
  ).style.display = "none";

  document.getElementById(
    "documents-tab"
  ).style.display = "block";

  document
    .getElementById("btn-docs")
    .classList.add("active");

  document
    .getElementById("btn-home")
    .classList.remove("active");
}

/* =========================
   THEMES
========================= */
function applyTheme(theme) {
  document.body.className = "";

  if (theme !== "sunset") {
    document.body.classList.add(
      `theme-${theme}`
    );
  }

  document
    .querySelectorAll(".theme-swatch")
    .forEach((swatch) => {
      swatch.classList.remove("active");
    });

  const activeMap = {
    sunset: "t1",
    ocean: "t2",
    forest: "t3",
    midnight: "t4",
    aurora: "t5",
  };

  document
    .getElementById(activeMap[theme])
    .classList.add("active");
}

/* =========================
   ENTER KEY
========================= */
document
  .getElementById("task-input")
  .addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  });

/* =========================
   INITIALIZE
========================= */
updateStats();
applyTheme("sunset");