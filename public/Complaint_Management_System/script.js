class ComplaintApp {
    constructor() {
        this.items = this.loadItems();
        this.currentView = 'dashboard';
        this.selectedAdminComplaint = null;
        this.init();
    }

    // --- State Management ---
    loadItems() {
        const stored = localStorage.getItem('complaintSystemData');
        if (stored) {
            return JSON.parse(stored);
        }
        return [];
    }

    saveItems() {
        localStorage.setItem('complaintSystemData', JSON.stringify(this.items));
        this.updateDashboardStats();
    }

    // --- Initialization ---
    init() {
        this.cacheDOM();
        this.bindEvents();
        this.initTheme();
        
        // Initial Renders
        this.updateDashboardStats();
        this.renderRecentComplaints();
    }

    cacheDOM() {
        // Navigation
        this.navItems = document.querySelectorAll('.nav-item[data-view]');
        this.views = document.querySelectorAll('.view-section');
        this.mobileToggle = document.querySelector('.mobile-toggle');
        this.sidebar = document.querySelector('.sidebar');
        this.pageTitle = document.getElementById('page-title');
        this.themeToggle = document.getElementById('theme-toggle');
        
        // Dashboard
        this.statTotal = document.getElementById('stat-total');
        this.statPending = document.getElementById('stat-pending');
        this.statProgress = document.getElementById('stat-progress');
        this.statResolved = document.getElementById('stat-resolved');
        this.recentTableBody = document.getElementById('recent-table-body');
        
        // Forms
        this.complaintForm = document.getElementById('complaint-form');
        this.fileInput = document.getElementById('attachment');
        this.fileDropArea = document.getElementById('file-drop-area');
        this.filePreview = document.getElementById('file-preview');
        this.fileName = document.getElementById('file-name');
        this.removeFileBtn = document.getElementById('remove-file');
        
        // Listings
        this.searchInput = document.getElementById('search-input');
        this.filterStatus = document.getElementById('filter-status');
        this.filterPriority = document.getElementById('filter-priority');
        this.listingsTableBody = document.getElementById('listings-table-body');
        this.listingsEmpty = document.getElementById('listings-empty');
        this.complaintsTable = document.getElementById('complaints-table');
        
        // Details
        this.detailsContent = document.getElementById('details-content');
        
        // Admin
        this.adminSearch = document.getElementById('admin-search');
        this.adminComplaintsList = document.getElementById('admin-complaints-list');
        this.adminEditorEmpty = document.getElementById('admin-editor-empty');
        this.adminEditorForm = document.getElementById('admin-editor-form');
        
        // Toast
        this.toast = document.getElementById('toast');
        this.toastTitle = document.getElementById('toast-title');
        this.toastMessage = document.getElementById('toast-message');
        this.toastIcon = document.getElementById('toast-icon');
    }

    bindEvents() {
        // Navigation
        this.navItems.forEach(item => {
            item.addEventListener('click', () => {
                this.switchView(item.dataset.view);
                if(window.innerWidth <= 768) {
                    this.sidebar.classList.remove('open');
                }
            });
        });

        this.mobileToggle.addEventListener('click', () => {
            this.sidebar.classList.toggle('open');
        });

        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        // File Upload
        this.fileDropArea.addEventListener('click', (e) => {
            if(e.target !== this.removeFileBtn && !this.removeFileBtn.contains(e.target)) {
                this.fileInput.click();
            }
        });
        
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.removeFileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeAttachment();
        });

        // Form Submit
        this.complaintForm.addEventListener('submit', (e) => this.handleComplaintSubmit(e));

        // Filters
        this.searchInput.addEventListener('input', () => this.renderListings());
        this.filterStatus.addEventListener('change', () => this.renderListings());
        this.filterPriority.addEventListener('change', () => this.renderListings());
        
        // Admin Search
        this.adminSearch.addEventListener('input', () => this.renderAdminList());
    }

    // --- Theme & UI ---
    initTheme() {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
        } else if (!storedTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.setAttribute('data-theme', 'dark');
        }
    }

    toggleTheme() {
    const current = document.body.getAttribute('data-theme');
    const btn = document.getElementById('theme-toggle');
    if (current === 'dark') {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        if (btn) btn.innerHTML = '<i class="ph ph-sun"></i> Dark Mode';
    } else {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        if (btn) btn.innerHTML = '<i class="ph ph-moon"></i> Light Mode';
    }
}

    showToast(title, message, type = 'success') {
        this.toastTitle.textContent = title;
        this.toastMessage.textContent = message;
        
        if (type === 'success') {
            this.toastIcon.innerHTML = '<i class="ph ph-check-circle"></i>';
            this.toastIcon.style.color = 'var(--status-resolved)';
        } else if (type === 'error') {
            this.toastIcon.innerHTML = '<i class="ph ph-warning-circle"></i>';
            this.toastIcon.style.color = 'var(--status-rejected)';
        }
        
        this.toast.classList.remove('hidden');
        setTimeout(() => {
            this.toast.classList.add('hidden');
        }, 3000);
    }

    // --- Routing ---
    switchView(viewId) {
        this.currentView = viewId;
        
        // Update nav UI
        this.navItems.forEach(item => {
            if(item.dataset.view === viewId) item.classList.add('active');
            else item.classList.remove('active');
        });

        // Update sections
        this.views.forEach(section => {
            if(section.id === `view-${viewId}`) section.classList.add('active');
            else section.classList.remove('active');
        });

        // Update Title
        const titles = {
            'dashboard': 'Dashboard Overview',
            'submit': 'Submit Complaint',
            'listings': 'Complaint Directory',
            'details': 'Complaint Details',
            'admin': 'Admin Panel'
        };
        this.pageTitle.textContent = titles[viewId] || 'Portal';

        // Trigger view-specific renders
        if (viewId === 'dashboard') {
            this.updateDashboardStats();
            this.renderRecentComplaints();
        } else if (viewId === 'listings') {
            this.renderListings();
        } else if (viewId === 'admin') {
            this.selectedAdminComplaint = null;
            this.renderAdminList();
            this.renderAdminEditor();
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // --- Utilities ---
    generateId() {
        const prefix = "CMP-";
        const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
        const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
        return `${prefix}${dateStr}-${randomStr}`;
    }

    getStatusConfig(status) {
        const config = {
            'pending': { text: 'Pending', class: 'badge-pending' },
            'in_progress': { text: 'In Progress', class: 'badge-in_progress' },
            'resolved': { text: 'Resolved', class: 'badge-resolved' },
            'rejected': { text: 'Rejected', class: 'badge-rejected' }
        };
        return config[status] || { text: 'Unknown', class: 'badge-pending' };
    }

    getPriorityConfig(priority) {
        const config = {
            'low': { text: 'Low', class: 'badge-pending' },
            'medium': { text: 'Medium', class: 'badge-in_progress' },
            'high': { text: 'High', class: 'badge-rejected' }
        };
        return config[priority] || { text: 'Normal', class: 'badge-pending' };
    }

    // --- File Handling ---
    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            // Check size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                this.showToast('File Too Large', 'Maximum file size is 5MB', 'error');
                this.fileInput.value = '';
                return;
            }
            this.fileName.textContent = file.name;
            document.querySelector('.upload-content').style.display = 'none';
            this.filePreview.classList.remove('hidden');
            this.filePreview.style.display = 'flex';
        }
    }

    removeAttachment() {
        this.fileInput.value = '';
        this.fileName.textContent = '';
        document.querySelector('.upload-content').style.display = 'flex';
        this.filePreview.classList.add('hidden');
        this.filePreview.style.display = 'none';
    }

    // --- Submitting ---
    handleComplaintSubmit(e) {
        e.preventDefault();
        
        const file = this.fileInput.files[0];
        let fileDataUrl = '';

        // If a file is attached, read it as Data URL to store in localStorage safely
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                fileDataUrl = event.target.result;
                this.finalizeSubmission(fileDataUrl);
            };
            reader.readAsDataURL(file);
        } else {
            this.finalizeSubmission('');
        }
    }

    finalizeSubmission(attachmentData) {
        const newComplaint = {
            id: this.generateId(),
            title: document.getElementById('title').value,
            category: document.getElementById('category').value,
            priority: document.getElementById('priority').value,
            department: document.getElementById('department').value,
            location: document.getElementById('location').value,
            description: document.getElementById('description').value,
            contact: document.getElementById('contact').value,
            attachment: attachmentData,
            status: 'pending',
            createdAt: new Date().toISOString(),
            timeline: [
                {
                    status: 'pending',
                    date: new Date().toISOString(),
                    note: 'Complaint submitted by user.'
                }
            ]
        };

        this.items.unshift(newComplaint);
        this.saveItems();
        
        this.complaintForm.reset();
        this.removeAttachment();
        
        this.showToast('Complaint Submitted', `Your Complaint ID is ${newComplaint.id}`);
        setTimeout(() => {
            this.viewComplaintDetails(newComplaint.id);
        }, 1500);
    }

    // --- Dashboard Rendering ---
    updateDashboardStats() {
        const total = this.items.length;
        const pending = this.items.filter(i => i.status === 'pending').length;
        const progress = this.items.filter(i => i.status === 'in_progress').length;
        const resolved = this.items.filter(i => i.status === 'resolved').length;

        this.statTotal.textContent = total;
        this.statPending.textContent = pending;
        this.statProgress.textContent = progress;
        this.statResolved.textContent = resolved;
    }

    renderRecentComplaints() {
        this.recentTableBody.innerHTML = '';
        const recentItems = this.items.slice(0, 5);

        if (recentItems.length === 0) {
            this.recentTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">No complaints found.</td></tr>`;
            return;
        }

        recentItems.forEach(item => {
            const tr = document.createElement('tr');
            const statusCfg = this.getStatusConfig(item.status);
            const date = new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            tr.innerHTML = `
                <td style="font-family: monospace; font-weight: 500;">${item.id}</td>
                <td style="font-weight: 500;">${item.title}</td>
                <td style="text-transform: capitalize;">${item.category}</td>
                <td><span class="badge ${statusCfg.class}">${statusCfg.text}</span></td>
                <td>${date}</td>
            `;
            tr.style.cursor = 'pointer';
            tr.onclick = () => this.viewComplaintDetails(item.id);
            this.recentTableBody.appendChild(tr);
        });
    }

    // --- Listings Rendering ---
    renderListings() {
        const query = this.searchInput.value.toLowerCase();
        const statusFilter = this.filterStatus.value;
        const priorityFilter = this.filterPriority.value;

        const filtered = this.items.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(query) || item.id.toLowerCase().includes(query);
            const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
            const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;
            return matchesSearch && matchesStatus && matchesPriority;
        });

        this.listingsTableBody.innerHTML = '';

        if (filtered.length === 0) {
            this.complaintsTable.classList.add('hidden');
            this.listingsEmpty.classList.remove('hidden');
            return;
        }

        this.complaintsTable.classList.remove('hidden');
        this.listingsEmpty.classList.add('hidden');

        filtered.forEach(item => {
            const tr = document.createElement('tr');
            const statusCfg = this.getStatusConfig(item.status);
            const priorityCfg = this.getPriorityConfig(item.priority);
            const date = new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            tr.innerHTML = `
                <td style="font-family: monospace; font-weight: 500;">${item.id}</td>
                <td style="font-weight: 500; max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.title}</td>
                <td><span class="badge ${priorityCfg.class}">${priorityCfg.text}</span></td>
                <td><span class="badge ${statusCfg.class}">${statusCfg.text}</span></td>
                <td>${date}</td>
                <td>
                    <button class="btn btn-text" onclick="event.stopPropagation(); window.app.viewComplaintDetails('${item.id}')">
                        View
                    </button>
                </td>
            `;
            tr.style.cursor = 'pointer';
            tr.onclick = () => this.viewComplaintDetails(item.id);
            this.listingsTableBody.appendChild(tr);
        });
    }

    clearFilters() {
        this.searchInput.value = '';
        this.filterStatus.value = 'all';
        this.filterPriority.value = 'all';
        this.renderListings();
    }

    // --- Details Rendering ---
    viewComplaintDetails(id) {
        const item = this.items.find(i => i.id === id);
        if (!item) return;

        this.switchView('details');
        
        const statusCfg = this.getStatusConfig(item.status);
        const priorityCfg = this.getPriorityConfig(item.priority);
        const date = new Date(item.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

        let attachmentHTML = '';
        if (item.attachment) {
            // Check if it's likely an image by data URL prefix
            if (item.attachment.startsWith('data:image')) {
                attachmentHTML = `
                    <div class="mt-4">
                        <h4>Attachment</h4>
                        <img src="${item.attachment}" class="attachment-img" alt="Attachment">
                    </div>
                `;
            } else {
                attachmentHTML = `
                    <div class="mt-4">
                        <h4>Attachment</h4>
                        <a href="${item.attachment}" download="attachment" class="btn btn-secondary mt-2"><i class="ph ph-download-simple"></i> Download File</a>
                    </div>
                `;
            }
        }

        let timelineHTML = '';
        item.timeline.forEach((event, idx) => {
            const eventDate = new Date(event.date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
            const sCfg = this.getStatusConfig(event.status);
            const isLast = idx === item.timeline.length - 1;
            
            timelineHTML += `
                <div class="timeline-item">
                    <div class="timeline-dot ${isLast ? 'active' : ''}"></div>
                    <div class="timeline-content">
                        <h5>Status changed to <span class="badge ${sCfg.class}" style="font-size: 0.6rem; margin-left: 5px;">${sCfg.text}</span></h5>
                        <span>${eventDate}</span>
                        ${event.note ? `<p>${event.note}</p>` : ''}
                    </div>
                </div>
            `;
        });

        this.detailsContent.innerHTML = `
            <div class="details-main">
                <div class="card details-info-card">
                    <div class="details-title-row">
                        <div>
                            <span class="text-muted" style="font-family: monospace;">${item.id}</span>
                            <h2>${item.title}</h2>
                        </div>
                        <span class="badge ${statusCfg.class}">${statusCfg.text}</span>
                    </div>

                    <div class="details-meta">
                        <div class="meta-block">
                            <p>Category</p>
                            <span style="text-transform: capitalize;">${item.category}</span>
                        </div>
                        <div class="meta-block">
                            <p>Priority</p>
                            <span class="badge ${priorityCfg.class}" style="margin-left: -5px;">${priorityCfg.text}</span>
                        </div>
                        <div class="meta-block">
                            <p>Department</p>
                            <span style="text-transform: capitalize;">${item.department}</span>
                        </div>
                        <div class="meta-block">
                            <p>Submitted Date</p>
                            <span>${date}</span>
                        </div>
                        <div class="meta-block">
                            <p>Location</p>
                            <span>${item.location || 'N/A'}</span>
                        </div>
                        <div class="meta-block">
                            <p>Contact</p>
                            <span>${item.contact}</span>
                        </div>
                    </div>

                    <div class="details-desc">
                        <h4>Description</h4>
                        <p>${item.description}</p>
                    </div>
                    
                    ${attachmentHTML}
                </div>
            </div>

            <div class="details-sidebar">
                <div class="card timeline-card">
                    <h3 class="mb-4">Tracking Timeline</h3>
                    <div class="timeline">
                        ${timelineHTML}
                    </div>
                </div>
            </div>
        `;
    }

    // --- Admin Rendering ---
    renderAdminList() {
        const query = this.adminSearch.value.toLowerCase();
        // Only show pending or in_progress in the admin quick list, or all if searching
        let filtered = this.items;
        if (query) {
            filtered = this.items.filter(item => 
                item.title.toLowerCase().includes(query) || 
                item.id.toLowerCase().includes(query)
            );
        } else {
            filtered = this.items.filter(item => item.status === 'pending' || item.status === 'in_progress');
        }

        this.adminComplaintsList.innerHTML = '';
        
        if(filtered.length === 0) {
            this.adminComplaintsList.innerHTML = `<p class="text-muted" style="padding: 1rem; text-align: center;">No active complaints found.</p>`;
            return;
        }

        filtered.forEach(item => {
            const div = document.createElement('div');
            const isSelected = this.selectedAdminComplaint && this.selectedAdminComplaint.id === item.id;
            const statusCfg = this.getStatusConfig(item.status);
            
            div.className = `admin-list-item ${isSelected ? 'selected' : ''}`;
            div.innerHTML = `
                <div class="admin-list-item-header">
                    <h4>${item.id}</h4>
                    <span class="badge ${statusCfg.class}" style="font-size: 0.6rem; padding: 0.1rem 0.4rem;">${statusCfg.text}</span>
                </div>
                <p class="text-muted" style="font-size: 0.75rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.title}</p>
            `;
            div.onclick = () => this.selectAdminComplaint(item.id);
            this.adminComplaintsList.appendChild(div);
        });
    }

    selectAdminComplaint(id) {
        this.selectedAdminComplaint = this.items.find(i => i.id === id);
        this.renderAdminList(); // update selected visual
        this.renderAdminEditor();
    }

    renderAdminEditor() {
        if (!this.selectedAdminComplaint) {
            this.adminEditorEmpty.classList.remove('hidden');
            this.adminEditorForm.classList.add('hidden');
            return;
        }

        this.adminEditorEmpty.classList.add('hidden');
        this.adminEditorForm.classList.remove('hidden');

        document.getElementById('admin-edit-title').textContent = `Manage: ${this.selectedAdminComplaint.id}`;
        document.getElementById('admin-status').value = this.selectedAdminComplaint.status;
        document.getElementById('admin-department').value = this.selectedAdminComplaint.department;
        document.getElementById('admin-notes').value = '';
    }

    saveAdminChanges() {
        if (!this.selectedAdminComplaint) return;

        const newStatus = document.getElementById('admin-status').value;
        const newDept = document.getElementById('admin-department').value;
        const notes = document.getElementById('admin-notes').value;

        let changed = false;

        if (this.selectedAdminComplaint.department !== newDept) {
            this.selectedAdminComplaint.department = newDept;
            changed = true;
        }

        if (this.selectedAdminComplaint.status !== newStatus || notes.trim() !== '') {
            this.selectedAdminComplaint.status = newStatus;
            
            this.selectedAdminComplaint.timeline.push({
                status: newStatus,
                date: new Date().toISOString(),
                note: notes.trim() !== '' ? notes : `Status updated to ${this.getStatusConfig(newStatus).text} by Admin.`
            });
            changed = true;
        }

        if (changed) {
            this.saveItems();
            this.showToast('Changes Saved', `Complaint ${this.selectedAdminComplaint.id} has been updated.`);
            this.renderAdminList();
            this.renderAdminEditor(); // clear notes
        }
    }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ComplaintApp();
});
