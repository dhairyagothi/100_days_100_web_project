/* ═══════════════════════════════════════════════════════════════════════════
   ANIMATED BACKGROUND — Aurora blobs + particle network
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  const canvas = document.getElementById("bg");
  if (!canvas) return;
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
   BMI HISTORY STORAGE
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
  if (history.length > 20) history.shift();
  saveHistory(history);
  return history;
}

/* =========================================================
   ACTIVE GOAL STATE
========================================================= */

let activeGoal = null; 
let lastBMICategory = null; 
let lastCaloriesBase = 0; 

/* =========================================================
   BMI CHART INITIALIZATION
========================================================= */

let bmiChart = null; // Store chart globally if it creates successfully

if (typeof Chart !== "undefined") {
  const bmiCanvas = document.getElementById("bmiChart");

  if (bmiCanvas) {
    const ctx = bmiCanvas.getContext("2d");

    bmiChart = new Chart(ctx, {
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
      },
    });
  }
}

// ─── Height Field Toggling ───
heightUnitEl.addEventListener("change", () => {
    const cmContainer = document.getElementById("height-cm-container");
    const ftInContainer = document.getElementById("height-ft-in-container");
    
    if (heightUnitEl.value === "feet") {
        cmContainer.classList.add("hidden");
        ftInContainer.classList.remove("hidden");
    } else {
        cmContainer.classList.remove("hidden");
        ftInContainer.classList.add("hidden");
    }
  }

  /* ── Reset lists & table ── */
  if (dietPlan) dietPlan.innerHTML = "";
  if (workoutPlan) workoutPlan.innerHTML = "";
  clearActiveRows();

  /* ── Category logic ── */
  if (bmi < 18.5) {
    lastBMICategory = "underweight";
    if (category) category.innerText = "Underweight";
    if (categoryBadge) categoryBadge.innerText = "⚠️ Underweight";
    if (message) message.innerText = "You should focus on gaining healthy weight with nutrient-rich foods.";
    lastCaloriesBase = 2650;
    setCategoryColor("#f39c12");
    activateRow("underweight-row");
  } else if (bmi < 25) {
    lastBMICategory = "normal";
    if (category) category.innerText = "Normal";
    if (categoryBadge) categoryBadge.innerText = "✅ Healthy";
    if (message) message.innerText = "Great! Maintain your healthy lifestyle and stay active.";
    lastCaloriesBase = 2200;
    setCategoryColor("#2ecc71");
    activateRow("normal-row");
  } else if (bmi < 30) {
    lastBMICategory = "overweight";
    if (category) category.innerText = "Overweight";
    if (categoryBadge) categoryBadge.innerText = "📈 Overweight";
    if (message) message.innerText = "Focus on fat loss through exercise and a healthy diet.";
    lastCaloriesBase = 1850;
    setCategoryColor("#ff9800");
    activateRow("overweight-row");
  } else {
    lastBMICategory = "obese";
    if (category) category.innerText = "Obese";
    if (categoryBadge) categoryBadge.innerText = "🚨 Obese";
    if (message) message.innerText = "Adopt healthier habits and consult a fitness expert if needed.";
    lastCaloriesBase = 1650;
    setCategoryColor("#ff4d4d");
    activateRow("obese-row");
  }

  /* ── Apply active goal overlay ── */
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
    setDefaultRecommendations();
    return;
  }

  const cfg = GOAL_CONFIGS[goal];

  // Calorie display
  const adjusted = base + cfg.calorieOffset;
  const low = adjusted - 100;
  const high = adjusted + 100;
  if (calories) calories.innerText = `${low} – ${high} kcal/day`;

  // Diet plan
  if (dietPlan) {
    dietPlan.innerHTML = "";
    addDiet(cfg.diet);
  }

  // Workout plan
  if (workoutPlan) {
    workoutPlan.innerHTML = "";
    addWorkout(cfg.workout);
  }

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

  if (!calories) return; // Break if fields don't exist

  if (lastBMICategory === "underweight") {
    calories.innerText = "2500 – 2800 kcal/day";
    addDiet(["Milk & Dairy", "Eggs", "Bananas", "Nuts", "Peanut Butter"]);
    addWorkout(["Strength Training", "Pushups", "Squats", "Resistance Training"]);
  } else if (lastBMICategory === "normal") {
    calories.innerText = "2000 – 2400 kcal/day";
    addDiet(["Balanced Diet", "Vegetables", "Fruits", "Protein", "Whole Grains"]);
    addWorkout(["Jogging", "Cycling", "Walking", "Yoga"]);
  } else if (lastBMICategory === "overweight") {
    calories.innerText = "1700 – 2000 kcal/day";
    addDiet(["Salads", "High Protein Foods", "Low Sugar", "More Fibre"]);
    addWorkout(["Running", "HIIT", "Cardio", "Cycling"]);
  } else if (lastBMICategory === "obese") {
    calories.innerText = "1500 – 1800 kcal/day";
    addDiet(["Protein Rich Foods", "Vegetables", "Low Carb Meals", "More Water"]);
    addWorkout(["Walking", "Swimming", "Cycling", "Light Cardio"]);
  }
}

function selectGoal(goal) {
  activeGoal = goal;

  document.querySelectorAll(".goal-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.goal === goal);
  });

  if (lastBMICategory) {
    if (dietPlan) dietPlan.innerHTML = "";
    if (workoutPlan) workoutPlan.innerHTML = "";
    applyGoal(activeGoal);
  }
}

// ─── Calculate Button Click ───
btn.addEventListener("click", () => {
    clearError();

    const hUnit = heightUnitEl.value;
    const wUnit = weightUnitEl.value;
    let w = parseFloat(weightInp.value);

    let heightCm;
    let heightDisplayStr;

    if (hUnit === "feet") {
        const ft = parseFloat(document.getElementById("height-ft").value);
        const inc = parseFloat(document.getElementById("height-in").value || 0);
        if (isNaN(ft) || ft <= 0) {
            showError("Please enter a valid height in feet.");
            return;
        }
        if (isNaN(inc) || inc < 0 || inc >= 12) {
            showError("Invalid inches. Inches must be 0–11.");
            return;
        }
        heightCm = ft * 30.48 + inc * 2.54;
        heightDisplayStr = `${ft} ft ${inc} in`;
    } else {
        const hRaw = heightInp.value.trim();
        heightCm = parseFloat(hRaw);
        if (isNaN(heightCm) || heightCm <= 0) {
            showError("Please enter a valid height in cm.");
            return;
        }
        heightDisplayStr = `${heightCm} cm`;
    }

/* =========================================================
   ACTIVE TABLE ROW
========================================================= */

    if (isNaN(w) || w <= 0) {
        showError("Please enter a valid weight.");
        return;
    }

    let weightDisplayStr = wUnit === "lb" ? `${w} lb` : `${w} kg`;

    if (wUnit === "lb") w *= 0.453592;

function clearActiveRows() {
  document.querySelectorAll(".bmi-table tbody tr").forEach((row) => {
    row.classList.remove("active-row");
  });
}

/* =========================================================
   RESET ALL
========================================================= */

function resetAll() {
  if(document.getElementById("height")) document.getElementById("height").value = "";
  if(document.getElementById("weight")) document.getElementById("weight").value = "";
  if(document.getElementById("age")) document.getElementById("age").value = "";
  if(document.getElementById("gender")) document.getElementById("gender").value = "male";

  if (bmiValue) bmiValue.innerText = "0";
  if (category) category.innerText = "Your Category";
  if (categoryBadge) categoryBadge.innerText = "Healthy";
  if (message) message.innerText = "Your health insights will appear here.";
  if (calories) calories.innerText = "0 kcal/day";
  if (water) water.innerText = "0 Litres/day";
  if (healthyWeight) healthyWeight.innerText = "0 – 0 kg";
  if (bodyFat) bodyFat.innerText = "0%";

  if (dietPlan) dietPlan.innerHTML = "";
  if (workoutPlan) workoutPlan.innerHTML = "";

  if (gauge) {
    gauge.style.background = `conic-gradient(var(--primary) 0deg, rgba(255,255,255,0.1) 0deg)`;
  }

  if (resultsSection) resultsSection.classList.add("hidden");
  clearActiveRows();
  hideError();

  lastBMICategory = null;
  lastCaloriesBase = 0;

  const tipEl = document.getElementById("goalTip");
  if (tipEl) tipEl.classList.add("hidden");
}

/* =========================================================
   ERROR HANDLING
========================================================= */

function showError(msg) {
  if (!errorBox) return;
  errorBox.innerText = msg;
  errorBox.classList.remove("hidden");
}

function hideError() {
  if (errorBox) errorBox.classList.add("hidden");
}

/* =========================================================
   CHANGE THEME
========================================================= */

    // Highlight Reference Table Row
    highlightCategoryRow(cat.label);

    // Shows result sections
    resultsEl.classList.remove("hidden");
    resultsEl.style.display = "grid";

/* =========================================================
   ON LOAD
========================================================= */

window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("selectedTheme");
  if (savedTheme) document.body.className = savedTheme;

    // ─── Body Fat % Estimate (Deurenberg formula) ───
    const age = parseFloat(document.getElementById("age").value);
    const gender = document.getElementById("gender").value;
    const bfSection = document.getElementById("bf-section");

    if (!isNaN(age) && age >= 2 && age <= 120) {
        // Deurenberg et al. (1991)
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
        bfSection.classList.add("hidden");
        bfSection.style.display = "";
    }

    // Save to history
    saveToHistory(bmiRounded, heightDisplayStr, weightDisplayStr, cat.label);
});

/* =========================================================
   ENTER KEY SUPPORT
========================================================= */

document.addEventListener("keydown", (e) => {
  // Only execute calculation if user hits enter while typing in BMI fields
  if (e.key === "Enter" && document.getElementById("height")) {
    calculateBMI();
  }
});

// Controls the custom + and - buttons for number inputs
function stepInput(inputId, stepValue) {
  const input = document.getElementById(inputId);
  if (!input) return;
  
  let currentValue = parseFloat(input.value) || 0;
  let newValue = currentValue + stepValue;

  if (newValue < 0) {
    newValue = 0;
  }

  input.value = newValue;
}
const navbtn = document.querySelector(".nav-btn");
const ctabtn = document.querySelector(".cta-btn");
if (navbtn) {
  navbtn.addEventListener("click", () => {
    window.location.href = "bmi.html";
  });
}

if (ctabtn) {
  ctabtn.addEventListener("click", () => {
    window.location.href = "bmi.html";
  });
}

// ─── Reference Table Highlights ───
function highlightCategoryRow(categoryLabel) {
    const rows = document.querySelectorAll(".bmi-table tbody tr");
    rows.forEach(row => {
        row.classList.remove("highlight-blue", "highlight-green", "highlight-amber", "highlight-red");
    });

    const labelLower = categoryLabel.toLowerCase();
    rows.forEach(row => {
        const rowText = row.cells[1].textContent.trim().toLowerCase();
        if (rowText === labelLower) {
            if (labelLower.includes("underweight")) {
                row.classList.add("highlight-blue");
            } else if (labelLower.includes("normal")) {
                row.classList.add("highlight-green");
            } else if (labelLower.includes("overweight")) {
                row.classList.add("highlight-amber");
            } else if (labelLower.includes("obese")) {
                row.classList.add("highlight-red");
            }
        }
    });
}

// ─── History Tracker Functionality ───
function saveToHistory(bmi, heightStr, weightStr, category) {
    const history = JSON.parse(localStorage.getItem("bmi-history") || "[]");
    const record = {
        id: Date.now(),
        timestamp: Date.now(),
        bmi: bmi,
        height: heightStr,
        weight: weightStr,
        category: category
    };
    history.push(record);
    localStorage.setItem("bmi-history", JSON.stringify(history));
    loadHistory();
}

function deleteRecord(id) {
    let history = JSON.parse(localStorage.getItem("bmi-history") || "[]");
    history = history.filter(r => r.id !== id);
    localStorage.setItem("bmi-history", JSON.stringify(history));
    loadHistory();
}

function loadHistory() {
    const history = JSON.parse(localStorage.getItem("bmi-history") || "[]");
    const emptyEl = document.getElementById("history-empty");
    const tableWrapEl = document.getElementById("history-table-wrap");
    const listEl = document.getElementById("history-list");
    const clearBtn = document.getElementById("btn-clear-history");

    updateChartFromHistory(history);

    if (history.length === 0) {
        emptyEl.classList.remove("hidden");
        tableWrapEl.classList.add("hidden");
        clearBtn.classList.add("hidden");
        listEl.innerHTML = "";
        return;
    }

    emptyEl.classList.add("hidden");
    tableWrapEl.classList.remove("hidden");
    clearBtn.classList.remove("hidden");

    listEl.innerHTML = "";
    history.forEach(record => {
        const tr = document.createElement("tr");
        
        // Find category color dot/badge
        const catObj = CATS.find(c => record.category.toLowerCase() === c.label.toLowerCase()) || { color: "var(--ink)", bg: "transparent" };
        
        const date = new Date(record.timestamp);
        const dateStr = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) + 
                        ' ' + 
                        date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
        
        tr.innerHTML = `
            <td>${dateStr}</td>
            <td>${record.height}</td>
            <td>${record.weight}</td>
            <td><strong>${record.bmi.toFixed(1)}</strong></td>
            <td><span class="category-badge" style="background: ${catObj.bg}; color: ${catObj.color}; margin-top: 0; display: inline-block;">${record.category}</span></td>
            <td style="text-align: right;">
                <button class="delete-record-btn" data-id="${record.id}" title="Delete record">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </button>
            </td>
        `;
        listEl.appendChild(tr);
    });

    listEl.querySelectorAll(".delete-record-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.getAttribute("data-id"));
            deleteRecord(id);
        });
    });
}

function updateChartFromHistory(history) {
    bmiChart.data.labels = [];
    bmiChart.data.datasets[0].data = [];

    history.forEach(record => {
        const date = new Date(record.timestamp);
        const label = date.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' }) + 
                      ' ' + 
                      date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
        
        bmiChart.data.labels.push(label);
        bmiChart.data.datasets[0].data.push(record.bmi);
    });

    bmiChart.update();
}

// ─── Reset Button Handler ───
document.getElementById("btn-reset").addEventListener("click", () => {
    // 1. Clear form inputs
    heightInp.value = "";
    document.getElementById("height-ft").value = "";
    document.getElementById("height-in").value = "";
    weightInp.value = "";
    document.getElementById("age").value = "";

    // 2. Clear error message
    clearError();

    // 3. Hide calculated results & gauges
    resultsEl.classList.add("hidden");
    resultsEl.style.display = "";

    rangeVisEl.classList.add("hidden");
    rangeVisEl.style.display = "";

    document.getElementById("bf-section").classList.add("hidden");
    document.getElementById("bf-section").style.display = "";

    // 4. Reset display values back to placeholders/defaults
    document.getElementById("bmi-val").textContent = "—";
    const badge = document.getElementById("cat-badge");
    badge.textContent = "";
    badge.style.background = "";
    badge.style.color = "";

    document.getElementById("healthy-range").textContent = "—";
    document.getElementById("tip-text").textContent = "";

    // 5. Reset gauge visuals
    document.getElementById("bmi-ptr").style.left = "0%";
    
    document.getElementById("bf-pct").textContent = "—";
    const bfBadge = document.getElementById("bf-badge");
    bfBadge.textContent = "";
    bfBadge.style.background = "";
    bfBadge.style.color = "";
    document.getElementById("bf-desc").textContent = "";
    document.getElementById("bf-arc").style.strokeDashoffset = "326.73";

    // 6. Remove table row highlights
    const rows = document.querySelectorAll(".bmi-table tbody tr");
    rows.forEach(row => {
        row.classList.remove("highlight-blue", "highlight-green", "highlight-amber", "highlight-red");
    });
});

// ─── Delete All History Handler ───
document.getElementById("btn-clear-history").addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all calculation history?")) {
        localStorage.removeItem("bmi-history");
        loadHistory();
    }
});

// ─── Initial History Load ───
loadHistory();
