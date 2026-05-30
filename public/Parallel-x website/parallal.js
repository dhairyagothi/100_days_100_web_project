// ── Custom cursor ──
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');

document.addEventListener('mousemove', e => {
  dot.style.left  = e.clientX + 'px';
  dot.style.top   = e.clientY + 'px';

  ring.style.left = e.clientX + 'px';
  ring.style.top  = e.clientY + 'px';
});

document.querySelectorAll('a, button, .eco-card, .fact-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.transform = 'translate(-50%,-50%) scale(1.6)';
  });

  el.addEventListener('mouseleave', () => {
    ring.style.transform = 'translate(-50%,-50%) scale(1)';
  });
});


// ── Sticky header ──
const header = document.getElementById('mainHeader');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
});


// ── Mobile hamburger ──
const hamburger = document.getElementById('hamburger');
const nav       = document.getElementById('mainNav');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  nav.classList.toggle('open');
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    nav.classList.remove('open');
  });
});


// ── Parallax scroll ──
const text1 = document.getElementById('text1');
const leaf  = document.getElementById('leaf');
const hill5 = document.getElementById('hill5');
const hill1 = document.getElementById('hill1');
const plant = document.getElementById('plant');
const hill4 = document.getElementById('hill4');

window.addEventListener('scroll', () => {

  const v = window.scrollY;

  // Desktop
  if (window.innerWidth > 768) {

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
    }

  }, 16);
}

const countEls = document.querySelectorAll('.count');

const countObserver = new IntersectionObserver(entries => {

  entries.forEach(entry => {

    if (entry.isIntersecting) {

      animateCount(entry.target);

      countObserver.unobserve(entry.target);
    }
  });

}, { threshold: 0.5 });

countEls.forEach(el => countObserver.observe(el));