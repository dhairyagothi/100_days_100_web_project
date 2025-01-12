const images = [
  "https://i.pinimg.com/736x/ef/f2/4d/eff24d4670b0a53f05ddf368206ca299.jpg",
  "https://i.pinimg.com/736x/0c/94/f9/0c94f9826758103f0660f09595d8a7d1.jpg",
  "https://i.pinimg.com/736x/9d/f2/b3/9df2b3e54edf774cbf9802ba5f7288bf.jpg",
  "https://i.pinimg.com/736x/a0/ac/78/a0ac781abd2f5bb62c86b5531f75e299.jpg",
  "https://i.pinimg.com/736x/40/2e/ca/402eca2dcef124e6025082926c4a8a41.jpg",
  "https://i.pinimg.com/736x/48/2e/ca/482eca5437bc22beb60263d65ad254e3.jpg",
  "https://i.pinimg.com/736x/b9/7a/73/b97a735367d1befb79bc558c71fc3ef8.jpg",
  "https://i.pinimg.com/736x/95/bc/c7/95bcc77c02532be794f57042cb5527e7.jpg",
  "https://i.pinimg.com/736x/f2/45/8e/f2458e8bb361c317d455d51382c483eb.jpg",
  "https://i.pinimg.com/736x/27/4e/5e/274e5e4e10bb07e3a479f9c40fd3ea46.jpg",
  "https://i.pinimg.com/736x/53/e2/6f/53e26f91b3c614f30d93981dc0be45de.jpg"
];
let currentIndex =0;
const galleryImage = document.getElementById("galleryImage");
galleryImage.src = images[currentIndex];

function changeImageOnHover(){
  currentIndex = (currentIndex + 1 + images.length)%images.length;
  galleryImage.src = images[currentIndex];
}

galleryImage.addEventListener("mouseover", changeImageOnHover)

// cursor
const coords = {
  x: 0,
  y: 0
};
const circles = document.querySelectorAll(".circle");

const cursor = document.querySelector(".cursor");

circles.forEach(function (circle, index) {
  circle.x = 0;
  circle.y = 0;
  circle.style.backgroundColor = "white";
});

window.addEventListener("mousemove", function (e) {
  coords.x = e.clientX;
  coords.y = e.clientY;
});

function animateCircles() {
  let x = coords.x;
  let y = coords.y;

  cursor.style.top = x;
  cursor.style.left = y;

  circles.forEach(function (circle, index) {
      circle.style.left = x - 12 + "px";
      circle.style.top = y - 12 + "px";

      circle.style.scale = (circles.length - index) / circles.length;

      circle.x = x;
      circle.y = y;

      const nextCircle = circles[index + 1] || circles[0];
      x += (nextCircle.x - x) * 0.3;
      y += (nextCircle.y - y) * 0.3;
  });

  requestAnimationFrame(animateCircles);
}

animateCircles();