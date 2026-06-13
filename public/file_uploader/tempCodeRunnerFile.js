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

// ✅ Updated Multer config with file size and type validation filters
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // 🔒 Hard stop at 2MB per file (Issue #1114)
    },
    fileFilter: function (req, file, cb) {
        // 🔒 Only accept standard images (.jpg, .jpeg, .png, .webp)
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Unsupported file format! Only .jpg, .jpeg, .png, and .webp are allowed.'), false);
        }
        cb(null, true);
    }
}).array("myFile"); // Attach .array() here so we can call it in the route

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'file_uploader.html'));
});

app.get('/file', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'file_uploader.html'));
});

// ✅ Refactored route to handle Multer errors gracefully
app.post("/upload", (req, res) => {
    upload(req, res, function (err) {
        // 1. Catch specific Multer size/limit errors
        if (err instanceof multer.MulterError) {
            return res.render('upload', {
                uploadStatus: `Error: File too large. Max size is 2MB.`,
                firstName: req.body.firstName || '',
                lastName: req.body.lastName || '',
                files: []
            });
        } 
        // 2. Catch custom fileFilter errors
        else if (err) {
            return res.render('upload', {
                uploadStatus: `Error: ${err.message}`,
                firstName: req.body.firstName || '',
                lastName: req.body.lastName || '',
                files: []
            });
        }

        // 3. If no errors, proceed with success logic
        console.log("Body: ", req.body);
        console.log("Files: ", req.files);

        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const files = req.files;

        // Fallback check if submission happened without files
        if (!files || files.length === 0) {
            return res.render('upload', {
                uploadStatus: 'No file was uploaded.',
                firstName,
                lastName,
                files: []
            });
        }

        // Success state
        const uploadStatus = 'Files successfully uploaded!';
        res.render('upload', { uploadStatus, firstName, lastName, files });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
});