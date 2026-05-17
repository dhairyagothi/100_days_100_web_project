const express = require('express')
const Response = express.Router()
const Controller =  require('../controllers/Response_API')
const Authication =  require('../middlewares/JWT_auth')

Response.post('/', Authication.verifyToken ,  Controller.Response_POST_API)

module.exports = Response;