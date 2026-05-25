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

const chatToggle = document.getElementById("chat-toggle");
const chatbotBox = document.getElementById("chatbot-box");
const closeChat = document.getElementById("close-chat");

const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatMessages = document.getElementById("chat-messages");

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

// SEND MESSAGE FUNCTION
function formatResponse(text) {

  return text

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

  userMessage.textContent = message;

  chatMessages.appendChild(userMessage);

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

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
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

Help users with:
- travel destinations
- trip planning
- flights
- hotels
- budgeting
- tourism
- itineraries
- local food
- attractions
- travel tips

Response Rules:
- Use short paragraphs
- Use bullet points when useful
- Keep responses clean and readable
- Avoid huge text blocks
- Give practical suggestions
- Use friendly conversational tone
- Format itineraries clearly
- Use emojis occasionally for better UX

Keep answers concise but informative.`,
            },

            {
              role: "user",
              content: message,
            },
          ],
        }),
      },
    );

    const data = await response.json();

    loadingMessage.remove();

    // HANDLE API ERROR

    if (!data.choices) {
      const errorMessage = document.createElement("div");

      errorMessage.classList.add("bot-message");

      errorMessage.textContent = "Unable to get response right now.";

      chatMessages.appendChild(errorMessage);

      return;
    }

    // BOT RESPONSE

    const botMessage = document.createElement("div");

    botMessage.classList.add("bot-message");

    botMessage.innerHTML = formatResponse(data.choices[0].message.content);

    chatMessages.appendChild(botMessage);

    // AUTO SCROLL

    chatMessages.scrollTop = chatMessages.scrollHeight;
  } catch (error) {
    loadingMessage.textContent = "Error getting response.";

    console.error(error);
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
