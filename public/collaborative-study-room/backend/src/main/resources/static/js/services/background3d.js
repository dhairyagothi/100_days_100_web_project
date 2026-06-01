// 3D Constellation Parallax Particle Background Engine
// Renders dynamic, interactive 3D nodes projecting onto 2D canvas with mouse-responsive parallax.

export function initBackground3D() {
  const canvas = document.getElementById('bg-canvas-3d');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId = null;
  
  // Settings
  const PARTICLE_COUNT = 70;
  const CONNECT_DISTANCE = 110;
  const ROTATE_SPEED_X = 0.0003;
  const ROTATE_SPEED_Y = 0.0004;
  const FIELD_OF_VIEW = 250; // Focus depth

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  let centerX = width / 2;
  let centerY = height / 2;

  let particles = [];
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0, active: false };

  class Particle3D {
    constructor() {
      this.reset(true);
    }

    reset(initPhase = false) {
      // Sphere coordinate initialization
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const distance = 100 + Math.random() * 200; // Radius range

      this.x = distance * Math.sin(phi) * Math.cos(theta);
      this.y = distance * Math.sin(phi) * Math.sin(theta);
      this.z = distance * Math.cos(phi);

      // Random color variations (cyberpunk purple/neon cyan palette)
      this.color = Math.random() > 0.4 ? 'rgba(139, 92, 246, ' : 'rgba(6, 182, 212, '; // HSL purple / cyan
      this.radius = 1.2 + Math.random() * 1.8;

      if (initPhase) {
        // Distribute in time
        this.z = (Math.random() * 400) - 200;
      } else {
        // Spawn at far back
        this.z = 200;
      }
    }

    // 3D rotation transformations
    rotate(angleX, angleY) {
      // Rotate around X axis
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      let y1 = this.y * cosX - this.z * sinX;
      let z1 = this.z * cosX + this.y * sinX;

      // Rotate around Y axis
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      let x2 = this.x * cosY - z1 * sinY;
      let z2 = z1 * cosY + this.x * sinY;

      this.x = x2;
      this.y = y1;
      this.z = z2;
    }

    update(parallaxX, parallaxY) {
      // Rotate particles slightly in 3D space
      this.rotate(ROTATE_SPEED_X, ROTATE_SPEED_Y);

      // Project 3D coordinate onto 2D Canvas space with perspective
      // Z distance ranges from -200 (close) to +200 (far). Shift to positive scale.
      const scale = FIELD_OF_VIEW / (FIELD_OF_VIEW + this.z);
      
      // Calculate screen positions incorporating mouse parallax
      this.screenX = centerX + (this.x + parallaxX) * scale;
      this.screenY = centerY + (this.y + parallaxY) * scale;
      this.scale = scale;
    }

    draw() {
      if (this.z <= -FIELD_OF_VIEW) return; // Behind camera view

      const alpha = Math.min(1, Math.max(0, (1 - this.z / 200) * 0.8));
      ctx.beginPath();
      ctx.arc(this.screenX, this.screenY, this.radius * this.scale, 0, Math.PI * 2);
      ctx.fillStyle = this.color + alpha + ')';
      ctx.shadowBlur = 6 * this.scale;
      ctx.shadowColor = this.color.includes('139') ? '#8b5cf6' : '#06b6d4';
      ctx.fill();
      ctx.shadowBlur = 0; // Reset shadow for lines
    }
  }

  // Populate particle array
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle3D());
  }

  // Handle resizing
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    centerX = width / 2;
    centerY = height / 2;
  });

  // Track mouse coordinates for Parallax
  window.addEventListener('mousemove', (e) => {
    mouse.active = true;
    // Normalize coordinates around screen center (ranges -50px to 50px)
    mouse.targetX = ((e.clientX - centerX) / centerX) * 45;
    mouse.targetY = ((e.clientY - centerY) / centerY) * 45;
  });

  // Reset target on mouse leave
  window.addEventListener('mouseleave', () => {
    mouse.active = false;
    mouse.targetX = 0;
    mouse.targetY = 0;
  });

  // Smooth interpolation for mouse parallax
  let currentParallaxX = 0;
  let currentParallaxY = 0;

  function renderLoop() {
    ctx.clearRect(0, 0, width, height);

    // Dynamic grid glow background backing (extremely subtle dark gradient)
    const gradient = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, Math.max(width, height));
    gradient.addColorStop(0, '#0d0b18'); // Very deep indigo purple
    gradient.addColorStop(1, '#050409'); // Pitch black
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Smooth ease mouse coordinates
    currentParallaxX += (mouse.targetX - currentParallaxX) * 0.08;
    currentParallaxY += (mouse.targetY - currentParallaxY) * 0.08;

    // 1. Update positions
    particles.forEach(p => p.update(currentParallaxX, currentParallaxY));

    // 2. Draw connections
    ctx.lineWidth = 0.5;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];

        // Draw connections only if both are in front of screen center
        const dx = p1.screenX - p2.screenX;
        const dy = p1.screenY - p2.screenY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECT_DISTANCE) {
          // Opacity based on distance and depth
          const depthAvg = (p1.z + p2.z) / 2;
          const distFactor = (1 - dist / CONNECT_DISTANCE);
          const depthFactor = Math.min(1, Math.max(0, (1 - depthAvg / 200)));
          const alpha = distFactor * depthFactor * 0.15;

          if (alpha > 0) {
            ctx.beginPath();
            ctx.moveTo(p1.screenX, p1.screenY);
            ctx.lineTo(p2.screenX, p2.screenY);
            
            // Core line color blended between purple and cyan
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.stroke();
          }
        }
      }
    }

    // 3. Draw particles
    particles.forEach(p => p.draw());

    animationFrameId = requestAnimationFrame(renderLoop);
  }

  renderLoop();

  // Return clean up function
  return () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  };
}
