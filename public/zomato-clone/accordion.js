const accordion_containers = document.querySelectorAll(".accordion-container");

accordion_containers.forEach((accordion_container) => {
  accordion_container.addEventListener("click", function () {
    const data = this.nextElementSibling; // get data
    data.classList.toggle("show");
    const icon = this.querySelector("i");
    icon.classList.toggle("animate");
  });
});

document.addEventListener("DOMContentLoaded", () => {

  const states = [
    "Andhra Pradesh",
    "Assam",
    "Bihar",
    "Delhi",
    "Goa",
    "Gujarat",
    "Karnataka",
    "Kerala",
    "Maharashtra",
    "Punjab",
    "Rajasthan",
    "Tamil Nadu",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal"
  ];

  const locationInput = document.querySelector(".location-input");
  const dropdown = document.querySelector(".location-dropdown");
  const toggleBtn = document.querySelector(".dropdown-toggle");

  function renderDropdown(filteredStates) {

    dropdown.innerHTML = "";

    filteredStates.forEach((state) => {

      const item = document.createElement("div");

      item.classList.add("dropdown-item");

      item.textContent = state;

      item.addEventListener("click", () => {

        locationInput.value = state;

        dropdown.classList.add("hidden");
      });

      dropdown.appendChild(item);
    });
  }

  toggleBtn.addEventListener("click", (e) => {

    e.stopPropagation();

    renderDropdown(states);

    dropdown.classList.toggle("hidden");
  });

  locationInput.addEventListener("input", () => {

    const value = locationInput.value.toLowerCase();

    const filteredStates = states.filter((state) =>
      state.toLowerCase().includes(value)
    );

    renderDropdown(filteredStates);

    dropdown.classList.remove("hidden");
  });

  document.addEventListener("click", (e) => {

    if (!e.target.closest(".location")) {

      dropdown.classList.add("hidden");
    }
  });

   // ================== DARK MODE ==================
  const darkModeBtn = document.getElementById("darkModeToggle");

  // Apply saved theme on load
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    darkModeBtn.innerText = "☀️ Light Mode";
  } else {    
    darkModeBtn.innerText = "🌙 Dark Mode";
  }

  // Toggle theme
  darkModeBtn.addEventListener("click", () => {

    if (document.body.classList.contains("dark-mode")) {
      document.body.classList.remove("dark-mode");
      darkModeBtn.innerText = "🌙 Dark Mode";
      localStorage.setItem("theme", "light");

    } else {
      document.body.classList.add("dark-mode");
      darkModeBtn.innerText = "☀️ Light Mode";
      localStorage.setItem("theme", "dark");
    }

  });


});
