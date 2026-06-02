let currentIndex = 0;
const track = document.querySelector('.section-track');
const dots = document.querySelectorAll('.dot');
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
    if (i === currentIndex) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
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

startAutoSlide();
