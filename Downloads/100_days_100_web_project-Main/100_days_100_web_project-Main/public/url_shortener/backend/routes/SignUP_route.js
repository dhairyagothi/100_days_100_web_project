const express = require('express')
const SignUP_route = express.Router()
const rateLimiter = require('../middlewares/rateLimiter')
const Controller = require('../controllers/SignUP_controller')
const validator = require('../middlewares/signUP_validator')
const { catchAsync } = require('../middlewares/errorHandler')


SignUP_route.post('/', rateLimiter.signupLimiter, validator.signup_validation , catchAsync(Controller.SignUP_post))

module.exports = SignUP_route;
