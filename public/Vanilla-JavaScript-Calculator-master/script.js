class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.clear();
    this.lastSelectionStart = 0;
    this.lastSelectionEnd = 0;
    this.setupSelectionTracker();
  }

  setupSelectionTracker() {
    const input = this.currentOperandTextElement;
    const track = () => {
      this.lastSelectionStart = input.selectionStart;
      this.lastSelectionEnd = input.selectionEnd;
    };
    input.addEventListener('keyup', track);
    input.addEventListener('click', track);
    input.addEventListener('focus', track);
    input.addEventListener('blur', track);
  }

  clear() {
    this.currentOperand = '';
    this.previousOperand = '';
    this.operation = undefined;
    this.expression = ''; // To store the entire expression
    this.deg = true; // Default to degrees mode
    this.updateDisplay();
    this.lastSelectionStart = 0;
    this.lastSelectionEnd = 0;
  }

  delete() {
    const input = this.currentOperandTextElement;
    let start = this.lastSelectionStart;
    let end = this.lastSelectionEnd;

    if (start === end) {
      if (start > 0) {
        this.expression = this.expression.slice(0, start - 1) + this.expression.slice(end);
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        this.updateDisplay();
        const newPos = start - 1;
        input.focus();
        input.setSelectionRange(newPos, newPos);
        this.lastSelectionStart = newPos;
        this.lastSelectionEnd = newPos;
      }
    } else {
      this.expression = this.expression.slice(0, start) + this.expression.slice(end);
      this.currentOperand = '';
      this.updateDisplay();
      input.focus();
      input.setSelectionRange(start, start);
      this.lastSelectionStart = start;
      this.lastSelectionEnd = start;
    }
  }

  appendNumber(number) {
    if (number === '.' && this.currentOperand.includes('.')) return;

    const input = this.currentOperandTextElement;
    const start = this.lastSelectionStart;
    const end = this.lastSelectionEnd;

    const before = this.expression.slice(0, start);
    const after = this.expression.slice(end);
    this.expression = before + number.toString() + after;
    this.currentOperand = this.currentOperand.toString() + number.toString();

    this.updateDisplay();

    const newPos = start + number.toString().length;
    input.focus();
    input.setSelectionRange(newPos, newPos);
    this.lastSelectionStart = newPos;
    this.lastSelectionEnd = newPos;
  }

  chooseOperation(operation) {
    if (this.currentOperand === '' && this.expression === '') return;

    const input = this.currentOperandTextElement;
    let start = this.lastSelectionStart;
    let end = this.lastSelectionEnd;

    if (start === this.expression.length && this.currentOperand === '') {
      this.expression = this.expression.toString().slice(0, -3) + ` ${operation} `;
      this.updateDisplay();
      const newPos = this.expression.length;
      input.focus();
      input.setSelectionRange(newPos, newPos);
      this.lastSelectionStart = newPos;
      this.lastSelectionEnd = newPos;
      return;
    }

    const opString = ` ${operation} `;
    const before = this.expression.slice(0, start);
    const after = this.expression.slice(end);
    this.expression = before + opString + after;
    this.currentOperand = '';

    this.updateDisplay();

    const newPos = start + opString.length;
    input.focus();
    input.setSelectionRange(newPos, newPos);
    this.lastSelectionStart = newPos;
    this.lastSelectionEnd = newPos;
  }

  convertCurrentOperand() {
    const currentVal = this.currentOperand || this.expression || '0';
    const current = parseFloat(currentVal);
    if (isNaN(current)) return;

    if (this.deg) {
      // Convert radians to degrees
      this.currentOperand = (current * (180 / Math.PI)).toString();
    } else {
      // Convert degrees to radians
      this.currentOperand = (current * (Math.PI / 180)).toString();
    }

    this.expression = this.currentOperand.toString();
    this.updateDisplay();

    const newPos = this.expression.length;
    this.currentOperandTextElement.focus();
    this.currentOperandTextElement.setSelectionRange(newPos, newPos);
    this.lastSelectionStart = newPos;
    this.lastSelectionEnd = newPos;
  }

  choosePowerOperation() {
    if (this.currentOperand === '' && this.expression === '') return;

    const input = this.currentOperandTextElement;
    const start = this.lastSelectionStart;
    const end = this.lastSelectionEnd;

    const before = this.expression.slice(0, start);
    const after = this.expression.slice(end);
    this.expression = before + `^` + after;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';

    this.updateDisplay();

    const newPos = start + 1;
    input.focus();
    input.setSelectionRange(newPos, newPos);
    this.lastSelectionStart = newPos;
    this.lastSelectionEnd = newPos;
  }

  compute() {
    try {
      const formattedExpression = this.formatExpression(this.expression);
      const powerMatch = formattedExpression.match(/(\d+)\^(\d+)/);
      if (powerMatch) {
        const base = parseFloat(powerMatch[1]);
        const exponent = parseFloat(powerMatch[2]);
        this.currentOperand = Math.pow(base, exponent);
      } else {
        const result = eval(formattedExpression);
        if (!isFinite(result)) {
          this.currentOperand = 'Error';
          this.expression = 'Error';
          this.operation = undefined;
          this.previousOperand = '';
          this.updateDisplay();
          return;
        }
        this.currentOperand = result;
      }
      this.latestAnswer = this.currentOperand;
      this.expression = this.currentOperand.toString();
    } catch (error) {
      this.currentOperand = 'Error';
      this.expression = 'Error';
    }
    this.operation = undefined;
    this.previousOperand = '';
    this.updateDisplay();

    const newPos = this.expression.length;
    this.currentOperandTextElement.focus();
    this.currentOperandTextElement.setSelectionRange(newPos, newPos);
    this.lastSelectionStart = newPos;
    this.lastSelectionEnd = newPos;
  }

  formatExpression(expression) {
    // Replace the division symbol with JavaScript's division operator
    return expression.replace(/÷/g, '/')
      .replace(/×/g, '*')
      .replace(/(\d)\(/g, '$1*(')
      .replace(/\)(\d)/g, ')*$1');
  }

  computeFunction(func) {
    let result;
    const currentVal = this.currentOperand || this.expression || '0';
    const current = parseFloat(currentVal);
    if (isNaN(current) && func !== 'ans') return;

    switch (func) {
      case 'sin':
        result = Math.sin(this.deg ? (current * Math.PI) / 180 : current);
        break;
      case 'cos':
        result = Math.cos(this.deg ? (current * Math.PI) / 180 : current);
        break;
      case 'tan':
        result = Math.tan(this.deg ? (current * Math.PI) / 180 : current);
        break;
      case 'sqrt':
        if (current < 0) {
          this.currentOperand = 'Error';
          this.expression = 'Error';
          this.updateDisplay();
          return;
        }
        result = Math.sqrt(current);
        break;
      case 'log':
        if (current <= 0) {
          this.currentOperand = 'Error';
          this.expression = 'Error';
          this.updateDisplay();
          return;
        }
        result = Math.log10(current);
        break;
      case 'ln':
        if (current <= 0) {
          this.currentOperand = 'Error';
          this.expression = 'Error';
          this.updateDisplay();
          return;
        }
        result = Math.log(current);
        break;
      case 'exp':
        result = Math.exp(current);
        break;
      case 'factorial':
        result = this.factorial(current);
        break;
      case 'percent':
        result = current / 100;
        break;
      case 'inv':
        result = 1 / current;
        break;
      case 'pi':
        result = Math.PI;
        break;
      case 'e':
        result = Math.E;
        break;
      case 'rad':
        this.deg = false;
        this.convertCurrentOperand(); // Convert and update the display
        return; // No need to update the display further
      case 'deg':
        this.deg = true;
        this.convertCurrentOperand(); // Convert and update the display
        return; // No need to update the display further
      case 'pow':
        if (this.previousOperand !== '' && !isNaN(parseFloat(this.previousOperand))) {
          const base = parseFloat(this.previousOperand);
          result = Math.pow(base, current);
        } else {
          return;
        }
        break;
      case 'ans':
        if (this.latestAnswer !== null && this.latestAnswer !== undefined) {
          this.currentOperand = this.latestAnswer;
          this.expression = this.latestAnswer.toString();
          this.updateDisplay();
        }
        return;
      default:
        return;
    }

    this.currentOperand = result;
    this.expression = result.toString();
    this.latestAnswer = result; // Update the latest answer
    this.updateDisplay();

    const newPos = this.expression.length;
    this.currentOperandTextElement.focus();
    this.currentOperandTextElement.setSelectionRange(newPos, newPos);
    this.lastSelectionStart = newPos;
    this.lastSelectionEnd = newPos;
  }

  factorial(n) {
    if (n === 0) return 1;
    let result = 1;
    for (let i = 1; i <= n; i++) {
      result *= i;
    }
    return result;
  }

  appendBracket(bracket) {
    const input = this.currentOperandTextElement;
    const start = this.lastSelectionStart;
    const end = this.lastSelectionEnd;

    let bracketString = bracket;
    if (bracket === '(') {
      const beforeChar = start > 0 ? this.expression[start - 1] : '';
      if (beforeChar !== '' && !isNaN(beforeChar) && beforeChar !== ' ') {
        bracketString = `*${bracket}`;
      }
      this.currentOperand = ''; // Reset current operand
    }

    const before = this.expression.slice(0, start);
    const after = this.expression.slice(end);
    this.expression = before + bracketString + after;

    this.updateDisplay();

    const newPos = start + bracketString.length;
    input.focus();
    input.setSelectionRange(newPos, newPos);
    this.lastSelectionStart = newPos;
    this.lastSelectionEnd = newPos;
  }

  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    let integerDisplay;

    if (isNaN(integerDigits)) {
      integerDisplay = '';
    } else {
      integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay() {
    this.currentOperandTextElement.value = this.expression || this.getDisplayNumber(this.currentOperand);
    if (this.operation != null) {
      this.previousOperandTextElement.innerText =
        `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
    } else {
      this.previousOperandTextElement.innerText = '';
    }
  }
}

// Helper function to determine the active calculator instance
function activeCalculator() {
  return document.getElementById('scientific-calculator').classList.contains('hidden') ? basicCalculator : scientificCalculator;
}

// Initialization of calculator instances
const basicCalculator = new Calculator(
  document.querySelector('#basic-calculator [data-previous-operand]'),
  document.querySelector('#basic-calculator [data-current-operand]')
);

const scientificCalculator = new Calculator(
  document.querySelector('#scientific-calculator [data-previous-operand]'),
  document.querySelector('#scientific-calculator [data-current-operand]')
);

// Event listeners for number buttons
const numberButtons = document.querySelectorAll('[data-number]');
numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    activeCalculator().appendNumber(button.innerText);
  });
});

// Event listeners for operation buttons
const operationButtons = document.querySelectorAll('[data-operation]');
operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    activeCalculator().chooseOperation(button.innerText);
  });
});

// Event listener for equals button
const equalsButton = document.querySelectorAll('[data-equals]');
equalsButton.forEach(button => {
  button.addEventListener('click', () => {
    activeCalculator().compute();
  });
});

// Event listener for all clear button
const allClearButton = document.querySelectorAll('[data-all-clear]');
allClearButton.forEach(button => {
  button.addEventListener('click', () => {
    activeCalculator().clear();
  });
});

// Event listener for delete button
const deleteButton = document.querySelectorAll('[data-delete]');
deleteButton.forEach(button => {
  button.addEventListener('click', () => {
    activeCalculator().delete();
  });
});

// Event listeners for function buttons
const functionButtons = document.querySelectorAll('[data-function]');
functionButtons.forEach(button => {
  button.addEventListener('click', () => {
    activeCalculator().computeFunction(button.getAttribute('data-function'));
  });
});

// Event listeners for bracket buttons
const leftParenButton = document.querySelectorAll('[data-function="left-paren"]');
leftParenButton.forEach(button => {
  button.addEventListener('click', () => {
    activeCalculator().appendBracket('(');
  });
});

const rightParenButton = document.querySelectorAll('[data-function="right-paren"]');
rightParenButton.forEach(button => {
  button.addEventListener('click', () => {
    activeCalculator().appendBracket(')');
  });
});

// Event listener for toggle scientific button
const toggleScientificButtons = document.querySelectorAll('#toggle-scientific');
toggleScientificButtons.forEach(button => {
  button.addEventListener('click', () => {
    document.getElementById('basic-calculator').classList.toggle('hidden');
    document.getElementById('scientific-calculator').classList.toggle('hidden');
  });
});

// event listener for the x^y button:
const powerButton = document.querySelectorAll('[data-function="pow"]');
powerButton.forEach(button => {
  button.addEventListener('click', () => {
    activeCalculator().choosePowerOperation();
  });
});

// Keyboard support & Visual highlight features
window.addEventListener('keydown', (e) => {
  const key = e.key;
  const activeCalc = activeCalculator();
  let matched = false;

  if (key >= '0' && key <= '9') {
    matched = true;
    activeCalc.appendNumber(key);
  } else if (key === '.') {
    matched = true;
    activeCalc.appendNumber(key);
  } else if (key === '+') {
    matched = true;
    activeCalc.chooseOperation('+');
  } else if (key === '-') {
    matched = true;
    activeCalc.chooseOperation('-');
  } else if (key === '*') {
    matched = true;
    activeCalc.chooseOperation('*');
  } else if (key === '/') {
    matched = true;
    activeCalc.chooseOperation('÷');
  } else if (key === 'Enter' || key === '=') {
    matched = true;
    activeCalc.compute();
  } else if (key === 'Backspace') {
    matched = true;
    activeCalc.delete();
  } else if (key === 'Escape') {
    matched = true;
    activeCalc.clear();
  } else if (key === '(') {
    matched = true;
    activeCalc.appendBracket('(');
  } else if (key === ')') {
    matched = true;
    activeCalc.appendBracket(')');
  } else if (key === '^') {
    matched = true;
    activeCalc.choosePowerOperation();
  } else if(key === 's') {
    matched=true;
    activeCalc.computeFunction('sin');
  } else if(key === 'c') {
    matched=true;
    activeCalc.computeFunction('cos');
  } else if(key === 't') {
    matched=true;
    activeCalc.computeFunction('tan');
  } else if(key === 'r') {
    matched=true;
    activeCalc.computeFunction('sqrt');
  } else if(key === 'l') {
    matched=true;
    activeCalc.computeFunction('ln');
  } else if(key === 'g') {
    matched=true;
    activeCalc.computeFunction('log');
  } else if(key === 'e') {
    matched=true;
    activeCalc.computeFunction('e');
  } else if(key === 'x') {
    matched=true;
    activeCalc.computeFunction('exp');
  } else if(key === 'f') {
    matched=true;
    activeCalc.computeFunction('factorial');
  } else if(key === '%') {
    matched=true;
    activeCalc.computeFunction('percent');
  } else if(key === 'i') {
    matched=true;
    activeCalc.computeFunction('inv');
  } else if(key === 'a') {
    matched=true;
    activeCalc.computeFunction('rad');
  } else if(key === 'p') {
    matched=true;
    activeCalc.computeFunction('pi');
  } else if(key === 'd') {
    matched=true;
    activeCalc.computeFunction('deg');
  }

  if (matched) {
    e.preventDefault();
    highlightButton(key);
  } else {
    // If the display input is focused, block other arbitrary typing but allow standard editing & selection shortcuts
    const activeEl = document.activeElement;
    if (activeEl === basicCalculator.currentOperandTextElement || activeEl === scientificCalculator.currentOperandTextElement) {
      const allowedNavigationKeys = [
        'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
        'Home', 'End', 'Tab', 'Shift', 'Control', 'Alt', 'Meta',
        'c', 'v', 'a', 'x'
      ];
      const isShortcut = e.ctrlKey || e.metaKey;
      if (!allowedNavigationKeys.includes(key) && !isShortcut) {
        e.preventDefault();
      }
    }
  }
});

function highlightButton(key) {
  const gridId = document.getElementById('scientific-calculator').classList.contains('hidden') ? 'basic-calculator' : 'scientific-calculator';
  const grid = document.getElementById(gridId);
  if (!grid) return;

  let selector = '';

  if (key >= '0' && key <= '9') {
    const buttons = grid.querySelectorAll('[data-number]');
    for (const btn of buttons) {
      if (btn.textContent.trim() === key) {
        triggerHighlight(btn);
        return;
      }
    }
  } else if (key === '.') {
    const buttons = grid.querySelectorAll('[data-number]');
    for (const btn of buttons) {
      if (btn.textContent.trim() === '.') {
        triggerHighlight(btn);
        return;
      }
    }
  } else if (key === '+') {
    selector = '[data-operation="+"]';
  } else if (key === '-') {
    selector = '[data-operation="-"]';
  } else if (key === '*') {
    selector = '[data-operation="*"]';
  } else if (key === '/') {
    selector = '[data-operation="÷"]';
  } else if (key === 'Enter' || key === '=') {
    selector = '[data-equals]';
  } else if (key === 'Backspace') {
    selector = '[data-delete]';
  } else if (key === 'Escape') {
    selector = '[data-all-clear]';
  } else if (key === '(') {
    selector = '[data-function="left-paren"]';
  } else if (key === ')') {
    selector = '[data-function="right-paren"]';
  } else if (key === '^') {
    selector = '[data-function="pow"]';
  }

  if (selector) {
    let btn = grid.querySelector(selector);
    if (!btn && (key === '+' || key === '-' || key === '*' || key === '/')) {
      const opText = key === '/' ? '÷' : key;
      const opButtons = grid.querySelectorAll('[data-operation]');
      for (const b of opButtons) {
        if (b.textContent.trim() === opText) {
          btn = b;
          break;
        }
      }
    }
    if (btn) {
      triggerHighlight(btn);
    }
  }
}

function triggerHighlight(button) {
  button.classList.add('keyboard-active');
  setTimeout(() => {
    button.classList.remove('keyboard-active');
  }, 150);
}