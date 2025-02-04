const jwt = require('jsonwebtoken');
const User = require('../models/UsersModel'); // Make sure the model path is correct

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['token']; // Correct way to access Authorization header

    if (authHeader) {
        const token = authHeader.split("Bearer ")[1]; // Get the token part after 'Bearer'

        if (!token) {
            return res.status(401).json({ message: "Token is missing" });
        }

        // Verify the token
        jwt.verify(token, process.env.JWT_SEC, async (err, user) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid or expired token' });
            }

            req.user = user; // Attach the user data to the request
            next(); // Proceed to the next middleware or route handler
        });
    } else {
        return res.status(401).json({ message: "Authentication token is required" });
    }
};


module.exports = { verifyToken };

