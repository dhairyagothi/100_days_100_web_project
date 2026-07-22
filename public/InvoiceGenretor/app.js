/**
 * BillFlow - Smart Invoice Generator
 * Main Application Script
 */

// ==========================================================================
// GLOBAL STATE & STORAGE
// ==========================================================================

const DEFAULT_SETTINGS = {
    logo: "",
    name: "PixelCraft Studios",
    email: "billing@pixelcraft.io",
    phone: "+1 (555) 789-0123",
    address: "404 Creative Blvd, Suite 800\nAustin, TX 78701",
    currency: "USD",
    taxRate: 10,
    discountRate: 5,
    notes: "Thank you for partnering with PixelCraft Studios!\nPayments are expected within 30 days. Bank: Chase Bank, Acc: 9876-5432-10"
};

const MOCK_INVOICES = [
    {
        id: "mock-inv-1",
        invoiceNumber: "INV-2026-001",
        issueDate: "2026-05-15",
        dueDate: "2026-06-15",
        status: "Paid",
        template: "modern",
        currency: "USD",
        senderLogo: "",
        senderName: "PixelCraft Studios",
        senderEmail: "billing@pixelcraft.io",
        senderPhone: "+1 (555) 789-0123",
        senderAddress: "404 Creative Blvd, Suite 800\nAustin, TX 78701",
        clientName: "Acme Corporation",
        clientEmail: "accounts@acme.com",
        clientPhone: "+1 (555) 123-4567",
        clientAddress: "123 Industrial Parkway\nChicago, IL 60607",
        items: [
            { name: "Enterprise Website Redesign", description: "Figma mockup + Next.js build + Tailwind CSS coding", quantity: 1, price: 4500.00 },
            { name: "UX Strategy & Consulting", description: "Design workshop and stakeholder interviews", quantity: 10, price: 150.00 }
        ],
        taxRate: 10,
        discountRate: 5,
        notes: "Thank you for partnering with PixelCraft Studios!\nPayments are expected within 30 days. Bank: Chase Bank, Acc: 9876-5432-10"
    },
    {
        id: "mock-inv-2",
        invoiceNumber: "INV-2026-002",
        issueDate: "2026-06-01",
        dueDate: "2026-07-01",
        status: "Unpaid",
        template: "corporate",
        currency: "USD",
        senderLogo: "",
        senderName: "PixelCraft Studios",
        senderEmail: "billing@pixelcraft.io",
        senderPhone: "+1 (555) 789-0123",
        senderAddress: "404 Creative Blvd, Suite 800\nAustin, TX 78701",
        clientName: "Stark Industries",
        clientEmail: "invoice@stark.com",
        clientPhone: "+1 (555) 300-3000",
        clientAddress: "10880 Malibu Point\nMalibu, CA 90265",
        items: [
            { name: "Arc Reactor Software Calibration", description: "Firmware updates for clean energy grid feedback loop", quantity: 2, price: 12500.00 },
            { name: "AI Jarvis System Integration", description: "Integration of vocal diagnostic systems", quantity: 1, price: 5000.00 }
        ],
        taxRate: 12.5,
        discountRate: 0,
        notes: "Payment via direct wire transfer only. Stark Industries terms apply."
    },
    {
        id: "mock-inv-3",
        invoiceNumber: "INV-2026-003",
        issueDate: "2026-06-05",
        dueDate: "2026-07-05",
        status: "Draft",
        template: "minimal",
        currency: "EUR",
        senderLogo: "",
        senderName: "PixelCraft Studios",
        senderEmail: "billing@pixelcraft.io",
        senderPhone: "+1 (555) 789-0123",
        senderAddress: "404 Creative Blvd, Suite 800\nAustin, TX 78701",
        clientName: "Wayne Enterprises",
        clientEmail: "finance@waynecorp.com",
        clientPhone: "+1 (555) 777-8888",
        clientAddress: "1007 Mountain Drive\nGotham City, NJ 07001",
        items: [
            { name: "Urban Navigation Assist Upgrade", description: "Batmobile tactical HUD mapping systems design", quantity: 1, price: 8000.00 },
            { name: "High-Tensile Armor Prototyping", description: "Composite carbon fiber plating development", quantity: 5, price: 1200.00 }
        ],
        taxRate: 8,
        discountRate: 10,
        notes: "Draft copy. Send to Lucius Fox for review before finalizing payment request."
    }
];

const CURRENCIES = {
    USD: { symbol: "$", code: "USD" },
    EUR: { symbol: "€", code: "EUR" },
    GBP: { symbol: "£", code: "GBP" },
    INR: { symbol: "₹", code: "INR" },
    CAD: { symbol: "C$", code: "CAD" },
    AUD: { symbol: "A$", code: "AUD" },
    JPY: { symbol: "¥", code: "JPY" },
    CNY: { symbol: "¥", code: "CNY" }
};

let state = {
    invoices: [],
    companySettings: { ...DEFAULT_SETTINGS },
    activeInvoice: null,
    theme: "light",
    currentView: "dashboard"
};

// ==========================================================================
// ADVANCED SEARCH & FILTERING STATE
// ==========================================================================

let filterState = {
    status: 'All',
    search: '',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: '',
    tags: [],
    sortBy: 'issueDate',
    sortOrder: 'desc',
    currentPage: 1,
    pageSize: 10
};

let savedSearches = [];
let allTags = [];
let filteredInvoicesCache = [];

// ==========================================================================
// LIFE CYCLE & INITIALIZATION
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

function initApp() {
    // 1. Theme Configuration
    const savedTheme = localStorage.getItem("bf_theme");
    if (savedTheme) {
        state.theme = savedTheme;
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        state.theme = "dark";
    }
    updateThemeUI();

    // 2. Settings Configuration
    const savedSettings = localStorage.getItem("bf_settings");
    if (savedSettings) {
        state.companySettings = JSON.parse(savedSettings);
    } else {
        localStorage.setItem("bf_settings", JSON.stringify(DEFAULT_SETTINGS));
    }

    // 3. Invoices Configuration
    const savedInvoices = localStorage.getItem("bf_invoices");
    if (savedInvoices) {
        state.invoices = JSON.parse(savedInvoices);
    } else {
        state.invoices = [...MOCK_INVOICES];
        localStorage.setItem("bf_invoices", JSON.stringify(state.invoices));
    }

    // 4. Setup Default Form values in settings view
    populateSettingsForm();

    // 5. Initialize Advanced Features
    initAdvancedFeatures();

    // 6. Initialize Listeners
    setupEventListeners();

    // 7. Initial Render of current view (Dashboard)
    renderActiveView();
    showToast("Application loaded successfully", "success");
}

// ==========================================================================
// ROUTING & VIEW TOGGLING
// ==========================================================================

function switchView(viewName) {
    state.currentView = viewName;
    renderActiveView();

    document.querySelectorAll(".menu-item").forEach(item => {
        if (item.getAttribute("data-view") === viewName) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });

    closeInvoiceModal();
}

function renderActiveView() {
    document.querySelectorAll(".app-view").forEach(view => {
        view.classList.remove("active-view");
    });

    const viewElement = document.getElementById(`view-${state.currentView}`);
    if (viewElement) {
        viewElement.classList.add("active-view");
    }

    if (state.currentView === "dashboard") {
        renderDashboard();
    } else if (state.currentView === "history") {
        renderHistory();
    }
}

// ==========================================================================
// THEME SWITCHER
// ==========================================================================

function updateThemeUI() {
    const body = document.body;
    const themeToggleBtn = document.getElementById("theme-toggle");
    const toggleIcon = themeToggleBtn.querySelector("i");
    const toggleText = themeToggleBtn.querySelector("span");

    if (state.theme === "dark") {
        body.classList.add("dark-mode");
        body.classList.remove("light-mode");
        toggleIcon.className = "fa-solid fa-sun";
        toggleText.textContent = "Light Mode";
    } else {
        body.classList.add("light-mode");
        body.classList.remove("dark-mode");
        toggleIcon.className = "fa-solid fa-moon";
        toggleText.textContent = "Dark Mode";
    }
}

function toggleTheme() {
    state.theme = state.theme === "light" ? "dark" : "light";
    localStorage.setItem("bf_theme", state.theme);
    updateThemeUI();
    showToast(`Switched to ${state.theme} theme`, "success");
}

// ==========================================================================
// ANALYTICS & DASHBOARD VIEW
// ==========================================================================

function calculateAnalytics() {
    let totalRevenue = 0;
    let totalBilled = 0;
    let pendingCollection = 0;
    let paidCount = 0;
    let unpaidCount = 0;
    let draftCount = 0;

    state.invoices.forEach(inv => {
        const total = getInvoiceGrandTotal(inv);
        if (inv.status === "Paid") {
            totalRevenue += total;
            totalBilled += total;
            paidCount++;
        } else if (inv.status === "Unpaid") {
            pendingCollection += total;
            totalBilled += total;
            unpaidCount++;
        } else if (inv.status === "Draft") {
            draftCount++;
        }
    });

    const collectionRate = totalBilled > 0 ? Math.round((totalRevenue / totalBilled) * 100) : 0;

    return {
        totalRevenue,
        totalBilled,
        pendingCollection,
        invoiceCount: state.invoices.length,
        collectionRate,
        paidCount,
        unpaidCount,
        draftCount
    };
}

function renderDashboard() {
    const analytics = calculateAnalytics();
    
    document.getElementById("stat-revenue").textContent = formatCurrency(analytics.totalRevenue, state.companySettings.currency);
    document.getElementById("stat-billed").textContent = formatCurrency(analytics.totalBilled, state.companySettings.currency);
    document.getElementById("stat-pending").textContent = formatCurrency(analytics.pendingCollection, state.companySettings.currency);
    
    document.getElementById("stat-count").textContent = `${state.invoices.length} Invoices generated`;
    document.getElementById("stat-pending-count").textContent = `${analytics.unpaidCount} unpaid invoices`;
    
    document.getElementById("stat-rate").textContent = `${analytics.collectionRate}%`;
    document.getElementById("stat-rate-bar").style.width = `${analytics.collectionRate}%`;

    const recentList = document.getElementById("recent-invoices-list");
    const emptyState = document.getElementById("dashboard-empty-state");
    recentList.innerHTML = "";

    const sortedInvoices = [...state.invoices].sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));
    const recentInvoices = sortedInvoices.slice(0, 5);

    if (recentInvoices.length === 0) {
        emptyState.style.display = "flex";
        recentList.closest(".table-responsive").style.display = "none";
    } else {
        emptyState.style.display = "none";
        recentList.closest(".table-responsive").style.display = "block";

        recentInvoices.forEach(inv => {
            const row = document.createElement("tr");
            const total = getInvoiceGrandTotal(inv);
            const statusClass = inv.status === "Paid" ? "badge-paid" : (inv.status === "Unpaid" ? "badge-unpaid" : "badge-draft");
            
            row.innerHTML = `
                <td><strong>${inv.invoiceNumber}</strong></td>
                <td>${inv.clientName || '<em class="text-muted">No Client</em>'}</td>
                <td>${formatDate(inv.issueDate)}</td>
                <td>${formatDate(inv.dueDate)}</td>
                <td><strong>${formatCurrency(total, inv.currency)}</strong></td>
                <td><span class="badge ${statusClass}">${inv.status}</span></td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn" onclick="openInvoiceDetailsModal('${inv.id}')" title="Quick View">
                            <i class="fa-regular fa-eye"></i>
                        </button>
                        <button class="action-btn" onclick="triggerEditInvoice('${inv.id}')" title="Edit Invoice">
                            <i class="fa-solid fa-pencil"></i>
                        </button>
                        <button class="action-btn" onclick="triggerDuplicateInvoice('${inv.id}')" title="Duplicate">
                            <i class="fa-regular fa-copy"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="triggerDeleteInvoice('${inv.id}')" title="Delete">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </div>
                </td>
            `;
            recentList.appendChild(row);
        });
    }

    document.getElementById("active-currency-display").textContent = `${state.companySettings.currency} (${getCurrencySymbol(state.companySettings.currency)})`;
}

// ==========================================================================
// INVOICE HISTORY & SEARCH VIEW
// ==========================================================================

function renderHistory() {
    const listContainer = document.getElementById("history-invoices-list");
    const emptyState = document.getElementById("history-empty-state");
    listContainer.innerHTML = "";

    const statusFilter = document.getElementById("filter-status").value;
    const searchFilter = document.getElementById("filter-search").value.toLowerCase().trim();

    filteredInvoicesCache = state.invoices.filter(inv => {
        if (statusFilter !== "All" && inv.status !== statusFilter) return false;

        if (searchFilter) {
            const numMatch = inv.invoiceNumber.toLowerCase().includes(searchFilter);
            const clientMatch = (inv.clientName || "").toLowerCase().includes(searchFilter);
            const companyMatch = (inv.senderName || "").toLowerCase().includes(searchFilter);
            if (!numMatch && !clientMatch && !companyMatch) return false;
        }

        if (filterState.dateFrom) {
            const issueDate = new Date(inv.issueDate);
            const fromDate = new Date(filterState.dateFrom);
            if (issueDate < fromDate) return false;
        }
        if (filterState.dateTo) {
            const issueDate = new Date(inv.issueDate);
            const toDate = new Date(filterState.dateTo);
            toDate.setHours(23, 59, 59);
            if (issueDate > toDate) return false;
        }

        const total = getInvoiceGrandTotal(inv);
        if (filterState.amountMin) {
            const min = parseFloat(filterState.amountMin);
            if (total < min) return false;
        }
        if (filterState.amountMax) {
            const max = parseFloat(filterState.amountMax);
            if (total > max) return false;
        }

        if (filterState.tags.length > 0) {
            const invTags = getInvoiceTags(inv);
            const hasTag = filterState.tags.some(tag => invTags.includes(tag));
            if (!hasTag) return false;
        }

        return true;
    });

    filteredInvoicesCache.sort((a, b) => {
        let aVal, bVal;
        
        switch (filterState.sortBy) {
            case 'invoiceNumber':
                aVal = a.invoiceNumber || '';
                bVal = b.invoiceNumber || '';
                break;
            case 'clientName':
                aVal = a.clientName || '';
                bVal = b.clientName || '';
                break;
            case 'issueDate':
                aVal = new Date(a.issueDate || 0);
                bVal = new Date(b.issueDate || 0);
                break;
            case 'dueDate':
                aVal = new Date(a.dueDate || 0);
                bVal = new Date(b.dueDate || 0);
                break;
            case 'amount':
                aVal = getInvoiceGrandTotal(a);
                bVal = getInvoiceGrandTotal(b);
                break;
            default:
                aVal = new Date(a.issueDate || 0);
                bVal = new Date(b.issueDate || 0);
        }
        
        if (aVal < bVal) return filterState.sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return filterState.sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const totalItems = filteredInvoicesCache.length;
    const totalPages = Math.ceil(totalItems / filterState.pageSize);
    const startIndex = (filterState.currentPage - 1) * filterState.pageSize;
    const endIndex = Math.min(startIndex + filterState.pageSize, totalItems);
    const pageItems = filteredInvoicesCache.slice(startIndex, endIndex);

    document.getElementById('pagination-start').textContent = totalItems > 0 ? startIndex + 1 : 0;
    document.getElementById('pagination-end').textContent = endIndex;
    document.getElementById('pagination-total').textContent = totalItems;
    document.getElementById('pagination-current').textContent = filterState.currentPage;
    document.getElementById('pagination-prev').disabled = filterState.currentPage <= 1;
    document.getElementById('pagination-next').disabled = filterState.currentPage >= totalPages;

    if (pageItems.length === 0) {
        emptyState.style.display = "flex";
        listContainer.closest(".table-responsive").style.display = "none";
        document.getElementById('pagination-container').style.display = 'none';
        return;
    }
    
    emptyState.style.display = "none";
    listContainer.closest(".table-responsive").style.display = "block";
    document.getElementById('pagination-container').style.display = 'flex';

    pageItems.forEach(inv => {
        const row = document.createElement("tr");
        const total = getInvoiceGrandTotal(inv);
        const statusClass = inv.status === "Paid" ? "badge-paid" : (inv.status === "Unpaid" ? "badge-unpaid" : "badge-draft");
        const tags = getInvoiceTags(inv);
        
        row.innerHTML = `
            <td><strong>${inv.invoiceNumber}</strong></td>
            <td>${inv.clientName || '<em class="text-muted">No Client</em>'}</td>
            <td>${formatDate(inv.issueDate)}</td>
            <td>${formatDate(inv.dueDate)}</td>
            <td><strong>${formatCurrency(total, inv.currency)}</strong></td>
            <td>
                <span class="badge ${statusClass} cursor-pointer" onclick="toggleInvoiceStatus('${inv.id}')" title="Click to cycle status">
                    ${inv.status} <i class="fa-solid fa-arrows-spin" style="font-size:10px; margin-left: 4px;"></i>
                </span>
            </td>
            <td>
                ${tags.length > 0 ? tags.map(tag => 
                    `<span style="display: inline-block; padding: 2px 8px; background: var(--bg-app); border-radius: 12px; font-size: 10px; color: var(--text-subtitle); margin: 2px;">${tag}</span>`
                ).join('') : '<span style="color: var(--text-muted); font-size: 11px;">No tags</span>'}
            </td>
            <td>
                <div class="table-actions">
                    <button class="action-btn" onclick="openInvoiceDetailsModal('${inv.id}')" title="Quick View">
                        <i class="fa-regular fa-eye"></i>
                    </button>
                    <button class="action-btn" onclick="triggerEditInvoice('${inv.id}')" title="Edit Invoice">
                        <i class="fa-solid fa-pencil"></i>
                    </button>
                    <button class="action-btn" onclick="triggerDuplicateInvoice('${inv.id}')" title="Duplicate">
                        <i class="fa-regular fa-copy"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="triggerDeleteInvoice('${inv.id}')" title="Delete">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </div>
            </td>
        `;
        listContainer.appendChild(row);
    });
}

function getInvoiceTags(inv) {
    if (inv.tags) return inv.tags;
    
    const tags = [];
    if (inv.clientName) {
        const name = inv.clientName.toLowerCase();
        if (name.includes('design') || name.includes('creative')) tags.push('Design');
        if (name.includes('tech') || name.includes('soft') || name.includes('dev')) tags.push('Development');
        if (name.includes('consult') || name.includes('advis')) tags.push('Consulting');
        if (name.includes('hard') || name.includes('equip')) tags.push('Hardware');
    }
    if (tags.length === 0) tags.push('General');
    
    return tags;
}

function toggleInvoiceStatus(id) {
    const invIndex = state.invoices.findIndex(inv => inv.id === id);
    if (invIndex === -1) return;

    const currentStatus = state.invoices[invIndex].status;
    let nextStatus = "Draft";
    if (currentStatus === "Draft") nextStatus = "Unpaid";
    else if (currentStatus === "Unpaid") nextStatus = "Paid";

    state.invoices[invIndex].status = nextStatus;
    localStorage.setItem("bf_invoices", JSON.stringify(state.invoices));
    renderHistory();
    showToast(`Invoice ${state.invoices[invIndex].invoiceNumber} set to ${nextStatus}`, "success");
}

// ==========================================================================
// ADVANCED SEARCH & FILTERING FUNCTIONS
// ==========================================================================

function loadSavedSearches() {
    const saved = localStorage.getItem('bf_saved_searches');
    if (saved) {
        savedSearches = JSON.parse(saved);
    } else {
        savedSearches = [];
        localStorage.setItem('bf_saved_searches', JSON.stringify(savedSearches));
    }
}

function loadTags() {
    const tags = localStorage.getItem('bf_tags');
    if (tags) {
        allTags = JSON.parse(tags);
    } else {
        allTags = ['Design', 'Development', 'Consulting', 'Software', 'Hardware'];
        localStorage.setItem('bf_tags', JSON.stringify(allTags));
    }
}

function saveTags() {
    localStorage.setItem('bf_tags', JSON.stringify(allTags));
    populateTagDropdown();
}

function populateTagDropdown() {
    const dropdown = document.getElementById('filter-tags');
    if (!dropdown) return;
    
    dropdown.innerHTML = '<option value="All">All Tags</option>';
    allTags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        dropdown.appendChild(option);
    });
}

function addNewTag() {
    const tagName = prompt('Enter new tag name:');
    if (tagName && tagName.trim()) {
        const trimmedTag = tagName.trim();
        if (!allTags.includes(trimmedTag)) {
            allTags.push(trimmedTag);
            saveTags();
            showToast(`Tag "${trimmedTag}" added successfully`, 'success');
        } else {
            showToast('Tag already exists', 'warning');
        }
    }
}

function toggleAdvancedFilters() {
    const panel = document.getElementById('advanced-filters-panel');
    const btn = document.getElementById('btn-toggle-advanced');
    
    if (panel.style.display === 'none') {
        panel.style.display = 'block';
        btn.innerHTML = '<i class="fa-solid fa-chevron-up"></i> Hide Advanced Filters';
    } else {
        panel.style.display = 'none';
        btn.innerHTML = '<i class="fa-solid fa-chevron-down"></i> Advanced Filters';
    }
}

function toggleSavedSearchesDropdown() {
    const dropdown = document.getElementById('saved-searches-dropdown');
    if (dropdown.style.display === 'none') {
        dropdown.style.display = 'block';
        renderSavedSearches();
    } else {
        dropdown.style.display = 'none';
    }
}

function closeSavedSearchesDropdown() {
    document.getElementById('saved-searches-dropdown').style.display = 'none';
}

function renderSavedSearches() {
    const container = document.getElementById('saved-searches-list');
    const emptyMsg = document.getElementById('no-saved-searches');
    
    container.innerHTML = '';
    
    if (savedSearches.length === 0) {
        emptyMsg.style.display = 'block';
        return;
    }
    
    emptyMsg.style.display = 'none';
    
    savedSearches.forEach((search, index) => {
        const tag = document.createElement('span');
        tag.style.cssText = `
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 20px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
        `;
        tag.onmouseover = function() {
            this.style.borderColor = 'var(--primary)';
            this.style.boxShadow = 'var(--shadow-sm)';
        };
        tag.onmouseout = function() {
            this.style.borderColor = 'var(--border-color)';
            this.style.boxShadow = 'none';
        };
        
        tag.innerHTML = `
            <i class="fa-regular fa-bookmark" style="color: var(--primary);"></i>
            ${search.name}
            <span style="font-size: 10px; color: var(--text-muted);">(${search.filters.status || 'All'})</span>
            <button onclick="event.stopPropagation(); deleteSavedSearch(${index})" 
                    style="background: none; border: none; color: var(--danger); cursor: pointer; padding: 0 4px;">
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;
        
        tag.onclick = function() {
            applySavedSearch(search);
        };
        
        container.appendChild(tag);
    });
}

function saveCurrentSearch() {
    const name = prompt('Enter a name for this search:');
    if (!name || !name.trim()) return;
    
    const searchData = {
        id: Date.now(),
        name: name.trim(),
        filters: {
            status: document.getElementById('filter-status').value,
            search: document.getElementById('filter-search').value,
            dateFrom: document.getElementById('filter-date-from').value,
            dateTo: document.getElementById('filter-date-to').value,
            amountMin: document.getElementById('filter-amount-min').value,
            amountMax: document.getElementById('filter-amount-max').value,
            tags: [...filterState.tags]
        }
    };
    
    savedSearches.push(searchData);
    localStorage.setItem('bf_saved_searches', JSON.stringify(savedSearches));
    renderSavedSearches();
    showToast(`Search "${searchData.name}" saved successfully`, 'success');
}

function deleteSavedSearch(index) {
    if (confirm(`Delete saved search "${savedSearches[index].name}"?`)) {
        const name = savedSearches[index].name;
        savedSearches.splice(index, 1);
        localStorage.setItem('bf_saved_searches', JSON.stringify(savedSearches));
        renderSavedSearches();
        showToast(`Search "${name}" deleted`, 'info');
    }
}

function applySavedSearch(search) {
    const filters = search.filters;
    
    document.getElementById('filter-status').value = filters.status || 'All';
    document.getElementById('filter-search').value = filters.search || '';
    document.getElementById('filter-date-from').value = filters.dateFrom || '';
    document.getElementById('filter-date-to').value = filters.dateTo || '';
    document.getElementById('filter-amount-min').value = filters.amountMin || '';
    document.getElementById('filter-amount-max').value = filters.amountMax || '';
    
    filterState.tags = filters.tags || [];
    renderTagFilters();
    
    filterState.currentPage = 1;
    renderHistory();
    closeSavedSearchesDropdown();
    showToast(`Applied search: "${search.name}"`, 'success');
}

function renderTagFilters() {
    const container = document.getElementById('tag-filters-container');
    container.innerHTML = '';
    
    filterState.tags.forEach(tag => {
        const badge = document.createElement('span');
        badge.style.cssText = `
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px 10px;
            background: var(--primary);
            color: white;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
        `;
        badge.innerHTML = `
            ${tag}
            <button onclick="removeTagFilter('${tag}')" 
                    style="background: none; border: none; color: white; cursor: pointer; padding: 0 2px;">
                <i class="fa-solid fa-xmark" style="font-size: 10px;"></i>
            </button>
        `;
        container.appendChild(badge);
    });
}

function removeTagFilter(tag) {
    filterState.tags = filterState.tags.filter(t => t !== tag);
    renderTagFilters();
    filterState.currentPage = 1;
    renderHistory();
}

function applyAdvancedFilters() {
    const tagSelect = document.getElementById('filter-tags');
    if (tagSelect && tagSelect.value !== 'All') {
        if (!filterState.tags.includes(tagSelect.value)) {
            filterState.tags.push(tagSelect.value);
            renderTagFilters();
        }
        tagSelect.value = 'All';
    }
    
    filterState.dateFrom = document.getElementById('filter-date-from').value;
    filterState.dateTo = document.getElementById('filter-date-to').value;
    filterState.amountMin = document.getElementById('filter-amount-min').value;
    filterState.amountMax = document.getElementById('filter-amount-max').value;
    
    filterState.currentPage = 1;
    renderHistory();
    showToast('Filters applied', 'info');
}

function clearAdvancedFilters() {
    document.getElementById('filter-date-from').value = '';
    document.getElementById('filter-date-to').value = '';
    document.getElementById('filter-amount-min').value = '';
    document.getElementById('filter-amount-max').value = '';
    document.getElementById('filter-tags').value = 'All';
    filterState.tags = [];
    renderTagFilters();
    filterState.currentPage = 1;
    renderHistory();
    showToast('Advanced filters cleared', 'info');
}

function sortHistory(column) {
    if (filterState.sortBy === column) {
        filterState.sortOrder = filterState.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        filterState.sortBy = column;
        filterState.sortOrder = 'desc';
    }
    filterState.currentPage = 1;
    renderHistory();
}

function changePage(delta) {
    const totalPages = Math.ceil(filteredInvoicesCache.length / filterState.pageSize);
    const newPage = filterState.currentPage + delta;
    
    if (newPage < 1 || newPage > totalPages) return;
    
    filterState.currentPage = newPage;
    renderHistory();
}

function initAdvancedFeatures() {
    loadSavedSearches();
    loadTags();
    populateTagDropdown();
    renderTagFilters();
}

// ==========================================================================
// SETTINGS OPERATIONS
// ==========================================================================

function populateSettingsForm() {
    const s = state.companySettings;
    document.getElementById("settings-sender-logo").value = s.logo || "";
    document.getElementById("settings-sender-name").value = s.name || "";
    document.getElementById("settings-sender-email").value = s.email || "";
    document.getElementById("settings-sender-phone").value = s.phone || "";
    document.getElementById("settings-sender-address").value = s.address || "";
    document.getElementById("settings-currency").value = s.currency || "USD";
    document.getElementById("settings-tax-rate").value = s.taxRate ?? 0;
    document.getElementById("settings-discount-rate").value = s.discountRate ?? 0;
    document.getElementById("settings-notes").value = s.notes || "";
}

function saveSettings(event) {
    event.preventDefault();
    
    state.companySettings = {
        logo: document.getElementById("settings-sender-logo").value.trim(),
        name: document.getElementById("settings-sender-name").value.trim(),
        email: document.getElementById("settings-sender-email").value.trim(),
        phone: document.getElementById("settings-sender-phone").value.trim(),
        address: document.getElementById("settings-sender-address").value.trim(),
        currency: document.getElementById("settings-currency").value,
        taxRate: parseFloat(document.getElementById("settings-tax-rate").value) || 0,
        discountRate: parseFloat(document.getElementById("settings-discount-rate").value) || 0,
        notes: document.getElementById("settings-notes").value.trim()
    };

    localStorage.setItem("bf_settings", JSON.stringify(state.companySettings));
    showToast("Default settings saved successfully", "success");
    switchView("dashboard");
}

function resetSettings() {
    state.companySettings = {
        logo: "",
        name: "",
        email: "",
        phone: "",
        address: "",
        currency: "USD",
        taxRate: 0,
        discountRate: 0,
        notes: ""
    };
    populateSettingsForm();
    showToast("Form cleared. Click save to store.", "warning");
}

// ==========================================================================
// INVOICE ACTIONS: EDIT, CREATE, DELETE, DUPLICATE
// ==========================================================================

function triggerNewInvoice() {
    const rand = Math.floor(1000 + Math.random() * 9000);
    const dateObj = new Date();
    const year = dateObj.getFullYear();
    const invNum = `INV-${year}-${state.invoices.length + 101}`;

    const issueDateStr = dateObj.toISOString().split('T')[0];
    
    const dueObj = new Date();
    dueObj.setDate(dueObj.getDate() + 30);
    const dueDateStr = dueObj.toISOString().split('T')[0];

    state.activeInvoice = {
        id: "inv_" + Date.now(),
        invoiceNumber: invNum,
        issueDate: issueDateStr,
        dueDate: dueDateStr,
        status: "Unpaid",
        template: "modern",
        currency: state.companySettings.currency,
        senderLogo: state.companySettings.logo,
        senderName: state.companySettings.name,
        senderEmail: state.companySettings.email,
        senderPhone: state.companySettings.phone,
        senderAddress: state.companySettings.address,
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        clientAddress: "",
        items: [
            { name: "", description: "", quantity: 1, price: 0 }
        ],
        taxRate: state.companySettings.taxRate,
        discountRate: state.companySettings.discountRate,
        notes: state.companySettings.notes
    };

    document.getElementById("editor-title").textContent = "Create Invoice";
    populateEditorForm();
    switchView("editor");
}

function triggerEditInvoice(id) {
    const inv = state.invoices.find(item => item.id === id);
    if (!inv) {
        showToast("Invoice not found", "danger");
        return;
    }

    state.activeInvoice = JSON.parse(JSON.stringify(inv));
    
    document.getElementById("editor-title").textContent = `Edit Invoice ${inv.invoiceNumber}`;
    populateEditorForm();
    switchView("editor");
}

function triggerDuplicateInvoice(id) {
    const inv = state.invoices.find(item => item.id === id);
    if (!inv) {
        showToast("Invoice not found", "danger");
        return;
    }

    const newInv = JSON.parse(JSON.stringify(inv));
    newInv.id = "inv_" + Date.now();
    newInv.invoiceNumber = `INV-${new Date().getFullYear()}-${state.invoices.length + 101}`;
    newInv.issueDate = new Date().toISOString().split('T')[0];
    
    const dueObj = new Date();
    dueObj.setDate(dueObj.getDate() + 30);
    newInv.dueDate = dueObj.toISOString().split('T')[0];

    state.activeInvoice = newInv;
    
    document.getElementById("editor-title").textContent = `Duplicate Invoice ${inv.invoiceNumber}`;
    populateEditorForm();
    switchView("editor");
    showToast("Invoice duplicated. Make edits and save.", "info");
}

function triggerDeleteInvoice(id) {
    const inv = state.invoices.find(item => item.id === id);
    if (!inv) return;

    if (confirm(`Are you sure you want to delete invoice ${inv.invoiceNumber}?`)) {
        state.invoices = state.invoices.filter(item => item.id !== id);
        localStorage.setItem("bf_invoices", JSON.stringify(state.invoices));
        
        renderDashboard();
        renderHistory();
        showToast(`Invoice ${inv.invoiceNumber} deleted`, "danger");
    }
}

// ==========================================================================
// EDITOR INTERACTION & PREVIEW COMPILING
// ==========================================================================

function populateEditorForm() {
    const inv = state.activeInvoice;
    if (!inv) return;

    document.getElementById("editor-template").value = inv.template || "modern";
    document.getElementById("editor-currency").value = inv.currency || "USD";
    document.getElementById("editor-status").value = inv.status || "Unpaid";
    document.getElementById("editor-number").value = inv.invoiceNumber || "";
    document.getElementById("editor-date-issue").value = inv.issueDate || "";
    document.getElementById("editor-date-due").value = inv.dueDate || "";
    
    document.getElementById("editor-sender-logo").value = inv.senderLogo || "";
    document.getElementById("editor-sender-name").value = inv.senderName || "";
    document.getElementById("editor-sender-email").value = inv.senderEmail || "";
    document.getElementById("editor-sender-phone").value = inv.senderPhone || "";
    document.getElementById("editor-sender-address").value = inv.senderAddress || "";

    document.getElementById("editor-client-name").value = inv.clientName || "";
    document.getElementById("editor-client-email").value = inv.clientEmail || "";
    document.getElementById("editor-client-phone").value = inv.clientPhone || "";
    document.getElementById("editor-client-address").value = inv.clientAddress || "";

    document.getElementById("editor-tax-rate").value = inv.taxRate ?? 0;
    document.getElementById("editor-discount-rate").value = inv.discountRate ?? 0;
    document.getElementById("editor-notes").value = inv.notes || "";

    renderLineItemsEditor();
    updateLivePreview();
}

function renderLineItemsEditor() {
    const itemsList = document.getElementById("editor-items-list");
    itemsList.innerHTML = "";

    state.activeInvoice.items.forEach((item, index) => {
        const row = document.createElement("div");
        row.className = "line-item-row";
        row.setAttribute("data-index", index);

        const itemTotal = (item.quantity || 0) * (item.price || 0);

        row.innerHTML = `
            <div class="line-item-details-inputs">
                <input type="text" class="item-name-input" value="${item.name || ''}" placeholder="Item Name (e.g. Design Consulting)">
                <textarea class="item-desc-input" rows="1" placeholder="Description details...">${item.description || ''}</textarea>
            </div>
            <div class="col-qty">
                <input type="number" class="item-qty-input" value="${item.quantity ?? 1}" min="0" step="any">
            </div>
            <div class="col-rate">
                <input type="number" class="item-price-input" value="${item.price ?? 0}" min="0" step="any">
            </div>
            <div class="col-total">
                <span class="row-total-val">${formatCurrency(itemTotal, state.activeInvoice.currency)}</span>
            </div>
            <div class="col-action">
                <button type="button" class="delete-row-btn" onclick="removeEditorLineItem(${index})" title="Remove Item">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </div>
        `;
        itemsList.appendChild(row);
    });
}

function addEditorLineItem() {
    state.activeInvoice.items.push({
        name: "",
        description: "",
        quantity: 1,
        price: 0
    });
    renderLineItemsEditor();
    updateLivePreview();
}

function removeEditorLineItem(index) {
    if (state.activeInvoice.items.length <= 1) {
        showToast("Invoice must have at least one line item", "warning");
        return;
    }
    state.activeInvoice.items.splice(index, 1);
    renderLineItemsEditor();
    updateLivePreview();
}

function collectFormValues() {
    if (!state.activeInvoice) return;

    state.activeInvoice.template = document.getElementById("editor-template").value;
    state.activeInvoice.currency = document.getElementById("editor-currency").value;
    state.activeInvoice.status = document.getElementById("editor-status").value;
    state.activeInvoice.invoiceNumber = document.getElementById("editor-number").value.trim();
    state.activeInvoice.issueDate = document.getElementById("editor-date-issue").value;
    state.activeInvoice.dueDate = document.getElementById("editor-date-due").value;
    
    state.activeInvoice.senderLogo = document.getElementById("editor-sender-logo").value.trim();
    state.activeInvoice.senderName = document.getElementById("editor-sender-name").value.trim();
    state.activeInvoice.senderEmail = document.getElementById("editor-sender-email").value.trim();
    state.activeInvoice.senderPhone = document.getElementById("editor-sender-phone").value.trim();
    state.activeInvoice.senderAddress = document.getElementById("editor-sender-address").value.trim();

    state.activeInvoice.clientName = document.getElementById("editor-client-name").value.trim();
    state.activeInvoice.clientEmail = document.getElementById("editor-client-email").value.trim();
    state.activeInvoice.clientPhone = document.getElementById("editor-client-phone").value.trim();
    state.activeInvoice.clientAddress = document.getElementById("editor-client-address").value.trim();

    state.activeInvoice.taxRate = parseFloat(document.getElementById("editor-tax-rate").value) || 0;
    state.activeInvoice.discountRate = parseFloat(document.getElementById("editor-discount-rate").value) || 0;
    state.activeInvoice.notes = document.getElementById("editor-notes").value.trim();

    const rows = document.querySelectorAll("#editor-items-list .line-item-row");
    state.activeInvoice.items = [];
    
    rows.forEach(row => {
        const name = row.querySelector(".item-name-input").value.trim();
        const description = row.querySelector(".item-desc-input").value.trim();
        const quantity = parseFloat(row.querySelector(".item-qty-input").value) || 0;
        const price = parseFloat(row.querySelector(".item-price-input").value) || 0;

        state.activeInvoice.items.push({ name, description, quantity, price });
    });
}

function updateLivePreview() {
    collectFormValues();
    
    const previewContainer = document.getElementById("invoice-preview-container");
    if (!previewContainer) return;

    previewContainer.className = `invoice-preview-paper template-${state.activeInvoice.template}`;
    previewContainer.innerHTML = compileInvoiceHTML(state.activeInvoice);

    const rows = document.querySelectorAll("#editor-items-list .line-item-row");
    rows.forEach((row, idx) => {
        const item = state.activeInvoice.items[idx];
        if (item) {
            const total = item.quantity * item.price;
            row.querySelector(".row-total-val").textContent = formatCurrency(total, state.activeInvoice.currency);
        }
    });
}

function saveActiveInvoice() {
    collectFormValues();
    const inv = state.activeInvoice;

    if (!inv.invoiceNumber) {
        showToast("Please specify an invoice number", "danger");
        return;
    }
    if (!inv.clientName) {
        showToast("Please provide a client name", "danger");
        return;
    }

    const index = state.invoices.findIndex(item => item.id === inv.id);
    if (index > -1) {
        state.invoices[index] = inv;
    } else {
        state.invoices.push(inv);
    }

    localStorage.setItem("bf_invoices", JSON.stringify(state.invoices));
    showToast(`Invoice ${inv.invoiceNumber} saved successfully`, "success");
    switchView("dashboard");
}

// ==========================================================================
// TEMPLATE COMPILER & INVOICE MATH
// ==========================================================================

function getInvoiceSubtotal(inv) {
    return inv.items.reduce((sum, item) => sum + ((item.quantity || 0) * (item.price || 0)), 0);
}

function getInvoiceGrandTotal(inv) {
    const subtotal = getInvoiceSubtotal(inv);
    const discount = subtotal * ((inv.discountRate || 0) / 100);
    const taxableAmount = subtotal - discount;
    const tax = taxableAmount * ((inv.taxRate || 0) / 100);
    return taxableAmount + tax;
}

function compileInvoiceHTML(inv) {
    const subtotal = getInvoiceSubtotal(inv);
    const discountVal = subtotal * ((inv.discountRate || 0) / 100);
    const taxableVal = subtotal - discountVal;
    const taxVal = taxableVal * ((inv.taxRate || 0) / 100);
    const grandTotal = taxableVal + taxVal;

    let tableRowsHTML = "";
    inv.items.forEach((item) => {
        const total = (item.quantity || 0) * (item.price || 0);
        tableRowsHTML += `
            <tr>
                <td>
                    <div class="item-name">${escapeHtml(item.name || 'Untitled Item')}</div>
                    ${item.description ? `<div class="item-desc">${escapeHtml(item.description)}</div>` : ''}
                </td>
                <td class="ip-text-right">${item.quantity}</td>
                <td class="ip-text-right">${formatCurrency(item.price, inv.currency)}</td>
                <td class="ip-text-right"><strong>${formatCurrency(total, inv.currency)}</strong></td>
            </tr>
        `;
    });

    let logoHTML = `<span class="ip-logo-text">${escapeHtml(inv.senderName || 'BillFlow')}</span>`;
    if (inv.senderLogo) {
        logoHTML = `<div class="ip-logo-container"><img src="${escapeHtml(inv.senderLogo)}" alt="logo"></div>`;
    }

    return `
        <div class="ip-header">
            <div class="ip-title-section">
                <div>
                    ${logoHTML}
                    <div style="margin-top: 10px; line-height: 1.4;">
                        <strong>${escapeHtml(inv.senderName || 'Sender Name')}</strong><br>
                        ${inv.senderEmail ? `${escapeHtml(inv.senderEmail)}<br>` : ''}
                        ${inv.senderPhone ? `${escapeHtml(inv.senderPhone)}<br>` : ''}
                        ${inv.senderAddress ? `${escapeHtml(inv.senderAddress)}` : ''}
                    </div>
                </div>
                <div class="ip-meta-box">
                    <h1>Invoice</h1>
                    <div style="font-size: 14px; margin-top: 5px;">
                        <strong>Invoice #:</strong> ${escapeHtml(inv.invoiceNumber)}
                    </div>
                </div>
            </div>
        </div>

        <div class="ip-grid-addresses">
            <div class="ip-address-col">
                <h4>Bill To:</h4>
                <p>
                    <strong>${escapeHtml(inv.clientName || 'Client Name')}</strong>
                    ${inv.clientEmail ? `<br>${escapeHtml(inv.clientEmail)}` : ''}
                    ${inv.clientPhone ? `<br>${escapeHtml(inv.clientPhone)}` : ''}
                    ${inv.clientAddress ? `<br>${escapeHtml(inv.clientAddress)}` : ''}
                </p>
            </div>
            <div class="ip-address-col" style="text-align: right;">
                <h4>Status:</h4>
                <div style="font-size: 16px; font-weight: 700; text-transform: uppercase;">
                    <span style="color: ${inv.status === 'Paid' ? '#10b981' : (inv.status === 'Unpaid' ? '#f59e0b' : '#6b7280')};">
                        ${inv.status}
                    </span>
                </div>
            </div>
        </div>

        <div class="ip-details-strip">
            <div class="ip-strip-item">
                <span>Issue Date</span>
                <strong>${formatDate(inv.issueDate)}</strong>
            </div>
            <div class="ip-strip-item">
                <span>Due Date</span>
                <strong>${formatDate(inv.dueDate)}</strong>
            </div>
            <div class="ip-strip-item">
                <span>Currency</span>
                <strong>${inv.currency}</strong>
            </div>
            <div class="ip-strip-item" style="text-align: right;">
                <span>Total Due</span>
                <strong>${formatCurrency(grandTotal, inv.currency)}</strong>
            </div>
        </div>

        <table class="ip-table">
            <thead>
                <tr>
                    <th style="text-align: left;">Description</th>
                    <th style="width: 80px;" class="ip-text-right">Qty</th>
                    <th style="width: 120px;" class="ip-text-right">Unit Price</th>
                    <th style="width: 120px;" class="ip-text-right">Total</th>
                </tr>
            </thead>
            <tbody>
                ${tableRowsHTML}
            </tbody>
        </table>

        <div class="ip-summary-section">
            <div class="ip-notes-box">
                ${inv.notes ? `
                    <h4>Notes & Payment Terms:</h4>
                    <p>${escapeHtml(inv.notes)}</p>
                ` : ''}
            </div>
            <div class="ip-totals-box">
                <div class="ip-total-row">
                    <span>Subtotal:</span>
                    <strong>${formatCurrency(subtotal, inv.currency)}</strong>
                </div>
                ${inv.discountRate > 0 ? `
                    <div class="ip-total-row">
                        <span>Discount (${inv.discountRate}%):</span>
                        <strong style="color: #ef4444;">-${formatCurrency(discountVal, inv.currency)}</strong>
                    </div>
                ` : ''}
                ${inv.taxRate > 0 ? `
                    <div class="ip-total-row">
                        <span>Tax (${inv.taxRate}%):</span>
                        <strong>${formatCurrency(taxVal, inv.currency)}</strong>
                    </div>
                ` : ''}
                <div class="ip-grand-total-row">
                    <span>Grand Total:</span>
                    <span>${formatCurrency(grandTotal, inv.currency)}</span>
                </div>
            </div>
        </div>

        <div class="ip-footer">
            Invoice generated automatically via BillFlow Invoice Portal. Page 1 of 1.
        </div>
    `;
}

// ==========================================================================
// EXPORTING AND PRINTING LOGIC
// ==========================================================================

function downloadPDF(invoiceData, paperElementId) {
    const element = document.getElementById(paperElementId);
    if (!element) return;

    showToast("Generating PDF, please wait...", "info");

    const opt = {
        margin:       0,
        filename:     `Invoice_${invoiceData.invoiceNumber || 'draft'}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).save().then(() => {
        showToast("PDF downloaded successfully", "success");
    }).catch(err => {
        console.error("PDF export error:", err);
        showToast("Failed to generate PDF", "danger");
    });
}

function printInvoice(invoiceData) {
    const html = compileInvoiceHTML(invoiceData);
    
    const printDiv = document.createElement("div");
    printDiv.id = "print-container-target";
    printDiv.className = `invoice-preview-paper template-${invoiceData.template}`;
    printDiv.innerHTML = html;
    
    document.body.appendChild(printDiv);
    window.print();
    document.body.removeChild(printDiv);
    
    showToast("Print window triggered", "success");
}

// ==========================================================================
// MODAL FOR INVOICE DETAILS
// ==========================================================================

let modalInvoiceId = null;

function openInvoiceDetailsModal(id) {
    const inv = state.invoices.find(item => item.id === id);
    if (!inv) return;

    modalInvoiceId = id;
    
    const paper = document.getElementById("modal-invoice-paper");
    paper.className = `invoice-preview-paper template-${inv.template}`;
    paper.innerHTML = compileInvoiceHTML(inv);

    const badge = document.getElementById("modal-invoice-status-badge");
    badge.textContent = inv.status;
    badge.className = "badge " + (inv.status === 'Paid' ? 'badge-paid' : (inv.status === 'Unpaid' ? 'badge-unpaid' : 'badge-draft'));

    document.getElementById("invoice-modal").classList.add("active");
}

function closeInvoiceModal() {
    document.getElementById("invoice-modal").classList.remove("active");
    modalInvoiceId = null;
}

// ==========================================================================
// UTILITY FUNCTIONS
// ==========================================================================

function formatCurrency(amount, currencyCode) {
    const symbol = getCurrencySymbol(currencyCode);
    return `${symbol}${Number(amount || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

function getCurrencySymbol(code) {
    return CURRENCIES[code]?.symbol || "$";
}

function formatDate(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function escapeHtml(text) {
    if (!text) return "";
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.toString().replace(/[&<>"']/g, function(m) { return map[m]; });
}

function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    let icon = "fa-check-circle";
    if (type === "danger") icon = "fa-circle-xmark";
    else if (type === "warning") icon = "fa-triangle-exclamation";
    else if (type === "info") icon = "fa-circle-info";

    toast.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("fade-out");
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// ==========================================================================
// EVENT LISTENERS REGISTRATION
// ==========================================================================

function setupEventListeners() {
    // 1. Sidebar menu navigation routing
    document.querySelectorAll(".sidebar-menu .menu-item").forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const view = item.getAttribute("data-view");
            switchView(view);
        });
    });

    // 2. Quick Create buttons
    document.getElementById("btn-quick-create").addEventListener("click", () => {
        triggerNewInvoice();
    });
    document.getElementById("btn-empty-create").addEventListener("click", () => {
        triggerNewInvoice();
    });

    // 3. Theme switch toggler
    document.getElementById("theme-toggle").addEventListener("click", () => {
        toggleTheme();
    });

    // 4. Global header search bar
    document.getElementById("global-search").addEventListener("input", (e) => {
        const query = e.target.value;
        document.getElementById("filter-search").value = query;
        filterState.currentPage = 1;
        renderHistory();
    });

    // 5. Dashboard view redirect
    document.getElementById("btn-see-all").addEventListener("click", () => {
        switchView("history");
    });

    // 6. Editor inputs changes triggers live preview update
    const editorInputs = [
        "editor-template", "editor-currency", "editor-status", "editor-number",
        "editor-date-issue", "editor-date-due", "editor-sender-logo",
        "editor-sender-name", "editor-sender-email", "editor-sender-phone",
        "editor-sender-address", "editor-client-name", "editor-client-email",
        "editor-client-phone", "editor-client-address", "editor-tax-rate",
        "editor-discount-rate", "editor-notes"
    ];

    editorInputs.forEach(id => {
        document.getElementById(id).addEventListener("input", updateLivePreview);
    });

    // 7. Dynamic list item inputs bindings
    const itemsList = document.getElementById("editor-items-list");
    itemsList.addEventListener("input", (e) => {
        if (e.target.classList.contains("item-name-input") || 
            e.target.classList.contains("item-desc-input") || 
            e.target.classList.contains("item-qty-input") || 
            e.target.classList.contains("item-price-input")) {
            updateLivePreview();
        }
    });

    // 8. Add Item button
    document.getElementById("btn-add-item").addEventListener("click", () => {
        addEditorLineItem();
    });

    // 9. Generate Number button
    document.getElementById("btn-generate-number").addEventListener("click", () => {
        const randNum = Math.floor(1000 + Math.random() * 9000);
        const invNum = `INV-${new Date().getFullYear()}-${randNum}`;
        document.getElementById("editor-number").value = invNum;
        updateLivePreview();
        showToast("Invoice number generated", "info");
    });

    // 10. Editor Actions (Save, Cancel, Download, Print)
    document.getElementById("btn-cancel-edit").addEventListener("click", () => {
        if (confirm("Discard changes? Any unsaved progress will be lost.")) {
            switchView("dashboard");
        }
    });

    document.getElementById("btn-save-invoice").addEventListener("click", () => {
        saveActiveInvoice();
    });

    document.getElementById("btn-download-pdf").addEventListener("click", () => {
        collectFormValues();
        downloadPDF(state.activeInvoice, "invoice-preview-container");
    });

    document.getElementById("btn-print-invoice").addEventListener("click", () => {
        collectFormValues();
        printInvoice(state.activeInvoice);
    });

    // 11. Modal actions triggers
    document.getElementById("btn-close-modal").addEventListener("click", closeInvoiceModal);
    
    document.getElementById("btn-modal-print").addEventListener("click", () => {
        if (modalInvoiceId) {
            const inv = state.invoices.find(item => item.id === modalInvoiceId);
            if (inv) printInvoice(inv);
        }
    });

    document.getElementById("btn-modal-download").addEventListener("click", () => {
        if (modalInvoiceId) {
            const inv = state.invoices.find(item => item.id === modalInvoiceId);
            if (inv) downloadPDF(inv, "modal-invoice-paper");
        }
    });

    document.getElementById("btn-modal-edit").addEventListener("click", () => {
        if (modalInvoiceId) {
            const id = modalInvoiceId;
            closeInvoiceModal();
            triggerEditInvoice(id);
        }
    });

    // 12. History Filters with advanced filtering
    document.getElementById("filter-status").addEventListener("change", () => {
        filterState.currentPage = 1;
        renderHistory();
    });
    
    document.getElementById("filter-search").addEventListener("input", () => {
        filterState.currentPage = 1;
        renderHistory();
    });
    
    document.getElementById("btn-clear-filters").addEventListener("click", () => {
        document.getElementById("filter-status").value = "All";
        document.getElementById("filter-search").value = "";
        document.getElementById("filter-date-from").value = "";
        document.getElementById("filter-date-to").value = "";
        document.getElementById("filter-amount-min").value = "";
        document.getElementById("filter-amount-max").value = "";
        document.getElementById("filter-tags").value = "All";
        filterState.tags = [];
        renderTagFilters();
        filterState.currentPage = 1;
        renderHistory();
        showToast("All filters reset", "info");
    });

    // 13. Settings Form Submit and Reset actions
    document.getElementById("settings-form").addEventListener("submit", saveSettings);
    document.getElementById("btn-reset-defaults").addEventListener("click", resetSettings);

    // 14. Save Search button
    document.getElementById("btn-save-search").addEventListener("click", saveCurrentSearch);
}

// ==========================================================================
// EXPOSE GLOBAL FUNCTIONS
// ==========================================================================

window.saveCurrentSearch = saveCurrentSearch;
window.toggleSavedSearchesDropdown = toggleSavedSearchesDropdown;
window.closeSavedSearchesDropdown = closeSavedSearchesDropdown;
window.deleteSavedSearch = deleteSavedSearch;
window.applySavedSearch = applySavedSearch;
window.toggleAdvancedFilters = toggleAdvancedFilters;
window.applyAdvancedFilters = applyAdvancedFilters;
window.clearAdvancedFilters = clearAdvancedFilters;
window.sortHistory = sortHistory;
window.changePage = changePage;
window.addNewTag = addNewTag;
window.removeTagFilter = removeTagFilter;
window.openInvoiceDetailsModal = openInvoiceDetailsModal;
window.triggerEditInvoice = triggerEditInvoice;
window.triggerDuplicateInvoice = triggerDuplicateInvoice;
window.triggerDeleteInvoice = triggerDeleteInvoice;
window.toggleInvoiceStatus = toggleInvoiceStatus;
window.removeEditorLineItem = removeEditorLineItem;