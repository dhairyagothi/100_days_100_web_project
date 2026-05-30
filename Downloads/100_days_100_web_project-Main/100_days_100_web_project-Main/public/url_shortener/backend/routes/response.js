const express = require('express')
const Response = express.Router()
const Controller =  require('../controllers/Response_API')
const Authication =  require('../middlewares/JWT_auth')
const { catchAsync } = require('../middlewares/errorHandler')

Response.post('/', Authication.verifyToken ,  catchAsync(Controller.Response_POST_API))

module.exports = Response;
