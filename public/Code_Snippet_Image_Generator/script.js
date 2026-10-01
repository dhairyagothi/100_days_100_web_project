document.addEventListener('DOMContentLoaded', () => {
    const codeInput = document.getElementById('code-input');
    const codeOutput = document.getElementById('code-output');
    const languageSelect = document.getElementById('language');
    const themeSelect = document.getElementById('theme');
    const prismThemeLink = document.getElementById('prism-theme');
    const paddingInput = document.getElementById('padding');
    const paddingVal = document.getElementById('padding-val');
    const captureArea = document.getElementById('capture-area');
    const exportBtn = document.getElementById('export-btn');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const presets = document.querySelectorAll('.preset');
    const customBg = document.getElementById('custom-bg');
    
    // Theme Toggle Logic
    let isLight = false;
    themeToggleBtn.addEventListener('click', () => {
        isLight = !isLight;
        if (isLight) {
            document.documentElement.classList.add('light-theme');
            themeToggleBtn.innerHTML = '<i class="ph ph-moon"></i>';
        } else {
            document.documentElement.classList.remove('light-theme');
            themeToggleBtn.innerHTML = '<i class="ph ph-sun"></i>';
        }
    });
    
    // Sync textarea sizing with code block
    function syncScroll() {
        codeOutput.parentElement.scrollTop = codeInput.scrollTop;
        codeOutput.parentElement.scrollLeft = codeInput.scrollLeft;
    }

    codeInput.addEventListener('scroll', syncScroll);

    function updateCode() {
        let rawCode = codeInput.value;
        if (!rawCode) {
            rawCode = ' '; // Prevents collapsing
        }
        
        // Escape HTML
        const escapedCode = rawCode
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
            
        codeOutput.innerHTML = escapedCode;
        Prism.highlightElement(codeOutput);
    }

    codeInput.addEventListener('input', updateCode);

    // Language change
    languageSelect.addEventListener('change', (e) => {
        const lang = e.target.value;
        codeOutput.className = `language-${lang}`;
        
        const extensions = {
            'javascript': 'js', 'html': 'html', 'css': 'css',
            'python': 'py', 'typescript': 'ts', 'java': 'java'
        };
        document.querySelector('.window-title').textContent = `untitled.${extensions[lang] || 'txt'}`;
        
        updateCode();
    });

    // Theme change
    themeSelect.addEventListener('change', (e) => {
        const allowedThemes = ['prism-tomorrow.min.css', 'prism-okaidia.min.css', 'prism.min.css', 'prism-twilight.min.css'];
        const selectedTheme = e.target.value;
        
        if (allowedThemes.includes(selectedTheme)) {
            const themeUrl = `https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/${selectedTheme}`;
            prismThemeLink.href = themeUrl;
        }
        
        const macWindow = document.querySelector('.mac-window');
        if(selectedTheme.includes('okaidia') || selectedTheme.includes('tomorrow') || selectedTheme.includes('twilight')) {
            macWindow.style.background = 'rgba(15, 15, 15, 0.85)';
            codeInput.style.color = 'transparent';
        } else {
            macWindow.style.background = 'rgba(255, 255, 255, 0.9)';
            codeInput.style.color = 'transparent';
        }
    });

    // Padding change
    paddingInput.addEventListener('input', (e) => {
        const val = e.target.value;
        paddingVal.textContent = `${val}px`;
        captureArea.style.padding = `${val}px`;
    });

    // Background presets
    presets.forEach(preset => {
        preset.addEventListener('click', () => {
            presets.forEach(p => p.classList.remove('active'));
            preset.classList.add('active');
            captureArea.style.background = preset.getAttribute('data-bg');
        });
    });

    // Custom background
    customBg.addEventListener('input', (e) => {
        presets.forEach(p => p.classList.remove('active'));
        captureArea.style.background = e.target.value;
    });

    // Export functionality
    exportBtn.addEventListener('click', () => {
        const originalText = exportBtn.innerHTML;
        exportBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Exporting...';
        exportBtn.disabled = true;

        // Hide textarea cursor for screenshot by making it completely transparent
        codeInput.style.color = 'transparent';
        codeInput.style.caretColor = 'transparent';
        codeInput.style.textShadow = 'none';

        setTimeout(() => {
            html2canvas(captureArea, {
                scale: 2,
                backgroundColor: null,
                useCORS: true,
                logging: true // Temporarily enabled to catch issues
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = `snippet-${Date.now()}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
                
                exportBtn.innerHTML = originalText;
                exportBtn.disabled = false;
                
                // Restore textarea
                codeInput.style.caretColor = 'var(--text-primary)';
            }).catch(err => {
                console.error('html2canvas error:', err);
                exportBtn.innerHTML = originalText;
                exportBtn.disabled = false;
                codeInput.style.caretColor = 'var(--text-primary)';
                alert('Export failed. Please check the console.');
            });
        }, 100);
    });

    // Handle Tab key in textarea
    codeInput.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = this.selectionStart;
            const end = this.selectionEnd;
            this.value = this.value.substring(0, start) + "  " + this.value.substring(end);
            this.selectionStart = this.selectionEnd = start + 2;
            updateCode();
        }
    });

    // Init
    updateCode();
});
