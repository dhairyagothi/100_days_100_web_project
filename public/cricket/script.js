let score;
let scorestr = localStorage.getItem('SCORE');

// --- FIXED LOGIC FOR INITIAL LOAD ---
// If a score exists in localStorage, parse it. Otherwise, initialize a fresh one.
if (scorestr) {
  score = JSON.parse(scorestr);
  // Re-attach the display function to the parsed object
  score.display_results = function () {
    return `<br>Won: ${score.win}<br><span style="color:red"> Lost: ${score.lost}</span><br> Tie: ${score.tie} <br> <span style="color:purple;">Total Games: ${score.win + score.lost + score.tie}</span>`;
  };
} else {
  resetscore();
}

function resetscore() {
  // Explicitly reset the score to 0
  score = {
    win: 0,
    lost: 0,
    tie: 0,
  };
  score.display_results = function () {
    return `<br>Won: ${score.win}<br><span style="color:red"> Lost: ${score.lost}</span><br> Tie: ${score.tie} <br> <span style="color:purple;">Total Games: ${score.win + score.lost + score.tie}</span>`;
  };
  // Save the reset score back to localStorage
  localStorage.setItem('SCORE', JSON.stringify(score));
}

// --- NEW FUNCTION FOR THE RESET BUTTON ---
function handleResetButton() {
  resetscore(); // Resets the data structures & localStorage

  // Clear the UI elements immediately so old results disappear
  document.querySelector('#user-move').innerHTML = '';
  document.querySelector('#computer-move').innerHTML = '';
  document.querySelector('#result').innerHTML = '';
  document.querySelector('#score').innerHTML = score.display_results();
}

function computergeneratechoice() {
  let randomnum = Math.random() * 3;
  if (randomnum > 0 && randomnum <= 1) {
    return 'Bat';
  } else if (randomnum > 1 && randomnum <= 2) {
    return 'Ball';
  } else {
    return 'stump';
  }
}

function choiceimage(choice) {
  if (choice === 'Bat') {
    return '<div style="display: flex; justify-content: center; align-items: center; height: 100px;"><img src="bat.jpeg" alt="Bat" class="game-image" style="width: 80px; height: 80px;"></div>';
  } else if (choice === 'Ball') {
    return '<div style="display: flex; justify-content: center; align-items: center; height: 100px;"><img src="ball.jpeg" alt="Ball" class="game-image" style="width: 80px; height: 80px;"></div>';
  } else if (choice === 'stump') {
    return '<div style="display: flex; justify-content: center; align-items: center; height: 100px;"><img src="wickets.jpeg" alt="Stump" class="game-image" style="width: 80px; height: 80px;"></div>';
  }
  return '';
}

function getresult(usermove, cmpchoice) {
  let resultMessage = '';
  if (usermove === 'Bat') {
    if (cmpchoice === 'Bat') {
      score.tie += 1;
      resultMessage = ` It's a tie.`;
    } else if (cmpchoice === 'Ball') {
      score.win++;
      resultMessage = ` User won.`;
    } else {
      score.lost++;
      resultMessage = `Computer won.`;
    }
  } else if (usermove === 'Ball') {
    if (cmpchoice === 'Ball') {
      score.tie += 1;
      resultMessage = ` It's a tie.`;
    } else if (cmpchoice === 'Bat') {
      score.lost += 1;
      resultMessage = `Computer won.`;
    } else {
      score.win += 1;
      resultMessage = ` User won.`;
    }
  } else if (usermove === 'stump') {
    if (cmpchoice === 'stump') {
      score.tie += 1;
      resultMessage = ` It's a tie.`;
    } else if (cmpchoice === 'Ball') {
      score.lost += 1;
      resultMessage = ` Computer won.`;
    } else {
      score.win += 1;
      resultMessage = `User won.`;
    }
  }
  return `<span style="color:gold">${resultMessage}</span>`;
}

function showresult(usermove, cmpchoice) {
  let result = getresult(usermove, cmpchoice);
  localStorage.setItem('SCORE', JSON.stringify(score));

  document.querySelector('#user-move').innerHTML =
    `User chose: ${choiceimage(usermove)}`;
  document.querySelector('#computer-move').innerHTML =
    `Computer chose: ${choiceimage(cmpchoice)}`;
  document.querySelector('#result').innerHTML = result;
  document.querySelector('#score').innerHTML = `${score.display_results()}`;
}
