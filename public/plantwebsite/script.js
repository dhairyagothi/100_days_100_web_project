// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const navItems = document.querySelector('.items');

mobileMenuButton.addEventListener('click', () => {
    navItems.classList.toggle('show');
});

// Smooth scrolling for navigation items
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Newsletter form submission
const newsletterForm = document.querySelector('.newsletter form');
newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    alert(`Thank you for subscribing with email: ${email}`);
    this.reset();
});

// Dynamic price update (simulation)
function updatePrice() {
    const priceElements = document.querySelectorAll('.buy-option h3');
    priceElements.forEach(el => {
        const currentPrice = parseInt(el.textContent.replace('Rs.', ''));
        const newPrice = currentPrice + Math.floor(Math.random() * 21) - 10; // Random price change between -10 and +10
        el.textContent = `Rs.${newPrice}`;
    });
}

setInterval(updatePrice, 5000); // Update price every 5 seconds

// Parallax scrolling effect for background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    document.body.style.backgroundPositionY = -(scrolled * 0.3) + 'px';
});
// Add smooth reveal animation to elements as they come into view
// Add smooth reveal animation to elements as they come into view
function revealOnScroll() {
    const elements = document.querySelectorAll('.block1, .block2-p1, .block2-p2, .about-section, .newsletter');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initial styles for elements to be revealed
document.querySelectorAll('.block1, .block2-p1, .block2-p2, .about-section, .newsletter').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

// Add event listener for scroll
window.addEventListener('scroll', revealOnScroll);
// Trigger once on load
revealOnScroll();

// Smooth scroll to top when logo is clicked
document.querySelector('.logo').addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add hover effect to icon images
document.querySelectorAll('.icons ul li img').forEach(icon => {
    icon.addEventListener('mouseover', function() {
        this.style.transform = 'scale(1.2)';
        this.style.transition = 'transform 0.3s ease';
    });
    icon.addEventListener('mouseout', function() {
        this.style.transform = 'scale(1)';
    });
});