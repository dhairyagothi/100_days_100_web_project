/**
 * Data Module - Location dataset and configuration
 * Contains all location data with hints, coordinates, and images
 */

const GameData = {
    // Game configuration
    config: {
        totalRounds: 5,
        maxHints: 3,
        hintPenalty: 50,
        
        // Scoring system (based on distance in km)
        scoring: {
            perfect: { max: 50, points: 5000 },
            excellent: { max: 250, points: 4000 },
            great: { max: 750, points: 3000 },
            good: { max: 1500, points: 2000 },
            okay: { max: 3000, points: 1000 },
            poor: { max: 6000, points: 500 },
            minimum: 100
        }
    },
    
    // Location database
    locations: {
        easy: [
            {
                id: 1,
                name: "Eiffel Tower, Paris",
                country: "France",
                coordinates: { lat: 48.8584, lng: 2.2945 },
                image: "images/Eiffel Tower, Paris.jpg",
                hints: [
                    "🗼 This iconic iron lattice tower is one of the most recognizable landmarks in the world",
                    "🇫🇷 Located in the capital city of France",
                    "🍷 Built for the 1889 World's Fair, it's now the symbol of Paris"
                ]
            },
            {
                id: 2,
                name: "Statue of Liberty, New York",
                country: "United States",
                coordinates: { lat: 40.6892, lng: -74.0445 },
                image: "images/Statue of Liberty, New York.jpg",
                hints: [
                    "🗽 A colossal neoclassical sculpture symbolizing freedom",
                    "🇺🇸 Gift from France to the United States in 1886",
                    "🏙️ Located on Liberty Island in New York Harbor"
                ]
            },
            {
                id: 3,
                name: "Big Ben, London",
                country: "United Kingdom",
                coordinates: { lat: 51.5007, lng: -0.1246 },
                image: "images/Big Ben, London.jpg",
                hints: [
                    "🕰️ Famous clock tower officially known as Elizabeth Tower",
                    "🇬🇧 Located at the Palace of Westminster in London",
                    "☕ The bell inside weighs over 13 tons"
                ]
            },
            {
                id: 4,
                name: "Great Wall of China",
                country: "China",
                coordinates: { lat: 40.4319, lng: 116.5704 },
                image: "images/Great Wall of China.jpg",
                hints: [
                    "🏯 Ancient fortification stretching thousands of kilometers",
                    "🇨🇳 Built over centuries to protect Chinese states",
                    "🏔️ Visible from space (actually a myth, but well-known)"
                ]
            },
            {
                id: 5,
                name: "Sydney Opera House",
                country: "Australia",
                coordinates: { lat: -33.8568, lng: 151.2153 },
                image: "images/Sydney Opera House.jpg",
                hints: [
                    "🎭 Iconic performing arts centre with unique shell-like design",
                    "🇦🇺 Located on Sydney Harbour in Australia",
                    "🏗️ Opened in 1973, UNESCO World Heritage Site"
                ]
            },
            {
                id: 6,
                name: "Christ the Redeemer, Rio",
                country: "Brazil",
                coordinates: { lat: -22.9519, lng: -43.2105 },
                image: "images/Christ the Redeemer, Rio.jpg",
                hints: [
                    "✝️ Massive Art Deco statue of Jesus Christ",
                    "🇧🇷 Overlooks Rio de Janeiro from Corcovado mountain",
                    "🏔️ Stands 30 meters tall with 28-meter wide arms"
                ]
            },
            {
                id: 7,
                name: "Taj Mahal, Agra",
                country: "India",
                coordinates: { lat: 27.1751, lng: 78.0421 },
                image: "images/Taj Mahal, Agra.jpg",
                hints: [
                    "🕌 Magnificent white marble mausoleum",
                    "🇮🇳 Built by Mughal emperor Shah Jahan for his wife",
                    "💎 One of the Seven Wonders of the Modern World"
                ]
            },
            {
                id: 8,
                name: "Colosseum, Rome",
                country: "Italy",
                coordinates: { lat: 41.8902, lng: 12.4922 },
                image: "images/Colosseum, Rome.jpg",
                hints: [
                    "🏛️ Ancient amphitheater built in 70-80 AD",
                    "🇮🇹 Located in the center of Rome, Italy",
                    "⚔️ Once held gladiatorial contests and public spectacles"
                ]
            },
            {
                id: 9,
                name: "Leaning Tower of Pisa",
                country: "Italy",
                coordinates: { lat: 43.7229, lng: 10.3966 },
                image: "images/Leaning Tower of Pisa.jpg",
                hints: [
                    "🏛️ Famous freestanding bell tower known for its unintended tilt",
                    "🇮🇹 Located in Pisa, Italy",
                    "📸 Popular tourist spot for 'holding up the tower' photos"
                ]
            },
            {
                id: 10,
                name: "Buckingham Palace, London",
                country: "United Kingdom",
                coordinates: { lat: 51.5014, lng: -0.1419 },
                image: "images/Buckingham Palace, London.jpg",
                hints: [
                    "🏰 Official residence of the British monarch",
                    "🇬🇧 Located in the City of Westminster, London",
                    "👑 Famous for the Changing of the Guard ceremony"
                ]
            },
            {
                id: 11,
                name: "Niagara Falls",
                country: "Canada/United States",
                coordinates: { lat: 43.0962, lng: -79.0377 },
                image: "images/Niagara Falls.jpg",
                hints: [
                    "💦 Massive waterfalls on the border of Canada and the USA",
                    "🇨🇦🇺🇸 Famous for its powerful flow and boat tours",
                    "🌈 Often displays rainbows in the mist"
                ]
            },
        ],
        
        medium: [
            {
                id: 9,
                name: "Machu Picchu",
                country: "Peru",
                coordinates: { lat: -13.1631, lng: -72.5450 },
                image: "images/Machu Picchu.jpg",
                hints: [
                    "🏔️ Ancient Incan citadel set high in the Andes Mountains",
                    "🇵🇪 Located above the Sacred Valley in Peru",
                    "🗿 Often referred to as the 'Lost City of the Incas'"
                ]
            },
            {
                id: 10,
                name: "Petra, Jordan",
                country: "Jordan",
                coordinates: { lat: 30.3285, lng: 35.4444 },
                image: "images/Petra, Jordan.jpg",
                hints: [
                    "🏜️ Ancient city carved into rose-red rock cliffs",
                    "🇯🇴 Archaeological site in southern Jordan",
                    "🎬 Featured in Indiana Jones and the Last Crusade"
                ]
            },
            {
                id: 11,
                name: "Angkor Wat, Cambodia",
                country: "Cambodia",
                coordinates: { lat: 13.4125, lng: 103.8670 },
                image: "images/Angkor Wat, Cambodia.jpg",
                hints: [
                    "🛕 Largest religious monument in the world",
                    "🇰🇭 Hindu temple complex in Cambodia",
                    "🌅 Built in the 12th century, now a Buddhist temple"
                ]
            },
            {
                id: 12,
                name: "Stonehenge",
                country: "United Kingdom",
                coordinates: { lat: 51.1789, lng: -1.8262 },
                image: "images/Stonehenge.jpg",
                hints: [
                    "🗿 Prehistoric stone circle monument",
                    "🇬🇧 Located in Wiltshire, England",
                    "☀️ Aligned with solstices, built around 3000 BC"
                ]
            },
            {
                id: 13,
                name: "Santorini, Greece",
                country: "Greece",
                coordinates: { lat: 36.3932, lng: 25.4615 },
                image: "images/Santorini, Greece.jpg",
                hints: [
                    "🏝️ Stunning island with white-washed buildings",
                    "🇬🇷 Part of the Cyclades islands in the Aegean Sea",
                    "🌋 Formed by a massive volcanic eruption"
                ]
            },
            {
                id: 14,
                name: "Mount Fuji, Japan",
                country: "Japan",
                coordinates: { lat: 35.3606, lng: 138.7278 },
                image: "images/Mount Fuji, Japan.jpg",
                hints: [
                    "🗻 Iconic snow-capped stratovolcano",
                    "🇯🇵 Japan's highest mountain at 3,776 meters",
                    "🎨 Frequently depicted in Japanese art and literature"
                ]
            },
            {
                id: 15,
                name: "Golden Gate Bridge, San Francisco",
                country: "United States",
                coordinates: { lat: 37.8199, lng: -122.4783 },
                image: "images/Golden Gate Bridge, San Francisco.jpg",
                hints: [
                    "🌉 Iconic red suspension bridge spanning the Golden Gate Strait",
                    "🇺🇸 Located in San Francisco, California",
                    "🌁 Often shrouded in fog, opened in 1937"
                ]
            },
            {
                id: 16,
                name: "Table Mountain, Cape Town",
                country: "South Africa",
                coordinates: { lat: -33.9628, lng: 18.4098 },
                image: "images/Table Mountain, Cape Town.jpg",
                hints: [
                    "⛰️ Flat-topped mountain overlooking Cape Town",
                    "🇿🇦 One of the New7Wonders of Nature",
                    "🚠 Accessible by cableway or hiking"
                ]
            },
            {
                id: 17,
                name: "Alhambra, Granada",
                country: "Spain",
                coordinates: { lat: 37.1761, lng: -3.5881 },
                image: "images/Alhambra, Granada.jpg",
                hints: [
                    "🏰 Palace and fortress complex of the Moorish monarchs",
                    "🇪🇸 Located in Granada, Andalusia, Spain",
                    "🌹 Famous for its Islamic architecture and gardens"
                ]
            },
            {
                id: 18,
                name: "Banff National Park",
                country: "Canada",
                coordinates: { lat: 51.4968, lng: -115.9281 },
                image: "images/Banff National Park.jpg",
                hints: [
                    "🏞️ Canada's oldest national park, established in 1885",
                    "🇨🇦 Located in the Rocky Mountains, Alberta",
                    "🏔️ Known for its turquoise lakes and mountain scenery"
                ]
            },
            {
                id: 19,
                name: "Chichen Itza, Yucatán",
                country: "Mexico",
                coordinates: { lat: 20.6843, lng: -88.5678 },
                image: "images/Chichen Itza, Yucatán.jpg",
                hints: [
                    "🗿 Large pre-Columbian archaeological site built by the Maya civilization",
                    "🇲🇽 Located in the Yucatán Peninsula, Mexico",
                    "🌞 Famous for the pyramid of Kukulcán and astronomical alignments"
                ]
            },
            {
                id: 20,
                name: "Neuschwanstein Castle",
                country: "Germany",
                coordinates: { lat: 47.5576, lng: 10.7498 },
                image: "images/Neuschwanstein Castle.jpg",
                hints: [
                    "🏰 Fairytale castle that inspired Disney's Sleeping Beauty Castle",
                    "🇩🇪 Located in Bavaria, Germany",
                    "👑 Built by King Ludwig II in the 19th century"
                ]
            }
        ],
        
        hard: [
            {
                id: 16,
                name: "Cappadocia, Turkey",
                country: "Turkey",
                coordinates: { lat: 38.6431, lng: 34.8289 },
                image: "images/Cappadocia, Turkey.jpg",
                hints: [
                    "🎈 Famous for hot air balloon rides over unique rock formations",
                    "🇹🇷 Historical region in Central Anatolia",
                    "🏔️ Known for 'fairy chimneys' and underground cities"
                ]
            },
            {
                id: 17,
                name: "Moai Statues, Easter Island",
                country: "Chile",
                coordinates: { lat: -27.1127, lng: -109.3497 },
                image: "images/Moai Statues, Easter Island.jpg",
                hints: [
                    "🗿 Mysterious giant stone head sculptures",
                    "🇨🇱 Remote Polynesian island in the Pacific Ocean",
                    "❓ Created by the Rapa Nui people between 1250-1500 CE"
                ]
            },
            {
                id: 18,
                name: "Zhangjiajie National Forest",
                country: "China",
                coordinates: { lat: 29.3255, lng: 110.4798 },
                image: "images/Zhangjiajie National Forest.jpg",
                hints: [
                    "🏞️ Pillar-like rock formations resembling floating mountains",
                    "🇨🇳 Inspired the Hallelujah Mountains in Avatar movie",
                    "🌁 Often shrouded in mist, creating ethereal landscapes"
                ]
            },
            {
                id: 19,
                name: "Salar de Uyuni, Bolivia",
                country: "Bolivia",
                coordinates: { lat: -20.3080, lng: -66.8250 },
                image: "images/Salar de Uyuni, Bolivia.jpg",
                hints: [
                    "💎 World's largest salt flat spanning over 10,000 sq km",
                    "🇧🇴 Located in southwest Bolivia",
                    "🪞 Creates a mirror effect during rainy season"
                ]
            },
            {
                id: 20,
                name: "Ha Long Bay, Vietnam",
                country: "Vietnam",
                coordinates: { lat: 20.9101, lng: 107.1839 },
                image: "images/Ha Long Bay, Vietnam.jpg",
                hints: [
                    "🛶 Emerald waters dotted with thousands of limestone islands",
                    "🇻🇳 UNESCO World Heritage Site in northern Vietnam",
                    "🐉 Name translates to 'Descending Dragon Bay'"
                ]
            },
            {
                id: 21,
                name: "Plitvice Lakes, Croatia",
                country: "Croatia",
                coordinates: { lat: 44.8654, lng: 15.5820 },
                image: "images/Plitvice Lakes, Croatia.jpg",
                hints: [
                    "💧 Series of 16 terraced lakes connected by waterfalls",
                    "🇭🇷 National park in Croatia",
                    "🌈 Crystal-clear waters range from azure to green"
                ]
            },
            {
                id: 22,
                name: "Socotra Island, Yemen",
                country: "Yemen",
                coordinates: { lat: 12.4634, lng: 53.8236 },
                image: "images/Socotra Island, Yemen.jpg",
                hints: [
                    "🌳 Known for its alien-like Dragon's Blood trees",
                    "🇾🇪 Isolated island in the Arabian Sea",
                    "🦎 Home to unique flora and fauna found nowhere else"
                ]
            },
            {
                id: 23,
                name: "Lake Baikal, Russia",
                country: "Russia",
                coordinates: { lat: 53.5587, lng: 108.1650 },
                image: "images/Lake Baikal, Russia.jpg",
                hints: [
                    "🌊 Deepest and oldest freshwater lake in the world",
                    "🇷🇺 Located in southern Siberia, Russia",
                    "❄️ Famous for its crystal-clear ice in winter"
                ]
            },
            {
                id: 24,
                name: "Mount Roraima, Venezuela",
                country: "Venezuela",
                coordinates: { lat: 5.1412, lng: -60.7636 },
                image: "images/Mount Roraima, Venezuela.jpg",
                hints: [
                    "⛰️ Flat-topped mountain (tepui) with sheer cliffs",
                    "🇻🇪 Located at the triple border point of Venezuela, Brazil, and Guyana",
                    "🌧️ Inspiration for the movie 'Up' by Pixar"
                ]
            },
            {
                id: 25,
                name: "Mount Erebus, Antarctica",
                country: "Antarctica",
                coordinates: { lat: -77.5300, lng: 167.1600 },
                image: "images/Mount Erebus, Antarctica.jpg",
                hints: [
                    "🌋 Southernmost active volcano on Earth",
                    "🇦🇶 Located on Ross Island, Antarctica",
                    "🔥 Known for its persistent lava lake"
                ]
            },
            {
                id: 26,
                name: "Pamukkale, Turkey",
                country: "Turkey",
                coordinates: { lat: 37.9240, lng: 29.1187 },
                image: "images/Pamukkale, Turkey.jpg",
                hints: [
                    "🏞️ Terraced hot springs with white travertine formations",
                    "🇹🇷 Located in southwestern Turkey",
                    "💧 Name means 'cotton castle' in Turkish"
                ]
            },
        ]
    },
    
    /**
     * Get random locations for a game session
     * @param {string} difficulty - easy, medium, or hard
     * @param {number} count - number of locations needed
     * @returns {Array} Array of shuffled locations
     */
    getRandomLocations(difficulty, count = 5) {
        const pool = this.locations[difficulty] || this.locations.medium;
        const shuffled = [...pool].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, shuffled.length));
    },
    
    /**
     * Calculate score based on distance
     * @param {number} distance - Distance in kilometers
     * @returns {number} Points earned
     */
    calculateScore(distance) {
        const { scoring } = this.config;
        
        if (distance <= scoring.perfect.max) return scoring.perfect.points;
        if (distance <= scoring.excellent.max) return scoring.excellent.points;
        if (distance <= scoring.great.max) return scoring.great.points;
        if (distance <= scoring.good.max) return scoring.good.points;
        if (distance <= scoring.okay.max) return scoring.okay.points;
        if (distance <= scoring.poor.max) return scoring.poor.points;
        return scoring.minimum;
    }
};
