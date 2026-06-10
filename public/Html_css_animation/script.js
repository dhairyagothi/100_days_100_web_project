
// ==========================
// INTRO LOADER
// ==========================

window.addEventListener("load", () => {

    const intro = document.querySelector(".intro-screen");

    setTimeout(() => {

        intro.classList.add("hide-intro");

    }, 4000);

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

        previewModal.style.display = "flex";

    });

});

previewCloseButtons.forEach(button => {

    button.addEventListener("click", () => {

        previewModal.style.display = "none";

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

        const animationKey =
            card.dataset.animation;

        const animation =
            animationLibrary[animationKey];

        if (!animation) return;

        codeTitle.textContent =
            animation.title + " Code";

        htmlCode.textContent =
            animation.html;

        cssCode.textContent =
            animation.css;

        codeModal.style.display = "flex";

    });

});

codeCloseButtons.forEach(button => {

    button.addEventListener("click", () => {

        codeModal.style.display = "none";

    });

});

// ==========================
// CLOSE ON OUTSIDE CLICK
// ==========================

window.addEventListener("click", (e) => {

    if (e.target === previewModal) {

        previewModal.style.display = "none";

    }

    if (e.target === codeModal) {

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

${htmlCode.textContent}

CSS

${cssCode.textContent}`;

        navigator.clipboard.writeText(allCode);

        copyButton.innerText = "Copied ✓";

        setTimeout(() => {

            copyButton.innerText = "Copy Code";

        }, 2000);

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
        card.querySelector("h3").innerText;

    btn.addEventListener("click", () => {

        modalTitle.textContent =
            title + " Preview";

    });

});

// ==========================
// ESC KEY CLOSE
// ==========================

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {

        previewModal.style.display = "none";
        codeModal.style.display = "none";

    }

});