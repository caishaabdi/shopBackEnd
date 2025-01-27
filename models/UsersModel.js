const mongoose = require('mongoose');

// Define schema for the User model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: {
        type: String, required: true, unique: true,
        // match: [/@/, 'Please enter a valid email address'] // Only check for @ symbol in the email
    },
    password: { type: String, required: true },
    location: { type: String, required: true }
},
    {
        timestamps: true
    });

// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
