// app.js — main application logic (ES module)
const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');
const video = document.getElementById('video');
const gestureLabel = document.getElementById('gesture');
const trackingToggle = document.getElementById('trackingToggle');
const instructionsNavItem = document.getElementById('instructionsNavItem');

let DPR = Math.max(1, window.devicePixelRatio || 1);
let width = 1280, height = 720;
let PARTICLE_COUNT = 3200; // default
let particles = [];

function resize(){
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = w * DPR;
  canvas.height = h * DPR;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.setTransform(DPR,0,0,DPR,0,0);
  
  width = w;
  height = h;
  
  // Update particles targetRadius responsively
  const scale = Math.max(0.5, Math.min(width / 1280, 1.2));
  for (const p of particles) {
    if (p.baseTargetRadius) {
      if (p.type === 'ring') {
        p.targetRadius = p.baseTargetRadius * scale;
      } else {
        p.targetRadius = p.baseTargetRadius;
      }
    }
  }
}
window.addEventListener('resize', resize);
resize();

// ---------------- Starfield ----------------
class Star{
  constructor(w,h){
    this.reset(w,h);
  }
  reset(w,h){
    this.x = Math.random()*w;
    this.y = Math.random()*h;
    this.depth = Math.random();
    this.size = 0.5 + this.depth * 0.8; // smaller: 0.5-1.3px
    this.opacity = 0.2 + 0.3*this.depth; // dimmer: 0.2-0.5
    this.speed = 0.02 + 0.1*this.depth;
  }
  update(h){
    this.y += this.speed;
    if(this.y > h + 2) {
      this.y = -2;
      this.x = Math.random() * (canvas.width / DPR);
    }
  }
  draw(ctx){
    ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

const STAR_COUNT = 400; // maximum background stars for dense starfield
let stars = [];
let staticStars = [];
function initStars(){
  stars = [];
  staticStars = [];
  // Generate stars over an extended area using CSS pixels for consistency
  const cssW = canvas.width / DPR;
  const cssH = canvas.height / DPR;
  const maxW = Math.max(2560, cssW);
  const maxH = Math.max(1440, cssH);
  for(let i=0;i<STAR_COUNT;i++) stars.push(new Star(maxW, maxH));
  for(let i=0;i<800;i++) {
    staticStars.push({
      x: Math.random() * maxW,
      y: Math.random() * maxH,
      size: Math.random() * 1.4 + 0.4, // Making them slightly thicker
      alpha: Math.random() * 0.5 + 0.1
    });
  }
}

// ---------------- Particles ----------------
class Particle{
  constructor(cx,cy,type){
    this.type = type; // 'core' or 'ring'
    this.reset(cx,cy);
  }
  reset(cx,cy){
    // initial random polar/pos parameters
    this.angle = Math.random() * Math.PI*2;
    // shrink particles to star-like size (0.3-0.8px)
    this.size = (this.type === 'ring') ? (0.3 + Math.random()*0.4) : (0.4 + Math.random()*0.5);
    this.color = this.pickColor(this.type !== 'ring');
    this.radius = (this.type === 'ring') ? (120 + Math.random()*160) : (Math.random()*36);
    // scattered starting positions (may be overridden in initParticles)
    this.px = cx + (Math.random()-0.5)*this.radius*4;
    this.py = cy + (Math.random()-0.5)*this.radius*4;
    this.vx = (Math.random()-0.5)*(this.type === 'ring' ? 0.8 : 1.6);
    this.vy = (Math.random()-0.5)*(this.type === 'ring' ? 0.8 : 1.6);
    this.ax = 0; this.ay = 0;
    // Perlin-like noise for smooth Brownian motion
    this.noiseX = Math.random(); this.noiseY = Math.random();
    this.state = 'scatter';
    this.targetRadius = this.radius;
    this.stagger = 0; // set by initializer for wave-like convergence
    this.orbitalSpeed = (this.type === 'ring') ? (0.008 + Math.random()*0.04) : (0.016 + Math.random()*0.08);
    this.prevMode = 'scatter'; // track mode change for scatter impulse
  }
  pickColor(core=false){
    // Futuristic neon cyan/blue palette with subtle variations
    const r = Math.floor(20 + Math.random()*40);
    const g = Math.floor(180 + Math.random()*75);
    const b = Math.floor(240 + Math.random()*15);
    
    // Sometimes inject an accent purple/pink particle for professional visual depth
    if (Math.random() > 0.92) {
      return { rgb: `${Math.floor(180+Math.random()*50)}, 60, ${Math.floor(220+Math.random()*35)}`, alpha: 0.9 };
    }
    
    // add a tiny depth variation
    const alpha = core ? 0.95 : (0.5 + Math.random()*0.5);
    return { rgb: `${r},${g},${b}`, alpha };
  }
  update(cx,cy,mode){
    this.angle += this.orbitalSpeed;
    const isConverging = (mode === 'converge');
    // detect mode change (converge->scatter) to add scatter impulse
    const modeChanged = (this.prevMode === 'converge' && !isConverging);
    this.prevMode = mode;
    
    if(this.type === 'ring'){
      const targetRadius = this.targetRadius || this.radius;
      const targetX = cx + Math.cos(this.angle) * targetRadius;
      const targetY = cy + Math.sin(this.angle) * targetRadius * 0.35; // Heavily tilted Saturn rings
      
      if(isConverging){
        // gravity-like pull: QUICK convergence
        const dx = targetX - this.px;
        const dy = targetY - this.py;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const pull = Math.min(dist * 0.18, 5.0); // much stronger pull
        this.vx += (dx / (dist+1)) * pull;
        this.vy += (dy / (dist+1)) * pull;
        this.vx *= 0.80; // snap into place
        this.vy *= 0.80;
      } else {
        // scatter: organic Brownian motion with inertia and smoothed noise
        // smooth noise approximates Perlin-like curves for natural feel
        this.noiseX += (Math.random()-0.5) * 0.05;
        this.noiseY += (Math.random()-0.5) * 0.05;
        this.noiseX = Math.max(-1, Math.min(1, this.noiseX));
        this.noiseY = Math.max(-1, Math.min(1, this.noiseY));
        this.vx += this.noiseX * 0.012;
        this.vy += this.noiseY * 0.012;
        // lighter damping for ongoing drift
        this.vx *= 0.96;
        this.vy *= 0.96;
        // impulse on mode change (fist release): EXTREME scatter speed
        if(modeChanged){
          this.vx += (Math.random()-0.5) * 18.0; // 12.0 → 18.0
          this.vy += (Math.random()-0.5) * 18.0;
        }
      }
      this.px += this.vx;
      this.py += this.vy;
    } else {
      // core particles: similar physics but tighter orbital targets
      const targetRadius = this.targetRadius || (this.radius * 0.25);
      // sphere-like projection for core: somewhat flatter to match tilt but fatter than rings
      const targetX = cx + Math.cos(this.angle) * targetRadius;
      const targetY = cy + Math.sin(this.angle) * targetRadius * 0.8;
      
      if(isConverging){
        // gravity-like convergence for core: QUICK convergence
        const dx = targetX - this.px;
        const dy = targetY - this.py;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const pull = Math.min(dist * 0.20, 6.0); 
        this.vx += (dx / (dist+1)) * pull;
        this.vy += (dy / (dist+1)) * pull;
        this.vx *= 0.78; // sharp stop
        this.vy *= 0.78;
      } else {
        // scatter: smoothed noise (slightly more aggressive than rings)
        this.noiseX += (Math.random()-0.5) * 0.06;
        this.noiseY += (Math.random()-0.5) * 0.06;
        this.noiseX = Math.max(-1, Math.min(1, this.noiseX));
        this.noiseY = Math.max(-1, Math.min(1, this.noiseY));
        this.vx += this.noiseX * 0.016;
        this.vy += this.noiseY * 0.016;
        this.vx *= 0.94;
        this.vy *= 0.94;
        if(modeChanged){
          this.vx += (Math.random()-0.5) * 18.0; // 14.0 → 18.0
          this.vy += (Math.random()-0.5) * 18.0;
        }
      }
      this.px += this.vx;
      this.py += this.vy;
    }
  }
  draw(ctx){
    // minimal glow for star-like particles
    const glowRadius = this.size * 4;
    const grad = ctx.createRadialGradient(this.px, this.py, 0, this.px, this.py, glowRadius);
    grad.addColorStop(0, `rgba(${this.color.rgb},${Math.min(1, this.color.alpha * 1.1)})`);
    grad.addColorStop(0.5, `rgba(${this.color.rgb},${this.color.alpha * 0.3})`);
    grad.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.beginPath();
    ctx.fillStyle = grad;
    ctx.arc(this.px, this.py, glowRadius, 0, Math.PI*2);
    ctx.fill();

    // tiny bright core for star-like appearance
    ctx.beginPath();
    ctx.fillStyle = `rgba(${this.color.rgb},${Math.min(1, this.color.alpha * 1.2)})`;
    ctx.arc(this.px, this.py, Math.max(0.5, this.size * 0.8), 0, Math.PI*2);
    ctx.fill();
  }
}

function initParticles(){
  particles = [];
  const w = canvas.width/DPR; const h = canvas.height/DPR;
  const cx = w/2, cy = h/2;
  const coreCount = Math.floor(PARTICLE_COUNT*0.35); // reduce core ratio
  for(let i=0;i<PARTICLE_COUNT;i++){
    const type = (i < coreCount) ? 'core' : 'ring';
    const p = new Particle(cx,cy,type);
    // scatter across viewport
    p.px = Math.random() * w;
    p.py = Math.random() * h;
    
    // target orbit radius: Saturn-like structure with distinct rings
    if(type === 'ring'){
      const ringIndex = i - coreCount; // index within ring particles
      const totalRings = PARTICLE_COUNT - coreCount;
      const ringRatio = ringIndex / totalRings;
      
      // Create three ring zones: inner minor, major, outer minor
      let targetRad;
      if(ringRatio < 0.25){
        // Inner minor ring
        targetRad = 150 + Math.random() * 80;
      } else if(ringRatio < 0.75){
        // Major ring band (most particles here)
        targetRad = 260 + Math.random() * 180;
      } else {
        // Outer minor ring
        targetRad = 480 + Math.random() * 100;
      }
      p.baseTargetRadius = targetRad;
      p.targetRadius = targetRad * Math.max(0.5, Math.min(width/1280, 1.2));
    } else {
      // compact solid core
      p.baseTargetRadius = 20 + Math.pow(Math.random(), 0.6) * 140;
      p.targetRadius = p.baseTargetRadius;
    }
    p.stagger = (i % 300) / 300; // 0..~1
    particles.push(p);
  }
}

// --------------- Visual Effects & Objects ---------------
class Shockwave {
  constructor(x, y, type) {
    this.x = x; this.y = y;
    this.type = type;
    this.radius = type === 'explode' ? 10 : Math.max(canvas.width, canvas.height) * 0.8;
    this.life = 1.0;
  }
  update() {
    if (this.type === 'explode') {
      this.radius += 40;
    } else {
      this.radius -= 60; // converge faster
      if(this.radius < 10) this.life = 0;
    }
    this.life -= 0.02;
  }
  draw(ctx) {
    if (this.life <= 0) return;
    ctx.beginPath();
    ctx.strokeStyle = `rgba(80, 200, 255, ${Math.max(0, this.life * 0.5)})`;
    ctx.lineWidth = 4 + (1 - this.life) * 10;
    ctx.arc(this.x, this.y, Math.max(0, this.radius), 0, Math.PI*2);
    ctx.stroke();
  }
}
let shockwaves = [];

// --------------- Single Hand Global States ---------------
let hand1 = {x: canvas.width/2/DPR, y: canvas.height/2/DPR, gesture:'open', confidence:0, prevX: 0, prevY: 0, size: 0.15};

let zoomFactor = 1.0;
let userRotationSpeed = 0.003;
let chargeTimer = 0;
let mode = 'scatter';
// rotation state

function setGesture1(g){
  if(hand1.gesture !== g){
    // Explode if dropped ThumbsUp into Open
    if(g === 'open' && (hand1.gesture === 'fist' || hand1.gesture === 'thumbs_up')) {
      shockwaves.push(new Shockwave(canvas.width/DPR/2, canvas.height/DPR/2, 'explode'));
    }
    hand1.gesture = g;
    if(gestureLabel) gestureLabel.textContent = g;
  }
}

function landmarksToCentroid(landmarks){
  let x=0,y=0;
  for(const p of landmarks){x+=p.x; y+=p.y}
  x/=landmarks.length; y/=landmarks.length;
  // convert camera space (0..1) to canvas coordinates (flipped horizontally)
  const cx = canvas.width/DPR - x*canvas.width/DPR;
  const cy = y*canvas.height/DPR;
  return {x: cx, y: cy};
}

// MediaPipe Hands setup
let hands = null;
let cameraFeed = null;

async function setupMediaPipe(){
  if (typeof window.Hands !== 'function' || typeof window.Camera !== 'function') {
    console.error('MediaPipe Hands or Camera failed to load.');
    if (gestureLabel) gestureLabel.textContent = 'tracking unavailable';
    trackingToggle.checked = false;
    return false;
  }
  try {
    hands = new window.Hands({locateFile: (f)=> `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`});
    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.65,
      minTrackingConfidence: 0.6
    });
    hands.onResults(onResults);

    cameraFeed = new window.Camera(video, {
      onFrame: async () => {
        if(trackingToggle.checked && hands) await hands.send({image: video});
      },
      width: 640,
      height: 480
    });
    await cameraFeed.start();
    return true;
  } catch (error) {
    console.error('Failed to initialize MediaPipe Hands.', error);
    hands = null;
    cameraFeed = null;
    if(gestureLabel) gestureLabel.textContent = 'tracking unavailable';
    trackingToggle.checked = false;
    return false;
  }
}

function classifyHand(landmarks) {
  const fingerIndices = [8,12,16,20];
  const pipIndices = [6,10,14,18];
  let fingersExt = 0;
  for(let i=0;i<4;i++) {
    // Check if finger tip is significantly higher than pip joint
    if (landmarks[fingerIndices[i]].y < landmarks[pipIndices[i]].y) {
      fingersExt++;
    }
  }
  
  // Refined Thumbs UP check:
  // 1. Thumb tip is vertically higher than thumb IP joint
  // 2. Thumb tip is distinctly higher than index knuckle (5)
  // 3. Other fingers must be strictly folded (fingersExt === 0)
  const thumbTipY = landmarks[4].y;
  const thumbIpY = landmarks[3].y;
  const indexBaseY = landmarks[5].y;
  
  const handSize = Math.hypot(landmarks[0].x - landmarks[9].x, landmarks[0].y - landmarks[9].y);
  // Thumb tip should be higher than its own joint by some margin
  const isThumbPointingUp = (thumbIpY - thumbTipY) > (handSize * 0.1); 
  const isThumbAboveIndex = (indexBaseY - thumbTipY) > (handSize * 0.15); // clear separation
  
  const thumbUp = isThumbPointingUp && isThumbAboveIndex && fingersExt === 0;
  
  if (fingersExt >= 3) return 'open';
  if (thumbUp) return 'thumbs_up';
  
  // Ensure we don't return 'fist' if no fingers are explicitly detected but the hand is very relaxed/pointing down
  // Fallback map everything else to fist for simplicity, but thumbs up takes precedence only when clearly separated.
  return 'fist';
}

function onResults(results){
  if(!results.multiHandLandmarks || results.multiHandLandmarks.length===0){
    hand1.confidence = 0;
    setGesture1('none');
    return;
  }

  const lm1 = results.multiHandLandmarks[0];
  const c1 = landmarksToCentroid(lm1);
  hand1.prevX = hand1.x; hand1.prevY = hand1.y;
  hand1.x = c1.x; hand1.y = c1.y; hand1.confidence = 1;
  
  // Hand distance computation using bounding box roughly (Wrist to Middle Finger base dist)
  hand1.size = Math.hypot(lm1[0].x - lm1[9].x, lm1[0].y - lm1[9].y);
  
  setGesture1(classifyHand(lm1));
}

// --------------- Animation Loop & Rendering ---------------
let lastTime = performance.now();

function updatePhysicsAndDraw(dt){
  // clear
  ctx.clearRect(0,0,canvas.width/DPR, canvas.height/DPR);

  // Smooth zoom based on hand size
  const targetZoom = hand1.confidence ? Math.max(0.4, Math.min(hand1.size * 5.0, 3.5)) : 1.0;
  zoomFactor += (targetZoom - zoomFactor) * 0.1;

  // Render background stars BEFORE applying zoom so space is infinite
  for(const ss of staticStars){
    ctx.fillStyle = `rgba(255,255,255,${ss.alpha})`;
    ctx.fillRect(ss.x, ss.y, ss.size, ss.size);
  }
  for(const s of stars){ s.update(canvas.height/DPR); s.draw(ctx); }

  // Apply zoom transformation around center for planet particles & shockwaves ONLY
  ctx.save();
  const cx = canvas.width/DPR/2;
  const cy = canvas.height/DPR/2;
  ctx.translate(cx, cy);
  ctx.scale(zoomFactor, zoomFactor);
  ctx.translate(-cx, -cy);

  // draw shockwaves
  for (let i = shockwaves.length - 1; i >= 0; i--) {
    shockwaves[i].update();
    shockwaves[i].draw(ctx);
    if (shockwaves[i].life <= 0) shockwaves.splice(i, 1);
  }

  let dx = 0;
  if(hand1.confidence) dx = hand1.x - hand1.prevX;

  // mode selection & logic
  if (hand1.gesture === 'open' || !hand1.confidence) {
     mode = 'scatter';
     chargeTimer = 0;
     userRotationSpeed = userRotationSpeed * 0.95 + 0.003 * 0.05;
  } else if (hand1.gesture === 'fist') {
     mode = 'converge';
     chargeTimer = Math.max(0, chargeTimer - dt); // cool down gracefully
     userRotationSpeed -= dx * 0.0005; // X movement maps to rotation speed
     userRotationSpeed *= 0.95; // friction
  } else if (hand1.gesture === 'thumbs_up') {
     mode = 'converge';
     chargeTimer += dt;
     userRotationSpeed -= dx * 0.0005;
     userRotationSpeed *= 0.95;
     
     if (chargeTimer > 3500) { // boom after 3.5s
       mode = 'scatter';
       shockwaves.push(new Shockwave(cx, cy, 'explode'));
       for(const p of particles) {
         p.vx += (Math.random() - 0.5) * 120; // massive blast
         p.vy += (Math.random() - 0.5) * 120;
       }
       chargeTimer = -1500; // 1.5s cooldown before charging again
       setGesture1('open'); // temporary override to reset gesture state
     }
  }

  // increment rotation

  // Draw charge glow gradient (Yellow -> Red) inside planet
  if (chargeTimer > 0) {
    ctx.beginPath();
    let glowRad = 150 + Math.sin(Date.now() / 50) * 35; // aggressive pulse
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRad);
    const progress = Math.min(chargeTimer / 3500, 1.0);
    const r = 255;
    const g = Math.floor(200 * (1 - progress)); // Yellow (255,200,0) drops to Red (255,0,0)
    
    grd.addColorStop(0, `rgba(${r}, ${g}, 0, ${progress * 0.9})`);
    grd.addColorStop(0.5, `rgba(${r}, ${g}, 0, ${progress * 0.4})`);
    grd.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grd;
    ctx.globalCompositeOperation = 'lighter';
    ctx.arc(cx, cy, glowRad, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }

  // Update particles (stay stationary relative to screen center)
  for(const p of particles){
    if(mode === 'converge'){
      p.angle += userRotationSpeed * (p.type==='core' ? 1.5 : 1);
    }
    p.update(cx,cy, mode === 'converge' ? 'converge' : 'scatter');
  }

  // draw particles
  ctx.globalCompositeOperation = 'lighter';
  for(const p of particles){ p.draw(ctx); }
  ctx.globalCompositeOperation = 'source-over';

  // small UI overlay: crosshair centered
  ctx.beginPath(); ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1;
  ctx.arc(cx,cy,6,0,Math.PI*2); ctx.stroke();
  
  ctx.restore(); // Restore zoom scale/translate
}

function loop(now){
  const dt = Math.min(50, now - lastTime);
  lastTime = now;
  // update star positions occasionally when resized
  if(stars.length === 0) initStars();
  updatePhysicsAndDraw(dt);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// --------------- UI & Controls ---------------
trackingToggle.addEventListener('change', ()=>{
  if(trackingToggle.checked){
    if(!hands) {
      setupMediaPipe().catch(err => {
        console.error('Failed to setup MediaPipe on toggle', err);
      });
    }
  } else {
    setGesture1('none');
  }
});

if (instructionsNavItem) {
  instructionsNavItem.addEventListener('click', (e) => {
    // On desktop: toggle active dropdown
    // On mobile: handled by accordion (clicks inside panel are fine)
    if (window.innerWidth > 768) {
      if (e.target.closest('#instructionsDropdown')) return;
      instructionsNavItem.classList.toggle('active');
    }
  });
}

// Close instructions dropdown if clicked outside (desktop only)
window.addEventListener('click', (e) => {
  if (window.innerWidth > 768 && instructionsNavItem && !instructionsNavItem.contains(e.target)) {
    instructionsNavItem.classList.remove('active');
  }
});

// --------------- Mobile Hamburger Menu ---------------
const mobileMenuBtn   = document.getElementById('mobileMenuBtn');
const navMenu         = document.getElementById('navMenu');
const mobileOverlay   = document.getElementById('mobileOverlay');
const mobilePanelClose = document.getElementById('mobilePanelClose');

function openMobileMenu() {
  navMenu.classList.add('mobile-open');
  mobileMenuBtn.classList.add('open');
  mobileMenuBtn.setAttribute('aria-expanded', 'true');
  mobileOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  navMenu.classList.remove('mobile-open');
  mobileMenuBtn.classList.remove('open');
  mobileMenuBtn.setAttribute('aria-expanded', 'false');
  mobileOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navMenu.classList.contains('mobile-open') ? closeMobileMenu() : openMobileMenu();
  });
}

if (mobilePanelClose) {
  mobilePanelClose.addEventListener('click', closeMobileMenu);
}

if (mobileOverlay) {
  mobileOverlay.addEventListener('click', closeMobileMenu);
}

// Close mobile menu on resize back to desktop
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) closeMobileMenu();
});

window.addEventListener('keydown', (e)=>{
  if(e.key.toLowerCase() === 't') {
    trackingToggle.checked = !trackingToggle.checked;
    trackingToggle.dispatchEvent(new Event('change'));
  }
  if(e.key.toLowerCase() === 'i') {
    if (instructionsNavItem) {
      instructionsNavItem.classList.toggle('active');
    }
  }
  if(e.key === 'Escape') {
    closeMobileMenu();
  }
});

// --------------- Initialization ---------------
(function init(){
  // pick particle count heuristic for mobile
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  if(isMobile) PARTICLE_COUNT = 1800; else PARTICLE_COUNT = 4800;
  initParticles();
  initStars();
  // start mediapipe camera
  if(trackingToggle.checked) setupMediaPipe().catch(err=>{
    console.warn('MediaPipe init failed', err);
    trackingToggle.checked = false;
  });
})();

// Expose some functions for debugging
window.__Aevai = { particles, stars, reset: ()=>{initParticles(); initStars();} };
