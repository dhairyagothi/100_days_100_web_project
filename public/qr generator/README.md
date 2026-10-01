# QuantumQR ⚡📱

A modern, feature-rich QR Code Generator & Scanner built with HTML, CSS, and JavaScript. Generate beautiful customizable QR codes, scan QR codes directly from your camera, manage QR history, and download QR codes instantly — all within a stunning glassmorphism interface.

![QuantumQR Banner](favicon_qr.png)

---

## ✨ Features

### 🎨 QR Code Generation

* Generate QR codes instantly
* Live QR preview
* Multiple QR content types:

  * Plain Text
  * Website URLs
  * WiFi Access Credentials
  * Contact Cards (vCard)

### 🎭 QR Customization

* Custom QR colors
* Square and Rounded styles
* Adjustable error correction levels:

  * Low (L)
  * Medium (M)
  * Quartile (Q)
  * High (H)
* Logo upload support

### 📷 QR Scanner

* Scan QR codes using device camera
* Real-time scanning
* Instant scan results

### 📊 Scanability Analysis

* QR quality scoring
* Scanability recommendations
* Error correction assessment

### 🕒 History Management

* Stores generated/scanned QR records
* Quick access to previous QR codes
* Clear history functionality

### 🎨 Multiple Themes

Choose from four beautiful themes:

* Aurora 🌌
* Neon ⚡
* Dark 🌑
* Candy 🍭

### 📥 Export & Sharing

* Download QR code as image
* Copy QR content
* Share QR data
* Reset generator instantly

### 📱 Responsive Design

* Mobile-friendly
* Tablet optimized
* Desktop ready

---

## 🛠️ Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript (ES6)

### Libraries

* QRCode.js
* HTML5-QRCode
* GSAP
* Font Awesome

### UI Design

* Glassmorphism
* Animated gradient backgrounds
* Dynamic theme switching
* Responsive layouts

---

## 📂 Project Structure

```text
QuantumQR/
│
├── index.html
├── qr.css
├── qr.js
├── favicon_qr.png
│
└── assets/
```

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/dhairyagothi/100_days_100_web_project.git
```

### 2. Open Project

```bash
cd QuantumQR
```

### 3. Run Locally

Simply open:

```text
index.html
```

Or use a local server:

```bash
npx serve .
```

---

## 🔧 Dependencies

Included via CDN:

### QRCode.js

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
```

### HTML5 QRCode

```html
<script src="https://unpkg.com/html5-qrcode"></script>
```

### GSAP

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
```

### Font Awesome

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
```

---

## 📖 Usage

### Generate a QR Code

1. Select a QR type.
2. Enter the required information.
3. Customize color and style.
4. Upload a logo (optional).
5. Click **Generate QR Code**.

### Scan a QR Code

1. Click **Scan**.
2. Allow camera permissions.
3. Point your camera at a QR code.
4. View scan results instantly.

### Download

1. Generate a QR code.
2. Click **Download**.
3. Save the image to your device.

---

## 🎨 Themes

| Theme  | Description                     |
| ------ | ------------------------------- |
| Aurora | Purple-blue futuristic gradient |
| Neon   | Bright cyberpunk aesthetic      |
| Dark   | Minimal charcoal dark mode      |
| Candy  | Soft colorful pastel design     |

---

## 🔒 Privacy

QuantumQR processes everything directly in your browser.

✅ No server uploads
✅ No user tracking
✅ No external data storage
✅ Fully client-side operation

---

## 📱 Browser Support

* Chrome
* Edge
* Firefox
* Safari
* Brave
* Opera

---

## 🔮 Future Improvements

* SVG QR downloads
* Batch QR generation
* QR analytics
* Custom frame templates
* Dynamic QR support
* Dark mode auto-detection
* PWA support

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the project
2. Create your feature branch

```bash
git checkout -b feature/AmazingFeature
```

3. Commit your changes

```bash
git commit -m "Add Amazing Feature"
```

4. Push to the branch

```bash
git push origin feature/AmazingFeature
```

5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Built with ❤️ using modern web technologies.

**QuantumQR — Fast • Stylish • Secure**
