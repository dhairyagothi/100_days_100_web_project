document.addEventListener("DOMContentLoaded", () => {

  // Hero Section
  if (document.querySelector("#heroSection")) {
    gsap.fromTo(
      "#heroSection",
      {
        opacity: 0,
        y: -60,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
      }
    );
  }

  // Dashboard Cards
  if (document.querySelectorAll(".dashboard-card").length) {
    gsap.fromTo(
      ".dashboard-card",
      {
        opacity: 0,
        y: 40,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        delay: 0.3,
      }
    );
  }

  // Floating Orbs
  if (document.querySelector(".orb1")) {
    gsap.to(".orb1", {
      x: 250,
      y: 150,
      duration: 12,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }

  if (document.querySelector(".orb2")) {
    gsap.to(".orb2", {
      x: -200,
      y: 100,
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }

  if (document.querySelector(".orb3")) {
    gsap.to(".orb3", {
      x: 150,
      y: -100,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }

  // Template Button Hover
  document.querySelectorAll(".template-btn").forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      gsap.to(btn, {
        scale: 1.08,
        duration: 0.2,
      });
    });

    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, {
        scale: 1,
        duration: 0.2,
      });
    });
  });

});


// =============================
// Reusable Animation Functions
// =============================

function animatePromptOutput() {
  const output = document.querySelector("#optimizedOutput");

  if (!output) return;

  gsap.fromTo(
    output,
    {
      opacity: 0,
      y: 20,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out",
    }
  );
}

function animateCost() {
  const cost = document.querySelector("#costOutput");

  if (!cost) return;

  gsap.fromTo(
    cost,
    {
      scale: 1.2,
    },
    {
      scale: 1,
      duration: 0.3,
      ease: "back.out(1.7)",
    }
  );
}

function animateButtonClick() {
  const btn = document.querySelector("#optimizeBtn");

  if (!btn) return;

  gsap.fromTo(
    btn,
    {
      scale: 1,
    },
    {
      scale: 0.95,
      duration: 0.1,
      repeat: 1,
      yoyo: true,
    }
  );
}

function showToastAnimation() {
  const toast = document.querySelector("#toast");

  if (!toast) return;

  gsap.killTweensOf(toast);

  gsap.fromTo(
    toast,
    {
      x: 120,
      opacity: 0,
    },
    {
      x: 0,
      opacity: 1,
      duration: 0.4,
      ease: "back.out(1.7)",
    }
  );

  gsap.to(toast, {
    x: 120,
    opacity: 0,
    delay: 2,
    duration: 0.3,
  });
}

function animateCounter(element, value) {
  if (!element) return;

  gsap.to(element, {
    innerText: value,
    duration: 0.6,
    snap: {
      innerText: 1,
    },
    ease: "power2.out",
  });
}


// Make functions available to script.js
window.animatePromptOutput = animatePromptOutput;
window.animateCost = animateCost;
window.animateButtonClick = animateButtonClick;
window.showToastAnimation = showToastAnimation;
window.animateCounter = animateCounter;