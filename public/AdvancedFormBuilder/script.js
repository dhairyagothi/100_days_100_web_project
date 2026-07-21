const labelInput = document.getElementById("labelInput");
const typeInput = document.getElementById("typeInput");
const optionsInput = document.getElementById("optionsInput");
const optionsGroup = document.getElementById("optionsGroup");
const requiredInput = document.getElementById("requiredInput");
const addFieldBtn = document.getElementById("addField");

const fieldList = document.getElementById("fieldList");
const fieldCount = document.getElementById("fieldCount");
const emptyState = document.getElementById("emptyState");

const formPreview = document.getElementById("formPreview");
const previewEmpty = document.getElementById("previewEmpty");
const generateBtn = document.getElementById("generateCode");

const codeOutput = document.getElementById("codeOutput");
const copyBtn = document.getElementById("copyCode");
const copyStatus = document.getElementById("copyStatus");

const TYPE_TAGS = {
  text: "TXT",
  email: "EML",
  number: "NUM",
  select: "SEL",
  checkbox: "CHK"
};

let fields = [];

// Escape user input before it ever touches innerHTML, so labels/options
// can't inject markup or break the layout.
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// Only show the "Options" input for field types that actually use it.
function syncOptionsVisibility() {
  const needsOptions = typeInput.value === "select";
  optionsGroup.classList.toggle("is-visible", needsOptions);
  if (!needsOptions) optionsInput.value = "";
}
typeInput.addEventListener("change", syncOptionsVisibility);
syncOptionsVisibility();

// Add field
addFieldBtn.addEventListener("click", () => {
  const label = labelInput.value.trim();
  const type = typeInput.value;
  const optionsRaw = optionsInput.value;
  const required = requiredInput.checked;

  if (!label) {
    labelInput.focus();
    labelInput.classList.add("input-error");
    setTimeout(() => labelInput.classList.remove("input-error"), 900);
    return;
  }

  const options = optionsRaw.split(",").map(o => o.trim()).filter(Boolean);

  if (type === "select" && options.length === 0) {
    optionsInput.focus();
    optionsInput.classList.add("input-error");
    setTimeout(() => optionsInput.classList.remove("input-error"), 900);
    return;
  }

  fields.push({
    id: Date.now() + Math.random(),
    label,
    type,
    options,
    required
  });

  renderAll();

  labelInput.value = "";
  optionsInput.value = "";
  requiredInput.checked = false;
  labelInput.focus();
});

function moveField(id, direction) {
  const index = fields.findIndex(f => f.id === id);
  const target = index + direction;
  if (target < 0 || target >= fields.length) return;
  [fields[index], fields[target]] = [fields[target], fields[index]];
  renderAll();
}

function deleteField(id) {
  fields = fields.filter(f => f.id !== id);
  renderAll();
}

function renderAll() {
  renderBuilderList();
  renderForm();
  // Any structural change invalidates the previously generated code.
  codeOutput.value = "";
}

// List of added fields inside the builder panel, with reorder/delete controls.
function renderBuilderList() {
  fieldList.innerHTML = "";
  fieldCount.textContent = fields.length;
  emptyState.style.display = fields.length ? "none" : "block";

  fields.forEach((field, i) => {
    const li = document.createElement("li");
    li.className = "field-row";

    li.innerHTML = `
      <span class="field-tag">${TYPE_TAGS[field.type]}</span>
      <span class="field-name">F${String(i + 1).padStart(2, "0")} &middot; ${escapeHTML(field.label)}${field.required ? " <span class=\"req-mark\">*</span>" : ""}</span>
      <span class="field-actions">
        <button type="button" data-action="up" title="Move up">&uarr;</button>
        <button type="button" data-action="down" title="Move down">&darr;</button>
        <button type="button" data-action="delete" class="delete-btn" title="Delete">&times;</button>
      </span>
    `;

    li.querySelector('[data-action="up"]').addEventListener("click", () => moveField(field.id, -1));
    li.querySelector('[data-action="down"]').addEventListener("click", () => moveField(field.id, 1));
    li.querySelector('[data-action="delete"]').addEventListener("click", () => deleteField(field.id));

    fieldList.appendChild(li);
  });
}

// Live preview form
function renderForm() {
  formPreview.innerHTML = "";

  if (fields.length === 0) {
    formPreview.appendChild(previewEmpty);
    previewEmpty.style.display = "block";
    return;
  }

  fields.forEach(field => {
    const wrapper = document.createElement("div");
    wrapper.className = "form-field";

    const label = document.createElement("label");
    label.textContent = field.label + (field.required ? " *" : "");
    wrapper.appendChild(label);

    let input;

    if (field.type === "select") {
      input = document.createElement("select");
      field.options.forEach(opt => {
        const option = document.createElement("option");
        option.textContent = opt;
        input.appendChild(option);
      });
    } else if (field.type === "checkbox") {
      input = document.createElement("input");
      input.type = "checkbox";
    } else {
      input = document.createElement("input");
      input.type = field.type;
      input.placeholder = field.label;
    }

    if (field.required) input.required = true;

    wrapper.appendChild(input);
    formPreview.appendChild(wrapper);
  });
}

// Generate HTML code
generateBtn.addEventListener("click", () => {
  if (fields.length === 0) {
    codeOutput.value = "<!-- Add at least one field to generate markup -->";
    return;
  }

  let html = "<form>\n";

  fields.forEach(field => {
    const requiredAttr = field.required ? " required" : "";
    html += `  <label>${escapeHTML(field.label)}${field.required ? " *" : ""}</label>\n`;

    if (field.type === "select") {
      html += `  <select${requiredAttr}>\n`;
      field.options.forEach(opt => {
        html += `    <option>${escapeHTML(opt)}</option>\n`;
      });
      html += "  </select>\n";
    } else if (field.type === "checkbox") {
      html += `  <input type="checkbox"${requiredAttr} />\n`;
    } else {
      html += `  <input type="${field.type}" placeholder="${escapeHTML(field.label)}"${requiredAttr} />\n`;
    }

    html += "\n";
  });

  html += "</form>";
  codeOutput.value = html;
});

// Copy generated HTML to clipboard
copyBtn.addEventListener("click", async () => {
  if (!codeOutput.value.trim()) {
    copyStatus.textContent = "Nothing to copy yet";
    setTimeout(() => (copyStatus.textContent = ""), 1500);
    return;
  }

  try {
    await navigator.clipboard.writeText(codeOutput.value);
    copyStatus.textContent = "Copied!";
  } catch (err) {
    copyStatus.textContent = "Copy failed — select and copy manually";
  }
  setTimeout(() => (copyStatus.textContent = ""), 1500);
});

renderAll();