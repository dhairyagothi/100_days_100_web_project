// ==========================================
// AMAZON CLONE MAIN SCRIPT
// ==========================================

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
            window.location.href = `search.html?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`;
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

    window.toggleSidebarAccordion = function(header) {

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

    const scrollContainers =
        document.querySelectorAll('.products');

    scrollContainers.forEach((item) => {

        item.addEventListener('wheel', (evt) => {

            evt.preventDefault();

            item.scrollLeft += evt.deltaY;

        });

    });

    // ==========================================
    // SEARCH PRODUCTS
    // ==========================================

    function executeSearch(query) {
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
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
                window.location.href = `search.html?category=${encodeURIComponent(category)}`;
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

    function updateCartCount() {

        const cartCounts =
            document.querySelectorAll(".cart-count");

        cartCounts.forEach(el => {

            el.innerText = cart.length;

        });

    }

    updateCartCount();

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

            id: index + 1,

            title:
                card.querySelector("h4")?.innerText || "Product",

            price:
                card.querySelector(".product-price span")
                ?.innerText || "0",

            image:
                card.querySelector("img")?.src || ""

        };

        // Add to cart array
        cart.push(product);

        // Save cart
        saveCart();

        // Update cart count
        updateCartCount();

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
// SEARCH & CATEGORY LOGIC (For search.html)
// ==========================================
if (window.location.pathname.endsWith("search.html")) {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("q");
    const category = urlParams.get("category");
    
    const productsGrid = document.getElementById("search-products");

    // Sync category dropdown to match URL param
    const catSelect = document.querySelector('select[name="category"]');
    if (catSelect && category) {
        catSelect.value = category;
    }

    // Populate search input from URL param
    const searchInput = document.querySelector('.nav-search-input');
    if (searchInput && query) {
        searchInput.value = query;
    }
    
    async function fetchProducts() {
        if (!productsGrid) return;
        productsGrid.innerHTML = "<h2>Loading...</h2>";
        
        let products = [];
        try {
            if (query && category && category !== "all" && category !== "null") {
                // Search within category: Try DummyJSON
                let res = await fetch(`https://dummyjson.com/products/category/${encodeURIComponent(category)}`);
                let data = await res.json();
                let catProducts = data.products || [];
                catProducts = catProducts.filter(p => p.title.toLowerCase().includes(query.toLowerCase()));
                
                // Also fetch from fakestore category
                let fsRes = await fetch(`https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`);
                let fsFiltered = [];
                if(fsRes.ok) {
                    let fsData = await fsRes.json();
                    fsFiltered = fsData.filter(p => p.title.toLowerCase().includes(query.toLowerCase()));
                }
                products = [...catProducts, ...fsFiltered.map(p => formatFakeStoreProduct(p))];

            } else if (query) {
                // Search globally: try DummyJSON first
                let res = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`);
                let data = await res.json();
                products = data.products || [];
                
                // Fallback to FakeStore if no results or if we want simultaneous (combining them)
                let fsRes = await fetch("https://fakestoreapi.com/products");
                let fsData = await fsRes.json();
                let fsFiltered = fsData.filter(p => p.title.toLowerCase().includes(query.toLowerCase()));
                
                products = [...products, ...fsFiltered.map(p => formatFakeStoreProduct(p))];
                
            } else if (category && category !== "all" && category !== "null") {
                // Category only: Try DummyJSON
                let res = await fetch(`https://dummyjson.com/products/category/${encodeURIComponent(category)}`);
                let data = await res.json();
                products = data.products || [];
                
                // Also fetch from fakestore category
                let fsRes = await fetch(`https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`);
                if(fsRes.ok) {
                    let fsData = await fsRes.json();
                    products = [...products, ...fsData.map(p => formatFakeStoreProduct(p))];
                }
            } else {
                // Default: fetch all products
                let res = await fetch("https://dummyjson.com/products?limit=30");
                let data = await res.json();
                products = data.products || [];
            }
            
            displaySearchResults(products);
            
        } catch (err) {
            console.error("Error fetching products:", err);
            productsGrid.innerHTML = "<h2>Error loading products.</h2>";
        }
    }

    function formatFakeStoreProduct(p) {
        return {
            id: "fs_" + p.id,
            title: p.title,
            price: p.price,
            description: p.description,
            thumbnail: p.image,
            rating: p.rating?.rate || 4.5
        };
    }

    function displaySearchResults(products) {
        productsGrid.innerHTML = "";
        if (products.length === 0) {
            productsGrid.innerHTML = "<h2>No products found</h2>";
            return;
        }

        products.forEach(product => {
            const card = document.createElement("div");
            card.className = "product-card";
            card.innerHTML = `
                <div class="product-img-container">
                    <img src="${product.thumbnail}" alt="${product.title.replace(/"/g, '&quot;')}">
                </div>
                <h3>${product.title}</h3>
                <p class="product-price"><sup>$</sup>${Math.floor(product.price)}<sup>${((product.price % 1) * 100).toFixed(0).padStart(2, '0')}</sup></p>
                <button class="view-product-btn" onclick="window.location.href='products.html?id=${product.id}'">View Details</button>
            `;
            productsGrid.appendChild(card);
        });
    }

    fetchProducts();
}

// ==========================================
// PRODUCT DETAILS LOGIC (For products.html)
// ==========================================
if (window.location.pathname.endsWith("products.html")) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");
    const detailContainer = document.getElementById("product-detail");
    const relatedContainer = document.getElementById("related-products");

    async function fetchProductDetails() {
        if (!productId || !detailContainer) return;
        
        detailContainer.innerHTML = "<h2>Loading product...</h2>";
        
        try {
            let product;
            if (productId.startsWith("fs_")) {
                const fsId = productId.replace("fs_", "");
                let res = await fetch(`https://fakestoreapi.com/products/${fsId}`);
                let p = await res.json();
                product = formatFakeStoreProduct(p);
                product.category = p.category;
            } else {
                let res = await fetch(`https://dummyjson.com/products/${productId}`);
                product = await res.json();
            }
            
            renderProductDetails(product);
            fetchRelatedProducts(product.category, productId);
        } catch (err) {
            console.error("Error fetching detail:", err);
            detailContainer.innerHTML = "<h2>Error loading product details.</h2>";
        }
    }
    
    function formatFakeStoreProduct(p) {
        return {
            id: "fs_" + p.id,
            title: p.title,
            price: p.price,
            description: p.description,
            thumbnail: p.image,
            rating: p.rating?.rate || 4.5
        };
    }

    function renderProductDetails(product) {
        detailContainer.innerHTML = `
            <div class="product-details-container">
                <div class="product-image-col">
                    <img src="${product.thumbnail}" alt="${product.title.replace(/"/g, '&quot;')}">
                </div>
                <div class="product-info-col">
                    <h1>${product.title}</h1>
                    <div class="product-rating">
                        <span>${'⭐'.repeat(Math.round(product.rating))} ${product.rating} out of 5</span>
                    </div>
                    <div class="product-price-large">
                        $${product.price.toFixed(2)}
                    </div>
                    <div class="product-description">
                        <h3>About this item</h3>
                        <p>${product.description}</p>
                    </div>
                </div>
                <div class="product-buy-col">
                    <div class="price">$${product.price.toFixed(2)}</div>
                    <div class="stock-status">In Stock</div>
                    <div class="buy-btn-container">
                        <button class="btn-add-to-cart" onclick="addToCart('${product.id}', '${product.title.replace(/'/g, "\\'")}', ${product.price}, '${product.thumbnail}')">Add to Cart</button>
                        <button class="btn-buy-now">Buy Now</button>
                    </div>
                </div>
            </div>
        `;
    }

    async function fetchRelatedProducts(category, currentId) {
        if (!relatedContainer || !category) return;
        try {
            let products = [];
            if (currentId.startsWith("fs_")) {
                let res = await fetch(`https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`);
                let data = await res.json();
                products = data.map(p => formatFakeStoreProduct(p));
            } else {
                let res = await fetch(`https://dummyjson.com/products/category/${encodeURIComponent(category)}`);
                let data = await res.json();
                products = data.products || [];
            }
            
            products = products.filter(p => p.id != currentId).slice(0, 5);
            
            if (products.length > 0) {
                let html = '<h2>Products related to this item</h2><div class="products-grid">';
                products.forEach(p => {
                    html += `
                        <div class="product-card" style="min-width: unset; height: 100%;">
                            <div class="product-img-container" style="height: 150px; padding:5px; background:transparent;">
                                <img src="${p.thumbnail}" alt="${p.title.replace(/"/g, '&quot;')}">
                            </div>
                            <h3 style="font-size: 14px; margin-top:10px;">${p.title}</h3>
                            <p class="product-price" style="font-size:18px;">$${p.price.toFixed(2)}</p>
                            <button class="view-product-btn" onclick="window.location.href='products.html?id=${p.id}'" style="width:100%; padding:8px; border-radius:20px; background:#ffd814; font-size:12px; margin-top:10px;">View</button>
                        </div>
                    `;
                });
                html += '</div>';
                relatedContainer.innerHTML = html;
            }
        } catch (err) {
            console.error("Error fetching related", err);
        }
    }

    fetchProductDetails();
}

window.addToCart = function(id, title, price, image) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({ id, title, price, image });
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // update count
    const cartCounts = document.querySelectorAll(".cart-count");
    cartCounts.forEach(el => el.innerText = cart.length);
    alert(`${title} added to cart`);
};
