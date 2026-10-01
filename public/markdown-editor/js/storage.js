export function debounce(func, delay = 500) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
}

export function saveToStorage(content) {
    localStorage.setItem('gssoc_markdown_content', content);
    const status = document.getElementById('save-status');
    if (status) status.textContent = "Auto-saved";
}

export function loadFromStorage() {
    return localStorage.getItem('gssoc_markdown_content') || '';
}