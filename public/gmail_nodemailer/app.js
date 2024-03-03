const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const path = require("path");
const port = 5500
const nodemailer = require("nodemailer");


app.use(bodyParser.urlencoded({ extended: true })); 

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
    alert("Email not sent: ", info.response);
    console.error("Error sending email: ", error);
  } else {
    alert("Email sent: ", info.response);
    console.log("Email sent: ", info.response);
  }
});
req.body.button.addEventListener("click", function () { 
  alert("Email sent: ", info.response);
  console.log("Email sent: ", info.response);
}
);

});




