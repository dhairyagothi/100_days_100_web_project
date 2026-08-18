import { initTheme } from './theme.js';
import { templates } from './templates.js';
import {
  calculateClarity,
  calculateSpecificity,
  calculateContext,
  calculateStructure,
  updateScore,
  resetBars,
  animateBars
} from './scoring.js';
import { generateSuggestions, resetSuggestions } from './suggestions.js';
import { saveHistory, initHistory } from './history.js';
import { initLibrary } from './library.js';

/* ------------------------------
   DOM References
-------------------------------- */

const promptInput = document.getElementById("promptInput");
const category = document.getElementById("category");
const tone = document.getElementById("tone");
const length = document.getElementById("length");

const analyzeBtn = document.getElementById("analyzeBtn");
const clearBtn = document.getElementById("clearBtn");

const optimizedPrompt = document.getElementById("optimizedPrompt");

const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");

/* ------------------------------
   Analyze Prompt
-------------------------------- */

analyzeBtn.addEventListener("click", analyzePrompt);

function analyzePrompt() {
  const prompt = promptInput.value.trim();

  if (!prompt) {
    alert("Please enter a prompt.");
    return;
  }

  let clarity = calculateClarity(prompt);
  let specificity = calculateSpecificity(prompt);
  let context = calculateContext(prompt);
  let structure = calculateStructure(prompt);

  let totalScore = Math.round(
    (clarity + specificity + context + structure) / 4
  );

  updateScore(totalScore);
  resetBars();

  animateBars(clarity, specificity, context, structure);

  generateSuggestions(
    prompt, clarity, specificity, context, structure
  );

  generateOptimizedPrompt(prompt);

  saveHistory(prompt, totalScore);
}

/* ------------------------------
   Optimizer
-------------------------------- */

function generateOptimizedPrompt(prompt) {
  const selected = category.value;
  const selectedTone = tone.value;
  const selectedLength = length.value;

  let template = templates[selected];

  template = template.split("{PROMPT}").join(prompt);
  template = template.split("{TONE}").join(selectedTone);
  template = template.split("{LENGTH}").join(selectedLength);

  optimizedPrompt.value = template;
}

/* ------------------------------
   Copy
-------------------------------- */

copyBtn.addEventListener("click", async () => {
  if (!optimizedPrompt.value) return;

  try {
    await navigator.clipboard.writeText(optimizedPrompt.value);

    const original = copyBtn.textContent;
    copyBtn.textContent = "Copied!";

    setTimeout(() => {
      copyBtn.textContent = original;
    }, 1500);
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
  }
});

/* ------------------------------
   Download TXT
-------------------------------- */

downloadBtn.addEventListener("click", () => {
  if (!optimizedPrompt.value) {
    alert("Generate an optimized prompt first.");
    return;
  }

  const blob = new Blob(
    [optimizedPrompt.value],
    { type: "text/plain" }
  );

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "optimized-prompt.txt";
  link.click();
});

/* ------------------------------
   Clear
-------------------------------- */

clearBtn.addEventListener("click", () => {
  promptInput.value = "";
  optimizedPrompt.value = "";

  updateScore(0);
  resetBars();
  resetSuggestions();
});

/* ------------------------------
   Init
-------------------------------- */

initTheme();
initHistory();
initLibrary();
