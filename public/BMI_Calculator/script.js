/* =========================================================
   BMI FITNESS DASHBOARD
========================================================= */

"use strict";

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

const BMI_DATA_KEY = "bmi_history_data";
const BMI_LABELS_KEY = "bmi_history_labels";

let bmiData = JSON.parse(localStorage.getItem(BMI_DATA_KEY)) || [];
let bmiLabels = JSON.parse(localStorage.getItem(BMI_LABELS_KEY)) || [];

/* =========================================================
   BMI CHART
========================================================= */

const ctx = document.getElementById("bmiChart");

const bmiChart = new Chart(ctx, {
  type: "line",

  data: {
    labels: bmiLabels,

    datasets: [
      {
        label: "BMI Progress",

        data: bmiData,

        borderWidth: 3,

        tension: 0.4,

        fill: true,

        backgroundColor: "rgba(255,255,255,0.12)",

        borderColor: "#ffffff",

        pointBackgroundColor: "#ffffff",

        pointRadius: 4,
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
          font: {
            size: 14,
            weight: "600",
          },
        },
      },
    },

    scales: {
      x: {
        ticks: {
          color: "#333",
        },
      },

      y: {
        beginAtZero: true,

        ticks: {
          color: "#333",
        },
      },
    },
  },
});

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

  let height = parseFloat(
    document.getElementById("height").value
  );

  let weight = parseFloat(
    document.getElementById("weight").value
  );

  const age = parseFloat(
    document.getElementById("age").value
  );

  const gender = document.getElementById("gender").value;

  const heightUnit =
    document.getElementById("heightUnit").value;

  const weightUnit =
    document.getElementById("weightUnit").value;

  /* =========================
     VALIDATION
  ========================= */

  if (
    !height ||
    !weight ||
    height <= 0 ||
    weight <= 0
  ) {
    showError("Please enter valid height and weight.");
    return;
  }

  /* =========================
     UNIT CONVERSIONS
  ========================= */

  // Feet to cm
  if (heightUnit === "ft") {
    height = height * 30.48;
  }

  // Pounds to kg
  if (weightUnit === "lb") {
    weight = weight * 0.453592;
  }

  if (height < 50 || height > 300) {
    showError("Height seems unrealistic.");
    return;
  }

  if (weight < 10 || weight > 500) {
    showError("Weight seems unrealistic.");
    return;
  }

  /* =========================
     BMI CALCULATION
  ========================= */

  const bmi = (
    weight /
    Math.pow(height / 100, 2)
  ).toFixed(1);

  bmiValue.innerText = bmi;

  updateGauge(bmi);

  resultsSection.classList.remove("hidden");

  /* =========================
     HEALTHY WEIGHT RANGE
  ========================= */

  const minWeight = (
    18.5 *
    Math.pow(height / 100, 2)
  ).toFixed(1);

  const maxWeight = (
    24.9 *
    Math.pow(height / 100, 2)
  ).toFixed(1);

  healthyWeight.innerText =
    `${minWeight} - ${maxWeight} kg`;

  /* =========================
     WATER INTAKE
  ========================= */

  water.innerText =
    `${(weight * 0.033).toFixed(1)} Litres/day`;

  /* =========================
     BODY FAT ESTIMATION
  ========================= */

  if (age && age > 0) {

    const sexFactor = gender === "male" ? 1 : 0;

    let bodyFatPercentage =
      1.20 * bmi +
      0.23 * age -
      10.8 * sexFactor -
      5.4;

    bodyFatPercentage =
      Math.max(
        2,
        Math.min(bodyFatPercentage, 65)
      );

    bodyFat.innerText =
      `${bodyFatPercentage.toFixed(1)}%`;

  } else {

    bodyFat.innerText = "N/A";

  }

  /* =========================
     RESET LISTS
  ========================= */

  dietPlan.innerHTML = "";
  workoutPlan.innerHTML = "";

  clearActiveRows();

  /* =========================
     CATEGORY LOGIC
  ========================= */

  if (bmi < 18.5) {

    category.innerText = "Underweight";

    categoryBadge.innerText = "⚠️ Underweight";

    message.innerText =
      "You should focus on gaining healthy weight with nutrient-rich foods.";

    calories.innerText =
      "2500 - 2800 kcal/day";

    addDiet([
      "Milk & Dairy",
      "Eggs",
      "Bananas",
      "Nuts",
      "Peanut Butter",
    ]);

    addWorkout([
      "Strength Training",
      "Pushups",
      "Squats",
      "Resistance Training",
    ]);

    activateRow("underweight-row");

    setCategoryColor("#f39c12");

  }

  else if (bmi < 25) {

    category.innerText = "Normal";

    categoryBadge.innerText = "✅ Healthy";

    message.innerText =
      "Great! Maintain your healthy lifestyle and stay active.";

    calories.innerText =
      "2000 - 2400 kcal/day";

    addDiet([
      "Balanced Diet",
      "Vegetables",
      "Fruits",
      "Protein",
      "Whole Grains",
    ]);

    addWorkout([
      "Jogging",
      "Cycling",
      "Walking",
      "Yoga",
    ]);

    activateRow("normal-row");

    setCategoryColor("#2ecc71");

  }

  else if (bmi < 30) {

    category.innerText = "Overweight";

    categoryBadge.innerText = "📈 Overweight";

    message.innerText =
      "Focus on fat loss through exercise and a healthy diet.";

    calories.innerText =
      "1700 - 2000 kcal/day";

    addDiet([
      "Salads",
      "High Protein Foods",
      "Low Sugar",
      "More Fiber",
    ]);

    addWorkout([
      "Running",
      "HIIT",
      "Cardio",
      "Cycling",
    ]);

    activateRow("overweight-row");

    setCategoryColor("#ff9800");

  }

  else {

    category.innerText = "Obese";

    categoryBadge.innerText = "🚨 Obese";

    message.innerText =
      "Adopt healthier habits and consult a fitness expert if needed.";

    calories.innerText =
      "1500 - 1800 kcal/day";

    addDiet([
      "Protein Rich Foods",
      "Vegetables",
      "Low Carb Meals",
      "More Water",
    ]);

    addWorkout([
      "Walking",
      "Swimming",
      "Cycling",
      "Light Cardio",
    ]);

    activateRow("obese-row");

    setCategoryColor("#ff4d4d");

  }

  /* =========================
     UPDATE CHART
  ========================= */

  updateChart(bmi);

}

/* =========================================================
   UPDATE GAUGE
========================================================= */

function updateGauge(bmi) {

  const degree =
    Math.min((bmi / 40) * 360, 360);

  gauge.style.background =
    `conic-gradient(
      var(--primary) 0deg,
      var(--primary) ${degree}deg,
      rgba(255,255,255,0.12) ${degree}deg
    )`;

}

/* =========================================================
   ADD DIET ITEMS
========================================================= */

function addDiet(items) {

  items.forEach((item) => {

    const li = document.createElement("li");

    li.innerText = item;

    dietPlan.appendChild(li);

  });

}

/* =========================================================
   ADD WORKOUT ITEMS
========================================================= */

function addWorkout(items) {

  items.forEach((item) => {

    const li = document.createElement("li");

    li.innerText = item;

    workoutPlan.appendChild(li);

  });

}

/* =========================================================
   UPDATE BMI CHART
========================================================= */

function updateChart(bmi) {

  const time =
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  bmiLabels.push(time);

  bmiData.push(bmi);

  if (bmiLabels.length > 10) {
    bmiLabels.shift();
    bmiData.shift();
  }

  bmiChart.update();

  localStorage.setItem(
    BMI_LABELS_KEY,
    JSON.stringify(bmiLabels)
  );

  localStorage.setItem(
    BMI_DATA_KEY,
    JSON.stringify(bmiData)
  );

}

/* =========================================================
   CATEGORY COLORS
========================================================= */

function setCategoryColor(color) {

  categoryBadge.style.background =
    `${color}20`;

  categoryBadge.style.color = color;

}

/* =========================================================
   ACTIVE TABLE ROW
========================================================= */

function activateRow(id) {

  const row = document.getElementById(id);

  if (row) {
    row.classList.add("active-row");
  }

}

function clearActiveRows() {

  document
    .querySelectorAll(".bmi-table tbody tr")
    .forEach((row) => {
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

  message.innerText =
    "Your health insights will appear here.";

  calories.innerText = "0 kcal/day";

  water.innerText = "0 Litres/day";

  healthyWeight.innerText = "0 - 0 kg";

  bodyFat.innerText = "0%";

  dietPlan.innerHTML = "";

  workoutPlan.innerHTML = "";

  gauge.style.background =
    `conic-gradient(
      var(--primary) 0deg,
      rgba(255,255,255,0.1) 0deg
    )`;

  resultsSection.classList.add("hidden");

  clearActiveRows();

  hideError();

}

/* =========================================================
   ERROR HANDLING
========================================================= */

function showError(message) {

  errorBox.innerText = message;

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

}

/* =========================================================
   LOAD SAVED THEME
========================================================= */

window.addEventListener("DOMContentLoaded", () => {

  const savedTheme =
    localStorage.getItem("selectedTheme");

  if (savedTheme) {

    document.body.className = savedTheme;

  }

});

/* =========================================================
   ENTER KEY SUPPORT
========================================================= */

document.addEventListener("keydown", (e) => {

  if (e.key === "Enter") {

    calculateBMI();

  }

});