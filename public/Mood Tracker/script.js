let entries = JSON.parse(localStorage.getItem("moodEntries")) || [];

let state = {
  filter: "day",
  section: "mood",
};

// ================= INIT =================
window.onload = () => {
  updateTime();
  setInterval(updateTime, 1000);

  switchSection("mood");
  updateAll();
};

// ================= TIME =================
function updateTime() {
  const now = new Date();
  document.getElementById("currentDate").innerText = now.toDateString();
  document.getElementById("currentTime").innerText = now.toLocaleTimeString();
}

// ================= ADD ENTRY =================
function addEntry() {
  const entry = {
    mood: document.getElementById("moodInput").value || "neutral",
    energy: Number(document.getElementById("energyLevel").value),
    stress: Number(document.getElementById("stressLevel").value),
    journal: document.getElementById("journalText").value,
    highlight: document.getElementById("highlight").value,
    date: new Date(),
    ts: Date.now(),
  };

  entries.push(entry);
  localStorage.setItem("moodEntries", JSON.stringify(entries));

  clearInputs();
  updateAll();
}

// ================= CLEAR =================
function clearInputs() {
  document.getElementById("moodInput").value = "";
  document.getElementById("journalText").value = "";
  document.getElementById("highlight").value = "";
}

// ================= MASTER UPDATE ENGINE =================
function updateAll() {
  const filtered = getFilteredEntries();

  updateStats(filtered);
  updateJournal(filtered);
  updateHeatmap(filtered);
  updateInsights(filtered);
  updateChart(filtered);
}

// ================= FILTER SYSTEM =================
function getFilteredEntries() {
  const now = Date.now();

  return entries.filter((e) => {
    const diff = now - e.ts;

    if (state.filter === "day") return diff < 86400000;
    if (state.filter === "week") return diff < 604800000;
    if (state.filter === "month") return diff < 2592000000;

    return true;
  });
}

function applyFilter() {
  state.filter = document.getElementById("filterRange").value;
  updateAll();
}

// ================= SECTION SWITCH =================
function switchSection(id) {
  state.section = id;

  document.querySelectorAll(".section").forEach((s) => {
    s.classList.remove("active");
  });

  document.getElementById(id).classList.add("active");
}

// ================= STATS =================
function updateStats(data) {
  if (data.length === 0) return;

  const avgEnergy = avg(data.map((d) => d.energy));
  const avgStress = avg(data.map((d) => d.stress));

  document.getElementById("avgEnergy").innerText = avgEnergy.toFixed(1);
  document.getElementById("avgStress").innerText = avgStress.toFixed(1);

  document.getElementById("streakText").innerText = calcStreak();
}

function avg(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// ================= STREAK =================
function calcStreak() {
  if (entries.length === 0) return 0;

  let streak = 1;

  for (let i = entries.length - 1; i > 0; i--) {
    const diff = entries[i].ts - entries[i - 1].ts;

    if (diff < 172800000) {
      streak++;
    } else break;
  }

  return streak;
}

// ================= JOURNAL =================
function updateJournal(data) {
  const list = document.getElementById("entriesList");
  list.innerHTML = "";

  data
    .slice(-10)
    .reverse()
    .forEach((e) => {
      const li = document.createElement("li");

      li.innerHTML = `
      <b>${new Date(e.ts).toDateString()}</b><br>
      Mood: ${e.mood} | Energy: ${e.energy} | Stress: ${e.stress}<br>
      ✨ ${e.highlight || "No highlight"}
    `;

      list.appendChild(li);
    });
}

// ================= INSIGHTS =================
function updateInsights(data) {
  const box = document.getElementById("insightBox");

  if (data.length < 2) {
    box.innerText = "Not enough data yet...";
    return;
  }

  const avgStress = avg(data.map((d) => d.stress));
  const avgEnergy = avg(data.map((d) => d.energy));

  let msg = "";

  if (avgStress > 3) msg += "⚠ High stress detected. ";
  if (avgEnergy < 2) msg += "⚡ Low energy trend. ";
  if (avgEnergy > 4 && avgStress < 2) msg += "🌟 Excellent balance detected!";

  box.innerText = msg;
}

// ================= CHART =================
let chart;

function updateChart(data) {
  const ctx = document.getElementById("chart").getContext("2d");

  const labels = data.map((d) => new Date(d.ts).toLocaleDateString());
  const energy = data.map((d) => d.energy);
  const stress = data.map((d) => d.stress);

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        { label: "Energy", data: energy },
        { label: "Stress", data: stress },
      ],
    },
  });
}

// ================= HEATMAP =================
function updateHeatmap(data) {
  const map = document.getElementById("heatmap");
  map.innerHTML = "";

  for (let i = 0; i < 120; i++) {
    const cell = document.createElement("div");
    cell.classList.add("heatmap-cell");

    const val = Math.floor(Math.random() * 5) + 1;
    cell.classList.add("level-" + val);

    map.appendChild(cell);
  }
}

// ================= LIVE MIND PREVIEW =================
document.getElementById("moodInput").addEventListener("input", (e) => {
  const val = e.target.value.toLowerCase();
  const box = document.getElementById("liveMoodPreview");

  if (val.includes("sad")) box.innerText = "⚠ Low emotional state detected";
  else if (val.includes("happy")) box.innerText = "😊 Positive mood detected";
  else box.innerText = "🧠 Analyzing emotional state...";
});

// ================= THEME =================
function toggleTheme() {
  document.body.classList.toggle("dark");
}

// ================= FILTER CHANGE =================
function applyFilter() {
  state.filter = document.getElementById("filterRange").value;
  updateAll();
}
