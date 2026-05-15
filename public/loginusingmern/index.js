const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const path = require('path');
const ejs = require('ejs');
const collection = require('./mongo.js');
const bcrypt = require('bcrypt');
const validator = require('validator')
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");
app.get('/', (req, res) => { res.render('login'); });
app.get('/signup', (req, res) => { res.render('signup'); });
app.get('/home', (req, res) => { res.render('home'); });
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post('/signup', async (req, res) => {
  try {
    const data = req.body;

    const checking = await collection.findOne({ email: data.email });

    if (checking) {
      return res.status(400).send("Email Already Exists!");
    }
    if(!validator.isStrongPassword(data.password)){
      return res.status(400).send('Please use a strong password');
    }
    const newpw = await bcrypt.hash(data.password,10);
    
    await collection.create({username:data.username,email:data.email,password:newpw});

    return res.status(201).send("Signup Successful");
  } catch (err) {
    return res.status(500).send("Server Error");
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send("Username and password are required");
    }
    const user = await collection.findOne({ username });
    if (!user) {
      return res.status(400).send("User does not exist");
    }
    const compare = await bcrypt.compare(password,user.password);
    if (!compare) {
      return res.status(400).send("Incorrect password");
    }
    return res.status(200).send("Login successful");

  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
