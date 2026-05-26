let score = 0;
let correctAnswer = 0;
let currentDifficulty = null;
let timerInterval = null;
let timeLeft = 30;

function startGame(difficulty) {
    currentDifficulty = difficulty;
    score = 0;
    if (difficulty === 'easy') timeLeft = 30;
    else if (difficulty === 'medium') timeLeft = 20;
    else timeLeft = 10;
    document.getElementById('score').innerText = '0';
    document.getElementById('timer').innerText = 'Time: ' + timeLeft + 's';
    document.getElementById('difficulty-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    document.getElementById('gameover-screen').style.display = 'none';
    generateQuestion();
    clearInterval(timerInterval);
    timerInterval = setInterval(tick, 1000);
}

function tick() {
    timeLeft--;
    document.getElementById('timer').innerText = 'Time: ' + timeLeft + 's';
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        gameOver();
    }
}

function gameOver() {
    const key = 'mathsQuizHighScore_' + currentDifficulty;
    const highScore = parseInt(localStorage.getItem(key) || 0);
    const newHighScore = Math.max(score, highScore);
    localStorage.setItem(key, newHighScore);
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('gameover-screen').style.display = 'block';
    document.getElementById('final-score').innerText = score;
    document.getElementById('final-high-score').innerText = newHighScore;
}

function backToMenu() {
    clearInterval(timerInterval);
    document.getElementById('gameover-screen').style.display = 'none';
    document.getElementById('difficulty-screen').style.display = 'block';
}
function restartQuiz() {

    let confirmRestart =
        confirm(
        "Are you sure?\nYour current score and progress will be lost."
        );

    if (!confirmRestart) {
        return;
    }

    clearInterval(timerInterval);

    score = 0;
    timeLeft = 0;
    correctAnswer = 0;
    currentDifficulty = null;

    document.getElementById('score').innerText = '0';

    document.getElementById('timer').innerText =
        'Time: 0s';

    document.getElementById('options-box').innerHTML =
        '';

    document.getElementById('question-box').innerText =
        'Loading question...';

    document.getElementById('game-screen').style.display =
        'none';

    document.getElementById('gameover-screen').style.display =
        'none';

    document.getElementById('difficulty-screen').style.display =
        'block';
}

function generateQuestion() {
    let num1, num2, answer, question;

    if (currentDifficulty === 'easy') {
        const ops = ['+', '-'];
        const op = ops[Math.floor(Math.random() * ops.length)];
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        if (op === '+') {
            answer = num1 + num2;
            question = 'What is ' + num1 + ' + ' + num2 + '?';
        } else {
            if (num1 < num2) { var t = num1; num1 = num2; num2 = t; }
            answer = num1 - num2;
            question = 'What is ' + num1 + ' - ' + num2 + '?';
        }
    } else if (currentDifficulty === 'medium') {
        const ops = ['×', '÷'];
        const op = ops[Math.floor(Math.random() * ops.length)];
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        if (op === '×') {
            answer = num1 * num2;
            question = 'What is ' + num1 + ' × ' + num2 + '?';
        } else {
            answer = num1;
            num1 = num1 * num2;
            question = 'What is ' + num1 + ' ÷ ' + num2 + '?';
        }
    } else {
        const ops = ['+', '-', '×', '÷'];
        const op = ops[Math.floor(Math.random() * ops.length)];
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        if (op === '+') {
            answer = num1 + num2;
            question = 'What is ' + num1 + ' + ' + num2 + '?';
        } else if (op === '-') {
            if (num1 < num2) { var t = num1; num1 = num2; num2 = t; }
            answer = num1 - num2;
            question = 'What is ' + num1 + ' - ' + num2 + '?';
        } else if (op === '×') {
            answer = num1 * num2;
            question = 'What is ' + num1 + ' × ' + num2 + '?';
        } else {
            answer = num1;
            num1 = num1 * num2;
            question = 'What is ' + num1 + ' ÷ ' + num2 + '?';
        }
    }

    correctAnswer = answer;
    document.getElementById('question-box').innerText = question;

    let options = [answer];
    while (options.length < 4) {
        let wrong;
        if (currentDifficulty === 'easy') {
            wrong = Math.floor(Math.random() * 20) + 1;
        } else if (currentDifficulty === 'medium') {
            wrong = (Math.floor(Math.random() * 10) + 1) * (Math.floor(Math.random() * 10) + 1);
        } else {
            wrong = (Math.floor(Math.random() * 20) + 1) * (Math.floor(Math.random() * 20) + 1);
        }
        if (!options.includes(wrong)) options.push(wrong);
    }
    options.sort(function() { return Math.random() - 0.5; });

    const optionsBox = document.getElementById('options-box');
    optionsBox.innerHTML = '';
    options.forEach(function(opt) {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.onclick = function() { checkAnswer(opt); };
        optionsBox.appendChild(btn);
    });
}

function checkAnswer(selected) {
    if (selected === correctAnswer) {
        score += 10;
        timeLeft += 10;
        document.getElementById('score').innerText = score;
    } else {
        timeLeft -= 2;
    }
    document.getElementById('timer').innerText = 'Time: ' + timeLeft + 's';
    generateQuestion();
}