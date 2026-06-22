const promptInput = document.getElementById("promptInput");
const category = document.getElementById("category");

const analyzeBtn = document.getElementById("analyzeBtn");
const clearBtn = document.getElementById("clearBtn");

const scoreValue = document.getElementById("scoreValue");
const scoreLabel = document.getElementById("scoreLabel");

const clarityBar = document.getElementById("clarityBar");
const specificityBar = document.getElementById("specificityBar");
const contextBar = document.getElementById("contextBar");
const structureBar = document.getElementById("structureBar");

const suggestionsList = document.getElementById("suggestionsList");

const optimizedPrompt = document.getElementById("optimizedPrompt");

const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");

const historyContainer = document.getElementById("historyContainer");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

const themeToggle = document.getElementById("themeToggle");

/* ------------------------------
   Theme
-------------------------------- */

loadTheme();

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");

  const mode = document.body.classList.contains("light")
    ? "light"
    : "dark";

  localStorage.setItem("theme", mode);

  updateThemeIcon();
});

function loadTheme() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light") {
    document.body.classList.add("light");
  }

  updateThemeIcon();
}

function updateThemeIcon() {
  themeToggle.textContent =
    document.body.classList.contains("light")
      ? "☀️"
      : "🌙";
}

/* ------------------------------
   Prompt Templates
-------------------------------- */

const templates = {
  coding:
`Act as a senior software engineer.

Task:
{PROMPT}

Requirements:
- Explain step-by-step
- Follow best practices
- Include code examples
- Mention edge cases
- Optimize performance where possible

Output format:
Structured explanation with code.`,

  writing:
`Act as a professional content writer.

Task:
{PROMPT}

Requirements:
- Clear and engaging tone
- Well-structured sections
- Strong introduction
- Strong conclusion
- Improve readability

Output format:
Polished article.`,

  resume:
`Act as an experienced recruiter.

Task:
{PROMPT}

Requirements:
- ATS-friendly wording
- Strong action verbs
- Professional formatting
- Quantifiable achievements where possible
- Industry-standard language

Output format:
Professional resume content.`,

  marketing:
`Act as a digital marketing strategist.

Task:
{PROMPT}

Requirements:
- Target audience identification
- Persuasive messaging
- Strong CTA
- Marketing-focused tone
- Conversion optimization

Output format:
Marketing-ready content.`,

  study:
`Act as an expert tutor.

Task:
{PROMPT}

Requirements:
- Simple explanations
- Examples included
- Key takeaways
- Step-by-step breakdown
- Beginner-friendly language

Output format:
Educational explanation.`
};

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

  animateBars(
    clarity,
    specificity,
    context,
    structure
  );

  generateSuggestions(
    prompt,
    clarity,
    specificity,
    context,
    structure
  );

  generateOptimizedPrompt(prompt);

  saveHistory(prompt, totalScore);
}

/* ------------------------------
   Scoring
-------------------------------- */

function calculateClarity(prompt) {

  let score = 40;

  const words = prompt.split(" ");

  if (words.length > 10) score += 20;
  if (words.length > 20) score += 20;
  if (words.length > 40) score += 10;

  return Math.min(score, 100);
}

function calculateSpecificity(prompt) {

  let score = 30;

  const keywords = [
    "explain",
    "generate",
    "create",
    "analyze",
    "step",
    "detailed",
    "professional",
    "example",
    "format",
    "role"
  ];

  keywords.forEach(word => {
    if (
      prompt.toLowerCase().includes(word)
    ) {
      score += 7;
    }
  });

  return Math.min(score, 100);
}

function calculateContext(prompt) {

  let score = 25;

  if (prompt.length > 80) score += 20;
  if (prompt.length > 150) score += 20;
  if (prompt.length > 250) score += 20;

  return Math.min(score, 100);
}

function calculateStructure(prompt) {

  let score = 30;

  if (prompt.includes(":")) score += 20;
  if (prompt.includes(",")) score += 15;
  if (prompt.includes("\n")) score += 20;
  if (prompt.includes("-")) score += 15;

  return Math.min(score, 100);
}

/* ------------------------------
   Update Score
-------------------------------- */

function updateScore(score) {

  scoreValue.textContent = score;

  if (score >= 80) {
    scoreLabel.textContent =
      "Excellent Prompt";
  }

  else if (score >= 60) {
    scoreLabel.textContent =
      "Good Prompt";
  }

  else if (score >= 40) {
    scoreLabel.textContent =
      "Average Prompt";
  }

  else {
    scoreLabel.textContent =
      "Needs Improvement";
  }
}

function animateBars(
  clarity,
  specificity,
  context,
  structure
) {
  clarityBar.style.width =
    clarity + "%";

  specificityBar.style.width =
    specificity + "%";

  contextBar.style.width =
    context + "%";

  structureBar.style.width =
    structure + "%";
}

/* ------------------------------
   Suggestions
-------------------------------- */

function generateSuggestions(
  prompt,
  clarity,
  specificity,
  context,
  structure
) {

  suggestionsList.innerHTML = "";

  const suggestions = [];

  if (clarity < 70) {
    suggestions.push(
      "Use clearer instructions and goals."
    );
  }

  if (specificity < 70) {
    suggestions.push(
      "Add more specific requirements."
    );
  }

  if (context < 70) {
    suggestions.push(
      "Provide additional background context."
    );
  }

  if (structure < 70) {
    suggestions.push(
      "Use bullet points or structured formatting."
    );
  }

  if (
    prompt.split(" ").length < 10
  ) {
    suggestions.push(
      "Describe the desired output in more detail."
    );
  }

  suggestions.push(
    "Specify the role the AI should act as."
  );

  suggestions.push(
    "Mention the desired output format."
  );

  suggestions.forEach(item => {

    const li =
      document.createElement("li");

    li.textContent = item;

    suggestionsList.appendChild(li);
  });
}

/* ------------------------------
   Optimizer
-------------------------------- */

function generateOptimizedPrompt(
  prompt
) {

  const selected =
    category.value;

  const template =
    templates[selected];

  optimizedPrompt.value =
    template.replace(
      "{PROMPT}",
      prompt
    );
}

/* ------------------------------
   Copy
-------------------------------- */

copyBtn.addEventListener(
  "click",
  () => {

    if (
      !optimizedPrompt.value
    ) {
      return;
    }

    navigator.clipboard.writeText(
      optimizedPrompt.value
    );

    const original =
      copyBtn.textContent;

    copyBtn.textContent =
      "Copied!";

    setTimeout(() => {
      copyBtn.textContent =
        original;
    }, 1500);
  }
);

/* ------------------------------
   Download TXT
-------------------------------- */

downloadBtn.addEventListener(
  "click",
  () => {

    if (
      !optimizedPrompt.value
    ) {
      alert(
        "Generate an optimized prompt first."
      );
      return;
    }

    const blob =
      new Blob(
        [optimizedPrompt.value],
        {
          type: "text/plain"
        }
      );

    const link =
      document.createElement("a");

    link.href =
      URL.createObjectURL(blob);

    link.download =
      "optimized-prompt.txt";

    link.click();
  }
);

/* ------------------------------
   Clear
-------------------------------- */

clearBtn.addEventListener(
  "click",
  () => {

    promptInput.value = "";

    optimizedPrompt.value = "";

    scoreValue.textContent = "0";

    scoreLabel.textContent =
      "Awaiting Analysis";

    clarityBar.style.width =
      "0%";

    specificityBar.style.width =
      "0%";

    contextBar.style.width =
      "0%";

    structureBar.style.width =
      "0%";

    suggestionsList.innerHTML =
      "<li>Analyze a prompt to receive suggestions.</li>";
  }
);

/* ------------------------------
   History
-------------------------------- */

function saveHistory(
  prompt,
  score
) {

  let history =
    JSON.parse(
      localStorage.getItem(
        "promptHistory"
      )
    ) || [];

  history.unshift({
    prompt,
    score,
    date:
      new Date().toLocaleString()
  });

  history = history.slice(0, 10);

  localStorage.setItem(
    "promptHistory",
    JSON.stringify(history)
  );

  renderHistory();
}

function renderHistory() {

  let history =
    JSON.parse(
      localStorage.getItem(
        "promptHistory"
      )
    ) || [];

  if (!history.length) {

    historyContainer.innerHTML =
      `<div class="history-placeholder">
          No prompts analyzed yet.
       </div>`;

    return;
  }

  historyContainer.innerHTML = "";

  history.forEach(item => {

    const div =
      document.createElement("div");

    div.className =
      "history-item";

    div.innerHTML = `
      <h4>Score: ${item.score}/100</h4>
      <p>${item.prompt}</p>
      <div class="history-meta">
        ${item.date}
      </div>
    `;

    historyContainer.appendChild(div);
  });
}

clearHistoryBtn.addEventListener(
  "click",
  () => {

    const confirmDelete =
      confirm(
        "Clear all prompt history?"
      );

    if (!confirmDelete) return;

    localStorage.removeItem(
      "promptHistory"
    );

    renderHistory();
  }
);

/* ------------------------------
   Init
-------------------------------- */

renderHistory();