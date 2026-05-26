const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");

menuBtn.addEventListener("click", (e) => {
  navLinks.classList.toggle("open");

  const isOpen = navLinks.classList.contains("open");
  menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
});

navLinks.addEventListener("click", (e) => {
  navLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-line");
});

const bookingType = document.getElementById("booking-type");

bookingType.addEventListener("click", (e) => {
  if (e.target !== bookingType) {
    Array.from(bookingType.getElementsByTagName("div")).forEach((item) => {
      item.classList.remove("active");
    });
    e.target.classList.add("active");
  }
});

const swiper = new Swiper(".swiper", {
  slidesPerView: "auto",
  spaceBetween: 20,
});

const scrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};

// header container
ScrollReveal().reveal(".header_container h1", {
  ...scrollRevealOption,
});

ScrollReveal().reveal(".header_container p", {
  ...scrollRevealOption,
  delay: 500,
});

ScrollReveal().reveal(".header_container .booking", {
  ...scrollRevealOption,
  delay: 1000,
});

// service container
ScrollReveal().reveal(".service_card", {
  duration: 1000,
  interval: 500,
});

// offer container
ScrollReveal().reveal(".offer_card", {
  ...scrollRevealOption,
  interval: 500,
});

const faqItems = document.querySelectorAll(".faq_item");

faqItems.forEach(item => {
  const question = item.querySelector(".faq_question");

  question.addEventListener("click", () => {
    item.classList.toggle("active");
  });
// ================= CHATBOT =================

// ================= CHATBOT =================

const chatToggle = document.getElementById("chat-toggle");
const chatbotBox = document.getElementById("chatbot-box");
const closeChat = document.getElementById("close-chat");
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatMessages = document.getElementById("chat-messages");

// ---- STORAGE HELPERS ----
const STORAGE_KEY = "flytravel_chat_history";

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch { return []; }
}

function saveHistory(history) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

let chatHistory = loadHistory();

// ---- RENDER SAVED MESSAGES ON PAGE LOAD ----
function renderHistory() {
  chatMessages.innerHTML = `
    <div class="bot-message">
      Hi! 👋<br>Ask me anything about destinations, hotels, flights, or travel planning.
    </div>`;
  chatHistory.forEach(({ role, text, time }) => {
    const div = document.createElement("div");
    div.classList.add(role === "user" ? "user-message" : "bot-message");
    div.innerHTML = `${role === "bot" ? formatResponse(text) : escapeHTML(text)}
      <div class="msg-timestamp">${time}</div>`;
    chatMessages.appendChild(div);
  });
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function escapeHTML(str) {
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function getTimestamp() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

renderHistory();

// ---- OPEN / CLOSE ----
chatToggle.addEventListener("click", () => {
  chatbotBox.style.display = chatbotBox.style.display === "flex" ? "none" : "flex";
});

closeChat.addEventListener("click", () => {
  chatbotBox.style.display = "none";
});

// ---- CLEAR CHAT ----
document.getElementById("clear-chat-btn").addEventListener("click", () => {
  if (confirm("Delete entire chat history? This cannot be undone.")) {
    chatHistory = [];
    localStorage.removeItem(STORAGE_KEY);
    renderHistory();
  }
});

// ---- EXPORT CHAT ----
document.getElementById("export-chat-btn").addEventListener("click", () => {
  if (chatHistory.length === 0) {
    alert("No conversation to export yet.");
    return;
  }
  const lines = chatHistory.map(({ role, text, time }) =>
    `[${time}] ${role === "user" ? "You" : "Travel AI"}: ${text}`
  );
  const blob = new Blob(
    ["FlyTravel Chat Export\n" + new Date().toLocaleString() + "\n\n" + lines.join("\n")],
    { type: "text/plain" }
  );
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "flytravel-chat.txt";
  a.click();
  URL.revokeObjectURL(a.href);
});

// ---- FORMAT & SEND ----
function formatResponse(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/^\* (.*$)/gim, "• $1")
    .replace(/\n/g, "<br>");
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (message === "") return;

  const time = getTimestamp();

  // User bubble
  const userDiv = document.createElement("div");
  userDiv.classList.add("user-message");
  userDiv.innerHTML = `${escapeHTML(message)}<div class="msg-timestamp">${time}</div>`;
  chatMessages.appendChild(userDiv);
  chatHistory.push({ role: "user", text: message, time });
  saveHistory(chatHistory);

  userInput.value = "";
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Loading bubble
  const loadingDiv = document.createElement("div");
  loadingDiv.classList.add("bot-message");
  loadingDiv.textContent = "Thinking...";
  chatMessages.appendChild(loadingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `You are Travel AI, a modern and friendly travel assistant.
Help users with travel destinations, trip planning, flights, hotels, budgeting, tourism, itineraries, local food, attractions, and travel tips.
Use short paragraphs, bullet points when useful, friendly tone, and occasional emojis.`,
          },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();
    loadingDiv.remove();

    const botTime = getTimestamp();
    const botText = data.choices?.[0]?.message?.content || "Unable to get response right now.";

    const botDiv = document.createElement("div");
    botDiv.classList.add("bot-message");
    botDiv.innerHTML = `${formatResponse(botText)}<div class="msg-timestamp">${botTime}</div>`;
    chatMessages.appendChild(botDiv);

    chatHistory.push({ role: "bot", text: botText, time: botTime });
    saveHistory(chatHistory);

    chatMessages.scrollTop = chatMessages.scrollHeight;
  } catch (error) {
    loadingDiv.textContent = "Error getting response.";
    console.error(error);
  }
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
