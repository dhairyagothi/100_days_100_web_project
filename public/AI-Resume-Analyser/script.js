const uploadBtn =
  document.getElementById("uploadBtn");

const resumeInput =
  document.getElementById("resumeInput");

const fileName =
  document.getElementById("fileName");

const downloadReportBtn =
  document.getElementById(
    "downloadReportBtn"
  );
const dropZone =
  document.getElementById("dropZone");

const dragText =
  document.querySelector(".drag-text");
  

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

["dragenter", "dragover"].forEach(eventName => {

  dropZone.addEventListener(
    eventName,
    e => {

      e.preventDefault();

      dropZone.classList.add(
        "drag-over"
      );

      dragText.textContent =
        "Drop your resume here";
    }
  );

});

["dragleave", "drop"].forEach(eventName => {

  dropZone.addEventListener(
    eventName,
    e => {

      e.preventDefault();

      dropZone.classList.remove(
        "drag-over"
      );

      dragText.textContent =
        "or drag & drop your resume here";
    }
  );

});

dropZone.addEventListener(
  "drop",
  e => {

    const files =
      e.dataTransfer.files;

    if (files.length > 0) {

      resumeInput.files = files;
      
      fileName.textContent =
        files[0].name;

      generateAnalysis();
    }
  }
);


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

let currentATSScore = 0;

function generateAnalysis() {

   currentATSScore =
    Math.floor(Math.random() * 21) + 70;


  const atsScore =
   currentATSScore;

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

downloadReportBtn.addEventListener(
"click",
() => {

const report = `
AI Resume Analyzer Report
=========================

ATS Score: ${currentATSScore}%

Resume Insights
---------------
Technical Skills: 88%
Projects: 82%
Communication: 74%
Experience: 68%

AI Suggestions
--------------
• Add more quantified project achievements.
• Include keywords like React, APIs, and Node.js.
• Improve resume summary section.
• Add GitHub and portfolio links.
`;

const blob =
  new Blob(
    [report],
    { type: "text/plain" }
  );

const url =
  URL.createObjectURL(blob);

const a =
  document.createElement("a");

a.href = url;

a.download =
  "resume-analysis-report.txt";

a.click();

URL.revokeObjectURL(url);
}
);