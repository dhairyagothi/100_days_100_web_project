// ── DOM References ──
const markdownInput = document.getElementById('markdown-input');
const previewOutput = document.getElementById('preview-output');
const wordCountSpan = document.getElementById('word-count');
const charCountSpan = document.getElementById('char-count');
const readTimeSpan  = document.getElementById('read-time');
const themeToggleBtn = document.getElementById('theme-toggle');
const dragbar   = document.getElementById('dragbar');
const workspace = document.querySelector('.workspace');
const editorPane  = document.querySelector('.editor-pane');
const previewPane = document.querySelector('.preview-pane');
const copyBtn   = document.getElementById('copy-btn');
const exportBtn = document.getElementById('export-btn');
const toast     = document.getElementById('toast');

// ── Toast Helper ──
let toastTimer = null;
function showToast(message, type = 'info') {
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.className = 'toast';
    }, 2500);
}

// ── Markdown Parser ──
function parseMarkdown(markdownText) {
    let html = markdownText;

    // Escape HTML
    html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Fenced code blocks
    html = html.replace(/```([\w-]*)\n([\s\S]*?)\n```/g, (_, lang, code) =>
        `<pre><code class="language-${lang || 'plaintext'}">${code}</code></pre>`
    );

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Headings
    html = html.replace(/^#### (.*?)$/gm, '<h4>$1</h4>');
    html = html.replace(/^### (.*?)$/gm,  '<h3>$1</h3>');
    html = html.replace(/^## (.*?)$/gm,   '<h2>$1</h2>');
    html = html.replace(/^# (.*?)$/gm,    '<h1>$1</h1>');

    // Horizontal rule
    html = html.replace(/^---$/gm, '<hr>');

    // Blockquote
    html = html.replace(/^&gt; (.*?)$/gm, '<blockquote>$1</blockquote>');

    // Bold & Italic
    html = html.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*([^*]+)\*\*/g,  '<strong>$1</strong>');
    html = html.replace(/__([^_]+)__/g,      '<strong>$1</strong>');
    html = html.replace(/\*([^*]+)\*/g,      '<em>$1</em>');
    html = html.replace(/_([^_]+)_/g,        '<em>$1</em>');

    // Strikethrough
    html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>');

    // Ordered list
    html = html.replace(/^\d+\. (.*?)$/gm, '<li data-ol>$1</li>');

    // Unordered list
    html = html.replace(/^\s*[\*\-] (.*?)$/gm, '<li>$1</li>');

    // Wrap consecutive <li data-ol> in <ol>
    html = html.replace(/(<li data-ol>.*?<\/li>\n?)+/g, match =>
        `<ol>${match.replace(/ data-ol/g, '')}</ol>`
    );

    // Wrap consecutive plain <li> in <ul>
    html = html.replace(/(<li>.*?<\/li>\n?)+/g, match => `<ul>${match}</ul>`);

    // Links & Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,
        '<img src="$2" alt="$1" style="max-width:100%;border-radius:6px;">');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Paragraphs
    html = html.split(/\n{2,}/).map(block => {
        const trimmed = block.trim();
        if (!trimmed) return '';
        if (/^<(h[1-6]|pre|ul|ol|blockquote|hr|img)/.test(trimmed)) return trimmed;
        return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
    }).join('\n');

    return html;
}

// ── Analytics ──
function updateAnalytics(text) {
    const charCount  = text.length;
    const cleanText  = text.trim().replace(/\s+/g, ' ');
    const wordCount  = cleanText === '' ? 0 : cleanText.split(' ').length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    charCountSpan.textContent = charCount;
    wordCountSpan.textContent = wordCount;
    readTimeSpan.textContent  = `${readingTime}m`;
}

// ── Debounce ──
function debounce(func, delay) {
    let id;
    return (...args) => {
        clearTimeout(id);
        id = setTimeout(() => func(...args), delay);
    };
}

// ── Core Update ──
const processWorkspaceUpdate = () => {
    const raw = markdownInput.value;
    previewOutput.innerHTML = parseMarkdown(raw);
    updateAnalytics(raw);
    localStorage.setItem('markcraft_cache', raw);
};

markdownInput.addEventListener('input', debounce(processWorkspaceUpdate, 250));

// ── Theme ──
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
    const current = document.body.getAttribute('data-theme') || 'dark';
    const next    = current === 'light' ? 'dark' : 'light';
    localStorage.setItem('markcraft_theme', next);
    updateThemeUI(next);
});

// ── Copy to Clipboard ──
copyBtn.addEventListener('click', async () => {
    const content = markdownInput.value;
    if (!content.trim()) {
        showToast('Nothing to copy — editor is empty!', 'info');
        return;
    }
    try {
        await navigator.clipboard.writeText(content);
        showToast('✅ Markdown copied to clipboard!', 'success');
    } catch {
        // Fallback for older browsers
        markdownInput.select();
        document.execCommand('copy');
        showToast('✅ Copied!', 'success');
    }
});

// ── Export as .md ──
exportBtn.addEventListener('click', () => {
    const content = markdownInput.value;
    if (!content.trim()) {
        showToast('Nothing to export — editor is empty!', 'info');
        return;
    }
    const blob     = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url      = URL.createObjectURL(blob);
    const anchor   = document.createElement('a');
    const filename = `markcraft-${new Date().toISOString().slice(0, 10)}.md`;
    anchor.href     = url;
    anchor.download  = filename;
    anchor.click();
    URL.revokeObjectURL(url);
    showToast(`⬇ Exported as ${filename}`, 'success');
});

// ── Formatting Toolbar ──
function wrapSelection(before, after = before, placeholder = '') {
    const start = markdownInput.selectionStart;
    const end   = markdownInput.selectionEnd;
    const selected = markdownInput.value.slice(start, end) || placeholder;
    const replacement = `${before}${selected}${after}`;
    markdownInput.setRangeText(replacement, start, end, 'select');
    markdownInput.focus();
    processWorkspaceUpdate();
}

function insertAtLineStart(prefix, placeholder = 'Text here') {
    const start = markdownInput.selectionStart;
    const end   = markdownInput.selectionEnd;
    const value = markdownInput.value;

    // Find line start
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const lineEnd   = value.indexOf('\n', end);
    const lineEndPos = lineEnd === -1 ? value.length : lineEnd;
    const lineContent = value.slice(lineStart, lineEndPos);

    const newLine = `${prefix}${lineContent || placeholder}`;
    markdownInput.setRangeText(newLine, lineStart, lineEndPos, 'end');
    markdownInput.focus();
    processWorkspaceUpdate();
}

document.querySelectorAll('.fmt-btn[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        switch (action) {
            case 'bold':          wrapSelection('**', '**', 'bold text'); break;
            case 'italic':        wrapSelection('*', '*', 'italic text'); break;
            case 'strikethrough': wrapSelection('~~', '~~', 'strikethrough'); break;
            case 'h1':            insertAtLineStart('# '); break;
            case 'h2':            insertAtLineStart('## '); break;
            case 'h3':            insertAtLineStart('### '); break;
            case 'ul':            insertAtLineStart('- '); break;
            case 'ol':            insertAtLineStart('1. '); break;
            case 'quote':         insertAtLineStart('> '); break;
            case 'code':          wrapSelection('`', '`', 'code'); break;
            case 'codeblock': {
                const start = markdownInput.selectionStart;
                const end   = markdownInput.selectionEnd;
                const sel   = markdownInput.value.slice(start, end) || 'code here';
                markdownInput.setRangeText(`\`\`\`\n${sel}\n\`\`\``, start, end, 'end');
                markdownInput.focus();
                processWorkspaceUpdate();
                break;
            }
            case 'link':
                wrapSelection('[', '](https://)', 'link text');
                break;
        }
    });
});

// ── Keyboard Shortcuts ──
markdownInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        if (e.key === 'b') { e.preventDefault(); wrapSelection('**', '**', 'bold text'); }
        if (e.key === 'i') { e.preventDefault(); wrapSelection('*', '*', 'italic text'); }
        if (e.key === 's') { e.preventDefault(); exportBtn.click(); }
    }
    // Tab key inserts spaces instead of switching focus
    if (e.key === 'Tab') {
        e.preventDefault();
        const start = markdownInput.selectionStart;
        markdownInput.setRangeText('  ', start, start, 'end');
        processWorkspaceUpdate();
    }
});

// ── Resizable Workspace ──
function initResizableWorkspace() {
    let isDragging = false;

    dragbar.addEventListener('mousedown', () => {
        isDragging = true;
        document.body.style.cursor = window.innerWidth <= 768 ? 'row-resize' : 'col-resize';
        document.body.style.userSelect = 'none';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const rect = workspace.getBoundingClientRect();
        if (window.innerWidth <= 768) {
            let pct = ((e.clientY - rect.top) / rect.height) * 100;
            pct = Math.min(Math.max(pct, 15), 85);
            editorPane.style.cssText  = `height:${pct}%; flex:none; width:100%`;
            previewPane.style.cssText = `height:${100 - pct}%; flex:none; width:100%`;
        } else {
            let pct = ((e.clientX - rect.left) / rect.width) * 100;
            pct = Math.min(Math.max(pct, 15), 85);
            editorPane.style.cssText  = `width:${pct}%; flex:none; height:100%`;
            previewPane.style.cssText = `width:${100 - pct}%; flex:none; height:100%`;
        }
    });

    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
    });

    dragbar.addEventListener('touchstart', () => { isDragging = true; }, { passive: true });
    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        const rect  = workspace.getBoundingClientRect();
        if (window.innerWidth <= 768) {
            let pct = ((touch.clientY - rect.top) / rect.height) * 100;
            pct = Math.min(Math.max(pct, 15), 85);
            editorPane.style.cssText  = `height:${pct}%; flex:none; width:100%`;
            previewPane.style.cssText = `height:${100 - pct}%; flex:none; width:100%`;
        } else {
            let pct = ((touch.clientX - rect.left) / rect.width) * 100;
            pct = Math.min(Math.max(pct, 15), 85);
            editorPane.style.cssText  = `width:${pct}%; flex:none; height:100%`;
            previewPane.style.cssText = `width:${100 - pct}%; flex:none; height:100%`;
        }
    }, { passive: false });
    window.addEventListener('touchend', () => { isDragging = false; });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            editorPane.style.height  = '100%';
            previewPane.style.height = '100%';
        } else {
            editorPane.style.width  = '100%';
            previewPane.style.width = '100%';
        }
    });
}

// ── Init ──
function init() {
    const cached = localStorage.getItem('markcraft_cache');
    if (cached !== null) markdownInput.value = cached;

    const theme = localStorage.getItem('markcraft_theme') || 'dark';
    updateThemeUI(theme);
    initResizableWorkspace();
    processWorkspaceUpdate();
}

init();