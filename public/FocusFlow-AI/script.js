/* =========================================
   FOCUSFLOW AI SCRIPT
========================================= */

/* =========================================
   CONFIG
========================================= */

const GROQ_API_KEY = "YOUR_GROQ_API_KEY";

const GROQ_API_URL =
  "https://api.groq.com/openai/v1/chat/completions";

/* =========================================
   DOM ELEMENTS
========================================= */

const themeToggle =
  document.getElementById("themeToggle");

const generatePlanBtn =
  document.getElementById("generatePlanBtn");

const taskInput =
  document.getElementById("taskInput");

const aiOutput =
  document.getElementById("aiOutput");

const currentMonthBtn =
  document.getElementById("currentMonthBtn");

const prevMonthBtn =
  document.getElementById("prevMonthBtn");

const nextMonthBtn =
  document.getElementById("nextMonthBtn");

const calendarGrid =
  document.querySelector(".calendar-grid");

/* =========================================
   THEME TOGGLE
========================================= */

const applyTheme = (theme) => {
  try {
    if (theme === "light") {
      document.body.classList.add("light-mode");

      if (themeToggle) {
        themeToggle.textContent = "☀️";
      }

    } else {
      document.body.classList.remove("light-mode");

      if (themeToggle) {
        themeToggle.textContent = "🌙";
      }
    }

    localStorage.setItem(
      "focusflow-theme",
      theme
    );

  } catch (error) {
    console.error(
      "Failed to apply theme:",
      error
    );
  }
};

const initializeTheme = () => {
  try {
    const savedTheme =
      localStorage.getItem(
        "focusflow-theme"
      ) || "dark";

    applyTheme(savedTheme);

  } catch (error) {
    console.error(
      "Theme initialization failed:",
      error
    );
  }
};

themeToggle?.addEventListener(
  "click",
  () => {
    const isLightMode =
      document.body.classList.contains(
        "light-mode"
      );

    applyTheme(
      isLightMode ? "dark" : "light"
    );
  }
);

/* =========================================
   AI STUDY PLAN GENERATOR
========================================= */

const generateAIPlan = async () => {
  try {
    const userTasks =
      taskInput.value.trim();

    if (!userTasks) {
      aiOutput.innerHTML =
        `
        <p>
          Please enter your tasks or goals first.
        </p>
      `;
      return;
    }

    aiOutput.innerHTML =
      `
      <p>
        Generating your AI productivity plan...
      </p>
      `;

    const response = await fetch(
      GROQ_API_URL,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${GROQ_API_KEY}`
        },

        body: JSON.stringify({
          model: "llama3-8b-8192",

          messages: [
            {
              role: "system",

              content:
                `
                You are an AI productivity coach.
                Create structured productivity plans,
                focus strategies, Pomodoro schedules,
                and study routines.
                Keep responses clean and readable.
                `
            },

            {
              role: "user",
              content:
                `
                Create a detailed productivity plan
                for these tasks:

                ${userTasks}
                `
            }
          ],

          temperature: 0.7,
          max_tokens: 800
        })
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch AI response."
      );
    }

    const data =
      await response.json();

    const aiMessage =
      data?.choices?.[0]?.message?.content;

    if (!aiMessage) {
      throw new Error(
        "No AI response received."
      );
    }

    aiOutput.innerHTML =
      `
      <div class="ai-result">
        ${formatAIResponse(aiMessage)}
      </div>
      `;

  } catch (error) {
    console.error(
      "AI generation failed:",
      error
    );

    aiOutput.innerHTML =
      `
      <p>
        Failed to generate AI plan.
        Please check your API key
        or internet connection.
      </p>
      `;
  }
};

generatePlanBtn?.addEventListener(
  "click",
  generateAIPlan
);

/* =========================================
   FORMAT AI RESPONSE
========================================= */

const formatAIResponse = (
  text
) => {
  try {
    return text
      .replace(/\n/g, "<br>")
      .replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
      );

  } catch (error) {
    console.error(
      "Formatting failed:",
      error
    );

    return text;
  }
};

/* =========================================
   CALENDAR
========================================= */

let currentDate =
  new Date();

const renderCalendar = () => {
  try {
    if (!calendarGrid) return;

    const year =
      currentDate.getFullYear();

    const month =
      currentDate.getMonth();

    const today =
      new Date();

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    currentMonthBtn.textContent =
      `${monthNames[month]} ${year}`;

    /* =========================
       REMOVE OLD DAYS
    ========================= */

    const oldDays =
      calendarGrid.querySelectorAll(
        ".calendar-day"
      );

    oldDays.forEach((day) =>
      day.remove()
    );

    /* =========================
       CALCULATE DATES
    ========================= */

    const firstDay =
      new Date(
        year,
        month,
        1
      ).getDay();

    const totalDays =
      new Date(
        year,
        month + 1,
        0
      ).getDate();

    /* =========================
       EMPTY CELLS
    ========================= */

    for (
      let i = 0;
      i < firstDay;
      i++
    ) {
      const emptyCell =
        document.createElement(
          "div"
        );

      emptyCell.classList.add(
        "calendar-day"
      );

      emptyCell.style.visibility =
        "hidden";

      calendarGrid.appendChild(
        emptyCell
      );
    }

    /* =========================
       DAYS
    ========================= */

    for (
      let day = 1;
      day <= totalDays;
      day++
    ) {
      const dayElement =
        document.createElement(
          "div"
        );

      dayElement.classList.add(
        "calendar-day"
      );

      const isToday =
        day === today.getDate() &&
        month ===
          today.getMonth() &&
        year ===
          today.getFullYear();

      if (isToday) {
        dayElement.classList.add(
          "today"
        );
      }

      dayElement.innerHTML =
        `
        <div class="day-number">
          ${day}
        </div>
      `;

      /* Random demo dots */

      if (Math.random() > 0.7) {
        const dot =
          document.createElement(
            "div"
          );

        dot.classList.add(
          "task-dot"
        );

        dayElement.appendChild(dot);
      }

      calendarGrid.appendChild(
        dayElement
      );
    }

  } catch (error) {
    console.error(
      "Calendar render failed:",
      error
    );
  }
};

/* =========================================
   CALENDAR CONTROLS
========================================= */

prevMonthBtn?.addEventListener(
  "click",
  () => {
    currentDate.setMonth(
      currentDate.getMonth() - 1
    );

    renderCalendar();
  }
);

nextMonthBtn?.addEventListener(
  "click",
  () => {
    currentDate.setMonth(
      currentDate.getMonth() + 1
    );

    renderCalendar();
  }
);

/* =========================================
   INITIALIZE APP
========================================= */

const initializeApp = () => {
  try {
    initializeTheme();

    renderCalendar();

    console.log(
      "FocusFlow AI initialized successfully."
    );

  } catch (error) {
    console.error(
      "App initialization failed:",
      error
    );
  }
};

document.addEventListener(
  "DOMContentLoaded",
  initializeApp
);