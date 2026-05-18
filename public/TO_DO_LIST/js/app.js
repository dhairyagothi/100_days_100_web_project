/* ============================================================
   TASKFLOW — App / Landing JS (Three.js & Auth)
   ============================================================ */

// Check if already logged in
if (sessionStorage.getItem('taskflow_user')) {
  window.location.href = 'pages/dashboard.html';
}

function toggleAuth() {
  const modal = document.getElementById('auth-modal');
  modal.classList.toggle('active');
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const name = email.split('@')[0];
  completeLogin(name);
}

function demoLogin() {
  completeLogin('Demo User');
}

function completeLogin(name) {
  sessionStorage.setItem('taskflow_user', name);
  showToast(`Welcome back, ${name}! Redirecting...`);
  
  // Redirect to Dashboard after a short delay
  setTimeout(() => {
    window.location.href = 'pages/dashboard.html';
  }, 1000);
}

function showToast(msg) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-check-circle" style="color:var(--accent-green)"></i> ${msg}`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

/* --- Interactive Three.js Background (Light Theme Style) --- */
function initThreeJS() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 40;

  // Floating geometric shapes instead of just particles for a more "modern/app" feel
  const group = new THREE.Group();
  scene.add(group);

  const geometry1 = new THREE.TorusGeometry(10, 3, 16, 100);
  const material1 = new THREE.MeshBasicMaterial({ color: 0x4facfe, wireframe: true, transparent: true, opacity: 0.15 });
  const torus = new THREE.Mesh(geometry1, material1);
  torus.position.set(-25, 10, -10);
  group.add(torus);

  const geometry2 = new THREE.IcosahedronGeometry(8, 0);
  const material2 = new THREE.MeshBasicMaterial({ color: 0xff9ff3, wireframe: true, transparent: true, opacity: 0.15 });
  const ico = new THREE.Mesh(geometry2, material2);
  ico.position.set(30, -10, -20);
  group.add(ico);

  const geometry3 = new THREE.ConeGeometry(7, 14, 4);
  const material3 = new THREE.MeshBasicMaterial({ color: 0x1dd1a1, wireframe: true, transparent: true, opacity: 0.15 });
  const cone = new THREE.Mesh(geometry3, material3);
  cone.position.set(0, -20, -30);
  group.add(cone);

  // Small particles
  const pGeo = new THREE.BufferGeometry();
  const pCount = 300;
  const pPos = new Float32Array(pCount * 3);
  for(let i=0; i<pCount*3; i++) {
    pPos[i] = (Math.random() - 0.5) * 120;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({ color: 0x4facfe, size: 0.4, transparent: true, opacity: 0.4 });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  let mouseX = 0;
  let mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  const animate = () => {
    requestAnimationFrame(animate);

    torus.rotation.x += 0.005;
    torus.rotation.y += 0.005;
    
    ico.rotation.x += 0.002;
    ico.rotation.y += 0.008;

    cone.rotation.x -= 0.005;
    cone.rotation.z += 0.005;

    particles.rotation.y += 0.0005;

    // Smooth camera interaction
    camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  };

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

initThreeJS();
