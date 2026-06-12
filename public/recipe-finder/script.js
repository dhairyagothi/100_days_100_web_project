const ingredientInput = document.getElementById("ingredient-input");
const searchBtn = document.getElementById("search-btn");
const recipesGrid = document.getElementById("recipes-grid");
const statusMessage = document.getElementById("status-message");
const recipeModal = document.getElementById("recipe-modal");
const closeModal = document.getElementById("close-modal");
const modalBody = document.getElementById("modal-body");

async function searchRecipes() {
  const query = ingredientInput.value.trim();
  if (!query) return;

  recipesGrid.innerHTML = "";
  statusMessage.className = "status-text";
  statusMessage.textContent = "Searching for curated recipes...";

  try {
    // Querying secure open platform endpoint via primary target parameter
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(query)}`,
    );
    const data = await res.json();

    if (!data.meals) {
      statusMessage.textContent =
        "No recipes found for that ingredient. Try another item!";
      return;
    }

    statusMessage.className = "hidden";
    renderRecipes(data.meals);
  } catch (err) {
    statusMessage.textContent = "Error tracking recipe database records.";
  }
}

function renderRecipes(meals) {
  meals.forEach((meal) => {
    const card = document.createElement("div");
    card.className = "recipe-card";
    card.innerHTML = `
            <img src="${meal.strMealThumb}" class="recipe-img" alt="${meal.strMeal}">
            <div class="recipe-info">
                <h3>${meal.strMeal}</h3>
                <button class="view-btn" data-id="${meal.idMeal}">View Instructions</button>
            </div>
        `;
    recipesGrid.appendChild(card);
  });

  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", () =>
      fetchDetails(btn.getAttribute("data-id")),
    );
  });
}

async function fetchDetails(mealId) {
  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`,
    );
    const data = await res.json();
    if (data.meals) showModal(data.meals[0]);
  } catch (err) {
    alert("Could not fetch recipe details.");
  }
}

function showModal(meal) {
  modalBody.innerHTML = `
        <h2>${meal.strMeal}</h2>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <p><strong>Category:</strong> ${meal.strCategory || "General"} | <strong>Area:</strong> ${meal.strArea || "Universal"}</p>
        <h3>Instructions:</h3>
        <p>${meal.strInstructions}</p>
    `;
  recipeModal.classList.remove("hidden");
}

closeModal.addEventListener("click", () => recipeModal.classList.add("hidden"));
window.addEventListener("click", (e) => {
  if (e.target === recipeModal) recipeModal.classList.add("hidden");
});

searchBtn.addEventListener("click", searchRecipes);
ingredientInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchRecipes();
});
