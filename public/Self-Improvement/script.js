// Time and date display
function displayDateTime() {
   const time = document.querySelector('.time-text');
   const date = document.querySelector('.day-text');
   let now = new Date();

   // Get hours, minutes, seconds
   let hours = now.getHours();
   let minutes = now.getMinutes();
   let meridian = hours >= 12 ? 'PM' : 'AM';
   hours = hours % 12 || 12;
   minutes = minutes < 10 ? '0' + minutes : minutes;

   // Set time and meridian
   time.innerHTML = `<span>${hours}:${minutes}</span><span class="time-sub-text"> ${meridian}</span>`;

   // Format and set date
   let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
   let formattedDate = now.toLocaleDateString('en-US', options);
   date.innerHTML = formattedDate;
}

// Call displayDateTime every second
displayDateTime();
setInterval(displayDateTime, 1000);

// Function to generate calendar for the current month
function generateCalendar() {
   const calendarContainer = document.getElementById('calendar-container');
   calendarContainer.innerHTML = '';

   let now = new Date();
   let year = now.getFullYear();
   let month = now.getMonth();

   let daysInMonth = new Date(year, month + 1, 0).getDate(); // Get number of days in the month
   let firstDay = new Date(year, month, 1).getDay(); // Get first day of the month (0 for Sunday)

   // Create calendar table
   let calendar = '<table><tr>';

   // Fill in days of the week
   const daysOfWeek = ['Sun ', 'Mon ', 'Tue ', 'Wed ', 'Thu ', 'Fri ', 'Sat '];
   daysOfWeek.forEach(day => {
       calendar += `<th>${day}</th>`;
   });
   calendar += '</tr><tr>';

   // Add empty cells for the days before the 1st of the month
   for (let i = 0; i < firstDay; i++) {
       calendar += '<td></td>';
   }

   // Add the days of the month
   for (let day = 1; day <= daysInMonth; day++) {
       let today = now.getDate();
       let isToday = day === today ? 'style="background-color: #f67280;" class="td"' : '';
       calendar += `<td ${isToday}>${day}</td>`;

       // Start a new row after Saturday
       if ((day + firstDay) % 7 === 0) {
           calendar += '</tr><tr>';
       }
   }

   calendar += '</tr></table>';
   calendarContainer.innerHTML = calendar;
}

// Call generateCalendar to display the calendar for the current month
generateCalendar();

// Save progress in localStorage for the current day
const progressCheck = document.getElementById('progressCheck');

const todayKey = new Date().toLocaleDateString(); 
const streakKey = 'streak'; // Key for storing streak count
let streak = localStorage.getItem(streakKey) ? parseInt(localStorage.getItem(streakKey)) : 0; // Initialize streak

// Load saved progress for the current day
if (localStorage.getItem(todayKey)) {
    progressCheck.checked = JSON.parse(localStorage.getItem(todayKey));
    if (progressCheck.checked) {
        document.querySelector('.td').style.backgroundColor = 'green';
        streak++; // Increment streak if today is marked as complete
    }
}

// Event listener to save progress when checkbox is clicked
progressCheck.addEventListener('change', function () {
    localStorage.setItem(todayKey, JSON.stringify(progressCheck.checked));

    if (progressCheck.checked) {
        document.querySelector('.td').style.backgroundColor = 'green';
        streak++; // Increment streak if checked
    } else {
        document.querySelector('.td').style.backgroundColor = ''; // Reset color if unchecked
        streak = Math.max(0, streak - 1); // Decrement streak, ensuring it doesn't go below 0
    }

    localStorage.setItem(streakKey, streak); // Save updated streak to localStorage
});

// Streak display
document.querySelector('.streak').innerHTML = `
  <i class="fa-solid fa-fire-flame-curved"></i>
  <p>${streak}</p>`; // Display the streak

/* For P2 */
// Timer variables
let goalTime = new Date();
let timerInterval;
let timerStarted = false;
let timeWasted = 0; // Seconds wasted after the goal time

// Helper function to format time for display
function formatTime(hour, minute) {
    let ampm = hour >= 12 ? 'p.m.' : 'a.m.';
    hour = hour % 12;
    hour = hour ? hour : 12; // Hour '0' should be '12'
    return `${hour}:${String(minute).padStart(2, '0')} ${ampm}`;
}

// Retrieve goal time from localStorage if it exists, otherwise set to default (5:00 AM)
function loadGoalTime() {
    const storedGoal = localStorage.getItem('goalTime');
    
    if (storedGoal) {
        let [hour, minute] = storedGoal.split(":");
        goalTime.setHours(parseInt(hour));
        goalTime.setMinutes(parseInt(minute));
        goalTime.setSeconds(0);
    } else {
        // Default to 5:00 AM if no goal time is stored
        goalTime.setHours(5);
        goalTime.setMinutes(0);
        goalTime.setSeconds(0);
        localStorage.setItem('goalTime', '5:00'); // Store default goal time
    }
    
    // Update UI to show goal time
    document.getElementById('goalTime').innerHTML = `Goal: ${formatTime(goalTime.getHours(), goalTime.getMinutes())}`;
}

// Save goal time to localStorage
function saveGoalTime(hour, minute) {
    localStorage.setItem('goalTime', `${hour}:${minute}`);
}

// When gear is clicked, update the goal time
document.getElementById('setGoalTime').addEventListener('click', function() {
    let newGoalTime = prompt("Set your new goal time (e.g., 5:30 a.m.)", "5:00 a.m.");
    
    if (newGoalTime) {
        let [time, period] = newGoalTime.split(" "); // Split into time and period (a.m./p.m.)
        let [hour, minute] = time.split(":");

        hour = parseInt(hour);
        minute = parseInt(minute);
        
        // Convert to 24-hour format if necessary
        if (period === "p.m." && hour !== 12) {
            hour += 12;
        } else if (period === "a.m." && hour === 12) {
            hour = 0; // Midnight case
        }

        // Set the goal time
        goalTime.setHours(hour);
        goalTime.setMinutes(minute);
        goalTime.setSeconds(0);

        // Save new goal time to localStorage
        saveGoalTime(hour, minute);

        // Update the UI
        document.getElementById('goalTime').innerHTML = `Goal: ${formatTime(goalTime.getHours(), goalTime.getMinutes())}`;
    }
});

// Calculate the difference between now and the goal time in seconds
function getTimeDifference() {
    let now = new Date();
    let diffInSeconds = Math.floor((now - goalTime) / 1000);
    return diffInSeconds > 0 ? diffInSeconds : 0; // Only return positive difference
}

// Start tracking wasted time after goal time is passed
function startWastedTimeTimer() {
    timerStarted = true;
    
    // Initialize the time wasted if goal time is already passed
    timeWasted = getTimeDifference();
    
    // Start the timer from the calculated wasted time
    timerInterval = setInterval(function() {
        timeWasted++;
        displayWastedTime();
    }, 1000); // Increment timer every second
}

// Display the time wasted in HH:MM:SS format
function displayWastedTime() {
    let hours = Math.floor(timeWasted / 3600);
    let minutes = Math.floor((timeWasted % 3600) / 60);
    let seconds = timeWasted % 60;

    document.getElementById('timerDisplay').innerText = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Stop the timer when user clicks "Yes"
document.getElementById('yesBtn').addEventListener('click', function() {
    clearInterval(timerInterval);
    alert(`You have wasted ${Math.floor(timeWasted / 60)} minutes and ${timeWasted % 60} seconds after the goal time.`);
});

// If user clicks "No", reset the timer and goal time
document.getElementById('noBtn').addEventListener('click', function() {
    clearInterval(timerInterval);
    timeWasted = 0;
    timerStarted = false;
    document.getElementById('timerDisplay').innerText = '00:00:00';
    alert("No progress made today.");
});

// Check if goal time has passed, and if so, start the timer
function checkGoalTime() {
    let now = new Date();
    if (now > goalTime && !timerStarted) {
        startWastedTimeTimer(); // Start the timer if goal time is passed
    }
}

// Load goal time on page load
loadGoalTime();

// Call checkGoalTime every second
setInterval(checkGoalTime, 1000);




/* Task Manager */
// DOM Elements
const taskInput = document.getElementById('taskInput');
const taskPriority = document.getElementById('taskPriority');
const dueDateInput = document.getElementById('dueDateInput');
const categoryInput = document.getElementById('categoryInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const clearCompletedBtn = document.getElementById('clearCompleted');
const progressBar = document.getElementById('progressBar');
const filterBtns = document.querySelectorAll('.filter-btn');
const darkModeToggle = document.getElementById('darkModeToggle');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let filter = 'all'; // Default filter

// Load tasks from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
  renderTasks();
  updateProgressBar();
  if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
  }
});

// Add task event
addTaskBtn.addEventListener('click', addTask);
taskList.addEventListener('click', handleTaskActions);
clearCompletedBtn.addEventListener('click', clearCompletedTasks);
filterBtns.forEach(btn => btn.addEventListener('click', filterTasks));
darkModeToggle.addEventListener('click', toggleDarkMode);

// Add new task
function addTask() {
  const taskText = taskInput.value.trim();
  const priority = taskPriority.value;
  const dueDate = dueDateInput.value;
  const category = categoryInput.value.trim();

  if (taskText === '') return alert('Please enter a task');

  const newTask = {
    id: Date.now(),
    text: taskText,
    priority,
    dueDate,
    category,
    completed: false
  };

  tasks.push(newTask);
  saveToLocalStorage();
  renderTasks();
  updateProgressBar();
  taskInput.value = '';
  dueDateInput.value = '';
  categoryInput.value = '';
}

// Handle task actions
function handleTaskActions(e) {
  const taskId = e.target.closest('tr').dataset.id;

  if (e.target.tagName === 'INPUT') {
    toggleTaskCompletion(taskId);
  } else if (e.target.tagName === 'BUTTON') {
    deleteTask(taskId);
  }
}

// Toggle task completion
function toggleTaskCompletion(id) {
  tasks = tasks.map(task =>
    task.id === parseInt(id) ? { ...task, completed: !task.completed } : task
  );
  saveToLocalStorage();
  renderTasks();
  updateProgressBar();
}

// Delete task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== parseInt(id));
  saveToLocalStorage();
  renderTasks();
  updateProgressBar();
}

// Render tasks
function renderTasks() {
  taskList.innerHTML = '';
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
  });

  filteredTasks.forEach(task => {
    const taskRow = document.createElement('tr');
    taskRow.className = task.completed ? 'completed-task' : '';
    taskRow.dataset.id = task.id;

    taskRow.innerHTML = `
      <td>${task.text}</td>
      <td>${task.priority}</td>
      <td>${task.dueDate ? task.dueDate : 'No due date'}</td>
      <td>${task.category ? task.category : 'No category'}</td>
      <td><input type="checkbox" ${task.completed ? 'checked' : ''}></td>
      <td><button>Delete</button></td>
    `;
    taskList.appendChild(taskRow);
  });
}

// Clear completed tasks
function clearCompletedTasks() {
  tasks = tasks.filter(task => !task.completed);
  saveToLocalStorage();
  renderTasks();
  updateProgressBar();
}

// Update progress bar
function updateProgressBar() {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const percentage = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
  progressBar.style.width = `${percentage}%`;
}

// Filter tasks
function filterTasks(e) {
  filterBtns.forEach(btn => btn.classList.remove('active'));
  e.target.classList.add('active');
  filter = e.target.dataset.filter;
  renderTasks();
}

// Save to localStorage
function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Dark mode toggle
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('darkMode', 'enabled');
  } else {
    localStorage.setItem('darkMode', 'disabled');
  }
}
