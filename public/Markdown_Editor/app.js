const markdownInput = document.getElementById('markdown-input');
const previewOutput = document.getElementById('preview-output');
const wordCountSpan = document.getElementById('word-count');
const charCountSpan = document.getElementById('char-count');
const readTimeSpan = document.getElementById('read-time');
const themeToggleBtn = document.getElementById('theme-toggle');
const dragbar = document.getElementById('dragbar');
const workspace = document.querySelector('.workspace');
const editorPane = document.querySelector('.editor-pane');
const previewPane = document.querySelector('.preview-pane');

function parseMarkdown(markdownText) {
    let html = markdownText;

    html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    html = html.replace(/```([\w-]*)\n([\s\S]*?)\n```/g, function (match, lang, code) {
        return `<pre><code class="language-${lang || 'plaintext'}">${code}</code></pre>`;
    });

    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
    html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');

    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');

    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

    html = html.replace(/^\s*[\*|-]\s+(.*?)$/gm, '<li>$1</li>');
    html = html.replace(/([^>])(<li>[\s\S]*?<\/li>)/g, '$1<ul>$2</ul>');

    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    html = html.split(/\n{2,}/).map(paragraph => {
        if (paragraph.trim().startsWith('<h') || paragraph.trim().startsWith('<pre') || paragraph.trim().startsWith('<ul')) {
            return paragraph;
        }
        return `<p>${paragraph.replace(/\n/g, '<br>')}</p>`;
    }).join('\n');

    return html;
}

function updateAnalytics(text) {
    const charCount = text.length;
    const cleanText = text.trim().replace(/\s+/g, ' ');
    const wordCount = cleanText === '' ? 0 : cleanText.split(' ').length;
    const readingTime = Math.ceil(wordCount / 200);

    charCountSpan.textContent = charCount;
    wordCountSpan.textContent = wordCount;
    readTimeSpan.textContent = `${readingTime}m`;
}

function debounce(func, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
}

const processWorkspaceUpdate = () => {
    const rawContent = markdownInput.value;
    previewOutput.innerHTML = parseMarkdown(rawContent);
    updateAnalytics(rawContent);
    localStorage.setItem('markcraft_cache', rawContent);
};

markdownInput.addEventListener('input', debounce(processWorkspaceUpdate, 250));

function updateThemeUI(theme) {
    const icon = themeToggleBtn.querySelector('.theme-icon');
    const text = themeToggleBtn.querySelector('.theme-text');
    
    if (theme === 'light') {
        document.body.setAttribute('data-theme', 'light');
        if (icon) icon.textContent = '🌙';
        if (text) text.textContent = 'Dark Mode';
    } else {
        document.body.removeAttribute('data-theme');
        if (icon) icon.textContent = '☀️';
        if (text) text.textContent = 'Light Mode';
    }
}

themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme') || 'dark';
    const targetTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('markcraft_theme', targetTheme);
    updateThemeUI(targetTheme);
});

function initResizableWorkspace() {
    let isDragging = false;

    const startResize = (e) => {
        isDragging = true;
        document.body.style.cursor = window.innerWidth <= 768 ? 'row-resize' : 'col-resize';
        document.body.style.userSelect = 'none';
    };

    const resizeLayout = (e) => {
        if (!isDragging) return;

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        if (window.innerWidth <= 768) {
            const workspaceRect = workspace.getBoundingClientRect();
            const relativeY = clientY - workspaceRect.top;
            let percentage = (relativeY / workspaceRect.height) * 100;
            
            if (percentage < 15) percentage = 15;
            if (percentage > 85) percentage = 85;

            editorPane.style.height = `${percentage}%`;
            editorPane.style.flex = 'none';
            previewPane.style.height = `${100 - percentage}%`;
            previewPane.style.flex = 'none';
            
            editorPane.style.width = '100%';
            previewPane.style.width = '100%';
        } else {
            const workspaceRect = workspace.getBoundingClientRect();
            const relativeX = clientX - workspaceRect.left;
            let percentage = (relativeX / workspaceRect.width) * 100;

            if (percentage < 15) percentage = 15;
            if (percentage > 85) percentage = 85;

            editorPane.style.width = `${percentage}%`;
            editorPane.style.flex = 'none';
            previewPane.style.width = `${100 - percentage}%`;
            previewPane.style.flex = 'none';
            
            editorPane.style.height = '100%';
            previewPane.style.height = '100%';
        }
    };

    const stopResize = () => {
        if (!isDragging) return;
        isDragging = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
    };

    dragbar.addEventListener('mousedown', startResize);
    window.addEventListener('mousemove', resizeLayout);
    window.addEventListener('mouseup', stopResize);

    dragbar.addEventListener('touchstart', startResize, { passive: true });
    window.addEventListener('touchmove', resizeLayout, { passive: false });
    window.addEventListener('touchend', stopResize);

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            editorPane.style.height = '100%';
            previewPane.style.height = '100%';
        } else {
            editorPane.style.width = '100%';
            previewPane.style.width = '100%';
        }
    });
}

function init() {
    const cachedContent = localStorage.getItem('markcraft_cache');
    if (cachedContent !== null) {
        markdownInput.value = cachedContent;
    }

    const cachedTheme = localStorage.getItem('markcraft_theme') || 'dark';
    updateThemeUI(cachedTheme);
    initResizableWorkspace();
    processWorkspaceUpdate();
}

init();