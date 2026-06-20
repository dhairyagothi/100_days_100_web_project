(function () {
  "use strict";

  const STORAGE_KEY = "resume-previewer-markdown";
  const SAVE_DEBOUNCE_MS = 400;

  const TEMPLATES = {
    "se": `# John Doe\n**Senior Software Engineer** | johndoe@example.com | +1 (555) 019-2834 | San Francisco, CA | linkedin.com/in/username | github.com/username | yourportfolio.dev\n\n## Summary\nFull-stack engineer with 8+ years building scalable web applications. Passionate about clean architecture, developer experience, and shipping reliable products.\n\n## Experience\n- **TechCorp Inc.** — Senior Software Engineer (2021 – Present)\n  - Led migration of monolith to microservices, reducing deploy time by 60%\n  - Mentored team of 5 engineers; established code review and CI standards\n- **Startup Labs** — Software Engineer (2017 – 2021)\n  - Built React/Node.js platform serving 50K+ monthly active users\n  - Implemented real-time features with WebSockets and Redis\n\n## Projects\n- **LUMINA 1.0** — AI-Powered SaaS Platform\n  - Engineered an AI-powered SaaS platform integrating multi-modal architectures for automated content generation workflows.\n  - Secured application with JWT/OAuth 2.0, role-based access control, and encrypted session management.\n\n## Certifications\n- **Cloud Authority** — Certified Solutions Architect Expert\n- **Open Source Foundation** — Core Engineering Contributor Distinction\n\n## Education\n- **State University** — B.S. Computer Science (2017)\n\n## Skills\n- **Languages:** JavaScript, TypeScript, Python, Go\n- **Frameworks:** React.js, Next.js, Node.js, Express.js, Tailwind CSS\n- **Databases & Layer Security:** MongoDB, MySQL, JWT, OAuth 2.0\n- **Tools & Operations:** Git, GitHub, Postman, Vercel, Cloud Providers`,

    "da": `# Jordan Kim\n**Data Analyst** | jordan.kim@example.com | (555) 876-5432 | Chicago, IL | github.com/jkim | jkimdata.io\n\n## Summary\nAnalytical professional translating complex datasets into actionable business insights. Strong in SQL, visualization, and statistical modeling with a focus on stakeholder communication.\n\n## Experience\n- **Retail Analytics Co.** — Data Analyst (2020 – Present)\n  - Built Tableau dashboards tracking KPIs for 12 regional markets\n  - Automated weekly reporting pipeline in Python, saving 15 hours/week\n- **Consulting Group** — Junior Analyst (2018 – 2020)\n  - Conducted A/B test analysis for e-commerce clients\n\n## Projects\n- **Metrics Engine 2.0** — Pipeline Infrastructure Optimization\n  - Constructed visual pipeline performance monitors using cloud logging data layers and predictive metrics processing structures.\n\n## Certifications\n- **Data Institute** — Big Data Engineering Specialization Badge\n\n## Education\n- **Metro University** — M.S. Data Science (2018)\n- **Metro University** — B.A. Economics (2016)\n\n## Skills\n- **Languages:** SQL, Python, R, HTML5, CSS3\n- **Frameworks:** Pandas, Scikit-Learn, Tableau Desktop, Power BI, Excel\n- **Databases & Layer Security:** PostgreSQL, MySQL, ETL Pipeline Protocols\n- **Tools & Operations:** Git, GitHub, Postman, Jupyter Notebooks, Airflow`,

    "pm": `# Taylor Vance\n**Product Manager** | taylor.vance@example.com | (555) 345-6789 | Austin, TX | linkedin.com/in/taylorvance\n\n## Summary\nMetrics-driven Product Manager with experience executing cross-functional development cycles. Skilled in competitive market discovery analytics and product roadmap synchronization.\n\n## Experience\n- **SaaS Ventures** — Product Manager (2023 – Present)\n  - Launched a self-service check-out channel, generating a 22% conversion increase over baseline performance.\n  - Structured data validation matrices using telemetry tracking architectures.\n- **Core Systems** — Associate PM (2021 – 2023)\n  - Managed execution schedules across 3 engineering cohorts using agile sprint management arrays.\n\n## Projects\n- **Checkout Workflow Integration** — Global Payments Engine\n  - Superheaded requirements capture procedures to ship integrated transaction validation models across active channels.\n\n## Certifications\n- **Scrum Alliance** — Certified Product Owner (CSPO)\n\n## Education\n- **Metro College** — B.A. Business Administration (2016 – 2020)\n\n## Skills\n- **Languages:** SQL, Markdown, HTML5, CSS3\n- **Frameworks:** Scrum Framework, Agile Matrices, Product Discovery Protocols\n- **Databases & Layer Security:** Data Validation Matrices, Query Basics\n- **Tools & Operations:** JIRA, Confluence, Figma, Miro, Mixpanel Analytics`,

    "mkt": `# Sarah Jenkins\n**Growth Marketing Manager** | sarah.j@email.com | (555) 876-5432 | New York, NY | linkedin.com/in/sjenkins\n\n## Summary\nPerformance marketer specializing in high-velocity acquisition channels. Expert at deploying performance analytics routines to identify pipeline scale anomalies and maximize efficiency.\n\n## Experience\n- **Velocity Scale** — Growth Manager (2024 – Present)\n  - Managed programmatic acquisition deployments, dropping user acquisition cost structures by 18%.\n  - Designed cross-channel tracking scripts to unify attribute tracking metrics structures.\n- **Brand Media** — Marketing Specialist (2021 – 2024)\n  - Ran targeted engagement loops, expanding newsletter subscription rolls by 14k qualified contacts.\n\n## Projects\n- **Velocity Scale Optimization Loop** — Automated Acquisition Pipeline\n  - Deployed dynamic tracking filters to cross-reference traffic quality distributions automatically inside cloud workflows.\n\n## Certifications\n- **Google Analytics** — Advanced Measurement Professional Credential\n\n## Education\n- **Eastern Union University** — B.S. Marketing Communications (2017 – 2021)\n\n## Skills\n- **Languages:** JavaScript, HTML5, CSS3, Google Apps Script\n- **Frameworks:** SEO Optimization Tools, Performance Marketing Dashboards\n- **Databases & Layer Security:** Conversion Attributions Matrices, User Privacy Layers\n- **Tools & Operations:** HubSpot Automation, Google Analytics, A/B Testing Engines, Mailchimp`,

    "cyber": `# Morgan Cole\n**Cybersecurity Analyst** | morgan.cole@email.com | (555) 456-7890 | Washington, D.C. | linkedin.com/in/morgancole\n\n## Summary\nInformation Security professional specializing in threat detection, incident containment routines, and continuous vulnerability assessment operations. Experienced in hardening cloud infrastructure arrays.\n\n## Experience\n- **Sentinel Security Plc** — Incident Responder (2023 – Present)\n  - Decreased security incident dwell detection time frames by 24 minutes through custom SIEM filter configurations.\n  - Triaged over 400 infrastructure anomaly alerts weekly while maintaining operational availability metrics.\n- **Global Bank Corp** — Security Associate (2021 – 2023)\n  - Conducted structural patch remediation schedules across 1,200 production asset deployment vectors.\n\n## Projects\n- **SIEM Anomaly Filter System** — Enterprise Intrusion Defense\n  - Configured high-fidelity processing matrices to cross-examine telemetry streams for credential abuse vectors.\n\n## Certifications\n- **EC-Council** — Certified Ethical Hacker (CEH)\n- **CompTIA** — Security+ Credential\n\n## Education\n- **Tech University** — B.S. Cybersecurity Operations (2021)\n\n## Skills\n- **Languages:** Python, Bash Scripting, Linux Shell, SQL\n- **Frameworks:** NIST Incident Framework, Mitre ATT&CK Engine Matrix\n- **Databases & Layer Security:** Network Hardening, Cloud Access Controls, Encryption Rules\n- **Tools & Operations:** Splunk SIEM, Wireshark, Postman, Nmap Vulnerability Scanning`,

    "devops": `# Casey Sterling\n**DevOps Engineer** | casey.s@email.com | (555) 567-8901 | Seattle, WA | github.com/caseysterling\n\n## Summary\nInfrastructure automation engineer dedicated to reducing deployment cycle friction. Expert at designing bulletproof cloud delivery pipelines, cluster orchestration arrays, and container topologies.\n\n## Experience\n- **CloudScale Systems** — Infrastructure Engineer (2022 – Present)\n  - Architected zero-downtime Kubernetes deployment profiles across multi-region server infrastructure platforms.\n  - Cut monthly AWS hosting line expenditures by 28% through aggressive container provisioning optimizations.\n- **Enterprise Apps** — Systems Administrator (2019 – 2022)\n  - Migrated legacy data pipelines into immutable infrastructure definitions using Terraform orchestration scripts.\n\n## Projects\n- **Immutable Cloud Architecture Blueprint** — Multi-Region Infrastructure Migration\n  - Converted manual platform clusters into state-driven configurations managed wholly through source scripts pipelines.\n\n## Certifications\n- **Amazon Web Services** — AWS Certified DevOps Engineer Professional\n\n## Education\n- **Pacific College** — B.S. Information Systems (2019)\n\n## Skills\n- **Languages:** Go, Python, Bash Scripting, YAML\n- **Frameworks:** Jenkins Declarative Pipelines, GitHub Actions Workflows\n- **Databases & Layer Security:** VPC Ingress Routing, IAM Privilege Roles Hardening\n- **Tools & Operations:** Docker, Kubernetes Orchestration, Terraform IaC, Ansible Playbooks, AWS Services`,

    "ux": `# Jordan Brooks\n**UX/UI Designer** | jordan.b@email.com | (555) 678-9012 | Remote, USA | behance.net/jordanbrooks\n\n## Summary\nUser-centric product designer who bridges complex software utility paradigms with highly accessible interfaces. Expert at rapid interactive prototyping and system guidelines deployment.\n\n## Experience\n- **Design Labs Agency** — Product Designer (2023 – Present)\n  - Conducted target demographic usability surveys that informed structural layout revisions, boosting retention by 16%.\n  - Designed a multi-platform component library that accelerated front-end production velocity layouts.\n- **App Studio** — Junior UX Specialist (2020 – 2023)\n  - Maintained wireframe workflows and workflow blueprints using user interaction journey metrics layouts.\n\n## Projects\n- **Universal UI Matrix Component Library** — Federated Design System\n  - Produced accessible element blueprints containing embedded screen reader definitions to align interfaces universally.\n\n## Certifications\n- **Interaction Design Foundation** — Advanced UX/UI System Design Designation\n\n## Education\n- **Institute of Art** — B.F.A. Interactive Design (2020)\n\n## Skills\n- **Languages:** HTML5, CSS3, SVG Structure, Basic JavaScript\n- **Frameworks:** Figma Component Framework, Design Token Systems\n- **Databases & Layer Security:** Semantic Content Layouts, Core Access Rules\n- **Tools & Operations:** Figma Studio, Adobe Creative Cloud, Miro, Zeplin Prototype Inspectors`,

    "hr": `# Evelyn Bennett\n**HR Generalist** | evelyn.b@email.com | (555) 789-0123 | Atlanta, GA | linkedin.com/in/evelynbennett\n\n## Summary\nHuman Resources specialist focused on structuring compliant talent pipeline strategies, progressive performance evaluation frameworks, and scalable onboarding operations.\n\n## Experience\n- **Apex Group Corp** — HR Generalist (2022 – Present)\n  - Directed regional talent acquisitions, decreasing standard position cycle fill time frames by 11 business days.\n  - Modernized employee retention program playbooks, dropping annualized staff attrition by 14% over baseline.\n- **Retail Solutions** — Human Resources Assistant (2020 – 2022)\n  - Maintained employment verification files while processing payroll transitions across 400 personnel units.\n\n## Projects\n- **Talent Acquisition Workflow Modernization** — Compliance Engine Re-architecture\n  - Rolled out updated candidate tracking profiles to ensure uniform verification across international candidate paths.\n\n## Certifications\n- **SHRM** — Certified Professional Designation (SHRM-CP)\n\n## Education\n- **Southern University** — B.A. Human Resources Management (2020)\n\n## Skills\n- **Languages:** Technical Report Writing, Legal Compliance Verbiage\n- **Frameworks:** Performance Evaluation Frameworks, Onboarding Metrics Arrays\n- **Databases & Layer Security:** Employment Records Auditing, Private Data Compliance\n- **Tools & Operations:** Workday ATS, Applicant Tracking Architectures, Excel Data Pivots`,

    "sdr": `# Cameron Diaz\n**Sales Development Representative** | cameron.d@email.com | (555) 890-1234 | Denver, CO | linkedin.com/in/camerondiaz\n\n## Summary\nHigh-velocity sales development professional adept at penetrating competitive enterprise accounts. Highly skilled in account mapping protocols and multi-channel prospecting loops.\n\n## Experience\n- **Inbound Metrics SaaS** — Lead SDR (2024 – Present)\n  - Generated 145% of annual pipeline qualification quotas via hyper-personalized communication cadences.\n  - Implemented data-driven lead scoring updates that improved sales conversion ratios by 19% dynamically.\n- **Tech Hardware Corp** — Sales Associate (2022 – 2024)\n  - Secured 45 outbound business introductory consultations using targeted discovery outreach sequences.\n\n## Projects\n- **Hyper-Personalized Outreach Campaign** — Account Mapping Loop Tier-1 Accounts\n  - Tailored conversation cadences using data log intelligence signals to identify high-intent accounts.\n\n## Certifications\n- **Sales Elevate** — Enterprise Account Prospecting Master Certificate\n\n## Education\n- **State College** — B.A. Communications (2022)\n\n## Skills\n- **Languages:** Discovery Call Scripts, Enterprise Communications, Business Writing\n- **Frameworks:** Qualification Architectures, Outreach Cadence Frameworks\n- **Databases & Layer Security:** CRM Account Mapping, Lead Scoring Data Tiers\n- **Tools & Operations:** Salesforce CRM, Outreach Automation Platforms, LinkedIn Sales Navigator`
  };

  const editor = document.getElementById("editor");
  const resumeEl = document.getElementById("resume");
  const saveStatus = document.getElementById("save-status");
  const btnPrint = document.getElementById("btn-print");
  const btnClear = document.getElementById("btn-clear");
  const templateModal = document.getElementById("template-modal");
  const btnBrowseTemplates = document.getElementById("btn-browse-templates");
  const atsScoreValue = document.getElementById("ats-score-value");
  const atsChecklist = document.getElementById("ats-checklist");
  const scoreCircle = document.querySelector(".score-circle");

  const tabForm = document.getElementById("tab-form");
  const tabMarkdown = document.getElementById("tab-markdown");
  const formContainer = document.getElementById("form-container");
  const markdownContainer = document.getElementById("markdown-container");

  const btnThemeToggle = document.getElementById("btn-theme-toggle");
  const sunIcon = btnThemeToggle.querySelector(".theme-icon-sun");
  const moonIcon = btnThemeToggle.querySelector(".theme-icon-moon");

  const formFields = {
    name: document.getElementById("f-name"),
    role: document.getElementById("f-role"),
    email: document.getElementById("f-email"),
    phone: document.getElementById("f-phone"),
    location: document.getElementById("f-location"),
    linkedin: document.getElementById("f-linkedin"),
    github: document.getElementById("f-github"),
    portfolio: document.getElementById("f-portfolio"),
    summary: document.getElementById("f-summary"),
    exp1: document.getElementById("f-exp-1"),
    exp2: document.getElementById("f-exp-2"),
    projects: document.getElementById("f-projects"),
    certifications: document.getElementById("f-certifications"),
    edu: document.getElementById("f-edu"),
    skills: document.getElementById("f-skills")
  };

  let saveTimer = null;
  let internalUpdating = false;

  function applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.classList.add("dark-mode");
      sunIcon.style.display = "none";
      moonIcon.style.display = "inline-block";
    } else {
      document.documentElement.classList.remove("dark-mode");
      sunIcon.style.display = "inline-block";
      moonIcon.style.display = "none";
    }
    localStorage.setItem("app-theme", theme);
  }

  btnThemeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.classList.contains("dark-mode");
    applyTheme(isDark ? "light" : "dark");
  });

  const savedTheme = localStorage.getItem("app-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    applyTheme("dark");
  } else {
    applyTheme("light");
  }

  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function parseInline(line) {
    let html = escapeHtml(line);
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    return html;
  }

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

      const bullet = line.match(/^-\s+(.+)$/) || line.match(/^\s*-\s+(.+)$/);
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

      const tag = isContactLine ? 'p class="contact-line"' : "p";
      blocks.push("<" + tag + ">" + parseInline(line) + "</" + tag.split(" ")[0] + ">");
    }

    flushList();
    return blocks.join("\n");
  }

  function runAtsAnalysis(text) {
    if (!atsChecklist || !atsScoreValue) return;

    const checks = [
      { id: "has-name", label: "Full Name Declared (# Name)", test: t => /^#\s+.+/m.test(t) },
      { id: "has-contact", label: "Contact Information Present", test: t => /[\w.-]+@[\w.-]+\.\w+/.test(t) },
      { id: "has-summary", label: "Professional Summary Found", test: t => /##\s+(Summary|Profile|Objective)/i.test(t) },
      { id: "has-experience", label: "Experience Section Listed", test: t => /##\s+(Experience|History|Employment)/i.test(t) },
      { id: "has-projects", label: "Core Projects Section Built", test: t => /##\s+(Projects|Key Projects)/i.test(t) },
      { id: "has-certifications", label: "Certifications Listed", test: t => /##\s+(Certifications|Credentials)/i.test(t) },
      { id: "has-education", label: "Education Criteria Specified", test: t => /##\s+(Education|Academic)/i.test(t) },
      { id: "has-skills", label: "Core Skills Grid Populated", test: t => /##\s+Skills/i.test(t) },
      { id: "no-tables", label: "ATS-Friendly Layout (No Tables)", test: t => !/\|/.test(t) }
    ];

    let passedCount = 0;
    atsChecklist.innerHTML = "";

    checks.forEach(check => {
      const passed = check.test(text);
      if (passed) passedCount++;

      const li = document.createElement("li");
      li.className = passed ? "pass" : "fail";
      li.textContent = check.label;
      atsChecklist.appendChild(li);
    });

    const scorePercentage = Math.round((passedCount / checks.length) * 100);
    atsScoreValue.textContent = `${scorePercentage}%`;

    if (scoreCircle) {
      scoreCircle.className = "score-circle";
      if (scorePercentage === 100) {
        scoreCircle.classList.add("perfect");
      } else if (scorePercentage >= 75) {
        scoreCircle.classList.add("good");
      } else {
        scoreCircle.classList.add("poor");
      }
    }
  }

  function updateMarkdownFromForm() {
    if (internalUpdating) return;
    internalUpdating = true;

    let md = "";
    if (formFields.name.value.trim()) md += `# ${formFields.name.value.trim()}\n`;
    
    let subHeader = "";
    if (formFields.role.value.trim()) subHeader += `**${formFields.role.value.trim()}**`;
    
    const contactPieces = [];
    if (formFields.email.value.trim()) contactPieces.push(formFields.email.value.trim());
    if (formFields.phone.value.trim()) contactPieces.push(formFields.phone.value.trim());
    if (formFields.location.value.trim()) contactPieces.push(formFields.location.value.trim());
    if (formFields.linkedin.value.trim()) contactPieces.push(formFields.linkedin.value.trim());
    if (formFields.github.value.trim()) contactPieces.push(formFields.github.value.trim());
    if (formFields.portfolio.value.trim()) contactPieces.push(formFields.portfolio.value.trim());

    if (contactPieces.length > 0) {
      const jointContact = contactPieces.join(" | ");
      subHeader += subHeader ? ` | ${jointContact}` : jointContact;
    }
    
    if (subHeader) md += `${subHeader}\n\n`;

    if (formFields.summary.value.trim()) {
      md += `## Summary\n${formFields.summary.value.trim()}\n\n`;
    }

    if (formFields.exp1.value.trim() || formFields.exp2.value.trim()) {
      md += `## Experience\n`;
      if (formFields.exp1.value.trim()) md += `${formFields.exp1.value.trim()}\n`;
      if (formFields.exp2.value.trim()) md += `${formFields.exp2.value.trim()}\n`;
      md += `\n`;
    }

    if (formFields.projects.value.trim()) {
      md += `## Projects\n${formFields.projects.value.trim()}\n\n`;
    }

    if (formFields.certifications.value.trim()) {
      md += `## Certifications\n${formFields.certifications.value.trim()}\n\n`;
    }

    if (formFields.edu.value.trim()) {
      md += `## Education\n${formFields.edu.value.trim()}\n\n`;
    }

    if (formFields.skills.value.trim()) {
      md += `## Skills\n${formFields.skills.value.trim()}\n`;
    }

    editor.value = md;
    renderPreview();
    scheduleSave();
    internalUpdating = false;
  }

  function updateFormFromMarkdown() {
    if (internalUpdating) return;
    internalUpdating = true;

    const md = editor.value;
    Object.values(formFields).forEach(field => { if (field) field.value = ""; });

    const sections = md.split(/\n##\s+/);
    const headerLines = sections[0].split("\n");
    
    headerLines.forEach(line => {
      if (line.startsWith("# ")) {
        formFields.name.value = line.substring(2).trim();
      } else if (line.trim() && !line.startsWith("#")) {
        let workingLine = line.trim();
        if (workingLine.startsWith("**")) {
          const roleMatch = workingLine.match(/\*\*(.*?)\*\*/);
          if (roleMatch) {
            formFields.role.value = roleMatch[1].trim();
            workingLine = workingLine.replace(/\*\*(.*?)\*\*\s*\|?\s*/, "");
          }
        }
        
        const pieces = workingLine.split(/\s*\|\s*/);
        pieces.forEach(piece => {
          const cleanPiece = piece.trim();
          if (!cleanPiece) return;

          if (cleanPiece.includes("@")) {
            formFields.email.value = cleanPiece;
          } else if (cleanPiece.includes("linkedin.com")) {
            formFields.linkedin.value = cleanPiece;
          } else if (cleanPiece.includes("github.com")) {
            formFields.github.value = cleanPiece;
          } else if (/(\d{3,}|\+)/.test(cleanPiece) && !cleanPiece.includes(".")) {
            formFields.phone.value = cleanPiece;
          } else if (cleanPiece.includes(".com") || cleanPiece.includes(".dev") || cleanPiece.includes(".io") || cleanPiece.includes(".me") || cleanPiece.includes(".net")) {
            formFields.portfolio.value = cleanPiece;
          } else {
            if (!formFields.role.value && piece === pieces[0] && !line.startsWith("**")) {
              formFields.role.value = cleanPiece;
            } else {
              formFields.location.value = cleanPiece;
            }
          }
        });
      }
    });

    sections.slice(1).forEach(sec => {
      const lines = sec.split("\n");
      const title = lines[0].toLowerCase().trim();
      const content = lines.slice(1).join("\n").trim();

      if (title.includes("summary") || title.includes("profile") || title.includes("objective")) {
        formFields.summary.value = content;
      } else if (title.includes("experience") || title.includes("history")) {
        const expBlocks = content.split(/(?=\n-\s+\*\*)/);
        if (expBlocks.length > 0) formFields.exp1.value = expBlocks[0].trim();
        if (expBlocks.length > 1) formFields.exp2.value = expBlocks.slice(1).join("\n").trim();
      } else if (title.includes("projects")) {
        formFields.projects.value = content;
      } else if (title.includes("certifications") || title.includes("credentials")) {
        formFields.certifications.value = content;
      } else if (title.includes("education") || title.includes("academic")) {
        formFields.edu.value = content;
      } else if (title.includes("skills")) {
        formFields.skills.value = content;
      }
    });

    internalUpdating = false;
  }

  function renderPreview() {
    const markdown = editor.value;
    const html = parseMarkdown(markdown);

    if (!html) {
      resumeEl.innerHTML = '<p class="resume-placeholder">Start typing markdown or complete the guided form fields to build your resume…</p>';
      return;
    }

    resumeEl.innerHTML = html;
    runAtsAnalysis(markdown);
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
      if (saved !== null && saved.trim() !== "") {
        editor.value = saved;
        setSaveStatus("saved");
        return true;
      }
    } catch (err) {
      console.warn("Could not load from localStorage:", err);
    }
    return false;
  }

  function showTemplatesLibrary() {
    if (templateModal) templateModal.classList.add("active");
  }

  function hideTemplatesLibrary() {
    if (templateModal) templateModal.classList.remove("active");
  }

  function loadTemplate(name) {
    const template = TEMPLATES[name];
    if (!template) return;
    editor.value = template;
    updateFormFromMarkdown();
    renderPreview();
    scheduleSave();
    editor.focus();
  }

  function clearEditor() {
    if (editor.value && !window.confirm("Clear the current draft workspace?")) return;
    editor.value = "";
    Object.values(formFields).forEach(field => { if (field) field.value = ""; });
    renderPreview();
    scheduleSave();
  }

  function exportPdf() {
    window.print();
  }

  editor.addEventListener("input", function () {
    renderPreview();
    updateFormFromMarkdown();
    scheduleSave();
  });

  Object.values(formFields).forEach(field => {
    if (field) {
      field.addEventListener("input", updateMarkdownFromForm);
    }
  });

  tabForm.addEventListener("click", () => {
    tabMarkdown.classList.remove("active");
    tabMarkdown.setAttribute("aria-selected", "false");
    tabForm.classList.add("active");
    tabForm.setAttribute("aria-selected", "true");
    markdownContainer.classList.remove("active");
    formContainer.classList.add("active");
    updateFormFromMarkdown();
  });

  tabMarkdown.addEventListener("click", () => {
    tabForm.classList.remove("active");
    tabForm.setAttribute("aria-selected", "false");
    tabMarkdown.classList.add("active");
    tabMarkdown.setAttribute("aria-selected", "true");
    formContainer.classList.remove("active");
    markdownContainer.classList.add("active");
  });

  btnPrint.addEventListener("click", exportPdf);
  btnClear.addEventListener("click", clearEditor);

  if (btnBrowseTemplates) {
    btnBrowseTemplates.addEventListener("click", showTemplatesLibrary);
  }

  document.querySelectorAll(".card-template").forEach(function (card) {
    card.addEventListener("click", function () {
      const name = card.getAttribute("data-preset");
      if (editor.value.trim() && !window.confirm("Replace your active workspace draft with this framework?")) {
        return;
      }
      loadTemplate(name);
      hideTemplatesLibrary();
    });
  });

  const hasData = loadFromStorage();
  if (hasData) {
    updateFormFromMarkdown();
    renderPreview();
  } else {
    showTemplatesLibrary();
  }
})();