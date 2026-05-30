// ─── Theme Toggle with localStorage persistence ───
(function initTheme() {

    const themeBtn = document.getElementById("theme-toggle");
    const STORAGE_KEY = "bmi-theme";

  // Resolve initial theme: saved preference → OS preference → light
  function getPreferred() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function applyTheme(theme) {
    document.body.classList.toggle("dark", theme === "dark");
  }

  // Apply on first load (runs synchronously before paint)
  applyTheme(getPreferred());

  // Toggle on click
  themeBtn.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark");
    localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
  });
    function getPreferred() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return saved;
        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    }
const calculateBtn = document.getElementById("calculate-btn");
const resetBtn = document.getElementById("reset-btn");

const bmiValue = document.getElementById("bmi-value");
const bmiBadge = document.getElementById("bmi-badge");

const healthyRange = document.getElementById("healthy-range");
const tipText = document.getElementById("tip-text");

const results = document.getElementById("results");

const pointer = document.getElementById("pointer");

const bfPercent = document.getElementById("bf-percent");
const bfProgress = document.getElementById("bf-progress");
const bfBadge = document.getElementById("bf-badge");
const bfDesc = document.getElementById("bf-desc");

const historyList = document.getElementById("history-list");

const themeToggle = document.getElementById("theme-toggle");

const STORAGE_KEY = "bmi-theme";
const BMI_HISTORY = "bmi-history";

const categories = [
  {
    max: 18.5,
    label: "Underweight",
    color: "#2f6fd8",
    bg: "#e7f0ff",
    tip: "Increase nutrient-rich calorie intake."
  },
  {
    max: 25,
    label: "Normal weight",
    color: "#5d8d25",
    bg: "#e8f0d8",
    tip: "Great — keep up balanced nutrition and regular activity."
  },
  {
    max: 30,
    label: "Overweight",
    color: "#c97317",
    bg: "#faecd9",
    tip: "Regular exercise and healthy diet are recommended."
  },
  {
    max: 35,
    label: "Obese (Class I)",
    color: "#d92d2d",
    bg: "#fdeaea",
    tip: "Medical guidance is recommended."
  },
  {
    max: 40,
    label: "Obese (Class II)",
    color: "#b02020",
    bg: "#fdeaea",
    tip: "Consult healthcare professionals."
  },
  {
    max: 999,
    label: "Obese (Class III)",
    color: "#8b1111",
    bg: "#fdeaea",
    tip: "Immediate medical support is advised."
  }
];

function getCategory(bmi) {
  return categories.find(c => bmi < c.max);
}

function calculateBMI(weight, heightCm) {
  return weight / Math.pow(heightCm / 100, 2);
}

function healthyWeight(heightCm) {

  const h = heightCm / 100;

  return [
    (18.5 * h * h).toFixed(1),
    (24.9 * h * h).toFixed(1)
  ];
}

function updatePointer(bmi) {

    const MIN = 10, MAX = 45;
    const clamped = Math.min(Math.max(bmi, MIN), MAX);
    return ((clamped - MIN) / (MAX - MIN)) * 100;

    
}
  const percent =
    ((Math.min(Math.max(bmi, 10), 40) - 10) / 30) * 100;

  pointer.style.left = `${percent}%`;
}

function clearActiveRows() {

  document
    .querySelectorAll(".bmi-table tbody tr")
    .forEach(row => row.classList.remove("active-row"));
}

function highlightRow(label) {

  const map = {
    "Underweight": "underweight-row",
    "Normal weight": "normal-row",
    "Overweight": "overweight-row",
    "Obese (Class I)": "obese1-row",
    "Obese (Class II)": "obese2-row",
    "Obese (Class III)": "obese3-row"
  };

  document
    .getElementById(map[label])
    ?.classList.add("active-row");
}

calculateBtn.addEventListener("click", () => {

  const heightUnit =
    document.getElementById("height-unit").value;

  const weightUnit =
    document.getElementById("weight-unit").value;

  let height =
    parseFloat(document.getElementById("height").value);

  let weight =
    parseFloat(document.getElementById("weight").value);

  const age =
    parseFloat(document.getElementById("age").value);

  const gender =
    document.getElementById("gender").value;

  if (!height || !weight) {

    document.getElementById("error-msg")
      .textContent =
      "Please enter valid values.";

    return;
  }

  document.getElementById("error-msg")
    .textContent = "";

  if (weightUnit === "lb") {
    weight *= 0.453592;
  }

  if (heightUnit === "feet") {
    height *= 30.48;
  }

  const bmi = calculateBMI(weight, height);

  const rounded = bmi.toFixed(1);

  // Calculates BMI
  const bmi = w / Math.pow(heightCm / 100, 2);
  const bmiRounded = Math.round(bmi * 10) / 10;
  const cat = getCategory(bmi);

  // Displays BMI + category
  document.getElementById("bmi-val").textContent = bmiRounded.toFixed(1);

    resultsEl.style.background = cat.bg;
    resultsEl.style.border = `2px solid ${cat.color}`;
    resultsEl.style.transition = "all 0.4s ease";
    resultsEl.style.boxShadow = `0 0 20px ${cat.color}40`;

    // Healthy weight range
    const [wLow, wHigh] = calcHealthyWeight(heightCm);
    const dispUnit = wUnit === "lb" ? "lb" : "kg";
    const mult = wUnit === "lb" ? 2.20462 : 1;
    document.getElementById("healthy-range").textContent =
        `${(wLow * mult).toFixed(1)}–${(wHigh * mult).toFixed(1)} ${dispUnit}`;
  const badge = document.getElementById("cat-badge");
  const icons = {
    Underweight: "⚠️",
    "Normal weight": "✅",
    Overweight: "📈",
    "Obese (class I)": "❗",
    "Obese (class II)": "🚨",
    "Obese (class III)": "🛑",
  };
  const category = getCategory(bmi);

  bmiValue.textContent = rounded;

  document.getElementById("tip-text").textContent = cat.tip;
  bmiBadge.textContent = category.label;

  bmiBadge.style.background = category.bg;

  bmiBadge.style.color = category.color;

  tipText.textContent = category.tip;

  const [low, high] = healthyWeight(height);

  healthyRange.textContent =
    `${low}-${high} kg`;

  updatePointer(bmi);

  clearActiveRows();

  highlightRow(category.label);

  const bodyFat =
    (
      (1.20 * bmi) +
      (0.23 * age) -
      (10.8 * (gender === "male" ? 1 : 0)) -
      5.4
    ).toFixed(1);

  bfPercent.textContent = bodyFat;

  const circumference = 326.7;

  const offset =
    circumference -
    (bodyFat / 60) * circumference;

  bfProgress.style.strokeDashoffset = offset;

  bfDesc.textContent =
    "Fitness range — a healthy body composition with good muscle definition.";

  results.classList.remove("hidden");

  addHistory(rounded, category.label);

  updateChart(rounded);
});

const resetBtn = document.getElementById("reset-btn");

resetBtn.addEventListener("click", () => {

    // Clear inputs
    heightInp.value = "";
    weightInp.value = "";
    document.getElementById("age").value = "";
    document.getElementById("gender").value = "female";

    // Hide results
    resultsEl.classList.add("hidden");
    rangeVisEl.classList.add("hidden");

    // Clear error
    clearError();

    // Reset chart
    bmiChart.data.labels = [];
    bmiChart.data.datasets[0].data = [];
    bmiChart.update();

    // Reset BMI text
    document.getElementById("bmi-val").textContent = "--";

    // Reset badge
    const badge = document.getElementById("cat-badge");
    badge.textContent = "--";
    badge.style.background = "";
    badge.style.color = "";

    // Reset healthy range
    document.getElementById("healthy-range").textContent = "--";

    // Reset tip text
    document.getElementById("tip-text").textContent = "";

    // Reset pointer
    document.getElementById("bmi-ptr").style.left = "0%";

    document.getElementById("bf-section").classList.add("hidden");
});

document.addEventListener("keydown", (e) => {
   if (e.key === "Enter") {
      btn.click();
   }
  });
resetBtn.addEventListener("click", () => {

  document
    .querySelectorAll("input")
    .forEach(input => input.value = "");

  results.classList.add("hidden");

  clearActiveRows();
});

themeToggle.addEventListener("click", () => {

  document.body.classList.toggle("dark");

  localStorage.setItem(
    STORAGE_KEY,
    document.body.classList.contains("dark")
  );
});

if (localStorage.getItem(STORAGE_KEY) === "true") {
  document.body.classList.add("dark");
}

const ctx =
  document.getElementById("bmiChart");

const bmiChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [{
      data: [],
      borderColor: "#7c6ae6",
      backgroundColor: "rgba(124,106,230,.08)",
      fill: true,
      tension: .4,
      pointRadius: 4
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    }
  }
});

function updateChart(bmi) {

  const time =
    new Date().toLocaleTimeString();

  bmiChart.data.labels.push(time);

  bmiChart.data.datasets[0].data.push(bmi);

  bmiChart.update();
}

function addHistory(bmi, label) {

  const time =
    new Date().toLocaleString();

  const item = document.createElement("div");

  item.className = "history-item";

  item.innerHTML = `
    <span>${time}</span>
    <strong>BMI: ${bmi}</strong>
  `;

  historyList.prepend(item);

  saveHistory();
}

function saveHistory() {

  localStorage.setItem(
    BMI_HISTORY,
    historyList.innerHTML
  );
}

function loadHistory() {

  const saved =
    localStorage.getItem(BMI_HISTORY);

  if (saved) {
    historyList.innerHTML = saved;
  }
}

loadHistory();

document
  .getElementById("clear-history")
  .addEventListener("click", () => {

    historyList.innerHTML = "";

    bmiChart.data.labels = [];
    bmiChart.data.datasets[0].data = [];

    bmiChart.update();

    localStorage.removeItem(BMI_HISTORY);
  });
