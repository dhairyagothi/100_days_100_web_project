const jwt = require('jsonwebtoken')
const FormData = require('../models/FormData');



exports.verifyToken = async (req, res, next) => {

  try{  

    const Token = req.cookies.token;
    
    if (!Token) {
        return res.status(401).json({ msg: "User not logged in" })
    }

    const decoded = jwt.verify(Token, process.env.JWT_SECRET_KEY);
    const user = await FormData.findById(decoded.id).select("fullName email _id");


    if (!user) {
        return res.status(401).json({ msg: "User not found" });
    }

    req.user = user;

    next();

    } catch (err) {
    return res.status(401).json({ msg: "Invalid or expired token" });
    
}

} 