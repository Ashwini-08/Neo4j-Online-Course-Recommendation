const jwt = require('jsonwebtoken');
const { findUserByEmail } = require('../models/userModel'); // Modify this to match your model structure

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key';

const protect = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ status: 'error', message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await findUserByEmail(decoded.id); // Assuming decoded.id is the email or user identifier

        if (!user) {
            return res.status(401).json({ status: 'error', message: 'User not found' });
        }

        req.user = user; // Attach user to request object
        next();
    } catch (error) {
        return res.status(401).json({ status: 'error', message: 'Token is not valid' });
    }
};

module.exports = protect;
