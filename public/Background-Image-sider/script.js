// Destination data
const placeBackgrounds = {
    "Iceland": "url('images/iceland.jpg')",
    "Switzerland": "url('images/Jennifer.avif')",
    "Scotland": "url('images/Daniel.jpeg')",
    "Ireland": "url('images/kai.jpg')",
    "Germany": "url('images/Hannes-Becker4.jpg')"
};

const placeDescriptions = {
    "Iceland": "Explore the beauty of glaciers and the breathtaking landscapes of Iceland.",
    "Switzerland": "Experience the serene beauty of the Swiss Alps and picturesque villages.",
    "Scotland": "Discover the rich history and stunning highlands of Scotland.",
    "Ireland": "Immerse yourself in the lush green landscapes and vibrant culture of Ireland.",
    "Germany": "Explore Germany's charming cities and stunning countryside."
};

// Get all destinations as an array
const destinations = Object.keys(placeBackgrounds);

// DOM elements
const placeSelector = document.getElementById('placeSelector');
const bookingButton = document.getElementById('bookingButton');
const placeTitle = document.getElementById('placeTitle');
const placeDescription = document.getElementById('placeDescription');
const body = document.body;

// Update place function - reused for all navigation methods
function updatePlace(place) {
    body.style.backgroundImage = placeBackgrounds[place];
    placeTitle.textContent = place;
    placeDescription.textContent = placeDescriptions[place];
    bookingButton.textContent = `Book a Trip to ${place}`;
    
    // Sync dropdown
    placeSelector.value = place;
    
    // Update active indicator
    updateActiveIndicator(place);
}

// Generate destination indicators
function generateIndicators() {
    const indicatorContainer = document.getElementById('destinationIndicators');
    
    destinations.forEach((destination, index) => {
        const indicator = document.createElement('button');
        indicator.className = 'destination-dot';
        indicator.setAttribute('data-destination', destination);
        indicator.setAttribute('aria-label', `Go to ${destination}`);
        indicator.setAttribute('role', 'button');
        indicator.setAttribute('tabindex', '0');
        
        // Add click event
        indicator.addEventListener('click', () => {
            updatePlace(destination);
        });
        
        // Add keyboard support
        indicator.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                updatePlace(destination);
            }
        });
        
        indicatorContainer.appendChild(indicator);
    });
}

// Update active indicator
function updateActiveIndicator(place) {
    const indicators = document.querySelectorAll('.destination-dot');
    
    indicators.forEach(indicator => {
        if (indicator.getAttribute('data-destination') === place) {
            indicator.classList.add('active');
            indicator.setAttribute('aria-current', 'true');
        } else {
            indicator.classList.remove('active');
            indicator.removeAttribute('aria-current');
        }
    });
}

// Dropdown change event
placeSelector.addEventListener('change', function () {
    updatePlace(placeSelector.value);
});

// Initialize on page load
window.addEventListener('DOMContentLoaded', function () {
    const defaultPlace = "Iceland";
    
    // Generate indicators
    generateIndicators();
    
    // Set default place
    updatePlace(defaultPlace);
    
    // Add HOME button functionality
    const homeLink = document.getElementById('homeLink');
    if (homeLink) {
        homeLink.addEventListener('click', (e) => {
            e.preventDefault();
            updatePlace('Iceland');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
