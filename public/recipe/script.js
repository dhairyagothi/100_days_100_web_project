// ================================
// rec.html logic — loads recipe grid + search + filter + restart
// ================================

const searchInput = document.getElementById("searchInput");
const difficultySelect = document.getElementById("difficulty");
const startBtn = document.getElementById("start");
const randomBtn = document.getElementById("randomRecipe");
const recipeGrid = document.getElementById("recipeGrid");
const restartBtn = document.getElementById("restart");

let allRecipes = [];

// Load recipes from text.json
function loadRecipes() {
  if (recipeGrid) {
    recipeGrid.innerHTML = '<div class="loading">Loading recipes...</div>';
  }

  fetch("text.json")
    .then((res) => res.json())
    .then((data) => {
      allRecipes = Array.isArray(data)
      ? data
      : data.recipes || [];
      // Populate difficulty/category filter
      if (difficultySelect) {
        const categories = [...new Set(allRecipes.flatMap(r => r.tags || []))];
        difficultySelect.innerHTML = '<option value="">All Recipes</option>';
        categories.forEach(cat => {
          const opt = document.createElement("option");
          opt.value = cat;
          opt.textContent = cat;
          difficultySelect.appendChild(opt);
        });
      }

      renderRecipes(allRecipes);
    })
    .catch((err) => {
      console.error("Failed to load recipes:", err);
      if (recipeGrid) {
        recipeGrid.innerHTML = '<div class="loading">Failed to load recipes. Please try again.</div>';
      }
    });
}

// Render recipe cards
function renderRecipes(recipes) {
  if (!recipeGrid) return;

  if (recipes.length === 0) {
    recipeGrid.innerHTML = '<div class="loading">No recipes found.</div>';
    return;
  }

  recipeGrid.innerHTML = recipes.map((recipe, index) => `
    <div class="recipe-card" onclick="showRecipe(${index})">
      ${recipe.img ? `<img src="${recipe.img}" alt="${recipe.name}" onerror="this.style.display='none'">` : ''}
      <div class="recipe-info">
        <h3>${recipe.name || recipe.title || "Recipe"}</h3>
        <p>${(recipe.instructions || recipe.description || "").slice(0, 80)}...</p>
        ${recipe.tags ? `<div class="tags">${recipe.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>` : ""}
        <button class="view-btn">View Recipe</button>
      </div>
    </div>
  `).join("");
}

// Show single recipe detail
function showRecipe(index) {
  const recipe = allRecipes[index];
  if (!recipe || !recipeGrid) return;

  const name = recipe.name || recipe.title || "Recipe";
  const ingredients = recipe.ingredients
    ? `<ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>`
    : "";
  const instructions = recipe.instructions || recipe.description || "";

  recipeGrid.innerHTML = `
    <div class="recipe-detail">
      ${recipe.img ? `<img src="${recipe.img}" alt="${name}" style="width:100%;max-width:400px;border-radius:12px;margin-bottom:1rem">` : ""}
      <h2>${name}</h2>
      ${ingredients ? `<h3>🧂 Ingredients</h3>${ingredients}` : ""}
      ${instructions ? `<h3>📋 Instructions</h3><p>${instructions}</p>` : ""}
      <button onclick="loadRecipes()" style="margin-top:1.5rem;padding:0.6rem 1.5rem;background:#4f8ef7;color:white;border:none;border-radius:8px;cursor:pointer;font-size:1rem;">
        ← Back to Recipes
      </button>
    </div>
  `;
}

// Search filter
if (searchInput) {
  searchInput.addEventListener("input", filterRecipes);
}

// Difficulty/category filter
if (difficultySelect) {
  difficultySelect.addEventListener("change", filterRecipes);
}

function filterRecipes() {
  const query = searchInput ? searchInput.value.toLowerCase() : "";
  const category = difficultySelect ? difficultySelect.value : "";

  const filtered = allRecipes.filter(recipe => {
    const matchesSearch = !query || 
      (recipe.name || recipe.title || "").toLowerCase().includes(query);
    const matchesCategory = !category || 
      (recipe.tags && recipe.tags.includes(category));
    return matchesSearch && matchesCategory;
  });

  renderRecipes(filtered);
}

// View Selected Recipe button
if (startBtn) {
  startBtn.addEventListener("click", () => {
    const selected = difficultySelect ? difficultySelect.value : "";
    const filtered = selected 
      ? allRecipes.filter(r => r.tags && r.tags.includes(selected))
      : allRecipes;
    if (filtered.length > 0) showRecipe(allRecipes.indexOf(filtered[0]));
  });
}

// Random Recipe button
if (randomBtn) {
  randomBtn.addEventListener("click", () => {
    if (allRecipes.length > 0) {
      const randomIndex = Math.floor(Math.random() * allRecipes.length);
      showRecipe(randomIndex);
    }
  });
}

// ✅ FIX: Restart button — reloads recipes / goes back to main
if (restartBtn) {
  restartBtn.addEventListener("click", () => {
    window.location.href = "main.html";
  });
}

// Init
if (recipeGrid) {
  loadRecipes();
}