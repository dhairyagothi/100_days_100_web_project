class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.clear();
  }

  clear() {
    this.currentOperand = '';
    this.previousOperand = '';
    this.operation = undefined;
    this.expression = ''; // To store the entire expression
    this.ans = 0; // Store the last answer
    this.deg = true; // Default to degrees mode
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
    this.expression = this.expression.toString().slice(0, -1);
  }

  appendNumber(number) {
    if (number === '.' && this.currentOperand.includes('.')) return;
    this.currentOperand = this.currentOperand.toString() + number.toString();
    this.expression = this.expression.toString() + number.toString();
  }

  chooseOperation(operation) {
    if (this.currentOperand === '' && operation !== '-') return; // allow negative numbers
    if (this.previousOperand !== '') {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
    this.expression += ` ${operation} `;
  }

  compute() {
    try {
      const formattedExpression = this.formatExpression(this.expression);
      this.currentOperand = eval(formattedExpression); // Evaluate the formatted expression
      this.ans = this.currentOperand; // Store the result as the last answer
      this.expression = this.currentOperand.toString();
    } catch (error) {
      this.currentOperand = 'Error';
    }
    this.operation = undefined;
    this.previousOperand = '';
    this.updateDisplay();
  }

  formatExpression(expression) {
    // Replace the division symbol with JavaScript's division operator
    return expression.replace(/÷/g, '/').replace(/×/g, '*');
  }

  computeFunction(func) {
    let result;
    const current = parseFloat(this.currentOperand);
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
        result = Math.sqrt(current);
        break;
      case 'log':
        result = Math.log10(current);
        break;
      case 'ln':
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
        return; // No need to update the display
      case 'deg':
        this.deg = true;
        return; // No need to update the display
      case 'ans':
        result = this.ans;
        break;
      default:
        return;
    }

    this.currentOperand = result;
    this.expression = result.toString(); // Update the expression with the result
    this.updateDisplay();
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
    if (bracket === '(' && this.currentOperand !== '' && !isNaN(this.currentOperand.slice(-1))) {
      this.expression += `*${bracket}`;
    } else {
      this.expression += bracket;
    }
    this.currentOperand = '';
    this.updateDisplay();
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
    this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
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
    activeCalculator().updateDisplay();
  });
});

// Event listeners for operation buttons
const operationButtons = document.querySelectorAll('[data-operation]');
operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    activeCalculator().chooseOperation(button.innerText);
    activeCalculator().updateDisplay();
  });
});

// Event listener for equals button
const equalsButton = document.querySelectorAll('[data-equals]');
equalsButton.forEach(button => {
  button.addEventListener('click', () => {
    activeCalculator().compute();
    activeCalculator().updateDisplay(); // Ensure the display is updated after computing
  });
});

// Event listener for all clear button
const allClearButton = document.querySelectorAll('[data-all-clear]');
allClearButton.forEach(button => {
  button.addEventListener('click', () => {
    activeCalculator().clear();
    activeCalculator().updateDisplay();
  });
});

// Event listener for delete button
const deleteButton = document.querySelectorAll('[data-delete]');
deleteButton.forEach(button => {
  button.addEventListener('click', () => {
    activeCalculator().delete();
    activeCalculator().updateDisplay();
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

// Event listener for toggling between basic and scientific calculator
const toggleScientific = document.getElementById('toggle-scientific');
toggleScientific.addEventListener('click', () => {
  const basicCalc = document.getElementById('basic-calculator');
  const scientificCalc = document.getElementById('scientific-calculator');
  scientificCalc.classList.toggle('hidden');
  basicCalc.classList.toggle('hidden');
});
