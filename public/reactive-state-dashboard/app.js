import { ReactiveStateStore } from './stateKernel.js';

const store = new ReactiveStateStore();

// Cache dashboard interaction DOM items
const dispatchBtn = document.getElementById('dispatch-btn');
const inputKey = document.getElementById('state-key');
const inputVal = document.getElementById('state-value');
const terminalLog = document.getElementById('stream-terminal');

// Cache Observer Card Node References
const widget1 = document.getElementById('sub-widget-1');
const output1 = document.getElementById('out-1');
const timestamp1 = document.getElementById('ts-1');

const widget2 = document.getElementById('sub-widget-2');
const output2 = document.getElementById('out-2');
const timestamp2 = document.getElementById('ts-2');

// 1. Establish Observer Node Alpha subscription parameters
store.subscribe('leadPipeline', (updatedData) => {
    output1.textContent = updatedData;
    timestamp1.textContent = new Date().toLocaleTimeString();

    // Add neon flash activation pulse
    widget1.classList.add('flash-active');
    setTimeout(() => widget1.classList.remove('flash-active'), 300);
});

// 2. Establish Observer Node Beta subscription parameters
store.subscribe('leadPipeline', (updatedData) => {
    output2.textContent = updatedData;
    timestamp2.textContent = new Date().toLocaleTimeString();

    // Stagger slightly to visually demonstrate independent stream execution loops
    setTimeout(() => {
        widget2.classList.add('flash-active');
        setTimeout(() => widget2.classList.remove('flash-active'), 300);
    }, 100);
});

// Handle data dispatches via client interface triggers
dispatchBtn.addEventListener('click', () => {
    const channel = inputKey.value.trim();
    const payload = inputVal.value.trim();

    if (!payload) {
        alert("Please provide a transmission value payload!");
        return;
    }

    terminalLog.textContent += `\n[Action Dispatch] Broadcasting payload block on channel "${channel}"...`;

    const startLatency = performance.now();
    // Dispatch state modification into the kernel map structures
    const listenerCount = store.dispatch(channel, payload);
    const executionLatency = performance.now() - startLatency;

    terminalLog.textContent += `\n[Mutation Map Complete] State changed. Observers notified: ${listenerCount} | Engine Latency: ${executionLatency.toFixed(4)}ms`;
    terminalLog.scrollTop = terminalLog.scrollHeight; // Keep scrolling log down

    inputVal.value = '';
}); 