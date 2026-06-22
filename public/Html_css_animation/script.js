// ==========================
// INTRO LOADER
// ==========================

window.addEventListener("load", () => {

    const intro = document.querySelector(".intro-screen");

    if (intro) {
        setTimeout(() => {
            intro.classList.add("hide-intro");
        }, 4000);
    }

});

// ==========================
// PREVIEW MODAL
// ==========================

const previewButtons =
    document.querySelectorAll(".preview-btn");

const previewModal =
    document.querySelector(".preview-modal");

const previewCloseButtons =
    document.querySelectorAll(".preview-modal .close-btn");

previewButtons.forEach(button => {

    button.addEventListener("click", () => {

        if (previewModal) {
            previewModal.style.display = "flex";
        }

    });

});

previewCloseButtons.forEach(button => {

    button.addEventListener("click", () => {

        if (previewModal) {
            previewModal.style.display = "none";
        }

    });

});

// ==========================
// DYNAMIC CODE MODAL
// ==========================

const codeButtons =
    document.querySelectorAll(".code-btn");

const codeModal =
    document.querySelector(".code-modal");

const htmlCode =
    document.querySelector("#html-code");

const cssCode =
    document.querySelector("#css-code");

const codeTitle =
    document.querySelector("#code-title");

const codeCloseButtons =
    document.querySelectorAll(".code-modal .close-btn");

codeButtons.forEach(button => {

    button.addEventListener("click", () => {

        const card =
            button.closest(".animation-card");

        if (!card) return;

        const animationKey =
            card.dataset.animation;

        const animation =
            animationLibrary[animationKey];

        if (!animation) {
            console.warn(`Animation "${animationKey}" not found`);
            return;
        }

        if (codeTitle) {
            codeTitle.textContent =
                animation.title + " Code";
        }

        if (htmlCode) {
            htmlCode.textContent =
                animation.html;
        }

        if (cssCode) {
            cssCode.textContent =
                animation.css;
        }

        if (codeModal) {
            codeModal.style.display = "flex";
        }

    });

});

codeCloseButtons.forEach(button => {

    button.addEventListener("click", () => {

        if (codeModal) {
            codeModal.style.display = "none";
        }

    });

});

// ==========================
// CLOSE ON OUTSIDE CLICK
// ==========================

window.addEventListener("click", (e) => {

    if (e.target === previewModal && previewModal) {

        previewModal.style.display = "none";

    }

    if (e.target === codeModal && codeModal) {

        codeModal.style.display = "none";

    }

});

// ==========================
// COPY CODE BUTTON
// ==========================

const copyButton = document.querySelector(".copy-btn");

if (copyButton) {

    copyButton.addEventListener("click", () => {

        const allCode =
`HTML

${htmlCode?.textContent || ""}

CSS

${cssCode?.textContent || ""}`;

        navigator.clipboard.writeText(allCode)
            .then(() => {

                copyButton.innerText = "Copied ✓";

                setTimeout(() => {

                    copyButton.innerText = "Copy Code";

                }, 2000);

            })
            .catch(() => {

                copyButton.innerText = "Copy Failed";

                setTimeout(() => {

                    copyButton.innerText = "Copy Code";

                }, 2000);

            });

    });

}

// ==========================
// DYNAMIC ANIMATION TITLES
// ==========================

const cards =
    document.querySelectorAll(".animation-card");

const modalTitle =
    document.querySelector(".preview-modal h2");

cards.forEach(card => {

    const btn =
        card.querySelector(".preview-btn");

    const title =
        card.querySelector("h3")?.innerText;

    if (!btn || !title) return;

    btn.addEventListener("click", () => {

        if (modalTitle) {
            modalTitle.textContent =
                title + " Preview";
        }

    });

});

// ==========================
// ESC KEY CLOSE
// ==========================

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {

        if (previewModal) {
            previewModal.style.display = "none";
        }

        if (codeModal) {
            codeModal.style.display = "none";
        }

    }

});

// ==========================
// Search Animations
// ==========================

const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");
const filterSelect = document.getElementById("filterSelect");
const animationCards = document.querySelectorAll(".animation-card");

function filterCards() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedCategory = filterSelect.value.toLowerCase();

  animationCards.forEach((card) => {
    // Search by animation title
    const animationName = card
      .querySelector("h3")
      .textContent
      .trim()
      .toLowerCase();

    // Filter by data-category
    const cardCategory = (
      card.dataset.category || ""
    ).trim().toLowerCase();

    const matchesSearch =
      searchTerm === "" ||
      animationName.includes(searchTerm);

    const matchesCategory =
      selectedCategory === "all" ||
      cardCategory === selectedCategory;

    if (matchesSearch && matchesCategory) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });

  // Show/hide clear icon
  clearSearch.style.display =
    searchTerm.length > 0 ? "block" : "none";
}

// Search while typing
searchInput.addEventListener("input", filterCards);

// Filter dropdown change
filterSelect.addEventListener("change", filterCards);

// Clear search
clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  filterSelect.value = "all";
  filterCards();
});

// Initial load
filterCards();

// ==========================
// Theme Toggle
// ==========================

const themeToggle = document.getElementById("themeToggle");

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-theme");
  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");

  const isDark = document.body.classList.contains("dark-theme");

  themeToggle.textContent = isDark ? "☀️" : "🌙";

  localStorage.setItem(
    "theme",
    isDark ? "dark" : "light"
  );
});