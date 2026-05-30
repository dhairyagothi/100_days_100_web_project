async function convertImage() {
  const fileInput = document.getElementById("fileInput");
  const outputDiv = document.getElementById("output");

  if (!fileInput.files || fileInput.files.length === 0) {
    outputDiv.innerText = "Please select an image file.";
    return;
  }

  const file = fileInput.files[0];

  try {
    const {
      data: { text },
    } = await Tesseract.recognize(file, "eng", {
      logger: (m) => console.log(m),
    });

    outputDiv.innerText = text;
    showImagePreview(file);
  } catch (error) {
    console.error("Error:", error);
    outputDiv.innerText = "Error processing image. Please try again.";
  }
}

function showImagePreview(file) {
    const imagePreview = document.getElementById("imagePreview");
    imagePreview.src = URL.createObjectURL(file);
    imagePreview.classList.remove('hidden');
}
