# Password Manager

## Description
A user-friendly password management demonstration application for the web. It allows users to store, manage, and quickly access simulated login credentials for various websites, helping demonstrate the layout and flow of credentials persistence. 

> [!WARNING]
> This is a **frontend demonstration only** and is not intended for storing real, sensitive credentials.

## Technologies Used
- HTML5
- CSS3 (Flexbox & Responsive Design)
- JavaScript (DOM Manipulation & Local Storage)

## Features
- **Local Persistence**: Saves password entries locally in the browser using `localStorage` for cross-session persistence.
- **Easy Retrieval**: Search and find credentials for specific sites quickly.
- **Add/Delete**: Simple CRUD functionality for managing your password entries.
- **Copy to Clipboard**: Quick-copy icons to instantly copy usernames or passwords.
- **Clean Interface**: Focused on ease of use and layout simplicity.

## ⚠️ Security Notice
This project is a frontend demonstration only and stores all data in **plaintext** inside the browser's Local Storage. Local Storage is accessible to any script running on the origin and is not encrypted. Do not use this application to store real-world passwords or sensitive credentials.

## Setup Instructions
1. Clone the repository.
2. Navigate to the project folder: `public/password manager/`
3. Open `index.html` in your web browser.

## Folder Structure
```text
password manager/
 ├── index.html       # App structure
 ├── script.js        # Storage and management logic
 ├── style.css        # Layout and visual design
 └── copy.svg         # Icon for copy functionality
```

## Author
[Mithil](https://github.com/mithilP007)
