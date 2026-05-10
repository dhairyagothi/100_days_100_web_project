const inputBox = document.getElementById("inputBox");
const previousDisplay = document.getElementById("previousDisplay");

const copyBtn = document.getElementById("copyBtn");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const historyList = document.getElementById("historyList");

let currentInput = "";
let history = JSON.parse(localStorage.getItem("calculatorHistory")) || [];

document.addEventListener("DOMContentLoaded", () => {
  attachButtonEvents();
  renderHistory();
  updateDisplay();
});

function updateDisplay() {
  inputBox.value = currentInput || "0";
}

function updatePreviousDisplay(text = "") {
  previousDisplay.textContent = text;
}

function appendValue(value) {
  if (currentInput.length >= 100) return;

  const lastChar = currentInput.slice(-1);

  if (isOperator(value) && isOperator(lastChar)) {
    currentInput = currentInput.slice(0, -1);
  }

  // Prevent multiple decimal points in same number
  if (value === ".") {
    const parts = currentInput.split(/[+\-*/()%]/);
    const lastPart = parts[parts.length - 1];
    if (lastPart.includes(".")) return;
  }

  currentInput += value;
  updateDisplay();
}

function clearDisplay() {
  currentInput = "";
  updatePreviousDisplay();
  updateDisplay();
}

function deleteLast() {
  currentInput = currentInput.slice(0, -1);
  updateDisplay();
}

function isOperator(char) {
  return ["+", "-", "*", "/", "%"].includes(char);
}

function preprocessExpression(expression) {
  let exp = expression;

  exp = exp.replace(/\bpi\b/g, `(${Math.PI})`);
  exp = exp.replace(/\be\b/g, `(${Math.E})`);

  exp = exp.replace(/(\d+(\.\d+)?)%/g, "($1/100)");

  exp = exp.replace(/sqrt\(/g, "Math.sqrt(");
  exp = exp.replace(/sin\(/g, "Math.sin(");
  exp = exp.replace(/cos\(/g, "Math.cos(");
  exp = exp.replace(/tan\(/g, "Math.tan(");
  exp = exp.replace(/log\(/g, "Math.log10(");

  return exp;
}

function calculate() {
  if (!currentInput.trim()) return;

  try {
    const expression = currentInput;
    const processedExpression = preprocessExpression(expression);

    let result = Function(`"use strict"; return (${processedExpression})`)();

    if (!Number.isFinite(result)) {
      throw new Error("Math Error");
    }

    result = Number(result.toFixed(10)).toString();

    updatePreviousDisplay(`${expression} =`);
    currentInput = result;
    updateDisplay();

    addToHistory(expression, result);
  } catch (error) {
    inputBox.value = "Error";
    currentInput = "";
  }
}
function addToHistory(expression, result) {
  const entry = {
    expression,
    result,
    time: new Date().toLocaleString(),
  };

  history.unshift(entry);

  // Limit history to 50 entries
  if (history.length > 50) {
    history = history.slice(0, 50);
  }

  localStorage.setItem("calculatorHistory", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = "";

  if (history.length === 0) {
    const li = document.createElement("li");
    li.className = "empty-history";
    li.textContent = "No calculations yet.";
    historyList.appendChild(li);
    return;
  }

  history.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `
            <strong>${item.expression}</strong> = ${item.result}
        `;
    li.addEventListener("click", () => {
      currentInput = item.result;
      updateDisplay();
    });

    historyList.appendChild(li);
  });
}

function clearHistory() {
  history = [];
  localStorage.removeItem("calculatorHistory");
  renderHistory();
}

async function copyResult() {
  try {
    await navigator.clipboard.writeText(inputBox.value);

    const originalText = copyBtn.textContent;
    copyBtn.textContent = "Copied!";

    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 1500);
  } catch (error) {
    const originalText = copyBtn.textContent;
    copyBtn.textContent = "Failed";

    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 1500);
  }
}
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
