
// 1. DOM Element References (match HTML ids/classes)
const taskInput = document.getElementById("task");
const taskTypeSelect = document.getElementById("task-category");
const taskList = document.getElementById("notes-container");
const emptyState = document.getElementById("emptyState");
const documentsList = document.querySelector('.documents-list');

// Progress / stats elements present in HTML
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

// Data State
let tasks = [];
let currentFilter = "all";
let currentSearch = "";

// 2. Core Task CRUD & Operations
function addTask() {
  const text = taskInput.value.trim();
  const category = taskTypeSelect.value;
  // Capture priority choice safely
  const priorityElement = document.getElementById("prioritySelect");
  const priorityValue = priorityElement ? priorityElement.value : "medium";

  if (!text) {
    showToast("⚠️ Please enter a task description!");
    return;
  }

  const selectedOption = taskTypeSelect.options[taskTypeSelect.selectedIndex];
  const color = (selectedOption && selectedOption.getAttribute && selectedOption.getAttribute("data-color")) || "#ffb86b";

  const newTask = {
      id: Date.now(),
      text: text,
      category: category || "Misc",
      color: color,
      completed: false,
      priority: priorityValue, // 📌 Saves priority data to item object
      createdAt: new Date().toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short"
      })
  };

  tasks.push(newTask);
  taskInput.value = "";
  taskTypeSelect.value = "";
  if(priorityElement) priorityElement.value = "medium"; // Reset back to default
  
  renderTasks();
  showToast("✅ Task added successfully!");
}

function toggleTask(id) {
  tasks = tasks.map(task => {
    if (task.id === id) return { ...task, completed: !task.completed };
    return task;
  });
  renderTasks();
}

function deleteTask(id) {
  // Triggers exit animation before layout re-render
  const card = document.querySelector(`[data-id="${id}"]`);
  if (card) {
    card.style.animation = "fadeOut 0.25s ease forwards";
    setTimeout(() => {
      tasks = tasks.filter(task => task.id !== id);
      renderTasks();
    }, 250);
  }
}

function clearDone() {
  const previousLength = tasks.length;
  tasks = tasks.filter(task => !task.completed);
  if (tasks.length === previousLength) {
    showToast("ℹ️ No completed tasks to clear.");
  } else {
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
    // Apply main filter
    let passesFilter = false;
    if (currentFilter === "all") {
      passesFilter = true;
    } else if (currentFilter === "pending" || currentFilter === "active") {
      passesFilter = !task.completed;
    } else if (currentFilter === "done" || currentFilter === "completed") {
      passesFilter = task.completed;
    } else {
      passesFilter = task.category === currentFilter; // Matches Category Strings
    }
    
    // Apply search filter (only search task text, not buttons/metadata)
    if (currentSearch.trim()) {
      const searchLower = currentSearch.toLowerCase();
      const taskTextMatch = task.text.toLowerCase().includes(searchLower);
      const categoryMatch = task.category.toLowerCase().includes(searchLower);
      passesFilter = passesFilter && (taskTextMatch || categoryMatch);
    }
    
    return passesFilter;
  });

  // Toggle Visibility of Empty State Element
  if (filteredTasks.length === 0) {
    taskList.innerHTML = "";
    if (emptyState) {
      taskList.appendChild(emptyState);
      emptyState.style.display = "flex";
    }
  } else {
    if (emptyState) emptyState.style.display = "none";
    taskList.innerHTML = "";

    filteredTasks.forEach((task, idx) => {
      const card = document.createElement("div");
      card.className = `notes` + (task.completed ? " completed" : "");
      card.setAttribute("data-id", task.id);
      card.style.setProperty("--i", idx);

      card.innerHTML = `
        <div class="note-row">
          <textarea class="note-text" onchange="updateTaskText(${task.id}, this.value)">${task.text}</textarea>
          <div class="task-timestamp">📅 ${task.createdAt}</div>
          <div class="task-meta-row">
            <div class="category-badge">${task.category}</div>
            <div class="priority-badge ${task.priority}">
              ${task.priority==="high"?"🔴 High":task.priority==="medium"?"🟡 Medium":"🟢 Low"}
            </div>
          </div>
          <div class="note-actions">
            <button class="note-check" onclick="toggleTask(${task.id})">${task.completed ? '✓' : '✔'}</button>
            <button class="note-delete" onclick="deleteTask(${task.id})">Delete</button>
          </div>
        </div>
      `;
      taskList.appendChild(card);
              });
            }

updateMetrics();
updateTaskChart();
}

function updateTaskText(id, newText) {
  tasks = tasks.map(task => {
    if (task.id === id) return { ...task, text: newText.trim() || "Untitled Task" };
    return task;
  });
}

// UPDATE DASHBOARD METRICS
function updateMetrics(){
  const totalTasks=tasks.length;
  const completedTasks=tasks.filter(task=>task.completed).length;
  const inProgressTasks=totalTasks-completedTasks;
  const overdueTasks=0;
  
  // Scans list items that are flagged high priority
  const highPriorityCount = tasks.filter(task => task.priority === "high").length;

  document.getElementById("totalTasks").textContent=totalTasks;
  document.getElementById("inProgressTasks").textContent=inProgressTasks;
  document.getElementById("completedTasks").textContent=completedTasks;
  document.getElementById("overdueTasks").textContent=overdueTasks;
  document.getElementById("highPriorityTasks").textContent = highPriorityCount;
}



// 4. Tab Navigation System
// function showHome() {
//   document.getElementById("btn-home").classList.add("active");
//   document.getElementById("btn-docs").classList.remove("active");
//   document.getElementById("home-tab").style.display = "block";
//   document.getElementById("documents-tab").style.display = "none";
// }

// function showDocuments() {
//   document.getElementById("btn-home").classList.remove("active");
//   document.getElementById("btn-docs").classList.add("active");
//   document.getElementById("home-tab").style.display = "none";
//   document.getElementById("documents-tab").style.display = "block";
// }

function showHome() {
  document.getElementById("home-tab").style.display = "block";
  document.getElementById("documents-tab").style.display = "none";
  document.getElementById("documents-tab").hidden = true;
  document.getElementById("home-tab").hidden = false;
}

function showDocuments() {
  document.getElementById("home-tab").style.display = "none";
  document.getElementById("documents-tab").style.display = "block";
  document.getElementById("home-tab").hidden = true;
  document.getElementById("documents-tab").hidden = false;
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
  try { localStorage.setItem('todo-theme', themeName); } catch (e) {}
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

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(22);
  doc.text("TaskFlow Agenda Report", 20, 24);
  
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 32);
  doc.line(20, 36, 190, 36);

  let verticalCursor = 46;
  doc.setFontSize(12);

  tasks.forEach((task, index) => {
    const status = task.completed ? "[DONE]" : "[PENDING]";
    const printLine = `${index + 1}. ${status} (${task.category}) — ${task.text}`;
    
    doc.text(20, verticalCursor, printLine);
    verticalCursor += 10;
  });

  const fileName = `TaskFlow_${Date.now()}.pdf`;
  const fileURL = URL.createObjectURL(doc.output("blob"));
  
  appendDocumentToList(fileName, fileURL);
  showToast("📥 Exported list to Documents Tab!");
}

function appendDocumentToList(fileName, fileURL) {
  // Clear out documents page empty layout placeholder if present
  const docEmptyState = documentsList.querySelector(".empty-state");
  if (docEmptyState) docEmptyState.remove();

  const docItem = document.createElement("div");
  docItem.className = "doc-item";
  docItem.innerHTML = `
    <div class="doc-icon">📄</div>
    <div class="doc-name">${fileName}</div>
    <div class="doc-date">${new Date().toLocaleDateString()}</div>
    <div class="doc-actions">
      <button class="doc-btn" onclick="window.open('${fileURL}', '_blank')">View</button>
      <a class="doc-btn" href="${fileURL}" download="${fileName}" style="text-decoration:none; display:inline-block; text-align:center;">Download</a>
      <button class="doc-btn del" onclick="removeDocumentItem(this)">Delete</button>
    </div>
  `;
  documentsList.appendChild(docItem);
}

function removeDocumentItem(button) {
  button.closest(".doc-item").remove();
  if (documentsList.children.length === 0) {
    documentsList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🗂️</div>
        <p>No documents saved yet. Export your tasks!</p>
      </div>`;
  }
}

// 7. Toast Alerts Notification System
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
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

// Load saved theme if present
try {
  const saved = localStorage.getItem('todo-theme');
  if (saved) applyTheme(saved);
} catch (e) {}

// Save as PDF button click handler
const savePdfBtn = document.getElementById("savepdf");
if (savePdfBtn) {
  savePdfBtn.addEventListener("click", saveAsPDF);
}


// TASK SEARCH FUNCTIONALITY - Search tasks in real-time
const searchInput = document.getElementById("searchInput");
if(searchInput){
    searchInput.addEventListener("input", (e) => {
        currentSearch = e.target.value;
        renderTasks();
    });
}

// TASK FILTER FUNCTIONALITY - Uses existing render system
function applyTaskFilter(type){
    if(type === "all"){
        currentFilter = "all";
    } else if(type === "active"){
        currentFilter = "active";
    } else if(type === "completed"){
        currentFilter = "completed";
    }
    renderTasks();
}

// TASK ANALYTICS DOUGHNUT CHART - Displays completed vs pending tasks
const ctx = document.getElementById("taskChart");
let taskChart = null;

function updateTaskChart(){
  if(!ctx)return;
  const completedTasks=tasks.filter(task=>task.completed).length;
  const pendingTasks=tasks.length-completedTasks;
  const totalTasks=tasks.length;
  const percentage=totalTasks===0?0:Math.round((completedTasks/totalTasks)*100);
  document.getElementById("completionPercent").innerText=`${percentage}%`;
  document.getElementById("doneCount").innerText=completedTasks;
  document.getElementById("activeCount").innerText=pendingTasks;
  const statusBadge=document.getElementById("statusBadge");
  if(completedTasks === totalTasks &&totalTasks > 0){
    statusBadge.textContent="All done ✨";
  }else{
    statusBadge.textContent="In Progress";
  }
  if(taskChart){taskChart.destroy();}
  taskChart=new Chart(ctx,{
    type:"doughnut",
    data:{
      datasets:[{
        data:[totalTasks === 0 ? 0 : completedTasks, totalTasks === 0 ? 1 : pendingTasks],
        backgroundColor:["#62dbc9","#b06cff"],
        borderWidth:0,
        borderRadius:40
      }]
    },
    options:{
      responsive:true,
      maintainAspectRatio:false,
      cutout:"78%",
      plugins:{legend:{display:false}}
    }
  });
}

renderTasks();
updateTaskChart();
