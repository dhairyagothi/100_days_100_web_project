const SavingData = require('../models/FormData')
const bcrypt = require('bcrypt')
const { validationResult } = require("express-validator");
const { AppError } = require('../middlewares/errorHandler');

exports.SignUP_post = async (req, res) => {


 const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new AppError(errors.array()[0].msg, 400);
  }



  let { fullName, email, password } = req.body;
  const IP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  if (!fullName || !email || !password) { throw new AppError("All fields required", 400) }

     email = email.trim().toLowerCase();
     fullName =  fullName.trim();

  const existingEmail = await SavingData.findOne({ email: email })
  if (existingEmail) { throw new AppError("user with this email already exist", 409) }
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
