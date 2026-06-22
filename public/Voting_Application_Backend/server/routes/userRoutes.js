const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const User = require('./../models/user');
const {jwtAuthMiddleware, generateToken} = require('./../jwt');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

//POST route to add a person
router.post('/signup', authLimiter, async(req, res)=>{
    try{
        const { name, age, email, mobile, address, aadharCardNumber, password, setupKey } = req.body;

        // Validate Aadhar Card Number must have exactly 12 digit
        if (!/^\d{12}$/.test(aadharCardNumber)) {
            return res.status(400).json({ error: 'Aadhar Card Number must be exactly 12 digits' });
        }

        // Check if a user with the same Aadhar Card Number already exists
        const existingUser = await User.findOne({ aadharCardNumber: aadharCardNumber });
        if (existingUser) {
            return res.status(400).json({ error: 'User with the same Aadhar Card Number already exists' });
        }

        // Whitelist fields so role cannot be set from the request body
        const userData = { name, age, email, mobile, address, aadharCardNumber, password };

        // Allow the first admin only via the server-side ADMIN_SETUP_KEY; otherwise role defaults to voter
        const adminExists = await User.findOne({ role: 'admin' });
        if (!adminExists && process.env.ADMIN_SETUP_KEY && setupKey === process.env.ADMIN_SETUP_KEY) {
            userData.role = 'admin';
        }

        //Create a new User documnet using the Mongoose model
        const newUser = new User(userData);

        //Save the new user to the database
        const response = await newUser.save();
        console.log('data saved');

        const payload = {
            id: response.id
        }

        const token = generateToken(payload);
        return res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: response._id,
                name: response.name,
                role: response.role,
                aadharCardNumber: response.aadharCardNumber
            }
        });
    }catch(err) {
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

//login Route
router.post('/login', authLimiter, async(req, res)=> {
    try {
        //extract username and password from the request body
        const{aadharCardNumber, password} = req.body;

        //find the user by username 
        const user = await User.findOne({aadharCardNumber: aadharCardNumber})

        //if user does not exist or password does not match
        if(!user || !(await user.comparePassword(password))) {
            return res.status(401).json({error: 'Invalid password or username'});
        }

        const payload = {
            id: user.id
        };

        const token = generateToken(payload);

        //return token as a response
        return res.status(200).json({
            message: "User logged in successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
                aadharCardNumber: user.aadharCardNumber
            }
        });
    }catch(err) {
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})
//person profile 
router.get('/profile', jwtAuthMiddleware, async(req,res)=>{
    try{
      const userData = req.user;
      const userId = userData.id;
      const user = await User.findById(userId).select('-password'); //exclude password field

      if(!user) {
        return res.status(404).json({error: 'User not found'});
      }
      
      res.status(200).json({user});
    }catch(err) {
        console.log(err);
       res.status(500).json({error: 'Internal Server Error'}); 
    }
})

router.put('/profile/password',jwtAuthMiddleware, async (req, res)=>{
    try{
        const userId = req.user.id; //extract the id from the token
        const {currentPassword, newPassword} = req.body // extract the current and new password from the body
        
        //find the user by userID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }
          
        //if password does not match
        if(!(await user.comparePassword(currentPassword))) {
            return res.status(401).json({error: 'Invalid password or username'});
        }

        //update user password
        user.password = newPassword;
        await  user.save();

        console.log('data updated');
        res.status(200).json({
            message: 'Password updated successfully'
        });
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal server error'});
    }
})

module.exports = router;