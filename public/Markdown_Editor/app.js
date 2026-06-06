// --- DOM ELEMENTS ---
const markdownInput = document.getElementById('markdown-input');
const previewOutput = document.getElementById('preview-output');
const wordCountSpan = document.getElementById('word-count');
const charCountSpan = document.getElementById('char-count');
const readTimeSpan = document.getElementById('read-time');
const themeToggleBtn = document.getElementById('theme-toggle');

// --- 1. CUSTOM MARKDOWN PARSER ENGINE ---
function parseMarkdown(markdownText) {
    let html = markdownText;

    // Escape raw HTML entities to prevent basic XSS injections
    html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Code Blocks: ```javascript ... ```
    html = html.replace(/```([\w-]*)\n([\s\S]*?)\n```/g, function (match, lang, code) {
        return `<pre><code class="language-${lang || 'plaintext'}">${code}</code></pre>`;
    });

    // Inline Code: `code`
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Headings: # Heading 1 to ### Heading 3
    html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
    html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');

    // Bold (**text** or __text__)
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');

    // Italics (*text* or _text_)
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

    // Unordered Lists: * item or - item
    // Looks for lines starting with * or - and wraps them cleanly
    html = html.replace(/^\s*[\*|-]\s+(.*?)$/gm, '<li>$1</li>');
    // Wrap adjacent <li> items in a <ul> tag if not already trapped
    html = html.replace(/([^>])(<li>[\s\S]*?<\/li>)/g, '$1<ul>$2</ul>');

    // Links: [Text](URL)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Paragraphs: Turn double line breaks into paragraphs, skipping structural HTML elements
    html = html.split(/\n{2,}/).map(paragraph => {
        if (paragraph.trim().startsWith('<h') || paragraph.trim().startsWith('<pre') || paragraph.trim().startsWith('<ul')) {
            return paragraph;
        }
        return `<p>${paragraph.replace(/\n/g, '<br>')}</p>`;
    }).join('\n');

    return html;
}

// --- 2. LIVE TEXT ANALYTICS ---
function updateAnalytics(text) {
    const charCount = text.length;

    // Clean up text to count words accurately
    const cleanText = text.trim().replace(/\s+/g, ' ');
    const wordCount = cleanText === '' ? 0 : cleanText.split(' ').length;

    // Average reading speed: 200 words per minute
    const readingTime = Math.ceil(wordCount / 200);

    // Update DOM indicators
    charCountSpan.textContent = charCount;
    wordCountSpan.textContent = wordCount;
    readTimeSpan.textContent = `${readingTime}m`;
}

// --- 3. PERFORMANCE OPTIMIZATION: DEBOUNCE ---
// Prevents parsing execution on every single keystroke; waits for typing pause
function debounce(func, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
}

// Process rendering, state saving, and stats calculation
const processWorkspaceUpdate = () => {
    const rawContent = markdownInput.value;

    // Execute live preview compilation
    previewOutput.innerHTML = parseMarkdown(rawContent);

    // Update dashboard states
    updateAnalytics(rawContent);

    // Keep user's state synchronized locally
    localStorage.setItem('markcraft_cache', rawContent);
};

// Listen for updates using a 250ms debouncer layout
markdownInput.addEventListener('input', debounce(processWorkspaceUpdate, 250));

// --- 4. THEME TOGGLE (LOCAL STORAGE) ---
themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const targetTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.body.setAttribute('data-theme', targetTheme);
    themeToggleBtn.textContent = targetTheme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode';
    localStorage.setItem('markcraft_theme', targetTheme);
});

// --- 5. INITIALIZATION STAGE ---
function init() {
    // Restore Saved Workspace Content
    const cachedContent = localStorage.getItem('markcraft_cache');
    if (cachedContent !== null) {
        markdownInput.value = cachedContent;
    }

    // Restore Visual Theme Context
    const cachedTheme = localStorage.getItem('markcraft_theme') || 'dark';
    document.body.setAttribute('data-theme', cachedTheme);
    themeToggleBtn.textContent = cachedTheme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode';

    // Run first rendering compile pass
    processWorkspaceUpdate();
}

// Run app logic once script initializes
init();