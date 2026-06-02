const canvas = document.getElementById('webgl-canvas');

// Scene Setup
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050505, 0.015);

// Camera Setup
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 15, 30);
camera.lookAt(0, 0, -20);

// Renderer Setup
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Lighting
const ambientLight = new THREE.AmbientLight(0x222222);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight.position.set(100, 100, 50);
scene.add(dirLight);

const pointLight1 = new THREE.PointLight(0xff2a6d, 2.5, 100);
pointLight1.position.set(20, 10, 0);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x01a2d9, 2.5, 100);
pointLight2.position.set(-20, 10, -20);
scene.add(pointLight2);

// Terrain Geometry
const width = 140;
const height = 140;
const segments = 100;
const geometry = new THREE.PlaneGeometry(width, height, segments, segments);
geometry.rotateX(-Math.PI / 2);

// Themes
const themes = {
  synthwave: {
    color: 0x111122,
    wireframe: false,
    light1: 0xff2a6d,
    light2: 0x01a2d9,
    fog: 0x050505,
    accent: '#ff2a6d'
  },
  desert: {
    color: 0xc2a47c,
    wireframe: false,
    light1: 0xffaa00,
    light2: 0x442200,
    fog: 0x8b5a2b,
    accent: '#ffaa00'
  },
  neon: {
    color: 0x000000,
    wireframe: true,
    light1: 0x00ff00,
    light2: 0xff00ff,
    fog: 0x000000,
    accent: '#00ff00'
  }
};

// Material
const material = new THREE.MeshStandardMaterial({
  color: themes.synthwave.color,
  roughness: 0.7,
  metalness: 0.3,
  wireframe: themes.synthwave.wireframe,
  flatShading: true
});

const terrain = new THREE.Mesh(geometry, material);
// Move terrain a bit forward so it covers the camera view fully
terrain.position.z = -20;
scene.add(terrain);

// Simplex Noise
const simplex = new SimplexNoise();

// Animation Variables
let time = 0;
const vertices = geometry.attributes.position;
const initialZ = [];
for (let i = 0; i < vertices.count; i++) {
  initialZ.push(vertices.getZ(i));
}

// UI Controls
const speedInput = document.getElementById('speed');
const roughnessInput = document.getElementById('roughness');
const wireframeInput = document.getElementById('wireframe');
const themeInput = document.getElementById('color-theme');

wireframeInput.addEventListener('change', (e) => {
  material.wireframe = e.target.checked;
});

themeInput.addEventListener('change', (e) => {
  const t = themes[e.target.value];
  material.color.setHex(t.color);
  if (!wireframeInput.checked) {
    material.wireframe = t.wireframe;
  } else {
      material.wireframe = true;
  }
  pointLight1.color.setHex(t.light1);
  pointLight2.color.setHex(t.light2);
  scene.fog.color.setHex(t.fog);
  document.body.style.backgroundColor = '#' + t.fog.toString(16).padStart(6, '0');
  document.documentElement.style.setProperty('--accent', t.accent);
});

// Resize Handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Render Loop
function animate() {
  requestAnimationFrame(animate);

  const speed = parseFloat(speedInput.value);
  const roughness = parseFloat(roughnessInput.value);
  
  time -= speed * 0.01;

  // Update vertices based on noise
  for (let i = 0; i < vertices.count; i++) {
    const x = vertices.getX(i);
    // original local Z coordinate
    const z = initialZ[i];
    
    // Multi-octave noise for rich terrain
    let y = 0;
    y += simplex.noise2D(x * 0.05, (z + time * 10) * 0.05) * 6 * roughness;
    y += simplex.noise2D(x * 0.1, (z + time * 10) * 0.1) * 2 * roughness;
    y += simplex.noise2D(x * 0.2, (z + time * 10) * 0.2) * 0.5 * roughness;
    
    vertices.setY(i, y);
  }
  
  vertices.needsUpdate = true;
  geometry.computeVertexNormals();

  renderer.render(scene, camera);
}

animate();
