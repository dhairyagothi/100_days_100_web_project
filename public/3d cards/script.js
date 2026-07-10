const slider = document.getElementById('slider');
const directionBtn = document.getElementById('directionBtn');
const pauseBtn = document.getElementById('pauseBtn');
const themeBtn = document.getElementById('themeBtn');
const voiceBtn = document.getElementById('voiceBtn');
const voiceStatus = document.getElementById('voiceStatus');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

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

    // Mouse movement parallax 3D card tilt
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xc = rect.width / 2;
      const yc = rect.height / 2;
      
      // Calculate tilt angles (max 10 degrees)
      const angleX = -((y - yc) / yc) * 10;
      const angleY = ((x - xc) / xc) * 10;
      
      card.style.setProperty('--tilt-x', `${angleX}deg`);
      card.style.setProperty('--tilt-y', `${angleY}deg`);
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });

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
    <div class="glare-overlay"></div>

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

  // 1. Mark the active facing card and update gradual depth visual styles
  const cards = slider.querySelectorAll('span');
  cards.forEach((card, index) => {
    if (index === activeIndex) {
      card.classList.add('active-card');
    } else {
      card.classList.remove('active-card');
    }

    // Calculate relative difference from facing forward (0 degrees) normalized to [-180, 180]
    const cardAngle = (index * angleStep + currentAngle) % 360;
    let diffAngle = ((cardAngle + 180) % 360) - 180;
    if (diffAngle < -180) diffAngle += 360;

    // Cosine factor: 1 at front (0 deg), -1 at back (180 deg)
    const cosFactor = Math.cos(diffAngle * Math.PI / 180);
    const intensity = (cosFactor + 1) / 2; // Ranges from 1 (front) to 0 (back)

    // Calculate gradual properties
    const opacity = 0.15 + 0.85 * intensity;    // 0.15 (back) to 1.0 (front)
    const scale = 0.82 + 0.18 * intensity;      // 0.82 (back) to 1.0 (front)
    const brightness = 0.35 + 0.65 * intensity; // 0.35 (back) to 1.0 (front)
    const blur = (1 - intensity) * 3.5;         // blur up to 3.5px at the back

    // Glare position: shifts linearly based on angle
    const glareX = (diffAngle / 90) * 50 + 50;  // Map [-90, 90] to [0%, 100%]

    // Set custom CSS variables
    card.style.setProperty('--depth-opacity', opacity);
    card.style.setProperty('--depth-scale', scale);
    card.style.setProperty('--depth-brightness', brightness);
    card.style.setProperty('--depth-blur', `${blur}px`);
    card.style.setProperty('--glare-x', `${glareX}%`);
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

if (prevBtn) {
  prevBtn.addEventListener('click', () => stepCarousel(1));
}
if (nextBtn) {
  nextBtn.addEventListener('click', () => stepCarousel(-1));
}

/* =========================
   PLAY / PAUSE BUTTON
========================= */

if (pauseBtn) {
  pauseBtn.addEventListener('click', () => {
    isPaused = !isPaused;
    const label = pauseBtn.querySelector('.btn-label');
    if (label) {
      label.textContent = isPaused ? 'Resume Rotation' : 'Pause Rotation';
    }
    isTransitioning = false;
  });
}

/* =========================
   DIRECTION BUTTON
========================= */

if (directionBtn) {
  directionBtn.addEventListener('click', () => {
    isReversed = !isReversed;
    const label = directionBtn.querySelector('.btn-label');
    if (label) {
      label.textContent = isReversed ? 'Normal Rotation' : 'Reverse Rotation';
    }
  });
}

/* =========================
   THEME PERSISTENCE
========================= */

function applyTheme(theme) {
  const isLight = theme === 'light';

  document.body.classList.toggle('light-theme', isLight);

  if (themeBtn) {
    const label = themeBtn.querySelector('.btn-label');
    if (label) {
      label.textContent = isLight ? 'Dark Mode' : 'Light Mode';
    }
  }
}

/* Load saved theme on page load */
const savedTheme = localStorage.getItem('gallery-theme') || 'dark';

applyTheme(savedTheme);

/* Theme toggle button */
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    const label = themeBtn.querySelector('.btn-label');
    if (label) {
      label.textContent = isLight ? 'Dark Mode' : 'Light Mode';
    }
    try {
      localStorage.setItem('gallery-theme', isLight ? 'light' : 'dark');
    } catch (_) {}
  });
}


/* =========================
   VOICE CONTROL
========================= */

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

let recognition;
let voiceEnabled = false;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();

  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onresult = (event) => {
    const transcript =
      event.results[event.results.length - 1][0].transcript
        .toLowerCase()
        .trim();

    voiceStatus.textContent = `Heard: "${transcript}"`;

    if (
      transcript.includes('next')
    ) {
      stepCarousel(-1);
    }

    else if (
      transcript.includes('previous') ||
      transcript.includes('back')
    ) {
      stepCarousel(1);
    }

    else if (
      transcript.includes('pause')
    ) {
      if (!isPaused) {
        pauseBtn.click();
      }
    }

    else if (
      transcript.includes('resume') ||
      transcript.includes('play')
    ) {
      if (isPaused) {
        pauseBtn.click();
      }
    }

    else if (
      transcript.includes('dark mode')
    ) {
      document.body.classList.remove('light-theme');
      themeBtn.querySelector('.btn-label').textContent =
        'Light Mode';

      localStorage.setItem(
        'gallery-theme',
        'dark'
      );
    }

    else if (
      transcript.includes('light mode')
    ) {
      document.body.classList.add('light-theme');
      themeBtn.querySelector('.btn-label').textContent =
        'Dark Mode';

      localStorage.setItem(
        'gallery-theme',
        'light'
      );
    }
  };

  recognition.onerror = (event) => {
  voiceStatus.textContent =
    'Voice Error: ' + event.error;

  voiceStatus.classList.add('error');
};

  recognition.onend = () => {
    if (voiceEnabled) {
      recognition.start();
    }
  };

  voiceBtn.addEventListener('click', () => {
    voiceEnabled = !voiceEnabled;

    if (voiceEnabled) {
      recognition.start();

      voiceStatus.textContent =
        'Listening...';

      voiceStatus.classList.remove('error');
      voiceStatus.classList.add('active');

      voiceBtn.querySelector('.btn-label').textContent =
        '🎤 Stop Voice';
    } else {
      recognition.stop();

      voiceStatus.textContent =
        'Voice Control Inactive';

      voiceStatus.classList.remove('active');

      voiceBtn.querySelector('.btn-label').textContent =
        '🎤 Voice Control';
    }
  });
} else {
  voiceBtn.disabled = true;

  voiceStatus.textContent =
    'Speech Recognition Not Supported';
}


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
