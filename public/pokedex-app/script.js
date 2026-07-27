/* ============================================================
   POKÉDEX — Complete JS
   ============================================================ */
'use strict';

// ── Constants ──────────────────────────────────────────────────
const API         = 'https://pokeapi.co/api/v2';
const STORAGE_KEY = 'pokedex_favs';
const SETTINGS_KEY= 'pokedex_settings';
const PAGE_SIZE   = 40;

const TYPE_COLORS = {
  fire:'#ff6b35', water:'#4fc3f7', grass:'#66bb6a',
  electric:'#ffd54f', psychic:'#f06292', ice:'#80deea',
  dragon:'#7c4dff', dark:'#455a64', fairy:'#f48fb1',
  fighting:'#e53935', poison:'#ab47bc', ground:'#d4a017',
  rock:'#8d6e63', bug:'#8bc34a', ghost:'#5c6bc0',
  steel:'#78909c', normal:'#a1a1aa', flying:'#90caf9'
};

const STAT_COLORS = {
  hp:'#ef4444', attack:'#f97316', defense:'#f59e0b',
  'special-attack':'#8b5cf6', 'special-defense':'#06b6d4', speed:'#22c55e'
};

const GEN_RANGES = {
  '1':{ start:1,   end:151  },
  '2':{ start:152, end:251  },
  '3':{ start:252, end:386  },
  '4':{ start:387, end:493  },
  '5':{ start:494, end:649  },
  '6':{ start:650, end:721  },
  '7':{ start:722, end:809  },
  '8':{ start:810, end:905  },
  '9':{ start:906, end:1025 }
};

// ── State ──────────────────────────────────────────────────────
let settings     = { theme: 'dark' };
let favorites    = [];
let allPokemon   = [];
let filtered     = [];
let currentPage  = 0;
let isLoading    = false;
let activeType   = 'all';
let activeGen    = 'all';
let searchQuery  = '';
let sortMode     = 'id-asc';
let viewMode     = 'grid';
let showFavsOnly = false;
let compareList  = [];
let currentPoke  = null;

// ── DOM ────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

// ── Init ───────────────────────────────────────────────────────
function init() {
  loadSettings();
  applyTheme();
  loadFavs();
  bindEvents();
  fetchPokemon();
}

// ── Storage ────────────────────────────────────────────────────
function loadSettings() {
  try {
    settings  = { theme:'dark', ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') };
    favorites = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch(e) {}
}
function saveSettings() { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); }
function saveFavs()     { localStorage.setItem(STORAGE_KEY,  JSON.stringify(favorites)); }

// ── Theme ──────────────────────────────────────────────────────
function applyTheme() {
  document.documentElement.setAttribute('data-theme', settings.theme);
  $('themeToggle').querySelector('i').className =
    settings.theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}
function toggleTheme() {
  settings.theme = settings.theme === 'dark' ? 'light' : 'dark';
  applyTheme(); saveSettings();
}

// ── Bind Events ────────────────────────────────────────────────
function bindEvents() {
  $('themeToggle').addEventListener('click', toggleTheme);

  $('favBtn').addEventListener('click', () => {
    showFavsOnly = !showFavsOnly;
    $('favFilter').classList.toggle('fav-active', showFavsOnly);
    $('favBtn').style.background = showFavsOnly ? 'var(--pink)' : '';
    $('favBtn').style.color      = showFavsOnly ? '#fff' : '';
    applyFilters();
  });

  $('compareBtn').addEventListener('click', () => {
    $('compareBar').classList.toggle('hidden');
    if($('compareBar').classList.contains('hidden')) {
      compareList = []; updateCompareBar();
    }
  });

  $('searchInput').addEventListener('input', () => {
    searchQuery = $('searchInput').value.trim().toLowerCase();
    $('clearSearch').classList.toggle('visible', searchQuery.length > 0);
    applyFilters();
  });
  $('clearSearch').addEventListener('click', () => {
    $('searchInput').value = ''; searchQuery = '';
    $('clearSearch').classList.remove('visible');
    applyFilters();
  });

  $('genSelect').addEventListener('change', () => {
    activeGen = $('genSelect').value;
    $('currentGen').textContent = activeGen === 'all' ? 'All' : `Gen ${activeGen}`;
    applyFilters();
  });

  $('sortSelect').addEventListener('change', () => {
    sortMode = $('sortSelect').value;
    applyFilters();
  });

  $('gridView').addEventListener('click', () => { viewMode = 'grid'; setViewMode(); });
  $('listView').addEventListener('click', () => { viewMode = 'list'; setViewMode(); });
  $('favFilter').addEventListener('click', () => {
    showFavsOnly = !showFavsOnly;
    $('favFilter').classList.toggle('fav-active', showFavsOnly);
    applyFilters();
  });

  document.querySelectorAll('.type-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.type-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeType = chip.dataset.type;
      applyFilters();
    });
  });

  $('loadMoreBtn').addEventListener('click', loadMorePokemon);

  $('modalClose').addEventListener('click', closeModal);
  $('modalOverlay').addEventListener('click', e => {
    if(e.target === $('modalOverlay')) closeModal();
  });

  document.querySelectorAll('.modal-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const name = tab.dataset.tab;
      ['Stats','Abilities','Moves','Evolution'].forEach(t => {
        $(`tab${t}`).classList.toggle('hidden', t.toLowerCase() !== name);
      });
    });
  });

  $('crybBtn').addEventListener('click', playCry);
  $('favModalBtn').addEventListener('click', toggleFavFromModal);
  $('addCompareBtn').addEventListener('click', addToCompare);

  $('compareNowBtn').addEventListener('click', openCompareModal);
  $('clearCompare').addEventListener('click', () => {
    compareList = []; updateCompareBar();
  });
  $('compareClose').addEventListener('click', () => {
    $('compareOverlay').classList.remove('open');
    document.body.style.overflow = '';
  });

  document.addEventListener('keydown', e => {
    if(e.key === 'Escape') { closeModal(); $('compareOverlay').classList.remove('open'); }
  });
}

// ── Fetch Pokemon ──────────────────────────────────────────────
async function fetchPokemon() {
  if(isLoading) return;
  isLoading = true;
  $('loadingWrap').style.display = 'block';
  $('loadMoreWrap').classList.add('hidden');

  try {
    const offset = currentPage * PAGE_SIZE;
    const res    = await fetch(`${API}/pokemon?limit=${PAGE_SIZE}&offset=${offset}`);
    const data   = await res.json();

    const details = await Promise.allSettled(
      data.results.map(p => fetch(p.url).then(r => r.json()))
    );

    const newPoke = details
      .filter(d => d.status === 'fulfilled')
      .map(d => d.value);

    allPokemon = [...allPokemon, ...newPoke];
    currentPage++;

    applyFilters();
    updateStats();
  } catch(e) {
    showToast('Failed to load Pokémon. Check your connection.', 'error');
  } finally {
    isLoading = false;
    $('loadingWrap').style.display = 'none';
    $('loadMoreWrap').classList.remove('hidden');
  }
}

async function loadMorePokemon() {
  await fetchPokemon();
}

// ── Filter & Sort ──────────────────────────────────────────────
function applyFilters() {
  let list = [...allPokemon];

  // Gen filter
  if(activeGen !== 'all') {
    const range = GEN_RANGES[activeGen];
    list = list.filter(p => p.id >= range.start && p.id <= range.end);
  }

  // Type filter
  if(activeType !== 'all') {
    list = list.filter(p => p.types.some(t => t.type.name === activeType));
  }

  // Search
  if(searchQuery) {
    list = list.filter(p =>
      p.name.includes(searchQuery) ||
      String(p.id).includes(searchQuery)
    );
  }

  // Favorites
  if(showFavsOnly) {
    list = list.filter(p => favorites.includes(p.id));
  }

  // Sort
  list = sortPokemon(list);

  filtered = list;
  renderGrid();
  updateStats();
}

function sortPokemon(list) {
  const sorted = [...list];
  if(sortMode === 'id-asc')    sorted.sort((a,b) => a.id - b.id);
  if(sortMode === 'id-desc')   sorted.sort((a,b) => b.id - a.id);
  if(sortMode === 'name-asc')  sorted.sort((a,b) => a.name.localeCompare(b.name));
  if(sortMode === 'name-desc') sorted.sort((a,b) => b.name.localeCompare(a.name));
  return sorted;
}

// ── Render Grid ────────────────────────────────────────────────
function renderGrid() {
  const grid = $('pokemonGrid');
  grid.innerHTML = '';

  if(filtered.length === 0) {
    $('emptyState').classList.remove('hidden');
    return;
  }
  $('emptyState').classList.add('hidden');

  filtered.forEach((p, i) => {
    const card = buildCard(p);
    card.style.animationDelay = `${(i % PAGE_SIZE) * 20}ms`;
    grid.appendChild(card);
  });
}

function buildCard(p) {
  const primaryType = p.types[0]?.type.name || 'normal';
  const color       = TYPE_COLORS[primaryType] || '#94a3b8';
  const isFav       = favorites.includes(p.id);
  const sprite      = p.sprites?.other?.['official-artwork']?.front_default ||
                      p.sprites?.front_default || '';

  const card = document.createElement('div');
  card.className = `poke-card ${viewMode === 'list' ? 'list-mode' : ''}`;
  card.style.borderTopColor = color;
  card.style.setProperty('--card-color', color);
  card.dataset.id = p.id;

  card.innerHTML = `
    <button class="poke-fav-btn ${isFav ? 'active' : ''}" data-id="${p.id}" title="Favorite">
      <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
    </button>
    <div class="poke-num">#${String(p.id).padStart(3,'0')}</div>
    <img class="poke-img" src="${sprite}" alt="${p.name}"
      loading="lazy" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png'"/>
    <div class="poke-info">
      <div class="poke-name">${p.name}</div>
      <div class="poke-types">
        ${p.types.map(t => `<span class="type-badge type-${t.type.name}">${t.type.name}</span>`).join('')}
      </div>
    </div>
  `;

  card.style.borderTop = `4px solid ${color}`;

  card.querySelector('.poke-fav-btn').addEventListener('click', e => {
    e.stopPropagation();
    toggleFav(p.id, e.currentTarget);
  });

  card.addEventListener('click', () => openModal(p));
  return card;
}

// ── View Mode ──────────────────────────────────────────────────
function setViewMode() {
  $('pokemonGrid').className = `pokemon-grid${viewMode === 'list' ? ' list-mode' : ''}`;
  $('gridView').classList.toggle('active', viewMode === 'grid');
  $('listView').classList.toggle('active', viewMode === 'list');
  renderGrid();
}

// ── Favorites ──────────────────────────────────────────────────
function toggleFav(id, btn) {
  const idx = favorites.indexOf(id);
  if(idx === -1) {
    favorites.push(id);
    btn.classList.add('active');
    btn.querySelector('i').className = 'fas fa-heart';
    showToast('Added to favorites!', 'success');
  } else {
    favorites.splice(idx, 1);
    btn.classList.remove('active');
    btn.querySelector('i').className = 'far fa-heart';
    showToast('Removed from favorites.', 'info');
  }
  saveFavs(); loadFavs(); updateStats();
  if(showFavsOnly) applyFilters();
}

function loadFavs() {
  $('favBadge').textContent = favorites.length;
  $('totalFavs').textContent = favorites.length;
}

function toggleFavFromModal() {
  if(!currentPoke) return;
  const id  = currentPoke.id;
  const btn = $('favModalBtn');
  const idx = favorites.indexOf(id);
  if(idx === -1) {
    favorites.push(id);
    btn.classList.add('active');
    btn.innerHTML = '<i class="fas fa-heart"></i> Favorited';
    showToast('Added to favorites!', 'success');
  } else {
    favorites.splice(idx, 1);
    btn.classList.remove('active');
    btn.innerHTML = '<i class="far fa-heart"></i> Add to Favorites';
    showToast('Removed from favorites.', 'info');
  }
  saveFavs(); loadFavs(); updateStats();
  // Update card in grid
  const card = document.querySelector(`.poke-card[data-id="${id}"]`);
  if(card) {
    const favBtn = card.querySelector('.poke-fav-btn');
    favBtn?.classList.toggle('active', favorites.includes(id));
    if(favBtn) favBtn.querySelector('i').className = favorites.includes(id) ? 'fas fa-heart' : 'far fa-heart';
  }
}

// ── Modal ──────────────────────────────────────────────────────
async function openModal(p) {
  currentPoke = p;
  $('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';

  // Basic info
  $('modalId').textContent   = `#${String(p.id).padStart(3,'0')}`;
  $('modalName').textContent = p.name;
  $('modalHeight').textContent = `${(p.height / 10).toFixed(1)}m`;
  $('modalWeight').textContent = `${(p.weight / 10).toFixed(1)}kg`;
  $('modalExp').textContent    = p.base_experience || '—';

  // Sprites
  const mainSprite = p.sprites?.other?.['official-artwork']?.front_default ||
                     p.sprites?.front_default || '';
  const shinySprite = p.sprites?.other?.['official-artwork']?.front_shiny ||
                      p.sprites?.front_shiny || '';
  $('modalSprite').src = mainSprite;
  $('modalShiny').src  = shinySprite;

  // Header bg color
  const primaryType = p.types[0]?.type.name || 'normal';
  const color       = TYPE_COLORS[primaryType] || '#6366f1';
  $('modalHeader').style.background = `linear-gradient(135deg, ${color}22, transparent)`;

  // Types
  $('modalTypes').innerHTML = p.types.map(t =>
    `<span class="type-badge type-${t.type.name}">${t.type.name}</span>`
  ).join('');

  // Stats
  $('statsList').innerHTML = p.stats.map(s => {
    const val   = s.base_stat;
    const pct   = Math.min((val / 255) * 100, 100);
    const sColor= STAT_COLORS[s.stat.name] || '#6366f1';
    return `
      <div class="stat-row">
        <span class="stat-name">${s.stat.name.replace('-',' ')}</span>
        <span class="stat-val">${val}</span>
        <div class="stat-bar-wrap">
          <div class="stat-bar" style="width:0%;background:${sColor}" data-pct="${pct}"></div>
        </div>
      </div>
    `;
  }).join('');
  requestAnimationFrame(() => {
    $('statsList').querySelectorAll('.stat-bar').forEach(b => {
      setTimeout(() => { b.style.width = b.dataset.pct + '%'; }, 100);
    });
  });

  // Favorite button state
  const isFav = favorites.includes(p.id);
  $('favModalBtn').classList.toggle('active', isFav);
  $('favModalBtn').innerHTML = isFav
    ? '<i class="fas fa-heart"></i> Favorited'
    : '<i class="far fa-heart"></i> Add to Favorites';

  // Reset tabs
  document.querySelectorAll('.modal-tab').forEach((t,i) => t.classList.toggle('active', i===0));
  ['Stats','Abilities','Moves','Evolution'].forEach((t,i) => {
    $(` tab${t}`)?.classList.toggle('hidden', i !== 0);
  });
  $('tabStats').classList.remove('hidden');
  $('tabAbilities').classList.add('hidden');
  $('tabMoves').classList.add('hidden');
  $('tabEvolution').classList.add('hidden');

  // Fetch species data for abilities desc, evolution
  try {
    const speciesRes = await fetch(`${API}/pokemon-species/${p.id}`);
    const species    = await speciesRes.json();

    // Abilities
    const abilityDetails = await Promise.allSettled(
      p.abilities.map(a => fetch(a.ability.url).then(r => r.json()))
    );
    $('abilitiesList').innerHTML = p.abilities.map((a, i) => {
      const detail = abilityDetails[i].status === 'fulfilled' ? abilityDetails[i].value : null;
      const desc   = detail?.flavor_text_entries?.find(e => e.language.name === 'en')?.flavor_text || '';
      return `
        <div class="ability-item">
          <div class="ability-name">${a.ability.name.replace('-',' ')}
            ${a.is_hidden ? '<span class="ability-hidden">Hidden</span>' : ''}
          </div>
          <div class="ability-desc">${desc || 'No description available.'}</div>
        </div>
      `;
    }).join('');

    // Moves
    const moves = p.moves.slice(0, 40);
    $('movesList').innerHTML = moves.map(m =>
      `<span class="move-badge">${m.move.name.replace('-',' ')}</span>`
    ).join('');

    // Evolution Chain
    const evoRes    = await fetch(species.evolution_chain.url);
    const evoData   = await evoRes.json();
    const chain     = [];
    let   current   = evoData.chain;

    while(current) {
      chain.push(current.species.name);
      current = current.evolves_to?.[0];
    }

    const evoHTML = await Promise.all(chain.map(async name => {
      const res  = await fetch(`${API}/pokemon/${name}`);
      const data = await res.json();
      const img  = data.sprites?.other?.['official-artwork']?.front_default ||
                   data.sprites?.front_default || '';
      return `
        <div class="evo-item" data-id="${data.id}" title="${name}">
          <img class="evo-img" src="${img}" alt="${name}"/>
          <div class="evo-name">${name}</div>
        </div>
      `;
    }));

    $('evolutionChain').innerHTML = evoHTML
      .map((h, i) => i < evoHTML.length - 1 ? h + '<span class="evo-arrow">→</span>' : h)
      .join('');

    // Click evo to open
    $('evolutionChain').querySelectorAll('.evo-item').forEach(el => {
      el.addEventListener('click', async () => {
        const id  = parseInt(el.dataset.id);
        const ep  = allPokemon.find(p => p.id === id);
        if(ep) { closeModal(); setTimeout(() => openModal(ep), 300); }
      });
    });

  } catch(e) {
    $('abilitiesList').innerHTML = '<p style="color:var(--text3)">Could not load ability details.</p>';
    $('evolutionChain').innerHTML = '<p style="color:var(--text3)">Could not load evolution chain.</p>';
  }
}

function closeModal() {
  $('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
  currentPoke = null;
}

// ── Play Cry ───────────────────────────────────────────────────
function playCry() {
  if(!currentPoke) return;
  try {
    const audio = new Audio(
      `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${currentPoke.id}.ogg`
    );
    audio.volume = 0.6;
    audio.play();
    showToast(`Playing ${currentPoke.name}'s cry!`, 'info');
  } catch(e) {
    showToast('Could not play cry.', 'error');
  }
}

// ── Compare ────────────────────────────────────────────────────
function addToCompare() {
  if(!currentPoke) return;
  if(compareList.some(p => p.id === currentPoke.id)) {
    showToast('Already in compare list.', 'info'); return;
  }
  if(compareList.length >= 2) {
    showToast('You can only compare 2 Pokémon at a time.', 'error'); return;
  }
  compareList.push(currentPoke);
  $('compareBar').classList.remove('hidden');
  updateCompareBar();
  showToast(`${currentPoke.name} added to compare!`, 'success');
  closeModal();
}

function updateCompareBar() {
  ['slot1','slot2'].forEach((slotId, i) => {
    const slot = $(slotId);
    const p    = compareList[i];
    if(p) {
      const sprite = p.sprites?.front_default || '';
      slot.innerHTML = `<img src="${sprite}" style="width:32px;height:32px"/><span>${p.name}</span>`;
      slot.classList.add('filled');
    } else {
      slot.innerHTML = `<span>Select Pokémon ${i+1}</span>`;
      slot.classList.remove('filled');
    }
  });
  $('compareNowBtn').classList.toggle('hidden', compareList.length < 2);
}

function openCompareModal() {
  if(compareList.length < 2) { showToast('Select 2 Pokémon to compare.', 'error'); return; }
  const [p1, p2] = compareList;
  const content  = $('compareContent');

  const statNames = ['hp','attack','defense','special-attack','special-defense','speed'];

  function getStats(p) {
    const map = {};
    p.stats.forEach(s => { map[s.stat.name] = s.base_stat; });
    return map;
  }

  const s1 = getStats(p1);
  const s2 = getStats(p2);

  function buildPokeCol(p, stats, align) {
    const img = p.sprites?.other?.['official-artwork']?.front_default || p.sprites?.front_default || '';
    const statsHTML = statNames.map(name => {
      const val   = stats[name] || 0;
      const pct   = Math.min((val/255)*100,100);
      const col   = STAT_COLORS[name] || '#6366f1';
      return `
        <div class="compare-stat-row" style="flex-direction:${align==='left'?'row':'row-reverse'}">
          <span class="compare-stat-name">${name.replace('-',' ')}</span>
          <span class="compare-stat-val" style="color:${col}">${val}</span>
          <div class="compare-stat-bar-wrap">
            <div class="compare-stat-bar" style="width:${pct}%;background:${col}"></div>
          </div>
        </div>
      `;
    }).join('');
    return `
      <div class="compare-poke">
        <img class="compare-poke-img" src="${img}" alt="${p.name}"/>
        <div class="compare-poke-name">${p.name}</div>
        <div class="modal-types" style="justify-content:center;margin-bottom:12px">
          ${p.types.map(t=>`<span class="type-badge type-${t.type.name}">${t.type.name}</span>`).join('')}
        </div>
        ${statsHTML}
      </div>
    `;
  }

  content.innerHTML = `
    ${buildPokeCol(p1, s1, 'left')}
    <div class="compare-vs-col"><span class="vs-text">VS</span></div>
    ${buildPokeCol(p2, s2, 'right')}
  `;

  $('compareOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

// ── Stats Update ───────────────────────────────────────────────
function updateStats() {
  $('totalLoaded').textContent  = allPokemon.length;
  $('totalFavs').textContent    = favorites.length;
  $('totalFiltered').textContent= filtered.length;
}

// ── Toast ──────────────────────────────────────────────────────
let toastTimer;
function showToast(msg, type = 'success') {
  clearTimeout(toastTimer);
  $('toastMsg').textContent = msg;
  const icon = $('toast').querySelector('.toast-icon');
  icon.className = `toast-icon fas ${
    type === 'success' ? 'fa-check-circle' :
    type === 'error'   ? 'fa-times-circle' : 'fa-info-circle'
  }`;
  $('toast').className = `toast ${type} show`;
  toastTimer = setTimeout(() => $('toast').classList.remove('show'), 3000);
}

// ── Helpers ────────────────────────────────────────────────────
function cap(str) { return str.charAt(0).toUpperCase() + str.slice(1); }

// ── Start ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);