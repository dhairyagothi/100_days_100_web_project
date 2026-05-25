File Uploader 📁

A simple and efficient file upload backend built with Node.js and Express.js. This project demonstrates how to handle file uploads using Express middleware with a clean and scalable backend structure.


📌 Features

Upload single or multiple files
Express.js backend server
File handling with Multer
Static file serving
Organized uploads directory
REST API support
Error handling and validation
Easy integration with frontend applications


🛠️ Tech Stack

| Technology | Usage |
|------------|-------|
| Node.js    | Runtime Environment |
| Express.js | Backend Framework |
| Multer     | File Upload Middleware |
| dotenv     | Environment Variables |
| CORS       | Cross-Origin Requests |


📂 Project Structure
```text
file-uploader/
├── node_modules/
│
├── uploads/
│   └── sample-file.png
│
├── routes/
│   └── uploadRoutes.js
│
├── controllers/
│   └── uploadController.js
│
├── middleware/
│   └── uploadMiddleware.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```


⚙️ Installation & Setup

1️⃣ Clone the Repository
git clone https://github.com/your-username/file-uploader.git
cd file-uploader
📦 Install Dependencies
npm install
📦 Required Packages
npm install express multer dotenv cors
Development Dependency
npm install nodemon --save-dev
🔐 Environment Variables

Create a .env file in the root directory:

PORT=5000

🚀 Start the Server
Development Mode
npm run dev
Production Mode
npm start

Server runs on:

http://localhost:5000

📜 Package.json Scripts
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}


🧠 Main Server Setup
server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

const uploadRoutes = require("./routes/uploadRoutes");

app.use("/api/upload", uploadRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


⚙️ Upload Middleware

middleware/uploadMiddleware.js
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

module.exports = upload;


📁 Upload Controller

controllers/uploadController.js
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      file: req.file,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "File upload failed",
      error: error.message,
    });
  }
};

module.exports = { uploadFile };


🛣️ Upload Routes

routes/uploadRoutes.js
const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { uploadFile } = require("../controllers/uploadController");

router.post("/", upload.single("file"), uploadFile);

module.exports = router;


📡 API Endpoint

Upload File
POST /api/upload

📨 Form Data
Key	Type
file	File

✅ Success Response
{
  "success": true,
  "message": "File uploaded successfully"
}
❌ Error Response
{
  "success": false,
  "message": "No file uploaded"
}

🌍 Access Uploaded Files

Uploaded files can be accessed using:

http://localhost:5000/uploads/filename.png


🚀 Future Improvements

Multiple file upload support
File type validation
File size limits
Cloud storage integration
Drag and drop frontend
Authentication support
Progress tracking
Image preview support


🌐 Deployment

You can deploy this backend using:

Render
Railway
Cyclic

🤝 Contributing

Contributions are welcome.

Fork the repository
Create a feature branch
git checkout -b feature/new-feature
Commit your changes
git commit -m "Add new feature"
Push to GitHub
git push origin feature/new-feature
Open a Pull Request


⭐ Support

If you found this project useful:

Star the repository
Fork the project
Contribute to improve the project
