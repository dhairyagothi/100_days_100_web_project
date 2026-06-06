// ================================
// rec.html logic — loads recipes from text.json
// ================================

const searchInput = document.getElementById("searchInput");
const difficultySelect = document.getElementById("difficulty");
const startBtn = document.getElementById("start");
const randomBtn = document.getElementById("randomRecipe");
const recipeGrid = document.getElementById("recipeGrid");

let allRecipes = [];

// Load recipes from text.json
function loadRecipes() {
  if (recipeGrid) {
    recipeGrid.innerHTML = '<div class="loading">Loading recipes...</div>';
  }

  fetch("text.json")
    .then((res) => res.json())
    .then((data) => {
      // ✅ FIX: correctly read data.recipes array
      allRecipes = data.recipes || (Array.isArray(data) ? data : Object.values(data));

      // Populate dropdown with recipe names
      if (difficultySelect) {
        difficultySelect.innerHTML = '<option value="">All Recipes</option>';
        allRecipes.forEach((recipe, index) => {
          const opt = document.createElement("option");
          opt.value = index;
          opt.textContent = recipe.name || `Recipe ${index + 1}`;
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
    <div class="recipe-card" onclick="showRecipe(${allRecipes.indexOf(recipe)})">
      ${recipe.img ? `<img src="${recipe.img}" alt="${recipe.name}" onerror="this.style.display='none'">` : ''}
      <div class="recipe-card-body">
        <h3>${recipe.name || "Recipe"}</h3>
        <p>${(recipe.instructions || "").slice(0, 100)}...</p>
        <button class="view-btn">View Recipe</button>
      </div>
    </div>
  `).join("");
}

// Show single recipe detail
function showRecipe(index) {
  const recipe = allRecipes[index];
  if (!recipe || !recipeGrid) return;

  const ingredients = recipe.ingredients
    ? `<ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>`
    : "";

  recipeGrid.innerHTML = `
    <div class="recipe-detail">
      <h2>${recipe.name || "Recipe"}</h2>
      ${ingredients ? `<h3>🧂 Ingredients</h3>${ingredients}` : ""}
      ${recipe.instructions ? `<h3>📋 Instructions</h3><p>${recipe.instructions}</p>` : ""}
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

// Dropdown filter
if (difficultySelect) {
  difficultySelect.addEventListener("change", () => {
    const selectedIndex = difficultySelect.value;
    if (selectedIndex === "") {
      renderRecipes(allRecipes);
    } else {
      showRecipe(parseInt(selectedIndex));
    }
  });
}

function filterRecipes() {
  const query = searchInput ? searchInput.value.toLowerCase() : "";
  const filtered = allRecipes.filter(recipe =>
    (recipe.name || "").toLowerCase().includes(query)
  );
  renderRecipes(filtered);
}

// View Selected Recipe button
if (startBtn) {
  startBtn.addEventListener("click", () => {
    const selectedIndex = difficultySelect ? difficultySelect.value : "";
    if (selectedIndex !== "") {
      showRecipe(parseInt(selectedIndex));
    } else {
      renderRecipes(allRecipes);
    }
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

// ✅ FIX: Restart button
const restartBtn = document.getElementById("restart");
if (restartBtn) {
  restartBtn.addEventListener("click", () => {
    window.location.href = "main.html";
  });
}

// Init
if (recipeGrid) {
  loadRecipes();
}