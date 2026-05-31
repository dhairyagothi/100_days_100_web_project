let snippets = JSON.parse(localStorage.getItem("markdown_snippets")) || [];
let activeSnippetId = null;

// Select DOM UI Hooks
const snippetList = document.getElementById("snippet-list");
const newSnippetBtn = document.getElementById("new-snippet-btn");
const searchInput = document.getElementById("search-input");
const titleInput = document.getElementById("snippet-title");
const categoryInput = document.getElementById("snippet-category");
const markdownTextarea = document.getElementById("markdown-textarea");
const previewPane = document.getElementById("markdown-preview");
const saveBtn = document.getElementById("save-btn");
const copyBtn = document.getElementById("copy-btn");

// Bootstrap list rendering on page init
renderSidebar();

// Create new sandbox state definition
newSnippetBtn.addEventListener("click", () => {
  activeSnippetId = null;
  titleInput.value = "";
  categoryInput.value = "";
  markdownTextarea.value = "";
  previewPane.innerHTML = "";
  toggleInputs(false);
  titleInput.focus();
});

// Dynamic evaluation input handler loop
markdownTextarea.addEventListener("input", (e) => {
  renderPreview(e.target.value);
});

// Save modifications hook
saveBtn.addEventListener("click", () => {
  const title = titleInput.value.trim() || "Untitled Snippet";
  const category = categoryInput.value.trim() || "General";
  const content = markdownTextarea.value;

  if (!activeSnippetId) {
    const newSnippet = {
      id: Date.now().toString(),
      title,
      category,
      content,
    };
    snippets.push(newSnippet);
    activeSnippetId = newSnippet.id;
  } else {
    const index = snippets.findIndex((s) => s.id === activeSnippetId);
    if (index !== -1) {
      snippets[index].title = title;
      snippets[index].category = category;
      snippets[index].content = content;
    }
  }

  localStorage.setItem("markdown_snippets", JSON.stringify(snippets));
  renderSidebar();
  alert("Snippet saved locally!");
});

// Clipboard evaluation system
copyBtn.addEventListener("click", () => {
  navigator.clipboard
    .writeText(markdownTextarea.value)
    .then(() => {
      const originalText = copyBtn.innerText;
      copyBtn.innerText = "Copied! ✓";
      setTimeout(() => (copyBtn.innerText = originalText), 2000);
    })
    .catch((err) => console.error("Failed to copy text: ", err));
});

// Filter routine matching criteria strings
searchInput.addEventListener("input", (e) => {
  renderSidebar(e.target.value.toLowerCase());
});

// --- HELPER WRAPPERS ---
function renderPreview(markdownText) {
  previewPane.innerHTML = marked.parse(markdownText);
}

function toggleInputs(isDisabled) {
  titleInput.disabled = isDisabled;
  categoryInput.disabled = isDisabled;
  markdownTextarea.disabled = isDisabled;
  saveBtn.disabled = isDisabled;
  copyBtn.disabled = isDisabled;
}

function renderSidebar(filterQuery = "") {
  snippetList.innerHTML = "";

  const filtered = snippets.filter(
    (s) =>
      s.title.toLowerCase().includes(filterQuery) ||
      s.category.toLowerCase().includes(filterQuery),
  );

  filtered.forEach((snippet) => {
    const li = document.createElement("li");
    li.innerHTML = `
            <strong>${snippet.title}</strong>
            <span style="display:block;font-size:0.75rem;color:#94a3b8;margin-top:4px;">
                [${snippet.category}]
            </span>
        `;
    li.addEventListener("click", () => loadSnippet(snippet.id));
    snippetList.appendChild(li);
  });
}

function loadSnippet(id) {
  const snippet = snippets.find((s) => s.id === id);
  if (!snippet) return;

  activeSnippetId = snippet.id;
  titleInput.value = snippet.title;
  categoryInput.value = snippet.category;
  markdownTextarea.value = snippet.content;

  renderPreview(snippet.content);
  toggleInputs(false);
}
