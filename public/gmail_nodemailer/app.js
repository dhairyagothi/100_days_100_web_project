const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

require('dotenv').config({ quiet: true });

const app = express();
const port = process.env.PORT || 5500;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const requiredMailConfig = ['SMTP_USER', 'SMTP_PASS', 'MAIL_TO'];

function getMissingMailConfig() {
  return requiredMailConfig.filter((key) => !process.env[key]);
}

function createTransporter() {
  const missingConfig = getMissingMailConfig();

  if (missingConfig.length) {
    throw new Error(`Missing email configuration: ${missingConfig.join(', ')}`);
  }

  return nodemailer.createTransport({
    service: process.env.SMTP_SERVICE || 'Gmail',
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE !== 'false',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/mail.html'));
});

app.post('/', async function(req, res) {
  const { name, emailid } = req.body;

  if (!name || !emailid) {
    return res.status(400).send('Name and email are required');
  }

  if (!isValidEmail(emailid)) {
    return res.status(400).send('Enter a valid email address');
  }

  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: process.env.MAIL_TO,
      replyTo: emailid,
      subject: 'Feedback form response',
      text: `New contact form submission from ${name} <${emailid}>.`,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error.message);
    return res.status(500).send('Email service is not configured or failed');
  }
});

app.listen(port, () => {
  console.log(`Nodemailer app listening on port ${port}`);
});
