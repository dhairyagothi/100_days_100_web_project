

    document.addEventListener("DOMContentLoaded", () => {
    const themeSwitcher = document.getElementById("themeSwitcher");
    const resumeForm = document.getElementById("resumeForm");
    const resumePreview = document.getElementById("resumePreview");
    const previewBtn = document.getElementById("previewBtn");
    const downloadBtn = document.getElementById("downloadBtn");

    // Toggle theme
    themeSwitcher.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        themeSwitcher.textContent =
            document.body.classList.contains("dark") ? "☀️" : "🌙";
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