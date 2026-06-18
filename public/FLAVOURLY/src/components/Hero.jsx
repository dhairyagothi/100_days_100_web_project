import React from 'react';

const Hero = ({ onSeeMenu }) => {
  return (
    <div className="hero-banner">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <span className="hero-title">FLAVORLY<br/>RECIPES</span>
        <button onClick={onSeeMenu} className="hero-button">
          LET ME SEE THE RECIPES
        </button>
      </div>
      <div className="hero-badge">
        <span>Open for Cooking 24/7</span>
      </div>
    </div>
  );
};

export default Hero;
