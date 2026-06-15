 const LIST_BY_INGREDIENT_API = "https://www.themealdb.com/api/json/v1/1/filter.php?i=";
const LOOKUP_BY_ID_API = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

const ingredientInput = document.getElementById("ingredientInput");
const tagInputContainer = document.getElementById("tagInputContainer");
const searchBtn = document.getElementById("searchBtn");
const recipeDisplayGrid = document.getElementById("recipeDisplayGrid");
const statusAlert = document.getElementById("statusAlert");

const filterControlsPanel = document.getElementById("filterControlsPanel");
const categoryFilter = document.getElementById("categoryFilter");
const areaFilter = document.getElementById("areaFilter");
const sortControl = document.getElementById("sortControl");

const recipeModal = document.getElementById("recipeModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalDetailsContent = document.getElementById("modalDetailsContent");

let activeIngredientsTags = [];
let localCachedMealsCollection = [];
let favoritedRecipesRegistry = JSON.parse(localStorage.getItem("pantry_favorites")) || [];

function safeHtmlEscape(targetString) {
  if (!targetString) return "";
  return String(targetString)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function debounceUtility(callbackFunction, latencyDelay) {
  let executionTimeoutIdentifier;
  return function (...executionArguments) {
    clearTimeout(executionTimeoutIdentifier);
    executionTimeoutIdentifier = setTimeout(() => {
      callbackFunction.apply(this, executionArguments);
    }, latencyDelay);
  };
}

function initializeApplicationEngine() {
  const processLiveSearchDebounced = debounceUtility(() => {
    executeAggregatedOrchestrationFetch();
  }, 500);

  ingredientInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const rawTerm = ingredientInput.value.trim();
      if (rawTerm && !activeIngredientsTags.includes(rawTerm.toLowerCase())) {
        registerNewIngredientTag(rawTerm.toLowerCase());
        processLiveSearchDebounced();
      }
      ingredientInput.value = "";
    }
  });

  tagInputContainer.addEventListener("click", () => {
    ingredientInput.focus();
  });

  searchBtn.addEventListener("click", () => {
    const rawTerm = ingredientInput.value.trim();
    if (rawTerm && !activeIngredientsTags.includes(rawTerm.toLowerCase())) {
      registerNewIngredientTag(rawTerm.toLowerCase());
      ingredientInput.value = "";
    }
    executeAggregatedOrchestrationFetch();
  });

  categoryFilter.addEventListener("change", processInterfacePipelineUpdates);
  areaFilter.addEventListener("change", processInterfacePipelineUpdates);
  sortControl.addEventListener("change", processInterfacePipelineUpdates);

  closeModalBtn.addEventListener("click", terminateModalView);
  recipeModal.addEventListener("click", (e) => {
    if (e.target === recipeModal) terminateModalView();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !recipeModal.classList.contains("hidden")) {
      terminateModalView();
    }
  });
}

function registerNewIngredientTag(termValue) {
  activeIngredientsTags.push(termValue);
  const tagChip = document.createElement("span");
  tagChip.className = "tag-chip";
  tagChip.setAttribute("data-value", termValue);
  tagChip.innerHTML = `${safeHtmlEscape(termValue)}<button>&times;</button>`;
  
  tagChip.querySelector("button").addEventListener("click", (e) => {
    e.stopPropagation();
    activeIngredientsTags = activeIngredientsTags.filter(item => item !== termValue);
    tagChip.remove();
    executeAggregatedOrchestrationFetch();
  });

  tagInputContainer.insertBefore(tagChip, ingredientInput);
}

async function executeAggregatedOrchestrationFetch() {
  if (activeIngredientsTags.length === 0) {
    recipeDisplayGrid.innerHTML = "";
    filterControlsPanel.classList.add("hidden");
    statusAlert.classList.add("hidden");
    return;
  }

  recipeDisplayGrid.innerHTML = "";
  filterControlsPanel.classList.add("hidden");
  statusAlert.classList.remove("hidden");
  statusAlert.innerHTML = `<div class="spinner-element"></div><p>Sifting through culinary archives...</p>`;

  try {
    const rootSearchQuery = activeIngredientsTags[0];
    const networkResponse = await fetch(`${LIST_BY_INGREDIENT_API}${encodeURIComponent(rootSearchQuery)}`);
    const payloadDataset = await networkResponse.json();

    if (!payloadDataset.meals) {
      renderEmptyStateNotice();
      return;
    }

    const secondaryDetailsPromises = payloadDataset.meals.map(item => 
      fetch(`${LOOKUP_BY_ID_API}${item.idMeal}`).then(res => res.json())
    );
    const resolvedDetailsCollection = await Promise.all(secondaryDetailsPromises);
    
    localCachedMealsCollection = resolvedDetailsCollection
      .map(dataset => dataset.meals ? dataset.meals[0] : null)
      .filter(item => item !== null);

    if (activeIngredientsTags.length > 1) {
      localCachedMealsCollection = localCachedMealsCollection.filter(meal => {
        const structuralIngredientsBuffer = [];
        for (let i = 1; i <= 20; i++) {
          const checkKey = meal[`strIngredient${i}`];
          if (checkKey && checkKey.trim() !== "") {
            structuralIngredientsBuffer.push(checkKey.toLowerCase());
          }
        }
        return activeIngredientsTags.every(requiredTag => 
          structuralIngredientsBuffer.some(ingredientName => ingredientName.includes(requiredTag))
        );
      });
    }

    if (localCachedMealsCollection.length === 0) {
      renderEmptyStateNotice();
      return;
    }

    statusAlert.classList.add("hidden");
    compileDynamicFilterMenus();
    processInterfacePipelineUpdates();
    filterControlsPanel.classList.remove("hidden");

  } catch (error) {
    renderErrorStateNotice();
  }
}

function compileDynamicFilterMenus() {
  const categoriesListSet = new Set();
  const geographicAreasSet = new Set();

  localCachedMealsCollection.forEach(meal => {
    if (meal.strCategory) categoriesListSet.add(meal.strCategory);
    if (meal.strArea) geographicAreasSet.add(meal.strArea);
  });

  const currentlySelectedCategory = categoryFilter.value;
  const currentlySelectedArea = areaFilter.value;

  categoryFilter.innerHTML = '<option value="">All Categories</option>';
  areaFilter.innerHTML = '<option value="">All Cuisines</option>';

  categoriesListSet.forEach(category => {
    categoryFilter.innerHTML += `<option value="${safeHtmlEscape(category)}">${safeHtmlEscape(category)}</option>`;
  });
  geographicAreasSet.forEach(area => {
    areaFilter.innerHTML += `<option value="${safeHtmlEscape(area)}">${safeHtmlEscape(area)}</option>`;
  });

  if (categoriesListSet.has(currentlySelectedCategory)) {
    categoryFilter.value = currentlySelectedCategory;
  }
  if (geographicAreasSet.has(currentlySelectedArea)) {
    areaFilter.value = currentlySelectedArea;
  }
}

function processInterfacePipelineUpdates() {
  const chosenCategory = categoryFilter.value;
  const chosenArea = areaFilter.value;
  const preferredSortRule = sortControl.value;

  let filteredTransformBuffer = [...localCachedMealsCollection];

  if (chosenCategory) {
    filteredTransformBuffer = filteredTransformBuffer.filter(meal => meal.strCategory === chosenCategory);
  }
  if (chosenArea) {
    filteredTransformBuffer = filteredTransformBuffer.filter(meal => meal.strArea === chosenArea);
  }

  if (preferredSortRule === "alpha") {
    filteredTransformBuffer.sort((firstItem, secondItem) => firstItem.strMeal.localeCompare(secondItem.strMeal));
  } else if (preferredSortRule === "favorites") {
    filteredTransformBuffer.sort((firstItem, secondItem) => {
      const isFirstFavorite = favoritedRecipesRegistry.includes(firstItem.idMeal) ? 1 : 0;
      const isSecondFavorite = favoritedRecipesRegistry.includes(secondItem.idMeal) ? 1 : 0;
      return isSecondFavorite - isFirstFavorite;
    });
  }

  renderDisplayGridCards(filteredTransformBuffer);
}

function renderDisplayGridCards(computedMealsList) {
  recipeDisplayGrid.innerHTML = "";

  computedMealsList.forEach((meal) => {
    const cardNode = document.createElement("div");
    cardNode.className = "meal-card";
    const isCurrentlyFavorited = favoritedRecipesRegistry.includes(meal.idMeal);

    cardNode.innerHTML = `
      <button class="bookmark-action-btn ${isCurrentlyFavorited ? "active" : ""}" data-meal-id="${safeHtmlEscape(meal.idMeal)}" aria-label="Favorite recipe">
        &#9733;
      </button>
      <div class="card-img-wrapper">
        <img src="${safeHtmlEscape(meal.strMealThumb)}" alt="${safeHtmlEscape(meal.strMeal)} Thumbnail" loading="lazy">
      </div>
      <div class="card-body">
        <div class="card-meta-tags">
          <span class="tag-label">${safeHtmlEscape(meal.strCategory || "General")}</span>
          <span class="tag-label">${safeHtmlEscape(meal.strArea || "International")}</span>
        </div>
        <h3 class="meal-title">${safeHtmlEscape(meal.strMeal)}</h3>
        <button class="view-instructions-btn" data-meal-id="${safeHtmlEscape(meal.idMeal)}">View Recipe</button>
      </div>
    `;

    cardNode.querySelector(".bookmark-action-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      executeBookmarkToggleAction(meal.idMeal, e.currentTarget);
    });

    cardNode.querySelector(".view-instructions-btn").addEventListener("click", () => {
      displayFullRecipeModal(meal.idMeal);
    });

    recipeDisplayGrid.appendChild(cardNode);
  });
}

function executeBookmarkToggleAction(mealId, targetButton) {
  if (favoritedRecipesRegistry.includes(mealId)) {
    favoritedRecipesRegistry = favoritedRecipesRegistry.filter(id => id !== mealId);
    targetButton.classList.remove("active");
  } else {
    favoritedRecipesRegistry.push(mealId);
    targetButton.classList.add("active");
  }
  localStorage.setItem("pantry_favorites", JSON.stringify(favoritedRecipesRegistry));
}

async function displayFullRecipeModal(mealId) {
  modalDetailsContent.innerHTML = `<div class="status-box"><div class="spinner-element"></div><p>Fetching instructions...</p></div>`;
  recipeModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";

  try {
    const response = await fetch(`${LOOKUP_BY_ID_API}${mealId}`);
    const detailedData = await response.json();
    const primaryMealItem = detailedData.meals[0];

    populateModalBody(primaryMealItem);
  } catch (error) {
    modalDetailsContent.innerHTML = `<div class="status-box error-view"><p>Failed to load options details.</p></div>`;
  }
}

function populateModalBody(meal) {
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
      <img src="${safeHtmlEscape(meal.strMealThumb)}" alt="${safeHtmlEscape(meal.strMeal)} Detail Visual">
      <h2>${safeHtmlEscape(meal.strMeal)}</h2>
      <div class="card-meta-tags">
        <span class="tag-label">Category: ${safeHtmlEscape(meal.strCategory || "General")}</span>
        <span class="tag-label">Origin: ${safeHtmlEscape(meal.strArea || "International")}</span>
      </div>
    </div>

    <div class="ingredients-panel">
      <h3>Required Components</h3>
      <ul class="ingredients-list">
        ${collectedIngredients.map((item) => `<li>${safeHtmlEscape(item)}</li>`).join("")}
      </ul>
    </div>

    <div class="directions-panel">
      <h3>Cooking Directions</h3>
      <p>${safeHtmlEscape(meal.strInstructions)}</p>
    </div>
  `;
}

function renderEmptyStateNotice() {
  filterControlsPanel.classList.add("hidden");
  statusAlert.classList.remove("hidden");
  statusAlert.innerHTML = `
    <div class="empty-view">
      <svg viewBox="0 0 24 24" stroke-width="2"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
      <h4>No Matches Located</h4>
      <p>Try verifying your spelling constraints or explore alternate pantry variables.</p>
    </div>
  `;
}

function renderErrorStateNotice() {
  filterControlsPanel.classList.add("hidden");
  statusAlert.classList.remove("hidden");
  statusAlert.innerHTML = `
    <div class="error-view">
      <svg viewBox="0 0 24 24" stroke-width="2"><path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
      <h4>Network Operations Interrupted</h4>
      <p>Error pulling culinary data. Please check connection parameters.</p>
    </div>
  `;
}

function terminateModalView() {
  recipeModal.classList.add("hidden");
  document.body.style.overflow = "auto";
}

document.addEventListener("DOMContentLoaded", initializeApplicationEngine);