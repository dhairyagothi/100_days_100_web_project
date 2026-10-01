import React from 'react';

// Hero component - Main landing section with call-to-action button
const Hero = ({ onSeeMenu }) => {
  return (
    <div className="hero-banner">
      {/* Overlay for dimming background image */}
      <div className="hero-overlay"></div>
      
      {/* Main content container */}
      <div className="hero-content">
        {/* Hero title text */}
        <span className="hero-title">FLAVORLY<br/>RECIPES</span>
        
        {/* Call-to-action button */}
        <button onClick={onSeeMenu} className="hero-button">
          LET ME SEE THE RECIPES
        </button>
      </div>
      
      {/* Badge with information */}
      <div className="hero-badge">
        <span>Open for Cooking 24/7</span>
      </div>
    </div>
  );
};

export default Hero;
