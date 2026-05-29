const express = require('express');
const router = express.Router();

const User = require('./../models/user');
const {jwtAuthMiddleware, generateToken} = require('./../jwt');

//POST route to add a person
router.post('/signup', async(req, res)=>{
    try{
        const data = req.body //Assuming the request body conatins the User data
        .then(User =>res.join(User))
        .catch(err => console.log(err))
        // Check if there is already an admin user
        const adminUser = await User.findOne({ role: 'admin' });
        if (data.role === 'admin' && adminUser) {
            return res.status(400).json({ error: 'Admin user already exists' });
        }

        // Validate Aadhar Card Number must have exactly 12 digit
        if (!/^\d{12}$/.test(data.aadharCardNumber)) {
            return res.status(400).json({ error: 'Aadhar Card Number must be exactly 12 digits' });
        }

        // Check if a user with the same Aadhar Card Number already exists
        const existingUser = await User.findOne({ aadharCardNumber: data.aadharCardNumber });
        if (existingUser) {
            return res.status(400).json({ error: 'User with the same Aadhar Card Number already exists' });
        }

        //Create a new User documnet using the Mongoose model
        const newUser = new User(data);

        //Save the new user to the database
        const response = await newUser.save();
        console.log('data saved');

        const payload = {
            id: response.id
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log("Token is : ",token);

        User.create(req.body)
        .then(user => res.join(user))
        .catch(err => console.log(err))

    }catch(err) {
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

//login Route
router.post('/login', async(req, res)=> {
    try {
        //extract username and password from the request body
        const{aadharCardNumber, password} = req.body;

        //find the user by username 
        const user = await User.findOne({aadharCardNumber: aadharCardNumber})

        //if user does not exist or password does not match
        if(!user || !(await user.comparePassword(password))) {
            return res.status(401).json({error: 'Invalid password or username'});
        }

        //generate token
        const payload = {
            id: response.id
        }
        const token = generateToken(payload);

        //return token as a response
        res.json({token});
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
      const user = await Person.findById(userId);
      res.status(200).json({user});
    }catch(err) {
        console.log(err);
       res.status(500).json({error: 'Internal Server Error'}); 
    }
})

router.put('/profile/password', async (req, res)=>{
    try{
        const userId = req.user.id; //extract the id from the token
        const {currentPassword, newPassword} = req.body // extract the current and new password from the body
        
        //find the user by userID
        const user = await User.findById(userId);
          
        //if password does not match
        if(!(await user.comparePassword(currentPassword))) {
            return res.status(401).json({error: 'Invalid password or username'});
        }

        //update user password
        user.password = newPassword;
        await  user.save();

        console.log('data updated');
        res.status(200).json(response);
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal server error'});
    }
})

module.exports = router;