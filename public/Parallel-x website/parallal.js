let text1 =document.getElementById('text1')
let  leaf =document.getElementById("leaf")
let  hill5 =document.getElementById("hill5")
let  hill1 =document.getElementById("hill1")
let  plant =document.getElementById("plant")
let hill4 =document.getElementById("hill4")

window.addEventListener('scroll',()=>{
    let value = window.scrollY;

    text1.style.marginTop = value * 2.5 +'px';
    leaf.style.left= value * 2 +'px';
    hill1.style.top= value * 0.25 +'px';
    hill5.style.left= value * 1 +'px';
    hill4.style.left=value *-0.75+'px';
    plant.style.marginTop = value * 0.5 +'px';

})