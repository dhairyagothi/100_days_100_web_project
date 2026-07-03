import { LRUCacheEngine } from './cacheKernel.js';

// Instantiate an engine capped strictly to 3 unique items
const cache = new LRUCacheEngine(3);

const logTerminal = document.getElementById('cache-log');
const putBtn = document.getElementById('put-btn');
const getBtn = document.getElementById('get-btn');
const keyInput = document.getElementById('cache-key');
const valInput = document.getElementById('cache-value');
const visualList = document.getElementById('cache-state');

function updateDashboardMetrics(actionMessage) {
    logTerminal.textContent += `\n${actionMessage}`;
    visualList.innerHTML = '';

    // Print out status checks for our limited data space
    const targetKeys = ['lead_A', 'lead_B', 'lead_C', 'lead_D'];
    targetKeys.forEach(k => {
        const val = cache.get(k); // Note: Running get shifts priorities in real time!
        const itemRow = document.createElement('div');
        itemRow.style.padding = '4px 0';
        itemRow.textContent = `➔ Key Slot [${k}]: ${val !== null ? `Active (Val: ${val})` : 'Evicted / Empty (Null)'}`;
        visualList.appendChild(itemRow);
    });
}

putBtn.addEventListener('click', () => {
    const key = keyInput.value.trim();
    const val = valInput.value.trim();

    if (!key || !val) {
        alert("Please provide both a Key and Value tracking parameter!");
        return;
    }

    cache.put(key, val);
    updateDashboardMetrics(`[Cache Put] Committed ${key} ➔ "${val}". Total cached size: ${cache.activeCacheSize}/3`);

    keyInput.value = '';
    valInput.value = '';
});

getBtn.addEventListener('click', () => {
    const key = keyInput.value.trim();
    if (!key) {
        alert("Enter a target key to search!");
        return;
    }

    const start = performance.now();
    const result = cache.get(key);
    const duration = performance.now() - start;

    if (result !== null) {
        updateDashboardMetrics(`[Cache Hit] Located "${key}" in ${duration.toFixed(4)}ms. Updated priority matrix hooks.`);
    } else {
        updateDashboardMetrics(`[Cache Miss] Address "${key}" not found or already evicted from hardware bounds.`);
    }

    keyInput.value = '';
});