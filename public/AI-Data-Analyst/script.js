// =========================
// THEME MANAGEMENT SYSTEM
// =========================

const THEME_KEY = "ai-data-analyst-theme";

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getStoredTheme() {
  return localStorage.getItem(THEME_KEY);
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
  updateChartTheme(theme);
}

function initTheme() {
  const stored = getStoredTheme();
  const theme = stored ? stored : getSystemTheme();
  document.documentElement.setAttribute("data-theme", theme);
  // Don't call updateChartTheme here; charts don't exist yet.
}

// Apply theme immediately (before DOM is fully ready to avoid flash)
initTheme();

// Listen for OS-level theme changes (only if no stored preference)
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    if (!getStoredTheme()) {
      setTheme(e.matches ? "dark" : "light");
    }
  });

// =========================
// CHART THEME HELPERS
// =========================

function getChartThemeColors() {
  const isDark =
    document.documentElement.getAttribute("data-theme") === "dark";
  return {
    grid: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)",
    tick: isDark ? "#64748b" : "#94a3b8",
    tickY: isDark ? "#94a3b8" : "#64748b",
    heatmapBorder: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
  };
}

function updateChartTheme(theme) {
  const colors = getChartThemeColors();

  // Update Chart.js global defaults
  Chart.defaults.color = theme === "dark" ? "#94a3b8" : "#64748b";
  Chart.defaults.borderColor =
    theme === "dark" ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)";

  // Update each existing chart if it exists
  if (distributionChart) {
    distributionChart.options.scales.x.grid.color = colors.grid;
    distributionChart.options.scales.x.ticks.color = colors.tick;
    distributionChart.options.scales.x.title.color = colors.tick;
    distributionChart.options.scales.y.grid.color = colors.grid;
    distributionChart.options.scales.y.ticks.color = colors.tick;
    distributionChart.update();
  }

  if (categoryChart) {
    categoryChart.options.scales.x.grid.color = colors.grid;
    categoryChart.options.scales.x.ticks.color = colors.tick;
    categoryChart.options.scales.y.ticks.color = colors.tickY;
    categoryChart.update();
  }

  if (heatmapChart) {
    heatmapChart.options.scales.x.ticks.color = colors.tickY;
    heatmapChart.options.scales.y.ticks.color = colors.tickY;
    heatmapChart.data.datasets[0].borderColor = colors.heatmapBorder;
    heatmapChart.update();
  }
}

// =========================
// DOM ELEMENTS
// =========================

const fileInput = document.getElementById("csvFile");
const fileInfo = document.getElementById("fileInfo");

const rowsCount = document.getElementById("rowsCount");
const columnsCount = document.getElementById("columnsCount");
const missingCount = document.getElementById("missingCount");
const qualityScore = document.getElementById("qualityScore");

const datasetTable = document.getElementById("datasetTable");
const tableHead = datasetTable.querySelector("thead");
const tableBody = datasetTable.querySelector("tbody");

const numericColumnSelect = document.getElementById("numericColumn");

const groqApiInput = document.getElementById("groqApiKey");
const saveApiKeyBtn = document.getElementById("saveApiKeyBtn");

const askDatasetBtn = document.getElementById("askDatasetBtn");
const datasetQuestion = document.getElementById("datasetQuestion");
const datasetAnswer = document.getElementById("datasetAnswer");

// Store parsed data globally
let dataset = [];
let headers = [];
let distributionChart = null;
let categoryChart = null;
let heatmapChart = null;

// =========================
// CHART.JS GLOBAL DEFAULTS
// =========================

const initialTheme = document.documentElement.getAttribute("data-theme");
Chart.defaults.color = initialTheme === "dark" ? "#94a3b8" : "#64748b";
Chart.defaults.borderColor =
  initialTheme === "dark"
    ? "rgba(255,255,255,0.07)"
    : "rgba(0,0,0,0.06)";
Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";

// =========================
// THEME TOGGLE BUTTON
// =========================

const themeToggleBtn = document.getElementById("themeToggleBtn");

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    const current =
      document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    setTheme(next);
  });
}

// =========================
// DRAG & DROP
// =========================

const uploadZone = document.getElementById("uploadZone");

if (uploadZone) {
  uploadZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadZone.classList.add("drag-over");
  });

  uploadZone.addEventListener("dragleave", () => {
    uploadZone.classList.remove("drag-over");
  });

  uploadZone.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadZone.classList.remove("drag-over");
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith(".csv")) {
      processFile(file);
    }
  });
}

// =========================
// FILE UPLOAD
// =========================

fileInput.addEventListener("change", handleFileUpload);

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  processFile(file);
}

function processFile(file) {
  fileInfo.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      dataset = results.data;
      if (dataset.length === 0) {
        alert("Dataset is empty.");
        return;
      }
      headers = Object.keys(dataset[0]);
      onDatasetReady();
    },
    error: function (error) {
      console.error(error);
      alert("Error parsing CSV file.");
    },
  });
}

// =========================
// SAMPLE DATASET
// =========================

const sampleDataBtn = document.getElementById("sampleDataBtn");

if (sampleDataBtn) {
  sampleDataBtn.addEventListener("click", loadSampleDataset);
}

function loadSampleDataset() {
  const sampleCSV = `Revenue,Marketing Spend,Customer Age,Retention Rate,Discounts,Gender,Product Category,Purchase Date
52430,12000,34,0.85,500,Male,Technology,2024-01-15
48120,9500,27,0.78,300,Female,Marketing,2024-01-16
125000,35000,45,0.92,1200,Male,Operations,2024-01-17
2100,1800,22,0.55,50,Female,Technology,2024-01-18
76400,18000,38,0.88,700,Male,Sales,2024-01-19
34500,8000,29,0.72,200,Female,Marketing,2024-01-20
95000,28000,51,0.94,1100,Male,Technology,2024-01-21
41200,10500,33,0.81,400,Female,Operations,2024-01-22
63800,15000,41,0.87,650,Male,Sales,2024-01-23
28900,7200,25,0.68,150,Female,Technology,2024-01-24
112000,31000,48,0.91,1050,Male,Marketing,2024-01-25
39700,9800,31,0.75,350,Female,Operations,2024-01-26
58600,14200,37,0.83,580,Male,Sales,2024-01-27
22400,5500,24,0.61,100,Female,Technology,2024-01-28
87300,22000,44,0.89,820,Male,Marketing,2024-01-29
45100,11000,30,0.77,420,Female,Operations,2024-01-30
71200,17500,40,0.86,690,Male,Technology,2024-01-31
33600,8300,28,0.71,180,Female,Sales,2024-02-01
99500,29000,50,0.93,980,Male,Marketing,2024-02-02
55400,13500,36,0.82,530,Female,Operations,2024-02-03`;

  Papa.parse(sampleCSV, {
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      dataset = results.data;
      headers = Object.keys(dataset[0]);
      fileInfo.textContent = `sample_dataset.csv (${dataset.length} rows loaded)`;
      onDatasetReady();
    },
  });
}

// =========================
// DATASET READY
// =========================

function onDatasetReady() {
  updateDatasetSummary();
  populateTable();
  populateNumericColumns();
  updateExecutiveSummary();

  generateMLRecommendationWithGroq();

  generateGroqSummary();
}

// =========================
// DATASET SUMMARY
// =========================

function updateDatasetSummary() {
  const rows = dataset.length;
  const cols = headers.length;

  let missing = 0;
  let totalCells = rows * cols;

  dataset.forEach((row) => {
    headers.forEach((header) => {
      const value = row[header];
      if (value === null || value === undefined || value === "") {
        missing++;
      }
    });
  });

  const quality =
    totalCells === 0
      ? 0
      : (((totalCells - missing) / totalCells) * 100).toFixed(1);

  rowsCount.textContent = rows.toLocaleString();
  columnsCount.textContent = cols;
  missingCount.textContent = missing;
  qualityScore.textContent = `${quality}%`;
}

// =========================
// TABLE PREVIEW
// =========================

function populateTable() {
  tableHead.innerHTML = "";
  tableBody.innerHTML = "";

  const previewHeaders = headers.slice(0, 5);

  const headerRow = document.createElement("tr");
  previewHeaders.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
    headerRow.appendChild(th);
  });

  if (headers.length > 5) {
    const th = document.createElement("th");
    th.textContent = `+${headers.length - 5} more`;
    headerRow.appendChild(th);
  }

  tableHead.appendChild(headerRow);

  const previewRows = dataset.slice(0, 5);
  previewRows.forEach((row) => {
    const tr = document.createElement("tr");
    previewHeaders.forEach((header) => {
      const td = document.createElement("td");
      td.textContent = row[header] === undefined ? "" : row[header];
      tr.appendChild(td);
    });
    if (headers.length > 5) {
      const td = document.createElement("td");
      td.textContent = "...";
      tr.appendChild(td);
    }
    tableBody.appendChild(tr);
  });
}

// =========================
// NUMERIC COLUMNS
// =========================

function populateNumericColumns() {
  numericColumnSelect.innerHTML = "";

  const numericColumns = headers.filter((header) => {
    const values = dataset
      .map((row) => Number(row[header]))
      .filter((v) => !isNaN(v));

    if (values.length === 0) return false;

    const headerName = header.toLowerCase();
    if (headerName.includes("id") || headerName.includes("code")) return false;

    return true;
  });

  if (numericColumns.length === 0) {
    const option = document.createElement("option");
    option.textContent = "No Numeric Columns";
    numericColumnSelect.appendChild(option);
    return;
  }

  numericColumns.forEach((column) => {
    const option = document.createElement("option");
    option.value = column;
    option.textContent = column;
    numericColumnSelect.appendChild(option);
  });

  calculateStatistics(numericColumns[0]);
}

// =========================
// EXECUTIVE SUMMARY
// =========================

function updateExecutiveSummary() {
  const summary = document.getElementById("executiveSummary");
  summary.textContent = `Dataset contains ${dataset.length.toLocaleString()} rows and ${headers.length} columns. The dataset has been successfully parsed and analyzed. Use the Statistical Analysis section to explore numeric features and generate insights.`;
}

// =========================
// STATISTICS
// =========================

numericColumnSelect.addEventListener("change", (e) => {
  calculateStatistics(e.target.value);
  // Update section column tag
  const tag = document.getElementById("statColTag");
  if (tag) tag.textContent = e.target.value;
});

function calculateStatistics(columnName) {
  const values = dataset
    .map((row) => Number(row[columnName]))
    .filter((value) => !isNaN(value));

  if (values.length === 0) return;

  // Update section column tag
  const tag = document.getElementById("statColTag");
  if (tag) tag.textContent = columnName;

  values.sort((a, b) => a - b);

  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const median = getMedian(values);
  const mode = getMode(values);
  const min = values[0];
  const max = values[values.length - 1];
  const q1 = values[Math.floor(values.length * 0.25)];
  const q3 = values[Math.floor(values.length * 0.75)];

  const variance =
    values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
    values.length;

  const stdDev = Math.sqrt(variance);

  document.getElementById("meanValue").textContent = mean.toFixed(2);
  document.getElementById("medianValue").textContent = median.toFixed(2);
  document.getElementById("modeValue").textContent = mode;
  document.getElementById("stdValue").textContent = stdDev.toFixed(2);
  document.getElementById("minValue").textContent = min;
  document.getElementById("maxValue").textContent = max;
  document.getElementById("q1Value").textContent = q1;
  document.getElementById("q3Value").textContent = q3;

  // Update AI note
  const aiNote = document.getElementById("aiNoteText");
  if (aiNote) {
    const skew = mean > median ? "right-skewed" : "left-skewed";
    aiNote.querySelector("span").textContent =
      `AI Note: The mean is ${mean > median ? "higher" : "lower"} than the median, suggesting a ${skew} distribution in "${columnName}".`;
  }

  createDistributionChart(columnName);
  createCategoryChart();
  createHeatmapChart();

  // Fallback local insights
  generateAIInsights(columnName, mean, median, stdDev);

  // AI Insights from Groq
  generateAIInsightsWithGroq({
    rows: dataset.length,
    columns: headers.length,
    missingValues: missingCount.textContent,
    qualityScore: qualityScore.textContent,
    column: columnName,
    mean,
    median,
    stdDev,
    min,
    max,
  });
}

// =========================
// HELPERS
// =========================

function getMedian(values) {
  const middle = Math.floor(values.length / 2);
  if (values.length % 2 === 0) {
    return (values[middle - 1] + values[middle]) / 2;
  }
  return values[middle];
}

function getMode(values) {
  const frequency = {};
  let maxFreq = 0;
  let mode = values[0];
  values.forEach((value) => {
    frequency[value] = (frequency[value] || 0) + 1;
    if (frequency[value] > maxFreq) {
      maxFreq = frequency[value];
      mode = value;
    }
  });
  return mode;
}

function calculateCorrelation(x, y) {
  const n = x.length;

  const meanX = x.reduce((a, b) => a + b, 0) / n;

  const meanY = y.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denomX = 0;
  let denomY = 0;

  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;

    numerator += dx * dy;
    denomX += dx * dx;
    denomY += dy * dy;
  }

  return numerator / Math.sqrt(denomX * denomY);
}

// =========================
// CHARTS
// =========================

const CHART_COLORS = {
  bar: {
    background: "rgba(99,102,241,0.55)",
    border: "rgba(99,102,241,0.9)",
  },
  barHover: "rgba(139,92,246,0.75)",
};

function createDistributionChart(columnName) {
  const values = dataset
    .map((row) => Number(row[columnName]))
    .filter((v) => !isNaN(v));

  if (distributionChart) distributionChart.destroy();

  const bins = 10;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const binSize = (max - min) / bins;
  const counts = Array(bins).fill(0);

  values.forEach((value) => {
    let index = Math.floor((value - min) / binSize);
    if (index >= bins) index = bins - 1;
    counts[index]++;
  });

  const labels = counts.map((_, i) => `${(min + i * binSize).toFixed(0)}`);
  const colors = getChartThemeColors();

  distributionChart = new Chart(document.getElementById("distributionChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: columnName,
          data: counts,
          backgroundColor: "rgba(99,102,241,0.5)",
          borderColor: "rgba(99,102,241,0.9)",
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: `${columnName}`,
            color: colors.tick,
          },
          grid: { color: colors.grid },
          ticks: { color: colors.tick, font: { size: 10 } },
        },
        y: {
          grid: { color: colors.grid },
          ticks: { color: colors.tick, font: { size: 10 } },
        },
      },
    },
  });
}

function createCategoryChart() {
  const firstCategorical = headers.find((header) => {
    return dataset.some((row) => isNaN(Number(row[header])));
  });

  if (!firstCategorical) return;

  const counts = {};
  dataset.forEach((row) => {
    const value = row[firstCategorical];
    counts[value] = (counts[value] || 0) + 1;
  });

  const labels = Object.keys(counts).slice(0, 8);
  const values = Object.values(counts).slice(0, 8);

  if (categoryChart) categoryChart.destroy();

  const colors = getChartThemeColors();

  categoryChart = new Chart(document.getElementById("categoryChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: firstCategorical,
          data: values,
          backgroundColor: "rgba(139,92,246,0.5)",
          borderColor: "rgba(139,92,246,0.9)",
          borderWidth: 1,
          borderRadius: 4,
          indexAxis: "y",
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          grid: { color: colors.grid },
          ticks: { color: colors.tick, font: { size: 10 } },
        },
        y: {
          grid: { display: false },
          ticks: { color: colors.tickY, font: { size: 10 } },
        },
      },
    },
  });
}

function createHeatmapChart() {
  const numericColumns = getNumericColumns().slice(0, 6);

  if (numericColumns.length < 2) {
    const container = document.getElementById("heatmapChart")?.parentElement;

    if (container) {
      container.innerHTML = `
                <div class="empty-chart">
                    Need at least 2 numeric columns
                </div>
            `;
    }

    return;
  }

  const matrixData = [];

  numericColumns.forEach((colA, rowIndex) => {
    numericColumns.forEach((colB, colIndex) => {
      const x = [];
      const y = [];

      dataset.forEach((record) => {
        const a = Number(record[colA]);

        const b = Number(record[colB]);

        if (!isNaN(a) && !isNaN(b)) {
          x.push(a);
          y.push(b);
        }
      });

      const correlation = calculateCorrelation(x, y);

      matrixData.push({
        x: colIndex,

        y: rowIndex,

        v: correlation,
      });
    });
  });

  if (heatmapChart) {
    heatmapChart.destroy();
  }

  const ctx = document.getElementById("heatmapChart");
  const colors = getChartThemeColors();

  heatmapChart = new Chart(ctx, {
    type: "matrix",

    data: {
      datasets: [
        {
          data: matrixData,

          borderWidth: 1,

          borderColor: colors.heatmapBorder,

          width: () => 45,
          height: () => 45,

          backgroundColor(context) {
            const value = context.dataset.data[context.dataIndex].v;

            const alpha = Math.abs(value);

            if (value >= 0) {
              return `rgba(139, 92, 246, ${alpha})`;
            }

            return `rgba(59, 130, 246, ${alpha})`;
          },
        },
      ],
    },

    options: {
      maintainAspectRatio: false,

      plugins: {
        legend: {
          display: false,
        },

        tooltip: {
          callbacks: {
            title(items) {
              const item = items[0];

              return `${numericColumns[item.raw.y]}\n↔\n${numericColumns[item.raw.x]}`;
            },

            label(context) {
              return `\nCorrelation:\n${context.raw.v.toFixed(2)}\n`;
            },
          },
        },
      },

      scales: {
        x: {
          offset: true,

          grid: {
            display: false,
          },

          ticks: {
            color: colors.tickY,

            maxRotation: 30,

            minRotation: 30,

            callback(value) {
              const label = numericColumns[Math.round(value)];

              if (!label) return "";

              return label.length > 12 ? label.substring(0, 12) + "..." : label;
            },
          },
        },

        y: {
          offset: true,

          grid: {
            display: false,
          },

          ticks: {
            color: colors.tickY,

            callback(value) {
              const label = numericColumns[Math.round(value)];

              if (!label) return "";

              return label.length > 12 ? label.substring(0, 12) + "..." : label;
            },
          },
        },
      },
    },
  });
}

// =========================
// AI INSIGHTS
// =========================

function generateAIInsights(column, mean, median, stdDev) {
  const cards = document.querySelectorAll("#insightsContainer .insight-card");

  if (cards.length < 3) return;

  const skew = mean > median ? "right-skewed" : "left-skewed";
  const variability = stdDev > mean * 0.5 ? "high" : "moderate";

  // Card 1 — Correlation
  cards[0].querySelector("p").textContent =
    `${column} shows a ${skew} distribution. Mean (${mean.toFixed(2)}) differs from median (${median.toFixed(2)}), indicating potential outliers or asymmetry.`;
  cards[0].querySelector(".insight-badge").textContent = "94%";

  // Card 2 — Quality
  const quality = parseFloat(qualityScore.textContent);
  cards[1].querySelector("p").textContent =
    `Dataset quality score is ${quality}%. Missing values are ${
      Number(missingCount.textContent) === 0
        ? "minimal"
        : "present and may require preprocessing"
    }.`;
  cards[1].querySelector(".insight-badge").textContent =
    quality >= 90 ? "98%" : "85%";
  cards[1].querySelector(".confidence-pill").textContent =
    quality >= 90 ? "Very High Confidence" : "Medium Confidence";

  // Card 3 — ML Recommendation
  cards[2].querySelector("p").textContent =
    `${column} appears suitable for predictive modeling. Tree-based models such as Random Forest and XGBoost are recommended.`;
  cards[2].querySelector(".insight-badge").textContent = "92%";

  // Card 4 — Trend (if present)
  if (cards.length >= 4) {
    cards[3].querySelector("p").textContent =
      `${column} exhibits ${variability} variability (Std Dev: ${stdDev.toFixed(2)}). Consider feature engineering to improve model performance.`;
    cards[3].querySelector(".insight-badge").textContent = "89%";
  }
}

function updateAIInsights(insights) {
  document.getElementById("correlationInsightText").textContent =
    insights.correlation.text;

  document.getElementById("qualityInsightText").textContent =
    insights.quality.text;

  document.getElementById("recommendationInsightText").textContent =
    insights.recommendation.text;

  document.getElementById("trendInsightText").textContent = insights.trend.text;

  // Scores

  document.getElementById("correlationBadge").textContent =
    `${insights.correlation.score}%`;

  document.getElementById("qualityBadge").textContent =
    `${insights.quality.score}%`;

  document.getElementById("recommendationBadge").textContent =
    `${insights.recommendation.score}%`;

  document.getElementById("trendBadge").textContent =
    `${insights.trend.score}%`;

  // Confidence Labels

  document.getElementById("correlationConfidence").textContent =
    insights.correlation.confidence;

  document.getElementById("qualityConfidence").textContent =
    insights.quality.confidence;

  document.getElementById("recommendationConfidence").textContent =
    insights.recommendation.confidence;

  document.getElementById("trendConfidence").textContent =
    insights.trend.confidence;
}

function updateMLRecommendation(data) {
  document.getElementById("mlTask").textContent = data.task;

  document.getElementById("targetColumn").textContent = data.target;

  const modelTags = document.getElementById("modelTags");

  if (!modelTags) return;

  modelTags.innerHTML = data.models
    .map((model) => {
      let cls = "tag-blue";
      let icon = "minus";

      if (model.toLowerCase().includes("xgboost")) {
        cls = "tag-green";
        icon = "zap";
      }

      if (model.toLowerCase().includes("forest")) {
        cls = "tag-purple";
        icon = "git-branch";
      }

      return `
        <div class="model-tag ${cls}">
          <i data-lucide="${icon}"></i>
          ${model}
        </div>
      `;
    })
    .join("");

  lucide.createIcons();
}

function getNumericColumns() {
  return headers.filter((header) => {
    const lower = header.toLowerCase();

    if (lower.includes("id") || lower.includes("code")) {
      return false;
    }

    const values = dataset
      .map((row) => Number(row[header]))
      .filter((v) => !isNaN(v));

    return values.length > 0;
  });
}

async function generateMLRecommendationWithGroq() {
  const apiKey = groqApiInput.value.trim();

  if (!apiKey) return;

  try {
    const prompt = `
You are an expert Machine Learning consultant.

Dataset Information:

Columns:
${headers.join(", ")}

Rows:
${dataset.length}

Missing Values:
${missingCount.textContent}

Numeric Columns:
${getNumericColumns().join(", ")}

Determine:

1. Best ML task
2. Best target column
3. Top 3 recommended models

Return ONLY valid JSON.

{
  "task":"Regression",
  "target":"Revenue",
  "models":[
    "XGBoost",
    "Random Forest",
    "Linear Regression"
  ]
}
`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",

          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],

          temperature: 0.2,
        }),
      },
    );

    const result = await response.json();

    const content = result.choices[0].message.content;

    const cleaned = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const recommendation = JSON.parse(cleaned);

    updateMLRecommendation(recommendation);
  } catch (error) {
    console.error("ML Recommendation Error:", error);
  }
}

async function generateAIInsightsWithGroq(datasetInfo) {
  document.getElementById("correlationInsightText").textContent =
    "Generating AI insight...";

  document.getElementById("qualityInsightText").textContent =
    "Generating AI insight...";

  document.getElementById("recommendationInsightText").textContent =
    "Generating AI insight...";

  document.getElementById("trendInsightText").textContent =
    "Generating AI insight...";

  const apiKey = groqApiInput.value.trim();

  if (!apiKey) return;

  try {
    const prompt = `
You are an expert data analyst.

Dataset Summary:

Rows: ${datasetInfo.rows}
Columns: ${datasetInfo.columns}
Missing Values: ${datasetInfo.missingValues}
Quality Score: ${datasetInfo.qualityScore}

Selected Column:
${datasetInfo.column}

Mean:
${datasetInfo.mean}

Median:
${datasetInfo.median}

Standard Deviation:
${datasetInfo.stdDev}

Minimum:
${datasetInfo.min}

Maximum:
${datasetInfo.max}

Generate FOUR professional business insights.

Rules:

1. Correlation Insight:
   Explain relationships, skewness, outliers, or feature interactions.

2. Data Quality Insight:
   Discuss missing values, completeness, and reliability.

3. ML Recommendation:
   Recommend a modeling approach suitable for this dataset.

4. Trend Insight:
   Identify trends, variability, patterns, or business implications.

Keep each insight under 120 words.

Return ONLY valid JSON.

{
  "correlation":{
    "text":"",
    "score":94,
    "confidence":"High Confidence"
  },

  "quality":{
    "text":"",
    "score":98,
    "confidence":"Very High Confidence"
  },

  "recommendation":{
    "text":"",
    "score":92,
    "confidence":"High Confidence"
  },

  "trend":{
    "text":"",
    "score":89,
    "confidence":"High Confidence"
  }
}
`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",

          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],

          temperature: 0.4,
        }),
      },
    );

    const data = await response.json();

    const content = data.choices[0].message.content;

    const cleanedContent = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const insights = JSON.parse(cleanedContent);

    updateAIInsights(insights);
  } catch (error) {
    console.error("AI Insights Error:", error);
  }
}

// =========================
// API KEY MANAGEMENT
// =========================

saveApiKeyBtn?.addEventListener("click", () => {
  if (!groqApiInput.value.trim()) {
    alert("Please enter a Groq API key.");
    return;
  }

  saveApiKeyBtn.textContent = "✓ API Key Ready";

  setTimeout(() => {
    saveApiKeyBtn.innerHTML = '<i data-lucide="save"></i> API Key Loaded';
    lucide.createIcons();
  }, 1800);
});

async function generateGroqSummary() {
  const apiKey = groqApiInput.value.trim();

  if (!apiKey) {
    document.getElementById("executiveSummary").innerHTML = `
      <h3>⚠️ Groq API Key Required</h3>
      <p>Add your Groq API key in the sidebar to enable AI-powered dataset analysis.</p>
    `;
    return;
  }

  document.getElementById("executiveSummary").innerHTML = `
    <h3>AI Analysis In Progress</h3>
    <p>Analyzing dataset structure, statistics, and quality...</p>
  `;

  const prompt = `
You are an expert Data Scientist.

Dataset Information:
Rows: ${dataset.length}
Columns: ${headers.join(", ")}
Missing Values: ${missingCount.textContent}
Quality Score: ${qualityScore.textContent}
Selected Numeric Column: ${document.getElementById("numericColumn").value}
Mean: ${document.getElementById("meanValue").textContent}
Median: ${document.getElementById("medianValue").textContent}
Std Dev: ${document.getElementById("stdValue").textContent}
Min: ${document.getElementById("minValue").textContent}
Max: ${document.getElementById("maxValue").textContent}

Return the response in clean HTML.
Use:
<h3>Executive Summary</h3><p>...</p>
<h3>Data Quality Assessment</h3><p>...</p>
<h3>Key Insights</h3><ul><li>...</li></ul>
<h3>Recommended ML Task</h3><p>...</p>
Keep response concise.
`;

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.5,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      document.getElementById("executiveSummary").innerHTML = `
        <h3>❌ Invalid API Key</h3>
        <p>Groq rejected the request. Please check your API key and try again.</p>
      `;
      return;
    }

    const text = data.choices?.[0]?.message?.content;
    if (text) {
      document.getElementById("executiveSummary").innerHTML = text;
    }
  } catch (error) {
    console.error(error);
    document.getElementById("executiveSummary").innerHTML = `
      <h3>❌ AI Analysis Failed</h3>
      <p>Unable to generate insights. Please verify your Groq API key and internet connection.</p>
    `;
  }
}

askDatasetBtn?.addEventListener("click", askDatasetQuestion);

async function askDatasetQuestion() {
  const apiKey = groqApiInput.value.trim();

  if (!apiKey) {
    datasetAnswer.innerHTML = `<p>Please add a Groq API key first.</p>`;
    return;
  }

  const question = datasetQuestion.value.trim();

  if (!question) {
    datasetAnswer.innerHTML = `<p>Please enter a question.</p>`;
    return;
  }

  datasetAnswer.innerHTML = `<p>🔍 Thinking...</p>`;

  const prompt = `
You are a senior Data Scientist.
Dataset Information:
Rows: ${dataset.length}
Columns: ${headers.join(", ")}
Missing Values: ${missingCount.textContent}
Quality Score: ${qualityScore.textContent}
Selected Column: ${numericColumnSelect.value}
Mean: ${document.getElementById("meanValue").textContent}
Median: ${document.getElementById("medianValue").textContent}
Standard Deviation: ${document.getElementById("stdValue").textContent}
User Question: ${question}
Answer clearly and concisely.
`;

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
        }),
      },
    );

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content;

    datasetAnswer.innerHTML = `<p>${answer}</p>`;
  } catch (error) {
    console.error(error);
    datasetAnswer.innerHTML = `<p>Failed to get response.</p>`;
  }
}

function exportReport() {
  const report = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>AI Data Analysis Report</title>

<style>
body{
font-family:Arial,sans-serif;
padding:40px;
line-height:1.6;
}

h1,h2{
color:#4f46e5;
}

section{
margin-bottom:30px;
}
</style>

</head>

<body>

<h1>AI Data Analysis Report</h1>

<p>
Generated:
${new Date().toLocaleString()}
</p>

<section>
<h2>Dataset Overview</h2>

<p>
Rows:
${dataset.length}
</p>

<p>
Columns:
${headers.length}
</p>
</section>

<section>
<h2>Executive Summary</h2>

${document.getElementById("executiveSummary").innerHTML}
</section>

<section>
<h2>AI Insights</h2>

<ul>

<li>
${document.getElementById("correlationInsightText").textContent}
</li>

<li>
${document.getElementById("qualityInsightText").textContent}
</li>

<li>
${document.getElementById("recommendationInsightText").textContent}
</li>

<li>
${document.getElementById("trendInsightText").textContent}
</li>

</ul>
</section>

<section>
<h2>ML Recommendation</h2>

<p>
Task:
${document.getElementById("mlTask").textContent}
</p>

<p>
Target:
${document.getElementById("targetColumn").textContent}
</p>
</section>

</body>
</html>
`;

  const blob = new Blob([report], { type: "text/html" });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download = "AI_Data_Analysis_Report.html";

  a.click();

  URL.revokeObjectURL(url);
}

function downloadInsights() {
  const insights = {
    executiveSummary: document.getElementById("executiveSummary").textContent,

    correlation: document.getElementById("correlationInsightText").textContent,

    quality: document.getElementById("qualityInsightText").textContent,

    recommendation: document.getElementById("recommendationInsightText")
      .textContent,

    trend: document.getElementById("trendInsightText").textContent,

    mlTask: document.getElementById("mlTask").textContent,

    targetColumn: document.getElementById("targetColumn").textContent,
  };

  const blob = new Blob([JSON.stringify(insights, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download = "ai_insights.json";

  a.click();

  URL.revokeObjectURL(url);
}

document
  .getElementById("exportReportBtn")
  ?.addEventListener("click", exportReport);

document
  .getElementById("downloadInsightsBtn")
  ?.addEventListener("click", downloadInsights);

lucide.createIcons();
