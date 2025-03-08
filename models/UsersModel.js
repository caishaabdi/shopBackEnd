const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String, required: true
    },
    email: {
        type: String, required: true, unique: true,
    },
    password: {
        type: String, required: true
    },
    location: {
        type: String, required: false

    }
},
    {
        timestamps: true
    });


// // Pre-save middleware to hash the password before saving
// userSchema.pre("save", async function (next) {

//     // Check if the password field has been modified
//     if (!this.isModified("password")) return next();

//     // Generate a salt and hash the password
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next(); // Proceed to save the document
// });

// // Method to compare a given password with the hashed password in the database
// userSchema.methods.comparePassword = async function (givenPassword) {
//     return await bcrypt.compare(givenPassword, this.password);
// };

// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;
