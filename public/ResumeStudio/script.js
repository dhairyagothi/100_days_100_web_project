// ==========================
// Resume Studio
// ==========================

document.addEventListener("DOMContentLoaded", () => {

    // FORM INPUTS
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const educationInput = document.getElementById("education");
    const summaryInput = document.getElementById("summary");
    const projectsInput = document.getElementById("projects");
    const skillsInput = document.getElementById("skills");
    const experienceInput = document.getElementById("experience");

    // BUTTONS
    const previewBtn = document.getElementById("previewBtn");
    const downloadBtn = document.getElementById("downloadBtn");
    const printBtn = document.getElementById("printBtn");
    const fillDemoBtn = document.getElementById("fillDemoBtn");
    const clearFormBtn = document.getElementById("clearFormBtn");
    const atsScoreValue = document.getElementById("atsScoreValue");

    // Must match the IDs in your HTML
    const inputs = [
        "name", "title", "email", "phone", "location", "linkedin", "github", 
        "summary", "experience", "projects", "education", "skills"
    ];

    let currentTemplate = "modern";

    // =========================
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
    // THEME SWITCHER
    // =========================
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

        const lines = text.split("\n");
        let html = "";
        let inList = false;

        lines.forEach(line => {
            const clean = line.trim();

            // Check if line starts with a dash or asterisk
            if (clean.startsWith("-") || clean.startsWith("*")) {
                if (!inList) {
                    html += "<ul>";
                    inList = true;
                }
                // Remove the dash/asterisk and trim
                html += `<li>${clean.substring(1).trim()}</li>`;
            } else {
                if (inList) {
                    html += "</ul>";
                    inList = false;
                }
                if (clean) html += `<p>${clean}</p>`;
            }
        });

        if (inList) {
            html += "</ul>";
        }

        return html;
    }

    function escapeHTML(str) {
        if (!str) return "";
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    
    // ==========================================
    // RENDER PREVIEW LAYOUT
    // ==========================================
    function updatePreview() {
        if (!resumePreview) return;

        const values = {};
        inputs.forEach(id => {
            values[id] = document.getElementById(id)?.value || "";
        });

        const skillsArr = values.skills
            ? values.skills.split(",").map(s => s.trim()).filter(Boolean)
            : [];

        // FIX: Ensure 'resume-sheet' class stays so the white background renders!
        resumePreview.className = "resume-sheet " + currentTemplate;

        // Inject the generated HTML
        resumePreview.innerHTML = `
            <div class="modern-header">
                <div class="modern-header-title">
                    <h1>${escapeHTML(values.name) || "Your Name"}</h1>
                    <p>${escapeHTML(values.title) || "Professional Role / Title"}</p>
                </div>
                <div class="modern-contact-info">
                    ${values.email ? `<span>${escapeHTML(values.email)}</span>` : ""}
                    ${values.phone ? `<span>${escapeHTML(values.phone)}</span>` : ""}
                    ${values.location ? `<span>${escapeHTML(values.location)}</span>` : ""}
                    ${values.linkedin ? `<span>${escapeHTML(values.linkedin.replace(/^https?:\/\/(www\.)?/, ""))}</span>` : ""}
                    ${values.github ? `<span>${escapeHTML(values.github.replace(/^https?:\/\/(www\.)?/, ""))}</span>` : ""}
                </div>
            </div>
            
            <div class="modern-layout">
                <div class="modern-main-col">
                    ${values.summary ? `
                        <div class="modern-section">
                            <h3>Profile Summary</h3>
                            <div class="modern-section-content"><p>${escapeHTML(values.summary)}</p></div>
                        </div>
                    ` : ""}
                    
                    ${values.experience ? `
                        <div class="modern-section">
                            <h3>Professional History</h3>
                            <div class="modern-section-content">${parseBulletPoints(values.experience)}</div>
                        </div>
                    ` : ""}
                    
                    ${values.projects ? `
                        <div class="modern-section">
                            <h3>Key Projects</h3>
                            <div class="modern-section-content">${parseBulletPoints(values.projects)}</div>
                        </div>
                    ` : ""}
                </div>
                
                <div class="modern-sidebar-col">
                    ${values.education ? `
                        <div class="modern-section">
                            <h3>Education</h3>
                            <div class="modern-section-content">${parseBulletPoints(values.education)}</div>
                        </div>
                    ` : ""}
                    
                    ${skillsArr.length > 0 ? `
                        <div class="modern-section">
                            <h3>Key Skills</h3>
                            <ul class="modern-skills-list">
                                ${skillsArr.map(s => `<li>${escapeHTML(s)}</li>`).join("")}
                            </ul>
                        </div>
                    ` : ""}
                </div>
            </div>
        `;
    }

    // =========================
    // ATS ANALYSIS (Simplified)
    // =========================
    function runResumeAnalysis() {
        let score = 0;

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

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", safeInit);
} else {
    safeInit();
}
