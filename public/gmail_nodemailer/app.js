require('dotenv').config();

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');

const port = process.env.PORT || 5500;
const REQUEST_BODY_LIMIT = process.env.REQUEST_BODY_LIMIT || '8kb';
const requestBuckets = new Map();

function readPositiveInteger(name, fallback) {
  const parsed = Number.parseInt(process.env[name] || '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const MAX_NAME_LENGTH = readPositiveInteger('SUBSCRIBER_NAME_MAX_LENGTH', 100);
const RATE_LIMIT_WINDOW_MS = readPositiveInteger('MAIL_RATE_LIMIT_WINDOW_MS', 60000);
const RATE_LIMIT_MAX_REQUESTS = readPositiveInteger('MAIL_RATE_LIMIT_MAX_REQUESTS', 5);

function rateLimitMailRequests(req, res, next) {
  const now = Date.now();
  const clientId = req.ip || req.socket.remoteAddress || 'unknown';

  for (const [bucketClientId, bucket] of requestBuckets) {
    if (now > bucket.resetAt) {
      requestBuckets.delete(bucketClientId);
    }
  }

  const bucket = requestBuckets.get(clientId);

  if (!bucket || now > bucket.resetAt) {
    requestBuckets.set(clientId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  if (bucket.count >= RATE_LIMIT_MAX_REQUESTS) {
    const retryAfterSeconds = Math.ceil((bucket.resetAt - now) / 1000);
    res.set('Retry-After', String(retryAfterSeconds));
    return res.status(429).send('Too many email requests. Please try again later.');
  }

  bucket.count += 1;
  return next();
}

function validateSubscriber(body) {
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.emailid === 'string' ? body.emailid.trim() : '';
  const localPart = email.split('@')[0];
  const emailPattern =
    /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i;

  if (!name || name.length > MAX_NAME_LENGTH || /[\u0000-\u001F\u007F]/.test(name)) {
    return { error: `Name must be between 1 and ${MAX_NAME_LENGTH} characters.` };
  }

  if (
    !email ||
    email.length > 254 ||
    localPart.length > 64 ||
    localPart.startsWith('.') ||
    localPart.endsWith('.') ||
    localPart.includes('..') ||
    !emailPattern.test(email)
  ) {
    return { error: 'Enter one valid email address.' };
  }

  return { name, email };
}

function escapeHtml(value) {
  const htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };

  return value.replace(/[&<>"']/g, (character) => htmlEntities[character]);
}

app.use(bodyParser.urlencoded({ extended: false, limit: REQUEST_BODY_LIMIT }));
app.use(express.json({ limit: REQUEST_BODY_LIMIT }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'mail.html'));
});

app.post('/', rateLimitMailRequests, function (req, res) {
  const subscriber = validateSubscriber(req.body || {});

  if (subscriber.error) {
    return res.status(400).send(subscriber.error);
  }

  const safeName = escapeHtml(subscriber.name);
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: subscriber.email,
    subject: 'Welcome to Our Newsletter 🎉',

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
                  Welcome 🎉
                </h1>
              </td>
            </tr>

            <tr>
              <td style="padding:35px 30px;color:#333333;">
                <h2 style="margin-top:0;">
                  Hi ${safeName},
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

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Email failed');
    }

    console.log('Email sent:', info.response);

    return res.send('Email sent successfully');
  });
});

function handleRequestErrors(error, req, res, next) {
  if (error.type === 'entity.too.large') {
    return res.status(413).send('Request body is too large.');
  }

  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).send('Invalid JSON request body.');
  }

  return next(error);
}

app.use(handleRequestErrors);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

module.exports = {
  app,
  escapeHtml,
  handleRequestErrors,
  rateLimitMailRequests,
  validateSubscriber,
};
