// ─── HERO SLIDER ───
let currentIndex = 0;
const track = document.querySelector(".section-track");
const dots = document.querySelectorAll(".dot");
const totalSlides = dots.length;
let slideInterval;

function showSlide(index) {
  if (index >= totalSlides) {
    currentIndex = 0;
  } else if (index < 0) {
    currentIndex = totalSlides - 1;
  } else {
    currentIndex = index;
  }

  track.style.transform = `translateX(-${currentIndex * 100}%)`;

  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === currentIndex);
  });
}

function moveSlide(direction) {
  clearInterval(slideInterval);
  showSlide(currentIndex + direction);
  startAutoSlide();
}

function currentSlide(index) {
  clearInterval(slideInterval);
  showSlide(index);
  startAutoSlide();
}

function startAutoSlide() {
  slideInterval = setInterval(() => {
    showSlide(currentIndex + 1);
  }, 4000);
}

// ─── PAUSE ON HOVER ───
const heroSection = document.querySelector(".hero-section");
if (heroSection) {
  heroSection.addEventListener("mouseenter", () =>
    clearInterval(slideInterval),
  );
  heroSection.addEventListener("mouseleave", () => startAutoSlide());
}

// ─── SEARCH FOCUS EFFECT ───
const searchInput = document.querySelector(".search-box input");
const searchBox = document.querySelector(".search-box");

if (searchInput && searchBox) {
  searchInput.addEventListener("focus", () => {
    searchBox.style.boxShadow = "0 2px 8px rgba(40,116,240,0.25)";
  });
  searchInput.addEventListener("blur", () => {
    searchBox.style.boxShadow = "none";
  });
}

// ─── INIT ───
startAutoSlide();
