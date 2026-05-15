const inputBox = document.getElementById("inputBox");
const previousDisplay = document.getElementById("previousDisplay");

const copyBtn = document.getElementById("copyBtn");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const historyList = document.getElementById("historyList");

const calculatorState = {
  currentInput: "",
  history: JSON.parse(localStorage.getItem("calculatorHistory")) || [],
  lastAnswer: "",
};

/* =========================
   INITIALIZE APP
========================= */
document.addEventListener("DOMContentLoaded", () => {
  attachButtonEvents();
  renderHistory();
  updateDisplay();
});

/* =========================
   DISPLAY FUNCTIONS
========================= */
function updateDisplay() {
  inputBox.value = calculatorState.currentInput || "0";
}

function updatePreviousDisplay(text = "") {
  previousDisplay.textContent = text;
}

/* =========================
   UTILITY FUNCTIONS
========================= */
function isOperator(char) {
  return ["+", "-", "*", "/", "%"].includes(char);
}

function vibrateDevice() {
  if (navigator.vibrate) {
    navigator.vibrate(15);
  }
}

/* =========================
   APPEND VALUE
========================= */
function appendValue(value) {
  vibrateDevice();

  if (calculatorState.currentInput.length >= 100) return;

  const lastChar = calculatorState.currentInput.slice(-1);

  /* Prevent invalid starting operators */
  if (calculatorState.currentInput === "" && ["*", "/", "%"].includes(value)) {
    return;
  }

  /* Replace consecutive operators */
  if (isOperator(value) && isOperator(lastChar)) {
    calculatorState.currentInput = calculatorState.currentInput.slice(0, -1);
  }

  /* Prevent multiple decimals */
  if (value === ".") {
    const parts = calculatorState.currentInput.split(/[+\-*/()%]/);

    const lastPart = parts[parts.length - 1];

    if (lastPart.includes(".")) {
      return;
    }
  }

  /* Handle ANS */
  if (value === "ans") {
    if (calculatorState.lastAnswer) {
      calculatorState.currentInput += calculatorState.lastAnswer;
    }

    updateDisplay();
    return;
  }

  calculatorState.currentInput += value;

  updateDisplay();
}

/* =========================
   CLEAR DISPLAY
========================= */
function clearDisplay() {
  calculatorState.currentInput = "";

  updatePreviousDisplay();
  updateDisplay();
}

/* =========================
   DELETE LAST
========================= */
function deleteLast() {
  calculatorState.currentInput = calculatorState.currentInput.slice(0, -1);

  updateDisplay();
}

/* =========================
   PREPROCESS EXPRESSION
========================= */
function preprocessExpression(expression) {
  let exp = expression;

  /* Constants */
  exp = exp.replace(/\bpi\b/g, `(${Math.PI})`);
  exp = exp.replace(/\be\b/g, `(${Math.E})`);

  /* Percentages */
  exp = exp.replace(/(\d+(\.\d+)?)%/g, "($1/100)");

  /* Scientific functions */
  exp = exp.replace(/sqrt\(/g, "Math.sqrt(");
  exp = exp.replace(/sin\(/g, "Math.sin(");
  exp = exp.replace(/cos\(/g, "Math.cos(");
  exp = exp.replace(/tan\(/g, "Math.tan(");
  exp = exp.replace(/log\(/g, "Math.log10(");

  return exp;
}

/* =========================
   CALCULATE
========================= */
function calculate() {
  if (!calculatorState.currentInput.trim()) return;

  try {
    const expression = calculatorState.currentInput;

    const processedExpression = preprocessExpression(expression);

    /* Security validation */
    const validExpression = /^[0-9+\-*/().%\sMathPIEcosintaqlrg]+$/;

    if (!validExpression.test(processedExpression)) {
      throw new Error("Invalid Expression");
    }

    let result = Function(`"use strict"; return (${processedExpression})`)();

    if (!Number.isFinite(result)) {
      throw new Error("Math Error");
    }

    result = Number(result.toFixed(10)).toString();

    calculatorState.lastAnswer = result;

    updatePreviousDisplay(`${expression} =`);

    calculatorState.currentInput = result;

    updateDisplay();

    inputBox.classList.add("pop");

    setTimeout(() => {
      inputBox.classList.remove("pop");
    }, 200);

    addToHistory(expression, result);
  } catch (error) {
    inputBox.value = "Error";

    setTimeout(() => {
      clearDisplay();
    }, 1200);
  }
}

/* =========================
   HISTORY
========================= */
function addToHistory(expression, result) {
  const entry = {
    expression,
    result,
    time: new Date().toLocaleString(),
  };

  calculatorState.history.unshift(entry);

  /* Limit history */
  if (calculatorState.history.length > 50) {
    calculatorState.history = calculatorState.history.slice(0, 50);
  }

  localStorage.setItem(
    "calculatorHistory",
    JSON.stringify(calculatorState.history),
  );

  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = "";

  if (calculatorState.history.length === 0) {
    const li = document.createElement("li");

    li.className = "empty-history";
    li.textContent = "No calculations yet.";

    historyList.appendChild(li);

    return;
  }

  calculatorState.history.forEach((item) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span>${item.expression}</span>
      <br>
      <strong>= ${item.result}</strong>
    `;

    li.addEventListener("click", () => {
      calculatorState.currentInput = item.result;

      updateDisplay();
    });

    historyList.appendChild(li);
  });
}

/* =========================
   CLEAR HISTORY
========================= */
function clearHistory() {
  calculatorState.history = [];

  localStorage.removeItem("calculatorHistory");

  renderHistory();
}

/* =========================
   COPY RESULT
========================= */
async function copyResult() {
  try {
    await navigator.clipboard.writeText(inputBox.value);

    const originalText = copyBtn.innerHTML;

    copyBtn.innerHTML = `
      <i class="fa-solid fa-check"></i>
      Copied!
    `;

    setTimeout(() => {
      copyBtn.innerHTML = originalText;
    }, 1500);
  } catch (error) {
    const originalText = copyBtn.innerHTML;

    copyBtn.innerHTML = `
      <i class="fa-solid fa-xmark"></i>
      Failed
    `;

    setTimeout(() => {
      copyBtn.innerHTML = originalText;
    }, 1500);
  }
}

/* =========================
   KEYBOARD SUPPORT
========================= */
document.addEventListener("keydown", (e) => {
  const key = e.key;

  if (
    /[0-9]/.test(key) ||
    ["+", "-", "*", "/", ".", "%", "(", ")"].includes(key)
  ) {
    appendValue(key);

    return;
  }

  switch (key) {
    case "Enter":
      e.preventDefault();
      calculate();
      break;

    case "Backspace":
      deleteLast();
      break;

    case "Escape":
      clearDisplay();
      break;
  }
});

/* =========================
   BUTTON EVENTS
========================= */
function attachButtonEvents() {
  const buttons = document.querySelectorAll(".calculator button");

  buttons.forEach((button) => {
    const text = button.textContent.trim();

    const dataValue = button.dataset.value;

    if (dataValue) {
      button.addEventListener("click", () => {
        appendValue(dataValue);
      });

      return;
    }

    switch (text) {
      case "AC":
        button.addEventListener("click", clearDisplay);
        break;

      case "DEL":
        button.addEventListener("click", deleteLast);
        break;

      case "=":
        button.addEventListener("click", calculate);
        break;

      case "Copy":
        button.addEventListener("click", copyResult);
        break;

      case "Clear History":
        button.addEventListener("click", clearHistory);
        break;

      default:
        button.addEventListener("click", () => {
          appendValue(text);
        });
    }
  });
}
