const express = require('express')
const app = express()
const port = 3000
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const ejs = require('ejs');
const fs = require('fs'); // ✅ fs module add kiya

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ uploads folder automatically banao agar exist nahi karta
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('uploads/ folder created!');
}

// Professor ka same storage code
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir); // ✅ absolute path use karo
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'file_uploader.html'));
});

app.get('/file', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'file_uploader.html'));
});

app.post("/upload", upload.array("myFile"), (req, res) => {
    console.log("Body: ", req.body);
    console.log("Files: ", req.files);

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const files = req.files;

    if (!files || files.length === 0) {
        return res.render('upload', {
            uploadStatus: 'No file was uploaded.',
            firstName,
            lastName,
            files: []
        });
    }

    const uploadStatus = 'Files successfully uploaded!';
    res.render('upload', { uploadStatus, firstName, lastName, files });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
});