const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    party: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    votes: [
        {
            user : {
                type: mongoose.Schema.Types.ObjectId, //objectid given when a data is created
                ref: 'User', //refrence from where we will find it
                required: true
            },
            votedAt: {
                type: Date,
                default: Date.now()
            }
        }
    ],
    voteCount: {
        type: Number,
        default: 0
    }
    
});

const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;