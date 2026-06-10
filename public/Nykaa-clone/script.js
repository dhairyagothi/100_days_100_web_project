import listofProduct from "./listofProduct.js";
import topbrands from "./topbrands.js";
import hardtoResistDeals from "./hardtoResistDeals.js";

// Slider
const btnPreve = document.querySelector(".btn-container-prev");
const btnNext = document.querySelector(".btn-container-next");
const ImageContainerSlider = document.querySelector("#imageSlideContainer");

if (btnNext && btnPreve && ImageContainerSlider) {
  btnNext.addEventListener("click", () => {
    ImageContainerSlider.scrollLeft += 200;
  });
  btnPreve.addEventListener("click", () => {
    ImageContainerSlider.scrollLeft -= 200;
  });
}

// Products
const listofProductEL = document.querySelector(".listofProduct");
let listofProductHTML = "";
if (listofProductEL && Array.isArray(listofProduct)) {
  for (let i = 0; i < listofProduct.length; i++) {
    listofProductHTML += `
      <a href="#">
        <img src="${listofProduct[i].img}" alt="${listofProduct[i].dis}" />
        <p>${listofProduct[i].dis}</p>
      </a>`;
  }
  listofProductEL.innerHTML = listofProductHTML;
}

// Top Brands
const brandTopproductEl = document.querySelector(".brandTopproduct");
let brandTopproductHTML = "";
if (brandTopproductEl && Array.isArray(topbrands)) {
  for (let j = 0; j < topbrands.length; j++) {
    brandTopproductHTML += `
      <a href="#">
        <img src="${topbrands[j].img}" alt="${topbrands[j].dis}" />
        <p>${topbrands[j].dis}</p>
      </a>`;
  }
  brandTopproductEl.innerHTML = brandTopproductHTML;
}

// Hard to Resist Deals
const hardToResistDeals_image = document.querySelector(".hardToResistDeals_image");
let hardToResistDeals_imageHTML = "";
if (hardToResistDeals_image && Array.isArray(hardtoResistDeals)) {
  for (let k = 0; k < hardtoResistDeals.length; k++) {
    hardToResistDeals_imageHTML += `
      <a href="#">
        <img src="${hardtoResistDeals[k]}" alt="Deal promo banner" />
      </a>`;
  }
  hardToResistDeals_image.innerHTML = hardToResistDeals_imageHTML;
}

// ─── Search Autocomplete ───────────────────────────────────────────────
const searchInput = document.getElementById("searchInput");
const searchDropdown = document.getElementById("searchDropdown");

// Suggestions data — products + brands + categories
const suggestions = [
  // From nav categories
  "Indian Wear", "Western Wear", "Bags", "Jewellery", "Footwear",
  "Active & Sports", "Sleep & Lounge", "Top Wear", "Bottom Wear", "Ethnic Wear",
  // From popular links
  "Lipstick", "Highlighter", "Hair Serum", "Face Wash", "Sunscreen",
  "Eyeliner", "Perfume", "Mascara", "Cleanser", "Toner",
  "Night Cream", "Hair Mask", "Serum", "Makeup Pouch",
  // From brands in dropdown
  "Biba", "Bewakoof", "Soch", "Koko", "La Vie En Rose",
  // Product list names (add more from your listofProduct.js if needed)
  "Smartserve", "Beambika", "Tikhiimli",
  // Sale
  "Sale", "What's New", "All Brands"
];

let activeIndex = -1;

function highlightMatch(text, query) {
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, '<span class="match">$1</span>');
}

function showSuggestions(query) {
  searchDropdown.innerHTML = "";
  activeIndex = -1;

  if (!query.trim()) {
    searchDropdown.classList.remove("active");
    return;
  }

  const q = query.toLowerCase();
  const matches = suggestions.filter((s) =>
    s.toLowerCase().includes(q)
  ).slice(0, 8);

  if (matches.length === 0) {
    searchDropdown.innerHTML = '<div class="no-results">No results found</div>';
    searchDropdown.classList.add("active");
    return;
  }

  matches.forEach((item) => {
    const div = document.createElement("div");
    div.className = "suggestion-item";
    div.innerHTML = highlightMatch(item, query);
    div.addEventListener("click", () => {
      searchInput.value = item;
      searchDropdown.classList.remove("active");
    });
    searchDropdown.appendChild(div);
  });

  searchDropdown.classList.add("active");
}

// Debounce 300ms
let debounceTimer;
searchInput.addEventListener("input", (e) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => showSuggestions(e.target.value), 300);
});

// Keyboard navigation
searchInput.addEventListener("keydown", (e) => {
  const items = searchDropdown.querySelectorAll(".suggestion-item");
  if (e.key === "ArrowDown") {
    activeIndex = Math.min(activeIndex + 1, items.length - 1);
  } else if (e.key === "ArrowUp") {
    activeIndex = Math.max(activeIndex - 1, 0);
  } else if (e.key === "Enter" && activeIndex >= 0) {
    items[activeIndex].click();
    return;
  } else if (e.key === "Escape") {
    searchDropdown.classList.remove("active");
    return;
  }
  items.forEach((item, i) =>
    item.classList.toggle("highlighted", i === activeIndex)
  );
});

// Click bahar ho toh close
document.addEventListener("click", (e) => {
  if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
    searchDropdown.classList.remove("active");
  }
});