let score = 0;
let correctAnswer = 0;

function generateQuestion() {
    const num1 = Math.floor(Math.random() * 12) + 1;
    const num2 = Math.floor(Math.random() * 12) + 1;
    correctAnswer = num1 * num2;
    
    document.getElementById('question-box').innerText = `What is ${num1} × ${num2}?`;
    
    let options = [correctAnswer];
    while(options.length < 4) {
        let wrong = (Math.floor(Math.random() * 12) + 1) * (Math.floor(Math.random() * 12) + 1);
        if(!options.includes(wrong)) options.push(wrong);
    }
    options.sort(() => Math.random() - 0.5);
    
    const optionsBox = document.getElementById('options-box');
    optionsBox.innerHTML = '';
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(opt);
        optionsBox.appendChild(btn);
    });
}

function checkAnswer(selected) {
    if(selected === correctAnswer) {
        score += 10;
        document.getElementById('score').innerText = score;
    }
    generateQuestion();
}

generateQuestion();