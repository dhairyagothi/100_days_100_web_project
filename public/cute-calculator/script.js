const display = document.getElementById("display");
const expression = document.getElementById("expression");
const historyPanel = document.getElementById("historyPanel");
const historyEmpty = document.getElementById("historyEmpty");
 
let history = [];
let justCalculated = false;
let historyOpen = false;
 
/* ── Ripple effect on every button click ── */
document.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", e => {
    const ripple = document.createElement("span");
    ripple.classList.add("ripple-effect");
    const rect = btn.getBoundingClientRect();
    ripple.style.left = (e.clientX - rect.left) + "px";
    ripple.style.top  = (e.clientY - rect.top)  + "px";
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 400);
  });
});
 
/* ── Append a value to the display ── */
function appendValue(value) {
  // After a result, typing a number starts fresh; typing an operator continues
  if (justCalculated && (!isNaN(value) || value === "(")) {
    display.value = "";
    expression.textContent = "";
    justCalculated = false;
  } else if (justCalculated) {
    justCalculated = false;
  }
 
  // Prevent multiple decimals in the same number segment
  if (value === ".") {
    const parts = display.value.split(/[\+\-\*\/\(\)]/);
    const lastPart = parts[parts.length - 1];
    if (lastPart.includes(".")) return;
  }
 
  display.value += value;
  updateExpression();
}
 
/* ── Update the small expression preview ── */
function updateExpression() {
  expression.textContent = display.value
    .replace(/\*/g, "×")
    .replace(/\//g, "÷")
    .replace(/-/g, "−");
}
 
/* ── Clear everything ── */
function clearDisplay() {
  display.value = "";
  expression.textContent = "";
  justCalculated = false;
}
 
/* ── Delete last character ── */
function deleteLast() {
  display.value = display.value.slice(0, -1);
  justCalculated = false;
  updateExpression();
}
 
/* ── Toggle history panel ── */
function toggleHistory() {
  historyOpen = !historyOpen;
  historyPanel.classList.toggle("open", historyOpen);
}
 
/* ── Add entry to history array and re-render ── */
function addToHistory(expr, result) {
  history.unshift({ expr, result });
  if (history.length > 10) history.pop();
  renderHistory();
}
 
/* ── Render history items into the panel ── */
function renderHistory() {
  // Remove old items
  historyPanel.querySelectorAll(".history-item").forEach(el => el.remove());
 
  if (history.length === 0) {
    historyEmpty.style.display = "block";
    return;
  }
 
  historyEmpty.style.display = "none";
 
  history.forEach(h => {
    const el = document.createElement("div");
    el.className = "history-item";
    el.textContent =
      h.expr.replace(/\*/g, "×").replace(/\//g, "÷") + " = " + h.result;
 
    // Tap a history item to reuse its result
    el.onclick = () => {
      display.value = String(h.result);
      expression.textContent = el.textContent;
      justCalculated = true;
      if (historyOpen) toggleHistory();
    };
 
    historyPanel.appendChild(el);
  });
}
 
/* ── Calculate the expression ── */
function calculate() {
  if (!display.value) return;
 
  // Replace % with /100 for correct evaluation
  let rawExpr = display.value.replace(/(\d+(\.\d+)?)%/g, "($1/100)");
 
  try {
    const result = Function('"use strict"; return (' + rawExpr + ")")();
    if (!isFinite(result)) throw new Error("Not finite");
 
    const formatted = parseFloat(result.toFixed(10)).toString();
    addToHistory(display.value, formatted);
 
    expression.textContent =
      display.value
        .replace(/\*/g, "×")
        .replace(/\//g, "÷")
        .replace(/-/g, "−") + " =";
 
    display.value = formatted;
    justCalculated = true;
 
    // Flash the result
    display.classList.remove("flash");
    void display.offsetWidth; // force reflow to restart animation
    display.classList.add("flash");
    setTimeout(() => display.classList.remove("flash"), 350);
 
  } catch {
    // Shake and show error
    display.classList.add("shake");
    setTimeout(() => {
      display.classList.remove("shake");
      display.value = "";
      expression.textContent = "Error ✗";
      setTimeout(() => {
        if (expression.textContent === "Error ✗") expression.textContent = "";
      }, 1500);
    }, 350);
  }
}
 
/* ── Keyboard support ── */
document.addEventListener("keydown", e => {
  if (e.key >= "0" && e.key <= "9")                   appendValue(e.key);
  else if (["+", "-", "*", "/", ".", "(", ")"].includes(e.key)) appendValue(e.key);
  else if (e.key === "%")                              appendValue("%");
  else if (e.key === "Enter" || e.key === "=")         calculate();
  else if (e.key === "Backspace")                      deleteLast();
  else if (e.key === "Escape")                         clearDisplay();
});
