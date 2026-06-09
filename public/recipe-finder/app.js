// Access open endpoints filtering meal recipes by specific ingredients
const LIST_BY_INGREDIENT_API =
  "https://www.themealdb.com/api/json/v1/1/filter.php?i=";
const LOOKUP_BY_ID_API =
  "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

const ingredientInput = document.getElementById("ingredientInput");
const searchBtn = document.getElementById("searchBtn");
const recipeDisplayGrid = document.getElementById("recipeDisplayGrid");
const statusAlert = document.getElementById("statusAlert");

const recipeModal = document.getElementById("recipeModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalDetailsContent = document.getElementById("modalDetailsContent");

// Async Orchestration Logic: Pull and filter items by specific text inputs
async function searchRecipesByIngredient(ingredient) {
  if (!ingredient) return;

  // Reset layout UI elements
  recipeDisplayGrid.innerHTML = "";
  statusAlert.classList.remove("hidden");
  statusAlert.innerText = `Searching for recipes containing "${ingredient}"...`;

  try {
    const response = await fetch(
      `${LIST_BY_INGREDIENT_API}${encodeURIComponent(ingredient)}`,
    );
    const dataset = await response.json();

    if (!dataset.meals) {
      statusAlert.innerText = `No matched recipes found for "${ingredient}". Try checking spelling rules or look for another ingredient.`;
      return;
    }

    statusAlert.classList.add("hidden");
    renderRecipeCards(dataset.meals);
  } catch (error) {
    statusAlert.innerText =
      "Error pulling culinary data. Please check connection parameters.";
  }
}

// Map short-form filter models straight to UI Cards
function renderRecipeCards(mealsList) {
  recipeDisplayGrid.innerHTML = "";

  mealsList.forEach((meal) => {
    const cardNode = document.createElement("div");
    cardNode.className = "meal-card";

    cardNode.innerHTML = `
            <div class="card-img-wrapper">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal} Thumbnail" loading="lazy">
            </div>
            <div class="card-body">
                <div class="card-meta-tags">
                    <span class="tag-label">Pantry Choice</span>
                </div>
                <h3 class="meal-title">${meal.strMeal}</h3>
                <button class="view-instructions-btn" data-meal-id="${meal.idMeal}">View Recipe</button>
            </div>
        `;

    recipeDisplayGrid.appendChild(cardNode);
  });

  // Attach operational event delegation mappings across dynamic list elements
  const triggers = recipeDisplayGrid.querySelectorAll(".view-instructions-btn");
  triggers.forEach((button) => {
    button.addEventListener("click", (e) => {
      const explicitId = e.target.getAttribute("data-meal-id");
      displayFullRecipeModal(explicitId);
    });
  });
}

// Fetch secondary detailed models using distinct unique ID strings
async function displayFullRecipeModal(mealId) {
  try {
    const response = await fetch(`${LOOKUP_BY_ID_API}${mealId}`);
    const detailedData = await response.json();
    const primaryMealItem = detailedData.meals[0];

    populateModalBody(primaryMealItem);
    recipeModal.classList.remove("hidden");
    document.body.style.overflow = "hidden"; // Keep background scrolling frozen
  } catch (error) {
    alert("Failed to retrieve expanded instructions card.");
  }
}

// Parse multi-key parameter profiles into unified structural components
function populateModalBody(meal) {
  // Isolate active ingredient definitions mapped side by side with tracking metric quantities
  const collectedIngredients = [];
  for (let index = 1; index <= 20; index++) {
    const structuralIngredientKey = meal[`strIngredient${index}`];
    const structuralMeasureKey = meal[`strMeasure${index}`];

    if (structuralIngredientKey && structuralIngredientKey.trim() !== "") {
      collectedIngredients.push(
        `${structuralMeasureKey ? structuralMeasureKey.trim() : ""} ${structuralIngredientKey.trim()}`,
      );
    }
  }

  modalDetailsContent.innerHTML = `
        <div class="modal-header">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal} Render Image">
            <h2>${meal.strMeal}</h2>
            <div class="card-meta-tags">
                <span class="tag-label">Category: ${meal.strCategory || "General"}</span>
                <span class="tag-label">Origin: ${meal.strArea || "International"}</span>
            </div>
        </div>

        <div class="ingredients-panel">
            <h3>Required Components</h3>
            <ul class="ingredients-list">
                ${collectedIngredients.map((item) => `<li>${item}</li>`).join("")}
            </ul>
        </div>

        <div class="directions-panel">
            <h3>Cooking Directions</h3>
            <p>${meal.strInstructions}</p>
        </div>
    `;
}

// Operational interface click hooks
searchBtn.addEventListener("click", () => {
  const rawVal = ingredientInput.value.trim();
  searchRecipesByIngredient(rawVal);
});

ingredientInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchBtn.click();
});

// Close interactive Modal operations cleanly
function terminateModalView() {
  recipeModal.classList.add("hidden");
  document.body.style.overflow = "auto"; // Free viewport scrolling parameters
}

closeModalBtn.addEventListener("click", terminateModalView);
recipeModal.addEventListener("click", (e) => {
  if (e.target === recipeModal) terminateModalView();
});
