import React, { useEffect } from 'react';

const RecipeDetailsModal = ({ recipe, onClose }) => {
  // Prevent scrolling on the body when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!recipe) return null;

  // Extract ingredients for expanded view
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== "") {
      ingredients.push(`${measure ? measure : ""} ${ingredient}`.trim());
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        
        <div className="modal-hero">
          <img 
            src={recipe.strMealThumb} 
            alt={recipe.strMeal} 
            className="modal-image"
          />
          <div className="modal-header">
            <h2 className="modal-title">{recipe.strMeal}</h2>
            <span className="modal-category">{recipe.strCategory}</span>
          </div>
        </div>

        <div className="modal-body readable-font">
          <div className="modal-section">
            <h3>INGREDIENTS ({ingredients.length})</h3>
            <ul className="modal-ingredients">
              {ingredients.map((ing, idx) => (
                <li key={idx}>
                  <span className="bullet">•</span> {ing}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="modal-section">
            <h3>INSTRUCTIONS</h3>
            <div className="modal-instructions">
              {recipe.strInstructions.split('\n').filter(p => p.trim() !== '').map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>
          
          {recipe.strYoutube && (
            <div className="modal-footer">
              <a 
                href={recipe.strYoutube} 
                target="_blank" 
                rel="noopener noreferrer"
                className="modal-youtube-link creative-btn"
              >
                Watch Video Tutorial 🎥
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailsModal;
