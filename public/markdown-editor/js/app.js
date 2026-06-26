import { parseMarkdown } from './parser.js';
import { debounce, saveToStorage, loadFromStorage } from './storage.js';

const editor = document.getElementById('markdown-input');
const preview = document.getElementById('preview-output');
const saveStatus = document.getElementById('save-status');

// Metrics elements
const wordCount = document.getElementById('word-count');
const charCount = document.getElementById('char-count');
const readingTime = document.getElementById('reading-time');

// Debounced Auto-Save Engine
const processAutoSave = debounce((text) => {
    saveToStorage(text);
}, 800);

// Analytics Parser
function updateMetrics(text) {
    const totalChars = text.length;
    const wordsArray = text.trim().split(/\s+/).filter(word => word.length > 0);
    const totalWords = wordsArray.length;

    // Average reading pace: 200 words per minute
    const timeToRead = Math.ceil(totalWords / 200);

    charCount.textContent = totalChars;
    wordCount.textContent = totalWords;
    readingTime.textContent = `${timeToRead} min`;
}

// Global Core Event Handler
editor.addEventListener('input', (e) => {
    saveStatus.textContent = "Typing...";
    const rawText = e.target.value;

    // Render Markdown to HTML 
    preview.innerHTML = parseMarkdown(rawText);

    // Process analytics and save background pipelines
    updateMetrics(rawText);
    processAutoSave(rawText);
});

// App Initialization
window.addEventListener('DOMContentLoaded', () => {
    const savedData = loadFromStorage();
    if (savedData) {
        editor.value = savedData;
        preview.innerHTML = parseMarkdown(savedData);
        updateMetrics(savedData);
    }
});