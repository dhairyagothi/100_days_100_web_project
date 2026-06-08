// Localized State Management Initialization Loop
let tasks = JSON.parse(localStorage.getItem("eisenhower-tasks")) || [];

// Target Selection Handles
const taskInput = document.getElementById("taskInput");
const quadrantSelect = document.getElementById("quadrantSelect");
const addTaskBtn = document.getElementById("addTaskBtn");

const quadrants = [
  "urgent-important",
  "important-not-urgent",
  "urgent-not-important",
  "neither",
];

// Main Interface DOM Synchronizer
function renderMatrix() {
  // Empty out existing workspace dropzones
  quadrants.forEach((qId) => {
    document.getElementById(`dz-${qId}`).innerHTML = "";
    document.getElementById(`count-${qId}`).innerText = "0";
  });

  const counts = {
    "urgent-important": 0,
    "important-not-urgent": 0,
    "urgent-not-important": 0,
    neither: 0,
  };

  tasks.forEach((task) => {
    if (counts[task.quadrant] !== undefined) {
      counts[task.quadrant]++;
      createTaskCardDOM(task);
    }
  });

  // Sync metric count numbers
  quadrants.forEach((qId) => {
    document.getElementById(`count-${qId}`).innerText = counts[qId];
  });

  // Persist changes to local state storage
  localStorage.setItem("eisenhower-tasks", JSON.stringify(tasks));
}

// Create Card Component Nodes and Register Drag Handlers
function createTaskCardDOM(task) {
  const dropzone = document.getElementById(`dz-${task.quadrant}`);

  const card = document.createElement("div");
  card.className = "task-card";
  card.setAttribute("draggable", "true");
  card.setAttribute("id", `task-${task.id}`);

  card.innerHTML = `
        <span class="task-text">${escapeHTML(task.text)}</span>
        <button class="delete-task-btn" data-id="${task.id}">&times;</button>
    `;

  // Native Drag Launch Handler
  card.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", task.id);
    card.style.opacity = "0.5";
  });

  card.addEventListener("dragend", () => {
    card.style.opacity = "1";
  });

  // Delete Trigger Listener Hook
  card.querySelector(".delete-task-btn").addEventListener("click", () => {
    tasks = tasks.filter((t) => t.id !== task.id);
    renderMatrix();
  });

  dropzone.appendChild(card);
}

// Setup Dragover Landing Mechanics on Targets
quadrants.forEach((qId) => {
  const dz = document.getElementById(`dz-${qId}`);

  dz.addEventListener("dragover", (e) => {
    e.preventDefault(); // Required to allow landing drops
    dz.classList.add("dragover");
  });

  dz.addEventListener("dragleave", () => {
    dz.classList.remove("dragover");
  });

  dz.addEventListener("drop", (e) => {
    e.preventDefault();
    dz.classList.remove("dragover");

    const droppedTaskId = parseInt(e.dataTransfer.getData("text/plain"));
    const taskIndex = tasks.findIndex((t) => t.id === droppedTaskId);

    if (taskIndex !== -1) {
      tasks[taskIndex].quadrant = qId;
      renderMatrix();
    }
  });
});

// Event Handler: Creating a New Task Card
addTaskBtn.addEventListener("click", () => {
  const textValue = taskInput.value.trim();
  if (!textValue) return;

  const newTask = {
    id: Date.now(),
    text: textValue,
    quadrant: quadrantSelect.value,
  };

  tasks.push(newTask);
  taskInput.value = "";
  renderMatrix();
});

// Keypress listener for 'Enter' key convenience
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTaskBtn.click();
});

// Helper validation module mapping to escape code injection exploits
function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Initial Boot Cycle Run
renderMatrix();
