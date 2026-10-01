// script.js - Advanced Password Reset with Animations

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("resetForm");
  const usernameInput = document.getElementById("username");
  const newPasswordInput = document.getElementById("newPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const submitBtn = document.getElementById("submitBtn");
  const successMessage = document.getElementById("successMessage");
  const passwordStrengthContainer = document.getElementById("passwordStrength");
  const strengthBar = passwordStrengthContainer.querySelector(".strength-bar");

  // Canvas Background Animation
  const canvas = document.getElementById("bgCanvas");
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  let particles = [];
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedX = Math.random() * 0.5 - 0.25;
      this.speedY = Math.random() * 0.5 - 0.25;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
      ctx.fillStyle = "#6366f1";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < 80; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          ctx.strokeStyle = `rgba(99, 102, 241, ${1 - distance / 120})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    connectParticles();
    requestAnimationFrame(animateBackground);
  }

  initParticles();
  animateBackground();

  // Password Toggle
  document.querySelectorAll(".toggle-password").forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      const input = document.getElementById(targetId);
      const icon = button.querySelector("i");

      if (input.type === "password") {
        input.type = "text";
        icon.classList.replace("bi-eye", "bi-eye-slash");
      } else {
        input.type = "password";
        icon.classList.replace("bi-eye-slash", "bi-eye");
      }
    });
  });

  // Password Strength Meter
  function updatePasswordStrength(password) {
    if (password.length === 0) {
      passwordStrengthContainer.classList.add("d-none");
      return;
    }

    passwordStrengthContainer.classList.remove("d-none");

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    strengthBar.className = "strength-bar";

    if (score <= 2) {
      strengthBar.classList.add("strength-weak");
      strengthBar.style.width = "40%";
    } else if (score === 3) {
      strengthBar.classList.add("strength-medium");
      strengthBar.style.width = "70%";
    } else {
      strengthBar.classList.add("strength-strong");
      strengthBar.style.width = "100%";
    }
  }

  newPasswordInput.addEventListener("input", () => {
    updatePasswordStrength(newPasswordInput.value);
    validatePasswordMatch();
  });

  confirmPasswordInput.addEventListener("input", validatePasswordMatch);

  function validatePasswordMatch() {
    if (confirmPasswordInput.value) {
      if (newPasswordInput.value !== confirmPasswordInput.value) {
        confirmPasswordInput.classList.add("is-invalid");
      } else {
        confirmPasswordInput.classList.remove("is-invalid");
      }
    }
  }

  // Form Validation
  function validateForm() {
    let isValid = true;

    // Username
    if (!usernameInput.value.trim()) {
      usernameInput.classList.add("is-invalid");
      isValid = false;
    } else {
      usernameInput.classList.remove("is-invalid");
    }

    const password = newPasswordInput.value;
    if (password.length < 8) {
      newPasswordInput.classList.add("is-invalid");
      document.getElementById("passwordFeedback").textContent =
        "Password must be at least 8 characters.";
      isValid = false;
    } else if (
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      newPasswordInput.classList.add("is-invalid");
      document.getElementById("passwordFeedback").textContent =
        "Must include uppercase, number & special character.";
      isValid = false;
    } else {
      newPasswordInput.classList.remove("is-invalid");
    }

    // Confirm Password
    if (password !== confirmPasswordInput.value) {
      confirmPasswordInput.classList.add("is-invalid");
      document.getElementById("confirmFeedback").textContent =
        "Passwords do not match.";
      isValid = false;
    } else {
      confirmPasswordInput.classList.remove("is-invalid");
    }

    return isValid;
  }

  // Confetti Animation on Success
  function triggerConfetti() {
    const colors = ["#6366f1", "#22c55e", "#eab308", "#ec4899"];
    for (let i = 0; i < 80; i++) {
      setTimeout(() => {
        const confetti = document.createElement("div");
        confetti.style.position = "fixed";
        confetti.style.left = Math.random() * 100 + "vw";
        confetti.style.top = "-10px";
        confetti.style.width = "10px";
        confetti.style.height = "10px";
        confetti.style.backgroundColor =
          colors[Math.floor(Math.random() * colors.length)];
        confetti.style.opacity = Math.random() + 0.5;
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        confetti.style.zIndex = "1000";
        document.body.appendChild(confetti);

        let y = -10;
        const fall = setInterval(() => {
          y += 8 + Math.random() * 6;
          confetti.style.top = y + "px";
          confetti.style.left =
            parseFloat(confetti.style.left) + (Math.random() - 0.5) * 4 + "vw";
          if (y > window.innerHeight) {
            clearInterval(fall);
            confetti.remove();
          }
        }, 20);
      }, Math.random() * 600);
    }
  }

  // Form Submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Loading State
    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm me-2"></span>
            Resetting Password...
        `;

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1600));

    // Show Success
    form.classList.add("d-none");
    successMessage.classList.remove("d-none");

    triggerConfetti();

    // Reset button
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  });

  // Remove invalid feedback on input
  [usernameInput, newPasswordInput, confirmPasswordInput].forEach((input) => {
    input.addEventListener("input", () => {
      input.classList.remove("is-invalid");
    });
  });
});
