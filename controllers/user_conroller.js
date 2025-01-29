
const User = require('../models/UsersModel'); // Import User model

const getUser = async (req, res) => {
    try {
        // Retrieve user based on the ID from the JWT token
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Destructure sensitive fields and return user data
        const { password, __v, updatedAt, createdAt, ...userData } = user._doc;
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        // Retrieve user based on the ID from the JWT token
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Delete the user from the database
        await User.findByIdAndDelete(req.user.id);
        res.status(200).json({ message: 'User successfully deleted.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// New function to get all users
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
            const { __v, updatedAt, createdAt, ...userData } = user._doc;
            return userData;
        });

        // Return the list of users
        res.status(200).json(usersData);
    } catch (error) {
        console.error("Error fetching users:", error);  // Log for debugging
        res.status(500).json({ message: "Failed to retrieve users", error: error.message });
    }
};

module.exports = { getUser, deleteUser, getAllUsers };
