const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./db');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Apply CORS middleware
app.use(cors({
    origin: 'http://localhost:3006', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // Allows cookies and credentials to be sent
}));

const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Import and use routes
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
