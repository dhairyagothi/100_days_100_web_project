let great = 1;
let good = 0;
let neutral = 1;
let bad = 0;

const chartData = document.getElementById("chartData");
const jar = document.querySelector(".jar");

function updateUI() {

  document.getElementById("greatCount").innerText = great;
  document.getElementById("goodCount").innerText = good;
  document.getElementById("neutralCount").innerText = neutral;
  document.getElementById("badCount").innerText = bad;

  const total = great + good + neutral + bad;

  document.getElementById("totalEntries").innerText =
    total + " mood entries this month";

  if (great >= good && great >= neutral && great >= bad) {
    document.getElementById("mainMood").innerText = "Great 😊";
  }

  else if (good >= great && good >= neutral && good >= bad) {
    document.getElementById("mainMood").innerText = "Good 😄";
  }

  else if (neutral >= great && neutral >= good && neutral >= bad) {
    document.getElementById("mainMood").innerText = "Neutral 😐";
  }

  else {
    document.getElementById("mainMood").innerText = "Bad 😢";
  }
}

function createBall(emoji, color) {

  const mood = document.createElement("div");

  mood.classList.add("mood-ball");

  mood.innerHTML = emoji;

  mood.style.background = color;

  mood.style.left = Math.random() * 240 + "px";

  mood.style.bottom = Math.random() * 280 + 20 + "px";

  mood.style.animation = `
    float ${2 + Math.random() * 2}s ease-in-out infinite
  `;

  jar.appendChild(mood);

  mood.animate(
    [
      {
        transform: "scale(0)",
        opacity: 0
      },

      {
        transform: "scale(1)",
        opacity: 1
      }
    ],
    {
      duration: 500
    }
  );
}

function addChartEmoji(emoji) {

  const item = document.createElement("span");

  item.innerHTML = emoji;

  item.animate(
    [
      {
        transform: "translateY(20px)",
        opacity: 0
      },

      {
        transform: "translateY(0px)",
        opacity: 1
      }
    ],
    {
      duration: 400
    }
  );

  chartData.appendChild(item);
}

function addMood(type) {

  if (type === "great") {

    great++;

    createBall("😊", "#ffb347");

    addChartEmoji("😊");
  }

  if (type === "good") {

    good++;

    createBall("😄", "#7dff7d");

    addChartEmoji("😄");
  }

  if (type === "neutral") {

    neutral++;

    createBall("😐", "#70d6ff");

    addChartEmoji("😐");
  }

  if (type === "bad") {

    bad++;

    createBall("😢", "#b799ff");

    addChartEmoji("😢");
  }

  updateUI();

  saveData();
}

function saveData() {

  const data = {
    great,
    good,
    neutral,
    bad,
    chart: chartData.innerHTML,
    jar: jar.innerHTML
  };

  localStorage.setItem(
    "moodTrackerData",
    JSON.stringify(data)
  );
}

function loadData() {

  const saved = JSON.parse(
    localStorage.getItem("moodTrackerData")
  );

  if (!saved) return;

  great = saved.great;
  good = saved.good;
  neutral = saved.neutral;
  bad = saved.bad;

  chartData.innerHTML = saved.chart;
  jar.innerHTML = saved.jar;

  updateUI();
}

loadData();
updateUI();