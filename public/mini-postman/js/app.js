/* app.js — Main application entry point: tabs, request flow, and event wiring */

/* =====================================================
   Tab State Management
   ===================================================== */
const AppTabs = (() => {
  let tabs = [];
  let activeTabId = null;

  function createTab(init = {}) {
    return {
      id: 'tab_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      label: init.name || 'New Request',
      method: init.method || 'GET',
      url: init.url || '',
      headers: init.headers || [],
      body: init.body || '',
      bodyType: init.bodyType || 'none',
      authType: init.authType || 'none',
      authFields: init.authFields || {},
    };
  }

  function newTab(init = {}) {
    const tab = createTab(init);
    tabs.push(tab);
    activeTabId = tab.id;
    renderTabs();
    loadTabIntoUI(tab);
    return tab;
  }

  function closeTab(id) {
    const idx = tabs.findIndex(t => t.id === id);
    if (idx === -1) return;
    tabs.splice(idx, 1);

    if (tabs.length === 0) {
      newTab();
      return;
    }

    if (activeTabId === id) {
      activeTabId = tabs[Math.max(0, idx - 1)].id;
      loadTabIntoUI(getActive());
    }
    renderTabs();
  }

  function getActive() { return tabs.find(t => t.id === activeTabId); }

  function switchTab(id) {
    saveCurrentTabState();
    activeTabId = id;
    renderTabs();
    loadTabIntoUI(getActive());
    // Clear response view when switching
    resetResponsePanel();
  }

  function saveCurrentTabState() {
    const tab = getActive();
    if (!tab) return;
    tab.method   = document.getElementById('method-select').value;
    tab.url      = document.getElementById('url-input').value;
    tab.headers  = getHeadersFromUI();
    tab.body     = document.getElementById('body-input').value;
    tab.bodyType = document.querySelector('input[name="body-type"]:checked').value;
    tab.authType = document.getElementById('auth-type').value;
    tab.authFields = getAuthFieldsFromUI();

    const label = tab.url ? shortUrl(tab.url) : 'New Request';
    tab.label = label;
  }

  function loadTabIntoUI(tab) {
    if (!tab) return;
    document.getElementById('method-select').value = tab.method;
    document.getElementById('url-input').value = tab.url;
    loadHeadersIntoUI(tab.headers);
    document.getElementById('body-input').value = tab.body;

    const bodyRadio = document.querySelector(`input[name="body-type"][value="${tab.bodyType}"]`);
    if (bodyRadio) bodyRadio.checked = true;
    toggleFormatBtn(tab.bodyType);

    document.getElementById('auth-type').value = tab.authType;
    renderAuthFields(tab.authType, tab.authFields);

    updateMethodColor();
  }

  function loadRequestIntoCurrentTab(req) {
    saveCurrentTabState();
    const tab = getActive();
    if (!tab) return;
    tab.method   = req.method || 'GET';
    tab.url      = req.url || '';
    tab.headers  = req.headers || [];
    tab.body     = req.body || '';
    tab.bodyType = req.bodyType || 'none';
    tab.label    = req.name || shortUrl(req.url) || 'Request';
    tab.authType    = req.authType || 'none';
    tab.authFields  = req.authFields || {};
    loadTabIntoUI(tab);
    renderTabs();
    resetResponsePanel();
    UI.showToast('Request loaded', 'info');
  }

  function renderTabs() {
    const container = document.getElementById('tabs-container');
    container.innerHTML = '';
    tabs.forEach(tab => {
      const el = document.createElement('div');
      el.className = `tab${tab.id === activeTabId ? ' active' : ''}`;
      el.setAttribute('role', 'tab');
      el.setAttribute('aria-selected', tab.id === activeTabId);
      el.setAttribute('title', tab.url || tab.label);
      el.innerHTML = `
        <span class="method-badge badge-${tab.method}" style="font-size:9px;padding:1px 4px">${tab.method}</span>
        <span class="tab-label">${escapeHtml(tab.label)}</span>
        <button class="tab-close" title="Close Tab" aria-label="Close tab">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      `;
      el.addEventListener('click', (e) => {
        if (e.target.closest('.tab-close')) { closeTab(tab.id); return; }
        if (tab.id !== activeTabId) switchTab(tab.id);
      });
      container.appendChild(el);
    });
  }

  function duplicateTab() {
    const current = getActive();
    if (!current) return;
    saveCurrentTabState();
    newTab({ ...current, id: undefined, label: current.label + ' (copy)' });
  }

  return { newTab, closeTab, getActive, switchTab, saveCurrentTabState, loadTabIntoUI, loadRequestIntoCurrentTab, renderTabs, duplicateTab };
})();

/* =====================================================
   Header Rows
   ===================================================== */
function getHeadersFromUI() {
  const rows = document.querySelectorAll('#headers-list .header-row');
  return Array.from(rows).map(row => ({
    key:   row.querySelector('.header-key').value,
    value: row.querySelector('.header-val').value,
  })).filter(h => h.key.trim());
}

function loadHeadersIntoUI(headers) {
  const list = document.getElementById('headers-list');
  list.innerHTML = '';
  if (!headers || headers.length === 0) return;
  headers.forEach(h => addHeaderRow(h.key, h.value));
}

function addHeaderRow(key = '', value = '') {
  const list = document.getElementById('headers-list');
  const row = document.createElement('div');
  row.className = 'header-row';
  row.innerHTML = `
    <input type="text" class="header-key" placeholder="Key" value="${escapeHtml(key)}" aria-label="Header key" />
    <input type="text" class="header-val" placeholder="Value" value="${escapeHtml(value)}" aria-label="Header value" />
    <button class="btn-icon del-header-btn" title="Remove" aria-label="Remove header">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  `;
  row.querySelector('.del-header-btn').addEventListener('click', () => row.remove());
  list.appendChild(row);
  row.querySelector('.header-key').focus();
}

/* =====================================================
   Auth Fields
   ===================================================== */
function renderAuthFields(type, fields = {}) {
  const container = document.getElementById('auth-fields');
  container.innerHTML = '';

  if (type === 'none') return;

  const configs = {
    bearer: [{ label: 'Token', key: 'token', type: 'password', placeholder: 'Bearer token' }],
    basic:  [
      { label: 'Username', key: 'username', type: 'text', placeholder: 'Username' },
      { label: 'Password', key: 'password', type: 'password', placeholder: 'Password' },
    ],
    'api-key': [
      { label: 'Header Name', key: 'header', type: 'text', placeholder: 'X-API-Key' },
      { label: 'Value', key: 'value', type: 'password', placeholder: 'Your API Key' },
    ],
  };

  (configs[type] || []).forEach(cfg => {
    const row = document.createElement('div');
    row.className = 'auth-field-row';
    row.innerHTML = `
      <label>${cfg.label}</label>
      <input type="${cfg.type}" class="auth-field" data-key="${cfg.key}" placeholder="${cfg.placeholder}" value="${escapeHtml(fields[cfg.key] || '')}" />
    `;
    container.appendChild(row);
  });
}

function getAuthFieldsFromUI() {
  const fields = {};
  document.querySelectorAll('#auth-fields .auth-field').forEach(inp => {
    fields[inp.dataset.key] = inp.value;
  });
  return fields;
}

function buildAuthHeaders(authType, authFields) {
  if (authType === 'bearer' && authFields.token) {
    return [{ key: 'Authorization', value: `Bearer ${authFields.token}` }];
  }
  if (authType === 'basic' && authFields.username) {
    const encoded = btoa(`${authFields.username}:${authFields.password || ''}`);
    return [{ key: 'Authorization', value: `Basic ${encoded}` }];
  }
  if (authType === 'api-key' && authFields.header && authFields.value) {
    return [{ key: authFields.header, value: authFields.value }];
  }
  return [];
}

/* =====================================================
   Sending Requests
   ===================================================== */
async function sendRequest() {
  AppTabs.saveCurrentTabState();
  const tab = AppTabs.getActive();
  if (!tab) return;

  const url = document.getElementById('url-input').value.trim();
  if (!url) { UI.showToast('Please enter a URL', 'warning'); return; }

  const method    = document.getElementById('method-select').value;
  const body      = document.getElementById('body-input').value;
  const bodyType  = document.querySelector('input[name="body-type"]:checked').value;
  const authType  = document.getElementById('auth-type').value;
  const authFields = getAuthFieldsFromUI();

  const headers   = [
    ...getHeadersFromUI(),
    ...buildAuthHeaders(authType, authFields),
  ];

  // JSON validation before sending
  if (bodyType === 'json' && body.trim()) {
    try { JSON.parse(body); } catch (e) {
      document.getElementById('json-error').textContent = `JSON Error: ${e.message}`;
      UI.showToast('Fix JSON body before sending', 'error');
      return;
    }
  }
  document.getElementById('json-error').textContent = '';

  // UI state: loading
  setSendingState(true);
  UI.showResponseLoading();

  // Switch to body resp tab
  switchRespTab('body');

  try {
    const result = await RequestModule.sendRequest({ method, url, headers, body, bodyType });

    UI.showResponseResult(result);

    // Persist to history
    const histEntry = { method, url, headers, body, bodyType, authType, authFields, status: result.status };
    Storage.addHistory(histEntry);
    Storage.addUrl(url);
    CollectionsModule.renderHistory();
    updateUrlSuggestions();

    const statusLabel = `${result.status} ${result.statusText}`;
    const toastType = result.status >= 400 ? 'error' : 'success';
    UI.showToast(`${statusLabel} · ${result.time}ms`, toastType);

  } catch (err) {
    UI.showResponseError(err.message);
    UI.showToast(err.message, 'error');
  } finally {
    setSendingState(false);
  }
}

function setSendingState(sending) {
  const btn = document.getElementById('send-btn');
  const text = btn.querySelector('.btn-send-text');
  const loader = btn.querySelector('.btn-send-loader');
  btn.disabled = sending;
  text.style.display  = sending ? 'none' : '';
  loader.style.display = sending ? 'flex' : 'none';
}

/* =====================================================
   Response Panel Reset
   ===================================================== */
function resetResponsePanel() {
  document.getElementById('response-placeholder').style.display = 'flex';
  document.getElementById('response-loading').style.display = 'none';
  document.getElementById('response-output').style.display = 'none';
  document.getElementById('response-tree').style.display = 'none';
  document.getElementById('response-meta').style.display = 'none';
  document.getElementById('copy-response-btn').style.display = 'none';
  document.getElementById('response-headers-list').innerHTML = '';
  document.getElementById('response-body').innerHTML = '';
}

/* =====================================================
   Tab Switching (request tabs)
   ===================================================== */
function switchReqTab(name) {
  document.querySelectorAll('.req-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
  document.querySelectorAll('.req-tab-content').forEach(c => c.classList.toggle('active', c.id === `tab-${name}`));
}

function switchRespTab(name) {
  document.querySelectorAll('.resp-tab').forEach(t => t.classList.toggle('active', t.dataset.respTab === name));
  document.querySelectorAll('.resp-tab-content').forEach(c => c.classList.toggle('active', c.id === `resp-tab-${name}`));
}

/* =====================================================
   Helpers
   ===================================================== */
function shortUrl(url) {
  try {
    const u = new URL(url);
    return u.hostname + (u.pathname !== '/' ? u.pathname : '');
  } catch { return url.substring(0, 30) || 'Request'; }
}

function updateMethodColor() {
  const sel = document.getElementById('method-select');
  const method = sel.value;
  const colors = { GET:'#22c55e', POST:'#f97316', PUT:'#3b82f6', PATCH:'#a855f7', DELETE:'#ef4444' };
  sel.style.color = colors[method] || 'var(--text-primary)';
}

function toggleFormatBtn(bodyType) {
  document.getElementById('format-json-btn').style.display = bodyType === 'json' ? 'flex' : 'none';
}

function updateUrlSuggestions() {
  const dl = document.getElementById('url-suggestions');
  dl.innerHTML = '';
  Storage.getUrlHistory().forEach(url => {
    const opt = document.createElement('option');
    opt.value = url;
    dl.appendChild(opt);
  });
}

/* =====================================================
   Sidebar Collapse
   ===================================================== */
function toggleSidebarCollapse() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('collapsed');
}

/* =====================================================
   Sidebar Section Accordion
   ===================================================== */
function initAccordions() {
  document.querySelectorAll('.section-header[data-toggle]').forEach(header => {
    header.addEventListener('click', (e) => {
      if (e.target.closest('.btn-icon') && !e.target.closest('[data-toggle]')) return;
      const targetId = header.dataset.toggle;
      const panel = document.getElementById(targetId);
      if (!panel) return;
      panel.classList.toggle('open');
      const chevron = header.querySelector('.chevron');
      if (chevron) chevron.style.transform = panel.classList.contains('open') ? 'rotate(180deg)' : '';
    });
  });
}

/* =====================================================
   Modal Utilities
   ===================================================== */
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) { modal.style.display = 'flex'; modal.querySelector('input, select')?.focus(); }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = 'none';
}

/* =====================================================
   Theme Toggle
   ===================================================== */
function toggleTheme() {
  const body = document.body;
  const current = body.dataset.theme;
  const next = current === 'dark' ? 'light' : 'dark';
  body.dataset.theme = next;
  Storage.saveTheme(next);

  document.getElementById('theme-icon-dark').style.display  = next === 'dark'  ? '' : 'none';
  document.getElementById('theme-icon-light').style.display = next === 'light' ? '' : 'none';
}

function applyStoredTheme() {
  const theme = Storage.getTheme();
  document.body.dataset.theme = theme;
  document.getElementById('theme-icon-dark').style.display  = theme === 'dark'  ? '' : 'none';
  document.getElementById('theme-icon-light').style.display = theme === 'light' ? '' : 'none';
}

/* =====================================================
   Collections: Save Request Modal
   ===================================================== */
function openSaveModal() {
  AppTabs.saveCurrentTabState();
  const tab = AppTabs.getActive();
  if (!tab || !tab.url.trim()) { UI.showToast('Enter a URL before saving', 'warning'); return; }

  document.getElementById('save-req-name').value = tab.label !== 'New Request' ? tab.label : shortUrl(tab.url);

  const sel = document.getElementById('save-collection-select');
  sel.innerHTML = '';
  const cols = Storage.getCollections();
  if (!cols.length) {
    sel.innerHTML = '<option value="">— Create a collection first —</option>';
  } else {
    cols.forEach(col => {
      const opt = document.createElement('option');
      opt.value = col.id;
      opt.textContent = col.name;
      sel.appendChild(opt);
    });
  }

  openModal('save-modal');
}

/* =====================================================
   cURL Generation / Import
   ===================================================== */
function generateCurl() {
  AppTabs.saveCurrentTabState();
  const tab = AppTabs.getActive();
  const cmd = RequestModule.generateCurl({
    method:   tab.method,
    url:      tab.url,
    headers:  tab.headers,
    body:     tab.body,
    bodyType: tab.bodyType,
  });
  document.getElementById('curl-output').value = cmd;
  UI.showToast('cURL generated', 'success');
}

function importCurlCommand() {
  const raw = document.getElementById('curl-output').value.trim();
  if (!raw) { UI.showToast('Paste a cURL command first', 'warning'); return; }

  try {
    const req = RequestModule.parseCurl(raw);
    AppTabs.loadRequestIntoCurrentTab(req);
    UI.showToast('cURL imported', 'success');
  } catch (e) {
    UI.showToast('Failed to parse cURL: ' + e.message, 'error');
  }
}

/* =====================================================
   Format JSON Body
   ===================================================== */
function formatJsonBody() {
  const ta = document.getElementById('body-input');
  try {
    const parsed = JSON.parse(ta.value);
    ta.value = JSON.stringify(parsed, null, 2);
    document.getElementById('json-error').textContent = '';
    UI.showToast('JSON formatted', 'success');
  } catch (e) {
    document.getElementById('json-error').textContent = `JSON Error: ${e.message}`;
    UI.showToast('Invalid JSON', 'error');
  }
}

/* =====================================================
   Event Wiring
   ===================================================== */
document.addEventListener('DOMContentLoaded', () => {

  // Theme
  applyStoredTheme();

  // Initial tab
  AppTabs.newTab();

  // Populate URL suggestions
  updateUrlSuggestions();

  // Render sidebar
  CollectionsModule.renderCollections();
  CollectionsModule.renderHistory();
  CollectionsModule.renderEnvSelect();

  // ---- URL bar ----
  document.getElementById('send-btn').addEventListener('click', sendRequest);

  document.getElementById('url-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendRequest();
  });

  document.getElementById('method-select').addEventListener('change', updateMethodColor);

  // ---- Request tabs ----
  document.querySelectorAll('.req-tab').forEach(btn => {
    btn.addEventListener('click', () => switchReqTab(btn.dataset.tab));
  });

  // ---- Response tabs ----
  document.querySelectorAll('.resp-tab').forEach(btn => {
    btn.addEventListener('click', () => switchRespTab(btn.dataset.respTab));
  });

  // ---- Headers ----
  document.getElementById('add-header-btn').addEventListener('click', () => addHeaderRow());

  // ---- Body type ----
  document.querySelectorAll('input[name="body-type"]').forEach(radio => {
    radio.addEventListener('change', () => toggleFormatBtn(radio.value));
  });

  document.getElementById('format-json-btn').addEventListener('click', formatJsonBody);

  // JSON validation on input
  document.getElementById('body-input').addEventListener('input', () => {
    const bodyType = document.querySelector('input[name="body-type"]:checked').value;
    const body = document.getElementById('body-input').value.trim();
    const errEl = document.getElementById('json-error');
    if (bodyType === 'json' && body) {
      try { JSON.parse(body); errEl.textContent = ''; }
      catch (e) { errEl.textContent = `JSON Error: ${e.message}`; }
    } else {
      errEl.textContent = '';
    }
  });

  // ---- Auth ----
  document.getElementById('auth-type').addEventListener('change', function() {
    renderAuthFields(this.value);
  });

  // ---- Response view buttons ----
  document.querySelectorAll('.resp-view-btn').forEach(btn => {
    btn.addEventListener('click', () => UI.setView(btn.dataset.view));
  });

  // ---- Copy response ----
  document.getElementById('copy-response-btn').addEventListener('click', () => {
    const raw = UI.getCurrentRaw();
    if (!raw) return;
    navigator.clipboard.writeText(raw).then(() => UI.showToast('Response copied', 'success'));
  });

  // ---- Response search ----
  document.getElementById('toggle-search-btn').addEventListener('click', () => {
    const inp = document.getElementById('response-search');
    const visible = inp.style.display !== 'none';
    inp.style.display = visible ? 'none' : 'block';
    if (!visible) { inp.focus(); inp.value = ''; }
    else { UI.applySearch(''); }
  });

  document.getElementById('response-search').addEventListener('input', function() {
    UI.applySearch(this.value);
  });

  // ---- Tab buttons ----
  document.getElementById('add-tab-btn').addEventListener('click', () => AppTabs.newTab());

  // ---- Sidebar toggle ----
  document.getElementById('toggle-sidebar').addEventListener('click', toggleSidebarCollapse);

  // ---- Theme toggle ----
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

  // ---- Keyboard shortcuts modal ----
  document.getElementById('keyboard-shortcuts-btn').addEventListener('click', () => openModal('shortcuts-modal'));

  // ---- Accordions ----
  initAccordions();

  // ---- Collections ----
  document.getElementById('new-collection-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    openModal('new-collection-modal');
    document.getElementById('new-collection-name').value = '';
  });

  document.getElementById('confirm-new-collection-btn').addEventListener('click', () => {
    const name = document.getElementById('new-collection-name').value.trim();
    if (!name) { UI.showToast('Enter a collection name', 'warning'); return; }
    Storage.addCollection(name);
    CollectionsModule.renderCollections();
    closeModal('new-collection-modal');
    UI.showToast(`Collection "${name}" created`, 'success');
  });

  document.getElementById('save-to-collection-btn').addEventListener('click', openSaveModal);

  document.getElementById('confirm-save-btn').addEventListener('click', () => {
    const colId = document.getElementById('save-collection-select').value;
    const name  = document.getElementById('save-req-name').value.trim();
    if (!colId) { UI.showToast('Select or create a collection first', 'warning'); return; }
    if (!name)  { UI.showToast('Enter a request name', 'warning'); return; }

    AppTabs.saveCurrentTabState();
    const tab = AppTabs.getActive();

    Storage.addRequestToCollection(colId, {
      name, method: tab.method, url: tab.url,
      headers: tab.headers, body: tab.body, bodyType: tab.bodyType,
      authType: tab.authType, authFields: tab.authFields,
    });
    CollectionsModule.renderCollections();
    closeModal('save-modal');
    UI.showToast(`Saved to collection`, 'success');
  });

  document.getElementById('export-collection-btn').addEventListener('click', CollectionsModule.exportCollections);

  document.getElementById('import-collection-btn').addEventListener('click', () => {
    document.getElementById('import-file-input').click();
  });

  document.getElementById('import-file-input').addEventListener('change', function() {
    if (this.files[0]) {
      CollectionsModule.importCollections(this.files[0]);
      this.value = '';
    }
  });

  // ---- History ----
  document.getElementById('clear-history-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    if (confirm('Clear all request history?')) {
      Storage.clearHistory();
      CollectionsModule.renderHistory();
      UI.showToast('History cleared', 'info');
    }
  });

  // ---- Environments ----
  document.getElementById('env-select').addEventListener('change', function() {
    Storage.setActiveEnv(this.value || null);
    UI.showToast(this.value ? 'Environment activated' : 'No environment selected', 'info');
  });

  document.getElementById('manage-env-btn').addEventListener('click', () => {
    CollectionsModule.renderEnvModal();
    openModal('env-modal');
  });

  document.getElementById('add-env-btn').addEventListener('click', () => {
    const name = prompt('Environment name:');
    if (!name) return;
    Storage.addEnvironment(name.trim());
    CollectionsModule.renderEnvSelect();
    CollectionsModule.renderEnvModal();
    UI.showToast(`Environment "${name}" created`, 'success');
  });

  // ---- cURL ----
  document.getElementById('generate-curl-btn').addEventListener('click', generateCurl);
  document.getElementById('import-curl-btn').addEventListener('click', importCurlCommand);
  document.getElementById('copy-curl-btn').addEventListener('click', () => {
    const val = document.getElementById('curl-output').value;
    if (!val) { UI.showToast('Generate cURL first', 'warning'); return; }
    navigator.clipboard.writeText(val).then(() => UI.showToast('cURL copied', 'success'));
  });

  // ---- Modal close buttons ----
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.close));
  });

  // Close modal on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay.id);
    });
  });

  // ---- Keyboard Shortcuts ----
  document.addEventListener('keydown', (e) => {
    const ctrl = e.ctrlKey || e.metaKey;

    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay').forEach(m => {
        if (m.style.display !== 'none') closeModal(m.id);
      });
      // Close search if open
      const searchInp = document.getElementById('response-search');
      if (searchInp.style.display !== 'none') {
        searchInp.style.display = 'none';
        UI.applySearch('');
      }
      return;
    }

    if (ctrl && e.key === 'Enter')         { e.preventDefault(); sendRequest(); }
    if (ctrl && e.key === 't')             { e.preventDefault(); AppTabs.newTab(); }
    if (ctrl && e.key === 'w')             { e.preventDefault(); const t = AppTabs.getActive(); if (t) AppTabs.closeTab(t.id); }
    if (ctrl && e.key === 'l')             { e.preventDefault(); document.getElementById('url-input').select(); }
    if (ctrl && e.key === 's')             { e.preventDefault(); openSaveModal(); }
    if (ctrl && e.shiftKey && e.key === 'F') { e.preventDefault(); formatJsonBody(); }
    if (ctrl && e.key === 'd')             { e.preventDefault(); AppTabs.duplicateTab(); }
    if (ctrl && e.key === '/')             { e.preventDefault(); openModal('shortcuts-modal'); }
  });

  // ---- Confirm new collection on Enter ----
  document.getElementById('new-collection-name').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('confirm-new-collection-btn').click();
  });

  document.getElementById('save-req-name').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('confirm-save-btn').click();
  });
});
