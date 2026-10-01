// Tab Switching System Logic
function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    event.currentTarget.classList.add('active');
    document.getElementById(`${tabId}-section`).classList.add('active');
}

// File Parsing Listeners Setup
setupImagePreview('encode-file', 'encode-canvas');
setupImagePreview('decode-file', 'decode-canvas');

function setupImagePreview(fileInputId, canvasId) {
    const fileInput = document.getElementById(fileInputId);
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');

    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                canvas.style.display = 'block';
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });
}

// ---- Core Steganography Engine (LSB Algorithm Implementation) ----

document.getElementById('encode-btn').addEventListener('click', () => {
    const canvas = document.getElementById('encode-canvas');
    const msg = document.getElementById('secret-message').value;
    
    if (!canvas.style.display || canvas.style.display === 'none') {
        alert('Please upload an image first!');
        return;
    }
    if (!msg) {
        alert('Please type a message to hide!');
        return;
    }

    const ctx = canvas.getContext('2d');
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imgData.data;

    // Convert text string content to complete binary strings array maps
    // We add a specific boundary marker flag (null character '\0') so decoder knows where to stop reading
    let binaryMsg = "";
    for (let i = 0; i < msg.length; i++) {
        let bin = msg.charCodeAt(i).toString(2).padStart(8, '0');
        binaryMsg += bin;
    }
    binaryMsg += "00000000"; // Null terminator tracking stop point array bounds

    if (binaryMsg.length > data.length * (3 / 4)) {
        alert('Message is too long for this small image size!');
        return;
    }

    // Step through pixel channels modifying LSB parameters dynamically
    let bitIdx = 0;
    for (let i = 0; i < data.length; i++) {
        // Skip modifying alpha transparencies channels to guard image safety consistency profiles
        if ((i + 1) % 4 === 0) continue; 

        if (bitIdx < binaryMsg.length) {
            // Wipe standard LSB digit using bitwise calculations and add matching tracking flag string numbers
            data[i] = (data[i] & 0xFE) | parseInt(binaryMsg[bitIdx]);
            bitIdx++;
        } else {
            break;
        }
    }

    // Repaint modified pixels buffer streams back on working boards
    ctx.putImageData(imgData, 0, 0);

    // Prepare clean PNG download paths to keep binary structural boundaries clean
    const dlLink = document.getElementById('download-link');
    dlLink.href = canvas.toDataURL('image/png');
    dlLink.download = 'encrypted_secret_image.png';
    dlLink.style.display = 'block';
});

document.getElementById('decode-btn').addEventListener('click', () => {
    const canvas = document.getElementById('decode-canvas');
    
    if (!canvas.style.display || canvas.style.display === 'none') {
        alert('Please upload an encoded stego image first!');
        return;
    }

    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    let binaryMsg = "";
    let extractedText = "";

    // Iterate bits back parsing color indexes values arrays
    for (let i = 0; i < data.length; i++) {
        if ((i + 1) % 4 === 0) continue; // Bypass structural safety Alpha markers channels

        // Extract LSB bit
        binaryMsg += (data[i] & 1).toString();

        // Evaluate buffer blocks as complete 8-bit sequences to translate back to normal strings
        if (binaryMsg.length === 8) {
            if (binaryMsg === "00000000") {
                break; // Boundary check hit termination flag successfully
            }
            let charCode = parseInt(binaryMsg, 2);
            extractedText += String.fromCharCode(charCode);
            binaryMsg = ""; // Flush buffer array blocks
        }
    }

    // Display parsed text strings straight outward cleanly without any extra formatting or noise
    const outBox = document.getElementById('extracted-message-box');
    const outTxt = document.getElementById('extracted-text');
    
    outTxt.textContent = extractedText ? extractedText : "[No hidden text detected within this image footprint files.]";
    outBox.style.display = 'block';
});