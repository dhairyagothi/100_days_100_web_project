function showToast(message, type = "info") {

    const container =
        document.getElementById("toast-container");

    const toast =
        document.createElement("div");

    toast.className = `toast ${type}`;

    toast.innerHTML = `
        <span>${message}</span>

        <button onclick="this.parentElement.remove()">
            &times;
        </button>
    `;

    container.appendChild(toast);

    setTimeout(() => {

        toast.remove();

    }, 3000);
}


document
.getElementById("feedbackform")
.addEventListener("submit", function(event){

    event.preventDefault();

    const feedback =
        document.getElementById("feedbackMessage").value;

    if(feedback.trim() === ""){

        showToast(
            "⚠ Please enter feedback first",
            "error"
        );

        return;
    }

    showToast(
        "✅ Feedback submitted successfully!",
        "success"
    );

    this.reset();
});