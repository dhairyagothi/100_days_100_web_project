const richTextEngine = document.getElementById("rich-text-engine");
const toolbarButtons = document.querySelectorAll(".tool-btn");
const saveIndicator = document.getElementById("save-indicator");

let structuralAutoSaveTimer = null;

function applyStyleCommand(commandProperty) {
  if (commandProperty === "clearFormatting") {
    // Handle fallback structure to strip HTML styles safely
    document.execCommand("removeFormat", false, null);
  } else {
    // Execute structural text element mutation adjustments
    document.execCommand(commandProperty, false, null);
  }

  // Focus context pointer back down onto text workspace area
  richTextEngine.focus();
  queueStateAutoSaveCycle();
}

function queueStateAutoSaveCycle() {
  saveIndicator.textContent = "Saving modifications...";
  saveIndicator.classList.add("saving");

  // Clear previous timer intervals to debounce continuous inputs
  clearTimeout(structuralAutoSaveTimer);

  structuralAutoSaveTimer = setTimeout(() => {
    const structuralMarkupPayload = richTextEngine.innerHTML;

    // Push payload down to memory stack
    localStorage.setItem("scribepad_document_markup", structuralMarkupPayload);

    saveIndicator.textContent = "All changes saved";
    saveIndicator.classList.remove("saving");
  }, 1000);
}

function initializePadDocumentContent() {
  const historicalContentPayload = localStorage.getItem(
    "scribepad_document_markup",
  );

  if (historicalContentPayload) {
    richTextEngine.innerHTML = historicalContentPayload;
  }
}

// Map events across control buttons
toolbarButtons.forEach((individualButton) => {
  individualButton.addEventListener("click", () => {
    const targetCommand = individualButton.dataset.command;
    applyStyleCommand(targetCommand);
  });
});

// Capture document inputs inside editable context zone
richTextEngine.addEventListener("input", queueStateAutoSaveCycle);

// Load previous data during page compilation step
initializePadDocumentContent();
