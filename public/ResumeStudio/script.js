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

        input.addEventListener("input", () => {
            updatePreview();
            runResumeAnalysis();
            saveToLocalStorage();

            const counter = document.getElementById(`${id}Count`);

            if (counter && input.maxLength) {
                counter.textContent =
                    `${input.value.length}/${input.maxLength}`;
            }
        });
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

    // =========================
    // UPDATE PREVIEW
    // =========================
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
            <div class="resume-header">
                <h1>${values.name || "Your Name"}</h1>
                <h2>${values.title || "Professional Title"}</h2>

                <div class="resume-contact">
                    <span>${values.email}</span>
                    <span>${values.phone}</span>
                    <span>${values.location}</span>
                </div>
            </div>

            ${
                values.summary
                    ? `
                <section>
                    <h3>Summary</h3>
                    <p>${values.summary}</p>
                </section>
            `
                    : ""
            }

            ${
                values.experience
                    ? `
                <section>
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

document.addEventListener(
    "DOMContentLoaded",
    initResumeStudio
);