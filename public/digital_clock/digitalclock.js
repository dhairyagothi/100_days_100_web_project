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
      break;
  }
  checkAlarm(now.time);
}

function showTimeFirst(now) {
  const time = now.time;
  const date = now.date;
  document.getElementById('display').innerHTML = `${time}<br><span class="date-size">${date}</span>`;
}

function showDateFirstModern(now) {
  const time = now.time;
  const dateParts = now.date.split('/');
  const day = dateParts[0];
  const month = getMonthName(dateParts[1]);
  const year = dateParts[2];
  const formattedDate = `${day} ${month} ${year}`;
  document.getElementById('display').innerHTML = `<span class="date-size">${formattedDate}</span><br>${time}`;
}

function showDayFirst(now) {
  const time = now.time;
  const date = now.date;
  const day = now.day;
  document.getElementById('display').innerHTML = `<b>${day}</b><br><span class="date-size">${date}</span><br>${time}`;
}

function getCurrentTimeAndDate(timezone) {
  let time = new Date();

  if (timezone !== 'local') {
    time = new Date(time.toLocaleString('en-US', { timeZone: timezone }));
  }

  let hour = time.getHours();
  let minutes = time.getMinutes();
  let seconds = time.getSeconds();
  let am_pm = "AM";

  if (hour >= 12) {
    hour -= 12;
    am_pm = "PM";
  } else if (hour == 0) {
    hour = 12;
    am_pm = "AM";
  }

  if (hour < 10) hour = "0" + hour;
  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;

  const currentTime = `${hour}:${minutes}:${seconds} ${am_pm}`;
  const currentDate = `${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}`;
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = days[time.getDay()];

  return {
    time: currentTime,
    date: currentDate,
    day: currentDay
  };
}

function setClockStyleAndFormat(face, format) {
  localStorage.setItem('clockFormat', format);
  setClockFace(face);
  updateClock();
}

function setClockFace(face) {
  const display = document.getElementById('display');
  display.className = `relative font-mono text-4xl md:text-5xl border-4 rounded-lg p-4 mb-4 ${face}`;

  const clock = document.getElementById('clock');
  clock.className = `relative font-mono text-4xl md:text-5xl border-4 rounded-lg p-4 ${face}`;
}

function getMonthName(monthNumber) {
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  return monthNames[monthNumber - 1];
}

function toggleAlarmMode() {
  const alarmInput = document.getElementById('alarm-time');
  const confirmButton = document.querySelector('#alarm-container button:nth-child(3)');
  alarmInput.classList.toggle('hidden');
  confirmButton.classList.toggle('hidden');
}

function setAlarm() {
  const alarmTime = document.getElementById('alarm-time').value;
  localStorage.setItem('alarmTime', alarmTime);
  alert(`Alarm set for ${alarmTime}`);
}

function checkAlarm(currentTime) {
  const alarmTime = localStorage.getItem('alarmTime');
  if (alarmTime && currentTime.includes(alarmTime)) {
    triggerAlarm();
  }
}

function triggerAlarm() {
  const alarmSound = document.getElementById('alarm-sound');
  const alarmPopup = document.getElementById('alarm-popup');
  alarmSound.play();
  alarmPopup.classList.remove('hidden');
}

function stopAlarm() {
  const alarmSound = document.getElementById('alarm-sound');
  const alarmPopup = document.getElementById('alarm-popup');
  alarmSound.pause();
  alarmSound.currentTime = 0;
  alarmPopup.classList.add('hidden');
  localStorage.removeItem('alarmTime');
}

// Initial call to set the format and style
updateClock();
