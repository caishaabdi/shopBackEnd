const jwt = require('jsonwebtoken');
const User = require('../models/UsersModel'); // Make sure the model path is correct

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization // Standard header field name for Authorization

    if (authHeader) {
        // Token is expected to be in the format "Bearer <token>"
        const token = authHeader.split("Bearer ")[1]; // This grabs the token after "Bearer"

        if (!token) {
            return res.status(401).json({ message: "Token is missing" }); // Return an error if token is missing
        }

        // Verify token using jwt.verify
        jwt.verify(token, process.env.JWT_SEC, async (err, user) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid or expired token' }); // Proper error message
            }

            req.user = user; // Store user info from token in the request object
            next(); // Call the next middleware in the stack
        });
    } else {
        return res.status(401).json({ message: "Authentication token is required" }); // Better error message when token is absent
    }
};

module.exports = { verifyToken };
