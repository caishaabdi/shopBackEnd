// const jwt = require('jsonwebtoken');
// const User = require('../models/UsersModel'); // Make sure the model path is correct

// const verifyToken = (req, res, next) => {
//     const authHeader = req.headers['token']; // Correct way to access Authorization header

//     if (authHeader) {
//         const token = authHeader.split("Bearer ")[1]; // Get the token part after 'Bearer'

//         if (!token) {
//             return res.status(401).json({ message: "Token is missing" });
//         }

//         // Verify the token
//         jwt.verify(token, process.env.JWT_SEC, async (err, user) => {
//             if (err) {
//                 return res.status(401).json({ message: 'Invalid or expired token' });
//             }

//             req.user = user; // Attach the user data to the request
//             next(); // Proceed to the next middleware or route handler
//         });
//     } else {
//         return res.status(401).json({ message: "Authentication token is required" });
//     }
// };


// module.exports = { verifyToken };

// const jwt = require('jsonwebtoken');

// const verifyToken = (req, res, next) => {
//     // Get token from the Authorization header
//     const authHeader = req.headers['authorization'];  // Correct way to access Authorization header

//     if (authHeader) {
//         // Split the header value to extract the token after 'Bearer '
//         const token = authHeader.split("Bearer ")[1];  // Get the token part after 'Bearer'

//         if (!token) {
//             return res.status(401).json({ message: "Token is missing" });
//         }

//         // Verify the token
//         jwt.verify(token, process.env.JWT_SEC, async (err, user) => {
//             if (err) {
//                 return res.status(401).json({ message: 'Invalid or expired token' });
//             }

//             // Attach the decoded user data to the request object
//             req.user = user;
//             next(); // Proceed to the next middleware or route handler
//         });
//     } else {
//         return res.status(401).json({ message: "Authentication token is required" });
//     }
// };

// module.exports = { verifyToken };


// Replace "export" with "module.exports"
// middleware/verifyToken.js

const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(403).send("Access denied, please login.");
    }

    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
        if (err) {
            return res.status(403).send("Token is not valid.");
        }
        req.user = user;
        next();
    });
};

module.exports = { verifyToken };


