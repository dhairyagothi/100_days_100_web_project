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

const placeSelector = document.getElementById('placeSelector');
const bookingButton = document.getElementById('bookingButton');
const placeTitle = document.getElementById('placeTitle');
const placeDescription = document.getElementById('placeDescription');
const body = document.body;

// Function to update place
function updatePlace(place) {
    body.style.backgroundImage = placeBackgrounds[place];
    placeTitle.textContent = place;
    placeDescription.textContent = placeDescriptions[place];
    bookingButton.textContent = `Book a Trip to ${place}`;

    bookingButton.classList.remove("booked");
}

// Change place event
placeSelector.addEventListener('change', function () {
    const selectedPlace = placeSelector.value;
    updatePlace(selectedPlace);
});

// Booking functionality
bookingButton.addEventListener('click', function () {
    const selectedPlace = placeSelector.value;

    alert(`Your trip to ${selectedPlace} has been booked successfully!`);

    bookingButton.textContent = `Trip Booked to ${selectedPlace} ✓`;

    bookingButton.classList.add("booked");
});

// Default load
window.onload = function () {
    const defaultPlace = "Iceland";
    updatePlace(defaultPlace);
    placeSelector.value = defaultPlace;
};