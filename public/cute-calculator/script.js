const display = document.getElementById("display");
const expression = document.getElementById("expression");
const historyPanel = document.getElementById("historyPanel");
const historyEmpty = document.getElementById("historyEmpty");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const clearHistoryOverlay = document.getElementById("clearHistoryOverlay");
const cancelClearHistory = document.getElementById("cancelClearHistory");
const confirmClearHistory = document.getElementById("confirmClearHistory");
 
let history = [];
let justCalculated = false;
let historyOpen = false;
let clearDialogOpen = false;
let clearDialogClosing = false;
let previousFocus = null;

const HISTORY_STORAGE_KEY = "cuteCalculatorHistory";
const dialogFocusableSelector = "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";
 
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

/* ── Saved history helpers ── */
function loadHistory() {
  try {
    const savedHistory = JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY));
    history = Array.isArray(savedHistory) ? savedHistory.slice(0, 10) : [];
  } catch {
    history = [];
  }
}

function saveHistory() {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch {
    // History still works for the current session if storage is unavailable.
  }
}

function clearStoredHistory() {
  history = [];
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch {
    // Nothing else to clean up when storage is unavailable.
  }
  renderHistory();
}
 
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
  saveHistory();
  renderHistory();
}
 
/* ── Render history items into the panel ── */
function renderHistory() {
  // Remove old items
  historyPanel.querySelectorAll(".history-item").forEach(el => el.remove());
 
  if (history.length === 0) {
    historyEmpty.style.display = "block";
    clearHistoryBtn.disabled = true;
    return;
  }
 
  historyEmpty.style.display = "none";
  clearHistoryBtn.disabled = false;
 
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

/* ── Clear history confirmation ── */
function openClearHistoryDialog() {
  if (history.length === 0 || clearDialogOpen || clearDialogClosing) return;

  previousFocus = document.activeElement;
  clearDialogOpen = true;
  clearHistoryOverlay.classList.remove("closing");
  clearHistoryOverlay.classList.add("open");
  clearHistoryOverlay.setAttribute("aria-hidden", "false");
  confirmClearHistory.focus();
}

function closeClearHistoryDialog() {
  if (!clearDialogOpen || clearDialogClosing) return;

  clearDialogOpen = false;
  clearDialogClosing = true;
  clearHistoryOverlay.classList.remove("open");
  clearHistoryOverlay.classList.add("closing");
  clearHistoryOverlay.setAttribute("aria-hidden", "true");

  setTimeout(() => {
    clearHistoryOverlay.classList.remove("closing");
    clearDialogClosing = false;

    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }
    previousFocus = null;
  }, 150);
}

function confirmHistoryClear() {
  clearStoredHistory();
  closeClearHistoryDialog();
}

function trapClearDialogFocus(event) {
  if (!clearDialogOpen || event.key !== "Tab") return;

  const focusable = Array.from(clearHistoryOverlay.querySelectorAll(dialogFocusableSelector))
    .filter(el => !el.disabled && el.offsetParent !== null);
  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

clearHistoryBtn.addEventListener("click", openClearHistoryDialog);
cancelClearHistory.addEventListener("click", closeClearHistoryDialog);
confirmClearHistory.addEventListener("click", confirmHistoryClear);

clearHistoryOverlay.addEventListener("click", event => {
  if (event.target === clearHistoryOverlay) closeClearHistoryDialog();
});
 
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
  if (clearDialogOpen) {
    if (e.key === "Escape") {
      e.preventDefault();
      closeClearHistoryDialog();
      return;
    }

    trapClearDialogFocus(e);
    return;
  }

  if (e.key >= "0" && e.key <= "9")                   appendValue(e.key);
  else if (["+", "-", "*", "/", ".", "(", ")"].includes(e.key)) appendValue(e.key);
  else if (e.key === "%")                              appendValue("%");
  else if (e.key === "Enter" || e.key === "=")         calculate();
  else if (e.key === "Backspace")                      deleteLast();
  else if (e.key === "Escape")                         clearDisplay();
});

loadHistory();
renderHistory();
