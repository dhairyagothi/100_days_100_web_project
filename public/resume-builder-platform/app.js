/**
 * Core Application Logic for Resume Builder Platform
 */

// Default structure for new resume data
const defaultResumeData = {
  personal: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    website: "",
    linkedin: "",
    github: "",
    location: "",
    summary: ""
  },
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
  achievements: [],
  sectionOrder: ["personal", "summary", "experience", "education", "projects", "skills", "certifications", "achievements"]
};

// Global App State
let resumeData = JSON.parse(localStorage.getItem('cute_resume_data')) || { ...defaultResumeData };
let zoomLevel = 1.0;
let activeTemplate = 'classic'; // classic, modern, creative, executive
let activeFont = 'Inter'; // Inter, Outfit, Merriweather
let primaryColor = '#2563eb'; // Default royal blue
let secondaryColor = '#475569';
let fontSize = 10; // pt
let lineHeight = 1.5;
let marginTop = 15; // mm
let marginBottom = 15;
let marginLeft = 15;
let marginRight = 15;

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  // Load saved builder settings if available
  const savedSettings = JSON.parse(localStorage.getItem('cute_resume_settings'));
  if (savedSettings) {
    activeTemplate = savedSettings.activeTemplate || activeTemplate;
    activeFont = savedSettings.activeFont || activeFont;
    primaryColor = savedSettings.primaryColor || primaryColor;
    fontSize = savedSettings.fontSize || fontSize;
    lineHeight = savedSettings.lineHeight || lineHeight;
    marginTop = savedSettings.marginTop || marginTop;
    marginBottom = savedSettings.marginBottom || marginBottom;
    marginLeft = savedSettings.marginLeft || marginLeft;
    marginRight = savedSettings.marginRight || marginRight;
    
    // Select elements in DOM and set their value
    document.getElementById('template-select').value = activeTemplate;
    document.getElementById('font-select').value = activeFont;
    document.getElementById('font-size-slider').value = fontSize;
    document.getElementById('line-height-slider').value = lineHeight;
    document.getElementById('margin-top-slider').value = marginTop;
    document.getElementById('margin-bottom-slider').value = marginBottom;
    document.getElementById('margin-left-slider').value = marginLeft;
    document.getElementById('margin-right-slider').value = marginRight;
  }

  // Populate color swatches
  setupColorSwatches();

  // Setup basic event listeners
  setupThemeToggle();
  setupFormEventListeners();
  setupSettingsEventListeners();
  setupListAddButtons();
  setupFileOperations();
  setupDragAndDrop();
  setupGitHubImporter();
  setupToolsDrawer();

  // If local storage is empty, load sample data as a starting point
  if (!resumeData.personal || !resumeData.personal.fullName) {
    if (window.sampleResumeData) {
      resumeData = JSON.parse(JSON.stringify(window.sampleResumeData));
    }
  }

  // Initial Sync & Renders
  syncDataToForms();
  renderAllDynamicFormLists();
  updateCustomizerVariables();
  renderPreview();
}

/* ==========================================================================
   COLOR PRESENTS & SWATCHES SETUP
   ========================================================================== */
const colorThemes = [
  { primary: '#2563eb', secondary: '#475569', name: 'Royal Blue' },
  { primary: '#10b981', secondary: '#4b5563', name: 'Emerald' },
  { primary: '#6366f1', secondary: '#475569', name: 'Indigo' },
  { primary: '#0f172a', secondary: '#64748b', name: 'Charcoal' },
  { primary: '#e11d48', secondary: '#4b5563', name: 'Rose' },
  { primary: '#d97706', secondary: '#4b5563', name: 'Amber' },
  { primary: '#0d9488', secondary: '#4b5563', name: 'Teal' }
];

function setupColorSwatches() {
  const container = document.getElementById('color-swatches');
  if (!container) return;
  container.innerHTML = '';

  colorThemes.forEach(theme => {
    const swatch = document.createElement('div');
    swatch.className = `color-swatch ${theme.primary === primaryColor ? 'active' : ''}`;
    swatch.style.backgroundColor = theme.primary;
    swatch.title = theme.name;
    swatch.addEventListener('click', () => {
      primaryColor = theme.primary;
      secondaryColor = theme.secondary;
      
      // Update active swatch class
      document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');

      updateCustomizerVariables();
      saveSettings();
      renderPreview();
    });
    container.appendChild(swatch);
  });
}

/* ==========================================================================
   SETTINGS & LAYOUT HANDLERS
   ========================================================================== */
function setupSettingsEventListeners() {
  // Template Select
  document.getElementById('template-select').addEventListener('change', (e) => {
    activeTemplate = e.target.value;
    saveSettings();
    renderPreview();
  });

  // Font Select
  document.getElementById('font-select').addEventListener('change', (e) => {
    activeFont = e.target.value;
    saveSettings();
    renderPreview();
  });

  // Font Size Slider
  document.getElementById('font-size-slider').addEventListener('input', (e) => {
    fontSize = e.target.value;
    document.getElementById('font-size-val').textContent = fontSize + 'pt';
    updateCustomizerVariables();
    saveSettings();
    renderPreview();
  });

  // Line Height Slider
  document.getElementById('line-height-slider').addEventListener('input', (e) => {
    lineHeight = e.target.value;
    document.getElementById('line-height-val').textContent = lineHeight;
    updateCustomizerVariables();
    saveSettings();
    renderPreview();
  });

  // Margins Sliders
  const margins = ['top', 'bottom', 'left', 'right'];
  margins.forEach(margin => {
    const slider = document.getElementById(`margin-${margin}-slider`);
    const valDisplay = document.getElementById(`margin-${margin}-val`);
    slider.addEventListener('input', (e) => {
      const val = e.target.value;
      valDisplay.textContent = val + 'mm';
      if (margin === 'top') marginTop = val;
      if (margin === 'bottom') marginBottom = val;
      if (margin === 'left') marginLeft = val;
      if (margin === 'right') marginRight = val;
      updateCustomizerVariables();
      saveSettings();
      renderPreview();
    });
  });

  // Zoom Controls
  document.getElementById('zoom-in').addEventListener('click', () => adjustZoom(0.1));
  document.getElementById('zoom-out').addEventListener('click', () => adjustZoom(-0.1));
  document.getElementById('zoom-fit').addEventListener('click', () => resetZoom());

  // Print PDF Button
  document.getElementById('btn-export-pdf').addEventListener('click', () => {
    window.print();
  });
}

function adjustZoom(factor) {
  zoomLevel = Math.max(0.5, Math.min(1.5, zoomLevel + factor));
  updateZoomDisplay();
}

function resetZoom() {
  zoomLevel = 1.0;
  updateZoomDisplay();
}

function updateZoomDisplay() {
  document.getElementById('zoom-val').textContent = Math.round(zoomLevel * 100) + '%';
  const element = document.getElementById('zoom-wrapper');
  if (element) {
    element.style.transform = `scale(${zoomLevel})`;
  }
}

function updateCustomizerVariables() {
  const root = document.documentElement;
  root.style.setProperty('--primary-color', primaryColor);
  root.style.setProperty('--secondary-color', secondaryColor);
  root.style.setProperty('--font-size-base', fontSize + 'pt');
  root.style.setProperty('--line-height', lineHeight);
  root.style.setProperty('--margin-top', marginTop + 'mm');
  root.style.setProperty('--margin-bottom', marginBottom + 'mm');
  root.style.setProperty('--margin-left', marginLeft + 'mm');
  root.style.setProperty('--margin-right', marginRight + 'mm');

  // Map font key to standard CSS font-family rules
  let fontCSS = 'sans-serif';
  if (activeFont === 'Inter') fontCSS = "'Inter', sans-serif";
  else if (activeFont === 'Outfit') fontCSS = "'Outfit', sans-serif";
  else if (activeFont === 'Merriweather') fontCSS = "'Merriweather', 'Georgia', serif";
  root.style.setProperty('--font-family', fontCSS);
}

function saveSettings() {
  const settings = {
    activeTemplate, activeFont, primaryColor, fontSize, lineHeight,
    marginTop, marginBottom, marginLeft, marginRight
  };
  localStorage.setItem('cute_resume_settings', JSON.stringify(settings));
}

/* ==========================================================================
   FORM DATA BINDING & LOCAL STORAGE
   ========================================================================== */
function setupFormEventListeners() {
  // Sync individual static form inputs (Personal Details)
  const fields = ['fullName', 'jobTitle', 'email', 'phone', 'website', 'linkedin', 'github', 'location', 'summary'];
  fields.forEach(field => {
    const input = document.getElementById(`p-${field}`);
    if (input) {
      input.addEventListener('input', (e) => {
        resumeData.personal[field] = e.target.value;
        saveResumeData();
        renderPreview();
        // Dynamic audits on summary/details
        if (field === 'summary') triggerAIAudits();
      });
    }
  });

  // Accordion Expand/Collapse Animation Handler
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const accordion = header.parentElement;
      const isOpen = accordion.classList.contains('open');
      
      // Close others (optional - for accordion feel)
      // document.querySelectorAll('.form-accordion').forEach(a => a.classList.remove('open'));
      
      if (isOpen) {
        accordion.classList.remove('open');
      } else {
        accordion.classList.add('open');
      }
    });
  });

  // Left panel form section buttons toggling
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const tabId = tab.dataset.tab;
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      document.getElementById(`${tabId}-tab`).classList.add('active');
    });
  });
}

function syncDataToForms() {
  // Personal inputs
  const personal = resumeData.personal || {};
  const fields = ['fullName', 'jobTitle', 'email', 'phone', 'website', 'linkedin', 'github', 'location', 'summary'];
  fields.forEach(field => {
    const input = document.getElementById(`p-${field}`);
    if (input) {
      input.value = personal[field] || '';
    }
  });
}

function saveResumeData() {
  localStorage.setItem('cute_resume_data', JSON.stringify(resumeData));
  triggerAIAudits();
}

/* ==========================================================================
   DYNAMIC LIST BUILDERS (EDUCATION, WORK, PROJECTS, ETC.)
   ========================================================================== */
function setupListAddButtons() {
  // Education Add Button
  document.getElementById('btn-add-education').addEventListener('click', () => {
    const newItem = {
      id: 'edu-' + Date.now(),
      school: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      grade: '',
      description: ''
    };
    resumeData.education.push(newItem);
    saveResumeData();
    renderDynamicFormList('education');
    renderPreview();
  });

  // Experience Add Button
  document.getElementById('btn-add-experience').addEventListener('click', () => {
    const newItem = {
      id: 'exp-' + Date.now(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    resumeData.experience.push(newItem);
    saveResumeData();
    renderDynamicFormList('experience');
    renderPreview();
  });

  // Skills Add Button
  document.getElementById('btn-add-skill').addEventListener('click', () => {
    const newItem = {
      id: 'skill-' + Date.now(),
      name: '',
      category: 'Languages'
    };
    resumeData.skills.push(newItem);
    saveResumeData();
    renderDynamicFormList('skills');
    renderPreview();
  });

  // Projects Add Button
  document.getElementById('btn-add-project').addEventListener('click', () => {
    const newItem = {
      id: 'proj-' + Date.now(),
      title: '',
      role: '',
      technologies: '',
      link: '',
      description: ''
    };
    resumeData.projects.push(newItem);
    saveResumeData();
    renderDynamicFormList('projects');
    renderPreview();
  });

  // Certifications Add Button
  document.getElementById('btn-add-certification').addEventListener('click', () => {
    const newItem = {
      id: 'cert-' + Date.now(),
      name: '',
      issuer: '',
      date: '',
      link: ''
    };
    resumeData.certifications.push(newItem);
    saveResumeData();
    renderDynamicFormList('certifications');
    renderPreview();
  });

  // Achievements Add Button
  document.getElementById('btn-add-achievement').addEventListener('click', () => {
    const newItem = {
      id: 'ach-' + Date.now(),
      title: '',
      issuer: '',
      date: '',
      description: ''
    };
    resumeData.achievements.push(newItem);
    saveResumeData();
    renderDynamicFormList('achievements');
    renderPreview();
  });
}

function renderAllDynamicFormLists() {
  renderDynamicFormList('education');
  renderDynamicFormList('experience');
  renderDynamicFormList('skills');
  renderDynamicFormList('projects');
  renderDynamicFormList('certifications');
  renderDynamicFormList('achievements');
}

/**
 * Creates list item forms dynamically in the sidebar based on items in state.
 */
function renderDynamicFormList(section) {
  const container = document.getElementById(`${section}-list-container`);
  if (!container) return;
  container.innerHTML = '';

  const items = resumeData[section] || [];
  if (items.length === 0) {
    container.innerHTML = `<div class="empty-list-msg" style="font-size: 13px; color: var(--text-muted); text-align: center; padding: 10px 0;">No items added yet.</div>`;
    return;
  }

  items.forEach((item, index) => {
    const block = document.createElement('div');
    block.className = 'list-item-editor';
    block.dataset.id = item.id;

    let formHTML = '';

    if (section === 'education') {
      formHTML = `
        <div class="list-item-header">
          <span class="list-item-title">Education Entry #${index + 1}</span>
          <button class="btn btn-danger btn-small" onclick="deleteListItem('education', '${item.id}')">Delete</button>
        </div>
        <div class="form-group">
          <label>School / University</label>
          <input type="text" value="${item.school || ''}" oninput="updateListItemField('education', '${item.id}', 'school', this.value)">
        </div>
        <div class="form-group-row">
          <div class="form-group">
            <label>Degree</label>
            <input type="text" placeholder="B.S., M.S., Ph.D." value="${item.degree || ''}" oninput="updateListItemField('education', '${item.id}', 'degree', this.value)">
          </div>
          <div class="form-group">
            <label>Field of Study</label>
            <input type="text" placeholder="Computer Science" value="${item.fieldOfStudy || ''}" oninput="updateListItemField('education', '${item.id}', 'fieldOfStudy', this.value)">
          </div>
        </div>
        <div class="form-group-row">
          <div class="form-group">
            <label>Start Date</label>
            <input type="date" value="${item.startDate || ''}" oninput="updateListItemField('education', '${item.id}', 'startDate', this.value)">
          </div>
          <div class="form-group">
            <label>End Date</label>
            <input type="date" value="${item.endDate || ''}" oninput="updateListItemField('education', '${item.id}', 'endDate', this.value)">
          </div>
        </div>
        <div class="form-group">
          <label>Grade / GPA / Details</label>
          <input type="text" placeholder="3.8 GPA / Honors" value="${item.grade || ''}" oninput="updateListItemField('education', '${item.id}', 'grade', this.value)">
        </div>
        <div class="form-group">
          <label>Description / Honors / Activities</label>
          <textarea oninput="updateListItemField('education', '${item.id}', 'description', this.value)">${item.description || ''}</textarea>
        </div>
      `;
    } 
    else if (section === 'experience') {
      formHTML = `
        <div class="list-item-header">
          <span class="list-item-title">Experience Entry #${index + 1}</span>
          <button class="btn btn-danger btn-small" onclick="deleteListItem('experience', '${item.id}')">Delete</button>
        </div>
        <div class="form-group-row">
          <div class="form-group">
            <label>Company / Organization</label>
            <input type="text" value="${item.company || ''}" oninput="updateListItemField('experience', '${item.id}', 'company', this.value)">
          </div>
          <div class="form-group">
            <label>Position / Job Title</label>
            <input type="text" value="${item.position || ''}" oninput="updateListItemField('experience', '${item.id}', 'position', this.value)">
          </div>
        </div>
        <div class="form-group">
          <label>Location</label>
          <input type="text" placeholder="City, State (Remote/Hybrid)" value="${item.location || ''}" oninput="updateListItemField('experience', '${item.id}', 'location', this.value)">
        </div>
        <div class="form-group-row">
          <div class="form-group">
            <label>Start Date</label>
            <input type="date" value="${item.startDate || ''}" oninput="updateListItemField('experience', '${item.id}', 'startDate', this.value)">
          </div>
          <div class="form-group">
            <label>End Date</label>
            <input type="date" placeholder="Leave blank if Current" value="${item.endDate || ''}" oninput="updateListItemField('experience', '${item.id}', 'endDate', this.value)">
          </div>
        </div>
        <div class="form-group">
          <label>Job Description / Responsibilities</label>
          <textarea style="min-height: 120px;" placeholder="Use bullet points starting with strong action verbs..." oninput="updateListItemField('experience', '${item.id}', 'description', this.value)">${item.description || ''}</textarea>
        </div>
      `;
    } 
    else if (section === 'skills') {
      formHTML = `
        <div class="list-item-header">
          <span class="list-item-title">Skill Entry #${index + 1}</span>
          <button class="btn btn-danger btn-small" onclick="deleteListItem('skills', '${item.id}')">Delete</button>
        </div>
        <div class="form-group-row">
          <div class="form-group">
            <label>Skill Name</label>
            <input type="text" placeholder="React, Python, Project Management" value="${item.name || ''}" oninput="updateListItemField('skills', '${item.id}', 'name', this.value)">
          </div>
          <div class="form-group">
            <label>Category Group</label>
            <select onchange="updateListItemField('skills', '${item.id}', 'category', this.value)">
              <option value="Languages" ${item.category === 'Languages' ? 'selected' : ''}>Languages</option>
              <option value="Frontend" ${item.category === 'Frontend' ? 'selected' : ''}>Frontend</option>
              <option value="Backend" ${item.category === 'Backend' ? 'selected' : ''}>Backend</option>
              <option value="Databases" ${item.category === 'Databases' ? 'selected' : ''}>Databases</option>
              <option value="DevOps" ${item.category === 'DevOps' ? 'selected' : ''}>DevOps / Cloud</option>
              <option value="Tools" ${item.category === 'Tools' ? 'selected' : ''}>Tools & Soft Skills</option>
            </select>
          </div>
        </div>
      `;
    }
    else if (section === 'projects') {
      formHTML = `
        <div class="list-item-header">
          <span class="list-item-title">Project Entry #${index + 1}</span>
          <button class="btn btn-danger btn-small" onclick="deleteListItem('projects', '${item.id}')">Delete</button>
        </div>
        <div class="form-group-row">
          <div class="form-group">
            <label>Project Title</label>
            <input type="text" value="${item.title || ''}" oninput="updateListItemField('projects', '${item.id}', 'title', this.value)">
          </div>
          <div class="form-group">
            <label>Your Role</label>
            <input type="text" placeholder="Sole Developer / Lead Architect" value="${item.role || ''}" oninput="updateListItemField('projects', '${item.id}', 'role', this.value)">
          </div>
        </div>
        <div class="form-group">
          <label>Technologies Used</label>
          <input type="text" placeholder="React, Node.js, Socket.io" value="${item.technologies || ''}" oninput="updateListItemField('projects', '${item.id}', 'technologies', this.value)">
        </div>
        <div class="form-group">
          <label>Project Link / URL</label>
          <input type="url" placeholder="https://github.com/..." value="${item.link || ''}" oninput="updateListItemField('projects', '${item.id}', 'link', this.value)">
        </div>
        <div class="form-group">
          <label>Project Description</label>
          <textarea placeholder="Describe the problem solved, and direct outcome..." oninput="updateListItemField('projects', '${item.id}', 'description', this.value)">${item.description || ''}</textarea>
        </div>
      `;
    }
    else if (section === 'certifications') {
      formHTML = `
        <div class="list-item-header">
          <span class="list-item-title">Certification #${index + 1}</span>
          <button class="btn btn-danger btn-small" onclick="deleteListItem('certifications', '${item.id}')">Delete</button>
        </div>
        <div class="form-group">
          <label>Certification Name</label>
          <input type="text" value="${item.name || ''}" oninput="updateListItemField('certifications', '${item.id}', 'name', this.value)">
        </div>
        <div class="form-group-row">
          <div class="form-group">
            <label>Issuing Organization</label>
            <input type="text" value="${item.issuer || ''}" oninput="updateListItemField('certifications', '${item.id}', 'issuer', this.value)">
          </div>
          <div class="form-group">
            <label>Issue Date</label>
            <input type="month" value="${item.date || ''}" oninput="updateListItemField('certifications', '${item.id}', 'date', this.value)">
          </div>
        </div>
        <div class="form-group">
          <label>Verification Link</label>
          <input type="url" value="${item.link || ''}" oninput="updateListItemField('certifications', '${item.id}', 'link', this.value)">
        </div>
      `;
    }
    else if (section === 'achievements') {
      formHTML = `
        <div class="list-item-header">
          <span class="list-item-title">Achievement #${index + 1}</span>
          <button class="btn btn-danger btn-small" onclick="deleteListItem('achievements', '${item.id}')">Delete</button>
        </div>
        <div class="form-group">
          <label>Achievement Title / Award</label>
          <input type="text" value="${item.title || ''}" oninput="updateListItemField('achievements', '${item.id}', 'title', this.value)">
        </div>
        <div class="form-group-row">
          <div class="form-group">
            <label>Issuer / Organizers</label>
            <input type="text" value="${item.issuer || ''}" oninput="updateListItemField('achievements', '${item.id}', 'issuer', this.value)">
          </div>
          <div class="form-group">
            <label>Date</label>
            <input type="month" value="${item.date || ''}" oninput="updateListItemField('achievements', '${item.id}', 'date', this.value)">
          </div>
        </div>
        <div class="form-group">
          <label>Short Description / Impact</label>
          <textarea placeholder="Briefly explain criteria or what you achieved..." oninput="updateListItemField('achievements', '${item.id}', 'description', this.value)">${item.description || ''}</textarea>
        </div>
      `;
    }

    block.innerHTML = formHTML;
    container.appendChild(block);
  });
}

// Window functions called by dynamic HTML input listeners
window.updateListItemField = function(section, itemId, field, value) {
  const list = resumeData[section] || [];
  const item = list.find(i => i.id === itemId);
  if (item) {
    item[field] = value;
    saveResumeData();
    renderPreview();
  }
};

window.deleteListItem = function(section, itemId) {
  resumeData[section] = (resumeData[section] || []).filter(i => i.id !== itemId);
  saveResumeData();
  renderDynamicFormList(section);
  renderPreview();
};

/* ==========================================================================
   DRAG AND DROP SECTION REORDERING
   ========================================================================== */
function setupDragAndDrop() {
  const container = document.getElementById('drag-reorder-list');
  if (!container) return;

  renderDragAndDropList();
}

const sectionLabels = {
  personal: 'Personal Details',
  summary: 'Professional Summary',
  experience: 'Work Experience',
  education: 'Education Details',
  projects: 'Projects',
  skills: 'Skills Inventory',
  certifications: 'Certifications',
  achievements: 'Achievements & Awards'
};

function renderDragAndDropList() {
  const container = document.getElementById('drag-reorder-list');
  if (!container) return;
  container.innerHTML = '';

  const order = resumeData.sectionOrder || defaultResumeData.sectionOrder;

  order.forEach(section => {
    const item = document.createElement('div');
    item.className = 'drag-item';
    item.draggable = true;
    item.dataset.section = section;
    
    // Except Personal (Personal must always be at top to keep standard resume templates logical)
    if (section === 'personal') {
      item.draggable = false;
      item.style.cursor = 'default';
      item.style.opacity = '0.7';
    }

    item.innerHTML = `
      <span class="drag-handle">${section === 'personal' ? '\u{1F512}' : '\u{2630}'}</span>
      <span>${sectionLabels[section] || section}</span>
    `;

    if (section !== 'personal') {
      item.addEventListener('dragstart', handleDragStart);
      item.addEventListener('dragover', handleDragOver);
      item.addEventListener('drop', handleDrop);
      item.addEventListener('dragend', handleDragEnd);
    }

    container.appendChild(item);
  });
}

let dragSrcEl = null;

function handleDragStart(e) {
  dragSrcEl = this;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.dataTransfer.dropEffect = 'move';
  return false;
}

function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }

  if (dragSrcEl !== this) {
    const dragTarget = this;
    
    // Reorder array in state
    const srcSection = dragSrcEl.dataset.section;
    const targetSection = dragTarget.dataset.section;
    
    // We do not allow moving items above Personal
    if (targetSection === 'personal') return;

    const order = [...resumeData.sectionOrder];
    const srcIdx = order.indexOf(srcSection);
    const targetIdx = order.indexOf(targetSection);

    // Remove source and insert at target
    order.splice(srcIdx, 1);
    order.splice(targetIdx, 0, srcSection);

    resumeData.sectionOrder = order;
    saveResumeData();
    
    renderDragAndDropList();
    renderPreview();
  }
  return false;
}

function handleDragEnd() {
  this.classList.remove('dragging');
  document.querySelectorAll('.drag-item').forEach(item => {
    item.classList.remove('dragging');
  });
}

/* ==========================================================================
   DYNAMIC PREVIEW COMPILER (TEMPLATES ENGINE)
   ========================================================================== */
function renderPreview() {
  const previewSheet = document.getElementById('resume-preview-sheet');
  if (!previewSheet) return;

  // Clear existing classes, apply template specific class
  previewSheet.className = 'resume-preview-sheet';
  previewSheet.classList.add(`template-${activeTemplate}`);

  const order = resumeData.sectionOrder || defaultResumeData.sectionOrder;
  let compiledHTML = '';

  if (activeTemplate === 'modern') {
    // Template 2 (Modern Split Column) requires dual-column container wrap
    compiledHTML = compileModernSplitLayout();
  } else if (activeTemplate === 'executive') {
    // Executive Template starts with a top header band, then sections below
    compiledHTML = compileExecutiveLayout();
  } else {
    // Standard layout order for Classic and Creative templates
    let headerHTML = compileHeader();
    let sectionsHTML = '';

    order.forEach(sectionKey => {
      if (sectionKey === 'personal') return; // printed in header
      sectionsHTML += compileSection(sectionKey);
    });

    compiledHTML = `${headerHTML} <div class="resume-body-content">${sectionsHTML}</div>`;
  }

  previewSheet.innerHTML = compiledHTML;

  // Calculate and draw horizontal page breaks visually in dashboard
  setTimeout(calculatePageBreaks, 100);
}

/**
 * Normalizes Date strings from YYYY-MM inputs to elegant MM/YYYY strings
 */
function formatDate(dateString) {
  if (!dateString) return 'Present';
  const parts = dateString.split('-');
  if (parts.length < 2) return dateString;
  const year = parts[0];
  const monthIdx = parseInt(parts[1]) - 1;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[monthIdx]} ${year}`;
}

function compileHeader() {
  const personal = resumeData.personal || {};
  
  let contactItemsHTML = '';
  if (personal.email) contactItemsHTML += `<span class="contact-item">\u2709\ufe0f <a href="mailto:${personal.email}">${personal.email}</a></span>`;
  if (personal.phone) contactItemsHTML += `<span class="contact-item">\ud83d\udcde ${personal.phone}</span>`;
  if (personal.location) contactItemsHTML += `<span class="contact-item">\ud83d\udccd ${personal.location}</span>`;
  if (personal.website) contactItemsHTML += `<span class="contact-item">\ud83c\udf10 <a href="${personal.website}" target="_blank">${personal.website.replace(/(^\w+:|^)\/\//, '')}</a></span>`;
  if (personal.linkedin) contactItemsHTML += `<span class="contact-item">\ud83d\udcbc <a href="https://${personal.linkedin}" target="_blank">LinkedIn</a></span>`;
  if (personal.github) contactItemsHTML += `<span class="contact-item">\ud83d\udcbb <a href="https://${personal.github}" target="_blank">GitHub</a></span>`;

  return `
    <div class="resume-header">
      <h1 class="candidate-name">${personal.fullName || 'YOUR NAME'}</h1>
      <div class="candidate-title">${personal.jobTitle || 'TARGET JOB TITLE'}</div>
      <div class="contact-info-list">${contactItemsHTML}</div>
    </div>
  `;
}

function compileSection(sectionKey) {
  if (sectionKey === 'summary') {
    const sumText = resumeData.personal?.summary || '';
    if (!sumText.trim()) return '';
    return `
      <div class="resume-section">
        <h2 class="resume-section-title">Professional Summary</h2>
        <p class="entry-desc" style="margin-top: 0; line-height: 1.6;">${sumText}</p>
      </div>
    `;
  }

  const items = resumeData[sectionKey] || [];
  if (items.length === 0) return '';

  let html = `<div class="resume-section">`;
  html += `<h2 class="resume-section-title">${sectionLabels[sectionKey]}</h2>`;

  if (sectionKey === 'education') {
    items.forEach(item => {
      html += `
        <div class="entry-block">
          <div class="entry-header">
            <span class="entry-title">${item.school || 'University'}</span>
            <span class="entry-date">${formatDate(item.startDate)} - ${formatDate(item.endDate)}</span>
          </div>
          <div class="entry-subtitle">
            <span>${item.degree || ''} ${item.fieldOfStudy ? 'in ' + item.fieldOfStudy : ''}</span>
            <span style="font-weight: 600;">${item.grade || ''}</span>
          </div>
          ${item.description ? `<p class="entry-desc">${item.description}</p>` : ''}
        </div>
      `;
    });
  } 
  else if (sectionKey === 'experience') {
    items.forEach(item => {
      html += `
        <div class="entry-block">
          <div class="entry-header">
            <span class="entry-title">${item.position || 'Job Title'}</span>
            <span class="entry-date">${formatDate(item.startDate)} - ${formatDate(item.endDate)}</span>
          </div>
          <div class="entry-subtitle">
            <span>${item.company || 'Company'}</span>
            <span style="font-weight: 500; font-style: italic;">${item.location || ''}</span>
          </div>
          ${item.description ? `<p class="entry-desc">${item.description}</p>` : ''}
        </div>
      `;
    });
  } 
  else if (sectionKey === 'skills') {
    // Group skills by category for elegant rendering
    const categories = {};
    items.forEach(s => {
      if (s.name) {
        if (!categories[s.category]) categories[s.category] = [];
        categories[s.category].push(s.name);
      }
    });

    if (activeTemplate === 'creative') {
      // Tags style
      html += `<div class="skills-container">`;
      items.forEach(s => {
        if (s.name) html += `<span class="skill-tag">${s.name}</span>`;
      });
      html += `</div>`;
    } else {
      // List by categories style
      html += `<div style="display: flex; flex-direction: column; gap: 1.5mm;">`;
      for (const [cat, skillList] of Object.entries(categories)) {
        html += `
          <div style="font-size: calc(var(--font-size-base) - 0.5pt); line-height: 1.4;">
            <strong style="color: var(--secondary-color); margin-right: 2px;">${cat}:</strong> 
            <span>${skillList.join(', ')}</span>
          </div>
        `;
      }
      html += `</div>`;
    }
  } 
  else if (sectionKey === 'projects') {
    items.forEach(item => {
      let linkText = '';
      if (item.link) {
        linkText = `<span style="font-weight: 500; font-size: calc(var(--font-size-base) - 1pt);">
          | <a href="${item.link}" target="_blank" style="color: var(--primary-color); text-decoration: none;">View Project</a>
        </span>`;
      }
      html += `
        <div class="entry-block">
          <div class="entry-header">
            <span class="entry-title">${item.title || 'Project Name'} ${linkText}</span>
            <span class="entry-date">${item.role || ''}</span>
          </div>
          ${item.technologies ? `<div style="font-size: calc(var(--font-size-base) - 1pt); color: var(--secondary-color); font-weight: 500; margin-bottom: 0.8mm;">Tech: ${item.technologies}</div>` : ''}
          ${item.description ? `<p class="entry-desc">${item.description}</p>` : ''}
        </div>
      `;
    });
  } 
  else if (sectionKey === 'certifications') {
    items.forEach(item => {
      let linkHTML = '';
      if (item.link) linkHTML = `<a href="${item.link}" target="_blank" style="color: var(--primary-color); text-decoration: none; font-size: 11px;">(Link)</a>`;
      html += `
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2mm; font-size: calc(var(--font-size-base) - 0.5pt);">
          <div>
            <strong>${item.name || 'Cert'}</strong> - ${item.issuer || ''} ${linkHTML}
          </div>
          <span class="entry-date">${formatDate(item.date)}</span>
        </div>
      `;
    });
  } 
  else if (sectionKey === 'achievements') {
    items.forEach(item => {
      html += `
        <div class="entry-block">
          <div class="entry-header" style="margin-bottom: 0.5mm;">
            <span class="entry-title" style="font-weight: 600;">${item.title || 'Award Title'}</span>
            <span class="entry-date">${formatDate(item.date)}</span>
          </div>
          <div style="font-size: calc(var(--font-size-base) - 1pt); font-style: italic; color: var(--secondary-color);">${item.issuer || ''}</div>
          ${item.description ? `<p class="entry-desc">${item.description}</p>` : ''}
        </div>
      `;
    });
  }

  html += `</div>`;
  return html;
}

/**
 * Modern layout compiler featuring left details column and right history column
 */
function compileModernSplitLayout() {
  const personal = resumeData.personal || {};
  const order = resumeData.sectionOrder || defaultResumeData.sectionOrder;

  let leftColHTML = '';
  let rightColHTML = '';

  // Left column sections: contact, skills, certifications
  // Right column sections: experience, education, projects, achievements, summary
  
  // 1. Setup left contact info
  let contactItemsHTML = '';
  if (personal.email) contactItemsHTML += `<span class="contact-item" style="word-break: break-all;">\u2709\ufe0f <a href="mailto:${personal.email}">${personal.email}</a></span>`;
  if (personal.phone) contactItemsHTML += `<span class="contact-item">\ud83d\udcde ${personal.phone}</span>`;
  if (personal.location) contactItemsHTML += `<span class="contact-item">\ud83d\udccd ${personal.location}</span>`;
  if (personal.website) contactItemsHTML += `<span class="contact-item" style="word-break: break-all;">\ud83c\udf10 <a href="${personal.website}" target="_blank">${personal.website.replace(/(^\w+:|^)\/\//, '')}</a></span>`;
  if (personal.linkedin) contactItemsHTML += `<span class="contact-item">\ud83d\udcbc <a href="https://${personal.linkedin}" target="_blank">LinkedIn</a></span>`;
  if (personal.github) contactItemsHTML += `<span class="contact-item">\ud83d\udcbb <a href="https://${personal.github}" target="_blank">GitHub</a></span>`;

  leftColHTML += `
    <div style="margin-bottom: 6mm;">
      <h1 class="candidate-name" style="margin-bottom: 2mm;">${personal.fullName || 'YOUR NAME'}</h1>
      <div class="candidate-title" style="margin-bottom: 4mm;">${personal.jobTitle || 'TARGET TITLE'}</div>
      <div class="contact-info-list" style="border-top: 1px solid #e2e8f0; padding-top: 4mm;">${contactItemsHTML}</div>
    </div>
  `;

  // Sort and split sections based on sectionOrder
  order.forEach(sectionKey => {
    if (sectionKey === 'personal') return;

    if (sectionKey === 'skills' || sectionKey === 'certifications') {
      leftColHTML += compileSection(sectionKey);
    } else {
      rightColHTML += compileSection(sectionKey);
    }
  });

  return `
    <div class="modern-wrapper">
      <div class="modern-left-col">${leftColHTML}</div>
      <div class="modern-right-col">${rightColHTML}</div>
    </div>
  `;
}

/**
 * Executive Layout: Large Header Banner, bold lines, uppercase headers
 */
function compileExecutiveLayout() {
  const personal = resumeData.personal || {};
  const order = resumeData.sectionOrder || defaultResumeData.sectionOrder;

  let contactItemsHTML = '';
  if (personal.email) contactItemsHTML += `<span class="contact-item">\u2709\ufe0f <a href="mailto:${personal.email}">${personal.email}</a></span>`;
  if (personal.phone) contactItemsHTML += `<span class="contact-item">\ud83d\udcde ${personal.phone}</span>`;
  if (personal.location) contactItemsHTML += `<span class="contact-item">\ud83d\udccd ${personal.location}</span>`;
  if (personal.website) contactItemsHTML += `<span class="contact-item">\ud83c\udf10 <a href="${personal.website}" target="_blank">${personal.website.replace(/(^\w+:|^)\/\//, '')}</a></span>`;
  if (personal.linkedin) contactItemsHTML += `<span class="contact-item">\ud83d\udcbc <a href="https://${personal.linkedin}" target="_blank">LinkedIn</a></span>`;

  const headerBandHTML = `
    <div class="executive-header-band">
      <h1 class="candidate-name">${personal.fullName || 'YOUR NAME'}</h1>
      <div class="candidate-title">${personal.jobTitle || 'TARGET TITLE'}</div>
      <div class="contact-info-list">${contactItemsHTML}</div>
    </div>
  `;

  let bodyHTML = '';
  order.forEach(sectionKey => {
    if (sectionKey === 'personal') return;
    bodyHTML += compileSection(sectionKey);
  });

  return `${headerBandHTML} <div class="resume-body-content">${bodyHTML}</div>`;
}

/**
 * Real-time calculation of where visual A4 page-breaks occur
 * to assist users in maintaining a single-page or cleanly segmented resume
 */
function calculatePageBreaks() {
  const container = document.getElementById('zoom-wrapper');
  const sheet = document.getElementById('resume-preview-sheet');
  if (!container || !sheet) return;

  // Clear existing page break lines
  document.querySelectorAll('.page-break-line').forEach(line => line.remove());

  // Height of A4 in pixels at 96 DPI: 297mm ≈ 1122.5 pixels
  // We can calculate scale-invariant pixel height directly
  const scaleInvariantHeight = sheet.offsetHeight;
  const a4HeightPx = 1120; // safe threshold

  const pageCount = Math.floor(scaleInvariantHeight / a4HeightPx);

  for (let i = 1; i <= pageCount; i++) {
    const breakLine = document.createElement('div');
    breakLine.className = 'page-break-line';
    breakLine.style.top = (i * a4HeightPx) + 'px';
    sheet.appendChild(breakLine);
  }
}

/* ==========================================================================
   JSON IMPORT & EXPORT HANDLERS
   ========================================================================== */
function setupFileOperations() {
  // Export JSON
  document.getElementById('btn-export-json').addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resumeData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `resume-${(resumeData.personal?.fullName || 'data').replace(/\s+/g, '-').toLowerCase()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  });

  // Trigger file upload dialog
  document.getElementById('btn-import-json').addEventListener('click', () => {
    document.getElementById('file-input').click();
  });

  // Read uploaded JSON file
  document.getElementById('file-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
      try {
        const parsed = JSON.parse(evt.target.result);
        
        // Validation check for primary node schema
        if (parsed.personal && Array.isArray(parsed.skills)) {
          resumeData = parsed;
          saveResumeData();
          syncDataToForms();
          renderAllDynamicFormLists();
          renderDragAndDropList();
          renderPreview();
          alert('Resume data loaded successfully!');
        } else {
          alert('Error: Selected JSON file does not match the Resume Builder schema.');
        }
      } catch (err) {
        alert('Error parsing JSON file. Please ensure it is a valid JSON document.');
      }
    };
    reader.readAsText(file);
  });

  // Load Sample Data
  document.getElementById('btn-load-sample').addEventListener('click', () => {
    if (confirm('Are you sure you want to load sample data? This will overwrite your current progress.')) {
      if (window.sampleResumeData) {
        resumeData = JSON.parse(JSON.stringify(window.sampleResumeData));
        saveResumeData();
        syncDataToForms();
        renderAllDynamicFormLists();
        renderDragAndDropList();
        renderPreview();
      }
    }
  });

  // Clear Form Data
  document.getElementById('btn-clear').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear your resume? All entries will be deleted.')) {
      resumeData = {
        personal: { fullName: "", jobTitle: "", email: "", phone: "", website: "", linkedin: "", github: "", location: "", summary: "" },
        education: [],
        experience: [],
        skills: [],
        projects: [],
        certifications: [],
        achievements: [],
        sectionOrder: ["personal", "summary", "experience", "education", "projects", "skills", "certifications", "achievements"]
      };
      saveResumeData();
      syncDataToForms();
      renderAllDynamicFormLists();
      renderDragAndDropList();
      renderPreview();
    }
  });
}

/* ==========================================================================
   GITHUB PROFILE DATA IMPORTER
   ========================================================================== */
function setupGitHubImporter() {
  const btn = document.getElementById('btn-import-github');
  const input = document.getElementById('github-username-input');
  if (!btn || !input) return;

  btn.addEventListener('click', async () => {
    const username = input.value.trim();
    if (!username) {
      alert('Please enter a GitHub username.');
      return;
    }

    btn.textContent = 'Fetching...';
    btn.disabled = true;

    try {
      // 1. Fetch main user profile
      const userRes = await fetch(`https://api.github.com/users/${username}`);
      if (!userRes.ok) throw new Error('User profile not found');
      const user = await userRes.json();

      // Populate personal info if empty/default
      if (user.name) resumeData.personal.fullName = user.name;
      if (user.bio) resumeData.personal.summary = user.bio;
      if (user.location) resumeData.personal.location = user.location;
      if (user.blog) resumeData.personal.website = user.blog;
      resumeData.personal.github = `github.com/${username}`;

      // 2. Fetch popular public repos
      const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
      if (reposRes.ok) {
        const repos = await reposRes.json();
        
        repos.forEach(repo => {
          // Check if repo already added
          const exists = resumeData.projects.some(p => p.title.toLowerCase() === repo.name.toLowerCase());
          if (!exists && !repo.fork) {
            resumeData.projects.push({
              id: 'proj-' + Date.now() + Math.random().toString(36).substr(2, 5),
              title: repo.name,
              role: 'Creator / Main Developer',
              technologies: repo.language || 'Open Source',
              link: repo.html_url,
              description: repo.description || 'Public open-source code repository.'
            });
          }
        });
      }

      saveResumeData();
      syncDataToForms();
      renderAllDynamicFormLists();
      renderPreview();
      
      alert(`Successfully imported details and repositories for ${username}! Check the Projects section.`);
    } catch (err) {
      alert('Error fetching profile: ' + err.message);
    } finally {
      btn.textContent = 'Import Data';
      btn.disabled = false;
    }
  });
}

/* ==========================================================================
   ADVANCED TOOLS DRAWER & AI SYSTEMS HANDLERS
   ========================================================================== */
function setupToolsDrawer() {
  const drawer = document.getElementById('tools-drawer');
  const toggleBtn = document.getElementById('drawer-toggle-btn');
  const closeBtn = document.getElementById('close-drawer-btn');
  
  if (!drawer || !toggleBtn || !closeBtn) return;

  // Toggle drawer open
  toggleBtn.addEventListener('click', () => {
    drawer.classList.add('open');
    triggerAIAudits(); // Update scores when opening
  });

  // Close drawer
  closeBtn.addEventListener('click', () => {
    drawer.classList.remove('open');
  });

  // Trigger ATS analyzer
  document.getElementById('btn-analyze-jd').addEventListener('click', () => {
    const jdText = document.getElementById('jd-textarea').value;
    if (!jdText.trim()) {
      alert('Please paste a Job Description first.');
      return;
    }

    const report = window.AIHelper.analyzeATS(resumeData, jdText);

    // Render score circle
    const radial = document.getElementById('ats-radial');
    radial.style.background = `conic-gradient(var(--accent-primary) ${report.score}%, var(--border-color) ${report.score}%)`;
    document.getElementById('ats-score-val').textContent = report.score + '%';

    // Render keyword lists
    const matchedContainer = document.getElementById('ats-matched-keywords');
    const missingContainer = document.getElementById('ats-missing-keywords');

    matchedContainer.innerHTML = report.matchedKeywords.length > 0 
      ? report.matchedKeywords.map(kw => `<span class="keyword-badge matched">\u2714 ${kw}</span>`).join('')
      : '<span style="font-size:12px;color:var(--text-muted);">None matched yet.</span>';

    missingContainer.innerHTML = report.missingKeywords.length > 0 
      ? report.missingKeywords.map(kw => `<span class="keyword-badge missing">+ ${kw}</span>`).join('')
      : '<span style="font-size:12px;color:var(--accent-success);">None missing! 100% matched.</span>';

    document.getElementById('ats-feedback-msg').textContent = report.suggestion;
  });

  // Generate Cover Letter
  document.getElementById('btn-generate-cl').addEventListener('click', () => {
    const jdText = document.getElementById('jd-textarea').value;
    if (!jdText.trim()) {
      alert('Please paste a Job Description in the scanner box above to help personalize the Cover Letter.');
      return;
    }

    const tone = document.getElementById('cl-tone-select').value;
    const letter = window.AIHelper.generateCoverLetter(resumeData, jdText, tone);
    
    const outputTextarea = document.getElementById('cl-output-textarea');
    outputTextarea.textContent = letter;
    outputTextarea.style.display = 'block';

    document.getElementById('btn-copy-cl').style.display = 'inline-flex';
  });

  // Copy Cover Letter to clipboard
  document.getElementById('btn-copy-cl').addEventListener('click', () => {
    const text = document.getElementById('cl-output-textarea').textContent;
    navigator.clipboard.writeText(text).then(() => {
      alert('Cover Letter copied to clipboard!');
    });
  });
}

function triggerAIAudits() {
  if (!window.AIHelper) return;

  const analysis = window.AIHelper.getSuggestions(resumeData);

  // Render Completion score
  const radial = document.getElementById('audit-radial');
  if (radial) {
    radial.style.background = `conic-gradient(var(--accent-success) ${analysis.completionScore}%, var(--border-color) ${analysis.completionScore}%)`;
    document.getElementById('audit-score-val').textContent = analysis.completionScore + '%';
  }

  // Render Alerts
  const container = document.getElementById('ai-audit-list');
  if (!container) return;
  container.innerHTML = '';

  if (analysis.alerts.length === 0) {
    container.innerHTML = `<div style="font-size:12px;color:var(--accent-success);font-weight:600;padding: 10px;text-align:center;">\u2714 Resume matches all core structure audits! Excellent job.</div>`;
    return;
  }

  analysis.alerts.forEach(alertItem => {
    const div = document.createElement('div');
    div.className = `ai-audit-item ${alertItem.type}`;
    div.innerHTML = `
      <span class="ai-audit-section-badge">${alertItem.section}</span>
      <span>${alertItem.message}</span>
    `;
    container.appendChild(div);
  });
}

/* ==========================================================================
   APP THEME TOGGLE (DARK / LIGHT MODE)
   ========================================================================== */
function setupThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  // Check saved theme or default to system
  let currentTheme = localStorage.getItem('cute_resume_theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeButtonIcon(currentTheme);

  toggleBtn.addEventListener('click', () => {
    currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('cute_resume_theme', currentTheme);
    updateThemeButtonIcon(currentTheme);
  });
}

function updateThemeButtonIcon(theme) {
  const toggleBtn = document.getElementById('theme-toggle');
  if (theme === 'dark') {
    toggleBtn.innerHTML = '\u2600\ufe0f'; // Sun emoji
    toggleBtn.title = 'Switch to Light Mode';
  } else {
    toggleBtn.innerHTML = '\ud83c\udf19'; // Moon emoji
    toggleBtn.title = 'Switch to Dark Mode';
  }
}
