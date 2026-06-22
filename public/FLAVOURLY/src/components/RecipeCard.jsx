import React from 'react';

const RecipeCard = ({ recipe, isFavorite, onToggleFavorite, onShowDetails }) => {
  return (
    <div className="recipe-card">
      <div className="recipe-image-container">
        <img 
          src={recipe.strMealThumb} 
          alt={recipe.strMeal} 
          className="recipe-image"
          loading="lazy"
        />
        <button 
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(recipe);
          }}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
      
      <div className="recipe-content">
        <div className="recipe-header">
          <h3 className="recipe-title">{recipe.strMeal}</h3>
          <span className="recipe-category">{recipe.strCategory}</span>
        </div>
        
        <button 
          className="toggle-details-btn creative-btn"
          onClick={() => onShowDetails(recipe.idMeal)}
        >
          <span className="btn-text">Show Details</span>
          <span className="btn-icon">→</span>
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;
