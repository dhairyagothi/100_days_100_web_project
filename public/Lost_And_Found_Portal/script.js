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

  hideToast() {
    if (!this.toast || this.toast.classList.contains('hidden')) return;

    this.toast.classList.add('fade-out');

    setTimeout(() => {
      this.toast.classList.add('hidden');
      this.toast.classList.remove('fade-out');
    }, 300);
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
    localStorage.setItem(
      'lostAndFoundApp_v2_Items',
      JSON.stringify(this.items)
    );
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

    // FIX: Set max date to today for lost and found date fields
    this.setMaxDates();
  }

  // FIX: New method to restrict future dates
  setMaxDates() {
    const today = new Date().toISOString().split('T')[0];
    const lostDate = document.getElementById('lost-date');
    const foundDate = document.getElementById('found-date');
    if (lostDate) lostDate.setAttribute('max', today);
    if (foundDate) foundDate.setAttribute('max', today);
  }

  cacheDOM() {
    this.navBtns = document.querySelectorAll('.nav-btn');
    this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    this.mobileMenu = document.querySelector('.mobile-menu');
    this.themeToggle = document.getElementById('theme-toggle');
    this.views = document.querySelectorAll('.view-section');
    // Toast
    this.toast = document.getElementById('toast');
    this.toastCloseBtn = document.querySelector('.toast-close');
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
    this.navBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const view = e.target.getAttribute('data-view');
        if (view) this.switchView(view);
        this.mobileMenu.classList.add('hidden');
      });
    });

    // Toast close button
    if (this.toastCloseBtn) {
      this.toastCloseBtn.addEventListener('click', () => {
        this.hideToast();
      });
    }

    // Mobile Menu
    this.mobileMenuBtn.addEventListener('click', () => {
      this.mobileMenu.classList.toggle('hidden');
    });

    // Theme Toggle
    this.themeToggle.addEventListener('click', () => this.toggleTheme());

    // Forms
    if (this.reportLostForm) {
      this.reportLostForm.addEventListener('submit', (e) =>
        this.handleReportSubmit(e, 'lost')
      );
    }
    if (this.reportFoundForm) {
      this.reportFoundForm.addEventListener('submit', (e) =>
        this.handleReportSubmit(e, 'found')
      );
    }

    // Filters
    if (this.searchInput) {
      this.searchInput.addEventListener('input', () =>
        this.renderBrowseListings()
      );
    }
    if (this.typeFilter) {
      this.typeFilter.addEventListener('change', () =>
        this.renderBrowseListings()
      );
    }
    if (this.categoryFilter) {
      this.categoryFilter.addEventListener('change', () =>
        this.renderBrowseListings()
      );
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
    this.views.forEach((view) => {
      view.classList.add('hidden');
      view.classList.remove('active');
    });

    const targetView = document.getElementById(`view-${viewId}`);
    if (targetView) {
      targetView.classList.remove('hidden');
      void targetView.offsetWidth;
      targetView.classList.add('active');
    }

    this.navBtns.forEach((btn) => {
      if (btn.getAttribute('data-view') === viewId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    this.currentView = viewId;

    if (viewId === 'home') {
      this.updateStats();
      this.renderRecentListings();
    } else if (viewId === 'browse') {
      this.renderBrowseListings();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updateStats() {
    // Total historical reports
    const lostCount = this.items.filter((item) => item.type === 'lost').length;
    const foundCount = this.items.filter(
      (item) => item.type === 'found'
    ).length;

    // Calculate all items successfully resolved (both lost items recovered & found items returned)
    const reunitedCount = this.items.filter(
      (item) =>
        item.reunionStatus === 'reunited' ||
        item.status === 'reunited' ||
        item.reunited === true
    ).length;

    // Never found: Lost items that have NOT been successfully reunited
    const neverFoundCount = this.items.filter(
      (item) =>
        item.type === 'lost' &&
        item.reunionStatus !== 'reunited' &&
        item.status !== 'reunited' &&
        item.reunited !== true
    ).length;

    const statLost = document.getElementById('stat-lost');
    const statFound = document.getElementById('stat-found');
    const statReunited = document.getElementById('stat-reunited');
    const statNeverFound = document.getElementById('stat-never-found');

    if (statLost) statLost.textContent = lostCount;
    if (statFound) statFound.textContent = foundCount;
    if (statReunited) statReunited.textContent = reunitedCount;
    if (statNeverFound) statNeverFound.textContent = neverFoundCount;
  }

  setupImageUpload(type) {
    const dropArea = document.getElementById(`${type}-drop-area`);
    const fileInput = document.getElementById(`${type}-image`);
    const previewContainer = document.getElementById(`${type}-image-preview`);
    const previewImg = document.getElementById(`${type}-preview-img`);
    const removeBtn = previewContainer?.querySelector('.remove-image-btn');

    if (!dropArea || !fileInput) return;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
      dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach((eventName) => {
      dropArea.addEventListener(
        eventName,
        () => dropArea.classList.add('dragover'),
        false
      );
    });

    ['dragleave', 'drop'].forEach((eventName) => {
      dropArea.addEventListener(
        eventName,
        () => dropArea.classList.remove('dragover'),
        false
      );
    });

    dropArea.addEventListener('drop', (e) => {
      let dt = e.dataTransfer;
      let files = dt.files;
      fileInput.files = files;
      handleFiles(files);
    });

    fileInput.addEventListener('change', function () {
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

    // FIX: Validate that date is not in the future
    const dateInput = document.getElementById(`${type}-date`);
    const selectedDate = new Date(dateInput.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate > today) {
      this.showToast('Invalid Date', 'The date lost cannot be in the future.');
      return;
    }

    const contactInput = document
      .getElementById(`${type}-contact`)
      .value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    const isValidEmail = emailRegex.test(contactInput);
    const isValidPhone = phoneRegex.test(contactInput);

    if (!isValidEmail && !isValidPhone) {
      this.showToast(
        'Invalid Contact Info',
        'Please enter a valid 10-digit phone number or a proper email address.'
      );
      return;
    }

    const previewImg = document.getElementById(`${type}-preview-img`);
    const imageSrc =
      previewImg.src && !previewImg.src.includes(window.location.host)
        ? previewImg.src
        : null;

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
      reportedAt: new Date().toISOString(),
      status: 'active',
    };

    this.items.unshift(newItem);
    this.saveItems();

    e.target.reset();

    const fileInput = document.getElementById(`${type}-image`);
    const previewContainer = document.getElementById(`${type}-image-preview`);
    const dropArea = document.getElementById(`${type}-drop-area`);

    if (fileInput) fileInput.value = '';
    if (previewImg) previewImg.src = '';
    if (previewContainer) previewContainer.classList.add('hidden');
    if (dropArea) dropArea.classList.remove('hidden');

    // FIX: Reset max date after form reset
    this.setMaxDates();

    this.showToast('Success', `Your ${type} item report has been submitted.`);
    this.switchView('browse');
  }

  createListingCard(item) {
    const card = document.createElement('div');
    card.className = 'listing-card glass hover-effect';

    const dateObj = new Date(item.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const placeholderSvg =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='240' viewBox='0 0 400 240'%3E%3Crect width='400' height='240' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-family='sans-serif' font-size='16px'%3ENo Image%3C/text%3E%3C/svg%3E";

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
    // Filter out reunited items so they do not clutter the active feed
    const recentItems = this.items
      .filter((item) => item.status !== 'reunited')
      .slice(0, 3);

    recentItems.forEach((item) => {
      this.homeRecentGrid.appendChild(this.createListingCard(item));
    });
  }

  renderBrowseListings() {
    if (!this.browseGrid) return;

    const searchTerm = this.searchInput.value.toLowerCase();
    const typeFilter = this.typeFilter.value;
    const categoryFilter = this.categoryFilter.value;

    let filteredItems = this.items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.location.toLowerCase().includes(searchTerm);
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      const matchesCategory =
        categoryFilter === 'all' || item.category === categoryFilter;
      // Ensure we only show active items
      const isActive = item.status !== 'reunited';

      return matchesSearch && matchesType && matchesCategory && isActive;
    });

    this.browseGrid.innerHTML = '';

    if (filteredItems.length === 0) {
      this.emptyState.classList.remove('hidden');
      this.browseGrid.classList.add('hidden');
    } else {
      this.emptyState.classList.add('hidden');
      this.browseGrid.classList.remove('hidden');

      filteredItems.forEach((item) => {
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
    const item = this.items.find((i) => i.id === id);
    if (!item) return;

    const dateObj = new Date(item.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    const reportedDate = new Date(item.reportedAt).toLocaleDateString('en-US');

    const placeholderSvg =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-family='sans-serif' font-size='20px'%3ENo Image%3C/text%3E%3C/svg%3E";

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
                
                <div class="details-actions" style="flex-direction: column; gap: 0.5rem;">
                    <a href="mailto:${item.contact.includes('@') ? item.contact : ''}" class="btn btn-primary btn-full">
                        <i class="ph ph-envelope-simple"></i> Contact Reporter
                    </a>
                    ${
                      item.status !== 'reunited'
                        ? `
                        <button class="btn btn-secondary btn-full" onclick="window.app.markAsReunited('${item.id}')">
                            <i class="ph ph-handshake"></i> Mark as Reunited
                        </button>
                    `
                        : `
                        <div class="btn btn-secondary btn-full" style="opacity: 0.7; cursor: default; border-color: var(--secondary); color: var(--secondary);">
                            <i class="ph ph-check-circle"></i> Item Reunited
                        </div>
                    `
                    }
                </div>
            </div>
        `;

    this.switchView('details');
  }

  /**
   * Marks an item as reunited and updates the global application state
   * @param {string} id - The unique identifier of the item
   */
  markAsReunited(id) {
    try {
      const itemIndex = this.items.findIndex((item) => item.id === id);

      if (itemIndex !== -1) {
        // Update the status payload
        this.items[itemIndex].status = 'reunited';

        // saveItems() automatically calls updateStats() internally,
        // which will now trigger the new math added in the main branch
        this.saveItems();

        // Navigate back to the browse view
        this.switchView('browse');
        this.showToast('Success', 'Item has been marked as reunited!');
      } else {
        console.warn(`Item with id ${id} not found in local storage.`);
      }
    } catch (error) {
      console.error('Failed to mark item as reunited:', error);
      this.showToast(
        'Error',
        'Failed to update item status. Please try again.'
      );
    }
  }

  showToast(title, message) {
    document.getElementById('toast-title').textContent = title;
    document.getElementById('toast-message').textContent = message;

    this.toast.classList.remove('hidden');
    this.toast.classList.remove('fade-out');

    clearTimeout(this.toastTimer);

    this.toastTimer = setTimeout(() => {
      this.hideToast();
    }, 3000);
  }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  window.app = new LostAndFoundApp();
});
