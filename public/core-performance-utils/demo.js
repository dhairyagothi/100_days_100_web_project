import { debounce, getCachedElement, delegateEvent } from './perfUtils.js';

// Using Cached DOM selection instead of direct document.querySelector loops
const searchBox = getCachedElement('#search-box');
const statusLog = getCachedElement('#status-log');
const parentList = getCachedElement('#parent-list');

// Testing Debounced Input (Reduces layout rendering down to one final cycle)
const handleSearch = debounce((event) => {
    statusLog.textContent = `Optimized Search executed for: "${event.target.value}"`;
}, 500);

searchBox.addEventListener('input', (e) => {
    statusLog.textContent = 'Typing... (Debounce throttling execution)';
    handleSearch(e);
});

// Testing Event Delegation (Single event listener handling dynamic inner clicks)
delegateEvent(parentList, 'click', '.item', function (event) {
    alert(`Delegated Click detected! Active Element ID: ${this.getAttribute('data-id')}`);
});