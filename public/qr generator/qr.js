const copyBtn = document.getElementById("copy-btn");
const message = document.getElementById("message");

const qrType = document.getElementById("qr-type");
const themeBtns = document.querySelectorAll(".theme-btn");

const inputText = document.getElementById("inputtext");
const inputLabel = document.getElementById("main-input-label");

const wifiInputs = document.getElementById("wifi-inputs");
const vcardInputs = document.getElementById("vcard-inputs");

const qrColor = document.getElementById("qr-color");
const qrShape = document.getElementById("qr-shape");
const errorCorrection = document.getElementById("error-correction");
const logoUpload = document.getElementById("logo-upload");

const generateBtn = document.querySelector(".submit");
const qrcodeDiv = document.getElementById("qrcode");

const downloadBtn = document.getElementById("download-qr");
const scanBtn = document.getElementById("scan-qr");

const qrReaderResults = document.getElementById("qr-reader-results");
const statusMessage = document.getElementById("status-message");

const wifiSSID = document.getElementById("wifi-ssid");
const wifiPassword = document.getElementById("wifi-password");
const wifiEncryption = document.getElementById("wifi-encryption");

const vcardName = document.getElementById("vcard-name");
const vcardPhone = document.getElementById("vcard-phone");
const vcardEmail = document.getElementById("vcard-email");
const vcardWebsite = document.getElementById("vcard-website");

let lastGeneratedData = "";
let currentTheme = "aurora";

const themeColors = {
    aurora: "#a78bfa",
    neon: "#00ff88",
    dark: "#d4d4d4",
    candy: "#e91e8c"
};

function setStatus(msg, error = false) {
    statusMessage.textContent = msg;
    statusMessage.style.color = error ? "red" : "";
}

function escapeText(text) {
    return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,");
}

function updateInputFields() {
    const type = qrType.value;

    inputText.style.display = (type === "text" || type === "url") ? "block" : "none";
    inputLabel.style.display = (type === "text" || type === "url") ? "block" : "none";

    wifiInputs.style.display = type === "wifi" ? "block" : "none";
    vcardInputs.style.display = type === "vcard" ? "block" : "none";
}

function collectQrData() {
    const type = qrType.value;

    if (type === "text") return { data: inputText.value.trim() };
    if (type === "url") return { data: inputText.value.trim() };

    if (type === "wifi") {
        const ssid = wifiSSID.value.trim();
        const pass = wifiPassword.value;
        const enc = wifiEncryption.value;
        return { data: `WIFI:T:${enc};S:${ssid};P:${pass};;` };
    }

    if (type === "vcard") {
        return {
            data:
`BEGIN:VCARD
VERSION:3.0
FN:${vcardName.value}
TEL:${vcardPhone.value}
EMAIL:${vcardEmail.value}
URL:${vcardWebsite.value}
END:VCARD`
        };
    }

    return { error: "Invalid type" };
}

function generateQRCode() {
    qrcodeDiv.innerHTML = "";

    const result = collectQrData();
    if (result.error) {
        setStatus(result.error, true);
        return;
    }

    lastGeneratedData = result.data;

    new QRCode(qrcodeDiv, {
        text: result.data,
        width: 200,
        height: 200,
        colorDark: qrColor.value,
        colorLight: "#fff",
        correctLevel: QRCode.CorrectLevel[errorCorrection.value]
    });

    setStatus("QR generated");
}

qrType.addEventListener("change", updateInputFields);

generateBtn.addEventListener("click", generateQRCode);

downloadBtn.addEventListener("click", () => {
    const img = qrcodeDiv.querySelector("img");
    if (!img) return;

    const a = document.createElement("a");
    a.download = "qr.png";
    a.href = img.src;
    a.click();
});

scanBtn.addEventListener("click", () => {
    qrReaderResults.innerHTML = `<pre>${lastGeneratedData}</pre>`;
});

copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(inputText.value);
    message.innerText = "Copied!";
});

updateInputFields();
