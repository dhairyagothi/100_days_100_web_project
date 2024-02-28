let text1 =document.getElementById('text1')
let  leaf =document.getElementById("leaf")
let  hill5 =document.getElementById("hill5")
let  hill1 =document.getElementById("hill1")
let  plant =document.getElementById("plant")

window.addEventListener('scroll',()=>{
    let value = window.scrollY;

    text1.style.marginTop = value * 2.5 +'px';
    leaf.style.left= value * 2 +'px';
    hill1.style.top= value * -0.25 +'px';
    hill5.style.left= value * 1 +'px';


})