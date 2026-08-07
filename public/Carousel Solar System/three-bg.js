(function () {
  /* ─────────────────────────────────────────────────────────────────────
     Guard: wait for THREE to be available
  ───────────────────────────────────────────────────────────────────── */
  if (typeof THREE === 'undefined') {
    console.warn('[three-bg] THREE not loaded — star field skipped.');
    return;
  }

  /* ─────────────────────────────────────────────────────────────────────
     Renderer
  ───────────────────────────────────────────────────────────────────── */
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const canvas = renderer.domElement;
  canvas.id = 'three-canvas';
  Object.assign(canvas.style, {
    position : 'fixed',
    top      : '0',
    left     : '0',
    width    : '100%',
    height   : '100%',
    zIndex   : '-1',
    pointerEvents: 'none',
  });
  document.body.insertBefore(canvas, document.body.firstChild);

  /* ─────────────────────────────────────────────────────────────────────
     Scene / Camera
  ───────────────────────────────────────────────────────────────────── */
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    3000
  );
  camera.position.z = 1;

  /* ─────────────────────────────────────────────────────────────────────
     Helpers
  ───────────────────────────────────────────────────────────────────── */
  const isLight = () => document.body.classList.contains('light-theme');

  /** Radial-gradient glow texture painted on a canvas */
  function makeStarTexture(size, innerAlpha) {
    const c   = document.createElement('canvas');
    c.width   = c.height = size;
    const ctx = c.getContext('2d');
    const g   = ctx.createRadialGradient(
      size / 2, size / 2, 0,
      size / 2, size / 2, size / 2
    );
    g.addColorStop(0,   `rgba(255,255,255,${innerAlpha})`);
    g.addColorStop(0.25, 'rgba(220,235,255,0.6)');
    g.addColorStop(0.6,  'rgba(160,190,255,0.15)');
    g.addColorStop(1,    'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(c);
  }

  const texSmall = makeStarTexture(64,  1);
  const texBig   = makeStarTexture(128, 1);

  /* ─────────────────────────────────────────────────────────────────────
     Star-field factory
  ───────────────────────────────────────────────────────────────────── */
  function createStarField(count, rMin, rMax, pointSize, palette, tex) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const r     = rMin + Math.random() * (rMax - rMin);
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);

      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3]     = c[0];
      col[i * 3 + 1] = c[1];
      col[i * 3 + 2] = c[2];
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));

    const mat = new THREE.PointsMaterial({
      size          : pointSize,
      map           : tex || texSmall,
      vertexColors  : true,
      transparent   : true,
      opacity       : 1,
      blending      : THREE.AdditiveBlending,
      depthWrite    : false,
      sizeAttenuation: true,
    });

    return new THREE.Points(geo, mat);
  }

  /* ─────────────────────────────────────────────────────────────────────
     Nebula cloud factory
  ───────────────────────────────────────────────────────────────────── */
  function createNebula(hexColor, cx, cy, cz, count, spread, size, opacity) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = cx + (Math.random() - 0.5) * spread;
      pos[i * 3 + 1] = cy + (Math.random() - 0.5) * spread * 0.55;
      pos[i * 3 + 2] = cz + (Math.random() - 0.5) * spread * 0.3;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    const mat = new THREE.PointsMaterial({
      color      : hexColor,
      size,
      map        : texBig,
      transparent: true,
      opacity,
      blending   : THREE.AdditiveBlending,
      depthWrite : false,
    });
    return new THREE.Points(geo, mat);
  }

  /* ─────────────────────────────────────────────────────────────────────
     Build scene
     Mobile devices get fewer stars for performance
  ───────────────────────────────────────────────────────────────────── */
  const isMobile = window.innerWidth < 768;
  const factor   = isMobile ? 0.4 : 1;

  // Layer 1 — distant tiny stars
  const tinyStars = createStarField(
    Math.round(6000 * factor), 400, 1800, 1.4,
    [[1,1,1],[0.85,0.92,1],[1,0.95,0.88]],
    texSmall
  );

  // Layer 2 — medium stars
  const medStars = createStarField(
    Math.round(1800 * factor), 200, 900, 2.8,
    [[1,1,1],[0.75,0.88,1],[1,0.9,0.72]],
    texSmall
  );

  // Layer 3 — bright foreground stars
  const brightStars = createStarField(
    Math.round(250 * factor), 150, 600, 5.5,
    [[1,1,1],[0.88,0.96,1]],
    texBig
  );

  // Nebulae — positioned far back for atmosphere
  const nebBlue   = createNebula(0x2244cc, -350, 120, -700, Math.round(320 * factor), 420, 32, 0.04);
  const nebPurple = createNebula(0x7722bb, 420, -180, -900, Math.round(260 * factor), 370, 38, 0.032);
  const nebOrange = createNebula(0xaa3311, -120, -340, -750, Math.round(210 * factor), 320, 30, 0.028);
  const nebCyan   = createNebula(0x115577, 260, 320, -550, Math.round(190 * factor), 290, 26, 0.036);

  scene.add(tinyStars, medStars, brightStars, nebBlue, nebPurple, nebOrange, nebCyan);

  /* ─────────────────────────────────────────────────────────────────────
     Theme management
  ───────────────────────────────────────────────────────────────────── */
  const DARK_CONFIG = {
    clearColor     : 0x020412,
    tinyOpacity    : 1.0,
    medOpacity     : 1.0,
    brightOpacity  : 1.0,
    nebulaMultiplier: 1.0,
  };

  const LIGHT_CONFIG = {
    clearColor     : 0xdfe8ff,
    tinyOpacity    : 0.12,
    medOpacity     : 0.18,
    brightOpacity  : 0.22,
    nebulaMultiplier: 0.3,
  };

  const nebulaBaseOpacities = [0.04, 0.032, 0.028, 0.036];
  const nebulae = [nebBlue, nebPurple, nebOrange, nebCyan];

  function applyTheme() {
    const cfg = isLight() ? LIGHT_CONFIG : DARK_CONFIG;
    renderer.setClearColor(cfg.clearColor, 1);
    tinyStars.material.opacity   = cfg.tinyOpacity;
    medStars.material.opacity    = cfg.medOpacity;
    brightStars.material.opacity = cfg.brightOpacity;
    nebulae.forEach((n, i) => {
      n.material.opacity = nebulaBaseOpacities[i] * cfg.nebulaMultiplier;
    });
  }

  new MutationObserver(applyTheme).observe(document.body, {
    attributes    : true,
    attributeFilter: ['class'],
  });
  applyTheme();

  /* ─────────────────────────────────────────────────────────────────────
     Mouse parallax  (disabled on touch devices)
  ───────────────────────────────────────────────────────────────────── */
  let targetX = 0, targetY = 0;
  if (!isMobile) {
    document.addEventListener('mousemove', (e) => {
      targetX =  (e.clientX / window.innerWidth  - 0.5) * 0.6;
      targetY =  (e.clientY / window.innerHeight - 0.5) * 0.4;
    });
  }

  /* ─────────────────────────────────────────────────────────────────────
     Resize
  ───────────────────────────────────────────────────────────────────── */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* ─────────────────────────────────────────────────────────────────────
     Animate
  ───────────────────────────────────────────────────────────────────── */
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Slow drift of the whole starfield
    scene.rotation.y = t * 0.012;
    scene.rotation.x = Math.sin(t * 0.007) * 0.04;

    // Subtle twinkle on bright stars
    brightStars.material.opacity = isLight()
      ? 0.18 + Math.abs(Math.sin(t * 1.8)) * 0.08
      : 0.80 + Math.abs(Math.sin(t * 1.8)) * 0.20;

    // Gentle nebula pulse
    nebulae.forEach((n, i) => {
      const base = nebulaBaseOpacities[i] * (isLight() ? 0.3 : 1.0);
      n.material.opacity = base + Math.sin(t * 0.4 + i) * base * 0.2;
    });

    // Smooth camera parallax follow
    camera.position.x += (targetX  - camera.position.x) * 0.025;
    camera.position.y += (-targetY - camera.position.y) * 0.025;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();
})();
