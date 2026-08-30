/* =========================================
   GROQ AI CONFIG
========================================= */

const GROQ_API_KEY = "YOUR_GROQ_API_KEY";

const GROQ_URL =
  "https://api.groq.com/openai/v1/chat/completions";

/* =========================================
   DOM ELEMENTS
========================================= */

const aiInput =
  document.getElementById("aiInput");

const sendAiMessage =
  document.getElementById("sendAiMessage");

const aiMessages =
  document.getElementById("aiMessages");

/* =========================================
   ADD MESSAGE
========================================= */

const addMessage = (message, type) => {
  const div = document.createElement("div");

  div.className = `ai-message ai-message--${type}`;

  div.textContent = message;

  aiMessages.appendChild(div);

  aiMessages.scrollTop =
    aiMessages.scrollHeight;
};

/* =========================================
   CALL GROQ AI
========================================= */

const askGroqAI = async (prompt) => {
  try {
    addMessage(prompt, "user");

    aiInput.value = "";

    const loadingDiv =
      document.createElement("div");

    loadingDiv.className =
      "ai-message ai-message--bot";

    loadingDiv.textContent =
      "⏳ Thinking...";

    aiMessages.appendChild(loadingDiv);

    const response = await fetch(GROQ_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        Authorization:
          `Bearer ${GROQ_API_KEY}`
      },

      body: JSON.stringify({
        model: "llama3-70b-8192",

        messages: [
          {
            role: "system",
            content:
              "You are FocusFlow AI, an expert productivity and study coach."
          },

          {
            role: "user",
            content: prompt
          }
        ],

        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(
        "Failed to get AI response."
      );
    }

    const data = await response.json();

    loadingDiv.remove();

    const aiReply =
      data.choices?.[0]?.message?.content ||
      "No response received.";

    addMessage(aiReply, "bot");

  } catch (error) {
    console.error(error);

    addMessage(
      "❌ Unable to connect to Groq AI.",
      "bot"
    );
  }
};

/* =========================================
   EVENT LISTENERS
========================================= */

sendAiMessage?.addEventListener(
  "click",
  () => {
    const prompt = aiInput.value.trim();

    if (!prompt) return;

    askGroqAI(prompt);
  }
);

aiInput?.addEventListener(
  "keypress",
  (event) => {
    if (event.key === "Enter") {
      const prompt =
        aiInput.value.trim();

      if (!prompt) return;

      askGroqAI(prompt);
    }
  }
);