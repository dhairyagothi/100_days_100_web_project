/*var swiper = new Swiper(".mySwiper", {
    cssMode: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
    },
    mousewheel: true,
    keyboard: true,
  });*/

  let photos=[
    "public/images/i1.jpg",
    "public/images/i2.jpg",
    "public/images/i3.jpg",
    "public/images/i4.jpg",
    "public/images/i5.jpg",
    "public/images/i6.jpg",
    "public/images/i7.jpg",
    "public/images/i8.jpg",
    "public/images/i9.jpg"
  ];

let index=0;

function preloadImages() {
  for (let i = 0; i < photos.length; i++) {
    let img = new Image();
    img.src = photos[i];
  }
}

window.onload = function () {
  preloadImages();
  let img = document.getElementById("photo");
  img.src = photos[index];
};

function showPhoto(){
  let img=document.getElementById("photo");
  img.style.opacity=0;
  setTimeout(()=>{
    img.src=photos[index];
    img.style.opacity=1;
  },300)
}

function nextPhoto(){
  index=(index+1) % photos.length;
  showPhoto();
}

function prevPhoto(){
  index=(index-1+photos.length) % photos.length;
  showPhoto();
}