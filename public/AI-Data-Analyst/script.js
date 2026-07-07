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
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
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
let isAskingQuestion = false;

// =========================
// CHART.JS GLOBAL DEFAULTS
// =========================

const initialTheme = document.documentElement.getAttribute("data-theme");
Chart.defaults.color = initialTheme === "dark" ? "#94a3b8" : "#64748b";
Chart.defaults.borderColor =
  initialTheme === "dark" ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)";
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
  generateCleaningRecommendations();

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

datasetQuestion?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    askDatasetQuestion();
  }
});

async function askDatasetQuestion() {
  if (isAskingQuestion) return;

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

  isAskingQuestion = true;
  askDatasetBtn.disabled = true;

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

    const answer =
      data.choices?.[0]?.message?.content ||
      "No response received from the AI.";

    datasetAnswer.innerHTML = `<p>${answer}</p>`;

    datasetQuestion.value = "";
  } catch (error) {
    console.error(error);
    datasetAnswer.innerHTML = `<p>Failed to get response.</p>`;
  } finally {
    isAskingQuestion = false;
    askDatasetBtn.disabled = false;
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

// =============================================================
// SMART DATA CLEANING RECOMMENDATIONS
// Pure JavaScript · Rule-Based · No AI · No external APIs
// =============================================================

// --- Constants ---

const MISSING_THRESHOLDS = { LOW: 0.05, HIGH: 0.30 };
const HIGH_CARDINALITY_RATIO = 0.50;
const HEALTH_DEDUCTIONS = {
  DUPLICATE:        5,
  HIGH_MISSING:     5,
  CONSTANT_COL:     5,
  CATEGORY_NORM:    4,
  HIGH_CARDINALITY: 3,
  OUTLIER_HEAVY:    2,
};
const MAX_VISIBLE_RECS = 6;

// Severity sort order (lower = higher priority)
const SEVERITY_ORDER = { Critical: 0, High: 1, Medium: 2, Low: 3 };

// --- Helper: check if column is numeric ---
function isNumericColumn(col) {
  let numericCount = 0;
  let nonEmptyCount = 0;
  for (const row of dataset) {
    const v = row[col];
    if (v === null || v === undefined || v === '') continue;
    nonEmptyCount++;
    if (!isNaN(Number(v))) numericCount++;
  }
  return nonEmptyCount > 0 && numericCount / nonEmptyCount >= 0.80;
}

// --- Helper: get non-empty numeric values for a column ---
function getNumericValuesForCol(col) {
  return dataset
    .map(r => Number(r[col]))
    .filter(v => !isNaN(v));
}

// --- Helper: compute IQR outlier count ---
function countOutliersIQR(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;
  const lower = q1 - 1.5 * iqr;
  const upper = q3 + 1.5 * iqr;
  return sorted.filter(v => v < lower || v > upper).length;
}

// --- Helper: count missing values for a column ---
function countMissingForCol(col) {
  return dataset.filter(r => {
    const v = r[col];
    return v === null || v === undefined || v === '';
  }).length;
}

// --- Helper: confidence stars (1-5 based on ratio) ---
function getConfidenceStars(ratio) {
  return Math.max(1, Math.min(5, Math.round(ratio * 5)));
}

// ---------------------------------------------------------------
// DETECTOR 1: Missing Values
// ---------------------------------------------------------------
function detectMissingValueIssues() {
  const issues = [];
  const totalRows = dataset.length;

  for (const col of headers) {
    const missing = countMissingForCol(col);
    if (missing === 0) continue;

    const ratio = missing / totalRows;

    // Empty columns are handled by detectEmptyColumns
    if (ratio >= 1.0) continue;

    let severity, recommendation, why;

    if (ratio > MISSING_THRESHOLDS.HIGH) {
      severity = 'Critical';
      recommendation = `Drop or reconstruct "${col}". Over 30% missing makes imputation unreliable.`;
      why = 'Columns with more than 30% missing values introduce heavy bias and noise regardless of imputation technique.';
    } else if (ratio >= MISSING_THRESHOLDS.LOW) {
      severity = 'High';
      const numeric = isNumericColumn(col);
      recommendation = numeric
        ? `Impute "${col}" using median imputation to preserve distribution.`
        : `Impute "${col}" using the most frequent category or a dedicated "Unknown" label.`;
      why = numeric
        ? 'Median is robust to outliers and does not distort the column distribution the way mean imputation does.'
        : 'Mode imputation maintains the natural category balance; a dedicated label avoids creating a false majority.';
    } else {
      severity = 'Low';
      recommendation = `Impute the ${missing} missing value(s) in "${col}" using mean or mode.`;
      why = 'Less than 5% missing is minimal and safe to impute with simple strategies without biasing the model.';
    }

    issues.push({
      icon: "triangle-alert",
      title: 'Missing Values',
      severity,
      column: col,
      recommendation,
      why,
      confidence: getConfidenceStars(1 - ratio),
    });
  }

  return issues;
}

// ---------------------------------------------------------------
// DETECTOR 2: Duplicate Rows
// ---------------------------------------------------------------
function detectDuplicateRows() {
  const seen = new Set();
  let duplicateCount = 0;

  for (const row of dataset) {
    const key = JSON.stringify(row);
    if (seen.has(key)) {
      duplicateCount++;
    } else {
      seen.add(key);
    }
  }

  if (duplicateCount === 0) return [];

  const ratio = duplicateCount / dataset.length;
  const severity = ratio > 0.10 ? 'High' : 'Medium';

  return [{
    icon: "copy",
    title: 'Duplicate Rows',
    severity,
    column: 'Entire Dataset',
    recommendation: `Remove ${duplicateCount} duplicate row(s) before modeling.`,
    why: 'Duplicate rows inflate training data artificially, causing the model to overfit to repeated examples and report overly optimistic evaluation metrics.',
    confidence: 5,
  }];
}

// ---------------------------------------------------------------
// DETECTOR 3: Outliers (IQR method)
// ---------------------------------------------------------------
function detectOutlierIssues() {
  const issues = [];

  for (const col of headers) {
    if (!isNumericColumn(col)) continue;

    const values = getNumericValuesForCol(col);
    if (values.length < 10) continue;

    const outlierCount = countOutliersIQR(values);
    if (outlierCount === 0) continue;

    const ratio = outlierCount / values.length;
    const severity = ratio > 0.10 ? 'High' : 'Medium';

    issues.push({
      icon: "chart-column",
      title: 'Outliers Detected',
      severity,
      column: col,
      recommendation: `Investigate ${outlierCount} outlier(s) in "${col}". Cap using IQR bounds or apply log transformation.`,
      why: 'Outliers skew statistical summaries and mislead distance-based models (e.g. k-NN, SVM). Tree-based models are more tolerant but extreme outliers still hurt generalization.',
      confidence: getConfidenceStars(1 - ratio),
    });
  }

  return issues;
}

// ---------------------------------------------------------------
// DETECTOR 4: Constant Columns
// ---------------------------------------------------------------
function detectConstantColumns() {
  const issues = [];

  for (const col of headers) {
    const unique = new Set(dataset.map(r => r[col]));
    if (unique.size !== 1) continue;

    issues.push({
      icon: "minus-circle",
      title: 'Constant Column',
      severity: 'High',
      column: col,
      recommendation: `Drop "${col}" — it contains only one unique value and provides zero predictive signal.`,
      why: 'A column with a single value has zero variance. It cannot help any model distinguish between records and will waste memory and computation.',
      confidence: 5,
    });
  }

  return issues;
}

// ---------------------------------------------------------------
// DETECTOR 5: High Cardinality
// ---------------------------------------------------------------
function detectHighCardinality() {
  const issues = [];
  const totalRows = dataset.length;

  for (const col of headers) {
    // Skip numeric columns
    if (isNumericColumn(col)) continue;

    const unique = new Set(dataset.map(r => r[col]));
    const ratio = unique.size / totalRows;

    if (ratio < HIGH_CARDINALITY_RATIO) continue;

    issues.push({
      icon: "hash",
      title: 'High Cardinality',
      severity: 'Medium',
      column: col,
      recommendation: `Check "${col}" — ${unique.size} unique values (${(ratio * 100).toFixed(0)}% of rows). Consider grouping rare categories or treating it as an identifier.`,
      why: 'High-cardinality categorical columns create sparse one-hot encodings, leading to the curse of dimensionality and potential overfitting to low-frequency values.',
      confidence: 4,
    });
  }

  return issues;
}

// ---------------------------------------------------------------
// DETECTOR 6: Category Normalization
// ---------------------------------------------------------------
function detectCategoryNormalizationIssues() {
  const issues = [];

  for (const col of headers) {
    if (isNumericColumn(col)) continue;

    const valuesRaw = dataset
      .map(r => String(r[col] ?? '').trim())
      .filter(v => v !== '');

    const grouped = {};
    for (const v of valuesRaw) {
      const key = v.toLowerCase();
      if (!grouped[key]) grouped[key] = new Set();
      grouped[key].add(v);
    }

    // Find groups that have more than one case variant
    const inconsistentGroups = Object.entries(grouped).filter(
      ([, variants]) => variants.size > 1
    );

    if (inconsistentGroups.length === 0) continue;

    const examples = inconsistentGroups
      .slice(0, 3)
      .map(([, variants]) => [...variants].join(' / '))
      .join('; ');

    issues.push({
      icon: "case-sensitive",
      title: 'Inconsistent Category Casing',
      severity: 'Medium',
      column: col,
      recommendation: `Normalize all values in "${col}" to a consistent case. Examples: ${examples}.`,
      why: 'Case differences cause the same logical category to appear as multiple distinct classes, inflating cardinality and producing incorrect groupings in aggregations and models.',
      confidence: 4,
    });
  }

  return issues;
}

// ---------------------------------------------------------------
// DETECTOR 7: Empty Columns (100% missing)
// ---------------------------------------------------------------
function detectEmptyColumns() {
  const issues = [];

  for (const col of headers) {
    const missing = countMissingForCol(col);
    if (missing < dataset.length) continue;

    issues.push({
      icon: "trash-2",
      title: 'Empty Column',
      severity: 'Critical',
      column: col,
      recommendation: `Drop "${col}" immediately — it contains no data at all.`,
      why: 'A fully empty column carries zero information. Retaining it wastes memory, may crash imputers that expect at least one valid value, and confuses feature selection algorithms.',
      confidence: 5,
    });
  }

  return issues;
}

// ---------------------------------------------------------------
// DETECTOR 8: Potential Identifier Columns
// ---------------------------------------------------------------
function detectPotentialIdentifierColumns() {
  const issues = [];
  const idPatterns = /\b(id|_id|userid|user_id|customerid|customer_id|orderid|order_id|recordid|record_id|rowid|row_id|uuid|guid)\b/i;

  for (const col of headers) {
    const unique = new Set(dataset.map(r => r[col]));
    const isAllUnique = unique.size === dataset.length;
    const looksLikeId = idPatterns.test(col);

    if (!isAllUnique && !looksLikeId) continue;

    const reason = isAllUnique
      ? `"${col}" has a unique value for every row (${unique.size}/${dataset.length}).`
      : `"${col}" matches an identifier naming pattern.`;

    issues.push({
      icon: "fingerprint",
      title: 'Potential Identifier Column',
      severity: 'Low',
      column: col,
      recommendation: `Exclude "${col}" from ML feature sets. Use it only for row tracking and joins.`,
      why: `${reason} Identifier columns memorize row positions rather than learning patterns, causing data leakage and poor generalization on unseen data.`,
      confidence: isAllUnique ? 5 : 3,
    });
  }

  return issues;
}

// ---------------------------------------------------------------
// HEALTH SCORE CALCULATOR
// ---------------------------------------------------------------
function calculateDatasetHealth(allIssues) {
  let score = 100;

  const hasDuplicates = allIssues.some(i => i.title === 'Duplicate Rows');
  if (hasDuplicates) score -= HEALTH_DEDUCTIONS.DUPLICATE;

  const highMissingCols = allIssues.filter(
    i => i.title === 'Missing Values' && (i.severity === 'High' || i.severity === 'Critical')
  ).length;
  score -= Math.min(highMissingCols * HEALTH_DEDUCTIONS.HIGH_MISSING, 20);

  const constantCols = allIssues.filter(i => i.title === 'Constant Column').length;
  score -= Math.min(constantCols * HEALTH_DEDUCTIONS.CONSTANT_COL, 15);

  const normIssues = allIssues.filter(
    i => i.title === 'Inconsistent Category Casing'
  ).length;
  score -= Math.min(normIssues * HEALTH_DEDUCTIONS.CATEGORY_NORM, 12);

  const highCardCols = allIssues.filter(i => i.title === 'High Cardinality').length;
  score -= Math.min(highCardCols * HEALTH_DEDUCTIONS.HIGH_CARDINALITY, 9);

  const outlierCols = allIssues.filter(
    i => i.title === 'Outliers Detected' && i.severity === 'High'
  ).length;
  score -= Math.min(outlierCols * HEALTH_DEDUCTIONS.OUTLIER_HEAVY, 10);

  return Math.max(0, Math.min(100, Math.round(score)));
}

// ---------------------------------------------------------------
// ASSESSMENT TEXT GENERATOR
// ---------------------------------------------------------------
function generateDatasetAssessment(healthScore, allIssues) {
  const criticalCount = allIssues.filter(i => i.severity === 'Critical').length;
  const highCount = allIssues.filter(i => i.severity === 'High').length;
  const hasDuplicates = allIssues.some(i => i.title === 'Duplicate Rows');
  const hasMissing = allIssues.some(i => i.title === 'Missing Values');
  const hasOutliers = allIssues.some(i => i.title === 'Outliers Detected');

  if (healthScore >= 90) {
    return 'Your dataset is in excellent condition. Minor preprocessing may still improve model performance, but the data is largely clean and ready for machine learning workflows.';
  }

  if (healthScore >= 75) {
    const priorities = [];
    if (hasMissing) priorities.push('missing values');
    if (hasDuplicates) priorities.push('duplicate rows');
    if (hasOutliers) priorities.push('outliers');
    const priorityText = priorities.length > 0
      ? ` The highest priorities are addressing ${priorities.join(' and ')}.`
      : '';
    return `Your dataset is generally clean but requires preprocessing before machine learning.${priorityText} Once cleaned, the dataset will be suitable for exploratory analysis and predictive modeling.`;
  }

  if (criticalCount > 0) {
    return `Your dataset has ${criticalCount} critical issue(s) that must be resolved before any analysis. Empty or near-empty columns and extreme missing value rates will severely degrade model quality. Address critical issues first, then revisit high-severity items.`;
  }

  if (highCount > 0) {
    return `Your dataset requires significant preprocessing. ${highCount} high-severity issue(s) detected — including ${hasMissing ? 'missing values' : ''}${hasDuplicates ? (hasMissing ? ' and duplicates' : 'duplicates') : ''}. Resolving these issues before training will substantially improve model accuracy and reliability.`;
  }

  return `Your dataset has some medium and low-severity issues. While usable for initial exploration, addressing the recommendations below will produce cleaner, more reliable results.`;
}

// ---------------------------------------------------------------
// MASTER ORCHESTRATOR
// ---------------------------------------------------------------
function generateCleaningRecommendations() {
  if (!dataset || dataset.length === 0) return;

  // Collect all issues from every detector
  const allIssues = [
    ...detectEmptyColumns(),
    ...detectMissingValueIssues(),
    ...detectDuplicateRows(),
    ...detectConstantColumns(),
    ...detectOutlierIssues(),
    ...detectCategoryNormalizationIssues(),
    ...detectHighCardinality(),
    ...detectPotentialIdentifierColumns(),
  ];

  // Sort by severity priority
  allIssues.sort(
    (a, b) => (SEVERITY_ORDER[a.severity] ?? 9) - (SEVERITY_ORDER[b.severity] ?? 9)
  );

  const healthScore = calculateDatasetHealth(allIssues);
  const assessment = generateDatasetAssessment(healthScore, allIssues);

  renderCleaningRecommendations(allIssues, healthScore, assessment);
}

// ---------------------------------------------------------------
// RENDERER
// ---------------------------------------------------------------
function renderCleaningRecommendations(issues, healthScore, assessment) {
  // --- Metric cards ---
  const criticalCount = issues.filter(i => i.severity === 'Critical').length;

  document.getElementById('cleaningHealthScore').textContent =
    `${healthScore}/100`;
  document.getElementById('cleaningIssuesCount').textContent =
    issues.length;
  document.getElementById('cleaningCriticalCount').textContent =
    criticalCount;
  document.getElementById('cleaningSuggestionsCount').textContent =
    issues.filter(i => i.severity === 'Low' || i.severity === 'Medium').length;

  // --- Recommendation cards container ---
  const container = document.getElementById('cleaningRecommendations');
  container.innerHTML = '';

  if (issues.length === 0) {
    container.innerHTML = `
      <div class="cleaning-empty-state">
        <div class="cleaning-empty-icon">
          <i data-lucide="check-circle-2"></i>
        </div>
        <p class="cleaning-empty-title">Dataset Looks Clean!</p>
        <p class="cleaning-empty-desc">No significant data quality issues were detected. Your dataset appears ready for analysis and modeling.</p>
      </div>`;
    lucide.createIcons();
    document.getElementById('cleaningAssessment').style.display = 'flex';
    document.getElementById('cleaningAssessmentText').textContent = assessment;
    document.getElementById('cleaningShowMore').style.display = 'none';
    return;
  }

  // Render cards
  issues.forEach((issue, idx) => {
    const isHidden = idx >= MAX_VISIBLE_RECS;
    const severityKey = issue.severity.toLowerCase();
    const iconClass = `cleaning-rec-icon-${severityKey}`;
    const badgeClass = `severity-${severityKey}`;

    // Build confidence stars
    let starsHtml = '';
    for (let s = 1; s <= 5; s++) {
      starsHtml += `<span class="confidence-star${s > issue.confidence ? ' empty' : ''}">★</span>`;
    }

    const card = document.createElement('div');
    card.className = `cleaning-rec-card${isHidden ? ' hidden-rec' : ''}`;
    if (isHidden) card.style.display = 'none';

    card.innerHTML = `
      <div class="cleaning-rec-header">
        <div class="cleaning-rec-icon ${iconClass}">
          <i data-lucide="${issue.icon}"></i>
        </div>
        <div class="cleaning-rec-title-row">
          <span class="cleaning-rec-title">${issue.title}</span>
          <div class="cleaning-rec-meta">
            <span class="severity-badge ${badgeClass}">${issue.severity}</span>
            <span class="cleaning-col-pill">${issue.column}</span>
          </div>
        </div>
      </div>
      <div class="cleaning-rec-body">
        <div class="cleaning-rec-field">
          <span class="cleaning-rec-field-label">Recommendation</span>
          <span class="cleaning-rec-field-value">${issue.recommendation}</span>
        </div>
        <div class="cleaning-rec-field">
          <span class="cleaning-rec-field-label">Why?</span>
          <span class="cleaning-rec-field-value">${issue.why}</span>
        </div>
      </div>
      <div class="cleaning-confidence">
        <span class="cleaning-confidence-label">Confidence</span>
        ${starsHtml}
      </div>`;
    container.appendChild(card);
  });

  // Show more / collapse button
  const showMoreBtn = document.getElementById('cleaningShowMore');
  if (issues.length > MAX_VISIBLE_RECS) {
    showMoreBtn.style.display = 'flex';
    showMoreBtn.classList.remove('expanded');
    const extraCount = issues.length - MAX_VISIBLE_RECS;
    showMoreBtn.innerHTML = `<i data-lucide="chevron-down"></i> Show ${extraCount} More Recommendations`;

    showMoreBtn.onclick = () => {
      const hiddenCards = container.querySelectorAll('.hidden-rec');
      const isExpanded = showMoreBtn.classList.contains('expanded');

      if (isExpanded) {
        // Collapse
        hiddenCards.forEach(card => { card.style.display = 'none'; });
        showMoreBtn.classList.remove('expanded');
        showMoreBtn.innerHTML = `<i data-lucide="chevron-down"></i> Show ${extraCount} More Recommendations`;
      } else {
        // Expand
        container.querySelectorAll('[style*="display: none"]').forEach(card => {
          card.style.display = 'block';
        });
        showMoreBtn.classList.add('expanded');
        showMoreBtn.innerHTML = `<i data-lucide="chevron-up"></i> Show Less`;
      }
      lucide.createIcons();
    };
  } else {
    showMoreBtn.style.display = 'none';
  }

  // Assessment note
  document.getElementById('cleaningAssessment').style.display = 'flex';
  document.getElementById('cleaningAssessmentText').textContent = assessment;

  lucide.createIcons();
}

lucide.createIcons();
