/* ============================================================
   SteganoVault — Image Steganography Tool
   Technique: LSB (Least Significant Bit) on RGBA pixel data
   ============================================================ */

// ─── State ───────────────────────────────────────────────────
let encodeImageData = null;   // ImageData object for encoding
let encodedCanvas   = null;   // output canvas after encoding
let decodeImageData = null;   // ImageData object for decoding

// Delimiter to mark end of hidden message
const DELIMITER = '<<<END>>>';

// ─── Tab Switching ────────────────────────────────────────────
function switchTab(tab) {
    document.getElementById('tab-encode').classList.toggle('active', tab === 'encode');
    document.getElementById('tab-decode').classList.toggle('active', tab === 'decode');
    document.getElementById('panel-encode').style.display = tab === 'encode' ? 'flex' : 'none';
    document.getElementById('panel-decode').style.display = tab === 'decode' ? 'flex' : 'none';
}

// ─── Encode: Handle Image Upload ─────────────────────────────
function handleEncodeImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { showToast('Please upload a valid image file.'); return; }

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.getElementById('encode-preview-canvas');
            canvas.width  = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            encodeImageData = ctx.getImageData(0, 0, img.width, img.height);

            // Show preview
            document.getElementById('encode-placeholder').style.display = 'none';
            canvas.style.display = 'block';

            checkEncodeReady();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// ─── Decode: Handle Image Upload ─────────────────────────────
function handleDecodeImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { showToast('Please upload a valid image file.'); return; }

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.getElementById('decode-preview-canvas');
            canvas.width  = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            decodeImageData = ctx.getImageData(0, 0, img.width, img.height);

            // Show preview
            document.getElementById('decode-placeholder').style.display = 'none';
            canvas.style.display = 'block';

            // Reset result areas
            document.getElementById('decode-result').style.display = 'none';
            document.getElementById('decode-error').style.display  = 'none';
            document.getElementById('decode-btn').disabled = false;
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// ─── Textarea character counter ───────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const ta = document.getElementById('secret-message');
    const cc = document.getElementById('char-count');
    ta.addEventListener('input', () => {
        cc.textContent = `${ta.value.length} / 5000`;
        checkEncodeReady();
    });

    // Drag & drop for encode
    setupDrop('encode-drop', handleEncodeFileDrop);
    setupDrop('decode-drop', handleDecodeFileDrop);
});

function checkEncodeReady() {
    const hasImage   = encodeImageData !== null;
    const hasMessage = document.getElementById('secret-message').value.trim().length > 0;
    document.getElementById('encode-btn').disabled = !(hasImage && hasMessage);
}

// ─── Drag & Drop Helpers ─────────────────────────────────────
function setupDrop(zoneId, handler) {
    const zone = document.getElementById(zoneId);
    zone.addEventListener('dragover',  (e) => { e.preventDefault(); zone.classList.add('dragover'); });
    zone.addEventListener('dragleave', ()  => zone.classList.remove('dragover'));
    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file) handler(file);
    });
}

function handleEncodeFileDrop(file) {
    // Simulate input change
    const dt = new DataTransfer();
    dt.items.add(file);
    const input = document.getElementById('encode-img-input');
    input.files = dt.files;
    handleEncodeImage({ target: input });
}

function handleDecodeFileDrop(file) {
    const dt = new DataTransfer();
    dt.items.add(file);
    const input = document.getElementById('decode-img-input');
    input.files = dt.files;
    handleDecodeImage({ target: input });
}

// ─── LSB Core: Encode ─────────────────────────────────────────
/*
   For each bit of the message (as UTF-8 binary string):
   We modify the least significant bit of the Red channel of each pixel.
   1 pixel = 1 bit. Red channel only → minimal colour distortion.
*/
function encodeMessage() {
    if (!encodeImageData) { showToast('Please upload an image first.'); return; }

    const message = document.getElementById('secret-message').value;
    if (!message.trim()) { showToast('Please enter a message to hide.'); return; }

    const fullMessage = message + DELIMITER;
    const binary = textToBinary(fullMessage);

    const data   = new Uint8ClampedArray(encodeImageData.data); // copy
    const pixels = data.length / 4; // R G B A per pixel

    if (binary.length > pixels) {
        showToast('⚠️ Message too long for this image. Use a larger image or shorter message.');
        return;
    }

    // Embed each bit into LSB of Red channel
    for (let i = 0; i < binary.length; i++) {
        const pixelIndex = i * 4; // R is at pixelIndex, G at +1, B at +2, A at +3
        data[pixelIndex] = (data[pixelIndex] & 0b11111110) | parseInt(binary[i]);
    }

    // Write to output canvas
    const srcCanvas = document.getElementById('encode-preview-canvas');
    const outCanvas = document.getElementById('output-canvas');
    outCanvas.width  = srcCanvas.width;
    outCanvas.height = srcCanvas.height;
    const ctx = outCanvas.getContext('2d');
    const imageDataOut = new ImageData(data, srcCanvas.width, srcCanvas.height);
    ctx.putImageData(imageDataOut, 0, 0);

    encodedCanvas = outCanvas;

    document.getElementById('encode-result').style.display = 'flex';
    showToast('✅ Message hidden successfully!');
}

// ─── LSB Core: Decode ─────────────────────────────────────────
function decodeMessage() {
    if (!decodeImageData) { showToast('Please upload an image first.'); return; }

    const data = decodeImageData.data;
    let binary = '';

    // Extract LSB of Red channel from every pixel
    for (let i = 0; i < data.length; i += 4) {
        binary += (data[i] & 1).toString(); // LSB of Red
    }

    const text = binaryToText(binary);
    const delimIndex = text.indexOf(DELIMITER);

    const resultBox = document.getElementById('decode-result');
    const errorBox  = document.getElementById('decode-error');
    const outputEl  = document.getElementById('decoded-text');

    if (delimIndex === -1) {
        resultBox.style.display = 'none';
        errorBox.style.display  = 'block';
    } else {
        const hidden = text.substring(0, delimIndex);
        outputEl.textContent    = hidden;
        resultBox.style.display = 'flex';
        errorBox.style.display  = 'none';
        showToast('🔓 Message revealed!');
    }
}

// ─── Download ─────────────────────────────────────────────────
function downloadImage() {
    if (!encodedCanvas) return;
    const link = document.createElement('a');
    link.download = 'steganovault_encoded.png';
    link.href = encodedCanvas.toDataURL('image/png');
    link.click();
}

// ─── Copy decoded text ────────────────────────────────────────
function copyDecoded() {
    const text = document.getElementById('decoded-text').textContent;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => showToast('📋 Copied to clipboard!'));
}

// ─── Utility: Text ↔ Binary ──────────────────────────────────
function textToBinary(text) {
    // Encode to UTF-8 bytes, then to binary string
    const encoder = new TextEncoder();
    const bytes = encoder.encode(text);
    let binary = '';
    for (const byte of bytes) {
        binary += byte.toString(2).padStart(8, '0');
    }
    return binary;
}

function binaryToText(binary) {
    const bytes = [];
    for (let i = 0; i + 7 < binary.length; i += 8) {
        bytes.push(parseInt(binary.substring(i, i + 8), 2));
    }
    try {
        const decoder = new TextDecoder('utf-8', { fatal: false });
        return decoder.decode(new Uint8Array(bytes));
    } catch {
        return '';
    }
}

// ─── Toast Notification ───────────────────────────────────────
function showToast(msg) {
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => toast.classList.remove('show'), 2800);
}