

document.addEventListener("DOMContentLoaded", function () {

    /* ==========================
       NAVBAR SCROLL EFFECT
    ========================== */
    const navbar = document.getElementById("navbar");

    if (navbar) {
        window.addEventListener("scroll", function () {
            if (window.scrollY > 50) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        });
    }

    /* ==========================
       THEME TOGGLE
    ========================== */
    const toggleBtn = document.getElementById("theme-toggle");

    if (toggleBtn) {

        // Load saved theme
        toggleBtn.addEventListener("click", function () {

            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            if (newTheme === 'light') {
                toggleBtn.innerHTML = "☀️";
                localStorage.setItem("theme", "light");
            } else {
                toggleBtn.innerHTML = "🌙";
                localStorage.setItem("theme", "dark");
            }

// Navbar scroll effect
document.addEventListener('DOMContentLoaded', function () {


        });
    }

    /* ==========================
       FAQ ACCORDION
    ========================== */
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(function (item) {

        const question = item.querySelector(".faq-question");

        if (question) {

            question.addEventListener("click", function () {

                faqItems.forEach(function (faq) {
                    if (faq !== item) {
                        faq.classList.remove("active");
                    }
                });

                item.classList.toggle("active");

            });

        }

    });

    /* ==========================
       SMOOTH SCROLL NAVIGATION
    ========================== */
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(function (link) {

        link.addEventListener("click", function (e) {

            const targetId = this.getAttribute("href");

            if (targetId && targetId !== "#") {

                const targetSection = document.querySelector(targetId);

                if (targetSection) {

                    e.preventDefault();

                    targetSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            }

        });

    });

});

});

