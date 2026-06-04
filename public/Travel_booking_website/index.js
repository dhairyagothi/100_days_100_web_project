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
});
// ================= CHATBOT =================

const chatToggle = document.getElementById("chat-toggle");
const chatbotBox = document.getElementById("chatbot-box");
const closeChat = document.getElementById("close-chat");

const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatMessages = document.getElementById("chat-messages");
const savedChat = localStorage.getItem("travel_chat");

if (savedChat) {
  chatMessages.innerHTML = savedChat;
}

// OPEN / CLOSE CHATBOT

chatToggle.addEventListener("click", () => {
  if (chatbotBox.style.display === "flex") {
    chatbotBox.style.display = "none";
  } else {
    chatbotBox.style.display = "flex";
  }
});

// CLOSE CHATBOT

closeChat.addEventListener("click", () => {
  chatbotBox.style.display = "none";
});

function getTime() {

  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

}

// SEND MESSAGE FUNCTION
function formatResponse(text) {
  // Security: Prevent XSS by HTML escaping the raw text before formatting
  const div = document.createElement("div");
  div.textContent = text;
  const escapedText = div.innerHTML;

  return escapedText
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

    // Bullet points
    .replace(/^\* (.*$)/gim, "• $1")

    // Line breaks
    .replace(/\n/g, "<br>");
}
async function sendMessage() {
  const message = userInput.value.trim();

  if (message === "") return;

  // USER MESSAGE

  const userMessage = document.createElement("div");

  userMessage.classList.add("user-message");

  userMessage.innerHTML = `
  ${message}
  <div class="msg-timestamp">${getTime()}</div>
`;

  chatMessages.appendChild(userMessage);
  localStorage.setItem(
  "travel_chat",
  chatMessages.innerHTML
);

  // CLEAR INPUT

  userInput.value = "";

  // AUTO SCROLL

  chatMessages.scrollTop = chatMessages.scrollHeight;

  // LOADING MESSAGE

  const loadingMessage = document.createElement("div");

  loadingMessage.classList.add("bot-message");

  loadingMessage.textContent = "Thinking...";

  chatMessages.appendChild(loadingMessage);


  chatMessages.scrollTop = chatMessages.scrollHeight;

  const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const chatEndpoint = isLocalhost ? "http://localhost:5000/api/chat" : "/api/chat";

  try {
    const response = await fetch(chatEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: message }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    let reply = "";
    if (data) {
      if (data.choices && Array.isArray(data.choices) && data.choices.length > 0 &&
          data.choices[0].message && typeof data.choices[0].message.content === "string") {
        reply = data.choices[0].message.content;
      } else if (typeof data.reply === "string") {
        reply = data.reply;
      }
    }

    if (!reply) {
      throw new Error("Invalid or empty response format from API");
    }

    loadingMessage.remove();

    // BOT RESPONSE

    const botMessage = document.createElement("div");

    botMessage.classList.add("bot-message");

    botMessage.innerHTML = `
  ${formatResponse(reply)}
  <div class="msg-timestamp">${getTime()}</div>
`;

    chatMessages.appendChild(botMessage);
    localStorage.setItem(
      "travel_chat",
      chatMessages.innerHTML
    );

    // AUTO SCROLL

    chatMessages.scrollTop = chatMessages.scrollHeight;
  } catch (error) {
    loadingMessage.textContent = "Error getting response.";

    console.error("Frontend Error:", error);
  }
}

// SEND BUTTON

sendBtn.addEventListener("click", sendMessage);

// ENTER KEY SUPPORT

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});


document
  .getElementById("export-chat")
  .addEventListener("click", () => {

    const blob = new Blob(
      [chatMessages.innerText],
      { type: "text/plain" }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "travel-chat.txt";

    a.click();

    URL.revokeObjectURL(url);
});
document
  .getElementById("clear-chat")
  .addEventListener("click", () => {

    if (confirm("Clear all chat history?")) {

      chatMessages.innerHTML = `
<div class="bot-message">
  Hi! 👋<br>
  Ask me anything about destinations, hotels, flights, or travel planning.
</div>
`;

      localStorage.removeItem("travel_chat");
    }
});
