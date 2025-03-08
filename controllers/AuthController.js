// const User = require("../models/UsersModel");
// const jwt = require("jsonwebtoken");
// const CryptoJs = require('crypto-js');


// module.exports = {

//     registerUser: async (req, res) => {
//         // Destructure the incoming data from the request body
//         const { username, email, password, location } = req.body;

//         // Basic validation to ensure required fields are present
//         // if (!username || !email || !password || !location) {
//         //     return res.status(400).json({ message: "All fields are required" });
//         // }

//         try {
//             // Check if the user already exists (email is unique)
//             const existingUser = await User.findOne({ email });
//             if (existingUser) {
//                 return res.status(400).json({ message: "User already exists with this email" });
//             }

//             // Encrypt the password with CryptoJS
//             // const encryptedPassword = CryptoJs.AES.encrypt(password, process.env.SECRET).toString();


//             // Hash the password when registering the user
//             // const salt = await bcrypt.genSalt(10);
//             // const hashedPassword = await bcrypt.hash(req.body.password, process.env.SECRET, salt);
//             // Create new user
//             const newUser = new User({
//                 username,
//                 email,
//                 password,  // Store the encrypted password
//                 location,
//             });

//             // Save user to the database
//             await newUser.save();

//             // Send success response
//             res.status(201).json({ message: "User successfully created" });
//         } catch (error) {
//             console.error("Error creating user:", error);  // Log the error for debugging
//             res.status(500).json({ message: "Failed to create user", error: error.message });
//         }
//     },

//     loginUser: async (req, res) => {
//         try {
//             // Check if user exists by email
//             const { email } = req.body;
//             const user = await User.findOne({ email: email });
//             if (!user) {
//                 return res.status(404).json("Could not find User");
//             }

//             // Decrypt the password
//             const decryptedPass = CryptoJs.AES.decrypt(user.password, process.env.SECRET);
//             const thePassword = decryptedPass.toString(CryptoJs.enc.Utf8);

//             // Check if the password is correct
//             if (thePassword !== req.body.password) {
//                 return res.status(401).json("Wrong password");
//             }


//             // In the login process, compare the hashed password
//             // const isMatch = await bcrypt.compare(req.body.password, user.password);
//             // if (!isMatch) {
//             //     return res.status(401).json({ message: "Incorrect password" });
//             // }

//             // // Generate JWT Token
//             // const userToken = jwt.sign(
//             //     { id: user._id },
//             //     process.env.JWT_SEC,
//             //     { expiresIn: "30d" }
//             // );
//             // Token generation
//             const expiresIn = 7 * 24 * 60 * 60; // Token expires in 7 days
//             const token = jwt.sign({ _id: isUserExists._id }, process.env.JWT_SEC, { expiresIn });

//             // Set the token in a cookie (for client-side storage)
//             res.cookie('token', token, {
//                 httpOnly: true, // Makes the cookie accessible only via HTTP requests
//                 secure: false,  // Change to `true` in production for HTTPS
//                 maxAge: expiresIn * 1000 // Set the max age of the cookie (7 days)
//             });

//             // Destructure the user to remove sensitive data
//             const { password, __v, updatedAt, createdAt, ...others } = user._doc;

//             // Return response with token and user data
//             res.status(200).json({ ...others, token: userToken });
//         } catch (error) {
//             console.error("Error during login:", error);
//             res.status(500).json("Failed to login, please check your credentials.");
//         }
//     }
// }

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UsersModel'); // Import User model

// Register a new user
const registerUser = async (req, res) => {
    try {
        const { email, password, username, location } = req.body;

        // Check if the email or username already exists
        const isUserExists = await User.findOne({
            email // Checks if either email or username already exists
        });
        if (isUserExists) {
            return res.status(400).json("Email or username already exists");
        }

        // Hash the password before saving to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance
        const userInfo = new User({
            username,
            email,
            password: hashedPassword, // Save the hashed password
            location
        });

        // Save the user to the database
        const registeredUser = await userInfo.save();

        // Remove password before sending the response (security purpose)
        registeredUser.password = undefined;

        // Return a success response
        return res.status(201).json(registeredUser);
    } catch (err) {
        console.error("Error at registering user:", err.message);
        return res.status(500).json({ message: "Something went wrong: " + err.message });
    }
};

// Login a user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists by email
        const isUserExists = await User.findOne({ email }); // Ensure password field is included
        if (!isUserExists) {
            return res.status(400).json("Invalid email, please provide a valid email");
        }

        // Check if the password is correct
        const isPasswordCorrect = await bcrypt.compare(password, isUserExists.password);
        if (!isPasswordCorrect) {
            return res.status(400).json("Incorrect password");
        }

        // Token generation
        const expiresIn = 7 * 24 * 60 * 60; // Token expires in 7 days
        const token = jwt.sign({ _id: isUserExists._id }, process.env.JWT_SEC, { expiresIn });

        // Set the token in a cookie (for client-side storage)
        res.cookie('token', token, {
            httpOnly: true, // Makes the cookie accessible only via HTTP requests
            secure: false,  // Change to `true` in production for HTTPS
            maxAge: expiresIn * 1000 // Set the max age of the cookie (7 days)
        });

        // Remove password before sending the response
        isUserExists.password = undefined;

        // Send success response with user data (excluding password)
        return res.status(200).json({ ...isUserExists.toJSON(), expiresIn });
    } catch (err) {
        console.error("Error at LoginUser:", err);
        return res.status(400).json({ message: err.message });
    }
};

module.exports = { registerUser, loginUser };

