const DEFAULT_PUZZLES = [
  {
    "id": "easy_animals",
    "title": "Animal Kingdom",
    "difficulty": "easy",
    "category": "Animals",
    "gridSize": 8,
    "clues": {
      "across": [
        { "number": 1, "row": 0, "col": 1, "answer": "LION", "clue": "King of the jungle" },
        { "number": 4, "row": 2, "col": 0, "answer": "BEAR", "clue": "Large furry mammal that loves honey" },
        { "number": 6, "row": 4, "col": 2, "answer": "DEER", "clue": "Forest animal with antlers" },
        { "number": 7, "row": 6, "col": 3, "answer": "FROG", "clue": "Green amphibian that leaps" }
      ],
      "down": [
        { "number": 1, "row": 0, "col": 1, "answer": "LAMB", "clue": "A baby sheep" },
        { "number": 2, "row": 0, "col": 3, "answer": "NEST", "clue": "A bird's home" },
        { "number": 3, "row": 2, "col": 0, "answer": "BIRD", "clue": "Feathered creature that flies" },
        { "number": 5, "row": 2, "col": 5, "answer": "WOLF", "clue": "Wild canine that packs and howls" }
      ]
    }
  },
  {
    "id": "easy_food",
    "title": "Tasty Treats",
    "difficulty": "easy",
    "category": "Food",
    "gridSize": 8,
    "clues": {
      "across": [
        { "number": 1, "row": 0, "col": 2, "answer": "CAKE", "clue": "Sweet baked dessert eaten on birthdays" },
        { "number": 4, "row": 2, "col": 0, "answer": "APPLE", "clue": "Crisp round fruit, red or green" },
        { "number": 5, "row": 4, "col": 3, "answer": "RICE", "clue": "Common white or brown grain" },
        { "number": 6, "row": 6, "col": 0, "answer": "SOUP", "clue": "Hot liquid food served in a bowl" }
      ],
      "down": [
        { "number": 1, "row": 0, "col": 2, "answer": "CHIP", "clue": "Thin crispy snack (potato or tortilla)" },
        { "number": 2, "row": 0, "col": 5, "answer": "PEAR", "clue": "Sweet tear-drop shaped fruit" },
        { "number": 3, "row": 2, "col": 0, "answer": "TACO", "clue": "Mexican shell filled with meat and cheese" },
        { "number": 4, "row": 2, "col": 3, "answer": "PLUM", "clue": "Small sweet fruit with a dark purple skin" }
      ]
    }
  },
  {
    "id": "easy_sports",
    "title": "Get Active!",
    "difficulty": "easy",
    "category": "Sports",
    "gridSize": 8,
    "clues": {
      "across": [
        { "number": 1, "row": 1, "col": 0, "answer": "GOLF", "clue": "Game played on green grass with a tiny white ball" },
        { "number": 4, "row": 3, "col": 1, "answer": "TENNIS", "clue": "Racket sport played with a yellow fuzzy ball" },
        { "number": 6, "row": 5, "col": 2, "answer": "RUN", "clue": "Move faster than a walk" },
        { "number": 7, "row": 7, "col": 0, "answer": "SWIM", "clue": "Move through water using limbs" }
      ],
      "down": [
        { "number": 2, "row": 1, "col": 2, "answer": "LINE", "clue": "Boundary on a sports court" },
        { "number": 3, "row": 1, "col": 5, "answer": "FINS", "clue": "Flipped gear worn on feet for diving/swimming" },
        { "number": 4, "row": 3, "col": 1, "answer": "TEAM", "clue": "Group of players working together" },
        { "number": 5, "row": 3, "col": 4, "answer": "NETS", "clue": "Mesh grids used in basketball or soccer goals" }
      ]
    }
  },
  {
    "id": "medium_space",
    "title": "Space Exploration",
    "difficulty": "medium",
    "category": "Space",
    "gridSize": 10,
    "clues": {
      "across": [
        { "number": 1, "row": 1, "col": 2, "answer": "ORBIT", "clue": "Curved path of a celestial body around a star or planet" },
        { "number": 4, "row": 3, "col": 0, "answer": "MARS", "clue": "The Red Planet" },
        { "number": 5, "row": 5, "col": 3, "answer": "COMET", "clue": "Icy body that releases gas and dust as it orbits the sun" },
        { "number": 7, "row": 7, "col": 1, "answer": "MOON", "clue": "Earth's only natural satellite" }
      ],
      "down": [
        { "number": 1, "row": 0, "col": 3, "answer": "PLANET", "clue": "Large celestial body orbiting a star (e.g., Earth)" },
        { "number": 2, "row": 1, "col": 6, "answer": "STARS", "clue": "Luminous spheres of plasma held together by gravity" },
        { "number": 3, "row": 3, "col": 0, "answer": "METEOR", "clue": "A streak of light in the sky produced by a burning space rock" },
        { "number": 6, "row": 5, "col": 4, "answer": "ROVER", "clue": "Robotic space probe designed to explore planetary surfaces" }
      ]
    }
  },
  {
    "id": "medium_countries",
    "title": "World Tour",
    "difficulty": "medium",
    "category": "Geography",
    "gridSize": 10,
    "clues": {
      "across": [
        { "number": 1, "row": 1, "col": 1, "answer": "FRANCE", "clue": "European country famous for the Eiffel Tower and wine" },
        { "number": 4, "row": 3, "col": 0, "answer": "EGYPT", "clue": "African nation home to the ancient pyramids" },
        { "number": 6, "row": 5, "col": 3, "answer": "CANADA", "clue": "North American country with the maple leaf flag" },
        { "number": 7, "row": 7, "col": 2, "answer": "BRAZIL", "clue": "South American giant renowned for Carnival and soccer" }
      ],
      "down": [
        { "number": 1, "row": 1, "col": 1, "answer": "FIJI", "clue": "Pacific island nation famous for rugged landscapes and palm-lined beaches" },
        { "number": 2, "row": 1, "col": 4, "answer": "NEPAL", "clue": "Asian nation containing Mount Everest" },
        { "number": 3, "row": 3, "col": 0, "answer": "EUROPE", "clue": "Continent containing France, Germany, and Italy" },
        { "number": 5, "row": 4, "col": 7, "answer": "ITALY", "clue": "Boot-shaped European nation famous for pizza and pasta" }
      ]
    }
  },
  {
    "id": "medium_movies",
    "title": "Hollywood & Beyond",
    "difficulty": "medium",
    "category": "Movies",
    "gridSize": 10,
    "clues": {
      "across": [
        { "number": 1, "row": 1, "col": 1, "answer": "OSCAR", "clue": "Prestigious golden statuette awarded for film excellence" },
        { "number": 4, "row": 3, "col": 0, "answer": "AVATAR", "clue": "James Cameron sci-fi epic set on the moon Pandora" },
        { "number": 6, "row": 5, "col": 3, "answer": "SCENE", "clue": "A single continuous sequence in a motion picture" },
        { "number": 7, "row": 7, "col": 2, "answer": "BATMAN", "clue": "DC Comics superhero who protects Gotham City" }
      ],
      "down": [
        { "number": 1, "row": 1, "col": 1, "answer": "ACTOR", "clue": "A person who portrays a character in a performance" },
        { "number": 2, "row": 1, "col": 4, "answer": "RADIO", "clue": "Audio broadcast medium; or '___ Star' (1979 song)" },
        { "number": 3, "row": 3, "col": 0, "answer": "ACTION", "clue": "Film genre characterized by stunts, chases, and explosions" },
        { "number": 5, "row": 4, "col": 7, "answer": "MOVIE", "clue": "A motion picture; another word for film" }
      ]
    }
  },
  {
    "id": "hard_science",
    "title": "Cosmic and Quantum Science",
    "difficulty": "hard",
    "category": "Science",
    "gridSize": 12,
    "clues": {
      "across": [
        { "number": 1, "row": 1, "col": 1, "answer": "ELECTRON", "clue": "Subatomic particle with a negative charge" },
        { "number": 5, "row": 3, "col": 0, "answer": "GRAVITY", "clue": "Force that attracts a body toward the center of the earth" },
        { "number": 7, "row": 5, "col": 4, "answer": "MUTATION", "clue": "A change in the DNA sequence of an organism" },
        { "number": 8, "row": 7, "col": 2, "answer": "NEBULA", "clue": "Giant cloud of dust and gas in space" },
        { "number": 9, "row": 9, "col": 0, "answer": "PHOTOSYNTHESIS", "clue": "Process by which green plants make food using sunlight" }
      ],
      "down": [
        { "number": 2, "row": 1, "col": 1, "answer": "ENTROPY", "clue": "Measure of molecular disorder or randomness in a system" },
        { "number": 3, "row": 1, "col": 4, "answer": "CATALYST", "clue": "Substance that speeds up a chemical reaction without being consumed" },
        { "number": 4, "row": 1, "col": 8, "answer": "NUCLEUS", "clue": "The positively charged central core of an atom" },
        { "number": 6, "row": 3, "col": 11, "answer": "GENOME", "clue": "The complete set of genetic material in an organism" }
      ]
    }
  },
  {
    "id": "hard_history",
    "title": "Ancient Civilizations",
    "difficulty": "hard",
    "category": "History",
    "gridSize": 12,
    "clues": {
      "across": [
        { "number": 1, "row": 1, "col": 2, "answer": "PHARAOH", "clue": "Ruler of ancient Egypt" },
        { "number": 4, "row": 3, "col": 0, "answer": "GLADIATOR", "clue": "Armed combatant who entertained audiences in Roman arenas" },
        { "number": 6, "row": 5, "col": 3, "answer": "CUNEIFORM", "clue": "One of the earliest systems of writing, invented by Sumerians" },
        { "number": 8, "row": 7, "col": 1, "answer": "PARTHENON", "clue": "Former temple on the Athenian Acropolis dedicated to Athena" },
        { "number": 9, "row": 9, "col": 4, "answer": "DYNASTY", "clue": "A succession of rulers from the same family line" }
      ],
      "down": [
        { "number": 2, "row": 1, "col": 3, "answer": "AQUEDUCT", "clue": "Artificial channel for conveying water, built by Romans" },
        { "number": 3, "row": 1, "col": 6, "answer": "HERODOTUS", "clue": "Greek historian known as 'The Father of History'" },
        { "number": 5, "row": 3, "col": 1, "answer": "EMPIRE", "clue": "Extensive group of states or countries under a single supreme authority" },
        { "number": 7, "row": 5, "col": 8, "answer": "OLYMPUS", "clue": "The highest mountain in Greece, mythical home of the gods" }
      ]
    }
  },
  {
    "id": "hard_geography",
    "title": "Extreme Earth Wonders",
    "difficulty": "hard",
    "category": "Geography",
    "gridSize": 12,
    "clues": {
      "across": [
        { "number": 1, "row": 1, "col": 1, "answer": "HIMALAYAS", "clue": "Highest mountain range in the world, stretching across Asia" },
        { "number": 4, "row": 3, "col": 0, "answer": "AMAZON", "clue": "Largest river by discharge volume, flowing through South America" },
        { "number": 6, "row": 5, "col": 3, "answer": "SAHARA", "clue": "Largest hot desert in the world, covering North Africa" },
        { "number": 7, "row": 7, "col": 2, "answer": "MARIANA", "clue": "Deepest oceanic trench on Earth, located in the Pacific" },
        { "number": 8, "row": 9, "col": 0, "answer": "GREENLAND", "clue": "The world's largest island, located between the Arctic and Atlantic" }
      ],
      "down": [
        { "number": 2, "row": 1, "col": 3, "answer": "MAUNAKEA", "clue": "Inactive Hawaiian volcano that is the world's tallest mountain from base to peak" },
        { "number": 3, "row": 1, "col": 7, "answer": "ATACAMA", "clue": "Hyper-arid plateau desert in South America, the driest non-polar place on Earth" },
        { "number": 5, "row": 3, "col": 1, "answer": "MISSISSIPPI", "clue": "Major North American river flowing entirely in the United States" }
      ]
    }
  },
  {
    "id": "prog_webdev",
    "title": "Web Development Basics",
    "difficulty": "easy",
    "category": "Programming",
    "gridSize": 10,
    "clues": {
      "across": [
        { "number": 1, "row": 0, "col": 2, "answer": "HTML", "clue": "HyperText Markup Language used for web page structure" },
        { "number": 4, "row": 2, "col": 0, "answer": "STYLES", "clue": "CSS rules applied to change the look of elements" },
        { "number": 5, "row": 4, "col": 3, "answer": "SCRIPT", "clue": "HTML tag used to embed executable client-side code" },
        { "number": 7, "row": 6, "col": 1, "answer": "DOM", "clue": "Document Object Model, representing the structured page hierarchy" },
        { "number": 8, "row": 8, "col": 2, "answer": "CSS", "clue": "Cascading Style Sheets, used to style documents" }
      ],
      "down": [
        { "number": 1, "row": 0, "col": 2, "answer": "HEADER", "clue": "Semantic HTML element representing introductory content" },
        { "number": 2, "row": 0, "col": 5, "answer": "LINK", "clue": "HTML element connecting stylesheets or external resources" },
        { "number": 3, "row": 2, "col": 0, "answer": "SERVER", "clue": "Computer program that provides data to client requests" },
        { "number": 6, "row": 4, "col": 7, "answer": "TAGS", "clue": "HTML elements enclosed in angle brackets (e.g. <div>)" }
      ]
    }
  },
  {
    "id": "prog_javascript",
    "title": "JavaScript Wizardry",
    "difficulty": "medium",
    "category": "Programming",
    "gridSize": 11,
    "clues": {
      "across": [
        { "number": 1, "row": 1, "col": 1, "answer": "PROMISE", "clue": "Object representing eventual completion or failure of an async operation" },
        { "number": 4, "row": 3, "col": 0, "answer": "CLOSURE", "clue": "A function bundled together with references to its surrounding state" },
        { "number": 5, "row": 5, "col": 3, "answer": "CALLBACK", "clue": "A function passed into another function as an argument" },
        { "number": 7, "row": 7, "col": 2, "answer": "ARRAY", "clue": "Ordered list of values represented by square brackets" },
        { "number": 8, "row": 9, "col": 1, "answer": "VANILLA", "clue": "Plain, library-free JavaScript code" }
      ],
      "down": [
        { "number": 1, "row": 1, "col": 1, "answer": "PROTOTYPE", "clue": "Mechanism by which JavaScript objects inherit features from one another" },
        { "number": 2, "row": 1, "col": 4, "answer": "SCOPE", "clue": "Context in which values and expressions are visible or referenced" },
        { "number": 3, "row": 3, "col": 0, "answer": "CONST", "clue": "Keyword to declare block-scoped variables that cannot be reassigned" },
        { "number": 6, "row": 5, "col": 7, "answer": "AWAIT", "clue": "Operator used to wait for a Promise" }
      ]
    }
  },
  {
    "id": "prog_architecture",
    "title": "Software Architecture",
    "difficulty": "hard",
    "category": "Programming",
    "gridSize": 12,
    "clues": {
      "across": [
        { "number": 1, "row": 1, "col": 2, "answer": "MICROSERVICES", "clue": "Architectural style structuring an app as highly decoupled services" },
        { "number": 4, "row": 3, "col": 0, "answer": "DATABASE", "clue": "Systematic collection of data that is electronically stored" },
        { "number": 6, "row": 5, "col": 4, "answer": "MIDDLEWARE", "clue": "Software that acts as a bridge between OS/database and applications" },
        { "number": 8, "row": 7, "col": 1, "answer": "CONTAINER", "clue": "Standard unit of software packaging code and all its dependencies (e.g. Docker)" },
        { "number": 9, "row": 9, "col": 3, "answer": "GATEWAY", "clue": "API endpoint acting as a single entry point for microservices" }
      ],
      "down": [
        { "number": 2, "row": 1, "col": 3, "answer": "REPOSITORY", "clue": "Central location where data is stored and managed, e.g. Git or DB abstraction" },
        { "number": 3, "row": 1, "col": 7, "answer": "CONTROLLER", "clue": "MVC component that accepts input and converts it to commands" },
        { "number": 5, "row": 3, "col": 1, "answer": "CACHING", "clue": "Storing copies of data in temporary storage for faster access" },
        { "number": 7, "row": 5, "col": 9, "answer": "ROUTER", "clue": "Mechanism directing client requests to specific handler functions" }
      ]
    }
  }
];
