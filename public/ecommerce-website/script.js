/* ==========================================================================
   LUXE E-COMMERCE | MAIN APPLICATION SCRIPT
   Part 1: Global State & Product Database (Items 1-10)
   ========================================================================== */

// --- 1. GLOBAL APP STATE ---
let cart = JSON.parse(localStorage.getItem('luxe_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('luxe_wishlist')) || [];
let currentTheme = localStorage.getItem('luxe_theme') || 'theme-light';
let activeCategory = 'all';
let activeSort = 'default';
let activeSearchQuery = '';

// --- 2. PRODUCT DATA MATRIX (Items 1-10) ---
const products = [
    {
        id: 1,
        title: "Premium Noise-Cancelling Headphones",
        category: "electronics",
        price: 299.99,
        oldPrice: 349.99,
        discount: "-15%",
        isNew: false,
        rating: 4.5,
        reviews: 128,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
        sku: "LX-EL-001",
        description: "Immerse yourself in pure sound. Featuring industry-leading active noise cancellation, a 40-hour battery life, and ultra-comfortable memory foam earcups designed for marathon listening sessions."
    },
    {
        id: 2,
        title: "Minimalist Smart Watch V2",
        category: "electronics",
        price: 199.50,
        oldPrice: null,
        discount: null,
        isNew: true,
        rating: 5.0,
        reviews: 85,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
        sku: "LX-EL-002",
        description: "Stay connected in style. The V2 brings an elegant always-on AMOLED display, advanced health and fitness tracking, sleep metrics, and seamless cross-platform smartphone synchronization."
    },
    {
        id: 3,
        title: "Nordic Ceramic Vase Set",
        category: "home",
        price: 145.00,
        oldPrice: null,
        discount: null,
        isNew: false,
        rating: 4.0,
        reviews: 42,
        image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&q=80",
        sku: "LX-HM-003",
        description: "Bring earthy modernism into your living space. Handcrafted from premium stoneware, this set of three distinct shapes offers a matte textured finish that complements any minimalist interior."
    },
    {
        id: 4,
        title: "Pro-Runner Lightweight Sneakers",
        category: "fashion",
        price: 89.99,
        oldPrice: 112.50,
        discount: "-20%",
        isNew: false,
        rating: 4.5,
        reviews: 215,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
        sku: "LX-FA-004",
        description: "Engineered for speed, built for comfort. Features a responsive nitrogen-infused foam midsole, highly breathable engineered mesh body, and a high-grip rubber outsole for optimal track performance."
    },
    {
        id: 5,
        title: "Retro Polarized Sunglasses",
        category: "accessories",
        price: 55.00,
        oldPrice: null,
        discount: null,
        isNew: false,
        rating: 5.0,
        reviews: 94,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80",
        sku: "LX-AC-005",
        description: "Timeless aesthetics meet modern eye protection. Hand-polished acetate frames house premium polarized UV400 lenses that block glare completely while maintaining vibrant, natural color clarity."
    },
    {
        id: 6,
        title: "Classic Leather Backpack",
        category: "accessories",
        price: 120.00,
        oldPrice: null,
        discount: null,
        isNew: true,
        rating: 4.5,
        reviews: 67,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80",
        sku: "LX-AC-006",
        description: "Crafted from top-grain vegetable-tanned leather, this spacious pack contains a dedicated 15-inch laptop sleeve, secure hidden pockets for valuables, and padded mesh backing for structural comfort."
    },
    {
        id: 7,
        title: "UltraSlim 14\" Creator Laptop",
        category: "electronics",
        price: 899.00,
        oldPrice: null,
        discount: null,
        isNew: false,
        rating: 5.0,
        reviews: 34,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        sku: "LX-EL-007",
        description: "Powerhouses can be portable. Outfitted with an 8-core processor, high-fidelity color-accurate screen, and an all-aluminum shell that weighs less than 3 lbs. Ideal for designers and developers on the move."
    },
    {
        id: 8,
        title: "Organic Cotton Basic Tee",
        category: "fashion",
        price: 40.50,
        oldPrice: 45.00,
        discount: "-10%",
        isNew: false,
        rating: 4.0,
        reviews: 188,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
        sku: "LX-FA-008",
        description: "The ultimate wardrobe foundation. Made entirely from certified 100% long-staple organic cotton, yielding an exceptionally soft touch, perfect medium weight, and durable structural lifespan."
    },
    {
        id: 9,
        title: "Modern Lounge Chair",
        category: "home",
        price: 210.00,
        oldPrice: null,
        discount: null,
        isNew: false,
        rating: 4.5,
        reviews: 53,
        image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&q=80",
        sku: "LX-HM-009",
        description: "Relaxation, refined. Sculpted curves wrapped in durable, stain-resistant premium linen fabric sitting atop stable, industrial-grade matte black powder-coated steel legs."
    },
    {
        id: 10,
        title: "Ergonomic Wireless Mouse",
        category: "electronics",
        price: 65.00,
        oldPrice: null,
        discount: null,
        isNew: true,
        rating: 5.0,
        reviews: 312,
        image: "https://images.unsplash.com/photo-1527443154391-4206c5ee3145?w=500&q=80",
        sku: "LX-EL-010",
        description: "Say goodbye to wrist fatigue. Contoured specifically to fit the natural slope of your hand, featuring silent click switches, variable DPI adjustments, and multi-device connection switching."
    }
];
/* ==========================================================================
   LUXE E-COMMERCE | MAIN APPLICATION SCRIPT
   Part 2: Product Database (Items 11-20)
   ========================================================================== */

const additionalProducts = [
    {
        id: 11,
        title: "Minimalist LED Desk Lamp",
        category: "home",
        price: 45.00,
        oldPrice: null,
        discount: null,
        isNew: false,
        rating: 4.0,
        reviews: 76,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80",
        sku: "LX-HM-011",
        description: "Focus better with adjustable color temperatures and brightness levels. Features a flicker-free, eye-friendly LED panel with a sleek, space-saving foldable design."
    },
    {
        id: 12,
        title: "Pro Mechanical Keyboard",
        category: "electronics",
        price: 112.50,
        oldPrice: 149.99,
        discount: "-25%",
        isNew: false,
        rating: 4.5,
        reviews: 412,
        image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80",
        sku: "LX-EL-012",
        description: "Tactile, responsive, and durable. Custom mechanical switches provide the perfect feedback for typing or gaming, paired with customizable RGB backlighting."
    },
    {
        id: 13,
        title: "Classic Wool Blend Coat",
        category: "fashion",
        price: 185.00,
        oldPrice: null,
        discount: null,
        isNew: false,
        rating: 5.0,
        reviews: 89,
        image: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=500&q=80",
        sku: "LX-FA-013",
        description: "Sophistication for cold weather. A tailored fit using a high-grade wool blend that provides warmth without excessive bulk. Includes deep pockets and a classic notch lapel."
    },
    {
        id: 14,
        title: "Genuine Slim Leather Wallet",
        category: "accessories",
        price: 49.50,
        oldPrice: null,
        discount: null,
        isNew: false,
        rating: 4.0,
        reviews: 156,
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80",
        sku: "LX-AC-014",
        description: "Keep it light. This slim profile wallet features RFID-blocking technology, six card slots, and a secure compartment for bills, finished with hand-painted edges."
    },
    {
        id: 15,
        title: "Waterproof Portable Speaker",
        category: "electronics",
        price: 129.00,
        oldPrice: null,
        discount: null,
        isNew: true,
        rating: 4.5,
        reviews: 234,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80",
        sku: "LX-EL-015",
        description: "Bring the party anywhere. IPX7 waterproof rating, 20 hours of playtime, and 360-degree sound immersion, all housed in a ruggedized, shockproof rubber casing."
    },
    {
        id: 16,
        title: "Artisan Espresso Machine",
        category: "home",
        price: 250.00,
        oldPrice: null,
        discount: null,
        isNew: false,
        rating: 5.0,
        reviews: 112,
        image: "https://images.unsplash.com/photo-1495474472204-51ea0d20d56c?w=500&q=80",
        sku: "LX-HM-016",
        description: "Barista-quality coffee at home. Featuring precise pressure control, a professional-grade steam wand for micro-foam, and a rapid heating system."
    },
    {
        id: 17,
        title: "Vintage Wash Denim Jacket",
        category: "fashion",
        price: 75.00,
        oldPrice: null,
        discount: null,
        isNew: false,
        rating: 4.5,
        reviews: 198,
        image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&q=80",
        sku: "LX-FA-017",
        description: "An iconic staple. This jacket features a perfectly faded vintage wash, durable metal shank buttons, and a relaxed, versatile fit for layering."
    },
    {
        id: 18,
        title: "Sterling Silver Pendant Chain",
        category: "accessories",
        price: 114.75,
        oldPrice: 135.00,
        discount: "-15%",
        isNew: false,
        rating: 5.0,
        reviews: 47,
        image: "https://images.unsplash.com/photo-1599643478524-fb66f70d00de?w=500&q=80",
        sku: "LX-AC-018",
        description: "Elegant and minimal. Crafted from hypoallergenic sterling silver, this delicate chain features a polished, modern geometric pendant that catches light beautifully."
    },
    {
        id: 19,
        title: "4K Action Camera Bundle",
        category: "electronics",
        price: 349.99,
        oldPrice: null,
        discount: null,
        isNew: false,
        rating: 4.5,
        reviews: 305,
        image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80",
        sku: "LX-EL-019",
        description: "Capture your adventures in stunning 4K detail. Bundle includes waterproof housing, multiple mounts, and two high-capacity batteries."
    },
    {
        id: 20,
        title: "Aromatherapy Soy Candle",
        category: "home",
        price: 35.00,
        oldPrice: null,
        discount: null,
        isNew: false,
        rating: 4.0,
        reviews: 142,
        image: "https://images.unsplash.com/photo-1602874801007-bd458cb6c975?w=500&q=80",
        sku: "LX-HM-020",
        description: "Set the mood. Hand-poured using sustainable soy wax and therapeutic-grade essential oils, offering a clean, long-lasting burn with a calming scent profile."
    }
];

// Merge into main array
products.push(...additionalProducts);
/* ==========================================================================
   LUXE E-COMMERCE | MAIN APPLICATION SCRIPT
   Part 3: Product Database (Items 21-30) & App Initialization
   ========================================================================== */

const finalProducts = [
    { id: 21, title: "Floral Summer Midi Dress", category: "fashion", price: 55.00, oldPrice: null, discount: null, isNew: false, rating: 4.0, reviews: 92, image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80", sku: "LX-FA-021", description: "Lightweight, breathable, and vibrant. Perfect for warm days with its comfortable relaxed fit and elegant midi-length design." },
    { id: 22, title: "Classic Wool Fedora", category: "accessories", price: 25.00, oldPrice: null, discount: null, isNew: false, rating: 3.5, reviews: 34, image: "https://images.unsplash.com/photo-1572595460592-911854ea7468?w=500&q=80", sku: "LX-AC-022", description: "A timeless accessory. Featuring a structured wool felt construction and a sleek grosgrain ribbon band." },
    { id: 23, title: "True Wireless Pro Earbuds", category: "electronics", price: 179.10, oldPrice: 199.00, discount: "-10%", isNew: false, rating: 5.0, reviews: 512, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80", sku: "LX-EL-023", description: "Studio sound on the go. Adaptive noise cancellation, 30-hour battery life with the included wireless charging case." },
    { id: 24, title: "Geometric Indoor Planter", category: "home", price: 85.00, oldPrice: null, discount: null, isNew: false, rating: 4.0, reviews: 61, image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&q=80", sku: "LX-HM-024", description: "Add greenery to your decor. A striking geometric cement planter designed to elevate any succulent or house plant." },
    { id: 25, title: "Slim Fit Selvedge Jeans", category: "fashion", price: 65.00, oldPrice: null, discount: null, isNew: true, rating: 4.5, reviews: 118, image: "https://images.unsplash.com/photo-1542272604-780c8d5015ce?w=500&q=80", sku: "LX-FA-025", description: "Classic style, modern fit. Made from premium rigid selvedge denim that shapes to your body over time." },
    { id: 26, title: "Full Grain Leather Belt", category: "accessories", price: 40.00, oldPrice: null, discount: null, isNew: false, rating: 5.0, reviews: 205, image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=500&q=80", sku: "LX-AC-026", description: "Built to last. Hand-stitched full-grain leather that develops a beautiful patina as it ages." },
    { id: 27, title: "34\" Ultrawide Curved Monitor", category: "electronics", price: 450.00, oldPrice: null, discount: null, isNew: false, rating: 4.5, reviews: 88, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d4aff?w=500&q=80", sku: "LX-EL-027", description: "Master multitasking. 144Hz refresh rate, HDR support, and immersive curved display for ultimate productivity." },
    { id: 28, title: "Abstract Canvas Wall Art", category: "home", price: 84.00, oldPrice: 120.00, discount: "-30%", isNew: false, rating: 4.0, reviews: 42, image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&q=80", sku: "LX-HM-028", description: "Define your aesthetic. A high-quality gallery-wrapped canvas print of a modern abstract piece." },
    { id: 29, title: "Heavyweight Cotton Hoodie", category: "fashion", price: 95.00, oldPrice: null, discount: null, isNew: false, rating: 5.0, reviews: 310, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80", sku: "LX-FA-029", description: "Unmatched comfort. 500gsm heavyweight cotton for a structured look and maximum warmth during cooler days." },
    { id: 30, title: "Chronograph Luxury Watch", category: "accessories", price: 295.00, oldPrice: null, discount: null, isNew: false, rating: 5.0, reviews: 124, image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=500&q=80", sku: "LX-AC-030", description: "A timepiece of precision. Sapphire crystal glass, stainless steel housing, and advanced chronograph functionality." }
];

products.push(...finalProducts);

// --- 3. APP INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial UI Setup
    updateBadges();
    
    // 2. Hide Loader
    const loader = document.getElementById('loading-screen');
    if (loader) {
        setTimeout(() => loader.classList.add('hidden'), 800);
    }
    
    // 3. Render Initial Shop View (if applicable)
    renderProductGrid(products, 'main-shop-grid');
    renderProductGrid(products.slice(0, 4), 'home-product-grid'); // Show only first 4 on home
    
    // 4. Setup Global Listeners
    setupEventListeners();
});

function setupEventListeners() {
    // Theme Toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    
    // Scroll to Top Listener
    window.addEventListener('scroll', () => {
        const btt = document.getElementById('back-to-top');
        if (window.scrollY > 300) btt.classList.add('visible');
        else btt.classList.remove('visible');
    });
}
/* ==========================================================================
   LUXE E-COMMERCE | MAIN APPLICATION SCRIPT
   Part 4: Routing System & Navigation
   ========================================================================== */

// --- ROUTING LOGIC ---
// We listen for changes in the URL hash (e.g., #shop, #checkout) 
// to dynamically switch active sections.

window.addEventListener('hashchange', handleRoute);
window.addEventListener('load', handleRoute);

function handleRoute() {
    const hash = window.location.hash.replace('#', '') || 'home';
    const views = document.querySelectorAll('.view');
    const navLinks = document.querySelectorAll('.nav-link');

    // 1. Hide all views and remove active class from navs
    views.forEach(view => view.classList.remove('active'));
    navLinks.forEach(link => link.classList.remove('active'));

    // 2. Show target view
    const targetView = document.getElementById(`view-${hash}`);
    if (targetView) {
        targetView.classList.add('active');
        
        // Update active nav link
        const activeNavLink = document.querySelector(`.nav-link[onclick="navigateTo('${hash}')"]`);
        if (activeNavLink) activeNavLink.classList.add('active');

        // Scroll to top on navigation
        window.scrollTo(0, 0);
    } else {
        // Fallback to home if invalid route
        document.getElementById('view-home').classList.add('active');
        window.location.hash = 'home';
    }
}

// Helper to trigger navigation via JS
function navigateTo(viewId) {
    window.location.hash = viewId;
    closeMobileMenu(); // Close mobile menu if open
}

// --- MOBILE MENU LOGIC ---
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

function closeMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
    }
}

// --- THEME TOGGLE LOGIC ---
function toggleTheme() {
    const body = document.body;
    const themeToggleBtn = document.getElementById('theme-toggle').querySelector('i');
    
    if (body.classList.contains('theme-light')) {
        body.classList.replace('theme-light', 'theme-dark');
        themeToggleBtn.classList.replace('ph-moon', 'ph-sun');
        currentTheme = 'theme-dark';
    } else {
        body.classList.replace('theme-dark', 'theme-light');
        themeToggleBtn.classList.replace('ph-sun', 'ph-moon');
        currentTheme = 'theme-light';
    }
    
    localStorage.setItem('luxe_theme', currentTheme);
}

// --- UTILITY: SCROLL TO TOP ---
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
/* ==========================================================================
   LUXE E-COMMERCE | MAIN APPLICATION SCRIPT
   Part 5: Cart & Wishlist Core Logic
   ========================================================================== */

// --- 1. CART FUNCTIONS ---
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ ...product, quantity });
    }

    saveAndRefresh();
    showToast(`${product.title} added to cart!`, 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveAndRefresh();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) removeFromCart(productId);
        else saveAndRefresh();
    }
}

// --- 2. WISHLIST FUNCTIONS ---
function toggleWishlist(productId) {
    const exists = wishlist.find(id => id === productId);
    
    if (exists) {
        wishlist = wishlist.filter(id => id !== productId);
        showToast('Removed from wishlist', 'info');
    } else {
        wishlist.push(productId);
        showToast('Added to wishlist!', 'success');
    }
    
    saveAndRefresh();
}

function moveToCart(productId) {
    addToCart(productId);
    toggleWishlist(productId); // Remove from wishlist after moving
}

function clearWishlist() {
    wishlist = [];
    saveAndRefresh();
}

// --- 3. PERSISTENCE & HELPERS ---
function saveAndRefresh() {
    localStorage.setItem('luxe_cart', JSON.stringify(cart));
    localStorage.setItem('luxe_wishlist', JSON.stringify(wishlist));
    
    updateBadges();
    renderCart();
    renderWishlist();
}

function updateBadges() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const wishlistCount = wishlist.length;

    // Update Header Badges
    document.getElementById('cart-badge').innerText = cartCount;
    document.getElementById('wishlist-badge').innerText = wishlistCount;
    
    // Update Floating Mobile Cart
    const floatingBadge = document.getElementById('floating-cart-badge');
    if (floatingBadge) floatingBadge.innerText = cartCount;
}

// --- 4. SIDEBAR UI CONTROL ---
function openCart() {
    document.getElementById('cart-sidebar').classList.add('active');
    document.getElementById('cart-overlay').classList.add('active');
}

function closeCart() {
    document.getElementById('cart-sidebar').classList.remove('active');
    document.getElementById('cart-overlay').classList.remove('active');
}

function openWishlist() {
    document.getElementById('wishlist-sidebar').classList.add('active');
    document.getElementById('wishlist-overlay').classList.add('active');
}

function closeWishlist() {
    document.getElementById('wishlist-sidebar').classList.remove('active');
    document.getElementById('wishlist-overlay').classList.remove('active');
}

/* ==========================================================================
   LUXE E-COMMERCE | MAIN APPLICATION SCRIPT
   Part 6: Cart & Wishlist UI Rendering
   ========================================================================== */

function renderCart() {
    const container = document.getElementById('cart-list');
    const emptyState = document.getElementById('cart-empty-state');
    const footer = document.getElementById('cart-footer');
    const subtotalEl = document.getElementById('cart-subtotal');
    
    // Clear existing
    container.innerHTML = '';
    
    if (cart.length === 0) {
        emptyState.style.display = 'flex';
        footer.style.display = 'none';
        document.getElementById('cart-count-header').innerText = '0';
        return;
    }

    emptyState.style.display = 'none';
    footer.style.display = 'block';
    document.getElementById('cart-count-header').innerText = cart.reduce((s, i) => s + i.quantity, 0);

    let subtotal = 0;

    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        
        const li = document.createElement('li');
        li.className = 'cart-item';
        li.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="cart-item-details">
                <h4>${item.title}</h4>
                <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                <div class="quantity-selector small">
                    <button onclick="updateQuantity(${item.id}, -1)"><i class="ph ph-minus"></i></button>
                    <input type="number" value="${item.quantity}" readonly>
                    <button onclick="updateQuantity(${item.id}, 1)"><i class="ph ph-plus"></i></button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})"><i class="ph ph-trash"></i></button>
        `;
        container.appendChild(li);
    });

    subtotalEl.innerText = `$${subtotal.toFixed(2)}`;
    updateShippingProgress(subtotal);
}

function renderWishlist() {
    const container = document.getElementById('wishlist-list');
    const emptyState = document.getElementById('wishlist-empty-state');
    const footer = document.getElementById('wishlist-footer');
    
    container.innerHTML = '';
    
    if (wishlist.length === 0) {
        emptyState.style.display = 'flex';
        footer.style.display = 'none';
        document.getElementById('wishlist-count-header').innerText = '0';
        return;
    }

    emptyState.style.display = 'none';
    footer.style.display = 'block';
    document.getElementById('wishlist-count-header').innerText = wishlist.length;

    wishlist.forEach(id => {
        const item = products.find(p => p.id === id);
        if (!item) return;
        
        const li = document.createElement('li');
        li.className = 'wishlist-item';
        li.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="wishlist-item-details">
                <h4>${item.title}</h4>
                <span class="wishlist-item-price">$${item.price.toFixed(2)}</span>
                <button class="btn btn-sm btn-outline" onclick="moveToCart(${item.id})">Move to Cart</button>
            </div>
            <button class="remove-item" onclick="toggleWishlist(${item.id})"><i class="ph ph-x"></i></button>
        `;
        container.appendChild(li);
    });
}

function updateShippingProgress(subtotal) {
    const freeShippingThreshold = 500;
    const progressFill = document.getElementById('shipping-progress');
    const message = document.getElementById('shipping-message');
    
    const percentage = Math.min((subtotal / freeShippingThreshold) * 100, 100);
    progressFill.style.width = `${percentage}%`;
    
    if (subtotal >= freeShippingThreshold) {
        message.innerText = "You've unlocked free shipping!";
    } else {
        message.innerText = `Add $${(freeShippingThreshold - subtotal).toFixed(2)} more for free shipping`;
    }
}
/* ==========================================================================
   LUXE E-COMMERCE | MAIN APPLICATION SCRIPT
   Part 7: Product Filtering, Searching, & Sorting
   ========================================================================== */

// --- 1. CORE FILTERING LOGIC ---
function applyFilters() {
    const category = document.getElementById('category-filter').value;
    const sort = document.getElementById('sort-filter').value;
    const search = document.getElementById('global-search').value.toLowerCase();

    let filtered = [...products];

    // Filter by Category
    if (category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
    }

    // Filter by Search
    if (search) {
        filtered = filtered.filter(p => 
            p.title.toLowerCase().includes(search) || 
            p.category.toLowerCase().includes(search)
        );
    }

    // Sort Products
    if (sort === 'price-low') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'price-high') filtered.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);

    renderProductGrid(filtered, 'main-shop-grid');
}

// --- 2. DYNAMIC RENDERING ---
function renderProductGrid(productList, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = productList.length > 0 
        ? productList.map(product => `
            <div class="product-card" data-id="${product.id}">
                ${product.discount ? `<div class="product-badge discount">${product.discount}</div>` : ''}
                ${product.isNew ? `<div class="product-badge new">New</div>` : ''}
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}" loading="lazy">
                    <div class="product-actions-overlay">
                        <button class="btn-icon wishlist-btn" onclick="toggleWishlist(${product.id})"><i class="ph ph-heart"></i></button>
                        <button class="btn-icon quick-view-btn" onclick="openQuickView(${product.id})"><i class="ph ph-eye"></i></button>
                    </div>
                </div>
                <div class="product-info">
                    <span class="product-category">${product.category}</span>
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-rating">
                        ${renderStars(product.rating)}
                        <span class="review-count">(${product.reviews})</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">$${product.price.toFixed(2)}</span>
                        ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                    </div>
                    <button class="btn btn-block btn-add-cart" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        `).join('')
        : '<p class="text-center w-100">No products found matching your criteria.</p>';
}

// --- 3. HELPER FUNCTIONS ---
function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) stars += '<i class="ph-fill ph-star"></i>';
        else if (i === Math.ceil(rating) && !Number.isInteger(rating)) stars += '<i class="ph-half ph-star"></i>';
        else stars += '<i class="ph ph-star"></i>';
    }
    return stars;
}

// Global Search Listener
document.getElementById('global-search').addEventListener('input', () => {
    // Navigate to shop if user searches from home
    if (window.location.hash !== '#shop') navigateTo('shop');
    applyFilters();
});
/* ==========================================================================
   LUXE E-COMMERCE | MAIN APPLICATION SCRIPT
   Part 8: Quick View & Product Detail Logic
   ========================================================================== */

function openQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Populate Modal Content
    document.getElementById('qv-main-image').src = product.image;
    document.getElementById('qv-category').innerText = product.category.toUpperCase();
    document.getElementById('qv-title').innerText = product.title;
    document.getElementById('qv-price').innerText = `$${product.price.toFixed(2)}`;
    document.getElementById('qv-rating').innerHTML = renderStars(product.rating) + ` (${product.reviews})`;
    document.getElementById('qv-sku').innerText = product.sku;
    document.getElementById('qv-quantity').value = 1;

    // Setup Add to Cart Button
    const addBtn = document.getElementById('qv-add-to-cart');
    addBtn.onclick = () => {
        const qty = parseInt(document.getElementById('qv-quantity').value);
        addToCart(product.id, qty);
        closeQuickView();
    };

    // Setup Wishlist Button
    const wishBtn = document.getElementById('qv-wishlist-btn');
    wishBtn.onclick = () => toggleWishlist(product.id);

    // Show Modal
    document.getElementById('quick-view-modal').classList.add('active');
}

function closeQuickView() {
    document.getElementById('quick-view-modal').classList.remove('active');
}

function updateQvQuantity(change) {
    const input = document.getElementById('qv-quantity');
    let val = parseInt(input.value) + change;
    if (val < 1) val = 1;
    if (val > 10) val = 10;
    input.value = val;
}

// Close modal when clicking escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeQuickView();
        closeCart();
        closeWishlist();
        closeLoginModal();
    }
});
/* ==========================================================================
   LUXE E-COMMERCE | MAIN APPLICATION SCRIPT
   Part 9: Checkout & Coupon System
   ========================================================================== */

let appliedCoupon = null;

function proceedToCheckout() {
    closeCart();
    navigateTo('checkout');
    renderCheckoutSummary();
}

function renderCheckoutSummary() {
    const container = document.getElementById('checkout-items-list');
    container.innerHTML = cart.map(item => `
        <div class="summary-row">
            <span>${item.quantity}x ${item.title}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    
    updateCheckoutTotals();
}

function updateCheckoutTotals() {
    const subtotal = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
    const taxRate = 0.08;
    const shipping = subtotal > 500 ? 0 : 15.00;
    
    let discount = 0;
    if (appliedCoupon === 'SUMMER26') discount = subtotal * 0.20;

    const tax = (subtotal - discount) * taxRate;
    const total = subtotal - discount + tax + shipping;

    document.getElementById('checkout-subtotal').innerText = `$${subtotal.toFixed(2)}`;
    document.getElementById('checkout-shipping').innerText = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    document.getElementById('checkout-tax').innerText = `$${tax.toFixed(2)}`;
    document.getElementById('checkout-total').innerText = `$${total.toFixed(2)}`;

    if (discount > 0) {
        document.getElementById('checkout-discount-row').style.display = 'flex';
        document.getElementById('checkout-discount').innerText = `-$${discount.toFixed(2)}`;
    }
}

function applyCoupon() {
    const code = document.getElementById('coupon-code').value.toUpperCase();
    const msg = document.getElementById('coupon-message');
    
    if (code === 'SUMMER26') {
        appliedCoupon = code;
        msg.innerText = "Coupon applied! 20% off.";
        msg.style.display = 'block';
        updateCheckoutTotals();
        document.getElementById('applied-coupon-name').innerText = code;
    } else {
        msg.innerText = "Invalid coupon code.";
        msg.className = "text-sm text-danger";
        msg.style.display = 'block';
    }
}

function handleCheckout(event) {
    event.preventDefault();
    
    // Simulate order processing
    document.getElementById('place-order-btn').innerHTML = '<i class="ph ph-circle-notch"></i> Processing...';
    
    setTimeout(() => {
        cart = [];
        localStorage.removeItem('luxe_cart');
        saveAndRefresh();
        showToast('Order placed successfully! Thank you for shopping with us.', 'success');
        navigateTo('home');
        document.getElementById('place-order-btn').innerHTML = 'Place Order';
    }, 2000);
}

function togglePaymentDetails() {
    const method = document.querySelector('input[name="payment-type"]:checked').value;
    document.getElementById('cc-details').style.display = method === 'credit-card' ? 'block' : 'none';
    document.getElementById('paypal-details').style.display = method === 'paypal' ? 'block' : 'none';
}
/* ==========================================================================
   LUXE E-COMMERCE | MAIN APPLICATION SCRIPT
   Part 10: Account & Order History Logic
   ========================================================================== */

// --- 1. TAB SWITCHING (Orders/Profile/Addresses) ---
function switchAccountTab(tabId, event) {
    if (event) event.preventDefault();
    
    // Update active tab button
    document.querySelectorAll('#account-nav li').forEach(li => li.classList.remove('active'));
    event.currentTarget.parentElement.classList.add('active');
    
    // Show correct content
    document.querySelectorAll('.account-tab').forEach(tab => tab.style.display = 'none');
    document.getElementById(`tab-${tabId}`).style.display = 'block';
}

// --- 2. AUTH MODAL (Login/Register) ---
function openLoginModal(event) {
    if (event) event.preventDefault();
    document.getElementById('login-modal').classList.add('active');
}

function closeLoginModal() {
    document.getElementById('login-modal').classList.remove('active');
}

function switchAuthTab(tabType) {
    const loginForm = document.getElementById('login-form');
    const regForm = document.getElementById('register-form');
    const tabs = document.querySelectorAll('.auth-tab');
    
    tabs.forEach(t => t.classList.toggle('active'));
    
    if (tabType === 'login') {
        loginForm.style.display = 'block';
        regForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        regForm.style.display = 'block';
    }
}

function handleAuth(type) {
    // In a real project, this would send data to an API
    showToast(`${type === 'login' ? 'Logged' : 'Registered'} successfully!`, 'success');
    closeLoginModal();
}
/* ==========================================================================
   LUXE E-COMMERCE | MAIN APPLICATION SCRIPT
   Part 11: Theme Toggling, Toasts, & FAQ Handlers
   ========================================================================== */

// --- 1. TOAST NOTIFICATION SYSTEM ---
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'ph-check-circle' : 
                 type === 'error' ? 'ph-x-circle' : 'ph-info';
                 
    toast.innerHTML = `
        <i class="ph ${icon}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- 2. FAQ TOGGLE HANDLER ---
function toggleFaq(btn) {
    const faqItem = btn.parentElement;
    
    // Close other FAQs
    document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) item.classList.remove('active');
    });
    
    // Toggle current
    faqItem.classList.toggle('active');
}

// --- 3. THEME TOGGLE LOGIC ---
function toggleTheme() {
    const body = document.body;
    const themeToggleBtn = document.getElementById('theme-toggle').querySelector('i');
    
    if (body.classList.contains('theme-light')) {
        body.classList.replace('theme-light', 'theme-dark');
        themeToggleBtn.classList.replace('ph-moon', 'ph-sun');
        currentTheme = 'theme-dark';
    } else {
        body.classList.replace('theme-dark', 'theme-light');
        themeToggleBtn.classList.replace('ph-sun', 'ph-moon');
        currentTheme = 'theme-light';
    }
    
    localStorage.setItem('luxe_theme', currentTheme);
}
/* ==========================================================================
   LUXE E-COMMERCE | MAIN APPLICATION SCRIPT
   Part 12: Utility Functions & Final App Setup
   ========================================================================== */

// --- 1. GLOBAL UI INITIALIZATION ---
function setupEventListeners() {
    // Theme Toggle
    document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);

    // Back to Top Button Logic
    window.addEventListener('scroll', () => {
        const btt = document.getElementById('back-to-top');
        if (btt) {
            if (window.scrollY > 500) btt.classList.add('visible');
            else btt.classList.remove('visible');
        }
    });

    // Close Modals/Sidebars when clicking overlay
    document.querySelectorAll('.sidebar-overlay, .modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', () => {
            closeCart();
            closeWishlist();
            closeQuickView();
            closeLoginModal();
        });
    });
}

// --- 2. DATA HYDRATION ---
// Ensures UI reflects stored state after page refresh
function hydrateUI() {
    const savedTheme = localStorage.getItem('luxe_theme');
    if (savedTheme === 'theme-dark') {
        document.body.classList.replace('theme-light', 'theme-dark');
        const icon = document.querySelector('#theme-toggle i');
        if (icon) icon.classList.replace('ph-moon', 'ph-sun');
    }
    
    // Initial Render
    updateBadges();
    renderCart();
    renderWishlist();
    
    // If on shop page, reset filters
    if (document.getElementById('main-shop-grid')) {
        applyFilters();
    }
}

// --- 3. START APP ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial State
    hydrateUI();
    setupEventListeners();

    // 2. Initial Render
    const homeGrid = document.getElementById('home-product-grid');
    if (homeGrid) renderProductGrid(products.slice(0, 4), 'home-product-grid');

    // 3. Remove Loading Screen
    const loader = document.getElementById('loading-screen');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.classList.add('hidden'), 500);
        }, 1000);
    }
    
    console.log("Luxe E-Commerce: Engine Initialized.");
});