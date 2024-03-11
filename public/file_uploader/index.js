const express = require('express')
const app = express()
const port = 3000
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const ejs = require('ejs');
app.set('view engine', 'ejs');

var storage = multer.diskStorage({  
    destination: function (req, file, cb) { 
         cb(null, 'uploads') 
    }, 
  filename: function (req, file, cb) { 
     cb(null , file.originalname);   
  },
  
});
const upload = multer({ storage: storage });
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/file', (req, res) => {
    res.sendFile('file_uploader.html', { root: __dirname + '/public' }); 
  });

app.post("/upload", upload.single("myFile"), (req, res) => {
    console.log("Body: ", req.body);
    console.log("File: ", req.file);
    const uploadStatus = 'File successfully uploaded.'; 
  res.send({uploadStatus});
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


