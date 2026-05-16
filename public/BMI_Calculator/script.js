// For toggle theme
const themeBtn = document.getElementById("theme-toggle");
themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    themeBtn.textContent = document.body.classList.contains("dark") ? "○" : "◐";
});

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

// WHO approved BMI categories
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

// Map BMI value to a percentage position on the range bar (10–45 scale)
function bmiToPercent(bmi) {
    const MIN = 10,
        MAX = 45;
    const clamped = Math.min(Math.max(bmi, MIN), MAX);
    return ((clamped - MIN) / (MAX - MIN)) * 100;
}

// setup Chart.js
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

// Unit label updates will be shown here
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
    badge.textContent = cat.label;
    badge.style.background = cat.bg;
    badge.style.color = cat.color;

    // Healthy weight range
    const [wLow, wHigh] = calcHealthyWeight(heightCm);
    const dispUnit = wUnit === "lb" ? "lb" : "kg";
    const mult = wUnit === "lb" ? 2.20462 : 1;
    document.getElementById("healthy-range").textContent =
        `${(wLow * mult).toFixed(1)}–${(wHigh * mult).toFixed(1)} ${dispUnit}`;

    document.getElementById("tip-text").textContent = cat.tip;

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
});
