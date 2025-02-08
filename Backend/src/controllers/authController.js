const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { createUser, findUserByEmail, updateUser } = require('../models/userModel');
const neo4j = require('neo4j-driver'); // Ensure you have the Neo4j driver installed
const { use } = require('../routes/authRoutes');
const connectionUrl = 'neo4j+s://a2764099.databases.neo4j.io'; // Replace with actual connection URL
console.log("Connecting to:", connectionUrl);
const driver = neo4j.driver(
    'neo4j+s://a2764099.databases.neo4j.io', // Use the appropriate URI
    neo4j.auth.basic('neo4j', 'KMNBLaQUxja-ogjaIcGkZR82gVzmdxvniJN9DIUCUFk'),
  );
  
  

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key';
const signToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '90d',
    });
};

// Use it for verifying tokens
const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};

exports.signup = async (req, res) => {
    const { name, email, password, department , role = 'Student' } = req.body;

    // Establish a session with Neo4j
    const session = driver.session();

    console.log(req.body, "req.body");

    try {
        // Hash the user's password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create a new user node in Neo4j with the role provided
        const result = await session.run(
            `CREATE (u:${role} {name: $name, email: $email, password: $password, Department : $department, role: $role})
            RETURN u`,
            { name, email, password: hashedPassword,department , role }
        );

        // Access the created user from the query result
        const user = result.records[0].get('u').properties;

        // Generate a JWT token for the user
        const token = signToken(user.email);

        // Send a success response to the client
        res.status(201).json({ status: 'success', token, data: user });
    } catch (err) {
        console.error('Error during signup:', err); // Log the error for debugging
        res.status(500).json({ status: 'error', message: 'Error creating user' });
    } finally {
        session.close(); // Close the session after completion
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log('Email:', email);
        const user = await findUserByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        }
        const token = signToken(user.email);
        res.status(200).json({ status: 'success', token, data: user });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ status: 'error', message: 'Error logging in' });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        await updateUser(email, { passwordResetToken: hashedToken, passwordResetExpires: Date.now() + 3600000 });

        res.status(200).json({ status: 'success', resetToken });
    } catch (err) {
        console.error('Error during forgot password:', err);
        res.status(500).json({ status: 'error', message: 'Error generating reset token' });
    }
};

exports.resetPassword = async (req, res) => {
    const { resetToken, newPassword, passwordConfirm } = req.body;

    // Establish a session with Neo4j
    const session = driver.session();

    try {
        // Hash the provided resetToken to compare it with the stored token in Neo4j
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        console.log('Hashed Token:', hashedToken);  // Log for debugging purposes

        // Query Neo4j to find the user by the hashed token
        const result = await session.run(
            `MATCH (u:User {passwordResetToken: $hashedToken})
            WHERE u.passwordResetExpires > timestamp()
            RETURN u`, 
            { hashedToken }
        );

        // If no user is found or the token has expired
        if (result.records.length === 0) {
            console.log('No user found or token expired');
            return res.status(400).json({ status: 'error', message: 'Token invalid or expired' });
        }

        const user = result.records[0].get('u'); // Access the user record

        // Check if the new password and confirm password match
        if (newPassword !== passwordConfirm) {
            console.log('Passwords do not match');
            return res.status(400).json({ status: 'error', message: 'Passwords do not match' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        console.log('Hashed new password:', hashedPassword); // Log for debugging purposes

        // Update the user's password in Neo4j and clear reset token fields
        await session.run(
            `MATCH (u:User {email: $email})
            SET u.password = $hashedPassword,
                u.passwordResetToken = NULL,
                u.passwordResetExpires = NULL
            RETURN u`,
            { email: user.properties.email, hashedPassword }
        );

        // Send a success response to the client
        res.status(200).json({
            status: 'success',
            message: 'Password updated successfully',
        });
    } catch (err) {
        console.error('Error during password reset:', err); // Log any error for debugging
        res.status(500).json({
            status: 'error',
            message: err.message || 'Error resetting password',
        });
    } finally {
        session.close(); // Always close the session after completion
    }
};