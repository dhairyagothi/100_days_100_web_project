/* ============================================================
   NEOTRETIS — particles.js
   Hardware-accelerated 2D canvas particle system.
   Automatically injects an overlay canvas over the board.
   ============================================================ */

export class ParticleManager {
  /**
   * @param {HTMLElement} boardEl  The #tetris-board DOM element
   */
  constructor(boardEl) {
    this._boardEl = boardEl;
    this._canvas = document.createElement('canvas');
    this._canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:5;';
    
    // Append inside board so it aligns perfectly with the cells
    this._boardEl.appendChild(this._canvas);
    this._ctx = this._canvas.getContext('2d');
    
    this._particles = [];
    this._animating = false;

    // Handle high DPI displays
    this._resize();
    window.addEventListener('resize', () => this._resize());
    
    this._tick = this._tick.bind(this);
  }

  _resize() {
    const rect = this._boardEl.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this._canvas.width = rect.width * dpr;
    this._canvas.height = rect.height * dpr;
    this._ctx.scale(dpr, dpr);
    this._width = rect.width;
    this._height = rect.height;
  }

  /**
   * Sparks burst when a piece hard-drops onto the stack.
   * @param {number} row    Landed grid row (0-19)
   * @param {number} col    Landed grid col (0-9)
   * @param {string} color  CSS color of the landing piece
   */
  addSparks(row, col, color = '#00f5ff') {
    this._resize(); // Ensure fresh dimensions
    const cellW = this._width / 10;
    const cellH = this._height / 20;
    const startX = (col + 0.5) * cellW;
    const startY = (row + 0.5) * cellH;

    // Generate sparks
    const count = 16 + Math.floor(Math.random() * 8);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3.5;
      this._particles.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.0, // slight upward bias
        size: 2 + Math.random() * 3,
        alpha: 1.0,
        decay: 0.03 + Math.random() * 0.04,
        color: color,
        gravity: 0.08,
      });
    }
    this._start();
  }

  /**
   * Bright row collapse explosion of sparks.
   * @param {number} row    Grid row index (0-19)
   * @param {string} color  Primary clear color
   */
  addLineExplosion(row, color = '#ff00ff') {
    this._resize();
    const cellH = this._height / 20;
    const startY = (row + 0.5) * cellH;

    // Generate particles across the entire width of the row
    const count = 40;
    for (let i = 0; i < count; i++) {
      const startX = (i / count) * this._width;
      const vy = (Math.random() - 0.5) * 4;
      const vx = (Math.random() - 0.5) * 2;
      this._particles.push({
        x: startX,
        y: startY,
        vx: vx,
        vy: vy,
        size: 3 + Math.random() * 4,
        alpha: 1.0,
        decay: 0.02 + Math.random() * 0.03,
        color: color,
        gravity: 0.02,
      });
    }
    this._start();
  }

  /**
   * Confetti drops cascading down from the top.
   */
  addConfetti() {
    this._resize();
    const colors = ['#00f5ff', '#ff00ff', '#ffcc00', '#00ff66', '#ff3366', '#7b2fff'];
    const count = 50 + Math.floor(Math.random() * 30);
    for (let i = 0; i < count; i++) {
      this._particles.push({
        x: Math.random() * this._width,
        y: -10 - Math.random() * 30,
        vx: (Math.random() - 0.5) * 3,
        vy: 1.5 + Math.random() * 3.0,
        size: 4 + Math.random() * 5,
        alpha: 1.0,
        decay: 0.008 + Math.random() * 0.008,
        color: colors[Math.floor(Math.random() * colors.length)],
        gravity: 0.04,
        confetti: true,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2,
      });
    }
    this._start();
  }

  _start() {
    if (!this._animating) {
      this._animating = true;
      requestAnimationFrame(this._tick);
    }
  }

  _tick() {
    if (this._particles.length === 0) {
      this._ctx.clearRect(0, 0, this._width, this._height);
      this._animating = false;
      return;
    }

    this._ctx.clearRect(0, 0, this._width, this._height);

    for (let i = 0; i < this._particles.length; i++) {
      const p = this._particles[i];

      // Update position
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.alpha -= p.decay;

      // Draw particle
      this._ctx.save();
      this._ctx.globalAlpha = Math.max(0, p.alpha);
      this._ctx.fillStyle = p.color;
      this._ctx.shadowBlur = p.confetti ? 0 : 8;
      this._ctx.shadowColor = p.color;

      if (p.confetti) {
        p.rotation += p.rotSpeed;
        this._ctx.translate(p.x, p.y);
        this._ctx.rotate(p.rotation);
        // Draw flat rectangular confetti piece
        this._ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        // Draw circular spark particle
        this._ctx.beginPath();
        this._ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this._ctx.fill();
      }
      this._ctx.restore();

      // Remove dead particles
      if (p.alpha <= 0 || p.y > this._height + 20 || p.x < -20 || p.x > this._width + 20) {
        this._particles.splice(i, 1);
        i--;
      }
    }

    if (this._animating) {
      requestAnimationFrame(this._tick);
    }
  }
}
