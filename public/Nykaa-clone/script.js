import listofProduct from "./listofProduct.js";
import topbrands from "./topbrands.js";
import hardtoResistDeals from "./hardtoResistDeals.js";

const btnPreve = document.querySelector(".btn-container-prev");
const btnNext = document.querySelector(".btn-container-next");
const ImageContainerSlider = document.querySelector("#imageSlideContainer");

// Balanced slider track navigation logic jump steps
btnNext.addEventListener("click", () => {
    ImageContainerSlider.scrollLeft += 200;
});

btnPreve.addEventListener("click", () => {
    ImageContainerSlider.scrollLeft -= 200; // Balanced: Changed from -100 to -200
});


// Isolate data loop operations using cleanly scoped definitions
const listofProductEL = document.querySelector(".listofProduct");
let listofProductHTMl = "";

for (let i = 0; i < listofProduct.length; i++) {
    listofProductHTMl += `
    <a href="#">
        <img src="${listofProduct[i].img}" alt="${listofProduct[i].dis}"/>
        <p>${listofProduct[i].dis}</p>
    </a>`;
}
listofProductEL.innerHTML = listofProductHTMl;


const brandTopproductEl = document.querySelector(".brandTopproduct");
let brandTopproductHTML = "";

for (let j = 0; j < topbrands.length; j++) { // Using distinct loop variable tracking
    brandTopproductHTML += `
    <a href="#">
        <img src="${topbrands[j].img}" alt="Brand asset"/>
        <p>${topbrands[j].dis}</p>
    </a>`;
}
brandTopproductEl.innerHTML = brandTopproductHTML;


const hardToResistDeals_image = document.querySelector(".hardToResistDeals_image");
let hardToResistDeals_imageHTML = "";

for (let k = 0; k < hardtoResistDeals.length; k++) { // Using distinct loop variable tracking
    hardToResistDeals_imageHTML += `
    <a href="#">
        <img src="${hardtoResistDeals[k]}" alt="Deal promo banner"/>
    </a>`;
}
hardToResistDeals_image.innerHTML = hardToResistDeals_imageHTML;