import { SecureHashKernel } from './hashKernel.js';

const kernel = new SecureHashKernel();

// Cache node pointers
const logTerminal = document.getElementById('security-log');
const stringInput = document.getElementById('raw-input');
const processBtn = document.getElementById('process-btn');
const ledgerView = document.getElementById('ledger-view');

processBtn.addEventListener('click', () => {
    const rawValue = stringInput.value;

    if (!rawValue.trim()) {
        alert("Please enter a string transaction value!");
        return;
    }

    logTerminal.textContent += `\n[Intercepted Raw Input] Length: ${rawValue.length} bytes`;

    // Pipe transaction blocks through the security kernel
    const result = kernel.processPayload(rawValue);

    if (result) {
        logTerminal.textContent += `\n[Sanitizer Passed] Output Data: "${result.cleanData}"`;
        logTerminal.textContent += `\n[Signature Generated] Hex Hash: 0x${result.hashKey}`;
        logTerminal.textContent += `\n[Cache Registry] Total unique system hashes tracked: ${kernel.cacheSize}`;

        // Insert plain-text structural verification element row entry links
        const logRow = document.createElement('div');
        logRow.style.padding = '4px 0';
        logRow.textContent = `[Hash Link ID: 0x${result.hashKey}] ➔ Data Stream: ${result.cleanData}`;
        ledgerView.appendChild(logRow);
    } else {
        logTerminal.textContent += `\n[Security Alert] Dangerous payload drop or empty string input handled.`;
    }

    stringInput.value = '';
});