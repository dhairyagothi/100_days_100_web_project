const qrType = document.getElementById('qr-type');
const inputText = document.getElementById('inputtext');
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
const qrReader = document.getElementById('qr-reader');
const qrReaderResults = document.getElementById('qr-reader-results');
const toggleThemeBtn = document.getElementById('toggle-theme');

let qrcode = null;

function updateInputFields() {
    const selectedType = qrType.value;
    inputText.style.display = selectedType === 'text' || selectedType === 'url' ? 'block' : 'none';
    wifiInputs.style.display = selectedType === 'wifi' ? 'block' : 'none';
    vcardInputs.style.display = selectedType === 'vcard' ? 'block' : 'none';
}

qrType.addEventListener('change', updateInputFields);

function generateQRCode() {
    qrcodeDiv.innerHTML = '';
    const selectedType = qrType.value;
    let data = '';

    switch (selectedType) {
        case 'text':
        case 'url':
            data = inputText.value;
            break;
        case 'wifi':
            const ssid = document.getElementById('wifi-ssid').value;
            const password = document.getElementById('wifi-password').value;
            const encryption = document.getElementById('wifi-encryption').value;
            data = `WIFI:T:${encryption};S:${ssid};P:${password};;`;
            break;
        case 'vcard':
            const name = document.getElementById('vcard-name').value;
            const phone = document.getElementById('vcard-phone').value;
            const email = document.getElementById('vcard-email').value;
            const website = document.getElementById('vcard-website').value;
            data = `BEGIN:VCARD\nVERSION:3.0\nN:${name}\nTEL:${phone}\nEMAIL:${email}\nURL:${website}\nEND:VCARD`;
            break;
    }

    if (data) {
        qrcode = new QRCode(qrcodeDiv, {
            text: data,
            width: 200,
            height: 200,
            colorDark: qrColor.value,
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel[errorCorrection.value]
        });

        applyQRCodeStyle();
        addLogoToQRCode();
    }
}

function applyQRCodeStyle() {
    const modules = qrcodeDiv.getElementsByTagName('img')[0];
    modules.style.borderRadius = qrShape.value === 'rounded' ? '15px' : '0';
    
    if (qrShape.value === 'dots') {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = modules.width;
        canvas.height = modules.height;
        ctx.drawImage(modules, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const x = (i / 4) % canvas.width;
            const y = Math.floor((i / 4) / canvas.width);
            
            if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) {
                ctx.beginPath();
                ctx.arc(x + 0.5, y + 0.5, 0.4, 0, Math.PI * 2);
                ctx.fillStyle = qrColor.value;
                ctx.fill();
            }
        }
        
        modules.src = canvas.toDataURL();
    }
}

function addLogoToQRCode() {
    const file = logoUpload.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const logo = new Image();
            logo.src = e.target.result;
            logo.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const qrImage = qrcodeDiv.getElementsByTagName('img')[0];
                
                canvas.width = qrImage.width;
                canvas.height = qrImage.height;
                ctx.drawImage(qrImage, 0, 0);
                
                const logoSize = canvas.width * 0.2;
                const logoX = (canvas.width - logoSize) / 2;
                const logoY = (canvas.height - logoSize) / 2;
                ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
                
                qrImage.src = canvas.toDataURL();
            };
        };
        reader.readAsDataURL(file);
    }
}

generateBtn.addEventListener('click', generateQRCode);
qrColor.addEventListener('change', generateQRCode);
qrShape.addEventListener('change', generateQRCode);
errorCorrection.addEventListener('change', generateQRCode);
logoUpload.addEventListener('change', generateQRCode);

downloadBtn.addEventListener('click', function() {
    if (qrcode) {
        const qrImage = qrcodeDiv.getElementsByTagName('img')[0];
        const link = document.createElement('a');
        link.download = 'qrcode.png';
        link.href = qrImage.src;
        link.click();
    }
});

scanBtn.addEventListener('click', function() {
    if (qrReader.style.display === 'none') {
        qrReader.style.display = 'block';
        const html5QrCode = new Html5Qrcode("qr-reader");
        const qrBoxSize = 250;
        
        html5QrCode.start(
            { facingMode: "environment" },
            {
                qrbox: qrBoxSize,
            },
            (decodedText, decodedResult) => {
                qrReaderResults.innerHTML = `<p>Decoded QR Code: ${decodedText}</p>`;
                html5QrCode.stop();
                qrReader.style.display = 'none';
            },
            (errorMessage) => {
                // console.log(errorMessage);
            }
        );
    } else {
        qrReader.style.display = 'none';
    }
});

toggleThemeBtn.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
});

updateInputFields();