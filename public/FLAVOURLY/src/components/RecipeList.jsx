import React, { useEffect, useRef } from 'react';
import RecipeCard from './RecipeCard';
import zatImg from '../assets/zat.png';

const RecipeList = ({ recipes, favorites, onToggleFavorite, onShowDetails, loading, error }) => {
  const emptyRef = useRef(null);

  // Scroll so the full GIF + Zat panel is visible (100px below the GIF's bottom edge)
  useEffect(() => {
    if (!loading && !error && recipes && recipes.length === 0) {
      const timer = setTimeout(() => {
        if (emptyRef.current) {
          const rect = emptyRef.current.getBoundingClientRect();
          const scrollTarget = window.scrollY + rect.bottom + 0 - window.innerHeight;
          window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [loading, error, recipes]);

  if (loading) {
    return (
      <div className="state-container">
        <div className="loader"></div>
        <p>Finding delicious recipes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-container error">
        <p>⚠️ {error}</p>
      </div>
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      <div className="state-container empty" ref={emptyRef}>

        {/* Left: glassmorphic GIF panel matching the red-box region */}
        <div className="empty-glass-panel">
          <img
            src="https://i.giphy.com/3o85g2ttYzgw6o661q.webp"
            alt="No recipes found"
            className="empty-state-gif"
          />
        </div>

        {/* Right: spacer so content doesn't overlap with fixed zat panel */}
        <div className="empty-spacer" />

        {/* Fixed meme panel: slides in from the right */}
        <div className="zat-meme-panel">
          <div className="speech-bubble">
            No recipezz, my friend? 😤 You search like ziz, how you expect to find shawarmazz, ha?
            Try again — different ingredientzz, more flavorzz, don't be lazy ya habibizzz! 🌯🔥
          </div>
          <img src={zatImg} alt="Zat Meme Character" className="zat-character" />
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-grid">
      {recipes.map(recipe => (
        <RecipeCard
          key={recipe.idMeal}
          recipe={recipe}
          isFavorite={favorites.some(fav => fav.idMeal === recipe.idMeal)}
          onToggleFavorite={onToggleFavorite}
          onShowDetails={onShowDetails}
        />
      ))}
    </div>
  );
};

export default RecipeList;
