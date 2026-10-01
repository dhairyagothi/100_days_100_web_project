import { StateStore } from './store.js';

// Instantiate our state system with structural starting data
const store = new StateStore({
    score: 0,
    activeUser: "Developer_Alpha",
    systemLogs: ["Kernel Initiated"]
});

// Cache target nodes instantly
const scoreDisplay = document.getElementById('score-view');
const logTerminal = document.getElementById('terminal-view');

const addPointsBtn = document.getElementById('add-points-btn');
const undoBtn = document.getElementById('undo-btn');
const redoBtn = document.getElementById('redo-btn');

// Subscribe decoupled runtime elements directly to state updates
store.subscribe((state) => {
    scoreDisplay.textContent = state.score;
    logTerminal.textContent = JSON.stringify(state, null, 2);
});

// Event Triggers mapping to discrete store mutator actions
addPointsBtn.addEventListener('click', () => {
    store.dispatch((draft) => {
        draft.score += 10;
        draft.systemLogs.push(`Score updated to ${draft.score}`);
    });
});

undoBtn.addEventListener('click', () => {
    store.undo();
});

redoBtn.addEventListener('click', () => {
    store.redo();
});