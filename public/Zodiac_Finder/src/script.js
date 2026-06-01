const name = localStorage.getItem('name');
const dob = new Date(localStorage.getItem('dob'));
const month = dob.getMonth() + 1;
const day = dob.getDate();

const getZodiacSign = (day, month) => {
    if ((month ==  1 && day >= 20) || (month ==  2 && day <= 18)) return "Aquarius";
    if ((month ==  2 && day >= 19) || (month ==  3 && day <= 20)) return "Pisces";
    if ((month ==  3 && day >= 21) || (month ==  4 && day <= 19)) return "Aries";
    if ((month ==  4 && day >= 20) || (month ==  5 && day <= 20)) return "Taurus";
    if ((month ==  5 && day >= 21) || (month ==  6 && day <= 20)) return "Gemini";
    if ((month ==  6 && day >= 21) || (month ==  7 && day <= 22)) return "Cancer";
    if ((month ==  7 && day >= 23) || (month ==  8 && day <= 22)) return "Leo";
    if ((month ==  8 && day >= 23) || (month ==  9 && day <= 22)) return "Virgo";
    if ((month ==  9 && day >= 23) || (month == 10 && day <= 22)) return "Libra";
    if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return "Scorpio";
    if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return "Sagittarius";
    if ((month == 12 && day >= 22) || (month ==  1 && day <= 19)) return "Capricorn";
};

const zodiac = getZodiacSign(day, month);

document.getElementById('greeting').textContent = `Hello, ${name}!`;
document.getElementById('zodiac').textContent = `Your Zodiac Sign is: ${zodiac}`;

const zodiacImages = {
    "Aquarius": "img/aquarius.png",
    "Pisces": "img/pisces.png",
    "Aries": "img/aries.png",
    "Taurus": "img/taurus.png",
    "Gemini": "img/gemeni.png",
    "Cancer": "img/cancer.png",
    "Leo": "img/leo.png",
    "Virgo": "img/virgo.png",
    "Libra": "img/libra.png",
    "Scorpio": "img/scorpio.png",
    "Sagittarius": "img/sagittarius.png",
    "Capricorn": "img/capricorn.png"
};

const zodiacBackground = document.getElementById('zodiacBackground');
zodiacBackground.style.backgroundImage = `url(${zodiacImages[zodiac]})`;
zodiacBackground.style.backgroundSize = 'contain'; 
zodiacBackground.style.backgroundRepeat = 'no-repeat'; 
zodiacBackground.style.backgroundPosition = 'center'; 
