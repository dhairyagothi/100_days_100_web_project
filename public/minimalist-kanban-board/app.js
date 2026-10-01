// Local Storage Keys
const STORAGE_KEY = "kanban_workspace_cards";

// Selectors
const todoLane = document.getElementById("todo-lane");
const progressLane = document.getElementById("progress-lane");
const doneLane = document.getElementById("done-lane");
const addCardBtn = document.getElementById("addCardBtn");
const cardModal = document.getElementById("cardModal");
const cancelModalBtn = document.getElementById("cancelModalBtn");
const submitCardBtn = document.getElementById("submitCardBtn");
const taskTitleInput = document.getElementById("taskTitle");
const taskTagSelect = document.getElementById("taskTag");
const themeToggleBtn = document.getElementById("themeToggleBtn");

const counters = {
  todo: document.getElementById("todo-count"),
  progress: document.getElementById("progress-count"),
  done: document.getElementById("done-count"),
};

let cardsData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// Synchronize and Update Counters
function updateWorkspaceUI() {
  todoLane.innerHTML = "";
  progressLane.innerHTML = "";
  doneLane.innerHTML = "";

  const counts = { todo: 0, progress: 0, done: 0 };

  cardsData.forEach((card) => {
    counts[card.lane]++;
    createCardElement(card);
  });

  Object.keys(counters).forEach((lane) => {
    counters[lane].innerText = counts[lane];
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(cardsData));
}

// Generate DOM Elements dynamically
function createCardElement(card) {
  const cardEl = document.createElement("div");
  cardEl.classList.add("kanban-card");
  cardEl.setAttribute("draggable", "true");
  cardEl.setAttribute("data-id", card.id);

  cardEl.innerHTML = `
        <div class="card-header-bar ${card.tag}"></div>
        <div class="card-content">
            <span class="card-title">${escapeHTML(card.title)}</span>
            <button class="delete-card-btn" aria-label="Delete Card">&times;</button>
        </div>
    `;

  cardEl.addEventListener("dragstart", () => cardEl.classList.add("dragging"));
  cardEl.addEventListener("dragend", () => cardEl.classList.remove("dragging"));

  cardEl.querySelector(".delete-card-btn").addEventListener("click", () => {
    cardsData = cardsData.filter((c) => c.id !== card.id);
    updateWorkspaceUI();
  });

  if (card.lane === "todo") todoLane.appendChild(cardEl);
  if (card.lane === "progress") progressLane.appendChild(cardEl);
  if (card.lane === "done") doneLane.appendChild(cardEl);
}

function escapeHTML(str) {
  return str.replace(
    /[&<>'"]/g,
    (tag) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        tag
      ] || tag,
  );
}

// Lane Setup Hook
[todoLane, progressLane, doneLane].forEach((zone) => {
  zone.addEventListener("dragover", (e) => {
    e.preventDefault();
    zone.classList.add("drag-over");
  });

  zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));

  zone.addEventListener("drop", () => {
    zone.classList.remove("drag-over");
    const activeCardEl = document.querySelector(".dragging");
    if (!activeCardEl) return;

    const cardId = activeCardEl.getAttribute("data-id");
    const targetLane = zone.id.replace("-lane", "");

    const cardIndex = cardsData.findIndex((c) => c.id === cardId);
    if (cardIndex !== -1) {
      cardsData[cardIndex].lane = targetLane;
      updateWorkspaceUI();
    }
  });
});

addCardBtn.addEventListener("click", () => {
  taskTitleInput.value = "";
  cardModal.classList.add("active");
  taskTitleInput.focus();
});

cancelModalBtn.addEventListener("click", () =>
  cardModal.classList.remove("active"),
);

submitCardBtn.addEventListener("click", () => {
  const titleText = taskTitleInput.value.trim();
  if (!titleText) return;

  const newCard = {
    id: "card_" + Date.now(),
    title: titleText,
    tag: taskTagSelect.value,
    lane: "todo",
  };

  cardsData.push(newCard);
  updateWorkspaceUI();
  cardModal.classList.remove("active");
});

updateWorkspaceUI();

// Theme Toggle Event Listener & System Preference Sync
if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  });
}

// Automatically sync theme if system preference changes and no user override is saved
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
  if (!localStorage.getItem("theme")) {
    const nextTheme = e.matches ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", nextTheme);
  }
});
