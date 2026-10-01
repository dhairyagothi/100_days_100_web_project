let roadmaps = [];
let currentEditingRoadmapId = null;

const STATUS_COLORS = {
  "not-started": "secondary",
  "in-progress": "warning",
  completed: "success",
};

// Load data from localStorage
function loadData() {
  const saved = localStorage.getItem("roadmaps");
  if (saved) {
    roadmaps = JSON.parse(saved);
  }
  renderAll();
}

// Save data to localStorage
function saveData() {
  localStorage.setItem("roadmaps", JSON.stringify(roadmaps));
}

// Calculate progress percentage for a roadmap
function calculateProgress(roadmap) {
  let totalTopics = 0;
  let completed = 0;

  roadmap.categories.forEach((cat) => {
    totalTopics += cat.topics.length;
    cat.topics.forEach((topic) => {
      if (topic.status === "completed") completed++;
    });
  });

  return totalTopics === 0 ? 0 : Math.round((completed / totalTopics) * 100);
}

// Render Dashboard
function renderDashboard() {
  let totalTopics = 0;
  let totalCompleted = 0;

  roadmaps.forEach((r) => {
    r.categories.forEach((cat) => {
      totalTopics += cat.topics.length;
      cat.topics.forEach((t) => {
        if (t.status === "completed") totalCompleted++;
      });
    });
  });

  const overallPct =
    totalTopics === 0 ? 0 : Math.round((totalCompleted / totalTopics) * 100);

  document.getElementById("overall-progress").textContent = `${overallPct}%`;
  document.getElementById("overall-progress-bar").style.width =
    `${overallPct}%`;
  document.getElementById("active-roadmaps").textContent = roadmaps.length;
  document.getElementById("completed-topics").textContent = totalCompleted;

  // Recent roadmaps preview
  const container = document.getElementById("dashboard-roadmaps");
  container.innerHTML = "";

  if (roadmaps.length === 0) {
    container.innerHTML = `<div class="col-12"><div class="alert alert-info">No roadmaps yet. Create your first one!</div></div>`;
    return;
  }

  roadmaps.slice(0, 6).forEach((roadmap) => {
    const progress = calculateProgress(roadmap);
    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-4 mb-3";
    col.innerHTML = `
            <div class="card roadmap-card h-100" onclick="viewRoadmapDetail('${roadmap.id}')">
                <div class="card-body">
                    <h5 class="card-title">${roadmap.title}</h5>
                    <p class="card-text text-muted small">${roadmap.description || "No description provided"}</p>
                    <div class="progress mb-2" style="height: 10px;">
                        <div class="progress-bar bg-primary" style="width: ${progress}%"></div>
                    </div>
                    <small class="text-muted">${progress}% Complete</small>
                </div>
            </div>
        `;
    container.appendChild(col);
  });
}

// Render All Roadmaps List
function renderRoadmapsList() {
  const container = document.getElementById("roadmaps-list");
  container.innerHTML = "";

  if (roadmaps.length === 0) {
    container.innerHTML = `<div class="col-12"><div class="alert alert-info">No roadmaps created yet. <a href="#" onclick="showCreateModal()">Create your first roadmap</a></div></div>`;
    return;
  }

  roadmaps.forEach((roadmap) => {
    const progress = calculateProgress(roadmap);
    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-4 mb-4";
    col.innerHTML = `
            <div class="card h-100 roadmap-card" onclick="viewRoadmapDetail('${roadmap.id}')">
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start">
                        <h5 class="card-title">${roadmap.title}</h5>
                        <button onclick="event.stopImmediatePropagation(); deleteRoadmap('${roadmap.id}');" class="btn btn-sm btn-outline-danger">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                    <p class="card-text text-muted flex-grow-1">${roadmap.description || ""}</p>
                    <div>
                        <div class="progress mb-2" style="height: 12px;">
                            <div class="progress-bar bg-primary" style="width: ${progress}%"></div>
                        </div>
                        <small class="text-muted">${progress}% • ${roadmap.categories.reduce((sum, c) => sum + c.topics.length, 0)} topics</small>
                    </div>
                </div>
            </div>
        `;
    container.appendChild(col);
  });
}

// Switch between sections
function showSection(section) {
  document.getElementById("dashboard-section").classList.add("d-none");
  document.getElementById("roadmaps-section").classList.add("d-none");
  document.getElementById("roadmap-detail").classList.add("d-none");

  if (section === "dashboard") {
    document.getElementById("dashboard-section").classList.remove("d-none");
    renderDashboard();
  } else if (section === "roadmaps") {
    document.getElementById("roadmaps-section").classList.remove("d-none");
    renderRoadmapsList();
  }

  // Update active nav link
  document
    .querySelectorAll(".nav-link")
    .forEach((link) => link.classList.remove("active"));
  const activeLink = document.getElementById(`nav-${section}`);
  if (activeLink) activeLink.classList.add("active");
}

// Show Create/Edit Modal
function showCreateModal(editId = null) {
  currentEditingRoadmapId = editId;
  const modal = new bootstrap.Modal(document.getElementById("createModal"));
  document.getElementById("modalTitle").textContent = editId
    ? "Edit Roadmap"
    : "Create New Roadmap";

  document.getElementById("roadmapForm").reset();
  document.getElementById("modal-categories").innerHTML = "";

  if (editId) {
    const roadmap = roadmaps.find((r) => r.id === editId);
    if (roadmap) {
      document.getElementById("roadmapTitle").value = roadmap.title;
      document.getElementById("roadmapDesc").value = roadmap.description || "";

      roadmap.categories.forEach((cat) => {
        addCategoryModal(cat.name, cat.topics);
      });
    }
  } else {
    addCategoryModal("Fundamentals"); // Default category
  }

  modal.show();
}

// Add Category in Modal
function addCategoryModal(name = "", topics = []) {
  const container = document.getElementById("modal-categories");
  const div = document.createElement("div");
  div.className = "border rounded p-3 mb-3 bg-light";
  div.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-3">
            <input type="text" class="form-control category-name" value="${name}" placeholder="Category Name (e.g. HTML & CSS)">
            <button onclick="this.closest('.border').remove()" class="btn btn-sm btn-outline-danger ms-2">Remove</button>
        </div>
        <div class="topics-list mb-3"></div>
        <button onclick="addSampleTopic(this)" class="btn btn-sm btn-outline-secondary">+ Add Topic</button>
    `;

  const topicsList = div.querySelector(".topics-list");
  topics.forEach((topic) => {
    const tDiv = document.createElement("div");
    tDiv.className =
      "d-flex align-items-center mb-2 p-2 border rounded topic-item";
    tDiv.innerHTML = `
            <span class="flex-grow-1">${topic.title}</span>
            <span class="badge bg-${STATUS_COLORS[topic.status]}">${topic.status.replace("-", " ")}</span>
        `;
    topicsList.appendChild(tDiv);
  });

  container.appendChild(div);
}

// Add sample topic in modal
function addSampleTopic(btn) {
  const topicsList = btn.parentElement.querySelector(".topics-list");
  const topicDiv = document.createElement("div");
  topicDiv.className =
    "d-flex align-items-center mb-2 p-2 border rounded topic-item";
  topicDiv.innerHTML = `
        <span class="flex-grow-1">New Topic</span>
        <span class="badge bg-secondary">Not Started</span>
    `;
  topicsList.appendChild(topicDiv);
}

// Save Roadmap
function saveRoadmap() {
  const title = document.getElementById("roadmapTitle").value.trim();
  if (!title) {
    alert("Roadmap title is required!");
    return;
  }

  const description = document.getElementById("roadmapDesc").value.trim();
  const categories = [];

  document.querySelectorAll("#modal-categories .border").forEach((catEl) => {
    const catName = catEl.querySelector(".category-name").value.trim();
    if (!catName) return;

    const topics = [];
    catEl.querySelectorAll(".topics-list .topic-item").forEach((item) => {
      const title = item.querySelector("span:first-child").textContent.trim();
      if (title && title !== "New Topic") {
        topics.push({
          id: "t-" + Date.now() + Math.random().toString(36).substr(2, 5),
          title: title,
          status: "not-started",
        });
      }
    });

    categories.push({
      id: "c-" + Date.now() + Math.random().toString(36).substr(2, 5),
      name: catName,
      topics:
        topics.length > 0
          ? topics
          : [
              {
                id: "t-" + Date.now(),
                title: "Introduction",
                status: "not-started",
              },
            ],
    });
  });

  if (categories.length === 0) {
    alert("Please add at least one category.");
    return;
  }

  if (currentEditingRoadmapId) {
    const index = roadmaps.findIndex((r) => r.id === currentEditingRoadmapId);
    if (index !== -1) {
      roadmaps[index].title = title;
      roadmaps[index].description = description;
      roadmaps[index].categories = categories;
    }
  } else {
    roadmaps.push({
      id: "rm-" + Date.now(),
      title: title,
      description: description,
      categories: categories,
    });
  }

  saveData();
  bootstrap.Modal.getInstance(document.getElementById("createModal")).hide();
  renderAll();
  showSection("roadmaps");
}

// View Roadmap Detail
function viewRoadmapDetail(id) {
  const roadmap = roadmaps.find((r) => r.id === id);
  if (!roadmap) return;

  currentEditingRoadmapId = id;

  document.getElementById("dashboard-section").classList.add("d-none");
  document.getElementById("roadmaps-section").classList.add("d-none");
  document.getElementById("roadmap-detail").classList.remove("d-none");

  document.getElementById("detail-title").textContent = roadmap.title;
  document.getElementById("detail-desc").textContent =
    roadmap.description || "";

  const progress = calculateProgress(roadmap);
  const progressBar = document.getElementById("detail-progress-bar");
  progressBar.style.width = `${progress}%`;
  document.getElementById("detail-progress-text").textContent =
    `${progress}% Complete`;

  renderCategories(roadmap);
}

// Render Categories in Detail View
function renderCategories(roadmap) {
  const container = document.getElementById("categories-container");
  container.innerHTML = "";

  roadmap.categories.forEach((category, catIndex) => {
    const catDiv = document.createElement("div");
    catDiv.className = "card mb-4";
    catDiv.innerHTML = `
            <div class="card-header category-header d-flex justify-content-between align-items-center" onclick="toggleCategory(this)">
                <h5 class="mb-0">${category.name}</h5>
                <i class="bi bi-chevron-down"></i>
            </div>
            <div class="card-body collapse show">
                <div class="list-group" id="topics-list-${catIndex}"></div>
                <button onclick="addNewTopic(${catIndex})" class="btn btn-sm btn-outline-primary mt-3">
                    <i class="bi bi-plus-circle"></i> Add Topic
                </button>
            </div>
        `;

    const topicsContainer = catDiv.querySelector(`#topics-list-${catIndex}`);

    category.topics.forEach((topic, topicIndex) => {
      const topicEl = document.createElement("div");
      topicEl.className =
        "list-group-item d-flex justify-content-between align-items-center topic-item";
      topicEl.innerHTML = `
                <div class="flex-grow-1">${topic.title}</div>
                <div class="d-flex align-items-center gap-2">
                    <select onchange="updateTopicStatus('${roadmap.id}', ${catIndex}, ${topicIndex}, this.value)" class="form-select form-select-sm w-auto">
                        <option value="not-started" ${topic.status === "not-started" ? "selected" : ""}>Not Started</option>
                        <option value="in-progress" ${topic.status === "in-progress" ? "selected" : ""}>In Progress</option>
                        <option value="completed" ${topic.status === "completed" ? "selected" : ""}>Completed</option>
                    </select>
                    <button onclick="deleteTopic('${roadmap.id}', ${catIndex}, ${topicIndex}); event.stopImmediatePropagation()" class="btn btn-sm btn-outline-danger">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `;
      topicsContainer.appendChild(topicEl);
    });

    container.appendChild(catDiv);
  });
}

function toggleCategory(header) {
  const body = header.nextElementSibling;
  body.classList.toggle("show");
  const icon = header.querySelector("i");
  if (body.classList.contains("show")) {
    icon.classList.replace("bi-chevron-up", "bi-chevron-down");
  } else {
    icon.classList.replace("bi-chevron-down", "bi-chevron-up");
  }
}

function addNewTopic(catIndex) {
  const roadmap = roadmaps.find((r) => r.id === currentEditingRoadmapId);
  if (!roadmap) return;

  const title = prompt("Enter new topic title:");
  if (!title || title.trim() === "") return;

  if (!roadmap.categories[catIndex].topics)
    roadmap.categories[catIndex].topics = [];

  roadmap.categories[catIndex].topics.push({
    id: "t-" + Date.now(),
    title: title.trim(),
    status: "not-started",
  });

  saveData();
  renderCategories(roadmap);

  // Refresh progress
  const progress = calculateProgress(roadmap);
  document.getElementById("detail-progress-bar").style.width = `${progress}%`;
  document.getElementById("detail-progress-text").textContent =
    `${progress}% Complete`;
}

function updateTopicStatus(roadmapId, catIndex, topicIndex, newStatus) {
  const roadmap = roadmaps.find((r) => r.id === roadmapId);
  if (roadmap) {
    roadmap.categories[catIndex].topics[topicIndex].status = newStatus;
    saveData();

    const progress = calculateProgress(roadmap);
    document.getElementById("detail-progress-bar").style.width = `${progress}%`;
    document.getElementById("detail-progress-text").textContent =
      `${progress}% Complete`;

    if (
      !document.getElementById("dashboard-section").classList.contains("d-none")
    ) {
      renderDashboard();
    }
  }
}

function deleteTopic(roadmapId, catIndex, topicIndex) {
  if (!confirm("Delete this topic?")) return;

  const roadmap = roadmaps.find((r) => r.id === roadmapId);
  if (roadmap) {
    roadmap.categories[catIndex].topics.splice(topicIndex, 1);
    saveData();
    renderCategories(roadmap);
  }
}

function deleteRoadmap(id) {
  if (!confirm("Delete this entire roadmap?")) return;
  roadmaps = roadmaps.filter((r) => r.id !== id);
  saveData();
  renderAll();
  showSection("roadmaps");
}

function backToRoadmaps() {
  showSection("roadmaps");
}

function renderAll() {
  renderDashboard();
  renderRoadmapsList();
}

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  loadData();
  showSection("dashboard");
});
