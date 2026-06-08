const STORAGE_KEYS = {
  html: 'live-code-playground-html',
  css: 'live-code-playground-css',
  js: 'live-code-playground-js',
  theme: 'live-code-playground-theme',
  autoRun: 'live-code-playground-auto-run',
  template: 'live-code-playground-template',
};

const STARTER_TEMPLATES = {
  landing: {
    html: `<main class="hero">
  <p class="eyebrow">Vanilla Web Lab</p>
  <h1>Build tiny ideas fast.</h1>
  <p>Write HTML, CSS, and JavaScript, then preview everything in a sandbox.</p>
  <button id="spark-button">Launch Spark</button>
  <p id="message" aria-live="polite"></p>
</main>`,
    css: `body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #101827;
  color: #f8fafc;
  font-family: Inter, system-ui, sans-serif;
}

.hero {
  width: min(720px, calc(100% - 2rem));
  padding: 3rem;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.28);
}

.eyebrow {
  color: #5eead4;
  font-weight: 800;
  text-transform: uppercase;
}

h1 {
  font-size: clamp(2.4rem, 8vw, 5rem);
  line-height: 0.95;
}

button {
  border: 0;
  border-radius: 999px;
  padding: 0.85rem 1.2rem;
  background: #5eead4;
  color: #062027;
  font-weight: 800;
}`,
    js: `const button = document.querySelector('#spark-button');
const message = document.querySelector('#message');

button.addEventListener('click', () => {
  message.textContent = 'Spark launched at ' + new Date().toLocaleTimeString();
  console.log('Button clicked from inside the sandbox');
});`,
  },
  counter: {
    html: `<section class="counter-card">
  <h1>Focus Counter</h1>
  <p id="count">0</p>
  <div>
    <button data-action="decrement">-</button>
    <button data-action="increment">+</button>
  </div>
</section>`,
    css: `body {
  min-height: 100vh;
  display: grid;
  place-items: center;
  margin: 0;
  background: #f6f1e8;
  color: #202124;
  font-family: system-ui, sans-serif;
}

.counter-card {
  text-align: center;
  padding: 2rem;
  border-radius: 20px;
  background: white;
  box-shadow: 0 24px 60px rgba(32, 33, 36, 0.15);
}

#count {
  font-size: 5rem;
  font-weight: 900;
}

button {
  width: 3rem;
  height: 3rem;
  border: 0;
  border-radius: 50%;
  background: #2563eb;
  color: white;
  font-size: 1.4rem;
}`,
    js: `let value = 0;
const count = document.querySelector('#count');

document.addEventListener('click', (event) => {
  const action = event.target.dataset.action;
  if (!action) return;

  value += action === 'increment' ? 1 : -1;
  count.textContent = value;
  console.log('Counter value:', value);
});`,
  },
  todo: {
    html: `<main class="todo">
  <h1>Today</h1>
  <form id="todo-form">
    <input id="todo-input" placeholder="Add a task" />
    <button>Add</button>
  </form>
  <ul id="todo-list"></ul>
</main>`,
    css: `body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #eef2ff;
  font-family: system-ui, sans-serif;
}

.todo {
  width: min(460px, calc(100% - 2rem));
  padding: 1.4rem;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 20px 55px rgba(79, 70, 229, 0.18);
}

form {
  display: flex;
  gap: 0.5rem;
}

input {
  flex: 1;
  padding: 0.8rem;
}

button {
  padding: 0.8rem 1rem;
}

li {
  margin-top: 0.6rem;
}`,
    js: `const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
const list = document.querySelector('#todo-list');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!input.value.trim()) return;

  const item = document.createElement('li');
  item.textContent = input.value.trim();
  list.append(item);
  console.log('Added task:', item.textContent);
  input.value = '';
});`,
  },
};

const state = {
  editors: {},
  renderTimer: null,
  initialized: false,
};

const elements = {};

const safeStorage = {
  get(key, fallback = null) {
    try {
      return localStorage.getItem(key) ?? fallback;
    } catch (error) {
      console.warn('Storage read failed:', error);
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('Storage write failed:', error);
    }
  },
  remove(keys) {
    try {
      keys.forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.warn('Storage clear failed:', error);
    }
  },
};

const getCurrentCode = () => ({
  html: state.editors.html.getValue(),
  css: state.editors.css.getValue(),
  js: state.editors.js.getValue(),
});

const escapeClosingScript = (code) => code.replace(/<\/script/gi, '<\\/script');
const escapeClosingStyle = (code) => code.replace(/<\/style/gi, '<\\/style');

const appendConsoleLine = (level, values) => {
  const line = document.createElement('p');
  line.className = `console-line ${level}`;
  line.textContent = `[${level}] ${values.join(' ')}`;
  elements.consoleOutput.append(line);
  elements.consoleOutput.scrollTop = elements.consoleOutput.scrollHeight;
};

const clearConsole = () => {
  elements.consoleOutput.innerHTML = '';
};

const buildPreviewDocument = ({ html, css, js }) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${escapeClosingStyle(css)}</style>
</head>
<body>
${html}
<script>
  (() => {
    const send = (level, values) => {
      window.parent.postMessage({
        source: 'live-code-playground',
        level,
        values: values.map((value) => {
          try {
            return typeof value === 'string' ? value : JSON.stringify(value);
          } catch (error) {
            return String(value);
          }
        }),
      }, '*');
    };

    ['log', 'info', 'warn', 'error'].forEach((level) => {
      const original = console[level];
      console[level] = (...args) => {
        send(level, args);
        original.apply(console, args);
      };
    });

    window.addEventListener('error', (event) => {
      send('error', [event.message + ' at line ' + event.lineno]);
    });

    window.addEventListener('unhandledrejection', (event) => {
      send('error', ['Unhandled promise rejection:', event.reason]);
    });
  })();
<\/script>
<script>
try {
${escapeClosingScript(js)}
} catch (error) {
  console.error(error && error.stack ? error.stack : error);
}
<\/script>
</body>
</html>`;

const setStatus = (message, running = false) => {
  elements.runStatus.textContent = message;
  elements.runStatus.classList.toggle('is-running', running);
};

const renderPreview = () => {
  clearConsole();
  setStatus('Rendering', true);
  const code = getCurrentCode();
  elements.previewFrame.srcdoc = buildPreviewDocument(code);
  saveState();

  window.setTimeout(() => {
    setStatus('Rendered', false);
  }, 220);
};

const scheduleRender = () => {
  if (!elements.autoRunToggle.checked) return;
  window.clearTimeout(state.renderTimer);
  state.renderTimer = window.setTimeout(renderPreview, 400);
};

const saveState = () => {
  if (!state.initialized) return;
  const code = getCurrentCode();
  safeStorage.set(STORAGE_KEYS.html, code.html);
  safeStorage.set(STORAGE_KEYS.css, code.css);
  safeStorage.set(STORAGE_KEYS.js, code.js);
  safeStorage.set(STORAGE_KEYS.autoRun, String(elements.autoRunToggle.checked));
  safeStorage.set(STORAGE_KEYS.template, elements.templateSelect.value);
};

const showToast = (message) => {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  elements.toastRegion.append(toast);

  window.setTimeout(() => {
    toast.remove();
  }, 2800);
};

const getInitialCode = () => {
  const templateKey = safeStorage.get(STORAGE_KEYS.template, 'landing');
  const template = STARTER_TEMPLATES[templateKey] || STARTER_TEMPLATES.landing;
  elements.templateSelect.value = STARTER_TEMPLATES[templateKey] ? templateKey : 'landing';

  return {
    html: safeStorage.get(STORAGE_KEYS.html, template.html),
    css: safeStorage.get(STORAGE_KEYS.css, template.css),
    js: safeStorage.get(STORAGE_KEYS.js, template.js),
  };
};

const updateMonacoTheme = (theme) => {
  if (!window.monaco) return;
  monaco.editor.setTheme(theme === 'light' ? 'vs' : 'vs-dark');
};

const applyTheme = (theme) => {
  const normalizedTheme = theme === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = normalizedTheme;
  elements.themeToggle.setAttribute(
    'aria-label',
    normalizedTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
  );
  elements.themeToggle.querySelector('span').textContent = normalizedTheme === 'dark' ? '☾' : '☀';
  safeStorage.set(STORAGE_KEYS.theme, normalizedTheme);
  updateMonacoTheme(normalizedTheme);
};

const setupEditors = () => {
  const initialCode = getInitialCode();
  const commonOptions = {
    automaticLayout: true,
    fontSize: 14,
    lineNumbers: 'on',
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    tabSize: 2,
    wordWrap: 'on',
  };

  state.editors.html = monaco.editor.create(elements.htmlEditor, {
    ...commonOptions,
    value: initialCode.html,
    language: 'html',
  });

  state.editors.css = monaco.editor.create(elements.cssEditor, {
    ...commonOptions,
    value: initialCode.css,
    language: 'css',
  });

  state.editors.js = monaco.editor.create(elements.jsEditor, {
    ...commonOptions,
    value: initialCode.js,
    language: 'javascript',
  });

  Object.values(state.editors).forEach((editor) => {
    editor.onDidChangeModelContent(scheduleRender);
  });
};

const resetPlayground = () => {
  const template = STARTER_TEMPLATES[elements.templateSelect.value] || STARTER_TEMPLATES.landing;
  state.editors.html.setValue(template.html);
  state.editors.css.setValue(template.css);
  state.editors.js.setValue(template.js);
  safeStorage.remove([STORAGE_KEYS.html, STORAGE_KEYS.css, STORAGE_KEYS.js]);
  renderPreview();
  showToast('Starter template restored.');
};

const copyCode = async (type) => {
  try {
    await navigator.clipboard.writeText(state.editors[type].getValue());
    showToast(`${type.toUpperCase()} copied to clipboard.`);
  } catch (error) {
    showToast('Clipboard copy is unavailable in this browser.');
  }
};

const downloadProject = async () => {
  const code = getCurrentCode();
  const htmlFile = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Playground Project</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
${code.html}
  <script src="script.js"><\/script>
</body>
</html>`;

  try {
    if (!window.JSZip) {
      throw new Error('JSZip failed to load');
    }

    const zip = new JSZip();
    zip.file('index.html', htmlFile);
    zip.file('style.css', code.css);
    zip.file('script.js', code.js);

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'live-code-playground-project.zip';
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast('Project ZIP generated.');
  } catch (error) {
    console.error('Download failed:', error);
    showToast('Unable to generate ZIP. Check your connection and try again.');
  }
};

const togglePanel = (panelName, button) => {
  const panel = document.querySelector(`[data-panel="${panelName}"]`);
  const collapsed = panel.classList.toggle('is-collapsed');
  button.textContent = collapsed ? 'Expand' : 'Collapse';
  button.setAttribute('aria-expanded', String(!collapsed));
  window.setTimeout(() => {
    Object.values(state.editors).forEach((editor) => editor.layout());
  }, 0);
};

const setupEventListeners = () => {
  elements.runBtn.addEventListener('click', renderPreview);
  elements.resetBtn.addEventListener('click', resetPlayground);
  elements.downloadBtn.addEventListener('click', downloadProject);
  elements.clearConsoleBtn.addEventListener('click', clearConsole);

  elements.autoRunToggle.addEventListener('change', () => {
    saveState();
    if (elements.autoRunToggle.checked) renderPreview();
  });

  elements.themeToggle.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme);
    showToast(`${nextTheme === 'light' ? 'Light' : 'Dark'} theme enabled.`);
  });

  elements.templateSelect.addEventListener('change', () => {
    safeStorage.set(STORAGE_KEYS.template, elements.templateSelect.value);
    resetPlayground();
  });

  elements.fullscreenBtn.addEventListener('click', () => {
    const enabled = elements.appShell.classList.toggle('is-fullscreen');
    elements.fullscreenBtn.textContent = enabled ? 'Exit Fullscreen' : 'Fullscreen';
    showToast(enabled ? 'Preview expanded.' : 'Workspace restored.');
  });

  document.querySelectorAll('[data-copy]').forEach((button) => {
    button.addEventListener('click', () => copyCode(button.dataset.copy));
  });

  document.querySelectorAll('[data-collapse]').forEach((button) => {
    button.addEventListener('click', () => togglePanel(button.dataset.collapse, button));
  });

window.addEventListener('message', (event) => {
  const previewFrame = elements.previewFrame;

  // Ensure iframe exists
  if (!previewFrame?.contentWindow) return;

  // Accept messages only from the sandbox preview iframe
  if (event.source !== previewFrame.contentWindow) return;

  const data = event.data;

  // Validate payload
  if (!data || data.source !== 'live-code-playground') return;

  // Allow only expected console levels
  const allowedLevels = ['log', 'warn', 'error', 'info'];

  const level = allowedLevels.includes(data.level)
    ? data.level
    : 'log';

  const values = Array.isArray(data.values)
    ? data.values
    : [];

  appendConsoleLine(level, values);
});

  window.addEventListener('keydown', (event) => {
    const modifierPressed = event.ctrlKey || event.metaKey;
    if (!modifierPressed) return;

    if (event.key.toLowerCase() === 's') {
      event.preventDefault();
      renderPreview();
      showToast('Code executed.');
    }

    if (event.key.toLowerCase() === 'r') {
      event.preventDefault();
      resetPlayground();
    }
  });

  window.addEventListener('beforeunload', saveState);
};

const cacheElements = () => {
  elements.appShell = document.querySelector('#app-shell');
  elements.htmlEditor = document.querySelector('#html-editor');
  elements.cssEditor = document.querySelector('#css-editor');
  elements.jsEditor = document.querySelector('#js-editor');
  elements.previewFrame = document.querySelector('#preview-frame');
  elements.consoleOutput = document.querySelector('#console-output');
  elements.runStatus = document.querySelector('#run-status');
  elements.runBtn = document.querySelector('#run-btn');
  elements.resetBtn = document.querySelector('#reset-btn');
  elements.downloadBtn = document.querySelector('#download-btn');
  elements.themeToggle = document.querySelector('#theme-toggle');
  elements.autoRunToggle = document.querySelector('#auto-run-toggle');
  elements.clearConsoleBtn = document.querySelector('#clear-console-btn');
  elements.fullscreenBtn = document.querySelector('#fullscreen-btn');
  elements.templateSelect = document.querySelector('#template-select');
  elements.toastRegion = document.querySelector('#toast-region');
};

const initializePlayground = () => {
  try {
    cacheElements();
    elements.autoRunToggle.checked = safeStorage.get(STORAGE_KEYS.autoRun, 'true') !== 'false';
    applyTheme(safeStorage.get(STORAGE_KEYS.theme, 'dark'));

    require.config({
      paths: {
        vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.49.0/min/vs',
      },
    });

    require(['vs/editor/editor.main'], () => {
      setupEditors();
      setupEventListeners();
      state.initialized = true;
      renderPreview();
      showToast('Playground ready.');
    });
  } catch (error) {
    console.error('Initialization failed:', error);
    setStatus('Initialization failed', false);
  }
};

document.addEventListener('DOMContentLoaded', initializePlayground);
