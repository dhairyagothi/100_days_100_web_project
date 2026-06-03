(() => {
  const overlay = document.getElementById("authOverlay");
  if (!overlay || !window.medAuth) {
    return;
  }

  const loginPanel = overlay.querySelector('[data-auth-panel="login"]');
  const signupPanel = overlay.querySelector('[data-auth-panel="signup"]');

  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  const loginError = document.getElementById("loginError");
  const signupError = document.getElementById("signupError");

  const authSubtitle = document.getElementById("authSubtitle");
  const loginTrigger = document.getElementById("loginTrigger");

  const switchButtons = overlay.querySelectorAll("[data-auth-switch]");

  const setPanel = (mode) => {
    if (mode === "signup") {
      loginPanel.classList.add("is-hidden");
      signupPanel.classList.remove("is-hidden");
      if (authSubtitle) {
        authSubtitle.textContent = "Create your MedConsult account";
      }
    } else {
      loginPanel.classList.remove("is-hidden");
      signupPanel.classList.add("is-hidden");
      if (authSubtitle) {
        authSubtitle.textContent = "Sign in to continue";
      }
    }

    if (loginError) loginError.textContent = "";
    if (signupError) signupError.textContent = "";
  };

  const openAuth = (mode = "login") => {
    setPanel(mode);
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");

    const firstInput = overlay.querySelector(
      mode === "signup" ? "#signupName" : "#loginEmail",
    );
    if (firstInput) {
      firstInput.focus();
    }
  };

  const closeAuth = () => {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
  };

  if (loginTrigger) {
    loginTrigger.addEventListener("click", () => openAuth("login"));
  }

  switchButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-auth-switch");
      setPanel(target);
    });
  });

  const setLoading = (button, isLoading, text) => {
    if (!button) return;
    if (isLoading) {
      button.dataset.originalText = button.textContent;
      button.textContent = text;
      button.classList.add("is-loading");
      button.disabled = true;
    } else {
      button.textContent = button.dataset.originalText || "Submit";
      button.classList.remove("is-loading");
      button.disabled = false;
    }
  };

  const showMessage = (element, message) => {
    if (element) {
      element.textContent = message;
    }
  };

  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const email = document
        .getElementById("loginEmail")
        .value.trim()
        .toLowerCase();
      const password = document.getElementById("loginPassword").value.trim();
      const remember = document.getElementById("rememberMe").checked;

      showMessage(loginError, "");

      if (!email || !password) {
        showMessage(loginError, "Please fill out all login fields.");
        if (typeof showToast === "function") {
          showToast("Please fill out all login fields.", "error");
        }
        return;
      }

      if (!window.medAuth.emailPattern.test(email)) {
        showMessage(loginError, "Please enter a valid email address.");
        if (typeof showToast === "function") {
          showToast("Please enter a valid email address.", "error");
        }
        return;
      }

      const submitBtn = loginForm.querySelector("button[type='submit']");
      setLoading(submitBtn, true, "Signing In...");

      setTimeout(() => {
        const users = window.medAuth.getUsers();
        const encoded = window.medAuth.encodePassword(password);

        const match = users.find(
          (user) =>
            user.email.toLowerCase() === email && user.password === encoded,
        );

        if (!match) {
          setLoading(submitBtn, false);
          showMessage(loginError, "Invalid credentials.");
          if (typeof showToast === "function") {
            showToast("Invalid credentials", "error");
          }
          return;
        }

        const currentUser = {
          id: match.id,
          name: match.name,
          email: match.email,
          role: match.role,
        };

        window.medAuth.setCurrentUser(currentUser, remember);
        window.medAuth.applyAuthGuard();
        window.medAuth.notifyAuthChange();

        if (typeof showToast === "function") {
          showToast("Login successful", "success");
        }

        loginForm.reset();
        setLoading(submitBtn, false);
        closeAuth();
      }, 600);
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("signupName").value.trim();
      const email = document
        .getElementById("signupEmail")
        .value.trim()
        .toLowerCase();
      const password = document.getElementById("signupPassword").value.trim();
      const confirmPassword = document
        .getElementById("signupConfirm")
        .value.trim();
      const role = document.getElementById("signupRole").value;

      showMessage(signupError, "");

      if (!name || !email || !password || !confirmPassword || !role) {
        showMessage(signupError, "All fields are required.");
        if (typeof showToast === "function") {
          showToast("All fields are required", "error");
        }
        return;
      }

      if (!window.medAuth.emailPattern.test(email)) {
        showMessage(signupError, "Please enter a valid email address.");
        if (typeof showToast === "function") {
          showToast("Invalid email format", "error");
        }
        return;
      }

      if (password.length < 8) {
        showMessage(signupError, "Password must be at least 8 characters.");
        if (typeof showToast === "function") {
          showToast("Password must be at least 8 characters", "error");
        }
        return;
      }

      if (password !== confirmPassword) {
        showMessage(signupError, "Passwords do not match.");
        if (typeof showToast === "function") {
          showToast("Passwords do not match", "error");
        }
        return;
      }

      const users = window.medAuth.getUsers();
      const exists = users.some((user) => user.email.toLowerCase() === email);

      if (exists) {
        showMessage(signupError, "Email already registered.");
        if (typeof showToast === "function") {
          showToast("Email already registered", "error");
        }
        return;
      }

      const submitBtn = signupForm.querySelector("button[type='submit']");
      setLoading(submitBtn, true, "Creating Account...");

      setTimeout(() => {
        const newUser = {
          id: Date.now(),
          name,
          email,
          password: window.medAuth.encodePassword(password),
          role,
        };

        users.unshift(newUser);
        window.medAuth.saveUsers(users);

        setLoading(submitBtn, false);

        if (typeof showToast === "function") {
          showToast("Account created successfully", "success");
        }

        signupForm.reset();
        setPanel("login");
      }, 700);
    });
  }

  document.addEventListener("auth:changed", () => {
    const user = window.medAuth.getCurrentUser();
    if (user) {
      closeAuth();
    }
  });

  window.medAuth.openAuth = openAuth;
})();

function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isHidden = input.type === "password";
  input.type = isHidden ? "text" : "password";
  const eyeOpen = btn.querySelector(".eye-open");
  const eyeClosed = btn.querySelector(".eye-closed");
  if (eyeOpen) eyeOpen.style.display = isHidden ? "" : "none";
  if (eyeClosed) eyeClosed.style.display = isHidden ? "none" : "";
}