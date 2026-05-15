let text1 = document.getElementById('text1');
let leaf = document.getElementById("leaf");
let hill5 = document.getElementById("hill5");
let hill1 = document.getElementById("hill1");
let plant = document.getElementById("plant");
let hill4 = document.getElementById("hill4");

/* Parallax Scroll Effect */
window.addEventListener('scroll', () => {
    let value = window.scrollY;

    text1.style.marginTop = value * 1.5 + 'px';
    leaf.style.left = value * 2 + 'px';
    hill1.style.top = value * 0.25 + 'px';
    hill5.style.left = value * 1 + 'px';
    hill4.style.left = value * -0.75 + 'px';
    plant.style.marginTop = value * 0.5 + 'px';
});

/* Mobile Navbar */
const menuToggle = document.getElementById("menu-toggle");
const nav = document.querySelector("nav");

menuToggle.addEventListener("click", () => {
    nav.classList.toggle("show");
});

/* Active Navbar Highlight */
const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll("nav ul li");

window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop;

        if (window.scrollY >= sectionTop - 180) {
            current = section.getAttribute("id");
        }
    });

    navItems.forEach(item => {
        item.classList.remove("active");

        const link = item.querySelector("a");

        if (link && link.getAttribute("href") === "#" + current) {
            item.classList.add("active");
        }
    });
});

/* Back To Top */
const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        topBtn.style.display = "block";
    } else {
        topBtn.style.display = "none";
    }
});

topBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

/* Contact Form */
const form = document.querySelector(".contact-form");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    alert("🌱 Thank you! Your message has been sent successfully.");

    form.reset();
});

/* Scroll Reveal Animation */
const revealSections = document.querySelectorAll(".reveal");

window.addEventListener("scroll", () => {
    revealSections.forEach(section => {
        const windowHeight = window.innerHeight;
        const revealTop = section.getBoundingClientRect().top;

        if (revealTop < windowHeight - 100) {
            section.classList.add("active");
        }
    });
});

/* Loader */
window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    loader.style.display = "none";
});
/* Dark Light Theme */

const themeToggle = document.getElementById("theme-toggle");

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("light-theme");

    if (document.body.classList.contains("light-theme")) {
        themeToggle.innerHTML = "☀️";
    }
    else {
        themeToggle.innerHTML = "🌙";
    }

});