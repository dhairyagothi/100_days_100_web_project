const SavingData = require('../models/FormData')
const bcrypt = require('bcrypt')
const { validationResult } = require("express-validator");

exports.SignUP_post = async (req, res) => {


 const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      msg: errors.array()[0].msg
    });
  }



  let { fullName, email, password } = req.body;
  const IP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  if (!fullName || !email || !password) { return res.status(400).json({ msg: "All fields required" }) }

     email = email.trim().toLowerCase();
     fullName =  fullName.trim();

  const existingEmail = await SavingData.findOne({ email: email })
  if (existingEmail) { return res.status(400).json({ msg: "user with this email already exist" }) }
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new SavingData({
    fullName: fullName,
    email: email,
    password: hashedPassword,
    ipaddres: IP,
    DeviceInfo: req.headers['user-agent']
  })


  await user.save();

  res.status(200).json({ msg : " user created successfully "})

}
