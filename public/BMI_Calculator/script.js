/* ═══════════════════════════════════════════════════════════════════════════
   ANIMATED BACKGROUND — Aurora blobs + particle network
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  const canvas = document.getElementById("bg");
  const ctx = canvas.getContext("2d");

  const PARTICLE_COUNT = 120;
  const CONNECT_DISTANCE = 90;
  const PARTICLE_COLORS = [
    "rgba(79,110,247,", // indigo
    "rgba(201,168,76,", // gold
    "rgba(62,207,142,", // emerald
    "rgba(139,92,246,", // purple
  ];

  let W,
    H,
    particles = [],
    tick = 0;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      col: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      alpha: Math.random() * 0.45 + 0.05,
    };
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(makeParticle());
  }

  function drawAurora() {
    ctx.clearRect(0, 0, W, H);

    /* Blob 1 — indigo, top-left drift */
    let g = ctx.createRadialGradient(
      W * 0.25 + Math.sin(tick * 0.0007) * 80,
      H * 0.3 + Math.cos(tick * 0.0009) * 60,
      10,
      W * 0.25,
      H * 0.3,
      W * 0.45,
    );
    g.addColorStop(0, "rgba(79,110,247,0.18)");
    g.addColorStop(1, "transparent");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    /* Blob 2 — purple, top-right drift */
    g = ctx.createRadialGradient(
      W * 0.75 + Math.cos(tick * 0.0006) * 100,
      H * 0.2 + Math.sin(tick * 0.0011) * 50,
      10,
      W * 0.75,
      H * 0.2,
      W * 0.4,
    );
    g.addColorStop(0, "rgba(139,92,246,0.14)");
    g.addColorStop(1, "transparent");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    /* Blob 3 — gold, bottom-centre drift */
    g = ctx.createRadialGradient(
      W * 0.5 + Math.sin(tick * 0.0005) * 120,
      H * 0.75 + Math.cos(tick * 0.0008) * 70,
      10,
      W * 0.5,
      H * 0.75,
      W * 0.35,
    );
    g.addColorStop(0, "rgba(201,168,76,0.10)");
    g.addColorStop(1, "transparent");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  function drawParticles() {
    /* Dots */
    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.col + p.alpha + ")";
      ctx.fill();

      /* Move */
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    /* Connection lines */
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DISTANCE) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle =
            "rgba(79,110,247," + 0.07 * (1 - dist / CONNECT_DISTANCE) + ")";
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    tick++;
    drawAurora();
    drawParticles();
    requestAnimationFrame(loop);
  }

  window.addEventListener("resize", init);
  init();
  loop();
})();

/* =========================================================
   BMI FITNESS DASHBOARD
========================================================= */

("use strict");

/* =========================================================
   ELEMENTS
========================================================= */

const calculateBtn = document.getElementById("calculateBtn");
const resetBtn = document.getElementById("resetBtn");

const bmiValue = document.getElementById("bmiValue");
const category = document.getElementById("category");
const categoryBadge = document.getElementById("categoryBadge");
const message = document.getElementById("message");

const calories = document.getElementById("calories");
const water = document.getElementById("water");
const healthyWeight = document.getElementById("healthyWeight");
const bodyFat = document.getElementById("bodyFat");

const dietPlan = document.getElementById("dietPlan");
const workoutPlan = document.getElementById("workoutPlan");

const gauge = document.querySelector(".gauge");

const resultsSection = document.getElementById("resultsSection");

const errorBox = document.getElementById("errorBox");

/* =========================================================
   BMI HISTORY STORAGE  (fixed: stores full objects)
========================================================= */

const BMI_HISTORY_KEY = "bmi_history_v2";

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(BMI_HISTORY_KEY)) || [];
  } catch {
    return [];
  }
}

function saveHistory(history) {
  localStorage.setItem(BMI_HISTORY_KEY, JSON.stringify(history));
}

function pushToHistory(bmi, weight) {
  const history = loadHistory();
  history.push({
    date: new Date().toISOString(),
    bmi: parseFloat(bmi),
    weight: parseFloat(weight.toFixed(1)),
  });
  // Keep last 20 entries
  if (history.length > 20) history.shift();
  saveHistory(history);
  return history;
}

/* =========================================================
   ACTIVE GOAL STATE
========================================================= */

let activeGoal = null; // "lose" | "maintain" | "gain"
let lastBMICategory = null; // stored after each calculation
let lastCaloriesBase = 0; // base calories from BMI category

/* =========================================================
   BMI CHART  (rebuilt from history on load)
========================================================= */

const ctx = document.getElementById("bmiChart");

const bmiChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "BMI Progress",
        data: [],
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        backgroundColor: "rgba(99,102,241,0.15)",
        borderColor: "#6366f1",
        pointBackgroundColor: "#6366f1",
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#111",
          font: { size: 14, weight: "600" },
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ` BMI: ${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      x: { ticks: { color: "#333" }, grid: { color: "rgba(0,0,0,0.08)" } },
      y: {
        beginAtZero: false,
        ticks: { color: "#333" },
        suggestedMin: 10,
        suggestedMax: 40,
        grid: { color: "rgba(0,0,0,0.08)" },
      },
    },
    plugins_annotations: {},
  },
});

function rebuildChart() {
  const history = loadHistory();

  if (history.length === 0) {
    bmiChart.data.labels = ["No data yet"];
    bmiChart.data.datasets[0].data = [null];
    bmiChart.update();
    return;
  }

  // Pick up current theme primary color
  const primary =
    getComputedStyle(document.body).getPropertyValue("--primary").trim() ||
    "#6366f1";

  bmiChart.data.datasets[0].borderColor = primary;
  bmiChart.data.datasets[0].pointBackgroundColor = primary;
  bmiChart.data.datasets[0].backgroundColor = primary
    .replace(")", ", 0.15)")
    .replace("rgb", "rgba");

  bmiChart.data.labels = history.map((e) => {
    const d = new Date(e.date);
    // Formats the date as "Jun 15", "Jun 16", etc.
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });
  bmiChart.data.datasets[0].data = history.map((e) => e.bmi);
  bmiChart.update();
}

/* =========================================================
   EVENT LISTENERS
========================================================= */

calculateBtn.addEventListener("click", calculateBMI);
resetBtn.addEventListener("click", resetAll);

/* =========================================================
   CALCULATE BMI
========================================================= */

function calculateBMI() {
  hideError();

  let height = parseFloat(document.getElementById("height").value);
  let weight = parseFloat(document.getElementById("weight").value);

  const age = parseFloat(document.getElementById("age").value);
  const gender = document.getElementById("gender").value;

  const heightUnit = document.getElementById("heightUnit").value;
  const weightUnit = document.getElementById("weightUnit").value;

  /* ── Validation ── */
  if (!height || !weight || height <= 0 || weight <= 0) {
    showError("Please enter valid height and weight.");
    return;
  }

  /* ── Unit conversions ── */
  if (heightUnit === "ft") height = height * 30.48;
  if (weightUnit === "lb") weight = weight * 0.453592;

  if (height < 50 || height > 300) {
    showError("Height seems unrealistic.");
    return;
  }
  if (weight < 10 || weight > 500) {
    showError("Weight seems unrealistic.");
    return;
  }

  /* ── BMI ── */
  const bmi = (weight / Math.pow(height / 100, 2)).toFixed(1);

  bmiValue.innerText = bmi;
  updateGauge(bmi);
  resultsSection.classList.remove("hidden");

  /* ── Healthy weight range ── */
  const minWeight = (18.5 * Math.pow(height / 100, 2)).toFixed(1);
  const maxWeight = (24.9 * Math.pow(height / 100, 2)).toFixed(1);
  healthyWeight.innerText = `${minWeight} – ${maxWeight} kg`;

  /* ── Water intake ── */
  water.innerText = `${(weight * 0.033).toFixed(1)} Litres/day`;

  /* ── Body fat estimation ── */
  if (age && age > 0) {
    const sexFactor = gender === "male" ? 1 : 0;
    let bf = 1.2 * bmi + 0.23 * age - 10.8 * sexFactor - 5.4;
    bf = Math.max(2, Math.min(bf, 65));
    bodyFat.innerText = `${bf.toFixed(1)}%`;
  } else {
    bodyFat.innerText = "N/A";
  }

  /* ── Reset lists & table ── */
  dietPlan.innerHTML = "";
  workoutPlan.innerHTML = "";
  clearActiveRows();

  /* ── Category logic ── */
  if (bmi < 18.5) {
    lastBMICategory = "underweight";
    category.innerText = "Underweight";
    categoryBadge.innerText = "⚠️ Underweight";
    message.innerText =
      "You should focus on gaining healthy weight with nutrient-rich foods.";
    lastCaloriesBase = 2650;
    setCategoryColor("#f39c12");
    activateRow("underweight-row");
  } else if (bmi < 25) {
    lastBMICategory = "normal";
    category.innerText = "Normal";
    categoryBadge.innerText = "✅ Healthy";
    message.innerText =
      "Great! Maintain your healthy lifestyle and stay active.";
    lastCaloriesBase = 2200;
    setCategoryColor("#2ecc71");
    activateRow("normal-row");
  } else if (bmi < 30) {
    lastBMICategory = "overweight";
    category.innerText = "Overweight";
    categoryBadge.innerText = "📈 Overweight";
    message.innerText =
      "Focus on fat loss through exercise and a healthy diet.";
    lastCaloriesBase = 1850;
    setCategoryColor("#ff9800");
    activateRow("overweight-row");
  } else {
    lastBMICategory = "obese";
    category.innerText = "Obese";
    categoryBadge.innerText = "🚨 Obese";
    message.innerText =
      "Adopt healthier habits and consult a fitness expert if needed.";
    lastCaloriesBase = 1650;
    setCategoryColor("#ff4d4d");
    activateRow("obese-row");
  }

  /* ── Apply active goal overlay (or defaults) ── */
  applyGoal(activeGoal);

  /* ── Save to history & update chart ── */
  pushToHistory(bmi, weight);
  rebuildChart();
}

/* =========================================================
   GOAL SYSTEM
========================================================= */

const GOAL_CONFIGS = {
  lose: {
    label: "🔻 Lose Weight",
    calorieOffset: -400,
    diet: [
      "High-protein lean meats (chicken, turkey)",
      "Non-starchy vegetables (broccoli, spinach)",
      "Low-sugar fruits (berries, apple)",
      "High-fibre whole grains (oats, quinoa)",
      "Avoid refined sugars & processed foods",
    ],
    workout: [
      "HIIT — 3× / week (20–30 min)",
      "Strength training — 3× / week",
      "Daily 30-min brisk walk",
      "Active rest: yoga or stretching",
    ],
    tip: "Aim for a 300–500 kcal daily deficit. Strength training preserves muscle while you lose fat.",
  },
  maintain: {
    label: "⚖️ Maintain Weight",
    calorieOffset: 0,
    diet: [
      "Balanced diet: 40% carbs, 30% protein, 30% fat",
      "Colourful vegetables & seasonal fruits",
      "Whole grains & legumes",
      "Lean protein (fish, eggs, pulses)",
      "Stay hydrated — 8+ glasses/day",
    ],
    workout: [
      "Cardio — 3× / week (30–45 min)",
      "Strength training — 2× / week",
      "Yoga or mobility work — 1× / week",
      "Stay active throughout the day",
    ],
    tip: "Consistency beats intensity. Focus on sustainable habits rather than strict rules.",
  },
  gain: {
    label: "💪 Gain Muscle",
    calorieOffset: +400,
    diet: [
      "Calorie-dense whole foods (oats, rice, sweet potato)",
      "High-protein: eggs, chicken, legumes, Greek yogurt",
      "Healthy fats: peanut butter, avocado, nuts",
      "Milk or plant-based high-calorie shakes",
      "Eat every 3–4 hours; don't skip meals",
    ],
    workout: [
      "Heavy compound lifts — 4× / week (squat, deadlift, bench)",
      "Progressive overload: add weight each week",
      "Rest 48 hrs between same muscle groups",
      "Limit cardio to 1–2× / week (light)",
    ],
    tip: "Muscle grows during rest, not just training. Prioritise 7–9 hours of sleep.",
  },
};

function applyGoal(goal) {
  const base = lastCaloriesBase;

  if (!goal || !base) {
    // No goal selected — use BMI-category defaults
    setDefaultRecommendations();
    return;
  }

  const cfg = GOAL_CONFIGS[goal];

  // Calorie display
  const adjusted = base + cfg.calorieOffset;
  const low = adjusted - 100;
  const high = adjusted + 100;
  calories.innerText = `${low} – ${high} kcal/day`;

  // Diet plan
  dietPlan.innerHTML = "";
  addDiet(cfg.diet);

  // Workout plan
  workoutPlan.innerHTML = "";
  addWorkout(cfg.workout);

  // Goal tip
  const tipEl = document.getElementById("goalTip");
  if (tipEl) {
    tipEl.innerText = cfg.tip;
    tipEl.classList.remove("hidden");
  }
}

function setDefaultRecommendations() {
  const tipEl = document.getElementById("goalTip");
  if (tipEl) tipEl.classList.add("hidden");

  if (lastBMICategory === "underweight") {
    calories.innerText = "2500 – 2800 kcal/day";
    addDiet(["Milk & Dairy", "Eggs", "Bananas", "Nuts", "Peanut Butter"]);
    addWorkout([
      "Strength Training",
      "Pushups",
      "Squats",
      "Resistance Training",
    ]);
  } else if (lastBMICategory === "normal") {
    calories.innerText = "2000 – 2400 kcal/day";
    addDiet([
      "Balanced Diet",
      "Vegetables",
      "Fruits",
      "Protein",
      "Whole Grains",
    ]);
    addWorkout(["Jogging", "Cycling", "Walking", "Yoga"]);
  } else if (lastBMICategory === "overweight") {
    calories.innerText = "1700 – 2000 kcal/day";
    addDiet(["Salads", "High Protein Foods", "Low Sugar", "More Fibre"]);
    addWorkout(["Running", "HIIT", "Cardio", "Cycling"]);
  } else if (lastBMICategory === "obese") {
    calories.innerText = "1500 – 1800 kcal/day";
    addDiet([
      "Protein Rich Foods",
      "Vegetables",
      "Low Carb Meals",
      "More Water",
    ]);
    addWorkout(["Walking", "Swimming", "Cycling", "Light Cardio"]);
  }
}

function selectGoal(goal) {
  activeGoal = goal;

  // Update button states
  document.querySelectorAll(".goal-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.goal === goal);
  });

  // If a BMI has already been calculated, re-apply
  if (lastBMICategory) {
    dietPlan.innerHTML = "";
    workoutPlan.innerHTML = "";
    applyGoal(activeGoal);
  }
}

/* =========================================================
   UPDATE GAUGE
========================================================= */

function updateGauge(bmi) {
  const degree = Math.min((bmi / 40) * 360, 360);
  gauge.style.background = `conic-gradient(
    var(--primary) 0deg,
    var(--primary) ${degree}deg,
    rgba(255,255,255,0.12) ${degree}deg
  )`;
}

/* =========================================================
   ADD DIET / WORKOUT ITEMS
========================================================= */

function addDiet(items) {
  items.forEach((item) => {
    const li = document.createElement("li");
    li.innerText = item;
    dietPlan.appendChild(li);
  });
}

function addWorkout(items) {
  items.forEach((item) => {
    const li = document.createElement("li");
    li.innerText = item;
    workoutPlan.appendChild(li);
  });
}

/* =========================================================
   CATEGORY COLORS
========================================================= */

function setCategoryColor(color) {
  categoryBadge.style.background = `${color}20`;
  categoryBadge.style.color = color;
}

/* =========================================================
   ACTIVE TABLE ROW
========================================================= */

function activateRow(id) {
  const row = document.getElementById(id);
  if (row) row.classList.add("active-row");
}

function clearActiveRows() {
  document.querySelectorAll(".bmi-table tbody tr").forEach((row) => {
    row.classList.remove("active-row");
  });
}

/* =========================================================
   RESET ALL
========================================================= */

function resetAll() {
  document.getElementById("height").value = "";
  document.getElementById("weight").value = "";
  document.getElementById("age").value = "";
  document.getElementById("gender").value = "male";

  bmiValue.innerText = "0";
  category.innerText = "Your Category";
  categoryBadge.innerText = "Healthy";
  message.innerText = "Your health insights will appear here.";
  calories.innerText = "0 kcal/day";
  water.innerText = "0 Litres/day";
  healthyWeight.innerText = "0 – 0 kg";
  bodyFat.innerText = "0%";

  dietPlan.innerHTML = "";
  workoutPlan.innerHTML = "";

  gauge.style.background = `conic-gradient(var(--primary) 0deg, rgba(255,255,255,0.1) 0deg)`;

  resultsSection.classList.add("hidden");
  clearActiveRows();
  hideError();

  // Reset goal state
  lastBMICategory = null;
  lastCaloriesBase = 0;

  const tipEl = document.getElementById("goalTip");
  if (tipEl) tipEl.classList.add("hidden");
}

/* =========================================================
   ERROR HANDLING
========================================================= */

function showError(msg) {
  errorBox.innerText = msg;
  errorBox.classList.remove("hidden");
}

function hideError() {
  errorBox.classList.add("hidden");
}

/* =========================================================
   CHANGE THEME
========================================================= */

function changeTheme(theme) {
  document.body.className = theme;
  localStorage.setItem("selectedTheme", theme);
  // Small delay so CSS vars update first
  setTimeout(rebuildChart, 50);
}

/* =========================================================
   ON LOAD
========================================================= */

window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("selectedTheme");
  if (savedTheme) document.body.className = savedTheme;

  // Populate chart from saved history
  rebuildChart();
});

/* =========================================================
   ENTER KEY SUPPORT
========================================================= */

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") calculateBMI();
});

// Controls the custom + and - buttons for number inputs
function stepInput(inputId, stepValue) {
  const input = document.getElementById(inputId);
  let currentValue = parseFloat(input.value) || 0;

  let newValue = currentValue + stepValue;

  // Prevent going below 0 for physical measurements
  if (newValue < 0) {
    newValue = 0;
  }

  input.value = newValue;
}


/* =========================================================
   DYNAMIC THEME COLOR PICKER
========================================================= */

// Get the color picker element
const colorPicker = document.getElementById('themeColorPicker');
const hexDisplay = document.getElementById('colorHexDisplay');
const DARKEN_AMOUNT = 30; // For secondary color

/**
 * Apply a custom theme color
 * @param {string} hexColor - Hex color code (e.g., '#9b5cff')
 */
function applyCustomTheme(hexColor) {
    // Validate hex color
    if (!hexColor || !/^#[0-9A-F]{6}$/i.test(hexColor)) {
        hexColor = '#9b5cff'; // Fallback to default purple
    }
    
    // Remove 'theme-' class if any
    document.body.className = '';
    
    // Set CSS custom properties dynamically
    document.documentElement.style.setProperty('--primary', hexColor);
    
    // Generate secondary color (darker version)
    const secondaryColor = darkenColor(hexColor, DARKEN_AMOUNT);
    document.documentElement.style.setProperty('--secondary', secondaryColor);
    
    // Update background gradient with the primary color
    const bgGradient = generateBackgroundGradient(hexColor);
    document.body.style.background = bgGradient;
    
    // Update the gauge gradient
    updateGaugeStyles(hexColor);
    
    // Update chart colors if chart exists
    if (bmiChart) {
        bmiChart.data.datasets[0].borderColor = hexColor;
        bmiChart.data.datasets[0].pointBackgroundColor = hexColor;
        bmiChart.data.datasets[0].backgroundColor = hexColor + '26'; // 15% opacity
        bmiChart.update();
    }
    
    // Save to localStorage
    localStorage.setItem('customThemeColor', hexColor);
    
    // Update hex display
    if (hexDisplay) {
        hexDisplay.textContent = hexColor.toUpperCase();
    }
}

/**
 * Darken a hex color by a percentage
 * @param {string} hex - Hex color code
 * @param {number} amount - Amount to darken (0-255)
 * @returns {string} Darkened hex color
 */
function darkenColor(hex, amount) {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Parse hex to RGB
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    // Darken
    r = Math.max(0, r - amount);
    g = Math.max(0, g - amount);
    b = Math.max(0, b - amount);
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Generate a beautiful gradient based on the primary color
 * @param {string} hex - Hex color code
 * @returns {string} CSS gradient
 */
function generateBackgroundGradient(hex) {
    // Parse hex to RGB for gradient generation
    const rgb = hexToRgb(hex);
    
    // Create a gradient with varying opacity of the primary color
    return `linear-gradient(135deg, 
        rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25) 0%, 
        rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.10) 50%,
        rgba(${Math.floor(rgb.r/2)}, ${Math.floor(rgb.g/2)}, ${Math.floor(rgb.b/2)}, 0.30) 100%)`;
}

/**
 * Convert hex to RGB object
 * @param {string} hex - Hex color code
 * @returns {object} RGB values
 */
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 155, g: 92, b: 255 };
}

/**
 * Update gauge styles dynamically
 * @param {string} color - Hex color code
 */
function updateGaugeStyles(color) {
    const gaugeElement = document.querySelector('.gauge');
    if (gaugeElement) {
        // Don't override the conic gradient if BMI is calculated
        // Just update the primary color for future calculations
        gaugeElement.style.setProperty('--gauge-color', color);
    }
}

/**
 * Color picker event handler
 */
if (colorPicker) {
    colorPicker.addEventListener('input', function(e) {
        const color = e.target.value;
        applyCustomTheme(color);
    });
}

/**
 * Reset to default theme
 */
function resetToDefaultTheme() {
    const defaultColor = '#9b5cff';
    
    // Reset body class to default
    document.body.className = 'theme-purple';
    
    // Reset custom properties
    document.documentElement.style.setProperty('--primary', '');
    document.documentElement.style.setProperty('--secondary', '');
    document.body.style.background = '';
    
    // Update color picker
    if (colorPicker) {
        colorPicker.value = defaultColor;
    }
    
    if (hexDisplay) {
        hexDisplay.textContent = defaultColor.toUpperCase();
    }
    
    // Update chart
    if (bmiChart) {
        bmiChart.data.datasets[0].borderColor = '#9b5cff';
        bmiChart.data.datasets[0].pointBackgroundColor = '#9b5cff';
        bmiChart.data.datasets[0].backgroundColor = 'rgba(155, 92, 255, 0.15)';
        bmiChart.update();
    }
    
    // Remove custom theme from localStorage
    localStorage.removeItem('customThemeColor');
    
    // Reload styles
    location.reload(); // Simple refresh to reset everything
}

/**
 * Initialize theme on load
 */
function initTheme() {
    const savedColor = localStorage.getItem('customThemeColor');
    
    // Check if there's a saved custom color
    if (savedColor && /^#[0-9A-F]{6}$/i.test(savedColor)) {
        applyCustomTheme(savedColor);
        if (colorPicker) {
            colorPicker.value = savedColor;
        }
        if (hexDisplay) {
            hexDisplay.textContent = savedColor.toUpperCase();
        }
    } else {
        // Check for saved theme class
        const savedTheme = localStorage.getItem('selectedTheme');
        if (savedTheme) {
            document.body.className = savedTheme;
            // Update color picker to match
            const colorMap = {
                'theme-purple': '#9b5cff',
                'theme-blue': '#4da3ff',
                'theme-green': '#35d07f',
                'theme-orange': '#ff9800'
            };
            const color = colorMap[savedTheme] || '#9b5cff';
            if (colorPicker) {
                colorPicker.value = color;
            }
            if (hexDisplay) {
                hexDisplay.textContent = color.toUpperCase();
            }
        }
    }
}

/**
 * Preset color quick picker (Optional Enhancement)
 */
function applyPresetColor(color) {
    if (colorPicker) {
        colorPicker.value = color;
    }
    applyCustomTheme(color);
}