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

document.getElementById("generate").addEventListener("click", generateContent);

document.addEventListener("DOMContentLoaded", async () => {
  await generateContent();
});

async function generateContent() {
  showLoading();
    const keyword = document
      .getElementById("keyword")
      .value
      .trim()
      .toLowerCase();

    let quote;
    let joke;

    if (personalizedContent[keyword]) {
      const data = personalizedContent[keyword];

      quote =
        data.quote[Math.floor(Math.random() * data.quote.length)];

      joke =
        data.joke[Math.floor(Math.random() * data.joke.length)];

    }
    else if (keyword) {
      quote = generatePersonalizedQuote(keyword);
      joke = generatePersonalizedJoke(keyword);
    } else {
      quote = await getRandomQuote();
      joke = await getRandomJoke();
    }
  hideLoading();

  document.getElementById("quote").innerText = quote;
  document.getElementById("joke").innerText = joke;

  updateShareLinks(quote, joke);
}

function generatePersonalizedQuote(topic) {
  const templates = [
    `The journey of mastering ${topic} begins with a single step.`,
    `Dedication to ${topic} is what separates the good from the great.`,
    `Those who pursue ${topic} with passion will always find a way.`,
    `Growth in ${topic} comes from embracing both success and failure.`,
    `The more you invest in ${topic}, the more it gives back to you.`
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

function generatePersonalizedJoke(topic) {
  const templates = [
    `Why did the ${topic} fan stay up all night? To get to the next level!`,
    `Me before learning about ${topic}: I know everything. Me after: I know nothing.`,
    `My relationship with ${topic} — complicated, but we make it work.`,
    `I told my friend I was getting serious about ${topic}. They said, "Good luck, it's a full-time job."`
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

const themeToggle = document.getElementById("theme-toggle");

if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light-theme");
  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");

  if (document.body.classList.contains("light-theme")) {
    localStorage.setItem("theme", "light");
    themeToggle.textContent = "☀️";
  } else {
    localStorage.setItem("theme", "dark");
    themeToggle.textContent = "🌙";
  }
});

function showLoading() {
  document.getElementById("loading").classList.remove("hidden");
}

function hideLoading() {
  document.getElementById("loading").classList.add("hidden");
}

async function getRandomQuote() {
  const quoteApiUrl = "https://api.freeapi.app/api/v1/public/quotes/quote/random";
  try {
    const response = await fetch(quoteApiUrl);
    if (response.ok) {
      const quoteData = await response.json();
      const quoteText = quoteData.data.content;
      const quoteAuthor = quoteData.data.author;
      return `"${quoteText}" - ${quoteAuthor}`;
    }
  } catch (error) {
    console.warn("Failed to fetch a quote from the API:", error);
  }

  const fallbackQuotes = [
    "The only way to do great work is to love what you do. -Steve Jobs",
    "Believe you can and you're halfway there. -Theodore Roosevelt",
    "Success is not final, failure is not fatal: It is the courage to continue that counts. -Winston Churchill",
    "In the middle of difficulty lies opportunity. -Albert Einstein",
    "Don't watch the clock; do what it does. Keep going. -Sam Levenson",
  ];
  return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
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
    console.warn("Failed to fetch a joke from the API:", error);
  }

  const fallbackJokes = [
    "Why don't scientists trust atoms? Because they make up everything!",
    "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    "Why don't skeletons fight each other? They don't have the guts.",
    "What do you call fake spaghetti? An impasta.",
  ];
  return fallbackJokes[Math.floor(Math.random() * fallbackJokes.length)];
}

function updateShareLinks(quote, joke) {
  const siteURL =
    "https://50-days-50-web-project.vercel.app/Quotely-Laughs/index.html";

  // X (Twitter) links
  document.getElementById("share-quote-x").href = 
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${quote} \n\nGenerated by Quotely Laughs.\nVisit site at ${siteURL}`)}`;

  document.getElementById("share-joke-x").href = 
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${joke} \n\nGenerated by Quotely Laughs.\nVisit site at ${siteURL}`)}`;

  // WhatsApp links
  document.getElementById("share-quote-whatsapp").href = 
    `https://wa.me/?text=${encodeURIComponent(`${quote} \n\nGenerated by Quotely Laughs.\nVisit site at ${siteURL}`)}`;

  document.getElementById("share-joke-whatsapp").href = 
    `https://wa.me/?text=${encodeURIComponent(`${joke} \n\nGenerated by Quotely Laughs.\nVisit site at ${siteURL}`)}`;

  // Facebook links
  document.getElementById("share-quote-facebook").href = 
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteURL)}&quote=${encodeURIComponent(quote)}`;

  document.getElementById("share-joke-facebook").href = 
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteURL)}&quote=${encodeURIComponent(joke)}`;

  // Copy to Clipboard buttons
  document.getElementById("copy-quote").onclick = () => {
    navigator.clipboard.writeText(quote).then(() => alert("Quote copied to clipboard!"));
  };

  document.getElementById("copy-joke").onclick = () => {
    navigator.clipboard.writeText(joke).then(() => alert("Joke copied to clipboard!"));
  };
}