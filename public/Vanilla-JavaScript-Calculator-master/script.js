class Calculator {
  constructor(
    previousOperandTextElement,
    currentOperandTextElement,
    modeBadge
  ) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.modeBadge = modeBadge;
    this.clear();
  }

  clear() {
    this.currentOperand = '';
    this.previousOperand = '';
    this.operation = undefined;
    this.expression = '';
    this.isDeg = true;
    this.latestAnswer = null;
    this.updateDisplay();
    this.updateModeBadge();
  }

  delete() {
    if (this.expression === 'Error') {
      this.clear();
      return;
    }
    this.expression = this.expression.slice(0, -1);
    this.currentOperand = this.expression;
    this.updateDisplay();
  }

  appendNumber(number) {
    if (this.expression === 'Error') this.expression = '';
    if (number === '.' && this.getLastNumber().includes('.')) return;
    this.expression += number.toString();
    this.currentOperand = this.expression;
    this.updateDisplay();
  }

  getLastNumber() {
    const parts = this.expression.split(/[\+\-\*÷\^]/);
    return parts[parts.length - 1] || '';
  }

  chooseOperation(operation) {
    if (this.expression === '' || this.expression === 'Error') return;
    // Replace trailing operator if any
    const lastChar = this.expression.slice(-2).trim();
    if (['+', '-', '*', '÷', '^'].includes(lastChar)) {
      this.expression = this.expression.slice(0, -3) + ` ${operation} `;
    } else {
      this.expression += ` ${operation} `;
    }
    this.currentOperand = '';
    this.updateDisplay();
  }

  choosePowerOperation() {
    if (this.expression === '' || this.expression === 'Error') return;
    this.expression += '^';
    this.currentOperand = '';
    this.updateDisplay();
  }

  appendBracket(bracket) {
    if (this.expression === 'Error') this.expression = '';
    if (bracket === '(') {
      const lastChar = this.expression.slice(-1);
      if (lastChar !== '' && !isNaN(lastChar) && lastChar !== ' ') {
        this.expression += '*(';
      } else {
        this.expression += '(';
      }
      this.currentOperand = '';
    } else {
      this.expression += ')';
    }
    this.updateDisplay();
  }

  compute() {
    if (this.expression === '' || this.expression === 'Error') return;
    try {
      const formatted = this.formatExpression(this.expression);

      // Security: Strict validation — only allow digits, basic operators, parens, spaces, dots
      if (!/^[\d+\-*/().%\s^]+$/.test(formatted)) {
        throw new Error('Invalid characters in expression');
      }

      // Safe math evaluation using a simple recursive-descent parser
      let result = this.safeEval(formatted);
      if (result === null || !isFinite(result) || isNaN(result)) {
        this.setError();
        return;
      }
      result = parseFloat(result.toPrecision(12));

      addToHistory(this.expression, result);

      this.latestAnswer = result;
      this.expression = result.toString();
      this.currentOperand = this.expression;
      this.previousOperand = '';
      this.operation = undefined;
      this.updateDisplay();
    } catch (error) {
      this.setError();
    }
  }

  // Safe recursive-descent parser — no eval/Function constructor
  safeEval(expr) {
    var tokens = expr.match(/\d+\.?\d*|[+\-*/()^]|%\s/g) || [];
    if (tokens.length === 0) return null;
    var pos = 0;

    function peek() {
      return tokens[pos];
    }
    function consume() {
      return tokens[pos++];
    }

    function parsePrimary() {
      var tok = peek();
      if (tok === '(') {
        consume();
        var val = parseExpr();
        if (peek() === ')') consume();
        return val;
      }
      if (tok === '-') {
        consume();
        return -parsePrimary();
      }
      var num = parseFloat(tok);
      if (!isNaN(num)) {
        consume();
        return num;
      }
      return null;
    }

    function parsePower() {
      var left = parsePrimary();
      if (left === null) return null;
      while (peek() === '^') {
        consume();
        var right = parsePrimary();
        if (right === null) return null;
        left = Math.pow(left, right);
      }
      return left;
    }

    function parseMulDiv() {
      var left = parsePower();
      if (left === null) return null;
      while (peek() === '*' || peek() === '/') {
        var op = consume();
        var right = parsePower();
        if (right === null) return null;
        if (op === '*') left *= right;
        else left /= right;
      }
      return left;
    }

    function parseExpr() {
      var left = parseMulDiv();
      if (left === null) return null;
      while (peek() === '+' || peek() === '-') {
        var op = consume();
        var right = parseMulDiv();
        if (right === null) return null;
        if (op === '+') left += right;
        else left -= right;
      }
      return left;
    }

    var result = parseExpr();
    if (result === null || pos !== tokens.length) return null;
    return result;
  }

  formatExpression(expression) {
    return expression
      .replace(/÷/g, '/')
      .replace(/×/g, '*')
      .replace(/\^/g, '^')
      .replace(/(\d)\(/g, '$1*(')
      .replace(/\)(\d)/g, ')*$1');
  }

  setError() {
    this.currentOperand = 'Error';
    this.expression = 'Error';
    this.operation = undefined;
    this.previousOperand = '';
    this.updateDisplay();
  }

  computeFunction(func) {
    if (func === 'rad') {
      this.isDeg = false;
      this.updateModeBadge();
      this.updateDegRadButtons();
      return;
    }
    if (func === 'deg') {
      this.isDeg = true;
      this.updateModeBadge();
      this.updateDegRadButtons();
      return;
    }
    if (func === 'ans') {
      if (this.latestAnswer !== null && this.latestAnswer !== undefined) {
        if (this.expression === 'Error') this.expression = '';
        this.expression += this.latestAnswer.toString();
        this.currentOperand = this.expression;
        this.updateDisplay();
      }
      return;
    }
    if (func === 'left-paren') {
      this.appendBracket('(');
      return;
    }
    if (func === 'right-paren') {
      this.appendBracket(')');
      return;
    }
    if (func === 'pow') {
      this.choosePowerOperation();
      return;
    }

    // All other functions need a current value
    const raw = this.getLastNumber() || this.expression || '0';
    const current = parseFloat(raw);
    if (isNaN(current) && !['pi', 'e'].includes(func)) return;

    let result;
    switch (func) {
      case 'sin':
        result = Math.sin(this.isDeg ? (current * Math.PI) / 180 : current);
        result = this.roundResult(result);
        break;
      case 'cos':
        result = Math.cos(this.isDeg ? (current * Math.PI) / 180 : current);
        result = this.roundResult(result);
        break;
      case 'tan':
        // tan(90) in degrees is undefined
        if (this.isDeg && Math.abs(current % 180) === 90) {
          this.setError();
          return;
        }
        result = Math.tan(this.isDeg ? (current * Math.PI) / 180 : current);
        result = this.roundResult(result);
        break;
      case 'sqrt':
        if (current < 0) {
          this.setError();
          return;
        }
        result = Math.sqrt(current);
        break;
      case 'log':
        if (current <= 0) {
          this.setError();
          return;
        }
        result = Math.log10(current);
        break;
      case 'ln':
        if (current <= 0) {
          this.setError();
          return;
        }
        result = Math.log(current);
        break;
      case 'exp':
        result = Math.exp(current);
        break;
      case 'factorial':
        if (current < 0 || !Number.isInteger(current)) {
          this.setError();
          return;
        }
        if (current > 170) {
          this.setError();
          return;
        }
        result = this.factorial(current);
        if (result === null) {
          this.currentOperand = 'Error';
          this.expression = 'Error';
          this.updateDisplay();
          return;
        }
        break;
      case 'percent':
        result = current / 100;
        break;
      case 'pi':
        result = Math.PI;
        break;
      case 'e':
        result = Math.E;
        break;
      default:
        return;
    }

    if (result === undefined || isNaN(result) || !isFinite(result)) {
      this.setError();
      return;
    }

    result = parseFloat(result.toPrecision(12));

    // ========== HISTORY ==========
    let historyExpr;
    switch (func) {
      case 'sqrt':
        historyExpr = `√(${raw})`;
        break;
      case 'percent':
        historyExpr = `${raw}%`;
        break;
      case 'pi':
        historyExpr = 'π';
        break;
      case 'e':
        historyExpr = 'e';
        break;
      case 'factorial':
        historyExpr = `${raw}!`;
        break;
      case 'exp':
        historyExpr = `e^(${raw})`;
        break;
      default:
        historyExpr = `${func}(${raw})`;
    }
    addToHistory(historyExpr, result);
    // ================================================

    this.latestAnswer = result;
    this.expression = result.toString();
    this.currentOperand = this.expression;
    this.updateDisplay();
  }

  roundResult(val) {
    // Clean up floating point errors like sin(180deg) = 1.2246e-16 → 0
    return Math.abs(val) < 1e-10 ? 0 : val;
  }

  factorial(n) {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  }

  updateDisplay() {
    const display = this.currentOperandTextElement;
    display.value = this.expression || this.currentOperand || '0';

    if (this.operation != null) {
      this.previousOperandTextElement.textContent = `${this.previousOperand} ${this.operation}`;
    } else {
      this.previousOperandTextElement.textContent = '';
    }

    // Animate display update
    display.classList.remove('blink');
    void display.offsetWidth; // reflow trick
    display.classList.add('blink');
  }

  updateModeBadge() {
    if (this.modeBadge) {
      this.modeBadge.textContent = this.isDeg ? 'DEG' : 'RAD';
      this.modeBadge.className = 'mode-badge ' + (this.isDeg ? 'deg' : 'rad');
    }
    this.updateDegRadButtons();
  }

  updateDegRadButtons() {
    // Update active state on deg/rad buttons
    const degBtn = document.querySelector('#scientific-calculator #deg-btn');
    const radBtn = document.querySelector('#scientific-calculator #rad-btn');
    if (degBtn && radBtn) {
      degBtn.classList.toggle('btn-mode-active', this.isDeg);
      radBtn.classList.toggle('btn-mode-active', !this.isDeg);
    }
  }
}

// ─── Init ───────────────────────────────────────────────────────────────────

const basicCalculator = new Calculator(
  document.querySelector('#basic-calculator [data-previous-operand]'),
  document.querySelector('#basic-calculator [data-current-operand]'),
  null
);

const scientificCalculator = new Calculator(
  document.querySelector('#scientific-calculator [data-previous-operand]'),
  document.querySelector('#scientific-calculator [data-current-operand]'),
  document.getElementById('mode-badge')
);

function activeCalculator() {
  return document
    .getElementById('scientific-calculator')
    .classList.contains('hidden')
    ? basicCalculator
    : scientificCalculator;
}

// ─── Button Event Listeners ──────────────────────────────────────────────────

document.querySelectorAll('[data-number]').forEach((btn) => {
  btn.addEventListener('click', () => {
    activeCalculator().appendNumber(btn.innerText.trim());
    addRipple(btn);
  });
});

document.querySelectorAll('[data-operation]').forEach((btn) => {
  btn.addEventListener('click', () => {
    activeCalculator().chooseOperation(btn.innerText.trim());
    addRipple(btn);
  });
});

document.querySelectorAll('[data-equals]').forEach((btn) => {
  btn.addEventListener('click', () => {
    activeCalculator().compute();
    addRipple(btn);
  });
});

document.querySelectorAll('[data-all-clear]').forEach((btn) => {
  btn.addEventListener('click', () => {
    activeCalculator().clear();
    addRipple(btn);
  });
});

document.querySelectorAll('[data-delete]').forEach((btn) => {
  btn.addEventListener('click', () => {
    activeCalculator().delete();
    addRipple(btn);
  });
});

document.querySelectorAll('[data-function]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const fn = btn.getAttribute('data-function');
    activeCalculator().computeFunction(fn);
    addRipple(btn);
  });
});

// ─── Toggle ──────────────────────────────────────────────────────────────────

document.querySelectorAll('#toggle-basic, #toggle-sci').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.getElementById('basic-calculator').classList.toggle('hidden');
    document.getElementById('scientific-calculator').classList.toggle('hidden');
  });
});

// ─── Keyboard Support ────────────────────────────────────────────────────────

window.addEventListener('keydown', (e) => {
  const calc = activeCalculator();
  const key = e.key;
  let matched = true;

  if (key >= '0' && key <= '9') calc.appendNumber(key);
  else if (key === '.') calc.appendNumber('.');
  else if (key === '+') calc.chooseOperation('+');
  else if (key === '-') calc.chooseOperation('-');
  else if (key === '*') calc.chooseOperation('*');
  else if (key === '/') {
    e.preventDefault();
    calc.chooseOperation('÷');
  } else if (key === 'Enter' || key === '=') calc.compute();
  else if (key === 'Backspace') calc.delete();
  else if (key === 'Escape') calc.clear();
  else if (key === '(') calc.appendBracket('(');
  else if (key === ')') calc.appendBracket(')');
  else if (key === '^') calc.choosePowerOperation();
  else if (key === 's') calc.computeFunction('sin');
  else if (key === 'c') calc.computeFunction('cos');
  else if (key === 't') calc.computeFunction('tan');
  else if (key === 'r') calc.computeFunction('sqrt');
  else if (key === 'l') calc.computeFunction('ln');
  else if (key === 'g') calc.computeFunction('log');
  else if (key === 'e' && !e.ctrlKey) calc.computeFunction('e');
  else if (key === 'x') calc.computeFunction('exp');
  else if (key === 'f') calc.computeFunction('factorial');
  else if (key === '%') calc.computeFunction('percent');
  else if (key === 'p') calc.computeFunction('pi');
  else if (key === 'd') calc.computeFunction('deg');
  else if (key === 'a') calc.computeFunction('rad');
  else matched = false;

  if (matched) {
    e.preventDefault();
    highlightButton(key);
  }
});

// ─── Visual Helpers ───────────────────────────────────────────────────────────

function highlightButton(key) {
  const gridId = document
    .getElementById('scientific-calculator')
    .classList.contains('hidden')
    ? 'basic-calculator'
    : 'scientific-calculator';
  const grid = document.getElementById(gridId);
  if (!grid) return;

  let btn = null;

  const keyMap = {
    '+': '[data-operation="+"]', // won't match text but we'll do text search
    '-': null,
    '*': null,
    '/': null,
    Enter: '[data-equals]',
    '=': '[data-equals]',
    Backspace: '[data-delete]',
    Escape: '[data-all-clear]',
    '(': '[data-function="left-paren"]',
    ')': '[data-function="right-paren"]',
    '^': '[data-function="pow"]',
    s: '[data-function="sin"]',
    c: '[data-function="cos"]',
    t: '[data-function="tan"]',
    r: '[data-function="sqrt"]',
    l: '[data-function="ln"]',
    g: '[data-function="log"]',
    e: '[data-function="e"]',
    x: '[data-function="exp"]',
    f: '[data-function="factorial"]',
    '%': '[data-function="percent"]',
    p: '[data-function="pi"]',
    d: '[data-function="deg"]',
    a: '[data-function="rad"]',
  };

  if ((key >= '0' && key <= '9') || key === '.') {
    grid.querySelectorAll('[data-number]').forEach((b) => {
      if (b.textContent.trim() === key) btn = b;
    });
  } else if (['+', '-', '*', '/'].includes(key)) {
    const opText = key === '/' ? '÷' : key;
    grid.querySelectorAll('[data-operation]').forEach((b) => {
      if (b.textContent.trim() === opText) btn = b;
    });
  } else if (keyMap[key]) {
    btn = grid.querySelector(keyMap[key]);
  }

  if (btn) triggerHighlight(btn);
}

function triggerHighlight(btn) {
  btn.classList.add('keyboard-active');
  setTimeout(() => btn.classList.remove('keyboard-active'), 150);
}

function addRipple(btn) {
  const ripple = document.createElement('span');
  ripple.classList.add('ripple');
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 500);
}

// Init deg/rad button states for scientific calculator
scientificCalculator.updateDegRadButtons();

// ========== HISTORY FUNCTIONS (ADDED AT THE BOTTOM - NOTHING ELSE CHANGED) ==========
let calculationHistory = [];
let filteredHistory = [];

function addToHistory(expression, result) {
  let displayResult =
    typeof result === 'number'
      ? Number.isInteger(result)
        ? result.toString()
        : parseFloat(result.toPrecision(12)).toString()
      : result.toString();

  calculationHistory.unshift({ expression: expression, result: displayResult });

  if (calculationHistory.length > 20) calculationHistory.pop();

  localStorage.setItem('calculatorHistory', JSON.stringify(calculationHistory));
  renderHistory();
}

function renderHistory(historyData = calculationHistory) {
  const historyList = document.getElementById('history-list');
  if (!historyList) return;

  if (historyData.length === 0) {
    const searchInput = document.getElementById('history-search');

    if (searchInput && searchInput.value.trim() !== '') {
      historyList.innerHTML =
        '<div class="history-no-results">No matching calculations found</div>';
    } else {
      historyList.innerHTML =
        '<div class="history-empty">No calculations yet<br>Click "=" to see history here</div>';
    }

    return;
  }

  let html = '';

  for (let i = 0; i < historyData.length; i++) {
    html += `
      <div class="history-item" data-expression="${encodeURIComponent(historyData[i].expression)}" data-result="${encodeURIComponent(historyData[i].result)}">
        ${escapeHtml(historyData[i].expression)} = ${escapeHtml(historyData[i].result)}
      </div>
    `;
  }

  historyList.innerHTML = html;
}
function filterHistory(searchTerm) {
  const term = searchTerm.toLowerCase().trim();

  if (!term) {
    renderHistory(calculationHistory);
    return;
  }

  filteredHistory = calculationHistory.filter((item) => {
    return (
      item.expression.toLowerCase().includes(term) ||
      item.result.toString().toLowerCase().includes(term)
    );
  });

  renderHistory(filteredHistory);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function exportHistoryTXT() {
  if (!calculationHistory.length) return;

  const content = calculationHistory
    .map((item) => `${item.expression} = ${item.result}`)
    .join('\n');

  const blob = new Blob([content], {
    type: 'text/plain',
  });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'calculation-history.txt';
  link.click();

  URL.revokeObjectURL(link.href);
}

function exportHistoryCSV() {
  if (!calculationHistory.length) return;

  let csv = 'Expression,Result\n';

  calculationHistory.forEach((item) => {
    csv += `"${item.expression}","${item.result}"\n`;
  });

  const blob = new Blob([csv], {
    type: 'text/csv',
  });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'calculation-history.csv';
  link.click();

  URL.revokeObjectURL(link.href);
}

async function copyHistory() {
  if (!calculationHistory.length) return;

  const text = calculationHistory
    .map((item) => `${item.expression} = ${item.result}`)
    .join('\n');

  try {
    await navigator.clipboard.writeText(text);

    const btn = document.getElementById('copy-history');

    if (btn) {
      const original = btn.textContent;
      btn.textContent = 'Copied!';

      setTimeout(() => {
        btn.textContent = original;
      }, 1500);
    }
  } catch (err) {
    console.error(err);
  }
}

function clearHistory() {
  calculationHistory = [];
  localStorage.removeItem('calculatorHistory');
  renderHistory();
}

function loadHistoryFromStorage() {
  try {
    const saved = localStorage.getItem('calculatorHistory');
    if (saved) calculationHistory = JSON.parse(saved);
    renderHistory();
  } catch (e) {
    calculationHistory = [];
  }
}

// Setup history click
const historyListEl = document.getElementById('history-list');
if (historyListEl) {
  historyListEl.onclick = function (e) {
    const item = e.target.closest('.history-item');
    if (item) {
     
     const result = decodeURIComponent(item.dataset.result);

const calc = activeCalculator();

if (calc.expression === 'Error') {
  calc.clear();
}

calc.expression = result;
calc.currentOperand = result;
calc.updateDisplay();
    }
  };
}

const exportTxtBtn = document.getElementById('export-txt');

if (exportTxtBtn) {
  exportTxtBtn.onclick = exportHistoryTXT;
}

const exportCsvBtn = document.getElementById('export-csv');

if (exportCsvBtn) {
  exportCsvBtn.onclick = exportHistoryCSV;
}

const copyHistoryBtn = document.getElementById('copy-history');

if (copyHistoryBtn) {
  copyHistoryBtn.onclick = copyHistory;
}

// Setup clear button
const clearHistoryBtn = document.getElementById('clear-history');
if (clearHistoryBtn) {
  clearHistoryBtn.onclick = function () {
    clearHistory();
  };
}

// Load history on page load
loadHistoryFromStorage();
const historySearchInput = document.getElementById('history-search');

if (historySearchInput) {
  historySearchInput.addEventListener('input', (e) => {
    filterHistory(e.target.value);
  });
}
// ========== END HISTORY FUNCTIONS ==========
// ===== THEME TOGGLE =====

const themeToggle = document.getElementById("theme-toggle");

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  if (themeToggle) {
    themeToggle.textContent = theme === "dark" ? "🌙" : "☀️";
  }

  localStorage.setItem("calculatorTheme", theme);
}

const savedTheme =
  localStorage.getItem("calculatorTheme") || "dark";

applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current =
      document.documentElement.getAttribute("data-theme") || "dark";

    applyTheme(current === "dark" ? "light" : "dark");
  });
}
