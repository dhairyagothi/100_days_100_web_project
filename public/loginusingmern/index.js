const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const path = require('path');
const ejs = require('ejs');
const collection = require('./mongo.js');

app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");
app.get('/', (req, res) => { res.render('login'); });
app.get('/signup', (req, res) => { res.render('signup'); });
app.get('/home', (req, res) => { res.render('home'); });
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.post('/signup', async (req, res) => {
  const data = {
    email: req.body.email,
    password: req.body.password
  }
  const checking = await collection.findOne({
    email: req.body.email
  })

  try {
    
      await collection.insertMany([data]);
    res.status(201).render("login");
  }


  catch (err) {  res.send("wrong inputs") }

  

})
app.post('/login', async (req, res) => {
  try {
    const checking = await collection.findOne({
      password: req.body.password
    })
    if (checking.password == req.body.password ) {
      res.status(201).render("home")
    }
    else {
      res.send("incorrect password")
    }
  }
  catch (err) {
    res.send("wrong details")
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
