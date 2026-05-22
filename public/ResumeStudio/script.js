document.addEventListener("DOMContentLoaded", () => {
    const themeSwitcher = document.getElementById("themeSwitcher");
    const resumePreview = document.getElementById("resumePreview");
    const previewBtn    = document.getElementById("previewBtn");
    const downloadBtn   = document.getElementById("downloadBtn");
    const errorMsg      = document.getElementById("errorMsg");

    // Default template
    let currentTemplate = "modern";
    resumePreview.classList.add("modern");

    // Template switcher
    document.querySelectorAll(".tpl-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".tpl-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentTemplate = btn.dataset.template;
            resumePreview.className = currentTemplate;
            if (resumePreview.querySelector(".placeholder") === null) {
                resumePreview.innerHTML = buildPreview();
            }
        });
    });

    // Theme switcher
    themeSwitcher.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        const isDark = document.body.classList.contains("dark");
        document.getElementById("themeIcon").innerHTML = isDark ? "&#9728;" : "&#9790;";
        themeSwitcher.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    });

    // Char counters
    function attachCharCounter(inputId, countId) {
        const input = document.getElementById(inputId);
        const counter = document.getElementById(countId);
        input.addEventListener("input", () => {
            counter.textContent = `${input.value.length}/${input.maxLength}`;
            counter.style.color = input.value.length >= input.maxLength ? "red" : "";
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

    // Validation
    function validateFields() {
        const fields = ["name", "email", "phone", "education", "summary", "projects", "skills", "experience"];
        return fields.every(id => document.getElementById(id).value.trim());
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

    // Live Preview
    previewBtn.addEventListener("click", () => {
        if (!validateFields()) {
            errorMsg.style.display = "block";
            setTimeout(() => errorMsg.style.display = "none", 3000);
            return;
        }
        errorMsg.style.display = "none";
        resumePreview.className = currentTemplate;
        resumePreview.innerHTML = buildPreview();
    });

    // Download PDF
    downloadBtn.addEventListener("click", async () => {
        if (!validateFields()) {
            errorMsg.style.display = "block";
            setTimeout(() => errorMsg.style.display = "none", 3000);
            return;
        }
        errorMsg.style.display = "none";
        resumePreview.className = currentTemplate;
        resumePreview.innerHTML = buildPreview();

        downloadBtn.textContent = "Generating...";
        downloadBtn.disabled = true;

        try {
            const canvas = await html2canvas(resumePreview, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL("image/png");
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF("p", "mm", "a4");
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const imgHeight = (canvas.height * pageWidth) / canvas.width;
            let position = 0;
            let remaining = imgHeight;
            while (remaining > 0) {
                pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
                remaining -= pageHeight;
                position -= pageHeight;
                if (remaining > 0) pdf.addPage();
            }
            const name = document.getElementById("name").value.trim().replace(/\s+/g, "_");
            pdf.save(`${name}_resume.pdf`);
        } catch (err) {
            alert("PDF generation failed. Please try again.");
        }

        downloadBtn.textContent = "⬇ Download PDF";
        downloadBtn.disabled = false;
    });
});