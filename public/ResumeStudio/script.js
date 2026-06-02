/**
 * Resume Studio — ATS Resume Builder
 * Complete, working implementation
 */

function initResumeStudio() {
    // =========================
    // ELEMENTS
    // =========================
    const resumePreview = document.getElementById("resumePreview");
    const themeSwitcher = document.getElementById("themeSwitcher");
    const downloadBtn = document.getElementById("downloadBtn");
    const printBtn = document.getElementById("printBtn");
    const fillDemoBtn = document.getElementById("fillDemoBtn");
    const clearFormBtn = document.getElementById("clearFormBtn");
    const targetRole = document.getElementById("targetRole");
    const customKeywords = document.getElementById("customKeywords");
    const customKeywordsGroup = document.getElementById("customKeywordsGroup");
    const recommendedKeywordsList = document.getElementById("recommendedKeywordsList");
    const atsScoreValue = document.getElementById("atsScoreValue");
    const atsSuggestionsList = document.getElementById("atsSuggestionsList");
    const previewToggleBtn = document.getElementById("previewToggleBtn");

    const inputs = [
        "name", "title", "email", "phone",
        "location", "website", "linkedin", "github",
        "summary", "experience", "projects", "education", "skills"
    ];

    let currentTemplate = "modern";

    // =========================
    // ROLE KEYWORDS MAP
    // =========================
    const roleKeywordsMap = {
        frontend: ["react", "javascript", "css", "html", "typescript", "responsive", "api", "webpack", "redux", "figma"],
        backend: ["node.js", "express", "mongodb", "sql", "rest api", "docker", "python", "java", "microservices", "redis"],
        fullstack: ["react", "node.js", "typescript", "mongodb", "aws", "graphql", "docker", "ci/cd", "rest api", "git"],
        datascience: ["python", "machine learning", "pandas", "numpy", "tensorflow", "scikit-learn", "sql", "jupyter", "statistics", "deep learning"],
        pm: ["agile", "scrum", "jira", "analytics", "roadmap", "stakeholder", "okr", "user research", "kpi", "product strategy"],
        custom: []
    };

    // =========================
    // UTILITY: Debounce
    // =========================
    function debounce(fn, delay = 300) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn(...args), delay);
        };
    }

    // =========================
    // UTILITY: Escape HTML
    // =========================
    function escapeHTML(str) {
        if (!str) return "";
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // =========================
    // UTILITY: Parse Bullet Points
    // =========================
    function parseBulletPoints(text) {
        if (!text || !text.trim()) return "";

        const lines = text.split("\n");
        let html = "";
        let inList = false;

        lines.forEach(line => {
            const clean = line.trim();
            if (!clean) return;

            if (clean.startsWith("-") || clean.startsWith("*")) {
                if (!inList) {
                    html += "<ul>";
                    inList = true;
                }
                html += `<li>${escapeHTML(clean.substring(1).trim())}</li>`;
            } else {
                if (inList) {
                    html += "</ul>";
                    inList = false;
                }
                html += `<p>${escapeHTML(clean)}</p>`;
            }
        });

        if (inList) html += "</ul>";
        return html;
    }

    // =========================
    // GET FORM VALUES
    // =========================
    function getFormValues() {
        const v = {};
        inputs.forEach(id => {
            v[id] = document.getElementById(id)?.value || "";
        });
        return v;
    }

    // =========================
    // TEMPLATE RENDERERS
    // =========================

    function renderModernTemplate(v) {
        const skillsArray = v.skills.split(",").map(s => s.trim()).filter(Boolean);

        const contactParts = [];
        if (v.email) contactParts.push(`<span class="contact-item">📧 ${escapeHTML(v.email)}</span>`);
        if (v.phone) contactParts.push(`<span class="contact-item">📱 ${escapeHTML(v.phone)}</span>`);
        if (v.location) contactParts.push(`<span class="contact-item">📍 ${escapeHTML(v.location)}</span>`);
        if (v.website) contactParts.push(`<span class="contact-item">🌐 ${escapeHTML(v.website)}</span>`);
        if (v.linkedin) contactParts.push(`<span class="contact-item">💼 ${escapeHTML(v.linkedin)}</span>`);
        if (v.github) contactParts.push(`<span class="contact-item">💻 ${escapeHTML(v.github)}</span>`);

        resumePreview.className = "resume-sheet template-modern";
        resumePreview.innerHTML = `
            <div class="resume-header modern-header">
                <h1>${escapeHTML(v.name) || "Your Name"}</h1>
                ${v.title ? `<p class="resume-title">${escapeHTML(v.title)}</p>` : ""}
                <div class="contact-row">${contactParts.join("")}</div>
            </div>

            ${v.summary ? `
            <div class="resume-section">
                <h3>Professional Summary</h3>
                <p>${escapeHTML(v.summary)}</p>
            </div>` : ""}

            ${v.experience ? `
            <div class="resume-section">
                <h3>Experience</h3>
                ${parseBulletPoints(v.experience)}
            </div>` : ""}

            ${v.projects ? `
            <div class="resume-section">
                <h3>Projects</h3>
                ${parseBulletPoints(v.projects)}
            </div>` : ""}

            ${v.education ? `
            <div class="resume-section">
                <h3>Education</h3>
                ${parseBulletPoints(v.education)}
            </div>` : ""}

            ${skillsArray.length ? `
            <div class="resume-section">
                <h3>Skills</h3>
                <div class="skills-wrap">
                    ${skillsArray.map(skill => `<span class="skill-badge">${escapeHTML(skill)}</span>`).join("")}
                </div>
            </div>` : ""}
        `;
    }

    function renderClassicTemplate(v) {
        const skillsArray = v.skills.split(",").map(s => s.trim()).filter(Boolean);

        const contactLine = [v.email, v.phone, v.location].filter(Boolean).map(escapeHTML).join("  •  ");
        const linksLine = [v.website, v.linkedin, v.github].filter(Boolean).map(escapeHTML).join("  •  ");

        resumePreview.className = "resume-sheet template-classic";
        resumePreview.innerHTML = `
            <div class="resume-header classic-header">
                <h1>${escapeHTML(v.name) || "Your Name"}</h1>
                ${v.title ? `<p class="resume-title">${escapeHTML(v.title)}</p>` : ""}
                ${contactLine ? `<p class="classic-contact">${contactLine}</p>` : ""}
                ${linksLine ? `<p class="classic-links">${linksLine}</p>` : ""}
            </div>

            ${v.summary ? `
            <div class="resume-section classic-section">
                <h3>PROFESSIONAL SUMMARY</h3>
                <p>${escapeHTML(v.summary)}</p>
            </div>` : ""}

            ${v.experience ? `
            <div class="resume-section classic-section">
                <h3>WORK EXPERIENCE</h3>
                ${parseBulletPoints(v.experience)}
            </div>` : ""}

            ${v.projects ? `
            <div class="resume-section classic-section">
                <h3>PROJECTS</h3>
                ${parseBulletPoints(v.projects)}
            </div>` : ""}

            ${v.education ? `
            <div class="resume-section classic-section">
                <h3>EDUCATION</h3>
                ${parseBulletPoints(v.education)}
            </div>` : ""}

            ${skillsArray.length ? `
            <div class="resume-section classic-section">
                <h3>TECHNICAL SKILLS</h3>
                <p class="classic-skills">${skillsArray.map(escapeHTML).join("  |  ")}</p>
            </div>` : ""}
        `;
    }

    function renderMinimalTemplate(v) {
        const skillsArray = v.skills.split(",").map(s => s.trim()).filter(Boolean);

        const contactParts = [];
        if (v.email) contactParts.push(escapeHTML(v.email));
        if (v.phone) contactParts.push(escapeHTML(v.phone));
        if (v.location) contactParts.push(escapeHTML(v.location));
        if (v.website) contactParts.push(escapeHTML(v.website.replace(/^https?:\/\//, "")));
        if (v.linkedin) contactParts.push(`in/${escapeHTML(v.linkedin.split("/").pop())}`);
        if (v.github) contactParts.push(`github/${escapeHTML(v.github.split("/").pop())}`);

        resumePreview.className = "resume-sheet template-minimal";
        resumePreview.innerHTML = `
            <div class="resume-header minimal-header">
                <h1>${escapeHTML(v.name) || "Your Name"}</h1>
                ${v.title ? `<p class="resume-title">${escapeHTML(v.title)}</p>` : ""}
                <div class="minimal-contact">${contactParts.map(c => `<span>${c}</span>`).join("")}</div>
            </div>

            ${v.summary ? `
            <div class="resume-section minimal-section">
                <h3>About</h3>
                <p>${escapeHTML(v.summary)}</p>
            </div>` : ""}

            ${v.experience ? `
            <div class="resume-section minimal-section">
                <h3>Experience</h3>
                ${parseBulletPoints(v.experience)}
            </div>` : ""}

            ${v.projects ? `
            <div class="resume-section minimal-section">
                <h3>Projects</h3>
                ${parseBulletPoints(v.projects)}
            </div>` : ""}

            ${v.education ? `
            <div class="resume-section minimal-section">
                <h3>Education</h3>
                ${parseBulletPoints(v.education)}
            </div>` : ""}

            ${skillsArray.length ? `
            <div class="resume-section minimal-section">
                <h3>Skills</h3>
                <p class="minimal-skills">${skillsArray.map(escapeHTML).join(" · ")}</p>
            </div>` : ""}
        `;
    }

    // =========================
    // UPDATE PREVIEW (dispatches to template)
    // =========================
    function updatePreview() {
        const v = getFormValues();

        switch (currentTemplate) {
            case "classic":
                renderClassicTemplate(v);
                break;
            case "minimal":
                renderMinimalTemplate(v);
                break;
            case "modern":
            default:
                renderModernTemplate(v);
                break;
        }
    }

    // =========================
    // ATS ANALYSIS
    // =========================
    function runResumeAnalysis() {
        let score = 0;
        const suggestions = [];

        const name = document.getElementById("name")?.value || "";
        const summary = document.getElementById("summary")?.value || "";
        const skills = document.getElementById("skills")?.value || "";
        const experience = document.getElementById("experience")?.value || "";
        const projects = document.getElementById("projects")?.value || "";
        const education = document.getElementById("education")?.value || "";

        // Name check
        if (name.trim().length > 0) {
            score += 5;
        } else {
            suggestions.push("Add your full name.");
        }

        // Summary check
        if (summary.length > 80) {
            score += 20;
        } else if (summary.length > 0) {
            score += 8;
            suggestions.push("Expand your professional summary (80+ characters recommended).");
        } else {
            suggestions.push("Add a professional summary.");
        }

        // Skills check
        const skillCount = skills.split(",").map(s => s.trim()).filter(Boolean).length;
        if (skillCount >= 5) {
            score += 20;
        } else if (skillCount > 0) {
            score += 8;
            suggestions.push(`Add more skills (${skillCount}/5 minimum).`);
        } else {
            suggestions.push("Add relevant skills (comma-separated).");
        }

        // Experience check
        if (experience.length > 100) {
            score += 20;
        } else if (experience.length > 0) {
            score += 8;
            suggestions.push("Expand your experience section with more detail.");
        } else {
            suggestions.push("Add work experience.");
        }

        // Projects check
        if (projects.length > 50) {
            score += 10;
        } else if (projects.length > 0) {
            score += 4;
            suggestions.push("Describe your projects in more detail.");
        } else {
            suggestions.push("Add projects to showcase your work.");
        }

        // Education check
        if (education.length > 20) {
            score += 5;
        } else if (education.length > 0) {
            score += 2;
        } else {
            suggestions.push("Add your education background.");
        }

        // Keyword match scoring
        const role = targetRole.value;
        const roleKeywords = role === "custom"
            ? (customKeywords?.value || "").split(",").map(k => k.trim()).filter(Boolean)
            : (roleKeywordsMap[role] || []);

        if (roleKeywords.length > 0) {
            const allText = (summary + " " + skills + " " + experience + " " + projects).toLowerCase();
            let matched = 0;

            roleKeywords.forEach(keyword => {
                if (allText.includes(keyword.toLowerCase())) {
                    matched++;
                }
            });

            const keywordScore = Math.round((matched / roleKeywords.length) * 20);
            score += keywordScore;

            if (matched < roleKeywords.length) {
                const missing = roleKeywords.filter(k => !allText.includes(k.toLowerCase()));
                if (missing.length > 0 && missing.length <= 5) {
                    suggestions.push(`Add keywords: ${missing.join(", ")}`);
                } else if (missing.length > 5) {
                    suggestions.push(`Add ${missing.length} more role-specific keywords.`);
                }
            }
        }

        score = Math.min(score, 100);

        // Animate score
        animateScore(score);

        // Update score color ring
        const scoreCircle = document.querySelector(".score-circle");
        if (scoreCircle) {
            if (score >= 75) {
                scoreCircle.setAttribute("data-level", "high");
            } else if (score >= 45) {
                scoreCircle.setAttribute("data-level", "medium");
            } else {
                scoreCircle.setAttribute("data-level", "low");
            }
        }

        // Render suggestions
        if (atsSuggestionsList) {
            atsSuggestionsList.innerHTML = suggestions.length
                ? suggestions.map(item => `<li><span class="suggestion-icon">💡</span> ${item}</li>`).join("")
                : `<li class="ats-pass"><span class="suggestion-icon">✅</span> Your resume looks ATS-optimized!</li>`;
        }
    }

    // Animate score counter
    let currentDisplayedScore = 0;
    function animateScore(target) {
        const step = target > currentDisplayedScore ? 1 : -1;
        const timer = setInterval(() => {
            currentDisplayedScore += step;
            if ((step > 0 && currentDisplayedScore >= target) ||
                (step < 0 && currentDisplayedScore <= target)) {
                currentDisplayedScore = target;
                clearInterval(timer);
            }
            if (atsScoreValue) {
                atsScoreValue.textContent = currentDisplayedScore;
            }
        }, 15);
    }

    // =========================
    // KEYWORD SUGGESTIONS
    // =========================
    function updateKeywordsSuggestions() {
        const role = targetRole.value;
        let keywords = [];

        if (role === "custom") {
            keywords = (customKeywords?.value || "").split(",").map(k => k.trim()).filter(Boolean);
        } else {
            keywords = roleKeywordsMap[role] || [];
        }

        if (!recommendedKeywordsList) return;
        recommendedKeywordsList.innerHTML = "";

        const currentSkills = (document.getElementById("skills")?.value || "").toLowerCase();

        keywords.forEach(keyword => {
            const badge = document.createElement("span");
            badge.className = "keyword-badge";

            const isPresent = currentSkills.includes(keyword.toLowerCase());
            if (isPresent) {
                badge.classList.add("keyword-matched");
            }

            badge.textContent = keyword;

            badge.addEventListener("click", () => {
                const skillsInput = document.getElementById("skills");
                if (!skillsInput) return;

                if (!skillsInput.value.toLowerCase().includes(keyword.toLowerCase())) {
                    skillsInput.value += skillsInput.value ? `, ${keyword}` : keyword;
                    updatePreview();
                    runResumeAnalysis();
                    saveToLocalStorage();
                    updateKeywordsSuggestions();
                }
            });

            recommendedKeywordsList.appendChild(badge);
        });
    }

    // =========================
    // LOCAL STORAGE
    // =========================
    function saveToLocalStorage() {
        const data = {};
        inputs.forEach(id => {
            data[id] = document.getElementById(id)?.value || "";
        });
        data.role = targetRole.value;
        data.template = currentTemplate;
        localStorage.setItem("resume_studio_data", JSON.stringify(data));
    }

    function loadFromLocalStorage() {
        const raw = localStorage.getItem("resume_studio_data");
        if (!raw) return;

        try {
            const data = JSON.parse(raw);
            inputs.forEach(id => {
                const el = document.getElementById(id);
                if (el && data[id]) el.value = data[id];
            });

            if (data.role) targetRole.value = data.role;
            if (data.template) currentTemplate = data.template;

            // Sync template button active state
            document.querySelectorAll(".tpl-btn").forEach(btn => {
                btn.classList.toggle("active", btn.dataset.template === currentTemplate);
            });

            // Sync custom keywords visibility
            if (targetRole.value === "custom") {
                customKeywordsGroup.style.display = "block";
            }
        } catch (e) {
            console.warn("Failed to load saved data:", e);
        }
    }

    // =========================
    // THEME TOGGLE
    // =========================
    function initTheme() {
        const savedTheme = localStorage.getItem("resume_studio_theme");
        if (savedTheme === "light") {
            document.body.classList.add("light");
            themeSwitcher.textContent = "🌙 Dark Mode";
        } else {
            document.body.classList.remove("light");
            themeSwitcher.textContent = "☀️ Light Mode";
        }
    }

    themeSwitcher.addEventListener("click", () => {
        document.body.classList.toggle("light");
        const isLight = document.body.classList.contains("light");
        themeSwitcher.textContent = isLight ? "🌙 Dark Mode" : "☀️ Light Mode";
        localStorage.setItem("resume_studio_theme", isLight ? "light" : "dark");
    });

    // =========================
    // TEMPLATE SWITCH
    // =========================
    document.querySelectorAll(".tpl-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".tpl-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentTemplate = btn.dataset.template;
            updatePreview();
            saveToLocalStorage();
        });
    });

    // =========================
    // INPUT LISTENERS (debounced)
    // =========================
    const debouncedUpdate = debounce(() => {
        updatePreview();
        runResumeAnalysis();
        saveToLocalStorage();
        updateKeywordsSuggestions();
    }, 250);

    inputs.forEach(id => {
        const inputEl = document.getElementById(id);
        if (inputEl) {
            inputEl.addEventListener("input", debouncedUpdate);
        }
    });

    // =========================
    // ROLE CHANGE
    // =========================
    targetRole.addEventListener("change", () => {
        if (targetRole.value === "custom") {
            customKeywordsGroup.style.display = "block";
        } else {
            customKeywordsGroup.style.display = "none";
        }
        updateKeywordsSuggestions();
        runResumeAnalysis();
        saveToLocalStorage();
    });

    if (customKeywords) {
        customKeywords.addEventListener("input", () => {
            updateKeywordsSuggestions();
            runResumeAnalysis();
        });
    }

    // =========================
    // FILL DEMO
    // =========================
    fillDemoBtn.addEventListener("click", () => {
        document.getElementById("name").value = "Alex Morgan";
        document.getElementById("title").value = "Fullstack Developer";
        document.getElementById("email").value = "alex.morgan@gmail.com";
        document.getElementById("phone").value = "+1 (512) 987-6543";
        document.getElementById("location").value = "Austin, Texas";
        document.getElementById("website").value = "https://alexmorgan.dev";
        document.getElementById("linkedin").value = "linkedin.com/in/alexmorgan";
        document.getElementById("github").value = "github.com/alexmorgan";
        document.getElementById("summary").value =
            "Passionate fullstack engineer with 4+ years of experience building scalable, high-performance web applications. Proficient in React, Node.js, and cloud infrastructure. Strong advocate for clean code, test-driven development, and agile practices.";
        document.getElementById("experience").value =
            "- Senior Frontend Developer at TechCorp (2022–Present)\n- Built and maintained React-based dashboard serving 50K+ users\n- Improved API response times by 40% through query optimization\n- Led migration from JavaScript to TypeScript across 3 major projects\n- Junior Developer at WebStart Inc (2020–2022)\n- Developed RESTful APIs using Node.js and Express\n- Implemented CI/CD pipelines with GitHub Actions";
        document.getElementById("projects").value =
            "- Resume Studio — ATS-optimized resume builder with live preview and PDF export\n- CloudChat — Real-time messaging app built with Socket.io and React\n- DataViz Dashboard — Interactive analytics dashboard with D3.js and Python backend";
        document.getElementById("education").value =
            "B.S. in Computer Science — University of Texas at Austin (2020)\n- GPA: 3.8/4.0\n- Dean's List, Spring 2019 & Fall 2019";
        document.getElementById("skills").value =
            "React, Node.js, TypeScript, MongoDB, AWS, Docker, GraphQL, Python, Git, REST API, PostgreSQL, Redis";

        updatePreview();
        runResumeAnalysis();
        saveToLocalStorage();
        updateKeywordsSuggestions();
    });

    // =========================
    // CLEAR FORM
    // =========================
    clearFormBtn.addEventListener("click", () => {
        inputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = "";
        });
        localStorage.removeItem("resume_studio_data");
        updatePreview();
        runResumeAnalysis();
        updateKeywordsSuggestions();
    });

    // =========================
    // PRINT
    // =========================
    printBtn.addEventListener("click", () => {
        window.print();
    });

    // =========================
    // DOWNLOAD PDF
    // =========================
    downloadBtn.addEventListener("click", async () => {
        const originalText = downloadBtn.textContent;
        downloadBtn.textContent = "⏳ Generating...";
        downloadBtn.disabled = true;

        try {
            // Temporarily ensure preview is visible for rendering
            const previewSection = document.querySelector(".preview");
            const wasHidden = previewSection && getComputedStyle(previewSection).display === "none";
            if (wasHidden) {
                previewSection.style.display = "block";
                previewSection.style.position = "absolute";
                previewSection.style.left = "-9999px";
            }

            const canvas = await html2canvas(resumePreview, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#ffffff"
            });

            if (wasHidden) {
                previewSection.style.display = "";
                previewSection.style.position = "";
                previewSection.style.left = "";
            }

            const imgData = canvas.toDataURL("image/png");
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF("p", "mm", "a4");

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = pageWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            // First page
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // Additional pages if content overflows
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            const userName = (document.getElementById("name")?.value || "").trim() || "my";
            const formattedName = userName.toLowerCase().replace(/\s+/g, "_");
            pdf.save(`${formattedName}_resume.pdf`);

        } catch (err) {
            console.error("PDF generation failed:", err);
            alert("PDF generation failed. Try using the 'Print' button as an alternative.");
        } finally {
            downloadBtn.textContent = originalText;
            downloadBtn.disabled = false;
        }
    });

    // =========================
    // MOBILE PREVIEW TOGGLE
    // =========================
    if (previewToggleBtn) {
        previewToggleBtn.addEventListener("click", () => {
            const previewSection = document.querySelector(".preview");
            if (!previewSection) return;

            const isVisible = previewSection.classList.toggle("preview-visible");
            previewToggleBtn.textContent = isVisible ? "✏️ Back to Editor" : "👁️ Preview Resume";
        });
    }

    // =========================
    // INIT SEQUENCE
    // =========================
    initTheme();
    loadFromLocalStorage();
    updatePreview();
    updateKeywordsSuggestions();
    runResumeAnalysis();
}

// =========================
// SAFE INIT
// =========================
let resumeStudioInitialized = false;

function safeInit() {
    if (resumeStudioInitialized) return;
    resumeStudioInitialized = true;
    initResumeStudio();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", safeInit);
} else {
    safeInit();
}
