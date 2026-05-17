// npm external Module
const express = require('express')
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");



// local module
const database = require('./config/MongoDB_setup')
const Login_route = require('./routes/Login_route')
const SignUp_route = require('./routes/SignUP_route')

const API_shortner =  require('./routes/response')
const Redirect_route = require('./routes/redirect_window')
const Logged_user = require('./routes/Auth/User_route')

const app =  express()
app.use(express.json());
app.use(cors({ origin : process.env.CLIENT_URL , credentials : true }));
app.use(cookieParser());


// For uptime monitor
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});


app.use('/login', Login_route)
app.use('/signup', SignUp_route)
app.use('/api/shortern/', API_shortner)
app.use('/', Redirect_route)
app.use('/api/', Logged_user)





database();
app.listen(process.env.PORT || 5000)