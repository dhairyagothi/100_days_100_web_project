// ─── Theme Toggle with localStorage persistence ───
(function initTheme() {
    const themeBtn = document.getElementById("theme-toggle");
    const STORAGE_KEY = "bmi-theme";

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

    applyTheme(getPreferred());

    themeBtn.addEventListener("click", () => {
        const isDark = document.body.classList.toggle("dark");
        localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
    });
})();

// DOM Elements
const heightUnitEl = document.getElementById("height-unit");
const weightUnitEl = document.getElementById("weight-unit");
const heightLbl = document.getElementById("height-lbl");
const weightLbl = document.getElementById("weight-lbl");

// Inputs
const heightInp = document.getElementById("height");
const heightFtInp = document.getElementById("height-ft");
const heightInInp = document.getElementById("height-in");
const weightInp = document.getElementById("weight");
const ageInp = document.getElementById("age");
const genderInp = document.getElementById("gender");

// Containers & Layout Blocks
const metricHeightContainer = document.getElementById("metric-height-container");
const imperialHeightContainer = document.getElementById("imperial-height-container");
const btn = document.getElementById("calculate-btn");
const resetBtn = document.getElementById("reset-btn");
const clearHistoryBtn = document.getElementById("clear-history-btn");
const historyLogList = document.getElementById("history-log-list");
const errEl = document.getElementById("error-msg");
const resultsEl = document.getElementById("results");
const rangeVisEl = document.getElementById("range-vis");
const bfSection = document.getElementById("bf-section");

// WHO approved BMI categories with linked DOM Row Reference targets
const CATS = [
    {
        max: 18.5,
        label: "Underweight",
        color: "#378ADD",
        bg: "#E6F1FB",
        rowId: "row-underweight",
        tip: "Consider increasing caloric intake with nutrient-dense foods. A dietitian can help.",
    },
    {
        max: 25.0,
        label: "Normal weight",
        color: "#639922",
        bg: "#EAF3DE",
        rowId: "row-normal",
        tip: "Great — keep up balanced nutrition and regular activity.",
    },
    {
        max: 30.0,
        label: "Overweight",
        color: "#BA7517",
        bg: "#FAEEDA",
        rowId: "row-overweight",
        tip: "Regular exercise and a balanced diet can help. Even modest weight loss improves health.",
    },
    {
        max: 35.0,
        label: "Obese (class I)",
        color: "#E24B4A",
        bg: "#FCEBEB",
        rowId: "row-obese1",
        tip: "Consult a healthcare provider. Lifestyle changes and support programs are effective.",
    },
    {
        max: 40.0,
        label: "Obese (class II)",
        color: "#A32D2D",
        bg: "#FCEBEB",
        rowId: "row-obese2",
        tip: "Medical support is recommended. A GP can refer you to a specialist weight management team.",
    },
    {
        max: Infinity,
        label: "Obese (class III)",
        color: "#501313",
        bg: "#FCEBEB",
        rowId: "row-obese3",
        tip: "Please seek medical guidance — clinical interventions are available and effective.",
    },
];

function getCategory(bmi) {
  return CATS.find((c) => bmi < c.max);
}

function calcHealthyWeight(heightCm) {
  const h = heightCm / 100;
  return [
    Math.round(18.5 * h * h * 10) / 10,
    Math.round(24.9 * h * h * 10) / 10,
  ];
}

function bmiToPercent(bmi) {
    const MIN = 10, MAX = 45;
    const clamped = Math.min(Math.max(bmi, MIN), MAX);
    return ((clamped - MIN) / (MAX - MIN)) * 100;
}

// Setup Chart.js
const ctx = document.getElementById("bmiChart").getContext("2d");
const bmiChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "BMI",
        data: [],
        borderWidth: 2,
        borderColor: "#7F77DD",
        backgroundColor: "rgba(127,119,221,0.08)",
        pointBackgroundColor: "#7F77DD",
        pointRadius: 4,
        tension: 0.35,
        fill: true,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 400 },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: { label: (ctx) => ` BMI ${ctx.parsed.y}` },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 } },
      },
      y: {
        beginAtZero: false,
        min: 10,
        grid: { color: "rgba(128,128,128,0.1)" },
        ticks: { font: { size: 10 } },
      },
    },
  },
});

// ─── LocalStorage History Engine ───
function loadHistoryFromStorage() {
    const rawData = localStorage.getItem("bmi-history-logs");
    return rawData ? JSON.parse(rawData) : [];
}

function updateHistoryUI() {
    const logs = loadHistoryFromStorage();
    
    // 1. Sync UI List Element Viewports
    historyLogList.innerHTML = logs.length === 0 
        ? `<li style="font-size:0.85rem; color:gray; text-align:center; padding: 10px 0;">No logs found. Calculate to start logging!</li>`
        : logs.map(item => `
            <li style="display:flex; justify-content:space-between; font-size:0.85rem; padding: 6px 4px; border-bottom:1px solid rgba(128,128,128,0.05);">
                <span>${item.date} (${item.time})</span>
                <span>BMI: <strong>${item.bmi}</strong> <span style="color:${item.color}; font-size:0.75rem;">●</span></span>
            </li>
          `).join('');

    // 2. Sync Trend Line Graph Elements
    bmiChart.data.labels = logs.map(item => item.time);
    bmiChart.data.datasets[0].data = logs.map(item => parseFloat(item.bmi));
    bmiChart.update();
}

function saveLogToStorage(bmiValue, catObject) {
    const logs = loadHistoryFromStorage();
    const now = new Date();
    
    const newLog = {
        date: now.toLocaleDateString([], { month: "short", day: "numeric" }),
        time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        bmi: bmiValue.toFixed(1),
        label: catObject.label,
        color: catObject.color
    };

    logs.push(newLog);
    if (logs.length > 10) logs.shift(); 
    
    localStorage.setItem("bmi-history-logs", JSON.stringify(logs));
    updateHistoryUI();
}

// ─── Feature 1: Height Field Unit Toggling UI ───
heightUnitEl.addEventListener("change", () => {
    if (heightUnitEl.value === "feet") {
        metricHeightContainer.classList.add("hidden");
        imperialHeightContainer.classList.remove("hidden");
    } else {
        imperialHeightContainer.classList.add("hidden");
        metricHeightContainer.classList.remove("hidden");
    }
    clearError();
});

weightUnitEl.addEventListener("change", () => {
    weightLbl.textContent = weightUnitEl.value === "lb" ? "Weight (lb)" : "Weight (kg)";
    weightInp.placeholder = weightUnitEl.value === "lb" ? "e.g. 154" : "e.g. 70";
    clearError();
});

function showError(msg) {
  errEl.textContent = msg;
  errEl.classList.remove("hidden");
}

function clearError() {
  errEl.classList.add("hidden");
  errEl.textContent = "";
}

// ─── Execution Calculation Handling Block ───
btn.addEventListener("click", () => {
  clearError();

    let w = parseFloat(weightInp.value);
    const hUnit = heightUnitEl.value;
    const wUnit = weightUnitEl.value;

    if (isNaN(w) || w <= 0) {
        showError("Please enter a valid weight parameter.");
        return;
    }

    let heightCm;

    if (hUnit === "feet") {
        const ft = parseFloat(heightFtInp.value);
        const inc = parseFloat(heightInInp.value || 0);

        if (isNaN(ft) || ft <= 0 || isNaN(inc) || inc < 0 || inc >= 12) {
            showError("Please enter a valid height in feet and inches (0–11).");
            return;
        }
        heightCm = (ft * 30.48) + (inc * 2.54);
    } else {
        heightCm = parseFloat(heightInp.value);
        if (isNaN(heightCm) || heightCm <= 0) {
            showError("Please enter a valid height value in centimeters.");
            return;
        }
    }

    if (heightCm < 50 || heightCm > 280) {
        showError("Height boundary out of functional bounds (50–280 cm).");
        return;
    }

    if (wUnit === "lb") w *= 0.453592;

    if (w < 2 || w > 700) {
        showError("Weight parameter threshold seems out of range.");
        return;
    }

    const bmi = w / Math.pow(heightCm / 100, 2);
    const bmiRounded = Math.round(bmi * 10) / 10;
    const cat = getCategory(bmi);

    // Displays BMI metrics updates
    document.getElementById("bmi-val").textContent = bmiRounded.toFixed(1);

    const badge = document.getElementById("cat-badge");
    badge.textContent = cat.label;
    badge.style.background = cat.bg;
    badge.style.color = cat.color;

    // ─── UPDATED: Reference Table Row Active Highlighting ───
    document.querySelectorAll("#reference-table tbody tr").forEach(row => {
        row.classList.remove("active-highlight");
        row.style.background = "transparent"; 
    });
    const targetRow = document.getElementById(cat.rowId);
    if (targetRow) {
        targetRow.classList.add("active-highlight");
        targetRow.style.background = cat.bg; // Keep the colorful row background tint intact
    }

    // Healthy range computation values conversion mapping
    const [wLow, wHigh] = calcHealthyWeight(heightCm);
    const dispUnit = wUnit === "lb" ? "lb" : "kg";
    const mult = wUnit === "lb" ? 2.20462 : 1;
    document.getElementById("healthy-range").textContent =
        `${(wLow * mult).toFixed(1)}–${(wHigh * mult).toFixed(1)} ${dispUnit}`;

    document.getElementById("tip-text").textContent = cat.tip;

    // View ports extraction visibility setup
    resultsEl.classList.remove("hidden");
    resultsEl.style.display = "grid";

    rangeVisEl.classList.remove("hidden");
    rangeVisEl.style.display = "block";

    const pct = bmiToPercent(bmi);
    document.getElementById("bmi-ptr").style.left = pct + "%";

    // Trigger local tracking persistence arrays save pipeline updates
    saveLogToStorage(bmiRounded, cat);

    // ─── Body Fat % Estimate (Deurenberg formula) ───
    const age = parseFloat(ageInp.value);
    const gender = genderInp.value;

    if (!isNaN(age) && age >= 2 && age <= 120) {
        const sexFactor = gender === "male" ? 1 : 0;
        let bodyFat = 1.2 * bmi + 0.23 * age - 10.8 * sexFactor - 5.4;
        bodyFat = Math.round(bodyFat * 10) / 10;
        bodyFat = Math.max(2, Math.min(bodyFat, 65));

        const bfCat = getBodyFatCategory(bodyFat, gender);

        const CIRCUMFERENCE = 326.73;
        const fraction = Math.min(bodyFat / 60, 1);
        const offset = CIRCUMFERENCE * (1 - fraction);
        const arc = document.getElementById("bf-arc");
        arc.style.strokeDashoffset = offset;
        arc.style.stroke = bfCat.color;

        document.getElementById("bf-pct").textContent = bodyFat.toFixed(1);

        const badge = document.getElementById("bf-badge");
        badge.textContent = bfCat.label;
        badge.style.background = bfCat.bg;
        badge.style.color = bfCat.color;

        document.getElementById("bf-desc").textContent = bfCat.tip;

        bfSection.classList.remove("hidden");
        bfSection.style.display = "block";
    } else {
        bfSection.classList.add("hidden");
    }
  }

  if (heightCm < 50 || heightCm > 280) {
    showError("Height seems out of range (50–280 cm).");
    return;
  }

  if (wUnit === "lb") w *= 0.453592;

  if (w < 2 || w > 700) {
    showError("Weight seems out of range.");
    return;
  }

  // Calculates BMI
  const bmi = w / Math.pow(heightCm / 100, 2);
  const bmiRounded = Math.round(bmi * 10) / 10;
  const cat = getCategory(bmi);

  // Displays BMI + category
  document.getElementById("bmi-val").textContent = bmiRounded.toFixed(1);

  const badge = document.getElementById("cat-badge");
  const icons = {
    Underweight: "⚠️",
    "Normal weight": "✅",
    Overweight: "📈",
    "Obese (class I)": "❗",
    "Obese (class II)": "🚨",
    "Obese (class III)": "🛑",
  };

  badge.textContent = `${icons[cat.label] || ""} ${cat.label}`;
  badge.style.background = cat.bg;
  badge.style.color = cat.color;

  // Healthy weight range
  const [wLow, wHigh] = calcHealthyWeight(heightCm);
  const dispUnit = wUnit === "lb" ? "lb" : "kg";
  const mult = wUnit === "lb" ? 2.20462 : 1;
  document.getElementById("healthy-range").textContent =
    `${(wLow * mult).toFixed(1)}–${(wHigh * mult).toFixed(1)} ${dispUnit}`;

  document.getElementById("tip-text").textContent = cat.tip;

  document
    .querySelectorAll(".bmi-table tbody tr")
    .forEach((row) => row.classList.remove("active-row"));

  const rowMap = {
    Underweight: "underweight-row",
    "Normal weight": "normal-row",
    Overweight: "overweight-row",
    "Obese (class I)": "obese1-row",
    "Obese (class II)": "obese2-row",
    "Obese (class III)": "obese3-row",
  };

  document.getElementById(rowMap[cat.label])?.classList.add("active-row");

  // Shows result sections
  resultsEl.classList.remove("hidden");
  resultsEl.style.display = "grid";

  rangeVisEl.classList.remove("hidden");
  rangeVisEl.style.display = "block";

  // Moves range pointer
  const pct = bmiToPercent(bmi);
  document.getElementById("bmi-ptr").style.left = pct + "%";

  // Updates chart data
  const time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  bmiChart.data.labels.push(time);
  bmiChart.data.datasets[0].data.push(bmiRounded);
  bmiChart.update();

  // ─── Body Fat % Estimate (Deurenberg formula) ───
  const age = parseFloat(document.getElementById("age").value);
  const gender = document.getElementById("gender").value;
  const bfSection = document.getElementById("bf-section");

  if (!isNaN(age) && age >= 2 && age <= 120) {
    // Deurenberg et al. (1991): BF% = 1.20 × BMI + 0.23 × Age − 10.8 × Sex − 5.4
    // Sex: male = 1, female = 0
    const sexFactor = gender === "male" ? 1 : 0;
    let bodyFat = 1.2 * bmi + 0.23 * age - 10.8 * sexFactor - 5.4;
    bodyFat = Math.round(bodyFat * 10) / 10;
    bodyFat = Math.max(2, Math.min(bodyFat, 65)); // clamp to sane range

    // Classify body fat %
    const bfCat = getBodyFatCategory(bodyFat, gender);

    // Update gauge
    const CIRCUMFERENCE = 326.73; // 2 × π × 52
    const fraction = Math.min(bodyFat / 60, 1); // 60% = full ring
    const offset = CIRCUMFERENCE * (1 - fraction);
    const arc = document.getElementById("bf-arc");
    arc.style.strokeDashoffset = offset;
    arc.style.stroke = bfCat.color;

    document.getElementById("bf-pct").textContent = bodyFat.toFixed(1);

    const badge = document.getElementById("bf-badge");
    badge.textContent = bfCat.label;
    badge.style.background = bfCat.bg;
    badge.style.color = bfCat.color;

    document.getElementById("bf-desc").textContent = bfCat.tip;

    bfSection.classList.remove("hidden");
    bfSection.style.display = "block";
  } else {
    // Hide if age not provided
    bfSection.classList.add("hidden");
  }
});

// ─── Feature 2: Complete Global Application State Reset Button ───
resetBtn.addEventListener("click", () => {
    // 1. Flush all raw value elements data entries 
    heightInp.value = "";
    heightFtInp.value = "";
    heightInInp.value = "";
    weightInp.value = "";
    ageInp.value = "";
    genderInp.selectedIndex = 0;
    
    // 2. Hide dashboard tracking calculation view layers
    resultsEl.classList.add("hidden");
    resultsEl.style.display = "none";
    rangeVisEl.classList.add("hidden");
    rangeVisEl.style.display = "none";
    bfSection.classList.add("hidden");
    bfSection.style.display = "none";
    clearError();

    // 3. UPDATED: Clear reference grid highlight class list nodes on reset
    document.querySelectorAll("#reference-table tbody tr").forEach(row => {
        row.classList.remove("active-highlight");
        row.style.background = "transparent";
    });

    // 4. Return gauge progress elements arc metrics to base position
    const arc = document.getElementById("bf-arc");
    if(arc) arc.style.strokeDashoffset = "326.73";
});

// ─── Feature 3: Clear All Persistent Logs Handling Engine ───
clearHistoryBtn.addEventListener("click", () => {
    localStorage.removeItem("bmi-history-logs");
    updateHistoryUI(); 
});

// ─── Body Fat Classification ───
function getBodyFatCategory(bf, gender) {
  const ranges =
    gender === "male"
      ? [
          {
            max: 6,
            label: "Essential",
            color: "#2563b0",
            bg: "#eff4fc",
            tip: "Essential fat is the minimum needed for basic physiological function.",
          },
          {
            max: 14,
            label: "Athletic",
            color: "#16a34a",
            bg: "#edf6ef",
            tip: "Athletic range — typical of competitive athletes with rigorous training.",
          },
          {
            max: 18,
            label: "Fitness",
            color: "#0d9488",
            bg: "#f0fdfa",
            tip: "Fitness range — a healthy body composition with good muscle definition.",
          },
          {
            max: 25,
            label: "Average",
            color: "#d97706",
            bg: "#fef3e2",
            tip: "Average range — generally healthy, but there's room for improvement via exercise.",
          },
          {
            max: Infinity,
            label: "Obese",
            color: "#dc2626",
            bg: "#fef2f2",
            tip: "Elevated body fat — consider consulting a healthcare professional for guidance.",
          },
        ]
      : [
          {
            max: 14,
            label: "Essential",
            color: "#2563b0",
            bg: "#eff4fc",
            tip: "Essential fat is the minimum needed for hormonal and reproductive health.",
          },
          {
            max: 21,
            label: "Athletic",
            color: "#16a34a",
            bg: "#edf6ef",
            tip: "Athletic range — typical of competitive female athletes.",
          },
          {
            max: 25,
            label: "Fitness",
            color: "#0d9488",
            bg: "#f0fdfa",
            tip: "Fitness range — a healthy and active body composition.",
          },
          {
            max: 32,
            label: "Average",
            color: "#d97706",
            bg: "#fef3e2",
            tip: "Average range — generally healthy, but regular exercise can improve outcomes.",
          },
          {
            max: Infinity,
            label: "Obese",
            color: "#dc2626",
            bg: "#fef2f2",
            tip: "Elevated body fat — consider consulting a healthcare professional for guidance.",
          },
        ];
  return ranges.find((r) => bf < r.max);
}

// ─── Initialize Storage Log Viewports On First Dom Content Execution ───
updateHistoryUI();