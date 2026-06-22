/**
 * ═══════════════════════════════════════════════════════════
 * AirType AI — Animation Engine
 * Particle effects, cursor trail, heatmap, and key
 * press visual effects rendered on a dedicated canvas.
 * ═══════════════════════════════════════════════════════════
 */

export class AnimationEngine {
  /**
   * @param {HTMLCanvasElement} vfxCanvas - Canvas for VFX (particles, trails)
   * @param {HTMLCanvasElement} heatmapCanvas - Canvas for heatmap visualization
   */
  constructor(vfxCanvas, heatmapCanvas) {
    this.vfxCanvas = vfxCanvas;
    this.vfxCtx = vfxCanvas.getContext('2d');
    this.heatmapCanvas = heatmapCanvas;
    this.heatmapCtx = heatmapCanvas.getContext('2d');

    // Particles
    this._particles = [];

    // Cursor trail
    this._trail = [];
    this._trailMaxLength = 20;

    // Heatmap data
    this._heatmapData = [];  // Array of {x, y, weight}
    this._heatmapDirty = true;
    this._heatmapEnabled = false;

    // Animation state
    this._running = false;
    this._animFrame = null;
  }

  /**
   * Start the animation loop.
   */
  start() {
    this._running = true;
    this._resizeCanvases();
    window.addEventListener('resize', () => this._resizeCanvases());
    this._tick();
  }

  /**
   * Stop the animation loop.
   */
  stop() {
    this._running = false;
    if (this._animFrame) {
      cancelAnimationFrame(this._animFrame);
    }
  }

  /**
   * Resize canvases to match their container.
   */
  _resizeCanvases() {
    const parent = this.vfxCanvas.parentElement;
    if (!parent) return;

    const w = parent.clientWidth;
    const h = parent.clientHeight;

    this.vfxCanvas.width = w;
    this.vfxCanvas.height = h;
    this.heatmapCanvas.width = w;
    this.heatmapCanvas.height = h;
  }

  /**
   * Main animation loop.
   */
  _tick() {
    if (!this._running) return;

    // Clear VFX canvas
    this.vfxCtx.clearRect(0, 0, this.vfxCanvas.width, this.vfxCanvas.height);

    // Update and draw particles
    this._updateParticles();

    // Draw cursor trail
    this._drawTrail();

    // Update heatmap if dirty
    if (this._heatmapEnabled && this._heatmapDirty) {
      this._renderHeatmap();
      this._heatmapDirty = false;
    }

    this._animFrame = requestAnimationFrame(() => this._tick());
  }

  // ═══════════════════════════════════════════════════════
  // PARTICLES
  // ═══════════════════════════════════════════════════════

  /**
   * Spawn a burst of particles at a position (for key press effects).
   * @param {number} x - X position (in canvas coords)
   * @param {number} y - Y position (in canvas coords)
   * @param {string} color - Particle color (hex or rgba)
   * @param {number} count - Number of particles
   */
  spawnParticles(x, y, color = '#6366f1', count = 12) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 1.5 + Math.random() * 3;

      this._particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,       // 1 = full life, 0 = dead
        decay: 0.02 + Math.random() * 0.02,
        size: 2 + Math.random() * 3,
        color
      });
    }
  }

  /**
   * Spawn a ring burst (for special key presses).
   * @param {number} x
   * @param {number} y
   * @param {string} color
   */
  spawnRingBurst(x, y, color = '#a855f7') {
    this._particles.push({
      x, y,
      vx: 0, vy: 0,
      life: 1,
      decay: 0.03,
      size: 5,
      color,
      isRing: true,
      ringRadius: 0,
      ringSpeed: 4
    });
  }

  /**
   * Update and draw all active particles.
   */
  _updateParticles() {
    const ctx = this.vfxCtx;

    this._particles = this._particles.filter(p => {
      p.life -= p.decay;
      if (p.life <= 0) return false;

      if (p.isRing) {
        // Ring particle: expanding circle
        p.ringRadius += p.ringSpeed;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = p.life * 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
      } else {
        // Regular particle
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.vy += 0.05; // Slight gravity

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      return true;
    });
  }

  // ═══════════════════════════════════════════════════════
  // CURSOR TRAIL
  // ═══════════════════════════════════════════════════════

  /**
   * Add a point to the cursor trail.
   * @param {number} x - Canvas X coordinate
   * @param {number} y - Canvas Y coordinate
   */
  addTrailPoint(x, y) {
    this._trail.push({ x, y, age: 0 });
    if (this._trail.length > this._trailMaxLength) {
      this._trail.shift();
    }
  }

  /**
   * Draw the cursor trail as fading circles.
   */
  _drawTrail() {
    const ctx = this.vfxCtx;

    if (this._trail.length < 2) return;

    // Draw gradient line through trail points
    for (let i = 1; i < this._trail.length; i++) {
      const p0 = this._trail[i - 1];
      const p1 = this._trail[i];
      const progress = i / this._trail.length;

      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.strokeStyle = `rgba(6, 182, 212, ${progress * 0.4})`;
      ctx.lineWidth = progress * 3;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    // Draw dots at each trail point
    this._trail.forEach((p, i) => {
      const progress = i / this._trail.length;
      const radius = progress * 4;
      const alpha = progress * 0.6;

      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99, 102, 241, ${alpha})`;
      ctx.fill();
    });

    // Fade out old points by incrementing age
    this._trail.forEach(p => p.age++);
    this._trail = this._trail.filter(p => p.age < 30);
  }

  /**
   * Clear the trail.
   */
  clearTrail() {
    this._trail = [];
  }

  // ═══════════════════════════════════════════════════════
  // HEATMAP
  // ═══════════════════════════════════════════════════════

  /**
   * Record a finger position for the heatmap.
   * @param {number} x - Normalized X (0-1)
   * @param {number} y - Normalized Y (0-1)
   */
  recordHeatmapPoint(x, y) {
    this._heatmapData.push({ x, y, weight: 1 });
    this._heatmapDirty = true;

    // Limit heatmap data size
    if (this._heatmapData.length > 5000) {
      this._heatmapData = this._heatmapData.slice(-3000);
    }
  }

  /**
   * Enable or disable heatmap rendering.
   * @param {boolean} enabled
   */
  setHeatmapEnabled(enabled) {
    this._heatmapEnabled = enabled;
    if (!enabled) {
      this.heatmapCtx.clearRect(0, 0, this.heatmapCanvas.width, this.heatmapCanvas.height);
    } else {
      this._heatmapDirty = true;
    }
  }

  /**
   * Render the heatmap as a colored density overlay.
   */
  _renderHeatmap() {
    const ctx = this.heatmapCtx;
    const w = this.heatmapCanvas.width;
    const h = this.heatmapCanvas.height;

    ctx.clearRect(0, 0, w, h);

    if (this._heatmapData.length === 0) return;

    // Draw radial gradients for each point
    this._heatmapData.forEach(point => {
      const x = point.x * w;
      const y = point.y * h;
      const radius = 30;

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, 'rgba(239, 68, 68, 0.15)');
      gradient.addColorStop(0.4, 'rgba(245, 158, 11, 0.08)');
      gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    });
  }

  /**
   * Clear all heatmap data.
   */
  clearHeatmap() {
    this._heatmapData = [];
    this._heatmapDirty = true;
    this.heatmapCtx.clearRect(0, 0, this.heatmapCanvas.width, this.heatmapCanvas.height);
  }

  /**
   * Clean up resources.
   */
  destroy() {
    this.stop();
    this._particles = [];
    this._trail = [];
    this._heatmapData = [];
  }
}
