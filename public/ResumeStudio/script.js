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

    const navItems = document.querySelectorAll(".nav-item");
    const formSections = document.querySelectorAll(".form-section");

    const prevSectionBtn = document.getElementById("prevSectionBtn");
    const nextSectionBtn = document.getElementById("nextSectionBtn");

    const currentSectionTitle = document.getElementById("currentSectionTitle");

    const inputs = [
        "name",
        "title",
        "email",
        "phone",
        "location",
        "website",
        "linkedin",
        "github",
        "summary",
        "experience",
        "projects",
        "education",
        "skills"
    ];

    const tabs = [
        "personal",
        "summary",
        "experience",
        "projects",
        "education",
        "skills",
        "analyzer"
    ];

    let currentTab = "personal";
    let currentTemplate = "modern";

    // =========================
    // KEYWORDS
    // =========================
    const roleKeywordsMap = {
        frontend: [
            "react",
            "javascript",
            "css",
            "html",
            "typescript",
            "responsive",
            "api"
        ],
        backend: [
            "node.js",
            "express",
            "mongodb",
            "sql",
            "rest api",
            "docker"
        ],
        fullstack: [
            "react",
            "node.js",
            "typescript",
            "mongodb",
            "aws",
            "graphql"
        ],
        datascience: [
            "python",
            "machine learning",
            "pandas",
            "numpy",
            "tensorflow"
        ],
        pm: [
            "agile",
            "scrum",
            "jira",
            "analytics",
            "roadmap"
        ],
        custom: []
    };

    // =========================
    // INIT
    // =========================
    loadFromLocalStorage();
    updatePreview();
    updateKeywordsSuggestions();
    runResumeAnalysis();

    // =========================
    // TAB SWITCHING
    // =========================
    function switchTab(tabId) {
        currentTab = tabId;

        navItems.forEach(item => {
            item.classList.toggle(
                "active",
                item.dataset.tab === tabId
            );
        });

        formSections.forEach(section => {
            section.classList.toggle(
                "active",
                section.dataset.section === tabId
            );
        });

        currentSectionTitle.textContent =
            tabId.charAt(0).toUpperCase() +
            tabId.slice(1);

        const currentIndex = tabs.indexOf(tabId);

        prevSectionBtn.disabled = currentIndex === 0;

        nextSectionBtn.textContent =
            currentIndex === tabs.length - 1
                ? "Finish"
                : "Next";
    }

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            switchTab(item.dataset.tab);
        });
    });

    nextSectionBtn.addEventListener("click", () => {
        const currentIndex = tabs.indexOf(currentTab);

        if (currentIndex < tabs.length - 1) {
            switchTab(tabs[currentIndex + 1]);
        } else {
            downloadBtn.click();
        }
    });

    prevSectionBtn.addEventListener("click", () => {
        const currentIndex = tabs.indexOf(currentTab);

        if (currentIndex > 0) {
            switchTab(tabs[currentIndex - 1]);
        }
    });

    // =========================
    // TEMPLATE SWITCH
    // =========================
    document.querySelectorAll(".tpl-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document
                .querySelectorAll(".tpl-btn")
                .forEach(b => b.classList.remove("active"));

            btn.classList.add("active");

            currentTemplate = btn.dataset.template;

            updatePreview();
        });
    });

    // =========================
    // THEME SWITCHER
    // =========================
    themeSwitcher.addEventListener("click", () => {
        document.body.classList.toggle("dark");
    });

    // =========================
    // INPUT LISTENERS
    // =========================
    inputs.forEach(id => {
        const input = document.getElementById(id);

        if (!input) return;

    function debounce(fn, delay = 300) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
    }

    inputs.forEach(id => {
        const inputEl = document.getElementById(id);
        const counterEl = document.getElementById(`${id}Count`);
        
        if (inputEl) {
            // Listen on input to run preview update & ATS scores in real-time
            inputEl.addEventListener("input", debounce(() => {
                if (counterEl) {
                    counterEl.textContent = `${inputEl.value.length}/${inputEl.maxLength}`;
                    counterEl.style.color = inputEl.value.length >= inputEl.maxLength ? "red" : "";
                }
                updatePreview();
                runResumeAnalysis();
                saveToLocalStorage();
            }, 250));
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
    });

    customKeywords.addEventListener("input", () => {
        updateKeywordsSuggestions();
        runResumeAnalysis();
    });

    // =========================
    // PARSE BULLETS
    // =========================
    function parseBulletPoints(text) {
        if (!text.trim()) return "";

        const lines = text.split("\n");

        let html = "";
        let inList = false;

        lines.forEach(line => {
            const clean = line.trim();

            if (
                clean.startsWith("-") ||
                clean.startsWith("*")
            ) {
                if (!inList) {
                    html += "<ul>";
                    inList = true;
                }

                html += `<li>${clean.substring(1)}</li>`;
            } else {
                if (inList) {
                    html += "</ul>";
                    inList = false;
                }

                html += `<p>${clean}</p>`;
            }
        });

        if (inList) {
            html += "</ul>";
        }

        return html;
    }

    function escapeHTML(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
    
    // ==========================================
    // 6. RENDER PREVIEW LAYOUTS
    // ==========================================
    function updatePreview() {
        const values = {};

        inputs.forEach(id => {
            values[id] =
                document.getElementById(id)?.value || "";
        });

        const skillsArray = values.skills
            .split(",")
            .map(s => s.trim())
            .filter(Boolean);

        resumePreview.className = currentTemplate;

        resumePreview.innerHTML = `
            <div class="modern-header" id="preview-section-personal">
                <div class="modern-header-title">
                    <h1>${v.name || "Your Name"}</h1>
                    <p>${v.title || "Professional Role / Title"}</p>
                </div>
                <div class="modern-contact-info">
                    ${v.email ? `<span>${v.email}</span>` : ""}
                    ${v.phone ? `<span>${v.phone}</span>` : ""}
                    ${v.location ? `<span>${v.location}</span>` : ""}
                    ${v.website ? `<span>${v.website.replace(/^https?:\/\//, "")}</span>` : ""}
                </div>
            </div>
            
            <div class="modern-layout">
                <div class="modern-main-col">
                    ${v.summary ? `
                        <div class="modern-section" id="preview-section-summary">
                            <h3>Profile Summary</h3>
                            <div class="modern-section-content"><p>${escapeHTML(v.summary)}</p></div>
                        </div>
                    ` : ""}
                    
                    ${v.experience ? `
                        <div class="modern-section" id="preview-section-experience">
                            <h3>Professional History</h3>
                            <div class="modern-section-content">${parseBulletPoints(v.experience)}</div>
                        </div>
                    ` : ""}
                    
                    ${v.projects ? `
                        <div class="modern-section" id="preview-section-projects">
                            <h3>Key Projects</h3>
                            <div class="modern-section-content">${parseBulletPoints(v.projects)}</div>
                        </div>
                    ` : ""}
                </div>
                
                <div class="modern-sidebar-col">
                    ${v.education ? `
                        <div class="modern-section" id="preview-section-education">
                            <h3>Education</h3>
                            <div class="modern-section-content">${parseBulletPoints(v.education)}</div>
                        </div>
                    ` : ""}
                    
                    ${skillsArr.length > 0 ? `
                        <div class="modern-section" id="preview-section-skills">
                            <h3>Key Skills</h3>
                            <ul class="modern-skills-list">
                                ${skillsArr.map(s => `<li>${s}</li>`).join("")}
                            </ul>
                        </div>
                    ` : ""}
                    
                    <div class="modern-section">
                        <h3>Online Links</h3>
                        <div class="modern-section-content" style="font-size: 0.78rem; display: flex; flex-direction: column; gap: 4px;">
                            ${v.linkedin ? `<div><strong>LinkedIn:</strong> ${v.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</div>` : ""}
                            ${v.github ? `<div><strong>GitHub:</strong> ${v.github.replace(/^https?:\/\/(www\.)?/, "")}</div>` : ""}
                        </div>
                    </div>
                </div>
            </div>

            ${
                values.summary
                    ? `
                <section>
                    <h3>Summary</h3>
                    <div class="classic-section-content"><p>${escapeHTML(v.summary)}</p></div>
                </div>
            ` : ""}
            
            ${v.experience ? `
                <div class="classic-section" id="preview-section-experience">
                    <h3>Experience</h3>
                    <div class="classic-section-content">${parseBulletPoints(v.experience)}</div>
                </div>
            ` : ""}
            
            ${v.projects ? `
                <div class="classic-section" id="preview-section-projects">
                    <h3>Projects</h3>
                    <div class="classic-section-content">${parseBulletPoints(v.projects)}</div>
                </div>
            ` : ""}
            
            ${v.education ? `
                <div class="classic-section" id="preview-section-education">
                    <h3>Education</h3>
                    <div class="classic-section-content">${parseBulletPoints(v.education)}</div>
                </div>
            ` : ""}
            
            ${v.skills ? `
                <div class="classic-section" id="preview-section-skills">
                    <h3>Skills</h3>
                    <div class="classic-section-content classic-skills">
                        <p>${v.skills}</p>
                    </div>
                </div>
            ` : ""}
        `;
    }

    function renderMinimalTemplate(v) {
        resumePreview.innerHTML = `
            <div class="minimal-header" id="preview-section-personal">
                <h1>${v.name || "Your Name"}</h1>
                ${v.title ? `<p class="minimal-title">${v.title}</p>` : ""}
                
                <div class="minimal-contact">
                    ${v.email ? `<span>${v.email}</span>` : ""}
                    ${v.phone ? `<span>${v.phone}</span>` : ""}
                    ${v.location ? `<span>${v.location}</span>` : ""}
                    ${v.website ? `<span>${v.website.replace(/^https?:\/\//, "")}</span>` : ""}
                    ${v.linkedin ? `<span>in/${v.linkedin.split("/").pop()}</span>` : ""}
                    ${v.github ? `<span>github/${v.github.split("/").pop()}</span>` : ""}
                </div>
            </div>
            
            ${v.summary ? `
                <div class="minimal-section" id="preview-section-summary">
                    <h3>About</h3>
                    <div class="minimal-section-content"><p>${escapeHTML(v.summary)}</p></div>
                </div>
            ` : ""}
            
            ${v.experience ? `
                <div class="minimal-section" id="preview-section-experience">
                    <h3>Experience</h3>
                    ${parseBulletPoints(values.experience)}
                </section>
            `
                    : ""
            }

            ${
                values.projects
                    ? `
                <section>
                    <h3>Projects</h3>
                    ${parseBulletPoints(values.projects)}
                </section>
            `
                    : ""
            }

            ${
                values.education
                    ? `
                <section>
                    <h3>Education</h3>
                    ${parseBulletPoints(values.education)}
                </section>
            `
                    : ""
            }

            ${
                skillsArray.length
                    ? `
                <section>
                    <h3>Skills</h3>

                    <div class="skills-wrap">
                        ${skillsArray
                            .map(
                                skill =>
                                    `<span class="skill-badge">${skill}</span>`
                            )
                            .join("")}
                    </div>
                </section>
            `
                    : ""
            }
        `;
    }

    // =========================
    // ATS ANALYSIS
    // =========================
    function runResumeAnalysis() {
        let score = 0;
        let suggestions = [];

        const summary =
            document.getElementById("summary").value;

        const skills =
            document.getElementById("skills").value;

        const experience =
            document.getElementById("experience").value;

        if (summary.length > 80) {
            score += 25;
        } else {
            suggestions.push(
                "Add a stronger professional summary."
            );
        }

        if (skills.split(",").length >= 5) {
            score += 25;
        } else {
            suggestions.push(
                "Add more relevant skills."
            );
        }

        if (experience.length > 100) {
            score += 25;
        } else {
            suggestions.push(
                "Expand your experience section."
            );
        }

        const role = targetRole.value;

        const roleKeywords =
            roleKeywordsMap[role] || [];

        let matched = 0;

        roleKeywords.forEach(keyword => {
            const allText =
                (
                    summary +
                    skills +
                    experience
                ).toLowerCase();

            if (allText.includes(keyword)) {
                matched++;
            }
        });

        score += matched * 4;

        if (score > 100) score = 100;

        atsScoreValue.textContent = score;

        atsSuggestionsList.innerHTML = suggestions.length
            ? suggestions
                  .map(item => `<li>${item}</li>`)
                  .join("")
            : "<li>Your resume looks ATS optimized.</li>";
    }

    // =========================
    // KEYWORDS SUGGESTIONS
    // =========================
    function updateKeywordsSuggestions() {
        const role = targetRole.value;

        let keywords = [];

        if (role === "custom") {
            keywords = customKeywords.value
                .split(",")
                .map(k => k.trim());
        } else {
            keywords =
                roleKeywordsMap[role] || [];
        }

        recommendedKeywordsList.innerHTML = "";

        keywords.forEach(keyword => {
            const badge = document.createElement("span");

            badge.className = "keyword-badge";
            badge.textContent = keyword;

            badge.addEventListener("click", () => {
                const skills =
                    document.getElementById("skills");

                if (!skills.value.includes(keyword)) {
                    skills.value += skills.value
                        ? `, ${keyword}`
                        : keyword;

                    updatePreview();
                    runResumeAnalysis();
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
            data[id] =
                document.getElementById(id)?.value || "";
        });

        data.role = targetRole.value;
        data.template = currentTemplate;

        localStorage.setItem(
            "resume_studio_data",
            JSON.stringify(data)
        );
    }

    function loadFromLocalStorage() {
        const raw = localStorage.getItem(
            "resume_studio_data"
        );

        if (!raw) return;

        const data = JSON.parse(raw);

        inputs.forEach(id => {
            if (data[id]) {
                document.getElementById(id).value =
                    data[id];
            }
        });

        if (data.role) {
            targetRole.value = data.role;
        }

        if (data.template) {
            currentTemplate = data.template;
        }
    }

    // =========================
    // CLEAR FORM
    // =========================
    clearFormBtn.addEventListener("click", () => {
        inputs.forEach(id => {
            document.getElementById(id).value = "";
        });

        localStorage.removeItem(
            "resume_studio_data"
        );

        updatePreview();
        runResumeAnalysis();
    });

    // =========================
    // DEMO DATA
    // =========================
    fillDemoBtn.addEventListener("click", () => {
        document.getElementById("name").value =
            "Alex Morgan";

        document.getElementById("title").value =
            "Fullstack Developer";

        document.getElementById("email").value =
            "alex@gmail.com";

        document.getElementById("phone").value =
            "+1 9876543210";

        document.getElementById("location").value =
            "Austin, Texas";

        document.getElementById("summary").value =
            "Passionate fullstack engineer with experience building scalable web applications.";

        document.getElementById("experience").value =
            "- Built scalable React apps\n- Improved API speed by 40%";

        document.getElementById("projects").value =
            "- Resume Builder App\n- AI Chat Application";

        document.getElementById("education").value =
            "B.Tech in Computer Science";

        document.getElementById("skills").value =
            "React, Node.js, MongoDB, JavaScript, AWS";

        updatePreview();
        runResumeAnalysis();
        saveToLocalStorage();
    });

    // =========================
    // PRINT
    // =========================
    printBtn.addEventListener("click", () => {
        window.print();
    });

    // =========================
    // DOWNLOAD
    // =========================
    downloadBtn.addEventListener("click", async () => {
        try {
            const canvas = await html2canvas(
                resumePreview,
                {
                    scale: 2
                }
            );

            const imgData =
                canvas.toDataURL("image/png");

            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF("p", "mm", "a4");
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = pageWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;
            
            // First page
            pdf.addImage(
                imgData,
                "PNG",
                0,
                position,
                imgWidth,
                imgHeight
            );
            heightLeft -= pageHeight;
            
            // Additional pages
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(
                    imgData,
                    "PNG",
                    0,
                    position,
                    imgWidth,
                    imgHeight
                );
                heightLeft -= pageHeight;
            }
            
            const userName = document.getElementById("name").value.trim() || "My";
            const formattedName = userName.toLowerCase().replace(/\s+/g, "_");
            
            pdfLoaderProgress.textContent = "Finalizing download...";
            await new Promise(resolve => setTimeout(resolve, 400));
            
            pdf.save(`${formattedName}_resume.pdf`);
        } catch (err) {
            console.error(err);
            alert("High-res PDF rendering failed. Try using the 'Print' option as an alternative.");
        } finally {
            pdfLoader.classList.remove("active");
            // Restore transitions
            resumePreview.style.transition = "";
            // Re-run analysis to restore visual completeness highlights
            runResumeAnalysis();
            // Restore active section highlight
            highlightPreviewSection(currentTabActive);
            // Restore scaled preview layout zoom
            scaleResumePreview();
        }
    });

            const pdf = new jsPDF(
                "p",
                "mm",
                "a4"
            );

            const width =
                pdf.internal.pageSize.getWidth();

            const height =
                (canvas.height * width) /
                canvas.width;

            pdf.addImage(
                imgData,
                "PNG",
                0,
                0,
                width,
                height
            );

            pdf.save("resume.pdf");
        } catch (error) {
            console.error(error);
            alert("Failed to generate PDF");
        }
    });
}

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
