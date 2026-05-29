let score;
let scorestr = localStorage.getItem('SCORE');
resetscore(scorestr);

function resetscore(scorestr) {
  // Explicitly reset the score to 0 if no score is stored in localStorage
  score = {
    win: 0,
    lost: 0,
    tie: 0,
  };

  score.display_results = function () {
    return `<br>Won: ${score.win/2}<br><span style="color:red"> Lost: ${score.lost/2}</span><br>
    Tie: ${score.tie/2} <br> <span style="color:purple;">Total Games: ${score.win/2 + score.lost/2 + score.tie/2}</span>`;
  };

  // Save the reset score back to localStorage
  localStorage.setItem('SCORE', JSON.stringify(score));

  
  
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
  } else if (choice === 'stump') {  // ensure 'stump' is used properly
    return '<div style="display: flex; justify-content: center; align-items: center; height: 100px;"><img src="wickets.jpeg" alt="Stump" class="game-image" style="width: 80px; height: 80px;"></div>';
  }
  return '';  
}

function getresult(usermove, cmpchoice) {
  let resultMessage = '';
  let userimage = '';
  let cmpimage = '';

  // Get the image HTML for both user and computer choices
  // userimage = choiceimage(usermove);
  // cmpimage = choiceimage(cmpchoice);

  // Determine the result message based on user and computer choices
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

  // Display only the images of the user and computer's choices
  document.querySelector('#user-move').innerHTML = `User chose: ${choiceimage(usermove)}`;
  document.querySelector('#computer-move').innerHTML = `Computer chose: ${choiceimage(cmpchoice)}`;

  // Display the result text (not repeating images)
  document.querySelector('#result').innerHTML = result; 
  document.querySelector('#score').innerHTML = `${score.display_results()}`;
}
