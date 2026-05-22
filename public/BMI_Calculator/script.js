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

    if (heightCm < 50 || heightCm > 280) {
        showError("Height seems out of range (50–280 cm).");
        return;
    }

    if (isNaN(w) || w <= 0) {
        showError("Please enter a valid weight.");
        return;
    }

    let weightDisplayStr = wUnit === "lb" ? `${w} lb` : `${w} kg`;

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

    // Highlight Reference Table Row
    highlightCategoryRow(cat.label);

    // Shows result sections
    resultsEl.classList.remove("hidden");
    resultsEl.style.display = "grid";

    rangeVisEl.classList.remove("hidden");
    rangeVisEl.style.display = "block";

    // Moves range pointer
    const pct = bmiToPercent(bmi);
    document.getElementById("bmi-ptr").style.left = pct + "%";

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

// ─── Body Fat Classification ───
function getBodyFatCategory(bf, gender) {
    const ranges =
        gender === "male"
            ? [
                  { max: 6,  label: "Essential",  color: "#2563b0", bg: "#eff4fc",
                    tip: "Essential fat is the minimum needed for basic physiological function." },
                  { max: 14, label: "Athletic",   color: "#16a34a", bg: "#edf6ef",
                    tip: "Athletic range — typical of competitive athletes with rigorous training." },
                  { max: 18, label: "Fitness",    color: "#0d9488", bg: "#f0fdfa",
                    tip: "Fitness range — a healthy body composition with good muscle definition." },
                  { max: 25, label: "Average",    color: "#d97706", bg: "#fef3e2",
                    tip: "Average range — generally healthy, but there's room for improvement via exercise." },
                  { max: Infinity, label: "Obese", color: "#dc2626", bg: "#fef2f2",
                    tip: "Elevated body fat — consider consulting a healthcare professional for guidance." },
              ]
            : [
                  { max: 14, label: "Essential",  color: "#2563b0", bg: "#eff4fc",
                    tip: "Essential fat is the minimum needed for hormonal and reproductive health." },
                  { max: 21, label: "Athletic",   color: "#16a34a", bg: "#edf6ef",
                    tip: "Athletic range — typical of competitive female athletes." },
                  { max: 25, label: "Fitness",    color: "#0d9488", bg: "#f0fdfa",
                    tip: "Fitness range — a healthy and active body composition." },
                  { max: 32, label: "Average",    color: "#d97706", bg: "#fef3e2",
                    tip: "Average range — generally healthy, but regular exercise can improve outcomes." },
                  { max: Infinity, label: "Obese", color: "#dc2626", bg: "#fef2f2",
                    tip: "Elevated body fat — consider consulting a healthcare professional for guidance." },
              ];
    return ranges.find((r) => bf < r.max);
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
