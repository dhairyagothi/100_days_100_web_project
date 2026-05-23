require('dotenv').config();

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require("path");
const nodemailer = require("nodemailer");

const port = 5500;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'mail.html'));
});

app.post('/', function(req, res) {

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
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
    subject: "Feedback form response",

    text:
      "Thank you " +
      req.body.name +
      " for subscribing.",
  };

  transporter.sendMail(mailOptions, (error, info) => {

    if (error) {
      console.error(error);
      return res.send("Email failed");
    }

    console.log("Email sent:", info.response);

    return res.send("Email sent successfully");

  });

});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

