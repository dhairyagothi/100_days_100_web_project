const express = require('express')
const SignUP_route = express.Router()
const rateLimiter = require('../middlewares/rateLimiter')
const Controller = require('../controllers/SignUP_controller')
const validator = require('../middlewares/signUP_validator')


SignUP_route.post('/', rateLimiter.signupLimiter, validator.signup_validation , Controller.SignUP_post)

module.exports = SignUP_route;