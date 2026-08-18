import React from 'react';

const Header = ({ favoritesCount, showFavorites, setShowFavorites }) => {
  return (
    <div className="top-navbar">
      <div className="nav-bar">
        {/* Navigate to the home section */}
        <a 
          href="#home" 
          className={`nav-item ${!showFavorites ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            setShowFavorites(false);
          }}
        >
          HOME
        </a>
        {/* Navigate to favorites and show the item count */}
        <a 
          href="#favorites" 
          className={`nav-item ${showFavorites ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            setShowFavorites(true);
          }}
        >
          FAVORITES ({favoritesCount}) ❤️
        </a>
      </div>
    </div>
  );
};

export default Header;
