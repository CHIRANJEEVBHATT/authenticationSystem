React Authentication System with Email OTP Verification
This project is a full-stack authentication system built with React, Vite, Tailwind CSS (frontend) and Node.js, Express, MongoDB (backend).
It features secure login, registration, email OTP verification, and password reset via OTP.

Features
User registration and login
Email verification via OTP
Password reset via OTP
Responsive, modern UI with Tailwind CSS
Protected routes and authentication context
Toast notifications for feedback
Secure cookie-based authentication
Tech Stack
Frontend

React (with Vite)
Tailwind CSS
Axios
React Router
React Toastify
Backend

Node.js
Express
MongoDB (Mongoose)
Nodemailer (for sending OTP emails)
JWT (for authentication)
Getting Started
1. Clone the repository
git clone <your-repo-url>
cd Auth
2. Install dependencies
Backend
cd server
npm install
Frontend
cd ../client/auth
npm install
3. Environment Variables
Backend (server/.env)
PORT=4000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
SENDER_EMAIL=your_email@gmail.com
Frontend (client/auth/.env)
VITE_BACKENDURL=http://localhost:4000
4. Run the project
Backend
cd server
npm run server
Frontend
cd ../client/auth
npm run dev
Usage
Register: Create a new account. You’ll receive an OTP for email verification.
Login: Login with your credentials. If not verified, you’ll be prompted to verify your email.
Email Verification: Enter the OTP sent to your email to verify your account.
Forgot Password: Request an OTP to reset your password.
Protected Routes: Home page and user info are protected and update automatically after login.
Folder Structure
Auth/
  server/
    controllers/
    models/
    routes/
    middleware/
    config/
    .env
    server.js
    package.json
  client/
    auth/
      src/
        pages/
        components/
        context/
        utils/
        App.jsx
        main.jsx
        index.css
      .env
      package.json
      tailwind.config.js
      vite.config.js
Customization
Change theme colors in tailwind.config.js or directly in components.
Update email templates in backend nodemailer.js config.
License
MIT

Credits
Built with React, Vite, Tailwind CSS, Express, and MongoDB.
