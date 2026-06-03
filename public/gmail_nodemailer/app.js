require('dotenv').config();

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');

const port = 5500;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'mail.html'));
});

app.post('/', function (req, res) {
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
    to: req.body.emailid,
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
                  Hi ${req.body.name},
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
