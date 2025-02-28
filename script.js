// Sticky Navigation Menu
let nav = document.querySelector("nav");
let scrollBtn = document.querySelector(".scroll-button a");

// Show/hide sticky navigation and scroll button based on scroll position
window.onscroll = function () {
  if (document.documentElement.scrollTop > 20) {
    nav.classList.add("sticky");
    scrollBtn.style.display = "block";
  } else {
    nav.classList.remove("sticky");
    scrollBtn.style.display = "none";
  }
};

// Side Navigation Menu
let body = document.querySelector("body");
let navBar = document.querySelector(".navbar");
let menuBtn = document.querySelector(".menu-btn");
let cancelBtn = document.querySelector(".cancel-btn");

menuBtn.onclick = function () {
  navBar.classList.add("active");
  menuBtn.style.opacity = "0";
  menuBtn.style.pointerEvents = "none";
  body.style.overflow = "hidden";
  scrollBtn.style.pointerEvents = "none";
};

const hideNavMenu = () => {
  navBar.classList.remove("active");
  menuBtn.style.opacity = "1";
  menuBtn.style.pointerEvents = "auto";
  body.style.overflow = "auto";
  scrollBtn.style.pointerEvents = "auto";
};

cancelBtn.onclick = hideNavMenu;

let navLinks = document.querySelectorAll(".menu li a");
navLinks.forEach((link) => {
  link.addEventListener("click", hideNavMenu);
});

// Gallery Section
const images = [
  "https://www.ciraltos.com/wp-content/uploads/2019/10/VSGit.png",
  "https://avatars.githubusercontent.com/u/98707668?v=4?s=400",
  "https://user-images.githubusercontent.com/73171829/149663097-e77294c3-769c-45ae-92c9-011fbba94965.gif"
]; 

let currentIndex = 0;
const galleryImage = document.getElementById("galleryImage");
galleryImage.src = images[currentIndex];

function changeImageOnHover() {
  currentIndex = (currentIndex + 1 + images.length) % images.length;
  galleryImage.src = images[currentIndex];
}
//Add hover event listener 
galleryImage.addEventListener("mouseover", changeImageOnHover)

document.getElementById('redirectButton').addEventListener('click', function() {
  window.open('https://giffiles.alphacoders.com/174/1744.gif', '_blank');
});

