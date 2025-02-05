const User = require("../models/UsersModel");
const jwt = require("jsonwebtoken");
const CryptoJs = require('crypto-js')
module.exports = {

    createUser: async (req, res) => {
        // Destructure the incoming data from the request body
        const { username, email, password, location } = req.body;

        // Basic validation to ensure required fields are present
        // if (!username || !email || !password || !location) {
        //     return res.status(400).json({ message: "All fields are required" });
        // }

        try {
            // Check if the user already exists (email is unique)
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists with this email" });
            }

            // Encrypt the password with CryptoJS
            const encryptedPassword = CryptoJs.AES.encrypt(password, process.env.SECRET).toString();


            // Hash the password when registering the user
            // const salt = await bcrypt.genSalt(10);
            // const hashedPassword = await bcrypt.hash(req.body.password, process.env.SECRET, salt);
            // Create new user
            const newUser = new User({
                username,
                email,
                password: encryptedPassword,  // Store the encrypted password
                location,
            });

            // Save user to the database
            await newUser.save();

            // Send success response
            res.status(201).json({ message: "User successfully created" });
        } catch (error) {
            console.error("Error creating user:", error);  // Log the error for debugging
            res.status(500).json({ message: "Failed to create user", error: error.message });
        }
    },

    loginUser: async (req, res) => {
        try {
            // Check if user exists by email
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(404).json("Could not find User");
            }

            // Decrypt the password
            const decryptedPass = CryptoJs.AES.decrypt(user.password, process.env.SECRET);
            const thePassword = decryptedPass.toString(CryptoJs.enc.Utf8);

            // Check if the password is correct
            if (thePassword !== req.body.password) {
                return res.status(401).json("Wrong password");
            }


            // In the login process, compare the hashed password
            // const isMatch = await bcrypt.compare(req.body.password, user.password);
            // if (!isMatch) {
            //     return res.status(401).json({ message: "Incorrect password" });
            // }

            // Generate JWT Token
            const userToken = jwt.sign(
                { id: user._id },
                process.env.JWT_SEC,
                { expiresIn: "30d" }
            );

            // Destructure the user to remove sensitive data
            const { password, __v, updatedAt, createdAt, ...others } = user._doc;

            // Return response with token and user data
            res.status(200).json({ ...others, token: userToken });
        } catch (error) {
            console.error("Error during login:", error);
            res.status(500).json("Failed to login, please check your credentials.");
        }
    }


}


