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
      this.deg = true; // Default to degrees mode
      this.updateDisplay();
    }
  
  
    delete() {
      this.currentOperand = this.currentOperand.toString().slice(0, -1);
      this.expression = this.expression.toString().slice(0, -1);
      this.updateDisplay();
    }
  
  
    appendNumber(number) {
      if (number === '.' && this.currentOperand.includes('.')) return;
      this.currentOperand = this.currentOperand.toString() + number.toString();
      this.expression = this.expression.toString() + number.toString();
      this.updateDisplay();
    }
  
  
    chooseOperation(operation) {
      if (this.currentOperand === '' && this.expression === '') return;
      if (this.currentOperand !== '') {
        this.expression += ` ${operation} `;
        this.currentOperand = '';
      } else {
        this.expression = this.expression.toString().slice(0, -3) + ` ${operation} `;
      }
      this.updateDisplay();
    }
  
  
    convertCurrentOperand() {
      const current = parseFloat(this.currentOperand);
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
    }
   
  
  
    choosePowerOperation() {
      if (this.currentOperand === '' && this.expression === '') return;
      if (this.currentOperand !== '') {
        this.expression += `^`;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
      }
      this.updateDisplay();
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
          this.currentOperand = eval(formattedExpression);
        }
        this.latestAnswer = this.currentOperand; // Store the latest answer
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
      return expression.replace(/÷/g, '/')
                       .replace(/×/g, '*')
                       .replace(/(\d)\(/g, '$1*(')
                       .replace(/\)(\d)/g, ')*$1');
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
            this.convertCurrentOperand(); // Convert and update the display
            return; // No need to update the display further
          case 'deg':
            this.deg = true;
            this.convertCurrentOperand(); // Convert and update the display
            return; // No need to update the display further
        case 'pow':
          if (this.previousOperand !== '' &&    !isNaN(parseFloat(this. previousOperand))) {
              const base = parseFloat(this.previousOperand);
              result = Math.pow(base, current);
            } else {
              return;
            }
            break;
        case 'ans':
          if (this.latestAnswer !== null) {
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
      if (bracket === '(') {
        if (this.currentOperand !== '' && !isNaN(this.currentOperand.slice(-1))) {
          this.expression += `*${bracket}`;
        } else {
          this.expression += bracket;
        }
        this.currentOperand = ''; // Reset current operand
      } else if (bracket === ')') {
        this.expression += bracket;
      }
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
      this.currentOperandTextElement.innerText = this.expression || this.getDisplayNumber(this.currentOperand);
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
  