document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("policyForm");
    const outputText = document.getElementById("outputText");
    const copyBtn = document.getElementById("copyBtn");
    const tabBtns = document.querySelectorAll(".tab-btn");

    let currentFormat = "markdown";
    let generatedMarkdown = "";
    let generatedHTML = "";

    init();

    function init() {
        bindFormSubmit();
        bindTabs();
        bindCopyButton();
        setOutput("");
    }

    function bindFormSubmit() {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const data = collectFormData();
            const policies = generatePolicies(data);
            generatedMarkdown = policies.markdown;
            generatedHTML = policies.html;
            currentFormat = "markdown";
            setActiveTab("markdown");
            renderOutput();
            copyBtn.disabled = false;
        });
    }

    function bindTabs() {
        tabBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                setActiveTab(btn.dataset.tab);
                currentFormat = btn.dataset.tab;
                renderOutput();
            });
        });
    }

    function bindCopyButton() {
        copyBtn.addEventListener("click", async () => {
            const text = outputText.value.trim();
            if (!text) return;

            const success = await copyToClipboard(text);
            const originalText = copyBtn.innerText;

            if (success) {
                copyBtn.innerText = "Copied!";
                setTimeout(() => {
                    copyBtn.innerText = originalText;
                }, 2000);
            } else {
                alert("Copy failed. Please try again or copy manually.");
            }
        });
    }

    function collectFormData() {
        return {
            appName: getValue("appName"),
            companyName: getValue("companyName"),
            contactEmail: getValue("contactEmail"),
            privacyUrl: getValue("privacyUrl"),
            lastUpdated: getValue("lastUpdated") || new Date().toISOString().split("T")[0],
            appWebsite: getValue("appWebsite"),
            collectsLocation: getChecked("dataLocation"),
            collectsCamera: getChecked("dataCamera"),
            collectsPersonal: getChecked("dataPersonal"),
            collectsAnalytics: getChecked("dataAnalytics"),
            collectsAds: getChecked("dataAds"),
            collectsPayments: getChecked("dataPayments"),
            collectsContacts: getChecked("dataContacts"),
            collectsFiles: getChecked("dataFiles"),
            usesCookies: getChecked("usesCookies"),
            usesThirdParty: getChecked("usesThirdParty"),
            hasAccounts: getChecked("hasAccounts"),
            hasDeletion: getChecked("hasDeletion"),
            hasRetention: getChecked("hasRetention"),
            hasChildren: getChecked("hasChildren"),
            hasSecurity: getChecked("hasSecurity"),
            hasRights: getChecked("hasRights")
        };
    }

    function getValue(id) {
        const el = document.getElementById(id);
        return el ? el.value.trim() : "";
    }

    function getChecked(id) {
        const el = document.getElementById(id);
        return el ? el.checked : false;
    }

    function generatePolicies(data) {
        const markdown = generateMarkdown(data);
        const html = generateHTML(data);
        return { markdown, html };
    }

    function generateMarkdown(data) {
        let md = `# Privacy Policy for ${data.appName}\n\n`;
        md += `**Last updated: ${data.lastUpdated}**\n\n`;
        md += `${data.companyName} ("we," "our," or "us") operates the ${data.appName} application. This Privacy Policy explains how we collect, use, and disclose information when you use our Service.\n\n`;

        if (data.appWebsite) {
            md += `**Website:** ${data.appWebsite}\n\n`;
        }

        if (data.privacyUrl) {
            md += `**Privacy Policy URL:** ${data.privacyUrl}\n\n`;
        }

        md += sectionMd("Information Collection and Use", "We collect several different types of information for various purposes to provide and improve our Service to you.");

        const dataTypes = [];
        if (data.collectsPersonal) dataTypes.push(["Personal Data", "While using our Service, we may ask you to provide personally identifiable information such as your name and email address."]);
        if (data.collectsLocation) dataTypes.push(["Location Data", "We may use and store location information if you give permission."]);
        if (data.collectsCamera) dataTypes.push(["Camera and Microphone Access", "Our application may require access to your device's camera and microphone for core features."]);
        if (data.collectsAnalytics) dataTypes.push(["Usage Data & Analytics", "We may collect information on how the Service is accessed and used to improve the platform."]);
        if (data.collectsPayments) dataTypes.push(["Payment Information", "If you make purchases, we may collect payment-related information processed by third-party payment providers."]);
        if (data.collectsContacts) dataTypes.push(["Contacts", "We may request access to your contacts to enable app functionality."]);
        if (data.collectsFiles) dataTypes.push(["Files / Media", "We may access files or media you upload to provide app features."]);

        if (dataTypes.length) {
            md += `### Types of Data Collected\n\n`;
            dataTypes.forEach(([title, body]) => {
                md += `**${title}**\n${body}\n\n`;
            });
        }

        if (data.usesCookies) {
            md += sectionMd("Cookies and Tracking", "We may use cookies, local storage, or similar tracking technologies to improve user experience and analyze usage.");
        }

        if (data.usesThirdParty || data.collectsAds) {
            md += sectionMd("Third-Party Services", "We may use third-party service providers for analytics, hosting, ads, or other functions. These services may have access to data as needed to perform their tasks.");
        }

        if (data.hasAccounts) {
            md += sectionMd("User Accounts", "If you create an account, you are responsible for maintaining the security of your login credentials.");
        }

        if (data.hasRetention) {
            md += sectionMd("Data Retention", "We retain personal data only as long as necessary to provide the Service and fulfill legal obligations.");
        }

        if (data.hasDeletion) {
            md += sectionMd("Account Deletion", "You may request deletion of your account and associated data by contacting us at the email below.");
        }

        if (data.hasChildren) {
            md += sectionMd("Children’s Privacy", "Our Service is not intended for children under 13, and we do not knowingly collect data from children without appropriate consent.");
        }

        if (data.hasSecurity) {
            md += sectionMd("Security", "We use reasonable administrative, technical, and physical safeguards to protect your data, but no method of transmission or storage is completely secure.");
        }

        if (data.hasRights) {
            md += sectionMd("Your Rights", "Depending on your location, you may have rights to access, correct, delete, or export your personal data, and to object to certain processing.");
        }

        md += sectionMd("Contact Us", `If you have any questions about this Privacy Policy, please contact us:\n\n* By email: ${data.contactEmail}`);

        return md;
    }

    function generateHTML(data) {
        let html = `<h1>Privacy Policy for ${data.appName}</h1>\n`;
        html += `<p><strong>Last updated: ${data.lastUpdated}</strong></p>\n`;
        html += `<p>${data.companyName} ("we," "our," or "us") operates the ${data.appName} application. This Privacy Policy explains how we collect, use, and disclose information when you use our Service.</p>\n`;

        if (data.appWebsite) {
            html += `<p><strong>Website:</strong> <a href="${data.appWebsite}" target="_blank" rel="noopener noreferrer">${data.appWebsite}</a></p>\n`;
        }

        if (data.privacyUrl) {
            html += `<p><strong>Privacy Policy URL:</strong> <a href="${data.privacyUrl}" target="_blank" rel="noopener noreferrer">${data.privacyUrl}</a></p>\n`;
        }

        html += sectionHtml("Information Collection and Use", "<p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>");

        const dataTypes = [];
        if (data.collectsPersonal) dataTypes.push(`<h4>Personal Data</h4><p>While using our Service, we may ask you to provide personally identifiable information such as your name and email address.</p>`);
        if (data.collectsLocation) dataTypes.push(`<h4>Location Data</h4><p>We may use and store location information if you give permission.</p>`);
        if (data.collectsCamera) dataTypes.push(`<h4>Camera and Microphone Access</h4><p>Our application may require access to your device's camera and microphone for core features.</p>`);
        if (data.collectsAnalytics) dataTypes.push(`<h4>Usage Data & Analytics</h4><p>We may collect information on how the Service is accessed and used to improve the platform.</p>`);
        if (data.collectsPayments) dataTypes.push(`<h4>Payment Information</h4><p>If you make purchases, we may collect payment-related information processed by third-party payment providers.</p>`);
        if (data.collectsContacts) dataTypes.push(`<h4>Contacts</h4><p>We may request access to your contacts to enable app functionality.</p>`);
        if (data.collectsFiles) dataTypes.push(`<h4>Files / Media</h4><p>We may access files or media you upload to provide app features.</p>`);

        if (dataTypes.length) {
            html += `<h3>Types of Data Collected</h3>\n${dataTypes.join("\n")}\n`;
        }

        if (data.usesCookies) {
            html += sectionHtml("Cookies and Tracking", "<p>We may use cookies, local storage, or similar tracking technologies to improve user experience and analyze usage.</p>");
        }

        if (data.usesThirdParty || data.collectsAds) {
            html += sectionHtml("Third-Party Services", "<p>We may use third-party service providers for analytics, hosting, ads, or other functions. These services may have access to data as needed to perform their tasks.</p>");
        }

        if (data.hasAccounts) {
            html += sectionHtml("User Accounts", "<p>If you create an account, you are responsible for maintaining the security of your login credentials.</p>");
        }

        if (data.hasRetention) {
            html += sectionHtml("Data Retention", "<p>We retain personal data only as long as necessary to provide the Service and fulfill legal obligations.</p>");
        }

        if (data.hasDeletion) {
            html += sectionHtml("Account Deletion", "<p>You may request deletion of your account and associated data by contacting us at the email below.</p>");
        }

        if (data.hasChildren) {
            html += sectionHtml("Children’s Privacy", "<p>Our Service is not intended for children under 13, and we do not knowingly collect data from children without appropriate consent.</p>");
        }

        if (data.hasSecurity) {
            html += sectionHtml("Security", "<p>We use reasonable administrative, technical, and physical safeguards to protect your data, but no method of transmission or storage is completely secure.</p>");
        }

        if (data.hasRights) {
            html += sectionHtml("Your Rights", "<p>Depending on your location, you may have rights to access, correct, delete, or export your personal data, and to object to certain processing.</p>");
        }

        html += sectionHtml("Contact Us", `<p>If you have any questions about this Privacy Policy, please contact us:</p><ul><li>By email: <a href="mailto:${data.contactEmail}">${data.contactEmail}</a></li></ul>`);

        return html;
    }

    function sectionMd(title, body) {
        return `## ${title}\n\n${body}\n\n`;
    }

    function sectionHtml(title, body) {
        return `<h2>${title}</h2>\n${body}\n`;
    }

    function renderOutput() {
        setOutput(currentFormat === "markdown" ? generatedMarkdown : generatedHTML);
    }

    function setOutput(value) {
        outputText.value = value || "Your generated policy will appear here...";
        copyBtn.disabled = !value;
    }

    function setActiveTab(tab) {
        tabBtns.forEach((btn) => btn.classList.toggle("active", btn.dataset.tab === tab));
    }

    async function copyToClipboard(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return true;
            }
            return fallbackCopy(text);
        } catch (err) {
            return fallbackCopy(text);
        }
    }

    function fallbackCopy(text) {
        try {
            const textarea = document.createElement("textarea");
            textarea.value = text;
            textarea.setAttribute("readonly", "");
            textarea.style.position = "fixed";
            textarea.style.left = "-9999px";
            textarea.style.top = "0";
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();

            const success = document.execCommand("copy");
            document.body.removeChild(textarea);
            return success;
        } catch (err) {
            console.error("Copy failed:", err);
            return false;
        }
    }
});