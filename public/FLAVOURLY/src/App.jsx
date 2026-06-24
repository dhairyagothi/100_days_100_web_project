import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import RecipeList from './components/RecipeList';
import RecipeDetailsModal from './components/RecipeDetailsModal';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('chicken');
  const [debouncedQuery, setDebouncedQuery] = useState('chicken');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize favorites from localStorage
  const [favorites, setFavorites] = useState(() => {
    const savedFavs = localStorage.getItem('flavorly_favorites');
    if (savedFavs) {
      try {
        return JSON.parse(savedFavs);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [expandedRecipeId, setExpandedRecipeId] = useState(null);
  const [showVegetarianOnly, setShowVegetarianOnly] = useState(false);

  // View state: home or favorites
  const [showFavorites, setShowFavorites] = useState(false);

  // Autocomplete state
  const [allIngredients, setAllIngredients] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Fetch all ingredients on mount
  useEffect(() => {
    const fetchIngredientsList = async () => {
      try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
        const data = await response.json();
        if (data.meals) {
          const ingredients = data.meals.map(item => item.strIngredient).sort();
          setAllIngredients(ingredients);
        }
      } catch (err) {
        console.error("Failed to fetch ingredients list", err);
      }
    };
    fetchIngredientsList();
  }, []);

  // Update suggestions when searchQuery changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    const lowerQuery = searchQuery.toLowerCase();
    const matched = allIngredients.filter(ing =>
      ing.toLowerCase().includes(lowerQuery)
    );

    // Hide if exact match
    if (matched.length === 1 && matched[0].toLowerCase() === lowerQuery) {
      setSuggestions([]);
    } else {
      setSuggestions(matched.slice(0, 8)); // Top 8 suggestions
    }
  }, [searchQuery, allIngredients]);

  // Persist favorites to localStorage
  useEffect(() => {
    localStorage.setItem('flavorly_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch recipes by title and ingredient
  useEffect(() => {
    const fetchRecipes = async () => {
      if (!debouncedQuery.trim()) {
        setRecipes([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch both title and ingredient simultaneously
        const [titleRes, ingredientRes] = await Promise.all([
          fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${debouncedQuery}`).catch(() => null),
          fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${debouncedQuery}`).catch(() => null)
        ]);

        let titleMeals = [];
        if (titleRes && titleRes.ok) {
          try {
            const titleData = await titleRes.json();
            titleMeals = titleData.meals || [];
          } catch (e) { /* ignore parse errors */ }
        }

        let ingredientMealsRaw = [];
        if (ingredientRes && ingredientRes.ok) {
          try {
            const ingredientData = await ingredientRes.json();
            ingredientMealsRaw = ingredientData.meals || [];
          } catch (e) { /* ignore parse errors */ }
        }

        // Avoid duplicates: filter out any ingredient meals that we already found by title
        const titleMealIds = new Set(titleMeals.map(m => m.idMeal));
        const uniqueIngredientMeals = ingredientMealsRaw.filter(m => !titleMealIds.has(m.idMeal));

        // Let's cap the total results at 24 to avoid crazy API spam
        const maxResults = 24;
        let finalRecipes = [...titleMeals];
        const remainingSlots = maxResults - finalRecipes.length;

        if (remainingSlots > 0 && uniqueIngredientMeals.length > 0) {
          // We need full details for the ingredient matches since filter.php doesn't return instructions
          const mealsToFetch = uniqueIngredientMeals.slice(0, remainingSlots);
          const fullMealsPromises = mealsToFetch.map(async (smallMeal) => {
            try {
              const detailRes = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${smallMeal.idMeal}`);
              const detailData = await detailRes.json();
              return detailData.meals ? detailData.meals[0] : null;
            } catch (e) {
              return null;
            }
          });

          const fullIngredientMeals = await Promise.all(fullMealsPromises);
          finalRecipes = [...finalRecipes, ...fullIngredientMeals.filter(Boolean)];
        }

        setRecipes(finalRecipes.slice(0, maxResults));

      } catch (err) {
        setError(err.message || 'An error occurred while fetching recipes.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [debouncedQuery]);

  // Handlers
  const handleToggleFavorite = (recipe) => {
    setFavorites(prev => {
      const isFavorite = prev.some(fav => fav.idMeal === recipe.idMeal);
      if (isFavorite) {
        return prev.filter(fav => fav.idMeal !== recipe.idMeal);
      } else {
        return [...prev, recipe];
      }
    });
  };

  const handleShowDetails = (id) => {
    setExpandedRecipeId(id);
  };

  const handleCloseModal = () => {
    setExpandedRecipeId(null);
  };

  const handleScrollToMenu = () => {
    document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
  };

  const handleSuggestionClick = (ingredient) => {
    setSearchQuery(ingredient);
    setShowSuggestions(false);
  };

  // Filter recipes for the active view
  const baseRecipes = showFavorites ? favorites : recipes;
  const displayedRecipes = baseRecipes.filter(recipe => {
    if (showVegetarianOnly) {
      return recipe.strCategory === 'Vegetarian' || recipe.strCategory === 'Vegan';
    }
    return true;
  });

  // Find the selected recipe for the modal
  const selectedRecipe = expandedRecipeId
    ? (recipes.find(r => r.idMeal === expandedRecipeId) || favorites.find(r => r.idMeal === expandedRecipeId))
    : null;

  return (
    <>
      <Header
        favoritesCount={favorites.length}
        showFavorites={showFavorites}
        setShowFavorites={setShowFavorites}
      />

      {!showFavorites && <Hero onSeeMenu={handleScrollToMenu} />}

      <div className="w3-container w3-black w3-padding-64 w3-xxlarge" id="menu">
        <div className="app-container">
          <h1 className="section-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
            {showFavorites ? "YOUR FAVORITES" : "THE MENU"}
            {!showFavorites && (
              <div className="paintbrush-container" title="Open for cooking!">
                <img src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdnpyc253Zm80dnYwNHZzN3IwaG1lYzJxcm01cWphMWtsMmRheTA3MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3ohzdFCn9mYfmuAmEU/giphy.gif" alt="Funny Chef Gif" className="funny-gif" />
              </div>
            )}
          </h1>

          {!showFavorites && (
            <div className="controls-section">
              <div className="search-wrapper">
                <div className="autocomplete-container">
                  <input
                    type="text"
                    className="search-input w3-border"
                    placeholder="Search your ingredient on the menu..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  />

                  {showSuggestions && suggestions.length > 0 && (
                    <ul className="suggestions-list">
                      {suggestions.map((suggestion, idx) => (
                        <li
                          key={idx}
                          className="suggestion-item"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <label className="filter-label">
                  <input
                    type="checkbox"
                    className="filter-checkbox"
                    checked={showVegetarianOnly}
                    onChange={(e) => setShowVegetarianOnly(e.target.checked)}
                  />
                  <span className="filter-text">Vegetarian Only</span>
                </label>
              </div>
            </div>
          )}

          <RecipeList
            recipes={displayedRecipes}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onShowDetails={handleShowDetails}
            loading={!showFavorites && loading}
            error={!showFavorites && error}
          />
        </div>
      </div>

      {/* Modal Overlay */}
      {selectedRecipe && (
        <RecipeDetailsModal
          recipe={selectedRecipe}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}

export default App;
