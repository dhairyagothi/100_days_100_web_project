# File Uploader App

## Description
A server-side web application built with Node.js and Express that allows users to upload files to a local server. This project demonstrates handling multipart form data and managing file storage on the backend.

## Technologies Used
- Node.js
- Express.js
- Multer (for file uploads)
- EJS (Embedded JavaScript)

## Features
- **File Selection**: Choose any file from your local machine to upload.
- **Backend Processing**: Handles file uploads securely using Multer middleware.
- **Success Feedback**: Notifies the user once the file has been successfully uploaded to the server.
- **Static Asset Management**: Serves uploaded files and static content efficiently.

## Setup Instructions
1. Navigate to the project folder: `public/file_uploader/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node index.js
   ```
4. Open `http://localhost:3000` (or specified port) in your browser.

## Folder Structure
```text
file_uploader/
 ├── public/          # Static assets and uploaded files
 ├── view/            # EJS templates for the upload form
 ├── index.js         # Main Express server and upload routes
 └── package.json     # Project dependencies
```

## Author
[Mithil](https://github.com/mithilP007)
