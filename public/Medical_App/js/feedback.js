document
  .getElementById("feedbackform")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const feedback = document.getElementById("feedbackMessage").value;

    if (feedback.trim() === "") {
      if (typeof showToast === "function") {
        showToast("Please enter feedback first", "error");
      }

      return;
    }

    if (typeof showToast === "function") {
      showToast("Feedback submitted successfully", "success");
    }

    this.reset();
  });
