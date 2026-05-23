/**
 * Premium Calculator - Modern JavaScript
 * A fully functional calculator with premium UI/UX
 */

(function() {
    'use strict';

    // ============================================
    // STATE MANAGEMENT
    // ============================================

    const state = {
        expression: '0',
        result: '',
        previousResult: null,
        isNewInput: true,
        history: [],
        theme: 'dark'
    };

    // ============================================
    // DOM ELEMENTS
    // ============================================

    const elements = {
        display: document.getElementById('display'),
        expressionDisplay: document.getElementById('expressionDisplay'),
        resultDisplay: document.getElementById('resultDisplay'),
        historyPreview: document.getElementById('historyPreview'),
        historyExpression: document.getElementById('historyExpression'),
        historyPanel: document.getElementById('historyPanel'),
        historyList: document.getElementById('historyList'),
        historyEmpty: document.getElementById('historyEmpty'),
        themeToggle: document.getElementById('themeToggle'),
        historyToggle: document.getElementById('historyToggle'),
        shortcutsToggle: document.getElementById('shortcutsToggle'),
        shortcutsModal: document.getElementById('shortcutsModal'),
        closeShortcuts: document.getElementById('closeShortcuts'),
        clearHistory: document.getElementById('clearHistory'),
        keypad: document.querySelector('.keypad')
    };

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================

    /**
     * Format number with proper decimal handling
     */
    function formatNumber(num) {
        const parsed = parseFloat(num);
        if (isNaN(parsed)) return 'Error';

        // Check for very large or very small numbers
        if (Math.abs(parsed) >= 1e15 || (Math.abs(parsed) < 1e-10 && parsed !== 0)) {
            return parsed.toExponential(6);
        }

        // Use toLocaleString for nice formatting with up to 10 decimal places
        const formatted = parsed.toLocaleString('en-US', {
            maximumFractionDigits: 10,
            minimumFractionDigits: 0
        });

        return formatted;
    }

    /**
     * Safe mathematical expression evaluation
     */
    function evaluateExpression(expr) {
        try {
            // Clean the expression
            let cleanExpr = expr
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/−/g, '-')
                .replace(/,/g, '')
                .trim();

            // Validate the expression
            if (!cleanExpr || cleanExpr === '=') {
                return null;
            }

            // Check for invalid characters
            if (!/^[\d\s+\-*/.()]+$/.test(cleanExpr)) {
                throw new Error('Invalid characters');
            }

            // Prevent dangerous operations
            if (cleanExpr.includes('..') || cleanExpr.includes('.')) {
                const parts = cleanExpr.split(/[\+\-\*\/]/);
                for (const part of parts) {
                    if (part === '' || part === '.') {
                        throw new Error('Invalid number');
                    }
                }
            }

            // Evaluate safely
            const result = Function('"use strict"; return (' + cleanExpr + ')')();

            if (!isFinite(result)) {
                throw new Error('Division by zero or overflow');
            }

            return result;
        } catch (error) {
            return 'Error';
        }
    }

    /**
     * Add to calculation history
     */
    function addToHistory(expression, result) {
        const historyItem = {
            expression: expression,
            result: result,
            timestamp: new Date()
        };

        state.history.unshift(historyItem);

        // Keep only last 50 items
        if (state.history.length > 50) {
            state.history = state.history.slice(0, 50);
        }

        saveHistory();
        renderHistory();
    }

    /**
     * Save history to localStorage
     */
    function saveHistory() {
        try {
            localStorage.setItem('calculator_history', JSON.stringify(state.history));
        } catch (e) {
            console.warn('Could not save history to localStorage');
        }
    }

    /**
     * Load history from localStorage
     */
    function loadHistory() {
        try {
            const saved = localStorage.getItem('calculator_history');
            if (saved) {
                state.history = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Could not load history from localStorage');
            state.history = [];
        }
    }

    /**
     * Clear history
     */
    function clearHistory() {
        state.history = [];
        saveHistory();
        renderHistory();
    }

    /**
     * Format timestamp
     */
    function formatTime(date) {
        const now = new Date();
        const diff = now - date;

        // Less than 1 minute
        if (diff < 60000) {
            return 'Just now';
        }

        // Less than 1 hour
        if (diff < 3600000) {
            const mins = Math.floor(diff / 60000);
            return `${mins}m ago`;
        }

        // Less than 24 hours
        if (diff < 86400000) {
            const hours = Math.floor(diff / 3600000);
            return `${hours}h ago`;
        }

        // More than 24 hours - show date
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    }

    // ============================================
    // RENDER FUNCTIONS
    // ============================================

    /**
     * Update the display
     */
    function updateDisplay() {
        const expr = state.expression;
        const res = state.result;

        elements.expressionDisplay.textContent = expr;
        elements.resultDisplay.textContent = res;

        // Add error styling if needed
        if (res === 'Error') {
            elements.resultDisplay.classList.add('error');
        } else {
            elements.resultDisplay.classList.remove('error');
        }
    }

    /**
     * Update history preview
     */
    function updateHistoryPreview() {
        if (state.previousResult !== null && state.previousResult !== 'Error') {
            elements.historyExpression.textContent = formatNumber(state.previousResult);
        } else {
            elements.historyExpression.textContent = '';
        }
    }

    /**
     * Render history list
     */
    function renderHistory() {
        if (state.history.length === 0) {
            elements.historyList.innerHTML = '';
            elements.historyList.appendChild(elements.historyEmpty);
            elements.historyEmpty.style.display = 'flex';
            return;
        }

        elements.historyEmpty.style.display = 'none';

        const html = state.history.map((item, index) => `
            <div class="history-item" data-index="${index}">
                <div class="history-item-expression">${item.expression}</div>
                <div class="history-item-result">= ${item.result}</div>
                <div class="history-item-time">${formatTime(new Date(item.timestamp))}</div>
            </div>
        `).join('');

        elements.historyList.innerHTML = html;

        // Add click handlers to history items
        elements.historyList.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                loadHistoryItem(index);
            });
        });
    }

    /**
     * Load a history item into the calculator
     */
    function loadHistoryItem(index) {
        const item = state.history[index];
        if (item) {
            state.expression = item.expression;
            state.result = '';
            state.isNewInput = true;
            updateDisplay();
            closeHistoryPanel();
        }
    }

    // ============================================
    // CALCULATOR ACTIONS
    // ============================================

    /**
     * Handle number input
     */
    function inputNumber(num) {
        if (state.result === 'Error') {
            state.expression = '0';
            state.result = '';
        }

        if (state.isNewInput) {
            state.expression = num === '.' ? '0.' : num;
            state.isNewInput = false;
        } else {
            // Handle decimal point
            if (num === '.') {
                const lastNumber = state.expression.split(/[\+\-\*\/]/).pop();
                if (lastNumber.includes('.')) {
                    return; // Already has decimal
                }
            }

            // Prevent multiple leading zeros
            if (state.expression === '0' && num !== '.') {
                state.expression = num;
            } else {
                state.expression += num;
            }
        }

        // Clear previous result when typing new number
        if (state.previousResult !== null) {
            state.previousResult = null;
            updateHistoryPreview();
        }

        updateDisplay();
    }

    /**
     * Handle operator input
     */
    function inputOperator(operator) {
        if (state.result === 'Error') {
            state.expression = '0';
            state.result = '';
        }

        const lastChar = state.expression.slice(-1);

        // Replace operator if last character is an operator
        if (['+', '-', '*', '/'].includes(lastChar)) {
            state.expression = state.expression.slice(0, -1) + operator;
        } else if (state.expression !== '0') {
            state.expression += operator;
        }

        state.isNewInput = false;
        updateDisplay();
    }

    /**
     * Calculate the result
     */
    function calculate() {
        if (state.expression === '0' || state.isNewInput) {
            if (state.previousResult !== null) {
                state.expression = formatNumber(state.previousResult);
                state.isNewInput = false;
            }
            return;
        }

        const result = evaluateExpression(state.expression);

        if (result === 'Error') {
            state.result = 'Error';
            state.expression = 'Error';
        } else {
            const formattedResult = formatNumber(result);
            state.result = formattedResult;
            state.previousResult = result;

            // Add to history
            addToHistory(state.expression, formattedResult);
            updateHistoryPreview();

            state.expression = formattedResult;
            state.isNewInput = true;
        }

        updateDisplay();
    }

    /**
     * Clear all
     */
    function clear() {
        state.expression = '0';
        state.result = '';
        state.previousResult = null;
        state.isNewInput = true;
        elements.historyExpression.textContent = '';
        updateDisplay();
    }

    /**
     * Toggle sign (positive/negative)
     */
    function negate() {
        if (state.result === 'Error') {
            state.expression = '0';
            state.result = '';
        }

        // Get the last number in the expression
        const operators = ['+', '-', '*', '/'];
        let lastOperatorIndex = -1;

        for (let i = state.expression.length - 1; i >= 0; i--) {
            if (operators.includes(state.expression[i])) {
                lastOperatorIndex = i;
                break;
            }
        }

        const lastNumber = state.expression.slice(lastOperatorIndex + 1);

        if (lastNumber && lastNumber !== '0') {
            // Toggle the sign
            let newNumber;
            if (lastNumber.startsWith('-')) {
                newNumber = lastNumber.slice(1);
            } else {
                newNumber = '-' + lastNumber;
            }

            state.expression = state.expression.slice(0, lastOperatorIndex + 1) + newNumber;
            updateDisplay();
        }
    }

    /**
     * Calculate percentage
     */
    function percent() {
        if (state.result === 'Error') {
            state.expression = '0';
            state.result = '';
        }

        // Get the last number and convert to percentage
        const operators = ['+', '-', '*', '/'];
        let lastOperatorIndex = -1;

        for (let i = state.expression.length - 1; i >= 0; i--) {
            if (operators.includes(state.expression[i])) {
                lastOperatorIndex = i;
                break;
            }
        }

        const lastNumber = state.expression.slice(lastOperatorIndex + 1);

        if (lastNumber && lastNumber !== '0') {
            const num = parseFloat(lastNumber);
            if (!isNaN(num)) {
                const percentValue = num / 100;
                state.expression = state.expression.slice(0, lastOperatorIndex + 1) + formatNumber(percentValue);
                updateDisplay();
            }
        }
    }

    /**
     * Delete last character
     */
    function backspace() {
        if (state.result === 'Error') {
            clear();
            return;
        }

        if (state.isNewInput && state.expression !== '0') {
            // If we have a previous result, use it
            if (state.previousResult !== null) {
                state.expression = formatNumber(state.previousResult);
                state.isNewInput = false;
            }
            return;
        }

        if (state.expression.length === 1 || (state.expression.length === 2 && state.expression.startsWith('-'))) {
            state.expression = '0';
            state.isNewInput = true;
        } else {
            state.expression = state.expression.slice(0, -1);
        }

        updateDisplay();
    }

    // ============================================
    // THEME MANAGEMENT
    // ============================================

    /**
     * Toggle theme
     */
    function toggleTheme() {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', state.theme);
        localStorage.setItem('calculator_theme', state.theme);
    }

    /**
     * Load theme preference
     */
    function loadTheme() {
        const saved = localStorage.getItem('calculator_theme');
        if (saved) {
            state.theme = saved;
        } else {
            // Check system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
                state.theme = 'light';
            }
        }
        document.documentElement.setAttribute('data-theme', state.theme);
    }

    // ============================================
    // HISTORY PANEL
    // ============================================

    /**
     * Toggle history panel
     */
    function toggleHistoryPanel() {
        elements.historyPanel.classList.toggle('open');
    }

    /**
     * Close history panel
     */
    function closeHistoryPanel() {
        elements.historyPanel.classList.remove('open');
    }

    // ============================================
    // MODAL
    // ============================================

    /**
     * Open shortcuts modal
     */
    function openShortcutsModal() {
        elements.shortcutsModal.classList.add('open');
    }

    /**
     * Close shortcuts modal
     */
    function closeShortcutsModal() {
        elements.shortcutsModal.classList.remove('open');
    }

    // ============================================
    // EVENT HANDLERS
    // ============================================

    /**
     * Handle button click
     */
    function handleButtonClick(e) {
        const button = e.target.closest('.btn');
        if (!button) return;

        const number = button.dataset.number;
        const operator = button.dataset.operator;
        const action = button.dataset.action;

        // Remove active class from all operator buttons
        document.querySelectorAll('.btn-operator').forEach(btn => btn.classList.remove('active'));

        if (number !== undefined) {
            inputNumber(number);
        } else if (operator !== undefined) {
            // Add active class to clicked operator
            button.classList.add('active');
            inputOperator(operator);
        } else if (action !== undefined) {
            switch (action) {
                case 'clear':
                    clear();
                    break;
                case 'negate':
                    negate();
                    break;
                case 'percent':
                    percent();
                    break;
                case 'backspace':
                    backspace();
                    break;
                case 'calculate':
                    calculate();
                    // Remove active class after calculation
                    setTimeout(() => {
                        document.querySelectorAll('.btn-operator').forEach(btn => btn.classList.remove('active'));
                    }, 100);
                    break;
            }
        }
    }

    /**
     * Handle keyboard input
     */
    function handleKeyboard(e) {
        const key = e.key;

        // Numbers
        if (/^[0-9]$/.test(key)) {
            inputNumber(key);
            return;
        }

        // Operators
        switch (key) {
            case '+':
            case '-':
            case '*':
            case '/':
                document.querySelectorAll('.btn-operator').forEach(btn => {
                    if (btn.dataset.operator === key) {
                        btn.classList.add('active');
                    }
                });
                inputOperator(key);
                break;

            case 'Enter':
            case '=':
                e.preventDefault();
                calculate();
                document.querySelectorAll('.btn-operator').forEach(btn => btn.classList.remove('active'));
                break;

            case 'Escape':
                e.preventDefault();
                clear();
                break;

            case 'Backspace':
                e.preventDefault();
                backspace();
                break;

            case '.':
            case ',':
                inputNumber('.');
                break;

            case '%':
                percent();
                break;
        }
    }

    /**
     * Handle keyboard release
     */
    function handleKeyboardUp(e) {
        if (['+', '-', '*', '/'].includes(e.key)) {
            document.querySelectorAll('.btn-operator').forEach(btn => btn.classList.remove('active'));
        }
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    /**
     * Initialize the calculator
     */
    function init() {
        // Load saved data
        loadTheme();
        loadHistory();

        // Render initial state
        updateDisplay();
        renderHistory();

        // Event listeners
        elements.keypad.addEventListener('click', handleButtonClick);
        document.addEventListener('keydown', handleKeyboard);
        document.addEventListener('keyup', handleKeyboardUp);

        // Theme toggle
        elements.themeToggle.addEventListener('click', toggleTheme);

        // History panel
        elements.historyToggle.addEventListener('click', toggleHistoryPanel);
        elements.clearHistory.addEventListener('click', clearHistory);

        // Shortcuts modal
        elements.shortcutsToggle.addEventListener('click', openShortcutsModal);
        elements.closeShortcuts.addEventListener('click', closeShortcutsModal);
        elements.shortcutsModal.addEventListener('click', (e) => {
            if (e.target === elements.shortcutsModal) {
                closeShortcutsModal();
            }
        });

        // Close modals on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeShortcutsModal();
                closeHistoryPanel();
            }
        });

        console.log('Premium Calculator initialized');
    }

    // Start the application
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();