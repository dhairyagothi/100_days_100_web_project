const wordlist = [
    {
        word: "oxygen",
        hint: "A colorless, odorless gas essential for life"
    },
    {
        word: "galaxy",
        hint: "A vast system of stars, gas and dust held together by gravity"
    },
    {
        word: "guitar",
        hint: "A musical instrument with strings"
    },
    {
        word: "Glutton",
        hint: "One who eats and drinks excessively"
    },
    {
        word: "biography",
        hint: "A life story written by another person"
    },
    {
        word: "mountain",
        hint: "A larga natural elevation of the earth's surface"
    },
    {
        word: "chocolate",
        hint: "A sweet treat made from cocoa beans"
    },
    {
        word: "novice",
        hint: "A person new to a profession or skill"
    },
    {
        word: "painting",
        hint: "An art form using colors on a surface to create images or expression"
    },
    {
        word: "dormitory",
        hint: "A large bedroom for many people"
    },
    {
        word: "transparent",
        hint: "Allowing light to pass through so objects behind can be seen clearly"
    },
    {
        word: "football",
        hint: "A popular sport played with a spherical ball"
    },
    {
        word: "astronomy",
        hint: "The scientific study of celestial objects and phenomena"
    },
    {
        word: "butterfly",
        hint: "An insect with colorful wings and a slender body"
    },
    {
        word: "diamond",
        hint: "A precious gemstone known for its brilliance and hardness"
    },
    {
        word: "ambiguous",
        hint: "A statement with multiple meanings"
    },
    {
        word: "history",
        hint: "The study of past events and human civilization"
    },
    {
        word: "cartographer",
        hint: "A person who designs and draws maps"
    },
    {
        word: "abode",
        hint: "A place where one lives or resides"
    },
    {
        word: "camera",
        hint: "A device used to capture and record images or videos"
    },
    {
        word: "pizza",
        hint: "A savory dish consisting of a round, flattened base with toppings"
    },
    {
        word: "jazz",
        hint: "A genre of music characterized by improvisation and syncopation"
    },
    {
        word: "monogamy",
        hint: "The practice of having only one spouse"
    },
    {
        word: "bicycle",
        hint: "A human-powered vehicle with 2 wheels"
    },
    {
        word: "science",
        hint: "The systematic study of the structure and behavior of the physical and natural world"
    },
    {
        word: "adventure",
        hint: "An exciting or daring experience"
    },
    {
        word: "gourmet",
        hint: "A lover of fine food and drink"
    },
    {
        word: "atheist",
        hint: "A person who does not believe in god"
    },
    {
        word: "sunset",
        hint: "The daily disappearance of the sun below the horizon"
    },
    {
        word: "hamlet",
        hint: "A community of people smaller than a village"
    },
    {
        word: "drove",
        hint: "A herd or flock of animals being driven in a body"
    },
    {
        word: "coffee",
        hint: "A popular caffeinated beverage made from roasted coffee beans"
    },
    {
        word: "orchestra",
        hint: "A large ensemble of musicians playing various instruments"
    },
    {
        word: "volcano",
        hint: "A mountain or hill with a vent through which lava, rock fragments, hot vapor and gas are ejected"
    },
    {
        word: "dance",
        hint: "A rhythmic movement of the body often performed to music"
    },
    {
        word: "cartoon",
        hint: "A drawing made to mock or riddle"
    },
    {
        word: "thermometer",
        hint: "A device to measure temperature"
    },
    {
        word: "aviary",
        hint: "A place where birds are kept"
    },
    {
        word: "novel",
        hint: "A long work of fiction, typically witha complex plot and characters"
    },
    {
        word: "symphony",
        hint: "A long musical composition for a full orchestra, typically in multiple movements"
    },
    {
        word: "ballet",
        hint: "A classical dance from characterized by precise and graceful movements"
    },
    {
        word: "apiary",
        hint: "A place where bees are kept"
    },
    {
        word: "sculpture",
        hint: "A 3D art form created by shaping or combining materials"
    },
    {
        word: "architecture",
        hint: "The art and science of designing and constructing buildings"
    },
    {
        word: "veteran",
        hint: "A person with long experience in a field"
    },
    {
        word: "extempore",
        hint: "A speech made without preparation"
    },
    {
        word: "fragile",
        hint: "Something easily broken or damaged"
    },
    {
        word: "waterfall",
        hint: "A casade of water falling from a height"
    },
    {
        word: "polyglot",
        hint: "A person who speaks many languages"
    },
    {
        word: "astronaut",
        hint: "A person trained to travel and work in space"
    },
    {
        word: "rainbow",
        hint: "A meteorological phenomenon that is caused by reflection, refraction and dispersion of light"
    },
    {
        word: "centenarian",
        hint: "A person who is 100 yeards old or more"
    },
    {
        word: "technology",
        hint: "The application of scientific knowledge for practical purposes"
    },
    {
        word: "piano",
        hint: "A musical instrument played by pressing keys that cause hammers to strike strings"
    },
    {
        word: "universe",
        hint: "All existing matter, space and time as a whole"
    },
    {
        word: "rainforest",
        hint: "A dense forest characterized by high rainfall and biodiversity"
    },
    {
        word: "vacation",
        hint: "A period of time devoted to pleasure, rest or relaxation"
    },
    {
        word: "illiterate",
        hint: "A person who cannot read or write"
    },
    {
        word: "dialogue",
        hint: "Conversation between 2 people"
    },
    {
        word: "seismograph",
        hint: "A device to measure earthquakes"
    },
    {
        word: "language",
        hint: "A system of comunication consisting of words, guestures and syntax"
    },
    {
        word: "catalogue",
        hint: "A list of books"
    },
    {
        word: "theater",
        hint: "A building or outdoor area in which plays, movies, or other performances are staged"
    },
    {
        word: "desert",
        hint: "A barren or arid land with little or no precipitation"
    },
    {
        word: "telephone",
        hint: "A device used to transmit sound over long distances"
    },
    {
        word: "telescope",
        hint: "An optical instrument used to view distant objects in space"
    },
    {
        word: "sunflower",
        hint: "A tall plant with a large yellow flower head"
    },
    {
        word: "fantasy",
        hint: "A genre of imaginative fiction involving magic and supernatural elements"
    },
    {
        word: "breeze",
        hint: "A gentle wind"
    },
    {
        word: "oasis",
        hint: "A fertile spot in a desert where water is found"
    },
    {
        word: "photography",
        hint: "The art, process, or practice of creating images by recording light or other electromagnetic radiation"
    },
    {
        word: "safari",
        hint: "An expedition or journey, typically to observe wildlife in their natural habitat"
    },
    {
        word: "planet",
        hint: "A celestial body that orbits a star and does not produce light of its own"
    },
    {
        word: "river",
        hint: "A large natural stream of water flowing in a channel to the sea, a lake, or another such stream"
    },
    {
        word: "tropical",
        hint: "Relating to or situated in the region between the Tropic of Cancer and the Tropic of Capricorn"
    },
    {
        word: "mysterious",
        hint: "Difficult or impossible to understand, explain, or identify"
    },
    {
        word: "enigma",
        hint: "Something that is mysterious, puzzling, or difficult to understand"
    },
    {
        word: "shadow",
        hint: "A dark area or shape produced by an object blocking the light"
    },
    {
        word: "paradox",
        hint: "A statement or situation that contradicts itself or defies intuition"
    },
    {
        word: "puzzle",
        hint: "A game, toy, or problem designed to test ingenuity or knowledge"
    },
    {
        word: "whisper",
        hint: "To speak very softly or quietly, often in a secretive manner"
    },
    {
        word: "secret",
        hint: "Something kept hidden or unknown to others"
    },
    {
        word: "curiosity",
        hint: "A strong desire to know or learn something"
    },
    {
        word: "unpredictable",
        hint: "Not able to be foreseen or known beforehand; uncertain"
    },
    {
        word: "obfuscate",
        hint: "To confuse or bewilder someone; to make something unclear or difficult to understand"
    },
    {
        word: "unveil",
        hint: "To make known or reveal something previously secret or unknown"
    },
    {
        word: "illusion",
        hint: "A false perception or belief; a deceptive appearance or impression"
    },
    {
        word: "moonlight",
        hint: "The light from the moon"
    },
    {
        word: "vibrant",
        hint: "Full of energy, brightness, and life"
    },
    {
        word: "nostalgia",
        hint: "A sentimental longing or wistful affection for the past"
    },
    {
        word: "brilliant",
        hint: "Exceptionally clever, talented, or impressive"
    },
    {
        word: "incorrigible",
        hint: "Incapable of being corrected"
    },
    {
        word: "volunteer",
        hint: "A person who works without pay"
    },
    {
        word: "letter",
        hint: "A written message sent through mail"
    },
    {
        word: "chronology",
        hint: "A list of events in the order they happened"
    },
    {
        word: "plagiarize",
        hint: "To steal and pass off ideas as one's own"
    },
    {
        word: "cannibal",
        hint: "A person who eats human flesh"
    },
    {
        word: "soluble",
        hint: "Able to be dissolved in a liquid"
    },
    {
        word: "advocate",
        hint: "A person who publicly supports an idea"
    },
    {
        word: "archive",
        hint: "A collection of historical records"
    },
    {
        word: "oxymoron",
        hint: "A figure of speech with contradictory terms"
    },
    {
        word: "claustrophobia",
        hint: "An extreme fear of confined places"
    },
    {
        word: "flammable",
        hint: "Something that catches fire easily"
    },
    {
        word: "diurnal",
        hint: "Active or occurring during the day"
    },
    {
        word: "sybarite",
        hint: "One who is fond of luxury"
    },
    {
        word: "theocracy",
        hint: "Rule by the church"
    },
    {
        word: "anthology",
        hint: "A collection of poems"
    },
    {
        word: "anecdote",
        hint: "A short, amusing story"
    },
];