const startButton = document.getElementById("start-btn");
const nextButton = document.getElementById("next-btn");

const questionContainerElement = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const scoreContainerElement = document.getElementById("score-container");
const scoreElement = document.getElementById("right-answer");

let shuffledQuestions, currentQuestionIndex;
let quizScore = 0;

startButton.addEventListener("click", startGame);
nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  setNextQuestion();
});

function startGame() {
  startButton.classList.add("hide");
  shuffledQuestions = questions.sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;
  questionContainerElement.classList.remove("hide");
  scoreContainerElement.classList.remove("hide");  // Show score container when quiz starts
  setNextQuestion();
  quizScore = 0;
  scoreElement.innerText = `Score: ${quizScore}`;  // Initialize score to zero
  scoreElement.classList.remove("correct");
  scoreElement.classList.remove("wrong");
}

function setNextQuestion() {
  resetState();
  showQuestion(shuffledQuestions[currentQuestionIndex]);
}

function showQuestion(question) {
  questionElement.innerText = question.question;
  question.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
    answerButtonsElement.appendChild(button);
  });
}

function resetState() {
  clearStatusClass(document.body);
  nextButton.classList.add("hide");
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }
}

function selectAnswer(e) {
  const selectedButton = e.target;
  const correct = selectedButton.dataset.correct;
  setStatusClass(document.body, correct);
  Array.from(answerButtonsElement.children).forEach((button) => {
    setStatusClass(button, button.dataset.correct);
  });
  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove("hide");
  } else {
    startButton.innerText = "Restart";
    startButton.classList.remove("hide");
  }
  if (correct) {
    quizScore++;
    scoreElement.innerText = `Correct! Score: ${quizScore}`;
    scoreElement.classList.add("correct");
    scoreElement.classList.remove("wrong");
  } else {
    scoreElement.innerText = `Wrong! Score: ${quizScore}`;
    scoreElement.classList.add("wrong");
    scoreElement.classList.remove("correct");
  }
}

function setStatusClass(element, correct) {
  clearStatusClass(element);
  if (correct) {
    element.classList.add("correct");
  } else {
    element.classList.add("wrong");
  }
}

function clearStatusClass(element) {
  element.classList.remove("correct");
  element.classList.remove("wrong");
}

const questions = [
  {
    question: "Which one of these is a JavaScript framework?",
    answers: [
      { text: "Python", correct: false },
      { text: "Djengo", correct: false },
      { text: "React", correct: true },
      { text: "Eclipse", correct: false },
    ],
  },
  {
    question: "Who is the Prime Minister of India?",
    answers: [
      { text: "Narendra Modi", correct: true },
      { text: "Rahul Gandhi", correct: false },
    ],
  },
  {
    question: "What is 4 * 3?",
    answers: [
      { text: "5", correct: false },
      { text: "12", correct: true },
    ],
  },
  {
    question: "What is the capital of France?",
    answers: [
      { text: "Berlin", correct: false },
      { text: "Madrid", correct: false },
      { text: "Paris", correct: true },
    ],
  },

  {
    question: "Which element has the chemical symbol 'O'?",
    answers: [
      { text: "Gold", correct: false },
      { text: "Silver", correct: false },
      { text: "Oxygen", correct: true },
      { text: "Hydrogen", correct: false },
    ],
  },

  {
    question: "Who won the FIFA World Cup in 2018?",
    answers: [
      { text: "Brazil", correct: false },
      { text: "Germany", correct: false },
      { text: "France", correct: true },
      { text: "Argentina", correct: false },
    ],
  },

  {
    question: "What sport is associated with Wimbledon?",
    answers: [
      { text: "Football", correct: false },
      { text: "Cricket", correct: false },
      { text: "Tennis", correct: true },
      { text: "Basketball", correct: false },
    ],
  },

  {
    question: "Who directed the movie Inception?",
    answers: [
      { text: "Quentin Tarantino", correct: false },
      { text: "Christopher Nolan", correct: true },
      { text: "Steven Spielberg", correct: false },
      { text: "Martin Scorsese", correct: false },
    ],
  },

  {
    question: "Which artist released the album Thriller?",
    answers: [
      { text: "Queen", correct: false },
      { text: "Michael Jackson", correct: true },
      { text: "The Beatles", correct: false },
      { text: "Pink Floyd", correct: false },
    ],
  },

];
