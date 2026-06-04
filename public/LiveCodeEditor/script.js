// ── CODEMIRROR INSTANCES ──────────────────────────────────
const cmHTML = CodeMirror(document.getElementById('htmlEditor'), {
  mode: 'htmlmixed',
  theme: 'dracula',
  lineNumbers: true,
  autoCloseTags: true,
  autoCloseBrackets: true,
  matchBrackets: true,
  indentUnit: 2,
  tabSize: 2,
  indentWithTabs: false,
  lineWrapping: true,
  value: localStorage.getItem('lce_html') || '',
});

const cmCSS = CodeMirror(document.getElementById('cssEditor'), {
  mode: 'css',
  theme: 'dracula',
  lineNumbers: true,
  autoCloseBrackets: true,
  matchBrackets: true,
  indentUnit: 2,
  tabSize: 2,
  indentWithTabs: false,
  lineWrapping: true,
  value: localStorage.getItem('lce_css') || '',
});

const cmJS = CodeMirror(document.getElementById('jsEditor'), {
  mode: 'javascript',
  theme: 'dracula',
  lineNumbers: true,
  autoCloseBrackets: true,
  matchBrackets: true,
  indentUnit: 2,
  tabSize: 2,
  indentWithTabs: false,
  lineWrapping: true,
  value: localStorage.getItem('lce_js') || '',
});

// ── TAB SWITCHING ─────────────────────────────────────────
const tabs = document.querySelectorAll('.tab');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.editor-pane').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const map = { html: 'htmlEditor', css: 'cssEditor', js: 'jsEditor' };
    document.getElementById(map[tab.dataset.tab]).classList.add('active');

    // Refresh CodeMirror after tab switch so it renders correctly
    const cmMap = { html: cmHTML, css: cmCSS, js: cmJS };
    setTimeout(() => cmMap[tab.dataset.tab].refresh(), 10);
  });
});

// ── LIVE PREVIEW ──────────────────────────────────────────
const preview = document.getElementById('preview');
let debounceTimer;

function updatePreview() {
  const html = cmHTML.getValue();
  const css  = cmCSS.getValue();
  const js   = cmJS.getValue();

  const content = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <style>${css}</style>
    </head>
    <body>
      ${html}
      <script>
        window.onerror = function(msg, src, line) {
          document.body.innerHTML += '<div style="position:fixed;bottom:0;left:0;right:0;background:#ff4444;color:#fff;padding:8px 12px;font-family:monospace;font-size:13px;">JS Error: ' + msg + ' (line ' + line + ')</div>';
        };
        ${js}
      <\/script>
    </body>
    </html>
  `;

  const blob = new Blob([content], { type: 'text/html' });
  preview.src = URL.createObjectURL(blob);
}

function scheduleUpdate() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(updatePreview, 400);
}

cmHTML.on('change', () => { saveToStorage(); scheduleUpdate(); });
cmCSS.on('change',  () => { saveToStorage(); scheduleUpdate(); });
cmJS.on('change',   () => { saveToStorage(); scheduleUpdate(); });

// ── REFRESH BUTTON ────────────────────────────────────────
document.getElementById('refreshBtn').addEventListener('click', updatePreview);

// ── DOWNLOAD ──────────────────────────────────────────────
document.getElementById('downloadBtn').addEventListener('click', () => {
  const html = cmHTML.getValue();
  const css  = cmCSS.getValue();
  const js   = cmJS.getValue();

  const full = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>${css}</style>
</head>
<body>
  ${html}
  <script>${js}<\/script>
</body>
</html>`;

  const blob = new Blob([full], { type: 'text/html' });
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = 'project.html';
  a.click();
});

// ── CLEAR ─────────────────────────────────────────────────
document.getElementById('clearBtn').addEventListener('click', () => {
  if (confirm('Clear all code? This cannot be undone.')) {
    cmHTML.setValue('');
    cmCSS.setValue('');
    cmJS.setValue('');
    localStorage.removeItem('lce_html');
    localStorage.removeItem('lce_css');
    localStorage.removeItem('lce_js');
    updatePreview();
  }
});

// ── LOCALSTORAGE ──────────────────────────────────────────
function saveToStorage() {
  localStorage.setItem('lce_html', cmHTML.getValue());
  localStorage.setItem('lce_css',  cmCSS.getValue());
  localStorage.setItem('lce_js',   cmJS.getValue());
}

// ── RESIZABLE DIVIDER ─────────────────────────────────────
const divider = document.getElementById('divider');
const editorSection = document.querySelector('.editor-section');
let isDragging = false;

divider.addEventListener('mousedown', () => {
  isDragging = true;
  divider.classList.add('dragging');
  document.body.style.userSelect = 'none';
  document.body.style.cursor = 'col-resize';
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const appWidth = document.querySelector('.app').offsetWidth;
  const pct = (e.clientX / appWidth) * 100;
  if (pct > 20 && pct < 80) {
    editorSection.style.width = pct + '%';
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  divider.classList.remove('dragging');
  document.body.style.userSelect = '';
  document.body.style.cursor = '';
});

// ── INIT ──────────────────────────────────────────────────
updatePreview();