/* collections.js — Collections and environment sidebar rendering */

const CollectionsModule = (() => {

  /* ---- Collections ---- */

  function renderCollections() {
    const list = document.getElementById('collections-list');
    const cols = Storage.getCollections();
    list.innerHTML = '';

    if (!cols.length) {
      list.innerHTML = '<div class="empty-state">No collections yet</div>';
      return;
    }

    cols.forEach(col => {
      const item = document.createElement('div');
      item.className = 'collection-item';
      item.dataset.id = col.id;

      item.innerHTML = `
        <div class="collection-header" data-col-id="${col.id}">
          <button class="tree-toggle collection-toggle" title="Expand">▶</button>
          <span class="collection-name">${escapeHtml(col.name)}</span>
          <button class="btn-icon del-col-btn" data-col-id="${col.id}" title="Delete Collection">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
            </svg>
          </button>
        </div>
        <div class="collection-requests" id="col-reqs-${col.id}">
          ${col.requests.length === 0 ? '<div class="empty-state" style="padding:6px 28px;font-size:11px">No requests</div>' :
            col.requests.map(req => `
              <div class="collection-request-item" data-req-id="${req.id}" data-col-id="${col.id}">
                <span class="method-badge badge-${req.method}">${req.method}</span>
                <span class="collection-request-name">${escapeHtml(req.name || req.url)}</span>
                <button class="btn-icon del-req-btn" data-req-id="${req.id}" data-col-id="${col.id}" title="Delete Request">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            `).join('')
          }
        </div>
      `;

      list.appendChild(item);

      // Toggle expand/collapse
      item.querySelector('.collection-header').addEventListener('click', (e) => {
        if (e.target.closest('.del-col-btn')) return;
        const reqs = item.querySelector('.collection-requests');
        const toggle = item.querySelector('.collection-toggle');
        reqs.classList.toggle('open');
        toggle.classList.toggle('open');
      });

      // Delete collection
      item.querySelector('.del-col-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm(`Delete collection "${col.name}"?`)) {
          Storage.deleteCollection(col.id);
          renderCollections();
          UI.showToast('Collection deleted', 'info');
        }
      });

      // Load request from collection
      item.querySelectorAll('.collection-request-item').forEach(reqEl => {
        reqEl.addEventListener('click', (e) => {
          if (e.target.closest('.del-req-btn')) return;
          const req = col.requests.find(r => r.id === reqEl.dataset.reqId);
          if (req) AppTabs.loadRequestIntoCurrentTab(req);
        });

        reqEl.querySelector('.del-req-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          Storage.deleteRequestFromCollection(col.id, reqEl.dataset.reqId);
          renderCollections();
        });
      });
    });
  }

  /* ---- History ---- */

  function renderHistory() {
    const list = document.getElementById('history-list');
    const items = Storage.getHistory();
    list.innerHTML = '';

    if (!items.length) {
      list.innerHTML = '<div class="empty-state">No history yet</div>';
      return;
    }

    items.forEach(item => {
      const el = document.createElement('div');
      el.className = 'history-item';
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');

      const date = new Date(parseInt(item.id));
      const timeStr = isNaN(date) ? '' : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      el.innerHTML = `
        <div class="history-item-info">
          <div class="history-meta">
            <span class="method-badge badge-${item.method}">${item.method}</span>
            ${item.status ? `<span class="meta-badge status-${Math.floor(item.status/100)}xx">${item.status}</span>` : ''}
            <span>${timeStr}</span>
          </div>
          <div class="history-url" title="${escapeHtml(item.url)}">${escapeHtml(item.url)}</div>
        </div>
        <button class="btn-icon del-history-btn" data-id="${item.id}" title="Delete" aria-label="Delete history item">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      `;

      el.addEventListener('click', (e) => {
        if (e.target.closest('.del-history-btn')) return;
        AppTabs.loadRequestIntoCurrentTab(item);
      });

      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); AppTabs.loadRequestIntoCurrentTab(item); }
      });

      el.querySelector('.del-history-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        Storage.deleteHistory(item.id);
        renderHistory();
      });

      list.appendChild(el);
    });
  }

  /* ---- Environments ---- */

  let activeEnvEditorId = null;

  function renderEnvSelect() {
    const sel = document.getElementById('env-select');
    const envs = Storage.getEnvironments();
    const activeId = Storage.getActiveEnv();

    sel.innerHTML = '<option value="">No Environment</option>';
    envs.forEach(env => {
      const opt = document.createElement('option');
      opt.value = env.id;
      opt.textContent = env.name;
      if (env.id === activeId) opt.selected = true;
      sel.appendChild(opt);
    });
  }

  function renderEnvModal() {
    const envs = Storage.getEnvironments();
    const ul = document.getElementById('env-items-list');
    ul.innerHTML = '';

    envs.forEach(env => {
      const li = document.createElement('li');
      li.className = `env-item${env.id === activeEnvEditorId ? ' active' : ''}`;
      li.textContent = env.name;
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', env.id === activeEnvEditorId);

      li.addEventListener('click', () => {
        activeEnvEditorId = env.id;
        renderEnvModal();
        renderEnvVarsEditor(env);
      });

      ul.appendChild(li);
    });

    if (activeEnvEditorId) {
      const env = envs.find(e => e.id === activeEnvEditorId);
      if (env) renderEnvVarsEditor(env);
    }
  }

  function renderEnvVarsEditor(env) {
    const panel = document.getElementById('env-vars-editor');
    const varEntries = Object.entries(env.vars);

    panel.innerHTML = `
      <div class="env-vars-header">
        <span style="font-size:12px;font-weight:600">${escapeHtml(env.name)}</span>
        <div style="display:flex;gap:6px">
          <button class="btn-sm" id="add-env-var-btn">+ Add</button>
          <button class="btn-sm btn-danger-sm" id="del-env-btn">Delete Env</button>
        </div>
      </div>
      <div class="env-var-rows" id="env-var-rows">
        ${varEntries.map(([k, v]) => envVarRow(k, v)).join('')}
        ${varEntries.length === 0 ? '<div class="empty-state" style="padding:8px 0;font-size:11px">No variables yet</div>' : ''}
      </div>
    `;

    panel.querySelector('#add-env-var-btn').addEventListener('click', () => {
      const rows = panel.querySelector('#env-var-rows');
      const div = document.createElement('div');
      div.innerHTML = envVarRow('', '');
      rows.appendChild(div.firstElementChild);
      attachEnvVarSaveListeners(env.id);
    });

    panel.querySelector('#del-env-btn').addEventListener('click', () => {
      if (confirm(`Delete environment "${env.name}"?`)) {
        Storage.deleteEnvironment(env.id);
        if (Storage.getActiveEnv() === env.id) Storage.setActiveEnv(null);
        activeEnvEditorId = null;
        renderEnvModal();
        renderEnvSelect();
        panel.innerHTML = '<p class="select-env-hint">Select or create an environment</p>';
      }
    });

    attachEnvVarSaveListeners(env.id);
  }

  function envVarRow(key, value) {
    return `
      <div class="env-var-row">
        <input type="text" class="env-var-key" placeholder="Variable name" value="${escapeHtml(key)}" />
        <input type="text" class="env-var-val" placeholder="Value" value="${escapeHtml(value)}" />
        <button class="btn-icon env-var-del-btn" title="Remove">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    `;
  }

  function attachEnvVarSaveListeners(envId) {
    const panel = document.getElementById('env-vars-editor');
    if (!panel) return;

    // Auto-save on any input change
    panel.querySelectorAll('.env-var-key, .env-var-val').forEach(inp => {
      inp.removeEventListener('input', inp._saveHandler);
      inp._saveHandler = () => saveEnvVars(envId);
      inp.addEventListener('input', inp._saveHandler);
    });

    // Delete row
    panel.querySelectorAll('.env-var-del-btn').forEach(btn => {
      btn.onclick = () => {
        btn.closest('.env-var-row').remove();
        saveEnvVars(envId);
      };
    });
  }

  function saveEnvVars(envId) {
    const panel = document.getElementById('env-vars-editor');
    if (!panel) return;
    const vars = {};
    panel.querySelectorAll('.env-var-row').forEach(row => {
      const k = row.querySelector('.env-var-key').value.trim();
      const v = row.querySelector('.env-var-val').value;
      if (k) vars[k] = v;
    });
    Storage.updateEnvironment(envId, vars);
  }

  /* ---- Import / Export ---- */

  function exportCollections() {
    const data = { version: '1.0', collections: Storage.getCollections(), exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'mini-postman-collections.json'; a.click();
    URL.revokeObjectURL(url);
    UI.showToast('Collections exported', 'success');
  }

  function importCollections(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const imported = data.collections || (Array.isArray(data) ? data : []);
        if (!Array.isArray(imported)) throw new Error('Invalid format');

        const existing = Storage.getCollections();
        // Merge: skip collections whose IDs already exist
        let added = 0;
        imported.forEach(col => {
          if (!existing.find(c => c.id === col.id)) { existing.push(col); added++; }
        });
        Storage.saveCollections(existing);
        renderCollections();
        UI.showToast(`Imported ${added} collection(s)`, 'success');
      } catch (err) {
        UI.showToast('Import failed: ' + err.message, 'error');
      }
    };
    reader.readAsText(file);
  }

  return {
    renderCollections,
    renderHistory,
    renderEnvSelect,
    renderEnvModal,
    exportCollections,
    importCollections,
  };
})();

/* Utility: escape HTML special chars */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
