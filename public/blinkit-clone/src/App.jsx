import React, { useState } from 'react';
import Header from './components/Header';
import BannerCarousel from './components/BannerCarousel';
import CategoriesGrid from './components/CategoriesGrid';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import LocationModal from './components/LocationModal';
import LoginModal from './components/LoginModal';
import OrderTracker from './components/OrderTracker';
import { products, categories } from './data/products';

export default function App() {
  // Global App States
  const [currentLocation, setCurrentLocation] = useState('Gomti Nagar, Lucknow');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState(null); // stores user phone number
  const [orderStatus, setOrderStatus] = useState('shopping'); // 'shopping' | 'tracking'
  const [trackingInfo, setTrackingInfo] = useState(null);

  // Cart Functions
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing.quantity === 1) {
        return prevCart.filter((item) => item.id !== product.id);
      }
      return prevCart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  const handleResetCart = () => {
    setCart([]);
    setOrderStatus('shopping');
    setTrackingInfo(null);
  };

  // Login Functions
  const handleLoginSuccess = (phone) => {
    setUser(phone);
    setIsLoginOpen(false);
  };

  const handleLogout = () => {
    if (window.confirm('Do you want to log out?')) {
      setUser(null);
    }
  };

  // Place Order Action
  const handlePlaceOrder = (grandTotal, discountAmount) => {
    setTrackingInfo({
      orderTotal: grandTotal,
      discountAmount: discountAmount,
      deliveryAddress: currentLocation
    });
    setOrderStatus('tracking');
    setIsCartOpen(false);
  };

  // Filter Products
  const filteredProducts = products.filter((prod) => {
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === 'all' || prod.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Universal Header */}
      <Header
        location={currentLocation}
        onLocationClick={() => setIsLocationOpen(true)}
        onCartClick={() => setIsCartOpen(true)}
        cartCount={cartCount}
        cartTotal={cartTotal}
        user={user}
        onLoginClick={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main style={{ flexGrow: 1 }}>
        {orderStatus === 'tracking' && trackingInfo ? (
          /* Live Order Tracking Page */
          <OrderTracker
            orderTotal={trackingInfo.orderTotal}
            discountAmount={trackingInfo.discountAmount}
            deliveryAddress={trackingInfo.deliveryAddress}
            onResetCart={handleResetCart}
          />
        ) : (
          /* Standard Storefront Landing Page */
          <div className="container home-page">
            <BannerCarousel />
            
            <CategoriesGrid
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
            />

            {/* Main Product Layout: Left Sidebar Categories, Right Cards Grid */}
            <div className="products-layout">
              <aside className="sidebar-categories">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    className={`sidebar-item ${activeCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    <span style={{ fontSize: '18px' }}>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </aside>

              <div className="products-content">
                <div className="products-header-bar">
                  <h3 className="section-title" style={{ marginBottom: 0 }}>
                    {categories.find((c) => c.id === activeCategory)?.label || 'Products'}
                  </h3>
                  <span className="products-count">
                    Showing {filteredProducts.length} items
                  </span>
                </div>

                {filteredProducts.length > 0 ? (
                  <div className="products-grid">
                    {filteredProducts.map((prod) => {
                      const cartItem = cart.find((c) => c.id === prod.id);
                      const cartQty = cartItem ? cartItem.quantity : 0;
                      return (
                        <ProductCard
                          key={prod.id}
                          product={prod}
                          cartQty={cartQty}
                          onAddToCart={handleAddToCart}
                          onRemoveFromCart={handleRemoveFromCart}
                          onCardClick={() => setSelectedProduct(prod)}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '80px 20px',
                    background: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)'
                  }}>
                    <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>🔍</span>
                    <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>No items match your filters</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-light)' }}>Try searching for a different keyword or check other categories.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--border-color)',
        padding: '30px 0',
        marginTop: '60px',
        fontSize: '13px',
        color: 'var(--text-grey)',
        textAlign: 'center'
      }}>
        <div className="container">
          <p>© {new Date().getFullYear()} Blinkit Clone. Developed using React + Vite + Vanilla CSS.</p>
          <p style={{ marginTop: '6px', fontSize: '11px', color: 'var(--text-light)' }}>
            This application is a mock clone created for demonstration purposes. Images are sourced from Unsplash.
          </p>
        </div>
      </footer>

      {/* Dynamic Popups & Overlays */}
      {isLocationOpen && (
        <LocationModal
          onClose={() => setIsLocationOpen(false)}
          onLocationSelect={setCurrentLocation}
          currentLocation={currentLocation}
        />
      )}

      {isLoginOpen && (
        <LoginModal
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          cartQty={cart.find((c) => c.id === selectedProduct.id)?.quantity || 0}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
        onPlaceOrder={handlePlaceOrder}
        isLoggedIn={!!user}
        onOpenLogin={() => {
          setIsCartOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </div>
  );
}
