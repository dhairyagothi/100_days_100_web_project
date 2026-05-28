const imgs = document.querySelectorAll('.header-slider ul img');
const prev_btn = document.querySelector('.control_prev');
const overlay = document.getElementById("sidebar-overlay");
const menuBtn = document.querySelector(".MenuSidebar");
const next_btn = document.querySelector('.control_next');
const sidebar = document.getElementById("sidebar");

menuBtn.addEventListener("click", () => {
    sidebar.classList.add("active");
    overlay.classList.add("active");
// Open Sidebar
if (menuBtn && sidebar && overlay) {
    menuBtn.addEventListener("click", () => {
        sidebar.classList.add("active");
        overlay.classList.add("active");
        document.body.style.overflow = "hidden"; // Prevent background scrolling
    });
}

// Close Sidebar Function
function closeSidebar() {
    if (sidebar && overlay) {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
        document.body.style.overflow = ""; // Re-enable background scrolling
    }
}

// Close on Overlay click
if (overlay) {
    overlay.addEventListener("click", closeSidebar);
}

// Close on ESC Key
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar && sidebar.classList.contains("active")) {
        closeSidebar();
    }
});

overlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
});
// Sidebar Accordion Handler
window.toggleSidebarAccordion = function(header) {
    const accordion = header.parentElement;
    
    // Close other accordions first for a clean accordeon look
    const allAccordions = document.querySelectorAll('.sidebar-accordion');
    allAccordions.forEach(acc => {
        if (acc !== accordion) {
            acc.classList.remove('accordion-open');
            const icon = acc.querySelector('.accordion-chevron');
            if (icon) {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        }
    });
    
    // Toggle current accordion state
    const isOpen = accordion.classList.contains('accordion-open');
    const icon = header.querySelector('.accordion-chevron');
    
    if (isOpen) {
        accordion.classList.remove('accordion-open');
        if (icon) {
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        }
    } else {
        accordion.classList.add('accordion-open');
        if (icon) {
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        }
    }
};

// ==========================================
// SIDEBAR THEME SWITCHER LOGIC
// ==========================================
const sbThemeLightBtn = document.getElementById("sb-theme-light-btn");
const sbThemeDarkBtn = document.getElementById("sb-theme-dark-btn");
const sbThemeToggle = document.getElementById("sb-theme-toggle");

// Enable Light Mode
function enableLightMode() {
    document.body.classList.remove("dark-theme");
    localStorage.setItem("darkMode", "disabled");
}

// Enable Dark Mode
function enableDarkMode() {
    document.body.classList.add("dark-theme");
    localStorage.setItem("darkMode", "enabled");
}

// Bind Light Button
if (sbThemeLightBtn) {
    sbThemeLightBtn.addEventListener("click", enableLightMode);
}

// Bind Dark Button
if (sbThemeDarkBtn) {
    sbThemeDarkBtn.addEventListener("click", enableDarkMode);
}

// Bind Switch Pill Toggle
if (sbThemeToggle) {
    sbThemeToggle.addEventListener("click", () => {
        if (document.body.classList.contains("dark-theme")) {
            enableLightMode();
        } else {
            enableDarkMode();
        }
    });
}
closeSidebar();
});

// ==========================================
// NAVBAR THEME TOGGLE LOGIC
// ==========================================
const lightBtn = document.getElementById('sb-theme-light-btn');
const darkBtn = document.getElementById('sb-theme-dark-btn');
const themeToggle = document.querySelector('.theme-switch-container');
const darkModeBtn = document.getElementById("dark-mode-btn");
const toggleText = document.getElementById("toggle-text");
const toggleCircle = document.querySelector(".toggle-circle");
const toggleSwitch = document.querySelector(".toggle-switch");


if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light-theme');
}


lightBtn.addEventListener('click', () => {
  document.body.classList.remove('dark-theme');
  localStorage.setItem('theme', 'light');
});


darkBtn.addEventListener('click', () => {
  document.body.classList.add('dark-theme');
  localStorage.setItem('theme', 'dark');
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
});



darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");

  if (document.body.classList.contains("dark-theme")) {
    toggleText.textContent = "On";
    toggleSwitch.style.background = "#111";   
    toggleCircle.style.right = "34px";        
  } else {
    toggleText.textContent = "Off";
    toggleSwitch.style.background = "#fff";  
    toggleCircle.style.right = "3px";        
  }
});

// ==========================================
// HEADER SLIDER LOGIC
// ==========================================
let n = 0;

function changeSlide() {
    imgs.forEach((img) => {
        img.style.display = 'none';
    });

    imgs[n].style.display = 'block';
}

changeSlide();

prev_btn.addEventListener('click', (e) => {
    e.preventDefault();

    if (n > 0) {
        n--;
    } else {
        n = imgs.length - 1;
    }

    changeSlide();
});

next_btn.addEventListener('click', (e) => {
    e.preventDefault();

    if (n < imgs.length - 1) {
        n++;
    } else {
        n = 0;
    }

    changeSlide();
});

// AUTO SLIDE
setInterval(() => {
    if (n < imgs.length - 1) {
        n++;
    } else {
        n = 0;
    }

    changeSlide();
}, 4000);

// -------------------------------
// HORIZONTAL PRODUCT SCROLL
// -------------------------------
const scrollContainers = document.querySelectorAll('.products');

scrollContainers.forEach((item) => {
    item.addEventListener('wheel', (evt) => {
        evt.preventDefault();
        item.scrollLeft += evt.deltaY;
    });
});

// -------------------------------
// BACKEND API URL
// -------------------------------
const API_URL = 'http://localhost:5000';

// -------------------------------
// SEARCH FUNCTIONALITY
// -------------------------------
const searchInput = document.querySelector('.nav-search-input');

searchInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();

        if (query.length === 0) {
            alert('Please enter a product name');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/products/search?q=${query}`);
            const data = await response.json();

            console.log('Search Results:', data);

            alert(`${data.length} products found for: ${query}`);
        } catch (error) {
            console.error('Search Error:', error);
        }
    }
});

// -------------------------------
// CART FUNCTIONALITY
// -------------------------------
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cartCounts = document.querySelectorAll('.cart-count');

    cartCounts.forEach(el => {
        el.innerText = `${cart.length}`;
    });
}

updateCartCount();

// -------------------------------
// ADD TO CART BUTTONS
// -------------------------------
const productCards = document.querySelectorAll('.product-card');

productCards.forEach((card, index) => {
    const button = document.createElement('button');

    button.innerText = 'Add to Cart';
    button.classList.add('add-cart-btn');

    card.appendChild(button);

    button.addEventListener('click', async () => {
        const product = {
            id: index + 1,
            title: card.querySelector('h4').innerText,
            price: card.querySelector('.product-price span').innerText,
            image: card.querySelector('img').src
        };

        cart.push(product);
        saveCart();
        updateCartCount();

        // SEND TO BACKEND
        try {
            await fetch(`${API_URL}/cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product)
            });

            alert('Product added to cart');
        } catch (error) {
            console.error('Cart Error:', error);
        }
    });
});

// -------------------------------
// USER LOGIN SYSTEM
// -------------------------------
async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (data.token) {
            localStorage.setItem('token', data.token);
            alert('Login Successful');
        } else {
            alert('Invalid Credentials');
        }
    } catch (error) {
        console.error('Login Error:', error);
    }
}

document.addEventListener("DOMContentLoaded", () => {

    // ===========================
    //  SIGN IN / SIGN UP
    // ===========================
    const signinModal = document.getElementById('signin-modal');
    const signupModal = document.getElementById('signup-modal');

    const openSignin = document.getElementById('open-signin');
    const signinBtn = document.getElementById('signin-btn');
    const signupBtn = document.getElementById('signup-btn');
    const showSignup = document.getElementById('show-signup');

    const closeBtns = document.querySelectorAll('.close-btn');

   
    if (openSignin) {
        openSignin.addEventListener('click', () => {
            signinModal.style.display = 'flex';
        });
    }

  
    // CLOSE MODALS
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            signinModal.style.display = 'none';
            signupModal.style.display = 'none';
        });
    });

   
    // OPEN SIGNUP
    if (showSignup) {
        showSignup.addEventListener('click', () => {
            signinModal.style.display = 'none';
            signupModal.style.display = 'flex';
        });
    }

   
    
    if (signupBtn) {
        signupBtn.addEventListener('click', () => {

            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

            if (name && email && password) {

                const user = { name, email, password };

                localStorage.setItem('amazonUser', JSON.stringify(user));

                alert('Account Created');

                signupModal.style.display = 'none';
                signinModal.style.display = 'flex';

            } else {
                alert('Please fill all fields');
            }
        });
    }

   
    // SIGN IN
    if (signinBtn) {
        signinBtn.addEventListener('click', () => {

            const email = document.getElementById('signin-email').value;
            const password = document.getElementById('signin-password').value;

            const savedUser = JSON.parse(localStorage.getItem('amazonUser'));

            if (
                savedUser &&
                savedUser.email === email &&
                savedUser.password === password
            ) {

                localStorage.setItem('currentUser', savedUser.name);

                signinModal.style.display = 'none';

                updateNavbar(); // make sure this function exists

            } else {
                alert('Invalid Credentials');
            }

        });
    }

});

   // Sign Out
function signOut() {
  localStorage.removeItem('currentUser');   
  alert("Signed out successfully!");
  window.location.href = "index.html";
}

// ===========================
// UPDATE NAVBAR
// ===========================

function updateNavbar(){

    const currentUser =
    localStorage.getItem('currentUser');

    const userArea =
    document.getElementById('user-area');

    if(currentUser){

        userArea.innerHTML = `
        
            <p>Hello, ${currentUser}</p>

            <h1 id="logout-btn">
                Logout
            </h1>
        
        `;

        document.getElementById('logout-btn')
        .addEventListener('click', () => {

            localStorage.removeItem('currentUser');

            location.reload();

        });

    }

}

updateNavbar();

// -------------------------------
// LOAD PRODUCTS FROM BACKEND
// -------------------------------
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const products = await response.json();

        console.log('Products:', products);
    } catch (error) {
        console.error('Product Loading Error:', error);
    }
}

loadProducts();



// -------------------------------
// PLACE ORDER
// -------------------------------
async function placeOrder() {
    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                items: cart
            })
        });

        const data = await response.json();

        alert(data.message || 'Order Placed Successfully');

        cart = [];
        saveCart();
    } catch (error) {
        console.error('Order Error:', error);
    }
}


// -------------------------------
// BACK TO TOP BUTTON
// -------------------------------
const topBtn = document.createElement('button');

topBtn.innerText = '↑';
topBtn.classList.add('top-btn');

document.body.appendChild(topBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        topBtn.style.display = 'block';
    } else {
        topBtn.style.display = 'none';
    }
});

topBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

