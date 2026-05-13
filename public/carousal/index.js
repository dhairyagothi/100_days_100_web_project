document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    let currentIndex = 0;
    let isScrolling = false;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }

    const nextBtn = document.getElementById('next');
    const prevBtn = document.getElementById('prev');

    nextBtn.addEventListener('click', () => {
        currentIndex++;
        if (currentIndex >= slides.length) {
            currentIndex = 0; // Loop back to the first slide
        }
        showSlide(currentIndex);
    });

    prevBtn.addEventListener('click', () => {
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = slides.length - 1; // Loop to the last slide
        }
        showSlide(currentIndex);
    });

    window.addEventListener('wheel', (event) => {

        if (isScrolling) return;
        if (Math.abs(event.deltaY) < 2) return;

        isScrolling = true;

        if (event.deltaY > 0) {
            currentIndex = (currentIndex + 1) % slides.length;
        } else {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        }
        showSlide(currentIndex);

        setTimeout(() => {
            isScrolling = false;
        }, 1800); 
    }, { passive: false }); 
});


    