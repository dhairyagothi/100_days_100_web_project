class JobTrackerApp {
    constructor() {
        this.applications = [];
        this.activeTab = 'dashboard';
        
        this.filters = {
            search: '',
            status: 'all',
            priority: 'all',
            sort: 'dateApplied-desc'
        };

        this.settings = {
            currency: '₹'
        };

        this.volumeChart = null;
        this.breakdownChart = null;

        // Sub-modules
        this.kanbanBoard = null;
        this.calendar = null;
    }

    init() {
        this.loadState();
        this.cacheDOM();
        this.bindEvents();
        
        // Initialize sub-modules
        this.kanbanBoard = new KanbanBoard(this);
        this.kanbanBoard.init();

        this.calendar = new InterviewCalendar(this);
        this.calendar.init();

        this.setupTabNavigation();
        this.setupThemeToggle();

        this.renderAll();
        this.checkInterviewAlarms();
    }

    cacheDOM() {
        // Navigation links
        this.navItems = document.querySelectorAll('.nav-menu .nav-item');
        this.tabPanels = document.querySelectorAll('.tab-panel');

        // Form trigger
        this.addAppBtn = document.getElementById('add-app-trigger-btn');
        this.appModal = document.getElementById('app-form-modal');
        this.appFormClose = document.getElementById('app-modal-close');
        this.appFormCancel = document.getElementById('app-modal-cancel');
        this.appFormSubmit = document.getElementById('app-modal-submit');
        this.appForm = document.getElementById('app-form');

        // Form inputs
        this.inputId = document.getElementById('edit-app-id');
        this.inputCompany = document.getElementById('app-company');
        this.inputRole = document.getElementById('app-role');
        this.inputStatus = document.getElementById('app-status');
        this.inputPriority = document.getElementById('app-priority');
        this.inputDateApplied = document.getElementById('app-date-applied');
        this.inputDateInterview = document.getElementById('app-date-interview');
        this.inputDomain = document.getElementById('app-domain');
        this.inputSalary = document.getElementById('app-salary');
        this.inputJobUrl = document.getElementById('app-job-url');
        this.inputNotes = document.getElementById('app-notes');
        this.interviewDateGroup = document.getElementById('interview-date-group');

        // Detail View modal
        this.detailsModal = document.getElementById('app-details-modal');
        this.detailsClose = document.getElementById('details-modal-close');
        this.detailLogo = document.getElementById('detail-company-logo');
        this.detailFallback = document.getElementById('detail-company-fallback');
        this.detailCompany = document.getElementById('detail-company-name');
        this.detailRole = document.getElementById('detail-job-role');
        this.detailStatus = document.getElementById('detail-status-badge');
        this.detailPriority = document.getElementById('detail-priority-badge');
        this.detailDateApplied = document.getElementById('detail-date-applied');
        this.detailDateInterview = document.getElementById('detail-date-interview');
        this.detailSalary = document.getElementById('detail-salary');
        this.detailJobUrl = document.getElementById('detail-job-url');
        this.detailNotes = document.getElementById('detail-notes');
        this.detailEditBtn = document.getElementById('detail-edit-btn');
        this.detailDeleteBtn = document.getElementById('detail-delete-btn');

        // Filter elements
        this.globalSearchInput = document.getElementById('global-search-input');
        this.filterStatusSelect = document.getElementById('filter-status-select');
        this.filterPrioritySelect = document.getElementById('filter-priority-select');
        this.sortSelect = document.getElementById('sort-select');
        this.resetFiltersBtn = document.getElementById('reset-filters-btn');

        // Lists containers
        this.jobCardsContainer = document.getElementById('job-cards-container');
        this.upcomingListContainer = document.getElementById('upcoming-interviews-list');
        this.upcomingEmptyEl = document.getElementById('upcoming-interviews-empty');

        // Backup and settings
        this.exportCsvBtn = document.getElementById('export-csv-btn');
        this.importFileInput = document.getElementById('import-file-input');
        this.importCsvBtn = document.getElementById('import-csv-btn');
        this.importFilename = document.getElementById('import-filename');
        this.saveSettingsBtn = document.getElementById('save-settings-btn');
        this.settingsCurrencySelect = document.getElementById('settings-currency');
        this.resetAllDataBtn = document.getElementById('reset-app-data-btn');

        // Form and Converter elements
        this.inputSalaryCurrency = document.getElementById('app-salary-currency');
        this.converterUsd = document.getElementById('converter-usd');
        this.converterInr = document.getElementById('converter-inr');
    }

    bindEvents() {
        // App form modal triggers
        this.addAppBtn.addEventListener('click', () => {
            this.openFormModal();
        });
        
        this.appFormClose.addEventListener('click', () => this.closeModal(this.appModal));
        this.appFormCancel.addEventListener('click', () => this.closeModal(this.appModal));
        this.detailsClose.addEventListener('click', () => this.closeModal(this.detailsModal));

        // Submit form
        this.appForm.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Toggles interview date field depending on status
        this.inputStatus.addEventListener('change', () => this.toggleInterviewDateField());

        // Search & filter list views
        if (this.globalSearchInput) {
            this.globalSearchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value;
                this.renderTabViews();
            });
        }

        this.filterStatusSelect.addEventListener('change', (e) => {
            this.filters.status = e.target.value;
            this.renderTabViews();
        });

        this.filterPrioritySelect.addEventListener('change', (e) => {
            this.filters.priority = e.target.value;
            this.renderTabViews();
        });

        this.sortSelect.addEventListener('change', (e) => {
            this.filters.sort = e.target.value;
            this.renderTabViews();
        });

        this.resetFiltersBtn.addEventListener('click', () => {
            this.filterStatusSelect.value = 'all';
            this.filterPrioritySelect.value = 'all';
            this.sortSelect.value = 'dateApplied-desc';
            
            this.filters.status = 'all';
            this.filters.priority = 'all';
            this.filters.sort = 'dateApplied-desc';
            
            this.renderTabViews();
        });

        // CSV utilities
        this.exportCsvBtn.addEventListener('click', () => this.exportCSVData());

        this.importFileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                this.importFilename.textContent = file.name;
                this.importCsvBtn.disabled = false;
            }
        });

        this.importCsvBtn.addEventListener('click', () => this.importCSVData());

        // Save Currency settings
        this.saveSettingsBtn.addEventListener('click', () => {
            this.settings.currency = this.settingsCurrencySelect.value;
            this.saveState();
            this.renderAll();
            alert('Currency configurations updated!');
        });

        // Wiping database
        this.resetAllDataBtn.addEventListener('click', () => this.resetAllSystemData());

        // Currency converter widget real-time synchronization
        if (this.converterUsd && this.converterInr) {
            this.converterUsd.addEventListener('input', () => {
                const usdVal = parseFloat(this.converterUsd.value);
                if (!isNaN(usdVal)) {
                    this.converterInr.value = (usdVal * 83.5).toFixed(2);
                } else {
                    this.converterInr.value = '';
                }
            });

            this.converterInr.addEventListener('input', () => {
                const inrVal = parseFloat(this.converterInr.value);
                if (!isNaN(inrVal)) {
                    this.converterUsd.value = (inrVal / 83.5).toFixed(2);
                } else {
                    this.converterUsd.value = '';
                }
            });
        }
    }

    /* -------------------------------------------------------------
       Tab Navigation System
       ------------------------------------------------------------- */
    setupTabNavigation() {
        this.navItems.forEach(item => {
            item.addEventListener('click', () => {
                const tab = item.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });
    }

    switchTab(tabName) {
        this.activeTab = tabName;
        
        this.navItems.forEach(item => {
            if (item.getAttribute('data-tab') === tabName) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        this.tabPanels.forEach(panel => {
            if (panel.id === tabName) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });

        // Update headers titles
        const titles = {
            'dashboard': 'Dashboard Overview',
            'list-view': 'Applications Directory',
            'kanban-view': 'Kanban Board',
            'calendar-view': 'Interview Calendar',
            'settings-view': 'Settings & Backups'
        };

        const subtitles = {
            'dashboard': 'Track, optimize, and organize your job applications.',
            'list-view': 'Full registry of all submitted job positions.',
            'kanban-view': 'Drag and drop application files to adjust status instantly.',
            'calendar-view': 'Interactive roadmap of scheduled company interviews.',
            'settings-view': 'Import, export, and clear local database caches.'
        };

        document.getElementById('page-title').textContent = titles[tabName] || 'Dashboard';
        document.getElementById('page-subtitle').textContent = subtitles[tabName] || '';

        // Trigger sub-view updates
        if (tabName === 'dashboard') {
            this.renderCharts();
        } else if (tabName === 'calendar-view') {
            this.calendar.render();
        }
    }

    /* -------------------------------------------------------------
       Theme Orchestration (Light / Dark)
       ------------------------------------------------------------- */
    setupThemeToggle() {
        const themeCheckbox = document.getElementById('theme-checkbox');
        const themeLabel = document.querySelector('.toggle-label');

        themeCheckbox.addEventListener('change', (e) => {
            const isDark = e.target.checked;
            this.setTheme(isDark);
        });

        // Set initial checkbox state
        themeCheckbox.checked = document.body.classList.contains('dark-theme');
        this.updateThemeLabel(themeCheckbox.checked);
    }

    setTheme(isDark) {
        if (isDark) {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            localStorage.setItem('aether_theme', 'dark');
        } else {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            localStorage.setItem('aether_theme', 'light');
        }
        
        this.updateThemeLabel(isDark);
        // Re-render charts to adjust text colors
        if (this.activeTab === 'dashboard') {
            this.renderCharts();
        }
    }

    updateThemeLabel(isDark) {
        const themeLabel = document.querySelector('.toggle-label');
        if (themeLabel) {
            themeLabel.innerHTML = isDark ? `<i data-lucide="moon"></i> Dark Theme` : `<i data-lucide="sun"></i> Light Theme`;
            lucide.createIcons();
        }
    }

    /* -------------------------------------------------------------
       Modals controls
       ------------------------------------------------------------- */
    openFormModal(appData = null) {
        this.appModal.classList.remove('hidden');
        this.toggleInterviewDateField();

        if (appData) {
            document.getElementById('modal-form-title').textContent = 'Edit Job Application';
            this.appFormSubmit.textContent = 'Save Changes';
            
            // Prefill inputs
            this.inputId.value = appData.id;
            this.inputCompany.value = appData.company;
            this.inputRole.value = appData.role;
            this.inputStatus.value = appData.status;
            this.inputPriority.value = appData.priority;
            this.inputDateApplied.value = appData.dateApplied;
            this.inputDateInterview.value = appData.dateInterview || '';
            this.inputDomain.value = appData.domain || '';
            this.inputSalary.value = appData.salary || '';
            if (this.inputSalaryCurrency) {
                this.inputSalaryCurrency.value = appData.salaryCurrency || (appData.salary >= 500000 ? '₹' : '$');
            }
            this.inputJobUrl.value = appData.jobUrl || '';
            this.inputNotes.value = appData.notes || '';
            
            this.toggleInterviewDateField();
        } else {
            document.getElementById('modal-form-title').textContent = 'Add Job Application';
            this.appFormSubmit.textContent = 'Create Record';
            this.appForm.reset();
            this.inputId.value = '';
            
            // Default applied date to today
            this.inputDateApplied.value = new Date().toISOString().split('T')[0];
            if (this.inputSalaryCurrency) {
                this.inputSalaryCurrency.value = this.settings.currency || '₹';
            }
            this.toggleInterviewDateField();
        }
    }

    closeModal(modal) {
        modal.classList.add('hidden');
    }

    toggleInterviewDateField() {
        const isInterview = this.inputStatus.value === 'Interview';
        if (isInterview) {
            this.interviewDateGroup.classList.remove('hidden');
            this.inputDateInterview.required = true;
        } else {
            this.interviewDateGroup.classList.add('hidden');
            this.inputDateInterview.required = false;
        }
    }

    /* -------------------------------------------------------------
       State Persistence and Database Seeds
       ------------------------------------------------------------- */
    loadState() {
        // Theme setting
        const storedTheme = localStorage.getItem('aether_theme') || 'dark';
        if (storedTheme === 'dark') {
            document.body.className = 'dark-theme';
        } else {
            document.body.className = 'light-theme';
        }

        // Load applications data
        const localData = localStorage.getItem('aether_applications');
        if (localData) {
            this.applications = JSON.parse(localData);
        } else {
            this.loadSeedData();
        }

        // Load settings configs
        const localSettings = localStorage.getItem('aether_settings');
        if (localSettings) {
            this.settings = JSON.parse(localSettings);
        }
        
        if (this.settingsCurrencySelect) {
            this.settingsCurrencySelect.value = this.settings.currency;
        }
    }

    saveState() {
        localStorage.setItem('aether_applications', JSON.stringify(this.applications));
        localStorage.setItem('aether_settings', JSON.stringify(this.settings));
    }

    loadSeedData() {
        // Dynamic dates calculation
        const formatDateOffset = (offset) => {
            const d = new Date();
            d.setDate(d.getDate() + offset);
            return d.toISOString().split('T')[0];
        };

        this.applications = [
            {
                id: 'job-1',
                company: 'Google',
                role: 'Senior Software Engineer',
                status: 'Offer',
                priority: 'high',
                dateApplied: formatDateOffset(-20),
                dateInterview: formatDateOffset(-5),
                domain: 'google.com',
                salary: 2800000,
                jobUrl: 'https://careers.google.com/',
                notes: 'Recruiter call: Sarah. Completed system design round. Recruiter confirmed offer details on Monday. Extremely excited about the workspace and team alignment!'
            },
            {
                id: 'job-2',
                company: 'Stripe',
                role: 'Full Stack Engineer',
                status: 'Interview',
                priority: 'high',
                dateApplied: formatDateOffset(-10),
                dateInterview: formatDateOffset(1), // Tomorrow
                domain: 'stripe.com',
                salary: 2400000,
                jobUrl: 'https://stripe.com/jobs',
                notes: 'Technical assessment completed. Code screen schedule booked for Wednesday. Prepare core Stripe API integration details and custom react widgets.'
            },
            {
                id: 'job-3',
                company: 'Airbnb',
                role: 'Frontend Engineer',
                status: 'Applied',
                priority: 'medium',
                dateApplied: formatDateOffset(-8),
                dateInterview: '',
                domain: 'airbnb.com',
                salary: 2200000,
                jobUrl: 'https://careers.airbnb.com/',
                notes: 'Submitted application portfolio. Recruiter reached out confirming receipt. Focus review on general layout accessibility and Web Performance optimization.'
            },
            {
                id: 'job-4',
                company: 'Microsoft',
                role: 'Software Engineer II',
                status: 'Pending',
                priority: 'medium',
                dateApplied: formatDateOffset(-14),
                dateInterview: '',
                domain: 'microsoft.com',
                salary: 2000000,
                jobUrl: 'https://careers.microsoft.com/',
                notes: 'Referral submitted by engineering connection. Reached out to recruiter on LinkedIn to follow up on status.'
            },
            {
                id: 'job-5',
                company: 'Netflix',
                role: 'React UI Specialist',
                status: 'Rejected',
                priority: 'low',
                dateApplied: formatDateOffset(-30),
                dateInterview: formatDateOffset(-12),
                domain: 'netflix.com',
                salary: 3600000,
                jobUrl: 'https://jobs.netflix.com/',
                notes: 'Completed loop. Focus design requirements were highly specific. Recruiter emailed confirmation: rejected candidate process. Great feedback on system UI though.'
            }
        ];

        this.saveState();
    }

    /* -------------------------------------------------------------
       Dashboard KPI calculations
       ------------------------------------------------------------- */
    renderAll() {
        this.renderKPIs();
        this.renderCharts();
        this.renderTabViews();
    }

    renderTabViews() {
        this.renderListTab();
        this.renderKanbanTab();
        
        if (this.calendar) {
            this.calendar.render();
        }
    }

    renderKPIs() {
        // KPI 1: Total Apps
        const total = this.applications.length;
        document.getElementById('kpi-total-apps').textContent = total;

        // KPI 2: Interviews Count
        const interviews = this.applications.filter(app => app.status === 'Interview');
        document.getElementById('kpi-interviews-count').textContent = interviews.length;

        const nextBadge = document.getElementById('kpi-next-interview');
        const futureInterviews = interviews
            .filter(app => app.dateInterview && new Date(app.dateInterview) >= new Date().setHours(0,0,0,0))
            .sort((a,b) => new Date(a.dateInterview) - new Date(b.dateInterview));

        if (futureInterviews.length > 0) {
            const nextInt = futureInterviews[0];
            const diffDays = this.calculateDaysRemaining(nextInt.dateInterview);
            
            if (diffDays === 0) {
                nextBadge.textContent = `${nextInt.company} (Today!)`;
            } else if (diffDays === 1) {
                nextBadge.textContent = `${nextInt.company} (Tomorrow)`;
            } else {
                nextBadge.textContent = `${nextInt.company} in ${diffDays}d`;
            }
        } else {
            nextBadge.textContent = 'None scheduled';
        }

        // KPI 3: Offers Received
        const offers = this.applications.filter(app => app.status === 'Offer');
        document.getElementById('kpi-offers-count').textContent = offers.length;

        // Conversion pct
        const pctEl = document.getElementById('kpi-offer-pct');
        if (total > 0) {
            const pct = Math.round((offers.length / total) * 100);
            pctEl.textContent = `${pct}% conversion rate`;
        } else {
            pctEl.textContent = '0% conversion rate';
        }

        // KPI 4: Success Rate
        // Success Rate definition: Offers / (Offers + Rejections) or Offers / Total
        // Let's use finalized processes: Offers / (Offers + Rejections) to show final success, or simply Offers / Total.
        // Let's use (Offers / Total Applications) * 100 for absolute success metrics
        const successRateEl = document.getElementById('kpi-success-rate');
        if (total > 0) {
            const finalP = Math.round((offers.length / total) * 100);
            successRateEl.textContent = `${finalP}%`;
        } else {
            successRateEl.textContent = '0%';
        }

        // Dashboard Summary Side stats
        const pendingCount = this.applications.filter(app => app.status === 'Pending').length;
        const interviewCount = interviews.length;
        const rejectedCount = this.applications.filter(app => app.status === 'Rejected').length;
        const appliedCount = this.applications.filter(app => app.status === 'Applied').length;

        document.getElementById('analytics-pending-count').textContent = pendingCount;
        document.getElementById('analytics-interview-count').textContent = interviewCount;
        document.getElementById('analytics-rejected-count').textContent = rejectedCount;
        document.getElementById('analytics-applied-count').textContent = appliedCount;

        // Upcoming interview sidebar list
        this.renderUpcomingInterviews(futureInterviews);
    }

    renderUpcomingInterviews(interviewsList) {
        if (interviewsList.length === 0) {
            this.upcomingEmptyEl.classList.remove('hidden');
            this.upcomingListContainer.innerHTML = '';
            return;
        }

        this.upcomingEmptyEl.classList.add('hidden');
        
        this.upcomingListContainer.innerHTML = interviewsList.map(app => {
            const logo = app.domain ? `https://logo.clearbit.com/${app.domain}` : '';
            const fallbackChar = app.company.charAt(0).toUpperCase();
            
            const logoHtml = logo ? `
                <img class="upcoming-logo" src="${logo}" alt="${app.company} logo" onerror="this.outerHTML='<div class=&quot;upcoming-logo job-logo-fallback&quot;>${fallbackChar}</div>'">
            ` : `
                <div class="upcoming-logo job-logo-fallback">${fallbackChar}</div>
            `;

            return `
                <li class="upcoming-item" onclick="window.app.showApplicationDetails('${app.id}')">
                    <div class="upcoming-item-left">
                        ${logoHtml}
                        <div>
                            <div class="upcoming-title">${app.company}</div>
                            <div class="upcoming-role">${app.role}</div>
                        </div>
                    </div>
                    <span class="upcoming-date-tag">${app.dateInterview}</span>
                </li>
            `;
        }).join('');
    }

    /* -------------------------------------------------------------
       Chart rendering using Chart.js
       ------------------------------------------------------------- */
    renderCharts() {
        const volumeCtx = document.getElementById('monthlyVolumeChart');
        const breakdownCtx = document.getElementById('statusBreakdownChart');
        if (!volumeCtx || !breakdownCtx) return;

        // Get Theme Font Colors
        const isDark = document.body.classList.contains('dark-theme');
        const textColor = isDark ? '#94a3b8' : '#475569';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)';

        // 1. Calculate Monthly Volumes
        // Let's analyze dateApplied values and group them by month
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyCounts = Array(12).fill(0);

        this.applications.forEach(app => {
            if (app.dateApplied) {
                const month = new Date(app.dateApplied).getMonth();
                if (month >= 0 && month <= 11) {
                    monthlyCounts[month]++;
                }
            }
        });

        // Limit display to the last 6 months to avoid flat lines
        const currentMonthIndex = new Date().getMonth();
        const displayMonths = [];
        const displayData = [];
        for (let i = 5; i >= 0; i--) {
            let idx = currentMonthIndex - i;
            if (idx < 0) idx += 12;
            displayMonths.push(monthNames[idx]);
            displayData.push(monthlyCounts[idx]);
        }

        // Setup Gradient color
        const volCtx2d = volumeCtx.getContext('2d');
        const gradient = volCtx2d.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, '#3b82f6');
        gradient.addColorStop(1, '#8b5cf6');

        if (this.volumeChart) this.volumeChart.destroy();
        this.volumeChart = new Chart(volumeCtx, {
            type: 'bar',
            data: {
                labels: displayMonths,
                datasets: [{
                    label: 'Applications',
                    data: displayData,
                    backgroundColor: gradient,
                    borderRadius: 6,
                    barPercentage: 0.55
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: isDark ? 'rgba(15, 20, 36, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        titleColor: isDark ? '#ffffff' : '#0f172a',
                        bodyColor: textColor,
                        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 10 } }
                    },
                    y: {
                        grid: { color: gridColor },
                        ticks: { color: textColor, stepSize: 1, font: { family: 'Plus Jakarta Sans', size: 10 } }
                    }
                }
            }
        });

        // 2. Applications Status Breakdown Doughnut Chart
        const statusTypes = ['Applied', 'Pending', 'Interview', 'Offer', 'Rejected'];
        const statusColors = ['#3b82f6', '#f59e0b', '#8b5cf6', '#10b981', '#ef4444'];
        const statusCounts = statusTypes.map(status => {
            return this.applications.filter(app => app.status === status).length;
        });

        if (this.breakdownChart) this.breakdownChart.destroy();
        this.breakdownChart = new Chart(breakdownCtx, {
            type: 'doughnut',
            data: {
                labels: statusTypes,
                datasets: [{
                    data: statusCounts,
                    backgroundColor: statusColors,
                    borderWidth: isDark ? 2 : 1,
                    borderColor: isDark ? '#0f1424' : '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: textColor,
                            font: { family: 'Plus Jakarta Sans', size: 11 },
                            boxWidth: 12
                        }
                    },
                    tooltip: {
                        backgroundColor: isDark ? 'rgba(15, 20, 36, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        titleColor: isDark ? '#ffffff' : '#0f172a',
                        bodyColor: textColor,
                        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                        borderWidth: 1
                    }
                },
                cutout: '65%'
            }
        });
    }

    /* -------------------------------------------------------------
       List registry UI drawing
       ------------------------------------------------------------- */
    renderListTab() {
        let list = [...this.applications];

        // Search filter matching
        if (this.filters.search) {
            const query = this.filters.search.toLowerCase();
            list = list.filter(app => {
                return app.company.toLowerCase().includes(query) || 
                       app.role.toLowerCase().includes(query);
            });
        }

        // Status filter
        if (this.filters.status !== 'all') {
            list = list.filter(app => app.status === this.filters.status);
        }

        // Priority filter
        if (this.filters.priority !== 'all') {
            list = list.filter(app => app.priority === this.filters.priority);
        }

        // Sorting
        const [field, direction] = this.filters.sort.split('-');
        list.sort((a, b) => {
            if (field === 'salary') {
                const salCurrencyA = a.salaryCurrency || (a.salary >= 500000 ? '₹' : '$');
                const salCurrencyB = b.salaryCurrency || (b.salary >= 500000 ? '₹' : '$');
                const convertedSalA = a.salary ? this.convertCurrency(a.salary, salCurrencyA, '$') : 0;
                const convertedSalB = b.salary ? this.convertCurrency(b.salary, salCurrencyB, '$') : 0;
                return direction === 'desc' ? convertedSalB - convertedSalA : convertedSalA - convertedSalB;
            } else if (field === 'company') {
                return a.company.localeCompare(b.company);
            } else {
                // dateApplied
                const dateA = new Date(a.dateApplied || '1970-01-01');
                const dateB = new Date(b.dateApplied || '1970-01-01');
                return direction === 'desc' ? dateB - dateA : dateA - dateB;
            }
        });

        if (list.length === 0) {
            this.jobCardsContainer.innerHTML = `
                <div class="empty-state-text" style="grid-column: 1/span 3; padding: 60px 0;">
                    No applications matched your search options. Click "Add Application" to create a new one!
                </div>
            `;
            return;
        }

        this.jobCardsContainer.innerHTML = list.map(app => {
            const logo = app.domain ? `https://logo.clearbit.com/${app.domain}` : '';
            const fallbackChar = app.company.charAt(0).toUpperCase();

            const logoHtml = logo ? `
                <img class="job-logo" src="${logo}" alt="${app.company} logo" onerror="this.outerHTML='<div class=&quot;job-logo-fallback&quot;>${fallbackChar}</div>'">
            ` : `
                <div class="job-logo-fallback">${fallbackChar}</div>
            `;

            const salaryText = this.getFormattedSalary(app);
            const dateInterviewText = app.status === 'Interview' && app.dateInterview ? `
                <div class="detail-row-item">
                    <i data-lucide="calendar"></i>
                    <span>Interview: <strong>${app.dateInterview}</strong></span>
                </div>
            ` : '';

            return `
                <div class="job-card" onclick="window.app.showApplicationDetails('${app.id}')">
                    <div class="job-card-header">
                        <div class="company-logo-block">
                            ${logoHtml}
                            <div class="job-meta">
                                <h3>${app.company}</h3>
                                <p class="job-role">${app.role}</p>
                            </div>
                        </div>
                        <span class="status-badge badge-${app.status}">${app.status}</span>
                    </div>

                    <div class="job-details-rows">
                        <div class="detail-row-item">
                            <i data-lucide="clock"></i>
                            <span>Applied: ${app.dateApplied}</span>
                        </div>
                        <div class="detail-row-item">
                            <i data-lucide="dollar-sign"></i>
                            <span>Salary: ${salaryText}</span>
                        </div>
                        ${dateInterviewText}
                    </div>

                    <div class="job-card-footer">
                        <span class="priority-indicator-pill priority-${app.priority}">${app.priority}</span>
                        <button class="card-action-btn" title="Edit" onclick="window.app.handleEditAction('${app.id}', event)">
                            <i data-lucide="edit-3" style="width:14px; height:14px;"></i>
                        </button>
                        <button class="card-action-btn delete-btn" title="Delete" onclick="window.app.handleDeleteAction('${app.id}', event)">
                            <i data-lucide="trash-2" style="width:14px; height:14px;"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        lucide.createIcons();
    }

    /* -------------------------------------------------------------
       Kanban Board cards rendering
       ------------------------------------------------------------- */
    renderKanbanTab() {
        const statuses = ['Applied', 'Pending', 'Interview', 'Offer', 'Rejected'];
        
        statuses.forEach(status => {
            const list = this.applications.filter(app => app.status === status);
            
            // Render column cards count badge
            const countBadge = document.getElementById(`count-${status.toLowerCase()}`);
            if (countBadge) countBadge.textContent = list.length;

            const columnZone = document.getElementById(`zone-${status.toLowerCase()}`);
            if (!columnZone) return;

            if (list.length === 0) {
                columnZone.innerHTML = `<div class="empty-state-text" style="font-size:0.8rem; border:1px dashed var(--card-border); border-radius:8px;">Drag here</div>`;
                return;
            }

            columnZone.innerHTML = list.map(app => {
                const priorityClass = `priority-${app.priority}`;
                const salaryVal = this.getFormattedSalaryConcise(app);

                return `
                    <div class="kanban-card" draggable="true" data-id="${app.id}" onclick="window.app.showApplicationDetails('${app.id}')">
                        <div class="kanban-card-title">${app.role}</div>
                        <div class="kanban-card-company">${app.company}</div>
                        
                        <div class="kanban-card-meta">
                            <div class="kanban-card-meta-left">
                                <span class="priority-indicator-pill ${priorityClass}" style="padding:1px 4px; font-size:0.55rem;">${app.priority}</span>
                                ${salaryVal ? `<span>${salaryVal}</span>` : ''}
                            </div>
                            <span>${app.dateApplied}</span>
                        </div>
                    </div>
                `;
            }).join('');

            // Attach drag events to all cards in this column
            const cards = columnZone.querySelectorAll('.kanban-card');
            cards.forEach(card => {
                this.kanbanBoard.attachDraggableEvents(card);
            });
        });
    }

    /* -------------------------------------------------------------
       CRUD Operations
       ------------------------------------------------------------- */
    handleFormSubmit(e) {
        e.preventDefault();

        const id = this.inputId.value;
        const company = this.inputCompany.value.trim();
        const role = this.inputRole.value.trim();
        const status = this.inputStatus.value;
        const priority = this.inputPriority.value;
        const dateApplied = this.inputDateApplied.value;
        const dateInterview = this.inputDateInterview.value;
        const domainInput = this.inputDomain.value.trim();
        const salary = this.inputSalary.value ? parseFloat(this.inputSalary.value) : null;
        const salaryCurrency = this.inputSalaryCurrency ? this.inputSalaryCurrency.value : (this.settings.currency || '₹');
        const jobUrl = this.inputJobUrl.value.trim();
        const notes = this.inputNotes.value.trim();

        if (!company || !role || !dateApplied) return;

        // Domain cleanups
        let domain = '';
        if (domainInput) {
            domain = this.cleanDomainName(domainInput);
        } else {
            // attempt automated extraction from URL if available
            if (jobUrl) domain = this.cleanDomainName(jobUrl);
        }

        if (id) {
            // Edit existing
            const app = this.applications.find(a => a.id === id);
            if (app) {
                app.company = company;
                app.role = role;
                app.status = status;
                app.priority = priority;
                app.dateApplied = dateApplied;
                app.dateInterview = status === 'Interview' ? dateInterview : '';
                app.domain = domain;
                app.salary = salary;
                app.salaryCurrency = salaryCurrency;
                app.jobUrl = jobUrl;
                app.notes = notes;
            }
        } else {
            // Create new
            const newApp = {
                id: 'job-' + Math.random().toString(36).substr(2, 9),
                company,
                role,
                status,
                priority,
                dateApplied,
                dateInterview: status === 'Interview' ? dateInterview : '',
                domain,
                salary,
                salaryCurrency,
                jobUrl,
                notes
            };
            this.applications.push(newApp);
        }

        this.saveState();
        this.closeModal(this.appModal);
        
        // Full Refresh
        this.renderAll();
        this.checkInterviewAlarms();

        // Celebration trigger if they landed an Offer!
        if (status === 'Offer' && !id) {
            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 }
            });
        }
    }

    handleEditAction(id, e) {
        e.stopPropagation(); // ignore card details trigger click
        const app = this.applications.find(a => a.id === id);
        if (app) {
            this.openFormModal(app);
        }
    }

    handleDeleteAction(id, e) {
        e.stopPropagation(); // ignore card details trigger click
        if (confirm("Are you sure you want to permanently delete this application record?")) {
            this.applications = this.applications.filter(a => a.id !== id);
            this.saveState();
            this.renderAll();
            this.checkInterviewAlarms();
        }
    }

    updateApplicationStatus(id, newStatus) {
        const app = this.applications.find(a => a.id === id);
        if (app) {
            app.status = newStatus;
            
            // Clear interview date if status moves away from Interview
            if (newStatus !== 'Interview') {
                app.dateInterview = '';
            } else if (!app.dateInterview) {
                // If set to interview but date is empty, default to tomorrow
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                app.dateInterview = tomorrow.toISOString().split('T')[0];
            }

            this.saveState();
            this.checkInterviewAlarms();
            return true;
        }
        return false;
    }

    showApplicationDetails(id) {
        const app = this.applications.find(a => a.id === id);
        if (!app) return;

        this.detailsModal.classList.remove('hidden');

        // Render company logo or fallback initials
        const logo = app.domain ? `https://logo.clearbit.com/${app.domain}` : '';
        const fallbackChar = app.company.charAt(0).toUpperCase();

        if (logo) {
            this.detailLogo.src = logo;
            this.detailLogo.style.display = 'block';
            this.detailFallback.style.display = 'none';
        } else {
            this.detailLogo.style.display = 'none';
            this.detailFallback.style.display = 'flex';
            this.detailFallback.textContent = fallbackChar;
        }

        this.detailCompany.textContent = app.company;
        this.detailRole.textContent = app.role;
        this.detailNotes.textContent = app.notes || 'No tracking logs or interview notes provided.';
        
        // Status & priority badges
        this.detailStatus.textContent = app.status;
        this.detailStatus.className = `status-badge badge-${app.status}`;
        
        this.detailPriority.textContent = app.priority;
        this.detailPriority.className = `priority-indicator-pill priority-${app.priority}`;

        this.detailDateApplied.textContent = app.dateApplied;
        this.detailDateInterview.textContent = app.status === 'Interview' && app.dateInterview ? app.dateInterview : 'None Scheduled';
        
        const salaryVal = this.getFormattedSalary(app);
        this.detailSalary.textContent = salaryVal;

        if (app.jobUrl) {
            this.detailJobUrl.href = app.jobUrl;
            this.detailJobUrl.style.display = 'inline-block';
            this.detailJobUrl.textContent = 'View Listing Link';
        } else {
            this.detailJobUrl.style.display = 'none';
        }

        // Bind Action buttons within details view
        this.detailEditBtn.onclick = () => {
            this.closeModal(this.detailsModal);
            this.openFormModal(app);
        };

        this.detailDeleteBtn.onclick = () => {
            if (confirm("Are you sure you want to permanently delete this application record?")) {
                this.applications = this.applications.filter(a => a.id !== id);
                this.saveState();
                this.closeModal(this.detailsModal);
                this.renderAll();
                this.checkInterviewAlarms();
            }
        };
    }

    /* -------------------------------------------------------------
       CSV Import / Export backups engines
       ------------------------------------------------------------- */
    exportCSVData() {
        if (this.applications.length === 0) {
            alert('No applications found to export!');
            return;
        }

        const headers = ['Company', 'Role', 'Status', 'Priority', 'DateApplied', 'DateInterview', 'Domain', 'Salary', 'SalaryCurrency', 'JobURL', 'Notes', 'ID'];
        const csvRows = [headers.join(',')];

        this.applications.forEach(app => {
            const row = [
                this.escapeCSVField(app.company),
                this.escapeCSVField(app.role),
                this.escapeCSVField(app.status),
                this.escapeCSVField(app.priority),
                this.escapeCSVField(app.dateApplied),
                this.escapeCSVField(app.dateInterview || ''),
                this.escapeCSVField(app.domain || ''),
                this.escapeCSVField(app.salary || ''),
                this.escapeCSVField(app.salaryCurrency || (app.salary >= 500000 ? '₹' : '$')),
                this.escapeCSVField(app.jobUrl || ''),
                this.escapeCSVField(app.notes || ''),
                this.escapeCSVField(app.id)
            ];
            csvRows.push(row.join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        
        // Trigger browser file download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `AetherTrack_Backup_${new Date().toISOString().split('T')[0]}.csv`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    importCSVData() {
        const file = this.importFileInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            const rows = this.parseCSVText(text);

            if (rows.length < 2) {
                alert('Invalid CSV structure. Make sure the headers match standard export models.');
                return;
            }

            const headers = rows[0].map(h => h.trim().toLowerCase());
            let importedCount = 0;

            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                if (row.length < 2) continue; // skip empty lines

                // Map header index to variables
                const getVal = (headerName) => {
                    const idx = headers.indexOf(headerName.toLowerCase());
                    return idx !== -1 ? row[idx] : '';
                };

                const company = getVal('Company');
                const role = getVal('Role');
                if (!company || !role) continue; // required fields

                const newApp = {
                    id: getVal('ID') || 'job-' + Math.random().toString(36).substr(2, 9),
                    company: company,
                    role: role,
                    status: getVal('Status') || 'Applied',
                    priority: getVal('Priority') || 'medium',
                    dateApplied: getVal('DateApplied') || new Date().toISOString().split('T')[0],
                    dateInterview: getVal('DateInterview') || '',
                    domain: getVal('Domain') || '',
                    salary: getVal('Salary') ? parseFloat(getVal('Salary')) : null,
                    salaryCurrency: getVal('SalaryCurrency') || (getVal('Salary') && parseFloat(getVal('Salary')) >= 500000 ? '₹' : '$'),
                    jobUrl: getVal('JobURL') || '',
                    notes: getVal('Notes') || ''
                };

                // Avoid duplicating exact matches by checking IDs
                const matchIdx = this.applications.findIndex(a => a.id === newApp.id);
                if (matchIdx !== -1) {
                    this.applications[matchIdx] = newApp; // override duplicate
                } else {
                    this.applications.push(newApp); // insert
                }
                importedCount++;
            }

            this.saveState();
            this.renderAll();
            this.checkInterviewAlarms();

            alert(`Successfully imported ${importedCount} job applications!`);

            // Reset upload file elements
            this.importFileInput.value = '';
            this.importFilename.textContent = 'No file chosen';
            this.importCsvBtn.disabled = true;
        };

        reader.readAsText(file);
    }

    escapeCSVField(val) {
        if (val === null || val === undefined) return '""';
        let str = String(val);
        // Replace quotes with double quotes
        str = str.replace(/"/g, '""');
        return `"${str}"`;
    }

    parseCSVText(text) {
        const lines = [];
        let row = [""];
        let inQuotes = false;

        for (let i = 0; i < text.length; i++) {
            const c = text[i];
            const next = text[i+1];

            if (c === '"') {
                if (inQuotes && next === '"') {
                    row[row.length - 1] += '"'; // escaped quote
                    i++;
                } else {
                    inQuotes = !inQuotes; // toggle quote state
                }
            } else if (c === ',' && !inQuotes) {
                row.push(""); // next field
            } else if ((c === '\r' || c === '\n') && !inQuotes) {
                if (c === '\r' && next === '\n') {
                    i++; // skip LF after CR
                }
                lines.push(row);
                row = [""]; // next line
            } else {
                row[row.length - 1] += c;
            }
        }
        if (row.length > 1 || row[0] !== "") {
            lines.push(row);
        }
        return lines;
    }

    /* -------------------------------------------------------------
       Interview reminders alarm banners
       ------------------------------------------------------------- */
    checkInterviewAlarms() {
        const container = document.getElementById('alert-banner-container');
        if (!container) return;

        // Clear existing alerts
        container.innerHTML = '';

        const todayStr = new Date().toISOString().split('T')[0];
        
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];

        // Find interviews scheduled today or tomorrow
        this.applications.forEach(app => {
            if (app.status === 'Interview' && app.dateInterview) {
                if (app.dateInterview === todayStr) {
                    this.createAlarmBanner(container, app, 'Today');
                } else if (app.dateInterview === tomorrowStr) {
                    this.createAlarmBanner(container, app, 'Tomorrow');
                }
            }
        });

        if (container.children.length > 0) {
            container.classList.remove('hidden');
        } else {
            container.classList.add('hidden');
        }
    }

    createAlarmBanner(parentContainer, app, whenText) {
        const banner = document.createElement('div');
        banner.className = `alert-banner ${whenText === 'Today' ? 'alert-today' : ''}`;
        
        banner.innerHTML = `
            <div class="alert-banner-left">
                <i data-lucide="bell-ring"></i>
                <span><strong>Interview Scheduled ${whenText}!</strong> You have an interview with <strong>${app.company}</strong> for the <strong>${app.role}</strong> role.</span>
            </div>
            <div class="alert-banner-close" onclick="this.closest('.alert-banner').remove(); window.app.verifyBannerOverlayVisibility();">
                &times;
            </div>
        `;

        parentContainer.appendChild(banner);
        lucide.createIcons();
    }

    verifyBannerOverlayVisibility() {
        const container = document.getElementById('alert-banner-container');
        if (container && container.children.length === 0) {
            container.classList.add('hidden');
        }
    }

    /* -------------------------------------------------------------
       System resets
       ------------------------------------------------------------- */
    resetAllSystemData() {
        if (confirm("CAUTION: This will wipe your job tracker list, currency configs, and local backups. Are you sure you want to proceed?")) {
            localStorage.clear();
            this.applications = [];
            this.saveState();
            window.location.reload();
        }
    }

    convertCurrency(amount, fromCurrency, toCurrency) {
        if (!amount || !fromCurrency || !toCurrency || fromCurrency === toCurrency) return amount;
        const rates = {
            '$': 1.0,
            '₹': 83.5,
            '€': 0.92,
            '£': 0.79,
            '¥': 158.0
        };
        const amountInUSD = amount / (rates[fromCurrency] || 1.0);
        return amountInUSD * (rates[toCurrency] || 1.0);
    }

    getFormattedSalary(app) {
        if (!app.salary) return 'Not Specified';
        
        let origCurrency = app.salaryCurrency;
        if (!origCurrency) {
            origCurrency = app.salary >= 500000 ? '₹' : '$';
        }
        
        const displayCurrency = this.settings.currency || '₹';
        const convertedVal = this.convertCurrency(app.salary, origCurrency, displayCurrency);
        const displayFormatted = `${displayCurrency}${Math.round(convertedVal).toLocaleString()}`;
        
        if (origCurrency !== displayCurrency) {
            const origFormatted = `${origCurrency}${parseInt(app.salary).toLocaleString()}`;
            return `${displayFormatted} (~${origFormatted})`;
        }
        
        return displayFormatted;
    }

    getFormattedSalaryConcise(app) {
        if (!app.salary) return '';
        
        let origCurrency = app.salaryCurrency;
        if (!origCurrency) {
            origCurrency = app.salary >= 500000 ? '₹' : '$';
        }
        
        const displayCurrency = this.settings.currency || '₹';
        const convertedVal = this.convertCurrency(app.salary, origCurrency, displayCurrency);
        return `${displayCurrency}${Math.round(convertedVal).toLocaleString()}`;
    }

    /* -------------------------------------------------------------
       Helper Utilities
       ------------------------------------------------------------- */
    cleanDomainName(urlOrDomain) {
        if (!urlOrDomain) return '';
        let domain = urlOrDomain.trim().toLowerCase();
        domain = domain.replace(/^(https?:\/\/)?(www\.)?/, '');
        domain = domain.split('/')[0];
        return domain;
    }

    calculateDaysRemaining(dateString) {
        const today = new Date();
        today.setHours(0,0,0,0);
        const target = new Date(dateString);
        target.setHours(0,0,0,0);
        
        const diffTime = target - today;
        return Math.round(diffTime / (1000 * 60 * 60 * 24));
    }
}

// Global initialization
window.app = new JobTrackerApp();
document.addEventListener('DOMContentLoaded', () => {
    window.app.init();
});
