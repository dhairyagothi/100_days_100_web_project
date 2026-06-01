/* Parallax scroll — only runs on index.html where the elements exist */
const text1 = document.getElementById('text1');
const leaf   = document.getElementById('leaf');
const hill5  = document.getElementById('hill5');
const hill1  = document.getElementById('hill1');
const plant  = document.getElementById('plant');
const hill4  = document.getElementById('hill4');

/* Only attach listener if parallax elements are present */
if (text1 && leaf && hill5 && hill1 && plant && hill4) {
    let ticking = false;

    function runParallax() {
        const value = window.scrollY;

        if (window.innerWidth > 768) {
            text1.style.marginTop = value * 1.5  + 'px';
            leaf.style.left       = value * 2    + 'px';
            hill1.style.top       = value * 0.25 + 'px';
            hill5.style.left      = value * 1    + 'px';
            hill4.style.left      = value * -0.75 + 'px';
            plant.style.marginTop = value * 0.5  + 'px';
        }

<<<<<<< HEAD
    text1.style.marginTop = v * 1.5 + 'px';

    leaf.style.left = v * 2 + 'px';

    hill1.style.top = v * 0.25 + 'px';

    hill5.style.left = v * 1 + 'px';

    hill4.style.left = v * -0.75 + 'px';

    plant.style.marginTop = v * 0.5 + 'px';
  }

  // Mobile Fix
  else {

    text1.style.marginTop = v * 0.8 + 'px';

    leaf.style.left = v * 0.5 + 'px';

    hill1.style.top = v * 0.1 + 'px';

    hill5.style.left = v * 0.3 + 'px';

    hill4.style.left = v * -0.2 + 'px';

    plant.style.marginTop = v * 0.1 + 'px';
  }
});

<<<<<<< HEAD
console.log(window.innerWidth)
=======

>>>>>>> upstream/Main
// ── Scroll reveal ──
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(entries => {

  entries.forEach((entry, i) => {

    if (entry.isIntersecting) {

      const siblings = [
        ...entry.target.parentElement.querySelectorAll('.reveal')
      ];

      const idx = siblings.indexOf(entry.target);

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 100);

      observer.unobserve(entry.target);
    }
  });

}, { threshold: 0.15 });

revealEls.forEach(el => observer.observe(el));


// ── Animated stat counters ──
function animateCount(el) {

  const target = +el.dataset.target;

  const duration = 1800;

  const step = target / (duration / 16);

  let current = 0;

  const timer = setInterval(() => {

    current += step;

    if (current >= target) {

      el.textContent = target;

      clearInterval(timer);

    } else {

      el.textContent = Math.floor(current);
=======
        ticking = false;
>>>>>>> upstream/main
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(runParallax);
            ticking = true;
        }
    }, { passive: true });
}
