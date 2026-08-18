const flagData = [
  {
    year: "1906",
    name: "Calcutta Flag",
    description: "The first known nationalist flag of India, hoisted on August 7, 1906 at Parsee Bagan Square in Calcutta. It had three horizontal stripes — green, yellow, and red — with lotus flowers on the top stripe and a sun on the right of the bottom stripe.",
    significance: "First organized attempt to give the independence movement a symbolic flag.",
    colors: ["#138808", "#FFD700", "#FF4500"],
    symbol: "☀️"
  },
  {
    year: "1907",
    name: "Berlin / Madame Cama Flag",
    description: "Hoisted by Bhikaiji Cama in Stuttgart, Germany in 1907 — the first Indian flag to be hoisted on foreign soil. Modified with orange on top, yellow in the middle, and green at the bottom, bearing 'Vande Mataram' in Devanagari.",
    significance: "First Indian flag unfurled on foreign soil, carrying the message of independence globally.",
    colors: ["#FF9933", "#FFD700", "#138808"],
    symbol: "✦"
  },
  {
    year: "1917",
    name: "Home Rule Flag",
    description: "Adopted during the Home Rule Movement led by Bal Gangadhar Tilak and Annie Besant. Had five red and four green alternating horizontal stripes, with the Union Jack in the upper corner and a crescent and star.",
    significance: "Represented the push for self-governance within the British Empire.",
    colors: ["#CC0000", "#138808", "#CC0000", "#138808", "#CC0000"],
    symbol: "☽"
  },
  {
    year: "1921",
    name: "Gandhi's Flag",
    description: "Proposed by Pingali Venkayya and adopted informally after Mahatma Gandhi's suggestion. Three stripes — white (minorities), green (Muslims), and red (Hindus) — with a spinning charkha (wheel) in the centre symbolizing economic self-reliance.",
    significance: "Introduced the charkha as a symbol of swadeshi — the spirit of self-sufficiency.",
    colors: ["#FFFFFF", "#138808", "#CC0000"],
    symbol: "⊙"
  },
  {
    year: "1931",
    name: "Swaraj Flag",
    description: "Formally adopted by the Indian National Congress in 1931. Three horizontal stripes of saffron, white, and green with a charkha in the centre. The most recognized pre-independence flag used during the freedom struggle.",
    significance: "Official flag of the Indian National Congress and the freedom movement for 16 years.",
    colors: ["#FF9933", "#FFFFFF", "#138808"],
    symbol: "⊙"
  },
  {
    year: "1947",
    name: "National Flag of India",
    description: "Adopted on July 22, 1947, two days before independence. The charkha was replaced by the Ashoka Chakra (Wheel of Law) from the Sarnath Lion Capital. Designed by Pingali Venkayya. The 24-spoke navy blue wheel represents the eternal wheel of law and righteousness.",
    significance: "The Tiranga — our national flag — representing courage (saffron), peace & truth (white), and prosperity (green).",
    colors: ["#FF9933", "#FFFFFF", "#138808"],
    symbol: "☸"
  }
];

let currentIndex = 0;

function renderTimeline() {
  const track = document.getElementById('timelineTrack');
  const cardsContainer = document.getElementById('flagCards');

  track.innerHTML = '';
  cardsContainer.innerHTML = '';

  flagData.forEach((flag, i) => {
    // Dot
    const dot = document.createElement('div');
    dot.className = 'timeline-dot' + (i === currentIndex ? ' active' : '');
    dot.innerHTML = `
      <div class="dot-circle">${flag.year}</div>
      <span class="dot-year">${flag.year}</span>
    `;
    dot.addEventListener('click', () => goTo(i));
    track.appendChild(dot);

    // Card
    const card = document.createElement('div');
    card.className = 'flag-card' + (i === currentIndex ? ' active' : '');
    card.innerHTML = `
      <h3>${flag.name}</h3>
      <span class="flag-year-badge">${flag.year}</span>
      ${buildFlagSVG(flag)}
      <p>${flag.description}</p>
      <div class="significance">✦ <strong>Historical Significance:</strong> ${flag.significance}</div>
    `;
    cardsContainer.appendChild(card);
  });

  updateNavButtons();
}

function buildFlagSVG(flag) {
  const colors = flag.colors;
  const stripeH = 60;

  // For flags with 3 stripes
  if (colors.length === 3) {
    return `
      <svg class="flag-visual" viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="300" height="60" fill="${colors[0]}"/>
        <rect x="0" y="60" width="300" height="60" fill="${colors[1]}"/>
        <rect x="0" y="120" width="300" height="60" fill="${colors[2]}"/>
        <text x="150" y="100" text-anchor="middle" font-size="32" fill="${flag.year === '1947' ? '#000080' : '#555'}">${flag.symbol}</text>
      </svg>`;
  }

  // For flags with 5 stripes (1917)
  if (colors.length === 5) {
    const h = 36;
    return `
      <svg class="flag-visual" viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg">
        ${colors.map((c, i) => `<rect x="0" y="${i * h}" width="300" height="${h}" fill="${c}"/>`).join('')}
        <text x="150" y="105" text-anchor="middle" font-size="32" fill="#FFD700">${flag.symbol}</text>
      </svg>`;
  }

  // Fallback
  return `<svg class="flag-visual" viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg">
    <rect width="300" height="180" fill="#333"/>
    <text x="150" y="100" text-anchor="middle" font-size="48" fill="#FF9933">${flag.symbol}</text>
  </svg>`;
}

function goTo(index) {
  currentIndex = index;
  renderTimeline();
  document.getElementById('flag-history').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function updateNavButtons() {
  document.getElementById('btnPrev').disabled = currentIndex === 0;
  document.getElementById('btnNext').disabled = currentIndex === flagData.length - 1;
}

document.getElementById('btnPrev').addEventListener('click', () => {
  if (currentIndex > 0) goTo(currentIndex - 1);
});

document.getElementById('btnNext').addEventListener('click', () => {
  if (currentIndex < flagData.length - 1) goTo(currentIndex + 1);
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' && currentIndex > 0) goTo(currentIndex - 1);
  if (e.key === 'ArrowRight' && currentIndex < flagData.length - 1) goTo(currentIndex + 1);
});

// Init
renderTimeline();