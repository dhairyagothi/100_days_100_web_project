import React from 'react';

const Header = ({ favoritesCount, showFavorites, setShowFavorites }) => {
  return (
    <div className="top-navbar">
      <div className="nav-bar">
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
