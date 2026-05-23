# Gmail Nodemailer Contact Form

Simple Express and Nodemailer contact form that sends a confirmation email after form submission.

## Security Notes

- Do not commit SMTP usernames, passwords, Gmail app passwords, or API keys.
- Store email credentials in a local `.env` file.
- Rotate any credential that was previously committed to the repository.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file from the example:

```bash
cp .env.example .env
```

3. Fill in the SMTP values:

```env
PORT=5500
SMTP_SERVICE=Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@example.com
SMTP_PASS=your-app-password
MAIL_FROM=your-email@example.com
MAIL_TO=site-owner@example.com
```

4. Start the server:

```bash
node app.js
```

5. Open `http://localhost:5500`.

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | No | Server port. Defaults to `5500`. |
| `SMTP_SERVICE` | No | Nodemailer service name. Defaults to `Gmail`. |
| `SMTP_HOST` | No | SMTP host. Defaults to `smtp.gmail.com`. |
| `SMTP_PORT` | No | SMTP port. Defaults to `465`. |
| `SMTP_SECURE` | No | Set to `false` only for non-TLS SMTP setups. |
| `SMTP_USER` | Yes | SMTP account username. |
| `SMTP_PASS` | Yes | SMTP account password or app password. |
| `MAIL_FROM` | No | Sender address. Defaults to `SMTP_USER`. |
| `MAIL_TO` | Yes | Recipient address for contact form submissions. |
