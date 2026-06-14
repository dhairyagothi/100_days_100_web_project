const paletteContainer = document.getElementById("palette-display-container");
const generateButton = document.getElementById("generate-btn");
const toastNotification = document.getElementById("toast-notification");

const columnCountLimit = 5;
let currentActivePaletteState = [];

// Base-16 Random Hex Character Engine Block
function generateRandomHexColor() {
  const hexCharacters = "0123456789ABCDEF";
  let outputColorString = "#";
  for (let stringPointer = 0; stringPointer < 6; stringPointer++) {
    outputColorString += hexCharacters[Math.floor(Math.random() * 16)];
  }
  return outputColorString;
}

function initializePaletteDomStructure() {
  paletteContainer.innerHTML = "";
  currentActivePaletteState = [];

  for (let columnIndex = 0; columnIndex < columnCountLimit; columnIndex++) {
    const structuralColumnNode = document.createElement("div");
    structuralColumnNode.className = "color-column";

    structuralColumnNode.innerHTML = `
            <span class="hex-value">#FFFFFF</span>
            <button class="lock-btn">🔓</button>
        `;

    const lockButton = structuralColumnNode.querySelector(".lock-btn");
    lockButton.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleColumnLockState(columnIndex, structuralColumnNode, lockButton);
    });

    const hexLabel = structuralColumnNode.querySelector(".hex-value");
    hexLabel.addEventListener("click", () => {
      copyColorHexToClipboard(currentActivePaletteState[columnIndex].color);
    });

    paletteContainer.appendChild(structuralColumnNode);

    currentActivePaletteState.push({
      color: "#FFFFFF",
      isLocked: false,
      domElement: structuralColumnNode,
      hexLabelElement: hexLabel,
      lockButtonElement: lockButton,
    });
  }
  computeNewPaletteDistribution();
}

function toggleColumnLockState(index, columnNode, buttonNode) {
  const targetedStateObject = currentActivePaletteState[index];
  targetedStateObject.isLocked = !targetedStateObject.isLocked;

  if (targetedStateObject.isLocked) {
    columnNode.classList.add("is-locked");
    buttonNode.textContent = "🔒";
  } else {
    columnNode.classList.remove("is-locked");
    buttonNode.textContent = "🔓";
  }
}

function computeNewPaletteDistribution() {
  currentActivePaletteState.forEach((paletteItem) => {
    if (paletteItem.isLocked) return; // Skip recalculating locked columns

    const freshRandomHex = generateRandomHexColor();
    paletteItem.color = freshRandomHex;

    // Dynamically shift CSS attributes across column segments
    paletteItem.domElement.style.backgroundColor = freshRandomHex;
    paletteItem.hexLabelElement.textContent = freshRandomHex;
  });
}

function copyColorHexToClipboard(hexStringValue) {
  // Utilize modern asynchronous text clipboard APIs
  navigator.clipboard
    .writeText(hexStringValue)
    .then(() => {
      triggerFeedbackToastMessage();
    })
    .catch((err) => {
      console.error("Could not copy color parameters to buffer layer: ", err);
    });
}

function triggerFeedbackToastMessage() {
  toastNotification.classList.remove("toast-hidden");

  // Smoothly clear out active toast notifications after an observation window
  setTimeout(() => {
    toastNotification.classList.add("toast-hidden");
  }, 2000);
}

// Global hotkey binding tracking keyboard spacebar updates
window.addEventListener("keydown", (keyboardEvent) => {
  if (keyboardEvent.code === "Space") {
    keyboardEvent.preventDefault(); // Block regular page down scrolling action
    computeNewPaletteDistribution();
  }
});

generateButton.addEventListener("click", computeNewPaletteDistribution);

// Start up application interface parameters cleanly
initializePaletteDomStructure();
