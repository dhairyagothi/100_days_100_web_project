document.addEventListener('DOMContentLoaded', () => {
    const markdownInput = document.getElementById('markdown-input');
    const htmlPreview = document.getElementById('html-preview');
    const downloadMdBtn = document.getElementById('download-md');
    const downloadHtmlBtn = document.getElementById('download-html');

    // Configure marked to use highlight.js for code blocks
    marked.setOptions({
        highlight: function(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        },
        langPrefix: 'hljs language-',
        breaks: true,
        gfm: true
    });

    // Default markdown text
    const defaultMarkdown = `# Welcome to the Markdown Previewer! ✨

This is a real-time Markdown to HTML converter. Type on the left, and see the rendering on the right!

## Features

- **Real-time rendering:** See your changes instantly.
- **Syntax Highlighting:** Beautiful code blocks out of the box.
- **XSS Protection:** Outputs are safely sanitized.
- **Exporting:** Download your work as \`.md\` or \`.html\`.

### Code Example

\`\`\`javascript
function calculateSum(a, b) {
    return a + b;
}
console.log("Sum: ", calculateSum(5, 7));
\`\`\`

### Elements Support

> "Simplicity is the soul of efficiency." – Austin Freeman

Here's a table for you:

| Task | Status |
|------|--------|
| Design | Done |
| Coding | Done |
| Testing | In Progress |

Enjoy writing!`;

    // Function to render markdown
    const renderMarkdown = (markdownText) => {
        // Parse markdown to raw HTML
        const rawHtml = marked.parse(markdownText);
        // Sanitize the HTML to prevent XSS
        const cleanHtml = DOMPurify.sanitize(rawHtml);
        // Inject into preview pane
        htmlPreview.innerHTML = cleanHtml;
    };

    // Initialize with default text
    markdownInput.value = defaultMarkdown;
    renderMarkdown(defaultMarkdown);

    // Event listener for real-time preview
    markdownInput.addEventListener('input', (e) => {
        renderMarkdown(e.target.value);
    });

    // Download functionality helper
    const downloadFile = (filename, content, type) => {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    };

    // Download as Markdown
    downloadMdBtn.addEventListener('click', () => {
        const content = markdownInput.value;
        downloadFile('document.md', content, 'text/markdown;charset=utf-8;');
    });

    // Download as HTML
    downloadHtmlBtn.addEventListener('click', () => {
        const content = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Markdown Export</title>
<style>
body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 2rem; color: #333; }
pre { background: #f4f4f4; padding: 1rem; border-radius: 8px; overflow: auto; }
code { font-family: monospace; }
blockquote { border-left: 4px solid #ddd; padding-left: 1rem; color: #666; margin-left: 0; }
table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
th { background-color: #f4f4f4; }
img { max-width: 100%; }
</style>
</head>
<body>
${htmlPreview.innerHTML}
</body>
</html>`;
        downloadFile('document.html', content, 'text/html;charset=utf-8;');
    });
});
