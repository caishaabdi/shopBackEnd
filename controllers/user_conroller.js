const User = require('../models/UsersModel')

module.exports = {
    // getUser: async (req, res) => {
    //     try {
    //         const user = await User.findById(req.user.id)
    //         const { password, __v, updatedAt, createdAt, ...userData } = user._doc; //destric 

    //         res.status(200).json(userData)
    //     } catch (error) {
    //         res.status(500).json(error)
    //     }
    // },

    getUser: async (req, res) => {
        try {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const { password, __v, updatedAt, createdAt, ...userData } = user._doc;
            res.status(200).json(userData);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            await User.findByIdAndDelete(req.user.id);
            res.status(200).json({ message: 'User successfully deleted.' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // deleteUser: async (req, res) => {

    //     try {
    //         await User.findByIdAndDelete(req.user.id)
    //         res.status(200).json("User Successfully Deleted.")
    //     } catch (error) {
    //         res.status(500).json(error)
    //     }
    // }
}