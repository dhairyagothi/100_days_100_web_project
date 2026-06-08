(function () {
  "use strict";

  const STORAGE_KEY = "resume-previewer-markdown";
  const SAVE_DEBOUNCE_MS = 400;

  const TEMPLATES = {
    "software-engineer": `# Alex Rivera
**Senior Software Engineer** | alex.rivera@email.com | (555) 234-5678 | [linkedin.com/in/arivera](https://linkedin.com/in/arivera)

## Summary
Full-stack engineer with 8+ years building scalable web applications. Passionate about clean architecture, developer experience, and shipping reliable products.

## Experience
- **TechCorp Inc.** — Senior Software Engineer (2021 – Present)
  - Led migration of monolith to microservices, reducing deploy time by 60%
  - Mentored team of 5 engineers; established code review and CI standards
- **Startup Labs** — Software Engineer (2017 – 2021)
  - Built React/Node.js platform serving 50K+ monthly active users
  - Implemented real-time features with WebSockets and Redis

## Skills
- **Languages:** JavaScript, TypeScript, Python, Go
- **Frontend:** React, HTML/CSS, Webpack, accessibility (WCAG)
- **Backend:** Node.js, PostgreSQL, REST, GraphQL, Docker, AWS

## Education
- **B.S. Computer Science** — State University (2017)
`,

    "data-analyst": `# Jordan Kim
**Data Analyst** | jordan.kim@email.com | (555) 876-5432 | [github.com/jkim](https://github.com/jkim)

## Summary
Analytical professional translating complex datasets into actionable business insights. Strong in SQL, visualization, and statistical modeling with a focus on stakeholder communication.

## Experience
- **Retail Analytics Co.** — Data Analyst (2020 – Present)
  - Built Tableau dashboards tracking KPIs for 12 regional markets
  - Automated weekly reporting pipeline in Python, saving 15 hours/week
- **Consulting Group** — Junior Analyst (2018 – 2020)
  - Conducted A/B test analysis for e-commerce clients
  - Delivered executive summaries and recommendations to C-suite audiences

## Skills
- **Tools:** SQL, Python (pandas, scikit-learn), Tableau, Power BI, Excel
- **Methods:** Regression, hypothesis testing, cohort analysis, ETL
- **Soft skills:** Data storytelling, cross-functional collaboration

## Education
- **M.S. Data Science** — Metro University (2018)
- **B.A. Economics** — Metro University (2016)
`,
  };

  const editor = document.getElementById("editor");
  const resumeEl = document.getElementById("resume");
  const saveStatus = document.getElementById("save-status");
  const btnPrint = document.getElementById("btn-print");
  const btnClear = document.getElementById("btn-clear");

  let saveTimer = null;

  /**
   * Escape HTML entities in plain text.
   */
  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /**
   * Apply inline markdown: bold and links.
   */
  function parseInline(line) {
    let html = escapeHtml(line);

    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    return html;
  }

  /**
   * Lightweight regex-based Markdown → HTML for resume content.
   * Supports: # h1, ## h2, ### h3, **bold**, - lists, [text](url)
   */
  function parseMarkdown(markdown) {
    const trimmed = markdown.trim();
    if (!trimmed) return "";

    const lines = markdown.split(/\r?\n/);
    const blocks = [];
    let listItems = [];

    function flushList() {
      if (listItems.length === 0) return;
      blocks.push("<ul>" + listItems.map((li) => "<li>" + li + "</li>").join("") + "</ul>");
      listItems = [];
    }

    for (let i = 0; i < lines.length; i++) {
      const raw = lines[i];
      const line = raw.trimEnd();

      if (line.trim() === "") {
        flushList();
        continue;
      }

      const h1 = line.match(/^#\s+(.+)$/);
      if (h1) {
        flushList();
        blocks.push("<h1>" + parseInline(h1[1]) + "</h1>");
        continue;
      }

      const h2 = line.match(/^##\s+(.+)$/);
      if (h2) {
        flushList();
        blocks.push("<h2>" + parseInline(h2[1]) + "</h2>");
        continue;
      }

      const h3 = line.match(/^###\s+(.+)$/);
      if (h3) {
        flushList();
        blocks.push("<h3>" + parseInline(h3[1]) + "</h3>");
        continue;
      }

      const bullet = line.match(/^-\s+(.+)$/);
      if (bullet) {
        listItems.push(parseInline(bullet[1]));
        continue;
      }

      flushList();

      const isContactLine =
        i > 0 &&
        blocks.length === 1 &&
        blocks[0].startsWith("<h1>") &&
        (line.includes("**") || line.includes("@") || line.includes("|"));

      const tag = isContactLine ? "p class=\"contact-line\"" : "p";
      blocks.push("<" + tag + ">" + parseInline(line) + "</" + tag.split(" ")[0] + ">");
    }

    flushList();
    return blocks.join("\n");
  }

  function renderPreview() {
    const markdown = editor.value;
    const html = parseMarkdown(markdown);

    if (!html) {
      resumeEl.innerHTML =
        '<p class="resume-placeholder">Start typing markdown to build your resume…</p>';
      return;
    }

    resumeEl.innerHTML = html;
  }

  function setSaveStatus(state) {
    saveStatus.className = "save-status";
    if (state === "saving") {
      saveStatus.textContent = "Saving…";
      saveStatus.classList.add("is-saving");
    } else if (state === "saved") {
      saveStatus.textContent = "Saved";
      saveStatus.classList.add("is-saved");
    } else {
      saveStatus.textContent = "Ready";
    }
  }

  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, editor.value);
      setSaveStatus("saved");
    } catch (err) {
      setSaveStatus("ready");
      console.warn("Could not save to localStorage:", err);
    }
  }

  function scheduleSave() {
    setSaveStatus("saving");
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(saveToStorage, SAVE_DEBOUNCE_MS);
  }

  function loadFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        editor.value = saved;
        setSaveStatus("saved");
        return true;
      }
    } catch (err) {
      console.warn("Could not load from localStorage:", err);
    }
    return false;
  }

  function loadTemplate(name) {
    const template = TEMPLATES[name];
    if (!template) return;
    editor.value = template;
    renderPreview();
    scheduleSave();
    editor.focus();
  }

  function clearEditor() {
    if (editor.value && !window.confirm("Clear the editor? Unsaved work will be removed from the pane (localStorage updates on next save).")) {
      return;
    }
    editor.value = "";
    renderPreview();
    scheduleSave();
  }

  function exportPdf() {
    window.print();
  }

  editor.addEventListener("input", function () {
    renderPreview();
    scheduleSave();
  });

  btnPrint.addEventListener("click", exportPdf);
  btnClear.addEventListener("click", clearEditor);

  document.querySelectorAll("[data-template]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const name = btn.getAttribute("data-template");
      if (editor.value.trim() && !window.confirm("Replace current content with this template?")) {
        return;
      }
      loadTemplate(name);
    });
  });

  loadFromStorage();
  renderPreview();
})();
