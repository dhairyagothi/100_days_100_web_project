document.addEventListener('DOMContentLoaded', () => {
    const rawCodeSource = document.getElementById('rawCodeSource');
    const syntaxTokenTarget = document.getElementById('syntaxTokenTarget');
    const editorGutterLines = document.getElementById('editorGutterLines');
    const sandboxRenderOutput = document.getElementById('sandboxRenderOutput');
    const lineMetricCounter = document.getElementById('lineMetricCounter');
    const themeToggle = document.getElementById('themeToggle');
    const exportDocument = document.getElementById('exportDocument');

    function processTokenStyling(rawText) {
        if (!rawText) return ' ';
        
        let dynamicTokens = rawText
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        dynamicTokens = dynamicTokens.replace(/^(#+\s+.*)$/gm, '<span class="tok-header">$1</span>');
        dynamicTokens = dynamicTokens.replace(/^(\s*-\s+.*)$/gm, '<span class="tok-list">$1</span>');

        return dynamicTokens;
    }

    function renderDocumentPreview(markdown) {
        let compiledStructure = markdown
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        compiledStructure = compiledStructure.replace(/^(?:^|\n)((?:\s*-\s+.*\n?)+)/g, (match) => {
            const items = match.trim().split('\n').map(item => {
                return `  <li>${item.replace(/^\s*-\s+/, '')}</li>`;
            }).join('\n');
            return `\n<ul>\n${items}\n</ul>\n`;
        });

        compiledStructure = compiledStructure.replace(/^#\s+(.*)$/gm, '<h1>$1</h1>');
        compiledStructure = compiledStructure.replace(/^##\s+(.*)$/gm, '<h2>$1</h2>');
        compiledStructure = compiledStructure.replace(/^(?!<h[1-2]|<ul|<li)(.+)$/gm, '<p>$1</p>');

        return compiledStructure;
    }

    function synchronizeEditorEngine() {
        const currentPayload = rawCodeSource.value;
        
        syntaxTokenTarget.innerHTML = processTokenStyling(currentPayload);
        sandboxRenderOutput.innerHTML = renderDocumentPreview(currentPayload);

        const lineArray = currentPayload.split('\n');
        const countMetrics = lineArray.length;
        
        lineMetricCounter.textContent = countMetrics;

        let trackingGutterDOM = '';
        for (let iteration = 1; iteration <= countMetrics; iteration++) {
            trackingGutterDOM += `<div>${iteration}</div>`;
        }
        editorGutterLines.innerHTML = trackingGutterDOM;
    }

    rawCodeSource.addEventListener('scroll', () => {
        document.getElementById('highlightedSyntaxRender').scrollTop = rawCodeSource.scrollTop;
        document.getElementById('highlightedSyntaxRender').scrollLeft = rawCodeSource.scrollLeft;
        editorGutterLines.scrollTop = rawCodeSource.scrollTop;
    });

    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('light');
        document.documentElement.classList.toggle('dark');
    });

    exportDocument.addEventListener('click', () => {
        const bodyContent = sandboxRenderOutput.innerHTML;
        const targetTheme = document.documentElement.classList.contains('light') ? 'light' : 'dark';
        
        const standaloneBoilerplate = `<!DOCTYPE html>
<html lang="en" class="${targetTheme}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Production Export Portfolio</title>
    <style>
        :root { --bg-surface: #0f1115; --text-surface: #f8fafc; }
        html.light { --bg-surface: #ffffff; --text-surface: #0f172a; }
        body { background-color: var(--bg-surface); color: var(--text-surface); font-family: system-ui, -apple-system, sans-serif; padding: 48px; max-width: 720px; margin: 0 auto; line-height: 1.8; }
        h1, h2 { margin-bottom: 20px; font-weight: 800; letter-spacing: -0.02em; }
        ul { padding-left: 20px; margin-bottom: 20px; }
        li { margin-bottom: 8px; }
        p { margin-bottom: 20px; }
    </style>
</head>
<body>
    <article class="premium-prose-engine">
        ${bodyContent}
    </article>
</body>
</html>`;

        const transportBlob = new Blob([standaloneBoilerplate], { type: 'text/html' });
        const temporaryLinkAddress = URL.createObjectURL(transportBlob);
        const virtualAnchor = document.createElement('a');
        virtualAnchor.href = temporaryLinkAddress;
        virtualAnchor.download = 'compiled-artifact.html';
        document.body.appendChild(virtualAnchor);
        virtualAnchor.click();
        document.body.removeChild(virtualAnchor);
        URL.revokeObjectURL(temporaryLinkAddress);
    });

    rawCodeSource.addEventListener('input', synchronizeEditorEngine);

    rawCodeSource.value = `# Deep Dive Exploration\n\n- Real-time engine acceleration\n- High-contrast context layers\n- Synchronized viewports rendering inline`;
    synchronizeEditorEngine();
}); 