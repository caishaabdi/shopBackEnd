const UserController = require('../controllers/user_conroller');  // Import the controller
const { verifyToken } = require('../middleware/verifyToken');    // Verify token middleware

const router = require('express').Router();

// Define the route for getting the current user
router.get('/one', verifyToken, UserController.getUser);

// Define the route for deleting the current user
router.delete('/:id', verifyToken, UserController.deleteUser);

// Define the route for getting all users (protected route)
router.get('/all', verifyToken, UserController.getAllUsers);
router.put('/update', verifyToken, UserController.updateUserDetails);

module.exports = router;
