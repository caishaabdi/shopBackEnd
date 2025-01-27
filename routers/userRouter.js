const UserRouter = require('../controllers/user_conroller');
const { verifyToken } = require('../middleware/verifyToken');

const router = require('express').Router();


router.get('/', verifyToken, UserRouter.getUser)
router.delete('/', verifyToken, UserRouter.deleteUser)

module.exports = router
