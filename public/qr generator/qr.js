/* =========================================================
   ELEMENTS
========================================================= */

const qrType = document.getElementById("qr-type");

const inputText = document.getElementById("inputtext");
const inputLabel = document.getElementById("main-input-label");

const wifiInputs = document.getElementById("wifi-inputs");
const vcardInputs = document.getElementById("vcard-inputs");

const qrColor = document.getElementById("qr-color");
const qrShape = document.getElementById("qr-shape");
const errorCorrection = document.getElementById("error-correction");
const logoUpload = document.getElementById("logo-upload");

const generateBtn = document.getElementById("generate-btn");

const qrcodeDiv = document.getElementById("qrcode");

const downloadBtn = document.getElementById("download-qr");
const scanBtn = document.getElementById("scan-qr");

const copyBtn = document.getElementById("copy-btn");
const shareBtn = document.getElementById("share-btn");
const resetBtn = document.getElementById("reset-btn");

const qrReader = document.getElementById("qr-reader");
const qrReaderResults = document.getElementById("qr-reader-results");

const statusMessage = document.getElementById("status-message");

const wifiSSID = document.getElementById("wifi-ssid");
const wifiPassword = document.getElementById("wifi-password");
const wifiEncryption = document.getElementById("wifi-encryption");

const vcardName = document.getElementById("vcard-name");
const vcardPhone = document.getElementById("vcard-phone");
const vcardEmail = document.getElementById("vcard-email");
const vcardWebsite = document.getElementById("vcard-website");

const colorValue = document.querySelector(".color-value");

const themeBtns = document.querySelectorAll(".theme-btn");

/* =========================================================
   GLOBALS
========================================================= */

let qrCode = null;

let lastGeneratedData = "";

let scanner = null;

let scannerRunning = false;

let uploadedLogo = null;

/* =========================================================
   THEME COLORS
========================================================= */

const themeColors = {
  aurora: "#a78bfa",

  neon: "#00ff88",

  dark: "#d4d4d4",

  candy: "#ff0080",
};

/* =========================================================
   STATUS
========================================================= */

function setStatus(message, error = false) {
  statusMessage.textContent = message;

  statusMessage.style.color = error ? "#ff6b6b" : "";
}

/* =========================================================
   ESCAPE TEXT
========================================================= */

function escapeText(text = "") {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,");
}

/* =========================================================
   UPDATE INPUTS
========================================================= */

function updateInputFields() {
  const type = qrType.value;

  const showMainInput = type === "text" || type === "url";

  inputLabel.classList.toggle("hidden", !showMainInput);

  wifiInputs.classList.toggle("hidden", type !== "wifi");

  vcardInputs.classList.toggle("hidden", type !== "vcard");

  updatePlaceholder(type);
}

/* =========================================================
   PLACEHOLDERS
========================================================= */

function updatePlaceholder(type) {
  const placeholders = {
    text: "Enter any text here...",

    url: "https://example.com",

    wifi: "",

    vcard: "",
  };

  inputText.placeholder = placeholders[type] || "";
}

/* =========================================================
   VALIDATION
========================================================= */

function validateInput(data) {
  if (!data || data.trim() === "") {
    return "Please enter some data";
  }

  if (data.length > 2000) {
    return "Data is too large";
  }

  return null;
}

/* =========================================================
   COLLECT QR DATA
========================================================= */

function collectQrData() {
  const type = qrType.value;

  /* ===== TEXT ===== */

  if (type === "text") {
    return {
      data: inputText.value.trim(),
    };
  }

  /* ===== URL ===== */

  if (type === "url") {
    let url = inputText.value.trim();

    if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    return { data: url };
  }

  /* ===== WIFI ===== */

  if (type === "wifi") {
    const ssid = escapeText(wifiSSID.value.trim());

    const password = escapeText(wifiPassword.value);

    const encryption = wifiEncryption.value;

    if (!ssid) {
      return {
        error: "WiFi SSID required",
      };
    }

    return {
      data: `WIFI:T:${encryption};S:${ssid};P:${password};;`,
    };
  }

  /* ===== VCARD ===== */

  if (type === "vcard") {
    if (!vcardName.value.trim()) {
      return {
        error: "Full name required",
      };
    }

    return {
      data: `BEGIN:VCARD
VERSION:3.0
FN:${vcardName.value.trim()}
TEL:${vcardPhone.value.trim()}
EMAIL:${vcardEmail.value.trim()}
URL:${vcardWebsite.value.trim()}
END:VCARD`,
    };
  }

  return {
    error: "Invalid QR type",
  };
}

/* =========================================================
   CLEAR QR
========================================================= */

function clearQRCode() {
  qrcodeDiv.innerHTML = "";
}

/* =========================================================
   GENERATE QR
========================================================= */

function generateQRCode() {
  clearQRCode();

  const result = collectQrData();

  if (result.error) {
    setStatus(result.error, true);

    shakeElement(generateBtn);

    return;
  }

  const validationError = validateInput(result.data);

  if (validationError) {
    setStatus(validationError, true);

    shakeElement(generateBtn);

    return;
  }

  lastGeneratedData = result.data;

  /* =========================================
       QR GENERATION
    ========================================= */

  qrCode = new QRCode(
    qrcodeDiv,

    {
      text: result.data,

      width: 240,

      height: 240,

      colorDark: qrColor.value,

      colorLight: "#ffffff",

      correctLevel: QRCode.CorrectLevel[errorCorrection.value],
    },
  );

  /* =========================================
       ROUNDED STYLE
    ========================================= */

  setTimeout(() => {
    const img = qrcodeDiv.querySelector("img");

    const canvas = qrcodeDiv.querySelector("canvas");

    if (qrShape.value === "rounded") {
      if (img) {
        img.style.borderRadius = "24px";
      }

      if (canvas) {
        canvas.style.borderRadius = "24px";
      }
    }

    /* =====================================
           ADD LOGO
        ===================================== */

    if (uploadedLogo) {
      addLogoToQR();
    }
  }, 100);

  animateQR();

  setStatus("QR generated successfully");
}

/* =========================================================
   LOGO OVERLAY
========================================================= */

function addLogoToQR() {
  const qrCanvas = qrcodeDiv.querySelector("canvas");

  if (!qrCanvas) return;

  const ctx = qrCanvas.getContext("2d");

  const logo = new Image();

  logo.src = uploadedLogo;

  logo.onload = () => {
    const size = 52;

    const x = (qrCanvas.width - size) / 2;

    const y = (qrCanvas.height - size) / 2;

    /* ===== WHITE BACKGROUND ===== */

    ctx.fillStyle = "#ffffff";

    ctx.beginPath();

    ctx.roundRect(x - 8, y - 8, size + 16, size + 16, 14);

    ctx.fill();

    /* ===== DRAW LOGO ===== */

    ctx.drawImage(logo, x, y, size, size);
  };
}

/* =========================================================
   ANIMATE QR
========================================================= */

function animateQR() {
  gsap.fromTo(
    "#qrcode",

    {
      scale: 0.7,
      opacity: 0,
      rotate: -5,
    },

    {
      scale: 1,
      opacity: 1,
      rotate: 0,
      duration: 0.7,
      ease: "back.out(1.8)",
    },
  );
}

/* =========================================================
   SHAKE EFFECT
========================================================= */

function shakeElement(element) {
  gsap.fromTo(
    element,

    { x: -5 },

    {
      x: 5,

      duration: 0.08,

      repeat: 5,

      yoyo: true,
    },
  );
}

/* =========================================================
   DOWNLOAD QR
========================================================= */

function downloadQRCode() {
  const img = qrcodeDiv.querySelector("img");

  const canvas = qrcodeDiv.querySelector("canvas");

  let source = null;

  if (img) {
    source = img.src;
  }

  if (canvas) {
    source = canvas.toDataURL("image/png");
  }

  if (!source) {
    setStatus("Generate QR first", true);

    return;
  }

  const link = document.createElement("a");

  link.href = source;

  link.download = `quantumqr-${Date.now()}.png`;

  link.click();

  setStatus("QR downloaded");
}

/* =========================================================
   COPY QR DATA
========================================================= */

async function copyQRData() {
  if (!lastGeneratedData) {
    setStatus("Nothing to copy", true);

    return;
  }

  try {
    await navigator.clipboard.writeText(lastGeneratedData);

    setStatus("Copied to clipboard");
  } catch {
    setStatus("Copy failed", true);
  }
}

/* =========================================================
   SHARE QR
========================================================= */

async function shareQRCode() {
  const canvas = qrcodeDiv.querySelector("canvas");

  if (!canvas) {
    setStatus("Generate QR first", true);

    return;
  }

  try {
    const blob = await new Promise((resolve) => canvas.toBlob(resolve));

    const file = new File([blob], "quantumqr.png", {
      type: "image/png",
    });

    if (navigator.share) {
      await navigator.share({
        title: "QuantumQR",

        text: "Scan this QR code",

        files: [file],
      });

      setStatus("Shared successfully");
    }
  } catch {
    setStatus("Sharing cancelled", true);
  }
}

/* =========================================================
   RESET APP
========================================================= */

function resetApp() {
  clearQRCode();

  inputText.value = "";

  wifiSSID.value = "";
  wifiPassword.value = "";

  vcardName.value = "";
  vcardPhone.value = "";
  vcardEmail.value = "";
  vcardWebsite.value = "";

  qrReaderResults.innerHTML = "";

  lastGeneratedData = "";

  uploadedLogo = null;

  setStatus("Reset complete");

  qrcodeDiv.innerHTML = `
<div class="placeholder-state">
    <i class="fas fa-qrcode"></i>
    <p>Your QR code will appear here</p>
</div>
`;
}

/* =========================================================
   SCANNER
========================================================= */

async function startScanner() {
  if (scannerRunning) {
    stopScanner();

    return;
  }

  try {
    qrReader.classList.remove("hidden");

    scanner = new Html5Qrcode("qr-reader");

    scannerRunning = true;

    scanBtn.innerHTML = `
<i class="fas fa-stop"></i>
<span>Stop</span>
`;

    await scanner.start(
      {
        facingMode: "environment",
      },

      {
        fps: 10,
        qrbox: 250,
      },

      (decodedText) => {
        qrReaderResults.innerHTML = `
<div class="glass-card">
    <h3>Scanned Result</h3>
    <p>${decodedText}</p>
</div>
`;

        setStatus("QR scanned");

        navigator.vibrate?.(120);

        stopScanner();
      },
    );
  } catch (error) {
    console.error(error);

    setStatus("Camera access denied", true);

    stopScanner();
  }
}

/* =========================================================
   STOP SCANNER
========================================================= */

async function stopScanner() {
  if (!scannerRunning || !scanner) {
    qrReader.classList.add("hidden");

    return;
  }

  try {
    await scanner.stop();

    await scanner.clear();
  } catch {}

  scannerRunning = false;

  qrReader.classList.add("hidden");

  scanBtn.innerHTML = `
<i class="fas fa-camera"></i>
<span>Scan</span>
`;
}

/* =========================================================
   THEME SWITCHER
========================================================= */

function switchTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  localStorage.setItem("qr-theme", theme);

  if (themeColors[theme]) {
    qrColor.value = themeColors[theme];

    updateColorText();
  }

  themeBtns.forEach((btn) => {
    btn.classList.remove("active");

    if (btn.dataset.theme === theme) {
      btn.classList.add("active");
    }
  });

  setStatus(`${theme} theme activated`);
}

/* =========================================================
   LOAD SAVED THEME
========================================================= */

function loadSavedTheme() {
  const savedTheme = localStorage.getItem("qr-theme");

  if (savedTheme) {
    switchTheme(savedTheme);
  }
}

/* =========================================================
   LIVE PREVIEW
========================================================= */

function setupLivePreview() {
  const fields = [
    inputText,

    wifiSSID,
    wifiPassword,

    vcardName,
    vcardPhone,
    vcardEmail,
    vcardWebsite,
  ];

  fields.forEach((field) => {
    if (!field) return;

    field.addEventListener(
      "input",

      debounce(() => {
        const result = collectQrData();

        if (result.data && result.data.trim() !== "") {
          generateQRCode();
        }
      }, 450),
    );
  });
}

/* =========================================================
   COLOR TEXT
========================================================= */

function updateColorText() {
  colorValue.textContent = qrColor.value.toUpperCase();
}

/* =========================================================
   DEBOUNCE
========================================================= */

function debounce(callback, delay) {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => callback(...args), delay);
  };
}

/* =========================================================
   LOGO UPLOAD
========================================================= */

logoUpload.addEventListener(
  "change",

  (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      uploadedLogo = e.target.result;

      setStatus("Logo uploaded");

      if (lastGeneratedData) {
        generateQRCode();
      }
    };

    reader.readAsDataURL(file);
  },
);

/* =========================================================
   EVENT LISTENERS
========================================================= */

qrType.addEventListener("change", updateInputFields);

generateBtn.addEventListener("click", generateQRCode);

downloadBtn.addEventListener("click", downloadQRCode);

copyBtn.addEventListener("click", copyQRData);

shareBtn.addEventListener("click", shareQRCode);

resetBtn.addEventListener("click", resetApp);

scanBtn.addEventListener("click", startScanner);

qrColor.addEventListener("input", updateColorText);

/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

document.addEventListener(
  "keydown",

  (event) => {
    if (event.ctrlKey && event.key === "Enter") {
      generateQRCode();
    }
  },
);

/* =========================================================
   THEME BUTTONS
========================================================= */

themeBtns.forEach((button) => {
  button.addEventListener(
    "click",

    () => {
      const theme = button.dataset.theme;

      switchTheme(theme);
    },
  );
});

/* =========================================================
   GSAP ANIMATIONS
========================================================= */

window.addEventListener(
  "load",

  () => {
    gsap.from(
      ".reveal",

      {
        y: 40,

        opacity: 0,

        duration: 0.9,

        stagger: 0.12,

        ease: "power3.out",
      },
    );

    gsap.from(
      ".hero",

      {
        y: -20,

        opacity: 0,

        duration: 1,

        ease: "power3.out",
      },
    );

    gsap.from(
      ".topbar",

      {
        y: -30,

        opacity: 0,

        duration: 1,

        ease: "power3.out",
      },
    );
  },
);

/* =========================================================
   INITIALIZE
========================================================= */

updateInputFields();

loadSavedTheme();

setupLivePreview();

updateColorText();

setStatus("Ready to generate");
