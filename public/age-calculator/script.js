class AgeCalculator {
  constructor() {
    this.today = new Date();
    this.setupEventListeners();
    this.setDefaultDate();
  }

  setDefaultDate() {
    const todayInput = document.getElementById("dob");
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    todayInput.value = `${yyyy}-${mm}-${dd}`;
  }

  getZodiacSign(month, day) {
    const zodiac = [
      { sign: "♈ Aries", start: [3, 21], end: [4, 19] },
      { sign: "♉ Taurus", start: [4, 20], end: [5, 20] },
      { sign: "♊ Gemini", start: [5, 21], end: [6, 20] },
      { sign: "♋ Cancer", start: [6, 21], end: [7, 22] },
      { sign: "♌ Leo", start: [7, 23], end: [8, 22] },
      { sign: "♍ Virgo", start: [8, 23], end: [9, 22] },
      { sign: "♎ Libra", start: [9, 23], end: [10, 22] },
      { sign: "♏ Scorpio", start: [10, 23], end: [11, 21] },
      { sign: "♐ Sagittarius", start: [11, 22], end: [12, 21] },
      { sign: "♑ Capricorn", start: [12, 22], end: [1, 19] },
      { sign: "♒ Aquarius", start: [1, 20], end: [2, 18] },
      { sign: "♓ Pisces", start: [2, 19], end: [3, 20] },
    ];

    for (let z of zodiac) {
      if (
        (month === z.start[0] && day >= z.start[1]) ||
        (month === z.end[0] && day <= z.end[1]) ||
        (z.start[0] > z.end[0] && (month >= z.start[0] || month <= z.end[0]))
      ) {
        return z.sign;
      }
    }
    return "♑ Capricorn";
  }

  getChineseZodiac(year) {
    const animals = [
      { name: "Rat", emoji: "🐀" },
      { name: "Ox", emoji: "🐂" },
      { name: "Tiger", emoji: "🐅" },
      { name: "Rabbit", emoji: "🐇" },
      { name: "Dragon", emoji: "🐉" },
      { name: "Snake", emoji: "🐍" },
      { name: "Horse", emoji: "🐎" },
      { name: "Goat", emoji: "🐐" },
      { name: "Monkey", emoji: "🐒" },
      { name: "Rooster", emoji: "🐓" },
      { name: "Dog", emoji: "🐕" },
      { name: "Pig", emoji: "🐖" },
    ];

    const index = (((year - 4) % 12) + 12) % 12;
    return animals[index];
  }

  calculateAge(birthDate) {
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    // Handle negative days
    if (days < 0) {
      months--;

      const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0);

      days += previousMonth.getDate();
    }

    // Handle negative months
    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months, days };
  }

  isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  getNextBirthday(birthDate) {
    const today = new Date();

    const birthMonth = birthDate.getMonth();
    const birthDay = birthDate.getDate();

    let targetYear = today.getFullYear();

    // Handle Feb 29 birthdays
    let nextBirthday;

    if (birthMonth === 1 && birthDay === 29) {
      // If current year is leap year → Feb 29
      // Otherwise → Feb 28
      if (this.isLeapYear(targetYear)) {
        nextBirthday = new Date(targetYear, 1, 29);
      } else {
        nextBirthday = new Date(targetYear, 1, 28);
      }
    } else {
      nextBirthday = new Date(targetYear, birthMonth, birthDay);
    }

    // If birthday already passed this year
    if (nextBirthday < today) {
      targetYear++;

      if (birthMonth === 1 && birthDay === 29) {
        if (this.isLeapYear(targetYear)) {
          nextBirthday = new Date(targetYear, 1, 29);
        } else {
          nextBirthday = new Date(targetYear, 1, 28);
        }
      } else {
        nextBirthday = new Date(targetYear, birthMonth, birthDay);
      }
    }

    // Reset time for accurate day calculation
    nextBirthday.setHours(0, 0, 0, 0);

    const currentDate = new Date(today);
    currentDate.setHours(0, 0, 0, 0);

    const diffTime = nextBirthday - currentDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      date: nextBirthday,
      days: diffDays,
    };
  }

  getAgeInWeeksAndHours(totalDays) {
    const weeks = Math.floor(totalDays / 7);
    const hours = totalDays * 24;
    return { weeks, hours };
  }

  getSleepTime(totalDays) {
    const sleepDays = totalDays / 3;
    if (sleepDays > 365) {
      const sleepYears = (sleepDays / 365.25).toFixed(1);
      return `${sleepYears} Years (~${Math.round(sleepDays).toLocaleString()} days)`;
    }
    return `${Math.round(sleepDays).toLocaleString()} days`;
  }

  getMilestones(birthDate, today) {
    const milestones = [
      { name: "10,000 Days", days: 10000 },
      { name: "500,000 Hours", days: 500000 / 24 },
    ];

    let html = "";

    milestones.forEach((m) => {
      const milestoneDate = new Date(
        birthDate.getTime() + m.days * 24 * 60 * 60 * 1000,
      );
      const diffTime = milestoneDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      html += `<div class="milestone-item">
        <span class="milestone-title">${m.name} Old</span>
        <span class="milestone-desc">`;

      if (diffDays > 0) {
        html += `Target date: ${milestoneDate.toLocaleDateString()} (${diffDays.toLocaleString()} days left!)`;
      } else {
        html += `🎉 You passed your ${m.name} milestone on ${milestoneDate.toLocaleDateString()}!`;
      }
      html += `</span></div>`;
    });

    return html;
  }

  shareStats() {
    const years = document.getElementById("years").textContent;
    const months = document.getElementById("months").textContent;
    const days = document.getElementById("days").textContent;
    const zodiac = document.getElementById("zodiac").textContent;
    const sleepTime = document.getElementById("sleep-time").textContent;
    const currentUrl = window.location.href;

    const textToShare = `📅 My Age Stats Summary:\n• Age: ${years} Years, ${months} Months, ${days} Days\n• Zodiac Sign: ${zodiac}\n• Time spent sleeping: ${sleepTime}\n\nCalculate yours here: ${currentUrl}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(textToShare)
        .then(() => {
          const shareBtn = document.getElementById("share-btn");
          const originalText = shareBtn.textContent;
          shareBtn.textContent = "✅ Copied to Clipboard!";

          setTimeout(() => {
            shareBtn.textContent = originalText;
          }, 2000);
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
          alert("Failed to copy to clipboard");
        });
    } else {
      alert("Clipboard API not supported in this browser.");
    }
  }

  calculate() {
    const dobInput = document.getElementById("dob").value;
    if (!dobInput) {
      alert("Please select your date of birth");
      return;
    }

    const birthDate = new Date(dobInput);
    const today = new Date();

    if (birthDate > today) {
      alert("Date of birth cannot be in the future!");
      return;
    }

    const age = this.calculateAge(birthDate);
    const nextBirthday = this.getNextBirthday(birthDate);
    const zodiac = this.getZodiacSign(
      birthDate.getMonth() + 1,
      birthDate.getDate(),
    );
    const totalDays = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));
    const { weeks, hours } = this.getAgeInWeeksAndHours(totalDays);
    const sleepTime = this.getSleepTime(totalDays);
    const milestonesHtml = this.getMilestones(birthDate, today);

    document.getElementById("years").textContent = age.years;
    document.getElementById("months").textContent = age.months;
    document.getElementById("days").textContent = age.days;
    document.getElementById("next-birthday").textContent =
      nextBirthday.date.toLocaleDateString();
    document.getElementById("days-until").textContent =
      `${nextBirthday.days} days`;
    document.getElementById("zodiac").textContent = zodiac;
    document.getElementById("weeks").textContent =
      `${weeks.toLocaleString()} weeks`;
    document.getElementById("hours").textContent =
      `${hours.toLocaleString()} hours`;
    document.getElementById("sleep-time").textContent = sleepTime;
    document.getElementById("milestones-list").innerHTML = milestonesHtml;

    // Chinese Zodiac Update
    const chineseZodiac = this.getChineseZodiac(birthDate.getFullYear());
    document.getElementById("chinese-zodiac-sign").textContent =
      chineseZodiac.emoji;
    document.getElementById("chinese-zodiac-name").textContent =
      chineseZodiac.name;

    // Cosmic Planet Ages Update
    document.getElementById("age-mercury").textContent = (
      totalDays / 87.97
    ).toFixed(2);
    document.getElementById("age-venus").textContent = (
      totalDays / 224.7
    ).toFixed(2);
    document.getElementById("age-mars").textContent = (
      totalDays / 686.98
    ).toFixed(2);
    document.getElementById("age-jupiter").textContent = (
      totalDays / 4332.59
    ).toFixed(2);
    document.getElementById("age-saturn").textContent = (
      totalDays / 10759.22
    ).toFixed(2);

    document.getElementById("result").style.display = "block";
  }

  setupEventListeners() {
    const calculateBtn = document.getElementById("calculate-btn");
    calculateBtn.addEventListener("click", () => this.calculate());

    const shareBtn = document.getElementById("share-btn");
    if (shareBtn) {
      shareBtn.addEventListener("click", () => this.shareStats());
    }

    const dobInput = document.getElementById("dob");
    dobInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.calculate();
      }
    });
  }
}

const app = new AgeCalculator();
