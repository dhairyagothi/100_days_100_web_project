// ==========================================
// 1. CENTRALIZED STORIES DATABASE
// ==========================================
const storiesData = {
    "rabbit-lion": {
        lines: [
            "The Fearsome Lion: A mighty lion ruled the forest, terrifying all animals. Every day, he hunted mercilessly, making the creatures live in fear.",
            "The Scared Animals: The animals were terrified of the lion and desperately searched for a way to stop his constant hunting.",
            "The Lion’s Daily Kill: With no one to challenge him, the lion continued to hunt and kill animals every day, causing panic in the jungle.",
            "Choosing the Rabbit: To prevent random killings, the animals decided that one of them would be sent as a sacrifice each day. When it was the rabbit’s turn, he was chosen reluctantly because of his small size.",
            "The Rabbit’s Plan: Instead of going directly to the lion, the clever rabbit thought of a way to trick him. He delayed his arrival and came up with a story to deceive the lion.",
            "The Deception: The rabbit told the lion that another, stronger lion had claimed the jungle and had stopped him on the way. Enraged, the lion demanded to see his so-called rival.",
            "The Well Trick: The rabbit led the lion to a deep well and pointed inside, saying the rival lion was inside. The lion looked in and saw his own reflection in the water.",
            "The Fatal Leap: The lion, thinking his reflection was a real enemy, roared angrily. He jumped into the well to attack, only to drown in the deep water.",
            "The Animals’ Celebration: The rabbit returned to the other animals and announced the lion’s demise. Overjoyed, the animals cheered and finally lived in peace, free from fear. THE END"
        ],
        images: [
            "images/lion.webp", "images/second.webp", "images/lion+kill.jpg", 
            "images/rabbit.png", "images/rabbit+thinking.avif", "images/well.jpg", 
            "images/poster.jpeg", "images/lion+look.jpeg", "images/animal+happy.avif"
        ],
        sceneLabels: [
            "The Fearsome Lion", "The Scared Animals", "The Lion’s Daily Kill", 
            "Choosing the Rabbit", "The Rabbit’s Plan", "The Deception", 
            "The Well Trick", "The Fatal Leap", "The Animals’ Celebration"
        ]
    },
    "tortoise-hare": {
    mainTitle: "The Tortoise and the Hare",
    lines: [
        "The Boastful Rabbit: One day a rabbit was boasting about how fast he could run. He was laughing at the turtle for being so slow. Much to the rabbit’s surprise, the turtle challenged him to a race.",
        "The Challenge Accepted: The rabbit thought this was a good joke and accepted the challenge. The fox was chosen to be the umpire of the race.",
        "The Race Begins: As the race began, the rabbit raced way ahead of the turtle, just like everyone thought it would go.",
        "The Nap Choice: The rabbit got to the halfway point and could not see the turtle anywhere. Hot and tired, he decided to take a short nap, confident he could easily catch up if the turtle passed him.",
        "Step by Step: All this time, the turtle kept walking step by step by step. He never quit, no matter how hot or tired he got. He just kept going.",
        "Slow and Steady Wins: The rabbit slept much longer than he thought. Waking up, he dashed at full speed to the finish line, only to find the turtle already there waiting for him! THE END"
    ],
    images: [
        "images/rabbit-boasting.png", 
        "images/fox-umpire.png", 
        "images/rabbit-running.jpg", 
        "images/rabbit-sleeping.png", 
        "images/turtle-walking.png", 
        "images/turtle-winning.png"
    ],
    sceneLabels: [
        "The Boastful Rabbit", 
        "The Challenge Accepted", 
        "The Race Begins", 
        "The Nap Choice", 
        "Step by Step", 
        "Slow and Steady Wins"
    ]
},
"cap-seller": {
    mainTitle: "The Cap Seller and the Monkeys",
    lines: [
        "The Tired Cap Seller: Once a cap seller was going to the village to sell his caps in the market. He was carrying a basket of caps on his head. When crossing the forest, he got tired, laid down under a shady tree, and fell asleep.",
        "The Naughty Monkeys: There were many monkeys living on that tree who were very naughty. While the man was sleeping soundly, they quietly came down, took all the colorful caps from his basket, and climbed back up into the branches.",
        "An Empty Basket: When the cap seller woke up, he was shocked and surprised to see that his basket was completely empty. He looked up into the tree and saw that the monkeys were all wearing his caps!",
        "The Clever Trick: He tried shouting, but the monkeys just copied his gestures. Observing that the monkeys were imitating everything he did, the clever cap seller took off the cap he was wearing and threw it onto the ground.",
        "The Happy Departure: Just as he hoped, all the monkeys immediately copied him and threw their caps to the ground! The cap seller quickly gathered all his caps back into the basket and went away happily. THE END"
    ],
    images: [
        "images/caps-sleeping.png", 
        "images/monkeys-stealing.png", 
        "images/caps-empty-basket.png", 
        "images/caps-throwing.png", 
        "images/caps-gathered.png"
    ],
    sceneLabels: [
        "The Tired Cap Seller", 
        "The Naughty Monkeys", 
        "An Empty Basket", 
        "The Clever Trick", 
        "The Happy Departure"
    ]
},
"fox-stork": {
    mainTitle: "The Fox and the Stork",
    lines: [
        "The Selfish Invitation: Once upon a time, there lived a selfish fox. One day, the fox decided to play a trick on his friend Stork and invited her over to his house for dinner.",
        "An Evening Arrival: In the evening, the stork arrived at the fox’s house and knocked on the door. The fox opened the door with a smile and said, 'Welcome, my friend! Let’s have dinner.'",
        "The Shallow Bowls: The fox brought out two very shallow bowls of soup. The stork was incredibly hungry, but because of her long beak, she couldn’t eat a single drop from the flat plate. Meanwhile, the fox lapped up all his soup easily.",
        "The Clever Counter: The fox looked at her and slyly asked, 'Why haven’t you drunk your soup, my friend?' The polite stork didn't complain. Instead, she replied, 'Thank you for the invitation. I would love to invite you to dinner at my home tomorrow.'",
        "The Table Turns: The next day, the fox excitedly went to the stork's house. This time, the stork served the delicious soup inside two tall, deep jars with very narrow necks. The stork drank easily using her long beak, but the fox couldn't reach inside at all.",
        "A Lesson Learned: The fox could only lick the outside of the jar while the stork finished her meal. It was finally his turn to go home completely hungry, realizing that selfishness always comes back around. THE END"
    ],
    images: [
        "images/fox-invitation.png", 
        "images/stork-arriving.png", 
        "images/stork-shallow-bowl.png", 
        "images/stork-inviting.png", 
        "images/fox-deep-jar.png", 
        "images/fox-hungry-lesson.png"
    ],
    sceneLabels: [
        "The Selfish Invitation", 
        "An Evening Arrival", 
        "The Shallow Bowls", 
        "The Clever Counter", 
        "The Table Turns", 
        "A Lesson Learned"
    ]
}
    };

// ==========================================
// 2. URL PARSING & STORY CONFIGURATION
// ==========================================
const urlParams = new URLSearchParams(window.location.search);
const storyId = urlParams.get('story') || 'rabbit-lion'; // Default fallback

// Fetch current story array data based on ID; if it doesn't exist, default to rabbit-lion
const currentStory = storiesData[storyId] || storiesData['rabbit-lion'];

const line = currentStory.lines;
const images = currentStory.images;
const sceneLabels = currentStory.sceneLabels;

// ==========================================
// 3. DOM ELEMENT REFERENCES
// ==========================================
const textElement = document.getElementById("text");
const imageElement = document.getElementById("image");
const sceneLabelElement = document.getElementById("scene-label");

let i = 0;
let speech = null;
let isPaused = false;

// Set initial text fallback
textElement.textContent = line[i];

// ==========================================
// 4. RENDERING ENGINE
// ==========================================
function renderScene() {
    textElement.textContent = line[i];
    imageElement.src = images[i];
    imageElement.alt = sceneLabels[i];
    sceneLabelElement.textContent = `${sceneLabels[i]} • Scene ${i + 1} of ${line.length}`;
    
    // Stop ongoing narration if user changes scenes manually
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        isPaused = false;
    }
}

// ==========================================
// 5. TTS NARRATION ENGINE
// ==========================================
function speak(text) {
    if (speechSynthesis.speaking && isPaused) {
        speechSynthesis.resume();
        isPaused = false;
        return;
    }

    if (speech) {
        speechSynthesis.cancel();
    }

    speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;

    const voices = speechSynthesis.getVoices();
    speech.voice = voices.find((voice) => voice.name === "Google US English") || voices.find((voice) => voice.lang.startsWith("en")) || null;

    isPaused = false;
    speechSynthesis.speak(speech);
}

// ==========================================
// 6. INTERACTIVE MEDIA EVENT LISTENERS
// ==========================================
document.getElementById("next").addEventListener("click", function () {
    i = (i + 1) % line.length;
    renderScene();
});

document.getElementById("pause").addEventListener("click", function () {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.pause();
        isPaused = true;
    }
});

document.getElementById("play").addEventListener("click", function () {
    const text1 = textElement.textContent;
    if (isPaused) {
        speechSynthesis.resume();
        isPaused = false;
    } else {
        speak(text1);
    }
});

document.getElementById("stop").addEventListener("click", function () {
    speechSynthesis.cancel();
    isPaused = false;
});

// Cache dynamic browser voices 
window.speechSynthesis.onvoiceschanged = function () {
    const voices = speechSynthesis.getVoices();
    console.log(voices);
};

// Initial bootstrap kickstart
renderScene();