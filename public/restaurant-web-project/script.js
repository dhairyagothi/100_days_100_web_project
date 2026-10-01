/* ==========================================
   DOM ELEMENTS
========================================== */

const pages = document.querySelectorAll(".page");

const navLinks = document.querySelectorAll(".nav-link");

const menuToggle = document.querySelector(".menu-toggle");

const navbar = document.querySelector(".navbar");

const themeToggle = document.getElementById("themeToggle");

const viewMenuBtn = document.getElementById("viewMenuBtn");

/* ==========================================
   PAGE NAVIGATION (SPA)
========================================== */

function showPage(pageId) {

    pages.forEach(page => {

        page.classList.remove("active-page");

    });

    const currentPage = document.getElementById(pageId);

    if (currentPage) {

        currentPage.classList.add("active-page");

    }

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.dataset.page === pageId) {

            link.classList.add("active");

        }

    });

    navbar.classList.remove("active");

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

/* ==========================================
   NAVIGATION EVENTS
========================================== */

navLinks.forEach(link => {

    link.addEventListener("click", function (e) {

        e.preventDefault();

        const page = this.dataset.page;

        showPage(page);

    });

});

/* ==========================================
   VIEW MENU BUTTON
========================================== */

if (viewMenuBtn) {

    viewMenuBtn.addEventListener("click", () => {

        showPage("menu");

    });

}

/* ==========================================
   MOBILE MENU
========================================== */

if (menuToggle) {

    menuToggle.addEventListener("click", () => {

        navbar.classList.toggle("active");

    });

}

/* Close menu after clicking a link */

navLinks.forEach(link => {

    link.addEventListener("click", () => {

        navbar.classList.remove("active");

    });

});

/* ==========================================
   DARK MODE
========================================== */

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark");

    themeToggle.innerHTML =
        '<i class="fa-solid fa-sun"></i>';

}

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem("theme", "dark");

        themeToggle.innerHTML =
            '<i class="fa-solid fa-sun"></i>';

    } else {

        localStorage.setItem("theme", "light");

        themeToggle.innerHTML =
            '<i class="fa-solid fa-moon"></i>';

    }

});

/* ==========================================
   ESC KEY CLOSE MOBILE MENU
========================================== */

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {

        navbar.classList.remove("active");

    }

});

/* ==========================================
   INITIAL PAGE
========================================== */

showPage("home");
/* ==========================================
   MENU FILTERING
========================================== */

const filterButtons = document.querySelectorAll(".filter-btn");
const menuCards = document.querySelectorAll(".menu-card");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {

            btn.classList.remove("active");

        });

        button.classList.add("active");

        const filter = button.dataset.filter;

        menuCards.forEach(card => {

            if (
                filter === "all" ||
                card.classList.contains(filter)
            ) {

                card.style.display = "flex";

                card.style.animation = "fadeIn .5s ease";

            } else {

                card.style.display = "none";

            }

        });

    });

});

/* ==========================================
   MENU BUTTONS
========================================== */

const addButtons = document.querySelectorAll(".menu-card button");

addButtons.forEach(button => {

    button.addEventListener("click", () => {

        showToast("Item added to cart 🛒");

    });

});

/* ==========================================
   GALLERY LIGHTBOX
========================================== */

const galleryItems = document.querySelectorAll(".gallery-item img");

const lightbox = document.getElementById("lightbox");

const lightboxImg = document.getElementById("lightbox-img");

const closeLightbox = document.querySelector(".close-lightbox");

galleryItems.forEach(image => {

    image.addEventListener("click", () => {

        lightbox.classList.add("active");

        lightboxImg.src = image.src;

        lightboxImg.alt = image.alt;

        document.body.style.overflow = "hidden";

    });

});

/* ==========================================
   CLOSE LIGHTBOX
========================================== */

function hideLightbox() {

    lightbox.classList.remove("active");

    document.body.style.overflow = "";

}

closeLightbox.addEventListener("click", hideLightbox);

lightbox.addEventListener("click", (e) => {

    if (e.target === lightbox) {

        hideLightbox();

    }

});

/* ESC closes lightbox */

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape" && lightbox.classList.contains("active")) {

        hideLightbox();

    }

});

/* ==========================================
   SIMPLE IMAGE PRELOAD
========================================== */

galleryItems.forEach(img => {

    const preload = new Image();

    preload.src = img.src;

});

/* ==========================================
   FADE ANIMATION (Injected if missing)
========================================== */

if (!document.getElementById("dynamicFadeAnimation")) {

    const style = document.createElement("style");

    style.id = "dynamicFadeAnimation";

    style.textContent = `
        @keyframes fadeIn{
            from{
                opacity:0;
                transform:translateY(12px);
            }
            to{
                opacity:1;
                transform:translateY(0);
            }
        }
    `;

    document.head.appendChild(style);

}
/* ==========================================
   TOAST NOTIFICATION
========================================== */

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

function showToast(message = "Success!") {

    if (!toast) return;

    toastMessage.textContent = message;

    toast.classList.add("show");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}

/* ==========================================
   RESERVATION FORM
========================================== */

const reservationForm = document.getElementById("reservationForm");

if (reservationForm) {

    reservationForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const name =
            document.getElementById("resName").value.trim();

        const email =
            document.getElementById("resEmail").value.trim();

        const date =
            document.getElementById("resDate").value;

        const time =
            document.getElementById("resTime").value;

        const guests =
            document.getElementById("guests").value;

        if (
            !name ||
            !email ||
            !date ||
            !time ||
            !guests
        ) {

            showToast("Please fill in all reservation details.");

            return;

        }

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            showToast("Please enter a valid email address.");

            return;

        }

        if (Number(guests) < 1) {

            showToast("Guests must be at least 1.");

            return;

        }

        showToast("Reservation booked successfully! 🎉");

        reservationForm.reset();

    });

}

/* ==========================================
   CONTACT FORM
========================================== */

const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const name =
            document.getElementById("contactName").value.trim();

        const email =
            document.getElementById("contactEmail").value.trim();

        const message =
            document.getElementById("contactMessage").value.trim();

        if (!name || !email || !message) {

            showToast("Please complete the contact form.");

            return;

        }

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            showToast("Please enter a valid email address.");

            return;

        }

        if (message.length < 10) {

            showToast("Message should contain at least 10 characters.");

            return;

        }

        showToast("Message sent successfully! 📩");

        contactForm.reset();

    });

}

/* ==========================================
   INPUT FOCUS EFFECT
========================================== */

const inputs = document.querySelectorAll(
    "input, textarea"
);

inputs.forEach(input => {

    input.addEventListener("focus", () => {

        input.parentElement.classList.add("focused");

    });

    input.addEventListener("blur", () => {

        if (input.value.trim() === "") {

            input.parentElement.classList.remove("focused");

        }

    });

});
/* ==========================================
   SCROLL TO TOP BUTTON
========================================== */

const scrollTopBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {

    if (window.scrollY > 300) {

        scrollTopBtn.classList.add("show");

    } else {

        scrollTopBtn.classList.remove("show");

    }

});

scrollTopBtn.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});

/* ==========================================
   SMOOTH PAGE TRANSITIONS
========================================== */

pages.forEach(page => {

    page.style.transition = "opacity .35s ease";

});

/* ==========================================
   BUTTON RIPPLE EFFECT
========================================== */

const buttons = document.querySelectorAll("button");

buttons.forEach(button => {

    button.addEventListener("click", function (e) {

        const ripple = document.createElement("span");

        ripple.classList.add("ripple");

        const rect = this.getBoundingClientRect();

        ripple.style.left = `${e.clientX - rect.left}px`;

        ripple.style.top = `${e.clientY - rect.top}px`;

        this.appendChild(ripple);

        setTimeout(() => {

            ripple.remove();

        }, 600);

    });

});

/* Inject ripple styles */

const rippleStyle = document.createElement("style");

rippleStyle.textContent = `
button{
    position:relative;
    overflow:hidden;
}

.ripple{
    position:absolute;
    width:15px;
    height:15px;
    background:rgba(255,255,255,.5);
    border-radius:50%;
    transform:translate(-50%,-50%);
    animation:ripple .6s linear;
}

@keyframes ripple{
    from{
        opacity:1;
        transform:translate(-50%,-50%) scale(0);
    }
    to{
        opacity:0;
        transform:translate(-50%,-50%) scale(18);
    }
}
`;

document.head.appendChild(rippleStyle);

/* ==========================================
   PREVENT PAST DATES IN RESERVATION
========================================== */

const reservationDate = document.getElementById("resDate");

if (reservationDate) {

    const today = new Date().toISOString().split("T")[0];

    reservationDate.min = today;

}

/* ==========================================
   COPYRIGHT YEAR
========================================== */

const footerText = document.querySelector(".footer-bottom p");

if (footerText) {

    footerText.innerHTML =
        `© ${new Date().getFullYear()} Delizia Restaurant. All Rights Reserved.`;

}

/* ==========================================
   PAGE LOADER EFFECT
========================================== */

window.addEventListener("load", () => {

    document.body.classList.add("loaded");

});

/* ==========================================
   CONSOLE MESSAGE
========================================== */

console.log(
"%c🍽️ Delizia Restaurant Website Loaded Successfully!",
"color:#e63946;font-size:16px;font-weight:bold;"
);

/* ==========================================
   END OF SCRIPT
========================================== */