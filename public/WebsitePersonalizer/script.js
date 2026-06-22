const QUESTIONS = [
  {
    id: 'vibe',
    text: "What's your aesthetic vibe?",
    opts: [
      { label: '✦  Clean & Minimal', val: 'minimal' },
      { label: '⬡  Dark & Cyberpunk', val: 'cyberpunk' },
      { label: '✿  Soft & Aesthetic', val: 'aesthetic' },
      { label: '◼  BOLD & LOUD', val: 'bold' },
    ],
  },
  {
    id: 'mode',
    text: 'Light or dark interface?',
    opts: [
      { label: '☀  Light — bright & clean', val: 'light' },
      { label: '◐  Dark — easy on the eyes', val: 'dark' },
    ],
  },
  {
    id: 'color',
    text: 'Pick your signature color.',
    opts: [
      { label: '▲  Electric Violet', val: 'violet' },
      { label: '●  Crimson Rose', val: 'rose' },
      { label: '◆  Deep Emerald', val: 'emerald' },
      { label: '■  Warm Amber', val: 'amber' },
    ],
  },
  {
    id: 'motion',
    text: 'How much motion feels right?',
    opts: [
      { label: '〜  Fluid & expressive', val: 'fluid' },
      { label: '·   Subtle — just hints', val: 'subtle' },
      { label: '⟳  Slow & cinematic', val: 'slow' },
      { label: '—  None — keep it still', val: 'none' },
    ],
  },
  {
    id: 'typo',
    text: "What's your reading style?",
    opts: [
      { label: '≡  Compact & dense', val: 'compact' },
      { label: '=  Default balance', val: 'default' },
      { label: '≈  Relaxed & roomy', val: 'relaxed' },
      { label: '↔  Wide-spaced prose', val: 'wide' },
    ],
  },
];

const VIBES = {
  minimal: {
    name: 'FORMA',
    tag: 'Design Studio',
    em: 'considered',
    sub: 'Clarity · Craft · Restraint',
    servH: 'What We Do',
    servSub: 'Careful work for brands that know less is more.',
    aboutH: 'We are Forma',
    navLinks: ['Work', 'Studio', 'Process', 'Contact'],
  },
  cyberpunk: {
    name: 'FRG.SYS',
    tag: 'DIGITAL_FORGE // v2.4',
    em: 'next-gen',
    sub: 'Code · Neon · Systems · Edge',
    servH: 'SERVICES.LIST',
    servSub: 'Stack-agnostic. Deadline-proof. Always online.',
    aboutH: 'We are FRG.SYS',
    navLinks: ['./work', './about', './lab', './contact'],
  },
  aesthetic: {
    name: 'AURA',
    tag: 'Creative Atelier',
    em: 'beautiful',
    sub: 'Beauty · Flow · Form · Feeling',
    servH: 'Our Offerings',
    servSub: 'Gentle, intentional, deeply considered creative work.',
    aboutH: 'We are Aura',
    navLinks: ['Work', 'Story', 'Studio', 'Connect'],
  },
  bold: {
    name: 'BLCK',
    tag: 'IMPACT STUDIO — EST. 2018',
    em: 'LOUD',
    sub: 'Power · Identity · Edge · No Apologies',
    servH: 'WHAT WE DO',
    servSub: 'Big brands. Bigger ideas. No compromises.',
    aboutH: 'WE ARE BLCK',
    navLinks: ['WORK', 'ABOUT', 'LAB', 'CONTACT'],
  },
};

const BREW_LINES = [
  { text: '$ personalizer --craft your-site --mode=interactive', cls: '' },
  { text: 'reading answers...', cls: 'dim' },
  { text: '✓ vibe profile locked', cls: 'ok' },
  { text: 'compiling color tokens...', cls: 'dim' },
  { text: '✓ palette applied', cls: 'ok' },
  { text: 'resolving typography scale...', cls: 'dim' },
  { text: '✓ font stack armed', cls: 'ok' },
  { text: 'wiring motion profile...', cls: 'dim' },
  { text: '✓ animations configured', cls: 'ok' },
  { text: 'assembling layout engine...', cls: 'dim' },
  { text: '✓ grid compiled', cls: 'ok' },
  { text: 'rendering your experience...', cls: 'dim' },
  { text: '✓ done. launching in 3... 2... 1...', cls: 'ok' },
];

const answers = {};
let current = 0;
let isTransitioning = false;

const quizPhase = document.getElementById('quiz-phase');
const brewPhase = document.getElementById('brew-phase');
const sitePhase = document.getElementById('site-phase');
const cardStack = document.getElementById('card-stack');
const fillEl = document.getElementById('progress-fill');
const labelEl = document.getElementById('progress-label');

function buildCard(q, idx) {
  const card = document.createElement('div');
  card.className = 'q-card';
  card.innerHTML = `
    <span class="q-num">Question ${idx + 1} of ${QUESTIONS.length}</span>
    <p class="q-text">${q.text}</p>
    <div class="q-options">
      ${q.opts.map((o) => `<button class="q-opt" data-val="${o.val}">${o.label}</button>`).join('')}
    </div>
  `;
  card.querySelectorAll('.q-opt').forEach((btn) => {
    btn.addEventListener('click', () => pick(q.id, btn.dataset.val, card));
  });
  return card;
}

function pick(qid, val, card) {
  if (isTransitioning) return;

  isTransitioning = true;

  answers[qid] = val;

  const options = card.querySelectorAll('.q-opt');

  options.forEach((btn) => {
    btn.disabled = true;

    btn.classList.toggle('selected', btn.dataset.val === val);
  });

  setTimeout(() => {
    card.classList.add('exit');

    setTimeout(() => {
      card.remove();

      current++;

      isTransitioning = false;

      current < QUESTIONS.length ? showCard(current) : startBrew();
    }, 380);
  }, 180);
}

function showCard(idx) {
  fillEl.style.width = `${((idx + 1) / QUESTIONS.length) * 100}%`;
  labelEl.textContent = `${idx + 1} / ${QUESTIONS.length}`;
  const card = buildCard(QUESTIONS[idx], idx);
  cardStack.appendChild(card);
  requestAnimationFrame(() =>
    requestAnimationFrame(() => card.classList.add('visible'))
  );
}

function startBrew() {
  quizPhase.classList.remove('active');
  brewPhase.classList.add('active');
  const linesEl = document.getElementById('brew-lines');
  let i = 0;
  function next() {
    if (i >= BREW_LINES.length) {
      setTimeout(revealSite, 700);
      return;
    }
    const { text, cls } = BREW_LINES[i];
    const span = document.createElement('span');
    span.className = 'term-line' + (cls ? ` ${cls}` : '');
    span.innerHTML = `<span class="prompt">▸</span><span class="cmd"> ${text}</span>`;
    linesEl.appendChild(span);
    i++;
    setTimeout(next, 240 + Math.random() * 200);
  }
  next();
}

function applyTheme() {
  const body = document.body;
  const vibe = answers.vibe || 'minimal';
  const mode = answers.mode || 'light';
  const color = answers.color || 'violet';
  const motion = answers.motion || 'fluid';
  const typo = answers.typo || 'default';

  body.dataset.vibe = vibe;
  body.dataset.mode = mode;
  body.dataset.color = color;
  body.dataset.motion = motion;
  body.dataset.typo = typo;

  const v = VIBES[vibe];

  ['studio-name', 'footer-name'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = v.name;
  });

  document.getElementById('hero-tag').textContent = v.tag;
  document.getElementById('hero-em').textContent = v.em;
  document.getElementById('hero-sub').textContent = v.sub;
  document.getElementById('services-h2').textContent = v.servH;
  document.getElementById('services-sub').textContent = v.servSub;
  document.getElementById('about-h2').textContent = v.aboutH;

  ['nav-1', 'nav-2', 'nav-3', 'nav-4'].forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) el.textContent = v.navLinks[i];
  });

  const shape = document.getElementById('hero-shape');
  if (vibe === 'aesthetic') {
    shape.style.width = '260px';
    shape.style.height = '260px';
    shape.style.background = `radial-gradient(circle, color-mix(in srgb, var(--c-accent) 70%, white), color-mix(in srgb, var(--c-accent2) 70%, white))`;
    shape.style.boxShadow =
      '0 0 80px color-mix(in srgb, var(--c-accent) 40%, transparent)';
  } else if (vibe === 'bold') {
    shape.style.borderRadius = '0';
    shape.style.width = '200px';
    shape.style.height = '160px';
  }
}

function revealSite() {
  applyTheme();
  brewPhase.classList.remove('active');
  sitePhase.classList.add('active', 'reveal');
  setTimeout(() => sitePhase.classList.remove('reveal'), 1500);
  window.scrollTo(0, 0);
}

document.getElementById('repersonalize-btn').addEventListener('click', () => {
  Object.keys(answers).forEach((k) => delete answers[k]);
  current = 0;
  cardStack.innerHTML = '';
  document.getElementById('brew-lines').innerHTML = '';

  const body = document.body;
  ['vibe', 'mode', 'color', 'motion', 'typo'].forEach(
    (a) => delete body.dataset[a]
  );

  const shape = document.getElementById('hero-shape');
  shape.removeAttribute('style');

  sitePhase.classList.remove('active');
  quizPhase.classList.add('active');
  fillEl.style.width = '20%';
  labelEl.textContent = '1 / 5';
  showCard(0);
});

showCard(0);
