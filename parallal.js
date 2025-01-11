const menuBtn = document.querySelector('.menu-btn'); 
const cancelBtn = document.querySelector('.cancel-btn'); 
const menu = document.querySelector('.menu'); 
let text1 =document.getElementById('text1')
let  leaf =document.getElementById("leaf")
let  hill5 =document.getElementById("hill5")
let  hill1 =document.getElementById("hill1")
let  plant =document.getElementById("plant")
let hill4 =document.getElementById("hill4")

window.addEventListener('scroll',()=>{
    let value = window.scrollY;

    text1.style.marginTop = value * 1.5 +'px';
    leaf.style.left= value * 2 +'px';
    hill1.style.top= value * 0.25 +'px';
    hill5.style.left= value * 1 +'px';
    hill4.style.left=value *-0.75+'px';
    plant.style.marginTop = value * 0.5 +'px';

})


menuBtn.addEventListener('click', () => { 
    menu.classList.add('active'); }); 
cancelBtn.addEventListener('click', () => { 
    menu.classList.remove('active'); });

window.onscroll = function() {
    var button=document.querySelector('.scroll-to-top');
    if(document.documentElement.scrollTop>100){
        button.style.display = "block";
    }else{
        button.style.display="none";
    }
};
function scrollToTop(){
    document.documentElement.scrollTop = 0;
}
var index = 0;
    var text = "LIVE Green, LOVE Green, THINK Green";
    var speed = 50;
    function textEffect(){
        if(index < text.length){
            document.getElementById("effect")
                    .innerHTML += text.charAt(index);
            index++;
            setTimeout(textEffect, speed);
        } else{
            setTimeout(() =>{
                index=0;
                document.getElementById("effect").innerHTML ="";
                textEffect();
            },2000);
        }
};
window.onload=function(){
    textEffect();
};