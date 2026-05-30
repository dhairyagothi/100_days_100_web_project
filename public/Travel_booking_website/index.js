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
    const response = await fetch("http://localhost:5000/api/chat", {
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

    loadingMessage.remove();

    // BOT RESPONSE

    const botMessage = document.createElement("div");

    botMessage.classList.add("bot-message");

    botMessage.innerHTML = formatResponse(data.reply);

    chatMessages.appendChild(botMessage);

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

// ==========================================================================
// AUTHENTICATION ENGINE CONTROLLER (#3793)
// ==========================================================================
const AuthController = {
  // Elements targeting our updated DOM structural layouts
  signUpBtn: document.getElementById("signUpBtn"),
  authModal: document.getElementById("authModal"),
  closeModalBtn: document.getElementById("closeModalBtn"),
  signUpForm: document.getElementById("signUpForm"),
  emailInput: document.getElementById("regEmail"),
  passwordInput: document.getElementById("regPassword"),

  init() {
    if (!this.signUpBtn || !this.authModal) return; // Guard clause against missing DOM nodes
    this.bindEvents();
    this.checkExistingSession();
  },

  bindEvents() {
    // Open/Close Actions
    this.signUpBtn.addEventListener("click", () => this.toggleModal(true));
    this.closeModalBtn.addEventListener("click", () => this.toggleModal(false));
    
    // Backdrop click container event delegation
    this.authModal.addEventListener("click", (e) => {
      if (e.target === this.authModal) this.toggleModal(false);
    });

    // Handle authentication form submissions
    this.signUpForm.addEventListener("submit", (e) => this.handleRegistration(e));
  },

  toggleModal(show) {
    if (show) {
      this.authModal.classList.remove("hidden");
      this.authModal.setAttribute("aria-hidden", "false");
    } else {
      this.authModal.classList.add("hidden");
      this.authModal.setAttribute("aria-hidden", "true");
      this.signUpForm.reset();
      this.clearErrors();
    }
  },

  validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  clearErrors() {
    document.getElementById("emailError").textContent = "";
    document.getElementById("passwordError").textContent = "";
  },

  checkExistingSession() {
    const session = localStorage.getItem("user_session");
    if (session) {
      try {
        const userData = JSON.parse(session);
        if (userData && userData.authenticated) {
          this.signUpBtn.textContent = "Profile";
        }
      } catch (e) {
        localStorage.removeItem("user_session");
      }
    }
  },

  async handleRegistration(e) {
    e.preventDefault();
    this.clearErrors();

    const email = this.emailInput.value.trim();
    const password = this.passwordInput.value;
    let isValid = true;

    // Rigid pattern constraint processing
    if (!this.validateEmail(email)) {
      document.getElementById("emailError").textContent = "Please enter a valid email structure.";
      isValid = false;
    }
    if (password.length < 8) {
      document.getElementById("passwordError").textContent = "Security validation error: Password must be ≥ 8 characters.";
      isValid = false;
    }

    if (!isValid) return;

    // Micro-interaction asynchronous execution state updates
    const submitBtn = document.getElementById("submitAuthBtn");
    const btnText = submitBtn.querySelector(".btn-text");
    const spinner = submitBtn.querySelector(".spinner");

    submitBtn.disabled = true;
    if (btnText) btnText.style.opacity = "0.5";
    if (spinner) spinner.classList.remove("hidden");

    try {
      // Emulating a real network wire connection latency delay
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Persist user context profile state in local machine cache
      localStorage.setItem("user_session", JSON.stringify({ email, authenticated: true }));
      
      const successBanner = document.getElementById("authSuccessMsg");
      if (successBanner) {
        successBanner.textContent = "Account successfully registered! Welcome to FlyTravel.";
        successBanner.classList.remove("hidden");
      }

      setTimeout(() => {
        this.toggleModal(false);
        if (successBanner) successBanner.classList.add("hidden");
        this.signUpBtn.textContent = "Profile";
      }, 1500);

    } catch (err) {
      document.getElementById("emailError").textContent = "Internal engine processing exception error.";
    } finally {
      submitBtn.disabled = false;
      if (btnText) btnText.style.opacity = "1";
      if (spinner) spinner.classList.add("hidden");
    }
  }
};

// Defensive Initialization Routine
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => AuthController.init());
} else {
  AuthController.init();
}
