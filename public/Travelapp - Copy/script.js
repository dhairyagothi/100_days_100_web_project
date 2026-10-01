// Sample destination data
const destinationsData = [
    // NORTH INDIA (15 destinations)
    { id: 1, name: "Delhi", state: "Delhi", region: " India", emoji: "🏙️", tags: ["capital", "historical", "monuments", "food", "shopping"] },
    { id: 2, name: "Agra", state: "Uttar Pradesh", region: " India", emoji: "🏛️", tags: ["Taj Mahal", "historical", "architecture", "Mughal", "wonder"] },
    { id: 3, name: "Jaipur", state: "Rajasthan", region: " India", emoji: "🏰", tags: ["pink city", "palaces", "forts", "culture", "shopping"] },
    { id: 4, name: "Varanasi", state: "Uttar Pradesh", region: " India", emoji: "🙏", tags: ["spiritual", "Ganges", "ancient", "ghats", "temples"] },
    { id: 5, name: "Leh-Ladakh", state: "Ladakh", region: " India", emoji: "🏔️", tags: ["mountains", "monasteries", "landscapes", "adventure", "remote"] },
    { id: 6, name: "Amritsar", state: "Punjab", region: " India", emoji: "🛕", tags: ["Golden Temple", "religious", "border ceremony", "food", "history"] },
    { id: 7, name: "Shimla", state: "Himachal Pradesh", region: " India", emoji: "⛰️", tags: ["hill station", "colonial", "mall road", "mountains", "toy train"] },
    { id: 8, name: "Rishikesh", state: "Uttarakhand", region: " India", emoji: "🧘", tags: ["yoga", "spiritual", "Ganges", "adventure", "Beatles"] },
    { id: 9, name: "Manali", state: "Himachal Pradesh", region: " India", emoji: "⛰️", tags: ["mountains", "adventure", "honeymoon", "snow", "hiking"] },
    { id: 10, name: "Udaipur", state: "Rajasthan", region: " India", emoji: "🏰", tags: ["lakes", "palaces", "romantic", "architecture", "city of lakes"] },
    { id: 11, name: "Jodhpur", state: "Rajasthan", region: " India", emoji: "🏰", tags: ["blue city", "fort", "desert", "culture", "architecture"] },
    { id: 12, name: "Dharamshala", state: "Himachal Pradesh", region: " India", emoji: "⛰️", tags: ["Dalai Lama", "mountains", "Tibetan", "peaceful", "cricket"] },
    { id: 13, name: "Jaisalmer", state: "Rajasthan", region: " India", emoji: "🏜️", tags: ["desert", "golden city", "camel safari", "fort", "havelis"] },
    { id: 14, name: "Jim Corbett National Park", state: "Uttarakhand", region: " India", emoji: "🐯", tags: ["wildlife", "tigers", "safari", "nature", "birdwatching"] },
    { id: 15, name: "Haridwar", state: "Uttarakhand", region: " India", emoji: "🙏", tags: ["spiritual", "Ganges", "temples", "aarti", "pilgrimage"] },
    
    // SOUTH INDIA (12 destinations)
    { id: 16, name: "Goa", state: "Goa", region: "South India", emoji: "🏝️", tags: ["beaches", "parties", "Portuguese", "seafood", "relaxation"] },
    { id: 17, name: "Kerala Backwaters", state: "Kerala", region: "South India", emoji: "🚣", tags: ["houseboats", "tranquil", "coconut trees", "villages", "canals"] },
    { id: 18, name: "Munnar", state: "Kerala", region: "South India", emoji: "☕", tags: ["tea plantations", "hills", "cool climate", "scenic", "wildlife"] },
    { id: 19, name: "Hampi", state: "Karnataka", region: "South India", emoji: "🏛️", tags: ["ruins", "UNESCO", "ancient", "temples", "boulders"] },
    { id: 20, name: "Mysore", state: "Karnataka", region: "South India", emoji: "🏰", tags: ["palace", "silk", "sandalwood", "dussehra", "yoga"] },
    { id: 21, name: "Ooty", state: "Tamil Nadu", region: "South India", emoji: "⛰️", tags: ["hill station", "tea", "toy train", "botanical gardens", "lakes"] },
    { id: 22, name: "Chennai", state: "Tamil Nadu", region: "South India", emoji: "🏙️", tags: ["city", "beaches", "cultural", "temples", "food"] },
    { id: 23, name: "Pondicherry", state: "Puducherry", region: "South India", emoji: "🏖️", tags: ["French", "Auroville", "beaches", "colonial", "spiritual"] },
    { id: 24, name: "Coorg", state: "Karnataka", region: "South India", emoji: "☕", tags: ["coffee", "hills", "waterfalls", "scenic", "homestays"] },
    { id: 25, name: "Madurai", state: "Tamil Nadu", region: "South India", emoji: "🛕", tags: ["Meenakshi Temple", "ancient", "cultural", "architecture", "food"] },
    { id: 26, name: "Kanyakumari", state: "Tamil Nadu", region: "South India", emoji: "🌊", tags: ["southern tip", "oceans", "sunrise", "sunset", "memorial"] },
    { id: 27, name: "Mahabalipuram", state: "Tamil Nadu", region: "South India", emoji: "🏛️", tags: ["shore temple", "UNESCO", "stone carving", "beach", "ancient"] },
    
    // EAST INDIA (8 destinations)
    { id: 28, name: "Kolkata", state: "West Bengal", region: "East India", emoji: "🏙️", tags: ["cultural", "colonial", "literature", "durga puja", "food"] },
    { id: 29, name: "Darjeeling", state: "West Bengal", region: "East India", emoji: "☕", tags: ["tea", "mountains", "toy train", "sunrise", "colonial"] },
    { id: 30, name: "Sundarbans", state: "West Bengal", region: "East India", emoji: "🐯", tags: ["mangroves", "tigers", "UNESCO", "delta", "wildlife"] },
    { id: 31, name: "Puri", state: "Odisha", region: "East India", emoji: "🛕", tags: ["Jagannath Temple", "beach", "religious", "rath yatra", "seafood"] },
    { id: 32, name: "Gangtok", state: "Sikkim", region: "East India", emoji: "⛰️", tags: ["mountains", "monasteries", "clean", "viewpoints", "culture"] },
    { id: 33, name: "Konark", state: "Odisha", region: "East India", emoji: "🛕", tags: ["Sun Temple", "UNESCO", "architecture", "sculptures", "ancient"] },
    { id: 34, name: "Kaziranga National Park", state: "Assam", region: "East India", emoji: "🦏", tags: ["rhinos", "wildlife", "UNESCO", "safari", "conservation"] },
    { id: 35, name: "Shillong", state: "Meghalaya", region: "East India", emoji: "⛰️", tags: ["hills", "waterfalls", "music", "Scotland of the East", "lakes"] },
    
    // WEST INDIA (8 destinations)
    { id: 36, name: "Mumbai", state: "Maharashtra", region: "West India", emoji: "🏙️", tags: ["city", "Bollywood", "coastal", "business", "food"] },
    { id: 37, name: "Rann of Kutch", state: "Gujarat", region: "West India", emoji: "🏜️", tags: ["white desert", "salt marsh", "festival", "crafts", "unique"] },
    { id: 38, name: "Ajanta & Ellora Caves", state: "Maharashtra", region: "West India", emoji: "🏛️", tags: ["UNESCO", "caves", "sculptures", "ancient", "architecture"] },
    { id: 39, name: "Ahmedabad", state: "Gujarat", region: "West India", emoji: "🏙️", tags: ["heritage city", "Gandhi Ashram", "textile", "cuisine", "architecture"] },
    { id: 40, name: "Lonavala", state: "Maharashtra", region: "West India", emoji: "⛰️", tags: ["hill station", "monsoon", "forts", "chikki", "viewpoints"] },
    { id: 41, name: "Diu", state: "Daman and Diu", region: "West India", emoji: "🏖️", tags: ["beach", "Portuguese", "fort", "quiet", "seafood"] },
    { id: 42, name: "Mahabaleshwar", state: "Maharashtra", region: "West India", emoji: "⛰️", tags: ["strawberries", "viewpoints", "hill station", "boating", "trekking"] },
    { id: 43, name: "Statue of Unity", state: "Gujarat", region: "West India", emoji: "🗽", tags: ["tallest statue", "Sardar Patel", "viewpoint", "modern", "tourist attraction"] },
    
    // CENTRAL INDIA (7 destinations)
    { id: 44, name: "Khajuraho", state: "Madhya Pradesh", region: "Central India", emoji: "🏛️", tags: ["temples", "UNESCO", "sculptures", "architecture", "ancient"] },
    { id: 45, name: "Orchha", state: "Madhya Pradesh", region: "Central India", emoji: "🏰", tags: ["fort", "temples", "palaces", "river", "medieval"] },
    { id: 46, name: "Kanha National Park", state: "Madhya Pradesh", region: "Central India", emoji: "🐯", tags: ["tigers", "wildlife", "safari", "jungle book", "nature"] },
    { id: 47, name: "Bandhavgarh National Park", state: "Madhya Pradesh", region: "Central India", emoji: "🐯", tags: ["tigers", "wildlife", "safari", "highest density", "nature"] },
    { id: 48, name: "Sanchi", state: "Madhya Pradesh", region: "Central India", emoji: "🏛️", tags: ["stupa", "Buddhist", "UNESCO", "Ashoka", "ancient"] },
    { id: 49, name: "Bhopal", state: "Madhya Pradesh", region: "Central India", emoji: "🏙️", tags: ["lakes", "museums", "mosques", "city", "historical"] },
    { id: 50, name: "Mandu", state: "Madhya Pradesh", region: "Central India", emoji: "🏰", tags: ["fort city", "Afghan architecture", "romantic", "ruins", "historical"] },
    
    // EUROPE (30 destinations)
    { id: 51, name: "Paris", country: "France", region: "Europe", emoji: "🏙️", tags: ["city", "culture", "romantic", "food", "architecture"] },
    { id: 52, name: "Rome", country: "Italy", region: "Europe", emoji: "🏛️", tags: ["historical", "culture", "food", "architecture", "ancient"] },
    { id: 53, name: "Barcelona", country: "Spain", region: "Europe", emoji: "🏙️", tags: ["city", "beach", "architecture", "culture", "food"] },
    { id: 54, name: "Santorini", country: "Greece", region: "Europe", emoji: "🏝️", tags: ["island", "beach", "romantic", "views", "sea"] },
    { id: 55, name: "London", country: "United Kingdom", region: "Europe", emoji: "🏙️", tags: ["city", "culture", "historical", "museums", "shopping"] },
    { id: 56, name: "Venice", country: "Italy", region: "Europe", emoji: "🚤", tags: ["city", "romantic", "historical", "canals", "architecture"] },
    { id: 57, name: "Amsterdam", country: "Netherlands", region: "Europe", emoji: "🚲", tags: ["city", "canals", "culture", "museums", "cycling"] },
    { id: 58, name: "Prague", country: "Czech Republic", region: "Europe", emoji: "🏰", tags: ["city", "historical", "architecture", "culture", "beer"] },
    { id: 59, name: "Amalfi Coast", country: "Italy", region: "Europe", emoji: "🏖️", tags: ["coastal", "scenic", "driving", "food", "romantic"] },
    { id: 60, name: "Swiss Alps", country: "Switzerland", region: "Europe", emoji: "⛰️", tags: ["mountains", "skiing", "hiking", "views", "nature"] },
    { id: 61, name: "Vienna", country: "Austria", region: "Europe", emoji: "🎭", tags: ["city", "music", "culture", "architecture", "history"] },
    { id: 62, name: "Florence", country: "Italy", region: "Europe", emoji: "🏛️", tags: ["city", "art", "history", "culture", "food"] },
    { id: 63, name: "Dubrovnik", country: "Croatia", region: "Europe", emoji: "🏰", tags: ["coastal", "historical", "walled city", "sea", "architecture"] },
    { id: 64, name: "Edinburgh", country: "United Kingdom", region: "Europe", emoji: "🏰", tags: ["city", "historical", "culture", "festivals", "castle"] },
    { id: 65, name: "Reykjavik", country: "Iceland", region: "Europe", emoji: "♨️", tags: ["city", "nature", "hot springs", "northern lights", "unique"] },
    { id: 66, name: "Lisbon", country: "Portugal", region: "Europe", emoji: "🏙️", tags: ["city", "coastal", "culture", "food", "historical"] },
    { id: 67, name: "Budapest", country: "Hungary", region: "Europe", emoji: "♨️", tags: ["city", "baths", "historical", "architecture", "river"] },
    { id: 68, name: "Athens", country: "Greece", region: "Europe", emoji: "🏛️", tags: ["historical", "ancient", "culture", "food", "mythology"] },
    { id: 69, name: "Stockholm", country: "Sweden", region: "Europe", emoji: "🏙️", tags: ["city", "design", "islands", "culture", "clean"] },
    { id: 70, name: "Zermatt", country: "Switzerland", region: "Europe", emoji: "⛰️", tags: ["mountains", "skiing", "hiking", "scenic", "car-free"] },
    { id: 71, name: "Berlin", country: "Germany", region: "Europe", emoji: "🏙️", tags: ["city", "history", "culture", "art", "nightlife"] },
    { id: 72, name: "Istanbul", country: "Turkey", region: "Europe/Asia", emoji: "🕌", tags: ["city", "historical", "culture", "food", "markets"] },
    { id: 73, name: "Madrid", country: "Spain", region: "Europe", emoji: "🏙️", tags: ["city", "culture", "food", "art", "nightlife"] },
    { id: 74, name: "Dublin", country: "Ireland", region: "Europe", emoji: "🍺", tags: ["city", "pubs", "culture", "friendly", "historical"] },
    { id: 75, name: "Bruges", country: "Belgium", region: "Europe", emoji: "🚤", tags: ["medieval", "canals", "architecture", "chocolate", "romantic"] },
    { id: 76, name: "Mykonos", country: "Greece", region: "Europe", emoji: "🏝️", tags: ["island", "beach", "nightlife", "sea", "party"] },
    { id: 77, name: "Tuscany", country: "Italy", region: "Europe", emoji: "🍷", tags: ["countryside", "wine", "food", "scenic", "relaxation"] },
    { id: 78, name: "Copenhagen", country: "Denmark", region: "Europe", emoji: "🚲", tags: ["city", "design", "cycling", "food", "clean"] },
    { id: 79, name: "Cappadocia", country: "Turkey", region: "Europe/Asia", emoji: "🎈", tags: ["unique", "balloons", "geology", "history", "caves"] },
    { id: 80, name: "Porto", country: "Portugal", region: "Europe", emoji: "🍷", tags: ["city", "wine", "river", "historical", "architecture"] },
    
    // ASIA (25 destinations)
    { id: 81, name: "Tokyo", country: "Japan", region: "Asia", emoji: "🏙️", tags: ["city", "technology", "culture", "food", "shopping"] },
    { id: 82, name: "Kyoto", country: "Japan", region: "Asia", emoji: "⛩️", tags: ["temples", "culture", "history", "gardens", "traditional"] },
    { id: 83, name: "Bali", country: "Indonesia", region: "Asia", emoji: "🏝️", tags: ["island", "beach", "culture", "spiritual", "nature"] },
    { id: 84, name: "Bangkok", country: "Thailand", region: "Asia", emoji: "🏯", tags: ["city", "temples", "food", "markets", "nightlife"] },
    { id: 85, name: "Singapore", country: "Singapore", region: "Asia", emoji: "🏙️", tags: ["city", "modern", "clean", "food", "shopping"] },
    { id: 86, name: "Hong Kong", country: "China", region: "Asia", emoji: "🏙️", tags: ["city", "skyline", "food", "shopping", "harbor"] },
    { id: 87, name: "Seoul", country: "South Korea", region: "Asia", emoji: "🏙️", tags: ["city", "technology", "culture", "food", "shopping"] },
    { id: 88, name: "Dubai", country: "UAE", region: "Asia", emoji: "🏙️", tags: ["city", "luxury", "desert", "shopping", "architecture"] },
    { id: 89, name: "Maldives", country: "Maldives", region: "Asia", emoji: "🏝️", tags: ["islands", "beach", "luxury", "snorkeling", "overwater bungalows"] },
    { id: 90, name: "Angkor Wat", country: "Cambodia", region: "Asia", emoji: "🏯", tags: ["temples", "ancient", "historical", "architecture", "religious"] },
    { id: 91, name: "Phuket", country: "Thailand", region: "Asia", emoji: "🏝️", tags: ["island", "beach", "nightlife", "resorts", "water sports"] },
    { id: 92, name: "Shanghai", country: "China", region: "Asia", emoji: "🏙️", tags: ["city", "modern", "food", "shopping", "architecture"] },
    { id: 93, name: "Hanoi", country: "Vietnam", region: "Asia", emoji: "🏙️", tags: ["city", "culture", "history", "food", "affordable"] },
    { id: 94, name: "Chiang Mai", country: "Thailand", region: "Asia", emoji: "🏯", tags: ["city", "culture", "temples", "food", "nature"] },
    { id: 95, name: "Kuala Lumpur", country: "Malaysia", region: "Asia", emoji: "🏙️", tags: ["city", "modern", "towers", "food", "shopping"] },
    { id: 96, name: "Ha Long Bay", country: "Vietnam", region: "Asia", emoji: "⛰️", tags: ["bay", "islands", "limestone", "cruise", "scenic"] },
    { id: 97, name: "Jerusalem", country: "Israel", region: "Asia", emoji: "🕍", tags: ["city", "religious", "historical", "cultural", "ancient"] },
    { id: 98, name: "Kathmandu", country: "Nepal", region: "Asia", emoji: "🏔️", tags: ["city", "mountains", "culture", "temples", "hiking"] },
    { id: 99, name: "Petra", country: "Jordan", region: "Asia", emoji: "🏛️", tags: ["ancient", "historical", "architecture", "desert", "wonder"] },
    { id: 100, name: "Boracay", country: "Philippines", region: "Asia", emoji: "🏝️", tags: ["island", "beach", "nightlife", "water sports", "white sand"] },
    { id: 101, name: "Taipei", country: "Taiwan", region: "Asia", emoji: "🏙️", tags: ["city", "food", "night markets", "technology", "culture"] },
    { id: 102, name: "Osaka", country: "Japan", region: "Asia", emoji: "🏙️", tags: ["city", "food", "nightlife", "shopping", "castle"] },
    { id: 103, name: "Siem Reap", country: "Cambodia", region: "Asia", emoji: "🏯", tags: ["city", "temples", "culture", "history", "affordable"] },
    
    // NORTH AMERICA (15 destinations)
    { id: 104, name: "New York City", country: "USA", region: "North America", emoji: "🏙️", tags: ["city", "culture", "shopping", "museums", "skyscrapers"] },
    { id: 105, name: "Cancun", country: "Mexico", region: "North America", emoji: "🏝️", tags: ["beach", "resorts", "nightlife", "ancient ruins", "water sports"] },
    { id: 106, name: "Vancouver", country: "Canada", region: "North America", emoji: "🏙️", tags: ["city", "nature", "mountains", "water", "clean"] },
    { id: 107, name: "San Francisco", country: "USA", region: "North America", emoji: "🌉", tags: ["city", "bridge", "technology", "food", "hills"] },
    { id: 108, name: "Las Vegas", country: "USA", region: "North America", emoji: "🎰", tags: ["city", "entertainment", "nightlife", "casinos", "shows"] },
    { id: 109, name: "Banff", country: "Canada", region: "North America", emoji: "🏔️", tags: ["mountains", "lakes", "wildlife", "hiking", "skiing"] },
    { id: 110, name: "New Orleans", country: "USA", region: "North America", emoji: "🎺", tags: ["city", "music", "food", "culture", "festivals"] },
    { id: 111, name: "Mexico City", country: "Mexico", region: "North America", emoji: "🏙️", tags: ["city", "culture", "history", "food", "art"] },
    { id: 112, name: "Hawaii", country: "USA", region: "North America", emoji: "🏝️", tags: ["islands", "beach", "volcanoes", "surfing", "tropical"] },
    { id: 113, name: "Chicago", country: "USA", region: "North America", emoji: "🏙️", tags: ["city", "architecture", "food", "music", "lake"] },
    { id: 114, name: "Miami", country: "USA", region: "North America", emoji: "🏖️", tags: ["beach", "nightlife", "art deco", "culture", "food"] },
    { id: 115, name: "Quebec City", country: "Canada", region: "North America", emoji: "🏰", tags: ["historical", "culture", "French", "architecture", "winter"] },
    { id: 116, name: "Grand Canyon", country: "USA", region: "North America", emoji: "🏞️", tags: ["natural wonder", "hiking", "views", "geology", "national park"] },
    { id: 117, name: "Tulum", country: "Mexico", region: "North America", emoji: "🏝️", tags: ["beach", "ruins", "eco-tourism", "cenotes", "yoga"] },
    { id: 118, name: "Washington DC", country: "USA", region: "North America", emoji: "🏛️", tags: ["city", "capital", "monuments", "museums", "politics"] },
    
    // SOUTH AMERICA (10 destinations)
    { id: 119, name: "Rio de Janeiro", country: "Brazil", region: "South America", emoji: "🏖️", tags: ["city", "beach", "mountains", "culture", "carnival"] },
    { id: 120, name: "Machu Picchu", country: "Peru", region: "South America", emoji: "🏔️", tags: ["ancient", "ruins", "mountains", "hiking", "historical"] },
    { id: 121, name: "Buenos Aires", country: "Argentina", region: "South America", emoji: "🏙️", tags: ["city", "culture", "tango", "food", "architecture"] },
    { id: 122, name: "Galapagos Islands", country: "Ecuador", region: "South America", emoji: "🐢", tags: ["islands", "wildlife", "nature", "diving", "unique"] },
    { id: 123, name: "Cusco", country: "Peru", region: "South America", emoji: "🏔️", tags: ["city", "historical", "culture", "mountains", "Inca"] },
    { id: 124, name: "Cartagena", country: "Colombia", region: "South America", emoji: "🏙️", tags: ["city", "colonial", "beach", "historical", "colorful"] },
    { id: 125, name: "Iguazu Falls", country: "Argentina/Brazil", region: "South America", emoji: "🏞️", tags: ["waterfalls", "nature", "national park", "wildlife", "wonder"] },
    { id: 126, name: "Patagonia", country: "Argentina/Chile", region: "South America", emoji: "🏔️", tags: ["wilderness", "mountains", "hiking", "glaciers", "nature"] },
    { id: 127, name: "Amazon Rainforest", country: "Brazil", region: "South America", emoji: "🌳", tags: ["jungle", "wildlife", "river", "nature", "indigenous"] },
    { id: 128, name: "Easter Island", country: "Chile", region: "South America", emoji: "🗿", tags: ["island", "statues", "archaeological", "mysterious", "remote"] },
    
    // AFRICA (10 destinations)
    { id: 129, name: "Cape Town", country: "South Africa", region: "Africa", emoji: "🏔️", tags: ["city", "mountains", "coast", "wine", "scenic"] },
    { id: 130, name: "Marrakech", country: "Morocco", region: "Africa", emoji: "🏙️", tags: ["city", "markets", "culture", "food", "architecture"] },
    { id: 131, name: "Serengeti", country: "Tanzania", region: "Africa", emoji: "🦁", tags: ["safari", "wildlife", "nature", "plains", "migration"] },
    { id: 132, name: "Cairo", country: "Egypt", region: "Africa", emoji: "🏛️", tags: ["city", "pyramids", "history", "ancient", "museums"] },
    { id: 133, name: "Victoria Falls", country: "Zimbabwe/Zambia", region: "Africa", emoji: "🏞️", tags: ["waterfall", "nature", "adventure", "wonder", "scenic"] },
    { id: 134, name: "Zanzibar", country: "Tanzania", region: "Africa", emoji: "🏝️", tags: ["island", "beach", "culture", "history", "spices"] },
    { id: 135, name: "Sahara Desert", country: "Morocco", region: "Africa", emoji: "🏜️", tags: ["desert", "dunes", "adventure", "stargazing", "camping"] },
    { id: 136, name: "Kruger National Park", country: "South Africa", region: "Africa", emoji: "🦏", tags: ["wildlife", "safari", "nature", "big five", "conservation"] },
    { id: 137, name: "Luxor", country: "Egypt", region: "Africa", emoji: "🏛️", tags: ["ancient", "temples", "history", "ruins", "Nile"] },
    { id: 138, name: "Seychelles", country: "Seychelles", region: "Africa", emoji: "🏝️", tags: ["islands", "beach", "luxury", "nature", "relaxation"] },
    
    // OCEANIA (10 destinations)
    { id: 139, name: "Sydney", country: "Australia", region: "Oceania", emoji: "🏙️", tags: ["city", "harbor", "opera house", "beach", "culture"] },
    { id: 140, name: "Great Barrier Reef", country: "Australia", region: "Oceania", emoji: "🐠", tags: ["reef", "diving", "marine life", "natural wonder", "snorkeling"] },
    { id: 141, name: "Auckland", country: "New Zealand", region: "Oceania", emoji: "🏙️", tags: ["city", "harbors", "culture", "scenic", "sailing"] },
    { id: 142, name: "Queenstown", country: "New Zealand", region: "Oceania", emoji: "⛰️", tags: ["mountains", "adventure", "skiing", "scenic", "bungee"] },
    { id: 143, name: "Fiji", country: "Fiji", region: "Oceania", emoji: "🏝️", tags: ["islands", "beach", "culture", "relaxation", "diving"] },
    { id: 144, name: "Bora Bora", country: "French Polynesia", region: "Oceania", emoji: "🏝️", tags: ["island", "luxury", "beach", "overwater bungalows", "romantic"] },
    { id: 145, name: "Uluru", country: "Australia", region: "Oceania", emoji: "🏜️", tags: ["natural wonder", "indigenous", "desert", "spiritual", "iconic"] },
    { id: 146, name: "Rotorua", country: "New Zealand", region: "Oceania", emoji: "♨️", tags: ["geothermal", "culture", "adventure", "nature", "Maori"] },
    { id: 147, name: "Melbourne", country: "Australia", region: "Oceania", emoji: "🏙️", tags: ["city", "culture", "food", "art", "sports"] },
    { id: 148, name: "Tasmania", country: "Australia", region: "Oceania", emoji: "🌳", tags: ["island", "wilderness", "wildlife", "hiking", "food"] }
];

// Emoji categories
const emojiCategories = [
    { emoji: "🏙️", label: "Cities" },
    { emoji: "🏝️", label: "Beaches & Islands" },
    { emoji: "⛰️", label: "Mountains" },
    { emoji: "🏛️", label: "Historical" },
    { emoji: "⛩️", label: "Temples" },
    { emoji: "🦁", label: "Wildlife" },
    { emoji: "🌲", label: "Nature" },
    { emoji: "🚤", label: "Water" },
    { emoji: "🏯", label: "Cultural" },
    { emoji: "🎭", label: "Arts & Culture" },
    { emoji: "🏰", label: "Castles & Palaces" },
    { emoji: "♨️", label: "Hot Springs" },
    { emoji: "🕌", label: "Religious Sites" },
    { emoji: "🍷", label: "Wine & Food" },
    { emoji: "🎈", label: "Unique Experiences" },
    { emoji: "🏜️", label: "Deserts" },
    { emoji: "🏞️", label: "Natural Wonders" },
    { emoji: "🐠", label: "Marine Life" },
    { emoji: "🗿", label: "Archaeological" },
    { emoji: "🎰", label: "Entertainment" }
];

// All available regions
const allRegions = ["Europe", "Asia", "North America", "South America", "Africa", "Oceania"];

// State management
const state = {
    selectedRegions: [],
    selectedEmojis: [],
    searchTerm: '',
    currentView: 'grid',
    theme: 'light'
};

// DOM Elements
const elements = {
    searchInput: document.getElementById('searchInput'),
    clearSearch: document.getElementById('clearSearch'),
    clearFilters: document.getElementById('clearFilters'),
    clearFiltersEmpty: document.getElementById('clearFiltersEmpty'),
    regionFilters: document.getElementById('regionFilters'),
    categoryFilters: document.getElementById('categoryFilters'),
    destinationsGrid: document.getElementById('destinationsGrid'),
    resultsCount: document.getElementById('resultsCount'),
    emptyState: document.getElementById('emptyState'),
    loadingState: document.getElementById('loadingState'),
    themeToggle: document.getElementById('themeToggle'),
    viewButtons: document.querySelectorAll('.view-btn'),
    saveFilters: document.getElementById('saveFilters'),
    suggestDestinations: document.getElementById('suggestDestinations'),
    searchTags: document.getElementById('searchTags'),
    totalDestinations: document.getElementById('totalDestinations'),
    totalRegions: document.getElementById('totalRegions'),
    totalCategories: document.getElementById('totalCategories')
};

// Initialize the application
function init() {
    // Set initial stats
    elements.totalDestinations.textContent = destinationsData.length;
    elements.totalRegions.textContent = allRegions.length;
    elements.totalCategories.textContent = emojiCategories.length;

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        state.theme = savedTheme;
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon();
    }

    // Load saved filters
    const savedFilters = localStorage.getItem('savedFilters');
    if (savedFilters) {
        const { regions, emojis } = JSON.parse(savedFilters);
        state.selectedRegions = regions;
        state.selectedEmojis = emojis;
    }

    // Event Listeners
    elements.searchInput.addEventListener('input', handleSearch);
    elements.clearSearch.addEventListener('click', clearSearch);
    elements.clearFilters.addEventListener('click', clearAllFilters);
    elements.clearFiltersEmpty.addEventListener('click', clearAllFilters);
    elements.themeToggle.addEventListener('click', toggleTheme);
    elements.saveFilters.addEventListener('click', saveCurrentFilters);
    elements.suggestDestinations.addEventListener('click', suggestDestinations);

    // View buttons
    elements.viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.viewButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.currentView = btn.dataset.view;
            renderDestinations();
        });
    });

    // Filter group expansion
    document.querySelectorAll('.expand-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filterGroup = e.target.closest('.filter-group');
            const filterButtons = filterGroup.querySelector('.filter-buttons');
            const isExpanded = filterButtons.style.display !== 'none';
            
            filterButtons.style.display = isExpanded ? 'none' : 'flex';
            btn.querySelector('i').classList.toggle('fa-chevron-down');
            btn.querySelector('i').classList.toggle('fa-chevron-up');
        });
    });

    // Initial render
    renderFilters();
    renderDestinations();
}

// Debounce function to limit search frequency
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle search input with debouncing
const handleSearch = debounce((e) => {
    state.searchTerm = e.target.value.toLowerCase().trim();
    elements.clearSearch.classList.toggle('visible', state.searchTerm.length > 0);
    renderDestinations();
    updateSearchTags();
}, 300);

// Update search tags with improved styling
function updateSearchTags() {
    elements.searchTags.innerHTML = '';
    if (state.searchTerm) {
        const tag = document.createElement('span');
        tag.className = 'search-tag';
        tag.innerHTML = `
            <i class="fas fa-search"></i>
            ${state.searchTerm}
            <button class="remove-tag" aria-label="Remove search term">
                <i class="fas fa-times"></i>
            </button>
        `;
        tag.querySelector('.remove-tag').addEventListener('click', clearSearch);
        elements.searchTags.appendChild(tag);
    }
}

// Clear search with improved UX
function clearSearch() {
    state.searchTerm = '';
    elements.searchInput.value = '';
    elements.clearSearch.classList.remove('visible');
    elements.searchTags.innerHTML = '';
    elements.searchInput.focus();
    renderDestinations();
}

// Clear all filters
function clearAllFilters() {
    state.selectedRegions = [];
    state.selectedEmojis = [];
    state.searchTerm = '';
    elements.searchInput.value = '';
    elements.clearSearch.classList.remove('visible');
    elements.searchTags.innerHTML = '';
    renderFilters();
    renderDestinations();
    showToast('All filters cleared', 'info');
}

// Toggle theme
function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem('theme', state.theme);
    updateThemeIcon();
    showToast(`${state.theme} mode enabled`, 'info');
}

// Update theme icon
function updateThemeIcon() {
    const icon = elements.themeToggle.querySelector('i');
    icon.className = state.theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Save current filters
function saveCurrentFilters() {
    const filters = {
        regions: state.selectedRegions,
        emojis: state.selectedEmojis
    };
    localStorage.setItem('savedFilters', JSON.stringify(filters));
    showToast('Filters saved successfully', 'success');
}

// Suggest destinations
function suggestDestinations() {
    const filteredDestinations = filterDestinations();
    if (filteredDestinations.length === 0) {
        // If no results, suggest popular destinations
        const popularDestinations = destinationsData
            .sort((a, b) => b.tags.length - a.tags.length)
            .slice(0, 3);
        
        showToast('Here are some popular destinations you might like:', 'info');
        popularDestinations.forEach(dest => {
            showToast(`${dest.name}, ${dest.country}`, 'info');
        });
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    const container = document.getElementById('toastContainer');
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Render filters
function renderFilters() {
    // Render region filters
    elements.regionFilters.innerHTML = allRegions.map(region => `
        <button class="filter-btn ${state.selectedRegions.includes(region) ? 'active' : ''}"
                data-region="${region}"
                onclick="toggleRegion('${region}')">
            <i class="fas fa-globe"></i>
            ${region}
        </button>
    `).join('');

    // Render category filters
    elements.categoryFilters.innerHTML = emojiCategories.map(category => `
        <button class="filter-btn ${state.selectedEmojis.includes(category.emoji) ? 'active' : ''}"
                data-emoji="${category.emoji}"
                onclick="toggleEmoji('${category.emoji}')">
            ${category.emoji}
            ${category.label}
        </button>
    `).join('');
}

// Toggle region selection
function toggleRegion(region) {
    const index = state.selectedRegions.indexOf(region);
    if (index === -1) {
        state.selectedRegions.push(region);
    } else {
        state.selectedRegions.splice(index, 1);
    }
    renderFilters();
    renderDestinations();
}

// Toggle emoji selection
function toggleEmoji(emoji) {
    const index = state.selectedEmojis.indexOf(emoji);
    if (index === -1) {
        state.selectedEmojis.push(emoji);
    } else {
        state.selectedEmojis.splice(index, 1);
    }
    renderFilters();
    renderDestinations();
}

// Filter destinations with improved search matching
function filterDestinations() {
    return destinationsData.filter(destination => {
        const searchTerms = state.searchTerm.split(' ').filter(term => term.length > 0);
        
        const matchesSearch = state.searchTerm === '' || searchTerms.every(term => 
            destination.name.toLowerCase().includes(term) ||
            (destination.country && destination.country.toLowerCase().includes(term)) ||
            (destination.state && destination.state.toLowerCase().includes(term)) ||
            destination.tags.some(tag => tag.toLowerCase().includes(term))
        );

        const matchesRegion = state.selectedRegions.length === 0 ||
            state.selectedRegions.includes(destination.region);

        const matchesEmoji = state.selectedEmojis.length === 0 ||
            state.selectedEmojis.includes(destination.emoji);

        return matchesSearch && matchesRegion && matchesEmoji;
    });
}

// Render destinations with search term highlighting
function renderDestinations() {
    const filteredDestinations = filterDestinations();
    elements.resultsCount.textContent = `Found ${filteredDestinations.length} destinations`;

    // Show loading state
    elements.loadingState.classList.remove('hidden');
    elements.destinationsGrid.style.opacity = '0';

    // Simulate loading delay
    setTimeout(() => {
        elements.loadingState.classList.add('hidden');
        elements.destinationsGrid.style.opacity = '1';

        if (filteredDestinations.length === 0) {
            elements.emptyState.classList.remove('hidden');
            elements.destinationsGrid.innerHTML = '';
        } else {
            elements.emptyState.classList.add('hidden');
            elements.destinationsGrid.innerHTML = filteredDestinations.map(destination => {
                const highlightText = (text) => {
                    if (!state.searchTerm) return text;
                    const regex = new RegExp(`(${state.searchTerm})`, 'gi');
                    return text.replace(regex, '<mark>$1</mark>');
                };

                return `
                    <div class="destination-card" data-view="${state.currentView}">
                        <div class="card-content">
                            <div class="card-header">
                                <h3>${highlightText(destination.name)}</h3>
                                <span class="emoji">${destination.emoji}</span>
                            </div>
                            <div class="country">
                                ${destination.state ? `${highlightText(destination.state)}, ` : ''}${highlightText(destination.country || destination.region)}
                            </div>
                            <div class="region-tag">${destination.region}</div>
                            <div class="tags">
                                ${destination.tags.map(tag => 
                                    `<span class="tag">${highlightText(tag)}</span>`
                                ).join('')}
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }, 300);
}

// Initialize the application
init(); 