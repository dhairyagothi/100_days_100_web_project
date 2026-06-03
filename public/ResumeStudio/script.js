(function () {

    // =========================
    // ELEMENTS
    // =========================
    const resumePreview   = document.getElementById("resumePreview");
    const themeSwitcher   = document.getElementById("themeSwitcher");
    const downloadBtn     = document.getElementById("downloadBtn");
    const previewBtn      = document.getElementById("previewBtn");
    const templateBtns    = document.querySelectorAll(".template");
    const atsScoreEl      = document.getElementById("atsScore");

    const nameEl       = document.getElementById("name");
    const emailEl      = document.getElementById("email");
    const phoneEl      = document.getElementById("phone");
    const educationEl  = document.getElementById("education");
    const summaryEl    = document.getElementById("summary");
    const projectsEl   = document.getElementById("projects");
    const skillsEl     = document.getElementById("skills");
    const experienceEl = document.getElementById("experience");

    let currentTemplate = "modern";

    // =========================
    // DARK MODE
    // =========================
    themeSwitcher.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        themeSwitcher.textContent = document.body.classList.contains("dark")
            ? "☀️ Light Mode"
            : "🌙 Dark Mode";
    });

    // =========================
    // TEMPLATE BUTTONS
    // =========================
    templateBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            templateBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentTemplate = btn.textContent.trim().toLowerCase();
    // INIT
    // =========================
    loadFromLocalStorage();
    updatePreview();
    runResumeAnalysis();

    // =========================
    // TEMPLATE SWITCHER
    // =========================
    document.querySelectorAll(".template").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault(); // Prevent form submission
            document.querySelectorAll(".template").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            currentTemplate = btn.dataset.template || "modern";
            updatePreview();
            saveToLocalStorage();
        });
    });

    // =========================
    // LIVE PREVIEW BUTTON
    // =========================
    previewBtn.addEventListener("click", () => {
        updatePreview();
    });

    // =========================
    // AUTO-UPDATE ON INPUT
    // =========================
    [nameEl, emailEl, phoneEl, educationEl, summaryEl, projectsEl, skillsEl, experienceEl].forEach(el => {
        if (el) {
            el.addEventListener("input", () => {
                updatePreview();
                updateATSScore();
            });
        }
    });

    // =========================
    // HELPERS
    // =========================
    function val(el) {
        return el ? el.value.trim() : "";
    }

    function escapeHTML(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function parseBullets(text) {
        if (!text.trim()) return "";
        return text.split("\n").map(line => {
            const clean = line.trim();
            if (!clean) return "";
            if (clean.startsWith("-") || clean.startsWith("*")) {
                return `<li>${escapeHTML(clean.substring(1).trim())}</li>`;
            }
            return `<p>${escapeHTML(clean)}</p>`;
        }).join("");
    }
    if (themeSwitcher) {
        themeSwitcher.addEventListener("click", (e) => {
            e.preventDefault();
            document.body.classList.toggle("dark");
        });
    }

    // =========================
    // INPUT LISTENERS (Live Update)
    // =========================
    function debounce(fn, delay = 250) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn(...args), delay);
        };
    }

    inputs.forEach(id => {
        const inputEl = document.getElementById(id);
        
        if (inputEl) {
            inputEl.addEventListener("input", debounce(() => {
                updatePreview();
                runResumeAnalysis();
                saveToLocalStorage();
            }));
        }
    });

    // =========================
    // PARSE BULLETS
    // =========================
    function parseBulletPoints(text) {
        if (!text || !text.trim()) return "";

    function wrapBullets(text) {
        if (!text.trim()) return "";
        const lines = text.split("\n");
        let html = "";
        let inList = false;
        lines.forEach(line => {
            const clean = line.trim();
            if (!clean) return;
            if (clean.startsWith("-") || clean.startsWith("*")) {
                if (!inList) { html += "<ul>"; inList = true; }
                html += `<li>${escapeHTML(clean.substring(1).trim())}</li>`;
            } else {
                if (inList) { html += "</ul>"; inList = false; }
                html += `<p>${escapeHTML(clean)}</p>`;
            }
        });
        if (inList) html += "</ul>";
        return html;
    }

    // =========================
    // UPDATE PREVIEW
    // =========================
    function updatePreview() {
        const v = {
            name:       val(nameEl),
            email:      val(emailEl),
            phone:      val(phoneEl),
            education:  val(educationEl),
            summary:    val(summaryEl),
            projects:   val(projectsEl),
            skills:     val(skillsEl),
            experience: val(experienceEl),
        };

        if (currentTemplate === "modern") {
            renderModern(v);
        } else if (currentTemplate === "classic") {
            renderClassic(v);
        } else if (currentTemplate === "minimal") {
            renderMinimal(v);
        }

        updateATSScore();
    }

    // =========================
    // MODERN TEMPLATE
    // =========================
    function renderModern(v) {
        resumePreview.className = "resume-sheet modern-tpl";
        resumePreview.innerHTML = `
            <div class="resume-header" style="background:#1e293b;color:#fff;padding:24px 28px;border-radius:8px 8px 0 0;">
                <h1 style="margin:0;font-size:1.8rem;font-weight:700;">${escapeHTML(v.name || "Your Name")}</h1>
                <p style="margin:6px 0 0;opacity:0.85;font-size:0.95rem;">
                    ${[v.email, v.phone].filter(Boolean).map(escapeHTML).join(" | ")}
                </p>
            </div>
            <div style="display:flex;gap:0;">
                <div style="flex:2;padding:20px 24px;border-right:1px solid #e2e8f0;">
                    ${v.summary ? `
                        <div class="resume-section">
                            <h3>Summary</h3>
                            <p>${escapeHTML(v.summary)}</p>
                        </div>` : ""}
                    ${v.experience ? `
                        <div class="resume-section">
                            <h3>Experience</h3>
                            ${wrapBullets(v.experience)}
                        </div>` : ""}
                    ${v.projects ? `
                        <div class="resume-section">
                            <h3>Projects</h3>
                            ${wrapBullets(v.projects)}
                        </div>` : ""}
                </div>
                <div style="flex:1;padding:20px 18px;background:#f8fafc;">
                    ${v.education ? `
                        <div class="resume-section">
                            <h3>Education</h3>
                            <p>${escapeHTML(v.education)}</p>
                        </div>` : ""}
                    ${v.skills ? `
                        <div class="resume-section">
                            <h3>Skills</h3>
                            <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;">
                                ${v.skills.split(",").map(s => s.trim()).filter(Boolean).map(s =>
                                    `<span style="background:#1e293b;color:#fff;padding:3px 10px;border-radius:12px;font-size:0.78rem;">${escapeHTML(s)}</span>`
                                ).join("")}
                            </div>
                        </div>` : ""}
                </div>
            </div>
        `;
    }

    // =========================
    // CLASSIC TEMPLATE
    // =========================
    function renderClassic(v) {
        resumePreview.className = "resume-sheet classic-tpl";
        resumePreview.innerHTML = `
            <div class="resume-header" style="text-align:center;border-bottom:2px solid #1e293b;padding-bottom:14px;margin-bottom:14px;">
                <h1 style="margin:0;font-size:1.7rem;letter-spacing:1px;text-transform:uppercase;">${escapeHTML(v.name || "Your Name")}</h1>
                <p style="margin:6px 0 0;font-size:0.88rem;color:#555;">
                    ${[v.email, v.phone].filter(Boolean).map(escapeHTML).join("  •  ")}
                </p>
            </div>
            ${v.summary ? `
                <div class="resume-section">
                    <h3 style="text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #cbd5e1;padding-bottom:4px;">Summary</h3>
                    <p>${escapeHTML(v.summary)}</p>
                </div>` : ""}
            ${v.experience ? `
                <div class="resume-section">
                    <h3 style="text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #cbd5e1;padding-bottom:4px;">Experience</h3>
                    ${wrapBullets(v.experience)}
                </div>` : ""}
            ${v.projects ? `
                <div class="resume-section">
                    <h3 style="text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #cbd5e1;padding-bottom:4px;">Projects</h3>
                    ${wrapBullets(v.projects)}
                </div>` : ""}
            ${v.education ? `
                <div class="resume-section">
                    <h3 style="text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #cbd5e1;padding-bottom:4px;">Education</h3>
                    <p>${escapeHTML(v.education)}</p>
                </div>` : ""}
            ${v.skills ? `
                <div class="resume-section">
                    <h3 style="text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #cbd5e1;padding-bottom:4px;">Skills</h3>
                    <p>${escapeHTML(v.skills)}</p>
                </div>` : ""}
        `;
    }

    // =========================
    // MINIMAL TEMPLATE
    // =========================
    function renderMinimal(v) {
        resumePreview.className = "resume-sheet minimal-tpl";
        resumePreview.innerHTML = `
            <div class="resume-header" style="padding-bottom:12px;margin-bottom:12px;">
                <h1 style="margin:0;font-size:1.6rem;font-weight:600;">${escapeHTML(v.name || "Your Name")}</h1>
                <p style="margin:4px 0 0;font-size:0.85rem;color:#64748b;">
                    ${[v.email, v.phone].filter(Boolean).map(escapeHTML).join(" · ")}
                </p>
            </div>
            ${v.summary ? `
                <div class="resume-section">
                    <h3 style="font-size:0.7rem;text-transform:uppercase;letter-spacing:2px;color:#94a3b8;margin-bottom:4px;">About</h3>
                    <p>${escapeHTML(v.summary)}</p>
                </div>` : ""}
            ${v.experience ? `
                <div class="resume-section">
                    <h3 style="font-size:0.7rem;text-transform:uppercase;letter-spacing:2px;color:#94a3b8;margin-bottom:4px;">Experience</h3>
                    ${wrapBullets(v.experience)}
                </div>` : ""}
            ${v.projects ? `
                <div class="resume-section">
                    <h3 style="font-size:0.7rem;text-transform:uppercase;letter-spacing:2px;color:#94a3b8;margin-bottom:4px;">Projects</h3>
                    ${wrapBullets(v.projects)}
                </div>` : ""}
            ${v.education ? `
                <div class="resume-section">
                    <h3 style="font-size:0.7rem;text-transform:uppercase;letter-spacing:2px;color:#94a3b8;margin-bottom:4px;">Education</h3>
                    <p>${escapeHTML(v.education)}</p>
                </div>` : ""}
            ${v.skills ? `
                <div class="resume-section">
                    <h3 style="font-size:0.7rem;text-transform:uppercase;letter-spacing:2px;color:#94a3b8;margin-bottom:4px;">Skills</h3>
                    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:4px;">
                        ${v.skills.split(",").map(s => s.trim()).filter(Boolean).map(s =>
                            `<span style="border:1px solid #cbd5e1;padding:2px 10px;border-radius:20px;font-size:0.78rem;color:#475569;">${escapeHTML(s)}</span>`
                        ).join("")}
                    </div>
                </div>` : ""}
        `;
    }

    // =========================
    // ATS SCORE
    // =========================
    function updateATSScore() {
        let score = 0;
        const summary    = val(summaryEl);
        const skills     = val(skillsEl);
        const experience = val(experienceEl);
        const name       = val(nameEl);
        const email      = val(emailEl);

        if (name)                          score += 10;
        if (email)                         score += 10;
        if (summary.length > 80)           score += 25;
        if (skills.split(",").length >= 4) score += 25;
        if (experience.length > 80)        score += 30;

        if (score > 100) score = 100;

        if (atsScoreEl) atsScoreEl.textContent = score + "%";
    }

    // =========================
    // DOWNLOAD PDF
    // =========================
    downloadBtn.addEventListener("click", async () => {
        downloadBtn.textContent = "Generating...";
        downloadBtn.disabled = true;

        try {
            const canvas = await html2canvas(resumePreview, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL("image/png");
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF("p", "mm", "a4");
            const pageWidth  = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const imgHeight  = (canvas.height * pageWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position   = 0;

            pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            const fileName = (val(nameEl) || "resume").toLowerCase().replace(/\s+/g, "_");
            pdf.save(`${fileName}_resume.pdf`);
        } catch (err) {
            console.error(err);
            alert("PDF generation failed. Try the browser Print option (Ctrl+P) as an alternative.");
        } finally {
            downloadBtn.textContent = "Download PDF";
            downloadBtn.disabled = false;
        }
    });

    // =========================
    // INIT
    // =========================
    updateATSScore();

        const summary = document.getElementById("summary")?.value || "";
        const skills = document.getElementById("skills")?.value || "";
        const experience = document.getElementById("experience")?.value || "";

        // Give points based on content length/presence
        if (summary.length > 20) score += 30;
        if (skills.split(",").length >= 3) score += 30;
        if (experience.length > 30) score += 40;

        if (score > 100) score = 100;

        // Update the UI
        if (atsScoreValue) atsScoreValue.textContent = score;
    }

    // =========================
    // LOCAL STORAGE
    // =========================
    function saveToLocalStorage() {
        const data = {};
        inputs.forEach(id => {
            data[id] = document.getElementById(id)?.value || "";
        });

        data.template = currentTemplate;
        localStorage.setItem("resume_studio_data", JSON.stringify(data));
    }

    function loadFromLocalStorage() {
        const raw = localStorage.getItem("resume_studio_data");
        if (!raw) return;

        try {
            const data = JSON.parse(raw);
            
            // Restore inputs
            inputs.forEach(id => {
                const el = document.getElementById(id);
                if (el && data[id]) el.value = data[id];
            });

            // Restore template
            if (data.template) {
                currentTemplate = data.template;
                document.querySelectorAll(".template").forEach(b => {
                    b.classList.toggle("active", b.dataset.template === currentTemplate);
                });
            }
        } catch (e) {
            console.error("Error parsing local storage data", e);
        }
    }

    // =========================
    // CLEAR FORM
    // =========================
    if (clearFormBtn) {
        clearFormBtn.addEventListener("click", () => {
            inputs.forEach(id => {
                const el = document.getElementById(id);
                if(el) el.value = "";
            });
            
            localStorage.removeItem("resume_studio_data");
            updatePreview();
            runResumeAnalysis();
        });
    }

    // =========================
    // DEMO DATA
    // =========================
    if (fillDemoBtn) {
        fillDemoBtn.addEventListener("click", () => {
            const demoData = {
                name: "Shivam Kumar Jha",
                title: "Software Engineer",
                email: "skjha3439@gmail.com",
                phone: "+91 9876543210",
                location: "India",
                linkedin: "linkedin.com/in/shivam",
                github: "github.com/shivam",
                summary: "Passionate developer with a strong focus on building logic-based problem solving and robust web applications.",
                experience: "- Developer at XYZ\n- Built scalable systems and debugged complex logic.",
                projects: "- Smart Library Web Portal\n- Zero-Shot Object Detection using Grounding DINO",
                education: "B.Tech in Computer Science",
                skills: "C++, JavaScript, Web Development, Data Structures"
            };

            for (const [key, value] of Object.entries(demoData)) {
                const el = document.getElementById(key);
                if (el) el.value = value;
            }

            updatePreview();
            runResumeAnalysis();
            saveToLocalStorage();
        });
    }

    // =========================
    // PRINT NATIVE
    // =========================
    if (printBtn) {
        printBtn.addEventListener("click", (e) => {
            e.preventDefault();
            window.print();
        });
    }

    // =========================
    // DOWNLOAD (jsPDF)
    // =========================
    if (downloadBtn) {
        downloadBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            
            try {
                if (typeof html2canvas === 'undefined' || typeof window.jspdf === 'undefined') {
                    throw new Error("PDF libraries not loaded. Check your internet connection.");
                }

                // Temporarily remove shadow for clean capture
                const originalShadow = resumePreview.style.boxShadow;
                resumePreview.style.boxShadow = "none";

                const canvas = await html2canvas(resumePreview, { scale: 2, useCORS: true });
                const imgData = canvas.toDataURL("image/png");

                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF("p", "mm", "a4");
                
                const imgWidth = 210; // A4 width in mm
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                
                pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
                
                const userNameEl = document.getElementById("name");
                const userName = userNameEl && userNameEl.value.trim() ? userNameEl.value.trim() : "My";
                const formattedName = userName.toLowerCase().replace(/\s+/g, "_");
                
                pdf.save(`${formattedName}_resume.pdf`);

                // Restore shadow
                resumePreview.style.boxShadow = originalShadow;

            } catch (err) {
                console.error(err);
                alert("Image PDF rendering failed. Use the 'Print / Save as PDF' button instead.");
            }
        });
    }
}

// Ensure safe initialization
let resumeStudioInitialized = false;
function safeInit() {
    if (resumeStudioInitialized) return;
    resumeStudioInitialized = true;
    initResumeStudio();
}

})();
