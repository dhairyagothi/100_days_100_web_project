document.addEventListener("DOMContentLoaded", () => {
  // State Management
  let tasks = JSON.parse(localStorage.getItem("advancedTasks")) || [];
  let currentFilter = "all";
  let currentSort = "recent";

  // DOM Elements
  const taskInput = document.getElementById("taskInput");
  const dateInput = document.getElementById("dateInput");
  const addBtn = document.getElementById("addBtn");
  const magicWandBtn = document.getElementById("magicWandBtn");
  const taskList = document.getElementById("taskList");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const sortSelect = document.getElementById("sortSelect");
  const aiBriefing = document.getElementById("aiBriefing");

  // Chatbot Elements
  const chatToggle = document.getElementById("chatToggle");
  const chatWindow = document.getElementById("chatWindow");
  const chatClose = document.getElementById("chatClose");
  const chatInput = document.getElementById("chatInput");
  const chatSend = document.getElementById("chatSend");
  const chatBody = document.getElementById("chatBody");

  // Initialize Application
  const init = () => {
    renderTasks();
    generateAIBriefing();
  };

  // Helper: Save to LocalStorage
  const saveTasks = () => {
    localStorage.setItem("advancedTasks", JSON.stringify(tasks));
    generateAIBriefing();
  };

  // Add Task
  const addTask = () => {
    const title = taskInput.value.trim();
    const date = dateInput.value;

    if (!title) return alert("Please enter a task description.");

    const newTask = {
      id: Date.now().toString(),
      title,
      date: date || null,
      completed: false,
      createdAt: Date.now(),
    };

    tasks.push(newTask);
    saveTasks();
    taskInput.value = "";
    dateInput.value = "";
    renderTasks();
  };

  // Toggle Task Completion
  const toggleTask = (id) => {
    tasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task,
    );
    saveTasks();
    renderTasks();
  };

  // Delete Task
  const deleteTask = (id) => {
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks();
    renderTasks();
  };

  // Render Tasks based on Filters and Sort
  const renderTasks = () => {
    taskList.innerHTML = "";

    let filteredTasks = tasks.filter((task) => {
      if (currentFilter === "active") return !task.completed;
      if (currentFilter === "completed") return task.completed;
      return true;
    });

    filteredTasks.sort((a, b) => {
      if (currentSort === "recent") return b.createdAt - a.createdAt;
      if (currentSort === "earliest") {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(a.date) - new Date(b.date);
      }
      if (currentSort === "latest") {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(b.date) - new Date(a.date);
      }
      return 0;
    });

    if (filteredTasks.length === 0) {
      taskList.innerHTML =
        '<p style="text-align:center; color: var(--text-muted); padding: 20px;">No tasks found.</p>';
      return;
    }

    filteredTasks.forEach((task) => {
      const li = document.createElement("li");
      li.className = `task-item ${task.completed ? "completed" : ""}`;

      let dateText = "";
      if (task.date) {
        const dateObj = new Date(task.date);
        dateText = `<div class="task-date"><i class="fa-regular fa-calendar"></i> ${dateObj.toLocaleDateString()}</div>`;
      }

      li.innerHTML = `
                <div class="task-content">
                    <div class="checkbox" onclick="toggleTaskHandler('${task.id}')"></div>
                    <div class="task-details">
                        <span class="task-title">${task.title}</span>
                        ${dateText}
                    </div>
                </div>
                <div class="task-actions">
                    <button class="delete-btn" onclick="deleteTaskHandler('${task.id}')" title="Delete">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
      taskList.appendChild(li);
    });
  };

  // Attach to window for inline onclick handlers
  window.toggleTaskHandler = toggleTask;
  window.deleteTaskHandler = deleteTask;

  // AI Features: Briefing
  const generateAIBriefing = () => {
    const active = tasks.filter((t) => !t.completed).length;
    const total = tasks.length;

    let message = `You have ${active} active tasks out of ${total}. `;

    if (active === 0 && total > 0) {
      message = "Amazing! You've completed all your tasks!";
    } else if (total === 0) {
      message = "Your list is empty. Add a task to get started!";
    } else {
      // Check for overdue or due today
      const today = new Date().setHours(0, 0, 0, 0);
      const urgentTasks = tasks.filter((t) => {
        if (t.completed || !t.date) return false;
        const taskDate = new Date(t.date).setHours(0, 0, 0, 0);
        return taskDate <= today;
      });

      if (urgentTasks.length > 0) {
        message += `🔥 Warning: ${urgentTasks.length} task(s) need immediate attention today!`;
      } else {
        message += "You're on track! No immediate deadlines today.";
      }
    }

    aiBriefing.innerHTML = `<p><i class="fa-solid fa-sparkles"></i> AI Briefing: ${message}</p>`;
  };

  // AI Features: Magic Breakdown
  const handleMagicBreakdown = () => {
    const val = taskInput.value.toLowerCase();
    if (!val) {
      alert(
        "Enter a complex task first to use the Magic Wand (e.g., 'Build a website').",
      );
      return;
    }

    // Simulated AI breakdown rules
    let subtasks = [];
    if (val.includes("website") || val.includes("app")) {
      subtasks = [
        "Design UI mockups",
        "Setup project repository",
        "Write code",
        "Test and deploy",
      ];
    } else if (val.includes("party") || val.includes("event")) {
      subtasks = [
        "Create guest list",
        "Send invitations",
        "Buy supplies and food",
        "Decorate venue",
      ];
    } else if (val.includes("study") || val.includes("learn")) {
      subtasks = [
        "Gather study materials",
        "Set a study schedule",
        "Read chapters 1-3",
        "Take practice quiz",
      ];
    } else {
      subtasks = [
        "Research the topic",
        "Draft initial plan",
        "Execute phase 1",
        "Review and finalize",
      ];
    }

    // Add subtasks
    subtasks.forEach((st, index) => {
      const date = new Date();
      date.setDate(date.getDate() + index); // spread out over days
      tasks.push({
        id: Date.now().toString() + index,
        title: `${taskInput.value} - ${st}`,
        date: date.toISOString().split("T")[0],
        completed: false,
        createdAt: Date.now() + index,
      });
    });

    saveTasks();
    taskInput.value = "";
    renderTasks();

    addChatMessage(
      "ai-message",
      `✨ I broke down your task into ${subtasks.length} sub-tasks and assigned dates. Check your list!`,
    );
    openChat();
  };

  // Chatbot Logic
  const toggleChat = () => {
    chatWindow.classList.toggle("open");
  };
  const openChat = () => chatWindow.classList.add("open");

  const addChatMessage = (type, text) => {
    const msgDiv = document.createElement("div");
    msgDiv.className = `message ${type}`;
    msgDiv.textContent = text;
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  };

  const handleChat = () => {
    const msg = chatInput.value.trim().toLowerCase();
    if (!msg) return;

    addChatMessage("user-message", chatInput.value);
    chatInput.value = "";

    // Simulated Response Delay
    setTimeout(() => {
      let response = "";
      if (msg.includes("urgent") || msg.includes("due")) {
        const today = new Date().setHours(0, 0, 0, 0);
        const urgent = tasks.filter(
          (t) =>
            !t.completed &&
            t.date &&
            new Date(t.date).setHours(0, 0, 0, 0) <= today,
        );
        if (urgent.length > 0) {
          response =
            `You have ${urgent.length} urgent tasks: ` +
            urgent.map((u) => u.title).join(", ") +
            ".";
        } else {
          response = "You have no urgent tasks for today!";
        }
      } else if (msg.includes("summary") || msg.includes("status")) {
        const active = tasks.filter((t) => !t.completed).length;
        response = `You currently have ${active} active tasks remaining to be done.`;
      } else if (msg.includes("hello") || msg.includes("hi")) {
        response =
          "Hello there! I'm your TaskMaster AI. Ask me for a 'summary' or your 'urgent tasks'.";
      } else {
        response =
          "I'm a simple assistant. Try asking for your 'summary' or 'urgent tasks'!";
      }
      addChatMessage("ai-message", response);
    }, 600);
  };

  // Event Listeners
  addBtn.addEventListener("click", addTask);
  magicWandBtn.addEventListener("click", handleMagicBreakdown);
  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
  });

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      e.target.classList.add("active");
      currentFilter = e.target.dataset.filter;
      renderTasks();
    });
  });

  sortSelect.addEventListener("change", (e) => {
    currentSort = e.target.value;
    renderTasks();
  });

  chatToggle.addEventListener("click", toggleChat);
  chatClose.addEventListener("click", toggleChat);
  chatSend.addEventListener("click", handleChat);
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleChat();
  });

  // Run
  init();
});
