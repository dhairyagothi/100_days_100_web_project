const express=require("express");
const cors=require("cors");
const nodemailer=require("nodemailer");

const app=express();

app.use(cors());
app.use(express.json());

app.post("/send-email",async(req,res)=>{

const {name,email}=req.body;

try{

const transporter=nodemailer.createTransport({
service:"gmail",
auth:{
user:"YOUR_GMAIL@gmail.com",
pass:"YOUR_APP_PASSWORD"
}
});

await transporter.sendMail({
from:"YOUR_GMAIL@gmail.com",
to:email,
subject:"Subscription Successful",
text:`Hello ${name}, thank you for subscribing.`
});

res.send("Email sent successfully!");

}catch(error){
console.log(error);
res.status(500).send("Failed to send email");
}
});

app.listen(5500,()=>{
console.log("Server running on port 5500");
});
