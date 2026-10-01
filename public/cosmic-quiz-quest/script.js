const QUESTION_DATABASE = {
    cosmos: {
        easy: [
            {
                question: "Which planet in our solar system is famously known as the 'Red Planet'?",
                options: ["Venus", "Mars", "Jupiter", "Saturn"],
                correctIndex: 1,
                explanation: "Mars is called the Red Planet because iron minerals in its soil oxidise, or rust, causing the soil and atmosphere to look red."
            },
            {
                question: "What is the name of the barred spiral galaxy that contains our Solar System?",
                options: ["Andromeda", "Milky Way", "Triangulum", "Sombrero"],
                correctIndex: 1,
                explanation: "Our Solar System resides in the Milky Way, a barred spiral galaxy containing an estimated 100 to 400 billion stars."
            },
            {
                question: "Which is the largest planet in our solar system, boasting a massive Great Red Spot?",
                options: ["Saturn", "Neptune", "Jupiter", "Uranus"],
                correctIndex: 2,
                explanation: "Jupiter is the largest planet, with a mass more than two and a half times that of all the other planets in our solar system combined."
            },
            {
                question: "What was the name of the first artificial satellite launched into Earth orbit by humanity in 1957?",
                options: ["Vanguard 1", "Sputnik 1", "Explorer 1", "Apollo 1"],
                correctIndex: 1,
                explanation: "Sputnik 1 was launched by the Soviet Union on October 4, 1957, beginning the space age and the Space Race."
            },
            {
                question: "What is the name of the brightest star visible in the night sky from Earth?",
                options: ["Polaris", "Sirius", "Betelgeuse", "Alpha Centauri"],
                correctIndex: 1,
                explanation: "Sirius, also known as the Dog Star, is the brightest star in Earth's night sky, situated in the Canis Major constellation."
            }
        ],
        medium: [
            {
                question: "Approximately how long does it take for light radiating from the Sun to reach Earth?",
                options: ["8 seconds", "8 minutes", "8 hours", "8 days"],
                correctIndex: 1,
                explanation: "The Sun is about 150 million km away. Since light travels at 300,000 km/s, it takes roughly 8 minutes and 20 seconds to reach us."
            },
            {
                question: "What is the boundary surrounding a black hole beyond which the escape velocity exceeds the speed of light?",
                options: ["Accretion Disk", "Singularity Point", "Event Horizon", "Schwarzschild Limit"],
                correctIndex: 2,
                explanation: "The Event Horizon is the 'point of no return' where gravitational pull is so strong that not even light can escape."
            },
            {
                question: "Which planet has the hottest average surface temperature due to a runaway greenhouse effect?",
                options: ["Mercury", "Venus", "Mars", "Jupiter"],
                correctIndex: 1,
                explanation: "Venus is hotter than Mercury despite being farther from the sun. Its thick atmosphere traps heat, leading to surface temperatures around 465°C."
            },
            {
                question: "Which celestial body is the largest known dwarf planet in our solar system?",
                options: ["Pluto", "Eris", "Ceres", "Makemake"],
                correctIndex: 0,
                explanation: "Pluto, reclassified as a dwarf planet in 2006, is the largest dwarf planet by volume, though Eris is slightly more massive."
            },
            {
                question: "What is the name of Saturn's largest moon, which has a dense atmosphere and liquid methane lakes?",
                options: ["Europa", "Titan", "Ganymede", "Enceladus"],
                correctIndex: 1,
                explanation: "Titan is Saturn's largest moon and the only moon in the solar system known to possess a substantial atmosphere and stable bodies of surface liquid."
            }
        ],
        hard: [
            {
                question: "What is the name of the nearest major spiral galaxy to the Milky Way, situated about 2.5 million light-years away?",
                options: ["Triangulum Galaxy", "Large Magellanic Cloud", "Andromeda Galaxy", "Whirlpool Galaxy"],
                correctIndex: 2,
                explanation: "Andromeda (M31) is the nearest major galaxy and is currently on a collision course with the Milky Way, expected to merge in about 4.5 billion years."
            },
            {
                question: "What was the name of the first interstellar object detected passing through our solar system in 2017?",
                options: ["C/2019 Q4 Borisov", "Halley's Comet", "'Oumuamua", "Churyumov-Gerasimenko"],
                correctIndex: 2,
                explanation: "'Oumuamua was discovered by Robert Weryk using the Pan-STARRS telescope. Its highly hyperbolic trajectory proved it originated outside our solar system."
            },
            {
                question: "What unit of distance is defined as the distance at which an object has a parallax angle of one arcsecond?",
                options: ["Light-year", "Astronomical Unit (AU)", "Parsec", "Megameter"],
                correctIndex: 2,
                explanation: "A Parsec (parallax second) is equal to about 3.26 light-years, or 30.9 trillion kilometers."
            },
            {
                question: "Which class of stellar remnant represents the densest known form of matter in the universe outside of a black hole?",
                options: ["White Dwarf", "Neutron Star", "Red Giant", "Brown Dwarf"],
                correctIndex: 1,
                explanation: "Neutron stars are so dense that a single teaspoon of their material would weigh about 6 billion tons on Earth."
            },
            {
                question: "What is the theoretical boundary radius of a non-rotating black hole named after the physicist who calculated it?",
                options: ["Einstein Radius", "Schwarzschild Radius", "Hawking Boundary", "Chandrasekhar Limit"],
                correctIndex: 1,
                explanation: "The Schwarzschild Radius defines the event horizon size of a static black hole based on its mass."
            }
        ]
    },
    cyberpunk: {
        easy: [
            {
                question: "What does 'HTML' stand for in web development?",
                options: [
                    "HyperText Markup Language",
                    "HighText Machine Language",
                    "HyperTransfer Markup Ledger",
                    "Hybrid Technology Matrix Link"
                ],
                correctIndex: 0,
                explanation: "HTML stands for HyperText Markup Language. It is the standard markup language used to structure pages on the Web."
            },
            {
                question: "In computer programming, what is a variable primarily used for?",
                options: ["Compiling code structures", "Storing data values", "Connecting network nodes", "Debugging compilation errors"],
                correctIndex: 1,
                explanation: "Variables are named containers used to temporarily store and manipulate data values in memory."
            },
            {
                question: "Which of the following is commonly referred to as the 'brain' of a computer system?",
                options: ["Graphics Processing Unit (GPU)", "Random Access Memory (RAM)", "Central Processing Unit (CPU)", "Hard Disk Drive (HDD)"],
                correctIndex: 2,
                explanation: "The CPU performs the basic arithmetic, logic, controlling, and input/output operations specified by computer instructions."
            },
            {
                question: "What is the standard port number used for secure HTTPS web traffic?",
                options: ["80", "21", "443", "8080"],
                correctIndex: 2,
                explanation: "While HTTP uses port 80, secure HTTPS traffic is encrypted via SSL/TLS and default routed through port 443."
            },
            {
                question: "Which core operating system kernel is open-source and serves as the foundation for Android?",
                options: ["Windows NT", "macOS Darwin", "Linux", "FreeBSD"],
                correctIndex: 2,
                explanation: "Android is built on top of the Linux kernel, using its resource management, driver model, and security architecture."
            }
        ],
        medium: [
            {
                question: "Which programming language, originally designed in 10 days, adds client-side scripting and interactivity to web pages?",
                options: ["Python", "Java", "JavaScript", "C++"],
                correctIndex: 2,
                explanation: "JavaScript was created by Brendan Eich in 1995 while working at Netscape, originally named Mocha, then LiveScript, and finally JavaScript."
            },
            {
                question: "Who authored the 1984 science fiction novel 'Neuromancer', which pioneered the cyberpunk genre and coined the term 'cyberspace'?",
                options: ["Philip K. Dick", "Neal Stephenson", "William Gibson", "Bruce Sterling"],
                correctIndex: 2,
                explanation: "William Gibson's 'Neuromancer' is a seminal work of cyberpunk literature, establishing tropes of high tech, low life, and matrix hacking."
            },
            {
                question: "In relational databases, what does the acronym 'SQL' stand for?",
                options: ["Structured Query Language", "System Query Ledger", "Simple Queue Logic", "Sequential Query Lineage"],
                correctIndex: 0,
                explanation: "SQL stands for Structured Query Language, the standard programming language used to manage and query relational databases."
            },
            {
                question: "What type of malware is designed to lock a user's files and demand payment to decrypt them?",
                options: ["Trojan Horse", "Ransomware", "Spyware", "Logic Bomb"],
                correctIndex: 1,
                explanation: "Ransomware encrypts critical files and demands cryptocurrency payments in exchange for the decryption key."
            },
            {
                question: "Which Git command is used to record file snapshots in the repository history?",
                options: ["git push", "git commit", "git add", "git checkout"],
                correctIndex: 1,
                explanation: "The 'git commit' command saves changes currently staged to the local repository, creating a new revision node."
            }
        ],
        hard: [
            {
                question: "What term describes a cyber attack that exploits a software vulnerability before the vendor is aware of it or has released a patch?",
                options: ["Man-in-the-Middle Attack", "SQL Injection", "Zero-day Exploit", "Distributed Denial of Service (DDoS)"],
                correctIndex: 2,
                explanation: "A Zero-day exploit targets a vulnerability on the exact day it becomes known, leaving 'zero days' for developers to create a security patch."
            },
            {
                question: "Which cryptographic hashing algorithm is utilized as the primary proof-of-work mechanism in the Bitcoin blockchain network?",
                options: ["MD5", "SHA-256", "bcrypt", "Scrypt"],
                correctIndex: 1,
                explanation: "Bitcoin uses double SHA-256 (Secure Hash Algorithm, 256-bit) to secure transactions and verify blocks through proof-of-work mining."
            },
            {
                question: "In cryptography, what is the term for a mathematical scheme that proves a sender's authenticity without revealing the private key?",
                options: ["Symmetric Cipher", "Digital Signature", "Salting", "Steganography"],
                correctIndex: 1,
                explanation: "Digital signatures use asymmetric public-key cryptography to provide authentication, non-repudiation, and integrity checks."
            },
            {
                question: "Which networking model defines a seven-layer conceptual framework for network communications?",
                options: ["TCP/IP Model", "OSI Model", "DNS Hierarchy", "HTTP Pipeline"],
                correctIndex: 1,
                explanation: "The Open Systems Interconnection (OSI) model defines 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application."
            },
            {
                question: "In computer science, what is the time complexity of searching a sorted array using binary search?",
                options: ["O(n)", "O(n log n)", "O(log n)", "O(1)"],
                correctIndex: 2,
                explanation: "Binary search repeatedly divides the search interval in half, leading to a logarithmic time complexity of O(log n)."
            }
        ]
    },
    nature: {
        easy: [
            {
                question: "What gas do green plants absorb from the air to perform photosynthesis and produce energy?",
                options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
                correctIndex: 1,
                explanation: "During photosynthesis, plants take in carbon dioxide (CO2) and water (H2O) from the air and soil, releasing oxygen as a byproduct."
            },
            {
                question: "What is the chemical formula representing water?",
                options: ["CO2", "H2O", "NaCl", "O2"],
                correctIndex: 1,
                explanation: "Water consists of two hydrogen atoms covalently bonded to a single oxygen atom, hence H2O."
            },
            {
                question: "How many bones are typically found in an adult human body?",
                options: ["106", "206", "306", "406"],
                correctIndex: 1,
                explanation: "Adult humans have 206 bones. Infants are born with around 270, some of which fuse together as they grow."
            },
            {
                question: "Which of the following is the primary source of energy that powers Earth's weather and ecosystem?",
                options: ["Geothermal heat", "The Moon", "The Sun", "Wind currents"],
                correctIndex: 2,
                explanation: "The Sun drives our climate, weather patterns, ocean currents, and photosynthesis, which supports almost all food chains."
            },
            {
                question: "Which gas makes up the second-highest percentage of Earth's atmosphere?",
                options: ["Nitrogen", "Oxygen", "Carbon Dioxide", "Argon"],
                correctIndex: 1,
                explanation: "Earth's atmosphere is composed of about 78% Nitrogen, 21% Oxygen, 0.9% Argon, and trace amounts of other gases like CO2."
            }
        ],
        medium: [
            {
                question: "Which vital organ in the human body is responsible for pumping blood through the circulatory system?",
                options: ["Lungs", "Brain", "Heart", "Liver"],
                correctIndex: 2,
                explanation: "The heart is a muscular organ that pumps blood through blood vessels of the circulatory system, providing oxygen and nutrients."
            },
            {
                question: "What is the term for the process in which liquid water changes states to become water vapor?",
                options: ["Condensation", "Evaporation", "Sublimation", "Precipitation"],
                correctIndex: 1,
                explanation: "Evaporation occurs when liquid water absorbing thermal energy transitions into its gaseous state, water vapor."
            },
            {
                question: "What is the term for organisms that consume both plant material and animal flesh?",
                options: ["Herbivore", "Carnivore", "Omnivore", "Detritivore"],
                correctIndex: 2,
                explanation: "Omnivores (from Latin 'omnis' meaning all) eat a variety of food sources including plants, fungi, and animals."
            },
            {
                question: "Which chemical element has the symbol 'Fe' and makes up the core of our planet?",
                options: ["Fluorine", "Iron", "Gold", "Lead"],
                correctIndex: 1,
                explanation: "Fe stands for Ferrum, the Latin word for Iron. Iron makes up the majority of Earth's inner and outer core."
            },
            {
                question: "What substance in red blood cells binds to oxygen molecules and transports them throughout the body?",
                options: ["Plasma", "Platelets", "Hemoglobin", "White blood cells"],
                correctIndex: 2,
                explanation: "Hemoglobin is an iron-rich protein in red blood cells that carries oxygen from the lungs to the rest of the body."
            }
        ],
        hard: [
            {
                question: "What is the name of the largest living structure on Earth, stretching over 2,300 kilometers off Australia?",
                options: ["The Amazon Rainforest", "The Great Barrier Reef", "The Giant Sequoia Forest", "The Grand Canyon Ecosystem"],
                correctIndex: 1,
                explanation: "The Great Barrier Reef is the world's largest coral reef system, composed of over 2,900 individual reefs and visible from space."
            },
            {
                question: "Which of the following is the only mammal naturally capable of sustained, powered flight?",
                options: ["Flying Squirrel", "Bat", "Sugar Glider", "Pterodactyl"],
                correctIndex: 1,
                explanation: "While flying squirrels and gliders can glide, bats are the only mammals with true, powered flight, having webbed wings."
            },
            {
                question: "Which fundamental constant in physics represents the speed of light in a vacuum, denoted by 'c'?",
                options: ["9.81 m/s²", "6.67 x 10^-11 m³/kg·s²", "299,792,458 m/s", "3 x 10^8 km/h"],
                correctIndex: 2,
                explanation: "The speed of light in vacuum is exactly 299,792,458 meters per second (approx. 300,000 km/s)."
            },
            {
                question: "What biological macromolecule carries the genetic instructions used in the growth, development, and functioning of all known living organisms?",
                options: ["RNA", "DNA", "Protein", "Polysaccharide"],
                correctIndex: 1,
                explanation: "DNA (Deoxyribonucleic acid) is a double-stranded helix molecule storing the genetic codes for living organisms."
            },
            {
                question: "Which scientific term describes the symbiotic relationship where one species benefits while the other is unaffected?",
                options: ["Mutualism", "Commensalism", "Parasitism", "Competition"],
                correctIndex: 1,
                explanation: "Commensalism is a class of relationship where one organism benefits from the other without affecting it (e.g., barnacles on whales)."
            }
        ]
    }
};

// ==========================================
// 2. AUDIO SYNTHESIZER (WEB AUDIO API)
// ==========================================
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.muted = false;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playClick() {
        if (this.muted) return;
        this.init();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
    }

    playCorrect() {
        if (this.muted) return;
        this.init();

        const t = this.ctx.currentTime;

        // Note 1: C5
        this.triggerTone(523.25, 0.1, 0.1);

        // Note 2: E5 (delayed by 0.1s)
        setTimeout(() => {
            if (this.muted) return;
            this.triggerTone(659.25, 0.1, 0.25);
        }, 100);
    }

    playWrong() {
        if (this.muted) return;
        this.init();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(90, this.ctx.currentTime + 0.35);

        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

        // Apply low pass filter to make it buzzier but softer
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, this.ctx.currentTime);

        osc.disconnect(gain);
        osc.connect(filter);
        filter.connect(gain);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.35);
    }

    playTimerTick() {
        if (this.muted) return;
        this.init();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    playTimerUrgent() {
        if (this.muted) return;
        this.init();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.12);

        gain.gain.setValueAtTime(0.07, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.12);
    }

    playFanfare(isExcellent) {
        if (this.muted) return;
        this.init();

        const baseFreqs = isExcellent ? [261.63, 329.63, 392.00, 523.25] : [196.00, 220.00, 196.00, 146.83];
        const times = [0, 120, 240, 360];
        const durations = [0.15, 0.15, 0.15, 0.45];

        baseFreqs.forEach((freq, idx) => {
            setTimeout(() => {
                if (this.muted) return;
                this.triggerTone(freq, durations[idx], 0.1);
            }, times[idx]);
        });
    }

    triggerTone(frequency, duration, volume) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }
}

const SFX = new SoundEngine();

// ==========================================
// 3. FLOATING STARS CANVAS ENGINE
// ==========================================
class Starfield {
    constructor() {
        this.canvas = document.getElementById('starfield');
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.animationId = null;
        this.maxStars = 100;

        this.resize = this.resize.bind(this);
        this.animate = this.animate.bind(this);
    }

    init() {
        window.addEventListener('resize', this.resize);
        this.resize();

        for (let i = 0; i < this.maxStars; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 1.5 + 0.2,
                opacity: Math.random() * 0.8 + 0.2,
                fadeDirection: Math.random() > 0.5 ? 0.008 : -0.008,
                speedY: Math.random() * 0.15 + 0.05
            });
        }

        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Subtle ambient space glow
        this.ctx.fillStyle = '#060412';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.stars.forEach(star => {
            // Update opacity (sparkle effect)
            star.opacity += star.fadeDirection;
            if (star.opacity >= 1 || star.opacity <= 0.15) {
                star.fadeDirection = -star.fadeDirection;
            }

            // Slow upward drift
            star.y -= star.speedY;
            if (star.y < 0) {
                star.y = this.canvas.height;
                star.x = Math.random() * this.canvas.width;
            }

            // Draw
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(243, 241, 250, ${star.opacity})`;

            // Add slight blue/purple glow to larger stars
            if (star.radius > 1.2) {
                this.ctx.shadowBlur = 8;
                this.ctx.shadowColor = 'rgba(138, 43, 226, 0.4)';
            } else {
                this.ctx.shadowBlur = 0;
            }

            this.ctx.fill();
        });

        this.animationId = requestAnimationFrame(this.animate);
    }
}

// ==========================================
// 4. GAME STATE ENGINE
// ==========================================
class QuizQuest {
    constructor() {
        // State Cache
        this.category = 'cosmos';
        this.difficulty = 'easy';
        this.questions = [];
        this.currentIndex = 0;
        this.score = 0;
        this.timeLeft = 15;
        this.timerMax = 15;
        this.timerInterval = null;
        this.answersLog = []; // Stores user response details

        // Element Bindings
        this.setupScreen = document.getElementById('setup-screen');
        this.quizScreen = document.getElementById('quiz-screen');
        this.resultsScreen = document.getElementById('results-screen');

        this.categoryCards = document.querySelectorAll('.category-card');
        this.difficultyBtns = document.querySelectorAll('.diff-btn');
        this.bestScoreDisplay = document.getElementById('best-score-display');
        this.rankBadgeDisplay = document.getElementById('rank-badge-display');
        this.startBtn = document.getElementById('start-quest-btn');

        this.qNumDisplay = document.getElementById('question-number');
        this.runningScoreDisplay = document.getElementById('running-score');
        this.progressBarFill = document.getElementById('progress-bar-fill');
        this.timerText = document.getElementById('timer-text');
        this.timerCircleFill = document.getElementById('timer-fill');

        this.quizCategoryTag = document.getElementById('quiz-category-tag');
        this.quizDifficultyTag = document.getElementById('quiz-difficulty-tag');
        this.qTextDisplay = document.getElementById('question-text');
        this.optionsContainer = document.getElementById('options-container');
        this.explanationBox = document.getElementById('answer-explanation');
        this.explanationText = document.getElementById('explanation-text');
        this.nextBtn = document.getElementById('next-question-btn');

        this.gaugeCircleFill = document.getElementById('gauge-fill');
        this.finalScorePercent = document.getElementById('final-score-percent');
        this.finalScoreFraction = document.getElementById('final-score-fraction');
        this.finalRankTitle = document.getElementById('final-rank-title');
        this.finalRankDesc = document.getElementById('final-rank-desc');
        this.newHighScoreBanner = document.getElementById('new-high-score-banner');

        this.shareScoreBtn = document.getElementById('share-score-btn');
        this.restartBtns = document.querySelectorAll('#restart-quest-btn');
        this.toggleBreakdownBtn = document.getElementById('toggle-breakdown-btn');
        this.breakdownLog = document.getElementById('mission-log-breakdown');

        this.soundToggleBtn = document.getElementById('sound-toggle-btn');
        this.toast = document.getElementById('toast-notification');
        this.toastMessage = document.getElementById('toast-message');
    }

    init() {
        // Event Listeners for Configuration Setup
        this.categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                SFX.playClick();
                this.categoryCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                this.category = card.getAttribute('data-category');
                this.updateSelectionStats();
            });
        });

        this.difficultyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                SFX.playClick();
                this.difficultyBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.difficulty = btn.getAttribute('data-difficulty');
                this.updateSelectionStats();
            });
        });

        // Audio controls
        const soundPref = localStorage.getItem('sound_enabled');
        if (soundPref === 'false') {
            SFX.muted = true;
            this.updateSoundToggleIcon(false);
        }
        this.soundToggleBtn.addEventListener('click', () => {
            SFX.muted = !SFX.muted;
            localStorage.setItem('sound_enabled', !SFX.muted);
            this.updateSoundToggleIcon(!SFX.muted);
            if (!SFX.muted) SFX.playClick();
        });

        // Start Buttons
        this.startBtn.addEventListener('click', () => {
            SFX.playClick();
            this.startQuiz();
        });

        // Next Button
        this.nextBtn.addEventListener('click', () => {
            SFX.playClick();
            this.advanceQuiz();
        });

        // Replay Button Hooks
        this.restartBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                SFX.playClick();
                this.resetQuizToHome();
            });
        });

        // Share Action
        this.shareScoreBtn.addEventListener('click', () => {
            SFX.playClick();
            this.shareRecord();
        });

        // Mission Log Accordion
        this.toggleBreakdownBtn.addEventListener('click', () => {
            SFX.playClick();
            const isOpen = this.toggleBreakdownBtn.classList.toggle('open');
            this.breakdownLog.classList.toggle('hidden', !isOpen);
        });

        // Initial setup dashboard render
        this.updateSelectionStats();
    }

    updateSoundToggleIcon(enabled) {
        const icon = this.soundToggleBtn.querySelector('i');
        if (enabled) {
            icon.className = 'fa-solid fa-volume-high';
        } else {
            icon.className = 'fa-solid fa-volume-xmark';
        }
    }

    updateSelectionStats() {
        const key = `hs_${this.category}_${this.difficulty}`;
        const record = localStorage.getItem(key) || 0;
        this.bestScoreDisplay.textContent = `${record} / 5`;

        // Calculate Rank Badge
        let badge = "Novice Cadet";
        if (record === 5) {
            badge = "Quantum Legend";
        } else if (record >= 4) {
            badge = "Galactic Scholar";
        } else if (record >= 2) {
            badge = "Star Officer";
        }
        this.rankBadgeDisplay.textContent = badge;
    }

    // Initialize State and Transitions to Play Screen
    startQuiz() {
        // Transition screens
        this.setupScreen.classList.remove('active');
        setTimeout(() => {
            this.setupScreen.classList.add('hidden');
            this.quizScreen.classList.remove('hidden');
            setTimeout(() => this.quizScreen.classList.add('active'), 50);
        }, 300);

        // Reset game stats
        this.score = 0;
        this.currentIndex = 0;
        this.answersLog = [];
        this.runningScoreDisplay.textContent = `Score: 0`;

        // Fetch & Shuffle questions for variety
        const rawList = QUESTION_DATABASE[this.category][this.difficulty];
        // Create a copy and shuffle it
        this.questions = [...rawList].sort(() => Math.random() - 0.5);

        // Adjust timers based on difficulty for extra complexity
        if (this.difficulty === 'easy') {
            this.timerMax = 15;
        } else if (this.difficulty === 'medium') {
            this.timerMax = 12;
        } else {
            this.timerMax = 10;
        }

        // Render tags
        this.quizCategoryTag.textContent = this.formatCategoryName(this.category);
        this.quizDifficultyTag.textContent = this.difficulty;
        this.quizDifficultyTag.className = `difficulty-tag ${this.difficulty}`;

        // Load Question 1
        this.loadQuestion();
    }

    formatCategoryName(cat) {
        if (cat === 'cosmos') return "Space & Cosmos";
        if (cat === 'cyberpunk') return "Tech & Cyberpunk";
        return "Science & Nature";
    }

    loadQuestion() {
        const q = this.questions[this.currentIndex];

        // Reset header details
        this.qNumDisplay.textContent = `Question ${this.currentIndex + 1} of ${this.questions.length}`;
        const pct = ((this.currentIndex + 1) / this.questions.length) * 100;
        this.progressBarFill.style.width = `${pct}%`;

        // Load Question Text
        this.qTextDisplay.textContent = q.question;

        // Reset elements
        this.optionsContainer.innerHTML = '';
        this.explanationBox.classList.add('hidden');
        this.nextBtn.disabled = true;

        // Load Option cards
        const letters = ['A', 'B', 'C', 'D'];
        q.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'option-card glass-panel animate-fade-in';
            btn.setAttribute('data-index', idx);
            btn.style.animationDelay = `${idx * 0.08}s`;

            btn.innerHTML = `
                <span class="option-letter">${letters[idx]}</span>
                <span class="option-value">${this.escapeHTML(opt)}</span>
                <i class="feedback-icon fa-solid"></i>
            `;

            btn.addEventListener('click', () => this.evaluateAnswer(idx));
            this.optionsContainer.appendChild(btn);
        });

        // Trigger Timer count down
        this.timeLeft = this.timerMax;
        this.updateTimerDisplay();
        this.startTimer();
    }

    escapeHTML(str) {
        return str.replace(/[&<>'"]/g,
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    startTimer() {
        clearInterval(this.timerInterval);

        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();

            // Play warning sounds on low timer
            if (this.timeLeft <= 3 && this.timeLeft > 0) {
                SFX.playTimerUrgent();
            } else if (this.timeLeft > 0) {
                SFX.playTimerTick();
            }

            if (this.timeLeft <= 0) {
                clearInterval(this.timerInterval);
                this.evaluateAnswer(-1); // Automatically trigger wrong / timeout
            }
        }, 1000);
    }

    updateTimerDisplay() {
        this.timerText.textContent = this.timeLeft;

        // Calculate circumference mapping (stroke-dashoffset)
        const radius = 45;
        const circ = 2 * Math.PI * radius; // Approx 282.74
        const fillPercent = this.timeLeft / this.timerMax;
        const offset = circ - (fillPercent * circ);

        this.timerCircleFill.style.strokeDashoffset = offset;

        // Urgently style colors if <= 3 seconds remaining
        if (this.timeLeft <= 3) {
            this.timerCircleFill.classList.add('urgent');
            this.timerText.classList.add('urgent');
        } else {
            this.timerCircleFill.classList.remove('urgent');
            this.timerText.classList.remove('urgent');
        }
    }

    evaluateAnswer(selectedIndex) {
        clearInterval(this.timerInterval);
        const q = this.questions[this.currentIndex];
        const correctIndex = q.correctIndex;
        const optionCards = this.optionsContainer.querySelectorAll('.option-card');

        // Disable all options
        optionCards.forEach(c => c.disabled = true);

        const isCorrect = (selectedIndex === correctIndex);

        // Play matching effects
        if (selectedIndex === -1) {
            // Timeout scenario
            SFX.playWrong();
            // Highlight the correct one
            const correctCard = this.optionsContainer.querySelector(`[data-index="${correctIndex}"]`);
            if (correctCard) {
                correctCard.classList.add('correct');
                correctCard.querySelector('.feedback-icon').classList.add('fa-circle-check');
            }
        } else if (isCorrect) {
            SFX.playCorrect();
            this.score++;
            this.runningScoreDisplay.textContent = `Score: ${this.score}`;
            const clickedCard = this.optionsContainer.querySelector(`[data-index="${selectedIndex}"]`);
            if (clickedCard) {
                clickedCard.classList.add('correct');
                clickedCard.querySelector('.feedback-icon').classList.add('fa-circle-check');
            }
        } else {
            SFX.playWrong();
            const clickedCard = this.optionsContainer.querySelector(`[data-index="${selectedIndex}"]`);
            if (clickedCard) {
                clickedCard.classList.add('wrong');
                clickedCard.querySelector('.feedback-icon').classList.add('fa-circle-xmark');
            }
            // Also reveal correct one
            const correctCard = this.optionsContainer.querySelector(`[data-index="${correctIndex}"]`);
            if (correctCard) {
                correctCard.classList.add('correct');
                correctCard.querySelector('.feedback-icon').classList.add('fa-circle-check');
            }
        }

        // Store log metrics
        this.answersLog.push({
            questionText: q.question,
            options: q.options,
            selectedIndex: selectedIndex,
            correctIndex: correctIndex,
            isCorrect: isCorrect,
            explanation: q.explanation
        });

        // Display explanation
        this.explanationText.textContent = q.explanation;
        this.explanationBox.classList.remove('hidden');

        // Enable moving on
        this.nextBtn.disabled = false;
    }

    advanceQuiz() {
        this.currentIndex++;
        if (this.currentIndex < this.questions.length) {
            this.loadQuestion();
        } else {
            this.showResults();
        }
    }

    // Results screen compilation
    showResults() {
        // Transition screens
        this.quizScreen.classList.remove('active');
        setTimeout(() => {
            this.quizScreen.classList.add('hidden');
            this.resultsScreen.classList.remove('hidden');
            setTimeout(() => this.resultsScreen.classList.add('active'), 50);
        }, 300);

        const totalQ = this.questions.length;
        const rawPct = (this.score / totalQ) * 100;

        // Trigger Audio fanfare based on results
        const isExcellent = (rawPct >= 80);
        SFX.playFanfare(isExcellent);

        // Record check for leaderboard high scores
        const storageKey = `hs_${this.category}_${this.difficulty}`;
        const prevHigh = parseInt(localStorage.getItem(storageKey) || "0", 10);
        let newRecord = false;

        if (this.score > prevHigh) {
            localStorage.setItem(storageKey, this.score);
            newRecord = true;
        }

        // Show/hide New high score alert
        this.newHighScoreBanner.classList.toggle('hidden', !newRecord);

        // Setup evaluated status
        let rank = "Novice Cadet";
        let desc = "You're taking your first steps in this sector. Accumulate more data and launch again.";

        if (this.score === totalQ) {
            rank = "Quantum Legend";
            desc = "Absolute intellectual dominance! Your wisdom mirrors the cosmic horizon.";
        } else if (this.score >= 4) {
            rank = "Galactic Scholar";
            desc = "Superb execution. You demonstrated high wisdom in this complex cosmos.";
        } else if (this.score >= 2) {
            rank = "Star Officer";
            desc = "Steady trajectory. Maintain courses and keep exploring to scale higher.";
        }

        this.finalRankTitle.textContent = rank;
        this.finalRankDesc.textContent = desc;

        // Animate Circle Gauge
        const r = 42;
        const circ = 2 * Math.PI * r; // Approx 263.89
        this.gaugeCircleFill.style.strokeDasharray = circ;
        this.gaugeCircleFill.style.strokeDashoffset = circ;

        // Force browser layout repaint then animate
        setTimeout(() => {
            const offset = circ - (rawPct / 100 * circ);
            this.gaugeCircleFill.style.strokeDashoffset = offset;
        }, 100);

        // Number count-up animation
        let count = 0;
        this.finalScoreFraction.textContent = `0 / ${totalQ}`;
        this.finalScorePercent.textContent = `0%`;

        if (this.score > 0) {
            const countInterval = setInterval(() => {
                count++;
                const countPct = Math.round((count / totalQ) * 100);
                this.finalScorePercent.textContent = `${countPct}%`;
                this.finalScoreFraction.textContent = `${count} / ${totalQ}`;

                if (count >= this.score) {
                    clearInterval(countInterval);
                }
            }, 150);
        } else {
            this.finalScorePercent.textContent = `0%`;
            this.finalScoreFraction.textContent = `0 / ${totalQ}`;
        }

        // Build accordion review log list
        this.buildBreakdownLog();
    }

    buildBreakdownLog() {
        this.breakdownLog.innerHTML = '';
        const letters = ['A', 'B', 'C', 'D'];

        this.answersLog.forEach((log, index) => {
            const card = document.createElement('div');
            const stateClass = log.isCorrect ? 'correct-item' : 'wrong-item';
            card.className = `breakdown-card glass-panel ${stateClass}`;

            const badgeMarkup = log.isCorrect
                ? `<span class="answer-status-pill user-correct"><i class="fa-solid fa-circle-check"></i> Correct</span>`
                : `<span class="answer-status-pill user-incorrect"><i class="fa-solid fa-circle-xmark"></i> Incorrect</span>`;

            const selectedText = log.selectedIndex === -1
                ? "Time Expired"
                : `${letters[log.selectedIndex]}. ${log.options[log.selectedIndex]}`;

            const correctText = `${letters[log.correctIndex]}. ${log.options[log.correctIndex]}`;

            card.innerHTML = `
                <div class="breakdown-q-meta">
                    <span>Question ${index + 1}</span>
                    ${badgeMarkup}
                </div>
                <h4 class="breakdown-q-text">${log.questionText}</h4>
                <div class="breakdown-answer-row">
                    <span class="stat-label">Your Pick:</span>
                    <span class="text-accent">${this.escapeHTML(selectedText)}</span>
                </div>
                ${!log.isCorrect ? `
                <div class="breakdown-answer-row">
                    <span class="stat-label">Correct:</span>
                    <span style="color: var(--accent-emerald)">${this.escapeHTML(correctText)}</span>
                </div>
                ` : ''}
                <div class="breakdown-answer-row" style="margin-top: 0.25rem;">
                    <p style="font-size: 0.85rem; color: var(--text-muted); font-style: italic;">
                        <strong>Log note:</strong> ${log.explanation}
                    </p>
                </div>
            `;

            this.breakdownLog.appendChild(card);
        });

        // Close accordion by default
        this.toggleBreakdownBtn.classList.remove('open');
        this.breakdownLog.classList.add('hidden');
    }

    resetQuizToHome() {
        // Transition screens
        this.resultsScreen.classList.remove('active');
        setTimeout(() => {
            this.resultsScreen.classList.add('hidden');
            this.setupScreen.classList.remove('hidden');
            setTimeout(() => this.setupScreen.classList.add('active'), 50);
        }, 300);

        this.updateSelectionStats();
    }

    shareRecord() {
        const total = this.questions.length;
        const catName = this.formatCategoryName(this.category);
        const emoji = this.score === total ? '🏆' : '🚀';

        const shareText = `🌌 Cosmic Quiz Quest Completed!\n🎯 Mission: ${catName} (${this.difficulty.toUpperCase()})\n📊 Evaluation score: ${this.score} / ${total} (${Math.round(this.score / total * 100)}%)\n${emoji} Can you beat my stellar wisdom record? Play now!`;

        // Check navigator share capability
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText)
                .then(() => this.triggerToast("Mission score copied to clipboard!"))
                .catch(() => this.triggerToast("Failed to copy clipboard."));
        } else {
            this.triggerToast("Clipboard sharing unsupported.");
        }
    }

    triggerToast(message) {
        this.toastMessage.textContent = message;
        this.toast.classList.remove('hidden');
        setTimeout(() => this.toast.classList.add('show'), 20);

        setTimeout(() => {
            this.toast.classList.remove('show');
            setTimeout(() => this.toast.classList.add('hidden'), 400);
        }, 2500);
    }
}

// ==========================================
// 5. APPLICATION INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Start canvas backgrounds
    const bg = new Starfield();
    bg.init();

    // 2. Start core app game engine
    const app = new QuizQuest();
    app.init();
});
