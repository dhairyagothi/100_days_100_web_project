const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Candidate = require('./../models/candidate');
const {jwtAuthMiddleware, generateToken} = require('./../jwt');

const checkAdminRole = async(userID) => {
    try{
        const user = await User.findById(userID);
        return user.role === 'admin';
    }catch(err) {
        return false;
    }
}

//POST route to add a candidate
router.post('/',jwtAuthMiddleware,async(req,res)=> {
    try{
        if(!await checkAdminRole(req.user.id)) 
            return res.status(403).json({message: 'User does not have admin role' })
        
        const data = req.body //assuming the request body conatins the candidate data

        //create a new user documentaion using moongose model
        const newCandidate = new Candidate(data);

        //save the new user to the database
        const response = await newCandidate.save();
        console.log('data saved');
        res.status(200).json({response: response});
    }catch(err) {
        console.log(err);
        res.status(500).json({error: 'Internal Server error'});
    }
})


//update the profile
router.put('/:candidateID', jwtAuthMiddleware, async(req,res)=> {
    try {
        if(!await checkAdminRole(req.user.id))
            return res.status(404).json({message: 'user has not admin role'});
        const candidateID = req.params.candidateID //extract id from the url parameter
        const updatedCandidateData = req.body; //updated data from the candidate

        const response = await Candidate.findByIdAndUpdate(candidateID, updatedCandidateData, {
            new: true, //return the updated document
            runValidation: true //run mongoose validation
        }) 

        if(!response) {
            return res.status(404).json({error: 'Candidate not found'});
        }

        console.log('candidate data updated');
        res.status(200).json(response);
    }catch(err) {
        console.log(err);
        res.status(500).json({error: 'Internal Server error'});
    }
    
})

//delete the profile
router.delete('/:candidateID',jwtAuthMiddleware, async(req,res)=> {
    try {
        if(!await checkAdminRole(req.user.id))
            return res.status(403).json({message: 'user does not have admin role'});
        const candidateID = req.params.candidateID //extract id from the url parameter
        
        const response = await Candidate.findByIdAndDelete(candidateID);

        if(!response) {
            return res.status(404).json({error: 'Candidate not found'});
        }

        console.log('candidate deleted');
        res.status(200).json(response);
    }catch(err) {
        console.log(err);
        res.status(500).json({error: 'Internal Server error'});
    }
    
})

//lets start voting
router.post('/vote/:candidateID', jwtAuthMiddleware, async(req, res) => {
    //no admin can vote
    //user can only vote once

    const candidateID = req.params.candidateID;
    const userId = req.user.id;

    try {
        //find the candidate document with the specified candidateID
        const candidate = await Candidate.findById(candidateID);
        if(!candidate) {
            return res.status(404).json({message: 'Candidate not found'});
        }

        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({message: 'user not found'});
        }

        if(user.isVoted) {
            return res.status(400).json({message: 'You have already voted'})
        }

        if(user.role == 'admin') {
            return res.status(403).json({message: 'admin is not allowed'})
        }

        //update the Candidate document to record the vote
        candidate.votes.push({user: userId});
        candidate.voteCount++;
        await candidate.save();

        //update the user document
        user.isVoted = true
        await user.save();

        res.status(200).json({message: 'Vote recorded successfully'})
    }catch(err) {
        console.log(err);
        res.status(500).json({error: 'Internal Server error'});
    }
});

//vote count
router.get('/vote/count', async(req, res)=> {
    try{
        //find all the candidates and sprt them by vote count in descemding order
        const candidate = await Candidate.find().sort({voteCount: 'desc'});

        //map the candidate to only return their name and voteCount
        const voteRecord = candidate.map((data)=>{
            return{
                party: data.party,
                count: data.voteCount
            }
        });

        return res.status(200).json(voteRecord);
    }catch(err) {
        console.log(err);
        res.status(500).json({error: 'Internal Server error'});
    }
});

//to get list of candidates
router.get('/', async(req, res)=> {
    try {
        //list of candidates
        const listOfCandidate = await Candidate.find({},{name: 1, party: 1,_id: 1});
        return res.status(200).json(listOfCandidate);
    }catch(err) {
        console.log(err);
        res.status(500).json({error: 'Internal Server error'});
    }
})

module.exports = router;