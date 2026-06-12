// script.js - FormForge Dark Form Builder

const TEMPLATES = {
  contact: [
    {type:'text',label:'Full Name',placeholder:'John Doe',required:true},
    {type:'email',label:'Email Address',placeholder:'you@example.com',required:true},
    {type:'textarea',label:'Message',placeholder:'Your message...',required:false},
  ],
  jobapp: [
    {type:'text',label:'Full Name',required:true},
    {type:'email',label:'Email',required:true},
    {type:'text',label:'Position Applied',required:true},
    {type:'date',label:'Available From',required:false},
    {type:'textarea',label:'Cover Letter',required:false},
  ],
  feedback: [
    {type:'text',label:'Your Name',required:false},
    {type:'select',label:'Rating',required:true},
    {type:'textarea',label:'Comments',required:false},
  ],
  event: [
    {type:'text',label:'Full Name',required:true},
    {type:'email',label:'Email',required:true},
    {type:'number',label:'Number of Guests',required:false},
    {type:'date',label:'Preferred Date',required:false},
  ],
};

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("form-canvas");
  const emptyState = document.getElementById("empty-state");
  const propertiesContent = document.getElementById("properties-content");
  const previewBody = document.getElementById("preview-body");

  let fields = [];
  let selectedFieldId = null;
  let activeStep = 1;
  let analytics = { errors: {}, interactions: {}, submissions: 0, starts: 0 };
  let versions = [];
  const MAX_VERSIONS = 20;

  // ── Wizard helpers ──────────────────────────────────────────────────────────
  function getSteps() {
    return [...new Set(fields.map(f => f.step || 1))].sort((a,b)=>a-b);
  }

  function updateStepNav() {
    const steps = getSteps();
    const nav  = document.getElementById('step-nav');
    const tabs = document.getElementById('step-tabs');
    const bar  = document.getElementById('step-progress');
    if (steps.length < 2) { nav.style.display = 'none'; return; }
    nav.style.display = '';
    bar.style.width = ((steps.indexOf(activeStep) + 1) / steps.length * 100) + '%';
    tabs.innerHTML = steps.map(s =>
      `<button class="btn btn-sm ${s === activeStep ? 'btn-primary' : 'btn-outline-secondary'}"
        onclick="activeStep=${s};renderCanvas()">Step ${s}</button>`
    ).join('');
  }

  // ── Conditional visibility ──────────────────────────────────────────────────
  function fieldIsVisible(field) {
    if (!field.condition?.fieldId) return true;
    const triggerEl = canvas.querySelector(
      `[data-id="${field.condition.fieldId}"] input,
       [data-id="${field.condition.fieldId}"] select,
       [data-id="${field.condition.fieldId}"] textarea`
    );
    return triggerEl?.value === field.condition.value;
  }

  // ── Field element builder ───────────────────────────────────────────────────
  function createFieldElement(field) {
    const div = document.createElement("div");
    div.className = "form-field";
    div.dataset.id = field.id;

    let inputHTML = "";
    switch (field.type) {
      case "text": case "email": case "password": case "number": case "date":
        inputHTML = `<input type="${field.type}" class="form-control"
                       placeholder="${field.placeholder || ""}"
                       ${field.required ? "required" : ""}>`;
        break;
      case "textarea":
        inputHTML = `<textarea class="form-control" rows="3"
                       placeholder="${field.placeholder || ""}"
                       ${field.required ? "required" : ""}></textarea>`;
        break;
      case "select":
        inputHTML = `<select class="form-select">
                       <option value="">Choose...</option>
                       <option value="1">Option 1</option>
                       <option value="2">Option 2</option>
                       <option value="3">Option 3</option>
                     </select>`;
        break;
      case "checkbox":
        inputHTML = `<div class="form-check">
                       <input type="checkbox" class="form-check-input">
                       <label class="form-check-label">${field.label}</label>
                     </div>`;
        break;
      case "radio":
        inputHTML = `<div class="form-check">
                       <input type="radio" name="${field.name}" class="form-check-input">
                       <label class="form-check-label">${field.label}</label>
                     </div>`;
        break;
    }

    div.innerHTML = `
      <label class="field-label">${field.label}</label>
      ${inputHTML}
      <button class="remove-btn" title="Remove field">
        <i class="fas fa-trash"></i>
      </button>`;

    // Analytics tracking
    const inp = div.querySelector('input,select,textarea');
    if (inp) {
      inp.addEventListener('focus', () => {
        if (!analytics.interactions[field.id]) {
          analytics.interactions[field.id] = 0;
          analytics.starts++;
        }
        analytics.interactions[field.id]++;
      });
      inp.addEventListener('invalid', () => {
        analytics.errors[field.id] = (analytics.errors[field.id] || 0) + 1;
      });
    }

    // Select field on click
    div.addEventListener("click", (e) => {
      if (!e.target.closest(".remove-btn")) selectField(field.id);
    });

    // Remove button
    div.querySelector(".remove-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      deleteField(field.id);
    });

    return div;
  }

  // ── Add field ───────────────────────────────────────────────────────────────
  function addField(type) {
    const field = {
      id: "field_" + Date.now(),
      type,
      label: getDefaultLabel(type),
      placeholder: type === "textarea" ? "Enter your message..." : "Enter value",
      required: false,
      name: type + "_" + Date.now().toString().slice(-6),
      step: 1,
      condition: null,
    };
    fields.push(field);
    renderCanvas();
    selectField(field.id);
    emptyState.style.display = "none";
  }

  function getDefaultLabel(type) {
    const labels = {
      text: "Full Name", email: "Email Address", password: "Password",
      number: "Number", textarea: "Message", select: "Choose Option",
      checkbox: "I agree to the terms", radio: "Option 1", date: "Date",
    };
    return labels[type] || "New Field";
  }

  // ── Render canvas ───────────────────────────────────────────────────────────
  function renderCanvas() {
    // Save version snapshot
    if (fields.length) {
      versions.push({ ts: Date.now(), fields: JSON.parse(JSON.stringify(fields)) });
      if (versions.length > MAX_VERSIONS) versions.shift();
    }

    updateStepNav();
    canvas.innerHTML = "";

    if (fields.length === 0) {
      canvas.appendChild(emptyState);
      emptyState.style.display = "block";
      return;
    }

    fields
      .filter(f => (f.step || 1) === activeStep)
      .forEach(field => {
        const el = createFieldElement(field);
        if (field.id === selectedFieldId) el.classList.add("selected");
        el.style.display = fieldIsVisible(field) ? '' : 'none';
        canvas.appendChild(el);
      });

    // Re-evaluate conditions when user types
    canvas.addEventListener('input', () => {
      canvas.querySelectorAll('.form-field').forEach(el => {
        const f = fields.find(x => x.id === el.dataset.id);
        if (f) el.style.display = fieldIsVisible(f) ? '' : 'none';
      });
    }, { once: true });
  }

  function selectField(id) {
    selectedFieldId = id;
    renderCanvas();
    showProperties();
  }

  // ── Properties panel ────────────────────────────────────────────────────────
  function showProperties() {
    const field = fields.find(f => f.id === selectedFieldId);
    if (!field) return;

    let html = `
      <div class="mb-3">
        <label class="form-label">Field Type</label>
        <input type="text" class="form-control" value="${field.type}" disabled>
      </div>
      <div class="mb-3">
        <label class="form-label">Label</label>
        <input type="text" class="form-control" id="prop-label" value="${field.label}">
      </div>
      <div class="mb-3">
        <label class="form-label">Name (for form submission)</label>
        <input type="text" class="form-control" id="prop-name" value="${field.name}">
      </div>
      <div class="mb-3">
        <label class="form-label">Form Step</label>
        <select class="form-select" id="prop-step">
          ${[1,2,3,4].map(n =>
            `<option value="${n}" ${(field.step||1)===n?'selected':''}>${'Step '+n}</option>`
          ).join('')}
        </select>
      </div>`;

    if (field.type !== "checkbox" && field.type !== "radio") {
      html += `
        <div class="mb-3">
          <label class="form-label">Placeholder</label>
          <input type="text" class="form-control" id="prop-placeholder" value="${field.placeholder || ''}">
        </div>`;
    }

    html += `
      <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="prop-required" ${field.required ? "checked" : ""}>
        <label class="form-check-label" for="prop-required">Required field</label>
      </div>
      <div class="mb-3">
        <label class="form-label">Show only if field…</label>
        <select class="form-select mb-2" id="prop-cond-field">
          <option value="">Always show</option>
          ${fields.filter(f => f.id !== selectedFieldId)
            .map(f => `<option value="${f.id}" ${field.condition?.fieldId===f.id?'selected':''}>${f.label}</option>`)
            .join('')}
        </select>
        <input type="text" class="form-control" id="prop-cond-value"
          placeholder="equals this value..."
          value="${field.condition?.value || ''}">
      </div>
      <button class="btn btn-danger w-100" id="delete-field-btn">
        <i class="fas fa-trash"></i> Delete Field
      </button>`;

    propertiesContent.innerHTML = html;

    setTimeout(() => {
      const labelInput       = document.getElementById("prop-label");
      const nameInput        = document.getElementById("prop-name");
      const placeholderInput = document.getElementById("prop-placeholder");
      const requiredInput    = document.getElementById("prop-required");
      const deleteBtn        = document.getElementById("delete-field-btn");
      const stepInput        = document.getElementById("prop-step");
      const condField        = document.getElementById("prop-cond-field");
      const condValue        = document.getElementById("prop-cond-value");

      if (labelInput)       labelInput.addEventListener("input",  () => updateField("label",       labelInput.value));
      if (nameInput)        nameInput.addEventListener("input",   () => updateField("name",        nameInput.value));
      if (placeholderInput) placeholderInput.addEventListener("input", () => updateField("placeholder", placeholderInput.value));
      if (requiredInput)    requiredInput.addEventListener("change", () => updateField("required",  requiredInput.checked));
      if (stepInput)        stepInput.addEventListener("change",  () => updateField("step",        parseInt(stepInput.value)));
      if (deleteBtn)        deleteBtn.addEventListener("click",   () => deleteField(selectedFieldId));

      if (condField) condField.addEventListener('change', () => {
        updateField('condition', condField.value
          ? { fieldId: condField.value, value: condValue?.value || '' }
          : null);
      });
      if (condValue) condValue.addEventListener('input', () => {
        const f = fields.find(f => f.id === selectedFieldId);
        if (f?.condition) updateField('condition', { ...f.condition, value: condValue.value });
      });
    }, 10);
  }

  function updateField(key, value) {
    const field = fields.find(f => f.id === selectedFieldId);
    if (field) { field[key] = value; renderCanvas(); }
  }

  function deleteField(id) {
    fields = fields.filter(f => f.id !== id);
    if (selectedFieldId === id) {
      selectedFieldId = fields.length > 0 ? fields[fields.length - 1].id : null;
    }
    renderCanvas();
    if (selectedFieldId) showProperties();
    else propertiesContent.innerHTML = `<p class="text-muted">Select a field to edit its properties</p>`;
  }

  // ── Templates ───────────────────────────────────────────────────────────────
  window.loadTemplate = function(name) {
    if (!TEMPLATES[name]) return;
    if (fields.length && !confirm('Replace current form with template?')) return;
    fields = TEMPLATES[name].map((t, i) => ({
      ...t,
      id: 'field_' + (Date.now() + i),
      name: t.type + '_' + (Date.now() + i).toString().slice(-6),
      placeholder: t.placeholder || 'Enter value',
      step: 1,
      condition: null,
    }));
    selectedFieldId = null;
    renderCanvas();
    propertiesContent.innerHTML = '<p class="text-muted">Select a field to edit its properties</p>';
  };

  // ── Version history ─────────────────────────────────────────────────────────
  window.restoreVersion = function(idx) {
    if (!confirm('Restore this version? Current changes will be lost.')) return;
    fields = JSON.parse(JSON.stringify(versions[idx].fields));
    selectedFieldId = null;
    bootstrap.Modal.getInstance(document.getElementById('historyModal')).hide();
    renderCanvas();
  };

  // ── Sidebar click handlers ──────────────────────────────────────────────────
  document.querySelectorAll(".field-item").forEach(item => {
    item.addEventListener("click", () => addField(item.dataset.type));
  });

  // ── Preview ─────────────────────────────────────────────────────────────────
  document.getElementById("btn-preview").addEventListener("click", () => {
    if (fields.length === 0) { alert("Add some fields first!"); return; }

    let formHTML = `<form class="p-4">`;
    fields.forEach(field => {
      let inputHTML = "";
      switch (field.type) {
        case "text": case "email": case "password": case "number": case "date":
          inputHTML = `<input type="${field.type}" class="form-control mb-3" placeholder="${field.placeholder || ""}" ${field.required ? "required" : ""} name="${field.name}">`;
          break;
        case "textarea":
          inputHTML = `<textarea class="form-control mb-3" rows="4" placeholder="${field.placeholder || ""}" ${field.required ? "required" : ""} name="${field.name}"></textarea>`;
          break;
        case "select":
          inputHTML = `<select class="form-select mb-3" name="${field.name}"><option value="">Choose an option...</option><option value="opt1">Option 1</option><option value="opt2">Option 2</option></select>`;
          break;
        case "checkbox":
          inputHTML = `<div class="form-check mb-3"><input type="checkbox" class="form-check-input" name="${field.name}"> <label class="form-check-label">${field.label}</label></div>`;
          break;
        case "radio":
          inputHTML = `<div class="form-check mb-3"><input type="radio" name="${field.name}" class="form-check-input"> <label class="form-check-label">${field.label}</label></div>`;
          break;
      }
      formHTML += `<div class="mb-3"><label class="form-label">${field.label}</label>${inputHTML}</div>`;
    });
    formHTML += `<button type="submit" class="btn btn-primary w-100 mt-4">Submit Form</button></form>`;
    previewBody.innerHTML = formHTML;
    new bootstrap.Modal(document.getElementById("previewModal")).show();
  });

  // ── Export ──────────────────────────────────────────────────────────────────
  document.getElementById("btn-export").addEventListener("click", () => {
    if (fields.length === 0) { alert("Nothing to export! Add some fields first."); return; }

    let exportedHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Form</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    body { background: #0f172a; color: #e2e8f0; padding: 40px; }
    .form-container { max-width: 700px; margin: 0 auto; background: #1e2937; padding: 40px; border-radius: 12px; }
  </style>
</head>
<body>
  <div class="form-container">
    <h2 class="text-center mb-5">My Custom Form</h2>
    <form>`;

    fields.forEach(field => {
      let inputHTML = "";
      switch (field.type) {
        case "text": case "email": case "password": case "number": case "date":
          inputHTML = `<input type="${field.type}" class="form-control" placeholder="${field.placeholder || ""}" ${field.required ? "required" : ""} name="${field.name}">`;
          break;
        case "textarea":
          inputHTML = `<textarea class="form-control" rows="4" placeholder="${field.placeholder || ""}" ${field.required ? "required" : ""} name="${field.name}"></textarea>`;
          break;
        case "select":
          inputHTML = `<select class="form-select" name="${field.name}"><option>Choose...</option><option>Option 1</option><option>Option 2</option></select>`;
          break;
        case "checkbox":
          inputHTML = `<div class="form-check"><input type="checkbox" class="form-check-input" name="${field.name}"><label class="form-check-label">${field.label}</label></div>`;
          break;
        case "radio":
          inputHTML = `<div class="form-check"><input type="radio" name="${field.name}" class="form-check-input"><label class="form-check-label">${field.label}</label></div>`;
          break;
      }
      exportedHTML += `\n      <div class="mb-4"><label class="form-label">${field.label}</label>${inputHTML}</div>`;
    });

    exportedHTML += `\n      <button type="submit" class="btn btn-primary w-100">Submit</button>\n    </form>\n  </div>\n</body>\n</html>`;

    const blob = new Blob([exportedHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-form.html";
    a.click();
    URL.revokeObjectURL(url);
  });

  // ── Analytics ───────────────────────────────────────────────────────────────
  document.getElementById('btn-analytics').addEventListener('click', () => {
    const rows = fields.map(f => `
      <tr>
        <td>${f.label}</td>
        <td>${analytics.interactions[f.id] || 0}</td>
        <td class="text-danger">${analytics.errors[f.id] || 0}</td>
      </tr>`).join('');
    document.getElementById('analytics-body').innerHTML = `
      <div class="row mb-3">
        <div class="col"><div class="bg-secondary rounded p-3 text-center">
          <div class="h3">${analytics.starts}</div><small>Form starts</small>
        </div></div>
        <div class="col"><div class="bg-secondary rounded p-3 text-center">
          <div class="h3">${analytics.submissions}</div><small>Submissions</small>
        </div></div>
      </div>
      <table class="table table-dark table-striped">
        <thead><tr><th>Field</th><th>Interactions</th><th>Errors</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>`;
    new bootstrap.Modal(document.getElementById('analyticsModal')).show();
  });

  // ── History ─────────────────────────────────────────────────────────────────
  document.getElementById('btn-history').addEventListener('click', () => {
    const body = document.getElementById('history-body');
    if (!versions.length) {
      body.innerHTML = '<p class="text-muted">No versions saved yet.</p>';
    } else {
      body.innerHTML = [...versions].reverse().map((v, i) => `
        <div class="d-flex justify-content-between align-items-center border-bottom border-secondary py-2">
          <span>${new Date(v.ts).toLocaleTimeString()} — ${v.fields.length} field(s)</span>
          <button class="btn btn-sm btn-outline-warning"
            onclick="restoreVersion(${versions.length - 1 - i})">Restore</button>
        </div>`).join('');
    }
    new bootstrap.Modal(document.getElementById('historyModal')).show();
  });

  // ── Init ────────────────────────────────────────────────────────────────────
  renderCanvas();
});