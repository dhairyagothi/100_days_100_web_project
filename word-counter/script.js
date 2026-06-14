const textInput = document.getElementById("text-input");
const wordCountDisplay = document.getElementById("word-count");
const charCountDisplay = document.getElementById("char-count");
const sentenceCountDisplay = document.getElementById("sentence-count");
const readingTimeDisplay = document.getElementById("reading-time");
const keywordDensityContainer = document.getElementById("keyword-density-list");

const clearBtn = document.getElementById("clear-btn");
const uppercaseBtn = document.getElementById("uppercase-btn");
const lowercaseBtn = document.getElementById("lowercase-btn");

function runTextAnalysisMetrics() {
  const rawTextValue = textInput.value;

  // 1. Calculate Core Character Metric Boundaries
  charCountDisplay.textContent = rawTextValue.length;

  // 2. Perform Array Splitting Filters to extract standard Word counts
  const cleanedWordsArray = rawTextValue
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((wordItem) => wordItem.length > 0);

  wordCountDisplay.textContent = cleanedWordsArray.length;

  // 3. Sentence parsing computation loops matching terminal punctuation boundaries
  const parsedSentences = rawTextValue
    .split(/[.!?]+/)
    .filter((sentenceItem) => sentenceItem.trim().length > 0);
  sentenceCountDisplay.textContent = parsedSentences.length;

  // 4. Reading metrics approximation calculation (Average typing speed baseline ~200 WPM)
  const minutesCalculation = Math.ceil(cleanedWordsArray.length / 200);
  readingTimeDisplay.textContent =
    cleanedWordsArray.length > 0 ? `${minutesCalculation}m` : "0m";

  // 5. Keyword Density Mapping Calculation Loops
  renderKeywordDensityLayout(cleanedWordsArray);
}

function renderKeywordDensityLayout(wordsArray) {
  if (wordsArray.length === 0) {
    keywordDensityContainer.innerHTML = `<p class="empty-state">No keywords detected yet. Start typing above!</p>`;
    return;
  }

  // Map word frequency maps array instances
  const dictionaryFrequencyMap = {};
  // Extended filter listing to bypass basic structural stop-words matching metrics
  const excludedStopwords = [
    "the",
    "is",
    "and",
    "a",
    "to",
    "in",
    "of",
    "it",
    "that",
    "you",
    "for",
    "on",
    "with",
    "as",
    "this",
    "but",
  ];

  wordsArray.forEach((word) => {
    // Strip out punctuation characters lingering on token borders
    const standardizedToken = word.replace(
      /[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g,
      "",
    );
    if (
      standardizedToken.length > 1 &&
      !excludedStopwords.includes(standardizedToken)
    ) {
      dictionaryFrequencyMap[standardizedToken] =
        (dictionaryFrequencyMap[standardizedToken] || 0) + 1;
    }
  });

  // Convert hash maps configurations parameters into sorted array dimensions matrices
  const sortedKeywordsList = Object.entries(dictionaryFrequencyMap)
    .sort((elementA, elementB) => elementB[1] - elementA[1])
    .slice(0, 5); // Display top 5 matches only

  if (sortedKeywordsList.length === 0) {
    keywordDensityContainer.innerHTML = `<p class="empty-state">Keep typing to populate keyword distribution analysis charts...</p>`;
    return;
  }

  const maxFrequencyInstance = sortedKeywordsList[0][1];
  keywordDensityContainer.innerHTML = "";

  sortedKeywordsList.forEach(([wordLabel, wordCountValue]) => {
    const structuralPercentageCalculation =
      (wordCountValue / maxFrequencyInstance) * 100;

    const markupRowElement = document.createElement("div");
    markupRowElement.className = "density-row";
    markupRowElement.innerHTML = `
            <span class="keyword-badge">${wordLabel}</span>
            <div class="frequency-bar-wrapper">
                <div class="bar-bg">
                    <div class="bar-fill" style="width: ${structuralPercentageCalculation}%"></div>
                </div>
                <span class="count-text">${wordCountValue}</span>
            </div>
        `;
    keywordDensityContainer.appendChild(markupRowElement);
  });
}

// Global Text Manipulation Transform Handlers
clearBtn.addEventListener("click", () => {
  textInput.value = "";
  runTextAnalysisMetrics();
});

uppercaseBtn.addEventListener("click", () => {
  textInput.value = textInput.value.toUpperCase();
  runTextAnalysisMetrics();
});

lowercaseBtn.addEventListener("click", () => {
  textInput.value = textInput.value.toLowerCase();
  runTextAnalysisMetrics();
});

// Event Binding Matrix Listeners Hooks tracking real-time typing dynamics
textInput.addEventListener("input", runTextAnalysisMetrics);
