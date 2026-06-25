const themeToggle = document.getElementById('theme-toggle');
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

window.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  const page = document.body.dataset.page;

  if (page === 'calculator') initCalculator();
  if (page === 'difference') initDifference();
  if (page === 'birthday') initBirthday();
  if (page === 'about') initFAQ();
});

function initTheme() {
  const storedTheme = localStorage.getItem('lifePulseTheme') || 'dark';
  setTheme(storedTheme);
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('lifePulseTheme', theme);
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

function toggleTheme() {
  const current = document.documentElement.dataset.theme || 'dark';
  setTheme(current === 'dark' ? 'light' : 'dark');
}

function initMobileMenu() {
  if (!menuToggle || !mobileMenu) return;
  const topbar = document.querySelector('.topbar');

  function updateMenuButton(isOpen) {
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  }

  function openMenu() {
    if (topbar) {
      const rect = topbar.getBoundingClientRect();
      const docTop = window.scrollY || window.pageYOffset;
      const computedTop = rect.bottom + docTop + 10;
      mobileMenu.style.top = computedTop + 'px';
    }
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    updateMenuButton(true);
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    updateMenuButton(false);
  }

  updateMenuButton(false);

  menuToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    if (mobileMenu.classList.contains('open')) closeMenu();
    else openMenu();
  });

  window.addEventListener('resize', () => {
    if (mobileMenu.classList.contains('open')) openMenu();
  });

  document.addEventListener('click', (event) => {
    if (!mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) {
      if (mobileMenu.classList.contains('open')) closeMenu();
    }
  });
}

function initCalculator() {
  const dateInput = document.getElementById('dob');
  const calculateButton = document.getElementById('calculate-btn');
  const resultSection = document.getElementById('age-results');

  const today = new Date();
  dateInput.value = today.toISOString().slice(0, 10);

  calculateButton.addEventListener('click', () => {
    const birthDate = new Date(dateInput.value);
    if (!dateInput.value || birthDate.toString() === 'Invalid Date') {
      alert('Please enter a valid birth date.');
      return;
    }

    if (birthDate > new Date()) {
      alert('Date of birth cannot be in the future.');
      return;
    }

    const minBirthDate = new Date();
    minBirthDate.setFullYear(minBirthDate.getFullYear() - 120);
    if (birthDate < minBirthDate) {
      alert('Date of birth cannot be more than 120 years in the past.');
      return;
    }

    const age = calculateAge(birthDate, new Date());
    const diffMs = new Date() - birthDate;
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMilliseconds = diffMs;
    const nextBirthday = getNextBirthday(birthDate);
    const zodiac = getZodiacSign(birthDate.getMonth() + 1, birthDate.getDate());
    const chineseZodiac = getChineseZodiac(birthDate.getFullYear());
    const hoursSlept = (totalDays / 3).toFixed(1);
    const heartBeats = Math.round(totalDays * 24 * 80);
    const percentOlder = Math.max(10, Math.min(95, 100 - age.years * 1.2));

    document.getElementById('years').textContent = age.years;
    document.getElementById('months').textContent = age.months;
    document.getElementById('days').textContent = age.days;
    document.getElementById('next-birthday').textContent = nextBirthday.date.toLocaleDateString();
    document.getElementById('days-until').textContent = `${nextBirthday.days} days`;
    document.getElementById('zodiac').textContent = zodiac;
    document.getElementById('chinese-zodiac-name').textContent = chineseZodiac.name;
    document.getElementById('total-days').textContent = totalDays.toLocaleString();
    document.getElementById('weeks').textContent = age.weeks.toLocaleString();
    document.getElementById('total-hours').textContent = totalHours.toLocaleString();
    document.getElementById('total-minutes').textContent = totalMinutes.toLocaleString('en-US');
    document.getElementById('total-seconds').textContent = totalSeconds.toLocaleString('en-US');
    document.getElementById('total-milliseconds').textContent = totalMilliseconds.toLocaleString('en-US');
    document.getElementById('fact-one').textContent = `You are older than ${percentOlder}% of people.`;
    document.getElementById('fact-two').textContent = `You have lived ${totalDays.toLocaleString()} days.`;
    document.getElementById('fact-three').textContent = `You spent approximately ${hoursSlept} years sleeping.`;
    document.getElementById('fact-four').textContent = `Your heart has beaten approximately ${heartBeats.toLocaleString()} times.`;

    document.getElementById('age-mercury').textContent = (totalDays / 87.97).toFixed(2);
    document.getElementById('age-venus').textContent = (totalDays / 224.7).toFixed(2);
    document.getElementById('age-mars').textContent = (totalDays / 686.98).toFixed(2);
    document.getElementById('age-jupiter').textContent = (totalDays / 4332.59).toFixed(2);
    document.getElementById('age-saturn').textContent = (totalDays / 10759.22).toFixed(2);

    resultSection.classList.remove('hidden');
    window.scrollTo({ top: resultSection.offsetTop - 20, behavior: 'smooth' });
  });
}

function calculateAge(birthDate, targetDate) {
  let years = targetDate.getFullYear() - birthDate.getFullYear();
  let months = targetDate.getMonth() - birthDate.getMonth();
  let days = targetDate.getDate() - birthDate.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0).getDate();
    days += prevMonth;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = Math.floor((targetDate - birthDate) / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(totalDays / 7);

  return { years, months, days, weeks };
}

function getNextBirthday(birthDate) {
  const today = new Date();
  const thisYear = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  let target = thisYear;
  if (thisYear < today) {
    target = new Date(today.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
  }
  if (birthDate.getMonth() === 1 && birthDate.getDate() === 29) {
    target = new Date(target.getFullYear(), 1, target.getFullYear() % 4 === 0 ? 29 : 28);
  }
  const diffDays = Math.ceil((target - new Date(new Date().setHours(0, 0, 0, 0))) / (1000 * 60 * 60 * 24));
  return { date: target, days: diffDays };
}

function getZodiacSign(month, day) {
  const zodiac = [
    { sign: 'Aries', start: [3, 21], end: [4, 19] },
    { sign: 'Taurus', start: [4, 20], end: [5, 20] },
    { sign: 'Gemini', start: [5, 21], end: [6, 20] },
    { sign: 'Cancer', start: [6, 21], end: [7, 22] },
    { sign: 'Leo', start: [7, 23], end: [8, 22] },
    { sign: 'Virgo', start: [8, 23], end: [9, 22] },
    { sign: 'Libra', start: [9, 23], end: [10, 22] },
    { sign: 'Scorpio', start: [10, 23], end: [11, 21] },
    { sign: 'Sagittarius', start: [11, 22], end: [12, 21] },
    { sign: 'Capricorn', start: [12, 22], end: [1, 19] },
    { sign: 'Aquarius', start: [1, 20], end: [2, 18] },
    { sign: 'Pisces', start: [2, 19], end: [3, 20] },
  ];
  return zodiac.find((z) => {
    return (
      (month === z.start[0] && day >= z.start[1]) ||
      (month === z.end[0] && day <= z.end[1]) ||
      (z.start[0] > z.end[0] && (month >= z.start[0] || month <= z.end[0]))
    );
  }).sign;
}

function getChineseZodiac(year) {
  const animals = [
    { name: 'Rat', emoji: '🐀' },
    { name: 'Ox', emoji: '🐂' },
    { name: 'Tiger', emoji: '🐅' },
    { name: 'Rabbit', emoji: '🐇' },
    { name: 'Dragon', emoji: '🐉' },
    { name: 'Snake', emoji: '🐍' },
    { name: 'Horse', emoji: '🐎' },
    { name: 'Goat', emoji: '🐐' },
    { name: 'Monkey', emoji: '🐒' },
    { name: 'Rooster', emoji: '🐓' },
    { name: 'Dog', emoji: '🐕' },
    { name: 'Pig', emoji: '🐖' },
  ];
  return animals[((year - 4) % 12 + 12) % 12];
}

function initDifference() {
  const dob1 = document.getElementById('dob1');
  const dob2 = document.getElementById('dob2');
  const calculateBtn = document.getElementById('calculate-difference');
  const swapBtn = document.getElementById('swap-btn');

  const today = new Date();
  dob1.value = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate()).toISOString().slice(0, 10);
  dob2.value = new Date(today.getFullYear() - 28, today.getMonth(), today.getDate()).toISOString().slice(0, 10);

  swapBtn.addEventListener('click', () => {
    const temp = dob1.value;
    dob1.value = dob2.value;
    dob2.value = temp;
  });

  calculateBtn.addEventListener('click', () => {
    const date1 = new Date(dob1.value);
    const date2 = new Date(dob2.value);
    if (!dob1.value || !dob2.value || date1.toString() === 'Invalid Date' || date2.toString() === 'Invalid Date') {
      alert('Please select both birth dates.');
      return;
    }

    const older = date1 < date2 ? date1 : date2;
    const younger = date1 < date2 ? date2 : date1;
    const diff = calculateAge(older, younger);
    const diffMs = younger - older;
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const totalSeconds = Math.floor(diffMs / 1000);

    document.getElementById('diff-years').textContent = diff.years;
    document.getElementById('diff-months').textContent = diff.months;
    document.getElementById('diff-days').textContent = diff.days;
    document.getElementById('diff-total-days').textContent = totalDays.toLocaleString();
    document.getElementById('diff-total-hours').textContent = totalHours.toLocaleString();
    document.getElementById('diff-total-minutes').textContent = totalMinutes.toLocaleString();
    document.getElementById('diff-total-seconds').textContent = totalSeconds.toLocaleString();
    document.getElementById('timeline-person1-date').textContent = dob1.value;
    document.getElementById('timeline-person2-date').textContent = dob2.value;
    let relationMsg = "";
    if (date1.getTime() === date2.getTime()) {
      relationMsg = "Both persons are of the exact same age.";
    } else {
      relationMsg = date1 < date2 ? 'Person 1 is older than Person 2.' : 'Person 2 is older than Person 1.';
    }
    document.getElementById('relationship-message').textContent = relationMsg;
    document.getElementById('timeline-diff-text').textContent = `${diff.years} Years, ${diff.months} Months, ${diff.days} Days`;
    document.getElementById('difference-result').classList.add('active');
    window.scrollTo({ top: document.getElementById('difference-result').offsetTop - 20, behavior: 'smooth' });
  });
}

function initBirthday() {
  const nameInput = document.getElementById('recipient-name');
  const dateInput = document.getElementById('recipient-date');
  const messageInput = document.getElementById('custom-message');
  const themeButtons = document.querySelectorAll('.theme-card');
  const cardPreview = document.getElementById('birthday-preview');
  const downloadBtn = document.getElementById('download-card');
  const shareBtn = document.getElementById('share-card');

  const today = new Date();
  dateInput.value = today.toISOString().slice(0, 10);
  updateBirthdayPreview();

  [nameInput, dateInput, messageInput].forEach((input) => {
    input.addEventListener('input', updateBirthdayPreview);
  });

  themeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      themeButtons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      updateBirthdayPreview();
    });
  });

  downloadBtn.addEventListener('click', async () => {
    if (!window.html2canvas) {
      alert('Download requires html2canvas.');
      return;
    }
    const canvas = await html2canvas(cardPreview, { backgroundColor: null });
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'birthday-card.png';
    link.click();
  });

  shareBtn.addEventListener('click', async () => {
    const name = nameInput.value || 'Friend';
    const message =
      messageInput.value || 'Wishing you a day filled with happiness!';

    const shareText = `Happy Birthday ${name}! ${message}`;

    try {
      // Preferred: Native share
      if (navigator.share) {
        await navigator.share({
          title: 'Birthday Card',
          text: shareText,
        });

        return;
      }

      // Fallback: Clipboard
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);

        alert('Card message copied to clipboard.');
        return;
      }

      alert('Share is not supported on this browser.');
    } catch (error) {
      console.error('Share operation failed:', error);

      // Attempt clipboard fallback if share failed
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(shareText);

          alert(
            'Sharing was unavailable. The message has been copied to your clipboard instead.'
          );
          return;
        } catch (clipboardError) {
          console.error('Clipboard write failed:', clipboardError);
        }
      }

      alert(
        'Unable to share or copy the message. Please try again later.'
      );
    }
  });
}

function updateBirthdayPreview() {
  const name = document.getElementById('recipient-name').value || 'Friend';
  const dateValue = document.getElementById('recipient-date').value;
  const message = document.getElementById('custom-message').value || 'Wishing you a day filled with happiness and a year filled with joy!';
  const theme = document.querySelector('.theme-card.active')?.dataset.theme || 'balloons';

  document.getElementById('preview-name').textContent = name;
  document.getElementById('preview-message').textContent = message;
  document.getElementById('preview-date').textContent = dateValue ? `Celebrating on ${new Date(dateValue).toLocaleDateString()}` : 'Celebrating soon';
  const preview = document.getElementById('birthday-preview');
  if (!preview) return;
  preview.dataset.theme = theme;
}

function initFAQ() {
  const items = document.querySelectorAll('.accordion-item');
  items.forEach((item) => {
    item.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      items.forEach((it) => it.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });
}
