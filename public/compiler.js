// Stitching the modules together
window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('automataCanvas');
    const sim = new GraphSimulation(canvas);
    const compiler = new AutomataCompiler();

    // Test Regex: (a|b)*c
    const inputRegex = "(a|b)*c";

    // 1. Transform raw regex into postfix notation
    const postfix = RegexParser.infixToPostfix(inputRegex);

    // 2. Process postfix expression into an NFA object map
    const nfaGraph = compiler.buildNFA(postfix);

    // 3. Load the NFA map data structure into the physics visualizer
    sim.initFromNFA(nfaGraph);

    // 4. Fire up the continuous animation layout simulation loop
    sim.startLoop();
});