const charPools = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+~`|}{[]:;?><,./-=",
};

const passwordDisplay = document.getElementById("password-display");
const copyBtn = document.getElementById("copy-btn");
const generateBtn = document.getElementById("generate-btn");

const lengthSlider = document.getElementById("length-slider");
const lengthVal = document.getElementById("length-val");

const cbUpper = document.getElementById("include-uppercase");
const cbLower = document.getElementById("include-lowercase");
const cbNumbers = document.getElementById("include-numbers");
const cbSymbols = document.getElementById("include-symbols");

const strengthText = document.getElementById("strength-text");
const meterFill = document.getElementById("meter-fill");

const ruleLength = document.getElementById("rule-length");
const ruleUpper = document.getElementById("rule-upper");
const ruleNumber = document.getElementById("rule-number");
const ruleSpecial = document.getElementById("rule-special");

function createToken() {
  let compositionPool = "";

  if (cbUpper.checked) compositionPool += charPools.uppercase;
  if (cbLower.checked) compositionPool += charPools.lowercase;
  if (cbNumbers.checked) compositionPool += charPools.numbers;
  if (cbSymbols.checked) compositionPool += charPools.symbols;

  if (!compositionPool) {
    passwordDisplay.value = "";
    evaluateStrength("");
    return;
  }

  const outputLength = parseInt(lengthSlider.value);
  let derivedBuffer = "";

  // Mathematical loop assembly tracking matrix calculations
  for (let i = 0; i < outputLength; i++) {
    const structuralIndex = Math.floor(Math.random() * compositionPool.length);
    derivedBuffer += compositionPool.charAt(structuralIndex);
  }

  passwordDisplay.value = derivedBuffer;
  evaluateStrength(derivedBuffer);
}

function evaluateStrength(pwd) {
  // Evaluation state markers via Regular Expression mappings
  const metrics = {
    hasLength: pwd.length >= 8,
    hasUpper: /[A-Z]/.test(pwd),
    hasNumber: /[0-9]/.test(pwd),
    hasSpecial: /[^A-Za-z0-9]/.test(pwd),
  };

  // Reflect rules styling states based on metric match flags
  toggleRuleState(ruleLength, metrics.hasLength);
  toggleRuleState(ruleUpper, metrics.hasUpper);
  toggleRuleState(ruleNumber, metrics.hasNumber);
  toggleRuleState(ruleSpecial, metrics.hasSpecial);

  if (!pwd) {
    strengthText.textContent = "Empty";
    strengthText.style.color = "#94a3b8";
    meterFill.style.width = "0%";
    return;
  }

  const passingCriteriaCount = Object.values(metrics).filter(Boolean).length;

  // Map security assessment labels to calculated metric steps
  if (passingCriteriaCount <= 1) {
    strengthText.textContent = "Weak";
    strengthText.style.color = "#ef4444";
    meterFill.style.width = "25%";
    meterFill.style.backgroundColor = "#ef4444";
  } else if (passingCriteriaCount === 2 || passingCriteriaCount === 3) {
    strengthText.textContent = "Medium";
    strengthText.style.color = "#f59e0b";
    meterFill.style.width = "60%";
    meterFill.style.backgroundColor = "#f59e0b";
  } else if (passingCriteriaCount === 4) {
    strengthText.textContent = "Strong";
    strengthText.style.color = "#10b981";
    meterFill.style.width = "100%";
    meterFill.style.backgroundColor = "#10b981";
  }
}

function toggleRuleState(element, isValid) {
  if (isValid) {
    element.classList.remove("invalid");
    element.classList.add("valid");
  } else {
    element.classList.remove("valid");
    element.classList.add("invalid");
  }
}

async function copyToClipboard() {
  const textToCopy = passwordDisplay.value;
  if (!textToCopy) return;

  try {
    await navigator.clipboard.writeText(textToCopy);
    const originalText = copyBtn.textContent;
    copyBtn.textContent = "Copied!";
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 1500);
  } catch (err) {
    console.error("Clipboard write lifecycle interrupted", err);
  }
}

// Interactive runtime tracking assignments
lengthSlider.addEventListener("input", (e) => {
  lengthVal.textContent = e.target.value;
  createToken();
});

passwordDisplay.addEventListener("input", (e) => {
  evaluateStrength(e.target.value);
});

generateBtn.addEventListener("click", createToken);
copyBtn.addEventListener("click", copyToClipboard);

// Execution pipeline launch sequence
createToken();
