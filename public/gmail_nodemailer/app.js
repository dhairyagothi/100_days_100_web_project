require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 5500;

// ---- Sanity check: make sure required env vars exist before starting ----
const REQUIRED_ENV_VARS = ['EMAIL_USER', 'EMAIL_PASS'];
const missingVars = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
  console.error(
    `Missing required environment variable(s): ${missingVars.join(', ')}`
  );
  console.error(
    'Create a .env file in the project root (see .env.example) and set these values.'
  );
  console.error(
    'EMAIL_PASS must be a 16-character Gmail "App Password", NOT your normal Gmail password.'
  );
  process.exit(1);
}

function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  if (email.length === 0 || email.length > 254) return false; // RFC 5321 max length

  const atIndex = email.indexOf('@');
  if (atIndex <= 0 || atIndex !== email.lastIndexOf('@')) return false;

  const localPart = email.slice(0, atIndex);
  const domainPart = email.slice(atIndex + 1);

  if (localPart.length === 0 || localPart.length > 64) return false;
  if (domainPart.length === 0 || domainPart.length > 255) return false;

  // Simple, bounded, non-backtracking checks (no nested quantifiers)
  const simpleEmailPattern = /^[A-Za-z0-9._%+-]+$/;
  const simpleDomainPattern = /^[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  return (
    simpleEmailPattern.test(localPart) && simpleDomainPattern.test(domainPart)
  );
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ---- Create the transporter once and reuse it (instead of per-request) ----
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify the transporter config on startup so issues are caught early
transporter.verify((error) => {
  if (error) {
    console.error('Nodemailer transporter verification failed:');
    console.error(error.message);
    console.error(
      '👉 Double check EMAIL_USER / EMAIL_PASS in your .env file and that 2-Step Verification + App Password are enabled on the Gmail account.'
    );
  } else {
    console.log('Nodemailer is configured correctly and ready to send emails.');
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mail.html'));
});

app.post('/subscribe', async (req, res) => {
  const { name, emailid } = req.body;

  // ---- Basic server-side validation ----
  if (!name || !emailid) {
    return res.status(400).json({
      success: false,
      message: 'Name and email are required.',
    });
  }

  if (!isValidEmail(emailid)) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid email address.',
    });
  }

  const mailOptions = {
    from: `"Newsletter" <${process.env.EMAIL_USER}>`,
    to: emailid,
    subject: 'Welcome to Our Newsletter',
    html: `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:20px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0"
            style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;width:100%;">

            <tr>
              <td align="center"
                style="background:linear-gradient(135deg,#00b6d1,#0077ff);padding:35px 20px;">
                <h1 style="margin:0;color:#ffffff;font-size:28px;">
                  Welcome 
                </h1>
              </td>
            </tr>

            <tr>
              <td style="padding:35px 30px;color:#333333;">
                <h2 style="margin-top:0;">
                  Hi ${name},
                </h2>

                <p style="font-size:16px;line-height:1.7;">
                  Thank you for subscribing to our newsletter.
                  We're excited to have you with us.
                </p>

                <p style="font-size:16px;line-height:1.7;">
                  You'll receive updates, announcements, and exclusive content directly in your inbox.
                </p>

                <div style="text-align:center;margin:35px 0;">
                  <a href="#"
                    style="background:#0077ff;color:#ffffff;text-decoration:none;
                    padding:14px 28px;border-radius:8px;font-weight:bold;display:inline-block;">
                    Stay Connected
                  </a>
                </div>

                <p style="font-size:15px;color:#666;">
                  Thanks for joining us!
                </p>
              </td>
            </tr>

            <tr>
              <td align="center"
                style="background:#f1f5f9;padding:20px;color:#64748b;font-size:13px;">
                © 2026 Gmail Nodemailer Project
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return res.status(200).json({
      success: true,
      message: 'Email sent successfully',
    });
  } catch (error) {
    console.error('Email sending failed:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to send email. Please try again later.',
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
