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
listofProductEL.innerHTML = listofProduct.map(p => `
    <a href="#">
        <img src="${p.img}" alt="${p.dis}" loading="lazy"/>
        <p>${p.dis}</p>
    </a>
`).join("")


const brandTopproductEl = document.querySelector(".brandTopproduct")
brandTopproductEl.innerHTML = topbrands.map(b => `
    <a href="#">
        <img src="${b.img}" alt="${b.dis}" loading="lazy"/>
        <p>${b.dis}</p>
    </a>
`).join("")


const hardToResistDeals_image = document.querySelector(".hardToResistDeals_image")
hardToResistDeals_image.innerHTML = hardtoResistDeals.map(url => `
    <a href="#">
        <img src="${url}" alt="Deal image" loading="lazy"/>
    </a>
`).join("")