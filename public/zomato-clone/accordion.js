const accordion_containers = document.querySelectorAll(".accordion-container");

accordion_containers.forEach((accordion_container) => {
  accordion_container.addEventListener("click", function () {
    const data = this.nextElementSibling; // get data
    data.classList.toggle("show");
    const icon = this.querySelector("i");
    icon.classList.toggle("animate");
  });
});

const locationInput = document.querySelector(".location-input");
const locationContainer = document.querySelector(".location");

const cities = [
  "Delhi NCR",
  "Mumbai",
  "Kolkata",
  "Bangalore",
  "Chennai"
];

const dropdown = document.createElement("div");
dropdown.classList.add("location-dropdown");

cities.forEach((city) => {
  const option = document.createElement("div");
  option.classList.add("dropdown-item");
  option.innerText = city;

  option.addEventListener("click", () => {
    locationInput.value = city;
    dropdown.style.display = "none";
  });

  dropdown.appendChild(option);
});

locationContainer.appendChild(dropdown);

locationContainer.addEventListener("click", () => {
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
});