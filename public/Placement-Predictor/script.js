let placementChart;
let skillsChart;
const progressCircle =
  document.getElementById("progressCircle");

const radius = 75;

const circumference = 2 * Math.PI * radius;

progressCircle.style.strokeDasharray =
  circumference;

progressCircle.style.strokeDashoffset =
  circumference;
const predictBtn = document.getElementById("predictBtn");

predictBtn.addEventListener("click", () => {

  const cgpa = parseFloat(document.getElementById("cgpa").value);
  const dsa = parseInt(document.getElementById("dsa").value);
  const projects = parseInt(document.getElementById("projects").value);

  const communication = document.getElementById("communication").value;
  const internship = document.getElementById("internship").value;
  const stack = document.getElementById("stack").value;

  if (
    isNaN(cgpa) ||
    isNaN(dsa) ||
    isNaN(projects) ||
    communication === "" ||
    internship === "" ||
    stack === ""
  ) {
    alert("Please fill all fields properly");
    return;
  }

  let score = 0;

  score += cgpa * 5;
  score += dsa * 4;
  score += projects * 3;

  if (communication === "Excellent") score += 15;
  else if (communication === "Good") score += 10;
  else if (communication === "Average") score += 5;

  if (internship === "Yes") score += 15;

  if (stack === "AI / ML") score += 10;
  else if (stack === "Web Development") score += 8;
  else if (stack === "Data Science") score += 9;

  if (score > 100) score = 100;

  let packageValue = (score / 10).toFixed(1);

  let suggestion = "";

  if (score >= 80) {
    suggestion = "You're placement ready 🚀";
  } else if (score >= 60) {
    suggestion = "Improve DSA and projects";
  } else {
    suggestion = "Focus on skills and internships";
  }

  document.getElementById("placementChance").textContent = `${score}%`;
  const circle = document.getElementById("progressCircle");

const meterScore = document.getElementById("meterScore");

const radius = 75;

const circumference = 2 * Math.PI * radius;

const offset =
  circumference - (score / 100) * circumference;

circle.style.strokeDashoffset = offset;

meterScore.textContent = `${score}%`;
if (score >= 80) {

  circle.style.stroke = "#22c55e";

  circle.style.filter =
    "drop-shadow(0 0 12px rgba(34,197,94,0.8))";

} else if (score >= 60) {

  circle.style.stroke = "#eab308";

  circle.style.filter =
    "drop-shadow(0 0 12px rgba(234,179,8,0.8))";

} else {

  circle.style.stroke = "#ef4444";

  circle.style.filter =
    "drop-shadow(0 0 12px rgba(239,68,68,0.8))";
}
  document.getElementById("expectedPackage").textContent = `₹${packageValue} LPA`;
  document.getElementById("suggestion").textContent = suggestion;

  document.getElementById("resultBox").style.display = "block";
  const textColor = document.body.classList.contains("dark-mode")
  ? "#f8fafc"
  : "#222";

const gridColor = document.body.classList.contains("dark-mode")
  ? "#475569"
  : "#ddd";
  if (placementChart) placementChart.destroy();

  if (skillsChart) skillsChart.destroy();
  const placementCtx = document
  .getElementById("placementChart")
  .getContext("2d");

placementChart = new Chart(placementCtx, {
  type: "bar",

  data: {
    labels: ["Placement Chance", "Expected Package"],

    datasets: [{
      label: "Prediction Metrics",

      data: [score, packageValue],

      borderRadius: 10
    }]
  },

  options: {
    responsive: true,

    plugins: {
      legend: {
        labels: {
          color: textColor
        }
      }
    },

    scales: {
      y: {
        ticks: {
          color: textColor
        },

        grid: {
          color: gridColor
        }
      },

      x: {
        ticks: {
          color: textColor
        },

        grid: {
          color: gridColor
        }
      }
    }
  }
});
const skillsCtx = document
  .getElementById("skillsChart")
  .getContext("2d");

skillsChart = new Chart(skillsCtx, {
  type: "radar",

  data: {
    labels: [
      "CGPA",
      "DSA",
      "Projects",
      "Communication",
      "Internship"
    ],

    datasets: [{
      label: "Skill Analysis",

      data: [
        cgpa,

        dsa,

        projects > 10 ? 10 : projects,

        communication === "Excellent"
          ? 10
          : communication === "Good"
          ? 7
          : communication === "Average"
          ? 5
          : 2,

        internship === "Yes"
          ? 10
          : 3
      ]
    }]
  },

  options: {
    responsive: true,

    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: 10,

        ticks: {
          color: textColor,
          backdropColor: "transparent"
        },

        pointLabels: {
          color: textColor
        },

        grid: {
          color: gridColor
        },

        angleLines: {
          color: gridColor
        }
      }
    },

    plugins: {
      legend: {
        labels: {
          color: textColor
        }
      }
    }
  }
});
});


const themeToggle = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("placementTheme");

if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {

  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("placementTheme", "dark");
    themeToggle.textContent = "☀️";
  } else {
    localStorage.setItem("placementTheme", "light");
    themeToggle.textContent = "🌙";
  }
  if (
  document.getElementById("resultBox").style.display === "block"
) {
  predictBtn.click();
}

});