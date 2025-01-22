
// // Menu Toggle Functionality
// const navMenu = document.getElementById('nav-menu');
// const navToggle = document.getElementById('nav-toggle');
// const navClose = document.getElementById('nav-close');

// if (navToggle) {
//   navToggle.addEventListener('click', () => {
//     navMenu.classList.add('show-menu');
//   });
// }

// if (navClose) {
//   navClose.addEventListener('click', () => {
//     navMenu.classList.remove('show-menu');
//   });
// }

// // Close Menu on Link Click
// const navLink = document.querySelectorAll('.nav__link');
// const linkAction = () => {
//   const navMenu = document.getElementById('nav-menu');
//   navMenu.classList.remove('show-menu');
// };
// navLink.forEach((n) => n.addEventListener('click', linkAction));

// // Blur Header on Scroll
// const blurHeader = () => {
//   const header = document.getElementById('header');
//   window.scrollY >= 50
//     ? header.classList.add('blur-header')
//     : header.classList.remove('blur-header');
// };
// window.addEventListener('scroll', blurHeader);

// // Handle Dream Submission
// document.getElementById('dreamForm').addEventListener('submit', function (event) {
//   event.preventDefault();
//   alert('Dream Submitted Successfully!');

//    // Get form inputs
//   const dateInput = document.getElementById('date').value.trim();
//   const dreamTypeInput = document.getElementById('dreamType').value.trim();
//   const nameInput = document.getElementById('name').value.trim();
//   const descriptionInput = document.querySelector('textarea[name="description"]').value.trim();

//   const newDream = {
//     date: dateInput,
//     type: dreamTypeInput,
//     name: nameInput,
//     description: descriptionInput,
//   };


//   if (!newDream.text) return; // Skip if input is empty

//   const dreams = JSON.parse(localStorage.getItem('dreams')) || [];
//   dreams.push(newDream);
//   localStorage.setItem('dreams', JSON.stringify(dreams));
//   document.getElementsById('dreamForm').reset();
//   alert('Dream saved successfully!!');
//   displayDreams();
// });

// function displayDreams() {
//   const dreams = JSON.parse(localStorage.getItem('dreams')) || [];
//   console.log("Dreams:", dreams);
//   const displayArea = document.getElementById('displayArea');

//   // Clear existing content 
//   displayArea.innerHTML = '<h3>Dream List</h3>';

//   // Display each dream
//   dreams.forEach((dream, index) => {
//   displayArea.innerHTML += 
//       `<pre>${JSON.stringify(dreams, null, 2)}</pre>;`
//   });
// }

// // Display dreams on page load
// displayDreams();

// Menu Toggle Functionality
const navMenu = document.getElementById("nav-menu");
const navToggle = document.getElementById("nav-toggle");
const navClose = document.getElementById("nav-close");

if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.add("show-menu");
  });
}

if (navClose) {
  navClose.addEventListener("click", () => {
    navMenu.classList.remove("show-menu");
  });
}

// Close Menu on Link Click
const navLink = document.querySelectorAll(".nav__link");
const linkAction = () => {
  const navMenu = document.getElementById("nav-menu");
  navMenu.classList.remove("show-menu");
};
navLink.forEach((n) => n.addEventListener("click", linkAction));

// Blur Header on Scroll
const blurHeader = () => {
  const header = document.getElementById("header");
  window.scrollY >= 50
    ? header.classList.add("blur-header")
    : header.classList.remove("blur-header");
};
window.addEventListener("scroll", blurHeader);

// Handle Dream Submission
document.getElementById("dreamForm").addEventListener("submit", function (event) {
  event.preventDefault();
  alert("Dream Submitted Successfully!");

  // Get form inputs
  const dateInput = document.getElementById("date").value.trim();
  const dreamTypeInput = document.getElementById("dreamType").value.trim();
  const nameInput = document.getElementById("name").value.trim();
  const descriptionInput = document.querySelector(
    'textarea[name="description"]'
  ).value.trim();

  if (!dateInput || !dreamTypeInput || !nameInput || !descriptionInput) {
    alert("All fields are required!");
    return;
  }

  const newDream = {
    date: dateInput,
    type: dreamTypeInput,
    name: nameInput,
    description: descriptionInput,
  };

  const dreams = JSON.parse(localStorage.getItem("dreams")) || [];
  dreams.push(newDream);
  localStorage.setItem("dreams", JSON.stringify(dreams));
  document.getElementById("dreamForm").reset();
  displayDreams();
});

// Display Dreams
function displayDreams() {
  const dreams = JSON.parse(localStorage.getItem("dreams")) || [];
  const displayArea = document.getElementById("displayArea");

  // Clear existing content
  displayArea.innerHTML = "<h3>Dream List</h3>";

  // Display each dream
  dreams.forEach((dream, index) => {
    displayArea.innerHTML += `
      <div class="dream-entry">
        <h4>${index + 1}. ${dream.name} - ${dream.type}</h4>
        <p><strong>Date:</strong> ${dream.date}</p>
        <p>${dream.description}</p>
        <button onclick="deleteDream(${index})">Delete</button>
      </div>
    `;
  });
}

// Delete Dream
function deleteDream(index) {
  const dreams = JSON.parse(localStorage.getItem("dreams")) || [];
  dreams.splice(index, 1);
  localStorage.setItem("dreams", JSON.stringify(dreams));
  displayDreams();
}

// Initial Display
displayDreams();
