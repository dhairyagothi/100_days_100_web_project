

    document.addEventListener("DOMContentLoaded", () => {
    const themeSwitcher = document.getElementById("themeSwitcher");
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

    // Theme switcher
    themeSwitcher.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        themeSwitcher.textContent =
            document.body.classList.contains("dark") ? "☀️" : "🌙";
        const isDark = document.body.classList.contains("dark");
        document.getElementById("themeIcon").innerHTML = isDark ? "&#9728;" : "&#9790;";
        themeSwitcher.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    });

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

    // Build preview HTML
    function buildPreview() {
        const name       = document.getElementById("name").value;
        const email      = document.getElementById("email").value;
        const phone      = document.getElementById("phone").value;
        const education  = document.getElementById("education").value;
        const summary    = document.getElementById("summary").value;
        const projects   = document.getElementById("projects").value;
        const skills     = document.getElementById("skills").value;
        const experience = document.getElementById("experience").value;

        resumePreview.innerHTML = `
            <h3>${name}</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>

            <h4>Education</h4>
            <p>${education}</p>

            <h4>Summary</h4>
            <p>${summary}</p>

            <h4>Projects</h4>
            <p>${projects}</p>

            <h4>Skills</h4>
            <ul>
                ${skills
                    .split(",")
                    .map(skill => `<li>${skill.trim()}</li>`)
                    .join("")}
            </ul>

            <h4>Experience</h4>
            <p>${experience}</p>
        `;
    };

    // Validate form before preview/download
    const validateForm = () => {
    const fields = [
        {
            id: "name",
            message: "Please enter your name."
        },
        {
            id: "email",
            message: "Please enter a valid email address."
        },
        {
            id: "phone",
            message: "Please enter your phone number."
        },
        {
            id: "education",
            message: "Please enter your education details."
        },
        {
            id: "summary",
            message: "Please write a short summary."
        },
        {
            id: "projects",
            message: "Please add your projects."
        },
        {
            id: "skills",
            message: "Please enter your skills."
        },
        {
            id: "experience",
            message: "Please add your experience."
        }
    ];

    for (let field of fields) {
        const input = document.getElementById(field.id);

        if (!input.value.trim()) {

            // Custom alert message
            alert(field.message);

            // Smooth scroll to field
            input.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            // Focus field
            input.focus();

            // Add error effect
            input.classList.add("error");

            // Remove error class after typing
            input.addEventListener("input", () => {
                input.classList.remove("error");
            });

            return false;
        }

        // Email validation
        if (field.id === "email" && !input.checkValidity()) {
            alert("Please enter a valid email address.");
            input.focus();
            return false;
        }

        // Phone validation
        if (field.id === "phone" && !/^[0-9]{10}$/.test(input.value.trim())) {
            alert("Phone number must be 10 digits.");
            input.focus();
            return false;
        }
    }

    return true;
};

    // Live Preview Button
    previewBtn.addEventListener("click", () => {
        if (validateForm()) {
            updatePreview();
        }
    });

    // Download Button
    downloadBtn.addEventListener("click", () => {
        if (validateForm()) {
            updatePreview();
            window.print();
        }
        return `
            <h3>${name}</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <h4>Education</h4><p>${education}</p>
            <h4>Summary</h4><p>${summary}</p>
            <h4>Projects</h4><p>${projects}</p>
            <h4>Skills</h4>
            <ul>${skills.split(",").map(s => `<li>${s.trim()}</li>`).join("")}</ul>
            <h4>Experience</h4><p>${experience}</p>
        `;
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
});
    // Update live preview
//     const updatePreview = () => {
//         const name = document.getElementById("name").value;
//         const email = document.getElementById("email").value;
//         const phone = document.getElementById("phone").value;
//         const education = document.getElementById("education").value;
//         const summary = document.getElementById("summary").value;
//         const projects = document.getElementById("projects").value;
//         const skills = document.getElementById("skills").value;
//         const experience = document.getElementById("experience").value;

//         resumePreview.innerHTML = `
//             <h3>${name || "Your Name"}</h3>
//             <p><strong>Email:</strong> ${email || "your.email@example.com"}</p>
//             <p><strong>Phone:</strong> ${phone || "123-456-7890"}</p>
//             <h4>Education</h4>
//             <p>${education || "State your educational details."}</p>
//             <h4>Summary</h4>
//             <p>${summary || "Write a brief summary about yourself."}</p>
//             <h4>Projects</h4>
//             <p>${projects || "write about projects developed by you."}</p>
//             <h4>Skills</h4>
//             ${skills ? `<ul>${skills.split(",").map(skill => `<li>${skill.trim()}</li>`).join("")}</ul>` : "<p>No Skills added.</p>"}
//             <h4>Experience</h4>
//             <p>${experience || "Add your work experience here."}</p>
//         `;
//     };

//    previewBtn.addEventListener("click", updatePreview);

// // Download resume as PDF
// downloadBtn.addEventListener("click", () => {
//     updatePreview(); // ensure latest data is shown
//     window.print();
// });
// });
