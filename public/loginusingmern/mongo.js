const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/login')
.then(() => {
    console.log('Connected to the Database successfully');
})
.catch((err) => {
    console.error('Error connecting to the Database');
})
const loginSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
    
})

const collection = new mongoose.model('login', loginSchema);

module.exports=collection;