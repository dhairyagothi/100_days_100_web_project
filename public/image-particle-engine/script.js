const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const hiddenCanvas = document.getElementById('hiddenCanvas');
const hctx = hiddenCanvas.getContext('2d', { willReadFrequently: true });

// Controls
const imageUpload = document.getElementById('imageUpload');
const resolutionInput = document.getElementById('resolution');
const radiusInput = document.getElementById('radius');
const mouseRadiusInput = document.getElementById('mouseRadius');
const explodeBtn = document.getElementById('explodeBtn');
const resetBtn = document.getElementById('resetBtn');
const saveBtn = document.getElementById('saveBtn');
const overlay = document.getElementById('overlay');
const toast = document.getElementById('toast');
const presetBtns = document.querySelectorAll('.preset-btn');

// Value tags
const resolutionVal = document.getElementById('resolutionVal');
const radiusVal = document.getElementById('radiusVal');
const mouseRadiusVal = document.getElementById('mouseRadiusVal');

canvas.width = window.innerWidth - 320; // Accounting for sidebar
canvas.height = window.innerHeight;

class Particle {
    constructor(effect, x, y, color) {
        this.effect = effect;
        this.x = Math.random() * this.effect.canvasWidth;
        this.y = Math.random() * this.effect.canvasHeight;
        this.originX = x;
        this.originY = y;
        this.color = color;
        this.size = this.effect.particleRadius;

        // Physics
        this.dx = 0;
        this.dy = 0;
        this.vx = 0;
        this.vy = 0;
        this.force = 0;
        this.angle = 0;
        this.distance = 0;
        this.friction = 0.95;
        this.ease = 0.1;
    }

    draw() {
        this.effect.context.fillStyle = this.color;
        this.effect.context.beginPath();
        this.effect.context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.effect.context.fill();
    }

    update() {
        this.dx = this.effect.mouse.x - this.x;
        this.dy = this.effect.mouse.y - this.y;
        this.distance = this.dx * this.dx + this.dy * this.dy;
        this.force = -this.effect.mouse.radius / this.distance;

        if (this.distance < this.effect.mouse.radius) {
            this.angle = Math.atan2(this.dy, this.dx);
            this.vx += this.force * Math.cos(this.angle);
            this.vy += this.force * Math.sin(this.angle);
        }

        this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
        this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
    }

    explode() {
        this.vx = (Math.random() - 0.5) * 50;
        this.vy = (Math.random() - 0.5) * 50;
    }
}

class Effect {
    constructor(context, canvasWidth, canvasHeight) {
        this.context = context;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.particles = [];
        this.gap = parseInt(resolutionInput.value);
        this.particleRadius = parseFloat(radiusInput.value);
        this.mouse = {
            radius: parseInt(mouseRadiusInput.value) * 100,
            x: undefined,
            y: undefined
        }
        this.image = null;

        window.addEventListener('mousemove', e => {
            this.mouse.x = e.x - 320; // Sidebar offset
            this.mouse.y = e.y;
        });
    }

    handleImage(imageSource) {
        this.image = new Image();
        this.image.src = imageSource;
        this.image.onload = () => {
            overlay.classList.add('hidden');
            this.processImage();
        };
    }

    processImage() {
        // PERFORMANCE GUARD: Limit processing size to max 400px longest side
        const maxSide = 400;
        let pWidth = this.image.width;
        let pHeight = this.image.height;

        if (pWidth > maxSide || pHeight > maxSide) {
            const ratio = Math.min(maxSide / pWidth, maxSide / pHeight);
            pWidth *= ratio;
            pHeight *= ratio;
            this.showToast();
        }

        hiddenCanvas.width = pWidth;
        hiddenCanvas.height = pHeight;
        hctx.drawImage(this.image, 0, 0, pWidth, pHeight);

        const pixels = hctx.getImageData(0, 0, pWidth, pHeight).data;
        this.particles = [];

        // Center on main canvas
        const centerX = this.canvasWidth / 2 - pWidth / 2;
        const centerY = this.canvasHeight / 2 - pHeight / 2;

        for (let y = 0; y < pHeight; y += this.gap) {
            for (let x = 0; x < pWidth; x += this.gap) {
                const index = (y * pWidth + x) * 4;
                const alpha = pixels[index + 3];

                if (alpha > 128) {
                    const r = pixels[index];
                    const g = pixels[index + 1];
                    const b = pixels[index + 2];
                    const color = `rgb(${r},${g},${b})`;
                    this.particles.push(new Particle(this, centerX + x, centerY + y, color));
                }
            }
        }
    }

    render() {
        this.particles.forEach(p => {
            p.update();
            p.draw();
        });
    }

    resize(width, height) {
        this.canvasWidth = width;
        this.canvasHeight = height;
        if (this.image) this.processImage();
    }

    showToast() {
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
}

const effect = new Effect(ctx, canvas.width, canvas.height);

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.render();
    requestAnimationFrame(animate);
}
animate();

// Event Listeners
imageUpload.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = event => effect.handleImage(event.target.result);
        reader.readAsDataURL(file);
    }
});

resolutionInput.addEventListener('input', e => {
    const val = parseInt(e.target.value);
    resolutionVal.innerText = val;
    effect.gap = val;
    if (effect.image) effect.processImage();
});

radiusInput.addEventListener('input', e => {
    const val = parseFloat(e.target.value);
    radiusVal.innerText = val;
    effect.particleRadius = val;
    effect.particles.forEach(p => p.size = val);
});

mouseRadiusInput.addEventListener('input', e => {
    const val = parseInt(e.target.value);
    mouseRadiusVal.innerText = val;
    effect.mouse.radius = val * 100;
});

presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        presetBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const preset = btn.dataset.preset;

        effect.particles.forEach(p => {
            if (preset === 'liquid') {
                p.friction = 0.95;
                p.ease = 0.1;
            } else if (preset === 'stiff') {
                p.friction = 0.8;
                p.ease = 0.3;
            } else if (preset === 'magnetic') {
                p.friction = 0.99;
                p.ease = 0.05;
            }
        });
    });
});

explodeBtn.addEventListener('click', () => {
    effect.particles.forEach(p => p.explode());
});

resetBtn.addEventListener('click', () => {
    if (effect.image) effect.processImage();
});

saveBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'particle-frame.png';
    link.href = canvas.toDataURL();
    link.click();
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth - 320;
    canvas.height = window.innerHeight;
    effect.resize(canvas.width, canvas.height);
});
