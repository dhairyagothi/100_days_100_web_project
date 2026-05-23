const slider = document.getElementById('slider');
const directionBtn = document.getElementById('directionBtn');
const pauseBtn = document.getElementById('pauseBtn');
const themeBtn = document.getElementById('themeBtn');

let isPaused = false;
let isReversed = false;

/* =========================
   DOG DATA ARRAY
========================= */

const dogs = [
  {
    name: 'Buddy',
    image: 'Images/img1.jpg',
  },
  {
    name: 'Charlie',
    image: 'Images/img2.jpg',
  },
  {
    name: 'Rocky',
    image: 'Images/img3.jpg',
  },
  {
    name: 'Max',
    image: 'Images/img4.jpg',
  },
  {
    name: 'Leo',
    image: 'Images/img5.jpg',
  },
  {
    name: 'Luna',
    image: 'Images/img6.jpg',
  },
  {
    name: 'Daisy',
    image: 'Images/img7.jpg',
  },
  {
    name: 'Cooper',
    image: 'Images/img8.jpg',
  },
];

/* =========================
   DYNAMIC CARD GENERATION
========================= */

function generateGallery() {
  slider.innerHTML = '';

  const totalCards = dogs.length;
  const angleStep = 360 / totalCards;

  dogs.forEach((dog, index) => {
    const card = document.createElement('span');

    const rotation = angleStep * index;

    const radius = getComputedStyle(document.documentElement).getPropertyValue(
      '--radius'
    );

    card.style.transform = `
  rotateY(${rotation}deg) translateZ(${radius})
`;

    card.innerHTML = `
  <div class="image-wrapper">
    <img 
      src="${dog.image}" 
      alt="${dog.name}"
      onerror="
        this.style.display='none';
        this.nextElementSibling.style.display='flex';
      "
    />

    <div class="fallback-card">
      <div class="fallback-icon">🐶</div>
      <p>Image Unavailable</p>
    </div>
  </div>

  <h2>${dog.name}</h2>
`;

    slider.appendChild(card);
  });
}

generateGallery();

/* =========================
   ROTATION CONTROLS
========================= */

function getCurrentAngle() {
  const style = window.getComputedStyle(slider);
  const matrix = new DOMMatrixReadOnly(style.transform);

  const angle = Math.round(
    Math.atan2(matrix.m13, matrix.m11) * (180 / Math.PI)
  );

  return ((angle % 360) + 360) % 360;
}

function freeze() {
  const angle = getCurrentAngle();

  slider.style.animation = 'none';
  slider.style.transform = `perspective(1400px) rotateY(${angle}deg)`;

  return angle;
}

function resume(fromAngle, reverse) {
  const old = document.getElementById('__dyn_kf');

  if (old) old.remove();

  const endAngle = reverse ? fromAngle - 360 : fromAngle + 360;

  const duration =
    getComputedStyle(document.documentElement)
      .getPropertyValue('--duration')
      .trim() || '18s';

  const style = document.createElement('style');

  style.id = '__dyn_kf';

  style.textContent = `
    @keyframes __resume {
      from {
        transform: perspective(1400px)
          rotateY(${fromAngle}deg);
      }

      to {
        transform: perspective(1400px)
          rotateY(${endAngle}deg);
      }
    }
  `;

  document.head.appendChild(style);

  slider.style.transform = '';
  slider.style.animation = `__resume ${duration} linear infinite`;
}

/* =========================
   PAUSE BUTTON
========================= */

pauseBtn.addEventListener('click', () => {
  if (!isPaused) {
    freeze();

    pauseBtn.querySelector('.btn-label').textContent = 'Resume Rotation';
  } else {
    const frozenAngle = parseFloat(
      slider.style.transform.match(/rotateY\(([-\d.]+)deg\)/)?.[1] ?? 0
    );

    resume(frozenAngle, isReversed);

    pauseBtn.querySelector('.btn-label').textContent = 'Pause Rotation';
  }

  isPaused = !isPaused;
});

/* =========================
   DIRECTION BUTTON
========================= */

directionBtn.addEventListener('click', () => {
  isReversed = !isReversed;

  if (isPaused) {
    directionBtn.querySelector('.btn-label').textContent = isReversed
      ? 'Normal Rotation'
      : 'Reverse Rotation';

    return;
  }

  const angle = getCurrentAngle();

  resume(angle, isReversed);

  directionBtn.querySelector('.btn-label').textContent = isReversed
    ? 'Normal Rotation'
    : 'Reverse Rotation';
});

/* =========================
   THEME BUTTON
========================= */

themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');

  const isLight = document.body.classList.contains('light-theme');

  themeBtn.querySelector('.btn-label').textContent = isLight
    ? 'Dark Mode'
    : 'Light Mode';
});

/* =========================
   BUTTON HOVER EFFECT
========================= */

document.querySelectorAll('.ctrl-btn').forEach((btn) => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();

    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = (e.clientX - cx) / (rect.width / 2);

    const dy = (e.clientY - cy) / (rect.height / 2);

    const pull = 6;

    btn.style.setProperty('--mx', `${dx * pull}px`);
    btn.style.setProperty('--my', `${dy * pull}px`);

    btn.style.transform = `
      translateY(-5px)
      scale(1.04)
      translate(${dx * pull}px, ${dy * pull}px)
    `;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});
