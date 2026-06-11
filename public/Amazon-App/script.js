// ==========================================
// AMAZON CLONE MAIN SCRIPT
// ==========================================

const SHEET_API = "https://script.google.com/macros/s/AKfycbzI6cS_gorYb_53SRxs-TiYO6ZvWBJ3_2KV2QCMeHNwZBoDaKGFl-TsRc94LOthQQ/exec";
// Replace the URL above with your published Google Sheet or Apps Script endpoint.

const DUMMY_API = "https://dummyjson.com/products?limit=100";

function parseGoogleSheetResponse(text) {
    const jsonMatch = text.match(/^\s*(?:.*?setResponse\()?([\s\S]*?)\)\s*;?\s*$/);
    const raw = jsonMatch ? jsonMatch[1] : text;
    return JSON.parse(raw);
}

function normalizeSheetRows(data) {
    if (Array.isArray(data)) {
        return data;
    }
    if (data.table && Array.isArray(data.table.rows) && Array.isArray(data.table.cols)) {
        return data.table.rows.map(row => {
            const item = {};
            row.c.forEach((cell, index) => {
                const key = data.table.cols[index].label || data.table.cols[index].id || `col_${index}`;
                item[key] = cell ? cell.v : "";
            });
            return item;
        });
    }
    if (data.feed && Array.isArray(data.feed.entry)) {
        return data.feed.entry.map(entry => {
            const item = {};
            Object.keys(entry).forEach(k => {
                if (k.startsWith("gsx$")) {
                    item[k.replace("gsx$", "").replace(/_/g, " ")] = entry[k].$t;
                }
            });
            return item;
        });
    }
    return [];
}

async function fetchSheetProducts() {
    try {
        const res = await fetch(SHEET_API);
        if (!res.ok) {
            console.warn(`Google Sheet request failed: ${res.status} ${res.statusText}`);
            return [];
        }

        const text = await res.text();
        if (text.trim().startsWith("<")) {
            console.warn("Google Sheet endpoint returned HTML instead of JSON.");
            return [];
        }

        const data = parseGoogleSheetResponse(text);
        return normalizeSheetRows(data);
    } catch (error) {
        console.warn("Failed to load Google Sheet products:", error);
        return [];
    }
}

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // SELECTORS
    // ==========================================

    const imgs = document.querySelectorAll('.header-slider ul img');

    const prevBtn = document.querySelector('.control_prev');
    const nextBtn = document.querySelector('.control_next');

    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");
    const menuBtn = document.querySelector(".MenuSidebar");

    const darkModeBtn = document.getElementById("dark-mode-btn");

    const toggleText = document.getElementById("toggle-text");

    const searchInputs =
        document.querySelectorAll('.nav-search-input');
    const searchBtns =
        document.querySelectorAll('.nav-search-icon');
    const categorySelects =
        document.querySelectorAll('select[name="category"]');

    function executeSearch(inputEl) {
        // find the closest category select or just use the first one
        let category = 'all';
        if (categorySelects.length > 0) {
            category = categorySelects[0].value;
        }

        let query = '';
        if (inputEl) {
            query = inputEl.value.trim();
        } else if (searchInputs.length > 0) {
            query = searchInputs[0].value.trim();
        }

        if (query || (category && category !== 'all')) {
            window.location.href = `searchproduct.html?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`;
        }
    }

    searchInputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                executeSearch(input);
            }
        });
    });

    searchBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Find the associated input
            const container = btn.closest('.nav-search');
            let input = null;
            if (container) {
                input = container.querySelector('.nav-search-input');
            }
            executeSearch(input);
        });
    });

    // Category dropdown change → immediately navigate
    categorySelects.forEach(select => {
        select.addEventListener('change', () => {
            const category = select.value;
            // Find the associated search input
            const container = select.closest('.nav-search');
            let query = '';
            if (container) {
                const input = container.querySelector('.nav-search-input');
                if (input) query = input.value.trim();
            }
            window.location.href = `search.html?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`;
        });
    });

    // ==========================================
    // SIDEBAR OPEN
    // ==========================================

    if (menuBtn) {

        menuBtn.addEventListener("click", () => {

            sidebar.classList.add("active");

            overlay.classList.add("active");

            document.body.style.overflow = "hidden";

        });

    }

    // ==========================================
    // SIDEBAR CLOSE
    // ==========================================

    function closeSidebar() {

        if (sidebar && overlay) {

            sidebar.classList.remove("active");

            overlay.classList.remove("active");

            document.body.style.overflow = "";

        }

    }

    // Overlay click

    if (overlay) {

        overlay.addEventListener("click", closeSidebar);

    }

    // ESC close

    document.addEventListener("keydown", (e) => {

        if (e.key === "Escape") {

            closeSidebar();

        }

    });

    // ==========================================
    // SIDEBAR ACCORDION
    // ==========================================

    window.toggleSidebarAccordion = function (header) {

        const accordion =
            header.parentElement;

        const allAccordions =
            document.querySelectorAll('.sidebar-accordion');

        allAccordions.forEach(acc => {

            if (acc !== accordion) {

                acc.classList.remove('accordion-open');

            }

        });

        accordion.classList.toggle('accordion-open');

    };

    // ==========================================
    // DARK MODE
    // ==========================================

    function enableDarkMode() {

        document.body.classList.add("dark-theme");

        localStorage.setItem("theme", "dark");

        if (toggleText) {

            toggleText.textContent = "On";

        }

    }

    function enableLightMode() {

        document.body.classList.remove("dark-theme");

        localStorage.setItem("theme", "light");

        if (toggleText) {

            toggleText.textContent = "Off";

        }

    }

    // Load saved theme

    if (localStorage.getItem("theme") === "dark") {

        enableDarkMode();

    }

    // Toggle theme

    if (darkModeBtn) {

        darkModeBtn.addEventListener("click", () => {

            if (
                document.body.classList.contains("dark-theme")
            ) {

                enableLightMode();

            } else {

                enableDarkMode();

            }

        });

    }

    // ==========================================
    // SIDEBAR CONTAINER TOGGLE
    // ==========================================

    const themeContainer =
        document.querySelector(".theme-switch-container");

    if (themeContainer) {

        themeContainer.addEventListener("click", () => {

            if (document.body.classList.contains("dark-theme")) {

                enableLightMode();

            } else {

                enableDarkMode();

            }

        });

    }

    // ==========================================
    // HEADER SLIDER
    // ==========================================

    let n = 0;

    function changeSlide() {

        if (!imgs.length) return;

        imgs.forEach((img) => {

            img.style.display = "none";

        });

        imgs[n].style.display = "block";

    }

    if (imgs.length > 0) {

        changeSlide();

        // Previous

        if (prevBtn) {

            prevBtn.addEventListener("click", () => {

                if (n > 0) {

                    n--;

                } else {

                    n = imgs.length - 1;

                }

                changeSlide();

            });

        }

        // Next

        if (nextBtn) {

            nextBtn.addEventListener("click", () => {

                if (n < imgs.length - 1) {

                    n++;

                } else {

                    n = 0;

                }

                changeSlide();

            });

        }

        // Auto slide

        setInterval(() => {

            if (n < imgs.length - 1) {

                n++;

            } else {

                n = 0;

            }

            changeSlide();

        }, 4000);

    }

    // ==========================================
    // HORIZONTAL PRODUCT SCROLL
    // ==========================================





    // -------------------------------------------------
    // Load products from Google Sheet and render them
    // -------------------------------------------------
    async function loadAndRenderProducts() {
        const products = await fetchSheetProducts();
        if (!products || !products.length) {
            console.warn('No products fetched from sheet.');
            return;
        }

        const containers = document.querySelectorAll('.products');
        containers.forEach(container => {
            // clear any placeholder cards
            container.innerHTML = '';
            products.forEach(p => {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                    <div class="product-img-container">
                        <img src="${safeImage(p.image)}" alt="${p.title || 'Product'}">
                    </div>
                    <div class="product-offer"></div>
                    <p class="product-price">$ <span>${p.price || '0'}</span> List Price: $${p.listPrice || p.price || '0'}</p>
                    <h4>${p.title || 'Product'}</h4>
                    <button class="add-cart-btn">Add to Cart</button>
                `;
                container.appendChild(card);
            });
        });

        // re‑attach add‑to‑cart listeners for the newly created buttons
        attachAddCartListeners();
    }

    // Re‑use existing cart helpers to bind click events
    function attachAddCartListeners() {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach((card, index) => {
            const btn = card.querySelector('.add-cart-btn');
            if (!btn) return;
            btn.addEventListener('click', () => {
                const product = {
                    id: index + 1,
                    title: card.querySelector('h4')?.innerText || 'Product',
                    price: card.querySelector('.product-price span')?.innerText || '0',
                    image: card.querySelector('img')?.src || ''
                };
                cart.push(product);
                saveCart();
                updateCartCount();
                alert(`${product.title} added to cart`);
            });
        });
    }

    // Trigger loading after DOM is ready
    loadAndRenderProducts();

    const scrollContainers = document.querySelectorAll('.products');
    scrollContainers.forEach(container => {
        container.addEventListener('wheel', (evt) => {
            evt.preventDefault();
            container.scrollLeft += evt.deltaY;
        });
    });
    // SEARCH PRODUCTS
    // ==========================================

    function executeSearch(query) {
        window.location.href = `searchproduct.html?q=${encodeURIComponent(query)}`;
    }

    searchInputs.forEach(input => {
        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                const query = input.value.trim();
                if (query.length > 0) {
                    executeSearch(query);
                }
            }
        });
    });

    const searchButtons = document.querySelectorAll('.nav-search-icon');
    searchButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const input = btn.previousElementSibling;
            if (input && input.value) {
                const query = input.value.trim();
                if (query.length > 0) {
                    executeSearch(query);
                }
            }
        });
    });

    const categoryItems = document.querySelectorAll('.category-list li');
    categoryItems.forEach(item => {
        item.addEventListener("click", () => {
            const catText = item.querySelector('.cat-text');
            if (catText) {
                const category = catText.innerText.toLowerCase();
                window.location.href = `searchproduct.html?category=${encodeURIComponent(category)}`;
            }
        });
    });

    // ==========================================
    // CART SYSTEM
    // ==========================================

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    function saveCart() {

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

        updateCartCount();

    }

    window.updateCartCount = function() {
        const cartCounts = document.querySelectorAll(".cart-count");
        let totalQty = 0;
        let currentCart = JSON.parse(localStorage.getItem("cart")) || [];
        currentCart.forEach(item => totalQty += (item.qty || 1));
        cartCounts.forEach(el => {
            el.innerText = totalQty;
        });
    };

    window.updateCartCount();

    // ==========================================
    // NAV CART REDIRECT
    // ==========================================
    const navCartBtns = document.querySelectorAll(".nav-cart");
    navCartBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            window.location.href = "cart.html";
        });
    });

    // ==========================================
    // ADD TO CART BUTTONS
    // ==========================================

    const productCards = document.querySelectorAll(".product-card");


    productCards.forEach((card, index) => {

        let btn = card.querySelector(".add-cart-btn");

        if (!btn) {

            btn = document.createElement("button");

            btn.classList.add("add-cart-btn");

            btn.innerText = "Add to Cart";

            card.appendChild(btn);
        }

            // Add click event
        btn.addEventListener("click", () => {

            const product = {
                id: "idx_" + index,
                title: card.querySelector("h4")?.innerText || "Product",
                price: card.querySelector(".product-price span")?.innerText || "0",
                image: card.querySelector("img")?.src || ""
            };

            let existingItem = cart.find(item => item.id === product.id);
            if (existingItem) {
                existingItem.qty = (existingItem.qty || 1) + 1;
            } else {
                product.qty = 1;
                cart.push(product);
            }

            saveCart();
            alert(`${product.title} added to cart`);
        });

    });

    // ==========================================
    // USER AUTH
    // ==========================================

    const signinModal =
        document.getElementById("signin-modal");

    const signupModal =
        document.getElementById("signup-modal");

    const openSignin =
        document.getElementById("open-signin");

    const signinBtn =
        document.getElementById("signin-btn");

    const signupBtn =
        document.getElementById("signup-btn");

    const showSignup =
        document.getElementById("show-signup");

    const closeBtns =
        document.querySelectorAll(".close-btn");

    // Open Signin

    if (openSignin) {

        openSignin.addEventListener("click", () => {

            signinModal.style.display = "flex";

        });

    }

    // Close modals

    closeBtns.forEach(btn => {

        btn.addEventListener("click", () => {

            signinModal.style.display = "none";

            signupModal.style.display = "none";

        });

    });

    // Open signup

    if (showSignup) {

        showSignup.addEventListener("click", () => {

            signinModal.style.display = "none";

            signupModal.style.display = "flex";

        });

    }

    // Signup

    if (signupBtn) {

        signupBtn.addEventListener("click", () => {

            const name =
                document.getElementById("signup-name").value;

            const email =
                document.getElementById("signup-email").value;

            const password =
                document.getElementById("signup-password").value;

            const user = {
                name,
                email,
                password
            };

            localStorage.setItem(
                "amazonUser",
                JSON.stringify(user)
            );

            alert("Account Created");

            signupModal.style.display = "none";

        });

    }

    // Signin

    if (signinBtn) {

        signinBtn.addEventListener("click", () => {

            const email =
                document.getElementById("signin-email").value;

            const password =
                document.getElementById("signin-password").value;

            const savedUser =
                JSON.parse(
                    localStorage.getItem("amazonUser")
                );

            if (
                savedUser &&
                savedUser.email === email &&
                savedUser.password === password
            ) {

                localStorage.setItem(
                    "currentUser",
                    savedUser.name
                );

                alert("Login Successful");

                location.reload();

            } else {

                alert("Invalid Credentials");

            }

        });

    }

    // ==========================================
    // UPDATE NAVBAR USER
    // ==========================================

    function updateNavbar() {

        const currentUser =
            localStorage.getItem("currentUser");

        const userArea =
            document.getElementById("user-area");

        if (currentUser && userArea) {

            userArea.innerHTML = `
            
                <p>Hello, ${currentUser}</p>

                <h1 id="logout-btn">
                    Logout
                </h1>
            
            `;

            document
                .getElementById("logout-btn")
                .addEventListener("click", () => {

                    localStorage.removeItem(
                        "currentUser"
                    );

                    location.reload();

                });

        }

    }

    updateNavbar();

    // ==========================================
    // BACK TO TOP
    // ==========================================

    const topBtn =
        document.createElement("button");

    topBtn.innerHTML = "↑";

    topBtn.classList.add("top-btn");

    document.body.appendChild(topBtn);

    window.addEventListener("scroll", () => {

        if (window.scrollY > 300) {

            topBtn.style.display = "block";

        }

    });

    topBtn.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

});

// ==========================================
// SAFE HELPERS
// ==========================================
function safeImage(src) {
    const fallback = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23e0e0e0' width='300' height='300'/%3E%3C/svg%3E";
    if (!src) return fallback;
    const s = String(src).trim();
    // Attempt to convert Google Drive share links to direct image URLs
    try {
        const u = new URL(s, window.location.href);
        const host = u.hostname.toLowerCase();
        if (host === 'drive.google.com') {
            // Case 1: "open?id=FILE_ID"
            const idFromParam = u.searchParams.get('id');
            if (idFromParam) {
                return `https://drive.google.com/uc?export=view&id=${idFromParam}`;
            }
            // Case 2: "/file/d/FILE_ID/..."
            const fileMatch = u.pathname.match(/\/file\/d\/([\w-]+)/i);
            if (fileMatch && fileMatch[1]) {
                return `https://drive.google.com/uc?export=view&id=${fileMatch[1]}`;
            }
            // Case 3: Already a direct "uc?export=view&id=..." link
            if (u.pathname.includes('/uc')) {
                return s;
            }
        }
    } catch (e) {
        // If URL parsing fails, fall back to default handling
    }
    // If it's already a regular http(s) URL, return it unchanged
    if (/^https?:\/\//i.test(s)) return s;
    // Otherwise use fallback placeholder image
    return fallback;

}

// FakeStore normalizer
function formatFakeStoreProduct(p) {
    return {
        id: "fs_" + p.id,
        title: p.title,
        price: p.price,
        description: p.description || "",
        category: p.category || "all",
        thumbnail: safeImage(p.image)
    };
}

// Google Sheet normalizer
function formatSheetProduct(p, index = 0) {
    // create a normalized-key map for flexible field names coming from Apps Script
    const normalized = {};
    for (const key in p) {
        if (!Object.prototype.hasOwnProperty.call(p, key)) continue;
        const nk = String(key).trim().toLowerCase().replace(/\s+/g, '').replace(/[_-]/g, '');
        normalized[nk] = p[key];
    }

    const get = (...candidates) => {
        for (const c of candidates) {
            const nk = String(c).trim().toLowerCase().replace(/\s+/g, '').replace(/[_-]/g, '');
            if (normalized[nk] !== undefined && normalized[nk] !== null && normalized[nk] !== '') return normalized[nk];
        }
        return undefined;
    };

    let imageUrl = get('Image URL', 'Product Image', 'imageUrl', 'image', 'thumbnail') || '';
    try {
        const u = new URL(imageUrl, window.location.href);
        if (u.hostname.toLowerCase() === 'drive.google.com') {
            const idMatch = imageUrl.match(/[?&]id=([^&]+)/) || imageUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
            if (idMatch) {
                imageUrl = `https://lh3.googleusercontent.com/d/${idMatch[1]}=w1000`;
            }
        }
    } catch (e) {
        // Ignore parsing errors
    }

    const title = get('Product Name', 'productName', 'title', 'name') || 'No Title';
    const priceVal = get('Price', 'price') || 0;
    const description = get('Description', 'Product Description', 'description') || '';
    const category = (get('Category', 'category') || 'all').toString().toLowerCase();
    const shopName = get('Shop Name', 'shopName', 'shop') || '';
    const shopOwner = get('Shop Owner Name', 'shopOwnerName', 'owner') || '';
    const shopContact = get('Shop Contact Details', 'shopContactDetails', 'contact', 'contactdetails') || '';

    return {
        id: "sheet_" + (get('Timestamp', 'timestamp') || String(index)),
        title: title,
        price: Number(priceVal) || 0,
        description: description,
        category: category,
        thumbnail: safeImage(imageUrl),
        shopName: shopName,
        shopOwner: shopOwner,
        shopContact: shopContact
    };
}

// ==========================================
// SEARCH PAGE
// ==========================================
const isSearchPage = ["search.html", "searchproduct.html"].some(name => window.location.pathname.includes(name));

if (isSearchPage) {

    const urlParams = new URLSearchParams(window.location.search);
    const query = (urlParams.get("q") || "").toLowerCase();
    const category = (urlParams.get("category") || "all").toLowerCase();

    const productsGrid = document.getElementById("search-products");

    async function fetchProducts() {
        if (!productsGrid) return;

        productsGrid.innerHTML = "<h2>Loading...</h2>";

        try {
            console.log("Fetching APIs...");

            // FETCH DUMMY API, FAKE STORE, AND GOOGLE SHEET
            let dummy = [];
            let fake = [];
            let sheet = [];

            try {
                const dummyRes = await fetch(DUMMY_API);
                const dummyData = await dummyRes.json();
                dummy = Array.isArray(dummyData)
                    ? dummyData
                    : dummyData.products || [];
            } catch (err) {
                console.warn("Dummy API failed, falling back to dummyjson:", err);
                const fallbackRes = await fetch("https://dummyjson.com/products?limit=100");
                const fallbackData = await fallbackRes.json();
                dummy = fallbackData.products || [];
            }

            try {
                const fakeRes = await fetch("https://fakestoreapi.com/products");
                const fakeData = await fakeRes.json();
                fake = fakeData.map(formatFakeStoreProduct);
            } catch (err) {
                console.warn("FakeStore fetch failed:", err);
            }

            try {
                const sheetData = await fetchSheetProducts();
                sheet = sheetData.map(formatSheetProduct);
            } catch (err) {
                console.error("SHEET ERROR:", err);
            }

            // DummyJSON normalization
            dummy = dummy.map(p => ({
                id: p.id || `dummy_${Math.random().toString(36).slice(2, 10)}`,
                title: p.title,
                price: p.price,
                description: p.description,
                category: (p.category || "all").toLowerCase(),
                thumbnail: safeImage(p.thumbnail || p.image)
            }));

            // MERGE ALL PRODUCTS
            let products = [...dummy, ...fake, ...sheet];

            // FILTER
            products = products.filter(p => {

                const matchQuery =
                    !query || p.title.toLowerCase().includes(query);

                const matchCategory =
                    category === "all" ||
                    (p.category || "").toLowerCase() === category;

                return matchQuery && matchCategory;
            });

            renderProducts(products);

        } catch (err) {
            console.error("FETCH ERROR:", err);
            productsGrid.innerHTML = "<h2>Error loading products</h2>";
        }
    }

    function renderProducts(products) {
        productsGrid.innerHTML = "";

        if (!products.length) {
            productsGrid.innerHTML = `<div class="products-grid-message"><p>No products found for your search.</p></div>`;
            return;
        }

        // Inject a count bar above the grid
        const container = productsGrid.parentElement;
        let header = container.querySelector('.search-header');
        if (!header) {
            header = document.createElement('div');
            header.className = 'search-header';
            container.insertBefore(header, productsGrid);
        }
        header.innerHTML = `Showing <span>${products.length}</span> result${products.length !== 1 ? 's' : ''}`;

        products.forEach(p => {
            const card = document.createElement("div");
            card.className = "product-card";

            // Price formatting: split into dollar integer and cents
            const priceNum = parseFloat(p.price) || 0;
            const priceInt = Math.floor(priceNum);
            const priceCents = Math.round((priceNum - priceInt) * 100).toString().padStart(2, '0');

            // Star rating
            const rating = p.rating ? (typeof p.rating === 'object' ? p.rating.rate : p.rating) : 0;
            const fullStars = Math.round(rating);
            const starsHtml = '★'.repeat(Math.min(fullStars, 5)) + '☆'.repeat(Math.max(0, 5 - fullStars));
            const ratingCount = p.rating && p.rating.count ? ` (${p.rating.count})` : '';

            const shopInfo = p.shopName ? `<p class="shop-badge">${p.shopName}${p.shopOwner ? ` • ${p.shopOwner}` : ""}</p>` : "";

            card.innerHTML = `
                <div class="product-img-container">
                    <img src="${safeImage(p.thumbnail)}" alt="${p.title}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22300%22 height=%22300%22/%3E%3C/svg%3E';">
                </div>
                <div class="card-body">
                    <h3>${p.title}</h3>
                    ${rating > 0 ? `<div class="card-rating"><span class="stars">${starsHtml}</span><span>${rating.toFixed(1)}${ratingCount}</span></div>` : ''}
                    ${shopInfo}
                    <div class="product-price">
                        <span class="price-symbol">$</span>
                        <span class="price-integer">${priceInt}</span>
                        <span class="price-cents">${priceCents}</span>
                    </div>
                    <button onclick="window.location.href='products.html?id=${p.id}'">
                        View Details
                    </button>
                </div>
            `;

            productsGrid.appendChild(card);
        });
    }

    fetchProducts();
}

// ==========================================
// PRODUCT DETAILS PAGE
// ==========================================
if (window.location.pathname.includes("products.html")) {

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    const detailContainer = document.getElementById("product-detail");

    async function loadProduct() {

        if (!productId || !detailContainer) return;

        detailContainer.innerHTML = "<h2>Loading...</h2>";

        try {
            let product;

            // FakeStore
            if (productId.startsWith("fs_")) {

                const res = await fetch(
                    `https://fakestoreapi.com/products/${productId.replace("fs_", "")}`
                );

                const p = await res.json();
                product = formatFakeStoreProduct(p);

            }
            // DummyJSON
            else if (!productId.startsWith("sheet_")) {

                const res = await fetch(
                    `https://dummyjson.com/products/${productId}`
                );

                product = await res.json();
                product.thumbnail = safeImage(product.thumbnail);

            }
            // Sheet product: fetch from Google Sheet and find matching ID
            else {
                try {
                    const sheetData = await fetchSheetProducts();
                    const sheetProducts = sheetData.map(formatSheetProduct);
                    product = sheetProducts.find(p => p.id === productId);

                    if (!product) {
                        throw new Error("Product not found in sheet");
                    }
                } catch (sheetErr) {
                    console.error("Sheet product fetch error:", sheetErr);
                    product = {
                        id: productId,
                        title: "Sheet Product",
                        price: 0,
                        description: "",
                        thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23e0e0e0' width='300' height='300'/%3E%3C/svg%3E"
                    };
                }
            }

            renderProduct(product);

        } catch (err) {
            console.error(err);
            detailContainer.innerHTML = "<h2>Error loading product</h2>";
        }
    }

    function renderProduct(p) {
        // Price formatting
        const priceNum = parseFloat(p.price) || 0;
        const priceInt = Math.floor(priceNum);
        const priceCents = Math.round((priceNum - priceInt) * 100).toString().padStart(2, '0');

        // Rating stars
        const rating = p.rating ? (typeof p.rating === 'object' ? p.rating.rate : p.rating) : 0;
        const fullStars = Math.round(rating);
        const starsHtml = '★'.repeat(Math.min(fullStars, 5)) + '☆'.repeat(Math.max(0, 5 - fullStars));
        const ratingText = rating > 0 ? `${rating.toFixed(2)} out of 5` : '';

        detailContainer.innerHTML = `
            <div class="product-details-container">
                <div class="product-image-col">
                    <div class="main-image-wrap">
                        <img src="${safeImage(p.thumbnail)}" alt="${p.title || 'Product'}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22300%22 height=%22300%22/%3E%3C/svg%3E';">
                    </div>
                </div>

                <div class="product-info-col">
                    <h1>${p.title || 'Product'}</h1>
                    ${rating > 0 ? `
                    <div class="product-rating">
                        <span class="stars">${starsHtml}</span>
                        <span class="rating-text">${ratingText}</span>
                    </div>` : ''}
                    <div class="product-price-large">
                        <span class="price-symbol">$</span>
                        <span class="price-integer">${priceInt}</span>
                        <span class="price-cents">${priceCents}</span>
                    </div>
                    ${p.description ? `
                    <p class="product-about-title">About this item</p>
                    <p class="product-description">${p.description}</p>
                    ` : ''}
                </div>

                <div class="product-buy-col">
                    <div class="price">$${priceNum.toFixed(2)}</div>
                    <div class="stock-status">In Stock</div>
                    <div class="buy-btn-container">
                        <button class="btn-add-to-cart" onclick="addToCart('${p.id}', '${(p.title || '').replace(/'/g, '&apos;')}', ${priceNum}, '${p.thumbnail || ''}')">
                            Add to Cart
                        </button>
                        <button class="btn-buy-now" onclick="buyNow('${p.id}', '${(p.title || '').replace(/'/g, '&apos;')}', ${priceNum}, '${p.thumbnail || ''}')">
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
                    

    loadProduct();
}
                    
                    
// ==========================================
// CART SYSTEM
// ==========================================
window.addToCart = function (id, title, price, image) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.qty = (existingItem.qty || 1) + 1;
    } else {
        cart.push({
            id,
            title,
            price,
            image: safeImage(image),
            qty: 1
        });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    if(window.updateCartCount) window.updateCartCount();
    alert("Added to cart");
};

window.buyNow = function (id, title, price, image) {
    const orderId = '112-' + Math.floor(1000000 + Math.random() * 9000000) + '-' + Math.floor(1000000 + Math.random() * 9000000);
    const orderDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    let orders = JSON.parse(localStorage.getItem("amazonOrders")) || [];
    orders.unshift({
        id: orderId,
        item: title,
        price: price,
        image: safeImage(image),
        status: 'Processing',
        date: orderDate
    });
    localStorage.setItem("amazonOrders", JSON.stringify(orders));
    alert("Order placed successfully! Redirecting you to Your Orders in Customer Service...");
    window.location.href = "Customer-Service/index.html#tile-orders";
};

// ==========================================
// CART PAGE RENDERING
// ==========================================
function initCartPage() {
    const cartItemsContainer = document.getElementById("cart-items-container");
    if (!cartItemsContainer) return; // Not on cart page

    const savedItemsContainer = document.getElementById("saved-items-container");
    const savedSection = document.getElementById("saved-for-later-section");

    function getCart() { return JSON.parse(localStorage.getItem("cart")) || []; }
    function getSaved() { return JSON.parse(localStorage.getItem("savedForLater")) || []; }
    function setCart(c) { localStorage.setItem("cart", JSON.stringify(c)); }
    function setSaved(s) { localStorage.setItem("savedForLater", JSON.stringify(s)); }

    function renderAll() {
        renderCart();
        renderSaved();
        if (window.updateCartCount) window.updateCartCount();
    }

    function renderCart() {
        let cart = getCart();
        cartItemsContainer.innerHTML = "";
        let subtotal = 0;
        let totalItems = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="cart-empty-msg">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <p>Your cart is empty.</p>
                </div>`;
        } else {
            cart.forEach((item, index) => {
                const qty = item.qty || 1;
                let priceNum = parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
                subtotal += priceNum * qty;
                totalItems += qty;

                const row = document.createElement("div");
                row.className = "cart-item-row";
                row.innerHTML = `
                    <div class="cart-item-img">
                        <img src="${item.image}" alt="${item.title}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22120%22 height=%22120%22/%3E%3C/svg%3E';">
                    </div>
                    <div class="cart-item-details">
                        <h3 class="cart-item-title">${item.title}</h3>
                        <p class="cart-item-stock">In Stock</p>
                        <p class="cart-item-price">₹${priceNum.toLocaleString('en-IN')}</p>
                        <div class="cart-item-actions">
                            <div class="cart-qty-box">
                                Qty:
                                <select class="cart-qty-select" data-index="${index}">
                                    ${[1,2,3,4,5,6,7,8,9,10].map(n => `<option value="${n}" ${n === qty ? 'selected' : ''}>${n}</option>`).join('')}
                                </select>
                            </div>
                            <span class="cart-action-divider">|</span>
                            <span class="cart-action-btn delete-btn" data-index="${index}">Delete</span>
                            <span class="cart-action-divider">|</span>
                            <span class="cart-action-btn save-later-btn" data-index="${index}">Save for later</span>
                        </div>
                    </div>
                `;
                cartItemsContainer.appendChild(row);
            });
        }

        // Update subtotal & item counts
        document.querySelectorAll(".cart-total-items").forEach(el => el.innerText = totalItems);
        document.querySelectorAll(".cart-subtotal-price").forEach(el =>
            el.innerText = '₹' + subtotal.toLocaleString('en-IN', {minimumFractionDigits:0, maximumFractionDigits:2})
        );
        const countText = document.getElementById("cart-item-count-text");
        if (countText) countText.innerText = `${totalItems} item${totalItems !== 1 ? 's' : ''} in your cart`;

        // --- Delete ---
        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", e => {
                const idx = parseInt(e.target.getAttribute("data-index"));
                const cart = getCart();
                cart.splice(idx, 1);
                setCart(cart);
                renderAll();
            });
        });

        // --- Save for later ---
        document.querySelectorAll(".save-later-btn").forEach(btn => {
            btn.addEventListener("click", e => {
                const idx = parseInt(e.target.getAttribute("data-index"));
                let cart = getCart();
                let saved = getSaved();
                const [item] = cart.splice(idx, 1);    // remove from cart
                item.qty = 1;                           // reset qty when saving
                saved.push(item);
                setCart(cart);
                setSaved(saved);
                renderAll();
            });
        });

        // --- Qty change ---
        document.querySelectorAll(".cart-qty-select").forEach(sel => {
            sel.addEventListener("change", e => {
                const idx = parseInt(e.target.getAttribute("data-index"));
                let cart = getCart();
                cart[idx].qty = parseInt(e.target.value);
                setCart(cart);
                renderAll();
            });
        });
    }

    function renderSaved() {
        if (!savedItemsContainer || !savedSection) return;
        let saved = getSaved();

        const countEl = document.getElementById("saved-count");
        const pluralEl = document.getElementById("saved-count-plural");
        if (countEl) countEl.innerText = saved.length;
        if (pluralEl) pluralEl.innerText = saved.length === 1 ? '' : 's';

        savedSection.style.display = saved.length > 0 ? "block" : "none";
        savedItemsContainer.innerHTML = "";

        saved.forEach((item, index) => {
            let priceNum = parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;

            const row = document.createElement("div");
            row.className = "cart-item-row saved-item-row";
            row.innerHTML = `
                <div class="cart-item-img">
                    <img src="${item.image}" alt="${item.title}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22120%22 height=%22120%22/%3E%3C/svg%3E';">
                </div>
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${item.title}</h3>
                    <p class="cart-item-price">₹${priceNum.toLocaleString('en-IN')}</p>
                    <div class="cart-item-actions">
                        <button class="move-to-cart-btn" data-index="${index}">Move to cart</button>
                        <span class="cart-action-divider">|</span>
                        <span class="cart-action-btn delete-saved-btn" data-index="${index}">Delete</span>
                    </div>
                </div>
            `;
            savedItemsContainer.appendChild(row);
        });

        // --- Move to cart ---
        document.querySelectorAll(".move-to-cart-btn").forEach(btn => {
            btn.addEventListener("click", e => {
                const idx = parseInt(e.target.getAttribute("data-index"));
                let saved = getSaved();
                let cart = getCart();
                const [item] = saved.splice(idx, 1);
                item.qty = 1;
                // merge if already in cart
                const existing = cart.find(c => c.id === item.id);
                if (existing) {
                    existing.qty = (existing.qty || 1) + 1;
                } else {
                    cart.push(item);
                }
                setSaved(saved);
                setCart(cart);
                renderAll();
            });
        });

        // --- Delete saved item ---
        document.querySelectorAll(".delete-saved-btn").forEach(btn => {
            btn.addEventListener("click", e => {
                const idx = parseInt(e.target.getAttribute("data-index"));
                let saved = getSaved();
                saved.splice(idx, 1);
                setSaved(saved);
                renderAll();
            });
        });
    }

    renderAll();

    const proceedBuyBtn = document.querySelector(".proceed-buy-btn");
    if (proceedBuyBtn) {
        proceedBuyBtn.addEventListener("click", () => {
            let cart = getCart();
            if (cart.length === 0) {
                alert("Your cart is empty!");
                return;
            }
            
            let orders = JSON.parse(localStorage.getItem("amazonOrders")) || [];
            
            cart.forEach(item => {
                const orderId = '112-' + Math.floor(1000000 + Math.random() * 9000000) + '-' + Math.floor(1000000 + Math.random() * 9000000);
                const orderDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                orders.unshift({
                    id: orderId,
                    item: item.title,
                    price: item.price,
                    image: item.image || '',
                    status: 'Processing',
                    date: orderDate
                });
            });
            
            localStorage.setItem("amazonOrders", JSON.stringify(orders));
            localStorage.removeItem("cart"); // Clear cart
            
            alert("Order placed successfully! Redirecting you to Your Orders in Customer Service...");
            window.location.href = "Customer-Service/index.html#tile-orders";
        });
    }
}

document.addEventListener("DOMContentLoaded", initCartPage);

