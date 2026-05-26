// Mobile menu toggle
const mobileMenuButton = document.getElementById("mobile-menu-button");
const navItems = document.querySelector(".items");

mobileMenuButton.addEventListener("click", () => {
  navItems.classList.toggle("show");
});

// Dynamic Products Rendering
const products = [
  {
    image: "images/p3.png",
    alt: "Potted small desk plant",
    title: "For small desk plant",
    description:
      "Calathea is a genus of plants belonging to the family Marantaceae. There are several dozen species in this genus. Native to the tropical Americas, many of the species are popular as pot plants due to their decorative leaves and, in some species, colorful inflorescences.",
    price: 599,
    originalPrice: 599,
    searchQuery: "calathea+plant",
  },
  {
    image: "images/p4.png",
    alt: "Decorative medium desk plant",
    title: "For medium desk plant",
    description:
      "Monstera deliciosa is a species of flowering plant native to tropical forests of southern Mexico, south to Panama. It has been introduced to many tropical areas, and has become a mildly invasive species in Hawaii, Seychelles, Ascension Island and the Society Islands.",
    price: 799,
    originalPrice: 799,
    searchQuery: "monstera+plant",
  },
];

function renderProducts() {
  const block2 = document.getElementById("more");
  if (!block2) return;

  products.forEach((product, index) => {
    const itemClass = index % 2 === 0 ? "block2-p1" : "block2-p2";
    const productHTML = `
            <div class="${itemClass} product-item">
                <div class="block2-img"><img src="${product.image}" alt="${product.alt}"></div>
                <div class="block2-text">
                    <h3>${product.title}</h3>
                    <p>${product.description}</p>
                    <div class="buy-option">
                        <h3 class="product-price">Rs.${product.price}</h3>
                        <div class="button-container">
                            <a href="https://www.amazon.com/s?k=${product.searchQuery}" target="_blank" class="buy-button" aria-label="Buy ${product.title} on Amazon">Buy on Amazon</a>
                            <a href="https://www.flipkart.com/search?q=${product.searchQuery}" target="_blank" class="buy-button" aria-label="Buy ${product.title} on Flipkart">Buy on Flipkart</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    block2.innerHTML += productHTML;
  });
}
document.addEventListener("DOMContentLoaded", renderProducts);

// Smooth scrolling for navigation items
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// Newsletter form submission
const newsletterForm = document.querySelector(".newsletter form");
newsletterForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = this.querySelector('input[type="email"]').value.trim();

  // Empty field validation
  if (email === "") {
    alert("Please enter a valid email address");
    return;
  }

  // Email format validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    alert("Please enter a valid email format");
    return;
  }

  alert(`Thank you for subscribing with email: ${email}`);

  this.reset();
});

// Dynamic price update (simulation)
function updatePrice() {
  const priceElements = document.querySelectorAll(".buy-option .product-price");
  priceElements.forEach((el, index) => {
    if (products[index]) {
      const currentPrice = parseInt(el.textContent.replace("Rs.", ""));
      const newPrice =
        products[index].originalPrice + Math.floor(Math.random() * 21) - 10;
      el.textContent = `Rs.${newPrice}`;
    }
  });
}

setInterval(updatePrice, 5000); // Update price every 5 seconds

// Parallax scrolling effect for background
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  document.body.style.backgroundPositionY = -(scrolled * 0.3) + "px";
});
// Add smooth reveal animation to elements as they come into view
// Add smooth reveal animation to elements as they come into view
function revealOnScroll() {
  const elements = document.querySelectorAll(
    ".block1, .block2-p1, .block2-p2, .about-section, .newsletter",
  );

  elements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (elementTop < windowHeight - 100) {
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    }
  });
}

// Initial styles for elements to be revealed
document
  .querySelectorAll(
    ".block1, .block2-p1, .block2-p2, .about-section, .newsletter",
  )
  .forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(50px)";
    el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  });

// Add event listener for scroll
window.addEventListener("scroll", revealOnScroll);
// Trigger once on load
revealOnScroll();

// Smooth scroll to top when logo is clicked
document.querySelector(".logo").addEventListener("click", function (e) {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// Add hover effect to icon images
document.querySelectorAll(".icons ul li img").forEach((icon) => {
  icon.addEventListener("mouseover", function () {
    this.style.transform = "scale(1.2)";
    this.style.transition = "transform 0.3s ease";
  });
  icon.addEventListener("mouseout", function () {
    this.style.transform = "scale(1)";
  });
});

document.querySelectorAll(".icons img").forEach((icon) => {
  icon.classList.toggle("dark-mode-icon");
});

// Update footer year dynamically
const currentYearSpan = document.getElementById("current-year");
if (currentYearSpan) {
  currentYearSpan.textContent = new Date().getFullYear();
}
