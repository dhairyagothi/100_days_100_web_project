// ================================
// THEME TOGGLE
// ================================

(function initTheme() {
    const themeBtn = document.getElementById("theme-toggle");

    if (!themeBtn) return;

    const STORAGE_KEY = "bmi-theme";

    function getPreferredTheme() {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved) return saved;

        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    }

    function applyTheme(theme) {
        document.body.classList.toggle("dark", theme === "dark");
    }

    applyTheme(getPreferredTheme());

    themeBtn.addEventListener("click", () => {
        const isDark = document.body.classList.toggle("dark");

        localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
    });
})();

// ================================
// ELEMENTS
// ================================

const heightUnitEl = document.getElementById("height-unit");
const weightUnitEl = document.getElementById("weight-unit");

const heightLbl = document.getElementById("height-lbl");
const weightLbl = document.getElementById("weight-lbl");

const heightInp = document.getElementById("height");
const weightInp = document.getElementById("weight");

const ageInp = document.getElementById("age");
const genderInp = document.getElementById("gender");

const btn = document.getElementById("btn");

const errEl = document.getElementById("error-msg");

const resultsEl = document.getElementById("results");
const rangeVisEl = document.getElementById("range-vis");

const bmiValueEl = document.getElementById("bmi-val");
const badgeEl = document.getElementById("cat-badge");
const healthyRangeEl = document.getElementById("healthy-range");
const tipTextEl = document.getElementById("tip-text");

const caloriesEl = document.getElementById("calories");
const waterEl = document.getElementById("water");
const dietEl = document.getElementById("dietPlan");
const workoutEl = document.getElementById("workoutPlan");

const bfSection = document.getElementById("bf-section");

// ================================
// BMI CATEGORIES
// ================================

const CATEGORIES = [
    {
        max: 18.5,
        label: "Underweight",
        color: "#3b82f6",
        bg: "#dbeafe",
        calories: "2500 - 2800 kcal/day",
        tip: "Focus on healthy weight gain with nutrient-rich meals.",
        diet: [
            "Milk, nuts and peanut butter",
            "High protein foods",
            "Banana smoothies",
            "Rice and potatoes",
            "Eggs and chicken"
        ],
        workout: [
            "Strength training",
            "Push-ups and squats",
            "Light cardio",
            "Resistance exercises",
            "Weight lifting"
        ]
    },

    {
        max: 25,
        label: "Normal Weight",
        color: "#16a34a",
        bg: "#dcfce7",
        calories: "2000 - 2400 kcal/day",
        tip: "Excellent! Maintain your healthy lifestyle.",
        diet: [
            "Balanced diet",
            "Vegetables and fruits",
            "Lean protein",
            "Whole grains",
            "Healthy fats"
        ],
        workout: [
            "30 mins cardio",
            "Yoga and stretching",
            "Cycling",
            "Jogging",
            "Daily walking"
        ]
    },

    {
        max: 30,
        label: "Overweight",
        color: "#f59e0b",
        bg: "#fef3c7",
        calories: "1700 - 2000 kcal/day",
        tip: "Focus on calorie deficit and regular exercise.",
        diet: [
            "Low calorie meals",
            "High fiber foods",
            "More salads",
            "Avoid sugary drinks",
            "Reduce junk food"
        ],
        workout: [
            "Running",
            "Cycling",
            "HIIT workouts",
            "Jump rope",
            "45 mins cardio"
        ]
    },

    {
        max: Infinity,
        label: "Obese",
        color: "#ef4444",
        bg: "#fee2e2",
        calories: "1500 - 1800 kcal/day",
        tip: "Adopt healthy habits and focus on gradual fat loss.",
        diet: [
            "Protein rich meals",
            "Strict calorie control",
            "Avoid processed foods",
            "Drink more water",
            "Smaller portions"
        ],
        workout: [
            "Daily walking",
            "Swimming",
            "Cycling",
            "Low impact cardio",
            "Light strength exercises"
        ]
    }
];

// ================================
// HELPERS
// ================================

function showError(message) {
    errEl.textContent = message;
    errEl.classList.remove("hidden");
}

function clearError() {
    errEl.textContent = "";
    errEl.classList.add("hidden");
}

function getCategory(bmi) {
    return CATEGORIES.find(cat => bmi < cat.max);
}

function calcHealthyWeight(heightCm) {

    const h = heightCm / 100;

    const min = 18.5 * h * h;
    const max = 24.9 * h * h;

    return [
        min.toFixed(1),
        max.toFixed(1)
    ];
}

function bmiToPercent(bmi) {

    const MIN = 10;
    const MAX = 45;

    const clamped = Math.min(Math.max(bmi, MIN), MAX);

    return ((clamped - MIN) / (MAX - MIN)) * 100;
}

function updateList(element, items) {

    element.innerHTML = "";

    items.forEach(item => {

        const li = document.createElement("li");

        li.textContent = item;

        element.appendChild(li);
    });
}

// ================================
// CHART
// ================================

const ctx = document.getElementById("bmiChart").getContext("2d");

const bmiChart = new Chart(ctx, {
    type: "line",

    data: {
        labels: [],

        datasets: [{
            label: "BMI Progress",

            data: [],

            borderColor: "#7c3aed",

            backgroundColor: "rgba(124,58,237,0.1)",

            tension: 0.4,

            borderWidth: 3,

            fill: true,

            pointRadius: 5
        }]
    },

    options: {
        responsive: true,

        maintainAspectRatio: false,

        plugins: {
            legend: {
                labels: {
                    color: "#fff"
                }
            }
        },

        scales: {
            x: {
                ticks: {
                    color: "#fff"
                }
            },

            y: {
                beginAtZero: false,

                ticks: {
                    color: "#fff"
                }
            }
        }
    }
});

// ================================
// UNIT SWITCH
// ================================

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

    if (weightUnitEl.value === "lb") {

        weightLbl.textContent = "Weight (lb)";

        weightInp.placeholder = "e.g. 154";

    } else {

        weightLbl.textContent = "Weight (kg)";

        weightInp.placeholder = "e.g. 70";
    }
});

// ================================
// MAIN BMI CALCULATOR
// ================================

btn.addEventListener("click", () => {

    clearError();

    const hRaw = heightInp.value.trim();

    let weight = parseFloat(weightInp.value);

    const heightUnit = heightUnitEl.value;
    const weightUnit = weightUnitEl.value;

    if (!hRaw || isNaN(weight) || weight <= 0) {

        showError("Please enter valid height and weight.");

        return;
    }

    let heightCm;

    // FEET → CM
    if (heightUnit === "feet") {

        const parts = hRaw.split("/");

        if (parts.length !== 2) {

            showError("Use format feet/inches like 5/8");

            return;
        }

        const feet = parseFloat(parts[0]);
        const inches = parseFloat(parts[1]);

        if (isNaN(feet) || isNaN(inches)) {

            showError("Invalid feet/inches value.");

            return;
        }

        heightCm = (feet * 30.48) + (inches * 2.54);

    } else {

        heightCm = parseFloat(hRaw);
    }

    // LB → KG
    if (weightUnit === "lb") {

        weight = weight * 0.453592;
    }

    // BMI
    const bmi = weight / ((heightCm / 100) ** 2);

    const bmiRounded = bmi.toFixed(1);

    const category = getCategory(bmi);

    // DISPLAY BMI
    bmiValueEl.textContent = bmiRounded;

    badgeEl.textContent = category.label;

    badgeEl.style.background = category.bg;

    badgeEl.style.color = category.color;

    tipTextEl.textContent = category.tip;

    // HEALTHY RANGE
    const [minWeight, maxWeight] = calcHealthyWeight(heightCm);

    healthyRangeEl.textContent = `${minWeight} kg - ${maxWeight} kg`;

    // WATER
    waterEl.textContent = `${(weight * 0.033).toFixed(1)} Litres/day`;

    // CALORIES
    caloriesEl.textContent = category.calories;

    // DIET
    updateList(dietEl, category.diet);

    // WORKOUT
    updateList(workoutEl, category.workout);

    // SHOW RESULTS
    resultsEl.classList.remove("hidden");

    rangeVisEl.classList.remove("hidden");

    // POINTER
    const pointer = document.getElementById("bmi-ptr");

    pointer.style.left = bmiToPercent(bmi) + "%";

    // CHART UPDATE
    const time = new Date().toLocaleTimeString();

    bmiChart.data.labels.push(time);

    bmiChart.data.datasets[0].data.push(bmiRounded);

    bmiChart.update();

    // ================================
    // BODY FAT ESTIMATION
    // ================================

    const age = parseFloat(ageInp.value);

    const gender = genderInp.value;

    if (!isNaN(age)) {

        const sexFactor = gender === "male" ? 1 : 0;

        let bodyFat =
            (1.2 * bmi) +
            (0.23 * age) -
            (10.8 * sexFactor) -
            5.4;

        bodyFat = Math.max(2, Math.min(bodyFat, 65));

        const bodyFatRounded = bodyFat.toFixed(1);

        document.getElementById("bf-pct").textContent =
            bodyFatRounded;

        const arc = document.getElementById("bf-arc");

        const circumference = 326.73;

        const fraction = Math.min(bodyFat / 60, 1);

        arc.style.strokeDashoffset =
            circumference * (1 - fraction);

        bfSection.classList.remove("hidden");
    }
});