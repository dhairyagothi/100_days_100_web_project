const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const User = require('../models/user');
const Candidate = require('./../models/candidate');
const {jwtAuthMiddleware, generateToken} = require('./../jwt');

// Rate limit all candidate routes to mitigate abuse (vote spam, scraping)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
router.use(apiLimiter);

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
            return res.status(403).json({
             message: 'User does not have admin role'
        });
        
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



router.get('/dashboard', jwtAuthMiddleware, async (req, res) => {
    try {
        // Admin check
        if (!await checkAdminRole(req.user.id)) {
            return res.status(403).json({
                message: 'User does not have admin role'
            });
        }

        // Total voters (excluding admins)
        const totalVoters = await User.countDocuments({
            role: 'voter'
        });

        // Votes cast
        const votesCast = await User.countDocuments({
            role: 'voter',
            isVoted: true
        });

        // Total candidates
        const totalCandidates = await Candidate.countDocuments();

        // Rankings
        const candidates = await Candidate.find()
            .sort({ voteCount: -1 });

        const rankings = candidates.map((candidate, index) => ({
            rank: index + 1,
            name: candidate.name,
            party: candidate.party,
            votes: candidate.voteCount
        }));

        // Leading candidate
        const leadingCandidate =
            candidates.length > 0
                ? candidates[0].name
                : null;

        // Turnout %
        const turnoutPercentage =
            totalVoters > 0
                ? Number(
                    ((votesCast / totalVoters) * 100)
                        .toFixed(2)
                  )
                : 0;

        res.status(200).json({
            totalVoters,
            votesCast,
            turnoutPercentage,
            leadingCandidate,
            totalCandidates,
            rankings
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
});

//update the profile
router.put('/:candidateID', jwtAuthMiddleware, async(req,res)=> {
    try {
        if(!await checkAdminRole(req.user.id))
            return res.status(403).json({message: 'user does not  has not admin role'});
        const candidateID = req.params.candidateID //extract id from the url parameter
        // Only candidate metadata is editable here; voteCount and votes are managed by the voting flow
        const { name, party, age } = req.body;
        const updatedCandidateData = {};
        if (name !== undefined) updatedCandidateData.name = name;
        if (party !== undefined) updatedCandidateData.party = party;
        if (age !== undefined) updatedCandidateData.age = age;

        const response = await Candidate.findByIdAndUpdate(candidateID, updatedCandidateData, {
            new: true, //return the updated document
            runValidators: true //run mongoose validation
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

        // Atomically claim this user's single vote; only one concurrent request can flip isVoted false to true
        const user = await User.findOneAndUpdate(
            { _id: userId, isVoted: false, role: { $ne: 'admin' } },
            { $set: { isVoted: true } }
        );

        if(!user) {
            const existing = await User.findById(userId);
            if(!existing) {
                return res.status(404).json({message: 'user not found'});
            }
            if(existing.role === 'admin') {
                return res.status(403).json({message: 'admin is not allowed'});
            }
            return res.status(400).json({message: 'You have already voted'});
        }

        //record the vote on the candidate atomically; roll back the claim if it fails
        try {
            const voteResult = await Candidate.updateOne(
                { _id: candidateID },
                { $inc: { voteCount: 1 }, $push: { votes: { user: userId } } }
            );
            if(voteResult.matchedCount === 0) {
                await User.updateOne({ _id: userId }, { $set: { isVoted: false } });
                return res.status(404).json({message: 'Candidate not found'});
            }
        } catch(err) {
            await User.updateOne({ _id: userId }, { $set: { isVoted: false } });
            throw err;
        }

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