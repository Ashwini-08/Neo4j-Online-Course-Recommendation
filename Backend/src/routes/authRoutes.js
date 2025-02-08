const express = require('express');
const { signup, login, forgotPassword, resetPassword } = require('../controllers/authController');
const router = express.Router();

// Route for signing up a new user
router.post('/signup', signup);

// Route for logging in an existing user
router.post('/login', login)

// Route for requesting a password reset
router.post('/forgotPassword', forgotPassword);

// Route for resetting the password (uses resetToken in the body, not as a URL parameter)
router.post('/resetPassword', resetPassword); // Ensure this route is correct

module.exports = router;
