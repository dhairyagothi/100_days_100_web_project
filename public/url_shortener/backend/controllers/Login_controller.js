const bcrypt = require('bcrypt')
const login_logs = require('../models/Login_data')
const Login = require('../models/FormData')
const jwt = require("jsonwebtoken");

exports.Login_post = async (req, res) => {
  let { email, password } = req.body;

      email = email.trim().toLowerCase();

  const Login_email = await Login.findOne({ email: email })

  if (!Login_email) { return res.status(400).json({ msg: " Invalid Credentials , please Enter correct email and password" }) }

  const matched = await bcrypt.compare(password, Login_email.password)

  if (!matched) {
    const Failed_to_logedIn = new login_logs({
      LogedInBy: Login_email._id,
      IpAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      DeviceInfo: req.headers['user-agent'],
      status: "FAILED"
    })

    await Failed_to_logedIn.save()
    return res.status(400).json({ msg: "Login failed , Invalid credentials " })
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
