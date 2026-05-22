const placeBackgrounds = {
    "Iceland": "url('images/iceland.jpg')",
    "Switzerland": "url('images/Jennifer.avif')",
    "Scotland": "url('images/Daniel.jpeg')",
    "Ireland": "url('images/kai.jpg')",
    "Germany": "url('images/Hannes-Becker4.jpg')"
};

const placeDescriptions = {
    "Iceland": "Explore the beauty of glaciers and the breathtaking landscapes of Iceland.",

    "Switzerland": "Experience the serene beauty of the Swiss Alps and picturesque villages.",

    "Scotland": "Discover the rich history and stunning highlands of Scotland.",

    "Ireland": "Immerse yourself in the lush green landscapes and vibrant culture of Ireland.",

    "Germany": "Explore Germany's charming cities and stunning countryside."
};

const placeInfo = {

    "Iceland": {
        weather: "2°C",
        rating: "4.9"
    },

    "Switzerland": {
        weather: "8°C",
        rating: "4.8"
    },

    "Scotland": {
        weather: "6°C",
        rating: "4.7"
    },

    "Ireland": {
        weather: "9°C",
        rating: "4.6"
    },

    "Germany": {
        weather: "11°C",
        rating: "4.8"
    }
};

const places = Object.keys(placeBackgrounds);

const placeSelector = document.getElementById("placeSelector");
const bookingButton = document.getElementById("bookingButton");
const placeTitle = document.getElementById("placeTitle");
const placeDescription = document.getElementById("placeDescription");
const weather = document.getElementById("weather");
const rating = document.getElementById("rating");

const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

const body = document.body;

let currentIndex = 0;
let autoSlide;

// =========================
// UPDATE UI
// =========================
function updatePlace(place) {

    body.style.backgroundImage = placeBackgrounds[place];

    placeTitle.textContent = place;

    placeDescription.textContent = placeDescriptions[place];

    bookingButton.textContent = `Book a Trip to ${place}`;

    weather.textContent =
    `🌤 Weather: ${placeInfo[place].weather}`;

    rating.textContent =
    `⭐ Rating: ${placeInfo[place].rating}`;

    placeSelector.value = place;
}

// =========================
// NEXT PLACE
// =========================
function nextPlace() {

    currentIndex++;

    if(currentIndex >= places.length){
        currentIndex = 0;
    }

    updatePlace(places[currentIndex]);
}

// =========================
// PREVIOUS PLACE
// =========================
function previousPlace() {

    currentIndex--;

    if(currentIndex < 0){
        currentIndex = places.length - 1;
    }

    updatePlace(places[currentIndex]);
}

// =========================
// NEXT BUTTON
// =========================
nextBtn.addEventListener("click", () => {

    nextPlace();

    resetAutoSlide();
});

// =========================
// PREVIOUS BUTTON
// =========================
prevBtn.addEventListener("click", () => {

    previousPlace();

    resetAutoSlide();
});

// =========================
// DROPDOWN CHANGE
// =========================
placeSelector.addEventListener("change", () => {

    const selectedPlace = placeSelector.value;

    currentIndex = places.indexOf(selectedPlace);

    updatePlace(selectedPlace);

    resetAutoSlide();
});

// =========================
// KEYBOARD NAVIGATION
// =========================
document.addEventListener("keydown", (e) => {

    if(e.key === "ArrowRight"){

        nextPlace();

        resetAutoSlide();
    }

    if(e.key === "ArrowLeft"){

        previousPlace();

        resetAutoSlide();
    }
});

// =========================
// AUTO SLIDE
// =========================
function startAutoSlide(){

    autoSlide = setInterval(() => {

        nextPlace();

    }, 4000);
}

// =========================
// RESET AUTO SLIDE
// =========================
function resetAutoSlide(){

    clearInterval(autoSlide);

    startAutoSlide();
}

// =========================
// PAUSE ON HOVER
// =========================
document.querySelector(".content")
.addEventListener("mouseenter", () => {

    clearInterval(autoSlide);
});

document.querySelector(".content")
.addEventListener("mouseleave", () => {

    startAutoSlide();
});

// =========================
// TOAST NOTIFICATION
// =========================
function showToast(message){

    const toast = document.getElementById("toast");

    toast.textContent = message;

    toast.style.opacity = "1";

    setTimeout(() => {

        toast.style.opacity = "0";

    }, 3000);
}

// =========================
// BOOKING BUTTON
// =========================
bookingButton.addEventListener("click", () => {

    showToast(
        `Trip to ${placeTitle.textContent} booked successfully ✈`
    );
});

// =========================
// INITIALIZE
// =========================
window.onload = () => {

    updatePlace(places[currentIndex]);

    startAutoSlide();
};