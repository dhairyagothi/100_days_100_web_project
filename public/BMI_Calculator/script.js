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

const heightUnitEl = document.getElementById("height-unit");
const weightUnitEl = document.getElementById("weight-unit");
const heightLbl = document.getElementById("height-lbl");
const weightLbl = document.getElementById("weight-lbl");
const heightInp = document.getElementById("height");
const weightInp = document.getElementById("weight");
const btn = document.getElementById("btn");
const errEl = document.getElementById("error-msg");
const resultsEl = document.getElementById("results");
const rangeVisEl = document.getElementById("range-vis");

// Goal Tracker Variables
const targetBmiInput = document.getElementById('target-bmi');
const weeklyGoalSelect = document.getElementById('weekly-goal');
const goalSection = document.getElementById('goal-section');
const goalStatus = document.getElementById('goal-status');
const goalProgressFill = document.getElementById('goal-progress-fill');
const goalProgressText = document.getElementById('goal-progress-text');
const targetBmiDisplay = document.getElementById('target-bmi-display');
const targetWeightDisplay = document.getElementById('target-weight-display');
const weightDiffDisplay = document.getElementById('weight-diff-display');
const timelineDisplay = document.getElementById('timeline-display');

const GOAL_STORAGE_KEY = 'bmi-target-goal';

// Keep last calculated inputs so the goal tracker can update in real-time
let lastCurrentBMI = null;
let lastCurrentWeightKg = null;
let lastHeightCm = null;
let lastWeightUnit = null;

// Baseline BMI used to compute "progress toward goal"
let lastStartBMI = null;

// Load saved target BMI on page load
(function loadTargetBMI() {
  const saved = localStorage.getItem(GOAL_STORAGE_KEY);
  if (saved && targetBmiInput) {
    targetBmiInput.value = saved;
  }
})();

// Save target BMI when changed + update goal tracker instantly (after first calculate)
targetBmiInput?.addEventListener('input', () => {
  const value = targetBmiInput.value;
  if (value) {
    localStorage.setItem(GOAL_STORAGE_KEY, value);
  } else {
    localStorage.removeItem(GOAL_STORAGE_KEY);
  }

  if (lastCurrentBMI !== null && lastCurrentWeightKg !== null && lastHeightCm !== null && lastWeightUnit) {
    updateGoalTracker(lastCurrentBMI, lastCurrentWeightKg, lastHeightCm, lastWeightUnit);
  }
});

weeklyGoalSelect?.addEventListener('change', () => {
  if (lastCurrentBMI !== null && lastCurrentWeightKg !== null && lastHeightCm !== null && lastWeightUnit) {
    updateGoalTracker(lastCurrentBMI, lastCurrentWeightKg, lastHeightCm, lastWeightUnit);
  }
});

const CATS = [
  {
    max: 18.5,
    label: "Underweight",
    color: "#378ADD",
    bg: "#E6F1FB",
    tip: "Consider increasing caloric intake with nutrient-dense foods. A dietitian can help.",
  },
  {
    max: 25.0,
    label: "Normal weight",
    color: "#639922",
    bg: "#EAF3DE",
    tip: "Great — keep up balanced nutrition and regular activity.",
  },
  {
    max: 30.0,
    label: "Overweight",
    color: "#BA7517",
    bg: "#FAEEDA",
    tip: "Regular exercise and a balanced diet can help. Even modest weight loss improves health.",
  },
  {
    max: 35.0,
    label: "Obese (class I)",
    color: "#E24B4A",
    bg: "#FCEBEB",
    tip: "Consult a healthcare provider. Lifestyle changes and support programs are effective.",
  },
  {
    max: 40.0,
    label: "Obese (class II)",
    color: "#A32D2D",
    bg: "#FCEBEB",
    tip: "Medical support is recommended. A GP can refer you to a specialist weight management team.",
  },
  {
    max: Infinity,
    label: "Obese (class III)",
    color: "#501313",
    bg: "#FCEBEB",
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

// ─── Chart.js setup ───
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

// ─── localStorage Keys ───
const BMI_LABELS_KEY = "bmi-history-labels";
const BMI_DATA_KEY = "bmi-history-data";

// ─── Load saved history on page load ───
(function loadHistory() {
    const savedLabels = JSON.parse(localStorage.getItem(BMI_LABELS_KEY) || "[]");
    const savedData = JSON.parse(localStorage.getItem(BMI_DATA_KEY) || "[]");
    if (savedLabels.length > 0) {
        bmiChart.data.labels = savedLabels;
        bmiChart.data.datasets[0].data = savedData;
        bmiChart.update();
    }
})();

// ─── Clear History ───
document.getElementById("clear-history").addEventListener("click", () => {
    localStorage.removeItem(BMI_LABELS_KEY);
    localStorage.removeItem(BMI_DATA_KEY);
    bmiChart.data.labels = [];
    bmiChart.data.datasets[0].data = [];
    bmiChart.update();
});

// ─── Unit label updates ───
heightUnitEl.addEventListener("change", () => {
  if (heightUnitEl.value === "feet") {
    heightLbl.textContent = "Height (ft/in)";
    heightInp.placeholder = "e.g. 5/8";
  } else {
    heightLbl.textContent = "Height (cm)";
    heightInp.placeholder = "e.g. 170";
  }
});

weightUnitEl.addEventListener("change", () => {
  weightLbl.textContent =
    weightUnitEl.value === "lb" ? "Weight (lb)" : "Weight (kg)";
  weightInp.placeholder = weightUnitEl.value === "lb" ? "e.g. 154" : "e.g. 70";
});

function showError(msg) {
  errEl.textContent = msg;
  errEl.classList.remove("hidden");
}

function clearError() {
  errEl.classList.add("hidden");
  errEl.textContent = "";
}

btn.addEventListener("click", () => {
  clearError();

  const hRaw = heightInp.value.trim();
  let w = parseFloat(weightInp.value);
  const hUnit = heightUnitEl.value;
  const wUnit = weightUnitEl.value;

  if (!hRaw || isNaN(w) || w <= 0) {
    showError("Please enter a valid height and weight.");
    return;
  }

  let heightCm;

  if (hUnit === "feet") {
    const parts = hRaw.split("/");
    if (parts.length !== 2) {
      showError("Use format feet/inches — e.g. 5/8");
      return;
    }
    const ft = parseFloat(parts[0]);
    const inc = parseFloat(parts[1]);
    if (isNaN(ft) || isNaN(inc) || inc < 0 || inc >= 12) {
      showError("Invalid feet/inches. Inches must be 0–11.");
      return;
    }
    heightCm = ft * 30.48 + inc * 2.54;
  } else {
    heightCm = parseFloat(hRaw);
    if (isNaN(heightCm) || heightCm <= 0) {
      showError("Please enter a valid height in cm.");
      return;
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

  // ─── Save history to localStorage ───
  localStorage.setItem(BMI_LABELS_KEY, JSON.stringify(bmiChart.data.labels));
  localStorage.setItem(BMI_DATA_KEY, JSON.stringify(bmiChart.data.datasets[0].data));

  // ─── Update Goal Tracker ───
  // Store current values for instant goal updates on input changes
  lastCurrentBMI = bmi;
  lastCurrentWeightKg = w; // internal uses kg
  lastHeightCm = heightCm;
  lastWeightUnit = wUnit; // keep original display unit selection
  lastStartBMI = bmi;

  updateGoalTracker(bmi, w, heightCm, wUnit);

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


document.querySelectorAll('input[type=number]').forEach(function(el) {
  el.addEventListener('wheel', function(e) {
    el.blur();  // lose focus so scroll doesn't change the value
  });
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

// ─── Goal Tracker Functions ───

function calculateTargetWeight(targetBMI, heightCm) {
  // Target Weight = Target BMI × (height in meters)²
  const heightM = heightCm / 100;
  return targetBMI * heightM * heightM;
}

function calculateWeightDifference(currentWeight, targetWeight) {
  return targetWeight - currentWeight;
}

function calculateTimeline(weightDiff, weeklyGoal) {
  // Calculate weeks needed
  const weeks = Math.abs(weightDiff) / weeklyGoal;
  
  if (weeks < 1) {
    return 'Less than 1 week';
  } else if (weeks < 4) {
    return `${Math.ceil(weeks)} weeks`;
  } else if (weeks < 52) {
    const months = Math.ceil(weeks / 4);
    return `${months} month${months > 1 ? 's' : ''}`;
  } else {
    const years = Math.floor(weeks / 52);
    const remainingMonths = Math.ceil((weeks % 52) / 4);
    if (remainingMonths === 0) {
      return `${years} year${years > 1 ? 's' : ''}`;
    }
    return `${years}y ${remainingMonths}m`;
  }
}

function calculateGoalProgress(currentBMI, targetBMI, startBMI = null) {
  // If no start BMI, use a reasonable baseline
  if (!startBMI) {
    // Assume starting from 5 BMI points away from target
    startBMI = currentBMI > targetBMI ? currentBMI : currentBMI;
  }
  
  const totalDistance = Math.abs(targetBMI - startBMI);
  const currentDistance = Math.abs(targetBMI - currentBMI);
  
  if (totalDistance === 0) return 100;
  
  const progress = ((totalDistance - currentDistance) / totalDistance) * 100;
  
  return Math.max(0, Math.min(100, progress));
}

function showConfetti() {
  const colors = ['#2563b0', '#16a34a', '#d97706', '#dc2626'];
  const confettiCount = 50;
  
  for (let i = 0; i < confettiCount; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-piece';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 0.5 + 's';
      document.body.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), 3000);
    }, i * 30);
  }
}

function updateGoalTracker(currentBMI, currentWeight, heightCm, weightUnit) {
  const targetBMI = parseFloat(targetBmiInput.value);
  
  if (!targetBMI || isNaN(targetBMI) || targetBMI < 15 || targetBMI > 35) {
    goalSection.classList.add('hidden');
    return;
  }
  
  // Calculate target weight
  const targetWeightKg = calculateTargetWeight(targetBMI, heightCm);
  const weightDiffKg = calculateWeightDifference(currentWeight, targetWeightKg);
  
  // Convert to display units
  const mult = weightUnit === 'lb' ? 2.20462 : 1;
  const dispUnit = weightUnit === 'lb' ? 'lb' : 'kg';
  const targetWeightDisp = (targetWeightKg * mult).toFixed(1);
  const weightDiffDisp = Math.abs(weightDiffKg * mult).toFixed(1);
  
  // Calculate timeline
  const weeklyGoal = parseFloat(weeklyGoalSelect.value);
  const timeline = calculateTimeline(weightDiffKg, weeklyGoal);
  
  // Calculate progress toward goal using baseline BMI from last calculation.
  // This stays stable while user tweaks target BMI / weekly goal.
  const baselineBMI = lastStartBMI ?? currentBMI;
  const progress = calculateGoalProgress(currentBMI, targetBMI, baselineBMI);

  // Check if goal achieved (within 0.5 BMI points)
  const bmiDiff = Math.abs(currentBMI - targetBMI);
  const goalAchieved = bmiDiff < 0.5;
  
  // Update UI
  targetBmiDisplay.textContent = targetBMI.toFixed(1);
  targetWeightDisplay.textContent = `${targetWeightDisp} ${dispUnit}`;
  
  if (weightDiffKg > 0) {
    weightDiffDisplay.textContent = `+${weightDiffDisp} ${dispUnit} to gain`;
    weightDiffDisplay.style.color = 'var(--blue)';
  } else if (weightDiffKg < 0) {
    weightDiffDisplay.textContent = `${weightDiffDisp} ${dispUnit} to lose`;
    weightDiffDisplay.style.color = 'var(--amber)';
  } else {
    weightDiffDisplay.textContent = 'Goal achieved!';
    weightDiffDisplay.style.color = 'var(--green)';
  }
  
  timelineDisplay.textContent = timeline;
  
  // Update progress bar
  goalProgressFill.style.width = progress + '%';
  goalProgressText.textContent = Math.round(progress) + '%';
  
  // Update status
  if (goalAchieved) {
    goalStatus.textContent = '✅ Goal Achieved!';
    goalStatus.classList.add('achieved');
    
    // Show confetti only once per session
    if (!sessionStorage.getItem('confetti-shown')) {
      showConfetti();
      sessionStorage.setItem('confetti-shown', 'true');
    }
  } else {
    goalStatus.textContent = 'In Progress';
    goalStatus.classList.remove('achieved');
    sessionStorage.removeItem('confetti-shown');
  }
  
  // Show section with animation
  goalSection.classList.remove('hidden');
  goalSection.style.display = 'block';
}
