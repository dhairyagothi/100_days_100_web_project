const flags = [
  {
    name: "Calcutta Flag",
    year: "1906",
    tags: ["Bengal Partition Protest", "Parsee Bagan Square"],
    description: "The first known nationalist flag of India, hoisted on August 7, 1906 at Parsee Bagan Square in Calcutta. It had three horizontal stripes — green, yellow, and red — with eight lotus flowers on the top stripe and a sun and crescent moon on the bottom stripe. 'Vande Mataram' was inscribed in the middle stripe.",
    significance: "First organised attempt to give the independence movement a symbolic flag, born out of protest against the British partition of Bengal.",
    svg: `<svg viewBox="0 0 380 250" xmlns="http://www.w3.org/2000/svg">
      <rect width="380" height="250" fill="#1a3a10"/>
      <rect x="0" y="0" width="380" height="83" fill="#2d7a20"/>
      <rect x="0" y="83" width="380" height="84" fill="#e8c820"/>
      <rect x="0" y="167" width="380" height="83" fill="#c83020"/>
      ${[...Array(8)].map((_, i) => {
        const x = 28 + i * 46;
        return `<g transform="translate(${x},41)">
          <ellipse cx="0" cy="0" rx="9" ry="14" fill="#f5f0e0" transform="rotate(-30)"/>
          <ellipse cx="0" cy="0" rx="9" ry="14" fill="#f5f0e0" transform="rotate(0)"/>
          <ellipse cx="0" cy="0" rx="9" ry="14" fill="#f5f0e0" transform="rotate(30)"/>
          <ellipse cx="0" cy="0" rx="7" ry="10" fill="#e8c0c0" transform="rotate(0)"/>
          <circle cx="0" cy="0" r="4" fill="#d4a020"/>
          <rect x="-1.5" y="0" width="3" height="18" fill="#2d7a20"/>
          <ellipse cx="-10" cy="16" rx="9" ry="5" fill="#2d7a20" transform="rotate(-20 -10 16)"/>
          <ellipse cx="10" cy="16" rx="9" ry="5" fill="#2d7a20" transform="rotate(20 10 16)"/>
        </g>`;
      }).join('')}
      <text x="190" y="131" text-anchor="middle" font-size="16" font-family="serif" fill="#8a3010" font-weight="bold" letter-spacing="2">वन्दे मातरम्</text>
      <circle cx="60" cy="210" r="22" fill="#f5c830" stroke="#d4a020" stroke-width="2"/>
      ${[...Array(12)].map((_, i) => {
        const a = (i * 30) * Math.PI / 180;
        return `<line x1="${60 + 24*Math.cos(a)}" y1="${210 + 24*Math.sin(a)}" x2="${60 + 33*Math.cos(a)}" y2="${210 + 33*Math.sin(a)}" stroke="#d4a020" stroke-width="2"/>`;
      }).join('')}
      <path d="M 300,192 A 20,20 0 1,1 300,228 A 13,13 0 1,0 300,192" fill="#f5f0e0"/>
    </svg>`
  },
  {
    name: "Bhikaiji Cama Flag",
    year: "1907",
    tags: ["Stuttgart, Germany", "International Socialist Congress"],
    description: "A modified version designed by Bhikaiji Cama and hoisted at the International Socialist Congress in Stuttgart, Germany in 1907. It featured orange (top), yellow (middle), and green (bottom) stripes, with 'Vande Mataram' in the center, eight stars of the Saptarishi (Big Dipper) on the top stripe, and a sun and crescent on the green stripe.",
    significance: "First Indian flag to be hoisted on foreign soil — a bold international declaration of India's independence aspirations.",
    svg: `<svg viewBox="0 0 380 250" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="380" height="83" fill="#e07810"/>
      <rect x="0" y="83" width="380" height="84" fill="#c8b810"/>
      <rect x="0" y="167" width="380" height="83" fill="#186818"/>
      ${[0,1,2,3,4,5,6,7].map(i => `<polygon points="${25+i*46},28 ${28+i*46},36 ${36+i*46},36 ${30+i*46},41 ${32+i*46},49 ${25+i*46},44 ${18+i*46},49 ${20+i*46},41 ${14+i*46},36 ${22+i*46},36" fill="#f5f0e0" opacity="0.9"/>`).join('')}
      <text x="190" y="132" text-anchor="middle" font-size="15" font-family="serif" fill="#f5f0e0" font-weight="bold" letter-spacing="2">वन्दे मातरम्</text>
      <circle cx="80" cy="208" r="18" fill="#f5c830"/>
      ${[...Array(8)].map((_, i) => { const a = i*45*Math.PI/180; return `<line x1="${80+20*Math.cos(a)}" y1="${208+20*Math.sin(a)}" x2="${80+28*Math.cos(a)}" y2="${208+28*Math.sin(a)}" stroke="#d4a020" stroke-width="2"/>`; }).join('')}
      <path d="M 295,190 A 20,20 0 1,1 295,228 A 13,13 0 1,0 295,190" fill="#f5f0e0"/>
    </svg>`
  },
  {
    name: "Home Rule Flag",
    year: "1917",
    tags: ["Annie Besant & Bal Gangadhar Tilak", "Home Rule Movement"],
    description: "Designed during the Home Rule Movement by Annie Besant and Bal Gangadhar Tilak in 1917. It had a Union Jack in the upper left corner against a red and green striped background. It featured five red and four green horizontal stripes, seven stars of the Saptarishi constellation, and a crescent and star in the top right corner.",
    significance: "Represented the demand for self-governance within the British Empire — a political compromise that showed constitutional aspirations of the era.",
    svg: `<svg viewBox="0 0 380 250" xmlns="http://www.w3.org/2000/svg">
      ${[0,1,2,3,4,5,6,7,8].map(i => `<rect x="0" y="${i*27.7}" width="380" height="27.7" fill="${i%2===0 ? '#c03020' : '#186818'}"/>`).join('')}
      <rect x="0" y="0" width="120" height="83" fill="#00247D"/>
      <line x1="0" y1="0" x2="120" y2="83" stroke="white" stroke-width="14"/>
      <line x1="120" y1="0" x2="0" y2="83" stroke="white" stroke-width="14"/>
      <line x1="0" y1="0" x2="120" y2="83" stroke="#CF142B" stroke-width="8"/>
      <line x1="120" y1="0" x2="0" y2="83" stroke="#CF142B" stroke-width="8"/>
      <rect x="50" y="0" width="20" height="83" fill="white"/>
      <rect x="0" y="31" width="120" height="21" fill="white"/>
      <rect x="55" y="0" width="10" height="83" fill="#CF142B"/>
      <rect x="0" y="36" width="120" height="11" fill="#CF142B"/>
      ${[[240,30],[270,50],[295,35],[310,60],[280,75],[250,70],[220,55]].map(([x,y]) =>
        `<polygon points="${x},${y-7} ${x+2},${y-2} ${x+7},${y-2} ${x+3},${y+2} ${x+5},${y+7} ${x},${y+4} ${x-5},${y+7} ${x-3},${y+2} ${x-7},${y-2} ${x-2},${y-2}" fill="#f5f0e0"/>`
      ).join('')}
      <path d="M 345,100 A 20,20 0 1,1 345,140 A 13,13 0 1,0 345,100" fill="#f5f0e0"/>
      <polygon points="360,110 362,116 368,116 363,120 365,126 360,122 355,126 357,120 352,116 358,116" fill="#f5f0e0"/>
    </svg>`
  },
  {
    name: "Gandhi Flag",
    year: "1921",
    tags: ["Mahatma Gandhi", "All India Congress Committee"],
    description: "Proposed by Pingali Venkayya and modified by Mahatma Gandhi in 1921. It had a spinning wheel (charkha) at its center to represent the economic regeneration of India. The original design had red (Hindus), green (Muslims), and white (other religions) stripes. Gandhi added the spinning wheel as a symbol of self-reliance and the Swadeshi movement.",
    significance: "The charkha became a powerful symbol of India's self-reliance movement. Gandhi saw handspun cloth as the key to ending poverty and colonial dependence.",
    svg: `<svg viewBox="0 0 380 250" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="380" height="83" fill="#f0f0f0"/>
      <rect x="0" y="83" width="380" height="84" fill="#186818"/>
      <rect x="0" y="167" width="380" height="83" fill="#c03020"/>
      <g transform="translate(190,125)">
        <circle cx="0" cy="0" r="40" fill="none" stroke="#1a1a60" stroke-width="3"/>
        <circle cx="0" cy="0" r="7" fill="#1a1a60"/>
        ${[...Array(16)].map((_, i) => { const a = i*22.5*Math.PI/180; return `<line x1="${7*Math.cos(a)}" y1="${7*Math.sin(a)}" x2="${38*Math.cos(a)}" y2="${38*Math.sin(a)}" stroke="#1a1a60" stroke-width="1.5"/>`; }).join('')}
        <rect x="-55" y="-2.5" width="50" height="5" fill="#1a1a60" rx="2"/>
        <rect x="-65" y="-10" width="14" height="20" fill="#8b6010" rx="2"/>
        <rect x="-63" y="-14" width="10" height="5" fill="#a07020" rx="1"/>
        <rect x="-63" y="9" width="10" height="5" fill="#a07020" rx="1"/>
        <rect x="-5" y="35" width="10" height="18" fill="#1a1a60"/>
        <rect x="-18" y="50" width="36" height="5" fill="#1a1a60" rx="2"/>
      </g>
    </svg>`
  },
  {
    name: "Swaraj Flag",
    year: "1931",
    tags: ["Pingali Venkayya", "Indian National Congress Official"],
    description: "Adopted officially by the Indian National Congress in 1931, this flag became the most recognised pre-independence flag. Designed by Pingali Venkayya, it featured three horizontal bands of saffron (top), white (middle), and dark green (bottom), with a blue spinning wheel (charkha) at the centre of the white stripe.",
    significance: "The first official flag of the Indian National Congress — a direct ancestor of today's tricolour. Its colour scheme and structure formed the template for independent India's flag.",
    svg: `<svg viewBox="0 0 380 250" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="380" height="83" fill="#e87820"/>
      <rect x="0" y="83" width="380" height="84" fill="#f5f5f5"/>
      <rect x="0" y="167" width="380" height="83" fill="#186818"/>
      <g transform="translate(190,125)">
        <circle cx="0" cy="0" r="36" fill="none" stroke="#000080" stroke-width="2.5"/>
        <circle cx="0" cy="0" r="6" fill="#000080"/>
        ${[...Array(24)].map((_, i) => { const a = i*15*Math.PI/180; return `<line x1="${6*Math.cos(a)}" y1="${6*Math.sin(a)}" x2="${34*Math.cos(a)}" y2="${34*Math.sin(a)}" stroke="#000080" stroke-width="1.2"/>`; }).join('')}
        <line x1="-36" y1="0" x2="-70" y2="0" stroke="#000080" stroke-width="2"/>
        <rect x="-80" y="-10" width="12" height="20" fill="#8b5010" rx="2"/>
        <line x1="0" y1="36" x2="0" y2="55" stroke="#000080" stroke-width="2"/>
        <line x1="-20" y1="55" x2="20" y2="55" stroke="#000080" stroke-width="2"/>
      </g>
    </svg>`
  },
  {
    name: "Tricolour — Independent India",
    year: "1947",
    tags: ["Constituent Assembly", "22 July 1947", "Pingali Venkayya"],
    description: "Adopted on July 22, 1947 — just days before independence on August 15 — by the Constituent Assembly. The flag retains the saffron, white, and green stripes from the Swaraj Flag, but the charkha was replaced by the Ashoka Chakra, a 24-spoked navy blue wheel from the Lion Capital of Emperor Ashoka at Sarnath. It represents the eternal wheel of law and righteousness.",
    significance: "India's sovereign national flag — a symbol of a billion people, their freedom hard-won over decades of sacrifice. The Ashoka Chakra replaces Gandhi's charkha, signalling a new era of constitutional governance.",
    svg: `<svg viewBox="0 0 380 250" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="380" height="83" fill="#FF9933"/>
      <rect x="0" y="83" width="380" height="84" fill="#FFFFFF"/>
      <rect x="0" y="167" width="380" height="83" fill="#138808"/>
      <g transform="translate(190,125)">
        <circle cx="0" cy="0" r="38" fill="none" stroke="#000080" stroke-width="3"/>
        <circle cx="0" cy="0" r="6" fill="#000080"/>
        ${[...Array(24)].map((_, i) => {
          const a = i * 15 * Math.PI / 180;
          return `<line x1="${6*Math.cos(a)}" y1="${6*Math.sin(a)}" x2="${35*Math.cos(a)}" y2="${35*Math.sin(a)}" stroke="#000080" stroke-width="2"/>`;
        }).join('')}
        <circle cx="0" cy="0" r="28" fill="none" stroke="#000080" stroke-width="1"/>
      </g>
    </svg>`
  }
];

/* ── State ── */
let current = 0;

/* ── Render Functions ── */
function renderTimeline() {
  document.getElementById('timeline').innerHTML = flags.map((f, i) => `
    <div class="tl-item ${i === current ? 'active' : ''}" onclick="goTo(${i})">
      <div class="tl-dot"></div>
      <span class="tl-year">${f.year}</span>
    </div>
  `).join('');
}

function renderDots() {
  document.getElementById('progressDots').innerHTML = flags.map((_, i) =>
    `<div class="pdot ${i === current ? 'active' : ''}" onclick="goTo(${i})"></div>`
  ).join('');
}

function renderCard() {
  const f = flags[current];
  document.getElementById('cardInner').innerHTML = `
    <div class="card-header">
      <div class="flag-name">${f.name}</div>
      <div class="year-badge">${f.year}</div>
    </div>
    <div class="meta-row">
      ${f.tags.map(t => `<span class="meta-tag">${t}</span>`).join('')}
    </div>
    <div class="flag-display">
      <div class="flag-frame">${f.svg}</div>
    </div>
    <p class="flag-description">${f.description}</p>
    <div class="significance-box">
      <div class="significance-label">✦ Historical Significance</div>
      <div class="significance-text">${f.significance}</div>
    </div>
  `;
  document.getElementById('prevBtn').disabled = current === 0;
  document.getElementById('nextBtn').disabled = current === flags.length - 1;
  document.getElementById('counter').textContent = `${current + 1} of ${flags.length}`;
  renderTimeline();
  renderDots();
}

/* ── Navigation ── */
function navigate(dir) {
  const card = document.getElementById('flagCard');
  card.style.opacity = '0';
  card.style.transform = `translateX(${dir < 0 ? '30px' : '-30px'})`;
  card.style.transition = 'opacity 0.25s, transform 0.25s';
  setTimeout(() => {
    current = Math.max(0, Math.min(flags.length - 1, current + dir));
    renderCard();
    card.style.transition = 'none';
    card.style.opacity = '0';
    card.style.transform = `translateX(${dir < 0 ? '-30px' : '30px'})`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        card.style.transition = 'opacity 0.35s, transform 0.35s';
        card.style.opacity = '1';
        card.style.transform = 'translateX(0)';
      });
    });
  }, 250);
}

function goTo(index) {
  if (index === current) return;
  const dir = index > current ? 1 : -1;
  current = index;
  const card = document.getElementById('flagCard');
  card.style.opacity = '0';
  card.style.transform = `translateX(${dir < 0 ? '30px' : '-30px'})`;
  card.style.transition = 'opacity 0.22s, transform 0.22s';
  setTimeout(() => {
    renderCard();
    card.style.transition = 'none';
    card.style.opacity = '0';
    card.style.transform = `translateX(${dir < 0 ? '-30px' : '30px'})`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        card.style.transition = 'opacity 0.32s, transform 0.32s';
        card.style.opacity = '1';
        card.style.transform = 'translateX(0)';
      });
    });
  }, 220);
}

/* ── Keyboard Navigation ── */
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' && current < flags.length - 1) navigate(1);
  if (e.key === 'ArrowLeft'  && current > 0)                navigate(-1);
});

/* ── Init ── */
renderCard();