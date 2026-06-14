// Local robust culinary database dataset matrix mapping setup
const recipeDataset = [
  {
    id: 1,
    title: "Avocado Toast with Egg",
    mealType: "breakfast",
    dietary: ["vegetarian"],
    time: "10 mins",
    ingredients: ["avocado", "bread", "egg", "salt", "pepper"],
  },
  {
    id: 2,
    title: "Keto Almond Pancakes",
    mealType: "breakfast",
    dietary: ["gluten-free", "low-carb", "vegetarian"],
    time: "15 mins",
    ingredients: ["almond flour", "eggs", "baking powder", "butter"],
  },
  {
    id: 3,
    title: "Grilled Chicken Salad",
    mealType: "lunch",
    dietary: ["gluten-free", "low-carb"],
    time: "20 mins",
    ingredients: ["chicken breast", "lettuce", "cucumber", "olive oil"],
  },
  {
    id: 4,
    title: "Mediterranean Chickpea Wrap",
    mealType: "lunch",
    dietary: ["vegetarian"],
    time: "12 mins",
    ingredients: ["chickpeas", "tortilla", "hummus", "tomato", "cucumber"],
  },
  {
    id: 5,
    title: "Garlic Butter Salmon",
    mealType: "dinner",
    dietary: ["gluten-free", "low-carb"],
    time: "25 mins",
    ingredients: ["salmon", "garlic", "butter", "lemon", "asparagus"],
  },
  {
    id: 6,
    title: "Vegetarian Tofu Stir-Fry",
    mealType: "dinner",
    dietary: ["vegetarian", "gluten-free"],
    time: "20 mins",
    ingredients: ["tofu", "broccoli", "bell pepper", "soy sauce", "ginger"],
  },
];

const searchInput = document.getElementById("search-input");
const mealTypeSelect = document.getElementById("meal-type-select");
const recipeGrid = document.getElementById("recipe-grid-element");
const recipeCount = document.getElementById("recipe-count");
const emptyState = document.getElementById("empty-state");

function applyFilters() {
  const searchQuery = searchInput.value.toLowerCase().trim();
  const selectedMeal = mealTypeSelect.value;

  // Extract selected values from all checked checkboxes dynamically
  const selectedDiets = Array.from(
    document.querySelectorAll(".diet-filter:checked"),
  ).map((cb) => cb.value);

  // Compound multi-criteria filtering matrix pipeline operational layers
  const filteredRecipes = recipeDataset.filter((recipe) => {
    const matchesSearch =
      recipe.title.toLowerCase().includes(searchQuery) ||
      recipe.ingredients.some((ing) => ing.toLowerCase().includes(searchQuery));

    const matchesMeal =
      selectedMeal === "all" || recipe.mealType === selectedMeal;

    const matchesDiet = selectedDiets.every((diet) =>
      recipe.dietary.includes(diet),
    );

    return matchesSearch && matchesMeal && matchesDiet;
  });

  renderGrid(filteredRecipes);
}

function renderGrid(recipes) {
  recipeGrid.innerHTML = "";
  recipeCount.textContent = recipes.length;

  if (recipes.length === 0) {
    emptyState.classList.remove("hide");
    return;
  }
  emptyState.classList.add("hide");

  recipes.forEach((recipe) => {
    const card = document.createElement("div");
    card.classList.add("recipe-card");

    // Form tags collection segment layers safely
    const tagsHtml = recipe.dietary
      .map((t) => `<span class="tag">${t}</span>`)
      .join("");
    const ingredientsString = recipe.ingredients.join(", ");

    card.innerHTML = `
            <div>
                <div class="card-meta">
                    <span class="meal-badge">${recipe.mealType}</span>
                    <span class="time-badge">⏱️ ${recipe.time}</span>
                </div>
                <h3 style="margin: 10px 0 6px 0;">${recipe.title}</h3>
                <p class="ingredients-list"><strong>Ingredients:</strong> ${ingredientsString}</p>
            </div>
            <div class="tags-row">
                ${tagsHtml}
            </div>
        `;
    recipeGrid.appendChild(card);
  });
}

// Attach event triggers to filtering panels
searchInput.addEventListener("input", applyFilters);
mealTypeSelect.addEventListener("change", applyFilters);
document.querySelectorAll(".diet-filter").forEach((checkbox) => {
  checkbox.addEventListener("change", applyFilters);
});

// Run core component view construction pipeline upon mount
renderGrid(recipeDataset);
