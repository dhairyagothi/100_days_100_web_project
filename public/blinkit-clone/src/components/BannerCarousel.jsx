import React, { useState, useEffect } from 'react';

const bannerData = [
  {
    id: 1,
    title: 'Farm Fresh Produce',
    desc: 'Get direct-from-farm fresh vegetables & fruits delivered in 10 minutes at best prices.',
    bgColor: 'linear-gradient(135deg, #11998e, #38ef7d)',
    tag: 'UP TO 35% OFF',
    emoji: '🥦'
  },
  {
    id: 2,
    title: 'Super Saver Week',
    desc: 'Apply coupon BLINKIT50 to get flat ₹50 OFF on your first grocery delivery.',
    bgColor: 'linear-gradient(135deg, #FF416C, #FF4B2B)',
    tag: 'FLAT ₹50 OFF',
    emoji: '🎉'
  },
  {
    id: 3,
    title: 'Beat The Lucknow Heat',
    desc: 'Stock up on cool summer drinks, fruit juices, and instant energy mixes.',
    bgColor: 'linear-gradient(135deg, #FFB75E, #ED8F03)',
    tag: 'UP TO 20% OFF',
    emoji: '🥤'
  }
];

export default function BannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerData.length);
    }, 5000); // Change banner every 5 seconds
    return () => clearInterval(slideTimer);
  }, []);

  return (
    <div className="banners-section">
      <div 
        className="banner-track" 
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {bannerData.map((banner) => (
          <div 
            key={banner.id} 
            className="banner-slide" 
            style={{ background: banner.bgColor }}
          >
            <div className="banner-content">
              <span style={{
                background: 'rgba(255,255,255,0.2)',
                color: '#ffffff',
                fontWeight: '800',
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: '9999px',
                textTransform: 'uppercase',
                display: 'inline-block',
                marginBottom: '12px',
                letterSpacing: '1px'
              }}>
                {banner.tag}
              </span>
              <h2 className="banner-title">{banner.title}</h2>
              <p className="banner-desc">{banner.desc}</p>
              <button className="banner-btn">Shop Now</button>
            </div>

            <div className="banner-image-mock">
              <span style={{ fontSize: '100px', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.15))' }}>
                {banner.emoji}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="banner-dot-nav">
        {bannerData.map((_, idx) => (
          <button
            key={idx}
            className={`banner-dot ${currentIndex === idx ? 'active' : ''}`}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
