// ==========================================================================
// STANDALONE AUTH PAGE SWITCHER ENGINE
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  // 1. Target the correct interactive tab triggers
  const tabLogin = document.getElementById("tab-login");
  const tabRegister = document.getElementById("tab-register");

  // 2. Target the corresponding form containers
  const formLogin = document.getElementById("form-login");
  const formRegister = document.getElementById("form-register");

  // Safety check to ensure all components exist in the DOM
  if (tabLogin && tabRegister && formLogin && formRegister) {
    
    // Switch over to Registration / Create Account panel view
    tabRegister.addEventListener("click", () => {
      // Manage visually active highlights on the tab buttons
      tabRegister.classList.add("active");
      tabLogin.classList.remove("active");
      
      // Toggle form display layouts smoothly
      formRegister.classList.add("active");
      formLogin.classList.remove("active");
    });

    // Switch back to the Login / Sign In panel view
    tabLogin.addEventListener("click", () => {
      // Manage visually active highlights on the tab buttons
      tabLogin.classList.add("active");
      tabRegister.classList.remove("active");
      
      // Toggle form display layouts smoothly
      formLogin.classList.add("active");
      formRegister.classList.remove("active");
    });
  }

  // 3. Handle Form Interceptions safely
  if (formLogin) {
    formLogin.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("Sign In data intercepted. Ready for production integration.");
    });
  }

  if (formRegister) {
    formRegister.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("Create Account verification active. Ready for production integration.");
    });
  }
});