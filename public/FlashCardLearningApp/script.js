let flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];

let reviewedCount = Number(localStorage.getItem("reviewedCount")) || 0;

let streak = Number(localStorage.getItem("streak")) || 0;

let studyCards = [];
let currentIndex = 0;

const form = document.getElementById("flashcardForm");
const subjectInput = document.getElementById("subject");
const questionInput = document.getElementById("question");
const answerInput = document.getElementById("answer");

const cardsContainer = document.getElementById("flashcardsContainer");

const searchInput = document.getElementById("searchInput");

const totalCardsEl = document.getElementById("totalCards");

const totalSubjectsEl = document.getElementById("totalSubjects");

const reviewedCardsEl = document.getElementById("reviewedCards");

const streakCountEl = document.getElementById("streakCount");

const progressFill = document.getElementById("progressFill");

const progressText = document.getElementById("progressText");

const achievements = document.getElementById("achievements");

const themeToggle = document.getElementById("themeToggle");

// Study Mode

const studyCard = document.getElementById("studyCard");

const studyFront = document.querySelector(".study-front");

const studyBack = document.querySelector(".study-back");

const startStudy = document.getElementById("startStudy");

const flipBtn = document.getElementById("flipBtn");

const nextBtn = document.getElementById("nextBtn");

const prevBtn = document.getElementById("prevBtn");

const shuffleBtn = document.getElementById("shuffleBtn");

const exportBtn = document.getElementById("exportBtn");

const importFile = document.getElementById("importFile");

function saveData() {
  localStorage.setItem("flashcards", JSON.stringify(flashcards));

  localStorage.setItem("reviewedCount", reviewedCount);

  localStorage.setItem("streak", streak);
}

function updateDashboard() {
  totalCardsEl.textContent = flashcards.length;

  const subjects = new Set(flashcards.map((card) => card.subject));

  totalSubjectsEl.textContent = subjects.size;

  reviewedCardsEl.textContent = reviewedCount;

  streakCountEl.textContent = streak + " Days";

  updateProgress();
  updateAchievements();
}

function updateProgress() {
  let percent = 0;

  if (flashcards.length > 0) {
    percent = Math.min(
      100,
      Math.round((reviewedCount / flashcards.length) * 100),
    );
  }

  progressFill.style.width = percent + "%";

  progressText.textContent = percent + "% Completed";
}

function updateAchievements() {
  achievements.innerHTML = "";

  const badges = [];

  badges.push("🎯 Beginner Learner");

  if (flashcards.length >= 10) badges.push("📚 10 Cards Created");

  if (flashcards.length >= 25) badges.push("🚀 25 Cards Master");

  if (reviewedCount >= 20) badges.push("🏆 Reviewer");

  if (streak >= 7) badges.push("🔥 7 Day Streak");

  if (streak >= 30) badges.push("👑 Consistency King");

  badges.forEach((item) => {
    const badge = document.createElement("div");

    badge.className = "badge";

    badge.textContent = item;

    achievements.appendChild(badge);
  });
}

function renderCards(cards = flashcards) {
  cardsContainer.innerHTML = "";

  if (!cards.length) {
    cardsContainer.innerHTML = `
      <h3>No Flashcards Found</h3>
    `;

    return;
  }

  cards.forEach((card, index) => {
    const div = document.createElement("div");

    div.className = "flashcard";

    div.innerHTML = `
    
      <span class="subject-tag">
        ${card.subject}
      </span>

      <h4>
        ${card.question}
      </h4>

      <p>
        ${card.answer}
      </p>

      <div class="card-actions">

        <button
          class="edit-btn"
          onclick="editCard(${index})"
        >
          Edit
        </button>

        <button
          class="delete-btn"
          onclick="deleteCard(${index})"
        >
          Delete
        </button>

      </div>
    
    `;

    cardsContainer.appendChild(div);
  });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const card = {
    subject: subjectInput.value,

    question: questionInput.value.trim(),

    answer: answerInput.value.trim(),
  };

  flashcards.push(card);

  saveData();
  renderCards();
  updateDashboard();

  form.reset();
});

function deleteCard(index) {
  if (confirm("Delete this flashcard?")) {
    flashcards.splice(index, 1);

    saveData();
    renderCards();
    updateDashboard();
  }
}

function editCard(index) {
  const card = flashcards[index];

  const question = prompt("Edit Question", card.question);

  if (question === null) return;

  const answer = prompt("Edit Answer", card.answer);

  if (answer === null) return;

  card.question = question;
  card.answer = answer;

  saveData();
  renderCards();
}

searchInput.addEventListener("input", function () {
  const term = this.value.toLowerCase();

  const filtered = flashcards.filter(
    (card) =>
      card.question.toLowerCase().includes(term) ||
      card.answer.toLowerCase().includes(term) ||
      card.subject.toLowerCase().includes(term),
  );

  renderCards(filtered);
});

function loadStudyCard() {
  if (studyCards.length === 0) {
    studyFront.textContent = "No Flashcards Available";

    studyBack.textContent = "Create some cards first";

    return;
  }

  const card = studyCards[currentIndex];

  studyFront.textContent = card.question;

  studyBack.textContent = card.answer;

  studyCard.classList.remove("flipped");
}

startStudy.addEventListener("click", function () {
  if (flashcards.length === 0) {
    alert("Add some flashcards first!");

    return;
  }

  studyCards = [...flashcards];

  currentIndex = 0;

  streak++;

  reviewedCount++;

  saveData();

  updateDashboard();

  loadStudyCard();
});

flipBtn.addEventListener("click", function () {
  studyCard.classList.toggle("flipped");
});

studyCard.addEventListener("click", function () {
  studyCard.classList.toggle("flipped");
});

nextBtn.addEventListener("click", function () {
  if (studyCards.length === 0) return;

  currentIndex++;

  if (currentIndex >= studyCards.length) {
    currentIndex = 0;
  }

  reviewedCount++;

  saveData();

  updateDashboard();

  loadStudyCard();
});

prevBtn.addEventListener("click", function () {
  if (studyCards.length === 0) return;

  currentIndex--;

  if (currentIndex < 0) {
    currentIndex = studyCards.length - 1;
  }

  loadStudyCard();
});

shuffleBtn.addEventListener("click", function () {
  if (studyCards.length === 0) return;

  studyCards.sort(() => Math.random() - 0.5);

  currentIndex = 0;

  loadStudyCard();
});

exportBtn.addEventListener("click", function () {
  const blob = new Blob([JSON.stringify(flashcards, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download = "flashcards.json";

  a.click();

  URL.revokeObjectURL(url);
});

importFile.addEventListener("change", function (e) {
  const file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (event) {
    try {
      const imported = JSON.parse(event.target.result);

      if (Array.isArray(imported)) {
        flashcards = imported;

        saveData();

        renderCards();

        updateDashboard();

        alert("Import Successful!");
      }
    } catch {
      alert("Invalid JSON File");
    }
  };

  reader.readAsText(file);
});

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");

  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", function () {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");

    themeToggle.textContent = "☀️";
  } else {
    localStorage.setItem("theme", "light");

    themeToggle.textContent = "🌙";
  }
});

renderCards();
updateDashboard();
