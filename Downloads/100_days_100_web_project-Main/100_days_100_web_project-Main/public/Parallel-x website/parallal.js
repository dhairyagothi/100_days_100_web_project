const text1 = document.getElementById('text1');
const leaf = document.getElementById("leaf");
const hill5 = document.getElementById("hill5");
const hill1 = document.getElementById("hill1");
const plant = document.getElementById("plant");
const hill4 = document.getElementById("hill4");

window.addEventListener('scroll', () => {


const value = window.scrollY;

/* Reduce heavy animation on smaller devices */
if(window.innerWidth > 768){

    text1.style.marginTop = value * 1.5 + 'px';
    leaf.style.left = value * 2 + 'px';
    hill1.style.top = value * 0.25 + 'px';
    hill5.style.left = value * 1 + 'px';
    hill4.style.left = value * -0.75 + 'px';
    plant.style.marginTop = value * 0.5 + 'px';
}


});
