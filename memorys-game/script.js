const gridMatrixContainer = document.getElementById("game-grid-matrix");
const moveCounterDisplay = document.getElementById("move-counter");
const matchCounterDisplay = document.getElementById("match-counter");
const restartButton = document.getElementById("restart-btn");

const baselineCardIcons = ["🦊", "🐸", "🦁", "🦉", "🐱", "🦄", "🐝", "🦀"];
let completeDeckMatrix = [...baselineCardIcons, ...baselineCardIcons];

let runningMoveCount = 0;
let matchingPairsCount = 0;
let primaryFlippedCardInstance = null;
let secondaryFlippedCardInstance = null;
let blockGridInteractionLock = false;

// Fisher-Yates Shuffle Engine
function shuffleCardMatrixDeck(targetArray) {
  for (
    let currentPointerIndex = targetArray.length - 1;
    currentPointerIndex > 0;
    currentPointerIndex--
  ) {
    const generatedRandomTargetIndex = Math.floor(
      Math.random() * (currentPointerIndex + 1),
    );
    [
      targetArray[currentPointerIndex],
      targetArray[generatedRandomTargetIndex],
    ] = [
      targetArray[generatedRandomTargetIndex],
      targetArray[currentPointerIndex],
    ];
  }
  return targetArray;
}

function assembleGameplayGridBoard() {
  gridMatrixContainer.innerHTML = "";
  const shuffledIconsList = shuffleCardMatrixDeck(completeDeckMatrix);

  shuffledIconsList.forEach((iconSymbol, uniqueElementIndex) => {
    const structuralCardMarkupNode = document.createElement("div");
    structuralCardMarkupNode.className = "memory-card";
    structuralCardMarkupNode.dataset.icon = iconSymbol;
    structuralCardMarkupNode.dataset.index = uniqueElementIndex;

    structuralCardMarkupNode.innerHTML = `
            <div class="card-face card-front"></div>
            <div class="card-face card-back">${iconSymbol}</div>
        `;

    structuralCardMarkupNode.addEventListener("click", triggerCardFlipSequence);
    gridMatrixContainer.appendChild(structuralCardMarkupNode);
  });
}

function triggerCardFlipSequence() {
  if (blockGridInteractionLock) return;
  if (this === primaryFlippedCardInstance) return;

  this.classList.add("flipped");

  if (!primaryFlippedCardInstance) {
    primaryFlippedCardInstance = this;
    return;
  }

  secondaryFlippedCardInstance = this;
  runningMoveCount++;
  moveCounterDisplay.textContent = runningMoveCount;

  evaluateCardPairMatches();
}

function evaluateCardPairMatches() {
  const isMatchingPairFound =
    primaryFlippedCardInstance.dataset.icon ===
    secondaryFlippedCardInstance.dataset.icon;

  if (isMatchingPairFound) {
    disableActiveCardPair();
  } else {
    revertFlippedCardPair();
  }
}

function disableActiveCardPair() {
  primaryFlippedCardInstance.classList.add("matched");
  secondaryFlippedCardInstance.classList.add("matched");

  matchingPairsCount++;
  matchCounterDisplay.textContent = matchingPairsCount;

  clearSelectedTrackingInstances();

  if (matchingPairsCount === baselineCardIcons.length) {
    setTimeout(() => {
      alert(
        `Victory! You cleared the board in ${runningMoveCount} total moves.`,
      );
    }, 300);
  }
}

function revertFlippedCardPair() {
  blockGridInteractionLock = true;
  setTimeout(() => {
    primaryFlippedCardInstance.classList.remove("flipped");
    secondaryFlippedCardInstance.classList.remove("flipped");
    clearSelectedTrackingInstances();
  }, 900);
}

function clearSelectedTrackingInstances() {
  primaryFlippedCardInstance = null;
  secondaryFlippedCardInstance = null;
  blockGridInteractionLock = false;
}

function clearResetGameSession() {
  runningMoveCount = 0;
  matchingPairsCount = 0;
  moveCounterDisplay.textContent = runningMoveCount;
  matchCounterDisplay.textContent = matchingPairsCount;
  clearSelectedTrackingInstances();
  assembleGameplayGridBoard();
}

restartButton.addEventListener("click", clearResetGameSession);
assembleGameplayGridBoard();
