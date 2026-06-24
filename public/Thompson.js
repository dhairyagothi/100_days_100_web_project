class State {
    constructor(id, isAccept = false) {
        this.id = id;
        this.isAccept = isAccept;
        this.transitions = {}; // Structure: { 'a': [State, State], 'ε': [State] }
    }

    addTransition(symbol, state) {
        if (!this.transitions[symbol]) {
            this.transitions[symbol] = [];
        }
        this.transitions[symbol].push(state);
    }
}

class NFA {
    constructor(startState, acceptState) {
        this.startState = startState;
        this.acceptState = acceptState;
    }
}

class AutomataCompiler {
    constructor() {
        this.stateCounter = 0;
    }

    createState(isAccept = false) {
        return new State(this.stateCounter++, isAccept);
    }

    // Build NFA from Postfix Regex string
    buildNFA(postfix) {
        let stack = [];

        for (let char of postfix) {
            if (char === '*') {
                // --- KLEENE STAR OPERATIONS ---
                let nfa = stack.pop();
                let start = this.createState();
                let accept = this.createState(true);

                nfa.acceptState.isAccept = false;

                start.addTransition('ε', nfa.startState);
                start.addTransition('ε', accept);
                nfa.acceptState.addTransition('ε', nfa.startState);
                nfa.acceptState.addTransition('ε', accept);

                stack.push(new NFA(start, accept));

            } else if (char === '•') {
                // --- CONCATENATION OPERATIONS ---
                let nfa2 = stack.pop();
                let nfa1 = stack.pop();

                nfa1.acceptState.isAccept = false;
                nfa1.acceptState.addTransition('ε', nfa2.startState);

                stack.push(new NFA(nfa1.startState, nfa2.acceptState));

            } else if (char === '|') {
                // --- ALTERNATION (UNION) OPERATIONS ---
                let nfa2 = stack.pop();
                let nfa1 = stack.pop();
                let start = this.createState();
                let accept = this.createState(true);

                nfa1.acceptState.isAccept = false;
                nfa2.acceptState.isAccept = false;

                start.addTransition('ε', nfa1.startState);
                start.addTransition('ε', nfa2.startState);
                nfa1.acceptState.addTransition('ε', accept);
                nfa2.acceptState.addTransition('ε', accept);

                stack.push(new NFA(start, accept));

            } else {
                // --- LITERAL MATCH CHARACTERS ---
                let start = this.createState();
                let accept = this.createState(true);
                start.addTransition(char, accept);

                stack.push(new NFA(start, accept));
            }
        }

        return stack.pop(); // The final structural composite NFA
    }
}