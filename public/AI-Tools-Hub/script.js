console.log('🤖 AI Tools Hub - Welcome!');

// === LOCAL STORAGE HELPERS ===
const STORAGE_KEY = 'ai-tools-hub-favorites';

function getFavorites() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveFavorites(favorites) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

// === TOAST NOTIFICATION ===
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// === RENDER FAVORITES SECTION ===
function renderFavorites() {
    const favoritesGrid = document.getElementById('favorites-grid');
    const favorites = getFavorites();
    
    if (favorites.length === 0) {
        favoritesGrid.innerHTML = `
            <div id="empty-favorites" class="empty-state">
                <div class="empty-state-icon">💖</div>
                <h4>No favorites yet</h4>
                <p>Click the heart icon on any tool to add it to your favorites!</p>
            </div>
        `;
        return;
    }

    // Render all favorite tools
    favoritesGrid.innerHTML = favorites.map(tool => `
        <div class="tool-card glass-card" data-tool-id="${tool.id}">
            <button class="favorite-btn favorited" aria-label="Remove ${tool.name} from favorites">
                <span class="heart-icon">❤️</span>
            </button>
            <span class="tool-badge">${tool.category}</span>
            <h4 class="tool-name">${tool.name}</h4>
            <p class="tool-description">${tool.description}</p>
            <a href="${tool.url}" target="_blank" rel="noopener noreferrer" class="btn-primary" aria-label="Visit ${tool.name} website">Visit Website</a>
        </div>
    `).join('');

    // Re-attach event listeners for favorite buttons in favorites section
    attachFavoriteListeners();
}

// === TOGGLE FAVORITE ===
function toggleFavorite(toolId) {
    let favorites = getFavorites();
    const toolCard = document.querySelector(`.tool-card[data-tool-id="${toolId}"]:not(#favorites-grid .tool-card)`);
    
    if (!toolCard) return;
    
    const toolData = {
        id: toolCard.dataset.toolId,
        name: toolCard.dataset.toolName,
        category: toolCard.dataset.toolCategory,
        description: toolCard.dataset.toolDescription,
        url: toolCard.dataset.toolUrl
    };

    const index = favorites.findIndex(f => f.id === toolId);
    if (index > -1) {
        // Remove from favorites
        favorites.splice(index, 1);
        showToast(`${toolData.name} removed from favorites`);
    } else {
        // Add to favorites
        favorites.push(toolData);
        showToast(`${toolData.name} added to favorites!`);
    }

    saveFavorites(favorites);
    updateAllFavoriteButtons();
    renderFavorites();
}

// === UPDATE ALL FAVORITE BUTTONS ===
function updateAllFavoriteButtons() {
    const favorites = getFavorites();
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    
    favoriteButtons.forEach(btn => {
        const toolCard = btn.closest('.tool-card');
        const toolId = toolCard.dataset.toolId;
        const isFavorited = favorites.some(f => f.id === toolId);
        
        if (isFavorited) {
            btn.classList.add('favorited');
            btn.querySelector('.heart-icon').textContent = '❤️';
        } else {
            btn.classList.remove('favorited');
            btn.querySelector('.heart-icon').textContent = '🤍';
        }
    });
}

// === ATTACH EVENT LISTENERS ===
function attachFavoriteListeners() {
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    favoriteButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const toolCard = btn.closest('.tool-card');
            toggleFavorite(toolCard.dataset.toolId);
        });
    });
}

// === SMOOTH SCROLL ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// === INTERSECTION OBSERVER FOR ANIMATIONS ===
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

const cardsToAnimate = document.querySelectorAll('.tool-card, .category-card, .stat-card, .why-card, .trend-card');
cardsToAnimate.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
    observer.observe(card);
});

// === INITIALIZE ===
document.addEventListener('DOMContentLoaded', () => {
    updateAllFavoriteButtons();
    renderFavorites();
    attachFavoriteListeners();
});
