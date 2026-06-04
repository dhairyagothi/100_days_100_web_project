const authContainer =
  document.getElementById("authContainer");

const mainApp =
  document.getElementById("mainApp");

const authBtn =
  document.getElementById("authBtn");

const authTitle =
  document.getElementById("authTitle");

const toggleAuth =
  document.getElementById("toggleAuth");

const usernameInput =
  document.getElementById("username");

const passwordInput =
  document.getElementById("password");

const logoutBtn =
  document.getElementById("logoutBtn");

const downloadReportBtn =
  document.getElementById("downloadReportBtn");

const communication =
  document.getElementById(
    "communicationInput"
  ).value;

const development =
  document.getElementById(
    "developmentInput"
  ).value;


let isLogin = true;

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

  saveUserData({
  dsa,
  mock,
  aptitude,
  resume,
  communication,
  development
  });


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
function saveUserData(data) {

  localStorage.setItem(
    "placemateUserData",
    JSON.stringify(data)
  );
}
function generatePDFReport() {

  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();
  const fileDate =
  new Date()
    .toISOString()
    .split("T")[0];

  const username =
    localStorage.getItem(
      "placemateUser"
    ) || "Guest";

  const today =
    new Date().toLocaleDateString();

  const dsa =
    document.getElementById(
      "dsaSolved"
    ).textContent;

  const mock =
    document.getElementById(
      "mockSolved"
    ).textContent;

  const aptitude =
    document.getElementById(
      "aptitudeScore"
    ).textContent;

  const resume =
    document.getElementById(
      "resumeScore"
    ).textContent;

  const readiness =
    document.getElementById(
      "meterScore"
    ).textContent;

  const status =
    document.getElementById(
      "statusText"
    ).textContent;

  doc.setFontSize(20);

  doc.text(
    "PlaceMate Progress Report",
    20,
    10
  );

  doc.setFontSize(12);

  doc.text(
    `User: ${username}`,
    20,
    30
  );

  doc.text(
    `Date: ${today}`,
    20,
    40
  );

  doc.text(
    `DSA Solved: ${dsa}`,
    20,
    60
  );

  doc.text(
    `Mock Interviews: ${mock}`,
    20,
    70
  );

  doc.text(
    `Aptitude Score: ${aptitude}`,
    20,
    80
  );

  doc.text(
    `Resume Score: ${resume}`,
    20,
    90
  );

  doc.text(
    `Communication Skill: ${communication}%`,
    20,
    100
  );

  doc.text(
    `Development Skill: ${development}%`,
    20,
    110
  );

  doc.text(
    `Interview Readiness: ${readiness}`,
    20,
    120
  );

  doc.text(
    `Status: ${status}`,
    20,
    130
  );
  let y = 150;

  doc.text(
  "Daily Goals:",
  20,
  y
  );

y += 10;

document
  .querySelectorAll(".goal-card")
  .forEach(goal => {

    const checked =
      goal.querySelector(
        "input"
      ).checked;

    const text =
      goal.querySelector(
        "span"
      ).textContent;

    doc.text(
      `${checked ? "[Done]" : "[Pending]"} ${text}`,
      25,
      y
    );

    y += 10;
  });
y += 10;

doc.text(
  "Recommended Companies:",
  20,
  y
);

y += 10;

document
  .querySelectorAll(
    ".company-card h3"
  )
  .forEach(company => {

    doc.text(
      company.textContent,
      25,
      y
    );

    y += 10;
  });

  const strengths = [];

  if (
    parseInt(aptitude) >= 80
  ){
    strengths.push("Aptitude");
  }

  if (
    parseInt(resume) >= 80
  ){
    strengths.push("Resume");
  }

  y += 10;

  doc.text(
  "Strength Areas:",
  20,
  y
  );

  y += 10;

  doc.text(
  strengths.length
    ? strengths.join(", ")
    : "Keep improving all skills",
  25,
  y
  );

  doc.text(
  `Generated at: ${new Date().toLocaleString()}`,
  20,
  280
  );


  
  doc.text(
  "Generated by PlaceMate Dashboard",
  20,
  290
  );

  doc.save(
  `placemate-report-${fileDate}.pdf`
  );


  doc.setFontSize(10);


}

if (downloadReportBtn) {

  downloadReportBtn.addEventListener(
    "click",
    generatePDFReport
  );

}

function loadUserData() {

  const savedData =
    localStorage.getItem(
      "placemateUserData"
    );

  if (!savedData) return;

  const data = JSON.parse(savedData);

  document.getElementById("dsaInput").value =
    data.dsa;

  document.getElementById("mockInput").value =
    data.mock;

  document.getElementById("aptitudeInput").value =
    data.aptitude;

  document.getElementById("resumeInput").value =
    data.resume;

  document.getElementById("communicationInput").value =
    data.communication;

  document.getElementById("developmentInput").value =
    data.development;

  updateBtn.click();
}
window.addEventListener("load", () => {
  loadUserData();
});

/* =========================
   THEME TOGGLE
========================= */

const themeToggle =
  document.getElementById("themeToggle");

const savedTheme =
  localStorage.getItem("placemateTheme");

if (savedTheme === "light") {

  document.body.classList.add("light-mode");

  themeToggle.textContent = "🌙";

} else {

  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {

  document.body.classList.toggle("light-mode");

  if (
    document.body.classList.contains("light-mode")
  ) {

    localStorage.setItem(
      "placemateTheme",
      "light"
    );

    themeToggle.textContent = "🌙";

  } else {

    localStorage.setItem(
      "placemateTheme",
      "dark"
    );

    themeToggle.textContent = "☀️";
  }
});
function showApp(){

  authContainer.style.display =
    "none";

  mainApp.style.display =
    "block";
}

function showAuth(){

  authContainer.style.display =
    "flex";

  mainApp.style.display =
    "none";
}
const currentUser =
  localStorage.getItem(
    "placemateUser"
  );

if(currentUser){

  showApp();

}else{

  showAuth();
}
toggleAuth.addEventListener(
  "click",
  () => {

    isLogin = !isLogin;

    authTitle.textContent =
      isLogin
        ? "Login"
        : "Sign Up";

    toggleAuth.innerHTML =
      isLogin
      ? `Don't have an account? <span>Sign Up</span>`
      : `Already have an account? <span>Login</span>`;
  }
);
authBtn.addEventListener(
  "click",
  () => {

    const username =
      usernameInput.value.trim();

    const password =
      passwordInput.value.trim();

    if(
      !username ||
      !password
    ){
      alert(
        "Please fill all fields"
      );
      return;
    }

    const users =
      JSON.parse(
        localStorage.getItem(
          "placemateUsers"
        )
      ) || [];

    if(isLogin){

      const foundUser =
        users.find(
          user =>
            user.username === username &&
            user.password === password
        );

      if(!foundUser){

        alert(
          "Invalid Credentials"
        );

        return;
      }

    }else{

      users.push({
        username,
        password
      });

      localStorage.setItem(
        "placemateUsers",
        JSON.stringify(users)
      );
    }

    localStorage.setItem(
      "placemateUser",
      username
    );

    showApp();
  }
);

logoutBtn.addEventListener(
  "click",
  () => {

    localStorage.removeItem(
      "placemateUser"
    );

    showAuth();
  }
);