import React, { useState, useEffect } from 'react';

const placeholderSuggestions = [
  'milk',
  'fresh potato',
  'lays chips',
  'curd',
  'coca-cola can',
  'onion',
  'maggi noodles'
];

export default function Header({
  location,
  onLocationClick,
  onCartClick,
  cartCount,
  cartTotal,
  user,
  onLoginClick,
  onLogout,
  searchQuery,
  onSearchChange
}) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [placeholderText, setPlaceholderText] = useState('Search "milk"');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Animated typewriter placeholder text
  useEffect(() => {
    let currentWord = placeholderSuggestions[placeholderIndex];
    let isDeleting = false;
    let text = '';
    let speed = 100;
    
    const tick = () => {
      if (!isDeleting) {
        text = currentWord.substring(0, text.length + 1);
        setPlaceholderText(`Search "${text}"`);
        if (text === currentWord) {
          isDeleting = true;
          speed = 2000; // Hold word
        } else {
          speed = 100;
        }
      } else {
        text = currentWord.substring(0, text.length - 1);
        setPlaceholderText(`Search "${text}"`);
        if (text === '') {
          isDeleting = false;
          setPlaceholderIndex((prev) => (prev + 1) % placeholderSuggestions.length);
          speed = 500; // Delay before typing next word
        } else {
          speed = 50;
        }
      }
    };

    const timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [placeholderIndex, placeholderText]);

  const handleSuggestionClick = (tag) => {
    onSearchChange(tag);
    setShowSuggestions(false);
  };

  return (
    <div className="header-wrapper">
      <div className="container header-container">
        {/* Logo and Location Section */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="logo-section" onClick={() => onSearchChange('')}>
            <span className="logo-text">
              <span className="logo-yellow">blink</span>
              <span className="logo-green">it</span>
            </span>
          </div>

          <div className="location-picker" onClick={onLocationClick}>
            <div className="location-title">
              Delivery in 8 mins
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginTop: '2px' }}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            <div className="location-subtitle" title={location}>
              {location || 'Select Lucknow Locality'}
            </div>
          </div>
        </div>

        {/* Search Bar Section */}
        <div className="search-section">
          <div className="search-input-wrapper">
            <span className="search-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input
              type="text"
              placeholder={placeholderText}
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => {
                // Delay hiding suggestions to allow click triggers
                setTimeout(() => setShowSuggestions(false), 200);
              }}
              className="search-input"
            />
          </div>

          {showSuggestions && (
            <div className="search-suggestions">
              <div className="suggestion-header">Popular Searches</div>
              <div className="suggestion-tags">
                {placeholderSuggestions.map((tag) => (
                  <button
                    key={tag}
                    className="suggestion-tag"
                    onMouseDown={() => handleSuggestionClick(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right side buttons */}
        <div className="header-right">
          {user ? (
            <div className="user-badge" onClick={onLogout} title="Click to Logout">
              <div className="user-avatar flex-center">
                {user.slice(-2)}
              </div>
              <span style={{ cursor: 'pointer' }}>+91 {user.slice(0, 5)}...</span>
            </div>
          ) : (
            <button className="login-btn" onClick={onLoginClick}>
              Login
            </button>
          )}

          <button className="cart-button" onClick={onCartClick}>
            <span className="cart-icon-wrapper">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </span>
            
            {cartCount > 0 ? (
              <>
                <div className="cart-divider"></div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '11px', fontWeight: '500', opacity: 0.9 }}>{cartCount} items</span>
                  <span style={{ fontSize: '13px', fontWeight: '800' }}>₹{cartTotal}</span>
                </div>
              </>
            ) : (
              <span>My Cart</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
