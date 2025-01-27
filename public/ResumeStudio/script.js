document.addEventListener("DOMContentLoaded", () => {
    const themeSwitcher = document.getElementById("themeSwitcher");
    const resumeForm = document.getElementById("resumeForm");
    const resumePreview = document.getElementById("resumePreview");
    const previewBtn = document.getElementById("previewBtn");
    const downloadBtn = document.getElementById("downloadBtn");

    // Toggle theme
    themeSwitcher.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        themeSwitcher.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
    });

    // Update live preview
    const updatePreview = () => {
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const education = document.getElementById("education").value;
        const summary = document.getElementById("summary").value;
        const projects = document.getElementById("projects").value;
        const skills = document.getElementById("skills").value;
        const experience = document.getElementById("experience").value;

        resumePreview.innerHTML = `
            <h3>${name || "Your Name"}</h3>
            <p><strong>Email:</strong> ${email || "your.email@example.com"}</p>
            <p><strong>Phone:</strong> ${phone || "123-456-7890"}</p>
            <h4>Education</h4>
            <p>${education || "State your educational details."}</p>
            <h4>Summary</h4>
            <p>${summary || "Write a brief summary about yourself."}</p>
            <h4>Projects</h4>
            <p>${projects || "write about projects developed by you."}</p>
            <h4>Skills</h4>
            ${skills ? `<ul>${skills.split(",").map(skill => `<li>${skill.trim()}</li>`).join("")}</ul>` : "<p>No Skills added.</p>"}
            <h4>Experience</h4>
            <p>${experience || "Add your work experience here."}</p>
        `;
    };

    previewBtn.addEventListener("click", updatePreview);

    // Download resume as PDF
    downloadBtn.addEventListener("click", () => {
        const element = document.createElement("a");
        const content = resumePreview.innerHTML;
        const blob = new Blob([content], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        element.href = url;
        element.download = "resume.html";
        element.click();
        URL.revokeObjectURL(url);
    });
});