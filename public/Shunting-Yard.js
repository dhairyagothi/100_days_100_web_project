class RegexParser {
    // Define operator precedence
    static getPrecedence(char) {
        if (char === '*') return 3;
        if (char === '•') return 2; // Explicit Concatenation
        if (char === '|') return 1;
        return 0;
    }

    // Insert explicit concatenation tokens
    static formatRegex(regex) {
        let result = '';
        const operators = ['|', '*', ')'];

        for (let i = 0; i < regex.length; i++) {
            let c1 = regex[i];
            result += c1;

            if (i + 1 < regex.length) {
                let c2 = regex[i + 1];
                // Insert concatenation dot if current character isn't an operator/open-parenthesis
                // and next character isn't a closing operator/star
                if (c1 !== '(' && c1 !== '|' && c2 !== ')' && c2 !== '|' && c2 !== '*') {
                    result += '•';
                }
            }
        }
        return result;
    }

    // Convert Infix to Postfix notation
    static infixToPostfix(regex) {
        let formatted = this.formatRegex(regex);
        let output = '';
        let stack = [];

        for (let char of formatted) {
            if (char === '(') {
                stack.push(char);
            } else if (char === ')') {
                while (stack.length && stack[stack.length - 1] !== '(') {
                    output += stack.pop();
                }
                stack.pop(); // Remove '('
            } else if (['|', '•', '*'].includes(char)) {
                while (stack.length && this.getPrecedence(stack[stack.length - 1]) >= this.getPrecedence(char)) {
                    output += stack.pop();
                }
                stack.push(char);
            } else {
                output += char; // Literal symbols (a, b, c...)
            }
        }

        while (stack.length) {
            output += stack.pop();
        }
        return output;
    }
}

// Example usage:
// RegexParser.infixToPostfix("(a|b)*c") -> "ab|*c•"