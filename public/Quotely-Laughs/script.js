const personalizedContent = {
  coding: {
    quote: [
      "Code is like humor. When you have to explain it, it's bad.",
      "First solve the problem, then write the code."
    ],
    joke: [
      "Why do programmers prefer dark mode? Because light attracts bugs!",
      "A programmer's wife tells him: Go to the store and buy a loaf of bread. If they have eggs, buy a dozen. He comes home with 12 loaves."
    ]
  },

  college: {
    quote: [
      "College is the place where dreams begin to take shape.",
      "Learning never exhausts the mind."
    ],
    joke: [
      "I studied all night for the exam. The exam studied something else.",
      "My attendance and my grades are playing hide and seek."
    ]
  },

  exams: {
    quote: [
      "Success is the sum of small efforts repeated every day.",
      "Preparation is the key to confidence."
    ],
    joke: [
      "My exam paper and I had a lot in common. We were both blank.",
      "Exams are temporary, screenshots are forever."
    ]
  }
};

/* ==========================
   DOM ELEMENTS
========================== */

const generateBtn = document.getElementById("generate");
const quoteElement = document.getElementById("quote");
const jokeElement = document.getElementById("joke");
const keywordInput = document.getElementById("keyword");

const themeToggle = document.getElementById("theme-toggle");

const historyBtn = document.getElementById("history-btn");
const historyPanel = document.getElementById("history-panel");
const historyList = document.getElementById("history-list");
const closeHistory = document.getElementById("close-history");

const copyQuoteBtn = document.getElementById("copy-quote");
const copyJokeBtn = document.getElementById("copy-joke");

const favoriteQuoteBtn = document.getElementById("favorite-quote");
const favoriteJokeBtn = document.getElementById("favorite-joke");

const counterElement = document.getElementById("counter");

/* ==========================
   LOCAL STORAGE
========================== */

let historyData =
  JSON.parse(localStorage.getItem("quotelyHistory")) || [];

let favorites =
  JSON.parse(localStorage.getItem("quotelyFavorites")) || [];

let generationCount =
  parseInt(localStorage.getItem("quotelyCount")) || 0;

counterElement.textContent = generationCount;

/* ==========================
   INIT
========================== */

document.addEventListener("DOMContentLoaded", async () => {

  loadTheme();

  renderHistory();

  await generateContent();

});

/* ==========================
   EVENTS
========================== */

generateBtn.addEventListener("click", generateContent);

keywordInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    generateContent();
  }
});

historyBtn.addEventListener("click", () => {
  historyPanel.classList.add("active");
});

closeHistory.addEventListener("click", () => {
  historyPanel.classList.remove("active");
});

copyQuoteBtn.addEventListener("click", () => {
  copyToClipboard(quoteElement.innerText, "Quote copied!");
});

copyJokeBtn.addEventListener("click", () => {
  copyToClipboard(jokeElement.innerText, "Joke copied!");
});

favoriteQuoteBtn.addEventListener("click", () => {
  saveFavorite("quote", quoteElement.innerText);
});

favoriteJokeBtn.addEventListener("click", () => {
  saveFavorite("joke", jokeElement.innerText);
});

themeToggle.addEventListener("click", toggleTheme);

/* ==========================
   GENERATE CONTENT
========================== */

async function generateContent() {

  showLoading();

  const keyword =
    keywordInput.value.trim().toLowerCase();

  let quote;
  let joke;

  try {

    if (personalizedContent[keyword]) {

      const data = personalizedContent[keyword];

      quote =
        data.quote[
          Math.floor(Math.random() * data.quote.length)
        ];

      joke =
        data.joke[
          Math.floor(Math.random() * data.joke.length)
        ];

    } else if (keyword) {

      quote = generatePersonalizedQuote(keyword);
      joke = generatePersonalizedJoke(keyword);

    } else {

      quote = await getRandomQuote();
      joke = await getRandomJoke();

    }

    quoteElement.innerText = quote;
    jokeElement.innerText = joke;

    animateContent();

    updateShareLinks(quote, joke);

    saveToHistory(quote, joke);

    updateCounter();

  } catch (error) {

    console.error(error);

    quoteElement.innerText =
      "Something went wrong. Please try again.";

    jokeElement.innerText =
      "Something went wrong. Please try again.";

  } finally {

    hideLoading();

  }
}

/* ==========================
   PERSONALIZED CONTENT
========================== */

function generatePersonalizedQuote(topic) {

  const templates = [

    `The journey of mastering ${topic} begins with a single step.`,

    `Dedication to ${topic} is what separates the good from the great.`,

    `Those who pursue ${topic} with passion will always find a way.`,

    `Growth in ${topic} comes from embracing both success and failure.`,

    `The more you invest in ${topic}, the more it gives back to you.`

  ];

  return templates[
    Math.floor(Math.random() * templates.length)
  ];
}

function generatePersonalizedJoke(topic) {

  const templates = [

    `Why did the ${topic} fan stay up all night? To get to the next level!`,

    `Me before learning about ${topic}: I know everything. Me after: I know nothing.`,

    `My relationship with ${topic} — complicated, but we make it work.`,

    `I told my friend I was getting serious about ${topic}. They said, "Good luck, it's a full-time job."`

  ];

  return templates[
    Math.floor(Math.random() * templates.length)
  ];
}

/* ==========================
   API
========================== */

async function getRandomQuote() {

  const quoteApiUrl =
    "https://api.freeapi.app/api/v1/public/quotes/quote/random";

  try {

    const response = await fetch(quoteApiUrl);

    if (response.ok) {

      const quoteData = await response.json();

      return `"${quoteData.data.content}" — ${quoteData.data.author}`;

    }

  } catch (error) {

    console.warn("Quote API failed:", error);

  }

  const fallbackQuotes = [
    "Believe you can and you're halfway there. — Theodore Roosevelt",
    "Success is not final, failure is not fatal. — Winston Churchill",
    "The only way to do great work is to love what you do. — Steve Jobs",
    "In the middle of difficulty lies opportunity. — Albert Einstein",
    "Don't watch the clock; do what it does. Keep going. — Sam Levenson"
  ];

  return fallbackQuotes[
    Math.floor(Math.random() * fallbackQuotes.length)
  ];
}

async function getRandomJoke() {

  const jokeApiUrl =
    "https://v2.jokeapi.dev/joke/Programming,Spooky?blacklistFlags=political,racist,sexist&format=txt";

  try {

    const response = await fetch(jokeApiUrl);

    if (response.ok) {
      return await response.text();
    }

  } catch (error) {

    console.warn("Joke API failed:", error);

  }

  const fallbackJokes = [
    "Why don't scientists trust atoms? Because they make up everything!",
    "What do you call fake spaghetti? An impasta.",
    "Why don't skeletons fight? They don't have the guts.",
    "I told my wife she was drawing her eyebrows too high. She looked surprised."
  ];

  return fallbackJokes[
    Math.floor(Math.random() * fallbackJokes.length)
  ];
}

/* ==========================
   HISTORY
========================== */

function saveToHistory(quote, joke) {

  if (
    historyData.length > 0 &&
    historyData[0].quote === quote &&
    historyData[0].joke === joke
  ) {
    return;
  }

  historyData.unshift({
    quote,
    joke,
    date: new Date().toLocaleString()
  });

  if (historyData.length > 20) {
    historyData.pop();
  }

  localStorage.setItem(
    "quotelyHistory",
    JSON.stringify(historyData)
  );

  renderHistory();
}

function renderHistory() {

  if (!historyList) return;

  historyList.innerHTML = "";

  if (historyData.length === 0) {

    historyList.innerHTML =
      `<p style="opacity:.7">No history yet.</p>`;

    return;
  }

  historyData.forEach(item => {

    const div = document.createElement("div");

    div.className = "history-item";

    div.innerHTML = `
      <small>${item.date}</small>

      <p>
        <strong>Quote:</strong><br>
        ${item.quote}
      </p>

      <p>
        <strong>Joke:</strong><br>
        ${item.joke}
      </p>
    `;

    historyList.appendChild(div);

  });
}

/* ==========================
   FAVORITES
========================== */

function saveFavorite(type, content) {

  if (!content.trim()) return;

  const exists = favorites.some(
    item => item.content === content
  );

  if (exists) {

    showToast("Already in favorites ❤️");

    return;
  }

  favorites.push({
    type,
    content,
    date: new Date().toLocaleString()
  });

  localStorage.setItem(
    "quotelyFavorites",
    JSON.stringify(favorites)
  );

  showToast("Added to favorites ❤️");
}

/* ==========================
   COUNTER
========================== */

function updateCounter() {

  generationCount++;

  counterElement.textContent =
    generationCount;

  localStorage.setItem(
    "quotelyCount",
    generationCount
  );
}

/* ==========================
   SHARE LINKS
========================== */

function updateShareLinks(quote, joke) {

  const siteURL =
    window.location.href;

  const quoteText =
    `${quote}\n\nGenerated with Quotely Laughs\n${siteURL}`;

  const jokeText =
    `${joke}\n\nGenerated with Quotely Laughs\n${siteURL}`;

  document.getElementById(
    "share-quote-x"
  ).href =
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(quoteText)}`;

  document.getElementById(
    "share-joke-x"
  ).href =
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(jokeText)}`;
}

/* ==========================
   THEME
========================== */

function loadTheme() {

  const savedTheme =
    localStorage.getItem("theme");

  if (savedTheme === "light") {

    document.body.classList.add(
      "light-theme"
    );

    themeToggle.textContent = "☀️";

  } else {

    themeToggle.textContent = "🌙";

  }
}

function toggleTheme() {

  document.body.classList.toggle(
    "light-theme"
  );

  if (
    document.body.classList.contains(
      "light-theme"
    )
  ) {

    localStorage.setItem(
      "theme",
      "light"
    );

    themeToggle.textContent = "☀️";

  } else {

    localStorage.setItem(
      "theme",
      "dark"
    );

    themeToggle.textContent = "🌙";

  }
}

/* ==========================
   ANIMATION
========================== */

function animateContent() {

  quoteElement.classList.remove(
    "fade-in"
  );

  jokeElement.classList.remove(
    "fade-in"
  );

  void quoteElement.offsetWidth;

  quoteElement.classList.add(
    "fade-in"
  );

  jokeElement.classList.add(
    "fade-in"
  );
}

/* ==========================
   LOADING
========================== */

function showLoading() {

  document
    .getElementById("loading")
    .classList.remove("hidden");
}

function hideLoading() {

  document
    .getElementById("loading")
    .classList.add("hidden");
}

/* ==========================
   CLIPBOARD
========================== */

async function copyToClipboard(
  text,
  message
) {

  try {

    await navigator.clipboard.writeText(
      text
    );

    showToast(message);

  } catch (error) {

    console.error(error);

    showToast("Copy failed");

  }
}

/* ==========================
   TOAST
========================== */

function showToast(message) {

  const toast =
    document.createElement("div");

  toast.textContent = message;

  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.padding = "12px 18px";
  toast.style.borderRadius = "12px";
  toast.style.background = "#111827";
  toast.style.color = "white";
  toast.style.zIndex = "9999";
  toast.style.boxShadow =
    "0 10px 25px rgba(0,0,0,.25)";

  document.body.appendChild(toast);

  setTimeout(() => {

    toast.remove();

  }, 2500);
}
