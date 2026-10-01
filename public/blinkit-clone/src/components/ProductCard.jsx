import React from 'react';

export default function ProductCard({
  product,
  cartQty,
  onAddToCart,
  onRemoveFromCart,
  onCardClick
}) {
  const { name, brand, price, originalPrice, discount, weight, deliveryTime, image } = product;

  const handleAddClick = (e) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleSubtractClick = (e) => {
    e.stopPropagation();
    onRemoveFromCart(product);
  };

  return (
    <div className="product-card" onClick={onCardClick}>
      {discount && <div className="discount-badge">{discount}</div>}
      
      <div className="time-badge">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ fill: 'currentColor' }}>
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        {deliveryTime}
      </div>

      <div className="product-image-container">
        <img src={image} alt={name} className="product-image" loading="lazy" />
      </div>

      <div className="product-info">
        <div style={{ fontSize: '11px', color: 'var(--text-light)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '2px' }}>
          {brand}
        </div>
        <h4 className="product-title" title={name}>{name}</h4>
        <span className="product-weight">{weight}</span>

        <div className="product-purchase-row">
          <div className="price-box">
            <span className="price-current">₹{price}</span>
            {originalPrice > price && (
              <span className="price-original">₹{originalPrice}</span>
            )}
          </div>

          <div className="add-btn-container">
            {cartQty === 0 ? (
              <button className="add-btn-inactive" onClick={handleAddClick}>
                ADD
              </button>
            ) : (
              <div className="add-btn-active">
                <button className="counter-action" onClick={handleSubtractClick}>
                  -
                </button>
                <span className="counter-value">{cartQty}</span>
                <button className="counter-action" onClick={handleAddClick}>
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
