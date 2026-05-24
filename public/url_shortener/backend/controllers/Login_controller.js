const bcrypt = require('bcrypt')
const login_logs = require('../models/Login_data')
const Login = require('../models/FormData')
const jwt = require("jsonwebtoken");
const { AppError } = require('../middlewares/errorHandler');

exports.Login_post = async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

      email = email.trim().toLowerCase();

  const Login_email = await Login.findOne({ email: email })

  if (!Login_email) { throw new AppError(" Invalid Credentials , please Enter correct email and password", 400) }

  const matched = await bcrypt.compare(password, Login_email.password)

  if (!matched) {
    const Failed_to_logedIn = new login_logs({
      LogedInBy: Login_email._id,
      IpAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      DeviceInfo: req.headers['user-agent'],
      status: "FAILED"
    })

    await Failed_to_logedIn.save()
    throw new AppError("Login failed , Invalid credentials ", 400)
  }


  else {
    const successfully_logedIn = new login_logs({
      LogedInBy: Login_email._id,
      IpAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      DeviceInfo: req.headers['user-agent'],
      status: "SUCCESS"
    })

    await successfully_logedIn.save()

    const token = jwt.sign({ id: Login_email._id }, process.env.JWT_SECRET_KEY, { expiresIn: "30d" })

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // production me true
      sameSite: "lax"
    });

    return res.status(200).json({ msg: "Login successful " })
  }


}
