const product_controller = require('../controllers/product_controller');

const router = require('express').Router();

router.post('/', product_controller.createProduct)
router.get('/', product_controller.getAllProducts)
router.get('/:id', product_controller.getProduct)
router.get('/search/:key', product_controller.searchProducts)

module.exports = router