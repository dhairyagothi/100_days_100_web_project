const simonPadsElements = document.querySelectorAll(".simon-pad");
const gameStatusLabel = document.getElementById("game-status-label");
const masterStartBtn = document.getElementById("master-start-btn");

const padColorOptionsIndexMap = ["red", "blue", "yellow", "green"];

let coreGeneratedSequencePattern = [];
let userEnteredSequenceTracker = [];
let structuralLevelCounter = 0;
let isPlaybackCycleRunning = false;

function generateAndAppendNextSequenceStep() {
  userEnteredSequenceTracker = [];
  structuralLevelCounter++;
  gameStatusLabel.textContent = `Watch closely! Level ${structuralLevelCounter}`;

  const randomColorSelectorIndex = Math.floor(Math.random() * 4);
  const assignedColorToken = padColorOptionsIndexMap[randomColorSelectorIndex];
  coreGeneratedSequencePattern.push(assignedColorToken);

  executeSequencePlaybackLoop();
}

function executeSequencePlaybackLoop() {
  isPlaybackCycleRunning = true;
  togglePadsInputLockout(true);

  let baseDelayIntervalOffset = 400;

  coreGeneratedSequencePattern.forEach((colorToken, sequenceStepPtr) => {
    // Build clear staggering timeouts for asynchronous pattern playback
    setTimeout(() => {
      illuminateTargetPadNode(colorToken);
    }, baseDelayIntervalOffset);

    // Calculate time increments to avoid overlapping transitions
    baseDelayIntervalOffset += 800;

    // Unlock player interface controls once the sequence finishes playing
    if (sequenceStepPtr === coreGeneratedSequencePattern.length - 1) {
      setTimeout(() => {
        isPlaybackCycleRunning = false;
        togglePadsInputLockout(false);
        gameStatusLabel.textContent = `Your turn! Reproduce Level ${structuralLevelCounter} pattern`;
      }, baseDelayIntervalOffset - 200);
    }
  });
}

function illuminateTargetPadNode(colorTokenString) {
  const matchedPadDomNode = document.querySelector(
    `.simon-pad.${colorTokenString}`,
  );
  if (!matchedPadDomNode) return;

  matchedPadDomNode.classList.add("pad-illuminated");

  setTimeout(() => {
    matchedPadDomNode.classList.remove("pad-illuminated");
  }, 400);
}

function evaluatePlayerPadSelection(selectionEvent) {
  if (isPlaybackCycleRunning) return;

  const chosenColorToken = selectionEvent.target.dataset.color;
  illuminateTargetPadNode(chosenColorToken);
  userEnteredSequenceTracker.push(chosenColorToken);

  const checkMatchPointerIndex = userEnteredSequenceTracker.length - 1;

  // Validate if user string matches history sequence at checking index
  if (
    userEnteredSequenceTracker[checkMatchPointerIndex] !==
    coreGeneratedSequencePattern[checkMatchPointerIndex]
  ) {
    handleGameOverCondition();
    return;
  }

  // Advance when user successfully maps the entire current level chain length
  if (
    userEnteredSequenceTracker.length === coreGeneratedSequencePattern.length
  ) {
    togglePadsInputLockout(true);
    setTimeout(() => {
      generateAndAppendNextSequenceStep();
    }, 1000);
  }
}

function togglePadsInputLockout(shouldDisableInputs) {
  simonPadsElements.forEach((padNodeInstance) => {
    padNodeInstance.disabled = shouldDisableInputs;
  });
}

function handleGameOverCondition() {
  gameStatusLabel.textContent = `Game Over! ❌ Failed at Level ${structuralLevelCounter}. Final score: ${structuralLevelCounter - 1}`;

  coreGeneratedSequencePattern = [];
  togglePadsInputLockout(true);

  masterStartBtn.style.display = "block";
  masterStartBtn.textContent = "Restart Challenge Session 🔄";
}

function bootSimonSaysSession() {
  masterStartBtn.style.display = "none";
  coreGeneratedSequencePattern = [];
  structuralLevelCounter = 0;

  generateAndAppendNextSequenceStep();
}

// Attach listener bindings across game controls
simonPadsElements.forEach((singlePadNode) => {
  singlePadNode.addEventListener("click", evaluatePlayerPadSelection);
});

masterStartBtn.addEventListener("click", bootSimonSaysSession);
