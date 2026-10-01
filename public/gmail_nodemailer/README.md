# Gmail Nodemailer — Newsletter Subscription Form

A simple subscription form that sends a styled HTML welcome email using **Nodemailer + Gmail SMTP**.

---

## 🐛 What was broken

The form was showing **"Something went wrong ❌"** on every submit. Root causes found and fixed:

1. **Missing `.env` file** — `EMAIL_USER` and `EMAIL_PASS` were `undefined`, so Gmail's SMTP server rejected the login (`auth` failed) and `transporter.sendMail()` errored out every time.
2. **No startup validation** — the server would start even without credentials, hiding the real error until someone clicked subscribe. Added a check that exits with a clear message if env vars are missing.
3. **No transporter verification** — added `transporter.verify()` on boot so config issues show up immediately in the terminal instead of only on form submit.
4. **Frontend/backend mismatch** — the form posted to `/` (same route that serves the HTML page) and checked `result.includes('successfully')` on a plain text response. Moved the mail logic to its own `POST /subscribe` route that returns proper JSON (`{ success, message }`), which the frontend now reads correctly.
5. **No server-side validation** — added checks so empty name/invalid email return a clean `400` instead of crashing further down.
6. **Hardcoded creation of a new transporter per request** — moved transporter creation outside the route so it's created once and reused.

## 🎨 UI improvements

- Inline field validation with error messages under each input (no more relying only on the browser's default popups).
- Loading spinner inside the "Subscribe Now" button while the email is sending.
- Subtle entrance animation on the card.
- Cleaned up the "Back to Home" button into a proper CSS class instead of an inline `style` attribute.
- Kept the existing dark glassmorphism theme and toast notification design — just polished and made consistent.

---

## 📁 Project Structure

```
gmail_nodemailer/
├── public/
│   ├── mail.html
│   └── mail.css
├── app.js
├── .env.example      ← copy this to .env and fill in your values
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create your `.env` file:
   ```bash
   cp .env.example .env
   ```

3. Fill in `.env` with your Gmail address and an **App Password** (not your normal Gmail password):
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Turn on **2-Step Verification** (required)
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Generate a password for "Mail" and paste the 16-character code into `EMAIL_PASS`

   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your16characterapppassword
   PORT=5500
   ```

4. Run the server:
   ```bash
   npm run dev
   ```

5. Open `http://localhost:5500` and try subscribing. Check your terminal — on startup you should see:
   ```
   ✅ Nodemailer is configured correctly and ready to send emails.
   🚀 Server running at http://localhost:5500
   ```

---

## ⚠️ Security Note

Never commit your real `.env` file. It's already excluded via `.gitignore`. Only `.env.example` (with placeholder values) should be pushed to GitHub.

