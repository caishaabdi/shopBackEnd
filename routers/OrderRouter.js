const orderController = require('../controllers/orderController');
const { verifyToken } = require('../middleware/verifyToken');

const router = require('express').Router();


router.get('/', verifyToken, orderController.getUserOrder)

module.exports = router
