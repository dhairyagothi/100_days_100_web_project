/**
 * Online Book Store - JavaScript Logic
 */

// ==========================================================================
// Mock Book Data (20+ Books)
// ==========================================================================
const booksData = [
    // Fiction
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "Fiction", price: 10.99, rating: 4.5, pages: 180, publisher: "Scribner", language: "English", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop", description: "A novel set in the Jazz Age that tells the story of Jay Gatsby's unrequited love for Daisy Buchanan.", featured: true },
    { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", category: "Fiction", price: 12.99, rating: 4.8, pages: 281, publisher: "J.B. Lippincott & Co.", language: "English", image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop", description: "A classic of modern American literature exploring racial injustice in the Deep South." },
    { id: 3, title: "1984", author: "George Orwell", category: "Fiction", price: 14.50, rating: 4.7, pages: 328, publisher: "Secker & Warburg", language: "English", image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=600&auto=format&fit=crop", description: "A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism." },
    
    // Programming
    { id: 4, title: "Clean Code", author: "Robert C. Martin", category: "Programming", price: 34.99, rating: 4.9, pages: 464, publisher: "Prentice Hall", language: "English", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop", description: "A Handbook of Agile Software Craftsmanship, teaching you how to write better, more readable code.", featured: true },
    { id: 5, title: "JavaScript: The Good Parts", author: "Douglas Crockford", category: "Programming", price: 24.50, rating: 4.4, pages: 176, publisher: "O'Reilly Media", language: "English", image: "https://images.unsplash.com/photo-1627398240309-089a144099b9?q=80&w=600&auto=format&fit=crop", description: "Unearthing the Excellence in JavaScript, focusing on the beautiful, elegant, and highly expressive features of the language." },
    { id: 6, title: "Eloquent JavaScript", author: "Marijn Haverbeke", category: "Programming", price: 29.99, rating: 4.8, pages: 472, publisher: "No Starch Press", language: "English", image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?q=80&w=600&auto=format&fit=crop", description: "A modern introduction to programming, focusing on JavaScript and browser environments." },
    
    // Business
    { id: 7, title: "The Lean Startup", author: "Eric Ries", category: "Business", price: 18.99, rating: 4.6, pages: 336, publisher: "Crown Business", language: "English", image: "https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=600&auto=format&fit=crop", description: "How Today's Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses." },
    { id: 8, title: "Zero to One", author: "Peter Thiel", category: "Business", price: 22.00, rating: 4.5, pages: 224, publisher: "Crown Business", language: "English", image: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?q=80&w=600&auto=format&fit=crop", description: "Notes on Startups, or How to Build the Future.", featured: true },
    { id: 9, title: "Good to Great", author: "Jim Collins", category: "Business", price: 24.99, rating: 4.7, pages: 320, publisher: "HarperBusiness", language: "English", image: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=600&auto=format&fit=crop", description: "Why Some Companies Make the Leap and Others Don't." },
    
    // Self Help
    { id: 10, title: "Atomic Habits", author: "James Clear", category: "Self Help", price: 16.99, rating: 4.9, pages: 320, publisher: "Avery", language: "English", image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop", description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones.", featured: true },
    { id: 11, title: "The Subtle Art of Not Giving a F*ck", author: "Mark Manson", category: "Self Help", price: 15.50, rating: 4.3, pages: 224, publisher: "HarperOne", language: "English", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop", description: "A Counterintuitive Approach to Living a Good Life." },
    
    // Fantasy
    { id: 12, title: "The Hobbit", author: "J.R.R. Tolkien", category: "Fantasy", price: 14.99, rating: 4.8, pages: 310, publisher: "George Allen & Unwin", language: "English", image: "https://images.unsplash.com/photo-1608666566023-e91b02683a5f?q=80&w=600&auto=format&fit=crop", description: "A fantasy novel about the quest of home-loving hobbit Bilbo Baggins to win a share of the treasure guarded by Smaug the dragon.", featured: true },
    { id: 13, title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", category: "Fantasy", price: 19.99, rating: 4.9, pages: 309, publisher: "Bloomsbury", language: "English", image: "https://images.unsplash.com/photo-1626618012641-bfbca5a31239?q=80&w=600&auto=format&fit=crop", description: "The first novel in the Harry Potter series, following a young wizard's first year at Hogwarts." },
    { id: 14, title: "The Name of the Wind", author: "Patrick Rothfuss", category: "Fantasy", price: 21.50, rating: 4.7, pages: 662, publisher: "DAW Books", language: "English", image: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?q=80&w=600&auto=format&fit=crop", description: "The first day of the story of Kvothe, a renowned musician, scholar, and arcanist." },
    
    // Science
    { id: 15, title: "A Brief History of Time", author: "Stephen Hawking", category: "Science", price: 17.50, rating: 4.6, pages: 212, publisher: "Bantam Books", language: "English", image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600&auto=format&fit=crop", description: "From the Big Bang to Black Holes. A landmark volume in science writing." },
    { id: 16, title: "Cosmos", author: "Carl Sagan", category: "Science", price: 20.00, rating: 4.8, pages: 365, publisher: "Random House", language: "English", image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=600&auto=format&fit=crop", description: "The story of fifteen billion years of cosmic evolution transforming matter and life into consciousness.", featured: true },
    
    // History
    { id: 17, title: "Sapiens: A Brief History of Humankind", author: "Yuval Noah Harari", category: "History", price: 22.99, rating: 4.7, pages: 443, publisher: "Harvill Secker", language: "English", image: "https://images.unsplash.com/photo-1560089000-7433a4ebbd64?q=80&w=600&auto=format&fit=crop", description: "A book by Yuval Noah Harari, first published in Hebrew in Israel in 2011 based on a series of lectures.", featured: true },
    { id: 18, title: "Guns, Germs, and Steel", author: "Jared Diamond", category: "History", price: 18.50, rating: 4.5, pages: 480, publisher: "W. W. Norton", language: "English", image: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?q=80&w=600&auto=format&fit=crop", description: "The Fates of Human Societies." },
    
    // Biography
    { id: 19, title: "Steve Jobs", author: "Walter Isaacson", category: "Biography", price: 24.00, rating: 4.6, pages: 656, publisher: "Simon & Schuster", language: "English", image: "https://images.unsplash.com/photo-1585776269984-dc0809279a0f?q=80&w=600&auto=format&fit=crop", description: "The exclusive biography of Steve Jobs." },
    { id: 20, title: "Educated", author: "Tara Westover", category: "Biography", price: 16.00, rating: 4.8, pages: 334, publisher: "Random House", language: "English", image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=600&auto=format&fit=crop", description: "A memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University.", featured: true }
];

// ==========================================================================
// State Management
// ==========================================================================
let cart = JSON.parse(localStorage.getItem('bookstore_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('bookstore_wishlist')) || [];
let currentBooks = [...booksData]; // Copy for filtering/sorting
let activeCategory = 'All';
let currentSearch = '';

// ==========================================================================
// DOM Elements
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    
    // Render initial data
    renderFeaturedBooks();
    renderBooks(currentBooks);
    updateCartCount();
    updateWishlistCount();
    renderCart();
    renderWishlist();
    checkTheme();

    // Event Listeners - Navigation & Toggles
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    
    // Sticky Nav effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = 'var(--shadow-md)';
        } else {
            navbar.style.boxShadow = 'var(--shadow-sm)';
        }
        
        // Scroll to top button
        const scrollTopBtn = document.getElementById('scroll-top');
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.querySelector('i').classList.replace('fa-xmark', 'fa-bars');
        });
    });

    // Scroll to top
    document.getElementById('scroll-top').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Theme Toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    // Overlays and Modals Setup
    const overlay = document.getElementById('overlay');
    
    const closeModalsAndSidebars = () => {
        document.querySelectorAll('.sidebar, .modal').forEach(el => el.classList.remove('active'));
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    overlay.addEventListener('click', closeModalsAndSidebars);
    
    document.querySelectorAll('.close-sidebar, .close-modal').forEach(btn => {
        btn.addEventListener('click', closeModalsAndSidebars);
    });

    // Cart Toggle
    document.getElementById('cart-toggle').addEventListener('click', () => {
        document.getElementById('cart-sidebar').classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Wishlist Toggle
    document.getElementById('wishlist-toggle').addEventListener('click', () => {
        document.getElementById('wishlist-sidebar').classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Checkout Modal
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (cart.length === 0) {
            showToast('Your cart is empty', 'error');
            return;
        }
        closeModalsAndSidebars();
        setTimeout(() => {
            document.getElementById('checkout-modal').classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }, 300); // slight delay for smooth transition
    });

    // Checkout Form Submit
    document.getElementById('checkout-form').addEventListener('submit', (e) => {
        e.preventDefault();
        // Fake processing
        closeModalsAndSidebars();
        cart = [];
        saveCart();
        renderCart();
        updateCartCount();
        e.target.reset();
        showToast('Order placed successfully!', 'success');
    });

    // Search and Filter Events
    document.getElementById('hero-search').addEventListener('input', (e) => {
        const val = e.target.value;
        document.getElementById('main-search').value = val;
        handleSearch(val);
        // smooth scroll to books section if typing in hero
        if (val.length > 2 && window.scrollY < document.getElementById('books-section').offsetTop - 100) {
            document.getElementById('books-section').scrollIntoView({ behavior: 'smooth' });
        }
    });

    document.getElementById('search-btn').addEventListener('click', () => {
        const val = document.getElementById('hero-search').value;
        handleSearch(val);
        document.getElementById('books-section').scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('main-search').addEventListener('input', (e) => {
        handleSearch(e.target.value);
    });

    // Categories filter
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all
            categoryBtns.forEach(b => b.classList.remove('active'));
            // Add to clicked
            e.target.classList.add('active');
            
            activeCategory = e.target.dataset.category;
            applyFilters();
            
            // Scroll to books section
            document.getElementById('books-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Sort Events
    document.getElementById('sort-select').addEventListener('change', (e) => {
        handleSort(e.target.value);
    });

    // Reset filters from empty state
    document.getElementById('reset-filters-btn').addEventListener('click', () => {
        document.getElementById('hero-search').value = '';
        document.getElementById('main-search').value = '';
        document.getElementById('sort-select').value = 'default';
        currentSearch = '';
        activeCategory = 'All';
        
        categoryBtns.forEach(b => b.classList.remove('active'));
        document.querySelector('.category-btn[data-category="All"]').classList.add('active');
        
        applyFilters();
    });

    // Global Event Delegation for dynamic buttons
    document.body.addEventListener('click', (e) => {
        // Add to Cart
        if (e.target.closest('.add-to-cart-btn')) {
            const btn = e.target.closest('.add-to-cart-btn');
            const id = parseInt(btn.dataset.id);
            addToCart(id);
        }
        
        // Wishlist Toggle from Card/Modal
        if (e.target.closest('.wishlist-btn-card')) {
            const btn = e.target.closest('.wishlist-btn-card');
            const id = parseInt(btn.dataset.id);
            toggleWishlist(id, btn);
            e.stopPropagation(); // Prevent opening modal if clicking wishlist icon on image
        }

        // View Details / Open Modal
        if (e.target.closest('.view-details-btn') || e.target.closest('.book-title')) {
            const el = e.target.closest('.view-details-btn') || e.target.closest('.book-title');
            const id = parseInt(el.dataset.id);
            openBookModal(id);
        }
    });
});

// ==========================================================================
// Rendering Functions
// ==========================================================================

function createBookCard(book) {
    const isWishlisted = wishlist.some(item => item.id === book.id);
    return `
        <div class="book-card" data-id="${book.id}">
            <div class="book-img-container">
                <img src="${book.image}" alt="${book.title}" loading="lazy">
                <button class="wishlist-btn-card ${isWishlisted ? 'active' : ''}" data-id="${book.id}" aria-label="Toggle Wishlist">
                    <i class="fa-${isWishlisted ? 'solid' : 'regular'} fa-heart"></i>
                </button>
                <div class="book-overlay">
                    <button class="view-details-btn" data-id="${book.id}">View Details</button>
                </div>
            </div>
            <div class="book-info">
                <span class="book-category">${book.category}</span>
                <h3 class="book-title" data-id="${book.id}" title="${book.title}">${book.title}</h3>
                <p class="book-author">${book.author}</p>
                <div class="book-rating">
                    ${getRatingStars(book.rating)}
                    <span>(${book.rating})</span>
                </div>
                <div class="book-footer">
                    <span class="book-price">$${book.price.toFixed(2)}</span>
                    <button class="icon-btn add-to-cart-btn" data-id="${book.id}" title="Add to Cart">
                        <i class="fa-solid fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderFeaturedBooks() {
    const featuredContainer = document.getElementById('featured-books');
    const featuredBooks = booksData.filter(b => b.featured).slice(0, 4); // Max 4 for featured grid
    featuredContainer.innerHTML = featuredBooks.map(book => createBookCard(book)).join('');
}

function renderBooks(booksToRender) {
    const grid = document.getElementById('books-grid');
    const emptyState = document.getElementById('empty-state');
    
    if (booksToRender.length === 0) {
        grid.innerHTML = '';
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        grid.innerHTML = booksToRender.map(book => createBookCard(book)).join('');
    }
}

function getRatingStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            stars += '<i class="fa-solid fa-star"></i>';
        } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
            stars += '<i class="fa-solid fa-star-half-stroke"></i>';
        } else {
            stars += '<i class="fa-regular fa-star"></i>';
        }
    }
    return stars;
}

// ==========================================================================
// Filtering & Sorting
// ==========================================================================

function handleSearch(query) {
    currentSearch = query.toLowerCase();
    applyFilters();
}

function applyFilters() {
    let filtered = booksData;

    // Apply category filter
    if (activeCategory !== 'All') {
        filtered = filtered.filter(book => book.category === activeCategory);
    }

    // Apply search filter
    if (currentSearch) {
        filtered = filtered.filter(book => 
            book.title.toLowerCase().includes(currentSearch) ||
            book.author.toLowerCase().includes(currentSearch) ||
            book.category.toLowerCase().includes(currentSearch)
        );
    }

    currentBooks = filtered;
    
    // Maintain current sort
    const sortValue = document.getElementById('sort-select').value;
    handleSort(sortValue, false); // false means don't re-render twice
    
    renderBooks(currentBooks);
}

function handleSort(sortType, reRender = true) {
    switch (sortType) {
        case 'price-low':
            currentBooks.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            currentBooks.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            currentBooks.sort((a, b) => b.rating - a.rating);
            break;
        default:
            // For 'default', just sort by ID to restore original order, but respect filters
            currentBooks.sort((a, b) => a.id - b.id);
            break;
    }
    
    if (reRender) {
        renderBooks(currentBooks);
    }
}

// ==========================================================================
// Cart Logic
// ==========================================================================

function addToCart(bookId) {
    const book = booksData.find(b => b.id === bookId);
    if (!book) return;

    const existingItem = cart.find(item => item.id === bookId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...book, quantity: 1 });
    }

    saveCart();
    updateCartCount();
    renderCart();
    showToast(`"${book.title}" added to cart`, 'success');
}

function removeFromCart(bookId) {
    cart = cart.filter(item => item.id !== bookId);
    saveCart();
    updateCartCount();
    renderCart();
}

function updateQuantity(bookId, delta) {
    const item = cart.find(i => i.id === bookId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(bookId);
        } else {
            saveCart();
            updateCartCount();
            renderCart();
        }
    }
}

function saveCart() {
    localStorage.setItem('bookstore_cart', JSON.stringify(cart));
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-badge').textContent = count;
}

function renderCart() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-sidebar">
                <i class="fa-solid fa-cart-arrow-down"></i>
                <h3>Your cart is empty</h3>
                <p>Browse books and add them to your cart.</p>
            </div>
        `;
        totalEl.textContent = '$0.00';
        checkoutBtn.disabled = true;
        checkoutBtn.style.opacity = 0.5;
        return;
    }

    checkoutBtn.disabled = false;
    checkoutBtn.style.opacity = 1;

    let total = 0;
    container.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `
            <div class="cart-item">
                <div class="cart-item-img">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.title}</h4>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-controls">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="qty-input">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        <button class="btn remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    totalEl.textContent = `$${total.toFixed(2)}`;
}

// ==========================================================================
// Wishlist Logic
// ==========================================================================

function toggleWishlist(bookId, btnElement = null) {
    const book = booksData.find(b => b.id === bookId);
    if (!book) return;

    const existingIndex = wishlist.findIndex(item => item.id === bookId);
    let isAdded = false;

    if (existingIndex > -1) {
        wishlist.splice(existingIndex, 1);
        showToast(`"${book.title}" removed from wishlist`);
    } else {
        wishlist.push(book);
        isAdded = true;
        showToast(`"${book.title}" added to wishlist`, 'success');
    }

    saveWishlist();
    updateWishlistCount();
    renderWishlist();

    // Update UI dynamically
    const allCardBtns = document.querySelectorAll(`.wishlist-btn-card[data-id="${bookId}"]`);
    allCardBtns.forEach(btn => {
        const icon = btn.querySelector('i');
        if (isAdded) {
            btn.classList.add('active');
            icon.classList.replace('fa-regular', 'fa-solid');
        } else {
            btn.classList.remove('active');
            icon.classList.replace('fa-solid', 'fa-regular');
        }
    });
}

function saveWishlist() {
    localStorage.setItem('bookstore_wishlist', JSON.stringify(wishlist));
}

function updateWishlistCount() {
    document.getElementById('wishlist-badge').textContent = wishlist.length;
}

function renderWishlist() {
    const container = document.getElementById('wishlist-items');

    if (wishlist.length === 0) {
        container.innerHTML = `
            <div class="empty-sidebar">
                <i class="fa-regular fa-heart"></i>
                <h3>Wishlist is empty</h3>
                <p>Save your favorite books here.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = wishlist.map(item => `
        <div class="wishlist-item">
            <div class="wishlist-item-img">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="wishlist-item-info">
                <h4 class="wishlist-item-title">${item.title}</h4>
                <div class="wishlist-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-controls" style="margin-top: 10px;">
                    <button class="btn btn-primary" style="padding: 0.25rem 0.75rem; font-size: 0.8rem;" onclick="addToCart(${item.id})">Add to Cart</button>
                    <button class="btn remove-btn" onclick="toggleWishlist(${item.id})">Remove</button>
                </div>
            </div>
        </div>
    `).join('');
}

// ==========================================================================
// Book Details Modal
// ==========================================================================

function openBookModal(bookId) {
    const book = booksData.find(b => b.id === bookId);
    if (!book) return;

    const modalContent = document.getElementById('book-modal-content');
    const isWishlisted = wishlist.some(item => item.id === bookId);

    modalContent.innerHTML = `
        <div class="book-details">
            <div class="book-details-img">
                <img src="${book.image}" alt="${book.title}">
            </div>
            <div class="book-details-info">
                <span class="book-category">${book.category}</span>
                <h2>${book.title}</h2>
                <div class="author">by ${book.author}</div>
                <div class="book-rating" style="margin-bottom: 0.5rem;">
                    ${getRatingStars(book.rating)}
                    <span style="color: var(--text-secondary); margin-left: 0.5rem;">(${book.rating} Rating)</span>
                </div>
                <div class="book-details-price">$${book.price.toFixed(2)}</div>
                
                <p class="book-details-desc">${book.description}</p>
                
                <div class="book-meta">
                    <div class="meta-item">
                        <span class="meta-label">Pages</span>
                        <span class="meta-value">${book.pages}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Publisher</span>
                        <span class="meta-value">${book.publisher}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Language</span>
                        <span class="meta-value">${book.language}</span>
                    </div>
                </div>
                
                <div class="book-details-actions">
                    <button class="btn btn-primary w-100" onclick="addToCart(${book.id})">
                        <i class="fa-solid fa-cart-plus"></i> Add to Cart
                    </button>
                    <button class="btn btn-secondary w-100 wishlist-btn-card ${isWishlisted ? 'active' : ''}" style="position: static; border-radius: 8px; width: 100%; box-shadow: none;" data-id="${book.id}" onclick="toggleWishlist(${book.id}, this)">
                        <i class="fa-${isWishlisted ? 'solid' : 'regular'} fa-heart"></i> ${isWishlisted ? 'Saved' : 'Wishlist'}
                    </button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('book-modal').classList.add('active');
    document.getElementById('overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ==========================================================================
// UI Utilities (Toast, Dark Mode)
// ==========================================================================

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'fa-circle-info';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'error') icon = 'fa-circle-xmark';

    toast.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.add('removing');
        toast.addEventListener('transitionend', () => {
            toast.remove();
        });
    }, 3000);
}

function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('bookstore_theme', isDark ? 'dark' : 'light');
    
    updateThemeIcon(isDark);
}

function checkTheme() {
    const savedTheme = localStorage.getItem('bookstore_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
        updateThemeIcon(true);
    } else {
        updateThemeIcon(false);
    }
}

function updateThemeIcon(isDark) {
    const btn = document.getElementById('theme-toggle');
    const icon = btn.querySelector('i');
    
    if (isDark) {
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
    }
}
