const paletteContainer = document.getElementById("palette-display-container");
const generateButton = document.getElementById("generate-btn");
const toastNotification = document.getElementById("toast-notification");

const columnCountLimit = 5;
let currentActivePaletteState = [];

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
    if (paletteItem.isLocked) return;

    const freshRandomHex = generateRandomHexColor();
    paletteItem.color = freshRandomHex;

    paletteItem.domElement.style.backgroundColor = freshRandomHex;
    paletteItem.hexLabelElement.textContent = freshRandomHex;
  });
}

function copyColorHexToClipboard(hexStringValue) {
  navigator.clipboard
    .writeText(hexStringValue)
    .then(() => {
      triggerFeedbackToastMessage();
    })
    .catch((err) => {
      console.error("Could not copy color parameters to clipboard: ", err);
    });
}

function triggerFeedbackToastMessage() {
  toastNotification.classList.remove("toast-hidden");
  setTimeout(() => {
    toastNotification.classList.add("toast-hidden");
  }, 2000);
}

window.addEventListener("keydown", (keyboardEvent) => {
  if (keyboardEvent.code === "Space") {
    keyboardEvent.preventDefault();
    computeNewPaletteDistribution();
  }
});

generateButton.addEventListener("click", computeNewPaletteDistribution);
initializePaletteDomStructure();
