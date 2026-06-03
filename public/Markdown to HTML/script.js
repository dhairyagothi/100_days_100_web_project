/**
 * Pro Markdown Converter - Core Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('markdownEditor');
    const preview = document.getElementById('htmlPreview');
    const wordCount = document.getElementById('wordCount');
    const charCount = document.getElementById('charCount');
    const themeToggle = document.getElementById('themeToggle');
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('fileInput');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const clearBtn = document.getElementById('clearBtn');
    const toast = document.getElementById('toast');

    // Default Content
    const defaultMarkdown = `# Welcome to Pro Markdown

This is a **modern** Markdown to HTML converter.

## Features:
* Real-time preview
* Dark/Light mode
* Local persistence
* File exports

> "Markdown is intended to be as easy-to-read and easy-to-write as is feasible."

\`\`\`javascript
function helloWorld() {
  console.log("Modern and clean!");
}
\`\`\`

| Column 1 | Column 2 |
| :--- | :--- |
| Data A | Data B |

Enjoy writing!
`;

    // Initialize marked options
    marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: false,
        mangle: false
    });

    /**
     * Core Functions
     */

    const updatePreview = () => {
        const content = editor.value;
        preview.innerHTML = marked.parse(content);
        updateStats(content);
        localStorage.setItem('markdown_content', content);
    };

    const updateStats = (text) => {
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const chars = text.length;
        wordCount.textContent = `Words: ${words}`;
        charCount.textContent = `Characters: ${chars}`;
    };

    const showToast = (message) => {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    };

    /**
     * Event Listeners
     */

    editor.addEventListener('input', updatePreview);

    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
        localStorage.setItem('app_theme', newTheme);
    });

    // Clear content
    clearBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear the editor?')) {
            editor.value = '';
            updatePreview();
            showToast('Editor cleared');
        }
    });

        copyBtn.addEventListener('click', () => {
            const htmlContent = preview.innerHTML;
            navigator.clipboard.writeText(htmlContent).then(() => {
                showToast('HTML copied to clipboard!');
        }).catch(() => {
            showToast('Failed to copy.');
        });
    });

    // Download HTML
    downloadBtn.addEventListener('click', () => {
        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Exported Markdown</title>
    <style>body { font-family: sans-serif; padding: 2rem; line-height: 1.6; max-width: 800px; margin: auto; }</style>
</head>
<body>
    ${preview.innerHTML}
</body>
</html>`;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'markdown-export.html';
        a.click();
        URL.revokeObjectURL(url);
        showToast('Download started');
    });

    // Upload File
    uploadBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            editor.value = e.target.result;
            updatePreview();
            showToast('File uploaded successfully');
        };
        reader.readAsText(file);
        // Reset input
        fileInput.value = '';
    });

    // Sync Scroll (Optional feature)
    editor.addEventListener('scroll', () => {
        const percentage = editor.scrollTop / (editor.scrollHeight - editor.offsetHeight);
        preview.scrollTop = percentage * (preview.scrollHeight - preview.offsetHeight);
    });

    /**
     * Initialization
     */

    const init = () => {
        // Load theme
        const savedTheme = localStorage.getItem('app_theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';

        // Load content
        const savedContent = localStorage.getItem('markdown_content');
        if (savedContent !== null) {
            editor.value = savedContent;
        } else {
            editor.value = defaultMarkdown;
        }
        updatePreview();
    };

    init();
});