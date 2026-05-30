const jwt = require('jsonwebtoken')
const FormData = require('../models/FormData');
const { AppError } = require('./errorHandler');



exports.verifyToken = async (req, res, next) => {

  try{  

    const Token = req.cookies.token;
    
    if (!Token) {
        throw new AppError("User not logged in", 401)
    }

    const decoded = jwt.verify(Token, process.env.JWT_SECRET_KEY);
    const user = await FormData.findById(decoded.id).select("fullName email _id");


    if (!user) {
        throw new AppError("User not found", 401);
    }

    req.user = user;

    next();

    } catch (err) {
    next(err);
    
}

}
