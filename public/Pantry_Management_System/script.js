document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const addBtn = document.getElementById('add-item-btn');
    const modalOverlay = document.getElementById('item-modal');
    const closeBtn = document.getElementById('close-modal');
    const itemForm = document.getElementById('item-form');
    const pantryGrid = document.getElementById('pantry-grid');
    const emptyState = document.getElementById('empty-state');
    
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');

    // State
    let pantryItems = JSON.parse(localStorage.getItem('pantry_items')) || [];

    // --- Modal Logic ---
    addBtn.addEventListener('click', () => {
        document.getElementById('modal-title').textContent = 'Add Pantry Item';
        itemForm.reset();
        document.getElementById('item-id').value = '';
        modalOverlay.classList.add('visible');
    });

    closeBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('visible');
    });

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) modalOverlay.classList.remove('visible');
    });

    // --- CRUD Operations ---
    itemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const id = document.getElementById('item-id').value;
        const name = document.getElementById('item-name').value.trim();
        const category = document.getElementById('item-category').value;
        const quantity = parseInt(document.getElementById('item-quantity').value);
        const expiry = document.getElementById('item-expiry').value;

        if (id) {
            const index = pantryItems.findIndex(i => i.id === id);
            if (index !== -1) {
                pantryItems[index] = { ...pantryItems[index], name, category, quantity, expiry };
            }
        } else {
            pantryItems.push({
                id: Date.now().toString(),
                name,
                category,
                quantity,
                expiry
            });
        }

        saveItems();
        renderGrid();
        modalOverlay.classList.remove('visible');
    });

    function saveItems() {
        localStorage.setItem('pantry_items', JSON.stringify(pantryItems));
    }

    // Handle clicks inside grid (Edit/Delete)
    pantryGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;

        const id = btn.dataset.id;
        
        if (btn.classList.contains('delete')) {
            pantryItems = pantryItems.filter(i => i.id !== id);
            saveItems();
            renderGrid();
        } else if (btn.classList.contains('edit')) {
            const item = pantryItems.find(i => i.id === id);
            if (item) {
                document.getElementById('modal-title').textContent = 'Edit Item';
                document.getElementById('item-id').value = item.id;
                document.getElementById('item-name').value = item.name;
                document.getElementById('item-category').value = item.category;
                document.getElementById('item-quantity').value = item.quantity;
                document.getElementById('item-expiry').value = item.expiry;
                modalOverlay.classList.add('visible');
            }
        }
    });

    // --- Search & Filter ---
    searchInput.addEventListener('input', renderGrid);
    categoryFilter.addEventListener('change', renderGrid);
    sortFilter.addEventListener('change', renderGrid);

    // --- Rendering Logic ---
    function getExpiryStatus(expiryDate) {
        const today = new Date();
        today.setHours(0,0,0,0);
        const expiry = new Date(expiryDate);
        
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return { class: 'status-danger', text: 'Expired', icon: 'ph-warning-circle' };
        if (diffDays <= 3) return { class: 'status-warning', text: `Expiring in ${diffDays} day${diffDays > 1 ? 's' : ''}`, icon: 'ph-clock' };
        return { class: 'status-good', text: `Valid for ${diffDays} days`, icon: 'ph-check-circle' };
    }

    function renderGrid() {
        pantryGrid.innerHTML = '';
        
        const searchTerm = searchInput.value.toLowerCase();
        const category = categoryFilter.value;
        const sortMode = sortFilter.value;

        // Filter
        let filtered = pantryItems.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm);
            const matchesCategory = category === 'all' || item.category === category;
            return matchesSearch && matchesCategory;
        });

        // Sort
        filtered.sort((a, b) => {
            if (sortMode === 'expiry-asc') return new Date(a.expiry) - new Date(b.expiry);
            if (sortMode === 'expiry-desc') return new Date(b.expiry) - new Date(a.expiry);
            if (sortMode === 'name-asc') return a.name.localeCompare(b.name);
            return 0;
        });

        // Display
        if (filtered.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
            
            filtered.forEach(item => {
                const status = getExpiryStatus(item.expiry);
                const prettyDate = new Date(item.expiry).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

                const card = document.createElement('div');
                card.className = `item-card glass-card ${status.class}`;
                
                card.innerHTML = `
                    <div class="item-header">
                        <div class="item-title">
                            <h3>${item.name}</h3>
                            <span class="category-tag">${item.category}</span>
                        </div>
                        <div class="item-actions">
                            <button class="icon-btn edit" data-id="${item.id}"><i class="ph ph-pencil-simple"></i></button>
                            <button class="icon-btn delete" data-id="${item.id}"><i class="ph ph-trash"></i></button>
                        </div>
                    </div>
                    <div class="item-details">
                        <span><i class="ph ph-hash"></i> Qty: <strong>${item.quantity}</strong></span>
                        <div class="expiry-badge">
                            <i class="ph ${status.icon}"></i> ${status.text}
                        </div>
                    </div>
                `;
                pantryGrid.appendChild(card);
            });
        }
    }

    // Init
    renderGrid();
});
