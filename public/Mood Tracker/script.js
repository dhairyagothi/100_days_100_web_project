let entries = JSON.parse(localStorage.getItem("moodEntries")) || [];

let state = {
  filter: "day",
  section: "mood",
};

let chart;

// ================= INIT =================
window.onload = () => {
  loadTheme();
  updateTime();

  setInterval(updateTime, 1000);

  switchSection("mood");
  updateAll();

  setupMoodButtons();
  setupLivePreview();
  setupMobileOverlay();
};

// ================= TIME =================
function updateTime() {
  const now = new Date();

  document.getElementById("currentDate").innerText =
    now.toDateString();

  document.getElementById("currentTime").innerText =
    now.toLocaleTimeString();
}

// ================= THEME =================
function toggleTheme() {
  const body = document.body;

  if (body.classList.contains("dark")) {
    body.classList.remove("dark");
    body.classList.add("light");

    localStorage.setItem("theme", "light");
  } else {
    body.classList.remove("light");
    body.classList.add("dark");

    localStorage.setItem("theme", "dark");
  }
}

function loadTheme() {
  const savedTheme = localStorage.getItem("theme") || "dark";

  document.body.classList.remove("dark", "light");
  document.body.classList.add(savedTheme);
}

// ================= MOBILE SIDEBAR =================
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("mobileOverlay");

  sidebar.classList.toggle("show");
  overlay.classList.toggle("show");
}

function setupMobileOverlay() {
  const overlay = document.getElementById("mobileOverlay");

  overlay.addEventListener("click", () => {
    document.getElementById("sidebar").classList.remove("show");
    overlay.classList.remove("show");
  });
}

// ================= SECTION SWITCH =================
function switchSection(id) {
  state.section = id;

  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active");
  });

  document.getElementById(id).classList.add("active");

  // active nav button
  document.querySelectorAll(".nav-links button").forEach((btn) => {
    btn.classList.remove("active-btn");
  });

  event?.target?.closest("button")?.classList.add("active-btn");

  // close mobile sidebar
  document.getElementById("sidebar").classList.remove("show");
  document.getElementById("mobileOverlay").classList.remove("show");
}

// ================= ADD ENTRY =================
function addEntry() {
  const mood = document.getElementById("moodInput").value.trim();

  const journal =
    document.getElementById("journalText").value.trim();

  const highlight =
    document.getElementById("highlight").value.trim();

  if (!mood && !journal) {
    alert("Please enter your mood or journal.");
    return;
  }

  const entry = {
    mood: mood || "Neutral",
    energy: Number(
      document.getElementById("energyLevel").value
    ),
    stress: Number(
      document.getElementById("stressLevel").value
    ),
    journal,
    highlight,
    ts: Date.now(),
  };

  entries.push(entry);

  localStorage.setItem(
    "moodEntries",
    JSON.stringify(entries)
  );

  clearInputs();
  updateAll();

  document.getElementById(
    "liveMoodPreview"
  ).innerText = "✅ Mood entry saved successfully!";
}

// ================= CLEAR INPUTS =================
function clearInputs() {
  document.getElementById("moodInput").value = "";

  document.getElementById("journalText").value = "";

  document.getElementById("highlight").value = "";

  document.getElementById(
    "liveMoodPreview"
  ).innerText = "Mood preview appears here...";
}

// ================= FILTER =================
function applyFilter() {
  state.filter =
    document.getElementById("filterRange").value;

  updateAll();
}

function getFilteredEntries() {
  const now = Date.now();

  return entries.filter((entry) => {
    const diff = now - entry.ts;

    if (state.filter === "day")
      return diff < 86400000;

    if (state.filter === "week")
      return diff < 604800000;

    if (state.filter === "month")
      return diff < 2592000000;

    return true;
  });
}

// ================= UPDATE EVERYTHING =================
function updateAll() {
  const filtered = getFilteredEntries();

  updateStats(filtered);
  updateJournal(filtered);
  updateInsights(filtered);
  updateChart(filtered);
  updateHeatmap(filtered);
}

// ================= STATS =================
function updateStats(data) {
  if (data.length === 0) {
    document.getElementById("avgEnergy").innerText =
      "-";

    document.getElementById("avgStress").innerText =
      "-";

    document.getElementById("avgMood").innerText =
      "-";

    document.getElementById("streakText").innerText =
      "0";

    return;
  }

  const avgEnergy = avg(
    data.map((d) => d.energy)
  ).toFixed(1);

  const avgStress = avg(
    data.map((d) => d.stress)
  ).toFixed(1);

  const moodScore = (
    avgEnergy * 2 -
    avgStress
  ).toFixed(1);

  document.getElementById("avgEnergy").innerText =
    avgEnergy;

  document.getElementById("avgStress").innerText =
    avgStress;

  document.getElementById("avgMood").innerText =
    moodScore;

  document.getElementById("streakText").innerText =
    calculateStreak();
}

function avg(arr) {
  return (
    arr.reduce((a, b) => a + b, 0) / arr.length
  );
}

// ================= STREAK =================
function calculateStreak() {
  if (entries.length === 0) return 0;

  let streak = 1;

  const sorted = [...entries].sort(
    (a, b) => a.ts - b.ts
  );

  for (
    let i = sorted.length - 1;
    i > 0;
    i--
  ) {
    const diff =
      sorted[i].ts - sorted[i - 1].ts;

    if (diff <= 172800000) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

// ================= JOURNAL =================
function updateJournal(data) {
  const list =
    document.getElementById("entriesList");

  list.innerHTML = "";

  if (data.length === 0) {
    list.innerHTML =
      "<li>No entries found.</li>";

    return;
  }

  data
    .slice()
    .reverse()
    .forEach((entry) => {
      const li = document.createElement("li");

      li.innerHTML = `
        <strong>${new Date(
          entry.ts
        ).toLocaleString()}</strong>
        <br><br>

        <b>Mood:</b> ${entry.mood}
        <br>

        <b>Energy:</b> ${entry.energy}
        <br>

        <b>Stress:</b> ${entry.stress}
        <br><br>

        <b>Journal:</b>
        <br>
        ${entry.journal || "No journal"}

        <br><br>

        ✨ ${entry.highlight || "No highlight"}
      `;

      list.appendChild(li);
    });
}

// ================= SEARCH JOURNAL =================
function filterJournal() {
  const query = document
    .getElementById("searchJournal")
    .value.toLowerCase();

  const filtered = getFilteredEntries().filter(
    (entry) =>
      entry.mood
        .toLowerCase()
        .includes(query) ||
      entry.journal
        .toLowerCase()
        .includes(query) ||
      entry.highlight
        .toLowerCase()
        .includes(query)
  );

  updateJournal(filtered);
}

// ================= INSIGHTS =================
function updateInsights(data) {
  const box =
    document.getElementById("insightBox");

  if (data.length < 2) {
    box.innerText =
      "Not enough data yet for insights.";

    return;
  }

  const avgEnergy = avg(
    data.map((d) => d.energy)
  );

  const avgStress = avg(
    data.map((d) => d.stress)
  );

  let message = "";

  if (avgStress >= 4) {
    message +=
      "⚠️ Your stress levels are high lately. Try relaxing.\n\n";
  }

  if (avgEnergy <= 2) {
    message +=
      "⚡ Your energy seems low. Sleep and hydration may help.\n\n";
  }

  if (avgEnergy >= 4 && avgStress <= 2) {
    message +=
      "🌟 Excellent emotional balance detected.\n\n";
  }

  if (message === "") {
    message =
      "😊 Your mood trends look stable and balanced.";
  }

  box.innerText = message;
}

// ================= CHART =================
function updateChart(data) {
  const canvas =
    document.getElementById("chart");

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  const labels = data.map((entry) =>
    new Date(entry.ts).toLocaleDateString()
  );

  const energyData = data.map(
    (entry) => entry.energy
  );

  const stressData = data.map(
    (entry) => entry.stress
  );

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "line",

    data: {
      labels,

      datasets: [
        {
          label: "Energy",
          data: energyData,
          borderColor: "#06b6d4",
          backgroundColor: "transparent",
          tension: 0.4,
        },

        {
          label: "Stress",
          data: stressData,
          borderColor: "#8b5cf6",
          backgroundColor: "transparent",
          tension: 0.4,
        },
      ],
    },

    options: {
      responsive: true,

      plugins: {
        legend: {
          labels: {
            color:
              getComputedStyle(
                document.body
              ).getPropertyValue("--text"),
          },
        },
      },

      scales: {
        x: {
          ticks: {
            color:
              getComputedStyle(
                document.body
              ).getPropertyValue("--text"),
          },
        },

        y: {
          ticks: {
            color:
              getComputedStyle(
                document.body
              ).getPropertyValue("--text"),
          },

          beginAtZero: true,
          max: 5,
        },
      },
    },
  });
}

// ================= HEATMAP =================
function updateHeatmap(data) {
  const heatmap =
    document.getElementById("heatmap");

  heatmap.innerHTML = "";

  if (data.length === 0) return;

  data.forEach((entry) => {
    const cell =
      document.createElement("div");

    cell.classList.add("heatmap-cell");

    const level =
      Math.min(
        5,
        Math.max(
          1,
          Math.round(
            (entry.energy +
              (6 - entry.stress)) /
              2
          )
        )
      );

    cell.classList.add(`level-${level}`);

    cell.title = `
Mood: ${entry.mood}
Energy: ${entry.energy}
Stress: ${entry.stress}
`;

    heatmap.appendChild(cell);
  });
}

// ================= LIVE PREVIEW =================
function setupLivePreview() {
  const moodInput =
    document.getElementById("moodInput");

  const preview =
    document.getElementById(
      "liveMoodPreview"
    );

  moodInput.addEventListener(
    "input",
    (e) => {
      const text =
        e.target.value.toLowerCase();

      if (
        text.includes("happy") ||
        text.includes("great") ||
        text.includes("excited")
      ) {
        preview.innerText =
          "😊 Positive mood detected!";
      } else if (
        text.includes("sad") ||
        text.includes("angry") ||
        text.includes("upset")
      ) {
        preview.innerText =
          "⚠️ Negative emotional state detected.";
      } else if (
        text.includes("tired") ||
        text.includes("exhausted")
      ) {
        preview.innerText =
          "😴 You may need some rest.";
      } else {
        preview.innerText =
          "🧠 Analyzing your emotional state...";
      }
    }
  );
}

// ================= MOOD BUTTONS =================
function setupMoodButtons() {
  const moodButtons =
    document.querySelectorAll(".mood-btn");

  const moodInput =
    document.getElementById("moodInput");

  moodButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      moodButtons.forEach((b) =>
        b.classList.remove("selected")
      );

      btn.classList.add("selected");

      moodInput.value = btn.innerText;
    });
  });
}

// ================= EXPORT DATA =================
function exportData() {
  if (entries.length === 0) {
    alert("No data available to export.");
    return;
  }

  const blob = new Blob(
    [JSON.stringify(entries, null, 2)],
    {
      type: "application/json",
    }
  );

  const link =
    document.createElement("a");

  link.href =
    URL.createObjectURL(blob);

  link.download = "mood-data.json";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
}