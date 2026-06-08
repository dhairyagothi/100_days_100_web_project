/**
 * Map Module - Leaflet map initialization and interaction handling
 */

const MapManager = {
    map: null,
    guessMarker: null,
    actualMarker: null,
    line: null,
    
    /**
     * Initialize the Leaflet map
     * @param {string} containerId - ID of the map container element
     */
    init(containerId) {
        try {
            // Check if Leaflet is loaded
            if (typeof L === 'undefined') {
                console.error('Leaflet library not loaded!');
                return null;
            }
            
            // Check if container exists
            const container = document.getElementById(containerId);
            if (!container) {
                console.error('Map container not found!');
                return null;
            }
            
            // Initialize map centered on world view
            this.map = L.map(containerId, {
                center: [20, 0],
                zoom: 2,
                minZoom: 2,
                maxZoom: 18,
                worldCopyJump: true,
                maxBounds: [[-90, -180], [90, 180]]
            });
            
            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19,
                crossOrigin: true
            }).addTo(this.map);
            
            console.log('Map initialized successfully!');
            
            // Custom marker icons
        this.guessIcon = L.icon({
            iconUrl: 'data:image/svg+xml;base64,' + btoa(`
                <svg width="32" height="40" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 0C7.2 0 0 7.2 0 16c0 8.8 16 24 16 24s16-15.2 16-24C32 7.2 24.8 0 16 0z" 
                          fill="#3b82f6" stroke="#fff" stroke-width="2"/>
                    <circle cx="16" cy="16" r="6" fill="#fff"/>
                </svg>
            `),
            iconSize: [32, 40],
            iconAnchor: [16, 40],
            popupAnchor: [0, -40]
        });
        
        this.actualIcon = L.icon({
            iconUrl: 'data:image/svg+xml;base64,' + btoa(`
                <svg width="32" height="40" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 0C7.2 0 0 7.2 0 16c0 8.8 16 24 16 24s16-15.2 16-24C32 7.2 24.8 0 16 0z" 
                          fill="#10b981" stroke="#fff" stroke-width="2"/>
                    <circle cx="16" cy="16" r="6" fill="#fff"/>
                </svg>
            `),
            iconSize: [32, 40],
            iconAnchor: [16, 40],
            popupAnchor: [0, -40]
        });
        
        return this.map;
        } catch (error) {
            console.error('Error initializing map:', error);
            alert('Failed to load the map. Please check your internet connection and refresh the page.');
            return null;
        }
    },
    
    /**
     * Enable click handling on map
     * @param {Function} callback - Function to call when map is clicked
     */
    onMapClick(callback) {
        this.map.on('click', (e) => {
            const { lat, lng } = e.latlng;
            this.placeGuessMarker({ lat, lng });
            callback({ lat, lng });
        });
    },
    
    /**
     * Place or update the guess marker
     * @param {Object} coords - {lat, lng}
     */
    placeGuessMarker(coords) {
        // Remove existing guess marker if any
        if (this.guessMarker) {
            this.map.removeLayer(this.guessMarker);
        }
        
        // Add new guess marker
        this.guessMarker = L.marker([coords.lat, coords.lng], {
            icon: this.guessIcon
        }).addTo(this.map);
        
        this.guessMarker.bindPopup('<b>Your Guess</b>').openPopup();
    },
    
    /**
     * Show the actual location and draw connection line
     * @param {Object} actualCoords - {lat, lng}
     * @param {Object} guessCoords - {lat, lng}
     * @param {string} locationName - Name of the location
     */
    revealLocation(actualCoords, guessCoords, locationName) {
        // Add actual location marker
        this.actualMarker = L.marker([actualCoords.lat, actualCoords.lng], {
            icon: this.actualIcon
        }).addTo(this.map);
        
        this.actualMarker.bindPopup(`<b>${locationName}</b><br>Actual Location`).openPopup();
        
        // Draw line between guess and actual
        if (guessCoords) {
            this.line = L.polyline([
                [guessCoords.lat, guessCoords.lng],
                [actualCoords.lat, actualCoords.lng]
            ], {
                color: '#ef4444',
                weight: 3,
                opacity: 0.7,
                dashArray: '10, 10'
            }).addTo(this.map);
            
            // Fit bounds to show both markers
            const bounds = L.latLngBounds([
                [guessCoords.lat, guessCoords.lng],
                [actualCoords.lat, actualCoords.lng]
            ]);
            this.map.fitBounds(bounds, { padding: [50, 50] });
        } else {
            // If no guess, center on actual location
            this.map.setView([actualCoords.lat, actualCoords.lng], 6);
        }
    },
    
    /**
     * Clear all markers and lines from map
     */
    clearMarkers() {
        if (this.guessMarker) {
            this.map.removeLayer(this.guessMarker);
            this.guessMarker = null;
        }
        if (this.actualMarker) {
            this.map.removeLayer(this.actualMarker);
            this.actualMarker = null;
        }
        if (this.line) {
            this.map.removeLayer(this.line);
            this.line = null;
        }
    },
    
    /**
     * Reset map view to world
     */
    resetView() {
        if (!this.map) {
            console.warn('Map not initialized yet');
            return;
        }
        this.clearMarkers();
        this.map.setView([20, 0], 2);
    },
    
    /**
     * Disable map interactions
     */
    disableInteraction() {
        if (!this.map) return;
        this.map.off('click');
        this.map.dragging.disable();
        this.map.touchZoom.disable();
        this.map.doubleClickZoom.disable();
        this.map.scrollWheelZoom.disable();
        this.map.boxZoom.disable();
        this.map.keyboard.disable();
    },
    
    /**
     * Enable map interactions
     */
    enableInteraction() {
        if (!this.map) return;
        this.map.dragging.enable();
        this.map.touchZoom.enable();
        this.map.doubleClickZoom.enable();
        this.map.scrollWheelZoom.enable();
        this.map.boxZoom.enable();
        this.map.keyboard.enable();
    }
};
