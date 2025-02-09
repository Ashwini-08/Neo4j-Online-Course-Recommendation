const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const { getUserProfile } = require('../controllers/userController');
const { updateUserProfile } = require("../controllers/userController");
// const { upload } = require('../middlewares/uploadMiddleware');
// const { getProfilePicture } = require('../controllers/userController');

// Protect the profile route with the `protect` middleware
router.get('/profile', protect, getUserProfile);
router.post("/profile", protect, updateUserProfile);
// router.post('/upload-profile-picture', upload.single('image'), uploadProfilePicture);
// router.get('/profile-picture', protect, getProfilePicture);

module.exports = router;
