# E-Commerce Web Application

## Project Overview
This project is a comprehensive **E-Commerce Web Application** designed to provide users with a seamless shopping experience. It features user authentication, product management, a shopping cart system, secure password reset capabilities, and Paytm payment integration.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features
- **User Authentication**: Secure user sign-up and login processes, including email verification and account activation.
- **Product Management**: A comprehensive product catalog with categories, subcategories, and detailed product information.
- **Shopping Cart**: Users can add, remove, and update products in their cart, with real-time updates and local storage functionality.
- **Password Reset**: A secure password reset system that sends reset links via email, ensuring user data protection.
- **Payment Integration**: Seamlessly integrated Paytm payment gateway with checksum generation and verification for secure transactions.
- **Responsive Design**: Fully responsive and optimized for various devices, providing a smooth user experience on desktops, tablets, and smartphones.

## Technologies Used
- **Backend**: Django
- **Frontend**: HTML, CSS, Bootstrap, JavaScript
- **Email Service**: SMTP
- **Payment Gateway**: Paytm

## Installation
1. **Clone the repository**:
    ```bash
    git clone git@github.com:Anuraj-IND/E-Commerce-Application.git
    ```

2. **Backend Setup**:
    - **Install dependencies**:
      ```bash
      pip install django
      ```

3. **Run the server**:
    ```bash
    cd ecommerce
    python manage.py runserver
    ```

## Configuration
### Paytm Integration
Create a `paytmConfig.js` file to store your Paytm credentials:
```javascript
module.exports = {
    mid: 'YOUR_MID_HERE',
    key: 'YOUR_MERCHANT_KEY_HERE',
    website: 'YOUR_WEBSITE_NAME',
    callbackUrl: 'YOUR_CALLBACK_URL'
};
