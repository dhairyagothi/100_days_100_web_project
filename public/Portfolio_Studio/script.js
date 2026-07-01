const previewFrame = document.getElementById('preview-frame');
const downloadBtn = document.getElementById('download-btn');
const addProjectBtn = document.getElementById('add-project-btn');
const projectsFormContainer = document.getElementById('projects-form-container');
const themeSelect = document.getElementById('input-theme');

// Target baseline mock model array matrix
let projectDataList = [
    { 
        title: "100 Days 100 Web Project", 
        tech: "HTML5, CSS3, ES6 JavaScript", 
        desc: "A massive interactive ecosystem built to test advanced interface design logic layouts." 
    },
    { 
        title: "Samvidhan Path Platform", 
        tech: "React, Tailwind, Next.js, Framer Motion", 
        desc: "Immersive open-source dynamic interface navigating structural documentation trees." 
    }
];

const baseFields = ['input-name', 'input-title', 'input-bio', 'input-email', 'input-phrases'];

/**
 * Boots the master configuration settings, binds input event trackers 
 * and refreshes the sandbox preview DOM frame.
 */
function initializeApp() {
    baseFields.forEach(id => {
        document.getElementById(id).addEventListener('input', updateLivePreview);
    });
    themeSelect.addEventListener('change', updateLivePreview);
    addProjectBtn.addEventListener('click', addNewProjectRow);

    initProjectFormDelegation();
    renderProjectForms();
    updateLivePreview();
}

/**
 * Parses the model list objects to paint editable row boxes 
 * directly into the sidebar options view panel.
 */
function renderProjectForms() {
    projectsFormContainer.innerHTML = '';
    
    projectDataList.forEach((proj, idx) => {
        const box = document.createElement('div');
        box.classList.add('dynamic-project-box');

        // 1. Create Title Input Group
        const titleGroup = document.createElement('div');
        titleGroup.classList.add('input-group');
        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.value = proj.title; // ✅ Secure: Treated strictly as a text value
        titleInput.placeholder = 'Project Name';
        titleInput.setAttribute('data-idx', idx);
        titleInput.setAttribute('data-field', 'title');
        titleInput.classList.add('proj-input');
        titleGroup.appendChild(titleInput);

        // 2. Create Tech Input Group
        const techGroup = document.createElement('div');
        techGroup.classList.add('input-group');
        const techInput = document.createElement('input');
        techInput.type = 'text';
        techInput.value = proj.tech;  // ✅ Secure
        techInput.placeholder = 'Languages / Engines Used';
        techInput.setAttribute('data-idx', idx);
        techInput.setAttribute('data-field', 'tech');
        techInput.classList.add('proj-input');
        techGroup.appendChild(techInput);

        // 3. Create Description Input Group
        const descGroup = document.createElement('div');
        descGroup.classList.add('input-group');
        const descInput = document.createElement('input');
        descInput.type = 'text';
        descInput.value = proj.desc;  // ✅ Secure
        descInput.placeholder = 'Project Summary';
        descInput.setAttribute('data-idx', idx);
        descInput.setAttribute('data-field', 'desc');
        descInput.classList.add('proj-input');
        descGroup.appendChild(descInput);

        // 4. Create Delete Button
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('btn-delete');
        deleteBtn.setAttribute('data-idx', idx);
        deleteBtn.textContent = 'Remove Element 🗑'; // ✅ Secure text property

        // Assemble the box structure
        box.appendChild(titleGroup);
        box.appendChild(techGroup);
        box.appendChild(descGroup);
        box.appendChild(deleteBtn);

        // Append to container
        projectsFormContainer.appendChild(box);
    });
}
function initProjectFormDelegation() {
    projectsFormContainer.addEventListener('input', (e) => {
        const input = e.target.closest('.proj-input');
        if (!input) return;

        const idx = input.dataset.idx;
        const field = input.dataset.field;
        projectDataList[idx][field] = input.value;
        updateLivePreview();
    });

    projectsFormContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-delete');
        if (!btn) return;

        const idx = parseInt(btn.dataset.idx, 10);
        projectDataList.splice(idx, 1);
        renderProjectForms();
        updateLivePreview();
    });
}

/**
 * Appends a fresh element object to the stack 
 * and refreshes control element layouts.
 */
function addNewProjectRow() {
    projectDataList.push({ 
        title: "Custom Application Build", 
        tech: "Vue.js, WebSockets, Node", 
        desc: "Operational microservice metrics suite processing payload operations in real-time." 
    });
    renderProjectForms();
    updateLivePreview();
}

/**
 * Re-injects compiled document elements cleanly back into the 
 * active isolated sandbox Iframe viewer viewport.
 */
function updateLivePreview() {
    const code = compilePortfolioHTML(); // Defined inside template.js
    const doc = previewFrame.contentDocument || previewFrame.contentWindow.document;
    doc.open();
    doc.write(code);
    doc.close();
}

// Attach export blob streaming trigger
downloadBtn.addEventListener('click', () => {
    const data = compilePortfolioHTML();
    const blob = new Blob([data], { type: 'text/html' });
    const link = document.createElement('a');
    
    link.download = 'animated_portfolio.html';
    link.href = window.URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Run framework bootstrap configuration lifecycle initialization
initializeApp();
