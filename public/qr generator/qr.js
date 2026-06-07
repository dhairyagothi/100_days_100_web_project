// QR generator + history + scanability module
// Implements: QR generation, styling, logo placement, localStorage history, and basic scanability analysis

const qrType = document.getElementById("qr-type");
const inputText = document.getElementById("inputtext");
// fallback to the label immediately before the input (keeps HTML changes minimal)
const inputLabel = inputText && inputText.previousElementSibling && inputText.previousElementSibling.tagName.toLowerCase() === 'label'
    ? inputText.previousElementSibling
    : null;

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

let realtimeTimer = null;
let currentTheme = "aurora";
let lastGeneratedData = "";

const themeColors = {
    aurora: "#a78bfa",
    neon: "#00ff88",
    dark: "#d4d4d4",
    candy: "#e91e8c"
};

function setStatus(message, isError = false) {
    if (!statusMessage) return;
    statusMessage.textContent = message;
    statusMessage.style.color = isError ? "#f87171" : "";
}

function escapeText(text) {
    return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "");
}

function updateInputFields() {
    const selectedType = qrType.value;
    const showMainInput = selectedType === "text" || selectedType === "url";
    const showWifi = selectedType === "wifi";
    const showVcard = selectedType === "vcard";

    inputText.style.display = showMainInput ? "block" : "none";
    if (inputLabel) inputLabel.style.display = showMainInput ? "block" : "none";
    wifiInputs.style.display = showWifi ? "block" : "none";
    vcardInputs.style.display = showVcard ? "block" : "none";

    if (selectedType === "url") {
        if (inputLabel) inputLabel.textContent = "Enter URL";
        inputText.placeholder = "https://example.com";
    } else if (selectedType === "text") {
        if (inputLabel) inputLabel.textContent = "Enter text";
        inputText.placeholder = "Enter your text";
    }
}

function collectQrData() {
    const selectedType = qrType.value;

    if (selectedType === "text") {
        const value = inputText.value.trim();
        if (!value) return { error: "Enter some text to generate a QR code." };
        return { data: value };
    }

    if (selectedType === "url") {
        const value = inputText.value.trim();
        if (!value) return { error: "Enter a URL to generate a QR code." };
        const normalized = /^(https?:\/\/)/i.test(value) ? value : `https://${value}`;
        return { data: normalized };
    }

    if (selectedType === "wifi") {
        const ssid = wifiSSID.value.trim();
        if (!ssid) return { error: "WiFi SSID is required." };
        const password = wifiPassword.value;
        const encryption = wifiEncryption.value;
        const wifiPayload = `WIFI:T:${encryption};S:${escapeText(ssid)};P:${escapeText(password)};;`;
        return { data: wifiPayload };
    }

    if (selectedType === "vcard") {
        const name = vcardName.value.trim();
        const phone = vcardPhone.value.trim();
        const email = vcardEmail.value.trim();
        const website = vcardWebsite.value.trim();
        if (!name && !phone && !email && !website) return { error: "Fill at least one vCard field." };
        const lines = [
            "BEGIN:VCARD",
            "VERSION:3.0",
            `FN:${escapeText(name)}`,
            `TEL:${escapeText(phone)}`,
            `EMAIL:${escapeText(email)}`,
            `URL:${escapeText(website)}`,
            "END:VCARD"
        ];
        return { data: lines.join("\n") };
    }

    return { error: "Unsupported QR type selected." };
}

function drawDotsStyle(baseImage, color) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = baseImage.width;
    canvas.height = baseImage.height;
    ctx.drawImage(baseImage, 0, 0);

    const source = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;

    for (let i = 0; i < source.data.length; i += 4) {
        const isDark = source.data[i] < 170 && source.data[i + 1] < 170 && source.data[i + 2] < 170;
        if (!isDark) continue;
        const x = (i / 4) % canvas.width;
        const y = Math.floor((i / 4) / canvas.width);
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
            const ctx = baseCanvas.getContext("2d");
            const correction = errorCorrection.value;
            const sizeRatioMap = { L: 0.11, M: 0.13, Q: 0.15, H: 0.17 };
            const logoSize = Math.floor(baseCanvas.width * (sizeRatioMap[correction] || 0.13));
            const x = (baseCanvas.width - logoSize) / 2;
            const y = (baseCanvas.height - logoSize) / 2;
            const pad = Math.max(2, Math.floor(logoSize * 0.12));

            ctx.fillStyle = "rgba(255,255,255,0.98)";
            ctx.fillRect(x - pad, y - pad, logoSize + (pad * 2), logoSize + (pad * 2));
            ctx.drawImage(logo, x, y, logoSize, logoSize);

            // Attach logo ratio to canvas for scanability checks
            baseCanvas._logoRatio = (logoSize * logoSize) / (baseCanvas.width * baseCanvas.height);
            resolve(baseCanvas);
        };
        logo.onerror = () => resolve(baseCanvas);
        logo.src = imageUrl;
    });
}

async function styleAndMaybeLogo() {
    const qrImg = qrcodeDiv.querySelector("img");
    if (!qrImg) return null;

    if (!qrImg.complete || qrImg.naturalWidth === 0) {
        await new Promise((resolve) => {
            qrImg.onload = resolve;
            qrImg.onerror = resolve;
        });
    }

    if (qrShape.value === "rounded") qrImg.style.borderRadius = "14px";
    else qrImg.style.borderRadius = "0";

    let canvas = document.createElement("canvas");
    canvas.width = qrImg.width;
    canvas.height = qrImg.height;
    canvas.getContext("2d").drawImage(qrImg, 0, 0);

    if (qrShape.value === "dots") {
        canvas = drawDotsStyle(qrImg, qrColor.value);
    }

    const logoFile = logoUpload.files[0];
    if (logoFile) {
        if (errorCorrection.value === "L") setStatus("Logo added. For best scan reliability, use Q or H error correction.", true);
        const logoDataUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(logoFile);
        });
        canvas = await placeLogo(canvas, logoDataUrl);
    }

    qrImg.src = canvas.toDataURL("image/png");
    qrImg.style.display = "block";
    qrImg.style.margin = "0 auto";
    return canvas;
}

async function generateQRCode() {
    qrcodeDiv.innerHTML = "";

    const result = collectQrData();
    if (result.error) {
        lastGeneratedData = "";
        setStatus(result.error, true);
        return;
    }
    lastGeneratedData = result.data;

    new QRCode(qrcodeDiv, {
        text: result.data,
        width: 200,
        height: 200,
        colorDark: qrColor.value || themeColors[currentTheme],
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel[errorCorrection.value]
    });

    if (typeof gsap !== "undefined") {
        gsap.fromTo(
            qrcodeDiv,
            { scale: 0.9, opacity: 0.2 },
            { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(1.6)" }
        );
    }

    setTimeout(async () => {
        const finalCanvas = await styleAndMaybeLogo();
        setStatus("QR code generated.");

        // perform scanability analysis and update UI
        try {
            if (finalCanvas) {
                const analysis = analyzeScanability(finalCanvas, {
                    errorCorrection: errorCorrection.value,
                    color: qrColor.value,
                    shape: qrShape.value
                });
                displayScanability(analysis);
            }
        } catch (e) {
            console.warn("Scanability analysis failed", e);
        }

        // Save to history (avoid consecutive duplicates). Store thumbnail in IndexedDB and save id in localStorage entry.
        try {
            if (finalCanvas) {
                const dataUrl = makeThumbnail(finalCanvas);
                let thumbnailId = null;
                if (dataUrl) {
                    thumbnailId = await saveThumbnailToDb(dataUrl);
                }
                pushHistory({
                    type: qrType.value,
                    payload: lastGeneratedData,
                    color: qrColor.value,
                    shape: qrShape.value,
                    errorCorrection: errorCorrection.value,
                    timestamp: Date.now(),
                    thumbnailId: thumbnailId
                });
                renderHistory();
            }
        } catch (e) {
            console.warn("History save failed", e);
        }
    }, 40);
}

function scheduleGenerate() {
    clearTimeout(realtimeTimer);
    realtimeTimer = setTimeout(() => {
        generateQRCode();
    }, 280);
}

function setTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute("data-theme", theme);
}

// Thumbnail helper
function makeThumbnail(canvas, size = 128) {
    try {
        const t = document.createElement("canvas");
        t.width = size; t.height = size;
        const ctx = t.getContext("2d");
        ctx.fillStyle = "#fff"; ctx.fillRect(0,0,size,size);
        ctx.drawImage(canvas, 0, 0, size, size);
        return t.toDataURL("image/png");
    } catch (e) { return null; }
}

// --------------------------- History storage ---------------------------
const HISTORY_KEY = "qr_history_v1";
const HISTORY_LIMIT = 25;

// IndexedDB helpers for storing thumbnails (to avoid localStorage bloat)
function openDb() {
    return new Promise((resolve, reject) => {
        try {
            const req = indexedDB.open('qr_history_db', 1);
            req.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('thumbnails')) {
                    db.createObjectStore('thumbnails', { keyPath: 'id' });
                }
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        } catch (e) {
            reject(e);
        }
    });
}

async function saveThumbnailToDb(dataUrl) {
    if (!dataUrl) return null;
    try {
        const db = await openDb();
        const tx = db.transaction('thumbnails', 'readwrite');
        const store = tx.objectStore('thumbnails');
        const id = 't_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
        const req = store.put({ id, data: dataUrl });
        return await new Promise((res, rej) => {
            req.onsuccess = () => { res(id); };
            req.onerror = () => { rej(req.error); };
        });
    } catch (e) {
        console.warn('IndexedDB save failed', e);
        return null;
    }
}

async function getThumbnailFromDb(id) {
    if (!id) return null;
    try {
        const db = await openDb();
        const tx = db.transaction('thumbnails', 'readonly');
        const store = tx.objectStore('thumbnails');
        const req = store.get(id);
        return await new Promise((res, rej) => {
            req.onsuccess = () => { res(req.result ? req.result.data : null); };
            req.onerror = () => { rej(req.error); };
        });
    } catch (e) {
        console.warn('IndexedDB get failed', e);
        return null;
    }
}

async function deleteThumbnailFromDb(id) {
    if (!id) return;
    try {
        const db = await openDb();
        const tx = db.transaction('thumbnails', 'readwrite');
        const store = tx.objectStore('thumbnails');
        store.delete(id);
    } catch (e) {
        console.warn('IndexedDB delete failed', e);
    }
}

async function clearThumbnailsDb() {
    try {
        const db = await openDb();
        const tx = db.transaction('thumbnails', 'readwrite');
        const store = tx.objectStore('thumbnails');
        store.clear();
    } catch (e) {
        console.warn('IndexedDB clear failed', e);
    }
}

function getHistory() {
    try {
        const raw = localStorage.getItem(HISTORY_KEY);
        if (!raw) return [];
        return JSON.parse(raw);
    } catch (e) { return []; }
}

function saveHistory(list) {
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, HISTORY_LIMIT))); }
    catch (e) { console.warn("Failed to save history", e); }
}

function pushHistory(entry) {
    if (!entry || !entry.payload) return;
    const list = getHistory();
    if (list.length > 0) {
        const last = list[0];
        if (last.payload === entry.payload && last.type === entry.type) return; // duplicate
    }
    // keep thumbnail handling to caller (so async DB calls are awaited there)
    list.unshift(entry);
    saveHistory(list);
}

function removeHistoryEntry(index) {
    const list = getHistory();
    if (index < 0 || index >= list.length) return;
    const [removed] = list.splice(index, 1);
    saveHistory(list);
    // remove associated thumbnail from DB if stored as id
    if (removed && removed.thumbnailId) {
        deleteThumbnailFromDb(removed.thumbnailId);
    }
}

function clearHistory() { localStorage.removeItem(HISTORY_KEY); try { clearThumbnailsDb(); } catch (e) { /* ignore */ } }

function renderHistory() {
    const container = document.getElementById("history-list");
    if (!container) return;
    const list = getHistory();
    if (list.length === 0) {
        container.innerHTML = "<p style='color:#666;margin:6px 0'>No history yet.</p>";
        return;
    }
    container.innerHTML = "";
    list.forEach((entry, idx) => {
        const el = document.createElement("div");
        el.style.display = "flex"; el.style.alignItems = "center"; el.style.justifyContent = "space-between";
        el.style.padding = "6px 4px"; el.style.borderBottom = "1px solid rgba(0,0,0,0.06)";

        const left = document.createElement("div"); left.style.display = "flex"; left.style.alignItems = "center";
        const thumb = document.createElement("img");
        thumb.alt = "thumb"; thumb.style.width = "48px"; thumb.style.height = "48px";
        thumb.style.objectFit = "contain"; thumb.style.background = "#fff"; thumb.style.border = "1px solid rgba(0,0,0,0.06)"; thumb.style.borderRadius = "6px"; thumb.style.marginRight = "8px";

        const meta = document.createElement("div"); meta.style.fontSize = "12px";
        meta.innerHTML = `<div style='font-weight:600'>${escapeHtml(entry.type)}</div><div style='color:#666'>${new Date(entry.timestamp).toLocaleString()}</div>`;
        left.appendChild(thumb); left.appendChild(meta);
        // load thumbnail asynchronously: prefer thumbnailId stored in DB, else legacy data URL
        if (entry.thumbnailId) {
            getThumbnailFromDb(entry.thumbnailId).then((src) => {
                if (src) thumb.src = src; else thumb.src = "";
            }).catch(() => { thumb.src = ""; });
        } else if (entry.thumbnail) {
            thumb.src = entry.thumbnail;
            // migrate large inline thumbnails to DB to save localStorage space
            try {
                if (entry.thumbnail && entry.thumbnail.length > 1024) {
                    saveThumbnailToDb(entry.thumbnail).then((id) => {
                        if (id) {
                            const list = getHistory();
                            const e = list[idx];
                            if (e) { e.thumbnailId = id; delete e.thumbnail; saveHistory(list); }
                        }
                    }).catch(() => {});
                }
            } catch (e) { /* ignore */ }
        } else {
            thumb.src = "";
        }

        const actions = document.createElement("div"); actions.style.display = "flex"; actions.style.gap = "6px";
        const regen = document.createElement("button"); regen.textContent = "Regenerate"; regen.style.fontSize = "12px";
        regen.addEventListener("click", () => { applyEntryToInputs(entry); generateQRCode(); });
        const del = document.createElement("button"); del.textContent = "Delete"; del.style.fontSize = "12px";
        del.addEventListener("click", () => { removeHistoryEntry(idx); renderHistory(); });
        actions.appendChild(regen); actions.appendChild(del);

        el.appendChild(left); el.appendChild(actions); container.appendChild(el);
    });
}

function escapeHtml(s) { if (!s) return ""; return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

function applyEntryToInputs(entry) {
    if (!entry) return;
    qrType.value = entry.type || "text"; updateInputFields();
    if (entry.type === "text" || entry.type === "url") inputText.value = entry.payload || "";
    if (entry.color) qrColor.value = entry.color;
    if (entry.shape) qrShape.value = entry.shape;
    if (entry.errorCorrection) errorCorrection.value = entry.errorCorrection;
}

document.getElementById("clear-history").addEventListener("click", () => { clearHistory(); renderHistory(); });

// --------------------------- Scanability analysis ---------------------------
function analyzeScanability(canvas, opts = {}) {
    const ctx = canvas.getContext("2d");
    const w = canvas.width; const h = canvas.height;
    const img = ctx.getImageData(0,0,w,h).data;

    let darkSum=0, darkCount=0, lightSum=0, lightCount=0;
    for (let i=0;i<img.length;i+=4) {
        const r=img[i], g=img[i+1], b=img[i+2], a=img[i+3]; if (a<128) continue;
        const lum = (0.2126*r + 0.7152*g + 0.0722*b)/255;
        if (lum < 0.5) { darkSum += lum; darkCount++; } else { lightSum += lum; lightCount++; }
    }
    const avgDark = darkCount ? (darkSum/darkCount) : 0.0;
    const avgLight = lightCount ? (lightSum/lightCount) : 1.0;
    const contrastRatio = Math.max(0, avgLight - avgDark);
    const contrastScore = Math.round(Math.min(1, contrastRatio / 0.6) * 100);

    const ec = (opts.errorCorrection || "M").toUpperCase(); const ecMap = {L:25, M:50, Q:75, H:100}; const ecScore = ecMap[ec] || 50;

    const totalPixels = w*h; const darkRatio = darkCount / totalPixels;
    let densityScore = 100; if (darkRatio > 0.6) densityScore = Math.round(Math.max(0, (1 - ((darkRatio - 0.6)/0.4))) * 100);

    const logoRatio = canvas._logoRatio || 0; let logoScore = 100; if (logoRatio > 0) logoScore = Math.round(Math.max(0, (1 - (logoRatio / 0.18))) * 100);

    const weights = {contrast:0.35, errorCorrection:0.25, density:0.2, logo:0.2};
    const score = Math.round(contrastScore*weights.contrast + ecScore*weights.errorCorrection + densityScore*weights.density + logoScore*weights.logo);

    const rec = [];
    if (contrastScore < 60) rec.push("Increase contrast: use a darker QR color or lighter background.");
    if (ecScore < 75) rec.push("Increase error correction level (use Q or H) to tolerate logos or damage.");
    if (densityScore < 70) rec.push("Reduce data length or increase physical size to improve scanability.");
    if (logoScore < 80) rec.push("Reduce logo size or add more padding around the logo.");

    return { score: Math.max(0, Math.min(100, score)), breakdown: {contrast:contrastScore, errorCorrection:ecScore, density:Math.round(densityScore), logo:Math.round(logoScore)}, recommendations: rec };
}

function displayScanability(result) {
    const val = document.getElementById("scan-score-value");
    const rec = document.getElementById("scan-recommendations");
    if (!val || !rec) return;
    val.textContent = result.score;
    const parts = [];
    parts.push(`<div style='font-size:13px;color:#f8fafc;'><strong>Breakdown:</strong> Contrast ${result.breakdown.contrast}, EC ${result.breakdown.errorCorrection}, Density ${result.breakdown.density}, Logo ${result.breakdown.logo}</div>`);
    if (result.recommendations.length) {
        parts.push(`<ul style='margin:8px 0 0 18px;padding:0; color:#f8fafc;'>${result.recommendations.map(r=>`<li style='font-size:13px;color:#f8fafc;margin-bottom:4px;'>${escapeHtml(r)}</li>`).join("")}</ul>`);
    } else {
        parts.push(`<div style='font-size:13px;color:#a7f3d0'>No major issues detected.</div>`);
    }
    rec.innerHTML = parts.join("");
}

// --------------------------- UI events ---------------------------
qrType.addEventListener("change", () => { updateInputFields(); });

generateBtn.addEventListener("click", () => { generateQRCode(); });

downloadBtn.addEventListener("click", () => {
    const qrImage = qrcodeDiv.querySelector("img");
    if (!qrImage) { setStatus("Generate a QR code before downloading.", true); return; }
    const link = document.createElement("a"); link.download = "qrcode.png"; link.href = qrImage.src; link.click(); setStatus("Download started.");
});

scanBtn.addEventListener("click", () => {
    if (!lastGeneratedData) { qrReaderResults.style.display = "block"; qrReaderResults.innerHTML = "<p>No QR content available. Generate one first.</p>"; setStatus("Generate a QR code first.", true); return; }
    qrReaderResults.style.display = "block"; qrReaderResults.innerHTML = `<p><strong>QR Content:</strong></p><pre>${escapeHtml(lastGeneratedData)}</pre>`; setStatus("QR content is visible below.");
});

window.addEventListener("DOMContentLoaded", () => {
    setTheme(currentTheme);
    qrColor.value = themeColors[currentTheme];
    updateInputFields();
    renderHistory();
});
