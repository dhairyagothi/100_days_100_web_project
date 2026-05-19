document.addEventListener('DOMContentLoaded', () => {
    const dobInput = document.getElementById('dob');
    const currentDateInput = document.getElementById('current-date');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsContainer = document.getElementById('results');
    
    // Auto-fill today's date
    const today = new Date().toISOString().split('T')[0];
    currentDateInput.value = today;

    calculateBtn.addEventListener('click', () => {
        const dobValue = dobInput.value;
        const targetDateValue = currentDateInput.value;

        if (!dobValue) {
            alert('Please select your Date of Birth.');
            return;
        }

        const birthDate = new Date(dobValue);
        const targetDate = new Date(targetDateValue);

        if (birthDate > targetDate) {
            alert('Date of Birth cannot be in the future relative to the comparison date.');
            return;
        }

        calculateExactAge(birthDate, targetDate);
        calculateNextBirthday(birthDate, targetDate);
        determineZodiacSign(birthDate);
        calculateExtraStats(birthDate, targetDate);

        resultsContainer.classList.remove('hidden');
    });

    function calculateExactAge(birth, target) {
        let years = target.getFullYear() - birth.getFullYear();
        let months = target.getMonth() - birth.getMonth();
        let days = target.getDate() - birth.getDate();

        if (days < 0) {
            months--;
            // Get last day of previous month
            const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
            days += prevMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        document.getElementById('exact-age').innerText = 
            `${years} Years, ${months} Months, ${days} Days`;
    }

    function calculateNextBirthday(birth, target) {
        let nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
        
        if (target > nextBday) {
            nextBday.setFullYear(target.getFullYear() + 1);
        }

        const timeDiff = nextBday - target;
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (daysLeft === 365 || daysLeft === 0) {
            document.getElementById('birthday-countdown').innerText = "🎉 Happy Birthday! It's Today!";
        } else {
            document.getElementById('birthday-countdown').innerText = `${daysLeft} days remaining`;
        }
    }

    function determineZodiacSign(birth) {
        const month = birth.getMonth() + 1;
        const day = birth.getDate();
        let sign = "";

        if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) sign = "Aries ♈";
        else if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) sign = "Taurus ♉";
        else if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) sign = "Gemini ♊";
        else if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) sign = "Cancer ♋";
        else if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) sign = "Leo ♌";
        else if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) sign = "Virgo ♍";
        else if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) sign = "Libra ♎";
        else if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) sign = "Scorpio ♏";
        else if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) sign = "Sagittarius ♐";
        else if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) sign = "Capricorn ♑";
        else if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) sign = "Aquarius ♒";
        else sign = "Pisces ♓";

        document.getElementById('zodiac-sign').innerText = sign;
    }

    function calculateExtraStats(birth, target) {
        const diffInMs = target - birth;
        const totalHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const totalWeeks = Math.floor(totalHours / (24 * 7));
        const remainingHours = totalHours % (24 * 7);

        document.getElementById('extra-stats').innerText = 
            `${totalWeeks.toLocaleString()} weeks, ${remainingHours} hours`;
    }
});