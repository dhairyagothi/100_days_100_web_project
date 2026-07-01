// ─── Constants ────────────────────────────────────────────────────────────────
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SLOTS = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
const API = 'https://www.themealdb.com/api/json/v1/1';

// ─── State ────────────────────────────────────────────────────────────────────
let favorites  = loadFavorites();
let planner    = loadPlanner();
let pendingPlannerMeal = null; // meal being added to planner
let selectedDay  = DAYS[0];
let selectedSlot = SLOTS[0];

// ─── localStorage helpers ─────────────────────────────────────────────────────
function loadFavorites() {
  try { return JSON.parse(localStorage.getItem('recipeFavorites')) || []; } catch { return []; }
}
function saveFavorites() {
  try { localStorage.setItem('recipeFavorites', JSON.stringify(favorites)); } catch(e) { console.warn(e); }
}
function loadPlanner() {
  try { return JSON.parse(localStorage.getItem('recipePlanner')) || {}; } catch { return {}; }
}
function savePlanner() {
  try { localStorage.setItem('recipePlanner', JSON.stringify(planner)); } catch(e) { console.warn(e); }
}
function isFavorite(id) { return favorites.some(f => f.id === id); }

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const recipesGrid      = document.getElementById('recipesGrid');
const statusBox        = document.getElementById('statusBox');
const statusText       = document.getElementById('statusText');
const spinner          = document.getElementById('spinner');
const recipeModal      = document.getElementById('recipeModal');
const modalBody        = document.getElementById('modalBody');
const closeModal       = document.getElementById('closeModal');
const favoritesGrid    = document.getElementById('favoritesGrid');
const favoritesEmpty   = document.getElementById('favoritesEmpty');
const plannerGrid      = document.getElementById('plannerGrid');
const plannerModal     = document.getElementById('plannerModal');
const closePlannerModal= document.getElementById('closePlannerModal');
const plannerMealName  = document.getElementById('plannerMealName');
const dayButtons       = document.getElementById('dayButtons');
const confirmPlannerBtn= document.getElementById('confirmPlannerBtn');
const favCountBadge    = document.getElementById('favCountBadge');
const ingredientInput  = document.getElementById('ingredient-input');
const searchBtn        = document.getElementById('searchBtn');
const categoryFilter   = document.getElementById('categoryFilter');
const areaFilter       = document.getElementById('areaFilter');

// ─── Tab navigation ───────────────────────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    const panel = document.getElementById('tab-' + btn.dataset.tab);
    panel.classList.remove('hidden');
    panel.classList.add('active');
    if (btn.dataset.tab === 'favorites') renderFavorites();
    if (btn.dataset.tab === 'planner')   renderPlanner();
  });
});

// ─── Status helpers ───────────────────────────────────────────────────────────
function showStatus(msg, showSpinner = false) {
  statusBox.classList.remove('hidden');
  statusText.textContent = msg;
  spinner.style.display = showSpinner ? 'block' : 'none';
}
function hideStatus() { statusBox.classList.add('hidden'); }

// ─── Search ───────────────────────────────────────────────────────────────────
async function searchRecipes() {
  const query = ingredientInput.value.trim();
  const category = categoryFilter.value;
  const area = areaFilter.value;

  // Require at least one filter
  if (!query && !category && !area) {
    showStatus('Please enter an ingredient or select a filter.');
    return;
  }

  recipesGrid.innerHTML = '';
  showStatus('Searching for recipes...', true);

  try {
    let meals = null;

    if (query) {
      // Search by ingredient
      const res = await fetch(`${API}/filter.php?i=${encodeURIComponent(query)}`);
      const data = await res.json();
      meals = data.meals || [];
    } else if (category) {
      const res = await fetch(`${API}/filter.php?c=${encodeURIComponent(category)}`);
      const data = await res.json();
      meals = data.meals || [];
    } else if (area) {
      const res = await fetch(`${API}/filter.php?a=${encodeURIComponent(area)}`);
      const data = await res.json();
      meals = data.meals || [];
    }

    // Apply additional filters client-side if multiple set
    // (API only supports one filter at a time, so we fetch details selectively)
    if (!meals || meals.length === 0) {
      showStatus('No recipes found. Try a different ingredient or filter.');
      return;
    }

    hideStatus();
    renderRecipeCards(meals, recipesGrid, true);
  } catch (err) {
    showStatus('Failed to fetch recipes. Check your connection.');
    console.error(err);
  }
}

searchBtn.addEventListener('click', searchRecipes);
ingredientInput.addEventListener('keydown', e => { if (e.key === 'Enter') searchRecipes(); });

// ─── Render recipe cards ──────────────────────────────────────────────────────
function renderRecipeCards(meals, container, showBookmark = true) {
  container.innerHTML = '';
  meals.forEach(meal => {
    const fav = isFavorite(meal.idMeal);
    const card = document.createElement('div');
    card.className = 'meal-card';
    card.innerHTML = `
      ${showBookmark ? `
        <button class="bookmark-action-btn ${fav ? 'active' : ''}" data-id="${meal.idMeal}" data-name="${escHtml(meal.strMeal)}" data-thumb="${meal.strMealThumb}" title="${fav ? 'Remove from favorites' : 'Add to favorites'}" aria-label="Toggle favorite">
          ${fav ? '❤️' : '🤍'}
        </button>` : ''}
      <div class="card-img-wrapper">
        <img src="${meal.strMealThumb}" alt="${escHtml(meal.strMeal)}" loading="lazy" />
      </div>
      <div class="card-body">
        <div class="card-meta-tags">
          ${meal.strCategory ? `<span class="tag-label">${meal.strCategory}</span>` : ''}
          ${meal.strArea    ? `<span class="tag-label">${meal.strArea}</span>` : ''}
        </div>
        <h3 class="meal-title">${escHtml(meal.strMeal)}</h3>
        <button class="view-instructions-btn" data-id="${meal.idMeal}">View Recipe →</button>
      </div>`;
    container.appendChild(card);
  });

  // Bookmark toggles
  container.querySelectorAll('.bookmark-action-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      toggleFavorite({ id: btn.dataset.id, name: btn.dataset.name, thumb: btn.dataset.thumb });
      // Update this button immediately
      const nowFav = isFavorite(btn.dataset.id);
      btn.classList.toggle('active', nowFav);
      btn.textContent = nowFav ? '❤️' : '🤍';
      btn.title = nowFav ? 'Remove from favorites' : 'Add to favorites';
    });
  });

  // View recipe
  container.querySelectorAll('.view-instructions-btn').forEach(btn => {
    btn.addEventListener('click', () => fetchAndShowModal(btn.dataset.id));
  });
}

// ─── Favorites ────────────────────────────────────────────────────────────────
function toggleFavorite(meal) {
  if (isFavorite(meal.id)) {
    favorites = favorites.filter(f => f.id !== meal.id);
  } else {
    favorites.push({ id: meal.id, name: meal.name, thumb: meal.thumb });
  }
  saveFavorites();
  updateFavBadge();
}

function updateFavBadge() {
  favCountBadge.textContent = favorites.length;
  favCountBadge.style.display = favorites.length > 0 ? 'inline-flex' : 'none';
}

function renderFavorites() {
  if (!favorites.length) {
    favoritesEmpty.classList.remove('hidden');
    favoritesGrid.innerHTML = '';
    return;
  }
  favoritesEmpty.classList.add('hidden');
  // Convert favorites to meal-like objects for renderRecipeCards
  const meals = favorites.map(f => ({ idMeal: f.id, strMeal: f.name, strMealThumb: f.thumb }));
  renderRecipeCards(meals, favoritesGrid, true);
}

document.getElementById('clearFavoritesBtn').addEventListener('click', () => {
  if (!favorites.length) return;
  if (!confirm('Clear all favorites?')) return;
  favorites = [];
  saveFavorites();
  updateFavBadge();
  renderFavorites();
});

// ─── Recipe Detail Modal ──────────────────────────────────────────────────────
async function fetchAndShowModal(mealId) {
  recipeModal.classList.remove('hidden');
  modalBody.innerHTML = `<div class="status-box"><div class="spinner-element"></div><p>Loading recipe...</p></div>`;
  try {
    const res = await fetch(`${API}/lookup.php?i=${mealId}`);
    const data = await res.json();
    if (data.meals) showRecipeModal(data.meals[0]);
  } catch {
    modalBody.innerHTML = `<p style="color:#f43f5e">Failed to load recipe details.</p>`;
  }
}

function showRecipeModal(meal) {
  // Build ingredients list
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const msr = meal[`strMeasure${i}`];
    if (ing && ing.trim()) ingredients.push(`${msr ? msr.trim() + ' ' : ''}${ing.trim()}`);
  }

  const fav = isFavorite(meal.idMeal);

  modalBody.innerHTML = `
    <div class="modal-header">
      <img src="${meal.strMealThumb}" alt="${escHtml(meal.strMeal)}" />
      <h2>${escHtml(meal.strMeal)}</h2>
      <div class="modal-meta-row">
        ${meal.strCategory ? `<span class="tag-label">${meal.strCategory}</span>` : ''}
        ${meal.strArea     ? `<span class="tag-label">${meal.strArea}</span>`     : ''}
        ${meal.strTags ? meal.strTags.split(',').map(t => t.trim()).filter(Boolean).map(t => `<span class="tag-label">${t}</span>`).join('') : ''}
      </div>
      <div class="modal-action-row">
        <button class="modal-fav-btn ${fav ? 'active' : ''}" id="modalFavBtn" data-id="${meal.idMeal}" data-name="${escHtml(meal.strMeal)}" data-thumb="${meal.strMealThumb}">
          ${fav ? '❤️ Saved' : '🤍 Save to Favorites'}
        </button>
        <button class="modal-planner-btn" id="modalPlannerBtn" data-id="${meal.idMeal}" data-name="${escHtml(meal.strMeal)}" data-thumb="${meal.strMealThumb}">
          📅 Add to Planner
        </button>
        ${meal.strYoutube ? `<a class="modal-yt-btn" href="${meal.strYoutube}" target="_blank" rel="noopener">▶ Watch Video</a>` : ''}
      </div>
    </div>

    <div class="ingredients-panel">
      <h3>Ingredients</h3>
      <ul class="ingredients-list">
        ${ingredients.map(i => `<li>${escHtml(i)}</li>`).join('')}
      </ul>
    </div>

    <div class="directions-panel">
      <h3>Instructions</h3>
      <p>${escHtml(meal.strInstructions)}</p>
    </div>`;

  // Favorite toggle inside modal
  document.getElementById('modalFavBtn').addEventListener('click', function() {
    toggleFavorite({ id: this.dataset.id, name: this.dataset.name, thumb: this.dataset.thumb });
    const nowFav = isFavorite(this.dataset.id);
    this.classList.toggle('active', nowFav);
    this.textContent = nowFav ? '❤️ Saved' : '🤍 Save to Favorites';
    // Also update cards in search/favorites grid
    document.querySelectorAll(`.bookmark-action-btn[data-id="${this.dataset.id}"]`).forEach(btn => {
      btn.classList.toggle('active', nowFav);
      btn.textContent = nowFav ? '❤️' : '🤍';
    });
  });

  // Add to planner
  document.getElementById('modalPlannerBtn').addEventListener('click', function() {
    openPlannerModal({ id: this.dataset.id, name: this.dataset.name, thumb: this.dataset.thumb });
  });
}

closeModal.addEventListener('click', () => recipeModal.classList.add('hidden'));
recipeModal.addEventListener('click', e => { if (e.target === recipeModal) recipeModal.classList.add('hidden'); });

// ─── Meal Planner ─────────────────────────────────────────────────────────────
function openPlannerModal(meal) {
  pendingPlannerMeal = meal;
  selectedDay  = DAYS[0];
  selectedSlot = SLOTS[0];
  plannerMealName.textContent = meal.name;

  // Build day buttons
  dayButtons.innerHTML = '';
  DAYS.forEach(day => {
    const btn = document.createElement('button');
    btn.className = 'day-btn' + (day === selectedDay ? ' active' : '');
    btn.textContent = day.slice(0, 3); // Mon, Tue...
    btn.title = day;
    btn.addEventListener('click', () => {
      selectedDay = day;
      document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
    dayButtons.appendChild(btn);
  });

  // Slot buttons
  document.querySelectorAll('.slot-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.slot === selectedSlot);
    btn.onclick = () => {
      selectedSlot = btn.dataset.slot;
      document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    };
  });

  plannerModal.classList.remove('hidden');
}

closePlannerModal.addEventListener('click', () => plannerModal.classList.add('hidden'));
plannerModal.addEventListener('click', e => { if (e.target === plannerModal) plannerModal.classList.add('hidden'); });

confirmPlannerBtn.addEventListener('click', () => {
  if (!pendingPlannerMeal) return;
  const key = `${selectedDay}__${selectedSlot}`;
  planner[key] = { ...pendingPlannerMeal, day: selectedDay, slot: selectedSlot };
  savePlanner();
  plannerModal.classList.add('hidden');
  pendingPlannerMeal = null;

  // Show a toast-style confirmation
  showPlannerToast(`✅ Added to ${selectedDay} ${selectedSlot}`);
});

function showPlannerToast(msg) {
  let toast = document.getElementById('plannerToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'plannerToast';
    toast.className = 'planner-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ─── Render Planner ───────────────────────────────────────────────────────────
function renderPlanner() {
  plannerGrid.innerHTML = '';
  DAYS.forEach(day => {
    const dayCol = document.createElement('div');
    dayCol.className = 'planner-day-col';
    dayCol.innerHTML = `<div class="planner-day-header">${day}</div>`;

    SLOTS.forEach(slot => {
      const key = `${day}__${slot}`;
      const meal = planner[key];
      const slotEl = document.createElement('div');
      slotEl.className = 'planner-slot' + (meal ? ' has-meal' : '');

      if (meal) {
        slotEl.innerHTML = `
          <div class="planner-slot-label">${slotEmoji(slot)} ${slot}</div>
          <img class="planner-thumb" src="${meal.thumb}" alt="${escHtml(meal.name)}" />
          <div class="planner-meal-title">${escHtml(meal.name)}</div>
          <div class="planner-slot-actions">
            <button class="planner-view-btn" data-id="${meal.id}">View</button>
            <button class="planner-remove-btn" data-key="${key}">✕</button>
          </div>`;
        slotEl.querySelector('.planner-view-btn').addEventListener('click', () => {
          fetchAndShowModal(meal.id);
        });
        slotEl.querySelector('.planner-remove-btn').addEventListener('click', () => {
          delete planner[key];
          savePlanner();
          renderPlanner();
        });
      } else {
        slotEl.innerHTML = `
          <div class="planner-slot-label">${slotEmoji(slot)} ${slot}</div>
          <div class="planner-empty-slot">+ Add meal</div>`;
      }
      dayCol.appendChild(slotEl);
    });

    plannerGrid.appendChild(dayCol);
  });
}

function slotEmoji(slot) {
  return { Breakfast: '🌅', Lunch: '☀️', Dinner: '🌙', Snack: '🍎' }[slot] || '🍽';
}

document.getElementById('clearPlannerBtn').addEventListener('click', () => {
  if (!Object.keys(planner).length) return;
  if (!confirm('Clear the entire week plan?')) return;
  planner = {};
  savePlanner();
  renderPlanner();
});

// ─── Utility ──────────────────────────────────────────────────────────────────
function escHtml(s) {
  if (!s) return '';
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
// ─── Shopping List ────────────────────────────────────────────────────────────
document.getElementById('generateShoppingBtn').addEventListener('click', generateShoppingList);
document.getElementById('clearShoppingBtn').addEventListener('click', () => {
  document.getElementById('shoppingListBox').innerHTML = '';
});

async function generateShoppingList() {
  const box = document.getElementById('shoppingListBox');
  const plannedIds = [...new Set(Object.values(planner).map(m => m.id))];

  if (!plannedIds.length) {
    box.innerHTML = `<div class="shopping-empty">No meals planned yet. Add recipes to the planner first.</div>`;
    return;
  }

  box.innerHTML = `<div class="status-box" style="padding:1.5rem"><div class="spinner-element"></div><p>Building your list…</p></div>`;

  try {
    const results = await Promise.all(
      plannedIds.map(id => fetch(`${API}/lookup.php?i=${id}`).then(r => r.json()))
    );

    // Collect all ingredients across all planned meals
    const ingredientMap = {}; // ingredient name → array of measures
    results.forEach(data => {
      const meal = data.meals?.[0];
      if (!meal) return;
      for (let i = 1; i <= 20; i++) {
        const ing = meal[`strIngredient${i}`]?.trim();
        const msr = meal[`strMeasure${i}`]?.trim();
        if (!ing) continue;
        const key = ing.toLowerCase();
        if (!ingredientMap[key]) ingredientMap[key] = { name: ing, measures: [] };
        if (msr) ingredientMap[key].measures.push(msr);
      }
    });

    const items = Object.values(ingredientMap);
    if (!items.length) {
      box.innerHTML = `<div class="shopping-empty">No ingredients found.</div>`;
      return;
    }

    const mealWord = plannedIds.length === 1 ? 'meal' : 'meals';
    box.innerHTML = `
      <p class="shopping-meta">${items.length} ingredients across ${plannedIds.length} planned ${mealWord}</p>
      <div class="shopping-grid" id="shoppingGrid"></div>`;

    const grid = document.getElementById('shoppingGrid');
    items.forEach(({ name, measures }) => {
      const label = measures.length ? `${measures.join(' + ')} ${name}` : name;
      const el = document.createElement('label');
      el.className = 'shopping-item';
      el.innerHTML = `<input type="checkbox" /><span>${escHtml(label)}</span>`;
      el.querySelector('input').addEventListener('change', function() {
        el.classList.toggle('checked', this.checked);
      });
      grid.appendChild(el);
    });
  } catch {
    box.innerHTML = `<div class="shopping-empty">Failed to load ingredients. Check your connection.</div>`;
  }
}

// ─── Init ─────────────────────────────────────────────────────────────────────
updateFavBadge();