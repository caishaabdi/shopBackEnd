const User = require('../models/UsersModel'); // Import User model
const bcrypt = require('bcryptjs');

// Get a user by their ID from the JWT token
const getUser = async (req, res) => {
    try {
        // Retrieve the user based on the ID from the JWT token
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Destructure sensitive fields and return user data
        const { password, __v, updatedAt, createdAt, ...userData } = user._doc;
        res.status(200).json(userData);
    } catch (error) {
        console.error("Error retrieving user:", error);  // Log for debugging
        res.status(500).json({ message: error.message });
    }
};

// Delete a user by their ID from the JWT token
const deleteUser = async (req, res) => {
    try {
        // Retrieve the user based on the ID from the JWT token
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Delete the user from the database
        await User.findByIdAndDelete(req.user.id);
        res.status(200).json({ message: 'User successfully deleted.' });
    } catch (error) {
        console.error("Error deleting user:", error);  // Log for debugging
        res.status(500).json({ message: error.message });
    }
};

// Get all users from the database
const getAllUsers = async (req, res) => {
    try {
        // Retrieve all users from the database
        const users = await User.find();

        // If no users are found, return a message
        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        // Destructure sensitive fields (password, __v, etc.) from each user
        const usersData = users.map(user => {
            const { __v, updatedAt, createdAt, password, ...userData } = user._doc;
            return userData;
        });

        // Return the list of users
        res.status(200).json(usersData);
    } catch (error) {
        console.error("Error fetching users:", error);  // Log for debugging
        res.status(500).json({ message: "Failed to retrieve users", error: error.message });
    }
};

const updateUserDetails = async (req, res) => {
    try {
        // Retrieve the user based on the ID from the JWT token
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Extract the updates from the request body
        const { email, password, location, username } = req.body;

        // Object to hold valid updates
        const updates = {};

        // Update email if provided
        if (email) {
            updates.email = email;
        }
        if (username) {
            updates.username = username;
        }

        // Update password if provided
        if (password) {
            // Hash the password before saving
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.password = hashedPassword;
        }

        // Update location if provided
        if (location) {
            updates.location = location;
        }

        // If no fields to update, return an error
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No valid fields provided to update' });
        }

        // Update the user with the validated data
        const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
            new: true, // Return the updated user document
        });

        // Remove sensitive fields (password, createdAt, updatedAt)
        const { password: _, __v, updatedAt, createdAt, ...userData } = updatedUser._doc;

        // Respond with the updated user data
        res.status(200).json(userData);
    } catch (error) {
        console.error("Error updating user:", error);  // Log for debugging
        res.status(500).json({ message: error.message });
    }
};


module.exports = { getUser, deleteUser, getAllUsers, updateUserDetails };
