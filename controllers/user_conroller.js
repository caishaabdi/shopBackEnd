const bcrypt = require('bcryptjs');
const User = require('../models/UsersModel'); // Import User model

// Get a user by their ID from the JWT token
const getUser = async (req, res) => {
    try {
        // Retrieve the user based on the ID from the JWT token
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Destructure sensitive fields and return user data
        const { password, __v, updatedAt, createdAt, ...userData } = user._doc;
        res.status(200).json(userData); // Return user data without sensitive fields
    } catch (error) {
        console.error("Error retrieving user:", error);  // Log for debugging
        res.status(500).json({ message: "Error retrieving user", error: error.message });
    }
};

// Delete a user by their ID from the JWT token
const deleteUser = async (req, res) => {
    try {
        // Retrieve the user based on the ID from the JWT token
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete the user from the database
        await User.findByIdAndDelete(req.user._id);
        res.status(200).json({ message: 'User successfully deleted.' });
    } catch (error) {
        console.error("Error deleting user:", error);  // Log for debugging
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
};

// Get all users from the database
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});

        // Remove sensitive data from all users
        const usersData = users.map(user => {
            const { password, __v, updatedAt, createdAt, ...userData } = user._doc;
            return userData; // Return sanitized user data
        });

        res.status(200).json(usersData); // Sending the sanitized users data
    } catch (error) {
        console.error("Error fetching users:", error);  // Log for debugging
        res.status(500).json({ message: "Failed to retrieve users", error: error.message });
    }
};

// const getAllUsers = async (req, res) => {

//     try {
//         const users = await User.find({});
//         res.json(users);
//     } catch (error) {
//         res.json({ message: error.message });
//     }
// }

// Update user details
const updateUserDetails = async (req, res) => {
    const { username, email, password, location } = req.body;

    try {
        // Find the user by their ID from the request params (JWT token or URL param)
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        // Dynamically update fields based on what's provided in the request body
        if (username) user.username = username;
        if (email) user.email = email;
        if (location) user.location = location;

        // If a new password is provided, hash it and update
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        // Save the updated user
        const updatedUser = await user.save();

        // Remove sensitive fields (password, createdAt, updatedAt)
        updatedUser.password = undefined;

        // Send the updated user data
        res.status(200).json(updatedUser);

    } catch (error) {
        console.error("Error updating user:", error);  // Log for debugging
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
};

module.exports = { getUser, deleteUser, getAllUsers, updateUserDetails };


// const updateUserDetails = async (req, res) => {
//     try {
//         // Retrieve the user based on the ID from the JWT token
//         const user = await User.findById(req.user.id);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Extract the updates from the request body
//         const { email, password, location, username } = req.body;

//         // Object to hold valid updates
//         const updates = {};

//         // Update email if provided
//         if (email) {
//             updates.email = email;
//         }
//         if (username) {
//             updates.username = username;
//         }

//         // Update password if provided
//         if (password) {
//             // Hash the password before saving
//             const hashedPassword = await bcrypt.hash(password, 10);
//             updates.password = hashedPassword;
//         }

//         // Update location if provided
//         if (location) {
//             updates.location = location;
//         }

//         // If no fields to update, return an error
//         if (Object.keys(updates).length === 0) {
//             return res.status(400).json({ message: 'No valid fields provided to update' });
//         }

//         // Update the user with the validated data
//         const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
//             new: true, // Return the updated user document
//         });

//         // Remove sensitive fields (password, createdAt, updatedAt)
//         const { password: _, __v, updatedAt, createdAt, ...userData } = updatedUser._doc;

//         // Respond with the updated user data
//         res.status(200).json(userData);
//     } catch (error) {
//         console.error("Error updating user:", error);  // Log for debugging
//         res.status(500).json({ message: error.message });
//     }
// };


