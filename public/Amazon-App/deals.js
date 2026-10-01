// =====================================================
// TODAY'S DEALS PAGE — JAVASCRIPT
// =====================================================

// ─── Deals Data ───────────────────────────────────
// Each deal has: id, title, category, originalPrice,
// discountPct, image, rating, ratingCount, endsInMs
// (relative ms from page load), claimed (0-100)

const DEALS_DATA = [
    {
        id: "deal_001",
        title: "Sony WH-1000XM5 Wireless Noise-Canceling Headphones",
        category: "electronics",
        originalPrice: 399.99,
        discountPct: 35,
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300&q=80",
        rating: 4.8,
        ratingCount: 12453,
        endsInMs: 6 * 3600 * 1000,       // 6 h
        claimed: 72
    },
    {
        id: "deal_002",
        title: "Apple iPad 10th Gen 64GB Wi-Fi",
        category: "electronics",
        originalPrice: 449.00,
        discountPct: 22,
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&q=80",
        rating: 4.7,
        ratingCount: 9821,
        endsInMs: 3 * 3600 * 1000,
        claimed: 55
    },
    {
        id: "deal_003",
        title: "Samsung 55\" 4K QLED Smart TV",
        category: "electronics",
        originalPrice: 1099.99,
        discountPct: 50,
        image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=300&q=80",
        rating: 4.6,
        ratingCount: 5342,
        endsInMs: 9 * 3600 * 1000,
        claimed: 83
    },
    {
        id: "deal_004",
        title: "Nike Air Max 270 Running Shoes",
        category: "fashion",
        originalPrice: 150.00,
        discountPct: 40,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80",
        rating: 4.5,
        ratingCount: 23110,
        endsInMs: 4 * 3600 * 1000,
        claimed: 61
    },
    {
        id: "deal_005",
        title: "Levi's 501 Original Fit Jeans",
        category: "fashion",
        originalPrice: 79.50,
        discountPct: 30,
        image: "https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?w=300&q=80",
        rating: 4.4,
        ratingCount: 18234,
        endsInMs: 12 * 3600 * 1000,
        claimed: 38
    },
    {
        id: "deal_006",
        title: "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
        category: "home",
        originalPrice: 99.99,
        discountPct: 45,
        image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=300&q=80",
        rating: 4.9,
        ratingCount: 87654,
        endsInMs: 5 * 3600 * 1000,
        claimed: 91
    },
    {
        id: "deal_007",
        title: "Dyson V15 Detect Cordless Vacuum",
        category: "home",
        originalPrice: 749.99,
        discountPct: 25,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",
        rating: 4.7,
        ratingCount: 7892,
        endsInMs: 8 * 3600 * 1000,
        claimed: 44
    },
    {
        id: "deal_008",
        title: "LEGO Technic Bugatti Chiron (3599 Pieces)",
        category: "toys",
        originalPrice: 369.99,
        discountPct: 33,
        image: "https://images.unsplash.com/photo-1613488501901-7ce2a4e08c93?w=300&q=80",
        rating: 4.9,
        ratingCount: 4231,
        endsInMs: 2 * 3600 * 1000,
        claimed: 78
    },
    {
        id: "deal_009",
        title: "L'Oréal Paris Revitalift 1.5% Pure Hyaluronic Acid Serum",
        category: "beauty",
        originalPrice: 32.99,
        discountPct: 55,
        image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&q=80",
        rating: 4.5,
        ratingCount: 45112,
        endsInMs: 7 * 3600 * 1000,
        claimed: 67
    },
    {
        id: "deal_010",
        title: "Atomic Habits – James Clear (Hardcover)",
        category: "books",
        originalPrice: 27.00,
        discountPct: 40,
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&q=80",
        rating: 4.9,
        ratingCount: 112300,
        endsInMs: 14 * 3600 * 1000,
        claimed: 29
    },
    {
        id: "deal_011",
        title: "Bowflex SelectTech 552 Adjustable Dumbbells (Pair)",
        category: "sports",
        originalPrice: 549.00,
        discountPct: 28,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&q=80",
        rating: 4.8,
        ratingCount: 6741,
        endsInMs: 10 * 3600 * 1000,
        claimed: 52
    },
    {
        id: "deal_012",
        title: "JBL Flip 6 Portable Bluetooth Speaker",
        category: "electronics",
        originalPrice: 129.95,
        discountPct: 38,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&q=80",
        rating: 4.7,
        ratingCount: 21432,
        endsInMs: 4.5 * 3600 * 1000,
        claimed: 80
    },
    {
        id: "deal_013",
        title: "Tefal Air Fryer XA8010 5.2L XXL",
        category: "home",
        originalPrice: 189.99,
        discountPct: 42,
        image: "https://images.unsplash.com/photo-1621944190310-e3cca1564bd7?w=300&q=80",
        rating: 4.6,
        ratingCount: 11287,
        endsInMs: 6.5 * 3600 * 1000,
        claimed: 58
    },
    {
        id: "deal_014",
        title: "Adidas Ultraboost 23 Running Shoe",
        category: "fashion",
        originalPrice: 190.00,
        discountPct: 25,
        image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&q=80",
        rating: 4.5,
        ratingCount: 14532,
        endsInMs: 11 * 3600 * 1000,
        claimed: 35
    },
    {
        id: "deal_015",
        title: "Nerf Ultra One Motorized Blaster",
        category: "toys",
        originalPrice: 49.99,
        discountPct: 60,
        image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=300&q=80",
        rating: 4.3,
        ratingCount: 8763,
        endsInMs: 1.5 * 3600 * 1000,
        claimed: 95
    },
    {
        id: "deal_016",
        title: "The Psychology of Money – Morgan Housel",
        category: "books",
        originalPrice: 22.00,
        discountPct: 36,
        image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&q=80",
        rating: 4.8,
        ratingCount: 67890,
        endsInMs: 16 * 3600 * 1000,
        claimed: 21
    },
    {
        id: "deal_017",
        title: "Yoga Mat with Alignment Lines – Non-Slip",
        category: "sports",
        originalPrice: 39.99,
        discountPct: 50,
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&q=80",
        rating: 4.6,
        ratingCount: 29341,
        endsInMs: 8.5 * 3600 * 1000,
        claimed: 63
    },
    {
        id: "deal_018",
        title: "Maybelline SuperStay 24-Hour Lipstick",
        category: "beauty",
        originalPrice: 15.99,
        discountPct: 38,
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&q=80",
        rating: 4.4,
        ratingCount: 54210,
        endsInMs: 9.5 * 3600 * 1000,
        claimed: 47
    },
    {
        id: "deal_019",
        title: "Logitech MX Master 3S Wireless Mouse",
        category: "electronics",
        originalPrice: 99.99,
        discountPct: 30,
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&q=80",
        rating: 4.8,
        ratingCount: 33420,
        endsInMs: 13 * 3600 * 1000,
        claimed: 41
    },
    {
        id: "deal_020",
        title: "KitchenAid 5-Speed Artisan Stand Mixer",
        category: "home",
        originalPrice: 449.99,
        discountPct: 20,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&q=80",
        rating: 4.9,
        ratingCount: 45230,
        endsInMs: 15 * 3600 * 1000,
        claimed: 27
    }
];

// ─── State ────────────────────────────────────────
let dealsState = {
    activeCategory: 'all',
    activePrice: 'all',
    activeDiscount: 'all',
    sortBy: 'discount-desc'
};

// Timestamps: record page load time + deal end time
const PAGE_LOAD_TIME = Date.now();
const dealEndTimes = {};
DEALS_DATA.forEach(d => {
    dealEndTimes[d.id] = PAGE_LOAD_TIME + d.endsInMs;
});

// ─── Utility helpers ──────────────────────────────
function getDealPrice(deal) {
    return deal.originalPrice * (1 - deal.discountPct / 100);
}

function formatMs(ms) {
    if (ms <= 0) return null;
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    const pad = n => String(n).padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function starsHtml(rating) {
    const full = Math.round(rating);
    return '★'.repeat(Math.min(full, 5)) + '☆'.repeat(Math.max(0, 5 - full));
}

// ─── Global countdown ─────────────────────────────
// Use the deal that ends last as "global" end
function initGlobalTimer() {
    const maxEnd = Math.max(...Object.values(dealEndTimes));

    function tick() {
        const remaining = maxEnd - Date.now();
        const elH = document.getElementById('gh');
        const elM = document.getElementById('gm');
        const elS = document.getElementById('gs');
        if (!elH) return;
        if (remaining <= 0) {
            elH.textContent = elM.textContent = elS.textContent = '00';
            return;
        }
        const totalSec = Math.floor(remaining / 1000);
        const h = Math.floor(totalSec / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        const s = totalSec % 60;
        const pad = n => String(n).padStart(2, '0');
        elH.textContent = pad(h);
        elM.textContent = pad(m);
        elS.textContent = pad(s);
    }
    tick();
    setInterval(tick, 1000);
}

// ─── Filter + Sort Logic ──────────────────────────
function getFilteredDeals() {
    let deals = [...DEALS_DATA];

    // Category
    if (dealsState.activeCategory !== 'all') {
        deals = deals.filter(d => d.category === dealsState.activeCategory);
    }

    // Price
    if (dealsState.activePrice !== 'all') {
        const [lo, hi] = dealsState.activePrice.split('-').map(Number);
        deals = deals.filter(d => {
            const price = getDealPrice(d);
            if (dealsState.activePrice === '100+') return price >= 100;
            return price >= lo && price < hi;
        });
    }

    // Discount
    if (dealsState.activeDiscount !== 'all') {
        const minDisc = Number(dealsState.activeDiscount);
        deals = deals.filter(d => d.discountPct >= minDisc);
    }

    // Sort
    deals.sort((a, b) => {
        switch (dealsState.sortBy) {
            case 'discount-desc': return b.discountPct - a.discountPct;
            case 'price-asc':    return getDealPrice(a) - getDealPrice(b);
            case 'price-desc':   return getDealPrice(b) - getDealPrice(a);
            case 'ends-soon':    return dealEndTimes[a.id] - dealEndTimes[b.id];
        }
        return 0;
    });

    return deals;
}

// ─── Render Deals ─────────────────────────────────
function renderDeals() {
    const grid = document.getElementById('deals-grid');
    const loading = document.getElementById('deals-loading');
    const resultCount = document.getElementById('deals-result-count');
    const clearBtn = document.getElementById('clear-filters-btn');
    if (!grid) return;

    // Hide loading
    if (loading) loading.style.display = 'none';

    const deals = getFilteredDeals();

    // Update count
    if (resultCount) {
        resultCount.innerHTML = `<strong>${deals.length}</strong> deal${deals.length !== 1 ? 's' : ''} found`;
    }

    // Show/hide clear button
    const hasFilters = dealsState.activeCategory !== 'all' ||
                       dealsState.activePrice !== 'all' ||
                       dealsState.activeDiscount !== 'all';
    if (clearBtn) clearBtn.style.display = hasFilters ? 'flex' : 'none';

    // Clear existing cards (keep loading if present)
    Array.from(grid.querySelectorAll('.deal-card')).forEach(el => el.remove());
    const emptyEl = grid.querySelector('.deals-empty');
    if (emptyEl) emptyEl.remove();

    if (deals.length === 0) {
        grid.insertAdjacentHTML('beforeend', `
            <div class="deals-empty">
                <i class="fa-solid fa-magnifying-glass"></i>
                <h3>No deals found</h3>
                <p>Try adjusting your filters to find more deals.</p>
            </div>
        `);
        return;
    }

    deals.forEach(deal => {
        const card = buildDealCard(deal);
        grid.appendChild(card);
    });

    // Bind cart buttons
    grid.querySelectorAll('.deal-add-cart-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            const dealId = btn.getAttribute('data-deal-id');
            addDealToCart(dealId, btn);
        });
    });
}

// ─── Build a single Deal Card ─────────────────────
function buildDealCard(deal) {
    const card = document.createElement('div');
    card.className = 'deal-card';
    card.setAttribute('data-deal-id', deal.id);

    const salePrice = getDealPrice(deal);
    const salePriceInt = Math.floor(salePrice);
    const salePriceDec = Math.round((salePrice - salePriceInt) * 100).toString().padStart(2, '0');
    const savings = (deal.originalPrice - salePrice).toFixed(2);

    const timeRemaining = formatMs(dealEndTimes[deal.id] - Date.now());
    const timerDisplay = timeRemaining || '—';
    const timerClass = timeRemaining ? 'deal-timer-digits' : 'deal-timer-digits expired';
    const timerText = timeRemaining ? timerDisplay : 'Expired';

    const claimedPct = Math.min(deal.claimed, 99);
    const hotness = claimedPct >= 80 ? '<i class="fa-solid fa-fire"></i>' : '';
    const claimedLabel = claimedPct >= 80 ? `${hotness} ${claimedPct}% claimed – Almost gone!` :
                         claimedPct >= 50 ? `${claimedPct}% claimed` : `${claimedPct}% claimed`;

    const categoryLabel = deal.category.charAt(0).toUpperCase() + deal.category.slice(1);

    card.innerHTML = `
        <div class="deal-badge">
            <i class="fa-solid fa-clock"></i> Limited Time Deal
        </div>
        <div class="deal-discount-tag">${deal.discountPct}% off</div>

        <div class="deal-card-img">
            <img src="${deal.image}" alt="${deal.title}"
                 onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22300%22 height=%22300%22/%3E%3C/svg%3E'">
        </div>

        <div class="deal-card-body">
            <span class="deal-card-category">${categoryLabel}</span>
            <h3 class="deal-card-title">${deal.title}</h3>

            <div class="deal-card-stars">
                <span class="deal-stars-icons">${starsHtml(deal.rating)}</span>
                <span class="deal-stars-count">${deal.rating.toFixed(1)} (${deal.ratingCount.toLocaleString()})</span>
            </div>

            <div class="deal-card-pricing">
                <div class="deal-discounted-price">
                    <span class="deal-price-symbol">$</span>
                    <span class="deal-price-int">${salePriceInt}</span>
                    <span class="deal-price-dec">${salePriceDec}</span>
                </div>
                <div class="deal-original-price">
                    List: <span class="original-amount">$${deal.originalPrice.toFixed(2)}</span>
                    &nbsp;
                    <span class="deal-savings">You save $${savings} (${deal.discountPct}%)</span>
                </div>
            </div>

            <div class="deal-progress-wrap">
                <div class="deal-progress-label">${claimedLabel}</div>
                <div class="deal-progress-bar">
                    <div class="deal-progress-fill" style="width: ${claimedPct}%"></div>
                </div>
            </div>

            <div class="deal-card-timer">
                <i class="fa-regular fa-clock"></i>
                <span>Deal ends in:</span>
                <span class="${timerClass}" data-timer-id="${deal.id}">${timerText}</span>
            </div>

            <button class="deal-add-cart-btn" data-deal-id="${deal.id}" id="btn-${deal.id}">
                <i class="fa-solid fa-cart-plus"></i> Add to Cart
            </button>
        </div>
    `;

    return card;
}

// ─── Per-card timer ticks ─────────────────────────
function startCardTimers() {
    setInterval(() => {
        document.querySelectorAll('[data-timer-id]').forEach(el => {
            const dealId = el.getAttribute('data-timer-id');
            const remaining = dealEndTimes[dealId] - Date.now();
            const formatted = formatMs(remaining);
            if (formatted) {
                el.textContent = formatted;
                el.classList.remove('expired');
                el.classList.add('deal-timer-digits');
            } else {
                el.textContent = 'Expired';
                el.classList.add('expired');
            }
        });
    }, 1000);
}

// ─── Add Deal to Cart ─────────────────────────────
function addDealToCart(dealId, btn) {
    const deal = DEALS_DATA.find(d => d.id === dealId);
    if (!deal) return;

    const salePrice = getDealPrice(deal);

    // Use the global addToCart if available, else handle manually
    if (typeof window.addToCart === 'function') {
        window.addToCart(deal.id, deal.title, salePrice, deal.image);
    } else {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existing = cart.find(i => i.id === deal.id);
        if (existing) {
            existing.qty = (existing.qty || 1) + 1;
        } else {
            cart.push({
                id: deal.id,
                title: deal.title,
                price: salePrice,
                image: deal.image,
                qty: 1
            });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        if (window.updateCartCount) window.updateCartCount();
        showCartToast(deal.title);
    }

    // Animate button
    if (btn) {
        btn.classList.add('added');
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Added to Cart!';
        setTimeout(() => {
            btn.classList.remove('added');
            btn.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Add to Cart';
        }, 2000);
    }
}

// ─── Toast notification ───────────────────────────
function showCartToast(title) {
    let toast = document.getElementById('deals-cart-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'deals-cart-toast';
        toast.style.cssText = `
            position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
            background:#067d62; color:#fff; padding:12px 24px; border-radius:8px;
            font-size:14px; font-weight:600; z-index:9999; opacity:0;
            transition:opacity 0.3s; display:flex; align-items:center; gap:8px;
            box-shadow:0 4px 20px rgba(0,0,0,0.25); white-space:nowrap;
            max-width:90vw; overflow:hidden; text-overflow:ellipsis;
        `;
        document.body.appendChild(toast);
    }
    const shortTitle = title.length > 40 ? title.slice(0, 37) + '…' : title;
    toast.innerHTML = `<i class="fa-solid fa-check-circle"></i> "${shortTitle}" added to cart`;
    toast.style.opacity = '1';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}

// ─── Filter / Sort Event Binding ──────────────────
function bindFilters() {
    // Chip buttons (category, price, discount)
    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const filterType = chip.getAttribute('data-filter');
            const value = chip.getAttribute('data-value');

            // Deactivate siblings
            const group = chip.closest('.filter-chips');
            if (group) {
                group.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            }
            chip.classList.add('active');

            if (filterType === 'category') dealsState.activeCategory = value;
            else if (filterType === 'price') dealsState.activePrice = value;
            else if (filterType === 'discount') dealsState.activeDiscount = value;

            renderDeals();
        });
    });

    // Sort select
    const sortSelect = document.getElementById('deals-sort');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            dealsState.sortBy = sortSelect.value;
            renderDeals();
        });
    }

    // Clear filters
    const clearBtn = document.getElementById('clear-filters-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            dealsState.activeCategory = 'all';
            dealsState.activePrice = 'all';
            dealsState.activeDiscount = 'all';

            // Reset chips UI
            document.querySelectorAll('.chip').forEach(c => {
                c.classList.remove('active');
                if (c.getAttribute('data-value') === 'all') c.classList.add('active');
            });

            renderDeals();
        });
    }
}

// ─── Init ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Only run on the deals page
    const dealsPage = document.getElementById('deals-page');
    if (!dealsPage) return;

    initGlobalTimer();
    bindFilters();

    // Small delay to allow script.js cart count to initialise first
    setTimeout(() => {
        renderDeals();
        startCardTimers();
    }, 100);
});
