/**
 * Real-time Markdown Editor Logic
 */

// --- Global Theme & Settings Initialization ---
function initTheme() {
    const savedTheme = localStorage.getItem('md_theme') || 'theme-light';
    document.body.className = savedTheme;
}
initTheme();


// --- Custom Markdown to HTML Parser ---
function parseMarkdown(md) {
    if (!md) return '';

    let html = md;

    // Sanitize basic HTML tags to prevent XSS (very basic)
    html = html.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Headings: # Heading 1
    html = html.replace(/^###### (.*$)/gim, '<h6>$1</h6>');
    html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold: **bold** or __bold__
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');

    // Italic: *italic* or _italic_
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');

    // Strikethrough: ~~strike~~
    html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');

    // Inline Code: `code`
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');

    // Code Blocks: ```code```
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    // Images: ![alt](url)
    html = html.replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

    // Links: [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

    // Blockquotes: > quote
    html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

    // Horizontal Rule: --- or ***
    html = html.replace(/^(---|\*\*\*)$/gim, '<hr>');

    // Unordered Lists: - item or * item
    html = html.replace(/^\s*[-*]\s+(.*)$/gim, '<ul><li>$1</li></ul>');
    // Group adjacent ul elements
    html = html.replace(/<\/ul>\n<ul>/g, '\n');

    // Ordered Lists: 1. item
    html = html.replace(/^\s*\d+\.\s+(.*)$/gim, '<ol><li>$1</li></ol>');
    // Group adjacent ol elements
    html = html.replace(/<\/ol>\n<ol>/g, '\n');

    // Paragraphs: Wrap non-tagged lines in <p>
    // Split by double newline, wrap in p if it doesn't start with a block tag
    let blocks = html.split(/\n\n+/);
    html = blocks.map(block => {
        if (block.match(/^(<h|<ul|<ol|<li|<pre|<block|<hr)/i)) {
            return block;
        }
        return `<p>${block.replace(/\n/g, '<br>')}</p>`;
    }).join('\n');

    return html;
}


// --- Editor Page Logic ---
if (window.location.pathname.includes('editor.html')) {
    const mdInput = document.getElementById('markdown-input');
    const htmlOutput = document.getElementById('html-output');
    const docTitle = document.getElementById('doc-title');
    const saveStatus = document.getElementById('save-status');
    const btnSave = document.getElementById('btn-save');
    const btnExport = document.getElementById('btn-export');
    
    // Apply font size setting
    const savedFontSize = localStorage.getItem('md_font_size') || '16';
    mdInput.style.fontSize = savedFontSize + 'px';

    // Document ID management
    let currentDocId = null;

    function loadDocument() {
        const urlParams = new URLSearchParams(window.location.search);
        const docId = urlParams.get('id');
        const isNew = urlParams.get('new');

        if (docId) {
            const docs = JSON.parse(localStorage.getItem('md_docs') || '{}');
            if (docs[docId]) {
                currentDocId = docId;
                docTitle.value = docs[docId].title;
                mdInput.value = docs[docId].content;
                render();
                return;
            }
        }

        // Default empty state
        if (!isNew && !docId) {
            currentDocId = 'scratchpad';
            const scratch = localStorage.getItem('md_scratchpad') || '# Welcome to MarkItDown\n\nStart typing on the left to see the magic on the right!';
            mdInput.value = scratch;
            docTitle.value = 'Scratchpad';
        } else {
            currentDocId = Date.now().toString();
            mdInput.value = '# New Document\n';
            docTitle.value = 'Untitled Document';
        }
        render();
    }

    function saveDocument() {
        if (currentDocId === 'scratchpad') {
            localStorage.setItem('md_scratchpad', mdInput.value);
        } else {
            const docs = JSON.parse(localStorage.getItem('md_docs') || '{}');
            docs[currentDocId] = {
                id: currentDocId,
                title: docTitle.value,
                content: mdInput.value,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem('md_docs', JSON.stringify(docs));
        }

        saveStatus.innerText = 'Saved ' + new Date().toLocaleTimeString();
        setTimeout(() => saveStatus.innerText = '', 2000);
    }

    function render() {
        const mdText = mdInput.value;
        htmlOutput.innerHTML = parseMarkdown(mdText);
    }

    // Event Listeners
    mdInput.addEventListener('input', () => {
        render();
        saveStatus.innerText = 'Unsaved changes...';
    });

    // Auto-save every 5 seconds if typing
    let saveTimeout;
    mdInput.addEventListener('keyup', () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(saveDocument, 5000);
    });

    btnSave.addEventListener('click', saveDocument);

    // Sync Scrolling
    mdInput.addEventListener('scroll', () => {
        const percentage = mdInput.scrollTop / (mdInput.scrollHeight - mdInput.clientHeight);
        const targetScroll = percentage * (htmlOutput.parentElement.scrollHeight - htmlOutput.parentElement.clientHeight);
        htmlOutput.parentElement.scrollTop = targetScroll;
    });

    // Toolbar logic
    document.querySelectorAll('.toolbar-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            const start = mdInput.selectionStart;
            const end = mdInput.selectionEnd;
            const text = mdInput.value;
            let before = text.substring(0, start);
            let selection = text.substring(start, end);
            let after = text.substring(end, text.length);
            
            let insertion = '';

            switch(action) {
                case 'bold': insertion = `**${selection || 'bold text'}**`; break;
                case 'italic': insertion = `*${selection || 'italic text'}*`; break;
                case 'h1': insertion = `# ${selection || 'Heading 1'}`; break;
                case 'h2': insertion = `## ${selection || 'Heading 2'}`; break;
                case 'ul': insertion = `- ${selection || 'List item'}`; break;
                case 'ol': insertion = `1. ${selection || 'List item'}`; break;
                case 'link': insertion = `[${selection || 'Link text'}](https://)`; break;
                case 'image': insertion = `![Alt text](image-url.jpg)`; break;
                case 'code': insertion = `\`${selection || 'code'}\``; break;
                case 'codeblock': insertion = `\n\`\`\`\n${selection || 'code block'}\n\`\`\`\n`; break;
            }

            mdInput.value = before + insertion + after;
            render();
            mdInput.focus();
            saveStatus.innerText = 'Unsaved changes...';
        });
    });

    // Export HTML
    btnExport.addEventListener('click', () => {
        const fullHtml = `<!DOCTYPE html><html><head><title>${docTitle.value}</title></head><body>${htmlOutput.innerHTML}</body></html>`;
        const blob = new Blob([fullHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = docTitle.value.replace(/\s+/g, '_') + '.html';
        a.click();
        URL.revokeObjectURL(url);
    });

    loadDocument();
}


// --- Dashboard Page Logic ---
if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
    const docsGrid = document.getElementById('docs-grid');
    const emptyState = document.getElementById('empty-state');
    const searchInput = document.getElementById('search-docs');

    function loadDashboard() {
        const docs = JSON.parse(localStorage.getItem('md_docs') || '{}');
        const docArray = Object.values(docs).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        docsGrid.innerHTML = '';

        if (docArray.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';

        docArray.forEach(doc => {
            const card = document.createElement('a');
            card.href = `editor.html?id=${doc.id}`;
            card.classList.add('doc-card');
            
            // Strip markdown formatting for excerpt
            const plainText = doc.content.replace(/[#*`_\[\]()\-!>]/g, ' ').substring(0, 150) + '...';

            const date = new Date(doc.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

            card.innerHTML = `
                <h3>${doc.title}</h3>
                <div class="excerpt">${plainText}</div>
                <div class="meta">
                    <span>${date}</span>
                    <button class="delete-doc-btn" data-id="${doc.id}" title="Delete"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
            docsGrid.appendChild(card);
        });

        // Delete handlers
        document.querySelectorAll('.delete-doc-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault(); // prevent navigation
                const id = btn.dataset.id;
                if(confirm('Are you sure you want to delete this document?')) {
                    const d = JSON.parse(localStorage.getItem('md_docs') || '{}');
                    delete d[id];
                    localStorage.setItem('md_docs', JSON.stringify(d));
                    loadDashboard();
                }
            });
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            document.querySelectorAll('.doc-card').forEach(card => {
                const title = card.querySelector('h3').innerText.toLowerCase();
                if(title.includes(term)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    loadDashboard();
}

// --- Settings Page Logic ---
if (window.location.pathname.includes('settings.html')) {
    
    // Theme logic
    const themeCards = document.querySelectorAll('.theme-card');
    const currentTheme = localStorage.getItem('md_theme') || 'theme-light';
    
    themeCards.forEach(card => {
        if(card.dataset.theme === currentTheme) {
            card.classList.add('active');
        }

        card.addEventListener('click', () => {
            themeCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            const theme = card.dataset.theme;
            localStorage.setItem('md_theme', theme);
            document.body.className = theme;
        });
    });

    // Font size logic
    const fontVal = document.getElementById('font-val');
    const btnInc = document.getElementById('font-inc');
    const btnDec = document.getElementById('font-dec');
    
    let currentFontSize = parseInt(localStorage.getItem('md_font_size') || '16');
    fontVal.innerText = currentFontSize + 'px';

    btnInc.addEventListener('click', () => {
        if(currentFontSize < 32) {
            currentFontSize += 2;
            fontVal.innerText = currentFontSize + 'px';
            localStorage.setItem('md_font_size', currentFontSize);
        }
    });

    btnDec.addEventListener('click', () => {
        if(currentFontSize > 10) {
            currentFontSize -= 2;
            fontVal.innerText = currentFontSize + 'px';
            localStorage.setItem('md_font_size', currentFontSize);
        }
    });

    // Danger Zone
    const btnDeleteAll = document.getElementById('btn-delete-all');
    btnDeleteAll.addEventListener('click', () => {
        if(confirm('DANGER: This will permanently delete ALL your saved markdown documents. Are you absolutely sure?')) {
            localStorage.removeItem('md_docs');
            localStorage.removeItem('md_scratchpad');
            alert('All documents have been deleted.');
        }
    });
}
