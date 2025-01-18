// Quiz questions database
const quizData = {
    general: {
        name: "General Knowledge",
        icon: "fa-globe",
        questions: [
            {
                question: "What is the capital of France?",
                choices: ["London", "Berlin", "Paris", "Madrid"],
                correct: 2,
                explanation: "Paris is the capital and largest city of France."
            },
            {
                question: "Which is the largest planet in our solar system?",
                choices: ["Mars", "Jupiter", "Saturn", "Venus"],
                correct: 1,
                explanation: "Jupiter is the largest planet in our solar system."
            },
            {
                question: "Who wrote 'Romeo and Juliet'?",
                choices: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
                correct: 1,
                explanation: "Romeo and Juliet was written by William Shakespeare."
            },
            {
                question: "What is the largest ocean on Earth?",
                choices: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"],
                correct: 2,
                explanation: "The Pacific Ocean is the largest and deepest ocean on Earth."
            },
            {
                question: "Which country is known as the Land of the Rising Sun?",
                choices: ["China", "Japan", "Korea", "Vietnam"],
                correct: 1,
                explanation: "Japan is known as the Land of the Rising Sun."
            },
            {
                question: "What is the chemical symbol for gold?",
                choices: ["Ag", "Fe", "Au", "Cu"],
                correct: 2,
                explanation: "Au (Aurum in Latin) is the chemical symbol for gold."
            },
            {
                question: "Which is the smallest continent?",
                choices: ["Australia", "Europe", "Antarctica", "South America"],
                correct: 0,
                explanation: "Australia is the smallest continent by land area."
            },
            {
                question: "Who painted the Mona Lisa?",
                choices: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
                correct: 1,
                explanation: "The Mona Lisa was painted by Leonardo da Vinci in the early 16th century."
            },
            {
                question: "What is the largest mammal in the world?",
                choices: ["African Elephant", "Blue Whale", "Giraffe", "White Rhinoceros"],
                correct: 1,
                explanation: "The Blue Whale is the largest animal known to have ever existed."
            },
            {
                question: "Which planet is known as the Red Planet?",
                choices: ["Venus", "Mars", "Jupiter", "Saturn"],
                correct: 1,
                explanation: "Mars appears red due to iron oxide (rust) on its surface."
            }
        ]
    },
    science: {
        name: "Science",
        icon: "fa-flask",
        questions: [
            {
                question: "What is the hardest natural substance on Earth?",
                choices: ["Gold", "Iron", "Diamond", "Platinum"],
                correct: 2,
                explanation: "Diamond is the hardest natural substance on Earth."
            },
            {
                question: "What is the speed of light?",
                choices: ["299,792 km/s", "199,792 km/s", "399,792 km/s", "499,792 km/s"],
                correct: 0,
                explanation: "Light travels at approximately 299,792 kilometers per second in a vacuum."
            },
            {
                question: "What is the chemical formula for water?",
                choices: ["CO2", "H2O", "O2", "N2"],
                correct: 1,
                explanation: "Water's chemical formula is H2O, representing two hydrogen atoms and one oxygen atom."
            },
            {
                question: "What is the largest organ in the human body?",
                choices: ["Heart", "Brain", "Liver", "Skin"],
                correct: 3,
                explanation: "The skin is the largest organ in the human body."
            },
            {
                question: "What is the atomic number of Carbon?",
                choices: ["4", "6", "8", "12"],
                correct: 1,
                explanation: "Carbon has an atomic number of 6, meaning it has 6 protons in its nucleus."
            },
            {
                question: "Which gas do plants absorb from the atmosphere?",
                choices: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
                correct: 1,
                explanation: "Plants absorb carbon dioxide from the atmosphere during photosynthesis."
            },
            {
                question: "What is the unit of electric current?",
                choices: ["Volt", "Watt", "Ampere", "Ohm"],
                correct: 2,
                explanation: "The ampere (A) is the unit of electric current."
            },
            {
                question: "Which planet has the most moons?",
                choices: ["Jupiter", "Saturn", "Uranus", "Neptune"],
                correct: 1,
                explanation: "Saturn has the most known moons, with over 80 confirmed satellites."
            },
            {
                question: "What is the smallest unit of matter?",
                choices: ["Atom", "Molecule", "Cell", "Electron"],
                correct: 0,
                explanation: "The atom is the smallest unit of matter that retains the properties of an element."
            },
            {
                question: "What is the process by which plants make their food?",
                choices: ["Photosynthesis", "Respiration", "Digestion", "Absorption"],
                correct: 0,
                explanation: "Photosynthesis is the process by which plants convert light energy into chemical energy."
            }
        ]
    },
    history: {
        name: "History",
        icon: "fa-landmark",
        questions: [
            {
                question: "In which year did World War II end?",
                choices: ["1943", "1944", "1945", "1946"],
                correct: 2,
                explanation: "World War II ended in 1945 with the surrender of Germany and Japan."
            },
            {
                question: "Who was the first President of the United States?",
                choices: ["John Adams", "Thomas Jefferson", "George Washington", "Benjamin Franklin"],
                correct: 2,
                explanation: "George Washington was the first President of the United States."
            },
            {
                question: "Which empire was ruled by the Aztecs?",
                choices: ["Mexican", "Incan", "Mayan", "Roman"],
                correct: 0,
                explanation: "The Aztecs ruled an empire in central Mexico."
            },
            {
                question: "Who was the first woman to win a Nobel Prize?",
                choices: ["Marie Curie", "Mother Teresa", "Jane Addams", "Pearl Buck"],
                correct: 0,
                explanation: "Marie Curie was the first woman to win a Nobel Prize, winning in Physics in 1903."
            },
            {
                question: "Which year did the Berlin Wall fall?",
                choices: ["1987", "1988", "1989", "1990"],
                correct: 2,
                explanation: "The Berlin Wall fell in 1989, marking the end of the Cold War era."
            },
            {
                question: "Who wrote the 'I Have a Dream' speech?",
                choices: ["Malcolm X", "Martin Luther King Jr.", "John F. Kennedy", "Rosa Parks"],
                correct: 1,
                explanation: "Martin Luther King Jr. delivered his famous 'I Have a Dream' speech in 1963."
            },
            {
                question: "Which civilization built the pyramids?",
                choices: ["Roman", "Greek", "Egyptian", "Persian"],
                correct: 2,
                explanation: "The ancient Egyptians built the pyramids as tombs for their pharaohs."
            },
            {
                question: "When did the American Civil War end?",
                choices: ["1863", "1864", "1865", "1866"],
                correct: 2,
                explanation: "The American Civil War ended in 1865 with the surrender of Confederate forces."
            },
            {
                question: "Who was the first Emperor of China?",
                choices: ["Qin Shi Huang", "Sun Yat-sen", "Kublai Khan", "Wu Zetian"],
                correct: 0,
                explanation: "Qin Shi Huang unified China and became its first Emperor in 221 BCE."
            },
            {
                question: "Which country was the first to reach the South Pole?",
                choices: ["United States", "Norway", "United Kingdom", "Russia"],
                correct: 1,
                explanation: "Norway, led by Roald Amundsen, reached the South Pole first in 1911."
            }
        ]
    },
    tech: {
        name: "Technology",
        icon: "fa-microchip",
        questions: [
            {
                question: "Who co-founded Apple Computer with Steve Jobs?",
                choices: ["Bill Gates", "Steve Wozniak", "Paul Allen", "Mark Zuckerberg"],
                correct: 1,
                explanation: "Steve Wozniak co-founded Apple Computer with Steve Jobs in 1976."
            },
            {
                question: "What does CPU stand for?",
                choices: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Computer Processing Unit"],
                correct: 0,
                explanation: "CPU stands for Central Processing Unit, the primary processor of a computer."
            },
            {
                question: "In what year was the first iPhone released?",
                choices: ["2005", "2006", "2007", "2008"],
                correct: 2,
                explanation: "The first iPhone was released by Apple in 2007."
            },
            {
                question: "What does 'HTTP' stand for?",
                choices: ["HyperText Transfer Protocol", "High Transfer Text Protocol", "HyperText Technical Protocol", "High Technical Transfer Protocol"],
                correct: 0,
                explanation: "HTTP stands for HyperText Transfer Protocol, the foundation of data communication on the web."
            },
            {
                question: "Which company owns Android?",
                choices: ["Apple", "Microsoft", "Google", "Samsung"],
                correct: 2,
                explanation: "Google owns Android, having acquired it in 2005."
            },
            {
                question: "What is the main function of RAM?",
                choices: ["Permanent Storage", "Temporary Storage", "Processing Data", "Displaying Graphics"],
                correct: 1,
                explanation: "RAM (Random Access Memory) provides temporary storage for data that's actively being used."
            },
            {
                question: "Who invented the World Wide Web?",
                choices: ["Tim Berners-Lee", "Bill Gates", "Steve Jobs", "Mark Zuckerberg"],
                correct: 0,
                explanation: "Tim Berners-Lee invented the World Wide Web in 1989."
            },
            {
                question: "What does 'URL' stand for?",
                choices: ["Universal Resource Locator", "Uniform Resource Locator", "Universal Reference Link", "Uniform Reference Link"],
                correct: 1,
                explanation: "URL stands for Uniform Resource Locator, the address of a web resource."
            },
            {
                question: "Which programming language is known as the 'mother of all languages'?",
                choices: ["Python", "Java", "C", "FORTRAN"],
                correct: 2,
                explanation: "C is often called the 'mother of all languages' as many modern languages are influenced by it."
            },
            {
                question: "What is the purpose of an IP address?",
                choices: ["Identify Devices", "Store Data", "Process Information", "Display Graphics"],
                correct: 0,
                explanation: "An IP address uniquely identifies devices on a network."
            }
        ]
    }
};

// DOM elements
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const endScreen = document.getElementById('end-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const questionEl = document.getElementById('question');
const choicesEl = document.getElementById('choices');
const timeEl = document.getElementById('time');
const scoreEl = document.getElementById('score');
const finalScoreEl = document.getElementById('final-score');
const progressBar = document.getElementById('progress-bar');
const currentQuestionEl = document.getElementById('current-question');
const totalQuestionsEl = document.getElementById('total-questions');
const resultMessageEl = document.getElementById('result-message');
const categoryBadgeEl = document.getElementById('current-category');
const categoryResultEl = document.getElementById('category-result');
const correctAnswersEl = document.getElementById('correct-answers');
const wrongAnswersEl = document.getElementById('wrong-answers');
const timeTakenEl = document.getElementById('time-taken');
const maxPossibleEl = document.getElementById('max-possible');
const difficultySelect = document.getElementById('difficulty');
const numQuestionsSelect = document.getElementById('num-questions');
const homeBtn = document.getElementById('home-btn');

// Quiz state
let currentQuestion = 0;
let score = 0;
let timeLeft = 60;
let timer = null;
let selectedCategory = null;
let questions = [];
let startTime = 0;
let correctAnswers = 0;
let wrongAnswers = 0;

// Initialize category cards
const categoryCards = document.querySelectorAll('.category-card');
categoryCards.forEach(card => {
    card.addEventListener('click', () => {
        // Remove selection from other cards
        categoryCards.forEach(c => c.classList.remove('selected'));
        // Select this card
        card.classList.add('selected');
        selectedCategory = card.dataset.category;
    });
});

// Get time limit based on difficulty
function getTimeLimit() {
    const difficulty = difficultySelect.value;
    switch(difficulty) {
        case 'easy': return 60;
        case 'medium': return 45;
        case 'hard': return 30;
        default: return 60;
    }
}

// Start quiz
function startQuiz() {
    if (!selectedCategory) {
        alert('Please select a category first!');
        return;
    }

    // Get selected number of questions
    const numQuestions = parseInt(numQuestionsSelect.value);
    
    // Get questions for selected category
    const categoryQuestions = quizData[selectedCategory].questions;
    
    // Shuffle and slice questions based on selected number
    questions = [...categoryQuestions]
        .sort(() => Math.random() - 0.5)
        .slice(0, numQuestions);

    startScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    
    // Reset quiz state
    currentQuestion = 0;
    score = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    timeLeft = getTimeLimit();
    startTime = Date.now();
    
    // Update UI
    scoreEl.textContent = score;
    timeEl.textContent = timeLeft;
    totalQuestionsEl.textContent = questions.length;
    maxPossibleEl.textContent = questions.length * 10;
    
    // Update category badge
    const category = quizData[selectedCategory];
    categoryBadgeEl.innerHTML = `
        <i class="fas ${category.icon}"></i>
        <span>${category.name}</span>
    `;
    
    loadQuestion();
    startTimer();
    updateProgressBar();
}

// Load question
function loadQuestion() {
    const question = questions[currentQuestion];
    currentQuestionEl.textContent = currentQuestion + 1;
    questionEl.textContent = question.question;
    
    choicesEl.innerHTML = '';
    question.choices.forEach((choice, index) => {
        const button = document.createElement('button');
        button.className = 'choice-btn';
        button.innerHTML = `${choice}`;  
        
        button.addEventListener('click', () => checkAnswer(index));
        
        // Add hover effect
        button.addEventListener('mouseover', () => {
            button.style.transform = 'translateX(10px)';
        });
        button.addEventListener('mouseout', () => {
            button.style.transform = 'translateX(0)';
        });
        
        choicesEl.appendChild(button);
    });
}

// Check answer
function checkAnswer(choiceIndex) {
    const correct = questions[currentQuestion].correct;
    const buttons = choicesEl.getElementsByClassName('choice-btn');
    
    // Disable all buttons
    Array.from(buttons).forEach(button => {
        button.disabled = true;
    });
    
    // Update correct/wrong answers count
    if (choiceIndex === correct) {
        correctAnswers++;
        score += 10;
        scoreEl.textContent = score;
        buttons[choiceIndex].classList.add('correct');
        // Add score animation
        scoreEl.style.transform = 'scale(1.2)';
        setTimeout(() => {
            scoreEl.style.transform = 'scale(1)';
        }, 200);
    } else {
        wrongAnswers++;
        buttons[choiceIndex].classList.add('wrong');
        buttons[correct].classList.add('correct');
    }
    
    // Show explanation
    const explanationDiv = document.createElement('div');
    explanationDiv.className = 'explanation';
    explanationDiv.textContent = questions[currentQuestion].explanation;
    explanationDiv.style.opacity = '0';
    choicesEl.appendChild(explanationDiv);
    
    // Fade in explanation
    setTimeout(() => {
        explanationDiv.style.opacity = '1';
    }, 100);
    
    // Move to next question after delay
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < questions.length) {
            loadQuestion();
            updateProgressBar();
        } else {
            endQuiz();
        }
    }, 2000);
}

// Update progress bar
function updateProgressBar() {
    const progress = (currentQuestion / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
}

// Start timer
function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timeEl.textContent = timeLeft;
        
        // Add pulse animation when time is low
        if (timeLeft <= 10) {
            timeEl.style.animation = 'pulse 1s infinite';
        }
        
        if (timeLeft <= 0) {
            endQuiz();
        }
    }, 1000);
}

// End quiz
function endQuiz() {
    clearInterval(timer);
    quizScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    const category = quizData[selectedCategory];
    
    // Update end screen
    finalScoreEl.textContent = score;
    categoryResultEl.textContent = `Category: ${category.name}`;
    correctAnswersEl.textContent = correctAnswers;
    wrongAnswersEl.textContent = wrongAnswers;
    timeTakenEl.textContent = timeTaken;
    
    // Set result message based on score
    let message = '';
    const percentage = (score / (questions.length * 10)) * 100;
    
    if (percentage === 100) {
        message = "Perfect score! You're a genius! 🎉";
    } else if (percentage >= 80) {
        message = "Excellent work! You're very knowledgeable! 🌟";
    } else if (percentage >= 60) {
        message = "Good job! Keep learning! 👍";
    } else if (percentage >= 40) {
        message = "Not bad! Room for improvement! 📚";
    } else {
        message = "Keep practicing! You'll do better next time! 💪";
    }
    
    resultMessageEl.textContent = message;
}

// Return to home screen
function goHome() {
    endScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    selectedCategory = null;
    categoryCards.forEach(card => card.classList.remove('selected'));
    // Reset progress bar
    progressBar.style.width = '0%';
    // Reset timer animation
    timeEl.style.animation = '';
}

// Event listeners
startBtn.addEventListener('click', startQuiz);
restartBtn.addEventListener('click', startQuiz);
homeBtn.addEventListener('click', goHome);

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (quizScreen.classList.contains('hidden')) return;
    
    const buttons = choicesEl.getElementsByClassName('choice-btn');
    if (buttons.length === 0 || buttons[0].disabled) return;
    
    if (e.key >= '1' && e.key <= '4') {
        const index = parseInt(e.key) - 1;
        if (index < buttons.length) {
            checkAnswer(index);
        }
    }
});
