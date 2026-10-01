let score;
let scorestr = localStorage.getItem('SCORE');

// Define the modern grid display function
const getScoreDashboardHtml = () => {
  return `
    <div class="score-grid">
      <div class="score-card win">
        <span class="score-label">Won</span>
        <span class="score-value">${score.win}</span>
      </div>
      <div class="score-card lost">
        <span class="score-label">Lost</span>
        <span class="score-value">${score.lost}</span>
      </div>
      <div class="score-card tie">
        <span class="score-label">Tie</span>
        <span class="score-value">${score.tie}</span>
      </div>
      <div class="score-card total">
        <span class="score-label">Total</span>
        <span class="score-value">${score.win + score.lost + score.tie}</span>
      </div>
    </div>
  `;
};

// If a score exists in localStorage, parse it. Otherwise, initialize a fresh one.
if (scorestr) {
  score = JSON.parse(scorestr);
  score.display_results = getScoreDashboardHtml;
} else {
  resetscore();
}

function resetscore() {
  score = {
    win: 0,
    lost: 0,
    tie: 0,
  };
  score.display_results = getScoreDashboardHtml;
  localStorage.setItem('SCORE', JSON.stringify(score));
}

// --- RESET BUTTON HANDLER ---
function handleResetButton() {
  localStorage.clear();
  resetscore();

  // Reset the UI elements and transitions
  document.querySelector('#user-move').innerHTML = '';
  document.querySelector('#computer-move').innerHTML = '';
  document.querySelector('#result').innerHTML = '';
  document.querySelector('#score').innerHTML = score.display_results();
  
  const matchup = document.querySelector('.matchup-container');
  if (matchup) {
    matchup.classList.remove('active');
  }
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
  let imgSrc = '';
  if (choice === 'Bat') {
    imgSrc = 'bat.jpeg';
  } else if (choice === 'Ball') {
    imgSrc = 'ball.jpeg';
  } else if (choice === 'stump') {
    imgSrc = 'wickets.jpeg';
  }
  
  return `
    <div class="choice-container">
      <img src="${imgSrc}" alt="${choice}" class="choice-image">
    </div>
  `;
}

function getresult(usermove, cmpchoice) {
  let resultMessage = '';
  let resultClass = '';

  if (usermove === 'Bat') {
    if (cmpchoice === 'Bat') {
      score.tie += 1;
      resultMessage = "It's a tie! 🤝";
      resultClass = 'tie';
    } else if (cmpchoice === 'Ball') {
      score.win++;
      resultMessage = 'You Won! 🎉';
      resultClass = 'win';
    } else {
      score.lost++;
      resultMessage = 'Computer Won! 🤖';
      resultClass = 'lost';
    }
  } else if (usermove === 'Ball') {
    if (cmpchoice === 'Ball') {
      score.tie += 1;
      resultMessage = "It's a tie! 🤝";
      resultClass = 'tie';
    } else if (cmpchoice === 'Bat') {
      score.lost += 1;
      resultMessage = 'Computer Won! 🤖';
      resultClass = 'lost';
    } else {
      score.win += 1;
      resultMessage = 'You Won! 🎉';
      resultClass = 'win';
    }
  } else if (usermove === 'stump') {
    if (cmpchoice === 'stump') {
      score.tie += 1;
      resultMessage = "It's a tie! 🤝";
      resultClass = 'tie';
    } else if (cmpchoice === 'Ball') {
      score.lost += 1;
      resultMessage = 'Computer Won! 🤖';
      resultClass = 'lost';
    } else {
      score.win += 1;
      resultMessage = 'You Won! 🎉';
      resultClass = 'win';
    }
  }
  return `<span class="result-badge ${resultClass}">${resultMessage}</span>`;
}

// Main round trigger called by index.html button onclicks
function playRound(userChoice) {
  const computerChoice = computergeneratechoice();
  showresult(userChoice, computerChoice);
}

function showresult(usermove, cmpchoice) {
  // getresult updates the scores internally and returns the badge html
  let result = getresult(usermove, cmpchoice);
  localStorage.setItem('SCORE', JSON.stringify(score));

  // Render selections and result
  document.querySelector('#user-move').innerHTML = `User chose: ${choiceimage(usermove)}`;
  document.querySelector('#computer-move').innerHTML = `Computer chose: ${choiceimage(cmpchoice)}`;
  document.querySelector('#result').innerHTML = result;
  document.querySelector('#score').innerHTML = score.display_results();

  // Activate the matchup animation
  const matchup = document.querySelector('.matchup-container');
  if (matchup) {
    matchup.classList.add('active');
  }
}

// Render the score automatically on page load
document.addEventListener('DOMContentLoaded', () => {
  const scoreElement = document.querySelector('#score');
  if (scoreElement) {
    scoreElement.innerHTML = score.display_results();
  }
});
