const defaultBank = {
    webdev: [
        { question: "What is HTML?", answer: "HyperText Markup Language" },
        { question: "Which HTML tag is used to create a hyperlink?", answer: "<a>" },
        { question: "Which CSS property changes the text color?", answer: "color" },
        { question: "Which HTML tag is used to insert an image?", answer: "<img>" },
        { question: "What does CSS stand for?", answer: "Cascading Style Sheets" },
        { question: "Which JavaScript method is used to write text directly into the console?", answer: "console.log()" },
        { question: "Which HTML element is used to define the title of a document?", answer: "<title>" },
        { question: "Which CSS property controls the text size?", answer: "font-size" },
        { question: "What is the correct HTML element for the largest heading?", answer: "<h1>" },
        { question: "Which HTML attribute specifies an alternate text for an image?", answer: "alt" }
    ],
    dbms: [
        { question: "What is DBMS?", answer: "Database Management System" },
        { question: "What does SQL stand for?", answer: "Structured Query Language" },
        { question: "What is a primary key?", answer: "A unique identifier for a record" },
        { question: "What does ACID stand for in database systems?", answer: "Atomicity Consistency Isolation Durability" },
        { question: "Which SQL constraint ensures that all values in a column are different?", answer: "UNIQUE" },
        { question: "What is a foreign key?", answer: "A field that links two tables together" },
        { question: "Which SQL command is used to remove all records from a table without removing the structure?", answer: "TRUNCATE" },
        { question: "What type of join returns all rows when there is a match in either left or right table?", answer: "FULL JOIN" },
        { question: "What is data redundancy?", answer: "The duplication of data across a database" },
        { question: "Which SQL clause is used to filter groups based on aggregate functions?", answer: "HAVING" }
    ],
    cn: [
        { question: "What does IP stand for?", answer: "Internet Protocol" },
        { question: "Which layer of OSI model is responsible for routing?", answer: "Network Layer" },
        { question: "What is the default port for HTTP?", answer: "80" },
        { question: "What does DNS stand for?", answer: "Domain Name System" },
        { question: "Which protocol is used for securely transmitting data over the web?", answer: "HTTPS" },
        { question: "What is the default port for HTTPS?", answer: "443" },
        { question: "How many layers are there in the standard OSI model?", answer: "7" },
        { question: "What does MAC stand for in MAC address?", answer: "Media Access Control" },
        { question: "Which transport layer protocol is connectionless and faster than TCP?", answer: "UDP" },
        { question: "What is the primary function of a router?", answer: "To forward data packets between computer networks" }
    ],
    os: [
        { question: "What is an Operating System?", answer: "A system software that manages hardware and software resources" },
        { question: "What is a deadlock?", answer: "A situation where a set of processes are blocked because each holds a resource and waits for another" },
        { question: "What is virtual memory?", answer: "Memory management technique that uses secondary storage as additional RAM" },
        { question: "What is a process?", answer: "A program in execution" },
        { question: "What is a thread?", answer: "A lightweight process or basic unit of CPU utilization" },
        { question: "What is thrashing in OS?", answer: "A condition where the system spends more time swapping pages than executing processes" },
        { question: "What does GUI stand for?", answer: "Graphical User Interface" },
        { question: "What is a kernel?", answer: "The core component of an operating system that manages system operations" },
        { question: "Which scheduling algorithm allocates the CPU to the process that requests it first?", answer: "First-Come First-Served" },
        { question: "What is a semaphore?", answer: "An integer variable used to solve the critical section problem and synchronize processes" }
    ],
    dsa: [
        { question: "What is a Stack?", answer: "A Last-In-First-Out linear data structure" },
        { question: "What is the time complexity of binary search?", answer: "O(log n)" },
        { question: "Which data structure uses FIFO?", answer: "Queue" },
        { question: "What is the worst-case time complexity of Bubble Sort?", answer: "O(n^2)" },
        { question: "Which data structure relies on a key-value pairing mechanism?", answer: "Hash Table" },
        { question: "What is the time complexity of searching for an item in a balanced Binary Search Tree?", answer: "O(log n)" },
        { question: "Which algorithm design technique does Quick Sort use?", answer: "Divide and Conquer" },
        { question: "What is a linear data structure that allows elements to be added or removed from both ends?", answer: "Deque" },
        { question: "What is the best-case time complexity of Merge Sort?", answer: "O(n log n)" },
        { question: "Which node is the topmost node of a tree data structure?", answer: "Root node" }
    ]
};
let currentSubject = "webdev";
let flashcards = JSON.parse(localStorage.getItem(`flashcards_${currentSubject}`)) || defaultBank[currentSubject];
let currentIndex = 0;
const question = document.getElementById("question");
const answer = document.getElementById("answer");
const userAnswer = document.getElementById("userAnswer");
const result = document.getElementById("result");
const showBtn = document.getElementById("showBtn");
const checkBtn = document.getElementById("checkBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const questionInput = document.getElementById("questionInput");
const answerInput = document.getElementById("answerInput");
const addBtn = document.getElementById("addBtn");
const editBtn = document.getElementById("editBtn");
const deleteBtn = document.getElementById("deleteBtn");
const appTitle = document.getElementById("appTitle");
const navTabs = document.querySelectorAll(".nav-tab");
function saveCards() {
    localStorage.setItem(`flashcards_${currentSubject}`, JSON.stringify(flashcards));
}
function displayCard() {
    if (!flashcards || flashcards.length === 0) {
        question.innerText = "No flashcards available for this subject.";
        answer.innerText = "";
        answer.classList.add("hidden");
        userAnswer.value = "";
        result.innerHTML = "";
        return;
    }
    question.innerText = flashcards[currentIndex].question;
    answer.innerText = "Correct Answer: " + flashcards[currentIndex].answer;
    answer.classList.add("hidden");
    userAnswer.value = "";
    result.innerHTML = "";
    showBtn.innerText = "Show Answer";
}
function switchSubject(subjectKey, tabElement) {
    navTabs.forEach(tab => tab.classList.remove("active"));
    tabElement.classList.add("active");
    currentSubject = subjectKey;
    flashcards = JSON.parse(localStorage.getItem(`flashcards_${currentSubject}`)) || defaultBank[currentSubject];
    currentIndex = 0;
    appTitle.innerText = `FLASHCARD QUIZ - ${tabElement.innerText.toUpperCase()}`;
    displayCard();
}
navTabs.forEach(tab => {
    tab.addEventListener("click", (e) => {
        switchSubject(e.target.getAttribute("data-subject"), e.target);
    });
});
showBtn.onclick = function() {
    if (flashcards.length === 0) return;
    if (answer.classList.contains("hidden")) {
        answer.classList.remove("hidden");
        showBtn.innerText = "Hide Answer";
    } else {
        answer.classList.add("hidden");
        showBtn.innerText = "Show Answer";
    }
};
checkBtn.onclick = function() {
    if (flashcards.length === 0) return;
    let user = userAnswer.value.trim().toLowerCase();
    let correct = flashcards[currentIndex].answer.trim().toLowerCase();
    if (user == "") {
        alert("Please type your answer.");
        return;
    }
    if (user === correct) {
        result.innerHTML = "✅ Correct!";
        result.style.color = "green";
    } else {
        result.innerHTML = "❌ Incorrect!";
        result.style.color = "red";
    }
};
nextBtn.onclick = function() {
    if (flashcards.length === 0) return;
    currentIndex++;
    if (currentIndex >= flashcards.length) {
        currentIndex = 0;
    }
    displayCard();
};
prevBtn.onclick = function() {
    if (flashcards.length === 0) return;
    currentIndex--;
    if (currentIndex < 0) {
        currentIndex = flashcards.length - 1;
    }
    displayCard();
};
addBtn.onclick = function() {
    let q = questionInput.value.trim();
    let a = answerInput.value.trim();
    if (q == "" || a == "") {
        alert("Please enter question and answer.");
        return;
    }
    flashcards.push({ question: q, answer: a });
    saveCards();
    questionInput.value = "";
    answerInput.value = "";
    currentIndex = flashcards.length - 1;
    displayCard();
};
editBtn.onclick = function() {
    if (flashcards.length === 0) return;
    let q = questionInput.value.trim();
    let a = answerInput.value.trim();
    if (q == "" || a == "") {
        alert("Please enter updated question and answer.");
        return;
    }
    flashcards[currentIndex].question = q;
    flashcards[currentIndex].answer = a;
    saveCards();
    displayCard();
    questionInput.value = "";
    answerInput.value = "";
};
deleteBtn.onclick = function() {
    if (flashcards.length === 0) return;
    flashcards.splice(currentIndex, 1);
    if (currentIndex >= flashcards.length) {
        currentIndex = flashcards.length - 1;
    }
    saveCards();
    displayCard();
};
switchSubject("webdev", document.querySelector('[data-subject="webdev"]'));