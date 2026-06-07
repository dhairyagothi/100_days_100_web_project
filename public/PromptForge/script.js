const promptInput = document.getElementById("promptInput");
const optimizeBtn = document.getElementById("optimizeBtn");
const optimizedOutput = document.getElementById("optimizedOutput");

function optimizePrompt(userPrompt) {
  return `# CONTEXT
The user needs assistance with the following task:

${userPrompt}

# OBJECTIVE
Provide a detailed, accurate, and useful response.

# STYLE
Professional and structured.

# TONE
Clear and concise.

# AUDIENCE
General audience.

# RESPONSE FORMAT
- Introduction
- Main Content
- Key Takeaways
`;
}

optimizeBtn.addEventListener("click", () => {
  const prompt = promptInput.value.trim();

  if (!prompt) {
    alert("Please enter a prompt.");
    return;
  }

  optimizedOutput.value = optimizePrompt(prompt);
  optimizedOutput.classList.remove("prompt-updated");
    void optimizedOutput.offsetWidth;
    optimizedOutput.classList.add("prompt-updated");
    if (typeof animateButtonClick === "function") {
        animateButtonClick();
    }
    if (typeof animatePromptOutput === "function") {
        animatePromptOutput();
    }
});

const charCount = document.getElementById("charCount");
const wordCount = document.getElementById("wordCount");
const tokenCount = document.getElementById("tokenCount");

promptInput.addEventListener("input", () => {
  updateTokenMatrix(promptInput.value);
});

const pricing = {
  "GPT-4o": 5.0,
  "Claude 3.5 Sonnet": 3.0,
  "Gemini Pro": 2.0
};

const modelSelect = document.getElementById("modelSelect");
const costOutput = document.getElementById("costOutput");

function updateCost(tokens) {
  const model = modelSelect.value;

  const pricePerMillion = pricing[model];

  const cost = (tokens / 1_000_000) * pricePerMillion;

  costOutput.textContent = `$${cost.toFixed(6)}`;
}

function updateTokenMatrix(text) {
  const characters = text.length;

  const words = text.trim()
    ? text.trim().split(/\s+/).length
    : 0;

  const tokens = Math.ceil(characters / 4);

  charCount.textContent = characters;
  wordCount.textContent = words;
  tokenCount.textContent = tokens;

  updateCost(tokens);
  animateCost();
}

modelSelect.addEventListener("change", () => {
  const tokens = parseInt(tokenCount.textContent) || 0;
  updateCost(tokens);
});

const copyBtn = document.getElementById("copyBtn");
const toast = document.getElementById("toast");

copyBtn.addEventListener("click", async () => {
  const text = optimizedOutput.value;

  if (!text.trim()) return;

  try {
    await navigator.clipboard.writeText(text);

    if (typeof showToastAnimation === "function") {
       showToastAnimation();
    }

    toast.classList.remove(
      "translate-x-[150%]",
      "opacity-0"
    );

    toast.classList.add(
      "translate-x-0",
      "opacity-100"
    );

    setTimeout(() => {
      toast.classList.remove(
        "translate-x-0",
        "opacity-100"
      );

      toast.classList.add(
        "translate-x-[150%]",
        "opacity-0"
      );
    }, 2500);

  } catch (err) {
    console.error("Copy failed:", err);
  }
});