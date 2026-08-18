// ===============================
// Resume Studio Pro Script
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    // ===============================
    // ELEMENTS
    // ===============================

    const form = document.getElementById("resumeForm");

    const nameInput = document.getElementById("name");
    const profilePhotoInput = document.getElementById("profilePhoto");
    const photoPreview = document.getElementById("photoPreview");
    const titleInput = document.getElementById("title");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const locationInput = document.getElementById("location");
    const educationInput = document.getElementById("education");
    const linkedinInput = document.getElementById("linkedin");
    const githubInput = document.getElementById("github");

    const summaryInput = document.getElementById("summary");
    const skillsInput = document.getElementById("skills");
    const experienceInput = document.getElementById("experience");
    const projectsInput = document.getElementById("projects");
    const sectionSelect = document.getElementById("selectionSelect");
    const addSectionBtn = document.getElementById("addSectionBtn");
    let sectionOrder = [
    "summary",
    "skills",
    "experience",
    "projects",
    "education"
];
    const dynamicSections = document.getElementById("dynamicSections");
    const resumePreview = document.getElementById("resumePreview");

    const atsScoreValue = document.getElementById("atsScoreValue");

    const fillDemoBtn = document.getElementById("fillDemoBtn");
    const clearFormBtn = document.getElementById("clearFormBtn");
    const printBtn = document.getElementById("printBtn");
    const downloadBtn = document.getElementById("downloadBtn");
    const themeSwitcher = document.getElementById("themeSwitcher");

    const templateButtons = document.querySelectorAll(".template");

    // ===============================
    // GLOBAL STATE
    // ===============================

    let currentTemplate = "modern";
    let profileImage = "";
    let additionalSections = [];
    // ===============================
    // SECURITY HELPER
    // ===============================

    function escapeHTML(text) {

        const div = document.createElement("div");

        div.textContent = text;

        return div.innerHTML;
    }

    // ===============================
    // HELPERS
    // ===============================

    function createBulletList(text) {

        const lines = text
            .split("\n")
            .map(line => line.trim())
            .filter(line => line !== "");

        if (lines.length === 0) {
            return "<p>Not provided</p>";
        }

        let html = "<ul>";

        lines.forEach(line => {

            const cleanLine = escapeHTML(
                line.replace(/^-/, "").trim()
            );

            if (cleanLine !== "") {
                html += `<li>${cleanLine}</li>`;
            }
        });

        html += "</ul>";

        return html;
    }

    function createSkills(text) {

        const skills = text
            .split(",")
            .map(skill => skill.trim())
            .filter(skill => skill !== "");

        if (skills.length === 0) {
            return "<p>No skills added</p>";
        }

        let html = `<div class="skills-grid">`;

        skills.forEach(skill => {

            html += `
                <span class="skill-tag">
                    ${escapeHTML(skill)}
                </span>
            `;
        });

        html += `</div>`;

        return html;
    }

    // ===============================
    // ATS SCORE
    // ===============================

    function updateATSScore() {

        let score = 0;

        if (nameInput.value.trim()) score += 10;
        if (titleInput.value.trim()) score += 10;
        if (emailInput.value.trim()) score += 10;
        if (phoneInput.value.trim()) score += 10;
        if (locationInput.value.trim()) score += 5;
        if (educationInput.value.trim()) score += 10;

        if (summaryInput.value.trim().length > 50) score += 15;

        const skills = skillsInput.value
            .split(",")
            .filter(skill => skill.trim() !== "");

        if (skills.length >= 5) score += 15;

        if (experienceInput.value.trim().length > 30) score += 10;
        if (projectsInput.value.trim().length > 30) score += 10;
        if (linkedinInput.value.trim()) score += 3;
        if (githubInput.value.trim()) score += 2;

        score = Math.min(score, 100);

        atsScoreValue.textContent = score;
    }

    // ===============================
    // TEMPLATE CLASSES
    // ===============================

    function applyTemplateClass() {

        resumePreview.classList.remove(
            "modern-template",
            "classic-template",
            "minimal-template"
        );

        resumePreview.classList.add(`${currentTemplate}-template`);
    }

    // ===============================
    // LIVE PREVIEW
    // ===============================

    function updatePreview() {

        applyTemplateClass();

        const name = escapeHTML(
            nameInput.value || "John Doe"
        );

        const title = escapeHTML(
            titleInput.value || "Frontend Developer"
        );

        const email = escapeHTML(
            emailInput.value || "john@example.com"
        );

        const phone = escapeHTML(
            phoneInput.value || "+91 9876543210"
        );

        const location = escapeHTML(
            locationInput.value || "Mumbai, India"
        );

        const education = escapeHTML(
            educationInput.value || "Your education details"
        );

        const linkedin = escapeHTML(
            linkedinInput.value || ""
        );

        const github = escapeHTML(
            githubInput.value || ""
        );

        const summary = escapeHTML(
            summaryInput.value ||
            "Professional summary will appear here."
        );

        // ===============================
        // RESUME HTML
        // ===============================
    const sections = {
        summary: `
            <div class="resume-section">
                <h3>Summary</h3>
                <p>${summary}</p>
            </div>
        `,
        skills: `
            <div class="resume-section">
                <h3>Skills</h3>
                ${createSkills(skillsInput.value)}
            </div>
        `,
        experience: `
            <div class="resume-section">
                <h3>Experience</h3>
                ${createBulletList(experienceInput.value)}
            </div>
        `,
        projects: `
            <div class="resume-section">
                <h3>Projects</h3>
                ${createBulletList(projectsInput.value)}
            </div>
        `,
        education: `
            <div class="resume-section">
                <h3>Education</h3>
                <p>${education}</p>
            </div>
        `
    };
        resumePreview.innerHTML = `
        
            <div class="resume-header">
                                <div class="header-row">

                            <div class="header-content">

                                <h1>${name}</h1>

                                <h2>${title}</h2>

                            </div>
                ${profileImage  ? `<img src="${profileImage}" class="resume-photo">`
                : ""
                }
                
            </div>


                <div class="resume-contact">

                    <span>${email}</span>
                    <span>${phone}</span>
                    <span>${location}</span>

                    ${
                        linkedin
                            ? `<span>${linkedin}</span>`
                            : ""
                    }

                    ${
                        github
                            ? `<span>${github}</span>`
                            : ""
                    }

                </div>

            </div>

            ${sectionOrder.map(section => sections[section]).join("")}
       ${additionalSections
.map((section) => `
    <div class="resume-section">
        <h3>${section.title}</h3>
        <p>${section.content || "Not provided"}</p>
    </div>
`)
.join("")}
    `;

    updateATSScore();
    }

    // ===============================
    // TEMPLATE SWITCHER
    // ===============================

    templateButtons.forEach(button => {

        button.addEventListener("click", () => {

            templateButtons.forEach(btn =>
                btn.classList.remove("active")
            );

            button.classList.add("active");

            currentTemplate = button.dataset.template;

            updatePreview();
        });
    });

    // ===============================
    // INPUT LIVE UPDATE
    // ===============================

    const allInputs = [
        nameInput,
        titleInput,
        emailInput,
        phoneInput,
        locationInput,
        educationInput,
        linkedinInput,
        githubInput,
        summaryInput,
        skillsInput,
        experienceInput,
        projectsInput
    ];

    allInputs.forEach(input => {

        input.addEventListener("input", updatePreview);
    });

    // ===============================
    // FILL DEMO DATA
    // ===============================

    fillDemoBtn.addEventListener("click", () => {

        nameInput.value = "Prem Dhakad";

        titleInput.value = "Frontend Developer";

        emailInput.value = "prem@example.com";

        phoneInput.value = "+91 9876543210";

        locationInput.value = "India";

        educationInput.value =
            "B.Tech in Artificial Intelligence & Data Science";

        linkedinInput.value =
            "linkedin.com/in/premdhakad";

        githubInput.value =
            "github.com/PremDhakad07";

        summaryInput.value =
            "Passionate frontend developer with strong skills in modern web development, UI/UX design, JavaScript, and React. Experienced in building responsive and professional applications.";

        skillsInput.value =
            "HTML, CSS, JavaScript, React, Node.js, Git, GitHub, Tailwind CSS";

        experienceInput.value =
            `- Built responsive web applications
- Contributed to open source projects
- Improved UI/UX for multiple projects`;

        projectsInput.value =
            `- Resume Studio Pro
- AI Story Generator
- Weather Dashboard
- Portfolio Website`;

        updatePreview();
    });

    // ===============================
    // CLEAR FORM
    // ===============================

    clearFormBtn.addEventListener("click", () => {

        form.reset();

        updatePreview();
    });

    // ===============================
    // THEME SWITCHER
    // ===============================

    themeSwitcher.addEventListener("click", () => {

        document.body.classList.toggle("light-mode");

        const isLight =
            document.body.classList.contains("light-mode");

        themeSwitcher.innerHTML = isLight
            ? "☀️ Light Mode"
            : "🌙 Dark Mode";
    });

    // ===============================
    // PRINT PDF
    // ===============================

    printBtn.addEventListener("click", () => {

        window.print();
    });

    // ===============================
    // DOWNLOAD PDF
    // ===============================

    downloadBtn.addEventListener("click", async () => {

        try {

            const canvas = await html2canvas(resumePreview, {
                scale: 2,
                useCORS: true
            });

            const imgData = canvas.toDataURL("image/png");

            const { jsPDF } = window.jspdf;

            const pdf = new jsPDF("p", "mm", "a4");

            const pageWidth =
                pdf.internal.pageSize.getWidth();

            const imgWidth = pageWidth;

            const imgHeight =
                (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(
                imgData,
                "PNG",
                0,
                0,
                imgWidth,
                imgHeight
            );

            pdf.save(
                `${(nameInput.value || "resume")
                    .replace(/\s+/g, "_")
                    .toLowerCase()}.pdf`
            );

        } catch (error) {

            console.error(error);

            alert("Failed to generate PDF.");
        }
    });
    profilePhotoInput.addEventListener("change", (e) => {
        const target=e.target.files[0];
        if(!target) return;
        const reader=new FileReader();
        reader.onload=function(){
            profileImage=reader.result;
            photoPreview.src=profileImage;
            photoPreview.style.display="block";
            updatePreview();
        }

        reader.readAsDataURL(target);
    })
    addSectionBtn.addEventListener("click",()=>{
        const title=sectionSelect.value;
        if(!title) return;
        if(additionalSections.find(section=>section.title===title)){
            alert("Section already added.");
            return;
        }
        additionalSections.push({ title, content: " " });

       renderAdditionalSections();
       updatePreview()
    })
    function renderAdditionalSections() {

    dynamicSections.innerHTML = "";

    additionalSections.forEach((section, index) => {

        const div = document.createElement("div");

        div.className = "form-group";

        div.innerHTML = `
            <label>${section.title}</label>

            <textarea
                rows="4"
                placeholder="Enter ${section.title}"
            ></textarea>
        `;

        const textarea = div.querySelector("textarea");

        textarea.addEventListener("input", (e) => {

            additionalSections[index].content = e.target.value;

            updatePreview();

        });

        dynamicSections.appendChild(div);

    });

}
function renderSectionOrder(){

    const container = document.getElementById("sectionOrderList");

    container.innerHTML = "";

    sectionOrder.forEach((section,index)=>{

        const item=document.createElement("div");

        item.className="section-order-item";

        item.draggable=true;

        item.dataset.index=index;

        item.textContent=section.charAt(0).toUpperCase()+section.slice(1);

        container.appendChild(item);

    });

}
renderSectionOrder();
updatePreview();
let dragIndex = null;

document.addEventListener("dragstart", (e) => {

    if (!e.target.classList.contains("section-order-item")) return;

    dragIndex = Number(e.target.dataset.index);

    e.target.classList.add("dragging");

});

document.addEventListener("dragover", (e) => {
    e.preventDefault();
});

document.addEventListener("drop", (e) => {

    const target = e.target.closest(".section-order-item");

    if (!target || dragIndex === null) return;

    const dropIndex = Number(target.dataset.index);

    if (dragIndex === dropIndex) return;

    const draggedItem = sectionOrder.splice(dragIndex, 1)[0];

    sectionOrder.splice(dropIndex, 0, draggedItem);

    dragIndex = null;

    renderSectionOrder();

    updatePreview();

});

document.addEventListener("dragend", (e) => {

    if (e.target.classList.contains("section-order-item")) {

        e.target.classList.remove("dragging");
    }

    dragIndex = null;

});
    // ===============================
    // INITIAL PREVIEW
    // ===============================

    updatePreview();

});
