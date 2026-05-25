const board = document.getElementById("board");

const player1ScoreText = document.getElementById("player1Score");
const player2ScoreText = document.getElementById("player2Score");

const player1Card = document.getElementById("player1Card");
const player2Card = document.getElementById("player2Card");

const turnText = document.getElementById("turnText");

const restartBtn = document.getElementById("restartBtn");

const player1NameInput =
document.getElementById("player1Name");

const player2NameInput =
document.getElementById("player2Name");

const player1DisplayName =
document.getElementById("player1DisplayName");

const player2DisplayName =
document.getElementById("player2DisplayName");

const startScreen =
document.getElementById("startScreen");

const startGameBtn =
document.getElementById("startGameBtn");

const winnerModal =
document.getElementById("winnerModal");

const winnerText =
document.getElementById("winnerText");

const closeModalBtn =
document.getElementById("closeModalBtn");

const GRID_SIZE = 5;

let currentPlayer = 1;

let player1Score = 0;
let player2Score = 0;

let lines = {};
let claimedBoxes = {};

function initializeBoard(){

  board.innerHTML = "";

  board.style.gridTemplateColumns =
    `repeat(${GRID_SIZE * 2 - 1}, auto)`;

  for(let row = 0; row < GRID_SIZE * 2 - 1; row++){

    for(let col = 0; col < GRID_SIZE * 2 - 1; col++){

      // DOT
      if(row % 2 === 0 && col % 2 === 0){

        const dot = document.createElement("div");
        dot.classList.add("dot");

        board.appendChild(dot);

      }

      // HORIZONTAL LINE
      else if(row % 2 === 0 && col % 2 === 1){

        const line = document.createElement("div");

        line.classList.add("line","horizontal");

        const id = `h-${row}-${col}`;

        line.dataset.id = id;

        line.addEventListener("click", () => handleLineClick(line,id));

        board.appendChild(line);

      }

      // VERTICAL LINE
      else if(row % 2 === 1 && col % 2 === 0){

        const line = document.createElement("div");

        line.classList.add("line","vertical");

        const id = `v-${row}-${col}`;

        line.dataset.id = id;

        line.addEventListener("click", () => handleLineClick(line,id));

        board.appendChild(line);

      }

      // BOX
      else{

        const box = document.createElement("div");

        box.classList.add("box");

        box.dataset.position = `${row}-${col}`;

        board.appendChild(box);

      }

    }

  }

}

function handleLineClick(line,id){

  if(lines[id]) return;

  lines[id] = true;

  line.classList.add(
    currentPlayer === 1 ? "player1" : "player2"
  );

  const scored = checkCompletedBoxes();

  if(!scored){

    currentPlayer = currentPlayer === 1 ? 2 : 1;

  }

  updateUI();

  checkGameOver();

}

function checkCompletedBoxes(){

  let scored = false;

  const allBoxes = document.querySelectorAll(".box");

  allBoxes.forEach(box => {

    const [r,c] = box.dataset.position
    .split("-")
    .map(Number);

    const top = `h-${r - 1}-${c}`;
    const bottom = `h-${r + 1}-${c}`;
    const left = `v-${r}-${c - 1}`;
    const right = `v-${r}-${c + 1}`;

    const boxId = `${r}-${c}`;

    if(
      lines[top] &&
      lines[bottom] &&
      lines[left] &&
      lines[right] &&
      !claimedBoxes[boxId]
    ){

      claimedBoxes[boxId] = true;

      box.classList.add(
        currentPlayer === 1 ? "player1" : "player2"
      );

      if(currentPlayer === 1){

        player1Score++;

      }else{

        player2Score++;

      }

      scored = true;

    }

  });

  return scored;

}

function updateUI(){

  player1ScoreText.textContent = player1Score;
  player2ScoreText.textContent = player2Score;

  const player1Name =
  player1DisplayName.textContent;

  const player2Name =
  player2DisplayName.textContent;

  turnText.textContent =
  currentPlayer === 1
  ? `${player1Name}'s Turn`
  : `${player2Name}'s Turn`;

  if(currentPlayer === 1){

    player1Card.classList.add("active");
    player2Card.classList.remove("active");

  }else{

    player2Card.classList.add("active");
    player1Card.classList.remove("active");

  }

}

function checkGameOver(){

  const totalBoxes =
  (GRID_SIZE - 1) * (GRID_SIZE - 1);

  if(player1Score + player2Score === totalBoxes){

    const player1Name =
    player1DisplayName.textContent;

    const player2Name =
    player2DisplayName.textContent;

    let winner;

    if(player1Score > player2Score){

      winner = `${player1Name} Wins!`;

    }else if(player2Score > player1Score){

      winner = `${player2Name} Wins!`;

    }else{

      winner = "It's a Draw!";
    }

    setTimeout(() => {

      winnerText.textContent = winner;

      winnerModal.classList.remove("hidden");

    },300);

  }

}
function restartGame(){

  currentPlayer = 1;

  player1Score = 0;
  player2Score = 0;

  lines = {};
  claimedBoxes = {};

  updateUI();

  initializeBoard();

}

restartBtn.addEventListener("click", restartGame);

initializeBoard();
updateUI();

closeModalBtn.addEventListener("click", () => {

  winnerModal.classList.add("hidden");

  restartGame();

});

startGameBtn.addEventListener("click", () => {

  const player1Name =
  player1NameInput.value.trim();

  const player2Name =
  player2NameInput.value.trim();

  player1DisplayName.textContent =
  player1Name || "Blue Player";

  player2DisplayName.textContent =
  player2Name || "Red Player";

  startScreen.style.display = "none";

  updateUI();

});
