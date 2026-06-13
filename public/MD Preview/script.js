const STORAGE_KEY = "markdown-previewer-content";
const THEME_KEY = "markdown-previewer-theme";

const starterMarkdown = `# Markdown Previewer

Type Markdown on the left and watch the HTML preview update live.

## Try the toolbar

- **Bold text**
- *Italic text*
- [Open Marked](https://marked.js.org/)
- \`inline code\`

> Your work is saved locally in this browser.

\`\`\`js
const message = "Clean Markdown, instant preview.";
console.log(message);
\`\`\`

![Markdown sample image](https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80)
`;

const markdownInput = document.querySelector("#markdownInput");
const previewOutput = document.querySelector("#previewOutput");
const highlightedMarkdown = document.querySelector("#highlightedMarkdown");
const toolbar = document.querySelector(".toolbar");
const workspace = document.querySelector("#workspace");
const togglePreview = document.querySelector("#togglePreview");
const themeToggle = document.querySelector("#themeToggle");
const themeIcon = document.querySelector("#themeIcon");
const downloadHtml = document.querySelector("#downloadHtml");
const clearMarkdown = document.querySelector("#clearMarkdown");
const saveStatus = document.querySelector("#saveStatus");
const wordCount = document.querySelector("#wordCount");
let clearConfirmTimer;

marked.setOptions({
  breaks: true,
  gfm: true
});

markdownInput.value = localStorage.getItem(STORAGE_KEY) || starterMarkdown;

function applyTheme(theme) {
  const isDark = theme === "dark";

  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  themeIcon.textContent = isDark ? "\u2600" : "\u263e";
  localStorage.setItem(THEME_KEY, theme);
}

function getInitialTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);

  if (savedTheme) {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function highlightMarkdown(markdown) {
  const escaped = escapeHtml(markdown);

  return escaped
    .replace(/^(&gt;.*)$/gm, '<span class="md-quote">$1</span>')
    .replace(/^(#{1,6}\s.*)$/gm, '<span class="md-heading">$1</span>')
    .replace(/(```[\s\S]*?```)/g, '<span class="md-code">$1</span>')
    .replace(/(`[^`\n]+`)/g, '<span class="md-code">$1</span>')
    .replace(/(\*\*[^*\n]+\*\*)/g, '<span class="md-strong">$1</span>')
    .replace(/(\*[^*\n]+\*)/g, '<span class="md-em">$1</span>')
    .replace(/(\[[^\]\n]+\]\([^)]+\))/g, '<span class="md-link">$1</span>');
}

function updatePreview() {
  const markdown = markdownInput.value;
  previewOutput.innerHTML = marked.parse(markdown);
  highlightedMarkdown.innerHTML = `${highlightMarkdown(markdown)}\n`;
  localStorage.setItem(STORAGE_KEY, markdown);

  const words = markdown.trim().match(/\b[\w'-]+\b/g)?.length || 0;
  wordCount.textContent = `${words} ${words === 1 ? "word" : "words"}`;
  saveStatus.textContent = "Saved locally";
}

function syncScroll() {
  highlightedMarkdown.parentElement.scrollTop = markdownInput.scrollTop;
  highlightedMarkdown.parentElement.scrollLeft = markdownInput.scrollLeft;
}

function wrapSelection(before, after = before, placeholder = "text") {
  const start = markdownInput.selectionStart;
  const end = markdownInput.selectionEnd;
  const current = markdownInput.value;
  const selected = current.slice(start, end) || placeholder;
  const replacement = `${before}${selected}${after}`;

  markdownInput.value = current.slice(0, start) + replacement + current.slice(end);
  markdownInput.focus();
  markdownInput.setSelectionRange(start + before.length, start + before.length + selected.length);
  updatePreview();
}

function prefixLines(prefix, placeholder = "text") {
  const start = markdownInput.selectionStart;
  const end = markdownInput.selectionEnd;
  const current = markdownInput.value;
  const selected = current.slice(start, end) || placeholder;
  const replacement = selected
    .split("\n")
    .map((line) => `${prefix}${line}`)
    .join("\n");

  markdownInput.value = current.slice(0, start) + replacement + current.slice(end);
  markdownInput.focus();
  markdownInput.setSelectionRange(start, start + replacement.length);
  updatePreview();
}

function insertLink() {
  const start = markdownInput.selectionStart;
  const end = markdownInput.selectionEnd;
  const current = markdownInput.value;
  const selected = current.slice(start, end) || "link text";
  const replacement = `[${selected}](https://example.com)`;

  markdownInput.value = current.slice(0, start) + replacement + current.slice(end);
  markdownInput.focus();
  markdownInput.setSelectionRange(start + 1, start + 1 + selected.length);
  updatePreview();
}

function handleFormat(format) {
  const actions = {
    heading: () => prefixLines("# ", "Heading"),
    bold: () => wrapSelection("**", "**", "bold text"),
    italic: () => wrapSelection("*", "*", "italic text"),
    link: insertLink,
    code: () => wrapSelection("`", "`", "code"),
    quote: () => prefixLines("> ", "Quote"),
    list: () => prefixLines("- ", "List item")
  };

  actions[format]?.();
}

function downloadRenderedHtml() {
  const rendered = marked.parse(markdownInput.value);
  const isDark = document.documentElement.dataset.theme === "dark";
  const exportTheme = {
    bodyBg: isDark ? "#101418" : "#ffffff",
    codeBg: isDark ? "#080c12" : "#eef3f8",
    codeText: isDark ? "#dbeafe" : "#172033",
    text: isDark ? "#edf2f7" : "#172033",
    quote: isDark ? "#a6b0bf" : "#475467",
    tableBorder: isDark ? "#334155" : "#d8dee9"
  };
  const documentHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rendered Markdown</title>
  <style>
    body { background: ${exportTheme.bodyBg}; color: ${exportTheme.text}; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; line-height: 1.7; margin: 0 auto; max-width: 820px; padding: 2rem; }
    img { display: block; max-width: 100%; }
    blockquote { border-left: 4px solid #0f766e; color: ${exportTheme.quote}; margin-left: 0; padding-left: 1rem; }
    code { background: ${exportTheme.codeBg}; border-radius: 5px; color: ${exportTheme.codeText}; padding: 0.12rem 0.35rem; }
    pre { background: ${exportTheme.codeBg}; border-radius: 8px; color: ${exportTheme.codeText}; overflow: auto; padding: 1rem; }
    pre code { background: transparent; color: inherit; padding: 0; }
    table { border-collapse: collapse; display: block; max-width: 100%; overflow-x: auto; width: max-content; }
    th, td { border: 1px solid ${exportTheme.tableBorder}; padding: 0.7rem 0.85rem; text-align: left; vertical-align: top; }
    th { background: ${isDark ? "#202832" : "#edf1f7"}; font-weight: 800; }
    tr:nth-child(even) td { background: ${isDark ? "#1c2430" : "#f8fafc"}; }
  </style>
</head>
<body>
${rendered}
</body>
</html>`;
  const blob = new Blob([documentHtml], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "markdown-preview.html";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

markdownInput.addEventListener("input", () => {
  saveStatus.textContent = "Saving...";
  updatePreview();
});

markdownInput.addEventListener("scroll", syncScroll);

markdownInput.addEventListener("keydown", (event) => {
  if (event.key !== "Tab") {
    return;
  }

  event.preventDefault();
  wrapSelection("  ", "", "");
});

toolbar.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-format]");

  if (button) {
    handleFormat(button.dataset.format);
  }
});

togglePreview.addEventListener("click", () => {
  const isPreviewOnly = workspace.classList.toggle("preview-only");
  togglePreview.setAttribute("aria-pressed", String(isPreviewOnly));
  togglePreview.textContent = isPreviewOnly ? "Split View" : "Preview";
});

themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.dataset.theme || "light";
  applyTheme(currentTheme === "dark" ? "light" : "dark");
});

downloadHtml.addEventListener("click", downloadRenderedHtml);

function resetClearButton() {
  clearMarkdown.textContent = "Clear";
  clearMarkdown.classList.remove("confirming");
  clearMarkdown.setAttribute("aria-label", "Clear Markdown content");
}

clearMarkdown.addEventListener("click", () => {
  const hasContent = markdownInput.value.trim().length > 0;

  if (!hasContent || clearMarkdown.classList.contains("confirming")) {
    window.clearTimeout(clearConfirmTimer);
    markdownInput.value = "";
    markdownInput.focus();
    updatePreview();
    resetClearButton();
    return;
  }

  clearMarkdown.textContent = "Confirm";
  clearMarkdown.classList.add("confirming");
  clearMarkdown.setAttribute("aria-label", "Confirm clearing Markdown content");
  clearConfirmTimer = window.setTimeout(resetClearButton, 2500);
});

applyTheme(getInitialTheme());
resetClearButton();
updatePreview();
