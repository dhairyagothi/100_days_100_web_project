const qrType = document.getElementById('qr-type');
const themeBtns = document.querySelectorAll('.theme-btn');
const inputText = document.getElementById('inputtext');
const inputLabel = document.getElementById('main-input-label');
const wifiInputs = document.getElementById('wifi-inputs');
const vcardInputs = document.getElementById('vcard-inputs');
const qrColor = document.getElementById('qr-color');
const qrShape = document.getElementById('qr-shape');
const errorCorrection = document.getElementById('error-correction');
const logoUpload = document.getElementById('logo-upload');
const generateBtn = document.querySelector('.submit');
const qrcodeDiv = document.getElementById('qrcode');
const downloadBtn = document.getElementById('download-qr');
const scanBtn = document.getElementById('scan-qr');
const qrReaderResults = document.getElementById('qr-reader-results');
const statusMessage = document.getElementById('status-message');

const wifiSSID = document.getElementById('wifi-ssid');
const wifiPassword = document.getElementById('wifi-password');
const wifiEncryption = document.getElementById('wifi-encryption');
const vcardName = document.getElementById('vcard-name');
const vcardPhone = document.getElementById('vcard-phone');
const vcardEmail = document.getElementById('vcard-email');
const vcardWebsite = document.getElementById('vcard-website');

let realtimeTimer = null;
let currentTheme = 'aurora';
let lastGeneratedData = '';
let isApplyingStyle = false;

const themeColors = {
  aurora: '#a78bfa',
  neon: '#00ff88',
  dark: '#d4d4d4',
  candy: '#e91e8c',
};

function setStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.style.color = isError ? '#f87171' : '';
}

function escapeText(text) {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '');
}

function updateInputFields() {
  const selectedType = qrType.value;
  const showMainInput = selectedType === 'text' || selectedType === 'url';
  const showWifi = selectedType === 'wifi';
  const showVcard = selectedType === 'vcard';

  inputText.style.display = showMainInput ? 'block' : 'none';
  inputLabel.style.display = showMainInput ? 'block' : 'none';
  wifiInputs.style.display = showWifi ? 'block' : 'none';
  vcardInputs.style.display = showVcard ? 'block' : 'none';

  if (selectedType === 'url') {
    inputLabel.textContent = 'Enter URL';
    inputText.placeholder = 'https://example.com';
  } else if (selectedType === 'text') {
    inputLabel.textContent = 'Enter text';
    inputText.placeholder = 'Enter your text';
  }
}

function collectQrData() {
  const selectedType = qrType.value;

  if (selectedType === 'text') {
    const value = inputText.value.trim();
    if (!value) {
      return { error: 'Enter some text to generate a QR code.' };
    }
    return { data: value };
  }

  if (selectedType === 'url') {
    const value = inputText.value.trim();
    if (!value) {
      return { error: 'Enter a URL to generate a QR code.' };
    }
    const normalized = /^(https?:\/\/)/i.test(value)
      ? value
      : `https://${value}`;
    return { data: normalized };
  }

  if (selectedType === 'wifi') {
    const ssid = wifiSSID.value.trim();
    if (!ssid) {
      return { error: 'WiFi SSID is required.' };
    }
    const password = wifiPassword.value;
    const encryption = wifiEncryption.value;
    const wifiPayload = `WIFI:T:${encryption};S:${escapeText(ssid)};P:${escapeText(password)};;`;
    return { data: wifiPayload };
  }

  if (selectedType === 'vcard') {
    const name = vcardName.value.trim();
    const phone = vcardPhone.value.trim();
    const email = vcardEmail.value.trim();
    const website = vcardWebsite.value.trim();

    if (!name && !phone && !email && !website) {
      return { error: 'Fill at least one vCard field.' };
    }

    const lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${escapeText(name)}`,
      `TEL:${escapeText(phone)}`,
      `EMAIL:${escapeText(email)}`,
      `URL:${escapeText(website)}`,
      'END:VCARD',
    ];
    return { data: lines.join('\n') };
  }

  return { error: 'Unsupported QR type selected.' };
}

function drawDotsStyle(baseImage, color) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = baseImage.width;
  canvas.height = baseImage.height;
  ctx.drawImage(baseImage, 0, 0);

  const source = ctx.getImageData(0, 0, canvas.width, canvas.height);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = color;

  for (let i = 0; i < source.data.length; i += 4) {
    const isDark =
      source.data[i] < 170 &&
      source.data[i + 1] < 170 &&
      source.data[i + 2] < 170;
    if (!isDark) {
      continue;
    }

    const x = (i / 4) % canvas.width;
    const y = Math.floor(i / 4 / canvas.width);
    ctx.beginPath();
    ctx.arc(x + 0.5, y + 0.5, 0.65, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas;
}

function placeLogo(baseCanvas, imageUrl) {
  return new Promise((resolve) => {
    const logo = new Image();
    logo.onload = () => {
      const ctx = baseCanvas.getContext('2d');
      const correction = errorCorrection.value;
      const sizeRatioMap = {
        L: 0.11,
        M: 0.13,
        Q: 0.15,
        H: 0.17,
      };
      const logoSize = Math.floor(
        baseCanvas.width * (sizeRatioMap[correction] || 0.13)
      );
      const x = (baseCanvas.width - logoSize) / 2;
      const y = (baseCanvas.height - logoSize) / 2;
      const pad = Math.max(2, Math.floor(logoSize * 0.12));

      ctx.fillStyle = 'rgba(255,255,255,0.98)';
      ctx.fillRect(x - pad, y - pad, logoSize + pad * 2, logoSize + pad * 2);
      ctx.drawImage(logo, x, y, logoSize, logoSize);
      resolve(baseCanvas);
    };
    logo.onerror = () => resolve(baseCanvas);
    logo.src = imageUrl;
  });
}

async function styleAndMaybeLogo() {
  const qrImg = qrcodeDiv.querySelector('img');
  if (!qrImg) {
    return;
  }

  if (!qrImg.complete || qrImg.naturalWidth === 0) {
    await new Promise((resolve) => {
      qrImg.onload = resolve;
      qrImg.onerror = resolve;
    });
  }

  if (qrShape.value === 'rounded') {
    qrImg.style.borderRadius = '14px';
  } else {
    qrImg.style.borderRadius = '0';
  }

  let canvas = document.createElement('canvas');
  canvas.width = qrImg.width;
  canvas.height = qrImg.height;
  canvas.getContext('2d').drawImage(qrImg, 0, 0);

  if (qrShape.value === 'dots') {
    canvas = drawDotsStyle(qrImg, qrColor.value);
  }

  const logoFile = logoUpload.files[0];
  if (logoFile) {
    if (errorCorrection.value === 'L') {
      setStatus(
        'Logo added. For best scan reliability, use Q or H error correction.',
        true
      );
    }
    const logoDataUrl = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(logoFile);
    });
    canvas = await placeLogo(canvas, logoDataUrl);
  }

  qrImg.src = canvas.toDataURL('image/png');
  qrImg.style.display = 'block';
  qrImg.style.margin = '0 auto';
}

async function generateQRCode() {
  isApplyingStyle = true;
  qrcodeDiv.innerHTML = '';
  const result = collectQrData();
  if (result.error) {
    lastGeneratedData = '';
    setStatus(result.error, true);
    return;
  }
  lastGeneratedData = result.data;

  new QRCode(qrcodeDiv, {
    text: result.data,
    width: 200,
    height: 200,
    colorDark: qrColor.value || themeColors[currentTheme],
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel[errorCorrection.value],
  });

  if (typeof gsap !== 'undefined') {
    gsap.fromTo(
      qrcodeDiv,
      { scale: 0.9, opacity: 0.2 },
      { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(1.6)' }
    );
  }

  setTimeout(async () => {
    await styleAndMaybeLogo();
    setStatus('QR code generated.');
    isApplyingStyle = false;
  }, 40);
}

function scheduleGenerate() {
  if (isApplyingStyle) {
    return;
  }

  clearTimeout(realtimeTimer);
  realtimeTimer = setTimeout(() => {
    generateQRCode();
  }, 280);
}

function setTheme(theme) {
  currentTheme = theme;

  document.documentElement.setAttribute('data-theme', theme);

  themeBtns.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.theme === theme);
  });
}

themeBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    setTheme(btn.dataset.theme);
    qrColor.value = themeColors[btn.dataset.theme];
    scheduleGenerate();
  });
});

qrType.addEventListener('change', () => {
  updateInputFields();
  scheduleGenerate();
});

[
  inputText,
  wifiSSID,
  wifiPassword,
  wifiEncryption,
  vcardName,
  vcardPhone,
  vcardEmail,
  vcardWebsite,
  qrColor,
  errorCorrection,
  logoUpload,
].forEach((el) => {
  const eventName =
    el.tagName === 'SELECT' || el.type === 'file' ? 'change' : 'input';
  el.addEventListener(eventName, scheduleGenerate);
});

qrShape.addEventListener("change", () => {
    if (!lastGeneratedData) {
        return;
    }

    generateQRCode();
});
generateBtn.addEventListener('click', () => {
  generateQRCode();
});

downloadBtn.addEventListener('click', () => {
  const qrImage = qrcodeDiv.querySelector('img');
  if (!qrImage) {
    setStatus('Generate a QR code before downloading.', true);
    return;
  }

  const link = document.createElement('a');
  link.download = 'qrcode.png';
  link.href = qrImage.src;
  link.click();
  setStatus('Download started.');

  if (typeof gsap !== 'undefined') {
    gsap.to(downloadBtn, { scale: 0.94, duration: 0.1, yoyo: true, repeat: 1 });
  }
});

scanBtn.addEventListener('click', () => {
  if (!lastGeneratedData) {
    qrReaderResults.style.display = 'block';
    qrReaderResults.innerHTML =
      '<p>No QR content available. Generate one first.</p>';
    setStatus('Generate a QR code first.', true);
    return;
  }

  qrReaderResults.style.display = 'block';
  qrReaderResults.innerHTML = `<p><strong>QR Content:</strong></p><pre>${lastGeneratedData}</pre>`;
  setStatus('QR content is visible below.');
});

window.addEventListener('DOMContentLoaded', () => {
  setTheme(currentTheme);
  qrColor.value = themeColors[currentTheme];
  updateInputFields();

  if (typeof gsap !== 'undefined') {
    gsap.from('.glass-card', {
      opacity: 0,
      y: 26,
      duration: 0.55,
      stagger: 0.08,
      ease: 'power2.out',
      delay: 0.05,
    });
  }
});
