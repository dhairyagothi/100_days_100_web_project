// ---------- Header banner slider ----------
const sliderList = document.querySelector(".header-slider ul");
const slides = document.querySelectorAll(".header-img");
const prevBtn = document.querySelector(".control_prev");
const nextBtn = document.querySelector(".control_next");

let currentIndex = 0;
const totalSlides = slides.length;

function updateSlidePosition() {
  if (sliderList) {
    sliderList.style.transform = `translateX(-${currentIndex * 100}%)`;
  }
}

function goToNextSlide() {
  currentIndex = (currentIndex + 1) % totalSlides;
  updateSlidePosition();
}

function goToPrevSlide() {
  currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
  updateSlidePosition();
}

if (nextBtn) {
  nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    goToNextSlide();
  });
}

if (prevBtn) {
  prevBtn.addEventListener("click", (e) => {
    e.preventDefault();
    goToPrevSlide();
  });
}

// Auto-play the slider every 4 seconds
let autoSlide = setInterval(goToNextSlide, 4000);

// Pause auto-play on hover, resume on mouse leave
const headerSlider = document.querySelector(".header-slider");
if (headerSlider) {
  headerSlider.addEventListener("mouseenter", () => clearInterval(autoSlide));
  headerSlider.addEventListener("mouseleave", () => {
    autoSlide = setInterval(goToNextSlide, 4000);
  });
}
