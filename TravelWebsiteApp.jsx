import React, { useState, useEffect, useCallback } from 'react';

// --- STEP 5: Verify Country Mapping Data ---
// Ensure every country has image entries.
// Keys are normalized to lowercase for robust matching.
const countryImages = {
  usa: [
    './images/usa-1.jpg',
    './images/usa-2.jpg',
    './images/usa-3.jpg',
  ],
  france: [
    './images/france-1.jpg',
    './images/france-2.jpg',
  ],
  india: [
    './images/india-1.jpg',
    './images/india-2.jpg',
    './images/india-3.jpg',
  ],
  japan: [ // Added Japan and other countries after India
    './images/japan-1.jpg',
    './images/japan-2.jpg',
  ],
  australia: [
    './images/australia-1.jpg',
    './images/australia-2.jpg',
  ],
  canada: [
    './images/canada-1.jpg',
    './images/canada-2.jpg',
  ],
  brazil: [
    './images/brazil-1.jpg',
    './images/brazil-2.jpg',
    './images/brazil-3.jpg',
  ],
};

// --- STEP 8: Add Fallback Image Handling ---
const defaultImages = [
  './images/default-bg-1.jpg',
  './images/default-bg-2.jpg',
];

const TravelWebsiteApp = () => {
  const [selectedCountry, setSelectedCountry] = useState('usa');
  const [currentBackgroundImages, setCurrentBackgroundImages] = useState(countryImages.usa);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Simulate image preloading (optional, but good for smooth transitions)
  const preloadImages = useCallback((images) => {
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Effect to handle country change and update background slider
  useEffect(() => {
    // --- STEP 6: Check Dropdown Value Matching & STEP 8: Add Fallback ---
    // Normalize the selected country name to match keys in countryImages object.
    const normalizedCountry = selectedCountry.trim().toLowerCase();
    const imagesToLoad = countryImages[normalizedCountry] || defaultImages;

    setCurrentBackgroundImages(imagesToLoad);
    setCurrentImageIndex(0); // Reset slider to the first image for the new country
    preloadImages(imagesToLoad); // Preload images for the new country

    // Start/reset the background slider interval
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex =>
        (prevIndex + 1) % imagesToLoad.length
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount or country change
  }, [selectedCountry, preloadImages]);

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  // --- STEP 7: Check Array Index Issues ---
  // The current implementation avoids direct array indexing based on dropdown position
  // by using the country name as a key, which is more robust.
  // If you were using an array of countries and indexing, you'd ensure:
  // const images = countryImages[selectedIndex]; // No +1 or hardcoded limits
  // for (let i = 0; i < allCountries.length; i++) // Loop through all, not just up to India

  return (
    <div className="travel-website-container">
      <style>
        {`
        .background-slider {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          transition: background-image 1s ease-in-out; /* Smooth transition */
          z-index: -1;
        }
        .country-selector {
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 10;
          padding: 10px;
          border-radius: 5px;
          background-color: rgba(0, 0, 0, 0.5);
          color: white;
        }
        `}
      </style>
      <div
        className="background-slider"
        style={{ backgroundImage: `url(${currentBackgroundImages[currentImageIndex]})` }}
      ></div>

      <select className="country-selector" onChange={handleCountryChange} value={selectedCountry}>
        {Object.keys(countryImages).map(country => (
          <option key={country} value={country}>{country.toUpperCase()}</option>
        ))}
      </select>
      {/* Other UI elements of your travel website */}
    </div>
  );
};

export default TravelWebsiteApp;
