const categories = [
  'All',
  'Travel',
  'Food',
  'Architecture',
  'Nature',
  'Fashion',
  'Interior',
  'Art',
  'Fitness',
  'Technology',
  'Books',
];

const PINS = [
  {
    id: 1,
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80',
    title: 'Swiss Alps at Sunset',
    author: 'Maya Rivers',
    aI: 'MR',
    aBg: '#c8b0d2',
    aC: '#4a2066',
    followers: '2.4k followers',
    desc: 'Golden hour in the Swiss Alps is something that words can barely capture. The way the light falls over the jagged peaks and reflects off the pristine snowfields is pure magic.',
    tags: ['Travel'],
    source: 'natgeo.com',
    sourceUrl: 'https://natgeo.com',
    sIcon: '🏔️',
    comments: [
      {
        name: 'Jade L.',
        i: 'JL',
        bg: '#b0d2c8',
        c: '#205242',
        text: 'This view is absolutely breathtaking!',
        t: '2h',
      },
      {
        name: 'Tom K.',
        i: 'TK',
        bg: '#d2c8b0',
        c: '#524220',
        text: 'Adding this to my bucket list.',
        t: '45m',
      },
    ],
  },
  {
    id: 2,
    img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80',
    title: 'Modern Minimalist Living',
    author: 'Archi Studio',
    aI: 'AS',
    aBg: '#b0c8d2',
    aC: '#204252',
    followers: '18.3k followers',
    desc: 'Clean lines, warm tones, and intentional negative space define this Scandinavian-inspired living room. The pendant light anchors the seating perfectly.',
    tags: ['Interior'],
    source: 'dezeen.com',
    sIcon: '🛋️',
    comments: [
      {
        name: 'Cleo B.',
        i: 'CB',
        bg: '#d2b0c8',
        c: '#521843',
        text: 'This is my dream home vibe.',
        t: '1h',
      },
    ],
  },
  {
    id: 3,
    img: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&q=80',
    title: 'Avocado Toast Perfection',
    author: 'Chef Nina',
    aI: 'CN',
    aBg: '#c8d2b0',
    aC: '#425220',
    followers: '5.1k followers',
    desc: 'Sourdough toasted to a deep golden crunch, fresh avocado with lemon, and everything bagel seasoning. Life-changing brunch.',
    tags: ['Food'],
    source: 'foodnetwork.com',
    sIcon: '🥑',
    comments: [
      {
        name: 'Ravi P.',
        i: 'RP',
        bg: '#d2c8b0',
        c: '#524820',
        text: 'Made this yesterday, total game changer!',
        t: '3h',
      },
    ],
  },
  {
    id: 4,
    img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&q=80',
    title: 'Parisian Street Style',
    author: 'Vogue Paris',
    aI: 'VP',
    aBg: '#d2b0b8',
    aC: '#52202c',
    followers: '341k followers',
    desc: 'Effortless chic is not a myth—it is a daily practice. Layer textures, invest in fit, and let one statement piece carry the whole look.',
    tags: ['Fashion'],
    source: 'vogue.com',
    sIcon: '👗',
    comments: [],
  },
  {
    id: 5,
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80',
    title: 'Circuit Board Macro',
    author: 'TechVision',
    aI: 'TV',
    aBg: '#b0d2b8',
    aC: '#204528',
    followers: '12k followers',
    desc: 'The hidden beauty of electronics — every trace, pad, and component placed with purpose. A macro lens reveals the tiny city within.',
    tags: ['Technology'],
    source: 'hackster.io',
    sIcon: '💻',
    comments: [
      {
        name: 'Ali J.',
        i: 'AJ',
        bg: '#c8c8d2',
        c: '#303052',
        text: 'This would make an amazing wallpaper.',
        t: '5h',
      },
    ],
  },
  {
    id: 6,
    img: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=500&q=80',
    title: 'Tokyo by Night',
    author: 'Urban Wanderer',
    aI: 'UW',
    aBg: '#c8b0d2',
    aC: '#4a2066',
    followers: '89k followers',
    desc: 'Shinjuku at midnight is an overwhelming cascade of neon and humanity. Every alley hides a ramen shop or a jazz bar. Tokyo never sleeps.',
    tags: ['Travel', 'Architecture'],
    source: 'lonelyplanet.com',
    sIcon: '🌆',
    comments: [
      {
        name: 'Hana S.',
        i: 'HS',
        bg: '#d2c4b0',
        c: '#523c20',
        text: 'My hometown! This photo nails it.',
        t: '30m',
      },
    ],
  },
  {
    id: 7,
    img: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80',
    title: 'Polaroid Camera Revival',
    author: 'Film Lovers',
    aI: 'FL',
    aBg: '#b8c8d2',
    aC: '#244052',
    followers: '3.7k followers',
    desc: 'There is something irreplaceable about holding a physical photo that developed right in your hands. Instant film is not a gimmick—it is an experience.',
    tags: ['Art'],
    source: 'lomography.com',
    sIcon: '📷',
    comments: [],
  },
  {
    id: 8,
    img: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&q=80',
    title: 'Buddha Bowl Bright',
    author: 'Nourish Kitchen',
    aI: 'NK',
    aBg: '#c8d4b0',
    aC: '#40521c',
    followers: '22k followers',
    desc: 'Roasted sweet potato, crispy chickpeas, purple cabbage, microgreens, and a tahini lemon drizzle. Nutritious and genuinely beautiful.',
    tags: ['Food'],
    source: 'minimalistbaker.com',
    sIcon: '🥗',
    comments: [
      {
        name: 'Priya V.',
        i: 'PV',
        bg: '#d4b0c8',
        c: '#521c40',
        text: 'The colors in this bowl are stunning!',
        t: '1d',
      },
    ],
  },
  {
    id: 9,
    img: 'https://images.unsplash.com/photo-1491555103944-7c647fd857e6?w=500&q=80',
    title: 'Powder Day Colorado',
    author: 'Fresh Tracks',
    aI: 'FT',
    aBg: '#b0c4d4',
    aC: '#1c3c52',
    followers: '6.2k followers',
    desc: 'Waist-deep powder on a bluebird day. Breckenridge delivered everything it promised this season.',
    tags: ['Fitness', 'Travel'],
    source: 'powder.com',
    sIcon: '⛷️',
    comments: [],
  },
  {
    id: 10,
    img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&q=80',
    title: 'Vintage Book Collection',
    author: 'Bibliophile',
    aI: 'BI',
    aBg: '#d4c4b0',
    aC: '#52381c',
    followers: '14.5k followers',
    desc: 'Books arranged by spine color is controversial in librarian circles but aesthetically undeniable. These worn spines tell stories of their own.',
    tags: ['Books', 'Art'],
    source: 'bookriot.com',
    sIcon: '📚',
    comments: [
      {
        name: 'Ellie W.',
        i: 'EW',
        bg: '#c4b0d4',
        c: '#381c52',
        text: 'The smell of old books is unbeatable.',
        t: '2d',
      },
    ],
  },
  {
    id: 11,
    img: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=500&q=80',
    title: 'Lavender Fields Provence',
    author: 'Bloom Traveler',
    aI: 'BT',
    aBg: '#c4b0d4',
    aC: '#381c52',
    followers: '31k followers',
    desc: 'Every July, the Valensole plateau transforms into an endless purple carpet. The fragrance alone is worth the journey from Paris.',
    tags: ['Travel', 'Nature'],
    source: 'visitsouthfrance.com',
    sIcon: '💜',
    comments: [
      {
        name: 'Lena G.',
        i: 'LG',
        bg: '#b4d4b0',
        c: '#1c521c',
        text: 'This is my screensaver now. Perfect.',
        t: '6h',
      },
    ],
  },
  {
    id: 12,
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80',
    title: 'Home Gym Essentials',
    author: 'Strong & Simple',
    aI: 'SS',
    aBg: '#b4d4b0',
    aC: '#1c521c',
    followers: '9.8k followers',
    desc: 'You do not need a fancy membership. A barbell, a rack, and rings is all that stands between you and serious strength gains.',
    tags: ['Fitness'],
    source: 'strongerbyscience.com',
    sIcon: '💪',
    comments: [],
  },
  {
    id: 13,
    img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&q=80',
    title: 'Patagonia Peaks',
    author: 'Wild Roamer',
    aI: 'WR',
    aBg: '#b0c8d4',
    aC: '#1c4052',
    followers: '47k followers',
    desc: 'The Torres del Paine circuit is as demanding as it is rewarding. Plan for rapidly changing weather and book refugios months ahead.',
    tags: ['Travel', 'Nature'],
    source: 'chile.travel',
    sIcon: '🏕️',
    comments: [
      {
        name: 'Marco F.',
        i: 'MF',
        bg: '#d4c8b0',
        c: '#523c1c',
        text: 'Did this hike last year. Life-changing.',
        t: '4h',
      },
    ],
  },
  {
    id: 14,
    img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80',
    title: 'Code in the Dark',
    author: 'Dev Aesthetic',
    aI: 'DA',
    aBg: '#c8d4b0',
    aC: '#3c521c',
    followers: '55k followers',
    desc: 'A dark terminal, a mechanical keyboard, and a problem worth solving. There is a particular clarity that comes at 2am.',
    tags: ['Technology'],
    source: 'dev.to',
    sIcon: '💡',
    comments: [
      {
        name: 'Kim C.',
        i: 'KC',
        bg: '#d4b0c8',
        c: '#521c3c',
        text: 'This is my entire personality.',
        t: '8h',
      },
    ],
  },
  {
    id: 15,
    img: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=500&q=80',
    title: 'Japandi Bedroom',
    author: 'Wabi Spaces',
    aI: 'WS',
    aBg: '#d4b4b0',
    aC: '#521c18',
    followers: '28k followers',
    desc: 'The Japanese-Scandinavian hybrid is not a trend — it is a philosophy. Simplicity, craftsmanship, and the conscious absence of clutter.',
    tags: ['Interior', 'Art'],
    source: 'architecturaldigest.com',
    sIcon: '🏡',
    comments: [
      {
        name: 'Fiona T.',
        i: 'FT',
        bg: '#b0d4c0',
        c: '#1c5230',
        text: 'Those linen curtains are everything.',
        t: '1h',
      },
    ],
  },
  {
    id: 16,
    img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500&q=80',
    title: 'Golden Retrievers at Play',
    author: 'Happy Tails',
    aI: 'HT',
    aBg: '#d4c8b0',
    aC: '#52401c',
    followers: '112k followers',
    desc: 'Joy, pure and uncomplicated. Two goldens experiencing the ocean for the very first time is the content the internet was made for.',
    tags: ['Nature'],
    source: 'akc.org',
    sIcon: '🐾',
    comments: [
      {
        name: 'Julia R.',
        i: 'JR',
        bg: '#c8b0d4',
        c: '#40205c',
        text: 'I am now incapable of being sad.',
        t: '3h',
      },
    ],
  },
  {
    id: 17,
    img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500&q=80',
    title: 'Kyoto Temple Garden',
    author: 'Zen Traveler',
    aI: 'ZT',
    aBg: '#b0d4c8',
    aC: '#1c5244',
    followers: '19k followers',
    desc: 'The Ryoan-ji rock garden embodies ma — negative space used intentionally. Fifteen stones arranged so only 14 are ever visible at once.',
    tags: ['Travel', 'Architecture'],
    source: 'japan-guide.com',
    sIcon: '⛩️',
    comments: [],
  },
  {
    id: 18,
    img: 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=500&q=80',
    title: 'Flat Lay Desk Setup',
    author: 'Minimal Work',
    aI: 'MW',
    aBg: '#d4d0b0',
    aC: '#524c1c',
    followers: '7.3k followers',
    desc: 'A clean desk is a clean mind. This setup took three iterations to get the cable management right, but the result speaks for itself.',
    tags: ['Technology', 'Interior'],
    source: 'notion.so',
    sIcon: '🖥️',
    comments: [
      {
        name: 'Sam D.',
        i: 'SD',
        bg: '#b0c8d4',
        c: '#1c4052',
        text: 'What keyboard is that? Stunning.',
        t: '12h',
      },
    ],
  },
  {
    id: 19,
    img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80',
    title: 'Sushi Omakase',
    author: 'Umami Table',
    aI: 'UT',
    aBg: '#d4b0b4',
    aC: '#52181c',
    followers: '33k followers',
    desc: 'Twelve courses, each a precisely controlled act of restraint. Omakase is not just a meal — it is a form of trust between chef and guest.',
    tags: ['Food'],
    source: 'seriouseats.com',
    sIcon: '🍱',
    comments: [
      {
        name: 'Leo K.',
        i: 'LK',
        bg: '#b4c8d4',
        c: '#1c3c52',
        text: 'The uni course alone is worth it.',
        t: '2h',
      },
    ],
  },
  {
    id: 20,
    img: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=500&q=80',
    title: 'Northern Lights Iceland',
    author: 'Aurora Chaser',
    aI: 'AC',
    aBg: '#b0b4d4',
    aC: '#1c1c52',
    followers: '76k followers',
    desc: 'Chasing the aurora means long cold nights, remote locations, and enormous patience. When it finally appears, every freezing hour feels worth it.',
    tags: ['Travel', 'Nature'],
    source: 'inspiredbyiceland.com',
    sIcon: '🌌',
    comments: [
      {
        name: 'Ana V.',
        i: 'AV',
        bg: '#d4c0b0',
        c: '#523010',
        text: 'On my bucket list forever.',
        t: '1d',
      },
    ],
  },
];

// State
let activeCategory = 'All';
let savedPins = new Set();
let searchTerm = '';
let currentPin = null;
let followingCreators = new Set();
let allComments = {};
PINS.forEach((p) => {
  allComments[p.id] = p.comments.map((c) => ({ ...c }));
});

// Init
renderPills();
renderGrid();

function renderPills() {
  document.getElementById('pillsWrap').innerHTML = categories
    .map(
      (c) =>
        `<button class="pill${c === activeCategory ? ' active' : ''}" onclick="selectCategory('${c}')">${c}</button>`
    )
    .join('');
}

function selectCategory(cat) {
  activeCategory = cat;
  renderPills();
  renderGrid();
}

function setTab(el) {
  document
    .querySelectorAll('.nav-link')
    .forEach((b) => b.classList.remove('active'));
  el.classList.add('active');
  showToast(el.textContent + ' tab selected');
}

function handleSearch(val) {
  searchTerm = val.toLowerCase().trim();
  renderGrid();
}

function getFiltered() {
  return PINS.filter((p) => {
    const mCat = activeCategory === 'All' || p.tags.includes(activeCategory);
    const mSearch =
      !searchTerm ||
      p.title.toLowerCase().includes(searchTerm) ||
      p.author.toLowerCase().includes(searchTerm) ||
      p.tags.some((t) => t.toLowerCase().includes(searchTerm));
    return mCat && mSearch;
  });
}

function renderGrid() {
  const grid = document.getElementById('grid');
  const pins = getFiltered();
  if (!pins.length) {
    grid.innerHTML = `<div class="empty-state"><div class="emoji">🔍</div><h3>No pins found</h3><p>Try a different search or category.</p></div>`;
    return;
  }
  grid.innerHTML = pins
    .map((pin) => {
      const saved = savedPins.has(pin.id);
      return `<div class="pin" onclick="openModal(${pin.id})">
      <div class="pin-img-wrap">
        <img src="${pin.img}" alt="${pin.title}" loading="lazy" />
        <div class="pin-overlay">
          <div class="pin-top-row">
            <button class="save-btn${saved ? ' saved' : ''}" onclick="toggleSave(event,${pin.id})">${saved ? 'Saved' : 'Save'}</button>
          </div>
          <div class="pin-bottom-row">
            <span class="source-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              ${pin.source}
            </span>
            <button class="more-btn" onclick="event.stopPropagation();showToast('Options coming soon')">&#8943;</button>
          </div>
        </div>
      </div>
      <div class="pin-meta">
        <div class="pin-title">${pin.title}</div>
        <div class="pin-author">
          <span class="pin-author-avatar" style="background:${pin.aBg};color:${pin.aC}">${pin.aI}</span>
          ${pin.author}
        </div>
      </div>
    </div>`;
    })
    .join('');
}

function toggleSave(e, id) {
  e.stopPropagation();
  if (savedPins.has(id)) {
    savedPins.delete(id);
    showToast('Removed from saved');
  } else {
    savedPins.add(id);
    showToast('Saved to your board!');
  }
  renderGrid();
  if (currentPin && currentPin.id === id) updateModalSaveBtn();
}

// MODAL
function openModal(id) {
  const pin = PINS.find((p) => p.id === id);
  if (!pin) return;
  currentPin = pin;
  document.getElementById('modalImg').src = pin.img;
  document.getElementById('modalImg').alt = pin.title;
  document.getElementById('modalTitle').textContent = pin.title;
  document.getElementById('modalDesc').textContent = pin.desc;
  document.getElementById('modalSourceIcon').textContent = pin.sIcon;
  document.getElementById('modalSourceText').textContent = 'Visit source';
  document.getElementById('modalSourceUrl').textContent = pin.source;
  const sourceLink = document.getElementById('modalSource');
  sourceLink.href = pin.sourceUrl;
  document.getElementById('modalCreatorAvatar').textContent = pin.aI;
  document.getElementById('modalCreatorAvatar').style.background = pin.aBg;
  document.getElementById('modalCreatorAvatar').style.color = pin.aC;
  document.getElementById('modalCreatorName').textContent = pin.author;
  document.getElementById('modalCreatorFollows').textContent = pin.followers;
  const fb = document.getElementById('followBtn');
  fb.textContent = followingCreators.has(pin.author) ? 'Following' : 'Follow';
  fb.className =
    'follow-btn' + (followingCreators.has(pin.author) ? ' following' : '');
  updateModalSaveBtn();
  renderComments(id);
  document.getElementById('commentInput').value = '';
  document.getElementById('commentsTitle').textContent =
    `Comments (${allComments[id].length})`;
  document.getElementById('modalBackdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function updateModalSaveBtn() {
  if (!currentPin) return;
  const btn = document.getElementById('modalSaveBtn');
  const saved = savedPins.has(currentPin.id);
  btn.textContent = saved ? 'Saved' : 'Save';
  btn.className = 'modal-save-btn' + (saved ? ' saved' : '');
}

function toggleModalSave() {
  if (!currentPin) return;
  toggleSave({ stopPropagation: () => {} }, currentPin.id);
}

function toggleFollow() {
  if (!currentPin) return;
  const name = currentPin.author;
  const fb = document.getElementById('followBtn');
  if (followingCreators.has(name)) {
    followingCreators.delete(name);
    fb.textContent = 'Follow';
    fb.className = 'follow-btn';
    showToast('Unfollowed ' + name);
  } else {
    followingCreators.add(name);
    fb.textContent = 'Following';
    fb.className = 'follow-btn following';
    showToast('Following ' + name + '!');
  }
}

function renderComments(id) {
  const list = document.getElementById('commentsList');
  const comments = allComments[id] || [];
  if (!comments.length) {
    list.innerHTML =
      '<div style="font-size:13px;color:var(--muted);text-align:center;padding:16px 0;">No comments yet. Be the first!</div>';
    return;
  }
  list.innerHTML = comments
    .map(
      (c) => `
    <div class="comment">
      <div class="comment-avatar" style="background:${c.bg || '#e0d8d0'};color:${c.c || '#444'}">${c.i || '?'}</div>
      <div class="comment-body">
        <span class="comment-name">${c.name}</span>${c.text}
        <div class="comment-time">${c.t}</div>
      </div>
    </div>`
    )
    .join('');
}

function submitComment(e) {
  if (e.key !== 'Enter' || !currentPin) return;
  const input = document.getElementById('commentInput');
  const text = input.value.trim();
  if (!text) return;
  allComments[currentPin.id].unshift({
    name: 'You',
    i: 'YO',
    bg: '#e9d7c1',
    c: '#7a5230',
    text,
    t: 'Just now',
  });
  renderComments(currentPin.id);
  document.getElementById('commentsTitle').textContent =
    `Comments (${allComments[currentPin.id].length})`;
  input.value = '';
  showToast('Comment posted!');
}

function closeModal() {
  document.getElementById('modalBackdrop').classList.remove('open');
  document.body.style.overflow = '';
  currentPin = null;
}

function closeModalBackdrop(e) {
  if (e.target === document.getElementById('modalBackdrop')) closeModal();
}

// keyboard close
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// TOAST
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2500);
}
