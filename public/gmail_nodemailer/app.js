const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const path = require("path");
const port = 5500
const nodemailer = require("nodemailer");


app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.json());
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname , 'public/mail.html'));
})

app.post('/', function(req, res) {
    
const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "dhairyag31@gmail.com",
    pass: "pwrxkjklvbddvsqa",
  },
});
const mailOptions = {
  from: "dhairyag31@gmail.com",
  to: req.body.emailid ,
  subject: "Feedback form response",
  text: "Thankyou"+req.body.name+" for your feedback. We will get back to you soon.  Chechout Git hub repo :- https://github.com/dhairyagothi/50_days_50_web_project    Regards  Dhairya  +919424065768   dhairyag31@gmail.com",
};
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("Error sending email:", error);
    return res.status(500).send("Email failed");
  } else {
    console.log("Email sent:", info.response);
    return res.status(200).send("Email sent successfully");
  }
});

});




