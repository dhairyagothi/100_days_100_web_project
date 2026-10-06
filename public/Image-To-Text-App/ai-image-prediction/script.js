/* ─── Neural Network Canvas Background ─────────────────────────────────── */
(function initNeuralBackground() {
  const canvas = document.getElementById('neural-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let animId, W, H;

  const PARTICLE_COUNT = 72;
  const CONNECTION_DIST = 160;
  const particles = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function rand(a, b) { return a + Math.random() * (b - a); }

  function initParticles() {
    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: rand(0, W), y: rand(0, H),
        vx: rand(-0.3, 0.3), vy: rand(-0.3, 0.3),
        r: rand(1.5, 3.5),
        pulse: rand(0, Math.PI * 2),
        pulseSpeed: rand(0.01, 0.03),
        hue: Math.random() > 0.5 ? 185 : 260,
      });
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);

    // Animated grid
    const gridSize = 52;
    const offset = (t * 0.008) % gridSize;
    ctx.lineWidth = 0.4;
    for (let x = -gridSize + (offset % gridSize); x < W + gridSize; x += gridSize) {
      const alpha = 0.025 + 0.01 * Math.sin(t * 0.001 + x * 0.01);
      ctx.strokeStyle = `rgba(94,246,255,${alpha})`;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = -gridSize + (offset % gridSize); y < H + gridSize; y += gridSize) {
      const alpha = 0.025 + 0.01 * Math.sin(t * 0.001 + y * 0.01);
      ctx.strokeStyle = `rgba(94,246,255,${alpha})`;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * 0.35;
          const mixHue = (particles[i].hue + particles[j].hue) / 2;
          const grd = ctx.createLinearGradient(
            particles[i].x, particles[i].y,
            particles[j].x, particles[j].y
          );
          grd.addColorStop(0, `hsla(${particles[i].hue},100%,70%,${alpha})`);
          grd.addColorStop(1, `hsla(${particles[j].hue},100%,70%,${alpha})`);
          ctx.lineWidth = 0.8 + (1 - dist / CONNECTION_DIST) * 1.2;
          ctx.strokeStyle = grd;
          ctx.shadowColor = `hsla(${mixHue},100%,70%,0.5)`;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }
    }

    // Particles
    for (const p of particles) {
      p.pulse += p.pulseSpeed;
      const glow = 0.5 + 0.5 * Math.sin(p.pulse);
      const radius = p.r + glow * 1.5;

      const glowGrd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 4);
      glowGrd.addColorStop(0, `hsla(${p.hue},100%,75%,${0.25 * glow})`);
      glowGrd.addColorStop(1, `hsla(${p.hue},100%,75%,0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius * 4, 0, Math.PI * 2);
      ctx.fillStyle = glowGrd;
      ctx.fill();

      ctx.shadowColor = `hsla(${p.hue},100%,75%,0.9)`;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue},100%,80%,${0.7 + 0.3 * glow})`;
      ctx.fill();
      ctx.shadowBlur = 0;

      p.x += p.vx; p.y += p.vy;
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;
    }

    animId = requestAnimationFrame(draw);
  }

  resize();
  initParticles();
  animId = requestAnimationFrame(draw);

  const ro = new ResizeObserver(() => { resize(); initParticles(); });
  ro.observe(canvas);
})();

/* ─── Helpers ───────────────────────────────────────────────────────────── */
function extractKeywords(text) {
  const common = new Set(['a','an','the','is','are','in','on','at','of','and','or','with','to','that','this','it','its','as','for','by','from','into','over','under','near','has','have','was','were','be','been','being','some','which','who','there','their','they','them','not','but','so','if','when','also']);
  const words = text.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
  const freq = {};
  words.forEach(w => { if (!common.has(w)) freq[w] = (freq[w] || 0) + 1; });
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([w]) => w);
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

/* ─── App State ─────────────────────────────────────────────────────────── */
const state = {
  image: null,   // { dataUrl, name, size, type }
  status: 'idle', // idle | loading | done | error
  result: '',
  tags: [],
  dragOver: false,
};

/* ─── DOM refs ───────────────────────────────────────────────────────────── */
const dropzone    = document.getElementById('dropzone');
const fileInput   = document.getElementById('file-input');
const dzEmpty     = document.getElementById('dz-empty');
const dzPreview   = document.getElementById('dz-preview');
const previewImg  = document.getElementById('preview-img');
const removeBtn   = document.getElementById('remove-btn');
const ollamaInput = document.getElementById('ollama-url');
const analyzeBtn  = document.getElementById('analyze-btn');
const resetBtn    = document.getElementById('reset-btn');
const outputCard  = document.getElementById('output-card');
const cardLabel   = document.getElementById('card-label');
const stateIdle   = document.getElementById('state-idle');
const stateLoading= document.getElementById('state-loading');
const stateDone   = document.getElementById('state-done');
const stateError  = document.getElementById('state-error');
const cardTags    = document.getElementById('card-tags');
const fileMeta    = document.getElementById('file-meta');
const metaName    = document.getElementById('meta-name');
const metaSize    = document.getElementById('meta-size');
const metaType    = document.getElementById('meta-type');

/* ─── Render ─────────────────────────────────────────────────────────────── */
function render() {
  const { image, status, result, tags } = state;

  // Dropzone
  if (image) {
    dropzone.classList.add('has-image');
    dropzone.style.cursor = 'default';
    dzEmpty.style.display = 'none';
    dzPreview.style.display = '';
    previewImg.src = image.dataUrl;
  } else {
    dropzone.classList.remove('has-image');
    dropzone.style.cursor = 'pointer';
    dzEmpty.style.display = '';
    dzPreview.style.display = 'none';
    previewImg.src = '';
  }

  // Buttons
  analyzeBtn.disabled = !image || status === 'loading';
  resetBtn.style.display = image ? '' : 'none';
  if (status === 'loading') {
    analyzeBtn.classList.add('is-loading');
    analyzeBtn.innerHTML = '<span class="spinner"></span>Inferring…';
  } else {
    analyzeBtn.classList.remove('is-loading');
    analyzeBtn.textContent = '✦ Analyze Image';
  }

  // Output card classes
  outputCard.className = 'output-card';
  if (status === 'done')    outputCard.classList.add('is-done');
  if (status === 'error')   outputCard.classList.add('is-error');
  if (status === 'loading') outputCard.classList.add('is-loading');

  // Card label
  const labels = { idle: 'Waiting', loading: 'Processing', done: 'Description', error: 'Error' };
  cardLabel.textContent = labels[status] || 'Waiting';

  // State panels
  stateIdle.style.display    = status === 'idle'    ? '' : 'none';
  stateLoading.style.display = status === 'loading' ? '' : 'none';
  stateDone.style.display    = status === 'done'    ? '' : 'none';
  stateError.style.display   = status === 'error'   ? '' : 'none';
  if (status === 'done')  stateDone.textContent = result;
  if (status === 'error') stateError.textContent = '⚠ ' + result;

  // Tags
  if (status === 'done' && tags.length > 0) {
    cardTags.style.display = '';
    cardTags.innerHTML = tags.map((t, i) =>
      `<span class="tag" style="animation-delay:${i * 0.07}s">#${t}</span>`
    ).join('');
  } else {
    cardTags.style.display = 'none';
    cardTags.innerHTML = '';
  }

  // File meta
  if (image && status !== 'idle') {
    fileMeta.style.display = '';
    metaName.textContent = '📄 ' + image.name;
    metaSize.textContent = '⚖ ' + formatBytes(image.size);
    metaType.textContent = '🎨 ' + image.type.split('/')[1].toUpperCase();
  } else {
    fileMeta.style.display = 'none';
  }
}

/* ─── File handling ──────────────────────────────────────────────────────── */
function handleFile(file) {
  if (!file || !file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX = 1024;
      let w = img.width, h = img.height;
      if (w > MAX) { h *= MAX / w; w = MAX; }
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
      state.image = {
        dataUrl,
        name: file.name,
        size: Math.round((dataUrl.length * 3) / 4),
        type: 'image/jpeg',
      };
      state.status = 'idle';
      state.result = '';
      state.tags = [];
      render();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function handleReset() {
  state.image = null;
  state.status = 'idle';
  state.result = '';
  state.tags = [];
  fileInput.value = '';
  render();
}

/* ─── Dropzone events ────────────────────────────────────────────────────── */
dropzone.addEventListener('click', () => {
  if (!state.image) fileInput.click();
});
dropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropzone.classList.add('drag-over');
});
dropzone.addEventListener('dragleave', () => {
  dropzone.classList.remove('drag-over');
});
dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzone.classList.remove('drag-over');
  handleFile(e.dataTransfer.files[0]);
});
fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
removeBtn.addEventListener('click', (e) => { e.stopPropagation(); handleReset(); });

/* ─── Analyze ────────────────────────────────────────────────────────────── */
analyzeBtn.addEventListener('click', async () => {
  if (!state.image) return;
  let url = ollamaInput.value.trim().replace(/\/$/, '');
  if (!url) {
    state.result = 'Please enter your Ollama connection URL.';
    state.status = 'error';
    render();
    return;
  }
  state.status = 'loading';
  state.result = '';
  state.tags = [];
  render();
  try {
    const base64 = state.image.dataUrl.split(',')[1];
    const res = await fetch(`${url}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'moondream',
        prompt: 'Describe this image in detail.',
        stream: false,
        images: [base64],
      }),
    });
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    const data = await res.json();
    const text = data.response || '';
    state.result = text;
    state.tags = extractKeywords(text);
    state.status = 'done';
  } catch (err) {
    state.result = err.message || 'Failed to connect to Ollama.';
    state.status = 'error';
  }
  render();
});

resetBtn.addEventListener('click', handleReset);

/* ─── URL input focus styles ─────────────────────────────────────────────── */
ollamaInput.addEventListener('focus', () => { ollamaInput.style.borderColor = 'var(--accent)'; });
ollamaInput.addEventListener('blur',  () => { ollamaInput.style.borderColor = ''; });

/* ─── Initial render ─────────────────────────────────────────────────────── */
render();
