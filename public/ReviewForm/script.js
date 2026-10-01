// script.js - Enhanced ReviewVibe

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const form = document.getElementById("reviewForm");
  const emojis = document.querySelectorAll(".emoji");
  const stars = document.querySelectorAll(".star");
  const ratingInput = document.getElementById("rating");
  const ratingLabel = document.getElementById("ratingLabel");
  const nameInput = document.getElementById("name");
  const commentInput = document.getElementById("comment");
  const categorySelect = document.getElementById("category");
  const reviewImage = document.getElementById("reviewImage");
  const imagePreview = document.getElementById("imagePreview");
  const previewImage = document.getElementById("previewImage");
  const livePreview = document.getElementById("livePreview");
  const previewEmoji = document.getElementById("previewEmoji");
  const previewName = document.getElementById("previewName");
  const previewComment = document.getElementById("previewComment");
  const previewCategory = document.getElementById("previewCategory");
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");
  const charCount = document.getElementById("charCount");
  const reviewsContainer = document.getElementById("reviewsContainer");
  const sortReviews = document.getElementById("sortReviews");
  const clearReviewsBtn = document.getElementById("clearReviews");
  const themeToggle = document.getElementById("themeToggle");
  const toggleRatingBtn = document.getElementById("toggleRating");
  const successModal = new bootstrap.Modal(
    document.getElementById("successModal"),
  );
  const successTitle = document.getElementById("successTitle");
  const successMessage = document.getElementById("successMessage");

  let currentRating = 0;
  let currentRatingType = "emoji"; // 'emoji' or 'star'
  let selectedImageBase64 = null;

  const ratingMessages = {
    1: "Very Poor 😡",
    2: "Poor 🙁",
    3: "Neutral 😐",
    4: "Good 🙂",
    5: "Excellent 😍",
  };

  const emojiColors = {
    1: "#dc3545",
    2: "#fd7e14",
    3: "#ffc107",
    4: "#198754",
    5: "#0d6efd",
  };

  // Theme Toggle
  function toggleTheme() {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    themeToggle.innerHTML = isDark
      ? '<i class="bi bi-sun-fill"></i>'
      : '<i class="bi bi-moon-stars-fill"></i>';
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
  }
  themeToggle.addEventListener("click", toggleTheme);

  // Toggle between Emoji and Star Rating
  toggleRatingBtn.addEventListener("click", () => {
    if (currentRatingType === "emoji") {
      document.getElementById("emojiRating").classList.add("d-none");
      document.getElementById("starRating").classList.remove("d-none");
      toggleRatingBtn.textContent = "Switch to Emojis";
      currentRatingType = "star";
    } else {
      document.getElementById("emojiRating").classList.remove("d-none");
      document.getElementById("starRating").classList.add("d-none");
      toggleRatingBtn.textContent = "Switch to Stars";
      currentRatingType = "emoji";
    }
  });

  // Rating Selection (Emoji)
  emojis.forEach((emoji) => {
    emoji.addEventListener("click", () =>
      selectRating(parseInt(emoji.dataset.rating), emoji),
    );
  });

  // Rating Selection (Stars)
  stars.forEach((star) => {
    star.addEventListener("click", () =>
      selectRating(parseInt(star.dataset.rating), star),
    );
  });

  function selectRating(rating, element) {
    currentRating = rating;
    ratingInput.value = rating;
    ratingLabel.textContent = ratingMessages[rating];
    ratingLabel.style.color = emojiColors[rating];

    // Clear all selections
    emojis.forEach((e) => e.classList.remove("selected"));
    stars.forEach((s) => s.classList.remove("selected"));

    // Select current
    if (currentRatingType === "emoji") {
      element.classList.add("selected");
    } else {
      // Fill all stars up to selected
      stars.forEach((s) => {
        s.classList.toggle("selected", parseInt(s.dataset.rating) <= rating);
      });
    }

    updateLivePreview();
    updateProgress();
  }

  // Character Counter
  commentInput.addEventListener("input", () => {
    const count = commentInput.value.length;
    charCount.textContent = count;
    charCount.classList.toggle("text-danger", count > 450);
    updateLivePreview();
    updateProgress();
  });

  // Image Upload
  reviewImage.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (ev) {
        selectedImageBase64 = ev.target.result;
        imagePreview.classList.remove("d-none");
        imagePreview.querySelector("img").src = selectedImageBase64;
        updateLivePreview();
      };
      reader.readAsDataURL(file);
    }
  });

  // Live Preview
  function updateLivePreview() {
    previewName.textContent = nameInput.value.trim() || "Your Name";
    previewComment.textContent = commentInput.value.trim()
      ? `"${commentInput.value}"`
      : "Your review will appear here...";
    previewCategory.textContent = categorySelect.value || "";

    if (currentRating > 0) {
      previewEmoji.textContent =
        currentRatingType === "emoji"
          ? Array.from(emojis).find(
              (e) => parseInt(e.dataset.rating) === currentRating,
            ).textContent
          : "⭐";
      previewEmoji.style.color = emojiColors[currentRating];
    }

    if (selectedImageBase64) {
      previewImage.src = selectedImageBase64;
      previewImage.classList.remove("d-none");
    } else {
      previewImage.classList.add("d-none");
    }
  }

  nameInput.addEventListener("input", () => {
    updateLivePreview();
    updateProgress();
  });
  commentInput.addEventListener("input", () => {
    updateLivePreview();
    updateProgress();
  });
  categorySelect.addEventListener("change", () => {
    updateLivePreview();
    updateProgress();
  });

  // Progress Bar
  function updateProgress() {
    let progress = 0;
    if (currentRating > 0) progress += 25;
    if (categorySelect.value) progress += 20;
    if (nameInput.value.trim()) progress += 20;
    if (commentInput.value.trim()) progress += 25;
    if (selectedImageBase64) progress += 10;

    progressBar.style.width = `${Math.min(progress, 100)}%`;
    progressText.textContent = `${Math.min(progress, 100)}%`;

    if (progress >= 100) {
      progressBar.classList.add("bg-success");
    } else {
      progressBar.classList.remove("bg-success");
    }
  }

  // Confetti
  function launchConfetti() {
    const container = document.getElementById("confettiContainer");
    for (let i = 0; i < 200; i++) {
      const confetti = document.createElement("div");
      confetti.style.position = "absolute";
      confetti.style.width = `${Math.random() * 10 + 6}px`;
      confetti.style.height = confetti.style.width;
      confetti.style.borderRadius = "50%";
      confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 90%, 65%)`;
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.top = `-20px`;
      container.appendChild(confetti);

      const duration = Math.random() * 2800 + 2200;
      confetti.animate(
        [
          { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
          {
            transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 800 - 400}deg)`,
            opacity: 0,
          },
        ],
        { duration, easing: "cubic-bezier(0.25, 0.1, 0.25, 1)" },
      );

      setTimeout(() => confetti.remove(), duration);
    }
  }

  // Load Reviews
  function loadReviews() {
    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

    const sortValue = sortReviews.value;
    if (sortValue === "highest") {
      reviews.sort((a, b) => b.rating - a.rating);
    } else if (sortValue === "lowest") {
      reviews.sort((a, b) => a.rating - b.rating);
    } else {
      reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    reviewsContainer.innerHTML = "";

    if (reviews.length === 0) {
      reviewsContainer.innerHTML = `<div class="col-12 text-center py-5 text-muted">No reviews yet. Be the first!</div>`;
      return;
    }

    reviews.forEach((review) => {
      const html = `
                <div class="col-md-6">
                    <div class="card review-card h-100 shadow-sm">
                        <div class="card-body">
                            <div class="d-flex align-items-start gap-3">
                                <span class="fs-1">${review.emoji}</span>
                                <div class="flex-grow-1">
                                    <h6 class="mb-1">${review.name}</h6>
                                    <small class="text-muted">${review.category} • ${new Date(review.date).toLocaleDateString()}</small>
                                    ${review.image ? `<img src="${review.image}" class="img-fluid mt-2 rounded" alt="Review photo">` : ""}
                                    <p class="mt-2 mb-0">"${review.comment}"</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
      reviewsContainer.innerHTML += html;
    });
  }

  // Form Submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!currentRating) {
      alert("Please select a rating!");
      return;
    }

    const reviewData = {
      name: nameInput.value.trim(),
      comment: commentInput.value.trim(),
      category: categorySelect.value,
      rating: currentRating,
      emoji:
        currentRatingType === "emoji"
          ? Array.from(emojis).find(
              (e) => parseInt(e.dataset.rating) === currentRating,
            ).textContent
          : "⭐",
      image: selectedImageBase64,
      date: new Date().toISOString(),
    };

    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    reviews.unshift(reviewData);
    localStorage.setItem("reviews", JSON.stringify(reviews));

    // Success Modal
    successTitle.textContent = "Thank You!";
    successMessage.innerHTML = `Your <strong>${reviewData.category}</strong> feedback has been received.<br>We appreciate your ${ratingMessages[currentRating].toLowerCase()}!`;

    launchConfetti();
    successModal.show();

    // Reset form
    setTimeout(() => {
      form.reset();
      emojis.forEach((e) => e.classList.remove("selected"));
      stars.forEach((s) => s.classList.remove("selected"));
      imagePreview.classList.add("d-none");
      selectedImageBase64 = null;
      currentRating = 0;
      ratingInput.value = "";
      ratingLabel.textContent = "";
      progressBar.style.width = "0%";
      progressText.textContent = "0%";
      updateLivePreview();
      loadReviews();
    }, 700);
  });

  // Sorting & Clear
  sortReviews.addEventListener("change", loadReviews);
  clearReviewsBtn.addEventListener("click", () => {
    if (confirm("Delete all reviews? This cannot be undone.")) {
      localStorage.removeItem("reviews");
      loadReviews();
    }
  });

  // Initialize
  loadReviews();
  updateLivePreview();
});
