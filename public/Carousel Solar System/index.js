document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
  const miniPlanets = document.querySelectorAll(".mini-planet");
  const planetItems = document.querySelectorAll(".planet-item");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  let currentIndex = 0;

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove("active"));
    planetItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    showSlide(index);
  });
});

    if (index < 0) {
      currentIndex = slides.length - 1;
    } else if (index >= slides.length) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    slides[currentIndex].classList.add("active");

    if (miniPlanets[currentIndex]) {
      miniPlanets[currentIndex].classList.add("active");
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      showSlide(currentIndex + 1);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      showSlide(currentIndex - 1);
    });
  }

  miniPlanets.forEach((planet, index) => {
    planet.addEventListener("click", () => {
      showSlide(index);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      showSlide(currentIndex + 1);
    }

    if (e.key === "ArrowLeft") {
      showSlide(currentIndex - 1);
    }
  });


  let touchStartX = 0;
  let touchEndX = 0;

  document.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  document.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;

    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        showSlide(currentIndex + 1);
      } else {
        showSlide(currentIndex - 1);
      }
    }
  });

  showSlide(0);
});
