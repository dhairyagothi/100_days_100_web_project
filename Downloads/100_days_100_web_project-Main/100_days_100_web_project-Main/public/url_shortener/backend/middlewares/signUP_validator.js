const {check } = require("express-validator");

exports.signup_validation = [
    check('fullName')
    .trim()
    .isLength({min : 2})
    .withMessage("Enter minimum length of 2")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("only alphabets and Space only"),

    check('email')
    .trim()
    .isEmail()
    .withMessage('Enter a valid Email')
    .notEmpty()
    .withMessage('Enter a Email'),

    check('password')
    .trim()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/)
     .withMessage('Must include Capital , Special , Lowercase and Numbers ')
    .isLength({min : 8})
     .withMessage('Enter minimum length of 8')
,

    check('Confirmpassword')
    .custom((value , {req})=>{
        if (value != req.body.password) {
            throw new Error("Passwords do not match")
        }
        else{
            return true;
        }
    })

]