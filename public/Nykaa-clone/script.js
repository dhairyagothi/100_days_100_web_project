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
    ImageContainerSlider.scrollLeft -= 100
})


const listofProductEL = document.querySelector(".listofProduct")

let listofProductHTMl = "" ;

for(let i  = 0 ; i < listofProduct.length ; i++){
    listofProductHTMl  += `
    <a href="#">
        <img src="${listofProduct[i].img}"/>
        <p>${listofProduct[i].dis}</p>
    </a>
        `
}
listofProductEL.innerHTML = listofProductHTMl


const brandTopproductEl = document.querySelector(".brandTopproduct")

let brandTopproductHTML = ""

for(let i = 0 ; i < topbrands.length ; i++){
    brandTopproductHTML += `
    <a href="#">
        <img src="${topbrands[i].img}"/>
        <p>${topbrands[i].dis}</p>
    </a>
    `
}

brandTopproductEl.innerHTML = brandTopproductHTML


const hardToResistDeals_image = document.querySelector(".hardToResistDeals_image")
let hardToResistDeals_imageHTML = ""

for(let i = 0 ; i < hardtoResistDeals.length ; i++){
    hardToResistDeals_imageHTML += `
    <a href="#">
        <img src="${hardtoResistDeals[i]}"/>
    </a>
    `
}

hardToResistDeals_image.innerHTML = hardToResistDeals_imageHTML