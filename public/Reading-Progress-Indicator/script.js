const article = document.getElementById('article');
const progressBar = document.getElementById('progressBar');
const customTextInput = document.getElementById('customTextInput');
const loadTextBtn = document.getElementById('loadTextBtn');

document.addEventListener('DOMContentLoaded', () => {
    const savedContent = localStorage.getItem('highlightedArticle');
    if (savedContent) {
        article.innerHTML = savedContent;
    }
});

window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrollPercentage = 0;

    if (scrollHeight > 0) {
        scrollPercentage = (scrollTop / scrollHeight) * 100;
    }

    progressBar.style.width = `${scrollPercentage}%`;
});

article.addEventListener('mouseup', () => {
    const selection = window.getSelection();

    if (!selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.className = 'highlight';

        try {
            range.surroundContents(span);
            localStorage.setItem('highlightedArticle', article.innerHTML);
            selection.removeAllRanges();
        } catch (e) {

        }
    }
});

article.addEventListener('click', (e) => {
    if (e.target.classList.contains('highlight')) {
        const parent = e.target.parentNode;
        e.target.replaceWith(document.createTextNode(e.target.textContent));
        parent.normalize();
        localStorage.setItem('highlightedArticle', article.innerHTML);
    }
});

loadTextBtn.addEventListener('click', () => {
    const newText = customTextInput.value.trim();

    if (newText) {
        article.innerHTML = '';

        newText
            .split('\n')
            .filter(text => text.trim() !== '')
            .forEach(text => {
                const p = document.createElement('p');
                p.textContent = text;
                article.appendChild(p);
            });
        localStorage.setItem('highlightedArticle', article.innerHTML);
        customTextInput.value = '';
    }
});