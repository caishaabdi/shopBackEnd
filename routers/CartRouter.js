const CartController = require('../controllers/cart_controller');
const { verifyToken } = require('../middleware/verifyToken');

const router = require('express').Router();


router.get('/find', verifyToken, CartController.getCart)
router.post('/', verifyToken, CartController.addCart)
router.delete('/:cartItem', verifyToken, CartController.deleteCartItem)

module.exports = router
