// =========================================
// THEME TOGGLE
// =========================================

const themeToggle =
  document.getElementById("themeToggle");

const body = document.body;

if (
  localStorage.getItem("theme") === "light"
){
  body.classList.add("light-mode");

  themeToggle.textContent =
    "☀️ Light Mode";
}

themeToggle.addEventListener(
  "click",
  () => {

    body.classList.toggle(
      "light-mode"
    );

    const isLight =
      body.classList.contains(
        "light-mode"
      );

    themeToggle.textContent =
      isLight
        ? "☀️ Light Mode"
        : "🌙 Dark Mode";

    localStorage.setItem(
      "theme",
      isLight
        ? "light"
        : "dark"
    );
  }
);

// =========================================
// ELEMENTS
// =========================================

const modeButtons =
  document.querySelectorAll(
    ".mode-btn"
  );

const gameAreas =
  document.querySelectorAll(
    ".game-area"
  );

const gameTitle =
  document.getElementById(
    "gameTitle"
  );

const gameDescription =
  document.getElementById(
    "gameDescription"
  );

const difficultyBadge =
  document.getElementById(
    "difficultyBadge"
  );

// =========================================
// CLASSIC GAME ELEMENTS
// =========================================

const actionBtn =
  document.getElementById(
    "actionBtn"
  );

const countdownText =
  document.getElementById(
    "countdownText"
  );

const redLight =
  document.getElementById(
    "redLight"
  );

const orangeLight =
  document.getElementById(
    "orangeLight"
  );

const greenLight =
  document.getElementById(
    "greenLight"
  );

// =========================================
// COLOR MATCH ELEMENTS
// =========================================

const colorBox =
  document.getElementById(
    "colorBox"
  );

const colorInstruction =
  document.getElementById(
    "colorInstruction"
  );

const colorStartBtn =
  document.getElementById(
    "colorStartBtn"
  );

// =========================================
// TARGET GAME ELEMENTS
// =========================================

const targetCircle =
  document.getElementById(
    "targetCircle"
  );

const targetBoard =
  document.getElementById(
    "targetBoard"
  );

const targetStartBtn =
  document.getElementById(
    "targetStartBtn"
  );

const targetScore =
  document.getElementById(
    "targetScore"
  );

// =========================================
// MEMORY GAME ELEMENTS
// =========================================

const memoryCards =
  document.querySelectorAll(
    ".memory-card"
  );

const memoryStatus =
  document.getElementById(
    "memoryStatus"
  );

const memoryStartBtn =
  document.getElementById(
    "memoryStartBtn"
  );

// =========================================
// SIDE PANEL
// =========================================

const leaderboard =
  document.getElementById(
    "leaderboard"
  );

const historyList =
  document.getElementById(
    "historyList"
  );

const achievementsGrid =
  document.getElementById(
    "achievementsGrid"
  );

const toastContainer =
  document.getElementById(
    "toastContainer"
  );

// =========================================
// BENCHMARK MODAL
// =========================================

const benchmarkModal =
  document.getElementById(
    "benchmarkModal"
  );

const benchmarkClose =
  document.getElementById(
    "benchmarkClose"
  );

// =========================================
// GAME DATA
// =========================================

let currentGame =
  "classic";

let gameActive =
  false;

let waitingForClick =
  false;

let gameStartTime =
  0;

let targetHits =
  0;

let targetRounds =
  5;

let targetTimes =
  [];

let memoryPattern =
  [];

let memoryPlayer =
  [];

let memoryStep =
  0;

// =========================================
// STORAGE
// =========================================

const savedData = {

  scores:
    JSON.parse(
      localStorage.getItem(
        "reactionScores"
      )
    ) || [],

  history:
    JSON.parse(
      localStorage.getItem(
        "reactionHistory"
      )
    ) || [],

  stats:
    JSON.parse(
      localStorage.getItem(
        "reactionStats"
      )
    ) || {

      totalTests:0,
      bestTime:Infinity,
      totalTime:0,
      excellentCount:0
    },

  achievements:
    JSON.parse(
      localStorage.getItem(
        "reactionAchievements"
      )
    ) || {}
};

// =========================================
// ACHIEVEMENTS
// =========================================

const ACHIEVEMENTS = [

  {
    id:"first",
    icon:"🎯",
    name:"First Test"
  },

  {
    id:"fast",
    icon:"⚡",
    name:"Under 300ms"
  },

  {
    id:"elite",
    icon:"🏎️",
    name:"Under 200ms"
  },

  {
    id:"consistent",
    icon:"🔥",
    name:"10 Games"
  }
];

// =========================================
// GAME SWITCHING
// =========================================

modeButtons.forEach(btn => {

  btn.addEventListener(
    "click",
    () => {

      modeButtons.forEach(
        b => b.classList.remove(
          "active"
        )
      );

      btn.classList.add(
        "active"
      );

      const mode =
        btn.dataset.mode;

      switchGame(mode);
    }
  );
});

function switchGame(mode){

  currentGame = mode;

  gameAreas.forEach(area => {

    area.classList.add(
      "hidden"
    );
  });

  document
    .getElementById(
      mode + "Game"
    )
    .classList.remove(
      "hidden"
    );

  if(mode === "classic"){

    gameTitle.textContent =
      "Classic F1 Reaction";

    gameDescription.textContent =
      "Wait for green light and click instantly.";

    difficultyBadge.textContent =
      "Medium";
  }

  else if(mode === "color"){

    gameTitle.textContent =
      "Color Match Challenge";

    gameDescription.textContent =
      "Click only when target color appears.";

    difficultyBadge.textContent =
      "Hard";
  }

  else if(mode === "target"){

    gameTitle.textContent =
      "Moving Target Challenge";

    gameDescription.textContent =
      "Hit targets as quickly as possible.";

    difficultyBadge.textContent =
      "Very Hard";
  }

  else if(mode === "memory"){

    gameTitle.textContent =
      "Memory Reflex";

    gameDescription.textContent =
      "Memorize and repeat the pattern.";

    difficultyBadge.textContent =
      "Expert";
  }
}

// =========================================
// TOAST
// =========================================

function showToast(
  icon,
  title,
  message
){

  const toast =
    document.createElement(
      "div"
    );

  toast.className =
    "toast";

  toast.innerHTML = `
    <span class="toast-icon">
      ${icon}
    </span>

    <div class="toast-text">
      <strong>${title}</strong>
      <span>${message}</span>
    </div>
  `;

  toastContainer.appendChild(
    toast
  );

  setTimeout(() => {

    toast.classList.add(
      "fade-out"
    );

    setTimeout(() => {

      toast.remove();

    },300);

  },3500);
}

// =========================================
// CLASSIC GAME
// =========================================

function clearLights(){

  redLight.classList.remove(
    "red"
  );

  orangeLight.classList.remove(
    "orange"
  );

  greenLight.classList.remove(
    "green"
  );
}

function startClassicGame(){

  gameActive = true;

  actionBtn.disabled = true;

  clearLights();

  let countdown = 3;

  countdownText.textContent =
    countdown;

  const interval =
    setInterval(() => {

      if(countdown === 3){

        redLight.classList.add(
          "red"
        );
      }

      else if(countdown === 2){

        redLight.classList.remove(
          "red"
        );

        orangeLight.classList.add(
          "orange"
        );
      }

      else if(countdown === 1){

        orangeLight.classList.remove(
          "orange"
        );
      }

      countdown--;

      if(countdown >= 0){

        countdownText.textContent =
          countdown || "GO!";
      }

      if(countdown < 0){

        clearInterval(interval);

        greenLight.classList.add(
          "green"
        );

        actionBtn.disabled =
          false;

        actionBtn.classList.add(
          "green-mode"
        );

        actionBtn.textContent =
          "CLICK!";

        gameStartTime =
          Date.now();

        waitingForClick =
          true;
      }

    },1000);
}

actionBtn.addEventListener(
  "click",
  () => {

    if(!gameActive){

      startClassicGame();
    }

    else if(waitingForClick){

      const reactionTime =
        Date.now() -
        gameStartTime;

      finishGame(
        reactionTime
      );

      clearLights();

      actionBtn.classList.remove(
        "green-mode"
      );

      actionBtn.textContent =
        "Start Again";

      waitingForClick =
        false;

      gameActive =
        false;
    }
  }
);

// =========================================
// COLOR MATCH GAME
// =========================================

const COLORS = [

  "RED",
  "BLUE",
  "GREEN",
  "YELLOW"
];

const COLOR_VALUES = {

  RED:"#ef4444",
  BLUE:"#3b82f6",
  GREEN:"#22c55e",
  YELLOW:"#facc15"
};

let colorTarget = "";

colorStartBtn.addEventListener(
  "click",
  startColorGame
);

function startColorGame(){

  colorInstruction.textContent =
    "Wait for GREEN";

  colorBox.textContent =
    "WAIT";

  colorBox.style.background =
    "#374151";

  colorStartBtn.disabled =
    true;

  const delay =
    Math.random() * 3000 + 2000;

  setTimeout(() => {

    colorTarget =
      COLORS[
        Math.floor(
          Math.random() *
          COLORS.length
        )
      ];

    colorBox.textContent =
      colorTarget;

    colorBox.style.background =
      COLOR_VALUES[
        colorTarget
      ];

    gameStartTime =
      Date.now();

    colorInstruction.textContent =
      `CLICK if ${colorTarget}`;

    colorBox.onclick =
      () => {

        const reactionTime =
          Date.now() -
          gameStartTime;

        finishGame(
          reactionTime
        );

        colorStartBtn.disabled =
          false;

        colorBox.onclick =
          null;
      };

  },delay);
}

// =========================================
// TARGET GAME
// =========================================

targetStartBtn.addEventListener(
  "click",
  startTargetGame
);

function startTargetGame(){

  targetHits = 0;

  targetTimes = [];

  targetScore.textContent =
    "0 / 5";

  targetStartBtn.disabled =
    true;

  spawnTarget();
}

function spawnTarget(){

  const boardWidth =
    targetBoard.clientWidth;

  const boardHeight =
    targetBoard.clientHeight;

  const x =
    Math.random() *
    (boardWidth - 80);

  const y =
    Math.random() *
    (boardHeight - 80);

  targetCircle.style.left =
    `${x}px`;

  targetCircle.style.top =
    `${y}px`;

  targetCircle.style.display =
    "block";

  gameStartTime =
    Date.now();
}

targetCircle.addEventListener(
  "click",
  () => {

    const reactionTime =
      Date.now() -
      gameStartTime;

    targetTimes.push(
      reactionTime
    );

    targetHits++;

    targetScore.textContent =
      `${targetHits} / 5`;

    if(
      targetHits >=
      targetRounds
    ){

      targetCircle.style.display =
        "none";

      const avg =
        Math.round(
          targetTimes.reduce(
            (a,b)=>a+b,
            0
          ) /
          targetTimes.length
        );

      finishGame(avg);

      targetStartBtn.disabled =
        false;

      return;
    }

    spawnTarget();
  }
);

// =========================================
// MEMORY GAME
// =========================================

memoryStartBtn.addEventListener(
  "click",
  startMemoryGame
);

function startMemoryGame(){

  memoryPattern = [];

  memoryPlayer = [];

  memoryStep = 0;

  memoryStatus.textContent =
    "Memorize the pattern";

  generateMemoryPattern();

  playPattern();
}

function generateMemoryPattern(){

  for(let i=0;i<4;i++){

    memoryPattern.push(
      Math.floor(
        Math.random() * 4
      )
    );
  }
}

function playPattern(){

  let i = 0;

  const interval =
    setInterval(() => {

      if(i > 0){

        memoryCards[
          memoryPattern[i - 1]
        ].classList.remove(
          "active"
        );
      }

      if(
        i ===
        memoryPattern.length
      ){

        clearInterval(
          interval
        );

        memoryStatus.textContent =
          "Repeat the pattern";

        return;
      }

      memoryCards[
        memoryPattern[i]
      ].classList.add(
        "active"
      );

      i++;

    },700);
}

memoryCards.forEach(
  (card,index) => {

    card.addEventListener(
      "click",
      () => {

        if(
          memoryPattern.length === 0
        ) return;

        memoryPlayer.push(
          index
        );

        card.classList.add(
          "active"
        );

        setTimeout(() => {

          card.classList.remove(
            "active"
          );

        },200);

        if(
          memoryPlayer[
            memoryStep
          ] !==
          memoryPattern[
            memoryStep
          ]
        ){

          memoryStatus.textContent =
            "Wrong Pattern";

          showToast(
            "❌",
            "Failed",
            "Wrong sequence"
          );

          memoryPattern = [];

          return;
        }

        memoryStep++;

        if(
          memoryStep ===
          memoryPattern.length
        ){

          const score =
            Math.floor(
              Math.random() * 100
            ) + 150;

          finishGame(score);

          memoryStatus.textContent =
            "Perfect Memory!";

          memoryPattern = [];
        }
      }
    );
  }
);

// =========================================
// FINISH GAME
// =========================================

function finishGame(
  reactionTime
){

  updateStats(
    reactionTime
  );

  updateLeaderboard(
    reactionTime
  );

  updateHistory(
    reactionTime
  );

  checkAchievements(
    reactionTime
  );

  renderStats();

  renderHistory();

  renderAchievements();

  showBenchmarkModal(
    reactionTime
  );
}

// =========================================
// BENCHMARK MODAL
// =========================================

function showBenchmarkModal(
  reactionTime
){

  let rating =
    "Beginner";

  let className =
    "rating-beginner";

  if(
    reactionTime < 200
  ){

    rating =
      "Elite";

    className =
      "rating-elite";
  }

  else if(
    reactionTime < 250
  ){

    rating =
      "Fast";

    className =
      "rating-fast";
  }

  else if(
    reactionTime < 300
  ){

    rating =
      "Average";

    className =
      "rating-average";
  }

  document.getElementById(
    "benchmarkTime"
  ).textContent =
    `${reactionTime} ms`;

  const ratingEl =
    document.getElementById(
      "benchmarkRating"
    );

  ratingEl.textContent =
    rating;

  ratingEl.className =
    `benchmark-rating ${className}`;

  document.getElementById(
    "benchmarkCompare"
  ).innerHTML = `
    <div class="benchmark-compare-item">
      <span>👤 Average Human</span>
      <strong>250ms</strong>
    </div>

    <div class="benchmark-compare-item">
      <span>🎮 Pro Gamer</span>
      <strong>200ms</strong>
    </div>

    <div class="benchmark-compare-item">
      <span>🏎️ F1 Driver</span>
      <strong>180ms</strong>
    </div>
  `;

  benchmarkModal.classList.add(
    "active"
  );
}

benchmarkClose.addEventListener(
  "click",
  () => {

    benchmarkModal.classList.remove(
      "active"
    );
  }
);

// =========================================
// STATS
// =========================================

function updateStats(
  reactionTime
){

  savedData.stats.totalTests++;

  savedData.stats.totalTime +=
    reactionTime;

  if(
    reactionTime <
    savedData.stats.bestTime
  ){

    savedData.stats.bestTime =
      reactionTime;
  }

  if(
    reactionTime < 200
  ){

    savedData.stats.excellentCount++;
  }

  localStorage.setItem(
    "reactionStats",
    JSON.stringify(
      savedData.stats
    )
  );
}

function renderStats(){

  document.getElementById(
    "totalTests"
  ).textContent =
    savedData.stats.totalTests;

  document.getElementById(
    "bestTime"
  ).textContent =
    savedData.stats.bestTime ===
    Infinity
      ? "-"
      : `${savedData.stats.bestTime} ms`;

  const avg =
    savedData.stats.totalTests > 0

      ? Math.round(
          savedData.stats.totalTime /
          savedData.stats.totalTests
        )

      : "-";

  document.getElementById(
    "avgTime"
  ).textContent =
    avg === "-"
      ? "-"
      : `${avg} ms`;

  document.getElementById(
    "excellentCount"
  ).textContent =
    savedData.stats.excellentCount;
}

// =========================================
// LEADERBOARD
// =========================================

function updateLeaderboard(
  reactionTime
){

  savedData.scores.push(
    reactionTime
  );

  savedData.scores.sort(
    (a,b)=>a-b
  );

  savedData.scores =
    savedData.scores.slice(
      0,
      5
    );

  localStorage.setItem(
    "reactionScores",
    JSON.stringify(
      savedData.scores
    )
  );

  renderLeaderboard();
}

function renderLeaderboard(){

  leaderboard.innerHTML = "";

  if(
    savedData.scores.length === 0
  ){

    leaderboard.innerHTML = `
      <div class="empty-slot">
        No scores yet
      </div>
    `;

    return;
  }

  savedData.scores.forEach(
    (score,index) => {

      const item =
        document.createElement(
          "div"
        );

      item.className =
        "leaderboard-item";

      item.innerHTML = `
        <div class="rank">
          #${index + 1}
        </div>

        <div class="score-value">
          ${score} ms
        </div>
      `;

      leaderboard.appendChild(
        item
      );
    }
  );
}

// =========================================
// HISTORY
// =========================================

function updateHistory(
  reactionTime
){

  savedData.history.unshift({

    time:reactionTime,

    timestamp:
      Date.now()
  });

  savedData.history =
    savedData.history.slice(
      0,
      10
    );

  localStorage.setItem(
    "reactionHistory",
    JSON.stringify(
      savedData.history
    )
  );
}

function renderHistory(){

  historyList.innerHTML = "";

  if(
    savedData.history.length === 0
  ){

    historyList.innerHTML = `
      <div class="empty-slot">
        No tests yet
      </div>
    `;

    return;
  }

  savedData.history.forEach(
    item => {

      let rating =
        "Beginner";

      let className =
        "rating-beginner";

      if(item.time < 200){

        rating = "Elite";

        className =
          "rating-elite";
      }

      else if(
        item.time < 250
      ){

        rating = "Fast";

        className =
          "rating-fast";
      }

      else if(
        item.time < 300
      ){

        rating = "Average";

        className =
          "rating-average";
      }

      const div =
        document.createElement(
          "div"
        );

      div.className =
        "history-item";

      div.innerHTML = `
        <div>
          <div class="history-time">
            ${item.time} ms
          </div>

          <div class="history-timestamp">
            ${new Date(
              item.timestamp
            ).toLocaleTimeString()}
          </div>
        </div>

        <div class="history-rating ${className}">
          ${rating}
        </div>
      `;

      historyList.appendChild(
        div
      );
    }
  );
}

// =========================================
// ACHIEVEMENTS
// =========================================

function checkAchievements(
  reactionTime
){

  if(
    !savedData.achievements.first
  ){

    savedData.achievements.first =
      true;

    showToast(
      "🎯",
      "Achievement",
      "First Test"
    );
  }

  if(
    reactionTime < 300 &&
    !savedData.achievements.fast
  ){

    savedData.achievements.fast =
      true;

    showToast(
      "⚡",
      "Achievement",
      "Under 300ms"
    );
  }

  if(
    reactionTime < 200 &&
    !savedData.achievements.elite
  ){

    savedData.achievements.elite =
      true;

    showToast(
      "🏎️",
      "Achievement",
      "Elite Reflex"
    );
  }

  if(
    savedData.stats.totalTests >= 10 &&
    !savedData.achievements.consistent
  ){

    savedData.achievements.consistent =
      true;

    showToast(
      "🔥",
      "Achievement",
      "10 Games Completed"
    );
  }

  localStorage.setItem(
    "reactionAchievements",
    JSON.stringify(
      savedData.achievements
    )
  );
}

function renderAchievements(){

  achievementsGrid.innerHTML =
    "";

  ACHIEVEMENTS.forEach(
    ach => {

      const unlocked =
        savedData.achievements[
          ach.id
        ];

      const div =
        document.createElement(
          "div"
        );

      div.className =
        `achievement-badge ${
          unlocked
            ? "unlocked"
            : ""
        }`;

      div.innerHTML = `
        <div class="achievement-icon">
          ${ach.icon}
        </div>

        <div class="achievement-name">
          ${ach.name}
        </div>
      `;

      achievementsGrid.appendChild(
        div
      );
    }
  );

  const unlockedCount =
    Object.values(
      savedData.achievements
    ).filter(Boolean).length;

  document.getElementById(
    "unlockedAchievements"
  ).textContent =
    unlockedCount;

  document.getElementById(
    "achievementProgress"
  ).style.width =
    `${
      (unlockedCount /
      ACHIEVEMENTS.length) *
      100
    }%`;
}

// =========================================
// INIT
// =========================================

renderLeaderboard();

renderHistory();

renderStats();

renderAchievements();