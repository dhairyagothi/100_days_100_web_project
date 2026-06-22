/* ui.js — Response rendering, JSON highlighting, tree view, and toast notifications */

const UI = (() => {

  /* ---- Toast Notifications ---- */

  function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
      success: '✓',
      error:   '✕',
      info:    'ℹ',
      warning: '⚠',
    };

    toast.innerHTML = `<span style="font-weight:700">${icons[type] || 'ℹ'}</span> ${escapeHtml(message)}`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-exit');
      toast.addEventListener('animationend', () => toast.remove(), { once: true });
    }, duration);
  }

  /* ---- Status Badge ---- */

  function statusClass(code) {
    if (code >= 500) return 'status-5xx';
    if (code >= 400) return 'status-4xx';
    if (code >= 300) return 'status-3xx';
    if (code >= 200) return 'status-2xx';
    return 'status-1xx';
  }

  function statusLabel(code, statusText) {
    return `${code} ${statusText}`;
  }

  /* ---- JSON Syntax Highlighting ---- */

  function syntaxHighlight(json) {
    if (typeof json !== 'string') json = JSON.stringify(json, null, 2);

    return json
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        (match) => {
          let cls = 'json-number';
          if (/^"/.test(match)) {
            cls = /:$/.test(match) ? 'json-key' : 'json-string';
          } else if (/true|false/.test(match)) {
            cls = 'json-bool';
          } else if (/null/.test(match)) {
            cls = 'json-null';
          }
          return `<span class="${cls}">${match}</span>`;
        }
      );
  }

  /* ---- JSON Tree View ---- */

  function renderTreeNode(data, container, depth = 0) {
    if (Array.isArray(data)) {
      renderCollection(data, container, depth, true);
    } else if (data !== null && typeof data === 'object') {
      renderCollection(data, container, depth, false);
    } else {
      renderPrimitive(data, container);
    }
  }

  function renderCollection(data, container, depth, isArray) {
    const entries = isArray ? data.map((v, i) => [i, v]) : Object.entries(data);
    const count = entries.length;

    if (count === 0) {
      const span = document.createElement('span');
      span.className = 'json-punct';
      span.textContent = isArray ? '[]' : '{}';
      container.appendChild(span);
      return;
    }

    const wrapper = document.createElement('div');
    const toggle = document.createElement('button');
    toggle.className = 'tree-toggle open';
    toggle.textContent = '▶';
    toggle.setAttribute('aria-label', 'Toggle');
    wrapper.appendChild(toggle);

    const openBrace = document.createElement('span');
    openBrace.className = 'json-punct';
    openBrace.textContent = isArray ? `[ ${count} items ]` : `{ ${count} keys }`;
    wrapper.appendChild(openBrace);

    const childrenEl = document.createElement('div');
    childrenEl.className = 'tree-node tree-children';

    entries.forEach(([key, val]) => {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:flex-start;gap:4px;padding:1px 0';

      const keyEl = document.createElement('span');
      keyEl.className = 'tree-key';
      keyEl.textContent = isArray ? `[${key}]:` : `"${key}":`;
      row.appendChild(keyEl);

      const valWrap = document.createElement('span');
      valWrap.style.flex = '1';
      renderTreeNode(val, valWrap, depth + 1);
      row.appendChild(valWrap);

      childrenEl.appendChild(row);
    });

    wrapper.appendChild(childrenEl);
    container.appendChild(wrapper);

    toggle.addEventListener('click', () => {
      const hidden = childrenEl.classList.toggle('hidden');
      toggle.classList.toggle('open', !hidden);
    });
  }

  function renderPrimitive(val, container) {
    const span = document.createElement('span');
    if (val === null)         { span.className = 'tree-null';   span.textContent = 'null'; }
    else if (typeof val === 'boolean') { span.className = 'tree-bool';   span.textContent = String(val); }
    else if (typeof val === 'number')  { span.className = 'tree-number'; span.textContent = String(val); }
    else {
      span.className = 'tree-string';
      span.textContent = `"${String(val).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
    }
    container.appendChild(span);
  }

  /* ---- Response Display ---- */

  let _currentRaw = '';
  let _currentParsed = null;
  let _currentIsJson = false;
  let _currentView = 'pretty'; // 'pretty' | 'raw' | 'tree'

  function showResponseLoading() {
    document.getElementById('response-placeholder').style.display = 'none';
    document.getElementById('response-loading').style.display = 'flex';
    document.getElementById('response-output').style.display = 'none';
    document.getElementById('response-tree').style.display = 'none';
    document.getElementById('response-meta').style.display = 'none';
    document.getElementById('copy-response-btn').style.display = 'none';
    document.getElementById('response-headers-list').innerHTML = '';
  }

  function showResponseResult(result) {
    _currentRaw = result.rawText;
    _currentParsed = result.parsed;
    _currentIsJson = result.isJson;

    // Hide loading
    document.getElementById('response-loading').style.display = 'none';

    // Status badge
    const metaEl = document.getElementById('response-meta');
    metaEl.style.display = 'flex';
    const badge = document.getElementById('status-badge');
    badge.textContent = statusLabel(result.status, result.statusText);
    badge.className = `meta-badge ${statusClass(result.status)}`;
    document.getElementById('response-time').textContent = `${result.time}ms`;
    document.getElementById('response-size').textContent = result.size;

    // Show copy button
    document.getElementById('copy-response-btn').style.display = 'flex';

    // Render response headers
    const headersList = document.getElementById('response-headers-list');
    headersList.innerHTML = '';
    Object.entries(result.headers).forEach(([k, v]) => {
      const row = document.createElement('div');
      row.className = 'resp-header-row';
      row.innerHTML = `<span class="resp-header-key">${escapeHtml(k)}</span><span class="resp-header-val">${escapeHtml(v)}</span>`;
      headersList.appendChild(row);
    });

    // Render body based on current view
    renderResponseBody();
  }

  function renderResponseBody() {
    const outputEl = document.getElementById('response-output');
    const bodyEl  = document.getElementById('response-body');
    const treeEl  = document.getElementById('response-tree');

    if (_currentView === 'tree' && _currentIsJson && _currentParsed !== null) {
      outputEl.style.display = 'none';
      treeEl.style.display = 'block';
      treeEl.innerHTML = '';
      renderTreeNode(_currentParsed, treeEl);
      return;
    }

    outputEl.style.display = 'block';
    treeEl.style.display = 'none';

    if (_currentView === 'raw') {
      bodyEl.innerHTML = escapeHtml(_currentRaw);
    } else {
      // Pretty: syntax highlight if JSON, else plain escaped
      if (_currentIsJson && _currentParsed !== null) {
        bodyEl.innerHTML = syntaxHighlight(JSON.stringify(_currentParsed, null, 2));
      } else {
        bodyEl.innerHTML = escapeHtml(_currentRaw);
      }
    }
  }

  function showResponseError(message) {
    document.getElementById('response-loading').style.display = 'none';
    document.getElementById('response-output').style.display = 'block';
    document.getElementById('response-tree').style.display = 'none';
    document.getElementById('response-meta').style.display = 'none';
    document.getElementById('copy-response-btn').style.display = 'none';

    const bodyEl = document.getElementById('response-body');
    bodyEl.innerHTML = `<span style="color:var(--red)">Error: ${escapeHtml(message)}</span>`;
  }

  function setView(view) {
    _currentView = view;
    document.querySelectorAll('.resp-view-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`resp-${view}-btn`).classList.add('active');
    if (_currentRaw) renderResponseBody();
  }

  /* ---- Response Search ---- */

  function applySearch(query) {
    const bodyEl = document.getElementById('response-body');
    if (!bodyEl || !query.trim()) { renderResponseBody(); return; }

    // Re-render first, then apply highlights
    renderResponseBody();

    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');

    bodyEl.innerHTML = bodyEl.innerHTML.replace(regex, '<span class="search-highlight">$1</span>');
  }

  /* ---- Get current raw response (for copy) ---- */
  function getCurrentRaw() { return _currentRaw; }

  return {
    showToast,
    showResponseLoading,
    showResponseResult,
    showResponseError,
    renderResponseBody,
    setView,
    applySearch,
    getCurrentRaw,
    syntaxHighlight,
  };
})();
