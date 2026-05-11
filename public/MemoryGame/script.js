const gameContainer = document.getElementById("game-container");
const scoreBoard = document.getElementById("score-board");
const restartBtn = document.getElementById("restart-btn");

const colors = [
  "#2980b9",
  "#2ecc71",
  "#9b59b6",
  "#f1c40f",
  "#e74c3c",
  "#34495e",
  "#1abc9c",
  "#e67e22",
];

let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchesCount = 0;

// Create cards dynamically
function createCards() {
  const cardsArray = [...colors, ...colors];

  // Shuffle cards
  cardsArray.sort(() => 0.5 - Math.random());

  cardsArray.forEach((color) => {
    const cardElement = document.createElement("div");

    cardElement.classList.add("card");

    // Store card color as dataset attribute
    cardElement.dataset.color = color;

    // Card structure
    cardElement.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back" style="background-color:${color}"></div>
      </div>
    `;

    gameContainer.appendChild(cardElement);
  });

  cards = document.querySelectorAll(".card");
}

// Flip card
function flipCard(event) {
  // Prevent clicking while board is locked
  if (lockBoard) return;

  const clickedCard = event.currentTarget;

  // Prevent clicking same card twice
  if (clickedCard === firstCard) return;

  clickedCard.classList.add("flipped");

  // First card selection
  if (!firstCard) {
    firstCard = clickedCard;
    return;
  }

  // Second card selection
  secondCard = clickedCard;

  // Check if cards match
  checkForMatch();
}

// Check matching logic
function checkForMatch() {
  lockBoard = true;

  const isMatch = firstCard.dataset.color === secondCard.dataset.color;

  if (isMatch) {
    disableCards();
    updateScore();
  } else {
    unflipCards();
  }
}

// Disable matched cards
function disableCards() {
  resetBoard();
}

// Unflip unmatched cards
function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");

    resetBoard();
  }, 1000);
}

// Update score
function updateScore() {
  matchesCount++;

  scoreBoard.innerText = `Matches: ${matchesCount}`;
}

// Reset board state
function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

// Restart game
function restartGame() {
  // Remove all cards
  gameContainer.innerHTML = "";

  // Reset game state
  matchesCount = 0;
  firstCard = null;
  secondCard = null;
  lockBoard = false;

  // Reset score UI
  scoreBoard.innerText = "Matches: 0";

  // Generate fresh shuffled cards
  createCards();
}

// Initialize game
createCards();

// Restart button listener
restartBtn.addEventListener("click", restartGame);

// Card click handling using event delegation
gameContainer.addEventListener("click", function (event) {
  const clickedCard = event.target.closest(".card");

  if (clickedCard && !clickedCard.classList.contains("flipped")) {
    flipCard({ currentTarget: clickedCard });
  }
});
