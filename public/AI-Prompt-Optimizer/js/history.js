import { escapeHTML, safeParse } from './utils.js';

const historyContainer = document.getElementById("historyContainer");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

export function initHistory() {
  clearHistoryBtn.addEventListener("click", () => {
    const confirmDelete = confirm("Clear all prompt history?");
    if (!confirmDelete) return;

    localStorage.removeItem("promptHistory");
    renderHistory();
  });

  renderHistory();
}

export function saveHistory(prompt, score) {
  let history = safeParse("promptHistory");

  history.unshift({
    prompt,
    score,
    date: new Date().toLocaleString()
  });

  history = history.slice(0, 10);

  localStorage.setItem(
    "promptHistory",
    JSON.stringify(history)
  );

  renderHistory();
}

function renderHistory() {
  let history = safeParse("promptHistory");

  if (!history.length) {
    historyContainer.innerHTML =
      `<div class="history-placeholder">
          No prompts analyzed yet.
       </div>`;
    return;
  }

  historyContainer.innerHTML = "";

  history.forEach(item => {
    const div = document.createElement("div");
    div.className = "history-item";

    div.innerHTML = `
      <h4>Score: ${item.score}/100</h4>
      <p>${escapeHTML(item.prompt)}</p>
      <div class="history-meta">
        ${escapeHTML(item.date)}
      </div>
    `;

    historyContainer.appendChild(div);
  });
}
