/* ============================================================
   AGE CALCULATOR — Complete JS
   ============================================================ */
'use strict';

// ── Constants ──────────────────────────────────────────────────
const STORAGE_KEY  = 'age_calc_dob';
const SETTINGS_KEY = 'age_calc_settings';

const ZODIAC_SIGNS = [
  { sign: 'Capricorn', emoji: '♑', start: [12,22], end: [1,19]  },
  { sign: 'Aquarius',  emoji: '♒', start: [1,20],  end: [2,18]  },
  { sign: 'Pisces',    emoji: '♓', start: [2,19],  end: [3,20]  },
  { sign: 'Aries',     emoji: '♈', start: [3,21],  end: [4,19]  },
  { sign: 'Taurus',    emoji: '♉', start: [4,20],  end: [5,20]  },
  { sign: 'Gemini',    emoji: '♊', start: [5,21],  end: [6,20]  },
  { sign: 'Cancer',    emoji: '♋', start: [6,21],  end: [7,22]  },
  { sign: 'Leo',       emoji: '♌', start: [7,23],  end: [8,22]  },
  { sign: 'Virgo',     emoji: '♍', start: [8,23],  end: [9,22]  },
  { sign: 'Libra',     emoji: '♎', start: [9,23],  end: [10,22] },
  { sign: 'Scorpio',   emoji: '♏', start: [10,23], end: [11,21] },
  { sign: 'Sagittarius',emoji:'♐', start: [11,22], end: [12,21] },
  { sign: 'Capricorn', emoji: '♑', start: [12,22], end: [12,31] }
];

const CHINESE_ZODIAC = [
  { name: 'Rat',     emoji: '🐀' },
  { name: 'Ox',      emoji: '🐂' },
  { name: 'Tiger',   emoji: '🐅' },
  { name: 'Rabbit',  emoji: '🐇' },
  { name: 'Dragon',  emoji: '🐉' },
  { name: 'Snake',   emoji: '🐍' },
  { name: 'Horse',   emoji: '🐎' },
  { name: 'Goat',    emoji: '🐐' },
  { name: 'Monkey',  emoji: '🐒' },
  { name: 'Rooster', emoji: '🐓' },
  { name: 'Dog',     emoji: '🐕' },
  { name: 'Pig',     emoji: '🐖' }
];

const GENERATIONS = [
  { name: 'Gen Alpha',   start: 2013, end: 2025 },
  { name: 'Gen Z',       start: 1997, end: 2012 },
  { name: 'Millennial',  start: 1981, end: 1996 },
  { name: 'Gen X',       start: 1965, end: 1980 },
  { name: 'Baby Boomer', start: 1946, end: 1964 },
  { name: 'Silent Gen',  start: 1928, end: 1945 },
  { name: 'Greatest Gen',start: 1901, end: 1927 }
];

const AGE_AVATARS = [
  { max: 2,  emoji: '👶' },
  { max: 5,  emoji: '🧒' },
  { max: 12, emoji: '👦' },
  { max: 17, emoji: '🧑' },
  { max: 30, emoji: '😊' },
  { max: 50, emoji: '🧔' },
  { max: 65, emoji: '👨' },
  { max: 999,emoji: '👴' }
];

const BIRTHDAY_WISHES = [
  "🎉 Wishing you a day filled with happiness and a year filled with joy!",
  "🌟 May your birthday be the start of a year filled with good luck and happiness!",
  "🎂 Another year older, another year wiser. Celebrate every moment!",
  "🥳 Today is your day! Shine bright and make it unforgettable!",
  "🎈 May all your birthday dreams and wishes come true!",
  "🌈 Here's to a beautiful year ahead — full of laughter, love, and adventure!",
  "✨ Age is just a number. Keep glowing and keep growing!",
  "🎊 Sending you smiles for every moment of your special day!"
];

const BIRTHDAY_MESSAGES = [
  "🎂 Happy Birthday! Another year of amazing adventures awaits you. May this year bring you closer to all your dreams and fill your life with endless joy, laughter, and love. You deserve the absolute best!",
  "🌟 On your special day, remember how far you've come and how much you've grown. Every single day of your life has been building toward something incredible. Keep shining — the world is better with you in it!",
  "🎉 Today we celebrate YOU! Not just the years you've lived, but every smile you've shared, every challenge you've conquered, and every heart you've touched. Here's to many more incredible years ahead!",
  "🥳 Life is a gift, and you unwrap a little more of it today. May this birthday bring you peace, passion, and the kind of happiness that stays with you long after the candles are blown out!",
  "🌈 Another chapter begins! May this year be your best one yet — full of new experiences, beautiful moments, and growth beyond your imagination. Happy Birthday, legend!"
];

const MILESTONES = [
  { days: 100,   label: '100 Days Old',     icon: '🌱' },
  { days: 365,   label: '1 Year Old',        icon: '🎂' },
  { days: 1000,  label: '1000 Days Old',     icon: '⭐' },
  { days: 5000,  label: '5000 Days Old',     icon: '🌟' },
  { days: 7300,  label: '20 Years Old',      icon: '🎓' },
  { days: 10000, label: '10,000 Days Old',   icon: '💎' },
  { days: 13149, label: '36 Years Old',      icon: '🏆' },
  { days: 18250, label: '50 Years Old',      icon: '👑' },
  { days: 25000, label: '25,000 Days Old',   icon: '🚀' },
  { days: 36500, label: '100 Years Old',     icon: '🌈' }
];

// ── State ──────────────────────────────────────────────────────
let settings       = { theme: 'dark' };
let tickerInterval = null;
let countdownInterval = null;
let currentDOB     = null;
let currentMsgIdx  = 0;

// ── DOM ────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

// ── Init ───────────────────────────────────────────────────────
function init() {
  loadSettings();
  applyTheme();
  loadSavedDOB();
  bindEvents();
}

// ── Storage ────────────────────────────────────────────────────
function loadSettings() {
  try {
    settings = { theme:'dark', ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') };
  } catch(e) {}
}
function saveSettings() { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); }

function loadSavedDOB() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if(saved) {
      $('dayInput').value   = saved.day;
      $('monthInput').value = saved.month;
      $('yearInput').value  = saved.year;
    }
  } catch(e) {}
}
function saveDOB(d, m, y) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ day:d, month:m, year:y }));
}

// ── Theme ──────────────────────────────────────────────────────
function applyTheme() {
  document.documentElement.setAttribute('data-theme', settings.theme);
  $('themeToggle').querySelector('i').className =
    settings.theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}
function toggleTheme() {
  settings.theme = settings.theme === 'dark' ? 'light' : 'dark';
  applyTheme(); saveSettings();
}

// ── Bind Events ────────────────────────────────────────────────
function bindEvents() {
  $('themeToggle').addEventListener('click', toggleTheme);
  $('copyBtn').addEventListener('click', copyResult);
  $('resetBtn').addEventListener('click', resetAll);
  $('calculateBtn').addEventListener('click', calculate);
  $('refreshMsg').addEventListener('click', refreshMessage);
  $('copyMsg').addEventListener('click', copyMessage);

  // Enter key
  [$('dayInput'), $('monthInput'), $('yearInput')].forEach(el => {
    el?.addEventListener('keydown', e => { if(e.key === 'Enter') calculate(); });
  });
}

// ── Calculate ──────────────────────────────────────────────────
function calculate() {
  const day   = parseInt($('dayInput').value);
  const month = parseInt($('monthInput').value);
  const year  = parseInt($('yearInput').value);

  // Validate
  if(!day || !month || !year) {
    showToast('Please enter a complete date.', 'error'); return;
  }
  if(year < 1900 || year > new Date().getFullYear()) {
    showToast('Please enter a valid year.', 'error'); return;
  }
  const dob = new Date(year, month - 1, day);
  if(isNaN(dob.getTime()) || dob > new Date()) {
    showToast('Please enter a valid past date.', 'error'); return;
  }

  currentDOB = dob;
  saveDOB(day, month, year);

  $('resultsSection').classList.remove('hidden');
  $('resultsSection').scrollIntoView({ behavior: 'smooth', block: 'start' });

  renderAll(dob);
  startTicker(dob);
  startCountdown(dob);
  loadRandomMessage();
  showToast('Age calculated!', 'success');
}

// ── Render All ─────────────────────────────────────────────────
function renderAll(dob) {
  const now  = new Date();
  const age  = calcAge(dob, now);

  renderAgeDisplay(dob, age, now);
  renderBirthdayInfo(dob, now);
  renderFunFacts(dob, now);
  renderMilestones(dob, now);
}

// ── Age Display ────────────────────────────────────────────────
function renderAgeDisplay(dob, age, now) {
  // Avatar
  const avatar = AGE_AVATARS.find(a => age.years <= a.max) || AGE_AVATARS.at(-1);
  $('ageAvatar').textContent = avatar.emoji;
  $('ageYears').textContent  = age.years;

  // Breakdown
  $('bdMonths').textContent  = age.totalMonths;
  $('bdWeeks').textContent   = fmtNum(age.totalWeeks);
  $('bdDays').textContent    = fmtNum(age.totalDays);
  $('bdHours').textContent   = fmtNum(age.totalHours);
  $('bdMinutes').textContent = fmtNum(age.totalMinutes);
  $('bdSeconds').textContent = fmtNum(age.totalSeconds);

  // Zodiac
  const zodiac   = getZodiac(dob.getMonth() + 1, dob.getDate());
  $('zodiacEmoji').textContent = zodiac.emoji;
  $('zodiacSign').textContent  = zodiac.sign;

  // Chinese Zodiac
  const chinese = getChineseZodiac(dob.getFullYear());
  $('chineseEmoji').textContent  = chinese.emoji;
  $('chineseZodiac').textContent = chinese.name;
}

// ── Birthday Info ──────────────────────────────────────────────
function renderBirthdayInfo(dob, now) {
  const days   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  $('bornOn').textContent   = `${months[dob.getMonth()]} ${dob.getDate()}, ${dob.getFullYear()}`;
  $('dayOfWeek').textContent = days[dob.getDay()];

  // Next birthday
  const next = getNextBirthday(dob, now);
  $('nextBirthday').textContent = next.toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' });

  const daysLeft = Math.ceil((next - now) / 86400000);
  $('daysUntilBirthday').textContent = daysLeft === 0
    ? '🎉 Today is your Birthday!' : `${daysLeft} days`;

  // Birthday wish
  const wish = daysLeft <= 7 && daysLeft > 0
    ? `🎉 Your birthday is in just ${daysLeft} day${daysLeft > 1 ? 's' : ''}!`
    : daysLeft === 0
    ? '🎂 Happy Birthday! Today is your special day!'
    : BIRTHDAY_WISHES[Math.floor(Math.random() * BIRTHDAY_WISHES.length)];
  $('birthdayWish').textContent = wish;

  // Generation
  const gen = GENERATIONS.find(g => dob.getFullYear() >= g.start && dob.getFullYear() <= g.end);
  $('generation').textContent = gen ? gen.name : '—';
}

// ── Fun Facts ──────────────────────────────────────────────────
function renderFunFacts(dob, now) {
  const totalDays    = Math.floor((now - dob) / 86400000);
  const totalSeconds = Math.floor((now - dob) / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours   = Math.floor(totalMinutes / 60);

  $('heartbeats').textContent  = fmtNum(Math.floor(totalSeconds * 1.2));  // ~72 bpm
  $('breaths').textContent     = fmtNum(Math.floor(totalMinutes * 15));    // ~15/min
  $('sleepHours').textContent  = fmtNum(Math.floor(totalDays * 8));        // ~8 hrs/day
  $('meals').textContent       = fmtNum(Math.floor(totalDays * 3));        // 3 meals/day
  $('earthTrips').textContent  = (totalDays / 365.25).toFixed(2);
  $('moonPhases').textContent  = Math.floor(totalDays / 29.5);             // lunar cycle
}

// ── Milestones ─────────────────────────────────────────────────
function renderMilestones(dob, now) {
  const list     = $('milestoneList');
  list.innerHTML = '';
  const totalDays = Math.floor((now - dob) / 86400000);

  MILESTONES.forEach(ms => {
    const msDate     = new Date(dob.getTime() + ms.days * 86400000);
    const achieved   = totalDays >= ms.days;
    const el         = document.createElement('div');
    el.className     = `milestone-item ${achieved ? 'achieved' : 'upcoming'}`;
    const dateStr    = msDate.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
    const daysLeft   = Math.ceil((msDate - now) / 86400000);

    el.innerHTML = `
      <span class="ms-icon">${ms.icon}</span>
      <div class="ms-info">
        <div class="ms-title">${ms.label}</div>
        <div class="ms-date">${dateStr}${!achieved ? ` · in ${daysLeft} days` : ''}</div>
      </div>
      <span class="ms-badge ${achieved ? 'badge-achieved' : 'badge-upcoming'}">
        ${achieved ? '✅ Achieved' : '⏳ Upcoming'}
      </span>
    `;
    list.appendChild(el);
  });
}

// ── Live Ticker ────────────────────────────────────────────────
function startTicker(dob) {
  clearInterval(tickerInterval);
  tickerInterval = setInterval(() => {
    const now = new Date();
    const age = calcAge(dob, now);
    $('bdSeconds').textContent = fmtNum(age.totalSeconds);
    $('bdMinutes').textContent = fmtNum(age.totalMinutes);
    $('bdHours').textContent   = fmtNum(age.totalHours);
    $('bdDays').textContent    = fmtNum(age.totalDays);
  }, 1000);
}

// ── Birthday Countdown ─────────────────────────────────────────
function startCountdown(dob) {
  clearInterval(countdownInterval);

  function tick() {
    const now  = new Date();
    const next = getNextBirthday(dob, now);
    const diff = next - now;

    if(diff <= 0) {
      $('cdDays').textContent  = '00';
      $('cdHours').textContent = '00';
      $('cdMins').textContent  = '00';
      $('cdSecs').textContent  = '00';
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    $('cdDays').textContent  = String(d).padStart(2,'0');
    $('cdHours').textContent = String(h).padStart(2,'0');
    $('cdMins').textContent  = String(m).padStart(2,'0');
    $('cdSecs').textContent  = String(s).padStart(2,'0');
  }

  tick();
  countdownInterval = setInterval(tick, 1000);
}

// ── Message ────────────────────────────────────────────────────
function loadRandomMessage() {
  currentMsgIdx = Math.floor(Math.random() * BIRTHDAY_MESSAGES.length);
  $('messageBox').textContent = BIRTHDAY_MESSAGES[currentMsgIdx];
}

function refreshMessage() {
  currentMsgIdx = (currentMsgIdx + 1) % BIRTHDAY_MESSAGES.length;
  $('messageBox').textContent = BIRTHDAY_MESSAGES[currentMsgIdx];
  showToast('New message loaded!', 'info');
}

function copyMessage() {
  const msg = $('messageBox').textContent;
  navigator.clipboard.writeText(msg).then(() => {
    showToast('Message copied to clipboard!', 'success');
  }).catch(() => {
    showToast('Copy failed. Please copy manually.', 'error');
  });
}

// ── Copy Result ────────────────────────────────────────────────
function copyResult() {
  if(!currentDOB) { showToast('Calculate your age first!', 'error'); return; }
  const now = new Date();
  const age = calcAge(currentDOB, now);
  const text = `My Age: ${age.years} years, ${age.months} months, ${age.days} days\n` +
               `Total Days: ${fmtNum(age.totalDays)}\n` +
               `Total Hours: ${fmtNum(age.totalHours)}\n` +
               `Calculated on: ${now.toLocaleDateString()}`;
  navigator.clipboard.writeText(text).then(() => {
    showToast('Age result copied!', 'success');
  }).catch(() => {
    showToast('Copy failed.', 'error');
  });
}

// ── Reset ──────────────────────────────────────────────────────
function resetAll() {
  clearInterval(tickerInterval);
  clearInterval(countdownInterval);
  currentDOB = null;
  $('dayInput').value   = '';
  $('monthInput').value = '';
  $('yearInput').value  = '';
  $('resultsSection').classList.add('hidden');
  localStorage.removeItem(STORAGE_KEY);
  showToast('Reset successfully.', 'info');
}

// ── Helpers ────────────────────────────────────────────────────
function calcAge(dob, now) {
  const diffMs      = now - dob;
  const totalSeconds= Math.floor(diffMs / 1000);
  const totalMinutes= Math.floor(totalSeconds / 60);
  const totalHours  = Math.floor(totalMinutes / 60);
  const totalDays   = Math.floor(totalHours / 24);
  const totalWeeks  = Math.floor(totalDays / 7);

  let years  = now.getFullYear() - dob.getFullYear();
  let months = now.getMonth() - dob.getMonth();
  let days   = now.getDate() - dob.getDate();

  if(days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if(months < 0) { years--; months += 12; }

  return {
    years, months, days,
    totalMonths:  years * 12 + months,
    totalWeeks, totalDays, totalHours, totalMinutes, totalSeconds
  };
}

function getNextBirthday(dob, now) {
  const next = new Date(now.getFullYear(), dob.getMonth(), dob.getDate());
  if(next <= now) next.setFullYear(now.getFullYear() + 1);
  return next;
}

function getZodiac(month, day) {
  for(const z of ZODIAC_SIGNS) {
    const [sm, sd] = z.start;
    const [em, ed] = z.end;
    if(
      (month === sm && day >= sd) ||
      (month === em && day <= ed) ||
      (sm > em && (month === sm || month === em))
    ) return z;
  }
  return ZODIAC_SIGNS[0];
}

function getChineseZodiac(year) {
  return CHINESE_ZODIAC[(year - 1900) % 12];
}

function fmtNum(n) {
  return Math.abs(n).toLocaleString('en-US');
}

// ── Toast ──────────────────────────────────────────────────────
let toastTimer;
function showToast(msg, type = 'success') {
  clearTimeout(toastTimer);
  $('toastMsg').textContent = msg;
  const icon = $('toast').querySelector('.toast-icon');
  icon.className = `toast-icon fas ${
    type === 'success' ? 'fa-check-circle' :
    type === 'error'   ? 'fa-times-circle' : 'fa-info-circle'
  }`;
  $('toast').className = `toast ${type} show`;
  toastTimer = setTimeout(() => $('toast').classList.remove('show'), 3000);
}

// ── Start ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);