const addFieldBtn = document.getElementById("addField");
const formPreview = document.getElementById("formPreview");
const generateBtn = document.getElementById("generateCode");
const codeOutput = document.getElementById("codeOutput");

let fields = [];

// Add field
addFieldBtn.addEventListener("click", () => {
  const label = document.getElementById("labelInput").value.trim();
  const type = document.getElementById("typeInput").value;
  const options = document.getElementById("optionsInput").value;

  if (!label) return alert("Enter field label");

  const field = {
    id: Date.now(),
    label,
    type,
    options: options.split(",").map(o => o.trim()).filter(Boolean)
  };

  fields.push(field);
  renderForm();

  document.getElementById("labelInput").value = "";
  document.getElementById("optionsInput").value = "";
});

// Render form preview
function renderForm() {
  formPreview.innerHTML = "";

  fields.forEach(field => {
    const wrapper = document.createElement("div");
    wrapper.className = "form-field";

    const label = document.createElement("label");
    label.textContent = field.label;
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
    }

    wrapper.appendChild(input);

    const del = document.createElement("button");
    del.textContent = "Delete";
    del.className = "delete-btn";
    del.onclick = () => {
      fields = fields.filter(f => f.id !== field.id);
      renderForm();
    };

    wrapper.appendChild(del);
    formPreview.appendChild(wrapper);
  });
}

// Generate HTML code
generateBtn.addEventListener("click", () => {
  let html = "<form>\\n";

  fields.forEach(field => {
    html += `  <label>${field.label}</label>\\n`;

    if (field.type === "select") {
      html += "  <select>\\n";
      field.options.forEach(opt => {
        html += `    <option>${opt}</option>\\n`;
      });
      html += "  </select>\\n";
    } else if (field.type === "checkbox") {
      html += '  <input type="checkbox" />\\n';
    } else {
      html += `  <input type="${field.type}" />\\n`;
    }

    html += "\\n";
  });

  html += "</form>";
  codeOutput.value = html;
});