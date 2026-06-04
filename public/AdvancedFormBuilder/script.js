/* =====================================================================
   FormForge — Advanced Form Builder
   Features: Edit, Duplicate, Drag & Drop, Required, Placeholder,
   Default, Help Text, Validation Builder, Form Settings, Device Preview,
   Export/Import JSON, Save to LocalStorage, Auto Save
   ===================================================================== */

// ─── State ───────────────────────────────────────────────────────────
let fields = [];
let selectedType = 'text';
let editingFieldId = null;
let formSettings = {
  title: 'Untitled Form',
  description: '',
  buttonText: 'Submit',
  theme: 'dark',
  primaryColor: '#6366f1',
  borderRadius: 8,
  fontSize: 15,
};

let autoSaveTimer = null;
let dragSrcIndex = null;

// ─── DOM refs ─────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

const formPreview   = $('formPreview');
const fieldsList    = $('fieldsList');
const fieldsEmptyMsg= $('fieldsEmptyMsg');
const emptyState    = $('emptyState');
const fieldCountEl  = $('fieldCount');
const autosaveBadge = $('autosaveBadge');
const pvTitle       = $('pvTitle');
const pvDesc        = $('pvDesc');
const previewFrame  = $('previewFrame');
const previewInner  = $('previewInner');

// Builder inputs
const labelInput    = $('labelInput');
const placeholderInput = $('placeholderInput');
const defaultInput  = $('defaultInput');
const helpInput     = $('helpInput');
const requiredInput = $('requiredInput');
const optionsInput  = $('optionsInput');
const optionsGroup  = $('optionsGroup');
const minLenInput   = $('minLenInput');
const maxLenInput   = $('maxLenInput');
const minNumInput   = $('minNumInput');
const maxNumInput   = $('maxNumInput');
const regexInput    = $('regexInput');
const regexMsgInput = $('regexMsgInput');
const minLenGroup   = $('minLenGroup');
const maxLenGroup   = $('maxLenGroup');
const minNumGroup   = $('minNumGroup');
const maxNumGroup   = $('maxNumGroup');
const regexGroup    = $('regexGroup');
const regexMsgGroup = $('regexMsgGroup');

// ─── Init ─────────────────────────────────────────────────────────────
function init() {
  loadFromStorage();
  renderAll();
  bindEvents();
}

// ─── Bind Events ─────────────────────────────────────────────────────
function bindEvents() {
  // Type selector buttons
  document.querySelectorAll('.type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedType = btn.dataset.type;
      updateTypeUI(selectedType);
    });
  });

  // Panel tabs
  document.querySelectorAll('.ptab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const t = tab.dataset.tab;
      $('fieldTab').classList.toggle('hidden', t !== 'field');
      $('settingsTab').classList.toggle('hidden', t !== 'settings');
    });
  });

  // Add field
  $('addFieldBtn').addEventListener('click', addField);
  labelInput.addEventListener('keydown', e => { if (e.key === 'Enter') addField(); });

  // Device tabs
  document.querySelectorAll('.device-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.device-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      previewFrame.dataset.device = tab.dataset.device;
    });
  });

  // Form meta inputs
  $('formTitle').addEventListener('input', e => {
    formSettings.title = e.target.value || 'Untitled Form';
    pvTitle.textContent = formSettings.title;
    scheduleAutoSave();
  });

  $('formDesc').addEventListener('input', e => {
    formSettings.description = e.target.value;
    pvDesc.textContent = formSettings.description;
    scheduleAutoSave();
  });

  // Settings panel
  $('btnTextInput').addEventListener('input', e => {
    formSettings.buttonText = e.target.value || 'Submit';
    renderFormPreview();
    scheduleAutoSave();
  });

  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      formSettings.theme = btn.dataset.theme;
      applyTheme();
      scheduleAutoSave();
    });
  });

  const primaryColorPicker = $('primaryColor');
  const primaryColorText   = $('primaryColorText');

  primaryColorPicker.addEventListener('input', e => {
    formSettings.primaryColor = e.target.value;
    primaryColorText.value = e.target.value;
    applyPrimaryColor();
    scheduleAutoSave();
  });

  primaryColorText.addEventListener('input', e => {
    const val = e.target.value;
    if (/^#[0-9a-fA-F]{6}$/.test(val)) {
      formSettings.primaryColor = val;
      primaryColorPicker.value = val;
      applyPrimaryColor();
      scheduleAutoSave();
    }
  });

  $('borderRadius').addEventListener('input', e => {
    formSettings.borderRadius = parseInt(e.target.value);
    $('borderRadiusVal').textContent = e.target.value + 'px';
    previewInner.style.setProperty('--preview-radius', e.target.value + 'px');
    scheduleAutoSave();
  });

  $('fontSize').addEventListener('input', e => {
    formSettings.fontSize = parseInt(e.target.value);
    $('fontSizeVal').textContent = e.target.value + 'px';
    previewInner.style.fontSize = e.target.value + 'px';
    scheduleAutoSave();
  });

  // Save / Export / Import / Generate
  $('saveBtn').addEventListener('click', saveToStorage);
  $('exportBtn').addEventListener('click', exportJSON);
  $('importBtn').addEventListener('click', () => $('importFile').click());
  $('importFile').addEventListener('change', importJSON);
  $('generateBtn').addEventListener('click', showHTMLModal);
  $('clearAllBtn').addEventListener('click', clearAll);

  // Edit modal
  $('closeModal').addEventListener('click', closeEditModal);
  $('cancelEdit').addEventListener('click', closeEditModal);
  $('saveEdit').addEventListener('click', saveEdit);
  $('editModal').addEventListener('click', e => {
    if (e.target === $('editModal')) closeEditModal();
  });

  // HTML modal
  $('closeHtmlModal').addEventListener('click', () => $('htmlModal').classList.add('hidden'));
  $('htmlModal').addEventListener('click', e => {
    if (e.target === $('htmlModal')) $('htmlModal').classList.add('hidden');
  });
  $('copyHtml').addEventListener('click', () => {
    navigator.clipboard.writeText($('htmlOutput').value);
    $('copyHtml').textContent = 'Copied!';
    setTimeout(() => { $('copyHtml').textContent = 'Copy'; }, 2000);
  });
}

// ─── Type UI ─────────────────────────────────────────────────────────
function updateTypeUI(type) {
  const isChoice = type === 'select' || type === 'radio';
  const isNumber = type === 'number';
  const noLen = type === 'checkbox' || type === 'date' || type === 'file' || type === 'number';

  optionsGroup.style.display = isChoice ? '' : 'none';
  minNumGroup.style.display  = isNumber ? '' : 'none';
  maxNumGroup.style.display  = isNumber ? '' : 'none';
  minLenGroup.style.display  = noLen    ? 'none' : '';
  maxLenGroup.style.display  = noLen    ? 'none' : '';
  regexGroup.style.display   = (noLen || isChoice) ? 'none' : '';
  regexMsgGroup.style.display= (noLen || isChoice) ? 'none' : '';
}

// ─── Add Field ────────────────────────────────────────────────────────
function addField() {
  const label = labelInput.value.trim();
  if (!label) {
    labelInput.focus();
    labelInput.style.borderColor = 'var(--danger)';
    setTimeout(() => { labelInput.style.borderColor = ''; }, 1200);
    return;
  }

  const field = {
    id:          Date.now(),
    label,
    type:        selectedType,
    placeholder: placeholderInput.value.trim(),
    defaultVal:  defaultInput.value.trim(),
    helpText:    helpInput.value.trim(),
    required:    requiredInput.checked,
    options:     optionsInput.value.split('\n').map(o => o.trim()).filter(Boolean),
    validation: {
      minLen:    minLenInput.value ? parseInt(minLenInput.value) : null,
      maxLen:    maxLenInput.value ? parseInt(maxLenInput.value) : null,
      minNum:    minNumInput.value !== '' ? parseFloat(minNumInput.value) : null,
      maxNum:    maxNumInput.value !== '' ? parseFloat(maxNumInput.value) : null,
      regex:     regexInput.value.trim(),
      regexMsg:  regexMsgInput.value.trim() || 'Invalid format',
    }
  };

  fields.push(field);
  resetBuilderInputs();
  renderAll();
  scheduleAutoSave();

  // Flash success
  const btn = $('addFieldBtn');
  btn.textContent = '✓ Added!';
  setTimeout(() => {
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add Field`;
  }, 1000);
}

function resetBuilderInputs() {
  labelInput.value = '';
  placeholderInput.value = '';
  defaultInput.value = '';
  helpInput.value = '';
  requiredInput.checked = false;
  optionsInput.value = '';
  minLenInput.value = '';
  maxLenInput.value = '';
  minNumInput.value = '';
  maxNumInput.value = '';
  regexInput.value = '';
  regexMsgInput.value = '';
}

// ─── Render All ───────────────────────────────────────────────────────
function renderAll() {
  renderFieldsList();
  renderFormPreview();
  applyTheme();
  applyPrimaryColor();
  fieldCountEl.textContent = fields.length;
  emptyState.style.display = fields.length ? 'none' : '';
  fieldsEmptyMsg.style.display = fields.length ? 'none' : '';
}

// ─── Fields List ─────────────────────────────────────────────────────
function renderFieldsList() {
  fieldsList.innerHTML = '';

  if (!fields.length) {
    fieldsList.appendChild(fieldsEmptyMsg);
    return;
  }

  fields.forEach((field, index) => {
    const item = document.createElement('div');
    item.className = 'field-item';
    item.dataset.id = field.id;
    item.dataset.index = index;
    item.draggable = true;

    item.innerHTML = `
      <span class="drag-handle" title="Drag to reorder">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="9" cy="6" r="1" fill="currentColor"/><circle cx="15" cy="6" r="1" fill="currentColor"/>
          <circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/>
          <circle cx="9" cy="18" r="1" fill="currentColor"/><circle cx="15" cy="18" r="1" fill="currentColor"/>
        </svg>
      </span>
      <div class="field-item-info">
        <div class="field-item-label">${escapeHtml(field.label)}</div>
        <div class="field-item-meta">
          <span class="field-type-badge">${field.type}</span>
          ${field.required ? '<span class="field-req-badge">required</span>' : ''}
        </div>
      </div>
      <div class="field-item-actions">
        <button class="icon-btn" data-action="edit" data-id="${field.id}" title="Edit">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button class="icon-btn" data-action="dupe" data-id="${field.id}" title="Duplicate">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
        </button>
        <button class="icon-btn danger" data-action="del" data-id="${field.id}" title="Delete">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </button>
      </div>
    `;

    // Action buttons
    item.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const action = btn.dataset.action;
        const id = parseInt(btn.dataset.id);
        if (action === 'edit') openEditModal(id);
        if (action === 'dupe') duplicateField(id);
        if (action === 'del')  deleteField(id);
      });
    });

    // Drag & Drop
    item.addEventListener('dragstart', e => {
      dragSrcIndex = index;
      item.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });

    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
      document.querySelectorAll('.field-item').forEach(el => el.classList.remove('drag-over'));
    });

    item.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      document.querySelectorAll('.field-item').forEach(el => el.classList.remove('drag-over'));
      item.classList.add('drag-over');
    });

    item.addEventListener('drop', e => {
      e.preventDefault();
      const targetIndex = parseInt(item.dataset.index);
      if (dragSrcIndex !== null && dragSrcIndex !== targetIndex) {
        const moved = fields.splice(dragSrcIndex, 1)[0];
        fields.splice(targetIndex, 0, moved);
        dragSrcIndex = null;
        renderAll();
        scheduleAutoSave();
      }
    });

    fieldsList.appendChild(item);
  });
}

// ─── Form Preview ────────────────────────────────────────────────────
function renderFormPreview() {
  formPreview.innerHTML = '';

  fields.forEach(field => {
    const group = document.createElement('div');
    group.className = 'pf-group';

    const isChoice = field.type === 'checkbox' || field.type === 'radio';

    if (!isChoice) {
      const lbl = document.createElement('label');
      lbl.className = 'pf-label';
      lbl.textContent = field.label;
      if (field.required) {
        const star = document.createElement('span');
        star.className = 'req-star';
        star.textContent = ' *';
        lbl.appendChild(star);
      }
      group.appendChild(lbl);
    }

    // Build input element
    if (field.type === 'select') {
      const sel = document.createElement('select');
      if (field.placeholder) {
        const ph = document.createElement('option');
        ph.value = '';
        ph.disabled = true;
        ph.selected = true;
        ph.textContent = field.placeholder;
        sel.appendChild(ph);
      }
      (field.options.length ? field.options : ['Option 1', 'Option 2']).forEach(opt => {
        const o = document.createElement('option');
        o.textContent = opt;
        if (opt === field.defaultVal) o.selected = true;
        sel.appendChild(o);
      });
      group.appendChild(sel);

    } else if (field.type === 'radio') {
      const lbl = document.createElement('label');
      lbl.className = 'pf-label';
      lbl.textContent = field.label;
      if (field.required) { const s = document.createElement('span'); s.className='req-star'; s.textContent=' *'; lbl.appendChild(s); }
      group.appendChild(lbl);
      (field.options.length ? field.options : ['Option 1', 'Option 2']).forEach(opt => {
        const row = document.createElement('div');
        row.className = 'pf-radio-row';
        const inp = document.createElement('input');
        inp.type = 'radio';
        inp.name = 'radio_' + field.id;
        inp.value = opt;
        if (opt === field.defaultVal) inp.checked = true;
        row.appendChild(inp);
        const span = document.createElement('span');
        span.textContent = opt;
        row.appendChild(span);
        group.appendChild(row);
      });

    } else if (field.type === 'checkbox') {
      const row = document.createElement('div');
      row.className = 'pf-checkbox-row';
      const inp = document.createElement('input');
      inp.type = 'checkbox';
      if (field.defaultVal === 'true' || field.defaultVal === '1') inp.checked = true;
      row.appendChild(inp);
      const span = document.createElement('span');
      span.textContent = field.label;
      if (field.required) { const s = document.createElement('span'); s.style.color='var(--danger)'; s.textContent=' *'; span.appendChild(s); }
      row.appendChild(span);
      group.appendChild(row);

    } else if (field.type === 'textarea') {
      const ta = document.createElement('textarea');
      if (field.placeholder) ta.placeholder = field.placeholder;
      if (field.defaultVal)   ta.value       = field.defaultVal;
      if (field.required)     ta.required    = true;
      group.appendChild(ta);

    } else {
      const inp = document.createElement('input');
      inp.type = field.type;
      if (field.placeholder) inp.placeholder = field.placeholder;
      if (field.defaultVal)  inp.value       = field.defaultVal;
      if (field.required)    inp.required    = true;
      const v = field.validation || {};
      if (v.minLen != null)  inp.minLength   = v.minLen;
      if (v.maxLen != null)  inp.maxLength   = v.maxLen;
      if (v.minNum != null)  inp.min         = v.minNum;
      if (v.maxNum != null)  inp.max         = v.maxNum;
      if (v.regex)           inp.pattern     = v.regex;
      group.appendChild(inp);
    }

    // Help text
    if (field.helpText) {
      const help = document.createElement('p');
      help.className = 'pf-help';
      help.textContent = field.helpText;
      group.appendChild(help);
    }

    formPreview.appendChild(group);
  });

  // Submit button
  const submitBtn = document.createElement('button');
  submitBtn.className = 'pf-submit';
  submitBtn.textContent = formSettings.buttonText || 'Submit';
  submitBtn.type = 'button';
  formPreview.appendChild(submitBtn);
}

// ─── Theme & Color ────────────────────────────────────────────────────
function applyTheme() {
  // Remove existing theme attributes
  previewInner.removeAttribute('data-theme');
  document.querySelector('.preview-frame').removeAttribute('data-theme');
  previewInner.setAttribute('data-theme', formSettings.theme);
}

function applyPrimaryColor() {
  previewInner.style.setProperty('--preview-btn-bg', formSettings.primaryColor);
  // Also update accent-like colors inside preview focus states
  document.documentElement.style.setProperty('--form-primary', formSettings.primaryColor);
}

// ─── Edit Modal ───────────────────────────────────────────────────────
function openEditModal(id) {
  const field = fields.find(f => f.id === id);
  if (!field) return;

  editingFieldId = id;

  $('editLabel').value        = field.label;
  $('editPlaceholder').value  = field.placeholder || '';
  $('editDefault').value      = field.defaultVal  || '';
  $('editHelp').value         = field.helpText    || '';
  $('editRequired').checked   = field.required    || false;
  $('editOptions').value      = (field.options || []).join('\n');
  $('editOptionsGroup').style.display =
    (field.type === 'select' || field.type === 'radio') ? '' : 'none';

  const v = field.validation || {};
  $('editMinLen').value        = v.minLen  != null ? v.minLen  : '';
  $('editMaxLen').value        = v.maxLen  != null ? v.maxLen  : '';
  $('editMinNum').value        = v.minNum  != null ? v.minNum  : '';
  $('editMaxNum').value        = v.maxNum  != null ? v.maxNum  : '';
  $('editRegex').value         = v.regex   || '';
  $('editRegexMsg').value      = v.regexMsg || '';

  $('editNumGroup').style.display = field.type === 'number' ? '' : 'none';

  $('editModal').classList.remove('hidden');
  $('editLabel').focus();
}

function closeEditModal() {
  $('editModal').classList.add('hidden');
  editingFieldId = null;
}

function saveEdit() {
  const field = fields.find(f => f.id === editingFieldId);
  if (!field) return;

  field.label       = $('editLabel').value.trim()       || field.label;
  field.placeholder = $('editPlaceholder').value.trim();
  field.defaultVal  = $('editDefault').value.trim();
  field.helpText    = $('editHelp').value.trim();
  field.required    = $('editRequired').checked;
  field.options     = $('editOptions').value.split('\n').map(o => o.trim()).filter(Boolean);

  field.validation = {
    minLen:   $('editMinLen').value !== '' ? parseInt($('editMinLen').value)     : null,
    maxLen:   $('editMaxLen').value !== '' ? parseInt($('editMaxLen').value)     : null,
    minNum:   $('editMinNum').value !== '' ? parseFloat($('editMinNum').value)   : null,
    maxNum:   $('editMaxNum').value !== '' ? parseFloat($('editMaxNum').value)   : null,
    regex:    $('editRegex').value.trim(),
    regexMsg: $('editRegexMsg').value.trim() || 'Invalid format',
  };

  closeEditModal();
  renderAll();
  scheduleAutoSave();
}

// ─── Field Actions ────────────────────────────────────────────────────
function deleteField(id) {
  fields = fields.filter(f => f.id !== id);
  renderAll();
  scheduleAutoSave();
}

function duplicateField(id) {
  const field = fields.find(f => f.id === id);
  if (!field) return;
  const clone = JSON.parse(JSON.stringify(field));
  clone.id    = Date.now();
  clone.label = field.label + ' (copy)';
  const idx   = fields.indexOf(field);
  fields.splice(idx + 1, 0, clone);
  renderAll();
  scheduleAutoSave();
}

function clearAll() {
  if (!fields.length) return;
  if (!confirm('Clear all fields?')) return;
  fields = [];
  renderAll();
  scheduleAutoSave();
}

// ─── HTML Generator ───────────────────────────────────────────────────
function showHTMLModal() {
  $('htmlOutput').value = generateHTML();
  $('htmlModal').classList.remove('hidden');
}

function generateHTML() {
  const title = formSettings.title || 'Untitled Form';
  const desc  = formSettings.description;
  const btn   = formSettings.buttonText || 'Submit';
  let html = `<form>\n`;
  if (title) html += `  <h2>${escapeHtml(title)}</h2>\n`;
  if (desc)  html += `  <p>${escapeHtml(desc)}</p>\n\n`;

  fields.forEach(field => {
    html += `  <!-- ${escapeHtml(field.label)} -->\n`;
    html += `  <div class="form-field">\n`;

    const req     = field.required ? ' required' : '';
    const ph      = field.placeholder ? ` placeholder="${escapeAttr(field.placeholder)}"` : '';
    const defVal  = field.defaultVal;
    const isChoice = field.type === 'checkbox' || field.type === 'radio';

    if (!isChoice) {
      html += `    <label>${escapeHtml(field.label)}${field.required ? ' <span class="req">*</span>' : ''}</label>\n`;
    }

    const v = field.validation || {};
    let validAttrs = req + ph;
    if (v.minLen != null) validAttrs += ` minlength="${v.minLen}"`;
    if (v.maxLen != null) validAttrs += ` maxlength="${v.maxLen}"`;
    if (v.regex)          validAttrs += ` pattern="${escapeAttr(v.regex)}" title="${escapeAttr(v.regexMsg)}"`;

    if (field.type === 'select') {
      html += `    <select${req}>\n`;
      if (field.placeholder) html += `      <option value="" disabled selected>${escapeHtml(field.placeholder)}</option>\n`;
      (field.options || []).forEach(opt => {
        const sel = opt === defVal ? ' selected' : '';
        html += `      <option${sel}>${escapeHtml(opt)}</option>\n`;
      });
      html += `    </select>\n`;

    } else if (field.type === 'radio') {
      html += `    <fieldset>\n      <legend>${escapeHtml(field.label)}</legend>\n`;
      (field.options || []).forEach((opt, i) => {
        const id  = `radio_${field.id}_${i}`;
        const chk = opt === defVal ? ' checked' : '';
        html += `      <label><input type="radio" id="${id}" name="field_${field.id}" value="${escapeAttr(opt)}"${chk}${req}> ${escapeHtml(opt)}</label>\n`;
      });
      html += `    </fieldset>\n`;

    } else if (field.type === 'checkbox') {
      const chk = (defVal === 'true' || defVal === '1') ? ' checked' : '';
      html += `    <label><input type="checkbox"${chk}${req}> ${escapeHtml(field.label)}</label>\n`;

    } else if (field.type === 'textarea') {
      html += `    <textarea${validAttrs}>${defVal ? escapeHtml(defVal) : ''}</textarea>\n`;

    } else {
      const numAttrs = v.minNum != null ? ` min="${v.minNum}"` : '';
      const numMax   = v.maxNum != null ? ` max="${v.maxNum}"` : '';
      const val      = defVal ? ` value="${escapeAttr(defVal)}"` : '';
      html += `    <input type="${field.type}"${val}${validAttrs}${numAttrs}${numMax}>\n`;
    }

    if (field.helpText) {
      html += `    <small class="help-text">${escapeHtml(field.helpText)}</small>\n`;
    }

    html += `  </div>\n\n`;
  });

  html += `  <button type="submit">${escapeHtml(btn)}</button>\n`;
  html += `</form>`;
  return html;
}

// ─── Save / Load ──────────────────────────────────────────────────────
function getStoragePayload() {
  return {
    fields,
    formSettings,
    savedAt: new Date().toISOString(),
  };
}

function applyPayload(payload) {
  fields = payload.fields || [];
  if (payload.formSettings) {
    formSettings = { ...formSettings, ...payload.formSettings };
  }
  // Sync UI
  $('formTitle').value        = formSettings.title;
  $('formDesc').value         = formSettings.description;
  $('btnTextInput').value     = formSettings.buttonText;
  $('primaryColor').value     = formSettings.primaryColor;
  $('primaryColorText').value = formSettings.primaryColor;
  $('borderRadius').value     = formSettings.borderRadius;
  $('borderRadiusVal').textContent = formSettings.borderRadius + 'px';
  $('fontSize').value         = formSettings.fontSize;
  $('fontSizeVal').textContent= formSettings.fontSize + 'px';

  // Theme buttons
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === formSettings.theme);
  });

  pvTitle.textContent = formSettings.title;
  pvDesc.textContent  = formSettings.description;
  previewInner.style.fontSize = formSettings.fontSize + 'px';
  previewInner.style.setProperty('--preview-radius', formSettings.borderRadius + 'px');
}

function saveToStorage() {
  try {
    localStorage.setItem('formforge_data', JSON.stringify(getStoragePayload()));
    showAutosaveBadge();
  } catch(e) {
    console.warn('Storage unavailable:', e);
  }
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem('formforge_data');
    if (raw) applyPayload(JSON.parse(raw));
  } catch(e) {
    console.warn('Could not load saved data:', e);
  }
}

function scheduleAutoSave() {
  clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(() => {
    saveToStorage();
  }, 1500);
}

function showAutosaveBadge() {
  autosaveBadge.classList.add('visible');
  clearTimeout(autosaveBadge._timer);
  autosaveBadge._timer = setTimeout(() => {
    autosaveBadge.classList.remove('visible');
  }, 2500);
}

function exportJSON() {
  const data = JSON.stringify(getStoragePayload(), null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `${(formSettings.title || 'form').replace(/\s+/g,'-').toLowerCase()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importJSON(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const payload = JSON.parse(ev.target.result);
      applyPayload(payload);
      renderAll();
      saveToStorage();
      alert(`✓ Imported "${formSettings.title}" with ${fields.length} fields`);
    } catch {
      alert('Invalid JSON file');
    }
  };
  reader.readAsText(file);
  e.target.value = ''; // reset so same file can be re-imported
}

// ─── Helpers ─────────────────────────────────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(str) {
  return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// ─── Start ────────────────────────────────────────────────────────────
init();
