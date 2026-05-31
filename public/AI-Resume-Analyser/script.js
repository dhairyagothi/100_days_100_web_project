const uploadBtn =
  document.getElementById("uploadBtn");

const resumeInput =
  document.getElementById("resumeInput");

const fileName =
  document.getElementById("fileName");

uploadBtn.addEventListener("click", () => {

  resumeInput.click();

});

resumeInput.addEventListener("change", () => {

  if (resumeInput.files.length > 0) {

    fileName.textContent =
      resumeInput.files[0].name;

    generateAnalysis();
  }
});

const progressCircle =
  document.getElementById("progressCircle");

const meterScore =
  document.getElementById("meterScore");

const radius = 85;

const circumference =
  2 * Math.PI * radius;

progressCircle.style.strokeDasharray =
  circumference;

progressCircle.style.strokeDashoffset =
  circumference;

function generateAnalysis() {

  const atsScore =
    Math.floor(Math.random() * 21) + 70;

  animateMeter(atsScore);

  generateChart(atsScore);
}

function animateMeter(score) {

  const offset =
    circumference -
    (score / 100) * circumference;

  setTimeout(() => {

    progressCircle.style.strokeDashoffset =
      offset;

  }, 300);

  meterScore.textContent =
    `${score}%`;

  if (score >= 85) {

    progressCircle.style.stroke =
      "#22c55e";

  } else if (score >= 70) {

    progressCircle.style.stroke =
      "#eab308";

  } else {

    progressCircle.style.stroke =
      "#ef4444";
  }
}

let chart;

function generateChart(score) {

  const ctx =
    document.getElementById("skillsChart");

  if (chart) {
    chart.destroy();
  }

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

        borderWidth: 3,

        pointRadius: 5
      }]
    },

    options: {

      responsive: true,

      plugins: {

        legend: {

          labels: {
            color: "#f8fafc"
          }
        }
      },

      scales: {

        r: {

          suggestedMin: 0,

          suggestedMax: 100,

          ticks: {

            color: "#cbd5e1",

            backdropColor:
              "transparent"
          },

          pointLabels: {

            color: "#f8fafc",

            font: {
              size: 14
            }
          },

          grid: {
            color:
              "rgba(255,255,255,0.1)"
          },

          angleLines: {
            color:
              "rgba(255,255,255,0.1)"
          }
        }
      }
    }
  });
}

generateAnalysis();

const themeToggle =
  document.getElementById("themeToggle");

const savedTheme =
  localStorage.getItem("resumeTheme");

if (savedTheme === "light") {

  document.body.classList.add("light-mode");
  
  themeToggle.textContent = "☀️";
} else {
  themeToggle.textContent = "🌙";
}

themeToggle.addEventListener("click", () => {

  document.body.classList.toggle("light-mode");

  const isLight =
    document.body.classList.contains("light-mode");

  localStorage.setItem(
    "resumeTheme",
    isLight ? "light" : "dark"
  );

  themeToggle.textContent =
    isLight ? "☀️" : "🌙";
});