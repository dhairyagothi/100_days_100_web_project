let score = JSON.parse(
  localStorage.getItem("SCORE")
) || {

  win: 0,
  lost: 0,
  tie: 0

};

const choices = [
  "Bat",
  "Ball",
  "stump"
];

function saveScore() {

  localStorage.setItem(
    "SCORE",
    JSON.stringify(score)
  );

}

function displayResults() {

  return `

    <div class="score-item">
      Wins
      <span>${score.win}</span>
    </div>

    <div class="score-item">
      Losses
      <span>${score.lost}</span>
    </div>

    <div class="score-item">
      Ties
      <span>${score.tie}</span>
    </div>

    <div class="score-item total-games">
      Total Games
      <span>
        ${score.win + score.lost + score.tie}
      </span>
    </div>

  `;
}

function resetscore() {

  score = {

    win: 0,
    lost: 0,
    tie: 0

  };

  saveScore();

  document.querySelector(
    "#score"
  ).innerHTML =
    displayResults();

  document.querySelector(
    "#user-move"
  ).innerHTML = "";

  document.querySelector(
    "#computer-move"
  ).innerHTML = "";

  document.querySelector(
    "#result"
  ).innerHTML = `
    <div class="result-text">
      Score Reset Successfully
    </div>
  `;
}

function computergeneratechoice() {

  const randomIndex =
    Math.floor(
      Math.random() * choices.length
    );

  return choices[randomIndex];

}

function choiceimage(choice) {

  const images = {

    Bat: "./bat.jpeg",

    Ball: "./ball.jpeg",

    stump: "./wickets.jpeg"

  };

  return `

    <div class="choice-container">

      <img
        src="${images[choice]}"
        alt="${choice}"
        class="game_image"
      >

    </div>

  `;
}

function getresult(
  usermove,
  cmpchoice
) {

  if (
    usermove === cmpchoice
  ) {

    score.tie++;

    return "🤝 It's a Tie!";

  }

  const winningConditions = {

    Bat: "Ball",

    Ball: "stump",

    stump: "Bat"

  };

  if (
    winningConditions[usermove] ===
    cmpchoice
  ) {

    score.win++;

    return "🎉 You Won!";

  }

  score.lost++;

  return "💻 Computer Won!";

}

function showresult(
  usermove,
  cmpchoice
) {

  const result =
    getresult(
      usermove,
      cmpchoice
    );

  saveScore();

  document.querySelector(
    "#user-move"
  ).innerHTML = `

    <h3>Your Move</h3>

    ${choiceimage(usermove)}

    <p>${usermove}</p>

  `;

  document.querySelector(
    "#computer-move"
  ).innerHTML = `

    <h3>Computer Move</h3>

    ${choiceimage(cmpchoice)}

    <p>${cmpchoice}</p>

  `;

  document.querySelector(
    "#result"
  ).innerHTML = `

    <div class="result-text">

      ${result}

    </div>

  `;

  document.querySelector(
    "#score"
  ).innerHTML =
    displayResults();

}

document.querySelector(
  "#score"
).innerHTML =
  displayResults();
function playGame(usermove) {

  const computerchoice =
    computergeneratechoice();

  showresult(
    usermove,
    computerchoice
  );

}