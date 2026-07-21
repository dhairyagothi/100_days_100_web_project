import React from 'react';

export default function ProductModal({
  product,
  cartQty,
  onAddToCart,
  onRemoveFromCart,
  onClose
}) {
  if (!product) return null;

  const {
    name,
    brand,
    price,
    originalPrice,
    discount,
    weight,
    deliveryTime,
    image,
    description,
    shelfLife,
    keyFeatures
  } = product;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content product-details-modal" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '620px' }}
      >
        <button className="modal-close flex-center" onClick={onClose} aria-label="Close details">
          ✕
        </button>

        <div className="pdm-body">
          {/* Left panel: Image */}
          <div className="pdm-left">
            {discount && <div className="discount-badge">{discount}</div>}
            <img 
              src={image} 
              alt={name} 
              style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }} 
            />
          </div>

          {/* Right panel: Details */}
          <div className="pdm-right">
            <span style={{
              fontSize: '11px',
              fontWeight: '800',
              color: 'var(--blinkit-green)',
              backgroundColor: 'var(--blinkit-green-light)',
              padding: '2px 8px',
              borderRadius: '4px',
              textTransform: 'uppercase',
              display: 'inline-block',
              marginBottom: '8px'
            }}>
              Delivered in {deliveryTime}
            </span>
            <div style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: '700', textTransform: 'uppercase' }}>
              {brand}
            </div>
            <h2 className="pdm-title">{name}</h2>
            <div className="pdm-weight">{weight}</div>

            <div className="pdm-meta">
              <div className="pdm-price-row">
                <span className="pdm-price">₹{price}</span>
                {originalPrice > price && (
                  <span className="pdm-original">₹{originalPrice}</span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-grey)' }}>Quantity:</span>
                <div className="add-btn-container" style={{ width: '90px' }}>
                  {cartQty === 0 ? (
                    <button className="add-btn-inactive" onClick={() => onAddToCart(product)}>
                      ADD TO CART
                    </button>
                  ) : (
                    <div className="add-btn-active">
                      <button className="counter-action" onClick={() => onRemoveFromCart(product)}>
                        -
                      </button>
                      <span className="counter-value">{cartQty}</span>
                      <button className="counter-action" onClick={() => onAddToCart(product)}>
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pdm-desc-section">
              <h4>Product Description</h4>
              <p>{description || 'No description available for this product.'}</p>
              
              <div className="pdm-info-grid">
                <div className="pdm-info-item">
                  <div className="pdm-info-label">Shelf Life</div>
                  <div className="pdm-info-val">{shelfLife || 'N/A'}</div>
                </div>
                <div className="pdm-info-item">
                  <div className="pdm-info-label">Vendor Sourced</div>
                  <div className="pdm-info-val">Lucknow Warehouse</div>
                </div>
              </div>

              {keyFeatures && keyFeatures.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: '700', marginBottom: '6px', color: 'var(--text-dark)' }}>Key Features</h4>
                  <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '12px', color: 'var(--text-grey)', lineHeight: '1.6' }}>
                    {keyFeatures.map((feat, idx) => (
                      <li key={idx}>{feat}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
