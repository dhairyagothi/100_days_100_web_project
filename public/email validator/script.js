const submitBtn = document.getElementById("submitBtn");
const resultCont = document.getElementById("resultCont");
const emailInput = document.getElementById("username");
const apiKeyInput = document.getElementById("apiKeyInput");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = String(text);
  return div.innerHTML;
}

function showLoading() {
  resultCont.innerHTML = `
    <div class="loading-container">
      <img width="60" src="loading.svg" alt="" aria-hidden="true">
      <p>Validating email... Please wait</p>
    </div>
  `;
}

function showError(message) {
  resultCont.innerHTML = `
    <div class="error" role="alert">
      <strong>Error</strong>
      <p>${escapeHtml(message)}</p>
    </div>
  `;
}

function showFormatResult(email, isValid) {
  const statusClass = isValid ? "valid" : "invalid";
  const statusText = isValid ? "Valid format" : "Invalid format";

  resultCont.innerHTML = `
    <div class="result-card ${statusClass}">
      <p class="status-badge">${statusText}</p>
      <p class="result-email">${escapeHtml(email)}</p>
      <p class="result-note">Format checked locally. Add an API key above for deliverability details.</p>
    </div>
  `;
}

function showApiResult(data) {
  const isValid =
    data.format_valid === true && data.state === "deliverable";
  const statusClass = isValid ? "valid" : "invalid";
  const statusText = isValid ? "Valid & deliverable" : "Invalid or undeliverable";

  const details = [
    ["Email", data.email],
    ["Domain", data.domain],
    ["State", data.state],
    ["Reason", data.reason],
    ["Score", data.score],
    ["Format valid", data.format_valid],
    ["SMTP check", data.smtp_check],
    ["MX found", data.mx_found],
    ["Disposable", data.disposable],
    ["Free provider", data.free],
  ]
    .filter(([, value]) => value !== "" && value != null)
    .map(
      ([label, value]) => `
        <div class="result-item">
          <strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}
        </div>
      `
    )
    .join("");

  resultCont.innerHTML = `
    <div class="result-card ${statusClass}">
      <p class="status-badge">${statusText}</p>
      ${details || '<p class="result-note">No additional details returned.</p>'}
    </div>
  `;
}

async function validateEmail() {
  if (!submitBtn || !resultCont || !emailInput) {
    console.error("Email Validator: required elements missing");
    return;
  }

  const email = emailInput.value.trim();
  const apiKey = apiKeyInput ? apiKeyInput.value.trim() : "";

  if (!email) {
    showError("Please enter an email address.");
    return;
  }

  if (!EMAIL_REGEX.test(email)) {
    showError("Please enter a valid email format (e.g. name@domain.com).");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Validating...";
  showLoading();

  try {
    if (!apiKey) {
      showFormatResult(email, true);
      return;
    }

    const url =
      "https://api.emailvalidation.io/v1/info?apikey=" +
      encodeURIComponent(apiKey) +
      "&email=" +
      encodeURIComponent(email);

    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      showError(data.message || `API error (${res.status}). Check your API key.`);
      return;
    }

    if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
      showError("No validation details returned. Please try again.");
      return;
    }

    showApiResult(data);
  } catch (error) {
    console.error(error);
    const message =
      error instanceof TypeError
        ? "Network error. Check your connection or try again later."
        : "Something went wrong while validating the email.";
    showError(message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Validate Email";
  }
}

if (submitBtn && resultCont && emailInput) {
  submitBtn.addEventListener("click", validateEmail);
  emailInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") validateEmail();
  });
} else {
  console.error("Email Validator: could not attach event listeners");
}
