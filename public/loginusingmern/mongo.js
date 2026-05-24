const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to the Database successfully'))
  .catch(() => console.error('Error connecting to the Database'));

const loginSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true },
  password: { type: String, required: true },
});

const collection = mongoose.model('login', loginSchema);

module.exports = collection;