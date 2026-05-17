import listofProduct from "./listofProduct.js"
import topbrands from "./topbrands.js"
import hardtoResistDeals from "./hardtoResistDeals.js"


const btnPreve = document.querySelector(".btn-container-prev")
const btnNext = document.querySelector(".btn-container-next")
const ImageContainerSlider = document.querySelector("#imageSlideContaienr")

btnNext.addEventListener("click",()=>{
    ImageContainerSlider.scrollLeft += 200;
})

btnPreve.addEventListener("click",()=>{
    ImageContainerSlider.scrollLeft -= 200;
})


const listofProductEL = document.querySelector(".listofProduct")

const listofProductHTMl = listofProduct.map(product => `
    <a href="#">
        <img src="${product.img}"/>
        <p>${product.dis}</p>
    </a>
    `).join("");

listofProductEL.innerHTML = listofProductHTMl


const brandTopproductEl = document.querySelector(".brandTopproduct")

const brandTopproductHTML = topbrands.map(brand => `
    <a href="#">
        <img src="${brand.img}"/>
        <p>${brand.dis}</p>
    </a>
    `).join("");

brandTopproductEl.innerHTML = brandTopproductHTML


const hardToResistDeals_image = document.querySelector(".hardToResistDeals_image")
const hardToResistDeals_imageHTML = hardtoResistDeals.map(deal => `
    <a href="#">
        <img src="${deal}"/>
    </a>
    `).join("");

hardToResistDeals_image.innerHTML = hardToResistDeals_imageHTML