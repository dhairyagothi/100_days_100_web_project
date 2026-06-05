import listofProduct from "./listofProduct.js";
import topbrands from "./topbrands.js";
import hardtoResistDeals from "./hardtoResistDeals.js";

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
