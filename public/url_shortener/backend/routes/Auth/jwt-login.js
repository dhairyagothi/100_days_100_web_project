const express = require('express');
const { verifyToken } = require('../../middlewares/JWT_auth');
const Login_JWT = express.Router()
const controller = require('../../controllers/Auth/dashboard')


Login_JWT.get('/user/:id', verifyToken, controller.dashboard )

module.exports = Login_JWT;