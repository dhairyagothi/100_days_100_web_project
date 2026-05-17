let alarmTriggered = false;

// Start clock
setInterval(updateClock, 1000);

function updateClock() {
  const format = localStorage.getItem('clockFormat') || 'format1';
  const timezone = document.getElementById('timezone').value;

  const now = getCurrentTimeAndDate(timezone);

  switch (format) {
    case 'format1':
      showTimeFirst(now);
      break;

    case 'format2':
      showDateFirstModern(now);
      break;

    case 'format3':
      showDayFirst(now);
      break;

    default:
      showTimeFirst(now);
  }

  checkAlarm(now.rawTime);
}

function showTimeFirst(now) {
  document.getElementById('display').innerHTML =
    `${now.displayTime}<br><span class="date-size">${now.date}</span>`;
}

function showDateFirstModern(now) {
  const dateParts = now.date.split('/');
  const day = dateParts[0];
  const month = getMonthName(dateParts[1]);
  const year = dateParts[2];

  const formattedDate = `${day} ${month} ${year}`;

  document.getElementById('display').innerHTML =
    `<span class="date-size">${formattedDate}</span><br>${now.displayTime}`;
}

function showDayFirst(now) {
  document.getElementById('display').innerHTML =
    `<b>${now.day}</b><br>
     <span class="date-size">${now.date}</span><br>
     ${now.displayTime}`;
}

function getCurrentTimeAndDate(timezone) {
  let time = new Date();

  if (timezone !== 'local') {
    time = new Date(
      time.toLocaleString('en-US', { timeZone: timezone })
    );
  }

  let hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // Store raw 24-hour format for alarm matching
  const rawHours = String(hours).padStart(2, '0');
  const rawMinutes = String(minutes).padStart(2, '0');

  const rawTime = `${rawHours}:${rawMinutes}`;

  // Convert for display
  let am_pm = "AM";

  if (hours >= 12) {
    am_pm = "PM";
  }

  hours = hours % 12;

  if (hours === 0) {
    hours = 12;
  }

  const displayHours = String(hours).padStart(2, '0');
  const displayMinutes = String(minutes).padStart(2, '0');
  const displaySeconds = String(seconds).padStart(2, '0');

  const displayTime =
    `${displayHours}:${displayMinutes}:${displaySeconds} ${am_pm}`;

  const currentDate =
    `${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}`;

  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  return {
    displayTime,
    rawTime,
    date: currentDate,
    day: days[time.getDay()]
  };
}

function setClockStyleAndFormat(face, format) {
  localStorage.setItem('clockFormat', format);
  setClockFace(face);
  updateClock();
}

function setClockFace(face) {
  const display = document.getElementById('display');
  const clock = document.getElementById('clock');

  // Add transition effect
  display.style.opacity = '0.7';
  clock.style.opacity = '0.7';

  // Update classes after brief delay for smooth transition
  setTimeout(() => {
    display.className =
      `relative font-mono text-4xl md:text-5xl 
       border-4 rounded-lg p-4 mb-4 ${face}`;

    clock.className =
      `relative font-mono text-4xl md:text-5xl 
       border-4 rounded-lg p-4 ${face}`;

    // Fade back in
    display.style.opacity = '1';
    clock.style.opacity = '1';
  }, 150);
}

function getMonthName(monthNumber) {
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

  return monthNames[monthNumber - 1];
}

function toggleAlarmMode() {
  const alarmInput = document.getElementById('alarm-time');

  const confirmButton =
    document.querySelector('#alarm-container button:nth-child(3)');

  // Add smooth transition animations
  if (alarmInput.classList.contains('hidden')) {
    alarmInput.classList.remove('hidden');
    confirmButton.classList.remove('hidden');

    alarmInput.style.animation = 'slideDown 0.3s ease-out';
    confirmButton.style.animation = 'slideDown 0.3s ease-out';
  } else {
    alarmInput.style.animation =
      'slideDown 0.3s ease-out reverse';

    confirmButton.style.animation =
      'slideDown 0.3s ease-out reverse';

    setTimeout(() => {
      alarmInput.classList.add('hidden');
      confirmButton.classList.add('hidden');
    }, 300);
  }
}

function setAlarm() {
  const alarmTime =
    document.getElementById('alarm-time').value;

  if (!alarmTime) {
    alert("Please select a valid time.");
    return;
  }

  localStorage.setItem('alarmTime', alarmTime);

  // Reset trigger state
  alarmTriggered = false;

  // Unlock audio for browser autoplay policy
  const alarmSound =
    document.getElementById('alarm-sound');

  alarmSound.load();

  alarmSound.play()
    .then(() => {
      alarmSound.pause();
      alarmSound.currentTime = 0;
    })
    .catch(() => {
      console.log("Audio initialized after user interaction.");
    });

  // Show success animation
  const confirmButton =
    document.querySelector('#alarm-container button:nth-child(3)');

  confirmButton.classList.add('success-animation');

  // Create success notification
  const successMsg = document.createElement('div');

  successMsg.textContent =
    `✓ Alarm set for ${alarmTime}`;

  successMsg.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: rgba(34, 197, 94, 0.9);
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    font-size: 1rem;
    animation: slideDown 0.3s ease-out;
    z-index: 2000;
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
  `;

  document.body.appendChild(successMsg);

  setTimeout(() => {
    confirmButton.classList.remove('success-animation');
  }, 600);

  setTimeout(() => {
    successMsg.style.animation =
      'slideDown 0.3s ease-out reverse';

    setTimeout(() => successMsg.remove(), 300);
  }, 3000);

  alert(`Alarm set for ${alarmTime}`);
}

function checkAlarm(currentTime) {
  const alarmTime =
    localStorage.getItem('alarmTime');

  if (
    alarmTime &&
    currentTime === alarmTime &&
    !alarmTriggered
  ) {
    alarmTriggered = true;
    triggerAlarm();
  }
}

function triggerAlarm() {
  const alarmSound =
    document.getElementById('alarm-sound');

  const alarmPopup =
    document.getElementById('alarm-popup');

  alarmPopup.classList.remove('hidden');

  alarmSound.loop = true;

  alarmSound.play()
    .then(() => {
      console.log("Alarm playing.");
    })
    .catch((error) => {
      console.error("Audio playback failed:", error);

      alert(
        "Browser blocked alarm sound. Please interact with the page first."
      );
    });

  // Add pulsing effect to popup
  setInterval(() => {
    alarmPopup.style.animation = 'none';

    setTimeout(() => {
      alarmPopup.style.animation =
        'alarmShake 0.5s ease-in-out';
    }, 10);
  }, 2000);
}

function stopAlarm() {
  const alarmSound =
    document.getElementById('alarm-sound');

  const alarmPopup =
    document.getElementById('alarm-popup');

  alarmSound.pause();
  alarmSound.currentTime = 0;

  // Add smooth close animation
  alarmPopup.style.animation =
    'alarmEntrance 0.4s ease-out reverse';

  setTimeout(() => {
    alarmPopup.classList.add('hidden');
    alarmPopup.style.animation = '';
  }, 400);

  localStorage.removeItem('alarmTime');

  alarmTriggered = false;
}

// Initial load
updateClock();