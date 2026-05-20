const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
];

const days = [
    "Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday"
];

const now = new Date();

document.getElementById("month").textContent = months[now.getMonth()];
document.getElementById("year").textContent = now.getFullYear();
document.getElementById("day").textContent = days[now.getDay()];
document.getElementById("date").textContent = now.getDate();