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

const readinessScore = 82;

const offset =
  circumference -
  (readinessScore / 100) * circumference;

setTimeout(() => {

  progressCircle.style.strokeDashoffset =
    offset;

}, 300);

meterScore.textContent =
  `${readinessScore}%`;

if (readinessScore >= 80) {

  progressCircle.style.stroke =
    "#22c55e";

} else if (readinessScore >= 60) {

  progressCircle.style.stroke =
    "#eab308";

} else {

  progressCircle.style.stroke =
    "#ef4444";
}

const ctx =
  document.getElementById("skillsChart");

new Chart(ctx, {

  type: "radar",

  data: {

    labels: [
      "DSA",
      "Development",
      "Aptitude",
      "Communication",
      "Core CS"
    ],

    datasets: [{

      label: "Skill Strength",

      data: [85, 78, 80, 72, 75],

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

          backdropColor: "transparent"
        },

        pointLabels: {

          color: "#f8fafc",

          font: {
            size: 14
          }
        },

        grid: {
          color: "rgba(255,255,255,0.1)"
        },

        angleLines: {
          color: "rgba(255,255,255,0.1)"
        }
      }
    }
  }
});

const questions = [

  {
    question:
      "Tell me about yourself.",

    answer:
      "Give a concise introduction including education, technical skills, projects, and career goals."
  },

  {
    question:
      "What are your strengths?",

    answer:
      "Mention strengths supported with examples such as problem-solving, teamwork, communication, or leadership."
  },

  {
    question:
      "Explain a challenging project you worked on.",

    answer:
      "Describe the problem, your role, technologies used, challenges faced, and final outcome."
  },

  {
    question:
      "Why should we hire you?",

    answer:
      "Highlight your skills, adaptability, passion for learning, and alignment with the company role."
  }

];

let currentQuestion = 0;

const questionText =
  document.getElementById("question");

const answerText =
  document.getElementById("answer");

const showAnswerBtn =
  document.getElementById("showAnswerBtn");

showAnswerBtn.addEventListener("click", () => {

  if (
    answerText.classList.contains("hidden")
  ) {

    answerText.classList.remove("hidden");

    showAnswerBtn.textContent =
      "Next Question";

  } else {

    currentQuestion++;

    if (
      currentQuestion >= questions.length
    ) {

      currentQuestion = 0;
    }

    questionText.textContent =
      questions[currentQuestion].question;

    answerText.textContent =
      questions[currentQuestion].answer;

    answerText.classList.add("hidden");

    showAnswerBtn.textContent =
      "Show Answer";
  }
});

const goalCheckboxes =
  document.querySelectorAll(
    ".goal-card input"
  );

goalCheckboxes.forEach((checkbox) => {

  checkbox.addEventListener(
    "change",
    () => {

      const goalText =
        checkbox.nextElementSibling;

      if (checkbox.checked) {

        goalText.style.textDecoration =
          "line-through";

        goalText.style.opacity = "0.6";

      } else {

        goalText.style.textDecoration =
          "none";

        goalText.style.opacity = "1";
      }
    }
  );
});