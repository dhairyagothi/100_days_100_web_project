function initResumeStudio() {
    // DOM Elements
    const themeSwitcher = document.getElementById("themeSwitcher");
    const resumePreview = document.getElementById("resumePreview");
    const downloadBtn   = document.getElementById("downloadBtn");
    const printBtn      = document.getElementById("printBtn");
    const errorMsg      = document.getElementById("errorMsg");
    const fillDemoBtn   = document.getElementById("fillDemoBtn");
    const clearFormBtn  = document.getElementById("clearFormBtn");
    const targetRole    = document.getElementById("targetRole");
    const customKeywordsGroup = document.getElementById("customKeywordsGroup");
    const customKeywords = document.getElementById("customKeywords");
    const recommendedKeywordsList = document.getElementById("recommendedKeywordsList");
    
    // Tab Elements
    const navItems = document.querySelectorAll(".nav-item");
    const formSections = document.querySelectorAll(".form-section");
    const prevSectionBtn = document.getElementById("prevSectionBtn");
    const nextSectionBtn = document.getElementById("nextSectionBtn");
    const currentSectionTitle = document.getElementById("currentSectionTitle");
    
    // ATS Widgets
    const atsScoreValue = document.getElementById("atsScoreValue");
    const atsStatusBadge = document.getElementById("atsStatusBadge");
    const atsProgressCircle = document.querySelector(".progress-ring-circle");
    const strengthBadge = document.getElementById("strengthBadge");
    const readinessBadge = document.getElementById("readinessBadge");
    const reportScore = document.getElementById("reportScore");
    const reportBadge = document.getElementById("reportBadge");
    const reportDesc = document.getElementById("reportDesc");
    const atsChecklistItems = document.getElementById("atsChecklistItems");
    const atsSuggestionsList = document.getElementById("atsSuggestionsList");
    const atsNavBadge = document.getElementById("ats-nav-badge");
    
    // PDF Loader Elements
    const pdfLoader = document.getElementById("pdfLoader");
    const pdfLoaderProgress = document.getElementById("pdfLoaderProgress");

    // List of tab IDs in navigation order
    const tabs = ["personal", "summary", "experience", "projects", "education", "skills", "analyzer"];
    let currentTabActive = "personal";
    let currentTemplate = "modern";

    const inputs = [
        "name", "title", "email", "phone", "location", "website", 
        "linkedin", "github", "summary", "experience", "projects", 
        "education", "skills"
    ];

    // Preloaded Role Keywords (for ATS matching)
    const roleKeywordsMap = {
        frontend: ["react", "javascript", "css", "html", "typescript", "git", "responsive", "api", "frontend", "ui", "ux", "webpack", "sass", "flexbox", "tailwind"],
        backend: ["node.js", "express", "databases", "sql", "postgresql", "mongodb", "docker", "aws", "backend", "api", "rest", "graphql", "python", "java", "redis", "nginx"],
        fullstack: ["react", "node.js", "express", "databases", "javascript", "sql", "git", "api", "fullstack", "aws", "frontend", "backend", "typescript", "docker", "graphql"],
        datascience: ["python", "sql", "machine learning", "pandas", "numpy", "statistics", "tableau", "analysis", "visualization", "scikit-learn", "tensorflow", "r", "nlp"],
        pm: ["agile", "scrum", "strategy", "roadmap", "analytics", "sql", "research", "stakeholder", "a/b testing", "management", "product", "jira", "kpis"],
        custom: []
    };

    // Load initial data
    loadFromLocalStorage();
    updateKeywordsSuggestions();
    runResumeAnalysis();

    // ==========================================
    // 1. NAVIGATION & TAB SWITCHING
    // ==========================================
    
    function switchTab(tabId) {
        currentTabActive = tabId;
        
        // Update nav items
        navItems.forEach(item => {
            if (item.dataset.tab === tabId) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        });
        
        // Update form sections
        formSections.forEach(section => {
            if (section.dataset.section === tabId) {
                section.classList.add("active");
            } else {
                section.classList.remove("active");
            }
        });
        
        // Update title header
        const formattedTitle = tabId.charAt(0).toUpperCase() + tabId.slice(1).replace("-", " ");
        currentSectionTitle.textContent = formattedTitle === "Analyzer" ? "ATS Analysis Report" : formattedTitle;
        
        // Update next/prev buttons state
        const currentIndex = tabs.indexOf(tabId);
        prevSectionBtn.disabled = currentIndex === 0;
        nextSectionBtn.textContent = currentIndex === tabs.length - 1 ? "Finish" : "Next";
        
        // Highlight active section in the A4 preview panel
        highlightPreviewSection(tabId);
    }
    
    // Add event listeners to Sidebar Tab items
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            switchTab(item.dataset.tab);
        });
    });

    // Next/Prev Buttons
    nextSectionBtn.addEventListener("click", () => {
        const currentIndex = tabs.indexOf(currentTabActive);
        if (currentIndex < tabs.length - 1) {
            switchTab(tabs[currentIndex + 1]);
        } else {
            // Trigger PDF Download when clicking Finish on the last tab
            downloadBtn.click();
        }
    });

    prevSectionBtn.addEventListener("click", () => {
        const currentIndex = tabs.indexOf(currentTabActive);
        if (currentIndex > 0) {
            switchTab(tabs[currentIndex - 1]);
        }
    });

    // ==========================================
    // 2. TEMPLATE SELECTION
    // ==========================================
    document.querySelectorAll(".tpl-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".tpl-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentTemplate = btn.dataset.template;
            resumePreview.className = currentTemplate;
            updatePreview();
        });
    });

    // ==========================================
    // 3. THEME SWITCHER
    // ==========================================
    function updateThemeUI() {
        const isDark = document.body.classList.contains("dark");
        if (isDark) {
            document.getElementById("themeIcon").innerHTML = `
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block;">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
            `;
            document.getElementById("themeLabel").textContent = "Light Mode";
            themeSwitcher.setAttribute("aria-label", "Switch to light mode");
        } else {
            document.getElementById("themeIcon").innerHTML = `
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block;">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
            `;
            document.getElementById("themeLabel").textContent = "Dark Mode";
            themeSwitcher.setAttribute("aria-label", "Switch to dark mode");
        }
    }

    themeSwitcher.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        updateThemeUI();
    });

    updateThemeUI();

    // ==========================================
    // 4. REAL-TIME INPUTS & CHAR COUNTERS
    // ==========================================

    inputs.forEach(id => {
        const inputEl = document.getElementById(id);
        const counterEl = document.getElementById(`${id}Count`);
        
        if (inputEl) {
            // Listen on input to run preview update & ATS scores in real-time
            inputEl.addEventListener("input", () => {
                if (counterEl) {
                    counterEl.textContent = `${inputEl.value.length}/${inputEl.maxLength}`;
                    counterEl.style.color = inputEl.value.length >= inputEl.maxLength ? "red" : "";
                }
                updatePreview();
                runResumeAnalysis();
                saveToLocalStorage();
            });
        }
    });

    // Target Role dropdown change
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

    customKeywords.addEventListener("input", () => {
        runResumeAnalysis();
        saveToLocalStorage();
    });

    // ==========================================
    // 5. HELPER FORMATTERS
    // ==========================================
    
    // Parse textareas and format bullet points automatically if lines start with '-' or '*'
    function parseBulletPoints(text) {
        if (!text || !text.trim()) return "";
        
        const lines = text.split("\n");
        let html = "";
        let insideList = false;
        
        lines.forEach(line => {
            const cleanLine = line.trim();
            if (cleanLine.startsWith("-") || cleanLine.startsWith("*")) {
                if (!insideList) {
                    html += "<ul>";
                    insideList = true;
                }
                // Strip the dash/star
                const itemContent = cleanLine.substring(1).trim();
                html += `<li>${itemContent}</li>`;
            } else {
                if (insideList) {
                    html += "</ul>";
                    insideList = false;
                }
                if (cleanLine) {
                    html += `<p>${cleanLine}</p>`;
                } else {
                    html += `<div style="height: 6px;"></div>`;
                }
            }
        });
        
        if (insideList) {
            html += "</ul>";
        }
        
        return html;
    }

    // ==========================================
    // 6. RENDER PREVIEW LAYOUTS
    // ==========================================
    function updatePreview() {
        const values = {};
        inputs.forEach(id => {
            values[id] = document.getElementById(id).value.trim();
        });

        // If all crucial sections are blank, display the visual placeholder
        const isBlank = !values.name && !values.summary && !values.experience && !values.skills;
        if (isBlank) {
            resumePreview.innerHTML = `
                <div class="placeholder-container">
                    <div class="placeholder-icon">
                        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.5; margin: 0 auto 1rem;">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                        </svg>
                    </div>
                    <p class="placeholder">Type in the builder form or click "Fill Demo Data" to generate your live resume preview...</p>
                </div>
            `;
            scaleResumePreview();
            return;
        }

        // Render templates
        if (currentTemplate === "modern") {
            renderModernTemplate(values);
        } else if (currentTemplate === "classic") {
            renderClassicTemplate(values);
        } else {
            renderMinimalTemplate(values);
        }
        
        // Auto scale to fit right panel
        scaleResumePreview();
    }

    function renderModernTemplate(v) {
        const skillsArr = v.skills ? v.skills.split(",").map(s => s.trim()).filter(Boolean) : [];
        
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
                            <div class="modern-section-content"><p>${v.summary}</p></div>
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
        `;
    }

    function renderClassicTemplate(v) {
        const contactParts = [];
        if (v.email) contactParts.push(v.email);
        if (v.phone) contactParts.push(v.phone);
        if (v.location) contactParts.push(v.location);
        if (v.website) contactParts.push(v.website.replace(/^https?:\/\//, ""));
        
        const socialParts = [];
        if (v.linkedin) socialParts.push(`LinkedIn: ${v.linkedin.replace(/^https?:\/\/(www\.)?/, "")}`);
        if (v.github) socialParts.push(`GitHub: ${v.github.replace(/^https?:\/\/(www\.)?/, "")}`);
        
        resumePreview.innerHTML = `
            <div class="classic-header" id="preview-section-personal">
                <h1>${v.name || "Your Name"}</h1>
                ${v.title ? `<p class="classic-title">${v.title}</p>` : ""}
                
                <div class="classic-contact-info">
                    ${contactParts.map(part => `<span>${part}</span>`).join("")}
                </div>
                ${socialParts.length > 0 ? `
                    <div class="classic-contact-info" style="margin-top: 2px;">
                        ${socialParts.map(part => `<span>${part}</span>`).join("")}
                    </div>
                ` : ""}
            </div>
            
            ${v.summary ? `
                <div class="classic-section" id="preview-section-summary">
                    <h3>Summary</h3>
                    <div class="classic-section-content"><p>${v.summary}</p></div>
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
                    <div class="minimal-section-content"><p>${v.summary}</p></div>
                </div>
            ` : ""}
            
            ${v.experience ? `
                <div class="minimal-section" id="preview-section-experience">
                    <h3>Experience</h3>
                    <div class="minimal-section-content">${parseBulletPoints(v.experience)}</div>
                </div>
            ` : ""}
            
            ${v.projects ? `
                <div class="minimal-section" id="preview-section-projects">
                    <h3>Projects</h3>
                    <div class="minimal-section-content">${parseBulletPoints(v.projects)}</div>
                </div>
            ` : ""}
            
            ${v.education ? `
                <div class="minimal-section" id="preview-section-education">
                    <h3>Education</h3>
                    <div class="minimal-section-content">${parseBulletPoints(v.education)}</div>
                </div>
            ` : ""}
            
            ${v.skills ? `
                <div class="minimal-section" id="preview-section-skills">
                    <h3>Skills</h3>
                    <div class="minimal-section-content">
                        <div class="minimal-skills-container">
                            ${v.skills.split(",").map(s => s.trim()).filter(Boolean).map(s => `<span class="minimal-skills-badge">${s}</span>`).join("")}
                        </div>
                    </div>
                </div>
            ` : ""}
        `;
    }

    // Highlighting current section in live preview
    function highlightPreviewSection(tabId) {
        const previewSec = document.getElementById(`preview-section-${tabId}`);
        if (previewSec) {
            // Remove previous highlight if still running
            document.querySelectorAll(".highlight-active-section").forEach(el => {
                el.classList.remove("highlight-active-section");
            });
            // Trigger animation
            previewSec.classList.add("highlight-active-section");
        }
    }

    // ==========================================
    // 7. KEYWORDS SUGGESTIONS & BADGES
    // ==========================================
    function updateKeywordsSuggestions() {
        const role = targetRole.value;
        let keywords = [];
        
        if (role === "custom") {
            keywords = customKeywords.value.split(",").map(k => k.trim().toLowerCase()).filter(Boolean);
        } else {
            keywords = roleKeywordsMap[role] || [];
        }
        
        recommendedKeywordsList.innerHTML = "";
        
        if (keywords.length === 0) {
            recommendedKeywordsList.innerHTML = `<span style="font-size: 0.8rem; color: var(--text-muted);">No keywords set. Select a preset role or enter custom keywords.</span>`;
            return;
        }

        const skillsVal = document.getElementById("skills").value.toLowerCase();
        const experienceVal = document.getElementById("experience").value.toLowerCase();
        const summaryVal = document.getElementById("summary").value.toLowerCase();
        const projectsVal = document.getElementById("projects").value.toLowerCase();
        
        const fullResumeText = `${skillsVal} ${experienceVal} ${summaryVal} ${projectsVal}`;

        keywords.forEach(kw => {
            const span = document.createElement("span");
            span.className = "keyword-badge";
            span.textContent = kw;
            
            // Check if keyword exists in any text of the resume
            const isMatched = fullResumeText.includes(kw.toLowerCase());
            if (isMatched) {
                span.classList.add("matched");
                span.textContent += " ✓";
            }
            
            // Click badge to automatically append it to skills field
            span.addEventListener("click", () => {
                const skillsInput = document.getElementById("skills");
                let currentVal = skillsInput.value.trim();
                
                if (currentVal) {
                    // Check if already in skills
                    const existing = currentVal.split(",").map(s => s.trim().toLowerCase());
                    if (!existing.includes(kw.toLowerCase())) {
                        skillsInput.value = `${currentVal}, ${kw}`;
                    }
                } else {
                    skillsInput.value = kw;
                }
                
                // Dispatch input event to refresh preview & analyzer score
                skillsInput.dispatchEvent(new Event("input"));
            });

            recommendedKeywordsList.appendChild(span);
        });
    }

    // ==========================================
    // 8. ATS RESUME ANALYZER ENGINE
    // ==========================================
    function runResumeAnalysis() {
        const v = {};
        inputs.forEach(id => {
            v[id] = document.getElementById(id).value.trim();
        });

        let score = 0;
        const checks = {
            personal: false,
            title: false,
            summary: false,
            experience: false,
            projects: false,
            education: false,
            skillsCount: 0,
            metrics: false,
            keywordMatch: 0
        };

        // 1. Personal & Contact (15% Max)
        if (v.name && v.email && v.phone && v.location) {
            score += 10;
            checks.personal = true;
        }
        if (v.website || v.linkedin || v.github) {
            score += 5; // extra links
        }

        // 2. Title (5% Max)
        if (v.title) {
            score += 5;
            checks.title = true;
        }

        // 3. Summary (15% Max)
        if (v.summary.length >= 80) {
            score += 15;
            checks.summary = true;
        } else if (v.summary.length > 0) {
            score += 5; // partially filled
        }

        // 4. Experience (20% Max)
        if (v.experience.length >= 150) {
            score += 20;
            checks.experience = true;
        } else if (v.experience.length > 0) {
            score += 8;
        }

        // 5. Projects (15% Max)
        if (v.projects.length >= 120) {
            score += 15;
            checks.projects = true;
        } else if (v.projects.length > 0) {
            score += 5;
        }

        // 6. Education (15% Max)
        if (v.education.length >= 40) {
            score += 15;
            checks.education = true;
        } else if (v.education.length > 0) {
            score += 8;
        }

        // 7. Skills & Keywords counts (15% Max)
        const skillsList = v.skills ? v.skills.split(",").map(s => s.trim().toLowerCase()).filter(Boolean) : [];
        checks.skillsCount = skillsList.length;
        if (skillsList.length >= 6) {
            score += 10;
        } else if (skillsList.length >= 3) {
            score += 5;
        }

        // 8. Role Keyword match (ATS scans)
        const role = targetRole.value;
        let roleKws = [];
        if (role === "custom") {
            roleKws = customKeywords.value.split(",").map(k => k.trim().toLowerCase()).filter(Boolean);
        } else {
            roleKws = roleKeywordsMap[role] || [];
        }

        if (roleKws.length > 0) {
            const textToScan = `${v.skills} ${v.summary} ${v.experience} ${v.projects}`.toLowerCase();
            let matchedCount = 0;
            roleKws.forEach(kw => {
                if (textToScan.includes(kw.toLowerCase())) {
                    matchedCount++;
                }
            });
            
            const matchPercentage = (matchedCount / roleKws.length) * 100;
            checks.keywordMatch = matchedCount;
            
            if (matchPercentage >= 50) {
                score += 5; // full keywords bonus
            } else if (matchPercentage >= 20) {
                score += 2;
            }
        }

        // 9. Measurable results / numbers check (quantifiable impact)
        // Regex checking for percentage decrease/increase, currency limits, metrics
        const metricsRegex = /\b\d+%|\$\d+|\b\d+\s*(?:years|employees|engineers|users|requests|hours|lines|percent|jobs|projects|months|clients|leads)\b/i;
        const textForMetrics = `${v.experience} ${v.projects}`;
        if (metricsRegex.test(textForMetrics)) {
            score += 5; // bonus points
            checks.metrics = true;
        }

        // Guarantee score stays between 0 and 100
        score = Math.min(Math.max(score, 0), 100);

        // Update UI displays
        updateATSScoreRing(score);
        updateStatusBadges(score, checks, v);
        renderATSChecklist(checks, v);
        renderATSSuggestions(checks, v, roleKws);
        updateSidebarStatusIndicators(checks, v);
    }

    function updateATSScoreRing(score) {
        atsScoreValue.textContent = score;
        reportScore.textContent = `${score}%`;
        atsNavBadge.textContent = `${score}%`;
        
        // Ring perimeter: radius is 25 in CSS, so 2 * PI * 25 = 157.08
        const perimeter = 157;
        const offset = perimeter - (score / 100) * perimeter;
        atsProgressCircle.style.strokeDashoffset = offset;
    }

    function updateSidebarStatusIndicators(checks, v) {
        const indicators = {
            personal: document.getElementById("status-personal"),
            summary: document.getElementById("status-summary"),
            experience: document.getElementById("status-experience"),
            projects: document.getElementById("status-projects"),
            education: document.getElementById("status-education"),
            skills: document.getElementById("status-skills")
        };

        // 1. Personal Info
        const personalCrucial = v.name && v.email && v.phone && v.location;
        const personalAny = v.name || v.email || v.phone || v.location || v.title || v.website || v.linkedin || v.github;
        setIndicatorState(indicators.personal, personalCrucial ? "complete" : (personalAny ? "partial" : "empty"));

        // 2. Summary
        const summaryLen = v.summary ? v.summary.length : 0;
        setIndicatorState(indicators.summary, summaryLen >= 100 ? "complete" : (summaryLen > 0 ? "partial" : "empty"));

        // 3. Experience
        const experienceLen = v.experience ? v.experience.length : 0;
        setIndicatorState(indicators.experience, experienceLen >= 150 ? "complete" : (experienceLen > 0 ? "partial" : "empty"));

        // 4. Projects
        const projectsLen = v.projects ? v.projects.length : 0;
        setIndicatorState(indicators.projects, projectsLen >= 120 ? "complete" : (projectsLen > 0 ? "partial" : "empty"));

        // 5. Education
        const educationLen = v.education ? v.education.length : 0;
        setIndicatorState(indicators.education, educationLen >= 40 ? "complete" : (educationLen > 0 ? "partial" : "empty"));

        // 6. Skills
        const skillsList = v.skills ? v.skills.split(",").map(s => s.trim()).filter(Boolean) : [];
        setIndicatorState(indicators.skills, skillsList.length >= 5 ? "complete" : (skillsList.length > 0 ? "partial" : "empty"));
    }

    function setIndicatorState(el, state) {
        if (!el) return;
        el.classList.remove("empty", "partial", "complete");
        el.classList.add(state);
    }

    function updateStatusBadges(score, checks, v) {
        // Readiness Badge
        const allCrucialDone = checks.personal && checks.summary && checks.experience && checks.education && checks.skillsCount >= 4;
        
        if (allCrucialDone) {
            readinessBadge.textContent = "ATS Ready";
            readinessBadge.className = "status-badge readiness ready";
            atsStatusBadge.textContent = "ATS Ready";
            atsStatusBadge.style.color = "var(--success)";
        } else {
            const missing = [];
            if (!checks.personal) missing.push("Contact");
            if (!checks.experience) missing.push("History");
            if (checks.skillsCount < 4) missing.push("Skills");
            
            readinessBadge.textContent = missing.length > 0 ? `Missing: ${missing.slice(0, 2).join(", ")}` : "Incomplete";
            readinessBadge.className = "status-badge readiness";
            atsStatusBadge.textContent = "Optimizing";
            atsStatusBadge.style.color = "var(--warning)";
        }

        // Strength Badge
        let strength = "Weak";
        let strengthClass = "weak";
        let badgeColor = "var(--danger)";
        
        if (score >= 80) {
            strength = "Strong";
            strengthClass = "strong";
            badgeColor = "var(--success)";
        } else if (score >= 45) {
            strength = "Moderate";
            strengthClass = "moderate";
            badgeColor = "var(--warning)";
        }

        strengthBadge.textContent = `Strength: ${strength}`;
        strengthBadge.className = `status-badge strength ${strengthClass}`;

        reportBadge.textContent = strength;
        reportBadge.className = `report-badge ${strengthClass}`;

        // Report description
        if (score >= 80) {
            reportDesc.textContent = "Excellent! Your resume is highly structured, rich with technical keywords, and features clear quantifiable details. It is fully optimized to pass ATS filters.";
        } else if (score >= 45) {
            reportDesc.textContent = "Good foundation. To reach 'Strong', try adding more technical keywords recommended for your role and quantify your outcomes with numbers.";
        } else {
            reportDesc.textContent = "Your resume is missing crucial sections or details. Follow the recommendations checklist below to boost your compatibility score.";
        }
    }

    function renderATSChecklist(checks, v) {
        const contactLinks = v.website || v.linkedin || v.github;
        
        const items = [
            { label: "Contact Details Completed", done: checks.personal },
            { label: "Online Profiles/Links", done: contactLinks },
            { label: "Professional Title Present", done: checks.title },
            { label: "Executive Profile Summary", done: checks.summary },
            { label: "Detailed Job History", done: checks.experience },
            { label: "Relevant Project Works", done: !!v.projects },
            { label: "Education History Filled", done: checks.education },
            { label: "At Least 5 Skills Added", done: checks.skillsCount >= 5 },
            { label: "Quantifiable Metrics & Data", done: checks.metrics },
            { label: "Role-Specific Keyword Match", done: checks.keywordMatch > 0 }
        ];

        atsChecklistItems.innerHTML = "";
        items.forEach(item => {
            const div = document.createElement("div");
            div.className = `check-item ${item.done ? "success" : "fail"}`;
            
            const iconSvg = item.done 
                ? `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>` 
                : `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

            div.innerHTML = `
                <span class="check-icon">${iconSvg}</span>
                <span class="check-label">${item.label}</span>
            `;
            atsChecklistItems.appendChild(div);
        });
    }

    function renderATSSuggestions(checks, v, roleKws) {
        const suggestions = [];

        // Critical issues first (Danger red)
        if (!checks.personal) {
            suggestions.push({
                type: "danger",
                text: "Add your full contact credentials (Name, Email, Phone, Location) in the Personal Info card."
            });
        }
        if (!checks.experience) {
            suggestions.push({
                type: "danger",
                text: "Work Experience is missing or too short. Provide details on past roles to demonstrate technical background."
            });
        }

        // Warnings (Amber orange)
        if (checks.skillsCount < 5) {
            suggestions.push({
                type: "warning",
                text: "Include at least 5 technical or soft skills. Check the recommended badges list for inspiration."
            });
        }
        if (!checks.metrics && (v.experience || v.projects)) {
            suggestions.push({
                type: "warning",
                text: "Add measurable numbers or metrics (e.g. 'boosted speeds by 40%', 'developed 3 apps') to experiences to prove impact."
            });
        }
        if (v.summary && v.summary.length < 100) {
            suggestions.push({
                type: "warning",
                text: "Your professional summary is a bit brief. Expand it to 100+ characters outlining your years of experience."
            });
        }

        // Informational tips (Blue info)
        const contactLinks = v.website || v.linkedin || v.github;
        if (!contactLinks) {
            suggestions.push({
                type: "info",
                text: "Include a link to LinkedIn or your personal website so recruiters can explore your portfolio."
            });
        }

        // Keyword matches report
        if (roleKws.length > 0 && checks.keywordMatch < 4) {
            const missingKws = [];
            const textToScan = `${v.skills} ${v.summary} ${v.experience} ${v.projects}`.toLowerCase();
            roleKws.forEach(kw => {
                if (!textToScan.includes(kw.toLowerCase())) {
                    missingKws.push(kw);
                }
            });

            if (missingKws.length > 0) {
                const sampleList = missingKws.slice(0, 4).join(", ");
                suggestions.push({
                    type: "info",
                    text: `Include targeted keywords in your skills or history: <strong>${sampleList}</strong>.`
                });
            }
        }

        atsSuggestionsList.innerHTML = "";
        
        if (suggestions.length === 0) {
            atsSuggestionsList.innerHTML = `
                <li class="suggestion-item info" style="background-color: var(--success-light); border-color: var(--success);">
                    <span class="suggestion-bullet" style="color: var(--success); display: flex; align-items: center;">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display: block;">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                    </span>
                    <span>All checks passed! Your resume structure and keyword density are excellently prepared.</span>
                </li>
            `;
            return;
        }

        suggestions.forEach(s => {
            const li = document.createElement("li");
            li.className = `suggestion-item ${s.type}`;
            
            let iconSvg = "";
            if (s.type === "danger") {
                iconSvg = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin-top: 3px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
            } else if (s.type === "warning") {
                iconSvg = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin-top: 3px;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
            } else {
                iconSvg = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin-top: 3px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
            }
            
            li.innerHTML = `
                <span class="suggestion-bullet">${iconSvg}</span>
                <span>${s.text}</span>
            `;
            atsSuggestionsList.appendChild(li);
        });
    }

    // ==========================================
    // 9. LOCAL STORAGE PERSISTENCE
    // ==========================================
    function saveToLocalStorage() {
        const data = {
            template: currentTemplate,
            role: targetRole.value,
            customKws: customKeywords.value
        };
        inputs.forEach(id => {
            data[id] = document.getElementById(id).value;
        });
        localStorage.setItem("resume_studio_data", JSON.stringify(data));
    }

    function loadFromLocalStorage() {
        const raw = localStorage.getItem("resume_studio_data");
        if (!raw) return;

        try {
            const data = JSON.parse(raw);
            
            // Set fields
            inputs.forEach(id => {
                if (data[id] !== undefined) {
                    const el = document.getElementById(id);
                    if (el) {
                        el.value = data[id];
                        // Trigger input event to update counters
                        const counter = document.getElementById(`${id}Count`);
                        if (counter) {
                            counter.textContent = `${el.value.length}/${el.maxLength}`;
                        }
                    }
                }
            });

            if (data.template) {
                currentTemplate = data.template;
                document.querySelectorAll(".tpl-btn").forEach(btn => {
                    if (btn.dataset.template === currentTemplate) {
                        btn.classList.add("active");
                    } else {
                        btn.classList.remove("active");
                    }
                });
                resumePreview.className = currentTemplate;
            }

            if (data.role) {
                targetRole.value = data.role;
                if (data.role === "custom") {
                    customKeywordsGroup.style.display = "block";
                }
            }

            if (data.customKws) {
                customKeywords.value = data.customKws;
            }

            updatePreview();
        } catch (e) {
            console.error("Local storage load failed", e);
        }
    }

    // Clear form callback
    clearFormBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear all resume fields? This action cannot be undone.")) {
            inputs.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.value = "";
                    const counter = document.getElementById(`${id}Count`);
                    if (counter) {
                        counter.textContent = `0/${el.maxLength}`;
                    }
                }
            });
            customKeywords.value = "";
            localStorage.removeItem("resume_studio_data");
            updateKeywordsSuggestions();
            updatePreview();
            runResumeAnalysis();
            switchTab("personal");
        }
    });

    // ==========================================
    // 10. DEMO DATA LOADER
    // ==========================================
    fillDemoBtn.addEventListener("click", () => {
        const demoData = {
            name: "Alex Morgan",
            title: "Senior Fullstack Engineer",
            email: "alex.morgan@techdev.io",
            phone: "+1 (512) 555-0199",
            location: "Austin, TX",
            website: "https://alexmorgan.dev",
            linkedin: "https://linkedin.com/in/alexmorgan",
            github: "https://github.com/alexmorgan",
            summary: "Full-stack engineer with 6 years of experience building web applications. I focus on clean front-end interfaces, solid API design, and keeping web apps fast and responsive. I love working with React, Node.js, and AWS, and I'm always looking for ways to simplify codebase architecture.",
            experience: "Lead Fullstack Developer | InnovateTech (2023 - Present)\n- Led the redesign of our primary customer dashboard using React, making it load twice as fast and improving our user engagement score.\n- Rebuilt our Express/Node backend APIs to handle database queries more efficiently, reducing server load during peak hours.\n- Automated our build and deployment process to AWS, giving the engineering team their time back.\n\nSoftware Engineer | DevStudio Inc. (2020 - 2023)\n- Developed responsive features for our collaborative planning tools, growing our active weekly user base to over 15k.\n- Wrote clean, documented GraphQL queries that reduced unnecessary data transmission by 40%.\n- Pair-programmed with designers to build and document our shared React component library.",
            projects: "CloudMetrics | React, Go, AWS (2025)\n- Built a light-weight cloud resource monitor that displays live usage charts.\n- Designed a custom data polling system that uses half the bandwidth of our previous REST setup.\n\nTaskSync Engine | Node.js, Socket.io (2024)\n- Programmed a real-time collaborative notepad, allowing multiple users to edit the same file without conflict.",
            education: "B.S. in Computer Science\nUniversity of Texas at Austin (2016 - 2020)\nGPA: 3.9 / 4.0 | Focus on software systems.",
            skills: "React, Node.js, JavaScript, TypeScript, AWS, SQL, Express, Git, REST API, UI/UX, Docker, HTML5, CSS Grid, GraphQL",
            targetRole: "fullstack",
            customKws: ""
        };

        // Populate fields
        inputs.forEach(id => {
            const el = document.getElementById(id);
            if (el && demoData[id] !== undefined) {
                el.value = demoData[id];
                // Dispatch input event to refresh count
                el.dispatchEvent(new Event("input"));
            }
        });

        targetRole.value = demoData.targetRole;
        customKeywordsGroup.style.display = "none";

        updateKeywordsSuggestions();
        updatePreview();
        runResumeAnalysis();
        saveToLocalStorage();
        
        // Jump to analyzer tab to show compatibility report
        switchTab("analyzer");
    });

    // ==========================================
    // 11. PDF DOWNLOAD & PRINT
    // ==========================================
    
    // Trigger native printing (Vector PDF)
    printBtn.addEventListener("click", () => {
        window.print();
    });

    // Trigger high-resolution jsPDF export (Image PDF)
    downloadBtn.addEventListener("click", async () => {
        // Toggle loader display
        pdfLoader.classList.add("active");
        pdfLoaderProgress.textContent = "Scanning layout components...";
        
        await new Promise(resolve => setTimeout(resolve, 600));

        pdfLoaderProgress.textContent = "Generating high-resolution canvas layers (this may take a moment)...";
        
        try {
            // Check if preview has placeholder
            if (resumePreview.querySelector(".placeholder-container") !== null) {
                alert("Please fill in some details before downloading.");
                pdfLoader.classList.remove("active");
                return;
            }

            // Temporarily remove animation highlight classes before drawing
            document.querySelectorAll(".highlight-active-section").forEach(el => {
                el.classList.remove("highlight-active-section");
            });

            // Disable transition & reset zoom to 1 so html2canvas renders native A4 layout correctly
            resumePreview.style.transition = "none";
            resumePreview.style.zoom = "1";

            // Capture A4 sheet with high-DPI scaling
            const canvas = await html2canvas(resumePreview, { 
                scale: 2.5, // improves resolution dramatically
                useCORS: true,
                backgroundColor: "#ffffff",
                windowWidth: 794, // Standard A4 width in pixels at 96 DPI
                windowHeight: 1123 // Standard A4 height in pixels at 96 DPI
            });
            
            pdfLoaderProgress.textContent = "Compiling document pages...";
            await new Promise(resolve => setTimeout(resolve, 400));
            
            const imgData = canvas.toDataURL("image/png");
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF("p", "mm", "a4");
            
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            
            // Calculate height in mm to preserve aspect ratio
            const imgHeight = (canvas.height * pageWidth) / canvas.width;
            
            let position = 0;
            let remainingHeight = imgHeight;
            
            // Render pages
            while (remainingHeight > 0) {
                pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
                remainingHeight -= pageHeight;
                position -= pageHeight;
                if (remainingHeight > 0) {
                    pdf.addPage();
                }
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

    // Auto-scale preview container on window resize
    function scaleResumePreview() {
        const container = document.querySelector(".preview-sheet-container");
        if (!container || !resumePreview) return;
        
        // Reset zoom first
        resumePreview.style.zoom = "";
        
        // Target A4 width is 794px
        const targetWidth = 794;
        
        // availableWidth = container width minus padding (1.5rem on left & right = 3rem = 48px)
        const availableWidth = container.clientWidth - 48;
        
        if (availableWidth > 0 && availableWidth < targetWidth) {
            const ratio = Math.max(0.1, availableWidth / targetWidth);
            resumePreview.style.zoom = ratio;
        } else {
            resumePreview.style.zoom = "1";
        }
    }

    // Call once to initialize
    scaleResumePreview();
    window.addEventListener("resize", scaleResumePreview);

    const sidebar = document.querySelector(".sidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");

    let overlay = document.querySelector(".sidebar-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.className = "sidebar-overlay";
        document.body.appendChild(overlay);
    }

    function toggleSidebar() {
        sidebar.classList.toggle("open");
        overlay.classList.toggle("active");
    }

    sidebarToggle.addEventListener("click", (e) => {
        e.preventDefault();
        toggleSidebar();
    });

    overlay.addEventListener("click", toggleSidebar);

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            if (window.innerWidth <= 1024) {
                toggleSidebar();
            }
        });
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initResumeStudio);
} else {
    initResumeStudio();
}