const getTodayStr = () => new Date().toISOString().split('T')[0];

// State
let habits = JSON.parse(localStorage.getItem("habits")) || [];
let userStats = JSON.parse(localStorage.getItem("userStats")) || { totalCompletions: 0 };
let currentFilter = "all";
let searchQuery = "";
let selectedHabitIndex = null;
let editingIndex = null;
let habitToDeleteIndex = null;
let quill;

// DOM Elements
const habitList = document.getElementById("habitList");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const viewTitle = document.getElementById("viewTitle");
const motivationalBanner = document.getElementById("motivationalBanner");

// KPI
const kpiCompletedRatio = document.getElementById("kpiCompletedRatio");
const kpiCurrentStreak = document.getElementById("kpiCurrentStreak");
const kpiBestStreak = document.getElementById("kpiBestStreak");
const kpiCompletionRate = document.getElementById("kpiCompletionRate");
const progressRing = document.getElementById("progressRing");
const progressText = document.getElementById("progressText");

// Panels
const overviewContext = document.getElementById("overviewContext");
const habitDetailsSection = document.getElementById("habitDetailsSection");
const closeDetailsBtn = document.getElementById("closeDetailsBtn");
const detailsTitle = document.getElementById("detailsTitle");
const detailsStatus = document.getElementById("detailsStatus");

// Modals / Drawers
const fabAdd = document.getElementById("fabAdd");
const addModal = document.getElementById("addModal");
const editDrawer = document.getElementById("editDrawer");
const editDrawerOverlay = document.getElementById("editDrawerOverlay");
const deleteModal = document.getElementById("deleteModal");

// Mobile sidebar
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const closeMenuBtn = document.getElementById("closeMenuBtn");
const sidebar = document.querySelector(".sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");

// Add Inputs
const addHabitInput = document.getElementById("addHabitInput");
const addHabitCategory = document.getElementById("addHabitCategory");
const addHabitTimeLabel = document.getElementById("addHabitTimeLabel");
const addHabitPriority = document.getElementById("addHabitPriority");

// Edit Inputs
const editHabitInput = document.getElementById("editHabitInput");
const editHabitCategory = document.getElementById("editHabitCategory");
const editHabitTimeLabel = document.getElementById("editHabitTimeLabel");
const editHabitPriority = document.getElementById("editHabitPriority");

/* SAVE HABITS */
function saveData() {
  localStorage.setItem("habits", JSON.stringify(habits));
  localStorage.setItem("userStats", JSON.stringify(userStats));
}

// Data Migration — normalize legacy schema
habits = habits.map(h => {
  const todayStr = getTodayStr();
  let hnew = { ...h };
  hnew.category  = hnew.category  || "Personal";
  hnew.timeLabel = hnew.timeLabel || "Anytime";
  hnew.priority  = hnew.priority  || false;
  hnew.createdAt = hnew.createdAt || todayStr;
  hnew.notes     = hnew.notes     || "";
  hnew.history   = hnew.history   || [];

  if (hnew.completed && hnew.history.length === 0) {
    hnew.history.push(todayStr);
  }

  hnew.completed = hnew.history.includes(todayStr);
  return hnew;
});

saveData();

/* QUILL */
function initQuill() {
  quill = new Quill("#editor", {
    theme: "snow",
    placeholder: "Write your notes or reflections here...",
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["clean"]
      ]
    }
  });

  quill.on("text-change", (delta, oldDelta, source) => {
    if (source === "user" && selectedHabitIndex !== null && habits[selectedHabitIndex]) {
      habits[selectedHabitIndex].notes = quill.root.innerHTML;
      saveData();
    }
  });
}

/* STREAK HELPERS */
function getHabitStreak(history) {
  if (!history || history.length === 0) return 0;

  const sorted = [...new Set(history)].sort((a, b) => b.localeCompare(a));
  let streak = 0;
  let currentCheckDate = new Date();
  let currentStr = currentCheckDate.toISOString().split("T")[0];

  if (sorted.includes(currentStr)) {
    streak++;
    currentCheckDate.setDate(currentCheckDate.getDate() - 1);
  } else {
    currentCheckDate.setDate(currentCheckDate.getDate() - 1);
    let yesterdayStr = currentCheckDate.toISOString().split("T")[0];

    if (sorted.includes(yesterdayStr)) {
      streak++;
      currentCheckDate.setDate(currentCheckDate.getDate() - 1);
    } else {
      return 0;
    }
  }

  while (true) {
    let checkStr = currentCheckDate.toISOString().split("T")[0];
    if (sorted.includes(checkStr)) {
      streak++;
      currentCheckDate.setDate(currentCheckDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

function generateHistoryDots(history) {
  let html = '<div class="history-tracker">';
  const today = new Date();

  for (let i = 4; i >= 0; i--) {
    let d = new Date(today);
    d.setDate(d.getDate() - i);
    let dStr = d.toISOString().split("T")[0];
    let isDone = history.includes(dStr);
    html += `<span class="history-dot ${isDone ? "done" : ""}" title="${dStr}"></span>`;
  }

  html += "</div>";
  return html;
}

/* RENDER DASHBOARD */
function renderDashboard() {
  const todayStr = getTodayStr();
  habitList.innerHTML = "";

  let totalHabits = habits.length;
  let todayCompleted = 0;
  let maxStreak = 0;
  let totalHistoricalCompletions = 0;
  let totalPossibleDays = 0;

  habits.forEach(h => {
    if (h.completed) todayCompleted++;

    const streak = getHabitStreak(h.history);
    if (streak > maxStreak) maxStreak = streak;

    totalHistoricalCompletions += h.history.length;

    let createdDate = new Date(h.createdAt);
    let today = new Date();
    let diffTime = Math.abs(today - createdDate);
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    totalPossibleDays += diffDays || 1;
  });

  let progressRatio = totalHabits > 0 ? Math.round((todayCompleted / totalHabits) * 100) : 0;
  let overallRate   = totalPossibleDays > 0 ? Math.round((totalHistoricalCompletions / totalPossibleDays) * 100) : 0;

  kpiCompletedRatio.textContent  = `${todayCompleted}/${totalHabits} Habits`;
  kpiCurrentStreak.textContent   = `${maxStreak} Days`;
  kpiCompletionRate.textContent  = `${overallRate}%`;

  userStats.bestStreak = Math.max(userStats.bestStreak || 0, maxStreak);
  kpiBestStreak.textContent = `${userStats.bestStreak} Days`;

  saveData();

  progressRing.setAttribute("stroke-dasharray", `${progressRatio}, 100`);
  progressText.textContent = `${progressRatio}%`;

  if (totalHabits === 0)
    motivationalBanner.textContent = "Start your journey by creating a habit.";
  else if (progressRatio === 100)
    motivationalBanner.textContent = "Incredible! You've crushed everything today.";
  else if (progressRatio >= 50)
    motivationalBanner.textContent = "You're halfway there, keep it up!";
  else
    motivationalBanner.textContent = "Every small step counts towards your goals.";

  renderHeatmap();
  renderWeeklyChart();
  renderAchievements(maxStreak, totalHistoricalCompletions, totalHabits);

  const filteredHabits = habits
    .map((habit, index) => ({ ...habit, originalIndex: index }))
    .filter(habit => {
      if (searchQuery && !habit.name.toLowerCase().includes(searchQuery)) return false;
      if (currentFilter === "all" || currentFilter === "dashboard") return true;
      if (currentFilter === "today")         return habit.timeLabel !== "Anytime" || !habit.completed;
      if (currentFilter === "completed")     return habit.completed;
      if (currentFilter === "missed")        return !habit.completed && habit.history.length > 0;
      if (currentFilter === "high-priority") return habit.priority;
      if (["Health", "Work", "Personal"].includes(currentFilter)) return habit.category === currentFilter;
      return true;
    });

  if (filteredHabits.length === 0) {
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
  }

  filteredHabits.forEach(habitItem => {
    const index = habitItem.originalIndex;
    const habit = habits[index];
    const streak = getHabitStreak(habit.history);

    const li = document.createElement("li");
    li.className = `habit-card fade-in ${index === selectedHabitIndex ? "active-card" : ""}`;

    let catColor =
      habit.category === "Health" ? "var(--danger-color)" :
      habit.category === "Work"   ? "var(--accent-primary)" :
      "#f59e0b";

    let priorityFlag = habit.priority
      ? `<i data-lucide="star" class="priority-icon" fill="currentColor"></i>`
      : "";

    let timeBadge = habit.timeLabel !== "Anytime"
      ? `<span class="time-badge">${habit.timeLabel}</span>`
      : "";

    let streakBadge = streak > 0
      ? `<span class="streak-badge">🔥 ${streak}</span>`
      : "";

    li.innerHTML = `
      <div class="habit-left">
        <button class="checkbox-btn ${habit.completed ? "checked" : ""}" title="Mark as done">
          ${habit.completed
            ? '<i data-lucide="check-circle-2"></i>'
            : '<i data-lucide="circle"></i>'
          }
        </button>

        <div class="habit-details-wrap">
          <div class="habit-title-row">
            ${priorityFlag}
            <span class="habit-name ${habit.completed ? "completed" : ""}">
              ${habit.name}
            </span>
          </div>

          <div class="habit-meta-row">
            <span class="category-dot" style="background:${catColor}"></span>
            ${timeBadge}
            ${streakBadge}
            ${generateHistoryDots(habit.history)}
          </div>
        </div>
      </div>

      <div class="habit-actions">
        <button class="icon-btn edit-btn" title="Edit Habit">
          <i data-lucide="more-horizontal"></i>
        </button>
      </div>
    `;

    li.addEventListener("click", e => {
      if (e.target.closest(".checkbox-btn") || e.target.closest(".habit-actions")) return;
      selectHabit(index);
    });

    const checkboxBtn = li.querySelector(".checkbox-btn");
    checkboxBtn.addEventListener("click", e => {
      e.stopPropagation();
      habit.completed = !habit.completed;

      if (habit.completed) {
        if (!habit.history.includes(todayStr)) habit.history.push(todayStr);
        userStats.totalCompletions = (userStats.totalCompletions || 0) + 1;
      } else {
        habit.history = habit.history.filter(d => d !== todayStr);
        userStats.totalCompletions = Math.max(0, (userStats.totalCompletions || 0) - 1);
      }

      saveData();
      renderDashboard();
    });

    const editBtn = li.querySelector(".edit-btn");
    editBtn.addEventListener("click", e => {
      e.stopPropagation();
      openEditDrawer(index);
    });

    habitList.appendChild(li);
  });

  lucide.createIcons();
}

/* FILTERS */
function handleFilterChange(filterId) {
  currentFilter = filterId;

  document.querySelectorAll(".sidebar-nav .nav-item").forEach(nav => {
    nav.classList.remove("active");
    if (nav.dataset.filter === filterId || nav.dataset.category === filterId) {
      nav.classList.add("active");
      viewTitle.textContent = nav.textContent.trim();
    }
  });

  document.querySelectorAll(".filter-chip").forEach(chip => {
    chip.classList.remove("active");
    if (chip.dataset.qf === filterId) chip.classList.add("active");
  });

  if (filterId === "high-priority") viewTitle.textContent = "High Priority";

  renderDashboard();
}

/* SIDEBAR */
function openSidebar() {
  sidebar.classList.add("open");
  sidebarOverlay.classList.remove("hidden");
}

function closeSidebar() {
  sidebar.classList.remove("open");
  sidebarOverlay.classList.add("hidden");
}

mobileMenuBtn?.addEventListener("click", openSidebar);
closeMenuBtn?.addEventListener("click", closeSidebar);
sidebarOverlay?.addEventListener("click", closeSidebar);

document.querySelectorAll(".sidebar-nav .nav-item").forEach(item => {
  item.addEventListener("click", e => {
    e.preventDefault();
    handleFilterChange(item.dataset.filter || item.dataset.category);
    closeSidebar();
  });
});

document.querySelectorAll(".filter-chip").forEach(chip => {
  chip.addEventListener("click", () => handleFilterChange(chip.dataset.qf));
});

searchInput?.addEventListener("input", e => {
  searchQuery = e.target.value.toLowerCase();
  renderDashboard();
});

/* DETAILS PANEL */
function showOverview() {
  overviewContext.classList.remove("hidden");
  habitDetailsSection.classList.add("hidden");
  selectedHabitIndex = null;
}

function selectHabit(index) {
  selectedHabitIndex = index;
  const habit = habits[index];

  if (!habit) {
    showOverview();
    return;
  }

  overviewContext.classList.add("hidden");
  habitDetailsSection.classList.remove("hidden");

  detailsTitle.textContent = habit.name;
  detailsStatus.textContent = habit.completed ? "Completed" : "Pending";
  detailsStatus.className = "status-badge " + (habit.completed ? "completed" : "pending");

  quill.root.innerHTML = habit.notes || "";

  renderDashboard();
}

closeDetailsBtn?.addEventListener("click", showOverview);

/* ANALYTICS */
function renderWeeklyChart() {
  const chartContainer = document.getElementById("weeklyChart");
  chartContainer.innerHTML = "";

  const today = new Date();
  let maxCompletions = 1;
  let daysData = [];

  for (let i = 6; i >= 0; i--) {
    let d = new Date(today);
    d.setDate(d.getDate() - i);
    let dStr = d.toISOString().split("T")[0];
    let count = habits.filter(h => h.history.includes(dStr)).length;
    if (count > maxCompletions) maxCompletions = count;
    daysData.push({ day: d.toLocaleDateString("en-US", { weekday: "short" }), count });
  }

  daysData.forEach(data => {
    let heightPerc = (data.count / maxCompletions) * 100;
    chartContainer.innerHTML += `
      <div class="chart-col" title="${data.count} habits">
        <div class="chart-bar" style="height:${heightPerc}%"></div>
        <span class="chart-label">${data.day.charAt(0)}</span>
      </div>
    `;
  });
}

function renderHeatmap() {
  const heatmapGrid = document.getElementById("heatmapGrid");
  heatmapGrid.innerHTML = "";

  const today = new Date();

  for (let i = 27; i >= 0; i--) {
    let d = new Date(today);
    d.setDate(d.getDate() - i);
    let dStr = d.toISOString().split("T")[0];
    let count = habits.filter(h => h.history.includes(dStr)).length;

    let intensity =
      count === 0 ? "level-0" :
      count < 3   ? "level-1" :
      count < 5   ? "level-2" : "level-3";

    heatmapGrid.innerHTML += `
      <div class="heat-square ${intensity}" title="${dStr}: ${count} habits"></div>
    `;
  }
}

function renderAchievements(maxStreak, totalCompletions, totalHabits) {
  const grid = document.getElementById("achievementsGrid");
  grid.innerHTML = "";

  const achievements = [
    { name: "7 Day Warrior",       icon: "sword",  achieved: maxStreak >= 7 },
    { name: "Consistency Master",  icon: "award",  achieved: totalCompletions >= 30 },
    { name: "Habit Builder",       icon: "hammer", achieved: totalHabits >= 5 }
  ];

  achievements.forEach(a => {
    grid.innerHTML += `
      <div class="achievement-badge ${a.achieved ? "unlocked" : "locked"}">
        <i data-lucide="${a.icon}"></i>
        <span>${a.name}</span>
      </div>
    `;
  });
}

/* ADD HABIT */
function openAddModal() {
  addModal.classList.remove("hidden");
}

fabAdd?.addEventListener("click", openAddModal);

document.getElementById("cancelAddBtn")?.addEventListener("click", () => {
  addModal.classList.add("hidden");
  addHabitInput.value = "";
});

// Enter key support in add modal
addHabitInput?.addEventListener("keypress", e => {
  if (e.key === "Enter") document.getElementById("confirmAddBtn")?.click();
});

document.getElementById("confirmAddBtn")?.addEventListener("click", () => {
  const name = addHabitInput.value.trim();

  if (!name) {
    alert("Please enter a habit name");
    return;
  }

  habits.unshift({
    name,
    completed: false,
    notes: "",
    category:  addHabitCategory.value,
    timeLabel: addHabitTimeLabel.value,
    priority:  addHabitPriority.checked,
    createdAt: getTodayStr(),
    history:   []
  });

  saveData();
  addModal.classList.add("hidden");
  addHabitInput.value = "";
  addHabitPriority.checked = false;

  renderDashboard();
  selectHabit(0);
});

/* EDIT */
function openEditDrawer(index) {
  editingIndex = index;
  const habit = habits[index];

  editHabitInput.value        = habit.name;
  editHabitCategory.value     = habit.category;
  editHabitTimeLabel.value    = habit.timeLabel;
  editHabitPriority.checked   = habit.priority;

  editDrawer.classList.remove("hidden");
  editDrawerOverlay.classList.remove("hidden");

  setTimeout(() => editDrawer.classList.add("open"), 10);
}

function closeEditDrawer() {
  editingIndex = null;
  editDrawer.classList.remove("open");

  setTimeout(() => {
    editDrawer.classList.add("hidden");
    editDrawerOverlay.classList.add("hidden");
  }, 300);
}

document.getElementById("closeDrawerBtn")?.addEventListener("click", closeEditDrawer);
editDrawerOverlay?.addEventListener("click", closeEditDrawer);

document.getElementById("saveEditBtn")?.addEventListener("click", () => {
  if (editingIndex === null) return;

  const newName = editHabitInput.value.trim();
  if (!newName) {
    alert("Habit name cannot be empty");
    return;
  }

  habits[editingIndex].name      = newName;
  habits[editingIndex].category  = editHabitCategory.value;
  habits[editingIndex].timeLabel = editHabitTimeLabel.value;
  habits[editingIndex].priority  = editHabitPriority.checked;

  saveData();
  renderDashboard();
  closeEditDrawer();
});

/* DELETE */
const drawerFooter = document.querySelector(".drawer-footer");
const deleteBtn = document.createElement("button");

deleteBtn.className = "btn-danger";
deleteBtn.textContent = "Delete";

deleteBtn.addEventListener("click", () => {
  habitToDeleteIndex = editingIndex;
  deleteModal.classList.remove("hidden");
});

drawerFooter?.insertBefore(deleteBtn, document.getElementById("saveEditBtn"));

document.getElementById("cancelDeleteBtn")?.addEventListener("click", () => {
  deleteModal.classList.add("hidden");
  habitToDeleteIndex = null;
});

document.getElementById("confirmDeleteBtn")?.addEventListener("click", () => {
  if (habitToDeleteIndex === null) return;

  habits.splice(habitToDeleteIndex, 1);

  if (selectedHabitIndex === habitToDeleteIndex) showOverview();

  saveData();
  renderDashboard();
  closeEditDrawer();
  deleteModal.classList.add("hidden");
});

/* THEME */
function setTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark-mode", isDark);
  document.getElementById("theme-text").textContent = isDark ? "Light Mode" : "Dark Mode";
  localStorage.setItem("theme", theme);
}

document.getElementById("theme-toggle")?.addEventListener("click", () => {
  setTheme(document.body.classList.contains("dark-mode") ? "light" : "dark");
});

/* INIT */
document.addEventListener("DOMContentLoaded", () => {
  setTheme(localStorage.getItem("theme") || "light");
  initQuill();
  lucide.createIcons();
  renderDashboard();
});