/**
 * Shared error handling utility
 */

export function safeDOMAccess(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`Element not found for selector: ${selector}`);
        return null;
    }
    return element;
}

export function handleError(error, context = '') {
    console.error(`Error in ${context}:`, error);
    // Could add telemetry/logging service integration here
}

export function createErrorNotifier() {
    const notifier = document.createElement('div');
    notifier.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #ff4444;
        color: white;
        padding: 15px;
        border-radius: 4px;
        display: none;
        z-index: 9999;
    `;
    document.body.appendChild(notifier);

    return {
        show: (message, duration = 3000) => {
            notifier.textContent = message;
            notifier.style.display = 'block';
            setTimeout(() => {
                notifier.style.display = 'none';
            }, duration);
        }
    };
}