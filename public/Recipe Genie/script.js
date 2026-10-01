document.addEventListener("DOMContentLoaded", () => {
  let categoriesData = [];
  let matchingMeals = [];
  let currentActiveIndex = -1;

  const searchInput = document.getElementById("searchInput");
  const clearSearchBtn = document.getElementById("clearSearch");
  const resultsDropdown = document.getElementById("searchResultsDropdown");
  const mainContentContainer = document.getElementById("mainContent");
  const categoriesDisplayGrid = document.getElementById("categoriesGrid");
  const triggerTourBtn = document.getElementById("startTourBtn");

  async function initializeApplicationData() {
    try {
      const response = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
      const data = await response.json();
      categoriesData = data.categories || [];
      renderCategoryDashboardCards(categoriesData);
    } catch (error) {
      console.error("Error structural layout payload fetch:", error);
      if (categoriesDisplayGrid) {
        categoriesDisplayGrid.innerHTML = `
          <div class="col-span-full text-center py-12">
            <p class="text-red-500 font-medium">Failed to load recipe collections. Please try again later.</p>
          </div>
        `;
      }
    }
  }

  function renderCategoryDashboardCards(items) {
    if (!categoriesDisplayGrid) return;
    
    categoriesDisplayGrid.innerHTML = items.map(category => `
      <article class="group bg-white rounded-[2rem] overflow-hidden border border-stone-200/60 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:-translate-y-2 transition-all duration-300 flex flex-col">
        <div class="relative overflow-hidden aspect-[4/3] bg-stone-100">
          <img 
            src="${category.strCategoryThumb}" 
            alt="${category.strCategory}" 
            class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-stone-950/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div class="p-6 flex flex-col flex-grow justify-between">
          <div>
            <div class="flex items-center space-x-2 mb-3">
              <span class="p-1.5 bg-orange-50 rounded-lg text-orange-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
                </svg>
              </span>
              <h3 class="text-xl font-bold text-stone-900 tracking-tight group-hover:text-orange-500 transition-colors duration-200">
                ${category.strCategory}
              </h3>
            </div>
            <p class="text-stone-500 leading-relaxed text-sm md:text-base line-clamp-3 mb-6">
              ${category.strCategoryDescription.slice(0, 150)} ...
            </p>
          </div>
          <div class="pt-4 border-t border-stone-100">
            <a href="category.html?c=${category.strCategory}" class="no-underline">
              <button class="w-full bg-stone-50 hover:bg-orange-500 text-stone-700 hover:text-white font-semibold rounded-xl py-3 px-4 border-none shadow-sm transition-all duration-200 text-sm flex items-center justify-center space-x-2 group/btn cursor-pointer">
                <span>Explore Catalog</span>
                <span class="transform translate-x-0 group-hover/btn:translate-x-1 transition-transform duration-150">→</span>
              </button>
            </a>
          </div>
        </div>
      </article>
    `).join("");
  }

  async function performLiveRecipeSearch(queryString) {
    if (!queryString.trim()) {
      matchingMeals = [];
      closeSearchDropdownState();
      return;
    }

    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${queryString}`);
      const data = await response.json();
      matchingMeals = data.meals || [];
      renderSearchSuggestions(matchingMeals);
    } catch (error) {
      console.error("Error rendering remote searching query sets:", error);
    }
  }

  function renderSearchSuggestions(mealsList) {
    if (!resultsDropdown) return;

    if (mealsList.length === 0) {
      resultsDropdown.innerHTML = `
        <div class="text-center text-stone-400 py-6 text-sm font-medium">
          No matching culinary options found
        </div>
      `;
    } else {
      resultsDropdown.innerHTML = mealsList.map((meal, index) => `
        <div 
          data-index="${index}"
          data-id="${meal.idMeal}"
          class="search-suggest-item p-2.5 rounded-xl flex items-center justify-start gap-3 transition-all duration-150 cursor-pointer text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-10 h-10 rounded-xl object-cover shadow-sm border border-black/5" />
          <span class="truncate">${meal.strMeal}</span>
        </div>
      `).join("");

      document.querySelectorAll(".search-suggest-item").forEach(element => {
        element.addEventListener("mouseenter", (e) => {
          const targetedIdx = parseInt(e.currentTarget.getAttribute("data-index"), 10);
          updateActiveSearchFocusHighlight(targetedIdx);
        });

        element.addEventListener("mousedown", (e) => {
          e.preventDefault();
          const targetId = e.currentTarget.getAttribute("data-id");
          navigateToClientRoute(`meal.html?id=${targetId}`);
        });
      });
    }

    currentActiveIndex = -1;
    openSearchDropdownState();
  }

  function updateActiveSearchFocusHighlight(targetIndex) {
    if (!resultsDropdown) return;
    const listItems = resultsDropdown.children;
    if (!listItems || listItems.length === 0 || listItems[0].classList.contains("text-center")) return;

    currentActiveIndex = targetIndex;

    Array.from(listItems).forEach((item, index) => {
      if (index === currentActiveIndex) {
        item.classList.add("bg-orange-500", "text-white", "shadow-md", "shadow-orange-500/10");
        item.classList.remove("text-stone-700", "hover:bg-stone-50");
        item.scrollIntoView({ block: "nearest", behavior: "smooth" });
      } else {
        item.classList.remove("bg-orange-500", "text-white", "shadow-md", "shadow-orange-500/10");
        item.classList.add("text-stone-700");
      }
    });
  }

  function openSearchDropdownState() {
    if (resultsDropdown) resultsDropdown.classList.remove("hidden");
    if (mainContentContainer) mainContentContainer.classList.add("opacity-40", "blur-md", "scale-[0.99]", "pointer-events-none");
  }

  function closeSearchDropdownState() {
    if (resultsDropdown) resultsDropdown.classList.add("hidden");
    if (mainContentContainer) mainContentContainer.classList.remove("opacity-40", "blur-md", "scale-[0.99]", "pointer-events-none");
    currentActiveIndex = -1;
  }

  function navigateToClientRoute(destinationRoute) {
    closeSearchDropdownState();
    if (searchInput) searchInput.value = "";
    if (clearSearchBtn) clearSearchBtn.classList.add("hidden");
    window.location.href = destinationRoute;
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const trackingValue = e.target.value;
      if (clearSearchBtn) {
        if (trackingValue) {
          clearSearchBtn.classList.remove("hidden");
        } else {
          clearSearchBtn.classList.add("hidden");
        }
      }
      performLiveRecipeSearch(trackingValue);
    });

    searchInput.addEventListener("focus", () => {
      if (searchInput.value.trim() && matchingMeals.length > 0) {
        openSearchDropdownState();
      }
    });

    searchInput.addEventListener("blur", () => {
      setTimeout(closeSearchDropdownState, 250);
    });

    searchInput.addEventListener("keydown", (event) => {
      if (!resultsDropdown || resultsDropdown.classList.contains("hidden") || matchingMeals.length === 0) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        const nextIndex = currentActiveIndex < matchingMeals.length - 1 ? currentActiveIndex + 1 : currentActiveIndex;
        updateActiveSearchFocusHighlight(nextIndex);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        const previousIndex = currentActiveIndex > 0 ? currentActiveIndex - 1 : 0;
        updateActiveSearchFocusHighlight(previousIndex);
      } else if (event.key === "Enter") {
        if (currentActiveIndex >= 0 && matchingMeals[currentActiveIndex]) {
          event.preventDefault();
          navigateToClientRoute(`meal.html?id=${matchingMeals[currentActiveIndex].idMeal}`);
        }
      } else if (event.key === "Escape") {
        event.preventDefault();
        closeSearchDropdownState();
        searchInput.blur();
      }
    });
  }

  if (clearSearchBtn && searchInput) {
    clearSearchBtn.addEventListener("click", () => {
      searchInput.value = "";
      clearSearchBtn.classList.add("hidden");
      closeSearchDropdownState();
      searchInput.focus();
    });
  }

  function initializeGuidedOnboardingTour() {
    if (typeof Shepherd === "undefined" || !triggerTourBtn) {
      return;
    }

    const onboardingTourInstance = new Shepherd.Tour({
      useModalOverlay: true,
      modalOverlayOpeningPadding: 12,
      modalOverlayOpeningRadius: 20,
      defaultStepOptions: {
        cancelIcon: { enabled: true },
        scrollTo: false
      }
    });

    const commonExitButton = {
      classes: "bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium px-5 py-2.5 rounded-xl transition-all duration-200 mr-3 text-sm cursor-pointer",
      text: "🚪 Exit",
      action() { return this.cancel(); }
    };

    const commonNextButton = {
      classes: "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-orange-500/20 text-sm cursor-pointer",
      text: "Next ➡️",
      action() { return this.next(); }
    };

    onboardingTourInstance.addSteps([
      {
        id: "intro",
        attachTo: { element: "#main", on: "bottom" },
        buttons: [commonExitButton, commonNextButton],
        title: "<div style='font-size:22px;font-weight:800;color:#f97316;letter-spacing:-0.025em;margin-bottom:8px;'>👋 Welcome to Recipe Genie</div>",
        text: "<p style='font-size:15px;line-height:1.6;color:#4b5563;'>Your personal AI sous-chef. Discover <b>mouthwatering recipes</b> and tailored culinary inspiration from around the globe instantly.</p>"
      },
      {
        id: "search",
        attachTo: { element: "#searchBar", on: "bottom" },
        buttons: [commonExitButton, commonNextButton],
        title: "<div style='font-size:22px;font-weight:800;color:#f97316;letter-spacing:-0.025em;margin-bottom:8px;'>🔍 Smart Search</div>",
        text: "<p style='font-size:15px;line-height:1.6;color:#4b5563;'>Craving something specific? Use the search field to index ingredients, specific global cuisines, or fast snacks instantly.</p>"
      },
      {
        id: "random",
        attachTo: { element: "#randomMeal", on: "bottom" },
        buttons: [commonExitButton, commonNextButton],
        title: "<div style='font-size:22px;font-weight:800;color:#f97316;letter-spacing:-0.025em;margin-bottom:8px;'>🎲 Flavor Roulette</div>",
        text: "<p style='font-size:15px;line-height:1.6;color:#4b5563;'>Break out of your cooking routine! Click this tool to generate a completely randomized culinary masterpiece.</p>"
      },
      {
        id: "categories",
        attachTo: { element: ".categories", on: "bottom" },
        buttons: [
          commonExitButton,
          {
            classes: "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal- Teals text-white font-medium px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-emerald-500/20 text-sm cursor-pointer",
            text: "🎉 Let's Cook!",
            action() { return this.complete(); }
          }
        ],
        title: "<div style='font-size:22px;font-weight:800;color:#f97316;letter-spacing:-0.025em;margin-bottom:8px;'>📚 Curated Collections</div>",
        text: "<p style='font-size:15px;line-height:1.6;color:#4b5563;'>Browse meticulously cataloged courses sorted by core meat, global regions, or vegetarian parameters.</p>"
      }
    ]);

    triggerTourBtn.addEventListener("click", () => onboardingTourInstance.start());
  }

  initializeApplicationData();
  setTimeout(initializeGuidedOnboardingTour, 600);
});