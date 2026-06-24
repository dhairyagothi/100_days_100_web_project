import listofProduct from "./listofProduct.js";
import topbrands from "./topbrands.js";
import hardtoResistDeals from "./hardtoResistDeals.js";

// ===== SLIDER =====
const btnPrev = document.querySelector(".btn-container-prev");
const btnNext = document.querySelector(".btn-container-next");
const imageSlideContainer = document.querySelector("#imageSlideContainer");

if (btnNext && imageSlideContainer) {
  btnNext.addEventListener("click", () => {
    imageSlideContainer.scrollLeft += 200;
  });
}

if (btnPrev && imageSlideContainer) {
  btnPrev.addEventListener("click", () => {
    imageSlideContainer.scrollLeft -= 200;
  });
}

// ===== PRODUCT LIST =====
const listofProductEl = document.querySelector(".listofProduct");
if (listofProductEl && listofProduct?.length) {
  let html = "";
  for (let i = 0; i < listofProduct.length; i++) {
    html += `
      <a href="#">
        <img src="${listofProduct[i].img}" alt="${listofProduct[i].dis}" />
        <p>${listofProduct[i].dis}</p>
      </a>`;
  }
  listofProductEl.innerHTML = html;
}

// ===== TOP BRANDS =====
const brandTopproductEl = document.querySelector(".brandTopproduct");
if (brandTopproductEl && topbrands?.length) {
  let html = "";
  for (let j = 0; j < topbrands.length; j++) {
    html += `
      <a href="#">
        <img src="${topbrands[j].img}" alt="${topbrands[j].dis}" />
        <p>${topbrands[j].dis}</p>
      </a>`;
  }
  brandTopproductEl.innerHTML = html;
}

// ===== HARD TO RESIST DEALS =====
const hardToResistDealsEl = document.querySelector(".hardToResistDeals_image");
if (hardToResistDealsEl && hardtoResistDeals?.length) {
  let html = "";
  for (let k = 0; k < hardtoResistDeals.length; k++) {
    html += `
      <a href="#">
        <img src="${hardtoResistDeals[k]}" alt="Deal promo banner" />
      </a>`;
  }
  hardToResistDealsEl.innerHTML = html;
}
