document.addEventListener('DOMContentLoaded', () => {
    // 1. Expanded Database grouped by section
    const quizDatabase = {
        basic: [
            { question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Text Markup Language", "Hyper Tabular Markup Language", "None of these"], correctAnswer: "Hyper Text Markup Language" },
            { question: "What does CSS stand for?", options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"], correctAnswer: "Cascading Style Sheets" },
            { question: "Which HTML tag is used to define an internal style sheet?", options: ["<script>", "<style>", "<css>", "<link>"], correctAnswer: "<style>" },
            { question: "Which HTML attribute specifies an alternate text for an image, if the image cannot be displayed?", options: ["title", "src", "alt", "longdesc"], correctAnswer: "alt" },
            { question: "Choose the correct HTML element for the largest heading:", options: ["<heading>", "<h6>", "<head>", "<h1>"], correctAnswer: "<h1>" },
            { question: "How do you write 'Hello World' in an alert box?", options: ["msgBox('Hello World');", "alertBox('Hello World');", "msg('Hello World');", "alert('Hello World');"], correctAnswer: "alert('Hello World');" }
        ],
        intermediate: [
            { question: "Which built-in method returns the length of the string in JavaScript?", options: ["size()", "index()", "length()", "length"], correctAnswer: "length" },
            { question: "How do you create a function in JavaScript?", options: ["function:myFunction()", "function myFunction()", "function = myFunction()", "create myFunction()"], correctAnswer: "function myFunction()" },
            { question: "How to write an IF statement in JavaScript?", options: ["if i = 5", "if (i == 5)", "if i == 5 then", "if i = 5 then"], correctAnswer: "if (i == 5)" },
            { question: "Which CSS property controls the text size?", options: ["font-style", "text-size", "font-size", "text-style"], correctAnswer: "font-size" },
            { question: "How do you display hyperlinks without an underline?", options: ["a {text-decoration:none;}", "a {underline:none;}", "a {decoration:no-underline;}", "a {text-decoration:no-underline;}"], correctAnswer: "a {text-decoration:none;}" },
            { question: "Which method adds a new item to the end of an array and returns the new length?", options: ["shift()", "unshift()", "push()", "pop()"], correctAnswer: "push()" }
        ],
        advanced: [
            { question: "What does the 'this' keyword refer to in a regular function?", options: ["The function itself", "The global object", "The element that fired the event", "Undefined"], correctAnswer: "The global object" },
            { question: "Which of the following is not a valid CSS position property value?", options: ["static", "relative", "absolute", "floating"], correctAnswer: "floating" },
            { question: "What is the correct syntax for referring to an external script called 'xxx.js'?", options: ["<script href='xxx.js'>", "<script name='xxx.js'>", "<script src='xxx.js'>", "<script link='xxx.js'>"], correctAnswer: "<script src='xxx.js'>" },
            { question: "How do you declare a JavaScript variable that cannot be reassigned?", options: ["let", "var", "const", "static"], correctAnswer: "const" },
            { question: "What is the purpose of the Array.prototype.map() method?", options: ["To iterate and mutate the original array", "To create a new array with the results of calling a function on every element", "To filter out elements based on a condition", "To reduce the array to a single value"], correctAnswer: "To create a new array with the results of calling a function on every element" },
            { question: "In CSS Grid, what property is used to define the columns of the grid?", options: ["grid-columns", "grid-template-columns", "grid-layout-columns", "grid-wrap"], correctAnswer: "grid-template-columns" }
        ],
        miscellaneous: [
            { question: "Which protocol is used to secure data transfer on the web?", options: ["HTTP", "FTP", "HTTPS", "TCP"], correctAnswer: "HTTPS" },
            { question: "What is Git?", options: ["A programming language", "A framework", "A Version Control System", "A database"], correctAnswer: "A Version Control System" },
            { question: "Which company created React?", options: ["Google", "Facebook", "Twitter", "Microsoft"], correctAnswer: "Facebook" },
            { question: "What does API stand for?", options: ["Application Programming Interface", "Automated Program Integration", "Applied Process Integration", "Application Process Interface"], correctAnswer: "Application Programming Interface" },
            { question: "Which of the following is a NoSQL database?", options: ["MySQL", "PostgreSQL", "MongoDB", "Oracle"], correctAnswer: "MongoDB" },
            { question: "What is the default port for local HTTP servers like React/Node?", options: ["80", "443", "8080 or 3000", "21"], correctAnswer: "8080 or 3000" }
        ]
    };

    // 2. State Variables
    let currentQuizPool = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let timerInterval;
    const TIME_LIMIT = 60;

    // 3. DOM Elements
    const screens = {
        start: document.getElementById('start-screen'),
        quiz: document.getElementById('quiz-screen'),
        end: document.getElementById('end-screen')
    };

    const elements = {
        startBtn: document.getElementById('start-btn'),
        nextBtn: document.getElementById('next-btn'),
        restartBtn: document.getElementById('restart-btn'),
        categorySelect: document.getElementById('quiz-category'),
        countInput: document.getElementById('question-count'),
        countWarning: document.getElementById('count-warning'),
        questionText: document.getElementById('question-text'),
        optionsContainer: document.getElementById('options-container'),
        tracker: document.getElementById('question-tracker'),
        timeLeft: document.getElementById('time-left'),
        progressBar: document.getElementById('progress-bar'),
        finalScore: document.getElementById('final-score'),
        feedbackMsg: document.getElementById('feedback-message')
    };

    // Helper: Fisher-Yates Shuffle
    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // 4. Core Functions
    const switchScreen = (screenName) => {
        Object.values(screens).forEach(screen => {
            screen.classList.remove('active');
            screen.classList.add('hidden');
        });
        screens[screenName].classList.remove('hidden');
        screens[screenName].classList.add('active');
    };

    const initializeQuizData = () => {
        elements.countWarning.classList.add('hidden');
        const selectedCategory = elements.categorySelect.value;
        let requestedCount = parseInt(elements.countInput.value, 10);

        // Input Validation
        if (isNaN(requestedCount) || requestedCount < 5) {
            requestedCount = 5;
            elements.countInput.value = 5;
        }

        const categoryPool = quizDatabase[selectedCategory];

        // Prevent requesting more questions than available
        if (requestedCount > categoryPool.length) {
            requestedCount = categoryPool.length;
            elements.countInput.value = requestedCount;
            elements.countWarning.classList.remove('hidden');
        }

        // Shuffle and Slice
        const shuffledPool = shuffleArray(categoryPool);
        currentQuizPool = shuffledPool.slice(0, requestedCount);
    };

    const startQuiz = () => {
        initializeQuizData();
        currentQuestionIndex = 0;
        score = 0;
        switchScreen('quiz');
        loadQuestion();
    };

    const loadQuestion = () => {
        elements.nextBtn.classList.add('hidden');
        elements.optionsContainer.innerHTML = '';

        const currentData = currentQuizPool[currentQuestionIndex];
        elements.questionText.textContent = currentData.question;
        elements.tracker.textContent = `Question ${currentQuestionIndex + 1}/${currentQuizPool.length}`;

        // NEW: Update Progress Bar
        const progressPercentage = ((currentQuestionIndex + 1) / currentQuizPool.length) * 100;
        elements.progressBar.style.width = `${progressPercentage}%`;

        // Shuffle options so the correct answer isn't always in the same spot
        const shuffledOptions = shuffleArray(currentData.options);

        shuffledOptions.forEach(option => {
            const button = document.createElement('button');
            button.classList.add('option-btn');
            button.textContent = option;
            button.addEventListener('click', () => handleAnswer(button, option, currentData.correctAnswer));
            elements.optionsContainer.appendChild(button);
        });

        startTimer();
    };

    const startTimer = () => {
        clearInterval(timerInterval);
        let timeLeft = TIME_LIMIT;
        elements.timeLeft.textContent = timeLeft;

        timerInterval = setInterval(() => {
            timeLeft--;
            elements.timeLeft.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                handleTimeOut();
            }
        }, 1000);
    };

    const handleAnswer = (selectedButton, selectedAnswer, correctAnswer) => {
        clearInterval(timerInterval);
        const buttons = document.querySelectorAll('.option-btn');

        buttons.forEach(btn => btn.disabled = true);

        if (selectedAnswer === correctAnswer) {
            selectedButton.classList.add('correct');
            score++;
        } else {
            selectedButton.classList.add('incorrect');
            buttons.forEach(btn => {
                if (btn.textContent === correctAnswer) {
                    btn.classList.add('correct');
                }
            });
        }

        elements.nextBtn.classList.remove('hidden');
    };

    const handleTimeOut = () => {
        score--;
        const buttons = document.querySelectorAll('.option-btn');
        const correctAnswer = currentQuizPool[currentQuestionIndex].correctAnswer;

        buttons.forEach(btn => {
            btn.disabled = true;
            if (btn.textContent === correctAnswer) {
                btn.classList.add('correct');
            }
        });

        elements.nextBtn.classList.remove('hidden');
    };

    const handleNext = () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < currentQuizPool.length) {
            loadQuestion();
        } else {
            endQuiz();
        }
    };

    const endQuiz = () => {
        clearInterval(timerInterval);
        switchScreen('end');
        elements.finalScore.textContent = `${score} / ${currentQuizPool.length}`;

        const percentage = score / currentQuizPool.length;

        if (percentage === 1) {
            elements.feedbackMsg.textContent = "Perfect score! Outstanding job! 🏆";
        } else if (percentage >= 0.7) {
            elements.feedbackMsg.textContent = "Great effort! You know your stuff. 👍";
        } else if (percentage > 0) {
            elements.feedbackMsg.textContent = "Not bad, but room for improvement! 📚";
        } else {
            elements.feedbackMsg.textContent = "Ouch! Time to review the documentation. 🛠️";
        }
    };

    // 5. Event Listeners
    elements.startBtn.addEventListener('click', startQuiz);
    elements.nextBtn.addEventListener('click', handleNext);
    elements.restartBtn.addEventListener('click', () => switchScreen('start'));
});