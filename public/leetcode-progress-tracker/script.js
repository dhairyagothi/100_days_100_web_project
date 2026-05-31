const totalSolved = document.getElementById("totalSolved");
const easySolved = document.getElementById("easySolved");
const mediumSolved = document.getElementById("mediumSolved");
const hardSolved = document.getElementById("hardSolved");
const streakCount = document.getElementById("streakCount");

const form = document.getElementById("problemForm");
const problemList = document.getElementById("problemList");

const themeToggle = document.getElementById("themeToggle");

let problems = JSON.parse(
  localStorage.getItem("leetcodeProblems")
) || [];

let streak = Number(
  localStorage.getItem("leetcodeStreak")
) || 0;

streakCount.textContent = streak;

/* THEME */

themeToggle.addEventListener("click", () => {

  document.body.classList.toggle("light");

  if(document.body.classList.contains("light")){

    themeToggle.innerHTML =
      '<i class="ri-sun-line"></i>';

  } else {

    themeToggle.innerHTML =
      '<i class="ri-moon-line"></i>';

  }

});

/* RENDER */

function renderProblems(){

  problemList.innerHTML = "";

  [...problems].reverse().forEach(problem => {

    const div = document.createElement("div");

    div.className = "problem-item";

    div.innerHTML = `

      <h3>${problem.name}</h3>

      <span class="
        problem-difficulty
        ${problem.difficulty.toLowerCase()}
      ">
        ${problem.difficulty}
      </span>

    `;

    problemList.appendChild(div);

  });

}

/* STATS */

function updateStats(){

  const easy = problems.filter(
    p => p.difficulty === "Easy"
  ).length;

  const medium = problems.filter(
    p => p.difficulty === "Medium"
  ).length;

  const hard = problems.filter(
    p => p.difficulty === "Hard"
  ).length;

  totalSolved.textContent = problems.length;
  easySolved.textContent = easy;
  mediumSolved.textContent = medium;
  hardSolved.textContent = hard;

  updateCharts(easy, medium, hard);

}

/* FORM */

form.addEventListener("submit", (e)=>{

  e.preventDefault();

  const name =
    document.getElementById("problemName").value;

  const difficulty =
    document.getElementById("difficulty").value;

  problems.push({
    name,
    difficulty
  });

  streak++;

  localStorage.setItem(
    "leetcodeProblems",
    JSON.stringify(problems)
  );

  localStorage.setItem(
    "leetcodeStreak",
    streak
  );

  streakCount.textContent = streak;

  renderProblems();
  updateStats();

  form.reset();

});

/* CHARTS */

const difficultyCtx =
  document.getElementById("difficultyChart");

const progressCtx =
  document.getElementById("progressChart");

let difficultyChart;
let progressChart;

function updateCharts(easy, medium, hard){

  if(difficultyChart){
    difficultyChart.destroy();
  }

  difficultyChart = new Chart(
    difficultyCtx,
    {

      type:"doughnut",

      data:{

        labels:["Easy","Medium","Hard"],

        datasets:[{

          data:[easy,medium,hard],

          backgroundColor:[
            "#22c55e",
            "#f59e0b",
            "#ef4444"
          ]

        }]

      }

    }
  );

  if(progressChart){
    progressChart.destroy();
  }

  progressChart = new Chart(
    progressCtx,
    {

      type:"line",

      data:{

        labels:[
          "Mon","Tue","Wed",
          "Thu","Fri","Sat","Sun"
        ],

        datasets:[{

          label:"Problems Solved",

          data:[2,4,3,5,6,4,7],

          borderColor:"#3b82f6",

          backgroundColor:
            "rgba(59,130,246,0.15)",

          fill:true,

          tension:0.4

        }]

      }

    }
  );

}

renderProblems();
updateStats();