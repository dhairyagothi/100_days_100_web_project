import React, { useState } from 'react';
import { mockAreas } from '../data/products';

export default function LocationModal({ onClose, onLocationSelect, currentLocation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);

  // Filter areas based on input
  const filteredAreas = mockAreas.filter(area =>
    area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDetectLocation = () => {
    setIsDetecting(true);
    setTimeout(() => {
      // Pick Gomti Nagar as the detected location
      const detected = 'Gomti Nagar Extension, Lucknow';
      onLocationSelect(detected);
      setIsDetecting(false);
      onClose();
    }, 1500); // 1.5s delay to simulate GPS lookup
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close flex-center" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        <div className="location-modal">
          <h3>Select Delivery Location</h3>
          <p>We deliver groceries, vegetables, and everyday household items in minutes.</p>

          <div className="location-search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search city, street or locality in Lucknow..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>

          <button 
            className="detect-location-btn" 
            onClick={handleDetectLocation}
            disabled={isDetecting}
          >
            {isDetecting ? (
              <>
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ animation: 'spin 1s linear infinite' }}>
                  <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="8"></circle>
                </svg>
                Detecting current address...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                Detect My Location (GPS)
              </>
            )}
          </button>

          <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-dark)' }}>
            Popular Localities in Lucknow
          </div>

          <div className="popular-areas-list">
            {filteredAreas.length > 0 ? (
              filteredAreas.map((area) => (
                <button
                  key={area}
                  className={`popular-area-item ${currentLocation === area ? 'active' : ''}`}
                  onClick={() => {
                    onLocationSelect(area);
                    onClose();
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0, color: 'var(--text-grey)' }}>
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {area.replace(', Lucknow', '')}
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div style={{ gridColumn: 'span 2', textAlign: 'center', color: 'var(--text-light)', fontSize: '13px', padding: '12px 0' }}>
                No area matches your search query.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
