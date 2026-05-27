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

let readinessScore = 82;

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

const skillsChart = new Chart(ctx, {

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
const updateBtn =
  document.getElementById("updateBtn");

updateBtn.addEventListener("click", () => {

  const dsa =
    parseInt(
      document.getElementById("dsaInput").value
    );

  const mock =
    parseInt(
      document.getElementById("mockInput").value
    );

  const aptitude =
    parseInt(
      document.getElementById("aptitudeInput").value
    );

  const resume =
    parseInt(
      document.getElementById("resumeInput").value
    );

  const communication =
    parseInt(
      document.getElementById("communicationInput").value
    );

  const development =
    parseInt(
      document.getElementById("developmentInput").value
    );

  document.getElementById("dsaSolved")
    .textContent = dsa;

  document.getElementById("mockSolved")
    .textContent = mock;

  document.getElementById("aptitudeScore")
    .textContent = `${aptitude}%`;

  document.getElementById("resumeScore")
    .textContent = `${resume}%`;

  readinessScore = Math.round(
    (
      aptitude +
      resume +
      communication +
      development
    ) / 4
  );

  const offset =
    circumference -
    (readinessScore / 100) * circumference;

  progressCircle.style.strokeDashoffset =
    offset;

  meterScore.textContent =
    `${readinessScore}%`;

  const statusText =
    document.getElementById("statusText");

  if (readinessScore >= 80) {

    progressCircle.style.stroke =
      "#22c55e";

    statusText.textContent =
      "Placement Ready";

  } else if (readinessScore >= 60) {

    progressCircle.style.stroke =
      "#eab308";

    statusText.textContent =
      "Almost Ready";

  } else {

    progressCircle.style.stroke =
      "#ef4444";

    statusText.textContent =
      "Need Improvement";
  }

  skillsChart.data.datasets[0].data = [
    dsa > 100 ? 100 : dsa,
    development,
    aptitude,
    communication,
    resume
  ];

  skillsChart.update();

  const companyGrid =
    document.getElementById("companyGrid");

  if (readinessScore >= 80) {

    companyGrid.innerHTML = `
      <div class="company-card">
        <h3>Google</h3>
        <p>Focus: DSA + System Design</p>
      </div>

      <div class="company-card">
        <h3>Microsoft</h3>
        <p>Focus: Core CS + Problem Solving</p>
      </div>

      <div class="company-card">
        <h3>Adobe</h3>
        <p>Focus: Development + Projects</p>
      </div>
    `;

  } else {

    companyGrid.innerHTML = `
      <div class="company-card">
        <h3>TCS</h3>
        <p>Focus: Aptitude + Communication</p>
      </div>

      <div class="company-card">
        <h3>Infosys</h3>
        <p>Focus: Resume + HR Round</p>
      </div>

      <div class="company-card">
        <h3>Wipro</h3>
        <p>Focus: Basics + Coding</p>
      </div>
    `;
  }

});