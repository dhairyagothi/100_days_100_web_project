const express = require('express')
const Login_route = express.Router()

const Controller = require('../controllers/Login_controller')
const rateLimiter = require('../middlewares/rateLimiter')


Login_route.post('/', rateLimiter.loginLimiter , Controller.Login_post)

module.exports = Login_route;