// Native Domain Endpoint Configuration Mapping
const DICTIONARY_API_BASE = "https://api.dictionaryapi.dev/api/v2/entries/en/";

const wordInput = document.getElementById("wordInput");
const searchBtn = document.getElementById("searchBtn");

const resultsArea = document.getElementById("resultsArea");
const statusBox = document.getElementById("statusBox");

const targetWord = document.getElementById("targetWord");
const phoneticText = document.getElementById("phoneticText");
const partOfSpeech = document.getElementById("partOfSpeech");
const definitionText = document.getElementById("definitionText");
const exampleText = document.getElementById("exampleText");
const exampleWrapper = document.getElementById("exampleWrapper");
const audioBtn = document.getElementById("audioBtn");

let activeAudioTrackUrl = "";

// Functional Module: API REST Engine Callback Interface
async function lookUpWordDefinition(queryTerm) {
  if (!queryTerm) return;

  // Toggle runtime UI loading state elements
  resultsArea.classList.add("hidden");
  statusBox.classList.remove("hidden");
  statusBox.innerText = `Searching lexicon references for "${queryTerm}"...`;
  activeAudioTrackUrl = "";

  try {
    const response = await fetch(
      `${DICTIONARY_API_BASE}${encodeURIComponent(queryTerm)}`,
    );

    if (!response.ok) {
      throw new Error("Could not locate definition records for this keyword.");
    }

    const dataArray = await response.json();
    populateDictionaryUI(dataArray[0]);
  } catch (err) {
    statusBox.classList.remove("hidden");
    statusBox.innerText = `No results found for "${queryTerm}". Try verifying spelling rules or search another term.`;
  }
}

// Map Response Models directly down onto DOM structural nodes
function populateDictionaryUI(wordPayload) {
  statusBox.classList.add("hidden");
  resultsArea.classList.remove("hidden");

  // Populate foundational textual information fields
  targetWord.innerText = wordPayload.word;
  phoneticText.innerText =
    wordPayload.phonetic ||
    (wordPayload.phonetics &&
      wordPayload.phonetics.find((p) => p.text)?.text) ||
    "";

  // Dig out first primary lexical object structures
  const primaryMeaning = wordPayload.meanings[0];
  partOfSpeech.innerText = primaryMeaning.partOfSpeech;

  const operationalDefinition = primaryMeaning.definitions[0];
  definitionText.innerText = operationalDefinition.definition;

  // Handle Example Usage blocks cleanly
  if (operationalDefinition.example) {
    exampleWrapper.classList.remove("hidden");
    exampleText.innerText = `"${operationalDefinition.example}"`;
  } else {
    exampleWrapper.classList.add("hidden");
  }

  // Isolate sound files containing audio configurations across phonetics arrays
  const validAudioObj = wordPayload.phonetics.find(
    (p) => p.audio && p.audio.trim() !== "",
  );

  if (validAudioObj) {
    activeAudioTrackUrl = validAudioObj.audio;
    audioBtn.style.display = "flex";
  } else {
    audioBtn.style.display = "none";
  }
}

// Executive Click Events & Key listeners
searchBtn.addEventListener("click", () => {
  const cleanWord = wordInput.value.trim();
  lookUpWordDefinition(cleanWord);
});

wordInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchBtn.click();
});

// Play Audio Track Using Native Audio Element API Elements
audioBtn.addEventListener("click", () => {
  if (activeAudioTrackUrl) {
    const structuralAudioPlaybackNode = new Audio(activeAudioTrackUrl);
    structuralAudioPlaybackNode.play().catch((err) => {
      alert(
        "Audio stream could not initialize. Try toggling browser permissions.",
      );
    });
  }
});
