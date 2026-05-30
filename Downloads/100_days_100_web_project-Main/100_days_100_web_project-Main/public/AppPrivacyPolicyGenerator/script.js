document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("policyForm");
    const outputText = document.getElementById("outputText");
    const copyBtn = document.getElementById("copyBtn");
    const tabBtns = document.querySelectorAll(".tab-btn");

    let currentFormat = "markdown";
    let generatedMarkdown = "";
    let generatedHTML = "";

    // Handle form submission
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Gather input data
        const data = {
            appName: document.getElementById("appName").value,
            companyName: document.getElementById("companyName").value,
            contactEmail: document.getElementById("contactEmail").value,
            date: new Date().toLocaleDateString(),
            collectsLocation: document.getElementById("dataLocation").checked,
            collectsCamera: document.getElementById("dataCamera").checked,
            collectsPersonal: document.getElementById("dataPersonal").checked,
            collectsAnalytics: document.getElementById("dataAnalytics").checked,
            collectsAds: document.getElementById("dataAds").checked,
        };

        generatePolicies(data);
        updateOutputDisplay();
        copyBtn.disabled = false;
    });

    // Handle Tab Switching
    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            tabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFormat = btn.dataset.tab;
            updateOutputDisplay();
        });
    });

    // Handle Copy to Clipboard
    copyBtn.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(outputText.value);
            const originalText = copyBtn.innerText;
            copyBtn.innerText = "Copied!";
            setTimeout(() => {
                copyBtn.innerText = originalText;
            }, 2000);
        } catch (err) {
            alert("Failed to copy text. Please try selecting and copying manually.");
        }
    });

    function updateOutputDisplay() {
        if (currentFormat === "markdown") {
            outputText.value = generatedMarkdown;
        } else {
            outputText.value = generatedHTML;
        }
    }

    function generatePolicies(data) {
        // Build Markdown
        let md = `# Privacy Policy for ${data.appName}\n\n`;
        md += `**Last updated: ${data.date}**\n\n`;
        md += `${data.companyName} ("we," "our," or "us") operates the ${data.appName} application. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.\n\n`;

        md += `## 1. Information Collection and Use\n\n`;
        md += `We collect several different types of information for various purposes to provide and improve our Service to you.\n\n`;

        if (data.collectsPersonal || data.collectsLocation || data.collectsCamera || data.collectsAnalytics) {
            md += `### Types of Data Collected\n\n`;

            if (data.collectsPersonal) {
                md += `**Personal Data**\nWhile using our Service, we may ask you to provide us with certain personally identifiable information, including your name and email address.\n\n`;
            }
            if (data.collectsLocation) {
                md += `**Location Data**\nWe may use and store information about your location if you give us permission to do so. We use this data to provide features of our Service and improve your experience.\n\n`;
            }
            if (data.collectsCamera) {
                md += `**Camera and Microphone Access**\nOur application may require access to your device's camera and microphone to enable core features. We do not record or store this media without your explicit consent.\n\n`;
            }
            if (data.collectsAnalytics) {
                md += `**Usage Data & Analytics**\nWe may collect information on how the Service is accessed and used to help us analyze and improve the platform.\n\n`;
            }
        }

        if (data.collectsAds) {
            md += `## 2. Third-Party Advertising\n\n`;
            md += `We may use third-party Service Providers to show advertisements to you to help support and maintain our Service. These providers may use cookies or similar tracking technologies.\n\n`;
        }

        md += `## 3. Contact Us\n\n`;
        md += `If you have any questions about this Privacy Policy, please contact us:\n`;
        md += `* By email: ${data.contactEmail}\n`;

        generatedMarkdown = md;

        // Build HTML
        let html = `<h1>Privacy Policy for ${data.appName}</h1>\n`;
        html += `<p><strong>Last updated: ${data.date}</strong></p>\n`;
        html += `<p>${data.companyName} ("we," "our," or "us") operates the ${data.appName} application. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.</p>\n`;

        html += `<h2>1. Information Collection and Use</h2>\n`;
        html += `<p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>\n`;

        if (data.collectsPersonal || data.collectsLocation || data.collectsCamera || data.collectsAnalytics) {
            html += `<h3>Types of Data Collected</h3>\n`;

            if (data.collectsPersonal) {
                html += `<h4>Personal Data</h4>\n<p>While using our Service, we may ask you to provide us with certain personally identifiable information, including your name and email address.</p>\n`;
            }
            if (data.collectsLocation) {
                html += `<h4>Location Data</h4>\n<p>We may use and store information about your location if you give us permission to do so. We use this data to provide features of our Service and improve your experience.</p>\n`;
            }
            if (data.collectsCamera) {
                html += `<h4>Camera and Microphone Access</h4>\n<p>Our application may require access to your device's camera and microphone to enable core features. We do not record or store this media without your explicit consent.</p>\n`;
            }
            if (data.collectsAnalytics) {
                html += `<h4>Usage Data & Analytics</h4>\n<p>We may collect information on how the Service is accessed and used to help us analyze and improve the platform.</p>\n`;
            }
        }

        if (data.collectsAds) {
            html += `<h2>2. Third-Party Advertising</h2>\n`;
            html += `<p>We may use third-party Service Providers to show advertisements to you to help support and maintain our Service. These providers may use cookies or similar tracking technologies.</p>\n`;
        }

        html += `<h2>3. Contact Us</h2>\n`;
        html += `<p>If you have any questions about this Privacy Policy, please contact us:</p>\n`;
        html += `<ul>\n<li>By email: <a href="mailto:${data.contactEmail}">${data.contactEmail}</a></li>\n</ul>\n`;

        generatedHTML = html;
    }
});