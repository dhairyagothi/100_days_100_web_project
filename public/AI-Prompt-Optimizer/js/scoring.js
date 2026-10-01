const scoreValue = document.getElementById("scoreValue");
const scoreLabel = document.getElementById("scoreLabel");

const clarityBar = document.getElementById("clarityBar");
const specificityBar = document.getElementById("specificityBar");
const contextBar = document.getElementById("contextBar");
const structureBar = document.getElementById("structureBar");

export function calculateClarity(prompt) {
  let score = 40;
  const words = prompt.split(" ");

  if (words.length > 10) score += 20;
  if (words.length > 20) score += 20;
  if (words.length > 40) score += 10;

  return Math.min(score, 100);
}

export function calculateSpecificity(prompt) {
  let score = 30;

  const keywords = [
    "explain", "generate", "create", "analyze", "step",
    "detailed", "professional", "example", "format", "role"
  ];

  keywords.forEach(word => {
    if (prompt.toLowerCase().includes(word)) {
      score += 7;
    }
  });

  return Math.min(score, 100);
}

export function calculateContext(prompt) {
  let score = 25;

  if (prompt.length > 80) score += 20;
  if (prompt.length > 150) score += 20;
  if (prompt.length > 250) score += 20;

  return Math.min(score, 100);
}

export function calculateStructure(prompt) {
  let score = 30;

  if (prompt.includes(":")) score += 20;
  if (prompt.includes(",")) score += 15;
  if (prompt.includes("\n")) score += 20;
  if (prompt.includes("-")) score += 15;

  return Math.min(score, 100);
}

export function updateScore(score) {
  scoreValue.textContent = score;

  if (score >= 80) {
    scoreLabel.textContent = "Excellent Prompt";
  } else if (score >= 60) {
    scoreLabel.textContent = "Good Prompt";
  } else if (score >= 40) {
    scoreLabel.textContent = "Average Prompt";
  } else {
    scoreLabel.textContent = "Needs Improvement";
  }
}

export function resetBars() {
  clarityBar.style.width = "0%";
  specificityBar.style.width = "0%";
  contextBar.style.width = "0%";
  structureBar.style.width = "0%";
  void clarityBar.offsetWidth;
}

export function animateBars(clarity, specificity, context, structure) {
  clarityBar.style.width = clarity + "%";
  specificityBar.style.width = specificity + "%";
  contextBar.style.width = context + "%";
  structureBar.style.width = structure + "%";
}
