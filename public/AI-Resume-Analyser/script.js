const uploadBtn = document.getElementById("uploadBtn");
const resumeInput = document.getElementById("resumeInput");
const fileName = document.getElementById("fileName");
const themeToggleBtn = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

// Global tracking variable for current ATS score to facilitate clean chart redraws
let currentAtsScore = 75;

// --- Theme Toggle Management ---

// Check for user preference in localStorage on page load, fallback to dark theme default
const currentTheme = localStorage.getItem("theme") || "dark";
document.documentElement.setAttribute("data-theme", currentTheme);
updateThemeIcon(currentTheme);

themeToggleBtn.addEventListener("click", () => {
  let theme = "dark";
  if (document.documentElement.getAttribute("data-theme") === "dark") {
    theme = "light";
  }

  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  updateThemeIcon(theme);

  // Re-render chart to pick up matching light/dark axis and font theme text colors
  if (currentAtsScore) {
    generateChart(currentAtsScore);
  }
});

function updateThemeIcon(theme) {
  if (theme === "light") {
    themeIcon.className = "fas fa-sun";
  } else {
    themeIcon.className = "fas fa-moon";
  }
}

// --- Upload Interaction Logic ---

uploadBtn.addEventListener("click", () => {
  resumeInput.click();
});

resumeInput.addEventListener("change", () => {
  if (resumeInput.files.length > 0) {
    fileName.textContent = resumeInput.files[0].name;
    generateAnalysis();
  }
});

// --- Dashboard Visual Metric Configurations ---

const progressCircle = document.getElementById("progressCircle");
const meterScore = document.getElementById("meterScore");
const radius = 85;
const circumference = 2 * Math.PI * radius;

progressCircle.style.strokeDasharray = circumference;
progressCircle.style.strokeDashoffset = circumference;

function generateAnalysis() {
  currentAtsScore = Math.floor(Math.random() * 21) + 70;
  animateMeter(currentAtsScore);
  generateChart(currentAtsScore);
}

function animateMeter(score) {
  const offset = circumference - (score / 100) * circumference;
  setTimeout(() => {
    progressCircle.style.strokeDashoffset = offset;
  }, 300);

  meterScore.textContent = `${score}%`;

  if (score >= 85) {
    progressCircle.style.stroke = "#22c55e";
  } else if (score >= 70) {
    progressCircle.style.stroke = "#eab308";
  } else {
    progressCircle.style.stroke = "#ef4444";
  }
}

let chart;

function generateChart(score) {
  const ctx = document.getElementById("skillsChart");
  if (chart) {
    chart.destroy();
  }

  // Determine configuration settings contextually based on active data-theme state
  const isLight = document.documentElement.getAttribute("data-theme") === "light";
  const labelColor = isLight ? "#0f172a" : "#f8fafc";
  const gridColor = isLight ? "rgba(15, 23, 42, 0.12)" : "rgba(255, 255, 255, 0.1)";
  const tickColor = isLight ? "#475569" : "#cbd5e1";

  chart = new Chart(ctx, {
    type: "radar",
    data: {
      labels: [
        "Technical Skills",
        "Projects",
        "ATS Keywords",
        "Communication",
        "Experience"
      ],
      datasets: [{
        label: "Resume Strength",
        data: [
          score - 5,
          score - 8,
          score,
          score - 12,
          score - 15
        ],
        fill: true,
        backgroundColor: isLight ? "rgba(124, 58, 237, 0.2)" : "rgba(255, 255, 255, 0.08)",
        borderColor: "#7c3aed",
        borderWidth: 3,
        pointRadius: 5,
        pointBackgroundColor: "#3b82f6"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: labelColor
          }
        }
      },
      scales: {
        r: {
          suggestedMin: 0,
          suggestedMax: 100,
          ticks: {
            color: tickColor,
            backdropColor: "transparent"
          },
          pointLabels: {
            color: labelColor,
            font: {
              size: 14
            }
          },
          grid: {
            color: gridColor
          },
          angleLines: {
            color: gridColor
          }
        }
      }
    }
  });
}

// Initial execution load configuration
generateAnalysis();