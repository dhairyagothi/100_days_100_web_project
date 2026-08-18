// ==========================================================
// NYKAA FASHION CLONE
// Main Script
// ==========================================================
import products from "./listofProduct.js";
import brands from "./topbrands.js";
import deals from "./hardtoResistDeals.js";
// ==========================================================
// DOM ELEMENTS
// ==========================================================
const productContainer = document.querySelector(".listofProduct");
const brandContainer = document.querySelector(".brandTopproduct");
const dealsContainer = document.querySelector(".hardToResistDeals_image");
const slider = document.getElementById("imageSlideContainer");
const prevBtn = document.querySelector(".btn-container-prev");
const nextBtn = document.querySelector(".btn-container-next");
// ==========================================================
// CREATE PRODUCT CARD
// ==========================================================
function createProductCard(product) {
  return `
    <div class="productCard">
        <div class="productImage">
            <img src="${product.image}" alt="${product.title}">
            <span class="productBadge">
                ${product.badge}
            </span>
        </div>
        <div class="productContent">
            <h4>
                ${product.brand}
            </h4>
            <p>
                ${product.title}
            </p>
            <div class="rating">
                ⭐ ${product.rating}
                <span>
                    (${product.reviews})
                </span>
            </div>
            <div class="priceBox">
                <span class="price">
                    ₹${product.price}
                </span>
                <span class="originalPrice">
                    ₹${product.originalPrice}
                </span>
            </div>
            <div class="discount">
                ${product.discount}% OFF
            </div>
            <button class="bagButton">
                Add to Bag
            </button>
        </div>
    </div>
    `;
}
// ==========================================================
// RENDER PRODUCTS
// ==========================================================
function renderProducts() {
  if (!productContainer) return;
  productContainer.innerHTML = "";
  products.forEach(product => {
    productContainer.innerHTML += createProductCard(product);
  });
}
// ==========================================================
// CREATE BRAND CARD
// ==========================================================
function createBrandCard(brand) {
  return `
    <div class="brandCard">
        <div class="brandImage">
            <img src="${brand.image}" alt="${brand.name}">
        </div>
        <div class="brandContent">
            <h3>
                ${brand.name}
            </h3>
            <p>
                ${brand.offer}
            </p>
        </div>
    </div>
    `;
}
// ==========================================================
// RENDER BRANDS
// ==========================================================
function renderBrands() {
  if (!brandContainer) return;
  brandContainer.innerHTML = "";
  brands.forEach(brand => {
    brandContainer.innerHTML += createBrandCard(brand);
  });
}
// ==========================================================
// CREATE DEAL CARD
// ==========================================================
function createDealCard(deal) {
  return `
    <div class="dealCard">
        <img src="${deal.image}" alt="${deal.title}">
        <div class="dealContent">
            <h3>
                ${deal.title}
            </h3>
            <p>
                ${deal.subtitle}
            </p>
        </div>
    </div>
    `;
}
// ==========================================================
// RENDER DEALS
// ==========================================================
function renderDeals() {
  if (!dealsContainer) return;
  dealsContainer.innerHTML = "";
  deals.forEach(deal => {
    dealsContainer.innerHTML += createDealCard(deal);
  });
}
// ==========================================================
// INITIAL RENDER
// ==========================================================
renderProducts();
renderBrands();
renderDeals();
// ==========================================================
// HERO AUTO SLIDER
// ==========================================================
const heroImages = [
  "https://images-static.nykaa.com/uploads/04bf8945-4cc5-4540-a06a-fee8ca30ceab.gif?tr=w-1200,cm-pad_resize",
  "https://images-static.nykaa.com/uploads/2c5cfbd6-762d-47ec-8285-9cc718deb395.jpg?tr=w-1200,cm-pad_resize",
  "https://images-static.nykaa.com/uploads/5d9eefb9-accf-45a4-b6b0-547e10f93386.jpg?tr=w-1200,cm-pad_resize"
];
const heroImage = document.querySelector(".heroSlider img");
let currentHero = 0;
function changeHeroImage() {
  if (!heroImage) return;
  currentHero++;
  if (currentHero >= heroImages.length) {
    currentHero = 0;
  }
  heroImage.style.opacity = "0";
  setTimeout(() => {
    heroImage.src = heroImages[currentHero];
    heroImage.style.opacity = "1";
  }, 300);
}
setInterval(changeHeroImage, 4000);
// ==========================================================
// TRENDING SLIDER
// ==========================================================
if (slider && prevBtn && nextBtn) {
  nextBtn.addEventListener("click", () => {
    slider.scrollBy({
      left: 300,
      behavior: "smooth"
    });
  });
  prevBtn.addEventListener("click", () => {
    slider.scrollBy({
      left: -300,
      behavior: "smooth"
    });
  });
}
// ==========================================================
// AUTO SCROLL TRENDING
// ==========================================================
let autoScroll;
function startAutoScroll() {
  if (!slider) return;
  autoScroll = setInterval(() => {
    if (
      slider.scrollLeft + slider.clientWidth >=
      slider.scrollWidth - 10
    ) {
      slider.scrollTo({
        left: 0,
        behavior: "smooth"
      });
    }
    else {
      slider.scrollBy({
        left: 220,
        behavior: "smooth"
      });
    }
  }, 3500);
}
function stopAutoScroll() {
  clearInterval(autoScroll);
}
if (slider) {
  startAutoScroll();
  slider.addEventListener("mouseenter", stopAutoScroll);
  slider.addEventListener("mouseleave", startAutoScroll);
}
// ==========================================================
// SEARCH FUNCTIONALITY
// ==========================================================
const searchInput = document.querySelector(".inputSearch input");
if (searchInput) {
  searchInput.addEventListener("keyup", (e) => {
    const value = e.target.value.toLowerCase();
    const cards = document.querySelectorAll(".productCard");
    cards.forEach((card) => {
      const text = card.innerText.toLowerCase();
      if (text.includes(value)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
}
// ==========================================================
// PRODUCT HOVER EFFECT
// ==========================================================
document.addEventListener("mouseover", (e) => {
  const card = e.target.closest(".productCard");
  if (!card) return;
  card.classList.add("active");
});
document.addEventListener("mouseout", (e) => {
  const card = e.target.closest(".productCard");
  if (!card) return;
  card.classList.remove("active");
});
// ==========================================================
// ADD TO BAG
// ==========================================================
document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("bagButton")) return;
  e.target.innerText = "Added ✓";
  e.target.style.background = "#0a8f4d";
  setTimeout(() => {
    e.target.innerText = "Add to Bag";
    e.target.style.background = "";
  }, 1500);
});
// ==========================================================
// NAVBAR SHADOW
// ==========================================================
const header = document.querySelector("header");
window.addEventListener("scroll", () => {
  if (!header) return;
  if (window.scrollY > 40) {
    header.style.boxShadow =
      "0 8px 25px rgba(0,0,0,.12)";
  } else {
    header.style.boxShadow =
      "0 2px 10px rgba(0,0,0,.08)";
  }
});
// ==========================================================
// SCROLL REVEAL
// ==========================================================
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade");
      }
    });
  },
  {
    threshold: 0.2
  }
);
document
  .querySelectorAll("section")
  .forEach((section) => observer.observe(section));
// ==========================================================
// WISHLIST
// ==========================================================
document.addEventListener("click", (e) => {
  const heart = e.target.closest(".wishlistBtn");
  if (!heart) return;
  heart.classList.toggle("liked");
});
// ==========================================================
// PAGE LOADED
// ==========================================================
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
  console.log("Nykaa Clone Loaded Successfully");
});