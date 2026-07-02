let flashcards = JSON.parse(localStorage.getItem("flashcards")) || [

{
    question:"What is HTML?",
    answer:"HyperText Markup Language"
},

{
    question:"Which HTML tag is used to create a hyperlink?",
    answer:"<a>"
},

{
    question:"Which HTML tag is used to insert an image?",
    answer:"<img>"
},

{
    question:"Which HTML element is used to create a form?",
    answer:"<form>"
},

{
    question:"Which HTML tag is used for the largest heading?",
    answer:"<h1>"
},

{
    question:"What is CSS?",
    answer:"Cascading Style Sheets"
},

{
    question:"Which CSS property changes the text color?",
    answer:"color"
},

{
    question:"Which CSS property changes the background color?",
    answer:"background-color"
},

{
    question:"Which CSS property is used to make corners rounded?",
    answer:"border-radius"
},

{
    question:"Which CSS property is used to align items horizontally in Flexbox?",
    answer:"justify-content"
},

{
    question:"Which keyword is used to declare a variable in JavaScript?",
    answer:"let"
},

{
    question:"Which function displays a popup message?",
    answer:"alert()"
},

{
    question:"Which method is used to select an element by its ID?",
    answer:"document.getElementById()"
},

{
    question:"Which event occurs when a button is clicked?",
    answer:"click"
},

{
    question:"Which object is used to store data in the browser permanently?",
    answer:"localStorage"
}

];

let currentIndex = 0;

const question=document.getElementById("question");
const answer=document.getElementById("answer");
const userAnswer=document.getElementById("userAnswer");
const result=document.getElementById("result");

const showBtn=document.getElementById("showBtn");
const checkBtn=document.getElementById("checkBtn");

const prevBtn=document.getElementById("prevBtn");
const nextBtn=document.getElementById("nextBtn");

const questionInput=document.getElementById("questionInput");
const answerInput=document.getElementById("answerInput");

const addBtn=document.getElementById("addBtn");
const editBtn=document.getElementById("editBtn");
const deleteBtn=document.getElementById("deleteBtn");

function saveCards(){

localStorage.setItem("flashcards",JSON.stringify(flashcards));

}

function displayCard(){

question.innerText=flashcards[currentIndex].question;

answer.innerText="Correct Answer: "+flashcards[currentIndex].answer;

answer.classList.add("hidden");

userAnswer.value="";

result.innerHTML="";

showBtn.innerText="Show Answer";

}

displayCard();

showBtn.onclick=function(){

if(answer.classList.contains("hidden")){

answer.classList.remove("hidden");

showBtn.innerText="Hide Answer";

}else{

answer.classList.add("hidden");

showBtn.innerText="Show Answer";

}

};

checkBtn.onclick=function(){

let user=userAnswer.value.trim().toLowerCase();

let correct=flashcards[currentIndex].answer.trim().toLowerCase();

if(user==""){

alert("Please type your answer.");

return;

}

if(user===correct){

result.innerHTML="✅ Correct!";

result.style.color="green";

}else{

result.innerHTML="❌ Incorrect!";

result.style.color="red";

}

};

nextBtn.onclick=function(){

currentIndex++;

if(currentIndex>=flashcards.length){

currentIndex=0;

}

displayCard();

};

prevBtn.onclick=function(){

currentIndex--;

if(currentIndex<0){

currentIndex=flashcards.length-1;

}

displayCard();

};

addBtn.onclick=function(){

let q=questionInput.value.trim();

let a=answerInput.value.trim();

if(q==""||a==""){

alert("Please enter question and answer.");

return;

}

flashcards.push({

question:q,

answer:a

});

saveCards();

questionInput.value="";

answerInput.value="";

currentIndex=flashcards.length-1;

displayCard();

};

editBtn.onclick=function(){

let q=questionInput.value.trim();

let a=answerInput.value.trim();

if(q==""||a==""){

alert("Please enter updated question and answer.");

return;

}

flashcards[currentIndex].question=q;

flashcards[currentIndex].answer=a;

saveCards();

displayCard();

questionInput.value="";

answerInput.value="";

};

deleteBtn.onclick=function(){

if(flashcards.length==1){

alert("At least one flashcard is required.");

return;

}

flashcards.splice(currentIndex,1);

if(currentIndex>=flashcards.length){

currentIndex=flashcards.length-1;

}

saveCards();

displayCard();

};