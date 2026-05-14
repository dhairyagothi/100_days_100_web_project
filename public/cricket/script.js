
let score = JSON.parse(
  localStorage.getItem("SCORE")
) || {
  win: 0,
  lost: 0,
  tie: 0
};

score.display_results = function () {

  return `
    <br>
    Won: ${this.win}
    <br>

    <span style="color:red">
      Lost: ${this.lost}
    </span>

    <br>

    Tie: ${this.tie}

    <br>

    <span style="color:purple;">
      Total Games:
      ${this.win + this.lost + this.tie}
    </span>
  `;
};

function resetscore() {

  score.win = 0;
  score.lost = 0;
  score.tie = 0;

  localStorage.setItem(
    "SCORE",
    JSON.stringify(score)
  );

  document.querySelector(
    "#score"
  ).innerHTML =
    score.display_results();

}

function computergeneratechoice() {

  const randomnum =
    Math.random() * 3;

  if (
    randomnum > 0 &&
    randomnum <= 1
  ) {

    return "Bat";

  }

  else if (
    randomnum > 1 &&
    randomnum <= 2
  ) {

    return "Ball";

  }

  else {

    return "stump";

  }

}

function choiceimage(choice) {

  if (choice === "Bat") {

    return `
      <div class="choice-container">

        <img
          src="./bat.jpeg"
          alt="Bat"
          class="game-image"
        >

      </div>
    `;

  }

  else if (choice === "Ball") {

    return `
      <div class="choice-container">

        <img
          src="./ball.jpeg"
          alt="Ball"
          class="game-image"
        >

      </div>
    `;

  }

  else if (choice === "stump") {

    return `
      <div class="choice-container">

        <img
          src="./wickets.jpeg"
          alt="Stump"
          class="game-image"
        >

      </div>
    `;

  }

  return "";

}

function getresult(
  usermove,
  cmpchoice
) {

  let resultMessage = "";

  if (usermove === "Bat") {

    if (cmpchoice === "Bat") {

      score.tie++;

      resultMessage =
        "It's a tie.";

    }

    else if (
      cmpchoice === "Ball"
    ) {

      score.win++;

      resultMessage =
        "User won.";

    }

    else {

      score.lost++;

      resultMessage =
        "Computer won.";

    }

  }

  else if (
    usermove === "Ball"
  ) {

    if (
      cmpchoice === "Ball"
    ) {

      score.tie++;

      resultMessage =
        "It's a tie.";

    }

    else if (
      cmpchoice === "Bat"
    ) {

      score.lost++;

      resultMessage =
        "Computer won.";

    }

    else {

      score.win++;

      resultMessage =
        "User won.";

    }

  }

  else if (
    usermove === "stump"
  ) {

    if (
      cmpchoice === "stump"
    ) {

      score.tie++;

      resultMessage =
        "It's a tie.";

    }

    else if (
      cmpchoice === "Ball"
    ) {

      score.lost++;

      resultMessage =
        "Computer won.";

    }

    else {

      score.win++;

      resultMessage =
        "User won.";

    }

  }

  return `
    <span style="color:gold">
      ${resultMessage}
    </span>
  `;

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

  localStorage.setItem(
    "SCORE",
    JSON.stringify(score)
  );

  document.querySelector(
    "#user-move"
  ).innerHTML = `
    User chose:
    ${choiceimage(usermove)}
  `;

  document.querySelector(
    "#computer-move"
  ).innerHTML = `
    Computer chose:
    ${choiceimage(cmpchoice)}
  `;

  document.querySelector(
    "#result"
  ).innerHTML = result;

  document.querySelector(
    "#score"
  ).innerHTML =
    score.display_results();

}

document.querySelector(
  "#score"
).innerHTML =
  score.display_results();

