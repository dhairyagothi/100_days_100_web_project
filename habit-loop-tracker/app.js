// State Management
let habitLogs =
  JSON.parse(localStorage.getItem("psychology_habit_loops")) || [];
let chartInstance = null;

// UI Selection Points
const habitForm = document.getElementById("habitForm");
const logList = document.getElementById("logList");

// Initialize Dashboard State
document.addEventListener("DOMContentLoaded", () => {
  renderLogs();
  updateChart();
});

// Process Cycle Form Submission
habitForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newLog = {
    id: Date.now().toString(),
    title: document.getElementById("habitName").value.trim(),
    cue: document.getElementById("habitCue").value.trim(),
    routine: document.getElementById("habitRoutine").value.trim(),
    reward: document.getElementById("habitReward").value.trim(),
    status: document.getElementById("loopStatus").value,
  };

  habitLogs.unshift(newLog);
  saveState();

  renderLogs();
  updateChart();
  habitForm.reset();
});

// Persist to LocalStorage
function saveState() {
  localStorage.setItem("psychology_habit_loops", JSON.stringify(habitLogs));
}

// Render Habit Card Elements to UI Dashboard
function renderLogs() {
  logList.innerHTML = "";

  if (habitLogs.length === 0) {
    logList.innerHTML =
      '<p style="color: #64748b; text-align: center; padding: 20px;">No habit loops logged yet. Establish your first loop above!</p>';
    return;
  }

  habitLogs.forEach((log) => {
    const card = document.createElement("div");
    card.className = "habit-card";

    const statusText =
      log.status === "success" ? " reinforced" : " routine broken";

    card.innerHTML = `
      <div class="card-header">
        <div>
          <span class="card-title">${escapeHTML(log.title)}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <span class="badge ${log.status}">${statusText}</span>
          <button class="btn-delete" onclick="deleteLog('${log.id}')" aria-label="Delete entry">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
      <div class="card-details">
        <div class="detail-segment">
          <strong>Cue</strong>
          ${escapeHTML(log.cue)}
        </div>
        <div class="detail-segment">
          <strong>Routine</strong>
          ${escapeHTML(log.routine)}
        </div>
        <div class="detail-segment">
          <strong>Reward</strong>
          ${escapeHTML(log.reward)}
        </div>
      </div>
    `;
    logList.appendChild(card);
  });
}

// Delete Log Entry Block
window.deleteLog = function (id) {
  habitLogs = habitLogs.filter((log) => log.id !== id);
  saveState();
  renderLogs();
  updateChart();
};

// Update Visual Analytics Chart Node
function updateChart() {
  const ctx = document.getElementById("analyticsChart").getContext("2d");

  const reinforcedCount = habitLogs.filter(
    (log) => log.status === "success",
  ).length;
  const brokenCount = habitLogs.filter((log) => log.status === "fail").length;

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Reinforced Loops", "Broken Routines"],
      datasets: [
        {
          data: [reinforcedCount, brokenCount],
          backgroundColor: ["#10b981", "#ef4444"],
          borderWidth: 0,
          hoverOffset: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#cbd5e1",
            font: { family: "Plus Jakarta Sans", size: 12 },
          },
        },
      },
    },
  });
}

// Security Helper to Prevent XSS
function escapeHTML(str) {
  return str.replace(
    /[&<>'"]/g,
    (tag) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        tag
      ] || tag,
  );
}
