const db = window.CertificateDB;

// ==========================================================================
// STATE MANAGEMENT
// ==========================================================================
let certificates = [];
let activeCategory = 'all';
let searchQuery = '';
let sortBy = 'newest';
let currentCertificate = null;

// Form state
let selectedFileBase64 = '';
let selectedFileName = '';

// Default placeholders when no certificate image is uploaded
const DEFAULT_CERT_PLACEHOLDER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600" fill="none"><rect width="800" height="600" fill="%23f8fafc"/><rect x="40" y="40" width="720" height="520" rx="8" fill="white" stroke="%23cbd5e1" stroke-width="2" stroke-dasharray="8 8"/><circle cx="400" cy="220" r="60" fill="%23e0e7ff"/><path d="M400 190L415 225H450L420 245L432 280L400 260L368 280L380 245L350 225H385L400 190Z" fill="%234f46e5"/><text x="400" y="340" font-family="system-ui, sans-serif" font-size="28" font-weight="bold" fill="%230f172a" text-anchor="middle">Verified Credential</text><text x="400" y="380" font-family="system-ui, sans-serif" font-size="18" fill="%23475569" text-anchor="middle">CertiKeep Digital Seal</text></svg>`;

// ==========================================================================
// DOM ELEMENTS
// ==========================================================================
const elApp = document.getElementById('app');
const elShareViewer = document.getElementById('share-viewer');

// Main view elements
const elGrid = document.getElementById('certificates-grid');
const elEmptyState = document.getElementById('empty-state');
const elSearchInput = document.getElementById('search-input');
const elFilterCategory = document.getElementById('filter-category');
const elSortBy = document.getElementById('sort-by');
const elCategoryPillsContainer = document.getElementById('category-pills-container');

// Stats elements
const elStatTotal = document.getElementById('stat-total');
const elStatCategories = document.getElementById('stat-categories');
const elStatTags = document.getElementById('stat-tags');

// Buttons
const btnAddCert = document.getElementById('btn-add-cert');
const btnExport = document.getElementById('btn-export');
const btnImport = document.getElementById('btn-import');
const importFileInput = document.getElementById('import-file-input');
const emptyStateAddBtn = document.getElementById('empty-state-add-btn');

// Form Modal
const modalForm = document.getElementById('modal-cert-form');
const formCert = document.getElementById('cert-form');
const formCertId = document.getElementById('form-cert-id');
const formTitle = document.getElementById('form-title');
const formIssuer = document.getElementById('form-issuer');
const formCategory = document.getElementById('form-category');
const formIssueDate = document.getElementById('form-issue-date');
const formExpiryDate = document.getElementById('form-expiry-date');
const formCredentialId = document.getElementById('form-credential-id');
const formCredentialUrl = document.getElementById('form-credential-url');
const formSkills = document.getElementById('form-skills');
const formFile = document.getElementById('form-file');
const uploadZone = document.getElementById('upload-zone');
const previewContainer = document.getElementById('file-preview-container');
const previewImg = document.getElementById('file-preview-img');
const previewFileName = document.getElementById('preview-file-name');
const btnRemovePreview = document.getElementById('btn-remove-preview');
const btnCancelForm = document.getElementById('btn-cancel-form');
const btnCloseFormModal = document.getElementById('btn-close-form-modal');
const modalFormTitle = document.getElementById('modal-form-title');

// Details Modal
const modalDetails = document.getElementById('modal-cert-details');
const btnCloseDetailsModal = document.getElementById('btn-close-details-modal');
const detailCertImg = document.getElementById('detail-cert-img');
const detailCertCategory = document.getElementById('detail-cert-category');
const detailCertTitle = document.getElementById('detail-cert-title');
const detailCertIssuer = document.getElementById('detail-cert-issuer');
const detailCertDate = document.getElementById('detail-cert-date');
const detailCertExpiry = document.getElementById('detail-cert-expiry');
const detailCertId = document.getElementById('detail-cert-id');
const detailIdContainer = document.getElementById('detail-id-container');
const detailCertSkills = document.getElementById('detail-cert-skills');
const detailVerifyBtn = document.getElementById('detail-verify-btn');
const detailShareBtn = document.getElementById('detail-share-btn');
const detailDownloadBtn = document.getElementById('detail-download-btn');
const detailEditBtn = document.getElementById('detail-edit-btn');
const detailDeleteBtn = document.getElementById('detail-delete-btn');

// Share Modal
const modalShare = document.getElementById('modal-share');
const btnCloseShareModal = document.getElementById('btn-close-share-modal');
const shareLinkInput = document.getElementById('share-link-input');
const btnCopyShareLink = document.getElementById('btn-copy-share-link');
const shareCopyToast = document.getElementById('share-copy-toast');

// Shared Viewer Mode Elements
const viewerCertImg = document.getElementById('viewer-cert-img');
const viewerCertCategory = document.getElementById('viewer-cert-category');
const viewerCertTitle = document.getElementById('viewer-cert-title');
const viewerCertIssuer = document.getElementById('viewer-cert-issuer');
const viewerCertDate = document.getElementById('viewer-cert-date');
const viewerCertExpiry = document.getElementById('viewer-cert-expiry');
const viewerCertId = document.getElementById('viewer-cert-id');
const viewerIdContainer = document.getElementById('viewer-id-container');
const viewerCertSkills = document.getElementById('viewer-cert-skills');
const viewerVerifyBtn = document.getElementById('viewer-verify-btn');
const viewerDownloadBtn = document.getElementById('viewer-download-btn');

// Toast
const elToast = document.getElementById('toast');
const elToastMessage = document.getElementById('toast-message');

// ==========================================================================
// TOAST NOTIFICATION HELPERS
// ==========================================================================
function showToast(message, duration = 3000) {
  elToastMessage.textContent = message;
  elToast.classList.remove('hidden');

  // Reset animation
  elToast.style.animation = 'none';
  elToast.offsetHeight; // trigger reflow
  elToast.style.animation = '';

  setTimeout(() => {
    elToast.classList.add('hidden');
  }, duration);
}

// ==========================================================================
// APP INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', async () => {
  // Check for shared viewer parameter
  const urlParams = new URLSearchParams(window.location.search);
  const sharePayload = urlParams.get('share');

  if (sharePayload) {
    initShareViewer(sharePayload);
  } else {
    await initDashboard();
  }

  // Load Icons
  lucide.createIcons();
});

// ==========================================================================
// SHARED VIEW MODE
// ==========================================================================
function initShareViewer(payload) {
  elApp.classList.add('hidden');
  elShareViewer.classList.remove('hidden');

  try {
    // Decrypt / Decode payload (Base64 URL Safe, UTF-8 unicode safe)
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const binaryStr = atob(base64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    const jsonStr = new TextDecoder().decode(bytes);
    const data = JSON.parse(jsonStr);

    // Populate data
    viewerCertTitle.textContent = data.title;
    viewerCertIssuer.textContent = data.issuer;
    viewerCertCategory.textContent = data.category || 'Professional';

    // Dates
    viewerCertDate.textContent = formatDate(data.issueDate);
    viewerCertExpiry.textContent = data.expiryDate ? formatDate(data.expiryDate) : 'Permanent / Non-expiring';

    // Credential ID
    if (data.credentialId) {
      viewerCertId.textContent = data.credentialId;
      viewerIdContainer.classList.remove('hidden');
    } else {
      viewerIdContainer.classList.add('hidden');
    }

    // Skills
    viewerCertSkills.innerHTML = '';
    if (data.skills && data.skills.length > 0) {
      data.skills.forEach(skill => {
        const span = document.createElement('span');
        span.className = 'skill-tag';
        span.textContent = skill;
        viewerCertSkills.appendChild(span);
      });
    } else {
      const span = document.createElement('span');
      span.className = 'skill-tag';
      span.textContent = 'General Professional Skill';
      viewerCertSkills.appendChild(span);
    }

    // Image preview
    const imageSrc = data.image || DEFAULT_CERT_PLACEHOLDER;

    try {
      const parsedUrl = new URL(imageSrc, window.location.origin);

      if (['http:', 'https:'].includes(parsedUrl.protocol)) {
        viewerCertImg.src = parsedUrl.href;
      } else if (imageSrc.startsWith('data:image/')) {
        viewerCertImg.src = imageSrc;
      } else {
        viewerCertImg.src = DEFAULT_CERT_PLACEHOLDER;
      }
    } catch {
      viewerCertImg.src = DEFAULT_CERT_PLACEHOLDER;
    }

    // Verify Button
    if (data.credentialUrl) {
      try {
        const verifyUrl = new URL(
          data.credentialUrl,
          window.location.origin
        );

        if (
          verifyUrl.protocol === 'http:' ||
          verifyUrl.protocol === 'https:'
        ) {
          viewerVerifyBtn.href = verifyUrl.href;
          viewerVerifyBtn.classList.remove('hidden');
        } else {
          viewerVerifyBtn.classList.add('hidden');
        }
      } catch {
        viewerVerifyBtn.classList.add('hidden');
      }
    } else {
      viewerVerifyBtn.classList.add('hidden');
    }

    // Download Button
    viewerDownloadBtn.onclick = () => {
      triggerDownload(data.title, imageSrc);
    };

  } catch (error) {
    console.error('Failed to parse sharing credentials:', error);
    // Display error on page
    viewerCertTitle.textContent = 'Invalid Sharing Link';
    viewerCertIssuer.textContent = 'This sharing payload is corrupted or incorrectly formatted.';
    viewerCertImg.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" fill="none"><rect width="800" height="600" fill="%23fee2e2"/><text x="400" y="300" font-family="sans-serif" font-size="24" fill="%23ef4444" font-weight="bold" text-anchor="middle">Failed to load shared credential</text></svg>`;
    viewerVerifyBtn.classList.add('hidden');
    viewerDownloadBtn.classList.add('hidden');
  }
}

// ==========================================================================
// DASHBOARD MODE
// ==========================================================================
async function initDashboard() {
  try {
    certificates = await db.getAllCertificates();
    setupEventListeners();
    renderDashboard();
  } catch (e) {
    showToast('Failed to connect to browser storage!');
    console.error(e);
  }
}

function setupEventListeners() {
  // Opening Form Modal
  btnAddCert.onclick = () => openFormModal();
  emptyStateAddBtn.onclick = () => openFormModal();

  // Closing Modals
  btnCloseFormModal.onclick = closeFormModal;
  btnCancelForm.onclick = closeFormModal;
  btnCloseDetailsModal.onclick = () => modalDetails.classList.add('hidden');
  btnCloseShareModal.onclick = () => modalShare.classList.add('hidden');

  // Submit Form
  formCert.onsubmit = handleFormSubmit;

  // Search & Filtering
  elSearchInput.oninput = (e) => {
    searchQuery = e.target.value;
    renderDashboard();
  };

  elFilterCategory.onchange = (e) => {
    activeCategory = e.target.value;
    renderDashboard();
  };

  elSortBy.onchange = (e) => {
    sortBy = e.target.value;
    renderDashboard();
  };

  // Drag & Drop File Handling
  uploadZone.ondragover = (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
  };

  uploadZone.ondragleave = () => {
    uploadZone.classList.remove('dragover');
  };

  uploadZone.ondrop = (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  formFile.onchange = (e) => {
    if (e.target.files.length > 0) {
      handleFileSelected(e.target.files[0]);
    }
  };

  // Remove selected file preview
  btnRemovePreview.onclick = () => {
    resetFileSelection();
  };

  // Actions in Detail Modal
  detailEditBtn.onclick = () => {
    if (currentCertificate) {
      modalDetails.classList.add('hidden');
      openFormModal(currentCertificate);
    }
  };

  detailDeleteBtn.onclick = async () => {
    if (currentCertificate && confirm(`Are you sure you want to delete "${currentCertificate.title}"?`)) {
      try {
        await db.deleteCertificate(currentCertificate.id);
        certificates = certificates.filter(c => c.id !== currentCertificate.id);
        modalDetails.classList.add('hidden');
        renderDashboard();
        showToast('Certificate successfully deleted');
      } catch (err) {
        showToast('Error deleting certificate');
      }
    }
  };

  detailDownloadBtn.onclick = () => {
    if (currentCertificate) {
      triggerDownload(currentCertificate.title, currentCertificate.image || DEFAULT_CERT_PLACEHOLDER);
    }
  };

  detailShareBtn.onclick = () => {
    if (currentCertificate) {
      openShareModal(currentCertificate);
    }
  };

  // Share Copy Button
  btnCopyShareLink.onclick = () => {
    shareLinkInput.select();
    navigator.clipboard.writeText(shareLinkInput.value)
      .then(() => {
        shareCopyToast.classList.remove('hidden');
        setTimeout(() => shareCopyToast.classList.add('hidden'), 2000);
      })
      .catch(() => showToast('Failed to copy link!'));
  };

  // Export backup JSON
  btnExport.onclick = handleExportBackup;

  // Import backup JSON
  btnImport.onclick = () => importFileInput.click();
  importFileInput.onchange = handleImportBackup;
}

// ==========================================================================
// FILE HANDLING (File to Base64)
// ==========================================================================
function handleFileSelected(file) {
  if (!file.type.startsWith('image/')) {
    showToast('Only image files (PNG, JPG, SVG, WebP) are supported.');
    return;
  }

  // Warn if larger than 2.5MB
  if (file.size > 2.5 * 1024 * 1024) {
    showToast('Warning: Large images may slow down local storage.');
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    selectedFileBase64 = e.target.result;
    selectedFileName = file.name;

    // Show Preview
    previewImg.src = selectedFileBase64;
    previewFileName.textContent = selectedFileName;

    uploadZone.classList.add('hidden');
    previewContainer.classList.remove('hidden');
  };
  reader.readAsDataURL(file);
}

function resetFileSelection() {
  selectedFileBase64 = '';
  selectedFileName = '';
  formFile.value = '';
  previewImg.src = '';
  previewFileName.textContent = '';

  uploadZone.classList.remove('hidden');
  previewContainer.classList.add('hidden');
}

// ==========================================================================
// RENDER & FILTER DASHBOARD
// ==========================================================================
function renderDashboard() {
  // 1. Process items
  let filtered = [...certificates];

  // Category filter
  if (activeCategory !== 'all') {
    filtered = filtered.filter(c => c.category === activeCategory);
  }

  // Search filter
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.issuer.toLowerCase().includes(q) ||
      (c.skills && c.skills.some(skill => skill.toLowerCase().includes(q))) ||
      c.category.toLowerCase().includes(q)
    );
  }

  // Sorting
  filtered.sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.issueDate) - new Date(a.issueDate);
    } else if (sortBy === 'oldest') {
      return new Date(a.issueDate) - new Date(b.issueDate);
    } else if (sortBy === 'title-asc') {
      return a.title.localeCompare(b.title);
    } else if (sortBy === 'issuer-asc') {
      return a.issuer.localeCompare(b.issuer);
    }
    return 0;
  });

  // 2. Render Cards Grid
  elGrid.innerHTML = '';
  if (filtered.length === 0) {
    elGrid.classList.add('hidden');
    elEmptyState.classList.remove('hidden');
  } else {
    elGrid.classList.remove('hidden');
    elEmptyState.classList.add('hidden');

    filtered.forEach(cert => {
      const card = document.createElement('div');
      card.className = 'cert-card';
      card.onclick = () => openDetailsModal(cert);

      const previewImage = cert.image || DEFAULT_CERT_PLACEHOLDER;

      // Skills markup
      let skillsHtml = '';
      if (cert.skills && cert.skills.length > 0) {
        skillsHtml = cert.skills
          .slice(0, 3)
          .map(s => `<span class="skill-tag">${escapeHTML(s)}</span>`)
          .join('');
      }

      card.innerHTML = `
    <div class="cert-card-preview">
        <img src="${escapeHTML(previewImage)}" alt="${escapeHTML(cert.title)}">
        <span class="cert-card-category-badge">${escapeHTML(cert.category)}</span>
    </div>

    <div class="cert-card-content">
        <div class="cert-card-header">
            <h3 class="cert-card-title">${escapeHTML(cert.title)}</h3>
            <span class="cert-card-issuer">${escapeHTML(cert.issuer)}</span>
        </div>

        <div class="cert-card-skills">
            ${skillsHtml}
        </div>

        <div class="cert-card-meta">
            <div class="cert-card-date">
                <i data-lucide="calendar"></i>
                <span>${escapeHTML(formatDate(cert.issueDate))}</span>
            </div>
            <span>
                ${cert.expiryDate
          ? `Expires: ${escapeHTML(formatDate(cert.expiryDate))}`
          : "Permanent"
        }
            </span>
        </div>
    </div>
`;
      elGrid.appendChild(card);
    });

    // Refresh Icons for newly injected elements
    lucide.createIcons();
  }

  // 3. Render Dashboard Statistics
  updateStatistics();

  // 4. Update filters and category quick selector pills
  updateCategorySelectors();
}

function updateStatistics() {
  elStatTotal.textContent = certificates.length;

  const categories = new Set(certificates.map(c => c.category));
  elStatCategories.textContent = categories.size;

  const skills = new Set();
  certificates.forEach(c => {
    if (c.skills) {
      c.skills.forEach(s => skills.add(s.trim().toLowerCase()));
    }
  });
  elStatTags.textContent = skills.size;
}

function updateCategorySelectors() {
  const categories = Array.from(new Set(certificates.map(c => c.category))).sort();

  // Update Category Select Dropdown options
  const currentSelectVal = elFilterCategory.value;
  elFilterCategory.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    elFilterCategory.appendChild(opt);
  });
  // Maintain selection if possible
  elFilterCategory.value = currentSelectVal || 'all';

  // Update category pills quick filters
  elCategoryPillsContainer.innerHTML = '';

  // All Pill
  const allPill = document.createElement('button');
  allPill.className = `pill ${activeCategory === 'all' ? 'active' : ''}`;
  allPill.textContent = `All (${certificates.length})`;
  allPill.onclick = () => {
    activeCategory = 'all';
    elFilterCategory.value = 'all';
    renderDashboard();
  };
  elCategoryPillsContainer.appendChild(allPill);

  // Individual Pills
  categories.forEach(cat => {
    const count = certificates.filter(c => c.category === cat).length;
    const pill = document.createElement('button');
    pill.className = `pill ${activeCategory === cat ? 'active' : ''}`;
    pill.textContent = `${cat} (${count})`;
    pill.onclick = () => {
      activeCategory = cat;
      elFilterCategory.value = cat;
      renderDashboard();
    };
    elCategoryPillsContainer.appendChild(pill);
  });
}

// ==========================================================================
// MODAL FORMS OPERATIONS (Add & Edit)
// ==========================================================================
function openFormModal(cert = null) {
  formCert.reset();
  resetFileSelection();

  if (cert) {
    // EDIT MODE
    modalFormTitle.textContent = 'Edit Certificate';
    formCertId.value = cert.id;
    formTitle.value = cert.title;
    formIssuer.value = cert.issuer;
    formCategory.value = cert.category;
    formIssueDate.value = cert.issueDate;
    formExpiryDate.value = cert.expiryDate || '';
    formCredentialId.value = cert.credentialId || '';
    formCredentialUrl.value = cert.credentialUrl || '';
    formSkills.value = cert.skills ? cert.skills.join(', ') : '';

    if (cert.image) {
      selectedFileBase64 = cert.image;
      previewImg.src = cert.image;
      previewFileName.textContent = 'Existing Certificate Image';
      uploadZone.classList.add('hidden');
      previewContainer.classList.remove('hidden');
    }
  } else {
    // ADD MODE
    modalFormTitle.textContent = 'Add Certificate';
    formCertId.value = '';
  }

  modalForm.classList.remove('hidden');
  lucide.createIcons();
}

function closeFormModal() {
  modalForm.classList.add('hidden');
  resetFileSelection();
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const id = formCertId.value;
  const title = formTitle.value.trim();
  const issuer = formIssuer.value.trim();
  const category = formCategory.value;
  const issueDate = formIssueDate.value;
  const expiryDate = formExpiryDate.value || null;
  const credentialId = formCredentialId.value.trim() || null;
  const credentialUrl = formCredentialUrl.value.trim() || null;
  const skills = formSkills.value.split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  const certData = {
    title,
    issuer,
    category,
    issueDate,
    expiryDate,
    credentialId,
    credentialUrl,
    skills,
    image: selectedFileBase64 || null
  };

  try {
    if (id) {
      // Update existing
      certData.id = id;
      await db.updateCertificate(certData);
      certificates = certificates.map(c => c.id === id ? certData : c);
      showToast('Certificate updated successfully!');
    } else {
      // Add new
      const newId = await db.addCertificate(certData);
      certData.id = newId;
      certificates.push(certData);
      showToast('Certificate added successfully!');
    }

    closeFormModal();
    renderDashboard();
  } catch (err) {
    showToast('Failed to save certificate information.');
    console.error(err);
  }
}

// ==========================================================================
// DETAILS MODAL SHOWCASE
// ==========================================================================
function openDetailsModal(cert) {
  currentCertificate = cert;

  detailCertTitle.textContent = cert.title;
  detailCertIssuer.textContent = cert.issuer;
  detailCertCategory.textContent = cert.category;

  // Date formatters
  detailCertDate.textContent = formatDate(cert.issueDate);
  detailCertExpiry.textContent = cert.expiryDate ? formatDate(cert.expiryDate) : 'Permanent / Non-expiring';

  // ID display
  if (cert.credentialId) {
    detailCertId.textContent = cert.credentialId;
    detailIdContainer.classList.remove('hidden');
  } else {
    detailIdContainer.classList.add('hidden');
  }

  // Skills
  detailCertSkills.innerHTML = '';
  if (cert.skills && cert.skills.length > 0) {
    cert.skills.forEach(s => {
      const span = document.createElement('span');
      span.className = 'skill-tag';
      span.textContent = s;
      detailCertSkills.appendChild(span);
    });
  } else {
    detailCertSkills.innerHTML = '<span class="skill-tag">General Credential</span>';
  }

  // Image Source
  const imageUrl = cert.image || DEFAULT_CERT_PLACEHOLDER;

  try {
    const parsedUrl = new URL(imageUrl, window.location.origin);

    if (['http:', 'https:'].includes(parsedUrl.protocol)) {
      detailCertImg.src = parsedUrl.href;
    } else {
      detailCertImg.src = DEFAULT_CERT_PLACEHOLDER;
    }
  } catch {
    detailCertImg.src = DEFAULT_CERT_PLACEHOLDER;
  }

  // External verify button
  if (cert.credentialUrl) {
    try {
      const verifyUrl = new URL(cert.credentialUrl, window.location.origin);

      if (verifyUrl.protocol === 'http:' || verifyUrl.protocol === 'https:') {
        detailVerifyBtn.href = verifyUrl.href;
        detailVerifyBtn.classList.remove('hidden');
      } else {
        detailVerifyBtn.classList.add('hidden');
      }
    } catch {
      detailVerifyBtn.classList.add('hidden');
    }
  } else {
    detailVerifyBtn.classList.add('hidden');
  }
}

// ==========================================================================
// SHARING LINK CODE GENERATION
// ==========================================================================
function openShareModal(cert) {

  const sharePayload = {
    title: cert.title,
    issuer: cert.issuer,
    category: cert.category,
    issueDate: cert.issueDate,
    expiryDate: cert.expiryDate,
    credentialId: cert.credentialId,
    credentialUrl: cert.credentialUrl,
    skills: cert.skills
  };

  // If the image is very small (e.g. customized SVG or minor logo under 35KB), include it.
  if (cert.image && cert.image.length < 35 * 1024) {
    sharePayload.image = cert.image;
  }

  try {
    const jsonStr = JSON.stringify(sharePayload);
    // Convert to UTF-8 bytes to prevent base64 encoding error with Unicode characters
    const utf8Bytes = new TextEncoder().encode(jsonStr);
    let binaryStr = '';
    const len = utf8Bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binaryStr += String.fromCharCode(utf8Bytes[i]);
    }
    const base64 = btoa(binaryStr).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    const shareUrl = `${window.location.origin}${window.location.pathname}?share=${base64}`;

    shareLinkInput.value = shareUrl;
    modalShare.classList.remove('hidden');
    lucide.createIcons();
  } catch (err) {
    showToast('Could not generate share link.');
    console.error(err);
  }
}

// ==========================================================================
// DATA BACKUP & RESTORE (Import / Export JSON)
// ==========================================================================
async function handleExportBackup() {
  try {
    const certs = await db.getAllCertificates();
    if (certs.length === 0) {
      showToast('No certificate data to backup.');
      return;
    }

    const dataStr = JSON.stringify(certs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    const dateStamp = new Date().toISOString().split('T')[0];
    link.download = `certikeep-backup-${dateStamp}.json`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Backup JSON exported successfully!');
  } catch (err) {
    showToast('Failed to export backup.');
    console.error(err);
  }
}

async function handleImportBackup(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (event) => {
    try {
      const data = JSON.parse(event.target.result);

      // Basic validation
      if (!Array.isArray(data)) {
        throw new Error('Backup file must be a JSON array of certificates.');
      }

      let importCount = 0;
      let updateCount = 0;

      for (const cert of data) {
        if (!cert.title || !cert.issuer) {
          continue; // Skip invalid object
        }

        // Clean/ensure ID exists
        if (!cert.id) {
          cert.id = 'cert_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }

        // Upsert logic: check if ID already exists
        const exists = certificates.some(c => c.id === cert.id);

        await db.updateCertificate(cert); // puts it into IndexedDB

        if (exists) {
          certificates = certificates.map(c => c.id === cert.id ? cert : c);
          updateCount++;
        } else {
          certificates.push(cert);
          importCount++;
        }
      }

      renderDashboard();
      showToast(`Restore complete! Imported ${importCount} new, updated ${updateCount}.`);
    } catch (err) {
      showToast('Invalid backup file structure.');
      console.error(err);
    } finally {
      // Clear file input so it can be re-selected
      importFileInput.value = '';
    }
  };
  reader.readAsText(file);
}

// ==========================================================================
// GENERAL UTILITY FUNCTIONS
// ==========================================================================
function formatDate(dateStr) {
  if (!dateStr) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString('en-US', options);
}

function triggerDownload(title, imageSrc) {
  const link = document.createElement('a');
  link.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-credential.png`;
  link.href = imageSrc;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
