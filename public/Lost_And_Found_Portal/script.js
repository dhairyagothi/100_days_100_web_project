/**
 * Lost & Found Portal
 * Main JavaScript File
 */

class LostAndFoundApp {
    constructor() {
        this.items = this.loadItems();
        this.currentView = 'home';
        this.init();
    }

    // Initial Data
    getInitialData() {
        return [];
    }

    loadItems() {
        const stored = localStorage.getItem('lostAndFoundApp_v2_Items');
        if (stored) {
            return JSON.parse(stored);
        }
        const initial = this.getInitialData();
        localStorage.setItem('lostAndFoundApp_v2_Items', JSON.stringify(initial));
        return initial;
    }

    saveItems() {
        localStorage.setItem('lostAndFoundApp_v2_Items', JSON.stringify(this.items));
        this.updateStats();
        if (this.currentView === 'home') {
            this.renderRecentListings();
        } else if (this.currentView === 'browse') {
            this.renderBrowseListings();
        }
    }

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.initTheme();
        this.updateStats();
        this.renderRecentListings();
        
        // Setup file upload previews
        this.setupImageUpload('lost');
        this.setupImageUpload('found');
    }

    cacheDOM() {
        this.navBtns = document.querySelectorAll('.nav-btn');
        this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        this.mobileMenu = document.querySelector('.mobile-menu');
        this.themeToggle = document.getElementById('theme-toggle');
        this.views = document.querySelectorAll('.view-section');
        
        // Forms
        this.reportLostForm = document.getElementById('report-lost-form');
        this.reportFoundForm = document.getElementById('report-found-form');
        
        // Search & Filters
        this.searchInput = document.getElementById('search-input');
        this.typeFilter = document.getElementById('type-filter');
        this.categoryFilter = document.getElementById('category-filter');
        
        // Grids
        this.homeRecentGrid = document.getElementById('home-recent-listings');
        this.browseGrid = document.getElementById('browse-listings');
        this.emptyState = document.getElementById('empty-state');
        this.detailsContent = document.getElementById('item-details-content');
        
        // Toast
        this.toast = document.getElementById('toast');
    }

    bindEvents() {
        // Navigation
        this.navBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.getAttribute('data-view');
                if (view) this.switchView(view);
                this.mobileMenu.classList.add('hidden'); // Close mobile menu on click
            });
        });

        // Mobile Menu
        this.mobileMenuBtn.addEventListener('click', () => {
            this.mobileMenu.classList.toggle('hidden');
        });

        // Theme Toggle
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Forms
        if(this.reportLostForm) {
            this.reportLostForm.addEventListener('submit', (e) => this.handleReportSubmit(e, 'lost'));
        }
        if(this.reportFoundForm) {
            this.reportFoundForm.addEventListener('submit', (e) => this.handleReportSubmit(e, 'found'));
        }

        // Filters
        if(this.searchInput) {
            this.searchInput.addEventListener('input', () => this.renderBrowseListings());
        }
        if(this.typeFilter) {
            this.typeFilter.addEventListener('change', () => this.renderBrowseListings());
        }
        if(this.categoryFilter) {
            this.categoryFilter.addEventListener('change', () => this.renderBrowseListings());
        }
    }

    initTheme() {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            this.themeToggle.innerHTML = '<i class="ph ph-sun"></i>';
        }
    }

    toggleTheme() {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            this.themeToggle.innerHTML = '<i class="ph ph-moon"></i>';
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            this.themeToggle.innerHTML = '<i class="ph ph-sun"></i>';
        }
    }

    switchView(viewId) {
        // Update active class on views
        this.views.forEach(view => {
            view.classList.add('hidden');
            view.classList.remove('active');
        });
        
        const targetView = document.getElementById(`view-${viewId}`);
        if (targetView) {
            targetView.classList.remove('hidden');
            // Trigger reflow to restart animation
            void targetView.offsetWidth; 
            targetView.classList.add('active');
        }

        // Update active class on nav buttons
        this.navBtns.forEach(btn => {
            if (btn.getAttribute('data-view') === viewId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        this.currentView = viewId;

        // View specific logic
        if (viewId === 'home') {
            this.updateStats();
            this.renderRecentListings();
        } else if (viewId === 'browse') {
            this.renderBrowseListings();
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    updateStats() {
        const lostCount = this.items.filter(item => item.type === 'lost').length;
        const foundCount = this.items.filter(item => item.type === 'found').length;
        
        const statLost = document.getElementById('stat-lost');
        const statFound = document.getElementById('stat-found');
        const statReunited = document.getElementById('stat-reunited');
        
        if(statLost) statLost.textContent = lostCount;
        if(statFound) statFound.textContent = foundCount;
        if(statReunited) statReunited.textContent = '0';
    }

    setupImageUpload(type) {
        const dropArea = document.getElementById(`${type}-drop-area`);
        const fileInput = document.getElementById(`${type}-image`);
        const previewContainer = document.getElementById(`${type}-image-preview`);
        const previewImg = document.getElementById(`${type}-preview-img`);
        const removeBtn = previewContainer?.querySelector('.remove-image-btn');

        if (!dropArea || !fileInput) return;

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, () => dropArea.classList.add('dragover'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, () => dropArea.classList.remove('dragover'), false);
        });

        dropArea.addEventListener('drop', (e) => {
            let dt = e.dataTransfer;
            let files = dt.files;
            fileInput.files = files;
            handleFiles(files);
        });

        fileInput.addEventListener('change', function() {
            handleFiles(this.files);
        });

        const handleFiles = (files) => {
            if (files && files[0]) {
                const file = files[0];
                if (!file.type.startsWith('image/')) return;

                const reader = new FileReader();
                reader.onload = (e) => {
                    previewImg.src = e.target.result;
                    previewContainer.classList.remove('hidden');
                    dropArea.classList.add('hidden');
                };
                reader.readAsDataURL(file);
            }
        };

        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                fileInput.value = '';
                previewImg.src = '';
                previewContainer.classList.add('hidden');
                dropArea.classList.remove('hidden');
            });
        }
    }

    handleReportSubmit(e, type) {
        e.preventDefault();
        
        const previewImg = document.getElementById(`${type}-preview-img`);
        const imageSrc = previewImg.src && !previewImg.src.includes(window.location.host) ? previewImg.src : null;
        
        // Generate placeholder if no image
        const defaultImage = '';

        const newItem = {
            id: Date.now().toString(),
            type: type,
            name: document.getElementById(`${type}-item-name`).value,
            category: document.getElementById(`${type}-category`).value,
            date: document.getElementById(`${type}-date`).value,
            location: document.getElementById(`${type}-location`).value,
            description: document.getElementById(`${type}-description`).value,
            contact: document.getElementById(`${type}-contact`).value,
            image: imageSrc || defaultImage,
            reportedAt: new Date().toISOString()
        };

        this.items.unshift(newItem); // Add to beginning
        this.saveItems();

        // Reset form
        e.target.reset();
        
        // Reset image preview
        const fileInput = document.getElementById(`${type}-image`);
        const previewContainer = document.getElementById(`${type}-image-preview`);
        const dropArea = document.getElementById(`${type}-drop-area`);
        
        if(fileInput) fileInput.value = '';
        if(previewImg) previewImg.src = '';
        if(previewContainer) previewContainer.classList.add('hidden');
        if(dropArea) dropArea.classList.remove('hidden');

        // Show success and redirect
        this.showToast('Success', `Your ${type} item report has been submitted.`);
        this.switchView('browse');
    }

    createListingCard(item) {
        const card = document.createElement('div');
        card.className = 'listing-card glass hover-effect';
        
        const dateObj = new Date(item.date);
        const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        
        const placeholderSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='240' viewBox='0 0 400 240'%3E%3Crect width='400' height='240' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-family='sans-serif' font-size='16px'%3ENo Image%3C/text%3E%3C/svg%3E";
        
        card.innerHTML = `
            <div class="listing-img-wrapper">
                <img src="${item.image || placeholderSvg}" alt="${item.name}" class="listing-img" onerror="this.onerror=null; this.src='${placeholderSvg}'">
                <span class="listing-badge badge-${item.type}">${item.type.toUpperCase()}</span>
            </div>
            <div class="listing-content">
                <h3 class="listing-title">${item.name}</h3>
                <div class="listing-meta">
                    <i class="ph ph-map-pin"></i> ${item.location}
                </div>
                <div class="listing-meta">
                    <i class="ph ph-calendar"></i> ${formattedDate}
                </div>
                <div class="listing-footer">
                    <span class="listing-category">${item.category}</span>
                    <button class="btn btn-text" onclick="window.app.viewItemDetails('${item.id}')">Details <i class="ph ph-arrow-right"></i></button>
                </div>
            </div>
        `;
        return card;
    }

    renderRecentListings() {
        if (!this.homeRecentGrid) return;
        
        this.homeRecentGrid.innerHTML = '';
        // Show max 3 recent items
        const recentItems = this.items.slice(0, 3);
        
        recentItems.forEach(item => {
            this.homeRecentGrid.appendChild(this.createListingCard(item));
        });
    }

    renderBrowseListings() {
        if (!this.browseGrid) return;

        const searchTerm = this.searchInput.value.toLowerCase();
        const typeFilter = this.typeFilter.value;
        const categoryFilter = this.categoryFilter.value;

        let filteredItems = this.items.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm) || 
                                  item.description.toLowerCase().includes(searchTerm) ||
                                  item.location.toLowerCase().includes(searchTerm);
            const matchesType = typeFilter === 'all' || item.type === typeFilter;
            const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
            
            return matchesSearch && matchesType && matchesCategory;
        });

        this.browseGrid.innerHTML = '';

        if (filteredItems.length === 0) {
            this.emptyState.classList.remove('hidden');
            this.browseGrid.classList.add('hidden');
        } else {
            this.emptyState.classList.add('hidden');
            this.browseGrid.classList.remove('hidden');
            
            filteredItems.forEach(item => {
                this.browseGrid.appendChild(this.createListingCard(item));
            });
        }
    }

    resetFilters() {
        this.searchInput.value = '';
        this.typeFilter.value = 'all';
        this.categoryFilter.value = 'all';
        this.renderBrowseListings();
    }

    viewItemDetails(id) {
        const item = this.items.find(i => i.id === id);
        if (!item) return;

        const dateObj = new Date(item.date);
        const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        const reportedDate = new Date(item.reportedAt).toLocaleDateString('en-US');

        const placeholderSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-family='sans-serif' font-size='20px'%3ENo Image%3C/text%3E%3C/svg%3E";

        this.detailsContent.innerHTML = `
            <div class="details-img-container">
                <img src="${item.image || placeholderSvg}" alt="${item.name}" class="details-img" onerror="this.onerror=null; this.src='${placeholderSvg}'">
            </div>
            <div class="details-info">
                <div class="details-header">
                    <span class="listing-badge badge-${item.type}">${item.type.toUpperCase()}</span>
                    <h2>${item.name}</h2>
                    <p>Reported on ${reportedDate}</p>
                </div>
                
                <div class="details-meta-grid">
                    <div class="meta-item">
                        <i class="ph ph-tag"></i>
                        <div>
                            <span>Category</span>
                            <p style="text-transform: capitalize;">${item.category}</p>
                        </div>
                    </div>
                    <div class="meta-item">
                        <i class="ph ph-calendar"></i>
                        <div>
                            <span>Date ${item.type === 'lost' ? 'Lost' : 'Found'}</span>
                            <p>${formattedDate}</p>
                        </div>
                    </div>
                    <div class="meta-item">
                        <i class="ph ph-map-pin"></i>
                        <div>
                            <span>Location</span>
                            <p>${item.location}</p>
                        </div>
                    </div>
                    <div class="meta-item">
                        <i class="ph ph-user"></i>
                        <div>
                            <span>Contact</span>
                            <p>${item.contact}</p>
                        </div>
                    </div>
                </div>
                
                <div class="details-description">
                    <h3>Description</h3>
                    <p>${item.description}</p>
                </div>
                
                <div class="details-actions">
                    <a href="mailto:${item.contact.includes('@') ? item.contact : ''}" class="btn btn-primary btn-full">
                        <i class="ph ph-envelope-simple"></i> Contact Reporter
                    </a>
                </div>
            </div>
        `;

        this.switchView('details');
    }

    showToast(title, message) {
        document.getElementById('toast-title').textContent = title;
        document.getElementById('toast-message').textContent = message;
        
        this.toast.classList.remove('hidden');
        this.toast.classList.remove('fade-out');
        
        setTimeout(() => {
            this.toast.classList.add('fade-out');
            setTimeout(() => this.toast.classList.add('hidden'), 300);
        }, 3000);
    }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    window.app = new LostAndFoundApp();
});
