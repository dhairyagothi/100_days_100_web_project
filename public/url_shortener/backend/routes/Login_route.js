const express = require('express')
const Login_route = express.Router()

const Controller = require('../controllers/Login_controller')
const rateLimiter = require('../middlewares/rateLimiter')
const { catchAsync } = require('../middlewares/errorHandler')


Login_route.post('/', rateLimiter.loginLimiter , catchAsync(Controller.Login_post))

module.exports = Login_route;
