const slider = document.getElementById('slider');
const directionBtn = document.getElementById('directionBtn');
const pauseBtn = document.getElementById('pauseBtn');
const themeBtn = document.getElementById('themeBtn');
const prevBtn = document.getElementById('prevBtn');   // optional – not in HTML
const nextBtn = document.getElementById('nextBtn');   // optional – not in HTML

let isPaused = false;
let isReversed = false;

/* =========================
   DOG DATA ARRAY WITH HEX GLOW COLORS
========================= */

const dogs = [
  {
    name: 'Buddy',
    image: 'Images/img1.jpg',
    color: 'rgba(235, 172, 60, 0.22)', // Warm Golden
  },
  {
    name: 'Charlie',
    image: 'Images/img2.jpg',
    color: 'rgba(79, 141, 255, 0.22)', // Sky Blue
  },
  {
    name: 'Rocky',
    image: 'Images/img3.jpg',
    color: 'rgba(46, 204, 113, 0.22)', // Emerald Green
  },
  {
    name: 'Max',
    image: 'Images/img4.jpg',
    color: 'rgba(231, 76, 60, 0.22)', // Amber Red
  },
  {
    name: 'Leo',
    image: 'Images/img5.jpg',
    color: 'rgba(155, 89, 182, 0.22)', // Violet Purple
  },
  {
    name: 'Luna',
    image: 'Images/img6.jpg',
    color: 'rgba(255, 99, 132, 0.22)', // Coral Pink
  },
  {
    name: 'Daisy',
    image: 'Images/img7.jpg',
    color: 'rgba(241, 196, 15, 0.22)', // Golden Yellow
  },
  {
    name: 'Cooper',
    image: 'Images/img8.jpg',
    color: 'rgba(26, 188, 156, 0.22)', // Soft Teal
  },
];

/* =========================
   DYNAMIC CARD GENERATION
========================= */

function generateGallery() {
  slider.innerHTML = '';

  const totalCards = dogs.length;
  const angleStep = 360 / totalCards;

  // Let CSS know the dynamic angle step
  slider.style.setProperty('--angle-step', `${angleStep}deg`);

  dogs.forEach((dog, index) => {
    const card = document.createElement('span');

    // Set custom property index for CSS transform math
    card.style.setProperty('--i', index);

    card.innerHTML = `
  <div class="image-wrapper">
    <img 
      src="${dog.image}" 
      alt="3D gallery image of ${dog.name}"
      loading="lazy"
      onerror="
        this.style.display='none';
        this.nextElementSibling.style.display='flex';
      "
    />

    <div 
      class="fallback-card"
      role="img"
      aria-label="Fallback placeholder image for ${dog.name}"
    >
      <div class="fallback-icon" aria-hidden="true">
        🐶
      </div>

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
   PHYSICS & INTERACTIVE ENGINE
========================= */

let currentAngle = 0;      // Current absolute rotation of the carousel
let targetAngle = 0;       // Easing target rotation
let isDragging = false;    // Whether user is dragging
let startX = 0;            // Drag start coordinate
let startAngle = 0;        // Angle when drag started
let velocity = 0;          // Momentum rotation velocity
let lastX = 0;             // Last coordinate to calculate delta velocity
let lastTime = performance.now();
let isTransitioning = false; // Stepping transition active
const autoRotationSpeed = 18; // Degrees rotated per second (approx 20s per full spin)

// Stop basic CSS rotate animation so JS engine has full controls
slider.style.animation = 'none';

// Make sure mobile swiping does not trigger default scrolling behaviors on the scene
const scene = document.querySelector('.scene');
if (scene) {
  scene.style.touchAction = 'none';
  scene.style.cursor = 'grab';
}

function updateGalleryStates() {
  const totalCards = dogs.length;
  const angleStep = 360 / totalCards;

  // Face-forward card calculation based on normalized absolute angle
  const normalizedAngle = ((-currentAngle % 360) + 360) % 360;
  const activeIndex = Math.round(normalizedAngle / angleStep) % totalCards;

  // 1. Mark the active facing card for the Cinema Focusing effect
  const cards = slider.querySelectorAll('span');
  cards.forEach((card, index) => {
    if (index === activeIndex) {
      card.classList.add('active-card');
    } else {
      card.classList.remove('active-card');
    }
  });

  // 2. Dynamically transition ambient light background glow to matching card color
  if (dogs[activeIndex]) {
    document.documentElement.style.setProperty('--ambient-glow', dogs[activeIndex].color);
  }
}

function physicsLoop(timestamp) {
  const dt = (timestamp - lastTime) / 1000; // time delta in seconds
  lastTime = timestamp;

  if (isDragging) {
    // Current angle is updated directly in pointermove listener
  } else if (isTransitioning) {
    // Smooth lerping physics to snap to target card angle
    const diff = targetAngle - currentAngle;
    currentAngle += diff * 0.08; // Smooth ease-out

    if (Math.abs(diff) < 0.05) {
      currentAngle = targetAngle;
      isTransitioning = false;
    }
  } else {
    // Inertia decay deceleration physics when drag momentum exists
    if (Math.abs(velocity) > 0.02) {
      currentAngle += velocity;
      velocity *= 0.94; // Friction damping coefficient
      targetAngle = currentAngle;
    } else {
      // Auto-rotation engine
      if (!isPaused) {
        const directionFactor = isReversed ? -1 : 1;
        currentAngle += autoRotationSpeed * dt * directionFactor;
        targetAngle = currentAngle;
      }
    }
  }

  // Update slider transform
  slider.style.transform = `perspective(1400px) rotateY(${currentAngle}deg)`;

  // Update active state visual cues
  updateGalleryStates();

  requestAnimationFrame(physicsLoop);
}

// Start physics loop
requestAnimationFrame(physicsLoop);

/* =========================
   TOUCH & DRAG HANDLERS
========================= */

if (scene) {
  scene.addEventListener('pointerdown', (e) => {
    isDragging = true;
    isTransitioning = false;
    startX = e.clientX;
    startAngle = currentAngle;
    lastX = e.clientX;
    velocity = 0;
    scene.style.cursor = 'grabbing';
    e.preventDefault();
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;

    const currentX = e.clientX;
    const dx = currentX - startX;

    // Convert horizontal pixel drag delta to degrees rotation delta
    const angleDelta = dx * 0.18;
    currentAngle = startAngle + angleDelta;
    targetAngle = currentAngle;

    // Estimate drag momentum velocity
    velocity = (currentX - lastX) * 0.15;
    lastX = currentX;
  });

  const endDrag = () => {
    if (!isDragging) return;
    isDragging = false;
    scene.style.cursor = 'grab';
  };

  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);
}

/* =========================
   STEP BUTTON CONTROLS (NEXT/PREV)
========================= */

const totalCards = dogs.length;
const angleStep = 360 / totalCards;

function stepCarousel(direction) {
  isTransitioning = true;
  
  // Snap target rotation strictly to nearest card division to prevent floating drift
  const nearestAngle = Math.round(targetAngle / angleStep) * angleStep;
  
  // direction: -1 for next, 1 for prev
  targetAngle = nearestAngle - (direction * angleStep);
  velocity = 0;
}

if (prevBtn) prevBtn.addEventListener('click', () => stepCarousel(1));
if (nextBtn) nextBtn.addEventListener('click', () => stepCarousel(-1));

/* =========================
   PLAY / PAUSE BUTTON
========================= */

pauseBtn.addEventListener('click', () => {
  isPaused = !isPaused;
  pauseBtn.querySelector('.btn-label').textContent = isPaused ? 'Resume Rotation' : 'Pause Rotation';
  isTransitioning = false;
});

/* =========================
   DIRECTION BUTTON
========================= */

directionBtn.addEventListener('click', () => {
  isReversed = !isReversed;
  directionBtn.querySelector('.btn-label').textContent = isReversed ? 'Normal Rotation' : 'Reverse Rotation';
});

/* =========================
   THEME PERSISTENCE
========================= */

function applyTheme(theme) {
  const isLight = theme === 'light';

  document.body.classList.toggle('light-theme', isLight);

  themeBtn.querySelector('.btn-label').textContent = isLight ? 'Dark Mode' : 'Light Mode';
}

/* Load saved theme on page load */
const savedTheme = localStorage.getItem('gallery-theme') || 'dark';

applyTheme(savedTheme);

/* Theme toggle button */
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
  const isLight = document.body.classList.contains('light-theme');
  themeBtn.querySelector('.btn-label').textContent = isLight ? 'Dark Mode' : 'Light Mode';
  localStorage.setItem('gallery-theme', isLight ? 'light' : 'dark');
});

/* =========================
   BUTTON HOVER MAGNETIC EFFECT
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