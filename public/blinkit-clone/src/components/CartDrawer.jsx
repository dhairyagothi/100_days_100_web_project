import React, { useState } from 'react';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onAddToCart,
  onRemoveFromCart,
  onPlaceOrder,
  isLoggedIn,
  onOpenLogin
}) {
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [tipAmount, setTipAmount] = useState(0);

  if (!isOpen) return null;

  // Calculations
  const itemTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = itemTotal >= 200 || itemTotal === 0 ? 0 : 15;
  const handlingFee = itemTotal > 0 ? 4 : 0;
  
  // Calculate discount
  const discountAmount = couponApplied ? Math.min(couponDiscount, itemTotal) : 0;
  const grandTotal = Math.max(0, itemTotal + deliveryFee + handlingFee + tipAmount - discountAmount);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'BLINKIT50') {
      if (itemTotal < 150) {
        setCouponError('Minimum order of ₹150 required for this coupon');
        setCouponApplied(false);
        setCouponDiscount(0);
      } else {
        setCouponDiscount(50);
        setCouponApplied(true);
        setCouponError('');
      }
    } else {
      setCouponError('Invalid coupon code. Try BLINKIT50');
      setCouponApplied(false);
      setCouponDiscount(0);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(false);
    setCouponCode('');
    setCouponDiscount(0);
    setCouponError('');
  };

  const handleCheckoutClick = () => {
    if (!isLoggedIn) {
      onOpenLogin();
    } else {
      onPlaceOrder(grandTotal, discountAmount);
    }
  };

  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-header">
          <h3>My Cart</h3>
          <button className="cart-close" onClick={onClose} aria-label="Close cart">
            ✕
          </button>
        </div>

        {/* Scrollable list */}
        {cartItems.length === 0 ? (
          <div className="cart-empty-state">
            <div className="cart-empty-image">🛒</div>
            <h4>You don't have any items in your cart</h4>
            <p>Your favorite items are just a click away. Start shopping now!</p>
            <button className="cart-start-shopping-btn" onClick={onClose}>
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-scroll-content">
              {/* Delivery ETA info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--blinkit-green-light)',
                borderRadius: '8px',
                padding: '12px',
                gap: '12px',
                marginBottom: '16px',
                border: '1px solid rgba(12,131,31,0.1)'
              }}>
                <span style={{ fontSize: '24px' }}>⏱️</span>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--blinkit-green)' }}>
                    Delivering in 8 minutes!
                  </h4>
                  <p style={{ fontSize: '11px', color: 'var(--text-grey)', marginTop: '2px' }}>
                    Lucknow's fastest grocery delivery dispatching now
                  </p>
                </div>
              </div>

              {/* Items Container */}
              <div className="cart-items-box">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item-row">
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                    
                    <div className="cart-item-info">
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-qty-lbl">{item.weight}</div>
                      <div className="cart-item-price">₹{item.price * item.quantity}</div>
                    </div>

                    <div className="add-btn-container" style={{ width: '72px' }}>
                      <div className="add-btn-active">
                        <button className="counter-action" onClick={() => onRemoveFromCart(item)}>
                          -
                        </button>
                        <span className="counter-value">{item.quantity}</span>
                        <button className="counter-action" onClick={() => onAddToCart(item)}>
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon code */}
              <div className="coupon-section">
                <div className="tip-title" style={{ marginBottom: '8px' }}>Promo Coupons</div>
                {!couponApplied ? (
                  <form onSubmit={handleApplyCoupon} className="coupon-input-row">
                    <input
                      type="text"
                      placeholder="Enter Promo Code (e.g. BLINKIT50)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button type="submit" className="coupon-btn">
                      Apply
                    </button>
                  </form>
                ) : (
                  <div className="coupon-applied-msg">
                    <span>🎉 Coupon "<strong>{couponCode.toUpperCase()}</strong>" applied (₹{discountAmount} Saved)</span>
                    <strong className="coupon-remove" onClick={handleRemoveCoupon}>Remove</strong>
                  </div>
                )}
                {couponError && (
                  <div style={{ color: '#f44336', fontSize: '11px', marginTop: '6px', fontWeight: '500' }}>
                    {couponError}
                  </div>
                )}
                <div style={{ fontSize: '10px', color: 'var(--text-light)', marginTop: '6px' }}>
                  Use code <strong style={{ color: 'var(--text-grey)' }}>BLINKIT50</strong> on orders above ₹150.
                </div>
              </div>

              {/* Delivery Boy Tip */}
              <div className="tip-section">
                <div className="tip-title">Say thanks to Lucknow's delivery heroes</div>
                <div className="tip-desc">100% of the tip goes to your delivery partner.</div>
                <div className="tip-options">
                  {[10, 20, 30, 50].map((amt) => (
                    <button
                      key={amt}
                      className={`tip-option-btn ${tipAmount === amt ? 'active' : ''}`}
                      onClick={() => setTipAmount(tipAmount === amt ? 0 : amt)}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Receipt details */}
              <div className="bill-section">
                <div className="bill-title">Bill Details</div>
                <div className="bill-row">
                  <span>Item Total</span>
                  <span>₹{itemTotal}</span>
                </div>
                <div className="bill-row">
                  <span>Delivery Partner Fee</span>
                  <span>{deliveryFee === 0 ? <strong style={{ color: 'var(--blinkit-green)' }}>FREE</strong> : `₹${deliveryFee}`}</span>
                </div>
                <div className="bill-row">
                  <span>Handling & Packing Charges</span>
                  <span>₹{handlingFee}</span>
                </div>
                {tipAmount > 0 && (
                  <div className="bill-row">
                    <span>Delivery Partner Tip</span>
                    <span>₹{tipAmount}</span>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="bill-row" style={{ color: 'var(--blinkit-green)', fontWeight: '600' }}>
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="bill-row grand-total">
                  <span>Grand Total</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>
            </div>

            {/* Sticky Checkout CTA */}
            <div className="cart-footer">
              <button className="checkout-btn" onClick={handleCheckoutClick}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '14px', fontWeight: '800' }}>₹{grandTotal}</span>
                  <span style={{ fontSize: '10px', opacity: 0.8, fontWeight: '500' }}>TOTAL BILL</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>{isLoggedIn ? 'Place Order' : 'Login to Place Order'}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
