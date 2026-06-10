// script.js - FormForge Dark Form Builder

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("form-canvas");
  const emptyState = document.getElementById("empty-state");
  const propertiesContent = document.getElementById("properties-content");
  const previewBody = document.getElementById("preview-body");

  let fields = [];
  let selectedFieldId = null;

  // Field Templates
  function createFieldElement(field) {
    const div = document.createElement("div");
    div.className = `form-field`;
    div.dataset.id = field.id;

    let inputHTML = "";

    switch (field.type) {
      case "text":
      case "email":
      case "password":
      case "number":
      case "date":
        inputHTML = `
                    <input type="${field.type}" class="form-control" 
                           placeholder="${field.placeholder || ""}" 
                           ${field.required ? "required" : ""}>
                `;
        break;
      case "textarea":
        inputHTML = `
                    <textarea class="form-control" rows="3" 
                              placeholder="${field.placeholder || ""}" 
                              ${field.required ? "required" : ""}></textarea>
                `;
        break;
      case "select":
        inputHTML = `
                    <select class="form-select">
                        <option value="">Choose...</option>
                        <option value="1">Option 1</option>
                        <option value="2">Option 2</option>
                        <option value="3">Option 3</option>
                    </select>
                `;
        break;
      case "checkbox":
        inputHTML = `
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input">
                        <label class="form-check-label">${field.label}</label>
                    </div>
                `;
        break;
      case "radio":
        inputHTML = `
                    <div class="form-check">
                        <input type="radio" name="${field.name}" class="form-check-input">
                        <label class="form-check-label">${field.label}</label>
                    </div>
                `;
        break;
    }

    div.innerHTML = `
            <label class="field-label">${field.label}</label>
            ${inputHTML}
            <button class="remove-btn" title="Remove field">
                <i class="fas fa-trash"></i>
            </button>
        `;

    // Click to select
    div.addEventListener("click", (e) => {
      if (!e.target.closest(".remove-btn")) {
        selectField(field.id);
      }
    });

    // Remove button
    div.querySelector(".remove-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      deleteField(field.id);
    });

    return div;
  }

  // Add field to canvas
  function addField(type) {
    const field = {
      id: "field_" + Date.now(),
      type: type,
      label: getDefaultLabel(type),
      placeholder:
        type === "textarea" ? "Enter your message..." : "Enter value",
      required: false,
      name: type + "_" + Date.now().toString().slice(-6),
    };

    fields.push(field);
    renderCanvas();
    selectField(field.id);
    emptyState.style.display = "none";
  }

  function getDefaultLabel(type) {
    const labels = {
      text: "Full Name",
      email: "Email Address",
      password: "Password",
      number: "Number",
      textarea: "Message",
      select: "Choose Option",
      checkbox: "I agree to the terms",
      radio: "Option 1",
      date: "Date",
    };
    return labels[type] || "New Field";
  }

  function renderCanvas() {
    canvas.innerHTML = "";
    if (fields.length === 0) {
      canvas.appendChild(emptyState);
      emptyState.style.display = "block";
      return;
    }

    fields.forEach((field) => {
      const el = createFieldElement(field);
      if (field.id === selectedFieldId) el.classList.add("selected");
      canvas.appendChild(el);
    });
  }

  function selectField(id) {
    selectedFieldId = id;
    renderCanvas();
    showProperties();
  }

  function showProperties() {
    const field = fields.find((f) => f.id === selectedFieldId);
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
        `;

    if (field.type !== "checkbox" && field.type !== "radio") {
      html += `
                <div class="mb-3">
                    <label class="form-label">Placeholder</label>
                    <input type="text" class="form-control" id="prop-placeholder" value="${field.placeholder || ""}">
                </div>
            `;
    }

    html += `
            <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="prop-required" ${field.required ? "checked" : ""}>
                <label class="form-check-label" for="prop-required">Required field</label>
            </div>
            
            <button class="btn btn-danger w-100" id="delete-field-btn">
                <i class="fas fa-trash"></i> Delete Field
            </button>
        `;

    propertiesContent.innerHTML = html;

    // Event listeners for properties
    setTimeout(() => {
      const labelInput = document.getElementById("prop-label");
      const nameInput = document.getElementById("prop-name");
      const placeholderInput = document.getElementById("prop-placeholder");
      const requiredInput = document.getElementById("prop-required");
      const deleteBtn = document.getElementById("delete-field-btn");

      if (labelInput)
        labelInput.addEventListener("input", () =>
          updateField("label", labelInput.value),
        );
      if (nameInput)
        nameInput.addEventListener("input", () =>
          updateField("name", nameInput.value),
        );
      if (placeholderInput)
        placeholderInput.addEventListener("input", () =>
          updateField("placeholder", placeholderInput.value),
        );
      if (requiredInput)
        requiredInput.addEventListener("change", () =>
          updateField("required", requiredInput.checked),
        );
      if (deleteBtn)
        deleteBtn.addEventListener("click", () => deleteField(selectedFieldId));
    }, 10);
  }

  function updateField(key, value) {
    const field = fields.find((f) => f.id === selectedFieldId);
    if (field) {
      field[key] = value;
      renderCanvas();
    }
  }

  function deleteField(id) {
    fields = fields.filter((f) => f.id !== id);
    if (selectedFieldId === id) {
      selectedFieldId = fields.length > 0 ? fields[fields.length - 1].id : null;
    }
    renderCanvas();
    if (selectedFieldId) showProperties();
    else
      propertiesContent.innerHTML = `<p class="text-muted">Select a field to edit its properties</p>`;
  }

  // Sidebar Click Handlers
  document.querySelectorAll(".field-item").forEach((item) => {
    item.addEventListener("click", () => {
      const type = item.dataset.type;
      addField(type);
    });
  });

  // Preview
  document.getElementById("btn-preview").addEventListener("click", () => {
    if (fields.length === 0) {
      alert("Add some fields first!");
      return;
    }

    let formHTML = `<form class="p-4">`;

    fields.forEach((field) => {
      let inputHTML = "";
      // Similar logic as createFieldElement
      switch (field.type) {
        case "text":
        case "email":
        case "password":
        case "number":
        case "date":
          inputHTML = `<input type="${field.type}" class="form-control mb-3" placeholder="${field.placeholder || ""}" ${field.required ? "required" : ""} name="${field.name}">`;
          break;
        case "textarea":
          inputHTML = `<textarea class="form-control mb-3" rows="4" placeholder="${field.placeholder || ""}" ${field.required ? "required" : ""} name="${field.name}"></textarea>`;
          break;
        case "select":
          inputHTML = `
                        <select class="form-select mb-3" name="${field.name}">
                            <option value="">Choose an option...</option>
                            <option value="opt1">Option 1</option>
                            <option value="opt2">Option 2</option>
                        </select>`;
          break;
        case "checkbox":
          inputHTML = `<div class="form-check mb-3"><input type="checkbox" class="form-check-input" name="${field.name}"> <label class="form-check-label">${field.label}</label></div>`;
          break;
        case "radio":
          inputHTML = `<div class="form-check mb-3"><input type="radio" name="${field.name}" class="form-check-input"> <label class="form-check-label">${field.label}</label></div>`;
          break;
      }

      formHTML += `
                <div class="mb-3">
                    <label class="form-label">${field.label}</label>
                    ${inputHTML}
                </div>
            `;
    });

    formHTML += `<button type="submit" class="btn btn-primary w-100 mt-4">Submit Form</button></form>`;

    previewBody.innerHTML = formHTML;
    new bootstrap.Modal(document.getElementById("previewModal")).show();
  });

  // Export Form
  document.getElementById("btn-export").addEventListener("click", () => {
    if (fields.length === 0) {
      alert("Nothing to export! Add some fields first.");
      return;
    }

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

    fields.forEach((field) => {
      // Reuse same rendering logic as preview
      let inputHTML = "";
      // ... (same as preview above)
      switch (field.type) {
        case "text":
        case "email":
        case "password":
        case "number":
        case "date":
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

      exportedHTML += `
                <div class="mb-4">
                    <label class="form-label">${field.label}</label>
                    ${inputHTML}
                </div>`;
    });

    exportedHTML += `
                <button type="submit" class="btn btn-primary w-100">Submit</button>
            </form>
        </div>
    </body>
</html>`;

    const blob = new Blob([exportedHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-form.html";
    a.click();
    URL.revokeObjectURL(url);
  });

  // Initial empty state
  renderCanvas();
});
