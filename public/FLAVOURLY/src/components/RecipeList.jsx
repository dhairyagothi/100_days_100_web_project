import React, { useEffect, useRef } from 'react';
import RecipeCard from './RecipeCard';
import zatImg from '../assets/zat.png';

const RecipeList = ({ recipes, favorites, onToggleFavorite, onShowDetails, loading, error }) => {
  const emptyRef = useRef(null);

  // Scroll the empty state into view so the full panel is visible.
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
      // Show a loading indicator while recipes are being fetched.
      <div className="state-container">
        <div className="loader"></div>
        <p>Finding delicious recipes...</p>
      </div>
    );
  }

  if (error) {
    return (
      // Show the error state when the request fails.
      <div className="state-container error">
        <p>⚠️ {error}</p>
      </div>
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      // Empty-state layout with illustration on the left and meme panel on the right.
      <div className="state-container empty" ref={emptyRef}>

        {/* Left-side GIF panel for the no-results state. */}
        <div className="empty-glass-panel">
          <img
            src="https://i.giphy.com/3o85g2ttYzgw6o661q.webp"
            alt="No recipes found"
            className="empty-state-gif"
          />
        </div>

        {/* Spacer prevents overlap with the fixed meme panel. */}
        <div className="empty-spacer" />

        {/* Meme panel that stays visible beside the empty state. */}
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
