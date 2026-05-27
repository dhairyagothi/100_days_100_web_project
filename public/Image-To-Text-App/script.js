async function convertImage() {
  const fileInput = document.getElementById("fileInput");
  const outputDiv = document.getElementById("output");
  const convertBtn = document.querySelector("button");
  const placeholder = document.getElementById("placeholder");

  if (!fileInput.files || fileInput.files.length === 0) {
    outputDiv.innerHTML = `
      <p class="text-red-400 font-medium">
        Please select an image file.
      </p>
    `;
    return;
  }

  const file = fileInput.files[0];

  // Show Image Preview Immediately
  showImagePreview(file);

  // Loading State
  outputDiv.innerHTML = `
    <div class="flex flex-col items-center justify-center gap-4 py-10">
      
      <div class="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin">
      </div>

      <p class="text-cyan-300 font-medium animate-pulse">
        Extracting text from image...
      </p>

    </div>
  `;

  // Disable button while processing
  convertBtn.disabled = true;
  convertBtn.classList.add("opacity-50", "cursor-not-allowed");

  try {
    const {
      data: { text },
    } = await Tesseract.recognize(file, "eng", {
      logger: (m) => {
        console.log(m);

        // Optional Progress Display
        if (m.status === "recognizing text") {
          outputDiv.innerHTML = `
            <div class="flex flex-col items-center justify-center gap-4 py-10">
              
              <div class="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin">
              </div>

              <p class="text-cyan-300 font-medium">
                Recognizing Text...
              </p>

              <p class="text-sm text-gray-400">
                ${Math.round(m.progress * 100)}%
              </p>

            </div>
          `;
        }
      },
    });

    outputDiv.innerHTML = `
      <div class="text-gray-200 whitespace-pre-wrap leading-relaxed">
        ${text.trim() || "No text detected in the image."}
      </div>
    `;
  } catch (error) {
    console.error("Error:", error);

    outputDiv.innerHTML = `
      <div class="text-center py-10">
        
        <div class="text-5xl mb-4">
          ⚠️
        </div>

        <p class="text-red-400 font-medium">
          Error processing image.
        </p>

        <p class="text-gray-400 text-sm mt-2">
          Please try again with another image.
        </p>

      </div>
    `;
  } finally {
    // Re-enable button
    convertBtn.disabled = false;
    convertBtn.classList.remove("opacity-50", "cursor-not-allowed");
  }
}

function showImagePreview(file) {
  const imagePreview = document.getElementById("imagePreview");
  const placeholder = document.getElementById("placeholder");

  imagePreview.src = URL.createObjectURL(file);

  imagePreview.classList.remove("hidden");

  if (placeholder) {
    placeholder.classList.add("hidden");
  }
}

// Copy Extracted Text Button
const copyBtn = document.querySelector("#copyBtn");

if (copyBtn) {
  copyBtn.addEventListener("click", async () => {
    const outputText = document.getElementById("output").innerText;

    if (
      !outputText ||
      outputText.includes("Select an image") ||
      outputText.includes("Extracting text")
    ) {
      return;
    }

    try {
      await navigator.clipboard.writeText(outputText);

      copyBtn.innerHTML = "✅ Copied";

      copyBtn.classList.add(
        "bg-emerald-500/20",
        "text-emerald-300"
      );

      setTimeout(() => {
        copyBtn.innerHTML = "Copy";

        copyBtn.classList.remove(
          "bg-emerald-500/20",
          "text-emerald-300"
        );
      }, 2000);

    } catch (error) {
      console.error("Copy failed:", error);
    }
  });
}

// Drag & Drop Upload Support
const uploadBox = document.querySelector("label");

if (uploadBox) {

  ["dragenter", "dragover"].forEach((eventName) => {
    uploadBox.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();

      uploadBox.classList.add(
        "border-cyan-400",
        "bg-cyan-500/10",
        "scale-[1.02]"
      );
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    uploadBox.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();

      uploadBox.classList.remove(
        "border-cyan-400",
        "bg-cyan-500/10",
        "scale-[1.02]"
      );
    });
  });

  uploadBox.addEventListener("drop", (e) => {
    const files = e.dataTransfer.files;

    if (files.length > 0) {
      const fileInput = document.getElementById("fileInput");

      fileInput.files = files;

      showImagePreview(files[0]);
    }
  });
}

// Auto Preview on File Select
document
  .getElementById("fileInput")
  .addEventListener("change", function () {

    if (this.files && this.files[0]) {
      showImagePreview(this.files[0]);
    }
  });