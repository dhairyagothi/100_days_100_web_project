const goalForm = document.getElementById('goalForm');
const goalInput = document.getElementById('goalInput');
const customForm = document.getElementById('customForm');
const customInput = document.getElementById('customInput');
const resetBtn = document.getElementById('resetBtn');
const goalValue = document.getElementById('goalValue');
const intakeValue = document.getElementById('intakeValue');
const remainingValue = document.getElementById('remainingValue');
const completionValue = document.getElementById('completionValue');
const progressFill = document.getElementById('progressFill');
const progressBar = document.getElementById('progressBar');
const percentageLabel = document.getElementById('percentageLabel');
const completionMessage = document.getElementById('completionMessage');
const waterButtons = document.querySelectorAll('.water-button');

const STORAGE_KEYS = {
  waterGoal: 'waterGoal',
  waterIntake: 'waterIntake',
};

let waterGoal = 2000;
let waterIntake = 0;

function saveData() {
  localStorage.setItem(STORAGE_KEYS.waterGoal, String(waterGoal));
  localStorage.setItem(STORAGE_KEYS.waterIntake, String(waterIntake));
}

function loadData() {
  const savedGoal = Number(localStorage.getItem(STORAGE_KEYS.waterGoal));
  const savedIntake = Number(localStorage.getItem(STORAGE_KEYS.waterIntake));

  waterGoal = Number.isFinite(savedGoal) && savedGoal > 0 ? savedGoal : 2000;
  waterIntake = Number.isFinite(savedIntake) && savedIntake >= 0 ? savedIntake : 0;

  goalInput.value = waterGoal;
  updateUI();
}

function updateUI() {
  const remaining = Math.max(waterGoal - waterIntake, 0);
  const percent = waterGoal > 0 ? Math.min((waterIntake / waterGoal) * 100, 100) : 0;

  goalValue.textContent = `${waterGoal.toLocaleString()} ml`;
  intakeValue.textContent = `${waterIntake.toLocaleString()} ml`;
  remainingValue.textContent = `${remaining.toLocaleString()} ml`;
  completionValue.textContent = `${Math.round(percent)}%`;
  percentageLabel.textContent = `${Math.round(percent)}%`;
  progressFill.style.width = `${percent}%`;
  progressBar.setAttribute('aria-valuenow', String(Math.round(percent)));

  if (waterIntake >= waterGoal && waterGoal > 0) {
    completionMessage.textContent = 'Goal reached — excellent hydration! Keep the momentum going.';
  } else if (waterIntake > 0) {
    completionMessage.textContent = `Only ${remaining.toLocaleString()} ml left to reach your goal.`;
  } else {
    completionMessage.textContent = 'Start logging your water intake to see progress here.';
  }
}

function setGoal(event) {
  event.preventDefault();
  const value = Number(goalInput.value);

  if (!Number.isFinite(value) || value < 100) {
    goalInput.focus();
    goalInput.setAttribute('aria-invalid', 'true');
    return;
  }

  waterGoal = Math.round(value);
  goalInput.setAttribute('aria-invalid', 'false');
  saveData();
  updateUI();
}

function addWater(amount) {
  if (!Number.isFinite(amount) || amount <= 0) return;

  waterIntake += amount;
  saveData();
  updateUI();
}

function resetTracker() {
  waterIntake = 0;
  saveData();
  updateUI();
}

goalForm.addEventListener('submit', setGoal);
customForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const amount = Number(customInput.value);

  if (!Number.isFinite(amount) || amount <= 0) {
    customInput.focus();
    customInput.setAttribute('aria-invalid', 'true');
    return;
  }

  customInput.value = '';
  customInput.setAttribute('aria-invalid', 'false');
  addWater(Math.round(amount));
});

waterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const amount = Number(button.dataset.amount);
    addWater(amount);
  });
});

resetBtn.addEventListener('click', resetTracker);
window.addEventListener('DOMContentLoaded', loadData);

// ============ REMINDER SYSTEM ============

const reminderToggle = document.getElementById('reminderToggle');
const reminderStatus = document.getElementById('reminderStatus');
const intervalControls = document.getElementById('intervalControls');
const intervalSelect = document.getElementById('intervalSelect');
const reminderActions = document.getElementById('reminderActions');
const snoozeBtn = document.getElementById('snoozeBtn');
const testReminderBtn = document.getElementById('testReminderBtn');
const reminderHint = document.getElementById('reminderHint');
const snoozeInfo = document.getElementById('snoozeInfo');
const snoozeTime = document.getElementById('snoozeTime');

let reminderTimer = null;
let isSnoozed = false;
let snoozeTimeout = null;
let nextReminderTime = null;

// Check if notifications are supported
const isNotificationSupported = 'Notification' in window;

// Load reminder settings
function loadReminderSettings() {
  const savedInterval = localStorage.getItem('reminderInterval');
  const savedEnabled = localStorage.getItem('reminderEnabled');
  
  if (savedInterval) {
    intervalSelect.value = savedInterval;
  }
  
  if (savedEnabled === 'true') {
    reminderToggle.checked = true;
    enableReminders();
  } else {
    reminderToggle.checked = false;
    disableReminders();
  }
}

// Request notification permission
async function requestNotificationPermission() {
  if (!isNotificationSupported) {
    showReminderStatus('Notifications not supported', 'error');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    showReminderStatus('Notifications blocked. Please enable in browser settings.', 'error');
    return false;
  }

  // Show permission prompt with custom UI
  showPermissionPrompt();
  return false;
}

function showPermissionPrompt() {
  // Remove existing prompt if any
  const existingPrompt = document.querySelector('.notification-prompt');
  if (existingPrompt) existingPrompt.remove();

  const prompt = document.createElement('div');
  prompt.className = 'notification-prompt show';
  prompt.innerHTML = `
    <span>🔔 Enable notifications to receive hydration reminders</span>
    <button id="enableNotificationsBtn">Enable</button>
  `;
  
  // Insert after the reminder hint
  reminderHint.parentNode.insertBefore(prompt, reminderHint.nextSibling);

  document.getElementById('enableNotificationsBtn').addEventListener('click', async () => {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      prompt.classList.remove('show');
      showReminderStatus('Notifications enabled ✅', 'success');
      if (reminderToggle.checked) {
        startReminderTimer();
      }
    } else {
      prompt.classList.remove('show');
      showReminderStatus('Notifications denied', 'error');
      reminderToggle.checked = false;
      disableReminders();
    }
  });
}

function showReminderStatus(message, type = 'info') {
  reminderHint.textContent = message;
  reminderHint.style.color = type === 'error' ? '#f87171' : 
                              type === 'success' ? '#34d399' : '#b8c7e0';
  setTimeout(() => {
    reminderHint.textContent = 'Get notified when it\'s time to hydrate.';
    reminderHint.style.color = '#b8c7e0';
  }, 3000);
}

// Enable reminders
function enableReminders() {
  reminderStatus.textContent = 'Reminders on';
  reminderStatus.style.color = '#34d399';
  intervalControls.style.display = 'flex';
  reminderActions.style.display = 'flex';
  localStorage.setItem('reminderEnabled', 'true');
  
  if (isNotificationSupported && Notification.permission === 'granted') {
    startReminderTimer();
  } else if (isNotificationSupported && Notification.permission === 'default') {
    requestNotificationPermission();
  } else if (!isNotificationSupported) {
    showReminderStatus('Notifications not supported in this browser', 'error');
  }
}

// Disable reminders
function disableReminders() {
  reminderStatus.textContent = 'Reminders off';
  reminderStatus.style.color = '#b8c7e0';
  intervalControls.style.display = 'none';
  reminderActions.style.display = 'none';
  localStorage.setItem('reminderEnabled', 'false');
  
  if (reminderTimer) {
    clearInterval(reminderTimer);
    reminderTimer = null;
  }
  if (snoozeTimeout) {
    clearTimeout(snoozeTimeout);
    snoozeTimeout = null;
  }
  isSnoozed = false;
  snoozeInfo.style.display = 'none';
}

// Start reminder timer
function startReminderTimer() {
  if (reminderTimer) {
    clearInterval(reminderTimer);
  }
  
  const intervalMinutes = parseInt(intervalSelect.value);
  const intervalMs = intervalMinutes * 60 * 1000;
  
  // Clear any existing snooze
  if (snoozeTimeout) {
    clearTimeout(snoozeTimeout);
    snoozeTimeout = null;
    isSnoozed = false;
    snoozeInfo.style.display = 'none';
  }
  
  // Start the timer
  reminderTimer = setInterval(() => {
    if (!isSnoozed) {
      sendHydrationReminder(intervalMinutes);
    }
  }, intervalMs);
  
  // Send first reminder after 5 seconds (so user doesn't wait)
  setTimeout(() => {
    if (reminderToggle.checked && !isSnoozed) {
      sendHydrationReminder(intervalMinutes);
    }
  }, 5000);
  
  console.log(`Reminders set for every ${intervalMinutes} minutes`);
}

// Send hydration reminder
function sendHydrationReminder(intervalMinutes) {
  if (!isNotificationSupported) return;
  
  // Check if it's a reasonable hour (8 AM - 10 PM)
  const hour = new Date().getHours();
  if (hour < 8 || hour > 22) {
    return; // Don't send reminders late at night
  }
  
  const currentIntake = parseInt(intakeValue.textContent) || 0;
  const goal = parseInt(goalValue.textContent) || 2000;
  const remaining = Math.max(goal - currentIntake, 0);
  const percent = Math.round((currentIntake / goal) * 100);
  
  let title = '💧 Time to hydrate!';
  let body = `You've consumed ${currentIntake}ml of your ${goal}ml goal (${percent}%).`;
  
  if (currentIntake >= goal) {
    title = '🎉 Goal reached!';
    body = `Amazing! You've met your daily hydration goal of ${goal}ml. Keep it up!`;
  } else if (remaining > 500) {
    body += ` You have ${remaining}ml left to go. Drink up! 💪`;
  } else {
    body += ` Just ${remaining}ml to go! You're almost there! 🏆`;
  }
  
  // Create notification
  try {
    const notification = new Notification(title, {
      body: body,
      icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="45" fill="%233b82f6"/%3E%3Cpath d="M50 20 L50 50 L65 65" stroke="white" stroke-width="6" fill="none"/%3E%3Ccircle cx="50" cy="50" r="8" fill="white"/%3E%3C/svg%3E',
      silent: false,
      tag: 'hydration-reminder',
    });
    
    // Auto-close after 10 seconds
    setTimeout(() => notification.close(), 10000);
    
    // Handle notification click
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
}

// Snooze reminder
function snoozeReminder() {
  if (!reminderToggle.checked) return;
  
  // Cancel current timer
  if (reminderTimer) {
    clearInterval(reminderTimer);
    reminderTimer = null;
  }
  
  // Set snooze
  isSnoozed = true;
  const snoozeMinutes = 15;
  const snoozeMs = snoozeMinutes * 60 * 1000;
  
  // Show snooze info
  const snoozeUntil = new Date(Date.now() + snoozeMs);
  snoozeTime.textContent = snoozeUntil.toLocaleTimeString();
  snoozeInfo.style.display = 'block';
  
  // Hide snooze info after 5 seconds, or when snooze ends
  setTimeout(() => {
    if (isSnoozed) {
      snoozeInfo.style.display = 'none';
    }
  }, 5000);
  
  // Set timeout to resume reminders
  if (snoozeTimeout) {
    clearTimeout(snoozeTimeout);
  }
  snoozeTimeout = setTimeout(() => {
    isSnoozed = false;
    snoozeInfo.style.display = 'none';
    snoozeTimeout = null;
    
    // Restart timer with current interval
    if (reminderToggle.checked) {
      startReminderTimer();
      showReminderStatus('⏰ Reminders resumed', 'success');
    }
  }, snoozeMs);
  
  showReminderStatus(`⏰ Snoozed for ${snoozeMinutes} minutes`, 'info');
}

// Toggle reminders
reminderToggle.addEventListener('change', async () => {
  if (reminderToggle.checked) {
    // Check if we need permission
    if (isNotificationSupported && Notification.permission === 'default') {
      const granted = await requestNotificationPermission();
      if (!granted) {
        reminderToggle.checked = false;
        return;
      }
    }
    
    if (isNotificationSupported && Notification.permission === 'denied') {
      showReminderStatus('Please enable notifications in browser settings', 'error');
      reminderToggle.checked = false;
      return;
    }
    
    enableReminders();
  } else {
    disableReminders();
  }
});

// Interval change
intervalSelect.addEventListener('change', () => {
  const interval = intervalSelect.value;
  localStorage.setItem('reminderInterval', interval);
  
  if (reminderToggle.checked && !isSnoozed) {
    // Restart timer with new interval
    startReminderTimer();
    showReminderStatus(`⏰ Reminders set to every ${interval} minutes`, 'info');
  }
});

// Snooze button
snoozeBtn.addEventListener('click', snoozeReminder);

// Test reminder
testReminderBtn.addEventListener('click', () => {
  if (!isNotificationSupported) {
    showReminderStatus('Notifications not supported', 'error');
    return;
  }
  
  if (Notification.permission === 'granted') {
    sendHydrationReminder(parseInt(intervalSelect.value));
    showReminderStatus('🔔 Test notification sent!', 'success');
  } else if (Notification.permission === 'default') {
    requestNotificationPermission();
  } else {
    showReminderStatus('Notifications blocked', 'error');
  }
});

// Request permission on page load if enabled
window.addEventListener('DOMContentLoaded', () => {
  // Load reminder settings after main data loads
  setTimeout(loadReminderSettings, 100);
});

// Handle visibility change - restart timers if user returns
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && reminderToggle.checked) {
    // User returned to tab, check if we need to restart
    if (!reminderTimer && !isSnoozed) {
      startReminderTimer();
    }
  }
});

// Clean up timers on page unload
window.addEventListener('beforeunload', () => {
  if (reminderTimer) {
    clearInterval(reminderTimer);
  }
  if (snoozeTimeout) {
    clearTimeout(snoozeTimeout);
  }
});