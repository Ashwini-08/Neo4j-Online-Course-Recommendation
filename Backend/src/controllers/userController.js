const { saveUser, findUserByEmail } = require("../models/userModel");
// const { uploadImageToS3 } = require('../config/aws');
const { updateUserProfilePicture } = require('../config/neo4j');
// const { getImageFromS3 } = require('../config/aws'); // Adjust path based on file structure



exports.getUserProfile = async (req, res) => {
    try {
        // `req.user` is populated by the protect middleware, assuming it includes `email`
        const { email } = req.user;

        if (!email) {
            return res.status(400).json({ status: 'error', message: 'Email is required' });
        }

        // Fetch user from Neo4j by email
        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        // Send back the user's profile information
        res.status(200).json({
            status: 'success',
            data: {
                name: user.name, 
                email: user.email,
                age: user.age,
                department: user.Department,
                preferredTopic: user.Topic,
                role: user.role, // Include profile picture if stored
            },
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ status: 'error', message: 'Error fetching profile' });
    }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { email } = req.user; // Extract authenticated user email from the request

    if (!email) {
      return res.status(400).json({ status: "error", message: "Email is required" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    // Update user data with incoming changes
    console.log(req.body);
    const updatedData = req.body;
    
    

    // Save updated user data back to the database (e.g., Neo4j, MongoDB)
    const savedUser = await saveUser(email, updatedData);
    

    // Return the updated user profile to the frontend
    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: savedUser,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: "error",
      message: "Server error while updating profile",
    });
  }
};

// exports.getProfilePicture = async (req, res) => {
//   try {
//       const { email } = req.user; // Extract authenticated user email from the request

//       if (!email) {
//           return res.status(400).json({ status: 'error', message: 'Email is required' });
//       }

//       const user = await findUserByEmail(email);
//       if (!user) {
//           return res.status(404).json({ status: 'error', message: 'User not found' });
//       }

//       // Get the image URL (s3://profile-image-bucket-2401/Photo.png) from the user data
//       const imageUrl = user.profilePicture; // Assuming the URL is stored as 'profilePicture'

//       if (!imageUrl) {
//           return res.status(404).json({ status: 'error', message: 'Profile picture not found' });
//       }

//       // Extract the Key from the full URL (remove the 's3://' prefix)
//       const imageKey = imageUrl.replace('s3://profile-image-bucket-2401/', '');

//       // Get the signed URL for the image from S3
//       const imageSignedUrl = await getImageFromS3(imageKey);

//       // Return the image URL
//       res.status(200).json({
//           status: 'success',
//           message: 'Profile picture retrieved successfully',
//           profilePicture: imageSignedUrl,
//       });
//   } catch (error) {
//       console.error('Error retrieving profile picture:', error);
//       res.status(500).json({
//           status: 'error',
//           message: 'Failed to retrieve profile picture',
//       });
//   }
// };

