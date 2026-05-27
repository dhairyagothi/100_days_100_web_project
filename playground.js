class VirtualPlayground {
    constructor() {
        this.currentLanguage = 'html';
        this.projects = [];
        this.currentProjectIndex = -1;
        this.originalCode = { html: '', css: '', js: '' };
        
        this.initElements();
        this.initEventListeners();
        this.loadProjects();
        this.updateLineNumbers();
    }

    initElements() {
        this.elements = {
            htmlEditor: document.getElementById('htmlEditor'),
            cssEditor: document.getElementById('cssEditor'),
            jsEditor: document.getElementById('jsEditor'),
            previewFrame: document.getElementById('previewFrame'),
            fullscreenFrame: document.getElementById('fullscreenFrame'),
            projectSelect: document.getElementById('projectSelect'),
            tabBtns: document.querySelectorAll('.tab-btn'),
            codeEditors: document.querySelectorAll('.code-editor'),
            lineNumbers: document.getElementById('lineNumbers'),
            runBtn: document.getElementById('runBtn'),
            resetBtn: document.getElementById('resetBtn'),
            copyBtn: document.getElementById('copyBtn'),
            shareBtn: document.getElementById('shareBtn'),
            fullscreenBtn: document.getElementById('fullscreenBtn'),
            refreshBtn: document.getElementById('refreshBtn'),
            exitFullscreen: document.getElementById('exitFullscreen'),
            fullscreenModal: document.getElementById('fullscreenModal'),
            toast: document.getElementById('toast'),
            toggleEditorBtn: document.getElementById('toggleEditorBtn'),
            togglePreviewBtn: document.getElementById('togglePreviewBtn'),
            editorPanel: document.querySelector('.editor-panel'),
            previewPanel: document.querySelector('.preview-panel'),
        };
    }

    initEventListeners() {
        // Tab switching
        this.elements.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn));
        });

        // Editor input
        this.elements.htmlEditor.addEventListener('input', (e) => {
            this.updateLineNumbers();
            this.autoRun();
        });
        this.elements.cssEditor.addEventListener('input', (e) => {
            this.updateLineNumbers();
            this.autoRun();
        });
        this.elements.jsEditor.addEventListener('input', (e) => {
            this.updateLineNumbers();
            this.autoRun();
        });

        // Control buttons
        this.elements.runBtn.addEventListener('click', () => this.runCode());
        this.elements.resetBtn.addEventListener('click', () => this.resetCode());
        this.elements.copyBtn.addEventListener('click', () => this.copyCode());
        this.elements.shareBtn.addEventListener('click', () => this.shareCode());
        this.elements.fullscreenBtn.addEventListener('click', () => this.enterFullscreen());
        this.elements.refreshBtn.addEventListener('click', () => this.runCode());
        this.elements.exitFullscreen.addEventListener('click', () => this.exitFullscreenMode());

        // Project select
        this.elements.projectSelect.addEventListener('change', (e) => {
            this.loadProject(parseInt(e.target.value));
        });

        // Mobile panel toggle
        this.elements.toggleEditorBtn.addEventListener('click', () => this.togglePanel('editor'));
        this.elements.togglePreviewBtn.addEventListener('click', () => this.togglePanel('preview'));

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                this.runCode();
            }
        });
    }

    async loadProjects() {
        try {
            const response = await fetch('projects.json');
            if (!response.ok) throw new Error('Failed to load projects');
            const data = await response.json();
            this.projects = data.projects;
            this.populateProjectSelect();
        } catch (error) {
            console.log('Projects file not found, using empty list');
            this.projects = [];
        }
    }

    populateProjectSelect() {
        const select = this.elements.projectSelect;
        select.innerHTML = '<option value="">Select a project...</option>';
        
        this.projects.forEach((project, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = project.name;
            select.appendChild(option);
        });
    }

    loadProject(index) {
        if (index < 0 || index >= this.projects.length) return;

        const project = this.projects[index];
        this.currentProjectIndex = index;

        this.elements.htmlEditor.value = project.html || '';
        this.elements.cssEditor.value = project.css || '';
        this.elements.jsEditor.value = project.js || '';

        this.originalCode = {
            html: project.html || '',
            css: project.css || '',
            js: project.js || ''
        };

        this.updateLineNumbers();
        this.runCode();
        this.showToast(`Loaded: ${project.name}`);
    }

    switchTab(btn) {
        const lang = btn.dataset.lang;
        this.currentLanguage = lang;

        // Update active tab
        this.elements.tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update visible editor
        this.elements.codeEditors.forEach(editor => editor.classList.remove('active'));
        document.getElementById(`${lang}Editor`).classList.add('active');

        this.updateLineNumbers();
    }

    updateLineNumbers() {
        const editor = document.querySelector('.code-editor.active');
        if (!editor) return;

        const lines = editor.value.split('\n').length;
        let lineNumbersHTML = '';

        for (let i = 1; i <= Math.max(lines, 20); i++) {
            lineNumbersHTML += i + '\n';
        }

        this.elements.lineNumbers.textContent = lineNumbersHTML;
    }

    autoRun() {
        // Auto-run with a small delay to prevent excessive updates
        clearTimeout(this.autoRunTimeout);
        this.autoRunTimeout = setTimeout(() => {
            this.runCode();
        }, 500);
    }

    runCode() {
        const html = this.elements.htmlEditor.value;
        const css = this.elements.cssEditor.value;
        const js = this.elements.jsEditor.value;

        const combinedHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    ${css}
                </style>
            </head>
            <body>
                ${html}
                <script>
                    ${js}
                </script>
            </body>
            </html>
        `;

        this.renderPreview(combinedHTML, this.elements.previewFrame);
        this.renderPreview(combinedHTML, this.elements.fullscreenFrame);
    }

    renderPreview(html, frame) {
        try {
            const blob = new Blob([html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            frame.src = url;
        } catch (error) {
            console.error('Error rendering preview:', error);
            this.showToast('Error rendering preview', 'error');
        }
    }

    resetCode() {
        if (!confirm('Reset code to original?')) return;

        this.elements.htmlEditor.value = this.originalCode.html;
        this.elements.cssEditor.value = this.originalCode.css;
        this.elements.jsEditor.value = this.originalCode.js;

        this.updateLineNumbers();
        this.runCode();
        this.showToast('Code reset', 'success');
    }

    copyCode() {
        const html = this.elements.htmlEditor.value;
        const css = this.elements.cssEditor.value;
        const js = this.elements.jsEditor.value;

        const combinedCode = `<!-- HTML -->\n${html}\n\n<!-- CSS -->\n<style>\n${css}\n</style>\n\n<!-- JavaScript -->\n<script>\n${js}\n</script>`;

        navigator.clipboard.writeText(combinedCode)
            .then(() => {
                this.showToast('Code copied to clipboard!', 'success');
            })
            .catch(() => {
                this.showToast('Failed to copy code', 'error');
            });
    }

    shareCode() {
        const html = encodeURIComponent(this.elements.htmlEditor.value);
        const css = encodeURIComponent(this.elements.cssEditor.value);
        const js = encodeURIComponent(this.elements.jsEditor.value);

        const shareUrl = `${window.location.origin}${window.location.pathname}?html=${html}&css=${css}&js=${js}`;

        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                this.showToast('Share link copied!', 'success');
            })
            .catch(() => {
                this.showToast('Failed to copy link', 'error');
            });
    }

    enterFullscreen() {
        this.elements.fullscreenModal.classList.add('active');
        this.runCode();
    }

    exitFullscreenMode() {
        this.elements.fullscreenModal.classList.remove('active');
    }

    togglePanel(panel) {
        const editor = this.elements.editorPanel;
        const preview = this.elements.previewPanel;
        const editorBtn = this.elements.toggleEditorBtn;
        const previewBtn = this.elements.togglePreviewBtn;

        if (panel === 'editor') {
            editor.classList.remove('hidden');
            preview.classList.remove('active');
            editorBtn.classList.add('active');
            previewBtn.classList.remove('active');
        } else {
            editor.classList.add('hidden');
            preview.classList.add('active');
            editorBtn.classList.remove('active');
            previewBtn.classList.add('active');
        }
    }

    showToast(message, type = 'info') {
        const toast = this.elements.toast;
        toast.textContent = message;
        toast.className = `toast show ${type}`;

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    loadFromURL() {
        const params = new URLSearchParams(window.location.search);
        const html = params.get('html');
        const css = params.get('css');
        const js = params.get('js');

        if (html) this.elements.htmlEditor.value = decodeURIComponent(html);
        if (css) this.elements.cssEditor.value = decodeURIComponent(css);
        if (js) this.elements.jsEditor.value = decodeURIComponent(js);

        if (html || css || js) {
            this.originalCode = {
                html: this.elements.htmlEditor.value,
                css: this.elements.cssEditor.value,
                js: this.elements.jsEditor.value
            };
            this.updateLineNumbers();
            this.runCode();
            this.showToast('Code loaded from shared link', 'success');
        }
    }
}

// Initialize playground when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.playground = new VirtualPlayground();
    window.playground.loadFromURL();
});
