

    document.addEventListener("DOMContentLoaded", () => {
    const themeSwitcher = document.getElementById("themeSwitcher");
    const resumePreview = document.getElementById("resumePreview");
    const previewBtn    = document.getElementById("previewBtn");
    const downloadBtn   = document.getElementById("downloadBtn");
    const errorMsg      = document.getElementById("errorMsg");
    themeSwitcher.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        themeSwitcher.textContent =
            document.body.classList.contains("dark") ? "☀️" : "🌙";
        const isDark = document.body.classList.contains("dark");
        document.getElementById("themeIcon").innerHTML = isDark ? "&#9728;" : "&#9790;";
        themeSwitcher.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    });
    function attachCharCounter(inputId, countId) {
        const input = document.getElementById(inputId);
        const counter = document.getElementById(countId);
        input.addEventListener("input", () => {
            counter.textContent = `${input.value.length}/${input.maxLength}`;
            if (input.value.length >= input.maxLength) {
                counter.style.color = "red";
            } else {
                counter.style.color = "";
            }
        });
    }
    attachCharCounter("name", "nameCount");
    attachCharCounter("email", "emailCount");
    attachCharCounter("phone", "phoneCount");
    attachCharCounter("education", "educationCount");
    attachCharCounter("summary", "summaryCount");
    attachCharCounter("projects", "projectsCount");
    attachCharCounter("skills", "skillsCount");
    attachCharCounter("experience", "experienceCount");
    function validateFields() {
        const fields = ["name", "email", "phone", "education", "summary", "projects", "skills", "experience"];
        for (const id of fields) {
            if (!document.getElementById(id).value.trim()) {
                return false;
            }
        }
        return true;
    }
    function buildPreview() {
        const name       = document.getElementById("name").value;
        const email      = document.getElementById("email").value;
        const phone      = document.getElementById("phone").value;
        const education  = document.getElementById("education").value;
        const summary    = document.getElementById("summary").value;
        const projects   = document.getElementById("projects").value;
        const skills     = document.getElementById("skills").value;
        const experience = document.getElementById("experience").value;
        return `
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
            <ul>${skills.split(",").map(s => `<li>${s.trim()}</li>`).join("")}</ul>
            <h4>Experience</h4>
            <p>${experience}</p>
        `;
    }
    previewBtn.addEventListener("click", () => {
        if (!validateFields()) {
            errorMsg.style.display = "block";
            setTimeout(() => errorMsg.style.display = "none", 3000);
            return;
        }
        errorMsg.style.display = "none";
        resumePreview.innerHTML = buildPreview();
    });
    downloadBtn.addEventListener("click", () => {
        if (!validateFields()) {
            errorMsg.style.display = "block";
            setTimeout(() => errorMsg.style.display = "none", 3000);
            return;
        }
        errorMsg.style.display = "none";
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Resume</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
                    h3   { font-size: 28px; margin-bottom: 4px; }
                    h4   { margin-top: 20px; color: #0077b6; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
                    ul   { padding-left: 20px; }
                    p    { margin: 4px 0; }
                </style>
            </head>
            <body>${buildPreview()}</body>
            </html>
        `);
        printWindow.document.close();
        setTimeout(() => {
            printWindow.focus();
            printWindow.print();
        }, 300);
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