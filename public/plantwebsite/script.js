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
    sunlight: "medium",
    petFriendly: true,
    careLevel: "medium",
    categories: ["Indoor Plants", "Decorative Plants"],
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
    sunlight: "bright",
    petFriendly: false,
    careLevel: "easy",
    categories: ["Outdoor Plants", "Decorative Plants"],
  },
  {
    image: "images/p2.png",
    alt: "Snake Plant",
    title: "Snake Plant",
    description:
      "Snake plants are hardy and can survive low light and drought, making them perfect for beginners and virtually indestructible.",
    price: 399,
    originalPrice: 399,
    searchQuery: "snake+plant",
    sunlight: "low",
    petFriendly: false,
    careLevel: "easy",
    fallback: true,
    categories: ["Succulents", "Air Purifying Plants", "Indoor Plants"],
  },
];

let activeCategory = "";
let featuredPlant = null;

function renderProducts(category = activeCategory) {
  const block2 = document.getElementById("more");
  if (!block2) return;

  activeCategory = category;
  block2.innerHTML = "";
  const visibleProducts = category
    ? products.filter((product) => product.categories.includes(category))
    : products;

  visibleProducts.forEach((product) => {
    const index = products.indexOf(product);
    const itemClass = index % 2 === 0 ? "block2-p1" : "block2-p2";
    const productHTML = `
            <div class="${itemClass} product-item" data-product-index="${index}">
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
    block2.insertAdjacentHTML("beforeend", productHTML);
  });

  if (!visibleProducts.length) {
    block2.innerHTML = `<p class="empty-category">More ${category.toLowerCase()} are coming soon.</p>`;
  }

  if (document.body.classList.contains("dark-mode")) {
    block2.querySelectorAll(".buy-button").forEach((button) => {
      button.classList.add("dark-mode");
    });
  }
}
document.addEventListener("DOMContentLoaded", () => {
  featuredPlant = products[Math.floor(Math.random() * products.length)];
  renderProducts();
  populateFeaturedPlant();
});

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

// Update footer year dynamically
const currentYearSpan = document.getElementById("current-year");
if (currentYearSpan) {
  currentYearSpan.textContent = new Date().getFullYear();
}

// ========================= PLANT MATCHMAKER QUIZ =========================
const quizData = {
  sunlight: "",
  petFriendly: "",
  careLevel: "",
};

const quizModal = document.getElementById("quiz-modal");
const startQuizBtn = document.getElementById("start-quiz-btn");
const closeQuizBtn = document.getElementById("close-quiz");
const restartQuizBtn = document.getElementById("restart-quiz-btn");
const quizCtaBtn = document.getElementById("quiz-cta");
const optionBtns = document.querySelectorAll(".quiz-option");

function showScreen(screenId) {
  document.querySelectorAll(".quiz-screen").forEach((screen) => {
    screen.classList.remove("active");
    screen.classList.add("hidden");
  });
  document.getElementById(screenId).classList.remove("hidden");
  document.getElementById(screenId).classList.add("active");
}

function startQuiz() {
  quizData.sunlight = "";
  quizData.petFriendly = "";
  quizData.careLevel = "";
  showScreen("quiz-screen-1");
}

function processAnswer(e) {
  const question = e.target.getAttribute("data-question");
  const value = e.target.getAttribute("data-value");

  if (value === "true") quizData[question] = true;
  else if (value === "false") quizData[question] = false;
  else quizData[question] = value;

  if (question === "sunlight") {
    showScreen("quiz-screen-2");
  } else if (question === "petFriendly") {
    showScreen("quiz-screen-3");
  } else if (question === "careLevel") {
    showResults();
  }
}

function showResults() {
  let bestMatch = null;
  let highestScore = -1;

  products.forEach((p) => {
    let score = 0;

    // If user needs a pet-friendly plant but this one is not, skip it completely
    if (quizData.petFriendly === true && p.petFriendly !== true) {
      return;
    } else if (p.petFriendly === quizData.petFriendly) {
      score += 1;
    }

    // Give points for matching sunlight and care level
    if (p.sunlight === quizData.sunlight) score += 2;
    if (p.careLevel === quizData.careLevel) score += 1;

    if (score > highestScore) {
      highestScore = score;
      bestMatch = p;
    }
  });

  let matchedPlant =
    bestMatch || products.find((p) => p.fallback) || products[0];

  const resultsContainer = document.getElementById("quiz-results-container");
  resultsContainer.innerHTML = `
    <img src="${matchedPlant.image}" alt="${matchedPlant.alt}" />
    <h3>${matchedPlant.title}</h3>
    <p>${matchedPlant.description}</p>
    <a href="https://www.amazon.com/s?k=${matchedPlant.searchQuery}" target="_blank" class="buy-button" style="display:inline-block; margin-top: 15px;">Buy on Amazon</a>
  `;
  showScreen("quiz-screen-results");
}

if (quizCtaBtn)
  quizCtaBtn.addEventListener("click", () => {
    quizModal.classList.remove("hidden");
    showScreen("quiz-screen-start");
  });
if (startQuizBtn) startQuizBtn.addEventListener("click", startQuiz);
if (restartQuizBtn) restartQuizBtn.addEventListener("click", startQuiz);
if (closeQuizBtn)
  closeQuizBtn.addEventListener("click", () =>
    quizModal.classList.add("hidden"),
  );

optionBtns.forEach((btn) => btn.addEventListener("click", processAnswer));

// ========================= HEADER DISCOVERY FEATURES =========================
const careTipsButton = document.getElementById("care-tips-button");
const careTipsModal = document.getElementById("care-tips-modal");
const featuredPlantButton = document.getElementById("featured-plant-button");
const featuredPlantModal = document.getElementById("featured-plant-modal");
const categoriesButton = document.getElementById("categories-button");
const categoriesDropdown = document.getElementById("categories-dropdown");
let lastFocusedElement = null;

function getFocusableElements(container) {
  return [
    ...container.querySelectorAll(
      'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ];
}

function openFeatureModal(modal) {
  closeCategories();
  lastFocusedElement = document.activeElement;
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  getFocusableElements(modal)[0]?.focus();
}

function closeFeatureModal(modal) {
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  lastFocusedElement?.focus();
}

function populateFeaturedPlant() {
  if (!featuredPlant) return;
  const image = document.getElementById("featured-plant-image");
  image.src = featuredPlant.image;
  image.alt = featuredPlant.alt;
  document.getElementById("featured-plant-title").textContent =
    featuredPlant.title;
  document.getElementById("featured-plant-description").textContent =
    featuredPlant.description;
  document.getElementById("featured-plant-price").textContent =
    `Rs.${featuredPlant.price}`;
}

function closeCategories({ restoreFocus = false } = {}) {
  categoriesDropdown.hidden = true;
  categoriesButton.setAttribute("aria-expanded", "false");
  if (restoreFocus) categoriesButton.focus();
}

careTipsButton.addEventListener("click", () => openFeatureModal(careTipsModal));
featuredPlantButton.addEventListener("click", () =>
  openFeatureModal(featuredPlantModal),
);

document.querySelectorAll(".feature-modal .feature-close").forEach((button) => {
  button.addEventListener("click", () =>
    closeFeatureModal(button.closest(".modal-overlay")),
  );
});

[careTipsModal, featuredPlantModal].forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeFeatureModal(modal);
  });

  modal.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeFeatureModal(modal);
    if (event.key !== "Tab") return;

    const focusable = getFocusableElements(modal);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
});

categoriesButton.addEventListener("click", () => {
  const willOpen = categoriesDropdown.hidden;
  closeCategories();
  if (willOpen) {
    categoriesDropdown.hidden = false;
    categoriesButton.setAttribute("aria-expanded", "true");
    categoriesDropdown.querySelector('[role="menuitem"]').focus();
  }
});

categoriesDropdown.addEventListener("keydown", (event) => {
  const items = [...categoriesDropdown.querySelectorAll('[role="menuitem"]')];
  const currentIndex = items.indexOf(document.activeElement);
  if (event.key === "Escape") closeCategories({ restoreFocus: true });
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    const direction = event.key === "ArrowDown" ? 1 : -1;
    items[(currentIndex + direction + items.length) % items.length].focus();
  }
});

categoriesDropdown.querySelectorAll("[data-category]").forEach((button) => {
  button.addEventListener("click", () => {
    renderProducts(button.dataset.category);
    closeCategories();
    document.getElementById("more").scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".category-menu")) closeCategories();
});

document.getElementById("featured-view-details").addEventListener("click", () => {
  const productIndex = products.indexOf(featuredPlant);
  renderProducts();
  closeFeatureModal(featuredPlantModal);
  requestAnimationFrame(() => {
    const product = document.querySelector(
      `.product-item[data-product-index="${productIndex}"]`,
    );
    product?.scrollIntoView({ behavior: "smooth", block: "center" });
    product?.classList.add("product-highlight");
    setTimeout(() => product?.classList.remove("product-highlight"), 1800);
  });
});
