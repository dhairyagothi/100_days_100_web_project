console.log("🚀 SCRIPT.JS IS SUCCESSFULLY CONNECTED!");

// 1. THEME TOGGLE LOGIC 
document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('themeToggle');
  const sunIcon = document.getElementById('sunIcon');
  const moonIcon = document.getElementById('moonIcon');

  // Check storage, default to dark
  const currentTheme = localStorage.getItem('theme') || 'dark';

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      if (sunIcon && moonIcon) {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
      }
    } else {
      document.documentElement.classList.remove('dark');
      if (sunIcon && moonIcon) {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
      }
    }
  }

  // Apply immediately on load
  applyTheme(currentTheme);

  // Click listener for the button
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      console.log("Toggle button was clicked!"); // Proof the button works
      const isDark = document.documentElement.classList.contains('dark');
      const newTheme = isDark ? 'light' : 'dark';
      
      localStorage.setItem('theme', newTheme);
      applyTheme(newTheme);
    });
  } else {
    console.error("Could not find the themeToggle button in the HTML!");
  }
});

// 2. IMAGE CONVERSION LOGIC (Tesseract)
async function convertImage() {
  const fileInput = document.getElementById("fileInput");
  const outputDiv = document.getElementById("output");
  const convertBtn = document.querySelector("button[onclick='convertImage()']");
  
  if (!fileInput.files || fileInput.files.length === 0) {
    outputDiv.innerHTML = `<p class="text-red-500 dark:text-red-400 font-medium">Please select an image file.</p>`;
    return;
  }

  const file = fileInput.files[0];
  showImagePreview(file);

  outputDiv.innerHTML = `
    <div class="flex flex-col items-center justify-center gap-4 py-10">
      <div class="w-12 h-12 border-4 border-cyan-500 dark:border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-cyan-600 dark:text-cyan-300 font-medium animate-pulse">Extracting text from image...</p>
    </div>
  `;

  convertBtn.disabled = true;
  convertBtn.classList.add("opacity-50", "cursor-not-allowed");

  try {
    const { data: { text } } = await Tesseract.recognize(file, "eng", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          outputDiv.innerHTML = `
            <div class="flex flex-col items-center justify-center gap-4 py-10">
              <div class="w-12 h-12 border-4 border-cyan-500 dark:border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              <p class="text-cyan-600 dark:text-cyan-300 font-medium">Recognizing Text...</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">${Math.round(m.progress * 100)}%</p>
            </div>
          `;
        }
      },
    });

    outputDiv.innerHTML = `
      <div class="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed text-left">
        ${text.trim() || "No text detected in the image."}
      </div>
    `;
  } catch (error) {
    console.error("Error:", error);
    outputDiv.innerHTML = `
      <div class="text-center py-10">
        <div class="text-5xl mb-4">⚠️</div>
        <p class="text-red-500 dark:text-red-400 font-medium">Error processing image.</p>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-2">Please try again with another image.</p>
      </div>
    `;
  } finally {
    convertBtn.disabled = false;
    convertBtn.classList.remove("opacity-50", "cursor-not-allowed");
  }
}

// 3. UI HELPER FUNCTIONS
function showImagePreview(file) {
  const imagePreview = document.getElementById("imagePreview");
  const placeholder = document.getElementById("placeholder");

  if (!imagePreview || !placeholder) return;

  imagePreview.src = URL.createObjectURL(file);
  imagePreview.classList.remove("hidden");
  placeholder.classList.add("hidden");
}

// 4. COPY TEXT LOGIC
const copyBtn = document.querySelector("#copyBtn");
if (copyBtn) {
  copyBtn.addEventListener("click", async () => {
    const outputText = document.getElementById("output").innerText;

    if (!outputText || outputText.includes("Select an image") || outputText.includes("Extracting text")) {
      return;
    }

    try {
      await navigator.clipboard.writeText(outputText);
      copyBtn.innerHTML = "✅ Copied";
      copyBtn.classList.add("bg-emerald-100", "text-emerald-700", "dark:bg-emerald-500/20", "dark:text-emerald-300");

      setTimeout(() => {
        copyBtn.innerHTML = "Copy";
        copyBtn.classList.remove("bg-emerald-100", "text-emerald-700", "dark:bg-emerald-500/20", "dark:text-emerald-300");
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  });
}

// 5. DRAG & DROP UPLOAD
const uploadBox = document.querySelector("label");
if (uploadBox) {
  ["dragenter", "dragover"].forEach((eventName) => {
    uploadBox.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      uploadBox.classList.add("border-cyan-400", "bg-cyan-50", "dark:bg-cyan-500/10", "scale-[1.02]");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    uploadBox.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      uploadBox.classList.remove("border-cyan-400", "bg-cyan-50", "dark:bg-cyan-500/10", "scale-[1.02]");
    });
  });

  uploadBox.addEventListener("drop", (e) => {
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const fileInput = document.getElementById("fileInput");
      if(fileInput) {
          fileInput.files = files;
          showImagePreview(files[0]);
      }
    }
  });
}

// 6. AUTO-PREVIEW ON FILE SELECT
const fileInput = document.getElementById("fileInput");
if (fileInput) {
  fileInput.addEventListener("change", function () {
    if (this.files && this.files[0]) {
      showImagePreview(this.files[0]);
    }
  });
}

// 7. CLIPBOARD PASTE SUPPORT (Ctrl+V)
document.addEventListener("paste", (e) => {
  if (!e.clipboardData || !e.clipboardData.items) return;
  const items = e.clipboardData.items;

  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf("image") !== -1) {
      const file = items[i].getAsFile();
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      
      const fileInputObj = document.getElementById("fileInput");
      if (fileInputObj) {
        fileInputObj.files = dataTransfer.files;
        showImagePreview(file);
      }
      break; 
    }
  }
});