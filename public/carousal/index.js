let carousal = document.querySelector('.carousal');
let items = document.querySelectorAll('.item');

document.addEventListener('scroll', () => {
let primary = carousal.getBoundingClientRect().top/ window.innerHeight;

let index= Math.ceil(-1.75*(primary+0.5));
items.forEach((item, i) => {
    item.className = "item";
    if (i == index) {
      item.className = "item active";
    }
  });


})